# SolveGrid SEO Recovery Auditor — Phase 3

This phase turns the Phase 2 analyst plan into a **source-code recovery audit**.

It is intentionally read-only:
- no production edits
- no Git commands
- no commits or pushes
- no deployment
- no title/H1/URL/canonical changes

## Install

Extract this ZIP into the SolveGrid project root.

Files added:

```text
scripts/seo/run-recovery-audit.mjs
scripts/seo/lib/recovery-auditor.mjs
scripts/seo/test-recovery-auditor.mjs
SEO_RECOVERY_AUDIT_PHASE3_SETUP.md
```

Add these scripts inside `package.json`:

```json
"seo:audit": "node scripts/seo/run-recovery-audit.mjs",
"seo:audit:test": "node scripts/seo/test-recovery-auditor.mjs"
```

Keep your existing SEO scripts.

## Required input

Run Phase 2 first so this exists:

```text
seo-output/analyst-plan.json
```

## Test

```powershell
npm run seo:audit:test
```

Expected:

```text
SEO Recovery Auditor Phase 3 tests passed.
```

## Run

```powershell
npm run seo:audit
```

Outputs:

```text
seo-output/recovery-audit.md
seo-output/recovery-audit.json
```

## Normal workflow

```powershell
npm run seo:monitor:csv
npm run seo:analyst
npm run seo:audit
```

Send back `recovery-audit.md` and `recovery-audit.json`. They will be used to prepare the first safe implementation pack.
