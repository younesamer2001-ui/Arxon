# KIMI SELF-REPAIR & DEBUG GUIDE

## WHEN SOMETHING BREAKS — FOLLOW THIS ORDER

### Step 1: Identify what's broken
```bash
# Check if the site is up
curl -s -o /dev/null -w "%{http_code}" https://arxon.no

# Check Vercel deployment status
kimi-bridge vercel deployments

# Check Sentry for recent errors
kimi-bridge sentry issues

# Check Supabase health
kimi-bridge supabase query "SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"
```

### Step 2: Common issues and fixes

#### Site returns 500 or is down
```bash
# Check latest deployment
kimi-bridge vercel deployments
# Check deployment logs
kimi-bridge vercel logs <deployment-id>
# If bad deploy, roll back
kimi-bridge vercel rollback
```

#### Stripe webhooks failing
```bash
# Check recent webhook events
kimi-bridge stripe webhook-events
# Check Sentry for stripe-related errors
kimi-bridge sentry issues --query "stripe"
```

#### Supabase connection issues
```bash
# Check active connections (max ~60 for free tier)
kimi-bridge supabase query "SELECT count(*) FROM pg_stat_activity"
# Kill idle connections if needed
kimi-bridge supabase query "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query_start < now() - interval '10 minutes'"
# Check DB size
kimi-bridge supabase query "SELECT pg_size_pretty(pg_database_size(current_database()))"
```

#### Vapi calls failing
```bash
# Check recent calls
kimi-bridge vapi calls --limit 10
# Check assistant config
kimi-bridge vapi assistants
# Look for error patterns in recent calls
kimi-bridge vapi calls --status error --limit 5
```

#### n8n workflows stuck
```bash
# Check workflow executions
kimi-bridge n8n executions --status error
# Restart a workflow
kimi-bridge n8n workflow-activate <workflow-id>
```

### Step 3: If you can't fix it
1. Document what you found
2. Tell Younes: "I found [problem] in [service]. I tried [actions]. The issue is [diagnosis]. I need your help with [specific action]."
3. Never guess — if unsure, ask.

## DAILY HEALTH CHECK (run every morning)
```bash
echo "=== ARXON DAILY HEALTH CHECK ==="
echo "--- Site Status ---"
curl -s -o /dev/null -w "arxon.no: %{http_code}\n" https://arxon.no
echo "--- Vercel ---"
kimi-bridge vercel deployments | head -5
echo "--- Sentry (last 24h) ---"
kimi-bridge sentry issues --period 24h
echo "--- Supabase ---"
kimi-bridge supabase query "SELECT count(*) as active_users FROM auth.users WHERE last_sign_in_at > now() - interval '24 hours'"
echo "--- Stripe (today) ---"
kimi-bridge stripe revenue --period today
echo "=== END ==="
```

## WHEN ANTIGRAVITY GIVES A 503 ERROR
This means Google's Gemini servers are overloaded. Tell Younes:
"Antigravity got a 503 — Gemini servers are full. Switch the model dropdown to Gemini Flash or wait 30-60 seconds and retry."
This is NOT a bug in Arxon — it's Google's capacity issue.

## GIT WORKFLOW (when fixing code)
```bash
cd /root/arxon-project
git pull                          # Always pull first
# Make changes...
git add -A
git commit -m "fix: description of what was fixed"
git push origin main              # This auto-deploys on Vercel
```

## LEARNING FROM MISTAKES
After every debug session, append what you learned to your memory:
```
What broke: [description]
Root cause: [why]
Fix: [what worked]
Prevention: [how to stop it happening again]
```
Save this to /root/arxon-ops/memory/debug-log.md
