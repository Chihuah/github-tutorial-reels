// Run the test sequences from the handout (6.1) against a real script.js.
// Usage: node tools/calc-test.mjs <script.js> [--clear-before-number]
// Prints the keys actually pressed and what the display shows at the end.
// After M+/M-/MR the display keeps its number, so typing appends to it; with
// --clear-before-number a C is pressed before each new number, which is what
// the handout's expected results assume.
import { readFileSync } from 'node:fs';

const src = readFileSync(process.argv[2], 'utf8');
function freshCalculator() {
  const display = { textContent: '0', style: {} };
  const document = { getElementById: () => display };
  const console = { log() {}, error() {} };
  const api = new Function('document', 'console', `${src}
    return { appendToDisplay, clearDisplay, memoryAdd, memorySubtract, memoryRecall, memoryClear };`)(document, console);
  return { display, api };
}
const RESET = process.argv[3] === "--clear-before-number";
const KEY = { 'M+': 'memoryAdd', 'M-': 'memorySubtract', MR: 'memoryRecall', MC: 'memoryClear', C: 'clearDisplay' };
const tests = [
  ['5', 'M+', '3', 'M+', 'MR'],
  ['MC', '10', 'M+', '3', 'M-', 'MR'],
  ['MC', '15', 'M+', 'C', 'MR'],
  ['20', 'M+', 'MC', 'MR'],
  ['MC', '5', 'M+', '10', 'M+', '3', 'M-', 'MR'],
];
tests.forEach((keys, i) => {
  const { display, api } = freshCalculator();
  const pressed = [];
  let afterMemory = false;
  for (const k of keys) {
    if (KEY[k]) { api[KEY[k]](); pressed.push(k); afterMemory = k !== 'C' && k !== 'MC'; }
    else {
      if (afterMemory && RESET) { api.clearDisplay(); pressed.push('C'); }
      for (const ch of k) api.appendToDisplay(ch);
      pressed.push(k); afterMemory = false;
    }
  }
  console.log(`測試${i + 1}：${pressed.join(' → ')}  ⇒  ${display.textContent}`);
});
