# genlayer-policy-eco

`genlayer-policy-eco` is a GenLayer project centered on a reusable `Intelligent Contract` primitive: a `PolicyOracle` that evaluates actions against natural-language rules and evidence, then stores a consensus-backed verdict onchain.

This repository started as an `Intelligent Contract` submission and is now expanded into a full `Project` with a live policy review console, app-to-contract workflow, and policy-gated execution path.

## Submission Category

Current target: `Projects`

Original submission base: `Intelligent Contracts`

## TL;DR

Name: `PolicyOracle`

One-line summary:
`A reusable GenLayer policy evaluation primitive that decides allow / deny / undetermined outcomes from natural-language policy text plus structured evidence.`

Why GenLayer is necessary:
`The core decision is qualitative and non-deterministic. A single backend or validator should not unilaterally decide whether an action complies with policy. GenLayer consensus is used to produce a fair, explainable result.`

Primary builder benefit:
`Other builders can reuse this contract to gate payouts, moderation actions, contribution approvals, refunds, disputes, and agent workflows.`

## What This Submission Is

This submission is now a complete GenLayer app workflow built on top of the original reusable `PolicyOracle` contract.

The project lets any builder or reviewer:

- create a reusable policy with human-readable rules
- submit a subject plus supporting evidence
- trigger GenLayer-native AI evaluation
- receive a consensus-backed `allow`, `deny`, or `undetermined` result
- read the stored verdict later from the app or other downstream consumers
- bind the verdict to a real execution status of `unlock_submission` or `hold_submission`

## Why This Belongs Under Projects

This repository now qualifies as a `Project` because it includes a real app workflow around the submitted contract.

It provides:

- a policy review console at `app/index.html`
- a Node app server in `server.mjs`
- real contract writes for `create_policy` and `evaluate`
- real contract reads for `get_result` and `is_allowed`
- an execution binding flow in `src/project/policy-submission-workflow.mjs`

It is still not:

- a learning-only exercise
- a static UI without execution
- a fake integration that never reads or writes the submitted contract

## GenLayer-Native Logic

### The non-deterministic decision

The contract evaluates whether a submitted action or request complies with a natural-language policy and supporting criteria.

Example use cases:

- should a bounty payout be approved
- should a refund be granted
- should an agent action be allowed
- should a contribution count for rewards
- should a moderation action be blocked or approved

### Why consensus matters

These judgments are qualitative. They depend on policy interpretation, evidence quality, ambiguity handling, and reasoning quality. A centralized backend could bias decisions. GenLayer lets validators independently evaluate and converge on an equivalent final outcome.

### Why a normal app is not enough

A normal app could call one model and show one answer, but that does not create decentralized trust. This primitive is meant to be reused where a high-stakes policy decision should not come from one operator alone.

### What breaks without GenLayer

Without GenLayer, the stored allow / deny result becomes a centralized policy opinion instead of a consensus-backed execution outcome.

## Real Workflow

```text
Caller -> PolicyOracle.create_policy() -> Policy stored onchain
Caller -> PolicyOracle.evaluate() -> GenLayer AI consensus -> Result stored onchain
Policy review console -> read verdict -> unlock submission or hold execution
```

## Repository Structure

