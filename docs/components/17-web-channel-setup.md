# 17. Web Channel Setup (Static Website)

This guide provides detailed instructions on how to set up a custom web channel for your Copilot Studio agent by deploying a static website using Azure Blob Storage. 

These steps are extracted directly from the [Copilot Studio Web Chat SSO tutorial (16:15)](https://www.youtube.com/watch?v=dUXE4FTx9Cw&t=975s).

---

## 🛠️ Step 1: Create an Azure Storage Account
To host your custom web canvas, you need a place to store your HTML, CSS, and JS files.

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Navigate to **Storage accounts** from the home screen.
3. Click **Create** to spin up a new storage account.
4. **Resource Group**: Create a new one (e.g., `web-chat-sso`) to keep these resources organized.
5. **Storage account name**: Provide a globally unique name (e.g., `webchatssostatic`). 
   > **Note:** The name can *only* contain lowercase letters and numbers (no spaces, dashes, or capitals).
6. **Redundancy**: Choose **Locally-redundant storage (LRS)**. This is the cheapest option and perfectly fine for a simple web chat host or trial.
7. Click **Review + create**, and then click **Create**.
8. Wait a few moments for the deployment to finish, then click **Go to resource**.

---

## 🌐 Step 2: Enable Static Website Hosting
Now that the storage account exists, you need to configure it to act as a web server.

1. In the left-hand menu of your new Storage Account, scroll down to the **Data management** section and click on **Static website**.
2. Toggle the setting to **Enabled**.
3. You will be prompted to provide two document names:
   * **Index document name**: Type `index.html`
   * **Error document path**: Type `404.html`
4. Click **Save** at the top.
5. Azure will generate a **Primary endpoint** URL (e.g., `https://webchatssostatic.z13.web.core.windows.net/`). This is the public URL where your bot will be hosted. 
   > ⚠️ **Security Warning:** This primary endpoint is served over the public internet. Anyone who has the link can access the webpage. Ensure you are not hooking this up to a Copilot containing sensitive information without having proper authentication/SSO configured first.

---

## 📂 Step 3: Upload Your Web Files
When you enabled the static website feature, Azure automatically created a hidden container named `$web` to store your files.

1. In the left-hand menu, under **Data storage**, click on **Containers**.
2. Click on the newly created **$web** container.
3. Click the **Upload** button at the top.
4. Open your local File Explorer (or VS Code) where your custom canvas files are stored.
5. Select all your web files (e.g., `index.html`, scripts, CSS) and drag-and-drop them into the Azure upload pane (or use the browse button).
6. Click **Upload**.

---

## 🚀 Step 4: Test Your Web Chat
Your web files are now live and being served!

1. Go back to the **Static website** menu on the left.
2. Copy the **Primary endpoint** URL.
3. Open a new browser tab (or an incognito/guest profile).
4. Paste the endpoint URL and hit Enter.
5. You should now see your custom web chat canvas load successfully and connect to your Copilot Studio agent!

---

**Back to:** [Component Reference](../README.md)
