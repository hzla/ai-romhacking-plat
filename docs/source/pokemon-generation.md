# Pokemon Generation Source Shard

Pokemon creation, personality, shiny checks, natures, IVs, wild encounter runtime, and species-data access.

Use this shard after `docs/request-router.md` points here. If this shard does not contain enough detail, use the listed Tier-2 searches against optional `../pokeplatinum` source.

## Pokemon generation, personality, stats
Pokemon initialization, shiny/personality checks, nature/gender, stats, species data access.
Useful for: shiny logic, nature/gender changes, IV/stat generation, species personal data runtime access.
Primary files:
- `src/pokemon.c` - 5356 lines
- `include/pokemon.h` - 915 lines
- `include/struct_defs/pokemon.h` - 160 lines
- `include/struct_defs/species.h` - 90 lines
- `src/field_battle_data_transfer.c` - 550 lines
- `src/trainer_data.c` - 317 lines
Key symbols/pivots: `Pokemon_InitWith`, `Pokemon_InitAndCalcStats`, `Pokemon_IsPersonalityShiny`, `Pokemon_FindShinyPersonality`, `Pokemon_GetNatureOf`, `SpeciesData_GetValue`.
Extracted source pivots:
- `src/pokemon.c`: `sub_02073E18`, `Pokemon_GetDataInternal`, `BoxPokemon_GetDataInternal`, `Pokemon_SetDataInternal`, `BoxPokemon_SetDataInternal`, `Pokemon_IncreaseDataInternal`, `BoxPokemon_IncreaseDataInternal`, `BoxPokemon_GetExpToNextLevel`
- `include/pokemon.h`: `Pokemon_Init`, `BoxPokemon_Init`, `Pokemon_StructSize`, `Pokemon_New`, `Pokemon_EnterDecryptionContext`, `Pokemon_ExitDecryptionContext`, `BoxPokemon_EnterDecryptionContext`, `BoxPokemon_ExitDecryptionContext`
- `src/field_battle_data_transfer.c`: `CalcTerrain`, `SetBackgroundAndTerrain`, `FieldBattleDTO_New`, `MI_CpuClear8`, `MI_CpuClear32`, `GetCurrentDateTime`, `FieldBattleDTO_NewSafari`, `FieldBattleDTO_NewPalPark`
- `src/trainer_data.c`: `TrainerData_BuildParty`, `Trainer_Encounter`, `Trainer_Load`, `CharCode_Copy`, `String_ToChars`, `String_Free`, `MessageLoader_Free`, `Trainer_LoadParam`
Compact source clues:
- `src/pokemon.c:21` #include "generated/species_data_params.h"
- `src/pokemon.c:160` [NATURE_NAIVE] = {
- `src/pokemon.c:246` static void sub_02073E18(BoxPokemon *boxMon, int monSpecies, int monLevel, int monIVs, BOOL useMonPersonalityParam, u32 monPersonality, int monOTIDSource, u32 monOTID);
- `src/pokemon.c:256` static u16 Pokemon_GetNatureStatValue(u8 monNature, u16 monStatValue, u8 statType);
- `src/pokemon.c:257` static u8 BoxPokemon_IsShiny(BoxPokemon *boxMon);
- `src/pokemon.c:258` static inline BOOL Pokemon_InlineIsPersonalityShiny(u32 monOTID, u32 monPersonality);
- `src/pokemon.c:259` static void BuildPokemonSpriteTemplateDP(PokemonSpriteTemplate *spriteTemplate, u16 monSpecies, u8 monGender, u8 param3, u8 monShininess, u8 monForm, u32 monPersonality);
- `src/pokemon.c:260` static u8 LoadPokemonDPSpriteHeight(u16 monSpecies, u8 monGender, u8 param2, u8 monForm, u32 monPersonality);
- `include/pokemon.h:29` #define OTID_NOT_SHINY 2
- `include/pokemon.h:34` #define INIT_IVS_RANDOM 32
- `include/pokemon.h:46` FRIENDSHIP_EVENT_POISON_SURVIVE,
- `include/pokemon.h:64` void Pokemon_Init(Pokemon *mon);
Tier-2 fallback searches:
```sh
rg -n "Pokemon_IsShiny|Pokemon_IsPersonalityShiny|FindShiny|shiny" ../pokeplatinum/src/pokemon.c ../pokeplatinum/include/pokemon.h ../pokeplatinum/include/struct_defs/pokemon.h ../pokeplatinum/include/struct_defs/species.h ../pokeplatinum/src/field_battle_data_transfer.c ../pokeplatinum/src/trainer_data.c
rg -n "Pokemon_Init|InitAndCalcStats|monIVs|combinedIV|IV" ../pokeplatinum/src/pokemon.c ../pokeplatinum/include/pokemon.h ../pokeplatinum/include/struct_defs/pokemon.h ../pokeplatinum/include/struct_defs/species.h ../pokeplatinum/src/field_battle_data_transfer.c ../pokeplatinum/src/trainer_data.c
rg -n "GetNature|NatureOf|personality" ../pokeplatinum/src/pokemon.c ../pokeplatinum/include/pokemon.h ../pokeplatinum/include/struct_defs/pokemon.h ../pokeplatinum/include/struct_defs/species.h ../pokeplatinum/src/field_battle_data_transfer.c ../pokeplatinum/src/trainer_data.c
rg -n "SpeciesData_Get|SPECIES_DATA_|personal" ../pokeplatinum/src/pokemon.c ../pokeplatinum/include/pokemon.h ../pokeplatinum/include/struct_defs/pokemon.h ../pokeplatinum/include/struct_defs/species.h ../pokeplatinum/src/field_battle_data_transfer.c ../pokeplatinum/src/trainer_data.c
```
Notes: Use NARC format indexes first for personal-data byte edits; use this for runtime behavior.
## Wild encounters
Grass/water/fishing/Sweet Scent encounters, repel, swarm, radar, honey trees, Great Marsh.
Useful for: encounter rates, wild species slots, Sweet Scent, repel, honey trees, daily encounters.
Primary files:
- `src/overlay006/wild_encounters.c` - 1549 lines
- `include/overlay006/wild_encounters.h` - 64 lines
- `src/map_header_data.c` - 260 lines
- `include/data/map_headers.h` - 13065 lines
- `src/encounter.c` - 994 lines
- `src/overlay006/repel_step_update.c` - 27 lines
Key symbols/pivots: `WildEncounters_TryWildEncounter`, `WildEncounters_TryFishingEncounter`, `WildEncounters_TrySweetScentEncounter`, `CreateWildMon_Scripted`, `MapHeaderData_LoadWildEncounters`.
Extracted source pivots:
- `src/overlay006/wild_encounters.c`: `ShouldGetRandomEncounter`, `GetTileEncounterRateAndType`, `GracePeriodStepsUsed`, `CheckEncounterRateSuccess`, `TryGetSlotForTypeMatchAbility`, `FirstMonAbilityPreventsEncounter`, `GetGrassEncounterRate`, `GetSurfEncounterRate`
- `include/overlay006/wild_encounters.h`: `WildEncounters_ReplaceTimedEncounters`, `WildEncounters_TryWildEncounter`, `WildEncounters_TryFishingEncounter`, `WildEncounters_TrySweetScentEncounter`, `WildEncounters_TryMudEncounter`, `CreateWildMon_HoneyTree`, `CreateWildMon_Scripted`, `WildEncounters_TileHasEncounterRate`
- `src/map_header_data.c`: `MapHeaderData_LoadEvents`, `MapHeaderData_ParseEvents`, `MapHeaderData_LoadInitScripts`, `MapHeaderData_Init`, `MapHeaderData_Free`, `Heap_Free`, `MapHeaderData_Load`, `MapHeaderData_LoadWildEncounters`
- `src/encounter.c`: `NewEncounter`, `NewWildEncounter`, `FreeEncounter`, `FreeWildEncounter`, `CallBattleTask`, `CheckPlayerWonEncounter`, `UpdateFieldSystemFromDTO`, `StartEncounter`
- `src/overlay006/repel_step_update.c`: `Repel_UpdateSteps`, `ScriptManager_Set`
Compact source clues:
- `src/overlay006/wild_encounters.c:21` #include "overlay005/honey_tree.h"
- `src/overlay006/wild_encounters.c:26` #include "overlay006/swarm.h"
- `src/overlay006/wild_encounters.c:66` typedef struct EncounterSlot {
- `src/overlay006/wild_encounters.c:70` } EncounterSlot;
- `src/overlay006/wild_encounters.c:74` BOOL repelActive;
- `src/overlay006/wild_encounters.c:79` u8 encounterRatesForms[2]; // from encounterData. Only used for Shellos/Gastrodon
- `src/overlay006/wild_encounters.c:88` static BOOL ShouldGetRandomEncounter(FieldSystem *fieldSystem, const u32 encounterRate, const u8 tileBehavior);
- `src/overlay006/wild_encounters.c:89` static u8 GetTileEncounterRateAndType(FieldSystem *fieldSystem, u8 tileBehavior, u8 *encounterType);
- `include/overlay006/wild_encounters.h:8` typedef struct GrassEncounter {
- `include/overlay006/wild_encounters.h:12` } GrassEncounter;
- `include/overlay006/wild_encounters.h:14` typedef struct GrassEncounters {
- `include/overlay006/wild_encounters.h:15` int encounterRate;
Tier-2 fallback searches:
```sh
rg -n "TryWildEncounter|TryFishingEncounter|SweetScent|CreateWildMon" ../pokeplatinum/src/overlay006/wild_encounters.c ../pokeplatinum/include/overlay006/wild_encounters.h ../pokeplatinum/src/map_header_data.c ../pokeplatinum/include/data/map_headers.h ../pokeplatinum/src/encounter.c ../pokeplatinum/src/overlay006/repel_step_update.c
rg -n "encounterRate|encounterSlot|GrassEncounter|WaterEncounter" ../pokeplatinum/src/overlay006/wild_encounters.c ../pokeplatinum/include/overlay006/wild_encounters.h ../pokeplatinum/src/map_header_data.c ../pokeplatinum/include/data/map_headers.h ../pokeplatinum/src/encounter.c ../pokeplatinum/src/overlay006/repel_step_update.c
rg -n "Repel|swarm|trophy|GreatMarsh|dualSlot|honey" ../pokeplatinum/src/overlay006/wild_encounters.c ../pokeplatinum/include/overlay006/wild_encounters.h ../pokeplatinum/src/map_header_data.c ../pokeplatinum/include/data/map_headers.h ../pokeplatinum/src/encounter.c ../pokeplatinum/src/overlay006/repel_step_update.c
```
Notes: Use NARC encounter index first for direct table edits.

## Back To Router

- `docs/agent-start-here.md`
- `docs/request-router.md`
- `docs/pokeplatinum-compact-index.md`
