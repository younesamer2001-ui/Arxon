# Architecture Decision Records (ADRs)

_All significant decisions documented here. New entries go at the bottom._

---

## ADR-001: Three-Tool Architecture
**Date**: 2026-03-12
**Status**: Accepted
**Decision**: Use Kimi + Google Antigravity + n8n as the three-tool agent architecture.
**Context**: Needed parallel agent execution, daily interactive assistance, and background automation. No single tool covers all three.
**Consequences**:
- Kimi: Daily assistant with 12 API connections via kimi-bridge (bash CLI)
- Antigravity: Parallel agent orchestrator connected to GitHub repo
- n8n: Background cron automation (health checks, follow-ups, digests)
- All three share Supabase, Slack, and GitHub as integration points

---

## ADR-002: Agent-Driven Development Mode
**Date**: 2026-03-12
**Status**: Accepted
**Decision**: Selected "Agent-driven development" mode in Google Antigravity.
**Context**: Antigravity offers three modes. Agent-driven gives the most autonomy to AI agents, which aligns with our goal of running 7 specialized agents in parallel.

---

## ADR-003: Agent Instruction File Format
**Date**: 2026-03-12
**Status**: Accepted
**Decision**: Each agent gets a detailed markdown file with: identity, responsibilities, tools, key files, standard tasks with numbered steps, handoff protocols, invocation examples, quality checklists, and constraints.
**Context**: Initial lightweight agent files were too vague for effective autonomous operation. Detailed files with example SQL queries, code patterns, and scoring models give agents enough context to act independently.

---

_Template for new ADRs:_
```
## ADR-XXX: Title
**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Superseded by ADR-XXX
**Decision**: What was decided.
**Context**: Why this decision was needed.
**Consequences**: What changes as a result.
```
