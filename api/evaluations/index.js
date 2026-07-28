import {
  buildClient,
  evaluatePolicy,
  readIsAllowed,
  readResult,
} from "../../src/lib/policy-client.mjs";
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
    const write = await evaluatePolicy(client, address, {
      policyId: body.policyId,
      subject: body.subject,
      evidence: body.evidence,
      referenceUrls: body.referenceUrls,
    });

    const evaluationId = extractReturnValue(write.receipt) || "evaluation-1";
    const resultRaw = await readResult(client, address, evaluationId);
    const isAllowed = await readIsAllowed(client, address, evaluationId);

    sendJson(res, 200, {
      contractAddress: address,
      txHash: write.hash,
      evaluationId,
      isAllowed,
      resultRaw,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
