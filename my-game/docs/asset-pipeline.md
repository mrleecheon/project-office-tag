# Asset Pipeline

This document defines how visual and audio files are organized, named, registered, and referenced in **GROOMY OFFICE**. Follow it when adding art for new chapters, CGs, UI, or marketing materials.

---

## Design principles

1. **Stable IDs, movable files** — Scene and map code never reference file paths. They use **asset IDs** (`bg_ch02_lobby`, `portrait_kim_base`, …). Only the manifest layer maps IDs to paths.
2. **Purpose-first folders** — Group by what the asset *is* (background, portrait, sprite), not by which chapter first used it.
3. **Predictable filenames** — Lowercase, snake_case, descriptive. No `final2.png`.
4. **Production vs temporary** — Placeholder, prototype, and retired files live outside production folders (`_prototype`, `_unused`, `_deprecated`).
5. **One place to rename** — When a file moves or is renamed, update **`src/content/manifests/assetPaths.js`** only (plus move the file on disk). Asset IDs in `assets.js` stay unchanged unless you intentionally deprecate an ID.

---

## Folder hierarchy

All game assets live under `public/assets/`.

```
public/assets/
├── backgrounds/          # VN / chat / RPG stage backdrops
│   ├── shared/           # Reused across chapters (office, meeting room, …)
│   └── ch02/             # Chapter-scoped backgrounds (add ch03/, ch04/, …)
├── portraits/            # Character bust / expression layers (VN)
│   ├── groomy/
│   ├── iseol/
│   └── choi/
├── cg/                   # Full-screen event illustrations (future)
│   └── ch02/
├── effects/
│   └── overlays/         # Scanlines, glitch, screen treatments
├── maps/
│   └── tilesets/         # RPG tile sheets per map / chapter
│       └── ch02/
├── sprites/
│   ├── player/
│   └── npc/
├── intro/                # Boot / title sequence (pre-game)
├── audio/
│   ├── sfx/
│   └── ambient/
├── ui/                   # In-game UI chrome (future)
├── marketing/            # Steam capsules, key art (future; not loaded in-game)
├── fonts/                # Web fonts / bitmap fonts (future)
├── _prototype/           # Work-in-progress; never referenced by manifest
├── _unused/              # Retired but kept for reference
└── _deprecated/          # Old paths kept briefly after moves (optional)
```

**Not under `assets/`:** `public/favicon.svg` (site icon).

---

## Naming convention

### General rules

| Rule | Example |
|------|---------|
| Lowercase | `meeting_room.png` |
| snake_case | `floor5_audit.png` |
| Descriptive subject + variant | `groomy_smile.png`, `office_default.png` |
| Chapter prefix when scoped | Folder `backgrounds/ch02/` + file `lobby.png` |
| No version suffixes | Avoid `lobby_v3_final.png` |

### By category

| Category | Pattern | Example path |
|----------|---------|--------------|
| Shared background | `backgrounds/shared/{location}.png` | `backgrounds/shared/meeting_room.png` |
| Chapter background | `backgrounds/ch{N}/{location}.png` | `backgrounds/ch02/lobby.png` |
| Portrait expression | `portraits/{character}/{expression}.png` | `portraits/iseol/warn.png` |
| Overlay effect | `effects/overlays/{name}.png` | `effects/overlays/glitch_soft.png` |
| Tileset | `maps/tilesets/ch{N}/{map}.png` | `maps/tilesets/ch02/floor5.png` |
| Player sprite | `sprites/player/{variant}.png` | `sprites/player/default.png` |
| NPC sprite | `sprites/npc/{role}.png` | `sprites/npc/guard.png` |
| Event CG | `cg/ch{N}/{event}.png` | `cg/ch04/truth_reveal.png` |
| Intro slide | `intro/scene{N}_{description}.png` | `intro/scene1_office_door.png` |
| SFX | `audio/sfx/{name}.ogg` | `audio/sfx/chat_ping.ogg` |
| Ambient | `audio/ambient/{name}.ogg` | `audio/ambient/office_hum.ogg` |

---

## Code registration (three layers)

```
assetPaths.js   →  canonical file URLs (ONLY place paths appear)
assets.js       →  stable asset IDs → paths + metadata (width, type)
chapter-XX/assets.js  →  semantic aliases for content authors (bg.lobby → ID)
```

### Adding a new image

1. Place the file in the correct folder with the naming convention.
2. Add the path to `src/content/manifests/assetPaths.js`.
3. Register an ID in `src/content/manifests/assets.js`.
4. Reference the ID from the chapter bundle (`chapter-03/assets.js`) or scene data.
5. Run `npm test` — `assetManifestPaths.test.js` verifies every registered path exists on disk.

### Legacy asset IDs

Some IDs predate character renames (e.g. `portrait_kim_*` maps to iseol art, `portrait_unknown_*` maps to groomy art). **Do not rename IDs** unless migrating saves/content; update paths in `assetPaths.js` when art is replaced.

---

## Chapter asset bundles

Each chapter may export a small alias map in `src/content/chapters/chapter-XX/assets.js`. Scenes use `ASSETS.bg.lobby`, not raw IDs or paths.

When adding a new chapter, create scoped folders under `backgrounds/chXX/`, register IDs, and add a chapter `assets.js` bundle.

---

## Temporary and non-production assets

| Folder | Use |
|--------|-----|
| `_prototype/` | Experiments, greyboxes, artist WIP — never register in manifest |
| `_unused/` | Files removed from game but kept in repo |
| `_deprecated/` | After a move, optional copy of old path during transition |

Silent audio placeholders (`*_silent.ogg`) are production-registered stubs until real audio ships.

---

## Duplicate audit (2026-07)

| Finding | Action taken |
|---------|--------------|
| `cg/ch02_*.png` used as VN backgrounds | Moved to `backgrounds/ch02/` (same pixels, correct category) |
| `portraits/kim/` used for iseol | Renamed folder to `portraits/iseol/`; IDs unchanged |
| `portraits/unknown/` used for groomy | Renamed to `portraits/groomy/` |
| `portrait-unknown-base.png` vs `groomy/smile.png` | Not duplicates — base layer vs expression |
| `public/icons.svg` | Unreferenced; moved to `_unused/` |
| `player_ch02.png` | Renamed to `sprites/player/default.png` |

No image bytes were modified, merged, or recompressed.

---

## Validation

```bash
npm test   # includes assetManifestPaths.test.js
npm run assets:placeholders
```

---

## Quick reference

| Adding… | Put it in… |
|---------|------------|
| Shared office BG | `backgrounds/shared/` |
| CH4-only server room BG | `backgrounds/ch04/` |
| Groomy angry face | `portraits/groomy/angry.png` |
| Key story illustration | `cg/ch04/…` |
| RPG floor tile sheet | `maps/tilesets/ch04/…` |
| Steam header | `marketing/…` (future) |
| Artist sketch | `_prototype/` |
