import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import {
  buildClient,
  createPolicy,
  evaluatePolicy,
  readPolicy,
  readResult,
  readIsAllowed,
} from "./src/lib/policy-client.mjs";
import { extractReturnValue } from "./src/lib/receipt-utils.mjs";
import { runSubmissionGateWorkflow } from "./src/project/policy-submission-workflow.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "app");
const PORT = Number(process.env.PORT || 3000);

function json(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error(`Invalid JSON body: ${error.message}`));
      }
    });
    req.on("error", reject);
  });
}

function mimeType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}

function serveStatic(req, res) {
  const pathname = new URL(req.url, "http://127.0.0.1").pathname;
  const urlPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(APP_ROOT, urlPath));
  if (!filePath.startsWith(APP_ROOT) || !fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  res.writeHead(200, { "Content-Type": mimeType(filePath) });
  fs.createReadStream(filePath).pipe(res);
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    json(res, 200, { ok: true, date: "2026-07-27" });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/config") {
    json(res, 200, {
      contractAddress: process.env.POLICY_ORACLE_ADDRESS || "",
      rpcUrl: process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api",
      explorerBase: "https://explorer-studio.genlayer.com",
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/policies") {
    const client = buildClient();
    const body = await readJsonBody(req);
    const address = body.contractAddress || process.env.POLICY_ORACLE_ADDRESS;
    if (!address) {
      throw new Error("Missing contractAddress or POLICY_ORACLE_ADDRESS");
    }

    const write = await createPolicy(client, address, {
      name: body.name,
      policyText: body.policyText,
      criteriaText: body.criteriaText,
      category: body.category,
    });

    const policyId = extractReturnValue(write.receipt) || "policy-1";
    const storedPolicy = await readPolicy(client, address, policyId);

    json(res, 200, {
      contractAddress: address,
      txHash: write.hash,
      policyId,
      storedPolicy,
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/evaluations") {
    const client = buildClient();
    const body = await readJsonBody(req);
    const address = body.contractAddress || process.env.POLICY_ORACLE_ADDRESS;
    if (!address) {
      throw new Error("Missing contractAddress or POLICY_ORACLE_ADDRESS");
    }

    const write = await evaluatePolicy(client, address, {
      policyId: body.policyId,
      subject: body.subject,
      evidence: body.evidence,
      referenceUrls: body.referenceUrls,
    });

    const evaluationId = extractReturnValue(write.receipt) || "evaluation-1";
    const resultRaw = await readResult(client, address, evaluationId);
    const isAllowed = await readIsAllowed(client, address, evaluationId);

    json(res, 200, {
      contractAddress: address,
      txHash: write.hash,
      evaluationId,
      isAllowed,
      resultRaw,
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/workflows/submission-gate") {
    const body = await readJsonBody(req);
    const address = body.contractAddress || process.env.POLICY_ORACLE_ADDRESS;
    if (!address) {
      throw new Error("Missing contractAddress or POLICY_ORACLE_ADDRESS");
    }

    const workflow = await runSubmissionGateWorkflow(address, body);
    json(res, 200, workflow);
    return true;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/policies/")) {
    const client = buildClient();
    const address = url.searchParams.get("contractAddress") || process.env.POLICY_ORACLE_ADDRESS;
    const policyId = url.pathname.split("/").pop();
    if (!address || !policyId) {
      throw new Error("Missing contract address or policy id");
    }
    const storedPolicy = await readPolicy(client, address, policyId);
    json(res, 200, { contractAddress: address, policyId, storedPolicy });
    return true;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/evaluations/")) {
    const client = buildClient();
    const address = url.searchParams.get("contractAddress") || process.env.POLICY_ORACLE_ADDRESS;
    const evaluationId = url.pathname.split("/").pop();
    if (!address || !evaluationId) {
      throw new Error("Missing contract address or evaluation id");
    }
    const resultRaw = await readResult(client, address, evaluationId);
    const isAllowed = await readIsAllowed(client, address, evaluationId);
    json(res, 200, {
      contractAddress: address,
      evaluationId,
      isAllowed,
      resultRaw,
    });
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      const handled = await handleApi(req, res);
      if (!handled) {
        json(res, 404, { error: "API route not found" });
      }
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    json(res, 500, {
      error: error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`Policy app running at http://127.0.0.1:${PORT}`);
});
