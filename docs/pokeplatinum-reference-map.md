# pokeplatinum Reference Map

This map helps an AI agent use the `pokeplatinum` decomp as a reference without loading the whole project. Start with the feature area below, read the listed headers first, then use the search recipes to narrow further.

Paths are relative to the root of a `pokeplatinum/` checkout.

## Build And ROM Identity

Start here when the question is about building, matching the base ROM, file layout, or generated artifacts.

Important files:

- `README.md`: supported Pokemon Platinum US ROM revisions and SHA1 values.
- `INSTALL.md`: build dependency and platform setup.
- `Makefile`: top-level convenience build entrypoint.
- `meson.build`: main Meson project definition.
- `src/meson.build`, `res/meson.build`, `asm/meson.build`, `tools/meson.build`: source/resource/tool build membership.
- `platinum.us/filesys.csv`: ROM filesystem layout used by the build.
- `platinum.us/rom_rev0.sha1`, `platinum.us/rom_rev1.sha1`: expected final ROM hashes.
- `platinum.us/sbins_*.sha1`: static binary hash references.
- `platinum.us/main.lsf`: main binary layout/script reference.

Useful searches:

```sh
rg -n "sha1|Rev 0|Rev 1|pokeplatinum.us" README.md platinum.us
rg -n "subdir|executable|custom_target|filesys" meson.build src/meson.build res/meson.build platinum.us/meson.build
rg -n "NARC|overlay|arm9|filesys" platinum.us tools src include
```

Agent guidance:

- If a user asks for a source-level patch, verify whether they want a decomp build change or a binary recipe patch.
- If a user asks why a ROM differs, compare base ROM revision and final SHA1 before assuming a patch bug.

## Battle Engine

Use this area for damage, accuracy, critical hits, move execution, type chart, battle messages, AI, health bars, and battle UI.

First headers:

- `include/battle/battle_context.h`: central battle state, including damage, critical multiplier, move status, battler fields, and turn state.
- `include/battle/battle_lib.h`: battle helper APIs and comments for damage, type chart, critical multiplier, variance, ability/item hooks, and targeting.
- `include/battle/battle_script.h`: battle script command interface.
- `include/battle/battle_system.h`: battle system object and battle mode context.
- `include/battle/battle_controller_player.h`: player command and standard accuracy notes.
- `include/constants/battle/*.h`: battle constants, script commands, move flags, turn flags, terrain, and controller constants.

First source files:

- `src/battle/battle_script.c`: battle command table and many move-resolution routines.
- `src/battle/battle_lib.c`: shared battle formulas and helpers.
- `src/battle/battle_system.c`: battle system setup, state, and high-level control.
- `src/battle/battle_controller.c`: controller command dispatch.
- `src/battle/battle_controller_player.c`: player action selection and accuracy-related controller behavior.
- `src/battle/battle_display.c`: battle message/display helpers.
- `src/battle/healthbar.c`: HP bar animation and HP gauge calculation.
- `src/battle/ov16_0223B140.c` and nearby `src/battle/ov16_*.c`: overlay 16 battle code split by decomp progress.

Useful searches:

```sh
rg -n "CalcCritical|criticalMul|critical hit|critical" src/battle include/battle
rg -n "CalcDamage|CalcMoveDamage|CalcDamageVariance|damage =" src/battle include/battle
rg -n "ApplyTypeChart|type chart|effectiveness|TYPE_" src/battle include/battle include/constants
rg -n "accuracy|ACCURACY|No Guard|Lock On|MOVE_STATUS_MISSED" src/battle include/battle
rg -n "BattleScript_CalcMoveDamage|BtlCmd_CalcDamage|BtlCmd_CalcMaxDamage" src/battle/battle_script.c
rg -n "Healthbar_CalcHP|UpdateGauge|FillCells" src/battle/healthbar.c include/battle/healthbar.h
rg -n "trainer_ai|AI|moveDamageRolls|AI_CONTEXT" src/battle include/battle asm/trainer_ai include/constants/battle
```

Feature anchors:

