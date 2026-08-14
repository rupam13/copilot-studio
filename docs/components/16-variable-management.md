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

## 🔀 4. Passing Variables Between Topics (In & Out)

**Video Reference:** [Master Topic Variables (In & Out) with Real Examples](https://www.youtube.com/watch?v=BUJ1y_on_Jc)

To avoid polluting the Global variable scope, you should use **In** and **Out** variables to pass data between modular topics. For example, a "Collect Customer Details" topic can gather an email and return it to the "Order Status" topic.

**STEP T-1 — Set up an "In" Variable (Receive Value)**
If a topic *needs* data from the outside to function, you configure an In variable.
```
• Open the variable properties pane for a specific Topic variable (e.g., Topic.UserEmail)
• Check the box for: Receive values from other topics
□ Verify: The variable is now an "In" variable. When another topic redirects to this one, it will prompt you to pass a value for Topic.UserEmail.
```

**STEP T-2 — Set up an "Out" Variable (Return Value)**
If a topic's job is to collect or calculate data and hand it back, you configure an Out variable.
```
• Open the variable properties pane for a specific Topic variable (e.g., Topic.CollectedPhone)
• Check the box for: Return values to original topics
□ Verify: The variable is now an "Out" variable. When this topic finishes and redirects back to the caller, the caller can capture the value of Topic.CollectedPhone.
```

---

## 🔄 5. Passing Variables to Power Automate

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

## 🛡️ 6. Handling Sensitive Data (PII/Tokens)

If you are storing passwords, social security numbers, or OAuth tokens in variables, you must prevent them from being exposed in transcripts or Application Insights.

**STEP S-1 — Use Secure Data Handling**
```
• In Copilot Studio, you cannot natively "mask" a variable in the UI yet.
• Best Practice: DO NOT pass highly sensitive data back to the bot if possible. Keep the sensitive data processing entirely within the Power Automate flow (e.g., the flow looks up the SSN and processes the claim, returning only a generic "Success" boolean to the bot).
• If using Entra ID SSO, tokens are handled via the OAuth Prompt and securely exchanged without saving the raw JWT string to a visible bot variable.
```

---

## ⚡ 7. Power Fx in Detail

Power Fx is the low-code language used across the Power Platform. In Copilot Studio, it allows you to manipulate strings, calculate dates, evaluate complex logic, and work with arrays without calling an external Power Automate flow.

### A. String Manipulation
When you need to clean up user input or format a response:
*   **`Concatenate(text1, text2)`**: Joins strings together. Example: `Concatenate("Hi ", Topic.UserName, "!")`
*   **`Lower(text) / Upper(text)`**: Converts text casing.
*   **`Trim(text)`**: Removes leading/trailing spaces.
*   **`Substitute(text, oldText, newText)`**: Replaces parts of a string. Example: `Substitute(Topic.Email, "@gmail.com", "")`
*   **`Split(text, separator)`**: Converts a string into a Table (array) based on a separator.

### B. Date & Time
Working with dates is extremely common for booking and scheduling agents:
*   **`Now()`**: Returns the current date and time.
*   **`Today()`**: Returns the current date (time is midnight).
*   **`DateAdd(date, value, unit)`**: Adds or subtracts time. Example: `DateAdd(Today(), 7, TimeUnit.Days)` (Next week).
*   **`DateDiff(start_date, end_date, unit)`**: Finds the difference between two dates.
*   **`Text(date, "format")`**: Formats a date into a readable string. Example: `Text(Now(), "dd-mm-yyyy hh:mm")`

### C. Logic and Conditions
Used heavily in "Condition" nodes and setting variables based on rules:
*   **`If(condition, true_value, false_value)`**: Basic conditional branching. Example: `If(Topic.Age >= 18, "Adult", "Minor")`
*   **`IsBlank(value)`**: Checks if a variable is empty or null. Crucial for checking if an API returned data.
*   **`Coalesce(value1, value2)`**: Returns the first non-blank value. Useful for fallbacks: `Coalesce(Topic.ProvidedEmail, Global.AccountEmail)`
*   **`Switch(value, match1, result1, match2, result2, default)`**: Evaluates a single value against multiple matches.

### D. Table (Array) Manipulation
When an API returns a list of items (like a list of flights or tickets):
*   **`First(table)`**: Gets the first record in an array.
*   **`Last(table)`**: Gets the last record.
*   **`CountRows(table)`**: Returns the number of items in the array.
*   **`Index(table, row_number)`**: Gets a specific row by its index number.
*   **`Filter(table, condition)`**: Returns a new array with only the items that match the condition. Example: `Filter(Topic.Tickets, status = "Open")`

### E. Type Conversion & JSON
*   **`Value(text)`**: Converts a string number ("42") into an actual Number type.
*   **`Text(number)`**: Converts a number into a string.
*   **`ParseJSON(json_string)`**: Converts a raw JSON string into an untyped object that can be queried with dot notation (note: the 'Parse value' node is generally preferred for strongly-typed records).

> **Best Practice:** Keep Power Fx formulas in Copilot Studio relatively simple. If you find yourself writing a 20-line nested `If()` statement with complex array mapping, it is usually better to offload that logic to a Power Automate flow or an Azure Function, as debugging massive Power Fx formulas inside the Copilot Studio canvas can be difficult.

---

**Back to:** [Component Reference](README.md)
