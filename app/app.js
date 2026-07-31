/* ── DOM References ── */
const builderForm = document.querySelector("#builderForm");
const policyForm = document.querySelector("#policyForm");
const workflowForm = document.querySelector("#workflowForm");
const policyOutput = document.querySelector("#policyOutput");
const workflowOutput = document.querySelector("#workflowOutput");
const verdictCard = document.querySelector("#verdictCard");
const contractPill = document.querySelector("#contractPill");
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
const queueSearch = document.querySelector("#queueSearch");
const queueStatusFilter = document.querySelector("#queueStatusFilter");
const recommendedAction = document.querySelector("#recommendedAction");
const recommendedActionReason = document.querySelector("#recommendedActionReason");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll(".tab-content[id$='Tab']");
const detailTabButtons = document.querySelectorAll("[data-detail-tab]");
const detailPanels = document.querySelectorAll(".tab-content[id$='Tab']");
const actionChips = document.querySelectorAll(".action-chip");
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
const decisionHistory = document.querySelector("#decisionHistory");
const createPresetSelect = document.querySelector("#caseCreateForm select[name='presetType']");
const detailPresetSelect = document.querySelector("#detailPreset");
const playbookActionTitle = document.querySelector("#playbookActionTitle");
const playbookActionSummary = document.querySelector("#playbookActionSummary");
const playbookTasks = document.querySelector("#playbookTasks");
const actionQueueBoard = document.querySelector("#actionQueueBoard");

const STORAGE_KEY = "order-resolution-recent-runs-v2";
const HISTORY_STORAGE_KEY = "order-resolution-decision-history-v1";
let queueFilterText = "";
let queueFilterStatus = "all";

