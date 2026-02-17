# Sovereign Agent | Architectural Index (Precedence & Governance)

This document defines the **canonical order of precedence** for all documentation in this project.
It is the secondary authority for resolving conflicts, as defined in `Jules/JULES.md`.

---

## 1) Absolute Precedence List

In the event of a conflict between documents, the document appearing **higher in this list** always wins. Agents MUST refuse any request that violates a higher-precedence rule.

1. [ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md)
2. [SYSTEM_AXIOMS.md](./SYSTEM_AXIOMS.md)
3. [SAGT_OVERVIEW.md](./SAGT_OVERVIEW.md)
4. [SECURITY_MODEL.md](./SECURITY_MODEL.md)
5. [INVARIANT_MODEL.md](./INVARIANT_MODEL.md)
6. [CONTRACT_MODEL.md](./CONTRACT_MODEL.md)
7. [ARCHITECTURE_INDEX.md](./ARCHITECTURE_INDEX.md)
8. [MUTATION_PROCESS.md](./MUTATION_PROCESS.md)
9. [VERSION_LOCKING.md](./VERSION_LOCKING.md)
10. [DECISIONS.md](./DECISIONS.md)
11. [TERMINOLOGY.md](./TERMINOLOGY.md)
12. [DOC_STYLE.md](./DOC_STYLE.md)
13. [ENFORCEMENT_MATRIX.md](./ENFORCEMENT_MATRIX.md)
14. [WDBASIC.md](./WDBASIC.md)
15. [JULES.md](../Jules/JULES.md)
16. [TASK_GROUPS.md](../Jules/TASK_GROUPS.md)
17. [SKILLS_INDEX.md](../Jules/SKILLS_INDEX.md)
18. [SKILL.md files](../Jules/skills/)
19. [Spec files (in .jtasks)](../.jtasks/)

---

## 2) Non-Canonical Convenience Files

The following files are provided for token efficiency or quick reference. They carry NO canonical authority and are subordinate to all documents listed above.

- [docs/MINI_CANON.md](./MINI_CANON.md)

---

## 3) YAML Rule Schema (sagrule)

Canonical rules may be expressed in structured `yaml sagrule` blocks within these documents. These rules are machine-validated and take precedence as the most precise expression of the project's law. The `canon-compile.sh` tool MUST be used to verify the consistency of these rules.

---

## 4) Summary

If a rule in a lower-precedence document contradicts a higher one, the lower rule is **void**.
The Agent MUST refuse any request that violates this hierarchy.
The agent must STOP if design judgment is required but not specified in canon.
