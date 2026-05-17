# pokeplatinum Source Search Playbook

Use this when a user asks for a patch that is not already implemented. The goal is to avoid loading the full decomp unless the compact notes are insufficient.

## Two-Tier Workflow

- Tier 1: compact docs and registries in `ai-romhacking`.
- Tier 2: targeted `rg` searches in optional `../pokeplatinum` source.
- Do not ask users to paste the decomp for ordinary use.
- If Tier 2 is needed and source is unavailable, explain that the request needs maintainer/source fallback.

## Examples

### Make Chlorophyll double Speed in hail instead of sun

- Tier 1: Feature areas: Battle core; Abilities, weather, held items in battle.
- Tier 2: Search ability/weather/speed terms in battle files.

```sh
rg -n "CHLOROPHYLL|ABILITY_CHLOROPHYLL|WEATHER_HAIL|WEATHER_SUN|Speed|speed|ability" ../pokeplatinum/src/battle ../pokeplatinum/include
```

### Remove EV yields

- Tier 1: Use DSPRE NARC index, not decomp source: `pokemon_personal`, offset `0x0A`.
- Tier 2: Only search source if runtime EV award behavior must change.

```sh
rg -n "SPECIES_DATA_EV_|EV_.*YIELD|effort" ../pokeplatinum/src ../pokeplatinum/include
```

### Make moves never miss for everyone

- Tier 1: Feature area: Battle core. Existing player-only patch is not enough.
- Tier 2: Search accuracy and miss status in battle scripts/controllers.

```sh
rg -n "accuracy|MOVE_STATUS_MISSED|No Guard|Lock On" ../pokeplatinum/src/battle ../pokeplatinum/include/battle
```

### Change wild encounters

- Tier 1: Use DSPRE encounter NARC index and map header `wildPokemon` field.
- Tier 2: Search wild encounter runtime only for behavior changes.

```sh
rg -n "TryWildEncounter|encounterRate|CreateWildMon|MapHeaderData_LoadWildEncounters" ../pokeplatinum/src/overlay006 ../pokeplatinum/src/encounter.c ../pokeplatinum/include
```

### Add many Pokemon or expand Pokedex

- Tier 1: Classify as expansion-project. Compact index can identify systems, but not make it a one-command patch.
- Tier 2: If scoped to one test species, inspect Pokemon generation, Pokedex, assets, text, save/UI assumptions.

```sh
rg -n "Pokedex|SPECIES_|personal|sprite|icon|cry|form|evolution|learnset" ../pokeplatinum/src ../pokeplatinum/include ../pokeplatinum/res
```

## Feature Areas

- Build and ROM identity: base ROM validation, build failures, file path to FAT/NARC mapping, source build setup
- Battle core: critical hits, damage formula, accuracy, type effectiveness, battle rules, weather/ability interactions
- Pokemon generation, personality, stats: shiny logic, nature/gender changes, IV/stat generation, species personal data runtime access
- Abilities, weather, held items in battle: change ability behavior, weather-dependent abilities, held item battle effects, stat modifier hooks
- Wild encounters: encounter rates, wild species slots, Sweet Scent, repel, honey trees, daily encounters
- Field, overworld, movement: movement speed, NPC movement, collision, map transition behavior, field controls
- Scripts, events, vars, flags: events, flags, vars, scripted wild battles, NPC scripts, story triggers
- Text and messages: fast text, dialogue rendering, message content, text banks, font/glyph behavior
- NARC, assets, graphics: asset replacement, NARC member lookup, sprites, icons, palettes, graphics conversion
- Pokedex, party, PC, bag, summary: Pokedex UI, party menu, summary screen, PC boxes, bag/items UI
- Trainers and AI: trainer party behavior, trainer AI flags, battle opening, trainer classes
- Save data, records, system: save compatibility, new flags/vars, records, global options, startup
- Battle animations: move animation changes, particle effects, battle visual behavior
- Apps, minigames, network, extras: Mystery Gift, Underground, Contest, WFC, menus, special apps
