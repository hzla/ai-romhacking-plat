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

const sourceRoot = path.join(WORKSPACE_ROOT, "pokeplatinum");

function rel(filePath) {
  return path.relative(TOOLKIT_ROOT, filePath).replace(/\\/g, "/");
}

function pp(relPath) {
  return path.join(sourceRoot, relPath);
}

function exists(relPath) {
  return fs.existsSync(pp(relPath));
}

function sha1(relPath) {
  const file = pp(relPath);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  return crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex");
}

function lineCount(relPath) {
  const file = pp(relPath);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  return fs.readFileSync(file, "utf8").split(/\r?\n/).length;
}

function extractMatchingLines(relPath, patterns, limit = 24) {
  const file = pp(relPath);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return [];
  const text = fs.readFileSync(file, "utf8");
  const regexes = patterns.map((p) => new RegExp(p, "i"));
  const out = [];
  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 220) return;
    if (regexes.some((r) => r.test(trimmed))) {
      out.push({ line: index + 1, text: trimmed });
    }
  });
  return out.slice(0, limit);
}

function extractFunctionNames(relPath, limit = 40) {
  const file = pp(relPath);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return [];
  const text = fs.readFileSync(file, "utf8");
  const names = [];
  const seen = new Set();
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("//") || line.startsWith("*") || line.startsWith("#")) continue;
    if (line.includes("=") || line.includes("typedef") || line.includes("return ")) continue;
    const match = line.match(/(?:^|[\s\*])([A-Za-z_][A-Za-z0-9_]*)\s*\([^;{}]*\)\s*(?:;|\{)?$/);
    if (!match) continue;
    const name = match[1];
    if (["if", "for", "while", "switch", "return", "sizeof"].includes(name)) continue;
    if (!seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
    if (names.length >= limit) break;
  }
  return names;
}