/* ── Seed Cases ── */
let CASES = [
  {
    id: "ORD-2048",
    merchant: "NorthStar Grocery",
    buyer: "Olivia Carter",
    seller: "Merchant Resolution Desk",
    subject: "Buyer claims two paid grocery items were missing after delivery and requests a partial refund.",
    type: "missing-item",
    status: "awaiting resolution",
    amount: "248.00 USD",
    atRisk: "74.00 USD",
    paymentStatus: "paid by card",
    fulfillment: "delivered Jul 28, 2026 09:35",
    requestedAction: "partial refund",
    buyerStatement: "I received the delivery bag and invoice, but two paid items listed on the receipt were not inside. I reported the issue within 20 minutes of delivery.",
    sellerStatement: "The store packed the order using the correct SKU list and handed it to the courier. We have a packing note and dispatch scan, but no bag photo after seal.",
    buyerClaims: ["invoice amount matches charged order", "missing items were paid and listed on receipt", "support ticket opened immediately after delivery", "buyer uploaded unpacking photos"],
    reviewNotes: "The case is suitable for partial refund analysis because payment is confirmed, delivery happened, and the disagreement centers on whether the missing items left the store.",
    references: {
      repoUrl: "https://github.com/Jinchainne/genlayer-order-resolution-console",
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
    subject: "Buyer says a refund was promised for spoiled produce but payment has not returned after 5 days.",
    type: "refund-delay",
    status: "evidence ready",
    amount: "312.00 USD",
    atRisk: "129.00 USD",
    paymentStatus: "card captured",
    fulfillment: "refund initiated Jul 24, 2026",
    requestedAction: "approve refund",
    buyerStatement: "Customer support confirmed the vegetables arrived spoiled and promised a refund, but the card charge still appears and no refund receipt has been sent.",
    sellerStatement: "The refund was marked internally, but operations need to confirm whether the payment processor actually created the refund transaction.",
    buyerClaims: ["support chat acknowledged spoilage", "refund promise was stated in writing", "buyer still does not see refund on payment method", "case depends on payment processor evidence"],
    reviewNotes: "This is a strong refund verification case because the dispute depends on authoritative refund state rather than only narrative claims.",
    references: {
      repoUrl: "https://github.com/Jinchainne/genlayer-order-resolution-console",
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
    subject: "Buyer reports the delivered package contained a different order and contests the charge.",
    type: "wrong-order",
    status: "new",
    amount: "188.00 USD",
    atRisk: "188.00 USD",
    paymentStatus: "cashless prepaid",
    fulfillment: "delivered Jul 28, 2026 11:10",
    requestedAction: "full refund",
    buyerStatement: "The delivery bag had another household's items and did not match my receipt. I could not use any of the products and reported it immediately.",
    sellerStatement: "The rider route was busy and there may have been a bag handoff error, but the order was marked delivered correctly in the system.",
    buyerClaims: ["wrong order delivered", "receipt does not match bag contents", "buyer reported the issue immediately", "delivery handoff may have failed"],
    reviewNotes: "This case tests whether the workflow can distinguish a wrong-order delivery from a non-delivery claim and recommend a full refund or escalation.",
    references: {
      repoUrl: "https://github.com/Jinchainne/genlayer-order-resolution-console",
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

/* ── Preset Templates ── */
const TEMPLATE_PRESETS = {
  "delivery-missing": { subject: "A buyer disputes a delivered order because paid items appear missing and requests a partial refund.", claims: ["buyer submitted missing-item claim", "seller submitted packing or dispatch response", "payment and invoice proof are available", "resolution needs evidence-based review"], notes: "Compare buyer claim against payment proof, receipt detail, and seller fulfillment records." },
  "delivery-damaged": { subject: "A buyer requests compensation because delivered goods arrived damaged.", claims: ["buyer uploaded damage evidence", "seller has fulfillment and quality notes", "order and payment records are available", "decision depends on qualitative evidence"], notes: "Connect damage report to delivery timing, product condition evidence, and merchant policy." },
  "payment-refund": { subject: "A buyer says a promised refund has not settled and requests confirmation.", claims: ["refund promise exists in support records", "payment settlement status must be verified", "merchant response has been captured", "authoritative refund proof is central"], notes: "Fetch refund-related proof and determine whether payment has actually been reversed." },
  "order-mismatch": { subject: "A buyer received the wrong delivered order and contests the charge.", claims: ["receipt and delivered items do not match", "delivery logs exist", "buyer and seller statements conflict", "decision may lead to full refund or escalation"], notes: "Evaluate whether mismatch is well-supported enough for refund approval." },
  "delivery-late": { subject: "A buyer requests compensation because a promised delivery window was missed.", claims: ["promised delivery window exists", "actual delivery completed late", "seller attached carrier timing records", "resolution may lead to refund, credit, or denial"], notes: "Compare promised fulfillment window against authoritative carrier completion time." },
  "chargeback-risk": { subject: "A buyer disputes a charge as unauthorized while merchant relies on auth records.", claims: ["buyer disputes charge authorization", "seller attached auth or risk evidence", "payment capture is authoritative", "payout release should depend on evidence quality"], notes: "Reconcile account, device, and payment records before deciding payout." },
  "service-cancellation": { subject: "A customer says cancellation should have stopped renewal billing.", claims: ["buyer claims cancellation before renewal", "seller has subscription lifecycle records", "billing event timing is authoritative", "resolution may unlock reversal or denial"], notes: "Compare cancellation events and billing ledger timing." },
  "counterfeit-quality": { subject: "A buyer claims an order is counterfeit or below listing quality.", claims: ["buyer attached authenticity concerns", "seller disputes counterfeit claim", "order and listing records available", "qualitative evidence matters"], notes: "Align buyer evidence, merchant listing proof, and authenticity records." },
  "warranty-claim": { subject: "A buyer seeks replacement or refund under warranty.", claims: ["buyer claims defect within support period", "seller cites warranty terms", "proof of purchase and defect evidence available", "resolution may unlock replacement or denial"], notes: "Assess warranty timing, purchase proof, and defect evidence." },
};

const GLOBAL_DISPUTE_PRESETS = {
  "missing-item": { label: "Missing items after delivery", templateKey: "delivery-missing", requestedAction: "partial refund", status: "awaiting resolution", paymentStatus: "paid by card", fulfillment: "delivery completed", subject: "Buyer says paid items were missing from a delivered order.", buyerStatement: "The order arrived, but paid items shown on the receipt were missing from the package.", sellerStatement: "The merchant marked the order packed and delivered, but must verify whether the missing items actually left the store.", buyerClaims: ["paid items appear missing after delivery", "invoice and payment proof exist", "seller packing records should be checked", "case depends on evidence quality"], reviewNotes: "Use buyer unpacking proof, invoice data, and seller fulfillment records before allowing a partial refund.", timeline: [{ time: "T1", title: "Order paid", description: "Buyer completed payment." }, { time: "T2", title: "Fulfillment completed", description: "Merchant marked order packed." }, { time: "T3", title: "Delivery received", description: "Buyer received the package." }, { time: "T4", title: "Dispute opened", description: "Buyer reported missing items." }], evidence: [{ title: "Buyer unpacking proof", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached photos from package opening." }, { title: "Receipt or invoice", side: "buyer", source: "buyer account", status: "submitted", detail: "Proof that missing items were paid for." }, { title: "Packing record", side: "seller", source: "merchant ops", status: "submitted", detail: "Picker or packing confirmation records." }, { title: "Dispatch confirmation", side: "seller", source: "merchant system", status: "submitted", detail: "Dispatch or handoff timing." }, { title: "Payment settlement", side: "authority", source: "payment ledger", status: "authoritative", detail: "Payment settled before delivery." }, { title: "Order line items", side: "authority", source: "merchant checkout", status: "authoritative", detail: "Order record confirms expected items." }], disagreements: ["Buyer says order was incomplete on arrival.", "Seller believes all items may have been packed.", "Authoritative records should anchor the final decision."] },
  "damaged-goods": { label: "Damaged goods", templateKey: "delivery-damaged", requestedAction: "approve refund", status: "evidence ready", paymentStatus: "paid by card", fulfillment: "delivery completed", subject: "Buyer requests refund because delivered goods arrived damaged.", buyerStatement: "The order arrived damaged and cannot be used safely.", sellerStatement: "The merchant needs to verify whether damage happened before dispatch or after delivery.", buyerClaims: ["buyer attached photos of damaged goods", "seller has order and handling records", "refund depends on qualitative review", "timing of damage report matters"], reviewNotes: "Review item condition evidence, report timing, and merchant handling notes.", timeline: [{ time: "T1", title: "Order fulfilled", description: "Merchant completed order preparation." }, { time: "T2", title: "Delivery completed", description: "Buyer received the order." }, { time: "T3", title: "Damage report opened", description: "Buyer reported condition issues." }, { time: "T4", title: "Merchant review started", description: "Seller reviewed the damage claim." }], evidence: [{ title: "Damage photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Buyer attached condition photos." }, { title: "Complaint timing", side: "buyer", source: "support desk", status: "time-verified", detail: "Buyer filed complaint within reviewable window." }, { title: "Packing note", side: "seller", source: "merchant ops", status: "submitted", detail: "Seller attached handling notes." }, { title: "Dispatch record", side: "seller", source: "merchant system", status: "submitted", detail: "Dispatch timing and handoff data." }, { title: "Order record", side: "authority", source: "merchant ledger", status: "authoritative", detail: "Order and paid items confirmed." }, { title: "Delivery completion", side: "authority", source: "logistics backend", status: "authoritative", detail: "Delivery timing verified." }], disagreements: ["Buyer says goods were unusable.", "Seller questions when damage occurred.", "Condition still needs qualitative judgment."] },
  "refund-delay": { label: "Refund not received", templateKey: "payment-refund", requestedAction: "approve refund", status: "evidence ready", paymentStatus: "refund pending", fulfillment: "refund review in progress", subject: "Buyer says a promised refund has not arrived.", buyerStatement: "Support said a refund would be issued, but the charge is still present.", sellerStatement: "The merchant believes refund may have been initiated, but processor evidence is required.", buyerClaims: ["refund promise exists", "buyer still sees original charge", "processor proof is decisive", "policy should deny weak claims without settlement evidence"], reviewNotes: "Use authoritative refund settlement evidence before deciding.", timeline: [{ time: "T1", title: "Issue acknowledged", description: "Merchant recognized the issue." }, { time: "T2", title: "Refund promised", description: "Support communicated refund intent." }, { time: "T3", title: "Buyer checks account", description: "Buyer still sees original charge." }, { time: "T4", title: "Dispute opened", description: "Buyer requests proof or reversal." }], evidence: [{ title: "Refund promise log", side: "buyer", source: "support message", status: "submitted", detail: "Merchant communication promising refund." }, { title: "Card statement", side: "buyer", source: "bank app", status: "submitted", detail: "Still-visible original charge." }, { title: "Refund initiation note", side: "seller", source: "merchant ops", status: "submitted", detail: "Internal refund action." }, { title: "Processor reference", side: "seller", source: "payments team", status: "pending-proof", detail: "Still needs processor confirmation." }, { title: "Original charge settlement", side: "authority", source: "payment ledger", status: "authoritative", detail: "Original charge confirmed." }, { title: "Refund settlement receipt", side: "authority", source: "processor ledger", status: "missing", detail: "Refund settlement proof still missing." }], disagreements: ["Buyer says refund never arrived.", "Seller says refund may still be processing.", "Processor evidence should decide the outcome."] },
  "wrong-order": { label: "Wrong order delivered", templateKey: "order-mismatch", requestedAction: "full refund", status: "new", paymentStatus: "paid before delivery", fulfillment: "delivery completed", subject: "Buyer says the delivered package contained the wrong order.", buyerStatement: "The delivered contents do not match the receipt.", sellerStatement: "The merchant suspects a picking or handoff mismatch.", buyerClaims: ["delivered items do not match receipt", "buyer reported immediately", "seller should check route records", "wrong-order claims require qualitative review"], reviewNotes: "Compare buyer bag photos, route logs, and order records.", timeline: [{ time: "T1", title: "Order picked", description: "Merchant prepared order for dispatch." }, { time: "T2", title: "Delivery completed", description: "Buyer received the order." }, { time: "T3", title: "Mismatch found", description: "Buyer noticed items did not match." }, { time: "T4", title: "Dispute opened", description: "Buyer requested correction or refund." }], evidence: [{ title: "Bag content photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Photos of incorrect contents." }, { title: "Receipt comparison", side: "buyer", source: "buyer account", status: "submitted", detail: "Expected item list or invoice." }, { title: "Route log", side: "seller", source: "logistics backend", status: "submitted", detail: "Route or bag assignment records." }, { title: "Dispatch completion", side: "seller", source: "merchant system", status: "submitted", detail: "Dispatch and completion events." }, { title: "Expected order contents", side: "authority", source: "order ledger", status: "authoritative", detail: "Confirms what should have been delivered." }, { title: "Delivery completion", side: "authority", source: "logistics ledger", status: "authoritative", detail: "Delivery and rider metadata available." }], disagreements: ["Buyer says wrong order arrived.", "Seller says handoff mismatch possible but not proven.", "Authority records confirm expected order and delivery path."] },
  "late-delivery": { label: "Late delivery compensation", templateKey: "delivery-late", requestedAction: "delivery credit", status: "new", paymentStatus: "paid before dispatch", fulfillment: "delivery completed late", subject: "Buyer says a promised delivery window was missed.", buyerStatement: "The order arrived after the promised window.", sellerStatement: "The merchant acknowledges delay but wants carrier timing checked.", buyerClaims: ["promised delivery window existed", "actual delivery missed the promise", "carrier timing logs exist", "compensation depends on policy"], reviewNotes: "Use checkout SLA and carrier logs to determine compensation.", timeline: [{ time: "T1", title: "Priority shipping selected", description: "Buyer paid for faster delivery." }, { time: "T2", title: "Transit delay", description: "Carrier hit a routing delay." }, { time: "T3", title: "Late delivery", description: "Order arrived beyond promised window." }, { time: "T4", title: "Dispute opened", description: "Buyer requested credit or reversal." }], evidence: [{ title: "SLA promise", side: "buyer", source: "buyer upload", status: "submitted", detail: "Promised delivery timing." }, { title: "Complaint timing", side: "buyer", source: "support desk", status: "time-verified", detail: "Claim opened after late order." }, { title: "Carrier delay note", side: "seller", source: "carrier feed", status: "submitted", detail: "Routing or weather delay records." }, { title: "Merchant response", side: "seller", source: "ops desk", status: "submitted", detail: "Why order missed SLA." }, { title: "Promised ship window", side: "authority", source: "checkout system", status: "authoritative", detail: "Checkout confirms promised delivery level." }, { title: "Actual delivery time", side: "authority", source: "carrier ledger", status: "authoritative", detail: "Carrier confirms late completion." }], disagreements: ["Buyer says promised delivery was missed.", "Seller may argue compensation should be limited.", "Authority timing should determine outcome."] },
  "chargeback-risk": { label: "Unauthorized payment / chargeback", templateKey: "chargeback-risk", requestedAction: "hold payout", status: "evidence ready", paymentStatus: "captured payment under dispute", fulfillment: "fulfillment may already be released", subject: "Buyer disputes a charge as unauthorized.", buyerStatement: "I did not authorize this transaction.", sellerStatement: "The merchant believes session evidence supports a valid purchase.", buyerClaims: ["buyer claims unauthorized charge", "seller has risk records", "payout control matters", "auth evidence should be reviewed"], reviewNotes: "Suited for digital commerce where payout must be held based on evidence quality.", timeline: [{ time: "T1", title: "Session started", description: "Account or device activity preceded payment." }, { time: "T2", title: "Payment captured", description: "Merchant captured the charge." }, { time: "T3", title: "Dispute filed", description: "Buyer alleged fraud." }, { time: "T4", title: "Review opened", description: "Merchant moved case into risk review." }], evidence: [{ title: "Issuer complaint", side: "buyer", source: "issuer notice", status: "submitted", detail: "Chargeback or unauthorized report." }, { title: "Identity note", side: "buyer", source: "support desk", status: "submitted", detail: "Why transaction is disputed." }, { title: "Device log", side: "seller", source: "risk engine", status: "submitted", detail: "Device or login evidence." }, { title: "Fulfillment log", side: "seller", source: "merchant backend", status: "submitted", detail: "Release or shipping timing." }, { title: "Auth record", side: "authority", source: "auth service", status: "authoritative", detail: "Account access events." }, { title: "Charge settlement", side: "authority", source: "payment ledger", status: "authoritative", detail: "Payment capture confirmed." }], disagreements: ["Buyer says charge is fraudulent.", "Seller says session evidence supports validity.", "Auth and payment records should determine outcome."] },
  "counterfeit-quality": { label: "Counterfeit or listing mismatch", templateKey: "counterfeit-quality", requestedAction: "return and refund", status: "awaiting resolution", paymentStatus: "paid before delivery", fulfillment: "product delivered", subject: "Buyer says the product is counterfeit or different from listing.", buyerStatement: "The received product does not match the listing.", sellerStatement: "The merchant disputes the authenticity claim.", buyerClaims: ["buyer says product differs from listing", "authenticity disputed", "seller has listing records", "qualitative comparison required"], reviewNotes: "Useful for marketplaces where listing mismatch requires narrative review.", timeline: [{ time: "T1", title: "Order delivered", description: "Buyer received the product." }, { time: "T2", title: "Concern raised", description: "Buyer compared against listing." }, { time: "T3", title: "Dispute opened", description: "Buyer requested corrective action." }, { time: "T4", title: "Merchant review", description: "Seller attached sourcing evidence." }], evidence: [{ title: "Comparison photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Product and packaging comparison." }, { title: "Listing screenshot", side: "buyer", source: "buyer account", status: "submitted", detail: "Original listing details." }, { title: "Sourcing note", side: "seller", source: "merchant ops", status: "submitted", detail: "Supplier or batch information." }, { title: "Return policy", side: "seller", source: "policy desk", status: "submitted", detail: "Return or authenticity policy." }, { title: "Order record", side: "authority", source: "order ledger", status: "authoritative", detail: "Confirms purchased listing." }, { title: "Catalog metadata", side: "authority", source: "catalog system", status: "needs-review", detail: "SKU metadata should be reconciled." }], disagreements: ["Buyer says product doesn't match listing.", "Seller disputes interpretation.", "Listing and evidence quality should drive resolution."] },
  "service-cancellation": { label: "Subscription cancellation billing", templateKey: "service-cancellation", requestedAction: "reverse renewal", status: "awaiting resolution", paymentStatus: "renewal captured", fulfillment: "service remained active", subject: "Buyer says subscription should have been canceled before billing.", buyerStatement: "I canceled before renewal, but billing still happened.", sellerStatement: "The merchant needs to verify whether cancellation completed before renewal.", buyerClaims: ["buyer claims cancellation before renewal", "merchant renewal still fired", "billing and cancellation logs decisive", "may end in reversal or denial"], reviewNotes: "Expands console into SaaS and membership support operations.", timeline: [{ time: "T1", title: "Cancellation attempt", description: "Buyer says they canceled." }, { time: "T2", title: "Renewal charge", description: "Merchant billing renewed account." }, { time: "T3", title: "Dispute opened", description: "Buyer requested reversal." }, { time: "T4", title: "Lifecycle review", description: "Seller checked billing logs." }], evidence: [{ title: "Cancellation proof", side: "buyer", source: "buyer inbox", status: "submitted", detail: "Cancellation proof or email." }, { title: "Renewal charge", side: "buyer", source: "bank app", status: "submitted", detail: "Renewal charge proof." }, { title: "Subscription log", side: "seller", source: "subscription backend", status: "submitted", detail: "State-transition records." }, { title: "Support log", side: "seller", source: "CRM", status: "submitted", detail: "Support interactions." }, { title: "Billing ledger", side: "authority", source: "billing ledger", status: "authoritative", detail: "Renewal billing time confirmed." }, { title: "Cancellation event", side: "authority", source: "subscription service", status: "needs-review", detail: "Cancellation timing must be reconciled." }], disagreements: ["Buyer says cancellation was before billing.", "Seller says account may have been active.", "Authority events should decide outcome."] },
  "warranty-claim": { label: "Warranty replacement or refund", templateKey: "warranty-claim", requestedAction: "approve replacement", status: "evidence ready", paymentStatus: "paid in full", fulfillment: "device in-use", subject: "Buyer says a product failed within the support period.", buyerStatement: "The product stopped working within the warranty window.", sellerStatement: "The merchant needs to review purchase timing and defect evidence.", buyerClaims: ["buyer claims defect within support period", "seller has warranty records", "proof of purchase essential", "may resolve as replacement or denial"], reviewNotes: "Useful for electronics and durable goods support teams.", timeline: [{ time: "T1", title: "Original purchase", description: "Buyer purchased the product." }, { time: "T2", title: "Defect reported", description: "Buyer reported defect within window." }, { time: "T3", title: "Review started", description: "Seller checked eligibility." }, { time: "T4", title: "Resolution pending", description: "Policy-backed decision pending." }], evidence: [{ title: "Defect photos", side: "buyer", source: "buyer upload", status: "submitted", detail: "Proof of product failure." }, { title: "Proof of purchase", side: "buyer", source: "buyer account", status: "submitted", detail: "Receipt and order history." }, { title: "Warranty terms", side: "seller", source: "merchant support", status: "submitted", detail: "Warranty clauses." }, { title: "Diagnostics", side: "seller", source: "repair desk", status: "submitted", detail: "Troubleshooting notes." }, { title: "Purchase ledger", side: "authority", source: "order ledger", status: "authoritative", detail: "Purchase timing confirmed." }, { title: "Eligibility window", side: "authority", source: "policy service", status: "authoritative", detail: "Dates checked against policy." }], disagreements: ["Buyer says failure should be covered.", "Seller says terms may limit coverage.", "Purchase timing and evidence should drive decision."] },
};

/* ── Extra seed cases ── */
function cloneData(value) { return JSON.parse(JSON.stringify(value)); }
function baseReferences() {
  return { repoUrl: "https://github.com/Jinchainne/genlayer-order-resolution-console", liveApp: "https://genlayer-policy-eco.vercel.app/", contractUrl: "https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108", deployTxUrl: "https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111", createPolicyTxUrl: "https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083", evaluateTxUrl: "https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121" };
}

function makeSeedCase({ id, merchant, buyer, seller, type, amount, atRisk, paymentStatus, fulfillment }) {
  const preset = GLOBAL_DISPUTE_PRESETS[type];
  return { id, merchant, buyer, seller, subject: preset.subject, type, status: preset.status, amount, atRisk, paymentStatus: paymentStatus || preset.paymentStatus, fulfillment: fulfillment || preset.fulfillment, requestedAction: preset.requestedAction, buyerStatement: preset.buyerStatement, sellerStatement: preset.sellerStatement, buyerClaims: cloneData(preset.buyerClaims), reviewNotes: preset.reviewNotes, references: baseReferences(), timeline: cloneData(preset.timeline), evidence: cloneData(preset.evidence), disagreements: cloneData(preset.disagreements) };
}

CASES.push(
  makeSeedCase({ id: "ORD-2143", merchant: "MetroParcel EU", buyer: "Amelia Novak", seller: "Cross-Border Delivery Ops", type: "late-delivery", amount: "96.00 EUR", atRisk: "24.00 EUR", paymentStatus: "paid by wallet", fulfillment: "delivered Jul 27, 2026 18:10" }),
  makeSeedCase({ id: "ORD-2191", merchant: "NovaPay Marketplace", buyer: "Marcus Lee", seller: "Chargeback Response Team", type: "chargeback-risk", amount: "420.00 USD", atRisk: "420.00 USD", paymentStatus: "card captured", fulfillment: "digital goods released Jul 28, 2026 02:10" }),
  makeSeedCase({ id: "ORD-2230", merchant: "StreamSpace Global", buyer: "Lina Hassan", seller: "Subscription Support", type: "service-cancellation", amount: "39.00 USD", atRisk: "39.00 USD", paymentStatus: "renewal captured", fulfillment: "subscription renewed Jul 27, 2026" }),
);

let contractAddress = "";
let latestBundle = null;
let selectedCaseId = CASES[0].id;

/* ── Helpers ── */
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function pretty(value) { return JSON.stringify(value, null, 2); }
function parseJsonField(value, fallbackLabel) { try { return JSON.parse(value); } catch (error) { throw new Error(`Invalid ${fallbackLabel}: ${error.message}`); } }
function listFromMultiline(value) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
function compactUrls(urls) { return urls.filter((url) => typeof url === "string" && url.trim() !== ""); }
function splitMoney(value) { const raw = String(value || "").trim(); const amountMatch = raw.match(/[\d.,]+/); const currencyMatch = raw.match(/[A-Z]{3,}/); return { amount: amountMatch ? amountMatch[0].replace(/,/g, "") : "", currency: currencyMatch ? currencyMatch[0] : "USD" }; }
function normalizeMoney(value, currency) { const amount = Number(String(value).replace(/[^0-9.]/g, "")) || 0; return `${amount.toFixed(2)} ${currency.toUpperCase()}`; }
function normalizeMoneyNumber(value) { return Number(String(value || "").replace(/[^0-9.]/g, "")) || 0; }
function titleFromClaimType(claimType) { const normalized = String(claimType || "custom-dispute").trim(); return normalized.includes("-") ? normalized : normalized.toLowerCase().replace(/\s+/g, "-"); }
function actionLabel(value) { return String(value || "").split("_").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
function normalizeActionValue(value) { return String(value || "").trim().toLowerCase().replace(/\s+/g, "_"); }
function caseNeedsAuthority(caseItem) { return caseItem.evidence.some((item) => item.side === "authority" && ["missing", "needs-review", "pending-proof"].includes(item.status)); }

/* ── Status helpers ── */
function statusClass(status) {
  if (status === "new") return "status-new";
  if (status === "evidence ready") return "status-evidence";
  if (status === "awaiting resolution") return "status-awaiting";
  if (status.includes("refund") || status.includes("approved") || status.includes("credit")) return "status-approved";
  if (status.includes("hold")) return "status-hold";
  if (status.includes("fraud")) return "status-fraud";
  return "status-new";
}

function resolutionStatusForAction(action) {
  const map = { approve_refund: "refund approved", partial_refund: "partial refund approved", reship_order: "reship scheduled", store_credit: "credit issued", hold_payout: "payout on hold", fraud_review: "fraud review queue", deny_claim: "claim denied" };
  return map[action] || "resolution updated";
}

function actionReasonForValue(action, note = "") {
  const map = { approve_refund: "The dispute record supports reversing payment to the buyer.", partial_refund: "The record supports only partial reimbursement.", reship_order: "The issue looks fulfillment-related, so replacement shipment is the cleaner remedy.", store_credit: "The case supports compensation without full cash reversal.", hold_payout: "Risk or unresolved evidence means merchant payout should stay frozen.", fraud_review: "Conflicting evidence requires specialist fraud review.", deny_claim: "The evidence does not justify compensation at this stage." };
  return note || map[action] || "The current case was mapped to a concrete operational action.";
}

function actionTaskTemplates(action, caseItem) {
  const templates = {
    approve_refund: [{ lane: "payments", title: "Issue refund through processor", owner: "Payments Ops" }, { lane: "support", title: "Notify buyer of refund confirmation", owner: "Support Desk" }, { lane: "audit", title: "Store refund proof in audit trail", owner: "Risk Audit" }],
    partial_refund: [{ lane: "payments", title: "Approve partial reimbursement", owner: "Payments Ops" }, { lane: "merchant", title: "Document compensated SKUs", owner: "Merchant Desk" }, { lane: "support", title: "Send split-resolution notice", owner: "Support Desk" }],
    reship_order: [{ lane: "fulfillment", title: "Create replacement order", owner: "Fulfillment Team" }, { lane: "logistics", title: "Prioritize replacement routing", owner: "Logistics Control" }, { lane: "support", title: "Confirm new ETA to buyer", owner: "Support Desk" }],
    store_credit: [{ lane: "wallet", title: "Issue store credit", owner: "Customer Wallet Ops" }, { lane: "support", title: "Explain credit validity", owner: "Support Desk" }, { lane: "analytics", title: "Tag for retention follow-up", owner: "CRM Ops" }],
    hold_payout: [{ lane: "risk", title: "Freeze merchant payout", owner: "Risk Control" }, { lane: "finance", title: "Flag settlement for manual approval", owner: "Finance Ops" }, { lane: "audit", title: "Request additional evidence", owner: "Risk Audit" }],
    fraud_review: [{ lane: "fraud", title: "Escalate to fraud review queue", owner: "Fraud Desk" }, { lane: "identity", title: "Compare auth and device events", owner: "Identity Risk" }, { lane: "support", title: "Hold final notice pending outcome", owner: "Support Desk" }],
    deny_claim: [{ lane: "support", title: "Send denial rationale to buyer", owner: "Support Desk" }, { lane: "merchant", title: "Close merchant dispute case", owner: "Merchant Desk" }, { lane: "audit", title: "Archive denial evidence", owner: "Risk Audit" }],
  };
  return (templates[action] || []).map((task, index) => ({ id: `${caseItem.id}-${action}-${index + 1}`, caseId: caseItem.id, action, status: index === 0 ? "ready" : "pending", lane: task.lane, owner: task.owner, title: task.title }));
}

function sourceTemplatePayload(sourceType, caseItem) {
  const payloads = {
    order_ledger: { orderId: caseItem.id, merchant: caseItem.merchant, status: "confirmed", totalAmount: caseItem.amount, summary: "Order ledger confirms the purchased items and settlement state." },
    payment_ledger: { orderId: caseItem.id, paymentStatus: caseItem.paymentStatus, amountAtRisk: caseItem.atRisk, summary: "Payment ledger confirms capture, settlement, or refund status." },
    shipping_events: { orderId: caseItem.id, fulfillment: caseItem.fulfillment, latestEvent: "delivery_completed", summary: "Logistics feed confirms route and delivery timing." },
    support_crm: { orderId: caseItem.id, buyer: caseItem.buyer, seller: caseItem.seller, summary: "Support CRM records complaint timing and merchant replies." },
    fraud_signal: { orderId: caseItem.id, signal: "manual_review", summary: "Risk engine surfaced an anomaly requiring fraud-sensitive handling." },
  };
  return payloads[sourceType] || { orderId: caseItem.id, summary: "Structured source payload." };
}

/* ── Tab Management ── */
function activateTab(tabId) {
  tabButtons.forEach((button) => { button.classList.toggle("tab-active", button.dataset.tabTarget === tabId); });
  document.querySelectorAll(`#resolution .tab-content`).forEach((panel) => { panel.classList.toggle("tab-content-active", panel.id === tabId); });
}

function activateDetailTab(tabId) {
  detailTabButtons.forEach((button) => { button.classList.toggle("tab-active", button.dataset.detailTab === tabId); });
  document.querySelectorAll(`#detail .tab-content`).forEach((panel) => { panel.classList.toggle("tab-content-active", panel.id === tabId); });
}

/* ── Queue Rendering ── */
function updateCaseCount() { activeCaseCount.textContent = `${CASES.length} cases`; }

function renderCaseQueue() {
  updateCaseCount();
  const filteredCases = CASES.filter((item) => {
    const matchesStatus = queueFilterStatus === "all" || item.status === queueFilterStatus;
    const haystack = [item.id, item.merchant, item.buyer, item.subject, item.type].join(" ").toLowerCase();
    const matchesText = !queueFilterText || haystack.includes(queueFilterText.toLowerCase());
    return matchesStatus && matchesText;
  });

  caseQueue.innerHTML = filteredCases.map((item) => {
    const activeClass = item.id === selectedCaseId ? " queue-item-active" : "";
    const typeLabel = GLOBAL_DISPUTE_PRESETS[item.type]?.label || titleFromClaimType(item.type);
    return `
      <button type="button" class="queue-item${activeClass}" data-case-id="${item.id}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="queue-item-id">${escapeHtml(item.id)}</span>
          <span class="queue-item-status ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
        </div>
        <div class="queue-item-merchant">${escapeHtml(item.merchant)}</div>
        <div class="queue-item-bottom">
          <span class="queue-item-type">${escapeHtml(typeLabel)}</span>
          <span class="queue-item-amount">${escapeHtml(item.atRisk)}</span>
        </div>
      </button>
    `;
  }).join("");

  if (!filteredCases.length) {
    caseQueue.innerHTML = `<p class="empty-state">No cases match the current filters.</p>`;
  }

  caseQueue.querySelectorAll("[data-case-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCaseId = button.dataset.caseId;
      renderCaseQueue();
      fillCaseDetail(getCaseById(selectedCaseId));
      activateDetailTab("overviewTab");
    });
  });
}

/* ── Case Detail ── */
function getCaseById(caseId) { return CASES.find((item) => item.id === caseId) || CASES[0]; }
function getSelectedCaseIndex() { return CASES.findIndex((item) => item.id === selectedCaseId); }
function getSelectedCase() { return getCaseById(selectedCaseId); }

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
  resolutionWindow.textContent = "Target: within 24h";

  caseTimeline.innerHTML = caseItem.timeline.map((step) => `
    <div class="timeline-item">
      <div>
        <div class="timeline-title">${escapeHtml(step.title)}</div>
        <div class="timeline-desc">${escapeHtml(step.description)}</div>
      </div>
      <span class="timeline-time">${escapeHtml(step.time)}</span>
    </div>
  `).join("");

  authoritativeEvidence.innerHTML = caseItem.evidence.filter((item) => item.side === "authority").map((item) => `
    <div class="evidence-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.detail)}</p>
      <span class="evidence-status ${item.status}">${escapeHtml(item.source)} · ${escapeHtml(item.status)}</span>
    </div>
  `).join("");

  disagreementList.innerHTML = caseItem.disagreements.map((item) => `<div class="disagreement-item">${escapeHtml(item)}</div>`).join("");
  evidenceCount.textContent = `${caseItem.evidence.filter((item) => item.side === "authority").length} sources`;
  renderEvidenceVault(caseItem);
  hydrateFormsFromCase(caseItem);
}

/* ── Vault ── */
function renderVaultItems(items, target) {
  target.innerHTML = items.map((item) => `
    <div class="vault-item">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>${escapeHtml(item.title)}</strong>
        <span class="evidence-status ${item.status}">${escapeHtml(item.status)}</span>
      </div>
      <p>${escapeHtml(item.detail)}</p>
      <div class="vault-actions">
        <button type="button" class="vault-btn" data-evidence-action="edit" data-evidence-index="${item.index}">Edit</button>
        <button type="button" class="vault-btn vault-btn-danger" data-evidence-action="delete" data-evidence-index="${item.index}">Delete</button>
      </div>
    </div>
  `).join("");
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
}

/* ── Playbook ── */
function renderPlaybook(caseItem) {
  const activeAction = caseItem.opsAction || normalizeActionValue(caseItem.requestedAction);
  const tasks = caseItem.playbookTasks || actionTaskTemplates(activeAction, caseItem);
  if (!activeAction || !tasks.length) {
    playbookActionTitle.textContent = "No action selected";
    playbookActionSummary.textContent = "Pick an action to see downstream tasks.";
    playbookTasks.innerHTML = `<p class="empty-state">No tasks yet.</p>`;
    return;
  }
  playbookActionTitle.textContent = actionLabel(activeAction);
  playbookActionSummary.textContent = actionReasonForValue(activeAction, caseItem.actionNote || "");
  playbookTasks.innerHTML = tasks.map((task) => `
    <div class="playbook-task">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>${escapeHtml(task.title)}</strong>
        <span class="chip" style="font-size:10px;padding:2px 6px;">${escapeHtml(task.status)}</span>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px;">${escapeHtml(task.lane)} · ${escapeHtml(task.owner)}</div>
      <button type="button" class="vault-btn" style="margin-top:6px;" data-task-action="toggle" data-task-id="${task.id}">${task.status === "done" ? "Reopen" : "Mark done"}</button>
    </div>
  `).join("");
}

function renderActionQueueBoard() {
  const queued = CASES.flatMap((item) => (item.playbookTasks || []).map((task) => ({ ...task, merchant: item.merchant })));
  if (!queued.length) {
    actionQueueBoard.innerHTML = `<p class="empty-state">No tasks queued yet.</p>`;
    return;
  }
  actionQueueBoard.innerHTML = queued.map((task) => `
    <div class="history-item">
      <strong>${escapeHtml(task.caseId)}</strong>
      <p>${escapeHtml(task.title)} · ${escapeHtml(task.owner)} · ${escapeHtml(task.status)}</p>
    </div>
  `).join("");
}

function toggleTaskStatus(taskId) {
  const caseIndex = CASES.findIndex((item) => (item.playbookTasks || []).some((task) => task.id === taskId));
  if (caseIndex === -1) return;
  const caseItem = CASES[caseIndex];
  const tasks = (caseItem.playbookTasks || []).map((task) => task.id === taskId ? { ...task, status: task.status === "done" ? "pending" : "done" } : task);
  const updated = { ...caseItem, playbookTasks: tasks };
  CASES[caseIndex] = updated;
  if (updated.id === selectedCaseId) fillCaseDetail(updated);
  renderActionQueueBoard();
  saveDecisionEvent({ caseId: updated.id, projectName: updated.id, type: "task_status_changed", outcome: taskId, action: tasks.find((task) => task.id === taskId)?.status || "updated", notes: `Updated task ${taskId}.`, timestamp: new Date().toLocaleString() });
}

/* ── Recent Runs & History ── */
function loadRecentRuns() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } }
function loadDecisionHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]"); } catch { return []; } }
function saveDecisionEvent(event) { const current = loadDecisionHistory(); const next = [event, ...current].slice(0, 12); localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next)); renderDecisionHistory(); }
function saveRecentRun(entry) { const current = loadRecentRuns(); const next = [entry, ...current].slice(0, 6); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); renderRecentRuns(); }

