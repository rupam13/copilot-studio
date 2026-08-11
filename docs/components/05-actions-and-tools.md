# 5. Actions & Tools

**Components:** Tools · Skills · Prompts · Connectors · Connections · Agent Flows · Power Automate Integration · Triggers

This is where an agent stops talking and starts doing. It's also where the terminology is muddiest — Microsoft has renamed several of these, so definitions shift between blog posts. Below is how they relate in practice.

---

## Tools

A tool lets the agent retrieve data, call a service or perform an action. In generative orchestration, tools are what the model *chooses between*.

Anything can be surfaced as a tool: a connector action, an agent flow, a prompt, a custom API operation, a connected agent.

### Tool descriptions are your API contract with the model

Say it once more because it's the thing people get wrong: **the orchestrator selects tools by reading descriptions.** Treat a description as a spec.

```
NAME         Verb-first and specific.  CreateIncident, not TicketTool
DESCRIPTION  When to use it, what it returns, what it does NOT do
INPUTS       Named meaningfully, with descriptions and examples
OUTPUTS      Predictable shape the model can reason about
```

Rules:
- **One tool, one job.** A `ManageTickets` tool that creates, updates, closes and queries is four tools wearing a trenchcoat, and the model will pick the wrong mode.
- **Say what it isn't for.** Negative scope prevents most mis-selection.
- **Make failures legible.** A tool returning `Error 500` gives the model nothing. `No incident found with that number` lets it recover and ask the user.
- **Confirm before consequence.** Any tool that writes, spends or sends should require explicit user confirmation in the instructions.

### ⚠️ Limits & Constraints — Tools

| Limit | Value | Notes |
|---|---|---|
| Tools per agent | No hard cap published | Keep under ~15–20; large tool lists degrade orchestrator accuracy |
| Tool description length | No hard cap | Aim for 2–4 sentences covering when to use, return value, and what it is NOT for |
| API calls per connection | **300 calls / 60 sec** | Throttling kicks in silently; design for retries |
| Action payload size | **100 MB per action** (Express mode) | Effective limit lower due to Base64 encoding overhead |
| Daily action quota | Plan-dependent | Every action step (including Compose, Initialize Variable) counts toward Power Platform daily quota |

---

## Skills

Reusable capabilities that help agents perform specialised tasks consistently — packaged expertise you attach rather than rebuild.

Conceptually: a tool is *a single action*; a skill is *a bundle of capability* around a domain. Historically "skill" also referred to Bot Framework skills connected to a Copilot Studio agent; that pattern still exists but connected agents have largely taken over the "delegate to a specialist" job. Know both meanings — an interviewer might mean either.

---

## Prompts

Reusable AI instructions for generating, summarising, extracting or transforming information. Built once (in AI Builder / the prompt authoring surface), then reused across agents and flows.

**What they're excellent at:**
- Extracting structured fields from unstructured text — invoices, emails, contracts
- Summarising to a fixed shape ("three bullets, then a risk rating")
- Classifying into your taxonomy
- Rewriting between registers or formats

**Why use a prompt instead of putting it in the agent instructions:** it's versioned, reusable, testable in isolation, and callable from a flow without an agent in the loop. Extraction and classification logic almost always belongs in a prompt.

---

## Connectors

Connect agents to applications, APIs, services and enterprise data. Over a thousand prebuilt (SharePoint, Dataverse, SQL, Salesforce, ServiceNow, SAP, Outlook, Teams…), plus custom connectors for your own APIs.

**Connector types:**
- **Standard** — included in most licensing
- **Premium** — needs premium licensing; SQL, Salesforce, ServiceNow, HTTP and most enterprise systems live here. *Check licensing before you architect around one.*
- **Custom** — your API, defined via OpenAPI spec
- **On-premises data gateway** — for systems that never left the datacentre

**Custom connector checklist:** OpenAPI definition, authentication configured (OAuth 2.0 preferred over API keys), operation descriptions written for the model not for a developer, error responses mapped to meaningful messages, throttling understood.

### ⚠️ Limits & Constraints — Connectors

| Limit | Value | Notes |
|---|---|---|
| Prebuilt connectors | **1,000+** | Standard included in most licences; Premium needs separate licence |
| Connector payload size (public cloud) | **5 MB** | GCC plans limited to **450 KB** |
| API calls per connection | **300 / 60 sec** | Platform-level throttle; applies to both standard and custom connectors |
| Custom connector auth | OAuth 2.0 preferred | API key supported but discouraged for enterprise systems |
| Premium connector licensing | Checked at **runtime** | Missing licence silently blocks the action; user sees a generic error |
| On-premises data gateway | Required for on-prem systems | Adds latency and a deployment dependency |

---

## Connections

The **authenticated access** itself — the credential binding that lets a connector actually reach the resource.

The distinction matters because it's the number one deployment failure:

- A **connector** is a capability definition. It travels with your solution.
- A **connection** is an authenticated instance. It does **not** travel — it's environment- and identity-specific.

