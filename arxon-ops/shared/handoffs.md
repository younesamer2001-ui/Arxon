# Agent Handoff Log

_Active inter-agent task transfers. Each agent adds entries when handing off work._

## Format
```
### [HO-XXX] Title
- **From**: Agent → **To**: Agent
- **Priority**: P0/P1/P2/P3
- **Status**: pending | in-progress | completed | blocked
- **Created**: YYYY-MM-DD
- **Context**: What was done, what needs to happen next
- **Deliverable**: Expected output file or action
```

## Active Handoffs

_None yet — handoffs will appear here as agents begin collaborating._

## Completed Handoffs

_Archive of resolved handoffs for reference._

---

## Quick Reference: Who Hands Off to Whom

| From → To | Common Triggers |
|-----------|----------------|
| Research → Content | Market data ready for blog post or case study |
| Research → Outreach | New industry leads researched and scored |
| Research → Growth | Competitor analysis or market sizing complete |
| Content → Dev | Blog post needs publishing (code changes) |
| Content → Growth | New content ready for distribution/SEO tracking |
| Content → Outreach | Case study or collateral ready for sales use |
| Dev → Ops | Code deployed, needs monitoring or env var setup |
| Dev → Voice | Vapi hook or webhook code updated |
| Growth → Content | SEO keyword gaps identified, content briefs ready |
| Growth → Dev | A/B test needs implementation or tracking code |
| Growth → Outreach | High-intent leads from analytics |
| Outreach → Voice | Lead wants a demo call |
| Outreach → Content | Needs case study or collateral for specific industry |
| Outreach → Research | Needs deeper data on a target industry |
| Voice → Dev | Bug in Vapi hook or webhook code |
| Voice → Ops | Voice infra issue (Twilio, Vapi down) |
| Voice → Content | Need industry-specific voice scripts |
| Ops → Dev | Infrastructure bug needs code fix |
| Ops → Voice | High Vapi costs need optimization |
| Ops → All | P1 incident — all hands on deck |
