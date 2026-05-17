# Workspace Setup

Use this toolkit from a workspace that contains sibling folders:

```text
romhack-workspace/
  ai-romhacking/
  platinum-rom-patcher/
  pokeplatinum/ optional maintainer source fallback
  Docs/       optional maintainer input
  DSPRE/      optional maintainer reference
```

Only `platinum-rom-patcher` is required to apply the included recipes. End users do not need `pokeplatinum`, `Docs`, or `DSPRE`; compact generated indexes are already included under `docs/` and `registries/`.

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

Use strict mode to require the runtime siblings used by the toolkit:

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

Do not put ROM files in this toolkit. Keep a legal backup somewhere private, then pass its path to `apply-recipe.js` with `--rom`.