- Critical hits: `BattleSystem_CalcCriticalMulti` in `battle_lib` declarations and calls around critical multiplier setup in `src/battle/battle_script.c`.
- Damage formula: `BattleScript_CalcMoveDamage`, `BtlCmd_CalcDamage`, `BattleSystem_CalcMoveDamage`, and `BattleSystem_CalcDamageVariance`.
- Accuracy: standard accuracy behavior is documented in `include/battle/battle_controller_player.h`; battle script contains OHKO and special-case hit checks.
- Type chart: `BattleSystem_ApplyTypeChart` and table-reading logic in battle overlay code.
- HP bar speed: `src/battle/healthbar.c`.
- Battle text: `src/battle/battle_display.c`, `include/battle/battle_message.h`, and message defs under `include/battle/message_defs.h`.
- Battle animations: see the battle animation section below.

## Pokemon Generation, Personality, Shiny, IVs, Nature

Use this area for generated Pokemon data, shiny odds, personality-derived values, IVs, nature, gender, forms, and sprites.

First headers:

- `include/pokemon.h`: public Pokemon APIs, including initialization, shiny checks, nature, gender, stats, sprite templates, and personality helpers.
- `include/struct_defs/pokemon.h`: boxed and party Pokemon struct layout.
- `include/struct_defs/species.h`: species/personal-data fields.
- `include/constants/pokemon.h`, `include/constants/species.h`, `include/constants/forms.h`, `include/constants/types.h`: IDs and constants.

First source files:

- `src/pokemon.c`: Pokemon initialization, encryption/decryption, shiny/personality helpers, nature, gender, stat calculation.
- `src/evolution.c`: evolution checks and evolution data flow.
- `src/daycare_save.c`: daycare save data.
- `src/overlay005/daycare.c`: daycare field behavior.
- `src/field_battle_data_transfer.c`: DTO handoff between field encounters and battles.
- `src/trainer_data.c`: trainer party encounter setup.

Useful searches:

```sh
rg -n "Pokemon_IsShiny|Pokemon_IsPersonalityShiny|FindShiny|shiny" src include
rg -n "Pokemon_Init|InitAndCalcStats|monIVs|combinedIV|IV" src/pokemon.c include/pokemon.h
rg -n "GetNature|NatureOf|monNature|nature" src include
rg -n "personality|PERSONALITY|monPersonality" src/pokemon.c include/pokemon.h include/struct_defs
rg -n "GetGender|gender" src/pokemon.c include/pokemon.h include/struct_defs/species.h
rg -n "SpeciesData_Get|SPECIES_DATA_|personal" src include res/pokemon
```

Feature anchors:

- Shiny predicate: `Pokemon_IsPersonalityShiny`.
- Shiny personality generation: `Pokemon_FindShinyPersonality`.
- Nature from personality: `Pokemon_GetNatureOf`.
- Gender from personality/species: `Pokemon_GetGenderOf` and `SpeciesData_GetGenderOf`.
- IV generation for new Pokemon: look at `Pokemon_InitWith` and callers that pass IV parameters.

## Wild Encounters

Use this area for grass/water/fishing encounters, Sweet Scent, honey trees, swarms, radar, dual-slot encounters, Great Marsh, repel, and encounter rates.

First headers:

- `include/overlay006/wild_encounters.h`: wild encounter structs and exported encounter functions.
- `include/constants/wild_encounters.h`: encounter slot constants.
- `include/struct_defs/special_encounter.h`: swarms, roamers, repel steps, honey trees, and daily encounter state.
- `include/map_header.h`, `include/map_header_data.h`: map header access to wild encounter archive IDs.
- `include/data/map_headers.h`: generated/static map header data and encounter archive references.

First source files:

