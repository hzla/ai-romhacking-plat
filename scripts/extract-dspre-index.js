#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const {
  TOOLKIT_ROOT,
  WORKSPACE_ROOT,
  writeJson,
} = require("../lib/workspace");

const DEFAULT_SOURCE_ROOT = path.resolve(WORKSPACE_ROOT, "..", "Docs");
const LOCAL_SOURCE_ROOT = path.join(WORKSPACE_ROOT, "Docs");
const sourceRoot = fs.existsSync(LOCAL_SOURCE_ROOT) ? LOCAL_SOURCE_ROOT : DEFAULT_SOURCE_ROOT;
const romfilesRoot = path.join(sourceRoot, "DSPRE_Romfiles");
const exportsRoot = path.join(sourceRoot, "dspre_exports");
const scrcmdDbPath = path.join(sourceRoot, "platinum_scrcmd_database.json");

function sourceFile(name) {
  return path.join(romfilesRoot, name);
}

function relSource(filePath) {
  return path.relative(TOOLKIT_ROOT, filePath).replace(/\\/g, "/");
}

function sha1IfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return crypto.createHash("sha1").update(fs.readFileSync(filePath)).digest("hex");
}

function readScrcmdSummary() {
  if (!fs.existsSync(scrcmdDbPath)) {
    return {
      source: relSource(scrcmdDbPath),
      available: false,
      counts: {},
      examples: {},
    };
  }
  const db = JSON.parse(fs.readFileSync(scrcmdDbPath, "utf8"));
  const take = (obj, keys) => Object.fromEntries(keys.filter((key) => obj && obj[key]).map((key) => [key, obj[key]]));
  return {
    source: relSource(scrcmdDbPath),
    available: true,
    sha1: sha1IfExists(scrcmdDbPath),
    counts: {
      movements: Object.keys(db.movements || {}).length,
      scrcmd: Object.keys(db.scrcmd || {}).length,
      levelScriptCommands: Object.keys(db.lvlscrcmd || {}).length,
      sounds: Object.keys(db.sounds || {}).length,
    },
    examples: {
      movements: take(db.movements, ["0x0000", "0x000C", "0x0010", "0x0014"]),
      comparisonOperators: take(db.comparisonOperators, ["0x0000", "0x0001", "0x0004", "0x0005"]),
      overworldDirections: take(db.overworldDirections, ["0x0000", "0x0001", "0x0002", "0x0003"]),
      levelScriptCommands: db.lvlscrcmd || {},
    },
  };
}

