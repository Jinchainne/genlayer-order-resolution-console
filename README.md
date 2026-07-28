# genlayer-order-resolution-console

`genlayer-order-resolution-console` is a submission-ready GenLayer `Project` built as a merchant-facing `Order Resolution Console`.

It is not a generic AI page and not a contract-only demo. It is a dispute operations product that lets a team:

- intake a live buyer-vs-seller case
- inspect both sides of the dispute
- ingest structured evidence from merchant systems
- run AI triage to strengthen the review packet
- create or reuse a GenLayer policy
- evaluate the case through a real GenLayer contract
- map the result into operational actions like refund, reship, store credit, payout hold, or fraud review

## Live Links

- Live app: `https://genlayer-policy-eco.vercel.app`
- Repository: `https://github.com/Jinchainne/genlayer-order-resolution-console`
- Contract explorer: `https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Deploy tx: `https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- `create_policy` tx: `https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083`
- `evaluate` tx: `https://explorer-studio.genlayer.com/tx/0x3b61a808f6e2bcb27cfc75fe88d5cf68bab600427e5bacaf64a19a385fa73c59`
- Workflow tx: `https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121`

## Why This Project Matters

Dispute resolution is a real merchant problem:

- marketplaces need to decide whether to refund buyers or protect sellers
- grocery and delivery teams need to judge missing items, damaged goods, and late delivery claims
- payment teams need to hold payout when fraud or chargeback risk appears
- subscription and warranty teams need fair handling when billing or support evidence conflicts

Most teams solve this with spreadsheets, Zendesk notes, screenshots, and centralized judgment calls.

This project turns that into a structured workflow with:

- a real case queue
- evidence vault and source ingestion
- AI-assisted review
- GenLayer-backed final evaluation
- downstream action playbooks

## Why GenLayer

This use case is not deterministic-only.

The final resolution depends on:

- natural-language policy interpretation
- evidence quality
- conflicting buyer and seller narratives
- authoritative but incomplete public or enterprise records
- ambiguity handling when proof is not perfectly aligned

That is why the contract uses GenLayer-native non-deterministic execution instead of simple `if/else` checks.

Key contract signals:

- `gl.nondet.exec_prompt(...)`
- `@gl.public.write`
- `@gl.public.view`

The contract stores the policy and evaluation result onchain, and the app reads that result back into the workflow.

## What The Product Does

### 1. Retail / marketplace dispute queue

The console starts with a real queue of cases such as:

- missing items
- damaged goods
- wrong order delivered
- refund not received
- late delivery compensation
- unauthorized payment / chargeback
- counterfeit or listing mismatch
- subscription cancellation billing
- warranty replacement

### 2. Intake editor

Operators can:

- select a global dispute preset
- rewrite the active case
- change requested action
- change status, risk amount, merchant, buyer, and seller details
- normalize the case before evaluation

### 3. Evidence Vault

The project now includes a dynamic `Evidence Vault` where operators can:

- add new evidence
- edit existing evidence
- delete weak or outdated evidence
- separate buyer, seller, and authority records

This is important because strong dispute review depends on structured evidence, not only free-text claims.

### 4. Structured source ingestion

The app includes `Source Intake` for ingesting records that look like real merchant systems:

- `order_ledger`
- `payment_ledger`
- `shipping_events`
- `support_crm`
- `fraud_signal`

These sources are converted into evidence records and inserted into the active case, which makes the project look and behave more like a real operations tool instead of a static demo.

### 5. AI triage

Two AI reviewer modes are available:

- `Mira Review`
- `Lexi Review`

They improve the case packet before the final onchain decision by returning:

- preliminary verdict
- confidence
- improved subject
- improved claims
- improved review notes
- evidence gaps

### 6. GenLayer policy workflow

The app can:

- create a reusable resolution policy
- evaluate a case against that policy
- read back the evaluation result
- bind the verdict to operational execution

The project workflow maps the result into `allowed` or `blocked` execution state and uses that to control what should happen next.

### 7. Action desk and task board

This project now pushes beyond “AI review” into actual merchant operations.

Supported resolution actions:

- `approve_refund`
- `partial_refund`
- `reship_order`
- `store_credit`
- `hold_payout`
- `fraud_review`
- `deny_claim`

Each action generates a downstream playbook such as:

