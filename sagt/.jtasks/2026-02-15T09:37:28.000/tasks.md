# Tasks: Canon Migration to YAML Rule Schema (v2.2)

| Task ID | Task Group | Skill | Inputs | Outputs | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | architecture | - | `docs/ARCHITECTURE_RULES.md` | `docs/ARCHITECTURE_RULES.md` | Enforceable rules converted to `yaml sagrule` blocks. |
| **T2** | architecture | - | `docs/SECURITY_MODEL.md` | `docs/SECURITY_MODEL.md` | Security invariants converted to `yaml sagrule` blocks. |
| **T3** | architecture | - | `docs/INVARIANT_MODEL.md` | `docs/INVARIANT_MODEL.md` | System invariants converted to `yaml sagrule` blocks. |
| **T4** | architecture | - | `docs/ENFORCEMENT_MATRIX.md` | `docs/ENFORCEMENT_MATRIX.md` | Matrix data converted to structured rules. |
| **T5** | operations | - | - | `canon-compile.sh` | Bash script created and executable; extracts and validates YAML blocks. |
| **T6** | audit | `constitutional-check` | Canonical Docs | `CONSTITUTIONAL_REPORT.md` | Run consistency check on the new YAML rules. |
| **T7** | docs | - | `docs/SAGT_OVERVIEW.md` | `docs/SAGT_OVERVIEW.md` | Update handbook to explain YAML rule schema. |
| **T8** | docs | - | `docs/ARCHITECTURE_INDEX.md` | `docs/ARCHITECTURE_INDEX.md` | Add YAML rule standard to governance index. |
| **T9** | audit | `audit-governance` | All files | `AUDIT_REPORT.md` | Verify that YAML migration preserved all meanings. |

---

## Final Instruction

STOP
Emit:

[AWAIT_HUMAN_VALIDATION]
