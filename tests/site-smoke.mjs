import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');

test('live Maths Words Lab is a complete standalone web application',()=>{
  assert.match(html,/^<!doctype html>/i);
  assert.match(html,/<title>Maths Words Lab — Course-first vocabulary practice<\/title>/);
  assert.match(html,/<body\b/i);
  assert.match(html,/<\/body>\s*<\/html>\s*$/i);
  assert.ok(html.length>700000,'The complete mathematics word-bank application should be imported');
  assert.ok(html.includes('BANKS')&&html.includes('TERMS'),'Word banks and term data must remain available');
});

test('no broken external assets or Netlify-specific runtime dependencies',()=>{
  assert.equal([...html.matchAll(/<style\b/gi)].length,1,'One self-contained stylesheet');
  assert.equal([...html.matchAll(/<script\b/gi)].length,1,'One self-contained application script');
  assert.doesNotMatch(html,/<script\b[^>]*\bsrc=/i);
  assert.doesNotMatch(html,/<link\b[^>]*rel=["']stylesheet["']/i);
  assert.doesNotMatch(html,/\/\.netlify\/(?:functions|scripts)\//i);
  assert.doesNotMatch(html,/This site is hosted on Netlify/i);
});

test('embedded application JavaScript parses without errors',()=>{
  const match=html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
  assert.ok(match,'Inline application script present');
  assert.doesNotThrow(()=>new Script(match[1],{filename:'maths-words-lab.js'}));
});

test('GitHub Pages domain is configured to the owned custom hostname',()=>{
  assert.equal(read('CNAME').trim(),'words.mrwalkermaths.com');
});