- `src/overlay006/wild_encounters.c`: main wild encounter selection and creation code.
- `src/map_header_data.c`: loads wild encounter data for a map.
- `src/encounter.c`: starts wild, trainer, scripted, and special battles.
- `src/overlay006/repel_step_update.c`: repel step behavior.
- `src/overlay006/swarm.c`: swarm daily encounter data.
- `src/overlay006/trophy_garden_daily_encounters.c`: Trophy Garden daily slots.
- `src/overlay006/great_marsh_daily_encounters.c`: Great Marsh daily slots.
- `src/overlay006/dual_slot_encounters.c`: GBA cartridge dual-slot replacements.
- `src/overlay006/feebas_fishing.c`: Feebas tile/rod behavior.
- `src/overlay005/honey_tree.c`: honey tree field-side logic.

Resource/data files:

- `res/field/encounters/*`: encounter data inputs.
- `res/field/encounters/pl_enc_data.naix`: encounter NARC index include used by map headers.
- `Docs/dspre_exports/Encounters.json` when available beside the toolkit.

Useful searches:

```sh
rg -n "TryWildEncounter|TryFishingEncounter|SweetScent|CreateWildMon" src/overlay006 src/encounter.c include/overlay006
rg -n "encounterRate|encounterSlot|GrassEncounter|WaterEncounter" src/overlay006 include/overlay006
rg -n "Repel|repel" src/overlay006 include struct_defs
rg -n "swarm|Swarm|trophy|GreatMarsh|Marsh|dualSlot|honey|Honey" src include
rg -n "wildEncountersArchiveID|MapHeaderData_LoadWildEncounters" src include
```

Feature anchors:

- General random wild encounter checks: `WildEncounters_TryWildEncounter`.
- Fishing: `WildEncounters_TryFishingEncounter`.
- Sweet Scent: `WildEncounters_TrySweetScentEncounter`.
- Scripted wild battle: `CreateWildMon_Scripted` and script commands in `src/scrcmd.c`.

## Field Movement And Overworld

Use this area for player movement, NPC movement, collision, maps, field objects, camera, transitions, and overworld effects.

First headers:

- `include/field/field_system.h` and `include/field_system.h`: core field system state.
- `include/map_object.h`: map object APIs.
- `include/constants/map_object.h`: object constants.
- `include/constants/field/*.h`: field map, BDHC, tile behavior, dynamic feature, and window constants.
- `include/field_task.h`, `include/field_script_context.h`: field task and script runtime.

First source files/directories:

- `src/overlay005/field_control.c`: field input/control flow.
- `src/overlay005/fieldmap.c`: map rendering/field map behavior.
- `src/overlay005/field_camera.c`: overworld camera.
- `src/overlay005/loaded_map_buffers.c`: loaded map data buffers.
- `src/overlay005/map_prop*.c`: 3D map props.
- `src/overlay005/area_data.c`, `src/overlay005/land_data.c`, `src/overlay005/bdhc.c`: map terrain/collision/height data.
- `src/map_object.c`, `src/map_object_move.c`: object movement.
- `src/map_tile_behavior.c`: tile behavior helpers.
- `src/dynamic_map_features.c`: dynamic terrain/features.
- `src/field_map_change.c`, `src/field_transition.c`: map changes and transitions.
- `docs/maps/*.md`: map format and loading documentation.

Useful searches:

```sh
rg -n "PlayerAvatar|avatar|walk|Walk|run|Run|bike|Bike|movement|Movement" src include
rg -n "MapObject|map object|Move|movement" src/map_object*.c include/map_object.h src/overlay005
rg -n "tile behavior|TileBehavior|collision|BDHC|height" src include docs/maps
rg -n "FieldTask|FieldSystem|fieldSystem" src/overlay005 src/field_* include/field*
rg -n "MapHeader|mapHeader|map matrix|MapMatrix" src include docs/maps
```

Feature anchors:

- Player movement constants may be easier to patch in ARM9 than to source-edit. Use decomp files to understand behavior, then prefer a named binary capability when available.
- NPC movement is often script-driven; check script commands and movement constants before editing field object code.

## Scripts, Vars, Flags, Events

Use this area for event scripts, script commands, flags, variables, field events, and story/progression state.

First headers:

