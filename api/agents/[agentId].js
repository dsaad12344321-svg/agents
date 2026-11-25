import { runDesignTeam } from "../_lib/orchestrator.js";
function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed" });
  }
  const key = process.env.DESIGN_TEAM_API_KEY;
  if (key && req.headers.authorization !== "Bearer " + key) return send(res, 401, { error: "Unauthorized" });
  try { return send(res, 200, await runDesignTeam(req.body || {}, req.query.agentId)); }
  catch (error) {
    const bad = /required|must be|exceeds|Unknown agent/.test(error.message);
    return send(res, bad ? 400 : 500, { error: error.message });
  }
}
