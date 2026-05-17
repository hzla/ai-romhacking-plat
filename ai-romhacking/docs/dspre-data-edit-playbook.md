# DSPRE Data Edit Playbook

Use this before searching DSPRE source. It maps common non-code-injection requests to compact indexed data formats.

| Request | First place to look | Fast edit path | Caveat |
| --- | --- | --- | --- |
| Remove all EV yields | `pokemon_personal` | Write `00 00` at offset `0x0A` in every `pl_personal.narc` member | Preserves species stats; only EV reward data changes. |
| Change Pokemon base stats | `pokemon_personal` | Edit offsets `0x00-0x05` | Order is HP, Atk, Def, Speed, SpAtk, SpDef. |
| Change Pokemon type | `pokemon_personal` | Edit `type1` at `0x06`, `type2` at `0x07` | Type IDs follow Gen IV/DSPRE enum. |
| Change wild held items | `pokemon_personal` | Edit `item1` at `0x0C`, `item2` at `0x0E` | Item IDs are `u16le`. |
| Change abilities | `pokemon_personal` | Edit `firstAbility` at `0x16`, `secondAbility` at `0x17` | Ability behavior still lives in battle code. |
| Change move power | `move_data` | Edit offset `0x03` | 0 usually displays as no power/status. |
| Change move accuracy | `move_data` | Edit offset `0x05` | 0 often means no accuracy check/display. |
| Change move PP | `move_data` | Edit offset `0x06` | PP Ups are separate runtime behavior. |
| Change move target | `move_data` | Edit `u16le` at `0x08` | Use AttackRange bitfield. |
| Change evolution | `evolution_data` | Edit one 6-byte evolution slot | Up to 7 slots per species/form. |
| Change learnset | `learnset_data` | Edit variable `move | (level << 9)` entries before `FF FF` | Rebuild NARC when member length changes. |
| Change wild encounters | `encounter_data_dppt` | Use map header `wildPokemon` id, then edit encounter member | Encounter files are structured tables, not one flat species list. |
| Change trainer party | `trainer_data` | Edit `trpok` member, guided by `trdata` flags | Entry size depends on chooseItems/chooseMoves. |
| Change map scripts/events | `map_header_pt` + script/event formats | Use script/event-aware tooling | Avoid blind jump/offset edits. |

## Example: Remove All EV Yields

Goal: Pokemon give no EVs after battle.

- Format: `pokemon_personal`
- NARC: `poketool/personal/pl_personal.narc`
- Member model: one member per species/form
- Field: `evYields`
- Offset: `0x0A`
- Type: `u16le`
- Write: `00 00` in every member

Why: DSPRE stores six 2-bit EV yield fields inside this `u16le`. Zeroing both bytes clears HP, Atk, Def, Speed, SpAtk, and SpDef EV yields.

## Example: Change Move Power, Accuracy, PP

- Format: `move_data`
- Power: offset `0x03`
- Accuracy: offset `0x05`
- PP: offset `0x06`

## Example: Adjust Held Wild Items Or Ability Slots

- Format: `pokemon_personal`
- Held items: `item1` at `0x0C`, `item2` at `0x0E`
- Abilities: `firstAbility` at `0x16`, `secondAbility` at `0x17`

## Agent Rule

Check `registries/narc-formats.platinum.json` before opening DSPRE source. Open DSPRE classes only when the compact index is missing a field or a format is too complex for the summary.
