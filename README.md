# genlayer-policy-eco

`genlayer-policy-eco` is a contract-first GenLayer repository centered on a reusable `Intelligent Contract` primitive: a `PolicyOracle` that evaluates actions against natural-language rules and evidence, then stores a consensus-backed verdict onchain.

This repository is designed to be submitted first under `Intelligent Contracts`. After that, the same primitive can be expanded into a full `Project` with dashboards, admin tooling, review queues, and policy-gated product flows.

## Submission Category

Current target: `Intelligent Contracts`

Recommended future upgrade path: `Projects`

## TL;DR

Name: `PolicyOracle`

One-line summary:
`A reusable GenLayer policy evaluation primitive that decides allow / deny / undetermined outcomes from natural-language policy text plus structured evidence.`

Why GenLayer is necessary:
`The core decision is qualitative and non-deterministic. A single backend or validator should not unilaterally decide whether an action complies with policy. GenLayer consensus is used to produce a fair, explainable result.`

Primary builder benefit:
`Other builders can reuse this contract to gate payouts, moderation actions, contribution approvals, refunds, disputes, and agent workflows.`

## What This Submission Is

This submission is a standalone reusable `Intelligent Contract`, not just a demo UI and not a generic example contract.

The contract lets any builder:

- create a reusable policy with human-readable rules
- submit a subject plus supporting evidence
- trigger GenLayer-native AI evaluation
- receive a consensus-backed `allow`, `deny`, or `undetermined` result
- read the stored verdict later from other apps or contracts

## Why This Belongs Under Intelligent Contracts

This repository is being submitted as an `Intelligent Contract` because the main value is the reusable primitive itself, not a frontend experience.

It provides:

- a reusable policy evaluation pattern
- structured consensus-backed outputs
- real onchain storage of decisions
- a clean interface other builders can integrate

It is not:

- a learning-only exercise
- a thin wrapper around a single prompt
- a static UI without execution
- the same work as a full app submission

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
Consumer app / contract -> read verdict -> allow, deny, or hold execution
```

## Repository Structure

```text
.
|-- contracts/
|   `-- PolicyOracle.py
|-- docs/
|   |-- BLUEPRINT.md
|   `-- CONTRACT_DESIGN_SPEC.md
|-- scripts/
|   |-- create_github_repo.ps1
|   `-- LOCAL_SETUP.md
|-- tests/
|   `-- test_policy_oracle_contract.py
|-- .gitignore
|-- pyproject.toml
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
- `gl.eq_principle.prompt_non_comparative(...)` so validators assess whether the decision satisfies the policy evaluation task, rather than requiring identical wording

The stable fields are:

- `decision`
- `confidence`
- `score`

Reasoning can vary slightly across validators, but the equivalence principle centers the outcome on whether the decision is justified and policy-aligned.

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

## Reusability

Other builders can reuse this contract as:

- a contribution review primitive
- a payout approval gate
- a refund or dispute pre-check
- a moderation / safety gate
- an agent action policy engine
- a compliance-like allowlist / denylist decision layer

## Running Locally

This repo is intentionally contract-first. The main artifact is the contract and its documentation.

### Prerequisites

- Python 3.10+
- pytest
- a GenLayer-compatible local or studio environment for real deployment

### Install

```bash
pip install pytest
```

### Run tests

```bash
pytest
```

### Deploy / manual review

See:

- `contracts/PolicyOracle.py`
- `docs/CONTRACT_DESIGN_SPEC.md`
- `scripts/LOCAL_SETUP.md`

## Deployment / Explorer / Live Links

This repository is submission-ready at the code and design level. Deployment address, explorer URL, and video can be added after deployment.

- Live app: `not included in this contract-first submission`
- Demo video: `add after deployment`
- Explorer contract address: `add after deployment`
- Studio/import link: `add after deployment`

## Originality

This repo is not a basic hello-world contract or format-only validator demo.

Its core originality is:

- reusable policy evaluation as a primitive
- structured allow / deny decision storage
- a clear upgrade path from `Intelligent Contract` to `Project`
- direct relevance to real GenLayer submission, payout, moderation, and agent workflows

## What Reviewers Should Verify

### Verify in the repo

- contract source is included
- GenLayer-native non-deterministic evaluation is implemented
- policy and result storage are explicit
- outputs are structured and reusable
- the repository explains why this belongs on GenLayer

### Verify in execution

- `create_policy()` stores a reusable rule
- `evaluate()` triggers GenLayer consensus
- the final verdict is stored and queryable
- downstream consumers could gate execution on the result

## Known Limitations

- This first submission is contract-first and does not include a full end-user app.
- Evidence fetching from URLs is intentionally bounded and conservative to keep the primitive simple.
- The first version stores results for clarity; future versions can add richer indexing and downstream messaging.

## Submission Notes

Review this repo in this order:

1. `README.md`
2. `docs/CONTRACT_DESIGN_SPEC.md`
3. `contracts/PolicyOracle.py`
4. `tests/test_policy_oracle_contract.py`
5. `docs/BLUEPRINT.md`

Fastest verification path:

1. read the contract interface
2. inspect the nondeterministic evaluation flow
3. confirm that results are stored in persistent state
4. confirm that the primitive is reusable beyond a single demo

## Pre-Submission Self-Check

- Contract source code is in the repo.
- The AI decision actually runs on GenLayer.
- The contract stores a meaningful verdict, not just free-form text.
- The primitive is reusable by other builders.
- The repo explains why a normal app is not enough.
- The result can gate real downstream execution.
- This is not the same work as a full frontend app submission.

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

