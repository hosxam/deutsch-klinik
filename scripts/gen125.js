/**
 * Generator for 100 additional German lessons (20 per level: A1, A2, B1, B2, C1)
 * Total becomes 25 per level (5 existing + 20 new)
 * 
 * Run: node scripts/gen125.js
 * 
 * Strategy: Build lessons using helper functions to keep the file size manageable.
 * Uses JSON.stringify for safe serialization.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

function loadJSON(file) {
  const p = path.join(DATA_DIR, file);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : [];
}

function existingIds() {
  const s = new Set();
  ['germanLessons.json', 'germanLessonsB1.json', 'germanLessonsBC.json']
    .forEach(f => loadJSON(f).forEach(l => s.add(l.id)));
  return s;
}

const EXISTING = existingIds();

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

const UNIT_NAMES = {
  A1: ['Erste Kontakte / Grundlagen','Mein Zuhause','Essen und Trinken','Mein Alltag','Unterwegs'],
  A2: ['Reisen und Urlaub','Gesundheit und K\u00f6rper','Einkaufen und Mode','Arbeit und Beruf','Feste und Traditionen'],
  B1: ['Medien und Kommunikation','Umwelt und Natur','Bildung und Lernen','Kultur und Gesellschaft','Technologie und Zukunft'],
  B2: ['Wirtschaft','Politik','Wissenschaft','Recht','Kunst'],
  C1: ['Akademisch','Formell','Nuancen','Literatur','Debatte']
};

function unitFor(level, num) {
  const i = Math.min(Math.floor((num - 1) / 5), 4);
  return level + '_unit_' + (i + 1);
}

// ─── Lesson Data ───────────────────────────────────────────────
// 20 lessons per level (6-25), stored as JSON files inline.
// Each level's lessons are stored as JSON strings to avoid Node writing issues.

function buildLesson(level, num, content) {
  const unit = unitFor(level, num);
  return {
    level,
    unit,
    id: level + '_lesson_' + num,
    ...content
  };
}

// Read lesson data from separate chunk files
const CHUNK_DIR = path.join(__dirname, 'lesson-chunks');

function loadChunk(level, nums) {
  const file = path.join(CHUNK_DIR, level + '-' + nums.join('_') + '.json');
  if (!fs.existsSync(file)) {
    console.error('Missing:', file);
    return [];
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

// Generate all 100 new lessons
const allNew = [];

// Load all chunk files
const chunkFiles = fs.readdirSync(CHUNK_DIR).filter(f => f.endsWith('.json'));
for (const cf of chunkFiles) {
  const lessons = JSON.parse(fs.readFileSync(path.join(CHUNK_DIR, cf), 'utf-8'));
  for (const l of lessons) {
    if (EXISTING.has(l.id)) {
      console.log('Skipping existing:', l.id);
      continue;
    }
    allNew.push(l);
  }
}

// Write output
fs.writeFileSync(path.join(DATA_DIR, 'germanLessonsNew.json'), JSON.stringify(allNew, null, 2));
console.log('Generated ' + allNew.length + ' new lessons.');
console.log('Counts by level:');
const cnt = {};
allNew.forEach(l => { cnt[l.level] = (cnt[l.level] || 0) + 1; });
Object.entries(cnt).forEach(([k,v]) => console.log('  ' + k + ': ' + v));
