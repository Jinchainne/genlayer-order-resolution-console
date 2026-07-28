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
const aiPersona = document.querySelector("#aiPersona");
const caseQueue = document.querySelector("#caseQueue");
const caseCreateForm = document.querySelector("#caseCreateForm");
const activeCaseCount = document.querySelector("#activeCaseCount");
const recommendedAction = document.querySelector("#recommendedAction");
const recommendedActionReason = document.querySelector("#recommendedActionReason");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll(".tab-panel");

const caseTitle = document.querySelector("#caseTitle");
const caseSubtitle = document.querySelector("#caseSubtitle");
const orderNumber = document.querySelector("#orderNumber");
const orderMeta = document.querySelector("#orderMeta");
const riskAmount = document.querySelector("#riskAmount");
const riskMeta = document.querySelector("#riskMeta");
const claimType = document.querySelector("#claimType");
const claimStatus = document.querySelector("#claimStatus");
const buyerName = document.querySelector("#buyerName");
const buyerStatement = document.querySelector("#buyerStatement");
const sellerName = document.querySelector("#sellerName");
const sellerStatement = document.querySelector("#sellerStatement");
const resolutionWindow = document.querySelector("#resolutionWindow");
const caseTimeline = document.querySelector("#caseTimeline");
const authoritativeEvidence = document.querySelector("#authoritativeEvidence");
const evidenceCount = document.querySelector("#evidenceCount");
const disagreementList = document.querySelector("#disagreementList");
const buyerVault = document.querySelector("#buyerVault");
const sellerVault = document.querySelector("#sellerVault");
const authorityVault = document.querySelector("#authorityVault");
const buyerVaultCount = document.querySelector("#buyerVaultCount");
const sellerVaultCount = document.querySelector("#sellerVaultCount");
const authorityVaultCount = document.querySelector("#authorityVaultCount");
const vaultStatus = document.querySelector("#vaultStatus");
const decisionHistory = document.querySelector("#decisionHistory");

const STORAGE_KEY = "order-resolution-recent-runs-v2";
const HISTORY_STORAGE_KEY = "order-resolution-decision-history-v1";

