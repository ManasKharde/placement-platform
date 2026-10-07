const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch7 = [
  // ===========================================================================
  // TOPIC 19: PROBLEMS ON TRAINS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 19,
    slug: 'aptitude-quant-problems-on-trains',
    title: 'Problems on Trains',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 44,
    video_url: 'http://www.youtube.com/watch?v=78b4Jn4rw44',
    video_title: 'Problems on Trains - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Master relative speed concepts, crossing stationary vs. moving objects, platform length math, and same vs. opposite direction train overtakes.',
    summary_markdown: `### 📌 1. Fundamentals of Train Problems
* **Distance is Additive:** Whenever a train crosses an object with length (like a platform, bridge, or another train), the total distance traveled is the **Sum of their lengths**.
* **Zero Length Objects:** For a stationary or moving man, pole, or car (unless specified), the length of the object is taken as **0**. Total distance = Length of the train.
* **Unit Conversions:** Always ensure units are consistent.
  * \`km/hr\` to \`m/s\` $\\rightarrow$ Multiply by **\`5/18\`**
  * \`m/s\` to \`km/hr\` $\\rightarrow$ Multiply by **\`18/5\`**

### 💡 2. Relative Speed Concepts
* **Opposite Directions (Attract):** Speeds are added $\\rightarrow$ **\`Relative Speed = S1 + S2\`**
* **Same Direction (Overtake):** Speeds are subtracted $\\rightarrow$ **\`Relative Speed = S1 - S2\`**
* Time taken for two trains of lengths \`L1\` and \`L2\` to cross each other:
  * Opposite Directions: **\`T = (L1 + L2) / (S1 + S2)\`**
  * Same Direction: **\`T = (L1 + L2) / (S1 - S2)\`**

### 💡 3. High-Yield Shortcuts
* If two trains start at the same time from points A and B towards each other, and after crossing they take \`T1\` and \`T2\` hours to reach B and A respectively, the ratio of their speeds is:
  **\`S1 / S2 = √(T2 / T1)\`**
* When a train passes two objects of different lengths \`L1\` and \`L2\` in times \`T1\` and \`T2\`, equate the speed:
  **\`(Length of Train + L1) / T1 = (Length of Train + L2) / T2\`**`,
    questions: [
      {
        id: 'apt-trains-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Train Length via Platform Crossing] A train passes a stationary pole in 8 seconds and a 200 m long bridge in 28 seconds. What is the length of the train?',
        question: 'A train moving at a constant speed passes a stationary telegraph pole in exactly 8 seconds, and it completely crosses a 200-meter long bridge in 28 seconds. What is the exact length of the train?',
        options: [
          'A) 60 meters',
          'B) 80 meters',
          'C) 100 meters',
          'D) 120 meters'
        ],
        correctAnswer: 'B',
        explanation: 'Let the length of the train be L. Speed of train = L/8. When crossing the bridge, Distance = L + 200, and Speed = (L + 200)/28. Equating speeds: L/8 = (L + 200)/28 => 28L = 8L + 1600 => 20L = 1600 => L = 80 meters.'
      },
      {
        id: 'apt-trains-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Crossing Trains Opposite Direction] Two trains 126 m and 119 m long are moving towards each other at 12 m/s and 23 m/s. How much time will they take to cross each other?',
        question: 'Two trains, 126 meters and 119 meters long respectively, are moving towards each other on parallel tracks at speeds of 12 m/s and 23 m/s. How much time will they take to completely cross each other?',
        options: [
          'A) 5 seconds',
          'B) 7 seconds',
          'C) 9 seconds',
          'D) 11 seconds'
        ],
        correctAnswer: 'B',
        explanation: 'Total distance to be covered = Sum of lengths = 126 + 119 = 245 m. Since they are moving in opposite directions, relative speed = 12 + 23 = 35 m/s. Time taken = Distance / Relative Speed = 245 / 35 = 7 seconds.'
      },
      {
        id: 'apt-trains-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q3: [Finding Train Length from Two Moving Men] A train overtakes two boys walking in the same direction at 8 km/hr and 16 km/hr in 36 and 40 seconds respectively. Find the length of the train.',
        question: 'A train running at a uniform speed overtakes two boys walking in the same direction along the railway track. The first boy is walking at 8 km/hr and the second at 16 km/hr. The train passes them completely in 36 seconds and 40 seconds respectively. What is the length of the train?',
        options: [
          'A) 400 meters',
          'B) 600 meters',
          'C) 800 meters',
          'D) 1,000 meters'
        ],
        correctAnswer: 'C',
        explanation: 'Let train speed be S km/hr. Relative speeds are (S - 8) and (S - 16). Distance (Length of train) is constant. So, (S - 8) × (36/3600) = (S - 16) × (40/3600). Simplify: 36(S - 8) = 40(S - 16) => 36S - 288 = 40S - 640 => 4S = 352 => S = 88 km/hr. Length of train = Relative Speed × Time = (88 - 8) × (5/18) × 36 = 80 × 10 = 800 meters.'
      },
      {
        id: 'apt-trains-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Equal Length Trains Crossing] Two trains P and Q of equal length cross a stationary pole in 5s and 6s. How long will they take to cross each other moving in the same direction?',
        question: 'Two trains P and Q of identical lengths cross a stationary pole in 5 seconds and 6 seconds respectively. If they are moving in the same direction on parallel tracks, how much time will the faster train take to completely overtake the slower train?',
        options: [
          'A) 30 seconds',
          'B) 45 seconds',
          'C) 60 seconds',
          'D) 90 seconds'
        ],
        correctAnswer: 'C',
        explanation: 'Let the length of each train be L. Speed of P = L/5, Speed of Q = L/6. Relative speed in the same direction = L/5 - L/6 = L/30. Total distance to overtake = L + L = 2L. Time taken = Total Distance / Relative Speed = 2L / (L/30) = 60 seconds.'
      },
      {
        id: 'apt-trains-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Difference in Distances Met] Two trains start from P and Q towards each other at 120 km/hr and 100 km/hr. When they meet, one train covered 40 km more. Distance between P and Q?',
        question: 'From stations P and Q, two trains start simultaneously moving towards each other at speeds of 120 km/hr and 100 km/hr respectively. When they meet, it is found that one train has covered exactly 40 km more than the other train. What is the total distance between P and Q?',
        options: [
          'A) 400 km',
          'B) 440 km',
          'C) 480 km',
          'D) 520 km'
        ],
        correctAnswer: 'B',
        explanation: 'Difference in speed = 120 - 100 = 20 km/hr. Since they start simultaneously, their travel time until meeting is the same. The extra 40 km was covered due to the 20 km/hr speed difference. Time taken = 40 km / 20 km/hr = 2 hours. Total distance = Sum of speeds × Time = (120 + 100) × 2 = 220 × 2 = 440 km.'
      },
      {
        id: 'apt-trains-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Trains Starting at Different Times] Two trains A and B leave Kolkata for Sikkim at 8:00 PM and 8:30 PM at 90 km/hr and 120 km/hr. At what distance from Kolkata will they meet?',
        question: 'Two trains A and B leave Kolkata for Sikkim at 8:00 PM and 8:30 PM respectively. They run at speeds of 90 km/hr and 120 km/hr. At what exact distance from Kolkata will the two trains meet?',
        options: [
          'A) 150 km',
          'B) 160 km',
          'C) 180 km',
          'D) 210 km'
        ],
        correctAnswer: 'C',
        explanation: 'Train A travels for 30 minutes (0.5 hr) before B starts, covering 90 × 0.5 = 45 km. Relative speed of B to catch A = 120 - 90 = 30 km/hr. Time taken for B to catch A = 45 / 30 = 1.5 hours. Distance from Kolkata = Speed of B × Time of B = 120 × 1.5 = 180 km.'
      },
      {
        id: 'apt-trains-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Stoppage Minutes per Hour] With stoppages, a train travels at 36 km/hr, and without stoppages at 40 km/hr. For how many minutes does it stop per hour?',
        question: 'With stoppages, the average speed of a train is 36 km/hr. Without stoppages, its average speed is 40 km/hr. For exactly how many minutes does the train stop per hour?',
        options: [
          'A) 5 minutes',
          'B) 6 minutes',
          'C) 8 minutes',
          'D) 10 minutes'
        ],
        correctAnswer: 'B',
        explanation: 'Difference in distance per hour = 40 - 36 = 4 km. This 4 km is lost due to stopping. At the ideal speed of 40 km/hr, the time taken to cover 4 km is (4 / 40) hours = 1/10 hours. Convert to minutes: (1/10) × 60 = 6 minutes. The train stops for 6 minutes per hour.'
      },
      {
        id: 'apt-trains-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q8: [Train Passing Two Bridges] A train passes two bridges of length 800m and 400m in 100 seconds and 60 seconds. Length of the train?',
        question: 'A train running at a uniform speed passes two bridges of lengths 800 m and 400 m in exactly 100 seconds and 60 seconds respectively. What is the length of the train?',
        options: [
          'A) 150 meters',
          'B) 200 meters',
          'C) 250 meters',
          'D) 300 meters'
        ],
        correctAnswer: 'B',
        explanation: 'Let train length be L. Speeds are equal: (L + 800) / 100 = (L + 400) / 60. Simplify denominator by dividing by 20: (L + 800) / 5 = (L + 400) / 3. Cross multiply: 3L + 2400 = 5L + 2000 => 2L = 400 => L = 200 meters.'
      },
      {
        id: 'apt-trains-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Speed of Train Crossing Running Man] A train 125m long passes a man running at 5 km/hr in the same direction in 10 seconds. What is the speed of the train?',
        question: 'A train 125 meters long completely passes a man running at 5 km/hr in the same direction in exactly 10 seconds. What is the speed of the train in km/hr?',
        options: [
          'A) 45 km/hr',
          'B) 50 km/hr',
          'C) 54 km/hr',
          'D) 60 km/hr'
        ],
        correctAnswer: 'B',
        explanation: 'Relative speed = Distance / Time = 125 m / 10 s = 12.5 m/s. Convert relative speed to km/hr: 12.5 × (18/5) = 45 km/hr. Since the man is running in the same direction, Relative Speed = Speed of Train - Speed of Man => 45 = S - 5 => S = 50 km/hr.'
      },
      {
        id: 'apt-trains-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q10: [Multiple Crossings and Platform Length] A train at 48 km/hr crosses an opposite train (half its length) at 42 km/hr in 12s. It passes a platform in 45s. Find platform length.',
        question: 'A train traveling at 48 km/hr crosses another train, having half its length and traveling in the opposite direction at 42 km/hr, in exactly 12 seconds. The first train also completely passes a railway platform in 45 seconds. What is the length of the platform?',
        options: [
          'A) 300 meters',
          'B) 400 meters',
          'C) 500 meters',
          'D) 600 meters'
        ],
        correctAnswer: 'B',
        explanation: '1) Relative speed = 48 + 42 = 90 km/hr = 90 × 5/18 = 25 m/s. 2) Distance covered = Length of Train 1 (L) + Length of Train 2 (L/2) = 1.5L. So, 1.5L = 25 × 12 = 300 m => L = 200 m. 3) Speed of first train = 48 km/hr = 48 × 5/18 = 40/3 m/s. 4) Distance covered passing platform in 45s = (40/3) × 45 = 600 m. Platform Length = Total Distance - Train Length = 600 - 200 = 400 meters.'
      },
      {
        id: 'apt-trains-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Catching Up with a Jogger] A jogger is 240m ahead of a 120m long train running at 45 km/hr. Jogger speed is 9 km/hr. Time to cross jogger?',
        question: 'A jogger is running at 9 km/hr alongside a railway track. He is currently 240 meters ahead of the engine of a 120-meter long train running in the same direction at 45 km/hr. In how many seconds will the train completely pass the jogger?',
        options: [
          'A) 24 seconds',
          'B) 30 seconds',
          'C) 36 seconds',
          'D) 40 seconds'
        ],
        correctAnswer: 'C',
        explanation: 'Relative speed = 45 - 9 = 36 km/hr = 36 × 5/18 = 10 m/s. Total distance the train must cover relative to the jogger = initial gap (240 m) + train length (120 m) = 360 m. Time = Distance / Relative Speed = 360 / 10 = 36 seconds.'
      },
      {
        id: 'apt-trains-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Meeting Time with Different Starts] Stations A and B are 110 km apart. Train 1 starts from A at 7 AM at 20 km/hr. Train 2 from B at 8 AM at 25 km/hr. Meeting time?',
        question: 'Two stations A and B are 110 km apart on a straight line. One train starts from A at 7:00 AM and travels towards B at 20 km/hr. Another train starts from B at 8:00 AM and travels towards A at a speed of 25 km/hr. At what exact time will they meet?',
        options: [
          'A) 9:30 AM',
          'B) 10:00 AM',
          'C) 10:30 AM',
          'D) 11:00 AM'
        ],
        correctAnswer: 'B',
        explanation: 'By 8:00 AM, the first train has traveled 1 hour × 20 km/hr = 20 km. Remaining distance between them = 110 - 20 = 90 km. At 8:00 AM, both trains are moving towards each other. Relative speed = 20 + 25 = 45 km/hr. Time to cover 90 km = 90 / 45 = 2 hours. Meeting time = 8:00 AM + 2 hours = 10:00 AM.'
      },
      {
        id: 'apt-trains-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [Crossing Poles and Each Other] Two trains of equal lengths running in opposite directions pass a pole in 18s and 12s. Time to cross each other?',
        question: 'Two trains of perfectly equal lengths are running on parallel tracks in opposite directions. They completely pass a stationary pole in 18 seconds and 12 seconds respectively. In how many seconds will they cross each other completely?',
        options: [
          'A) 14.4 seconds',
          'B) 15.0 seconds',
          'C) 15.5 seconds',
          'D) 16.2 seconds'
        ],
        correctAnswer: 'A',
        explanation: 'Let the length of each train be L. Speed of Train 1 = L/18. Speed of Train 2 = L/12. Since they move in opposite directions, Relative Speed = L/18 + L/12 = (2L + 3L)/36 = 5L/36. Total distance to cross each other = L + L = 2L. Time taken = 2L / (5L/36) = 72 / 5 = 14.4 seconds.'
      },
      {
        id: 'apt-trains-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Train Speed from Two Opposite Men] A train overtakes two persons walking in opposite direction at 5 m/s and 10 m/s in 6s and 5s. Speed of train?',
        question: 'A train completely passes two persons walking in the opposite direction to the train at speeds of 5 m/s and 10 m/s in exactly 6 seconds and 5 seconds respectively. What is the speed of the train in m/s?',
        options: [
          'A) 15 m/s',
          'B) 18 m/s',
          'C) 20 m/s',
          'D) 25 m/s'
        ],
        correctAnswer: 'C',
        explanation: 'Let train speed be S and train length be L. Since they walk in opposite direction, relative speeds are S+5 and S+10. L = (S + 5) × 6, and L = (S + 10) × 5. Equating lengths: 6S + 30 = 5S + 50 => S = 20 m/s.'
      },
      {
        id: 'apt-trains-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Cross-Timing Square Root Shortcut] Two trains cross each other. They take 4h and 9h to reach destination. Ratio of speeds?',
        question: 'Two trains start simultaneously from stations A and B towards each other. After crossing each other on the way, they take exactly 4 hours and 9 hours to reach stations B and A respectively. What is the ratio of their speeds?',
        options: [
          'A) 2 : 3',
          'B) 3 : 2',
          'C) 4 : 9',
          'D) 9 : 4'
        ],
        correctAnswer: 'B',
        explanation: 'If two bodies start simultaneously from opposite ends, cross, and then take times T1 and T2 to finish their journeys, the ratio of their speeds is S1/S2 = √(T2 / T1). So, S1/S2 = √(9 / 4) = 3 / 2. Ratio is 3 : 2.'
      },
      {
        id: 'apt-trains-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Intersection Time from Departure and Arrival] Train X from A 4 PM, to B 5 PM. Train Y from B 4 PM, to A 5:30 PM. Time they cross?',
        question: 'Train X starts from station A at 4:00 PM and reaches station B at 5:00 PM. Train Y starts from station B at 4:00 PM and reaches station A at 5:30 PM. At what exact time will the two trains cross each other?',
        options: [
          'A) 4:30 PM',
          'B) 4:36 PM',
          'C) 4:40 PM',
          'D) 4:45 PM'
        ],
        correctAnswer: 'B',
        explanation: 'Time taken by X = 1 hour. Time taken by Y = 1.5 hours (3/2 hours). Let distance AB = 3 km. Speed X = 3 / 1 = 3 km/hr. Speed Y = 3 / 1.5 = 2 km/hr. Relative speed = 3 + 2 = 5 km/hr. Time to meet = Distance / Relative Speed = 3 / 5 hours = (3/5) × 60 = 36 minutes. They meet at 4:00 PM + 36 mins = 4:36 PM.'
      },
      {
        id: 'apt-trains-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Passenger and Goods Train Ratio] Goods train and passenger train run same direction. Passenger overtakes completely in 60s. Passenger in train sees crossing goods in 40s. Ratio of lengths?',
        question: 'A goods train and a passenger train run on parallel tracks in the same direction. The driver of the goods train observes that the passenger train coming from behind overtakes his train completely in 60 seconds. A passenger inside the passenger train notices that he crosses the goods train completely in 40 seconds. What is the ratio of the length of the goods train to that of the passenger train?',
        options: [
          'A) 1 : 2',
          'B) 2 : 1',
          'C) 2 : 3',
          'D) 3 : 2'
        ],
        correctAnswer: 'B',
        explanation: 'Let lengths be L_p and L_g. Let relative speed be V. 1) The passenger train completely overtaking the goods train means total distance covered relative to each other is (L_p + L_g). So, L_p + L_g = 60 × V. 2) A passenger sitting inside the passenger train acts as a single point moving at V relative to the goods train. The distance to cross the goods train is just L_g. So, L_g = 40 × V. 3) Substituting L_g: L_p + 40V = 60V => L_p = 20V. 4) Ratio of Goods to Passenger lengths = L_g : L_p = 40V : 20V = 2 : 1.'
      },
      {
        id: 'apt-trains-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Finding Speed using Multiple Landmarks] A train passes a telegraph post in 8s and a 264m bridge in 20s. Speed of the train in km/hr?',
        question: 'A train moving at a constant speed completely passes a telegraph post in exactly 8 seconds, and a 264-meter long bridge in 20 seconds. What is the speed of the train in km/hr?',
        options: [
          'A) 72.0 km/hr',
          'B) 75.5 km/hr',
          'C) 79.2 km/hr',
          'D) 82.5 km/hr'
        ],
        correctAnswer: 'C',
        explanation: 'Let train length be L. Speed S = L/8. For the bridge, S = (L + 264)/20. Equating: L/8 = (L + 264)/20 => 20L = 8L + 2112 => 12L = 2112 => L = 176 m. Speed S = 176 / 8 = 22 m/s. Convert to km/hr: 22 × (18/5) = 396 / 5 = 79.2 km/hr.'
      },
      {
        id: 'apt-trains-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Time to Cross Opposite Trains] Two trains 140m and 160m long run at 60 km/hr and 40 km/hr in opposite directions. Time to cross?',
        question: 'Two trains, 140 meters and 160 meters long, run at speeds of 60 km/hr and 40 km/hr respectively in opposite directions on parallel tracks. In how many seconds will they completely cross each other?',
        options: [
          'A) 9.6 seconds',
          'B) 10.8 seconds',
          'C) 11.2 seconds',
          'D) 12.0 seconds'
        ],
        correctAnswer: 'B',
        explanation: 'Total distance = 140 + 160 = 300 meters. Relative speed = 60 + 40 = 100 km/hr. Convert to m/s: 100 × 5/18 = 500/18 = 250/9 m/s. Time = Distance / Speed = 300 / (250/9) = 2700 / 250 = 10.8 seconds.'
      },
      {
        id: 'apt-trains-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Passing Moving Person in Train] Two trains travel same direction at 50 km/hr and 30 km/hr. Faster completely passes a man in slower in 18s. Length of faster train?',
        question: 'Two trains are traveling in the exact same direction at speeds of 50 km/hr and 30 km/hr respectively. The faster train completely passes a man sitting in the slower train in exactly 18 seconds. What is the length of the faster train?',
        options: [
          'A) 80 meters',
          'B) 100 meters',
          'C) 120 meters',
          'D) 150 meters'
        ],
        correctAnswer: 'B',
        explanation: 'The man sitting in the slower train behaves as a point object moving at 30 km/hr. The relative speed of the faster train to the man is 50 - 30 = 20 km/hr. Convert to m/s: 20 × (5/18) = 100/18 = 50/9 m/s. The distance covered to pass the man is exactly the length of the faster train. Length = Speed × Time = (50/9) × 18 = 100 meters.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 20: PROBLEMS ON NUMBERS (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 20,
    slug: 'aptitude-quant-problems-on-numbers',
    title: 'Problems on Numbers',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 32,
    video_url: 'http://www.youtube.com/watch?v=vsBpWgNYjtQ',
    video_title: 'Problems on Numbers - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Solve equations involving digit reversals (two/three-digit numbers), consecutive integer math, reciprocal sums, and heads-and-legs puzzles.',
    summary_markdown: `### 📌 1. Place Value Representation of Digits
* **Two-Digit Numbers:** Always represent a two-digit number as **\`10x + y\`** (where \`x\` is the tens digit and \`y\` is the units digit).
  * Number obtained by **reversing** the digits: **\`10y + x\`**.
  * Difference between original and reversed: \`(10x + y) - (10y + x) = 9(x - y)\`. Always a multiple of **9**.
  * Sum of original and reversed: \`(10x + y) + (10y + x) = 11(x + y)\`. Always a multiple of **11**.
* **Three-Digit Numbers:** Represent as **\`100h + 10t + u\`**.

### 💡 2. Common Number Problem Archetypes
* **Sum of Reciprocals:** If the sum of two numbers is \`S\` and their product is \`P\`, the sum of their reciprocals \`1/x + 1/y = (x+y)/(xy) = S / P\`.
* **Heads and Legs Problems (e.g., Hens and Pigs):**
  * Let \`x\` be 2-legged animals and \`y\` be 4-legged animals.
  * \`x + y = Total Heads\`
  * \`2x + 4y = Total Legs\`
* **Consecutive Integers:**
  * Consecutive integers: \`x, x+1, x+2...\`
  * Consecutive even/odd integers: \`x, x+2, x+4...\`
  * Average of an odd number of consecutive integers is always the **exact middle integer**.
* **Mistaken Operations:** If a student was supposed to multiply by \`X\` but divided by \`X\` (which is multiplying by \`1/X\`), the error equation is \`X*m - m/X = Difference\`.`,
    questions: [
      {
        id: 'apt-num-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Sum of Reciprocals] The sum of two numbers is 36 and their product is 248. What will be the sum of their reciprocals?',
        question: 'The sum of two positive numbers is exactly 36 and their product is exactly 248. What is the exact sum of their reciprocals?',
        options: [
          'A) 7 / 62',
          'B) 9 / 62',
          'C) 11 / 62',
          'D) 13 / 62'
        ],
        correctAnswer: 'B',
        explanation: 'Let the numbers be a and b. We want 1/a + 1/b. Finding a common denominator yields (a + b) / (ab). We are given a + b = 36 and ab = 248. Thus, the sum of reciprocals is 36 / 248. Dividing numerator and denominator by 4 gives 9 / 62.'
      },
      {
        id: 'apt-num-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Heads and Legs] In a poultry farm having hens and pigs, Rohan can see 84 heads and 282 legs. How many hens are there?',
        question: 'In a poultry farm consisting exclusively of hens and pigs, Rohan counts a total of 84 heads and 282 legs. How many hens are there in the farm?',
        options: [
          'A) 25',
          'B) 27',
          'C) 30',
          'D) 57'
        ],
        correctAnswer: 'B',
        explanation: 'Let H = number of hens, P = number of pigs. Heads equation: H + P = 84. Legs equation: 2H + 4P = 282 (since hens have 2 legs and pigs have 4). Divide legs equation by 2: H + 2P = 141. Subtract heads equation from this: (H + 2P) - (H + P) = 141 - 84 => P = 57. Thus, there are 57 pigs. Hens H = 84 - 57 = 27 hens.'
      },
      {
        id: 'apt-num-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q3: [Consecutive Numbers Sum] The sum of five consecutive numbers is 335. If we add the largest and smallest numbers, what will we get?',
        question: 'The sum of five consecutive integers is exactly 335. What is the sum of the largest and the smallest integers in this sequence?',
        options: [
          'A) 132',
          'B) 134',
          'C) 136',
          'D) 138'
        ],
        correctAnswer: 'B',
        explanation: 'The average of an odd number of consecutive integers is always the middle term! Middle term = 335 / 5 = 67. The sequence is 65, 66, 67, 68, 69. Largest + Smallest = 65 + 69 = 134. (Shortcut: Sum of extremes = 2 × Middle term = 2 × 67 = 134).'
      },
      {
        id: 'apt-num-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q4: [Mistaken Operation Equation] Instead of multiplying m by 3/4, Raj divided by 3/4. Difference is 14. What is m?',
        question: 'Raj was supposed to multiply a number m by 3/4. Instead, he mistakenly divided m by 3/4. If this error led to a difference of 14 between his incorrect answer and the correct answer, what is the value of m?',
        options: [
          'A) 18',
          'B) 21',
          'C) 24',
          'D) 28'
        ],
        correctAnswer: 'C',
        explanation: 'Incorrect result = m ÷ (3/4) = 4m/3. Correct result = 3m/4. Difference = 4m/3 - 3m/4 = (16m - 9m) / 12 = 7m / 12. We are given 7m / 12 = 14 => 7m = 168 => m = 24.'
      },
      {
        id: 'apt-num-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Three-Digit Number Position Shift] The digit in the units place is 2x 100s, 10s place is 3x 100s. Exchanging unit and tens makes difference 27. 75% of original?',
        question: 'A 3-digit number has its units digit exactly 2 times the hundreds digit, and its tens digit exactly 3 times the hundreds digit. If the units and tens digits are exchanged, the absolute difference between the original number and the new number is 27. What is exactly 75% of the original number?',
        options: [
          'A) 279',
          'B) 285',
          'C) 297',
          'D) 315'
        ],
        correctAnswer: 'C',
        explanation: 'Let the hundreds digit be h. Tens digit t = 3h. Units digit u = 2h. Original number A = 100h + 10t + u. New number B (exchanging tens and units) = 100h + 10u + t. Difference = |A - B| = |9t - 9u| = 27 => |t - u| = 3. Substitute t = 3h and u = 2h: |3h - 2h| = 3 => h = 3. Therefore, h = 3, t = 9, u = 6. Original number = 396. Finally, 75% of 396 = (3/4) × 396 = 3 × 99 = 297.'
      },
      {
        id: 'apt-num-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q6: [Percentages Cascading into Family Count] 100% cascade: 2% have 5, 8% have 0. Rest: 18% have 4, 27% have 1. Rest: 297 have 2 or 3. Total families?',
        question: 'In a neighborhood, 2% of families have 5 children and 8% have no children. Among the REST of the families, 18% have 4 children and 27% have 1 child. If exactly 297 families have either 2 or 3 children, what is the total number of families in the neighborhood?',
        options: [
          'A) 500',
          'B) 600',
          'C) 750',
          'D) 800'
        ],
        correctAnswer: 'B',
        explanation: 'Let Total Families = 100x. 10% have 0 or 5 children (2% + 8%). The REST = 90x. Among this rest (90x), 18% + 27% = 45% have 1 or 4 children. The remaining 55% of the rest must have 2 or 3 children! Number of families with 2 or 3 children = 55% of 90x = 0.55 × 90x = 49.5x. We are given 49.5x = 297 => x = 297 / 49.5 = 6. Total families = 100x = 600.'
      },
      {
        id: 'apt-num-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Fraction of Tank Capacity] 3/4 part of a tank is full of water. When 30 liters is taken out, it becomes empty. Capacity of tank?',
        question: 'Exactly 3/4 part of a tank is currently full of water. When exactly 30 liters of water is taken out, the tank becomes completely empty. What is the total capacity of the tank?',
        options: [
          'A) 36 liters',
          'B) 40 liters',
          'C) 45 liters',
          'D) 50 liters'
        ],
        correctAnswer: 'B',
        explanation: 'If removing 30 liters makes the tank entirely empty, the current volume of water must be exactly 30 liters. We are told the tank is 3/4 full. So, (3/4) × Capacity = 30 => Capacity = 30 × 4 / 3 = 40 liters.'
      },
      {
        id: 'apt-num-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Quadratic Generation from Group Contribution] Each member contributes twice member count. Gov contributes same as member count. Diff scenario, total 210 less. Members?',
        question: 'A group wants to renovate. Each member contributes an amount equal to twice the total number of members. The government contributes an amount equal to the number of members. Had each member contributed an amount equal to the number of members, and the government contributed twice the number of members, the total collected would be exactly ₹210 less. How many members are in the group?',
        options: [
          'A) 12',
          'B) 14',
          'C) 15',
          'D) 18'
        ],
        correctAnswer: 'C',
        explanation: 'Let number of members = m. Scenario 1 total = m(2m) + m = 2m^2 + m. Scenario 2 total = m(m) + 2m = m^2 + 2m. Given: Scenario 1 - Scenario 2 = 210. (2m^2 + m) - (m^2 + 2m) = 210 => m^2 - m - 210 = 0. Factoring: (m - 15)(m + 14) = 0. Since m must be positive, m = 15.'
      },
      {
        id: 'apt-num-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Two Digit Number Reversal Difference] Two digit number A formed by reversing digits of B is 45 less than A. Sum of digits of B is 9. Find A.',
        question: 'A two-digit number A is formed by reversing the digits of another two-digit number B. If B is exactly 45 less than A, and the sum of the digits of B is 9, what is the number A?',
        options: [
          'A) 63',
          'B) 72',
          'C) 81',
          'D) 54'
        ],
        correctAnswer: 'B',
        explanation: 'Let B = 10t + u. Then A = 10u + t. We are given A - B = 45 => (10u + t) - (10t + u) = 45 => 9u - 9t = 45 => u - t = 5. We also know the sum of the digits t + u = 9. Adding both equations gives 2u = 14 => u = 7. Thus t = 2. So B = 27 and A = 72.'
      },
      {
        id: 'apt-num-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Distributing Items into Fixed Groups] 280 oranges divided among 50 boys and girls. Boy gets 5, girl gets 7. Number of girls?',
        question: 'Exactly 280 oranges are completely divided among a group of 50 boys and girls. If each boy receives exactly 5 oranges and each girl receives exactly 7 oranges, how many girls are there in the group?',
        options: [
          'A) 15',
          'B) 20',
          'C) 25',
          'D) 35'
        ],
        correctAnswer: 'A',
        explanation: 'Let Boys = B and Girls = G. B + G = 50. Oranges equation: 5B + 7G = 280. Substitute B = 50 - G: 5(50 - G) + 7G = 280 => 250 - 5G + 7G = 280 => 2G = 30 => G = 15. There are 15 girls (and 35 boys).'
      },
      {
        id: 'apt-num-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Sum of Squares of Consecutive Evens] The sum of the squares of two consecutive even integers is 340. Find the integers.',
        question: 'The sum of the squares of two consecutive positive even integers is exactly 340. What are the two integers?',
        options: [
          'A) 10 and 12',
          'B) 12 and 14',
          'C) 14 and 16',
          'D) 16 and 18'
        ],
        correctAnswer: 'B',
        explanation: 'Let the integers be x and x+2. x^2 + (x+2)^2 = 340 => 2x^2 + 4x + 4 = 340 => 2x^2 + 4x - 336 = 0 => x^2 + 2x - 168 = 0. Factoring gives (x+14)(x-12) = 0. Since they are positive, x = 12. The integers are 12 and 14. (Check: 144 + 196 = 340).'
      },
      {
        id: 'apt-num-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q12: [Difference of Digits from Number Reversal] Difference between a two digit number and the number obtained by interchanging the digits is 63. What is the difference between the digits?',
        question: 'The absolute difference between a two-digit number and the number obtained by interchanging its digits is exactly 63. What is the absolute difference between the two digits of the original number?',
        options: [
          'A) 6',
          'B) 7',
          'C) 8',
          'D) 9'
        ],
        correctAnswer: 'B',
        explanation: 'Let the number be 10x + y. The reversed number is 10y + x. Difference = |(10x + y) - (10y + x)| = |9x - 9y| = 9|x - y|. We are given 9|x - y| = 63 => |x - y| = 63 / 9 = 7.'
      },
      {
        id: 'apt-num-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Sum of Consecutive Multiples] Sum of three consecutive multiples of 3 is 72. Largest number?',
        question: 'The sum of three consecutive multiples of 3 is exactly 72. What is the value of the largest number among them?',
        options: [
          'A) 24',
          'B) 27',
          'C) 30',
          'D) 33'
        ],
        correctAnswer: 'B',
        explanation: 'Let the three consecutive multiples of 3 be (x - 3), x, and (x + 3). Sum = 3x = 72 => x = 24. The numbers are 21, 24, and 27. The largest number is 27.'
      },
      {
        id: 'apt-num-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Fractional Algebraic Equation] A number whose fifth part increased by 4 is equal to its fourth part diminished by 10. Number?',
        question: 'Find the number whose exactly one-fifth part increased by 4 is mathematically equal to its one-fourth part diminished by 10.',
        options: [
          'A) 240',
          'B) 260',
          'C) 280',
          'D) 300'
        ],
        correctAnswer: 'C',
        explanation: 'Let the number be x. x/5 + 4 = x/4 - 10. Rearrange to group x: 14 = x/4 - x/5. Find common denominator: 14 = (5x - 4x) / 20 => 14 = x / 20 => x = 14 × 20 = 280.'
      },
      {
        id: 'apt-num-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q15: [Basic Word Equation] If a number is multiplied by 22 and the same number is added to it, we get half of 46. Number?',
        question: 'If a certain number is multiplied by 22 and the exact same number is added to the result, we get exactly half of 46. What is the number?',
        options: [
          'A) 1',
          'B) 2',
          'C) 3',
          'D) 4'
        ],
        correctAnswer: 'A',
        explanation: 'Let the number be x. Multiply by 22: 22x. Add the same number: 22x + x = 23x. We are given this equals half of 46, which is 23. Thus, 23x = 23 => x = 1.'
      },
      {
        id: 'apt-num-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Percentage vs Fraction of a Number] Difference between 4/5 of a number and 45% of the number is 56. Number?',
        question: 'The absolute difference between exactly 4/5 of a number and 45% of the same number is 56. What is the number?',
        options: [
          'A) 120',
          'B) 140',
          'C) 160',
          'D) 180'
        ],
        correctAnswer: 'C',
        explanation: 'Convert 4/5 into percentage: 4/5 = 80%. The equation is 80% of x - 45% of x = 56 => 35% of x = 56 => 0.35x = 56 => x = 56 / 0.35 = 5600 / 35 = 160.'
      },
      {
        id: 'apt-num-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Moderate',
        title: 'Q17: [Sum and Difference of Digits] Sum of digits of a two-digit number is 15. Difference between the digits is 3. What is the product of the digits?',
        question: 'The sum of the two digits of a two-digit number is exactly 15. The absolute difference between the two digits is exactly 3. What is the product of the two digits?',
        options: [
          'A) 54',
          'B) 56',
          'C) 63',
          'D) 72'
        ],
        correctAnswer: 'A',
        explanation: 'Let the digits be x and y. x + y = 15, and |x - y| = 3. Adding gives 2x = 18 => x = 9. Subtracting gives 2y = 12 => y = 6. The product of the digits is 9 × 6 = 54.'
      },
      {
        id: 'apt-num-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Multiplying Error] A boy was asked to multiply a number by 25. He multiplied by 52 and got 324 more than correct answer. Number?',
        question: 'A boy was instructed to multiply a certain number by 25. Due to carelessness, he multiplied it by 52 instead and obtained an answer that was exactly 324 more than the correct answer. What was the number?',
        options: [
          'A) 12',
          'B) 14',
          'C) 15',
          'D) 18'
        ],
        correctAnswer: 'A',
        explanation: 'Let the number be x. Incorrect answer = 52x. Correct answer = 25x. The difference is 52x - 25x = 27x. We are given 27x = 324 => x = 324 / 27 = 12.'
      },
      {
        id: 'apt-num-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Sum of Squares from Ratio] Three numbers are in ratio 3:4:5. Sum of their squares is 1250. Sum of the numbers?',
        question: 'Three positive numbers are strictly in the ratio 3 : 4 : 5. If the sum of their squares is exactly 1,250, what is the exact sum of the three numbers?',
        options: [
          'A) 40',
          'B) 50',
          'C) 60',
          'D) 80'
        ],
        correctAnswer: 'C',
        explanation: 'Let numbers be 3k, 4k, 5k. Sum of squares = (3k)^2 + (4k)^2 + (5k)^2 = 9k^2 + 16k^2 + 25k^2 = 50k^2. We know 50k^2 = 1250 => k^2 = 25 => k = 5. Sum of numbers = 3k + 4k + 5k = 12k = 12 × 5 = 60.'
      },
      {
        id: 'apt-num-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Fraction Value Shift] If 1 is added to numerator and denominator, fraction becomes 1/2. If 1 is subtracted, fraction becomes 1/3. Fraction?',
        question: 'If exactly 1 is added to both the numerator and the denominator of a fraction, its value becomes 1/2. If exactly 1 is subtracted from both the numerator and denominator of the original fraction, its value becomes 1/3. What is the original fraction?',
        options: [
          'A) 2/5',
          'B) 3/7',
          'C) 4/9',
          'D) 5/11'
        ],
        correctAnswer: 'B',
        explanation: 'Let fraction be x/y. 1) (x+1)/(y+1) = 1/2 => 2x + 2 = y + 1 => 2x - y = -1. 2) (x-1)/(y-1) = 1/3 => 3x - 3 = y - 1 => 3x - y = 2. Subtracting the first equation from the second: (3x - y) - (2x - y) = 2 - (-1) => x = 3. Substituting into first: 2(3) - y = -1 => 6 - y = -1 => y = 7. Fraction is 3/7.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 21: PROBLEMS ON AGES (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 21,
    slug: 'aptitude-quant-problems-on-ages',
    title: 'Problems on Ages',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 27,
    video_url: 'http://www.youtube.com/watch?v=tJHl73PBnwY',
    video_title: 'Problems on Ages - Shortcuts & Tricks for Placement Tests, Job Interviews & Exams',
    short_description: 'Master chronological age shifts, ratio-based age equations, and calculating average family ages during births and member replacements.',
    summary_markdown: `### 📌 1. Translation to Algebraic Equations
* Let present ages be denoted by variables \`x\`, \`y\`, \`z\`.
* Age \`N\` years **ago** $\\rightarrow$ \`x - N\`
* Age \`N\` years **from now (hence)** $\\rightarrow$ \`x + N\`
* Always construct equations strictly matching the timeline (e.g., if ratio 5 years ago was 2:3, the equation is \`(x-5)/(y-5) = 2/3\`).

### 💡 2. High-Yield Ratios and Shortcuts
* **Constant Age Difference:** The absolute difference in age between two people ALWAYS remains the same regardless of past or future! If A is 5 years older than B today, A will be 5 years older than B in 100 years.
* **The Average Age Trick:**
  * If the average age of \`N\` people today is \`A\`, their total age is \`N × A\`.
  * After \`k\` years, the new total age will be \`N × A + N × k\` (because EVERY person grows by \`k\` years!). The new average simply becomes \`A + k\`.
  * \`k\` years ago, the average was \`A - k\`.
* **Middle Person Reference:** If A is as much younger than B as he is older than C, then A sits exactly in the middle of their ages. Thus, \`A's age = (B's age + C's age) / 2\`.

### 💡 3. Family Birth and Replacement Scenarios
* **Average at Birth:** If the average age of a family of 4 is 36 today, and the youngest child is 6, the sum of their ages *at the time of birth* (6 years ago) requires subtracting \`6 × 4 = 24\` from the current sum. However, the number of family members *at the time of birth* is considered **3** (since the child is 0). The new average is \`(Sum - 24) / 3\`.`,
    questions: [
      {
        id: 'apt-age-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Past and Present Ratios] Ram is 3 times as old as Sam. 2 years ago, he was 5 times as old as Sam. Present age of Ram?',
        question: 'Ram is currently 3 times as old as Sam. Exactly 2 years ago, Ram was 5 times as old as Sam. What is the present age of Ram?',
        options: [
          'A) 12 years',
          'B) 15 years',
          'C) 18 years',
          'D) 24 years'
        ],
        correctAnswer: 'A',
        explanation: 'Let Sam\'s present age = S. Ram\'s present age R = 3S. Two years ago, R - 2 = 5(S - 2). Substitute R = 3S: 3S - 2 = 5S - 10 => 2S = 8 => S = 4. Ram\'s present age = 3 × 4 = 12 years.'
      },
      {
        id: 'apt-age-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q2: [Past and Future Ratios Linked] 12 years ago, P was 3 times Q. After 12 years, ratio of Q to P will be 2:3. Present age of P?',
        question: 'Exactly 12 years ago, P was 3 times as old as Q. Exactly 12 years from now, the ratio of Q\'s age to P\'s age will be 2 : 3. What is the present age of P?',
        options: [
          'A) 36 years',
          'B) 48 years',
          'C) 54 years',
          'D) 60 years'
        ],
        correctAnswer: 'A',
        explanation: 'Let present ages be P and Q. 12 years ago: (P - 12) = 3(Q - 12) => P = 3Q - 36 + 12 => P = 3Q - 24. 12 years from now: (Q + 12) / (P + 12) = 2 / 3. Cross multiply: 3Q + 36 = 2P + 24. Substitute P: 3Q + 36 = 2(3Q - 24) + 24 => 3Q + 36 = 6Q - 48 + 24 => 3Q + 36 = 6Q - 24 => 3Q = 60 => Q = 20. Present age of P = 3(20) - 24 = 36.'
      },
      {
        id: 'apt-age-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Average Middle Age Reference] Rohan is as much younger than Ajay as he is older than Meena. Sum of ages of Ajay and Meena is 108. Rohan\'s age?',
        question: 'Rohan is as much younger than Ajay as he is older than Meena. If the sum of the ages of Ajay and Meena is exactly 108 years, how old is Rohan?',
        options: [
          'A) 50 years',
          'B) 54 years',
          'C) 58 years',
          'D) Cannot be determined'
        ],
        correctAnswer: 'B',
        explanation: 'Since Rohan is perfectly in the middle, the age difference is the same: Ajay - Rohan = Rohan - Meena. Rearranging gives: 2 × Rohan = Ajay + Meena. We are given Ajay + Meena = 108. So, 2 × Rohan = 108 => Rohan = 54 years.'
      },
      {
        id: 'apt-age-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Three Variable Ratios] Rohan\'s age is 5 times Ajay\'s and 7/18 of Meena\'s. Sum of all three is 132. How much younger is Ajay than Meena?',
        question: 'Rohan\'s age is exactly 5 times Ajay\'s age, and simultaneously 7/18 of Meena\'s age. The sum of the ages of all three of them is 132 years. How much younger is Ajay than Meena?',
        options: [
          'A) 75 years',
          'B) 80 years',
          'C) 83 years',
          'D) 85 years'
        ],
        correctAnswer: 'C',
        explanation: 'Let Ajay\'s age = A. Rohan\'s age R = 5A. We know R = (7/18) × Meena\'s age (M) => M = (18/7) × R = (18/7) × 5A = 90A/7. Sum: A + 5A + 90A/7 = 132 => 6A + 90A/7 = 132. Multiply by 7: 42A + 90A = 924 => 132A = 924 => A = 7. Thus, Ajay = 7, Rohan = 35, Meena = (90×7)/7 = 90. Difference between Meena and Ajay = 90 - 7 = 83 years.'
      },
      {
        id: 'apt-age-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Overlapping Average Age Deductions] Average age of Ram and Shyam is 65. Average age of Ram, Shyam, John is 53. John\'s age?',
        question: 'The average age of Ram and Shyam is 65 years. The average age of Ram, Shyam, and John together is 53 years. What is the exact age of John?',
        options: [
          'A) 27 years',
          'B) 29 years',
          'C) 31 years',
          'D) 33 years'
        ],
        correctAnswer: 'B',
        explanation: 'Sum of Ram and Shyam = 2 × 65 = 130. Sum of Ram, Shyam, and John = 3 × 53 = 159. John\'s age is the difference in the sums = 159 - 130 = 29 years.'
      },
      {
        id: 'apt-age-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Group Averages Subtracting Sets] Average age of 10 students and teacher is 15. First 7 students is 15. Last 3 is 11. Teacher\'s age?',
        question: 'The average age of 10 students and their teacher is exactly 15 years. The average age of the first 7 students is 15 years, and that of the remaining 3 students is exactly 11 years. What is the teacher\'s age?',
        options: [
          'A) 25 years',
          'B) 27 years',
          'C) 30 years',
          'D) 32 years'
        ],
        correctAnswer: 'B',
        explanation: 'Total age of 11 people (10 students + 1 teacher) = 11 × 15 = 165. Total age of first 7 students = 7 × 15 = 105. Total age of remaining 3 students = 3 × 11 = 33. Total age of 10 students = 105 + 33 = 138. Teacher\'s age = 165 - 138 = 27 years.'
      },
      {
        id: 'apt-age-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Average Age at Time of Birth] Average age of 4 friends is 36. Youngest is 6. Average age at the time of birth of youngest?',
        question: 'The present average age of a group of 4 friends is 36 years. The youngest friend among them is exactly 6 years old. What was the average age of the group exactly at the time of the birth of the youngest friend?',
        options: [
          'A) 30 years',
          'B) 35 years',
          'C) 40 years',
          'D) 45 years'
        ],
        correctAnswer: 'C',
        explanation: 'Total present age of 4 friends = 4 × 36 = 144 years. Exactly 6 years ago, each of the 4 friends was 6 years younger, so the total age decreases by 4 × 6 = 24 years. Total age 6 years ago = 144 - 24 = 120 years. At the exact time of birth, the youngest friend was 0 years old, meaning only the remaining 3 friends contribute to the meaningful average. The average of the remaining 3 friends = 120 / 3 = 40 years.'
      },
      {
        id: 'apt-age-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Age Constant Average with New Birth] Average age of family of 4 was 19 years 4 years back. Birth of child kept average same today. Child\'s age?',
        question: 'The average age of a family of 4 members was 19 years exactly 4 years back. A new child was born in the meantime, which magically kept the average age of the family exactly the same today. How old is the child today?',
        options: [
          'A) 2 years',
          'B) 3 years',
          'C) 4 years',
          'D) 5 years'
        ],
        correctAnswer: 'B',
        explanation: 'Total age of the 4 members 4 years ago = 4 × 19 = 76. Today, those 4 members have all aged 4 years, adding 4 × 4 = 16 years. Sum of the 4 original members today = 76 + 16 = 92. Today, the family has 5 members and their average is still 19! Total age today = 5 × 19 = 95. Therefore, the child\'s age is 95 - 92 = 3 years.'
      },
      {
        id: 'apt-age-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Future Ratio Shift] Ratio of ages of A and B is 3:5. 10 years hence, ratio will be 5:7. Present age of B?',
        question: 'The present ages of A and B are in the ratio 3 : 5. Exactly 10 years from now, the ratio of their ages will become 5 : 7. What is the present age of B?',
        options: [
          'A) 20 years',
          'B) 25 years',
          'C) 30 years',
          'D) 35 years'
        ],
        correctAnswer: 'B',
        explanation: 'Let present ages be 3x and 5x. After 10 years, ages are (3x + 10) and (5x + 10). Ratio is (3x + 10) / (5x + 10) = 5 / 7. Cross multiply: 7(3x + 10) = 5(5x + 10) => 21x + 70 = 25x + 50 => 4x = 20 => x = 5. Present age of B = 5x = 5(5) = 25 years.'
      },
      {
        id: 'apt-age-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Three Variable Algebraic Age Relation] A is 2 years older than B who is twice as old as C. If total of ages of A, B and C is 27, how old is B?',
        question: 'A is exactly 2 years older than B, and B is exactly twice as old as C. If the total sum of the present ages of A, B, and C is 27 years, how old is B?',
        options: [
          'A) 8 years',
          'B) 10 years',
          'C) 12 years',
          'D) 14 years'
        ],
        correctAnswer: 'B',
        explanation: 'Let C\'s age be x. Then B\'s age is 2x. A\'s age is 2x + 2. Summing them up: (2x + 2) + 2x + x = 27 => 5x + 2 = 27 => 5x = 25 => x = 5. Thus, B\'s age = 2x = 10 years.'
      },
      {
        id: 'apt-age-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q11: [Past Relationship to Present Ratio] Ten years ago, A was half of B in age. If ratio of their present ages is 3:4, total of present ages?',
        question: 'Ten years ago, A was exactly half of B in age. If the ratio of their present ages is exactly 3 : 4, what is the total sum of their present ages?',
        options: [
          'A) 35 years',
          'B) 40 years',
          'C) 45 years',
          'D) 50 years'
        ],
        correctAnswer: 'A',
        explanation: 'Let present ages be 3x and 4x. Ten years ago, their ages were (3x - 10) and (4x - 10). We are given (3x - 10) = (1/2)(4x - 10) => 6x - 20 = 4x - 10 => 2x = 10 => x = 5. Present ages are 15 and 20. Total = 15 + 20 = 35 years.'
      },
      {
        id: 'apt-age-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Quadratic Generation from Product] Sum of ages of a father and his son is 45 years. 5 years ago, product of their ages was 34. Father\'s age?',
        question: 'The sum of the present ages of a father and his son is exactly 45 years. Exactly 5 years ago, the product of their ages was exactly 34. What is the present age of the father?',
        options: [
          'A) 37 years',
          'B) 39 years',
          'C) 41 years',
          'D) 43 years'
        ],
        correctAnswer: 'B',
        explanation: 'Let father = F and son = S. F + S = 45. Five years ago: (F - 5)(S - 5) = 34. Substitute S = 45 - F into the product: (F - 5)(45 - F - 5) = 34 => (F - 5)(40 - F) = 34 => 40F - F^2 - 200 + 5F = 34 => F^2 - 45F + 234 = 0. Factoring: (F - 39)(F - 6) = 0. Since the father must be older, F = 39 (and S = 6).'
      },
      {
        id: 'apt-age-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Past Ratio to Future Ratio] 6 years ago, ratio of ages of Kunal and Sagar was 6:5. 4 years hence, ratio will be 11:10. Sagar\'s present age?',
        question: 'Exactly 6 years ago, the ratio of the ages of Kunal and Sagar was 6 : 5. Exactly 4 years from now, the ratio of their ages will be 11 : 10. What is Sagar\'s present age?',
        options: [
          'A) 16 years',
          'B) 18 years',
          'C) 20 years',
          'D) 22 years'
        ],
        correctAnswer: 'A',
        explanation: 'Let ages 6 years ago be 6x and 5x. Present ages are (6x + 6) and (5x + 6). 4 years from now, ages will be (6x + 10) and (5x + 10). Ratio is (6x + 10) / (5x + 10) = 11 / 10. Cross multiply: 60x + 100 = 55x + 110 => 5x = 10 => x = 2. Sagar\'s present age = 5x + 6 = 10 + 6 = 16 years.'
      },
      {
        id: 'apt-age-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Ratio and Product Combination] Ratio of father to son is 7:3. Product of their ages is 756. Ratio after 6 years?',
        question: 'The present ratio of a father\'s age to his son\'s age is 7 : 3. The product of their present ages is exactly 756. What will be the ratio of their ages exactly 6 years from now?',
        options: [
          'A) 5 : 2',
          'B) 2 : 1',
          'C) 3 : 1',
          'D) 5 : 3'
        ],
        correctAnswer: 'B',
        explanation: 'Let ages be 7x and 3x. Product = (7x)(3x) = 21x^2 = 756 => x^2 = 36 => x = 6. Present ages: Father = 42, Son = 18. After 6 years, Father = 48, Son = 24. Ratio = 48 : 24 = 2 : 1.'
      },
      {
        id: 'apt-age-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q15: [Three Person Chain Referencing] Sneha\'s age is 1/6th of her father\'s age. Father\'s age will be twice Vimal\'s age after 10 years. If Vimal\'s 8th birthday was 2 years ago, Sneha\'s age?',
        question: 'Sneha\'s age is exactly 1/6th of her father\'s age. Her father\'s age will be exactly twice Vimal\'s age after 10 years. If Vimal celebrated his 8th birthday exactly 2 years ago, what is Sneha\'s present age?',
        options: [
          'A) 4 years',
          'B) 5 years',
          'C) 6 years',
          'D) 8 years'
        ],
        correctAnswer: 'B',
        explanation: '1) Vimal was 8 years old 2 years ago, so Vimal\'s present age is 10. 2) After 10 years, Vimal will be 20. 3) Father\'s age after 10 years will be twice Vimal\'s = 2 × 20 = 40. 4) Therefore, Father\'s present age is 40 - 10 = 30. 5) Sneha\'s present age is 1/6 of her father\'s = 30 / 6 = 5 years.'
      },
      {
        id: 'apt-age-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q16: [Percentage Based Timelines] A man\'s age is 125% of what it was 10 years ago, but 83 1/3% of what it will be after 10 years. His present age?',
        question: 'A man\'s present age is exactly 125% of what it was 10 years ago, and exactly 83 1/3% of what it will be 10 years from now. What is his present age?',
        options: [
          'A) 40 years',
          'B) 45 years',
          'C) 50 years',
          'D) 60 years'
        ],
        correctAnswer: 'C',
        explanation: 'Let present age be M. Equation 1: M = 1.25(M - 10) => M = 1.25M - 12.5 => 0.25M = 12.5 => M = 50. Let\'s verify Equation 2: 83 1/3% = 5/6. M = (5/6)(M + 10) => 6M = 5M + 50 => M = 50. Both equations perfectly yield 50 years.'
      },
      {
        id: 'apt-age-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Class Average Replacements] Average age of a class of 30 students is 15 years. A student aged 20 leaves, and two new students with age difference 5 join. Average age remains 15. Age of younger new student?',
        question: 'The average age of a class of 30 students is 15 years. A 20-year-old student leaves the class, and two new students join, whose absolute age difference is 5 years. If the average age of the class remains 15 years even after this swap, what is the age of the younger new student?',
        options: [
          'A) 12 years',
          'B) 15 years',
          'C) 17 years',
          'D) 20 years'
        ],
        correctAnswer: 'B',
        explanation: 'Original total age = 30 × 15 = 450. When 1 student leaves and 2 join, the new class size is 31. The new average is 15, so new total age = 31 × 15 = 465. Let the ages of the two new students be x and x+5. 450 - 20 (leaving student) + x + x + 5 = 465 => 435 + 2x = 465 => 2x = 30 => x = 15. The younger student is 15 years old.'
      },
      {
        id: 'apt-age-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Sum Constraint on Ratios] The present ages of three persons are in proportions 4:7:9. Eight years ago, sum of their ages was 56. Present ages?',
        question: 'The present ages of three persons are strictly in the proportion 4 : 7 : 9. Exactly eight years ago, the total sum of their ages was exactly 56. What are their present ages?',
        options: [
          'A) 12, 21, 27',
          'B) 16, 28, 36',
          'C) 20, 35, 45',
          'D) 24, 42, 54'
        ],
        correctAnswer: 'B',
        explanation: 'Let present ages be 4x, 7x, and 9x. Eight years ago, their ages were (4x-8), (7x-8), and (9x-8). Sum: 4x-8 + 7x-8 + 9x-8 = 56 => 20x - 24 = 56 => 20x = 80 => x = 4. Present ages are 4(4)=16, 7(4)=28, and 9(4)=36.'
      },
      {
        id: 'apt-age-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Father\'s Classic Riddle] A father says to his son, "I was as old as you are at present at the time of your birth." If father\'s age is 38 now, son\'s age 5 years back?',
        question: 'A father tells his son, "I was as old as you are at present exactly at the time of your birth." If the father\'s present age is exactly 38 years, what was the son\'s age exactly 5 years ago?',
        options: [
          'A) 11 years',
          'B) 14 years',
          'C) 17 years',
          'D) 19 years'
        ],
        correctAnswer: 'B',
        explanation: 'Let Son\'s present age be S. At the time of the son\'s birth, the father\'s age was (Father\'s present age - S). The father states this equaled the son\'s present age S. So, F - S = S => F = 2S. Given F = 38, S = 19. The son\'s age 5 years ago was 19 - 5 = 14 years.'
      },
      {
        id: 'apt-age-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Family of Four Complex Relationships] Father is 3 times daughter, mother is twice the son. Wife is 9 years younger to husband. Son is 7 years older to daughter. Age of mother?',
        question: 'In a family, a couple has a son and a daughter. The age of the father is 3 times that of his daughter, and the age of the mother is twice that of her son. The wife is exactly 9 years younger than her husband. The son is exactly 7 years older than his sister (the daughter). What is the exact age of the mother?',
        options: [
          'A) 45 years',
          'B) 50 years',
          'C) 55 years',
          'D) 60 years'
        ],
        correctAnswer: 'D',
        explanation: 'Let Daughter\'s age = D. Then Son\'s age = D + 7. Father\'s age = 3D. Mother\'s age = 2(Son) = 2(D + 7) = 2D + 14. We are also given Father - Mother = 9. So, 3D - (2D + 14) = 9 => D - 14 = 9 => D = 23. Thus, Daughter = 23, Son = 30. Father = 3(23) = 69. Mother = 2(30) = 60 years. (Check: 69 - 60 = 9). The mother is 60.'
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

async function seedAptitudeBatch7() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 7 (TOPICS 19 TO 21) ===\n');

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

    // 2. Upsert Topics 19 to 21
    for (const item of aptitudeBatch7) {
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
      await client.query(`UPDATE tracks SET total_topics = 21, estimated_hours = 42 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 21, estimated_hours = 42');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 21 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 21');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 7 (Topics 19 to 21) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch7();
