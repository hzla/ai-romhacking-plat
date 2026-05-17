# NARC Format Index

Compact, agent-optimized reference for high-impact Pokemon Platinum data formats. End users do not need the full DSPRE repo for these facts.

Offsets are relative to the NARC member or fixed record unless the format says otherwise.

## Fast Answers

- Remove all EV yields: edit `poketool/personal/pl_personal.narc`, every member, write `00 00` at offset `0x0A`.
- Change move power: edit move data member offset `0x03`.
- Change move accuracy: edit move data member offset `0x05`.
- Change move PP: edit move data member offset `0x06`.
- Change wild held items: edit personal data offsets `0x0C` and `0x0E`.
- Change ability slots: edit personal data offsets `0x16` and `0x17`.

## Pokemon personal data
- id: `pokemon_personal`
- ROM path: `poketool/personal/pl_personal.narc`
- member model: one NARC member per species/form
- record length: 44 bytes
- source: `../../Docs/DSPRE_Romfiles/PokemonPersonalData.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| baseHP | 0x00 | u8 |  |
| baseAtk | 0x01 | u8 |  |
| baseDef | 0x02 | u8 |  |
| baseSpeed | 0x03 | u8 |  |
| baseSpAtk | 0x04 | u8 |  |
| baseSpDef | 0x05 | u8 |  |
| type1 | 0x06 | u8 | enum: PokemonType |
| type2 | 0x07 | u8 | enum: PokemonType |
| catchRate | 0x08 | u8 |  |
| givenExp | 0x09 | u8 |  |
| evYields | 0x0A | u16le | 2-bit packed EV yields. bits: evHP 0-1; evAtk 2-3; evDef 4-5; evSpeed 6-7; evSpAtk 8-9; evSpDef 10-11 zero: 00 00 |
| item1 | 0x0C | u16le | First possible wild held item. |
| item2 | 0x0E | u16le | Second possible wild held item. |
| genderVec | 0x10 | u8 |  |
| eggSteps | 0x11 | u8 |  |
| baseFriendship | 0x12 | u8 |  |
| growthCurve | 0x13 | u8 | enum: PokemonGrowthCurve |
| eggGroup1 | 0x14 | u8 |  |
| eggGroup2 | 0x15 | u8 |  |
| firstAbility | 0x16 | u8 |  |
| secondAbility | 0x17 | u8 |  |
| escapeRate | 0x18 | u8 |  |
| colorAndFlip | 0x19 | u8 | bits: color 0-6; flip 7 |
| alignment | 0x1A | padding[2] |  |
| tmHmBitfield0 | 0x1C | u32le |  |
| tmHmBitfield1 | 0x20 | u32le |  |
| tmHmBitfield2 | 0x24 | u32le |  |
| tmHmBitfield3 | 0x28 | u32le |  |

Common edits:

- remove all EV yields from Pokemon: write 00 00 at member offset 0x0A for every member
- change wild held items: edit item1 at 0x0C and item2 at 0x0E
- change abilities: edit firstAbility at 0x16 and secondAbility at 0x17

Safe edit notes:

- Preserve member count and 44-byte member length for simple field edits.

## Move data
- id: `move_data`
- ROM path: `poketool/waza/pl_waza_tbl.narc`
- alternate paths: `waza/pl_waza_tbl.narc`, `poketool/waza/waza_tbl.narc`
- member model: one NARC member per move
- record length: 16 bytes
- source: `../../Docs/DSPRE_Romfiles/MoveData.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| battleEffect | 0x00 | u16le |  |
| split | 0x02 | u8 | enum: MoveSplit |
| power | 0x03 | u8 |  |
| type | 0x04 | u8 | enum: PokemonType |
| accuracy | 0x05 | u8 | 0 means display/use as no accuracy value for many moves. |
| pp | 0x06 | u8 |  |
| sideEffectProbability | 0x07 | u8 |  |
| target | 0x08 | u16le | enum: AttackRange bitfield |
| priority | 0x0A | s8 |  |
| flags | 0x0B | u8 | enum: MoveFlags |
| contestAppeal | 0x0C | u8 |  |
| contestConditionType | 0x0D | u8 |  |
| filler | 0x0E | u16le |  |

