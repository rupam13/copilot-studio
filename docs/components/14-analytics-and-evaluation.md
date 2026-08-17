# 14. Analytics, Monitoring & Evaluation

**Video Reference:** [Copilot Studio | Analytics, Application Insights Monitoring and Evaluation (Part - 15)](https://www.youtube.com/watch?v=NjQ-2xcqvl8)

This guide covers how to monitor your agent in production and systematically evaluate its quality when making changes.

---

## 📊 1. Built-in Analytics (The "Monitor" Section)

The built-in analytics dashboard (Monitor section) provides an immediate overview of your agent's performance, user engagement, and conversation outcomes.

### The "H.O.U.S.E." Framework for Monitoring
To easily recall all parameters available in the Monitor section across both Conversational and Autonomous agents, use this framework:

*   **H - Health:** Track Trigger success rates, Action success, and Errors (for autonomous background agents).
*   **O - Outcomes & Effectiveness:** Monitor session results (**R.E.A.** - Resolved, Escalated, Abandoned), plus CSAT scores (1-5 stars) and AI Sentiment analysis.
*   **U - Use:** Analyze how the bot builds answers through AI Themes, Tool usage, Knowledge Source hit rates, and Generative Answer Quality.
*   **S - Savings & Summary:** High-level executive dashboard showing Total/Billed Sessions, Engagement Rate, and calculated ROI/Savings.
*   **E - Extras:** Custom Metrics (up to 3 business goals) and message-level Reactions (Thumbs up/down).

### Page References (Microsoft Learn)
*   **Analytics Overview:** [Overview and Savings](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-overview)
*   **Agent Effectiveness:** [Conversational Analytics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-effectiveness)
*   **Agent Health:** [Autonomous Analytics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-improve-agent-health)

### Best Practices
*   **Identify Unhandled Intents:** Use the analytics to find clusters of user queries that the agent couldn't answer, and create new topics or add knowledge sources to address them.
*   **Establish a Baseline:** Before making significant updates to your agent, record your current metrics to ensure your changes improve, rather than degrade, performance.

---

## 🔍 2. Application Insights (Deep Monitoring)

While built-in analytics show you *what* happened, connecting your agent to Azure Application Insights lets you debug *why* it happened using raw telemetry and Kusto Query Language (KQL).

### Step-by-Step: Configure Application Insights

**STEP AI-1 — Create the Application Insights Resource**
1. Go to Azure Portal (portal.azure.com).
2. Search for **Application Insights** → Click **+ Create**.
3. Select your Subscription and Resource Group.
4. Name the resource (e.g., `CopilotStudio-Telemetry`) and select a Region matching your Power Platform environment.
5. Click **Review + Create** → **Create**.
6. Once deployed, go to the Overview page and COPY the **Connection String**.

**STEP AI-2 — Connect Copilot Studio to Azure**
1. Open your agent in Copilot Studio.
2. Click **Settings** (top right) → **Advanced**.
3. Scroll to the **Application Insights** section.
4. Paste the Connection String from Step AI-1.
5. Enable the following logging options:
   *   **Log conversation details:** Captures user IDs and raw message text.
   *   **Log sensitive Activity properties:** Useful for deep troubleshooting.
   *   **Node execution events:** Tracks exactly when specific topics or nodes trigger.
6. **Save** and **Publish** your agent.

**STEP AI-3 — Write KQL to Analyze Telemetry**
1. In the Azure Portal, open your Application Insights resource.
2. Click **Logs** in the left menu.
3. Use KQL to run custom queries:

*Example 1: See all conversation events in the last 7 days*
```kusto
customEvents
| where timestamp > ago(7d)
```

*Example 2: Track which topics are triggering most often*
```kusto
customEvents
| where name == "TopicTriggered"
| extend TopicName = tostring(customDimensions.TopicName)
| summarize Count = count() by TopicName
| order by Count desc
```

*Example 3: Find specific errors or tool failures*
```kusto
exceptions
| where timestamp > ago(24h)
| project timestamp, problemId, outerMessage, customDimensions
```

---

## 🧪 3. Evaluation and Testing

Evaluation allows you to systematically validate your agent's performance using a test set of expected inputs and outcomes. This is critical for regression testing before deploying new versions.

### Step-by-Step: Setup an Evaluation Test Set

**STEP EV-1 — Access the Evaluation Tab**
1. Open your agent in Copilot Studio.
2. Navigate to the **Evaluation** tab (or Testing area, depending on the UI version).
3. Select **New evaluation** or **New test set**.

**STEP EV-2 — Populate Your Test Cases**
You can create your test set using one of four methods:
*   **Generate with AI:** The system automatically creates test cases based on your agent's description, instructions, and topics.
*   **Upload from CSV:** Drag and drop a CSV file containing your test scenarios (download the template first for proper formatting).
*   **Manual Entry:** Write specific questions and expected outcomes manually.
*   **Use Test Chat:** Automatically import questions from your previous test chat sessions.

**STEP EV-3 — Configure and Run the Evaluation**
1. Review your list of test cases.
2. Name your test set (e.g., `Regression_Test_V1`).
3. Configure the grader method (e.g., *Compare meaning*, *Keyword match*, or *General quality*).
4. Click **Evaluate** to run the test cases. (This may take a few minutes).

**STEP EV-4 — Analyze Results and Iterate**
1. Click on the completed test result to view pass/fail metrics.
2. Compare the agent's actual responses against your expected outcomes.
3. Identify failed cases, adjust your agent's instructions, topics, or knowledge base, and **rerun the exact same test set** to verify the fix.

---

**Back to:** [Component Reference](README.md)