function renderRecentRuns() {
  const runs = loadRecentRuns();
  if (!runs.length) { recentRuns.innerHTML = `<p class="empty-state">No reviews yet.</p>`; return; }
  recentRuns.innerHTML = runs.map((run, index) => `
    <div class="history-item">
      <strong>${escapeHtml(run.projectName)}</strong>
      <p>${escapeHtml(run.subject)}</p>
      <button type="button" class="vault-btn" style="margin-top:6px;" data-reuse-index="${index}">Reuse</button>
    </div>
  `).join("");
  recentRuns.querySelectorAll("[data-reuse-index]").forEach((button) => { button.addEventListener("click", () => { applyBundleToWorkflow(runs[Number(button.dataset.reuseIndex)].bundle); }); });
}

function renderDecisionHistory() {
  const history = loadDecisionHistory();
  if (!history.length) { decisionHistory.innerHTML = `<p class="empty-state">No decisions yet.</p>`; return; }
  decisionHistory.innerHTML = history.map((event) => `
    <div class="history-item">
      <strong>${escapeHtml(event.caseId || event.projectName || "Event")}</strong>
      <p>${escapeHtml(event.type)} · ${escapeHtml(event.outcome)}</p>
    </div>
  `).join("");
}

/* ── Form Hydration ── */
function inferTemplateFromCase(caseItem) {
  if (GLOBAL_DISPUTE_PRESETS[caseItem.type]?.templateKey) return GLOBAL_DISPUTE_PRESETS[caseItem.type].templateKey;
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
  recommendedActionReason.textContent = `Pattern: ${caseItem.type}. Build packet, run AI triage, then send through policy workflow.`;
  hydrateCaseEditor(caseItem);
  resetEvidenceEditor();
  resetSourceIngest();
  clearActionSelection();
  renderPlaybook(caseItem);
}

