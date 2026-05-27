# AGENTS.md - ai-romhacking

Scope: this folder provides an agent-ready workspace for Pokemon Platinum ROM research, patch authoring, and patch verification.

Most user requests for this toolkit are expected to be outside the known patch list. The bundled `../PlatPatches` repo is the source-code guide for how to write safe binary patches: study its modules, reuse its helpers, and add new reusable patches there when the request is feasible.

## Core Rules

- Never include, copy, commit, or distribute `.nds` ROM files.
- User-owned `.nds` files may live in `../roms/`; use them only by explicit path.
- Do not paste ROM bytes into chat or docs.
- Prefer reusable `PlatPatches` patch modules over one-off byte edits.
- Use `../PlatPatches/src/patches/*.js`, `../PlatPatches/src/core.js`, and `../PlatPatches/app.js` as the source of truth for binary patch style and implemented examples.
- Treat the existing capability registry as a starting catalog, not a complete list of possible requests.
- Read `docs/agent-start-here.md` and `docs/request-router.md` before opening larger docs.
- Use the routed compact docs/source shard before searching the optional decomp source.
- Treat `.aiignore` as context-loading guardrails, not as a ban on explicit command inputs.
- Explain results to nontechnical users in plain language first, then mention files and patch IDs.

## Expected Workspace

Expected folders from this directory:

- `../PlatPatches`: required reference implementation from `hzla/platpatches` (`https://github.com/hzla/platpatches`).
- `../pokeplatinum`: optional maintainer source fallback and source-index regeneration input from `pret/pokeplatinum` (`https://github.com/pret/pokeplatinum`).
- `../Docs`: optional maintainer input for regenerating compact DSPRE indexes.
- `../DSPRE`: optional maintainer GUI/source reference from `DS-Pokemon-Rom-Editor/DSPRE` (`https://github.com/DS-Pokemon-Rom-Editor/DSPRE`).

Run these checks before patch authoring:

```sh
node scripts/inspect-workspace.js
node scripts/verify-workspace.js
```

## Request Workflow

1. Check whether the request is already covered by `registries/capabilities.platinum.json`.
2. If an existing `PlatPatches` module already covers it, explain or apply that patch path.
3. If no known capability exists, read `docs/request-router.md` and choose one route.
4. If no known capability exists, assume the request may still be feasible and classify it using Unknown Request Triage.
5. For NARC/data/script requests, check compact indexes before searching external DSPRE sources.
6. For source/code-behavior requests, read one `docs/source/*.md` shard before searching the optional decomp source.
7. For feasible unknowns, inspect similar modules under `../PlatPatches/src/patches/`, then implement a reusable patch module or extend the closest existing one.
8. Wire new patches through `../PlatPatches/app.js`, browser script tags when needed, and capability metadata here.
9. Verify syntax/module loading, and when a legal ROM is available under `../roms/`, patch or inspect it by explicit path and compare expected byte regions.
10. Report changed files, verification performed, and important caveats.

Ask a follow-up only when the request has incompatible meanings. Example: "make battles faster" could mean text speed, HP bars, animation waits, or framerate.

## Unknown Request Triage

If a user asks for something with no known patch/capability, that is the normal use case for this toolkit. Do not stop just because the registry has no match, and do not invent a one-off mystery edit. Classify the request first, then choose the workflow.

Classification:

- `implemented`: an existing `PlatPatches` patch covers it. Explain or apply it.
- `simple-data-edit`: likely belongs in DSPRE or exported data, such as trainer teams, move stats, Pokemon stats, item data, encounters, or text.
- `feasible-code-change`: localized behavior change in known code, such as "make Chlorophyll double Speed in hail instead of sun".
- `new-code-injection-capability`: localized binary hook or overlay helper needed, but the scope is still narrow and testable.
- `expansion-project`: broad structural expansion, such as adding many new Pokemon, expanding the Pokedex, adding new move slots, new save structures, or large UI/data format growth.
- `unbounded-or-unfeasible`: too broad, asset-heavy, legally risky, or impossible to make safe as a one-turn patch.

For `feasible-code-change` requests:

1. Use `docs/pokeplatinum-compact-index.md` and `docs/pokeplatinum-search-playbook.md` to identify the smallest relevant source area.
2. Use `registries/pokeplatinum-source-index.json` for machine-readable feature areas and file pivots.
3. Use narrow `rg` searches in `../pokeplatinum` only if compact indexes are insufficient and the optional source is available.
4. Identify the exact behavior hook, constants, data table, or battle routine involved.
5. Explain the intended implementation in plain language.
6. Implement as a reusable `PlatPatches` patch when execution is requested, then register it in `registries/capabilities.platinum.json`.
7. Include verification steps and caveats.

Example feasible unknown:

- User: "Make Chlorophyll double Speed in hail instead of sun."
- Triage: `feasible-code-change`.
- Search first:

```sh
rg -n "CHLOROPHYLL|Chlorophyll|ABILITY_CHLOROPHYLL|WEATHER_HAIL|WEATHER_SUN|sun|hail" ../pokeplatinum/src ../pokeplatinum/include
rg -n "Speed|speed|ability" ../pokeplatinum/src/battle ../pokeplatinum/include/battle
```

- Expected direction: find the battle stat/speed modifier path for abilities, change the weather condition checked for Chlorophyll, then package the result as a named capability if it will be reused.

For `new-code-injection-capability` requests:

