# Requirements: SAGT Governance Evolution (v2.1)

## 1. BOOTSTRAP Hallucination Hardening
- **Step 3 Patch**: Integrate a mandatory Anti-Hallucination Rule.
  - MUST NOT invent trust boundaries, threat models, roles, or security properties.
  - MUST derive content ONLY from explicit repository evidence.
  - If evidence is missing, `SECURITY_MODEL.md` MUST contain only a TODO and a list of questions/decisions.
  - NO assumptions, NO proposed boundaries, NO defaults.
- **Step 6 Patch**: Update the STOP condition to explicitly emit `[AWAIT_HUMAN_VALIDATION]`.

## 2. Context Pruning Skill
- **Purpose**: Manage token bloat via non-canonical `docs/MINI_CANON.md`.
- **Skill**: Create `Jules/skills/context-pruning/SKILL.md`.
- **Constraints**:
  - MUST NOT modify canon.
  - `MINI_CANON.md` is informational only.
  - MUST include: Precedence list, refusal triggers, task group rules, skill constraints, spec-first summary.
  - MUST NOT: Introduce new rules, interpret ambiguity, or fill security gaps with assumptions.
- **Output**: `docs/MINI_CANON.md` (Max 250 lines, bullet-heavy, with disclaimer).
- **Index Update**: Add to `Jules/SKILLS_INDEX.md` and `docs/ARCHITECTURE_INDEX.md` (under "Non-Canonical Convenience Files").

## 3. HITL Break-Glass Protocol
- **Marker**: `[AWAIT_HUMAN_VALIDATION]`.
- **Rules**:
  - MUST appear alone on its own line.
  - MUST halt execution.
  - SHOULD include a bulleted explanation of what is blocked and what decision is required.
- **Triggers**: Canon conflicts, ambiguous task groups, security boundary modifications, spec approval requirements, STOP in any workflow.

## 4. Semantic Handover Protocol
- **Artifact**: `.jtasks/HANDOVER.md`.
- **Requirement**: Mandatory update for every incomplete execution.
- **Content**: Task group, spec state, pending tasks, canon version, model identity, architectural risks, last refusal trigger.

## 5. Shadow Rule Detection
- **Audit Logic**: When introducing non-trivial patterns, the agent MUST cite the authorizing canon section.
- **Violation Protocol**: If unauthorized, emit `[AWAIT_HUMAN_VALIDATION]` and offer options (Simplify or Mutate).

## 6. Dead Canon Pruning
- **TTL Mechanism**: Canonical rules not cited in `.jtasks` for 180 days must be flagged for Deprecation Review.
- **Citation Standard**: "Canon Citation: FILE §Section" in `.jtasks`.

## 7. Constitutional Consistency Testing
- **Check**: Scan canonical docs for logical contradictions (MUST vs MUST NOT, etc.).
- **Protocol**: If contradiction detected, emit `[AWAIT_HUMAN_VALIDATION]` and require Mutation Process.

## 8. Vibe Check CLI
- **Tool**: `sagt-check.sh`.
- **Function**: Detect `[AWAIT_HUMAN_VALIDATION]`, `TODO`, and `REFUSE`.
- **Status**: Non-canonical/Informational.
