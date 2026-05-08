#!/usr/bin/env node
'use strict';
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'src', 'data');

const lessons = JSON.parse(fs.readFileSync(path.join(DATA, 'germanLessons.json'), 'utf8'));
const drills = JSON.parse(fs.readFileSync(path.join(__dirname, 'c1-mini-drills-11-25.json'), 'utf8'));

for (const l of lessons) {
  if (l.level !== 'C1') continue;
  if (drills[l.id]) {
    l.miniDrills = drills[l.id];
    console.log('Added ' + drills[l.id].length + ' miniDrills to ' + l.id);
  }
}

fs.writeFileSync(path.join(DATA, 'germanLessons.json'), JSON.stringify(lessons, null, 2), 'utf8');
console.log('Saved germanLessons.json');
