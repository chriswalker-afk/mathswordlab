import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const response=await fetch('https://mathswordslab.netlify.app/',{
  redirect:'follow',headers:{'User-Agent':'MathsWordsLab-ParityCheck/1.0'},signal:AbortSignal.timeout(30000)
});
if(response.status!==200)throw Error('Netlify live site unavailable: '+response.status);
const raw=await response.text();
const injection=/<script\b(?=[^>]*\bsrc=["']\/\.netlify\/scripts\/hud\?variant=public["'])[^>]*><\/script>[ \t]*\r?\n?/g;
const comment=/<!-- This site is hosted on Netlify\.[\s\S]*?Netlify hosting facts for this site: static\/SSR served via Netlify Edge\. -->\n/g;
const hudCount=[...raw.matchAll(injection)].length;
const commentCount=[...raw.matchAll(comment)].length;
if(hudCount!==1||commentCount!==1)throw Error('Unexpected live site injected markup: hud='+hudCount+', comment='+commentCount);
const normalized=raw.replace(injection,'').replace(comment,'');
const sha=s=>createHash('sha256').update(s).digest('hex');
const result={
  netlifyStatus:response.status,rawBytes:Buffer.byteLength(raw,'utf8'),
  normalizedNetlifyBytes:Buffer.byteLength(normalized,'utf8'),githubSourceBytes:Buffer.byteLength(source,'utf8'),
  netlifySHA256:sha(normalized),githubSHA256:sha(source),identical:source===normalized,
  removedNetlifyHud:hudCount,removedObsoleteHostingComment:commentCount
};
console.log('PARITY_RESULT='+JSON.stringify(result));
if(!result.identical)throw Error('Imported GitHub Pages application differs from Netlify after removing hosting-only markup');
