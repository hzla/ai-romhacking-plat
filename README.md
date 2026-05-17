# ai-romhacking

This folder is a command-driven helper kit for AI-assisted Pokemon Platinum ROM hacking. It is designed for nontechnical romhackers who want to ask for specialized changes in normal language, especially changes that usually require decomp research, code injection, or ASM knowledge.

The included recipes are examples and ready-to-use baseline patches. The main purpose of this toolkit is to help an AI agent research and implement new reusable patches when the user cannot find an existing public patch.

This toolkit does not include ROM files or copied external projects.

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

Put this `ai-romhacking` folder beside the projects it uses. The most important required folder is `platinum-rom-patcher`, because the apply command imports its real patching code.

Recommended layout:

```text
romhack-workspace/
  ai-romhacking/
  platinum-rom-patcher/
  pokeplatinum/          optional maintainer source fallback
  Docs/                 optional maintainer input
  DSPRE/                optional maintainer reference
```

Required for applying recipes:

```text
platinum-rom-patcher/app.js
```

The toolkit already includes compact DSPRE-derived and pokeplatinum-derived indexes, so nontechnical users do not need to paste the full `DSPRE`, `Docs`, or `pokeplatinum` folders for ordinary AI usage.

Do not put `.nds` files inside this toolkit unless they are generated outputs under `ai-romhacking/output/`. Do not share ROM files.

`.aiignore` is included as an AI context guardrail. It prevents ROMs and generated build outputs from being loaded into chat context, but users can still pass an explicit ROM path to patch commands.

## First-Time Check

From inside `ai-romhacking`, run:

```sh
node scripts/inspect-workspace.js
node scripts/verify-workspace.js
node scripts/list-capabilities.js
```

`verify-workspace.js` requires `../platinum-rom-patcher/app.js`. It does not require `pokeplatinum`, `Docs`, or `DSPRE`; those are maintainer inputs or source fallbacks for regenerating compact indexes.

## Apply An Existing Patch Recipe

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
8. Add a registry entry and recipe after testing.

Example:

> "Make Chlorophyll double Speed in hail instead of sun."

This is probably a feasible localized battle-code change. The agent should search ability and weather speed modifier code, implement a reusable patch, and document how it was verified.

Counterexample:

> "Port every Gen 5 Pokemon into Platinum."

This is an expansion project, not a safe one-command patch. It needs data expansion, sprites, cries, icons, Pokedex UI work, learnsets, evolutions, encounters, trainers, and testing. The agent should explain that honestly and suggest a smaller first slice.

## Important Docs

- `docs/agent-start-here.md`: low-context workflow for agents.
- `docs/request-router.md`: route plain-language requests to one first reference.
- `docs/common-requests.md`: how plain-language user requests map to recipe patches.
- `docs/capability-registry.md`: recipe format and option keys.
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

The commands currently apply capabilities through `platinum-rom-patcher`. For new requests, agents should use this scaffold to research and add new reusable capabilities rather than treating the current registry as complete.
