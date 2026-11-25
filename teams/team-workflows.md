# Team Workflows

## Workflow A — New product or major feature

### 1. Intake and product lens
The orchestrator captures the user, job, workflow, first-read object, primary action, domain objects, success measure, constraints, and evidence gaps. UX Researcher labels unknowns; UX Architect inspects the existing technical context when available.

### 2. Independent specialist positions
Request separate short reviews from relevant agents before sharing other agents' conclusions:
- Brand Guardian: promise, audience, voice, and consistency.
- UX Researcher: evidence quality, research gaps, and validation plan.
- UX Architect: information architecture, flows, contracts, and technical constraints.
- Persona Walkthrough Specialist: scenario friction and task completion.
- Inclusive Visuals Specialist: representation and inclusive access.
- Visual Storyteller: narrative and information hierarchy.
- Image Prompt Engineer: asset prompts and art direction where imagery is needed.
- UI Designer: design system and screen specification.
- Whimsy Injector: purposeful moments of personality.
- UI Finish-Gate Reviewer: early risk scan and later final gate.

Do not invoke every agent for every trivial task; record why a specialist is not relevant.

### 3. Design contract
Write the product-specific contract before detailed screen implementation:
- User + job
- First-read object
- Primary action
- Density and hierarchy
- Interaction model
- Responsive priority
- Brand and accessibility requirements
- Reference patterns and transferable lessons
- Forbidden generic defaults
- Evidence required for acceptance

### 4. Structured debate
Ask each relevant agent to challenge one consequential decision from another agent. Require:
- Decision under debate
- Supporting evidence or assumption
- User/business/technical consequence
- Proposed alternative
- What evidence would settle the disagreement

The orchestrator records agreement, disagreement, and unresolved questions. Do not force consensus.

### 5. Implementation handoff
UX Architect defines structure and contracts; UI Designer provides visual specifications; Brand Guardian and content/story specialists review language and narrative; Inclusive Visuals Specialist reviews assets. The developer receives prioritized tasks and testable acceptance criteria.

### 6. Validation and finish gate
UX Researcher defines or analyzes real validation evidence. Persona Walkthrough Specialist can run a clearly labeled simulated walkthrough. UI Finish-Gate Reviewer inspects the actual implementation at desktop and mobile sizes and returns PASS or HOLD. A PASS is not a substitute for product-owner release approval.

## Workflow B — Existing screen review
1. Obtain the actual screen, implementation, viewport, and known user task.
2. UX Architect identifies structural and technical constraints.
3. UX Researcher separates observed evidence from assumptions.
4. UI Designer and relevant specialists review independently.
5. UI Finish-Gate Reviewer writes a design contract, findings, required changes, and verification criteria.
6. Re-review only changed areas plus any affected states and breakpoints.

## Workflow C — Visual campaign or content
1. Brand Guardian sets message and voice.
2. Visual Storyteller defines narrative arc and platform format.
3. Inclusive Visuals Specialist reviews representation and cultural context.
4. Image Prompt Engineer writes production prompts and asset constraints.
5. Whimsy Injector contributes optional personality only where appropriate.
6. Review factual accuracy, accessibility, and platform crops before approval.

## Debate output template

    ## Decision under debate
    [Specific design or product decision]

    ### Position A — [Agent]
    - Recommendation:
    - Evidence:
    - Assumptions:
    - Risks:

    ### Position B — [Agent]
    - Recommendation:
    - Evidence:
    - Assumptions:
    - Risks:

    ### Resolution
    - Decision:
    - Reason:
    - Trade-off accepted:
    - Evidence still needed:
    - Owner:

## Required finish-gate format

    # UI Finish Gate — [Screen]
    ## Decision: PASS | HOLD
    ## Product lens
    [User, job, first-read object, primary action]
    ## Evidence
    [Observed issue -> user consequence]
    ## Required before PASS
    1. [Change] — verify at [viewport/state]
    ## Keep
    [Existing decisions that work]
    ## PASS criteria
    [Observable and testable conditions]

## Operating constraints
- No false claims of tool use, repository inspection, research, testing, or deployment.
- Prefer existing brand, framework, and architecture unless a concrete issue justifies change.
- Treat loading, empty, error, focus, disabled, and narrow-screen states as part of the product.
- Keep recommendations specific, prioritized, and verifiable.
- Preserve specialist disagreement in the project record.