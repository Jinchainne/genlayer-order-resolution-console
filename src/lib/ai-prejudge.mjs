const DEFAULT_MIMO_API_URL = "https://api.xiaomimimo.com/v1/chat/completions";
const DEFAULT_MIMO_MODEL = "mimo-v2.5";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(trimmed.slice(first, last + 1));
    }
    throw new Error("AI response did not contain valid JSON.");
  }
}

function normalizePreJudgeResult(payload, fallbackBundle) {
  const verdict = String(payload.preliminaryVerdict || "undetermined").toLowerCase();
  const confidence = String(payload.confidence || "medium").toLowerCase();
  const reasons = Array.isArray(payload.reasons) ? payload.reasons.map((item) => String(item)) : [];
  const improvedClaims = Array.isArray(payload.improvedClaims)
    ? payload.improvedClaims.map((item) => String(item))
    : fallbackBundle.evidence.claims;
  const improvedReferenceUrls = Array.isArray(payload.improvedReferenceUrls)
    ? payload.improvedReferenceUrls.map((item) => String(item))
    : fallbackBundle.referenceUrls;

  return {
    preliminaryVerdict: ["allow", "deny", "undetermined"].includes(verdict) ? verdict : "undetermined",
    confidence: ["high", "medium", "low"].includes(confidence) ? confidence : "medium",
    summary: String(payload.summary || "").trim(),
    reasons,
    missingEvidence: Array.isArray(payload.missingEvidence)
      ? payload.missingEvidence.map((item) => String(item))
      : [],
    improvedSubject: String(payload.improvedSubject || fallbackBundle.subject).trim(),
    improvedClaims,
    improvedReferenceUrls,
    reviewerNotes: String(payload.reviewerNotes || fallbackBundle.evidence.reviewNotes || "").trim(),
  };
}

export async function runAiPreJudge(bundle) {
  const apiKey = requireEnv("MIMO_API_KEY");
  const apiUrl = process.env.MIMO_API_URL || DEFAULT_MIMO_API_URL;
  const model = process.env.MIMO_MODEL || DEFAULT_MIMO_MODEL;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a GenLayer builder project reviewer assistant. Analyze project evidence and return strict JSON only. Focus on whether the project looks genuinely useful, has real GenLayer integration, and has enough proof for a reviewer. Do not use markdown fences.",
        },
        {
          role: "user",
          content: [
            "Review this project bundle and produce a pre-judge result.",
            "",
            "Return exactly one JSON object with these keys:",
            "{",
            '  "preliminaryVerdict": "allow" | "deny" | "undetermined",',
            '  "confidence": "high" | "medium" | "low",',
            '  "summary": "short summary",',
            '  "reasons": ["reason 1", "reason 2"],',
            '  "missingEvidence": ["gap 1", "gap 2"],',
            '  "improvedSubject": "improved submission subject",',
            '  "improvedClaims": ["claim 1", "claim 2"],',
            '  "improvedReferenceUrls": ["https://..."],',
            '  "reviewerNotes": "better review notes for the bundle"',
            "}",
            "",
            "Bundle JSON:",
            JSON.stringify(bundle, null, 2),
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MiMo API request failed with ${response.status}: ${text}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("MiMo API returned an empty completion.");
  }

  return normalizePreJudgeResult(extractJson(content), bundle);
}
