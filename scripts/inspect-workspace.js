#!/usr/bin/env node
"use strict";

const { inspectWorkspace } = require("../lib/workspace");

function parseArgs(argv) {
  const args = { json: false };
  for (const arg of argv) {
    if (arg === "--json") {
      args.json = true;
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
    "Usage: node scripts/inspect-workspace.js [--json]",
    "",
    "Checks which expected sibling repositories and reference folders are present.",
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  const report = inspectWorkspace();
  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`Toolkit: ${report.toolkitRoot}`);
  console.log(`Workspace: ${report.workspaceRoot}`);
  console.log("");
  for (const sibling of report.siblings) {
    const status = sibling.ok ? "ok" : sibling.present ? "partial" : sibling.optional ? "optional missing" : "missing";
    console.log(`- ${sibling.id}: ${status}`);
    console.log(`  ${sibling.path}`);
    if (sibling.requiredFor.length) {
      console.log(`  used for: ${sibling.requiredFor.join(", ")}`);
    }
    const missing = sibling.markers.filter((marker) => !marker.exists).map((marker) => marker.marker);
    if (missing.length) {
      console.log(`  missing markers: ${missing.join(", ")}`);
    }
  }
  if (report.romFilesInToolkit.length) {
    console.log("");
    console.log("Warning: .nds files were found inside ai-romhacking:");
    for (const file of report.romFilesInToolkit) {
      console.log(`- ${file}`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
