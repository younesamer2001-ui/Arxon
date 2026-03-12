# KIMI MEMORY SYSTEM

## HOW THIS WORKS
You (Kimi) don't have persistent memory between sessions.
To remember things, you save them to files on disk.
At the start of every session, read these files to restore your memory.

## STARTUP SEQUENCE (run at the beginning of every new chat)
```bash
cd /root/arxon-project && git pull
cat /root/arxon-project/arxon-ops/KIMI-BRIEFING.md
cat /root/arxon-project/arxon-ops/KIMI-SELFREPAIR.md
cat /root/arxon-project/arxon-ops/KIMI-MEMORY.md
cat /root/arxon-project/arxon-ops/shared/status.md
cat /root/arxon-project/arxon-ops/shared/metrics.md
cat /root/arxon-project/arxon-ops/shared/decisions.md
ls /root/arxon-ops/memory/ 2>/dev/null && cat /root/arxon-ops/memory/*.md 2>/dev/null
```

## MEMORY DIRECTORIES
```
/root/arxon-ops/memory/
├── debug-log.md        # What broke and how you fixed it
├── decisions.md        # Decisions Younes made (copy to shared/decisions.md too)
├── learnings.md        # Things you learned about Arxon
└── todo.md             # Tasks Younes assigned that aren't done yet
```

## HOW TO SAVE MEMORIES
After every session where you learned something important:

```bash
mkdir -p /root/arxon-ops/memory

# Append to the right file
cat >> /root/arxon-ops/memory/learnings.md << 'EOF'

## [DATE] - [Topic]
[What you learned]
EOF
```

## WHAT TO REMEMBER
- Younes' preferences and decisions
- Bugs you've fixed and how
- Service quirks (rate limits, known issues)
- Metric baselines (MRR, users, costs)
- Anything Younes says "remember this"

## SYNCING WITH GITHUB
After updating memory files, push so Antigravity can also see them:
```bash
cd /root/arxon-project
cp -r /root/arxon-ops/memory/ arxon-ops/memory/ 2>/dev/null
git add arxon-ops/
git commit -m "chore: update kimi memory and status"
git push origin main
```

## INIT COMMAND
First time setup — paste this to create the memory directory:
```bash
mkdir -p /root/arxon-ops/memory
echo "# Debug Log" > /root/arxon-ops/memory/debug-log.md
echo "# Decisions" > /root/arxon-ops/memory/decisions.md
echo "# Learnings" > /root/arxon-ops/memory/learnings.md
echo "# Todo" > /root/arxon-ops/memory/todo.md
echo "Memory system initialized ✅"
```