const featureAreas = [
  {
    id: "build_rom_identity",
    title: "Build and ROM identity",
    summary: "Build setup, ROM revision identity, filesystem layout, static binary references.",
    usefulFor: ["base ROM validation", "build failures", "file path to FAT/NARC mapping", "source build setup"],
    primaryFiles: ["README.md", "INSTALL.md", "Makefile", "meson.build", "platinum.us/filesys.csv", "platinum.us/rom_rev0.sha1", "platinum.us/rom_rev1.sha1"],
    searchPatterns: ["sha1|Rev 0|Rev 1|pokeplatinum.us", "filesys|NARC|overlay|arm9", "subdir|custom_target|meson"],
    fallbackNotes: "Use only when the compact indexes do not answer build/filesystem questions."
  },
  {
    id: "battle_core",
    title: "Battle core",
    summary: "Move execution, damage, accuracy, critical hits, type chart, battle state, battle messages.",
    usefulFor: ["critical hits", "damage formula", "accuracy", "type effectiveness", "battle rules", "weather/ability interactions"],
    primaryFiles: ["src/battle/battle_script.c", "src/battle/battle_lib.c", "src/battle/battle_system.c", "src/battle/battle_controller_player.c", "include/battle/battle_context.h", "include/battle/battle_lib.h", "include/constants/battle.h"],
    searchPatterns: ["CalcCritical|criticalMul|critical", "CalcDamage|CalcMoveDamage|CalcDamageVariance|damage", "accuracy|MOVE_STATUS_MISSED|No Guard|Lock On", "ApplyTypeChart|effectiveness|TYPE_", "ability|ABILITY_|weather|WEATHER_"],
    keySymbols: ["BattleScript_CalcMoveDamage", "BtlCmd_CalcDamage", "BattleSystem_CalcMoveDamage", "BattleSystem_CalcDamageVariance", "BattleSystem_CalcCriticalMulti", "BattleSystem_ApplyTypeChart"],
    fallbackNotes: "For requests like changing Chlorophyll weather behavior, start here plus constants for abilities/weather."
  },
  {
    id: "pokemon_generation_personality",
    title: "Pokemon generation, personality, stats",
    summary: "Pokemon initialization, shiny/personality checks, nature/gender, stats, species data access.",
    usefulFor: ["shiny logic", "nature/gender changes", "IV/stat generation", "species personal data runtime access"],
    primaryFiles: ["src/pokemon.c", "include/pokemon.h", "include/struct_defs/pokemon.h", "include/struct_defs/species.h", "src/field_battle_data_transfer.c", "src/trainer_data.c"],
    searchPatterns: ["Pokemon_IsShiny|Pokemon_IsPersonalityShiny|FindShiny|shiny", "Pokemon_Init|InitAndCalcStats|monIVs|combinedIV|IV", "GetNature|NatureOf|personality", "SpeciesData_Get|SPECIES_DATA_|personal"],
    keySymbols: ["Pokemon_InitWith", "Pokemon_InitAndCalcStats", "Pokemon_IsPersonalityShiny", "Pokemon_FindShinyPersonality", "Pokemon_GetNatureOf", "SpeciesData_GetValue"],
    fallbackNotes: "Use NARC format indexes first for personal-data byte edits; use this for runtime behavior."
  },
  {
    id: "abilities_weather_items",
    title: "Abilities, weather, held items in battle",
    summary: "Battle runtime handling for abilities, weather, held item effects, and stat modifiers.",
    usefulFor: ["change ability behavior", "weather-dependent abilities", "held item battle effects", "stat modifier hooks"],
    primaryFiles: ["src/battle/battle_lib.c", "src/battle/battle_script.c", "generated/abilities.txt", "include/constants/battle.h", "include/constants/items.h", "include/battle/battle_context.h"],
    searchPatterns: ["ABILITY_|ability|Battler_Ability|HeldItem", "WEATHER_|weather|sun|rain|hail|sandstorm", "Speed|speed|stat stage|modifier", "Chlorophyll|CHLOROPHYLL"],
    keySymbols: ["BattleSystem_CalcMoveDamage", "BattleSystem_TriggerAbility", "Battler_Ability", "Battler_HeldItem", "BattleContext_Get"],
    fallbackNotes: "Many ability constants may live in generated or nested constants; search before assuming a file path."
  },
  {
    id: "wild_encounters",
    title: "Wild encounters",
    summary: "Grass/water/fishing/Sweet Scent encounters, repel, swarm, radar, honey trees, Great Marsh.",
    usefulFor: ["encounter rates", "wild species slots", "Sweet Scent", "repel", "honey trees", "daily encounters"],
    primaryFiles: ["src/overlay006/wild_encounters.c", "include/overlay006/wild_encounters.h", "src/map_header_data.c", "include/data/map_headers.h", "src/encounter.c", "src/overlay006/repel_step_update.c"],
    searchPatterns: ["TryWildEncounter|TryFishingEncounter|SweetScent|CreateWildMon", "encounterRate|encounterSlot|GrassEncounter|WaterEncounter", "Repel|swarm|trophy|GreatMarsh|dualSlot|honey"],
    keySymbols: ["WildEncounters_TryWildEncounter", "WildEncounters_TryFishingEncounter", "WildEncounters_TrySweetScentEncounter", "CreateWildMon_Scripted", "MapHeaderData_LoadWildEncounters"],
    fallbackNotes: "Use NARC encounter index first for direct table edits."
  },
  {
    id: "field_overworld_movement",
    title: "Field, overworld, movement",
    summary: "Player/NPC movement, map objects, field control, collision, tile behavior, camera, transitions.",
    usefulFor: ["movement speed", "NPC movement", "collision", "map transition behavior", "field controls"],
    primaryFiles: ["src/overlay005/field_control.c", "src/map_object.c", "src/map_object_move.c", "src/map_tile_behavior.c", "src/field_system.c", "src/field_task.c", "src/field_transition.c", "docs/maps/maps.md"],
    searchPatterns: ["PlayerAvatar|avatar|walk|run|bike|movement", "MapObject|Move|movement", "TileBehavior|collision|BDHC|height", "FieldTask|FieldSystem|fieldSystem"],
    keySymbols: ["FieldTask_InitCall", "FieldSystem_StartFieldMap", "MapObject", "MapObject_Move", "FieldTransition_StartEncounterEffect"],
    fallbackNotes: "For pure movement constant patches, prefer existing patch capabilities if available."
  },
  {
    id: "scripts_events_flags",
    title: "Scripts, events, vars, flags",
    summary: "Field scripts, script commands, flags/vars, event files, level scripts, story progression.",
    usefulFor: ["events", "flags", "vars", "scripted wild battles", "NPC scripts", "story triggers"],
    primaryFiles: ["src/scrcmd.c", "src/field_script_context.c", "include/constants/scrcmd.h", "include/constants/savedata/vars_flags.h", "include/data/field/script_commands.h"],
    searchPatterns: ["ScrCmd_StartWildBattle|StartTrainerBattle|Encounter_New", "ScriptContext_Read|ScriptContext_GetVar|GetVarPointer", "FLAG_|VAR_|VarsFlags|SetFlag|CheckFlag|ClearFlag", "ApplyMovement|WaitMovement|message|StringTemplate"],
    keySymbols: ["ScrCmd_StartWildBattle", "ScrCmd_GetRandom", "ScriptContext_ReadHalfWord", "ScriptContext_GetVar", "ScriptContext_GetVarPointer"],
    fallbackNotes: "Use script-format compact index first for command/movement lookup."
  },
  {
    id: "text_messages",
    title: "Text and messages",
    summary: "Text rendering, message loaders, string templates, fonts, message speed and text banks.",
    usefulFor: ["fast text", "dialogue rendering", "message content", "text banks", "font/glyph behavior"],
    primaryFiles: ["src/render_text.c", "src/text.c", "src/message.c", "src/message_util.c", "src/field_message.c", "include/text.h", "include/render_text.h", "tools/msgenc/msgenc.cpp"],
    searchPatterns: ["Text_AddPrinter|TextPrinter|RenderText|delayCounter|textSpeed", "MessageLoader|GetString|TEXT_BANK|StringTemplate", "FONT_|Font_|glyph|letterSpacing"],
    keySymbols: ["RenderText", "Text_AddPrinterWithParams", "MessageLoader_Init", "MessageLoader_GetString", "StringTemplate_Set"],
    fallbackNotes: "Use DSPRE text archive notes for data edits; use these files for runtime rendering/speed behavior."
  },
  {
    id: "narc_assets_graphics",
    title: "NARC, assets, graphics",
    summary: "Runtime NARC loading, graphics helpers, Pokemon sprites, palettes, resource tools.",
    usefulFor: ["asset replacement", "NARC member lookup", "sprites", "icons", "palettes", "graphics conversion"],
    primaryFiles: ["src/narc.c", "include/narc.h", "include/constants/narc.h", "src/graphics.c", "src/character_sprite.c", "tools/nitroarc/README.md", "tools/nitrogfx/main.c"],
    searchPatterns: ["NARC_INDEX|NARC_Read|NARC_", "Load.*Sprite|CharacterSprite|PokemonSprite|BuildPokemonSpriteTemplate", "palette|Palette|NCLR|NCGR|NCER|NANR|NSCR"],
    keySymbols: ["NARC_ctor", "NARC_dtor", "NARC_ReadWholeMember", "NARC_ReadWholeMemberByIndexPair", "BuildPokemonSpriteTemplate"],
    fallbackNotes: "Use NARC format index first for structured data; use these files for runtime asset loading."
  },
  {
    id: "pokedex_party_pc_bag",
    title: "Pokedex, party, PC, bag, summary",
    summary: "Major UI app systems and storage/party interfaces.",
    usefulFor: ["Pokedex UI", "party menu", "summary screen", "PC boxes", "bag/items UI"],
    primaryFiles: ["include/applications/pokedex/pokedex_app.h", "include/applications/party_menu/main.h", "include/applications/pc_boxes/box_application.h", "include/applications/pokemon_summary_screen/main.h", "src/bag.c", "src/item.c"],
    searchPatterns: ["Pokedex|pokedex|zukan|caught|seen", "PartyMenu|Summary|pokemon_summary|MON_DATA_", "pc_boxes|BoxPokemon|PokemonStorage|box app|PC", "Bag|Item|ITEM_|UseItem|HeldItem|Pocket"],
    keySymbols: ["Pokedex_Encounter", "Party_GetPokemonBySlotIndex", "Bag_TryAddItem", "Item_Load", "BoxPokemon_GetValue"],
    fallbackNotes: "Expansion requests usually become project plans because UI and save/data assumptions are broad."
  },
  {
    id: "trainers_ai",
    title: "Trainers and AI",
    summary: "Trainer data setup, trainer battle encounter handoff, battle AI constants/scripts.",
    usefulFor: ["trainer party behavior", "trainer AI flags", "battle opening", "trainer classes"],
    primaryFiles: ["src/trainer_data.c", "include/trainer_data.h", "include/battle/trainer_ai.h", "asm/trainer_ai", "tools/datagen/datagen_trainer.cpp", "res/trainers/meson.build"],
    searchPatterns: ["Trainer_Encounter|TrainerData|TRAINER_|trainer", "trainer_ai|AI|moveDamageRolls|AI_CONTEXT", "partyCount|trainerClass|doubleBattle"],
    keySymbols: ["Trainer_Encounter", "Trainer_Load", "BattleSystem_LoadTrainerParty", "TrainerAI_Main"],
    fallbackNotes: "Use DSPRE trainer format index for data edits; use decomp for behavior."
  },
  {
    id: "save_records_system",
    title: "Save data, records, system",
    summary: "Save blocks, game records, system vars, boot/main loop, options.",
    usefulFor: ["save compatibility", "new flags/vars", "records", "global options", "startup"],
    primaryFiles: ["include/savedata.h", "include/constants/savedata/vars_flags.h", "src/game_records.c", "src/game_options.c", "src/main.c", "src/boot.c"],
    searchPatterns: ["SaveData|VarsFlags|SystemVars|GAME_RECORD|GameRecords", "Options|GameOptions|boot|main"],
    keySymbols: ["SaveData_SaveSize", "SaveData_Init", "VarsFlags_SetFlag", "VarsFlags_GetVar", "GameRecords_IncrementRecordValue"],
    fallbackNotes: "Any request that expands save structures should be treated as high-risk expansion work."
  },
  {
    id: "battle_animations",
    title: "Battle animations",
    summary: "Move visual effects, particles, animation scripts, emitters, camera callbacks.",
    usefulFor: ["move animation changes", "particle effects", "battle visual behavior"],
    primaryFiles: ["src/battle_anim/battle_anim_system.c", "src/battle_anim/script_func_tables.c", "src/battle_anim/script_funcs_0.c", "src/battle_anim/emitter_callbacks.c", "include/battle_anim/battle_anim_system.h", "res/battle/particles/battle_particles.order"],
    searchPatterns: ["script_func|BattleAnim|Particle|Emitter|camera", "MOVE_|move animation|animation"],
    keySymbols: ["BattleAnimSystem_Start", "BattleAnimSystem_New", "BattleParticle_New", "BattleAnimScriptFunc"],
    fallbackNotes: "Animation work often needs asset/resource context as well as code."
  },
  {
    id: "apps_minigames_network",
    title: "Apps, minigames, network, extras",
    summary: "Main menu, Mystery Gift, Underground, contests, WFC/network, Poketch-like apps and overlays.",
    usefulFor: ["Mystery Gift", "Underground", "Contest", "WFC", "menus", "special apps"],
    primaryFiles: ["src/main_menu/main_menu.c", "src/main_menu/mystery_gift_app.c", "src/underground.c", "src/contest.c", "src/nintendo_wfc/main.c", "src/http/http.c"],
    searchPatterns: ["Mystery|WFC|WiFi|Underground|Contest|application|overlay", "main_menu|gift|network|http"],
    keySymbols: ["MainMenu_New", "MysteryGift", "Underground", "Contest", "HTTP"],
    fallbackNotes: "Usually not first-line for battle/code-injection requests, but keep indexed because user requests are unpredictable."
  }
];

