# 6. Multi-Agent & Memory

**Components:** Connected Agents · Memory

How an agent scales past one scope and past one turn.

---

## Connected Agents

Specialised agents collaborate, delegate tasks and share responsibilities. One orchestrator agent routes to child agents that each own a narrow domain.

```
                    ┌──────────────────┐
                    │   ORCHESTRATOR   │
                    │  Routes. Owns no │
                    │  domain itself.  │
                    └────────┬─────────┘
             ┌───────────────┼───────────────┐
      ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼─────┐
      │  IT Agent  │  │  HR Agent  │  │ Finance    │
      │ KB + ITSM  │  │ Policy+HRIS│  │ Policy+ERP │
      └────────────┘  └────────────┘  └────────────┘
```

### Why split at all

**Scope integrity.** Reasoning quality falls as scope widens. Three focused agents outperform one agent with three domains — consistently, and by a wide margin.

**Independent ownership.** IT owns the IT agent. HR owns theirs. Nobody waits on a central team to change a policy answer, and nobody can break someone else's agent.

**Independent lifecycle.** Deploy, test and version separately. A change to the finance agent can't regress IT support.

**Governance boundaries.** Different data sensitivity, different connections, different permissions — cleanly separated rather than tangled in one instruction file.

**Reuse.** One well-built specialist serves several orchestrators.

### Designing the split

Split by **domain and ownership**, not by function. "Search agent / write agent / notify agent" is a bad decomposition — those are tools. "IT / HR / Finance / Procurement" is a good one, because each maps to a team, a knowledge corpus and a set of systems.

**Orchestrator design:**
- Owns routing and nothing else. No domain knowledge of its own.
- Clear child descriptions — this is the routing signal, same principle as tool descriptions.
- An explicit fallback for requests that fit nobody.
- Handles the ambiguous case: ask a clarifying question rather than guessing between two children.

**Child agent design:**
- Genuinely narrow scope with explicit out-of-scope handling
- Returns structured, self-contained results the orchestrator can pass on
- Works standalone — it should be testable and deployable without the orchestrator

### Costs, honestly

- **Latency** accumulates with each hop
- **Consumption** — orchestrator reasoning plus child reasoning
- **Debugging** across agent boundaries is harder
- **Context handoff** is lossy; the child sees what the orchestrator passes, not the full history

**Don't split until you need to.** Two clear domains and a small team? One agent. Split when scope conflict, ownership conflict or evaluation noise makes it necessary — the signals in [Foundation](01-foundation.md).

---

## Memory

Retains relevant user context across supported interactions and sessions — so the agent doesn't restart from zero every time.

### The layers

| Layer | Lifetime | Holds |
|---|---|---|
| **Turn** | One exchange | Current input and extracted entities |
| **Conversation** | One session | Global variables, established facts, history |
| **Cross-session** | Persistent | Preferences, recurring context, prior outcomes |
| **Organisational** | Persistent | User's role, department, tenant context |

### What's worth remembering

Good: stable preferences (language, notification channel, default location), role and team context, recurring identifiers (their primary device, their cost centre), open items from last time.

Bad: anything sensitive that doesn't need to persist, anything that goes stale silently (a manager who changed, a project that closed), anything the user would be unsettled to discover you kept.

### The governance questions to answer before enabling it

1. **What exactly persists, and where?**
2. **How long?** Retention has to be a decision, not a default.
3. **Can the user see it?** Transparency is table stakes.
4. **Can the user clear it?** They must be able to.
5. **Does it cross a boundary it shouldn't?** Memory from a private HR conversation must not surface in a team channel.
6. **What happens when it's wrong?** Stale memory produces confidently wrong personalisation, which erodes trust faster than no memory at all.

**Design principle:** memory should reduce repetition, not accumulate a profile. Remember the preference; don't remember the person.

---

## Interview-grade summaries

> **When do you use connected agents instead of one agent?**
> When scope gets broad enough that reasoning quality degrades, when different teams need to own different domains, or when governance boundaries differ. Split by domain and ownership, keep children narrow, and give the orchestrator routing responsibility only. Accept the latency and cost trade-off knowingly.

> **What's the risk with memory?**
> Stale context producing confidently wrong personalisation, and context leaking across a boundary it shouldn't cross. Mitigate with explicit retention policy, user visibility and control, and remembering preferences rather than profiles.

> **How do you decompose a large agent?**
> By domain and ownership, not by function. Functions are tools; domains are agents. Each child should map to a team, a knowledge corpus and a set of systems, and should stand alone.

---

**Next:** [Security & Identity →](07-security-and-identity.md)