- `include/constants/scrcmd.h`: script command constants.
- `include/data/field/script_commands.h`: command metadata/table data.
- `include/field_script_context.h`: script runtime context.
- `include/constants/savedata/vars_flags.h`: game vars and flags.
- `include/flags.h`: flag helpers.

First source files:

- `src/scrcmd.c`: large collection of field script commands.
- `src/field_script_context.c`: script context execution.
- `src/overlay005/script_message.c`: script message behavior.
- `src/overlay005/signpost.c`: signpost interactions.
- `src/overlay005/vs_seeker.c`: VS Seeker field behavior.
- `src/scrcmd_*.c`: grouped script command implementations for specialized systems.

DSPRE references when available:

- `../Docs/platinum_scrcmd_database.json`: script command names/descriptions/movement mapping.
- `../Docs/dspre_exports/EventOverworlds.csv`: event overworld exports.
- `../Docs/dspre_exports/MapHeaders.csv`: map header exports.
- `../Docs/DSPRE_Romfiles/*.cs`: DSPRE file format classes.

Useful searches:

```sh
rg -n "ScrCmd_StartWildBattle|StartTrainerBattle|StartFateful|Encounter_New" src/scrcmd.c src/scrcmd_*.c
rg -n "ScriptContext_Read|ScriptContext_GetVar|GetVarPointer" src/scrcmd.c src/scrcmd_*.c include
rg -n "FLAG_|VAR_|VarsFlags|SetFlag|CheckFlag|ClearFlag" src include
rg -n "movement|Move|Face|Walk|ApplyMovement|WaitMovement" src/scrcmd.c include/constants/scrcmd.h
rg -n "message|Message|Buffer|StringTemplate" src/scrcmd.c src/scrcmd_*.c include
```

Feature anchors:

- Scripted wild battle commands are around `ScrCmd_StartWildBattle` and fateful variants in `src/scrcmd.c`.
- Random script commands are around `ScrCmd_GetRandom` and `ScrCmd_GetRandom2`.
- Vars/flags are usually safer to identify through constants before editing script behavior.

## Text And Message Rendering

Use this area for dialogue speed, message boxes, text banks, string templates, font rendering, and message encoding.

First headers:

- `include/text.h`: text printer APIs.
- `include/render_text.h`: render loop and render result state.
- `include/message.h`: message loader.
- `include/string_template.h`: runtime string replacement templates.
- `include/font.h`, `include/font_manager.h`, `include/font_special_chars.h`: font helpers.
- `include/constants/string.h`: string constants.

First source files:

- `src/render_text.c`: core text rendering state machine and delay behavior.
- `src/text.c`: text printer setup and management.
- `src/message.c`: message loader implementation.
- `src/message_util.c`: message helpers.
- `src/field_message.c`: field message behavior.
- `src/font*.c`: font rendering helpers.
- `tools/msgenc/*`: message encoder/decoder tool.
- `res/text/*`: text resources.

Useful searches:

```sh
rg -n "Text_AddPrinter|TextPrinter|RenderText|delayCounter|textSpeed" src include
rg -n "MessageLoader|GetString|TEXT_BANK|StringTemplate" src include res/text
rg -n "FONT_|Font_|glyph|Glyph|letterSpacing" src include
rg -n "msgenc|MessagesEncoder|MessagesDecoder" tools/msgenc
```

Feature anchors:

- Normal text delay: `RenderText` in `src/render_text.c`.
- Battle text speed may involve overlay 16 battle display helpers as well as shared text rendering.
- Message content changes are data/resource work, not the same as text speed patches.

## Assets, NARC, Graphics

Use this area for NARC archives, graphics conversion, sprites, palettes, battle assets, Pokedex assets, and resource packing.

First headers:

- `include/narc.h`: runtime NARC APIs.
- `include/constants/narc.h`: NARC archive IDs.
- `include/graphics.h`, `include/character_sprite.h`: graphics and sprite loading helpers.
- `include/constants/graphics.h`: graphics constants.

First source/tools:

