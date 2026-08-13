# Channel Integration & Handoff — Step-by-Step

Complete setup guides for every channel Copilot Studio supports, plus detailed live-agent handoff patterns for ServiceNow, Dynamics 365, and custom platforms.

---

## 🗺️ Channel Overview

| Channel | Auth Support | Adaptive Cards | Live Agent Handoff | Best For |
|---|---|---|---|---|
| **Web (Embed)** | All modes | ✅ Full | Via Direct Line | Public websites, intranet portals |
| **Custom Canvas** | All + SSO | ✅ Full | Via Direct Line | Branded enterprise web apps |
| **Microsoft Teams** | Entra ID SSO | ✅ Full | Via D365/Omnichannel | Internal employee agents |
| **Microsoft 365 Copilot** | Entra ID | ✅ Full | Limited | M365 Copilot extension agents |
| **WhatsApp** | No auth / Manual | ⚠️ Limited | Via D365/ACS | External customer-facing |
| **Voice / Telephony** | Entra ID / Manual | ❌ None | Via D365 voice | Contact centre, IVR replacement |
| **Dynamics 365 / Omnichannel** | Entra ID | ✅ v1.5 | ✅ Native | Customer service contact centre |
| **ServiceNow** | Manual / Direct Line | Limited | ✅ Bot Interconnect | IT service desk handoff |
| **Email** | Manual | ❌ Static image | Via flow/ticket creation | Async notifications, ticketing |
| **Mobile (iOS/Android)** | All modes | ✅ Full (SDK) | Via Direct Line | Custom mobile apps |

---

## 📌 Universal Pre-Requisites (All Channels)

Before configuring ANY channel, complete these first:

- [ ] **Step P-1:** Build your agent inside a **Solution** (not the default environment)
- [ ] **Step P-2:** Configure **Authentication** mode for your agent (`Settings → Security → Authentication`)
- [ ] **Step P-3:** Test your agent in the **test pane** — all critical paths passing
- [ ] **Step P-4:** Click **Publish** at least once — channels require a published agent
- [ ] **Step P-5:** Configure **DLP policies** in Power Platform Admin Center before publishing externally
- [ ] **Step P-6:** Set up **Environment Variables** for any channel-specific URLs or keys

> ⚠️ **Critical rule:** You must re-publish your agent every time you make changes. Channel integrations pick up the LAST published version — not the draft you're editing.

---

## 🌐 Channel 1 — Web Embed (Standard)

### What It Is
Embed your agent as a chat widget on any website using a JavaScript snippet. The quickest path to a public or intranet web channel.

### Steps

**STEP W-1 — Publish the agent**
```
Copilot Studio → your agent → Publish tab → Publish
Wait for "Successfully published" confirmation
```

**STEP W-2 — Navigate to the Web channel**
```
Settings → Channels → Web
```

**STEP W-3 — Copy the embed snippet**
```html
<!-- Option A: No-code HTML attribute embed (zero JavaScript) -->
<div
  data-bf-chatwidget
  data-bot-id="YOUR_BOT_ID"
  data-bot-name="IT Support Agent"
  data-bot-avatar="https://yoursite.com/bot-icon.png"
  data-primary-color="#0078D4"
  data-secondary-color="#E8F0FE"
  data-show-button="true"
  data-button-position="bottom-right"
  data-locale="en-US">
</div>
<script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
```

```html
<!-- Option B: JavaScript snippet from Copilot Studio portal -->
<script>
  var params = {
    botId: "YOUR_BOT_ID",
    botTenantId: "YOUR_TENANT_ID",
    botName: "IT Support Agent",
    height: "600px",
    width: "400px"
  };
  (function(d, s, id) {
    var js, ref = d.getElementsByTagName(s)[0];
    if (!d.getElementById(id)) {
      js = d.createElement(s); js.id = id;
      js.src = "https://webchat.botframework.com/embed/YOUR_BOT_ID?s=YOUR_WEBCHAT_SECRET";
      ref.parentNode.insertBefore(js, ref);
    }
  }(document, 'script', 'copilot-widget'));
</script>
```

