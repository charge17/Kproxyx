// khafaa.stealth.js
// Build a stealth injection script string tuned to addons and activeNode
(function(){
  function escapeHtml(s){ return String(s).replace(/</g,'\\u003c').replace(/>/g,'\\u003e'); }
  window.buildStealthScript = function(addons, activeNode, mode){
    const spoof = {
      ua: (addons.ua ? (activeNode.ua && activeNode.ua[Math.floor(Math.random()*activeNode.ua.length)]) : (navigator.userAgent||'') ),
      platform: activeNode.platform || (navigator.platform||''),
      languages: activeNode.locales || [(navigator.language||'en-US')],
      timezone: activeNode.timezone || (Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'),
      hardwareConcurrency: activeNode.hw || (navigator.hardwareConcurrency||4),
      deviceMemory: activeNode.dm || (navigator.deviceMemory||4),
      screen: activeNode.screen || {width:screen.width||1366,height:screen.height||768,colorDepth:screen.colorDepth||24}
    };

    // build script content
    const S = JSON.stringify(spoof);
    let script = "<script>(function(){try{const S="+S+";";
    script += "try{const getImageData=CanvasRenderingContext2D.prototype.getImageData;CanvasRenderingContext2D.prototype.getImageData=function(){const d=getImageData.apply(this,arguments);for(let i=0;i<d.data.length;i+=4){d.data[i]=(d.data[i]+((Math.random()*2-1)|0))&0xFF}return d}}catch(e){};";
    script += "try{if(window.RTCPeerConnection){const OrigPC=window.RTCPeerConnection;function FakePC(){const pc=new OrigPC(...arguments);try{pc.getLocalStreams=()=>[]}catch(e){}return pc}window.RTCPeerConnection=FakePC;if(window.RTCRtpSender)window.RTCRtpSender.getCapabilities=()=>({codecs:[]})}if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=()=>Promise.reject(new Error('blocked'))}catch(e){};";
    script += "try{Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'platform',{get:()=>S.platform});Object.defineProperty(navigator,'language',{get:()=>String(S.languages[0])});Object.defineProperty(navigator,'languages',{get:()=>S.languages});Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>S.hardwareConcurrency});try{Object.defineProperty(navigator,'deviceMemory',{get:()=>S.deviceMemory})}catch(e){}";
    if(true){ script += "try{Object.defineProperty(navigator,'plugins',{get:()=>({length:0})});Object.defineProperty(navigator,'mimeTypes',{get:()=>({length:0})})}catch(e){};" }
    // UA override only if requested
    script += "if("+(addons.ua? 'true':'false')+"){try{Object.defineProperty(navigator,'userAgent',{get:()=>S.ua})}catch(e){}};";
    // Intl timezone best-effort
    script += "try{if(Intl&&Intl.DateTimeFormat){const realDTF=Intl.DateTimeFormat;Intl.DateTimeFormat=function(locale,opts){const inst=realDTF(locale||S.languages,opts);try{inst.resolvedOptions=()=>Object.assign(inst.resolvedOptions(),{timeZone:S.timezone})}catch(e){}return inst}}}catch(e){};";
    if(addons.tracker){ script += "const _blockList=['google-analytics','facebook.net','doubleclick','hotjar','mixpanel'];const _origFetch=window.fetch;window.fetch=function(u,...r){if(_blockList.some(b=>String(u).includes(b)))return Promise.resolve(new Response('',{status:204}));return _origFetch(u,...r)};" }
    if(addons.adblock){ script += "document.addEventListener('DOMContentLoaded',()=>{['.ad','[id*=\\\"ad\\\"]','iframe[src*=\\\"ads\\\"]'].forEach(s=>document.querySelectorAll(s).forEach(el=>el.remove()))});" }
    script += "console.log('Khafaa Pro Stealth Active – node:'+S.platform);";
    script += "}catch(e){console.warn('stealth inject err',e)} })()<\/script>";
    return script;
  };
})();
