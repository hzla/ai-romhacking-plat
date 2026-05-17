"use strict";

const fs = require("fs");
const path = require("path");

const TOOLKIT_ROOT = path.resolve(__dirname, "..");
const WORKSPACE_ROOT = path.resolve(TOOLKIT_ROOT, "..");

const EXPECTED_SIBLINGS = [
  {
    id: "pokeplatinum",
    path: "pokeplatinum",
    requiredFor: ["optional maintainer source-index regeneration", "source-build fallback"],
    optional: true,
    markers: ["README.md", "INSTALL.md", "src", "include", "res", "platinum.us"],
  },
  {
    id: "platinum-rom-patcher",
    path: "platinum-rom-patcher",
    requiredFor: ["apply-recipe"],
    markers: ["app.js", "README.md"],
  },
  {
    id: "Docs",
    path: "Docs",
    requiredFor: ["optional maintainer index regeneration"],
    optional: true,
    markers: ["platinum_scrcmd_database.json"],
  },
  {
    id: "DSPRE",
    path: "DSPRE",
    requiredFor: ["optional maintainer GUI/source reference"],
    optional: true,
    markers: [],
  },
];

function exists(target) {
  return fs.existsSync(target);
}

function isFile(target) {
  try {
    return fs.statSync(target).isFile();
  } catch (_error) {
    return false;
  }
}

function isDirectory(target) {
  try {
    return fs.statSync(target).isDirectory();
  } catch (_error) {
    return false;
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    const suffix = error && error.message ? `: ${error.message}` : "";
    throw new Error(`Could not read JSON ${filePath}${suffix}`);
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(`${filePath}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(`${filePath}.tmp`, filePath);
}

function safeSlug(text, fallback = "item") {
  const slug = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function walkFiles(root, options = {}) {
  const out = [];
  const ignoreDirs = new Set(options.ignoreDirs || []);
  if (!isDirectory(root)) {
    return out;
  }
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const rel = path.relative(root, full);
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name) && !ignoreDirs.has(rel)) {
          stack.push(full);
        }
      } else if (entry.isFile()) {
        out.push(full);
      }
    }
  }
  return out.sort();
}

function inspectWorkspace() {
  const siblings = EXPECTED_SIBLINGS.map((entry) => {
    const absolute = path.join(WORKSPACE_ROOT, entry.path);
    const markerResults = entry.markers.map((marker) => ({
      marker,
      exists: exists(path.join(absolute, marker)),
    }));
    return {
      id: entry.id,
      path: absolute,
      present: isDirectory(absolute),
      requiredFor: entry.requiredFor,
      optional: Boolean(entry.optional),
      markers: markerResults,
      ok: isDirectory(absolute) && markerResults.every((marker) => marker.exists),
    };
  });

  const toolkitFiles = walkFiles(TOOLKIT_ROOT, {
    ignoreDirs: ["node_modules"],
  });
  const romFiles = toolkitFiles
    .filter((file) => /\.nds$/i.test(file))
    .filter((file) => !path.relative(TOOLKIT_ROOT, file).startsWith(`output${path.sep}`))
    .map((file) => path.relative(TOOLKIT_ROOT, file));

  return {
    toolkitRoot: TOOLKIT_ROOT,
    workspaceRoot: WORKSPACE_ROOT,
    siblings,
    romFilesInToolkit: romFiles,
  };
}

function findSibling(name) {
  return path.join(WORKSPACE_ROOT, name);
}

function requireFile(filePath, label) {
  if (!isFile(filePath)) {
    throw new Error(`${label || "Required file"} not found: ${filePath}`);
  }
  return filePath;
}

function requireDirectory(dirPath, label) {
  if (!isDirectory(dirPath)) {
    throw new Error(`${label || "Required directory"} not found: ${dirPath}`);
  }
  return dirPath;
}

module.exports = {
  TOOLKIT_ROOT,
  WORKSPACE_ROOT,
  EXPECTED_SIBLINGS,
  exists,
  isFile,
  isDirectory,
  readJson,
  writeJson,
  safeSlug,
  walkFiles,
  inspectWorkspace,
  findSibling,
  requireFile,
  requireDirectory,
};
