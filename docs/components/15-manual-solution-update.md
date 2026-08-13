# 15. Manual Solution Update (Patch & Clone)

**Video Reference:** [Patch and Clone Solution in Power Platform](https://www.youtube.com/watch?v=vnG3i1aemOg)

When managing Copilot Studio agents (and other Power Platform components) via solutions, you don't always want to redeploy the entire massive solution just to fix a single typo in a topic. This is where **Patching** and **Cloning** come in for manual solution updates.

---

## 🛠️ The Concepts

### 1. Solution Patch (The Hotfix)
A patch is a small, incremental update to a parent solution. You create a patch when you need to deploy an urgent bug fix (like fixing a broken topic or updating an environment variable) without exporting/importing the entire solution.
*   **Version impact:** Modifies the *Build* or *Revision* number (e.g., `1.0.0.0` → `1.0.1.0`).
*   **Content:** Only contains the specific components you added or modified.

### 2. Solution Clone (The Roll-up)
Cloning takes your base solution and **rolls up** all existing patches into a brand new version. This cleans up your environment by merging the base and patches back into a single deployable unit.
*   **Version impact:** Modifies the *Major* or *Minor* number (e.g., `1.0.1.0` → `1.1.0.0`).
*   **Content:** Contains the full solution plus all applied patches.

---

## 📝 Step-by-Step: Creating and Deploying a Patch

When an urgent fix is needed in Production, follow these steps in your Development environment:

**STEP P-1 — Create the Patch**
1. In your **Dev Environment**, go to Solutions.
2. Select your base solution (do not open it, just select the radio button/checkbox).
3. Click **Clone** from the top menu, then select **Clone a Patch**.
4. The system will prompt you for a version number (it auto-increments the build/revision).
5. Click **Save**. A new solution appears named `YourSolutionName_Patch_hexcode`.

**STEP P-2 — Add Components to the Patch**
1. Open the newly created Patch solution.
2. Click **Add existing** → select the Copilot Studio Agent or specific sub-components (like a specific flow) that need fixing.
3. Make your urgent edits directly within this patch solution.

**STEP P-3 — Export and Import the Patch**
1. **Export** the Patch solution as **Managed**.
2. Go to your **Test/Prod Environment**.
3. **Import** the Managed Patch solution.
4. The target environment now runs the base solution + the patch overrides.

---

## 🚀 Step-by-Step: Cloning to Upgrade

Eventually, you will have too many patches. You need to roll them up before your next major feature release.

**STEP C-1 — Clone the Solution**
1. In your **Dev Environment**, select the base solution.
2. Click **Clone** from the top menu, then select **Clone Solution**.
3. The version number will automatically increment the Major or Minor version (e.g., from `1.0` to `1.1`).
4. Click **Save**.
5. *Result:* The base solution and all its patches are merged into a single new solution. The separate patch files are automatically deleted from your Dev environment.

**STEP C-2 — Deploy the Upgrade**
1. **Export** the newly cloned solution as **Managed**.
2. Go to your **Test/Prod Environment**.
3. **Import** the Managed solution.
4. **CRITICAL:** During import, expand the **Advanced Settings** and select **Upgrade** (this is usually the default when importing a higher version).
5. The system will import the new version, apply it, and delete the old base solution and old patches from the target environment.

---

## ⚠️ Limits & Constraints

| Limit/Constraint | Details |
|---|---|
| **Patch dependencies** | You cannot delete a base solution if it has active patches. |
| **Patching managed solutions** | You can only create patches from *Unmanaged* solutions in your Dev environment. |
| **Rollback** | If a patch breaks production, you can delete the managed patch from the Prod environment to instantly revert to the base solution's behavior. |

---

**Back to:** [Component Reference](README.md)
