# Field And Scripts Source Shard

Overworld movement, field control, map objects, script commands, vars, flags, level scripts, and events.

Use this shard after `docs/request-router.md` points here. If this shard does not contain enough detail, use the listed Tier-2 searches against optional `../pokeplatinum` source.

## Field, overworld, movement
Player/NPC movement, map objects, field control, collision, tile behavior, camera, transitions.
Useful for: movement speed, NPC movement, collision, map transition behavior, field controls.
Primary files:
- `src/overlay005/field_control.c` - 1083 lines
- `src/map_object.c` - 2537 lines
- `src/map_object_move.c` - 1064 lines
- `src/map_tile_behavior.c` - 735 lines
- `src/field_system.c` - 361 lines
- `src/field_task.c` - 167 lines
- `src/field_transition.c` - 192 lines
- `docs/maps/maps.md` - 160 lines
Key symbols/pivots: `FieldTask_InitCall`, `FieldSystem_StartFieldMap`, `MapObject`, `MapObject_Move`, `FieldTransition_StartEncounterEffect`.
Extracted source pivots:
- `src/overlay005/field_control.c`: `Field_CheckMapTransition`, `Field_TileBehaviorToScript`, `Field_CheckWildEncounter`, `Field_ProcessStep`, `Field_CheckCoordEvent`, `Field_CheckTransition`, `Field_UpdateDaycare`, `Field_UpdatePoison`
- `src/map_object.c`: `MapObjectMan_Alloc`, `MapObject_Save`, `MapObject_LoadSave`, `sub_02061FA8`, `sub_02061FF0`, `sub_02062010`, `sub_020620C4`, `sub_02062120`
- `src/map_object_move.c`: `sub_02063478`, `sub_020634DC`, `sub_020634F4`, `MapObject_StartMove`, `sub_0206353C`, `MapObject_EndMove`, `sub_020635AC`, `sub_0206363C`
- `src/map_tile_behavior.c`: `TileBehavior_IsTallGrass`, `TileBehavior_IsVeryTallGrass`, `TileBehavior_IsTable`, `TileBehavior_IsDoor`, `TileBehavior_IsWarpEntranceEast`, `TileBehavior_IsWarpEntranceWest`, `TileBehavior_IsWarpEntranceNorth`, `TileBehavior_IsWarpEntranceSouth`
- `src/field_system.c`: `FS_EXTERN_OVERLAY`, `InitFieldSystemContinue`, `InitFieldSystemNewGame`, `ExecuteFieldProcesses`, `ReturnToTitleScreen`, `InitFieldSystem`, `TeardownFieldSystem`, `ExecuteAndCleanupIfDone`
- `src/field_task.c`: `CreateTaskManager`, `FieldSystem_CreateTask`, `FieldTask_InitJump`, `Heap_Free`, `FieldTask_InitCall`, `FieldTask_Run`, `FieldSystem_IsRunningTask`, `FieldSystem_IsRunningApplication`
- `src/field_transition.c`: `FieldTask_RunEncounterEffect`, `EncounterEffect_Start`, `Sound_SetSceneAndPlayBGM`, `Heap_Free`, `FieldTransition_StartEncounterEffect`, `FieldTask_InitCall`, `FieldTask_WaitUntilMapFinished`, `FieldTransition_FinishMap`
- `docs/maps/maps.md`: `width`
Compact source clues:
- `src/overlay005/field_control.c:8` #include "constants/player_avatar.h"
- `src/overlay005/field_control.c:50` #include "player_avatar.h"
- `src/overlay005/field_control.c:60` #include "terrain_collision_manager.h"
- `src/overlay005/field_control.c:73` static BOOL Field_CheckMapTransition(FieldSystem *fieldSystem, const FieldInput *input);
- `src/overlay005/field_control.c:74` static u16 Field_TileBehaviorToScript(FieldSystem *fieldSystem, u8 behavior);
- `src/overlay005/field_control.c:75` static BOOL Field_CheckWildEncounter(FieldSystem *fieldSystem);
- `src/overlay005/field_control.c:76` static BOOL Field_ProcessStep(FieldSystem *fieldSystem);
- `src/overlay005/field_control.c:77` static BOOL Field_CheckCoordEvent(FieldSystem *fieldSystem);
- `src/map_object.c:6` #include "generated/movement_types.h"
- `src/map_object.c:31` #include "map_object_move.h"
- `src/map_object.c:39` typedef struct MapObjectMan {
- `src/map_object.c:48` MapObject *mapObj;
Tier-2 fallback searches:
```sh
rg -n "PlayerAvatar|avatar|walk|run|bike|movement" ../pokeplatinum/src/overlay005/field_control.c ../pokeplatinum/src/map_object.c ../pokeplatinum/src/map_object_move.c ../pokeplatinum/src/map_tile_behavior.c ../pokeplatinum/src/field_system.c ../pokeplatinum/src/field_task.c ../pokeplatinum/src/field_transition.c ../pokeplatinum/docs/maps/maps.md
rg -n "MapObject|Move|movement" ../pokeplatinum/src/overlay005/field_control.c ../pokeplatinum/src/map_object.c ../pokeplatinum/src/map_object_move.c ../pokeplatinum/src/map_tile_behavior.c ../pokeplatinum/src/field_system.c ../pokeplatinum/src/field_task.c ../pokeplatinum/src/field_transition.c ../pokeplatinum/docs/maps/maps.md
rg -n "TileBehavior|collision|BDHC|height" ../pokeplatinum/src/overlay005/field_control.c ../pokeplatinum/src/map_object.c ../pokeplatinum/src/map_object_move.c ../pokeplatinum/src/map_tile_behavior.c ../pokeplatinum/src/field_system.c ../pokeplatinum/src/field_task.c ../pokeplatinum/src/field_transition.c ../pokeplatinum/docs/maps/maps.md
rg -n "FieldTask|FieldSystem|fieldSystem" ../pokeplatinum/src/overlay005/field_control.c ../pokeplatinum/src/map_object.c ../pokeplatinum/src/map_object_move.c ../pokeplatinum/src/map_tile_behavior.c ../pokeplatinum/src/field_system.c ../pokeplatinum/src/field_task.c ../pokeplatinum/src/field_transition.c ../pokeplatinum/docs/maps/maps.md
```
Notes: For pure movement constant patches, prefer existing patch capabilities if available.
## Scripts, events, vars, flags
Field scripts, script commands, flags/vars, event files, level scripts, story progression.
Useful for: events, flags, vars, scripted wild battles, NPC scripts, story triggers.
Primary files:
- `src/scrcmd.c` - 7138 lines
- `src/field_script_context.c` - 163 lines
- `include/constants/scrcmd.h` - 27 lines
- `include/constants/savedata/vars_flags.h` - 9 lines
- `include/data/field/script_commands.h` - 876 lines
Key symbols/pivots: `ScrCmd_StartWildBattle`, `ScrCmd_GetRandom`, `ScriptContext_ReadHalfWord`, `ScriptContext_GetVar`, `ScriptContext_GetVarPointer`.
Extracted source pivots:
- `src/scrcmd.c`: `ScrCmd_Noop`, `ScrCmd_Dummy`, `ScrCmd_End`, `ScrCmd_WaitTime`, `ScriptContext_DecrementTimer`, `ScrCmd_Unused_004`, `ScrCmd_Unused_005`, `ScrCmd_Unused_006`
- `src/field_script_context.c`: `ScriptContext_Init`, `ScriptContext_Start`, `ScriptContext_Pause`, `ScriptContext_Stop`, `ScriptContext_SetTask`, `ScriptContext_Run`, `GF_ASSERT`, `ScriptContext_Push`
- `include/data/field/script_commands.h`: `ScriptCommandTableEntry`
Compact source clues:
- `src/scrcmd.c:66` #include "overlay005/script_message.h"
- `src/scrcmd.c:105` #include "field_message.h"
- `src/scrcmd.c:126` #include "message.h"
- `src/scrcmd.c:127` #include "message_util.h"
- `src/scrcmd.c:268` static BOOL ScrCmd_SetFlag(ScriptContext *ctx);
- `src/scrcmd.c:269` static BOOL ScrCmd_ClearFlag(ScriptContext *ctx);
- `src/scrcmd.c:270` static BOOL ScrCmd_CheckFlag(ScriptContext *ctx);
- `src/scrcmd.c:271` static BOOL ScrCmd_CheckFlagFromVar(ScriptContext *ctx);
- `src/field_script_context.c:85` u16 cmdCode = ScriptContext_ReadHalfWord(ctx);
- `src/field_script_context.c:137` u16 ScriptContext_ReadHalfWord(ScriptContext *ctx)
- `src/field_script_context.c:139` u16 value = ScriptContext_ReadByte(ctx);
- `src/field_script_context.c:140` value += ScriptContext_ReadByte(ctx) << 8;
Tier-2 fallback searches:
```sh
rg -n "ScrCmd_StartWildBattle|StartTrainerBattle|Encounter_New" ../pokeplatinum/src/scrcmd.c ../pokeplatinum/src/field_script_context.c ../pokeplatinum/include/constants/scrcmd.h ../pokeplatinum/include/constants/savedata/vars_flags.h ../pokeplatinum/include/data/field/script_commands.h
rg -n "ScriptContext_Read|ScriptContext_GetVar|GetVarPointer" ../pokeplatinum/src/scrcmd.c ../pokeplatinum/src/field_script_context.c ../pokeplatinum/include/constants/scrcmd.h ../pokeplatinum/include/constants/savedata/vars_flags.h ../pokeplatinum/include/data/field/script_commands.h
rg -n "FLAG_|VAR_|VarsFlags|SetFlag|CheckFlag|ClearFlag" ../pokeplatinum/src/scrcmd.c ../pokeplatinum/src/field_script_context.c ../pokeplatinum/include/constants/scrcmd.h ../pokeplatinum/include/constants/savedata/vars_flags.h ../pokeplatinum/include/data/field/script_commands.h
rg -n "ApplyMovement|WaitMovement|message|StringTemplate" ../pokeplatinum/src/scrcmd.c ../pokeplatinum/src/field_script_context.c ../pokeplatinum/include/constants/scrcmd.h ../pokeplatinum/include/constants/savedata/vars_flags.h ../pokeplatinum/include/data/field/script_commands.h
```
Notes: Use script-format compact index first for command/movement lookup.

## Back To Router

- `docs/agent-start-here.md`
- `docs/request-router.md`
- `docs/pokeplatinum-compact-index.md`