Common edits:

- change move power: edit member offset 0x03
- change move accuracy: edit member offset 0x05
- change move PP: edit member offset 0x06

## Item data
- id: `item_data`
- ROM path: `itemtool/itemdata/pl_item_data.narc`
- alternate paths: `itemtool/itemdata/item_data.narc`
- member model: one NARC member per item
- record length: 36 bytes
- source: `../../Docs/DSPRE_Romfiles/ItemData.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| price | 0x00 | u16le |  |
| holdEffect | 0x02 | u8 | enum: HoldEffect |
| holdEffectParam | 0x03 | u8 |  |
| pluckEffect | 0x04 | u8 |  |
| flingEffect | 0x05 | u8 |  |
| flingPower | 0x06 | u8 |  |
| naturalGiftPower | 0x07 | u8 |  |
| pocketBitfield | 0x08 | u16le | bits: naturalGiftType 0-4; preventToss 5; selectable 6; fieldPocket 7-10; battlePocket 11-15 |
| fieldUseFunc | 0x0A | u8 |  |
| battleUseFunc | 0x0B | u8 |  |
| partyUse | 0x0C | u8 |  |
| padding0D | 0x0D | u8 |  |
| partyUseParam | 0x0E | struct[19] | Healing, revive, stat stage, EV vitamin, friendship, HP/PP restore flags and values. |
| padding22 | 0x22 | padding[2] |  |

Common edits:

- change item price: edit u16le at 0x00
- change held item battle effect: edit holdEffect at 0x02 and holdEffectParam at 0x03
- change item pocket: edit fieldPocket bits 7-10 in u16le at 0x08

## Evolution data
- id: `evolution_data`
- ROM path: `poketool/personal/evo.narc`
- member model: one NARC member per species/form
- record length: 44 bytes
- source: `../../Docs/DSPRE_Romfiles/EvolutionFile.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| evolutionSlot | slotIndex * 6 | struct[6] |  |
| method | slot + 0x00 | s16le | enum: EvolutionMethod |
| param | slot + 0x02 | s16le |  |
| targetSpecies | slot + 0x04 | s16le |  |
| padding | 0x2A | padding[2] |  |

Common edits:

- change evolution level: for level-up methods, edit param at slot + 0x02
- change evolution target: edit targetSpecies at slot + 0x04

## Level-up learnset data
- id: `learnset_data`
- ROM path: `poketool/personal/wotbl.narc`
- member model: one variable-length NARC member per species/form
- record length: variable/unknown
- source: `../../Docs/DSPRE_Romfiles/LearnsetData.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| entry | i * 2 | u16le | bits: move 0-8; level 9-15 |
| terminator | FF FF | u16le |  |
| postTerminatorPadding | 00 00 | u16le | DSPRE writes one extra 0x0000 after terminator. |

Common edits:

- add a level-up move: insert sorted u16 entry: moveId | (level << 9), before FF FF terminator

Safe edit notes:

- Variable length edits require rebuilding the NARC member table.

## DPPt wild encounter data
- id: `encounter_data_dppt`
- ROM path: `fielddata/encountdata/pl_enc_data.narc`
- alternate paths: `fielddata/encountdata/enc_data.narc`
- member model: one NARC member per encounter table referenced by map headers
- record length: variable/unknown
- source: `../../Docs/DSPRE_Romfiles/EncounterFile.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| walkingRate | 0x00 | u32le low byte |  |
| walkingSlots | 0x04 | 12 * {level:u32le low byte, species:u32le} |  |
| swarmPokemon | 0x64 | 2 * u32le low u16 |  |
| dayPokemon | 0x6C | 2 * u32le |  |
| nightPokemon | 0x74 | 2 * u32le |  |
| radarPokemon | 0x7C | 4 * u32le |  |
| regionalForms | 0x8C | 5 * u32le |  |
| dualSlotRuby | 0xA4 | 2 * u32le |  |
| surfRate | 0xCC | u32le low byte |  |
| oldRodRate | 0x124 | u32le low byte |  |

