# Listening Audio Generation Plan

## Current Status

Two A1 listening items have sample audio files:
- `public/audio/listening/a1-listen-1.mp3` (English-accented, infrastructure test only)
- `public/audio/listening/a1-listen-2.mp3` (English-accented, infrastructure test only)

These prove the audio infrastructure works. They are NOT production quality.

Audio paths in `src/data/listening.json` use clean relative paths:
```json
"audio": "audio/listening/a1-listen-1.mp3"
```
The app's `resolveAudioPath` helper resolves them at runtime using `import.meta.env.BASE_URL`.

## Why Windows SAPI Is Blocked

Windows `System.Speech` on this machine only has two voices:
- `Microsoft David Desktop` -- en-US
- `Microsoft Zira Desktop` -- en-US

No German (de-DE) voice is available. Even after adding a German voice via Windows Settings (`Time & Language > Speech > Add voices > German (Germany)`), the voice may be installed as a OneCore voice which is NOT accessible to `System.Speech.SpeechSynthesizer` (the COM-based SAPI interface used by the `say` npm package). OneCore voices are only usable through `Windows.Media.SpeechSynthesis` UWP API, which requires a C#/WinRT caller. There is no reliable Node.js path to access them.

**Result:** `npm install say` + `.export()` is not a viable path for German audio generation on this machine.

## Approved Generation Options

### Option A (Recommended): Piper TTS (free, local, offline)

Piper is a fast, local neural TTS engine with high-quality German voices.

**Installation Steps**

1. Download piper for Windows from: https://github.com/rhasspy/piper/releases
   - Get `piper_windows_amd64.zip` from the latest release
   - Extract to a folder, e.g. `D:/piper/`

2. Download a German voice model:
   - `de_DE-thorsten_emotional-low` (recommended, male, high quality)
   - Or `de_DE-kerstin-low` (female)
   - Download the `.onnx` file AND the `.json` config file to the same folder

3. Run the generator script (dry-run first):
```
node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2
```

4. Regenerate 2 sample files with explicit paths and forced overwrite:
```
node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2 --write --force ^
  --model D:/piper/de_DE-thorsten_emotional-low.onnx ^
  --piper-path D:/piper/piper.exe ^
  --ffmpeg-path C:/Users/ASUS/ffmpeg/ffmpeg.exe
```

If using PowerShell, escape the `^` or use a single line:
```
node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2 --write --force --model D:/piper/de_DE-thorsten_emotional-low.onnx --piper-path D:/piper/piper.exe --ffmpeg-path C:/Users/ASUS/ffmpeg/ffmpeg.exe
```

The script will:
- Generate WAV files from each listening item's `script` text
- Convert to MP3 using ffmpeg (at 48kbps)
- Save to `public/audio/listening/`
- Update `src/data/listening.json` with the `audio` paths
- Show progress and file sizes

**Voice options:**
- `de_DE-thorsten_emotional-low` (free, high quality German male voice, ~40 MB model)
- `de_DE-thorsten-glow-tts` (alternative)
- `de_DE-kerstin-low` (free, German female voice)

**Pros:** Fully local, offline, no API costs, high quality, fast, supports batch generation.
**Cons:** Requires downloading external binary and model files (~80-120 MB total).

**Existing tools on this machine:**
- ffmpeg: available at `C:\Users\ASUS\ffmpeg\ffmpeg.exe` (not on PATH)

### Option B: Browser speechSynthesis + MediaRecorder Capture (possible, less reliable)

Chrome/Edge on Windows has access to system OneCore voices (including German) through the Web Speech API, even though System.Speech doesn't see them.

**Approach:** Load the page in a headless or automated browser, capture audio via MediaRecorder, save as WebM/MP3.

**Pros:** Uses voices already on the system.
**Cons:** Complex automation, inconsistent output quality, no direct file output, playback timing issues.

**Not recommended for bulk generation.**

### Option C: Paid API (future, requires approval)

- Google Cloud Text-to-Speech (Wavenet voices, ~$4/million chars)
- Amazon Polly (neural voices, ~$4/million chars)
- ElevenLabs (high quality, $5-22/month)

**Not approved yet.** Use only if Piper quality is insufficient.

## Generator Script

File: `scripts/generate-listening-audio-piper.cjs`

Usage:
```
# Dry run (shows what would be generated, no files written):
node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2

# Help:
node scripts/generate-listening-audio-piper.cjs --help
```

The script is a clean-room generator. It:
- Reads `src/data/listening.json`
- Filters by `--level` and `--limit`
- Generates WAV via Piper, converts to MP3 via ffmpeg
- Skips items that already have matching audio files
- Only writes to JSON with `--write`

## File Naming Convention

```
public/audio/listening/{level}-listen-{number}.mp3
```

Examples:
- `a1-listen-1.mp3` (A1, exercise index 0)
- `a1-listen-2.mp3` (A1, exercise index 1)
- `a2-listen-1.mp3` (A2, exercise index 0)
- `b1-listen-15.mp3` (B1, exercise index 14)

Numbers are 1-based (exercise array index + 1).

## JSON Data Convention

In `src/data/listening.json`, each item can have an optional `audio` field:

```json
{
  "id": "A1_listen_1",
  "title": "Telefonansage - Sprechstunde",
  "script": "Willkommen bei der Praxis Dr. Meier...",
  "audio": "audio/listening/a1-listen-1.mp3",
  "questions": [...]
}
```

Paths are **relative**, not absolute. The app's `resolveAudioPath` helper prepends the Vite base URL at runtime.

## Critical Warnings

1. **DO NOT** bulk-add audio paths to listening data until audio files exist and playback is tested on each one.
2. **DO NOT** generate audio for B2/C1 levels without explicit approval (vocabulary metadata must not be touched).
3. **DO NOT** use paid APIs without approval.
4. **DO NOT** delete the current 2 MP3 sample files until real German replacements exist -- they prove end-to-end infrastructure.
5. **Test one file at a time.** Add audio to one item, build, verify the page uses HTML audio controls and the source badge shows "Audio file". Then batch the rest.

## Implementation Checklist

- [ ] Install Piper TTS (Windows binary + German voice model)
- [ ] Generate a1-listen-1.mp3 with real German voice
- [ ] Test in dev: check HTML audio controls appear, source badge shows "Audio file"
- [ ] Test invalid file fallback: rename the file, verify TTS fallback triggers
- [ ] Regenerate all A1 listening files (50 items)
- [ ] Add audio paths to all A1 items
- [ ] Build and deploy
- [ ] Repeat for A2, B1 (if approved)
