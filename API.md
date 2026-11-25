# Design Team Orchestrator API

This repository now contains callable serverless endpoints. The API reads the ten role definitions from `agents/*/SKILL.md` and makes real model-provider requests. The agents are separate specialist model calls, not ten independently hosted services.

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Add the following Environment Variables in Project Settings:
   - `OPENAI_API_KEY` — required key for an OpenAI-compatible chat-completions provider.
   - `OPENAI_MODEL` — optional; defaults to `gpt-4.1-mini`.
   - `OPENAI_BASE_URL` — optional; defaults to `https://api.openai.com/v1`.
   - `DESIGN_TEAM_API_KEY` — strongly recommended access token.
3. Deploy the project. Endpoints will be available on the Vercel domain.

For local development: Node.js 20+, `npm install`, copy `.env.example` to `.env.local`, fill in the values, then run `npm run dev`.

## Run the complete team

`POST /api/design-team`

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_DESIGN_TEAM_API_KEY` (when configured)

Example request:

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

The request body uses the same fields as the team endpoint. Supported IDs:

- `brand-guardian`
- `image-prompt-engineer`
- `inclusive-visuals-specialist`
- `persona-walkthrough-specialist`
- `ui-designer`
- `ui-finish-gate-reviewer`
- `ux-architect`
- `ux-researcher`
- `visual-storyteller`
- `whimsy-injector`

## Health check

`GET /api/design-team`

Returns service readiness and endpoint names without making a model-provider call.

## JavaScript example

```js
const response = await fetch("https://YOUR-DOMAIN.vercel.app/api/design-team", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_DESIGN_TEAM_API_KEY"
  },
  body: JSON.stringify({
    name: "My product",
    brief: "Describe the product or feature to design.",
    stack: "Next.js and Vercel",
    debate: true
  })
});
const report = await response.json();
if (!response.ok) throw new Error(report.error || "Design team request failed");
console.log(report.synthesis);
```

## Workflow and limits

- Each specialist is a separate model request using its own repository `SKILL.md`.
- Full-debate mode: ten independent positions, then ten challenge responses, then one neutral synthesis request (21 provider requests for all ten agents).
- Requests in each round run concurrently. Full mode therefore affects provider cost, rate limits, and latency.
- The API is synchronous. It does not create persistent conversations, run agents in the background, inspect a connected project automatically, or edit project files.
- Include relevant code, design references, screenshots descriptions, analytics, and constraints in the request. The team must mark missing evidence instead of inventing it.
- Configure `DESIGN_TEAM_API_KEY` before exposing the endpoint publicly. Keep provider keys in Vercel environment variables; never put secrets in browser code or commit real keys.
- The provider must implement the OpenAI Chat Completions-compatible API.
- A finish-gate PASS is not allowed without actual implementation evidence. The product owner retains release authority.
