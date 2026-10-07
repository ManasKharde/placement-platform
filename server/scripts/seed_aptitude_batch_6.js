const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch6 = [
  // ===========================================================================
  // TOPIC 16: PIPES AND CISTERNS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 16,
    slug: 'aptitude-quant-pipes-and-cisterns',
    title: 'Pipes and Cisterns',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 47,
    video_url: 'http://www.youtube.com/watch?v=mBtBD1N7ywQ',
    video_title: 'Pipes and Cisterns - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master the "1-Hour Work" inversion trick, multi-tap scheduling, leak/emptying deductions, and complex timeline shifts when pipes are closed prematurely.',
    summary_markdown: `### 📌 1. The Core Inversion Rule
* **Filling/Emptying Rate:** If a pipe can completely fill (or empty) a tank in **\`N\` hours**, the amount of tank it fills (or empties) in **1 hour** is exactly **\`1/N\`**.
* Conversely, if the total combined 1-hour work of all open pipes is **\`1/T\`**, the entire tank will be full (or empty) in exactly **\`T\` hours**.

### 💡 2. Filling vs. Emptying (The Sign Convention)
* **Inlet Pipes (Filling):** Add their 1-hour work (**\`+ 1/x\`**).
* **Outlet Pipes / Leaks (Emptying):** Subtract their 1-hour work (**\`- 1/y\`**).
* **Net 1-Hour Work:** If an inlet fills in \`X\` hours and a leak empties in \`Y\` hours, their combined 1-hour work is **\`(1/X) - (1/Y)\`**.
  * If the result is positive, the tank is slowly filling.
  * If the result is negative, the tank is slowly emptying.

### 💡 3. High-Yield Placement Shortcuts
* **Pipes Closed Mid-Way (Line Diagram Method):**
  * If Pipe A and B run together for \`t\` minutes, and then B is closed, calculate the fractional work done in the first \`t\` minutes: \`t × (1/A + 1/B)\`.
  * Subtract this from \`1\` to find the remaining work, which is done solely by A.
* **Alternating Pipes:**
  * If Pipe A runs in the 1st hour and Pipe B runs in the 2nd hour, treat a **2-hour block** as a single cycle. Calculate the work done in 1 cycle, find the maximum integer number of cycles that fit below \`1\` (total work), and then step hour-by-hour for the remainder.`,
    questions: [
      {
        id: 'apt-pipe-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Three Pipes Combined Rate] Pipes M and N fill a tank in 22.5 min and 15 min respectively. If both are opened, after how much time should N be closed so the tank is full in 18 minutes?',
        question: 'Two pipes M and N can fill a tank in 22.5 minutes and 15 minutes respectively. If both pipes are opened simultaneously, exactly after how many minutes should pipe N be closed so that the tank is completely filled in exactly 18 minutes from the start?',
        options: [
          'A) 3 minutes',
          'B) 4 minutes',
          'C) 5 minutes',
          'D) 6 minutes'
        ],
        correctAnswer: 'A',
        explanation: 'Pipe M\'s 1-min work = 1 / 22.5 = 2/45. Pipe N\'s 1-min work = 1/15. Pipe M is kept open for the entire 18 minutes. Work done by M in 18 minutes = 18 × (2/45) = 36/45 = 4/5 of the tank. The remaining work = 1 - 4/5 = 1/5 of the tank. This 1/5 was filled exclusively by pipe N before it was closed. Time N was open = (Work / Rate) = (1/5) / (1/15) = 15/5 = 3 minutes.'
      },
      {
        id: 'apt-pipe-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Leak Extension Time] A tap fills a tub in 24 hours. Due to a leak, it fills in 36 hours. If the tub is full, how long will the leak take to empty it?',
        question: 'A tap can normally fill a tub in 24 hours. Due to a leak at the bottom, the tap now takes 36 hours to fill the tub. If the tub is completely full and the tap is closed, how much time will the leak alone take to empty the tub?',
        options: [
          'A) 48 hours',
          'B) 60 hours',
          'C) 72 hours',
          'D) 96 hours'
        ],
        correctAnswer: 'C',
        explanation: '1-hour work of Tap = 1/24. 1-hour net work (Tap + Leak) = 1/36. Therefore, (1-hour work of Tap) - (1-hour work of Leak) = 1/36 => 1/24 - 1/L = 1/36 => 1/L = 1/24 - 1/36 = (3 - 2)/72 = 1/72. So the leak empties 1/72 of the tub in 1 hour. It will take 72 hours to empty the full tub.'
      },
      {
        id: 'apt-pipe-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Accidental Third Pipe Opened] P and Q fill in 15h and 10h. R empties in 30h. All 3 opened. After 2h, R is closed. How much EXTRA time is needed?',
        question: 'Pipes P and Q can fill a tank in 15 and 10 hours respectively. Pipe R can empty the full tank in 30 hours. Ram unknowingly opened all three pipes. After 2 hours, Shyam realized the mistake and closed pipe R. Due to this mistake, how much MORE time in total does it take to fill the tank compared to the normal time?',
        options: [
          'A) 12 minutes',
          'B) 18 minutes',
          'C) 24 minutes',
          'D) 30 minutes'
        ],
        correctAnswer: 'C',
        explanation: '1) Normal Time (P and Q only): 1-hr work = 1/15 + 1/10 = 5/30 = 1/6. Normal time = 6 hours. 2) Abnormal Time: For 2 hours, P, Q, and R are open. 1-hr work = 1/15 + 1/10 - 1/30 = 4/30 = 2/15. In 2 hours, they fill 2 × (2/15) = 4/15. 3) Remaining work = 1 - 4/15 = 11/15. 4) Now R is closed, so P and Q fill the remaining 11/15 at their normal rate of 1/6 per hour. Time for remainder = (11/15) / (1/6) = 66 / 15 = 4.4 hours. 5) Total abnormal time = 2 + 4.4 = 6.4 hours. 6) Extra time = 6.4 - 6.0 = 0.4 hours = 0.4 × 60 = 24 minutes.'
      },
      {
        id: 'apt-pipe-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Efficiency and Time Difference] Pipe A fills 5 times faster than B and takes 32 mins less. Find time if both opened together.',
        question: 'Pipe A can fill a tank 5 times faster than Pipe B and therefore takes 32 minutes less than Pipe B to fill the tank when acting alone. If both pipes are opened together, in exactly how many minutes will the tank be full?',
        options: [
          'A) 5 1/3 minutes',
          'B) 6 2/3 minutes',
          'C) 8 minutes',
          'D) 10 minutes'
        ],
        correctAnswer: 'B',
        explanation: 'Since A is 5 times faster, B takes 5 times as long. Let Time_A = T, then Time_B = 5T. Given Time_B - Time_A = 32 => 5T - T = 32 => 4T = 32 => T = 8 mins. So A takes 8 mins, B takes 40 mins. 1-min work together = 1/8 + 1/40 = 6/40 = 3/20. Total time = 20/3 = 6 2/3 minutes.'
      },
      {
        id: 'apt-pipe-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [System of Unknown Rates] System filled by P and Q in 6h. P, Q, and R fill in 5h. P fills twice as fast as Q. Find time for Q and R together.',
        question: 'A cistern can be filled in 6 hours by taps P and Q working together. If tap R also joins them, the cistern is filled in 5 hours. If tap P can fill the cistern at exactly twice the rate of tap Q, in what exact time will taps Q and R working together fill the cistern?',
        options: [
          'A) 10 1/4 hours',
          'B) 11 1/4 hours',
          'C) 12 1/2 hours',
          'D) 13 1/3 hours'
        ],
        correctAnswer: 'B',
        explanation: '1) 1/P + 1/Q = 1/6. 2) 1/P + 1/Q + 1/R = 1/5 => 1/6 + 1/R = 1/5 => 1/R = 1/5 - 1/6 = 1/30. 3) P is twice as fast as Q => 1/P = 2/Q. Substitute into (1): 2/Q + 1/Q = 1/6 => 3/Q = 1/6 => 1/Q = 1/18. 4) We need the time for Q and R together: 1/Q + 1/R = 1/18 + 1/30. LCM of 18 and 30 is 90. 5/90 + 3/90 = 8/90 = 4/45. Total time = 45 / 4 = 11.25 hours = 11 1/4 hours.'
      },
      {
        id: 'apt-pipe-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Capacity of System from Flow Rate] A and B fill in 2.4 hours. B alone takes 4 hours. If A flows at 100 L/hr, what is the capacity?',
        question: 'A cistern is filled by pipe A and pipe B together in 2.4 hours. Pipe B alone can fill the cistern in exactly 4 hours. If pipe A alone pumps water at the constant rate of 100 liters per hour, what is the total capacity of the cistern?',
        options: [
          'A) 480 Liters',
          'B) 500 Liters',
          'C) 600 Liters',
          'D) 720 Liters'
        ],
        correctAnswer: 'C',
        explanation: '1-hr combined work = 1/2.4 = 10/24 = 5/12. B\'s 1-hr work = 1/4. A\'s 1-hr work = 5/12 - 1/4 = 5/12 - 3/12 = 2/12 = 1/6. Thus, pipe A alone takes 6 hours to fill the tank. Since A fills 100 liters in 1 hour, in 6 hours it fills 600 liters. Total capacity = 600 Liters.'
      },
      {
        id: 'apt-pipe-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Alternating Pipes Exact Minute] Pipe A fills in 20 min, B empties in 30 min. They open alternately for 1 min each. When will it be full?',
        question: 'Pipe A can fill a tank in 20 minutes, while Pipe B can empty the full tank in 30 minutes. Starting with Pipe A, they are opened alternately for exactly 1 minute each. In exactly how many minutes will the tank be full for the first time?',
        options: [
          'A) 115 minutes',
          'B) 116 minutes',
          'C) 120 minutes',
          'D) 121 minutes'
        ],
        correctAnswer: 'A',
        explanation: 'A\'s 1-min work = +1/20 = +3/60. B\'s 1-min work = -1/30 = -2/60. In 1 cycle of 2 minutes, net work = 3/60 - 2/60 = 1/60. Caution: Do NOT just multiply by 60! The tank is considered full the moment it reaches the top (during A\'s turn). We must reserve the last cycle for A. A fills 3/60 in its last minute. So we cycle until the work done is 1 - 3/60 = 57/60. Since 1 cycle (2 mins) fills 1/60, it takes 57 cycles = 114 minutes to fill 57/60. In the 115th minute, A opens and fills the remaining 3/60 perfectly. Total time = 114 + 1 = 115 minutes.'
      },
      {
        id: 'apt-pipe-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Three Pipes with Flow Rates] Pipes A, B, C fill a tank. A and B fill in 20 and 30 hours. C empties 25 L/min. If all open, it takes 24 hours to fill. Find capacity.',
        question: 'Pipes A and B can fill a tank in 20 hours and 30 hours respectively. Pipe C is an emptying pipe that drains water at a constant rate of 25 liters per minute. If all three pipes are opened together, the tank is completely filled in 24 hours. What is the total capacity of the tank?',
        options: [
          'A) 18,000 Liters',
          'B) 24,000 Liters',
          'C) 36,000 Liters',
          'D) 45,000 Liters'
        ],
        correctAnswer: 'C',
        explanation: '1-hr work of (A + B + C) = 1/24. 1/20 + 1/30 + 1/C = 1/24. LCM of 20, 30 is 60: 3/60 + 2/60 = 5/60 = 1/12. So 1/12 + 1/C = 1/24 => 1/C = 1/24 - 1/12 = -1/24. Thus, pipe C alone can empty the tank in exactly 24 hours. C\'s drain rate = 25 L/min = 25 × 60 = 1,500 L/hr. Total capacity = 1,500 L/hr × 24 hours = 36,000 Liters.'
      },
      {
        id: 'apt-pipe-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Two Filling, One Emptying Cycle] Pipes A, B fill in 10 and 15 mins. C empties in 12 mins. A, B, C opened alternately for 1 min each. Find time.',
        question: 'Pipes A and B can fill a tank in 10 and 15 minutes respectively. Pipe C can empty the full tank in 12 minutes. The three pipes are opened alternately for exactly 1 minute each, starting with A, then B, then C. In how many exact minutes will the tank be full for the first time?',
        options: [
          'A) 30 minutes',
          'B) 32 minutes',
          'C) 35 minutes',
          'D) 40 minutes'
        ],
        correctAnswer: 'B',
        explanation: 'Rates per minute: A = +6/60, B = +4/60, C = -5/60. In 1 cycle of 3 mins, net work = 6/60 + 4/60 - 5/60 = 5/60. Target before final positive fill = 1 - 10/60 = 50/60. 10 cycles (30 mins) fills exactly 10 × (5/60) = 50/60 of the tank. In the 31st minute, pipe A opens and adds 6/60, bringing total to 56/60. In the 32nd minute, pipe B opens and adds 4/60, bringing total to 60/60 (completely full!). The tank is full in exactly 32 minutes.'
      },
      {
        id: 'apt-pipe-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Multiple Leaks] A cistern has 3 leaks. The first two alone empty in 12 and 15 mins. The third alone in 20 mins. If all open, how long to empty?',
        question: 'A cistern is completely full of water. It has three leaks at its base. The first leak alone can empty the cistern in 12 minutes, the second alone in 15 minutes, and the third alone in 20 minutes. If all three leaks start simultaneously, in how many minutes will the cistern be completely emptied?',
        options: [
          'A) 4 minutes',
          'B) 5 minutes',
          'C) 6 minutes',
          'D) 8 minutes'
        ],
        correctAnswer: 'B',
        explanation: 'Combined emptying rate = 1/12 + 1/15 + 1/20. LCM of 12, 15, 20 is 60. Rate = 5/60 + 4/60 + 3/60 = 12/60 = 1/5. Total time = 5 minutes.'
      },
      {
        id: 'apt-pipe-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q11: [Pipe Re-opened] A and B fill in 20 and 30 mins. Both are opened. B is closed after some time. Tank fills in 18 mins. When was B closed?',
        question: 'Pipe A can fill a tank in 20 minutes and Pipe B can fill it in 30 minutes. Both pipes are opened together. Pipe B is closed after some time, and the entire tank is subsequently filled in exactly 18 minutes from the start. After how many minutes was Pipe B closed?',
        options: [
          'A) 3 minutes',
          'B) 6 minutes',
          'C) 8 minutes',
          'D) 9 minutes'
        ],
        correctAnswer: 'A',
        explanation: 'Pipe A operates for the entire 18 minutes. Work done by A = 18 × (1/20) = 18/20 = 9/10. Remaining work = 1 - 9/10 = 1/10. This 1/10 was filled exclusively by B before it was closed. Time B was open = (1/10) / (1/30) = 30 / 10 = 3 minutes.'
      },
      {
        id: 'apt-pipe-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Cistern Filling with Delayed Starts] Tap P fills in 15h, Q in 20h. P opened at 8 AM, Q at 10 AM. When will it be full?',
        question: 'Tap P can fill a tank in 15 hours and Tap Q can fill it in 20 hours. Tap P is opened at 8:00 AM and Tap Q is opened at 10:00 AM. At what exact time will the tank be completely full?',
        options: [
          'A) 4:00 PM',
          'B) 4:34 PM',
          'C) 5:25 PM',
          'D) 6:15 PM'
        ],
        correctAnswer: 'C',
        explanation: 'From 8 AM to 10 AM (2 hours), only P is open. Work done by P = 2 × (1/15) = 2/15. Remaining work = 13/15. From 10 AM, both are open. Combined rate = 1/15 + 1/20 = 4/60 + 3/60 = 7/60. Time taken for remaining work = (13/15) / (7/60) = 13/15 × 60/7 = 13 × 4 / 7 = 52/7 hours = 7 hours and 3/7 hours. 3/7 hours ≈ 25.7 minutes. Time = 10:00 AM + 7 hours 25.7 mins ≈ 5:25 PM.'
      },
      {
        id: 'apt-pipe-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Middle Leak with Proportional Drainage] A leak at the BOTTOM empties in 12h. A second leak at exactly HALF the height empties the top half in 10h. If tank is full, how long to empty?',
        question: 'A tank is full of water. A leak exactly at the bottom can empty the whole tank in 12 hours. A second leak exactly at half the height of the tank can empty the top half of the tank in 10 hours. If both leaks are active, how long will it take to completely empty the full tank?',
        options: [
          'A) 9 hours 45 mins',
          'B) 10 hours 20 mins',
          'C) 8 hours 40 mins',
          'D) 9 hours 30 mins'
        ],
        correctAnswer: 'A',
        explanation: '1) Bottom leak (L1) empties the whole tank at rate 1/12 per hour. 2) Middle leak (L2) empties the TOP HALF (Volume = 1/2) in 10 hours, so its rate for the whole tank is (1/2)/10 = 1/20 per hour. 3) Top half emptying: Both L1 and L2 are active. Combined rate = 1/12 + 1/20 = 5/60 + 3/60 = 8/60 = 2/15. Volume to empty = 1/2. Time for top half = (1/2) / (2/15) = 15/4 = 3.75 hours. 4) Bottom half emptying: Only L1 is active (water level is below L2). Volume to empty = 1/2. Rate = 1/12. Time = (1/2) / (1/12) = 6 hours. 5) Total time = 3.75 + 6 = 9.75 hours = 9 hours 45 minutes.'
      },
      {
        id: 'apt-pipe-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Fractions of Tank Filled] Pipe A fills 1/3 of tank in 5 min. Pipe B fills 1/4 in 5 min. If both open, time to fill 7/16 of tank?',
        question: 'Pipe A can fill 1/3 of a tank in exactly 5 minutes, while Pipe B can fill 1/4 of the same tank in exactly 5 minutes. If both pipes are opened together, how many minutes will they take to fill exactly 7/16 of the tank?',
        options: [
          'A) 3 1/2 minutes',
          'B) 3 3/4 minutes',
          'C) 4 1/8 minutes',
          'D) 4 3/4 minutes'
        ],
        correctAnswer: 'B',
        explanation: 'A\'s time for whole tank = 5 / (1/3) = 15 mins (rate = 1/15). B\'s time for whole tank = 5 / (1/4) = 20 mins (rate = 1/20). Combined rate = 1/15 + 1/20 = 4/60 + 3/60 = 7/60 per minute. Time to fill 7/16 of tank = Work / Rate = (7/16) / (7/60) = (7/16) × (60/7) = 60/16 = 15/4 = 3 3/4 minutes (3.75 minutes).'
      },
      {
        id: 'apt-pipe-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Efficiency Given as Percentage] A tap fills 20% more efficiently than a second tap. Together they fill in 30 mins. Find time for second tap alone.',
        question: 'Tap A is 20% more efficient than Tap B in filling a tank. If both taps are opened together, they can fill the tank completely in exactly 30 minutes. How many minutes would Tap B take to fill the tank if opened alone?',
        options: [
          'A) 54 minutes',
          'B) 60 minutes',
          'C) 66 minutes',
          'D) 72 minutes'
        ],
        correctAnswer: 'C',
        explanation: 'Efficiency of A = 1.2 × Efficiency of B. So Ratio of Rates (A : B) = 1.2 : 1 = 6 : 5. Let B\'s rate be 5k and A\'s rate be 6k. Combined rate = 11k. We know Combined Rate = 1 / 30. So 11k = 1/30 => k = 1/330. Rate of B = 5k = 5 / 330 = 1 / 66. Thus, Tap B alone takes 66 minutes.'
      },
      {
        id: 'apt-pipe-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Invert Trick with Three Pipes] Pipes A and B fill in 10 and 12 mins. C empties. All 3 take 15 mins to fill. Find C\'s emptying time.',
        question: 'Pipes A and B can fill a tank in 10 minutes and 12 minutes respectively. Pipe C is an emptying pipe. When all three pipes are opened together, the tank is completely filled in 15 minutes. In how many exact minutes can Pipe C alone empty the completely full tank?',
        options: [
          'A) 8 4/7 minutes',
          'B) 10 1/2 minutes',
          'C) 11 2/3 minutes',
          'D) 12 minutes'
        ],
        correctAnswer: 'A',
        explanation: 'Combined rate 1/A + 1/B - 1/C = 1/15. We have 1/10 + 1/12 - 1/C = 1/15. LCM of 10, 12 is 60: 6/60 + 5/60 - 1/C = 1/15 => 11/60 - 1/C = 4/60 => 1/C = 11/60 - 4/60 = 7/60. Thus, C takes 60/7 minutes = 8 4/7 minutes.'
      },
      {
        id: 'apt-pipe-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Pipe Radii Proportional to Area] Two pipes have diameters 1 cm and 2 cm. Flow is proportional to cross-section area. If smaller pipe fills in 40 mins, find time for both.',
        question: 'Two pipes have internal diameters of 1 cm and 2 cm respectively. The volume of water flowing through them per minute is strictly proportional to the cross-sectional area of the pipes. If the smaller pipe alone can fill a tank in 40 minutes, in how many minutes will both pipes working together fill the tank?',
        options: [
          'A) 8 minutes',
          'B) 10 minutes',
          'C) 12 minutes',
          'D) 13.33 minutes'
        ],
        correctAnswer: 'A',
        explanation: 'Flow rate ∝ Area ∝ (Diameter)^2. Ratio of Diameters = 1 : 2. Ratio of Areas = 1^2 : 2^2 = 1 : 4. So the larger pipe is 4 times as efficient as the smaller pipe! Rate of smaller pipe = 1/40. Rate of larger pipe = 4 × (1/40) = 4/40. Combined rate = 1/40 + 4/40 = 5/40 = 1/8. Both together fill the tank in exactly 8 minutes.'
      },
      {
        id: 'apt-pipe-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Proportion of Volume Left] A tank is 3/4 full. Pipe A fills in 12 min, Pipe B empties in 8 min. Both opened. When will it be empty?',
        question: 'A tank is currently exactly 3/4 full of water. Pipe A can fill the whole tank in 12 minutes, and Pipe B can empty the whole tank in 8 minutes. If both pipes are opened simultaneously, in how many minutes will the tank become completely empty?',
        options: [
          'A) 16 minutes',
          'B) 18 minutes',
          'C) 20 minutes',
          'D) 24 minutes'
        ],
        correctAnswer: 'B',
        explanation: 'Combined rate = +1/12 (filling) - 1/8 (emptying) = 2/24 - 3/24 = -1/24. The negative sign means the tank is emptying at a net rate of 1/24 of the tank per minute. The amount of water currently in the tank is 3/4. Time to empty = Volume / Rate = (3/4) / (1/24) = 3/4 × 24 = 18 minutes.'
      },
      {
        id: 'apt-pipe-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [System of 3 Equations] Pipes A, B fill in 20 min. B, C fill in 30 min. C, A fill in 40 min. Find time for A alone.',
        question: 'Pipes A and B can fill a cistern in 20 minutes. Pipes B and C can fill it in 30 minutes. Pipes C and A can fill it in 40 minutes. How many minutes will Pipe A alone take to fill the entire cistern?',
        options: [
          'A) 40 minutes',
          'B) 48 minutes',
          'C) 52 minutes',
          'D) 60 minutes'
        ],
        correctAnswer: 'B',
        explanation: '1/A + 1/B = 1/20; 1/B + 1/C = 1/30; 1/C + 1/A = 1/40. Add all three: 2(1/A + 1/B + 1/C) = 1/20 + 1/30 + 1/40. LCM of 20, 30, 40 is 120. Sum = 6/120 + 4/120 + 3/120 = 13/120. So 1/A + 1/B + 1/C = 13/240. We need A, so subtract (1/B + 1/C): 1/A = 13/240 - 1/30 = 13/240 - 8/240 = 5/240 = 1/48. Thus A takes exactly 48 minutes.'
      },
      {
        id: 'apt-pipe-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Equal Time Filling and Emptying Phase] A fills in 10h, B empties in 15h. A is opened. B is opened after 4h. Find total time.',
        question: 'Pipe A can fill a tank in 10 hours, and Pipe B can empty the full tank in 15 hours. Pipe A is opened initially. Exactly 4 hours later, Pipe B is also opened. What is the total time required from the start to completely fill the tank?',
        options: [
          'A) 16 hours',
          'B) 18 hours',
          'C) 20 hours',
          'D) 22 hours'
        ],
        correctAnswer: 'D',
        explanation: 'For the first 4 hours, only A is open. Work done by A = 4 × (1/10) = 4/10 = 2/5. Remaining work = 1 - 2/5 = 3/5. From 4 hours onward, both A and B are open. Combined rate = 1/10 - 1/15 = 3/30 - 2/30 = 1/30. Time to fill the remaining 3/5 at rate 1/30 = (3/5) / (1/30) = (3/5) × 30 = 18 hours. Total time from the start = 4 (initial) + 18 (combined) = 22 hours.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 17: TIME AND WORK (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 17,
    slug: 'aptitude-quant-time-and-work',
    title: 'Time and Work',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 43,
    video_url: 'http://www.youtube.com/watch?v=KE7tQf9spPg',
    video_title: 'Time and Work - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Master 1-day work inversion, efficiency ratios, alternate day scheduling, partial work deductions, and the MDH chain rule for equivalent worker groups.',
    summary_markdown: `### 📌 1. The Core "Invert" Principle
* **Total Days to 1-Day Work:** If a person completes the entire work in **\`N\` days**, their 1-day work is exactly **\`1/N\`**.
* **Combined Work:** If A does \`1/X\` work in a day and B does \`1/Y\` work in a day, working together they do **\`1/X + 1/Y\`** work in a day. Just sum the fractions, and INVERT the final sum to get the total days needed!

### 💡 2. Efficiency and Time
* **Inverse Proportion:** Efficiency (speed of doing work) is strictly **inversely proportional** to the time taken.
  * If A is **\`k\` times faster** than B, then Time taken by A = \`(1/k) × Time taken by B\`.
  * If A is **\`25% more efficient\`** than B, A's efficiency is 125% of B's. Ratio of Efficiencies \`A : B = 5 : 4\`. Ratio of Times \`A : B = 4 : 5\`.

### 💡 3. Advanced Placement Shortcuts
* **The MDH Rule (Chain Rule):** For two groups doing comparable work:
  **\`(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2\`**
  *(M = Men/Workers, D = Days, H = Hours/Day, W = Amount of Work/Wages)*
* **Men/Women/Boys Equivalence:**
  * If \`x\` Men OR \`y\` Women can complete a task in \`D\` days, equate their 1-day work to find the ratio \`1 Man = (y/x) Women\`. Convert all workers in the target question to a single unit (e.g., all Women) before solving.
* **Alternate Day Work:**
  * Calculate the work done in **1 full cycle** (e.g., A on Day 1 + B on Day 2 = 1 Cycle of 2 Days). Multiply the cycle until it gets as close to \`1\` (100% work) as possible without exceeding it, then manually add the remaining fraction for the final days.`,
    questions: [
      {
        id: 'apt-work-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Efficiency and Time Difference] A is 5 times faster than B and takes 60 days less to finish. Find A\'s individual time.',
        question: 'A can work 5 times faster than B and therefore takes 60 days less than B to complete a specific job. In exactly how many days can A individually complete the entire work?',
        options: [
          'A) 10 days',
          'B) 12 days',
          'C) 15 days',
          'D) 20 days'
        ],
        correctAnswer: 'C',
        explanation: 'Let time taken by A be T. Since A is 5 times faster, B is 5 times slower and takes 5T days. The difference is 5T - T = 4T. We are given 4T = 60 => T = 15 days. (B takes 75 days. Difference = 60).'
      },
      {
        id: 'apt-work-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [MDH Rule with Inverse Proportion] 24 men finish a work in 10 days. Find days for 30 men to complete the same work.',
        question: 'If 24 men can completely finish a work in exactly 10 days, how many days are required to complete the exact same work if 30 men are employed?',
        options: [
          'A) 8 days',
          'B) 12.5 days',
          'C) 14 days',
          'D) 15 days'
        ],
        correctAnswer: 'A',
        explanation: 'Use MDH formula: M1 × D1 = M2 × D2. 24 × 10 = 30 × D2 => 240 = 30 × D2 => D2 = 240 / 30 = 8 days. (More men = Less days, inversely proportional, do NOT cross multiply directly!).'
      },
      {
        id: 'apt-work-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Combined Work of 3 People] A does work in 3 days, B in 6 days, C in 7 days. Find time taken together.',
        question: 'A can do a piece of work in 3 days, B can do the same work in 6 days, and C can do it in 7 days. If they all work together, in exactly how many days will they complete the work?',
        options: [
          'A) 1 5/9 days',
          'B) 1 4/9 days',
          'C) 2 1/7 days',
          'D) 2 1/3 days'
        ],
        correctAnswer: 'A',
        explanation: 'Combined 1-day work = 1/3 + 1/6 + 1/7. LCM of 3, 6, 7 is 42. (14/42) + (7/42) + (6/42) = 27/42. Simplify 27/42 by dividing by 3 -> 9/14. Total time is the inverse = 14/9 days = 1 5/9 days.'
      },
      {
        id: 'apt-work-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Overlapping Pairs] P & Q in 12 days, Q & R in 16 days, R & P in 24 days. Find time for P, Q, R together.',
        question: 'P and Q can complete a work together in 12 days. Q and R can complete the same work in 16 days. R and P can complete it in 24 days. If P, Q, and R all work together, in how many days will they finish the work?',
        options: [
          'A) 8 1/3 days',
          'B) 9 3/5 days',
          'C) 10 2/3 days',
          'D) 11 1/5 days'
        ],
        correctAnswer: 'C',
        explanation: '1) 1/P + 1/Q = 1/12. 2) 1/Q + 1/R = 1/16. 3) 1/R + 1/P = 1/24. Add all three: 2(1/P + 1/Q + 1/R) = 1/12 + 1/16 + 1/24. LCM of 12, 16, 24 is 48. Sum = 4/48 + 3/48 + 2/48 = 9/48 = 3/16. So, 1/P + 1/Q + 1/R = 3/32. The time taken together is 32/3 = 10 2/3 days.'
      },
      {
        id: 'apt-work-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Efficiency Given as Percentage] P does work in 30 days. Q is 25% more efficient than P. Find time for Q alone.',
        question: 'P can complete a specific work in exactly 30 days. Q is 25% more efficient than P in completing the exact same work. In how many days will Q completely finish the work if acting alone?',
        options: [
          'A) 20 days',
          'B) 24 days',
          'C) 25 days',
          'D) 37.5 days'
        ],
        correctAnswer: 'B',
        explanation: 'Efficiency of Q = 125% of Efficiency of P = 1.25 × (1/30) = (5/4) × (1/30) = 5/120 = 1/24. Thus, Q\'s 1-day work is 1/24. Q will finish the work in exactly 24 days.'
      },
      {
        id: 'apt-work-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Men and Boys Equivalency] 3 men in 2 days. 4 boys in 6 days. Find time for 8 men and 8 boys together.',
        question: '3 men can complete a piece of work in exactly 2 days, and 4 boys can complete the exact same work in 6 days. In how many days will the same work be completed by a team of 8 men and 8 boys working together?',
        options: [
          'A) 0.6 days',
          'B) 0.8 days',
          'C) 1.2 days',
          'D) 1.5 days'
        ],
        correctAnswer: 'A',
        explanation: '1) Total Men-days = 3 × 2 = 6 Men-days to finish 1 work. So 1 Man\'s 1-day work = 1/6. 2) Total Boy-days = 4 × 6 = 24 Boy-days to finish 1 work. So 1 Boy\'s 1-day work = 1/24. 3) Team = 8 Men + 8 Boys. Their combined 1-day work = 8(1/6) + 8(1/24) = 8/6 + 8/24 = 32/24 + 8/24 = 40/24 = 5/3. 4) Total time = Inverse of 5/3 = 3/5 days = 0.6 days.'
      },
      {
        id: 'apt-work-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Person Leaves Mid-Way] Sita in 20 days, Gita in 25 days. Both begin, Sita leaves after some days. Gita finishes rest in 10 days. Find when Sita left.',
        question: 'Sita and Gita can do a work in 20 days and 25 days respectively. Both begin the work together, but after a few days, Sita leaves. Gita then finishes the remaining work strictly alone in exactly 10 days. After exactly how many days did Sita leave?',
        options: [
          'A) 5 2/3 days',
          'B) 6 2/3 days',
          'C) 8 1/3 days',
          'D) 10 days'
        ],
        correctAnswer: 'B',
        explanation: '1) Gita works alone for the last 10 days. Gita\'s 10-day work = 10 × (1/25) = 10/25 = 2/5 of the total work. 2) The remaining work (1 - 2/5 = 3/5) was done by Sita and Gita TOGETHER before Sita left. 3) Combined 1-day work of Sita and Gita = 1/20 + 1/25 = 5/100 + 4/100 = 9/100. 4) Time they worked together = (Work done together) / (Combined 1-day work) = (3/5) / (9/100) = (3/5) × (100/9) = 300 / 45 = 60 / 9 = 20 / 3 = 6 2/3 days.'
      },
      {
        id: 'apt-work-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Formula for Unknown Team Efficiencies] P alone takes 25 days more than P+Q. Q alone takes 9 days more than P+Q. Find time for P+Q.',
        question: 'When P alone does a work, he takes exactly 25 days MORE than the time taken by P and Q working together. When Q alone does the same work, he takes exactly 9 days MORE than the time taken by P and Q working together. In how many days can P and Q together finish this work?',
        options: [
          'A) 12 days',
          'B) 15 days',
          'C) 18 days',
          'D) 20 days'
        ],
        correctAnswer: 'B',
        explanation: 'Let time taken by P+Q together be N. Then P takes N + 25 days, and Q takes N + 9 days. The standard shortcut formula for this exact scenario is N = √(Extra days of P × Extra days of Q). Therefore, N = √(25 × 9) = √225 = 15 days.'
      },
      {
        id: 'apt-work-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Hours and Days Mixed Work] A in 12 days (8h/day). B in 8 days (10h/day). Find days for A and B together (8h/day).',
        question: 'A can complete a work in 12 days working 8 hours every day. B can complete the same work in 8 days working 10 hours every day. If A and B start working together for exactly 8 hours per day, in how many days will they complete the work?',
        options: [
          'A) 5 5/11 days',
          'B) 6 2/11 days',
          'C) 7 1/11 days',
          'D) 8 days'
        ],
        correctAnswer: 'A',
        explanation: 'Convert everything to hours first! A\'s total hours = 12 × 8 = 96 hrs. B\'s total hours = 8 × 10 = 80 hrs. 1) Combined 1-hour work = 1/96 + 1/80. LCM is 480. (5/480) + (6/480) = 11/480. 2) Total hours needed together = 480 / 11 hours. 3) They work 8 hours per day. Total days = (480 / 11) / 8 = 60 / 11 = 5 5/11 days.'
      },
      {
        id: 'apt-work-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Alternate Day Scheduling Exact Cycle] Raj in 16 days, Suraj in 12 days. They work alternate days starting with Raj. Find total days.',
        question: 'Raj can build a house alone in 16 days, and Suraj alone can build it in 12 days. They work on alternate days. If Raj works on the very first day, in exactly how many days will the house be completely built?',
        options: [
          'A) 13 1/2 days',
          'B) 13 3/4 days',
          'C) 14 days',
          'D) 14 1/4 days'
        ],
        correctAnswer: 'B',
        explanation: '1) Raj\'s 1-day work = 1/16. Suraj\'s 1-day work = 1/12. 2) 1 Cycle = 2 days (Raj then Suraj). Work in 1 Cycle = 1/16 + 1/12 = 3/48 + 4/48 = 7/48. 3) Find max cycles without exceeding 1: 7/48 × 6 cycles = 42/48 = 7/8. So 6 cycles = 12 days completed. Remaining work = 1 - 42/48 = 6/48 = 1/8. 4) Day 13: It\'s Raj\'s turn. He does 1/16. Remaining work = 1/8 - 1/16 = 1/16. 5) Day 14: Suraj\'s turn. He can do 1/12 in a full day. He needs to do 1/16. Time taken = (1/16) / (1/12) = 12/16 = 3/4 of a day. Total time = 12 (cycles) + 1 (Raj) + 3/4 (Suraj) = 13 3/4 days.'
      },
      {
        id: 'apt-work-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [MDH Rule with Work Amount] 15 men take 20 days to build 10 km of road. How many days for 20 men to build 15 km of road?',
        question: 'If 15 men take exactly 20 days to build a 10 km long stretch of road, how many days will it take for 20 men to build a 15 km long stretch of the identical road?',
        options: [
          'A) 18 days',
          'B) 20.5 days',
          'C) 22.5 days',
          'D) 25 days'
        ],
        correctAnswer: 'C',
        explanation: 'Using the MDH formula: (M1 × D1) / W1 = (M2 × D2) / W2. Here W is the distance of road built. (15 × 20) / 10 = (20 × D2) / 15 => 300 / 10 = 20 × D2 / 15 => 30 = 4 × D2 / 3 => 90 = 4 × D2 => D2 = 90 / 4 = 22.5 days.'
      },
      {
        id: 'apt-work-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Third Person Destructive Work] A in 10 days, B in 15 days. C destroys the work in 20 days. If all work together, find time.',
        question: 'A can build a wall in 10 days, and B can build it in 15 days. However, C is a demolisher and can completely destroy the built wall in exactly 20 days. If A, B, and C all start working simultaneously on an empty site, in how many days will the wall be fully built?',
        options: [
          'A) 8 4/7 days',
          'B) 10 2/3 days',
          'C) 12 days',
          'D) 15 days'
        ],
        correctAnswer: 'A',
        explanation: 'Net 1-day work = 1/A + 1/B - 1/C = 1/10 + 1/15 - 1/20. LCM of 10, 15, 20 is 60. Sum = 6/60 + 4/60 - 3/60 = 7/60. The total time taken to build the wall is the inverse: 60/7 days = 8 4/7 days.'
      },
      {
        id: 'apt-work-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Food Provision Exhaustion] A garrison of 500 men had provisions for 27 days. After 3 days, a reinforcement of 300 men arrived. For how many more days will the remaining food last?',
        question: 'A military garrison of 500 men had enough food provisions to last for 27 days. Exactly 3 days later, a reinforcement of 300 men arrived at the garrison. For how many MORE days will the remaining food provisions last the new total population?',
        options: [
          'A) 12 days',
          'B) 15 days',
          'C) 18 days',
          'D) 20 days'
        ],
        correctAnswer: 'B',
        explanation: '1) After 3 days, the 500 men have enough food left for (27 - 3) = 24 days. Total "man-days" of food remaining = 500 × 24 = 12,000 man-days. 2) The new population is 500 + 300 = 800 men. 3) The number of days the 12,000 man-days of food will last for 800 men is 12000 / 800 = 15 days.'
      },
      {
        id: 'apt-work-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Work Remaining Fraction] A can do a work in 20 days. He works for 5 days and leaves. What fraction of work is left for B?',
        question: 'A can completely finish a job in exactly 20 days. He starts the job and works alone for exactly 5 days before leaving. What exact fraction of the original total work is left unfinished?',
        options: [
          'A) 1/4',
          'B) 2/5',
          'C) 1/2',
          'D) 3/4'
        ],
        correctAnswer: 'D',
        explanation: 'A\'s 1-day work = 1/20. Work done by A in 5 days = 5 × (1/20) = 5/20 = 1/4 of the total work. The fraction of work left unfinished is 1 - 1/4 = 3/4.'
      },
      {
        id: 'apt-work-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q15: [Efficiency Ratio Given in Fraction] A is 30% more efficient than B. How much time will they take working together to complete a job B does in 23 days?',
        question: 'Worker A is exactly 30% more efficient than Worker B. If Worker B alone takes exactly 23 days to complete a specific job, how many days will it take for A and B to complete the exact same job working together?',
        options: [
          'A) 10 days',
          'B) 11 days',
          'C) 13 days',
          'D) 15 days'
        ],
        correctAnswer: 'A',
        explanation: '1) Efficiency A : Efficiency B = 130 : 100 = 13 : 10. 2) This means if B completes 10 units of work per day, A completes 13 units. 3) Total work = B\'s daily work × B\'s days = 10 units/day × 23 days = 230 units. 4) When working together, their combined daily work = 13 + 10 = 23 units/day. 5) Total time taken together = Total Work / Combined Rate = 230 / 23 = 10 days.'
      },
      {
        id: 'apt-work-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Two Variables MDH Equality] If 4 men and 6 women can do a work in 8 days, while 3 men and 7 women can do it in 10 days, find time for 10 women.',
        question: 'If 4 men and 6 women can complete a work in 8 days, while 3 men and 7 women can complete the exact same work in 10 days, how many days will exactly 10 women working alone take to complete the work?',
        options: [
          'A) 32 days',
          'B) 36 days',
          'C) 40 days',
          'D) 45 days'
        ],
        correctAnswer: 'C',
        explanation: 'Equate total work: 8(4M + 6W) = 10(3M + 7W) => 32M + 48W = 30M + 70W => 2M = 22W => 1M = 11W. Substitute 1M = 11W into the first group: (4(11W) + 6W) × 8 days = (44W + 6W) × 8 = 50W × 8 = 400 Woman-days to complete the work. Total time for 10 women = 400 / 10 = 40 days.'
      },
      {
        id: 'apt-work-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Alternative Joiners in Time and Work] A in 20, B in 30, C in 60. A works continuously. B and C help him every 3rd day. Find total days.',
        question: 'A can do a work in 20 days, B in 30 days, and C in 60 days. A works continuously every day. B and C help him together every third day. In how many days will the entire work be finished?',
        options: [
          'A) 12 days',
          'B) 15 days',
          'C) 16 days',
          'D) 18 days'
        ],
        correctAnswer: 'B',
        explanation: 'Total work = LCM(20, 30, 60) = 60 units. A\'s rate = 3 units/day. B\'s rate = 2 units/day. C\'s rate = 1 unit/day. Day 1: A works alone = 3 units. Day 2: A works alone = 3 units. Day 3: A, B, and C work together = 3 + 2 + 1 = 6 units. 1 Cycle of 3 days completes 3 + 3 + 6 = 12 units. Number of cycles required = 60 / 12 = 5 full cycles. Total days = 5 × 3 = 15 days.'
      },
      {
        id: 'apt-work-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Fractional Rate Comparison] A does half as much work as B in three-fourth of the time. If together they take 18 days, find B\'s time.',
        question: 'A does half as much work as B in three-fourths of the time taken by B. If together they complete the work in exactly 18 days, how many days shall B take to complete the work alone?',
        options: [
          'A) 30 days',
          'B) 36 days',
          'C) 40 days',
          'D) 45 days'
        ],
        correctAnswer: 'A',
        explanation: 'Let B\'s 1-day work be 1 unit (so B takes W days). In (3/4) of B\'s time, A does 1/2 of B\'s work. Thus, A\'s rate = (1/2 Work) / (3/4 Time) = 2/3 of B\'s rate! So Efficiency A : B = 2 : 3. Combined rate = 5 units/day. Total work = 18 days × 5 units/day = 90 units. B alone (3 units/day) takes 90 / 3 = 30 days.'
      },
      {
        id: 'apt-work-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Deduction from Total Wage] If 6 men and 8 boys can do a piece of work in 10 days while 26 men and 48 boys can do the same in 2 days, what is the ratio of their efficiencies?',
        question: 'If 6 men and 8 boys can complete a piece of work in 10 days, while 26 men and 48 boys can complete the exact same work in 2 days, what is the ratio of the daily work capacity of a man to that of a boy?',
        options: [
          'A) 1 : 2',
          'B) 2 : 1',
          'C) 3 : 2',
          'D) 4 : 3'
        ],
        correctAnswer: 'B',
        explanation: 'Total work = 10(6M + 8B) = 2(26M + 48B). 60M + 80B = 52M + 96B => 8M = 16B => 1M = 2B. The ratio of the daily work capacity of a man to a boy is 2 : 1.'
      },
      {
        id: 'apt-work-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Equalizing Work with Multiple Variables] A takes twice as much time as B and C together, and B takes thrice as much time as A and C together. All 3 in 24 days. Find A\'s time.',
        question: 'To complete a piece of work, A takes twice as much time as B and C working together. B takes thrice as much time as A and C working together. If all three working together can complete the work in exactly 24 days, how many days will A alone take to complete it?',
        options: [
          'A) 56 days',
          'B) 64 days',
          'C) 72 days',
          'D) 96 days'
        ],
        correctAnswer: 'C',
        explanation: 'Time taken is inversely proportional to Efficiency. 1) Time A = 2 × Time (B+C) => Efficiency A = 1/2 × Efficiency (B+C). So A does 1/3 of the total combined work! 2) Time B = 3 × Time (A+C) => Efficiency B = 1/3 × Efficiency (A+C). So B does 1/4 of the total combined work! 3) All three take 24 days. Since A does 1/3 of the combined work, A\'s rate is (1/3) of (1/24) = 1/72 per day. Thus, A alone takes 72 days.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 18: BOATS AND STREAMS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 18,
    slug: 'aptitude-quant-boats-and-streams',
    title: 'Boats and Streams',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 34,
    video_url: 'http://www.youtube.com/watch?v=-EdJ4kAW-j4',
    video_title: 'Boats and Streams - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master upstream/downstream relative speed models, simultaneous equation time-distance systems, and the still-water velocity deduction shortcut.',
    summary_markdown: `### 📌 1. Core Speed Relationships
* Let **\`x\`** be the speed of the Boat (or Man) in **Still Water**.
* Let **\`y\`** be the speed of the River Current (Stream).
* **Downstream Speed (DS):** Traveling with the current $\\rightarrow$ **\`x + y\`**.
* **Upstream Speed (US):** Traveling against the current $\\rightarrow$ **\`x - y\`**.

### 💡 2. Deducing Unknowns from Upstream & Downstream
* If Downstream Speed (\`DS\`) and Upstream Speed (\`US\`) are known, you can instantly find \`x\` and \`y\` by adding/subtracting the two equations:
  * **Speed in Still Water (\`x\`):** **\`(DS + US) / 2\`**
  * **Speed of Stream (\`y\`):** **\`(DS - US) / 2\`**

### 💡 3. Advanced Placement Shortcuts
* **Constant Distance Round-Trip (Same Time Ratio):**
  * If a boat takes time \`T_u\` to go Upstream and \`T_d\` to go Downstream over the same distance, the ratio of the Boat\'s speed to the Stream\'s speed is:
  * **\`x / y = (T_u + T_d) / (T_u - T_d)\`**
* **System of Equations (Simultaneous Distance Trips):**
  * Often given two trips: \`(D1/US) + (D2/DS) = Time1\` and \`(D3/US) + (D4/DS) = Time2\`.
  * Do NOT expand \`x - y\` and \`x + y\`! Instead, substitute \`U = 1/US\` and \`D = 1/DS\` to solve linear equations, then invert back to find \`x\` and \`y\`.`,
    questions: [
      {
        id: 'apt-boat-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Extracting Speeds from Times] A boat takes 12 hours to row 48 km upstream and 8 hours to row the same distance downstream. Find the speed of the river.',
        question: 'What is the speed of the river current if a boat takes exactly 12 hours to row 48 km upstream, and exactly 8 hours to row the same 48 km distance downstream?',
        options: [
          'A) 1 km/hr',
          'B) 2 km/hr',
          'C) 4 km/hr',
          'D) 5 km/hr'
        ],
        correctAnswer: 'A',
        explanation: '1) Upstream speed (x - y) = 48 / 12 = 4 km/hr. 2) Downstream speed (x + y) = 48 / 8 = 6 km/hr. 3) Speed of stream (y) = (Downstream - Upstream) / 2 = (6 - 4) / 2 = 2 / 2 = 1 km/hr.'
      },
      {
        id: 'apt-boat-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q2: [Ratio of Speeds from Time Ratio] Simran takes twice as long to swim up as to swim down. If her speed in still water is 12 km/hr, find stream speed.',
        question: 'Simran takes exactly twice as long to swim upstream as she does to swim the identical distance downstream. If her swimming speed in completely still water is 12 km/hr, what is the speed of the river stream?',
        options: [
          'A) 2 km/hr',
          'B) 3 km/hr',
          'C) 4 km/hr',
          'D) 6 km/hr'
        ],
        correctAnswer: 'C',
        explanation: 'Time Upstream = 2 × Time Downstream. Since Time is inversely proportional to Speed (for the same distance): Downstream Speed = 2 × Upstream Speed => (x + y) = 2(x - y) => x + y = 2x - 2y => x = 3y. We know x = 12 km/hr, so 12 = 3y => y = 4 km/hr.'
      },
      {
        id: 'apt-boat-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Total Round Trip Time Formula] P takes 1 hour to row to a place and back. If stream is 2.4 km/hr and still water speed is 12 km/hr, find distance.',
        question: 'It takes a rower exactly 1 hour in total to row to a place and come back. If the river current is flowing at 2.4 km/hr and the rower\'s speed in still water is 12 km/hr, what is the one-way distance to the place?',
        options: [
          'A) 5.24 km',
          'B) 5.76 km',
          'C) 6.00 km',
          'D) 6.25 km'
        ],
        correctAnswer: 'B',
        explanation: '1) Downstream speed (x + y) = 12 + 2.4 = 14.4 km/hr. 2) Upstream speed (x - y) = 12 - 2.4 = 9.6 km/hr. 3) Total Time = D / 14.4 + D / 9.6 = 1. Multiply by 28.8 (LCM of 14.4 and 9.6): 2D + 3D = 28.8 => 5D = 28.8 => D = 28.8 / 5 = 5.76 km.'
      },
      {
        id: 'apt-boat-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [System of Two Distance/Time Equations] Raj swims 6.5h for 24km DS and 36km US. Also 6h for 36km DS and 24km US. Find river speed.',
        question: 'Raj swims for 6.5 hours while going 24 km downstream and 36 km upstream. On another day, he takes exactly 6 hours to swim 36 km downstream and 24 km upstream. At what exact rate is the river flowing?',
        options: [
          'A) 2 km/hr',
          'B) 3 km/hr',
          'C) 4 km/hr',
          'D) 5 km/hr'
        ],
        correctAnswer: 'A',
        explanation: 'Let D = Downstream Speed and U = Upstream Speed. 1) 24/D + 36/U = 6.5. 2) 36/D + 24/U = 6. Multiply (2) by 1.5: 54/D + 36/U = 9. Subtract (1) from this: 30/D = 2.5 => D = 12 km/hr. Substitute D = 12 into (2): 36/12 + 24/U = 6 => 3 + 24/U = 6 => 24/U = 3 => U = 8 km/hr. Speed of river (y) = (D - U) / 2 = (12 - 8) / 2 = 2 km/hr.'
      },
      {
        id: 'apt-boat-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Ratio of Speeds from Unspecified Distance] Time ratio for 10km UP to 10km DOWN is 11:5. Find ratio of still water to river speed.',
        question: 'Find the exact ratio of the swimming speed of Raj in still water to the speed of the river, given that the ratio of the time taken to go 10 km upstream to the time taken to go 10 km downstream is 11 : 5.',
        options: [
          'A) 5 : 3',
          'B) 8 : 3',
          'C) 11 : 5',
          'D) 16 : 6'
        ],
        correctAnswer: 'B',
        explanation: 'Time Up / Time Down = 11 / 5. Since Distance is identical (10 km), Speed is inversely proportional to Time. Thus, Downstream Speed / Upstream Speed = 11 / 5 => (x + y) / (x - y) = 11 / 5. By Componendo-Dividendo: x / y = (11 + 5) / (11 - 5) = 16 / 6 = 8 / 3. The ratio is 8 : 3.'
      },
      {
        id: 'apt-boat-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Proportional Time with Variable Distance] Ratio of still water speed to stream is 7:1. Swims 4.2km UP in 14 mins. Find time for 18.4km DOWN.',
        question: 'The ratio of Guddi\'s swimming speed in still water to the speed of the river is 7 : 1. She swims 4.2 km UP the river in exactly 14 minutes. How much time will Guddi take to swim 18.4 km DOWN the river?',
        options: [
          'A) 40 minutes',
          'B) 46 minutes',
          'C) 52 minutes',
          'D) 56 minutes'
        ],
        correctAnswer: 'B',
        explanation: '1) x/y = 7/1 => x = 7y. Upstream speed (x - y) = 6y. Downstream speed (x + y) = 8y. 2) Upstream speed = Distance / Time = 4.2 km / 14 mins = 0.3 km/min. So 6y = 0.3 => y = 0.05 km/min. 3) Downstream speed = 8y = 8 × 0.05 = 0.4 km/min. 4) Time for 18.4 km downstream = Distance / Speed = 18.4 / 0.4 = 184 / 4 = 46 minutes.'
      },
      {
        id: 'apt-boat-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Deducing Total Distance from Fraction] A boat travels 15 km upstream and 22 km downstream in 5 hours. In 13/2 hours it travels 20 km upstream and 27.5 km downstream. Find speed of stream.',
        question: 'A boat travels 15 km upstream and 22 km downstream in exactly 5 hours. On another occasion, it travels 20 km upstream and 27.5 km downstream in 6.5 hours (13/2 hours). What is the exact speed of the stream?',
        options: [
          'A) 2 km/hr',
          'B) 3 km/hr',
          'C) 4 km/hr',
          'D) 5 km/hr'
        ],
        correctAnswer: 'B',
        explanation: 'Let D = Downstream Speed, U = Upstream Speed. 1) 15/U + 22/D = 5. 2) 20/U + 27.5/D = 6.5. Multiply (1) by 4: 60/U + 88/D = 20. Multiply (2) by 3: 60/U + 82.5/D = 19.5. Subtract: 5.5/D = 0.5 => D = 11 km/hr. Substitute D=11 into (1): 15/U + 22/11 = 5 => 15/U + 2 = 5 => 15/U = 3 => U = 5 km/hr. Stream speed y = (D - U) / 2 = (11 - 5) / 2 = 3 km/hr.'
      },
      {
        id: 'apt-boat-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Equal Distance Stream and Boat Ratio] A man can row 30 km downstream and return in 8 hours. If the speed of the boat in still water is four times the speed of the current, find speed of current.',
        question: 'A man can row 30 km downstream and return 30 km upstream to the starting point in exactly 8 hours total. If his speed in still water is exactly 4 times the speed of the current, what is the speed of the current?',
        options: [
          'A) 2 km/hr',
          'B) 3 km/hr',
          'C) 4 km/hr',
          'D) 5 km/hr'
        ],
        correctAnswer: 'A',
        explanation: 'Given x = 4y. Downstream speed = x + y = 5y. Upstream speed = x - y = 3y. Total Time = 30/(5y) + 30/(3y) = 8 => 6/y + 10/y = 8 => 16/y = 8 => y = 16 / 8 = 2 km/hr.'
      },
      {
        id: 'apt-boat-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Difference in Time for Equal Distance] The speed of a boat in still water is 15 km/hr. It goes 30 km upstream and returns downstream to the original point in 4 hrs 30 mins. Find speed of stream.',
        question: 'The speed of a motorboat in still water is exactly 15 km/hr. It travels 30 km upstream and returns back 30 km downstream to the original starting point in 4 hours and 30 minutes. What is the speed of the stream?',
        options: [
          'A) 3 km/hr',
          'B) 4 km/hr',
          'C) 5 km/hr',
          'D) 6 km/hr'
        ],
        correctAnswer: 'C',
        explanation: 'x = 15. Total time = 4.5 hours = 9/2 hours. 30/(15 - y) + 30/(15 + y) = 9/2. Factor out 30: 30 * [ (15+y + 15-y) / (225 - y^2) ] = 9/2 => 30 × 30 / (225 - y^2) = 9/2 => 900 / (225 - y^2) = 9/2 => 100 / (225 - y^2) = 1/2 => 225 - y^2 = 200 => y^2 = 25 => y = 5 km/hr.'
      },
      {
        id: 'apt-boat-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Fraction of Distance Over Time] A man rows to a place 48 km distant and back in 14 hours. He finds that he can row 4 km with the stream in the same time as 3 km against the stream. Find speed of stream.',
        question: 'A man rows to a place 48 km away and comes back, taking a total of 14 hours. He notes that he can row 4 km with the stream (downstream) in the exact same time it takes him to row 3 km against the stream (upstream). What is the speed of the stream?',
        options: [
          'A) 0.5 km/hr',
          'B) 1.0 km/hr',
          'C) 1.5 km/hr',
          'D) 2.0 km/hr'
        ],
        correctAnswer: 'B',
        explanation: '1) Downstream Speed / Upstream Speed = Distance Down / Distance Up (for same time) = 4 / 3. Let D = 4k and U = 3k. 2) Total Time = 48/D + 48/U = 14 => 48/(4k) + 48/(3k) = 14 => 12/k + 16/k = 14 => 28/k = 14 => k = 2. 3) Thus, D = 8 km/hr and U = 6 km/hr. 4) Speed of stream = (D - U) / 2 = (8 - 6) / 2 = 1 km/hr.'
      },
      {
        id: 'apt-boat-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Finding Original Speed After Time Delay] A man can row 6 km/hr in still water. When river is running at 1.2 km/hr, it takes him 1 hour to row to a place and back. How far is the place?',
        question: 'A man can row at a speed of 6 km/hr in still water. If the river is flowing at 1.2 km/hr, it takes him exactly 1 hour to row to a certain location and return to the starting point. How far is the location?',
        options: [
          'A) 2.40 km',
          'B) 2.88 km',
          'C) 3.12 km',
          'D) 3.60 km'
        ],
        correctAnswer: 'B',
        explanation: 'x = 6, y = 1.2. Downstream D = 7.2. Upstream U = 4.8. Total time = D_dist / 7.2 + D_dist / 4.8 = 1. LCM of 7.2 and 4.8 is 14.4. So (2D_dist + 3D_dist) / 14.4 = 1 => 5D_dist = 14.4 => D_dist = 14.4 / 5 = 2.88 km.'
      },
      {
        id: 'apt-boat-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Two Boats Meeting Mid-Stream] Boats A and B start towards each other from two places 108 km apart. A goes downstream, B upstream. If their still water speeds are 12 and 15 km/hr, when will they meet?',
        question: 'Boats A and B start simultaneously towards each other from two places 108 km apart. Boat A travels downstream while Boat B travels upstream. If their respective speeds in still water are 12 km/hr and 15 km/hr, after how many hours will they meet?',
        options: [
          'A) 3.5 hours',
          'B) 4.0 hours',
          'C) 4.5 hours',
          'D) 5.0 hours'
        ],
        correctAnswer: 'B',
        explanation: 'When two boats travel towards each other on a river (one downstream, one upstream), their relative speed is (x_A + y) + (x_B - y) = x_A + x_B! The river speed (y) completely cancels out! Relative Speed = 12 + 15 = 27 km/hr. Time = Distance / Relative Speed = 108 / 27 = 4 hours.'
      },
      {
        id: 'apt-boat-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Escaping a Chasing Boat] Boat A chases Boat B, both traveling downstream. A is 10 km behind B. If A\'s still water speed is 20 and B\'s is 15, when will A catch B?',
        question: 'Boat A is chasing Boat B, and both are traveling downstream on a river flowing at 3 km/hr. Boat A is currently 10 km behind Boat B. If A\'s speed in still water is 20 km/hr and B\'s speed in still water is 15 km/hr, in exactly how many hours will Boat A catch up to Boat B?',
        options: [
          'A) 1.5 hours',
          'B) 2.0 hours',
          'C) 2.5 hours',
          'D) 3.0 hours'
        ],
        correctAnswer: 'B',
        explanation: 'Since both are traveling downstream, their absolute speeds over ground are (20 + 3) = 23 km/hr and (15 + 3) = 18 km/hr. Their Relative Speed = 23 - 18 = 5 km/hr. (Notice the river speed cancels out again: (20+y) - (15+y) = 5!). Time to close 10 km gap = Distance / Relative Speed = 10 / 5 = 2 hours.'
      },
      {
        id: 'apt-boat-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Proportional Time with Variable Speed] A boat covers a round trip. If its still water speed doubles, the round trip takes 40% of original time. Find ratio of original boat speed to stream speed.',
        question: 'A boat covers a certain round trip (downstream and then back upstream). If the boat\'s speed in still water is exactly doubled (while the stream speed remains constant), the total time taken for the identical round trip becomes exactly 40% of the original time. What is the ratio of the boat\'s original speed in still water to the speed of the stream?',
        options: [
          'A) 2 : 1',
          'B) 3 : 2',
          'C) 5 : 3',
          'D) 4 : 1'
        ],
        correctAnswer: 'A',
        explanation: 'Let original time = T1 = D/(x+y) + D/(x-y) = 2Dx / (x^2 - y^2). Let doubled speed time = T2 = D/(2x+y) + D/(2x-y) = 4Dx / (4x^2 - y^2). Given T2 = 40% of T1 = (2/5)T1 => 4Dx / (4x^2 - y^2) = (2/5) × [2Dx / (x^2 - y^2)]. Cancel 4Dx from both sides: 1 / (4x^2 - y^2) = 1 / [5(x^2 - y^2)]. Cross-multiply: 5(x^2 - y^2) = 4x^2 - y^2 => 5x^2 - 5y^2 = 4x^2 - y^2 => x^2 = 4y^2 => x / y = 2 / 1 = 2 : 1.'
      },
      {
        id: 'apt-boat-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Boat Average Speed Over Equal Distance] A boat goes downstream at 20 km/hr and upstream at 10 km/hr. Find average speed for the round trip.',
        question: 'A motorboat travels a certain distance downstream at a constant speed of 20 km/hr, and returns upstream along the identical route at a constant speed of 10 km/hr. What is the average speed of the boat for the entire round trip?',
        options: [
          'A) 13.33 km/hr',
          'B) 14.50 km/hr',
          'C) 15.00 km/hr',
          'D) 16.66 km/hr'
        ],
        correctAnswer: 'A',
        explanation: 'For equal distances, the average speed is NEVER the simple average (15). Instead, use the harmonic mean formula: Average Speed = (2 × DS × US) / (DS + US) = (2 × 20 × 10) / (20 + 10) = 400 / 30 = 40 / 3 = 13.33 km/hr.'
      },
      {
        id: 'apt-boat-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Distance using Variable Flow] A man rows downstream 15 km/hr and upstream 9 km/hr. A piece of wood is dropped into the river. How far will it float in 4 hours?',
        question: 'A man can row downstream at an effective speed of 15 km/hr and upstream at an effective speed of 9 km/hr. If a piece of solid wood is dropped into the same river, how far will it float away in exactly 4 hours?',
        options: [
          'A) 8 km',
          'B) 12 km',
          'C) 16 km',
          'D) 24 km'
        ],
        correctAnswer: 'B',
        explanation: 'A piece of floating wood has no engine, so its speed is exactly the speed of the river current (y). River speed y = (DS - US) / 2 = (15 - 9) / 2 = 6 / 2 = 3 km/hr. Distance covered in 4 hours = Speed × Time = 3 × 4 = 12 km.'
      },
      {
        id: 'apt-boat-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Loss of Motor Downstream] A motorboat goes downstream. Engine fails midway. Time taken is doubled. Find ratio of boat speed to river speed.',
        question: 'A motorboat starts traveling downstream between two ports. Exactly halfway through the journey, its engine fails completely, and it merely floats the rest of the way with the river current. If the total time taken for the journey is exactly twice the time it would have taken if the engine had not failed, what is the ratio of the boat\'s still water speed to the river\'s speed?',
        options: [
          'A) 2 : 1',
          'B) 3 : 1',
          'C) 4 : 1',
          'D) 5 : 1'
        ],
        correctAnswer: 'A',
        explanation: 'Let D be the half-distance (so total distance is 2D). Normal time = 2D / (x + y). Time taken with failure = D / (x + y) + D / y (floating speed is y). We are given: D/(x+y) + D/y = 2 × [2D / (x+y)]. Divide by D: 1/(x+y) + 1/y = 4/(x+y). Subtract 1/(x+y) from both sides: 1/y = 3/(x+y). Cross-multiply: x + y = 3y => x = 2y. Therefore, x / y = 2 / 1 = 2 : 1.'
      },
      {
        id: 'apt-boat-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [River with Moving Walkway Analogy] An escalator moves down at 2 steps/sec. A person walks down it at 3 steps/sec, reaching bottom in 20 sec. How long to walk UP the down-escalator at same speed?',
        question: 'An escalator moves downwards at a constant rate of 2 steps/sec. A person walks down the escalator at a rate of 3 steps/sec, reaching the bottom in exactly 20 seconds. If the person decides to walk UP the descending escalator at the same walking effort (3 steps/sec), how many seconds will it take to reach the top?',
        options: [
          'A) 40 seconds',
          'B) 60 seconds',
          'C) 80 seconds',
          'D) 100 seconds'
        ],
        correctAnswer: 'D',
        explanation: 'Escalator problems perfectly mirror Boats and Streams! Speed of stream (escalator) = 2 steps/sec. Speed of person in still air (walking speed) = 3 steps/sec. Downstream speed = 3 + 2 = 5 steps/sec. Distance (total steps of escalator) = DS × Time = 5 × 20 = 100 steps. Upstream speed (walking up the down-escalator) = 3 - 2 = 1 step/sec. Time to reach top = Distance / US = 100 / 1 = 100 seconds.'
      },
      {
        id: 'apt-boat-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Deducing Velocity without Total Distance] A boat goes 2 km against the stream in 1 hour and 1 km with the stream in 10 minutes. How long will it take to go 5 km in stationary water?',
        question: 'A boat goes exactly 2 km against the stream (upstream) in 1 hour, and exactly 1 km with the stream (downstream) in 10 minutes. How long will it take the boat to travel exactly 5 km in stationary (still) water?',
        options: [
          'A) 1 hour 15 mins',
          'B) 1 hour 30 mins',
          'C) 1 hour 45 mins',
          'D) 2 hours'
        ],
        correctAnswer: 'A',
        explanation: '1) Upstream speed = 2 km / 1 hr = 2 km/hr. 2) Downstream speed = 1 km / 10 mins = 1 km / (1/6 hr) = 6 km/hr. 3) Speed of boat in still water (x) = (DS + US) / 2 = (6 + 2) / 2 = 4 km/hr. 4) Time to go 5 km in still water = Distance / Speed = 5 / 4 = 1.25 hours = 1 hour 15 minutes.'
      },
      {
        id: 'apt-boat-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Equal Time Fractional Stream Check] A man rows downstream 60 km and upstream 20 km, taking 4 hours for EACH journey. What is the velocity of the stream?',
        question: 'A man rows a boat downstream for 60 km and upstream for 20 km, taking exactly 4 hours for EACH individual journey. What is the velocity of the river stream?',
        options: [
          'A) 5 km/hr',
          'B) 6.5 km/hr',
          'C) 8 km/hr',
          'D) 10 km/hr'
        ],
        correctAnswer: 'A',
        explanation: '1) Downstream speed (x + y) = 60 km / 4 hr = 15 km/hr. 2) Upstream speed (x - y) = 20 km / 4 hr = 5 km/hr. 3) Speed of the stream (y) = (DS - US) / 2 = (15 - 5) / 2 = 10 / 2 = 5 km/hr.'
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

async function seedAptitudeBatch6() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 6 (TOPICS 16 TO 18) ===\n');

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

    // 2. Upsert Topics 16 to 18
    for (const item of aptitudeBatch6) {
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
      await client.query(`UPDATE tracks SET total_topics = 18, estimated_hours = 36 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 18, estimated_hours = 36');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 18 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 18');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 6 (Topics 16 to 18) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch6();
