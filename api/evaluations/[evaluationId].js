import {
  buildClient,
  readIsAllowed,
  readResult,
} from "../../src/lib/policy-client.mjs";
import { requireMethod, sendJson } from "../_lib/response.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) {
    return;
  }

  try {
    const address = req.query.contractAddress || process.env.POLICY_ORACLE_ADDRESS;
    const { evaluationId } = req.query;
    if (!address || !evaluationId) {
      throw new Error("Missing contract address or evaluation id");
    }

    const client = buildClient();
    const resultRaw = await readResult(client, address, evaluationId);
    const isAllowed = await readIsAllowed(client, address, evaluationId);

    sendJson(res, 200, {
      contractAddress: address,
      evaluationId,
      isAllowed,
      resultRaw,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
