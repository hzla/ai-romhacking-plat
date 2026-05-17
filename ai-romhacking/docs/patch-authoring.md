# Patch Authoring

This toolkit currently wraps the implemented patches in `../platinum-rom-patcher/app.js`. Those patches are examples and a working backend. Most real user requests are expected to need new research and new capability authoring.

New binary patches should usually be added to `platinum-rom-patcher` first, then registered here as a capability. If a source-build change or DSPRE/data workflow is safer than binary injection, document that route instead of forcing the patch into the binary patcher.

For low-context sessions, start with `docs/agent-start-here.md` and `docs/request-router.md`. Open one routed source shard or data index before using broader references.

For data/NARC/script requests, check the compact DSPRE-derived indexes before opening external DSPRE source:

- `docs/narc-format-index.md`
- `docs/script-format-index.md`
- `docs/dspre-data-edit-playbook.md`
- `registries/narc-formats.platinum.json`
- `registries/script-formats.platinum.json`

For source/code-behavior requests, check the compact pokeplatinum-derived indexes before opening external decomp source:

- `docs/source/battle.md`
- `docs/source/pokemon-generation.md`
- `docs/source/field-scripts.md`
- `docs/source/text-ui.md`
- `docs/source/assets-narc.md`
- `docs/pokeplatinum-compact-index.md`
- `docs/pokeplatinum-search-playbook.md`
- `docs/pokeplatinum-expansion-boundaries.md`
- `registries/pokeplatinum-source-index.json`

## Add A New Capability

1. Implement and test the patch in `platinum-rom-patcher`.
2. Export it through that patcher's `PATCH_IMPLS` and `PATCHES`.
3. Add an entry to `registries/capabilities.platinum.json`.
4. Add an example recipe if users are likely to ask for it.
5. Document caveats in plain language.

## Design Rules

- Prefer named patch capabilities over one-off edits.
- Record broad touched regions in the registry.
- Sanity-check expected bytes before writing.
- Support modified ROMs with fallback scans when feasible.
- Avoid `--force` as a normal workflow.
- Preserve the input ROM and write a manifest.

## Decomp-Based Features

Use `docs/pokeplatinum-compact-index.md`, `docs/pokeplatinum-search-playbook.md`, and `registries/pokeplatinum-source-index.json` to research source behavior first. Search optional `../pokeplatinum` source only when the compact notes are not enough. If a new feature requires source builds or overlay injection, document the build inputs, generated outputs, and verification steps before exposing it to nontechnical users.

## Unknown Requests

Unknown requests are the main purpose of this toolkit. They should become reusable capability work, not one-off secret edits.

Classification:

- `simple-data-edit`: use DSPRE or data exports when safer.
- `feasible-code-change`: localized source behavior change, such as changing which weather activates an ability.
- `new-code-injection-capability`: localized binary hook or helper patch.
- `expansion-project`: broad structural work, such as adding large numbers of Pokemon or expanding Pokedex capacity.
- `unfeasible`: too broad, unsafe, or not grounded enough to implement honestly.

For feasible code changes, research the decomp first, write down the exact behavior target, implement a reusable patch/capability, then add registry metadata and a recipe.

For expansion projects, produce a scoped plan or suggest a smaller first slice. Do not present large expansions as one-command recipes.
