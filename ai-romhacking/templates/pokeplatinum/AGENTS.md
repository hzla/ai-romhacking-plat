# AGENTS.md - pokeplatinum Reference

Scope: use this decomp as source reference for Pokemon Platinum behavior. For binary patch application, prefer the sibling `ai-romhacking` toolkit and its registered capabilities.

Most users should not need to provide this repo. If this repo is available as an optional source fallback, check `../ai-romhacking/docs/agent-start-here.md`, `../ai-romhacking/docs/request-router.md`, one `../ai-romhacking/docs/source/*.md` shard, and `../ai-romhacking/registries/pokeplatinum-source-index.json` before opening broad source files.

## Search Rules

- Use `rg` before opening broad files.
- Read headers before large source files when possible.
- Start from the compact `ai-romhacking` source index, then the feature map below.
- Avoid loading all of `src/` or `include/`.
- Keep DSPRE-style data edits separate from source/code-injection work.

## Feature Map

Build and ROM identity:

- `README.md`
- `INSTALL.md`
- `Makefile`
- `meson.build`
- `platinum.us/filesys.csv`
- `platinum.us/*sha1`

Battle engine:

- `src/battle/battle_script.c`
- `src/battle/battle_lib.c`
- `src/battle/battle_system.c`
- `src/battle/battle_controller_player.c`
- `include/battle/battle_context.h`
- `include/battle/battle_lib.h`
- `include/constants/battle/*`

Battle searches:

```sh
rg -n "CalcCritical|criticalMul|critical" src/battle include/battle
rg -n "CalcDamage|CalcMoveDamage|CalcDamageVariance" src/battle include/battle
rg -n "accuracy|No Guard|Lock On|MOVE_STATUS_MISSED" src/battle include/battle
rg -n "ApplyTypeChart|effectiveness|TYPE_" src/battle include/battle include/constants
```

Pokemon generation, shiny, IVs, nature:

- `src/pokemon.c`
- `include/pokemon.h`
- `include/struct_defs/pokemon.h`
- `include/struct_defs/species.h`
- `src/daycare_save.c`
- `src/overlay005/daycare.c`

Searches:

```sh
rg -n "Pokemon_IsShiny|Pokemon_IsPersonalityShiny|FindShiny|shiny" src include
rg -n "Pokemon_Init|monIVs|combinedIV|IV" src/pokemon.c include/pokemon.h
rg -n "GetNature|NatureOf|personality" src/pokemon.c include/pokemon.h
```

Wild encounters:

- `src/overlay006/wild_encounters.c`
- `include/overlay006/wild_encounters.h`
- `src/map_header_data.c`
- `include/data/map_headers.h`
- `src/encounter.c`

Searches:

```sh
rg -n "TryWildEncounter|TryFishingEncounter|SweetScent|CreateWildMon" src/overlay006 src/encounter.c include/overlay006
rg -n "encounterRate|encounterSlot|Repel|swarm|honey|dualSlot" src include
```

Field movement and overworld:

- `src/overlay005/*`
- `src/map_object.c`
- `src/map_object_move.c`
- `src/map_tile_behavior.c`
- `src/field_*`
- `docs/maps/*`

Searches:

```sh
rg -n "PlayerAvatar|walk|run|bike|movement" src include
rg -n "MapObject|Move|TileBehavior|collision|BDHC" src include docs/maps
```

Scripts, vars, flags, events:

- `src/scrcmd.c`
- `src/scrcmd_*.c`
- `include/constants/scrcmd.h`
- `include/constants/savedata/vars_flags.h`
- `include/data/field/script_commands.h`

Searches:

```sh
rg -n "ScrCmd_StartWildBattle|Encounter_New|ScriptContext_GetVar" src/scrcmd.c src/scrcmd_*.c
rg -n "FLAG_|VAR_|SetFlag|CheckFlag|ClearFlag" src include
```

Text and messages:

- `src/render_text.c`
- `src/text.c`
- `src/message.c`
- `src/field_message.c`
- `include/text.h`
- `include/render_text.h`
- `tools/msgenc/*`
- `res/text/*`

Searches:

```sh
rg -n "Text_AddPrinter|TextPrinter|RenderText|delayCounter|textSpeed" src include
rg -n "MessageLoader|TEXT_BANK|StringTemplate" src include res/text
```

Assets, NARC, graphics:

- `src/narc.c`
- `include/narc.h`
- `include/constants/narc.h`
- `tools/nitroarc/*`
- `tools/nitrogfx/*`
- `res/*`

Searches:

```sh
rg -n "NARC_INDEX|NARC_Read|NARC_" src include tools
rg -n "palette|NCLR|NCGR|NCER|NANR|NSCR" src include tools res
```

## When To Use ai-romhacking

If the user asks for one of these, prefer the registered binary capability instead of source edits:

- shiny odds
- no critical hits
- IV range
- wild nature filter
- framerate unlock
- faster movement
- Fairy type patch
- fast text
- player-side accuracy bypass

Use source research to understand behavior, not to reimplement an existing patch.