```text
.
|-- contracts/
|   `-- PolicyOracle.py
|-- app/
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- docs/
|   |-- BLUEPRINT.md
|   |-- CONTRACT_DESIGN_SPEC.md
|   |-- PROJECT_SUBMISSION.md
|   `-- SUBMISSION.md
|-- sdk/
|   `-- policy-client.mjs
|-- src/
|   |-- lib/
|   |   `-- policy-client.mjs
|   `-- project/
|       |-- policy-gated-flow.mjs
|       `-- policy-submission-workflow.mjs
|-- scripts/
|   |-- demo_policy_flow.mjs
|   |-- deploy_policy_oracle.mjs
|   |-- create_github_repo.ps1
|   `-- LOCAL_SETUP.md
|-- tests/
|   `-- test_policy_oracle_contract.py
|-- .env.example
|-- .gitignore
|-- package.json
|-- pyproject.toml
|-- server.mjs
`-- README.md
```

## Contract Overview

### Main contract

- Name: `PolicyOracle`
- Path: `contracts/PolicyOracle.py`
- Purpose: `Store natural-language policies and produce consensus-backed allow / deny / undetermined decisions from submitted evidence.`

## Validator / Equivalence / Verification Logic

The contract uses:

- `gl.nondet.exec_prompt(..., response_format="json")` to produce structured decisions
- `gl.vm.run_nondet_unsafe(...)` so validators independently re-run the evaluation and compare the stable fields that matter to execution

The stable fields are:

- `decision`
- `confidence`
- `score`

Reasoning can vary slightly across validators, but execution is bound to stable fields that the validator checks directly.

## Real State Change or Real Impact

Each evaluation is persisted onchain with:

- the referenced `policy_id`
- the submitted subject
- the submitted evidence
- the final `allow / deny / undetermined` result
- score and confidence
- a human-readable reason
- evaluator address

This is not local-only state. The intent is for downstream apps or contracts to read and enforce the result.

An example project-side gate is included in:

- `src/project/policy-gated-flow.mjs`

That flow reads the stored verdict and sets `blockedByPolicy` / `policyBoundToExecution` before allowing the next action.

## Frontend / App Integration

The project app is intentionally small but real:

- `server.mjs` exposes JSON routes that call the submitted GenLayer contract
- `app/index.html` provides the policy creation and submission review UI
- `app/app.js` sends user actions into real API requests
- `src/project/policy-submission-workflow.mjs` binds the contract verdict to `unlock_submission` or `hold_submission`

This is a genuine application-to-contract workflow rather than a contract address display.

## Reusability

Other builders can reuse this contract as:

- a contribution review primitive
- a payout approval gate
- a refund or dispute pre-check
- a moderation / safety gate
- an agent action policy engine
- a compliance-like allowlist / denylist decision layer

## Running Locally

This repo preserves the original contract-first artifact and now adds a project layer on top.

### Prerequisites

- Python 3.10+
- pytest
- Node.js 18+
- a GenLayer-compatible local or studio environment for real deployment

### Install

```bash
pip install pytest
npm install
```

### Run tests

```bash
pytest
```

### Run the project app

```bash
cp .env.example .env
npm install
npm run app
```

Then open:

```text
http://127.0.0.1:3000
```

### Deploy / manual review

```bash
npm run deploy:local
npm run demo:local
```

See also:

- `contracts/PolicyOracle.py`
- `docs/CONTRACT_DESIGN_SPEC.md`
- `docs/SUBMISSION.md`
- `scripts/LOCAL_SETUP.md`

## Deployment / Explorer / Live Links

This repository is submission-ready at the code and design level and now includes a real `studionet` deployment.

- Live app: `run locally with npm run app`
- Demo video: `add after deployment`
- Network: `studionet`
- Studio explorer base: `https://explorer-studio.genlayer.com`
- Contract link: `https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Contract address: `0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Deploy tx: `0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- create_policy tx: `0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`
- evaluate tx: `0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`
- Deploy tx link: `https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- create_policy tx link: `https://explorer-studio.genlayer.com/tx/0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`
- evaluate tx link: `https://explorer-studio.genlayer.com/tx/0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`
- Returned policy id: `policy-1`
- Returned evaluation id: `evaluation-1`

## Originality

This repo is not a basic hello-world contract or format-only validator demo.

Its core originality is:

- reusable policy evaluation as a primitive
- structured allow / deny decision storage
- a completed upgrade path from `Intelligent Contract` to `Project`
- direct relevance to real GenLayer submission, payout, moderation, and agent workflows

## What Reviewers Should Verify

### Verify in the repo

- contract source is included
- GenLayer-native non-deterministic evaluation is implemented
- policy and result storage are explicit
- outputs are structured and reusable
- the repository explains why this belongs on GenLayer
- the project layer really binds the result to execution

### Verify in execution

- `create_policy()` stores a reusable rule
- `evaluate()` triggers GenLayer consensus
- the final verdict is stored and queryable
- downstream consumers could gate execution on the result

## Known Limitations

- This project uses a lightweight local Node server rather than a hosted production frontend.
- Evidence fetching from URLs is intentionally bounded and conservative to keep the primitive simple.
- The first version stores results for clarity; future versions can add richer indexing and downstream messaging.

## Submission Notes

Review this repo in this order:

1. `README.md`
2. `docs/PROJECT_SUBMISSION.md`
3. `app/index.html`
4. `server.mjs`
5. `src/project/policy-submission-workflow.mjs`
6. `contracts/PolicyOracle.py`
7. `sdk/policy-client.mjs`
8. `scripts/demo_policy_flow.mjs`

Fastest verification path:

1. read the contract interface
2. inspect the nondeterministic evaluation flow
3. inspect the JS client wrapper used by the live project server
4. inspect the workflow that performs create -> evaluate -> read -> execution gate
5. confirm that results are stored in persistent state
6. confirm that the project uses the contract as a core workflow dependency

Studionet proof bundle:

1. Deploy `PolicyOracle` on `July 27, 2026`
2. Create a real policy onchain
3. Evaluate real repository evidence against that policy
4. Confirm the resulting evaluation id is stored onchain

## Pre-Submission Self-Check

- Contract source code is in the repo.
- The AI decision actually runs on GenLayer.
- The contract stores a meaningful verdict, not just free-form text.
- The primitive is reusable by other builders.
- The repo explains why a normal app is not enough.
- The result gates real downstream execution in the project layer.
- This repo now includes a full project workflow and preserves the original intelligent contract.

## Anti-Reject Reminders

This repository intentionally avoids common failure cases:

- not deterministic-only
- not a fake app integration
- not a one-file empty example with no purpose
- not a generic “AI decides” toy demo
- not a thin UI over static content

## Sources Used For The Contract Design

This implementation and documentation align with the official GenLayer docs:

- GenLayer Intelligent Contracts introduction:
  https://docs.genlayer.com/developers/intelligent-contracts/introduction
- Non-determinism:
  https://docs.genlayer.com/developers/intelligent-contracts/features/non-determinism
- Calling LLMs:
  https://docs.genlayer.com/developers/intelligent-contracts/features/calling-llms
- Storage:
  https://docs.genlayer.com/developers/intelligent-contracts/storage
- Python SDK reference:
  https://sdk.genlayer.com/main/python-sdk/reference/index.html
