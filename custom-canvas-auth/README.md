# Copilot Studio Custom Canvas with Entra ID Authentication

This repository contains the architecture required to securely host a Microsoft Copilot Studio bot on a custom website using the Bot Framework Web Chat SDK.

## Contents
* `chatbot.html` - The custom frontend canvas UI, featuring word-by-word streaming animations and conversation history persistence.
* `server.js` - A lightweight Node.js backend acting as a secure "Token Exchange".

## Security Architecture
**Never hardcode a Direct Line secret in HTML.** 
This project follows the official Microsoft security pattern:
1. The frontend (`chatbot.html`) makes a request to the backend.
2. The backend (`server.js`) uses the hidden Master Secret to securely generate a *temporary, single-use Token* from Microsoft's API.
3. The backend returns the temporary token to the frontend.
4. The frontend initializes Web Chat with the temporary token. 
5. *Bonus:* Because we pass it as a `token` to the SDK, the Web Chat SDK automatically refreshes the token in the background every 15 minutes to keep the session alive indefinitely.

## How to set up Microsoft Entra ID (Azure AD)

If you are using this in production, you must secure the `/api/getDirectLineToken` endpoint in `server.js` so it only issues tokens to logged-in employees. 

Here are the official steps to lock down your Copilot Studio bot with Microsoft Entra ID:

### Step 1: Create the Azure App Registration
1. Go to the Azure Portal -> Microsoft Entra ID -> **App registrations** -> **New registration**.
2. Name the application (e.g., `IT Support Copilot Bot`).
3. Under Supported account types, select **Accounts in this organizational directory only (Single tenant)**.
4. Click **Register**.
5. Save the **Application (client) ID** and **Directory (tenant) ID**.

### Step 2: Configure the App Settings
1. Go to **Authentication** -> **Add a platform** -> **Web**.
2. Set the Redirect URI to `https://token.botframework.com/.auth/web/redirect` *(or `https://europe.token.botframework.com/.auth/web/redirect` for Europe data environments)*.
3. Check both `Access tokens` and `ID tokens` under Implicit grant flows, and click Configure.
4. Go to **Certificates & secrets** -> **New client secret**. 
5. Save the **Value** of the secret securely.

### Step 3: Link it to Copilot Studio
1. Open your bot in **Microsoft Copilot Studio**.
2. Go to **Settings** -> **Security** -> **Authentication**.
3. Select **Authenticate manually**.
4. Check **Require users to sign in**.
5. Fill out the fields:
   * **Service provider**: Microsoft Entra ID
   * **Client ID**: Your Application (client) ID
   * **Client secret**: Your Secret Value
   * **Tenant ID**: Your Directory (tenant) ID
   * **Scopes**: `openid profile email`
6. Click **Save** and **Publish** your bot.
