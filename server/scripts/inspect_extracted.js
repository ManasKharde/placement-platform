const fs = require('fs');

const content = fs.readFileSync('E:\\Personalized Placement Coach\\PPP\\server\\scripts\\extracted_prompt.txt', 'utf8');

const idx = content.indexOf('node-lecture-18');
console.log('--- CONTENT FROM LECTURE 18 ONWARD ---');
console.log(content.slice(idx, idx + 4000));
