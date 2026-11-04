import {createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';

const source='https://mathswordslab.netlify.app/';
const response=await fetch(source,{redirect:'follow',headers:{'User-Agent':'MathsWordsLab-GitHubMigration/1.0'},signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error('Cannot retrieve live source: '+response.status);
let html=await response.text();
if(!/^<!doctype html>/i.test(html.trimStart())||!/<title>Maths Words Lab\b/i.test(html)||Buffer.byteLength(html,'utf8')<700000){
  throw Error('Unexpected live document; will not overwrite the repository');
}
// Netlify injects this dashboard overlay script outside the application HTML.
// GitHub Pages does not serve the Netlify HUD endpoint, so remove only that tag.
const netlifyHud=/<script\b(?=[^>]*\bsrc=["']\/\.netlify\/scripts\/hud\?variant=public["'])[^>]*><\/script>[ \t]*\r?\n?/g;
const injectionTags=[...html.matchAll(netlifyHud)];
if(injectionTags.length!==1)throw Error('Expected exactly one Netlify-only HUD tag; found '+injectionTags.length);
html=html.replace(netlifyHud,'');
if(!html.includes('<style')||!html.includes('<script'))throw Error('Missing embedded styles or scripts');
if(html.includes('src="/.netlify/'))throw Error('Unexpected Netlify-specific external asset remains');
writeFileSync(new URL('../index.html',import.meta.url),html,'utf8');
console.log('IMPORTED_LIVE_SITE='+JSON.stringify({
  source,bytes:Buffer.byteLength(html,'utf8'),sha256:createHash('sha256').update(html).digest('hex'),
  removedNetlifyHud:true
}));