- `src/narc.c`: runtime NARC reading.
- `src/graphics.c`: graphics helpers.
- `src/character_sprite.c`: Pokemon sprite loading.
- `tools/nitroarc/*`: NARC archive tooling.
- `tools/nitrogfx/*`: graphics conversion tooling.
- `tools/jsoncnv/*`: JSON conversion helpers for data formats.
- `tools/ordergen/*`: generated order/index helpers.
- `res/battle/*`: battle particles/move graphics.
- `res/graphics/*`: UI and graphics resources.
- `res/pokemon/*`: Pokemon sprites/personal data resources.
- `res/trainers/*`: trainer data/resources.
- `res/items/*`: item resources.

Useful searches:

```sh
rg -n "NARC_INDEX|NARC_Read|NARC_" src include tools
rg -n "nitroarc|narc|NARC" tools res include/constants/narc.h
rg -n "Load.*Sprite|CharacterSprite|PokemonSprite|BuildPokemonSpriteTemplate" src include
rg -n "palette|Palette|NCLR|NCGR|NCER|NANR|NSCR" src include tools res
```

Feature anchors:

- Fairy type visual assets in the existing patcher touch battle object and Pokedex NARC members.
- If a request is only data/assets, prefer resource tooling or DSPRE exports instead of code injection.

## Battle Animations

Use this area for move visual effects, battle particles, animation scripts, emitters, and camera callbacks.

First headers:

- `include/battle_anim/battle_anim_system.h`
- `include/battle_anim/battle_anim_helpers.h`
- `include/battle_anim/battle_particle_util.h`
- `include/battle_anim/script_func_tables.h`
- `include/struct_defs/move_animation.h`

First source/resources:

- `src/battle_anim/battle_anim_system.c`
- `src/battle_anim/battle_anim_helpers.c`
- `src/battle_anim/script_funcs_*.c`
- `src/battle_anim/script_func_tables.c`
- `src/battle_anim/emitter_callbacks.c`
- `res/battle/particles/*.spa`
- `res/battle/moves/*`

Useful searches:

```sh
rg -n "script_func|BattleAnim|Particle|Emitter|camera" src/battle_anim include/battle_anim
rg -n "MOVE_|move animation|animation" res/battle src/battle_anim include
```

## Pokedex, Party, PC, Bag, Summary, Trainer, Item, Sound, Apps

Use these areas for UI apps and non-battle systems.

Pokedex:

- `include/applications/pokedex/*`
- `src/overlay021/*` if present, plus files named `ov21_*`
- Search:

```sh
rg -n "Pokedex|pokedex|zukan|caught|seen" src include res
```

Party menu and summary:

- `include/applications/party_menu/*`
- `include/applications/pokemon_summary_screen/*`
- `src/applications` and overlay files for party/summary screens.
- Search:

```sh
rg -n "party menu|PartyMenu|Summary|pokemon_summary|MON_DATA_" src include
```

PC boxes:

- `include/applications/pc_boxes/*`
- Source files named `ov19_*`.
- Search:

```sh
rg -n "pc_boxes|BoxPokemon|PokemonStorage|box app|PC" src include
```

Bag/items:

- `src/bag.c`, `src/bag_context.c`, `src/item.c`, `src/item_use_functions.c`, `src/item_use_pokemon.c`
- `include/constants/items.h`
- `res/items/*`
- Search:

```sh
rg -n "Bag|Item|ITEM_|UseItem|HeldItem|Pocket" src include res/items
```

Trainer data:

- `src/trainer_data.c`
- `include/trainer_data.h`
- `res/trainers/*`
- `tools/datagen/datagen_trainer.*`
- `../Docs/dspre_exports/TrainerData.txt` when available.
- Search:

```sh
rg -n "Trainer_Encounter|TrainerData|TRAINER_|trainer" src include res/trainers tools/datagen
```

Sound:

- `include/constants/sound.h`
- `src/sound*.c` if present, `src/scrcmd_sound.c`, sound resources under `res/sound`.
- Search:

```sh
rg -n "BGM|fanfare|PlaySound|PlayMusic|SEQ_|sound" src include res/sound
```

