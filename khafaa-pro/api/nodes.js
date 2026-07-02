export const config = { runtime: 'edge' };

export default function handler(){
  const nodes = [
    {id:'tn', name:'تونس', flag:'🇹🇳', city:'TN-Stealth', ping:18, active:true},
    {id:'fr', name:'فرنسا', flag:'🇫🇷', city:'Paris', ping:42, active:true},
    {id:'de', name:'ألمانيا', flag:'🇩🇪', city:'Frankfurt', ping:48, active:true},
    {id:'nl', name:'هولندا', flag:'🇳🇱', city:'Amsterdam', ping:51, active:true},
    {id:'us_e', name:'أمريكا شرق', flag:'🇺🇸', city:'New York', ping:112, active:true},
    {id:'us_w', name:'أمريكا غرب', flag:'🇺🇸', city:'San Jose', ping:156, active:true},
    {id:'ca', name:'كندا', flag:'🇨🇦', city:'Toronto', ping:118, active:true},
    {id:'sg', name:'سنغافورة', flag:'🇸🇬', city:'Singapore', ping:188, active:true},
    {id:'jp', name:'اليابان', flag:'🇯🇵', city:'Tokyo', ping:205, active:true},
    {id:'br', name:'البرازيل', flag:'🇧🇷', city:'São Paulo', ping:172, active:true},
    {id:'ae', name:'الإمارات', flag:'🇦🇪', city:'Dubai', ping:76, active:true},
    {id:'tr', name:'تركيا', flag:'🇹🇷', city:'Istanbul', ping:58, active:true}
  ];
  return new Response(JSON.stringify({ok:true, count:nodes.length, nodes, kproxy_comparison:'KProxy has only 2-4 servers'}), {
    headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Cache-Control':'s-maxage=60'}
  });
}
