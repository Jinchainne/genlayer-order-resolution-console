# Blueprint

## Goal

Build a repo that can be submitted as an `Intelligent Contract` first, then expanded into a full `Project` without throwing away the original primitive.

## Phase 1: Intelligent Contract

Deliverables:

- reusable `PolicyOracle` contract
- submission-ready README
- contract design spec
- tests for interface and contract flow assumptions
- local setup notes

What matters in this phase:

- meaningful GenLayer-native non-deterministic decision
- clear policy evaluation use case
- stored verdicts with structured outputs
- documentation that explains reuse

## Phase 2: Project

Future project layer:

- policy management dashboard
- evidence submission UI
- review queue
- decision explorer
- API or SDK wrapper
- policy-gated app flows

Examples of project extensions:

- rewards / airdrop claim review
- contribution approval portal
- marketplace action guard
- agent action approval console
- moderation decision center

## Suggested Project Evolution

### Track A: Contribution Review

Use `PolicyOracle` to evaluate:

- whether a submission is original
- whether evidence supports a milestone
- whether a contribution meets quality criteria

### Track B: Agent Policy Guard

Use `PolicyOracle` to decide:

- whether an agent can spend
- whether a task result should be accepted
- whether a refund or dispute should proceed

### Track C: Moderation / Safety Layer

Use `PolicyOracle` to evaluate:

- content violations
- policy compliance
- marketplace listing approval

## Why This Architecture Works

- The contract is useful on its own.
- The future project can reuse the same storage and decision API.
- It avoids the trap of shipping a big UI with a weak contract.
- It fits GenLayer's current submission bar better than toy demos.

