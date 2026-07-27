# genlayer-policy-eco

`genlayer-policy-eco` is a GenLayer repository built around `PolicyOracle`, a reusable Intelligent Contract for policy evaluation, evidence review, and execution gating.

This is the same repo that was originally submitted for `Intelligent Contracts`, and it now also contains the expanded `Project` layer. The original contract submission is preserved in this repo and has not been removed or replaced.

## Submission Status

### Original submission

- Category: `Intelligent Contracts`
- Primitive: `PolicyOracle`
- Purpose: reusable allow / deny / undetermined policy evaluation contract

### Current expanded state

- Category: `Projects`
- Product layer: policy review console
- Workflow: app write -> GenLayer evaluation -> app read -> execution gate

## What This Repo Is

This repo now has two valid layers living together:

1. `Intelligent Contract` layer
   `PolicyOracle` stores natural-language policies and produces consensus-backed policy decisions from submitted evidence.

2. `Project` layer
   A real app workflow lets a reviewer create policies, evaluate a submission, and bind the result to downstream execution status such as `unlock_submission` or `hold_submission`.

That means this repo should be read as:

- the original contract submission is still here
- the project expansion is built on top of that same contract
- the contract was not discarded just because the repo later became a project

## Why This Matters For Reviewers

If you are reviewing this repo for the earlier `Intelligent Contracts` submission, the core artifact is still:

- [`contracts/PolicyOracle.py`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)

If you are reviewing this repo as a `Project`, the app workflow is now also present in:

- [`public/index.html`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/index.html)
- [`public/app.js`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/app.js)
- [`api/workflows/submission-gate.js`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/workflows/submission-gate.js)
- [`src/project/policy-submission-workflow.mjs`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/project/policy-submission-workflow.mjs)

## TL;DR

- Contract name: `PolicyOracle`
- Core decision: `allow` / `deny` / `undetermined`
- Why GenLayer: the judgment is qualitative and non-deterministic, so one backend should not decide it alone
- Why this is reusable: other builders can reuse it for submissions, payouts, moderation, refunds, disputes, and agent actions
- Why this is now a project: the repo includes a real app workflow that writes to and reads from the submitted contract

## The Core Use Case

`PolicyOracle` evaluates whether a requested action complies with a human-readable policy and supporting evidence.

Example use cases:

- contribution approval
- milestone payout gating
- reward eligibility review
- refund pre-checks
- moderation decisions
- agent action approval

## Why GenLayer Is Necessary

The result is not a deterministic formula. It depends on:

- policy interpretation
- evidence quality
- ambiguity handling
- reasoning over structured and natural-language inputs

A centralized backend could call one model and return one answer, but that would still be a unilateral decision. GenLayer is the meaningful part because validators independently evaluate and converge on a stable result that downstream execution can trust.

## Contract Layer

### Main contract

- Name: `PolicyOracle`
- Path: [`contracts/PolicyOracle.py`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)
- Purpose: store policies and persist consensus-backed evaluation results

### Main write methods

- `create_policy(...)`
- `set_policy_active(...)`
- `evaluate(...)`

### Main read methods

- `get_policy(...)`
- `get_result(...)`
- `is_allowed(...)`
- `get_counts(...)`

## Project Layer

The project layer turns the contract into a real review workflow.

### Real app workflow

```text
Reviewer creates policy in app
-> app writes create_policy to PolicyOracle
-> policy stored onchain

Reviewer submits a request + evidence
-> app writes evaluate to PolicyOracle
-> GenLayer reaches consensus
-> evaluation stored onchain

App reads get_result + is_allowed
-> project sets unlock_submission or hold_submission
```

### Execution binding

The important project-side binding happens in:

- [`src/project/policy-submission-workflow.mjs`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/project/policy-submission-workflow.mjs)

This is the line of thought reviewers care about:

- verdict is not cosmetic
- verdict is not local-only state
- verdict is used to decide whether execution continues

## Repository Structure

```text
.
|-- contracts/
|   `-- PolicyOracle.py
|-- sdk/
|   `-- policy-client.mjs
|-- src/
|   |-- lib/
|   |   `-- policy-client.mjs
|   `-- project/
|       |-- policy-gated-flow.mjs
|       `-- policy-submission-workflow.mjs
|-- api/
|   |-- config.js
|   |-- health.js
|   |-- policies/
|   |-- evaluations/
|   `-- workflows/
|-- public/
|   |-- index.html
|   |-- app.js
|   `-- styles.css
|-- docs/
|   |-- BLUEPRINT.md
|   |-- CONTRACT_DESIGN_SPEC.md
|   |-- SUBMISSION.md
|   `-- PROJECT_SUBMISSION.md
|-- scripts/
|   |-- deploy_policy_oracle.mjs
|   |-- demo_policy_flow.mjs
|   `-- LOCAL_SETUP.md
|-- tests/
|   `-- test_policy_oracle_contract.py
|-- vercel.json
`-- README.md
```

## Validator / Consensus Logic

`PolicyOracle` uses:

- `gl.nondet.exec_prompt(..., response_format="json")`
- `gl.vm.run_nondet_unsafe(...)`

The validator compares stable execution-relevant fields:

- `decision`
- `confidence`
- `score`

This matters because the contract is not just checking JSON shape. It is checking whether validators converge closely enough on the result that actually drives execution.

## Real State Change

Each evaluation stores:

- `policy_id`
- `subject`
- `evidence_json`
- `reference_urls_json`
- `decision`
- `score`
- `confidence`
- `reason`
- `evidence_used`
- `evaluator`

This means the result is:

- onchain
- readable later
- reusable by another app
- suitable for gating downstream execution

## Screenshots / Visual Review

### Live app

- Production app: `https://genlayer-policy-eco.vercel.app`
- Deployment inspector: `https://vercel.com/jinchains-projects/genlayer-policy-eco/13SuEfanuhjzaKcg8SbZc8mZG2rM`

