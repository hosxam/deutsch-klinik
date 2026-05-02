import fs from 'fs';

// The mojibake was caused by a UTF-8 / Latin-1 double encoding.
// The file contains specific Unicode characters that render as corrupted text.
// We need to fix them at the post-parse level.

// First re-apply the level and lessonId fixes (safe to redo)
const validLessons = new Set(Array.from({length:25}, (_,i) => 'C1_lesson_' + (i+1)));

const readingLessonMap = {
  'C1_read_1': 'C1_lesson_3',
  'C1_read_2': 'C1_lesson_11',
  'C1_read_3': 'C1_lesson_3',
};

const listeningLessonMap = {
  'C1_listen_1': 'C1_lesson_3',
  'C1_listen_2': 'C1_lesson_6',
  'C1_listen_3': 'C1_lesson_3',
};

const writingLessonMap = {
  'C1_write_1': 'C1_lesson_1', 'C1_write_2': 'C1_lesson_13',
  'C1_write_3': 'C1_lesson_11', 'C1_write_4': 'C1_lesson_13',
  'C1_write_5': 'C1_lesson_6', 'C1_write_6': 'C1_lesson_1',
  'C1_write_7': 'C1_lesson_10', 'C1_write_8': 'C1_lesson_9',
  'C1_write_9': 'C1_lesson_1', 'C1_write_10': 'C1_lesson_3',
};

const speakingLessonMap = {
  'C1_speak_1': 'C1_lesson_14', 'C1_speak_2': 'C1_lesson_12',
  'C1_speak_3': 'C1_lesson_6', 'C1_speak_4': 'C1_lesson_13',
  'C1_speak_5': 'C1_lesson_14', 'C1_speak_6': 'C1_lesson_1',
  'C1_speak_7': 'C1_lesson_3', 'C1_speak_8': 'C1_lesson_8',
  'C1_speak_9': 'C1_lesson_8', 'C1_speak_10': 'C1_lesson_14',
};

function applyMetadata(file, lessonMap) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = data.C1 || [];
  items.forEach(v => {
    if (!v.level || v.level !== 'C1') v.level = 'C1';
    if (!v.lessonId) v.lessonId = lessonMap[v.id];
  });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// Apply level + lessonId first
applyMetadata('reading.json', readingLessonMap);
applyMetadata('listening.json', listeningLessonMap);
applyMetadata('writing.json', writingLessonMap);
applyMetadata('speaking.json', speakingLessonMap);
console.log('Applied level=C1 + lessonIds to all 4 files');

// Now fix mojibake at the byte level by reading the raw text.
// The corrupted sequence looks like: U+00C3 followed by specific high chars.
// In the JSON text these appear literally.

// The key insight: the file was written as UTF-8 bytes, then read as Latin-1/Windows-1252.
// ß (U+00DF) when encoded in UTF-8 is 0xC3 0x9F. Read as Latin-1: 0xC3=Ã, 0x9F=Ÿ
// Ä (U+00C4) when encoded in UTF-8 is 0xC3 0x84. Read as Latin-1: 0xC3=Ã, 0x84=„
// Ö (U+00D6) when encoded in UTF-8 is 0xC3 0x96. Read as Latin-1: 0xC3=Ã, 0x96=–
// Ü (U+00DC) when encoded in UTF-8 is 0xC3 0x9C. Read as Latin-1: 0xC3=Ã, 0x9C=œ

// Solution: read the file as bytes, do byte-level replacements, write back.
// But we need to do this carefully to only affect C1 content.

// Only fix mojibake that exists inside C1 sections of each file.
// We'll parse, fix, and re-serialize (which is safe since JSON.stringify uses UTF-8).