function buildEvidenceFromCase(caseItem) {
  return { projectName: "order-resolution-console", caseId: caseItem.id, merchant: caseItem.merchant, buyer: caseItem.buyer, seller: caseItem.seller, claimType: caseItem.type, requestedAction: caseItem.requestedAction, orderAmount: caseItem.amount, amountAtRisk: caseItem.atRisk, paymentStatus: caseItem.paymentStatus, fulfillmentStatus: caseItem.fulfillment, buyerClaim: caseItem.buyerStatement, sellerResponse: caseItem.sellerStatement, authoritativeSources: caseItem.evidence.map((item) => `${item.title} (${item.source})`), disagreementPoints: caseItem.disagreements, claims: caseItem.buyerClaims, reviewNotes: caseItem.reviewNotes };
}

function buildReferenceUrlsFromCase(caseItem) {
  return compactUrls([caseItem.references.repoUrl, caseItem.references.liveApp, caseItem.references.contractUrl, caseItem.references.deployTxUrl, caseItem.references.createPolicyTxUrl, caseItem.references.evaluateTxUrl]);
}

function resetEvidenceEditor() { evidenceForm.reset(); evidenceForm.elements.evidenceIndex.value = ""; evidenceForm.elements.side.value = "buyer"; evidenceForm.elements.status.value = "submitted"; saveEvidenceButton.textContent = "Add Evidence"; }
function resetSourceIngest() { sourceIngestForm.reset(); sourceIngestForm.elements.sourceType.value = ""; sourceChips.forEach((chip) => chip.classList.remove("chip-active")); }
function clearActionSelection() { actionChips.forEach((chip) => { chip.classList.remove("chip-active"); }); resolutionActionForm.dataset.selectedAction = ""; resolutionActionForm.elements.actionNote.value = ""; }
function hydrateEvidenceEditor(item, index) { evidenceForm.elements.evidenceIndex.value = String(index); evidenceForm.elements.side.value = item.side; evidenceForm.elements.status.value = item.status; evidenceForm.elements.source.value = item.source; evidenceForm.elements.title.value = item.title; evidenceForm.elements.detail.value = item.detail; saveEvidenceButton.textContent = "Update Evidence"; }

