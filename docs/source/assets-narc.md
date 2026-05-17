# Assets And NARC Source Shard

NARC runtime loading, graphics helpers, resource conversion tools, filesystem identity, and build/file mapping.

Use this shard after `docs/request-router.md` points here. If this shard does not contain enough detail, use the listed Tier-2 searches against optional `../pokeplatinum` source.

## NARC, assets, graphics
Runtime NARC loading, graphics helpers, Pokemon sprites, palettes, resource tools.
Useful for: asset replacement, NARC member lookup, sprites, icons, palettes, graphics conversion.
Primary files:
- `src/narc.c` - 499 lines
- `include/narc.h` - 160 lines
- `include/constants/narc.h` - 204 lines
- `src/graphics.c` - 544 lines
- `src/character_sprite.c` - 283 lines
- `tools/nitroarc/README.md` - 26 lines
- `tools/nitrogfx/main.c` - 1555 lines
Key symbols/pivots: `NARC_ctor`, `NARC_dtor`, `NARC_ReadWholeMember`, `NARC_ReadWholeMemberByIndexPair`, `BuildPokemonSpriteTemplate`.
Extracted source pivots:
- `src/narc.c`: `ReadFromNarcMemberByPathAndIndex`, `FS_InitFile`, `FS_OpenFile`, `FS_SeekFile`, `FS_ReadFile`, `GF_ASSERT`, `FS_CloseFile`, `AllocAndReadFromNarcMemberByPathAndIndex`
- `include/narc.h`: `NARC_ReadWholeMemberByIndexPair`, `NARC_AllocAndReadWholeMemberByIndexPair`, `NARC_AllocAtEndAndReadWholeMemberByIndexPair`, `NARC_ReadFromMemberByIndexPair`, `NARC_AllocAndReadFromMemberByIndexPair`, `NARC_AllocAtEndAndReadFromMemberByIndexPair`, `NARC_GetMemberSizeByIndexPair`, `NARC_ctor`
- `src/graphics.c`: `LoadTilesToBgLayer`, `LoadTilemapToBgLayer`, `LoadObjectTiles`, `LoadPaletteWithSrcOffset`, `LoadPartialPalette`, `LoadImageMapping`, `LoadImageMappingAndSetVramMode`, `GetCharacterData`
- `src/character_sprite.c`: `CharacterSprite_CopyTileFromUntiledArray`, `memcpy`, `CharacterSprite_LoadSpriteData`, `Heap_Free`, `CharacterSprite_TileUntiledPokemonSprite`, `CharacterSprite_SpeciesIsSpinda`, `CharacterSprite_LoadTiledPokemonSprite`, `PokemonSprite_Decrypt`
- `tools/nitrogfx/main.c`: `void`, `CountLzCompressArgs`, `HandleLZCompressCommand`, `HandleLZDecompressCommand`, `ConvertGbaToPng`, `ReadGbaPalette`, `ReadImage`, `WritePng`
Compact source clues:
- `src/narc.c:10` [NARC_INDEX_BATTLE__SKILL__WAZA_SEQ] = "battle/skill/waza_seq.narc",
- `src/narc.c:11` [NARC_INDEX_BATTLE__SKILL__SUB_SEQ] = "battle/skill/sub_seq.narc",
- `src/narc.c:12` [NARC_INDEX_POKETOOL__PERSONAL__PL_PERSONAL] = "poketool/personal/pl_personal.narc",
- `src/narc.c:13` [NARC_INDEX_POKETOOL__PERSONAL__PL_GROWTBL] = "poketool/personal/pl_growtbl.narc",
- `src/narc.c:14` [NARC_INDEX_POKETOOL__POKEGRA__PL_POKEGRA] = "poketool/pokegra/pl_pokegra.narc",
- `src/narc.c:15` [NARC_INDEX_POKETOOL__POKEGRA__HEIGHT] = "poketool/pokegra/height.narc",
- `src/narc.c:16` [NARC_INDEX_POKETOOL__TRGRA__TRBGRA] = "poketool/trgra/trbgra.narc",
- `src/narc.c:17` [NARC_INDEX_BATTLE__GRAPHIC__PL_BATT_BG] = "battle/graphic/pl_batt_bg.narc",
- `include/narc.h:1` #ifndef POKEPLATINUM_NARC_H
- `include/narc.h:2` #define POKEPLATINUM_NARC_H
- `include/narc.h:27` void NARC_ReadWholeMemberByIndexPair(void *dest, enum NarcID narcID, int memberIndex);
- `include/narc.h:39` void *NARC_AllocAndReadWholeMemberByIndexPair(enum NarcID narcID, int memberIndex, enum HeapID heapID);
Tier-2 fallback searches:
```sh
rg -n "NARC_INDEX|NARC_Read|NARC_" ../pokeplatinum/src/narc.c ../pokeplatinum/include/narc.h ../pokeplatinum/include/constants/narc.h ../pokeplatinum/src/graphics.c ../pokeplatinum/src/character_sprite.c ../pokeplatinum/tools/nitroarc/README.md ../pokeplatinum/tools/nitrogfx/main.c
rg -n "Load.*Sprite|CharacterSprite|PokemonSprite|BuildPokemonSpriteTemplate" ../pokeplatinum/src/narc.c ../pokeplatinum/include/narc.h ../pokeplatinum/include/constants/narc.h ../pokeplatinum/src/graphics.c ../pokeplatinum/src/character_sprite.c ../pokeplatinum/tools/nitroarc/README.md ../pokeplatinum/tools/nitrogfx/main.c
rg -n "palette|Palette|NCLR|NCGR|NCER|NANR|NSCR" ../pokeplatinum/src/narc.c ../pokeplatinum/include/narc.h ../pokeplatinum/include/constants/narc.h ../pokeplatinum/src/graphics.c ../pokeplatinum/src/character_sprite.c ../pokeplatinum/tools/nitroarc/README.md ../pokeplatinum/tools/nitrogfx/main.c
```
Notes: Use NARC format index first for structured data; use these files for runtime asset loading.
## Build and ROM identity
Build setup, ROM revision identity, filesystem layout, static binary references.
Useful for: base ROM validation, build failures, file path to FAT/NARC mapping, source build setup.
Primary files:
- `README.md` - 13 lines
- `INSTALL.md` - 300 lines
- `Makefile` - 185 lines
- `meson.build` - 311 lines
- `platinum.us/filesys.csv` - 342 lines
- `platinum.us/rom_rev0.sha1` - 2 lines
- `platinum.us/rom_rev1.sha1` - 2 lines
Extracted source pivots:
- `INSTALL.md`: `Linux`
- `Makefile`: `ifneq`, `ifeq`
- `meson.build`: `get_option`, `subdir`, `alias_target`
Compact source clues:
- `README.md:9` * [**pokeplatinum.us.nds**](https://datomatic.no-intro.org/index.php?page=show_record&s=28&n=4997) (Rev 1): `sha1: 0862ec35b24de5c7e2dcb88c9eea0873110d755c`
- `README.md:10` * [**pokeplatinum.us.nds**](https://datomatic.no-intro.org/index.php?page=show_record&s=28&n=3541) (Rev 0): `sha1: ce81046eda7d232513069519cb2085349896dec7`
- `INSTALL.md:250` - [build/pokeplatinum.us.nds](https://datomatic.no-intro.org/index.php?page=show_record&s=28&n=4997) `sha1: 0862ec35b24de5c7e2dcb88c9eea0873110d755c`
- `INSTALL.md:254` (`sha1: ce81046eda7d232513069519cb2085349896dec7`). This revision matches the
- `INSTALL.md:283` is insufficient. A fork of `binutils-gdb` which supports the overlay system
- `Makefile:11` meson         \
- `Makefile:27` MESON_VER := 1.7.0
- `Makefile:28` MESON_DIR := $(SUBPROJ_DIR)/meson-$(MESON_VER)
- `Makefile:29` MESON_SUB := $(MESON_DIR)/meson.py
- `Makefile:31` MESON ?= $(MESON_SUB)
- `Makefile:101` $(NINJA) -C $(BUILD) debug.nef overlay.map
- `Makefile:104` $(MESON) test -C $(BUILD)
Tier-2 fallback searches:
```sh
rg -n "sha1|Rev 0|Rev 1|pokeplatinum.us" ../pokeplatinum/README.md ../pokeplatinum/INSTALL.md ../pokeplatinum/Makefile ../pokeplatinum/meson.build ../pokeplatinum/platinum.us/filesys.csv ../pokeplatinum/platinum.us/rom_rev0.sha1 ../pokeplatinum/platinum.us/rom_rev1.sha1
rg -n "filesys|NARC|overlay|arm9" ../pokeplatinum/README.md ../pokeplatinum/INSTALL.md ../pokeplatinum/Makefile ../pokeplatinum/meson.build ../pokeplatinum/platinum.us/filesys.csv ../pokeplatinum/platinum.us/rom_rev0.sha1 ../pokeplatinum/platinum.us/rom_rev1.sha1
rg -n "subdir|custom_target|meson" ../pokeplatinum/README.md ../pokeplatinum/INSTALL.md ../pokeplatinum/Makefile ../pokeplatinum/meson.build ../pokeplatinum/platinum.us/filesys.csv ../pokeplatinum/platinum.us/rom_rev0.sha1 ../pokeplatinum/platinum.us/rom_rev1.sha1
```
Notes: Use only when the compact indexes do not answer build/filesystem questions.

## Back To Router

- `docs/agent-start-here.md`
- `docs/request-router.md`
- `docs/pokeplatinum-compact-index.md`
