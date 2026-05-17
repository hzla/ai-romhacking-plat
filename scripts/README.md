# Scripts

Run these with Node.js from inside `ai-romhacking`.

```sh
node scripts/list-capabilities.js
node scripts/inspect-workspace.js
node scripts/verify-workspace.js
node scripts/apply-recipe.js recipes/examples/remove-critical-hits.json --rom /path/to/platinum.nds
```

The apply command imports `../platinum-rom-patcher/app.js`, writes a patched ROM copy, and writes a manifest beside it.

For low-context agent sessions, read `docs/agent-start-here.md` and `docs/request-router.md` before opening larger docs.

Maintainers with local DSPRE extracts or pokeplatinum source can regenerate compact indexes:

```sh
node scripts/extract-dspre-index.js
node scripts/extract-pokeplatinum-index.js
```
