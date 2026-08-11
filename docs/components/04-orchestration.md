# 4. Orchestration

**Components:** Generative Orchestration · Topic-Based Orchestration

Orchestration is the answer to *"who decides what happens next?"* — you, at design time, or the model, at runtime. It's the most consequential architectural choice in Copilot Studio and the one interviewers probe hardest.

---

## Topic-Based Orchestration

The classic model. User input is matched to a topic via trigger phrases; the topic's authored flow runs.

```
User input → match trigger phrase → run topic nodes → response
```

**Strengths**

- **Predictable.** The same input produces the same path. Every time.
- **Auditable.** You can point at the exact node that produced the outcome.
- **Testable.** Finite paths mean finite test cases.
- **Cheap.** Less model reasoning per turn.
- **Explainable to a regulator**, which is not a small thing in banking, insurance or healthcare.

**Weaknesses**

- Brittle at the edges. Unanticipated phrasing falls through to fallback.
- Doesn't compose. Two related requests in one message get handled as one.
- Scales badly. Coverage means more topics, and topics start colliding.
- High authoring cost per intent.

### ⚠️ Limits & Constraints — Topic-Based Orchestration

| Limit | Value | Notes |
|---|---|---|
| Topics per agent | **1,000** (web) / **250** (Teams) | After this, routing becomes unreliable before hitting the cap |
| Trigger phrase matching | Semantic (NLU) | Not exact keyword match; overlapping phrases cause ambiguous routing |
| Turn response time | Depends on node actions | Synchronous flow calls must resolve within **100–120 seconds** |
| Multi-intent per turn | **Not supported** | One intent per user turn; multi-intent needs generative orchestration |

---

## Generative Orchestration

The model dynamically selects the relevant knowledge, tools, topics and connected agents to fulfil the request — planning across multiple steps within a single turn.

```
User input → model plans → selects knowledge / tools / topics / agents
           → may chain several → composes response
```

**Strengths**

- **Handles the unanticipated.** No trigger phrase required.
- **Multi-step.** "Check my ticket and if it's still open, escalate it" is one turn.
- **Composes capabilities** you never explicitly wired together.
- **Far lower authoring cost** — you describe capabilities, not paths.
- **Natural clarification.** It asks for missing information instead of failing.

**Weaknesses**

- **Non-deterministic.** Same input, occasionally different path.
- **Harder to audit.** The reasoning is opaque relative to a node graph.
- **Instruction-sensitive.** Vague instructions or ambiguous tool descriptions produce erratic tool selection.
- **Costlier per turn.**
- **Testing is statistical**, not exhaustive.

### What generative orchestration depends on

It's only as good as the metadata you give it. This is where most implementations fail:

- **Agent instructions** — role, scope, boundaries, tool policy
- **Tool descriptions** — this is the big one. The model picks tools by reading their descriptions. Vague descriptions produce wrong tool calls. Write them as *when to use this*, not *what this is*.
- **Topic descriptions** — the routing signal, more than trigger phrases
- **Knowledge source scoping** — what's in bounds
- **Connected agent descriptions** — when to delegate

A weak tool description: `Gets data from the API.`
A strong one: `Retrieves the current status, assigned engineer and last update timestamp for an existing incident. Use when the user references a ticket number or asks about a request they already raised. Do not use to create new incidents.`

### ⚠️ Limits & Constraints — Generative Orchestration

| Limit | Value | Notes |
|---|---|---|
| Tools visible to orchestrator | No hard published cap | But large tool lists increase latency and selection errors; keep under ~15–20 tools |
| Tool description length | No hard limit | Aim for 2–4 sentences: when to use, what it returns, what it does NOT do |
| Multi-step planning per turn | Model-dependent | Complex chains may time out or exhaust context |
| Non-determinism | Inherent | Same input can produce different tool-selection paths; test with rates, not pass/fail |
| Context window per turn | Total payload: instructions + history + tools + KB | Exceeding this silently truncates early conversation turns |
| Migration risk | **Immediate** on switch | Flipping generative orchestration on breaks existing trigger-phrase routing; topic descriptions must be written first |

---

## Choosing

| Requirement | Choose |
|---|---|
| Regulated process, audit trail required | Topic-based |
| Fixed script (pricing, legal, safety) | Topic-based |
| Consequential action (payment, external mail, record deletion) | Topic-based, or an agent flow gated by confirmation |
| Broad, unpredictable user questions | Generative |
| Multi-step requests | Generative |
| Many capabilities, unknown combinations | Generative |
| Small team, tight timeline, wide surface | Generative |

### The real answer: hybrid

Production agents don't pick one. The pattern:

```
Generative orchestration handles the front door.
It routes the long tail, answers from knowledge, plans multi-step work.

Authored topics own the consequential paths.
Anything with money, identity, external communication or a compliance
obligation runs as a deterministic topic that the orchestrator invokes.

Inside those topics, generative answer nodes handle the soft middle.
```

**Say this in an interview.** "Generative for reach, deterministic for consequence" is the sentence that shows you've shipped something.

---

## Migration note

Turning generative orchestration on for an existing topic-based agent changes routing behaviour immediately. Topics stop being selected purely by trigger phrase and start being selected by description. Agents that worked fine can start behaving oddly.

Before you flip it:
1. Write a real description for every topic
2. Rewrite every tool description as *when to use*
3. Tighten agent instructions with an explicit tool policy
4. Run your evaluation set before and after and compare

---

## Interview-grade summaries

> **Generative vs topic-based orchestration?**
> Topic-based matches input to an authored flow — predictable, auditable, brittle at the edges. Generative lets the model select knowledge, tools, topics and connected agents at runtime — flexible and multi-step, but non-deterministic and harder to audit. Production agents use both: generative for reach, deterministic topics for consequential paths.

> **The agent calls the wrong tool. Where do you look?**
> Tool descriptions first — the orchestrator selects on description. Then the agent instructions' tool policy. Then whether two tools overlap enough to be genuinely ambiguous, in which case merge or differentiate them.

> **How do you test a non-deterministic agent?**
> Evaluation sets with expected outcomes rather than expected paths, run repeatedly to measure consistency. Deterministic topics get conventional path-based tests. You're measuring a rate, not asserting equality.

---

**Next:** [Actions & Tools →](05-actions-and-tools.md)
