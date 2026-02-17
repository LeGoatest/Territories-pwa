# SAGT Implementation: Territories Repo

This folder contains the **Sovereign Agent Governance Template (SAGT)** implementation for the `territories` repository.

## Structure
- **Governance Root**: `./sagt/`
- **Canonical Entrypoint**: `../SAGT_INDEX.md`
- **Operating Rules**: `./Jules/JULES.md`

## Authoritative Hierarchy
All files within this directory (`./sagt/`) are authoritative for governance. The precedence for these files is defined in `./docs/ARCHITECTURE_INDEX.md`.

## Starting a New Task
To begin a new task (such as the GitHub Pages PWA build):
1. Review `../SAGT_INDEX.md`.
2. Follow the protocol in `./Jules/JULES.md`.
3. Use the `.jtasks/` folder for deterministic task tracking.
4. Consult `./NEW_PROJECT.md` if starting a new major component.

## Maintenance
Updates to SAGT should be mirrored from the [source template](https://github.com/LeGoatest/Sovereign-agent-template) into this folder.
