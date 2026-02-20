# 🔒 Branch Protection Guide

How to protect the `main` branch so that **CI must pass before any PR can be merged**.

This repo uses GitHub **Rulesets** (the modern replacement for classic branch protection rules).

---

## Prerequisites

- PR #2 (`bootstrap-project`) must be merged so that `.github/workflows/ci.yml` exists on `main`.  
  ✅ Already done.

---

## Steps

### 1. Open Rulesets

Go to your repository on GitHub, then:

```
Settings → Rules → Rulesets → New ruleset → New branch ruleset
```

---

### 2. Configure the ruleset

| Field | Value |
|---|---|
| **Ruleset name** | `Protect main` |
| **Enforcement status** | Active |
| **Target branches** | Include by pattern → `main` |

---

### 3. Enable the rules you want

**Minimum recommended settings:**

- ✅ **Restrict deletions** — prevents the branch from being deleted  
- ✅ **Require a pull request before merging** — no direct pushes to `main`  
- ✅ **Require status checks to pass** — CI must be green before merge  
- ✅ **Block force pushes** — prevents history rewriting

---

### 4. Add the required status check

Under **"Require status checks to pass"**:

1. Click **Add checks**
2. Search for and select:

   ```
   Typecheck & Test
   ```

   This matches the `name:` field of the job in `.github/workflows/ci.yml`.

3. Optionally enable **"Require branches to be up to date before merging"** to ensure CI always runs against the latest `main`.

---

### 5. Save

Click **Create** (or **Save changes**). The ruleset is now active.

---

## How it works after this

Every PR targeting `main` will:

1. Trigger the `CI` workflow automatically
2. Run `yarn typecheck` and `yarn test`
3. Be blocked from merging until the `Typecheck & Test` job reports ✅

---

## Bypassing the ruleset (emergency only)

If you ever need to merge without CI (e.g. to land the workflow file itself):

```
Settings → Rules → Rulesets → Protect main → Bypass list → Add bypass → Repository admin
```

This lets the repo owner merge once without CI passing. Remove it again afterwards.
