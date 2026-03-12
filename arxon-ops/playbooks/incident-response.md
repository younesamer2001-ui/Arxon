# Playbook: Incident Response

**Trigger**: Sentry alert, customer report, or monitoring threshold breached
**Lead agent**: Ops (coordinates all others)

## Severity Classification

| Level | Definition | Response | Notify Younes? |
|-------|-----------|----------|----------------|
| P1 | Site down or all calls failing | Immediate | Yes — always |
| P2 | Feature broken, some customers affected | <1 hour | Yes — if >30min |
| P3 | Minor issue, workaround exists | <4 hours | No |
| P4 | Cosmetic, no customer impact | Next sprint | No |

## P1 Response (Site Down / Calls Failing)

### Minute 0–5: Detect & Alert
1. **Ops**: Confirm the issue (not a false alarm)
2. **Ops**: Post in Slack #ops-alerts: "🔴 P1: [description]. Investigating."
3. **Ops**: Notify Younes directly

### Minute 5–15: Diagnose
1. **Ops**: Check Vercel (deployment status, function logs)
2. **Ops**: Check Sentry (error details, stack trace)
3. **Ops**: Check Supabase (connection pool, DB status)
4. **Dev**: If code-related, identify the breaking change

### Minute 15–30: Mitigate
1. **Option A**: Rollback to last known good deployment (Vercel)
2. **Option B**: Disable broken feature via feature flag
3. **Option C**: Hotfix if rollback isn't possible
4. **Ops**: Confirm mitigation worked — monitor for 15min

### After Resolution: Document
1. **Ops**: Write incident report (`outputs/logs/incident-YYYY-MM-DD.md`)
2. **Content**: If customer-facing impact, draft status update
3. **Dev**: Create follow-up ticket to prevent recurrence

## P2 Response (Feature Broken)
1. **Ops**: Identify scope — which customers are affected?
2. **Dev**: Diagnose and fix
3. **Ops**: Deploy fix and monitor
4. **Content**: Notify affected customers if needed

## Incident Report Template
```markdown
# Incident: [Title]
**Date**: YYYY-MM-DD
**Severity**: P1/P2/P3
**Duration**: Start time → End time (X minutes)
**Impact**: Who was affected and how

## Timeline
- HH:MM — Issue detected via [source]
- HH:MM — Investigation started
- HH:MM — Root cause identified
- HH:MM — Fix deployed
- HH:MM — Confirmed resolved

## Root Cause
[What went wrong and why]

## Resolution
[What was done to fix it]

## Prevention
[What we'll change to prevent this from happening again]
```
