# ARXON AGENT ORCHESTRATOR

## Company Context
**Arxon** (arxon.no) — AI-powered business phone and voicemail SaaS for Norwegian SMBs.
- **Stack**: Next.js 14+ (App Router), TypeScript, Supabase, Stripe, Vapi, n8n, Vercel
- **Market**: Norwegian small businesses (2-50 employees) — håndverkere, tannleger, eiendom, advokater, regnskapsførere, restauranter
- **Revenue model**: Monthly subscriptions (990-4990 NOK/month), configured via pakkebygger
- **Stage**: Early-stage, solo founder (Younes), AI agent team handles operations

## Agent Roster

| Agent | Role | Primary Tools | Runs On |
|-------|------|---------------|---------|
| **Research** | Market intel, competitor tracking, customer insights | Web search, Supabase, GitHub | Kimi (daily), n8n (weekly cron) |
| **Content** | Blog posts, emails, social media — all Norwegian bokmål | OpenAI, GitHub, Web search | Antigravity (parallel) |
| **Dev** | Code changes, bug fixes, features, DB migrations | GitHub, Supabase CLI, Vercel, Sentry | Antigravity (parallel) |
| **Growth** | SEO, ads, CRO, analytics, funnel optimization | Web search, Supabase, Stripe, Vercel | Kimi (daily), Antigravity |
| **Outreach** | Lead gen, cold outreach, partnerships | Web search, Supabase, Slack, Email | Kimi (daily) |
| **Voice** | Vapi assistants, call flows, scripts, quality audits | Vapi API, Twilio, Supabase, ElevenLabs | Antigravity (parallel) |
| **Ops** | Monitoring, costs, incidents, GDPR, n8n management | Vercel, Supabase, Stripe, Sentry, n8n, Slack | n8n (cron), Kimi (on-demand) |

## Routing Rules

When a task comes in, route it using these rules IN ORDER:

### 1. Keyword Match
- "blog", "post", "artikkel", "innhold", "email copy", "social media" → **Content**
- "bug", "feature", "deploy", "error", "code", "migration", "API route" → **Dev**
- "SEO", "ads", "conversion", "funnel", "analytics", "CRO", "keyword" → **Growth**
- "lead", "outreach", "cold email", "partnership", "prospect", "salg" → **Outreach**
- "vapi", "call", "voice", "script", "telefon", "mobilsvarer", "samtale" → **Voice**
- "competitor", "market", "research", "trend", "rapport", "analyse" → **Research**
- "deploy", "cron", "incident", "cost", "monitor", "GDPR", "n8n", "health" → **Ops**

### 2. Multi-Agent Tasks
Some tasks need multiple agents working together:

| Scenario | Agents | Sequence |
|----------|--------|----------|
| Launch new industry vertical | Research → Content + Growth (parallel) → Dev → Outreach | Pipeline |
| New blog post (full cycle) | Research (keywords) → Content (write) → Growth (optimize) → Dev (publish) | Pipeline |
| Customer onboarding flow | Dev (feature) + Voice (scripts) + Ops (monitoring) | Parallel |
| Incident response | Ops (diagnose) → Dev (fix) → Ops (verify) → Content (status page) | Pipeline |
| Monthly review | Ops (costs) + Growth (metrics) + Research (market) → all feed into report | Fan-in |

### 3. Priority Framework
| Priority | Criteria | Response Time | Escalate After |
|----------|----------|---------------|----------------|
| **P0 — Fire** | Site down, payments broken, data breach | Immediately | 15 min |
| **P1 — Urgent** | Feature broken for customers, Vapi down, security issue | < 1 hour | 4 hours |
| **P2 — Important** | New feature, optimization, content deadline | < 24 hours | 3 days |
| **P3 — Normal** | Research, backlog items, nice-to-haves | < 1 week | 2 weeks |

### 4. Escalation to Younes
Agents MUST escalate to Younes (not try to resolve alone) when:
- Any decision involving money > 500 NOK (ad spend, tool purchases, hiring)
- Changing pricing or subscription packages
- Responding to customer complaints publicly
- Any legal/GDPR incident
- Deleting production data
- Changing Stripe webhook endpoints
- Adding new third-party services
- Any P0 or unresolved P1

**How to escalate**: Post in Slack #arxon-alerts with: what happened, what you tried, what you recommend, and tag @younes.

## Inter-Agent Communication Protocol

### Handoff Format
When one agent hands work to another, use this format in `shared/handoffs.md`:
```
## [DATE] [FROM-AGENT] → [TO-AGENT]
**Task**: One-line description
**Context**: What was done, what's needed next
**Files**: List of relevant files/outputs created
**Deadline**: When this needs to be done by
**Priority**: P0/P1/P2/P3
```

### Shared State Rules
1. **Read before write**: Always read `shared/status.md` before starting work to avoid conflicts
2. **Atomic updates**: Update status.md immediately when you start AND finish a task
3. **No silent failures**: If a task fails, log it in status.md with the error — don't just stop
4. **Output everything**: Every piece of work produces a file in `outputs/` — no work without artifacts

### Conflict Resolution
If two agents need to modify the same file:
1. Dev agent always wins on code files
2. Content agent always wins on copy/text
3. For config files, the agent who owns the system (Ops for infra, Voice for Vapi) wins
4. When unclear → escalate to Younes

