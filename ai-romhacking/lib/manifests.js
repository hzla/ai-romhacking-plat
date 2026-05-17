"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { TOOLKIT_ROOT, safeSlug, writeJson } = require("./workspace");

function sha1Bytes(bytes) {
  return crypto.createHash("sha1").update(bytes).digest("hex");
}

function sha1File(filePath) {
  return sha1Bytes(fs.readFileSync(filePath));
}

function defaultOutputPath(recipe, inputRomPath) {
  const base = path.basename(inputRomPath).replace(/\.nds$/i, "");
  const recipeSlug = safeSlug(recipe.name, "patched");
  return path.join(TOOLKIT_ROOT, "output", `${base}.${recipeSlug}.nds`);
}

function ensureNotInPlace(inputPath, outputPath) {
  if (path.resolve(inputPath) === path.resolve(outputPath)) {
    throw new Error("Refusing to patch in place. Choose a different --out path.");
  }
}

function writePatchedRomAndManifest({ recipe, inputPath, outputPath, outputBytes, log, options }) {
  const resolvedOutput = path.resolve(outputPath || defaultOutputPath(recipe, inputPath));
  ensureNotInPlace(inputPath, resolvedOutput);
  fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });

  const inputHashBefore = sha1File(inputPath);
  fs.writeFileSync(`${resolvedOutput}.tmp`, outputBytes);
  fs.renameSync(`${resolvedOutput}.tmp`, resolvedOutput);
  const inputHashAfter = sha1File(inputPath);
  if (inputHashBefore !== inputHashAfter) {
    throw new Error("Input ROM hash changed while writing output; refusing to continue.");
  }

  const outputHash = sha1File(resolvedOutput);
  const manifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    toolkit: "ai-romhacking",
    game: recipe.game,
    recipe: {
      name: recipe.name,
      sourcePath: recipe.sourcePath,
      patches: recipe.patchIds,
      options,
    },
    input: {
      path: path.resolve(inputPath),
      sha1: inputHashBefore,
      bytes: fs.statSync(inputPath).size,
    },
    output: {
      path: resolvedOutput,
      sha1: outputHash,
      bytes: fs.statSync(resolvedOutput).size,
    },
    patcherLog: log,
  };

  const manifestPath = `${resolvedOutput}.manifest.json`;
  writeJson(manifestPath, manifest);
  return { outputPath: resolvedOutput, manifestPath, manifest };
}

module.exports = {
  sha1Bytes,
  sha1File,
  defaultOutputPath,
  ensureNotInPlace,
  writePatchedRomAndManifest,
};