**STEP W-4 — Configure appearance (optional)**
```
In Channels → Web:
• Change widget title
• Upload custom avatar/icon
• Set primary colour (hex)
• Set greeting message
• Set placeholder text
• Toggle: Allow file upload (Yes/No)
• Toggle: Allow voice input (Yes/No)
```

**STEP W-5 — Paste snippet into your website**
```
Place the script tag just before </body> on every page
where you want the chat widget to appear
Test in browser dev tools (F12) → Console should show no errors
```

**STEP W-6 — Verify**
```
□ Widget appears as floating button
□ Clicking opens chat pane
□ Bot responds to test messages
□ Published topic changes appear (wait 1–2 min post-publish)
```

### Web Channel Limits

| Limit | Value |
|---|---|
| Adaptive Cards schema | Up to v1.5 |
| File upload size | 5 MB per file |
| Session timeout | 30 min inactivity |
| `Action.Execute` | ❌ Not supported — use `Action.Submit` |
| SSO | Requires Custom Canvas (see below) |

---

## 🖥️ Channel 2 — Custom Canvas (Branded Web Embed)

### What It Is
Full control over the chat UI, branding, SSO, and layout using the **Bot Framework Web Chat** library. Required when you need brand-consistent design, SSO authentication, or custom event handling.

### Steps

**STEP CC-1 — Get a Direct Line Token (not Secret)**
```
Copilot Studio → Settings → Channels → Mobile app (Direct Line)
Copy the "Direct Line secret"

⚠️ NEVER expose the secret in client-side code
Generate a token server-side instead:

POST https://directline.botframework.com/v3/directline/tokens/generate
Authorization: Bearer YOUR_DIRECT_LINE_SECRET
```

**STEP CC-2 — Set up a token server (backend)**
```javascript
// Node.js / Azure Function token endpoint example
const fetch = require('node-fetch');

module.exports = async function (context, req) {
  const response = await fetch(
    'https://directline.botframework.com/v3/directline/tokens/generate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DIRECT_LINE_SECRET}`
      }
    }
  );
  const json = await response.json();
  context.res = { body: { token: json.token } };
};
```

**STEP CC-3 — Build the custom canvas HTML**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>IT Support Chat</title>
  <!-- Import Bot Framework Web Chat library -->
  <script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
  <style>
    #webchat { width: 400px; height: 600px; }
  </style>
</head>
<body>
  <div id="webchat" role="main"></div>
  <script>
    (async function () {
      // Step 1: Get token from YOUR secure backend (not Direct Line directly)
      const tokenRes = await fetch('/api/get-directline-token');
      const { token } = await tokenRes.json();

      // Step 2: Create store and render
      const store = window.WebChat.createStore();

      window.WebChat.renderWebChat(
        {
          directLine: window.WebChat.createDirectLine({ token }),
          store,
          styleOptions: {
            accent: '#0078D4',                // Microsoft blue
            botAvatarImage: '/icons/bot.png',
            botAvatarInitials: 'IT',
            userAvatarInitials: 'ME',
            bubbleBackground: '#F3F9FF',
            bubbleBorderRadius: 8,
            sendBoxBackground: '#FFFFFF',
            fontSizeSmall: '13px',
            primaryFont: "'Segoe UI', sans-serif"
          },
          // Optional: Pass user identity for SSO
          userID: 'user-123',
          username: 'Rupam Wadibhasme',
          locale: 'en-US'
        },
        document.getElementById('webchat')
      );
    })();
  </script>
</body>
</html>
```

**STEP CC-4 — Add SSO token passthrough (if needed)**
```javascript
// After getting Entra ID token from MSAL, pass it to the bot
const store = window.WebChat.createStore({}, ({ dispatch }) => next => action => {
  if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
    const { activity } = action.payload;
    // Intercept OAuthCard and auto-supply the SSO token
    if (activity.type === 'event' && activity.name === 'webchat/join') {
      dispatch({
        type: 'WEB_CHAT/SET_SEND_BOX',
        payload: { text: '' }
      });
    }
  }
  return next(action);
});
```

