"""Generate one review sample, never bulk narration or a production update."""
import base64
import hashlib
import json
import os
from pathlib import Path
import sys
import urllib.error
import urllib.request

VOICE_ID = "onwK4e9ZLuTAKqWW03F9"
TEXT = "gate"
SETTINGS = {
    "stability": 0.75,
    "similarity_boost": 0.75,
    "style": 0.0,
    "use_speaker_boost": True,
    "speed": 0.88,
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def main():
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        raise SystemExit("ELEVENLABS_API_KEY is unavailable to this workflow.")
    out = Path("narration-sample")
    out.mkdir(exist_ok=True)
    audio_path = out / "BlitzWord_gate_Daniel.mp3"
    if audio_path.exists():
        raise SystemExit("A sample already exists; refusing duplicate generation.")
    payload = {
        "text": TEXT,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": SETTINGS,
        "seed": 20260923,
    }
    request = urllib.request.Request(
        "https://api.elevenlabs.io/v1/text-to-speech/"
        + VOICE_ID + "/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(payload).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"},
        method="POST",
    )
    # One paid request only. Do not retry ambiguous failures or log response bodies.
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=60) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        raise SystemExit(f"ElevenLabs returned HTTP {error.code}; no automatic retry.") from None
    except (urllib.error.URLError, TimeoutError):
        raise SystemExit("ElevenLabs request failed or timed out; no automatic retry.") from None
    audio_bytes = base64.b64decode(result["audio_base64"], validate=True)
    if len(audio_bytes) < 500:
        raise SystemExit("Response did not contain a usable audio sample.")
    audio_path.write_bytes(audio_bytes)
    metadata = {
        "text": TEXT,
        "voice_name": "Daniel - Steady Broadcaster",
        "voice_id": VOICE_ID,
        "model": payload["model_id"],
        "voice_settings": SETTINGS,
        "sha256": hashlib.sha256(audio_bytes).hexdigest(),
        "bytes": len(audio_bytes),
        "alignment": result.get("alignment"),
        "normalized_alignment": result.get("normalized_alignment"),
        "listening_review": "Pending user review; not deployed to the game.",
    }
    (out / "BlitzWord_gate_Daniel.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(f"Generated one {len(TEXT)}-character sample: {audio_path.name} ({len(audio_bytes)} bytes).")


if __name__ == "__main__":
    main()
