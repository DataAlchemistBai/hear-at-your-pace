/* No runtime dependencies. Optional JSDOM checks use HEAR_JSDOM or .test-tools/. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),web=path.join(root,'dist');
let count=0;function ok(message){count++;console.log(`PASS ${String(count).padStart(2,'0')} ${message}`);}
for(const file of ['data/units.js','js/store.js','js/audio.js','js/app.js'])execFileSync(process.execPath,['--check',path.join(web,file)]);
ok('all four JavaScript files parse');
const context=vm.createContext({console,setTimeout,clearTimeout,Date,performance});context.window=context;context.globalThis=context;
vm.runInContext(fs.readFileSync(path.join(web,'data/units.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(web,'js/store.js'),'utf8'),context);
const units=context.HEAR_UNITS;assert.equal(units.length,1);const u=units[0];assert.equal(u.dialogues.length,3);assert.equal(u.stories.length,2);assert.equal(new Set([...u.dialogues,...u.stories].map(x=>x.id)).size,5);
for(const d of u.dialogues){assert.equal(d.roles.length,2);assert.equal(d.lines.length,12);assert(d.supports.length);for(const line of d.lines){assert(d.roles.includes(line.s));assert(line.en&&line.zh&&line.keys.length);}}
for(const s of u.stories){assert.equal(Object.keys(s.w5h).length,6);assert(s.retelling&&s.points.length);const n=s.lines.map(l=>l.en).join(' ').match(/[A-Za-z]+(?:'[A-Za-z]+)?/g).length;assert(s.level==='short'?n>=70&&n<=95:n>=150&&n<=200);console.log(`INFO ${s.title}: ${n} words`);}
ok('one genuine unit, three dialogues, two graded stories, complete scaffolds');
vm.runInContext(`
  const saved=new Map();
  const storage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)};
  const a=new HearStore.JournalStore(storage);
  a.mark('teenage-life','club','listen','understood');
  a.mark('teenage-life','club','role','done');
  a.favorite({id:'teenage-life/club/0',unit:'teenage-life',en:'A sentence.',zh:'一句话。',source:'demo'});
  a.state.notes['teenage-life/lunch']={Who:'Sara',draft:'First, ...',checks:[true,false]};a.state.seconds=35;a.save();
  const b=new HearStore.JournalStore(storage);
  if(b.state.favorites.length!==1||b.state.seconds!==35||b.state.notes['teenage-life/lunch'].Who!=='Sara')throw Error('reload failed');
  const p=b.progress(HEAR_UNITS[0]);if(p.listen[0]!==1||p.role[0]!==1||p.retell[0]!==0)throw Error('progress failed');
  const backup=JSON.parse(JSON.stringify(b.export()));const restored=b.parseBackup(backup);b.restore(restored);
  if(b.state.favorites[0].en!=='A sentence.')throw Error('roundtrip failed');
  const old=JSON.stringify(b.state);let rejected=false;try{b.parseBackup({app:'other',state:{}});}catch{rejected=true;}if(!rejected||JSON.stringify(b.state)!==old)throw Error('invalid import changed state');
  rejected=false;try{const bad=JSON.parse(JSON.stringify(backup));bad.state.seconds=-1;b.parseBackup(bad);}catch{rejected=true;}if(!rejected)throw Error('negative statistics accepted');
  rejected=false;try{const bad=JSON.parse(JSON.stringify(backup));bad.state.notes['__proto__']={Who:'oops'};bad.state.marks=JSON.parse('{"__proto__":{"listen":"done"}}');b.parseBackup(bad);}catch{rejected=true;}if(!rejected)throw Error('unsafe key accepted');
  const c=new HearStore.JournalStore({getItem:()=>null,setItem:()=>{throw Error('quota');}});c.mark('teenage-life','club','listen','again');if(c.persistent||c.state.history.length!==1)throw Error('quota fallback failed');
  const d=new HearStore.JournalStore(storage);d.state.days=['2026-10-29','2026-10-30'];if(d.streak('2026-10-31')!==2)throw Error('calendar streak failed');
`,context);
ok('refresh persistence, unit progress, backup roundtrip, rejection safety, storage quota fallback, calendar days');
const spoken=[],voice={voiceURI:'English-local',lang:'en-GB'};
context.speechSynthesis={getVoices:()=>[voice],cancel:()=>{},speak:u=>spoken.push(u),pause:()=>{},resume:()=>{},addEventListener:()=>{}};
context.SpeechSynthesisUtterance=function(text){this.text=text;};
vm.runInContext(fs.readFileSync(path.join(web,'js/audio.js'),'utf8'),context);
vm.runInContext(`const reader=new HearAudio.Reader();reader.play([{en:'First.'},{en:'Second.'}],0,{rate:.75});`,context);
let first=spoken.at(-1);assert.equal(first.text,'First.');assert.equal(first.rate,.75);first.onstart();
vm.runInContext(`reader.play([{en:'First.'},{en:'Second.'}],1,{rate:1.25,single:true});`,context);
let last=spoken.at(-1);assert.equal(last.text,'Second.');assert.equal(last.rate,1.25);const length=spoken.length;first.onend();assert.equal(spoken.length,length);last.onstart();last.onend();assert(vm.runInContext('reader.finished',context));vm.runInContext('reader.stop()',context);assert(!vm.runInContext('reader.finished',context));
ok('TTS rates, exact sentence selection, stale-callback cancellation, clean stop');
vm.runInContext(`delete window.speechSynthesis;const noVoice=new HearAudio.Reader();if(noVoice.play([{en:'Hello.'}])!==false)throw Error('missing TTS not downgraded');`,context);
ok('no-TTS downgrade does not block the app');
const html=fs.readFileSync(path.join(web,'index.html'),'utf8'),css=fs.readFileSync(path.join(web,'css/styles.css'),'utf8'),app=fs.readFileSync(path.join(web,'js/app.js'),'utf8');
for(const color of ['#faf6f3','#f5ede9','#c08b92','#8e5a63','#3e3436','#8a7b7d','#e8ddd8'])assert(css.includes(color));
assert(!/https?:\/\//.test(html+css));assert(!/fetch\(|XMLHttpRequest|sendBeacon|WebSocket/.test(app));assert(!/type=["']radio/.test(html+app));assert(css.includes('@media(max-width:680px)')&&css.includes('prefers-reduced-motion'));for(const attr of [...html.matchAll(/(?:src|href)="([^"]+)"/g)])if(!attr[1].startsWith('#'))assert(fs.existsSync(path.join(web,attr[1])));
ok('declared palette, local assets, reduced motion, no upload path or quiz controls');
let JSDOM;try{JSDOM=require(process.env.HEAR_JSDOM||path.join(root,'.test-tools/node_modules/jsdom')).JSDOM;}catch{console.log('SKIP optional DOM interactions: install JSDOM as described in README.');}
async function domChecks(){
  if(!JSDOM)return;
  const scripts=['data/units.js','js/store.js','js/audio.js','js/app.js'];
  function environment({tts=true,mic='denied',saved=null}={}){
    const dom=new JSDOM(html,{url:'https://hear.test/#home',runScripts:'outside-only'}),w=dom.window,requests=[];
    w.scrollTo=()=>{};w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.confirm=()=>true;w.URL.createObjectURL=()=>`blob:local-${Math.random()}`;w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=()=>{};w.isSecureContext=true;
    if(saved)w.localStorage.setItem('hear-journal-v1',saved);
    if(tts){w.speechSynthesis={getVoices:()=>[{name:'English',voiceURI:'English-local',lang:'en-GB',localService:true}],cancel:()=>{},pause:()=>{},resume:()=>{},addEventListener:()=>{},speak:u=>{requests.push(u);u.onstart?.();}};w.SpeechSynthesisUtterance=function(text){this.text=text;};}
    if(mic==='allowed'){
      const stream={getTracks:()=>[{stop:()=>{},addEventListener:()=>{}}]};w.navigator.mediaDevices={getUserMedia:()=>Promise.resolve(stream)};
      w.MediaRecorder=class{static isTypeSupported(){return true;}constructor(){this.state='inactive';this.mimeType='audio/webm';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable?.({data:new w.Blob(['audio-bytes'],{type:'audio/webm'})});setTimeout(()=>this.onstop?.(),0);}};
    }else{w.navigator.mediaDevices={getUserMedia:()=>Promise.reject(Error('permission denied'))};w.MediaRecorder=class{static isTypeSupported(){return true;}};}
    const errors=[];w.addEventListener('error',e=>errors.push(e.error));for(const file of scripts)w.eval(fs.readFileSync(path.join(web,file),'utf8'));
    const q=s=>w.document.querySelector(s),click=s=>{const el=q(s);assert(el,`missing element ${s}`);el.click();},state=()=>JSON.parse(w.localStorage.getItem('hear-journal-v1'));
    return {dom,w,q,click,state,requests,errors};
  }
  const tick=()=>new Promise(resolve=>setTimeout(resolve,25));
  const a=environment();assert.equal(a.w.document.querySelectorAll('.unit-card').length,Math.max(8,a.w.HEAR_UNITS.length));assert.equal(a.w.document.querySelectorAll('.unit-card.available').length,a.w.HEAR_UNITS.length);ok('DOM home: eight slots, only genuine units can open');
  a.click('[data-action="begin"]');assert.equal(a.w.document.querySelectorAll('.material-button').length,5);a.click('[data-action="play"]');assert.equal(a.requests.at(-1).text,a.w.HEAR_UNITS[0].dialogues[0].lines[0].en);
  a.click('[data-action="sentence"][data-index="4"]');assert.equal(a.requests.at(-1).text,a.w.HEAR_UNITS[0].dialogues[0].lines[4].en);
  a.click('[data-action="caption"][data-mode="keywords"]');assert(a.q('.keyword'));assert(!a.q('.sentence-text .english'));
  a.click('[data-action="caption"][data-mode="hidden"]');assert(a.q('.caption-hidden'));a.click('[data-action="caption"][data-mode="full"]');assert(a.q('.sentence-text .english'));
  a.click('[data-action="favorite"]');assert.equal(a.state().favorites.length,1);a.click('[data-action="mark"][data-value="understood"]');assert.equal(a.state().marks['teenage-life/club'].listen,'understood');ok('DOM listen: exact sentence, all subtitle modes, favorite and self-mark');
  a.click('[data-action="module"][data-module="role"]');assert(a.q('[data-change="role"]'));a.click('[data-action="role-next"]');assert(a.q('.round-label').textContent.includes('2 / 6'));a.click('[data-action="role-reset"]');assert(a.q('.round-label').textContent.includes('1 / 6'));a.click('[data-action="mark"][data-value="done"]');assert.equal(a.state().marks['teenage-life/club'].role,'done');ok('DOM role: independent rounds, reset, supports and voluntary completion');
  a.click('[data-action="record"]');await tick();assert(!a.q('#record-start').disabled);assert(a.q('#notice').textContent.includes('麦克风'));ok('DOM microphone denial: friendly notice and re-enabled controls');
  a.click('[data-action="module"][data-module="retell"]');a.click('[data-action="retell-step"][data-step="notes"]');a.click('[data-action="play"]');assert.equal(a.requests.at(-1).text,a.w.HEAR_UNITS[0].stories[0].lines[0].en);const field=a.q('[data-note="Who"]');field.value='Sara and Li';field.dispatchEvent(new a.w.Event('input',{bubbles:true}));assert.equal(a.state().notes['teenage-life/lunch'].Who,'Sara and Li');a.click('[data-action="retell-step"][data-step="speak"]');a.click('[data-action="connector"]');assert(a.q('#retell-draft').value.includes('This story is about'));a.click('[data-action="mark"][data-value="done"]');assert.equal(a.state().marks['teenage-life/lunch'].retell,'done');ok('DOM story: listen while taking notes → retell, autosave, connectors and self-mark');
  const saved=a.w.localStorage.getItem('hear-journal-v1');a.click('.main-nav [data-page="home"]');assert.equal(a.q('.unit-card.available .progress-label span').textContent,'1 / 5');
  const b=environment({saved});assert.equal(b.q('.unit-card.available .progress-label span').textContent,'1 / 5');b.click('.main-nav [data-page="library"]');b.click('[data-action="library-tab"][data-tab="favorites"]');assert(b.q('[data-action="favorite-audio"]'));ok('DOM refresh: progress, notes and collections survive reload');
  b.click('.main-nav [data-page="practice"]');b.click('[data-action="module"][data-module="listen"]');b.click('[data-action="material"][data-id="homework"]');b.click('[data-action="mark"][data-value="again"]');b.click('.main-nav [data-page="library"]');b.click('[data-action="library-tab"][data-tab="review"]');assert(b.q('[data-action="review-open"]'));b.click('[data-action="review-open"]');assert(b.q('.material-title').textContent.includes('A little room'));ok('DOM review notebook opens the matching material and module');
  b.click('.main-nav [data-page="settings"]');const before=JSON.stringify(b.state());const file=b.q('#backup-file');Object.defineProperty(file,'files',{configurable:true,value:[{size:100,text:async()=>'{broken'}]});file.dispatchEvent(new b.w.Event('change',{bubbles:true}));await tick();assert.equal(JSON.stringify(b.state()),before);ok('DOM invalid import cannot replace current records');
  const backup={app:'hear-at-your-pace',state:JSON.parse(saved)};Object.defineProperty(file,'files',{configurable:true,value:[{size:100,text:async()=>JSON.stringify(backup)}]});file.dispatchEvent(new b.w.Event('change',{bubbles:true}));await tick();assert(b.q('[data-action="confirm-import"]'));b.click('[data-action="confirm-import"]');assert.equal(b.state().marks['teenage-life/club'].listen,'understood');ok('DOM valid backup requires explicit confirmation before restore');
  const c=environment({tts:false});c.click('[data-action="begin"]');c.click('[data-action="play"]');c.click('[data-action="module"][data-module="role"]');c.click('[data-action="role-next"]');c.click('[data-action="module"][data-module="retell"]');c.click('[data-action="retell-step"][data-step="speak"]');assert(c.q('#record-start'));ok('DOM no-TTS environment can still traverse all practice tools');
  const d=environment({mic:'allowed'});d.click('[data-action="begin"]');d.click('[data-action="record"]');await tick();assert(d.q('#record-start').disabled);assert(!d.q('#record-stop').disabled);d.click('[data-action="record-stop"]');await tick();await tick();assert(d.q('audio'));assert(d.state().seconds>0);assert(d.q('[data-action="download-clip"]'));ok('DOM simulated MediaRecorder: local replay, download, statistics, no-upload fallback');
  let recognitionRequests=0;d.w.webkitSpeechRecognition=function(){recognitionRequests++;};d.click('[data-action="recognize"]');assert.equal(recognitionRequests,0);assert(d.q('#notice').textContent.includes('联网'));ok('DOM optional recognition requires separate informed opt-in');
  const hostile=JSON.parse(saved);hostile.favorites[0].en='<img src=x onerror="alert(1)">';const e=environment({saved:JSON.stringify(hostile)});e.click('.main-nav [data-page="library"]');e.click('[data-action="library-tab"][data-tab="favorites"]');assert(!e.q('.pattern-card img'));assert(e.q('.pattern-card .english').textContent.includes('<img'));ok('DOM imported text is escaped rather than executed');e.dom.window.close();
  const f=environment({mic:'allowed'});f.click('[data-action="begin"]');assert.equal(f.w.document.querySelectorAll('.character-card').length,2);assert.equal(f.w.document.querySelectorAll('.character-card img').length,2);assert(f.q('[data-character="Mia"] img').src.endsWith('/assets/portraits/mia-20261101.jpg'));assert(f.q('.conversation-console>.player'));for(const profile of Object.values(f.w.HEAR_UNITS[0].characters))assert(fs.existsSync(path.join(web,profile.photo)));ok('DOM supplied portraits map to Mia and Lily in a responsive player console');
  f.click('[data-action="play"]');assert.equal(f.q('.character-card.is-speaking').dataset.character,'Mia');assert.equal(f.q('.sentence.current').dataset.line,'0');f.requests.at(-1).onend();assert.equal(f.q('.character-card.is-speaking').dataset.character,'Lily');assert.equal(f.q('.sentence.current').dataset.line,'1');f.click('[data-action="play"]');assert.equal(f.q('.character-card.is-current').dataset.state,'paused');assert(!f.q('.character-card.is-speaking'));f.click('[data-action="play"]');assert.equal(f.q('.character-card.is-speaking').dataset.character,'Lily');ok('DOM real utterance events switch portrait and transcript together; pause and resume preserve the turn');
  const stale=f.requests.at(-1);f.click('[data-action="sentence"][data-index="4"]');assert.equal(f.q('.character-card.is-speaking').dataset.character,'Mia');stale.onend();assert.equal(f.q('.character-card.is-speaking').dataset.character,'Mia');assert.equal(f.q('.sentence.current').dataset.line,'4');f.click('[data-action="caption"][data-mode="hidden"]');assert(f.q('.caption-hidden'));assert.equal(f.q('.character-card.is-speaking').dataset.character,'Mia');ok('DOM sentence jumps and hidden subtitles retain correct speaker; stale callbacks cannot steal focus');
  f.click('[data-action="caption"][data-mode="full"]');const loop=f.q('[data-change="loop"]');loop.checked=true;loop.dispatchEvent(new f.w.Event('change',{bubbles:true}));f.click('[data-action="restart"]');for(let i=0;i<12;i++)f.requests.at(-1).onend();assert.equal(f.q('.character-card.is-speaking').dataset.character,'Mia');assert.equal(f.q('.sentence.current').dataset.line,'0');f.click('[data-action="stop-speech"]');assert(!f.q('.character-card.is-current'));ok('DOM a full repeat cycle returns to the first character; stopping clears speaking state');
  f.click('[data-action="module"][data-module="role"]');const choice=f.q('[data-change="role"]');choice.value='Lily';choice.dispatchEvent(new f.w.Event('change',{bubbles:true}));assert(f.q('[data-character="Lily"]').classList.contains('is-you'));f.click('[data-action="partner-audio"]');assert.equal(f.q('.character-card.is-speaking').dataset.character,'Mia');f.requests.at(-1).onend();assert.equal(f.q('.character-card.is-current').dataset.character,'Lily');assert.equal(f.q('.character-card.is-current').dataset.state,'your-turn');f.click('[data-action="record"]');await tick();assert.equal(f.q('.character-card.is-current').dataset.character,'Lily');assert.equal(f.q('.character-card.is-current').dataset.state,'recording');f.click('[data-action="record-stop"]');await tick();ok('DOM role practice distinguishes partner speech, the learner turn and local recording');
  f.click('[data-action="module"][data-module="listen"]');f.click('[data-action="material"][data-id="homework"]');assert.equal(f.w.document.querySelectorAll('.character-card').length,2);assert.equal(f.w.document.querySelectorAll('.character-card img').length,0);assert(!f.q('[data-character="Mia"]'));assert(f.q('[data-character="Ben"] .character-fallback'));f.click('[data-action="material"][data-id="lunch"]');assert(!f.q('.speaker-deck'));ok('DOM other roles use initials, not incorrect photos; stories remove dialogue portraits');
  await tick();await tick();
  for(const env of [a,b,c,d,f]){assert.equal(env.errors.length,0,env.errors.map(e=>e.stack).join('\n'));env.dom.window.close();}
}
domChecks().then(()=>console.log(`\n${count} checks passed. Real-device audio, permissions and visual layout still require manual verification.`)).catch(error=>{console.error(error);process.exitCode=1;});