const narcFormats = {
  schemaVersion: 1,
  game: "pokemon-platinum",
  generatedAt: new Date().toISOString(),
  generatedBy: "scripts/extract-dspre-index.js",
  sourceRoot: relSource(sourceRoot),
  notes: [
    "Compact token-optimized index generated from DSPRE format classes and existing exports.",
    "Offsets are member-relative unless otherwise stated.",
    "This is an index for agents and maintainers, not a replacement for full format source when implementing complex editors."
  ],
  formats: [
    {
      id: "pokemon_personal",
      name: "Pokemon personal data",
      romPath: "poketool/personal/pl_personal.narc",
      source: relSource(sourceFile("PokemonPersonalData.cs")),
      sourceSha1: sha1IfExists(sourceFile("PokemonPersonalData.cs")),
      memberModel: "one NARC member per species/form",
      recordLength: 44,
      fields: [
        { name: "baseHP", offset: 0x00, type: "u8" },
        { name: "baseAtk", offset: 0x01, type: "u8" },
        { name: "baseDef", offset: 0x02, type: "u8" },
        { name: "baseSpeed", offset: 0x03, type: "u8" },
        { name: "baseSpAtk", offset: 0x04, type: "u8" },
        { name: "baseSpDef", offset: 0x05, type: "u8" },
        { name: "type1", offset: 0x06, type: "u8", enum: "PokemonType" },
        { name: "type2", offset: 0x07, type: "u8", enum: "PokemonType" },
        { name: "catchRate", offset: 0x08, type: "u8" },
        { name: "givenExp", offset: 0x09, type: "u8" },
        {
          name: "evYields",
          offset: 0x0A,
          type: "u16le",
          description: "2-bit packed EV yields.",
          bitfields: [
            { name: "evHP", bits: "0-1" },
            { name: "evAtk", bits: "2-3" },
            { name: "evDef", bits: "4-5" },
            { name: "evSpeed", bits: "6-7" },
            { name: "evSpAtk", bits: "8-9" },
            { name: "evSpDef", bits: "10-11" }
          ],
          commonZeroValueHex: "00 00"
        },
        { name: "item1", offset: 0x0C, type: "u16le", description: "First possible wild held item." },
        { name: "item2", offset: 0x0E, type: "u16le", description: "Second possible wild held item." },
        { name: "genderVec", offset: 0x10, type: "u8" },
        { name: "eggSteps", offset: 0x11, type: "u8" },
        { name: "baseFriendship", offset: 0x12, type: "u8" },
        { name: "growthCurve", offset: 0x13, type: "u8", enum: "PokemonGrowthCurve" },
        { name: "eggGroup1", offset: 0x14, type: "u8" },
        { name: "eggGroup2", offset: 0x15, type: "u8" },
        { name: "firstAbility", offset: 0x16, type: "u8" },
        { name: "secondAbility", offset: 0x17, type: "u8" },
        { name: "escapeRate", offset: 0x18, type: "u8" },
        { name: "colorAndFlip", offset: 0x19, type: "u8", bitfields: [{ name: "color", bits: "0-6" }, { name: "flip", bits: "7" }] },
        { name: "alignment", offset: 0x1A, type: "padding[2]" },
        { name: "tmHmBitfield0", offset: 0x1C, type: "u32le" },
        { name: "tmHmBitfield1", offset: 0x20, type: "u32le" },
        { name: "tmHmBitfield2", offset: 0x24, type: "u32le" },
        { name: "tmHmBitfield3", offset: 0x28, type: "u32le" }
      ],
      commonEdits: [
        { request: "remove all EV yields from Pokemon", operation: "write 00 00 at member offset 0x0A for every member" },
        { request: "change wild held items", operation: "edit item1 at 0x0C and item2 at 0x0E" },
        { request: "change abilities", operation: "edit firstAbility at 0x16 and secondAbility at 0x17" }
      ],
      safeEditNotes: ["Preserve member count and 44-byte member length for simple field edits."]
    },
    {
      id: "move_data",
      name: "Move data",
      romPath: "poketool/waza/pl_waza_tbl.narc",
      alternatePaths: ["waza/pl_waza_tbl.narc", "poketool/waza/waza_tbl.narc"],
      source: relSource(sourceFile("MoveData.cs")),
      sourceSha1: sha1IfExists(sourceFile("MoveData.cs")),
      memberModel: "one NARC member per move",
      recordLength: 16,
      fields: [
        { name: "battleEffect", offset: 0x00, type: "u16le" },
        { name: "split", offset: 0x02, type: "u8", enum: "MoveSplit" },
        { name: "power", offset: 0x03, type: "u8" },
        { name: "type", offset: 0x04, type: "u8", enum: "PokemonType" },
        { name: "accuracy", offset: 0x05, type: "u8", note: "0 means display/use as no accuracy value for many moves." },
        { name: "pp", offset: 0x06, type: "u8" },
        { name: "sideEffectProbability", offset: 0x07, type: "u8" },
        { name: "target", offset: 0x08, type: "u16le", enum: "AttackRange bitfield" },
        { name: "priority", offset: 0x0A, type: "s8" },
        { name: "flags", offset: 0x0B, type: "u8", enum: "MoveFlags" },
        { name: "contestAppeal", offset: 0x0C, type: "u8" },
        { name: "contestConditionType", offset: 0x0D, type: "u8" },
        { name: "filler", offset: 0x0E, type: "u16le", expectedHex: "00 00" }
      ],
      commonEdits: [
        { request: "change move power", operation: "edit member offset 0x03" },
        { request: "change move accuracy", operation: "edit member offset 0x05" },
        { request: "change move PP", operation: "edit member offset 0x06" }
      ]
    },
    {
      id: "item_data",
      name: "Item data",
      romPath: "itemtool/itemdata/pl_item_data.narc",
      alternatePaths: ["itemtool/itemdata/item_data.narc"],
      source: relSource(sourceFile("ItemData.cs")),
      sourceSha1: sha1IfExists(sourceFile("ItemData.cs")),
      memberModel: "one NARC member per item",
      recordLength: 36,
      fields: [
        { name: "price", offset: 0x00, type: "u16le" },
        { name: "holdEffect", offset: 0x02, type: "u8", enum: "HoldEffect" },
        { name: "holdEffectParam", offset: 0x03, type: "u8" },
        { name: "pluckEffect", offset: 0x04, type: "u8" },
        { name: "flingEffect", offset: 0x05, type: "u8" },
        { name: "flingPower", offset: 0x06, type: "u8" },
        { name: "naturalGiftPower", offset: 0x07, type: "u8" },
        {
          name: "pocketBitfield",
          offset: 0x08,
          type: "u16le",
          bitfields: [
            { name: "naturalGiftType", bits: "0-4" },
            { name: "preventToss", bits: "5" },
            { name: "selectable", bits: "6" },
            { name: "fieldPocket", bits: "7-10" },
            { name: "battlePocket", bits: "11-15" }
          ]
        },
        { name: "fieldUseFunc", offset: 0x0A, type: "u8" },
        { name: "battleUseFunc", offset: 0x0B, type: "u8" },
        { name: "partyUse", offset: 0x0C, type: "u8" },
        { name: "padding0D", offset: 0x0D, type: "u8" },
        { name: "partyUseParam", offset: 0x0E, type: "struct[19]", note: "Healing, revive, stat stage, EV vitamin, friendship, HP/PP restore flags and values." },
        { name: "padding22", offset: 0x22, type: "padding[2]" }
      ],
      commonEdits: [
        { request: "change item price", operation: "edit u16le at 0x00" },
        { request: "change held item battle effect", operation: "edit holdEffect at 0x02 and holdEffectParam at 0x03" },
        { request: "change item pocket", operation: "edit fieldPocket bits 7-10 in u16le at 0x08" }
      ]
    },
    {
      id: "evolution_data",
      name: "Evolution data",
      romPath: "poketool/personal/evo.narc",
      source: relSource(sourceFile("EvolutionFile.cs")),
      sourceSha1: sha1IfExists(sourceFile("EvolutionFile.cs")),
      memberModel: "one NARC member per species/form",
      recordLength: 44,
      fields: [
        { name: "evolutionSlot", offset: "slotIndex * 6", type: "struct[6]", repeat: 7 },
        { name: "method", offset: "slot + 0x00", type: "s16le", enum: "EvolutionMethod" },
        { name: "param", offset: "slot + 0x02", type: "s16le" },
        { name: "targetSpecies", offset: "slot + 0x04", type: "s16le" },
        { name: "padding", offset: 0x2A, type: "padding[2]" }
      ],
      commonEdits: [
        { request: "change evolution level", operation: "for level-up methods, edit param at slot + 0x02" },
        { request: "change evolution target", operation: "edit targetSpecies at slot + 0x04" }
      ]
    },
    {
      id: "learnset_data",
      name: "Level-up learnset data",
      romPath: "poketool/personal/wotbl.narc",
      source: relSource(sourceFile("LearnsetData.cs")),
      sourceSha1: sha1IfExists(sourceFile("LearnsetData.cs")),
      memberModel: "one variable-length NARC member per species/form",
      recordLength: null,
      fields: [
        { name: "entry", offset: "i * 2", type: "u16le", bitfields: [{ name: "move", bits: "0-8" }, { name: "level", bits: "9-15" }] },
        { name: "terminator", valueHex: "FF FF", type: "u16le" },
        { name: "postTerminatorPadding", valueHex: "00 00", type: "u16le", note: "DSPRE writes one extra 0x0000 after terminator." }
      ],
      commonEdits: [
        { request: "add a level-up move", operation: "insert sorted u16 entry: moveId | (level << 9), before FF FF terminator" }
      ],
      safeEditNotes: ["Variable length edits require rebuilding the NARC member table."]
    },
    {
      id: "encounter_data_dppt",
      name: "DPPt wild encounter data",
      romPath: "fielddata/encountdata/pl_enc_data.narc",
      alternatePaths: ["fielddata/encountdata/enc_data.narc"],
      source: relSource(sourceFile("EncounterFile.cs")),
      sourceSha1: sha1IfExists(sourceFile("EncounterFile.cs")),
      memberModel: "one NARC member per encounter table referenced by map headers",
      recordLength: null,
      fields: [
        { name: "walkingRate", offset: 0x00, type: "u32le low byte" },
        { name: "walkingSlots", offset: 0x04, type: "12 * {level:u32le low byte, species:u32le}" },
        { name: "swarmPokemon", offset: 0x64, type: "2 * u32le low u16" },
        { name: "dayPokemon", offset: 0x6C, type: "2 * u32le" },
        { name: "nightPokemon", offset: 0x74, type: "2 * u32le" },
        { name: "radarPokemon", offset: 0x7C, type: "4 * u32le" },
        { name: "regionalForms", offset: 0x8C, type: "5 * u32le" },
        { name: "dualSlotRuby", offset: 0xA4, type: "2 * u32le" },
        { name: "surfRate", offset: 0xCC, type: "u32le low byte" },
        { name: "oldRodRate", offset: 0x124, type: "u32le low byte" }
      ],
      commonEdits: [
        { request: "change wild Pokemon", operation: "edit species fields in the relevant encounter table member; use MapHeaders wildPokemon to find member id" }
      ]
    },
    {
      id: "trainer_data",
      name: "Trainer properties and party data",
      romPath: "trainer/trdata.narc and trainer/trpok.narc",
      source: relSource(sourceFile("TrainerFile.cs")),
      sourceSha1: sha1IfExists(sourceFile("TrainerFile.cs")),
      memberModel: "trainer properties and trainer party are separate members keyed by trainer id",
      recordLength: null,
      fields: [
        { name: "trdata.flags", offset: 0x00, type: "u8", bitfields: [{ name: "chooseMoves", bits: "0" }, { name: "chooseItems", bits: "1" }] },
        { name: "trdata.trainerClass", offset: 0x01, type: "u8" },
        { name: "trdata.unknown", offset: 0x02, type: "u8" },
        { name: "trdata.partyCount", offset: 0x03, type: "u8" },
        { name: "trdata.items", offset: 0x04, type: "4 * u16le" },
        { name: "trdata.aiFlags", offset: 0x0C, type: "u32le" },
        { name: "trdata.doubleBattle", offset: 0x10, type: "u32le", note: "2 means double battle, 0 means single." },
        { name: "trpok.partyEntry", offset: "variable", type: "{difficulty:u8, genderAbility:u8, level:u16le, speciesForm:u16le, heldItem?:u16le, moves?:4*u16le, ballSeals:u16le}" }
      ],
      commonEdits: [
        { request: "change trainer party", operation: "edit trpok member for trainer id; entry size depends on chooseItems/chooseMoves flags in trdata" },
        { request: "change trainer AI", operation: "edit trdata u32le at 0x0C" }
      ]
    },
    {
      id: "trade_data",
      name: "In-game trade data",
      romPath: "fielddata/pokemon_trade/fld_trade.narc",
      source: relSource(sourceFile("TradeData.cs")),
      sourceSha1: sha1IfExists(sourceFile("TradeData.cs")),
      memberModel: "one NARC member per in-game trade",
      recordLength: 80,
      fields: [
        { name: "species", offset: 0x00, type: "s32le" },
        { name: "hpIV", offset: 0x04, type: "s32le" },
        { name: "atkIV", offset: 0x08, type: "s32le" },
        { name: "defIV", offset: 0x0C, type: "s32le" },
        { name: "speedIV", offset: 0x10, type: "s32le" },
        { name: "spAtkIV", offset: 0x14, type: "s32le" },
        { name: "spDefIV", offset: 0x18, type: "s32le" },
        { name: "ability", offset: 0x1C, type: "s32le", note: "DSPRE marks as unused." },
        { name: "otID", offset: 0x20, type: "s32le" },
        { name: "pid", offset: 0x38, type: "s32le" },
        { name: "heldItem", offset: 0x3C, type: "s32le" },
        { name: "requestedSpecies", offset: 0x4C, type: "s32le" }
      ]
    },
    {
      id: "map_header_pt",
      name: "Platinum map header",
      romPath: "ARM9 map header table unless dynamic headers patch is applied",
      source: relSource(sourceFile("MapHeader.cs")),
      sourceSha1: sha1IfExists(sourceFile("MapHeader.cs")),
      memberModel: "fixed 24-byte table entry per map header",
      recordLength: 24,
      fields: [
        { name: "areaDataID", offset: 0x00, type: "u8" },
        { name: "unknown1", offset: 0x01, type: "u8" },
        { name: "matrixID", offset: 0x02, type: "u16le" },
        { name: "scriptFileID", offset: 0x04, type: "u16le" },
        { name: "levelScriptID", offset: 0x06, type: "u16le" },
        { name: "textArchiveID", offset: 0x08, type: "u16le" },
        { name: "musicDayID", offset: 0x0A, type: "u16le" },
        { name: "musicNightID", offset: 0x0C, type: "u16le" },
        { name: "wildPokemon", offset: 0x0E, type: "u16le", note: "Encounter table member id; 0xFFFF means none in DPPt." },
        { name: "eventFileID", offset: 0x10, type: "u16le" },
        { name: "locationName", offset: 0x12, type: "u8" },
        { name: "areaIcon", offset: 0x13, type: "u8" },
        { name: "weatherID", offset: 0x14, type: "u8" },
        { name: "cameraAngleID", offset: 0x15, type: "u8" },
        { name: "mapSettings", offset: 0x16, type: "u16le", bitfields: [{ name: "locationSpecifier", bits: "0-6" }, { name: "battleBackground", bits: "7-11" }, { name: "flags", bits: "12-15" }] }
      ]
    },
    {
      id: "text_archive",
      name: "Message/text archives",
      romPath: "msgdata/pl_msg.narc",
      source: relSource(sourceFile("TextArchive.cs")),
      sourceSha1: sha1IfExists(sourceFile("TextArchive.cs")),
      memberModel: "one text archive member per text bank; DSPRE expands to JSON for editing",
      recordLength: null,
      fields: [
        { name: "archiveId", type: "member index" },
        { name: "messages", type: "encrypted Gen IV text payload; use DSPRE/TextConverter or msgenc rather than raw byte edits" }
      ],
      safeEditNotes: ["Prefer text tooling over manual byte edits."]
    }
  ]
};

