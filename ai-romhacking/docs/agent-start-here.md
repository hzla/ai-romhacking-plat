# Agent Start Here

Use this file first when context is tight. The goal is to answer or implement the user's request without loading broad repos or long reference files.

## Context Budget Rules

1. Classify the request before reading details.
2. Check `docs/request-router.md`.
3. Read only the one routed doc or shard needed for the request.
4. Prefer `registries/*.json` for exact fields, offsets, IDs, and capability names.
5. Use optional `../pokeplatinum` source only after compact docs fail.
6. When using source fallback, run exact `rg` searches and open only specific files or line ranges.
7. Do not load ROM images, generated build outputs, dependency folders, or full optional repos into context.

## Request Classes

- Existing patch: check `registries/capabilities.platinum.json`, then inspect the matching `../PlatPatches/src/patches/` module.
- Data edit: check `docs/dspre-data-edit-playbook.md`, then NARC/script registries.
- Source behavior change: check one `docs/source/*.md` shard.
- Expansion project: check `docs/pokeplatinum-expansion-boundaries.md`.
- Unknown: route by keywords in `docs/request-router.md`, then research narrowly.

## PlatPatches Source Rule

Use `../PlatPatches` as the implementation guide for binary patches:

- `src/core.js`: shared ROM, overlay, NARC, byte, and helper utilities.
- `src/patches/*.js`: focused patch modules grouped by domain.
- `src/patches/registry.js`: patch registry validation helpers.
- `app.js`: patch ordering, options, UI metadata, and CommonJS/browser exports.
- `index.html`: browser script order for patch modules.

When adding a new binary patch, follow the closest existing module pattern, keep byte checks explicit, and wire the patch through both CommonJS and browser paths.

## Safe Binary Handling

Ignored ROM files may be used only as explicit command inputs. Do not read them into chat/context, paste bytes into docs, or modify them in place.

Optional legacy recipe command:

```sh
node scripts/apply-recipe.js <recipe.json> --rom <input.nds>
```

The command writes a patched copy under `output/` and a manifest beside it.

## Two-Tier Source Rule

Tier 1 is committed compact reference:

- `docs/request-router.md`
- `docs/source/*.md`
- `docs/narc-format-index.md`
- `docs/script-format-index.md`
- `registries/*.json`

Tier 2 is optional source fallback:

- targeted `rg` in `../pokeplatinum/src`, `../pokeplatinum/include`, `../pokeplatinum/generated`, `../pokeplatinum/res/text`, or a specific path named by Tier 1.

Do not ask nontechnical users to paste full repos for ordinary usage.
