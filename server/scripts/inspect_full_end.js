const fs = require('fs');

const content = fs.readFileSync('E:\\Personalized Placement Coach\\PPP\\server\\scripts\\extracted_prompt.txt', 'utf8');

const idx = content.indexOf('node-lecture-18');
console.log('--- CONTENT FROM LECTURE 18 TO END (TOTAL LENGTH FROM IDX: ' + (content.length - idx) + ') ---');

// Print in 3000 character chunks
let cur = idx;
let part = 1;
while (cur < content.length) {
  console.log(`\n=== PART ${part++} (chars ${cur} to ${cur + 3000}) ===`);
  console.log(content.slice(cur, cur + 3000));
  cur += 3000;
}
