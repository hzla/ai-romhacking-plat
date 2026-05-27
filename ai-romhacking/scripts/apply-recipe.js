#!/usr/bin/env node
"use strict";

const path = require("path");
const { loadRecipe } = require("../lib/recipes");
const { applyRecipeToRom } = require("../lib/patcher-adapter");
const { writePatchedRomAndManifest, defaultOutputPath } = require("../lib/manifests");

function parseArgs(argv) {
  const args = { force: false };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--rom") {
      args.rom = argv[++i];
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "-h" || arg === "--help") {
      args.help = true;
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  if (positional.length > 1) {
    throw new Error(`Unexpected positional arguments: ${positional.slice(1).join(" ")}`);
  }
  args.recipe = positional[0];
  return args;
}

function usage() {
  return [
    "Usage: node scripts/apply-recipe.js <recipe.json> --rom <input.nds> [--out <output.nds>] [--force]",
    "",
    "Applies a legacy/example recipe through ../PlatPatches/app.js and writes a patched ROM copy plus manifest.",
  ].join("\n");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.recipe) {
    throw new Error("Missing recipe path.");
  }
  if (!args.rom) {
    throw new Error("Missing --rom <input.nds>.");
  }

  const recipe = loadRecipe(args.recipe);
  const plannedOut = args.out ? path.resolve(args.out) : defaultOutputPath(recipe, args.rom);
  const patchResult = applyRecipeToRom(recipe, args.rom, { force: args.force });
  const written = writePatchedRomAndManifest({
    recipe,
    inputPath: patchResult.inputPath,
    outputPath: plannedOut,
    outputBytes: patchResult.outputBytes,
    log: patchResult.log,
    options: patchResult.patchOptions,
  });

  console.log(`Applied recipe: ${recipe.name}`);
  console.log(`Patches: ${recipe.patchIds.join(", ")}`);
  console.log(`Output ROM: ${written.outputPath}`);
  console.log(`Manifest: ${written.manifestPath}`);
  if (patchResult.log.length) {
    console.log("");
    console.log("Patcher log:");
    for (const line of patchResult.log) {
      console.log(`- ${line}`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
