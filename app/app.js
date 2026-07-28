const builderForm = document.querySelector("#builderForm");
const policyForm = document.querySelector("#policyForm");
const workflowForm = document.querySelector("#workflowForm");
const policyOutput = document.querySelector("#policyOutput");
const workflowOutput = document.querySelector("#workflowOutput");
const verdictCard = document.querySelector("#verdictCard");
const contractAddressPill = document.querySelector("#contractAddressPill");
const runtimeNotice = document.querySelector("#runtimeNotice");
const generatedSubject = document.querySelector("#generatedSubject");
const generatedEvidence = document.querySelector("#generatedEvidence");
const generatedReferences = document.querySelector("#generatedReferences");
const aiPreJudgeOutput = document.querySelector("#aiPreJudgeOutput");
const recentRuns = document.querySelector("#recentRuns");
const applyBundleButton = document.querySelector("#applyBundleButton");
const loadDemoButton = document.querySelector("#loadDemoButton");
const aiPreJudgeButton = document.querySelector("#aiPreJudgeButton");

const STORAGE_KEY = "policyoracle-recent-runs-v1";

const TEMPLATE_PRESETS = {
  "project-review": {
    subject:
      "A builder uses {projectName} as a live workflow tool to review project evidence, store policy decisions on GenLayer, and control downstream execution.",
    claims: [
      "real GenLayer integration",
      "live application-to-contract workflow",
      "policy-gated execution",
      "useful builder tool",
    ],
    notes:
      "This project provides a live web tool for creating reusable policies, evaluating evidence onchain, and turning policy outcomes into execution decisions.",
  },
  "grant-approval": {
    subject:
      "A team uses {projectName} to review grant evidence, store approval logic on GenLayer, and unlock or hold funding actions from a live workflow console.",
    claims: [
      "grant review automation",
      "GenLayer consensus evaluation",
      "approval gating",
      "useful operations tool",
    ],
    notes:
      "The tool helps operators review evidence, run policy checks onchain, and gate approval actions through a reusable workflow.",
  },
  "contribution-screening": {
    subject:
      "A builder uses {projectName} to screen contribution evidence, record reusable review policies on GenLayer, and route actions based on the verdict.",
    claims: [
      "contribution screening",
      "real contract reads and writes",
      "workflow automation",
      "evidence-based decisions",
    ],
    notes:
      "The project works as an evidence review tool that structures proof, runs a GenLayer evaluation, and maps the verdict to downstream execution.",
  },
  "moderation-gate": {
    subject:
      "An operator uses {projectName} to review flagged content evidence, run policy decisions on GenLayer, and block or allow actions through a live moderation workflow.",
    claims: [
      "moderation workflow",
      "policy evaluation onchain",
      "execution control",
      "reusable review tool",
    ],
    notes:
      "The tool supports repeatable moderation reviews with reusable policies, evidence bundles, and execution gating tied to GenLayer verdicts.",
  },
};

let contractAddress = "";
let latestBundle = null;

function setBusy(form, busy) {
  const button = form.querySelector("button[type='submit']");
  button.disabled = busy;
  button.textContent = busy ? "Working..." : button.dataset.idleText;
}

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