**STEP CC-5 — Deploy to web hosting**
```
• Azure Static Web Apps (recommended — free tier available)
• Azure App Service
• Any HTTPS web host (HTTP is blocked for webchat security)

Must be served over HTTPS — Direct Line rejects HTTP origins
```

**STEP CC-6 — Verify**
```
□ Canvas loads without console errors
□ Token endpoint returns 200 with valid token
□ Bot responds to test messages
□ Adaptive Cards render with custom styling
□ SSO flow completes (if configured)
```

---

## 👥 Channel 3 — Microsoft Teams

### Steps

**STEP T-1 — Publish your agent**
```
Copilot Studio → Publish
```

**STEP T-2 — Open Teams channel settings**
```
Settings → Channels → Microsoft Teams → Turn on Teams
```

**STEP T-3 — Customise app manifest appearance**
```
After enabling Teams:
• App name: what users see in Teams
• Short description: shown in Teams app store (80 chars max)
• Long description: detailed description (4,000 chars max)
• App icon: 192×192px PNG, no transparency
• Accent colour: hex colour
• Developer name and URL
```

**STEP T-4 — Choose deployment method**

```
Option A — Install for yourself (testing)
  Click "Install for me" → Opens Teams with app installation prompt

Option B — Share with colleagues (link)
  Click "Copy link" → Send URL to teammates
  They open the link and click "Add" in Teams

Option C — Org-wide deployment (admin approval required)
  Click "Submit for admin approval"
  → Teams admin receives notification in Teams Admin Center
  → Admin reviews: Teams Admin Center → Manage apps → Pending approval
  → Admin approves → App appears under "Built for your org" for all users

Option D — App catalog (specific teams/channels)
  Teams Admin Center → Setup policies → Add app to specific teams
```

**STEP T-5 — Teams Admin Center setup (for org deployment)**
```
admin.teams.microsoft.com → Manage apps
→ Search for your agent name
→ Allow or Block
→ Setup policies: assign to user groups or all users
→ Pin policy: optionally pin the agent to the Teams app bar
```

**STEP T-6 — Configure permissions (if agent uses Graph/Entra)**
```
Azure Portal → App Registrations → your agent's app
→ API permissions → add required delegated or application permissions
→ Grant admin consent for org
```

**STEP T-7 — Test**
```
□ Open Teams → Apps → Built for your org → find your agent
□ Start a conversation
□ Test all critical topics
□ Test Adaptive Cards render correctly
□ Test SSO sign-in (if configured)
□ Test file sharing (if enabled)
```

### Common Teams Issues

| Problem | Fix |
|---|---|
| Changes not appearing | Re-publish in Copilot Studio; may take 2–5 min to propagate |
| App not in "Built for your org" | Admin has not approved or policy not assigned |
| SSO not working | Verify Entra app registration redirect URI includes Teams endpoint |
| Agent name > 30 chars | Omnichannel connections fail — shorten name to ≤30 chars |
| Agent can't access user's data | Missing API permissions or admin consent not granted |

---

## 📱 Channel 4 — WhatsApp (via Azure Communication Services)

### Steps

**STEP WA-1 — Pre-requisites checklist**
```
□ Active Azure subscription
□ Azure Communication Services (ACS) resource created
□ WhatsApp Business Account (WABA) verified on Meta
□ WhatsApp Business phone number registered and approved
□ Agent auth mode set to "No authentication" or "Authenticate manually"
   (Standard Microsoft sign-in is NOT supported on WhatsApp)
□ Agent published
```

**STEP WA-2 — Create ACS resource (if not existing)**
```
Azure Portal → Create resource → "Communication Services"
• Subscription: your Azure subscription
• Resource group: create or use existing
• Resource name: e.g., "contoso-acs-whatsapp"
• Region: choose closest to your users
Click Review + Create → Create
```

**STEP WA-3 — Connect WhatsApp Business to ACS**
```
ACS resource → Channels → WhatsApp
→ Connect WhatsApp Business Account
→ Sign in to Meta Business Manager
→ Select your WhatsApp Business Account (WABA)
→ Select or create the phone number to use
→ Approve the connection
```

