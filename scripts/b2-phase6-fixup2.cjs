#!/usr/bin/env node
/**
 * b2-phase6-fixup2.cjs — Assign linkedQuestionIds to B2 lessons 11-25
 */
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'src', 'data');
const lessons = JSON.parse(fs.readFileSync(path.join(DATA, 'germanLessons.json'), 'utf8'));
const grammar = JSON.parse(fs.readFileSync(path.join(DATA, 'grammar.json'), 'utf8'));
const b2g = grammar.B2 || [];

// Build topic lookup
const topicItems = {};
b2g.forEach(gi => {
  if (!topicItems[gi.topic]) topicItems[gi.topic] = [];
  topicItems[gi.topic].push(gi.id);
});

// Map lessons 11-25 to relevant grammar topics
const lessonLinks = {
  'B2_lesson_11': ['Subjunctive II', 'Connectors', 'Nominalization'],
  'B2_lesson_12': ['Genitive Prepositions', 'Relative Clauses', 'Negation'],
  'B2_lesson_13': ['Temporal Subclauses', 'Indirect Questions', 'Conjunctive Clauses'],
  'B2_lesson_14': ['Subjunctive II', 'Modal Verb Meanings', 'Prepositional Adverbs'],
  'B2_lesson_15': ['Conditional Clauses', 'Adjective Declension', 'Two-way Prepositions'],
  'B2_lesson_16': ['Complex Connectors', 'Participle Constructions', 'Future II'],
  'B2_lesson_17': ['Concessive Clauses', 'Causative Clauses', 'Complex Passive'],
  'B2_lesson_18': ['Double Connectors', 'Extended Infinitives', 'Relative Clauses'],
  'B2_lesson_19': ['Final Clauses', 'Consecutive Clauses', 'Passive with Modals'],
  'B2_lesson_20': ['Subjunctive II', 'N-Deklination', 'Negation'],
  'B2_lesson_21': ['Advanced Passive', 'Nominalization', 'Modal Verb Meanings'],
  'B2_lesson_22': ['Genitive Prepositions', 'Temporal Subclauses', 'Conditional Clauses'],
  'B2_lesson_23': ['Indefinite Pronouns', 'Subjunctive I', 'Participle Constructions'],
  'B2_lesson_24': ['Complex Passive', 'Complex Connectors', 'Zustandspassiv'],
  'B2_lesson_25': ['Indirect Questions', 'Extended Infinitives', 'Double Connectors']
};

let total = 0;
lessons.forEach(l => {
  if (l.level !== 'B2') return;
  if (l.linkedQuestionIds && l.linkedQuestionIds.length >= 3) return;
  
  const topics = lessonLinks[l.id];
  if (!topics) {
    console.log(`  WARN: No topic mapping for ${l.id}`);
    return;
  }
  
  const ids = [];
  const seen = new Set();
  topics.forEach(t => {
    const items = topicItems[t] || [];
    items.forEach(id => {
      if (!seen.has(id) && ids.length < 7) {
        ids.push(id);
        seen.add(id);
      }
    });
  });
  
  if (ids.length > 0) {
    l.linkedQuestionIds = ids;
    total += ids.length;
    console.log(`  ${l.id}: ${ids.length} linkedQuestionIds (${ids.join(', ')})`);
  }
});

fs.writeFileSync(path.join(DATA, 'germanLessons.json'), JSON.stringify(lessons, null, 2), 'utf8');
console.log(`\nSaved. Total links added: ${total}`);
