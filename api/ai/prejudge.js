import { runAiPreJudge } from "../../src/lib/ai-prejudge.mjs";
import { readJsonBody, requireMethod, sendJson } from "../_lib/response.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) {
    return;
  }

  try {
    const body = await readJsonBody(req);
    if (!body.bundle) {
      throw new Error("Missing bundle payload.");
    }

    const result = await runAiPreJudge(body.bundle, {
      persona: body.persona,
    });
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}
