import { buildClient, readPolicy } from "../../src/lib/policy-client.mjs";
import { requireMethod, sendJson } from "../_lib/response.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) {
    return;
  }

  try {
    const address = req.query.contractAddress || process.env.POLICY_ORACLE_ADDRESS;
    const { policyId } = req.query;
    if (!address || !policyId) {
      throw new Error("Missing contract address or policy id");
    }

    const client = buildClient();
    const storedPolicy = await readPolicy(client, address, policyId);
    sendJson(res, 200, {
      contractAddress: address,
      policyId,
      storedPolicy,
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
