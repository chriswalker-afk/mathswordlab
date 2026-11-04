import {createHash} from 'node:crypto';

const url='https://mathswordslab.netlify.app/';
const response=await fetch(url,{redirect:'follow',headers:{'User-Agent':'MathsWordsLab-MigrationAudit/1.0'},signal:AbortSignal.timeout(25000)});
const html=await response.text();
if(!response.ok)throw Error('Live Netlify site did not return OK: '+response.status);
const hash=createHash('sha256').update(html).digest('hex');
const matches=(re)=>[...html.matchAll(re)].map(m=>m[1]);
const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim()??null;
const externalScripts=matches(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi);
const externalCSS=matches(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi);
const otherCSS=matches(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']stylesheet["']/gi);
const images=matches(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi);
const fonts=matches(/<link\b[^>]*\brel=["'](?:preload|preconnect)["'][^>]*\bhref=["']([^"']+)["']/gi);
const assets=[...new Set([...externalScripts,...externalCSS,...otherCSS,...images,...fonts])];
const internalAssets=assets.filter(s=>{try{return new URL(s,url).origin===new URL(url).origin}catch{return false}});
const netlifyInjection=externalScripts.filter(s=>s.startsWith('/.netlify/'));
console.log('SITE_AUDIT='+JSON.stringify({
  source:url,status:response.status,redirectedTo:response.url,title,bytes:Buffer.byteLength(html,'utf8'),sha256:hash,
  inlineScriptCount:(html.match(/<script\b(?![^>]*\bsrc=)/gi)||[]).length,
  inlineStyleCount:(html.match(/<style\b/gi)||[]).length,
  externalScripts,externalCSS:[...externalCSS,...otherCSS],images:images.slice(0,40),otherReferencedAssets:fonts,
  internalAssets,netlifyInjection,hasNetlifyFunctions:/\/\.netlify\/functions\//.test(html),
  hasNetlifyForms:/data-netlify\s*=|netlify\s*=/i.test(html),
  hasNetlifyIdentity:/netlify-identity/i.test(html),
  hasServiceWorker:/serviceWorker\.register/.test(html),
  hasLocalStorage:/localStorage|indexedDB/.test(html),
  containsWordsLab:/Words Lab|Vocabulary Lab|Maths Word/i.test(html)
}));
for(const asset of internalAssets){
  const resolved=new URL(asset,url);const res=await fetch(resolved,{signal:AbortSignal.timeout(15000)});
  const type=res.headers.get('content-type')??'';
  console.log('ASSET_AUDIT='+JSON.stringify({path:asset,url:resolved.href,status:res.status,type,bytes:res.headers.get('content-length')}));
  if(!res.ok)throw Error('Asset unavailable: '+asset);
}
