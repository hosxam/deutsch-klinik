"use strict";
// Generator: builds a2-phase4-comprehensive.cjs from data + local helper modules

const fs = require("fs");
const path = require("path");

const HERE = __dirname;
const SCRIPT_DEST = path.join(HERE, "a2-phase4-comprehensive.cjs");

// ===== Load helper data modules (each exports an object) =====
const lcm   = require(path.join(HERE, "a2-mistakes.js"));
const lft   = require(path.join(HERE, "a2-forms.js"));
const lmd   = require(path.join(HERE, "a2-drills.js"));
const ltt   = require(path.join(HERE, "a2-tags.js"));
const gtl   = require(path.join(HERE, "a2-grammar-map.js"));
const kw    = require(path.join(HERE, "a2-kwmap.js"));
const wrRb  = require(path.join(HERE, "a2-writing-rubric.js"));
const spRb  = require(path.join(HERE, "a2-speaking-rubric.js"));

// ===== Build the script as a string =====
let lines = [];
function L(s) { lines.push(s); }

L("#!/usr/bin/env node");
L("/* A2 Phase 4 Enrichment - auto-generated */");
L('const fs=require("fs"),path=require("path");');
L('const D=path.join(__dirname,"..","src","data"),B=path.join(__dirname,"..","backup");');
L('const TS=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);');
L('const j=f=>JSON.parse(fs.readFileSync(path.join(D,f+".json"),"utf8"));');
L('const d={lessons:j("germanLessons"),grammar:j("grammar"),reading:j("reading"),listening:j("listening"),writing:j("writing"),speaking:j("speaking"),vocabulary:j("germanVocabulary")};');
L("");
L("function backup(){");
L('  console.log("\\n=== STEP 1: Backup ===\\n");');
L('  const sub=path.join(B,"backup-"+TS);');
L('  if(!fs.existsSync(sub))fs.mkdirSync(sub,{recursive:true});');
L('  fs.readdirSync(D).filter(f=>f.endsWith(".json")).forEach(f=>fs.copyFileSync(path.join(D,f),path.join(sub,f)));');
L('  console.log("  Backed up to "+sub); return sub;');
L("}");
L("backup();");
L("");

