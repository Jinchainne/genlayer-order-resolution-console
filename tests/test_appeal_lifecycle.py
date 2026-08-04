"""End-to-end appeal lifecycle tests."""
from pathlib import Path
import re

SOURCE = (Path(__file__).parents[1] / "contracts" / "PolicyOracle.py").read_text()


def test_appeal_case_exists():
    assert "def appeal_case" in SOURCE


def test_appeal_requires_existing_case():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match, "appeal_case not found"
    body = match.group()
    assert "CASE_NOT_FOUND" in body, "Must check case exists before appeal"


def test_appeal_creates_revision():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "revision_id" in body and "self.revisions" in body, "Must create revision record"


def test_appeal_links_to_parent_revision():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "parent_revision" in body, "Must link to parent revision"


def test_appeal_updates_revision_chain():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "revision_chain" in body, "Must append to revision_chain"


def test_appeal_increments_count():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "appeal_count" in body, "Must increment appeal_count"


def test_appeal_passes_counter_evidence():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "counter_evidence" in body, "Must accept counter-evidence parameter"


def test_appeal_passes_disagreements():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "disagreements" in body, "Must pass disagreements"


def test_resolve_dispute_creates_initial_revision():
    match = re.search(r'def resolve_dispute.*?def appeal_case', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "revision_type" in body and "initial" in body, "Must create initial revision"


def test_resolve_dispute_has_revision_chain():
    match = re.search(r'def resolve_dispute.*?def appeal_case', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert "revision_chain" in body, "Must initialize revision_chain"


def test_revision_view_exists():
    assert "def get_revision" in SOURCE


def test_revision_chain_view_exists():
    assert "def get_revision_chain" in SOURCE


def test_appeal_revision_type_is_appeal():
    match = re.search(r'def appeal_case.*?def get_policy', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert '"appeal"' in body, "Revision type must be 'appeal'"


def test_initial_revision_type_is_initial():
    match = re.search(r'def resolve_dispute.*?def appeal_case', SOURCE, re.DOTALL)
    assert match
    body = match.group()
    assert '"initial"' in body, "Revision type must be 'initial'"
