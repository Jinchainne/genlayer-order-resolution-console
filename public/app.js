const policyForm = document.querySelector("#policyForm");
const workflowForm = document.querySelector("#workflowForm");
const policyOutput = document.querySelector("#policyOutput");
const workflowOutput = document.querySelector("#workflowOutput");
const verdictCard = document.querySelector("#verdictCard");
const contractAddressPill = document.querySelector("#contractAddressPill");
const runtimeNotice = document.querySelector("#runtimeNotice");

let contractAddress = "";

function setBusy(form, busy) {
  const button = form.querySelector("button");
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
    `<strong>Remote RPC temporarily unavailable</strong><span>The live Vercel reviewer console loaded correctly, but the hosted runtime could not complete the GenLayer write flow for this request. Use the explorer proof links above or run the full workflow locally from the repo.</span>`;

  workflowOutput.textContent = [
    "Live fallback mode activated.",
    "",
    errorMessage,
    "",
    "Recorded proof bundle:",
    "- Contract: https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108",
    "- create_policy tx: https://explorer-studio.genlayer.com/tx/0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32",
    "- evaluate tx: https://explorer-studio.genlayer.com/tx/0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1",
  ].join("\n");

  runtimeNotice.innerHTML =
    `<strong>Runtime status</strong><span>Serverless RPC writes are failing right now, so the live site is showing reviewer-safe fallback guidance instead of a raw stack error.</span>`;
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

policyForm.querySelector("button").dataset.idleText = "Create Policy Onchain";
workflowForm.querySelector("button").dataset.idleText = "Evaluate And Gate Execution";

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
        "You can still verify the contract and past onchain evidence through the explorer links above.",
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

loadConfig().catch((error) => {
  contractAddressPill.textContent = `Config error: ${error.message}`;
});
