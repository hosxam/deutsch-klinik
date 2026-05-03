#!/usr/bin/env node
/**
 * Generate listening audio files using Piper TTS.
 *
 * Usage (dry-run, shows what would be generated):
 *   node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2
 *
 * Usage (write mode, generates files + updates JSON):
 *   node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2 \
 *     --model D:/piper/de_DE-thorsten_emotional-low.onnx --write
 *
 * Requirements:
 *   - piper.exe available on PATH or via --piper-path
 *   - ffmpeg available on PATH or via --ffmpeg-path
 *   - A Piper German voice model .onnx file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Config ---
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'listening.json');
const AUDIO_OUT_DIR = path.join(PROJECT_ROOT, 'public', 'audio', 'listening');

// --- Parse args ---
const args = process.argv.slice(2);

function getArg(name, defaultVal) {
  const idx = args.indexOf(name);
  if (idx === -1) return defaultVal;
  const val = args[idx + 1];
  if (val && !val.startsWith('--')) return val;
  return defaultVal;
}

const LEVEL = getArg('--level', null);
const LIMIT = parseInt(getArg('--limit', '2'), 10);
const WRITE = args.includes('--write');
const FORCE = args.includes('--force');
const DRY_RUN = !WRITE;
const PIPER_PATH = getArg('--piper-path', 'piper').replace(/\\/g, '/');
const FFMPEG_PATH = getArg('--ffmpeg-path', 'ffmpeg').replace(/\\/g, '/');
const MODEL_PATH = getArg('--model', null);

// --- Help ---
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Generate listening audio files using Piper TTS.

Usage:
  node scripts/generate-listening-audio-piper.cjs [options]

Options:
  --level LEVEL       Level to process (e.g. A1, A2). Required.
  --limit N           Number of items to generate (default: 2).
  --write             Actually write files and update JSON. Without this, runs dry.
  --force             Regenerate files even if they already exist and data points to them.
  --model PATH        Path to Piper German voice .onnx model. Required for --write.
  --piper-path PATH   Path to piper executable (default: "piper").
  --ffmpeg-path PATH  Path to ffmpeg executable (default: "ffmpeg").
  --help              Show this help.

Examples:
  node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2
  node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2 \\
    --model D:/piper/de_DE-thorsten_emotional-low.onnx --write
  node scripts/generate-listening-audio-piper.cjs --level A1 --limit 2 --write \\
    --model D:/piper/de_DE-thorsten_emotional-low.onnx \\
    --piper-path D:/piper/piper.exe \\
    --ffmpeg-path C:/Users/ASUS/ffmpeg/ffmpeg.exe --force
`);
  process.exit(0);
}

// --- Validate ---
if (!LEVEL) {
  console.error('ERROR: --level is required. Use --help for usage.');
  process.exit(1);
}

if (WRITE && !MODEL_PATH) {
  console.error('ERROR: --model is required when using --write.');
  process.exit(1);
}

// --- Load data ---
let data;
try {
  data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
} catch (e) {
  console.error('ERROR: Could not read listening data:', e.message);
  process.exit(1);
}

const items = data[LEVEL];
if (!items || !Array.isArray(items)) {
  console.error(`ERROR: Level "${LEVEL}" not found in listening data.`);
  process.exit(1);
}

const toGenerate = items.slice(0, LIMIT);

// --- Check tools ---
function checkTool(name, toolPath) {
  // ffmpeg 8.x uses -version (single dash); piper --version (double dash)
  const isFfmpeg = toolPath.toLowerCase().includes('ffmpeg');
  const versionFlag = isFfmpeg ? '-version' : '--version';
  try {
    const result = execSync('"' + toolPath + '" ' + versionFlag, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 5000 });
    return result && result.length > 0;
  } catch (e) {
    // Some builds (like ffmpeg 8.1) exit non-zero but output version to stderr
    const combined = (e.stdout || '') + (e.stderr || '');
    if (combined.includes('version') || combined.includes('ffmpeg')) return true;
    return false;
  }
}

const piperOk = checkTool('piper', PIPER_PATH);
const ffmpegOk = checkTool('ffmpeg', FFMPEG_PATH);

if (!fs.existsSync(AUDIO_OUT_DIR)) {
  fs.mkdirSync(AUDIO_OUT_DIR, { recursive: true });
}

// --- Generate ---
console.log(`\n=== Listening Audio Generator ===`);
console.log(`Level: ${LEVEL}`);
console.log(`Items to process: ${toGenerate.length} (out of ${items.length})`);
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no files written)' : 'WRITE MODE'}`);
console.log(`Force: ${FORCE ? 'yes (regenerate existing files)' : 'no (skip existing)'}`);
console.log(`Piper: ${piperOk ? 'yes' : 'NOT FOUND'} (binary: ${PIPER_PATH})`);
console.log(`ffmpeg: ${ffmpegOk ? 'yes' : 'NOT FOUND'} (binary: ${FFMPEG_PATH})`);
console.log(`Model: ${MODEL_PATH || '(not set)'}`);
console.log(`Audio output dir: ${AUDIO_OUT_DIR}`);
console.log('');

let generated = 0;
let skipped = 0;

toGenerate.forEach((item, idx) => {
  const levelKey = LEVEL.toLowerCase();
  const num = items.indexOf(item) + 1;
  const filename = `${levelKey}-listen-${num}.mp3`;
  const dataKey = `audio/listening/${filename}`;
  const outPath = path.join(AUDIO_OUT_DIR, filename);
  const wavTemp = outPath.replace(/\.mp3$/, '.wav');

  console.log(`[${idx + 1}/${toGenerate.length}] ${item.id}: "${item.title}"`);
  console.log(`  → ${dataKey}`);

  // --- Check if already exists (skip unless --force) ---
  if (!FORCE && fs.existsSync(outPath) && item.audio === dataKey) {
    console.log(`  SKIP: file exists and data already points to it. Use --force to regenerate.`);
    skipped++;
    return;
  }

  if (!WRITE) {
    console.log(`  (dry-run, would generate from script snippet: ${item.script.substring(0, 60)}...)`);
    if (fs.existsSync(outPath)) {
      console.log(`  [existing file would be overwritten with --write --force]`);
    }
    generated++;
    return;
  }

  // --- Generate WAV via Piper ---
  if (!piperOk) {
    console.error(`  FAIL: Piper not found at "${PIPER_PATH}". Skipping.`);
    skipped++;
    return;
  }

  try {
    console.log(`  Generating via Piper...`);
    // Write script to temp file to avoid Windows echo/pipe issues with special characters
    const tempScript = path.join(PROJECT_ROOT, 'public', 'audio', 'listening', `_temp_${item.id}.txt`);
    fs.writeFileSync(tempScript, item.script, 'utf8');
    const piperCmd = '"' + PIPER_PATH + '" --model "' + MODEL_PATH + '" --output_file "' + wavTemp + '" < "' + tempScript + '"';
    execSync(piperCmd, { encoding: 'utf8', stdio: 'pipe', timeout: 60000 });
    if (fs.existsSync(tempScript)) fs.unlinkSync(tempScript);
    console.log(`  WAV generated.`);
  } catch (e) {
    console.error(`  FAIL: Piper generation error:`, (e.stderr || e.message).toString().substring(0, 300));
    // Clean up temp script and partial WAV
    const tempScript = path.join(PROJECT_ROOT, 'public', 'audio', 'listening', `_temp_${item.id}.txt`);
    if (fs.existsSync(tempScript)) fs.unlinkSync(tempScript);
    if (fs.existsSync(wavTemp)) fs.unlinkSync(wavTemp);
    skipped++;
    return;
  }

  // --- Convert to MP3 via ffmpeg ---
  if (ffmpegOk) {
    try {
      console.log(`  Converting to MP3 via ffmpeg...`);
      execSync(
        `"${FFMPEG_PATH}" -y -i "${wavTemp}" -codec:a libmp3lame -b:a 48k "${outPath}"`,
        { encoding: 'utf8', stdio: 'pipe', timeout: 30000 }
      );
      fs.unlinkSync(wavTemp); // Remove temp WAV
      console.log(`  MP3 done.`);
    } catch (e) {
      console.error(`  FAIL: ffmpeg conversion error:`, (e.stderr || e.message).toString().substring(0, 300));
      console.log(`  Keeping WAV as fallback: ${wavTemp}`);
      skipped++;
      return;
    }
  } else {
    // No ffmpeg, keep WAV as-is
    fs.renameSync(wavTemp, outPath.replace(/\.mp3$/, '.wav'));
    console.log(`  No ffmpeg found, kept as WAV.`);
  }

  // --- Verify output ---
  if (fs.existsSync(outPath)) {
    const stats = fs.statSync(outPath);
    console.log(`  OK: ${(stats.size / 1024).toFixed(1)} KB`);
    generated++;
  } else {
    console.error(`  FAIL: Output file not found after generation.`);
    skipped++;
    return;
  }

  // --- Update JSON data ---
  const oldAudio = item.audio || '(none)';
  item.audio = dataKey;
  console.log(`  Updated audio: ${oldAudio} → ${dataKey}`);
});

// --- Save updated data ---
if (WRITE && generated > 0) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`\nSaved updated listening.json with ${generated} new audio paths.`);
}

// --- Summary ---
console.log(`\n=== Summary ===`);
console.log(`Generated: ${generated}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total items in ${LEVEL}: ${items.length}`);

if (DRY_RUN) {
  console.log(`\n⚠️  Dry-run only. To generate, add --write and --model path/to/german-voice.onnx`);
}

if (!piperOk) {
  console.log(`\n⚠️  Piper not found at "${PIPER_PATH}". Install from: https://github.com/rhasspy/piper/releases`);
  console.log(`   Or use --piper-path to point to the executable location.`);
  console.log(`   Also need a German voice model (.onnx + .json).`);
}

if (!ffmpegOk) {
  console.log(`\n⚠️  ffmpeg not found at "${FFMPEG_PATH}". Install from: https://ffmpeg.org/download.html`);
  console.log(`   On this machine it's at: C:/Users/ASUS/ffmpeg/ffmpeg.exe`);
  console.log(`   Use: --ffmpeg-path C:/Users/ASUS/ffmpeg/ffmpeg.exe`);
}
