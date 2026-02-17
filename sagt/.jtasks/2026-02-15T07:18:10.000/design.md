# Design: SAGT Governance Evolution (v2.1)

## 1. System Architecture Changes

### Canonical Files (Precedence 1-19)
- `docs/ARCHITECTURE_RULES.md`
- `docs/SYSTEM_AXIOMS.md`
- `docs/SECURITY_MODEL.md`
- ... (Standard list)
- `docs/ARCHITECTURE_INDEX.md` (Updated to include MINI_CANON in Non-Canonical section)
- `Jules/JULES.md` (Patched for HITL Break-Glass)
- `BOOTSTRAP.md` (Patched for Hallucination Hardening)

### Non-Canonical / Informational Files
- `docs/MINI_CANON.md`: Token-efficient summary of governance.
- `.jtasks/HANDOVER.md`: State preservation for multi-turn execution.
- `sagt-check.sh`: Local CLI for state auditing.

## 2. Protocol Specifications

### HITL Break-Glass (`[AWAIT_HUMAN_VALIDATION]`)
Integrated into the core Agent OS (`JULES.md`). Any terminal state or required decision triggers this marker on a newline. The agent is hard-coded to halt following this output.

### Semantic Handover
A mandatory markdown artifact in the root of the active `.jtasks` iteration. It serves as the persistent memory for the "Intelligence Plane" across context resets.

### Shadow Rule Detection & TTL
Implemented as procedural extensions to the `audit-governance` skill.
- **Shadow Detection**: Requires a mapping between proposed code changes and `ARCHITECTURE_RULES.md` or `SECURITY_MODEL.md`.
- **TTL Flagging**: Implemented via a "Canon Citation" log. A script or manual audit process checks for rules missing from the log for >180 days.

## 3. Implementation Details

### Constitutional Check Algorithm
1. Extract all sentences containing modal verbs: MUST, MUST NOT, SHALL, SHALL NOT.
2. Group by topic/noun.
3. Perform pairwise contradiction check.
4. If `(Topic A) MUST (Action X)` AND `(Topic A) MUST NOT (Action X)` -> Trigger [AWAIT_HUMAN_VALIDATION].

### Vibe Check CLI (`sagt-check.sh`)
Simple grep-based utility:
```bash
grep -rE "\[AWAIT_HUMAN_VALIDATION\]|TODO|REFUSE" . --exclude-dir=temp_v2
```

## 4. Modified Precedence Index
`docs/ARCHITECTURE_INDEX.md` will be updated to include:
~~~md
## Non-Canonical Convenience Files
- [docs/MINI_CANON.md](./MINI_CANON.md)
~~~