**STEP WA-4 — Enable WhatsApp channel in Copilot Studio**
```
Settings → Channels → WhatsApp → Click tile
→ Continue
→ Select your Azure Subscription
→ Select the ACS resource created in WA-2
→ Select the WhatsApp phone number
→ Click Deploy
```

**STEP WA-5 — Verify Event Grid subscription**
```
Azure Portal → your ACS resource → Events
→ Confirm Event Grid subscription was auto-created
→ Subscription name should reference your Copilot Studio bot
→ Status should be: Active

⚠️ If NOT auto-created (known issue):
  → Create manually:
  Azure Portal → ACS resource → Events → + Event Subscription
  • Name: copilot-whatsapp-subscription
  • Event types: Microsoft.Communication.AdvancedMessageReceived
  • Endpoint type: Webhook
  • Endpoint: copy from Copilot Studio WhatsApp channel config
```

**STEP WA-6 — Test the connection**
```
→ Copilot Studio WhatsApp channel config shows a QR code
→ Scan QR code with your WhatsApp device
→ A pre-filled message opens — send it
→ Agent should respond within 10 seconds

If no response:
  □ Check Event Grid subscription is Active (WA-5)
  □ Check ACS resource is not in a suspended state
  □ Check agent is Published (not draft)
  □ Check phone number is approved by Meta
```

**STEP WA-7 — Design WhatsApp-specific topics**
```
WhatsApp constraints to design around:
• NO Adaptive Cards → use plain text + Choice buttons (≤3 options)
• Messages: 4,096 characters max per message
• Images: ✅ supported via URL
• Documents: ✅ supported (PDF, DOCX)
• Audio: ✅ supported
• 24-hour window: within 24hrs of last user message = free-form text OK
• Outside 24hrs: must use Meta-approved Message Templates

Design tip: Replace card-based selection with numbered lists:
  Instead of: [Button: Option 1] [Button: Option 2] [Button: Option 3]
  Use: "Reply with:  1️⃣ Reset password  2️⃣ Check ticket  3️⃣ Talk to agent"
```

---

## 🎙️ Channel 5 — Voice / Telephony

### Steps

**STEP V-1 — Prerequisites**
```
□ Azure Communication Services resource (same as WhatsApp setup)
□ Phone number provisioned in ACS (PSTN or toll-free)
□ Agent designed for voice (ALL text is spoken — no cards, no markdown)
□ Agent published
```

**STEP V-2 — Enable Voice channel**
```
Settings → Channels → Voice
→ Select your ACS resource
→ Select the phone number
→ Configure Voice settings:
   • Speech synthesis voice (choose from Azure Neural Voice catalogue)
   • Speech recognition language
   • DTMF (keypad) support: On/Off
   • Barge-in (interrupt agent while speaking): On/Off
   • Silence timeout: 5–30 seconds
```

**STEP V-3 — Voice-proof your topics**
```
Voice design rules — check EVERY message node:
□ No Adaptive Cards (invisible on voice — add speech fallback)
□ No markdown formatting (asterisks and hyphens are READ aloud literally)
□ No long lists (>3 items — user can't remember)
□ Numbers spoken not displayed: "Call us at 1-800-contoso" not "Call: 1800-266867"
□ URLs spoken: "Visit contoso dot com" not "Visit https://contoso.com"
□ Short responses: max 1–2 sentences per turn
□ Add pauses for complex info: "Your ticket number is... [pause] ...seven four three two."
□ Always offer menu options as spoken choices, not buttons

In each Message node:
→ Enable "Speak" override → write a separate speech-optimised version
```

**STEP V-4 — Configure routing (Azure ACS)**
```
ACS → Call Automation → Create call workflow
→ Incoming call event: POST to Copilot Studio voice webhook
→ Answered call: connect to bot media session
→ Configure hold music (for transfers to human agent)
→ Configure disconnect behaviour (graceful goodbye)
```

**STEP V-5 — Test**
```
□ Dial your ACS phone number
□ Voice greeting plays (from agent's greeting topic)
□ Speak naturally — agent recognises intent
□ Test escalation — transfers to human agent queue correctly
□ Test silence handling — agent re-prompts appropriately
```

