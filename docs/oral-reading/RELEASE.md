# Oral reading recordings — 11 October 2026

## Accepted scope and status

The parent requested Azure integration to upload a recording plus its passage and retain results for progress assessment, including speed, errors and uncertainty indicators. The parent has no Azure Speech resource yet and requested setup instructions and pricing.

Implemented and locally tested; deployment verification is recorded below when completed. Real Azure recognition and physical iPad audio decoding are unverified until credentials and a real recording are available. No paid assessment has been made.

## Parent workflow

Parents → Overview → Reading recordings opens `assets/oral-reading/`. Use the same browser/storage context as the paired learner game; this release does not give another computer access to the learner's pairing. Upload an existing M4A/MP3/WAV supported by the browser, paste the exact attempted excerpt (3–500 English words), and supply recording date, optional title/notes, help and reread flags. Maximum 180 seconds / 20 MB. Audio is decoded locally and resampled to mono 16 kHz PCM WAV.

The server exchanges its private Azure key for a ten-minute Speech token only after device authentication. The browser sends the audio and reference to Azure using the pinned official Microsoft Speech SDK 1.52.0 in continuous mode. The long-lived Azure key never goes to the browser. Paid prosody is off. en-GB is the default; en-US is available. No microphone permission is needed.

Completed results are queued separately from the playable save, then sent to the existing sync service. Retries of saving a completed result do not call Azure again. A failed Azure assessment is not saved as success. The UI provides a result-file backup, recent synced summaries and local timed playback while the original audio remains selected. The original audio is not retained in BlitzWord's server or local queue; the parent should keep it for later review.

## Metrics and interpretation

- Sequence alignment of normalized recognized words against the passage records matches, substitutions, omissions and insertions. Unread passage endings count as omissions; paste only the intended excerpt.
- Estimated correct WPM = matched reference words / elapsed time from first recognized word to last word end, including internal pauses but excluding leading/trailing silence.
- Word-match percentage uses the entire supplied reference as denominator. It is NOT a validated oral-reading accuracy score.
- Per-word Azure pronunciation scores below 60 or Mispronunciation labels are separate listening-review flags; they do not automatically reduce word matches. Accent/recognition issues can otherwise look like reading errors.
- Gaps of at least 2 seconds are timestamped observations, not proof of uncertainty. Punctuation pauses are included. Repetitions/self-corrections can appear as insertions or be suppressed by recognition; no reliable self-correction detector is claimed.
- Every report says `automated-unreviewed`, retains source/version, recording duration/date/hash, context, timing, alignment and limitations. Browser SDK submissions are authenticated but are not cryptographically signed Azure results.
- No child rewards, curriculum, difficulty, time totals, saves, or gameplay progress are changed.

## Owner review / sync visibility

Use authenticated Sites database tools on the existing project/binding `DB`. Read `oral_attempts` for complete summaries, then reassemble `oral_parts` by `(device_id, assessment_id)` ordered by `part`. Each part is at most 900 characters. Require the declared number of parts before interpreting the JSON. These rows are independent of snapshot projections: subsequent game uploads cannot erase oral reports. Compare first-read, unaided samples with similar passages; keep helped/reread samples separate. Check the recording date versus server creation time.

All endpoints are scoped to the existing paired device token. The status route returns only that device's latest 25 summaries. Existing public site audience and owner-only tool access are unchanged. No unauthenticated learner read route exists. Deleting shared progress also removes attempts, parts and quotas. Ten token starts/device/UTC day are enforced atomically; short-lived Azure tokens themselves are not restricted to one recording, so this is not a hard financial cap. Use a dedicated Speech resource and Azure budget alerts if using paid S0.

## Azure setup

1. Open https://portal.azure.com and create a **Speech** resource in an available region supporting pronunciation assessment, for example Southeast Asia (`southeastasia`). Choose **Free F0** if available; otherwise check the standard pay-as-you-go price before selecting S0.
2. On the resource's **Keys and Endpoint**, obtain its key and region. Keep them out of GitHub, screenshots, browser code and the playable save.
3. Configure the existing Sites progress service's server environment through native Sites environment tools: `AZURE_SPEECH_KEY` (secret) and `AZURE_SPEECH_REGION`. Preserve `ADMIN_KEY` and every existing environment value. Redeploy the same backend version to apply the environment change.
4. Reload Reading recordings. Verify its connected/ready status, submit one clear sample, listen to flagged words, then verify complete `oral_parts` through Sites tools before relying on trend comparisons.

## Cost estimate

Checked 11 October 2026. Azure's published free tier includes 5 audio hours/month. Basic pronunciation assessment is priced as standard real-time Speech to Text. The official Azure Retail Prices API for Southeast Asia returned `S1 Speech To Text`: USD 1 / hour, and `S1 Speech to Text Enhanced Feature Audio`: USD 0.30 / hour. Enhanced prosody is **not enabled** in this release.

At the USD 1/hour paid rate: two minutes = about USD 0.033; 30 two-minute recordings = USD 1.00/month. Those 60 minutes are within the free-tier allowance if F0 is available and not used by other activity. Retries involving another recognition run cost again; retrying only the sync does not. Region/currency/tax changes, other subscription usage and any separate hosting charges are excluded. No new hosting provider is introduced.

Sources:
- https://azure.microsoft.com/en-us/pricing/details/speech/
- https://prices.azure.com/api/retail/prices?$filter=contains(productName,%27Speech%27)%20and%20armRegionName%20eq%20%27southeastasia%27
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short#authentication

## Validation

413 unit/backend tests and 123 existing UI-flow groups pass. Added checks cover word alignment, timing denominators, pause flags, accent-score separation, bounds, no-speech rejection, shared browser/server analysis, authentication, missing configuration, immutable retries, bounded reconstruction, quota and deletion.

Isolated Chrome tests passed at 1194×834 and 390×844: unpaired/configuration states, actual SDK configuration, mocked recognition through real WAV decoding, failed-save persistence across reload, retry without another Azure call, history display, no page exceptions and no page overflow. Screenshots were inspected. These are integration simulations, not evidence of Azure recognition accuracy or physical iPad compatibility.

Backend source is maintained in `sync-service/`; append-only migration 0005 adds oral tables. Browser/server analysis copies must match (enforced by test). SDK MIT license is retained in `assets/oral-reading/vendor/LICENSE`; bundle source is the npm `microsoft-cognitiveservices-speech-sdk@1.52.0` package. Run the full repository tests before release.