## Codebase Map

```
Arxon-main/
├── app/
│   ├── page.tsx                         # Landing page — Growth owns SEO, Dev owns code
│   ├── admin/                           # Admin dashboard — Dev + Ops
│   ├── api/
│   │   ├── auth/                        # Supabase + Microsoft OAuth — Dev
│   │   ├── stripe/                      # Checkout sessions + webhooks — Dev + Ops
│   │   ├── cron/
│   │   │   ├── admin-digest/            # Daily admin email — Ops
│   │   │   ├── gdpr-cleanup/            # Data retention — Ops
│   │   │   ├── lead-followup/           # Auto follow-up — Outreach + Dev
│   │   │   └── incomplete-reminder/     # Nudge incomplete signups — Growth + Dev
│   │   ├── n8n/                         # n8n deploy + status — Ops
│   │   ├── webhooks/
│   │   │   ├── ai-process/              # AI processing — Voice + Dev
│   │   │   ├── bookings/               # Booking webhook — Dev
│   │   │   ├── calls/                  # Vapi call events — Voice + Dev
│   │   │   ├── leads/                  # Lead intake — Outreach + Dev
│   │   │   └── n8n/                    # n8n webhook — Ops
│   │   ├── kartlegging/                # Customer assessment — Dev + Voice
│   │   ├── onboarding/                 # Onboarding flow — Dev
│   │   └── workflows/                  # Workflow management — Dev + Ops
│   ├── blogg/                          # Norwegian blog — Content + Growth (SEO)
│   ├── bransjer/[slug]/               # Industry pages — Content + Growth + Research
│   ├── tjenester/                      # Services page — Content + Growth
│   ├── mobilsvarer/                    # Voicemail product — Content + Voice
│   ├── pakkebygger/                    # Package builder (40KB) — Dev + Growth
│   ├── priser/                         # Pricing page — Growth + Dev
│   ├── bestilling/                     # Order/checkout flow — Dev + Growth
│   └── support/                        # Support page — Content
│
├── lib/
│   ├── supabase.ts / supabase-server.ts    # DB clients — Dev
│   ├── stripe.ts                           # Stripe client — Dev + Ops
│   ├── openai.ts                           # OpenAI integration — Dev + Voice
│   ├── useVapi.ts                          # Vapi demo/sales hook — Voice + Dev
│   ├── useVapiKundeservice.ts              # Vapi customer service (17KB) — Voice + Dev
│   ├── n8n-templates.ts                    # n8n templates (21KB) — Ops + Dev
│   ├── workflow-orchestrator.ts            # Workflow engine — Dev + Ops
│   ├── pricing.ts                          # Pricing logic (19KB) — Dev + Growth
│   ├── services.ts                         # Service definitions (19KB) — Dev
│   ├── industries.ts                       # Industry data — Research + Content + Dev
│   ├── email-templates.ts                  # Email templates — Content + Outreach + Dev
│   └── translations.ts                     # i18n — Content + Dev
│
├── supabase/
│   ├── schema.sql                          # Master schema — Dev + Ops
│   ├── phase1-migration.sql               # Migration — Dev
│   └── stripe-schema.sql                  # Stripe tables — Dev + Ops
│
├── components/                             # Shared React components — Dev
├── middleware.ts                           # Route middleware (5KB) — Dev
├── vercel.json                            # Vercel config + cron — Ops + Dev
└── .github/workflows/notify-kimi.yml      # CI → Kimi notification — Ops
```

## Connected Services Access

| Service | URL/ID | Used By | Auth Method |
|---------|--------|---------|-------------|
| Supabase | aqqwailbeotauehyrwpy.supabase.co | All agents | Service key in .env |
| Stripe | acct_1NIrtuCItvDn1c1B | Dev, Ops, Growth | Stripe secret key |
| Vapi | — | Voice, Dev | API key in .env |
| Vercel | — | Dev, Ops | Vercel token |
| GitHub | Arxon-main repo | All agents | PAT |
| n8n | — | Ops, Dev | API key |
| Sentry | — | Dev, Ops | Sentry token |
| OpenAI | — | Content, Voice, Dev | API key |
| Slack | #arxon-alerts, #arxon-dev | All agents | Webhook URL |
| Google Workspace | kontakt@arxon.no | Outreach, Ops | OAuth (11 scopes) |
| Twilio | — | Voice | Account SID + Auth token |

## Shared Files

| File | Purpose | Updated By |
|------|---------|------------|
| `shared/status.md` | Sprint board + activity log | All agents |
| `shared/handoffs.md` | Inter-agent task handoffs | All agents |
| `shared/decisions.md` | Architecture & business decisions (ADRs) | Dev, Ops, Younes |
| `shared/metrics.md` | KPIs dashboard | Growth, Ops |
| `playbooks/*.md` | Standard operating procedures | Relevant agent |

## Quality Standards

Every agent output must:
1. **Be actionable** — no vague recommendations, always specific next steps
2. **Reference real data** — cite Supabase queries, Stripe metrics, actual URLs
3. **Include timestamps** — when was data collected, when does it expire
4. **Follow naming conventions** — `outputs/[agent]/[type]-YYYY-MM-DD.md`
5. **Norwegian for external** — all customer-facing content in Norwegian bokmål
6. **English for internal** — all agent reports and technical docs in English
