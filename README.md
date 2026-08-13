<div align="center">

# 🤖 Microsoft Copilot Studio — Practitioner Playbook

**A hands-on reference for building, governing, and shipping enterprise AI agents**

[![Last Updated](https://img.shields.io/badge/Updated-August%202026-blue?style=flat-square)](https://github.com/rupam13/copilot-studio)
[![Chapters](https://img.shields.io/badge/Chapters-14-blueviolet?style=flat-square)](docs/components/README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Copilot%20Studio%202025--2026-orange?style=flat-square)](https://copilotstudio.microsoft.com)

*Written from hands-on agent builds — not marketing decks.*  
*Every page: what it is · when to use it · when NOT to · limits · interview answers.*

</div>

---

## 🗺️ Quick Navigation

| I want to… | Go to |
|---|---|
| 🏁 Start from scratch | [Foundation](docs/components/01-foundation.md) |
| 🔀 Decide no-code vs low-code vs pro-code | [Build Path Decision Guide](docs/guides/build-path-decision.md) |
| 💬 Design conversations | [Conversation Design](docs/components/02-conversation-design.md) |
| 🧠 Ground my agent in knowledge | [Knowledge & Grounding](docs/components/03-knowledge-and-grounding.md) |
| 🔌 Publish to Teams / Web / WhatsApp / Voice | [Channel Integration & Handoff](docs/components/13-channel-integration.md) |
| 🤝 Hand off to ServiceNow / D365 / Zendesk | [Channel Integration & Handoff](docs/components/13-channel-integration.md) |
| 🔌 Call APIs and automate workflows | [Actions & Tools](docs/components/05-actions-and-tools.md) |
| 🃏 Add rich interactive UI | [Adaptive Cards](docs/components/09-adaptive-cards.md) |
| 🚀 Ship to production | [ALM Deep Dive](docs/components/10-alm-deep-dive.md) |
| 💻 Build like a developer (VS Code + Git) | [VS Code Extension](docs/components/11-vscode-extension.md) |
| 🆕 See what's changed in 2025–2026 | [What's New 2025–2026](docs/components/12-whats-new-2025-2026.md) |
| 🎤 Prep for interview or exam | [Interview & Exam Prep](docs/guides/interview-prep.md) |
| 📖 Look up a term fast | [Glossary](docs/guides/glossary.md) |

---

## 📚 All 14 Chapters

### 🔷 Core Platform (Days 1–5)

| # | Chapter | Key Topics | The Question It Answers |
|---|---|---|---|
| 1 | [**Foundation**](docs/components/01-foundation.md) | Agents, Instructions (8k char limit), Models, Harnesses, Build Path | *Who is this agent and how is it built?* |
| 13 | [**Channel Integration & Handoff** 🆕](docs/components/13-channel-integration.md) | Web embed, Custom Canvas, Teams, WhatsApp, Voice step-by-step + D365, ServiceNow, Zendesk handoff patterns | *How do I publish to each channel and connect to a live agent?* |
| 3 | [**Knowledge & Grounding**](docs/components/03-knowledge-and-grounding.md) | Knowledge Sources (500 max, 512MB), Generative Answers, Grounding rules | *What is it allowed to know?* |
| 4 | [**Orchestration**](docs/components/04-orchestration.md) | Topic-based vs Generative, Hybrid pattern, Tool descriptions | *Who decides what happens next — you or the model?* |
| 5 | [**Actions & Tools**](docs/components/05-actions-and-tools.md) | Tools, Connectors, Agent Flows (100–120s timeout), Power Automate, Triggers | *How does it change the world outside the chat?* |
| 6 | [**Multi-Agent & Memory**](docs/components/06-multi-agent-and-memory.md) | Connected Agents, Orchestrator pattern, Memory layers, Context handoff | *How does it scale beyond one scope and one turn?* |
| 7 | [**Security & Identity**](docs/components/07-security-and-identity.md) | Auth modes, SSO, DLP policies, Rate limits, Copilot Credits | *Who is asking, and what may they see?* |
| 8 | [**Lifecycle & Operations**](docs/components/08-alm-and-lifecycle.md) | Environments, Solutions, Pipelines, Testing, Analytics, Publishing | *How does it get to production and stay healthy?* |

### 🔶 Advanced & Specialist Topics

| # | Chapter | Key Topics | The Question It Answers |
|---|---|---|---|
| 9 | [**Adaptive Cards**](docs/components/09-adaptive-cards.md) | Card JSON, Input elements, Dynamic cards, Channel rendering (40KB limit) | *How do I make conversations visually rich and interactive?* |
| 10 | [**ALM Deep Dive**](docs/components/10-alm-deep-dive.md) | Env setup steps, Solution build steps, Pipelines, PAC CLI, Git, CI/CD, Checklists | *How do I manage the full delivery lifecycle end-to-end?* |
| 11 | [**VS Code Extension**](docs/components/11-vscode-extension.md) | YAML topics, PAC CLI commands, Feature branch workflow, GitHub Actions CI/CD | *How do I build agents like a developer with full Git governance?* |
| 12 | [**What's New 2025–2026** 🆕](docs/components/12-whats-new-2025-2026.md) | Copilot Credits, GPT-5, Computer Use, MCP, Microsoft IQ, Voice, Evaluation | *What has changed, and how does it affect how I build?* |
| 14 | [**Analytics, Monitoring & Evaluation** 🆕](docs/components/14-analytics-and-evaluation.md) | Built-in Analytics, Application Insights (KQL), Evaluation testing suites | *How do I monitor performance and systematically test quality?* |

---

## 🧠 The Mental Model

An agent is **five questions answered in sequence**:

```
WHO AM I?          →  Instructions + Model + Harness
WHAT DO I KNOW?    →  Knowledge Sources → Generative Answers
WHAT CAN I DO?     →  Tools + Connectors + Agent Flows + MCP
HOW DO I DECIDE?   →  Orchestration (Generative or Topic-Based or Hybrid)
HOW DO I SCALE?    →  Multi-Agent + Memory + Skills + Governance
```

Everything else — auth, DLP, environments, channels, analytics, credits — is how you make those five answers **safe, shippable, and measurable**.

### Architecture Stack (Read Bottom-Up When Building)

```
┌────────────────────────────────────────────────────────┐
│  CHANNELS  Teams · M365 Copilot · Web · Voice · WhatsApp│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  ORCHESTRATION    Generative  ⇄  Topic-Based  (Hybrid)  │
└──────────┬────────────────────────────┬────────────────┘
           │                            │
┌──────────▼───────┐      ┌─────────────▼──────────────┐
│  KNOWLEDGE       │      │  TOOLS / ACTIONS           │
│  Sources · GenAI │      │  Connectors · Flows · MCP  │
└──────────┬───────┘      └─────────────┬──────────────┘
           │                            │
┌──────────▼────────────────────────────▼──────────────┐
│  FOUNDATION   Instructions · Model · Auth · Identity  │
└──────────────────────────┬───────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────┐
│  PLATFORM   Environment · Solution · Pipeline · ALM  │
└──────────────────────────────────────────────────────┘
```

---

## 🆕 Latest Updates at a Glance (2025–2026)

> Full detail → [What's New 2025–2026](docs/components/12-whats-new-2025-2026.md)

| Feature | Status | One-Line Summary |
|---|---|---|
| **Copilot Credits** | ✅ GA Sep 2025 | Replaces messages — Classic=1cr · Generative=2cr · Tool=5cr |
| **GPT-5 & Claude Opus 4.8** | ✅ GA 2026 | Multi-model selection: Basic / Standard / Premium tiers |
| **Computer Use** | ✅ GA May 2026 | Agents operate any UI — for legacy systems with no API |
| **Model Context Protocol (MCP)** | ✅ GA 2025 | 1,400+ system integrations via open standard |
| **Microsoft IQ** | 🔵 Preview | Live M365 data (email, calendar, Teams) — needs M365 Copilot licence |
| **Modular Skills** | 🔵 Preview | Reusable capability packages shared across multiple agents |
| **Real-Time Voice Agents** | ✅ GA 2026 | Natural spoken conversations — full contact centre support |
| **Agent 365** | ✅ GA 2026 | Unified admin control plane for ALL agents in the tenant |
| **Entra Agent ID** | ✅ GA 2026 | Each agent = its own managed identity, audit trail, revocation |
| **Agent Evaluation Framework** | ✅ GA 2026 | Automated testing with custom graders and score tracking |
| **New Authoring UI** | 🔵 Preview | Instructions + Knowledge + Tools + Memory + Skills as top-level tabs |
| **WhatsApp Channel** | ✅ GA late 2025 | Via Azure Communication Services — no Adaptive Cards |
| **SSO Consent Cards** | ✅ GA 2025 | Auth happens inline in chat — no redirect |
| **BYOM (Azure AI Foundry)** | ✅ GA (pro-code) | Fine-tuned domain models via Azure AI Foundry |

---

## ⚡ Key Limits at a Glance

| Component | Limit | Value |
|---|---|---|
| Agent Instructions | Max characters | **8,000** (effective ~4–5k) |
| Topics per agent | Web / Teams | **1,000** / **250** |
| Knowledge sources per agent | All types | **500** |
| Uploaded file size | Per file | **512 MB** (SharePoint without M365 Copilot: ~7 MB) |
| Agent flow sync timeout | Power Automate | **100–120 seconds** |
| Adaptive Card payload | Per card | **40 KB** |
| Connector payload | Public cloud / GCC | **5 MB** / **450 KB** |
| API calls per connection | Per minute | **300 / 60 sec** |
| Copilot Credits — Classic answer | Per response | **1 credit** |
| Copilot Credits — Generative answer | Per response | **2 credits** |
| Copilot Credits — Tool call | Per invocation | **5 credits** |
| Copilot Credits — Agent flow (per 100 actions) | Per batch | **13 credits** |

---

## 🏗️ Design Principles

1. **Lowest-code tier that satisfies the constraints.** Not the most powerful — the one that meets requirements and can be maintained by the people who'll own it.

2. **Narrow scope beats clever instructions.** If an agent needs a paragraph of exceptions, split it into connected agents.

3. **Deterministic paths for consequential actions.** Anything that spends money, sends external mail, or touches a record of truth goes through a topic or agent flow — not a generative decision.

4. **Grounding before prompting.** Most "hallucination" problems are missing or badly scoped knowledge sources wearing a model costume.

5. **Solutions from day one.** Building outside a solution is migration debt you always pay at the worst possible moment.

6. **Credit cost is architecture cost.** Generative orchestration + multi-tool chains at scale = credits consumed fast. Model your usage before committing to an architecture.

7. **Test with rates, not pass/fail.** Generative orchestration is non-deterministic. "9/10 correct" is the unit of truth — run evaluation before every deployment.

---

## 📂 Repo Structure

```
copilot-studio/
│
├── docs/
│   ├── components/              # 12 component reference chapters
│   │   ├── 01-foundation.md
│   │   ├── 02-conversation-design.md
│   │   ├── 03-knowledge-and-grounding.md
│   │   ├── 04-orchestration.md
│   │   ├── 05-actions-and-tools.md
│   │   ├── 06-multi-agent-and-memory.md
│   │   ├── 07-security-and-identity.md
│   │   ├── 08-alm-and-lifecycle.md
│   │   ├── 09-adaptive-cards.md
│   │   ├── 10-alm-deep-dive.md
│   │   ├── 11-vscode-extension.md
│   │   └── 12-whats-new-2025-2026.md
│   │
│   └── guides/                  # Decision guides & reference material
│       ├── build-path-decision.md
│       ├── interview-prep.md
│       └── glossary.md
│
├── examples/                    # Instruction snippets, flow patterns, test sets
├── assets/                      # Diagrams
├── CONTRIBUTING.md
└── LICENSE
```

---

## 📅 5-Day Learning Path

| Day | Focus | Chapters |
|---|---|---|
| **Day 1** | Foundation & Build Path | 1 — Foundation |
| **Day 2** | Conversation Design | 2 — Conversation Design |
| **Day 3** | Knowledge & Orchestration | 3, 4 — Knowledge + Orchestration |
| **Day 4** | Actions, Security & Multi-Agent | 5, 6, 7 — Tools, Multi-Agent, Security |
| **Day 5** | Lifecycle, ALM & Exam Prep | 8, 10 — Lifecycle + ALM Deep Dive + Interview Prep |
| **Bonus** | Advanced Topics | 9, 11, 12 — Adaptive Cards, VS Code, What's New |

---

## 🤝 Contributing

Corrections welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).  
Microsoft ships Copilot Studio changes continuously. If a page has drifted from current behaviour, open an issue with a link to the Microsoft Learn doc.

## 📄 License

[MIT](LICENSE) — writing and code samples.  
Microsoft product names and marks belong to Microsoft Corporation.

---

<div align="center">

**Built by [Rupam Wadibhasme](https://github.com/rupam13) · August 2026**

*"Generative for reach. Deterministic for consequence."*

</div>
