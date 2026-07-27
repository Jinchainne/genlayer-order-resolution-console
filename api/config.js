import { requireMethod, sendJson } from "./_lib/response.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) {
    return;
  }

  sendJson(res, 200, {
    contractAddress: process.env.POLICY_ORACLE_ADDRESS || "",
    rpcUrl: process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api",
    explorerBase: "https://explorer-studio.genlayer.com",
  });
}
