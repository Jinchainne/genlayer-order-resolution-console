# Submission Notes

## Category

`Intelligent Contracts`

## Contract Name

`PolicyOracle`

## What Reviewers Should Know First

This is a reusable policy-evaluation primitive, not a static demo and not a frontend-first app.

The core value is:

- builders can store a human-readable policy
- builders can submit evidence for evaluation
- GenLayer consensus decides `allow`, `deny`, or `undetermined`
- the final verdict is stored onchain and can gate downstream execution

## Why It Belongs On GenLayer

The contract performs a qualitative decision that should not be owned by one centralized backend.

It uses:

- `gl.nondet.exec_prompt(..., response_format="json")`
- `gl.vm.run_nondet_unsafe(...)`

This makes the output consensus-backed rather than a single-model opinion.

## Reuse Cases

- contribution review
- payout approval
- refund pre-check
- moderation gate
- agent action guard
- project submission filtering

## Fast Review Path

1. `contracts/PolicyOracle.py`
2. `sdk/policy-client.mjs`
3. `scripts/demo_policy_flow.mjs`
4. `docs/CONTRACT_DESIGN_SPEC.md`

## Demo Flow

The repository includes a future-project client wrapper and a demo script that performs:

1. deploy contract
2. create policy
3. evaluate evidence
4. read stored result
5. resolve `is_allowed`

## Evidence To Add Before Final Submission

Add these after you run the contract on a real network:

- deployed contract address
- explorer link
- transaction hash for `create_policy`
- transaction hash for `evaluate`
- short video or GIF of the demo flow
