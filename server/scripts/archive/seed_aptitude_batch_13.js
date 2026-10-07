const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch13 = [
  // ===========================================================================
  // TOPIC 37: INSTALLMENTS - COMPOUND INTEREST (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 37,
    slug: 'aptitude-quant-installments-compound-interest',
    title: 'Installments - Compound Interest',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 56,
    video_url: 'http://www.youtube.com/watch?v=xxWwphuwOBs',
    video_title: 'Installments - Shortcuts & Tricks for 2026 - 2027 Placement Tests, Job Interviews & Exams',
    short_description: 'Master EMI calculations under Compound Interest using the proportional growth factor method, avoiding complex formula memorization.',
    summary_markdown: `### 📌 1. The Core EMI Concept (Compound Interest)
* When repaying a loan in equal installments, each payment effectively repays a portion of the principal along with the accumulated interest on that specific portion.
* Instead of memorizing the complex standard formula \`P = x/(1+R/100) + x/(1+R/100)^2 + ...\`, use the **Growth Factor Ratio Method**.

### 💡 2. The Growth Factor Ratio Method (No-Formula Shortcut)
* **Step 1:** Find the Growth Factor. For a 10% rate, ₹10 grows to ₹11. Growth Factor = \`11/10\`.
* **Step 2:** Write out the powers for the number of years. For 2 years, write \`10 → 11\` and \`100 → 121\`.
* **Step 3:** Make the final values (installments) equal. Multiply the first equation by 11: \`110 → 121\` and \`100 → 121\`.
* **Step 4:** Sum the left side to find the "Reference Loan". \`110 + 100 = 210\`. 
  * *Meaning:* A loan of **₹210** requires two equal installments of **₹121** each.
* **Step 5:** Scale up! If your actual loan is ₹420 (which is 2 × 210), your actual installment is simply \`121 × 2 = ₹242\`.

### 💡 3. Important Concepts
* **Down Payment:** Always subtract the down payment from the total cash price *before* applying installment logic. The remaining amount is your True Principal (Loan).
* **Semi-Annual Compounding:** If installments are paid half-yearly, halve the rate (\`R/2\`) and double the time periods (\`2N\`) before calculating the growth factor.
* **Total Interest Paid:** \`Total Interest = (Number of Installments × Value of 1 Installment) - Loan Amount\`.`,
    questions: [
      {
        id: 'apt-ci-inst-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Standard 2-Year Installment] Rahul borrows ₹58,800 to be paid back in two equal annual installments at 10% p.a. compound interest. Value of each installment?',
        question: 'Rahul borrows a sum of ₹58,800 from a bank. This is to be completely paid back in exactly two equal annual installments. If the rate of interest is 10% per annum compounded annually, what is the exact value of each installment?',
        options: [
          'A) ₹30,000',
          'B) ₹32,480',
          'C) ₹33,880',
          'D) ₹35,280'
        ],
        correctAnswer: 'C',
        explanation: 'At 10% CI, the growth factor is 11/10. Year 1: 10 → 11. Year 2: 100 → 121. To equalize installments to 121, multiply Year 1 by 11: 110 → 121. Total reference loan = 110 + 100 = 210. Reference installment = 121. Actual loan is 58,800. Multiplier = 58800 / 210 = 280. Actual installment = 121 × 280 = ₹33,880.'
      },
      {
        id: 'apt-ci-inst-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [3-Year Installment with 20% Rate] A sum of ₹68,250 is borrowed at 20% p.a. CI and paid back in 3 equal annual installments. Amount of each installment?',
        question: 'A sum of ₹68,250 is borrowed at 20% per annum compound interest and paid back in exactly three equal annual installments. What is the exact mathematical amount of each installment?',
        options: [
          'A) ₹30,000',
          'B) ₹32,400',
          'C) ₹34,560',
          'D) ₹36,000'
        ],
        correctAnswer: 'B',
        explanation: 'At 20% CI, the growth factor is 6/5. Years 1, 2, 3: 5→6, 25→36, 125→216. Equalize to 216: multiply Y1 by 36 (180→216), Y2 by 6 (150→216), Y3 is 125→216. Reference loan = 180 + 150 + 125 = 455. Reference installment = 216. Actual loan = 68250. Multiplier = 68250 / 455 = 150. Actual installment = 216 × 150 = ₹32,400.'
      },
      {
        id: 'apt-ci-inst-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Finding Principal from Installment] A loan has to be returned in two equal annual installments of ₹44,100 each. If rate is 5% p.a. CI, find total interest paid.',
        question: 'A loan has to be returned in two equal annual installments, each of exactly ₹44,100. If the rate of interest is 5% per annum compounded annually, what is the exact total interest paid over the entire transaction?',
        options: [
          'A) ₹4,200',
          'B) ₹5,000',
          'C) ₹6,200',
          'D) ₹8,200'
        ],
        correctAnswer: 'C',
        explanation: 'At 5% CI, growth factor is 21/20. Y1: 20→21. Y2: 400→441. Equalize to 441: Y1 becomes 420→441. Reference loan = 420 + 400 = 820. Reference installment = 441. Actual installment = 44,100. Multiplier = 44100 / 441 = 100. Actual loan = 820 × 100 = 82,000. Total amount paid = 2 × 44,100 = 88,200. Total interest paid = 88,200 - 82,000 = ₹6,200.'
      },
      {
        id: 'apt-ci-inst-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Down Payment Deduction] A bike costs ₹79,860 cash. It can be bought with ₹60,000 down payment and 3 equal annual installments at 10% CI. Value of installment?',
        question: 'A bike can be bought for exactly ₹79,860 in cash, or by paying ₹60,000 as an immediate down payment and the remaining amount in exactly 3 equal annual installments at an interest rate of 10% per annum compounded annually. What will be the exact value of each installment?',
        options: [
          'A) ₹6,655',
          'B) ₹7,260',
          'C) ₹7,986',
          'D) ₹8,450'
        ],
        correctAnswer: 'C',
        explanation: 'Loan amount = Cash Price - Down Payment = 79860 - 60000 = 19,860. At 10% CI for 3 years, reference loan is 3310 for an installment of 1331. Actual loan is 19860. Multiplier = 19860 / 3310 = 6. Actual installment = 1331 × 6 = ₹7,986.'
      },
      {
        id: 'apt-ci-inst-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Semi-Annual Installments] Bike cash price is ₹73,490. Down payment is ₹23,840. The rest is paid in 3 equal HALF-YEARLY installments at 20% p.a. compounded semi-annually. Installment value?',
        question: 'Mohan can buy a bike for ₹73,490 in cash, or by paying ₹23,840 as down payment and the rest in exactly three equal half-yearly installments. If the interest rate charged is 20% per annum compounded semi-annually, what is the exact value of each half-yearly installment?',
        options: [
          'A) ₹18,500',
          'B) ₹19,965',
          'C) ₹21,200',
          'D) ₹23,840'
        ],
        correctAnswer: 'B',
        explanation: 'Loan = 73490 - 23840 = 49,650. Rate is 20% p.a. = 10% per half-year. Number of periods = 3 half-years. At 10% for 3 periods, reference loan is 3310 for an installment of 1331. Actual loan is 49650. Multiplier = 49650 / 3310 = 15. Actual installment = 1331 × 15 = ₹19,965.'
      },
      {
        id: 'apt-ci-inst-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Finding Principal from Total Interest Paid] A sum is paid back in two equal installments at 12.5% p.a. CI. If total interest paid is ₹7,800, find the principal.',
        question: 'Rea borrows a certain sum of money from the bank and promises to pay it back in exactly two equal annual installments at a rate of 12.5% per annum compounded annually. If she pays a total absolute interest of exactly ₹7,800, what was the original principal amount borrowed?',
        options: [
          'A) ₹36,400',
          'B) ₹38,600',
          'C) ₹40,800',
          'D) ₹44,800'
        ],
        correctAnswer: 'C',
        explanation: 'Rate = 12.5% = 1/8. Growth factor = 9/8. Y1: 8→9. Y2: 64→81. Equalize to 81: Y1 becomes 72→81. Reference loan = 72 + 64 = 136. Reference installment = 81. Total paid = 2 × 81 = 162. Reference interest = 162 - 136 = 26. Actual interest is 7800. Multiplier = 7800 / 26 = 300. Actual Principal = 136 × 300 = ₹40,800.'
      },
      {
        id: 'apt-ci-inst-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Quarterly Installments] A loan is paid in 2 equal quarterly installments at 40% p.a. compounded quarterly. If each installment is ₹14,520, find the principal.',
        question: 'A loan is paid back in exactly 2 equal quarterly installments at a nominal interest rate of 40% per annum compounded quarterly. If the exact mathematical value of each quarterly installment is ₹14,520, what was the original loan amount?',
        options: [
          'A) ₹25,200',
          'B) ₹26,000',
          'C) ₹26,400',
          'D) ₹27,500'
        ],
        correctAnswer: 'A',
        explanation: 'Nominal rate = 40% p.a. -> Quarterly rate = 10%. Growth factor = 11/10. Y1: 10→11. Y2: 100→121. Equalize: 110→121. Reference loan = 210. Reference installment = 121. Actual installment = 14520. Multiplier = 14520 / 121 = 120. Actual loan = 210 × 120 = ₹25,200.'
      },
      {
        id: 'apt-ci-inst-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Three Installments with 5% Rate] A man repays a loan of ₹25,220 in 3 equal annual installments at 5% p.a. compound interest. Find the value of each installment.',
        question: 'A man strictly borrows a loan of ₹25,220 and agrees to repay it in exactly 3 equal annual installments at 5% per annum compound interest. What is the exact mathematical value of each installment?',
        options: [
          'A) ₹8,820',
          'B) ₹9,261',
          'C) ₹9,600',
          'D) ₹10,500'
        ],
        correctAnswer: 'B',
        explanation: 'Rate = 5% = 1/20. Growth factor = 21/20. Powers: 20→21, 400→441, 8000→9261. Equalize to 9261: Y1 is 20×441=8820. Y2 is 400×21=8400. Y3 is 8000. Reference loan = 8820 + 8400 + 8000 = 25,220. Reference installment = 9261. Since the actual loan perfectly matches the reference loan (25220), the actual installment is exactly ₹9,261.'
      },
      {
        id: 'apt-ci-inst-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Difference in Total Payment Cash vs Installment] A TV costs ₹21,000 cash. If paid in 2 equal annual installments at 10% p.a. CI, how much extra is paid?',
        question: 'A smart TV is available for ₹21,000 in direct cash. A customer opts to buy it entirely on credit, paying it off in exactly 2 equal annual installments at 10% per annum compound interest. Exactly how much extra money (total interest) does the customer end up paying compared to the cash price?',
        options: [
          'A) ₹2,100',
          'B) ₹2,520',
          'C) ₹3,200',
          'D) ₹4,200'
        ],
        correctAnswer: 'C',
        explanation: 'For 10% CI over 2 years, reference loan is 210 for an installment of 121. Actual loan is 21000. Multiplier = 21000 / 210 = 100. Actual installment = 121 × 100 = 12,100. Total amount paid = 2 × 12100 = 24,200. Extra money paid = 24200 - 21000 = ₹3,200.'
      },
      {
        id: 'apt-ci-inst-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Non-Equal Installments] A loan of ₹8,000 is to be repaid in two annual installments. The second installment is twice the first. Rate is 20% p.a. CI. Find the first installment.',
        question: 'A loan of ₹8,000 is to be completely repaid in two annual installments at 20% per annum compound interest. The agreement dictates that the numerical value of the second installment must be exactly twice the value of the first installment. What is the exact value of the first installment?',
        options: [
          'A) ₹3,600',
          'B) ₹4,000',
          'C) ₹4,500',
          'D) ₹5,000'
        ],
        correctAnswer: 'A',
        explanation: 'Let first installment be x, second be 2x. Present value equation: 8000 = x / 1.2 + 2x / 1.44 = 5x/6 + 50x/36 = 80x/36 = 20x/9. 8000 = 20x / 9 => 20x = 72000 => x = ₹3,600.'
      },
      {
        id: 'apt-ci-inst-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Original Debt from Paid Installments] A man paid 3 equal annual installments of ₹10,648 each at 10% p.a. CI to clear his debt. Find the principal.',
        question: 'To completely clear a debt, a man pays exactly 3 equal annual installments of exactly ₹10,648 each. If the rate of interest charged was 10% per annum compounded annually, what was the exact original principal borrowed?',
        options: [
          'A) ₹26,480',
          'B) ₹27,000',
          'C) ₹28,500',
          'D) ₹30,000'
        ],
        correctAnswer: 'A',
        explanation: 'At 10% CI for 3 years, reference installment is 1331 for a loan of 3310. The actual installment is 10648. Multiplier = 10648 / 1331 = 8. Actual loan = 3310 × 8 = ₹26,480.'
      },
      {
        id: 'apt-ci-inst-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Two Installments with 15% Rate] A sum of ₹25,800 is borrowed at 15% p.a. CI. Paid back in 2 equal annual installments. Find installment.',
        question: 'A sum of exactly ₹25,800 is safely borrowed at 15% per annum compound interest. It is completely paid back in exactly 2 equal annual installments. What is the mathematical amount of each installment?',
        options: [
          'A) ₹15,870',
          'B) ₹16,000',
          'C) ₹17,192',
          'D) ₹18,000'
        ],
        correctAnswer: 'A',
        explanation: 'Rate = 15% = 3/20. Growth factor = 23/20. Y1: 20→23. Y2: 400→529. Equalize: Y1 becomes 460→529. Reference loan = 460 + 400 = 860. Reference installment = 529. Actual loan = 25800. Multiplier = 25800 / 860 = 30. Actual installment = 529 × 30 = ₹15,870.'
      },
      {
        id: 'apt-ci-inst-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Percentage of Loan as Installment] At 25% p.a. CI for 2 years, what approximate percentage of the principal is each installment?',
        question: 'If a loan is completely paid back in exactly 2 equal annual installments at an interest rate of 25% per annum compounded annually, each exact installment represents approximately what percentage of the original loan amount?',
        options: [
          'A) 55.5%',
          'B) 60.9%',
          'C) 62.5%',
          'D) 69.4%'
        ],
        correctAnswer: 'D',
        explanation: 'Rate = 25% = 1/4. Growth factor = 5/4. Y1: 4→5. Y2: 16→25. Equalize: Y1 becomes 20→25. Reference loan = 20 + 16 = 36. Reference installment = 25. Percentage = (Installment / Loan) × 100 = (25 / 36) × 100 = 2500 / 36 = 625 / 9 ≈ 69.44%.'
      },
      {
        id: 'apt-ci-inst-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Down Payment and Missing Principal] A phone is bought for ₹4,000 cash down payment and 2 equal annual installments of ₹5,760 each at 20% CI. Cash price?',
        question: 'A premium mobile phone is bought by paying exactly ₹4,000 as an immediate cash down payment, followed by exactly 2 equal annual installments of ₹5,760 each. If the rate of interest charged on the remaining balance is 20% per annum compounded annually, what is the true total cash price of the phone?',
        options: [
          'A) ₹12,000',
          'B) ₹12,800',
          'C) ₹13,000',
          'D) ₹14,000'
        ],
        correctAnswer: 'B',
        explanation: 'Rate = 20% = 1/5. Growth factor = 6/5. Reference loan for 2 years = (5/6) + (25/36) = 30/36 + 25/36 = 55/36 of installment. Here, installment is 5760. Loan = 5760 × (55/36). 5760 / 36 = 160. Loan = 160 × 55 = 8800. Cash Price = Down Payment + Loan = 4000 + 8800 = ₹12,800.'
      },
      {
        id: 'apt-ci-inst-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Rate given Loan and Installments] A loan of ₹6,800 is discharged in two equal annual installments of ₹4,050 each. Find the rate of interest compounded annually.',
        question: 'A loan of exactly ₹6,800 is completely discharged in exactly two equal annual installments of ₹4,050 each. What is the exact mathematical rate of interest per annum compounded annually?',
        options: [
          'A) 10.00%',
          'B) 12.50%',
          'C) 15.00%',
          'D) 20.00%'
        ],
        correctAnswer: 'B',
        explanation: 'Let R% be the rate and r = 1 + R/100. P = x/r + x/r^2 => 6800 = 4050/r + 4050/r^2. Divide by 50: 136 = 81/r + 81/r^2. Multiply by r^2: 136r^2 - 81r - 81 = 0. Solving this quadratic for positive r gives r = 9/8. Since r = 1 + R/100 = 9/8, R/100 = 1/8. Therefore, R = 12.5%.'
      },
      {
        id: 'apt-ci-inst-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Two Equal Installments Difference in Principal] ₹25,500 is borrowed at 4% CI to be repaid in two annual installments. Value of installment?',
        question: 'Exactly ₹25,500 is borrowed at 4% per annum compound interest and is to be entirely repaid in exactly two equal annual installments. What is the exact value of each installment?',
        options: [
          'A) ₹13,520',
          'B) ₹13,750',
          'C) ₹14,000',
          'D) ₹14,280'
        ],
        correctAnswer: 'A',
        explanation: 'Rate = 4% = 1/25. Growth factor = 26/25. Y1: 25→26. Y2: 625→676. Equalize: 650→676. Reference loan = 650 + 625 = 1275. Reference installment = 676. Actual loan = 25500. Multiplier = 25500 / 1275 = 20. Actual installment = 676 × 20 = ₹13,520.'
      },
      {
        id: 'apt-ci-inst-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Four Installments Calculation] A man borrows ₹16,400 at 5% CI p.a. to be paid in 4 equal annual installments. The closest installment value?',
        question: 'A man borrows exactly ₹16,400 at 5% per annum compound interest, completely payable in exactly 4 equal annual installments. What is the closest integer value of each installment?',
        options: [
          'A) ₹4,200',
          'B) ₹4,625',
          'C) ₹4,800',
          'D) ₹5,125'
        ],
        correctAnswer: 'B',
        explanation: 'Rate = 5% = 1/20. Growth factor = 21/20 = 1.05. Loan = x / 1.05 + x / 1.05^2 + x / 1.05^3 + x / 1.05^4 = x (0.95238 + 0.90703 + 0.86384 + 0.82270) = x (3.54595). 16400 = 3.54595x => x = 16400 / 3.54595 ≈ ₹4,625.'
      },
      {
        id: 'apt-ci-inst-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Interest Portion of First Installment] A loan is repaid in 2 equal installments of ₹1,452 each at 10% p.a. CI. How much of the FIRST installment is purely principal?',
        question: 'A loan is mathematically repaid in exactly 2 equal annual installments of exactly ₹1,452 each at 10% per annum compound interest. In the very first installment paid at the end of Year 1, exactly what absolute monetary amount is strictly applied towards reducing the Principal?',
        options: [
          'A) ₹1,200',
          'B) ₹1,320',
          'C) ₹1,350',
          'D) ₹1,452'
        ],
        correctAnswer: 'A',
        explanation: 'Total loan = 1452/1.1 + 1452/1.21 = 1320 + 1200 = 2520. At the end of Year 1, the total interest accrued on the entire 2520 loan is 10% of 2520 = ₹252. The first installment is ₹1,452. The amount applied to principal = Installment - Interest = 1452 - 252 = ₹1,200.'
      },
      {
        id: 'apt-ci-inst-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Difference Between Total Payment and Loan] Loan = ₹7,620. 3 equal installments at 16 2/3% p.a. CI. Extra amount paid?',
        question: 'A person borrows exactly ₹7,620 and completely repays it in exactly 3 equal annual installments at exactly 16 2/3 % per annum compound interest. Exactly how much total aggregate interest is paid over the life of the loan?',
        options: [
          'A) ₹2,320',
          'B) ₹2,450',
          'C) ₹2,670',
          'D) ₹3,200'
        ],
        correctAnswer: 'C',
        explanation: 'Rate = 16 2/3% = 1/6. Growth factor = 7/6. Y1: 6→7, Y2: 36→49, Y3: 216→343. Equalize to 343: Y1 is 294, Y2 is 252, Y3 is 216. Reference loan = 294 + 252 + 216 = 762. Actual loan = 7620. Multiplier = 10. Actual installment = 3430. Total paid = 3 × 3430 = 10,290. Total interest paid = 10,290 - 7,620 = ₹2,670.'
      },
      {
        id: 'apt-ci-inst-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Equalizing Different Rates per Year] A loan of ₹3,000 is to be paid in 2 equal installments. Rate for 1st year is 10%, 2nd year is 20%. First installment value?',
        question: 'A mathematical loan of exactly ₹3,000 is to be entirely repaid in exactly 2 equal annual installments. The interest rate charged is 10% strictly for the first year, and 20% strictly for the second year. What must be the exact value of each installment?',
        options: [
          'A) ₹1,650',
          'B) ₹1,716',
          'C) ₹1,800',
          'D) ₹1,920'
        ],
        correctAnswer: 'C',
        explanation: 'Let installment be x. Present value of first installment (discounted by 10%) = x / 1.1. Present value of second installment (discounted by 10% then 20%) = x / (1.1 × 1.2) = x / 1.32. Total Loan = x/1.1 + x/1.32 = 3000. Find common denominator 1.32: (1.2x + x) / 1.32 = 3000 => 2.2x = 3000 × 1.32 = 3960 => x = 3960 / 2.2 = ₹1,800.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 38: INSTALLMENTS - SIMPLE INTEREST (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 38,
    slug: 'aptitude-quant-installments-simple-interest',
    title: 'Installments - Simple Interest',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 41,
    video_url: 'http://www.youtube.com/watch?v=GDA1VYZNQ6c',
    video_title: 'Installments (Simple Interest) - Shortcuts & Tricks for 2026 - 2027 Placements',
    short_description: 'Calculate simple interest EMI payments by analyzing future value accumulations of each installment avoiding complex formulas.',
    summary_markdown: `### 📌 1. The Core EMI Concept (Simple Interest)
* **Future Value Accumulation:** In Simple Interest, you must look at what debt the installments are *clearing* at the END of the loan period.
* **The Formula-Free Approach:**
  Assume the installment is **₹100**.
  * The last installment (paid at the very end) earns **0 years** of interest → Value = 100.
  * The second-to-last installment earns **1 year** of interest → Value = 100 + (100 × R × 1)/100 = 100 + R.
  * The third-to-last earns **2 years** of interest → Value = 100 + 2R.
  * Sum these accumulated values to find the "Reference Debt".

### 💡 2. The Relationship Between Reference Debt and Actual Debt
* **Due Debt vs Loan Amount:** 
  The sum of the accumulated ₹100 installments equals the **Due Debt** (Total Amount to be paid = Principal + Total Simple Interest on the Principal for the entire period), NOT the original Principal!
* **Steps to Solve:**
  1. Calculate the actual Due Debt: \`Debt = Principal + (Principal × Rate × Time) / 100\`.
  2. Calculate the Reference Debt for a ₹100 installment (e.g., for 3 years at 10%, it is 120 + 110 + 100 = 330).
  3. Find the Multiplier: \`Multiplier = Actual Debt / Reference Debt\`.
  4. Actual Installment = \`₹100 × Multiplier\`.

### 💡 3. High-Yield Placement Shortcuts
* **Direct Calculation of Debt Discharged:** If the installment \`x\` is given, simply calculate the reference debt for 100, and scale it up by \`(x/100)\`.
* **Monthly Installments:** Convert the annual rate to a monthly rate (\`R/12\`). Ensure time periods are counted in months. Calculate the Due Debt using the monthly rate and total months.`,
    questions: [
      {
        id: 'apt-si-inst-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Direct Due Debt Installment] What annual installment will discharge a debt of ₹1,308 due in 4 years at 6% p.a. Simple Interest?',
        question: 'What exact annual mathematical installment will completely discharge a total accumulated debt of exactly ₹1,308 due in 4 years at a 6% per annum Simple Interest rate?',
        options: [
          'A) ₹280',
          'B) ₹300',
          'C) ₹320',
          'D) ₹350'
        ],
        correctAnswer: 'B',
        explanation: 'Assume an installment of ₹100. Y1 payment grows for 3 years: 100 + (6×3) = 118. Y2 payment grows for 2 years: 100 + (6×2) = 112. Y3 payment grows for 1 year: 100 + (6×1) = 106. Y4 payment grows for 0 years: 100. Reference Debt = 118 + 112 + 106 + 100 = 436. Actual Debt = 1308. Multiplier = 1308 / 436 = 3. Actual installment = 100 × 3 = ₹300.'
      },
      {
        id: 'apt-si-inst-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Finding Installment from Loan Amount] A loan of ₹15,000 at 10% p.a. SI for 3 years is to be paid in 3 equal annual installments. Value of installment?',
        question: 'A man strictly borrows a principal loan of exactly ₹15,000 at a 10% per annum Simple Interest rate for exactly 3 years. He wishes to completely repay the entire amount in 3 equal annual installments. What will be the exact mathematical value of each installment?',
        options: [
          'A) ₹5,000',
          'B) ₹5,500',
          'C) ₹5,909.09',
          'D) ₹6,500'
        ],
        correctAnswer: 'C',
        explanation: '1) First calculate the Due Debt! Debt = Principal + Total SI = 15000 + (15000 × 10 × 3)/100 = 15000 + 4500 = 19,500. 2) Reference Debt for ₹100 installment at 10% for 3 years: 120 + 110 + 100 = 330. 3) Multiplier = 19500 / 330 = 1950 / 33 = 650 / 11 = 59.0909... 4) Actual Installment = 100 × (650 / 11) ≈ 5909.09.'
      },
      {
        id: 'apt-si-inst-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Finding Debt Discharged by Installment] An annual payment of ₹750 in 6 years at 6% p.a. SI will discharge a debt of what amount?',
        question: 'An exact annual installment payment of exactly ₹750 strictly paid over exactly 6 years at a 6% per annum Simple Interest rate will completely discharge a total accumulated debt of exactly what amount?',
        options: [
          'A) ₹4,500',
          'B) ₹5,050',
          'C) ₹5,175',
          'D) ₹5,400'
        ],
        correctAnswer: 'C',
        explanation: 'Assume ₹100 installment. Reference Debt = 100×6 + (6+12+18+24+30) = 600 + 90 = 690. Since the actual installment is 750, the multiplier is 750 / 100 = 7.5. Actual Debt discharged = 690 × 7.5 = ₹5,175.'
      },
      {
        id: 'apt-si-inst-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Monthly Installments SI] A computer costs ₹45,000 cash or ₹14,000 down payment plus 5 equal monthly installments at 20% p.a. SI. Find monthly installment.',
        question: 'A computer can be bought for exactly ₹45,000 in cash, or by making an immediate down payment of ₹14,000 followed by exactly 5 equal MONTHLY installments. If the nominal rate of interest charged is 20% per annum Simple Interest, what will be the exact mathematical value of each monthly installment?',
        options: [
          'A) ₹6,000',
          'B) ₹6,250',
          'C) ₹6,500',
          'D) ₹6,800'
        ],
        correctAnswer: 'C',
        explanation: '1) Loan Amount = 45000 - 14000 = 31,000. 2) Monthly rate = 20% / 12 = 1/60 (as a fraction) or 5/3 % per month. 3) Total Due Debt for 5 months = 31000 + (31000 × 20/100 × 5/12) = 31000 + 31000(1/12) = 31000(13/12) = 33,583.33. 4) Reference Debt for ₹60 installment (to clear fraction): Y1 earns for 4 months: 60 + 4(60 × 1/60) = 64. Reference debt = 64 + 63 + 62 + 61 + 60 = 310. 5) Multiplier = Actual Debt / Reference Debt = 31000(13/12) / 310 = 100 × 13 / 12 = 1300 / 12. 6) Actual Installment = Reference Inst × Multiplier = 60 × (1300 / 12) = 5 × 1300 = ₹6,500.'
      },
      {
        id: 'apt-si-inst-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Finding Rate Given Debt and Installment] An annual installment of ₹6,000 clears a debt of ₹36,000 due in 5 years at R% SI. Find R.',
        question: 'An exact annual installment of exactly ₹6,000 completely clears a total accumulated debt of exactly ₹36,000 due in exactly 5 years at R% per annum Simple Interest. What is the exact mathematical value of R?',
        options: [
          'A) 8%',
          'B) 10%',
          'C) 12%',
          'D) 15%'
        ],
        correctAnswer: 'B',
        explanation: 'Multiplier = Actual Installment / 100 = 6000 / 100 = 60. Therefore, the Reference Debt (for a 100 installment) = Actual Debt / 60 = 36000 / 60 = 600. Using the formula for Reference Debt for 5 years: 100×5 + R(1+2+3+4) = 500 + 10R. So, 500 + 10R = 600 => 10R = 100 => R = 10%.'
      },
      {
        id: 'apt-si-inst-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Iterative Balance Method] A cycle costs ₹10,000. Paid via ₹4,000 down payment and 5 equal monthly installments of ₹1,300. Annual SI rate?',
        question: 'The cash price of a cycle is ₹10,000. It is purchased via an immediate cash down payment of ₹4,000 and the remaining balance is paid in exactly 5 equal monthly installments of ₹1,300 each. What is the exact annual rate of simple interest charged?',
        options: [
          'A) 24.5%',
          'B) 30.0%',
          'C) 35.3%',
          'D) 40.0%'
        ],
        correctAnswer: 'C',
        explanation: 'Initial Loan = 10000 - 4000 = 6000. Total payment made via installments = 5 × 1300 = 6500. Total Interest Paid = 6500 - 6000 = 500. In iterative method, interest is calculated on outstanding balances each month: M1: 6000, M2: 6000-1300=4700, M3: 3400, M4: 2100, M5: 800. Sum of balances = 6000 + 4700 + 3400 + 2100 + 800 = 17,000. Total Interest = (Sum of Balances × Rate_per_month) / 100. 500 = (17000 × R_m) / 100 => 500 = 170 R_m => R_m = 50/17 % per month. Annual Rate = (50/17) × 12 = 600 / 17 ≈ 35.29%. Option C matches 35.3%.'
      },
      {
        id: 'apt-si-inst-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [3-Year Debt Clearance] What annual installment will discharge a debt of ₹8,480 due in 4 years at 4% p.a. SI?',
        question: 'What exact annual installment will completely discharge a total accumulated debt of exactly ₹8,480 due in exactly 4 years at 4% per annum Simple Interest?',
        options: [
          'A) ₹2,000',
          'B) ₹2,100',
          'C) ₹2,200',
          'D) ₹2,400'
        ],
        correctAnswer: 'A',
        explanation: 'Assume ₹100 installment. Reference Debt = 100×4 + 4(3+2+1+0) = 400 + 4(6) = 424. Actual Debt = 8480. Multiplier = 8480 / 424 = 20. Actual Installment = 100 × 20 = ₹2,000.'
      },
      {
        id: 'apt-si-inst-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Total Payment Over 5 Years] A man repays a loan with 5 annual installments of ₹1,200. Rate is 5% p.a. SI. Total debt discharged?',
        question: 'A man repays a loan strictly using 5 equal annual installments of exactly ₹1,200 each. If the rate is 5% per annum Simple Interest, what is the exact mathematical total debt that was discharged at the end of the 5th year?',
        options: [
          'A) ₹6,000',
          'B) ₹6,300',
          'C) ₹6,600',
          'D) ₹7,000'
        ],
        correctAnswer: 'C',
        explanation: 'Reference Debt for 100 installment = 100×5 + 5(4+3+2+1+0) = 500 + 5(10) = 550. Since actual installment is 1200, the multiplier is 1200 / 100 = 12. Actual Debt discharged = 550 × 12 = ₹6,600.'
      },
      {
        id: 'apt-si-inst-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q9: [Unequal Installments in SI] A debt is paid in 3 years. The 2nd installment is twice the 1st, the 3rd is thrice the 1st. Rate is 10%. If total debt cleared is ₹6,400, find the 1st installment.',
        question: 'A debt is paid entirely in 3 annual installments. The second installment is exactly twice the first, and the third installment is exactly thrice the first. The rate is 10% p.a. Simple Interest. If the total accumulated debt cleared at the end is exactly ₹6,400, what is the value of the 1st installment?',
        options: [
          'A) ₹800',
          'B) ₹1,000',
          'C) ₹1,200',
          'D) ₹1,500'
        ],
        correctAnswer: 'B',
        explanation: 'Let 1st installment = x. It grows for 2 years: x + x(10)(2)/100 = 1.2x. Let 2nd installment = 2x. It grows for 1 year: 2x + 2x(10)(1)/100 = 2.2x. Let 3rd installment = 3x. It grows for 0 years: 3x. Total Debt Cleared = 1.2x + 2.2x + 3x = 6.4x. Given 6.4x = 6400 => x = ₹1,000.'
      },
      {
        id: 'apt-si-inst-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Comparing Cash Price to Installment Price in SI] A TV is ₹10k cash or 2 annual installments of ₹5.5k. Find SI rate.',
        question: 'A smart TV can be purchased for exactly ₹10,000 in cash, or by completely paying exactly 2 equal annual installments of ₹5,500 each (the first installment being paid after 1 year). What is the exact annual Simple Interest rate being charged?',
        options: [
          'A) 5.50%',
          'B) 6.89%',
          'C) 10.00%',
          'D) 12.50%'
        ],
        correctAnswer: 'B',
        explanation: 'Using the accumulated Debt method: Due Debt = 10000 + 10000(R)(2)/100 = 10000 + 200R. Value of installments = 5500(1 + R/100) + 5500 = 11000 + 55R. Equating: 10000 + 200R = 11000 + 55R => 145R = 1000 => R = 1000 / 145 = 200 / 29 ≈ 6.89%.'
      },
      {
        id: 'apt-si-inst-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Time from Debt and Installment] An annual installment of ₹800 clears a debt of ₹3,440 at 5% p.a. SI. Find the number of years.',
        question: 'An exact annual mathematical installment of exactly ₹800 completely clears an accumulated debt of exactly ₹3,440 at exactly 5% per annum Simple Interest. How many years is the tenure of this loan?',
        options: [
          'A) 3 years',
          'B) 4 years',
          'C) 5 years',
          'D) 6 years'
        ],
        correctAnswer: 'B',
        explanation: 'Reference installment = 100. Actual = 800. Multiplier = 8. So Reference Debt = 3440 / 8 = 430. We test years n. For n=4: Ref Debt = 100(4) + 5(3+2+1+0) = 400 + 30 = 430. Perfect match. Tenure is 4 years.'
      },
      {
        id: 'apt-si-inst-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Quarterly SI Installments] A loan of ₹10,000 is taken at 12% p.a. SI. Repaid in 4 equal quarterly installments. Value of installment?',
        question: 'A loan of exactly ₹10,000 is taken at exactly 12% per annum Simple Interest. It is completely repaid in exactly 4 equal QUARTERLY installments. What is the exact mathematical value of each installment?',
        options: [
          'A) ₹2,600.00',
          'B) ₹2,679.42',
          'C) ₹2,705.50',
          'D) ₹2,750.00'
        ],
        correctAnswer: 'B',
        explanation: 'Rate per quarter = 12% / 4 = 3%. Total Due Debt after 4 quarters (1 year) = 10000 + 10000(12/100)(1) = 11,200. Reference Debt for 100 installment for 4 quarters at 3%: 100(4) + 3(3+2+1+0) = 400 + 18 = 418. Multiplier = 11200 / 418 ≈ 26.794. Actual Installment = 100 × 26.794 = ₹2,679.42.'
      },
      {
        id: 'apt-si-inst-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Partial Year Installment] What is the due debt if an installment of ₹500 is paid half-yearly for 1.5 years at 10% p.a. SI?',
        question: 'If a mathematical installment of exactly ₹500 is paid HALF-YEARLY for a total period of exactly 1.5 years at exactly 10% per annum Simple Interest, what is the total accumulated debt that is being completely discharged?',
        options: [
          'A) ₹1,550',
          'B) ₹1,575',
          'C) ₹1,600',
          'D) ₹1,650'
        ],
        correctAnswer: 'B',
        explanation: '1.5 years = 3 half-years. Rate per half-year = 5%. Assume 100 installment. Ref Debt = 100(3) + 5(2+1+0) = 315. Actual Installment is 500, so Multiplier = 5. Actual Debt = 315 × 5 = ₹1,575.'
      },
      {
        id: 'apt-si-inst-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Error in Calculation Concept] A person miscalculates EMI by summing Principal and Interest and simply dividing by N. What is the effect?',
        question: 'A person calculates their Simple Interest EMI by simply taking the Total Due Debt (Principal + Total Simple Interest on the Principal) and strictly dividing it by the number of years (N). Mathematically, how does this mistakenly calculated installment compare to the true required mathematical Simple Interest installment?',
        options: [
          'A) It is perfectly equal to the true installment',
          'B) It is strictly LESS than the true installment',
          'C) It is strictly GREATER than the true installment',
          'D) Depends entirely on the interest rate'
        ],
        correctAnswer: 'C',
        explanation: 'True installment mathematically accounts for the fact that the installments paid EARLY in the loan period earn interest for the bank, subsidizing the total payment. If you simply divide the Due Debt by N, you ignore this subsidized interest, resulting in an artificially inflated, strictly GREATER installment value.'
      },
      {
        id: 'apt-si-inst-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q15: [Finding Total Amount Paid] An installment of ₹840 clears a debt in 5 years at 10% p.a. SI. What is the total cash out of pocket?',
        question: 'An exact annual installment of exactly ₹840 completely clears a specific mathematical debt in exactly 5 years at a 10% per annum Simple Interest rate. What is the exact total absolute cash out-of-pocket paid by the borrower over these 5 years?',
        options: [
          'A) ₹4,200',
          'B) ₹4,600',
          'C) ₹5,040',
          'D) ₹5,400'
        ],
        correctAnswer: 'A',
        explanation: 'The question strictly asks for the total out-of-pocket cash paid. Regardless of the debt discharged or the interest rate, the borrower pays 5 installments of ₹840 each. Total cash paid = 5 × 840 = ₹4,200.'
      },
      {
        id: 'apt-si-inst-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Difference between CI and SI Installment] Debt of ₹1,210 due in 2 years at 10%. Difference between SI installment and CI installment?',
        question: 'An accumulated debt of exactly ₹1,210 is completely due in exactly 2 years. The nominal interest rate is exactly 10% per annum. What is the exact mathematical difference between the required annual installment if calculated using Compound Interest versus Simple Interest on the same due debt?',
        options: [
          'A) ₹0.00',
          'B) ₹18.25',
          'C) ₹26.19',
          'D) ₹30.00'
        ],
        correctAnswer: 'A',
        explanation: 'For 2 years at 10%: The first installment earns 1 year of simple interest, which is identical to compound interest for 1 year. The second installment earns 0 interest in both cases. Therefore, the required annual installment to clear the exact same due debt over 2 years is mathematically identical in both methods, making the difference exactly ₹0.00.'
      },
      {
        id: 'apt-si-inst-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Solving for Loan with Mixed Interest Options] A loan is repaid in 4 annual installments of ₹1000 at 5% SI. Find Principal.',
        question: 'A loan is mathematically completely repaid using exactly 4 equal annual installments of exactly ₹1,000 each. The rate is exactly 5% per annum Simple Interest. What was the exact original Principal (Loan Amount) borrowed on Day 1?',
        options: [
          'A) ₹3,583.33',
          'B) ₹3,600.00',
          'C) ₹3,820.00',
          'D) ₹4,000.00'
        ],
        correctAnswer: 'A',
        explanation: '1) Actual Installment = 1000. 2) Ref Debt for 100 inst at 5% for 4 yrs = 100(4) + 5(3+2+1+0) = 400 + 30 = 430. 3) Multiplier = 10. Actual Debt Discharged = 430 × 10 = 4300. 4) Debt = Principal + SI on Principal for 4 yrs = P + P(5×4)/100 = 1.2P. 5) 1.2P = 4300 => P = 4300 / 1.2 ≈ ₹3,583.33.'
      },
      {
        id: 'apt-si-inst-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Proportional Scaling] Installment I clears Debt D in 3 years at 10%. If Debt is doubled, what happens to Installment?',
        question: 'An exact annual mathematical installment I completely clears an accumulated Due Debt D in exactly 3 years at 10% per annum Simple Interest. If the Due Debt is mathematically exactly doubled (2D), what happens to the exact required annual installment, assuming all other parameters remain unchanged?',
        options: [
          'A) It increases by 50%',
          'B) It exactly doubles (2I)',
          'C) It more than doubles',
          'D) It less than doubles'
        ],
        correctAnswer: 'B',
        explanation: 'In Simple Interest installment calculations, the Reference Debt is a constant scalar based entirely on Rate and Time. Since Multiplier = Actual Debt / Reference Debt, if the Actual Debt doubles, the multiplier exactly doubles, meaning the Actual Installment exactly doubles.'
      },
      {
        id: 'apt-si-inst-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Installment with Changing Rates] A 3-year loan. Installment is ₹1000. Interest is 5% in Y1, 10% in Y2, 15% in Y3. Due debt?',
        question: 'An individual pays exactly 3 equal annual installments of exactly ₹1,000 each to clear a debt. However, the Simple Interest rate is variable: 5% in Year 1, 10% in Year 2, and 15% in Year 3. What is the total accumulated Due Debt that is mathematically discharged by these payments?',
        options: [
          'A) ₹3,150',
          'B) ₹3,400',
          'C) ₹3,450',
          'D) ₹3,600'
        ],
        correctAnswer: 'B',
        explanation: 'Installment 1 (paid end of Y1) earns 10% in Y2 and 15% in Y3. Value = 1000 + 1000(10+15)/100 = 1250. Installment 2 (paid end of Y2) earns 15% in Y3. Value = 1000 + 1000(15)/100 = 1150. Installment 3 (paid end of Y3) earns 0%. Value = 1000. Total Debt Discharged = 1250 + 1150 + 1000 = ₹3,400.'
      },
      {
        id: 'apt-si-inst-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Equalizing Total Paid vs Debt Discharged] A man pays 4 installments of ₹1000 at 5% SI. He effectively saves money compared to paying the full debt at the end. How much did he save?',
        question: 'A man clears a loan by strictly paying 4 equal annual installments of exactly ₹1,000 each. The rate is exactly 5% per annum Simple Interest. Exactly how much mathematical interest did he "save" by paying in installments rather than allowing the debt to accumulate fully to the end of the 4 years?',
        options: [
          'A) ₹150',
          'B) ₹200',
          'C) ₹300',
          'D) ₹400'
        ],
        correctAnswer: 'C',
        explanation: '1) Total out-of-pocket cash paid via installments = 4 × 1000 = 4,000. 2) The actual Due Debt discharged by this payment structure is: Ref Debt = 100(4) + 5(6) = 430. Multiplier = 10. Actual Debt = 430 × 10 = 4,300. 3) If he had paid at the end, he would have had to pay the full Due Debt of ₹4,300. By paying early installments, he only paid ₹4,000. He "saved" exactly 4300 - 4000 = ₹300.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 39: QUADRATIC EQUATIONS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 39,
    slug: 'aptitude-quant-quadratic-equations',
    title: 'Quadratic Equations',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 109,
    video_url: 'http://www.youtube.com/watch?v=zlhOmaIxD6s',
    video_title: 'Quadratic Equations - Shortcuts & Tricks for 2026 - 2027 Placement Tests, Job Interviews & Exams',
    short_description: 'Master factorization shortcuts, Discriminant properties (D), Shridharacharya Formula, and advanced conjugate root relationships.',
    summary_markdown: `### 📌 1. Fundamentals of Quadratic Equations
* A quadratic equation is a polynomial of degree 2: **\`ax^2 + bx + c = 0\`**.
* The coefficient \`a\` **cannot** be equal to 0 (otherwise it becomes a linear equation).
* It always has exactly **two roots** (let's call them \`α\` and \`β\`).
* **Root Relationships:**
  * **Sum of roots (\`α + β\`) = \`-b / a\`**
  * **Product of roots (\`αβ\`) = \`c / a\`**
* **Forming an equation from roots:** \`x^2 - (Sum)x + (Product) = 0\`

### 💡 2. The Discriminant and Nature of Roots
* The **Discriminant (\`D\`)** = **\`b^2 - 4ac\`**
* **Nature of Roots:**
  * \`D > 0\`: Two distinct real roots. (If D is a perfect square, roots are rational).
  * \`D = 0\`: Two identical real roots (the parabola just touches the x-axis).
  * \`D < 0\`: No real roots (roots are complex conjugate pairs).
* **Conjugate Root Pairs:** If one root of a quadratic with rational coefficients is an irrational surd \`m + √n\`, the other root MUST strictly be its conjugate **\`m - √n\`**. Same applies to complex roots (\`a + ib\` and \`a - ib\`).

### 💡 3. High-Yield Placement Shortcuts
* **Bi-Quadratic Substitution:** If the equation has a degree of 4 (e.g., \`ax^4 + bx^2 + c = 0\`), substitute **\`y = x^2\`** to reduce it to a standard quadratic equation. Find \`y\`, then take the square root to find all 4 values of \`x\`.
* **Zero Constant:** If one root is 0, the product of roots is 0, which means **\`c = 0\`**.
* **Opposite Sign Roots:** If the two roots are equal in magnitude but opposite in sign (\`α\` and \`-α\`), their sum is 0, which means **\`b = 0\`**.
* **Reciprocal Roots:** If one root is the exact reciprocal of the other (\`α\` and \`1/α\`), their product is 1, which means **\`c = a\`**.`,
    questions: [
      {
        id: 'apt-quad-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q1: [Forming Quadratic from Sum and Product] The sum of roots is -7 and their product is 21. Find the quadratic equation.',
        question: 'The exact mathematical sum of the roots of a quadratic equation is -7, and their exact product is 21. Which of the following is the correct quadratic equation?',
        options: [
          'A) x^2 - 7x + 21 = 0',
          'B) x^2 + 7x + 21 = 0',
          'C) x^2 - 7x - 21 = 0',
          'D) x^2 + 7x - 21 = 0'
        ],
        correctAnswer: 'B',
        explanation: 'The standard form using sum and product is: x^2 - (Sum)x + (Product) = 0. Substituting the given values: x^2 - (-7)x + 21 = 0 => x^2 + 7x + 21 = 0.'
      },
      {
        id: 'apt-quad-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Equation with Fractional Roots] If the roots are -7/2 and -5/7, find the quadratic equation with integer coefficients.',
        question: 'If the two exact roots of a quadratic equation are exactly -7/2 and -5/7, which of the following represents the correct quadratic equation stripped of all fractional coefficients?',
        options: [
          'A) 14x^2 + 59x + 35 = 0',
          'B) 14x^2 - 59x + 35 = 0',
          'C) 14x^2 + 59x - 35 = 0',
          'D) 28x^2 + 118x + 70 = 0'
        ],
        correctAnswer: 'A',
        explanation: 'Sum = (-7/2) + (-5/7) = (-49 - 10) / 14 = -59/14. Product = (-7/2) × (-5/7) = 35/14 = 5/2. Equation: x^2 - (-59/14)x + (35/14) = 0 => x^2 + (59/14)x + 35/14 = 0. Multiply entirely by 14: 14x^2 + 59x + 35 = 0.'
      },
      {
        id: 'apt-quad-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Finding Roots Using the Shridharacharya Formula] Find the roots of 2x^2 + 3x - 7 = 0.',
        question: 'Using the Shridharacharya Formula (Quadratic Formula), what are the exact mathematically precise roots of the equation 2x^2 + 3x - 7 = 0?',
        options: [
          'A) (-3 ± √55) / 4',
          'B) (-3 ± √65) / 4',
          'C) (3 ± √65) / 4',
          'D) (-3 ± √65) / 2'
        ],
        correctAnswer: 'B',
        explanation: 'Here a=2, b=3, c=-7. Discriminant D = b^2 - 4ac = 3^2 - 4(2)(-7) = 9 - (-56) = 9 + 56 = 65. Formula: x = (-b ± √D) / 2a = (-3 ± √65) / (2 × 2) = (-3 ± √65) / 4.'
      },
      {
        id: 'apt-quad-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Condition for Equal Magnitude Opposite Sign Roots] If roots are equal in magnitude but opposite in sign, which is true?',
        question: 'If the two mathematical roots of a standard quadratic equation (ax^2 + bx + c = 0) are strictly equal in absolute magnitude but opposite in sign, which of the following algebraic conditions must definitely be true?',
        options: [
          'A) a = 0',
          'B) b = 0',
          'C) c = 0',
          'D) a = c'
        ],
        correctAnswer: 'B',
        explanation: 'If the roots are α and -α, their sum is α + (-α) = 0. The sum of the roots is given by -b / a. Therefore, -b / a = 0, which strictly implies that the coefficient b must be 0.'
      },
      {
        id: 'apt-quad-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Condition for Reciprocal Roots] If one root is the reciprocal of the other, which is true?',
        question: 'If one root of a standard quadratic equation (ax^2 + bx + c = 0) is the exact mathematical reciprocal of the other root, which of the following algebraic conditions must definitely be true?',
        options: [
          'A) a = 0',
          'B) b = 0',
          'C) c = 0',
          'D) a = c'
        ],
        correctAnswer: 'D',
        explanation: 'If the roots are α and 1/α, their product is α × (1/α) = 1. The product of the roots is given by c / a. Therefore, c / a = 1, which strictly implies that a = c.'
      },
      {
        id: 'apt-quad-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Sum of Squares of Roots] If α, β are roots of 4x^2 - 6x + 4 = 0, find α^2 + β^2.',
        question: 'If α and β are the exact mathematical roots of the quadratic equation 4x^2 - 6x + 4 = 0, what is the exact algebraic value of the expression (α^2 + β^2)?',
        options: [
          'A) 1/4',
          'B) 1/2',
          'C) 3/4',
          'D) 9/4'
        ],
        correctAnswer: 'A',
        explanation: '1) Sum of roots (α + β) = -b/a = -(-6)/4 = 6/4 = 3/2. 2) Product of roots (αβ) = c/a = 4/4 = 1. 3) Expression: α^2 + β^2 = (α + β)^2 - 2αβ = (3/2)^2 - 2(1) = 9/4 - 2 = 9/4 - 8/4 = 1/4.'
      },
      {
        id: 'apt-quad-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Finding Constant k for Equal Roots] If the roots of kx^2 - 8x + 8 = 0 are equal, find k.',
        question: 'If the quadratic equation kx^2 - 8x + 8 = 0 mathematically possesses two perfectly equal real roots, what is the exact numerical value of the constant k?',
        options: [
          'A) 1',
          'B) 2',
          'C) 4',
          'D) 8'
        ],
        correctAnswer: 'B',
        explanation: 'For roots to be equal, the discriminant D must be exactly 0. D = b^2 - 4ac = (-8)^2 - 4(k)(8) = 64 - 32k. Setting D = 0 gives 64 - 32k = 0 => 32k = 64 => k = 2.'
      },
      {
        id: 'apt-quad-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Conjugate Root Generation] If one root of a quadratic equation with rational coefficients is 3 + 2√5, find the other root.',
        question: 'If one exact mathematical root of a quadratic equation possessing purely rational coefficients is strictly (3 + 2√5), what must fundamentally be the exact value of the other root?',
        options: [
          'A) -3 - 2√5',
          'B) -3 + 2√5',
          'C) 3 - 2√5',
          'D) Cannot be determined'
        ],
        correctAnswer: 'C',
        explanation: 'By the Conjugate Root Theorem, if a quadratic equation with rational coefficients has an irrational root of the form m + √n, its other root MUST strictly be its conjugate pair: m - √n. Thus, the other root is exactly 3 - 2√5.'
      },
      {
        id: 'apt-quad-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q9: [Difference Between Roots] Find the difference between the roots of x^2 + 6x - 91 = 0.',
        question: 'What is the absolute mathematical difference between the two exact roots of the quadratic equation x^2 + 6x - 91 = 0?',
        options: [
          'A) 13',
          'B) 14',
          'C) 20',
          'D) 26'
        ],
        correctAnswer: 'C',
        explanation: 'We need two numbers that multiply to -91 and sum to +6. The numbers are +13 and -7 (since 13 × -7 = -91 and 13 - 7 = 6). The factored equation is (x + 13)(x - 7) = 0. The roots are x = -13 and x = 7. The absolute difference between them is |7 - (-13)| = 7 + 13 = 20.'
      },
      {
        id: 'apt-quad-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Bi-Quadratic Equation Solving] Solve for p: 7p^4 - 21p^2 + 14 = 0.',
        question: 'Solve the bi-quadratic equation for the variable p: 7p^4 - 21p^2 + 14 = 0. What are all the exact possible mathematical values of p?',
        options: [
          'A) ±1, ±2',
          'B) ±1, ±√2',
          'C) ±√2, ±√3',
          'D) ±2, ±4'
        ],
        correctAnswer: 'B',
        explanation: 'Divide the entire equation by 7: p^4 - 3p^2 + 2 = 0. Substitute x = p^2 to get a standard quadratic: x^2 - 3x + 2 = 0. Factor it: (x - 1)(x - 2) = 0. So x = 1 or x = 2. Since x = p^2, we have p^2 = 1 (giving p = ±1) and p^2 = 2 (giving p = ±√2).'
      },
      {
        id: 'apt-quad-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Identity Condition Constants] For what value of P is (P-1)x^2 + (P^2-1)x + (P^2-3P+2) = 0 an identity?',
        question: 'For what exact numerical value of the constant P does the quadratic equation (P-1)x^2 + (P^2-1)x + (P^2-3P+2) = 0 become a mathematical identity (meaning it is absolutely true for ALL possible values of x)?',
        options: [
          'A) -1',
          'B) 1',
          'C) 2',
          'D) 3'
        ],
        correctAnswer: 'B',
        explanation: 'For a quadratic equation to become a universal identity (having more than two roots), ALL its coefficients must exactly equal 0. 1) P - 1 = 0 => P = 1. 2) P^2 - 1 = 0 => P = ±1. 3) P^2 - 3P + 2 = 0 => (P-1)(P-2) = 0 => P = 1 or 2. The only common value satisfying all three conditions simultaneously is P = 1.'
      },
      {
        id: 'apt-quad-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Forming Equation with Squared Roots] If α, β are roots of x^2 - 5x + 6 = 0, form an equation whose roots are α^2 and β^2.',
        question: 'If α and β are the exact roots of the quadratic equation x^2 - 5x + 6 = 0, which of the following is the correct quadratic equation whose roots are exactly α^2 and β^2?',
        options: [
          'A) x^2 - 13x + 36 = 0',
          'B) x^2 - 25x + 36 = 0',
          'C) x^2 - 13x + 12 = 0',
          'D) x^2 - 25x + 12 = 0'
        ],
        correctAnswer: 'A',
        explanation: '1) Sum α + β = 5. Product αβ = 6. 2) New sum = α^2 + β^2 = (α + β)^2 - 2αβ = 5^2 - 2(6) = 25 - 12 = 13. 3) New product = (αβ)^2 = 6^2 = 36. 4) New Equation: x^2 - (New Sum)x + (New Product) = 0 => x^2 - 13x + 36 = 0.'
      },
      {
        id: 'apt-quad-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Transforming Complex Bi-Quadratic into Quadratic] Solve for y: y^4 - 25 = 0.',
        question: 'Solve the pure bi-quadratic equation y^4 - 25 = 0. What are all four exact possible mathematical roots for the variable y?',
        options: [
          'A) ±5, ±5i',
          'B) ±√5, ±i√5',
          'C) ±5, ±√5i',
          'D) ±25, ±i√25'
        ],
        correctAnswer: 'B',
        explanation: 'Substitute x = y^2. The equation becomes x^2 - 25 = 0 => x^2 = 25 => x = ±5. This yields two branches: 1) y^2 = 5 => y = ±√5. 2) y^2 = -5 => y = ±√(-5) = ±i√5. All four roots are ±√5, ±i√5.'
      },
      {
        id: 'apt-quad-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Equation whose Roots are Multiplied by Constant] The roots of 14x^2 + 59x + 35 = 0 are multiplied by 2. Find new equation.',
        question: 'A quadratic equation is defined as 14x^2 + 59x + 35 = 0. If both of its roots are mathematically multiplied by exactly 2, which of the following represents the new resulting quadratic equation?',
        options: [
          'A) 14x^2 + 118x + 140 = 0',
          'B) 7x^2 + 59x + 70 = 0',
          'C) 28x^2 + 118x + 70 = 0',
          'D) 14x^2 + 59x + 140 = 0'
        ],
        correctAnswer: 'B',
        explanation: 'If roots of ax^2 + bx + c = 0 are multiplied by k, the new equation is a(x/k)^2 + b(x/k) + c = 0. Here k = 2. So, 14(x/2)^2 + 59(x/2) + 35 = 0 => 14(x^2 / 4) + 59x / 2 + 35 = 0. Multiply entirely by 4 to clear denominators: 14x^2 + 118x + 140 = 0. Divide by 2: 7x^2 + 59x + 70 = 0.'
      },
      {
        id: 'apt-quad-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Roots with High Constant] Find the roots of x^2 + 19x + 84 = 0.',
        question: 'What are the two exact mathematical roots of the quadratic equation x^2 + 19x + 84 = 0?',
        options: [
          'A) -12, -7',
          'B) 12, 7',
          'C) -14, -5',
          'D) 14, 5'
        ],
        correctAnswer: 'A',
        explanation: 'We need two numbers that multiply to exactly +84 and sum to exactly +19. Testing factors of 84: 12 × 7 = 84, and 12 + 7 = 19. The factored equation is (x + 12)(x + 7) = 0. Therefore, the exact roots (by reversing the signs) are x = -12 and x = -7.'
      },
      {
        id: 'apt-quad-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Complex Reduction Substitution] Solve for x: x^(2/3) - 3x^(1/3) - 18 = 0.',
        question: 'Solve the following non-standard fractional-power equation for the real variable x:\nx^(2/3) - 3x^(1/3) - 18 = 0',
        options: [
          'A) -27, 216',
          'B) 27, -216',
          'C) -9, 36',
          'D) 9, -36'
        ],
        correctAnswer: 'A',
        explanation: 'Substitute y = x^(1/3). The equation becomes y^2 - 3y - 18 = 0. Factoring: we need numbers that multiply to -18 and sum to -3. These are -6 and +3. So (y - 6)(y + 3) = 0. This gives y = 6 and y = -3. Since y = x^(1/3), we cube both sides to find x. For y = 6: x = 6^3 = 216. For y = -3: x = (-3)^3 = -27. The roots are -27 and 216.'
      },
      {
        id: 'apt-quad-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Using Value Substitution to Evaluate Root Form] What form do the roots of x^2 - 4ax + b + 1 = 0 take if D < 0?',
        question: 'Consider a quadratic equation where the discriminant D is strictly less than zero (D < 0). Mathematically, what is the absolute definite nature of the two roots generated by this equation?',
        options: [
          'A) Real, distinct, and rational',
          'B) Real, distinct, and irrational',
          'C) Real and exactly equal',
          'D) Non-real, complex conjugate pairs'
        ],
        correctAnswer: 'D',
        explanation: 'When the Discriminant D = b^2 - 4ac is strictly less than 0, the term under the square root in the Shridharacharya Formula becomes negative. Since the square root of a negative number yields an imaginary unit (i), the roots strictly become non-real complex numbers. Furthermore, they invariably occur as conjugate pairs (m + in and m - in).'
      },
      {
        id: 'apt-quad-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Algebraic Condition for Non-Real Roots] For x^2 - 4ax + b + 1 = 0 to have non-real roots, what condition holds?',
        question: 'For the specific quadratic equation x^2 - 4ax + b + 1 = 0 to possess strictly non-real (complex) roots, which of the following exact algebraic inequality conditions must definitely hold true?',
        options: [
          'A) 4a^2 - b - 1 < 0',
          'B) 16a^2 - 4b - 4 > 0',
          'C) b > 4a^2 - 1',
          'D) b < 4a^2 + 1'
        ],
        correctAnswer: 'C',
        explanation: 'For non-real roots, the Discriminant D < 0. Here a_coeff = 1, b_coeff = -4a, c_coeff = b + 1. D = (-4a)^2 - 4(1)(b + 1) < 0 => 16a^2 - 4(b + 1) < 0 => 16a^2 - 4b - 4 < 0. Divide the entire inequality by 4: 4a^2 - b - 1 < 0. Rearrange to isolate b: 4a^2 - 1 < b, which is mathematically identical to b > 4a^2 - 1.'
      },
      {
        id: 'apt-quad-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Inverse Root Generation] If roots of an equation are -7/2 and -5/7, what is the equation?',
        question: 'If the two exact mathematical roots of a quadratic equation are strictly -7/2 and -5/7, what is the correct representation of the equation?',
        options: [
          'A) 14x^2 + 59x + 35 = 0',
          'B) 14x^2 - 59x + 35 = 0',
          'C) 14x^2 + 59x - 35 = 0',
          'D) 14x^2 - 59x - 35 = 0'
        ],
        correctAnswer: 'A',
        explanation: 'We form the equation from the roots. Sum = -7/2 - 5/7 = (-49 - 10)/14 = -59/14. Product = (-7/2) × (-5/7) = 35/14. Equation is x^2 - (Sum)x + Product = 0 => x^2 - (-59/14)x + 35/14 = 0 => x^2 + (59/14)x + 35/14 = 0. Multiply by 14 to clear fractions: 14x^2 + 59x + 35 = 0.'
      },
      {
        id: 'apt-quad-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Evaluating High-Power Expression of Conjugate Roots] If α, β are roots of ax^2 + bx + c = 0, find α^4 - β^4.',
        question: 'If α and β are the exact mathematical roots of the quadratic equation ax^2 + bx + c = 0, which of the following algebraic expressions correctly represents the exact value of (α^4 - β^4)?',
        options: [
          'A) (α+β)(α-β)(α^2+β^2)',
          'B) (α+β)^2 - 2αβ',
          'C) (α^2+β^2)^2 - 2α^2β^2',
          'D) (α-β)(α^2+β^2)^2'
        ],
        correctAnswer: 'A',
        explanation: 'Using standard algebraic factorization: α^4 - β^4 represents a difference of squares. 1) (α^2)^2 - (β^2)^2 = (α^2 - β^2)(α^2 + β^2). 2) Further factor the first bracket (difference of squares again): (α^2 - β^2) = (α + β)(α - β). 3) Substituting this back in gives the full expansion: (α + β)(α - β)(α^2 + β^2).'
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

async function seedAptitudeBatch13() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 13 (TOPICS 37 TO 39) ===\n');

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

    // 2. Upsert Topics 37 to 39
    for (const item of aptitudeBatch13) {
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
      await client.query(`UPDATE tracks SET total_topics = 39, estimated_hours = 78 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 39, estimated_hours = 78');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 39 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 39');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 13 (Topics 37 to 39) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch13();