- payments tasks
- fulfillment tasks
- support notifications
- risk / fraud review steps
- audit and compliance notes

These tasks are shown in the execution playbook and operations follow-up queue.

## Product Walkthrough

```text
┌──────────────────────────────────────────────────────────────┐
│ Order Resolution Console                                    │
├──────────────────────────────────────────────────────────────┤
│ Queue -> Case Detail -> Evidence Vault -> Source Intake     │
│        -> Packet Builder -> AI Triage -> Policy Workflow    │
│        -> Resolution Action -> Task Board                   │
└──────────────────────────────────────────────────────────────┘
```

### End-to-end flow

```text
Merchant ops receives dispute
-> operator selects or edits the case
-> buyer, seller, and authority evidence are organized
-> structured records are ingested from source systems
-> AI triage strengthens the case packet
-> app writes policy/evaluation through GenLayer
-> contract stores consensus-backed result
-> app maps result to refund / reship / payout hold / fraud review
-> downstream task board shows what the team must execute next
```

### Case-to-action model

```text
[dispute opened]
      |
      v
[evidence normalized]
      |
      v
[AI triage]
      |
      v
[GenLayer policy evaluation]
      |
      +--> [allowed] ------> refund / reship / credit / release path
      |
      +--> [blocked] ------> hold payout / fraud review / denial path
      |
      +--> [unclear] ------> manual evidence follow-up
```

## Repository Tree

```text
genlayer-order-resolution-console/
├─ api/
│  ├─ ai/
│  │  └─ prejudge.js
│  ├─ evaluations/
│  │  ├─ [evaluationId].js
│  │  └─ index.js
│  ├─ policies/
│  │  ├─ [policyId].js
│  │  └─ index.js
│  ├─ workflows/
│  │  └─ submission-gate.js
│  ├─ _lib/
│  │  └─ response.js
│  ├─ config.js
│  └─ health.js
├─ app/
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ contracts/
│  └─ PolicyOracle.py
├─ docs/
│  ├─ BLUEPRINT.md
│  ├─ CONTRACT_DESIGN_SPEC.md
│  ├─ ORDER_RESOLUTION_BLUEPRINT.md
│  ├─ PORTAL_SUBMISSION.md
│  ├─ PROJECT_SUBMISSION.md
│  └─ SUBMISSION.md
├─ public/
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ scripts/
│  ├─ demo_policy_flow.mjs
│  ├─ deploy_policy_oracle.mjs
│  └─ LOCAL_SETUP.md
├─ sdk/
│  └─ policy-client.mjs
├─ src/
│  ├─ lib/
│  │  ├─ ai-prejudge.mjs
│  │  ├─ policy-client.mjs
│  │  └─ receipt-utils.mjs
│  └─ project/
│     ├─ policy-gated-flow.mjs
│     └─ policy-submission-workflow.mjs
├─ README.md
├─ server.mjs
└─ vercel.json
```

## Key Files

### Contract

- [contracts/PolicyOracle.py](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)

### Frontend

- [public/index.html](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/index.html)
- [public/app.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/app.js)
- [public/styles.css](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/styles.css)

### Workflow / SDK

- [sdk/policy-client.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/sdk/policy-client.mjs)
- [src/project/policy-submission-workflow.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/project/policy-submission-workflow.mjs)
- [server.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/server.mjs)

## Local Run

```bash
npm install
npm run app
```

Open:

- `http://127.0.0.1:3000`

## Why This Is A Good GenLayer Project

This repo now clears the important `Projects` bar:

- real GenLayer contract
- meaningful non-deterministic logic
- real app-to-contract read/write workflow
- live project UX, not static contract details
- practical business use case
- downstream operational execution after verdict

It also tells a stronger `highlight` story than before because it is no longer just “review and evaluate”.

It now behaves like a real merchant operations product with:

- dispute queue
- authority-aware evidence management
- structured source ingestion
- AI-assisted triage
- onchain decision path
- action playbooks
- follow-up task board

## Submission Summary

`genlayer-order-resolution-console` is a live merchant dispute operations console built on GenLayer. It helps retail, grocery, delivery, marketplace, payment, and subscription teams turn messy buyer-seller disputes into structured evidence packets, evaluate them through a reusable GenLayer policy contract, and bind the resulting verdict to real business actions like refund, reship, store credit, payout hold, or fraud review.