### Suggested screenshots for reviewers

This repo does not embed local screenshot image files yet, but the easiest screenshots to capture from the live app are:

1. Policy creation form
2. Submission evaluation form
3. Returned verdict card showing execution unlocked or blocked
4. Explorer page for the deployed contract
5. Explorer page for the `create_policy` and `evaluate` transactions

If image assets are added later, they should be placed in a dedicated folder such as `docs/screenshots/`.

## Live Links And Evidence

### GitHub

- Repo: `https://github.com/Jinchainne/genlayer-policy-eco`

### Live project

- Live app: `https://genlayer-policy-eco.vercel.app`

### Studionet contract evidence

- Network: `studionet`
- Contract address: `0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Contract link: `https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Deploy tx: `0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- Deploy tx link: `https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- `create_policy` tx: `0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`
- `create_policy` tx link: `https://explorer-studio.genlayer.com/tx/0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`
- `evaluate` tx: `0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`
- `evaluate` tx link: `https://explorer-studio.genlayer.com/tx/0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`
- Returned `policy_id`: `policy-1`
- Returned `evaluation_id`: `evaluation-1`

## Original Intelligent Contract Submission Context

This section exists intentionally so reviewers do not think the original `Intelligent Contracts` submission disappeared.

The original submission was about:

- the reusable `PolicyOracle` primitive
- contract-native policy evaluation
- onchain verdict storage
- downstream gating potential

That original artifact still exists in this repo, especially in:

- [`contracts/PolicyOracle.py`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)
- [`docs/SUBMISSION.md`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/SUBMISSION.md)
- [`docs/CONTRACT_DESIGN_SPEC.md`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/CONTRACT_DESIGN_SPEC.md)

So if a judge is reviewing the earlier `Intelligent Contracts` entry, this repo still remains valid for that purpose.

## Why This Also Qualifies As A Project

The repo now goes beyond a standalone primitive because it includes:

- a frontend UI
- API routes
- real contract reads and writes
- a real execution binding path
- a deployed live app

This directly addresses the usual rejection pattern of:

- static UI only
- fake integration
- no workflow that actually depends on the contract

## Reusability

Other builders can reuse `PolicyOracle` as:

- a contribution review engine
- a payout approval gate
- a moderation review layer
- an agent action safety gate
- a refund / dispute pre-check
- a compliance-like decision layer

## Running Locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- `pytest`
- GenLayer-compatible RPC

### Install

```bash
npm install
pip install pytest
```

### Test the contract layer

```bash
pytest
```

### Run the local app server

```bash
cp .env.example .env
npm run app
```

Open:

```text
http://127.0.0.1:3000
```

### Deploy contract / run demo scripts

```bash
npm run deploy:local
npm run demo:local
```

## Review Path

If a reviewer wants the fastest path:

1. Read this README
2. Inspect [`contracts/PolicyOracle.py`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)
3. Inspect [`public/index.html`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/index.html)
4. Inspect [`api/workflows/submission-gate.js`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/workflows/submission-gate.js)
5. Open `https://genlayer-policy-eco.vercel.app`
6. Check the Studionet explorer links above

## Known Limitations

- The current project UI is intentionally focused and minimal rather than a full operations dashboard.
- The first project version is optimized for submission review and policy gating, not for multi-role enterprise administration.
- Screenshot image files are not yet stored inside the repo, even though the live app and explorer evidence are available.

## Anti-Reject Notes

This repo is designed to avoid the most common GenLayer review failures:

- not deterministic-only
- not static UI only
- not fake contract integration
- not local-only state pretending to be onchain
- not a one-file example with no reusable value

## Related Docs

- [`docs/SUBMISSION.md`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/SUBMISSION.md)
- [`docs/PROJECT_SUBMISSION.md`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/PROJECT_SUBMISSION.md)
- [`docs/CONTRACT_DESIGN_SPEC.md`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/CONTRACT_DESIGN_SPEC.md)
- [`docs/BLUEPRINT.md`](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/BLUEPRINT.md)
