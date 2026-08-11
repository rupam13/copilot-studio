# Interview & Exam Prep

Rapid-fire answers, the questions that separate people who've read about Copilot Studio from people who've shipped with it, and the traps.

---

## Tier 1 — definitions you must not fumble

**What is Copilot Studio?**
A low-code platform for building, governing and deploying AI agents across Microsoft 365 and beyond. Microsoft-managed, with connectors, orchestration, ALM and enterprise governance built in.

**Agent vs chatbot?**
A chatbot matches intents to authored responses. An agent reasons about a goal and completes tasks — composing a path from its knowledge, tools and instructions rather than following only the paths you scripted.

**Topic vs generative answer?**
A topic is an authored deterministic flow. A generative answer is composed at runtime from knowledge sources. Topics for regulated and consequential paths; generative answers for the informational long tail.

**Tool vs agent flow?**
A tool is a single capability the orchestrator may choose at runtime — the model decides. An agent flow is an authored multi-step process — you decide. A flow can be exposed to the agent as a tool.

**Connector vs connection?**
Connector = the capability definition; travels with the solution. Connection = the authenticated instance; environment-specific, doesn't travel. Use connection references.

**Entity vs variable?**
An entity extracts a structured value from user text. A variable stores a value for reuse. Entities produce; variables hold.

---

## Tier 2 — the discriminating questions

### "Generative or topic-based orchestration?"

The trap is picking one. The answer is the trade-off plus the hybrid.

> Topic-based is predictable, auditable and cheap, but brittle outside anticipated phrasing and expensive to author at scale. Generative handles unanticipated requests and multi-step reasoning at far lower authoring cost, but it's non-deterministic and harder to audit.
>
> In production I'd use both. Generative orchestration on the front door for reach and multi-step planning; deterministic topics owning anything consequential — money, identity, external communication, compliance. Generative answer nodes inside those topics for the soft middle.
>
> The critical dependency is metadata quality. Generative orchestration routes on tool descriptions, topic descriptions and agent instructions. Vague descriptions produce erratic tool selection, and people blame the model.

### "How do you stop hallucination?"

Order matters — leading with "use a better model" marks you as someone who hasn't debugged one.

> Grounding first. Curate knowledge sources tightly rather than pointing at a whole SharePoint site, because retrieval surfaces what's similar, not what's correct. Disable general-knowledge fallback so the agent says it doesn't know instead of answering from training data. Structure documents so they chunk well and retire duplicate versions. Surface citations so users can verify and I can debug.
>
> Then instructions: explicit scope boundaries and a tool policy, and an instruction that it must never state a value not returned by a tool.
>
> Then architecture: anything consequential runs through a deterministic topic or agent flow rather than a generative decision. Model choice is the last lever, not the first.

### "How do you make an agent safe to act on real systems?"

> Human-in-the-loop through agent flows. The agent gathers intent, the flow computes what will actually happen and to whom, a person approves, then it executes and logs. Rejection captures a reason.
>
> Underneath that: user-context authentication so downstream systems enforce their own permissions, least-privilege service accounts where service context is unavoidable, DLP policies constraining connector combinations, and structured status returns from every flow so the agent reports what happened instead of inventing a confirmation.

### "How do you take this to production?"

> Solution-first from day one, in a dedicated dev environment — never the default environment. Connection references and environment variables for everything environment-specific. Export managed, deploy through Power Platform Pipelines with approval gates into test then prod. No manual edits in production, ever. Evaluation set run at each stage against a baseline, and a rollback path via solution versioning.

### "How do you measure success?"

> Resolution rate and escalation rate as the core pair, plus abandonment, tool success rate, latency and CSAT. But the number that keeps it funded is business outcome — deflection volume, hours saved, cycle time reduced. I'd baseline the manual process before launch, because you cannot claim improvement against a number you never measured.

### "When do you split into connected agents?"

> When scope breadth starts degrading reasoning quality, when different teams need to own different domains, or when governance boundaries differ. The signals are instructions past a page, tools that aren't obviously distinguishable, and noisy evaluation results.
>
> Split by domain and ownership, not by function — functions are tools, domains are agents. Orchestrator owns routing only, children are narrow and independently deployable. The cost is latency, consumption and harder cross-boundary debugging, so I wouldn't split preemptively.