const sourceShards = [
  {
    file: "battle.md",
    title: "Battle Source Shard",
    summary: "Battle rules, damage, accuracy, critical hits, type chart, abilities, weather, trainer AI, and battle animations.",
    areaIds: ["battle_core", "abilities_weather_items", "trainers_ai", "battle_animations"],
  },
  {
    file: "pokemon-generation.md",
    title: "Pokemon Generation Source Shard",
    summary: "Pokemon creation, personality, shiny checks, natures, IVs, wild encounter runtime, and species-data access.",
    areaIds: ["pokemon_generation_personality", "wild_encounters"],
  },
  {
    file: "field-scripts.md",
    title: "Field And Scripts Source Shard",
    summary: "Overworld movement, field control, map objects, script commands, vars, flags, level scripts, and events.",
    areaIds: ["field_overworld_movement", "scripts_events_flags"],
  },
  {
    file: "text-ui.md",
    title: "Text And UI Source Shard",
    summary: "Text rendering, message loaders, Pokedex, party, PC, bag, summary, save records, options, menus, and side apps.",
    areaIds: ["text_messages", "pokedex_party_pc_bag", "save_records_system", "apps_minigames_network"],
  },
  {
    file: "assets-narc.md",
    title: "Assets And NARC Source Shard",
    summary: "NARC runtime loading, graphics helpers, resource conversion tools, filesystem identity, and build/file mapping.",
    areaIds: ["narc_assets_graphics", "build_rom_identity"],
  },
];