let CASES = [
  {
    id: "ORD-2048",
    merchant: "NorthStar Grocery",
    buyer: "Olivia Carter",
    seller: "Merchant Resolution Desk",
    subject:
      "Buyer claims two paid grocery items were missing after delivery and requests a partial refund.",
    type: "missing-item",
    status: "awaiting resolution",
    amount: "248.00 USD",
    atRisk: "74.00 USD",
    paymentStatus: "paid by card",
    fulfillment: "delivered Jul 28, 2026 09:35",
    requestedAction: "partial refund",
    buyerStatement:
      "I received the delivery bag and invoice, but two paid items listed on the receipt were not inside. I reported the issue within 20 minutes of delivery.",
    sellerStatement:
      "The store packed the order using the correct SKU list and handed it to the courier. We have a packing note and dispatch scan, but no bag photo after seal.",
    buyerClaims: [
      "invoice amount matches charged order",
      "missing items were paid and listed on receipt",
      "support ticket opened immediately after delivery",
      "buyer uploaded unpacking photos",
    ],
    reviewNotes:
      "The case is suitable for partial refund analysis because payment is confirmed, delivery happened, and the disagreement centers on whether the missing items left the store.",
    references: {
      repoUrl: "https://github.com/Jinchainne/genlayer-policy-eco",
      liveApp: "https://genlayer-policy-eco.vercel.app/",
      contractUrl: "https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108",
      deployTxUrl: "https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111",
      createPolicyTxUrl: "https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083",
      evaluateTxUrl: "https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121",
    },
    timeline: [
      { time: "08:42", title: "Order paid", description: "Buyer completed wallet payment for the grocery cart." },
      { time: "09:02", title: "Packing completed", description: "Store marked all items as packed and dispatched to rider." },
      { time: "09:35", title: "Delivery completed", description: "Rider marked the order delivered at the buyer address." },
      { time: "09:55", title: "Buyer opened dispute", description: "Buyer reported two missing paid items with unpacking photos." },
    ],
    evidence: [
      { title: "Unpacking photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer uploaded photos of the opened bag showing two missing items." },
      { title: "Support ticket timestamp", side: "buyer", source: "support system", status: "time-verified", detail: "Complaint was opened 20 minutes after delivery." },
      { title: "Packing note", side: "seller", source: "store operations", status: "submitted", detail: "Picker checklist shows all items marked as included." },
      { title: "Dispatch scan", side: "seller", source: "merchant checkout", status: "submitted", detail: "Bag left the store under the expected route manifest." },
      { title: "Order invoice", side: "authority", source: "merchant checkout", status: "authoritative", detail: "Receipt lists all paid items and final amount." },
      { title: "Wallet payment confirmation", side: "authority", source: "payment ledger", status: "authoritative", detail: "Charge settled successfully before fulfillment." },
    ],
    disagreements: [
      "Buyer says unpacking photos show the sealed bag did not contain two paid items.",
      "Seller says store checklist indicates the missing items were packed.",
      "No post-seal bag photo exists to definitively settle whether the items left the store.",
    ],
  },
  {
    id: "ORD-2097",
    merchant: "Fresh Basket Market",
    buyer: "Daniel Brooks",
    seller: "Merchant Support Desk",
    subject:
      "Buyer says a refund was promised for spoiled produce but payment has not returned after 5 days.",
    type: "refund-delay",
    status: "evidence ready",
    amount: "312.00 USD",
    atRisk: "129.00 USD",
    paymentStatus: "card captured",
    fulfillment: "refund initiated Jul 24, 2026",
    requestedAction: "approve refund",
    buyerStatement:
      "Customer support confirmed the vegetables arrived spoiled and promised a refund, but the card charge still appears and no refund receipt has been sent.",
    sellerStatement:
      "The refund was marked internally, but operations need to confirm whether the payment processor actually created the refund transaction.",
    buyerClaims: [
      "support chat acknowledged spoilage",
      "refund promise was stated in writing",
      "buyer still does not see refund on payment method",
      "case depends on payment processor evidence",
    ],
    reviewNotes:
      "This is a strong refund verification case because the dispute depends on authoritative refund state rather than only narrative claims.",
    references: {
      repoUrl: "https://github.com/Jinchainne/genlayer-policy-eco",
      liveApp: "https://genlayer-policy-eco.vercel.app/",
      contractUrl: "https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108",
      deployTxUrl: "https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111",
      createPolicyTxUrl: "https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083",
      evaluateTxUrl: "https://explorer-studio.genlayer.com/tx/0x3b61a808f6e2bcb27cfc75fe88d5cf68bab600427e5bacaf64a19a385fa73c59",
    },
    timeline: [
      { time: "Jul 23", title: "Damaged goods reported", description: "Buyer submitted photos of spoiled vegetables." },
      { time: "Jul 23", title: "Support approved refund", description: "Merchant support promised reimbursement in chat." },
      { time: "Jul 24", title: "Internal refund marked", description: "Seller dashboard shows refund pending processor confirmation." },
      { time: "Jul 28", title: "Buyer reopened case", description: "Buyer still sees no refund settlement on card." },
    ],
    evidence: [
      { title: "Order photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Images show damaged produce condition at delivery time." },
      { title: "Card charge snapshot", side: "buyer", source: "buyer payment app", status: "submitted", detail: "Original charge still visible on buyer statement." },
      { title: "Internal refund status", side: "seller", source: "merchant ops", status: "pending-proof", detail: "Refund marked internally but no processor receipt attached." },
      { title: "Support chat log", side: "seller", source: "merchant CRM", status: "submitted", detail: "Merchant promised refund for spoiled produce." },
      { title: "Processor refund receipt", side: "authority", source: "payment processor", status: "missing", detail: "No authoritative refund settlement receipt has been attached yet." },
      { title: "Order settlement state", side: "authority", source: "payment ledger", status: "authoritative", detail: "Original payment settled successfully before refund review." },
    ],
    disagreements: [
      "Buyer believes refund was never actually sent.",
      "Seller believes refund may be pending outside the merchant dashboard.",
      "Authoritative refund receipt is missing, so case may remain undetermined until processor proof arrives.",
    ],
  },
  {
    id: "ORD-2114",
    merchant: "QuickCart Express",
    buyer: "Sofia Martinez",
    seller: "QuickCart Logistics",
    subject:
      "Buyer reports the delivered package contained a different order and contests the charge.",
    type: "wrong-order",
    status: "new",
    amount: "188.00 USD",
    atRisk: "188.00 USD",
    paymentStatus: "cashless prepaid",
    fulfillment: "delivered Jul 28, 2026 11:10",
    requestedAction: "full refund",
    buyerStatement:
      "The delivery bag had another household's items and did not match my receipt. I could not use any of the products and reported it immediately.",
    sellerStatement:
      "The rider route was busy and there may have been a bag handoff error, but the order was marked delivered correctly in the system.",
    buyerClaims: [
      "wrong order delivered",
      "receipt does not match bag contents",
      "buyer reported the issue immediately",
      "delivery handoff may have failed",
    ],
    reviewNotes:
      "This case tests whether the workflow can distinguish a wrong-order delivery from a non-delivery claim and recommend a full refund or escalation.",
    references: {
      repoUrl: "https://github.com/Jinchainne/genlayer-policy-eco",
      liveApp: "https://genlayer-policy-eco.vercel.app/",
      contractUrl: "https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108",
      deployTxUrl: "https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111",
      createPolicyTxUrl: "https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083",
      evaluateTxUrl: "https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121",
    },
    timeline: [
      { time: "10:18", title: "Order picked", description: "Picker completed preparation and assigned bag to rider." },
      { time: "10:40", title: "Rider departure", description: "Bag left store with multiple route stops." },
      { time: "11:10", title: "Delivery closed", description: "Order marked delivered successfully in logistics app." },
      { time: "11:17", title: "Wrong order reported", description: "Buyer submitted bag photos showing different item mix." },
    ],
    evidence: [
      { title: "Bag content photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Photo comparison shows mismatch between invoice and bag contents." },
      { title: "Support chat", side: "buyer", source: "support system", status: "time-verified", detail: "Buyer reported issue seven minutes after delivery." },
      { title: "Completion status", side: "seller", source: "merchant app", status: "submitted", detail: "System marked delivery successful despite mismatch report." },
      { title: "Rider route log", side: "seller", source: "delivery backend", status: "submitted", detail: "Rider handled multiple nearby drop-offs in the same window." },
      { title: "Order receipt", side: "authority", source: "merchant checkout", status: "authoritative", detail: "Receipt confirms expected order contents and full prepaid amount." },
      { title: "Route manifest check", side: "authority", source: "logistics backend", status: "needs-review", detail: "Delivery route suggests possible handoff confusion but not definitive proof." },
    ],
    disagreements: [
      "Buyer asserts complete mismatch and requests full refund.",
      "Seller suspects rider handoff error but lacks definitive proof of which bag reached the buyer.",
      "This case may require escalation if routing evidence and bag labels remain inconclusive.",
    ],
  },
];

