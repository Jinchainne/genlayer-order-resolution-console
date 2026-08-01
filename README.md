# GenLayer Order Resolution Console

**A merchant-facing dispute resolution console powered by GenLayer's non-deterministic smart contract execution, validator consensus, and on-chain evidence fetching.**

---

## Live Links

| Resource | URL |
|---|---|
| **Live App** | [order-resolution-console.vercel.app](https://order-resolution-console.vercel.app/) |
| **Repository** | [github.com/Jinchainne/genlayer-order-resolution-console](https://github.com/Jinchainne/genlayer-order-resolution-console) |
| **Contract Explorer** | [explorer-studio — 0x3789…f108](https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108) |
| **Deploy Tx** | [0xf1c2…e111](https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111) |
| **`create_policy` Tx** | [0xeb09…e083](https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083) |
| **`evaluate` Tx** | [0x3b61…7c59](https://explorer-studio.genlayer.com/tx/0x3b61a808f6e2bcb27cfc75fe88d5cf68bab600427e5bacaf64a19a385fa73c59) |
| **Workflow Tx** | [0x530c…2121](https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121) |

**Contract Address:** `0x378986E3Af625f1873c46Ab96E919E7886eFf108`

---

## Why This Project Matters

Dispute resolution is a **real merchant problem** that every marketplace, delivery platform, and payment processor faces daily:

- **Marketplaces** need to decide whether to refund buyers or protect sellers when claims conflict.
- **Grocery & delivery teams** need to judge missing items, damaged goods, and late delivery claims with incomplete evidence.
- **Payment teams** need to hold payouts when fraud or chargeback risk appears.
- **Subscription & warranty teams** need fair handling when billing or support evidence contradicts customer statements.

Most teams solve this with **spreadsheets, Zendesk notes, screenshots, and centralized judgment calls** — slow, inconsistent, and opaque.

This project turns messy dispute intake into a **streamlined, evidence-driven, on-chain workflow** with:

- A real case queue with buyer/seller/timeline review
- Structured evidence ingestion from merchant systems
- AI-assisted triage to strengthen the review packet
- GenLayer-backed final evaluation with validator consensus
- Operational action mapping (refund, reship, hold, deny)

---

## Why GenLayer

This use case is **not deterministic-only**. The final resolution depends on:

- Natural-language policy interpretation
- Evidence quality and conflicting narratives
- Authoritative but incomplete public or enterprise records
- Ambiguity handling when proof is not perfectly aligned

That is why the contract uses **GenLayer-native non-deterministic execution** instead of simple `if/else` checks.

### Key GenLayer capabilities used

| Capability | How it's used |
|---|---|
| `gl.nondet.exec_prompt()` | AI evaluates the dispute against policy + evidence + fetched sources |
| `gl.nondet.web.render()` | Contract fetches authoritative web sources on-chain during evaluation |
| `gl.vm.run_nondet_unsafe()` | Leader-validator consensus: leader proposes verdict, validators verify |
| `@gl.public.write` / `@gl.public.view` | On-chain storage of policies, evaluations, and case records |
| `TreeMap` storage | Persistent on-chain state for policies, evaluations, and cases |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Order Resolution Console                      │
│                     (Vanilla JS + Tailwind)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐│
│  │ Case     │  │ Evidence │  │ AI Triage│  │ Policy & Resolve ││
│  │ Queue    │  │ Review   │  │ (MiMo/   │  │ (on-chain)       ││
│  │          │  │          │  │  Groq)   │  │                  ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬──────────┘│
│       │              │             │                │           │
└───────┼──────────────┼─────────────┼────────────────┼───────────┘
        │              │             │                │
        ▼              ▼             ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Server API (Node.js)                         │
│  POST /api/policies        → create_policy() on-chain           │
│  POST /api/evaluations     → evaluate() on-chain                │
│  POST /api/resolve         → resolve_dispute() on-chain         │
│  POST /api/ai/prejudge     → Off-chain AI triage (MiMo/Groq)   │
│  GET  /api/config          → Contract address & RPC config      │
│  GET  /api/health          → Health check                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              GenLayer Contract (PolicyOracle.py)                  │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐│
│  │ create_     │  │ evaluate()   │  │ resolve_dispute()       ││
│  │ policy()    │  │              │  │                         ││
│  │             │  │ 1. Fetch     │  │ evaluate() + store      ││
│  │ Reusable    │  │    sources   │  │ case resolution record  ││
│  │ policy      │  │    via web   │  │                         ││
│  │ templates   │  │    .render() │  │ Full end-to-end flow    ││
│  │             │  │ 2. AI prompt │  │                         ││
│  │             │  │ 3. Consensus │  │                         ││
│  └─────────────┘  └──────────────┘  └─────────────────────────┘│
│                                                                  │
│  Leader-Validator Consensus via gl.vm.run_nondet_unsafe()        │
│  • Leader proposes verdict (decision + score + confidence)       │
│  • Validator re-runs independently and checks:                   │
│    - Decision must be EXACT match                                │
│    - Score must be within ±20 points                             │
│    - Confidence must be within ±1 rank                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Workflow: 6 Steps

### Step 1 — Overview

Select a case from the dispute queue. View the buyer statement, seller statement, case timeline, and key metadata at a glance.

### Step 2 — Evidence

Add, edit, and review structured evidence. Ingest sources from merchant systems — order records, shipping logs, customer communications, delivery tracking, product listings, and return confirmations.

### Step 3 — Packet

Build a structured case packet using the evidence template. This bundles the subject, buyer/seller claims, evidence items, reference URLs, and disagreement points into a standardized format for evaluation.

### Step 4 — AI Triage (Off-Chain)

An off-chain AI copilot (MiMo or Groq) reviews the case packet and returns:

- Preliminary verdict (allow / deny / undetermined)
- Confidence level
- Improved subject and claims
- Review notes and evidence gaps

This step strengthens the packet **before** it goes on-chain.

### Step 5 — Policy (On-Chain)

Call `create_policy()` on the GenLayer contract to register a reusable resolution policy with:

- Policy name and category
- Policy text (rules and guidelines)
- Evaluation criteria

Policies are stored on-chain and reusable across multiple cases.

### Step 6 — Resolve (On-Chain)

Call `resolve_dispute()` to execute the full end-to-end resolution on-chain:

1. **Contract fetches authoritative sources** via `gl.nondet.web.render()` — independently retrieving web pages to cross-reference claims
2. **AI evaluates** the case against the policy, structured evidence, disagreements, and fetched sources
3. **Validator consensus** runs via `gl.vm.run_nondet_unsafe()`:
   - Decision must be **exact** match between leader and validator
   - Score must be within **±20 points**
   - Confidence must be within **±1 rank**
4. **Verdict stored on-chain** — the case record, evaluation result, decision, score, confidence, and reason are permanently recorded

The app reads the verdict and maps it to operational actions.

---

## Contract Features

### `create_policy()` — Reusable Policy Creation

Creates a resolution policy on-chain. Policies define the rules and criteria that evaluators use to judge disputes. They are reusable — one policy can evaluate many cases.

### `evaluate()` — Core Evaluation with Evidence Fetching

The heart of the contract. For each evaluation:

1. Fetches authoritative web sources on-chain via `gl.nondet.web.render()`
2. Builds a comprehensive prompt with policy, evidence, disagreements, and fetched sources
3. Runs AI evaluation via `gl.nondet.exec_prompt()`
4. Stores the normalized result (decision, score, confidence, reason, evidence_used, fetched_sources)

### `resolve_dispute()` — Full End-to-End Case Resolution

Combines `evaluate()` with case record storage. Creates a permanent case resolution record linking the case ID to the evaluation result, enabling read-back via `get_case()`.

### `get_case()` — Read Case Resolution Record

View function to retrieve the on-chain case resolution record including decision, score, confidence, reason, and who resolved it.

### Leader-Validator Consensus

All non-deterministic operations run through `gl.vm.run_nondet_unsafe(leader_fn, validator_fn)`:

- **Leader** proposes a verdict by running the full evaluation
- **Validator** independently re-runs the same evaluation and checks:
  - Decision exact match
  - Score within ±20 points
  - Confidence within ±1 rank
- If the validator rejects, the transaction fails — ensuring consistency across non-deterministic execution

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Smart Contract** | Python (py-genlayer), deployed on GenLayer StudioNet |
| **Server API** | Node.js (vanilla `http` module), ES modules |
| **Frontend** | Vanilla JavaScript, HTML5, Tailwind CSS |
| **GenLayer SDK** | `genlayer-js` for contract interaction |
| **AI Providers** | MiMo (`mimo-v2.5`) or Groq (`llama-3.3-70b-versatile`) |
| **Deployment** | Vercel (frontend + serverless API), GenLayer StudioNet (contract) |

---

## Repository Tree

```text
genlayer-order-resolution-console/
├─ api/                          # Vercel serverless API routes
│  ├─ ai/
│  │  └─ prejudge.js             # AI triage endpoint
│  ├─ evaluations/
│  │  ├─ [evaluationId].js       # Read evaluation by ID
│  │  └─ index.js                # Create evaluation
│  ├─ policies/
│  │  ├─ [policyId].js           # Read policy by ID
│  │  └─ index.js                # Create policy
│  ├─ workflows/
│  │  └─ submission-gate.js      # Workflow gate logic
│  ├─ _lib/
│  │  └─ response.js             # Shared response helpers
│  ├─ config.js                  # Config endpoint
│  └─ health.js                  # Health check
├─ app/                          # Local dev frontend
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ contracts/
│  └─ PolicyOracle.py            # GenLayer smart contract (Python)
├─ docs/                         # Design docs & submission materials
│  ├─ BLUEPRINT.md
│  ├─ CONTRACT_DESIGN_SPEC.md
│  ├─ ORDER_RESOLUTION_BLUEPRINT.md
│  ├─ PORTAL_SUBMISSION.md
│  ├─ PROJECT_SUBMISSION.md
│  └─ SUBMISSION.md
├─ public/                       # Production frontend (Vercel)
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ scripts/                      # Deployment & demo scripts
│  ├─ demo_policy_flow.mjs
│  ├─ deploy_policy_oracle.mjs
│  └─ LOCAL_SETUP.md
├─ sdk/
│  └─ policy-client.mjs          # GenLayer contract client SDK
├─ src/
│  ├─ lib/
│  │  ├─ ai-prejudge.mjs         # Off-chain AI triage logic
│  │  ├─ policy-client.mjs       # Contract read/write helpers
│  │  └─ receipt-utils.mjs       # Transaction receipt parsing
│  └─ project/
│     ├─ policy-gated-flow.mjs   # Policy-gated execution flow
│     └─ policy-submission-workflow.mjs  # Full submission workflow
├─ tests/
│  └─ test_policy_oracle_contract.py     # Contract tests
├─ .env.example                  # Environment variable template
├─ package.json
├─ pyproject.toml
├─ server.mjs                    # Local dev server
├─ vercel.json                   # Vercel deployment config
└─ README.md
```

---

## Local Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or pnpm/yarn)
- A GenLayer private key with StudioNet funds

### 1. Clone & Install

```bash
git clone https://github.com/Jinchainne/genlayer-order-resolution-console.git
cd genlayer-order-resolution-console
npm install
```

### 2. Configure Environment

Copy the example and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your keys (see [Environment Variables](#environment-variables) below).

### 3. Run

```bash
npm run app
```

Open `http://127.0.0.1:3000` in your browser.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GENLAYER_PRIVATE_KEY` | ✅ | Private key for signing GenLayer transactions (hex, `0x`-prefixed) |
| `GENLAYER_RPC_URL` | ✅ | GenLayer RPC endpoint (default: `https://studio.genlayer.com/api`) |
| `POLICY_ORACLE_ADDRESS` | ✅ | Deployed contract address (default: `0x378986E3Af625f1873c46Ab96E919E7886eFf108`) |
| `MIMO_API_KEY` | ⬜* | API key for MiMo AI provider |
| `MIMO_API_URL` | ⬜ | MiMo API endpoint |
| `MIMO_MODEL` | ⬜ | MiMo model identifier (default: `mimo-v2.5`) |
| `GROQ_API_KEY` | ⬜* | API key for Groq AI provider |
| `GROQ_API_URL` | ⬜ | Groq API endpoint |
| `GROQ_MODEL` | ⬜ | Groq model identifier (default: `llama-3.3-70b-versatile`) |
| `AI_PERSONA` | ⬜ | AI persona for triage (default: `lexi`) |
| `PORT` | ⬜ | Server port (default: `3000`) |

> \* At least one of `MIMO_API_KEY` or `GROQ_API_KEY` is required for AI triage.

---

## Dispute Types Supported

| # | Dispute Type | Description |
|---|---|---|
| 1 | **Missing Items** | Items listed on the order but not received |
| 2 | **Damaged Goods** | Products arrived broken, dented, or spoiled |
| 3 | **Wrong Order Delivered** | Received items that don't match the order |
| 4 | **Refund Not Received** | Buyer claims refund was promised but not issued |
| 5 | **Late Delivery Compensation** | Delivery exceeded the promised window |
| 6 | **Unauthorized Payment / Chargeback** | Payment made without buyer authorization |
| 7 | **Counterfeit / Listing Mismatch** | Product doesn't match the listing description |
| 8 | **Subscription Cancellation Billing** | Charges after cancellation was requested |
| 9 | **Warranty Replacement** | Claim under warranty for defective product |

---

## Resolution Actions

After on-chain evaluation, the verdict maps to one of these operational actions:

| Action | When | Description |
|---|---|---|
| `approve_refund` | Strong buyer evidence, policy supports | Full refund to buyer |
| `partial_refund` | Shared fault or partial evidence | Split the cost between buyer and seller |
| `reship_order` | Delivery failure, seller is valid | Seller reships the order |
| `store_credit` | Borderline case, retain customer | Credit for future purchase |
| `hold_payout` | Fraud signals or pending review | Freeze seller payout pending investigation |
| `fraud_review` | Suspicious patterns detected | Escalate to fraud investigation team |
| `deny_claim` | Evidence doesn't support the claim | Claim rejected, no action taken |

```text
[resolve_dispute() verdict]
        │
        ├── allow  ──→ approve_refund / partial_refund / reship_order / store_credit
        │
        ├── deny   ──→ deny_claim
        │
        └── undetermined ──→ hold_payout / fraud_review / manual follow-up
```

---

## Execution Playbook

### Task Tracking

| # | Task | Status |
|---|---|---|
| 1 | Deploy `PolicyOracle` contract to GenLayer StudioNet | ✅ Done |
| 2 | Build server API with policy, evaluation, and resolve endpoints | ✅ Done |
| 3 | Build frontend console with case queue, evidence review, AI triage | ✅ Done |
| 4 | Integrate `genlayer-js` for on-chain contract calls | ✅ Done |
| 5 | Implement AI triage with MiMo / Groq provider support | ✅ Done |
| 6 | Implement `create_policy()` flow end-to-end | ✅ Done |
| 7 | Implement `evaluate()` flow with evidence fetching + consensus | ✅ Done |
| 8 | Implement `resolve_dispute()` full workflow | ✅ Done |
| 9 | Deploy frontend to Vercel | ✅ Done |
| 10 | Verify all transactions on GenLayer Explorer | ✅ Done |

---

## Why This Is a Good GenLayer Project

| Criteria | How this project delivers |
|---|---|
| **Real use case** | Merchant dispute resolution is a genuine business problem — not a toy demo |
| **Non-deterministic logic** | The contract uses `gl.nondet.exec_prompt()` for AI-powered evaluation, not hardcoded `if/else` |
| **Consensus** | Leader-validator pattern via `gl.vm.run_nondet_unsafe()` ensures cross-validator agreement on decisions, scores, and confidence |
| **Evidence fetching** | The contract fetches authoritative web sources on-chain via `gl.nondet.web.render()` during evaluation — evidence is not just passed in, it's independently verified |
| **Full read/write workflow** | Real app-to-contract interaction: create policies, evaluate cases, resolve disputes, read results back |
| **Production UX** | A complete console with case queue, evidence review, AI triage, and action mapping — not a static contract page |
| **Reusable policies** | Policies are on-chain entities that can be created once and applied to many cases |

---

## Submission Summary

`genlayer-order-resolution-console` is a merchant dispute operations console built on GenLayer. It helps retail, grocery, delivery, marketplace, payment, and subscription teams turn messy buyer-seller disputes into structured evidence packets, evaluate them through a reusable GenLayer policy contract with leader-validator consensus and on-chain evidence fetching, and bind the resulting verdict to real business actions like refund, reship, store credit, payout hold, or fraud review.

**Console flow:** Select Case → Review Evidence → AI Triage → Create Policy → Resolve On-Chain → Execute Action
