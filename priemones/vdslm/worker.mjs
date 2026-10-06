import {train, generate, resolveWord, probabilities} from './engine.mjs';
let model;
self.onmessage = ({data}) => {
  try {
    let result;
    if (data.type === 'train') {
      model = train(data.text);
      result = {tokens: model.tokenCount, words: model.vocabulary.length, pairs: [...model.transitions.values()].reduce((n, row) => n + row.size, 0), first: model.vocabulary[0]};
    } else {
      if (!model) throw new Error('Pirmiausia apmokyk modelį.');
      if (data.type === 'generate') result = generate(model, data.input, data.length);
      else if (data.type === 'inspect') {
        const start = resolveWord(model, data.input);
        const choices = probabilities(model, start.word);
        result = {start, choices: choices.slice(0, 12), total: choices.length};
      } else throw new Error('Nežinoma užduotis.');
    }
    self.postMessage({id: data.id, result});
  } catch (error) { self.postMessage({id: data.id, error: error.message}); }
};
