# Build Path Decision Guide

No-code, low-code or pro-code. The question every Microsoft 365 agent project starts with, and the one people answer with taste instead of constraints.

---

## The three paths

### Agent Builder — no code

Built into Microsoft 365 Copilot. Simple agents in minutes.

**Fits when all of these are true:**
- Grounding on M365 files, SharePoint content or public websites
- No workflows needed
- No custom APIs
- No complex governance, connector or orchestration requirements
- Personal productivity or a small team
- You want the fastest possible path with zero infrastructure

### Copilot Studio — low code

Microsoft-managed platform with governance, connectors and orchestration. The fastest path from idea to enterprise impact.

**Fits when any of these are true:**
- You need connectors — SharePoint, Dataverse, SAP, ServiceNow, Salesforce, APIs
- You need Power Automate workflows or multi-step business processes
- You need governance, security, compliance and environment controls
- You need to deploy to Teams, Microsoft 365 Copilot, websites or customer channels
- You want business users and makers to build and scale, not just developers

### VS Code / Pro Code

M365 Agents Toolkit SDK or Azure AI Foundry. Built for developers, built to scale.

**Fits when any of these are true:**
- A development team already exists
- Git, DevOps and pull requests are mandatory
- You need custom orchestration logic the platform doesn't express
- You need Azure AI Foundry services — Computer Vision, AI Speech, Language, Document Intelligence
- You need custom models or third-party frameworks
- An existing AI solution needs to be brought into Microsoft 365 Copilot
- Maximum flexibility and scalability is a hard requirement

---

## Decision flow

```
Do you need connectors, workflows, or multi-channel deployment?
│
├─ NO ──▶ Do you need governance / environment controls?
│         ├─ NO  ──▶ AGENT BUILDER
│         └─ YES ──▶ COPILOT STUDIO
│
└─ YES ─▶ Do you need custom orchestration, BYO models,
          Azure AI Foundry services, or mandatory Git/CI-CD?
          ├─ NO  ──▶ COPILOT STUDIO
          └─ YES ─▶ Can Copilot Studio be EXTENDED to cover it?
                    (custom connectors, prompts, agent flows)
                    ├─ YES ──▶ COPILOT STUDIO + extensions
                    └─ NO  ──▶ PRO CODE
```

---

## The principle

**Choose the lowest-code tier that satisfies your hard constraints.**

Not the most powerful. Not the most impressive on a CV. The lowest one that actually meets the requirements — because every tier up costs you delivery speed, maintenance burden and the number of people in the organisation who can change it.

The failure mode runs both directions:
- **Too low** — you hit a wall mid-build and rebuild from scratch
- **Too high** — six months of engineering for something Copilot Studio would have done in three weeks, now permanently dependent on the two people who understand it

---

## These aren't rivals — it's a maturity path

```
AGENT BUILDER  ──▶  COPILOT STUDIO  ──▶  VS CODE + AZURE AI FOUNDRY
  (no code)          (low code)               (pro code)

Start simple      Add workflows,         Extend with custom logic,
and move          connectors and         AI services and scale
to low-code       governance
```

**Two evolution paths worth knowing by name:**
- Copy an Agent Builder agent into Copilot Studio as needs grow
- Extend a Copilot Studio agent to pro code when you need deeper customisation

This matters more than the initial choice. Starting in Agent Builder isn't a wrong turn you have to undo — it's step one. It lets you validate that anyone wants the agent before you spend engineering budget on it.

---

## The interview answer

> These are three tiers of the same platform, not three competing products, and they form a documented evolution path — Agent Builder agents copy into Copilot Studio, and Copilot Studio agents extend into pro code.
>
> I'd start by identifying the hard constraints: does it need connectors or workflows, does it need governance and environment controls, does it need custom orchestration or Foundry services. Then pick the lowest tier that satisfies them.
>
> For most enterprise scenarios that lands on Copilot Studio, because the moment you need SharePoint plus Power Automate plus deployment to Teams under DLP governance, you're past what Agent Builder covers and well short of needing to write your own orchestrator.
>
> I'd only go pro code with a real forcing function — a dev team that already exists with mandatory Git and CI/CD, custom orchestration the platform can't express, or Azure AI Foundry services like Document Intelligence in the critical path. And I'd first check whether custom connectors, prompts and agent flows can close the gap inside Copilot Studio, because that's usually a much cheaper answer.

---

## Quick reference

| Requirement | Agent Builder | Copilot Studio | Pro Code |
|---|:---:|:---:|:---:|
| M365 files, SharePoint, public sites | ✅ | ✅ | ✅ |
| Quick build, zero infrastructure | ✅ | ◐ | ❌ |
| Connectors (SAP, ServiceNow, Salesforce, APIs) | ❌ | ✅ | ✅ |
| Power Automate workflows | ❌ | ✅ | ✅ |
| Multi-step business processes | ❌ | ✅ | ✅ |
| Governance, security, environment controls | ❌ | ✅ | ✅ |
| Deploy to Teams / M365 Copilot / web | ◐ | ✅ | ✅ |
| Business users can build and maintain | ✅ | ✅ | ❌ |
| Git, CI/CD, pull requests | ❌ | ◐ | ✅ |
| Custom orchestration logic | ❌ | ◐ | ✅ |
| BYO models, third-party frameworks | ❌ | ❌ | ✅ |
| Azure AI Foundry services | ❌ | ◐ | ✅ |
| Maximum flexibility and scale | ❌ | ◐ | ✅ |

✅ native · ◐ possible with effort or extension · ❌ not the right tool

---

*Attribution: the three-path framing follows the decision tree published by Mahrita Harahap, Cloud Solution Architect. The commentary, decision flow and trade-off analysis are mine.*