function enrichedFeatureAreas() {
  return featureAreas.map((area) => {
    const files = area.primaryFiles.map((file) => ({
      path: file,
      exists: exists(file),
      lines: lineCount(file),
      sha1: sha1(file),
      sampleSymbols: extractFunctionNames(file, 18),
      keyMatches: extractMatchingLines(file, area.searchPatterns || [], 8),
    }));
    return { ...area, primaryFiles: files };
  });
}

function buildRegistry() {
  return {
    schemaVersion: 1,
    game: "pokemon-platinum",
    generatedAt: new Date().toISOString(),
    generatedBy: "scripts/extract-pokeplatinum-index.js",
    sourceRoot: fs.existsSync(sourceRoot) ? rel(sourceRoot) : null,
    sourceAvailableAtGeneration: fs.existsSync(sourceRoot),
    notes: [
      "Compact, high-recall source reference index for AI romhacking.",
      "End users do not need the pokeplatinum repo for ordinary usage.",
      "Tier 1: check this registry and companion docs. Tier 2: search pokeplatinum source only when compact notes do not answer the request."
    ],
    featureAreas: enrichedFeatureAreas(),
  };
}

function mdFileList(files) {
  return files.map((file) => {
    const bits = [`\`${file.path}\``];
    if (file.lines) bits.push(`${file.lines} lines`);
    if (!file.exists) bits.push("missing at generation");
    return `- ${bits.join(" - ")}`;
  }).join("\n");
}

