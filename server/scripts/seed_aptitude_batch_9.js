const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch9 = [
  // ===========================================================================
  // TOPIC 25: CHAIN RULE (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 25,
    slug: 'aptitude-quant-chain-rule',
    title: 'Chain Rule',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 30,
    video_url: 'http://www.youtube.com/watch?v=pYL2843EEuQ',
    video_title: 'Chain Rule - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Master the MDH inversion formula, proportional consumption logic, troop provision exhaustion, and multi-unit worker efficiency conversions.',
    summary_markdown: `### 📌 1. The Core MDH (Chain Rule) Formula
* **The Master Equation:** 
  **\`(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2\`**
  * **\`M\`** = Number of Men (or machines, pumps, animals)
  * **\`D\`** = Number of Days
  * **\`H\`** = Hours worked per day
  * **\`W\`** = Amount of Work done (or wages earned, items consumed)
* **Crucial Rule for Unquantifiable Work:** If the work is "building a house", "cleaning a pool", or "finishing a task", treat the total work as **\`1\`**. Therefore, \`W1 = 1\` and \`W2 = 1\`.

### 💡 2. Cross-Multiplying Work States
* A powerful shortcut derived from the MDH rule is cross-multiplying the work done in the opposite scenarios:
  **\`M1 × D1 × H1 × W2 = M2 × D2 × H2 × W1\`**
* Always put the **Work Done** of the *second* case on the *first* side, and the **Work Done** of the *first* case on the *second* side!

### 💡 3. High-Yield Placement Shortcuts
* **Men/Women/Boys Equivalency:**
  If a problem states "3 men OR 4 women can do a work in \`X\` days", deduce that \`3M = 4W\`. Convert the target group (e.g., "6 men AND 8 women") entirely into a single unit before applying the MDH formula!
* **Food Provision & Reinforcements:**
  If a camp of \`M1\` men has food for \`D\` days, and after \`d\` days, \`X\` men join:
  Remaining food originally would last \`M1\` men for \`(D - d)\` days.
  Set up the equation: **\`M1 × (D - d) = (M1 + X) × D_new\`**. Solve for \`D_new\`.
* **Proportional Consumption:**
  If elements reduce their consumption rate by a percentage (e.g., eating 10% less), modify the "Efficiency" factor in the formula:
  **\`M1 × D1 × E1 = M2 × D2 × E2\`** (where \`E1 = 100%\` and \`E2 = 90%\`).`,
    questions: [
      {
        id: 'apt-chain-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Direct MDH Formula Application] 40 boys paint a house in 96 days by working 9 hours per day. How many hours per day do 48 boys need to work to paint the identical house in 45 days?',
        question: 'If 40 boys can completely paint a house in exactly 96 days by working 9 hours per day, exactly how many hours per day must 48 boys work so they can paint the exact same house in 45 days?',
        options: [
          'A) 12 hours',
          'B) 14 hours',
          'C) 15 hours',
          'D) 16 hours'
        ],
        correctAnswer: 'D',
        explanation: 'Use the formula M1 × D1 × H1 = M2 × D2 × H2 (since Work W1 = W2 = 1). 40 × 96 × 9 = 48 × 45 × H2 => 34560 = 2160 × H2 => H2 = 34560 / 2160 = 16 hours.'
      },
      {
        id: 'apt-chain-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Finding Missing Men via Fractional Work] 54 toy makers can prepare 36 toys per day. How many toy makers should be employed to make 416 toys in exactly 16 days?',
        question: 'If 54 toy makers can prepare exactly 36 toys per day, exactly how many toy makers should an employer hire to get an order of 416 toys completely done in exactly 16 days?',
        options: [
          'A) 36',
          'B) 39',
          'C) 42',
          'D) 45'
        ],
        correctAnswer: 'B',
        explanation: 'Scenario 1: M1 = 54, D1 = 1, W1 = 36. Scenario 2: M2 = ?, D2 = 16, W2 = 416. Formula: (M1 × D1) / W1 = (M2 × D2) / W2 => (54 × 1) / 36 = (M2 × 16) / 416. Left side = 54 / 36 = 1.5. So 1.5 = M2 × 16 / 416 => M2 = (1.5 × 416) / 16 = 624 / 16 = 39 toy makers.'
      },
      {
        id: 'apt-chain-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Provisions with Missing Men] 2,500 children had enough chocolates for 40 days. Some children never came, so the chocolates lasted 50 days. How many children never came?',
        question: 'A group of 2,500 children in a school had enough chocolates to last for exactly 40 days. However, a certain number of children never came to school, causing the exact same stock of chocolates to last for 50 days. How many children never came to school?',
        options: [
          'A) 400',
          'B) 450',
          'C) 500',
          'D) 600'
        ],
        correctAnswer: 'C',
        explanation: 'Let M2 be the number of children who actually came. The total "chocolate-days" remains constant. M1 × D1 = M2 × D2 => 2500 × 40 = M2 × 50 => 100,000 = 50 × M2 => M2 = 2000. So 2000 children attended. The number of children who never came = 2500 - 2000 = 500.'
      },
      {
        id: 'apt-chain-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Translating Equivalencies into MDH] 3 women can paint a house in 18 days and 6 children can do it in 18 days. How many days for 4 women and 4 children?',
        question: 'If 3 women alone can completely paint a house in exactly 18 days, and 6 children alone can do the same work in exactly 18 days, exactly how many days will 4 women and 4 children working together take to paint the identical house?',
        options: [
          'A) 6 days',
          'B) 8 days',
          'C) 9 days',
          'D) 12 days'
        ],
        correctAnswer: 'C',
        explanation: 'Since 3 women take the exact same time as 6 children, 3W = 6C => 1W = 2C. We are asked for 4W + 4C. Convert everything to children: 4W = 8C, so 4W + 4C = 12C. Scenario 1: 6 Children take 18 days. Scenario 2: 12 Children take D2 days. M1 × D1 = M2 × D2 => 6 × 18 = 12 × D2 => 108 = 12 × D2 => D2 = 9 days.'
      },
      {
        id: 'apt-chain-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Efficiency Deduction across Machines] 12 pumps of type A pump 30 L in 18h/day. 16 pumps of type B pump 40 L in 24h/day. How efficient is type A compared to type B?',
        question: 'Exactly 12 pumps of one type (Type A) can pump exactly 30 liters of water when each is running for 18 hours per day. However, a set of 16 pumps of another type (Type B) pumps exactly 40 liters of water when each is running for 24 hours per day. How exactly is the pumping efficiency of a Type A pump mathematically related to a Type B pump?',
        options: [
          'A) Type A is 1.5 times as efficient as Type B',
          'B) Type A is 4/3 times as efficient as Type B',
          'C) Type A is 3/4 times as efficient as Type B',
          'D) Type A is exactly equal to Type B'
        ],
        correctAnswer: 'B',
        explanation: 'Use MDH formula factoring in Efficiencies E_A and E_B: (M1 × H1 × E_A) / W1 = (M2 × H2 × E_B) / W2 => (12 × 18 × E_A) / 30 = (16 × 24 × E_B) / 40. Simplify left side: (216 / 30) × E_A = 7.2 × E_A. Simplify right side: (384 / 40) × E_B = 9.6 × E_B. So, 7.2 × E_A = 9.6 × E_B => E_A / E_B = 9.6 / 7.2 = 96 / 72 = 4 / 3. Thus, Type A is 4/3 times as efficient as Type B.'
      },
      {
        id: 'apt-chain-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Fractional Work Remaining] 75 girls complete 1/3 of decoration in 40 hours. With 50 hours left to finish the rest, how many MORE girls are needed?',
        question: 'A group of 75 girls complete exactly 1/3 of a building\'s decoration in 40 hours. They are informed they only have exactly 50 hours left to complete the REST of the decoration. How many MORE girls are strictly necessary to help them completely finish the task on time?',
        options: [
          'A) 25',
          'B) 35',
          'C) 45',
          'D) 120'
        ],
        correctAnswer: 'C',
        explanation: 'Scenario 1: M1 = 75, H1 = 40, W1 = 1/3. Scenario 2: M2 = ?, H2 = 50, W2 = 2/3 (remaining work). Formula: (M1 × H1) / W1 = (M2 × H2) / W2 => (75 × 40) / (1/3) = (M2 × 50) / (2/3). Cross multiply by denominators: 3000 × 3 = 50 × M2 × (3/2) => 9000 = 75 × M2 => M2 = 9000 / 75 = 120 girls needed total. Since 75 girls are already present, they need 120 - 75 = 45 MORE girls.'
      },
      {
        id: 'apt-chain-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Speeding up Incomplete Task] 60 workers do 30% of work in 10 days out of a 20 day deadline. How many total workers needed for the remaining 10 days to finish on time?',
        question: 'Rohan wants to build a tank in exactly 20 days, for which he initially hires 60 workers. After 10 days, he discovers that only 30% of the work has been completed. To speed up the process and get the tank completely built strictly within the original stipulated 20-day timeframe, how many TOTAL workers should work on the tank for the remaining period?',
        options: [
          'A) 80',
          'B) 100',
          'C) 120',
          'D) 140'
        ],
        correctAnswer: 'D',
        explanation: 'Scenario 1: M1 = 60, D1 = 10, W1 = 30%. Scenario 2: M2 = ?, D2 = 10 (remaining days), W2 = 70% (remaining work). Formula: (M1 × D1) / W1 = (M2 × D2) / W2 => (60 × 10) / 30 = (M2 × 10) / 70 => 600 / 30 = 10 × M2 / 70 => 20 = M2 / 7 => M2 = 140. He needs 140 total workers (which means adding 80 more).'
      },
      {
        id: 'apt-chain-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Proportional Rate Deduction] 72 patients consume a tank of oxygen in 54 hours. If consumption is reduced by 10%, how many hours will the tank last for 90 patients?',
        question: 'A hospital tank has enough oxygen to strictly last for exactly 54 hours for 72 patients. If every patient suddenly reduces their average oxygen consumption rate by exactly 10%, for how many exact hours will the identical full tank supply exactly 90 patients?',
        options: [
          'A) 45 hours',
          'B) 48 hours',
          'C) 50 hours',
          'D) 54 hours'
        ],
        correctAnswer: 'B',
        explanation: 'Let initial consumption rate per patient be 100%. Total capacity = 72 patients × 54 hours × 100% = 388,800 units. Scenario 2: Consumption rate is now 90%. So, 90 patients × H hours × 90% = 388,800. 8100 × H = 388800 => H = 388800 / 8100 = 3888 / 81 = 48 hours.'
      },
      {
        id: 'apt-chain-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Money Distribution in Chain Rule] 15 men working 8 hours a day earn ₹3000 in 10 days. How much will 20 men working 6 hours a day earn in 15 days?',
        question: 'If 15 men working 8 hours a day can earn exactly ₹3,000 in exactly 10 days, what exact amount of money will 20 men earn in exactly 15 days if they work exactly 6 hours a day?',
        options: [
          'A) ₹3,500',
          'B) ₹4,000',
          'C) ₹4,500',
          'D) ₹5,000'
        ],
        correctAnswer: 'C',
        explanation: 'In the MDH formula, wages earned act identically to "Work Done". (M1 × D1 × H1) / Wages1 = (M2 × D2 × H2) / Wages2. (15 × 10 × 8) / 3000 = (20 × 15 × 6) / Wages2. Left side = 1200 / 3000 = 0.4. Right side = 1800 / Wages2. So 0.4 = 1800 / Wages2 => Wages2 = 1800 / 0.4 = ₹4,500.'
      },
      {
        id: 'apt-chain-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Length, Breadth, Depth as Work] 20 men can dig a trench 12m long, 5m broad, and 3m deep in 10 days. How many men are needed to dig a trench 15m long, 4m broad, and 4m deep in 8 days?',
        question: 'If exactly 20 men can dig a trench that is 12m long, 5m broad, and 3m deep in exactly 10 days, exactly how many men are required to dig a trench that is 15m long, 4m broad, and 4m deep in exactly 8 days?',
        options: [
          'A) 24 men',
          'B) 30 men',
          'C) 33 1/3 men',
          'D) 36 men'
        ],
        correctAnswer: 'C',
        explanation: 'Work is the total volume excavated. W1 = 12 × 5 × 3 = 180 cubic meters. W2 = 15 × 4 × 4 = 240 cubic meters. (M1 × D1) / W1 = (M2 × D2) / W2 => (20 × 10) / 180 = (M2 × 8) / 240 => 200 / 180 = 8 × M2 / 240 => 10/9 = M2 / 30 => M2 = 300 / 9 = 33 1/3 men.'
      },
      {
        id: 'apt-chain-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Running Cost of Engines] If 8 engines consume 24 metric tonnes of coal when running 10 hours a day, how much coal will 6 engines running 14 hours a day consume, assuming 3 engines of former type consume as much as 4 engines of latter type?',
        question: 'If 8 engines completely consume 24 metric tonnes of coal when each is running 10 hours a day, exactly how many metric tonnes of coal will be consumed by 6 engines running 14 hours a day, given that 3 engines of the former type strictly consume as much as exactly 4 engines of the latter type?',
        options: [
          'A) 16.8 tonnes',
          'B) 18.9 tonnes',
          'C) 21.0 tonnes',
          'D) 25.2 tonnes'
        ],
        correctAnswer: 'B',
        explanation: 'We have two types of engines. 3 E_A = 4 E_B => E_B = (3/4) E_A. Scenario 1: M1 = 8 E_A, H1 = 10, W1 = 24. Scenario 2: M2 = 6 E_B = 6(3/4) E_A = 4.5 E_A, H2 = 14, W2 = ?. Formula: (M1 × H1) / W1 = (M2 × H2) / W2 => (8 × 10) / 24 = (4.5 × 14) / W2 => 80 / 24 = 63 / W2 => 10/3 = 63 / W2 => W2 = 189 / 10 = 18.9 tonnes.'
      },
      {
        id: 'apt-chain-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Soldiers Leaving Camp with Shifted Provisions] A garrison of 2000 men has provisions for 54 days. After 15 days, some men left the garrison and the remaining provisions lasted for an extra 20 days (i.e. 59 days). How many men left?',
        question: 'A military garrison initially comprising 2,000 men has provisions safely budgeted to last for exactly 54 days. Exactly 15 days later, a certain number of men leave the garrison. Consequently, the remaining provisions are stretched to last for exactly 59 days. How many men left the garrison?',
        options: [
          'A) 500',
          'B) 678',
          'C) 1322',
          'D) 1500'
        ],
        correctAnswer: 'B',
        explanation: 'After 15 days, the remaining food would normally last the 2,000 men for (54 - 15) = 39 days. So, the total remaining "man-days" of food = 2000 × 39 = 78,000 man-days. Let M2 be the new number of men. The food lasted for 59 days. M2 × 59 = 78,000 => M2 = 78000 / 59 ≈ 1322 men remaining. Therefore, the number of men who left = 2000 - 1322 = 678.'
      },
      {
        id: 'apt-chain-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Contractor Penalty Multiplier] A contractor agrees to do a work in 30 days and employs 15 men. After 10 days, he finds only 1/4 of work is done. How many extra men must he hire to finish strictly on time?',
        question: 'A contractor agrees to complete a construction work in exactly 30 days and initially employs 15 men for the job. Exactly 10 days later, he inspects the site and finds that only exactly 1/4 of the total work has been done. How many EXTRA men must he urgently employ to ensure the work is finished strictly within the originally agreed timeframe?',
        options: [
          'A) 7.5 (or 8) men',
          'B) 15 men',
          'C) 20 men',
          'D) 22 men'
        ],
        correctAnswer: 'A',
        explanation: 'Scenario 1: M1 = 15, D1 = 10, W1 = 1/4. Scenario 2: M2 = ?, D2 = 20 (remaining days), W2 = 3/4 (remaining work). Formula: (15 × 10) / (1/4) = (M2 × 20) / (3/4) => 150 × 4 = (M2 × 20) × (4/3) => 600 = 80 × M2 / 3 => 1800 = 80 × M2 => M2 = 1800 / 80 = 22.5 men total. Since he currently has 15 men, he must hire 22.5 - 15 = 7.5 extra men (or practically 8).'
      },
      {
        id: 'apt-chain-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Cows Eating Grass with Constant Growth] If 10 cows can eat a field of grass in 20 days, and 15 cows can eat it in 10 days, how many cows can eat it in 5 days? (Grass grows uniformly)',
        question: 'If 10 cows can completely graze a field of grass in exactly 20 days, and 15 cows can graze the identical field in exactly 10 days (assuming the grass is constantly growing at a uniform daily rate), exactly how many cows are required to graze the entire field in exactly 5 days?',
        options: [
          'A) 20',
          'B) 25',
          'C) 30',
          'D) 35'
        ],
        correctAnswer: 'B',
        explanation: 'Let initial grass = G, growth rate per day = r, cow eating rate = c per day. Eq 1: 10c × 20 = G + 20r => 200c = G + 20r. Eq 2: 15c × 10 = G + 10r => 150c = G + 10r. Subtract Eq 2 from Eq 1: 50c = 10r => r = 5c. Substitute r back: 150c = G + 50c => G = 100c. Scenario 3: N cows in 5 days. Nc × 5 = G + 5r => 5Nc = 100c + 5(5c) => 5Nc = 100c + 25c = 125c. Divide by 5c: N = 25 cows.'
      },
      {
        id: 'apt-chain-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Typists Working Different Page Formats] 4 typists type 400 pages of 20 lines each with 10 words per line in 10 days. How many typists are needed to type 800 pages of 25 lines each with 12 words per line in 12 days?',
        question: 'Exactly 4 typists can type exactly 400 pages, each containing 20 lines with 10 words per line, in exactly 10 days. Exactly how many identically skilled typists are required to type exactly 800 pages, each containing 25 lines with 12 words per line, in exactly 12 days?',
        options: [
          'A) 8 typists',
          'B) 10 typists',
          'C) 12 typists',
          'D) 15 typists'
        ],
        correctAnswer: 'B',
        explanation: 'Work is the total number of words typed! W1 = 400 pages × 20 lines/page × 10 words/line = 80,000 words. W2 = 800 × 25 × 12 = 240,000 words. (M1 × D1) / W1 = (M2 × D2) / W2 => (4 × 10) / 80,000 = (M2 × 12) / 240,000 => 40 / 80 = 12 × M2 / 240 => 1/2 = M2 / 20 => M2 = 10 typists.'
      },
      {
        id: 'apt-chain-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Two Groups of Animals Equivalency] If 5 horses eat as much as 7 oxen, and 14 oxen eat as much as 20 sheep. How many horses eat as much as 40 sheep?',
        question: 'If exactly 5 horses consume as much food as exactly 7 oxen, and exactly 14 oxen consume as much food as exactly 20 sheep, exactly how many horses will mathematically consume as much food as exactly 40 sheep?',
        options: [
          'A) 10 horses',
          'B) 15 horses',
          'C) 20 horses',
          'D) 25 horses'
        ],
        correctAnswer: 'C',
        explanation: 'We have 5H = 7O => 1O = 5/7 H. And 14O = 20S => 1S = 14/20 O = 7/10 O. Substitute O: 1S = (7/10) × (5/7) H = 1/2 H. This means 1 sheep eats as much as half a horse (or 2 sheep = 1 horse). Therefore, 40 sheep eat as much as 40 × (1/2) = 20 horses.'
      },
      {
        id: 'apt-chain-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Inversely Proportional Time with Squared Output] Machines A produce x units in y hours. If their efficiency drops by half, how many hours for 3A machines to produce x^2 units?',
        question: 'A group of exactly A machines can produce exactly x units in exactly y hours. If their operational efficiency suddenly drops by exactly half, exactly how many hours will it mathematically take for a group of 3A machines to produce exactly x^2 units?',
        options: [
          'A) 2xy / 3',
          'B) 3xy / 2',
          'C) xy / 6',
          'D) xy^2 / 3'
        ],
        correctAnswer: 'A',
        explanation: 'Scenario 1: M1 = A, H1 = y, E1 = 1, W1 = x. Scenario 2: M2 = 3A, H2 = ?, E2 = 0.5, W2 = x^2. Formula: (M1 × H1 × E1) / W1 = (M2 × H2 × E2) / W2 => (A × y × 1) / x = (3A × H2 × 0.5) / x^2. Cancel A from both sides: y / x = 1.5 × H2 / x^2. Multiply both sides by x^2: x y = 1.5 × H2 => H2 = xy / 1.5 = xy / (3/2) = 2xy / 3 hours.'
      },
      {
        id: 'apt-chain-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Fractional Output Over Time] If 9 monkeys eat 9 bananas in 9 minutes, how many minutes will it take 3 monkeys to eat 3 bananas?',
        question: 'If exactly 9 monkeys can collectively eat exactly 9 bananas in exactly 9 minutes, exactly how many minutes will it take for exactly 3 monkeys to collectively eat exactly 3 bananas?',
        options: [
          'A) 1 minute',
          'B) 3 minutes',
          'C) 9 minutes',
          'D) 27 minutes'
        ],
        correctAnswer: 'C',
        explanation: 'Scenario 1: M1 = 9, W1 = 9, D1 = 9. Scenario 2: M2 = 3, W2 = 3, D2 = ?. (M1 × D1) / W1 = (M2 × D2) / W2 => (9 × 9) / 9 = (3 × D2) / 3 => 9 = D2. It still takes 9 minutes! (Logically, each individual monkey takes 9 minutes to eat 1 banana).'
      },
      {
        id: 'apt-chain-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Worker Transfer to Prevent Default] 30 men agree to finish a job in 40 days. After 24 days, they have done only 1/2 of the work. How many more men must be employed to finish on time?',
        question: 'A contractor employs 30 men who agree to finish a job in exactly 40 days. After exactly 24 days, the contractor observes that only exactly 1/2 (half) of the work has been finished. How many MORE men must be urgently employed to completely finish the work strictly on time?',
        options: [
          'A) 15 men',
          'B) 20 men',
          'C) 45 men',
          'D) 50 men'
        ],
        correctAnswer: 'A',
        explanation: 'Scenario 1: M1 = 30, D1 = 24, W1 = 1/2. Scenario 2: M2 = ?, D2 = 16 (40 - 24 remaining days), W2 = 1/2 (remaining work). Formula: (30 × 24) / 0.5 = (M2 × 16) / 0.5 => 30 × 24 = M2 × 16 => 720 = 16 × M2 => M2 = 720 / 16 = 45 total men needed. Since 30 men are already working, he needs 45 - 30 = 15 MORE men.'
      },
      {
        id: 'apt-chain-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Length of Wall Extension] 8 men can build a wall 120m long in 6 days. How long will a wall built by 16 men in 9 days be?',
        question: 'If exactly 8 men can build a straight brick wall that is exactly 120 meters long in exactly 6 days, exactly how many meters long will a similar wall be if it is built by 16 men in exactly 9 days?',
        options: [
          'A) 240 meters',
          'B) 300 meters',
          'C) 360 meters',
          'D) 420 meters'
        ],
        correctAnswer: 'C',
        explanation: 'Work = Length of the wall. M1 = 8, D1 = 6, W1 = 120. M2 = 16, D2 = 9, W2 = ?. (8 × 6) / 120 = (16 × 9) / W2 => 48 / 120 = 144 / W2 => 1 / 2.5 = 144 / W2 => W2 = 144 × 2.5 = 360 meters.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 26: AREA & PERIMETER (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 26,
    slug: 'aptitude-quant-area-and-perimeter',
    title: 'Area & Perimeter',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 53,
    video_url: 'http://www.youtube.com/watch?v=xwqUyOT-cmU',
    video_title: 'Area & Perimeter - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Master geometric mensuration: scaling logic for 2D shapes, internal/external pathway areas, cyclic quadrilaterals, and composite figure optimization.',
    summary_markdown: `### 📌 1. Core 2D Geometry Formulas
* **Triangle:** \`Area = 1/2 × Base × Height\`
  * Equilateral Triangle: \`Area = (√3 / 4) × a^2\`, \`Height = (√3 / 2) × a\`
  * Heron's Formula: \`Area = √(s(s-a)(s-b)(s-c))\` where \`s = (a+b+c)/2\`
* **Rectangle:** \`Area = L × B\`, \`Perimeter = 2(L + B)\`, \`Diagonal = √(L^2 + B^2)\`
* **Square:** \`Area = a^2\`, \`Perimeter = 4a\`, \`Diagonal = a√2\`
* **Circle:** \`Area = πr^2\`, \`Circumference = 2πr\`
* **Parallelogram:** \`Area = Base × Height\`
* **Rhombus:** \`Area = 1/2 × d1 × d2\` (Product of diagonals)
* **Trapezium:** \`Area = 1/2 × (Sum of parallel sides) × Height\`

### 💡 2. High-Yield Placement Shortcuts
* **Pathway Inside/Outside a Rectangle:**
  * Area of a uniform path of width \`w\` running **OUTSIDE** a rectangle of dimensions \`L×B\`: **\`2w(L + B + 2w)\`**
  * Area of a uniform path of width \`w\` running **INSIDE** a rectangle: **\`2w(L + B - 2w)\`**
  * Area of two perpendicular cross-paths of width \`w\` cutting through the center: **\`w(L + B - w)\`**
* **Scaling Rules:**
  * If all linear dimensions of a 2D figure are multiplied by \`k\`, the **Perimeter** is multiplied by \`k\`, and the **Area** is multiplied by **\`k^2\`**.
  * If the radius of a circle increases by \`x%\`, its area increases by **\`2x + (x^2)/100 %\`**.

### 💡 3. Composite and Inscribed Figures
* **Largest Circle inside a Square:** Radius \`r = a / 2\` (where \`a\` is the side of the square). Area = \`(π/4)a^2\`.
* **Largest Square inside a Circle:** Diagonal of square = Diameter of circle (\`d\`). Area = \`d^2 / 2 = 2r^2\`.
* **Largest Triangle inside a Semicircle:** The triangle with its base as the diameter and its third vertex on the arc is a right-angled triangle. Its maximum Area = \`r^2\`.`,
    questions: [
      {
        id: 'apt-area-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Pathway Outside a Rectangle] A rectangular lawn is 60m long and 40m wide. A uniform path of 5m width surrounds it on the outside. Find the area of the path.',
        question: 'A rectangular lawn is exactly 60 meters long and exactly 40 meters wide. A uniform walking path exactly 5 meters wide surrounds it completely on the OUTSIDE. What is the total surface area of this path?',
        options: [
          'A) 1,000 sq meters',
          'B) 1,100 sq meters',
          'C) 1,200 sq meters',
          'D) 1,400 sq meters'
        ],
        correctAnswer: 'B',
        explanation: 'Shortcut formula for path outside: Area = 2w(L + B + 2w). Here L = 60, B = 40, w = 5. Area = 2(5) × (60 + 40 + 10) = 10 × 110 = 1,100 sq meters. (Alternative: Outer rectangle is 70×50 = 3500. Inner is 60×40 = 2400. Area = 3500 - 2400 = 1100).'
      },
      {
        id: 'apt-area-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Percentage Change in Area] If the radius of a circle is increased by 20%, what will be the percentage increase in its area?',
        question: 'If the radius of a perfect circle is increased by exactly 20%, what will be the exact percentage increase in the total surface area of the circle?',
        options: [
          'A) 40%',
          'B) 44%',
          'C) 48%',
          'D) 144%'
        ],
        correctAnswer: 'B',
        explanation: 'Since Area = πr^2, an increase of x% in radius leads to a successive increase in area. Use the formula: Net % change = x + x + (x^2)/100. Here x = 20. Change = 20 + 20 + (400/100) = 40 + 4 = 44% increase.'
      },
      {
        id: 'apt-area-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Equilateral Triangle into Circle] A wire is bent in the form of an equilateral triangle enclosing an area of 121√3 sq cm. If it is bent into a circle, find its area.',
        question: 'A uniform copper wire is bent into the shape of a perfect equilateral triangle, enclosing an area of exactly 121√3 sq cm. If this identical piece of wire is unbent and rebent into the shape of a perfect circle, what will be the total area enclosed by the circle? (Take π = 22/7)',
        options: [
          'A) 346.5 sq cm',
          'B) 364.0 sq cm',
          'C) 385.5 sq cm',
          'D) 402.5 sq cm'
        ],
        correctAnswer: 'A',
        explanation: '1) Area of equilateral triangle = (√3/4)a^2 = 121√3 => a^2 = 121 × 4 = 484 => a = 22 cm. 2) The perimeter of the triangle (which is the length of the wire) = 3 × 22 = 66 cm. 3) This wire forms a circle: Circumference 2πr = 66 => 2 × (22/7) × r = 66 => 44r / 7 = 66 => r = (66 × 7) / 44 = 10.5 cm. 4) Area of circle = πr^2 = (22/7) × 10.5 × 10.5 = (22/7) × 110.25 = 346.5 sq cm.'
      },
      {
        id: 'apt-area-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Diagonals of a Rhombus] The area of a rhombus is 216 sq cm and one of its diagonals is 24 cm. Find its perimeter.',
        question: 'The total surface area of a rhombus is exactly 216 sq cm and the length of one of its diagonals is exactly 24 cm. What is the total perimeter of the rhombus?',
        options: [
          'A) 40 cm',
          'B) 52 cm',
          'C) 60 cm',
          'D) 68 cm'
        ],
        correctAnswer: 'C',
        explanation: '1) Area of rhombus = 1/2 × d1 × d2 => 216 = 1/2 × 24 × d2 => 216 = 12 × d2 => d2 = 216 / 12 = 18 cm. 2) The diagonals of a rhombus bisect each other at right angles. The half-diagonals are 12 cm and 9 cm. 3) The side of the rhombus forms a right triangle with legs 12 and 9. Side = √(12^2 + 9^2) = √(144 + 81) = √225 = 15 cm. 4) Perimeter = 4 × side = 4 × 15 = 60 cm.'
      },
      {
        id: 'apt-area-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Cost of Carpeting a Room] The length of a room is 15m and breadth is 12m. Find the cost of carpeting it with a 75cm wide carpet at ₹20 per meter.',
        question: 'A rectangular room is exactly 15 meters long and 12 meters broad. What is the exact total cost of completely carpeting the floor of the room using a carpet that is exactly 75 cm wide, if the carpet is priced at ₹20 per linear meter?',
        options: [
          'A) ₹3,600',
          'B) ₹4,200',
          'C) ₹4,800',
          'D) ₹5,400'
        ],
        correctAnswer: 'C',
        explanation: '1) Area of the floor = Length × Breadth = 15 × 12 = 180 sq meters. 2) The area of the carpet must equal the area of the floor. Area of carpet = Length of carpet × Width of carpet. 180 = Length × 0.75m => Length of carpet = 180 / 0.75 = 240 meters. 3) Total cost = Length in meters × Cost per meter = 240 × 20 = ₹4,800.'
      },
      {
        id: 'apt-area-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Area of Inscribed Square] A circle is circumscribed around a square of side 10 cm. Find the area of the circle.',
        question: 'A perfect circle is perfectly circumscribed around (drawn exactly outside, touching the vertices of) a square whose sides are exactly 10 cm long. What is the exact area of the circle? (Take π = 3.14)',
        options: [
          'A) 157.0 sq cm',
          'B) 314.0 sq cm',
          'C) 100.0 sq cm',
          'D) 78.5 sq cm'
        ],
        correctAnswer: 'A',
        explanation: 'When a circle circumscribes a square, the diagonal of the square acts as the diameter of the circle! 1) Diagonal of square = a√2 = 10√2. 2) Diameter of circle = 10√2 => Radius r = 5√2. 3) Area of circle = πr^2 = 3.14 × (5√2)^2 = 3.14 × (25 × 2) = 3.14 × 50 = 157 sq cm.'
      },
      {
        id: 'apt-area-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Cross-Path Area Calculation] A rectangular park is 80m × 60m. Two crossroads 5m wide run parallel to the sides. Find the area of the path.',
        question: 'A rectangular park measures exactly 80m by 60m. Two perfectly straight crossroads, each uniformly 5 meters wide, run through the center of the park parallel to its sides and intersect each other at right angles. What is the exact total area of these crossroads?',
        options: [
          'A) 675 sq m',
          'B) 700 sq m',
          'C) 725 sq m',
          'D) 750 sq m'
        ],
        correctAnswer: 'A',
        explanation: 'Area of length-wise path = L × w = 80 × 5 = 400. Area of breadth-wise path = B × w = 60 × 5 = 300. The central 5×5 intersection square is counted twice, so subtract it: 5 × 5 = 25. Total path area = 400 + 300 - 25 = 675 sq m. (Shortcut: w(L + B - w) = 5(80 + 60 - 5) = 5(135) = 675).'
      },
      {
        id: 'apt-area-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Area of Largest Triangle in Semicircle] What is the area of the largest triangle that can be inscribed in a semicircle of radius r?',
        question: 'What is the exact algebraic expression for the maximum possible surface area of a triangle that can be perfectly inscribed inside a semicircle of radius exactly r?',
        options: [
          'A) 0.5 × πr^2',
          'B) r^2',
          'C) 2r^2',
          'D) r^2 / 2'
        ],
        correctAnswer: 'B',
        explanation: 'To maximize the area of a triangle inscribed in a semicircle, the base of the triangle must lie on the diameter of the semicircle (Base = 2r), and the third vertex must touch the highest point on the circular arc, making the Height = r. Max Area = 1/2 × Base × Height = 1/2 × (2r) × r = r^2.'
      },
      {
        id: 'apt-area-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Number of Tiles for a Floor] How many square tiles of side 20 cm are needed to cover a floor of 4m × 5m?',
        question: 'Exactly how many identical square tiles, each having a side length of exactly 20 cm, are required to completely cover a rectangular floor measuring exactly 4 meters by 5 meters?',
        options: [
          'A) 250',
          'B) 400',
          'C) 500',
          'D) 1000'
        ],
        correctAnswer: 'C',
        explanation: 'Convert floor dimensions to cm: L = 400 cm, B = 500 cm. Area of floor = 400 × 500 = 200,000 sq cm. Area of one tile = 20 × 20 = 400 sq cm. Number of tiles = Total Area / Tile Area = 200,000 / 400 = 500 tiles.'
      },
      {
        id: 'apt-area-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Trapezium Area and Height] The parallel sides of a trapezium are 20m and 30m. Its area is 500 sq m. Find distance between them.',
        question: 'The lengths of the two parallel sides of a regular trapezium are exactly 20 meters and 30 meters. If the total surface area of the trapezium is exactly 500 square meters, what is the exact perpendicular distance between its parallel sides?',
        options: [
          'A) 10 meters',
          'B) 15 meters',
          'C) 20 meters',
          'D) 25 meters'
        ],
        correctAnswer: 'C',
        explanation: 'Area of trapezium = 1/2 × (Sum of parallel sides) × Height. 500 = 1/2 × (20 + 30) × h => 500 = 1/2 × 50 × h => 500 = 25 × h => h = 500 / 25 = 20 meters.'
      },
      {
        id: 'apt-area-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Square and Rectangle Equivalent Area] The perimeter of a square is 48 cm. The area of a rectangle is 4 sq cm less than the area of the square. If the length of the rectangle is 14 cm, find its perimeter.',
        question: 'The exact perimeter of a perfect square is 48 cm. The total surface area of a rectangle is exactly 4 square cm less than the surface area of the square. If the length of the rectangle is exactly 14 cm, what is the total perimeter of the rectangle?',
        options: [
          'A) 40 cm',
          'B) 44 cm',
          'C) 48 cm',
          'D) 52 cm'
        ],
        correctAnswer: 'C',
        explanation: '1) Perimeter of square = 4a = 48 => a = 12 cm. 2) Area of square = 12^2 = 144 sq cm. 3) Area of rectangle = 144 - 4 = 140 sq cm. 4) Area = L × B => 140 = 14 × B => B = 10 cm. 5) Perimeter of rectangle = 2(L + B) = 2(14 + 10) = 2(24) = 48 cm.'
      },
      {
        id: 'apt-area-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Wheel Revolutions for Distance] The diameter of a wheel is 1.26 m. How far will it travel in 500 revolutions? (π = 22/7)',
        question: 'The outer diameter of a circular wheel is exactly 1.26 meters. Exactly how far will the wheel travel in a straight line after completing exactly 500 full revolutions? (Take π = 22/7)',
        options: [
          'A) 1,480 meters',
          'B) 1,860 meters',
          'C) 1,980 meters',
          'D) 2,160 meters'
        ],
        correctAnswer: 'C',
        explanation: '1) Distance in 1 revolution = Circumference = π × d = (22/7) × 1.26 = 22 × 0.18 = 3.96 meters. 2) Distance in 500 revolutions = 500 × 3.96 = 1980 meters.'
      },
      {
        id: 'apt-area-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Percentage Error in Area] If the length of a rectangle is measured 5% in excess and the breadth is measured 4% in deficit, find the percentage error in the calculated area.',
        question: 'Due to a faulty measuring tape, the length of a rectangle is recorded exactly 5% in excess of its true length, and its breadth is recorded exactly 4% in deficit (less) of its true breadth. What is the exact percentage error in the mathematically calculated area?',
        options: [
          'A) 0.8% excess',
          'B) 1.0% deficit',
          'C) 1.2% excess',
          'D) 1.0% excess'
        ],
        correctAnswer: 'A',
        explanation: 'Let original L = 100, B = 100. True Area = 10000. Measured L = 105, Measured B = 96. Measured Area = 105 × 96 = 10080. Error = 10080 - 10000 = +80. % Error = (80 / 10000) × 100 = 0.8% excess. (Shortcut: x + y + xy/100 = 5 - 4 - 20/100 = 1 - 0.2 = 0.8%).'
      },
      {
        id: 'apt-area-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Circle and Square Equivalent Perimeter] The circumference of a circle equals the perimeter of a square. If the area of the circle is 616 sq cm, find the area of the square.',
        question: 'The exact mathematical circumference of a perfect circle is exactly equal to the total perimeter of a perfect square. If the surface area of the circle is exactly 616 sq cm, what is the exact total surface area of the square? (Take π = 22/7)',
        options: [
          'A) 384 sq cm',
          'B) 484 sq cm',
          'C) 529 sq cm',
          'D) 616 sq cm'
        ],
        correctAnswer: 'B',
        explanation: '1) Area of circle = πr^2 = 616 => (22/7)r^2 = 616 => r^2 = 616 × 7 / 22 = 28 × 7 = 196 => r = 14 cm. 2) Circumference = 2πr = 2 × (22/7) × 14 = 88 cm. 3) Since perimeter of square = 4a = 88, the side of the square a = 22 cm. 4) Area of the square = a^2 = 22^2 = 484 sq cm.'
      },
      {
        id: 'apt-area-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Ratio of Areas of Inscribed and Circumscribed Circles] What is the ratio of the areas of the inscribed and circumscribed circles of an equilateral triangle?',
        question: 'For a perfect equilateral triangle, what is the exact mathematical ratio of the surface area of its perfectly inscribed circle (incircle) to the surface area of its perfectly circumscribed circle (circumcircle)?',
        options: [
          'A) 1 : 2',
          'B) 1 : 3',
          'C) 1 : 4',
          'D) 1 : √2'
        ],
        correctAnswer: 'C',
        explanation: 'For an equilateral triangle of side a: 1) Inradius r = a / (2√3). 2) Circumradius R = a / √3. 3) Notice that R is exactly twice the inradius (R = 2r). 4) Since Area ∝ Radius^2, the ratio of their areas is r^2 : (2r)^2 = r^2 : 4r^2 = 1 : 4.'
      },
      {
        id: 'apt-area-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Parallelogram Altitude Ratio] A parallelogram has sides 15 cm and 10 cm. The distance between the 15 cm sides is 6 cm. Find the distance between the 10 cm sides.',
        question: 'A regular parallelogram has adjacent side lengths of 15 cm and 10 cm. If the perpendicular distance (altitude) between the two longer parallel sides (15 cm) is exactly 6 cm, what is the exact perpendicular distance between the two shorter parallel sides (10 cm)?',
        options: [
          'A) 4 cm',
          'B) 6 cm',
          'C) 9 cm',
          'D) 12 cm'
        ],
        correctAnswer: 'C',
        explanation: 'The area of a parallelogram is Base × Altitude. 1) Using the longer side as base: Area = 15 × 6 = 90 sq cm. 2) Using the shorter side as base: Area = 10 × h2. Since the area must be identical, 10 × h2 = 90 => h2 = 9 cm.'
      },
      {
        id: 'apt-area-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Heron\'s Formula for Triangle Area] The sides of a triangle are 13 cm, 14 cm, and 15 cm. Find its area.',
        question: 'A scalene triangle has exact side lengths of 13 cm, 14 cm, and 15 cm. What is the exact total surface area of this triangle?',
        options: [
          'A) 78 sq cm',
          'B) 84 sq cm',
          'C) 90 sq cm',
          'D) 96 sq cm'
        ],
        correctAnswer: 'B',
        explanation: 'Use Heron\'s Formula: s = (a + b + c) / 2 = (13 + 14 + 15) / 2 = 42 / 2 = 21. Area = √(s(s-a)(s-b)(s-c)) = √(21 × 8 × 7 × 6). Expand into prime factors: √( (3×7) × (2^3) × 7 × (2×3) ) = √( 2^4 × 3^2 × 7^2 ) = 2^2 × 3 × 7 = 4 × 21 = 84 sq cm.'
      },
      {
        id: 'apt-area-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Wire Bent from Rectangle to Circle] A wire in the form of a rectangle 18.7 cm by 11 cm is rebent into a circle. Find the radius of the circle.',
        question: 'A continuous wire is currently bent in the exact form of a rectangle measuring 18.7 cm long and 11 cm broad. If this entire wire is unbent and flawlessly reshaped into a perfect circle, what will be the exact radius of the newly formed circle? (Take π = 22/7)',
        options: [
          'A) 8.50 cm',
          'B) 9.45 cm',
          'C) 10.50 cm',
          'D) 12.00 cm'
        ],
        correctAnswer: 'B',
        explanation: '1) Length of the wire = Perimeter of rectangle = 2(L + B) = 2(18.7 + 11) = 2(29.7) = 59.4 cm. 2) The circumference of the circle will equal this length: 2πr = 59.4 => 2 × (22/7) × r = 59.4 => 44r / 7 = 59.4 => r = (59.4 × 7) / 44 = 415.8 / 44 = 9.45 cm.'
      },
      {
        id: 'apt-area-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Circular Park Path Area] A circular park has a radius of 21 m. A 7 m wide path runs outside around it. Find the area of the path.',
        question: 'A perfect circular park has an exact radius of 21 meters. A uniform walking path exactly 7 meters wide runs completely completely around the park on the OUTSIDE. What is the exact total surface area of this path? (Take π = 22/7)',
        options: [
          'A) 1,078 sq m',
          'B) 1,120 sq m',
          'C) 1,232 sq m',
          'D) 1,540 sq m'
        ],
        correctAnswer: 'A',
        explanation: 'Inner radius r = 21 m. The path is 7m wide, so the Outer radius R = 21 + 7 = 28 m. Area of the path = Area of Outer Circle - Area of Inner Circle = πR^2 - πr^2 = π(R^2 - r^2) = π(R - r)(R + r) = (22/7) × (28 - 21) × (28 + 21) = (22/7) × 7 × 49 = 22 × 49 = 1,078 sq meters.'
      },
      {
        id: 'apt-area-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Area of Sector and Arc Length] Find the area of a sector of a circle whose radius is 14 cm and the length of the corresponding arc is 22 cm.',
        question: 'What is the exact mathematical area of a specific sector of a circle, if the circle has an exact radius of 14 cm and the length of the corresponding arc for this sector is exactly 22 cm?',
        options: [
          'A) 154 sq cm',
          'B) 176 sq cm',
          'C) 198 sq cm',
          'D) 214 sq cm'
        ],
        correctAnswer: 'A',
        explanation: 'A fantastic shortcut formula links the area of a sector directly to its arc length (L) and radius (r) without needing to find the central angle: Area of Sector = 1/2 × L × r. Here, L = 22 cm and r = 14 cm. Area = 1/2 × 22 × 14 = 11 × 14 = 154 sq cm.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 27: VOLUME & SURFACE AREA (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 27,
    slug: 'aptitude-quant-volume-and-surface-area',
    title: 'Volume & Surface Area',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 48,
    video_url: 'http://www.youtube.com/watch?v=2rp_-h6PnFo',
    video_title: 'Volume & Surface Area - Shortcuts & Tricks 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Calculate 3D metrics for cubes, cuboids, cylinders, cones, and spheres. Master volume conservation during melting and structural cost optimizations.',
    summary_markdown: `### 📌 1. Core 3D Geometry Formulas
* **Cuboid:**
  * Volume = \`L × B × H\`
  * Total Surface Area (TSA) = \`2(LB + BH + HL)\`
  * Longest diagonal = \`√(L^2 + B^2 + H^2)\`
* **Cube:**
  * Volume = \`a^3\`, TSA = \`6a^2\`, Diagonal = \`a√3\`
* **Cylinder:**
  * Volume = \`πr^2h\`
  * Curved Surface Area (CSA) = \`2πrh\`
  * TSA = \`2πr(h + r)\`
* **Cone:**
  * Volume = \`1/3 πr^2h\`
  * Slant height \`l = √(r^2 + h^2)\`
  * CSA = \`πrl\`, TSA = \`πr(l + r)\`
* **Sphere:**
  * Volume = \`4/3 πr^3\`
  * Surface Area = \`4πr^2\`
* **Hemisphere:**
  * Volume = \`2/3 πr^3\`
  * CSA = \`2πr^2\`, TSA = \`3πr^2\`

### 💡 2. High-Yield Placement Shortcuts
* **Melting and Recasting (Conservation of Volume):**
  * When a solid is melted and formed into a new shape (or multiple small shapes), the **TOTAL VOLUME** remains strictly constant!
  * Example: Number of small lead spheres obtained by melting a large sphere = \`Volume of large / Volume of 1 small\`.
* **Flow Rates through Pipes into Tanks:**
  * Volume of water flowing per hour = \`Cross-sectional Area of Pipe × Speed of water flowing\`.
  * Time to fill tank = \`(Volume of Tank) / (Volume flowing per hour)\`.

### 💡 3. Proportional Scaling in 3D
* If the linear dimension (radius, side, height) is multiplied by \`k\`:
  * Surface Area is multiplied by **\`k^2\`**.
  * Volume is multiplied by **\`k^3\`**.
* If a sphere's radius is increased by 10%, its Volume increases by \`(1.10)^3 = 1.331\`, which is a 33.1% increase.`,
    questions: [
      {
        id: 'apt-vol-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Melting Spheres into a Single Sphere] Three solid metallic spheres of radii 3 cm, 4 cm, and 5 cm are melted to form a single solid sphere. Find the radius of the new sphere.',
        question: 'Three completely solid metallic spheres having radii of 3 cm, 4 cm, and 5 cm respectively are melted down and recast together into a single large solid sphere. What is the exact radius of the newly formed sphere?',
        options: [
          'A) 6 cm',
          'B) 7 cm',
          'C) 8 cm',
          'D) 12 cm'
        ],
        correctAnswer: 'A',
        explanation: 'Total Volume is conserved! V1 + V2 + V3 = V_new => (4/3)π(3^3) + (4/3)π(4^3) + (4/3)π(5^3) = (4/3)π(R^3). Cancel out (4/3)π from all terms: 3^3 + 4^3 + 5^3 = R^3 => 27 + 64 + 125 = R^3 => 216 = R^3. Taking the cube root gives R = 6 cm.'
      },
      {
        id: 'apt-vol-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q2: [Cone and Cylinder Ratio] A cone, a hemisphere, and a cylinder stand on equal bases and have the same height. Find the ratio of their volumes.',
        question: 'A right circular cone, a solid hemisphere, and a right circular cylinder all stand on identically sized circular bases and all possess the exact same vertical height. What is the exact mathematical ratio of their respective volumes (Cone : Hemisphere : Cylinder)?',
        options: [
          'A) 1 : 2 : 3',
          'B) 1 : 3 : 2',
          'C) 2 : 3 : 4',
          'D) 3 : 2 : 1'
        ],
        correctAnswer: 'A',
        explanation: 'Let the base radius be r. Since the hemisphere has height equal to its radius, the common height h = r for all three objects! 1) Volume of Cone = (1/3)πr^2h = (1/3)πr^3. 2) Volume of Hemisphere = (2/3)πr^3. 3) Volume of Cylinder = πr^2h = πr^3. The ratio is (1/3) : (2/3) : 1 = 1 : 2 : 3.'
      },
      {
        id: 'apt-vol-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Percentage Increase in Volume of a Cube] If each edge of a cube is increased by 50%, find the percentage increase in its surface area.',
        question: 'If every single edge of a perfect solid cube is increased by exactly 50%, what will be the exact overall percentage increase in its total surface area?',
        options: [
          'A) 100%',
          'B) 125%',
          'C) 150%',
          'D) 225%'
        ],
        correctAnswer: 'B',
        explanation: 'Let original edge = a. Surface Area = 6a^2. New edge = 1.5a. New Surface Area = 6(1.5a)^2 = 6(2.25a^2) = 2.25 × (6a^2). The new area is 2.25 times the old area, meaning it has strictly increased by 1.25 times, or exactly 125%.'
      },
      {
        id: 'apt-vol-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Longest Pole in a Room] The length, breadth, and height of a room are 12m, 4m, and 3m. Find the length of the longest pole that can be placed in it.',
        question: 'The internal length, breadth, and height of a rectangular room are exactly 12m, 4m, and 3m respectively. What is the maximum possible length of a single straight pole that can be completely placed inside this room?',
        options: [
          'A) 13 m',
          'B) 14 m',
          'C) 15 m',
          'D) 16 m'
        ],
        correctAnswer: 'A',
        explanation: 'The longest pole corresponds to the main diagonal of the cuboid space. Diagonal = √(L^2 + B^2 + H^2) = √(12^2 + 4^2 + 3^2) = √(144 + 16 + 9) = √169 = 13 meters.'
      },
      {
        id: 'apt-vol-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Water Flowing through a Pipe] Water flows through a cylindrical pipe of 14 cm internal diameter at 3 km/hr into a rectangular tank 50m × 44m. Rise in water level in 2 hours?',
        question: 'Liquid water freely flows through a cylindrical pipe of internal diameter exactly 14 cm at a constant rate of 3 km/hr into a rectangular empty tank measuring 50m by 44m. Exactly what will be the rise in the water level of the tank after exactly 2 hours? (Take π = 22/7)',
        options: [
          'A) 3.5 cm',
          'B) 4.2 cm',
          'C) 5.0 cm',
          'D) 6.4 cm'
        ],
        correctAnswer: 'B',
        explanation: '1) Cross-sectional area of pipe: Radius = 7 cm = 0.07 m. Area = πr^2 = (22/7) × (0.07)^2 = 0.0154 sq meters. 2) Volume of water flowing per hour = Area × Speed = 0.0154 × 3000 m/hr = 46.2 cubic meters. 3) Volume flowing in 2 hours = 46.2 × 2 = 92.4 cubic meters. 4) This volume accumulates in the tank: Volume = L × B × Rise => 92.4 = 50 × 44 × Rise => 92.4 = 2200 × Rise => Rise = 92.4 / 2200 = 0.042 meters = 4.2 cm.'
      },
      {
        id: 'apt-vol-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Surface Area of Combined Cubes] Two cubes, each of volume 64 cubic cm, are joined end to end. Find the surface area of the resulting cuboid.',
        question: 'Two identical solid cubes, each having an exact volume of 64 cubic cm, are perfectly joined end to end. What is the total surface area of the resulting solid cuboid?',
        options: [
          'A) 128 sq cm',
          'B) 160 sq cm',
          'C) 192 sq cm',
          'D) 256 sq cm'
        ],
        correctAnswer: 'B',
        explanation: '1) Volume of one cube = a^3 = 64 => side a = 4 cm. 2) When two such cubes are joined end-to-end, the resulting cuboid has Length L = 4 + 4 = 8 cm, Breadth B = 4 cm, and Height H = 4 cm. 3) Total Surface Area = 2(LB + BH + HL) = 2(8×4 + 4×4 + 4×8) = 2(32 + 16 + 32) = 2(80) = 160 sq cm.'
      },
      {
        id: 'apt-vol-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Melting Cylinder into Cone] A metallic cylinder of radius 8 cm and height 2 cm is melted and converted into a right circular cone of height 6 cm. Radius of the cone?',
        question: 'A solid metallic right circular cylinder possessing a base radius of 8 cm and a height of 2 cm is melted down and completely recast into a solid right circular cone having a height of 6 cm. What is the base radius of the new cone?',
        options: [
          'A) 6 cm',
          'B) 8 cm',
          'C) 10 cm',
          'D) 12 cm'
        ],
        correctAnswer: 'B',
        explanation: 'Volume is conserved! Volume of Cylinder = Volume of Cone => π(r_cyl)^2(h_cyl) = (1/3)π(r_cone)^2(h_cone). Substitute values: π × 8^2 × 2 = (1/3) × π × (r_cone)^2 × 6. Cancel π from both sides: 64 × 2 = (r_cone)^2 × 2 => 128 = 2 × (r_cone)^2 => (r_cone)^2 = 64. Thus, the radius of the cone is 8 cm.'
      },
      {
        id: 'apt-vol-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Volume of Largest Cone in a Cube] Find the volume of the largest right circular cone that can be cut out of a cube of edge 14 cm.',
        question: 'What is the exact mathematical volume of the largest possible solid right circular cone that can be perfectly carved out of a solid wooden cube whose edges measure exactly 14 cm? (Take π = 22/7)',
        options: [
          'A) 718.66 cubic cm',
          'B) 1078.0 cubic cm',
          'C) 1232.0 cubic cm',
          'D) 2156.0 cubic cm'
        ],
        correctAnswer: 'A',
        explanation: 'To be the largest possible cone, its circular base must perfectly touch the midpoints of the bottom face of the cube, making its diameter equal to the cube\'s edge (Diameter = 14 cm => Radius r = 7 cm). The height of the cone must extend fully to the top face, so h = 14 cm. Volume of Cone = (1/3)πr^2h = (1/3) × (22/7) × (7^2) × 14 = (1/3) × 22 × 7 × 14 = (1/3) × 2156 = 718.66 cubic cm.'
      },
      {
        id: 'apt-vol-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Increase in Volume of Cylinder] If the radius of a cylinder is doubled and its height is halved, find the ratio of the new volume to the old volume.',
        question: 'If the base radius of a solid cylinder is mathematically doubled and its vertical height is simultaneously halved, what is the exact ratio of its newly formed volume to its original volume?',
        options: [
          'A) 1 : 1',
          'B) 2 : 1',
          'C) 4 : 1',
          'D) 1 : 2'
        ],
        correctAnswer: 'B',
        explanation: 'Original Volume V1 = πr^2h. New parameters: R = 2r, H = h/2. New Volume V2 = π(2r)^2(h/2) = π(4r^2)(h/2) = 2πr^2h. Ratio = V2 / V1 = (2πr^2h) / (πr^2h) = 2 : 1.'
      },
      {
        id: 'apt-vol-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Surface Area of Hemisphere] Find the Total Surface Area of a solid hemisphere of radius 21 cm.',
        question: 'What is the exact Total Surface Area (TSA) of a perfectly solid hemisphere possessing an exact radius of 21 cm? (Take π = 22/7)',
        options: [
          'A) 2,772 sq cm',
          'B) 3,124 sq cm',
          'C) 4,158 sq cm',
          'D) 5,544 sq cm'
        ],
        correctAnswer: 'C',
        explanation: 'For a SOLID hemisphere, Total Surface Area = Curved Surface Area + Area of flat circular base = 2πr^2 + πr^2 = 3πr^2. TSA = 3 × (22/7) × (21)^2 = 3 × (22/7) × 441 = 3 × 22 × 63 = 66 × 63 = 4,158 sq cm.'
      },
      {
        id: 'apt-vol-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Number of Lead Shots from a Cube] How many lead shots, each 3 mm in diameter, can be made from a cuboid of dimensions 9cm × 11cm × 12cm?',
        question: 'Exactly how many identical spherical lead shots, each possessing an outer diameter of exactly 3 mm, can be completely cast by melting down a solid cuboid measuring exactly 9 cm by 11 cm by 12 cm? (Take π = 22/7)',
        options: [
          'A) 84,000',
          'B) 88,000',
          'C) 90,000',
          'D) 92,000'
        ],
        correctAnswer: 'A',
        explanation: 'Convert all dimensions to cm! Diameter of shot = 3 mm = 0.3 cm => Radius r = 0.15 cm. 1) Volume of cuboid = 9 × 11 × 12 = 1188 cubic cm. 2) Volume of one spherical shot = (4/3)πr^3 = (4/3) × (22/7) × (0.15)^3 = (88/21) × 0.003375 = 0.0141428 cubic cm. 3) Number of shots = Total Volume / Volume of 1 shot = 1188 / [(88/21) × (3.375/1000)] = (1188 × 21 × 1000) / (88 × 3.375) = 24948000 / 297 = 84,000 lead shots.'
      },
      {
        id: 'apt-vol-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Hollowing out a Cylinder] A hollow cylindrical tube 20 cm long is made of iron and its external and internal diameters are 8 cm and 6 cm. Find volume of iron used.',
        question: 'A hollow cylindrical tube strictly 20 cm long is cast out of iron. Its external outer diameter is exactly 8 cm, and its internal empty diameter is exactly 6 cm. What is the exact total mathematical volume of iron used in fabricating the tube? (Take π = 22/7)',
        options: [
          'A) 330 cubic cm',
          'B) 440 cubic cm',
          'C) 550 cubic cm',
          'D) 660 cubic cm'
        ],
        correctAnswer: 'B',
        explanation: 'Outer radius R = 8/2 = 4 cm. Inner radius r = 6/2 = 3 cm. The volume of material = Volume of outer cylinder - Volume of inner empty cylinder = πR^2h - πr^2h = πh(R^2 - r^2). Volume = (22/7) × 20 × (4^2 - 3^2) = (22/7) × 20 × (16 - 9) = (22/7) × 20 × 7 = 22 × 20 = 440 cubic cm.'
      },
      {
        id: 'apt-vol-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Percentage Error in Cylinder Volume] If the radius of a cylinder decreases by 10% and height increases by 20%, what is the change in volume?',
        question: 'If the base radius of a solid cylinder is decreased by exactly 10%, while its vertical height is simultaneously increased by exactly 20%, what is the exact net percentage change in its overall volume?',
        options: [
          'A) 2.8% decrease',
          'B) 2.8% increase',
          'C) 1.2% decrease',
          'D) 1.2% increase'
        ],
        correctAnswer: 'A',
        explanation: 'Volume V = πr^2h. V ∝ r^2 × h. Let initial V = 100 × 100 × 100 (conceptually). New radius = 90% of r (multiplier 0.9). New height = 120% of h (multiplier 1.2). New Volume factor = (0.9)^2 × 1.2 = 0.81 × 1.2 = 0.972. Thus, the new volume is exactly 97.2% of the original volume. Change = 100 - 97.2 = 2.8% decrease.'
      },
      {
        id: 'apt-vol-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Ratio of Surface Areas of Spheres] If the ratio of volumes of two spheres is 8:27, find the ratio of their surface areas.',
        question: 'The mathematical volumes of two distinct perfect solid spheres are strictly in the ratio 8 : 27. What is the exact ratio of their respective total surface areas?',
        options: [
          'A) 2 : 3',
          'B) 4 : 9',
          'C) 8 : 27',
          'D) 16 : 81'
        ],
        correctAnswer: 'B',
        explanation: 'Volume ratio = (r1)^3 / (r2)^3 = 8 / 27. Taking the cube root of both sides gives the ratio of their radii: r1 / r2 = 2 / 3. Surface Area ratio = (r1)^2 / (r2)^2 = (2)^2 / (3)^2 = 4 / 9. Ratio is 4 : 9.'
      },
      {
        id: 'apt-vol-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q15: [Earth Dug out of a Well] A well of diameter 3m is dug 14m deep. The earth taken out is spread evenly around it to form an embankment 4m wide. Find the height of the embankment.',
        question: 'A cylindrical well with an inner diameter of exactly 3m is dug 14m deep into the ground. All the earth (soil) taken out is spread flawlessly and evenly around it to form an elevated circular embankment strictly 4m wide. What is the exact height of this new embankment?',
        options: [
          'A) 1.125 meters',
          'B) 1.250 meters',
          'C) 1.500 meters',
          'D) 2.250 meters'
        ],
        correctAnswer: 'A',
        explanation: '1) Volume of earth dug out = Volume of well = πr^2h = π × (1.5)^2 × 14 = π × 2.25 × 14 = 31.5π cubic meters. 2) The embankment forms a hollow cylinder completely around the well! Inner radius = 1.5m. Outer radius = 1.5m + 4m = 5.5m. 3) Area of the embankment base = π(R^2 - r^2) = π(5.5^2 - 1.5^2) = π(30.25 - 2.25) = 28π sq meters. 4) Volume of embankment = Base Area × Height => 31.5π = 28π × H => H = 31.5 / 28 = 9/8 = 1.125 meters.'
      },
      {
        id: 'apt-vol-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Surface Area of a Cuboid Painted] Dimensions of a room are 10m × 8m × 5m. Find the cost of painting its 4 walls and the ceiling at ₹10 per sq m.',
        question: 'The interior dimensions of a room are exactly 10m long, 8m broad, and 5m high. What is the exact total monetary cost of painting its 4 walls and the ceiling (ignoring the floor) at the rate of ₹10 per square meter?',
        options: [
          'A) ₹1,800',
          'B) ₹2,100',
          'C) ₹2,600',
          'D) ₹3,400'
        ],
        correctAnswer: 'C',
        explanation: '1) Area of 4 walls = Lateral Surface Area = 2(L + B) × H = 2(10 + 8) × 5 = 2(18) × 5 = 180 sq m. 2) Area of ceiling = L × B = 10 × 8 = 80 sq m. 3) Total area to paint = 180 + 80 = 260 sq m. 4) Total cost = 260 sq m × ₹10 = ₹2,600.'
      },
      {
        id: 'apt-vol-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Frustum Volume Application] A drinking glass is in the shape of a frustum of a cone of height 14 cm. Diameters of its two circular ends are 4 cm and 2 cm. Find capacity.',
        question: 'A solid drinking glass is specifically shaped as a frustum of a right circular cone having a vertical height of exactly 14 cm. If the diameters of its two circular flat ends are 4 cm and 2 cm, what is the total fluid capacity (volume) of the glass? (Take π = 22/7)',
        options: [
          'A) 88 cubic cm',
          'B) 102.66 cubic cm',
          'C) 112 cubic cm',
          'D) 154 cubic cm'
        ],
        correctAnswer: 'B',
        explanation: 'Formula for Volume of a Frustum of a cone = (1/3)πh(R^2 + r^2 + Rr). Here, Top Radius R = 4/2 = 2 cm, Bottom Radius r = 2/2 = 1 cm, Height h = 14 cm. Volume = (1/3) × (22/7) × 14 × (2^2 + 1^2 + 2×1) = (1/3) × 44 × (4 + 1 + 2) = (1/3) × 44 × 7 = 308 / 3 = 102.66 cubic cm.'
      },
      {
        id: 'apt-vol-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Cuboid Diagonal vs Edges Sum] Sum of length, breadth, and depth of a cuboid is 19 cm, and its diagonal is 5√5 cm. Surface area?',
        question: 'The mathematical sum of the length, breadth, and depth of a solid cuboid is exactly 19 cm, and the length of its longest internal diagonal is exactly 5√5 cm. What is the total outer surface area of the cuboid?',
        options: [
          'A) 125 sq cm',
          'B) 176 sq cm',
          'C) 236 sq cm',
          'D) 361 sq cm'
        ],
        correctAnswer: 'C',
        explanation: '1) We are given L + B + H = 19. 2) Diagonal = √(L^2 + B^2 + H^2) = 5√5 => L^2 + B^2 + H^2 = 125. 3) Using algebraic identity: (L + B + H)^2 = L^2 + B^2 + H^2 + 2(LB + BH + HL). Notice that 2(LB + BH + HL) IS the Total Surface Area (TSA)! 4) 19^2 = 125 + TSA => 361 = 125 + TSA => TSA = 361 - 125 = 236 sq cm.'
      },
      {
        id: 'apt-vol-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Weight of an Iron Pipe] An iron pipe is 21 cm long and its exterior diameter is 8 cm. If the thickness of the pipe is 1 cm and iron weighs 8 g/cm^3, find weight of the pipe.',
        question: 'A straight iron pipe is exactly 21 cm long, and its exterior diameter is exactly 8 cm. If the structural thickness of the iron pipe is strictly 1 cm and the physical density of iron is exactly 8 grams per cubic centimeter, what is the exact weight of the pipe? (Take π = 22/7)',
        options: [
          'A) 2.456 kg',
          'B) 3.696 kg',
          'C) 4.224 kg',
          'D) 5.120 kg'
        ],
        correctAnswer: 'B',
        explanation: '1) Outer radius R = 8/2 = 4 cm. Since thickness = 1 cm, Inner radius r = 4 - 1 = 3 cm. 2) Volume of iron = πh(R^2 - r^2) = (22/7) × 21 × (4^2 - 3^2) = 66 × (16 - 9) = 66 × 7 = 462 cubic cm. 3) Total weight = Volume × Density = 462 × 8 g = 3696 grams. Convert to kg = 3.696 kg.'
      },
      {
        id: 'apt-vol-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Water Conserved After Submersion] A rectangular tank is 15m × 11m and contains water to a depth of 5m. 200 solid spherical blocks of radius 21 cm are dropped. Rise in water level?',
        question: 'A rectangular tank base measures exactly 15m by 11m, and it presently contains water to a depth of 5m. Exactly 200 solid spherical steel blocks, each having a radius of exactly 21 cm, are completely dropped and submerged into the tank. What is the exact mathematical rise in the water level of the tank? (Take π = 22/7)',
        options: [
          'A) 4.12 cm',
          'B) 4.60 cm',
          'C) 4.704 cm',
          'D) 5.25 cm'
        ],
        correctAnswer: 'C',
        explanation: '1) The rise in water volume equals the total volume of all submerged blocks! 2) Volume of ONE sphere = (4/3)πr^3 = (4/3) × (22/7) × (0.21 m)^3 = (88/21) × 0.009261 = 0.038808 cubic meters. 3) Volume of 200 spheres = 200 × 0.038808 = 7.7616 cubic meters. 4) The accumulated volume causes the water to rise across the entire tank base. Area of tank base = 15 × 11 = 165 sq m. 5) Rise in level = Total Submerged Volume / Base Area = 7.7616 / 165 = 0.04704 meters = 4.704 cm.'
      }
    ]
  }
];

function cleanUrl(raw) {
  if (!raw) return '';
  const match = raw.match(/\((https?:\/\/[^\)]+)\)/);
  let url = match ? match[1] : (raw.match(/(https?:\/\/[^\s]+)/) ? raw.match(/(https?:\/\/[^\s]+)/)[1] : raw);
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }
  return url;
}

async function seedAptitudeBatch9() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 9 (TOPICS 25 TO 27) ===\n');

    // 1. Locate Aptitude Track
    const trackRes = await client.query(`
      SELECT id, name, slug, title FROM tracks 
      WHERE slug = 'aptitude' OR title = 'Aptitude' OR id = 27
      LIMIT 1;
    `);

    if (trackRes.rowCount === 0) {
      throw new Error('Aptitude track not found!');
    }

    const aptitudeTrackId = trackRes.rows[0].id;
    console.log(`Found Aptitude Track: ID = ${aptitudeTrackId} (${trackRes.rows[0].title})\n`);

    // 2. Upsert Topics 25 to 27
    for (const item of aptitudeBatch9) {
      console.log(`Processing Topic ${item.topic_order}: "${item.title}" (${item.slug})...`);
      const videoCleanUrl = cleanUrl(item.video_url);

      const existingTopicRes = await client.query(`
        SELECT id FROM topics WHERE slug = $1 LIMIT 1;
      `, [item.slug]);

      let topicId;
      const practiceJson = JSON.stringify(item.questions);
      const docLinksJson = JSON.stringify([]);
      const videoLinksJson = JSON.stringify([
        { title: item.video_title, url: videoCleanUrl, type: 'youtube' }
      ]);

      if (existingTopicRes.rowCount > 0) {
        topicId = existingTopicRes.rows[0].id;
        console.log(`  - Updating existing topic (ID: ${topicId})...`);
        await client.query(`
          UPDATE topics SET
            title = $1,
            name = $1,
            topic_order = $2,
            short_description = $3,
            description = $3,
            summary_markdown = $4,
            theory_summary = $4,
            practice_items = $5::jsonb,
            practice_problems = $5::jsonb,
            doc_links = $6::jsonb,
            video_links = $7::jsonb,
            creator_name = $8,
            creator_channel_url = $9,
            track_id = $10,
            module_name = $11,
            subtrack = $11,
            estimated_minutes = $12,
            difficulty = $13
          WHERE id = $14;
        `, [
          item.title,
          item.topic_order,
          item.short_description,
          item.summary_markdown,
          practiceJson,
          docLinksJson,
          videoLinksJson,
          'CareerRide',
          'https://www.youtube.com/@CareerRide',
          aptitudeTrackId,
          item.module_name,
          item.duration_minutes,
          'Hard',
          topicId
        ]);
      } else {
        console.log(`  - Inserting new topic...`);
        const insertRes = await client.query(`
          INSERT INTO topics (
            title, name, slug, topic_order, short_description, description,
            summary_markdown, theory_summary,
            practice_items, practice_problems, doc_links, video_links,
            creator_name, creator_channel_url, track_id, module_name, subtrack,
            estimated_minutes, difficulty
          ) VALUES (
            $1, $1, $2, $3, $4, $4,
            $5, $5,
            $6::jsonb, $6::jsonb, $7::jsonb, $8::jsonb,
            $9, $10, $11, $12, $12,
            $13, $14
          ) RETURNING id;
        `, [
          item.title,
          item.slug,
          item.topic_order,
          item.short_description,
          item.summary_markdown,
          practiceJson,
          docLinksJson,
          videoLinksJson,
          'CareerRide',
          'https://www.youtube.com/@CareerRide',
          aptitudeTrackId,
          item.module_name,
          item.duration_minutes,
          'Hard'
        ]);
        topicId = insertRes.rows[0].id;
        console.log(`  - Inserted topic ID: ${topicId}`);
      }

      // Map in track_topics
      await client.query(`
        DELETE FROM track_topics WHERE track_id = $1 AND topic_order = $2;
      `, [aptitudeTrackId, item.topic_order]);

      await client.query(`
        INSERT INTO track_topics (track_id, topic_id, topic_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (track_id, topic_id) DO UPDATE SET topic_order = EXCLUDED.topic_order;
      `, [aptitudeTrackId, topicId, item.topic_order]);

      // Sync resources table for video
      await client.query(`
        DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice', 'video', 'documentation');
      `, [topicId]);

      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'video', $4);
      `, [topicId, item.video_title, videoCleanUrl, item.duration_minutes]);

      console.log(`  ✅ Successfully seeded Topic ${item.topic_order} with ${item.questions.length} questions!\n`);
    }

    // 3. Update Aptitude Track Metadata
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tracks' AND column_name IN ('total_topics', 'estimated_hours');
    `);
    const availableCols = colCheck.rows.map(r => r.column_name);

    if (availableCols.includes('total_topics') && availableCols.includes('estimated_hours')) {
      await client.query(`UPDATE tracks SET total_topics = 27, estimated_hours = 54 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 27, estimated_hours = 54');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 27 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 27');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 9 (Topics 25 to 27) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch9();
