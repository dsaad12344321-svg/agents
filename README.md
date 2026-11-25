# Product Design Agent Collective

A repository of independent specialist agents that collaborate on future products. Each agent has its own mandate, standards, decision lens, and right to disagree. The goal is not ten copies of one assistant: it is a structured design review in which specialists contribute distinct evidence and the team resolves conflicts explicitly.

## Agents

| Agent | Primary responsibility |
|---|---|
| [Brand Guardian](agents/brand-guardian/SKILL.md) | Brand strategy, voice, and consistency |
| [Image Prompt Engineer](agents/image-prompt-engineer/SKILL.md) | Precise, production-ready image-generation prompts |
| [Inclusive Visuals Specialist](agents/inclusive-visuals-specialist/SKILL.md) | Respectful, accurate, inclusive visual representation |
| [Persona Walkthrough Specialist](agents/persona-walkthrough-specialist/SKILL.md) | Persona-based UX and conversion walkthroughs |
| [UI Designer](agents/ui-designer/SKILL.md) | Visual systems and accessible interface design |
| [UI Finish-Gate Reviewer](agents/ui-finish-gate-reviewer/SKILL.md) | Evidence-led pre-ship review and PASS/HOLD gate |
| [UX Architect](agents/ux-architect/SKILL.md) | UX structure and implementation foundations |
| [UX Researcher](agents/ux-researcher/SKILL.md) | User evidence, research design, and validation |
| [Visual Storyteller](agents/visual-storyteller/SKILL.md) | Visual narratives and information storytelling |
| [Whimsy Injector](agents/whimsy-injector/SKILL.md) | Purposeful personality and moments of delight |

## How collaboration works

Read [the Design Division charter](teams/design-division.md), [team workflows](teams/team-workflows.md), and the [orchestrator prompt](teams/orchestrator-prompt.md) before running a project.

1. The project brief and constraints are recorded.
2. Each relevant agent gives an independent position before seeing the others' conclusions.
3. Agents challenge assumptions with evidence and explain trade-offs.
4. The team records agreements, unresolved disagreements, and decisions.
5. The UI Finish-Gate Reviewer issues the final PASS or HOLD decision for interface work.

Agents are specialist perspectives, not autonomous human participants. Their discussion is orchestrated by the calling agent or workflow; no agent should claim that real users were interviewed, analytics were inspected, or tests passed unless evidence was actually supplied.


## Run the team through an API

The repository includes a Vercel-ready API that invokes the specialist role files through an OpenAI-compatible model provider:

- `POST /api/design-team` — independent reviews, cross-examination, and a consolidated design decision.
- `POST /api/agents/{agentId}` — invoke one specialist directly.
- `GET /api/design-team` — health check.

See [API setup, deployment, request examples, and security](API.md). Configure `OPENAI_API_KEY` and (recommended) `DESIGN_TEAM_API_KEY` in the deployment environment before using the service. Full-team debate makes 21 model requests when all ten agents are selected, so provider usage and cost should be expected.

## Repository structure

    agents/<agent-id>/SKILL.md
    teams/design-division.md
    teams/team-workflows.md
    teams/orchestrator-prompt.md
    README.md
    CONTRIBUTING.md

## Operating principles

- Product evidence before aesthetic preference.
- Preserve the product's actual workflow and technical constraints.
- Accessibility, responsive behavior, and failure states are part of the design.
- Keep each agent's independent voice; do not force artificial consensus.
- Every recommendation must include rationale and a way to verify it.
- Never invent research findings, metrics, references, or implementation status.
