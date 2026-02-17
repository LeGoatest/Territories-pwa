# Bootstrapping a New Project (SAGT v2.1)

To initialize a project using the Sovereign Agent Template, the Agent and Human must follow this multi-step process:

## Step 1: Detect Project Language, Tooling, & Gaps
The Agent scans the repository to inventory folders, languages, and build systems. A `GAP_REPORT.md` is produced identifying missing governance components.

## Step 2: Generate Proposed Project Profile
The Agent drafts `docs/PROJECT_PROFILE.md` based strictly on repo evidence. It must be labeled clearly as **[DRAFT - NEEDS HUMAN VALIDATION]**.

## Step 3: Output Proposed Canon (DRAFT)
The Agent generates drafts for missing canon docs (`ARCHITECTURE_RULES.md`, `SECURITY_MODEL.md`, etc.).

**Anti-Hallucination Rule (Mandatory):**
- When drafting canonical documents (especially `SECURITY_MODEL.md`):
  - MUST NOT invent trust boundaries, threat models, roles, or security properties.
  - MUST derive content only from explicit repository evidence.
  - If no security model evidence exists:
    - `SECURITY_MODEL.md` MUST contain ONLY:
      - "TODO: Security model not yet defined"
      - TODO list of questions/decisions
      - NO assumptions, NO proposed boundaries, NO defaults
  - If evidence incomplete:
    - Draft MUST be partial
    - Unknowns MUST be marked TODO
- Violation requires refusal.

## Step 4: Propose Additional Skills
The Agent suggests specific skill folders in `Jules/skills/` based on detected tooling.

## Step 5: Finalize Unresolved Decisions
The Agent produces a `DECISIONS_NEEDED.md` file listing all unanswered questions required to finalize the canon.

## Step 6: Stop Point (HITL)
After producing the draft pack and `DECISIONS_NEEDED.md`:
1. STOP.
2. Present the `DECISIONS_NEEDED.md` to the user.
3. Wait for the user to validate the `PROJECT_PROFILE.md` and answer the pending decisions.
4. **Do NOT** proceed to implementation or "Final Canon" status without explicit instruction.

**Emit:**
[AWAIT_HUMAN_VALIDATION]
