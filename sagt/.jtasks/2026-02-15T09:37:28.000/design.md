# Design: Canon Migration to YAML Rule Schema (v2.2)

## 1. Rule Specification: `sagrule`
The new standard for canonical rules uses YAML code blocks embedded within the existing markdown files. This allows for both human readability and machine parsability.

### Schema Example:
```yaml sagrule
id: ARCH-SYSTEM-BOUNDARIES
statement: "Agents MUST strictly adhere to the system boundaries defined in docs/ARCHITECTURE_RULES.md"
operator: MUST
context: all
severity: CRITICAL
enforcement: REFUSAL
source: "docs/ARCHITECTURE_RULES.md §1"
ttl_days: 180
```

## 2. Canon Compiler Architecture (`canon-compile.sh`)
The "Lightweight Canon Compiler" is a bash script that extracts and validates these blocks.

### Components:
- **Extractor**: Uses `sed` or `awk` to pull `yaml sagrule` blocks from markdown.
- **Validator**: Uses `yq` (if available) or a lightweight python helper to validate schema completeness.
- **Consistency Checker**: Pairwise comparison of rules sharing the same `context` but having opposing `operator` values (MUST vs MUST_NOT).
- **Report Generator**: Outputs a summary of active rules and any detected errors.

## 3. Integration with Existing Governance
- **Precedence**: The `docs/ARCHITECTURE_INDEX.md` will define that YAML rules within a document share the precedence level of that document.
- **Refusal Model**: The agent's refusal logic is updated to cite specific Rule IDs (e.g., "Refusing request due to violation of RULE-ARCH-01").
- **Audit Governance**: The `audit-governance` skill is updated to rely on the YAML schema for more deterministic compliance checks.

## 4. CI/CD Pipeline Integration
- Add a step to the repository's CI/CD workflow (if applicable) or a pre-commit hook that runs `./canon-compile.sh`.
- Fail the build if syntax errors, missing mandatory fields, or logical contradictions are detected.

## 5. Migration Strategy
1. **Pilot**: Migrate `docs/ARCHITECTURE_RULES.md` first.
2. **Review**: Human validation of the schema mappings.
3. **Rollout**: Migrate remaining canonical docs.
4. **Pruning**: Remove redundant prose after the YAML blocks are verified.
