# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json


class PolicyOracle(gl.Contract):
    policy_count: u64
    evaluation_count: u64
    policies: TreeMap[str, str]
    evaluations: TreeMap[str, str]

    def __init__(self):
        self.policy_count = 0
        self.evaluation_count = 0
        self.policies = TreeMap()
        self.evaluations = TreeMap()

    def _require_policy(self, policy_id: str) -> dict:
        raw = self.policies.get(policy_id)
        if raw is None:
            raise gl.UserError(f"Unknown policy_id: {policy_id}")
        return json.loads(raw)

    def _next_policy_id(self) -> str:
        next_id = int(self.policy_count) + 1
        return f"policy-{next_id}"

    def _next_evaluation_id(self) -> str:
        next_id = int(self.evaluation_count) + 1
        return f"evaluation-{next_id}"

    def _clean_urls(self, reference_urls_json: str) -> list[str]:
        if reference_urls_json.strip() == "":
            return []

        try:
            urls = json.loads(reference_urls_json)
        except Exception as exc:
            raise gl.UserError(f"reference_urls_json must be valid JSON: {exc}")

        if not isinstance(urls, list):
            raise gl.UserError("reference_urls_json must decode to a JSON array")

        cleaned: list[str] = []
        for item in urls:
            if not isinstance(item, str):
                raise gl.UserError("Each reference URL must be a string")
            item = item.strip()
            if item.startswith("http://") or item.startswith("https://"):
                cleaned.append(item)

        return cleaned[:3]

    def _normalize_result(self, response: dict) -> dict:
        if not isinstance(response, dict):
            raise gl.UserError(f"LLM returned non-dict: {type(response)}")

        decision = str(response.get("decision", "")).strip().lower()
        if decision not in ("allow", "deny", "undetermined"):
            raise gl.UserError(f"Invalid decision: {decision}")

        confidence = str(response.get("confidence", "medium")).strip().lower()
        if confidence not in ("high", "medium", "low"):
            confidence = "medium"

        raw_score = response.get("score", 0)
        try:
            score = int(round(float(str(raw_score).strip())))
        except Exception:
            raise gl.UserError(f"Invalid score: {raw_score}")

        if score < 0:
            score = 0
        if score > 100:
            score = 100

        reason = str(response.get("reason", "")).strip()
        if reason == "":
            raise gl.UserError("Missing reason")

        evidence_used = response.get("evidence_used", [])
        if not isinstance(evidence_used, list):
            evidence_used = []

        compact_evidence: list[str] = []
        for item in evidence_used[:5]:
            compact_evidence.append(str(item).strip())

        return {
            "decision": decision,
            "confidence": confidence,
            "score": score,
            "reason": reason,
            "evidence_used": compact_evidence,
        }

    @gl.public.write
    def create_policy(
        self,
        name: str,
        policy_text: str,
        criteria_text: str,
        category: str = "general",
    ) -> str:
        clean_name = name.strip()
        clean_policy = policy_text.strip()
        clean_criteria = criteria_text.strip()
        clean_category = category.strip() or "general"

        if clean_name == "":
            raise gl.UserError("Policy name cannot be empty")
        if clean_policy == "":
            raise gl.UserError("Policy text cannot be empty")
        if clean_criteria == "":
            raise gl.UserError("Criteria text cannot be empty")

        policy_id = self._next_policy_id()
        payload = {
            "policy_id": policy_id,
            "name": clean_name,
            "policy_text": clean_policy,
            "criteria_text": clean_criteria,
            "category": clean_category,
            "active": True,
            "creator": str(gl.message.sender_address),
        }

        self.policies[policy_id] = json.dumps(payload)
        self.policy_count = int(self.policy_count) + 1
        return policy_id

    @gl.public.write
    def set_policy_active(self, policy_id: str, active: bool) -> None:
        policy = self._require_policy(policy_id)
        if policy["creator"] != str(gl.message.sender_address):
            raise gl.UserError("Only the policy creator can update active status")
        policy["active"] = bool(active)
        self.policies[policy_id] = json.dumps(policy)

    @gl.public.write
    def evaluate(
        self,
        policy_id: str,
        subject: str,
        evidence_json: str,
        reference_urls_json: str = "[]",
    ) -> str:
        policy = self._require_policy(policy_id)
        if not policy["active"]:
            raise gl.UserError("Policy is inactive")

        clean_subject = subject.strip()
        clean_evidence = evidence_json.strip()

        if clean_subject == "":
            raise gl.UserError("Subject cannot be empty")
        if clean_evidence == "":
            raise gl.UserError("Evidence JSON cannot be empty")

        reference_urls = self._clean_urls(reference_urls_json)

        def nondet() -> dict:
            fetched_sources: list[dict] = []
            for url in reference_urls:
                page_text = gl.nondet.web.render(url, mode="text")
                fetched_sources.append(
                    {
                        "url": url,
                        "text_excerpt": str(page_text)[:4000],
                    }
                )

            prompt = f"""
You are evaluating whether a requested action complies with a policy.

Policy name:
{policy["name"]}

Policy category:
{policy["category"]}

Policy text:
{policy["policy_text"]}

Decision criteria:
{policy["criteria_text"]}

Subject:
{clean_subject}

Evidence JSON:
{clean_evidence}

Fetched reference sources:
{json.dumps(fetched_sources)}

Return a JSON object with exactly these keys:
{{
  "decision": "allow" | "deny" | "undetermined",
  "score": 0-100,
  "confidence": "high" | "medium" | "low",
  "reason": "short explanation grounded in the policy and evidence",
  "evidence_used": ["short bullet", "short bullet"]
}}

Rules:
- Follow the policy text, not general vibes.
- If the evidence is weak or ambiguous, return "undetermined".
- Do not invent evidence not present in the provided material.
- Keep reason concise and practical.
"""
            return gl.nondet.exec_prompt(prompt, response_format="json")

        result = gl.eq_principle.prompt_non_comparative(
            nondet,
            task="Evaluate whether a subject complies with a natural-language policy and return a structured policy verdict",
            criteria=(
                "The output is equivalent if it follows the policy text, uses the supplied evidence, "
                "returns a valid decision among allow/deny/undetermined, and provides a valid score and confidence. "
                "Minor wording differences in the reason are acceptable."
            ),
        )

        normalized = self._normalize_result(result)
        evaluation_id = self._next_evaluation_id()

        payload = {
            "evaluation_id": evaluation_id,
            "policy_id": policy_id,
            "subject": clean_subject,
            "evidence_json": clean_evidence,
            "reference_urls_json": json.dumps(reference_urls),
            "decision": normalized["decision"],
            "score": normalized["score"],
            "confidence": normalized["confidence"],
            "reason": normalized["reason"],
            "evidence_used": normalized["evidence_used"],
            "evaluator": str(gl.message.sender_address),
            "created_at": str(gl.message.datetime),
        }

        self.evaluations[evaluation_id] = json.dumps(payload)
        self.evaluation_count = int(self.evaluation_count) + 1
        return evaluation_id

    @gl.public.view
    def get_policy(self, policy_id: str) -> str:
        return self.policies.get(policy_id) or ""

    @gl.public.view
    def get_result(self, evaluation_id: str) -> str:
        return self.evaluations.get(evaluation_id) or ""

    @gl.public.view
    def is_allowed(self, evaluation_id: str) -> bool:
        raw = self.evaluations.get(evaluation_id)
        if raw is None:
            return False
        result = json.loads(raw)
        return result.get("decision") == "allow"

    @gl.public.view
    def get_counts(self) -> str:
        return json.dumps(
            {
                "policy_count": int(self.policy_count),
                "evaluation_count": int(self.evaluation_count),
            }
        )