// Concept IDs
L("const lcid = " + JSON.stringify({
  A2_lesson_1:"a2.review.self.intro",A2_lesson_2:"a2.daily.routine",A2_lesson_3:"a2.perfect.tense",
  A2_lesson_4:"a2.travel.transport",A2_lesson_5:"a2.hotel.accommodation",A2_lesson_6:"a2.shopping.services",
  A2_lesson_7:"a2.food.restaurant",A2_lesson_8:"a2.work.workplace",A2_lesson_9:"a2.education.language",
  A2_lesson_10:"a2.housing.rental",A2_lesson_11:"a2.health.symptoms",A2_lesson_12:"a2.pharmacy.medicine",
  A2_lesson_13:"a2.weather.seasons",A2_lesson_14:"a2.hobbies.free.time",A2_lesson_15:"a2.invitations.appointments",
  A2_lesson_16:"a2.holidays.celebrations",A2_lesson_17:"a2.body.parts.appearance",A2_lesson_18:"a2.clothing.fashion",
  A2_lesson_19:"a2.family.relationships",A2_lesson_20:"a2.technology.media",A2_lesson_21:"a2.animals.nature",
  A2_lesson_22:"a2.feelings.emotions",A2_lesson_23:"a2.directions.traffic",A2_lesson_24:"a2.festivals.traditions",
  A2_lesson_25:"a2.review.b1.outlook",
}));
L("const lpr = " + JSON.stringify({
  A2_lesson_1:["a1.greetings.sein-introductions","a1_noun_gender_basics"],
  A2_lesson_2:["a2.review.self.intro","a1_present_tense_regular"],
  A2_lesson_3:["a2.daily.routine","a1_present_tense_regular"],
  A2_lesson_4:["a2.review.self.intro","a1_word_order_main_clause"],
  A2_lesson_5:["a2.travel.transport","a1_word_order_main_clause"],
  A2_lesson_6:["a2.perfect.tense","a1_w_questions"],
  A2_lesson_7:["a2.hotel.accommodation","a1_noun_gender_basics"],
  A2_lesson_8:["a2.daily.routine","a1_modal_verbs"],
  A2_lesson_9:["a2.shopping.services","a1_word_order_main_clause"],
  A2_lesson_10:["a2.education.language","a1_basic_prepositions"],
  A2_lesson_11:["a2.travel.transport","a1_nominative_basics"],
  A2_lesson_12:["a2.health.symptoms","a1_medical_starter_phrases"],
  A2_lesson_13:["a2.review.self.intro","a1_time_numbers_dates"],
  A2_lesson_14:["a2.daily.routine","a1_vocab_everyday_core"],
  A2_lesson_15:["a2.hobbies.free.time","a1_self_introduction"],
  A2_lesson_16:["a2.invitations.appointments","a1_noun_gender_basics"],
  A2_lesson_17:["a2.review.self.intro","a1_nominative_basics"],
  A2_lesson_18:["a2.clothing.fashion","a1_vocab_everyday_core"],
  A2_lesson_19:["a2.food.restaurant","a1_noun_gender_basics"],
  A2_lesson_20:["a2.perfect.tense","a1_yes_no_questions"],
  A2_lesson_21:["a2.animals.nature","a1_vocab_everyday_core"],
  A2_lesson_22:["a2.feelings.emotions","a1_personal_pronouns"],
  A2_lesson_23:["a2.directions.traffic","a1_basic_prepositions"],
  A2_lesson_24:["a2.holidays.celebrations","a1_birthday_celebration"],
  A2_lesson_25:["a2.festivals.traditions","a2.technology.media"],
}));
L("const lct = " + JSON.stringify({
  A2_lesson_1:["a2.negation.basics","a2.pronomen.subject","a2.possessivartikel.basics"],
  A2_lesson_2:["a2.imperativ.basics","a2.modalverben.praesens","a2.zeitangaben.basics","a2.praeteritum.haben.sein"],
  A2_lesson_3:["a2.perfekt.basics","a2.partizip.ii","a2.trennbare.verben.perfekt"],
  A2_lesson_4:["a2.als.vs.wenn","a2.konjunktionen.als.wenn","a2.wenn.saetze"],
  A2_lesson_5:["a2.weil.saetze","a2.subordinate.clauses.weil"],
  A2_lesson_6:["a2.indirekte.fragen","a2.interrogatives.wfragen"],
  A2_lesson_7:["a2.adjektivendungen.nominativ","a2.adjektivendungen.akkusativ"],
  A2_lesson_8:["a2.modalverben.praeteritum","a2.modal.verbs.past"],
  A2_lesson_9:["a2.dass.saetze","a2.subordinate.clauses.dass"],
  A2_lesson_10:["a2.wechselpraepositionen","a2.two.way.prepositions"],
  A2_lesson_11:["a2.reflexive.verben","a2.dativverben"],
  A2_lesson_12:["a2.imperativ.sie","a2.imperativ.du.ihr"],
  A2_lesson_13:["a2.praeteritum.modal","a2.praeteritum.regelmaessig","a2.zeitangaben.vergangenheit"],
  A2_lesson_14:["a2.komparativ.basics","a2.superlativ.basics"],
  A2_lesson_15:["a2.konjunktionen.und.aber.oder","a2.satzstellung.zeit.vor.ort"],
  A2_lesson_16:["a2.dativ.artikel","a2.possessivartikel.dativ"],
  A2_lesson_17:["a2.reflexive.verben.koerper","a2.dativverben.koerper"],
  A2_lesson_18:["a2.adjektivendungen.dativ","a2.komparativ.kleidung","a2.superlativ.kleidung"],
  A2_lesson_19:["a2.genitiv.basics","a2.genitiv.nomen"],
  A2_lesson_20:["a2.indirekte.fragen.technik","a2.nebensaetze.technik"],
  A2_lesson_21:["a2.komparativ.tiere","a2.superlativ.tiere","a2.wenn.saetze.natur"],
  A2_lesson_22:["a2.reflexive.verben.emotionen","a2.dativverben.emotionen"],
  A2_lesson_23:["a2.dativpraepositionen","a2.wechselpraepositionen.richtung"],
  A2_lesson_24:["a2.wenn.saetze.feste","a2.konjunktionen.fest"],
  A2_lesson_25:["a2.mix.review","a2.abschluss","a2.persoenliche.erfahrungen"],
}));

L("const lcm = " + JSON.stringify(lcm));
L("const lft = " + JSON.stringify(lft));
L("const lmd = " + JSON.stringify(lmd));
L("const ltt = " + JSON.stringify(ltt));
L("const g2l = " + JSON.stringify(gtl));
L("const kwMap = " + JSON.stringify(kw));
L("const wrRb = " + JSON.stringify(wrRb));
L("const spRb = " + JSON.stringify(spRb));
L("");

