# Workspace Setup

Use this toolkit from the repo root with the reference folders placed beside the inner `ai-romhacking/` toolkit folder:

```text
  ai-romhacking/
  PlatPatches/ required reference implementation from hzla/platpatches
  pokeplatinum/ optional source fallback from pret/pokeplatinum
  Docs/         optional maintainer input
  DSPRE/        optional maintainer reference from DS-Pokemon-Rom-Editor/DSPRE
```

Reference repos:

- Required: [hzla/platpatches](https://github.com/hzla/platpatches), placed here as `PlatPatches/`.
- Optional source fallback: [pret/pokeplatinum](https://github.com/pret/pokeplatinum), placed here as `pokeplatinum/`.
- Optional editor/source reference: [DS-Pokemon-Rom-Editor/DSPRE](https://github.com/DS-Pokemon-Rom-Editor/DSPRE), placed here as `DSPRE/`.

Only `PlatPatches` is required for normal agent patch authoring. End users do not need `pokeplatinum`, `Docs`, or `DSPRE`; compact generated indexes are already included under `docs/` and `registries/`.

Place your legally obtained `.nds` ROM in the local `roms/` folder at the repo root, for example:

```text
roms/platinum.nds
```

The `roms/` folder is ignored by git and AI context loading. Agents may reference files there by explicit path for patching and verification, but should not paste ROM bytes into chat or docs.

## Open In Codex

After `PlatPatches`, any optional reference repos, and your legal ROM have been added:

1. Install Codex for Windows from [developers.openai.com/codex/app/windows](https://developers.openai.com/codex/app/windows).
2. Open Codex.
3. Click **Project** on the left.
4. Click **Use Existing Folder**.
5. Select the full `ai-romhacking/` folder, the one containing `PlatPatches/`, `roms/`, and the inner `ai-romhacking/` toolkit folder.

For low-context/free-plan agent usage, start with `docs/agent-start-here.md` and `docs/request-router.md`. Those files point to one small source shard or data index instead of the full reference set.

## Install Node.js

The commands are written in Node.js. Windows users must install Node.js because it does not ship with Windows.

Install the LTS version from https://nodejs.org/ and then open a new terminal:

```sh
node -v
```

## Check The Workspace

From `ai-romhacking`:

```sh
node scripts/inspect-workspace.js
node scripts/verify-workspace.js
```

Use strict mode to require the runtime/reference folders used by the toolkit:

```sh
node scripts/verify-workspace.js --strict
```

`pokeplatinum`, `Docs`, and `DSPRE` are optional maintainer inputs and are not required by strict verification.

## Maintainer Index Regeneration

If maintaining this toolkit with local DSPRE extracts or pokeplatinum source available, run:

```sh
node scripts/extract-dspre-index.js
node scripts/extract-pokeplatinum-index.js
```

This refreshes:

- `docs/agent-start-here.md` and `docs/request-router.md` are hand-written routers and are not generated.
- `docs/narc-format-index.md`
- `docs/script-format-index.md`
- `docs/dspre-data-edit-playbook.md`
- `registries/narc-formats.platinum.json`
- `registries/script-formats.platinum.json`
- `docs/pokeplatinum-compact-index.md`
- `docs/source/*.md`
- `docs/pokeplatinum-search-playbook.md`
- `docs/pokeplatinum-expansion-boundaries.md`
- `registries/pokeplatinum-source-index.json`

## ROM Files

Put local working ROM files in `roms/`, keep clean backups private, and pass the ROM path explicitly only when a verification or patching command needs it.
