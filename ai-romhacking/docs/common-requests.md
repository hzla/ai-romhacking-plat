# Common Requests

Use this file to translate normal user language into capability IDs or triage categories. Most advanced requests will not have a known capability yet.

| User says | Capability | Notes |
| --- | --- | --- |
| "Make all Pokemon shiny" | `shinyOdds` with `shinyOddsPercent: 100` | Warn about gift/event routines that reroll until non-shiny. |
| "Remove critical hits" | `noCrits` | Does not change move text. |
| "Make my moves never miss" | `playerAccuracy` | Does not bypass immunities, Protect, or semi-invulnerable checks. |
| "Make text faster" | `instantText` or `text4x` | Prefer `text4x` for multi-character speed, `instantText` for safer fast text. |
| "Make movement faster" | `movementSpeed` | Player movement constants only. |
| "Add Fairy type" | `fairyType` | Add `fairyPokemonTypes` if the user wants Pokemon retyped too. |
| "Give Pokemon better IVs" | `iv15_31` | Ask if the desired range is unclear. |
| "Only allow certain natures" | `wildNatures` | Requires a non-empty allowed nature ID list. |
| "Make battles faster" | ambiguous | Ask whether they mean text, framerate, animations, or HP bars. |
| "Make Chlorophyll work in hail" | unknown feasible code change | Research battle ability speed modifiers, then build a new reusable capability. |
| "Add one custom ability" | unknown feasible or code-injection capability | Scope depends on whether an unused ability slot exists and how battle logic must hook in. |
| "Add every Gen 5 Pokemon" | expansion project | Too broad for one patch; suggest a smaller slice such as researching species limits or adding one test species. |
| "Expand the Pokedex by 100 Pokemon" | expansion project | Requires data, UI, assets, save compatibility, and broad testing. |

For nontechnical users, explain the result like:

"I applied the no-critical-hits patch and wrote a new ROM copy. Your original ROM was not changed."

For unknown but feasible requests, explain:

"The toolkit does not have that patch yet, but this looks like a localized code change. I will research the relevant source notes, follow the existing PlatPatches module patterns, and make it reusable."

For expansion-sized requests, explain:

"That is bigger than a safe one-command patch. The right next step is to break it into a smaller test slice."