---

## 🔄 Handoff 1 — Dynamics 365 Customer Service / Omnichannel (Native)

### What It Is
The most deeply integrated live-agent handoff. Transfers conversation + full transcript + variables to a Dynamics 365 Customer Service agent (service representative) in real time.

### Steps

**STEP D365-1 — Prerequisites**
```
□ Dynamics 365 Customer Service (Enterprise or Professional) licence
□ Omnichannel for Customer Service or D365 Contact Center enabled
□ Agent name: 30 characters or FEWER (longer names break connection silently)
□ Both Copilot Studio and D365 in the SAME Power Platform environment
□ Agent published
```

**STEP D365-2 — Configure the Escalate system topic in Copilot Studio**
```
1. Open your agent → Topics → System tab
2. Click "Escalate" topic
3. Scroll to the bottom of the topic flow
4. Click + Add node → Topic Management → Transfer conversation
5. In "Transfer conversation" node:
   • Message to agent: "Transferring to a human agent. One moment..."
   • Context variables to pass (these appear in the D365 agent panel):
     - customer name     → System.User.DisplayName
     - email             → System.User.Email
     - issue type        → Topic.issueCategory
     - incident summary  → Topic.conversationSummary
     - priority          → Topic.selectedPriority
6. Save topic
7. Publish agent
```

**STEP D365-3 — Connect to Dynamics 365 from Copilot Studio**
```
1. Settings → Channels
2. Select: "Dynamics 365 Contact Center" (or "Customer engagement hub")
3. Click Connect
4. Wait for status to change to: Connected ✅
5. Click Close
6. Publish agent again (required after connecting)
```

**STEP D365-4 — Set up the Workstream in Customer Service Admin Center**
```
1. Open D365 Customer Service Admin Center (as System Admin)
2. Go to: Workstreams → + New workstream
3. Configure:
   • Name: "IT Support Web Chat"
   • Type: Chat / Voice / Messaging (match your channel)
   • Work distribution: Push (auto-assign) or Pick (agent picks)
4. Add your Copilot Studio agent to the workstream:
   • Workstream → Bot → + Add bot
   • Select your published agent
   • Set: "Hand off to human agent after: [N] failed escalations" or "always route to bot first"
5. Set up routing rules:
   • Route conversations based on: queue, skill, language, agent capacity
   • Create Queue for human agents who receive transfers
```

**STEP D365-5 — Configure the human agent workspace**
```
In D365 Customer Service workspace:
• Agent sees: full transcript on left, customer context panel on right
• Context variables you passed in Step D365-2 appear as fields
• Agent can see: customer sentiment score, conversation history, topic path taken
• Supervisor sees: real-time monitoring dashboard with all active conversations
```

**STEP D365-6 — Test the full handoff flow**
```
1. Start a conversation with your agent (via Web or Teams)
2. Trigger the escalation:
   • Say "I need to speak to a human"
   • Or trigger via a topic that ends with Transfer conversation node
3. Verify:
   □ "Transferring..." message appears to user
   □ In D365 Omnichannel Agent Dashboard: new conversation appears
   □ Agent receives: transcript, customer name, issue type, priority
   □ Agent accepts conversation
   □ Conversation continues in D365 — user and agent are connected
   □ When agent closes: "conversation ended" event fires
```

---

## 🔧 Handoff 2 — ServiceNow Live Agent (Bot Interconnect)

### What It Is
Transfer from Copilot Studio to a ServiceNow Virtual Agent live agent session using the **ServiceNow Bot Interconnect** framework and an Azure Function as middleware.

### Architecture

```
User → Copilot Studio Agent
          │
          │ (Escalate topic triggers)
          ▼
    Azure Function (Middleware)
     • Relays messages between platforms
     • Holds Direct Line secret
     • Converts activity formats
          │
          ▼
    ServiceNow Bot Interconnect
          │
          ▼
    ServiceNow Live Agent Queue
          │
          ▼
    Human Agent (ServiceNow Agent Workspace)
```

