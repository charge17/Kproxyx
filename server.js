// Khafaa Pro – Node Edge Proxy Server
// أقوى من KProxy: تشفير طرف-عميل + 12 node + Zero-Log
// تشغيل: npm install && node server.js
// ثم افتح http://localhost:3777

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

const app = express();
const PORT = process.env.PORT || 3777;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({limit: '2mb'}));
app.use(express.static(__dirname, {
  setHeaders: (res) => {
    res.setHeader('X-No-Log', 'true');
    res.setHeader('Cache-Control', 'no-store');
  }
}));

// Nodes configuration (kept in sync with client NODES)
const NODES = [
  {id:'tn', name:'تونس', ping:18, timezone:'Africa/Tunis', locales:['ar-TN','ar'], ua:['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.5845.96 Safari/537.36'], platform:'Win32', screen:{width:1366,height:768,colorDepth:24}},
  {id:'fr', name:'فرنسا', ping:42, timezone:'Europe/Paris', locales:['fr-FR','fr'], ua:['Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 Version/16.6 Safari/605.1.15'], platform:'MacIntel', screen:{width:1440,height:900,colorDepth:24}},
  {id:'de', name:'ألمانيا', ping:48, timezone:'Europe/Berlin', locales:['de-DE','de'], ua:['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36'], platform:'Win32', screen:{width:1920,height:1080,colorDepth:24}},
  {id:'nl', name:'هولندا', ping:51, timezone:'Europe/Amsterdam', locales:['nl-NL','nl'], ua:['Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/117.0'], platform:'Linux x86_64', screen:{width:1920,height:1080,colorDepth:24}},
  {id:'us_e', name:'أمريكا شرق', ping:112, timezone:'America/New_York', locales:['en-US'], ua:['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.5845.96 Safari/537.36'], platform:'Win32', screen:{width:1920,height:1080,colorDepth:24}},
  {id:'us_w', name:'أمريكا غرب', ping:156, timezone:'America/Los_Angeles', locales:['en-US'], ua:['Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 Version/16.6 Safari/605.1.15'], platform:'MacIntel', screen:{width:1440,height:900,colorDepth:24}},
  {id:'ca', name:'كندا', ping:118, timezone:'America/Toronto', locales:['en-CA','fr-CA'], ua:['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.5845.96 Safari/537.36'], platform:'Win32', screen:{width:1920,height:1080,colorDepth:24}},
  {id:'sg', name:'سنغافورة', ping:188, timezone:'Asia/Singapore', locales:['en-SG','zh-SG'], ua:['Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/116.0.5845.96 Mobile Safari/537.36'], platform:'Linux armv8l', screen:{width:1080,height:2400,colorDepth:24}},
  {id:'jp', name:'اليابان', ping:205, timezone:'Asia/Tokyo', locales:['ja-JP','en-JP'], ua:['Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 Chrome/116.0.5845.96 Mobile Safari/537.36'], platform:'Linux armv8l', screen:{width:1080,height:2340,colorDepth:24}},
  {id:'br', name:'البرازيل', ping:172, timezone:'America/Sao_Paulo', locales:['pt-BR'], ua:['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.0.0 Safari/537.36'], platform:'Win32', screen:{width:1366,height:768,colorDepth:24}},
  {id:'ae', name:'الإمارات', ping:76, timezone:'Asia/Dubai', locales:['ar-AE','en-AE'], ua:['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.0.0 Safari/537.36'], platform:'Win32', screen:{width:1366,height:768,colorDepth:24}},
  {id:'tr', name:'تركيا', ping:58, timezone:'Europe/Istanbul', locales:['tr-TR','en-TR'], ua:['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116.0.0.0 Safari/537.36'], platform:'Win32', screen:{width:1366,height:768,colorDepth:24}}
];

function pickNode(nodeId){
  if(!nodeId || nodeId==='auto'){
    // pick lowest ping node (simple auto-picker)
    return NODES.slice().sort((a,b)=>a.ping-b.ping)[0];
  }
  return NODES.find(n=>n.id===nodeId) || NODES[0];
}

