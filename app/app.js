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
const jumpToBuilderButton = document.querySelector("#jumpToBuilderButton");
const aiPreJudgeButton = document.querySelector("#aiPreJudgeButton");
const aiPersona = document.querySelector("#aiPersona");
const caseQueue = document.querySelector("#caseQueue");
const caseCreateForm = document.querySelector("#caseCreateForm");
const caseDetailForm = document.querySelector("#caseDetailForm");
const evidenceForm = document.querySelector("#evidenceForm");
const saveEvidenceButton = document.querySelector("#saveEvidenceButton");
const resetEvidenceButton = document.querySelector("#resetEvidenceButton");
const sourceIngestForm = document.querySelector("#sourceIngestForm");
const resetSourceIngestButton = document.querySelector("#resetSourceIngestButton");
const activeCaseCount = document.querySelector("#activeCaseCount");
const recommendedAction = document.querySelector("#recommendedAction");
const recommendedActionReason = document.querySelector("#recommendedActionReason");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll(".tab-panel");
const detailTabButtons = document.querySelectorAll("[data-detail-tab]");
const detailPanels = document.querySelectorAll(".detail-panel");
const actionChips = document.querySelectorAll("[data-action-value]");
const resolutionActionForm = document.querySelector("#resolutionActionForm");
const clearResolutionActionButton = document.querySelector("#clearResolutionActionButton");
const sourceChips = document.querySelectorAll("[data-source-template]");

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
const createPresetSelect = document.querySelector("#caseCreateForm select[name='presetType']");
const detailPresetSelect = document.querySelector("#detailPreset");
const queueExposureMetric = document.querySelector("#queueExposureMetric");
const authorityGapMetric = document.querySelector("#authorityGapMetric");
const payoutHoldMetric = document.querySelector("#payoutHoldMetric");
const slaRiskMetric = document.querySelector("#slaRiskMetric");
const playbookActionTitle = document.querySelector("#playbookActionTitle");
const playbookActionSummary = document.querySelector("#playbookActionSummary");
const playbookTasks = document.querySelector("#playbookTasks");
const actionQueueBoard = document.querySelector("#actionQueueBoard");

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
  "delivery-late": {
    subject:
      "A buyer requests compensation because a promised delivery window was missed and both checkout SLA and carrier timing should be reviewed.",
    claims: [
      "promised delivery window exists",
      "actual delivery completed late",
      "seller attached carrier timing records",
      "resolution may lead to refund, credit, or denial",
    ],
    notes:
      "The packet should compare the promised fulfillment window against authoritative carrier completion time before compensation is approved.",
  },
  "chargeback-risk": {
    subject:
      "A buyer disputes a charge as unauthorized while the merchant relies on account, device, and payment records to defend or hold payout.",
    claims: [
      "buyer disputes charge authorization",
      "seller attached auth or risk evidence",
      "payment capture is authoritative",
      "payout release should depend on evidence quality",
    ],
    notes:
      "The packet should reconcile account, device, and payment records before deciding whether to hold payout, reverse the charge, or escalate fraud review.",
  },
  "service-cancellation": {
    subject:
      "A customer says a cancellation should have stopped renewal billing, but the merchant recorded another charge and service continuation.",
    claims: [
      "buyer claims cancellation happened before renewal",
      "seller has subscription lifecycle records",
      "billing event timing is authoritative",
      "resolution may unlock reversal or denial",
    ],
    notes:
      "The packet should compare cancellation events and billing ledger timing before allowing a renewal reversal.",
  },
  "counterfeit-quality": {
    subject:
      "A buyer claims an order is counterfeit or materially below listing quality and requests a refund after comparing product evidence against merchant records.",
    claims: [
      "buyer attached authenticity or quality concerns",
      "seller disputes counterfeit or listing mismatch",
      "order and listing records are available",
      "qualitative evidence matters more than simple deterministic checks",
    ],
    notes:
      "The packet should align buyer evidence, merchant listing proof, and any authenticity records before a refund or escalation decision is made.",
  },
  "warranty-claim": {
    subject:
      "A buyer seeks replacement or refund under warranty and the merchant disputes whether failure conditions meet the support policy.",
    claims: [
      "buyer claims defect within support period",
      "seller cites warranty terms or usage conditions",
      "proof of purchase and defect evidence are available",
      "resolution may unlock replacement or denial",
    ],
    notes:
      "The packet should assess warranty timing, purchase proof, and defect evidence before allowing a replacement or denying the claim.",
  },
};