/* ── Sync ── */
function syncSelectedCase(caseItem) { renderCaseQueue(); fillCaseDetail(caseItem); renderActionQueueBoard(); }

/* ── Preset Application ── */
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

function buildPresetOptions() {
  const options = Object.entries(GLOBAL_DISPUTE_PRESETS).map(([key, preset]) => `<option value="${escapeHtml(key)}">${escapeHtml(preset.label)}</option>`).join("");
  createPresetSelect.innerHTML = `<option value="">Custom dispute</option>${options}`;
  detailPresetSelect.innerHTML = `<option value="">Custom dispute</option>${options}`;
}

/* ── Case CRUD ── */
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
    id: caseId, merchant, buyer, seller,
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
    buyerClaims: preset ? cloneData(preset.buyerClaims) : [`${claimType} dispute opened`, "buyer submitted statement", "seller response recorded", "case requires qualitative review"],
    reviewNotes: preset?.reviewNotes || "Custom case created by operator.",
    references: baseReferences(),
    timeline: preset ? cloneData(preset.timeline) : [{ time: "Now", title: "Case opened", description: "Operator created a custom dispute." }, { time: "Next", title: "Evidence intake", description: "Attach evidence records." }, { time: "Next", title: "AI triage", description: "Run copilot review." }, { time: "Final", title: "Resolution", description: "Run policy evaluation." }],
    evidence: preset ? cloneData(preset.evidence) : [{ title: "Buyer statement", side: "buyer", source: "manual intake", status: "submitted", detail: buyerSide }, { title: "Seller response", side: "seller", source: "manual intake", status: "submitted", detail: sellerSide }, { title: "Authority placeholder", side: "authority", source: "pending", status: "needs-review", detail: "Attach authoritative source." }],
    disagreements: preset ? cloneData(preset.disagreements) : ["Buyer and seller positions recorded.", "Authority evidence still needed.", "Final decision should be delayed if packet is incomplete."],
  };

  CASES = [customCase, ...CASES];
  selectedCaseId = customCase.id;
  renderCaseQueue();
  fillCaseDetail(customCase);
  buildBundle();
  activateDetailTab("builderTab");
  activateTab("packetTab");
  saveDecisionEvent({ caseId: customCase.id, projectName: customCase.id, type: "custom_case_created", outcome: claimType, action: "collect_evidence", notes: "New custom dispute case added.", timestamp: new Date().toLocaleString() });
}

