# Copilot Studio Custom Canvas with Entra ID Authentication

This repository contains the architecture required to securely host a Microsoft Copilot Studio bot on a custom website using the Bot Framework Web Chat SDK.

## Contents
* `chatbot.html` - The custom frontend canvas UI, featuring MSAL.js login popups, word-by-word streaming animations, and conversation history persistence.
* `server.js` - A lightweight Node.js backend acting as a secure "Token Exchange".

## Security Architecture
**Never hardcode a Direct Line secret in HTML.** 
This project follows the official Microsoft security pattern:
1. The frontend (`chatbot.html`) makes a request to the backend.
2. The backend (`server.js`) uses the hidden Master Secret to securely generate a *temporary, single-use Token* from Microsoft's API.
3. The backend returns the temporary token to the frontend.
4. The frontend initializes Web Chat with the temporary token. 
5. *Bonus:* Because we pass it as a `token` to the SDK, the Web Chat SDK automatically refreshes the token in the background every 15 minutes to keep the session alive indefinitely.

---

## 🎨 Bot Framework Web Chat SDK Features & Customizations

By utilizing the Bot Framework Web Chat SDK (instead of the default iframe), you unlock total control over the user experience. Here are the features currently implemented in this repository, as well as modifications you can enable:

### Features Currently Implemented in `chatbot.html`
1. **Dynamic DOM Streaming (Word-by-Word):** An advanced `MutationObserver` intercepts Microsoft's payload and animates the text appearing on the screen word-by-word to mimic a real human typing.
2. **Session Persistence:** Integrates with browser `sessionStorage` to save the `conversationId`. If the user accidentally refreshes the page, the entire chat history reloads instantly.
3. **Silent Identity Injection:** Upon MSAL login, the frontend intercepts the connection pipeline and dispatches a hidden `startConversation` event, silently passing the user's mathematically verified Name and Employee ID to the Copilot Studio backend variables.
4. **Custom CSS Overrides:** Overrides Microsoft's default strict styling to provide floating widgets, backdrop blurs, custom fonts (Inter), and tailored color palettes.

### Additional Features You Can Easily Enable
* **Adaptive Cards:** Fully supports rendering rich media, buttons, carousels, and forms directly inside the chat window.
* **Speech-to-Text & Text-to-Speech:** Can be integrated with Azure Cognitive Services so users can physically talk to the bot using their microphone.
* **File Uploads:** You can toggle `hideUploadButton: false` in the `styleOptions` to allow users to attach screenshots or PDFs to send to the AI.
* **Custom React Components:** The SDK is built on React. You can override specific message bubbles to render custom HTML elements (like a live map or a dynamic calendar) instead of standard text.
* **Localization:** Instantly translate system text by changing the `locale: 'en-US'` flag to another language (e.g., `es-ES`).

---

## 📚 Advanced Learnings & Troubleshooting (Crucial)
During the implementation of this project, several advanced Microsoft Entra ID restrictions were uncovered. If your MSAL popup fails with an "Authentication Error", check these three things:

### 1. The "Two Redirect URI" Rule
To successfully authenticate a Copilot Studio Custom Canvas, you must have TWO separate Redirect URIs configured in your Azure App Registration at the exact same time:
* **Platform: Web** -> `https://token.botframework.com/.auth/web/redirect` (Required by Copilot Studio backend).
* **Platform: Single-page application (SPA)** -> `http://localhost:3000/` (Required by the MSAL.js frontend). If you are using a dynamic port, Microsoft will reject the login. **Always use a static port for local testing.**

### 2. Supporting External Users & `@outlook.com` Accounts
By default, Azure App Registrations are created as **Single Tenant**. This means if you try to log in with an external email or a personal Microsoft account, Azure AD will silently reject the token.
* **To fix this in Azure:** You must recreate or modify your Azure App Registration to support *"Accounts in any organizational directory and personal Microsoft accounts"*.
* **To fix this in Code:** In `chatbot.html`, you must change your MSAL `authority` URL from `https://login.microsoftonline.com/{YOUR_TENANT_ID}` to `https://login.microsoftonline.com/common`. The word "common" forces MSAL to accept multi-tenant and personal identities.

---

## How to set up Microsoft Entra ID (Azure AD) from scratch

### Step 1: Create the Azure App Registration
1. Go to the Azure Portal -> Microsoft Entra ID -> **App registrations** -> **New registration**.
2. Name the application (e.g., `IT Support Copilot Bot`).
3. Under Supported account types, select **Accounts in any organizational directory and personal Microsoft accounts** (if testing externally) or **Single tenant** (if strict internal use).
4. Click **Register**.
5. Save the **Application (client) ID**.

### Step 2: Configure the App Settings
1. Go to **Authentication** -> **Add a platform** -> **Web**.
2. Set the Redirect URI to `https://token.botframework.com/.auth/web/redirect` *(or `https://europe.token.botframework.com/.auth/web/redirect` for Europe data environments)*.
3. Check both `Access tokens` and `ID tokens` under Implicit grant flows, and click Configure.
4. **Add a platform** -> **Single-page application** and add your local frontend URL (e.g., `http://localhost:3000/`).
5. Go to **Certificates & secrets** -> **New client secret**. 
6. Save the **Value** of the secret securely.

### Step 3: Link it to Copilot Studio
1. Open your bot in **Microsoft Copilot Studio**.
2. Go to **Settings** -> **Security** -> **Authentication**.
3. Select **Authenticate manually**.
4. Check **Require users to sign in**.
5. Fill out the fields:
   * **Service provider**: Microsoft Entra ID
   * **Client ID**: Your Application (client) ID
   * **Client secret**: Your Secret Value
   * **Tenant ID**: Your Tenant ID (or 'common' if using multi-tenant)
   * **Scopes**: `openid profile email`
6. Click **Save** and **Publish** your bot.
