# Contract Design Spec

## Contract

Name: `PolicyOracle`

Path: `contracts/PolicyOracle.py`

## Problem

Builders often need a reusable way to decide whether an action complies with policy, but the decision is too qualitative for deterministic-only logic.

Examples:

- should a user receive a payout
- should a refund be approved
- should a contribution count toward a campaign
- should an agent action proceed
- should a moderation rule block content

## Why GenLayer

The decision is inherently judgment-based. It depends on:

- interpreting natural-language rules
- weighing evidence quality
- handling ambiguity
- generating a structured decision with explanation

This is exactly where GenLayer is stronger than traditional deterministic contracts.

## Persistent State

### Policy storage

Each policy stores:

- `policy_id`
- name
- policy text
- criteria text
- category
- active flag
- creator

### Evaluation storage

Each result stores:

- `evaluation_id`
- `policy_id`
- subject
- evidence JSON
- reference URLs JSON
- decision
- score
- confidence
- reason
- evaluator address
- created timestamp

## Public Interface

### `create_policy(...) -> str`

Creates a reusable human-readable policy and returns a generated policy id.

### `set_policy_active(policy_id: str, active: bool) -> None`

Allows the creator to enable or disable a policy.

### `evaluate(policy_id: str, subject: str, evidence_json: str, reference_urls_json: str = "[]") -> str`

Runs GenLayer evaluation and stores a result.

### `get_policy(policy_id: str) -> str`

Returns stored policy JSON.

### `get_result(evaluation_id: str) -> str`

Returns stored result JSON.

### `is_allowed(evaluation_id: str) -> bool`

Returns true only when the stored decision is `allow`.

## Decision Output Schema

The nondeterministic call must return JSON matching this shape:

```json
{
  "decision": "allow",
  "score": 83,
  "confidence": "high",
  "reason": "Short explanation grounded in the policy and evidence.",
  "evidence_used": ["item 1", "item 2"]
}
```

Allowed decisions:

- `allow`
- `deny`
- `undetermined`

Allowed confidence values:

- `high`
- `medium`
- `low`

## Consensus Strategy

Use `gl.vm.run_nondet_unsafe(...)` with a validator function that compares stable execution fields.

Why:

- the reasoning text can vary naturally
- the stable output should be the decision, confidence band, and score range
- validators should compare the fields that control execution rather than the exact wording of the explanation

Consensus focuses on:

- whether the result follows the stated policy
- whether the decision is justified by the evidence
- whether the output schema is valid
- whether the stable execution fields are close enough to be treated as equivalent

## Web / Evidence Handling

The first version accepts:

- structured evidence JSON
- optional reference URLs JSON

If URLs are provided, the contract fetches a bounded amount of web text during nondeterministic execution. This helps ground the decision without requiring a separate backend oracle.

## Anti-Reject Design Choices

This contract is intentionally designed to avoid the current rejection patterns:

- not deterministic-only
- not just a static UI
- not a generic example
- not a format-only validator
- not a one-off toy use case

## Upgrade Path

This same contract can later power a full `Project`:

- policy administration
- review workflows
- evidence intake forms
- dashboards
- project submission review systems
- agent policy controls
