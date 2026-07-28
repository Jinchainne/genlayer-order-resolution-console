import "dotenv/config";
import {
  buildClient,
  createPolicy,
  evaluatePolicy,
  readResult,
  readIsAllowed,
} from "../lib/policy-client.mjs";
import { extractReturnValue } from "../lib/receipt-utils.mjs";

export async function runPolicyBoundExecution() {
  const address = process.env.POLICY_ORACLE_ADDRESS;
  if (!address) {
    throw new Error("Missing POLICY_ORACLE_ADDRESS");
  }

  const client = buildClient();

  const createTx = await createPolicy(client, address, {
    name: "Project Submission Gate",
    policyText:
      "Allow only if the submission shows original work, clear repo evidence, and meaningful execution.",
    criteriaText:
      "Deny weak or copied submissions. Return undetermined if the evidence is partial.",
    category: "project-gating",
  });

  const policyId = extractReturnValue(createTx.receipt) || "policy-1";

  const evaluationTx = await evaluatePolicy(client, address, {
    policyId,
    subject: "A project wants to unlock a gated action after passing policy review.",
    evidence: {
      repoUrl: "https://github.com/example/project",
      proof: ["docs", "commit history", "video"],
    },
    referenceUrls: ["https://github.com/example/project"],
  });

  const evaluationId = extractReturnValue(evaluationTx.receipt) || "evaluation-1";
  const blockedByPolicy = !(await readIsAllowed(client, address, evaluationId));
  const policyBoundToExecution = !blockedByPolicy;
  const latest_policy_result = await readResult(client, address, evaluationId);

  if (blockedByPolicy) {
    return {
      blockedByPolicy,
      policyBoundToExecution,
      latest_policy_result,
      executionStatus: "blocked",
    };
  }

  return {
    blockedByPolicy,
    policyBoundToExecution,
    latest_policy_result,
    executionStatus: "allowed",
  };
}

if (process.argv[1] && process.argv[1].endsWith("policy-gated-flow.mjs")) {
  runPolicyBoundExecution()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
