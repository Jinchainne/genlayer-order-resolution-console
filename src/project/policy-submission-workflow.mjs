import {
  buildClient,
  createPolicy,
  evaluatePolicy,
  readResult,
  readIsAllowed,
} from "../lib/policy-client.mjs";
import { extractReturnValue } from "../lib/receipt-utils.mjs";

export async function runSubmissionGateWorkflow(address, payload) {
  const client = buildClient();

  let policyId = payload.policyId || "";
  let createPolicyTxHash = null;

  if (!policyId) {
    const createTx = await createPolicy(client, address, {
      name: payload.name || "Project Submission Gate",
      policyText:
        payload.policyText ||
        "Allow only if the submission shows original work, clear evidence, and meaningful execution.",
      criteriaText:
        payload.criteriaText ||
        "Deny copied or weak submissions. Return undetermined if the evidence is partial or ambiguous.",
      category: payload.category || "project-gating",
    });

    createPolicyTxHash = createTx.hash;
    policyId = extractReturnValue(createTx.receipt) || "policy-1";
  }

  const evaluationTx = await evaluatePolicy(client, address, {
    policyId,
    subject: payload.subject,
    evidence: payload.evidence,
    referenceUrls: payload.referenceUrls || [],
  });

  const evaluationId = extractReturnValue(evaluationTx.receipt) || "evaluation-1";
  const latest_policy_result = await readResult(client, address, evaluationId);
  const blockedByPolicy = !(await readIsAllowed(client, address, evaluationId));
  const policyBoundToExecution = !blockedByPolicy;

  return {
    contractAddress: address,
    policyId,
    evaluationId,
    createPolicyTxHash,
    evaluateTxHash: evaluationTx.hash,
    latest_policy_result,
    blockedByPolicy,
    policyBoundToExecution,
    executionStatus: blockedByPolicy ? "blocked" : "allowed",
    nextAction: blockedByPolicy ? "hold_submission" : "unlock_submission",
  };
}
