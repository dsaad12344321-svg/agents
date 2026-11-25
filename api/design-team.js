import { runDesignTeam } from "./_lib/orchestrator.js";
function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
function authorized(req) {
  const key = process.env.DESIGN_TEAM_API_KEY;
  return !key || req.headers.authorization === "Bearer " + key;
}
export default async function handler(req, res) {
  if (req.method === "GET") return send(res, 200, {
    service: "Design Team Orchestrator", status: "ready",
    endpoints: ["POST /api/design-team", "POST /api/agents/:agentId"],
    authRequired: Boolean(process.env.DESIGN_TEAM_API_KEY)
  });
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed" });
  }
  if (!authorized(req)) return send(res, 401, { error: "Unauthorized" });
  try { return send(res, 200, await runDesignTeam(req.body || {})); }
  catch (error) {
    const bad = /required|must be|exceeds|Unknown agent/.test(error.message);
    return send(res, bad ? 400 : 500, { error: error.message });
  }
}
