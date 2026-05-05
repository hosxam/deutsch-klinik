const fs = require('fs');
const g = JSON.parse(fs.readFileSync('./src/data/grammar.json', 'utf8'));

const fixes = {
  'C1_gr_127': 'Der seit Jahren bewärte Behandlungsansatz',
  'C1_gr_133': 'Die Methode, derer wir uns bedienten',
  'C1_gr_139': 'allerdings fehlen Langzeitdaten',
  'C1_gr_143': 'Mag die Situation auch schwierig sein',
  'C1_gr_147': 'sodass der Patient eingeliefert wurde',
  'C1_gr_151': 'Da die Werte auffällig waren',
  'C1_gr_170': 'Die vorliegende Studie untersucht',
  'C1_gr_188': 'Die Theorie dürfte richtig sein',
  'C1_gr_194': 'Im Hinblick auf die Kosten',
  'C1_gr_215': 'Wir berichten über eine 55-jährige Patientin mit Z. n. Myokardinfarkt',
  'C1_gr_222': 'Die Probanden wurden mittels Randomisierung zwei Gruppen zugeteilt',
  'C1_gr_233': 'Demgegenüber ist festzustellen',
  'C1_gr_269': 'Das Problem ist nicht zu unterschätzen'
};

let changes = 0;
const c1 = g.C1 || [];
Object.entries(fixes).forEach(([id, newAns]) => {
  const item = c1.find(e => e.id === id);
  if (!item) { console.log('NOT FOUND: ' + id); return; }
  const old = item.answer;
  if (old !== newAns) {
    item.answer = newAns;
    console.log('CHANGED ' + id + ': "' + old + '" -> "' + newAns + '"');
    changes++;
  } else {
    console.log('OK ' + id);
  }
});

// Post-fix validation: every grammar MCQ must have answer in options
const ids = ['A1','A2','B1','B2','C1','C2'];
let errors = 0;
ids.forEach(levelKey => {
  const items = g[levelKey] || [];
  items.forEach(item => {
    if (item.type === 'mcq' && item.options && item.options.length > 0) {
      if (!item.options.includes(item.answer)) {
        console.log('VALIDATION FAIL: ' + levelKey + '.' + item.id + ' answer "' + item.answer + '" not in options');
        errors++;
      }
    }
  });
});

if (changes > 0) {
  fs.writeFileSync('./src/data/grammar.json', JSON.stringify(g, null, 2), 'utf8');
  console.log('Written ' + changes + ' answer fix(es)');
}
if (errors > 0) {
  console.log('TOTAL VALIDATION ERRORS: ' + errors);
} else {
  console.log('ALL grammar MCQs validated OK');
}
