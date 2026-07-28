const DEFAULT_MIMO_API_URL = "https://api.xiaomimimo.com/v1/chat/completions";
const DEFAULT_MIMO_MODEL = "mimo-v2.5";
const DEFAULT_GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

const AI_PERSONAS = {
  mira: {
    key: "mira",
    label: "Mira Review",
    provider: "mimo",
    envKey: "MIMO_API_KEY",
    apiUrlEnv: "MIMO_API_URL",
    modelEnv: "MIMO_MODEL",
    defaultApiUrl: DEFAULT_MIMO_API_URL,
    defaultModel: DEFAULT_MIMO_MODEL,
    systemPrompt:
      "You are Mira Review, a careful GenLayer project reviewer assistant. Analyze project evidence and return strict JSON only. Focus on whether the project looks genuinely useful, has real GenLayer integration, and has enough proof for a reviewer. Do not use markdown fences.",
  },
  lexi: {
    key: "lexi",
    label: "Lexi Review",
    provider: "groq",
    envKey: "GROQ_API_KEY",
    apiUrlEnv: "GROQ_API_URL",
    modelEnv: "GROQ_MODEL",
    defaultApiUrl: DEFAULT_GROQ_API_URL,
    defaultModel: DEFAULT_GROQ_MODEL,
    systemPrompt:
      "You are Lexi Review, a fast but strict GenLayer project reviewer assistant. Analyze project evidence and return strict JSON only. Prioritize practical usefulness, real contract integration, workflow completeness, and proof quality. Do not use markdown fences.",
  },
};

function readEnv(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function hasEnv(name) {
  return Boolean(readEnv(name));
}

function requireEnv(name) {
  const value = readEnv(name);
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

function normalizePreJudgeResult(payload, fallbackBundle, persona) {
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
    persona: persona.key,
    personaLabel: persona.label,
    provider: persona.provider,
    model: persona.model,
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

function resolvePersona(requestedPersona = "") {
  const preferred = String(requestedPersona || readEnv("AI_PERSONA") || readEnv("AI_PROVIDER") || "auto")
    .trim()
    .toLowerCase();

  if (preferred && preferred !== "auto") {
    const persona = AI_PERSONAS[preferred];
    if (!persona) {
      throw new Error(`Unknown AI persona: ${preferred}`);
    }

    const apiKey = requireEnv(persona.envKey);
    return {
      ...persona,
      apiKey,
      apiUrl: readEnv(persona.apiUrlEnv) || persona.defaultApiUrl,
      model: readEnv(persona.modelEnv) || persona.defaultModel,
    };
  }

  if (hasEnv(AI_PERSONAS.lexi.envKey)) {
    return {
      ...AI_PERSONAS.lexi,
      apiKey: requireEnv(AI_PERSONAS.lexi.envKey),
      apiUrl: readEnv(AI_PERSONAS.lexi.apiUrlEnv) || AI_PERSONAS.lexi.defaultApiUrl,
      model: readEnv(AI_PERSONAS.lexi.modelEnv) || AI_PERSONAS.lexi.defaultModel,
    };
  }

  if (hasEnv(AI_PERSONAS.mira.envKey)) {
    return {
      ...AI_PERSONAS.mira,
      apiKey: requireEnv(AI_PERSONAS.mira.envKey),
      apiUrl: readEnv(AI_PERSONAS.mira.apiUrlEnv) || AI_PERSONAS.mira.defaultApiUrl,
      model: readEnv(AI_PERSONAS.mira.modelEnv) || AI_PERSONAS.mira.defaultModel,
    };
  }

  throw new Error("Missing AI credentials. Configure GROQ_API_KEY or MIMO_API_KEY.");
}

async function requestChatCompletion(persona, bundle) {
  const response = await fetch(persona.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${persona.apiKey}`,
    },
    body: JSON.stringify({
      model: persona.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: persona.systemPrompt,
        },
        {
          role: "user",
          content: [
            `Review this project bundle as ${persona.label} and produce a pre-judge result.`,
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
    throw new Error(`${persona.label} API request failed with ${response.status}: ${text}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(`${persona.label} returned an empty completion.`);
  }

  return normalizePreJudgeResult(extractJson(content), bundle, persona);
}

export async function runAiPreJudge(bundle, options = {}) {
  const persona = resolvePersona(options.persona);
  return requestChatCompletion(persona, bundle);
}
