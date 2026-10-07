const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch12 = [
  // ===========================================================================
  // TOPIC 34: DATA INTERPRETATION - LINE GRAPH (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 34,
    slug: 'aptitude-quant-data-interpretation-line-graph',
    title: 'Data Interpretation - Line Graph',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 31,
    video_url: 'http://www.youtube.com/watch?v=wLTYn8MVIrA',
    video_title: 'Line Graph & Table Data - Shortcuts & Tricks for Placement Tests, Jobs & Exams | Data Interpretation',
    short_description: 'Analyze multi-series line graphs, deduce underlying totals from ratio metrics (Numerator/Denominator limits), and perform multi-step table computations.',
    summary_markdown: `### 📌 1. Line Graph Data Decoding
* **Ratio Line Graphs:** When a line graph plots a ratio (e.g., \`Girls / Boys\`), the value directly indicates which quantity is larger.
  * If \`Ratio > 1\`, the Numerator is strictly greater than the Denominator.
  * If \`Ratio < 1\`, the Denominator is strictly greater than the Numerator.
* **Proportion Extrema:** 
  * "Minimum Proportionate" implies the lowest point on the ratio graph.
  * "Maximum Proportionate" implies the highest point on the ratio graph.
* **Data Insufficiency Trap:** You cannot determine the absolute numerical increase/decrease (e.g., actual number of girls added) between two years simply by looking at the change in their ratios, unless the absolute base value for both years is provided.

### 💡 2. Complex Tabular Data
* **Formula Mapping:** Tabular DI often includes a note defining a formula (e.g., \`Net Salary = Gross + HA + Special - Tax\`). Always establish this algebraic relationship before filling out missing blanks.
* **Percentages of Changing Bases:** If "Special Allowance" is \`80%\` of "Gross Salary", ensure you define Gross Salary as an unknown variable \`x\` and construct an algebraic equation to solve for \`x\` rather than guessing numbers.

### 💡 3. Profit Margin Extrapolations
* **Profit Percentage:** In financial graphs, \`Profit % = (Profit / Investment) × 100\`.
* **Total Income:** \`Income = Investment + Profit\`.
* **Calculating Unknowns:** If Absolute Profit and Profit % are given, use \`Investment = (Absolute Profit / Profit %) × 100\` to find the investment, then add them to find the Total Income.`,
    questions: [
      {
        id: 'apt-line-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q1: [Ratio Graph Deduction] A line graph shows the ratio of Girls to Boys appearing for an exam. The values are: 2011=0.45, 2012=0.85, 2013=1.05, 2014=0.95, 2015=1.25. In how many years did girls outnumber boys?',
        question: 'A line graph displays the mathematical ratio of Girls to Boys (Girls / Boys) appearing for a board exam over 5 years. The ratio values are recorded as: 2011 = 0.45, 2012 = 0.85, 2013 = 1.05, 2014 = 0.95, and 2015 = 1.25. In exactly how many of these years did the absolute number of girls outnumber the absolute number of boys?',
        options: [
          'A) 1 year',
          'B) 2 years',
          'C) 3 years',
          'D) 4 years'
        ],
        correctAnswer: 'B',
        explanation: 'Girls outnumber boys when the numerator is strictly greater than the denominator. This happens exclusively when the ratio (Girls / Boys) is strictly greater than 1. Looking at the data, the ratio is > 1 in exactly two years: 2013 (1.05) and 2015 (1.25).'
      },
      {
        id: 'apt-line-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Minimum Proportionate Boys] Using the same ratio graph (Girls/Boys): 2011=0.45, 2012=0.85, 2013=1.05, 2014=0.95, 2015=1.25. In which year were the BOYS minimum proportionate?',
        question: 'Using the exact same line graph data showing the ratio of Girls to Boys (G/B): 2011 = 0.45, 2012 = 0.85, 2013 = 1.05, 2014 = 0.95, and 2015 = 1.25. In which specific year were the BOYS considered "minimum proportionate" relative to the girls?',
        options: [
          'A) 2011',
          'B) 2013',
          'C) 2014',
          'D) 2015'
        ],
        correctAnswer: 'D',
        explanation: 'The boys are "minimum proportionate" when the ratio of Boys to Girls (B/G) is at its absolute minimum. This strictly occurs when the reciprocal ratio (G/B) is at its absolute MAXIMUM. The maximum G/B ratio on the graph is 1.25 in the year 2015.'
      },
      {
        id: 'apt-line-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Absolute Calculation from Ratio Line] If the Girls/Boys ratio in 2014 was 0.95, and the absolute number of boys appearing was 500, what was the exact number of girls appearing?',
        question: 'Based on the line graph, the exact ratio of Girls to Boys (G/B) in the year 2014 was recorded as exactly 0.95. If the absolute numerical count of boys appearing for the exam in 2014 was exactly 500, what was the exact number of girls appearing for the exam that year?',
        options: [
          'A) 450',
          'B) 475',
          'C) 525',
          'D) 550'
        ],
        correctAnswer: 'B',
        explanation: 'Ratio G/B = 0.95. We are given B = 500. Therefore, G / 500 = 0.95 => G = 0.95 × 500 = (95 / 100) × 500 = 95 × 5 = 475 girls.'
      },
      {
        id: 'apt-line-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Data Insufficiency in Ratio Changes] The G/B ratio was 0.85 in 2012 and 1.05 in 2013. What is the percentage increase in the absolute number of girls from 2012 to 2013?',
        question: 'A line graph shows the G/B ratio was exactly 0.85 in 2012 and exactly 1.05 in 2013. Based strictly on this information, what is the exact percentage increase in the absolute number of girls appearing in the exam from 2012 to 2013?',
        options: [
          'A) 20.00%',
          'B) 23.52%',
          'C) 25.00%',
          'D) Cannot be determined'
        ],
        correctAnswer: 'D',
        explanation: 'We are only given the ratios G1/B1 = 0.85 and G2/B2 = 1.05. Without knowing the absolute base values of B1 and B2 (the number of boys in 2012 and 2013), it is mathematically impossible to calculate the absolute values of G1 and G2. Therefore, the percentage increase cannot be determined.'
      },
      {
        id: 'apt-line-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Income Deduction from Profit %] Profit % of Company A in India is 17.5%. Absolute profit is 1,75,000 USD. Find Total Income. (Note: Profit % = Profit / Investment × 100; Income = Investment + Profit)',
        question: 'A line graph plots Profit Percentages. In India, Company A records a Profit Percentage of exactly 17.5%. If Company A\'s absolute monetary profit generated in India is exactly 1,75,000 USD, what is the exact Total Income of Company A in India? \n(Note: Profit % = [Profit / Total Investment] × 100, and Total Income = Total Investment + Profit).',
        options: [
          'A) 10,00,000 USD',
          'B) 11,75,000 USD',
          'C) 12,50,000 USD',
          'D) 13,25,000 USD'
        ],
        correctAnswer: 'B',
        explanation: '1) Profit % = 17.5%. Absolute Profit = 1,75,000. 2) Investment = (Profit / Profit %) × 100 = (1,75,000 / 17.5) × 100 = 10,000 × 100 = 10,00,000 USD. 3) Total Income = Investment + Profit = 10,00,000 + 1,75,000 = 11,75,000 USD.'
      },
      {
        id: 'apt-line-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Ratio of Incomes given Equal Investment] Company A Profit % in Dubai is 18%. Company B Profit % in Dubai is 14%. If their absolute investments in Dubai are exactly identical, what is the ratio of their Total Incomes?',
        question: 'A line graph shows Company A has an 18% profit margin in Dubai, while Company B has a 14% profit margin in Dubai. If Company A and Company B both invested the exact same absolute monetary amount in Dubai, what is the exact mathematical ratio of the Total Income of Company A to the Total Income of Company B?',
        options: [
          'A) 9 : 7',
          'B) 54 : 57',
          'C) 59 : 57',
          'D) 61 : 58'
        ],
        correctAnswer: 'C',
        explanation: 'Let identical investment = x. Income = Investment + Profit. Income of A = x + 18% of x = 118% of x = 1.18x. Income of B = x + 14% of x = 114% of x = 1.14x. Ratio Income A : Income B = 1.18x / 1.14x = 118 / 114. Divide numerator and denominator by 2: 59 : 57.'
      },
      {
        id: 'apt-line-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Tabular Algebraic Substitution] Net Salary = Gross + HA + Special - Tax. Level 2: HA=8000, Tax=200, Net=25800. Special = 80% of Gross. Find Gross Salary.',
        question: 'A data table operates on the formula: Net Salary = Gross Salary + HA + Special Allowance - Professional Tax. For a Level 2 employee, the table shows: HA = ₹8,000, Professional Tax = ₹200, and Net Salary = ₹25,800. The notes state that Special Allowance is exactly 80% of the Gross Salary. What is the exact Gross Salary?',
        options: [
          'A) ₹8,000',
          'B) ₹10,000',
          'C) ₹12,000',
          'D) ₹14,000'
        ],
        correctAnswer: 'B',
        explanation: 'Let Gross Salary = x. Special Allowance = 0.8x. Formula: 25800 = x + 8000 + 0.8x - 200 => 25800 = 1.8x + 7800 => 1.8x = 25800 - 7800 = 18000 => 1.8x = 18000 => x = 18000 / 1.8 = ₹10,000.'
      },
      {
        id: 'apt-line-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Reverse Tabular Calculation] Level 1: Gross=9000, HA=5000, Tax=200. Net is double the Gross. Find Special Allowance.',
        question: 'Using the formula: Net Salary = Gross Salary + HA + Special Allowance - Professional Tax. For a Level 1 employee, Gross Salary = ₹9,000, HA = ₹5,000, and Professional Tax = ₹200. If the Net Salary is exactly double the Gross Salary, what is the exact absolute value of the Special Allowance?',
        options: [
          'A) ₹3,800',
          'B) ₹4,000',
          'C) ₹4,200',
          'D) ₹4,600'
        ],
        correctAnswer: 'C',
        explanation: 'Gross = 9000. Net Salary is double the Gross = 2 × 9000 = 18,000. Equation: 18000 = 9000 + 5000 + Special - 200 => 18000 = 14000 + Special - 200 => 18000 = 13800 + Special => Special = 18000 - 13800 = ₹4,200.'
      },
      {
        id: 'apt-line-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Percentage Comparison between Tabular Rows] Special Allowance Level 2 = 8000. Special Allowance Level 1 = 4200. Special Level 2 is what percent of Special Level 1?',
        question: 'In a completed data table, the Special Allowance for a Level 2 employee is strictly ₹8,000, and the Special Allowance for a Level 1 employee is strictly ₹4,200. The Special Allowance paid to the Level 2 employee is exactly what percentage of the Special Allowance paid to the Level 1 employee?',
        options: [
          'A) 175.5%',
          'B) 180.2%',
          'C) 190.4%',
          'D) 195.8%'
        ],
        correctAnswer: 'C',
        explanation: 'We need to find (Special L2 / Special L1) × 100. Percentage = (8000 / 4200) × 100 = (80 / 42) × 100 = (40 / 21) × 100 = 4000 / 21. 4000 / 21 ≈ 190.47%. Option C (190.4%) matches closest.'
      },
      {
        id: 'apt-line-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Irrelevant Multiplier Trap] Level 4: HA=8000, Special=10000. If 3 employees work at level 4, ratio of total HA to total Special?',
        question: 'For a Level 4 employee, the base HA is strictly ₹8,000 and the base Special Allowance is strictly ₹10,000. If exactly 3 distinct employees are concurrently working at Level 4, what is the exact mathematical ratio of the total aggregate amount spent by the company on HA to the total aggregate amount spent on Special Allowance for these three employees?',
        options: [
          'A) 12 : 15',
          'B) 4 : 5',
          'C) 8 : 15',
          'D) 24 : 10'
        ],
        correctAnswer: 'B',
        explanation: 'Total HA for 3 employees = 3 × 8000. Total Special for 3 employees = 3 × 10000. Ratio = (3 × 8000) / (3 × 10000). The multiplier \'3\' strictly cancels out! Ratio = 8000 / 10000 = 8 / 10 = 4 : 5. The number of employees is irrelevant decoy data.'
      },
      {
        id: 'apt-line-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Line Graph Intersect Deduction] Line A (Revenue) and Line B (Cost) intersect at Year 3 with value $50,000. What is the profit in Year 3?',
        question: 'A multiple-series line graph plots Total Revenue (Line A) and Total Cost (Line B) over 5 years. In Year 3, Line A and Line B perfectly intersect each other at the exact value of $50,000 on the y-axis. What is the exact absolute monetary profit generated in Year 3? (Note: Profit = Revenue - Cost)',
        options: [
          'A) -$50,000',
          'B) $0',
          'C) $50,000',
          'D) $100,000'
        ],
        correctAnswer: 'B',
        explanation: 'An intersection point means the two values are mathematically identical. Revenue = $50,000 and Cost = $50,000. Profit = Revenue - Cost = 50000 - 50000 = $0 (Break-even point).'
      },
      {
        id: 'apt-line-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Dual Axis Line Graph] Axis 1 (Production in thousands): 10, 15, 20. Axis 2 (Defect Rate %): 5%, 4%, 2%. What is the exact total absolute number of non-defective units produced over all 3 years combined?',
        question: 'A dual-axis line graph tracks a factory over 3 years. The left axis tracks Total Production (in thousands of units): Year 1 = 10, Year 2 = 15, Year 3 = 20. The right axis tracks the Defect Rate Percentage: Year 1 = 5%, Year 2 = 4%, Year 3 = 2%. What is the exact absolute total number of NON-defective units produced over all 3 years combined?',
        options: [
          'A) 41,500',
          'B) 42,600',
          'C) 43,500',
          'D) 45,000'
        ],
        correctAnswer: 'C',
        explanation: '1) Year 1: Total = 10,000. Non-defective = 95% of 10,000 = 9,500. 2) Year 2: Total = 15,000. Non-defective = 96% of 15,000 = 14,400. 3) Year 3: Total = 20,000. Non-defective = 98% of 20,000 = 19,600. Total non-defective = 9500 + 14400 + 19600 = 43,500 units.'
      },
      {
        id: 'apt-line-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Slope as Growth Rate] A line graph of revenue is a perfectly straight line passing through (Year 1, $20k) and (Year 4, $80k). What is the projected revenue in Year 6?',
        question: 'A line graph tracking a company\'s annual revenue forms a perfectly straight diagonal line. The data point for Year 1 is exactly $20,000 and the data point for Year 4 is exactly $80,000. Assuming the strictly linear trend continues, what will be the exact projected revenue in Year 6?',
        options: [
          'A) $100,000',
          'B) $110,000',
          'C) $120,000',
          'D) $140,000'
        ],
        correctAnswer: 'C',
        explanation: 'Calculate the constant linear slope (growth per year): Slope = (Change in Revenue) / (Change in Years) = (80000 - 20000) / (4 - 1) = 60000 / 3 = $20,000 per year. Revenue in Year 6 = Revenue in Year 4 + (2 years × $20,000) = 80000 + 40000 = $120,000.'
      },
      {
        id: 'apt-line-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Averaging Ratios vs Ratio of Averages] Is the average of the yearly G/B ratios equal to the ratio of total Girls to total Boys over the period?',
        question: 'A line graph provides the specific mathematical ratio of Girls to Boys (G/B) for 5 consecutive years. An analyst wants to find the true overall ratio of the total number of girls across all 5 years combined to the total number of boys across all 5 years combined. Can this be mathematically computed by simply taking the simple arithmetic average of the 5 yearly G/B ratios?',
        options: [
          'A) Yes, because averages distribute linearly over fractions',
          'B) Yes, if the absolute number of girls is constant each year',
          'C) No, it requires the absolute number of total students for each year to compute weighted components',
          'D) No, it requires strictly the absolute number of girls for each year'
        ],
        correctAnswer: 'C',
        explanation: 'A simple average of ratios is mathematically meaningless when trying to find an aggregate ratio, because the denominators (the absolute base numbers of boys each year) are not uniformly weighted. To find the true aggregate ratio, the absolute base values (or total student populations) for EACH specific year must be known to compute the weighted totals. (Option C captures the fundamental necessity of base totals).'
      },
      {
        id: 'apt-line-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Index Graph Base Year Logic] Base Year 2010 Index = 100. Year 2015 Index = 150. Year 2020 Index = 225. Percentage growth from 2015 to 2020?',
        question: 'An economic index line graph is normalized such that the Base Year 2010 is set to an Index of exactly 100. The Index reaches exactly 150 in 2015, and reaches exactly 225 in 2020. What is the exact percentage growth of the economy strictly from 2015 to 2020?',
        options: [
          'A) 50%',
          'B) 75%',
          'C) 125%',
          'D) 150%'
        ],
        correctAnswer: 'A',
        explanation: 'The growth is calculated between the specific data points of 2015 (Index 150) and 2020 (Index 225). Absolute index growth = 225 - 150 = 75. The "base" for this specific period is 150. Percentage growth = (75 / 150) × 100 = 1/2 × 100 = 50%.'
      },
      {
        id: 'apt-line-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Extrapolating Total from Table Formula] Gross=20k. HA=2k. Special=x. Tax=500. If Special is 25% of Net, find Net.',
        question: 'A customized tabular formula dictates: Net Salary = Gross Salary + HA + Special Allowance - Tax. An employee\'s record shows: Gross Salary = ₹20,000, HA = ₹2,000, and Tax = ₹500. If the exact value of the Special Allowance is dynamically defined as exactly 25% of the FINAL Net Salary, what is the exact mathematical value of the Net Salary?',
        options: [
          'A) ₹26,500',
          'B) ₹27,200',
          'C) ₹28,666.67',
          'D) ₹30,000'
        ],
        correctAnswer: 'C',
        explanation: 'Let Net Salary = N. Special Allowance = 0.25N. Formula: N = 20000 + 2000 + 0.25N - 500 => N = 21500 + 0.25N => 0.75N = 21500 => (3/4)N = 21500 => N = 21500 × 4 / 3 = 86000 / 3 = ₹28,666.67.'
      },
      {
        id: 'apt-line-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Line Graph Area Under Curve] A line graph plots Speed (m/s) on y-axis vs Time (s) on x-axis. Data points: (0,0), (10,20), (30,20). Total distance?',
        question: 'A line graph plots a vehicle\'s Speed in m/s on the y-axis against Time in seconds on the x-axis. The vehicle starts at point (0, 0), uniformly accelerates to point (10, 20), and then maintains that constant speed until point (30, 20). What is the exact total absolute distance covered by the vehicle in these 30 seconds?',
        options: [
          'A) 300 meters',
          'B) 400 meters',
          'C) 500 meters',
          'D) 600 meters'
        ],
        correctAnswer: 'C',
        explanation: 'The total distance is the area under the Speed-Time line graph. 1) Triangle area from t=0 to t=10: 1/2 × Base × Height = 1/2 × 10 × 20 = 100 meters. 2) Rectangle area from t=10 to t=30: Base × Height = (30 - 10) × 20 = 20 × 20 = 400 meters. Total distance = 100 + 400 = 500 meters.'
      },
      {
        id: 'apt-line-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Cumulative Line Graph Extraction] Cumulative sales graph: Jan=10, Feb=25, Mar=45, Apr=50. Sales in March alone?',
        question: 'A specific line graph plots the CUMULATIVE year-to-date sales (in thousands) of a product. The plotted data points are: January = 10, February = 25, March = 45, and April = 50. What were the exact absolute sales achieved strictly in the month of March alone?',
        options: [
          'A) 15',
          'B) 20',
          'C) 25',
          'D) 45'
        ],
        correctAnswer: 'B',
        explanation: 'Cumulative sales for March means the total sum of sales in Jan, Feb, and March is 45. Cumulative sales for February means the total sum of sales in Jan and Feb is 25. The sales exclusively in March is the difference between March\'s cumulative total and February\'s cumulative total. Sales in March = 45 - 25 = 20 (thousand).'
      },
      {
        id: 'apt-line-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Profit vs Revenue Line Divergence] Line A (Revenue) grows 10% per year. Line B (Cost) grows 5% per year. Base Year Rev=$100, Cost=$80. Profit in Year 2?',
        question: 'A line graph tracks Revenue and Cost. In the Base Year (Year 0), absolute Revenue is exactly $100 and absolute Cost is exactly $80. If Revenue strictly grows by a constant 10% each subsequent year, and Cost strictly grows by a constant 5% each subsequent year, what is the exact absolute mathematical Profit in Year 2? (Note: Profit = Revenue - Cost)',
        options: [
          'A) $28.00',
          'B) $30.50',
          'C) $32.80',
          'D) $35.00'
        ],
        correctAnswer: 'C',
        explanation: '1) Revenue in Year 2 = 100 × (1.10)^2 = 100 × 1.21 = $121.00. 2) Cost in Year 2 = 80 × (1.05)^2 = 80 × 1.1025 = $88.20. 3) Profit in Year 2 = Revenue - Cost = 121.00 - 88.20 = $32.80.'
      },
      {
        id: 'apt-line-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Interpreting Market Share vs Market Size] Line Graph 1: Company X Market Share = 20%, 30%, 40%. Line Graph 2: Total Market Size = $10M, $8M, $5M. Does Company X\'s absolute revenue increase or decrease over time?',
        question: 'Two synchronized line graphs are presented. Graph 1 shows Company X\'s Market Share Percentage growing consistently: Year 1 = 20%, Year 2 = 30%, Year 3 = 40%. Graph 2 shows the Total Market Size in absolute Dollars shrinking consistently: Year 1 = $10M, Year 2 = $8M, Year 3 = $5M. What is the exact sequential trend of Company X\'s absolute monetary revenue over these 3 years?',
        options: [
          'A) Strictly increasing ($2M, $2.4M, $3M)',
          'B) Strictly decreasing ($2M, $1.6M, $1.2M)',
          'C) Increases then decreases ($2M, $2.4M, $2M)',
          'D) Decreases then increases ($2M, $1.8M, $2M)'
        ],
        correctAnswer: 'C',
        explanation: 'Calculate absolute revenue for each year (Market Share % × Total Market Size). Year 1: 20% of 10M = $2.0M. Year 2: 30% of 8M = $2.4M. Year 3: 40% of 5M = $2.0M. The trend goes $2.0M -> $2.4M -> $2.0M. Therefore, the absolute revenue increases from Year 1 to Year 2, and then strictly decreases from Year 2 to Year 3.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 35: ALGEBRA (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 35,
    slug: 'aptitude-quant-algebra',
    title: 'Algebra',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 78,
    video_url: 'http://www.youtube.com/watch?v=TV9rQm15sWo',
    video_title: 'Algebra - Shortcuts & Tricks for 2026 Placement Tests, Jobs & Exams',
    short_description: 'Master the Remainder Theorem, value substitution for complex rational expressions, inverse reciprocal equations (x + 1/x), and high-yield algebraic identities.',
    summary_markdown: `### 📌 1. The Remainder & Factor Theorems
* **Remainder Theorem:** If a polynomial \`f(x)\` is divided by \`(x - a)\`, the remainder is exactly equal to **\`f(a)\`**.
  * Shortcut: Set the divisor to 0 (\`x - a = 0\` → \`x = a\`). Substitute \`x = a\` into the polynomial.
  * If divided by \`(ax + b)\`, substitute **\`x = -b/a\`**.
* **Factor Theorem:** If the remainder is exactly 0, then \`(x - a)\` is a **perfect factor** of the polynomial. This means \`f(a) = 0\`.

### 💡 2. The Power of Substitution
* When asked to evaluate or simplify highly complex algebraic or rational expressions with variables (e.g., \`x, y, a\`), **assume simple numerical values** for the variables (like 0, 1, or 2).
* **Golden Rule of Substitution:** NEVER choose a value that forces any denominator to become **0** (which makes the expression undefined).
* Substitute the same assumed values into the multiple-choice options. The correct option will yield the exact same numerical result as the question's expression.

### 💡 3. Inverse Reciprocal Shortcuts \`(x + 1/x)\`
* If **\`x + 1/x = a\`**:
  * **\`x^2 + 1/x^2 = a^2 - 2\`**
  * **\`x^3 + 1/x^3 = a^3 - 3a\`**
* If **\`x - 1/x = a\`**:
  * **\`x^2 + 1/x^2 = a^2 + 2\`**
* **Reverse Finding:** If given \`x^2 + 1/x^2 = A\`, to find \`x + 1/x\`, add 2 and take the square root: **\`√(A + 2)\`**. To find \`x - 1/x\`, subtract 2 and take the square root: **\`√(A - 2)\`**.

### 💡 4. Rationalizing Surds
* If \`x = A + B√C\` and the difference of squares \`A^2 - (B√C)^2 = 1\`, then **\`1/x = A - B√C\`**.
* Adding them yields \`x + 1/x = 2A\` (exactly twice the larger term). Subtracting them yields \`x - 1/x = 2B√C\` (exactly twice the smaller term).`,
    questions: [
      {
        id: 'apt-alg-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Applying the Remainder Theorem] Find the remainder when the polynomial 2x^3 + 13x^2 - 5x + 1 is divided by x + 4.',
        question: 'What is the exact mathematical remainder when the algebraic polynomial (2x^3 + 13x^2 - 5x + 1) is completely divided by the linear binomial (x + 4)?',
        options: [
          'A) 101',
          'B) 105',
          'C) 121',
          'D) 229'
        ],
        correctAnswer: 'A',
        explanation: 'Set divisor to 0: x + 4 = 0 => x = -4. Substitute x = -4 into the polynomial: 2(-4)^3 + 13(-4)^2 - 5(-4) + 1 = 2(-64) + 13(16) + 20 + 1 = -128 + 208 + 20 + 1 = 101. The remainder is 101.'
      },
      {
        id: 'apt-alg-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Factor Theorem Unknown Parameter] 5x^3 - 3x^2 + cx + 2 divided by x + 3 leaves remainder 5. Find c.',
        question: 'If the polynomial (5x^3 - 3x^2 + cx + 2) is divided by the binomial (x + 3), it leaves a remainder of exactly 5. What is the exact numerical value of the constant c?',
        options: [
          'A) -50',
          'B) -55',
          'C) -60',
          'D) -65'
        ],
        correctAnswer: 'B',
        explanation: 'Set x + 3 = 0 => x = -3. Substitute x = -3 and set the result equal to the remainder (5): 5(-3)^3 - 3(-3)^2 + c(-3) + 2 = 5 => 5(-27) - 3(9) - 3c + 2 = 5 => -135 - 27 - 3c + 2 = 5 => -160 - 3c = 5 => -3c = 165 => c = -165 / 3 = -55.'
      },
      {
        id: 'apt-alg-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [High Power Polynomial Remainder] Find the remainder when x^529 - 1 is divided by x + 1.',
        question: 'What is the exact mathematical remainder when the extremely high-degree polynomial (x^529 - 1) is completely divided by the linear binomial (x + 1)?',
        options: [
          'A) -2',
          'B) -1',
          'C) 0',
          'D) 1'
        ],
        correctAnswer: 'A',
        explanation: 'Set x + 1 = 0 => x = -1. Substitute x = -1 into the polynomial: (-1)^529 - 1. Since 529 is an ODD power, (-1)^529 = -1. The expression evaluates to -1 - 1 = -2. The remainder is exactly -2.'
      },
      {
        id: 'apt-alg-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Polynomial Divisor x^2 - a^2] 3x^3 + 6x^2 + 4a divided by x^2 - 4 leaves remainder 12x. Find a.',
        question: 'When the algebraic expression (3x^3 + 6x^2 + 4a) is divided by the quadratic binomial (x^2 - 4), it leaves a remainder of exactly 12x. What is the exact mathematical value of the constant a?',
        options: [
          'A) -4',
          'B) -6',
          'C) -8',
          'D) -12'
        ],
        correctAnswer: 'B',
        explanation: 'Set the divisor x^2 - 4 = 0 => x^2 = 4. Substitute x^2 = 4 directly into the expression. Rewrite the expression to isolate x^2 terms: 3x(x^2) + 6(x^2) + 4a. Substitute x^2 = 4: 3x(4) + 6(4) + 4a = 12x + 24 + 4a. This evaluated expression is exactly equal to the given remainder 12x. So, 12x + 24 + 4a = 12x. Cancel 12x from both sides: 24 + 4a = 0 => 4a = -24 => a = -6.'
      },
      {
        id: 'apt-alg-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Completely Divisible Constraint] x^1001 + 5x^999 + a is completely divisible by x + 1. Find a.',
        question: 'The massive polynomial expression (x^1001 + 5x^999 + a) is known to be completely and exactly divisible by the linear binomial (x + 1). What is the exact numerical value of the constant a?',
        options: [
          'A) 2',
          'B) 4',
          'C) 6',
          'D) 8'
        ],
        correctAnswer: 'C',
        explanation: '"Completely divisible" means the remainder is exactly 0. Set x + 1 = 0 => x = -1. Substitute x = -1 into the polynomial and set equal to 0: (-1)^1001 + 5(-1)^999 + a = 0. Since 1001 and 999 are both ODD powers, (-1)^odd = -1. So, -1 + 5(-1) + a = 0 => -1 - 5 + a = 0 => -6 + a = 0 => a = 6.'
      },
      {
        id: 'apt-alg-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Exponential Equation Simplification] If 5^x - 5^(x-1) = 500, find the value of x^x.',
        question: 'If a positive real number x satisfies the exponential equation 5^x - 5^(x-1) = 500, what is the exact numerical value of x^x?',
        options: [
          'A) 64',
          'B) 125',
          'C) 256',
          'D) 3,125'
        ],
        correctAnswer: 'C',
        explanation: 'Factor out the smaller power 5^(x-1) from the left side: 5^(x-1) × (5^1 - 1) = 500 => 5^(x-1) × (4) = 500 => 5^(x-1) = 500 / 4 = 125. Since 125 is 5^3, we equate the exponents: x - 1 = 3 => x = 4. We are asked for x^x, which is 4^4 = 256.'
      },
      {
        id: 'apt-alg-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Evaluating Complex Rational Expressions with Substitution] Evaluate the expression [2(x+3)]/[3(x-2)] - [2(x+1)]/[3(x-3)] using substitution.',
        question: 'Use the strategic substitution method to find which numerical fraction correctly simplifies the following complex algebraic expression when x = 0:\n[ 2(x+3) ] / [ 3(x-2) ]  -  [ 2(x+1) ] / [ 3(x-3) ]',
        options: [
          'A) 7 / 9',
          'B) -7 / 9',
          'C) 14 / 18',
          'D) -5 / 9'
        ],
        correctAnswer: 'B',
        explanation: 'Substitute x = 0 into the expression. Term 1: [2(0+3)] / [3(0-2)] = 6 / -6 = -1. Term 2: [2(0+1)] / [3(0-3)] = 2 / -9 = -2/9. Expression = -1 - (-2/9) = -1 + 2/9 = (-9 + 2) / 9 = -7/9.'
      },
      {
        id: 'apt-alg-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Multi-Variable Zero Denominator Trap] Find value of (a+1)/(a-1) + (a-1)/(a+1). What value of a should be assumed for fast calculation?',
        question: 'A student wants to use the variable substitution method to quickly evaluate the expression:\n[ (a+1) / (a-1) ] + [ (a-1) / (a+1) ]\nWhich of the following values of "a" is the mathematically SAFEST and FASTEST to substitute without creating undefined fractions?',
        options: [
          'A) a = 1',
          'B) a = -1',
          'C) a = 0',
          'D) Both A and B'
        ],
        correctAnswer: 'C',
        explanation: 'To use the substitution method, we must NEVER choose a value that makes any denominator 0. If a = 1, the first fraction denominator (a-1) becomes 0. If a = -1, the second fraction denominator (a+1) becomes 0. Therefore, a = 0 is the safest and fastest choice. (If a=0, Expression = 1/-1 + (-1)/1 = -1 - 1 = -2).'
      },
      {
        id: 'apt-alg-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q9: [Zero-ing Out Unnecessary Variables] If x+y=1, find sum of [3x^2+4y]/[x-4] and its reciprocal. Use substitution y=0.',
        question: 'Given the constraint equation x + y = 1. Using the advanced algebraic substitution method by assuming y = 0, what is the exact mathematical value of the sum of the expression [ (3x^2 + 4y) / (x - 4) ] and its direct reciprocal?',
        options: [
          'A) -2',
          'B) 0',
          'C) 2',
          'D) 4'
        ],
        correctAnswer: 'A',
        explanation: 'Assume y = 0. Then x + 0 = 1 => x = 1. Substitute x=1 and y=0 into the expression: [3(1)^2 + 4(0)] / [1 - 4] = 3 / -3 = -1. The expression evaluates to -1. Its reciprocal is 1 / -1 = -1. The sum of the expression and its reciprocal is -1 + (-1) = -2.'
      },
      {
        id: 'apt-alg-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Eliminating Target Expression Terms] If x + 5y + 3 = 0, find value of x^3 + 5y^3 + 12xy + 27.',
        question: 'Given the linear constraint equation x + 5y + 3 = 0. By utilizing the zero-substitution trick for the variable y, evaluate the exact numerical value of the large polynomial:\nx^3 + 5y^3 + 12xy + 27',
        options: [
          'A) -27',
          'B) 0',
          'C) 27',
          'D) 54'
        ],
        correctAnswer: 'B',
        explanation: 'Assume y = 0. The constraint becomes x + 0 + 3 = 0 => x = -3. Substitute x = -3 and y = 0 into the target polynomial. Since y=0, all terms containing y vanish (5y^3 and 12xy become 0). The polynomial collapses entirely to just x^3 + 27. Substitute x = -3: (-3)^3 + 27 = -27 + 27 = 0.'
      },
      {
        id: 'apt-alg-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q11: [Simultaneous Three-Variable Algebraic Reduction] If a+b+c = 25 and a^2+b^2+c^2 = 225, find 4a^2b^2 + c(a-b).',
        question: 'If a + b + c = 25 and simultaneously a^2 + b^2 + c^2 = 225. By assuming the variable c = 0 to rapidly simplify the system, what is the exact numerical value of the expression [ 4a^2b^2 + c(a - b) ]?',
        options: [
          'A) 16,000',
          'B) 62,500',
          'C) 160,000',
          'D) 400,000'
        ],
        correctAnswer: 'C',
        explanation: 'Assume c = 0. The constraints become: a + b = 25 and a^2 + b^2 = 225. The target expression collapses to just 4a^2b^2 (since c(a-b) = 0). We know (a+b)^2 = a^2 + b^2 + 2ab. Substitute known values: 25^2 = 225 + 2ab => 625 = 225 + 2ab => 2ab = 400. We need 4a^2b^2, which is exactly (2ab)^2. So (400)^2 = 160,000.'
      },
      {
        id: 'apt-alg-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Two Equations, Three Variables] x = a + 2/a, y = 2a - 2/a. Find value of (x^2 - y^2)(y^2 + 3) / (x^2 - 6).',
        question: 'Given the parametric equations x = a + 2/a and y = 2a - 2/a. By using a safe numerical substitution for the parameter "a" (such as a = 1), evaluate the exact numerical value of the fraction:\n[ (x^2 - y^2)(y^2 + 3) ] / [ x^2 - 6 ]',
        options: [
          'A) 3',
          'B) 6',
          'C) 9',
          'D) 12'
        ],
        correctAnswer: 'C',
        explanation: 'Let a = 1. Then x = 1 + 2/1 = 3. And y = 2(1) - 2/1 = 0. Substitute x=3 and y=0 into the target fraction: [ (3^2 - 0^2)(0^2 + 3) ] / [ 3^2 - 6 ] = [ (9)(3) ] / [ 9 - 6 ] = 27 / 3 = 9. (The mathematical value of this algebraic expression evaluates identically to a constant 9 for any valid non-zero choice of a).'
      },
      {
        id: 'apt-alg-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Inverse Reciprocal Square Trick] If x + 1/x = √47, find x^2 + 1/x^2.',
        question: 'If a positive real number x satisfies the equation x + 1/x = √47, what is the exact numerical value of the expression x^2 + 1/x^2?',
        options: [
          'A) 45',
          'B) 47',
          'C) 49',
          'D) 2207'
        ],
        correctAnswer: 'A',
        explanation: 'Use the shortcut identity: x^2 + 1/x^2 = (x + 1/x)^2 - 2. Given x + 1/x = √47. Squaring it gives (√47)^2 = 47. Subtract 2: 47 - 2 = 45.'
      },
      {
        id: 'apt-alg-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Multi-Stage Reciprocal Squaring] If x + 1/x = √6, find x^8 + 1/x^8.',
        question: 'Given the algebraic relation x + 1/x = √6. By sequentially applying the square expansion shortcut multiple times, what is the exact numerical value of x^8 + 1/x^8?',
        options: [
          'A) 194',
          'B) 196',
          'C) 198',
          'D) 254'
        ],
        correctAnswer: 'A',
        explanation: '1) x^2 + 1/x^2 = (√6)^2 - 2 = 6 - 2 = 4. 2) x^4 + 1/x^4 = (x^2 + 1/x^2)^2 - 2 = 4^2 - 2 = 16 - 2 = 14. 3) x^8 + 1/x^8 = (x^4 + 1/x^4)^2 - 2 = 14^2 - 2 = 196 - 2 = 194.'
      },
      {
        id: 'apt-alg-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q15: [Descending Power Reverse Trick] If x^4 + 1/x^4 = 23, find the positive value of x + 1/x.',
        question: 'If a positive real number x satisfies the high-order equation x^4 + 1/x^4 = 23. By stepping downwards using the reverse square trick, what is the exact positive numerical value of x + 1/x?',
        options: [
          'A) √5',
          'B) √7',
          'C) 5',
          'D) 7'
        ],
        correctAnswer: 'B',
        explanation: '1) We know (x^2 + 1/x^2)^2 = x^4 + 1/x^4 + 2. So, (x^2 + 1/x^2)^2 = 23 + 2 = 25. Taking the positive square root gives x^2 + 1/x^2 = 5. 2) We know (x + 1/x)^2 = x^2 + 1/x^2 + 2. So, (x + 1/x)^2 = 5 + 2 = 7. Taking the positive square root gives x + 1/x = √7.'
      },
      {
        id: 'apt-alg-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Alternating Sign Shortcut] If x - 1/x = 3, find x^4 + 1/x^4.',
        question: 'Given the inverse subtraction relation x - 1/x = 3. What is the exact mathematical value of the expression x^4 + 1/x^4?',
        options: [
          'A) 119',
          'B) 121',
          'C) 123',
          'D) 125'
        ],
        correctAnswer: 'A',
        explanation: '1) For subtraction: x^2 + 1/x^2 = (x - 1/x)^2 + 2 = 3^2 + 2 = 9 + 2 = 11. 2) Once we have x^2 + 1/x^2 = 11, the next step uses the standard addition rule! x^4 + 1/x^4 = (x^2 + 1/x^2)^2 - 2 = 11^2 - 2 = 121 - 2 = 119. (Note: Many mistakenly ADD 2 in the second step, but the sign rule flips back to subtraction once the base term is positive!).'
      },
      {
        id: 'apt-alg-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Inverse Reciprocal Cubing Trick] If x + 1/x = 3√2, find x^3 + 1/x^3.',
        question: 'Given the algebraic relation x + 1/x = 3√2. Using the direct cubing expansion shortcut, what is the exact mathematical value of x^3 + 1/x^3?',
        options: [
          'A) 45√2',
          'B) 54√2',
          'C) 45',
          'D) 54'
        ],
        correctAnswer: 'A',
        explanation: 'Use the shortcut identity: x^3 + 1/x^3 = a^3 - 3a. Here a = 3√2. 1) a^3 = (3√2)^3 = 27 × 2√2 = 54√2. 2) 3a = 3 × 3√2 = 9√2. 3) Subtract: 54√2 - 9√2 = 45√2.'
      },
      {
        id: 'apt-alg-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Rationalizing a Surd Inverse] If x = 5 + 2√6, find the value of x - 1/x.',
        question: 'If an irrational parameter is defined as x = 5 + 2√6, what is the exact simplified mathematical value of the expression (x - 1/x)?',
        options: [
          'A) 10',
          'B) 10 - 4√6',
          'C) 4√6',
          'D) 5√6'
        ],
        correctAnswer: 'C',
        explanation: '1) First, rationalize 1/x. 1/x = 1 / (5 + 2√6). Multiply top and bottom by conjugate (5 - 2√6). Denominator becomes 5^2 - (2√6)^2 = 25 - 24 = 1. So 1/x = 5 - 2√6. 2) Now compute x - 1/x = (5 + 2√6) - (5 - 2√6) = 5 + 2√6 - 5 + 2√6. The 5s cancel out, leaving exactly 4√6. (Shortcut: x - 1/x is always exactly twice the smaller radical term when difference of squares is 1).'
      },
      {
        id: 'apt-alg-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [High Power Conjugate Cancellation] If x^45 = 12 + 3√7, find 1 / x^45.',
        question: 'If a massive exponential term evaluates to x^45 = 12 + 3√7. Without attempting to find the value of x itself, what is the exact rationalized value of its reciprocal, 1 / x^45?',
        options: [
          'A) (12 - 3√7) / 81',
          'B) (12 + 3√7) / 81',
          'C) (12 - 3√7) / 10',
          'D) (12 - 3√7) / 12'
        ],
        correctAnswer: 'A',
        explanation: 'Let y = x^45. So y = 12 + 3√7. We need 1/y = 1 / (12 + 3√7). Rationalize by multiplying top and bottom by (12 - 3√7). Numerator = 12 - 3√7. Denominator = 12^2 - (3√7)^2 = 144 - (9 × 7) = 144 - 63 = 81. Thus, 1/y = (12 - 3√7) / 81.'
      },
      {
        id: 'apt-alg-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Double Base Rationalization Shortcut] If x = 13 + 3√2, find the denominator of 1/x after rationalization.',
        question: 'If an irrational value is given as x = 13 + 3√2, what will be the exact mathematical denominator of the fractional expression 1/x after it has been completely rationalized?',
        options: [
          'A) 100',
          'B) 151',
          'C) 169',
          'D) 187'
        ],
        correctAnswer: 'B',
        explanation: '1/x = 1 / (13 + 3√2). To rationalize, multiply top and bottom by conjugate (13 - 3√2). The denominator becomes the difference of squares: 13^2 - (3√2)^2 = 169 - (9 × 2) = 169 - 18 = 151.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 36: STATISTICS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 36,
    slug: 'aptitude-quant-statistics',
    title: 'Statistics',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 79,
    video_url: 'http://www.youtube.com/watch?v=6Jrb4wEloCQ',
    video_title: 'Statistics - Shortcuts & Tricks for Placement Tests, Jobs & Exams',
    short_description: 'Calculate mean, median, mode, variance, standard deviation, and coefficient of variance. Master the Assumed Mean Method and cumulative frequency median formulas.',
    summary_markdown: `### 📌 1. Measures of Central Tendency
* **Mean (Average):** \`x̄ = (Σx) / n\`
  * For grouped frequency data: \`x̄ = (Σfx) / Σf\`
  * **Assumed Mean Shortcut:** \`x̄ = A + (Σfd / Σf)\`, where \`A\` is the assumed mean and \`d = x - A\`.
* **Mode:** The value that appears most frequently.
  * For grouped data: **\`Mode = L + [ (f1 - f0) / (2f1 - f0 - f2) ] × h\`**
    (where \`L\` = lower limit of modal class, \`f1\` = frequency of modal class, \`f0\` = frequency of previous class, \`f2\` = frequency of next class, \`h\` = class range).
* **Median:** The exact middle value when sorted.
  * For odd \`N\`: \`((N+1)/2)\`-th term.
  * For even \`N\`: Average of \`(N/2)\`-th and \`(N/2 + 1)\`-th terms.
  * For grouped data: **\`Median = L + [ (N/2 - CF) / f ] × h\`**
    (where \`CF\` = cumulative frequency of preceding class).

### 💡 2. The Golden Empirical Relationship
* **\`Mode = 3(Median) - 2(Mean)\`**
  *(Memorize this! Countless objective questions ask for one value given the other two).*

### 💡 3. Measures of Dispersion & Transformation Properties
* **Variance (\`σ^2\`):** \`σ^2 = Σ(x - x̄)^2 / n\`
  (Measures how spread out the data points are from the mean. ALWAYS positive).
* **Standard Deviation (\`σ\`):** \`σ = √(Variance)\`
* **Coefficient of Variance (CV):** \`CV = (σ / x̄) × 100 %\`
* **Transformation Rules for Mean:**
  * If a constant \`K\` is added/subtracted to every observation, the new Mean is exactly **\`Old Mean ± K\`**.
  * If every observation is multiplied/divided by \`K\`, the new Mean is exactly **\`Old Mean ×/÷ K\`**.`,
    questions: [
      {
        id: 'apt-stat-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q1: [Grouped Data Class Mark Calculation] Find the class mark for the interval 40 to 60.',
        question: 'In a grouped frequency distribution table, what is the exact mathematical "class mark" (mid-point) for the specific class interval defined as 40 to 60?',
        options: [
          'A) 20',
          'B) 40',
          'C) 50',
          'D) 100'
        ],
        correctAnswer: 'C',
        explanation: 'The class mark is the midpoint of the class interval. Formula: Class Mark = (Lower Limit + Upper Limit) / 2 = (40 + 60) / 2 = 100 / 2 = 50.'
      },
      {
        id: 'apt-stat-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Mean of Simple Frequency Distribution] Scores: 25(f=10), 30(f=8), 32(f=10), 35(f=4). Total f=50, Total fx=1755. Find mean.',
        question: 'In a discrete frequency distribution table tracking student marks, the sum of all frequencies (Σf) is exactly 50, and the sum of the products of marks and their respective frequencies (Σfx) is exactly 1755. What is the exact mean score of the class?',
        options: [
          'A) 34.1',
          'B) 35.1',
          'C) 36.5',
          'D) 37.0'
        ],
        correctAnswer: 'B',
        explanation: 'The formula for the mean of a frequency distribution is x̄ = (Σfx) / Σf. Substitute the given values: x̄ = 1755 / 50 = 351 / 10 = 35.1.'
      },
      {
        id: 'apt-stat-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Applying Assumed Mean Method] If assumed mean A=50, total frequency Σf=400, and Σfd = -900, find the true mean.',
        question: 'A statistician uses the Assumed Mean Method to calculate the average of a massive dataset. She selects an assumed mean (A) of exactly 50. Her calculations show that the sum of all frequencies (Σf) is 400, and the sum of the frequency-deviation products (Σfd) is exactly -900. What is the true mathematical mean of the dataset?',
        options: [
          'A) 47.75',
          'B) 48.25',
          'C) 52.25',
          'D) 54.50'
        ],
        correctAnswer: 'A',
        explanation: 'Formula for True Mean: x̄ = A + (Σfd / Σf). Substitute values: x̄ = 50 + (-900 / 400) = 50 - 9/4 = 50 - 2.25 = 47.75.'
      },
      {
        id: 'apt-stat-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Property of Mean - Transformation] The mean of 17 terms is 25. What is the new mean if 5 is subtracted from each observation?',
        question: 'The mathematically calculated mean of a dataset comprising 17 terms is exactly 25. If a constant value of 5 is completely subtracted from every single observation in the dataset, what will be the exact value of the new mean?',
        options: [
          'A) 20',
          'B) 25',
          'C) 30',
          'D) 125'
        ],
        correctAnswer: 'A',
        explanation: 'Property of Mean: If a constant K is subtracted from every single observation in a dataset, the overall mean strictly decreases by that exact same constant K. New Mean = Old Mean - 5 = 25 - 5 = 20.'
      },
      {
        id: 'apt-stat-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Property of Mean - Multiplication] The mean of 10 terms is 15. What is the new mean if each observation is multiplied by 2?',
        question: 'The calculated mean of a dataset of 10 numerical observations is exactly 15. If every single observation in the dataset is strictly multiplied by a constant factor of 2, what will be the exact value of the new mean?',
        options: [
          'A) 15',
          'B) 17',
          'C) 30',
          'D) 150'
        ],
        correctAnswer: 'C',
        explanation: 'Property of Mean: If every observation in a dataset is mathematically multiplied by a constant factor K, the overall mean is strictly multiplied by that exact same factor K. New Mean = Old Mean × 2 = 15 × 2 = 30.'
      },
      {
        id: 'apt-stat-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Calculating Variance from Scratch] Find the variance of the dataset: 10, 9, 12, 10, 9, 4. (Mean = 9)',
        question: 'Calculate the exact mathematical variance (σ^2) of the following small dataset of 6 numbers: 10, 9, 12, 10, 9, 4. (Hint: The mean of this dataset is exactly 9).',
        options: [
          'A) 5',
          'B) 6',
          'C) 7.5',
          'D) 36'
        ],
        correctAnswer: 'B',
        explanation: '1) Mean x̄ = 9. 2) Find deviations (x - x̄): (10-9)=1, (9-9)=0, (12-9)=3, (10-9)=1, (9-9)=0, (4-9)=-5. 3) Square the deviations: 1, 0, 9, 1, 0, 25. 4) Sum of squared deviations = 1 + 0 + 9 + 1 + 0 + 25 = 36. 5) Variance = Sum / N = 36 / 6 = 6.'
      },
      {
        id: 'apt-stat-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Standard Deviation from Variance] If the calculated variance of a dataset is 4, what is its standard deviation?',
        question: 'If the mathematically calculated variance (σ^2) of an extensive statistical dataset is exactly 4, what is its exact Standard Deviation (σ)?',
        options: [
          'A) -2',
          'B) 2',
          'C) 8',
          'D) 16'
        ],
        correctAnswer: 'B',
        explanation: 'Standard Deviation (σ) is defined strictly as the POSITIVE square root of the variance. σ = √4 = +2. (A standard deviation cannot be a negative value).'
      },
      {
        id: 'apt-stat-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Coefficient of Variance Calculation] Mean = 16, Variance = 4. Find Coefficient of Variance.',
        question: 'The calculated mean of a given dataset is exactly 16, and its variance is exactly 4. What is the exact Coefficient of Variance (CV) expressed as a percentage?',
        options: [
          'A) 12.5%',
          'B) 15.0%',
          'C) 25.0%',
          'D) 50.0%'
        ],
        correctAnswer: 'A',
        explanation: '1) Standard Deviation (σ) = √Variance = √4 = 2. 2) Coefficient of Variance (CV) = (σ / Mean) × 100 %. 3) CV = (2 / 16) × 100 = (1 / 8) × 100 = 100 / 8 = 12.5%.'
      },
      {
        id: 'apt-stat-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q9: [Identifying Mode vs Modal Frequency] Data: value 2 occurs 3 times, value 3 occurs 2 times, value 4 occurs 2 times. Find mode.',
        question: 'In a statistical observation sheet, the numeric value "2" occurs 3 times, the value "3" occurs 2 times, and the value "4" occurs 2 times. Which of the following is the true mathematical Mode of this dataset?',
        options: [
          'A) 2',
          'B) 3',
          'C) 4',
          'D) Cannot be determined'
        ],
        correctAnswer: 'A',
        explanation: 'Mode is defined strictly as the specific data value that appears the absolute maximum number of times in the dataset (i.e., has the highest frequency). The highest frequency is 3, which corresponds strictly to the data value "2". The Mode is 2.'
      },
      {
        id: 'apt-stat-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Grouped Data Mode Calculation] Modal class limits L=4000, f1=18, f0=4, f2=11, range h=1000. Calculate the exact Mode.',
        question: 'For a grouped frequency distribution, the identified modal class has a lower limit L = 4000 and a class width h = 1000. The frequencies are: modal class f1 = 18, preceding class f0 = 4, and succeeding class f2 = 11. What is the exact mathematical Mode of this dataset?',
        options: [
          'A) 4,333.33',
          'B) 4,666.66',
          'C) 4,800.00',
          'D) 5,100.00'
        ],
        correctAnswer: 'B',
        explanation: 'Use the Mode formula: Mode = L + [ (f1 - f0) / (2f1 - f0 - f2) ] × h. 1) Numerator: f1 - f0 = 18 - 4 = 14. 2) Denominator: 2(18) - 4 - 11 = 36 - 15 = 21. 3) Fraction: 14 / 21 = 2 / 3. 4) Multiply by h: (2/3) × 1000 = 2000 / 3 ≈ 666.66. 5) Add L: 4000 + 666.66 = 4666.66.'
      },
      {
        id: 'apt-stat-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Median Position for Even N] A sorted dataset has exactly 6 elements. Which positions determine the median?',
        question: 'An unorganized dataset containing exactly 6 numerical elements is completely sorted into strict ascending order. Which specific positional terms must be averaged to determine the exact median of this dataset?',
        options: [
          'A) 2nd and 3rd terms',
          'B) 3rd and 4th terms',
          'C) 4th and 5th terms',
          'D) Just the 3rd term'
        ],
        correctAnswer: 'B',
        explanation: 'For a dataset with an EVEN number of total terms (N = 6), the median cannot be a single central term. It must be computed as the exact arithmetic average of the (N/2)-th term and the (N/2 + 1)-th term. Here, 6/2 = 3rd term, and 3+1 = 4th term. Thus, average the 3rd and 4th terms.'
      },
      {
        id: 'apt-stat-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Median Calculation for Odd N Dataset] Sorted data: 2, 3, 4, 5, 8, 9, 11. Find the median.',
        question: 'Consider the following statistical dataset which has already been sorted into strict ascending order: 2, 3, 4, 5, 8, 9, 11. What is the exact mathematical median of this dataset?',
        options: [
          'A) 4',
          'B) 5',
          'C) 6',
          'D) 8'
        ],
        correctAnswer: 'B',
        explanation: 'The dataset has exactly an ODD number of total elements (N = 7). The median is precisely located at the ((N + 1) / 2)-th position. (7 + 1) / 2 = 8 / 2 = 4th position. Counting from the left, the 4th term is exactly 5.'
      },
      {
        id: 'apt-stat-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Finding the Median Class via CF] Cumulative frequency row: 5, 9, 16, 22, 30. Total N=30. N/2 = 15. Which CF range contains the median?',
        question: 'A statistician constructs a cumulative frequency (CF) table for grouped data. The consecutive CF values are: 5, 9, 16, 22, 30. The total number of observations N is 30, making N/2 = 15. The median mathematically resides in the class interval corresponding to which specific CF value?',
        options: [
          'A) 9',
          'B) 16',
          'C) 22',
          'D) 30'
        ],
        correctAnswer: 'B',
        explanation: 'To locate the median class, we find the cumulative frequency that is STRICTLY GREATER THAN (or equal to) N/2. Since N/2 = 15, we look sequentially through the CF row: 5 (too small), 9 (too small), 16 (first value ≥ 15!). Therefore, the median class is definitively the one associated with the CF of 16.'
      },
      {
        id: 'apt-stat-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Grouped Data Median Formula] Median class limits: L=50, N/2=15, CF(preceding)=9, f=7, h=5. Calculate the exact Median.',
        question: 'For a grouped frequency distribution, the identified median class has a lower limit L = 50 and a class width h = 5. The total observations yield N/2 = 15. The cumulative frequency of the preceding class (CF) is 9, and the frequency of the median class itself (f) is 7. What is the exact mathematical Median of this dataset?',
        options: [
          'A) 53.14',
          'B) 54.28',
          'C) 55.00',
          'D) 56.42'
        ],
        correctAnswer: 'B',
        explanation: 'Use the Median formula: Median = L + [ (N/2 - CF) / f ] × h. 1) Numerator: N/2 - CF = 15 - 9 = 6. 2) Fraction: 6 / 7. 3) Multiply by h: (6/7) × 5 = 30 / 7 ≈ 4.285. 4) Add L: 50 + 4.285 = 54.285... Rounding to two decimal places gives 54.28.'
      },
      {
        id: 'apt-stat-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Golden Empirical Rule: Finding Mode] If the ratio of Mean to Median is 3:7, find the ratio of Mean to Mode.',
        question: 'In a moderately skewed statistical distribution, the ratio of the Mean to the Median is precisely 3 : 7. Using the standard empirical relationship between the measures of central tendency, what is the exact mathematical ratio of the Mean to the Mode?',
        options: [
          'A) 1 : 4',
          'B) 1 : 5',
          'C) 3 : 15',
          'D) Both B and C'
        ],
        correctAnswer: 'D',
        explanation: 'Let Mean = 3x and Median = 7x. Empirical Formula: Mode = 3(Median) - 2(Mean). Substitute values: Mode = 3(7x) - 2(3x) = 21x - 6x = 15x. The question asks for the ratio of Mean to Mode: 3x / 15x = 3 / 15. Dividing by 3 simplifies this to 1 / 5. Thus, both 3:15 and 1:5 are mathematically correct.'
      },
      {
        id: 'apt-stat-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Golden Empirical Rule: Finding Mean] If Mode is 24 and Median is 20, what is the Mean?',
        question: 'In a moderately skewed continuous frequency distribution, the calculated Mode is exactly 24 and the calculated Median is exactly 20. Utilizing the fundamental empirical relationship, what must be the exact value of the Mean?',
        options: [
          'A) 16',
          'B) 18',
          'C) 22',
          'D) 26'
        ],
        correctAnswer: 'B',
        explanation: 'Empirical Formula: Mode = 3(Median) - 2(Mean). Substitute the known values: 24 = 3(20) - 2(Mean) => 24 = 60 - 2(Mean). Rearrange to isolate the Mean: 2(Mean) = 60 - 24 = 36. Divide by 2: Mean = 36 / 2 = 18.'
      },
      {
        id: 'apt-stat-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Identifying Median from a Frequency Table without CF] Given frequencies: 2, 4, 6, 8. What is the position of the median?',
        question: 'A discrete frequency table lists four consecutive increasing data values with frequencies of exactly 2, 4, 6, and 8 respectively. At which specific position(s) does the exact mathematical median of this entire dataset reside?',
        options: [
          'A) 10th position',
          'B) Average of 10th and 11th positions',
          'C) 11th position',
          'D) Average of 11th and 12th positions'
        ],
        correctAnswer: 'B',
        explanation: 'First, find the total number of observations N by summing the frequencies: N = 2 + 4 + 6 + 8 = 20. Since N is an EVEN number (20), the median is not a single term. It must be computed as the exact arithmetic average of the (N/2)-th term and the (N/2 + 1)-th term. 20/2 = 10. Thus, average the 10th and 11th positional terms.'
      },
      {
        id: 'apt-stat-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Finding the Range of Grouped Data] If the lowest class interval is 0-10 and highest is 40-50, what is the maximum possible range of the data?',
        question: 'In a grouped frequency distribution table, the absolutely lowest class interval is defined as 0-10, and the absolutely highest populated class interval is defined as 40-50. What is the absolute maximum possible mathematical range of the underlying raw dataset?',
        options: [
          'A) 30',
          'B) 40',
          'C) 50',
          'D) 60'
        ],
        correctAnswer: 'C',
        explanation: 'The Range of any dataset is defined strictly as the absolute difference between the Maximum possible value and the Minimum possible value. The maximum possible theoretical value in the highest class (40-50) is 50. The minimum possible theoretical value in the lowest class (0-10) is 0. Maximum theoretical Range = 50 - 0 = 50.'
      },
      {
        id: 'apt-stat-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Impact of Outliers on Central Tendency] Which measure of central tendency is the most stable and robust when a massive outlier is suddenly introduced into the dataset?',
        question: 'A statistician has perfectly calculated the Mean, Median, and Mode of a standard dataset. Suddenly, a massive, extremely large outlier value is mistakenly appended to the dataset. Which primary measure of central tendency will mathematically be the LEAST affected (most robust) by this single extreme outlier?',
        options: [
          'A) Mean',
          'B) Median',
          'C) Variance',
          'D) Standard Deviation'
        ],
        correctAnswer: 'B',
        explanation: 'The Mean is highly sensitive to outliers because it mathematically sums all values (a massive value pulls the average up significantly). Variance and Standard Deviation are measures of dispersion that square the massive outlier\'s deviation, making them highly unstable. The Median only relies strictly on positional order; adding one extreme value merely shifts the central position by one half-step, making it highly robust and stable against extreme outliers.'
      },
      {
        id: 'apt-stat-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Mean of Combined Datasets] Dataset A has 5 items with mean 10. Dataset B has 15 items with mean 20. Find combined mean.',
        question: 'Dataset A contains exactly 5 numerical items and possesses a calculated mean of exactly 10. Dataset B contains exactly 15 numerical items and possesses a calculated mean of exactly 20. If both datasets are completely merged into a single large dataset, what will be the exact overall combined mean?',
        options: [
          'A) 15.0',
          'B) 16.5',
          'C) 17.5',
          'D) 18.0'
        ],
        correctAnswer: 'C',
        explanation: 'Use the "Total Sum" rule! Total sum of Dataset A = 5 × 10 = 50. Total sum of Dataset B = 15 × 20 = 300. Overall combined sum = 50 + 300 = 350. Overall total number of items = 5 + 15 = 20. Combined Mean = Combined Sum / Total Items = 350 / 20 = 17.5.'
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

async function seedAptitudeBatch12() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 12 (TOPICS 34 TO 36) ===\n');

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

    // 2. Upsert Topics 34 to 36
    for (const item of aptitudeBatch12) {
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
      await client.query(`UPDATE tracks SET total_topics = 36, estimated_hours = 72 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 36, estimated_hours = 72');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 36 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 36');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 12 (Topics 34 to 36) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch12();