### Steps

**STEP SN-1 — Prerequisites**
```
□ ServiceNow instance (Yokohama release or later recommended)
□ ServiceNow plugins enabled:
   - Glide Virtual Agent (com.glide.cs.chatbot)
   - Bot Interconnect (com.glide.cs.bot.interconnect)
□ Azure subscription (for middleware Azure Function)
□ Copilot Studio agent published
□ Direct Line channel configured in Copilot Studio
```

**STEP SN-2 — Enable Direct Line in Copilot Studio**
```
1. Settings → Channels → Mobile app (this exposes Direct Line)
2. Show → copy the Direct Line Secret
   ⚠️ Keep this secret — it's used by the Azure Function
3. Note your Bot ID (also shown on this screen)
```

**STEP SN-3 — Create the Azure Function middleware**
```javascript
// Azure Function: index.js
// Relays messages between ServiceNow Bot Interconnect and Copilot Studio Direct Line

const { DirectLine } = require('botframework-directlinejs');
const fetch = require('node-fetch');

const DIRECT_LINE_SECRET = process.env.DIRECT_LINE_SECRET;
const SERVICENOW_ENDPOINT = process.env.SERVICENOW_BOT_INTERCONNECT_URL;

module.exports = async function (context, req) {
  const { conversationId, activity, userId } = req.body;

  // Forward activity from ServiceNow to Copilot Studio
  if (req.body.source === 'servicenow') {
    const tokenResponse = await fetch(
      'https://directline.botframework.com/v3/directline/tokens/generate',
      { method: 'POST', headers: { Authorization: `Bearer ${DIRECT_LINE_SECRET}` } }
    );
    const { token } = await tokenResponse.json();

    const sendResponse = await fetch(
      `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      }
    );
    context.res = { status: 200, body: { relayed: true } };
  }

  // Forward activity from Copilot Studio to ServiceNow
  if (req.body.source === 'copilot') {
    await fetch(SERVICENOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, activity, userId })
    });
    context.res = { status: 200, body: { relayed: true } };
  }
};
```

**STEP SN-4 — Deploy and configure Azure Function**
```
1. Create Azure Function App (Node.js 18 LTS runtime)
2. Deploy index.js from STEP SN-3
3. App settings → add:
   DIRECT_LINE_SECRET = [from STEP SN-2]
   SERVICENOW_BOT_INTERCONNECT_URL = [from STEP SN-6]
4. Copy the Function URL → you need this in STEP SN-5
   Format: https://your-function.azurewebsites.net/api/relay-messages
```

**STEP SN-5 — Configure Bot Interconnect in ServiceNow**
```
1. ServiceNow → Virtual Agent → Bot Interconnect → + New
2. Fill in:
   • Name: "Copilot Studio IT Agent"
   • Type: Custom Bot
   • Bot Endpoint URL: [Azure Function URL from STEP SN-4]
   • Authentication: None (or API key if you added auth to your function)
3. Create a Shell Topic:
   • Virtual Agent → Topics → + New Topic
   • Name: "Transfer to Copilot Studio"
   • Type: Shell topic (proxies to external bot)
   • Bot Interconnect: select record from above
   • Trigger phrases: "IT request", "Reset password", "Software install"
4. Save and activate the topic
```

**STEP SN-6 — Configure Escalate topic in Copilot Studio**
```
1. Topics → System tab → Escalate
2. Add Transfer conversation node
3. Configure context to pass to ServiceNow:
   • user_id      → System.User.Email
   • incident_type → Topic.issueCategory
   • summary       → Topic.conversationSummary
4. Add a Message node before transfer:
   "Connecting you to our IT service desk team. Average wait: [Topic.waitTime]"
5. Save → Publish
```

**STEP SN-7 — Test end-to-end**
```
1. Trigger escalation in Copilot Studio test pane
   → Say: "I need to speak to a person"
2. Verify Azure Function logs show relay activity
3. In ServiceNow → Service Desk → Live Conversations
   → New conversation should appear with transcript
