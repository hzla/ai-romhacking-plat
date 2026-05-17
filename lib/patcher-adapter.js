"use strict";

const fs = require("fs");
const path = require("path");
const { findSibling, requireFile } = require("./workspace");
const { unknownPatchIds } = require("./capabilities");

function patcherModulePath() {
  return path.join(findSibling("platinum-rom-patcher"), "app.js");
}

function loadPatcher() {
  const file = requireFile(
    patcherModulePath(),
    "platinum-rom-patcher/app.js sibling dependency"
  );
  const patcher = require(file);
  if (!patcher || typeof patcher.applySelectedPatches !== "function") {
    throw new Error(`Patcher module does not export applySelectedPatches: ${file}`);
  }
  return patcher;
}

function applyRecipeToRom(recipe, inputRomPath, options = {}) {
  const inputPath = path.resolve(inputRomPath);
  if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
    throw new Error(`Input ROM not found: ${inputPath}`);
  }
  if (!/\.nds$/i.test(inputPath)) {
    throw new Error(`Input ROM must end in .nds: ${inputPath}`);
  }

  const unknown = unknownPatchIds(recipe.patchIds);
  if (unknown.length) {
    throw new Error(`Unknown patch id(s): ${unknown.join(", ")}`);
  }

  const patcher = loadPatcher();
  const patchOptions = { ...recipe.options };
  if (options.force) {
    patchOptions.force = true;
  }

  const inputBytes = fs.readFileSync(inputPath);
  const result = patcher.applySelectedPatches(inputBytes, recipe.patchIds, patchOptions);
  if (!result || !result.rom) {
    throw new Error("Patcher returned no ROM data.");
  }
  return {
    inputPath,
    outputBytes: Buffer.from(result.rom),
    log: Array.isArray(result.log) ? result.log : [],
    patchOptions,
  };
}

module.exports = {
  patcherModulePath,
  loadPatcher,
  applyRecipeToRom,
};
