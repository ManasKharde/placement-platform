const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch11 = [
  // ===========================================================================
  // TOPIC 31: GEOMETRIC PROGRESSION (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 31,
    slug: 'aptitude-quant-geometric-progression',
    title: 'Geometric Progression',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 69,
    video_url: 'http://www.youtube.com/watch?v=rdC4Blp8qmk',
    video_title: 'Geometric Progression - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master exponential sequences, infinite limits, rebounding ball distance formulas, and the transformation of GPs into APs using Logarithms.',
    summary_markdown: `### 📌 1. Core Geometric Progression (GP) Formulas
* **N-th Term Formula:** **\`a_n = a × r^(n-1)\`**
* **Sum of N Terms (\`S_n\`):**
  * If \`r < 1\`: **\`S_n = a(1 - r^n) / (1 - r)\`**
  * If \`r > 1\`: **\`S_n = a(r^n - 1) / (r - 1)\`**
* **Sum using the Last Term (\`L\`):** **\`S_n = (Lr - a) / (r - 1)\`**
* **Sum of an Infinite GP (\`|r| < 1\`):** **\`S_∞ = a / (1 - r)\`**

### 💡 2. Geometric Mean & Transformations
* **Geometric Mean (GM):**
  * For two numbers \`a\` and \`b\`, the GM is **\`√(ab)\`**.
  * For a GP with an ODD number of terms, the exact middle term IS the geometric mean of the sequence!
* **Transformations:**
  * If you multiply or divide every term of a GP by a constant \`K\`, the resulting sequence remains a GP with the *same* common ratio \`r\`.
  * If you raise every term to a power \`P\`, the new series is a GP with common ratio **\`r^P\`**.
  * If you take the **Logarithm** of every term in a GP, the resulting sequence forms an **Arithmetic Progression (AP)**!

### 💡 3. High-Yield Placement Shortcuts
* **Bouncing Ball Problem:**
  A ball dropped from height \`H\` rebounds to a fraction \`r\` of its previous height.
  * Total distance traveled before coming to rest = **\`H × (1 + r) / (1 - r)\`**
* **Repeating Digits Sum (e.g., 3 + 33 + 333 + ...):**
  * Factor out the digit, divide/multiply by 9 to form (10-1), (100-1)...
  * Sum formula for \`d + dd + ddd...\` to \`n\` terms = **\`(d/9) × [(10/9)(10^n - 1) - n]\`**`,
    questions: [
      {
        id: 'apt-gp-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Finding Specific Term from Sequence] Find the 7th term of the geometric sequence: 3/8, 3/4, 3/2, 3, ...',
        question: 'What is the exact value of the 7th term in the Geometric Progression: 3/8, 3/4, 3/2, 3, ...?',
        options: [
          'A) 12',
          'B) 18',
          'C) 24',
          'D) 48'
        ],
        correctAnswer: 'C',
        explanation: 'First term a = 3/8. Common ratio r = (3/4) / (3/8) = 2. The n-th term is a × r^(n-1). For the 7th term: (3/8) × 2^6 = (3/8) × 64 = 3 × 8 = 24.'
      },
      {
        id: 'apt-gp-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Algebraic Relation of GP Terms] If the 3rd, 5th, and 7th terms of a GP are p, q, and r respectively, which of the following holds true?',
        question: 'In a Geometric Progression, if the 3rd term is p, the 5th term is q, and the 7th term is r, which of the following algebraic relationships strictly holds true?',
        options: [
          'A) q = (p + r) / 2',
          'B) q^2 = pr',
          'C) p^2 = qr',
          'D) q = p^2 r^2'
        ],
        correctAnswer: 'B',
        explanation: 'Let the first term be a and the ratio be R. p = aR^2, q = aR^4, r = aR^6. Notice that q is exactly halfway between p and r multiplicatively. Square q: q^2 = (aR^4)^2 = a^2 R^8. Multiply p and r: p × r = (aR^2) × (aR^6) = a^2 R^8. Therefore, q^2 = pr.'
      },
      {
        id: 'apt-gp-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Combined AM and GM Equations] The geometric mean of two numbers is 16 and their arithmetic mean is 20. Find the smaller of the two numbers.',
        question: 'For two distinct positive real numbers, their geometric mean is exactly 16 and their arithmetic mean is exactly 20. What is the value of the strictly smaller number?',
        options: [
          'A) 4',
          'B) 8',
          'C) 12',
          'D) 16'
        ],
        correctAnswer: 'B',
        explanation: 'Let the numbers be a and b. GM = √(ab) = 16 => ab = 256. AM = (a + b)/2 = 20 => a + b = 40. We have a quadratic equation: x^2 - (Sum)x + Product = 0 => x^2 - 40x + 256 = 0. Factoring: (x - 32)(x - 8) = 0. The two numbers are 32 and 8. The smaller number is 8.'
      },
      {
        id: 'apt-gp-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Product of 5 GP Terms] If the 3rd term of a Geometric Progression is 17, what is the product of its first 5 terms?',
        question: 'In a Geometric Progression consisting of positive terms, the exactly 3rd term is 17. What is the exact mathematical product of the first 5 terms of this sequence?',
        options: [
          'A) 17^3',
          'B) 17^4',
          'C) 17^5',
          'D) Cannot be determined'
        ],
        correctAnswer: 'C',
        explanation: 'Let the 5 terms be a/r^2, a/r, a, ar, ar^2. (This ensures the middle 3rd term is exactly a). We are given a = 17. The product of the 5 terms is (a/r^2) × (a/r) × a × (ar) × (ar^2). The common ratio r completely cancels out, leaving a^5. Thus, the product is 17^5.'
      },
      {
        id: 'apt-gp-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Triple Consecutive GP Condition] Three consecutive terms of a GP have their sum as 39 and their product as 729. Find the smallest of the three numbers.',
        question: 'Three strictly positive consecutive terms of a Geometric Progression have a sum of exactly 39 and a product of exactly 729. What is the value of the smallest of these three numbers?',
        options: [
          'A) 3',
          'B) 9',
          'C) 12',
          'D) 27'
        ],
        correctAnswer: 'A',
        explanation: 'Let the terms be a/r, a, ar. Product = (a/r) × a × ar = a^3 = 729 => a = 9. Sum = 9/r + 9 + 9r = 39 => 9/r + 9r = 30 => 3/r + 3r = 10 => 3r^2 - 10r + 3 = 0. Factoring: (3r - 1)(r - 3) = 0. So r = 3 or 1/3. The terms are 3, 9, 27 (or 27, 9, 3). The smallest number is 3.'
      },
      {
        id: 'apt-gp-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Sum of Mixed Digital Series] Find the sum of the series 11 + 103 + 1005 + 10007 ... up to n terms.',
        question: 'Find the exact algebraic sum of the following series up to exactly n terms:\n11 + 103 + 1005 + 10007 + ...',
        options: [
          'A) (10/9)[10^n - 1] + n^2',
          'B) (10/9)[10^n - 1] + n(n+1)/2',
          'C) (10/9)[10^(n+1) - 10] + n^2',
          'D) (10/9)[10^n - 1] + 2n'
        ],
        correctAnswer: 'A',
        explanation: 'Split the terms into a GP and an AP: (10 + 1) + (100 + 3) + (1000 + 5) + (10000 + 7) + ...\nGroup 1 (GP): 10 + 10^2 + 10^3 + ... + 10^n = 10(10^n - 1) / (10 - 1) = (10/9)[10^n - 1].\nGroup 2 (AP of odd numbers): 1 + 3 + 5 + 7 + ... to n terms = n^2.\nTotal sum = (10/9)[10^n - 1] + n^2.'
      },
      {
        id: 'apt-gp-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Sum of Repeating Digits Series] Find the sum of the series 3 + 33 + 333 + 3333 ... up to n terms.',
        question: 'Which of the following formulas correctly represents the exact sum of the series 3 + 33 + 333 + ... up to n terms?',
        options: [
          'A) (1/3) [ (10/9)(10^n - 1) - n ]',
          'B) (1/9) [ (10/3)(10^n - 1) - n ]',
          'C) (1/3) [ (10/9)(10^n - 1) + n ]',
          'D) 3 [ (10/9)(10^n - 1) - n ]'
        ],
        correctAnswer: 'A',
        explanation: 'Factor out 3: 3(1 + 11 + 111 + ...). Multiply and divide by 9: (3/9)(9 + 99 + 999 + ...) = (1/3)[(10 - 1) + (100 - 1) + (1000 - 1) + ...]. Separate the 10s and the 1s: (1/3)[ (10 + 10^2 + 10^3 + ... to n terms) - (1 + 1 + 1 ... to n terms) ]. The sum of the GP is (10/9)(10^n - 1). Thus, the total sum is (1/3)[ (10/9)(10^n - 1) - n ].'
      },
      {
        id: 'apt-gp-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Substituting Small N for Series Evaluation] Evaluate the sum of 1 + 2/3 + 3/3^2 + 4/3^3 + ... up to n terms.',
        question: 'Evaluate the sum of the arithmetico-geometric series 1 + 2/3 + 3/3^2 + 4/3^3 + ... up to exactly n terms. (Hint: Test n = 2)',
        options: [
          'A) 3/4 [ 3 - (2n + 3)/3^n ]',
          'B) 1/4 [ 9 - (2n + 3)/3^n ]',
          'C) 3/4 [ 3 - (n + 2)/3^(n-1) ]',
          'D) 1/2 [ 3 - (2n + 1)/3^n ]'
        ],
        correctAnswer: 'A',
        explanation: 'Calculate the sum manually for n=2: S_2 = 1 + 2/3 = 5/3. Test the options with n=2. Option A: 3/4 [ 3 - (4+3)/9 ] = 3/4 [ 3 - 7/9 ] = 3/4 [ 20/9 ] = 60/36 = 5/3. Option A matches perfectly. (This is a standard Arithmetico-Geometric Progression reduction).'
      },
      {
        id: 'apt-gp-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Infinite Geometric Series Sum] Find the sum of an infinite GP whose first term is 25 and second term is 5.',
        question: 'What is the exact mathematical sum of an infinite Geometric Progression sequence whose first term is 25 and whose second term is 5?',
        options: [
          'A) 30',
          'B) 31.25',
          'C) 31.5',
          'D) 125'
        ],
        correctAnswer: 'B',
        explanation: 'First term a = 25. Second term ar = 5. Therefore, common ratio r = 5 / 25 = 1/5. The sum of an infinite GP is S_∞ = a / (1 - r). S_∞ = 25 / (1 - 1/5) = 25 / (4/5) = 125 / 4 = 31.25.'
      },
      {
        id: 'apt-gp-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Bouncing Ball Infinite Distance] A ball falls from a height of 108 meters. It rebounds to 2/3 of its previous height every time. Total distance covered before coming to rest?',
        question: 'A rubber ball is dropped from a height of exactly 108 meters. Every time it strikes the ground, it rebounds to exactly 2/3 of its previous height. What is the total combined distance (downwards and upwards) covered by the ball before it theoretically comes to rest?',
        options: [
          'A) 324 meters',
          'B) 432 meters',
          'C) 540 meters',
          'D) 648 meters'
        ],
        correctAnswer: 'C',
        explanation: 'The downward distances form a GP: 108, 108(2/3), 108(2/3)^2... Sum_down = 108 / (1 - 2/3) = 108 / (1/3) = 324. The upward rebounds form a GP starting after the first drop: 108(2/3), 108(2/3)^2... Sum_up = 72 / (1 - 2/3) = 72 / (1/3) = 216. Total distance = 324 + 216 = 540 meters. (Shortcut formula: Total Distance = H × (1+r)/(1-r) = 108 × (5/3)/(1/3) = 108 × 5 = 540 meters).'
      },
      {
        id: 'apt-gp-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Logarithmic AP Common Difference] If a sequence is formed by taking log_10 of a GP with common ratio 100, what is the common difference of the new AP?',
        question: 'A strictly positive Geometric Progression has a common ratio of exactly 100. If a new sequence is formed by taking the base-10 logarithm (log_10) of every single term in the GP, the resulting sequence forms an Arithmetic Progression (AP). What is the exact common difference of this new AP?',
        options: [
          'A) 2',
          'B) 10',
          'C) 100',
          'D) 1/2'
        ],
        correctAnswer: 'A',
        explanation: 'Let the GP be a, a(100), a(100^2), a(100^3)... Take log_10 of each: log(a), log(a)+log(100), log(a)+log(100^2)... The sequence becomes log(a), log(a)+2, log(a)+4... The difference between consecutive terms is exactly 2. (In general, common difference d = log(r)).'
      },
      {
        id: 'apt-gp-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Sum of Squares of Infinite GP Terms] Sum of an infinite GP is 15 and sum of squares of its terms is 45. Find common ratio.',
        question: 'The sum of an infinite Geometric Progression is exactly 15, and the sum of the squares of all its terms is exactly 45. What is the exact common ratio of this GP?',
        options: [
          'A) 1/3',
          'B) 2/3',
          'C) 3/4',
          'D) 4/5'
        ],
        correctAnswer: 'B',
        explanation: '1) Sum = a / (1 - r) = 15 => a = 15(1 - r). 2) Squaring the terms of a GP yields a new GP with first term a^2 and ratio r^2. Sum of squares = a^2 / (1 - r^2) = 45. Substitute a: [15(1 - r)]^2 / [(1 - r)(1 + r)] = 45 => 225(1 - r)^2 / [(1 - r)(1 + r)] = 45 => 225(1 - r) / (1 + r) = 45. Divide by 45: 5(1 - r) = 1 + r => 5 - 5r = 1 + r => 6r = 4 => r = 4/6 = 2/3.'
      },
      {
        id: 'apt-gp-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Deducing the nth Term Equation] The sum of the first n terms of a series is 2(3^n - 1). Find the 5th term.',
        question: 'If the total sum of the first n terms of a mathematical series is governed exactly by the formula S_n = 2(3^n - 1), what is the exact numerical value of the 5th term in this series?',
        options: [
          'A) 162',
          'B) 324',
          'C) 486',
          'D) 728'
        ],
        correctAnswer: 'B',
        explanation: 'The n-th term T_n is the difference between the sum of n terms and the sum of (n-1) terms: T_n = S_n - S_(n-1). For the 5th term: T_5 = S_5 - S_4. S_5 = 2(3^5 - 1) = 2(243 - 1) = 2(242) = 484. S_4 = 2(3^4 - 1) = 2(81 - 1) = 2(80) = 160. T_5 = 484 - 160 = 324.'
      },
      {
        id: 'apt-gp-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Ratio of Even and Odd Sub-Series Sums] A GP has 6 terms. Sum of odd terms is 182, sum of even terms is 546. Common ratio?',
        question: 'A Geometric Progression sequence has exactly 6 terms. The sum of the terms in the odd positions (1st, 3rd, 5th) is exactly 182, and the sum of the terms in the even positions (2nd, 4th, 6th) is exactly 546. What is the common ratio of this GP?',
        options: [
          'A) 2',
          'B) 3',
          'C) 4',
          'D) 6'
        ],
        correctAnswer: 'B',
        explanation: 'Odd terms: a + ar^2 + ar^4 = 182. Even terms: ar + ar^3 + ar^5 = 546. Notice that if you factor out r from the even terms sum, you get: r(a + ar^2 + ar^4) = 546. Substitute the odd sum: r(182) = 546 => r = 546 / 182 = 3.'
      },
      {
        id: 'apt-gp-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Original Term Given Infinite Sum and Second Term] Sum of an infinite GP is 4, and its 2nd term is 3/4. Find the first term.',
        question: 'The sum of an infinite Geometric Progression composed of strictly positive terms is exactly 4. If the 2nd term of this sequence is exactly 3/4, what is the exact value of the very first term?',
        options: [
          'A) 1',
          'B) 1.5',
          'C) 2',
          'D) 3'
        ],
        correctAnswer: 'D',
        explanation: '1) Sum = a / (1 - r) = 4 => a = 4(1 - r). 2) 2nd term = ar = 3/4 => r = 3 / (4a). Substitute r into the first equation: a = 4(1 - 3/(4a)) = 4 - 3/a. Multiply by a: a^2 = 4a - 3 => a^2 - 4a + 3 = 0. Factoring: (a - 3)(a - 1) = 0. So a = 3 or a = 1. Taking the primary decreasing root with r < 1/2 gives a = 3 (where r = 1/4).'
      },
      {
        id: 'apt-gp-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Finding Target N for Given Sum] The sum of first n terms of the GP 2, 4, 8... is 1022. Find n.',
        question: 'Consider the Geometric Progression sequence: 2, 4, 8, 16, ... If the exact total sum of the first n terms of this sequence is 1,022, what is the exact value of n?',
        options: [
          'A) 8',
          'B) 9',
          'C) 10',
          'D) 11'
        ],
        correctAnswer: 'B',
        explanation: 'First term a = 2. Common ratio r = 2. Sum S_n = a(r^n - 1) / (r - 1). 1022 = 2(2^n - 1) / (2 - 1) => 1022 = 2(2^n - 1) => 511 = 2^n - 1 => 512 = 2^n. Since 2^9 = 512, n = 9.'
      },
      {
        id: 'apt-gp-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Inserting Geometric Means] If 3 geometric means are inserted between 2 and 162, find the sum of these 3 means.',
        question: 'Exactly 3 geometric means are inserted strictly between the numbers 2 and 162 to form a valid 5-term Geometric Progression of positive numbers. What is the exact sum of these 3 inserted geometric means?',
        options: [
          'A) 72',
          'B) 78',
          'C) 84',
          'D) 90'
        ],
        correctAnswer: 'B',
        explanation: 'The sequence has 5 terms: 2, m1, m2, m3, 162. The n-th term formula: a_5 = a × r^4 => 162 = 2 × r^4 => 81 = r^4 => r = 3 (since terms are positive). The geometric means are 2×3 = 6, 6×3 = 18, 18×3 = 54. Sum = 6 + 18 + 54 = 78.'
      },
      {
        id: 'apt-gp-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Product of GP Term Combinations] The product of 3 consecutive terms in a GP is 216. The sum of their products in pairs is 156. Find the largest term.',
        question: 'Three positive numbers are strictly in a Geometric Progression. The product of these three numbers is exactly 216, and the sum of their pairwise products (a×b + b×c + c×a) is exactly 156. What is the exact value of the largest number among them?',
        options: [
          'A) 12',
          'B) 16',
          'C) 18',
          'D) 24'
        ],
        correctAnswer: 'C',
        explanation: 'Let terms be a/r, a, ar. Product = (a/r) × a × (ar) = a^3 = 216 => a = 6. Sum of products in pairs: (a/r)×a + a×(ar) + (a/r)×(ar) = a^2/r + a^2r + a^2 = a^2(1/r + r + 1) = 156. Substitute a=6: 36(1/r + r + 1) = 156 => 1/r + r + 1 = 156 / 36 = 13 / 3 => 1/r + r = 10 / 3. Solving r + 1/r = 10/3 gives r = 3 or 1/3. The terms are 2, 6, 18. The largest term is 18.'
      },
      {
        id: 'apt-gp-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Sum of Decimal Shift GP] Find the sum to n terms: 0.9 + 0.99 + 0.999 + ...',
        question: 'Which of the following algebraic formulas correctly represents the exact sum of the series 0.9 + 0.99 + 0.999 + ... up to exactly n terms?',
        options: [
          'A) n - 1/9 (1 - 10^-n)',
          'B) n - 10/9 (1 - 10^-n)',
          'C) n + 1/9 (1 - 10^-n)',
          'D) n - 1/9 (10^n - 1)'
        ],
        correctAnswer: 'A',
        explanation: 'Rewrite the series: (1 - 0.1) + (1 - 0.01) + (1 - 0.001) + ... up to n terms. Separate the 1s and the decimals: (1 + 1 + 1 ... n times) - (1/10 + 1/100 + 1/1000 + ...). The first part is exactly n. The second part is a GP with a = 1/10 and r = 1/10. Sum of GP = (1/10)[1 - (1/10)^n] / (1 - 1/10) = (1/10)[1 - 10^-n] / (9/10) = (1/9)[1 - 10^-n]. Total sum = n - 1/9 (1 - 10^-n).'
      },
      {
        id: 'apt-gp-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Difference Between Infinite and Finite Sums] An infinite GP has first term a=4, r=1/2. What is the absolute difference between the sum to infinity and the sum to 6 terms?',
        question: 'Consider a Geometric Progression where the first term is 4 and the common ratio is 1/2. What is the exact absolute difference between its sum to infinity and its sum to exactly 6 terms?',
        options: [
          'A) 1/8',
          'B) 1/16',
          'C) 1/32',
          'D) 1/64'
        ],
        correctAnswer: 'A',
        explanation: 'Sum to infinity S_∞ = a / (1 - r) = 4 / (1 - 1/2) = 4 / (1/2) = 8. Sum to 6 terms S_6 = a(1 - r^6) / (1 - r) = 4(1 - (1/2)^6) / (1/2) = 8(1 - 1/64) = 8 - 8/64 = 8 - 1/8. Difference = S_∞ - S_6 = 8 - (8 - 1/8) = 1/8.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 32: PIE CHART (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 32,
    slug: 'aptitude-quant-pie-chart',
    title: 'Pie Chart',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 48,
    video_url: 'http://www.youtube.com/watch?v=fA8cQW-nmIw',
    video_title: 'Pie Chart - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams | Data Interpretation',
    short_description: 'Decode 360-degree sector geometries, percentage distributions, dual pie chart comparisons, and fractional slice ratios without raw value calculation.',
    summary_markdown: `### 📌 1. Core Pie Chart Mechanics
* A pie chart represents 100% of a dataset distributed across a full **360° circle**.
* **Angle to Percentage:** \`Percentage = (Central Angle / 360) × 100\`
* **Percentage to Angle:** \`Central Angle = Percentage × 3.6°\`
  * Example: \`10% = 36°\`, \`25% = 90°\`, \`1% = 3.6°\`.

### 💡 2. Avoid Redundant Calculations!
* **Comparing Sub-Categories:** If asked for the ratio between two sectors (e.g., Sector A and Sector B) from the *same* pie chart, **never calculate their absolute monetary/unit values!** Simply take the ratio of their percentages or central angles.
* **Finding Differences:** If asked for the difference in values between Sector A (15%) and Sector B (10%), calculate **5%** of the total. Do not calculate 15% and 10% separately and then subtract.

### 💡 3. High-Yield Data Interpretation Hacks
* **Unit Digit Strategy for Angles:** When multiplying a percentage by \`3.6\`, observe the unit digit of the multiplication to instantly filter out wrong MCQ options.
* **Double Pie Chart Linkage:** If Pie Chart 1 shows Total Population and Pie Chart 2 shows Male Population, finding Female Population requires calculating absolute values from both charts and subtracting. You *cannot* directly subtract percentages from two different pie charts!`,
    questions: [
      {
        id: 'apt-pie-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q1: [Direct Sectoral Angle] A family\'s budget allocates 8% of total expenses to Charity. What is the exact sectoral angle for Charity in a pie chart?',
        question: 'A family\'s yearly budget pie chart allocates exactly 8% of the total estimated expenses to Charity. What is the exact mathematical sectoral angle (central angle) made by the Charity sector in the pie chart?',
        options: [
          'A) 25.6°',
          'B) 28.8°',
          'C) 31.4°',
          'D) 35.6°'
        ],
        correctAnswer: 'B',
        explanation: 'In a pie chart, 100% corresponds to 360°. Therefore, 1% corresponds to 3.6°. For 8%, the angle is 8 × 3.6° = 28.8°. (Shortcut: Unit digit of 8 × 6 is 8, which points directly to 28.8).'
      },
      {
        id: 'apt-pie-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Difference Without Absolute Values] Total budget is ₹5,25,000. Rent is 20%, Savings is 10%, Charity is 8%. What is the combined estimate for Savings and Charity?',
        question: 'A family\'s total yearly expense budget is exactly ₹5,25,000. Their pie chart allocates Rent at 20%, Savings at 10%, and Charity at 8%. What is the exact combined monetary estimate for Savings and Charity put together?',
        options: [
          'A) ₹88,400',
          'B) ₹94,500',
          'C) ₹98,500',
          'D) ₹1,05,000'
        ],
        correctAnswer: 'B',
        explanation: 'We need the combined value of Savings (10%) and Charity (8%) = 18% of the total budget. Instead of calculating 18% directly: 20% of 5,25,000 is 1,05,000. 2% is 10,500. So 18% = 20% - 2% = 1,05,000 - 10,500 = ₹94,500.'
      },
      {
        id: 'apt-pie-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Percentage More Than] Groceries sector is 15% and Travel is 10%. By what percentage is the expense on Groceries MORE than the expense on Travel?',
        question: 'In a budget pie chart, the expense on Groceries is 15% of the total budget, and the expense on Travel is 10% of the total budget. By what exact percentage is the absolute expense on Groceries MORE than the absolute expense on Travel?',
        options: [
          'A) 5%',
          'B) 33.33%',
          'C) 50%',
          'D) 150%'
        ],
        correctAnswer: 'C',
        explanation: 'You do not need absolute values! Difference in percentage points = 15 - 10 = 5. The "base" for comparison is Travel (10). Percentage difference = (Difference / Base) × 100 = (5 / 10) × 100 = 50%. The expense on Groceries is 50% more than on Travel.'
      },
      {
        id: 'apt-pie-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Re-allocating Pie Percentages] Groceries (15%) reduces by 3%. The saved 3% is distributed equally to Travel (10%) and Charity (8%). New difference between Travel and Charity?',
        question: 'In an initial pie chart, Groceries represent 15%, Travel 10%, and Charity 8%. Due to online offers, the family spends exactly 3% less on Groceries (bringing it to 12%). They take this strictly saved 3% of the total budget and distribute it equally between Travel and Charity. What will be the exact percentage-point difference between the newly adjusted expenses on Travel and Charity?',
        options: [
          'A) 1.5%',
          'B) 2.0%',
          'C) 2.5%',
          'D) 3.0%'
        ],
        correctAnswer: 'B',
        explanation: '1) Initial difference between Travel and Charity = 10% - 8% = 2%. 2) The saved 3% is divided equally: 1.5% added to Travel and 1.5% added to Charity. 3) New Travel = 10 + 1.5 = 11.5%. New Charity = 8 + 1.5 = 9.5%. 4) New difference = 11.5% - 9.5% = 2%. (Shortcut: Adding identical amounts to two variables perfectly preserves their absolute difference!).'
      },
      {
        id: 'apt-pie-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Ratio from Degrees] A pie chart shows Cricket Bats at 18° and Badminton at 66°. Ratio of sales?',
        question: 'The total sales of a sports company are represented in a 360° pie chart. The central angle for Cricket Bats is exactly 18° and for Badminton is exactly 66°. Regardless of the absolute sales figures in Rupees, what is the exact ratio between the sales of Cricket Bats and Badminton?',
        options: [
          'A) 3 : 11',
          'B) 6 : 11',
          'C) 1 : 4',
          'D) 9 : 33'
        ],
        correctAnswer: 'A',
        explanation: 'Sales ratio is directly proportional to the central angles. Ratio = 18° : 66°. Divide both sides by 6: 18/6 = 3, 66/6 = 11. The simplest ratio is 3 : 11.'
      },
      {
        id: 'apt-pie-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Degrees to Percentage] What percentage of total sales comes from Badminton if its central angle is 66°?',
        question: 'In a complete 360° pie chart displaying yearly company sales, the sector corresponding to Badminton forms a central angle of exactly 66°. What exact percentage of the total sales does Badminton account for?',
        options: [
          'A) 16.33%',
          'B) 18.33%',
          'C) 20.00%',
          'D) 22.66%'
        ],
        correctAnswer: 'B',
        explanation: '100% of sales = 360°. Percentage = (Central Angle / 360) × 100. Percentage = (66 / 360) × 100 = (660 / 36) = 110 / 6 = 55 / 3 = 18.33%. (Shortcut check: 10% is 36°, 20% is 72°. 66° is slightly less than 20%, mapping perfectly to 18.33%).'
      },
      {
        id: 'apt-pie-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Linked Table Fraction] Total tourists = 90k. April pie sector = 8%, May = 12%. Table shows April X:Y ratio = 7:5, May X:Y ratio = 7:8. Ratio of Y in April to Y in May?',
        question: 'A pie chart shows total tourists (90,000) over 6 months: April sector is 8% and May sector is 12%. An accompanying table shows the ratio of tourists from Country X to Country Y is 7:5 in April, and 7:8 in May. What is the exact mathematical ratio of tourists from Country Y visiting in April to those visiting in May?',
        options: [
          'A) 15 : 32',
          'B) 25 : 48',
          'C) 35 : 48',
          'D) 5 : 8'
        ],
        correctAnswer: 'B',
        explanation: '1) Do NOT use the 90,000 base; it cancels out! 2) April Y\'s share = (5/12) of 8%. 3) May Y\'s share = (8/15) of 12%. 4) Ratio = [(5/12) × 8] / [(8/15) × 12] = (40/12) / (96/15) = (10/3) / (32/5) = (10/3) × (5/32) = 50 / 96 = 25 : 48.'
      },
      {
        id: 'apt-pie-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Multi-step Sub-population] Total 90k tourists. May sector is 12%. May X:Y ratio is 7:8. If 55% of X tourists in May were adults, how many were children?',
        question: 'Total tourists for a season are 90,000. A pie chart shows 12% visited in May. A table shows the ratio of Country X to Country Y tourists in May was 7:8. If exactly 55% of the tourists from Country X in May were adults, exactly how many were children?',
        options: [
          'A) 2,142',
          'B) 2,268',
          'C) 2,772',
          'D) 5,040'
        ],
        correctAnswer: 'B',
        explanation: '1) Total in May = 12% of 90,000 = 10,800. 2) Tourists from Country X in May = (7/15) × 10,800. Since 10800/15 = 720, X = 7 × 720 = 5,040. 3) If 55% are adults, 45% are children. 4) Children from X = 45% of 5040 = 0.45 × 5040 = 2,268.'
      },
      {
        id: 'apt-pie-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Total Expense Extrapolation] Total 90k tourists. Feb sector 22%. Feb X:Y is 4:5. Avg expense of X is ₹10k. Total expenditure of X in Feb?',
        question: 'Out of a total of 90,000 seasonal tourists, a pie chart allocates exactly 22% to the month of February. A linked table states the ratio of tourists from Country X to Country Y in February is 4:5. If the average expenditure by a tourist from Country X was ₹10,000, what was the total expenditure by tourists from Country X in February?',
        options: [
          'A) ₹8.4 Crores',
          'B) ₹8.8 Crores',
          'C) ₹9.2 Crores',
          'D) ₹9.6 Crores'
        ],
        correctAnswer: 'B',
        explanation: '1) Total in Feb = 22% of 90,000 = 19,800. 2) Tourists from Country X = (4/9) of 19,800 = 4 × 2200 = 8,800 tourists. 3) Total expenditure = 8,800 × 10,000 = 88,000,000. This is equal to 8.8 Crores (since 1 Crore = 10,000,000).'
      },
      {
        id: 'apt-pie-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Finding Total Value from Sub-component] A pie chart shows A=120°, B=90°, C=60°, D=90°. If B\'s value is 450, what is A\'s value?',
        question: 'A complete 360° pie chart is divided into exactly four sectors: A (120°), B (90°), C (60°), and D (90°). If the absolute numerical value of sector B is exactly 450, what is the exact absolute numerical value of sector A?',
        options: [
          'A) 500',
          'B) 550',
          'C) 600',
          'D) 650'
        ],
        correctAnswer: 'C',
        explanation: 'The values are directly proportional to their central angles. A\'s angle (120°) is (120/90) times B\'s angle (90°). 120/90 = 4/3. A\'s value = (4/3) × 450 = 4 × 150 = 600.'
      },
      {
        id: 'apt-pie-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Combined Averages from Multi-Sector Data] Uniforms=72°, Bats=18°, Badminton=66°, Footballs=27°, Cricket Balls=15°. If Uniforms sales are ₹9.5 Lakhs, find average sales of Footballs and Cricket Balls.',
        question: 'A pie chart of sports goods sales shows Uniforms at 72°, Footballs at 27°, and Cricket Balls at 15°. If the absolute sales from Uniforms are exactly ₹9,50,000, what is the exact numerical AVERAGE sales amount of Footballs and Cricket Balls combined?',
        options: [
          'A) ₹2,50,000',
          'B) ₹2,77,083',
          'C) ₹3,00,000',
          'D) ₹5,54,166'
        ],
        correctAnswer: 'B',
        explanation: '1) Combined angle for Footballs and Cricket Balls = 27° + 15° = 42°. 2) Since we want the AVERAGE of these 2 categories, we need the value for 42° / 2 = 21°. 3) Value for 72° = 9,50,000. 4) Value for 21° = (21 / 72) × 9,50,000 = (7 / 24) × 9,50,000 = 66,50,000 / 24 ≈ 2,77,083.33. Option B matches.'
      },
      {
        id: 'apt-pie-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Dual Pie Chart Deduction] In 2020, total students=1000, IT=20%. In 2021, total students=1500, IT=30%. Percentage increase in absolute IT students?',
        question: 'A university\'s enrollment is represented by two pie charts. In 2020, total students were 1,000 and the IT sector was exactly 20%. In 2021, total students rose to 1,500 and the IT sector expanded to exactly 30%. What is the exact percentage increase in the absolute number of IT students from 2020 to 2021?',
        options: [
          'A) 50%',
          'B) 100%',
          'C) 125%',
          'D) 150%'
        ],
        correctAnswer: 'C',
        explanation: '1) Absolute IT students in 2020 = 20% of 1000 = 200. 2) Absolute IT students in 2021 = 30% of 1500 = 450. 3) Absolute increase = 450 - 200 = 250. 4) Percentage increase = (Increase / Original) × 100 = (250 / 200) × 100 = 125%.'
      },
      {
        id: 'apt-pie-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Central Angle Difference] Sector X is 25% and Sector Y is 40%. How much more is the central angle of Y than X?',
        question: 'In a complete 360° pie chart, Sector X accounts for exactly 25% of the data, while Sector Y accounts for exactly 40%. By exactly how many degrees is the central angle of Sector Y larger than the central angle of Sector X?',
        options: [
          'A) 15°',
          'B) 45°',
          'C) 54°',
          'D) 60°'
        ],
        correctAnswer: 'C',
        explanation: 'Difference in percentage = 40% - 25% = 15%. Convert percentage to degrees: 15% of 360° = (15/100) × 360 = 1.5 × 36 = 54°.'
      },
      {
        id: 'apt-pie-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Internal Expense Shift Adjustment] Budget: Food=30%, Savings=35%. Food expense increases by 20% of itself, compensated entirely by reducing Savings. New angle for Savings?',
        question: 'A monthly budget pie chart initially allocates Food at 30% and Savings at 35%. Due to inflation, the absolute expense on Food increases by exactly 20% relative to its own previous amount. The family compensates for this by exclusively reducing their Savings. What will be the new central angle for Savings in the updated pie chart?',
        options: [
          'A) 100.8°',
          'B) 104.4°',
          'C) 108.0°',
          'D) 126.0°'
        ],
        correctAnswer: 'B',
        explanation: '1) Increase in Food = 20% of 30% = 0.20 × 30% = 6 percentage points. 2) New Food allocation = 36%. 3) Since the extra 6% comes entirely from Savings, New Savings = 35% - 6% = 29%. 4) New central angle for Savings = 29% of 360° = 29 × 3.6 = 104.4°.'
      },
      {
        id: 'apt-pie-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Profit Margin from Expense Pie Chart] Budget = 100k. Material=30%, Labor=40%, Misc=10%. Revenue = 150k. Profit margin?',
        question: 'A project\'s total expense budget of $100,000 is represented in a pie chart: Material = 30%, Labor = 40%, Miscellaneous = 10%. (The remaining 20% is allocated for marketing). If the total final revenue generated by the project is exactly $150,000, what is the profit margin percentage? (Note: Profit Margin = Total Profit / Total Revenue)',
        options: [
          'A) 33.33%',
          'B) 40.00%',
          'C) 46.66%',
          'D) 50.00%'
        ],
        correctAnswer: 'A',
        explanation: 'Total expenses = 100% of $100,000 = $100,000. Total Revenue = $150,000. Total Profit = Revenue - Expenses = 150,000 - 100,000 = $50,000. Profit margin percentage = (Profit / Revenue) × 100 = (50,000 / 150,000) × 100 = 33.33%.'
      },
      {
        id: 'apt-pie-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Production Ratio to Angle] Production of 3 items A, B, C is 2:3:5. What is the central angle for C?',
        question: 'A factory solely produces three distinct items: A, B, and C. The total production quantities of these items are strictly in the ratio 2 : 3 : 5. If this complete production data is plotted on a standard 360° pie chart, what will be the exact central angle for item C?',
        options: [
          'A) 120°',
          'B) 144°',
          'C) 160°',
          'D) 180°'
        ],
        correctAnswer: 'D',
        explanation: 'Total ratio parts = 2 + 3 + 5 = 10 parts. C represents 5 out of 10 parts, which is exactly half of the total production (50%). The central angle for 50% of a pie chart is 50% of 360° = 180°.'
      },
      {
        id: 'apt-pie-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Missing Sector Calculation] Four regions: N=10%, S=25%, E=35%. Angle for W?',
        question: 'A company\'s sales are exclusively divided among exactly four geographical regions: North, South, East, and West. The pie chart displays North at 10%, South at 25%, and East at 35%. What is the exact central angle of the West region sector?',
        options: [
          'A) 90°',
          'B) 100°',
          'C) 108°',
          'D) 120°'
        ],
        correctAnswer: 'C',
        explanation: 'Total percentage must be 100%. West % = 100% - (10% + 25% + 35%) = 100% - 70% = 30%. The central angle for 30% = 30 × 3.6° = 108°.'
      },
      {
        id: 'apt-pie-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Base Combination Problem] Pie chart of 5000 students: Arts=40%. Ratio of boys to girls in Arts is 3:5. Number of girls in Arts?',
        question: 'A university\'s pie chart of 5,000 enrolled students allocates exactly 40% of the student body to the Arts department. If the ratio of boys to girls strictly within the Arts department is 3 : 5, exactly how many girls are enrolled in the Arts department?',
        options: [
          'A) 1,000',
          'B) 1,250',
          'C) 1,500',
          'D) 2,000'
        ],
        correctAnswer: 'B',
        explanation: 'Total students in Arts = 40% of 5000 = 2000. Ratio of boys to girls = 3 : 5 (Total 8 parts). Number of girls = (5/8) × 2000 = 5 × 250 = 1,250.'
      },
      {
        id: 'apt-pie-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Deducing Total Budget from One Sector] Marketing = 54°, R&D = 108°. If Marketing is $15,000, what is R&D?',
        question: 'In a corporate expenditure pie chart, the Marketing sector has a central angle of exactly 54°, and the Research & Development (R&D) sector has a central angle of exactly 108°. If the absolute expenditure on Marketing is exactly $15,000, what is the absolute expenditure on R&D?',
        options: [
          'A) $20,000',
          'B) $25,000',
          'C) $30,000',
          'D) $45,000'
        ],
        correctAnswer: 'C',
        explanation: 'The expenditure values are directly proportional to their central angles. The angle for R&D (108°) is exactly twice the angle for Marketing (54°). Therefore, the expenditure on R&D is exactly twice the expenditure on Marketing. R&D = 2 × 15,000 = $30,000.'
      },
      {
        id: 'apt-pie-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Dynamic Change within Constant Total] If a pie chart sector\'s value increases by 50% while the absolute total pie value remains unchanged (other sectors shrink), how does its angle change?',
        question: 'In a fixed-total 360° pie chart, the absolute numerical value of a specific component suddenly increases by exactly 50%. The absolute total sum of all components remains strictly unchanged (meaning the other components shrink to compensate). How will the central angle of this specific component change?',
        options: [
          'A) It will increase by exactly 50%',
          'B) It will increase by less than 50%',
          'C) It will increase by more than 50%',
          'D) Cannot be determined without initial values'
        ],
        correctAnswer: 'A',
        explanation: 'Central Angle = (Component Value / Total Value) × 360°. Since the Total Value is constant and 360° is constant, the central angle is directly and linearly proportional to the Component Value. If the component value increases by 50%, its central angle must also increase by exactly 50%.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 33: BAR GRAPH (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 33,
    slug: 'aptitude-quant-bar-graph',
    title: 'Bar Graph',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 60,
    video_url: 'http://www.youtube.com/watch?v=LEM2xQEVYGo',
    video_title: 'Bar Graph - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams | Data Interpretation',
    short_description: 'Analyze absolute limits, decode stacked/grouped bar combinations, interpret missing grid lines visually, and prevent absolute/relative percentage pitfalls.',
    summary_markdown: `### 📌 1. Core Bar Graph Mechanics
* **Reading the Grid:** Always determine the value of the **minor grid lines** (e.g., if the gap between 20 and 30 has 5 intervals, each line represents 2 units).
* **Deciphering Stacked Bars:** In a stacked bar chart, the value of an inner segment is the **difference** between its top boundary and its bottom boundary. Do not read the absolute y-axis value of the top edge as the segment's size!
* **Tabulation First:** If a multi-series bar graph (e.g., 3 brands over 5 years) has many questions, spend 30 seconds writing the data into a quick table. It prevents misreading lines repeatedly under pressure.

### 💡 2. Avoid Data Traps
* **Percentage Rate vs. Absolute Value:** A graph titled "Percentage Hike in Fuel Prices" means prices are *always* going up (as long as the bar is positive). A dip in the bar from 11% to 9% does NOT mean the price fell; it means the price *increased* by a smaller margin (9% instead of 11%).
* **Average Calculations:** To calculate the average of 4.9, 6.3, 7.1, 8.2... remove the decimal, sum the integers (49 + 63 + 71 + 82...), find the average, and replace the decimal. It is much faster and reduces alignment errors.

### 💡 3. High-Yield Data Interpretation Hacks
* **Ratio Reductions:** When asked for the ratio of totals from two different years, cancel out the large trailing zeros early. E.g., ratio of 8.2 Million to 4.9 Million is just 82/49.
* **Finding "Above Average" Count:** Calculate the precise mathematical average once. Then simply count how many bars physically rise above that numerical threshold line.`,
    questions: [
      {
        id: 'apt-bar-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Fuel Price Hike Misinterpretation] Month-wise percentage hike graph: Jan=10%, Feb=11.6%, Mar=9%, Apr=12%. In how many months did prices NOT rise?',
        question: 'A bar graph accurately displays the "Month-wise Percentage Hike in Fuel Prices". The bar heights are: January = 10%, February = 11.6%, March = 9%, April = 12%. In exactly how many of these four months did the actual fuel prices NOT rise?',
        options: [
          'A) 0 months',
          'B) 1 month',
          'C) 2 months',
          'D) 3 months'
        ],
        correctAnswer: 'A',
        explanation: 'The graph shows the percentage HIKE (increase). Since every single bar is positive (10%, 11.6%, 9%, 12%), the price increased every single month. Even though the hike in March (9%) was lower than February (11.6%), it is still a positive hike, meaning the price went up. Thus, there are 0 months where the price did not rise.'
      },
      {
        id: 'apt-bar-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q2: [Successive Increases from Hike Data] Fuel price end of Jan = ₹80. Hike in Feb = 11.6%, Hike in Mar = 9%. Price at end of March?',
        question: 'The fuel price at the exact end of January was exactly ₹80.00 per liter. According to a bar graph, the price hiked by exactly 11.6% in February and then hiked by exactly 9.0% in March. What was the exact price of the fuel at the end of March?',
        options: [
          'A) ₹96.48',
          'B) ₹97.31',
          'C) ₹98.15',
          'D) ₹99.00'
        ],
        correctAnswer: 'B',
        explanation: 'This is a successive percentage increase. Price at end of Feb = 80 × (1 + 11.6/100) = 80 × 1.116 = 89.28. Price at end of March = 89.28 × (1 + 9/100) = 89.28 × 1.09 = 97.3152. Rounding to two decimal places gives ₹97.31.'
      },
      {
        id: 'apt-bar-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Average from Decimals Shortcut] Business revenues (Million USD): 2015=4.9, 2016=6.3, 2017=7.1, 2018=8.2, 2019=7.5, 2020=8.0, 2021=8.4. Find average.',
        question: 'A bar graph records e-commerce business revenues in Million USD over 7 years: 4.9 (2015), 6.3 (2016), 7.1 (2017), 8.2 (2018), 7.5 (2019), 8.0 (2020), and 8.4 (2021). What is the exact average business revenue over this 7-year period?',
        options: [
          'A) 7.0 Million USD',
          'B) 7.2 Million USD',
          'C) 7.4 Million USD',
          'D) 7.6 Million USD'
        ],
        correctAnswer: 'B',
        explanation: 'To add quickly, ignore the decimal: 49 + 63 + 71 + 82 + 75 + 80 (since 8.0 is 80) + 84. Sum = 49 + 63 = 112; 112 + 71 = 183; 183 + 82 = 265; 265 + 75 = 340; 340 + 80 = 420; 420 + 84 = 504. Put the decimal back: Sum = 50.4. Average = 50.4 / 7 = 7.2 Million USD.'
      },
      {
        id: 'apt-bar-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q4: [Counting Above Average Years] Based on previous data (Average 7.2), how many years had business above average?',
        question: 'An e-commerce business recorded the following yearly revenues (in Million USD): 4.9, 6.3, 7.1, 8.2, 7.5, 8.0, and 8.4. If the exact mathematical average for the period is 7.2 Million USD, in exactly how many years was the business strictly above the average?',
        options: [
          'A) 2 years',
          'B) 3 years',
          'C) 4 years',
          'D) 5 years'
        ],
        correctAnswer: 'C',
        explanation: 'The average is 7.2. We simply count the values strictly greater than 7.2: 8.2, 7.5, 8.0, and 8.4. There are exactly 4 years above the average.'
      },
      {
        id: 'apt-bar-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Stacked Bar Graph Deduction] Total 12,000 units. Odisha=12%. Automised in Odisha = 1000. Find un-automised in Odisha.',
        question: 'A combined chart displays data for a total of 12,000 factories. A pie chart shows exactly 12% of all factories are located in Odisha. A linked bar graph shows exactly 1,000 factories in Odisha are fully automized. How many factories in Odisha are UN-automized?',
        options: [
          'A) 240',
          'B) 440',
          'C) 1,000',
          'D) 1,440'
        ],
        correctAnswer: 'B',
        explanation: '1) Total factories in Odisha = 12% of 12,000 = 0.12 × 12000 = 1,440. 2) The bar graph states 1,000 of these are automized. 3) Un-automized factories = Total - Automized = 1440 - 1000 = 440.'
      },
      {
        id: 'apt-bar-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Bar Graph vs Pie Chart Total Checks] Karnataka = 29% of 12,000. Automized = 1800. Un-automized?',
        question: 'A pie chart shows that Karnataka holds exactly 29% of a total 12,000 units. A linked bar graph indicates that exactly 1,800 units in Karnataka are automized. Exactly how many units in Karnataka are UN-automized?',
        options: [
          'A) 1,580',
          'B) 1,680',
          'C) 1,780',
          'D) 1,880'
        ],
        correctAnswer: 'B',
        explanation: '1) Total units in Karnataka = 29% of 12,000 = 0.29 × 12000 = 29 × 120 = 3,480. 2) Un-automized units = Total - Automized = 3480 - 1800 = 1,680.'
      },
      {
        id: 'apt-bar-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Pie Chart Derived Bar Graph Difference] Telangana = 26% of 12000. Assam = 6% of 12000. Difference in total units?',
        question: 'From a base of 12,000 total units, Telangana accounts for exactly 26% and Assam accounts for exactly 6%. Without explicitly calculating the individual totals for both states first, what is the exact absolute difference in the total number of units between the two states?',
        options: [
          'A) 2,000',
          'B) 2,200',
          'C) 2,400',
          'D) 2,600'
        ],
        correctAnswer: 'C',
        explanation: 'Shortcut: Find the difference in their percentages first! Difference = 26% - 6% = 20%. The absolute difference in units is simply 20% of the total base. 20% of 12,000 = 0.20 × 12000 = 2,400 units.'
      },
      {
        id: 'apt-bar-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Reading Stacked Bar Graph Segments] Stacked bar: UPSC 2015=20L, 2016=22L, 2017=18L. Success rate = 0.8%. Total successful?',
        question: 'A stacked bar graph displays total examination candidates in Lakhs (L). For the UPSC segment specifically, the extracted values are: 20 Lakhs in 2015, 22 Lakhs in 2016, and 18 Lakhs in 2017. If the ultimate success rate across all three years combined is exactly 0.8%, how many total candidates succeeded in the UPSC exams over these three years?',
        options: [
          'A) 36,000',
          'B) 42,000',
          'C) 48,000',
          'D) 54,000'
        ],
        correctAnswer: 'C',
        explanation: '1) Total candidates = 20 + 22 + 18 = 60 Lakhs = 6,000,000 candidates. 2) Successful candidates = 0.8% of 6,000,000 = (0.8 / 100) × 6,000,000 = 0.008 × 6,000,000 = 48,000.'
      },
      {
        id: 'apt-bar-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q9: [Zero Growth Identification] Stacked bar: Banking candidates 2015=22L, 2017=22L. Percentage rise or fall?',
        question: 'A bar graph records exactly 22 Lakh candidates appearing for Banking exams in 2015. In 2017, the bar graph again records exactly 22 Lakh candidates appearing for the exact same exams. What is the exact percentage rise or fall in the number of candidates from 2015 to 2017?',
        options: [
          'A) 0% (No change)',
          'B) 1% Rise',
          'C) 1% Fall',
          'D) Cannot be determined'
        ],
        correctAnswer: 'A',
        explanation: 'Since the absolute values are identical (22 Lakhs to 22 Lakhs), the absolute change is 0. Therefore, the percentage rise or fall is exactly 0%.'
      },
      {
        id: 'apt-bar-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Brand Comparison Higher/Lower Logic] Milk by Brand C: 25, 30, 22, 35, 30. Brand A: 35, 40, 35, 32, 25. Ratio of times C < A to times C > A?',
        question: 'A grouped bar graph shows yearly milk production for two brands over 5 years.\nBrand C: 25, 30, 22, 35, 30\nBrand A: 35, 40, 35, 32, 25\nWhat is the exact ratio of the number of years where Brand C\'s production was STRICTLY LESS than Brand A\'s to the number of years where Brand C\'s production was STRICTLY GREATER than Brand A\'s?',
        options: [
          'A) 2 : 3',
          'B) 3 : 2',
          'C) 4 : 1',
          'D) 1 : 4'
        ],
        correctAnswer: 'B',
        explanation: 'Compare year by year (C vs A): Year 1 (25 < 35, C is Less). Year 2 (30 < 40, C is Less). Year 3 (22 < 35, C is Less). Year 4 (35 > 32, C is Greater). Year 5 (30 > 25, C is Greater). Brand C is strictly Less 3 times. Brand C is strictly Greater 2 times. The required ratio (Less : Greater) is 3 : 2.'
      },
      {
        id: 'apt-bar-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Ratio of Totals from Income Bar Graph] Income A: 200, 250, 300. B: 150, 200, 250. Ratio of total income?',
        question: 'A bar graph tracks the yearly income of two individuals, A and B, over 3 years.\nA\'s incomes: ₹200k, ₹250k, ₹300k\nB\'s incomes: ₹150k, ₹200k, ₹250k\nWhat is the exact ratio of the total 3-year income of A to the total 3-year income of B?',
        options: [
          'A) 4 : 3',
          'B) 5 : 4',
          'C) 6 : 5',
          'D) 7 : 6'
        ],
        correctAnswer: 'B',
        explanation: 'Total income of A = 200 + 250 + 300 = 750k. Total income of B = 150 + 200 + 250 = 600k. Ratio A : B = 750 : 600. Divide both by 150: 750/150 = 5, 600/150 = 4. The ratio is 5 : 4.'
      },
      {
        id: 'apt-bar-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Average Trade Deficit from Import/Export Bars] Exports: 40, 50, 60, 70. Imports: 50, 40, 70, 80. Average trade deficit?',
        question: 'A dual bar graph shows a country\'s Exports and Imports over 4 years.\nExports: 40, 50, 60, 70\nImports: 50, 40, 70, 80\nIf Trade Deficit is defined as (Imports - Exports), what is the exact average trade deficit over these 4 years?',
        options: [
          'A) 0',
          'B) 5',
          'C) 10',
          'D) 15'
        ],
        correctAnswer: 'B',
        explanation: 'Calculate the deficit (Imports - Exports) for each year: Year 1: 50 - 40 = +10. Year 2: 40 - 50 = -10 (surplus). Year 3: 70 - 60 = +10. Year 4: 80 - 70 = +10. Total deficit over 4 years = 10 - 10 + 10 + 10 = 20. Average deficit = Total / 4 = 20 / 4 = 5.'
      },
      {
        id: 'apt-bar-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Percentage Share of a Single Bar] Rainfall: M=12, T=15, W=10, Th=18, F=25. What % on Friday?',
        question: 'A bar graph records daily rainfall in cm for a 5-day work week:\nMonday: 12 cm, Tuesday: 15 cm, Wednesday: 10 cm, Thursday: 18 cm, Friday: 25 cm.\nWhat exact percentage of the total weekly rainfall occurred strictly on Friday?',
        options: [
          'A) 25.00%',
          'B) 28.50%',
          'C) 31.25%',
          'D) 35.00%'
        ],
        correctAnswer: 'C',
        explanation: 'Total rainfall = 12 + 15 + 10 + 18 + 25 = 80 cm. Rainfall on Friday = 25 cm. Percentage = (25 / 80) × 100 = (5 / 16) × 100 = 500 / 16 = 31.25%.'
      },
      {
        id: 'apt-bar-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Difference Between Total Categories] Class X: A=40, B=50, C=30. Class XI: A=30, B=60, C=40. Difference between total Class X and XI?',
        question: 'A grouped bar graph shows section-wise student counts for two grade levels.\nClass X (Sections A, B, C): 40, 50, 30\nClass XI (Sections A, B, C): 30, 60, 40\nWhat is the exact absolute difference between the total number of students in Class X and the total number of students in Class XI?',
        options: [
          'A) 0',
          'B) 5',
          'C) 10',
          'D) 15'
        ],
        correctAnswer: 'C',
        explanation: 'Total students in Class X = 40 + 50 + 30 = 120. Total students in Class XI = 30 + 60 + 40 = 130. Absolute difference = 130 - 120 = 10.'
      },
      {
        id: 'apt-bar-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Deducing Costs from Profit Margin Graph] Margin %: Y1=10%, Y2=15%, Y3=20%. If Revenue in Y2 is 200k, find Cost in Y2.',
        question: 'A bar graph displays a company\'s yearly Profit Margin Percentage (defined as Profit / Sales Revenue × 100). The graph shows: Year 1 = 10%, Year 2 = 15%, Year 3 = 20%. If the absolute Sales Revenue in Year 2 was exactly $200,000, what was the absolute Cost incurred in Year 2? (Note: Cost = Revenue - Profit)',
        options: [
          'A) $150,000',
          'B) $170,000',
          'C) $185,000',
          'D) $230,000'
        ],
        correctAnswer: 'B',
        explanation: 'Profit Margin = 15%. This means Profit is 15% of Sales Revenue. Profit = 0.15 × 200,000 = $30,000. Since Revenue = Cost + Profit, Cost = Revenue - Profit. Cost = 200,000 - 30,000 = $170,000.'
      },
      {
        id: 'apt-bar-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Year-over-Year Percentage Increase] Sales: 2018=45, 2019=55, 2020=40, 2021=60. % increase from 2020 to 2021?',
        question: 'A bar graph records car sales (in thousands): 45 (2018), 55 (2019), 40 (2020), and 60 (2021). What is the exact percentage increase in sales specifically from the year 2020 to the year 2021?',
        options: [
          'A) 20%',
          'B) 33.33%',
          'C) 50%',
          'D) 150%'
        ],
        correctAnswer: 'C',
        explanation: 'Sales in 2020 = 40. Sales in 2021 = 60. Absolute increase = 60 - 40 = 20. The "base" year for the comparison is 2020 (40). Percentage increase = (Increase / Base) × 100 = (20 / 40) × 100 = 50%.'
      },
      {
        id: 'apt-bar-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Average Revenue Over Four Quarters] Revenue: Q1=100, Q2=120, Q3=90, Q4=140. Average revenue per quarter?',
        question: 'A quarterly bar graph shows a startup\'s revenue (in thousands): Q1 = 100, Q2 = 120, Q3 = 90, Q4 = 140. What is the exact average revenue per quarter for this entire fiscal year?',
        options: [
          'A) 110',
          'B) 112.5',
          'C) 115',
          'D) 120'
        ],
        correctAnswer: 'B',
        explanation: 'Total revenue for the year = 100 + 120 + 90 + 140 = 450. Since there are 4 quarters, Average = 450 / 4 = 112.5.'
      },
      {
        id: 'apt-bar-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Multi-Brand Combined Averages] Total milk by A, B, C in 2011 = 35+20+25 = 80. Average = 26.6. How many times was Brand A\'s production > the average for that year?',
        question: 'A complex bar graph displays yearly milk production for three brands. In a specific year (2011), Brand A produced 35, Brand B produced 20, and Brand C produced 25. The mathematical average production across all three brands for that year is 26.6. If a candidate evaluates all 5 years and finds the yearly averages to be 26.6, 33.3, 28.3, 31.6, and 26.6, and Brand A\'s corresponding productions are 35, 40, 35, 32, and 25. Exactly how many times did Brand A strictly beat the yearly average?',
        options: [
          'A) 2',
          'B) 3',
          'C) 4',
          'D) 5'
        ],
        correctAnswer: 'C',
        explanation: 'We compare Brand A\'s production against the average for each respective year. Year 1: 35 > 26.6 (Yes). Year 2: 40 > 33.3 (Yes). Year 3: 35 > 28.3 (Yes). Year 4: 32 > 31.6 (Yes). Year 5: 25 < 26.6 (No). Brand A strictly beat the yearly average exactly 4 times.'
      },
      {
        id: 'apt-bar-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Ratio of Aggregate Metrics] Grouped Bar: Pass/Fail counts. Year 1: P=80, F=20. Year 2: P=90, F=30. Ratio of total passed to total failed?',
        question: 'A grouped bar graph shows student pass/fail counts for two consecutive years. \nYear 1: Passed = 80, Failed = 20\nYear 2: Passed = 90, Failed = 30\nWhat is the exact ratio of the total number of passed students to the total number of failed students across both years combined?',
        options: [
          'A) 17 : 5',
          'B) 16 : 5',
          'C) 3 : 1',
          'D) 4 : 1'
        ],
        correctAnswer: 'A',
        explanation: 'Total passed = 80 + 90 = 170. Total failed = 20 + 30 = 50. Ratio of total passed to total failed = 170 : 50. Dividing both by 10 yields 17 : 5.'
      },
      {
        id: 'apt-bar-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Missing Bar Deduction from Average] A bar graph has 5 bars. Average is 60. First four bars are 40, 50, 70, 90. What is the value of the 5th bar?',
        question: 'A bar graph displays the monthly expenses for 5 months. The exact overall average expense for the 5 months is explicitly stated as $60. However, the top of the 5th bar is ripped off. The values of the first four visible bars are $40, $50, $70, and $90. What must be the exact value of the 5th bar?',
        options: [
          'A) $40',
          'B) $50',
          'C) $60',
          'D) $70'
        ],
        correctAnswer: 'B',
        explanation: 'Total sum required for 5 months with an average of 60 = 5 × 60 = 300. The sum of the first four bars = 40 + 50 + 70 + 90 = 250. The value of the 5th bar must perfectly make up the difference: 300 - 250 = 50. Thus, the 5th bar is $50.'
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

async function seedAptitudeBatch11() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 11 (TOPICS 31 TO 33) ===\n');

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

    // 2. Upsert Topics 31 to 33
    for (const item of aptitudeBatch11) {
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
      await client.query(`UPDATE tracks SET total_topics = 33, estimated_hours = 66 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 33, estimated_hours = 66');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 33 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 33');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 11 (Topics 31 to 33) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch11();
