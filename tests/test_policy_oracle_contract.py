import importlib.util
import json
import pathlib
import sys
import types


class FakeTreeMap(dict):
    def get(self, key, default=None):
        return super().get(key, default)


class FakePublicWrite:
    def __call__(self, fn):
        return fn


class FakePublic:
    write = FakePublicWrite()

    @staticmethod
    def view(fn):
        return fn


class FakeEqPrinciple:
    @staticmethod
    def prompt_non_comparative(fn, task=None, criteria=None):
        return fn()


class FakeWeb:
    @staticmethod
    def render(url, mode="text"):
        return f"fetched:{url}:{mode}"


class FakeNondet:
    web = FakeWeb()

    @staticmethod
    def exec_prompt(prompt, response_format="json"):
        return {
            "decision": "allow",
            "score": 88,
            "confidence": "high",
            "reason": "Evidence satisfies the policy.",
            "evidence_used": ["repo history", "documentation"],
        }


class FakeMessage:
    sender_address = "0xtester"
    datetime = "2026-07-27T00:00:00Z"


class FakeGl:
    Contract = object
    public = FakePublic()
    eq_principle = FakeEqPrinciple()
    nondet = FakeNondet()
    message = FakeMessage()
    vm = None

    class UserError(Exception):
        pass


class FakeReturn:
    def __init__(self, calldata):
        self.calldata = calldata


class FakeVm:
    Return = FakeReturn

    @staticmethod
    def run_nondet_unsafe(leader_fn, validator_fn):
        result = leader_fn()
        ok = validator_fn(FakeReturn(result))
        if not ok:
            raise AssertionError("Validator rejected leader result in test stub")
        return result


FakeGl.vm = FakeVm


def load_contract_module():
    fake_module = types.ModuleType("genlayer")
    fake_module.gl = FakeGl
    fake_module.TreeMap = FakeTreeMap
    fake_module.u64 = int
    sys.modules["genlayer"] = fake_module

    contract_path = pathlib.Path(__file__).resolve().parents[1] / "contracts" / "PolicyOracle.py"
    spec = importlib.util.spec_from_file_location("PolicyOracle", contract_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_create_policy_and_counts():
    module = load_contract_module()
    contract = module.PolicyOracle()
    contract.__init__()

    policy_id = contract.create_policy(
        "Grant Review",
        "Approve only if the submission is original and evidenced.",
        "Originality and evidence quality both matter.",
        "contributions",
    )

    assert policy_id == "policy-1"
    stored = json.loads(contract.get_policy(policy_id))
    assert stored["name"] == "Grant Review"
    assert stored["active"] is True

    counts = json.loads(contract.get_counts())
    assert counts["policy_count"] == 1
    assert counts["evaluation_count"] == 0


def test_evaluate_stores_consensus_backed_result():
    module = load_contract_module()
    contract = module.PolicyOracle()
    contract.__init__()

    policy_id = contract.create_policy(
        "Payout Gate",
        "Allow payouts only when evidence clearly supports completion.",
        "Deny if evidence is missing; use undetermined for ambiguity.",
        "payouts",
    )

    evaluation_id = contract.evaluate(
        policy_id,
        "Milestone completion claim",
        '{"artifacts":["demo video","github commits"]}',
        '["https://example.com/proof"]',
    )

    assert evaluation_id == "evaluation-1"
    stored = json.loads(contract.get_result(evaluation_id))
    assert stored["policy_id"] == policy_id
    assert stored["decision"] == "allow"
    assert stored["confidence"] == "high"
    assert contract.is_allowed(evaluation_id) is True


def test_inactive_policy_cannot_be_evaluated():
    module = load_contract_module()
    contract = module.PolicyOracle()
    contract.__init__()

    policy_id = contract.create_policy(
        "Moderation Gate",
        "Deny violating content.",
        "If evidence is inconclusive, return undetermined.",
        "moderation",
    )

    contract.set_policy_active(policy_id, False)

    try:
        contract.evaluate(policy_id, "post", '{"text":"hello"}')
    except module.gl.UserError as exc:
        assert "inactive" in str(exc)
    else:
        raise AssertionError("Expected inactive policy evaluation to fail")
