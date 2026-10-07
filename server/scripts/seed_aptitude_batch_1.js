const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch1 = [
  // ===========================================================================
  // TOPIC 1: FRACTIONS AND DECIMALS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 1,
    slug: 'aptitude-quant-fractions-and-decimals',
    title: 'Fractions and Decimals',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 46,
    video_url: 'https://www.youtube.com/watch?v=tnc9ojITRg4',
    video_title: 'Fractions and Decimals - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master pure and mixed recurring decimals, continued ladder fractions, componendo-dividendo shortcuts, cross-multiplication fraction comparison, and telescoping fractional series.',
    summary_markdown: `### 📌 1. Converting Recurring (Repeating) Decimals to Vulgar Fractions
* **Pure Recurring Decimal (\`0.(abc)...\` where all digits after the decimal repeat):**
  * Write the repeating block in the numerator and as many \`9\`s in the denominator as there are repeating digits:
  * \`0.(25) = 25 / 99\`, \`0.(15268) = 15268 / 99999\`.
* **Mixed Recurring Decimal (\`0.ab(cd)...\` where \`ab\` does not repeat and \`cd\` repeats under a bar):**
  * **Numerator:** \`(Entire number formed by all digits after decimal) - (Number formed by non-repeating digits)\` = \`abcd - ab\`.
  * **Denominator:** As many \`9\`s as repeating digits, followed by as many \`0\`s as non-repeating digits = \`9900\`.
  * **Example:** \`0.35(23) = (3523 - 35) / 9900 = 3488 / 9900 = 872 / 2475\`.
* **Addition/Subtraction of Mixed Numbers:** Split into Integer part + Fractional part: \`17.4(99) = 17 + (499 - 4)/990 = 17 + 495/990 = 17.5\`.

### 💡 2. Fast Fraction Comparison Shortcuts
* **Rule 1 — Constant Gap Between Denominator and Numerator (\`D - N = k\` in Proper Fractions where \`N < D\`):**
  * If every proper fraction has the exact same difference \`D - N = k\` (e.g., \`6/7, 7/8, 8/9, 9/10\` where \`D - N = 1\`), then **the fraction with the LARGEST numerator is the LARGEST fraction**, and the one with the smallest numerator is the smallest!
  * *(Note: For improper fractions where \`N > D\` and \`N - D = k\`, the reverse holds: larger numerator = smaller fraction).*
* **Rule 2 — Cross-Multiplication Tournament:**
  * To compare \`a/b\` and \`c/d\`, compare \`a * d\` vs. \`b * c\`. Whichever side has the larger product corresponds to the larger fraction.

### 💡 3. Componendo and Dividendo & Telescoping Fractional Series
* **Componendo and Dividendo:** If \`n / m = a / b\`, then:
  * \`(n + m) / (n - m) = (a + b) / (a - b)\`
  * \`(n - m) / (n + m) = (a - b) / (a + b)\`
* **Telescoping Partial Fractions:**
  * Whenever a denominator is a product of two terms with a constant difference \`d\` (i.e., \`1 / [n(n + d)]\`), split it as:
    \`1 / [n(n + d)] = (1 / d) * [ (1 / n) - (1 / (n + d)) ]\`
  * All middle terms cancel out, leaving only the first and last boundary terms!`,
    questions: [
      {
        id: 'apt-frac-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: If 0.35(23) + 0.4(6) - 0.(25) is expressed as a fraction p/q in lowest terms, find (q - p).',
        question: 'If 0.35(23) [where 23 repeats indefinitely] + 0.4(6) [where 6 repeats indefinitely] - 0.(25) [where 25 repeats indefinitely] is expressed as a vulgar fraction p/q in its lowest terms (where p and q are coprime positive integers), what is the value of (q - p)?',
        options: [
          'A) 983',
          'B) 1073',
          'C) 1127',
          'D) 1243'
        ],
        correctAnswer: 'B',
        explanation: 'Convert each recurring decimal to a common denominator of 9900: 1) 0.35(23) = (3523 - 35)/9900 = 3488/9900. 2) 0.4(6) = (46 - 4)/90 = 42/90 = 4620/9900. 3) 0.(25) = 25/99 = 2500/9900. Combining them: (3488 + 4620 - 2500)/9900 = 5608/9900. Dividing numerator and denominator by their GCD = 4 gives p/q = 1402/2475 (coprime since 1402 = 2 × 701 and 701 is prime). Thus, q - p = 2475 - 1402 = 1073.'
      },
      {
        id: 'apt-frac-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: Evaluate the recurring decimal expression: [ 0.(15268) ÷ 0.(45804) ] × [ 0.2(7) ÷ 0.(18) ].',
        question: 'Evaluate the exact value of the recurring decimal expression:\n[ 0.(15268) ÷ 0.(45804) ] × [ 0.2(7) ÷ 0.(18) ]\n(where digits inside parentheses repeat indefinitely):',
        options: [
          'A) 55 / 108',
          'B) 5 / 9',
          'C) 11 / 18',
          'D) 35 / 72'
        ],
        correctAnswer: 'A',
        explanation: '1) First bracket: 0.(15268) / 0.(45804) = (15268/99999) / (45804/99999) = 15268 / 45804. Since 15268 × 3 = 45804, the first bracket simplifies to 1/3. 2) Second bracket: 0.2(7) = (27 - 2)/90 = 25/90 = 5/18, and 0.(18) = 18/99 = 2/11. Dividing them gives (5/18) ÷ (2/11) = (5/18) × (11/2) = 55/36. 3) Multiply both brackets: (1/3) × (55/36) = 55/108.'
      },
      {
        id: 'apt-frac-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: Given 1.55m = 0.025n, find the exact value of (n - 3m) / (n + 3m) using Componendo and Dividendo.',
        question: 'If m and n are positive real numbers satisfying 1.55m = 0.025n, what is the exact fractional value of (n - 3m) / (n + 3m)?',
        options: [
          'A) 29 / 32',
          'B) 59 / 65',
          'C) 61 / 65',
          'D) 57 / 63'
        ],
        correctAnswer: 'B',
        explanation: 'From 1.55m = 0.025n, write as fractions: (155/100)m = (25/1000)n => 1550m = 25n => n / m = 1550 / 25 = 62 / 1. Divide both sides by 3 to form n / (3m): n / (3m) = 62 / 3. Applying Componendo and Dividendo gives (n - 3m) / (n + 3m) = (62 - 3) / (62 + 3) = 59 / 65.'
      },
      {
        id: 'apt-frac-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: Solve for x in the continued ladder fraction: 1 / (2 + 1 / (3 + 1 / (4 + 1/x))) = 94 / 217.',
        question: 'If the continued ladder fraction\n1 / ( 2 + 1 / ( 3 + 1 / ( 4 + 1/x ) ) ) = 94 / 217,\nwhat is the exact value of x?',
        options: [
          'A) 5',
          'B) 6',
          'C) 7',
          'D) 8'
        ],
        correctAnswer: 'C',
        explanation: 'Invert both sides step-by-step from top to bottom: 1) Inverting the main fraction gives: 2 + 1 / (3 + 1 / (4 + 1/x)) = 217 / 94 = 2 + 29/94. 2) Subtract 2 from both sides and invert again: 3 + 1 / (4 + 1/x) = 94 / 29 = 3 + 7/29. 3) Subtract 3 from both sides and invert a third time: 4 + 1/x = 29 / 7 = 4 + 1/7. Therefore, 1/x = 1/7 => x = 7.'
      },
      {
        id: 'apt-frac-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: Evaluate the telescoping series: S = 1/(1×4) + 1/(4×7) + 1/(7×10) + ... + 1/(97×100).',
        question: 'Find the exact value of the 33-term fractional series:\nS = 1/(1×4) + 1/(4×7) + 1/(7×10) + 1/(10×13) + ... + 1/(97×100)',
        options: [
          'A) 33 / 100',
          'B) 99 / 100',
          'C) 11 / 100',
          'D) 97 / 300'
        ],
        correctAnswer: 'A',
        explanation: 'Each denominator is of the form n(n + 3) with constant difference d = 3. Using the partial fraction decomposition 1/[n(n + 3)] = (1/3) × [1/n - 1/(n + 3)]: S = (1/3) × [ (1/1 - 1/4) + (1/4 - 1/7) + (1/7 - 1/10) + ... + (1/97 - 1/100) ]. All intermediate terms telescope and cancel out, leaving S = (1/3) × (1 - 1/100) = (1/3) × (99/100) = 33/100.'
      },
      {
        id: 'apt-frac-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: Find the second largest fraction among F1 = 17/21, F2 = 25/29, F3 = 13/17, F4 = 33/37, and F5 = 29/35.',
        question: 'Consider the five fractions: F1 = 17/21, F2 = 25/29, F3 = 13/17, F4 = 33/37, and F5 = 29/35. Which of the following is the second largest among all five fractions?',
        options: [
          'A) 17 / 21',
          'B) 25 / 29',
          'C) 29 / 35',
          'D) 33 / 37'
        ],
        correctAnswer: 'B',
        explanation: 'First compare F1, F2, F3, and F4: all four are proper fractions (N < D) with a constant gap D - N = 4 (21-17 = 4, 29-25 = 4, 17-13 = 4, 37-33 = 4). By the Constant Gap Rule, larger numerator = larger fraction, so F3 (13/17) < F1 (17/21) < F2 (25/29) < F4 (33/37). Now compare F5 = 29/35 with F2 = 25/29 using cross-multiplication: 25 × 35 = 875 vs. 29 × 29 = 841. Since 875 > 841, F2 (25/29) > F5 (29/35). Therefore, F4 (33/37) is the largest and F2 (25/29) is the second largest.'
      },
      {
        id: 'apt-frac-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: If a fraction\'s numerator is increased by 250% and its denominator is decreased by 40%, the resulting fraction is 7/2. Find (a + b).',
        question: 'If the numerator of a positive fraction is increased by 250% and its denominator is decreased by 40%, the resulting fraction is 7/2. If the original fraction in lowest terms is a/b, what is the value of (a + b)?',
        options: [
          'A) 7',
          'B) 8',
          'C) 11',
          'D) 13'
        ],
        correctAnswer: 'B',
        explanation: 'Let the original fraction be a/b. 1) Increasing the numerator by 250% makes the new numerator a + 2.5a = 3.5a = (7/2)a. 2) Decreasing the denominator by 40% makes the new denominator b - 0.4b = 0.6b = (3/5)b. 3) Therefore, [(7/2)a] / [(3/5)b] = 7/2 => (35/6) × (a/b) = 7/2 => a/b = (7/2) × (6/35) = 3/5. Since 3 and 5 are coprime, a = 3 and b = 5, so a + b = 8.'
      },
      {
        id: 'apt-frac-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: Find the exact value of 17.4(99) + 17.85 + 17.(333) - 12.1(6) expressed as a mixed recurring decimal.',
        question: 'Evaluate the exact value of:\n17.4(99) + 17.85 + 17.(333) - 12.1(6)\n(where digits in parentheses repeat indefinitely):',
        options: [
          'A) 40.51(6)',
          'B) 40.5(16)',
          'C) 40.68(3)',
          'D) 40.51(3)'
        ],
        correctAnswer: 'A',
        explanation: 'Convert each term: 1) 17.4(99) = 17 + (499 - 4)/990 = 17 + 495/990 = 17.5. 2) 17.85 = 17.85. 3) 17.(333) = 17 + 333/999 = 17 + 1/3. 4) 12.1(6) = 12 + (16 - 1)/90 = 12 + 15/90 = 12 + 1/6. Combine the decimal and fractional parts: (17.5 + 17.85 + 17 - 12) + (1/3 - 1/6) = 40.35 + 1/6 = 40.35 + 0.1666... = 40.51666... = 40.51(6).'
      },
      {
        id: 'apt-frac-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q9: In three positive fractions A > B > C, A / C = 9/4 exceeds B by 11/12. If A + B + C = 3 1/2, find (A - C).',
        question: 'In three positive fractions A > B > C, when the largest fraction A is divided by the smallest fraction C, the result is 9/4, which is greater than the middle fraction B by 11/12. If the sum of all three fractions (A + B + C) is 3 1/2, what is the exact difference (A - C) between the largest and smallest fractions?',
        options: [
          'A) 15 / 26',
          'B) 5 / 6',
          'C) 3 / 4',
          'D) 7 / 12'
        ],
        correctAnswer: 'B',
        explanation: '1) Given A / C = 9/4 => A = (9/4)C. 2) The result 9/4 is greater than B by 11/12 => B = 9/4 - 11/12 = (27 - 11)/12 = 16/12 = 4/3. 3) Substitute A and B into A + B + C = 7/2: (9/4)C + 4/3 + C = 7/2 => (13/4)C = 7/2 - 4/3 = 13/6 => C = (13/6) × (4/13) = 2/3. 4) Then A = (9/4) × (2/3) = 3/2, and A - C = 3/2 - 2/3 = 5/6.'
      },
      {
        id: 'apt-frac-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: Simplify the compound fractional expression: 8 - 8 × [ (2 1/5 - 1 2/7) ÷ (2 - 1 / (6 - 1/6)) ].',
        question: 'Evaluate the exact value of the compound fractional expression:\n8 - 8 × [ (2 1/5 - 1 2/7) ÷ ( 2 - 1 / (6 - 1/6) ) ]',
        options: [
          'A) 2',
          'B) 4',
          'C) 6',
          'D) 0'
        ],
        correctAnswer: 'B',
        explanation: '1) Numerator inside the bracket: 2 1/5 - 1 2/7 = 11/5 - 9/7 = (77 - 45)/35 = 32/35. 2) Denominator inside the bracket: first compute 6 - 1/6 = 35/6. Taking its reciprocal gives 1 / (35/6) = 6/35. Then 2 - 6/35 = (70 - 6)/35 = 64/35. 3) Divide numerator by denominator: (32/35) ÷ (64/35) = 32/64 = 1/2. 4) Substitute back into the main expression: 8 - 8 × (1/2) = 8 - 4 = 4.'
      },
      {
        id: 'apt-frac-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: If 1 / 4.659 = 0.214638, what is the value of [ 1 / 0.0004659 ] - [ 1 / 465.9 ]?',
        question: 'Given that 1 / 4.659 = 0.214638, what is the exact value of:\n( 1 / 0.0004659 ) - ( 1 / 465.9 )?',
        options: [
          'A) 2146.37785362',
          'B) 2146.165362',
          'C) 214.63585362',
          'D) 21463.79785362'
        ],
        correctAnswer: 'A',
        explanation: '1) Write 0.0004659 in terms of 4.659: 0.0004659 = 4.659 × 10^-4, so 1 / 0.0004659 = (1 / 4.659) × 10^4 = 0.214638 × 10,000 = 2146.38. 2) Write 465.9 in terms of 4.659: 465.9 = 4.659 × 10^2, so 1 / 465.9 = (1 / 4.659) × 10^-2 = 0.00214638. 3) Subtract: 2146.38000000 - 0.00214638 = 2146.37785362.'
      },
      {
        id: 'apt-frac-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: Find the sum of the mixed fraction series: 8 1/6 + 15 1/12 + 24 1/20 + 35 1/30 + 48 1/42 + 63 1/56.',
        question: 'Evaluate the exact sum of the 6-term mixed fraction series:\n8 1/6 + 15 1/12 + 24 1/20 + 35 1/30 + 48 1/42 + 63 1/56',
        options: [
          'A) 193 3/8',
          'B) 193 5/16',
          'C) 194 1/8',
          'D) 193 7/24'
        ],
        correctAnswer: 'A',
        explanation: 'Separate the integer parts and the fractional parts: 1) Sum of integer parts: 8 + 15 + 24 + 35 + 48 + 63 = 193. 2) Sum of fractional parts: 1/6 + 1/12 + 1/20 + 1/30 + 1/42 + 1/56 = 1/(2×3) + 1/(3×4) + 1/(4×5) + 1/(5×6) + 1/(6×7) + 1/(7×8). Using telescoping partial fractions (1/n - 1/(n+1)): = (1/2 - 1/3) + (1/3 - 1/4) + ... + (1/7 - 1/8) = 1/2 - 1/8 = 3/8. Combining both gives 193 3/8.'
      },
      {
        id: 'apt-frac-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: Simplify the decimal product ratio: (2.4 × 0.72 × 4.5 × 0.0125) ÷ (0.18 × 0.06 × 0.09 × 0.005).',
        question: 'Evaluate the exact value of the decimal expression:\n(2.4 × 0.72 × 4.5 × 0.0125) ÷ (0.18 × 0.06 × 0.09 × 0.005)',
        options: [
          'A) 2,000',
          'B) 20,000',
          'C) 24,000',
          'D) 18,000'
        ],
        correctAnswer: 'B',
        explanation: 'Count the total decimal places in the numerator vs. denominator: 1) Numerator decimal places: 1 (in 2.4) + 2 (in 0.72) + 1 (in 4.5) + 4 (in 0.0125) = 8 decimal places. 2) Denominator decimal places: 2 (in 0.18) + 2 (in 0.06) + 2 (in 0.09) + 3 (in 0.005) = 9 decimal places. 3) Shifting 9 decimal places in both adds one extra factor of 10 in the numerator: (24 × 72 × 45 × 125 × 10) / (18 × 6 × 9 × 5). Simplify integers: 72 / 18 = 4; 24 / 6 = 4; 45 / 9 = 5; 125 / 5 = 25. Product = 4 × 4 × 5 × 25 × 10 = 20,000.'
      },
      {
        id: 'apt-frac-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: When X1 = (0.3)^2, X2 = 0.0(3), X3 = 0.3(03), X4 = (0.2)^3, and X5 = 0.03 are arranged in ascending order, which is in the 3rd position?',
        question: 'Consider the five values:\n• X1 = (0.3)^2\n• X2 = 0.0(3) [where 3 repeats]\n• X3 = 0.3(03) [where 03 repeats]\n• X4 = (0.2)^3\n• X5 = 0.03\nWhen arranged in strictly ascending order (smallest to largest), which value is in the 3rd (middle) position?',
        options: [
          'A) X1 = (0.3)^2',
          'B) X2 = 0.0(3)',
          'C) X5 = 0.03',
          'D) X4 = (0.2)^3'
        ],
        correctAnswer: 'B',
        explanation: 'Write each value to 4 decimal places: 1) X4 = (0.2)^3 = 0.0080 (Smallest, 1st). 2) X5 = 0.03 = 0.0300 (2nd). 3) X2 = 0.0(3) = 0.0333... (3rd — Middle position!). 4) X1 = (0.3)^2 = 0.0900 (4th). 5) X3 = 0.3(03) = 0.3030... (Largest, 5th). Thus, X2 = 0.0(3) is in the 3rd position.'
      },
      {
        id: 'apt-frac-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: Express (3/7 of 5/8 of 4/9 of ₹60.48) as a vulgar fraction of (1 3/5 of 2 1/4 of ₹48).',
        question: 'Express (3/7 of 5/8 of 4/9 of ₹60.48) as a vulgar fraction in lowest terms of (1 3/5 of 2 1/4 of ₹48):',
        options: [
          'A) 1 / 24',
          'B) 1 / 18',
          'C) 5 / 72',
          'D) 7 / 144'
        ],
        correctAnswer: 'A',
        explanation: '1) Evaluate the first quantity: (3/7) × (5/8) × (4/9) × 60.48 = (5 / 42) × 60.48 = 5 × 1.44 = 7.20. 2) Evaluate the second quantity: (8/5) × (9/4) × 48 = (18/5) × 48 = 172.80. 3) Required fraction m = 7.20 / 172.80 = 72 / 1728 = 1 / 24.'
      },
      {
        id: 'apt-frac-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: Find the number of ordered pairs of positive integers (x, y) such that 1/x + 1/y = 1/12 with x <= y.',
        question: 'How many ordered pairs of positive integers (x, y) with x ≤ y satisfy the fractional equation:\n1/x + 1/y = 1/12?',
        options: [
          'A) 6',
          'B) 7',
          'C) 8',
          'D) 15'
        ],
        correctAnswer: 'C',
        explanation: 'Rewrite 1/x + 1/y = 1/12 as: 12(x + y) = xy => xy - 12x - 12y = 0. Add 144 (12^2) to both sides (Simon\'s Favorite Factoring Trick): xy - 12x - 12y + 144 = 144 => (x - 12)(y - 12) = 144 = 2^4 × 3^2. The total number of positive divisors of 144 is (4 + 1)(2 + 1) = 15. Since x ≤ y, (x - 12) can be any divisor of 144 less than or equal to √144 = 12: there are (15 + 1) / 2 = 8 such pairs.'
      },
      {
        id: 'apt-frac-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: When a fraction\'s numerator is increased by 4, the fraction increases by 2/3. If its denominator is 4 more than twice its numerator, find the fraction.',
        question: 'When the numerator of a positive fraction is increased by 4 (keeping the denominator unchanged), the value of the fraction increases by 2/3. If the denominator of the original fraction is 4 more than twice its numerator, what is the original fraction?',
        options: [
          'A) 1 / 6',
          'B) 3 / 10',
          'C) 5 / 14',
          'D) 2 / 8'
        ],
        correctAnswer: 'A',
        explanation: 'Let the original fraction be x / y. 1) Increasing the numerator by 4 gives (x + 4)/y = x/y + 4/y. Since the fraction increases by 2/3, we immediately have 4/y = 2/3 => 2y = 12 => y = 6. 2) Given that the denominator y is 4 more than twice the numerator (y = 2x + 4): 6 = 2x + 4 => 2x = 2 => x = 1. Thus, the original fraction is 1/6.'
      },
      {
        id: 'apt-frac-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: If N = 1/(1×2×3) + 1/(2×3×4) + 1/(3×4×5) + ... + 1/(10×11×12), find the exact value of N.',
        question: 'Evaluate the exact sum of the 3-factor denominator series:\nN = 1/(1×2×3) + 1/(2×3×4) + 1/(3×4×5) + ... + 1/(10×11×12)',
        options: [
          'A) 65 / 264',
          'B) 65 / 132',
          'C) 131 / 264',
          'D) 11 / 48'
        ],
        correctAnswer: 'A',
        explanation: 'Use the 3-factor partial fraction identity: 1 / [k(k+1)(k+2)] = (1/2) × [ 1/(k(k+1)) - 1/((k+1)(k+2)) ]. Summing from k = 1 to k = 10 telescopes all middle terms: N = (1/2) × [ (1/(1×2) - 1/(2×3)) + (1/(2×3) - 1/(3×4)) + ... + (1/(10×11) - 1/(11×12)) ] = (1/2) × [ 1/2 - 1/132 ] = (1/2) × (65/132) = 65 / 264.'
      },
      {
        id: 'apt-frac-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: A student was asked to multiply a number by 11/18. By mistake, he divided it by 11/18 and exceeded the correct answer by 203/12. Find the number.',
        question: 'A student was asked to multiply a positive number by 11/18. By mistake, he divided the number by 11/18 and obtained a result that exceeded the correct answer by 203/12. What was the original number?',
        options: [
          'A) 11 / 2',
          'B) 33 / 4',
          'C) 99 / 6',
          'D) 33 / 2'
        ],
        correctAnswer: 'D',
        explanation: 'Let the original number be x. Correct operation = (11/18)x; Mistaken operation = x ÷ (11/18) = (18/11)x. Difference: (18/11)x - (11/18)x = 203/12 => [ (18^2 - 11^2) / (11 × 18) ] × x = 203/12. Using a^2 - b^2 = (18 - 11)(18 + 11) = 7 × 29 = 203: (203 / 198) × x = 203 / 12. Cancel 203 on both sides: x = 198 / 12 = 33 / 2.'
      },
      {
        id: 'apt-frac-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: What is the 2026th digit after the decimal point in the decimal expansion of the fraction 71 / 333?',
        question: 'What is the 2026th digit after the decimal point in the decimal representation of the fraction 71 / 333?',
        options: [
          'A) 1',
          'B) 2',
          'C) 3',
          'D) 7'
        ],
        correctAnswer: 'B',
        explanation: 'Multiply numerator and denominator of 71 / 333 by 3 to get a denominator of 999: 71 / 333 = (71 × 3) / (333 × 3) = 213 / 999 = 0.(213)213213...! The repeating block "213" has period 3 (1st digit = 2, 2nd digit = 1, 3rd digit = 3). Since 2025 is a multiple of 3, 2026 ≡ 1 (mod 3). Therefore, the 2026th digit is the 1st digit of the repeating block, which is 2.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 2: SIMPLIFICATION (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 2,
    slug: 'aptitude-quant-simplification',
    title: 'Simplification',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 51,
    video_url: 'https://www.youtube.com/watch?v=ZuMJFleXmiw',
    video_title: 'Simplification - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Solve complex algebraic and numerical simplification problems using strict VBODMAS precedence, cubic identities, reciprocal powers, surd rationalization, and factorized series.',
    summary_markdown: `### 📌 1. Strict VBODMAS Precedence Hierarchy
Always simplify expressions in the exact **VBODMAS** order:
1. **\`V\` — Vinculum (Bar Bracket \`—\`):** Evaluate the expression directly underneath the horizontal bar first (ignoring the sign immediately to the left of the bar until the bar itself is evaluated! E.g., in \`36 - (8 - 12)_bar\`, first compute \`8 - 12 = -4\`, then \`36 - (-4) = 40\`).
2. **\`B\` — Brackets:** Innermost to outermost: **Circular \`( )\`** $\rightarrow$ **Curly \`{ }\`** $\rightarrow$ **Square \`[ ]\`**.
3. **\`O\` — Of:** Means multiplication (\`2/3 of 63 = 42\`), but has **higher priority than Division \`÷\` and Multiplication \`×\`**! (e.g., \`12 ÷ 3 of 2 = 12 ÷ 6 = 2\`, NOT \`(12 ÷ 3) × 2 = 8\`!).
4. **\`D\` & \`M\` — Division & Multiplication:** Left to right.
5. **\`A\` & \`S\` — Addition & Subtraction:** Left to right.

### 💡 2. High-Yield Algebraic & Cubic Identities for 10-Second Simplification
* **Difference & Sum of Cubes:**
  * \`a^3 - b^3 = (a - b)(a^2 + ab + b^2)\`  $\implies \frac{a^3 - b^3}{a^2 + ab + b^2} = a - b$
  * \`a^3 + b^3 = (a + b)(a^2 - ab + b^2)\`  $\implies \frac{a^3 + b^3}{a^2 - ab + b^2} = a + b$
* **Legendre's Identities:**
  * \`(a + b)^2 + (a - b)^2 = 2(a^2 + b^2)\`
  * \`(a + b)^2 - (a - b)^2 = 4ab\`
* **Euler's Three-Variable Cubic Identity:**
  * \`a^3 + b^3 + c^3 - 3abc = (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ca)\`
  * **Golden Shortcut:** Whenever **\`a + b + c = 0\`**, then **\`a^3 + b^3 + c^3 - 3abc = 0\`** (i.e., \`a^3 + b^3 + c^3 = 3abc\`)!
* **Reciprocal Power Ladder (Given \`x + 1/x = k\`):**
  * \`x^2 + 1/x^2 = k^2 - 2\`
  * \`x^3 + 1/x^3 = k^3 - 3k\`
  * \`(x - 1/x)^2 = (x + 1/x)^2 - 4 = k^2 - 4\`

### 💡 3. Rationalization & Symmetric System Tricks
* **Telescoping Surd Series:** Rationalize \`1 / (√n + √(n+1))\` by multiplying top and bottom by \`(√(n+1) - √n)\` to get \`√(n+1) - √n\`. Summing from \`n = 1\` to \`N\` collapses to **\`√(N+1) - 1\`**.
* **Symmetric Equations (\`a(a+b+c) = P\`, \`b(a+b+c) = Q\`, \`c(a+b+c) = R\`):** Add all three equations first to get **\`(a + b + c)^2 = P + Q + R\`**, take the square root to find \`a + b + c = √(P+Q+R)\`, and divide to get each variable immediately!`,
    questions: [
      {
        id: 'apt-simp-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [VBODMAS + Vinculum + "Of" Priority] Evaluate: 42 - [ 19 - { 16 - (12 - (8 - [5 - 3]_bar)) } ] ÷ (1/2 of 6).',
        question: 'Evaluate using strict VBODMAS rules (where the vinculum bar is over 5 - 3):\n42 - [ 19 - { 16 - ( 12 - (8 - [5 - 3]_bar) ) } ] ÷ ( 1/2 of 6 )',
        options: [
          'A) 38',
          'B) 39',
          'C) 36',
          'D) 40'
        ],
        correctAnswer: 'B',
        explanation: 'Step 1 (Vinculum bar first): [5 - 3]_bar = 2. Step 2 (Innermost parenthesis): 8 - 2 = 6, then 12 - 6 = 6. Step 3 (Curly braces): 16 - 6 = 10. Step 4 (Square brackets): 19 - 10 = 9. Step 5 ("Of" operation before division): 1/2 of 6 = 3. Step 6 (Division before subtraction): 42 - (9 ÷ 3) = 42 - 3 = 39.'
      },
      {
        id: 'apt-simp-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Reciprocal Power Ladder] If m + 1/m = 5 (with m > 1), find the exact value of (m^4 - 1/m^4).',
        question: 'If m > 1 and m + 1/m = 5, what is the exact value of (m^4 - 1/m^4)?',
        options: [
          'A) 115√21',
          'B) 527',
          'C) 105√21',
          'D) 23√21'
        ],
        correctAnswer: 'A',
        explanation: 'Factor m^4 - 1/m^4 = (m^2 + 1/m^2)(m + 1/m)(m - 1/m). 1) Given m + 1/m = 5. 2) m^2 + 1/m^2 = 5^2 - 2 = 23. 3) Since m > 1, m - 1/m = √[(m + 1/m)^2 - 4] = √(25 - 4) = √21. 4) Multiply all three factors: (m^4 - 1/m^4) = 23 × 5 × √21 = 115√21.'
      },
      {
        id: 'apt-simp-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Algebraic Substitution] If a + b^2/a = 4, find the exact value of (a^2 + 3a + b^2) / (a^3 - 4a^2).',
        question: 'If a and b are non-zero real numbers such that a + (b^2 / a) = 4, what is the value of:\n(a^2 + 3a + b^2) / (a^3 - 4a^2)?',
        options: [
          'A) -7 / b^2',
          'B) 7 / b^2',
          'C) -4 / b^2',
          'D) -7 / a^2'
        ],
        correctAnswer: 'A',
        explanation: 'From a + b^2/a = 4, multiply both sides by a: a^2 + b^2 = 4a. This gives two key substitutions: (1) a^2 + b^2 = 4a, and (2) a^2 - 4a = -b^2. Substitute into the target fraction: Numerator = (a^2 + b^2) + 3a = 4a + 3a = 7a. Denominator = a(a^2 - 4a) = a(-b^2) = -ab^2. Dividing numerator by denominator: 7a / (-ab^2) = -7 / b^2.'
      },
      {
        id: 'apt-simp-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Euler\'s Cubic Identity Twist] Evaluate (5.42)^3 - (3.18)^3 - (2.24)^3 - 3 × 5.42 × 3.18 × 2.24.',
        question: 'Evaluate the exact value of:\n(5.42)^3 - (3.18)^3 - (2.24)^3 - 3 × 5.42 × 3.18 × 2.24',
        options: [
          'A) 0',
          'B) 1',
          'C) 115.82',
          'D) -77.21'
        ],
        correctAnswer: 'A',
        explanation: 'Let x = 5.42, y = -3.18, and z = -2.24. Then the given expression is x^3 + y^3 + z^3 - 3xyz. Check the sum x + y + z: 5.42 - 3.18 - 2.24 = 5.42 - 5.42 = 0. Since x + y + z = 0, Euler\'s identity x^3 + y^3 + z^3 - 3xyz = (x + y + z)(x^2 + y^2 + z^2 - xy - yz - zx) immediately evaluates to 0.'
      },
      {
        id: 'apt-simp-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Symmetric System Addition Trick] For positive reals a, b, c, if a(a + b + c) = 126, b(a + b + c) = 168, and c(a + b + c) = 147, find (2c - a).',
        question: 'If a, b, and c are positive real numbers satisfying:\n• a(a + b + c) = 126\n• b(a + b + c) = 168\n• c(a + b + c) = 147\nWhat is the exact value of (2c - a)?',
        options: [
          'A) 6',
          'B) 7',
          'C) 8',
          'D) 9'
        ],
        correctAnswer: 'C',
        explanation: 'Add all three equations together and factor out (a + b + c): (a + b + c)^2 = 126 + 168 + 147 = 441. Since a, b, c > 0, taking the square root gives a + b + c = 21. Now divide each equation by 21: a = 126 / 21 = 6; b = 168 / 21 = 8; c = 147 / 21 = 7. Therefore, 2c - a = 2(7) - 6 = 8.'
      },
      {
        id: 'apt-simp-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Telescoping Surd Rationalization] Find the value of: 1/(√9 + √10) + 1/(√10 + √11) + 1/(√11 + √12) + ... + 1/(√120 + √121).',
        question: 'Evaluate the exact sum of the 112-term irrational series:\n1/(√9 + √10) + 1/(√10 + √11) + 1/(√11 + √12) + ... + 1/(√120 + √121)',
        options: [
          'A) 7',
          'B) 8',
          'C) 9',
          'D) 10'
        ],
        correctAnswer: 'B',
        explanation: 'Rationalize each general term 1 / (√k + √(k+1)) by multiplying numerator and denominator by (√(k+1) - √k): since (k+1) - k = 1, each term simplifies to (√(k+1) - √k). Summing from k = 9 to k = 120: (√10 - √9) + (√11 - √10) + (√12 - √11) + ... + (√121 - √120). All middle roots cancel out, leaving √121 - √9 = 11 - 3 = 8.'
      },
      {
        id: 'apt-simp-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Telescoping Product of Difference of Squares] Evaluate: (1 - 1/2^2)(1 - 1/3^2)(1 - 1/4^2)...(1 - 1/60^2).',
        question: 'Find the exact value of the 59-factor product:\n(1 - 1/2^2)(1 - 1/3^2)(1 - 1/4^2)(1 - 1/5^2) ... (1 - 1/60^2)',
        options: [
          'A) 61 / 120',
          'B) 59 / 120',
          'C) 61 / 60',
          'D) 31 / 60'
        ],
        correctAnswer: 'A',
        explanation: 'Factor each term using 1 - 1/k^2 = (k^2 - 1)/k^2 = [(k - 1)/k] × [(k + 1)/k]: Product = [ (1/2 × 3/2) × (2/3 × 4/3) × (3/4 × 5/4) × ... × (59/60 × 61/60) ]. Every adjacent pair (3/2 × 2/3 = 1), (4/3 × 3/4 = 1), ..., (60/59 × 59/60 = 1) cancels to 1. Only the first factor (1/2) and the last factor (61/60) remain: (1/2) × (61/60) = 61 / 120.'
      },
      {
        id: 'apt-simp-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Extracting Square Root of a Surd] If √(43 - 12√7) = a - b√7 where a and b are positive integers, find (a + b).',
        question: 'If √(43 - 12√7) = a - b√7 (where a and b are positive integers and a - b√7 > 0), what is the value of (a + b)?',
        options: [
          'A) 6',
          'B) 7',
          'C) 8',
          'D) 9'
        ],
        correctAnswer: 'B',
        explanation: 'Express 43 - 12√7 as a perfect square (x - y)^2 = x^2 + y^2 - 2xy. Match the radical term: 2xy = 12√7 => xy = 6√7. Choosing x = 6 and y = √7 gives x^2 + y^2 = 6^2 + (√7)^2 = 36 + 7 = 43. Since 6 > √7, the positive square root is 6 - 1√7 = a - b√7, giving a = 6 and b = 1. Thus, a + b = 6 + 1 = 7.'
      },
      {
        id: 'apt-simp-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Factoring Exponential Series for Divisibility] The sum S = 5^71 + 5^72 + 5^73 + 5^74 + 5^75 is always completely divisible by which of the following numbers?',
        question: 'The exponential sum S = 5^71 + 5^72 + 5^73 + 5^74 + 5^75 is completely divisible by which of the following numbers?',
        options: [
          'A) 67',
          'B) 71',
          'C) 73',
          'D) 79'
        ],
        correctAnswer: 'B',
        explanation: 'Factor out the smallest power 5^71 from all five terms: S = 5^71 × (1 + 5^1 + 5^2 + 5^3 + 5^4) = 5^71 × (1 + 5 + 25 + 125 + 625) = 5^71 × 781. Factoring 781 gives 11 × 71. Therefore, S = 5^71 × 11 × 71, which is always divisible by 71.'
      },
      {
        id: 'apt-simp-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Cubic Formula Disguise] Simplify: [ (0.87)^3 + (0.13)^3 ] / [ (0.87)^2 - 0.1131 + (0.13)^2 ] + [ (0.93)^3 - (0.33)^3 ] / [ (0.93)^2 + 0.3069 + (0.33)^2 ].',
        question: 'Evaluate the exact value of:\n[ (0.87)^3 + (0.13)^3 ] / [ (0.87)^2 - 0.1131 + (0.13)^2 ]  +  [ (0.93)^3 - (0.33)^3 ] / [ (0.93)^2 + 0.3069 + (0.33)^2 ]',
        options: [
          'A) 1.40',
          'B) 1.60',
          'C) 1.74',
          'D) 2.20'
        ],
        correctAnswer: 'B',
        explanation: 'Notice that 0.87 × 0.13 = 0.1131 and 0.93 × 0.33 = 0.3069. 1) The first fraction has the form (a^3 + b^3)/(a^2 - ab + b^2) = a + b = 0.87 + 0.13 = 1.00. 2) The second fraction has the form (c^3 - d^3)/(c^2 + cd + d^2) = c - d = 0.93 - 0.33 = 0.60. 3) Adding both results gives 1.00 + 0.60 = 1.60.'
      },
      {
        id: 'apt-simp-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Scaled Series of Squares] Given 1^2 + 2^2 + 3^2 + ... + 12^2 = 650, evaluate (4^2 + 8^2 + 12^2 + ... + 48^2) - (2^2 + 4^2 + 6^2 + ... + 24^2).',
        question: 'Given that 1^2 + 2^2 + 3^2 + ... + 12^2 = 650, what is the exact value of:\n(4^2 + 8^2 + 12^2 + ... + 48^2) - (2^2 + 4^2 + 6^2 + ... + 24^2)?',
        options: [
          'A) 7,800',
          'B) 8,450',
          'C) 9,100',
          'D) 10,400'
        ],
        correctAnswer: 'A',
        explanation: '1) Factor 4^2 out of the first series: 4^2 × (1^2 + 2^2 + ... + 12^2) = 16 × 650. 2) Factor 2^2 out of the second series: 2^2 × (1^2 + 2^2 + ... + 12^2) = 4 × 650. 3) Subtract: (16 - 4) × 650 = 12 × 650 = 7,800.'
      },
      {
        id: 'apt-simp-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Decimal Roots & Cube Roots] Evaluate: [ √0.000256 × ∛(27,000,000) ] ÷ [ ∛0.000512 × ∛0.064 ].',
        question: 'Evaluate the exact numerical value of:\n[ √0.000256 × ∛27,000,000 ] ÷ [ ∛0.000512 × ∛0.064 ]',
        options: [
          'A) 150',
          'B) 750',
          'C) 1,500',
          'D) 15,000'
        ],
        correctAnswer: 'A',
        explanation: 'Evaluate each root using the decimal-place rule: 1) √0.000256: √256 = 16, and 6 decimal places ÷ 2 = 3 decimal places -> 0.016. 2) ∛27,000,000: ∛27 = 3, and 6 zeros ÷ 3 = 2 zeros -> 300. 3) ∛0.000512: ∛512 = 8, and 6 decimal places ÷ 3 = 2 decimal places -> 0.08. 4) ∛0.064: ∛64 = 4, and 3 decimal places ÷ 3 = 1 decimal place -> 0.4. Combine: (0.016 × 300) / (0.08 × 0.4) = 4.8 / 0.032 = 4800 / 32 = 150.'
      },
      {
        id: 'apt-simp-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Nested Binary Operators] Define two custom operations: a ★ b = 3a - 2b + ab, and a ♦ b = a^2 - b^2. Find the value of (2 ★ 3) ♦ (4 ★ 1).',
        question: 'For any real numbers a and b, two custom binary operators are defined as:\n• a ★ b = 3a - 2b + ab\n• a ♦ b = a^2 - b^2\nWhat is the value of (2 ★ 3) ♦ (4 ★ 1)?',
        options: [
          'A) -160',
          'B) -180',
          'C) 160',
          'D) -144'
        ],
        correctAnswer: 'A',
        explanation: '1) Evaluate (2 ★ 3): here a = 2, b = 3 -> 3(2) - 2(3) + (2)(3) = 6 - 6 + 6 = 6. 2) Evaluate (4 ★ 1): here a = 4, b = 1 -> 3(4) - 2(1) + (4)(1) = 12 - 2 + 4 = 14. 3) Now evaluate 6 ♦ 14: 6^2 - 14^2 = 36 - 196 = -160.'
      },
      {
        id: 'apt-simp-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Zero-Sum Squares Identity] If (x - 4)^2 + (y + 3)^2 + (z - 5)^2 = 0, find the value of (x^3 + y^3 + z^3 - 3xyz) / (x^2 + y^2 + z^2 - xy - yz - zx).',
        question: 'If x, y, and z are real numbers satisfying:\n(x - 4)^2 + (y + 3)^2 + (z - 5)^2 = 0,\nwhat is the exact value of (x^3 + y^3 + z^3 - 3xyz) ÷ (x^2 + y^2 + z^2 - xy - yz - zx)?',
        options: [
          'A) 0',
          'B) 6',
          'C) 12',
          'D) 50'
        ],
        correctAnswer: 'B',
        explanation: '1) Since the square of any real number is non-negative, a sum of squares of real numbers equals 0 if and only if each individual term is 0: x = 4, y = -3, and z = 5. 2) By Euler\'s Cubic Identity, (x^3 + y^3 + z^3 - 3xyz) / (x^2 + y^2 + z^2 - xy - yz - zx) simplifies directly to (x + y + z). 3) Therefore, the value is x + y + z = 4 + (-3) + 5 = 6.'
      },
      {
        id: 'apt-simp-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Legendre\'s Identity Application] Simplify: [ (√7 + √5)^2 + (√7 - √5)^2 ] / [ (√7 + √5)^2 - (√7 - √5)^2 ] × √35.',
        question: 'Evaluate the exact value of:\n( [ (√7 + √5)^2 + (√7 - √5)^2 ] ÷ [ (√7 + √5)^2 - (√7 - √5)^2 ] ) × √35',
        options: [
          'A) 6',
          'B) 12',
          'C) 24',
          'D) 6√35'
        ],
        correctAnswer: 'A',
        explanation: 'Apply Legendre\'s Identities with a = √7 and b = √5: 1) Numerator: (a + b)^2 + (a - b)^2 = 2(a^2 + b^2) = 2(7 + 5) = 24. 2) Denominator: (a + b)^2 - (a - b)^2 = 4ab = 4 × √7 × √5 = 4√35. 3) Multiply the ratio by √35: (24 / 4√35) × √35 = 24 / 4 = 6.'
      },
      {
        id: 'apt-simp-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Quadratic Reciprocal Substitution] If x^2 - 7x + 1 = 0, find the exact value of (x^3 + 1/x^3) / (x^2 + 1/x^2).',
        question: 'If x is a real number satisfying x^2 - 7x + 1 = 0, what is the exact value of:\n(x^3 + 1/x^3) ÷ (x^2 + 1/x^2)?',
        options: [
          'A) 322 / 47',
          'B) 343 / 49',
          'C) 318 / 47',
          'D) 7'
        ],
        correctAnswer: 'A',
        explanation: 'Since x ≠ 0, divide the given equation x^2 - 7x + 1 = 0 through by x: x - 7 + 1/x = 0 => x + 1/x = 7. Using the Reciprocal Power Ladder formulas with k = 7: 1) x^2 + 1/x^2 = k^2 - 2 = 7^2 - 2 = 47. 2) x^3 + 1/x^3 = k^3 - 3k = 7^3 - 3(7) = 343 - 21 = 322. 3) Divide: (x^3 + 1/x^3) / (x^2 + 1/x^2) = 322 / 47.'
      },
      {
        id: 'apt-simp-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Symmetric Zero-Sum Cyclic Fractions] If a + b + c = 0 (for non-zero a, b, c), find the value of a^2/(bc) + b^2/(ca) + c^2/(ab).',
        question: 'If a, b, and c are non-zero real numbers such that a + b + c = 0, what is the value of:\n(a^2 / bc) + (b^2 / ca) + (c^2 / ab)?',
        options: [
          'A) 0',
          'B) 1',
          'C) 3',
          'D) -3'
        ],
        correctAnswer: 'C',
        explanation: 'Take the common denominator abc: (a^2 / bc) + (b^2 / ca) + (c^2 / ab) = (a^3 + b^3 + c^3) / (abc). Since a + b + c = 0, Euler\'s identity tells us that a^3 + b^3 + c^3 = 3abc. Substituting 3abc into the numerator gives (3abc) / (abc) = 3.'
      },
      {
        id: 'apt-simp-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Factorized Square Root Equation] Find the positive value of x that satisfies: (x / 28) × (x / 175) = 1.',
        question: 'For what positive value of x does the equation\n(x / 28) × (x / 175) = 1\nhold true?',
        options: [
          'A) 60',
          'B) 70',
          'C) 84',
          'D) 140'
        ],
        correctAnswer: 'B',
        explanation: 'Cross-multiplying gives x^2 = 28 × 175. Factorize into prime squares instead of multiplying large numbers: 28 = 2^2 × 7, and 175 = 5^2 × 7. Therefore, x^2 = 2^2 × 5^2 × 7^2. Taking the positive square root gives x = 2 × 5 × 7 = 70.'
      },
      {
        id: 'apt-simp-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Difference of Squares Product Telescoping] Find the value of (2 + 1)(2^2 + 1)(2^4 + 1)(2^8 + 1)(2^16 + 1) + 1.',
        question: 'Simplify the product expression:\n[ (2 + 1)(2^2 + 1)(2^4 + 1)(2^8 + 1)(2^16 + 1) ] + 1',
        options: [
          'A) 2^16',
          'B) 2^31',
          'C) 2^32',
          'D) 2^64'
        ],
        correctAnswer: 'C',
        explanation: 'Multiply the product P by (2 - 1) = 1 (which does not change its value): P = (2 - 1)(2 + 1)(2^2 + 1)(2^4 + 1)(2^8 + 1)(2^16 + 1). Apply the difference of squares (a - b)(a + b) = a^2 - b^2 repeatedly: (2 - 1)(2 + 1) = 2^2 - 1 -> (2^2 - 1)(2^2 + 1) = 2^4 - 1 -> ... -> (2^16 - 1)(2^16 + 1) = 2^32 - 1. Adding 1 gives (2^32 - 1) + 1 = 2^32.'
      },
      {
        id: 'apt-simp-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Fast Decimal & Unit-Digit Separation] Evaluate: 945.341 - 1042.792 + 875.435 + 31.016.',
        question: 'Evaluate the exact value of:\n945.341 - 1042.792 + 875.435 + 31.016',
        options: [
          'A) 808.990',
          'B) 809.000',
          'C) 809.010',
          'D) 808.980'
        ],
        correctAnswer: 'B',
        explanation: 'Separate the integer parts and the 3-digit decimal parts: 1) Integer parts: 945 - 1042 + 875 + 31 = -97 + 906 = 809. 2) Decimal parts (in thousandths): +341 - 792 + 435 + 016 = (341 + 435 + 16) - 792 = 792 - 792 = 0. Therefore, the exact sum is 809.000.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 3: SURDS AND INDICES (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 3,
    slug: 'aptitude-quant-surds-and-indices',
    title: 'Surds and Indices',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 47,
    video_url: 'https://www.youtube.com/watch?v=jAbpPTpz2bQ',
    video_title: 'Surds and Indices - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master the laws of indices, exponential equations, k-method parameterization (a^x = b^y = c^z), order comparison of radicals, rationalization of multi-term surds, and infinite nested radical formulas.',
    summary_markdown: `### 📌 1. Fundamental Laws of Indices (Exponents)
* **Product & Quotient Rules:** \`a^m * a^n = a^(m + n)\` and \`a^m / a^n = a^(m - n)\`.
* **Power of a Power vs. Power Tower (Crucial Distinction!):**
  * **\`(a^m)^n = a^(m * n)\`** (multiply exponents).
  * **\`a^(m^n)\`** is evaluated **top-down** as \`a^(m^n)\`! For example, \`(2^3)^2 = 2^6 = 64\`, whereas \`2^(3^2) = 2^9 = 512\`!
* **Negative & Fractional Exponents:** \`a^(-n) = 1 / a^n\`, \`(a/b)^(-n) = (b/a)^n\`, and \`a^(m/n) = n-th root of (a^m)\`.

### 💡 2. Comparing Surds of Different Orders (\`n-th root of a\`)
* **Method 1 — LCM of Root Orders (For \`√2, ∛3, ∜4, ⁶√6\`):**
  * Find the LCM of the root indices \`n_1, n_2, ...\` (e.g., \`LCM(2, 3, 4, 6) = 12\`).
  * Raise every surd to the \`12th\` power: \`(2^(1/2))^12 = 2^6 = 64\`, \`(3^(1/3))^12 = 3^4 = 81\`, \`(4^(1/4))^12 = 4^3 = 64\`, \`(6^(1/6))^12 = 6^2 = 36\`. Thus \`∛3\` is the largest!
* **Method 2 — Sum vs. Product Constant Rules for \`√a + √b\` and \`√a - √b\`:**
  * **Constant Sum (\`a + b = S\` in \`√a + √b\`):** Since \`(√a + √b)^2 = (a + b) + 2√(ab)\`, the pair with the **LARGEST product \`a * b\`** (i.e., numbers closest together) is the **LARGEST**!
  * **Constant Difference (\`a - b = d\` in \`√a - √b\`):** Rationalizing gives \`√a - √b = (a - b) / (√a + √b) = d / (√a + √b)\`. Therefore, **larger numbers in the denominator yield a SMALLER value** (e.g., \`√5 - √3 > √7 - √5 > √11 - √9\`)!

### 💡 3. The \`k\`-Parameterization Method & Infinite Radical Shortcuts
* **When \`a^x = b^y = c^z\` and \`b^2 = ac\` (or \`abc = 1\`):**
  * Set \`a^x = b^y = c^z = k\`, so \`a = k^(1/x)\`, \`b = k^(1/y)\`, \`c = k^(1/z)\`.
  * Substitute into the relation between \`a, b, c\` (e.g., \`b^2 = ac => k^(2/y) = k^(1/x + 1/z) => 2/y = 1/x + 1/z\`).
* **Infinite Nested Radicals:**
  * **Multiplication:** \`√(a * √(a * √(a...))) = a\`
  * **Finite \`n\`-Nested Square Roots:** \`√(a * √(a ... n times)) = a^((2^n - 1) / 2^n)\`
  * **Addition/Subtraction when \`a = m(m + 1)\`:** \`√(a + √(a + ...)) = m + 1\`, and \`√(a - √(a - ...)) = m\`.`,
    questions: [
      {
        id: 'apt-surd-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [k-Method Parameterization] If 2^x = 3^y = 6^(-z), find the exact value of (1/x + 1/y + 1/z).',
        question: 'If x, y, and z are non-zero real numbers such that 2^x = 3^y = 6^(-z), what is the value of (1/x + 1/y + 1/z)?',
        options: [
          'A) 0',
          'B) 1',
          'C) 1/6',
          'D) -1'
        ],
        correctAnswer: 'A',
        explanation: 'Let 2^x = 3^y = 6^(-z) = k. Then: 2 = k^(1/x), 3 = k^(1/y), and 6 = k^(-1/z). Since 2 × 3 = 6, substitute the powers of k: k^(1/x) × k^(1/y) = k^(-1/z) => k^(1/x + 1/y) = k^(-1/z). Equating exponents gives 1/x + 1/y = -1/z => 1/x + 1/y + 1/z = 0.'
      },
      {
        id: 'apt-surd-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Power Tower vs. Power of a Power] Simplify: [ 2^(3^2) ÷ (2^3)^2 ] × [ 3^(2^3) ÷ (3^2)^3 ].',
        question: 'Evaluate the exact numerical value of:\n[ 2^(3^2) ÷ (2^3)^2 ] × [ 3^(2^3) ÷ (3^2)^3 ]',
        options: [
          'A) 1',
          'B) 18',
          'C) 72',
          'D) 216'
        ],
        correctAnswer: 'C',
        explanation: 'Distinguish between a power tower a^(m^n) (evaluated top-down) and a bracketed power (a^m)^n = a^(m×n): 1) First bracket: 2^(3^2) = 2^9, while (2^3)^2 = 2^6. Dividing gives 2^(9 - 6) = 2^3 = 8. 2) Second bracket: 3^(2^3) = 3^8, while (3^2)^3 = 3^6. Dividing gives 3^(8 - 6) = 3^2 = 9. 3) Product: 8 × 9 = 72.'
      },
      {
        id: 'apt-surd-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Comparing Radicals of Different Orders] Find the largest and smallest among S1 = √3, S2 = ∛5, S3 = ∜8, and S4 = ⁶√17.',
        question: 'Among the four surds S1 = √3, S2 = ∛5, S3 = ∜8, and S4 = ⁶√17, which is the LARGEST and which is the SMALLEST?',
        options: [
          'A) Largest: √3 | Smallest: ⁶√17',
          'B) Largest: ∛5 | Smallest: ∜8',
          'C) Largest: √3 | Smallest: ∜8',
          'D) Largest: ∜8 | Smallest: ⁶√17'
        ],
        correctAnswer: 'A',
        explanation: 'The root orders are 2, 3, 4, and 6, whose LCM is 12. Raise each surd to the 12th power: 1) (S1)^12 = (3^(1/2))^12 = 3^6 = 729. 2) (S2)^12 = (5^(1/3))^12 = 5^4 = 625. 3) (S3)^12 = (8^(1/4))^12 = 8^3 = 512. 4) (S4)^12 = (17^(1/6))^12 = 17^2 = 289. Since 729 > 625 > 512 > 289, √3 is the largest and ⁶√17 is the smallest.'
      },
      {
        id: 'apt-surd-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Comparing Difference of Surds] Arrange P = √19 - √17, Q = √13 - √11, R = √7 - √5, and S = √5 - √3 in ascending order.',
        question: 'Consider the four surd differences:\n• P = √19 - √17\n• Q = √13 - √11\n• R = √7 - √5\n• S = √5 - √3\nWhich of the following gives the correct strictly ascending order (smallest to largest)?',
        options: [
          'A) S < R < Q < P',
          'B) P < Q < R < S',
          'C) Q < P < R < S',
          'D) R < S < Q < P'
        ],
        correctAnswer: 'B',
        explanation: 'Every expression has a constant difference of 2 inside the roots. Rationalizing the numerator of √a - √b gives: 2 / (√a + √b). Since the numerator (2) is constant, the fraction with the largest denominator (√19 + √17) is the smallest, and the fraction with the smallest denominator (√5 + √3) is the largest: P < Q < R < S.'
      },
      {
        id: 'apt-surd-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Cubic Radical Identity] If x = 2^(2/3) + 2^(1/3), find the exact numerical value of x^3 - 6x.',
        question: 'If x = 2^(2/3) + 2^(1/3), what is the exact value of (x^3 - 6x)?',
        options: [
          'A) 2',
          'B) 4',
          'C) 6',
          'D) 8'
        ],
        correctAnswer: 'C',
        explanation: 'Cube both sides of x = 2^(2/3) + 2^(1/3) using (a + b)^3 = a^3 + b^3 + 3ab(a + b): x^3 = (2^(2/3))^3 + (2^(1/3))^3 + 3 × 2^(2/3) × 2^(1/3) × (2^(2/3) + 2^(1/3)) = 4 + 2 + 3(2)(x) = 6 + 6x. Rearranging gives x^3 - 6x = 6.'
      },
      {
        id: 'apt-surd-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Infinite vs. Finite Nested Radicals] Let A = √(72 + √(72 + ...)) and B = √(2√(2√(2√2))) [4 roots]. Find A × B^(16/15).',
        question: 'Let A = √(72 + √(72 + √(72 + ... to ∞))) and let B = √(2 × √(2 × √(2 × √2))) [4 nested square roots of 2]. What is the value of A × B^(16/15)?',
        options: [
          'A) 9',
          'B) 16',
          'C) 18',
          'D) 36'
        ],
        correctAnswer: 'C',
        explanation: '1) For the infinite additive nested radical A: since 72 = 8 × 9 = m(m + 1), the positive value is m + 1 = 9. 2) For the finite 4-nested multiplicative radical B: √(a√(a... n times)) = a^((2^n - 1) / 2^n). With a = 2 and n = 4, B = 2^(15/16). 3) Raising B to the power (16/15) gives B^(16/15) = 2^1 = 2. 4) Therefore, A × B^(16/15) = 9 × 2 = 18.'
      },
      {
        id: 'apt-surd-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Cyclic Exponent Product] Simplify: [ (x^a / x^b)^(a^2 + ab + b^2) ] × [ (x^b / x^c)^(b^2 + bc + c^2) ] × [ (x^c / x^a)^(c^2 + ca + a^2) ].',
        question: 'For any positive real number x ≠ 1 and real numbers a, b, c, simplify:\n[ (x^a / x^b)^(a^2 + ab + b^2) ] × [ (x^b / x^c)^(b^2 + bc + c^2) ] × [ (x^c / x^a)^(c^2 + ca + a^2) ]',
        options: [
          'A) 0',
          'B) 1',
          'C) x^(a^3 + b^3 + c^3)',
          'D) x^(3abc)'
        ],
        correctAnswer: 'B',
        explanation: 'Rewrite each base using x^a / x^b = x^(a - b), and multiply the exponents using (a - b)(a^2 + ab + b^2) = a^3 - b^3: 1) First factor = x^(a^3 - b^3). 2) Second factor = x^(b^3 - c^3). 3) Third factor = x^(c^3 - a^3). Multiplying all three adds their exponents: x^(a^3 - b^3 + b^3 - c^3 + c^3 - a^3) = x^0 = 1.'
      },
      {
        id: 'apt-surd-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Cyclic Reciprocal Sum] If abc = 1, simplify: 1 / (1 + a + b^(-1)) + 1 / (1 + b + c^(-1)) + 1 / (1 + c + a^(-1)).',
        question: 'If a, b, and c are positive real numbers such that abc = 1, what is the exact value of:\n1 / (1 + a + b^(-1))  +  1 / (1 + b + c^(-1))  +  1 / (1 + c + a^(-1))?',
        options: [
          'A) 0',
          'B) 1',
          'C) 3',
          'D) a + b + c'
        ],
        correctAnswer: 'B',
        explanation: 'Express all three fractions over the common denominator (1 + a + 1/b): 1) First fraction is 1 / (1 + a + 1/b). 2) Multiply top and bottom of the 2nd fraction by (1/b): (1/b) / (1/b + 1 + 1/(bc)). Since abc = 1 => 1/(bc) = a, the 2nd fraction becomes (1/b) / (1 + a + 1/b). 3) Multiply top and bottom of the 3rd fraction by a: a / (a + ac + 1). Since ac = 1/b, the 3rd fraction becomes a / (1 + a + 1/b). 4) Summing all three gives (1 + 1/b + a) / (1 + a + 1/b) = 1.'
      },
      {
        id: 'apt-surd-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Exponential Difference Equation] If 3^(x + 2) - 3^(x - 1) = 702, find the value of (2x - 1)^2.',
        question: 'If x is a real number satisfying 3^(x + 2) - 3^(x - 1) = 702, what is the value of (2x - 1)^2?',
        options: [
          'A) 25',
          'B) 49',
          'C) 81',
          'D) 121'
        ],
        correctAnswer: 'B',
        explanation: 'Factor out the smaller power 3^(x - 1) from the left-hand side: 3^(x - 1) × (3^3 - 1) = 702 => 3^(x - 1) × 26 = 702. Divide both sides by 26: 3^(x - 1) = 27 = 3^3 => x - 1 = 3 => x = 4. Therefore, (2x - 1)^2 = (2(4) - 1)^2 = 7^2 = 49.'
      },
      {
        id: 'apt-surd-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Rationalizing a 3-Term Surd Denominator] If 12 / (√5 + √3 + √2) = a√5 + b√3 + c√2 - d√30, find (a + b + c + d).',
        question: 'When the denominator of 12 / (√5 + √3 + √2) is rationalized into the form:\na√5 + b√3 + c√2 - d√30\n(where a, b, c, d are integers), what is the value of (a + b + c + d)?',
        options: [
          'A) 6',
          'B) 8',
          'C) 9',
          'D) 10'
        ],
        correctAnswer: 'A',
        explanation: 'Group the denominator as [(√3 + √2) + √5] and multiply top and bottom by [(√3 + √2) - √5]: 1) New denominator = (√3 + √2)^2 - (√5)^2 = (3 + 2 + 2√6) - 5 = 2√6. 2) The fraction becomes 12(√3 + √2 - √5) / (2√6) = 6(√3 + √2 - √5) / √6. 3) Multiply top and bottom by √6: √6(√3 + √2 - √5) = √18 + √12 - √30 = 0√5 + 2√3 + 3√2 - 1√30. Thus a = 0, b = 2, c = 3, d = 1, and a + b + c + d = 0 + 2 + 3 + 1 = 6.'
      },
      {
        id: 'apt-surd-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Reciprocal Root Simplification] If x = (√5 + √3)/(√5 - √3) and y = (√5 - √3)/(√5 + √3), find (x^2 + xy + y^2)/(x^2 - xy + y^2).',
        question: 'If x = (√5 + √3) / (√5 - √3) and y = (√5 - √3) / (√5 + √3), what is the exact value of:\n(x^2 + xy + y^2) ÷ (x^2 - xy + y^2)?',
        options: [
          'A) 63 / 61',
          'B) 65 / 63',
          'C) 16 / 15',
          'D) 64 / 61'
        ],
        correctAnswer: 'A',
        explanation: '1) Notice that x and y are reciprocals, so xy = 1. 2) Find x + y: x + y = [(√5 + √3)^2 + (√5 - √3)^2] / (5 - 3) = 2(5 + 3) / 2 = 8. 3) Therefore, x^2 + y^2 = (x + y)^2 - 2xy = 8^2 - 2(1) = 62. 4) Substitute x^2 + y^2 = 62 and xy = 1 into the expression: (62 + 1) / (62 - 1) = 63 / 61.'
      },
      {
        id: 'apt-surd-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [System of Exponential Equations] If 2^x + 3^y = 59 and 2^(x + 2) - 3^(y + 1) = 47, find the value of x^y.',
        question: 'If x and y are positive integers satisfying the system of exponential equations:\n• 2^x + 3^y = 59\n• 2^(x + 2) - 3^(y + 1) = 47\nwhat is the value of x^y?',
        options: [
          'A) 64',
          'B) 81',
          'C) 125',
          'D) 243'
        ],
        correctAnswer: 'C',
        explanation: 'Let A = 2^x and B = 3^y. Then the system becomes: (1) A + B = 59, and (2) 4A - 3B = 47 (since 2^(x+2) = 4 × 2^x and 3^(y+1) = 3 × 3^y). Multiply (1) by 3 and add to (2): 3A + 4A = 177 + 47 = 224 => 7A = 224 => A = 32. Since 2^x = 32 = 2^5, we get x = 5. Then B = 59 - 32 = 27 = 3^3, so y = 3. Therefore, x^y = 5^3 = 125.'
      },
      {
        id: 'apt-surd-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Polynomial Evaluation with Surd Root] If x = (√3 + 1) / 2, find the exact value of 4x^3 + 2x^2 - 8x + 7.',
        question: 'If x = (√3 + 1) / 2, what is the exact value of the polynomial:\n4x^3 + 2x^2 - 8x + 7?',
        options: [
          'A) 8',
          'B) 10',
          'C) 12',
          'D) 10 + √3'
        ],
        correctAnswer: 'B',
        explanation: 'Isolate the radical and square to form a zero quadratic: 2x - 1 = √3 => (2x - 1)^2 = 3 => 4x^2 - 4x + 1 = 3 => 4x^2 = 4x + 2 (and 2x^2 - 2x = 1). Substitute 4x^2 = 4x + 2 into the cubic term: 4x^3 + 2x^2 - 8x + 7 = x(4x^2) + 2x^2 - 8x + 7 = x(4x + 2) + 2x^2 - 8x + 7 = 6x^2 - 6x + 7 = 3(2x^2 - 2x) + 7 = 3(1) + 7 = 10.'
      },
      {
        id: 'apt-surd-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Symmetric Surd Sum Comparison] Which of the following four sums is the LARGEST: A = √10 + √7, B = √11 + √6, C = √12 + √5, D = √14 + √3?',
        question: 'Among the four surd sums:\n• A = √10 + √7\n• B = √11 + √6\n• C = √12 + √5\n• D = √14 + √3\nwhich one has the GREATEST numerical value?',
        options: [
          'A) √10 + √7',
          'B) √11 + √6',
          'C) √12 + √5',
          'D) √14 + √3'
        ],
        correctAnswer: 'A',
        explanation: 'In all four expressions of the form √x + √y, the sum x + y is constant: 10+7 = 11+6 = 12+5 = 14+3 = 17. Squaring gives (√x + √y)^2 = 17 + 2√(xy). Therefore, the expression with the largest product (x × y) is the largest: 10×7 = 70 > 11×6 (66) > 12×5 (60) > 14×3 (42). Thus, √10 + √7 is the greatest.'
      },
      {
        id: 'apt-surd-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Fractional Exponent Simplification] Simplify: [ (243)^(n/5) × 3^(2n + 1) ] ÷ [ 9^n × 3^(n - 1) ].',
        question: 'For any real number n, simplify the exponential fraction:\n[ (243)^(n/5) × 3^(2n + 1) ] ÷ [ 9^n × 3^(n - 1) ]',
        options: [
          'A) 3',
          'B) 9',
          'C) 27',
          'D) 3^n'
        ],
        correctAnswer: 'B',
        explanation: 'Convert every factor to base 3: 1) (243)^(n/5) = (3^5)^(n/5) = 3^n. 2) Numerator = 3^n × 3^(2n + 1) = 3^(3n + 1). 3) Denominator: 9^n × 3^(n - 1) = 3^(2n) × 3^(n - 1) = 3^(3n - 1). 4) Divide numerator by denominator: 3^((3n + 1) - (3n - 1)) = 3^2 = 9.'
      },
      {
        id: 'apt-surd-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Componendo-Dividendo on Radical Ratios] If x = 4√15 / (√5 + √3), find the exact value of (x + 2√5)/(x - 2√5) + (x + 2√3)/(x - 2√3).',
        question: 'If x = (4√15) / (√5 + √3), what is the exact value of:\n[ (x + 2√5) / (x - 2√5) ] + [ (x + 2√3) / (x - 2√3) ]?',
        options: [
          'A) 1',
          'B) 2',
          'C) √5 + √3',
          'D) 4'
        ],
        correctAnswer: 'B',
        explanation: 'Write x = (2 × 2√5 × 2√3) / (2√5 + 2√3), which has the harmonic form x = 2ab / (a + b) with a = 2√5 and b = 2√3. 1) Since x / (2√5) = (2√3) / (√5 + √3), Componendo-Dividendo gives (x + 2√5)/(x - 2√5) = (3√3 + √5)/(√3 - √5). 2) Since x / (2√3) = (2√5) / (√5 + √3), Componendo-Dividendo gives (x + 2√3)/(x - 2√3) = (3√5 + √3)/(√5 - √3) = -(3√5 + √3)/(√3 - √5). 3) Adding both fractions gives (2√3 - 2√5) / (√3 - √5) = 2.'
      },
      {
        id: 'apt-surd-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Symmetric Exponent Sum to 1] Evaluate: 1 / [1 + x^(b-a) + x^(c-a)] + 1 / [1 + x^(a-b) + x^(c-b)] + 1 / [1 + x^(a-c) + x^(b-c)].',
        question: 'For any positive real number x and real exponents a, b, c, evaluate:\n1 / (1 + x^(b-a) + x^(c-a)) + 1 / (1 + x^(a-b) + x^(c-b)) + 1 / (1 + x^(a-c) + x^(b-c))',
        options: [
          'A) 0',
          'B) 1',
          'C) 3',
          'D) x^(a+b+c)'
        ],
        correctAnswer: 'B',
        explanation: 'Multiply top and bottom of the 1st fraction by x^a, the 2nd fraction by x^b, and the 3rd fraction by x^c: the expression becomes x^a/(x^a + x^b + x^c) + x^b/(x^a + x^b + x^c) + x^c/(x^a + x^b + x^c) = (x^a + x^b + x^c) / (x^a + x^b + x^c) = 1.'
      },
      {
        id: 'apt-surd-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Finding the Value of √x + 1/√x] If x = 7 + 4√3, find the exact value of (√x + 1/√x).',
        question: 'If x = 7 + 4√3, what is the exact positive value of (√x + 1/√x)?',
        options: [
          'A) 2√3',
          'B) 4',
          'C) 2 + √3',
          'D) 14'
        ],
        correctAnswer: 'B',
        explanation: '1) Since 7^2 - (4√3)^2 = 49 - 48 = 1, the reciprocal of x is 1/x = 7 - 4√3. 2) Adding them gives x + 1/x = 14. 3) Now square (√x + 1/√x): (√x + 1/√x)^2 = x + 1/x + 2 = 14 + 2 = 16. Taking the positive square root gives √x + 1/√x = 4.'
      },
      {
        id: 'apt-surd-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Six-Variable Exponential Chain] If 3^a = 4, 4^b = 5, 5^c = 6, 6^d = 7, 7^e = 8, and 8^f = 81, find the product (a × b × c × d × e × f).',
        question: 'If real numbers a, b, c, d, e, and f satisfy the chain of exponential equations:\n3^a = 4,  4^b = 5,  5^c = 6,  6^d = 7,  7^e = 8,  and  8^f = 81,\nwhat is the exact value of the product (a × b × c × d × e × f)?',
        options: [
          'A) 3',
          'B) 4',
          'C) 6',
          'D) 9'
        ],
        correctAnswer: 'B',
        explanation: 'Substitute each equation into the next along the chain: 81 = 8^f = (7^e)^f = 7^(ef) = (6^d)^(ef) = 6^(def) = (5^c)^(def) = 5^(cdef) = (4^b)^(cdef) = 4^(bcdef) = (3^a)^(bcdef) = 3^(abcdef). Since 81 = 3^4, we have 3^(abcdef) = 3^4 => a × b × c × d × e × f = 4.'
      },
      {
        id: 'apt-surd-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Infinite Additive vs. Subtractive Radicals] Evaluate X = √(12 + √(12 + √(12 + ...))) ÷ √(20 - √(20 - √(20 - ...))).',
        question: 'Let X be the positive real number defined by the infinite nested radicals:\nX = √( 12 + √( 12 + √( 12 + ... ) ) )  ÷  √( 20 - √( 20 - √( 20 - ... ) ) )\nWhat is the exact value of X?',
        options: [
          'A) 3 / 5',
          'B) 1',
          'C) 4 / 5',
          'D) 5 / 4'
        ],
        correctAnswer: 'B',
        explanation: '1) Numerator: √(12 + √(12 + ...)): since 12 = 3 × 4 = m(m + 1), the infinite additive radical equals the larger factor m + 1 = 4. 2) Denominator: √(20 - √(20 - ...)): since 20 = 4 × 5 = m(m + 1), the infinite subtractive radical equals the smaller factor m = 4. 3) Therefore, X = 4 ÷ 4 = 1.'
      }
    ]
  }
];

function cleanUrl(raw) {
  if (!raw) return '';
  const match = raw.match(/\((https?:\/\/[^\)]+)\)/);
  if (match) return match[1];
  const urlMatch = raw.match(/(https?:\/\/[^\s]+)/);
  return urlMatch ? urlMatch[1] : raw;
}

async function seedAptitudeBatch1() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 1 (TOPICS 1 TO 3) ===\n');

    // 1. Locate Aptitude Track
    const trackRes = await client.query(`
      SELECT id, name, slug, title FROM tracks 
      WHERE slug = 'aptitude' OR title = 'Aptitude' OR id = 27
      LIMIT 1;
    `);

    if (trackRes.rowCount === 0) {
      throw new Error('Aptitude track not found! Please run cleanup_and_setup_aptitude_track.js first.');
    }

    const aptitudeTrackId = trackRes.rows[0].id;
    console.log(`Found Aptitude Track: ID = ${aptitudeTrackId} (${trackRes.rows[0].title})\n`);

    // 2. Upsert Topics
    for (const item of aptitudeBatch1) {
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
      await client.query(`UPDATE tracks SET total_topics = 3, estimated_hours = 6 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 3, estimated_hours = 6');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 3 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 3');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 1 (Topics 1 to 3) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch1();
