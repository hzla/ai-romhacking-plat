#!/usr/bin/env node
"use strict";

const path = require("path");
const { inspectWorkspace, TOOLKIT_ROOT, isFile } = require("../lib/workspace");

const REQUIRED_TOOLKIT_FILES = [
  "AGENTS.md",
  "README.md",
  ".aiignore",
  "docs/agent-start-here.md",
  "docs/request-router.md",
  "docs/pokeplatinum-compact-index.md",
  "docs/pokeplatinum-search-playbook.md",
  "docs/pokeplatinum-expansion-boundaries.md",
  "docs/source/battle.md",
  "docs/source/pokemon-generation.md",
  "registries/capabilities.platinum.json",
  "registries/request-router.platinum.json",
  "registries/pokeplatinum-source-index.json",
  "lib/patcher-adapter.js",
  "scripts/apply-recipe.js",
];

function parseArgs(argv) {
  const args = { strict: false };
  for (const arg of argv) {
    if (arg === "--strict") {
      args.strict = true;
    } else if (arg === "-h" || arg === "--help") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/verify-workspace.js [--strict]",
    "",
    "Verifies the toolkit files and, in strict mode, all expected sibling references.",
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const failures = [];
  for (const file of REQUIRED_TOOLKIT_FILES) {
    if (!isFile(path.join(TOOLKIT_ROOT, file))) {
      failures.push(`Missing toolkit file: ${file}`);
    }
  }

  const report = inspectWorkspace();
  const patcher = report.siblings.find((sibling) => sibling.id === "platinum-rom-patcher");
  if (!patcher || !patcher.ok) {
    failures.push("Missing or incomplete sibling platinum-rom-patcher; apply-recipe needs ../platinum-rom-patcher/app.js.");
  }

  if (args.strict) {
    for (const sibling of report.siblings) {
      if (sibling.optional) {
        continue;
      }
      if (!sibling.ok) {
        failures.push(`Strict mode: ${sibling.id} is missing or incomplete.`);
      }
    }
    if (report.romFilesInToolkit.length) {
      failures.push(`Strict mode: .nds files found inside ai-romhacking: ${report.romFilesInToolkit.join(", ")}`);
    }
  }

  if (failures.length) {
    console.error("Workspace verification failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Workspace verification passed.");
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
