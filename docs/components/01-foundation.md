# 1. Foundation

**Components:** Agents · Agent Instructions · Models · Harnesses

This is the layer that decides what kind of thing you're building before you build any of it. Get it wrong and every later fix is cosmetic.

---

## Agents

An agent is an AI assistant that understands a request, reasons about it, responds, and — the part that distinguishes it from a chatbot — **completes tasks**.

The practical difference:

| Chatbot | Agent |
|---|---|
| Matches an intent to a scripted reply | Reasons about the goal |
| You author every path | It composes a path from available capabilities |
| Fails outside the script | Degrades gracefully, asks clarifying questions |
| Read-mostly | Acts: writes records, triggers approvals, sends notifications |

**Scoping rule that has never failed me:** an agent should be describable in one sentence with no "and also". *"Reviews vendor contracts and flags risk"* is an agent. *"Reviews contracts and answers HR questions and books meeting rooms"* is three agents behind an orchestrator.

**Common mistake:** building the org's One Big Agent. Broad scope degrades reasoning quality, makes evaluation impossible, and turns every change into a regression risk. See [Connected Agents](06-multi-agent-and-memory.md).

---

## Agent Instructions

Natural-language configuration that defines purpose, behaviour, tone, scope and operating boundaries. In generative orchestration this is the single highest-leverage artifact you control — it is what the model consults on every turn to decide what to do.

### What good instructions contain

```
ROLE          One sentence. Who the agent is and who it serves.
SCOPE         What it handles. Explicitly, what it does NOT handle.
BEHAVIOUR     How it should reason. When to ask vs assume.
TOOL POLICY   Which tool for which situation, in plain language.
ESCALATION    The exact conditions for handing off to a human.
TONE          Register, length, formatting expectations.
SAFETY        What it must never do, state or promise.
```

### Working example

```markdown
## Role
You are the IT Support Agent for Contoso employees. You resolve
common IT issues and route what you cannot resolve.

## Scope
You handle: password resets, software access requests, VPN issues,
hardware requests, printer problems.
You do NOT handle: HR queries, payroll, facilities, procurement.
For those, tell the user which team owns it and stop. Do not guess.

## Behaviour
- Check the knowledge base before offering to raise a ticket.
- Ask at most two clarifying questions before acting.
- Never invent a ticket number. Only state numbers returned by a tool.
- If a user reports the same issue twice in one conversation,
  escalate rather than retrying.

## Tool policy
- Use `SearchKnowledgeBase` for how-to and troubleshooting questions.
- Use `CreateIncident` only after troubleshooting has failed, and only
  with the user's explicit confirmation.
- Use `CheckTicketStatus` when the user references an existing ticket.

## Escalation
Escalate to the service desk when: the user says the issue is blocking
their work AND the KB has no resolution; or the request involves
security, access revocation or a suspected compromise.

## Tone
Concise and plain. Short paragraphs. Numbered steps for procedures.
No apology padding.
```

### Instruction-writing rules

- **Positive framing beats prohibition.** "Ask for the asset tag before raising a hardware ticket" outperforms "don't raise tickets without an asset tag."
- **Be specific about tools.** The model needs to know *when*, not just *that*, a tool exists.
- **Boundaries need a destination.** "Don't handle HR" leaves the user stuck. "Don't handle HR — tell them to contact People Ops" doesn't.
- **Length has a ceiling.** When instructions exceed roughly a page, you're compensating for bad scope. Split the agent.
- **Every rule you add is a rule you must test.** Instructions and your evaluation set grow together or your agent silently rots.

---

## Models

The model powers reasoning, language understanding and response generation. Copilot Studio manages this for you — you're generally selecting a capability tier rather than hosting anything.

**What model choice actually changes:**

- **Reasoning depth** — multi-step planning, ambiguous requests, choosing between similar tools
- **Latency** — a heavier model in a Teams chat feels sluggish in a way it doesn't in a batch flow
- **Cost** — consumption is metered; a chatty agent on a heavy model is a budget conversation waiting to happen
- **Availability by region and tenant** — check before you design around a capability

**Rule:** don't reach for a bigger model to fix a grounding or instruction problem. It will mask the symptom at higher cost. Fix the knowledge source first.

For genuinely custom model requirements — fine-tuned models, specialised vision or speech, BYO endpoints — you're crossing into Azure AI Foundry and pro-code territory. See the [Build Path Decision Guide](../guides/build-path-decision.md).

---

## Harnesses

The harness is **how an agent is authored, configured and executed** — the runtime and authoring surface wrapped around the model, rather than the model itself.

Why it matters in practice: the same underlying model behaves differently depending on the harness around it, because the harness controls the system context, the tool-calling contract, how conversation state is carried, and what guardrails run. This is the concept that explains why "it worked in the playground but not in Teams" is almost never a model problem.

**When this term shows up:** comparing Copilot Studio's managed authoring experience against the M365 Agents Toolkit or a custom orchestrator you write yourself. Copilot Studio gives you a managed harness — less control, far less to maintain. Pro-code gives you the harness itself.

---

## Interview-grade summaries

> **What's the difference between an agent and a chatbot?**
> A chatbot matches intents to authored responses. An agent reasons about a goal and composes a path using its knowledge, tools and instructions — and it can complete tasks, not just answer.

> **How do you control agent behaviour without code?**
> Agent instructions, scoped knowledge sources, and an explicit tool policy. Instructions define role, scope, boundaries and escalation conditions; the orchestrator consults them every turn.

> **How do you know when an agent is scoped too broadly?**
> Instructions grow past a page, the tool list stops being obviously distinguishable, and evaluation results get noisy. That's the signal to split into connected agents.

---

**Next:** [Conversation Design →](02-conversation-design.md)
