# 2. Conversation Design

**Components:** Topics · Trigger Phrases · Nodes · Variables · Entities · Conditions & Branching

This is the deterministic half of Copilot Studio. When you need a conversation to go exactly one way — because compliance, because money, because someone signs off on the outcome — this is the layer you use.

---

## Topics

A topic is a structured conversation flow built for a specific intent or scenario. It's a graph of nodes with a defined entry point and one or more exits.

**Two kinds you'll meet:**

- **System topics** — greeting, escalation, fallback, end-of-conversation, sign-in. They ship with the agent. Customise the ones users see (greeting, escalation, fallback); leave the plumbing alone until you have a reason.
- **Custom topics** — everything you author.

**Use a topic when:**

- The path is regulated or audited and must be identical every time
- The order of questions is legally or operationally load-bearing (consent before data collection)
- You need a guaranteed script — pricing, policy statements, safety instructions
- A generative answer got it *nearly* right and nearly isn't good enough

**Don't use a topic when:** you're trying to enumerate every way a user might phrase a question. That's what generative orchestration and knowledge sources are for. Fifty near-duplicate topics is a maintenance sinkhole.

**Design rule:** one topic, one outcome. If a topic branches into three genuinely different results, it's three topics.

---

## Trigger Phrases

Example utterances that teach the agent which topic to activate. They're training examples, not a keyword list — the matching is semantic.

**What works:**

- 8–15 phrases per topic, more if the intent is broad
- Real user language, harvested from tickets and chat logs, not language you invented at a desk
- Deliberate variety: short ("vpn broken"), long ("I've been trying to connect to the VPN since this morning and it keeps timing out"), formal, terse, misspelled
- Include the phrasings that arrive *without* context, because those are the hard ones

**What breaks:**

- Overlapping phrases across topics — the agent picks one, seemingly at random, and you spend an afternoon confused. If two topics need similar phrases, they're probably one topic with a branch.
- Phrases that are really entities. "Reset password for John" trains the wrong thing; "reset password" is the trigger, the name is an entity.
- Under-training. Three phrases gets you a topic that fires only for people who phrase things the way you do.

**In generative orchestration**, trigger phrases matter less — the orchestrator reads topic descriptions and instructions to decide routing. Write a clear topic description regardless; it's doing real work.

---

## Nodes

The building blocks inside a topic. Every node is one of:

| Node type | Purpose |
|---|---|
| **Message** | Say something |
| **Question** | Ask and capture into a variable |
| **Condition** | Branch on a value |
| **Action** | Call a tool, flow, connector or prompt |
| **Variable management** | Set, clear or transform values |
| **Topic redirect** | Hand control to another topic |
| **Generative answer** | Fall back to knowledge sources mid-flow |
| **End / escalate** | Terminate or hand off |

**The pattern most people miss:** a *generative answer node inside an authored topic*. You control the structure — greeting, authentication, closing — but let the model handle the unpredictable middle. Best of both models. Use it constantly.

---

## Variables

Store and reuse information across a conversation and into workflows.

**Scopes:**

- **Topic** — lives inside one topic. Default. Keep it here unless you need otherwise.
- **Global** — spans the conversation. For things established once: user's name, authenticated ID, selected language, department.
- **System** — provided by the platform: `User.DisplayName`, conversation ID, channel, activity data.
- **Environment variables** — configuration that changes between dev/test/prod: endpoints, site URLs, approver groups. **These are how you avoid hardcoding**, and they're what makes solution deployment across environments actually work. See [ALM](08-alm-and-lifecycle.md).

**Rules:**

- Never hardcode an environment-specific value in a topic. It will be wrong in production and you'll find out from a user.
- Name for meaning, not type: `RequesterEmail`, not `Var1` or `strEmail`.
- Watch the type contract at flow boundaries — passing a choice value where a string is expected is one of the most common silent failures in Power Automate integration.
- Clear sensitive variables when the flow that needs them completes.

---

## Entities

Entities extract **structured values** out of unstructured user text: dates, numbers, locations, email addresses, categories.

**Prebuilt entities** cover the common ground — date and time, number, money, email, phone, URL, person name, city, country, ordinal, percentage, plus more. Use them. They handle relative dates ("next Tuesday", "in three days") far better than anything you'll build.

**Custom entities:**

- **Closed list** — a fixed set with synonyms. Perfect for your product names, office locations, department codes, severity levels. Synonyms are the whole point: `Mumbai` should match "bombay", "BOM", "mumbai office".
- **Regex** — for structured identifiers with a real pattern: employee IDs, ticket numbers, asset tags, invoice references.

**Smart matching** lets an entity tolerate typos and near-misses. Enable it for user-typed values, disable it where precision matters more than forgiveness.

**Practical value:** entities are what let you collect three fields from one sentence instead of asking three questions. "I need a laptop for the new hire starting Monday in Pune" can populate item, date and location in a single turn. That's the difference between an agent people use and one they abandon.

---

## Conditions & Branching

Route the conversation based on responses, variables, rules or system state.

**Where branching earns its keep:**

- **Authorisation gates** — manager sees one path, employee another
- **Threshold routing** — value over ₹50,000 goes to approval, under goes straight through
- **Confidence handling** — did the entity extract cleanly, or do we re-ask?
- **Channel adaptation** — richer cards in Teams, plain text on SMS
- **Escalation triggers** — third failed attempt routes to a human

**Anti-patterns:**

- **Deep nesting.** Past three levels, nobody can read it, including you in six weeks. Extract sub-flows into their own topics and redirect.
- **Unhandled else.** Every condition needs a default branch. The path you didn't think of is the one production traffic finds.
- **Branching on raw user text.** Extract to an entity or variable first, then branch on the structured value.

---

## Putting it together

A well-built enterprise topic usually looks like this:

```
Trigger
  → Authenticate (if not already)
  → Question: capture core detail  →  Entity extraction
  → Condition: was it captured cleanly?
       ├─ No  → Re-ask once → still no → escalate
       └─ Yes → continue
  → Generative answer node (attempt self-service from KB)
  → Question: did that resolve it?
       ├─ Yes → log outcome → close
       └─ No  → Action: Agent Flow (create ticket, notify)
                → Message: confirm with real ticket number
  → End
```

Deterministic where it must be, generative where it can be.

---

## Interview-grade summaries

> **Topic vs generative answer?**
> A topic is an authored, deterministic flow for a known intent. A generative answer is composed at runtime from knowledge sources. Use topics where the path is regulated or consequential; generative answers for the long tail of informational questions. Mix them by putting generative answer nodes inside authored topics.

> **How do you collect several pieces of information without interrogating the user?**
> Entities. Extract multiple structured values from a single utterance, then only ask for what's still missing.

> **How do you stop a value from being wrong in production?**
> Environment variables, not hardcoded strings — so the same solution carries different configuration across dev, test and prod.

---

**Next:** [Knowledge & Grounding →](03-knowledge-and-grounding.md)
