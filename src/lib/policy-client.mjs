import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { Wallet } from "ethers";
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

function buildAccountFromEnv() {
  const privateKey = process.env.GENLAYER_PRIVATE_KEY;
  if (privateKey) {
    return createAccount(privateKey);
  }

  const keystoreJson = process.env.GENLAYER_KEYSTORE_JSON;
  const keystorePassword = process.env.GENLAYER_KEYSTORE_PASSWORD;
  if (keystoreJson && keystorePassword) {
    const wallet = Wallet.fromEncryptedJsonSync(keystoreJson, keystorePassword);
    return createAccount(wallet.privateKey);
  }

  throw new Error(
    "Missing GENLAYER_PRIVATE_KEY or GENLAYER_KEYSTORE_JSON + GENLAYER_KEYSTORE_PASSWORD",
  );
}

export function buildClient() {
  const endpoint = process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api";
  const account = buildAccountFromEnv();
  return createClient({
    chain: studionet,
    endpoint,
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
      JSON.stringify(payload.disagreements ?? []),
    ],
  });
}

export async function resolveDispute(client, address, payload) {
  return writeAndWait(client, {
    address,
    functionName: "resolve_dispute",
    args: [
      payload.caseId,
      payload.policyId,
      payload.subject,
      JSON.stringify(payload.evidence),
      JSON.stringify(payload.referenceUrls ?? []),
      JSON.stringify(payload.disagreements ?? []),
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

export async function readCase(client, address, caseId) {
  return client.readContract({
    address,
    functionName: "get_case",
    args: [caseId],
  });
}
