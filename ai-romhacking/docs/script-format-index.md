# Script Format Index

Compact, agent-optimized reference for Platinum script, event, level-script, movement, and map-header lookup.

## Source Summary

- script database available: yes
- script commands indexed: 840
- movement commands indexed: 107
- level-script commands indexed: 8
- sounds indexed: 1013

## What To Check First

- Need to find which script/event file a map uses: check `map_header_pt` in `registries/narc-formats.platinum.json`.
- Need command names or movement names: check `registries/script-formats.platinum.json` quick examples first, then `platinum_scrcmd_database.json` only if regenerating.
- Need to edit field scripts: use script-aware tooling; raw command edits require command widths and jump target care.

## Map Header Links

- `scriptFileID` at Platinum map header offset `0x04`.
- `levelScriptID` at offset `0x06`.
- `textArchiveID` at offset `0x08`.
- `wildPokemon` encounter table id at offset `0x0E`.
- `eventFileID` at offset `0x10`.

## Useful Agent Searches

```sh
rg -n "ScrCmd_StartWildBattle|Encounter_New|ScriptContext_GetVar" ../pokeplatinum/src/scrcmd.c ../pokeplatinum/src/scrcmd_*.c
rg -n "FLAG_|VAR_|SetFlag|CheckFlag|ClearFlag" ../pokeplatinum/src ../pokeplatinum/include
rg -n "scriptFileID|levelScriptID|textArchiveID|wildPokemon|eventFileID" docs/script-format-index.md registries/script-formats.platinum.json
```

## Movement Examples

The generated JSON keeps a small sample of movements such as facing and common walk speeds. Use the registry for compact lookup and regenerate from the script database when a full command list is needed.

## Regeneration

Maintainers can regenerate this file with:

```sh
node scripts/extract-dspre-index.js
```
