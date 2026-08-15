# 17. Web Channel Setup with Single Sign-On (SSO)

This guide provides detailed instructions on how to set up a custom web channel for your Copilot Studio agent and restrict access to authenticated users only via Microsoft Entra ID.

These steps are sourced from Matthew Devaney's guide: [Copilot Studio: Publish To Website With Single Sign-On](https://www.matthewdevaney.com/copilot-studio-publish-to-website-with-single-sign-on/).

---

## 🔐 Step 1: Enable Microsoft Authentication in Copilot Studio
Before publishing your agent, you must configure it to authenticate users based on their Microsoft 365 accounts.
1. Open your agent in **Copilot Studio**.
2. Go to the **Settings** menu and open **Authentication**.
3. Choose the option **Authenticate with Microsoft**.
4. Save the settings and **Publish** the agent.

---

## 🛠️ Step 2: Register an Application in Microsoft Azure
You need to register an application in Azure to authenticate users when they open the agent in a webpage.
1. Go to the [Azure Portal](https://portal.azure.com/) and search for **App registrations**.
2. Click **New registration**.
3. **Name**: Provide a name, such as `Web Chat SSO (MS Authentication)`.
4. **Supported account types**: Choose **Single tenant** only.
5. Click **Register**.
6. On the **Overview** page, copy the **Application (client) ID** and **Directory (tenant) ID** to a notepad—you will need them later.

---

## 🔑 Step 3: Grant API Permissions
Give the Azure application permission to invoke your Copilot Studio agent.
1. In the App Registration menu, go to **API permissions**.
2. Click **Add a permission**.
3. Under the **APIs my organization uses** tab, search for and select **Power Platform API**.
4. Choose **Delegated permissions** (so the app accesses the API as the signed-in user).
5. Check the box for **CopilotStudio.Copilots.Invoke**.
6. Click **Add permissions**.
7. Click **Grant admin consent for [Your Organization]** to apply the permissions.

---

## 🔄 Step 4: Add a Redirect URI (Local Testing)
Define which webpages a user can perform authentication from.
1. In the App Registration menu, go to **Authentication**.
2. Click **Add a platform** and select **Single-page application (SPA)**.
3. For local testing, enter the Redirect URI: `http://localhost:5500`. *(We will add the live URL later).*
4. Check the boxes for both **Access tokens** and **ID tokens**.
5. Click **Configure**.

---

## 📥 Step 5: Download & Configure the Web Chat Client
Microsoft provides a free web client. We will use the Node.js version.
1. Go to the Microsoft Agents GitHub repository: [`samples/nodejs/copilotstudio-webclient/web`](https://github.com/microsoft/Agents/tree/main/samples/nodejs/copilotstudio-webclient/web).
2. Download all files in this folder to your local machine.
3. Rename the `settings.template.js` file to `settings.js`.
4. Open `settings.js` in a code editor and update the connection settings properties:
   - `appClientId`: Paste your Application (client) ID.
   - `tenantId`: Paste your Directory (tenant) ID.
   - `environmentId`: Found in Copilot Studio under **Settings > Advanced > Metadata**.
   - `agentIdentifer`: Also found in Copilot Studio as the Schema name.

*(Optional)*: Test the configuration on your local machine by opening `index.html` using a tool like VS Code's **Live Server** extension on port 5500.

---

## 🌐 Step 6: Host on Azure Blob Storage
To host your web client live, deploy it using an Azure Blob Storage static website.
1. In the Azure Portal, create a new **Storage account**.
2. Choose **Standard** performance and **Locally-redundant storage (LRS)**.
3. Once deployed, open the Storage account and scroll to **Data management > Static website**.
4. Toggle **Static website** to **Enabled**.
5. Set the **Index document name** to `index.html` and **Error document path** to `404.html`.
6. Click **Save**. Azure will generate a **Primary endpoint** URL.

---

## 📂 Step 7: Upload Web Client Files
1. In the Storage account left menu, go to **Data storage > Containers**.
2. Click on the newly created **$web** container.
3. Click **Upload** and upload all 6 of your web client files (including the configured `settings.js`).

---

## 🚀 Step 8: Add Redirect to the Primary Endpoint
Now that your web client is hosted online, you must authorize its live URL in your App Registration.
1. Go back to your Azure **App Registration** > **Authentication**.
2. Under Single-page application, add a new **Redirect URI**.
3. Paste the **Primary endpoint** URL generated from your Blob Storage account.
4. Click **Save**.

Your custom web chat canvas is now live! Anyone visiting the Primary endpoint URL will be prompted to sign in using their Microsoft 365 account to chat with the agent.

---
**Back to:** [Component Reference](../README.md)