['reading.json','listening.json','writing.json','speaking.json'].forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = data.C1 || [];
  
  // The JSON parser decodes the file correctly. In the parsed JS objects,
  // the corrupted chars appear as specific Unicode codepoints.
  // We need to map them to their correct equivalents.
  
  // Build a map of mojibake -> correct by checking each string field
  let mojifixed = 0;
  
  function fixStrings(obj) {
    if (!obj) return;
    if (typeof obj === 'string') {
      return; // We'll mutate the parent object's property
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => fixStrings(item));
      return;
    }
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'string') {
        // Find all mojibake patterns and check what they should be
        const orig = obj[k];
        const replacements = {
          // The corrupted pattern â€™ = U+00E2 U+20AC U+2122 -> this is actually ' in double-encoded.
          // But this file uses a specific double-encoding issue.
          // Let's just check for specific known corrupted chars by codepoint range.
        };
        
        // Actual approach: look for characters in the range U+00C3 followed by U+201E etc
        // This is complex. Simpler: use the raw text approach.
        // skip this and do direct raw text.
        return;
      }
      if (typeof obj[k] === 'object') {
        fixStrings(obj[k]);
      }
    });
  }
});

// Better approach: read raw bytes, do replacements, then verify parse still works.
// The mojibake is specific to the file encoding, so let's work on the raw UTF-8 bytes.

console.log('\nUsing raw text approach for mojibake...');

// Read each file as raw UTF-8 text and replace known corrupted sequences
const replacements = [
  // ß corruption: 0xC3 0x9F in UTF-8 -> these represent ß
  // But displayed as ÃŸ because they were read as Latin-1
  // In UTF-8 decoded text, these appear as literal characters: Ã (U+00C3) followed by Ÿ (U+0178)
  // Wait - U+0178 is Ÿ. The 0x9F in Latin-1 is actually not Ÿ...
  
  // Let me just take a simpler approach: the file was double-encoded.
  // Some strings were stored as UTF-8 bytes decoded as Latin-1/Windows-1252.
  // The fix is to re-decode them.
  
  // Actually the simplest: for each string field in C1 items, try encoding it back to bytes
  // and see if re-decoding differently gives the right German characters.
];

// Let me try a different approach entirely:
// Read the file as bytes, do byte-level replacements for known patterns in C1 text only.

function fixMojibakeInC1Section(file) {
  const raw = fs.readFileSync(file, 'hex');
  let hex = raw.toUpperCase();
  
  // Find C1 section boundaries in the hex
  const c1Header = '22433122'; // hex for "C1"
  const c1Idx = hex.indexOf(c1Header);
  if (c1Idx === -1) {
    console.log(file + ': no C1 section found');
    return 0;
  }
  
  // Find where C1 section ends (next level header or end of object)
  // In JSON, levels are keys: "A1", "A2", "B1", "B2", "C1"
  // Find the next level key after the C1 array
  
  // The C1 section is a JSON array. Find its extent.
  // Start from c1Idx + length of "C1" + whitespace + [
  let pos = c1Idx + 6; // skip "C1":
  // skip whitespace
  while (pos < hex.length && hex[pos] === ' ') pos++;
  if (hex.substring(pos, pos+2) !== '5B') { // '[' 
    console.log(file + ': C1 is not an array (hex=' + hex.substring(pos, pos+4) + ')');
    return 0;
  }
  
  // Now find the closing bracket ']'
  // We need to track nesting
  const arrStart = pos;
  let depth = 1;
  pos += 2;
  let inString = false;
  let escape = false;
  
  // Actually working with hex is painful. Let me just convert back to text
  // and use a smarter approach.
  const text = Buffer.from(hex, 'hex').toString('utf8');
  
  // Actually this whole approach is overcomplicated.
  // The mojibake chars are fixed unicode codepoints in the parsed JS objects.
  // I just need to find and replace them correctly.
  
  // Let me go back to the parsed approach and fix by codepoint.
  return 0;
}

// === FINAL APPROACH: parse, fix by scanning all string fields at the codepoint level ===

