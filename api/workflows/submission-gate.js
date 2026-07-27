import { runSubmissionGateWorkflow } from "../../src/project/policy-submission-workflow.mjs";
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

    const workflow = await runSubmissionGateWorkflow(address, body);
    sendJson(res, 200, workflow);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
