# Tasks: SAGT Governance Evolution (v2.1)

| Task ID | Task Group | Skill | Inputs | Outputs | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | architecture | - | `BOOTSTRAP.md` | `BOOTSTRAP.md` (patched) | Step 3 includes Anti-Hallucination rule. |
| **T2** | architecture | - | `BOOTSTRAP.md` | `BOOTSTRAP.md` (patched) | Step 6 emits `[AWAIT_HUMAN_VALIDATION]`. |
| **T3** | architecture | - | `Jules/JULES.md` | `Jules/JULES.md` (patched) | HITL Break-Glass protocol defined in Section 4. |
| **T4** | docs | - | - | `Jules/skills/context-pruning/SKILL.md` | Skill defined with MINI_CANON purpose and constraints. |
| **T5** | architecture | - | `Jules/SKILLS_INDEX.md` | `Jules/SKILLS_INDEX.md` | `context-pruning` entry added. |
| **T6** | docs | - | - | `docs/MINI_CANON.md` | Placeholder created with disclaimer. |
| **T7** | architecture | - | `docs/ARCHITECTURE_INDEX.md` | `docs/ARCHITECTURE_INDEX.md` | MINI_CANON listed as non-canonical. |
| **T8** | docs | - | - | `.jtasks/HANDOVER.md` | Documentation for handover protocol added to `_template`. |
| **T9** | audit | `audit-governance` | `Jules/skills/audit-governance/SKILL.md` | `Jules/skills/audit-governance/SKILL.md` | Shadow Rule detection logic integrated. |
| **T10** | planning | - | `.jtasks/_template/tasks.md` | `.jtasks/_template/tasks.md` | Canon Citation standard added to task template. |
| **T11** | audit | - | `Jules/skills/audit-governance/SKILL.md` | `Jules/skills/audit-governance/SKILL.md` | Dead Canon TTL flagging logic added. |
| **T12** | audit | - | - | `Jules/skills/constitutional-check/SKILL.md` | Logic for MUST/MUST NOT consistency check defined. |
| **T13** | operations | - | - | `sagt-check.sh` | Shell script detects HITL, TODO, and REFUSE markers. |
| **T14** | audit | `audit-governance` | All files | `AUDIT_REPORT.md` | Full integrity pass on new governance structure. |

---

## Final Instruction

STOP
Emit:

[AWAIT_HUMAN_VALIDATION]
