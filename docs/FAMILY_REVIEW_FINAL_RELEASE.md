# Complete family art review — 26 September 2026

Build `family-review-complete-20260926-r4` completes all 26 rounds: 20 enemies and six hero appearances, each with its current design and five whole-body alternatives. All 156 images are included in the static gallery and do not require a local import. The latest user instruction to do what is needed to finalize the dashboard follows the explicit report of six absent images. This release fills only those six gaps with new review concepts: girl-archer A–E and girl-mage E. These concepts do not approve or replace production character artwork.

## Artwork and continuity

- Keep the existing 31 published designs. Publish the 95 recovered enemy alternatives and 24 hero alternatives in the same slots used by the verified local review. Two spare boy archers remain in the user's local archive, outside the five-alternative rounds.
- New concept prompts and reference roles are in [the prompt record](FAMILY_REVIEW_FINAL_PROMPTS.json). Generation used the built-in image tool. Original outputs are preserved in the user's workspace; native-dimension WebP versions are published for fast loading. No crop or redraw is applied to recovered originals.
- [The publication manifest](../assets/family-review/publication.json) records every original and published SHA-256, dimensions, source category and mapping. The 125 added web images total 33.66 MiB, compared with 269.24 MiB for their originals.
- Recovered option letters are stable review assignments, not recovered historical generation order. Boy-archer A is the exact source image separately preserved in PR #99.

## Saved reviews and backup

The four reviewers remain Artus, Juna, Johanna and Ikarus. Rating keys, reviewer order, comments, original imported blobs and game storage remain intact. When a stored original matches the newly published image hash, the gallery shows the public web version in that same slot. A different local assignment remains visible with its original ratings and a clear local-version note, preventing publication from silently transferring scores to another picture.

Full ZIP backups from before publication can still restore matching originals and feedback. Differing local alternatives also retain their image/score association; the approved current-design slots cannot be overwritten. Feedback exports now identify the images being rated. Import and backup tools are collapsed by default, and published copies are omitted from the extra-candidate preview list while remaining in full backups.

Artwork is available on every device. Feedback remains local to each browser; use Download review and Restore backup to move it. This is not automatic multi-device rating synchronization. Restoring feedback asks before replacing existing scores and comments.

## Validation and deployment

All 252 core/publication tests and 89 existing app-flow groups pass. Publication tests cover the 156-image catalog, exact web-asset hashes, matching and conflicting local image identities, old ZIP restore, feedback preservation and rejection of replacement current designs. All 133 unique referenced image files decode successfully. All six new full-body images were visually inspected.

The local browser preview was blocked because the browser tool could not verify its admin-enforced security policy. No alternate browser route was used to bypass that block. Public-page verification follows deployment. Physical iPad/Safari remains untested. Deployment verification is pending.