const scriptSummary = readScrcmdSummary();
const scriptFormats = {
  schemaVersion: 1,
  game: "pokemon-platinum",
  generatedAt: new Date().toISOString(),
  generatedBy: "scripts/extract-dspre-index.js",
  sourceRoot: relSource(sourceRoot),
  notes: [
    "Compact script/event reference generated from DSPRE format classes and platinum_scrcmd_database.json.",
    "Use this before loading DSPRE source or large script files."
  ],
  sources: {
    scriptDatabase: scriptSummary,
    classes: [
      { id: "ScriptFile", source: relSource(sourceFile("ScriptFile.cs")), sha1: sha1IfExists(sourceFile("ScriptFile.cs")) },
      { id: "EventFile", source: relSource(sourceFile("EventFile.cs")), sha1: sha1IfExists(sourceFile("EventFile.cs")) },
      { id: "LevelScriptFile", source: relSource(sourceFile("LevelScriptFile.cs")), sha1: sha1IfExists(sourceFile("LevelScriptFile.cs")) },
      { id: "MapHeader", source: relSource(sourceFile("MapHeader.cs")), sha1: sha1IfExists(sourceFile("MapHeader.cs")) }
    ]
  },
  formats: [
    {
      id: "map_header_pt",
      description: "Map headers link maps to script, level script, text archive, encounter, and event file IDs.",
      keyFields: ["scriptFileID@0x04", "levelScriptID@0x06", "textArchiveID@0x08", "wildPokemon@0x0E", "eventFileID@0x10"],
      relatedRegistry: "narc-formats.platinum.json#map_header_pt"
    },
    {
      id: "script_file",
      source: relSource(sourceFile("ScriptFile.cs")),
      description: "Field script command bytecode. Use script command database for names/meanings before editing raw scripts.",
      editGuidance: "Prefer script-aware tooling; raw edits need command widths and jump target updates."
    },
    {
      id: "event_file",
      source: relSource(sourceFile("EventFile.cs")),
      description: "Map event file: overworlds, warps, triggers, signposts/objects depending on game format.",
      editGuidance: "Use DSPRE format index or GUI-derived exports for object/event edits; avoid blind binary edits."
    },
    {
      id: "level_script_file",
      source: relSource(sourceFile("LevelScriptFile.cs")),
      description: "Level script triggers and init/load/resume script references.",
      editGuidance: "Use level script command names from platinum_scrcmd_database.json when available."
    }
  ],
  quickLookups: {
    commonAgentSearches: [
      "rg -n \"ScrCmd_StartWildBattle|Encounter_New|ScriptContext_GetVar\" ../pokeplatinum/src/scrcmd.c ../pokeplatinum/src/scrcmd_*.c",
      "rg -n \"FLAG_|VAR_|SetFlag|CheckFlag|ClearFlag\" ../pokeplatinum/src ../pokeplatinum/include",
      "rg -n \"scriptFileID|levelScriptID|textArchiveID|wildPokemon|eventFileID\" docs/script-format-index.md registries/script-formats.platinum.json"
    ]
  }
};