const TEMPLATE_PRESETS = {
  "delivery-missing": {
    subject:
      "A buyer disputes a delivered order because paid items appear missing and requests a partial refund after the merchant marked fulfillment complete.",
    claims: [
      "buyer submitted missing-item claim",
      "seller submitted packing or dispatch response",
      "payment and invoice proof are available",
      "resolution needs evidence-based review",
    ],
    notes:
      "The dispute packet should compare the buyer claim against payment proof, receipt detail, and seller fulfillment records before deciding whether to approve a refund or escalate.",
  },
  "delivery-damaged": {
    subject:
      "A buyer requests compensation because delivered goods arrived damaged and the merchant must decide whether the evidence supports refund or replacement.",
    claims: [
      "buyer uploaded damage evidence",
      "seller has fulfillment and quality notes",
      "order and payment records are available",
      "decision depends on qualitative evidence",
    ],
    notes:
      "The packet should connect the damage report to delivery timing, product condition evidence, and merchant policy before the final GenLayer evaluation.",
  },
  "payment-refund": {
    subject:
      "A buyer says a promised refund has not settled and requests confirmation based on payment, support, and merchant records.",
    claims: [
      "refund promise exists in support records",
      "payment settlement status must be verified",
      "merchant response has been captured",
      "authoritative refund proof is central to the decision",
    ],
    notes:
      "The packet should fetch refund-related proof and determine whether the payment has actually been reversed or whether manual escalation is needed.",
  },
  "order-mismatch": {
    subject:
      "A buyer received the wrong delivered order and contests the charge, requiring the merchant and buyer records to be reconciled.",
    claims: [
      "receipt and delivered items do not match",
      "delivery logs exist",
      "buyer and seller statements conflict",
      "decision may lead to full refund or escalation",
    ],
    notes:
      "The packet should evaluate whether the mismatch is well-supported enough for refund approval or whether the case remains undetermined pending route evidence.",
  },
};

let contractAddress = "";
let latestBundle = null;
let selectedCaseId = CASES[0].id;

function updateCaseCount() {
  activeCaseCount.textContent = `${CASES.length} active cases`;
}

