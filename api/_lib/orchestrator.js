import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AGENTS, getAgent } from "./agents.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MAX_BRIEF_LENGTH = 24000;
function env(name) {
  if (!process.env[name]) throw new Error("Server configuration missing: " + name);
  return process.env[name];
}
function field(value, max, label, required = false) {
  if (typeof value !== "string") {
    if (required) throw new Error(label + " must be a string");
    return "";
  }
  const result = value.trim();
  if (required && !result) throw new Error(label + " is required");
  if (result.length > max) throw new Error(label + " exceeds " + max + " characters");
  return result;
}
async function skill(id) {
  return readFile(path.join(ROOT, "agents", id, "SKILL.md"), "utf8");
}
async function ask(messages, maxTokens = 1800, temperature = 0.35) {
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + env("OPENAI_API_KEY"), "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages, temperature, max_tokens: maxTokens
    }),
    signal: AbortSignal.timeout(Number(process.env.MODEL_TIMEOUT_MS || 90000))
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || ("Model provider HTTP " + response.status));
  const answer = data?.choices?.[0]?.message?.content;
  if (typeof answer !== "string" || !answer.trim()) throw new Error("Empty model response");
  return answer.trim();
}
function context(p) {
  return [
    "PROJECT: " + (p.name || "Unspecified"),
    "BRIEF:\n" + p.brief,
    p.audience && "AUDIENCE:\n" + p.audience,
    p.goals && "GOALS:\n" + p.goals,
    p.constraints && "CONSTRAINTS:\n" + p.constraints,
    p.stack && "TECH STACK / REPOSITORY:\n" + p.stack,
    p.evidence && "SUPPLIED EVIDENCE (do not infer beyond it):\n" + p.evidence,
    p.stage && "STAGE: " + p.stage
  ].filter(Boolean).join("\n\n");
}
async function independent(agent, p) {
  const role = await skill(agent.id);
  const answer = await ask([
    { role: "system", content: "You are " + agent.name + ". Follow this role definition and preserve your independent specialist point of view. Do not fabricate research, analytics, interviews, tests, screenshots, or repository inspection. Label facts, evidence, assumptions, and hypotheses. Return Markdown with Recommendation; Evidence and evidence type; Assumptions and confidence; Main risk/objection; Question needing an answer; Verification method.\n\nROLE DEFINITION:\n" + role },
    { role: "user", content: context(p) }
  ]);
  return { agentId: agent.id, agentName: agent.name, position: answer };
}
async function challenge(agent, p, reviews) {
  const role = await skill(agent.id);
  const others = reviews.filter((r) => r.agentId !== agent.id)
    .map((r) => "## " + r.agentName + "\n" + r.position).join("\n\n");
  const answer = await ask([
    { role: "system", content: "You are " + agent.name + ". Critique the other positions honestly using your role. Identify the strongest argument, challenge one consequential assumption, explain the consequence, propose an alternative, and state what evidence would change your mind. Do not manufacture agreement.\n\nROLE DEFINITION:\n" + role },
    { role: "user", content: context(p) + "\n\nOTHER SPECIALISTS' POSITIONS:\n" + others }
  ], 1200);
  return { agentId: agent.id, agentName: agent.name, challenge: answer };
}
export async function runDesignTeam(input, singleAgentId = null) {
  const p = {
    name: field(input?.name, 160, "name"),
    brief: field(input?.brief, MAX_BRIEF_LENGTH, "brief", true),
    audience: field(input?.audience, 3000, "audience"),
    goals: field(input?.goals, 3000, "goals"),
    constraints: field(input?.constraints, 5000, "constraints"),
    stack: field(input?.stack, 5000, "stack"),
    evidence: field(input?.evidence, MAX_BRIEF_LENGTH, "evidence"),
    stage: field(input?.stage, 100, "stage")
  };
  if (singleAgentId) {
    const agent = getAgent(singleAgentId);
    if (!agent) throw new Error("Unknown agent ID");
    return {
      project: p.name || "Unspecified", mode: "single-agent",
      agent: await independent(agent, p),
      disclaimer: "AI-generated specialist perspective, not independent human review or verified user research."
    };
  }
  const ids = Array.isArray(input?.agents) && input.agents.length
    ? [...new Set(input.agents)] : AGENTS.map((a) => a.id);
  const unknown = ids.filter((id) => !getAgent(id));
  if (unknown.length) throw new Error("Unknown agent IDs: " + unknown.join(", "));
  const chosen = ids.map(getAgent);
  const reviews = await Promise.all(chosen.map((a) => independent(a, p)));
  const debate = input?.debate !== false && chosen.length > 1;
  const challenges = debate ? await Promise.all(chosen.map((a) => challenge(a, p, reviews))) : [];
  const synthesis = await ask([
    { role: "system", content: "You are the neutral Design Team Orchestrator. Synthesize independent positions and challenges. Do not erase dissent or claim evidence not supplied. Separate facts, assumptions, and hypotheses. If no actual implementation evidence was supplied, do not issue PASS. Return Markdown: Executive decision; Product lens; Design contract; Agreements; Disagreements and trade-offs; Prioritized implementation plan with owner agent IDs; Validation and acceptance criteria; Open questions; Finish-gate status." },
    { role: "user", content: context(p) + "\n\nINDEPENDENT POSITIONS:\n" +
      reviews.map((r) => "## " + r.agentName + "\n" + r.position).join("\n\n") +
      "\n\nCHALLENGE ROUND:\n" +
      (challenges.map((r) => "## " + r.agentName + "\n" + r.challenge).join("\n\n") || "Not run.") }
  ], 5000, 0.25);
  return {
    project: p.name || "Unspecified",
    mode: debate ? "full-debate" : "independent-review",
    agentsInvoked: chosen.map(({ id, name }) => ({ id, name })),
    independentReviews: reviews, challenges, synthesis,
    disclaimer: "Specialist perspectives are generated by separate AI model calls using repository role files. They are not human reviewers. Research, analytics, tests, and implementation are not verified unless supplied as evidence."
  };
}
export { AGENTS };