function hexOffset(offset) {
  return typeof offset === "number" ? `0x${offset.toString(16).toUpperCase().padStart(2, "0")}` : offset;
}

function fieldTable(fields) {
  return [
    "| Field | Offset | Type | Notes |",
    "| --- | ---: | --- | --- |",
    ...fields.map((field) => {
      const notes = [
        field.description,
        field.note,
        field.enum ? `enum: ${field.enum}` : "",
        field.bitfields ? `bits: ${field.bitfields.map((b) => `${b.name} ${b.bits}`).join("; ")}` : "",
        field.commonZeroValueHex ? `zero: ${field.commonZeroValueHex}` : "",
      ].filter(Boolean).join(" ");
      const offset = Object.prototype.hasOwnProperty.call(field, "offset") ? field.offset : (field.valueHex || "");
      return `| ${field.name} | ${hexOffset(offset)} | ${field.type || ""} | ${notes} |`;
    })
  ].join("\n");
}

function commonEdits(format) {
  if (!format.commonEdits || !format.commonEdits.length) return "";
  return [
    "",
    "Common edits:",
    "",
    ...format.commonEdits.map((edit) => `- ${edit.request}: ${edit.operation}`)
  ].join("\n");
}

function writeNarcMarkdown() {
  const sections = narcFormats.formats.map((format) => [
    `## ${format.name}`,
    "",
    `- id: \`${format.id}\``,
    `- ROM path: \`${format.romPath}\``,
    format.alternatePaths ? `- alternate paths: ${format.alternatePaths.map((p) => `\`${p}\``).join(", ")}` : "",
    `- member model: ${format.memberModel}`,
    `- record length: ${format.recordLength == null ? "variable/unknown" : `${format.recordLength} bytes`}`,
    `- source: \`${format.source}\``,
    "",
    fieldTable(format.fields),
    commonEdits(format),
    format.safeEditNotes ? ["", "Safe edit notes:", "", ...format.safeEditNotes.map((note) => `- ${note}`)].join("\n") : "",
  ].filter(Boolean).join("\n")).join("\n\n");

  return [
    "# NARC Format Index",
    "",
    "Compact, agent-optimized reference for high-impact Pokemon Platinum data formats. End users do not need the full DSPRE repo for these facts.",
    "",
    "Offsets are relative to the NARC member or fixed record unless the format says otherwise.",
    "",
    "## Fast Answers",
    "",
    "- Remove all EV yields: edit `poketool/personal/pl_personal.narc`, every member, write `00 00` at offset `0x0A`.",
    "- Change move power: edit move data member offset `0x03`.",
    "- Change move accuracy: edit move data member offset `0x05`.",
    "- Change move PP: edit move data member offset `0x06`.",
    "- Change wild held items: edit personal data offsets `0x0C` and `0x0E`.",
    "- Change ability slots: edit personal data offsets `0x16` and `0x17`.",
    "",
    sections,
    "",
    "## Regeneration",
    "",
    "Maintainers can regenerate this file with:",
    "",
    "```sh",
    "node scripts/extract-dspre-index.js",
    "```",
    ""
  ].join("\n");
}