function activateTab(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("tab-active", button.dataset.tabTarget === tabId);
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("tab-panel-active", panel.id === tabId);
  });
}

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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function loadRecentRuns() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function loadDecisionHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDecisionEvent(event) {
  const current = loadDecisionHistory();
  const next = [event, ...current].slice(0, 12);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  renderDecisionHistory();
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
      `<p class="empty-state">No recent reviews yet. Build a case packet or run the workflow to populate the desk.</p>`;
    return;
  }

  recentRuns.innerHTML = runs
    .map(
      (run, index) => `
        <article class="recent-card">
          <div class="recent-head">
            <strong>${escapeHtml(run.projectName)}</strong>
            <span>${escapeHtml(run.timestamp)}</span>
          </div>
          <p>${escapeHtml(run.subject)}</p>
          <div class="recent-meta">
            <span class="pill">${escapeHtml(run.executionStatus)}</span>
            <span class="pill">${escapeHtml(run.nextAction)}</span>
            <span class="pill">${escapeHtml(run.evaluationId || "case-packet")}</span>
          </div>
          <div class="recent-actions">
            <button type="button" class="button-secondary" data-reuse-index="${index}">Reuse packet</button>
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

function renderDecisionHistory() {
  const history = loadDecisionHistory();
  if (!history.length) {
    decisionHistory.innerHTML =
      `<p class="empty-state">No decision events yet. Run triage, create a policy, or execute the workflow to build the audit trail.</p>`;
    return;
  }

  decisionHistory.innerHTML = history
    .map(
      (event) => `
        <article class="history-card">
          <div class="history-head">
            <strong>${escapeHtml(event.caseId || event.projectName || "Case event")}</strong>
            <span>${escapeHtml(event.timestamp)}</span>
          </div>
          <div class="history-body">
            <div class="history-line">
              <span class="history-label">Event</span>
              <span>${escapeHtml(event.type)}</span>
            </div>
            <div class="history-line">
              <span class="history-label">Outcome</span>
              <span>${escapeHtml(event.outcome)}</span>
            </div>
            <div class="history-line">
              <span class="history-label">Action</span>
              <span>${escapeHtml(event.action)}</span>
            </div>
          </div>
          <p>${escapeHtml(event.notes)}</p>
        </article>
      `,
    )
    .join("");
}

function getCaseById(caseId) {
  return CASES.find((item) => item.id === caseId) || CASES[0];
}

function queueTag(status) {
  if (status === "new") return "tag-blue";
  if (status === "evidence ready") return "tag-green";
  return "tag-amber";
}

function renderCaseQueue() {
  updateCaseCount();
  caseQueue.innerHTML = CASES.map((item) => {
    const activeClass = item.id === selectedCaseId ? " queue-item-active" : "";
    return `
      <button type="button" class="queue-item${activeClass}" data-case-id="${item.id}">
        <div class="queue-top">
          <strong>${escapeHtml(item.id)}</strong>
          <span class="queue-tag ${queueTag(item.status)}">${escapeHtml(item.status)}</span>
        </div>
        <p class="queue-subject">${escapeHtml(item.subject)}</p>
        <div class="queue-meta">
          <span>${escapeHtml(item.merchant)}</span>
          <span>${escapeHtml(item.atRisk)}</span>
        </div>
      </button>
    `;
  }).join("");

  caseQueue.querySelectorAll("[data-case-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCaseId = button.dataset.caseId;
      renderCaseQueue();
      fillCaseDetail(getCaseById(selectedCaseId));
    });
  });
}

function normalizeMoney(value, currency) {
  const amount = Number(String(value).replace(/[^0-9.]/g, "")) || 0;
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

function titleFromClaimType(claimType) {
  const normalized = String(claimType || "custom-dispute").trim();
  return normalized.includes("-") ? normalized : normalized.toLowerCase().replace(/\s+/g, "-");
}

function fillCaseDetail(caseItem) {
  caseTitle.textContent = caseItem.id;
  caseSubtitle.textContent = caseItem.subject;
  orderNumber.textContent = `${caseItem.id} · ${caseItem.merchant}`;
  orderMeta.textContent = `${caseItem.paymentStatus} · ${caseItem.fulfillment}`;
  riskAmount.textContent = caseItem.atRisk;
  riskMeta.textContent = `Order total ${caseItem.amount}`;
  claimType.textContent = caseItem.requestedAction;
  claimStatus.textContent = `Status: ${caseItem.status}`;
  buyerName.textContent = caseItem.buyer;
  buyerStatement.textContent = caseItem.buyerStatement;
  sellerName.textContent = caseItem.seller;
  sellerStatement.textContent = caseItem.sellerStatement;
  resolutionWindow.textContent = "Target window: within 24h";

  caseTimeline.innerHTML = caseItem.timeline
    .map(
      (step) => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div>
            <div class="timeline-title-row">
              <strong>${escapeHtml(step.title)}</strong>
              <span>${escapeHtml(step.time)}</span>
            </div>
            <p>${escapeHtml(step.description)}</p>
          </div>
        </div>
      `,
    )
    .join("");

  authoritativeEvidence.innerHTML = caseItem.evidence
    .filter((item) => item.side === "authority")
    .map(
      (item) => `
        <div class="evidence-row">
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.detail)}</p>
          </div>
          <span class="source-pill">${escapeHtml(item.source)} · ${escapeHtml(item.status)}</span>
        </div>
      `,
    )
    .join("");

  disagreementList.innerHTML = caseItem.disagreements
    .map((item) => `<div class="bullet-item">${escapeHtml(item)}</div>`)
    .join("");

  evidenceCount.textContent = `${caseItem.evidence.filter((item) => item.side === "authority").length} authority sources`;
  renderEvidenceVault(caseItem);
  hydrateFormsFromCase(caseItem);
}

