"use strict";

const path = require("path");
const { readJson } = require("./workspace");
const { loadCapabilityRegistry, unknownPatchIds } = require("./capabilities");

const SUPPORTED_OPTION_KEYS = new Set([
  "force",
  "shinyOddsPercent",
  "ivMin",
  "ivMax",
  "natureAllowed",
  "frameRateMode",
  "textCharsPerFrame",
  "debugFairyBattleTest",
]);

function loadRecipe(recipePath) {
  const absolute = path.resolve(recipePath);
  return normalizeRecipe(readJson(absolute), absolute);
}

function normalizeRecipe(recipe, sourcePath = null) {
  if (!recipe || typeof recipe !== "object" || Array.isArray(recipe)) {
    throw new Error("Recipe must be a JSON object.");
  }
  if (recipe.game !== "pokemon-platinum") {
    throw new Error('Recipe game must be "pokemon-platinum".');
  }
  if (!recipe.name || typeof recipe.name !== "string") {
    throw new Error("Recipe must include a string name.");
  }
  if (!Array.isArray(recipe.patches) || recipe.patches.length === 0) {
    throw new Error("Recipe must include at least one patch.");
  }

  const patchIds = [];
  const mergedOptions = {};

  for (const [key, value] of Object.entries(recipe.options || {})) {
    assertSupportedOption(key);
    mergedOptions[key] = value;
  }

  for (const patch of recipe.patches) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      throw new Error("Every recipe patch must be an object.");
    }
    if (!patch.id || typeof patch.id !== "string") {
      throw new Error("Every recipe patch must include a string id.");
    }
    patchIds.push(patch.id);
    for (const [key, value] of Object.entries(patch.options || {})) {
      assertSupportedOption(key);
      mergedOptions[key] = value;
    }
  }

  validatePatchIds(patchIds);
  validateOptions(mergedOptions);

  return {
    sourcePath,
    name: recipe.name,
    description: recipe.description || "",
    game: recipe.game,
    patchIds,
    options: mergedOptions,
    raw: recipe,
  };
}

function assertSupportedOption(key) {
  if (!SUPPORTED_OPTION_KEYS.has(key)) {
    throw new Error(
      `Unsupported recipe option "${key}". Supported options: ${Array.from(SUPPORTED_OPTION_KEYS).join(", ")}`
    );
  }
}

function validatePatchIds(ids) {
  const unknown = unknownPatchIds(ids, loadCapabilityRegistry());
  if (unknown.length) {
    throw new Error(`Unknown patch id(s): ${unknown.join(", ")}`);
  }
}

function validateOptions(options) {
  if (options.frameRateMode !== undefined && !["battle", "global"].includes(options.frameRateMode)) {
    throw new Error('frameRateMode must be "battle" or "global".');
  }
  if (options.shinyOddsPercent !== undefined) {
    assertIntegerRange(options.shinyOddsPercent, 0, 100, "shinyOddsPercent");
  }
  if (options.ivMin !== undefined) {
    assertIntegerRange(options.ivMin, 0, 31, "ivMin");
  }
  if (options.ivMax !== undefined) {
    assertIntegerRange(options.ivMax, 0, 31, "ivMax");
  }
  if (options.ivMin !== undefined && options.ivMax !== undefined && Number(options.ivMin) > Number(options.ivMax)) {
    throw new Error("ivMin cannot be greater than ivMax.");
  }
  if (options.textCharsPerFrame !== undefined) {
    assertIntegerRange(options.textCharsPerFrame, 2, 10, "textCharsPerFrame");
  }
  if (options.natureAllowed !== undefined) {
    if (!Array.isArray(options.natureAllowed) || options.natureAllowed.length === 0) {
      throw new Error("natureAllowed must be a non-empty array of nature ids.");
    }
    for (const nature of options.natureAllowed) {
      assertIntegerRange(nature, 0, 24, "natureAllowed entry");
    }
  }
  if (options.force !== undefined && typeof options.force !== "boolean") {
    throw new Error("force must be boolean.");
  }
  if (options.debugFairyBattleTest !== undefined && typeof options.debugFairyBattleTest !== "boolean") {
    throw new Error("debugFairyBattleTest must be boolean.");
  }
}

function assertIntegerRange(value, min, max, label) {
  if (!Number.isInteger(Number(value)) || Number(value) < min || Number(value) > max) {
    throw new Error(`${label} must be an integer from ${min} to ${max}.`);
  }
}

module.exports = {
  SUPPORTED_OPTION_KEYS,
  loadRecipe,
  normalizeRecipe,
  validatePatchIds,
  validateOptions,
};
