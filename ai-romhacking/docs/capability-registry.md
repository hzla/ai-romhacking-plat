# Capability Registry And Recipes

Capabilities live in:

```text
registries/capabilities.platinum.json
```

Each capability has:

- `id`: patch ID passed to `platinum-rom-patcher`.
- `name`: human-readable label.
- `summary`: what it does.
- `aliases`: common user phrases.
- `options`: supported settings.
- `touches`: broad ROM areas changed by the patch.
- `caveats`: important behavior notes.
- `examplePrompts`: examples an AI agent should recognize.

## Recipe Format

Recipes are JSON files:

```json
{
  "game": "pokemon-platinum",
  "name": "Remove critical hits",
  "patches": [
    { "id": "noCrits" }
  ],
  "options": {
    "force": false
  }
}
```

Supported option keys:

- `force`: boolean.
- `shinyOddsPercent`: integer from 0 to 100.
- `ivMin`: integer from 0 to 31.
- `ivMax`: integer from 0 to 31.
- `natureAllowed`: non-empty array of nature IDs from 0 to 24.
- `frameRateMode`: `battle` or `global`.
- `textCharsPerFrame`: integer from 2 to 10.
- `debugFairyBattleTest`: boolean.

Options can appear at the top level or under an individual patch. If both are used, patch-level options are merged after top-level options.

## Applying Recipes

```sh
node scripts/apply-recipe.js recipes/examples/remove-critical-hits.json --rom /path/to/platinum.nds
```

Add `--force` only for compatible modified ROMs where sanity-check bytes are expected to differ.