function writeScriptMarkdown() {
  const counts = scriptSummary.counts || {};
  return [
    "# Script Format Index",
    "",
    "Compact, agent-optimized reference for Platinum script, event, level-script, movement, and map-header lookup.",
    "",
    "## Source Summary",
    "",
    `- script database available: ${scriptSummary.available ? "yes" : "no"}`,
    `- script commands indexed: ${counts.scrcmd || 0}`,
    `- movement commands indexed: ${counts.movements || 0}`,
    `- level-script commands indexed: ${counts.levelScriptCommands || 0}`,
    `- sounds indexed: ${counts.sounds || 0}`,
    "",
    "## What To Check First",
    "",
    "- Need to find which script/event file a map uses: check `map_header_pt` in `registries/narc-formats.platinum.json`.",
    "- Need command names or movement names: check `registries/script-formats.platinum.json` quick examples first, then `platinum_scrcmd_database.json` only if regenerating.",
    "- Need to edit field scripts: use script-aware tooling; raw command edits require command widths and jump target care.",
    "",
    "## Map Header Links",
    "",
    "- `scriptFileID` at Platinum map header offset `0x04`.",
    "- `levelScriptID` at offset `0x06`.",
    "- `textArchiveID` at offset `0x08`.",
    "- `wildPokemon` encounter table id at offset `0x0E`.",
    "- `eventFileID` at offset `0x10`.",
    "",
    "## Useful Agent Searches",
    "",
    "```sh",
    ...scriptFormats.quickLookups.commonAgentSearches,
    "```",
    "",
    "## Movement Examples",
    "",
    "The generated JSON keeps a small sample of movements such as facing and common walk speeds. Use the registry for compact lookup and regenerate from the script database when a full command list is needed.",
    "",
    "## Regeneration",
    "",
    "Maintainers can regenerate this file with:",
    "",
    "```sh",
    "node scripts/extract-dspre-index.js",
    "```",
    ""
  ].join("\n");
}