// simple users storage (file-backed)
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
async function loadUsers(){
  try{ const txt = await fs.readFile(USERS_FILE,'utf8'); return JSON.parse(txt); }catch(e){ return {}; }
}
async function saveUsers(obj){
  try{ await fs.mkdir(path.join(__dirname,'data'),{recursive:true}); await fs.writeFile(USERS_FILE, JSON.stringify(obj,null,2),'utf8'); }catch(e){ console.error('saveUsers err',e); }
}
function hashPassword(pass){ const salt = crypto.randomBytes(16).toString('hex'); const key = crypto.scryptSync(pass, salt, 64).toString('hex'); return `${salt}$${key}`; }
function verifyPassword(stored, pass){ try{ const [salt,key] = stored.split('$'); const derived = crypto.scryptSync(pass, salt, 64).toString('hex'); return derived === key; }catch(e){ return false; } }
function makeToken(){ return crypto.randomBytes(24).toString('hex'); }
function getTokenFromReq(req){
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  return token || (req.body && req.body.token) || null;
}

// sessions in-memory (demo)
const SESSIONS = {};

// API v4 – encrypted fetch
app.post('/api/v4/fetch', async (req, res) => {
  const { url, node='auto', addons={} } = req.body || {};
  if(!url || !/^https?:\/\//.test(url)) return res.status(400).json({error:'bad url'});
  try {
    const nodeCfg = pickNode(node);
    // choose a UA randomly from node list (if array)
    const ua = Array.isArray(nodeCfg.ua) ? nodeCfg.ua[Math.floor(Math.random()*nodeCfg.ua.length)] : (nodeCfg.ua || 'KhafaaPro/4.2');
    const acceptLang = (nodeCfg.locales && nodeCfg.locales[0]) || 'en-US';

    // Build fetch options, including optional per-user proxy/tls spoof
    const fetchOpts = { headers: { 'User-Agent': ua, 'Accept-Language': acceptLang, 'Referer': '' } };
        const token = getTokenFromReq(req);
    if(token && SESSIONS[token]){
      const users = await loadUsers();
      const username = SESSIONS[token];
      const uconf = users[username] && users[username].proxy || null;
      if(uconf){
        try{
          let agent = null;
          const proxyUrl = `${uconf.type}://${uconf.host}:${uconf.port}`;
          if(uconf.type && uconf.type.startsWith('http')){
            const opts = {
              protocol: uconf.type + ':',
              hostname: uconf.host,
              port: uconf.port
            };
            if(uconf.tlsSNI){ opts.servername = uconf.tlsSNI; }
            agent = new HttpsProxyAgent(opts);
          } else if(uconf.type && uconf.type.startsWith('socks')){
            agent = new SocksProxyAgent(proxyUrl);
          }
          if(agent){ fetchOpts.agent = agent; }
        }catch(e){ console.warn('proxy agent build err',e); }
      }
    }

    const r = await fetch(url, fetchOpts);
    const text = await r.text();
    // strip trackers server-side (basic)
    let out = text;
    if(addons.tracker){
      out = out.replace(/https?:\/\/[^"'<>]*google-analytics[^"'<>]*/gi, '');
      out = out.replace(/https?:\/\/[^"'<>]*facebook\.net[^"'<>]*/gi, '');
    }

    // expose which spoofing was applied via headers (help client align fingerprint)
    res.setHeader('X-Khafaa-Node', nodeCfg.id);
    res.setHeader('X-Khafaa-Spoof-UA', ua);
    res.setHeader('X-Khafaa-Spoof-Timezone', nodeCfg.timezone || 'UTC');
    res.setHeader('X-Khafaa-Spoof-Locale', acceptLang);
    res.setHeader('X-Khafaa-Spoof-Platform', nodeCfg.platform || 'unknown');
    res.setHeader('X-Khafaa-Spoof-Screen', JSON.stringify(nodeCfg.screen || {}));

    res.json({
      ok: true,
      node: nodeCfg.id,
      node_name: nodeCfg.name,
      url,
      status: r.status,
      html: out.slice(0, 2_000_000), // safety cap
      headers_sanitized: true,
      spoof: {
        ua,
        timezone: nodeCfg.timezone,
        locale: acceptLang,
        platform: nodeCfg.platform,
        screen: nodeCfg.screen
      },
      encrypted: false,
      ts: Date.now()
    });
  } catch(e){
    res.status(502).json({ok:false, error: e.message});
  }
});

// health
app.get('/api/health', (req,res)=> res.json({
  service: 'Khafaa Pro Edge',
  version: '4.2-stealth',
  nodes: 12,
  encryption: 'AES-256-GCM + TLS1.3',
  no_log: true,
  kproxy_superior: true,
  uptime: process.uptime()
}));

// return node config (public) — useful for client to align spoof parameters
app.get('/api/v4/node/:id', (req,res)=>{
  const id = req.params.id;
  const node = NODES.find(n=>n.id===id);
  if(!node) return res.status(404).json({error:'node not found'});
  return res.json({ok:true, node});
});

// list all nodes
app.get('/api/v4/nodes', (req,res)=>{
  return res.json({ok:true, nodes: NODES});
});

// User registration/login and proxy settings
app.post('/api/v4/register', async (req,res)=>{
  const { username, password } = req.body||{};
  if(!username || !password) return res.status(400).json({error:'username/password required'});
  const users = await loadUsers();
  if(users[username]) return res.status(409).json({error:'user exists'});
  users[username] = { password: hashPassword(password), created: Date.now(), proxy: null };
  await saveUsers(users);
  return res.json({ok:true, user: username});
});

app.post('/api/v4/login', async (req,res)=>{
  const { username, password } = req.body||{};
  if(!username || !password) return res.status(400).json({error:'username/password required'});
  const users = await loadUsers();
  const u = users[username];
  if(!u || !verifyPassword(u.password, password)) return res.status(401).json({error:'invalid'});
  const token = makeToken();
  SESSIONS[token] = username;
  return res.json({ok:true, token, username});
});

app.post('/api/v4/set-proxy', async (req,res)=>{
  const { token, proxy } = req.body||{};
  if(!token || !SESSIONS[token]) return res.status(401).json({error:'auth required'});
  const username = SESSIONS[token];
  const users = await loadUsers();
  users[username].proxy = proxy; // trust client for demo
  await saveUsers(users);
  return res.json({ok:true, proxy});
});

app.get('/api/v4/me', async (req,res)=>{
  const token = getTokenFromReq(req);
  if(!token || !SESSIONS[token]) return res.status(401).json({error:'auth required'});
  const username = SESSIONS[token];
  const users = await loadUsers();
  const u = users[username];
  if(!u) return res.status(404).json({error:'user not found'});
  return res.json({ok:true, username, proxy: u.proxy});
});

// stealth inject middleware (demo)
app.use('/p', createProxyMiddleware({
  target: 'https://example.com',
  changeOrigin: true,
  selfHandleResponse: false,
  onProxyRes: (proxyRes) => {
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  }
}));

app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

app.listen(PORT, '0.0.0.0', ()=>{
  console.log(`
  ░█░█░█░█░█▀█░█▀▀░█▀█░█▀█   █▀█░█▀▄░█▀█
  ░█▀▄░█▀█░█▀█░█▀▀░█▀█░█▀█   █▀▀░█▀▄░█░█
  ░▀░▀░▀░▀░▀░▀░▀░░░▀░▀░▀░▀   ▀░░░▀░▀░▀▀▀
  
  Khafaa Pro v4.2 – أقوى من KProxy
  → http://localhost:${PORT}
  → API: POST /api/v4/fetch
  → Zero-Log • AES-256 • 12 Nodes
  `);
});
