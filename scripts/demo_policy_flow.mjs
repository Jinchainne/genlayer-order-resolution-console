import "dotenv/config";
import {
  buildClient,
  createPolicy,
  evaluatePolicy,
  readPolicy,
  readResult,
  readIsAllowed,
} from "../sdk/policy-client.mjs";
import { extractReturnValue } from "../src/lib/receipt-utils.mjs";

async function main() {
  const address = process.env.POLICY_ORACLE_ADDRESS;
  if (!address) {
    throw new Error("Missing POLICY_ORACLE_ADDRESS in .env");
  }

  const client = buildClient();

  const createTx = await createPolicy(client, address, {
    name: "Contribution Quality Gate",
    policyText:
      "Allow only if the contribution shows original work, clear evidence, and meaningful effort.",
    criteriaText:
      "Deny if evidence is obviously weak. Return undetermined when evidence is partial or ambiguous.",
    category: "contributions",
  });

  const policyId = extractReturnValue(createTx.receipt) || "policy-1";
  console.log("create_policy tx:", createTx.hash);
  console.log("policy_id:", policyId);

  const policyRaw = await readPolicy(client, address, policyId);
  console.log("stored policy:", policyRaw);

  const evaluateTx = await evaluatePolicy(client, address, {
    policyId,
    subject: "A builder submitted a milestone claim with docs, code, and screenshots.",
    evidence: {
      repo: "https://github.com/example/project",
      artifacts: ["demo video", "screenshots", "docs", "commit history"],
      notes: "The submission claims original architecture and meaningful integration work.",
    },
    referenceUrls: ["https://github.com/example/project"],
  });

  const evaluationId = extractReturnValue(evaluateTx.receipt) || "evaluation-1";
  console.log("evaluate tx:", evaluateTx.hash);
  console.log("evaluation_id:", evaluationId);

  const resultRaw = await readResult(client, address, evaluationId);
  const allowed = await readIsAllowed(client, address, evaluationId);

  console.log("stored result:", resultRaw);
  console.log("is_allowed:", allowed);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
