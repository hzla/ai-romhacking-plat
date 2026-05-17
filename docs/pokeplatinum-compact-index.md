# pokeplatinum Compact Source Index

Token-optimized source reference for Pokemon Platinum romhacking agents.

End users do not need to provide the full `pokeplatinum` repo for ordinary usage. Agents should use this as a router, then read one domain shard only when needed.

## Tiered Search Rule

1. Check `docs/agent-start-here.md` and `docs/request-router.md` first.
2. Read the one source shard that matches the request.
3. Check DSPRE-derived data indexes for NARC/data/script requests.
4. Search optional `../pokeplatinum` source only if compact indexes do not answer the question.
5. When falling back to source, search the smallest feature area first.

## Domain Shards

- `docs/source/battle.md`: Battle rules, damage, accuracy, critical hits, type chart, abilities, weather, trainer AI, and battle animations.
- `docs/source/pokemon-generation.md`: Pokemon creation, personality, shiny checks, natures, IVs, wild encounter runtime, and species-data access.
- `docs/source/field-scripts.md`: Overworld movement, field control, map objects, script commands, vars, flags, level scripts, and events.
- `docs/source/text-ui.md`: Text rendering, message loaders, Pokedex, party, PC, bag, summary, save records, options, menus, and side apps.
- `docs/source/assets-narc.md`: NARC runtime loading, graphics helpers, resource conversion tools, filesystem identity, and build/file mapping.

## Feature Area Router

- `build_rom_identity` -> `docs/source/assets-narc.md`: Build setup, ROM revision identity, filesystem layout, static binary references. First files: `README.md`, `INSTALL.md`, `Makefile`.
- `battle_core` -> `docs/source/battle.md`: Move execution, damage, accuracy, critical hits, type chart, battle state, battle messages. First files: `src/battle/battle_script.c`, `src/battle/battle_lib.c`, `src/battle/battle_system.c`.
- `pokemon_generation_personality` -> `docs/source/pokemon-generation.md`: Pokemon initialization, shiny/personality checks, nature/gender, stats, species data access. First files: `src/pokemon.c`, `include/pokemon.h`, `include/struct_defs/pokemon.h`.
- `abilities_weather_items` -> `docs/source/battle.md`: Battle runtime handling for abilities, weather, held item effects, and stat modifiers. First files: `src/battle/battle_lib.c`, `src/battle/battle_script.c`, `generated/abilities.txt`.
- `wild_encounters` -> `docs/source/pokemon-generation.md`: Grass/water/fishing/Sweet Scent encounters, repel, swarm, radar, honey trees, Great Marsh. First files: `src/overlay006/wild_encounters.c`, `include/overlay006/wild_encounters.h`, `src/map_header_data.c`.
- `field_overworld_movement` -> `docs/source/field-scripts.md`: Player/NPC movement, map objects, field control, collision, tile behavior, camera, transitions. First files: `src/overlay005/field_control.c`, `src/map_object.c`, `src/map_object_move.c`.
- `scripts_events_flags` -> `docs/source/field-scripts.md`: Field scripts, script commands, flags/vars, event files, level scripts, story progression. First files: `src/scrcmd.c`, `src/field_script_context.c`, `include/constants/scrcmd.h`.
- `text_messages` -> `docs/source/text-ui.md`: Text rendering, message loaders, string templates, fonts, message speed and text banks. First files: `src/render_text.c`, `src/text.c`, `src/message.c`.
- `narc_assets_graphics` -> `docs/source/assets-narc.md`: Runtime NARC loading, graphics helpers, Pokemon sprites, palettes, resource tools. First files: `src/narc.c`, `include/narc.h`, `include/constants/narc.h`.
- `pokedex_party_pc_bag` -> `docs/source/text-ui.md`: Major UI app systems and storage/party interfaces. First files: `include/applications/pokedex/pokedex_app.h`, `include/applications/party_menu/main.h`, `include/applications/pc_boxes/box_application.h`.
- `trainers_ai` -> `docs/source/battle.md`: Trainer data setup, trainer battle encounter handoff, battle AI constants/scripts. First files: `src/trainer_data.c`, `include/trainer_data.h`, `include/battle/trainer_ai.h`.
- `save_records_system` -> `docs/source/text-ui.md`: Save blocks, game records, system vars, boot/main loop, options. First files: `include/savedata.h`, `include/constants/savedata/vars_flags.h`, `src/game_records.c`.
- `battle_animations` -> `docs/source/battle.md`: Move visual effects, particles, animation scripts, emitters, camera callbacks. First files: `src/battle_anim/battle_anim_system.c`, `src/battle_anim/script_func_tables.c`, `src/battle_anim/script_funcs_0.c`.
- `apps_minigames_network` -> `docs/source/text-ui.md`: Main menu, Mystery Gift, Underground, contests, WFC/network, Poketch-like apps and overlays. First files: `src/main_menu/main_menu.c`, `src/main_menu/mystery_gift_app.c`, `src/underground.c`.

## Regeneration

Maintainers can regenerate this file with:

```sh
node scripts/extract-pokeplatinum-index.js
```
