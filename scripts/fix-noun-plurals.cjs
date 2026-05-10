/**
 * fix-noun-plurals.cjs
 *
 * Fills high-confidence plurals, marks uncountable nouns, adds
 * countability and pluralStatus fields.
 *
 * Usage: node scripts/fix-noun-plurals.cjs
 */
const F=require('fs'),P=require('path');
const vp=P.join(__dirname,'..','src','data','germanVocabulary.json');
const fp=P.join(__dirname,'..','src','data','fspVocabulary.json');

// Helper: strip/rebuild convention "die Pluralform"
const SA=x=>(x||'').replace(/^(die|der|das)\s+/i,'');
const WA=p=>p?'die '+p:'';

// Plural-only nouns
const PO=new Set(['Eltern','Geschwister','Leute','Ferien','Kosten',
  'Kopfschmerzen','Halsschmerzen','Rückenschmerzen','Bauchschmerzen',
  'Nudeln','Jeans','Schreibwaren']);

// Known plurals {sing: plur_word}
const KP=JSON.parse(F.readFileSync(P.join(__dirname,'plural-data.json'),'utf8'));

// Uncountable set
const UC=new Set(F.readFileSync(P.join(__dirname,'plural-data.txt'),'utf8')
  .split('\n').map(x=>x.trim()).filter(Boolean));

// Rule-based plural
function rbp(w,a){
  if(!w)return null;
  function uml(s){const m={'a':'ä','o':'ö','u':'ü','au':'äu'};
    for(const[f,t]of Object.entries(m)){
      const i=s.slice(0,-2).lastIndexOf(f);
      if(i>=0)return s.slice(0,i)+t+s.slice(i+f.length);
    }return null;}
  function umlL(s){const m={'a':'ä','o':'ö','u':'ü','au':'äu'};
    for(const[f,t]of Object.entries(m)){
      const i=s.lastIndexOf(f);
      if(i>=0&&i<s.length-1)return s.slice(0,i)+t+s.slice(i+f.length);
    }return null;}
  if(a==='die'){
    if(/(ung|heit|keit|schaft)$/.test(w))return w+'en';
    if(/[ai]on$/.test(w)||/tät$/.test(w)||/ur$/.test(w)||/anz$/.test(w)||/enz$/.test(w))return w+'en';
    if(/ik$/.test(w))return w+'en';
    if(/in$/.test(w))return w+'nen';
    if(/(er|el)$/.test(w)){const u=uml(w);return u||w;}
    if(/en$/.test(w))return w;
    if(/e$/.test(w))return w+'n';
    if(/ei$/.test(w))return w+'en';
    return w+'en';
  }
  if(a==='der'){
    if(/ismus$/.test(w))return w.slice(0,-4)+'ismen';
    if(/ling$/.test(w))return w+'e';
    if(/(er|el|en)$/.test(w)){const u=uml(w);return u||w;}
    if(/e$/.test(w))return w+'n';
    const u=umlL(w);return u?u+'e':w+'e';
  }
  if(a==='das'){
    if(/(chen|lein)$/.test(w))return w;
    if(/um$/.test(w))return w.slice(0,-2)+'en';
    if(/(en|er|el)$/.test(w)){const u=uml(w);return u||w;}
    if(/ma$/.test(w))return w.slice(0,-1)+'en';
    const u=umlL(w);return u?u+'er':w+'er';
  }
  return null;
}

