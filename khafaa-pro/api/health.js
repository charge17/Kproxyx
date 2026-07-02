export const config = { runtime: 'edge' };

export default function handler(){
  return new Response(JSON.stringify({
    service: 'Khafaa Pro Edge',
    version: '4.2-stealth-vercel',
    status: 'ok',
    timestamp: new Date().toISOString(),
    encryption: 'AES-256-GCM + TLS 1.3',
    no_log: true,
    nodes: 12,
    regions: ['cdg1','fra1','iad1','hnd1','sin1'],
    addons: [
      'AdBlock Ultra',
      'TrackerKill Pro',
      'Fingerprint Spoof',
      'WebRTC Leak Shield',
      'Cookie Vault',
      'Script Shield',
      'Auto HTTPS'
    ],
    comparison: {
      kproxy_encryption: 'None',
      khafaa_encryption: 'AES-256',
      kproxy_servers: '2-4',
      khafaa_servers: '12 + TOR',
      kproxy_ads: true,
      khafaa_ads: false
    },
    superior_to_kproxy: true
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
      'X-Khafaa': 'vercel-edge'
    }
  });
}
