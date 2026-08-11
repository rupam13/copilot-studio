# 7. Security & Identity

**Components:** Authentication · Security & Governance

The layer that decides whether your agent gets deployed or gets a polite "not yet" from the security review. Build it in from the start — retrofitting governance is miserable.

---

## Authentication

Verifies users and controls secure access to agents and resources.

### Modes

| Mode | Behaviour | Use for |
|---|---|---|
| **No authentication** | Anyone with the link | Public FAQ agents, genuinely non-sensitive |
| **Authenticate with Microsoft** | Entra ID sign-in | Internal agents — the default for enterprise |
| **Manual / custom OAuth 2.0** | Your identity provider | External customers, B2C, non-Microsoft IdP |

### The identity question that matters most

When the agent calls a downstream system, **whose identity does it use?**

**User context (delegated).** The agent acts as the signed-in user. They see only what they're entitled to see. Permissions are enforced by the source system, which means you inherit years of access governance for free.
→ Use for: anything touching personal, HR, financial or record-level data.

**Service context (maker / connection owner).** The agent acts as a single service identity. Every user gets identical access.
→ Use for: shared reference data, public catalogues, aggregate reporting.
→ **Danger:** used carelessly, this is how an agent shows every employee the salary spreadsheet. If you're using service context over sensitive data, you must implement your own filtering — and you will get it wrong at least once.

**Default to user context.** Deviate only with a written reason.

### Single sign-on

SSO removes the sign-in prompt inside Teams and M365 Copilot, where the user is already authenticated. Worth configuring — an auth prompt inside Teams reads as broken to users and measurably suppresses adoption.

### Auth design notes

- Handle the failure path explicitly. Expired tokens and revoked consent produce confusing dead-ends unless you author the message.
- Never put credentials or tokens in variables, instructions or logs.
- Sensitive variables should be cleared once the flow needing them completes.
- Test as a low-privilege user. Testing as yourself, an environment maker, tells you almost nothing about what a normal user experiences.

### ⚠️ Limits & Constraints — Authentication

| Limit | Value | Notes |
|---|---|---|
| Auth modes available | 3 (None, Microsoft, Manual OAuth 2.0) | "None" is public access; only use for truly non-sensitive bots |
| SSO availability | Teams + M365 Copilot only | Not available in all channels; auth prompt appears in others |
| Token expiry handling | Must be authored explicitly | Expired tokens and revoked consent produce dead-ends with no default user message |
| Per-user vs service identity | Design decision, not default | Defaulting to service (maker) context over sensitive data = data exposure incident |
| OAuth 2.0 PKCE | Supported | Recommended for custom auth; implicit flow deprecated |
| Conditional Access enforcement | Via Entra ID | Configure in Power Platform admin center; not in Copilot Studio directly |

---

## Security & Governance

Manage permissions, policies, compliance requirements and organisational controls.

### The control surface

**Data Loss Prevention (DLP) policies**
Classify connectors as Business, Non-Business or Blocked. Connectors in different groups cannot be combined in the same flow or agent. This is the primary mechanism preventing an enterprise data source from being wired to an unapproved external destination. DLP is set at tenant or environment level by an admin — makers work inside it.

**Environment strategy**
Environments are the primary isolation boundary: separate data, separate DLP, separate access. See [ALM](08-alm-and-lifecycle.md).

**Role-based access**
Distinguish makers (build), users (consume), owners (control) and admins (govern). Least privilege on each.

**Sharing controls**
Who can share an agent, and with whom. Uncontrolled sharing is how a departmental prototype becomes a tenant-wide dependency nobody owns.

**Audit and monitoring**
Activity flows into the Microsoft Purview audit log. Know what's captured before someone asks you to produce it under pressure.

**Content controls**
Cross-tenant restrictions, allowed channel list, moderation settings, and whether general model knowledge may be used.

### Responsible AI in practice

Not a policy PDF — a set of build decisions:

- **Transparency.** Users are told they're talking to an AI agent. Non-negotiable.
- **Citations on.** Users can verify claims; you can debug them.
- **Confident refusal.** "I don't know, here's who does" is a designed behaviour, not a failure. Build it.
- **Human-in-the-loop on consequence.** Anything with money, employment, access or external communication gets an approval step.
- **Escalation always available.** The user must be able to reach a person. Always.
- **Bias and fairness testing.** Especially where agents touch hiring, credit, benefits or eligibility.
- **Feedback loop.** Users must be able to report a bad answer, and someone must actually read those reports.

### Governance checklist before production

```
□ Authentication mode chosen and justified in writing
□ User context used wherever data is user-specific
□ DLP policy reviewed for every connector in use
□ Least-privilege service accounts where service context is used
□ Knowledge sources permission-tested as a low-privilege user
□ Sharing scope defined and locked
□ Audit logging verified as capturing what's needed
□ Data residency and retention confirmed
□ Human escalation path implemented and tested
□ AI disclosure present in the greeting
□ Feedback mechanism live with a named owner
□ Named owner for the agent itself, documented
□ Decommission plan (nobody ever writes this — write it)
```

### ⚠️ Limits & Constraints — Security & Governance

| Limit | Value | Notes |
|---|---|---|
| DLP policy scope | Tenant or environment level | Makers cannot override; connectors in different DLP groups cannot combine |
| DLP connector groups | Business / Non-Business / Blocked | An enterprise source + an external service = blocked if in different groups |
| Audit log retention | Microsoft Purview policy | Configure before deployment; cannot retroactively capture what wasn't logged |
| Sharing controls | Admin-configurable | Uncontrolled sharing turns a prototype into a tenant-wide dependency with no owner |
| Rate limit enforcement | **50–8,000 RPM** (plan-dependent) | Exceeded quota = users see failure notice; no graceful degradation by default |
| Message packs (1–10) | 50 RPM / 1,000 RPH | Lowest capacity tier |
| Message packs (11–50) | 80 RPM / 1,600 RPH | Mid capacity |
| Message packs (51–150) | 100 RPM / 2,000 RPH | Higher capacity |
| Licensing currency (from Sep 2025) | **Copilot Credits** | Replaces "messages"; consumed per orchestration turn, knowledge retrieval, and action call |

---

## Interview-grade summaries

> **How do you make sure an agent doesn't expose data users shouldn't see?**
> Authenticate with Entra ID and use user-context (delegated) connections so downstream systems enforce their own permissions. Ground on SharePoint sources, which honour per-user access. Apply DLP policies to restrict connector combinations. Then test as a low-privilege user, because testing as a maker proves nothing.

> **What are DLP policies for?**
> They classify connectors into Business, Non-Business and Blocked groups and prevent connectors from different groups being combined in one agent or flow — stopping enterprise data from being wired to unapproved destinations. Set at tenant or environment level.

> **How do you deploy AI responsibly at scale?**
> Disclosure that it's AI, grounded answers with citations, general-knowledge fallback off, human-in-the-loop on consequential actions, an always-available escalation path, least-privilege access, DLP enforcement, audit logging, and a named owner with a feedback loop that someone reads.

---

**Next:** [Lifecycle & Operations →](08-alm-and-lifecycle.md)
