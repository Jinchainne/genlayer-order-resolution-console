import { createPolicy, readPolicy } from "../../src/lib/policy-client.mjs";
import { buildClient } from "../../src/lib/policy-client.mjs";
import { extractReturnValue } from "../../src/lib/receipt-utils.mjs";
import { readJsonBody, requireMethod, sendJson } from "../_lib/response.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    const address = body.contractAddress || process.env.POLICY_ORACLE_ADDRESS;
    if (!address) {
      throw new Error("Missing contractAddress or POLICY_ORACLE_ADDRESS");
    }

    const client = buildClient();
    const write = await createPolicy(client, address, {
      name: body.name,
      policyText: body.policyText,
      criteriaText: body.criteriaText,
      category: body.category,
    });

    const policyId = extractReturnValue(write.receipt) || "policy-1";
    const storedPolicy = await readPolicy(client, address, policyId);

    sendJson(res, 200, {
      contractAddress: address,
      txHash: write.hash,
      policyId,
      storedPolicy,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
