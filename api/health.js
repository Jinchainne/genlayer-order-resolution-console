import { requireMethod, sendJson } from "./_lib/response.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) {
    return;
  }

  sendJson(res, 200, {
    ok: true,
    date: "2026-07-27",
  });
}
