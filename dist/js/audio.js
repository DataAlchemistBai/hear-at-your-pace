(function(root){
  'use strict';
  class Reader{
    constructor(){this.supported=!!(root.speechSynthesis&&root.SpeechSynthesisUtterance);this.token=0;this.index=0;this.running=false;this.paused=false;this.finished=false;this.voices=[];this.refreshVoices();if(this.supported)root.speechSynthesis.addEventListener?.('voiceschanged',()=>{this.refreshVoices();this.onVoices?.();});}
    refreshVoices(){this.voices=this.supported?root.speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang)):[];}
    stop(){this.token++;clearTimeout(this.timer);if(this.supported)root.speechSynthesis.cancel();this.running=false;this.paused=false;this.finished=false;this.utterance=null;this.onState?.('stopped');}
    play(lines,start=0,options={}){
      this.stop();if(!this.supported){this.onMessage?.('当前浏览器没有朗读功能。你仍可以阅读、跟读和自由开口，所有步骤都能继续。');return false;}
      this.lines=lines;this.options=options;this.index=Math.max(0,Math.min(start,lines.length-1));this.finished=false;this.running=true;const token=this.token;this.speak(token);return true;
    }
    speak(token){
      if(token!==this.token||!this.lines?.length)return;
      this.onState?.('loading');
      const text=this.lines[this.index].en;const u=new root.SpeechSynthesisUtterance(text);this.utterance=u;u.lang='en-GB';u.rate=this.options.rate||1;
      const selected=this.voices.find(v=>v.voiceURI===this.options.voice)||this.voices.find(v=>/^en-GB/i.test(v.lang))||this.voices[0];if(selected)u.voice=selected;
      u.onstart=()=>{if(token!==this.token)return;clearTimeout(this.timer);this.onState?.('playing');this.onPosition?.(this.index,0);};
      u.onboundary=event=>{if(token===this.token)this.onPosition?.(this.index,Math.min(1,(event.charIndex||0)/Math.max(1,text.length)));};
      u.onend=()=>{
        if(token!==this.token)return;clearTimeout(this.timer);this.onPosition?.(this.index,1);
        if(!this.options.single&&this.index<this.lines.length-1){this.index++;this.speak(token);}
        else if(this.options.loop){if(!this.options.single)this.index=0;this.onCycle?.();this.speak(token);}
        else{this.running=false;this.finished=true;this.utterance=null;this.onState?.('finished');this.options.onEnd?.();}
      };
      u.onerror=event=>{if(token!==this.token)return;this.stop();if(!['canceled','interrupted'].includes(event.error))this.onMessage?.('这次朗读没有连上。可以再点一次，或先看文本继续练习；不影响你的记录。');};
      this.timer=setTimeout(()=>{if(token===this.token&&this.running&&!this.paused){this.stop();this.onMessage?.('系统语音暂未准备好。请检查设备的英语语音包，或先阅读文本继续练习。');}},12000);
      root.speechSynthesis.speak(u);
    }
    togglePause(){if(!this.running)return;if(this.paused){root.speechSynthesis.resume();this.paused=false;this.onState?.('playing');}else{root.speechSynthesis.pause();this.paused=true;clearTimeout(this.timer);this.onState?.('paused');}}
  }
  class LocalRecordings{
    constructor(){this.memory=new Map();this.dbPromise=null;}
    db(){
      if(this.dbPromise)return this.dbPromise;
      this.dbPromise=new Promise(resolve=>{
        if(!root.indexedDB){resolve(null);return;}
        let settled=false;const finish=db=>{if(settled){db?.close();return;}settled=true;resolve(db);};
        const request=root.indexedDB.open('hear-local-recordings',1);
        request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('clips'))db.createObjectStore('clips',{keyPath:'id'});};
        request.onsuccess=()=>finish(request.result);request.onerror=()=>finish(null);request.onblocked=()=>finish(null);setTimeout(()=>finish(null),5000);
      });return this.dbPromise;
    }
    async put(clip){this.memory.set(clip.id,clip);const db=await this.db();if(!db)return false;return new Promise(resolve=>{try{const t=db.transaction('clips','readwrite');t.objectStore('clips').put(clip);t.oncomplete=()=>resolve(true);t.onerror=t.onabort=()=>resolve(false);}catch{resolve(false);}});}
    async all(){const db=await this.db();let values=[];if(db)values=await new Promise(resolve=>{try{const r=db.transaction('clips').objectStore('clips').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve([]);}catch{resolve([]);}});const merged=new Map(values.map(c=>[c.id,c]));for(const [k,v]of this.memory)merged.set(k,v);return [...merged.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
    async remove(id){this.memory.delete(id);const db=await this.db();if(!db)return true;return new Promise(resolve=>{try{const t=db.transaction('clips','readwrite');t.objectStore('clips').delete(id);t.oncomplete=()=>resolve(true);t.onerror=t.onabort=()=>resolve(false);}catch{resolve(false);}});}
  }
  class Recorder{
    constructor(clips){this.clips=clips;this.request=0;this.active=false;this.pending=false;}
    get supported(){return !!(root.isSecureContext&&root.navigator?.mediaDevices?.getUserMedia&&root.MediaRecorder);}
    async start(context){
      if(this.pending||this.active)return;
      if(!this.supported){this.onMessage?.('这里暂时不能录音。请用 HTTPS 或 localhost 并允许麦克风；也可以直接开口练习，或用手机录音机保存。');return;}
      this.pending=true;const request=++this.request;this.onState?.('requesting');let stream;
      try{
        stream=await root.navigator.mediaDevices.getUserMedia({audio:true});
        if(request!==this.request){stream.getTracks().forEach(t=>t.stop());return;}
        this.stream=stream;const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(t=>root.MediaRecorder.isTypeSupported?.(t));
        this.recorder=new root.MediaRecorder(stream,mime?{mimeType:mime}:undefined);this.chunks=[];this.context={...context};this.started=performance.now();this.active=true;this.pending=false;
        this.recorder.ondataavailable=e=>{if(e.data.size)this.chunks.push(e.data);};
        this.recorder.onerror=()=>{this.stop();this.onMessage?.('录音暂时中断了。可以重新尝试，也可以不录音直接练习。');};
        this.recorder.onstop=async()=>{
          clearInterval(this.interval);clearTimeout(this.limit);this.stream?.getTracks().forEach(t=>t.stop());this.active=false;
          const blob=new Blob(this.chunks,{type:this.recorder.mimeType||mime||'audio/webm'});const seconds=Math.min(600,Math.max(.1,(this.stoppedAt-this.started)/1000));
          if(blob.size){const clip={...this.context,id:root.crypto?.randomUUID?.()||`clip-${Date.now()}-${Math.random().toString(16).slice(2)}`,blob,seconds,createdAt:new Date().toISOString()};const persisted=await this.clips.put(clip);this.onSaved?.(clip,persisted);}
          this.onState?.('idle');
        };
        stream.getTracks().forEach(track=>track.addEventListener('ended',()=>this.stop(),{once:true}));this.recorder.start();this.onState?.('recording');
        this.interval=setInterval(()=>this.onTick?.((performance.now()-this.started)/1000),500);
        this.limit=setTimeout(()=>{this.stop();this.onMessage?.('这一段已录了十分钟，先保存下来。还想说的话，随时可以再录一段。');},600000);
      }catch{stream?.getTracks().forEach(t=>t.stop());if(request!==this.request)return;this.pending=false;this.active=false;this.onState?.('idle');this.onMessage?.('还没有获得麦克风权限。你可以在浏览器设置中允许，也可以直接开口；不用录音也能完成练习。');}
    }
    stop(){this.stoppedAt=performance.now();if(this.recorder?.state==='recording')this.recorder.stop();}
    cancelPending(){if(this.pending){this.request++;this.pending=false;this.onState?.('idle');}}
  }
  root.HearAudio={Reader,LocalRecordings,Recorder};
})(window);
