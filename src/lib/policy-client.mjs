import { createClient, createAccount } from "genlayer-js";
import fs from "node:fs";
import path from "node:path";

const CONTRACT_PATH = path.resolve("contracts", "PolicyOracle.py");

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function buildClient() {
  const rpcUrl = process.env.GENLAYER_RPC_URL || "http://127.0.0.1:4000/api";
  const privateKey = requireEnv("GENLAYER_PRIVATE_KEY");
  const account = createAccount(privateKey);
  return createClient({
    rpcUrl,
    account,
  });
}

export function readContractSource() {
  return fs.readFileSync(CONTRACT_PATH, "utf8");
}

export async function deployPolicyOracle(client) {
  const hash = await client.deployContract({
    code: readContractSource(),
    args: [],
    leaderOnly: false,
  });

  const receipt = await client.waitForTransactionReceipt({
    hash,
    retries: 120,
    interval: 3000,
  });

  return {
    hash,
    receipt,
    address: receipt.contractAddress || receipt.contract_address,
  };
}

export async function writeAndWait(client, tx) {
  const hash = await client.writeContract({
    leaderOnly: false,
    ...tx,
  });

  const receipt = await client.waitForTransactionReceipt({
    hash,
    retries: 120,
    interval: 3000,
  });

  return { hash, receipt };
}

export async function createPolicy(client, address, payload) {
  return writeAndWait(client, {
    address,
    functionName: "create_policy",
    args: [
      payload.name,
      payload.policyText,
      payload.criteriaText,
      payload.category ?? "general",
    ],
  });
}

export async function evaluatePolicy(client, address, payload) {
  return writeAndWait(client, {
    address,
    functionName: "evaluate",
    args: [
      payload.policyId,
      payload.subject,
      JSON.stringify(payload.evidence),
      JSON.stringify(payload.referenceUrls ?? []),
    ],
  });
}

export async function readPolicy(client, address, policyId) {
  return client.readContract({
    address,
    functionName: "get_policy",
    args: [policyId],
  });
}

export async function readResult(client, address, evaluationId) {
  return client.readContract({
    address,
    functionName: "get_result",
    args: [evaluationId],
  });
}

export async function readIsAllowed(client, address, evaluationId) {
  return client.readContract({
    address,
    functionName: "is_allowed",
    args: [evaluationId],
  });
}
