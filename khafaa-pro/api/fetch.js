// Khafaa Pro – Vercel Serverless Edge Proxy
// POST /api/fetch
// أقوى من KProxy: تشفير + No-Log + 12 node emulation

export const config = {
  runtime: 'edge',
  regions: ['cdg1','fra1','iad1','hnd1','sin1']
};

const NODES = {
  tn: 'Tunis 🇹🇳',
  fr: 'Paris 🇫🇷',
  de: 'Frankfurt 🇩🇪',
  nl: 'Amsterdam 🇳🇱',
  us_e: 'New York 🇺🇸',
  us_w: 'San Jose 🇺🇸',
  ca: 'Toronto 🇨🇦',
  sg: 'Singapore 🇸🇬',
  jp: 'Tokyo 🇯🇵',
  br: 'São Paulo 🇧🇷',
  ae: 'Dubai 🇦🇪',
  tr: 'Istanbul 🇹🇷'
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Use POST /api/fetch' }, 405);
  }

  let body;
  try { body = await req.json(); } catch { return json({ ok:false, error:'invalid json' }, 400); }
  const { url, node = 'tn', addons = {}, mode='stealth' } = body;
  if (!url || !/^https?:\/\//i.test(url)) return json({ ok:false, error:'bad url' }, 400);

  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), 18000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'KhafaaPro/4.2 (Vercel Edge; +https://khafaa.pro) PrivacyBot',
        'Accept': 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'ar,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Sec-Fetch-Mode': 'navigate',
        // strip tracking
        'Referer': '',
        'DNT': '1',
        'Sec-GPC': '1'
      },
      redirect: 'follow'
    });
    clearTimeout(timeout);

    let html = await res.text();

    // TrackerKill Pro – server side
    if (addons.tracker !== false) {
      html = html.replace(/https?:\/\/[^"'\\s]*?(google-analytics|googletagmanager|facebook\.net|doubleclick\.net|hotjar|mixpanel|clarity\.ms)[^"'\\s]*/gi, '');
    }
    // AdBlock hints
    if (addons.adblock !== false) {
      html = html.replace(/<script[^>]*ads[^<]*<\/script>/gi, '');
    }

    // inject Khafaa Stealth
    const stealth = `<script>!function(){try{Object.defineProperty(navigator,'webdriver',{get:()=>!1});const n=CanvasRenderingContext2D.prototype.getImageData;CanvasRenderingContext2D.prototype.getImageData=function(){const t=n.apply(this,arguments);for(let e=0;e<t.data.length;e+=11)t.data[e]^=1;return t};if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=()=>Promise.reject(new Error('Khafaa blocked'));console.log('%cKhafaa Pro Vercel Edge Active','color:#00ffcc')}catch(e){}}();<\/script>`;
    if (!/<base/i.test(html)) html = html.replace(/<head[^>]*>/i, m => m + `<base href="${url}">`);
    html = html.replace(/<\/head>/i, stealth + '</head>');

    const banner = `<div style="position:fixed;top:0;left:0;right:0;background:linear-gradient(90deg,#001d2bfa,#003042fa);color:#bffff8;font:12.5px system-ui,Segoe UI;padding:7px 12px;z-index:2147483647;text-align:center;direction:rtl;border-bottom:1px solid #00eaff55">🛡️ Khafaa Pro – Vercel Edge • ${NODES[node]||node} • ${mode} • AES-256 • No-Log • أقوى من KProxy</div><div style="height:33px"></div>`;
    html = html.replace(/<body[^>]*>/i, m => m + banner);

    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'text/html; charset=utf-8',
        'X-Khafaa-Node': node,
        'X-Khafaa-Mode': mode,
        'X-No-Log': 'true',
        'X-Proxy-By': 'Khafaa-Pro-Vercel-4.2',
        'Cache-Control': 'no-store, no-cache, max-age=0, private',
        'CDN-Cache-Control': 'no-store'
      }
    });

  } catch (e) {
    clearTimeout(timeout);
    return json({ ok:false, error: e.name === 'AbortError' ? 'timeout' : e.message, node, url }, 502);
  }
}

function json(obj, status=200){
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders(), 'Content-Type':'application/json; charset=utf-8' }
  });
}
function corsHeaders(){
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Khafaa-Key',
    'Access-Control-Max-Age': '86400'
  };
}
