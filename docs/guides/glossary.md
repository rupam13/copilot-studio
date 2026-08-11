# Glossary

Fast lookup. One line each. Links go to the full treatment.

| Term | Definition |
|---|---|
| **Agent** | AI assistant that understands requests, reasons, responds and completes tasks. [→](../components/01-foundation.md) |
| **Agent Builder** | No-code agent creation built into Microsoft 365 Copilot. [→](build-path-decision.md) |
| **Agent Flow** | Structured multi-step workflow for repeatable business processes. [→](../components/05-actions-and-tools.md) |
| **Agent Instructions** | Natural-language definition of purpose, behaviour, tone, scope and boundaries. [→](../components/01-foundation.md) |
| **Analytics** | Usage, execution activity, outcomes, performance and improvement opportunities. [→](../components/08-alm-and-lifecycle.md) |
| **Authentication** | Verifies users and controls secure access to agents and resources. [→](../components/07-security-and-identity.md) |
| **Channel** | Where an agent is published: Teams, M365 Copilot, website, custom app, voice. [→](../components/08-alm-and-lifecycle.md) |
| **Computer Use** | Agent capability to interact with desktop apps and websites directly — clicking, typing, navigating, filling forms. Automates systems with no API. |
| **Condition** | Node that branches the conversation on a value, rule or variable. [→](../components/02-conversation-design.md) |
| **Connected Agent** | A specialist agent an orchestrator delegates to. [→](../components/06-multi-agent-and-memory.md) |
| **Connection** | Authenticated instance of a connector. Environment-specific; does not travel with a solution. [→](../components/05-actions-and-tools.md) |
| **Connection Reference** | Solution component that lets connections be rebound per environment at deploy time. |
| **Connector** | Definition enabling access to an application, API, service or data source. [→](../components/05-actions-and-tools.md) |
| **DLP Policy** | Data Loss Prevention — classifies connectors into groups that cannot be combined. [→](../components/07-security-and-identity.md) |
| **Entity** | Extracts structured values — dates, numbers, locations, categories — from user text. [→](../components/02-conversation-design.md) |
| **Environment** | Isolation container with its own data, security, DLP and access. [→](../components/08-alm-and-lifecycle.md) |
| **Environment Variable** | Configuration value that changes between environments. Prevents hardcoding. |
| **Evaluation** | Curated input/expected-outcome set run repeatedly to measure agent quality. [→](../components/08-alm-and-lifecycle.md) |
| **Generative Answers** | Contextual responses synthesised from connected trusted knowledge sources. [→](../components/03-knowledge-and-grounding.md) |
| **Generative Orchestration** | Model dynamically selects knowledge, tools, topics and connected agents at runtime. [→](../components/04-orchestration.md) |
| **Grounding** | Constraining responses to trusted sources rather than model training data. |
| **Harness** | How an agent is authored, configured and executed — the runtime around the model. [→](../components/01-foundation.md) |
| **Human-in-the-Loop** | Approval step where a person authorises an action before it executes. [→](../components/05-actions-and-tools.md) |
| **Knowledge Source** | Trusted information the agent uses to ground responses. [→](../components/03-knowledge-and-grounding.md) |
| **Managed Solution** | Sealed, deployable solution package. Goes to test and prod. |
| **Memory** | Retained user context across supported interactions and sessions. [→](../components/06-multi-agent-and-memory.md) |
| **Microsoft IQ** | Enterprise knowledge layer — secure agent access to M365 data and org context. |
| **Model** | Powers the agent's reasoning, language understanding and response generation. [→](../components/01-foundation.md) |
| **Node** | Building block inside a topic: message, question, action, condition, redirect. [→](../components/02-conversation-design.md) |
| **Orchestrator Agent** | Parent agent that routes to connected child agents and owns no domain itself. |
| **Pipelines** | Power Platform native ALM for governed deployment across environments. [→](../components/08-alm-and-lifecycle.md) |
| **Power Automate Integration** | Extends agents with approvals, connectors, automation and complex workflows. [→](../components/05-actions-and-tools.md) |
| **Prompt** | Reusable AI instruction for generating, summarising, extracting or transforming. [→](../components/05-actions-and-tools.md) |
| **Publishing** | Pushing agent changes live to connected channels. [→](../components/08-alm-and-lifecycle.md) |
| **Skill** | Reusable capability enabling an agent to perform specialised tasks consistently. [→](../components/05-actions-and-tools.md) |
| **Solution** | Package of related components deployed as one unit. [→](../components/08-alm-and-lifecycle.md) |
| **System Topic** | Built-in topic: greeting, fallback, escalation, sign-in, end of conversation. |
| **Tool** | Capability letting an agent retrieve data, call a service or perform an action. [→](../components/05-actions-and-tools.md) |
| **Topic** | Structured conversation flow built for a specific intent or scenario. [→](../components/02-conversation-design.md) |
| **Topic-Based Orchestration** | Predefined topics and conversation logic for predictable interactions. [→](../components/04-orchestration.md) |
| **Trigger** | Starts agent actions or workflows when specific events occur. [→](../components/05-actions-and-tools.md) |
| **Trigger Phrase** | Example utterance that helps the agent identify which topic to activate. [→](../components/02-conversation-design.md) |
| **Unmanaged Solution** | Editable source solution. Lives in the development environment only. |
| **Variable** | Stores and reuses information across conversations and workflows. [→](../components/02-conversation-design.md) |

---

## Renames worth knowing

The product has churned names. Older material uses the left column:

| Was | Now |
|---|---|
| Power Virtual Agents | Copilot Studio |
| Bot | Agent |
| Plugin / Action | Tool |
| Copilot | Agent (in most authoring contexts) |
| Bot Framework Skill | largely superseded by Connected Agents |

If a term in an interview sounds unfamiliar, it's often an old name for something you already know. Say so — recognising the rename reads as experience.
