# Text And UI Source Shard

Text rendering, message loaders, Pokedex, party, PC, bag, summary, save records, options, menus, and side apps.

Use this shard after `docs/request-router.md` points here. If this shard does not contain enough detail, use the listed Tier-2 searches against optional `../pokeplatinum` source.

## Text and messages
Text rendering, message loaders, string templates, fonts, message speed and text banks.
Useful for: fast text, dialogue rendering, message content, text banks, font/glyph behavior.
Primary files:
- `src/render_text.c` - 462 lines
- `src/text.c` - 359 lines
- `src/message.c` - 343 lines
- `src/message_util.c` - 64 lines
- `src/field_message.c` - 103 lines
- `include/text.h` - 51 lines
- `include/render_text.h` - 102 lines
- `tools/msgenc/msgenc.cpp` - 84 lines
Key symbols/pivots: `RenderText`, `Text_AddPrinterWithParams`, `MessageLoader_Init`, `MessageLoader_GetString`, `StringTemplate_Set`.
Extracted source pivots:
- `src/render_text.c`: `RenderText`, `Text_GenerateFontHalfRowLookupTable`, `Text_RenderScreenIndicator`, `Window_CopyToVRAM`, `TextPrinter_InitScrollArrowAnim`, `TextPrinter_ClearScrollArrow`, `Window_FillTilemap`, `Window_Scroll`
- `src/text.c`: `TextPrinter_Render`, `Text_CreatePrinterTask`, `Text_DestroyPrinterTask`, `Text_ZeroPrinterIconGfx`, `Text_FreePrinterIconGfx`, `Text_LoadScreenIndicatorGfx`, `SysTask_RunTextPrinter`, `Text_SetFontAttributesPtr`
- `src/message.c`: `MemCopyEntry`, `EntryOffset`, `DecodeEntry`, `DecodeString`, `EntryOffsetAddress`, `MessageBank_Load`, `MessageBank_Free`, `Heap_Free`
- `src/message_util.c`: `MessageUtil_ExpandedString`, `StringTemplate_Format`, `String_Free`, `MessageUtil_MoveName`, `MessageLoader_GetString`, `MessageLoader_Free`, `MessageUtil_SpeciesName`
- `src/field_message.c`: `FieldMessage_LoadTextPalettes`, `Text_ResetAllPrinters`, `Font_LoadTextPalette`, `Font_LoadScreenIndicatorsPalette`, `FieldMessage_AddWindow`, `Window_Add`, `FieldMessage_DrawWindow`, `LoadMessageBoxGraphics`
- `include/text.h`: `Text_SetFontAttributesPtr`, `Text_ResetAllPrinters`, `Text_IsPrinterActive`, `Text_RemovePrinter`, `Text_AddPrinterWithParams`, `Text_AddPrinterWithParamsAndColor`, `Text_AddPrinterWithParamsColorAndSpacing`, `Text_AddPrinter`
- `include/render_text.h`: `RenderText`, `TextPrinter_SetScrollArrowBaseTile`, `TextPrinter_InitScrollArrowAnim`, `TextPrinter_DrawScrollArrow`, `TextPrinter_ClearScrollArrow`, `TextPrinter_WaitAutoMode`, `TextPrinter_WaitWithScrollArrow`, `TextPrinter_Wait`
- `tools/msgenc/msgenc.cpp`: `usage`, `do_main`, `options`, `invalid_argument`, `catch`, `main`
Compact source clues:
- `src/render_text.c:42` enum RenderResult RenderText(TextPrinter *printer)
- `src/render_text.c:44` TextPrinterSubstruct *substruct = (TextPrinterSubstruct *)printer->substruct;
- `src/render_text.c:50` printer->delayCounter = 0;
- `src/render_text.c:52` if (printer->textSpeedBottom != 0) {
- `src/render_text.c:57` if (printer->delayCounter && printer->textSpeedBottom) {
- `src/render_text.c:58` printer->delayCounter--;
- `src/render_text.c:63` printer->delayCounter = 0;
- `src/render_text.c:69` printer->delayCounter = printer->textSpeedBottom;
- `src/text.c:20` static enum RenderResult TextPrinter_Render(TextPrinter *printer);
- `src/text.c:21` static u8 Text_CreatePrinterTask(SysTaskFunc taskFunc, TextPrinter *printer, u32 priority);
- `src/text.c:23` static void Text_ZeroPrinterIconGfx(TextPrinter *printer);
- `src/text.c:24` static void Text_FreePrinterIconGfx(TextPrinter *printer);
Tier-2 fallback searches:
```sh
rg -n "Text_AddPrinter|TextPrinter|RenderText|delayCounter|textSpeed" ../pokeplatinum/src/render_text.c ../pokeplatinum/src/text.c ../pokeplatinum/src/message.c ../pokeplatinum/src/message_util.c ../pokeplatinum/src/field_message.c ../pokeplatinum/include/text.h ../pokeplatinum/include/render_text.h ../pokeplatinum/tools/msgenc/msgenc.cpp
rg -n "MessageLoader|GetString|TEXT_BANK|StringTemplate" ../pokeplatinum/src/render_text.c ../pokeplatinum/src/text.c ../pokeplatinum/src/message.c ../pokeplatinum/src/message_util.c ../pokeplatinum/src/field_message.c ../pokeplatinum/include/text.h ../pokeplatinum/include/render_text.h ../pokeplatinum/tools/msgenc/msgenc.cpp
rg -n "FONT_|Font_|glyph|letterSpacing" ../pokeplatinum/src/render_text.c ../pokeplatinum/src/text.c ../pokeplatinum/src/message.c ../pokeplatinum/src/message_util.c ../pokeplatinum/src/field_message.c ../pokeplatinum/include/text.h ../pokeplatinum/include/render_text.h ../pokeplatinum/tools/msgenc/msgenc.cpp
```
Notes: Use DSPRE text archive notes for data edits; use these files for runtime rendering/speed behavior.
## Pokedex, party, PC, bag, summary
Major UI app systems and storage/party interfaces.
Useful for: Pokedex UI, party menu, summary screen, PC boxes, bag/items UI.
Primary files:
- `include/applications/pokedex/pokedex_app.h` - 37 lines
- `include/applications/party_menu/main.h` - 36 lines
- `include/applications/pc_boxes/box_application.h` - 35 lines
- `include/applications/pokemon_summary_screen/main.h` - 485 lines
- `src/bag.c` - 484 lines
- `src/item.c` - 3407 lines
Key symbols/pivots: `Pokedex_Encounter`, `Party_GetPokemonBySlotIndex`, `Bag_TryAddItem`, `Item_Load`, `BoxPokemon_GetValue`.
Extracted source pivots:
- `include/applications/party_menu/main.h`: `PartyMenu_UpdateFormChangeGraphicsMode`, `sub_0207EF04`, `PartyMenu_LoadMember`, `sub_0207F248`, `PartyMenu_UpdateSlotPalette`, `sub_0207FD68`, `PartyMenu_CheckEligibility`, `PartyMenu_CheckBattleHallEligibility`
- `include/applications/pokemon_summary_screen/main.h`: `PokemonSummaryScreen_ShowContestData`, `PokemonSummaryScreen_FlagVisiblePages`, `PokemonSummaryScreen_PageIsVisble`, `PokemonSummaryScreen_CountVisiblePages`, `PokemonSummaryScreen_MonData`, `PokemonSummaryScreen_RibbonIDAt`, `PokemonSummaryScreen_SetPlayerProfile`, `PokemonSummaryScreen_StatusIconChar`
- `src/bag.c`: `Bag_GetPocketForItem`, `Bag_SaveSize`, `Bag_New`, `Bag_Init`, `MI_CpuClear16`, `Bag_Copy`, `MI_CpuCopy8`, `Bag_GetRegisteredItem`
- `src/item.c`: `ItemPartyParam_Get`, `Item_MoveInPocket`, `Item_FileID`, `Item_FromGBAID`, `Item_IconNCERFile`, `Item_IconNANRFile`, `Item_Load`, `Item_LoadName`
Compact source clues:
- `include/applications/pokedex/pokedex_app.h:1` #ifndef POKEPLATINUM_POKEDEX_APP_H
- `include/applications/pokedex/pokedex_app.h:2` #define POKEPLATINUM_POKEDEX_APP_H
- `include/applications/pokedex/pokedex_app.h:4` #include "applications/pokedex/pokedex_graphics.h"
- `include/applications/pokedex/pokedex_app.h:5` #include "applications/pokedex/pokedex_sort_data.h"
- `include/applications/pokedex/pokedex_app.h:6` #include "applications/pokedex/pokedex_updater.h"
- `include/applications/pokedex/pokedex_app.h:7` #include "applications/pokedex/struct_ov21_021D423C_decl.h"
- `include/applications/pokedex/pokedex_app.h:8` #include "applications/pokedex/struct_ov21_021D4660.h"
- `include/applications/pokedex/pokedex_app.h:9` #include "applications/pokedex/struct_ov21_021E68F4.h"
- `include/applications/party_menu/main.h:16` void PartyMenu_UpdateFormChangeGraphicsMode(PartyMenuApplication *application, BOOL isTeardown);
- `include/applications/party_menu/main.h:17` u8 sub_0207EF04(PartyMenuApplication *application, u8 param1);
- `include/applications/party_menu/main.h:18` u8 PartyMenu_LoadMember(PartyMenuApplication *application, u8 slot);
- `include/applications/party_menu/main.h:19` const u16 *sub_0207F248(PartyMenuApplication *application);
Tier-2 fallback searches:
```sh
rg -n "Pokedex|pokedex|zukan|caught|seen" ../pokeplatinum/include/applications/pokedex/pokedex_app.h ../pokeplatinum/include/applications/party_menu/main.h ../pokeplatinum/include/applications/pc_boxes/box_application.h ../pokeplatinum/include/applications/pokemon_summary_screen/main.h ../pokeplatinum/src/bag.c ../pokeplatinum/src/item.c
rg -n "PartyMenu|Summary|pokemon_summary|MON_DATA_" ../pokeplatinum/include/applications/pokedex/pokedex_app.h ../pokeplatinum/include/applications/party_menu/main.h ../pokeplatinum/include/applications/pc_boxes/box_application.h ../pokeplatinum/include/applications/pokemon_summary_screen/main.h ../pokeplatinum/src/bag.c ../pokeplatinum/src/item.c
rg -n "pc_boxes|BoxPokemon|PokemonStorage|box app|PC" ../pokeplatinum/include/applications/pokedex/pokedex_app.h ../pokeplatinum/include/applications/party_menu/main.h ../pokeplatinum/include/applications/pc_boxes/box_application.h ../pokeplatinum/include/applications/pokemon_summary_screen/main.h ../pokeplatinum/src/bag.c ../pokeplatinum/src/item.c
rg -n "Bag|Item|ITEM_|UseItem|HeldItem|Pocket" ../pokeplatinum/include/applications/pokedex/pokedex_app.h ../pokeplatinum/include/applications/party_menu/main.h ../pokeplatinum/include/applications/pc_boxes/box_application.h ../pokeplatinum/include/applications/pokemon_summary_screen/main.h ../pokeplatinum/src/bag.c ../pokeplatinum/src/item.c
```
Notes: Expansion requests usually become project plans because UI and save/data assumptions are broad.
## Save data, records, system
Save blocks, game records, system vars, boot/main loop, options.
Useful for: save compatibility, new flags/vars, records, global options, startup.
Primary files:
- `include/savedata.h` - 114 lines
- `include/constants/savedata/vars_flags.h` - 9 lines
- `src/game_records.c` - 418 lines
- `src/game_options.c` - 183 lines
- `src/main.c` - 363 lines
- `src/boot.c` - 60 lines
Key symbols/pivots: `SaveData_SaveSize`, `SaveData_Init`, `VarsFlags_SetFlag`, `VarsFlags_GetVar`, `GameRecords_IncrementRecordValue`.
Extracted source pivots:
- `include/savedata.h`: `SaveData_Init`, `SaveData_Ptr`, `SaveData_SaveTable`, `SaveData_SaveTableConst`, `SaveData_Erase`, `SaveData_Load`, `SaveData_Save`, `SaveData_SaveBlock`
- `src/game_records.c`: `EncodeGameRecords`, `DecodeGameRecords`, `GetRecordValue`, `SetRecordValue`, `GetRecordLimit`, `GetTrainerScoreIncrement`, `GameRecords_SaveSize`, `GameRecords_Init`
- `src/game_options.c`: `Options_New`, `Options_Init`, `Options_Copy`, `MI_CpuCopy8`, `MI_CpuFill8`, `Options_SetSystemButtonMode`, `Options_TextSpeed`, `Options_SetTextSpeed`
- `src/main.c`: `FS_EXTERN_OVERLAY`, `InitApplication`, `RunApplication`, `WaitFrame`, `TrySystemReset`, `SoftReset`, `HeapCanaryFailed`, `CheckHeapCanary`
- `src/boot.c`: `CheckForMemoryTampering`, `OS_Terminate`, `CARD_Init`, `MI_CpuCopy8`, `RebootAndLoadROM`, `FS_InitFile`, `OS_ResetSystem`
Compact source clues:
- `include/savedata.h:1` #ifndef POKEPLATINUM_SAVEDATA_H
- `include/savedata.h:2` #define POKEPLATINUM_SAVEDATA_H
- `include/savedata.h:5` #include "constants/savedata/save_table.h"
- `include/savedata.h:6` #include "constants/savedata/savedata.h"
- `include/savedata.h:33` typedef struct SaveDataBody {
- `include/savedata.h:35` } SaveDataBody;
- `include/savedata.h:37` typedef struct SaveDataState {
- `include/savedata.h:43` int mainSequence;
- `src/game_records.c:1` #include "game_records.h"
- `src/game_records.c:5` #include "generated/game_records.h"
- `src/game_records.c:12` #define SIZE_ENCODED_RECORDS  (sizeof(GameRecords) - sizeof(EncodingSeed) - (START_ENCODED_RECORDS * sizeof(u32)))
- `src/game_records.c:14` static void EncodeGameRecords(GameRecords *records, int id);
Tier-2 fallback searches:
```sh
rg -n "SaveData|VarsFlags|SystemVars|GAME_RECORD|GameRecords" ../pokeplatinum/include/savedata.h ../pokeplatinum/include/constants/savedata/vars_flags.h ../pokeplatinum/src/game_records.c ../pokeplatinum/src/game_options.c ../pokeplatinum/src/main.c ../pokeplatinum/src/boot.c
rg -n "Options|GameOptions|boot|main" ../pokeplatinum/include/savedata.h ../pokeplatinum/include/constants/savedata/vars_flags.h ../pokeplatinum/src/game_records.c ../pokeplatinum/src/game_options.c ../pokeplatinum/src/main.c ../pokeplatinum/src/boot.c
```
Notes: Any request that expands save structures should be treated as high-risk expansion work.
## Apps, minigames, network, extras
Main menu, Mystery Gift, Underground, contests, WFC/network, Poketch-like apps and overlays.
Useful for: Mystery Gift, Underground, Contest, WFC, menus, special apps.
Primary files:
- `src/main_menu/main_menu.c` - 1355 lines
- `src/main_menu/mystery_gift_app.c` - 2617 lines
- `src/underground.c` - 1372 lines
- `src/contest.c` - 1646 lines
- `src/nintendo_wfc/main.c` - 1526 lines
- `src/http/http.c` - 313 lines
Key symbols/pivots: `MainMenu_New`, `MysteryGift`, `Underground`, `Contest`, `HTTP`.
Extracted source pivots:
- `src/main_menu/main_menu.c`: `FS_EXTERN_OVERLAY`, `RenderContinueOption`, `RenderMysteryGiftOption`, `RenderRangerLinkOption`, `RenderGBAMigrationOption`, `RenderWiiConnectionOption`, `RenderWFCSettingsOption`, `RenderWiiMsgSettingsOption`
- `src/main_menu/mystery_gift_app.c`: `FS_EXTERN_OVERLAY`, `ShowMysteryGiftReceptionMethodsMenu`, `ExitToWonderCardsApp`, `ExitToTitleScreen`, `AskConfirmWireless_FriendOrGBA`, `AskConfirmWireless_WirelessDistribution`, `AskConfirmConnectToWFC`, `ReturnToMysteryGiftMenu`
- `src/underground.c`: `Underground_UpdatePlacedGoodSlots`, `Underground_SaveSize`, `SecretBase_Size`, `UndergroundRecord_Size`, `UndergroundRecord_Init`, `MI_CpuFill8`, `Underground_Init`, `GetCurrentDateTime`
- `src/contest.c`: `FS_EXTERN_OVERLAY`, `Contest_New`, `Contest_InternalFree`, `Contest_SetLCRNGSeed`, `Contest_GetRNGNext`, `Contest_SetUpLinkContest`, `Contest_IsCommTaskDoneInternal`, `sub_02093C6C`
- `src/nintendo_wfc/main.c`: `NintendoWFC_Cleanup`, `LoginCompleteCallback`, `UpdateServersCallback`, `DummyFriendStatusCallback`, `DeleteDuplicateFriendCallback`, `DummyWFCBuddyFriendCB`, `MatchmakingLobbyMatchedCallback`, `SendCallback`
- `src/http/http.c`: `HTTP_SetErrorCode`, `HTTP_RequestCompletedCallback`, `strcpy`, `strncat`, `MATH_CalcSHA1`, `memcpy`, `HTTP_Init`, `HTTP_PrepareRequest`
Compact source clues:
- `src/main_menu/main_menu.c:11` #include "main_menu/application_template.h"
- `src/main_menu/main_menu.c:12` #include "main_menu/distribution_cartridge.h"
- `src/main_menu/main_menu.c:13` #include "main_menu/main_menu_util.h"
- `src/main_menu/main_menu.c:14` #include "main_menu/ov97_02235D18.h"
- `src/main_menu/main_menu.c:27` #include "mystery_gift.h"
- `src/main_menu/main_menu.c:28` #include "overlay_manager.h"
- `src/main_menu/main_menu.c:50` #include "res/graphics/main_menu/main_menu_graphics.naix"
- `src/main_menu/main_menu.c:51` #include "res/text/bank/main_menu_alerts.h"
- `src/main_menu/mystery_gift_app.c:1` #include "main_menu/mystery_gift_app.h"
- `src/main_menu/mystery_gift_app.c:13` #include "main_menu/distribution_cartridge.h"
- `src/main_menu/mystery_gift_app.c:14` #include "main_menu/main_menu_util.h"
- `src/main_menu/mystery_gift_app.c:15` #include "main_menu/ov97_0222D04C.h"
Tier-2 fallback searches:
```sh
rg -n "Mystery|WFC|WiFi|Underground|Contest|application|overlay" ../pokeplatinum/src/main_menu/main_menu.c ../pokeplatinum/src/main_menu/mystery_gift_app.c ../pokeplatinum/src/underground.c ../pokeplatinum/src/contest.c ../pokeplatinum/src/nintendo_wfc/main.c ../pokeplatinum/src/http/http.c
rg -n "main_menu|gift|network|http" ../pokeplatinum/src/main_menu/main_menu.c ../pokeplatinum/src/main_menu/mystery_gift_app.c ../pokeplatinum/src/underground.c ../pokeplatinum/src/contest.c ../pokeplatinum/src/nintendo_wfc/main.c ../pokeplatinum/src/http/http.c
```
Notes: Usually not first-line for battle/code-injection requests, but keep indexed because user requests are unpredictable.

## Back To Router

- `docs/agent-start-here.md`
- `docs/request-router.md`
- `docs/pokeplatinum-compact-index.md`