### "How would you automate a legacy system with no API?"

> Computer use — agents interacting with desktop applications and websites directly, clicking, typing, navigating and filling forms. It covers the systems that were never going to get an API. I'd still prefer an API or connector where one exists, because UI automation is inherently more fragile, and I'd wrap it in monitoring and a human-approval step for anything consequential.

---

## Tier 3 — the scenario question

Most senior interviews end with one. The structure that works:

```
1. CLARIFY      Users, volume, systems, compliance, success metric
2. BUILD PATH   Which tier, and the constraint that decides it
3. ARCHITECTURE Agents, knowledge, tools, orchestration
4. GOVERNANCE   Auth, DLP, human-in-the-loop, audit
5. LIFECYCLE    Environments, solutions, pipelines, evaluation
6. MEASUREMENT  Metrics, baseline, improvement loop
7. RISKS        Two or three, named honestly, with mitigations
```

Step 1 is not optional and step 7 is what distinguishes senior candidates. Naming your own design's weaknesses reads as experience; presenting a flawless plan reads as inexperience.

### Worked example — "Build an IT support agent for 5,000 employees"

**Clarify:** Ticket volume and top intents? Which ITSM system? Is there an existing knowledge base and is it current? Must it create tickets or only assist? What's the success metric — deflection, resolution time, CSAT?

**Build path:** Copilot Studio. Forced by connectors to the ITSM system, Power Automate for ticket creation and approvals, Teams deployment, and DLP governance at 5,000 users. Agent Builder can't reach the ITSM system; nothing here needs custom orchestration or Foundry services.

**Architecture:** Single agent initially — IT support is one domain with one owner. Knowledge grounded on a curated IT KB library, not the whole IT SharePoint site. Tools: `SearchKnowledgeBase`, `CheckTicketStatus`, `CreateIncident`, `CheckAssetDetails`. Generative orchestration for routing and the long tail; deterministic topics for password reset and access requests, where the sequence is security-relevant. Generative answer nodes inside those topics for troubleshooting steps.

**Governance:** Entra ID auth with SSO in Teams, user-context connection to the ITSM system so people see only their own tickets. `CreateIncident` requires explicit confirmation with the summary shown back. Access requests route through a Power Automate approval to the manager. General-knowledge fallback off. Citations on. Escalation to the service desk always one message away.

**Lifecycle:** Solution-first in a dedicated dev environment, connection references and environment variables throughout. Pipelines to test then prod. Evaluation set covering the top 20 intents plus refusals and adversarial prompts, run before each release against a baseline.

**Measurement:** Deflection rate against a pre-launch ticket baseline, escalation rate, tool success rate, latency, thumbs feedback. Monthly review of unhandled intents feeding the knowledge and topic backlog.

**Risks:** (1) KB quality — if the existing knowledge base is stale, the agent inherits that and gets blamed for it; I'd audit and prune before launch. (2) Adoption — if it lives anywhere other than Teams, usage will disappoint; Teams-first with an internal launch campaign. (3) Scope creep — users will ask HR and facilities questions from day one; explicit out-of-scope routing in instructions, and a connected-agent split once volume justifies it.

---

## Traps

| Question | The trap | The move |
|---|---|---|
| "Which is better, generative or topic-based?" | Picking one | Give the trade-off, then the hybrid |
| "How do you fix a wrong answer?" | Reaching for a bigger model | Grounding → instructions → architecture → model, in that order |
| "Can't Copilot Studio do everything?" | Overselling | Name real limits: custom orchestration, BYO models, deep Foundry integration |
| "Why not just use ChatGPT?" | Comparing model quality | Compare on governance: tenant data boundary, DLP, per-user permissions, audit, ALM |
| "How long would this take?" | A confident number | Range it against unknowns — KB quality, connector availability, approval cycles |
| "Have you deployed to production?" | Overclaiming | Be specific about what you shipped and what you'd do differently |

---

## Closing lines worth having ready

> Lowest-code tier that satisfies the hard constraints. Not the most powerful one.

> Generative for reach, deterministic for consequence.

> Most hallucination problems are grounding problems wearing a model costume.

> An agent nobody uses is a failed project regardless of how well it's built — so channel choice and adoption are architecture decisions, not afterthoughts.
