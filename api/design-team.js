import { runDesignTeam } from "./_lib/orchestrator.js";
import { applyCors, isAuthorized } from "./_lib/http.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method === "GET") return send(res, 200, {
    service: "Design Team Orchestrator",
    status: "ready",
    configured: Boolean(process.env.OPENAI_API_KEY && process.env.DESIGN_TEAM_API_KEY),
    endpoints: ["POST /api/design-team", "POST /api/agents/:agentId"],
    authRequired: true
  });

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return send(res, 405, { error: "Method not allowed" });
  }

  if (!process.env.DESIGN_TEAM_API_KEY) {
    return send(res, 503, { error: "Server configuration missing: DESIGN_TEAM_API_KEY" });
  }
  if (!isAuthorized(req)) return send(res, 401, { error: "Unauthorized" });

  try {
    return send(res, 200, await runDesignTeam(req.body || {}));
  } catch (error) {
    const bad = /required|must be|exceeds|Unknown agent/.test(error.message);
    return send(res, bad ? 400 : 500, { error: error.message });
  }
}
