# ai-romhacking

This repo is an agent-ready workspace scaffold for AI-assisted Pokemon Platinum ROM hacking. It is designed for users who want to open the folder in Codex or Claude Code and ask for new features, patches, or research tasks in normal language.

The intended setup is: clone `ai-romhacking`, add the needed reference repos, then let an AI coding agent use the included docs plus `PlatPatches` as a working source-code guide. Existing recipes are examples and smoke tests, not the main product.

This repo does not include ROM files. Users add external reference projects locally.

For low-context/free-plan usage, agents should start with `docs/agent-start-here.md`, route the request with `docs/request-router.md`, and read only one compact reference shard before using optional source fallback.

## What You Need To Install

### Windows

Windows does not include Node.js by default. Install it first:

1. Go to https://nodejs.org/
2. Download the **LTS** version for Windows.
3. Run the installer.
4. Keep the default installer choices.
5. Open a new PowerShell window.
6. Check that Node works:

```powershell
node -v
```

If that prints a version number, Node is ready.

### macOS

macOS does not include a current Node.js install by default. Install the LTS version from https://nodejs.org/ or install it with Homebrew:

```sh
brew install node
node -v
```

### Linux

Install Node.js with your package manager or from https://nodejs.org/. Then check:

```sh
node -v
```

## Required Folder Layout

