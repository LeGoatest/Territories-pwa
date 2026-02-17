# Project Name | Architectural Rules (Canonical)

This document contains the source of truth for the system's architecture.
Non-negotiable. If a change violates any rule, the correct action is to refuse.

## 0) Supreme Authority

```yaml sagrule
id: ARCH-SUPREME-AUTHORITY
statement: "This file overrides all other docs and comments."
operator: MUST
context: all
severity: CRITICAL
enforcement: REFUSAL
source: "docs/ARCHITECTURE_RULES.md §0"
```

- This file overrides all other docs and comments.
- If ambiguity exists, prefer: [Isolation > Reliability > Resilience] (Placeholder).

## 1) System Boundaries

```yaml sagrule
id: ARCH-SYSTEM-BOUNDARIES
statement: "Agents MUST strictly adhere to system boundaries: docs/** for governance, Jules/ for agent OS, .jtasks/ for planning."
operator: MUST
context: all
severity: CRITICAL
enforcement: REFUSAL
source: "docs/ARCHITECTURE_RULES.md §1"
```

- `docs/**` only when explicitly updating governance/canon.
- `Jules/` for agent governance and skills.
- `.jtasks/` for planning and execution workspaces.
- [Define project-specific bounded contexts or planes here]

## 2) Layering Rules
- [Define internal layering (e.g. DDD, Ports/Adapters) here]

## 3) Isolation & State Rules
- [Define how state is managed and isolated here]

## 4) Forbidden Patterns
- [Explicitly list patterns that must be refused (e.g. No global state)]
