const fs = require('fs');
const readline = require('readline');

async function extractFullStep() {
  const filePath = 'C:\\Users\\Realme\\.gemini\\antigravity-ide\\brain\\250868a8-e37d-48a8-b279-508ef96b787e\\.system_generated\\logs\\transcript_full.jsonl';
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let targetContent = null;
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed.step_index === 1674) {
        targetContent = parsed.content;
      }
    } catch (e) {
      // ignore
    }
  }

  if (targetContent) {
    fs.writeFileSync('E:\\Personalized Placement Coach\\PPP\\server\\scripts\\extracted_prompt.txt', targetContent, 'utf8');
    console.log('Successfully extracted full step 1674, length:', targetContent.length);
  } else {
    console.log('Step 1674 not found in transcript_full.jsonl');
  }
}

extractFullStep();