// STEP 2 - Enrich lessons
L('console.log("\\n=== STEP 2: Enrich A2 Lessons ===\\n");');
L("const a2l = d.lessons.filter(x=>x.id&&x.id.startsWith(\"A2_\"));");
L("a2l.forEach(l=>{");
L("  l.conceptId = lcid[l.id];");
L("  l.estimatedMinutes = l.estimatedMinutes || (l.id===\"A2_lesson_25\"?60:50);");
L("  l.prerequisiteConceptIds = lpr[l.id] || [];");
L("  l.conceptsTaught = lct[l.id] || [];");
L("  l.commonMistakes = l.lcm ? l.lcm : lcm[l.id] || [];");
L("  l.formsTable = l.formsTable ? l.formsTable : lft[l.id] || [];");
L("  l.miniDrills = l.miniDrills ? l.miniDrills : lmd[l.id] || [];");
L("  l.trackTags = l.trackTags ? l.trackTags : ltt[l.id] || [];");
L('  l.lessonDepthVersion = "2.0";');
L("  if(!l.linkedQuestionIds) l.linkedQuestionIds = [];");
L("});");
L('console.log("  Enriched "+a2l.length+" A2 lessons");');
L("");

// STEP 3 - Enrich grammar
L('console.log("\\n=== STEP 3: Enrich A2 Grammar ===\\n");');
L("const a2g = d.grammar.A2;");
L("a2g.forEach(q=>{");
L('  q.skillType = "grammar";');
L('  const topic = q.topic || q.unit || "";');
L("  q.conceptId = q.conceptId || g2l.concept[topic] || g2l.concept[\"A2 Mix\"] || \"a2.mix.review\";");
L("  const lsns = g2l.lesson[topic] || [\"A2_lesson_25\"];");
L("  if(!q.taughtInLessonId) q.taughtInLessonId = lsns[0] || q.lessonId || \"A2_lesson_25\";");
// difficulty
L("  if(!q.difficulty){");
L('    const t = topic.toLowerCase();');
L('    if(["negation","pronomen","possessivartikel","imperativ","interrogatives","dativ artikel","dative"].some(x=>t.includes(x))) q.difficulty="easy";');
L('    else if(["perfekt mit sein","partizip ii irregular","trennbare","subordinate clauses","two-way","wechselpräpositionen","präteritum","genitiv","nebensätze","dativpräpositionen","satzstellung","word order","a2 abschluss"].some(x=>t.includes(x))) q.difficulty="hard";');
L('    else q.difficulty="medium";');
L("  }");
L("  if(!q.prerequisiteConceptIds) q.prerequisiteConceptIds = g2l.prereq[topic] || [];");
L("});");
L('console.log("  Grammar enriched: "+a2g.length+" items");');
L('console.log("    conceptId: "+a2g.filter(q=>q.conceptId).length);');
L('console.log("    taughtInLessonId: "+a2g.filter(q=>q.taughtInLessonId).length);');
L('console.log("    difficulty: "+a2g.filter(q=>q.difficulty).length);');
L('console.log("    skillType: "+a2g.filter(q=>q.skillType).length);');
L("");

// STEP 4 - Reading/Listening/Writing/Speaking
L('console.log("\\n=== STEP 4: Enrich Reading/Listening/Writing/Speaking ===\\n");');

L("function cMap(x){");
L('  const s=(x.title+" "+(x.text||x.script||x.prompt||"")).toLowerCase();');
L("  for(const e of kwMap)for(const k of e.k)if(s.includes(k))return e.l;");
L('  return "A2_lesson_25";');
L("}");

L("let rC=0;d.reading.A2.forEach(x=>{if(!x.taughtInLessonId){x.taughtInLessonId=cMap(x);rC++;}});");
L('console.log("  Reading taughtInLessonId: "+rC+"/"+d.reading.A2.length);');
L("let lC=0;d.listening.A2.forEach(x=>{if(!x.taughtInLessonId){x.taughtInLessonId=cMap(x);lC++;}});");
L('console.log("  Listening taughtInLessonId: "+lC+"/"+d.listening.A2.length);');

