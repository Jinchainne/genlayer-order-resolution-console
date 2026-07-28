# Order Resolution Console Blueprint

## Product Direction

Pivot `genlayer-order-resolution-console` from a general policy review console into a vertical product for commerce and retail operations:

- product name: `Order Resolution Console`
- category: `Projects`
- primary workflow: buyer vs seller dispute resolution for delivery, payment, refund, and order mismatch cases

This direction is stronger for `Highlights` because it turns the project into a recognizable real-world tool instead of a generic AI review surface.

## Core Problem

Retail and marketplace teams often handle disputes through fragmented systems:

- buyer complaint in chat or email
- seller response in an internal ops panel
- payment proof in a separate ledger
- order timeline in a logistics system
- refund state in another backend

When the final decision matters, teams need more than a support note. They need a repeatable workflow that:

- collects both sides of the dispute
- fetches authoritative evidence
- handles disagreement and ambiguity
- produces a decision that can unlock a refund, hold a payout, or escalate the case

## Target Users

- online grocery operators
- marketplace trust and safety teams
- refund and dispute operations teams
- merchant support teams
- logistics resolution teams

## High-Value Use Cases

### 1. Missing item dispute

Buyer says paid items were not inside the delivered bag.

Decision outcomes:

- `partial_refund`
- `deny_refund`
- `escalate_manual`

### 2. Wrong order delivered

Buyer received another customer’s order.

Decision outcomes:

- `full_refund`
- `reorder_approved`
- `escalate_manual`

### 3. Refund not received

Seller claims refund was initiated, buyer says payment never returned.

Decision outcomes:

- `approve_refund`
- `refund_already_processed`
- `escalate_payment_ops`

### 4. Damaged goods

Buyer uploads images of spoiled or broken products.

Decision outcomes:

- `compensate_buyer`
- `replace_order`
- `deny_claim`

## Why GenLayer Is Necessary

The core decision is not deterministic-only.

The workflow depends on:

- natural-language buyer and seller statements
- evidence quality
- conflicting timelines
- incomplete or ambiguous proof
- contract-side review of authoritative public sources

A normal backend can perform the workflow, but then one operator or one service controls the final interpretation. GenLayer is useful because the project can:

- encode reusable resolution policy
- fetch and compare source material during execution
- produce a consensus-backed qualitative result
- bind that result to downstream business actions

## Product Surface

The project should feel like an operations dashboard, not an AI playground.

### Main screens

1. `Case Queue`
2. `Order Detail`
3. `Evidence Vault`
4. `Resolution Panel`
5. `Decision History`
6. `Metrics and SLA`

### Main actions

1. open case
2. inspect buyer and seller evidence
3. run AI triage
4. create or reuse resolution policy
5. run GenLayer evaluation
6. map verdict to operational action
7. export proof bundle

## UX Direction

The interface should borrow from commerce and operations products rather than general AI tools.

### Visual principles

- dashboard-first layout
- queue on the left
- detail and timeline in the center
- resolution and action controls on the right
- status badges, item rows, money panels, and timeline cards
- reduced emphasis on raw JSON
- AI as helper, not as the product identity

### Language style

Use:

- `case`
- `refund`
- `merchant`
- `buyer`
- `evidence`
- `resolution`
- `amount at risk`
- `escalate`

Avoid overusing:

- `AI`
- `LLM`
- `prompt`
- `playground`
- `demo`

## Contract Role

The reusable contract remains the policy engine.

### Contract responsibilities

- store dispute policies
- accept case packet inputs
- fetch or compare public source material
- evaluate evidence under a policy
- return `allow`, `deny`, or `undetermined`
- persist result for downstream reads

### Project responsibilities

- organize the dispute desk
- collect buyer and seller context
- package the case for review
- provide AI triage and operator assistance
- translate verdicts into operations actions

## Data Model

### Case packet

```json
{
  "caseId": "BXH-2048",
  "merchant": "Bach Hoa Xanh Downtown",
  "buyer": "Nguyen Minh Thu",
  "seller": "Store Operations Team",
  "claimType": "missing-item",
  "requestedAction": "partial_refund",
  "orderAmount": "248000 VND",
  "amountAtRisk": "74000 VND",
  "paymentStatus": "paid",
  "buyerClaim": "Two paid items were missing after delivery.",
  "sellerResponse": "The order was packed and scanned as complete.",
  "authoritativeSources": [
    "order invoice",
    "payment confirmation",
    "packing note",
    "support timestamp"
  ],
  "disagreementPoints": [
    "buyer says items were missing",
    "seller says checklist shows all items packed"
  ]
}
```

## Milestone Roadmap

### Phase 1: presentational pivot

- rename surface to `Order Resolution Console`
- replace generic project wording with commerce dispute language
- build `Case Queue`, `Order Detail`, and `Resolution Panel`

### Phase 2: stronger workflow depth

- add `Evidence Vault` with grouped buyer and seller uploads
- add authoritative source labels
- add case timeline and SLA indicators
- export a resolution packet

### Phase 3: real operational actions

- map allow result to `approve_refund` or `release_seller`
- map blocked result to `hold_payout` or `escalate_manual`
- persist decision history

### Phase 4: highlight-level differentiation

- add metrics dashboard
- add multi-case review memory
- add merchant policy packs
- add payout and refund action adapters

## What Makes This Highlight-Worthy

This project becomes strong for `Highlights` if reviewers can quickly see:

1. a recognizable business problem
2. a complete workflow instead of isolated widgets
3. real GenLayer usage in the critical path
4. a UI that looks deployable to a merchant team
5. a path from evidence to action

## Submission Framing

Short description:

`Order Resolution Console is a live GenLayer operations project for buyer-seller dispute handling in retail and marketplace workflows. It assembles authoritative order evidence, runs AI-assisted triage, applies reusable GenLayer policies, and maps the final verdict to refund, payout hold, or escalation actions.`
