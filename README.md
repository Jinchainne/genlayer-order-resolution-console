# genlayer-policy-eco

`genlayer-policy-eco` is a live GenLayer project tool for teams that need to review evidence, apply reusable policies, and turn qualitative decisions into real workflow outcomes.

Instead of forcing operators to manually inspect links, rewrite JSON, and make one-off judgment calls in chat, this project provides a repeatable review workflow:

- build an evidence bundle from repo, live app, and explorer links
- optionally run an AI pre-judge to improve the review bundle
- create or reuse a policy on GenLayer
- evaluate the bundle through the `PolicyOracle` contract
- bind the verdict to downstream execution such as `unlock_submission` or `hold_submission`

Live project:

- App: `https://genlayer-policy-eco.vercel.app`
- Repo: `https://github.com/Jinchainne/genlayer-policy-eco`
- Contract: `https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`

## What This Tool Is For

This is not just a contract demo. It is a usable review operations tool.

Practical use cases:

- project submission review
- grant or payout approval review
- contribution screening
- moderation review
- internal execution gating for builder workflows

Real-world problem it solves:

- reviewers often receive messy proof spread across GitHub, live apps, tx links, screenshots, and notes
- teams need a structured way to turn that evidence into a repeatable decision
- if the decision matters, it should not live only in a centralized backend or a temporary spreadsheet note

`genlayer-policy-eco` solves that by giving teams a front-end workspace, an AI copilot, and a GenLayer-native final decision path.

## Why GenLayer Matters

The core decision is qualitative, not deterministic-only.

The final verdict depends on:

- natural-language policy interpretation
- evidence quality
- ambiguity handling
- reasoning over multiple public sources

That is why the contract uses GenLayer-native non-deterministic execution instead of a normal if/else rule engine.

Strong contract signals:

- `gl.nondet.web.render(...)`
- `gl.nondet.exec_prompt(...)`
- `gl.vm.run_nondet_unsafe(...)`

The result is then written onchain and read back into the app so the workflow can continue or stop.

## What The Project Does

### Main user-facing features

1. `Evidence Workspace`
Build a structured bundle from:
- repo URL
- live app URL
- contract explorer URL
- deploy tx
- `create_policy` tx
- `evaluate` or workflow tx
- claims and review notes

2. `AI Pre-Judge`
Send the bundle to a server-side AI copilot that returns:
- preliminary verdict
- confidence
- reasons
- missing evidence
- improved subject
- improved claims
- improved reviewer notes

3. `Policy Creation`
Create reusable policies directly on GenLayer from the web app.

4. `Workflow Gate`
Run a real evaluation against the contract and map the result to:
- `unlock_submission`
- `hold_submission`

5. `Recent Reviews`
Store recent review bundles in the browser so operators can reuse them instead of rebuilding the same workflow every time.

## Text Illustration

### Product view

```text
┌───────────────────────────────┐
│ PolicyOracle Workflow Studio  │
├───────────────────────────────┤
│ 1. Build evidence bundle      │
│ 2. Run AI pre-judge           │
│ 3. Create or reuse policy     │
│ 4. Evaluate on GenLayer       │
│ 5. Unlock or hold execution   │
└───────────────────────────────┘
```

### End-to-end flow

```text
Operator collects proof
-> Evidence Workspace structures the bundle
-> AI Pre-Judge improves subject / claims / notes
-> App writes create_policy or reuses existing policy
-> App writes evaluate to PolicyOracle
-> GenLayer validators review the evidence
-> Contract stores allow / deny / undetermined
-> App reads get_result + is_allowed
-> Workflow becomes unlock_submission or hold_submission
```

### Review state model

```text
[bundle-ready]
      |
      v
[ai pre-judged]
      |
      v
[policy created or selected]
      |
      v
[evaluated onchain]
      |
      +--> [allowed] ------> unlock_submission
      |
      +--> [blocked] ------> hold_submission
      |
      +--> [undetermined] -> manual follow-up
```

## Architecture

There are three layers in this repo.

### 1. Contract layer

The reusable primitive is `PolicyOracle`.