Deploy a solution to production and the connections must be re-established in that environment. Use **connection references** in your solutions so this is a configuration step rather than an edit-every-flow archaeology exercise.

**Also decide, deliberately:** does the connection run as the *maker* (one service identity, every user gets the same access) or as the *end user* (per-user permissions enforced)? Get this wrong in the maker direction and you've built a data-exposure incident.

---

## Agent Flows

Structured, multi-step workflows for repeatable business processes — the deterministic execution engine sitting behind the conversational layer.

**Use an agent flow when the work involves:**
- Multiple systems in sequence
- Approvals and human-in-the-loop steps
- Error handling, retries, compensation
- Anything transactional that must either complete or roll back cleanly
- Long-running processes that outlive the conversation

**The human-in-the-loop pattern** deserves its own note, because it's the answer to half of all "is this safe?" objections:

```
Agent gathers intent and parameters
   → Agent flow prepares the action and computes impact
   → Approval step: a human sees WHAT will happen and to WHOM
   → Approved   → execute → confirm back to the user
     Rejected   → capture reason → inform the user → log
```

Everything consequential gets this shape. It converts "the AI did something" into "a person approved something the AI proposed", which is a completely different conversation with your risk team.

### ⚠️ Limits & Constraints — Agent Flows

| Limit | Value | Notes |
|---|---|---|
| Synchronous timeout | **100–120 seconds** | Flow must return "Respond to agent" within this window or `FlowActionTimedOut` is thrown |
| Express mode payload | **100 MB per action** | Effective limit lower; large Dataverse queries or Base64 content hit this first |
| Logic-heavy flows in Express mode | May hit memory limit | Disable Express mode in flow details for heavy data processing |
| Flow run quota | Daily Power Platform request limit | Every action step counts; heavy flows on high-traffic agents exhaust quota faster |
| Dataverse standard quota | **50 RPM / 1,000 RPH** | Scales with prepaid message packs |
| Async workaround | Send early "Respond to agent" | Return acknowledgement immediately, process heavy work asynchronously; agent cannot wait for result |

> **Most common production failure:** a flow that works in testing (fast data, low volume) times out in production (real data, concurrent users). Load test before go-live.

---

## Power Automate Integration

Extends agents with the full Power Automate surface: approvals, connectors, complex conditional logic, scheduled and event-driven automation, and the existing flows your organisation already runs.

**Where the boundary sits in practice:**

| Put it in the agent | Put it in the flow |
|---|---|
| Conversation, clarification | Multi-system orchestration |
| Deciding *what* to do | Executing *how* it's done |
| Presenting results | Error handling and retries |
| Confirmation prompts | Approvals, logging, audit writes |

**The integration failures you'll actually hit:** type mismatches at the boundary (choice vs string is the classic), flow timeouts inside a synchronous conversation, unhandled failures returning nothing so the agent invents a confirmation, missing connection references in the deployed environment, and premium licensing gaps that only appear in production.

Always return a structured status object from a flow — `success`, `message`, `referenceId` — so the agent can speak accurately about what happened rather than guessing.

---

## Triggers

Start agent actions or workflows when specific events occur. This is what moves an agent from reactive to proactive.

**Trigger categories:**
- **Conversational** — user utterance, channel event, conversation start
- **Event-based** — record created or modified in Dataverse, file added to SharePoint, email received, external webhook
- **Scheduled** — recurrence
- **Manual** — invoked by a person or another system

**Design cautions:**
- **Loops.** An agent that emails, triggered by email, is a story you'll tell for years. Add guards.
- **Volume.** A trigger on a high-churn table fires far more than you expect. Filter at the trigger, not in the flow.
- **Idempotency.** Assume duplicate fires. Design so the second one is harmless.
- **Notification fatigue.** Proactive is a privilege. Batch and threshold aggressively or users mute the agent, permanently.

---

## Interview-grade summaries

> **Tool vs agent flow?**
> A tool is a single capability the orchestrator may choose to call at runtime. An agent flow is an authored, deterministic multi-step process. Model decides vs you decide. Flows are also what you use for approvals, retries and anything transactional — and a flow can itself be exposed to the agent as a tool.

> **Connector vs connection?**
> A connector defines the capability and travels with the solution. A connection is the authenticated instance and is environment-specific. Use connection references so deployment is configuration, not rework.

> **How do you make an agent safe to let act on real systems?**
> Human-in-the-loop via agent flows. The agent proposes with full impact detail, a person approves, the flow executes and logs. Plus least-privilege connections, user-context auth where per-user permissions matter, and structured status returns so the agent never fabricates an outcome.

> **How do you automate a system with no API?**
> Historically an RPA problem. In current Copilot Studio, computer use lets agents interact with desktop applications and websites directly — clicking, typing, navigating and filling forms — which covers legacy systems that were never going to get an API.

---

**Next:** [Multi-Agent & Memory →](06-multi-agent-and-memory.md)
