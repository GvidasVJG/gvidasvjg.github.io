// Žodžių porų modelis. Kaip pradiniame Python projekte, paskutinis žodis
// susiejamas su pirmuoju, todėl iš kiekvieno žodžio galima tęsti seką.
export function tokenize(text) {
  return text.normalize('NFC').toLocaleLowerCase('lt').replace(/([,.\-–()])/g, ' $1 ').trim().split(/\s+/u).filter(Boolean);
}
export function train(text) {
  if (typeof text !== 'string' || text.length > 2_000_000) throw new Error('Tekstas turi būti ne ilgesnis nei 2 milijonai ženklų.');
  const tokens = tokenize(text);
  if (tokens.length < 2) throw new Error('Įrašyk bent du žodžius.');
  if (tokens.length > 200_000) throw new Error('Vienu metu galima apmokyti ne daugiau kaip 200 000 žodžių ir skyrybos ženklų.');
  if (tokens.some(word => [...word].length > 80)) throw new Error('Tekste yra ilgesnė nei 80 ženklų seka. Patikrink tarpus tarp žodžių.');
  const transitions = new Map();
  for (let i = 0; i < tokens.length; i++) {
    const from = tokens[(i + tokens.length - 1) % tokens.length];
    const to = tokens[i];
    if (!transitions.has(from)) transitions.set(from, new Map());
    const row = transitions.get(from);
    row.set(to, (row.get(to) || 0) + 1);
  }
  return {transitions, vocabulary: [...new Set(tokens)], tokenCount: tokens.length};
}
export function distance(a, b) {
  a = [...a]; b = [...b];
  let previous = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    const row = [i + 1];
    for (let j = 0; j < b.length; j++) row.push(Math.min(row[j] + 1, previous[j + 1] + 1, previous[j] + (a[i] !== b[j])));
    previous = row;
  }
  return previous[b.length];
}
export function resolveWord(model, input) {
  const tokens = tokenize(input);
  const requested = tokens.at(-1);
  if (!requested) throw new Error('Įrašyk pradinį žodį.');
  if ([...requested].length > 80) throw new Error('Pradinis žodis turi būti ne ilgesnis nei 80 ženklų.');
  if (model.transitions.has(requested)) return {requested, word: requested, corrected: false};
  let word = model.vocabulary[0], best = Infinity;
  for (const candidate of model.vocabulary) {
    if (Math.abs([...candidate].length - [...requested].length) > best) continue;
    const score = distance(requested, candidate);
    if (score < best) { best = score; word = candidate; }
  }
  return {requested, word, corrected: true};
}
export function probabilities(model, word) {
  const row = model.transitions.get(word);
  if (!row) throw new Error('Šio žodžio modelyje nėra.');
  const total = [...row.values()].reduce((a, b) => a + b, 0);
  return [...row].map(([word, count]) => ({word, count, probability: count / total})).sort((a, b) => b.probability - a.probability);
}
export function nextWord(model, current, random = Math.random) {
  const choices = probabilities(model, current);
  let draw = random();
  for (const option of choices) { draw -= option.probability; if (draw < 0) return option.word; }
  return choices.at(-1).word;
}
export function formatTokens(tokens) {
  return tokens.join(' ').replace(/\s+([,.\)])/g, '$1').replace(/\(\s+/g, '(');
}
export function generate(model, input, length = 50, random = Math.random) {
  if (!Number.isInteger(length) || length < 1 || length > 500) throw new Error('Sekos ilgis turi būti sveikasis skaičius nuo 1 iki 500.');
  const start = resolveWord(model, input);
  const tokens = [start.word];
  for (let i = 1; i < length; i++) tokens.push(nextWord(model, tokens.at(-1), random));
  return {start, tokens, text: formatTokens(tokens)};
}
