# Patch Authoring

This toolkit uses `../PlatPatches` as the reference implementation for safe Pokemon Platinum binary patches. Most real user requests are expected to need new research and new patch authoring, so treat the existing modules as patterns rather than as the full list of possible work.

New binary patches should usually be added to `../PlatPatches/src/patches/` first, then wired through `../PlatPatches/app.js` and registered here as a capability. If a source-build change or DSPRE/data workflow is safer than binary injection, document that route instead of forcing the patch into the binary patcher.

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

1. Find the closest existing module in `../PlatPatches/src/patches/`.
2. Implement and test the patch in a focused `PlatPatches` module.
3. Export it from that module and wire it through `../PlatPatches/app.js`.
4. Add a browser script tag in `../PlatPatches/index.html` if a new module was created.
5. Add or update an entry in `registries/capabilities.platinum.json`.
6. Add an example recipe only if users are likely to reuse that exact bundle.
7. Document caveats in plain language.

## PlatPatches Module Checklist

- Use `src/core.js` helpers for overlay lookup, ARM9 offsets, NARC edits, byte parsing, and byte writes.
- Keep expected original bytes, already-patched bytes, and fallback scans explicit.
- Preserve CommonJS and browser compatibility.
- Keep `app.js` focused on patch ordering, labels, options, and orchestration.
- Verify with `node --check` on touched modules and a CommonJS load test.
- When a legal before/after ROM is available, compare hashes and known touched byte ranges.

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

For feasible code changes, research the decomp first, write down the exact behavior target, implement a reusable `PlatPatches` patch/capability, then add registry metadata.

For expansion projects, produce a scoped plan or suggest a smaller first slice. Do not present large expansions as one-command patches.
