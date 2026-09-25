# Family art review: local image imports

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

The source task is “tbd Generate Enemy Alternatives”. Its recent messages report that the missing generated batch lived in a lost remote workspace, while originals still appear in the user’s image gallery. The Mac folder `~/.codex/generated_images/` was checked: it contains generated files for other local Codex tasks, not that ChatGPT conversation’s batch. This is not evidence that no app cache exists; no usable directory containing that missing batch was found. Automated access to the app’s own gallery is blocked by the computer-use tool. This release enables import of accessible downloads and does not claim to have recovered the missing originals.

## Verification

`tests/family-review-imports.cjs` runs against a temporary local server and fresh browser profiles, using existing artwork as temporary test inputs. Set `PLAYWRIGHT_MODULE` to an installed Playwright package and optionally `CHROME_EXECUTABLE`; no production browser profile is used. Thirteen scenarios cover legacy feedback, named/generic/direct imports, byte-identical duplicate skipping, persistence, backup/restoration with exact hashes, interruption/resume, multiple tabs, malformed data, storage quota failure and responsive layout. The ZIP was also read independently with Python’s standard archive reader. The main regression suite passes 246 tests and all 89 existing UI-flow groups. Physical iPad/Safari remains untested.

Publication status is tracked in CURRENT_STATUS.md; deployed claims require a successful Pages run and live file verification.
