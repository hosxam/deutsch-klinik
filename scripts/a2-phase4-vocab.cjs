// a2-phase4-vocab.cjs - placeholder for safer writing
const fs=require('fs'),path=require('path');
const DIR=path.join(__dirname,'..','src','data');
const L=(n)=>JSON.parse(fs.readFileSync(path.join(DIR,n),'utf-8'));
const S=(n,d)=>fs.writeFileSync(path.join(DIR,n),JSON.stringify(d,null,2),'utf-8');

// 1) ENSURE no duplicate ids with existing
const vocab=L('germanVocabulary.json');
const maxExisting=Math.max(...vocab.A2.map(v=>parseInt(v.id.replace('A2_v',''),10)));

// Map topic -> lessonId for linking
const topicLessonMap={'Travel':'A2_lesson_4','Daily Life':'A2_lesson_2','Health':'A2_lesson_11','Food':'A2_lesson_7','Services':'A2_lesson_6','Work':'A2_lesson_8','Education':'A2_lesson_9','Housing':'A2_lesson_10','Hobbies':'A2_lesson_14','Feelings':'A2_lesson_22','People':'A2_lesson_17','Nature':'A2_lesson_22','Culture':'A2_lesson_24','Technology':'A2_lesson_21','Admin':'A2_lesson_20','Shopping':'A2_lesson_6','Grammar':'A2_lesson_25','Past Activities':'A2_lesson_3','Living':'A2_lesson_10','Communication':'A2_lesson_15','Clothing':'A2_lesson_18','Furniture':'A2_lesson_10','Finance':'A2_lesson_6','Medical':'A2_lesson_12','Time':'A2_lesson_2','Wetter':'A2_lesson_13','Körper':'A2_lesson_17','Feiern':'A2_lesson_16'};

const topicTags={'Travel':['a2_travel_vocab'],'Daily Life':['a2_daily_routine_vocab'],'Health':['a2_health_vocab'],'Food':['a2_restaurant_vocab'],'Services':['a2_shopping_vocab'],'Work':['a2_work_vocab'],'Education':['a2_education_vocab'],'Housing':['a2_housing_vocab'],'Hobbies':['a2_hobby_vocab'],'Feelings':['a2_emotion_vocab'],'People':['a2_people_vocab'],'Nature':['a2_nature_vocab'],'Culture':['a2_culture_vocab'],'Technology':['a2_tech_vocab'],'Admin':['a2_admin_vocab'],'Shopping':['a2_shopping_vocab'],'Grammar':['a2_grammar_vocab'],'Past Activities':['a2_perfekt_vocab'],'Living':['a2_living_vocab']};

const posMap={'noun':'noun','verb':'verb','adjective':'adjective','adverb':'adverb','phrase':'phrase'};

const newWords=[];

// Use the existing script by executing it in parts
// This is a framework - actual new vocabulary will be loaded from a data file
const dataPath=path.join(__dirname,'a2-vocab-data.json');
console.log('Looking for:', dataPath);
if(fs.existsSync(dataPath)){
  const wb=JSON.parse(fs.readFileSync(dataPath,'utf-8'));
  console.log('Found', wb.length, 'word entries');
  let nid=maxExisting+1;
  wb.forEach(w=>{
    if(vocab.A2.find(v=>v.word===w[1])) return; // dedup by word
    const lid=topicLessonMap[w[0]]||'A2_lesson_1';
    const id='A2_v'+String(nid++).padStart(3,'0');
    const art=w[2]||'';
    const plural=w[3]||'-';
    newWords.push({
      id, word:w[1], translation:w[4], article:art, plural,
      example:w[5], tags:topicTags[w[0]]||[w[0].toLowerCase()+'_vocab'],
      lessonId:lid, level:'A2', partOfSpeech:posMap[w[6]]||'noun',
      topic:w[0], taughtInLessonId:lid
    });
  });
  vocab.A2.push(...newWords);
  S('germanVocabulary.json',vocab);
  console.log('Added',newWords.length,'new A2 vocabulary entries.');
} else {
  console.log('ERROR: a2-vocab-data.json not found. Generate it first.');
}
