# Recipes

Recipes are small JSON files that tell the toolkit which patch capabilities to apply.

Run an example:

```sh
node scripts/apply-recipe.js recipes/examples/remove-critical-hits.json --rom /path/to/platinum.nds
```

The input ROM is never changed. Outputs are written under `output/` unless `--out` is provided.
