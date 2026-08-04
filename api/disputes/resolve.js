import {
  buildClient,
  resolveDispute,
  readCase,
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
    const write = await resolveDispute(client, address, {
      caseId: body.caseId,
      policyId: body.policyId,
      subject: body.subject,
      evidence: body.evidence,
      referenceUrls: body.referenceUrls,
      disagreements: body.disagreements,
    });

    const evaluationId = extractReturnValue(write.receipt) || "";
    const caseRaw = await readCase(client, address, body.caseId);

    sendJson(res, 200, {
      contractAddress: address,
      txHash: write.hash,
      caseId: body.caseId,
      evaluationId,
      caseRaw,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