function parseJsonField(value, fallbackLabel) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid ${fallbackLabel}: ${error.message}`);
  }
}

function listFromMultiline(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function compactUrls(urls) {
  return urls.filter((url) => typeof url === "string" && url.trim() !== "");
}

function loadRecentRuns() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentRun(entry) {
  const current = loadRecentRuns();
  const next = [entry, ...current].slice(0, 6);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  renderRecentRuns();
}

function renderRecentRuns() {
  const runs = loadRecentRuns();
  if (!runs.length) {
    recentRuns.innerHTML =
      `<p class="empty-state">No recent reviews yet. Generate a bundle or run the workflow to build your review history.</p>`;
    return;
  }

  recentRuns.innerHTML = runs
    .map(
      (run, index) => `
        <article class="recent-card">
          <div class="recent-head">
            <strong>${run.projectName}</strong>
            <span>${run.timestamp}</span>
          </div>
          <p>${run.subject}</p>
          <div class="recent-meta">
            <span class="pill">${run.executionStatus}</span>
            <span class="pill">${run.nextAction}</span>
            <span class="pill">${run.evaluationId || "generated bundle"}</span>
          </div>
          <div class="recent-actions">
            <button type="button" class="button-secondary" data-reuse-index="${index}">Reuse Bundle</button>
          </div>
        </article>
      `,
    )
    .join("");

  recentRuns.querySelectorAll("[data-reuse-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const run = runs[Number(button.dataset.reuseIndex)];
      applyBundleToWorkflow(run.bundle);
    });
  });
}

function updateVerdictCard(data) {
  verdictCard.className = "verdict";

  if (data.blockedByPolicy) {
    verdictCard.classList.add("verdict-deny");
    verdictCard.innerHTML =
      `<strong>Execution blocked</strong><span>Policy verdict prevented unlock. Next action: ${data.nextAction}</span>`;
    return;
  }

  verdictCard.classList.add("verdict-allow");
  verdictCard.innerHTML =
    `<strong>Execution unlocked</strong><span>Policy verdict allowed the workflow. Next action: ${data.nextAction}</span>`;
}

function showRpcFallback(errorMessage) {
  verdictCard.className = "verdict verdict-waiting";
  verdictCard.innerHTML =
    `<strong>Remote RPC temporarily unavailable</strong><span>The hosted runtime could not complete the GenLayer write flow for this request. Use the explorer proof links above or rerun locally from the repo.</span>`;

  workflowOutput.textContent = [
    "Live fallback mode activated.",
    "",
    errorMessage,
    "",
    "Recorded proof bundle:",
    "- Contract: https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108",
    "- create_policy tx: https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083",
    "- evaluate tx: https://explorer-studio.genlayer.com/tx/0x3b61a808f6e2bcb27cfc75fe88d5cf68bab600427e5bacaf64a19a385fa73c59",
    "- workflow tx: https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121",
  ].join("\n");
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return payload;
}

async function loadConfig() {
  const config = await fetchJson("/api/config");
  contractAddress = config.contractAddress || "";
  contractAddressPill.textContent = contractAddress
    ? `Contract: ${contractAddress}`
    : "Contract: missing POLICY_ORACLE_ADDRESS";
}

function buildBundle() {
  const form = new FormData(builderForm);
  const templateKey = form.get("template");
  const template = TEMPLATE_PRESETS[templateKey];
  const projectName = String(form.get("projectName") || "").trim();
  const repoUrl = String(form.get("repoUrl") || "").trim();
  const liveApp = String(form.get("liveApp") || "").trim();
  const contractUrl = String(form.get("contractUrl") || "").trim();
  const deployTxUrl = String(form.get("deployTxUrl") || "").trim();
  const createPolicyTxUrl = String(form.get("createPolicyTxUrl") || "").trim();
  const evaluateTxUrl = String(form.get("evaluateTxUrl") || "").trim();
  const claims = listFromMultiline(String(form.get("claims") || ""));
  const reviewNotes = String(form.get("reviewNotes") || "").trim();

  const subject = template.subject.replaceAll("{projectName}", projectName || "this project");
  const evidence = {
    projectName,
    projectType: "live workflow tool",
    repoUrl,
    liveApp,
    contractExplorer: contractUrl,
    artifacts: [
      "repository",
      "live web app",
      "contract explorer",
      "deploy tx",
      "create_policy tx",
      "evaluate or workflow tx",
    ],
    claims: claims.length ? claims : template.claims,
    reviewNotes: reviewNotes || template.notes,
    txProofs: compactUrls([deployTxUrl, createPolicyTxUrl, evaluateTxUrl]),
  };

  const referenceUrls = compactUrls([
    repoUrl,
    liveApp,
    contractUrl,
    deployTxUrl,
    createPolicyTxUrl,
    evaluateTxUrl,
  ]);

  latestBundle = { subject, evidence, referenceUrls, projectName };
  generatedSubject.textContent = subject;
  generatedEvidence.textContent = pretty(evidence);
  generatedReferences.textContent = pretty(referenceUrls);

  saveRecentRun({
    projectName: projectName || "Untitled bundle",
    subject,
    executionStatus: "bundle-ready",
    nextAction: "apply_to_workflow",
    evaluationId: "",
    timestamp: new Date().toLocaleString(),
    bundle: latestBundle,
  });
}

function applyBundleToWorkflow(bundle = latestBundle) {
  if (!bundle) {
    throw new Error("Generate a review bundle first.");
  }

  workflowForm.elements.subject.value = bundle.subject;
  workflowForm.elements.evidence.value = pretty(bundle.evidence);
  workflowForm.elements.referenceUrls.value = pretty(bundle.referenceUrls);
  workflowOutput.textContent = "Bundle copied into the workflow form. Run evaluation when ready.";
}

async function runAiPreJudgeForBundle() {
  if (!latestBundle) {
    throw new Error("Generate a review bundle first.");
  }

  aiPreJudgeButton.disabled = true;
  aiPreJudgeButton.textContent = "Thinking...";

  try {
    const result = await fetchJson("/api/ai/prejudge", {
      method: "POST",
      body: JSON.stringify({ bundle: latestBundle }),
    });

    latestBundle = {
      ...latestBundle,
      subject: result.improvedSubject || latestBundle.subject,
      evidence: {
        ...latestBundle.evidence,
        claims: result.improvedClaims?.length ? result.improvedClaims : latestBundle.evidence.claims,
        reviewNotes: result.reviewerNotes || latestBundle.evidence.reviewNotes,
      },
      referenceUrls:
        result.improvedReferenceUrls?.length ? result.improvedReferenceUrls : latestBundle.referenceUrls,
    };

    generatedSubject.textContent = latestBundle.subject;
    generatedEvidence.textContent = pretty(latestBundle.evidence);
    generatedReferences.textContent = pretty(latestBundle.referenceUrls);
    aiPreJudgeOutput.textContent = pretty(result);
    applyBundleToWorkflow(latestBundle);

    saveRecentRun({
      projectName: latestBundle.projectName || latestBundle.evidence.projectName || "AI pre-judge",
      subject: latestBundle.subject,
      executionStatus: `ai-${result.preliminaryVerdict}`,
      nextAction: "review_before_genlayer",
      evaluationId: "",
      timestamp: new Date().toLocaleString(),
      bundle: latestBundle,
    });
  } finally {
    aiPreJudgeButton.disabled = false;
    aiPreJudgeButton.textContent = "AI Pre-Judge";
  }
}

function loadDemoBundle() {
  builderForm.elements.template.value = "project-review";
  builderForm.elements.projectName.value = "genlayer-policy-eco";
  builderForm.elements.repoUrl.value = "https://github.com/Jinchainne/genlayer-policy-eco";
  builderForm.elements.liveApp.value = "https://genlayer-policy-eco.vercel.app/";
  builderForm.elements.contractUrl.value =
    "https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108";
  builderForm.elements.deployTxUrl.value =
    "https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111";
  builderForm.elements.createPolicyTxUrl.value =
    "https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083";
  builderForm.elements.evaluateTxUrl.value =
    "https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121";
  builderForm.elements.claims.value = TEMPLATE_PRESETS["project-review"].claims.join("\n");
  builderForm.elements.reviewNotes.value = TEMPLATE_PRESETS["project-review"].notes;
  buildBundle();
}

policyForm.querySelector("button").dataset.idleText = "Create Policy Onchain";
workflowForm.querySelector("button").dataset.idleText = "Evaluate And Gate Execution";

builderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  buildBundle();
});

applyBundleButton.addEventListener("click", () => {
  try {
    applyBundleToWorkflow();
  } catch (error) {
    workflowOutput.textContent = error.message;
  }
});

loadDemoButton.addEventListener("click", loadDemoBundle);
aiPreJudgeButton.addEventListener("click", async () => {
  try {
    await runAiPreJudgeForBundle();
  } catch (error) {
    aiPreJudgeOutput.textContent = error.message;
  }
});

builderForm.elements.template.addEventListener("change", () => {
  const template = TEMPLATE_PRESETS[builderForm.elements.template.value];
  builderForm.elements.claims.value = template.claims.join("\n");
  builderForm.elements.reviewNotes.value = template.notes;
});

policyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setBusy(policyForm, true);

  try {
    const form = new FormData(policyForm);
    const payload = {
      contractAddress,
      name: form.get("name"),
      category: form.get("category"),
      policyText: form.get("policyText"),
      criteriaText: form.get("criteriaText"),
    };

    const result = await fetchJson("/api/policies", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    workflowForm.elements.policyId.value = result.policyId;
    policyOutput.textContent = pretty(result);
  } catch (error) {
    if (error.message.includes("GenLayer RPC error") || error.message.includes("fetch failed")) {
      policyOutput.textContent = [
        "Remote RPC temporarily unavailable.",
        "",
        error.message,
        "",
        "Use the live explorer proof links above or rerun from the local repo.",
      ].join("\n");
    } else {
      policyOutput.textContent = error.message;
    }
  } finally {
    setBusy(policyForm, false);
  }
});

workflowForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setBusy(workflowForm, true);

  try {
    const form = new FormData(workflowForm);
    const payload = {
      contractAddress,
      policyId: form.get("policyId"),
      subject: form.get("subject"),
      evidence: parseJsonField(form.get("evidence"), "evidence JSON"),
      referenceUrls: parseJsonField(form.get("referenceUrls"), "reference URLs JSON"),
    };

    const result = await fetchJson("/api/workflows/submission-gate", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    updateVerdictCard(result);
    workflowOutput.textContent = pretty(result);

    saveRecentRun({
      projectName: payload.evidence.projectName || "Workflow run",
      subject: payload.subject,
      executionStatus: result.executionStatus,
      nextAction: result.nextAction,
      evaluationId: result.evaluationId,
      timestamp: new Date().toLocaleString(),
      bundle: {
        subject: payload.subject,
        evidence: payload.evidence,
        referenceUrls: payload.referenceUrls,
        projectName: payload.evidence.projectName || "Workflow run",
      },
    });
  } catch (error) {
    if (error.message.includes("GenLayer RPC error") || error.message.includes("fetch failed")) {
      showRpcFallback(error.message);
    } else {
      verdictCard.className = "verdict verdict-deny";
      verdictCard.innerHTML = `<strong>Workflow failed</strong><span>${error.message}</span>`;
      workflowOutput.textContent = error.message;
    }
  } finally {
    setBusy(workflowForm, false);
  }
});

renderRecentRuns();
loadDemoBundle();
loadConfig().catch((error) => {
  contractAddressPill.textContent = `Config error: ${error.message}`;
});