function fixEntry(e,lvl){
  if(e.partOfSpeech!=='noun')return null;
  let w=e.word||'';const a=e.article||'';
  // FSP vocab stores article in word field: "die Aufnahme"
  const sw=SA(w);
  if(sw!==w){w=sw;if(!e.embeddedWord)e.embeddedWord=e.word;}
  const act=[];

  // Plural-only
  if(PO.has(w)){
    const p=WA(w);
    if(e.plural!==p){e.plural=p;act.push('pl-ponly');}
    e.countability='uncountable';act.push('cnt-ponly');
    e.pluralStatus='not-applicable';act.push('ps-ponly');
    return act.join(',')||null;
  }

  // Uncountable (mass nouns, non-countable)
  if(UC.has(w)){
    // Preserve plural only for plural-only nouns (Eltern, Leute, Ferien, Geschwister)
    // that are in the UC list because they don't have a singular form
    const isPluralOnlyWord = e.plural && SA(e.plural)===w && PO.has(w);
    // Preserve plural if word IS already its own plural form (word is already plural,
    // e.g. "die Begleitsymptome" where the word looks plural but is used as-is)
    // Detect: stored plural matches the word itself (no suffix added)
    const isSelfPlural = e.plural && SA(e.plural)===w && w!==SA(e.article||'')+'n';
    if(isPluralOnlyWord || isSelfPlural){
      // Keep the plural as-is
    } else if(e.plural){
      e.plural='';act.push('clr-pl');
    }
    e.countability='uncountable';act.push('cnt-unc');
    e.pluralStatus='not-applicable';act.push('ps-unc');
    return act.join(',')||null;
  }

  // Check/validate existing plural
  const existing=SA(e.plural||'');
  let target=null;

  // Known mapping (always override if word is in known plurals)
  if(KP[w]){
    const mapped=KP[w];
    const expected=WA(mapped);
    // Normalize: always store with "die " prefix
    e.plural=expected;
    act.push(existing!==mapped?'pl-fix-known':'pl-ok');
    e.countability='countable';act.push('cnt-known');
    e.pluralStatus='known';act.push('ps-known');
    return act.join(',')||null;
  }
  // Rule-based (always evaluate and check against existing)
  if(true){
    const r=rbp(w,a);
    if(r){
      const expected=WA(r);
      // Normalize: always store with "die " prefix
      e.plural=expected;
      act.push(existing===r?'pl-rule-ok':'pl-fix-rule');
      e.countability='countable';act.push('cnt-rule');
      e.pluralStatus='known';act.push('ps-rule');
      return act.join(',')||null;
    }
  }

  // No plural known - mark as needs-review (but keep existing plural if any)
  if(!e.countability||e.countability==='unknown'||e.countability===''){e.countability='unknown';act.push('cnt-unknown');}
  if(!e.pluralStatus||e.pluralStatus==='needs-review'){e.pluralStatus='needs-review';act.push('ps-review');}

  return act.join(',')||null;
}

// Main
const report={};
let voc=JSON.parse(F.readFileSync(vp,'utf8'));
let fspRaw;
['A1','A2','B1','B2','C1'].forEach(l=>{
  report[l]={total:0,changed:0};
  (voc[l]||[]).forEach(e=>{
    if(e.partOfSpeech!=='noun')return;
    report[l].total++;
    const c=fixEntry(e,l);
    if(c)report[l].changed++;
  });
});

F.writeFileSync(vp,JSON.stringify(voc,null,2),'utf8');
console.log('Wrote '+vp);

fspRaw=JSON.parse(F.readFileSync(fp,'utf8'));
const fspArr=Array.isArray(fspRaw)?fspRaw:Object.values(fspRaw);
report.FSP={total:0,changed:0};
fspArr.forEach(e=>{
  if(e.partOfSpeech!=='noun')return;
  report.FSP.total++;
  const c=fixEntry(e,'FSP');
  if(c)report.FSP.changed++;
});
F.writeFileSync(fp,JSON.stringify(fspRaw,null,2),'utf8');
console.log('Wrote '+fp);

// Report
console.log('\n=== NOUN PLURAL FIX REPORT ===');
let tf=0,tu=0;
['A1','A2','B1','B2','C1','FSP'].forEach(l=>{
  const s=report[l];
  if(!s||!s.total)return;
  console.log(l+': '+s.total+' nouns, '+s.changed+' changed');
  tf+=s.changed;
});
console.log('\nTotal entries with changes: '+tf);
