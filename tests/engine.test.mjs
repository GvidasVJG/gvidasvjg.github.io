import test from 'node:test';
import assert from 'node:assert/strict';
import {train,tokenize,probabilities,resolveWord,generate,distance,formatTokens} from '../vdslm/engine.mjs';
test('lietuviškos raidės, normalizavimas ir Python skyrybos skaidymas',()=>{
  assert.deepEqual(tokenize('ĄŽUOLAS, e\u0307žys. (taip) – ne'),['ąžuolas',',','ėžys','.','(','taip',')','–','ne']);
});
test('tikimybės skaičiuojamos pagal pasikartojimus, išsaugoma ciklinė pabaiga',()=>{
  const model=train('mokinys mokosi. mokinys kuria. mokinys mokosi.');
  assert.equal(model.tokenCount,9);
  assert.deepEqual(probabilities(model,'mokinys'),[{word:'mokosi',count:2,probability:2/3},{word:'kuria',count:1,probability:1/3}]);
  assert.deepEqual(probabilities(model,'.'),[{word:'mokinys',count:3,probability:1}]);
});
test('tikimybių suma visose eilutėse lygi vienetui',()=>{
  const model=train('a b a c a d e f a b');
  for(const word of model.vocabulary)assert.ok(Math.abs(probabilities(model,word).reduce((sum,p)=>sum+p.probability,0)-1)<1e-12);
});
test('atsitiktiniai pasirinkimai atitinka tikimybių intervalus',()=>{
  const model=train('a b a c a b');
  assert.deepEqual(generate(model,'a',2,()=>0).tokens,['a','b']);
  assert.deepEqual(generate(model,'a',2,()=>0.9).tokens,['a','c']);
});
test('nežinomas žodis pakeičiamas artimiausiu; lygybės atveju naudojama teksto eilė',()=>{
  const model=train('katė ratė katė miega');
  assert.equal(distance('katė','katę'),1);
  assert.equal(resolveWord(model,'batė').word,'katė');
  assert.equal(resolveWord(model,'KATĖ').corrected,false);
});
test('įvesties ir sekos ilgio ribos',()=>{
  assert.throws(()=>train('vienas'));
  assert.throws(()=>train(' '));
  assert.throws(()=>train('a '+ 'x'.repeat(81)));
  const model=train('vienas vienas');
  assert.throws(()=>generate(model,'',10));
  assert.throws(()=>generate(model,'vienas',0));
  assert.throws(()=>generate(model,'vienas',501));
  assert.throws(()=>generate(model,'vienas',2.5));
  assert.equal(generate(model,'vienas',500).tokens.length,500);
});
test('objektų savybių vardai saugiai laikomi modelio žodžiais',()=>{
  const model=train('__proto__ constructor toString __proto__');
  assert.equal(generate(model,'__proto__',20).tokens.length,20);
});
test('skyrybos formatavimas',()=>assert.equal(formatTokens(['labas',',','pasauli','.','(','taip',')']),'labas, pasauli. (taip)'));
