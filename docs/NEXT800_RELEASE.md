# Next 800 words — 9 October 2026

Build: `next800-20261009-r1`. Deployed and verified: [PR #148](https://github.com/Ikarus-eth/Blitzword_app/pull/148), [successful Pages run](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37869725442). Six live files match the tested release byte-for-byte ([verification record](NEXT800_DEPLOYMENT.json)). A live isolated Chrome teaching/reload/Continue check also passed at 1180×820.

## Scope

The existing 200 targets are followed by exactly 800 distinct additions for broad beginner-book reading. The parent's accepted scope includes everyday words and written numbers; stories remain separate work. Existing Core 200 chapter assignments, illustrations, recorded narration and learner evidence are retained. The original workbook remains a provenance reference, not the updated runtime source.

The revised pool retains 457 forms from the workbook's expansion and adds 343 editorial selections. It includes sentence-building words, useful verb forms, contractions, home/school vocabulary, feelings, nature and adventure words. Combined number coverage is zero–twenty, tens through ninety, hundred, thousand and first–tenth, plus quantity/maths language. Recognition of 1,000 words is not a guarantee of independent book reading; see the [research and its evidence limits](NEXT800_FIRST_BOOKS_RESEARCH.md).

## Learning implementation

- All 800 have an authored example sentence containing the target, five distractors supporting rotating fair sets, and a short spelling, meaning or word-family prompt. The first 40 prioritise common sentence words, numbers and everyday vocabulary; subsequent words interleave the research groups. Batches of 100 organise the parent view, not learner gates.
- Existing adaptive scheduling introduces the expansion after earlier words become familiar, with due reviews retained. It works in both shared reading-fight modes without new story gates or reward changes. Automated play reaches every new word after the original 200 are familiar.
- Expansion teaching cards highlight the target in a sentence, show its spelling and tip, and provide word/tip/sentence listening. Number cards show numerals and counters for 0–20, ordinal symbols or relevant maths symbols. No image loading is required. Other cards use text; no new illustrations were generated.
- Existing recordings are reused where available; new text uses the current browser/device speech fallback. Ambiguous words such as live, wind, close and lead are spoken in their sentence context. Voice quality depends on the selected device voice. No paid external generation calls or new recorded files were used, and no physical iPad listening audit is claimed.
- Parents lists and searches all 1,000, including case-insensitive searches for capitalised days and contractions. Existing saved `sat` evidence remains; its new playable definition takes precedence over the compatibility-only legacy definition.

## Save compatibility

On-device schema 3 uses lossless row tables to avoid repeating word/event field names. Runtime objects and exported backup files remain ordinary schema-2 JSON. Loading supports existing saves, the new compact form, nulls/custom fields and pending questions. The existing conflict detection, backup recovery and quota safeguards remain.

The long-run regression simulates 90 days at 45 minutes/day with more than 20,000 reading answers. Encoded daily saves remain below one million characters, while retained history limits and lifetime totals are preserved. Any later rollback must retain the schema-3 decoder; do not deploy an older storage/core pair over newly written saves.

## Sources and regeneration

- `curriculum/NEXT800_FIRST_BOOKS.json`: accepted research pool and grouping.
- `curriculum/next800-sentences.txt`: 800 authored examples.
- `scripts/build-next800.cjs`: deterministic offline compiler, teaching rules and distractor selection.
- `curriculum/next800-real-options.json`: small selected-spelling lexicon used for portable regeneration.
- `curriculum/next800-content.json`: readable compiled records, embedded in `content.js` for deployment.

Run `node scripts/build-next800.cjs` and `npm test` to rebuild and validate. Regeneration was checked byte-for-byte. Distractor checks enforce at least two fair sets per word, rotation, shape/length similarity, blocked-word filtering and no one-letter giveaway. These are automated checks, not a claim that a child has playtested every pool.

## Verification

All 332 unit tests and 112 UI flow groups pass, including 11 expansion lesson cases. Coverage includes original content, fair choices, all 800 reachable, device-speech fallback/cancellation, old saves, pending choices, backup/restore, conflict handling, number support, capitals/contractions, legacy `sat`, story allocation and long-run storage size.

Isolated Chrome checks at 1180×820, 390×844 and 844×390 verify teaching, reload, Continue, no horizontal overflow and no page errors. Screenshots were visually inspected. Physical iPad behaviour and actual child pacing remain unverified.