function renderVaultItems(items, target) {
  target.innerHTML = items
    .map(
      (item) => `
        <article class="vault-item">
          <div class="vault-item-head">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="vault-status vault-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
          </div>
          <p>${escapeHtml(item.detail)}</p>
          <div class="vault-meta">
            <span>${escapeHtml(item.source)}</span>
            <span>${escapeHtml(item.side)}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderEvidenceVault(caseItem) {
  const buyerItems = caseItem.evidence.filter((item) => item.side === "buyer");
  const sellerItems = caseItem.evidence.filter((item) => item.side === "seller");
  const authorityItems = caseItem.evidence.filter((item) => item.side === "authority");

  renderVaultItems(buyerItems, buyerVault);
  renderVaultItems(sellerItems, sellerVault);
  renderVaultItems(authorityItems, authorityVault);

  buyerVaultCount.textContent = `${buyerItems.length} items`;
  sellerVaultCount.textContent = `${sellerItems.length} items`;
  authorityVaultCount.textContent = `${authorityItems.length} items`;
  vaultStatus.textContent = `${buyerItems.length + sellerItems.length + authorityItems.length} records loaded`;
}

function inferTemplateFromCase(caseItem) {
  if (caseItem.type === "missing-item") return "delivery-missing";
  if (caseItem.type === "refund-delay") return "payment-refund";
  if (caseItem.type === "wrong-order") return "order-mismatch";
  return "delivery-damaged";
}

function hydrateFormsFromCase(caseItem) {
  const templateKey = inferTemplateFromCase(caseItem);
  const template = TEMPLATE_PRESETS[templateKey];

  builderForm.elements.template.value = templateKey;
  builderForm.elements.projectName.value = caseItem.id;
  builderForm.elements.repoUrl.value = caseItem.references.repoUrl;
  builderForm.elements.liveApp.value = caseItem.references.liveApp;
  builderForm.elements.contractUrl.value = caseItem.references.contractUrl;
  builderForm.elements.deployTxUrl.value = caseItem.references.deployTxUrl;
  builderForm.elements.createPolicyTxUrl.value = caseItem.references.createPolicyTxUrl;
  builderForm.elements.evaluateTxUrl.value = caseItem.references.evaluateTxUrl;
  builderForm.elements.claims.value = caseItem.buyerClaims.join("\n");
  builderForm.elements.reviewNotes.value = caseItem.reviewNotes || template.notes;

  workflowForm.elements.subject.value = caseItem.subject;
  workflowForm.elements.evidence.value = pretty(buildEvidenceFromCase(caseItem));
  workflowForm.elements.referenceUrls.value = pretty(buildReferenceUrlsFromCase(caseItem));

  recommendedAction.textContent = caseItem.requestedAction;
  recommendedActionReason.textContent =
    `Current case pattern: ${caseItem.type}. Build the packet, run AI triage, then send the dispute through the reusable policy workflow.`;
}

function buildEvidenceFromCase(caseItem) {
  return {
    projectName: "order-resolution-console",
    caseId: caseItem.id,
    merchant: caseItem.merchant,
    buyer: caseItem.buyer,
    seller: caseItem.seller,
    claimType: caseItem.type,
    requestedAction: caseItem.requestedAction,
    orderAmount: caseItem.amount,
    amountAtRisk: caseItem.atRisk,
    paymentStatus: caseItem.paymentStatus,
    fulfillmentStatus: caseItem.fulfillment,
    buyerClaim: caseItem.buyerStatement,
    sellerResponse: caseItem.sellerStatement,
    authoritativeSources: caseItem.evidence.map((item) => `${item.title} (${item.source})`),
    disagreementPoints: caseItem.disagreements,
    claims: caseItem.buyerClaims,
    reviewNotes: caseItem.reviewNotes,
  };
}

function createCustomCase(form) {
  const caseId = String(form.get("caseId") || "").trim();
  const claimType = String(form.get("claimType") || "").trim();
  const merchant = String(form.get("merchant") || "").trim();
  const buyer = String(form.get("buyer") || "").trim();
  const seller = String(form.get("seller") || "").trim();
  const currency = String(form.get("currency") || "USD").trim().toUpperCase();
  const orderAmount = String(form.get("orderAmount") || "").trim();
  const riskAmountRaw = String(form.get("riskAmount") || "").trim();
  const subject = String(form.get("subject") || "").trim();
  const buyerSide = String(form.get("buyerStatement") || "").trim();
  const sellerSide = String(form.get("sellerStatement") || "").trim();

  const customCase = {
    id: caseId,
    merchant,
    buyer,
    seller,
    subject,
    type: titleFromClaimType(claimType),
    status: "new",
    amount: normalizeMoney(orderAmount, currency),
    atRisk: normalizeMoney(riskAmountRaw, currency),
    paymentStatus: `paid in ${currency}`,
    fulfillment: "submitted Jul 28, 2026",
    requestedAction: "custom resolution",
    buyerStatement: buyerSide,
    sellerStatement: sellerSide,
    buyerClaims: [
      `${claimType} dispute opened`,
      "buyer submitted statement",
      "seller response recorded",
      "case requires qualitative review",
    ],
    reviewNotes:
      "Custom case created by operator. Add buyer, seller, and authority evidence before final policy evaluation.",
    references: {
      repoUrl: "https://github.com/Jinchainne/genlayer-policy-eco",
      liveApp: "https://genlayer-policy-eco.vercel.app/",
      contractUrl: "https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108",
      deployTxUrl: "https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111",
      createPolicyTxUrl: "https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083",
      evaluateTxUrl: "https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121",
    },
    timeline: [
      { time: "Now", title: "Case opened", description: "Operator created a custom dispute intake case." },
      { time: "Next", title: "Evidence intake", description: "Buyer, seller, and authority records should be attached." },
      { time: "Next", title: "AI triage", description: "Copilot can review the packet before onchain evaluation." },
      { time: "Final", title: "Resolution workflow", description: "Run policy evaluation and map the verdict to an action." },
    ],
    evidence: [
      { title: "Buyer statement", side: "buyer", source: "manual intake", status: "submitted", detail: buyerSide },
      { title: "Seller response", side: "seller", source: "manual intake", status: "submitted", detail: sellerSide },
      { title: "Authority record placeholder", side: "authority", source: "pending source", status: "needs-review", detail: "Attach invoice, payment proof, delivery logs, policy URL, or another authoritative source." },
    ],
    disagreements: [
      "Buyer and seller positions are both recorded.",
      "Authority evidence still needs to be attached or expanded.",
      "Final decision should be delayed if the packet remains incomplete.",
    ],
  };

  CASES = [customCase, ...CASES];
  selectedCaseId = customCase.id;
  renderCaseQueue();
  fillCaseDetail(customCase);
  buildBundle();
  saveDecisionEvent({
    caseId: customCase.id,
    projectName: customCase.id,
    type: "custom_case_created",
    outcome: claimType,
    action: "collect_evidence",
    notes: "Operator added a new custom dispute case to the queue.",
    timestamp: new Date().toLocaleString(),
  });
}

function buildReferenceUrlsFromCase(caseItem) {
  return compactUrls([
    caseItem.references.repoUrl,
    caseItem.references.liveApp,
    caseItem.references.contractUrl,
    caseItem.references.deployTxUrl,
    caseItem.references.createPolicyTxUrl,
    caseItem.references.evaluateTxUrl,
  ]);
}

function updateVerdictCard(data) {
  verdictCard.className = "verdict";

  if (data.blockedByPolicy) {
    verdictCard.classList.add("verdict-deny");
    verdictCard.innerHTML =
      `<strong>Resolution held</strong><span>Policy verdict did not unlock the decision path. Next action: ${data.nextAction}</span>`;
    recommendedAction.textContent = "escalate_manual";
    recommendedActionReason.textContent =
      "The current evidence did not cleanly unlock the workflow, so the dispute should be escalated for manual operations review.";
    return;
  }

  verdictCard.classList.add("verdict-allow");
  verdictCard.innerHTML =
    `<strong>Resolution unlocked</strong><span>Policy verdict unlocked the workflow. Next action: ${data.nextAction}</span>`;
  recommendedAction.textContent = "approve_refund_or_release";
  recommendedActionReason.textContent =
    "The policy flow returned an allow-style result, so the case can move into an operational refund or release step depending on merchant rules.";
}

function showRpcFallback(errorMessage) {
  verdictCard.className = "verdict verdict-waiting";
  verdictCard.innerHTML =
    `<strong>Remote RPC temporarily unavailable</strong><span>The hosted runtime could not complete the live GenLayer write flow for this case. The desk can still show the evidence packet and proof links.</span>`;

  recommendedAction.textContent = "manual_retry";
  recommendedActionReason.textContent =
    "The resolution packet is ready, but the hosted environment could not complete the write transaction. Retry locally or use the explorer proof links.";

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
  const caseName = String(form.get("projectName") || "").trim();
  const repoUrl = String(form.get("repoUrl") || "").trim();
  const liveApp = String(form.get("liveApp") || "").trim();
  const contractUrl = String(form.get("contractUrl") || "").trim();
  const deployTxUrl = String(form.get("deployTxUrl") || "").trim();
  const createPolicyTxUrl = String(form.get("createPolicyTxUrl") || "").trim();
  const evaluateTxUrl = String(form.get("evaluateTxUrl") || "").trim();
  const claims = listFromMultiline(String(form.get("claims") || ""));
  const reviewNotes = String(form.get("reviewNotes") || "").trim();
  const caseItem = getCaseById(selectedCaseId);

  const subject = caseItem ? caseItem.subject : template.subject;
  const evidence = {
    ...buildEvidenceFromCase(caseItem),
    packetName: caseName,
    repoUrl,
    liveApp,
    contractExplorer: contractUrl,
    artifacts: [
      "invoice",
      "payment proof",
      "merchant response",
      "support timeline",
      "contract explorer",
      "workflow tx",
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

  latestBundle = { subject, evidence, referenceUrls, projectName: caseName };
  generatedSubject.textContent = subject;
  generatedEvidence.textContent = pretty(evidence);
  generatedReferences.textContent = pretty(referenceUrls);
  recommendedAction.textContent = caseItem.requestedAction;
  recommendedActionReason.textContent =
    "Case packet prepared. You can run AI triage next or send the packet into the live policy workflow.";

  saveRecentRun({
    projectName: caseName || caseItem.id,
    subject,
    executionStatus: "packet-ready",
    nextAction: "triage_or_resolve",
    evaluationId: "",
    timestamp: new Date().toLocaleString(),
    bundle: latestBundle,
  });
  saveDecisionEvent({
    caseId: caseItem.id,
    projectName: caseName,
    type: "case_packet_built",
    outcome: "packet ready",
    action: "triage_or_resolve",
    notes: "Structured buyer, seller, and authoritative sources into a reusable resolution packet.",
    timestamp: new Date().toLocaleString(),
  });
}

function applyBundleToWorkflow(bundle = latestBundle) {
  if (!bundle) {
    throw new Error("Build a case packet first.");
  }

  workflowForm.elements.subject.value = bundle.subject;
  workflowForm.elements.evidence.value = pretty(bundle.evidence);
  workflowForm.elements.referenceUrls.value = pretty(bundle.referenceUrls);
  workflowOutput.textContent = "Case packet copied into the resolution workflow form.";
}

async function runAiPreJudgeForBundle() {
  if (!latestBundle) {
    throw new Error("Build a case packet first.");
  }

  const persona = aiPersona?.value || "lexi";
  aiPreJudgeButton.disabled = true;
  aiPreJudgeButton.textContent = `Running ${persona === "lexi" ? "Lexi" : "Mira"}...`;

  try {
    const result = await fetchJson("/api/ai/prejudge", {
      method: "POST",
      body: JSON.stringify({
        bundle: latestBundle,
        persona,
      }),
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
    recommendedAction.textContent = result.preliminaryVerdict === "allow" ? "prepare resolution" : "review more evidence";
    recommendedActionReason.textContent =
      result.summary || `${result.personaLabel || "AI reviewer"} returned ${result.preliminaryVerdict}.`;

    saveRecentRun({
      projectName: latestBundle.projectName || latestBundle.evidence.caseId || "AI triage",
      subject: latestBundle.subject,
      executionStatus: `${result.personaLabel || "AI"}-${result.preliminaryVerdict}`,
      nextAction: "review_before_onchain_resolution",
      evaluationId: "",
      timestamp: new Date().toLocaleString(),
      bundle: latestBundle,
    });
    saveDecisionEvent({
      caseId: latestBundle.evidence.caseId,
      projectName: latestBundle.projectName,
      type: "ai_triage",
      outcome: `${result.personaLabel || "AI"}: ${result.preliminaryVerdict}`,
      action: "review_before_onchain_resolution",
      notes: result.summary || "AI reviewer returned a triage recommendation.",
      timestamp: new Date().toLocaleString(),
    });
  } finally {
    aiPreJudgeButton.disabled = false;
    aiPreJudgeButton.textContent = "Run AI Triage";
  }
}

function loadDemoBundle() {
  selectedCaseId = CASES[0].id;
  renderCaseQueue();
  fillCaseDetail(getCaseById(selectedCaseId));
  buildBundle();
}

policyForm.querySelector("button").dataset.idleText = "Create Resolution Policy";
workflowForm.querySelector("button").dataset.idleText = "Run Resolution Workflow";

builderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  buildBundle();
});

caseCreateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(caseCreateForm);
  createCustomCase(form);
  caseCreateForm.reset();
  caseCreateForm.elements.currency.value = "USD";
});

applyBundleButton.addEventListener("click", () => {
  try {
    applyBundleToWorkflow();
    activateTab("workflowTab");
  } catch (error) {
    workflowOutput.textContent = error.message;
  }
});

loadDemoButton.addEventListener("click", loadDemoBundle);
aiPreJudgeButton.addEventListener("click", async () => {
  try {
    activateTab("triageTab");
    await runAiPreJudgeForBundle();
  } catch (error) {
    aiPreJudgeOutput.textContent = error.message;
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateTab(button.dataset.tabTarget);
  });
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
    activateTab("policyTab");
    saveDecisionEvent({
      caseId: getCaseById(selectedCaseId).id,
      projectName: getCaseById(selectedCaseId).id,
      type: "policy_created",
      outcome: result.policyId,
      action: "ready_for_resolution",
      notes: "Created or refreshed the reusable retail order dispute policy on GenLayer.",
      timestamp: new Date().toLocaleString(),
    });
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
    activateTab("workflowTab");

    saveRecentRun({
      projectName: payload.evidence.caseId || payload.evidence.projectName || "Resolution run",
      subject: payload.subject,
      executionStatus: result.executionStatus,
      nextAction: result.nextAction,
      evaluationId: result.evaluationId,
      timestamp: new Date().toLocaleString(),
      bundle: {
        subject: payload.subject,
        evidence: payload.evidence,
        referenceUrls: payload.referenceUrls,
        projectName: payload.evidence.caseId || payload.evidence.projectName || "Resolution run",
      },
    });
    saveDecisionEvent({
      caseId: payload.evidence.caseId || payload.evidence.projectName,
      projectName: payload.evidence.caseId || payload.evidence.projectName,
      type: "workflow_resolution",
      outcome: result.executionStatus,
      action: result.nextAction,
      notes: `Workflow completed with evaluation ${result.evaluationId}.`,
      timestamp: new Date().toLocaleString(),
    });
  } catch (error) {
    if (error.message.includes("GenLayer RPC error") || error.message.includes("fetch failed")) {
      showRpcFallback(error.message);
      saveDecisionEvent({
        caseId: getCaseById(selectedCaseId).id,
        projectName: getCaseById(selectedCaseId).id,
        type: "workflow_fallback",
        outcome: "rpc unavailable",
        action: "manual_retry",
        notes: error.message,
        timestamp: new Date().toLocaleString(),
      });
    } else {
      verdictCard.className = "verdict verdict-deny";
      verdictCard.innerHTML = `<strong>Resolution failed</strong><span>${error.message}</span>`;
      workflowOutput.textContent = error.message;
    }
  } finally {
    setBusy(workflowForm, false);
  }
});

renderRecentRuns();
renderDecisionHistory();
renderCaseQueue();
fillCaseDetail(getCaseById(selectedCaseId));
buildBundle();
loadConfig().catch((error) => {
  contractAddressPill.textContent = `Config error: ${error.message}`;
  runtimeNotice.innerHTML = `<strong>Operations status</strong><span>${error.message}</span>`;
});
