const ALLOWED_METHODS = "GET, POST, OPTIONS";
const ALLOWED_HEADERS = "Authorization, Content-Type";
function allowedOrigins() {
  return (process.env.DESIGN_TEAM_ALLOWED_ORIGINS || "")
    .split(",").map((value) => value.trim()).filter(Boolean);
}
export function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowed = allowedOrigins();
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
    res.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    res.setHeader("Access-Control-Max-Age", "86400");
  }
  if (req.method === "OPTIONS") {
    if (origin && !allowed.includes(origin)) {
      res.statusCode = 403;
      res.end();
      return false;
    }
    res.statusCode = 204;
    res.end();
    return false;
  }
  if (origin && !allowed.includes(origin)) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Origin not allowed" }));
    return false;
  }
  return true;
}
export function isAuthorized(req) {
  const key = process.env.DESIGN_TEAM_API_KEY;
  return Boolean(key) && req.headers.authorization === "Bearer " + key;
}
