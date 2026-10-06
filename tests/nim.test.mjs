import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function environment(){
  const elements=new Map();
  const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',innerText:'',classList:{add(){},remove(){},contains(){return false;},toggle(){}},dispatchEvent(){}});return elements.get(id);};
  const context=vm.createContext({document:{getElementById:element,querySelectorAll:()=>[]},console,setTimeout:()=>0,CustomEvent:class{},toggleAIlearning:true});
  for(const file of ['player.js','ai.js','game.js'])vm.runInContext(readFileSync(new URL('../priemones/nim.ai/classes/'+file,import.meta.url),'utf8'),context);
  vm.runInContext("let player1=new AI('nim.AI','lp','n');let player2=new Player('Žmogus');let game=new Game(11,player1,player2);game.player1=player1;game.player2=player2;",context);
  return context;
}
test('Nim: išjungus mokymą pasirinkimų lentelė nekeičiama',()=>{
  const ctx=environment();
  vm.runInContext('let taught=0;player1.teach=()=>taught++;player1.represent=()=>{};game.winner=player2;toggleAIlearning=false;game.teachAI();',ctx);
  assert.equal(vm.runInContext('taught',ctx),0);
  vm.runInContext('toggleAIlearning=true;game.teachAI();',ctx);
  assert.equal(vm.runInContext('taught',ctx),1);
});
test('Nim: ėjimai iki pradžios ir netinkamo žaidėjo ėjimai ignoruojami',()=>{
  const ctx=environment();
  vm.runInContext("game.active=false;game.turn({detail:[1,'Žmogus']});",ctx);
  assert.equal(vm.runInContext('game.currState',ctx),11);
  vm.runInContext("game.resetGame();game.turn({detail:[1,'Žmogus']});",ctx);
  assert.equal(vm.runInContext('game.currState',ctx),11);
  vm.runInContext("game.turn({detail:[12,'nim.AI']});",ctx);
  assert.equal(vm.runInContext('game.currState',ctx),11);
});
test('Nim: nauja partija atskiriama nuo ankstesnių uždelstų ėjimų',()=>{
  const ctx=environment();
  vm.runInContext('game.resetGame();let first=game.runId;game.resetGame();',ctx);
  assert.equal(vm.runInContext('game.runId-first',ctx),1);
});