function writePlaybookMarkdown() {
  return [
    "# DSPRE Data Edit Playbook",
    "",
    "Use this before searching DSPRE source. It maps common non-code-injection requests to compact indexed data formats.",
    "",
    "| Request | First place to look | Fast edit path | Caveat |",
    "| --- | --- | --- | --- |",
    "| Remove all EV yields | `pokemon_personal` | Write `00 00` at offset `0x0A` in every `pl_personal.narc` member | Preserves species stats; only EV reward data changes. |",
    "| Change Pokemon base stats | `pokemon_personal` | Edit offsets `0x00-0x05` | Order is HP, Atk, Def, Speed, SpAtk, SpDef. |",
    "| Change Pokemon type | `pokemon_personal` | Edit `type1` at `0x06`, `type2` at `0x07` | Type IDs follow Gen IV/DSPRE enum. |",
    "| Change wild held items | `pokemon_personal` | Edit `item1` at `0x0C`, `item2` at `0x0E` | Item IDs are `u16le`. |",
    "| Change abilities | `pokemon_personal` | Edit `firstAbility` at `0x16`, `secondAbility` at `0x17` | Ability behavior still lives in battle code. |",
    "| Change move power | `move_data` | Edit offset `0x03` | 0 usually displays as no power/status. |",
    "| Change move accuracy | `move_data` | Edit offset `0x05` | 0 often means no accuracy check/display. |",
    "| Change move PP | `move_data` | Edit offset `0x06` | PP Ups are separate runtime behavior. |",
    "| Change move target | `move_data` | Edit `u16le` at `0x08` | Use AttackRange bitfield. |",
    "| Change evolution | `evolution_data` | Edit one 6-byte evolution slot | Up to 7 slots per species/form. |",
    "| Change learnset | `learnset_data` | Edit variable `move | (level << 9)` entries before `FF FF` | Rebuild NARC when member length changes. |",
    "| Change wild encounters | `encounter_data_dppt` | Use map header `wildPokemon` id, then edit encounter member | Encounter files are structured tables, not one flat species list. |",
    "| Change trainer party | `trainer_data` | Edit `trpok` member, guided by `trdata` flags | Entry size depends on chooseItems/chooseMoves. |",
    "| Change map scripts/events | `map_header_pt` + script/event formats | Use script/event-aware tooling | Avoid blind jump/offset edits. |",
    "",
    "## Example: Remove All EV Yields",
    "",
    "Goal: Pokemon give no EVs after battle.",
    "",
    "- Format: `pokemon_personal`",
    "- NARC: `poketool/personal/pl_personal.narc`",
    "- Member model: one member per species/form",
    "- Field: `evYields`",
    "- Offset: `0x0A`",
    "- Type: `u16le`",
    "- Write: `00 00` in every member",
    "",
    "Why: DSPRE stores six 2-bit EV yield fields inside this `u16le`. Zeroing both bytes clears HP, Atk, Def, Speed, SpAtk, and SpDef EV yields.",
    "",
    "## Example: Change Move Power, Accuracy, PP",
    "",
    "- Format: `move_data`",
    "- Power: offset `0x03`",
    "- Accuracy: offset `0x05`",
    "- PP: offset `0x06`",
    "",
    "## Example: Adjust Held Wild Items Or Ability Slots",
    "",
    "- Format: `pokemon_personal`",
    "- Held items: `item1` at `0x0C`, `item2` at `0x0E`",
    "- Abilities: `firstAbility` at `0x16`, `secondAbility` at `0x17`",
    "",
    "## Agent Rule",
    "",
    "Check `registries/narc-formats.platinum.json` before opening DSPRE source. Open DSPRE classes only when the compact index is missing a field or a format is too complex for the summary.",
    ""
  ].join("\n");
}

function main() {
  const docsDir = path.join(TOOLKIT_ROOT, "docs");
  const registriesDir = path.join(TOOLKIT_ROOT, "registries");
  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(registriesDir, { recursive: true });

  writeJson(path.join(registriesDir, "narc-formats.platinum.json"), narcFormats);
  writeJson(path.join(registriesDir, "script-formats.platinum.json"), scriptFormats);
  fs.writeFileSync(path.join(docsDir, "narc-format-index.md"), writeNarcMarkdown());
  fs.writeFileSync(path.join(docsDir, "script-format-index.md"), writeScriptMarkdown());
  fs.writeFileSync(path.join(docsDir, "dspre-data-edit-playbook.md"), writePlaybookMarkdown());

  console.log("Generated DSPRE compact indexes:");
  console.log("- docs/narc-format-index.md");
  console.log("- docs/script-format-index.md");
  console.log("- docs/dspre-data-edit-playbook.md");
  console.log("- registries/narc-formats.platinum.json");
  console.log("- registries/script-formats.platinum.json");
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
