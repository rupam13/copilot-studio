# 3. Knowledge & Grounding

**Components:** Knowledge Sources · Generative Answers

Most agent quality problems that get blamed on "the model" are grounding problems. This page is where you fix them.

---

## Knowledge Sources

Trusted information the agent uses to ground its responses. Typical sources:

| Source | Good for | Watch out for |
|---|---|---|
| **SharePoint / OneDrive** | Policies, SOPs, internal docs | Permissions are enforced per user — results vary by who's asking |
| **Public websites** | Product docs, published FAQs | Crawl freshness; noisy nav and boilerplate pollute results |
| **Uploaded files** | Small, stable reference sets | No auto-refresh — you're now maintaining a copy |
| **Dataverse** | Structured business records | Great for records, poor for prose |
| **Connector-based enterprise sources** | Systems of record | Requires connection + auth setup |

### Grounding rules that actually move quality

**1. Curate ruthlessly.** Pointing at an entire SharePoint site is the most common mistake in the product. The retrieval layer surfaces what's *similar*, not what's *correct* — feed it drafts, superseded policies and meeting notes and it will confidently cite them. Point at a curated library.

**2. Structure documents for retrieval.** Retrieval works on chunks. A 90-page PDF with no headings chunks badly and returns fragments without context. What helps:
- Real headings, meaningful section titles
- Self-contained sections — a chunk should make sense alone
- Tables converted to text where possible
- One topic per document rather than an omnibus handbook

**3. Kill the duplicates.** Three versions of the same policy means the agent picks one, and it won't be the one you'd pick. Version control is a grounding requirement, not a nice-to-have.

**4. Permissions are inherited, and that's a feature.** SharePoint-grounded answers respect the asking user's access. This is what makes the agent safe to deploy broadly — but it also means *your* testing doesn't reflect *their* experience. Test as a low-privilege user before you go live.

**5. Freshness is a design decision.** Uploaded files are a point-in-time snapshot. Live sources update themselves. Choose deliberately and document which is which.

### ⚠️ Limits & Constraints — Knowledge Sources

| Limit | Value | Notes |
|---|---|---|
| Knowledge sources per agent | **500** | All types combined |
| Uploaded file size | **512 MB** per file | Lower for SharePoint without M365 Copilot licence (see below) |
| SharePoint file size (no M365 Copilot licence) | **~7 MB** | Memory constraint; larger files fail to process |
| SharePoint site URLs | **25 per agent** | When using generative orchestration |
| Supported file formats | DOCX, PPTX, PDF, XLSX, TXT, CSV, MD, JSON | Password-protected or sensitivity-labelled files are **not** indexed |
| SharePoint sync freshness | **Every 4–6 hours** | Manual uploads are static — re-upload when content changes |
| Retrieval depth per query | **Top 3–5 chunks** | Not designed to scan entire libraries; chunk and focus your sources |
| Connector payload (public cloud) | **5 MB** | GCC plans limited to 450 KB |

> **Common failure:** pointing at an entire SharePoint site rather than a curated library causes the retrieval layer to surface drafts, superseded versions and noise. Scope tightly.

---

## Generative Answers

Generative answers produce a contextual response synthesised from connected, trusted sources — rather than returning a document link or a scripted reply.

**What you can control:**

- Which sources are in scope for a given agent or topic
- Whether the agent may fall back to general model knowledge (in enterprise settings: usually **no**)
- Response tone and length via instructions
- Whether citations are surfaced (in most enterprise contexts: **yes** — it's how users self-verify and how you debug)

### The single most important setting

**Disable general-knowledge fallback for enterprise agents.** With it on, when your knowledge sources have no answer, the model answers from training data. It sounds authoritative and it's about your competitor's product, or a policy that isn't yours. With it off, the agent says it doesn't know — which is the correct, trustworthy behaviour.

"I don't have information on that, try #it-help" beats a fluent wrong answer every single time.

### Debugging bad answers

Work through this in order — the cause is almost never further down than step 3:

1. **Is the source content correct and current?** Read what the agent read.
2. **Is the right document even in scope?** Check whether retrieval surfaced it at all.
3. **Does the document chunk well?** Long unstructured files return context-free fragments.
4. **Are there conflicting versions?** Retire the old ones.
5. **Are instructions fighting the source?** An instruction to "be helpful and give a complete answer" pushes the model to fill gaps.
6. **Is general-knowledge fallback on?** Turn it off.
7. *Only now* consider the model.

### ⚠️ Limits & Constraints — Generative Answers

| Limit | Value | Notes |
|---|---|---|
| Prompt customisation field | **8,000 chars** | Same cap as agent instructions |
| Knowledge sources in scope | Up to agent limit (500) | Scoping to fewer improves precision |
| General-knowledge fallback | Off by default for enterprise | Explicit setting — verify before deploying |
| Response generation time | **2–10 seconds** | Increases with number of sources and complexity |
| Citation support | Configurable | Off by default on some channels; turn on for enterprise trust |
| Unsupported content types | Password-protected, sensitivity-labelled docs | These are silently skipped — no error shown to user |

---

## Grounding vs Tools — a distinction people blur

| | Knowledge Sources | Tools |
|---|---|---|
| Purpose | Answer *what is* | Do something / fetch live data |
| Data shape | Documents, prose | Structured, transactional |
| Freshness | As fresh as the source | Real-time |
| Example | "What's the travel policy?" | "What's my remaining leave balance?" |

The leave-balance question cannot be answered by grounding. It needs a tool hitting the HR system. If your agent is answering live-data questions from documents, it is confidently wrong.

---

## Interview-grade summaries

> **How do you reduce hallucination in Copilot Studio?**
> Curate and scope knowledge sources tightly, disable general-knowledge fallback, structure documents so they chunk well, remove duplicate and superseded content, surface citations, and use topics or agent flows for anything consequential. Model choice is the last lever, not the first.

> **A user gets an answer citing a document they shouldn't see. What happened?**
> They shouldn't — SharePoint grounding enforces the user's own permissions. Either the document permissions themselves are wrong, or the content was uploaded as a file (which loses source permissions) rather than connected as a live source.

> **When do you ground vs when do you call a tool?**
> Ground for stable knowledge; call a tool for live, user-specific or transactional data. Balances, statuses and records always need a tool.

---

**Next:** [Orchestration →](04-orchestration.md)
