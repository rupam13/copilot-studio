# 16. Variable Management & Power Fx

In Copilot Studio, variables are the memory of your agent. They store user inputs, API responses, and calculated values so your bot can maintain context and have intelligent, multi-turn conversations.

Understanding how to scope, type, and manipulate variables (especially using Power Fx) is critical for building enterprise-grade agents.

---

## 📦 1. Variable Scopes

The "scope" of a variable determines where and how long the data is accessible.

| Scope Type | Prefix | Description | When to Use |
| :--- | :--- | :--- | :--- |
| **Topic (Local)** | `Topic.` | Only exists while the current topic is running. Once the topic ends, the memory is cleared. | Storing temporary data like a confirmation `Topic.IsConfirmed` or a temporary API response. |
| **Global (Bot)** | `Global.` | Exists across all topics for the duration of the user's session. | Storing user context like `Global.UserName`, `Global.AccountTier`, or authentication tokens. |
| **System** | `System.` | Pre-defined variables provided by Copilot Studio natively. | Accessing `System.Activity.ChannelId` to see if the user is on Teams vs. Web, or `System.Conversation.Id`. |

> **Best Practice:** Default to using `Topic` variables. Only use `Global` variables when multiple distinct topics need access to the exact same piece of data. Overusing Global variables can lead to confusing state bugs where old data pollutes a new conversation.

---

## 🔠 2. Variable Data Types

Copilot Studio is strongly typed, meaning a variable must know what kind of data it holds. 

*   **String (Text):** `"John Doe"`
*   **Number:** `42`
*   **Boolean:** `true` or `false`
*   **Record (Object):** A complex JSON-like object with properties. ` { Name: "John", Age: 30 } `
*   **Table (Array):** A list of items or records. ` [ "Apple", "Banana" ] ` or ` [ { ID: 1 }, { ID: 2 } ] `

---

## ⚡ 3. Manipulating Data with Power Fx

Copilot Studio uses **Power Fx** (the same formula language used in Excel and Power Apps) to manipulate variables. You can write formulas directly in the "Set Variable Value" node.

### Common Power Fx Scenarios in Copilot Studio

**STEP V-1 — String Concatenation & Manipulation**
```powerapps-dot
• Combine text: 
  Concatenate("Hello, ", Global.UserName, ". How can I help?")
• Make uppercase: 
  Upper(Topic.UserCity)
```

**STEP V-2 — Math & Logic**
```powerapps-dot
• Calculate a discount: 
  Topic.OrderTotal * 0.85
• Check if an array is empty: 
  IsEmpty(Topic.List_of_Tickets)
```

**STEP V-3 — Parsing JSON into a Record**
If you call an HTTP node or Power Automate flow that returns a stringified JSON payload, you must parse it before the bot can read the properties.
```powerapps-dot
• Parse JSON:
  ParseJSON(Topic.API_Response_String)
• Access a property of that record:
  Topic.ParsedRecord.customer.email
```

---

## 🔄 4. Passing Variables to Power Automate

When your agent needs to take action (like creating a ticket in ServiceNow), you pass variables as inputs to a Power Automate Cloud Flow.

**STEP A-1 — Sending Data to a Flow**
```
• Add node: "Call an action" → Create a flow
• In the Power Automate trigger, define your inputs (e.g., Text input: ticketDescription)
• In Copilot Studio, map your variable (e.g., Topic.UserIssue) to that input
```

**STEP A-2 — Receiving Data from a Flow**
```
• In Power Automate, use the "Return value(s) to Copilot Studio" action
• Define the output (e.g., String: ticketNumber)
• In Copilot Studio, the flow node will output a new variable (e.g., Topic.ticketNumber) which you can immediately use in a message node: "Your ticket number is {Topic.ticketNumber}"
```

---

## 🛡️ 5. Handling Sensitive Data (PII/Tokens)

If you are storing passwords, social security numbers, or OAuth tokens in variables, you must prevent them from being exposed in transcripts or Application Insights.

**STEP S-1 — Use Secure Data Handling**
```
• In Copilot Studio, you cannot natively "mask" a variable in the UI yet.
• Best Practice: DO NOT pass highly sensitive data back to the bot if possible. Keep the sensitive data processing entirely within the Power Automate flow (e.g., the flow looks up the SSN and processes the claim, returning only a generic "Success" boolean to the bot).
• If using Entra ID SSO, tokens are handled via the OAuth Prompt and securely exchanged without saving the raw JWT string to a visible bot variable.
```

---

**Back to:** [Component Reference](README.md)