Responsibilities:

- store natural-language policies
- accept evidence and reference URLs
- fetch public source material during execution
- produce consensus-backed `allow`, `deny`, or `undetermined`
- persist evaluation results onchain

Main file:

- [contracts/PolicyOracle.py](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)

### 2. Project application layer

The project layer turns the contract into a usable tool.

Responsibilities:

- generate evidence bundles
- run AI-assisted pre-review
- create policies from UI
- evaluate project bundles from UI
- bind verdict to execution state

Main files:

- [public/index.html](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/index.html)
- [public/app.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/app.js)
- [api/workflows/submission-gate.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/workflows/submission-gate.js)
- [src/project/policy-submission-workflow.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/project/policy-submission-workflow.mjs)

### 3. AI copilot layer

The AI layer is offchain and advisory.

Responsibilities:

- produce a preliminary review
- improve the bundle before final onchain evaluation
- keep the API key server-side

Main files:

- [api/ai/prejudge.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/ai/prejudge.js)
- [src/lib/ai-prejudge.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/lib/ai-prejudge.mjs)

Important design boundary:

- `AI Pre-Judge` is helper logic
- `GenLayer evaluation` is the final project decision path

## Repository Tree

```text
genlayer-policy-eco/
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
│  ├─ PORTAL_SUBMISSION.md
│  ├─ PROJECT_SUBMISSION.md
│  └─ SUBMISSION.md
├─ public/
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ scripts/
│  ├─ create_github_repo.ps1
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
├─ tests/
│  └─ test_policy_oracle_contract.py
├─ .env.example
├─ package.json
├─ pyproject.toml
├─ README.md
├─ server.mjs
└─ vercel.json
```

## Important Files

### Contract and consensus

- [contracts/PolicyOracle.py](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)
- [tests/test_policy_oracle_contract.py](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/tests/test_policy_oracle_contract.py)

### Frontend

- [public/index.html](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/index.html)
- [public/app.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/app.js)
- [public/styles.css](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/styles.css)

### API routes

- [api/policies/index.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/policies/index.js)
- [api/evaluations/index.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/evaluations/index.js)
- [api/workflows/submission-gate.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/workflows/submission-gate.js)
- [api/ai/prejudge.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/ai/prejudge.js)

### Workflow binding

- [src/project/policy-submission-workflow.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/project/policy-submission-workflow.mjs)
- [src/project/policy-gated-flow.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/project/policy-gated-flow.mjs)

### Shared clients and helpers

- [src/lib/policy-client.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/lib/policy-client.mjs)
- [sdk/policy-client.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/sdk/policy-client.mjs)
- [src/lib/receipt-utils.mjs](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/src/lib/receipt-utils.mjs)

## Practical Applications

### 1. Builder review desk

A small team can use this tool to review incoming submissions and avoid making decisions from scattered notes.

```text
Incoming project
-> attach repo, live app, explorer links
-> AI pre-judge improves the review bundle
-> policy runs onchain
-> action unlocks or stays blocked
```

### 2. Grant or milestone approval

The same workflow can gate milestone releases:

- policy checks whether evidence is sufficient
- bundle includes repo diff, live demo, deployment, and tx links
- final verdict decides whether the next payout step should proceed

### 3. Contribution moderation

For communities or tooling teams:

- gather issue, PR, demo, and explorer proof
- review against reusable moderation or quality policy
- use onchain result as the trusted record of the decision

### 4. Internal compliance-like workflows

For teams that want evidence-based approvals:

- define team-specific policy once
- reuse it across repeated reviews
- keep the final result tied to a real contract state instead of a private backend only

## Why This Is More Than A Demo

This repo has all three of the things reviewers usually want to see:

1. meaningful GenLayer-native non-deterministic contract logic
2. real application-to-contract write and read paths
3. project-side execution binding

Concrete code signals:

- contract writes: `create_policy`, `set_policy_active`, `evaluate`
- contract reads: `get_policy`, `get_result`, `is_allowed`, `get_counts`
- client writes: `writeContract(...)`
- client reads: `readContract(...)`
- receipt handling: `waitForTransactionReceipt(...)`
- execution binding: `blockedByPolicy`, `policyBoundToExecution`, `unlock_submission`, `hold_submission`