function mdSearches(area) {
  return (area.searchPatterns || []).map((pattern) => `rg -n "${pattern}" ${area.primaryFiles.map((f) => `../pokeplatinum/${f.path}`).join(" ")}`).join("\n");
}

function mdExtractedPivots(files) {
  const lines = [];
  for (const file of files) {
    if (!file.sampleSymbols || file.sampleSymbols.length === 0) continue;
    lines.push(`- \`${file.path}\`: ${file.sampleSymbols.slice(0, 8).map((symbol) => `\`${symbol}\``).join(", ")}`);
    if (lines.length >= 8) break;
  }
  return lines.join("\n");
}

function mdKeyMatches(files, limit = 12) {
  const lines = [];
  for (const file of files) {
    for (const match of file.keyMatches || []) {
      lines.push(`- \`${file.path}:${match.line}\` ${match.text}`);
      if (lines.length >= limit) return lines.join("\n");
    }
  }
  return lines.join("\n");
}

function renderAreaDetails(area) {
  return [
    `## ${area.title}`,
    "",
    area.summary,
    "",
    `Useful for: ${area.usefulFor.join(", ")}.`,
    "",
    "Primary files:",
    "",
    mdFileList(area.primaryFiles),
    "",
    area.keySymbols ? `Key symbols/pivots: ${area.keySymbols.map((s) => `\`${s}\``).join(", ")}.` : "",
    "",
    mdExtractedPivots(area.primaryFiles) ? "Extracted source pivots:" : "",
    "",
    mdExtractedPivots(area.primaryFiles),
    "",
    mdKeyMatches(area.primaryFiles) ? "Compact source clues:" : "",
    "",
    mdKeyMatches(area.primaryFiles),
    "",
    "Tier-2 fallback searches:",
    "",
    "```sh",
    mdSearches(area),
    "```",
    "",
    area.fallbackNotes ? `Notes: ${area.fallbackNotes}` : "",
  ].filter(Boolean).join("\n");
}

