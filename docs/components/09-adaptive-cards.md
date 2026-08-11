# Adaptive Cards in Copilot Studio

Rich, interactive UI components inside conversations — structured input, actionable decisions, and data-driven displays.

---

## What Are Adaptive Cards?

Adaptive Cards are platform-agnostic, JSON-defined UI components rendered natively inside the host application (Teams, web chat, Outlook, etc.). Instead of plain text, your agent sends a structured card with buttons, forms, images, dropdowns, and input fields — and the host renders it in its own native style.

> **Key concept:** Adaptive Cards are NOT HTML or CSS. You define structure in JSON and the host app draws the UI. The same JSON works in Teams, Outlook, and web chat — but the final appearance differs per host because each platform controls its own rendering engine.

---

## When to Use Adaptive Cards

| Use Case | Why Cards Beat Plain Text | Example |
|---|---|---|
| Structured input collection | Single card replaces 3–5 sequential questions | IT request form: device type, urgency, description in one card |
| Actionable decisions | Buttons give clear choices without ambiguity | Approve / Reject / Ask for more info — one tap |
| Rich information display | Tables, icons, colour-coded status badges | Ticket status card with priority colour, SLA timer |
| Appointment / date booking | Date pickers prevent invalid input | Leave request with date range picker |
| Confirmation screens | Show user EXACTLY what will happen before action | Pre-submit summary card with Confirm / Cancel |
| Multi-step wizard | Break complex flows into swipeable card steps | Onboarding wizard: Day 1 tasks, IT setup, HR checklist |

---

## Card JSON Structure

