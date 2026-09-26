# Family art review: local image imports

**26 September update:** the complete gallery now includes all 156 images. The counts and local-only recovery steps below describe the earlier recovery milestone. See [the current release](FAMILY_REVIEW_FINAL_RELEASE.md).

Build `family-review-imports-20260925-r3` extends the existing [family review](https://ikarus-eth.github.io/Blitzword_app/assets/family-review/). The user requested bulk recovery/import of generated artwork without relying on a long-running chat. No artwork is generated or recreated in this release.

## Using it

1. Download originals from the source chat into a folder when available.
2. Open the dashboard in the browser where you want to review. Choose **Add images**, **Choose folder**, or drop image files on the import area. An empty card also has **Add image** for direct placement.
3. Each image is saved before the next starts. Re-selecting files skips identical content, so an interrupted batch can resume. **Stop after this file** preserves the completed files. PNG, JPG, WebP and GIF originals up to 30 MB / 32 megapixels are accepted; invalid files are reported individually.
4. Exact names such as `moss-golem-a.png` fill the matching empty slot. Other filenames appear in **Your imported images** with a preview and an enemy/hero + letter selector. Assignments are saved too. Moving a previously assigned image asks before clearing its old ratings. Published images cannot be replaced through this importer.
5. **Download full backup** saves a standard ZIP with `review.json` and every imported original in `images/`. **Restore backup** restores that ZIP, or an older feedback-only JSON. The ZIP can also be unpacked with a normal archive tool to recover the originals. Restore asks before replacing feedback and rejects conflicting assignments rather than attaching ratings to a different picture.

The top **Download review** control still exports the small ratings/comments JSON; use **Download full backup** when moving the image library to another browser or device.

## Durability and limits

- Original blobs, SHA-256 identifiers, filenames and assignments use IndexedDB `blitzword-family-art-images-v1`; the `images` store has a unique slot index. Completed file transactions survive a closed tab; unprocessed files must be selected again.
- Existing feedback remains under `blitzword-family-art-review-v2`, with the old Thornling migration preserved. Game storage is never accessed by the dashboard.
- Matching content is stored once. Automatic filename matching only fills empty alternatives; generic names are never guessed from generation order or visual similarity. A conflicting concurrent assignment is rejected.
- Browser storage permission is requested where supported, but storage is not a permanent archive: clearing site data, private browsing or browser eviction can remove it. Keep the full ZIP backup. No cloud sync, GitHub upload or cross-device sharing happens automatically.
- Backup creates stored ZIP entries from Blob chunks; restore reads the archive directory and one image at a time, checks CRC and SHA-256, and commits images individually. Completed images survive an interrupted restore; feedback is replaced only after all images succeed. ZIP64 and externally recompressed archives are not supported; use the original dashboard backup, under 4 GB.
- Storage errors are visible and never presented as successful imports. A downloadable error list identifies failed files. There is no model session or remote image upload request in this workflow.

## Recovery investigation

The source task is “tbd Generate Enemy Alternatives”. Its recent messages reported a lost remote workspace, while originals remained visible in the user’s gallery. The ordinary `~/.codex/generated_images/` folder held other local tasks, not the missing batch. Automated access to the app’s own gallery was blocked, but a read-only scan of `~/Library/Caches/Codex/Default/` found complete PNG payloads in the disk cache.

The recovery copied exactly the PNG signature through its IEND chunk, verified every chunk CRC, removed byte-identical duplicates by SHA-256, and preserved 163 unique originals. No signed source URLs or access signatures were retained. Visual inspection separated older concept art, sprite atlases, lineups and screenshots from 121 whole-body comparison candidates. Five recovered originals match the already-published Thornling alternatives and are omitted from the prepared import folder.

The prepared `ready-to-import` folder contains 95 enemy images, five per previously empty enemy family, plus 26 hero candidates (nine mage, ten knight, seven archer). Enemy filename labels A–E are newly assigned in a stable order after visual family identification, not a claim to recover historical generation labels. Hero images keep neutral filenames for manual assignment because original boy/girl/letter metadata is unavailable and some may be extra variants. Do not claim that every generated image or intended slot has been recovered.

The originals, galleries, manifests and prepared import folder were copied to `~/Downloads/BlitzWord-recovered-images-2026-09-25/`. They stay local; this release does not publish the recovered artwork or replace any production design. Choose the nested `ready-to-import` folder on the dashboard. Normal image import retains feedback; a full-backup restore separately asks before replacing it.

## Verification

`tests/family-review-imports.cjs` runs against a temporary local server and fresh browser profiles, using existing artwork as temporary test inputs. Set `PLAYWRIGHT_MODULE` to an installed Playwright package and optionally `CHROME_EXECUTABLE`; no production browser profile is used. Thirteen scenarios cover legacy feedback, named/generic/direct imports, byte-identical duplicate skipping, persistence, backup/restoration with exact hashes, interruption/resume, multiple tabs, malformed data, storage quota failure and responsive layout. The ZIP was also read independently with Python’s standard archive reader. The main regression suite passes 246 tests and all 89 existing UI-flow groups. Physical iPad/Safari remains untested.

Deployed through PR #100 and verified against all four live files. The actual 121-image recovery folder also passed a live-site import/reload check: 95 images assigned, 26 awaiting assignment, zero page errors. The measured import took 3.106 seconds in that isolated desktop browser. [Deployment and recovery test evidence](FAMILY_REVIEW_IMPORTS_DEPLOYMENT.json).
