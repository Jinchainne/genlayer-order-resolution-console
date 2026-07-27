const policyForm = document.querySelector("#policyForm");
const workflowForm = document.querySelector("#workflowForm");
const policyOutput = document.querySelector("#policyOutput");
const workflowOutput = document.querySelector("#workflowOutput");
const verdictCard = document.querySelector("#verdictCard");
const contractAddressPill = document.querySelector("#contractAddressPill");

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
    policyOutput.textContent = error.message;
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
    verdictCard.className = "verdict verdict-deny";
    verdictCard.innerHTML = `<strong>Workflow failed</strong><span>${error.message}</span>`;
    workflowOutput.textContent = error.message;
  } finally {
    setBusy(workflowForm, false);
  }
});

loadConfig().catch((error) => {
  contractAddressPill.textContent = `Config error: ${error.message}`;
});