### Basic Anatomy

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "🎫 Raise an IT Support Ticket",
      "weight": "Bolder",
      "size": "Medium",
      "color": "Accent"
    },
    {
      "type": "Input.Text",
      "id": "issueDescription",
      "label": "Describe your issue",
      "placeholder": "e.g. VPN not connecting since this morning",
      "isMultiline": true,
      "isRequired": true
    },
    {
      "type": "Input.ChoiceSet",
      "id": "priority",
      "label": "Priority",
      "style": "compact",
      "value": "Medium",
      "choices": [
        { "title": "🔴 High — work is blocked", "value": "High" },
        { "title": "🟡 Medium — workaround exists", "value": "Medium" },
        { "title": "🟢 Low — not urgent", "value": "Low" }
      ]
    }
  ],
  "actions": [
    { "type": "Action.Submit", "title": "Submit Ticket", "style": "positive" },
    { "type": "Action.Submit", "title": "Cancel", "style": "destructive" }
  ]
}
```

### Core Element Types

| Element | Type String | Purpose | Key Properties |
|---|---|---|---|
| Text Block | `TextBlock` | Display text | `text`, `weight`, `size`, `color`, `wrap` |
| Image | `Image` | Display image from URL | `url`, `size`, `altText` |
| Text Input | `Input.Text` | Single or multi-line text | `id`, `label`, `placeholder`, `isRequired`, `isMultiline` |
| Number Input | `Input.Number` | Numeric entry | `id`, `label`, `min`, `max`, `value` |
| Date Picker | `Input.Date` | Date selection | `id`, `label`, `min`, `max`, `value` |
| Choice Set | `Input.ChoiceSet` | Dropdown or radio buttons | `id`, `choices[]`, `style` (compact/expanded) |
| Toggle | `Input.Toggle` | On/Off switch | `id`, `title`, `value` |
| Container | `Container` | Group elements | `items[]`, `style`, `bleed` |
| Column Set | `ColumnSet` | Side-by-side layout | `columns[]` each with `items[]` |
| Action.Submit | `Action.Submit` | Submit form / send data back | `title`, `style` (positive/destructive/default) |
| Action.OpenUrl | `Action.OpenUrl` | Open a URL | `title`, `url` |
| Action.ShowCard | `Action.ShowCard` | Reveal a nested card | `title`, `card` (nested AdaptiveCard) |

---

## How Adaptive Cards Work in Copilot Studio

### Option 1 — Message Node (Display Only)

1. Open a topic in the authoring canvas
2. Add a **Message** node
3. Click `+` in the message node → choose **Adaptive Card**
4. Paste JSON (build it in [adaptivecards.io](https://adaptivecards.io) first)
5. Use the Preview pane to see how it renders

Use display-only cards for: status updates, rich confirmations, and information summaries.

### Option 2 — Question Node (Collect Input)

1. Add a **Question** node to your topic
2. In the **Identify** field, select **Adaptive Card** as the entity type
3. Paste your card JSON with `Input.*` elements
4. Each `Input` element's `id` property **automatically maps to a Topic variable** of the same name
5. On `Action.Submit`, all values are captured into variables simultaneously

```
Card Input id: "priority"          →  Variable: Topic.priority
Card Input id: "issueDescription"  →  Variable: Topic.issueDescription
Card Input id: "preferredDate"     →  Variable: Topic.preferredDate
```

> **Power move:** A single Adaptive Card with 5 input fields replaces 5 sequential Question nodes. This is the fastest way to collect structured data without interrogating the user one field at a time.

### Option 3 — Dynamic Cards (Data-Driven at Runtime)

1. Use a Power Automate flow or HTTP connector to fetch live data
2. Return the data as variables (e.g., `ticketStatus`, `assignedTo`, `lastUpdated`)
3. Use variable interpolation inside the card JSON in your Message node:

```json
{
  "type": "TextBlock",
  "text": "Ticket ${Topic.ticketId} — Status: ${Topic.ticketStatus}",
  "color": "${if(Topic.ticketStatus == 'Open', 'attention', 'good')}"
}
```

4. Card renders with live values injected at conversation time

> ⚠️ Dynamic card **refresh is not supported** — if a user reopens the chat, the card shows the original data, not updated data. Resend the card rather than refreshing in place.

---

## ⚠️ Limits & Constraints — Adaptive Cards

| Limit | Value | Notes |
|---|---|---|
| Schema version supported | Up to **1.6** (Copilot Studio) | Teams and Live Chat are limited to **v1.5** — test in target channel |
| Card payload size | **40 KB max** | Avoid large inline images or massive datasets in one card |
| `Action.Execute` support | **NOT supported in Web Chat** | Use `Action.Submit` for Web Chat channel deployments |
| Dynamic refresh | **NOT supported** | Updated content does not persist when chat is reopened |
| Unsupported elements | Typeahead, `@mentions`, Password, Sensitivity labels | Ignored or cause rendering errors |
| Channel rendering parity | Varies per host app | Teams ≠ Web Chat ≠ Mobile — test in every deployed channel |
| Responsive breakpoints | 4 (Wide, Standard, Narrow, Very Narrow) | Design for Narrow (mobile) first |
| Input validation | Client-side (`isRequired` only) | Server-side validation must be done in Power Automate or condition nodes |
| Max inputs per card | No hard limit | Practical UX limit: ~6–8 fields before card becomes overwhelming |
| Images | URL-referenced only | No base64 inline images — use hosted URLs |

---

## Channel-by-Channel Rendering

| Channel | Card Support | Action Support | Key Differences |
|---|---|---|---|
| Microsoft Teams | Full (v1.5) | Submit, OpenUrl, ShowCard | Best rendering; dark mode adaptive |
| Microsoft 365 Copilot | Full (v1.5) | Submit, OpenUrl, ShowCard | Similar to Teams; strong M365 context |
| Copilot Studio Web Chat | v1.3–1.5 | Submit, OpenUrl (**no Action.Execute**) | Test thoroughly |
| Custom Canvas | Depends on Web Chat SDK version | As configured | Set schema version explicitly |
| Voice / Telephony | **NOT SUPPORTED** | N/A | Cards completely invisible — include text fallback |
| WhatsApp | Limited — template only | Limited | Cannot use full Adaptive Card |
| Email | Static image fallback only | N/A | No interactivity |

> ⚠️ **Voice channels receive NO card rendering.** Always include a text fallback message in your Message node.

---

## Design Best Practices

**Do these:**
- Use the [Adaptive Cards Designer](https://adaptivecards.io/) to visually build and preview before pasting JSON
- Always test your card in the actual target channel — the preview pane is approximate
- Set `isRequired: true` on critical fields — catches empty submissions before they reach your flow
- Add a `Cancel` `Action.Submit` button on every form card — users need an opt-out path
- Use `Container.style = "emphasis"` to visually separate sections
- Use `ColumnSet` for 2-column layouts (label on left, value on right) for status cards
- Validate submitted data in a Condition node BEFORE passing to a flow or action

**Never do these:**
- Cramming more than 8 input fields into a single card — split into a multi-step wizard
- Using base64 inline images — severely bloats payload; use hosted URLs
- Relying on dynamic refresh — resend the card if data changes
- Assuming Teams rendering = Web Chat rendering — always test both
- Omitting a Cancel / Go Back option — users feel trapped and abandon

---

## Interview-grade summaries

**What is an Adaptive Card?**
A JSON-defined, platform-agnostic UI component that renders natively inside the host app. The host controls the visual rendering — you control the structure and data.

**When would you use a card vs a plain question node?**
When you need to collect multiple structured inputs in one turn, present a formatted status display, or provide actionable buttons (Approve/Reject). Plain question nodes for simple, single-value conversational collection.

**What's the most important schema constraint to know?**
Teams is currently capped at v1.5, and `Action.Execute` is unsupported in the default Web Chat component. Always check the host's supported schema version before designing cards.

**Fastest tool to build cards?**
[adaptivecards.io/designer](https://adaptivecards.io/designer) — visual drag-and-drop, then copy the JSON into Copilot Studio.
