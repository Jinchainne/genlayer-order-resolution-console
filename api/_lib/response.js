export function sendJson(res, status, payload) {
  res.status(status).setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.json(payload);
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (!req.body || req.body === "") {
    return {};
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  return {};
}

export function requireMethod(req, res, methods) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return false;
  }

  if (!methods.includes(req.method)) {
    sendJson(res, 405, { error: `Method ${req.method} not allowed` });
    return false;
  }

  return true;
}
