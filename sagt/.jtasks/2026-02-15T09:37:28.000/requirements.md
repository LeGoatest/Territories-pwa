# Requirements: Canon Migration to YAML Rule Schema (v2.2)

## 1. Scope of Migration
Canonical files to be migrated from prose-only to structured `yaml sagrule` blocks:
- `docs/ARCHITECTURE_RULES.md`
- `docs/SECURITY_MODEL.md`
- `docs/INVARIANT_MODEL.md`
- `docs/ENFORCEMENT_MATRIX.md`

## 2. Rule Schema (sagrule)
Every enforceable MUST / MUST NOT / SHALL / SHALL NOT statement in the target documents MUST be converted into a structured YAML block with the following mandatory fields:
- **id**: Unique identifier for the rule (e.g., `RULE-ARCH-01`).
- **statement**: The core requirement (e.g., "Agents MUST NOT introduce undocumented patterns").
- **operator**: One of `MUST`, `MUST_NOT`, `SHALL`, `SHALL_NOT`.
- **context**: The scope where the rule applies (e.g., `architecture`, `development`).
- **severity**: The enforcement level (e.g., `CRITICAL`, `ADVISORY`).
- **enforcement**: The mechanism (e.g., `REFUSAL`, `CI_FAIL`).

## 3. Preservation of Meaning
- **Zero Drift**: The migration MUST NOT change the semantic meaning of existing rules.
- **No Inventions**: Do NOT add new rules during the migration process.
- **No Interpretation**: Ambiguous prose MUST be flagged with a TODO in the YAML block rather than being reinterpreted.
- **Precedence Integrity**: Precedence defined in `docs/ARCHITECTURE_INDEX.md` remains absolute and unchanged.

## 4. Canon Compiler Support
- **Validation**: A lightweight validation script (`canon-compile.sh`) MUST be provided to check YAML syntax and logical consistency.
- **Contradiction Detection**: The compiler MUST identify conflicting rules (e.g., Rule A says MUST, Rule B says MUST NOT for the same scope).
- **CI Enforcement**: The compiler MUST return a non-zero exit code on syntax errors or contradictions.

## 5. Metadata Integration
- **Source Citation**: YAML rules MUST include a reference to the original prose section they replace for auditability.
- **TTL Support**: Rules MUST support the `ttl_days` attribute for compatibility with the Dead Canon Pruning mechanism.
