# Cheap image generation with fal.ai

The user supplied a repository secret for fal.ai on **3 October 2026**. The requested label was `fal_ai_API`; the secret actually present in GitHub Actions is **`AL_AI_API`** (without the initial F). `.github/workflows/mission-art.yml` maps this exact name into the server-side `FAL_KEY` environment variable. Never place its value in documentation, browser code, prompts, logs or committed files. No rename is required.

The **Generate mission illustrations with fal.ai** workflow is manually dispatched from Actions. It reads `docs/adventures/art-prompts.json` and runs `scripts/generate-mission-art.py`. Generation runs on GitHub, where the secret is available; the static game only serves reviewed image files and never calls fal.ai. The existing Pages deployment route is unchanged.

The initial model is [`fal-ai/nano-banana/edit`](https://fal.ai/models/fal-ai/nano-banana/edit), chosen for low-cost generation with character references. The published price checked on 3 October 2026 was **$0.039 per image**: twelve images estimate **$0.468**, excluding any account-specific billing differences. Verify pricing before commissioning another batch. This is an estimate, not an inspected invoice.

The first batch generated twelve 3:2 WebP scenes, one request per prompt and at most two requests concurrently. It finished successfully in [Actions run 37125039989](https://github.com/Ikarus-eth/Blitzword_app/actions/runs/37125039989). Reviewed production images are in `assets/adventures/`; source prompts and request IDs are in `docs/adventures/`.

The script uses the official [queue API](https://fal.ai/docs/documentation/model-apis/inference/queue) and [model schema](https://fal.ai/models/fal-ai/nano-banana/edit/api). It saves request IDs before polling. An uncertain or failed request is never automatically resubmitted. Downloaded images and request records are uploaded as an Actions artifact even on failure. **Do not blindly rerun a paid job**: inspect its saved requests and retrieve existing results first. Running the workflow again commissions a new complete batch. It does not automatically overwrite approved production assets or deploy them.

For later art: edit the reviewed prompt set and bounded script deliberately, keep current approved character references, generate to an artifact, inspect identity/composition and puzzle consistency, then commit only selected outputs through a normal PR. Add new enemies only after their identity and animation are approved; this release uses all twenty existing families.