function writeCompactIndex(registry) {
  const shardLines = sourceShards.map((shard) => `- \`docs/source/${shard.file}\`: ${shard.summary}`);
  const areaLines = registry.featureAreas.map((area) => {
    const shard = sourceShards.find((candidate) => candidate.areaIds.includes(area.id));
    const firstFiles = area.primaryFiles.slice(0, 3).map((file) => `\`${file.path}\``).join(", ");
    const shardPath = shard ? `docs/source/${shard.file}` : "registries/pokeplatinum-source-index.json";
    return `- \`${area.id}\` -> \`${shardPath}\`: ${area.summary} First files: ${firstFiles}.`;
  });

  return [
    "# pokeplatinum Compact Source Index",
    "",
    "Token-optimized source reference for Pokemon Platinum romhacking agents.",
    "",
    "End users do not need to provide the full `pokeplatinum` repo for ordinary usage. Agents should use this as a router, then read one domain shard only when needed.",
    "",
    "## Tiered Search Rule",
    "",
    "1. Check `docs/agent-start-here.md` and `docs/request-router.md` first.",
    "2. Read the one source shard that matches the request.",
    "3. Check DSPRE-derived data indexes for NARC/data/script requests.",
    "4. Search optional `../pokeplatinum` source only if compact indexes do not answer the question.",
    "5. When falling back to source, search the smallest feature area first.",
    "",
    "## Domain Shards",
    "",
    ...shardLines,
    "",
    "## Feature Area Router",
    "",
    ...areaLines,
    "",
    "## Regeneration",
    "",
    "Maintainers can regenerate this file with:",
    "",
    "```sh",
    "node scripts/extract-pokeplatinum-index.js",
    "```",
    ""
  ].join("\n");
}

function writeSourceShard(shard, registry) {
  const areas = shard.areaIds
    .map((id) => registry.featureAreas.find((area) => area.id === id))
    .filter(Boolean);

  return [
    `# ${shard.title}`,
    "",
    shard.summary,
    "",
    "Use this shard after `docs/request-router.md` points here. If this shard does not contain enough detail, use the listed Tier-2 searches against optional `../pokeplatinum` source.",
    "",
    ...areas.map(renderAreaDetails),
    "",
    "## Back To Router",
    "",
    "- `docs/agent-start-here.md`",
    "- `docs/request-router.md`",
    "- `docs/pokeplatinum-compact-index.md`",
    "",
  ].join("\n");
}

function writeSourceReadme() {
  return [
    "# Source Shards",
    "",
    "Small pokeplatinum-derived reference shards for free-plan-friendly agent usage. Read one shard for the current request instead of loading the full compact source index or optional decomp.",
    "",
    ...sourceShards.map((shard) => `- \`${shard.file}\`: ${shard.summary}`),
    "",
    "If a request is a NARC, script, trainer, encounter, move, item, or personal-data edit, check `docs/dspre-data-edit-playbook.md` and the NARC/script registries before using source shards.",
    "",
  ].join("\n");
}

