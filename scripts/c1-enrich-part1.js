#!/usr/bin/env node
'use strict';
const fs = require('fs'), path = require('path');
const DRY = process.argv.includes('--dry-run');
const DATA = path.join(__dirname, '..', 'src', 'data');
const load = f => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const save = (f, d) => { if (DRY) { console.log('[DRY-RUN] Would save ' + f); return; } fs.writeFileSync(path.join(DATA, f), JSON.stringify(d, null, 2), 'utf8'); console.log('Saved ' + f); };
const backup = f => { const src = path.join(DATA, f), bak = src + '.c1-enrich.bak'; if (!fs.existsSync(bak)) { fs.copyFileSync(src, bak); console.log('Backup: ' + f); } };
const loadJSON = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const GMAP = loadJSON(path.join(__dirname, 'c1-grammar-map.json'));
const FT = loadJSON(path.join(__dirname, 'c1-forms-tables.json'));
const MD = loadJSON(path.join(__dirname, 'c1-mini-drills.json'));

// Lesson metadata
const LM = loadJSON(path.join(__dirname, 'c1-lesson-meta.json'));

// Common mistakes
const CM = loadJSON(path.join(__dirname, 'c1-common-mistakes.json'));

console.log('Loaded c1-lesson-meta.json keys:', Object.keys(LM).length);
console.log('Loaded c1-common-mistakes.json keys:', Object.keys(CM).length);
console.log('Loaded c1-forms-tables.json keys:', Object.keys(FT).length);
console.log('Loaded c1-mini-drills.json keys:', Object.keys(MD).length);