function fixFileFinal(file, lessonMap) {
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  const items = data.C1 || [];
  let fixCount = 0;
  
  // First, ensure level + lessonId
  items.forEach(v => {
    if (!v.level || v.level !== 'C1') v.level = 'C1';
    if (!v.lessonId) v.lessonId = lessonMap[v.id];
  });
  
  // Now fix mojibake by scanning every string value in the C1 items
  // The mojibake characters appear because of UTF-8 double-encoding.
  // Each corrupted character is a specific pair of Unicode codepoints
  // that needs to be replaced with the correct single/corrected character.
  
  function fixString(str) {
    let result = '';
    let i = 0;
    while (i < str.length) {
      const cp = str.codePointAt(i);
      const next = i + 1 < str.length ? str.codePointAt(i + 1) : 0;
      
      // Specific mojibake patterns found in these files:
      let replaced = false;
      
      // Pattern 1: 0xC3 (Ã) followed by specific char that should combine into German umlaut/ß
      if (cp === 0xC3) {
        if (next === 0x9E || next === 0x9F || next === 0x179 || next === 0x17A || next === 0x17B || next === 0x178) {
          // U+00C3 (Ã) + U+0178 (Ÿ) = this is a corrupted ß (U+00DF)
          // The correct ß is U+00DF
          result += '\u00DF'; // ß
          i += 2; // skip both chars
          replaced = true;
          fixCount++;
        } else if (next === 0x201E || next === 0x201C || next === 0x84) {
          // corrupted Ä (U+00C4)
          result += '\u00C4'; // Ä
          i += 2;
          replaced = true;
          fixCount++;
        } else if (next === 0x2013 || next === 0x96 || next === 0x96) {
          // corrupted Ö (U+00D6)
          result += '\u00D6'; // Ö
          i += 2;
          replaced = true;
          fixCount++;
        } else if (next === 0x2018 || next === 0x9C || next === 0x153 || next === 0x152) {
          // corrupted Ü (U+00DC)
          result += '\u00DC'; // Ü
          i += 2;
          replaced = true;
          fixCount++;
        } else if (next === 0x201A || next === 0x2019 || next === 0x9A) {
          // corrupted ü (U+00FC)
          result += '\u00FC'; // ü
          i += 2;
          replaced = true;
          fixCount++;
        } else if (next === 0xA4 || next === 0xA4) {
          // corrupted ä (U+00E4)
          result += '\u00E4'; // ä
          i += 2;
          replaced = true;
          fixCount++;
        } else if (next === 0xB6 || next === 0xB6) {
          // corrupted ö (U+00F6)
          result += '\u00F6'; // ö
          i += 2;
          replaced = true;
          fixCount++;
        }
      }
      
      if (!replaced) {
        result += String.fromCodePoint(cp);
        i++;
      }
    }
    return result;
  }
  
  function walkAndFix(obj) {
    if (!obj) return;
    if (Array.isArray(obj)) {
      obj.forEach(walkAndFix);
      return;
    }
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string') {
          const fixed = fixString(obj[k]);
          if (fixed !== obj[k]) obj[k] = fixed;
        } else if (typeof obj[k] === 'object') {
          walkAndFix(obj[k]);
        }
      });
    }
  }
  
  walkAndFix(items);
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(file + ': fixed ' + fixCount + ' mojibake codepoints, ' + items.length + ' C1 items updated');
  return fixCount;
}

let totalMoji = 0;
totalMoji += fixFileFinal('reading.json', readingLessonMap);
totalMoji += fixFileFinal('listening.json', listeningLessonMap);
totalMoji += fixFileFinal('writing.json', writingLessonMap);
totalMoji += fixFileFinal('speaking.json', speakingLessonMap);

console.log('\nTotal mojibake fixed: ' + totalMoji);

