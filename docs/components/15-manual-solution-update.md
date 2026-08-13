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
```
• In your Dev Environment, go to Solutions
• Select your base solution (do not open it, just select the radio button/checkbox)
• Click Clone from the top menu → select Clone a Patch
• The system will prompt you for a version number (it auto-increments the build/revision)
• Click Save
□ Result: A new solution appears named YourSolutionName_Patch_hexcode
```

**STEP P-2 — Add Components to the Patch**
```
• Open the newly created Patch solution
• Click Add existing → select the Copilot Studio Agent or specific sub-components that need fixing
• Make your urgent edits directly within this patch solution
```

**STEP P-3 — Export and Import the Patch**
```
• Export the Patch solution as Managed
• Go to your Test/Prod Environment
• Import the Managed Patch solution
□ Verify: The target environment now runs the base solution + the patch overrides
```

---

## 🚀 Step-by-Step: Cloning to Upgrade

Eventually, you will have too many patches. You need to roll them up before your next major feature release.

**STEP C-1 — Clone the Solution**
```
• In your Dev Environment, select the base solution
• Click Clone from the top menu → select Clone Solution
• The version number will automatically increment the Major or Minor version (e.g., from 1.0 to 1.1)
• Click Save
□ Result: The base solution and all its patches are merged into a single new solution
□ Verify: The separate patch files are automatically deleted from your Dev environment
```

**STEP C-2 — Deploy the Upgrade**
```
• Export the newly cloned solution as Managed
• Go to your Test/Prod Environment
• Import the Managed solution
• CRITICAL: During import, expand the Advanced Settings and select Upgrade 
□ Verify: The system will import the new version, apply it, and delete the old base solution and old patches from the target environment
```

---

## ⏪ Step-by-Step: Rollback a Patch

If you deploy a patch to Production and it breaks the agent, you can quickly roll back to the previous base solution state without needing to re-deploy.

**STEP R-1 — Delete the Managed Patch**
```
• Go to your Test/Prod Environment
• Navigate to Solutions
• Select the Managed Patch you just imported (e.g., YourSolutionName_Patch)
• Click Delete from the top menu
• Confirm the deletion
□ Verify: The patch is removed. The environment instantly reverts to using the components from the base Managed Solution.
```

---

## ⏪ Step-by-Step: Rollback a Major Upgrade (Clone)

Unlike a patch, an *Upgrade* (Clone) deletes the previous version of your solution in the target environment. You cannot simply "delete" the new version to revert, because the old version is already gone. 

To roll back a major upgrade, you must deploy the *previous* state as a *new* update.

**STEP RM-1 — Revert the Code in Dev (or Source Control)**
```
• If using Source Control (Git): Revert your main branch to the commit before the upgrade
• If manually managing Dev: Import your unmanaged backup of the previous version into Dev
• Open the Solution in Dev and increment the version number to be HIGHER than the broken production version (e.g., if broken Prod is 1.1.0.0, make the rollback version 1.1.0.1)
```

**STEP RM-2 — Export and Deploy the Rollback**
```
• Export the reverted solution as Managed
• Go to your Test/Prod Environment
• Import the Managed solution
• Expand Advanced Settings and select Upgrade
□ Verify: The system imports the old components (packaged as a new version) and overwrites the broken configuration
```

> **Data Loss Warning:** If the major upgrade caused catastrophic data loss in Dataverse tables, deploying a rollback solution will NOT restore the deleted data. You must instead perform a Point-in-Time Environment Restore from the Power Platform Admin Center to roll back the entire environment's database to before the import.

---

## ⚠️ Limits & Constraints

| Limit/Constraint | Details |
|---|---|
| **Patch dependencies** | You cannot delete a base solution if it has active patches. |
| **Patching managed solutions** | You can only create patches from *Unmanaged* solutions in your Dev environment. |
| **Rollback** | If a patch breaks production, you can delete the managed patch from the Prod environment to instantly revert to the base solution's behavior. |

---

**Back to:** [Component Reference](README.md)
