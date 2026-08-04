import {
  buildClient,
  readCase,
} from "../../src/lib/policy-client.mjs";
import { requireMethod, sendJson } from "../_lib/response.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) {
    return;
  }

  try {
    const address = req.query.contractAddress || process.env.POLICY_ORACLE_ADDRESS;
    const { caseId } = req.query;
    if (!address || !caseId) {
      throw new Error("Missing contract address or case ID");
    }

    const client = buildClient();
    const caseRaw = await readCase(client, address, caseId);

    sendJson(res, 200, {
      contractAddress: address,
      caseId,
      caseRaw,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