// === VALIDATE ===
console.log('\n=== VALIDATION ===');
['reading.json','listening.json','writing.json','speaking.json'].forEach(f => {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const items = data.C1 || [];
  const name = f.replace('.json','').toUpperCase();
  
  console.log('\n--- ' + name + ' ---');
  console.log('Count: ' + items.length);
  
  // Level
  const noLevel = items.filter(v => !v.level || v.level !== 'C1').length;
  console.log('Missing level=C1: ' + noLevel);
  
  // lessonId
  const noLesson = items.filter(v => !v.lessonId).length;
  const broken = items.filter(v => v.lessonId && !validLessons.has(v.lessonId)).length;
  console.log('Missing lessonId: ' + noLesson + ', Broken: ' + broken);
  if (broken) items.filter(v => v.lessonId && !validLessons.has(v.lessonId)).forEach(v => console.log('  ' + v.id + ': ' + v.lessonId));
  
  // Duplicate IDs
  const ids = items.map(v => v.id);
  console.log('Duplicate IDs: ' + (ids.length - new Set(ids).size));
  
  // Mojibake check - scan all string fields for high-byte corruption
  let mojiCount = 0;
  function scanMojibake(obj) {
    if (!obj) return;
    if (Array.isArray(obj)) { obj.forEach(scanMojibake); return; }
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'string') {
          const str = obj[k];
          for (let i = 0; i < str.length; i++) {
            const cp = str.charCodeAt(i);
            // Check for mojibake indicators: chars in the range U+00C0-U+00FF that are not valid German
            // Actually the mojibake chars ARE valid Latin-1 chars. The real test: does the string have
            // any character that looks like Ã„ or ÃŸ or similar mojibake pairs?
          }
        }
        if (typeof obj[k] === 'object') scanMojibake(obj[k]);
      });
    }
  }
  
  // Better mojibake check: look for specific Latin-1 supplement chars that indicate double-encoding
  // German uses: Ä (C4), ä (E4), Ö (D6), ö (F6), Ü (DC), ü (FC), ß (DF)
  // If we see chars like C3 (Ã), 201E („), 2013 (–), 2018 (‚), 178 (Ÿ), these are mojibake indicators
  items.forEach(v => {
    function checkMojibake(obj, path) {
      if (typeof obj === 'string') {
        for (let i = 0; i < obj.length - 1; i++) {
          const cp1 = obj.charCodeAt(i);
          const cp2 = obj.charCodeAt(i + 1);
          // U+00C3 followed by a high char = classic Latin-1 mojibake of German
          if (cp1 === 0xC3 && (cp2 > 0x2000 || cp2 > 0x80 && cp2 < 0xC0)) {
            console.log('  MOJI: ' + v.id + ' at ' + path + ': char U+' + cp1.toString(16) + ' U+' + cp2.toString(16) + ' in: ' + obj.substring(Math.max(0,i-5), i+15));
            mojiCount++;
            return;
          }
          // U+00C2 followed by high char = Â corruption
          if (cp1 === 0xC2 && cp2 > 0x7F) {
            console.log('  MOJI: ' + v.id + ' at ' + path + ': ' + obj.substring(Math.max(0,i-5), i+15));
            mojiCount++;
            return;
          }
        }
        return;
      }
      if (Array.isArray(obj)) { obj.forEach((item,i) => checkMojibake(item, path+'['+i+']')); return; }
      if (obj && typeof obj === 'object') { Object.keys(obj).forEach(k => checkMojibake(obj[k], path+'.'+k)); }
    }
    checkMojibake(v, v.id);
  });
  
  if (mojiCount === 0) console.log('Mojibake: none found');
  else console.log('Mojibake remaining: ' + mojiCount);
  
  // Required fields
  let missing = 0;
  items.forEach(v => {
    ['id','level','lessonId'].forEach(f => { if (!v[f]) { console.log('  MISS ' + f + ' on ' + v.id); missing++; }});
    if (name === 'READING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; }
      if (!v.passage && !v.text) { console.log('  MISS passage on ' + v.id); missing++; }
      if (!v.questions || v.questions.length === 0) { console.log('  MISS questions on ' + v.id); missing++; }
    }
    if (name === 'LISTENING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; }
      if (!v.script) { console.log('  MISS script on ' + v.id); missing++; }
      if (!v.questions || v.questions.length === 0) { console.log('  MISS questions on ' + v.id); missing++; }
    }
    if (name === 'WRITING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; }
      if (!v.prompt) { console.log('  MISS prompt on ' + v.id); missing++; }
      if (!v.instructions) { console.log('  MISS instructions on ' + v.id); missing++; }
    }
    if (name === 'SPEAKING') {
      if (!v.title) { console.log('  MISS title on ' + v.id); missing++; }
      if (!v.prompt) { console.log('  MISS prompt on ' + v.id); missing++; }
      if (!v.instructions) { console.log('  MISS instructions on ' + v.id); missing++; }
      if (!v.prepTime) { console.log('  MISS prepTime on ' + v.id); missing++; }
      if (!v.talkTime) { console.log('  MISS talkTime on ' + v.id); missing++; }
    }
  });
  console.log('Missing required fields: ' + missing);
});
