# Battle Source Shard

Battle rules, damage, accuracy, critical hits, type chart, abilities, weather, trainer AI, and battle animations.

Use this shard after `docs/request-router.md` points here. If this shard does not contain enough detail, use the listed Tier-2 searches against optional `../pokeplatinum` source.

## Battle core
Move execution, damage, accuracy, critical hits, type chart, battle state, battle messages.
Useful for: critical hits, damage formula, accuracy, type effectiveness, battle rules, weather/ability interactions.
Primary files:
- `src/battle/battle_script.c` - 12346 lines
- `src/battle/battle_lib.c` - 8205 lines
- `src/battle/battle_system.c` - 2323 lines
- `src/battle/battle_controller_player.c` - 4865 lines
- `include/battle/battle_context.h` - 316 lines
- `include/battle/battle_lib.h` - 1489 lines
- `include/constants/battle.h` - 170 lines
Key symbols/pivots: `BattleScript_CalcMoveDamage`, `BtlCmd_CalcDamage`, `BattleSystem_CalcMoveDamage`, `BattleSystem_CalcDamageVariance`, `BattleSystem_CalcCriticalMulti`, `BattleSystem_ApplyTypeChart`.
Extracted source pivots:
- `src/battle/battle_script.c`: `BtlCmd_PlayEncounterAnimation`, `BtlCmd_SetPokemonEncounter`, `BtlCmd_PokemonSlideIn`, `BtlCmd_PokemonSendOut`, `BtlCmd_RecallPokemon`, `BtlCmd_DeletePokemon`, `BtlCmd_SetTrainerEncounter`, `BtlCmd_ThrowPokeball`
- `src/battle/battle_lib.c`: `BasicTypeMulApplies`, `MapSideEffectToSubscript`, `ApplyTypeMultiplier`, `NoImmunityOverrides`, `UpateMoveStatusForTypeMul`, `MoveIsOnDamagingTurn`, `Battler_MonType`, `BattleAI_ClearKnownMoves`
- `src/battle/battle_system.c`: `BattleMessage_CheckSide`, `BattleMessage_FillFormatBuffers`, `BattleMessage_Format`, `BattleMessage_Callback`, `BattleMessage_SetNickname`, `BattleMessage_SetMoveName`, `BattleMessage_SetItemName`, `BattleMessage_SetNumber`
- `src/battle/battle_controller_player.c`: `BattleControllerPlayer_InitBattleMons`, `BattleControllerPlayer_StartEncounter`, `BattleControllerPlayer_TrainerMessage`, `BattleControllerPlayer_ShowBattleMon`, `BattleControllerPlayer_InitCommandSelection`, `BattleControllerPlayer_CommandSelectionInput`, `BattleControllerPlayer_CalcTurnOrder`, `BattleControllerPlayer_CheckPreMoveActions`
- `include/battle/battle_lib.h`: `BattleSystem_InitBattleMon`, `BattleSystem_ReloadPokemon`, `BattleSystem_LoadScript`, `BattleSystem_CallScript`, `BattleSystem_PopScript`, `BattleIO_EnqueueVal`, `BattleIO_DequeueVal`, `BattleIO_QueueIsEmpty`
Compact source clues:
- `src/battle/battle_script.c:103` static BOOL BtlCmd_CalcDamage(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_script.c:104` static BOOL BtlCmd_CalcMaxDamage(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_script.c:143` static BOOL BtlCmd_CheckAbility(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_script.c:197` static BOOL BtlCmd_EndOfTurnWeatherEffect(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_script.c:206` static BOOL BtlCmd_WeatherHPRecovery(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_script.c:229` static BOOL BtlCmd_CalcWeatherBallParams(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_script.c:231` static BOOL BtlCmd_ApplyTypeEffectiveness(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_script.c:249` static BOOL BtlCmd_CheckIgnorableAbility(BattleSystem *battleSys, BattleContext *battleCtx);
- `src/battle/battle_lib.c:56` static int ApplyTypeMultiplier(BattleContext *battleCtx, int attacker, int mul, int damage, BOOL update, u32 *moveStatus);
- `src/battle/battle_lib.c:62` static void BattleAI_ClearKnownAbility(BattleContext *battleCtx, u8 battler);
- `src/battle/battle_lib.c:103` battleCtx->battleMons[battler].weatherAbilityAnnounced = FALSE;
- `src/battle/battle_lib.c:114` battleCtx->battleMons[battler].type1 = Pokemon_GetValue(mon, MON_DATA_TYPE_1, NULL);
Tier-2 fallback searches:
```sh
rg -n "CalcCritical|criticalMul|critical" ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_system.c ../pokeplatinum/src/battle/battle_controller_player.c ../pokeplatinum/include/battle/battle_context.h ../pokeplatinum/include/battle/battle_lib.h ../pokeplatinum/include/constants/battle.h
rg -n "CalcDamage|CalcMoveDamage|CalcDamageVariance|damage" ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_system.c ../pokeplatinum/src/battle/battle_controller_player.c ../pokeplatinum/include/battle/battle_context.h ../pokeplatinum/include/battle/battle_lib.h ../pokeplatinum/include/constants/battle.h
rg -n "accuracy|MOVE_STATUS_MISSED|No Guard|Lock On" ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_system.c ../pokeplatinum/src/battle/battle_controller_player.c ../pokeplatinum/include/battle/battle_context.h ../pokeplatinum/include/battle/battle_lib.h ../pokeplatinum/include/constants/battle.h
rg -n "ApplyTypeChart|effectiveness|TYPE_" ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_system.c ../pokeplatinum/src/battle/battle_controller_player.c ../pokeplatinum/include/battle/battle_context.h ../pokeplatinum/include/battle/battle_lib.h ../pokeplatinum/include/constants/battle.h
rg -n "ability|ABILITY_|weather|WEATHER_" ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_system.c ../pokeplatinum/src/battle/battle_controller_player.c ../pokeplatinum/include/battle/battle_context.h ../pokeplatinum/include/battle/battle_lib.h ../pokeplatinum/include/constants/battle.h
```
Notes: For requests like changing Chlorophyll weather behavior, start here plus constants for abilities/weather.
## Abilities, weather, held items in battle
Battle runtime handling for abilities, weather, held item effects, and stat modifiers.
Useful for: change ability behavior, weather-dependent abilities, held item battle effects, stat modifier hooks.
Primary files:
- `src/battle/battle_lib.c` - 8205 lines
- `src/battle/battle_script.c` - 12346 lines
- `generated/abilities.txt` - 125 lines
- `include/constants/battle.h` - 170 lines
- `include/constants/items.h` - 173 lines
- `include/battle/battle_context.h` - 316 lines
Key symbols/pivots: `BattleSystem_CalcMoveDamage`, `BattleSystem_TriggerAbility`, `Battler_Ability`, `Battler_HeldItem`, `BattleContext_Get`.
Extracted source pivots:
- `src/battle/battle_lib.c`: `BasicTypeMulApplies`, `MapSideEffectToSubscript`, `ApplyTypeMultiplier`, `NoImmunityOverrides`, `UpateMoveStatusForTypeMul`, `MoveIsOnDamagingTurn`, `Battler_MonType`, `BattleAI_ClearKnownMoves`
- `src/battle/battle_script.c`: `BtlCmd_PlayEncounterAnimation`, `BtlCmd_SetPokemonEncounter`, `BtlCmd_PokemonSlideIn`, `BtlCmd_PokemonSendOut`, `BtlCmd_RecallPokemon`, `BtlCmd_DeletePokemon`, `BtlCmd_SetTrainerEncounter`, `BtlCmd_ThrowPokeball`
Compact source clues:
- `src/battle/battle_lib.c:42` #include "trainer_data.h"
- `src/battle/battle_lib.c:43` #include "trainer_info.h"
- `src/battle/battle_lib.c:62` static void BattleAI_ClearKnownAbility(BattleContext *battleCtx, u8 battler);
- `src/battle/battle_lib.c:77` battleCtx->battleMons[battler].speed = Pokemon_GetValue(mon, MON_DATA_SPEED, NULL);
- `src/battle/battle_lib.c:91` battleCtx->battleMons[battler].speedIV = Pokemon_GetValue(mon, MON_DATA_SPEED_IV, NULL);
- `src/battle/battle_lib.c:103` battleCtx->battleMons[battler].weatherAbilityAnnounced = FALSE;
- `src/battle/battle_lib.c:120` battleCtx->battleMons[battler].ability = ABILITY_NONE;
- `src/battle/battle_lib.c:122` battleCtx->battleMons[battler].heldItem = ITEM_NONE;
- `src/battle/battle_script.c:24` #include "struct_defs/trainer.h"
- `src/battle/battle_script.c:71` #include "trainer_data.h"
- `src/battle/battle_script.c:72` #include "trainer_info.h"
- `src/battle/battle_script.c:94` static BOOL BtlCmd_SetTrainerEncounter(BattleSystem *battleSys, BattleContext *battleCtx);
Tier-2 fallback searches:
```sh
rg -n "ABILITY_|ability|Battler_Ability|HeldItem" ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/generated/abilities.txt ../pokeplatinum/include/constants/battle.h ../pokeplatinum/include/constants/items.h ../pokeplatinum/include/battle/battle_context.h
rg -n "WEATHER_|weather|sun|rain|hail|sandstorm" ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/generated/abilities.txt ../pokeplatinum/include/constants/battle.h ../pokeplatinum/include/constants/items.h ../pokeplatinum/include/battle/battle_context.h
rg -n "Speed|speed|stat stage|modifier" ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/generated/abilities.txt ../pokeplatinum/include/constants/battle.h ../pokeplatinum/include/constants/items.h ../pokeplatinum/include/battle/battle_context.h
rg -n "Chlorophyll|CHLOROPHYLL" ../pokeplatinum/src/battle/battle_lib.c ../pokeplatinum/src/battle/battle_script.c ../pokeplatinum/generated/abilities.txt ../pokeplatinum/include/constants/battle.h ../pokeplatinum/include/constants/items.h ../pokeplatinum/include/battle/battle_context.h
```
Notes: Many ability constants may live in generated or nested constants; search before assuming a file path.
## Trainers and AI
Trainer data setup, trainer battle encounter handoff, battle AI constants/scripts.
Useful for: trainer party behavior, trainer AI flags, battle opening, trainer classes.
Primary files:
- `src/trainer_data.c` - 317 lines
- `include/trainer_data.h` - 97 lines
- `include/battle/trainer_ai.h` - 38 lines
- `asm/trainer_ai`
- `tools/datagen/datagen_trainer.cpp` - 395 lines
- `res/trainers/meson.build` - 83 lines
Key symbols/pivots: `Trainer_Encounter`, `Trainer_Load`, `BattleSystem_LoadTrainerParty`, `TrainerAI_Main`.
Extracted source pivots:
- `src/trainer_data.c`: `TrainerData_BuildParty`, `Trainer_Encounter`, `Trainer_Load`, `CharCode_Copy`, `String_ToChars`, `String_Free`, `MessageLoader_Free`, `Trainer_LoadParam`
- `include/trainer_data.h`: `Trainer_Encounter`, `Trainer_LoadParam`, `Trainer_HasMessageType`, `Trainer_LoadMessage`, `Trainer_Load`, `Trainer_LoadParty`, `TrainerClass_Gender`
- `include/battle/trainer_ai.h`: `TrainerAI_Init`, `TrainerAI_Main`, `TrainerAI_PickCommand`
- `tools/datagen/datagen_trainer.cpp`: `PackImmediately`, `ParseMovesAndPack`, `ParseItemAndPack`, `ParseMovesAndItemAndPack`, `Usage`, `AnyMemberHasValue`, `ParseTrainerData`, `memcpy`
- `res/trainers/meson.build`: `subdir`
Compact source clues:
- `src/trainer_data.c:1` #include "trainer_data.h"
- `src/trainer_data.c:5` #include "generated/trainer_message_types.h"
- `src/trainer_data.c:7` #include "struct_defs/trainer.h"
- `src/trainer_data.c:9` #include "data/trainer_class_genders.h"
- `src/trainer_data.c:23` static void TrainerData_BuildParty(FieldBattleDTO *dto, int battler, enum HeapID heapID);
- `src/trainer_data.c:25` void Trainer_Encounter(FieldBattleDTO *dto, const SaveData *saveData, enum HeapID heapID)
- `src/trainer_data.c:27` Trainer trdata;
- `src/trainer_data.c:28` MessageLoader *msgLoader = MessageLoader_Init(MSG_LOADER_LOAD_ON_DEMAND, NARC_INDEX_MSGDATA__PL_MSG, TEXT_BANK_NPC_TRAINER_NAMES, heapID);
- `include/trainer_data.h:1` #ifndef POKEPLATINUM_TRAINER_DATA_H
- `include/trainer_data.h:2` #define POKEPLATINUM_TRAINER_DATA_H
- `include/trainer_data.h:4` #include "generated/trainer_message_types.h"
- `include/trainer_data.h:6` #include "struct_defs/trainer.h"
Tier-2 fallback searches:
```sh
rg -n "Trainer_Encounter|TrainerData|TRAINER_|trainer" ../pokeplatinum/src/trainer_data.c ../pokeplatinum/include/trainer_data.h ../pokeplatinum/include/battle/trainer_ai.h ../pokeplatinum/asm/trainer_ai ../pokeplatinum/tools/datagen/datagen_trainer.cpp ../pokeplatinum/res/trainers/meson.build
rg -n "trainer_ai|AI|moveDamageRolls|AI_CONTEXT" ../pokeplatinum/src/trainer_data.c ../pokeplatinum/include/trainer_data.h ../pokeplatinum/include/battle/trainer_ai.h ../pokeplatinum/asm/trainer_ai ../pokeplatinum/tools/datagen/datagen_trainer.cpp ../pokeplatinum/res/trainers/meson.build
rg -n "partyCount|trainerClass|doubleBattle" ../pokeplatinum/src/trainer_data.c ../pokeplatinum/include/trainer_data.h ../pokeplatinum/include/battle/trainer_ai.h ../pokeplatinum/asm/trainer_ai ../pokeplatinum/tools/datagen/datagen_trainer.cpp ../pokeplatinum/res/trainers/meson.build
```
Notes: Use DSPRE trainer format index for data edits; use decomp for behavior.
## Battle animations
Move visual effects, particles, animation scripts, emitters, camera callbacks.
Useful for: move animation changes, particle effects, battle visual behavior.
Primary files:
- `src/battle_anim/battle_anim_system.c` - 4122 lines
- `src/battle_anim/script_func_tables.c` - 168 lines
- `src/battle_anim/script_funcs_0.c` - 2797 lines
- `src/battle_anim/emitter_callbacks.c` - 565 lines
- `include/battle_anim/battle_anim_system.h` - 296 lines
- `res/battle/particles/battle_particles.order` - 486 lines
Key symbols/pivots: `BattleAnimSystem_Start`, `BattleAnimSystem_New`, `BattleParticle_New`, `BattleAnimScriptFunc`.
Extracted source pivots:
- `src/battle_anim/battle_anim_system.c`: `ov12_022224F8`, `BattleAnimScript_WaitForDelay`, `BattleAnimScript_Execute`, `BattleAnimSystem_StartTask`, `BattleAnimSystem_EndTask`, `BattleAnimSystem_CreateSoundContext`, `BattleAnimSystem_StartSoundTaskInternal`, `BattleAnimSound_Task`
- `src/battle_anim/script_func_tables.c`: `UnusedSpriteFunc`, `UNUSED`, `BattleAnimScript_GetFunc`, `BattleAnimScript_GetSpriteFunc`
- `src/battle_anim/script_funcs_0.c`: `ov12_0222AC70`, `ManagedSprite_GetPositionXY`, `ManagedSprite_SetDrawFlag`, `ScaleLerpContext_InitXY`, `ScaleLerpContext_GetAffineScale`, `ManagedSprite_SetAffineScale`, `G2_ChangeBlendAlpha`, `Sprite_DeleteAndFreeResources`
- `src/battle_anim/emitter_callbacks.c`: `BattleParticleUtil_GetSignFromBattler`, `BattleAnimEmitterCb_Nop2`, `BattleAnimEmitterCb_SetPosToEnemy1`, `UNUSED`, `BattleAnimUtil_GetBattlerWorldPos_Normal`, `BattleAnimUtil_GetBattlerTypeWorldPos_Normal`, `SPLEmitter_SetPosX`, `SPLEmitter_SetPosY`
- `include/battle_anim/battle_anim_system.h`: `position`, `void`, `BattleAnimSystem_New`, `BattleAnimSystem_SetIsContest`, `BattleAnimSystem_IsContest`, `BattleAnimSystem_GetHeapID`, `BattleAnimSystem_Delete`, `BattleAnimSystem_StartMove`
Compact source clues:
- `src/battle_anim/battle_anim_system.c:15` #include "struct_defs/move_animation.h"
- `src/battle_anim/battle_anim_system.c:23` #include "battle_anim/battle_particle_util.h"
- `src/battle_anim/battle_anim_system.c:26` #include "battle_anim/script_func_tables.h"
- `src/battle_anim/battle_anim_system.c:38` #include "particle_system.h"
- `src/battle_anim/battle_anim_system.c:57` typedef struct BattleAnimSoundContext {
- `src/battle_anim/battle_anim_system.c:77` BattleAnimSystem *system;
- `src/battle_anim/battle_anim_system.c:78` } BattleAnimSoundContext;
- `src/battle_anim/battle_anim_system.c:80` enum BattleAnimSoundTaskType {
- `src/battle_anim/script_func_tables.c:1` #include "battle_anim/script_func_tables.h"
- `src/battle_anim/script_func_tables.c:8` #include "battle_anim/script_func_examples.h"
- `src/battle_anim/script_func_tables.c:9` #include "battle_anim/script_func_mimic.h"
- `src/battle_anim/script_func_tables.c:10` #include "battle_anim/script_func_tables.h"
Tier-2 fallback searches:
```sh
rg -n "script_func|BattleAnim|Particle|Emitter|camera" ../pokeplatinum/src/battle_anim/battle_anim_system.c ../pokeplatinum/src/battle_anim/script_func_tables.c ../pokeplatinum/src/battle_anim/script_funcs_0.c ../pokeplatinum/src/battle_anim/emitter_callbacks.c ../pokeplatinum/include/battle_anim/battle_anim_system.h ../pokeplatinum/res/battle/particles/battle_particles.order
rg -n "MOVE_|move animation|animation" ../pokeplatinum/src/battle_anim/battle_anim_system.c ../pokeplatinum/src/battle_anim/script_func_tables.c ../pokeplatinum/src/battle_anim/script_funcs_0.c ../pokeplatinum/src/battle_anim/emitter_callbacks.c ../pokeplatinum/include/battle_anim/battle_anim_system.h ../pokeplatinum/res/battle/particles/battle_particles.order
```
Notes: Animation work often needs asset/resource context as well as code.

## Back To Router

- `docs/agent-start-here.md`
- `docs/request-router.md`
- `docs/pokeplatinum-compact-index.md`
