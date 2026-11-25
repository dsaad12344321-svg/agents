export const AGENTS = [
  { id: "brand-guardian", name: "Brand Guardian" },
  { id: "image-prompt-engineer", name: "Image Prompt Engineer" },
  { id: "inclusive-visuals-specialist", name: "Inclusive Visuals Specialist" },
  { id: "persona-walkthrough-specialist", name: "Persona Walkthrough Specialist" },
  { id: "ui-designer", name: "UI Designer" },
  { id: "ui-finish-gate-reviewer", name: "UI Finish-Gate Reviewer" },
  { id: "ux-architect", name: "UX Architect" },
  { id: "ux-researcher", name: "UX Researcher" },
  { id: "visual-storyteller", name: "Visual Storyteller" },
  { id: "whimsy-injector", name: "Whimsy Injector" }
];
export function getAgent(id) { return AGENTS.find((agent) => agent.id === id); }