function writeSearchPlaybook(registry) {
  const examples = [
    {
      request: "Make Chlorophyll double Speed in hail instead of sun",
      tier1: "Feature areas: Battle core; Abilities, weather, held items in battle.",
      tier2: "Search ability/weather/speed terms in battle files.",
      search: "rg -n \"CHLOROPHYLL|ABILITY_CHLOROPHYLL|WEATHER_HAIL|WEATHER_SUN|Speed|speed|ability\" ../pokeplatinum/src/battle ../pokeplatinum/include"
    },
    {
      request: "Remove EV yields",
      tier1: "Use DSPRE NARC index, not decomp source: `pokemon_personal`, offset `0x0A`.",
      tier2: "Only search source if runtime EV award behavior must change.",
      search: "rg -n \"SPECIES_DATA_EV_|EV_.*YIELD|effort\" ../pokeplatinum/src ../pokeplatinum/include"
    },
    {
      request: "Make moves never miss for everyone",
      tier1: "Feature area: Battle core. Existing player-only patch is not enough.",
      tier2: "Search accuracy and miss status in battle scripts/controllers.",
      search: "rg -n \"accuracy|MOVE_STATUS_MISSED|No Guard|Lock On\" ../pokeplatinum/src/battle ../pokeplatinum/include/battle"
    },
    {
      request: "Change wild encounters",
      tier1: "Use DSPRE encounter NARC index and map header `wildPokemon` field.",
      tier2: "Search wild encounter runtime only for behavior changes.",
      search: "rg -n \"TryWildEncounter|encounterRate|CreateWildMon|MapHeaderData_LoadWildEncounters\" ../pokeplatinum/src/overlay006 ../pokeplatinum/src/encounter.c ../pokeplatinum/include"
    },
    {
      request: "Add many Pokemon or expand Pokedex",
      tier1: "Classify as expansion-project. Compact index can identify systems, but not make it a one-command patch.",
      tier2: "If scoped to one test species, inspect Pokemon generation, Pokedex, assets, text, save/UI assumptions.",
      search: "rg -n \"Pokedex|SPECIES_|personal|sprite|icon|cry|form|evolution|learnset\" ../pokeplatinum/src ../pokeplatinum/include ../pokeplatinum/res"
    }
  ];

  return [
    "# pokeplatinum Source Search Playbook",
    "",
    "Use this when a user asks for a patch that is not already implemented. The goal is to avoid loading the full decomp unless the compact notes are insufficient.",
    "",
    "## Two-Tier Workflow",
    "",
    "- Tier 1: compact docs and registries in `ai-romhacking`.",
    "- Tier 2: targeted `rg` searches in optional `../pokeplatinum` source.",
    "- Do not ask users to paste the decomp for ordinary use.",
    "- If Tier 2 is needed and source is unavailable, explain that the request needs maintainer/source fallback.",
    "",
    "## Examples",
    "",
    ...examples.flatMap((example) => [
      `### ${example.request}`,
      "",
      `- Tier 1: ${example.tier1}`,
      `- Tier 2: ${example.tier2}`,
      "",
      "```sh",
      example.search,
      "```",
      ""
    ]),
    "## Feature Areas",
    "",
    ...registry.featureAreas.map((area) => `- ${area.title}: ${area.usefulFor.join(", ")}`),
    ""
  ].join("\n");
}

function writeExpansionBoundaries() {
  return [
    "# pokeplatinum Expansion Boundaries",
    "",
    "This note helps agents distinguish feasible localized changes from expansion projects.",
    "",
    "## Usually Feasible As Localized Research",
    "",
    "- Change a specific ability condition, such as Chlorophyll checking hail instead of sun.",
    "- Change a specific battle formula branch, such as critical-hit behavior or accuracy checks.",
    "- Change a specific data field already indexed in NARC/DSPRE compact docs.",
    "- Hook a small battle helper when a stable code site and code cave are known.",
    "",
    "## Usually Expansion Projects",
    "",
    "- Add every Gen 5 Pokemon.",
    "- Expand Pokedex capacity by large amounts.",
    "- Add many moves, abilities, forms, cries, icons, sprites, and UI screens at once.",
    "- Change save structures or assumptions without a migration plan.",
    "- Add a generation-wide mechanic that touches many unrelated systems.",
    "",
    "## Response Pattern",
    "",
    "For expansion projects, be honest: identify the systems involved, explain that it is not a safe one-command patch, and offer a smaller first slice such as researching one species, one UI limit, or one battle mechanic hook.",
    ""
  ].join("\n");
}

function main() {
  const docsDir = path.join(TOOLKIT_ROOT, "docs");
  const registriesDir = path.join(TOOLKIT_ROOT, "registries");
  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(registriesDir, { recursive: true });

  const registry = buildRegistry();
  writeJson(path.join(registriesDir, "pokeplatinum-source-index.json"), registry);
  fs.writeFileSync(path.join(docsDir, "pokeplatinum-compact-index.md"), writeCompactIndex(registry));
  fs.writeFileSync(path.join(docsDir, "pokeplatinum-search-playbook.md"), writeSearchPlaybook(registry));
  fs.writeFileSync(path.join(docsDir, "pokeplatinum-expansion-boundaries.md"), writeExpansionBoundaries());
  const sourceDir = path.join(docsDir, "source");
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.writeFileSync(path.join(sourceDir, "README.md"), writeSourceReadme());
  for (const shard of sourceShards) {
    fs.writeFileSync(path.join(sourceDir, shard.file), writeSourceShard(shard, registry));
  }

  console.log("Generated pokeplatinum compact indexes:");
  console.log("- docs/pokeplatinum-compact-index.md");
  console.log("- docs/pokeplatinum-search-playbook.md");
  console.log("- docs/pokeplatinum-expansion-boundaries.md");
  console.log("- docs/source/*.md");
  console.log("- registries/pokeplatinum-source-index.json");
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
