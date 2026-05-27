# Safety And Legal Notes

This toolkit is for user-owned ROM backups and local patches.

- Do not distribute `.nds` ROM files.
- Do not commit ROM files.
- Do not paste ROM bytes into chat.
- Place a local working ROM in `roms/`, for example `roms/platinum.nds`.
- Keep original clean backups somewhere private.

The command workflow writes patched copies and JSON manifests. The manifest makes it easier to understand what changed without sharing the ROM.

If a patch fails a sanity check, do not use `--force` casually. `--force` is for compatible modified ROMs where the user understands that expected bytes may differ.
