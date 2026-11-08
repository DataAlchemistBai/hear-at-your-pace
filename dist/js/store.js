(function(root){
  'use strict';
  const KEY='hear-journal-v1';
  const day=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const empty=()=>({version:1,marks:{},attempts:{},favorites:[],notes:{},history:[],days:[],seconds:0,prefs:{rate:1,caption:'full',voice:'',translation:true},last:{unit:'teenage-life',module:'listen',material:'club'}});
  const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
  const safeKey=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9/._-]{0,150}$/.test(x)&&!x.includes('__proto__')&&!x.includes('constructor');
  const short=(x,n=2000)=>typeof x==='string'&&x.length<=n;
  function validate(x){
    if(!plain(x)||x.version!==1)throw Error('这份备份的版本暂不支持，请选择本网站导出的 JSON。');
    for(const name of ['marks','attempts','notes','prefs','last'])if(!plain(x[name]))throw Error('备份结构不完整，原有数据没有改变。');
    for(const name of ['favorites','history','days'])if(!Array.isArray(x[name]))throw Error('备份结构不完整，原有数据没有改变。');
    if(x.favorites.length>5000||x.history.length>10000||x.days.length>10000)throw Error('备份条目过多，请检查文件。');
    if(!Number.isFinite(x.seconds)||x.seconds<0||x.seconds>1e9)throw Error('录音时长数据无法读取。');
    const out=empty();out.seconds=x.seconds;
    for(const [k,v]of Object.entries(x.marks)){
      if(!safeKey(k)||!plain(v))throw Error('进度数据无法读取。');
      const clean={};for(const [module,mark]of Object.entries(v)){if(!['listen','role','retell'].includes(module)||!['understood','done','again'].includes(mark))throw Error('自我标记无法读取。');clean[module]=mark;}out.marks[k]=clean;
    }
    for(const [k,v]of Object.entries(x.attempts)){if(!safeKey(k)||!Number.isInteger(v)||v<0||v>1e8)throw Error('练习次数无法读取。');out.attempts[k]=v;}
    for(const [k,v]of Object.entries(x.notes)){
      if(!safeKey(k)||!plain(v))throw Error('笔记数据无法读取。');
      const note={};for(const [field,text]of Object.entries(v)){if(!['Who','What','When','Where','Why','How','draft','checks'].includes(field))continue;if(field==='checks'){if(!Array.isArray(text)||text.length>50||text.some(t=>typeof t!=='boolean'))throw Error('要点清单无法读取。');note[field]=text.slice();}else{if(!short(text,10000))throw Error('笔记过长，原有数据没有改变。');note[field]=text;}}out.notes[k]=note;
    }
    out.favorites=x.favorites.map(f=>{if(!plain(f)||!safeKey(f.id)||!safeKey(f.unit)||!short(f.en)||!short(f.zh)||!short(f.source,200))throw Error('收藏内容无法读取。');return {id:f.id,unit:f.unit,en:f.en,zh:f.zh,source:f.source};});
    if(new Set(out.favorites.map(f=>f.id)).size!==out.favorites.length)throw Error('收藏包含重复条目，请检查备份。');
    out.history=x.history.map(h=>{if(!plain(h)||!safeKey(h.unit)||!safeKey(h.material)||!['listen','role','retell','record','library'].includes(h.module)||!short(h.action,200)||!short(h.at,40)||Number.isNaN(Date.parse(h.at))||!/^\d{4}-\d{2}-\d{2}$/.test(h.day))throw Error('练习历史无法读取。');return {unit:h.unit,material:h.material,module:h.module,action:h.action,at:h.at,day:h.day};});
    if(x.days.some(d=>typeof d!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d)))throw Error('日期数据无法读取。');
    out.days=[...new Set(x.days)].sort();
    out.prefs={rate:[.75,1,1.25].includes(x.prefs.rate)?x.prefs.rate:1,caption:['full','keywords','hidden'].includes(x.prefs.caption)?x.prefs.caption:'full',voice:short(x.prefs.voice,300)?x.prefs.voice:'',translation:x.prefs.translation!==false};
    if(safeKey(x.last.unit)&&safeKey(x.last.material)&&['listen','role','retell','patterns'].includes(x.last.module))out.last={unit:x.last.unit,module:x.last.module,material:x.last.material};
    return out;
  }
  class JournalStore{
    constructor(storage){this.storage=storage;this.state=empty();this.persistent=true;try{const raw=storage&&storage.getItem(KEY);if(raw)this.state=validate(JSON.parse(raw));}catch{this.persistent=false;}}
    save(){try{if(!this.storage)throw Error();this.storage.setItem(KEY,JSON.stringify(this.state));return true;}catch{this.persistent=false;this.onWarning?.();return false;}}
    log(unit,material,module,action,count=true){const d=day();if(count){const k=`${unit}/${module}/${material}`;this.state.attempts[k]=(this.state.attempts[k]||0)+1;}if(!this.state.days.includes(d))this.state.days.push(d);this.state.history.unshift({unit,material,module,action,at:new Date().toISOString(),day:d});this.state.history=this.state.history.slice(0,10000);this.save();}
    mark(unit,material,module,value){const k=`${unit}/${material}`;this.state.marks[k]??={};this.state.marks[k][module]=value;this.log(unit,material,module,value==='again'?'还想再练一遍':module==='listen'?'我听懂了':'我练过了',true);}
    favorite(item){const i=this.state.favorites.findIndex(f=>f.id===item.id);if(i>=0)this.state.favorites.splice(i,1);else this.state.favorites.unshift(item);this.save();return i<0;}
    export(){return {app:'hear-at-your-pace',exportedAt:new Date().toISOString(),state:this.state};}
    parseBackup(value){if(!plain(value)||value.app!=='hear-at-your-pace')throw Error('请选择「听见」导出的备份文件。');return validate(value.state);}
    restore(value){this.state=validate(value);this.save();}
    streak(today=day()){const dates=new Set(this.state.days);let end=new Date(today+'T12:00:00');if(!dates.has(day(end)))end.setDate(end.getDate()-1);let n=0;while(dates.has(day(end))){n++;end.setDate(end.getDate()-1);}return n;}
    progress(unit){const all=[...unit.dialogues,...unit.stories];const done=(items,module)=>items.filter(m=>['understood','done'].includes(this.state.marks[`${unit.id}/${m.id}`]?.[module])).length;return {listen:[done(all,'listen'),all.length],role:[done(unit.dialogues,'role'),unit.dialogues.length],retell:[done(unit.stories,'retell'),unit.stories.length]};}
  }
  root.HearStore={JournalStore,empty,validate,day,KEY};
})(typeof window!=='undefined'?window:globalThis);