Clone this repo, then add `PlatPatches` inside the repo root. `PlatPatches` should come from [hzla/platpatches](https://github.com/hzla/platpatches) and must be named exactly `PlatPatches` so the workflow docs and verification scripts can find it.

Reference repos:

- Required: [hzla/platpatches](https://github.com/hzla/platpatches), placed here as `PlatPatches/`.
- Optional source fallback: [pret/pokeplatinum](https://github.com/pret/pokeplatinum), placed here as `pokeplatinum/`.
- Optional editor/source reference: [DS-Pokemon-Rom-Editor/DSPRE](https://github.com/DS-Pokemon-Rom-Editor/DSPRE), placed here as `DSPRE/`.

Recommended layout:

```text
ai-romhacking/
  ai-romhacking/         toolkit docs, scripts, registries, AGENTS.md
  PlatPatches/           required reference implementation from hzla/platpatches
  pokeplatinum/          optional source fallback from pret/pokeplatinum
  Docs/                  optional maintainer input
  DSPRE/                 optional maintainer reference from DS-Pokemon-Rom-Editor/DSPRE
```

Required for agent patch authoring:

```text
PlatPatches/app.js
PlatPatches/src/core.js
PlatPatches/src/patches/
```

The toolkit already includes compact DSPRE-derived and pokeplatinum-derived indexes, so users do not need the full `DSPRE`, `Docs`, or `pokeplatinum` folders for ordinary AI usage. Those folders are useful when an agent needs deeper source fallback.

Do not put `.nds` files inside this toolkit unless they are generated outputs under `ai-romhacking/output/`. Do not share ROM files.

`.aiignore` is included as an AI context guardrail. It prevents ROMs and generated build outputs from being loaded into chat context, but users can still pass an explicit ROM path to patch commands.

## First-Time Check

From inside `ai-romhacking`, run:

```sh
node scripts/inspect-workspace.js
node scripts/verify-workspace.js
node scripts/list-capabilities.js
```

`verify-workspace.js` requires `../PlatPatches/app.js`, `../PlatPatches/src/core.js`, and `../PlatPatches/src/patches/registry.js`. It does not require `pokeplatinum`, `Docs`, or `DSPRE`; those are maintainer inputs or source fallbacks for regenerating compact indexes.

## Using This With Codex Or Claude Code

Open the repo root in your coding agent and ask for the feature you want. The agent should start from:

```text
ai-romhacking/AGENTS.md
ai-romhacking/docs/agent-start-here.md
ai-romhacking/docs/request-router.md
PlatPatches/src/patches/
PlatPatches/src/core.js
```

Good requests look like:

```text
Add a reusable patch that makes Chlorophyll activate in hail instead of sun.
Research whether the request belongs in data/NARC editing or a binary patch.
Implement a new PlatPatches patch module for this behavior and wire it into the UI.
```

The expected agent workflow is to inspect existing `PlatPatches` patch modules, follow their safety checks and registry wiring, implement the missing feature, and verify behavior against a clean ROM when a legal ROM path is provided.

## Optional: Apply An Existing Recipe

Use a ROM file that you legally own. The command writes a patched copy and never edits the input ROM in place.

```sh
node scripts/apply-recipe.js recipes/examples/remove-critical-hits.json --rom "C:\path\to\your\platinum.nds"
```

On macOS or Linux:

```sh
node scripts/apply-recipe.js recipes/examples/remove-critical-hits.json --rom /path/to/your/platinum.nds
```

The output goes to:

```text
ai-romhacking/output/
```

The command also writes a `.manifest.json` file beside the patched ROM. The manifest records what recipe was used, input and output SHA1 hashes, and the patcher log.

## Useful Commands

List all implemented patch capabilities:

```sh
node scripts/list-capabilities.js
```

Search capabilities:

```sh
node scripts/list-capabilities.js --query shiny
```

Show machine-readable capability data:

```sh
node scripts/list-capabilities.js --json
```

Inspect sibling folders:

```sh
node scripts/inspect-workspace.js
```

Verify this toolkit and the required patcher:

```sh
node scripts/verify-workspace.js
```

Verify required runtime folders and check for accidental ROM files:

```sh
node scripts/verify-workspace.js --strict
```

## Included Example Recipes

- `recipes/examples/remove-critical-hits.json`
- `recipes/examples/make-all-pokemon-shiny.json`
- `recipes/examples/fast-text.json`
- `recipes/examples/qol-bundle.json`

## When There Is No Existing Recipe

That is the expected advanced use case.

The AI agent should:

1. Read `docs/agent-start-here.md`.
2. Route the request with `docs/request-router.md`.
3. Check the existing capability registry.
4. If there is no match, check one compact source or data target before searching a full decomp:
   - `docs/pokeplatinum-compact-index.md`
   - `docs/source/*.md`
   - `registries/pokeplatinum-source-index.json`
5. Decide whether the request is a simple data edit, a feasible code change, a code-injection capability, or a larger expansion project.
6. Search optional `../pokeplatinum` source only if the compact notes are not enough and the source is available.
7. Implement a reusable capability when the scope is feasible.
8. Add or update the `PlatPatches` patch module, registry wiring, UI metadata, and capability docs after testing.

Example:

> "Make Chlorophyll double Speed in hail instead of sun."

This is probably a feasible localized battle-code change. The agent should search ability and weather speed modifier code, implement a reusable `PlatPatches` patch, and document how it was verified.

Counterexample:

> "Port every Gen 5 Pokemon into Platinum."

This is an expansion project, not a safe one-command patch. It needs data expansion, sprites, cries, icons, Pokedex UI work, learnsets, evolutions, encounters, trainers, and testing. The agent should explain that honestly and suggest a smaller first slice.

## Important Docs

- `docs/agent-start-here.md`: low-context workflow for agents.
- `docs/request-router.md`: route plain-language requests to one first reference.
- `docs/common-requests.md`: how plain-language user requests map to existing patch examples or new work.
- `docs/capability-registry.md`: capability metadata and option keys.
- `docs/pokeplatinum-compact-index.md`: compact pokeplatinum-derived source router.
- `docs/source/*.md`: smaller pokeplatinum-derived source shards.
- `docs/pokeplatinum-search-playbook.md`: two-tier source search workflow.
- `docs/pokeplatinum-expansion-boundaries.md`: feasible-vs-expansion guidance.
- `docs/pokeplatinum-reference-map.md`: longer legacy decomp navigation map.
- `docs/narc-format-index.md`: compact DSPRE-derived NARC format index.
- `docs/script-format-index.md`: compact script/event format index.
- `docs/dspre-data-edit-playbook.md`: quick data-edit lookup guide.
- `registries/request-router.platinum.json`: machine-readable request router.
- `templates/pokeplatinum/AGENTS.md`: a shorter AGENTS.md template users can copy into their own `pokeplatinum/` folder.

## Maintainer: Regenerate Compact Indexes

If you have local `Docs` and/or `pokeplatinum` folders, regenerate the compact indexes with:

```sh
node scripts/extract-dspre-index.js
node scripts/extract-pokeplatinum-index.js
```

The generated docs and registries are committed into this toolkit so regular users do not need the full DSPRE or pokeplatinum source.

## Current Boundary

`PlatPatches` is the reference implementation for binary patch style, module structure, byte safety checks, and UI wiring. For new requests, agents should use this scaffold to research and add new reusable patches rather than treating the current registry as complete.
