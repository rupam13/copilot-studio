# Component Reference

Copilot Studio has a lot of surface area. Learning it as a flat list of thirty terms is how people end up able to define "entity" but unable to design an agent.

These pages group components by **the decision they serve**. You configure a family together; you rarely touch one member in isolation.

---

## The families

| # | Family | Components | The question it answers |
|---|---|---|---|
| 1 | [Foundation](01-foundation.md) | Agents, Agent Instructions, Models, Harnesses | Who is this agent and how is it built? |
| 2 | [Conversation Design](02-conversation-design.md) | Topics, Trigger Phrases, Nodes, Variables, Entities, Conditions & Branching | How does a conversation actually flow? |
| 3 | [Knowledge & Grounding](03-knowledge-and-grounding.md) | Knowledge Sources, Generative Answers | What is it allowed to know? |
| 4 | [Orchestration](04-orchestration.md) | Generative Orchestration, Topic-Based Orchestration | Who decides what happens next — you or the model? |
| 5 | [Actions & Tools](05-actions-and-tools.md) | Tools, Skills, Prompts, Connectors, Connections, Agent Flows, Power Automate, Triggers | How does it change the world outside the chat? |
| 6 | [Multi-Agent & Memory](06-multi-agent-and-memory.md) | Connected Agents, Memory | How does it scale beyond one scope and one turn? |
| 7 | [Security & Identity](07-security-and-identity.md) | Authentication, Security & Governance | Who is asking, and what may they see? |
| 8 | [Lifecycle & Operations](08-alm-and-lifecycle.md) | Environments & Solutions, Testing & Evaluations, Analytics & Monitoring, Publishing & Channels | How does it get to production and stay healthy? |
| 9 | [Adaptive Cards](09-adaptive-cards.md) | Card JSON, Input elements, Actions, Dynamic cards, Channel rendering | How do I make the conversation visually rich and interactive? |
| 10 | [ALM Deep Dive](10-alm-deep-dive.md) | Environment setup, Solutions step-by-step, Pipelines, PAC CLI, Git, CI/CD, Versioning, Checklists | How do I manage the full delivery lifecycle end-to-end? |
| 11 | [VS Code Extension](11-vscode-extension.md) | YAML topics, PAC CLI, Git workflow, CI/CD pipelines, IntelliSense, Feature branch workflow | How do I build agents like a developer with full Git governance? |
| 12 | [What's New 2025–2026](12-whats-new-2025-2026.md) | Copilot Credits, GPT-5, Computer Use, MCP, Microsoft IQ, Skills, Voice, Agent 365, Entra Agent ID, Evaluation, WhatsApp | What has changed, what's new, and how does it affect how I build? |

---

## How the layers stack

```
                    ┌─────────────────────────────┐
   CHANNELS         │ Teams · M365 Copilot · Web  │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
   ORCHESTRATION    │  Generative  ⇄  Topic-based │
                    └───┬───────────┬───────────┬─┘
                        │           │           │
              ┌─────────▼──┐  ┌─────▼─────┐  ┌──▼──────────┐
   CAPABILITY │ Knowledge  │  │  Topics   │  │ Tools /     │
              │ Sources    │  │  & Nodes  │  │ Agent Flows │
              └─────────┬──┘  └─────┬─────┘  └──┬──────────┘
                        │           │           │
                    ┌───▼───────────▼───────────▼─┐
   FOUNDATION       │ Instructions · Model · Auth │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
   PLATFORM         │ Environment · Solution · ALM│
                    └─────────────────────────────┘
```

Read bottom-up when you're **building**. Read top-down when you're **debugging** — the symptom appears at the channel, the cause is usually two layers down.

---

## Reading order

**New to the product:** 1 → 2 → 3 → 4 → 5, then 7 and 8 before you publish anything real.

**Coming from a chatbot background** (Power Virtual Agents, Dialogflow, Rasa): start at [Orchestration](04-orchestration.md). The generative orchestration model is the biggest change from the intent-and-flow world you already know.

**Coming from a developer background:** start at [Actions & Tools](05-actions-and-tools.md) and [ALM](08-alm-and-lifecycle.md). The conversation-design layer will feel familiar; the governance model probably won't.

---

## A note on product velocity

Copilot Studio ships changes continuously. Names move (Power Virtual Agents → Copilot Studio; plugins → tools; skills → connected agents in several contexts). These pages describe **concepts and trade-offs**, which are stable, and flag where naming has churned. For exact UI paths, licensing numbers and quota limits, always check Microsoft Learn — those are the parts that go stale fastest.
