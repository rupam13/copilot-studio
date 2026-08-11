# 8. Lifecycle & Operations

**Components:** Environments & Solutions · Testing & Evaluations · Analytics & Monitoring · Publishing & Channels

Everything between "it works on my screen" and "it works for four thousand people and someone owns it."

---

## Environments & Solutions

Organise, package and deploy agents across development and production environments.

### Environments

An environment is a container with its own data, security, DLP policies and access. It's the primary isolation boundary in Power Platform.

**Minimum viable topology:**

```
DEV                TEST/UAT              PROD
Makers build   →   Business validates →  Users consume
Loose access       Prod-like data        Locked down
Test data          Prod-like config      Real connections
```

**The default environment is not a development environment.** Everyone has maker access, DLP is often permissive, and there's no isolation. Build there for a demo, never for anything that will survive the week.

### Solutions

A solution packages related components — agents, flows, connection references, environment variables, tables, custom connectors — as a single deployable unit.

**Build inside a solution from the first day.** Retrofitting is possible and unpleasant. Components created outside a solution have to be added back one by one, and something always gets missed.

**Managed vs unmanaged:**
- **Unmanaged** — the editable source. Lives in dev only.
- **Managed** — the sealed deployable. Goes to test and prod. Nobody edits prod directly, which is the entire point.

**Solution hygiene:**
- Use a proper publisher with a meaningful prefix — not the default publisher
- **Connection references** for every connection, so deployment is configuration not surgery
- **Environment variables** for every URL, ID, email, site and threshold
- Version deliberately: major for breaking changes, minor for features, patch for fixes

### Power Platform Pipelines

Native ALM: define your dev → test → prod path once, then deploy through the maker interface with approvals and deployment history — without standing up Azure DevOps or GitHub Actions.

Use pipelines when you want governed deployment with low overhead. Use ADO/GitHub Actions when you need deep CI/CD integration, automated testing gates, or your organisation already runs everything through one pipeline.

**Either way, the rule is the same: no manual edits in production. Ever.**

---

## Testing & Evaluations

Measure agent behaviour, response quality, reliability and task performance.

### The levels

**1. Playground testing (development)**
Fast iteration with conversation tracing. Shows you which topic triggered, which tools were called, variable values at each step. Use it constantly while building. It proves nothing about production.

**2. Evaluation sets (quality gate)**
A curated set of inputs with expected outcomes, run repeatedly.

```
Input                              Expected outcome
─────────────────────────────────  ─────────────────────────────────
"can't connect to vpn"             VPN troubleshooting path
"how much leave do I have"         Calls leave-balance tool
"what's the parental leave policy" Grounds on HR policy doc
"what's the CEO's salary"          Refuses, no fabrication
"reset password for someone else"  Refuses without authorisation
"asdfgh"                           Graceful clarification
```

Build the set to cover: happy paths, edge phrasing, out-of-scope requests, adversarial prompts, ambiguous requests, and multilingual input if relevant.

**Because generative orchestration is non-deterministic, run each case several times and measure a rate.** "Correct 9/10" is the unit of truth here, not pass/fail. Establish a baseline before every change so you can see regressions.

**3. User acceptance testing**
Real users, real questions, real data, in the actual channel. Users ask things you never imagined. This is where you discover your agent is being asked about the canteen menu.

**4. Production monitoring**
See below. Testing never actually ends.

### What to measure

| Metric | Why |
|---|---|
| **Resolution rate** | Did it actually resolve without a human? The headline number. |
| **Escalation rate** | Rising = degrading. Zero = it's not escalating when it should. |
| **Abandonment** | Users leaving mid-conversation. A quality signal disguised as a usage stat. |
| **Tool success rate** | Integration health |
| **Groundedness** | Are answers traceable to sources? |
| **Latency** | Adoption killer above a few seconds in chat |
| **CSAT / thumbs** | Necessary, noisy, biased toward complaints |

---

## Analytics & Monitoring

Track usage, execution activity, outcomes, performance and improvement opportunities.

**Read analytics for four things:**

1. **Coverage gaps** — what are users asking that falls through to fallback? This is your topic and knowledge backlog, written by the users themselves. It's the highest-value report in the product.
2. **Failure patterns** — tool errors, auth failures, timeouts, clustered by cause
3. **Adoption** — active users, sessions, repeat usage. Repeat usage is the honest signal; first-time usage measures your announcement email.
4. **Business outcome** — deflection, hours saved, cycle time reduced. Translate to the language your sponsor uses, or the agent quietly loses funding at the next review.

**Set up alerting** on tool failure rate, escalation spikes and latency degradation. You want to know before the users tell you.

**The improvement loop:**
```
Analytics → identify top unhandled intents
   → add knowledge source or topic
   → validate against evaluation set
   → deploy through pipeline
   → measure the change
   → repeat
```
Monthly cadence works well. Agents that don't get this loop decay within a quarter.

---

## Publishing & Channels

Deploy agents across Teams, Microsoft 365 Copilot, websites and applications.

| Channel | Fits | Notes |
|---|---|---|
| **Microsoft Teams** | Internal employee agents | Highest adoption by a distance — it's where people already are. SSO works cleanly. |
| **Microsoft 365 Copilot** | Extending the Copilot experience | Agent is discoverable inside Copilot; strongest M365 context |
| **Website (custom or demo canvas)** | Customer-facing, public | Needs explicit auth design; watch anonymous abuse |
| **Custom app / mobile / SDK** | Embedded experiences | Most control, most work |
| **Voice / telephony** | Contact centre | Rewrite responses for speech — visual output reads terribly aloud |
| **Other messaging platforms** | External reach | Feature parity varies by channel |

**Channel design is not a deployment step, it's a design constraint:**

- Rich cards render in Teams, degrade to text elsewhere. Design the degraded version deliberately.
- Response length that works on a desktop is unreadable on mobile.
- Voice needs short sentences, no bullets, no markdown, no URLs read aloud.
- Auth behaves differently per channel — SSO in Teams, explicit sign-in on web.
- **Test in every channel you publish to.** Not just the one you built in.

### Publishing

Publishing pushes changes to connected channels. Two rules:

1. **Publish from a pipeline, not from the editor**, once you're past prototype.
2. **Have a rollback path.** Solution versioning gives you one; know how to use it before you need it at 6pm on a Friday.

---

## Interview-grade summaries

> **How do you take a Copilot Studio agent from dev to production?**
> Build inside a solution in a dedicated dev environment, using connection references and environment variables so nothing is hardcoded. Export as managed and deploy through Power Platform Pipelines — or ADO/GitHub Actions for deeper CI/CD — into test then prod, with approval gates. Never edit production directly. Validate against an evaluation set at each stage.

> **How do you measure whether an agent is working?**
> Resolution rate and escalation rate as the primary pair, plus abandonment, tool success rate, latency and CSAT. Then translate to business outcome — deflection, hours saved, cycle time — because that's what determines whether it stays funded.

> **Your agent's quality is degrading over time. What do you do?**
> Check analytics for unhandled intent clusters and tool failure patterns, verify knowledge sources haven't gone stale or accumulated duplicates, re-run the evaluation baseline to isolate what regressed, and check whether scope has crept past what the instructions cover. Usually it's stale knowledge or unmanaged scope creep, not the model.

---

**Back to:** [Component Reference](README.md)
