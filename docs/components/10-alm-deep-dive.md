# ALM — Application Lifecycle Management (Deep Dive)

End-to-end governance: from an idea on a developer's screen to a production-grade, versioned, audited agent.

---

## What Is ALM in Copilot Studio?

*Video Reference: [Copilot Studio | Application Lifecycle Management (ALM) (Part - 16)](https://www.youtube.com/watch?v=3TK_J5H3W9s)*

ALM is the complete discipline of managing how your agent travels from development to production in a controlled, repeatable, auditable way. In Copilot Studio, ALM is built on Power Platform primitives: **Environments**, **Solutions**, **Connection References**, **Environment Variables**, and **Pipelines**.

### The Four ALM Commandments

1. **Always build inside a Solution** — never the default solution
2. **Always use separate environments** — Dev → Test → Prod (never skip this)
3. **Never manually edit production** — changes flow through pipelines only
4. **Always use Connection References and Environment Variables** — zero hardcoding

Violating any of these is not a shortcut. It is debt you will pay at the worst possible moment.

---

## Environment Architecture

### Standard 4-Environment Topology

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DEVELOPMENT   │───▶│    TEST / QA    │───▶│  STAGING / UAT  │───▶│   PRODUCTION    │
│                 │    │                 │    │                 │    │                 │
│ • Makers build  │    │ • Auto-deploy   │    │ • Business UAT  │    │ • Locked down   │
│ • Unmanaged sol │    │ • Managed sol.  │    │ • Prod-like     │    │ • Managed sol.  │
│ • Loose DLP     │    │ • Prod-like DLP │    │ • Approval gate │    │ • Strict DLP    │
│ • Test data     │    │ • Synthetic data│    │ • Real data     │    │ • Real data     │
│ • No approval   │    │ • Auto gate     │    │ • Manual gate   │    │ • Full approval │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
      [Pipeline Host Environment — dedicated environment for pipeline management]
```

### Environment Setup Steps

**STEP ENV-01 — Create the Development Environment**
- Go to `admin.powerplatform.microsoft.com` → Environments → +New
- Type: **Sandbox** | Region: match production region | **Dataverse: Yes**
- DLP: permissive (all standard connectors in Business class)
- Access: all makers on your team
- Purpose: "Development and initial testing — NO production data"

**STEP ENV-02 — Create the Test/QA Environment**
- Type: **Sandbox** | Dataverse: Yes | Enable **Managed Environments: ON**
- DLP: **match production DLP** — this is your dress rehearsal
- Access: QA engineers + select makers for smoke testing
- Data: synthetic/anonymised data that mirrors production shape
- Solution Checker enforcement: **ON** (blocks deployment if warnings exist)

**STEP ENV-03 — Create the Production Environment**
- Type: **Production** | Dataverse: Yes | **Managed Environments: ON**
- DLP: maximum — every connector classification reviewed and justified
- Access: end users (Environment User role); **NO maker access**
- Admins: System Admin role only, documented, minimum 2 people
- Backup: enable **point-in-time restore (PITR)** — 1–28 day retention

---

## Solutions — Building the Package

### What Goes In a Solution

| Component | Include? | Notes |
|---|---|---|
| Copilot Studio Agent | ✅ Yes | Core component — all topics, entities, variables |
| Power Automate Flows | ✅ Yes | All flows called by the agent |
| Connection References | ✅ Yes — **MANDATORY** | Without these, connections break in every new environment |
| Environment Variables | ✅ Yes — **MANDATORY** | Without these, all config is hardcoded |
| Custom Connectors | ✅ Yes | If you built a custom connector for your API |
| Dataverse Tables | ✅ Yes (if custom) | Custom tables your agent reads/writes |
| SharePoint content | ❌ No | Not packageable — reference via Environment Variable (site URL) |
| Connections (auth instances) | ❌ **Never package** | Environment-specific; re-establish via connection references post-deploy |
| Channel configurations | ⚠️ Partial | Some settings travel; re-verify publishing channels after each deployment |

### Step-by-Step: Build Your ALM-Ready Solution

**STEP SOL-01 — Create a Custom Publisher**
```
Power Platform maker portal → Solutions → Publishers → +New Publisher
• Display name: your org/team (e.g. "Contoso IT")
• Prefix: 3–5 lowercase chars (e.g. "cit") — prefixes all your components
• NEVER use the "Default Publisher" — its "cr" prefix is shared tenant-wide
```

**STEP SOL-02 — Create the Unmanaged Solution**
```
Solutions → +New Solution
• Name: descriptive (e.g. "Contoso IT Support Agent")
• Publisher: your custom publisher from SOL-01
• Version: 1.0.0.0 (increment meaningfully: Major.Minor.Build.Revision)
• This is your UNMANAGED solution — lives in Dev only
```

**STEP SOL-03 — Build the Agent INSIDE the Solution**
```
From within the solution: +New → Agent
• NOT from the home page — that creates the agent outside any solution
• All subsequent components (flows, tables) must also be created inside this solution
• Use Solutions > "Add existing" to pull in pre-existing components
```

**STEP SOL-04 — Add All Connection References**
```
Solution → +New → More → Connection Reference
• Name it descriptively: "SharePoint - IT KB Site Connection"
• Select the connector type (SharePoint, Dataverse, etc.)
• Do NOT bind an actual connection here — that is environment-specific
• In each flow, reference this connection reference instead of a direct connection
```

**STEP SOL-05 — Add All Environment Variables**
```
Solution → +New → Environment Variable
• Type: Text (for URLs, IDs); Secret (for API keys — stored in Azure Key Vault)
• Set Current Value only in Dev — leave blank in the solution package
• Test/Prod admins set values in their environments after deployment

Variables you should ALWAYS have:
  - SharePoint_SiteURL         (Text)
  - ITSM_BaseURL               (Text)
  - ApproverEmail              (Text)
  - TicketSystemApiKey         (Secret)
```

**STEP SOL-06 — Export the Solution**
```
Solutions → select your solution → Export Solution
• Export type: MANAGED (for Test, UAT, Prod) | UNMANAGED (for source control)
• Run Solution Checker before export: Solutions → Solution Checker → Run
  - Errors: must fix before proceeding
  - Warnings: review and document if acceptable
• Download the .zip file — this is your deployable artifact
```

---

## Power Platform Pipelines — Automated Deployment

### Setting Up Pipelines

**STEP PIPE-01 — Create the Pipeline Host Environment**
```
• Create a dedicated environment just for hosting pipelines
• Enable Dataverse, install "Power Platform Pipelines" app from AppSource
• Admins manage all pipeline configurations from this host environment
```

**STEP PIPE-02 — Define the Pipeline**
```
Open Pipelines app in host environment → +New Pipeline
• Name: "IT Support Agent Pipeline"
• Linked Development Environment: your Dev environment
• Add Deployment Stages in order:
    Stage 1: Test/QA   → target = Test environment
    Stage 2: UAT       → target = UAT environment (optional)
    Stage 3: Production → target = Prod environment
```

**STEP PIPE-03 — Configure Approval Gates**
```
For Production stage: enable Pre-deployment approval
• Configure approvers: team lead / solution owner / change advisory board
• Optional: trigger a Power Automate flow on approval request
    - Flow sends Teams notification to approver
    - Approver reviews change log, approves or rejects with reason
    - Rejection captured in pipeline history with reason documented
• Set deployment window: e.g., "only during business hours on weekdays"
```

**STEP PIPE-04 — Run a Deployment**
```
Dev environment: Solutions → select solution → Pipelines → Deploy here
• Select target stage (Test)
• Fill in environment-specific values (connection references + env variable values)
• Pipeline exports managed solution from Dev and imports to Test automatically
• Deployment history recorded: who deployed, when, what version, approval trail
```

**STEP PIPE-05 — Post-Deployment Verification**
```
□ Connections re-established in target environment
□ Environment variable values set correctly for this environment
□ Agent channel publishing re-verified (Teams app ID, web embed script)
□ Authentication configuration verified (Entra app registration correct)
□ Run smoke test from evaluation set in target environment
□ Check flow run history — confirm flows execute without errors
□ Verify DLP policy compliance — no blocked connectors
```

---

## Source Control Integration (Git + Azure DevOps / GitHub)

### Three Approaches

| Approach | Tools | When to Use | Effort |
|---|---|---|---|
| Pipelines only | Pipelines app | Small teams, no existing DevOps setup | Low |
| Pipelines + Git (PAC CLI) | PAC CLI + Azure DevOps / GitHub | Dev teams, mandatory Git, CI/CD gates | Medium |
| Full CI/CD pipeline | GitHub Actions / ADO YAML + PAC CLI | Enterprise, automated testing, multi-team, strict audit | High |

### PAC CLI — Key Commands

```bash
# Install Power Platform CLI
winget install Microsoft.PowerPlatformCLI

# Authenticate to your environment
pac auth create --environment https://yourorg.crm.dynamics.com

# Clone (export) solution as YAML source files
pac solution clone --name YourSolutionName --outputDirectory ./src

# After editing locally, pack back into a solution zip
pac solution pack --zipfile ./artifacts/AgentSolution.zip --folder ./src

# Import (deploy) to target environment
pac solution import --path ./artifacts/AgentSolution.zip --activate-plugins

# Run Solution Checker from CLI
pac solution check --path ./artifacts/AgentSolution.zip
```

> When you `pac solution clone`, Copilot Studio topics are exported as **YAML files**. Each topic = one `.yaml` file. Topic changes are Git-diffable — you can see exactly what changed between versions in a pull request.

---

## Versioning Strategy

| Version Type | When to Increment | Example | Notes |
|---|---|---|---|
| **MAJOR** (x.0.0.0) | Breaking changes: restructured topics, removed capabilities, auth changes | 1.0.0.0 → 2.0.0.0 | Always requires full UAT cycle before production |
| **MINOR** (1.x.0.0) | New features: new topics, new tools, new knowledge sources | 1.0.0.0 → 1.1.0.0 | Should go through Test → UAT → Prod |
| **BUILD** (1.1.x.0) | Bug fixes, phrasing improvements, instruction tweaks | 1.1.0.0 → 1.1.1.0 | Can fast-track with expedited review if regression risk is low |
| **REVISION** (1.1.1.x) | Emergency hotfixes only | 1.1.1.0 → 1.1.1.1 | Document the emergency; review process after the fix |

---

## ⚠️ Limits & Constraints — ALM

| Limit | Value | Notes |
|---|---|---|
| Environments per tenant | Limited by licence | Sandbox count limited by Power Platform capacity add-ons |
| Default environment | Shared, permissive DLP | **Never** build production agents here |
| Managed solution edit in test/prod | **BLOCKED** | Any change must go through dev; no direct prod editing |
| Connection references | Required per connector | Missing = deployment failure in new environment |
| Environment variable types | Text, Number, Boolean, JSON, Secret | Secret type uses Azure Key Vault |
| Pipeline deployment history | Retained in host environment | Audit log of every deployment: who, when, what version, approved by |
| PAC CLI solution unpack format | YAML | Each topic = one file — enables Git diff per topic |
| Cross-tenant deployment | Not native | Requires manual solution export/import or CI/CD pipeline |
| Rollback mechanism | Solution version restore | Re-import previous managed solution version to revert |

---

## Deployment Checklists

### Pre-Deployment Checklist
```
□ Solution version number incremented correctly
□ Solution Checker run — all errors resolved, warnings documented
□ All new connections have a Connection Reference in the solution
□ All new config values have an Environment Variable in the solution
□ Change log written: what changed, why, what was tested
□ Evaluation set run in Test environment — pass rate ≥ baseline
□ UAT sign-off received from business owner (documented)
□ Deployment time window confirmed (avoid peak hours)
□ Rollback plan ready: previous solution version saved and accessible
□ Post-deploy verification checklist assigned to someone
□ Stakeholders notified of planned deployment and expected downtime
```

### Post-Deployment Checklist
```
□ All connections re-established in production environment
□ All environment variables set to production values
□ Agent publishing channels verified (Teams app, web embed)
□ Authentication config verified (SSO, OAuth tokens)
□ Smoke test run: top 5 user flows tested by deployment team
□ Flow run history checked — no errors in first 30 minutes
□ Analytics baseline reset (mark deployment in analytics)
□ On-call person identified for the next 2 hours post-deploy
□ Deployment recorded in change log with actual completion time
```

---

## Interview-grade summaries

**"How do you take an agent to production?"**
> Solution-first from day one in a dedicated dev environment — never the default environment. Connection references and environment variables for everything environment-specific. Export managed, deploy through Power Platform Pipelines with approval gates into test then prod. No manual edits in production, ever. Evaluation set run at each stage against a baseline, and a rollback path via solution versioning.

**"What is a Connection Reference?"**
> A solution component that lets a connection be rebound to the correct authenticated instance per environment at deploy time. Without connection references, every deployment breaks connections and requires manual reconfiguration. With them, it is a configuration step, not rework.

**"What is the difference between a managed and unmanaged solution?"**
> Unmanaged is the editable source — lives in the development environment only. Managed is the sealed, deployable package — imported into test and prod. Components in a managed solution are read-only in the target environment. Nobody edits production directly — that is the entire point of a managed solution.