## Live Evidence

### GitHub

- Repo: `https://github.com/Jinchainne/genlayer-policy-eco`

### Production app

- `https://genlayer-policy-eco.vercel.app`

### Studionet contract

- Contract address: `0x378986E3Af625f1873c46Ab96E919E7886eFf108`
- Explorer: `https://explorer-studio.genlayer.com/address/0x378986E3Af625f1873c46Ab96E919E7886eFf108`

### Verified transactions

- Deploy tx:
  `https://explorer-studio.genlayer.com/tx/0xf1c2f18a5cdc2dfe7aee6c860a183e11ac480ce907a868c2c7c07c69df8e1111`
- Live `create_policy` tx:
  `https://explorer-studio.genlayer.com/tx/0xeb09fa365e6aa3454fd8be92c55474ec24ab95f7e825a8cf7ba058e12c16e083`
- Live `evaluate` tx:
  `https://explorer-studio.genlayer.com/tx/0x3b61a808f6e2bcb27cfc75fe88d5cf68bab600427e5bacaf64a19a385fa73c59`
- Live workflow tx:
  `https://explorer-studio.genlayer.com/tx/0x530c889d94dbbc7ba118cf91b637b342ee8155aba78f603c0d838f1e07812121`

## Screenshots In Text Form

### Home screen layout

```text
[Masthead]
PolicyOracle Workflow Studio
Operational Policy Infrastructure

[Overview]
- what makes this useful
- core workflow
- why GenLayer

[Evidence Workspace]
- use case template
- repo URL
- live app URL
- contract / tx links
- claims
- review notes

[Bundle Preview]
- generated subject
- evidence JSON
- reference URLs JSON
- AI preliminary verdict

[Policy + Workflow]
- create policy onchain
- run workflow gate
- verdict card
- workflow output

[Recent Reviews]
- reusable review memory
```

### Verdict behavior

```text
allow         -> Execution unlocked
deny          -> Execution blocked
undetermined  -> Manual follow-up required
```

## Running Locally

### Requirements

- Node.js 18+
- Python 3.10+
- `pytest`

### Install

```bash
npm install
pip install pytest
```

### Configure

Copy `.env.example` into your local env file and fill:

- `GENLAYER_RPC_URL`
- `GENLAYER_KEYSTORE_JSON`
- `GENLAYER_KEYSTORE_PASSWORD`
- `POLICY_ORACLE_ADDRESS`
- `MIMO_API_KEY`

### Test the contract

```bash
pytest
```

### Run the local server

```bash
npm run app
```

Open:

```text
http://127.0.0.1:3000
```

## Deployment Notes

The hosted app uses server-side environment variables for:

- GenLayer RPC
- contract address
- keystore and signer
- MiMo AI API key

This keeps the signer and AI credentials off the client.

## Reviewer Path

If you want the fastest serious review path:

1. Read this README
2. Inspect [contracts/PolicyOracle.py](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/contracts/PolicyOracle.py)
3. Inspect [public/index.html](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/index.html)
4. Inspect [public/app.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/public/app.js)
5. Inspect [api/workflows/submission-gate.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/workflows/submission-gate.js)
6. Inspect [api/ai/prejudge.js](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/api/ai/prejudge.js)
7. Open `https://genlayer-policy-eco.vercel.app`
8. Verify the explorer links above

## Related Docs

- [docs/PROJECT_SUBMISSION.md](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/PROJECT_SUBMISSION.md)
- [docs/SUBMISSION.md](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/SUBMISSION.md)
- [docs/CONTRACT_DESIGN_SPEC.md](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/CONTRACT_DESIGN_SPEC.md)
- [docs/PORTAL_SUBMISSION.md](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/PORTAL_SUBMISSION.md)
- [docs/BLUEPRINT.md](/D:/AIRDROP/GENLAYER/2.%20JIN/genlayer-policy-eco/docs/BLUEPRINT.md)