function updateCurrentCase(form) {
  const current = getCaseById(selectedCaseId);
  const presetKey = String(form.get("presetType") || "").trim();
  const preset = GLOBAL_DISPUTE_PRESETS[presetKey];
  const caseId = String(form.get("caseId") || "").trim();
  const claimTypeValue = String(form.get("claimType") || "").trim();
  const currency = String(form.get("currency") || "USD").trim().toUpperCase();

  const updated = {
    ...current,
    id: caseId,
    type: presetKey || titleFromClaimType(claimTypeValue),
    merchant: String(form.get("merchant") || "").trim(),
    buyer: String(form.get("buyer") || "").trim(),
    seller: String(form.get("seller") || "").trim(),
    status: String(form.get("status") || "").trim(),
    requestedAction: String(form.get("requestedAction") || "").trim(),
    amount: normalizeMoney(String(form.get("orderAmount") || "").trim(), currency),
    atRisk: normalizeMoney(String(form.get("riskAmount") || "").trim(), currency),
    subject: String(form.get("subject") || "").trim(),
    buyerStatement: String(form.get("buyerStatement") || "").trim(),
    sellerStatement: String(form.get("sellerStatement") || "").trim(),
    reviewNotes: String(form.get("reviewNotes") || "").trim() || preset?.reviewNotes || current.reviewNotes,
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
  saveDecisionEvent({ caseId: updated.id, projectName: updated.id, type: "case_updated", outcome: updated.type, action: updated.requestedAction, notes: "Case updated.", timestamp: new Date().toLocaleString() });
}

function saveEvidenceRecord(form) {
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const evidenceIndexRaw = String(form.get("evidenceIndex") || "").trim();
  const nextRecord = { side: String(form.get("side") || "buyer").trim(), status: String(form.get("status") || "submitted").trim(), source: String(form.get("source") || "").trim(), title: String(form.get("title") || "").trim(), detail: String(form.get("detail") || "").trim() };
  const evidence = cloneData(selectedCase.evidence);
  const isEditing = evidenceIndexRaw !== "";
  if (isEditing) { evidence[Number(evidenceIndexRaw)] = nextRecord; } else { evidence.push(nextRecord); }
  const updated = { ...selectedCase, evidence };
  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  saveDecisionEvent({ caseId: updated.id, projectName: updated.id, type: isEditing ? "evidence_updated" : "evidence_added", outcome: nextRecord.side, action: nextRecord.status, notes: `${isEditing ? "Updated" : "Added"} ${nextRecord.side} evidence: ${nextRecord.title}.`, timestamp: new Date().toLocaleString() });
}

function deleteEvidenceRecord(index) {
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const target = selectedCase.evidence[index];
  if (!target) return;
  const updated = { ...selectedCase, evidence: selectedCase.evidence.filter((_, i) => i !== index) };
  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  saveDecisionEvent({ caseId: updated.id, projectName: updated.id, type: "evidence_deleted", outcome: target.side, action: target.status, notes: `Deleted ${target.side} evidence: ${target.title}.`, timestamp: new Date().toLocaleString() });
}

function applyResolutionAction(action, note = "") {
  const normalizedAction = normalizeActionValue(action);
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const generatedTasks = actionTaskTemplates(normalizedAction, selectedCase);
  const updated = { ...selectedCase, requestedAction: normalizedAction, opsAction: normalizedAction, status: resolutionStatusForAction(normalizedAction), playbookTasks: generatedTasks, actionNote: note, reviewNotes: note ? `${selectedCase.reviewNotes}\nAction note: ${note}`.trim() : selectedCase.reviewNotes };
  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  recommendedAction.textContent = normalizedAction;
  recommendedActionReason.textContent = actionReasonForValue(normalizedAction, note);
  saveDecisionEvent({ caseId: updated.id, projectName: updated.id, type: "resolution_action_applied", outcome: normalizedAction, action: normalizedAction, notes: actionReasonForValue(normalizedAction, note), timestamp: new Date().toLocaleString() });
}

function ingestStructuredSource(form) {
  const selectedCase = getSelectedCase();
  const caseIndex = getSelectedCaseIndex();
  const sourceType = String(form.get("sourceType") || "").trim();
  const payload = parseJsonField(String(form.get("payload") || "{}"), "structured payload");
  const sourceMap = { order_ledger: { side: "authority", status: "authoritative", source: "order ledger" }, payment_ledger: { side: "authority", status: "authoritative", source: "payment ledger" }, shipping_events: { side: "authority", status: "time-verified", source: "shipping events" }, support_crm: { side: "seller", status: "submitted", source: "support CRM" }, fraud_signal: { side: "authority", status: "needs-review", source: "fraud signal" } };
  const preset = sourceMap[sourceType] || { side: "authority", status: "submitted", source: sourceType || "structured source" };
  const title = `${actionLabel(sourceType)} import`;
  const detail = payload.summary || pretty(payload);
  const updated = { ...selectedCase, evidence: [...selectedCase.evidence, { title, side: preset.side, status: preset.status, source: preset.source, detail }] };
  CASES[caseIndex] = updated;
  syncSelectedCase(updated);
  saveDecisionEvent({ caseId: updated.id, projectName: updated.id, type: "source_ingested", outcome: sourceType, action: preset.status, notes: `Imported ${title}.`, timestamp: new Date().toLocaleString() });
}

/* ── Bundle & Workflow ── */
function buildBundle() {
  const form = new FormData(builderForm);
  const templateKey = form.get("template");
  const template = TEMPLATE_PRESETS[templateKey];
  const caseName = String(form.get("projectName") || "").trim();
  const caseItem = getCaseById(selectedCaseId);
  const subject = caseItem ? caseItem.subject : template.subject;
  const evidence = { ...buildEvidenceFromCase(caseItem), packetName: caseName, repoUrl: String(form.get("repoUrl") || "").trim(), liveApp: String(form.get("liveApp") || "").trim(), contractExplorer: String(form.get("contractUrl") || "").trim(), artifacts: ["invoice", "payment proof", "merchant response", "support timeline", "contract explorer", "workflow tx"], claims: listFromMultiline(String(form.get("claims") || "")).length ? listFromMultiline(String(form.get("claims") || "")) : template.claims, reviewNotes: String(form.get("reviewNotes") || "").trim() || template.notes, txProofs: compactUrls([String(form.get("deployTxUrl") || "").trim(), String(form.get("createPolicyTxUrl") || "").trim(), String(form.get("evaluateTxUrl") || "").trim()]) };
  const referenceUrls = compactUrls([evidence.repoUrl, evidence.liveApp, evidence.contractExplorer, String(form.get("deployTxUrl") || "").trim(), String(form.get("createPolicyTxUrl") || "").trim(), String(form.get("evaluateTxUrl") || "").trim()]);
  latestBundle = { subject, evidence, referenceUrls, projectName: caseName };
  generatedSubject.textContent = subject;
  generatedEvidence.textContent = pretty(evidence);
  generatedReferences.textContent = pretty(referenceUrls);
  activateDetailTab("builderTab");
  activateTab("packetTab");
  recommendedAction.textContent = caseItem.requestedAction;
  recommendedActionReason.textContent = "Case packet prepared. Run AI triage or send to policy workflow.";
  saveRecentRun({ projectName: caseName || caseItem.id, subject, executionStatus: "packet-ready", nextAction: "triage_or_resolve", evaluationId: "", timestamp: new Date().toLocaleString(), bundle: latestBundle });
  saveDecisionEvent({ caseId: caseItem.id, projectName: caseName, type: "case_packet_built", outcome: "packet ready", action: "triage_or_resolve", notes: "Structured evidence into resolution packet.", timestamp: new Date().toLocaleString() });
}

function applyBundleToWorkflow(bundle = latestBundle) {
  if (!bundle) throw new Error("Build a case packet first.");
  workflowForm.elements.subject.value = bundle.subject;
  workflowForm.elements.evidence.value = pretty(bundle.evidence);
  workflowForm.elements.referenceUrls.value = pretty(bundle.referenceUrls);
  workflowOutput.textContent = "Case packet copied into workflow form.";
}

async function runAiPreJudgeForBundle() {
  if (!latestBundle) throw new Error("Build a case packet first.");
  const persona = aiPersona?.value || "lexi";
  aiPreJudgeButton.disabled = true;
  aiPreJudgeButton.textContent = `Running ${persona === "lexi" ? "Lexi" : "Mira"}...`;
  try {
    const result = await fetchJson("/api/ai/prejudge", { method: "POST", body: JSON.stringify({ bundle: latestBundle, persona }) });
    latestBundle = { ...latestBundle, subject: result.improvedSubject || latestBundle.subject, evidence: { ...latestBundle.evidence, claims: result.improvedClaims?.length ? result.improvedClaims : latestBundle.evidence.claims, reviewNotes: result.reviewerNotes || latestBundle.evidence.reviewNotes }, referenceUrls: result.improvedReferenceUrls?.length ? result.improvedReferenceUrls : latestBundle.referenceUrls };
    generatedSubject.textContent = latestBundle.subject;
    generatedEvidence.textContent = pretty(latestBundle.evidence);
    generatedReferences.textContent = pretty(latestBundle.referenceUrls);
    aiPreJudgeOutput.textContent = pretty(result);
    applyBundleToWorkflow(latestBundle);
    recommendedAction.textContent = result.preliminaryVerdict === "allow" ? "prepare resolution" : "review more evidence";
    recommendedActionReason.textContent = result.summary || `${result.personaLabel || "AI"} returned ${result.preliminaryVerdict}.`;
    saveRecentRun({ projectName: latestBundle.projectName || latestBundle.evidence.caseId || "AI triage", subject: latestBundle.subject, executionStatus: `${result.personaLabel || "AI"}-${result.preliminaryVerdict}`, nextAction: "review_before_onchain_resolution", evaluationId: "", timestamp: new Date().toLocaleString(), bundle: latestBundle });
    saveDecisionEvent({ caseId: latestBundle.evidence.caseId, projectName: latestBundle.projectName, type: "ai_triage", outcome: `${result.personaLabel || "AI"}: ${result.preliminaryVerdict}`, action: "review_before_onchain_resolution", notes: result.summary || "AI triage returned recommendation.", timestamp: new Date().toLocaleString() });
  } finally {
    aiPreJudgeButton.disabled = false;
    aiPreJudgeButton.textContent = "Run AI Triage";
  }
}

function loadDemoBundle() { selectedCaseId = CASES[0].id; renderCaseQueue(); fillCaseDetail(getCaseById(selectedCaseId)); buildBundle(); }

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Request failed with ${response.status}`);
  return payload;
}

async function loadConfig() {
  const config = await fetchJson("/api/config");
  contractAddress = config.contractAddress || "";
  contractPill.textContent = contractAddress ? `Contract: ${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}` : "No contract configured";
}

function updateVerdictCard(data) {
  verdictCard.className = "verdict";
  if (data.blockedByPolicy) {
    verdictCard.classList.add("verdict-denied");
    verdictCard.innerHTML = `<strong>Resolution held</strong><span>Policy did not unlock the decision path. Next: ${data.nextAction}</span>`;
    recommendedAction.textContent = data.nextAction === "hold_submission" ? "hold_payout" : "fraud_review";
    recommendedActionReason.textContent = "Evidence did not unlock workflow. Escalate for manual review.";
    return;
  }
  verdictCard.classList.add("verdict-approved");
  verdictCard.innerHTML = `<strong>Resolution unlocked</strong><span>Policy verdict unlocked workflow. Next: ${data.nextAction}</span>`;
  recommendedAction.textContent = getSelectedCase().requestedAction;
  recommendedActionReason.textContent = "Policy returned allow. Case can move into operational step.";
}

function showRpcFallback(errorMessage) {
  verdictCard.className = "verdict verdict-waiting";
  verdictCard.innerHTML = `<strong>RPC unavailable</strong><span>Live write flow could not complete. Use explorer proof links.</span>`;
  recommendedAction.textContent = "manual_retry";
  recommendedActionReason.textContent = "Packet ready but hosted environment could not complete write. Retry locally.";
  workflowOutput.textContent = ["Live fallback mode.", "", errorMessage, "", "Proof links:", "- Contract: https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108", "- create_policy tx: https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083", "- evaluate tx: https://explorer-studio.genlayer.com/tx/0x3b61a808f6e2bcb27cfc75fe88d5cf68bab600427e5bacaf64a19a385fa73c59", "- workflow tx: https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121"].join("\n");
}

function setBusy(form, busy) {
  const button = form.querySelector("button[type='submit']");
  button.disabled = busy;
  button.textContent = busy ? "Working..." : button.dataset.idleText;
}

/* ── Event Listeners ── */
policyForm.querySelector("button").dataset.idleText = "Create Policy";
workflowForm.querySelector("button").dataset.idleText = "Run Workflow";
buildPresetOptions();

builderForm.addEventListener("submit", (event) => { event.preventDefault(); buildBundle(); });
caseCreateForm.addEventListener("submit", (event) => { event.preventDefault(); createCustomCase(new FormData(caseCreateForm)); caseCreateForm.reset(); caseCreateForm.elements.currency.value = "USD"; caseCreateForm.elements.presetType.value = ""; });
caseDetailForm.addEventListener("submit", (event) => { event.preventDefault(); updateCurrentCase(new FormData(caseDetailForm)); });
evidenceForm.addEventListener("submit", (event) => { event.preventDefault(); saveEvidenceRecord(new FormData(evidenceForm)); });
resetEvidenceButton.addEventListener("click", resetEvidenceEditor);
sourceIngestForm.addEventListener("submit", (event) => { event.preventDefault(); ingestStructuredSource(new FormData(sourceIngestForm)); });
resetSourceIngestButton.addEventListener("click", resetSourceIngest);
queueSearch.addEventListener("input", () => { queueFilterText = queueSearch.value.trim(); renderCaseQueue(); });
queueStatusFilter.addEventListener("change", () => { queueFilterStatus = queueStatusFilter.value; renderCaseQueue(); });
createPresetSelect.addEventListener("change", () => { applyPresetValuesToForm(caseCreateForm, createPresetSelect.value); });
detailPresetSelect.addEventListener("change", () => { applyPresetValuesToForm(caseDetailForm, detailPresetSelect.value); });
applyBundleButton.addEventListener("click", () => { try { applyBundleToWorkflow(); activateTab("workflowTab"); activateDetailTab("builderTab"); } catch (error) { workflowOutput.textContent = error.message; } });
jumpToBuilderButton.addEventListener("click", () => { updateCurrentCase(new FormData(caseDetailForm)); activateDetailTab("builderTab"); buildBundle(); });

[buyerVault, sellerVault, authorityVault].forEach((target) => {
  target.addEventListener("click", (event) => {
    const button = event.target.closest("[data-evidence-action]");
    if (!button) return;
    const evidenceIndex = Number(button.dataset.evidenceIndex);
    const item = getSelectedCase().evidence[evidenceIndex];
    if (!item) return;
    if (button.dataset.evidenceAction === "edit") { activateDetailTab("vaultTab"); hydrateEvidenceEditor(item, evidenceIndex); return; }
    deleteEvidenceRecord(evidenceIndex);
  });
});

actionChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    actionChips.forEach((item) => item.classList.remove("chip-active"));
    chip.classList.add("chip-active");
    resolutionActionForm.dataset.selectedAction = chip.dataset.actionValue;
  });
});

resolutionActionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedAction = resolutionActionForm.dataset.selectedAction;
  if (!selectedAction) { recommendedActionReason.textContent = "Choose a resolution action first."; return; }
  applyResolutionAction(selectedAction, resolutionActionForm.elements.actionNote.value.trim());
});

clearResolutionActionButton.addEventListener("click", clearActionSelection);

sourceChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    sourceChips.forEach((item) => item.classList.remove("chip-active"));
    chip.classList.add("chip-active");
    const sourceType = chip.dataset.sourceTemplate;
    sourceIngestForm.elements.sourceType.value = sourceType;
    sourceIngestForm.elements.payload.value = pretty(sourceTemplatePayload(sourceType, getSelectedCase()));
  });
});

[playbookTasks, actionQueueBoard].forEach((target) => {
  target.addEventListener("click", (event) => {
    const button = event.target.closest("[data-task-action='toggle']");
    if (!button) return;
    toggleTaskStatus(button.dataset.taskId);
  });
});

loadDemoButton.addEventListener("click", loadDemoBundle);
aiPreJudgeButton.addEventListener("click", async () => { try { activateTab("triageTab"); await runAiPreJudgeForBundle(); } catch (error) { aiPreJudgeOutput.textContent = error.message; } });

tabButtons.forEach((button) => { button.addEventListener("click", () => { activateTab(button.dataset.tabTarget); }); });
detailTabButtons.forEach((button) => { button.addEventListener("click", () => { activateDetailTab(button.dataset.detailTab); }); });

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
    const result = await fetchJson("/api/policies", { method: "POST", body: JSON.stringify({ contractAddress, name: form.get("name"), category: form.get("category"), policyText: form.get("policyText"), criteriaText: form.get("criteriaText") }) });
    workflowForm.elements.policyId.value = result.policyId;
    policyOutput.textContent = pretty(result);
    activateTab("policyTab");
    saveDecisionEvent({ caseId: getCaseById(selectedCaseId).id, projectName: getCaseById(selectedCaseId).id, type: "policy_created", outcome: result.policyId, action: "ready_for_resolution", notes: "Created reusable policy on GenLayer.", timestamp: new Date().toLocaleString() });
  } catch (error) {
    policyOutput.textContent = error.message.includes("GenLayer RPC error") || error.message.includes("fetch failed") ? ["Remote RPC unavailable.", "", error.message, "", "Use explorer proof links."].join("\n") : error.message;
  } finally { setBusy(policyForm, false); }
});

workflowForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setBusy(workflowForm, true);
  try {
    const form = new FormData(workflowForm);
    const payload = { contractAddress, policyId: form.get("policyId"), subject: form.get("subject"), evidence: parseJsonField(form.get("evidence"), "evidence JSON"), referenceUrls: parseJsonField(form.get("referenceUrls"), "reference URLs JSON") };
    const result = await fetchJson("/api/workflows/submission-gate", { method: "POST", body: JSON.stringify(payload) });
    updateVerdictCard(result);
    workflowOutput.textContent = pretty(result);
    activateTab("workflowTab");
    saveRecentRun({ projectName: payload.evidence.caseId || payload.evidence.projectName || "Resolution run", subject: payload.subject, executionStatus: result.executionStatus, nextAction: result.nextAction, evaluationId: result.evaluationId, timestamp: new Date().toLocaleString(), bundle: { subject: payload.subject, evidence: payload.evidence, referenceUrls: payload.referenceUrls, projectName: payload.evidence.caseId || payload.evidence.projectName || "Resolution run" } });
    saveDecisionEvent({ caseId: payload.evidence.caseId || payload.evidence.projectName, projectName: payload.evidence.caseId || payload.evidence.projectName, type: "workflow_resolution", outcome: result.executionStatus, action: result.nextAction, notes: `Workflow completed with evaluation ${result.evaluationId}.`, timestamp: new Date().toLocaleString() });
  } catch (error) {
    if (error.message.includes("GenLayer RPC error") || error.message.includes("fetch failed")) {
      showRpcFallback(error.message);
      saveDecisionEvent({ caseId: getCaseById(selectedCaseId).id, projectName: getCaseById(selectedCaseId).id, type: "workflow_fallback", outcome: "rpc unavailable", action: "manual_retry", notes: error.message, timestamp: new Date().toLocaleString() });
    } else {
      verdictCard.className = "verdict verdict-denied";
      verdictCard.innerHTML = `<strong>Resolution failed</strong><span>${error.message}</span>`;
      workflowOutput.textContent = error.message;
    }
  } finally { setBusy(workflowForm, false); }
});

/* ── Init ── */
renderRecentRuns();
renderDecisionHistory();
renderCaseQueue();
fillCaseDetail(getCaseById(selectedCaseId));
buildBundle();
renderActionQueueBoard();
loadConfig().catch((error) => { contractPill.textContent = `Config error: ${error.message}`; });