Common edits:

- change wild Pokemon: edit species fields in the relevant encounter table member; use MapHeaders wildPokemon to find member id

## Trainer properties and party data
- id: `trainer_data`
- ROM path: `trainer/trdata.narc and trainer/trpok.narc`
- member model: trainer properties and trainer party are separate members keyed by trainer id
- record length: variable/unknown
- source: `../../Docs/DSPRE_Romfiles/TrainerFile.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| trdata.flags | 0x00 | u8 | bits: chooseMoves 0; chooseItems 1 |
| trdata.trainerClass | 0x01 | u8 |  |
| trdata.unknown | 0x02 | u8 |  |
| trdata.partyCount | 0x03 | u8 |  |
| trdata.items | 0x04 | 4 * u16le |  |
| trdata.aiFlags | 0x0C | u32le |  |
| trdata.doubleBattle | 0x10 | u32le | 2 means double battle, 0 means single. |
| trpok.partyEntry | variable | {difficulty:u8, genderAbility:u8, level:u16le, speciesForm:u16le, heldItem?:u16le, moves?:4*u16le, ballSeals:u16le} |  |

Common edits:

- change trainer party: edit trpok member for trainer id; entry size depends on chooseItems/chooseMoves flags in trdata
- change trainer AI: edit trdata u32le at 0x0C

## In-game trade data
- id: `trade_data`
- ROM path: `fielddata/pokemon_trade/fld_trade.narc`
- member model: one NARC member per in-game trade
- record length: 80 bytes
- source: `../../Docs/DSPRE_Romfiles/TradeData.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| species | 0x00 | s32le |  |
| hpIV | 0x04 | s32le |  |
| atkIV | 0x08 | s32le |  |
| defIV | 0x0C | s32le |  |
| speedIV | 0x10 | s32le |  |
| spAtkIV | 0x14 | s32le |  |
| spDefIV | 0x18 | s32le |  |
| ability | 0x1C | s32le | DSPRE marks as unused. |
| otID | 0x20 | s32le |  |
| pid | 0x38 | s32le |  |
| heldItem | 0x3C | s32le |  |
| requestedSpecies | 0x4C | s32le |  |

## Platinum map header
- id: `map_header_pt`
- ROM path: `ARM9 map header table unless dynamic headers patch is applied`
- member model: fixed 24-byte table entry per map header
- record length: 24 bytes
- source: `../../Docs/DSPRE_Romfiles/MapHeader.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| areaDataID | 0x00 | u8 |  |
| unknown1 | 0x01 | u8 |  |
| matrixID | 0x02 | u16le |  |
| scriptFileID | 0x04 | u16le |  |
| levelScriptID | 0x06 | u16le |  |
| textArchiveID | 0x08 | u16le |  |
| musicDayID | 0x0A | u16le |  |
| musicNightID | 0x0C | u16le |  |
| wildPokemon | 0x0E | u16le | Encounter table member id; 0xFFFF means none in DPPt. |
| eventFileID | 0x10 | u16le |  |
| locationName | 0x12 | u8 |  |
| areaIcon | 0x13 | u8 |  |
| weatherID | 0x14 | u8 |  |
| cameraAngleID | 0x15 | u8 |  |
| mapSettings | 0x16 | u16le | bits: locationSpecifier 0-6; battleBackground 7-11; flags 12-15 |

## Message/text archives
- id: `text_archive`
- ROM path: `msgdata/pl_msg.narc`
- member model: one text archive member per text bank; DSPRE expands to JSON for editing
- record length: variable/unknown
- source: `../../Docs/DSPRE_Romfiles/TextArchive.cs`
| Field | Offset | Type | Notes |
| --- | ---: | --- | --- |
| archiveId |  | member index |  |
| messages |  | encrypted Gen IV text payload; use DSPRE/TextConverter or msgenc rather than raw byte edits |  |

Safe edit notes:

- Prefer text tooling over manual byte edits.

## Regeneration

Maintainers can regenerate this file with:

```sh
node scripts/extract-dspre-index.js
```
