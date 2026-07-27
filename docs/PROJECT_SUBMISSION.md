# Project Submission Pack

## Contribution Type

`Builder -> Projects`

## Project Name

`genlayer-policy-eco`

## Date

`2026-07-27`

## What The Project Is

`genlayer-policy-eco` is now a full GenLayer project built around the `PolicyOracle` Intelligent Contract. It provides a policy review console where a builder or reviewer can create reusable policies, submit evidence-backed requests for evaluation, and bind the onchain verdict directly to execution gating.

## Real Workflow

```text
User fills policy form -> app writes create_policy -> policy stored onchain
User submits review request -> app writes evaluate -> GenLayer consensus returns verdict
App reads get_result + is_allowed -> execution becomes unlock_submission or hold_submission
```

## Why It Fits Projects

- It has a clear app workflow, not just a contract demo.
- The app really reads and writes the submitted contract.
- The contract result is bound to execution state in the project layer.
- The same repo still preserves the original Intelligent Contract primitive.

## Reviewer Fast Path

1. `app/index.html`
2. `app/app.js`
3. `server.mjs`
4. `src/project/policy-submission-workflow.mjs`
5. `contracts/PolicyOracle.py`

## Evidence Links

- Repo: `https://github.com/Jinchainne/genlayer-policy-eco`
- Contract: `https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Deploy tx: `https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- create_policy tx: `https://explorer-studio.genlayer.com/tx/0xe22a6be500cf62c57ce947f4cba16452f8d18f8115d3c041df7f10d6f4825a32`
- evaluate tx: `https://explorer-studio.genlayer.com/tx/0x50c88b16daefd867962206539628ad7b633dda07b47222f619b8c21dcd9eabb1`
