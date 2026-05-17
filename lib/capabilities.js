"use strict";

const path = require("path");
const { TOOLKIT_ROOT, readJson } = require("./workspace");

const REGISTRY_PATH = path.join(TOOLKIT_ROOT, "registries", "capabilities.platinum.json");

function loadCapabilityRegistry() {
  const registry = readJson(REGISTRY_PATH);
  if (!registry || !Array.isArray(registry.capabilities)) {
    throw new Error(`Invalid capability registry: ${REGISTRY_PATH}`);
  }
  return registry;
}

function capabilityMap(registry = loadCapabilityRegistry()) {
  const map = new Map();
  for (const capability of registry.capabilities) {
    if (!capability.id) {
      throw new Error("Capability registry contains an entry without an id.");
    }
    map.set(capability.id, capability);
  }
  return map;
}

function unknownPatchIds(ids, registry = loadCapabilityRegistry()) {
  const map = capabilityMap(registry);
  return ids.filter((id) => !map.has(id));
}

function searchCapabilities(query, registry = loadCapabilityRegistry()) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) {
    return registry.capabilities;
  }
  return registry.capabilities.filter((capability) => {
    const haystack = [
      capability.id,
      capability.name,
      capability.summary,
      capability.risk,
      ...(capability.aliases || []),
      ...(capability.examplePrompts || []),
      ...(capability.touches || []),
      ...(capability.caveats || []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

module.exports = {
  REGISTRY_PATH,
  loadCapabilityRegistry,
  capabilityMap,
  unknownPatchIds,
  searchCapabilities,
};
