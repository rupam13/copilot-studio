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

## ⚡ 3. The Variable Management Nodes

Copilot Studio provides specific authoring nodes under the **Variable management** menu to handle memory. Here is how to use each one:

**NODE: Set a variable value**
```
• Add node: Variable management → Set a variable value
• Create a new variable (e.g., Topic.UserName) or select an existing one
• Assign a value:
  - Text: Directly type a string (e.g., "John Doe")
  - Formula: Click the 'fx' icon to write Power Fx (e.g., Concatenate("Hello, ", Global.UserName))
  - Reference: Select another variable to copy its value
```

**NODE: Parse value (Parse JSON)**
When you call an HTTP endpoint or Power Automate flow that returns a stringified JSON payload, the bot sees it as flat text. You must parse it into a Record so the bot can read the properties.
```
• Add node: Variable management → Parse value
• 'Value to parse': Select the string variable containing the JSON (e.g., Topic.API_Response_String)
• 'Data type': Click 'From sample data' and paste a sample of your JSON. The platform will automatically generate the schema.
• 'Save as': Save the output as a new Record variable (e.g., Topic.ParsedRecord)
□ Verify: You can now access properties using dot notation: Topic.ParsedRecord.customer.email
```

**NODE: List management**
If you have an array of items (like a list of recent support tickets), you can manipulate it using the List management node without writing complex Power Fx.
```
• Add node: Variable management → List management
• Choose an operation:
  - 'Add item to list': Appends a new item to an existing array
  - 'Remove item from list': Removes a specific item
  - 'Clear list': Empties the array
• Select your target Table/Array variable (e.g., Topic.TicketList)
• Provide the item to add/remove
```

**NODE: Clear all variable values**
Sometimes you need to reset the conversation completely (e.g., the user clicks "Start Over" or finishes a transaction).
```
• Add node: Variable management → Clear all variable values
• This node instantly wipes all 'Topic' and 'Global' variables in the current session.
• WARNING: Be careful using this in the middle of a flow, as it will destroy authentication tokens stored in Global variables, forcing the user to log in again!
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