Wireless/Wi-Fi/minigames/apps:

- `src/main_menu/*`: title/main menu, mystery gift, migration.
- `src/nintendo_wfc/*`, `src/http/*`: network/WFC related code.
- `src/underground.c`, `include/underground/*`: Underground systems.
- `src/contest.c`, contest constants/resources.
- `src/applications/*`: smaller application modules.
- Search:

```sh
rg -n "Mystery|WFC|WiFi|Underground|Contest|application|overlay" src include
```

## Compact Indexes And External Reference Data

Use the compact committed indexes first. End users do not need sibling `pokeplatinum`, `Docs`, or full `DSPRE` repos for ordinary agent usage.

Compact first-look paths:

- `ai-romhacking/docs/pokeplatinum-compact-index.md`: compact source feature map with extracted pivots.
- `ai-romhacking/docs/pokeplatinum-search-playbook.md`: two-tier source fallback workflow.
- `ai-romhacking/docs/pokeplatinum-expansion-boundaries.md`: localized feature vs expansion-project guidance.
- `ai-romhacking/registries/pokeplatinum-source-index.json`: machine-readable source feature index.
- `ai-romhacking/docs/narc-format-index.md`: NARC paths, member models, offsets, bitfields, and common data edits.
- `ai-romhacking/docs/script-format-index.md`: script/event/map-header lookup.
- `ai-romhacking/docs/dspre-data-edit-playbook.md`: plain-language request-to-format mapping.
- `ai-romhacking/registries/narc-formats.platinum.json`: machine-readable NARC format index.
- `ai-romhacking/registries/script-formats.platinum.json`: machine-readable script/event format index.

Optional maintainer source paths:

- `../Docs/platinum_scrcmd_database.json`: script commands and movements.
- `../Docs/dspre_exports/PokemonPersonalData.csv`: personal data exported from DSPRE.
- `../Docs/dspre_exports/MoveData.csv`: move data.
- `../Docs/dspre_exports/Encounters.json`: encounter data.
- `../Docs/dspre_exports/TrainerData.txt`: trainer data.
- `../Docs/DSPRE_Romfiles/*.cs`: C# format classes from DSPRE.

Useful maintainer searches from the workspace root:

```sh
rg -n "class .*File|PokemonPersonalData|MoveData|TrainerFile|ScriptCommand" ../Docs/DSPRE_Romfiles
rg -n "ScrCmd|movement|decomp_name|description" ../Docs/platinum_scrcmd_database.json
```

Agent guidance:

- Check compact indexes before opening optional maintainer sources.
- If DSPRE already edits a field cleanly, do not build a binary patch for it unless the user specifically needs automation.
- For code-injection requests, use DSPRE exports as reference data only.

## Search Recipes For Agents

Use these exact patterns to keep context small.

Find function definitions:

```sh
rg -n "^[A-Za-z_][A-Za-z0-9_ *]+\\([^;]*\\)$" src include
```

Find a symbol and nearby comments:

```sh
rg -n -C 3 "Pokemon_IsPersonalityShiny|BattleSystem_CalcCriticalMulti|RenderText" src include
```

Find a script command by user concept:

```sh
rg -n -i "wild battle|trainer battle|give pokemon|set flag|check flag|random" src/scrcmd.c src/scrcmd_*.c include/constants/scrcmd.h
```

Find constants before source:

```sh
rg -n "CRITICAL|ACCURACY|TYPE_|MOVE_|SPECIES_|ITEM_|FLAG_|VAR_" include/constants include/data
```

Find resource ownership:

```sh
rg -n "pl_personal|zukan|batt_obj|enc_data|trainer|move" res include/constants/narc.h platinum.us/filesys.csv
```

Find build membership:

```sh
rg -n "filename_or_module_name|source_file_name|overlay|subdir|files\\(" meson.build src/meson.build res/meson.build asm/meson.build
```

When the search returns too many results, add the feature directory first, for example `src/battle`, `src/overlay006`, or `include/constants`.