- Prefer adding patch logic to a focused module under `../PlatPatches/src/patches/`.
- Reuse helpers from `../PlatPatches/src/core.js` and patterns from similar modules before creating new helpers.
- Wire the patch through `../PlatPatches/app.js` and `../PlatPatches/index.html` if the browser build needs a new script.
- Add capability metadata here only after the patch is implemented and tested.
- Sanity-check expected bytes and avoid patching in place.
- Write a recipe only if it is useful as an example or smoke test.
- If direct source-build changes are safer than binary injection, document that path and avoid forcing the work through the patcher backend.

For `simple-data-edit` requests:

- Check `docs/dspre-data-edit-playbook.md` first.
- Check `registries/narc-formats.platinum.json` and `registries/script-formats.platinum.json` before opening any external DSPRE source.
- Tell the user when a request is probably better handled by structured data editing instead of code injection.
- Use `../Docs/dspre_exports` and `../Docs/DSPRE_Romfiles` only as optional maintainer references when the compact indexes are missing a needed fact.
- Do not build a binary patch when a clean data edit is safer.

## Unfeasible Or Expansion-Sized Requests

Be honest and specific when a request is too large for the current framework. Do not promise a one-click patch for expansion-class work.

Common expansion-sized examples:

- "Port every Gen 5 Pokemon into Platinum."
- "Add 100 new Pokemon."
- "Expand the Pokedex with full sprites, cries, icons, forms, evolution data, learnsets, encounters, trainer compatibility, and UI support."
- "Add a full new battle mechanic generation."

Why these are not normal patch requests:

- They require coordinated data expansion, new assets, text, cries, icons, sprites, Pokedex UI changes, save/data compatibility checks, encounter/trainer integration, and extensive testing.
- They may exceed hardcoded table limits or UI assumptions.
- They are project plans, not single safe patches.

Response pattern for nontechnical users:

1. Acknowledge the goal plainly.
2. State that it is an expansion project, not a safe one-command patch.
3. Explain the main blockers in concrete terms.
4. Offer a smaller feasible slice.

Example response:

"Porting every Gen 5 Pokemon is too large for this patch system as a single task. It would need new species data, sprites, icons, cries, Pokedex entries, evolution/learnset data, UI expansion, and save compatibility testing. A safer first slice would be adding one test species or researching whether the current decomp has unused species slots."

If the user accepts a smaller slice, treat that slice as `feasible-code-change` or `expansion-project` planning depending on scope.

## Existing Baseline Capability IDs

These are already implemented through `PlatPatches` and are useful as examples, tests, and immediately available patches. They are not the expected boundary of user requests.

- `frameRate`
- `shinyOdds`
- `noCrits`
- `iv15_31`
- `wildNatures`
- `movementSpeed`
- `fairyType`
- `fairyPokemonTypes`
- `instantText`
- `text4x`
- `playerAccuracy`

## Decomp Research

Use compact pokeplatinum indexes before opening the optional decomp source:

- Start with `docs/pokeplatinum-compact-index.md`.
- Use `docs/pokeplatinum-search-playbook.md` for common unknown-request searches.
- Use `docs/pokeplatinum-expansion-boundaries.md` to distinguish localized feasible work from expansion projects.
- Use `registries/pokeplatinum-source-index.json` for machine-readable feature areas, file pivots, symbols, and search patterns.
- If compact notes are insufficient and `../pokeplatinum` is present, use `rg` for narrow searches.
- Read headers before large source files when possible.
- Do not load broad directories if a specific feature map points to a file.
- Keep DSPRE-style data edits separate from binary patch capabilities unless the user explicitly asks for data editing.
- Do not ask nontechnical users to paste the full decomp for ordinary usage.

## Context Budget

Free-plan users may run out of context quickly. Keep the working set small:

- Start with `docs/agent-start-here.md`.
- Route with `docs/request-router.md` or `registries/request-router.platinum.json`.
- Read one source shard under `docs/source/`, not the full decomp map.
- Prefer exact registry entries over broad Markdown docs when looking up offsets or IDs.
- Use exact `rg` searches and line-specific reads for optional source fallback.
- Never load `.nds` ROMs, build outputs, dependency folders, or generated binaries into chat context; use local ROM paths only as explicit tool inputs.

## Compact Reference Indexes

End users do not need to provide the full DSPRE or pokeplatinum repos for ordinary agent usage. Use these committed indexes first:

- `docs/agent-start-here.md`: smallest workflow guide for low-context sessions.
- `docs/request-router.md`: plain-language route from user request to first reference.
- `registries/request-router.platinum.json`: machine-readable route map.
- `docs/narc-format-index.md`: compact NARC paths, member models, field offsets, bitfields, and common edits.
- `docs/script-format-index.md`: compact map-header/script/event references and script command database summary.
- `docs/dspre-data-edit-playbook.md`: plain-language request-to-format mapping.
- `registries/narc-formats.platinum.json`: machine-readable NARC format index.
- `registries/script-formats.platinum.json`: machine-readable script/event index.
- `docs/pokeplatinum-compact-index.md`: compact source router.
- `docs/source/*.md`: small source-domain shards for battle, Pokemon generation, field/scripts, text/UI, and assets/NARC.
- `docs/pokeplatinum-search-playbook.md`: two-tier source fallback workflow.
- `docs/pokeplatinum-expansion-boundaries.md`: feasible-vs-expansion guidance.
- `registries/pokeplatinum-source-index.json`: machine-readable source feature index.

Maintainers can regenerate these indexes from local source references:

```sh
node scripts/extract-dspre-index.js
node scripts/extract-pokeplatinum-index.js
```
