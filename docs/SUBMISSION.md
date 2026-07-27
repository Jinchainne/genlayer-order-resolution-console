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

This repository now has real `studionet` execution evidence:

- Network: `studionet`
- Studio explorer base: `https://explorer-studio.genlayer.com`
- Contract link: `https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Contract address: `0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Deploy tx: `0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- `create_policy` tx: `0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`
- `evaluate` tx: `0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`
- Deploy tx link: `https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- `create_policy` tx link: `https://explorer-studio.genlayer.com/tx/0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`
- `evaluate` tx link: `https://explorer-studio.genlayer.com/tx/0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`
- Returned `policy_id`: `policy-1`
- Returned `evaluation_id`: `evaluation-1`

Recommended extra evidence before portal submission:

- short video or GIF of the deploy + evaluate flow
- screenshot of the explorer or receipt output