const GLOBAL_DISPUTE_PRESETS = {
  "missing-item": {
    label: "Missing items after delivery",
    templateKey: "delivery-missing",
    requestedAction: "partial refund",
    status: "awaiting resolution",
    paymentStatus: "paid by card",
    fulfillment: "delivery completed",
    subject:
      "Buyer says paid items were missing from a delivered order and requests a partial refund after fulfillment was marked complete.",
    buyerStatement:
      "The order arrived, but paid items shown on the receipt were missing from the package.",
    sellerStatement:
      "The merchant marked the order packed and delivered, but must verify whether the missing items actually left the store.",
    buyerClaims: [
      "paid items appear missing after delivery",
      "invoice and payment proof exist",
      "seller packing records should be checked",
      "case depends on evidence quality",
    ],
    reviewNotes:
      "Use buyer unpacking proof, invoice data, and seller fulfillment records before allowing a partial refund.",
    timeline: [
      { time: "T1", title: "Order paid", description: "Buyer completed payment for the order." },
      { time: "T2", title: "Fulfillment completed", description: "Merchant marked the order packed and dispatched." },
      { time: "T3", title: "Delivery received", description: "Buyer received the package and checked contents." },
      { time: "T4", title: "Missing-item dispute opened", description: "Buyer reported missing paid items." },
    ],
    evidence: [
      { title: "Buyer unpacking proof", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached photos or video from package opening." },
      { title: "Receipt or invoice", side: "buyer", source: "buyer account", status: "submitted", detail: "Buyer provided proof that the missing items were paid for." },
      { title: "Packing record", side: "seller", source: "merchant ops", status: "submitted", detail: "Seller attached picker or packing confirmation records." },
      { title: "Dispatch confirmation", side: "seller", source: "merchant system", status: "submitted", detail: "Seller provided dispatch or handoff timing." },
      { title: "Payment settlement", side: "authority", source: "payment ledger", status: "authoritative", detail: "Payment settled before delivery." },
      { title: "Order line items", side: "authority", source: "merchant checkout", status: "authoritative", detail: "Order record confirms the expected purchased items." },
    ],
    disagreements: [
      "Buyer says the order was incomplete on arrival.",
      "Seller believes all items may have been packed.",
      "Authoritative order and payment records should anchor the final decision.",
    ],
  },
  "damaged-goods": {
    label: "Damaged goods",
    templateKey: "delivery-damaged",
    requestedAction: "approve refund",
    status: "evidence ready",
    paymentStatus: "paid by card",
    fulfillment: "delivery completed",
    subject:
      "Buyer requests refund or replacement because delivered goods arrived damaged or unusable.",
    buyerStatement:
      "The order arrived damaged and cannot be used safely or as intended.",
    sellerStatement:
      "The merchant needs to verify whether the damage happened before dispatch or after delivery.",
    buyerClaims: [
      "buyer attached photos of damaged goods",
      "seller has order and handling records",
      "refund or replacement depends on qualitative review",
      "timing of damage report matters",
    ],
    reviewNotes:
      "Review item condition evidence, report timing, and merchant handling notes before approving compensation.",
    timeline: [
      { time: "T1", title: "Order fulfilled", description: "Merchant completed order preparation." },
      { time: "T2", title: "Delivery completed", description: "Buyer received the order." },
      { time: "T3", title: "Damage report opened", description: "Buyer reported item condition issues." },
      { time: "T4", title: "Merchant review started", description: "Seller reviewed the damage claim." },
    ],
    evidence: [
      { title: "Damage photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached item condition photos." },
      { title: "Complaint timing", side: "buyer", source: "support desk", status: "time-verified", detail: "Buyer filed the complaint within a reviewable window." },
      { title: "Packing or temperature note", side: "seller", source: "merchant ops", status: "submitted", detail: "Seller attached quality or handling notes." },
      { title: "Dispatch record", side: "seller", source: "merchant system", status: "submitted", detail: "Seller provided dispatch timing and item handoff data." },
      { title: "Order record", side: "authority", source: "merchant ledger", status: "authoritative", detail: "Order and paid items were confirmed." },
      { title: "Delivery completion", side: "authority", source: "logistics backend", status: "authoritative", detail: "Delivery completion timing is verified." },
    ],
    disagreements: [
      "Buyer says the delivered goods were unusable.",
      "Seller questions when or how the damage occurred.",
      "Authority records confirm order and delivery, but condition still needs qualitative judgment.",
    ],
  },
  "refund-delay": {
    label: "Refund not received",
    templateKey: "payment-refund",
    requestedAction: "approve refund",
    status: "evidence ready",
    paymentStatus: "refund pending",
    fulfillment: "refund review in progress",
    subject:
      "Buyer says a promised refund has not arrived and wants the merchant to prove whether the reversal actually settled.",
    buyerStatement:
      "Support said a refund would be issued, but the charge is still present and no refund proof has appeared.",
    sellerStatement:
      "The merchant believes the refund may have been initiated, but payment processor evidence is required.",
    buyerClaims: [
      "refund promise exists",
      "buyer still sees the original charge",
      "processor proof is decisive",
      "policy should deny weak refund claims without settlement evidence",
    ],
    reviewNotes:
      "Use authoritative refund settlement evidence before deciding whether to approve refund completion or escalate manually.",
    timeline: [
      { time: "T1", title: "Issue acknowledged", description: "Merchant recognized the underlying service or product issue." },
      { time: "T2", title: "Refund promised", description: "Support communicated refund intent." },
      { time: "T3", title: "Buyer checks account", description: "Buyer still sees original charge." },
      { time: "T4", title: "Refund dispute opened", description: "Buyer requests proof or reversal." },
    ],
    evidence: [
      { title: "Refund promise log", side: "buyer", source: "support message", status: "submitted", detail: "Buyer attached merchant communication promising refund." },
      { title: "Current card statement", side: "buyer", source: "bank app", status: "submitted", detail: "Buyer attached the still-visible original charge." },
      { title: "Refund initiation note", side: "seller", source: "merchant ops", status: "submitted", detail: "Seller attached any internal refund action." },
      { title: "Payment processor reference", side: "seller", source: "payments team", status: "pending-proof", detail: "Seller still needs processor confirmation." },
      { title: "Original charge settlement", side: "authority", source: "payment ledger", status: "authoritative", detail: "Original charge settlement is confirmed." },
      { title: "Refund settlement receipt", side: "authority", source: "processor ledger", status: "missing", detail: "Authoritative refund settlement proof is still missing." },
    ],
    disagreements: [
      "Buyer says refund never arrived.",
      "Seller says the refund may still be processing or lacks proof.",
      "Authoritative processor evidence should decide the outcome.",
    ],
  },
  "wrong-order": {
    label: "Wrong order delivered",
    templateKey: "order-mismatch",
    requestedAction: "full refund",
    status: "new",
    paymentStatus: "paid before delivery",
    fulfillment: "delivery completed",
    subject:
      "Buyer says the delivered package contained the wrong order and requests a full refund or replacement.",
    buyerStatement:
      "The delivered bag or box contents do not match the receipt or listing.",
    sellerStatement:
      "The merchant suspects a picking or handoff mismatch but needs route and package evidence reviewed.",
    buyerClaims: [
      "delivered items do not match receipt",
      "buyer reported immediately",
      "seller should check route and bag assignment records",
      "wrong-order claims require qualitative review",
    ],
    reviewNotes:
      "Compare buyer bag photos, route logs, and order records before approving a full refund or escalation.",
    timeline: [
      { time: "T1", title: "Order picked", description: "Merchant prepared the order for dispatch." },
      { time: "T2", title: "Delivery completed", description: "Buyer received the order." },
      { time: "T3", title: "Mismatch found", description: "Buyer noticed the delivered items did not match the order." },
      { time: "T4", title: "Dispute opened", description: "Buyer requested correction or refund." },
    ],
    evidence: [
      { title: "Bag content photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached photos of the incorrect contents." },
      { title: "Receipt comparison", side: "buyer", source: "buyer account", status: "submitted", detail: "Buyer provided the expected item list or invoice." },
      { title: "Route or picker log", side: "seller", source: "logistics backend", status: "submitted", detail: "Seller attached route or bag assignment records." },
      { title: "Dispatch completion", side: "seller", source: "merchant system", status: "submitted", detail: "Seller provided dispatch and completion events." },
      { title: "Expected order contents", side: "authority", source: "order ledger", status: "authoritative", detail: "Authority record confirms what should have been delivered." },
      { title: "Delivery completion event", side: "authority", source: "logistics ledger", status: "authoritative", detail: "Delivery completion and rider metadata are available." },
    ],
    disagreements: [
      "Buyer says the wrong order arrived.",
      "Seller says a route or handoff mismatch is possible but not yet proven.",
      "Authority records confirm the expected order and delivery path.",
    ],
  },
  "late-delivery": {
    label: "Late delivery compensation",
    templateKey: "delivery-late",
    requestedAction: "delivery credit",
    status: "new",
    paymentStatus: "paid before dispatch",
    fulfillment: "delivery completed late",
    subject:
      "Buyer says a promised delivery window was missed and asks for compensation or credit.",
    buyerStatement:
      "The order arrived after the promised delivery window and missed an important use case.",
    sellerStatement:
      "The merchant acknowledges delay risk but wants carrier timing and checkout SLA checked before compensation is approved.",
    buyerClaims: [
      "promised delivery window existed",
      "actual delivery missed the promise",
      "carrier timing logs exist",
      "compensation depends on policy and evidence",
    ],
    reviewNotes:
      "Use checkout SLA and carrier logs to determine whether delay compensation should be unlocked.",
    timeline: [
      { time: "T1", title: "Priority shipping selected", description: "Buyer paid for faster delivery." },
      { time: "T2", title: "Transit delay", description: "Carrier or merchant hit a routing delay." },
      { time: "T3", title: "Late delivery completed", description: "The order arrived beyond the promised window." },
      { time: "T4", title: "Compensation dispute opened", description: "Buyer requested credit or reversal." },
    ],
    evidence: [
      { title: "SLA promise screenshot", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached promised delivery timing." },
      { title: "Complaint timing", side: "buyer", source: "support desk", status: "time-verified", detail: "Buyer opened a claim after receiving the late order." },
      { title: "Carrier delay note", side: "seller", source: "carrier feed", status: "submitted", detail: "Seller provided routing or weather delay records." },
      { title: "Merchant response note", side: "seller", source: "ops desk", status: "submitted", detail: "Merchant stated why the order missed the SLA." },
      { title: "Promised ship window", side: "authority", source: "checkout system", status: "authoritative", detail: "Checkout data confirms the promised delivery level." },
      { title: "Actual delivery timestamp", side: "authority", source: "carrier ledger", status: "authoritative", detail: "Carrier record confirms late completion." },
    ],
    disagreements: [
      "Buyer says the promised delivery was missed.",
      "Seller may argue compensation should be limited.",
      "Authority timing should determine whether compensation is justified.",
    ],
  },
  "chargeback-risk": {
    label: "Unauthorized payment / chargeback",
    templateKey: "chargeback-risk",
    requestedAction: "hold payout",
    status: "evidence ready",
    paymentStatus: "captured payment under dispute",
    fulfillment: "fulfillment may already be released",
    subject:
      "Buyer disputes a charge as unauthorized while merchant risk systems claim the session was valid.",
    buyerStatement:
      "I did not authorize this transaction and want the charge reversed.",
    sellerStatement:
      "The merchant believes session, device, or login evidence supports a valid purchase, but payout should stay controlled until review finishes.",
    buyerClaims: [
      "buyer claims unauthorized charge",
      "seller has risk or auth records",
      "payout control matters if fulfillment already occurred",
      "authoritative auth and payment evidence should be reviewed",
    ],
    reviewNotes:
      "This preset is suited for digital commerce and marketplace payment operations where payout must be held or released based on evidence quality.",
    timeline: [
      { time: "T1", title: "Purchase session started", description: "Account or device activity preceded payment." },
      { time: "T2", title: "Payment captured", description: "Merchant captured the charge." },
      { time: "T3", title: "Buyer disputes authorization", description: "Buyer alleged fraud or unauthorized purchase." },
      { time: "T4", title: "Chargeback review opened", description: "Merchant moved the case into risk review." },
    ],
    evidence: [
      { title: "Buyer issuer complaint", side: "buyer", source: "issuer notice", status: "submitted", detail: "Buyer attached a chargeback or unauthorized transaction report." },
      { title: "Buyer identity note", side: "buyer", source: "support desk", status: "submitted", detail: "Buyer explained why the transaction is disputed." },
      { title: "Device or IP log", side: "seller", source: "risk engine", status: "submitted", detail: "Seller attached device or login evidence." },
      { title: "Fulfillment log", side: "seller", source: "merchant backend", status: "submitted", detail: "Seller attached release or shipping timing." },
      { title: "Authentication record", side: "authority", source: "auth service", status: "authoritative", detail: "Authority record confirms account access or step-up auth events." },
      { title: "Charge settlement", side: "authority", source: "payment ledger", status: "authoritative", detail: "Payment capture and settlement records are available." },
    ],
    disagreements: [
      "Buyer says the charge is fraudulent or unauthorized.",
      "Seller says session and device evidence support validity.",
      "Authority auth and payment records should determine whether payout stays held.",
    ],
  },
  "counterfeit-quality": {
    label: "Counterfeit or listing mismatch",
    templateKey: "counterfeit-quality",
    requestedAction: "return and refund",
    status: "awaiting resolution",
    paymentStatus: "paid before delivery",
    fulfillment: "product delivered",
    subject:
      "Buyer says the product is counterfeit or materially different from the listing and requests return approval with refund.",
    buyerStatement:
      "The received product does not match the listing or appears counterfeit or materially lower quality.",
    sellerStatement:
      "The merchant disputes the authenticity claim and wants listing, batch, and product evidence reviewed first.",
    buyerClaims: [
      "buyer says product differs from listing",
      "authenticity or quality is disputed",
      "seller has listing or sourcing records",
      "the case requires qualitative comparison",
    ],
    reviewNotes:
      "This preset is useful for marketplaces and cross-border commerce where listing mismatch and authenticity disputes require narrative evidence review.",
    timeline: [
      { time: "T1", title: "Order delivered", description: "Buyer received the product." },
      { time: "T2", title: "Authenticity concern raised", description: "Buyer compared received goods against the listing." },
      { time: "T3", title: "Return or refund dispute opened", description: "Buyer requested corrective action." },
      { time: "T4", title: "Merchant evidence review", description: "Seller attached sourcing or listing evidence." },
    ],
    evidence: [
      { title: "Buyer comparison photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached product and packaging comparison images." },
      { title: "Listing screenshot", side: "buyer", source: "buyer account", status: "submitted", detail: "Buyer attached the original listing details." },
      { title: "Merchant sourcing note", side: "seller", source: "merchant ops", status: "submitted", detail: "Seller attached supplier or batch information." },
      { title: "Return policy note", side: "seller", source: "policy desk", status: "submitted", detail: "Seller attached the applicable merchant return or authenticity policy." },
      { title: "Order record", side: "authority", source: "order ledger", status: "authoritative", detail: "Authority order records confirm the purchased listing." },
      { title: "Catalog metadata", side: "authority", source: "catalog system", status: "needs-review", detail: "Catalog or SKU metadata should be reconciled with the product evidence." },
    ],
    disagreements: [
      "Buyer says the product does not match the listing or is counterfeit.",
      "Seller disputes the buyer interpretation or requests a return-first path.",
      "Listing, catalog, and evidence quality should drive the final resolution.",
    ],
  },
  "service-cancellation": {
    label: "Subscription cancellation billing",
    templateKey: "service-cancellation",
    requestedAction: "reverse renewal",
    status: "awaiting resolution",
    paymentStatus: "renewal captured",
    fulfillment: "service remained active",
    subject:
      "Buyer says a subscription should have been canceled before billing but the merchant still renewed and charged the account.",
    buyerStatement:
      "I canceled before renewal, but billing still happened and the service renewed anyway.",
    sellerStatement:
      "The merchant needs to verify whether the cancellation event fully completed before the renewal cycle executed.",
    buyerClaims: [
      "buyer claims cancellation before renewal",
      "merchant renewal event still fired",
      "billing and cancellation logs are decisive",
      "the case may end in reversal or denial",
    ],
    reviewNotes:
      "This preset expands the console beyond physical retail into SaaS and membership support operations.",
    timeline: [
      { time: "T1", title: "Cancellation attempt", description: "Buyer says they canceled before renewal." },
      { time: "T2", title: "Renewal charge posted", description: "Merchant billing still renewed the account." },
      { time: "T3", title: "Billing dispute opened", description: "Buyer requested reversal." },
      { time: "T4", title: "Lifecycle review", description: "Seller checked billing and subscription logs." },
    ],
    evidence: [
      { title: "Cancellation confirmation", side: "buyer", source: "buyer inbox", status: "submitted", detail: "Buyer attached cancellation proof or email." },
      { title: "Renewal charge proof", side: "buyer", source: "bank app", status: "submitted", detail: "Buyer attached the renewal charge." },
      { title: "Subscription event log", side: "seller", source: "subscription backend", status: "submitted", detail: "Seller attached state-transition records." },
      { title: "Support interaction log", side: "seller", source: "CRM", status: "submitted", detail: "Seller attached the relevant support interactions." },
      { title: "Billing ledger", side: "authority", source: "billing ledger", status: "authoritative", detail: "Renewal billing time is confirmed in the ledger." },
      { title: "Cancellation completion event", side: "authority", source: "subscription service", status: "needs-review", detail: "Cancellation timing must be reconciled with renewal timing." },
    ],
    disagreements: [
      "Buyer says cancellation occurred before billing.",
      "Seller says the account may still have been active at renewal time.",
      "Authority billing and cancellation events should decide the outcome.",
    ],
  },
  "warranty-claim": {
    label: "Warranty replacement or refund",
    templateKey: "warranty-claim",
    requestedAction: "approve replacement",
    status: "evidence ready",
    paymentStatus: "paid in full",
    fulfillment: "device or product in-use",
    subject:
      "Buyer says a product failed within the support period and requests warranty replacement or refund.",
    buyerStatement:
      "The product stopped working within the warranty window and I want a replacement or reimbursement.",
    sellerStatement:
      "The merchant needs to review purchase timing, defect evidence, and policy terms before replacement is approved.",
    buyerClaims: [
      "buyer claims defect within support period",
      "seller has warranty policy and support records",
      "proof of purchase is essential",
      "the case may resolve as replacement, refund, or denial",
    ],
    reviewNotes:
      "This preset is useful for electronics, appliances, and durable goods support teams.",
    timeline: [
      { time: "T1", title: "Original purchase", description: "Buyer purchased the product." },
      { time: "T2", title: "Defect reported", description: "Buyer reported a defect within the support window." },
      { time: "T3", title: "Warranty review started", description: "Seller checked support eligibility." },
      { time: "T4", title: "Resolution pending", description: "Policy-backed decision will determine replacement or denial." },
    ],
    evidence: [
      { title: "Defect photos or video", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached proof of product failure." },
      { title: "Proof of purchase", side: "buyer", source: "buyer account", status: "submitted", detail: "Buyer attached receipt and order history." },
      { title: "Warranty terms", side: "seller", source: "merchant support", status: "submitted", detail: "Seller attached relevant warranty clauses." },
      { title: "Support diagnostics", side: "seller", source: "repair desk", status: "submitted", detail: "Seller attached troubleshooting or inspection notes." },
      { title: "Purchase ledger", side: "authority", source: "order ledger", status: "authoritative", detail: "Original purchase timing is confirmed." },
      { title: "Support eligibility window", side: "authority", source: "policy service", status: "authoritative", detail: "Eligibility dates can be checked against policy." },
    ],
    disagreements: [
      "Buyer says the product failure should be covered.",
      "Seller says warranty terms or use conditions may limit coverage.",
      "Purchase timing, defect evidence, and policy scope should drive the final decision.",
    ],
  },
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function baseReferences() {
  return {
    repoUrl: "https://github.com/Jinchainne/genlayer-policy-eco",
    liveApp: "https://genlayer-policy-eco.vercel.app/",
    contractUrl: "https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108",
    deployTxUrl: "https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111",
    createPolicyTxUrl: "https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083",
    evaluateTxUrl: "https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121",
  };
}

function makeSeedCase({
  id,
  merchant,
  buyer,
  seller,
  type,
  amount,
  atRisk,
  paymentStatus,
  fulfillment,
}) {
  const preset = GLOBAL_DISPUTE_PRESETS[type];
  return {
    id,
    merchant,
    buyer,
    seller,
    subject: preset.subject,
    type,
    status: preset.status,
    amount,
    atRisk,
    paymentStatus: paymentStatus || preset.paymentStatus,
    fulfillment: fulfillment || preset.fulfillment,
    requestedAction: preset.requestedAction,
    buyerStatement: preset.buyerStatement,
    sellerStatement: preset.sellerStatement,
    buyerClaims: cloneData(preset.buyerClaims),
    reviewNotes: preset.reviewNotes,
    references: baseReferences(),
    timeline: cloneData(preset.timeline),
    evidence: cloneData(preset.evidence),
    disagreements: cloneData(preset.disagreements),
  };
}

CASES.push(
  makeSeedCase({
    id: "ORD-2143",
    merchant: "MetroParcel EU",
    buyer: "Amelia Novak",
    seller: "Cross-Border Delivery Ops",
    type: "late-delivery",
    amount: "96.00 EUR",
    atRisk: "24.00 EUR",
    paymentStatus: "paid by wallet",
    fulfillment: "delivered Jul 27, 2026 18:10",
  }),
  makeSeedCase({
    id: "ORD-2191",
    merchant: "NovaPay Marketplace",
    buyer: "Marcus Lee",
    seller: "Chargeback Response Team",
    type: "chargeback-risk",
    amount: "420.00 USD",
    atRisk: "420.00 USD",
    paymentStatus: "card captured",
    fulfillment: "digital goods released Jul 28, 2026 02:10",
  }),
  makeSeedCase({
    id: "ORD-2230",
    merchant: "StreamSpace Global",
    buyer: "Lina Hassan",
    seller: "Subscription Support",
    type: "service-cancellation",
    amount: "39.00 USD",
    atRisk: "39.00 USD",
    paymentStatus: "renewal captured",
    fulfillment: "subscription renewed Jul 27, 2026",
  }),
);

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

function activateDetailTab(tabId) {
  detailTabButtons.forEach((button) => {
    button.classList.toggle("tab-active", button.dataset.detailTab === tabId);
  });
  detailPanels.forEach((panel) => {
    panel.classList.toggle("detail-panel-active", panel.id === tabId);
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

function splitMoney(value) {
  const raw = String(value || "").trim();
  const amountMatch = raw.match(/[\d.,]+/);
  const currencyMatch = raw.match(/[A-Z]{3,}/);
  return {
    amount: amountMatch ? amountMatch[0].replace(/,/g, "") : "",
    currency: currencyMatch ? currencyMatch[0] : "USD",
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildPresetOptions() {
  const options = Object.entries(GLOBAL_DISPUTE_PRESETS)
    .map(
      ([key, preset]) => `<option value="${escapeHtml(key)}">${escapeHtml(preset.label)}</option>`,
    )
    .join("");

  createPresetSelect.innerHTML = `<option value="">Manual custom dispute</option>${options}`;
  detailPresetSelect.innerHTML = `<option value="">Manual custom dispute</option>${options}`;
}

function applyPresetValuesToForm(formElement, presetKey) {
  const preset = GLOBAL_DISPUTE_PRESETS[presetKey];
  if (!preset) return;

  if (formElement.elements.claimType) formElement.elements.claimType.value = presetKey;
  if (formElement.elements.requestedAction) formElement.elements.requestedAction.value = preset.requestedAction;
  if (formElement.elements.status) formElement.elements.status.value = preset.status;
  if (formElement.elements.subject) formElement.elements.subject.value = preset.subject;
  if (formElement.elements.buyerStatement) formElement.elements.buyerStatement.value = preset.buyerStatement;
  if (formElement.elements.sellerStatement) formElement.elements.sellerStatement.value = preset.sellerStatement;
  if (formElement.elements.reviewNotes) formElement.elements.reviewNotes.value = preset.reviewNotes;
}

function getSelectedCaseIndex() {
  return CASES.findIndex((item) => item.id === selectedCaseId);
}

function getSelectedCase() {
  return getCaseById(selectedCaseId);
}

function syncSelectedCase(caseItem) {
  renderCaseQueue();
  fillCaseDetail(caseItem);
  renderOpsMetrics();
  renderActionQueueBoard();
}

function actionLabel(value) {
  return String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeActionValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function resolutionStatusForAction(action) {
  const map = {
    approve_refund: "refund approved",
    partial_refund: "partial refund approved",
    reship_order: "reship scheduled",
    store_credit: "credit issued",
    hold_payout: "payout on hold",
    fraud_review: "fraud review queue",
    deny_claim: "claim denied",
  };
  return map[action] || "resolution updated";
}

function actionTaskTemplates(action, caseItem) {
  const templates = {
    approve_refund: [
      { lane: "payments", title: "Issue refund through processor", owner: "Payments Ops" },
      { lane: "support", title: "Notify buyer of refund confirmation", owner: "Support Desk" },
      { lane: "audit", title: "Store refund proof in audit trail", owner: "Risk Audit" },
    ],
    partial_refund: [
      { lane: "payments", title: "Approve partial reimbursement amount", owner: "Payments Ops" },
      { lane: "merchant", title: "Document which SKUs or services were compensated", owner: "Merchant Desk" },
      { lane: "support", title: "Send split-resolution notice to buyer", owner: "Support Desk" },
    ],
    reship_order: [
      { lane: "fulfillment", title: "Create replacement order or reship ticket", owner: "Fulfillment Team" },
      { lane: "logistics", title: "Prioritize replacement routing", owner: "Logistics Control" },
      { lane: "support", title: "Confirm new ETA to buyer", owner: "Support Desk" },
    ],
    store_credit: [
      { lane: "wallet", title: "Issue store credit to buyer account", owner: "Customer Wallet Ops" },
      { lane: "support", title: "Explain credit validity and scope", owner: "Support Desk" },
      { lane: "analytics", title: "Tag case for retention follow-up", owner: "CRM Ops" },
    ],
    hold_payout: [
      { lane: "risk", title: "Freeze merchant payout on dispute order", owner: "Risk Control" },
      { lane: "finance", title: "Flag settlement for manual approval", owner: "Finance Ops" },
      { lane: "audit", title: "Request additional seller or fraud evidence", owner: "Risk Audit" },
    ],
    fraud_review: [
      { lane: "fraud", title: "Escalate case into fraud review queue", owner: "Fraud Desk" },
      { lane: "identity", title: "Compare auth, device, and payment events", owner: "Identity Risk" },
      { lane: "support", title: "Hold merchant/buyer final notice pending outcome", owner: "Support Desk" },
    ],
    deny_claim: [
      { lane: "support", title: "Send denial rationale to buyer", owner: "Support Desk" },
      { lane: "merchant", title: "Close merchant dispute case", owner: "Merchant Desk" },
      { lane: "audit", title: "Archive denial evidence for compliance", owner: "Risk Audit" },
    ],
  };

  return (templates[action] || []).map((task, index) => ({
    id: `${caseItem.id}-${action}-${index + 1}`,
    caseId: caseItem.id,
    action,
    status: index === 0 ? "ready" : "pending",
    lane: task.lane,
    owner: task.owner,
    title: task.title,
  }));
}

function normalizeMoneyNumber(value) {
  return Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
}

function formatMetricMoney(amount) {
  return `${amount.toFixed(2)} USD`;
}

function caseNeedsAuthority(caseItem) {
  return caseItem.evidence.some((item) => item.side === "authority" && ["missing", "needs-review", "pending-proof"].includes(item.status));
}

function caseSlaRisk(caseItem) {
  return ["late-delivery", "service-cancellation", "refund-delay"].includes(caseItem.type);
}

function sourceTemplatePayload(sourceType, caseItem) {
  const payloads = {
    order_ledger: {
      orderId: caseItem.id,
      merchant: caseItem.merchant,
      status: "confirmed",
      totalAmount: caseItem.amount,
      summary: "Order ledger confirms the purchased items, settlement state, and merchant of record.",
    },
    payment_ledger: {
      orderId: caseItem.id,
      paymentStatus: caseItem.paymentStatus,
      amountAtRisk: caseItem.atRisk,
      summary: "Payment ledger confirms capture, settlement, refund, or payout status for the case.",
    },
    shipping_events: {
      orderId: caseItem.id,
      fulfillment: caseItem.fulfillment,
      latestEvent: "delivery_completed",
      summary: "Logistics event feed confirms route, delivery timing, and dispatch milestones.",
    },
    support_crm: {
      orderId: caseItem.id,
      buyer: caseItem.buyer,
      seller: caseItem.seller,
      summary: "Support CRM records buyer complaint timing, merchant replies, and promised remedies.",
    },
    fraud_signal: {
      orderId: caseItem.id,
      signal: "manual_review",
      summary: "Risk engine or auth service surfaced an anomaly requiring fraud-sensitive handling.",
    },
  };
  return payloads[sourceType] || { orderId: caseItem.id, summary: "Structured source payload." };
}

function actionReasonForValue(action, note = "") {
  const map = {
    approve_refund: "The dispute record supports reversing payment to the buyer.",
    partial_refund: "The record supports only partial reimbursement rather than a full reversal.",
    reship_order: "The issue looks fulfillment-related, so replacement shipment is the cleaner operational remedy.",
    store_credit: "The case supports compensation without full cash reversal.",
    hold_payout: "Risk, fraud, or unresolved evidence means merchant payout should stay frozen.",
    fraud_review: "Conflicting payment or identity evidence requires specialist fraud review.",
    deny_claim: "The evidence package does not justify compensation at this stage.",
  };
  return note || map[action] || "The current case was mapped to a concrete operational action.";
}

function resetEvidenceEditor() {
  evidenceForm.reset();
  evidenceForm.elements.evidenceIndex.value = "";
  evidenceForm.elements.side.value = "buyer";
  evidenceForm.elements.status.value = "submitted";
  saveEvidenceButton.textContent = "Add Evidence Record";
}

function resetSourceIngest() {
  sourceIngestForm.reset();
  sourceIngestForm.elements.sourceType.value = "";
  sourceChips.forEach((chip) => chip.classList.remove("action-chip-active"));
}

function clearActionSelection() {
  actionChips.forEach((chip) => {
    chip.classList.remove("action-chip-active");
  });
  resolutionActionForm.dataset.selectedAction = "";
  resolutionActionForm.elements.actionNote.value = "";
}

function hydrateEvidenceEditor(item, index) {
  evidenceForm.elements.evidenceIndex.value = String(index);
  evidenceForm.elements.side.value = item.side;
  evidenceForm.elements.status.value = item.status;
  evidenceForm.elements.source.value = item.source;
  evidenceForm.elements.title.value = item.title;
  evidenceForm.elements.detail.value = item.detail;
  saveEvidenceButton.textContent = "Update Evidence Record";
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

function renderOpsMetrics() {
  const totalRisk = CASES.reduce((sum, item) => sum + normalizeMoneyNumber(item.atRisk), 0);
  const authorityGaps = CASES.filter(caseNeedsAuthority).length;
  const payoutHolds = CASES.filter((item) => ["hold_payout", "fraud_review"].includes(item.opsAction || item.requestedAction)).length;
  const slaRisk = CASES.filter(caseSlaRisk).length;

  queueExposureMetric.textContent = formatMetricMoney(totalRisk);
  authorityGapMetric.textContent = String(authorityGaps);
  payoutHoldMetric.textContent = String(payoutHolds);
  slaRiskMetric.textContent = String(slaRisk);
}

function renderPlaybook(caseItem) {
  const activeAction = caseItem.opsAction || normalizeActionValue(caseItem.requestedAction);
  const tasks = caseItem.playbookTasks || actionTaskTemplates(activeAction, caseItem);

  if (!activeAction || !tasks.length) {
    playbookActionTitle.textContent = "No action playbook selected";
    playbookActionSummary.textContent = "Pick or unlock an operational action to see downstream execution tasks.";
    playbookTasks.innerHTML = `<p class="empty-state">No action tasks yet.</p>`;
    return;
  }

  playbookActionTitle.textContent = actionLabel(activeAction);
  playbookActionSummary.textContent = actionReasonForValue(activeAction, caseItem.actionNote || "");
  playbookTasks.innerHTML = tasks
    .map(
      (task) => `
        <article class="history-card task-card">
          <div class="history-head">
            <strong>${escapeHtml(task.title)}</strong>
            <span class="pill">${escapeHtml(task.status)}</span>
          </div>
          <div class="history-body">
            <div class="history-line">
              <span class="history-label">Lane</span>
              <span>${escapeHtml(task.lane)}</span>
            </div>
            <div class="history-line">
              <span class="history-label">Owner</span>
              <span>${escapeHtml(task.owner)}</span>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderActionQueueBoard() {
  const queued = CASES.flatMap((item) =>
    (item.playbookTasks || []).map((task) => ({
      ...task,
      merchant: item.merchant,
    })),
  );

  if (!queued.length) {
    actionQueueBoard.innerHTML = `<p class="empty-state">No operational tasks queued yet. Apply a resolution action to generate downstream work.</p>`;
    return;
  }

  actionQueueBoard.innerHTML = queued
    .map(
      (task) => `
        <article class="history-card task-card">
          <div class="history-head">
            <strong>${escapeHtml(task.caseId)}</strong>
            <span>${escapeHtml(task.owner)}</span>
          </div>
          <div class="history-body">
            <div class="history-line">
              <span class="history-label">Task</span>
              <span>${escapeHtml(task.title)}</span>
            </div>
            <div class="history-line">
              <span class="history-label">Lane</span>
              <span>${escapeHtml(task.lane)}</span>
            </div>
            <div class="history-line">
              <span class="history-label">Status</span>
              <span>${escapeHtml(task.status)}</span>
            </div>
            <div class="history-line">
              <span class="history-label">Merchant</span>
              <span>${escapeHtml(task.merchant)}</span>
            </div>
          </div>
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
      activateDetailTab("overviewTab");
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
          <div class="vault-actions">
            <button type="button" class="mini-action" data-evidence-action="edit" data-evidence-index="${item.index}">Edit</button>
            <button type="button" class="mini-action mini-danger" data-evidence-action="delete" data-evidence-index="${item.index}">Delete</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderEvidenceVault(caseItem) {
  const indexedEvidence = caseItem.evidence.map((item, index) => ({ ...item, index }));
  const buyerItems = indexedEvidence.filter((item) => item.side === "buyer");
  const sellerItems = indexedEvidence.filter((item) => item.side === "seller");
  const authorityItems = indexedEvidence.filter((item) => item.side === "authority");

  renderVaultItems(buyerItems, buyerVault);
  renderVaultItems(sellerItems, sellerVault);
  renderVaultItems(authorityItems, authorityVault);

  buyerVaultCount.textContent = `${buyerItems.length} items`;
  sellerVaultCount.textContent = `${sellerItems.length} items`;
  authorityVaultCount.textContent = `${authorityItems.length} items`;
  vaultStatus.textContent = `${buyerItems.length + sellerItems.length + authorityItems.length} records loaded`;
}

function inferTemplateFromCase(caseItem) {
  if (GLOBAL_DISPUTE_PRESETS[caseItem.type]?.templateKey) {
    return GLOBAL_DISPUTE_PRESETS[caseItem.type].templateKey;
  }
  if (caseItem.type === "missing-item") return "delivery-missing";
  if (caseItem.type === "refund-delay") return "payment-refund";
  if (caseItem.type === "wrong-order") return "order-mismatch";
  return "delivery-damaged";
}

function hydrateCaseEditor(caseItem) {
  const { amount, currency } = splitMoney(caseItem.amount);
  const { amount: atRiskAmount } = splitMoney(caseItem.atRisk);

  caseDetailForm.elements.presetType.value = GLOBAL_DISPUTE_PRESETS[caseItem.type] ? caseItem.type : "";
  caseDetailForm.elements.caseId.value = caseItem.id;
  caseDetailForm.elements.status.value = caseItem.status;
  caseDetailForm.elements.claimType.value = caseItem.type;
  caseDetailForm.elements.requestedAction.value = caseItem.requestedAction;
  caseDetailForm.elements.currency.value = currency;
  caseDetailForm.elements.merchant.value = caseItem.merchant;
  caseDetailForm.elements.buyer.value = caseItem.buyer;
  caseDetailForm.elements.seller.value = caseItem.seller;
  caseDetailForm.elements.orderAmount.value = amount;
  caseDetailForm.elements.riskAmount.value = atRiskAmount;
  caseDetailForm.elements.subject.value = caseItem.subject;
  caseDetailForm.elements.buyerStatement.value = caseItem.buyerStatement;
  caseDetailForm.elements.sellerStatement.value = caseItem.sellerStatement;
  caseDetailForm.elements.reviewNotes.value = caseItem.reviewNotes || "";
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
  hydrateCaseEditor(caseItem);
  resetEvidenceEditor();
  resetSourceIngest();
  clearActionSelection();
  renderPlaybook(caseItem);
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
  const presetKey = String(form.get("presetType") || "").trim();
  const preset = GLOBAL_DISPUTE_PRESETS[presetKey];
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
    subject: subject || preset?.subject || "Custom dispute case requires review.",
    type: presetKey || titleFromClaimType(claimType),
    status: preset?.status || "new",
    amount: normalizeMoney(orderAmount, currency),
    atRisk: normalizeMoney(riskAmountRaw, currency),
    paymentStatus: preset?.paymentStatus || `paid in ${currency}`,
    fulfillment: preset?.fulfillment || "submitted Jul 28, 2026",
    requestedAction: preset?.requestedAction || "custom resolution",
    buyerStatement: buyerSide || preset?.buyerStatement || "Buyer statement pending.",
    sellerStatement: sellerSide || preset?.sellerStatement || "Seller response pending.",
    buyerClaims: preset
      ? cloneData(preset.buyerClaims)
      : [`${claimType} dispute opened`, "buyer submitted statement", "seller response recorded", "case requires qualitative review"],
    reviewNotes:
      preset?.reviewNotes ||
      "Custom case created by operator. Add buyer, seller, and authority evidence before final policy evaluation.",
    references: baseReferences(),
    timeline: preset
      ? cloneData(preset.timeline)
      : [
          { time: "Now", title: "Case opened", description: "Operator created a custom dispute intake case." },
          { time: "Next", title: "Evidence intake", description: "Buyer, seller, and authority records should be attached." },
          { time: "Next", title: "AI triage", description: "Copilot can review the packet before onchain evaluation." },
          { time: "Final", title: "Resolution workflow", description: "Run policy evaluation and map the verdict to an action." },
        ],
    evidence: preset
      ? cloneData(preset.evidence)
      : [
          { title: "Buyer statement", side: "buyer", source: "manual intake", status: "submitted", detail: buyerSide },
          { title: "Seller response", side: "seller", source: "manual intake", status: "submitted", detail: sellerSide },
          { title: "Authority record placeholder", side: "authority", source: "pending source", status: "needs-review", detail: "Attach invoice, payment proof, delivery logs, policy URL, or another authoritative source." },
        ],
    disagreements: preset
      ? cloneData(preset.disagreements)
      : [
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
  activateDetailTab("builderTab");
  activateTab("packetTab");
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

function updateCurrentCase(form) {
  const current = getCaseById(selectedCaseId);
  const presetKey = String(form.get("presetType") || "").trim();
  const preset = GLOBAL_DISPUTE_PRESETS[presetKey];
  const caseId = String(form.get("caseId") || "").trim();
  const claimTypeValue = String(form.get("claimType") || "").trim();
  const merchant = String(form.get("merchant") || "").trim();
  const buyer = String(form.get("buyer") || "").trim();
  const seller = String(form.get("seller") || "").trim();
  const currency = String(form.get("currency") || "USD").trim().toUpperCase();
  const orderAmount = String(form.get("orderAmount") || "").trim();
  const riskAmountRaw = String(form.get("riskAmount") || "").trim();
  const status = String(form.get("status") || "").trim();
  const requestedActionValue = String(form.get("requestedAction") || "").trim();
  const subject = String(form.get("subject") || "").trim();
  const buyerSide = String(form.get("buyerStatement") || "").trim();
  const sellerSide = String(form.get("sellerStatement") || "").trim();
  const reviewNotes = String(form.get("reviewNotes") || "").trim();

  const updated = {
    ...current,
    id: caseId,
    type: presetKey || titleFromClaimType(claimTypeValue),
    merchant,
    buyer,
    seller,
    status,
    requestedAction: requestedActionValue,
    amount: normalizeMoney(orderAmount, currency),
    atRisk: normalizeMoney(riskAmountRaw, currency),
    subject,
    buyerStatement: buyerSide,
    sellerStatement: sellerSide,
    reviewNotes: reviewNotes || preset?.reviewNotes || current.reviewNotes,
    buyerClaims: preset ? cloneData(preset.buyerClaims) : current.buyerClaims,
    timeline: preset ? cloneData(preset.timeline) : current.timeline,
    evidence: preset ? cloneData(preset.evidence) : current.evidence,
    disagreements: preset ? cloneData(preset.disagreements) : current.disagreements,
    opsAction: current.opsAction,
    playbookTasks: current.playbookTasks || [],
    actionNote: current.actionNote || "",
  };

  CASES = CASES.map((item) => (item.id === selectedCaseId ? updated : item));
  selectedCaseId = updated.id;
  renderCaseQueue();
  fillCaseDetail(updated);
  saveDecisionEvent({
    caseId: updated.id,
    projectName: updated.id,
    type: "case_updated",
    outcome: updated.type,
    action: updated.requestedAction,
    notes: "Operator updated the active dispute intake and normalized it for policy review.",
    timestamp: new Date().toLocaleString(),
  });
}

function saveEvidenceRecord(form) {
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const evidenceIndexRaw = String(form.get("evidenceIndex") || "").trim();
  const nextRecord = {
    side: String(form.get("side") || "buyer").trim(),
    status: String(form.get("status") || "submitted").trim(),
    source: String(form.get("source") || "").trim(),
    title: String(form.get("title") || "").trim(),
    detail: String(form.get("detail") || "").trim(),
  };

  const evidence = cloneData(selectedCase.evidence);
  const isEditing = evidenceIndexRaw !== "";

  if (isEditing) {
    evidence[Number(evidenceIndexRaw)] = nextRecord;
  } else {
    evidence.push(nextRecord);
  }

  const updated = {
    ...selectedCase,
    evidence,
  };

  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  saveDecisionEvent({
    caseId: updated.id,
    projectName: updated.id,
    type: isEditing ? "evidence_updated" : "evidence_added",
    outcome: nextRecord.side,
    action: nextRecord.status,
    notes: `${isEditing ? "Updated" : "Added"} ${nextRecord.side} evidence: ${nextRecord.title}.`,
    timestamp: new Date().toLocaleString(),
  });
}

function deleteEvidenceRecord(index) {
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const target = selectedCase.evidence[index];
  if (!target) return;

  const updated = {
    ...selectedCase,
    evidence: selectedCase.evidence.filter((_, itemIndex) => itemIndex !== index),
  };

  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  saveDecisionEvent({
    caseId: updated.id,
    projectName: updated.id,
    type: "evidence_deleted",
    outcome: target.side,
    action: target.status,
    notes: `Deleted ${target.side} evidence: ${target.title}.`,
    timestamp: new Date().toLocaleString(),
  });
}

function applyResolutionAction(action, note = "") {
  const normalizedAction = normalizeActionValue(action);
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const generatedTasks = actionTaskTemplates(normalizedAction, selectedCase);
  const updated = {
    ...selectedCase,
    requestedAction: normalizedAction,
    opsAction: normalizedAction,
    status: resolutionStatusForAction(normalizedAction),
    playbookTasks: generatedTasks,
    actionNote: note,
    reviewNotes: note
      ? `${selectedCase.reviewNotes}\nAction note: ${note}`.trim()
      : selectedCase.reviewNotes,
  };

  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  recommendedAction.textContent = normalizedAction;
  recommendedActionReason.textContent = actionReasonForValue(normalizedAction, note);
  saveDecisionEvent({
    caseId: updated.id,
    projectName: updated.id,
    type: "resolution_action_applied",
    outcome: normalizedAction,
    action: normalizedAction,
    notes: actionReasonForValue(normalizedAction, note),
    timestamp: new Date().toLocaleString(),
  });
}

function ingestStructuredSource(form) {
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const sourceType = String(form.get("sourceType") || "").trim();
  const payload = parseJsonField(String(form.get("payload") || "{}"), "structured payload");
  const sourceMap = {
    order_ledger: { side: "authority", status: "authoritative", source: "order ledger" },
    payment_ledger: { side: "authority", status: "authoritative", source: "payment ledger" },
    shipping_events: { side: "authority", status: "time-verified", source: "shipping events" },
    support_crm: { side: "seller", status: "submitted", source: "support CRM" },
    fraud_signal: { side: "authority", status: "needs-review", source: "fraud signal" },
  };
  const preset = sourceMap[sourceType] || { side: "authority", status: "submitted", source: sourceType || "structured source" };
  const title = `${actionLabel(sourceType)} import`;
  const detail = payload.summary || pretty(payload);
  const nextEvidence = {
    title,
    side: preset.side,
    status: preset.status,
    source: preset.source,
    detail,
  };

  const updated = {
    ...selectedCase,
    evidence: [...selectedCase.evidence, nextEvidence],
  };

  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  saveDecisionEvent({
    caseId: updated.id,
    projectName: updated.id,
    type: "source_ingested",
    outcome: sourceType,
    action: preset.status,
    notes: `Imported ${title} into the evidence vault.`,
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
    recommendedAction.textContent = data.nextAction === "hold_submission" ? "hold_payout" : "fraud_review";
    recommendedActionReason.textContent =
      "The current evidence did not cleanly unlock the workflow, so the dispute should be escalated for manual operations review.";
    return;
  }

  verdictCard.classList.add("verdict-allow");
  verdictCard.innerHTML =
    `<strong>Resolution unlocked</strong><span>Policy verdict unlocked the workflow. Next action: ${data.nextAction}</span>`;
  recommendedAction.textContent = getSelectedCase().requestedAction;
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
  activateDetailTab("builderTab");
  activateTab("packetTab");
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
buildPresetOptions();

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
  caseCreateForm.elements.presetType.value = "";
});

caseDetailForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(caseDetailForm);
  updateCurrentCase(form);
});

evidenceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(evidenceForm);
  saveEvidenceRecord(form);
});

resetEvidenceButton.addEventListener("click", () => {
  resetEvidenceEditor();
});

sourceIngestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(sourceIngestForm);
  ingestStructuredSource(form);
});

resetSourceIngestButton.addEventListener("click", () => {
  resetSourceIngest();
});

createPresetSelect.addEventListener("change", () => {
  applyPresetValuesToForm(caseCreateForm, createPresetSelect.value);
});

detailPresetSelect.addEventListener("change", () => {
  applyPresetValuesToForm(caseDetailForm, detailPresetSelect.value);
});

applyBundleButton.addEventListener("click", () => {
  try {
    applyBundleToWorkflow();
    activateTab("workflowTab");
    activateDetailTab("builderTab");
  } catch (error) {
    workflowOutput.textContent = error.message;
  }
});

jumpToBuilderButton.addEventListener("click", () => {
  const form = new FormData(caseDetailForm);
  updateCurrentCase(form);
  activateDetailTab("builderTab");
  buildBundle();
});

[buyerVault, sellerVault, authorityVault].forEach((target) => {
  target.addEventListener("click", (event) => {
    const button = event.target.closest("[data-evidence-action]");
    if (!button) return;

    const evidenceIndex = Number(button.dataset.evidenceIndex);
    const selectedCase = getSelectedCase();
    const item = selectedCase.evidence[evidenceIndex];
    if (!item) return;

    if (button.dataset.evidenceAction === "edit") {
      activateDetailTab("vaultTab");
      hydrateEvidenceEditor(item, evidenceIndex);
      return;
    }

    deleteEvidenceRecord(evidenceIndex);
  });
});

actionChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    actionChips.forEach((item) => item.classList.remove("action-chip-active"));
    chip.classList.add("action-chip-active");
    resolutionActionForm.dataset.selectedAction = chip.dataset.actionValue;
  });
});

resolutionActionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedAction = resolutionActionForm.dataset.selectedAction;
  if (!selectedAction) {
    recommendedActionReason.textContent = "Choose a resolution action before applying it to the active case.";
    return;
  }
  applyResolutionAction(selectedAction, resolutionActionForm.elements.actionNote.value.trim());
});

clearResolutionActionButton.addEventListener("click", () => {
  clearActionSelection();
});

sourceChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    sourceChips.forEach((item) => item.classList.remove("action-chip-active"));
    chip.classList.add("action-chip-active");
    const sourceType = chip.dataset.sourceTemplate;
    sourceIngestForm.elements.sourceType.value = sourceType;
    sourceIngestForm.elements.payload.value = pretty(sourceTemplatePayload(sourceType, getSelectedCase()));
  });
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

detailTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateDetailTab(button.dataset.detailTab);
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
renderOpsMetrics();
renderActionQueueBoard();
loadConfig().catch((error) => {
  contractAddressPill.textContent = `Config error: ${error.message}`;
  runtimeNotice.innerHTML = `<strong>Operations status</strong><span>${error.message}</span>`;
});
