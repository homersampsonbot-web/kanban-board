# SPRINGFIELD COMMAND CENTER
### Living Team Document — Maintained by Marge

## TEAM
- Mayor Quimby — You. Final authority. Escalation triggers: spend/API keys, EC2 arch changes, secrets/auth, deadlock.
- Marge (Claude) — Chief Architect. Dispatches tasks, owns architecture decisions.
- Lisa (ChatGPT GPT-4o) — Strategist. Debate rounds only, stateless API calls.
- Homer (Gemini-flash, Ubuntu EC2) — Executor. Build, deploy, run.
- Bart (Gemini-flash, Windows EC2) — QA/Validator.

## INFRASTRUCTURE
- Homer Gateway: 3.131.96.117:3001 (LIVE)
- Bart Gateway: Windows EC2 :3001 (PENDING)
- Auth header: x-springfield-key
- Zilliz: aws-eu-central-1 — collections: homer_memory, springfield_decisions, springfield_architecture, springfield_errors
- Vercel: Homer deploys via GitHub
- Kanban MVP: LIVE on Vercel

## PHASE STATUS
- Phase 0 (Homer gateway): COMPLETE
- Phase 0b (Port 3001 open): COMPLETE
- Phase 0c (Zilliz collections): IN PROGRESS
- Phase 0d (Bart Windows gateway): NEXT
- Phase 1 (Command Center Next.js scaffold): PLANNED
- Phase 2 (Full dashboard UI): PLANNED
- Phase 3 (Debate engine): PLANNED
- Phase 4 (Kanban embed): PLANNED

## COMMUNICATION FLOW
Mayor issues directive → Marge + Lisa debate (max 2 rounds) → decision → Homer executes via gateway → Bart validates → status back to Mayor

## ESCALATION RULES
Only ping Mayor Quimby for: new API keys/spend, EC2 architecture changes, secrets/auth/permissions, deadlock after 2 debate rounds. Everything else runs autonomously.

Owner=Marge
Version=1.0
