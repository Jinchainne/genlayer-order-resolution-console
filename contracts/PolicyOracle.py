# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json


class PolicyOracle(gl.Contract):
    policy_count: u64
    evaluation_count: u64
    case_count: u64
    revision_count: u64
    policies: TreeMap[str, str]
    evaluations: TreeMap[str, str]
    cases: TreeMap[str, str]
    revisions: TreeMap[str, str]

    def __init__(self):
        self.policy_count = 0
        self.evaluation_count = 0
        self.case_count = 0
        self.revision_count = 0
        self.policies = TreeMap()
        self.evaluations = TreeMap()
        self.cases = TreeMap()
        self.revisions = TreeMap()

    # ── Helpers ──

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

    def _next_case_id(self) -> str:
        next_id = int(self.case_count) + 1
        return f"case-{next_id}"

    def _next_revision_id(self) -> str:
        next_id = int(self.revision_count) + 1
        return f"rev-{next_id}"

    def _normalize_json_text(self, value) -> str:
        if isinstance(value, str):
            return value.strip()
        try:
            return json.dumps(value)
        except Exception as exc:
            raise gl.UserError(f"Value is not JSON serializable: {exc}")

    def _clean_urls(self, urls_input) -> list[str]:
        if isinstance(urls_input, list):
            urls = urls_input
        else:
            text = self._normalize_json_text(urls_input)
            if text == "":
                return []
            try:
                urls = json.loads(text)
            except Exception as exc:
                raise gl.UserError(f"urls must be valid JSON: {exc}")

        if not isinstance(urls, list):
            raise gl.UserError("urls must decode to a JSON array")

        cleaned: list[str] = []
        for item in urls:
            if not isinstance(item, str):
                continue
            item = item.strip()
            if item.startswith("http://") or item.startswith("https://"):
                cleaned.append(item)
        return cleaned[:10]

    def _normalize_evidence_text(self, evidence_json) -> str:
        if isinstance(evidence_json, str):
            clean = evidence_json.strip()
            if clean == "":
                raise gl.UserError("Evidence JSON cannot be empty")
            return clean
        if isinstance(evidence_json, dict) or isinstance(evidence_json, list):
            return json.dumps(evidence_json)
        raise gl.UserError("Evidence must be a JSON string, object, or array")

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
        score = max(0, min(100, score))

        reason = str(response.get("reason", "")).strip()
        if reason == "":
            raise gl.UserError("Missing reason")

        evidence_used = response.get("evidence_used", [])
        if not isinstance(evidence_used, list):
            evidence_used = []

        compact_evidence: list[str] = []
        for item in evidence_used[:8]:
            compact_evidence.append(str(item).strip())

        fetched_sources = response.get("fetched_sources", [])
        if not isinstance(fetched_sources, list):
            fetched_sources = []

        return {
            "decision": decision,
            "confidence": confidence,
            "score": score,
            "reason": reason,
            "evidence_used": compact_evidence,
            "fetched_sources": fetched_sources[:5],
        }

    def _confidence_rank(self, confidence: str) -> int:
        if confidence == "low":
            return 1
        if confidence == "medium":
            return 2
        return 3

    def _parse_disagreements(self, disagreements_input) -> list[str]:
        if isinstance(disagreements_input, list):
            return [str(d).strip() for d in disagreements_input if str(d).strip()][:10]
        if isinstance(disagreements_input, str):
            text = disagreements_input.strip()
            if not text:
                return []
            try:
                parsed = json.loads(text)
                if isinstance(parsed, list):
                    return [str(d).strip() for d in parsed if str(d).strip()][:10]
            except Exception:
                pass
            return [line.strip() for line in text.split("\n") if line.strip()][:10]
        return []

    # ── Public: Create Policy ──

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

    # ── Public: Evaluate (core on-chain resolution) ──

    @gl.public.write
    def evaluate(
        self,
        policy_id: str,
        subject: str,
        evidence_json: str,
        reference_urls_json: str = "[]",
        disagreements_json: str = "[]",
    ) -> str:
        policy = self._require_policy(policy_id)
        if not policy["active"]:
            raise gl.UserError("Policy is inactive")

        clean_subject = subject.strip()
        clean_evidence = self._normalize_evidence_text(evidence_json)
        if clean_subject == "":
            raise gl.UserError("Subject cannot be empty")

        reference_urls = self._clean_urls(reference_urls_json)
        disagreements = self._parse_disagreements(disagreements_json)

        def leader_fn() -> dict:
            # Step 1: Fetch authoritative sources on-chain
            fetched_sources: list[dict] = []
            for url in reference_urls:
                try:
                    page_text = gl.nondet.web.render(url, mode="text")
                    fetched_sources.append({
                        "url": url,
                        "content": str(page_text)[:3000],
                        "status": "fetched",
                    })
                except Exception as exc:
                    fetched_sources.append({
                        "url": url,
                        "content": "",
                        "status": f"error: {str(exc)[:200]}",
                    })

            # Step 2: Build evaluation prompt with fetched evidence + disagreements
            disagreements_text = "No disagreements recorded."
            if disagreements:
                disagreements_text = "\n".join(f"- {d}" for d in disagreements)

            fetched_text = "No sources fetched."
            if fetched_sources:
                parts = []
                for src in fetched_sources:
                    if src["status"] == "fetched":
                        parts.append(f"SOURCE [{src['url']}]:\n{src['content']}")
                    else:
                        parts.append(f"SOURCE [{src['url']}]: FAILED ({src['status']})")
                fetched_text = "\n\n".join(parts)

            prompt = f"""You are a dispute resolution evaluator on GenLayer.

POLICY:
Name: {policy['name']}
Category: {policy['category']}
Text: {policy['policy_text']}
Criteria: {policy['criteria_text']}

CASE SUBJECT:
{clean_subject}

STRUCTURED EVIDENCE (from case file):
{clean_evidence}

DISAGREEMENT POINTS (what the parties cannot agree on):
{disagreements_text}

FETCHED AUTHORITATIVE SOURCES (independently retrieved on-chain):
{fetched_text}

INSTRUCTIONS:
1. Evaluate the case against the policy criteria.
2. Cross-reference the structured evidence against the fetched authoritative sources.
3. Check if the fetched sources confirm or contradict the claims in the evidence.
4. Consider the disagreement points — which side has stronger support from authoritative data?
5. Return a verdict: "allow" (claims supported), "deny" (claims not supported), or "undetermined" (insufficient evidence).

Return a JSON object:
{{
  "decision": "allow" | "deny" | "undetermined",
  "score": 0-100,
  "confidence": "high" | "medium" | "low",
  "reason": "concise explanation grounded in policy, evidence, and fetched sources",
  "evidence_used": ["bullet 1", "bullet 2"],
  "fetched_sources": ["source 1 summary", "source 2 summary"]
}}

Rules:
- Follow the policy text, not general vibes.
- If fetched sources contradict the claims, lean toward "deny" or "undetermined".
- If evidence is weak or ambiguous, return "undetermined".
- Do not invent evidence not present in the provided material.
- Keep reason concise and practical."""

            response = gl.nondet.exec_prompt(prompt, response_format="json")
            return self._normalize_result(response)

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False

            my_result = leader_fn()
            other = leader_result.calldata
            if not isinstance(other, dict):
                return False

            # Must agree on decision
            if my_result["decision"] != other.get("decision"):
                return False

            # Confidence within 1 rank
            other_confidence = str(other.get("confidence", "medium")).strip().lower()
            if abs(self._confidence_rank(my_result["confidence"]) - self._confidence_rank(other_confidence)) > 1:
                return False

            # Score within 20 points
            try:
                other_score = int(other.get("score", 0))
            except Exception:
                return False
            if abs(my_result["score"] - other_score) > 20:
                return False

            return True

        result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        normalized = self._normalize_result(result)
        evaluation_id = self._next_evaluation_id()

        payload = {
            "evaluation_id": evaluation_id,
            "policy_id": policy_id,
            "subject": clean_subject,
            "evidence_json": clean_evidence,
            "reference_urls_json": json.dumps(reference_urls),
            "disagreements": disagreements,
            "decision": normalized["decision"],
            "score": normalized["score"],
            "confidence": normalized["confidence"],
            "reason": normalized["reason"],
            "evidence_used": normalized["evidence_used"],
            "fetched_sources": normalized.get("fetched_sources", []),
            "evaluator": str(gl.message.sender_address),
            "created_at": "runtime-unavailable",
        }

        self.evaluations[evaluation_id] = json.dumps(payload)
        self.evaluation_count = int(self.evaluation_count) + 1
        return evaluation_id

    # ── Public: Resolve Dispute (full end-to-end) ──

    @gl.public.write
    def resolve_dispute(
        self,
        case_id: str,
        policy_id: str,
        subject: str,
        evidence_json: str,
        reference_urls_json: str = "[]",
        disagreements_json: str = "[]",
    ) -> str:
        """Full dispute resolution: evaluate + store case record + create revision."""
        clean_case_id = case_id.strip()
        if not clean_case_id:
            raise gl.UserError("Case ID cannot be empty")

        # Run evaluation
        evaluation_id = self.evaluate(
            policy_id, subject, evidence_json, reference_urls_json, disagreements_json
        )

        # Read back the evaluation result
        raw = self.evaluations.get(evaluation_id)
        if raw is None:
            raise gl.UserError("Evaluation failed")
        eval_result = json.loads(raw)

        # Create revision record (immutable link)
        revision_id = self._next_revision_id()
        revision_record = {
            "revision_id": revision_id,
            "case_id": clean_case_id,
            "evaluation_id": evaluation_id,
            "revision_type": "initial",
            "parent_revision": "",
            "evidence_json": self._normalize_evidence_text(evidence_json),
            "disagreements": self._parse_disagreements(disagreements_json),
            "decision": eval_result["decision"],
            "score": eval_result["score"],
            "confidence": eval_result["confidence"],
            "reason": eval_result["reason"],
            "author": str(gl.message.sender_address),
        }
        self.revisions[revision_id] = json.dumps(revision_record)
        self.revision_count = int(self.revision_count) + 1

        # Store case resolution record with revision link
        case_record = {
            "case_id": clean_case_id,
            "evaluation_id": evaluation_id,
            "current_revision": revision_id,
            "revision_chain": [revision_id],
            "decision": eval_result["decision"],
            "score": eval_result["score"],
            "confidence": eval_result["confidence"],
            "reason": eval_result["reason"],
            "resolved_by": str(gl.message.sender_address),
            "appeal_count": 0,
        }
        self.cases[clean_case_id] = json.dumps(case_record)
        self.case_count = int(self.case_count) + 1

        return evaluation_id

    @gl.public.write
    def appeal_case(
        self,
        case_id: str,
        policy_id: str,
        subject: str,
        counter_evidence_json: str,
        reference_urls_json: str = "[]",
        disagreements_json: str = "[]",
    ) -> str:
        """Appeal an existing case: create new revision linked to parent."""
        clean_case_id = case_id.strip()
        raw = self.cases.get(clean_case_id)
        if raw is None:
            raise gl.UserError("CASE_NOT_FOUND")
        parent_case = json.loads(raw)

        # Run new evaluation with counter-evidence
        evaluation_id = self.evaluate(
            policy_id, subject, counter_evidence_json, reference_urls_json, disagreements_json
        )

        eval_raw = self.evaluations.get(evaluation_id)
        if eval_raw is None:
            raise gl.UserError("Evaluation failed")
        eval_result = json.loads(eval_raw)

        # Create new revision linked to parent
        parent_revision = parent_case.get("current_revision", "")
        revision_id = self._next_revision_id()
        revision_record = {
            "revision_id": revision_id,
            "case_id": clean_case_id,
            "evaluation_id": evaluation_id,
            "revision_type": "appeal",
            "parent_revision": parent_revision,
            "evidence_json": self._normalize_evidence_text(counter_evidence_json),
            "disagreements": self._parse_disagreements(disagreements_json),
            "decision": eval_result["decision"],
            "score": eval_result["score"],
            "confidence": eval_result["confidence"],
            "reason": eval_result["reason"],
            "author": str(gl.message.sender_address),
        }
        self.revisions[revision_id] = json.dumps(revision_record)
        self.revision_count = int(self.revision_count) + 1

        # Update case with new revision
        chain = parent_case.get("revision_chain", [])
        chain.append(revision_id)
        parent_case["current_revision"] = revision_id
        parent_case["revision_chain"] = chain
        parent_case["decision"] = eval_result["decision"]
        parent_case["score"] = eval_result["score"]
        parent_case["confidence"] = eval_result["confidence"]
        parent_case["reason"] = eval_result["reason"]
        parent_case["appeal_count"] = int(parent_case.get("appeal_count", 0)) + 1
        self.cases[clean_case_id] = json.dumps(parent_case)

        return evaluation_id

    # ── View Functions ──

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
    def get_case(self, case_id: str) -> str:
        return self.cases.get(case_id) or ""

    @gl.public.view
    def get_revision(self, revision_id: str) -> str:
        return self.revisions.get(revision_id) or ""

    @gl.public.view
    def get_revision_chain(self, case_id: str) -> str:
        """Return the full revision chain for a case."""
        raw = self.cases.get(case_id)
        if raw is None:
            return json.dumps([])
        case = json.loads(raw)
        chain = case.get("revision_chain", [])
        revisions = []
        for rid in chain:
            rev_raw = self.revisions.get(rid)
            if rev_raw:
                revisions.append(json.loads(rev_raw))
        return json.dumps(revisions)

    @gl.public.view
    def get_counts(self) -> str:
        return json.dumps({
            "policy_count": int(self.policy_count),
            "evaluation_count": int(self.evaluation_count),
            "case_count": int(self.case_count),
            "revision_count": int(self.revision_count),
        })
