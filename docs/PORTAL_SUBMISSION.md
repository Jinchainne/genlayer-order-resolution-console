# Portal Submission Pack

## Contribution Type

`Builder -> Intelligent Contracts`

## Contribution Date

`2026-07-27`

## Suggested Title

`PolicyOracle: GenLayer policy evaluation primitive for allow/deny consensus`

## Notes / Description

`PolicyOracle` is a reusable GenLayer Intelligent Contract that evaluates whether a requested action complies with natural-language policy and evidence, then stores a consensus-backed `allow`, `deny`, or `undetermined` verdict onchain.

This is designed as a standalone primitive for other builders, not a frontend-only demo. It supports reusable policy creation, onchain evaluation, structured verdict storage, and downstream gating for contribution review, payout approval, moderation, refund pre-checks, and agent workflows.

The contract uses GenLayer-native non-deterministic execution with `gl.nondet.exec_prompt(...)` and validator consensus with `gl.vm.run_nondet_unsafe(...)`. The output is not just free-form text: stable execution fields such as `decision`, `confidence`, and `score` are normalized and stored, so downstream applications can bind real workflow execution to the result.

This repo also includes a project-ready client flow and a policy-gated execution example, so the same contract can later be expanded into a full GenLayer `Project`.

## Evidence Link Suggestions

Use these as evidence entries in the portal:

1. Repository
`https://github.com/Jinchainne/genlayer-order-resolution-console`

Suggested type:
`GitHub Repository`

2. Contract deployment proof
`https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`

Suggested note:
`Studionet contract deployment: 0x378986E3Af625f1873c46Ab96E919E7886eFf108, deploy tx 0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`

3. Policy creation proof
`https://explorer-studio.genlayer.com/tx/0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`

Suggested note:
`create_policy tx on studionet: 0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32, returned policy-1`

4. Evaluation proof
`https://explorer-studio.genlayer.com/tx/0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`

Suggested note:
`evaluate tx on studionet: 0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1, returned evaluation-1`

## Short Overall Opinion

This submission is a real GenLayer-native primitive with reusable policy logic, structured onchain results, and a clear path to downstream project integration.
