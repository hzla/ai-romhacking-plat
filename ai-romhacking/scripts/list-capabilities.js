#!/usr/bin/env node
"use strict";

const { loadCapabilityRegistry, searchCapabilities } = require("../lib/capabilities");

function parseArgs(argv) {
  const args = { json: false, query: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--json") {
      args.json = true;
    } else if (arg === "--query") {
      args.query = argv[++i] || "";
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
    "Usage: node scripts/list-capabilities.js [--json] [--query text]",
    "",
    "Lists implemented Pokemon Platinum patch capabilities.",
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const registry = loadCapabilityRegistry();
  const capabilities = searchCapabilities(args.query, registry);
  if (args.json) {
    console.log(JSON.stringify({ ...registry, capabilities }, null, 2));
    return;
  }

  console.log(`Pokemon Platinum capabilities (${capabilities.length}/${registry.capabilities.length})`);
  for (const capability of capabilities) {
    const aliases = capability.aliases && capability.aliases.length
      ? ` aliases: ${capability.aliases.slice(0, 4).join(", ")}`
      : "";
    console.log(`- ${capability.id}: ${capability.name} [${capability.risk}]`);
    console.log(`  ${capability.summary}`);
    if (aliases) {
      console.log(`  ${aliases}`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
