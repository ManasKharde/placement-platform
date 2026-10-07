const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch8 = [
  // ===========================================================================
  // TOPIC 22: PARTNERSHIP (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 22,
    slug: 'aptitude-quant-partnership',
    title: 'Partnership',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 31,
    video_url: 'http://www.youtube.com/watch?v=hn9TKnr8L_8',
    video_title: 'Partnership - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Master the fundamental partnership equation mapping investment and time to profit ratios, active vs sleeping partners, and proportional business share distributions.',
    summary_markdown: `### 📌 1. The Core Partnership Equation
* **Investment × Time = Profit:**
  The fundamental rule of partnership states that the ratio of profits obtained by the partners is directly proportional to the product of their invested capital and the time period for which it was invested.
* **\`Ratio of Profit of A : Profit of B = (Investment of A × Time of A) : (Investment of B × Time of B)\`**
  * If the time periods are identical, the profit ratio equals the investment ratio.
  * If the investments are identical, the profit ratio equals the time ratio.

### 💡 2. Finding Unknowns
* **Finding Investment Ratio from Time and Profit:**
  * \`Investment Ratio = Profit Ratio / Time Ratio\`
  * If Profit ratio is \`P_a : P_b\` and Time ratio is \`T_a : T_b\`, then Investment ratio is \`(P_a / T_a) : (P_b / T_b)\`. Multiply by the LCM of denominators to get whole numbers.
* **Finding Time Ratio from Investment and Profit:**
  * \`Time Ratio = Profit Ratio / Investment Ratio\`

### 💡 3. Active vs. Sleeping Partners & Donations
* **Active Partner Salary:** If a partner is an "active" or "working" partner, they usually receive a fixed salary or a fixed percentage of the total profit for managing the business.
  * *Crucial Step:* ALWAYS deduct this salary (or charity donation) from the **Total Profit** first.
  * The **Remaining Profit** is then distributed among all partners (including the active one) strictly according to their \`(Investment × Time)\` ratio.
  * The Active Partner's Total Earnings = Salary + Profit Share.`,
    questions: [
      {
        id: 'apt-part-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Direct Profit Distribution] P and Q buy a hotel. P invests 6 times the investment of Q. On receiving a total profit of ₹84,000, what will be P\'s exact share?',
        question: 'P and Q jointly buy a hotel. P invests exactly 6 times the amount invested by Q. On receiving a total business profit of ₹84,000 at the end of the year, what will be P\'s exact share?',
        options: [
          'A) ₹12,000',
          'B) ₹60,000',
          'C) ₹70,000',
          'D) ₹72,000'
        ],
        correctAnswer: 'D',
        explanation: 'Since the time period is identical for both, Profit Ratio = Investment Ratio. Let Q\'s investment be 1 unit, so P\'s investment is 6 units. Profit ratio P : Q = 6 : 1. P\'s share = [6 / (6 + 1)] × 84000 = (6/7) × 84000 = 6 × 12000 = ₹72,000.'
      },
      {
        id: 'apt-part-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Different Time Periods] Rohit starts an agency investing ₹40,000. After 4 months, Raj joins with ₹50,000. Find Raj\'s share in a total profit of ₹1,87,000 at year end.',
        question: 'Rohit starts a travel agency by investing ₹40,000. Exactly 4 months later, Raj joins the agency by investing ₹50,000. If they earn a total profit of ₹1,87,000 at the end of the year, what is the profit share of Raj?',
        options: [
          'A) ₹80,000',
          'B) ₹85,000',
          'C) ₹90,000',
          'D) ₹1,02,000'
        ],
        correctAnswer: 'B',
        explanation: 'Rohit\'s investment time = 12 months. Raj\'s investment time = 12 - 4 = 8 months. Profit ratio (Rohit : Raj) = (40000 × 12) : (50000 × 8) = 480000 : 400000 = 48 : 40 = 6 : 5. Raj\'s share = [5 / (6 + 5)] × 187000 = (5/11) × 187000 = 5 × 17000 = ₹85,000.'
      },
      {
        id: 'apt-part-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Finding Unknown Time Parameter] M invests ₹4,000. After 3 months N joins with ₹8,000. P joins later with ₹20,000. If profit ratio is 6:9:5, for how many months was P involved?',
        question: 'M invests ₹4,000 in a business. After 3 months, N joins with ₹8,000. P joins later with an investment of ₹20,000. At the end of the year, the profits of M, N, and P are in the ratio 6 : 9 : 5. For exactly how many months was P involved in the business?',
        options: [
          'A) 2 months',
          'B) 3 months',
          'C) 4 months',
          'D) 5 months'
        ],
        correctAnswer: 'A',
        explanation: 'M\'s time = 12 months. N\'s time = 9 months. P\'s time = T months. The profit ratio is (4000×12) : (8000×9) : (20000×T) = 48000 : 72000 : 20000T. We are given the actual profit ratio is 6 : 9 : 5. Let the common multiplier be k, so 6k = 48000 => k = 8000. Therefore, P\'s share = 5k = 40000. Equating P\'s ratio value: 20000T = 40000 => T = 2 months.'
      },
      {
        id: 'apt-part-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Finding Investment Ratio from Time and Profit] Profit ratio of P, Q, R is 5:8:9. Time period ratio is 2:5:8. Find the exact investment ratio.',
        question: 'The ratio of profits of partners P, Q, and R in a business is 5 : 8 : 9 respectively. If the ratio of their respective investment time periods is 2 : 5 : 8, what is the exact ratio of their invested capitals?',
        options: [
          'A) 100 : 64 : 45',
          'B) 100 : 45 : 64',
          'C) 45 : 64 : 100',
          'D) 64 : 100 : 45'
        ],
        correctAnswer: 'A',
        explanation: 'Investment Ratio = Profit Ratio / Time Ratio. I_P : I_Q : I_R = 5/2 : 8/5 : 9/8. To clear denominators, find the LCM of 2, 5, 8, which is 40. Multiply all terms by 40: (5/2)×40 : (8/5)×40 : (9/8)×40 = 100 : 64 : 45.'
      },
      {
        id: 'apt-part-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Donation Deduction Before Profit Split] Ajay and Vijay invest in ratio 5:2. After donating 10% of total profit, Ajay gets ₹3,420. Find Vijay\'s share.',
        question: 'Ajay and Vijay\'s investments are in the ratio 5 : 2. Exactly 10% of the total business profit is donated to an orphanage, and the remaining profit is distributed between them. If Ajay\'s final received profit is ₹3,420, what is Vijay\'s exact share?',
        options: [
          'A) ₹1,248',
          'B) ₹1,368',
          'C) ₹1,480',
          'D) ₹1,710'
        ],
        correctAnswer: 'B',
        explanation: 'Since the remaining profit is strictly distributed in the investment ratio (5:2), we do not need to calculate the original total profit before donation! We know Ajay\'s share corresponds to 5 parts of the distributed profit, and Vijay\'s corresponds to 2 parts. Ajay\'s share = 5 parts = 3420 => 1 part = 3420 / 5 = 684. Vijay\'s share = 2 parts = 2 × 684 = ₹1,368.'
      },
      {
        id: 'apt-part-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Fractional Investment Logic] P, Q, R start a hotel. Q and R invest equally, but P invests 1/5 of the total. Total profit is ₹2,25,000. Difference between P and R\'s profit?',
        question: 'P, Q, and R start a hotel. Q and R invest exactly equal amounts, but P invests exactly 1/5 of the total investment amount. On receiving a total profit of ₹2,25,000, what is the exact difference between the profit shares of P and R?',
        options: [
          'A) ₹25,000',
          'B) ₹35,000',
          'C) ₹45,000',
          'D) ₹55,000'
        ],
        correctAnswer: 'C',
        explanation: 'Since P invests 1/5 of the total, P\'s profit share = (1/5) × 225000 = ₹45,000. The remaining profit = 225000 - 45000 = ₹1,80,000. Since Q and R invested equally, they share this remaining profit equally: R\'s profit = Q\'s profit = 180000 / 2 = ₹90,000. The difference between R\'s profit and P\'s profit = 90000 - 45000 = ₹45,000.'
      },
      {
        id: 'apt-part-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Active Partner Salary Calculation] P and Q invest ₹20k and ₹40k. Total profit is ₹15k. P gets his profit share PLUS a salary. If P receives ₹7,000 total, what is his salary?',
        question: 'P and Q start a cafe with capitals of ₹20,000 and ₹40,000 respectively. After a year, out of a total profit of ₹15,000, P (as an active partner) gets his profit share PLUS some money as his salary. If P receives a total of ₹7,000, what is the exact amount of his salary?',
        options: [
          'A) ₹1,500',
          'B) ₹2,000',
          'C) ₹2,500',
          'D) ₹3,000'
        ],
        correctAnswer: 'B',
        explanation: 'Ratio of investments P : Q = 20,000 : 40,000 = 1 : 2. P\'s proportional profit share from business = (1 / 3) × 15,000 = ₹5,000. P receives a total of ₹7,000. The salary amount received by P = Total received - Profit share = 7,000 - 5,000 = ₹2,000.'
      },
      {
        id: 'apt-part-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Unknown Investment Amount] Ram and Shyam jointly invest ₹15,000. Total profit is ₹2,000. If Shyam\'s profit share is ₹600, how much did Ram invest?',
        question: 'A total of ₹15,000 was invested by Ram and Shyam together to start a business. They earned a total profit of ₹2,000 at the end of the year. If Shyam took his profit share of exactly ₹600, how much money did Ram invest originally?',
        options: [
          'A) ₹8,500',
          'B) ₹9,000',
          'C) ₹10,500',
          'D) ₹11,000'
        ],
        correctAnswer: 'C',
        explanation: 'Total profit = 2000. Shyam\'s profit = 600. Therefore, Ram\'s profit = 2000 - 600 = 1400. Profit ratio (Ram : Shyam) = 1400 : 600 = 14 : 6 = 7 : 3. Since investment ratio equals profit ratio, Ram\'s investment share is 7 parts out of 10. Ram\'s investment = (7 / 10) × 15000 = 7 × 1500 = ₹10,500.'
      },
      {
        id: 'apt-part-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Unequal Addition and Withdrawals] A starts with ₹50,000. After 6 months, he adds ₹10,000 and B joins with ₹40,000. Find B\'s share in a ₹45,000 profit after 1 year.',
        question: 'A starts a business with ₹50,000. After 6 months, A adds an additional ₹10,000 to his capital, and B joins the business with a capital of ₹40,000. What is B\'s share in a total profit of ₹45,000 at the end of the year?',
        options: [
          'A) ₹12,000',
          'B) ₹15,000',
          'C) ₹16,000',
          'D) ₹18,000'
        ],
        correctAnswer: 'A',
        explanation: 'Calculate "investment-months" for A: (50000 × 6) + (60000 × 6) = 300,000 + 360,000 = 660,000. Calculate for B: (40000 × 6) = 240,000. Profit ratio A : B = 660,000 : 240,000 = 66 : 24 = 11 : 4. B\'s share = [4 / (11 + 4)] × 45,000 = (4 / 15) × 45,000 = 4 × 3,000 = ₹12,000.'
      },
      {
        id: 'apt-part-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Multiple Exits and Additions] A, B, C start with ₹120k, ₹135k, ₹150k. After 4 months, C leaves. After 8 months, B leaves. Total profit ₹65,000. Find A\'s share.',
        question: 'A, B, and C start a business with capitals of ₹1,20,000, ₹1,35,000, and ₹1,50,000 respectively. After exactly 4 months, C leaves the business. After exactly 8 months from the start, B leaves the business. If they earn a total profit of ₹65,000 at the end of the year, what is A\'s exact share?',
        options: [
          'A) ₹24,000',
          'B) ₹27,000',
          'C) ₹28,800',
          'D) ₹30,000'
        ],
        correctAnswer: 'D',
        explanation: 'Time periods: A = 12 months, B = 8 months, C = 4 months. Investment ratio A:B:C = 120 : 135 : 150 = 8 : 9 : 10. Product (Ratio × Time) -> A = 8 × 12 = 96. B = 9 × 8 = 72. C = 10 × 4 = 40. Profit ratio = 96 : 72 : 40. Divide by 8 -> 12 : 9 : 5. Total parts = 12 + 9 + 5 = 26. A\'s share = (12 / 26) × 65,000 = (6 / 13) × 65,000 = 6 × 5,000 = ₹30,000.'
      },
      {
        id: 'apt-part-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Profit Ratio with Complex Fractions] A invests 1/6 capital for 1/6 time, B invests 1/3 capital for 1/3 time, C invests rest of capital for whole time. Find C\'s share in ₹4,600 profit.',
        question: 'A invests 1/6 of the total capital for 1/6 of the total time. B invests 1/3 of the total capital for 1/3 of the total time. C invests the rest of the capital for the entire whole time. Out of a total profit of ₹4,600, what is C\'s exact share?',
        options: [
          'A) ₹2,400',
          'B) ₹3,000',
          'C) ₹3,300',
          'D) ₹3,600'
        ],
        correctAnswer: 'D',
        explanation: '1) C\'s capital = 1 - (1/6 + 1/3) = 1 - 1/2 = 1/2 of the total capital. 2) Profit ratios = (A_inv × A_time) : (B_inv × B_time) : (C_inv × C_time) = (1/6 × 1/6) : (1/3 × 1/3) : (1/2 × 1) = 1/36 : 1/9 : 1/2. 3) Multiply by 36 to get whole numbers: 1 : 4 : 18. Total parts = 1 + 4 + 18 = 23. C\'s share = (18 / 23) × 4600 = 18 × 200 = ₹3,600.'
      },
      {
        id: 'apt-part-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Working Partner Percentage Commission] A and B invest ₹30k and ₹40k. A receives 10% of profit for managing. Rest is divided in investment ratio. If A receives ₹3,400 total, find total profit.',
        question: 'A and B invest ₹30,000 and ₹40,000 respectively in a business. A receives 10% of the total profit for managing the business, and the remaining profit is divided according to their investments. If A receives a total of ₹3,400, what is the total profit of the business?',
        options: [
          'A) ₹7,000',
          'B) ₹8,000',
          'C) ₹9,000',
          'D) ₹10,000'
        ],
        correctAnswer: 'A',
        explanation: 'Let Total Profit = P. A\'s managing fee = 0.10P. Remaining profit to divide = 0.90P. Investment ratio A : B = 30 : 40 = 3 : 4. A\'s share of remaining profit = (3/7) × 0.90P. Total received by A = 0.10P + (2.70P / 7) = (0.70P + 2.70P) / 7 = 3.40P / 7. Given: 3.40P / 7 = 3400 => 3.40P = 23800 => P = ₹7,000.'
      },
      {
        id: 'apt-part-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Finding Profit Ratio with Unknown Withdrawals] X and Y start with ₹16k and ₹12k. After 3 months X withdraws ₹5k and Y adds ₹5k. Z joins with ₹21k. Profit ratio at end of year?',
        question: 'X and Y start a business with ₹16,000 and ₹12,000 respectively. After exactly 3 months, X withdraws ₹5,000 and Y adds ₹5,000 to his investment. At the exact same time, Z joins the business with ₹21,000. What will be the ratio of their profits at the end of the year?',
        options: [
          'A) 143 : 189 : 189',
          'B) 147 : 189 : 189',
          'C) 147 : 185 : 189',
          'D) 145 : 189 : 185'
        ],
        correctAnswer: 'B',
        explanation: 'X\'s investment = (16000 × 3) + (11000 × 9) = 48000 + 99000 = 147,000. Y\'s investment = (12000 × 3) + (17000 × 9) = 36000 + 153000 = 189,000. Z\'s investment = 21000 × 9 = 189,000. Ratio = 147 : 189 : 189. (Divide by 21 to get 7 : 9 : 9).'
      },
      {
        id: 'apt-part-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Time Parameter Equivalent Investments] A, B, C rent a pasture. A puts 10 oxen for 7 months, B puts 12 oxen for 5 months, C puts 15 oxen for 3 months. If rent is ₹175, how much must C pay?',
        question: 'A, B, and C rent a pasture. A puts 10 oxen for 7 months, B puts 12 oxen for 5 months, and C puts 15 oxen for 3 months for grazing. If the total rent of the pasture is ₹175, how much must C pay as his exact share of the rent?',
        options: [
          'A) ₹45',
          'B) ₹50',
          'C) ₹55',
          'D) ₹60'
        ],
        correctAnswer: 'A',
        explanation: 'Rent is shared in the ratio of (Number of animals × Time). A : B : C = (10 × 7) : (12 × 5) : (15 × 3) = 70 : 60 : 45. Divide by 5: 14 : 12 : 9. Total parts = 14 + 12 + 9 = 35. C\'s share = (9 / 35) × 175. Since 175 / 35 = 5, C\'s share = 9 × 5 = ₹45.'
      },
      {
        id: 'apt-part-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Total Capital from Profit Percentage] A, B, C share profits. A gets 3/10, B gets 1/3, C gets the rest. If C\'s profit is ₹1,100, what is the total profit?',
        question: 'A, B, and C are partners sharing business profits. A gets exactly 3/10 of the profit, B gets exactly 1/3 of the profit, and C gets the remaining profit. If C\'s actual profit share is ₹1,100, what is the total profit of the business?',
        options: [
          'A) ₹2,000',
          'B) ₹2,400',
          'C) ₹3,000',
          'D) ₹3,300'
        ],
        correctAnswer: 'C',
        explanation: 'C\'s fractional share = 1 - (3/10 + 1/3) = 1 - (9/30 + 10/30) = 1 - 19/30 = 11/30. Let total profit be P. (11/30) × P = 1100 => P = (1100 × 30) / 11 = 100 × 30 = ₹3,000.'
      },
      {
        id: 'apt-part-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Compound Investment Return] A invests ₹X at start. B invests ₹Y after 6 months. If they share profit equally at the end of the year, what is the relation between X and Y?',
        question: 'A invests ₹X at the start of the year in a business. B invests ₹Y exactly 6 months later. If they share the profit equally at the end of the year, what is the exact mathematical relation between X and Y?',
        options: [
          'A) X = 2Y',
          'B) 2X = Y',
          'C) 3X = 2Y',
          'D) X = Y'
        ],
        correctAnswer: 'B',
        explanation: 'A\'s investment × Time = X × 12. B\'s investment × Time = Y × 6. Since profits are equal, X × 12 = Y × 6 => 12X = 6Y => 2X = Y.'
      },
      {
        id: 'apt-part-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Variable Addition and Constant End] A and B start with ₹50k and ₹20k. A withdraws ₹10k every month, B adds ₹10k every month. When will their total investments be equal?',
        question: 'A and B start a business with ₹50,000 and ₹20,000 respectively. Every subsequent month, A withdraws ₹10,000 while B adds ₹10,000. After how many months will their total cumulative investments become exactly equal?',
        options: [
          'A) 3 months',
          'B) 4 months',
          'C) 5 months',
          'D) 6 months'
        ],
        correctAnswer: 'B',
        explanation: 'Cumulative investment for A after n months is an arithmetic progression: 50 + 40 + 30 + ... (n terms). Cumulative investment for B: 20 + 30 + 40 + ... (n terms). Sum A = (n/2)[2(50) + (n-1)(-10)]. Sum B = (n/2)[2(20) + (n-1)(10)]. Equating the bracketed terms: 100 - 10n + 10 = 40 + 10n - 10 => 110 - 10n = 30 + 10n => 80 = 20n => n = 4. They will be equal after 4 months.'
      },
      {
        id: 'apt-part-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Capital Multipliers] In a partnership, A invests 1/2 of the capital for 1/3 of the time. B invests 1/4 of the capital for 1/4 of the time. C invests the rest for the whole time. Find A\'s share out of ₹4,600.',
        question: 'In a partnership, A invests exactly 1/2 of the capital for 1/3 of the time. B invests exactly 1/4 of the capital for 1/4 of the time. C invests the rest of the capital for the whole time. Out of a total business profit of ₹4,600, what is A\'s share?',
        options: [
          'A) ₹1,600',
          'B) ₹1,800',
          'C) ₹2,000',
          'D) ₹2,400'
        ],
        correctAnswer: 'A',
        explanation: '1) C\'s capital = 1 - (1/2 + 1/4) = 1 - 3/4 = 1/4. 2) Ratios = (1/2 × 1/3) : (1/4 × 1/4) : (1/4 × 1) = 1/6 : 1/16 : 1/4. 3) LCM of 6, 16, 4 is 48. Multiply by 48: 8 : 3 : 12. Total parts = 8 + 3 + 12 = 23. A\'s share = (8 / 23) × 4600 = 8 × 200 = ₹1,600.'
      },
      {
        id: 'apt-part-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Reinvesting Profit Percentages] A and B start with ₹30k and ₹40k. They agree to reinvest 40% of the profit back into the business and distribute the rest. If A gets ₹1,800, find total profit.',
        question: 'A and B start a business with ₹30,000 and ₹40,000 respectively. They agree to reinvest exactly 40% of the total profit back into the business and distribute the remaining profit in their investment ratio. If A\'s received distributed share is ₹1,800, what is the total overall profit of the business?',
        options: [
          'A) ₹5,000',
          'B) ₹6,000',
          'C) ₹7,000',
          'D) ₹8,000'
        ],
        correctAnswer: 'C',
        explanation: 'Investment ratio A : B = 3 : 4. Total distributed profit = 7 parts. A gets 3 parts. 3 parts = 1800 => 1 part = 600. Total distributed profit = 7 × 600 = ₹4,200. This 4200 represents the 60% (100% - 40%) of the total profit that was not reinvested. 60% of Total = 4200 => (60/100) × Total = 4200 => Total = (4200 × 100) / 60 = 70 × 100 = ₹7,000.'
      },
      {
        id: 'apt-part-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Equal Profit Shares Reverse Logic] A, B, C invest capitals in ratio 2:3:4. If they receive equal profits at the end, what is the ratio of their time periods?',
        question: 'Three partners A, B, and C invest their capitals in a business in the ratio 2 : 3 : 4. If they receive exactly equal profits at the end of the year, what is the ratio of their invested time periods?',
        options: [
          'A) 2 : 3 : 4',
          'B) 4 : 3 : 2',
          'C) 6 : 4 : 3',
          'D) 12 : 8 : 6'
        ],
        correctAnswer: 'C',
        explanation: 'Profit = Investment × Time. Since Profits are equal, let Profit = 1 for all. Time = Profit / Investment. T_A : T_B : T_C = 1/2 : 1/3 : 1/4. Multiply by LCM 12: 6 : 4 : 3.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 23: SQUARE & CUBE ROOTS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 23,
    slug: 'aptitude-quant-square-and-cube-roots',
    title: 'Square & Cube Roots',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 44,
    video_url: 'http://www.youtube.com/watch?v=_HyhwS8P9KY',
    video_title: 'Square & Cube Roots - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Calculate squares under 10 seconds, unit-digit estimation for large square and cube roots, decimal point scaling, and nested radical sums.',
    summary_markdown: `### 📌 1. Squaring Shortcuts (Mental Math)
* **Squaring numbers ending in 5 (e.g., 85):**
  1. The last two digits are ALWAYS **25**.
  2. The preceding digits are calculated by multiplying the first digit(s) by the next higher integer. (e.g., \`8 × 9 = 72\`).
  3. Result: **\`7225\`**.
* **General 2-Digit Squaring (e.g., 37):**
  Find the nearest multiple of 10 (e.g., 40, which is \`+3\`). Subtract that difference from the number (\`37 - 3 = 34\`). Multiply those two: \`40 × 34 = 1360\`. Add the square of the difference (\`3^2 = 9\`). Result: **\`1369\`**.

### 💡 2. Fast Square & Cube Roots via Unit Digits
* **Square Root (10 Seconds):**
  1. Look at the last digit of the perfect square. (e.g., ends in \`4\` $\\rightarrow$ root ends in \`2\` or \`8\`).
  2. Discard the last TWO digits.
  3. Find the nearest perfect square strictly LESS than the remaining number. This is the first part of your root.
  4. Multiply this root part by its next consecutive integer. If the remaining original number is GREATER than this product, pick the larger option (e.g., \`8\`). If smaller, pick the smaller option (\`2\`).
* **Cube Root (5 Seconds):**
  1. Look at the last digit (it maps perfectly 1-to-1! e.g., \`3\` $\\leftrightarrow$ \`7\`, \`2\` $\\leftrightarrow$ \`8\`, \`4\` $\\rightarrow$ \`4\`).
  2. Discard the last THREE digits.
  3. Find the nearest perfect cube strictly LESS than the remaining number. Combine the two!

### 💡 3. Decimal Point Rules & Nested Roots
* **Square Root Decimals:** Halve the number of decimal places. (e.g., 4 decimal places in \`0.0025\` $\\rightarrow$ 2 decimal places in root \`0.05\`).
* **Cube Root Decimals:** Divide the number of decimal places by 3.
* **Infinite Nested Additive Roots (\`√(n + √(n + ...))\`):**
  * Factor \`n\` into two consecutive integers \`x × (x+1)\`.
  * If it's **\`+\`**, the answer is the **larger** factor \`(x+1)\`.
  * If it's **\`-\`**, the answer is the **smaller** factor \`(x)\`.
* **Infinite Multiplicative Roots (\`√(n √(n √(n...)))\`):** The answer is simply **\`n\`**.`,
    questions: [
      {
        id: 'apt-root-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q1: [Number of Sweets in Rows = Number of Rows] Ramesh arranged his 17,424 chocolates such that there are as many rows as chocolates in each row. How many chocolates are in each row?',
        question: 'Ramesh arranged his exactly 17,424 chocolates in a perfect square grid, such that there are as many rows as there are chocolates in each row. How many chocolates did he place in each row?',
        options: [
          'A) 122',
          'B) 128',
          'C) 132',
          'D) 138'
        ],
        correctAnswer: 'C',
        explanation: 'We need the square root of 17424. 1) Number ends in 4, so root ends in 2 or 8. 2) Discard last two digits (24). Remaining is 174. 3) Perfect square less than 174 is 169 (which is 13^2). So root is 132 or 138. 4) Multiply 13 × 14 = 182. Since 174 < 182, we pick the smaller option: 132.'
      },
      {
        id: 'apt-root-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Multiplier for Perfect Square] What least number should be multiplied with 384 to make it a perfect square?',
        question: 'What is the least possible positive integer that must be multiplied with exactly 384 to make the resulting product a perfect square?',
        options: [
          'A) 2',
          'B) 3',
          'C) 6',
          'D) 8'
        ],
        correctAnswer: 'C',
        explanation: 'Find the prime factorization of 384: 384 = 2 × 192 = 2^2 × 96 = 2^3 × 48 = 2^4 × 24 = 2^5 × 12 = 2^6 × 6 = 2^7 × 3. Regroup into squares: (2^6) × 2 × 3. The unpaired factors are 2 and 3. To make it a perfect square, we must multiply by 2 × 3 = 6.'
      },
      {
        id: 'apt-root-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Decimal Square Root Summation] If √5625 = 75, evaluate √5625 + √56.25 + √0.5625.',
        question: 'Given that the square root of exactly 5625 is 75. What is the exact value of the sum: √5625 + √56.25 + √0.5625?',
        options: [
          'A) 82.50',
          'B) 83.25',
          'C) 83.75',
          'D) 84.25'
        ],
        correctAnswer: 'B',
        explanation: '1) √5625 = 75. 2) For √56.25, there are 2 decimal places. The root has 2/2 = 1 decimal place. So √56.25 = 7.5. 3) For √0.5625, there are 4 decimal places. The root has 4/2 = 2 decimal places. So √0.5625 = 0.75. 4) Sum = 75 + 7.5 + 0.75 = 82.5 + 0.75 = 83.25.'
      },
      {
        id: 'apt-root-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q4: [Infinite Additive Radicals] Find the value of √(56 + √(56 + √(56 + ... to infinity))).',
        question: 'What is the exact positive numerical value of the infinite nested radical expression:\n√(56 + √(56 + √(56 + ... to infinity)))?',
        options: [
          'A) 6',
          'B) 7',
          'C) 8',
          'D) 9'
        ],
        correctAnswer: 'C',
        explanation: 'Factor 56 into two consecutive integers: 56 = 7 × 8. Since the expression uses a "+" sign, the value converges to the LARGER factor, which is 8.'
      },
      {
        id: 'apt-root-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Nested Square and Sixth Roots] What is the exact value of the 6th root of 0.004096?',
        question: 'What is the exact numerical value of the 6th root of exactly 0.004096?',
        options: [
          'A) 0.04',
          'B) 0.16',
          'C) 0.2',
          'D) 0.4'
        ],
        correctAnswer: 'D',
        explanation: 'The 6th root can be evaluated as the square root of the cube root. 1) First find the cube root of 0.004096. Ignore decimals: Cube root of 4096 is 16 (since 16^3 = 4096). There are 6 decimal places, so the cube root has 6/3 = 2 decimal places = 0.16. 2) Now find the square root of 0.16. Ignore decimals: square root of 16 is 4. There are 2 decimal places, so the square root has 2/2 = 1 decimal place = 0.4.'
      },
      {
        id: 'apt-root-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Rationalizing Multi-Term Denominator] Evaluate 1 / (√25 - √18).',
        question: 'Rationalize the denominator to find the simplified exact value of the expression:\n1 / (√25 - √18)',
        options: [
          'A) (5 + 3√2) / 7',
          'B) (5 - 3√2) / 7',
          'C) (5 + 2√3) / 7',
          'D) (25 + 3√2) / 7'
        ],
        correctAnswer: 'A',
        explanation: 'Multiply top and bottom by the conjugate (√25 + √18): [1 × (√25 + √18)] / [(√25 - √18)(√25 + √18)]. Denominator becomes 25 - 18 = 7. Numerator is √25 + √18 = 5 + 3√2. Thus, the exact value is (5 + 3√2) / 7.'
      },
      {
        id: 'apt-root-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Algebraic Identities with Squares] The square of the difference between two numbers is 9. Sum of their squares is 225. Find their product.',
        question: 'The square of the difference between two positive numbers is exactly 9, while the sum of the squares of those same two numbers is exactly 225. What is the product of the two numbers?',
        options: [
          'A) 54',
          'B) 81',
          'C) 108',
          'D) 112'
        ],
        correctAnswer: 'C',
        explanation: 'Given: (a - b)^2 = 9 and a^2 + b^2 = 225. We know (a - b)^2 = a^2 + b^2 - 2ab. Substitute the known values: 9 = 225 - 2ab => 2ab = 225 - 9 = 216 => ab = 108.'
      },
      {
        id: 'apt-root-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Multiplier for Perfect Cube] What is the smallest number with which 5400 must be multiplied so the product is a perfect cube?',
        question: 'What is the strictly smallest positive integer with which exactly 5400 must be multiplied so that the resulting product becomes a perfect cube?',
        options: [
          'A) 2',
          'B) 5',
          'C) 10',
          'D) 25'
        ],
        correctAnswer: 'B',
        explanation: 'Find the prime factorization of 5400. 5400 = 54 × 100 = (2 × 3^3) × (2^2 × 5^2) = 2^3 × 3^3 × 5^2. Here, 2^3 and 3^3 are already perfect cubes. However, 5^2 needs one more factor of 5 to become 5^3. Therefore, the number must be multiplied by 5.'
      },
      {
        id: 'apt-root-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Cube Root of Small Decimal Product] Find the value of ∛0.000027 × 0.008.',
        question: 'What is the exact numerical value of the expression:\n∛(0.000027 × 0.008)?',
        options: [
          'A) 0.006',
          'B) 0.06',
          'C) 0.0006',
          'D) 0.6'
        ],
        correctAnswer: 'A',
        explanation: 'First, find the cube roots individually. ∛0.000027: ignore decimals, ∛27 = 3. There are 6 decimal places, so root has 6/3 = 2 places -> 0.03. ∛0.008: ∛8 = 2. There are 3 decimal places, so root has 3/3 = 1 place -> 0.2. Now multiply the two roots: 0.03 × 0.2 = 0.006.'
      },
      {
        id: 'apt-root-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Comparing Irrational Powers] Which is greatest among 2√2, √7, 2√3, √5?',
        question: 'Which of the following irrational expressions has the strictly GREATEST numerical value?',
        options: [
          'A) 2√2',
          'B) √7',
          'C) 2√3',
          'D) √5'
        ],
        correctAnswer: 'C',
        explanation: 'Move all coefficients inside the square root to compare pure radical values. 1) 2√2 = √(2^2 × 2) = √8. 2) √7 is just √7. 3) 2√3 = √(2^2 × 3) = √12. 4) √5 is just √5. Comparing √8, √7, √12, and √5, the greatest value is √12, which corresponds to 2√3.'
      },
      {
        id: 'apt-root-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q11: [Algebraic Rearrangement with Negative Exponent] What should come in place of ? in 90 / ? = √(64/729)^(-1/3).',
        question: 'What exact numerical value should come in place of the question mark (?) in the following equation:\n90 / (?) = [ √(64 / 729) ]^(-1/3)',
        options: [
          'A) 30',
          'B) 40',
          'C) 60',
          'D) 90'
        ],
        correctAnswer: 'C',
        explanation: '1) The RHS is [(64/729)^(1/2)]^(-1/3) = (64/729)^(-1/6). 2) Flip the fraction to remove the negative sign: (729/64)^(1/6). 3) This is the 6th root of 729/64. Since 3^6 = 729 and 2^6 = 64, the 6th root is exactly 3/2. 4) The equation becomes 90 / (?) = 3/2 => 3 × (?) = 180 => (?) = 60.'
      },
      {
        id: 'apt-root-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Square Root of a Large Number] Find the square root of 64009.',
        question: 'Using the unit-digit and proximity estimation method, find the exact square root of exactly 64,009.',
        options: [
          'A) 243',
          'B) 253',
          'C) 263',
          'D) 273'
        ],
        correctAnswer: 'B',
        explanation: '1) Number ends in 9, so the root ends in 3 or 7. 2) Discard last two digits (09). Remaining is 640. 3) Nearest perfect square strictly less than 640 is 625 (which is 25^2). So root is 253 or 257. 4) Multiply 25 × 26 = 650. Since 640 < 650, pick the smaller option: 253.'
      },
      {
        id: 'apt-root-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Cube Root of Large Number] Find the cube root of 185193.',
        question: 'Using the unit-digit mapping method, find the exact cube root of exactly 185,193.',
        options: [
          'A) 47',
          'B) 53',
          'C) 57',
          'D) 63'
        ],
        correctAnswer: 'C',
        explanation: '1) Last digit is 3. The only digit whose cube ends in 3 is 7 (since 7^3 = 343). So the root ends in 7. 2) Discard the last three digits (193). Remaining is 185. 3) Perfect cube less than 185 is 125 (which is 5^3). 4) Combine them: 57.'
      },
      {
        id: 'apt-root-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Complex Radical Subtraction] Evaluate √0.01 + √0.81 + √1.21 + √0.0009.',
        question: 'Evaluate the exact numerical value of the following sum of square roots:\n√0.01 + √0.81 + √1.21 + √0.0009',
        options: [
          'A) 2.03',
          'B) 2.10',
          'C) 2.13',
          'D) 2.16'
        ],
        correctAnswer: 'C',
        explanation: 'Compute each root separately: 1) √0.01 = 0.1. 2) √0.81 = 0.9. 3) √1.21 = 1.1. 4) √0.0009 = 0.03. Sum = 0.1 + 0.9 + 1.1 + 0.03 = 2.1 + 0.03 = 2.13.'
      },
      {
        id: 'apt-root-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Original Number from Squares Difference] The difference between the squares of two consecutive even integers is 84. Find the sum of the integers.',
        question: 'The absolute difference between the squares of two strictly consecutive positive even integers is exactly 84. What is the sum of these two even integers?',
        options: [
          'A) 38',
          'B) 42',
          'C) 46',
          'D) 50'
        ],
        correctAnswer: 'B',
        explanation: 'Let the consecutive even integers be x and x+2. Equation: (x+2)^2 - x^2 = 84 => (x^2 + 4x + 4) - x^2 = 84 => 4x + 4 = 84 => 4x = 80 => x = 20. The integers are 20 and 22. Their sum is 20 + 22 = 42.'
      },
      {
        id: 'apt-root-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Perfect Square Condition] What is the smallest positive integer n such that 1575 × n is a perfect square?',
        question: 'What is the strictly smallest positive integer n such that the product exactly 1575 × n becomes a perfect square?',
        options: [
          'A) 3',
          'B) 5',
          'C) 7',
          'D) 15'
        ],
        correctAnswer: 'C',
        explanation: 'Prime factorization of 1575: 1575 = 25 × 63 = 5^2 × 9 × 7 = 5^2 × 3^2 × 7. The factors 5^2 and 3^2 are already perfect squares. The factor 7 is unpaired (power of 1). To make the entire product a perfect square, we must multiply by an additional 7.'
      },
      {
        id: 'apt-root-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Square Root of Rational Fraction] Evaluate √(1 9/16).',
        question: 'Evaluate the exact numerical value of the square root of the mixed fraction 1 9/16:',
        options: [
          'A) 1 1/4',
          'B) 1 3/4',
          'C) 1 1/2',
          'D) 1 1/8'
        ],
        correctAnswer: 'A',
        explanation: 'First convert the mixed fraction to an improper fraction: 1 9/16 = (16×1 + 9) / 16 = 25/16. Then take the square root of the numerator and denominator independently: √(25/16) = √25 / √16 = 5 / 4. Convert back to a mixed fraction: 5/4 = 1 1/4.'
      },
      {
        id: 'apt-root-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Algebraic Nested Square Roots] Evaluate √ (10 + √ (25 + √ (108 + √ 169) ) ).',
        question: 'Evaluate the exact positive numerical value of the finite nested radical expression:\n√ ( 10 + √ ( 25 + √ ( 108 + √169 ) ) )',
        options: [
          'A) 3',
          'B) 4',
          'C) 5',
          'D) 6'
        ],
        correctAnswer: 'B',
        explanation: 'Solve from the innermost square root outwards. 1) Inner: √169 = 13. 2) Next: √(108 + 13) = √121 = 11. 3) Next: √(25 + 11) = √36 = 6. 4) Outermost: √(10 + 6) = √16 = 4.'
      },
      {
        id: 'apt-root-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Cube Root Arithmetic] Find the value of ∛( -216 / 42875 ).',
        question: 'What is the exact fractional value of the cube root of (-216 / 42875)?',
        options: [
          'A) -6 / 25',
          'B) -6 / 35',
          'C) -8 / 35',
          'D) -8 / 25'
        ],
        correctAnswer: 'B',
        explanation: 'The cube root of a negative number is negative. 1) Numerator: ∛216 = 6 (since 6^3 = 216). 2) Denominator: ∛42875. Number ends in 5, so root ends in 5. Discard last three digits (875), leaving 42. Nearest perfect cube less than 42 is 27 (3^3). Combine to get 35. 3) Result is exactly -6 / 35.'
      },
      {
        id: 'apt-root-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Infinite Subtractive Radicals] Find the value of √(72 - √(72 - √(72 - ... to infinity))).',
        question: 'What is the exact positive numerical value of the infinite nested subtractive radical expression:\n√(72 - √(72 - √(72 - ... to infinity)))?',
        options: [
          'A) 7',
          'B) 8',
          'C) 9',
          'D) 12'
        ],
        correctAnswer: 'B',
        explanation: 'Factor 72 into two consecutive integers: 72 = 8 × 9. Since the expression uses a "-" (minus) sign, the series converges exactly to the SMALLER factor, which is 8.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 24: AVERAGES (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 24,
    slug: 'aptitude-quant-averages',
    title: 'Averages',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 50,
    video_url: 'http://www.youtube.com/watch?v=rhSxQ4ieAYc',
    video_title: 'Averages - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Calculate overlapping sets, weighted averages of mixed groups, cricket innings math, and deduction shortcuts for items replaced or omitted.',
    summary_markdown: `### 📌 1. The Core Average Formula
* **\`Average = (Sum of all observations) / (Total number of observations)\`**
* **The "Total Sum" Rule:** Over 80% of average problems are solved simply by calculating the total sum!
  * **\`Total Sum = Average × Total number of observations\`**

### 💡 2. High-Yield Placement Shortcuts
* **Replacement / Change in Average:**
  * When a new item replaces an old item, causing the average to increase by \`x\` units across \`n\` items:
  * **\`Weight of New Item = Weight of Old Item + (n × x)\`**
  * If the average decreases, subtract \`(n × x)\` instead.
* **Cricket Innings Problem:**
  * If a batsman plays his \`n\`-th innings and his average increases by \`x\`:
  * **\`New Average = Runs scored in n-th inning - (n - 1) × x\`**
* **Overlapping Sets:**
  * If the average of \`N\` items is given, and the average of the first \`k\` items and the last \`m\` items are given (where \`k + m > N\`), there is an overlap.
  * To find the overlapping item: Add the total sums of the two sub-groups and subtract the total sum of the entire group.

### 💡 3. Weighted Averages & Age Shifts
* **Age Shifts Over Time:** If the average age of a group of \`N\` people today is \`A\`, their average age \`K\` years ago was exactly **\`A - K\`**. Their average age \`K\` years in the future will be exactly **\`A + K\`**.
* **Birth of a Child:** When tracing back to the birth of a child, remember the child's age was 0. Exclude the child from the denominator when calculating the average age "at the time of birth".`,
    questions: [
      {
        id: 'apt-avg-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Missing Day Expenditure] Vijay\'s 4-day average expenditure is ₹90. His expenses for the first 3 days are ₹100, ₹125, and ₹85. Find the 4th day\'s expense.',
        question: 'Vijay\'s average daily expenditure for exactly 4 days is ₹90. If his actual expenditures for the first 3 days are exactly ₹100, ₹125, and ₹85 respectively, what is his exact expenditure on the 4th day?',
        options: [
          'A) ₹40',
          'B) ₹50',
          'C) ₹60',
          'D) ₹70'
        ],
        correctAnswer: 'B',
        explanation: 'Total expenditure for 4 days = Average × Number of days = 90 × 4 = 360. Sum of the first 3 days\' expenditure = 100 + 125 + 85 = 310. Expenditure on the 4th day = Total sum - Sum of first 3 days = 360 - 310 = ₹50.'
      },
      {
        id: 'apt-avg-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Weighted Average of Goods] Ajay buys 30 erasers at ₹3 each, 35 chocolates at ₹10 each, and 25 clips at ₹4 each. Average price of all goods?',
        question: 'Ajay buys 30 erasers for ₹3 each, 35 chocolates for ₹10 each, and 25 clips at the rate of ₹4 each. What is the exact average price of all the goods bought by Ajay?',
        options: [
          'A) ₹5.50',
          'B) ₹6.00',
          'C) ₹6.50',
          'D) ₹7.00'
        ],
        correctAnswer: 'B',
        explanation: 'Total number of items = 30 + 35 + 25 = 90 items. Total cost = (30 × 3) + (35 × 10) + (25 × 4) = 90 + 350 + 100 = ₹540. Average price = Total Cost / Total Items = 540 / 90 = ₹6.00.'
      },
      {
        id: 'apt-avg-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Finding Sub-group Average] Out of 20 cycles sold for ₹3,00,000, the average cost of 12 cycles is ₹18,000. Find the average cost of the remaining cycles.',
        question: 'Out of 20 cycles sold by Ajay for a total of ₹3,00,000, the exact average cost of 12 of those cycles is ₹18,000. What is the average cost of the remaining 8 cycles?',
        options: [
          'A) ₹10,000',
          'B) ₹10,500',
          'C) ₹11,000',
          'D) ₹11,500'
        ],
        correctAnswer: 'B',
        explanation: 'Total sum for all 20 cycles = ₹3,00,000. Total sum for the first 12 cycles = 12 × 18,000 = ₹2,16,000. Total sum for the remaining 8 cycles = 3,00,000 - 2,16,000 = ₹84,000. Average of the remaining 8 cycles = 84,000 / 8 = ₹10,500.'
      },
      {
        id: 'apt-avg-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Excluding an Item from Average] Average salary of 11 employees and boss is ₹18,000. Without the boss, the average reduces by ₹1,000. Boss\'s salary?',
        question: 'The average salary of 11 employees and their boss (12 people total) is ₹18,000. When the salary of the boss is completely excluded from the calculation, the average salary of the remaining 11 employees strictly reduces by ₹1,000. What is the exact salary of the boss?',
        options: [
          'A) ₹28,000',
          'B) ₹29,000',
          'C) ₹30,000',
          'D) ₹31,000'
        ],
        correctAnswer: 'B',
        explanation: 'Total salary of 12 people = 12 × 18,000 = ₹2,16,000. Without the boss, the new average is 18,000 - 1,000 = ₹17,000. Total salary of the 11 employees = 11 × 17,000 = ₹1,87,000. Salary of the boss = 2,16,000 - 1,87,000 = ₹29,000. (Shortcut: Boss\'s salary = Old Average + (Number of remaining people × Change) = 18000 + (11 × 1000) = 29000).'
      },
      {
        id: 'apt-avg-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Combining Two Groups] Average age of 5 people is 42. Another group of 8 people has average age 81. Find combined average.',
        question: 'The exact average age of a group of 5 people is 42 years. Another completely separate group of 8 people has an exact average age of 81 years. When both groups are fully combined, what is the exact average age of all the people?',
        options: [
          'A) 61 years',
          'B) 64 years',
          'C) 66 years',
          'D) 68 years'
        ],
        correctAnswer: 'C',
        explanation: 'Total sum of ages for the 1st group = 5 × 42 = 210. Total sum of ages for the 2nd group = 8 × 81 = 648. Combined total sum = 210 + 648 = 858. Total number of people = 5 + 8 = 13. Combined average = 858 / 13 = 66 years.'
      },
      {
        id: 'apt-avg-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Replacing an Item Shortcut] Average weight of 3 boxes increases by 5 kg when a box weighing 89 kg is replaced. Weight of the new box?',
        question: 'There are 3 boxes with a certain average weight. When exactly one box which weighs 89 kg is completely replaced by a brand new box, the overall average weight of the 3 boxes strictly increases by 5 kg. How much does the new box weigh?',
        options: [
          'A) 94 kg',
          'B) 104 kg',
          'C) 103 kg',
          'D) 108 kg'
        ],
        correctAnswer: 'B',
        explanation: 'Since the average increases by 5 kg across all 3 boxes, the total weight must have increased by 3 × 5 = 15 kg. This means the new box must bring enough weight to replace the old box (89 kg) PLUS provide the extra 15 kg. Weight of new box = 89 + 15 = 104 kg.'
      },
      {
        id: 'apt-avg-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Deducing Total from Ratios] Ratio of Raju\'s age to his twin grandson is 11:2. Average age of Raju and both grandsons is 50. Raju\'s age?',
        question: 'The ratio of Raju\'s age to the age of one of his twin grandsons is exactly 11 : 2. If the average age of Raju and BOTH of his twin grandsons together is exactly 50 years, how old is Raju?',
        options: [
          'A) 100 years',
          'B) 110 years',
          'C) 120 years',
          'D) 130 years'
        ],
        correctAnswer: 'B',
        explanation: 'Since they are twins, both grandsons have the same age. Let their ages be 11k, 2k, and 2k. The total sum of their ages = 11k + 2k + 2k = 15k. The average age of the 3 people is 50, so their total sum is 3 × 50 = 150. Equating the sums: 15k = 150 => k = 10. Raju\'s age = 11k = 11 × 10 = 110 years.'
      },
      {
        id: 'apt-avg-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Increase in Average from Modified Innings] If Ajay scored 18 runs more in 3rd inning and 4 runs more in 7th, his average would increase by 2 (from 64 to 66). Number of innings?',
        question: 'Had Ajay scored exactly 18 runs more in his 3rd innings and 4 runs more in his 7th innings, his overall batting average would have strictly increased from 64 runs to 66 runs. Exactly how many total innings did he play?',
        options: [
          'A) 10',
          'B) 11',
          'C) 12',
          'D) 13'
        ],
        correctAnswer: 'B',
        explanation: 'The total increase in runs is 18 + 4 = 22 runs. This extra 22 runs caused the overall average of all \'N\' innings to increase by exactly 2 runs (from 64 to 66). Since Total Increase = Change in Average × N, we have 22 = 2 × N => N = 22 / 2 = 11 innings.'
      },
      {
        id: 'apt-avg-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q9: [Excluding Extremes] Oldest and youngest have 100 yrs diff. Without them, average of remaining 40 is 28. Overall average of 42 people is 30. Oldest person\'s age?',
        question: 'In a specific group of people, the absolute age difference between the oldest and the youngest person is exactly 100 years. If these two extreme individuals are left out, the exact average age of the remaining 40 people is 28. The overall average age of the entire group being 30, how old is the eldest person?',
        options: [
          'A) 110 years',
          'B) 115 years',
          'C) 120 years',
          'D) 125 years'
        ],
        correctAnswer: 'C',
        explanation: '1) Total people = 42. Overall total age = 42 × 30 = 1260. 2) Total age of the middle 40 people = 40 × 28 = 1120. 3) Thus, Sum of the ages of Oldest (O) and Youngest (Y) = 1260 - 1120 = 140. 4) We are given O - Y = 100. Adding both equations: 2O = 240 => O = 120. The oldest person is 120 years old.'
      },
      {
        id: 'apt-avg-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Replacing 3 Innings] Average of 11 innings increases by 2 when 3 innings (32, 33, 34) are replaced by 3 new ones. Find average of the 3 new innings.',
        question: 'A batsman played exactly 11 innings and holds a certain average. This average strictly increases by 2 runs when exactly three of his past innings (scores of 32, 33, and 34) are completely replaced by three brand new innings. What is the exact average of these three new innings?',
        options: [
          'A) 39.00',
          'B) 40.33',
          'C) 41.00',
          'D) 42.50'
        ],
        correctAnswer: 'B',
        explanation: 'Since the average of all 11 innings increases by 2 runs, the total sum of runs must have increased by 11 × 2 = 22 runs. This means the 3 new innings must cover the runs of the 3 old innings PLUS provide the extra 22 runs. Sum of 3 old innings = 32 + 33 + 34 = 99. Sum of 3 new innings = 99 + 22 = 121. The average of the 3 new innings is 121 / 3 = 40.33 runs.'
      },
      {
        id: 'apt-avg-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Overlapping Middle Student] Average of 15 students is 15. Average of first 5 is 14, and last 9 is 16. What is the age of the 6th student?',
        question: 'The average age of 15 students in a class is exactly 15 years. Out of these, the average age of the first 5 students is exactly 14 years, and that of the last 9 students is exactly 16 years. What is the exact age of the 6th student?',
        options: [
          'A) 11 years',
          'B) 14 years',
          'C) 15 years',
          'D) 16 years'
        ],
        correctAnswer: 'A',
        explanation: 'Total sum of 15 students = 15 × 15 = 225. Total sum of the first 5 students = 5 × 14 = 70. Total sum of the last 9 students = 9 × 16 = 144. Age of the 6th student = Total sum - (Sum of first 5 + Sum of last 9) = 225 - (70 + 144) = 225 - 214 = 11 years.'
      },
      {
        id: 'apt-avg-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Increase in Average After 17th Inning] A batsman in his 17th innings makes a score of 85, and thereby increases his average by 3. What is his average after the 17th innings?',
        question: 'A professional batsman plays his 17th innings and makes a score of exactly 85 runs, thereby strictly increasing his overall career average by 3 runs. What is his exact average after the 17th innings?',
        options: [
          'A) 34',
          'B) 35',
          'C) 36',
          'D) 37'
        ],
        correctAnswer: 'D',
        explanation: 'Let the average after 16 innings be x. Total runs before 17th inning = 16x. New average = x + 3. Total runs after 17th inning = 17(x + 3). The runs scored in the 17th inning = 17(x + 3) - 16x = 85 => 17x + 51 - 16x = 85 => x = 85 - 51 = 34. The NEW average after the 17th innings = x + 3 = 34 + 3 = 37. (Shortcut: New Average = Score - (n - 1) × Increase = 85 - 16 × 3 = 85 - 48 = 37).'
      },
      {
        id: 'apt-avg-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Average Error Correction] The average of 50 numbers is 38. If two numbers, 45 and 55, are discarded, find the average of the remaining numbers.',
        question: 'The average of exactly 50 numbers is calculated to be 38. If two specific numbers, namely 45 and 55, are completely discarded from the set, what will be the exact average of the remaining numbers?',
        options: [
          'A) 36.50',
          'B) 37.00',
          'C) 37.50',
          'D) 38.00'
        ],
        correctAnswer: 'C',
        explanation: 'Total sum of 50 numbers = 50 × 38 = 1900. Sum of the two discarded numbers = 45 + 55 = 100. New sum after discarding = 1900 - 100 = 1800. Remaining numbers = 50 - 2 = 48. New average = 1800 / 48. 1800 / 12 = 150; 150 / 4 = 37.5. Thus, the new average is 37.5.'
      },
      {
        id: 'apt-avg-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Average of Double Overlapping Set] Average of 11 results is 50. Average of first 6 is 49, last 6 is 52. Find the 6th result.',
        question: 'The calculated average of exactly 11 numeric results is 50. If the average of the first 6 results is exactly 49, and the average of the last 6 results is exactly 52, what is the exact value of the 6th result?',
        options: [
          'A) 48',
          'B) 50',
          'C) 56',
          'D) 60'
        ],
        correctAnswer: 'C',
        explanation: 'Total sum of 11 results = 11 × 50 = 550. Total sum of the first 6 results = 6 × 49 = 294. Total sum of the last 6 results = 6 × 52 = 312. Since the 6th result is counted in both the first 6 and the last 6, adding them together counts the 6th result twice. The 6th result = (Sum of first 6 + Sum of last 6) - Total sum = (294 + 312) - 550 = 606 - 550 = 56.'
      },
      {
        id: 'apt-avg-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Average of Consecutive Odd Numbers] The average of 9 consecutive odd numbers is 53. The least odd number is:',
        question: 'The exact average of 9 consecutive odd positive integers is exactly 53. What is the value of the strictly least odd number in this sequence?',
        options: [
          'A) 41',
          'B) 43',
          'C) 45',
          'D) 47'
        ],
        correctAnswer: 'C',
        explanation: 'The average of an odd number of consecutive integers is always the middle number. So the 5th number in the sequence is 53. Since they are consecutive odd numbers, they step by 2. The sequence going backwards is: 4th = 51, 3rd = 49, 2nd = 47, 1st = 45. The least odd number is 45.'
      },
      {
        id: 'apt-avg-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Average Money Contribution] 3 boys have average ₹400. 4 girls have average ₹500. Average of all 7?',
        question: 'A group of exactly 3 boys possesses an average amount of ₹400 each. Another group of exactly 4 girls possesses an average amount of ₹500 each. If both groups are combined, what is the exact average amount possessed by all 7 individuals?',
        options: [
          'A) ₹450.00',
          'B) ₹457.14',
          'C) ₹460.00',
          'D) ₹475.50'
        ],
        correctAnswer: 'B',
        explanation: 'Total money with boys = 3 × 400 = 1200. Total money with girls = 4 × 500 = 2000. Total money combined = 1200 + 2000 = 3200. Combined average = 3200 / 7 ≈ 457.14.'
      },
      {
        id: 'apt-avg-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Class Average Decrease from New Joiner] Average age of 8 men increases by 2 years when two women replace two men aged 21 and 23. Average age of the two women?',
        question: 'The exact average age of a group of 8 men strictly increases by 2 years when exactly two women completely replace two men whose ages are 21 and 23 years respectively. What is the exact average age of the two incoming women?',
        options: [
          'A) 25 years',
          'B) 30 years',
          'C) 32 years',
          'D) 34 years'
        ],
        correctAnswer: 'B',
        explanation: 'For the average of 8 people to increase by 2 years, the total sum of their ages must increase by 8 × 2 = 16 years. Therefore, the two incoming women must replace the exact age of the leaving men PLUS bring an additional 16 years. Sum of leaving men = 21 + 23 = 44. Sum of the two women = 44 + 16 = 60 years. The average age of the two women is 60 / 2 = 30 years.'
      },
      {
        id: 'apt-avg-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Typo Error in Average Calculation] Average of 20 numbers is 0. How many of them may be greater than zero, at most?',
        question: 'The mathematically calculated average of a specific set of exactly 20 real numbers is strictly 0. Exactly how many of these numbers may be strictly greater than zero, AT MOST?',
        options: [
          'A) 0',
          'B) 10',
          'C) 19',
          'D) 20'
        ],
        correctAnswer: 'C',
        explanation: 'For the average of 20 numbers to be 0, their total sum must be 0. We can have 19 numbers that are huge positive integers (greater than zero), as long as the 20th number is a massive negative integer that perfectly cancels out the sum of the other 19. Therefore, at most 19 numbers can be greater than zero.'
      },
      {
        id: 'apt-avg-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Weighted Mixture of Students] In a class, average weight of boys is 50 kg and girls is 40 kg. Overall average is 46 kg. Ratio of boys to girls?',
        question: 'In a class, the exact average weight of all the boys is 50 kg, and the exact average weight of all the girls is 40 kg. If the overall average weight of the entire class is 46 kg, what is the exact ratio of the number of boys to the number of girls?',
        options: [
          'A) 2 : 3',
          'B) 3 : 2',
          'C) 4 : 5',
          'D) 5 : 4'
        ],
        correctAnswer: 'B',
        explanation: 'Apply the Rule of Alligation! Mean weight = 46. Boys weight = 50. Girls weight = 40. Boys : Girls = (46 - 40) : (50 - 46) = 6 : 4 = 3 : 2. (Or algebraically: 50B + 40G = 46(B + G) => 50B + 40G = 46B + 46G => 4B = 6G => B/G = 6/4 = 3/2).'
      },
      {
        id: 'apt-avg-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Days of Week Temperature Average] Average temp from Mon to Wed is 37C, and Tue to Thu is 34C. If Thu temp is 4/5 of Mon temp, find Thu temp.',
        question: 'The average recorded temperature from Monday to Wednesday is exactly 37°C, and the average temperature from Tuesday to Thursday is exactly 34°C. If the temperature on Thursday is exactly 4/5 of the temperature on Monday, what is the temperature on Thursday?',
        options: [
          'A) 32°C',
          'B) 34°C',
          'C) 36°C',
          'D) 38°C'
        ],
        correctAnswer: 'C',
        explanation: '1) Sum(Mon, Tue, Wed) = 3 × 37 = 111. 2) Sum(Tue, Wed, Thu) = 3 × 34 = 102. 3) Subtracting the two equations gives: Mon - Thu = 111 - 102 = 9. 4) We are given Thu = (4/5) × Mon => Mon = (5/4) × Thu. 5) Substitute Mon: (5/4)Thu - Thu = 9 => (1/4)Thu = 9 => Thu = 36°C.'
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

async function seedAptitudeBatch8() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 8 (TOPICS 22 TO 24) ===\n');

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

    // 2. Upsert Topics 22 to 24
    for (const item of aptitudeBatch8) {
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
      await client.query(`UPDATE tracks SET total_topics = 24, estimated_hours = 48 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 24, estimated_hours = 48');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 24 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 24');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 8 (Topics 22 to 24) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch8();