4. ServiceNow agent accepts → responds
5. User receives agent's message via Copilot Studio channel
6. Context variables (user_id, incident_type, summary) visible in ServiceNow workspace
```

---

## 🛠️ Handoff 3 — Generic Live Agent Handoff (Custom Platform / Zendesk / Freshdesk / Salesforce)

### Pattern: Direct Line + Middleware

For ANY live agent platform that isn't natively integrated with Copilot Studio, use this standard middleware pattern:

```
Copilot Studio → Direct Line → Azure Function (Router) → Target Live Agent Platform API
```

### Steps

**STEP G-1 — Enable Direct Line in Copilot Studio**
```
Settings → Channels → Mobile app → copy Direct Line Secret
```

**STEP G-2 — Build the middleware Azure Function**

The Azure Function must:
1. Accept incoming Direct Line activities from Copilot Studio
2. Translate them to the target platform's format
3. POST to the target platform's API
4. Accept incoming messages from the target platform
5. POST them back to Copilot Studio via Direct Line

```javascript
// Zendesk example: Copilot Studio → Zendesk Chat handoff
const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN;
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN;
const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL;

async function createZendeskTicketAndChat(context, activityData) {
  // 1. Create ticket with conversation context
  const ticketResponse = await fetch(
    `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticket: {
          subject: `Agent handoff - ${activityData.issueCategory}`,
          comment: { body: activityData.conversationTranscript },
          priority: activityData.priority.toLowerCase(),
          requester: { name: activityData.userName, email: activityData.userEmail }
        }
      })
    }
  );
  return await ticketResponse.json();
}
```

**STEP G-3 — Configure the Escalate topic in Copilot Studio**
```
Topics → System → Escalate
→ Call an action → HTTP request (or Power Automate flow)
→ POST to your Azure Function with conversation context:
  {
    "userName": "{System.User.DisplayName}",
    "userEmail": "{System.User.Email}",
    "issueCategory": "{Topic.issueCategory}",
    "priority": "{Topic.selectedPriority}",
    "conversationTranscript": "{System.ConversationTranscript}"
  }
→ Add Transfer conversation node with message:
  "Your request has been logged. Ticket #{responseData.ticket_id}.
   A support agent will respond to {System.User.Email} within 4 hours."
```

### Platform-Specific Notes

| Platform | Integration Method | Key API |
|---|---|---|
| **Zendesk** | REST API (ticket creation + chat) | `POST /api/v2/tickets` + Zendesk Chat API |
| **Freshdesk** | REST API | `POST /api/v2/tickets` + Freshchat API |
| **Salesforce Service Cloud** | REST/SOAP API | Einstein Bots handoff via Experience Cloud |
| **Intercom** | Intercom API | `POST /conversations` → assign to team |
| **Genesys Cloud** | Genesys Cloud API | Open Messaging inbound channel |
| **NICE CXone** | NICE DFO API | Digital First Omnichannel handoff |

---

## 📊 Handoff Design Patterns

### Pattern A — Opt-in Escalation (user requests human)
```
User: "I want to speak to a person"
↓ Escalate system topic fires
↓ Collect context (name, issue, priority)
↓ Check agent availability (via flow)
    ├── If available: Transfer conversation → live agent
    └── If unavailable: Create ticket + send email → "We'll contact you in 4hrs"
```

### Pattern B — Automatic Escalation (agent can't resolve)
```
Agent loops on same topic 3+ times → Low confidence score
↓ Condition: {System.SessionInfo.TurnCount} > 3
↓ AND {System.LastIntentScore} < 0.6
↓ → Automatic escalation trigger
↓ "I wasn't able to resolve this. Let me connect you to a specialist."
↓ Transfer conversation → live agent queue (high priority)
```

### Pattern C — Triage + Route by Skill
```
User describes issue → Agent classifies:
    ├── Network issue → Route to "Network Team" queue in D365
    ├── Software issue → Route to "Software Team" queue
    ├── Hardware issue → Route to "Hardware Team" queue
    └── Policy question → No escalation — answer from KB

Implemented using:
  Transfer conversation node → Context variable: {Topic.routingQueue}
  D365 routing rule: IF contextVariable.routingQueue = "Network" → assign to Network queue
```

---

## ⚠️ Limits & Constraints — All Channels

| Channel | Key Limit | Value |
|---|---|---|
| Web Embed | Session idle timeout | 30 minutes |
| Web Embed | Adaptive Cards schema | v1.5 max |
| Custom Canvas | Token lifespan | 60 minutes (refresh required) |
| Teams | App name length for Omnichannel | ≤ 30 characters |
| Teams | Adaptive Cards schema | v1.5 |
| WhatsApp | Message character limit | 4,096 per message |
| WhatsApp | Buttons per message | 3 max |
| WhatsApp | Free-form messaging window | 24 hours from last user message |
| WhatsApp | Adaptive Cards | NOT supported |
| Voice | Cards supported | NONE — text fallback mandatory |
| Voice | Response length guideline | 1–2 sentences max per turn |
| D365 Omnichannel | Agent name length | ≤ 30 characters |
| D365 Omnichannel | Context variable size | 4,096 chars per variable |
| Direct Line | Token expiry | 60 minutes |
| Direct Line | Requests per second | 5 RPS per conversation |
| All channels | Must publish before channel works | Always republish after changes |
| All channels | Simultaneous connections | Depends on licence tier |

---

## ✅ Channel Integration Checklist

### Before You Publish to Any Channel
```
□ Agent fully tested in test pane — all critical topics passing
□ Authentication mode configured and tested
□ DLP policies reviewed — no blocked connectors for this channel
□ Agent name is ≤ 30 characters (required for D365/Omnichannel)
□ Agent is inside a Solution (for ALM governance)
□ Clicked Publish — channel uses published version, not draft
□ Escalation topic configured with Transfer conversation node
□ Context variables defined for handoff (name, email, issue, priority)
```

### After Publishing to Each Channel
```
□ End-to-end smoke test on the actual channel (not just test pane)
□ Adaptive Cards rendering verified on the channel
□ SSO / authentication flow tested with a real user account
□ Handoff tested — full transfer to live agent confirmed
□ Context variables received by live agent platform confirmed
□ Agent transcript passed to live agent confirmed
□ Analytics showing sessions from the new channel
□ DLP compliance confirmed — no policy violations in logs
```

---

## 🎯 Interview-grade summaries

**"How would you publish an agent to Teams for all employees?"**
> Publish the agent in Copilot Studio, enable the Teams channel, customise the app manifest (name, description, icons), submit for admin approval via the Teams channel settings. The Teams admin then reviews in Teams Admin Center, approves it, and uses setup policies to deploy it to all users or specific groups. After deployment, every agent change requires a re-publish in Copilot Studio before it appears in Teams.

**"How does the D365 Omnichannel handoff work?"**
> In Copilot Studio, configure the Escalate system topic to end with a Transfer conversation node, and pass context variables (user name, email, issue type, summary). Connect the D365 Contact Center channel in the Copilot Studio Channels settings. In Customer Service Admin Center, add the agent to a workstream and configure routing rules. When a user triggers escalation, the full transcript and context variables are delivered to the human agent in the D365 Customer Service workspace in real time.

**"How do you hand off to ServiceNow live agents?"**
> ServiceNow doesn't have a native Copilot Studio connector, so the integration uses ServiceNow's Bot Interconnect framework plus an Azure Function as middleware. The Azure Function holds the Direct Line secret, relays messages between the Direct Line API and ServiceNow's Bot Interconnect endpoint, and handles the activity format translation. The escalation is triggered from the Copilot Studio Escalate system topic, which fires a Transfer conversation node that routes through the Azure Function to the ServiceNow agent queue.

**"What's the biggest mistake people make with channel deployment?"**
> Forgetting to republish after every change — the channel always serves the last published version, not the draft. The second biggest mistake is building a Teams agent and deploying it to WhatsApp without redesigning for WhatsApp constraints: Adaptive Cards don't render, markdown formatting is read literally, and there's a 24-hour messaging window. Every channel needs to be treated as its own design target, not a copy-paste of another channel's topics.
