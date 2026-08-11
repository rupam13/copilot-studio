# Copilot Studio Playbook

A practitioner's reference for **Microsoft Copilot Studio** — the components, how they fit together, and how to decide what to build with them.

Written from hands-on agent builds, not marketing decks. Every component page follows the same shape: what it is, when to use it, when *not* to, and the mistakes that cost me time.

---

## Start here

| If you want to… | Go to |
|---|---|
| Understand the building blocks | [Component Reference](docs/components/README.md) |
| Decide no-code vs low-code vs pro-code | [Build Path Decision Guide](docs/guides/build-path-decision.md) |
| Understand orchestration trade-offs | [Orchestration](docs/components/04-orchestration.md) |
| Ship to production properly | [ALM & Lifecycle](docs/components/08-alm-and-lifecycle.md) |
| Prep for an interview or exam | [Interview & Exam Prep](docs/guides/interview-prep.md) |
| Look up a term fast | [Glossary](docs/guides/glossary.md) |

---

## Component reference

Thirty concepts, grouped into eight families. The grouping matters more than the list — components inside a family are usually configured together.

**1. [Foundation](docs/components/01-foundation.md)**
Agents · Agent Instructions · Models · Harnesses

**2. [Conversation Design](docs/components/02-conversation-design.md)**
Topics · Trigger Phrases · Nodes · Variables · Entities · Conditions & Branching

**3. [Knowledge & Grounding](docs/components/03-knowledge-and-grounding.md)**
Knowledge Sources · Generative Answers

**4. [Orchestration](docs/components/04-orchestration.md)**
Generative Orchestration · Topic-Based Orchestration

**5. [Actions & Tools](docs/components/05-actions-and-tools.md)**
Tools · Skills · Prompts · Connectors · Connections · Agent Flows · Power Automate Integration · Triggers

**6. [Multi-Agent & Memory](docs/components/06-multi-agent-and-memory.md)**
Connected Agents · Memory

**7. [Security & Identity](docs/components/07-security-and-identity.md)**
Authentication · Security & Governance

**8. [Lifecycle & Operations](docs/components/08-alm-and-lifecycle.md)**
Environments & Solutions · Testing & Evaluations · Analytics & Monitoring · Publishing & Channels

---

## The mental model

An agent is four questions answered in order:

```
WHO AM I?          →  Agent + Instructions + Model
WHAT DO I KNOW?    →  Knowledge Sources → Generative Answers
WHAT CAN I DO?     →  Tools, Prompts, Connectors, Agent Flows
HOW DO I DECIDE?   →  Orchestration (generative or topic-based)
```

Everything else — auth, environments, channels, analytics — is how you make those four answers safe, shippable and measurable.

---

## Design principles I build by

1. **Lowest-code tier that satisfies the constraints.** Escalate only when a hard requirement forces it, not because pro-code feels more serious.
2. **Narrow scope beats clever instructions.** If an agent needs a paragraph of exceptions, split it into connected agents.
3. **Deterministic paths for consequential actions.** Anything that spends money, sends external mail, or touches a record of truth goes through a topic or agent flow, not a generative decision.
4. **Grounding before prompting.** Most "hallucination" problems are missing or badly scoped knowledge sources.
5. **Solutions from day one.** Building outside a solution is a migration debt you always pay later.

---

## Repo structure

```
docs/
  components/     One page per component family
  guides/         Decision guides, glossary, prep material
examples/         Instruction snippets, flow patterns, test sets
assets/           Diagrams
```

---

## Status

Actively maintained. Component pages are complete; `examples/` is filling in as I ship agents.

## Contributing

Corrections welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Microsoft ships changes to this product monthly; if a page has drifted from current behaviour, open an issue with a link to the docs.

## License

[MIT](LICENSE) for the writing and code samples. Microsoft product names and marks belong to Microsoft.
