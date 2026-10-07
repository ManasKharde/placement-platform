const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch5 = [
  // ===========================================================================
  // TOPIC 13: DISCOUNT (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 13,
    slug: 'aptitude-quant-discount',
    title: 'Discount',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 52,
    video_url: 'http://www.youtube.com/watch?v=FW97hRrHcSw',
    video_title: 'Discount - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master Marked Price (MRP) mechanics, equivalent successive discounts, false-weight dealer margin mapping, and nullifying absolute losses via percentage markups.',
    summary_markdown: `### 📌 1. Fundamentals of Discount & Marked Price
* **Definition:** Discount is ALWAYS calculated on the **Marked Price (MP)**, List Price, or Advertised Price, NEVER on Cost Price (CP).
  * **\`Discount Amount = MP - SP\`**
  * **\`Discount % = (Discount Amount / MP) × 100\`**
  * **\`SP = MP × (100 - Discount%) / 100\`**
* **The Magic Formula linking CP, MP, Profit, and Discount:**
  * **\`CP / MP = (100 - Discount%) / (100 + Profit%)\`**
  * *(Use this to instantly find markup percentages without calculating intermediate Selling Prices!)*

### 💡 2. Successive Discounts
* If two successive discounts of \`a%\` and \`b%\` are given, the **Single Equivalent Discount** is:
  **\`Equivalent Discount = a + b - (ab / 100) %\`**
* For three successive discounts of \`a%\`, \`b%\`, and \`c%\`, first find the equivalent of \`a\` and \`b\` (call it \`x\`), then find the equivalent of \`x\` and \`c\` using the same formula:
  **\`Final Equivalent = x + c - (xc / 100) %\`**
* **Important Property:** A single discount of \`X%\` is ALWAYS strictly greater than two successive discounts that sum to \`X%\` (e.g., a flat 20% discount is better for the buyer than successive 10% and 10% discounts, which equal 19%).

### 💡 3. High-Yield Placement Hacks
* **Buy X Get Y Free:**
  * Discount % = **\`[ Y / (X + Y) ] × 100\`**
  * *(You get Y items free out of the TOTAL X+Y items you carry home!)*
* **Loss Nullification:**
  * If a fraction \`1/N\` of goods is sold at a loss of \`L%\`, to achieve "No Profit, No Loss" overall, the remaining \`(N - 1)/N\` goods must be sold at a profit of:
  * **\`Profit % = L / (N - 1) %\`**`,
    questions: [
      {
        id: 'apt-discount-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Successive vs Single Discount] Find the exact difference between a single discount of 30% and two successive discounts of 25% and 5% given on shopping of ₹2,000.',
        question: 'Sonali could not decide between a single flat discount of 30% or two successive discounts of 25% and 5%, both given on a shopping bill of ₹2,000. What is the exact difference in Rupees between the two discount schemes?',
        options: [
          'A) ₹15',
          'B) ₹20',
          'C) ₹25',
          'D) ₹30'
        ],
        correctAnswer: 'C',
        explanation: '1) Flat 30% discount on ₹2000 = ₹600 saved. 2) Two successive discounts of 25% and 5%: Equivalent discount = 25 + 5 - (25×5)/100 = 30 - 1.25 = 28.75%. 3) Discount amount = 28.75% of ₹2000 = ₹575 saved. 4) Difference = 600 - 575 = ₹25. (Shortcut: The difference in percentage is simply (a×b)/100 % = 1.25%. 1.25% of 2000 = ₹25).'
      },
      {
        id: 'apt-discount-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q2: [Three Successive Discounts] If successive discounts are 10%, 20%, and 30%, what is the single equivalent discount percentage?',
        question: 'A store offers three successive discounts of 10%, 20%, and 30% on a laptop. What is the single equivalent net discount percentage?',
        options: [
          'A) 49.6%',
          'B) 50.4%',
          'C) 52.6%',
          'D) 60.0%'
        ],
        correctAnswer: 'A',
        explanation: 'Step 1: Find the equivalent of 10% and 20%: 10 + 20 - (10×20)/100 = 30 - 2 = 28%. Step 2: Combine 28% with the third discount 30%: 28 + 30 - (28×30)/100 = 58 - 840/100 = 58 - 8.4 = 49.6%.'
      },
      {
        id: 'apt-discount-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Finding Second Unknown Discount] Two successive discounts, with the first being 20%, were given on a table having a marked price of ₹6,400. If it was finally sold for ₹4,608, find the second discount.',
        question: 'Two successive discounts, with the first being 20%, were given on a table having a marked price of ₹6,400. If it was finally sold for ₹4,608, what was the exact percentage of the second discount?',
        options: [
          'A) 8%',
          'B) 10%',
          'C) 12%',
          'D) 15%'
        ],
        correctAnswer: 'B',
        explanation: '1) Price after 1st discount (20% off): 80% of 6400 = 0.8 × 6400 = 5120. 2) The 2nd discount reduces the price from ₹5120 to ₹4608. 3) Second discount amount = 5120 - 4608 = ₹512. 4) Second discount % = (512 / 5120) × 100 = 10%.'
      },
      {
        id: 'apt-discount-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Comparing Discount Options] Which of the following yields the maximum discount on ₹6,896: (1) Two successive of 5% and 5%, (2) Single 10%, (3) Two successive of 8% and 2%?',
        question: 'Which of the following discount schemes yields the MAXIMUM discount for a customer on an item marked at ₹6,896?\n1. Two successive discounts of 5% and 5%\n2. A single flat discount of 10%\n3. Two successive discounts of 8% and 2%',
        options: [
          'A) Scheme 1',
          'B) Scheme 2',
          'C) Scheme 3',
          'D) All three yield the exact same discount'
        ],
        correctAnswer: 'B',
        explanation: 'Evaluate the equivalent discount for each: 1) 5 + 5 - 25/100 = 9.75%. 2) Flat 10%. 3) 8 + 2 - 16/100 = 9.84%. Since the sum of all pairs is 10%, the single flat discount of 10% is mathematically ALWAYS greater than any successive sequence that adds up to 10. (The base price 6896 is irrelevant decoy info).'
      },
      {
        id: 'apt-discount-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Discount Linked to Profit via Mark Price] Raj decides to sell his watch at a 5% discount, but his brother buys it from him at an 8% discount. Due to this, Raj gets ₹45 less in profit. Find the Marked Price.',
        question: 'Raj decides to sell his watch at a 5% discount on the marked price. However, his brother buys it from him at an 8% discount instead. Due to giving this extra discount, Raj\'s overall profit decreases by exactly ₹45. What was the marked price of the watch?',
        options: [
          'A) ₹1,200',
          'B) ₹1,500',
          'C) ₹1,800',
          'D) ₹2,000'
        ],
        correctAnswer: 'B',
        explanation: 'The extra discount given is 8% - 5% = 3% of the Marked Price. This 3% extra discount directly corresponds to the ₹45 loss in profit! So, 3% of MP = ₹45 => (3/100) × MP = 45 => MP = 4500 / 3 = ₹1,500.'
      },
      {
        id: 'apt-discount-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Nullifying Loss over Remaining Goods] Simran bought pet food worth ₹56,000. She sold 1/3 of it incurring a loss of 40%. At what profit percent must she sell the rest to nullify this loss?',
        question: 'Simran bought pet food worth ₹56,000. She then sold 1/3 of it, incurring a loss of 40% on that portion. At what exact profit percentage must she sell the remaining supplies to completely nullify this loss (resulting in no profit, no loss overall)?',
        options: [
          'A) 15%',
          'B) 20%',
          'C) 30%',
          'D) 40%'
        ],
        correctAnswer: 'B',
        explanation: 'She sold 1 part (out of 3) at a 40% loss. To break even, this 40% loss must be recovered as profit evenly spread across the remaining 2 parts. Profit needed per remaining part = 40% / 2 = 20% profit.'
      },
      {
        id: 'apt-discount-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Double Discount Back-Calculation] There was 25% off on handbags. Madhu got an additional 10% discount for paying cash. If she paid ₹405, what was the price tag?',
        question: 'A store offered a flat 25% off on handbags. Madhu bought a handbag and received an additional 10% successive discount on the billed amount for paying in cash. If she finally paid ₹405, what was the original price tag on the handbag?',
        options: [
          'A) ₹540',
          'B) ₹600',
          'C) ₹640',
          'D) ₹675'
        ],
        correctAnswer: 'B',
        explanation: '1) Equivalent discount of 25% and 10% = 25 + 10 - 2.5 = 32.5%. 2) She pays (100 - 32.5)% = 67.5% of the Marked Price. 3) 67.5% of MP = 405 => (67.5/100) × MP = 405 => MP = 40500 / 67.5 = 405000 / 675 = ₹600.'
      },
      {
        id: 'apt-discount-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Markup and Break-Even Discount] Chandrika raised the price of their products by 40%. How much discount should they give so as to sell the products on a no-profit no-loss basis?',
        question: 'A company raised the price of its products by 40% above the cost price. How much discount percentage must they now offer on this new marked price in order to sell the products on a "no profit, no loss" basis?',
        options: [
          'A) 25.0%',
          'B) 28.57%',
          'C) 30.0%',
          'D) 40.0%'
        ],
        correctAnswer: 'B',
        explanation: 'Let Original CP = 100. New Marked Price = 140. To break even, they must sell it back at SP = 100. The discount required in rupees = 140 - 100 = 40. The discount percentage is calculated on the NEW marked price: (40 / 140) × 100 = (2/7) × 100 ≈ 28.57%.'
      },
      {
        id: 'apt-discount-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Number of Items Bought After Discount] There is a 10% discount on a dozen pairs of trousers marked at ₹8,000. How many pairs of trousers can be bought with ₹2,400?',
        question: 'There is a flat 10% discount on a bundle of one dozen (12) pairs of trousers marked collectively at ₹8,000. Under this discount scheme, exactly how many pairs of trousers can a customer buy with ₹2,400?',
        options: [
          'A) 3 pairs',
          'B) 4 pairs',
          'C) 5 pairs',
          'D) 6 pairs'
        ],
        correctAnswer: 'B',
        explanation: '1) Marked price for 12 pairs = 8000. After 10% discount, Selling Price for 12 pairs = 8000 - 800 = ₹7,200. 2) Thus, the discounted price for 1 pair = 7200 / 12 = ₹600. 3) With ₹2400, the customer can buy 2400 / 600 = 4 pairs of trousers.'
      },
      {
        id: 'apt-discount-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Revenue Change Analysis] How much does the saree sales revenue increase if Udai announces a 25% discount, causing the sales volume to increase by 40%?',
        question: 'Udai announces a 25% discount on sarees, which consequently causes the total sales volume (number of sarees sold) to increase by 40%. By what exact percentage does his total sales revenue increase or decrease?',
        options: [
          'A) 5% Increase',
          'B) 10% Increase',
          'C) 5% Decrease',
          'D) 15% Increase'
        ],
        correctAnswer: 'A',
        explanation: 'Assume he originally sells 10 sarees at ₹100 each. Original Revenue = 1000. New Price = ₹75 (25% off). New Volume = 14 sarees (40% up). New Revenue = 75 × 14 = 1050. Change in revenue = 1050 - 1000 = +50. Percentage increase = (50 / 1000) × 100 = 5% increase.'
      },
      {
        id: 'apt-discount-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Target Savings Amount] A brand announced 25% discount on trousers. Vijay wanted to save ₹400 in discount. How many trousers should he buy if each trouser costs ₹320?',
        question: 'A brand announced a 25% discount on their trousers. Vijay went to the shop wanting to save exactly ₹400 via the discount. How many trousers must he buy to achieve this savings if the original marked price of each trouser is ₹320?',
        options: [
          'A) 3',
          'B) 4',
          'C) 5',
          'D) 6'
        ],
        correctAnswer: 'C',
        explanation: 'Discount per trouser = 25% of 320 = (1/4) × 320 = ₹80. To save a total of ₹400 in discounts, he must buy Total Savings / Discount per Item = 400 / 80 = 5 trousers.'
      },
      {
        id: 'apt-discount-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Reverse Calculation of Advertised Price] If a book costs ₹900 and is sold with a profit of 10% and discount of 12%, then find the advertised price.',
        question: 'A retailer buys a book at a cost price of ₹900. He wishes to offer a 12% discount to his customers while still earning a 10% profit on his cost. What must be the advertised (marked) price of the book?',
        options: [
          'A) ₹1,080',
          'B) ₹1,125',
          'C) ₹1,200',
          'D) ₹1,250'
        ],
        correctAnswer: 'B',
        explanation: 'Using the CP/MP formula: CP / MP = (100 - Discount%) / (100 + Profit%). 900 / MP = (100 - 12) / (100 + 10) = 88 / 110. Simplify 88/110 by dividing by 22: 4/5. So 900 / MP = 4 / 5 => 4 × MP = 4500 => MP = 4500 / 4 = ₹1,125.'
      },
      {
        id: 'apt-discount-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Profit Value to Marked Price] Profit of Raj while selling a book to Simran is ₹63. Despite a discount of 23% on the book, Raj manages to get 10% profit. Find the list price of the book.',
        question: 'Raj earns a profit of exactly ₹63 by selling a book to Simran. Even after allowing a 23% discount on the marked price, Raj still manages to make a 10% profit on his cost price. What is the marked (list) price of the book?',
        options: [
          'A) ₹800',
          'B) ₹900',
          'C) ₹1,000',
          'D) ₹1,200'
        ],
        correctAnswer: 'B',
        explanation: '1) Profit = 10% of CP = ₹63. Thus, CP = 630. 2) Selling Price SP = CP + Profit = 630 + 63 = 693. 3) SP is also the price after a 23% discount on Marked Price (MP). So, 77% of MP = 693 => (77/100) × MP = 693 => MP = 69300 / 77. Since 77 × 9 = 693, MP = ₹900.'
      },
      {
        id: 'apt-discount-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Buy X Get Y Free + Discount] A shopkeeper offers "Buy 3 get 2 free" and an additional 20% discount. What is the total equivalent discount?',
        question: 'A shopkeeper offers a promotional scheme: "Buy 3 items, get 2 items free", and additionally provides a 20% flat discount on the final bill. What is the total equivalent discount percentage the customer receives?',
        options: [
          'A) 48%',
          'B) 52%',
          'C) 56%',
          'D) 60%'
        ],
        correctAnswer: 'B',
        explanation: '1) "Buy 3 get 2 free" means getting 5 items for the price of 3. Discount 1 = (Free items / Total items) × 100 = (2 / 5) × 100 = 40%. 2) The additional discount is 20%. 3) Successive discounts of 40% and 20%: Equivalent = 40 + 20 - (40×20)/100 = 60 - 8 = 52%.'
      },
      {
        id: 'apt-discount-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Markup Nullified by Double Discount] A trader marks up his goods by 50%. He then offers two successive discounts of 20% and 10%. What is his overall profit or loss percentage?',
        question: 'A trader marks up the price of his goods by 50% above the cost price. He then offers his customers two successive discounts of 20% and 10% on the marked price. What is his overall net profit or loss percentage?',
        options: [
          'A) 8% Profit',
          'B) 8% Loss',
          'C) 12% Profit',
          'D) 12% Loss'
        ],
        correctAnswer: 'A',
        explanation: 'Let CP = 100. Marked Price MP = 150. Successive discounts of 20% and 10% equal a single discount of 20 + 10 - 2 = 28%. So SP = 150 - 28% of 150 = 150 - (0.28 × 150) = 150 - 42 = 108. Since CP = 100 and SP = 108, the trader makes an 8% profit.'
      },
      {
        id: 'apt-discount-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Finding True Weight in Dishonest Dealing] A dishonest dealer marks up his goods by 20% and gives a discount of 10%. He also uses a false weight, earning an overall profit of 35%. What weight does he use for 1 kg?',
        question: 'A dishonest dealer marks up his goods by 20% above the cost price and gives a discount of 10% on the marked price. Additionally, he uses a false weight for 1 kg. If his overall net profit is 35%, what false weight does he actually use for 1 kg?',
        options: [
          'A) 800 grams',
          'B) 850 grams',
          'C) 900 grams',
          'D) 950 grams'
        ],
        correctAnswer: 'A',
        explanation: 'Let true CP for 1000g = ₹1000 (₹1/g). 1) He marks up by 20% -> MP = 1200. 2) Gives 10% discount -> SP = 1200 - 120 = ₹1080. 3) He makes an overall profit of 35% on his actual cost. So SP = 1.35 × Actual CP => 1080 = 1.35 × Actual CP => Actual CP = 1080 / 1.35 = 800. Since 1g costs ₹1, an actual CP of ₹800 means he is only handing over 800 grams to the customer!'
      },
      {
        id: 'apt-discount-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Ratio of MP to CP Given Profit and Discount] An article is sold at a 15% discount on the marked price, generating a profit of 19%. What is the ratio of the Marked Price to the Cost Price?',
        question: 'An article is sold at a 15% discount on the marked price, generating a profit of exactly 19%. What is the ratio of the Marked Price to the Cost Price?',
        options: [
          'A) 5 : 4',
          'B) 6 : 5',
          'C) 7 : 5',
          'D) 8 : 7'
        ],
        correctAnswer: 'C',
        explanation: 'Using the formula CP / MP = (100 - Discount%) / (100 + Profit%) = (100 - 15) / (100 + 19) = 85 / 119. Divide numerator and denominator by 17 (since 17×5=85 and 17×7=119): CP / MP = 5 / 7. Therefore, the ratio of Marked Price to Cost Price (MP : CP) is 7 : 5.'
      },
      {
        id: 'apt-discount-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Unknown Third Discount in Successive Chain] The marked price of an article is ₹5,000. It is sold for ₹3,060 after three successive discounts of 20%, 15%, and x%. Find the value of x.',
        question: 'The marked price of an article is ₹5,000. A customer buys it for ₹3,060 after receiving three successive discounts of 20%, 15%, and x%. What is the exact value of the third discount x%?',
        options: [
          'A) 10%',
          'B) 12%',
          'C) 15%',
          'D) 18%'
        ],
        correctAnswer: 'A',
        explanation: 'Apply the known discounts sequentially: 1) First discount of 20% on 5000: Price = 5000 × 0.80 = 4000. 2) Second discount of 15% on 4000: 15% of 4000 = 600. Price = 4000 - 600 = 3400. 3) The third discount reduces the price from 3400 to 3060. Discount amount = 3400 - 3060 = 340. 4) Third discount percentage x = (340 / 3400) × 100 = 10%.'
      },
      {
        id: 'apt-discount-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Discount and Tax Combination] The marked price of a TV is ₹20,000. A discount of 10% is given, but an 8% sales tax is charged on the discounted price. What is the final selling price?',
        question: 'The marked price of a television is ₹20,000. The store offers a discount of 10% on the marked price, but the government charges an 8% sales tax on the discounted price. What is the final amount the customer must pay?',
        options: [
          'A) ₹19,440',
          'B) ₹19,600',
          'C) ₹19,800',
          'D) ₹20,160'
        ],
        correctAnswer: 'A',
        explanation: '1) Apply the discount first: 10% off 20,000 = Price drops to 18,000. 2) Apply sales tax on the discounted price: 8% of 18,000 = (8/100) × 18000 = 1440. 3) Final price = 18,000 + 1,440 = ₹19,440. (Note: Sales tax is an addition, discount is a subtraction, applied sequentially).'
      },
      {
        id: 'apt-discount-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Equalizing Selling Prices of Two Items] A merchant marks up item A by 20% and item B by 30%. He gives a 10% discount on A and a 20% discount on B. If both sell for the same price, find the ratio of their cost prices.',
        question: 'A merchant marks up the cost price of item A by 20% and item B by 30%. He then offers a 10% discount on the marked price of A, and a 20% discount on the marked price of B. If the final selling prices of both items are identical, what is the ratio of the cost price of A to the cost price of B?',
        options: [
          'A) 26 : 27',
          'B) 27 : 26',
          'C) 13 : 14',
          'D) 14 : 13'
        ],
        correctAnswer: 'A',
        explanation: 'Let CP of A be C_a and CP of B be C_b. 1) SP of A = C_a × 1.20 × 0.90 = 1.08 × C_a. 2) SP of B = C_b × 1.30 × 0.80 = 1.04 × C_b. 3) Since SP_A = SP_B => 1.08 C_a = 1.04 C_b => C_a / C_b = 1.04 / 1.08 = 104 / 108. Dividing by 4 gives 26 / 27.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 14: SPEED, DISTANCE & TIME (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 14,
    slug: 'aptitude-quant-speed-distance-time',
    title: 'Speed, Distance & Time',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 41,
    video_url: 'http://www.youtube.com/watch?v=jzNxXm5twx4',
    video_title: 'Speed, Distance & Time - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Solve early/late arrival problems with the clock-difference shortcut, average speed multi-leg journeys, catching thieves, and inverse speed/time proportionalities.',
    summary_markdown: `### 📌 1. Core Formulas & Unit Conversions
* **The DST Triangle:** \`Distance = Speed × Time\`.
* **Unit Conversions:**
  * To convert **km/hr to m/s**: Multiply by **\`5 / 18\`**.
  * To convert **m/s to km/hr**: Multiply by **\`18 / 5\`**.

### 💡 2. Average Speed Concepts
* **Average Speed** is ALWAYS \`Total Distance / Total Time\`. Do NOT simply average the speeds!
* **Shortcut for Two Equal Distances:** If a person travels from A to B at speed \`x\` and returns from B to A at speed \`y\`, the average speed for the round trip is:
  **\`Average Speed = (2xy) / (x + y)\`**
* **Shortcut for Three Equal Distances:**
  **\`Average Speed = (3xyz) / (xy + yz + zx)\`**

### 💡 3. High-Yield Placement Shortcuts
* **Early/Late Arrival (Clock Difference Trick):**
  * If a person travels at speed \`S1\` and is late by \`T1\` mins, and at speed \`S2\` is early by \`T2\` mins.
  * \`Time Difference (ΔT) = T1 + T2\` (if one is late and one is early). If both are late, subtract them.
  * **\`Distance = (S1 × S2) / (S2 - S1) × (ΔT / 60)\`**.
* **Two Bodies Starting at the Same Time (Police vs Thief):**
  * When two bodies start moving at the same time and eventually meet, the **Time** traveled by both is exactly the same!
  * Thus, \`Distance of A / Speed of A = Distance of B / Speed of B\`.
* **Meeting at an Intermediate Point (Cross-Timing Shortcut):**
  * If A and B start simultaneously from opposite ends, meet at an intermediate point, and then take \`t_a\` and \`t_b\` hours to reach their respective destinations:
  * **\`Speed of A / Speed of B = √(t_b / t_a)\`**.`,
    questions: [
      {
        id: 'apt-sdt-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Speed Multiplier & Time Difference] A boy increases his speed to 9/5 times his original speed. By doing this, he reaches his school 30 minutes before his usual time. How much time does he usually take?',
        question: 'A boy increases his speed to 9/5 times of his original speed. By doing this, he reaches his school 30 minutes before the usual time. How much time does he usually take to reach school?',
        options: [
          'A) 45.0 minutes',
          'B) 50.5 minutes',
          'C) 67.5 minutes',
          'D) 72.0 minutes'
        ],
        correctAnswer: 'C',
        explanation: 'Distance is constant, so Time is inversely proportional to Speed. New Speed = 9/5 of Old Speed. Therefore, New Time = 5/9 of Old Time (T). The difference in time is T - (5/9)T = (4/9)T. We are given this difference is 30 minutes. (4/9)T = 30 => 4T = 270 => T = 270 / 4 = 67.5 minutes.'
      },
      {
        id: 'apt-sdt-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Police and Thief Relative Distance] Ramesh sees a thief at a distance of 80 m. The thief runs at 5 m/s and Ramesh chases at 7 m/s. How much distance does the thief cover before being caught?',
        question: 'Ramesh spots a thief at a distance of 80 meters. The thief starts running at a speed of 5 m/s and Ramesh immediately chases him at 7 m/s. Exactly how much distance does the thief cover before Ramesh catches him?',
        options: [
          'A) 150 meters',
          'B) 200 meters',
          'C) 280 meters',
          'D) 350 meters'
        ],
        correctAnswer: 'B',
        explanation: 'Both run for the same Time (T). Distance = Speed × Time. Ramesh travels (80 + D) meters and Thief travels D meters. (80 + D) / 7 = D / 5 => 5(80 + D) = 7D => 400 + 5D = 7D => 2D = 400 => D = 200 meters.'
      },
      {
        id: 'apt-sdt-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Proportional Cycle Race Distances] P cycles twice as fast as Q. R cycles 1/3 as fast as Q. If R completes the 4500m race in 45 mins, where was Q from the finishing line when P finished the race?',
        question: 'P, Q, and R are in a 4,500m cycle race. P cycles twice as fast as Q, and R cycles 1/3 as fast as Q. If R completes the race in 45 minutes, where was Q exactly from the finishing line when P finished the race?',
        options: [
          'A) 1,500 meters from finish',
          'B) 2,250 meters from finish',
          'C) 3,000 meters from finish',
          'D) Q had already finished'
        ],
        correctAnswer: 'B',
        explanation: 'Since P cycles twice as fast as Q, P will cover twice the distance of Q in the exact same time. When P reaches the finish line (covers 4,500m), Q covers exactly half that distance (2,250m). Therefore, Q is 4500 - 2250 = 2,250 meters away from the finishing line. (Note: R\'s speed and time are irrelevant decoy info!).'
      },
      {
        id: 'apt-sdt-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Rebound Meeting Point] A and B travel from X to Y (72 km apart) at 17 km/hr and 19 km/hr. B reaches Y, returns immediately, and meets A at point C. Find the distance from Y to C.',
        question: 'Ajay and Vijay travel from town A to town B (72 km apart) at 17 km/hr and 19 km/hr respectively. Vijay reaches B first, returns immediately, and meets Ajay at point C. What is the distance from B to C?',
        options: [
          'A) 2 km',
          'B) 4 km',
          'C) 6 km',
          'D) 8 km'
        ],
        correctAnswer: 'B',
        explanation: 'Both travel for the same Time. Let distance from B to C be x. Ajay travels (72 - x) km. Vijay travels 72 km to B, plus x km back = (72 + x) km. Since Time is equal: (72 - x) / 17 = (72 + x) / 19. Cross-multiply: 19(72 - x) = 17(72 + x) => 1368 - 19x = 1224 + 17x => 36x = 144 => x = 4 km.'
      },
      {
        id: 'apt-sdt-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Early and Late Arrival Equation] Traveling at 50 km/hr, a man is 30 mins late. At 60 km/hr, he is 10 mins early. Find the distance.',
        question: 'Surendra travels from home to office by car at 50 km/hr and is late by 30 minutes. When he travels at 60 km/hr, he reaches 10 minutes earlier than the usual time. How far is his office from his home?',
        options: [
          'A) 150 km',
          'B) 180 km',
          'C) 200 km',
          'D) 240 km'
        ],
        correctAnswer: 'C',
        explanation: 'Time difference = 30 mins late + 10 mins early = 40 minutes = 40/60 = 2/3 hours. Using the shortcut D = [S1 × S2 / (S2 - S1)] × ΔT = [50 × 60 / (60 - 50)] × (2/3) = [3000 / 10] × 2/3 = 300 × 2/3 = 200 km.'
      },
      {
        id: 'apt-sdt-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Two "Late" Arrivals Difference] Rohit drives at 30 km/hr and reaches bank 20 mins late. At 45 km/hr, he is still 8 mins late. Find distance.',
        question: 'Rohit drives from home at 30 km/hr and reaches his bank 20 minutes late. Next day, he increases his speed to 45 km/hr, but still reaches 8 minutes late. How far is the bank from his home?',
        options: [
          'A) 15 km',
          'B) 18 km',
          'C) 24 km',
          'D) 30 km'
        ],
        correctAnswer: 'B',
        explanation: 'Both times he is late, so subtract the times to find the real difference: 20 mins - 8 mins = 12 minutes = 12/60 = 1/5 hours. Using D = [S1 × S2 / (S2 - S1)] × ΔT = [30 × 45 / (45 - 30)] × 1/5 = [1350 / 15] × 1/5 = 90 / 5 = 18 km.'
      },
      {
        id: 'apt-sdt-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Multi-Leg Average Speed] Pratik travels 96 km at 16 km/hr, 124 km at 31 km/hr, and 105 km at 7 km/hr. Find his average speed.',
        question: 'Pratik travels 96 km at a speed of 16 km/hr by bike, 124 km at 31 km/hr by car, and another 105 km at 7 km/hr in a horse cart. What is his exact average speed for the entire journey?',
        options: [
          'A) 12 km/hr',
          'B) 13 km/hr',
          'C) 14 km/hr',
          'D) 15 km/hr'
        ],
        correctAnswer: 'B',
        explanation: 'Average Speed = Total Distance / Total Time. 1) Total Distance = 96 + 124 + 105 = 325 km. 2) Times for each leg: T1 = 96/16 = 6 hours; T2 = 124/31 = 4 hours; T3 = 105/7 = 15 hours. Total Time = 6 + 4 + 15 = 25 hours. 3) Avg Speed = 325 / 25 = 13 km/hr.'
      },
      {
        id: 'apt-sdt-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Fractional Distance Average Speed] Rohit covers 1/4 distance at 20 km/hr, 1/4 at 10 km/hr, and rest at 80 km/hr. Find average speed.',
        question: 'Rohit covers 1/4 of his total journey distance at 20 km/hr, another 1/4 of the distance at 10 km/hr, and the remaining half (1/2) of the distance at 80 km/hr. What is his exact average speed for the whole distance?',
        options: [
          'A) 22.85 km/hr',
          'B) 25.00 km/hr',
          'C) 36.66 km/hr',
          'D) 40.00 km/hr'
        ],
        correctAnswer: 'A',
        explanation: 'Let total distance = D. Avg Speed = Total D / Total T. T1 = (D/4)/20 = D/80. T2 = (D/4)/10 = D/40. The remaining distance is 1/2. T3 = (D/2)/80 = D/160. Total Time = D/80 + D/40 + D/160. LCM is 160. (2D + 4D + 1D) / 160 = 7D / 160. Avg Speed = D / (7D / 160) = 160 / 7 ≈ 22.85 km/hr.'
      },
      {
        id: 'apt-sdt-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q9: [Cross-Timing Square Root Shortcut] A walks from Jammu to Delhi, B from Delhi to Jammu. After passing each other, they take 361 hours and 289 hours respectively to finish. Find ratio of speeds.',
        question: 'A walks from Jammu to Delhi, and simultaneously B starts walking from Delhi to Jammu. After crossing each other on the way, they complete their remaining journeys in 361 hours and 289 hours respectively. What is the ratio of the speed of A to the speed of B?',
        options: [
          'A) 17 : 19',
          'B) 19 : 17',
          'C) 289 : 361',
          'D) 361 : 289'
        ],
        correctAnswer: 'A',
        explanation: 'When two travelers start simultaneously from opposite ends, cross paths, and take times t_a and t_b to finish the remaining journey, the ratio of their speeds is S_a / S_b = √(t_b / t_a). Here t_a = 361, t_b = 289. S_a / S_b = √(289 / 361) = 17 / 19. Ratio is 17 : 19.'
      },
      {
        id: 'apt-sdt-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Time Conversion & Reverse Engineering Speed] A car traveling at 5/7 of its actual speed covers 42 km in 1 hr 40 mins 48 secs. Find actual speed.',
        question: 'A car traveling at 5/7 of its actual original speed covers 42 km in exactly 1 hour, 40 minutes, and 48 seconds. What is the actual original speed of the car in km/hr?',
        options: [
          'A) 25 km/hr',
          'B) 30 km/hr',
          'C) 35 km/hr',
          'D) 42 km/hr'
        ],
        correctAnswer: 'C',
        explanation: '1) Convert time entirely to seconds: 1 hr = 3600s; 40 mins = 2400s; plus 48s = 6048 seconds. 2) Distance = 42,000 meters. 3) New Speed = D / T = 42000 / 6048 m/s. Convert m/s to km/hr by multiplying by 18/5: (42000 / 6048) × (18 / 5) = 25 km/hr. 4) We know New Speed = (5/7) × Actual Speed. So 25 = (5/7) × Actual Speed => Actual Speed = 25 × 7 / 5 = 35 km/hr.'
      },
      {
        id: 'apt-sdt-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Two Speeds with Equal Distance Formula] A man covers a certain distance by car driving at 70 km/hr and returns back to the starting point riding on a scooter at 55 km/hr. Find his average speed.',
        question: 'A man covers a certain distance from city X to city Y driving a car at 70 km/hr and returns back along the exact same route riding a scooter at 55 km/hr. What is his overall average speed for the whole journey?',
        options: [
          'A) 61.6 km/hr',
          'B) 62.5 km/hr',
          'C) 63.2 km/hr',
          'D) 64.0 km/hr'
        ],
        correctAnswer: 'A',
        explanation: 'For a round trip of identical distance, Average Speed = (2xy) / (x + y). x = 70, y = 55. Avg Speed = (2 × 70 × 55) / (70 + 55) = 7700 / 125. 7700 / 125 = 61.6 km/hr. (Never simply average 70 and 55!).'
      },
      {
        id: 'apt-sdt-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Overtaking Moving Target] Two trains A and B start from stations X and Y towards each other at speeds 80 km/hr and 95 km/hr. At the time of their meeting, the second train had traveled 180 km more than the first. Find distance XY.',
        question: 'Two trains start simultaneously from stations X and Y towards each other at speeds of 80 km/hr and 95 km/hr respectively. At the exact moment they pass each other, it is found that the second train has traveled 180 km more than the first train. What is the total distance between X and Y?',
        options: [
          'A) 1,900 km',
          'B) 2,100 km',
          'C) 2,400 km',
          'D) 2,800 km'
        ],
        correctAnswer: 'B',
        explanation: 'Since they start simultaneously, the Time (T) traveled by both until they meet is exactly the same! Distance difference = 180 km. D_B - D_A = 180 => (95 × T) - (80 × T) = 180 => 15T = 180 => T = 12 hours. Total distance = D_A + D_B = (80 + 95) × T = 175 × 12 = 2,100 km.'
      },
      {
        id: 'apt-sdt-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Linear Chase with Head Start] A thief steals a car at 1:30 PM and drives it at 40 km/hr. The theft is discovered at 2:00 PM and the owner sets off in another car at 50 km/hr. When will he overtake the thief?',
        question: 'A thief steals a car at 1:30 PM and drives it away at 40 km/hr. The theft is discovered 30 minutes later at 2:00 PM, and the owner sets off immediately in another car at 50 km/hr to chase him. At what exact time will the owner overtake the thief?',
        options: [
          'A) 3:30 PM',
          'B) 4:00 PM',
          'C) 4:30 PM',
          'D) 5:00 PM'
        ],
        correctAnswer: 'B',
        explanation: '1) Head start distance: From 1:30 PM to 2:00 PM (0.5 hours), the thief travels 40 × 0.5 = 20 km. 2) Relative speed of owner to catch up = 50 - 40 = 10 km/hr. 3) Time to catch up = Distance Gap / Relative Speed = 20 km / 10 km/hr = 2 hours. 4) The chase started at 2:00 PM, so the owner catches the thief at 2:00 PM + 2 hours = 4:00 PM.'
      },
      {
        id: 'apt-sdt-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Time Gained by Avoiding Stops] Excluding stoppages, the speed of a bus is 54 km/hr and including stoppages, it is 45 km/hr. For how many minutes does the bus stop per hour?',
        question: 'Excluding stoppages, the average speed of a bus is 54 km/hr. Including stoppages, its average speed drops to 45 km/hr. For exactly how many minutes does the bus stop per hour?',
        options: [
          'A) 9 minutes',
          'B) 10 minutes',
          'C) 12 minutes',
          'D) 15 minutes'
        ],
        correctAnswer: 'B',
        explanation: 'Difference in distance covered in 1 hour = 54 - 45 = 9 km. This 9 km is the distance the bus COULD have traveled during the time it spent stopped. At its non-stopping speed of 54 km/hr, the time taken to cover 9 km is (9 / 54) hours = 1/6 hours. Convert to minutes: (1/6) × 60 = 10 minutes. So, the bus stops for 10 minutes per hour.'
      },
      {
        id: 'apt-sdt-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Walking Opposite Directions on Circular Track] A, B, and C walk around a circular track 12 km long at speeds 3, 7, and 13 km/hr respectively. If they start at the same time and point, when will they meet again?',
        question: 'A, B, and C start walking simultaneously from the exact same point around a circular track 12 km long at speeds of 3 km/hr, 7 km/hr, and 13 km/hr respectively. If A and B walk in the same direction, but C walks in the opposite direction, after how many hours will all three meet again at the starting point?',
        options: [
          'A) 12 hours',
          'B) 24 hours',
          'C) 36 hours',
          'D) 84 hours'
        ],
        correctAnswer: 'A',
        explanation: 'Regardless of the direction they walk, a person returns to the STARTING POINT exactly after covering multiples of the entire circumference! Time taken by A for one round = 12/3 = 4 hours. By B = 12/7 hours. By C = 12/13 hours. They will meet at the starting point simultaneously at the LCM of their individual round times. LCM of fractions (4/1, 12/7, 12/13) = LCM of Numerators (4, 12, 12) / HCF of Denominators (1, 7, 13) = 12 / 1 = 12 hours.'
      },
      {
        id: 'apt-sdt-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Passing Trains of Different Lengths] Two trains 130 m and 110 m long are moving in opposite directions on parallel tracks at 40 km/hr and 32 km/hr. In what time will they pass each other completely?',
        question: 'Two trains, 130 meters and 110 meters long, are moving in opposite directions on parallel tracks at speeds of 40 km/hr and 32 km/hr respectively. In how many exact seconds will they completely cross each other?',
        options: [
          'A) 10 seconds',
          'B) 12 seconds',
          'C) 15 seconds',
          'D) 18 seconds'
        ],
        correctAnswer: 'B',
        explanation: '1) Total distance to clear each other = Sum of their lengths = 130 + 110 = 240 m. 2) Since they travel in opposite directions, relative speed = Sum of speeds = 40 + 32 = 72 km/hr. 3) Convert 72 km/hr to m/s: 72 × (5/18) = 20 m/s. 4) Time = Distance / Relative Speed = 240 / 20 = 12 seconds.'
      },
      {
        id: 'apt-sdt-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Train Crossing a Platform] A train traveling at 72 km/hr crosses a 250 m long platform in 26 seconds. What is the length of the train?',
        question: 'A train traveling at a speed of 72 km/hr completely crosses a 250-meter long station platform in exactly 26 seconds. What is the length of the train?',
        options: [
          'A) 250 meters',
          'B) 270 meters',
          'C) 320 meters',
          'D) 350 meters'
        ],
        correctAnswer: 'B',
        explanation: '1) Convert speed to m/s: 72 × (5/18) = 20 m/s. 2) Total distance covered in 26 seconds = Speed × Time = 20 × 26 = 520 meters. 3) Total distance covered when crossing a platform = Length of Train + Length of Platform. Thus, L + 250 = 520 => L = 520 - 250 = 270 meters.'
      },
      {
        id: 'apt-sdt-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Boats and Streams Relative Speed] A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.',
        question: 'A motorboat has a speed of 13 km/hr in completely still water. If the speed of the river current (stream) is 4 km/hr, how much time will the boat take to travel 68 km downstream?',
        options: [
          'A) 3 hours',
          'B) 4 hours',
          'C) 5 hours',
          'D) 6 hours'
        ],
        correctAnswer: 'B',
        explanation: 'Downstream speed = Speed of boat in still water + Speed of stream = 13 + 4 = 17 km/hr. Time = Distance / Downstream Speed = 68 / 17 = 4 hours. (If it were upstream, speed would be 13 - 4 = 9 km/hr).'
      },
      {
        id: 'apt-sdt-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Rowing Up and Down Average] A man rows downstream 32 km and 14 km upstream. If he takes 6 hours to cover each distance, what is the speed of the current?',
        question: 'A man rows a boat 32 km downstream and 14 km upstream. If he takes exactly 6 hours to cover each of these two respective distances, what is the speed of the river current?',
        options: [
          'A) 1.5 km/hr',
          'B) 2.0 km/hr',
          'C) 2.5 km/hr',
          'D) 3.0 km/hr'
        ],
        correctAnswer: 'A',
        explanation: '1) Downstream speed (D) = Distance / Time = 32 / 6 = 16/3 km/hr. 2) Upstream speed (U) = Distance / Time = 14 / 6 = 7/3 km/hr. 3) The speed of the current (Stream Speed) is half the difference between downstream and upstream speeds: V_stream = (D - U) / 2 = (16/3 - 7/3) / 2 = (9/3) / 2 = 3 / 2 = 1.5 km/hr.'
      },
      {
        id: 'apt-sdt-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Bullet Sounds & Approaching Train] Two guns were fired from the same place at an interval of 13 minutes. A person in an approaching train hears the second shot 12 minutes 30 seconds after the first. If the speed of sound is 330 m/s, find the speed of the train.',
        question: 'Two guns are fired from the same location at an exact interval of 13 minutes. A person sitting in a train approaching that location hears the second shot exactly 12 minutes and 30 seconds after hearing the first. If the speed of sound is 330 m/s, what is the speed of the approaching train?',
        options: [
          'A) 47.52 km/hr',
          'B) 50.25 km/hr',
          'C) 52.80 km/hr',
          'D) 55.44 km/hr'
        ],
        correctAnswer: 'A',
        explanation: 'The difference in time between the shots fired (13 min) and heard (12.5 min) is 0.5 mins (30 seconds). This 30-second time gap corresponds to the distance the train traveled in 12.5 minutes! So, Distance traveled by Train in 12.5 mins = Distance sound would have traveled in 30 seconds. Distance = Speed_sound × 30s = 330 × 30 = 9900 meters. The train covers 9900 meters in 12.5 minutes (750 seconds). Speed of train = 9900 / 750 = 13.2 m/s. Convert to km/hr: 13.2 × (18/5) = 47.52 km/hr.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 15: PERCENTAGE (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 15,
    slug: 'aptitude-quant-percentage',
    title: 'Percentage',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 51,
    video_url: 'http://www.youtube.com/watch?v=RWdNhJWwzSs',
    video_title: 'Percentage - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Master fast decimal shifting for percentages, comparison ratios (less than/more than), constant expenditure scaling, election voting math, and Venn diagram intersection traps.',
    summary_markdown: `### 📌 1. Fundamentals of Percentages
* **Definition:** Percentage means "per 100". To convert a fraction to a percentage, multiply by 100.
* **Fast Percentage Calculations (Decimal Shifting):**
  * **10%:** Shift the decimal 1 place to the left (e.g., 10% of 260 = 26.0).
  * **1%:** Shift the decimal 2 places to the left (e.g., 1% of 260 = 2.60).
  * **To find 39%:** Find 40% (4 × 10%) and subtract 1%.
* **Essential Fractions to Percentages:**
  * \`1/2 = 50%\`, \`1/3 = 33.33%\`, \`1/4 = 25%\`, \`1/5 = 20%\`
  * \`1/6 = 16.66%\`, \`1/8 = 12.5%\`, \`1/9 = 11.11%\`, \`1/11 = 9.09%\`

### 💡 2. High-Yield Percentage Comparison
* **"X is what % of Y?"** $\rightarrow$ \`(X / Y) × 100\`
* **"X is what % MORE/LESS than Y?"** $\rightarrow$ \`(Difference / Base) × 100\`
  * *Crucial Rule:* The "Base" is ALWAYS the value immediately following the word "than" or "of".

### 💡 3. Common Exam Scenarios
* **Constant Expenditure (Price & Consumption):**
  * If the price of sugar increases by \`R%\`, to keep expenditure the same, consumption must decrease by:
    **\`[ R / (100 + R) ] × 100 %\`**
  * If price decreases by \`R%\`, consumption can increase by:
    **\`[ R / (100 - R) ] × 100 %\`**
* **Venn Diagram Traps:**
  * If \`A%\` fail in subject 1, \`B%\` fail in subject 2, and \`C%\` fail in BOTH, the total percentage of students who failed in at least one subject is **\`A + B - C\`**. The percentage who PASSED in both is **\`100 - (A + B - C)\`**.
* **Successive Population/Depreciation:**
  * Same as compound interest: \`P_final = P_initial × (1 ± R_1/100) × (1 ± R_2/100)\`.`,
    questions: [
      {
        id: 'apt-perc-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Missing Percentage Value] If 15% of y is same as 21% of z, then 12.5% of y is equal to what % of z?',
        question: 'If 15% of y is exactly the same as 21% of z, then 12.5% of y is equal to what exact percentage of z?',
        options: [
          'A) 15.5%',
          'B) 17.5%',
          'C) 19.5%',
          'D) 21.0%'
        ],
        correctAnswer: 'B',
        explanation: 'Given: 15% of y = 21% of z => (15/100)y = (21/100)z => 15y = 21z => y = (21/15)z = 1.4z. We need 12.5% of y: 12.5% of (1.4z) = (12.5/100) × 1.4z = (17.5/100)z = 17.5% of z.'
      },
      {
        id: 'apt-perc-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Percentage Less Than / More Than] If price of rice is 30% less than wheat, then wheat\'s price is how much % more than rice?',
        question: 'If the price of rice is 30% less than the price of wheat, then the price of wheat is exactly how much percent MORE than the price of rice?',
        options: [
          'A) 30.00%',
          'B) 42.85%',
          'C) 33.33%',
          'D) 45.45%'
        ],
        correctAnswer: 'B',
        explanation: 'Let price of wheat = 100. Then price of rice = 100 - 30 = 70. How much MORE is wheat than rice? Difference = 100 - 70 = 30. The "base" is the price of rice (since it asks "more than rice"). Percentage = (Difference / Rice) × 100 = (30 / 70) × 100 = 3/7 × 100 = 42.85%.'
      },
      {
        id: 'apt-perc-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Constant Expenditure Price Shift] By 20% decrease in price of rice, people buy 10 kg more in ₹100. Find the original price per kg.',
        question: 'Due to a 20% decrease in the price of rice, a family is able to buy 10 kg more rice for exactly ₹100. What was the ORIGINAL price of rice per kg before the decrease?',
        options: [
          'A) ₹2.00',
          'B) ₹2.50',
          'C) ₹3.00',
          'D) ₹4.00'
        ],
        correctAnswer: 'B',
        explanation: 'Let original price be P. New price = 0.8P. The difference in quantities bought with ₹100 is 10 kg. Equation: 100 / 0.8P - 100 / P = 10. Factor out 100/P: (100/P) × (1/0.8 - 1) = 10 => (100/P) × (1.25 - 1) = 10 => (100/P) × 0.25 = 10 => 25/P = 10 => P = 25 / 10 = ₹2.50 per kg.'
      },
      {
        id: 'apt-perc-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Venn Diagram Intersection Trap] 15% failed in Science, 25% failed in Maths, 10% failed in both. Find % passed in both.',
        question: 'In a class examination, 15% of the total students failed in Science, 25% failed in Maths, and 10% failed in BOTH subjects. What exact percentage of students PASSED in both subjects?',
        options: [
          'A) 50%',
          'B) 60%',
          'C) 70%',
          'D) 80%'
        ],
        correctAnswer: 'C',
        explanation: 'Use the Union formula for Sets: Total Failed in at least one subject = n(Science) + n(Maths) - n(Both) = 15% + 25% - 10% = 30%. Since 30% of the students failed in at least one subject, the remaining students passed in BOTH subjects. Passed = 100% - 30% = 70%.'
      },
      {
        id: 'apt-perc-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Equating Un-knowns in Elections] In an election between two candidates, one got 40% votes and lost by 1,000 votes. Find total votes.',
        question: 'In an election contested by exactly two candidates, the losing candidate secured 40% of the total votes cast and lost by a margin of 1,000 votes. What was the total number of votes casted in the election?',
        options: [
          'A) 4,000',
          'B) 5,000',
          'C) 6,000',
          'D) 10,000'
        ],
        correctAnswer: 'B',
        explanation: 'Candidate 1 got 40%. Candidate 2 got the remaining 60%. The difference in their vote shares is 60% - 40% = 20%. This 20% margin is equal to the 1,000 votes! So, 20% of Total Votes = 1000 => (20/100) × T = 1000 => T = 1000 × 5 = 5,000 total votes.'
      },
      {
        id: 'apt-perc-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Successive Multiplicative Decrease] 10% of a village died of cholera. Panic set in, and 25% of the remaining left. Population reduced to 4,050. Find original.',
        question: 'During an epidemic, 10% of the inhabitants of a village died of cholera. Following this, panic set in and 25% of the REMAINING inhabitants left the village. If the population was then reduced to 4,050, what was the original number of inhabitants?',
        options: [
          'A) 5,500',
          'B) 6,000',
          'C) 6,500',
          'D) 7,000'
        ],
        correctAnswer: 'B',
        explanation: 'Let original population = P. After 10% die, 90% remain: 0.9P. Out of these, 25% leave, so 75% of the 90% remain in the village. Final population = 0.75 × 0.90 × P = 0.675P. We know 0.675P = 4050 => P = 4050 / 0.675 = 4050000 / 675 = 6,000.'
      },
      {
        id: 'apt-perc-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Deducing Total from Passing Marks] A scores 10% and fails by 30 marks. B scores 40% and gets 30 marks more than minimum passing. Find maximum marks.',
        question: 'In an exam, Student A scores 10% of the maximum marks and fails by 30 marks. Student B scores 40% of the maximum marks and gets 30 marks more than the minimum passing marks. What are the maximum possible marks for the exam?',
        options: [
          'A) 150',
          'B) 200',
          'C) 250',
          'D) 300'
        ],
        correctAnswer: 'B',
        explanation: 'Let Maximum marks = M. Passing marks = A\'s score + 30 = 10% of M + 30. Also, Passing marks = B\'s score - 30 = 40% of M - 30. Equating them: 10% of M + 30 = 40% of M - 30 => 60 = 30% of M => 60 = 0.3M => M = 60 / 0.3 = 200.'
      },
      {
        id: 'apt-perc-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Successive Increase and Decrease] Price is first increased by 10% and then decreased by 10%. Find change in price.',
        question: 'The price of an apple is first increased by 10% and later decreased by 10%. What is the net overall percentage change in the price of the apple?',
        options: [
          'A) 0% (No change)',
          'B) 1% Increase',
          'C) 1% Decrease',
          'D) 2% Decrease'
        ],
        correctAnswer: 'C',
        explanation: 'Let original price = 100. Increase by 10% -> 110. Decrease by 10% of 110 (which is 11) -> 110 - 11 = 99. The net change from 100 to 99 is a 1% Decrease. (Shortcut: x% increase then x% decrease ALWAYS results in a loss of x^2 / 100 % = 10^2 / 100 = 1% decrease).'
      },
      {
        id: 'apt-perc-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Comparison of Three Percentages] A\'s salary is 50% more than B\'s. How much % is B\'s salary less than A\'s?',
        question: 'Person A\'s salary is exactly 50% MORE than Person B\'s salary. By what exact percentage is B\'s salary LESS than A\'s salary?',
        options: [
          'A) 25.00%',
          'B) 33.33%',
          'C) 50.00%',
          'D) 66.66%'
        ],
        correctAnswer: 'B',
        explanation: 'Let B\'s salary = 100. A\'s salary = 100 + 50 = 150. How much is B less than A? Difference = 150 - 100 = 50. The "base" is A\'s salary (since it asks "less than A"). Percentage = (Difference / A) × 100 = (50 / 150) × 100 = 1/3 × 100 = 33.33%.'
      },
      {
        id: 'apt-perc-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Population Literacy and Gender Ratios] 55% of population is female. 80% of males are literate. Total literacy is 58%. Find female literacy rate.',
        question: 'In a country, 55% of the total population is female. 80% of the male population is literate. If the total overall literacy rate of the country is 58%, what percentage of the FEMALE population is literate?',
        options: [
          'A) 36%',
          'B) 40%',
          'C) 45%',
          'D) 50%'
        ],
        correctAnswer: 'B',
        explanation: 'Assume total population = 100. Females = 55, Males = 45. Literate Males = 80% of 45 = (80/100) × 45 = 36. Total literate people = 58. Since Total Literate = Literate Males + Literate Females => 58 = 36 + Literate Females => Literate Females = 22. The literacy rate OF FEMALES = (Literate Females / Total Females) × 100 = (22 / 55) × 100 = (2/5) × 100 = 40%.'
      },
      {
        id: 'apt-perc-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Two Numbers Relative to Third] Two numbers are less than a third by 30% and 37%. How much % is the second less than the first?',
        question: 'Two numbers are strictly less than a third number by 30% and 37% respectively. By what exact percentage is the second number less than the first number?',
        options: [
          'A) 7%',
          'B) 10%',
          'C) 12%',
          'D) 15%'
        ],
        correctAnswer: 'B',
        explanation: 'Let the third number be 100. First number = 100 - 30 = 70. Second number = 100 - 37 = 63. How much is the second less than the first? Difference = 70 - 63 = 7. Base is the first number (70). Percentage = (7 / 70) × 100 = 10%.'
      },
      {
        id: 'apt-perc-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Price vs Consumption Equality] If price of sugar is raised by 25%, by how much % should a person reduce consumption so expenditure remains same?',
        question: 'If the market price of sugar is suddenly raised by 25%, by what exact percentage must a household reduce its consumption of sugar so that its overall monthly expenditure remains absolutely unchanged?',
        options: [
          'A) 15%',
          'B) 20%',
          'C) 25%',
          'D) 33.33%'
        ],
        correctAnswer: 'B',
        explanation: 'Shortcut formula for constant expenditure: Reduction % = [R / (100 + R)] × 100. Here R = 25. Reduction = [25 / (100 + 25)] × 100 = (25 / 125) × 100 = 1/5 × 100 = 20%.'
      },
      {
        id: 'apt-perc-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Deduction on Partial Bill] If 20% of an electricity bill is deducted, ₹100 is still to be paid. Find the original bill.',
        question: 'If a 20% deduction is applied to an electricity bill, an amount of ₹100 is still left to be paid. What was the original amount of the electricity bill?',
        options: [
          'A) ₹120',
          'B) ₹125',
          'C) ₹140',
          'D) ₹150'
        ],
        correctAnswer: 'B',
        explanation: 'Let original bill be B. A 20% deduction means 80% is still owed. So 80% of B = 100 => 0.8B = 100 => B = 100 / 0.8 = 1000 / 8 = ₹125.'
      },
      {
        id: 'apt-perc-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Error Percentage in Calculation] A student multiplied a number by 3/5 instead of 5/3. What is the percentage error in the calculation?',
        question: 'A student carelessly multiplied a positive number by 3/5 instead of multiplying it by 5/3. What is the exact percentage error in the calculated result?',
        options: [
          'A) 36%',
          'B) 44%',
          'C) 54%',
          'D) 64%'
        ],
        correctAnswer: 'D',
        explanation: 'Let the number be 15 (LCM of 3 and 5). Correct result = 15 × (5/3) = 25. Erroneous result = 15 × (3/5) = 9. Error amount = 25 - 9 = 16. Percentage error = (Error / Correct Result) × 100 = (16 / 25) × 100 = 16 × 4 = 64%.'
      },
      {
        id: 'apt-perc-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Finding Original Number from Increment] If 15% is added to a number, it becomes 460. What is the number?',
        question: 'When 15% of a number is added to the number itself, the result becomes 460. What is the original number?',
        options: [
          'A) 360',
          'B) 380',
          'C) 400',
          'D) 420'
        ],
        correctAnswer: 'C',
        explanation: 'Let the number be N. Adding 15% to it means it becomes 115% of N. So, 115% of N = 460 => 1.15N = 460 => N = 460 / 1.15 = 46000 / 115 = 400.'
      },
      {
        id: 'apt-perc-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Voting Percentage with Invalid Votes] In an election, 8% of voters didn\'t cast their votes. The winner got 48% of TOTAL votes and beat his rival by 1,100 votes. Find total voters.',
        question: 'In a local election involving only two candidates, 8% of the registered voters did not cast their votes. The winning candidate secured exactly 48% of the TOTAL registered votes and defeated his rival by a margin of 1,100 votes. What was the total number of registered voters?',
        options: [
          'A) 25,000',
          'B) 26,500',
          'C) 27,500',
          'D) 30,000'
        ],
        correctAnswer: 'C',
        explanation: 'Let Total Registered Votes = 100%. Did not vote = 8%. Votes cast = 92%. Winner got 48% of TOTAL votes (100%), so Winner = 48%. Loser = Votes cast - Winner = 92% - 48% = 44%. Margin = Winner - Loser = 48% - 44% = 4%. We are given 4% of Total = 1100 => Total = 1100 / 0.04 = 110000 / 4 = 27,500.'
      },
      {
        id: 'apt-perc-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Price Reduction and Extra Quantity Formula] A reduction of 10% in price of sugar enables a housewife to buy 6.2 kg more for ₹1,116. Find the reduced price per kg.',
        question: 'A 10% reduction in the market price of sugar enables a housewife to buy exactly 6.2 kg more sugar for ₹1,116. What is the newly reduced price of sugar per kg?',
        options: [
          'A) ₹15',
          'B) ₹18',
          'C) ₹20',
          'D) ₹22'
        ],
        correctAnswer: 'B',
        explanation: 'The extra 6.2 kg is purchased exclusively using the money saved from the 10% price drop! Savings = 10% of ₹1116 = ₹111.60. She buys 6.2 kg for this ₹111.60. Thus, Reduced Price per kg = 111.60 / 6.2 = 1116 / 62 = ₹18.'
      },
      {
        id: 'apt-perc-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Numerator and Denominator Percentage Changes] If numerator of a fraction is increased by 200% and denominator increased by 350%, the resultant is 5/12. Find original fraction.',
        question: 'If the numerator of a positive fraction is increased by 200% and its denominator is increased by 350%, the resultant fraction is 5/12. What was the original fraction?',
        options: [
          'A) 5 / 8',
          'B) 5 / 9',
          'C) 7 / 12',
          'D) 3 / 8'
        ],
        correctAnswer: 'A',
        explanation: 'Let original fraction be x/y. Increasing numerator by 200% makes it x + 2x = 3x (or 300% of x). Increasing denominator by 350% makes it y + 3.5y = 4.5y (or 450% of y). So, 3x / 4.5y = 5 / 12 => (x/y) × (3 / 4.5) = 5/12 => (x/y) × (2/3) = 5/12 => x/y = (5/12) × (3/2) = 15/24 = 5/8.'
      },
      {
        id: 'apt-perc-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Fresh and Dry Fruit Moisture Content] Fresh fruit contains 68% water and dry fruit contains 20% water. How much dry fruit can be obtained from 100 kg of fresh fruit?',
        question: 'Fresh fruit contains 68% water by weight, whereas dry fruit contains exactly 20% water by weight. How many kilograms of dry fruit can be obtained from exactly 100 kg of fresh fruit?',
        options: [
          'A) 32 kg',
          'B) 40 kg',
          'C) 50 kg',
          'D) 60 kg'
        ],
        correctAnswer: 'B',
        explanation: 'The weight of the solid fruit PULP remains 100% constant during the drying process! In 100 kg of fresh fruit (68% water), the pulp is 100% - 68% = 32% of 100 kg = 32 kg. In dry fruit (20% water), the pulp makes up 100% - 20% = 80% of the total dry weight W. So, 80% of W = 32 kg => 0.8W = 32 => W = 32 / 0.8 = 40 kg.'
      },
      {
        id: 'apt-perc-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Successive Taxation / Multiplier Chain] The value of a machine depreciates by 10% every year. If it was purchased 3 years ago and its present value is ₹8,748, find its purchase price.',
        question: 'The market value of a machine depreciates by 10% every single year. If it was purchased exactly 3 years ago and its present market value is ₹8,748, what was its original purchase price?',
        options: [
          'A) ₹10,000',
          'B) ₹11,500',
          'C) ₹12,000',
          'D) ₹13,500'
        ],
        correctAnswer: 'C',
        explanation: 'Let Original Price = P. Present Value = P × (1 - 10/100)^3 = P × (0.9)^3 = P × 0.729. We know Present Value = 8748. So, 0.729 P = 8748 => P = 8748 / 0.729 = 8748000 / 729 = 12,000.'
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

async function seedAptitudeBatch5() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 5 (TOPICS 13 TO 15) ===\n');

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

    // 2. Upsert Topics 13 to 15
    for (const item of aptitudeBatch5) {
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
      await client.query(`UPDATE tracks SET total_topics = 15, estimated_hours = 30 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 15, estimated_hours = 30');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 15 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 15');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 5 (Topics 13 to 15) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch5();
