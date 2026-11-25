# Design Team Orchestrator API

This repository contains callable serverless endpoints. The API reads the ten role definitions from `agents/*/SKILL.md` and makes real model-provider requests. The agents are separate specialist model calls, not ten independently hosted services.

## Deploy to Vercel

1. Import this repository into a Vercel project.
2. Add these Environment Variables to that project (Production and Preview as needed):
   - `OPENAI_API_KEY` — required provider key.
   - `OPENAI_MODEL` — optional; defaults to `gpt-4.1-mini`.
   - `OPENAI_BASE_URL` — optional; defaults to `https://api.openai.com/v1`.
   - `DESIGN_TEAM_API_KEY` — required long random server-side API token.
   - `DESIGN_TEAM_ALLOWED_ORIGINS` — required comma-separated exact browser origins, e.g. `https://your-frontend.vercel.app,https://your-custom-domain.com`. Do not include paths or trailing slashes.
3. Redeploy after changing environment variables.
4. Use the stable Production domain (for example, `https://your-api-project.vercel.app`), not a deployment-specific preview URL.

The API handles CORS preflight (`OPTIONS`) and permits only exact origins listed in `DESIGN_TEAM_ALLOWED_ORIGINS`. Requests without an Origin header (server-to-server calls) are also supported.

**Vercel Deployment Protection:** if the API's production deployment is protected by Vercel SSO, browser preflight requests can be redirected to the login page and fail before reaching this code. For a public API protected by `DESIGN_TEAM_API_KEY`, configure the API's production deployment so its API routes are reachable without the SSO redirect. Keep the application protected separately if needed.

**Important security note:** never put `DESIGN_TEAM_API_KEY` or `OPENAI_API_KEY` in browser JavaScript, frontend environment variables exposed to the client, or DevTools snippets. A browser user can read them. Call this API from a server-side route in your frontend project, where the API key remains server-side. CORS is not authentication.

For local development: Node.js 20+, `npm install`, copy `.env.example` to `.env.local`, fill in the values, then run `npm run dev`.

## Run the complete team

`POST /api/design-team`

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_DESIGN_TEAM_API_KEY`

Example request body:

```json
{
  "name": "Daleelak El Banky — Loans page",
  "brief": "Design an Arabic RTL loans comparison and calculator experience.",
  "audience": "Egyptian bank customers comparing personal loans.",
  "goals": "Help visitors compare offers and understand monthly installments.",
  "constraints": "Arabic-first, RTL, mobile responsive, preserve the current Next.js stack.",
  "stack": "Next.js, React, TypeScript, Vercel",
  "evidence": "Paste relevant screenshots descriptions, analytics, or source excerpts here.",
  "stage": "planning",
  "debate": true
}
```

By default, all ten specialists are invoked. Pass an `agents` array to select a subset. Set `debate: false` to skip the challenge round and receive independent reviews plus synthesis.

## Invoke one specialist

`POST /api/agents/{agentId}`

Example: `POST /api/agents/ui-designer`

Supported IDs: `brand-guardian`, `image-prompt-engineer`, `inclusive-visuals-specialist`, `persona-walkthrough-specialist`, `ui-designer`, `ui-finish-gate-reviewer`, `ux-architect`, `ux-researcher`, `visual-storyteller`, `whimsy-injector`.

## Health check

`GET /api/design-team`

Returns service readiness and whether required server configuration is present. It does not make a model-provider call.

## Workflow and limits

- Each specialist is a separate model request using its own repository `SKILL.md`.
- Full-debate mode: ten independent positions, ten challenge responses, then one neutral synthesis request (21 provider requests for all ten agents).
- Requests in each round run concurrently; full mode affects provider cost, rate limits, and latency.
- The API is synchronous. It does not create persistent conversations, run agents in the background, inspect a connected project automatically, or edit project files.
- Include relevant code, design references, screenshot descriptions, analytics, and constraints in the request. Agents must mark missing evidence instead of inventing it.
- Keep provider and API keys server-side. Do not expose them in browser code.
- A finish-gate PASS is not allowed without actual implementation evidence. The product owner retains release authority.