L("let wC=0;d.writing.A2.forEach(x=>{if(!x.taughtInLessonId){x.taughtInLessonId=cMap(x);wC++;}x.rubric=x.rubric||wrRb.map(r=>({criterion:r.criterion,description:r.description,points:r.points}));x.rubricKeys=x.rubricKeys||wrRb.map(r=>r.key);});");
L('console.log("  Writing taughtInLessonId: "+wC+"/"+d.writing.A2.length+" rubric: "+d.writing.A2.filter(x=>x.rubric).length);');
L("let sC=0;d.speaking.A2.forEach(x=>{if(!x.taughtInLessonId){x.taughtInLessonId=cMap(x);sC++;}x.rubric=x.rubric||spRb.map(r=>({criterion:r.criterion,description:r.description,points:r.points}));x.rubricKeys=x.rubricKeys||spRb.map(r=>r.key);});");
L('console.log("  Speaking taughtInLessonId: "+sC+"/"+d.speaking.A2.length+" rubric: "+d.speaking.A2.filter(x=>x.rubric).length);');
L("");

// STEP 5 - Link grammar questions
L('console.log("\\n=== STEP 5: Link Grammar Questions to Lessons ===\\n");');
L("a2l.forEach(l=>{");
L("  l.linkedQuestionIds = d.grammar.A2.filter(q=>q.taughtInLessonId===l.id).map(q=>q.id);");
L("});");
L("const tl = a2l.reduce((s,l)=>s+l.linkedQuestionIds.length,0);");
L('console.log("  Total links: "+tl);');
L("");

// Write files
L('console.log("\\n=== Writing files ===\\n");');
L("fs.writeFileSync(path.join(D,\"germanLessons.json\"),JSON.stringify(d.lessons,null,2),\"utf8\");");
L("fs.writeFileSync(path.join(D,\"grammar.json\"),JSON.stringify(d.grammar,null,2),\"utf8\");");
L("fs.writeFileSync(path.join(D,\"reading.json\"),JSON.stringify(d.reading,null,2),\"utf8\");");
L("fs.writeFileSync(path.join(D,\"listening.json\"),JSON.stringify(d.listening,null,2),\"utf8\");");
L("fs.writeFileSync(path.join(D,\"writing.json\"),JSON.stringify(d.writing,null,2),\"utf8\");");
L("fs.writeFileSync(path.join(D,\"speaking.json\"),JSON.stringify(d.speaking,null,2),\"utf8\");");
L('console.log("  All files written.");');
L("");

// Final report
L('console.log("\\n=== FINAL REPORT ===\\n");');
L('console.log("A2 Lessons: "+a2l.length);');
L("a2l.forEach(l=>console.log(\"  \"+l.id+\": cid=\"+l.conceptId+\" min=\"+l.estimatedMinutes+\" cm=\"+(l.commonMistakes?l.commonMistakes.length:0)+\" ft=\"+(l.formsTable?l.formsTable.length:0)+\" md=\"+(l.miniDrills?l.miniDrills.length:0)+\" tt=\"+(l.trackTags?l.trackTags.length:0)+\" lq=\"+(l.linkedQuestionIds?l.linkedQuestionIds.length:0)+\" v=\"+l.lessonDepthVersion));");
L('console.log("A2 Grammar: "+a2g.length+" conceptId="+a2g.filter(q=>q.conceptId).length+" taughtIn="+a2g.filter(q=>q.taughtInLessonId).length+" diff="+a2g.filter(q=>q.difficulty).length+" skill="+a2g.filter(q=>q.skillType).length);');
L('console.log("A2 Reading taughtInLessonId: "+d.reading.A2.filter(x=>x.taughtInLessonId).length+"/"+d.reading.A2.length);');
L('console.log("A2 Listening taughtInLessonId: "+d.listening.A2.filter(x=>x.taughtInLessonId).length+"/"+d.listening.A2.length);');
L('console.log("A2 Writing taughtInLessonId: "+d.writing.A2.filter(x=>x.taughtInLessonId).length+"/"+d.writing.A2.length+" rubric: "+d.writing.A2.filter(x=>x.rubric).length);');
L('console.log("A2 Speaking taughtInLessonId: "+d.speaking.A2.filter(x=>x.taughtInLessonId).length+"/"+d.speaking.A2.length+" rubric: "+d.speaking.A2.filter(x=>x.rubric).length);');
L('console.log("\\nDone!");');

// Write the output
const all = lines.join("\n");
fs.writeFileSync(SCRIPT_DEST, all, "utf8");
console.log("Generated a2-phase4-comprehensive.cjs: " + all.length + " bytes");
