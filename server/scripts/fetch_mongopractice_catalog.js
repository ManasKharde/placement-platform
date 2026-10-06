const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, 'mongopractice_catalog.json');
const BASE_URL = 'https://turbo-invention-mongopractice.onrender.com/api/questions';

async function fetchAllMongoPracticeQuestions() {
  console.log('--- Fetching MongoPractice Catalog from API ---');
  let page = 1;
  let totalPages = 1;
  const rawQuestions = [];

  while (page <= totalPages) {
    const url = `${BASE_URL}?page=${page}&limit=50`;
    console.log(`Fetching Page ${page}/${totalPages}...`);

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        break;
      } catch (err) {
        retries--;
        console.warn(`Retry fetching page ${page} (${retries} left):`, err.message);
        if (retries === 0) throw err;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    const data = await response.json();
    if (data.totalPages) {
      totalPages = data.totalPages;
    }

    const questionsOnPage = data.questions || [];
    rawQuestions.push(...questionsOnPage);
    console.log(`Page ${page}: Retrieved ${questionsOnPage.length} items (Total so far: ${rawQuestions.length})`);

    if (questionsOnPage.length === 0) {
      break;
    }
    page++;
  }

  console.log(`\nSuccessfully fetched ${rawQuestions.length} raw questions.`);

  // Normalize questions
  const normalizedCatalog = rawQuestions.map((q, idx) => {
    const serialNumber = q.questionNumber || q.serialNumber || (idx + 1);
    const tags = Array.isArray(q.tags) ? q.tags : [];
    
    // Determine primary topic
    let topic = 'find';
    if (tags.length > 0) {
      topic = tags[0].toLowerCase();
    } else if (q.expectedQuery) {
      const eq = q.expectedQuery.toLowerCase();
      if (eq.includes('.aggregate')) topic = 'aggregation';
      else if (eq.includes('.update') || eq.includes('$set') || eq.includes('$inc')) topic = 'update';
      else if (eq.includes('.delete') || eq.includes('.remove')) topic = 'delete';
      else if (eq.includes('createindex')) topic = 'indexes';
      else if (eq.includes('.find')) topic = 'find';
    }

    const difficultyFormatted = q.difficulty
      ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1).toLowerCase()
      : 'Easy';

    return {
      serialNumber,
      _id: q._id,
      title: q.title,
      description: q.description,
      topic,
      topics: tags,
      tags,
      difficulty: difficultyFormatted,
      expectedQuery: q.expectedQuery,
      hints: q.hints || [],
      url: `https://mongopractice.online/mongodb-practice-questions/${q._id}`,
      link: `https://mongopractice.online/mongodb-practice-questions/${q._id}`,
      platform: 'MongoPractice'
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(normalizedCatalog, null, 2), 'utf-8');
  console.log(`Saved ${normalizedCatalog.length} normalized questions to: ${OUTPUT_PATH}`);

  // Topic breakdown
  const topicCounts = {};
  for (const item of normalizedCatalog) {
    topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
  }

  console.log('\n--- Catalog Topic Breakdown ---');
  for (const [top, count] of Object.entries(topicCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  * ${top.padEnd(20)}: ${count} questions`);
  }

  return normalizedCatalog;
}

fetchAllMongoPracticeQuestions()
  .then(() => {
    console.log('\nMongoPractice Catalog fetch finished successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error fetching MongoPractice Catalog:', err);
    process.exit(1);
  });
