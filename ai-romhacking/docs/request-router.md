# Request Router

Use this before opening larger docs. Pick the first matching route, read only that target, then continue narrowly.

## Existing Public-Style Patches

Requests like: shiny odds, all Pokemon shiny, no critical hits, IV range, wild nature filter, faster movement, faster text, frame rate, Fairy type, player accuracy.

First target: `registries/capabilities.platinum.json`

Then: inspect the matching module under `../PlatPatches/src/patches/`, or use `docs/common-requests.md` for plain-language mapping.

## Pokemon Personal Data

Requests like: remove EV yields, change base stats, change types, change abilities, change held wild items, change gender ratio, change catch rate, change egg groups.

First target: `docs/dspre-data-edit-playbook.md`

Then: `registries/narc-formats.platinum.json`, entry `pokemon_personal`

Avoid source fallback unless the user asks to change runtime behavior instead of stored data.

## Moves, Items, Evolutions, Learnsets

Requests like: change move power, accuracy, PP, priority, flags, item effects, evolution method, level-up moves, TM compatibility.

First target: `registries/narc-formats.platinum.json`

Then: `docs/narc-format-index.md`

Use `docs/source/battle.md` only if the request changes how the game interprets the data.

## Encounters, Trainers, Scripts, Flags

Requests like: wild encounter slots, trainer teams, trainer AI flags, map events, story flags, variables, scripted battles, NPC scripts.

First target: `docs/dspre-data-edit-playbook.md`

Then: `docs/script-format-index.md`, `registries/script-formats.platinum.json`, and `registries/narc-formats.platinum.json`

For runtime behavior, use `docs/source/field-scripts.md` or `docs/source/pokemon-generation.md`.

## Battle Rules And Abilities

Requests like: change critical-hit formula, make moves never miss, change weather effects, change an ability such as Chlorophyll, change type effectiveness, change damage formula.

First target: `docs/source/battle.md`

Then: `docs/pokeplatinum-search-playbook.md`

Source fallback: targeted `rg` in `../pokeplatinum/src/battle`, `../pokeplatinum/include/battle`, and exact generated/constants files named by the shard.

## Pokemon Generation And Wild Runtime

Requests like: shiny/personality logic, IV generation, nature generation, gender generation, wild Pokemon creation behavior, repel/Sweet Scent behavior.

First target: `docs/source/pokemon-generation.md`

Then: `docs/source/battle.md` only if the request occurs during battle.

## Field, Movement, Text, And UI

Requests like: movement speed beyond existing patch, collision behavior, text rendering speed, font/glyph behavior, message loader behavior, Pokedex/party/PC/bag/summary UI.

First target: `docs/source/field-scripts.md` for field/movement/scripts.

First target: `docs/source/text-ui.md` for text/UI/apps/save records.

## Assets, NARCs, Graphics, And Build Identity

Requests like: NARC runtime loading, sprite/icon/palette resource lookup, filesystem paths, build identity, ROM revision checks.

First target: `docs/source/assets-narc.md`

For structured data formats, prefer `docs/narc-format-index.md` before source.

## Save Files

Requests like: inspect or edit `.sav`, flags in saves, party/storage inside saves, save block structure.

First target: future save-structure docs when added.

Current guidance: do not guess save offsets. It is acceptable to read an explicit user-provided save path only for a focused save task, but do not bulk-load save binaries into chat.

## Expansion Projects

Requests like: add every Gen 5 Pokemon, add many new species, expand Pokedex capacity, add many moves/abilities/forms at once, change save structures broadly.

First target: `docs/pokeplatinum-expansion-boundaries.md`

Then: propose a smaller first slice, such as one species, one ability, one table limit, or one UI limit.
