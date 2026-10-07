const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const aptitudeBatch2 = [
  // ===========================================================================
  // TOPIC 4: PERMUTATION AND COMBINATION (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 4,
    slug: 'aptitude-quant-permutation-and-combination',
    title: 'Permutation and Combination',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 72,
    video_url: 'http://www.youtube.com/watch?v=ETiRE7N7pEI',
    video_title: 'Permutation and Combination - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master arrangement vs. selection, string permutations with repeated letters, the Tie/String and Gap methods, circular permutations, dictionary rank, derangements, and Stars and Bars.',
    summary_markdown: `### 📌 1. Fundamental Counting Principles: Permutation vs. Combination
* **Multiplication Rule (\`AND\`):** If Task A can be done in \`m\` ways AND Task B in \`n\` ways, both together can be done in **\`m × n\`** ways.
* **Addition Rule (\`OR\`):** If two mutually exclusive tasks can be done in \`m\` or \`n\` ways, either can be done in **\`m + n\`** ways.
* **Permutation (Order Matters — Arrangements):**
  * Arranging \`r\` objects out of \`n\` distinct objects: **\`nPr = n! / (n - r)!\`**.
  * Arranging \`n\` objects where \`p\` are alike of one kind, \`q\` are alike of a second kind: **\`n! / (p! × q!)\`**.
* **Combination (Order Does NOT Matter — Selections / Committees):**
  * Selecting \`r\` objects out of \`n\` distinct objects: **\`nCr = n! / [r! × (n - r)!]\`**.
  * Useful identities: **\`nCr = nC(n - r)\`** and **\`nC0 + nC1 + ... + nCn = 2^n\`**.

### 💡 2. High-Yield Placement Shortcuts: Tie Method, Gap Method & Circular Seating
* **Tie / String Method (Items MUST Be Together):**
  * Treat the group of \`k\` items that must stay together as **1 single super-object**. Arrange the \`(n - k + 1)\` objects first, then multiply by the internal arrangements (\`k!\`) of the tied group.
* **Gap Method (No Two Items of a Group Adjacent):**
  * If \`m\` items must never be adjacent among \`n\` other items, first arrange the \`n\` other items in \`n!\` ways. This creates **\`(n + 1)\` gaps**. Place the \`m\` restricted items into those gaps in **\`(n + 1)Cr × m!\`** ways.
* **Circular Permutations:**
  * Arranging \`n\` distinct people around a circular table (where clockwise and anticlockwise are distinct): **\`(n - 1)!\`**.
  * Necklace / Garland of \`n\` distinct beads (where clockwise and anticlockwise flips are identical): **\`(n - 1)! / 2\`**.

### 💡 3. Advanced Combinatorics: Stars & Bars, Derangements & Geometry
* **Stars and Bars (Distributing \`n\` Identical Items into \`r\` Distinct Boxes):**
  * Non-negative integer solutions (\`x_i >= 0\`) to \`x_1 + x_2 + ... + x_r = n\`: **\`C(n + r - 1, r - 1)\`**.
  * Positive integer solutions (\`x_i >= 1\`): **\`C(n - 1, r - 1)\`**.
* **Derangements (\`D_n\` — No Item in Its Original Position):**
  * \`D_n = n! × [1 - 1/1! + 1/2! - 1/3! + ... + (-1)^n / n!]\`
  * Memorize values: **\`D_1 = 0\`, \`D_2 = 1\`, \`D_3 = 2\`, \`D_4 = 9\`, \`D_5 = 44\`, \`D_6 = 265\`**.
* **Geometric Counting:**
  * From \`n\` points where \`k\` are collinear: **Lines** = \`C(n, 2) - C(k, 2) + 1\`; **Triangles** = \`C(n, 3) - C(k, 3)\`.
  * Number of diagonals of a convex \`n\`-gon = **\`n(n - 3) / 2\`**.`,
    questions: [
      {
        id: 'apt-pnc-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Tie Method with Repeated Letters] In how many distinct ways can the letters of the word "ENGINEERING" be arranged such that all the vowels always come together?',
        question: 'In how many distinct ways can the letters of the word "ENGINEERING" be arranged such that all the vowels always come together?',
        options: [
          'A) 2,100',
          'B) 4,200',
          'C) 8,400',
          'D) 50,400'
        ],
        correctAnswer: 'B',
        explanation: 'The word "ENGINEERING" has 11 letters: 5 Vowels (E: 3, I: 2) and 6 Consonants (N: 3, G: 2, R: 1). 1) Tie all 5 vowels (EEEII) into 1 single super-unit. Together with the 6 consonants, we have 6 + 1 = 7 units where N repeats 3 times and G repeats 2 times: 7! / (3! × 2!) = 5040 / 12 = 420 ways. 2) Arrange the 5 vowels internally (E: 3, I: 2): 5! / (3! × 2!) = 120 / 12 = 10 ways. 3) Total distinct arrangements = 420 × 10 = 4,200.'
      },
      {
        id: 'apt-pnc-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q2: [Gap Method with Repeated Letters] In how many distinct ways can the letters of the word "ASSASSINATION" be arranged so that no two "S"s are adjacent to each other?',
        question: 'In how many distinct ways can the 13 letters of the word "ASSASSINATION" be arranged so that no two \'S\'s are adjacent to each other?',
        options: [
          'A) 1,587,600',
          'B) 3,175,200',
          'C) 6,350,400',
          'D) 1,058,400'
        ],
        correctAnswer: 'B',
        explanation: '"ASSASSINATION" has 13 letters: S (4), A (3), I (2), N (2), T (1), O (1). 1) First arrange the 9 non-S letters (A: 3, I: 2, N: 2, T: 1, O: 1): 9! / (3! × 2! × 2!) = 362,880 / 24 = 15,120 ways. 2) These 9 letters create 9 + 1 = 10 gaps. Choose 4 out of the 10 gaps to place the 4 identical \'S\'s: C(10, 4) = (10 × 9 × 8 × 7) / 24 = 210 ways. 3) Total valid arrangements = 15,120 × 210 = 3,175,200.'
      },
      {
        id: 'apt-pnc-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Dictionary Rank Without Repetition] If all permutations of the letters of the word "MOTHER" are arranged in alphabetical order as in a dictionary, what is the exact rank of the word "MOTHER"?',
        question: 'If all permutations of the letters of the word "MOTHER" are listed in alphabetical order as in a dictionary, what is the exact position (rank) of the word "MOTHER"?',
        options: [
          'A) 308',
          'B) 309',
          'C) 310',
          'D) 312'
        ],
        correctAnswer: 'B',
        explanation: 'Alphabetical order of the 6 letters: E, H, M, O, R, T. Count words preceding "MOTHER": 1) Starting with E: 5! = 120; Starting with H: 5! = 120 (240 so far). 2) Starting with M (matches!): next alphabetical letters before O are E and H -> ME...: 4! = 24; MH...: 4! = 24 (+48 = 288). 3) Starting with MO (matches!): next letters before T are E, H, R -> MOE...: 3! = 6; MOH...: 3! = 6; MOR...: 3! = 6 (+18 = 306). 4) Starting with MOT (matches!): next letter before H is E -> MOTE...: 2! = 2 (+2 = 308). 5) Next is MOTH -> MOTHE -> MOTHER (+1 = 309).'
      },
      {
        id: 'apt-pnc-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Dictionary Rank With Repeated Letters] If all distinct permutations of the word "SUCCESS" are arranged in alphabetical order, what is the dictionary rank of the word "SUCCESS"?',
        question: 'If all distinct permutations of the 7-letter word "SUCCESS" are arranged in alphabetical (dictionary) order, what is the exact rank of the word "SUCCESS"?',
        options: [
          'A) 321',
          'B) 330',
          'C) 331',
          'D) 341'
        ],
        correctAnswer: 'C',
        explanation: 'Letters of "SUCCESS" in alphabetical order: C, C, E, S, S, S, U. 1) Starting with C (remaining: C, E, S, S, S, U): 6! / 3! = 120. 2) Starting with E (remaining: C, C, S, S, S, U): 6! / (2! × 3!) = 60. 3) Starting with S (matches 1st letter!): sub-cases before SU: • SC... (remaining: C, E, S, S, U): 5! / 2! = 60. • SE... (remaining: C, C, S, S, U): 5! / (2! × 2!) = 30. • SS... (remaining: C, C, E, S, U): 5! / 2! = 60. 4) Next is SU... and the remaining letters (C, C, E, S, S) are already in exact alphabetical order ("SUCCESS"), so add 1: 120 + 60 + 60 + 30 + 60 + 1 = 331.'
      },
      {
        id: 'apt-pnc-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q5: [Committee Selection with Exclusion] A committee of 6 is to be formed from 7 men and 5 women with at least 3 women, such that a particular man M1 and a particular woman W1 never serve together. Find the number of ways.',
        question: 'A committee of 6 members is to be formed from 7 men and 5 women such that the committee contains at least 3 women. However, a specific man M1 and a specific woman W1 refuse to serve together on the same committee. How many valid committees can be formed?',
        options: [
          'A) 332',
          'B) 347',
          'C) 362',
          'D) 462'
        ],
        correctAnswer: 'B',
        explanation: '1) Total committees of 6 with at least 3 women (unrestricted): • (3W, 3M): C(5,3)×C(7,3) = 10×35 = 350. • (4W, 2M): C(5,4)×C(7,2) = 5×21 = 105. • (5W, 1M): C(5,5)×C(7,1) = 1×7 = 7. Total = 462. 2) Subtract committees containing BOTH W1 and M1 (choosing remaining members from 4 women and 6 men): • (3W, 3M with W1, M1 fixed): C(4,2)×C(6,2) = 6×15 = 90. • (4W, 2M with W1, M1 fixed): C(4,3)×C(6,1) = 4×6 = 24. • (5W, 1M with W1, M1 fixed): C(4,4)×C(6,0) = 1×1 = 1. Total invalid = 90 + 24 + 1 = 115. 3) Valid committees = 462 - 115 = 347.'
      },
      {
        id: 'apt-pnc-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Divisibility by 4 Without Repetition Including Zero] How many 5-digit numbers divisible by 4 can be formed using the digits {0, 1, 2, 3, 4, 5} without repetition?',
        question: 'Using the digits {0, 1, 2, 3, 4, 5} without repetition, how many 5-digit numbers can be formed that are completely divisible by 4?',
        options: [
          'A) 120',
          'B) 144',
          'C) 168',
          'D) 192'
        ],
        correctAnswer: 'B',
        explanation: 'A number is divisible by 4 if its last two digits are divisible by 4. Split into two cases based on whether 0 is in the last two digits: 1) Case A (Endings containing 0): {04, 20, 40} (3 endings). For each, the remaining 4 digits are all non-zero and fill the first 3 places in 4 × 3 × 2 = 24 ways -> 3 × 24 = 72 numbers. 2) Case B (Endings NOT containing 0): {12, 24, 32, 52} (4 endings). For each, 0 cannot be in the first (ten-thousands) place, so the first 3 places can be filled in 3 × 3 × 2 = 18 ways -> 4 × 18 = 72 numbers. Total = 72 + 72 = 144.'
      },
      {
        id: 'apt-pnc-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Sum of All Permuted Numbers] What is the exact sum of all 4-digit numbers that can be formed using the digits {1, 3, 5, 7} without repetition?',
        question: 'What is the exact sum of all 24 four-digit numbers that can be formed using the digits {1, 3, 5, 7} without repetition?',
        options: [
          'A) 96,656',
          'B) 106,656',
          'C) 106,560',
          'D) 116,656'
        ],
        correctAnswer: 'B',
        explanation: 'Each of the 4 digits (1, 3, 5, 7) appears in each place value (thousands, hundreds, tens, units) exactly (4 - 1)! = 3! = 6 times. Sum of the digits = 1 + 3 + 5 + 7 = 16. Therefore, the sum in each column is 6 × 16 = 96, and the total sum is 96 × (1000 + 100 + 10 + 1) = 96 × 1111 = 106,656.'
      },
      {
        id: 'apt-pnc-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Circular Permutation with Opposite & Adjacent Constraints] 10 people (a host, a hostess, and 8 guests) sit around a circular table. In how many ways can they sit if the host and hostess sit directly opposite each other and two particular guests A and B sit adjacent to each other?',
        question: '10 people (a host, a hostess, and 8 guests) are to be seated around a circular table. In how many ways can they be seated if the host and hostess must sit directly opposite each other, and two specific guests A and B must sit next to each other?',
        options: [
          'A) 4,320',
          'B) 8,640',
          'C) 10,080',
          'D) 11,520'
        ],
        correctAnswer: 'B',
        explanation: '1) Fix the Host at one seat on the circle (1 way) and place the Hostess directly opposite (1 way). This divides the remaining 8 seats into two separate 4-seat arcs (left side of 4 seats and right side of 4 seats). 2) Guests A and B cannot bridge across the Host or Hostess, so the adjacent pair [AB] must occupy one of the 3 adjacent seat-pairs on the left arc OR one of the 3 adjacent seat-pairs on the right arc = 6 pair positions. 3) A and B can swap internally in 2! = 2 ways, and the remaining 6 guests fill the remaining 6 seats in 6! = 720 ways. Total = 6 × 2 × 720 = 8,640.'
      },
      {
        id: 'apt-pnc-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Partial Derangements] Six letters are placed into 6 addressed envelopes (one per envelope). In how many ways can this be done so that EXACTLY 2 letters go into their correct envelopes and the other 4 go into wrong envelopes?',
        question: 'Six distinct letters are placed into 6 corresponding addressed envelopes (one letter per envelope). In how many ways can this be done such that EXACTLY 2 letters are placed in their correct envelopes and the remaining 4 are placed in wrong envelopes?',
        options: [
          'A) 90',
          'B) 135',
          'C) 180',
          'D) 265'
        ],
        correctAnswer: 'B',
        explanation: '1) Choose which 2 of the 6 letters go into their correct envelopes: C(6, 2) = (6 × 5) / 2 = 15 ways. 2) The remaining 4 letters must all go into wrong envelopes (a Derangement of 4 items, D_4): D_4 = 4! × (1/2! - 1/3! + 1/4!) = 24 × (1/2 - 1/6 + 1/24) = 12 - 4 + 1 = 9 ways. 3) Multiply both choices: 15 × 9 = 135 ways.'
      },
      {
        id: 'apt-pnc-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Stars and Bars with Lower Bounds] Find the number of integer solutions to x1 + x2 + x3 + x4 = 20 subject to x1 >= 2, x2 >= 3, x3 >= 0, and x4 >= 1.',
        question: 'How many ordered quadruples of integers (x1, x2, x3, x4) satisfy the equation\nx1 + x2 + x3 + x4 = 20\nsubject to the constraints x1 ≥ 2, x2 ≥ 3, x3 ≥ 0, and x4 ≥ 1?',
        options: [
          'A) 560',
          'B) 680',
          'C) 816',
          'D) 969'
        ],
        correctAnswer: 'B',
        explanation: 'Pre-allocate the minimum required units to each variable (2 to x1, 3 to x2, 0 to x3, and 1 to x4): remaining sum to distribute freely = 20 - (2 + 3 + 0 + 1) = 14. Now distribute n = 14 identical units among r = 4 non-negative variables using Stars and Bars: C(n + r - 1, r - 1) = C(14 + 4 - 1, 4 - 1) = C(17, 3) = (17 × 16 × 15) / 6 = 680.'
      },
      {
        id: 'apt-pnc-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Collinear Points & Triangles] Out of 15 points in a plane, 6 points lie on a single straight line and no other 3 points are collinear. Find (Total Triangles - Total Straight Lines) formed by these points.',
        question: 'There are 15 points in a plane, out of which 6 are collinear (lie on a single straight line) and no other 3 points are collinear. If T is the number of distinct triangles and L is the number of distinct straight lines that can be formed by joining these points, what is the value of (T - L)?',
        options: [
          'A) 344',
          'B) 364',
          'C) 435',
          'D) 415'
        ],
        correctAnswer: 'A',
        explanation: '1) Number of Triangles T: choosing any 3 points minus choosing 3 points from the 6 collinear points = C(15, 3) - C(6, 3) = 455 - 20 = 435. 2) Number of Straight Lines L: choosing any 2 points minus pairs from the 6 collinear points, plus 1 for the collinear line itself = C(15, 2) - C(6, 2) + 1 = 105 - 15 + 1 = 91. 3) Therefore, T - L = 435 - 91 = 344.'
      },
      {
        id: 'apt-pnc-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q12: [Chessboard Rectangles vs. Squares] On a standard 8×8 chessboard, how many rectangles can be formed that are NOT squares?',
        question: 'On a standard 8×8 chessboard (formed by 9 horizontal lines and 9 vertical lines), how many rectangles can be formed that are strictly NOT squares?',
        options: [
          'A) 1,088',
          'B) 1,092',
          'C) 1,296',
          'D) 204'
        ],
        correctAnswer: 'B',
        explanation: '1) Total rectangles (including squares): choose any 2 of the 9 horizontal lines and any 2 of the 9 vertical lines = C(9, 2) × C(9, 2) = 36 × 36 = 1,296. 2) Total squares of all sizes (1×1 up to 8×8) = 1^2 + 2^2 + ... + 8^2 = [8 × 9 × 17] / 6 = 204. 3) Rectangles that are strictly NOT squares = 1,296 - 204 = 1,092.'
      },
      {
        id: 'apt-pnc-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q13: [4-Letter Words from Multiset] How many distinct 4-letter words (with or without meaning) can be formed out of the letters of the word "PROPORTION"?',
        question: 'How many distinct 4-letter words (with or without meaning) can be formed using the letters of the 10-letter word "PROPORTION"?',
        options: [
          'A) 720',
          'B) 758',
          'C) 738',
          'D) 840'
        ],
        correctAnswer: 'B',
        explanation: '"PROPORTION" has 6 unique letter types with frequencies: O (3), P (2), R (2), T (1), I (1), N (1). Break into 4 disjoint cases: 1) Case 1 (3 alike, 1 different — AAAB): only O can be tripled (1 choice), pick 1 other letter from 5 remaining types (5 choices), arrange in 4!/3! = 4 ways -> 1 × 5 × 4 = 20. 2) Case 2 (2 alike of one type, 2 alike of another — AABB): choose 2 types from {O, P, R} = C(3, 2) = 3, arrange in 4!/(2!2!) = 6 ways -> 3 × 6 = 18. 3) Case 3 (2 alike, 2 different — AABC): choose pair from {O, P, R} (3 choices), choose 2 distinct from remaining 5 types (C(5,2) = 10), arrange in 4!/2! = 12 ways -> 3 × 10 × 12 = 360. 4) Case 4 (All 4 different — ABCD): C(6, 4) × 4! = 15 × 24 = 360. Total = 20 + 18 + 360 + 360 = 758.'
      },
      {
        id: 'apt-pnc-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q14: [Partitioning into Unlabeled Equal-Sized Parcels] In how many ways can 10 distinct books be divided into 3 unlabeled parcels containing 4, 3, and 3 books?',
        question: 'In how many ways can 10 distinct books be divided into 3 unlabeled parcels containing 4, 3, and 3 books respectively?',
        options: [
          'A) 2,100',
          'B) 4,200',
          'C) 12,600',
          'D) 1,050'
        ],
        correctAnswer: 'A',
        explanation: 'When dividing n distinct objects into unlabeled groups where k groups have the exact same size (here two groups both have size 3), we must divide by k! (2!) to eliminate duplicate ordering of the equal-sized groups: Ways = 10! / (4! × 3! × 3! × 2!) = 3,628,800 / (24 × 6 × 6 × 2) = 3,628,800 / 1,728 = 2,100.'
      },
      {
        id: 'apt-pnc-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Polygon Diagonals & Interior Intersection Points] A convex polygon has 44 diagonals. What is the maximum number of interior intersection points formed by its diagonals (assuming no three diagonals are concurrent)?',
        question: 'A convex polygon has exactly 44 diagonals. If no three of its diagonals intersect at the same interior point, what is the total number of interior intersection points formed by its diagonals?',
        options: [
          'A) 210',
          'B) 330',
          'C) 495',
          'D) 165'
        ],
        correctAnswer: 'B',
        explanation: '1) Find the number of sides n from the diagonal formula: n(n - 3) / 2 = 44 => n(n - 3) = 88 => n = 11 sides (since 11 × 8 = 88). 2) Every choice of 4 vertices out of the 11 vertices of a convex polygon forms a unique convex quadrilateral whose two diagonals intersect at exactly 1 interior point! Thus, the number of interior intersection points is C(11, 4) = (11 × 10 × 9 × 8) / 24 = 330.'
      },
      {
        id: 'apt-pnc-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Grid Paths with Checkpoint & Obstacle] On a grid from (0,0) to (7,5), how many shortest paths (moving only East or North) pass through (3,2) but avoid (5,4)?',
        question: 'On a rectangular city grid, a commuter travels from (0, 0) to (7, 5) taking only East (+x) and North (+y) steps. How many shortest paths pass through the checkpoint (3, 2) but do NOT pass through the blocked intersection (5, 4)?',
        options: [
          'A) 150',
          'B) 170',
          'C) 180',
          'D) 350'
        ],
        correctAnswer: 'B',
        explanation: '1) Total paths from (0,0) to (7,5) via (3,2): Paths[(0,0)->(3,2)] × Paths[(3,2)->(7,5)] = C(3+2, 2) × C(4+3, 3) = C(5, 2) × C(7, 3) = 10 × 35 = 350. 2) Subtract paths that go (0,0) -> (3,2) -> (5,4) -> (7,5): C(5, 2) × C(2+2, 2) × C(2+1, 1) = 10 × 6 × 3 = 180. 3) Valid paths = 350 - 180 = 170.'
      },
      {
        id: 'apt-pnc-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Mixed Selection of Identical and Distinct Items] A basket contains 5 identical apples, 4 identical oranges, and 3 distinct mangoes. In how many ways can a person select at least one fruit?',
        question: 'A fruit basket contains 5 identical apples, 4 identical oranges, and 3 distinct (different variety) mangoes. In how many ways can a person select at least one fruit from the basket?',
        options: [
          'A) 119',
          'B) 239',
          'C) 240',
          'D) 4,095'
        ],
        correctAnswer: 'B',
        explanation: '1) For the 5 identical apples, the number of apples chosen can be 0, 1, 2, 3, 4, or 5 (6 ways). 2) For the 4 identical oranges, the number chosen can be 0, 1, 2, 3, or 4 (5 ways). 3) For the 3 distinct mangoes, each mango can be independently selected or not in 2^3 = 8 ways. 4) Total selections minus the 1 empty selection (0 fruits of all types) = (6 × 5 × 8) - 1 = 240 - 1 = 239.'
      },
      {
        id: 'apt-pnc-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Round-Robin + Knockout Tournament Math] Players are split into 2 equal groups for a round-robin stage (each plays every other in their group once), followed by an 8-player single-elimination knockout stage. If 97 total matches were played, how many players entered the tournament?',
        question: 'In a tournament, all participants are divided into 2 equal groups. Within each group, every participant plays 1 match against every other participant in that group. The top 4 players from each group then advance to an 8-player single-elimination knockout stage (with no third-place match). If 97 matches were played in total, how many participants entered the tournament?',
        options: [
          'A) 16',
          'B) 18',
          'C) 20',
          'D) 24'
        ],
        correctAnswer: 'C',
        explanation: '1) An 8-player single-elimination knockout bracket eliminates 1 player per match, so it takes 8 - 1 = 7 matches to crown the champion. 2) Remaining matches played in the 2 equal round-robin groups = 97 - 7 = 90 matches (45 matches per group). 3) If each group has k players, C(k, 2) = k(k - 1)/2 = 45 => k(k - 1) = 90 => k = 10 players per group. 4) Total participants across both groups = 2 × 10 = 20.'
      },
      {
        id: 'apt-pnc-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [k-th Lexicographical Permutation of Digits] All 6-digit numbers formed using the digits {1, 2, 3, 4, 5, 6} without repetition are arranged in ascending order. What is the 510th number in the list?',
        question: 'All 720 six-digit numbers formed using the digits {1, 2, 3, 4, 5, 6} without repetition are arranged in strictly increasing order. What is the 510th number in this sequence?',
        options: [
          'A) 521346',
          'B) 521643',
          'C) 523146',
          'D) 516432'
        ],
        correctAnswer: 'B',
        explanation: '1) Each starting digit accounts for 5! = 120 numbers. Digits 1, 2, 3, and 4 cover the first 4 × 120 = 480 numbers. Thus, the 510th number is the (510 - 480) = 30th number starting with 5. 2) Remaining digits for "5_ _ _ _ _" are {1, 2, 3, 4, 6}. Each second digit accounts for 4! = 24 numbers: "51..." covers the 1st to 24th numbers (positions 481 to 504). 3) Thus we need the (30 - 24) = 6th number starting with "52...". 4) For "52_ _ _ _", each third digit accounts for 3! = 6 numbers! Therefore, the 6th number starting with "52..." is the VERY LAST (largest) number starting with "521...", which arranges the remaining digits {3, 4, 6} in descending order: 521643.'
      },
      {
        id: 'apt-pnc-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q20: [Surjective / Onto Distribution via Inclusion-Exclusion] In how many ways can 6 distinct tasks be assigned to 3 distinct servers such that every server receives at least one task?',
        question: 'In how many ways can 6 distinct microservice tasks be assigned to 3 distinct worker servers such that every server receives at least one task?',
        options: [
          'A) 540',
          'B) 665',
          'C) 720',
          'D) 729'
        ],
        correctAnswer: 'A',
        explanation: 'Use the Principle of Inclusion-Exclusion (onto functions from a 6-element set to a 3-element set): 1) Total unrestricted assignments = 3^6 = 729. 2) Subtract assignments where at least 1 server is idle: C(3, 1) × 2^6 = 3 × 64 = 192. 3) Add back assignments where at least 2 servers are idle: C(3, 2) × 1^6 = 3 × 1 = 3. Total valid assignments = 729 - 192 + 3 = 540.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 5: PROBABILITY (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 5,
    slug: 'aptitude-quant-probability',
    title: 'Probability',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 68,
    video_url: 'http://www.youtube.com/watch?v=ximxxERGSUc',
    video_title: 'Probability - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master classical and conditional probability, Bayes\' Theorem, hypergeometric card/urn sampling without replacement, binomial trials, circular seating probabilities, and infinite geometric game series.',
    summary_markdown: `### 📌 1. Fundamental Axioms, Addition Rule & Multiplication Rule
* **Classical Probability:** \`P(E) = (Number of Favorable Outcomes) / (Total Sample Space Outcomes)\`. Always satisfies \`0 <= P(E) <= 1\` and \`P(E) + P(E') = 1\`.
* **Complement Shortcut for "At Least One":**
  * **\`P(At least one) = 1 - P(None)\`**.
* **Addition Theorem (\`OR\` / Union — Avoiding Double Counting):**
  * **\`P(A ∪ B) = P(A) + P(B) - P(A ∩ B)\`**.
  * For mutually exclusive (disjoint) events, \`P(A ∩ B) = 0\`.
* **Independent Events (\`AND\` / Intersection):**
  * Two events are independent if **\`P(A ∩ B) = P(A) × P(B)\`**.
  * If three candidates solve a problem independently with probabilities \`P(A), P(B), P(C)\`, the probability that the problem is solved (at least one solves it) is **\`1 - [P(A') × P(B') × P(C')]\`**.

### 💡 2. Conditional Probability, Total Probability & Bayes' Theorem
* **Conditional Probability (Probability of \`A\` given \`B\` has occurred):**
  * **\`P(A | B) = P(A ∩ B) / P(B)\`**.
* **Law of Total Probability & Bayes' Theorem:**
  * If an outcome \`E\` can occur through mutually exclusive causes \`B_1, B_2, ..., B_k\`:
    \`P(E) = P(B_1)P(E | B_1) + P(B_2)P(E | B_2) + ... + P(B_k)P(E | B_k)\`
  * **Bayes' Inverse Probability:**
    \`P(B_i | E) = [ P(B_i) × P(E | B_i) ] / P(E)\`.

### 💡 3. Standard Sample Spaces & Special Distributions
* **Standard 52-Card Deck:** 4 suits (**Spades ♠, Clubs ♣** = 26 Black; **Hearts ♥, Diamonds ♦** = 26 Red), 13 cards per suit (\`2–10\`, **Jack, Queen, King** = 12 Face Cards total, plus 4 **Aces**).
* **Binomial Distribution (\`n\` Independent Trials):** Probability of exactly \`r\` successes where success probability is \`p\` and failure is \`q = 1 - p\`:
  **\`P(X = r) = C(n, r) × p^r × q^(n - r)\`**.
* **Infinite Turn-Taking Games (Geometric Series):** If Player A and Player B alternate turns with success probability \`p\` (and failure \`q = 1 - p\`), then \`P(A wins) = p / (1 - q^2)\` and \`P(B wins) = qp / (1 - q^2)\`.`,
    questions: [
      {
        id: 'apt-prob-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Bayes\' Theorem in Manufacturing] Machines A, B, and C produce 50%, 30%, and 20% of chips. Their defective rates are 3%, 4%, and 5%. If a randomly selected chip is defective, find the probability it came from Machine B.',
        question: 'In a semiconductor plant, Machines A, B, and C manufacture 50%, 30%, and 20% of the total microchips respectively. Of their respective outputs, 3%, 4%, and 5% of the chips are defective. A chip is selected at random from the plant\'s output and found to be defective. What is the probability that it was manufactured by Machine B?',
        options: [
          'A) 15 / 37',
          'B) 12 / 37',
          'C) 10 / 37',
          'D) 4 / 15'
        ],
        correctAnswer: 'B',
        explanation: 'By Bayes\' Theorem: 1) P(A) × P(D|A) = 0.50 × 0.03 = 0.015. 2) P(B) × P(D|B) = 0.30 × 0.04 = 0.012. 3) P(C) × P(D|C) = 0.20 × 0.05 = 0.010. Total probability of a defective chip P(D) = 0.015 + 0.012 + 0.010 = 0.037. Therefore, P(B | D) = 0.012 / 0.037 = 12 / 37.'
      },
      {
        id: 'apt-prob-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q2: [Sequential Multi-Ball Transfer Between Boxes] Box 1 has 5 black and 4 green balls; Box 2 has 3 black and 6 green balls. Two balls are transferred from Box 1 to Box 2, and then 1 ball is drawn from Box 2. Find the probability it is black.',
        question: 'Box 1 contains 5 black and 4 green balls, while Box 2 contains 3 black and 6 green balls. Two balls are drawn simultaneously at random from Box 1 and placed into Box 2. Subsequently, one ball is drawn at random from Box 2. What is the probability that the ball drawn from Box 2 is black?',
        options: [
          'A) 37 / 99',
          'B) 4 / 11',
          'C) 35 / 99',
          'D) 5 / 11'
        ],
        correctAnswer: 'A',
        explanation: 'Total ways to draw 2 balls from Box 1 = C(9, 2) = 36. After adding 2 balls to Box 2, Box 2 has 9 + 2 = 11 balls: 1) Case 1 (2 Black transferred): P = C(5,2)/36 = 10/36; Box 2 now has 5 black -> (10/36) × (5/11) = 50/396. 2) Case 2 (1 Black, 1 Green transferred): P = (5×4)/36 = 20/36; Box 2 now has 4 black -> (20/36) × (4/11) = 80/396. 3) Case 3 (2 Green transferred): P = C(4,2)/36 = 6/36; Box 2 still has 3 black -> (6/36) × (3/11) = 18/396. Total probability = (50 + 80 + 18) / 396 = 148 / 396 = 37 / 99.'
      },
      {
        id: 'apt-prob-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Independent Problem Solving — At Least Two] Three programmers A, B, and C have independent probabilities 3/5, 2/3, and 3/4 of solving a bug. What is the probability that at least two of them solve it?',
        question: 'Three software engineers A, B, and C attempt to fix a bug independently, with probabilities of success 3/5, 2/3, and 3/4 respectively. What is the probability that AT LEAST TWO of them succeed in fixing the bug?',
        options: [
          'A) 11 / 15',
          'B) 3 / 4',
          'C) 47 / 60',
          'D) 7 / 10'
        ],
        correctAnswer: 'B',
        explanation: 'Common denominator = 5 × 3 × 4 = 60. Sum the 4 mutually exclusive cases where 2 or 3 engineers succeed: 1) A and B succeed, C fails: (3 × 2 × 1) / 60 = 6/60. 2) A and C succeed, B fails: (3 × 1 × 3) / 60 = 9/60. 3) B and C succeed, A fails: (2 × 2 × 3) / 60 = 12/60. 4) All three A, B, and C succeed: (3 × 2 × 3) / 60 = 18/60. Total probability = (6 + 9 + 12 + 18) / 60 = 45 / 60 = 3 / 4.'
      },
      {
        id: 'apt-prob-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Conditional Probability on Three Dice] Three fair 6-sided dice are rolled. Given that the sum of the three faces is 10, what is the probability that at least one die shows a 6?',
        question: 'Three fair six-sided dice are rolled simultaneously. Given that the sum of the numbers appearing on the three dice is 10, what is the conditional probability that at least one of the dice shows a 6?',
        options: [
          'A) 1 / 4',
          'B) 1 / 3',
          'C) 5 / 18',
          'D) 2 / 9'
        ],
        correctAnswer: 'B',
        explanation: '1) Total ordered triples (x1, x2, x3) ∈ {1..6}^3 summing to 10: by Stars and Bars, C(10-1, 3-1) - 3 × C(10-6-1, 2) = C(9, 2) - 3 × C(3, 2) = 36 - 9 = 27 outcomes. 2) Favorable triples containing at least one 6 and summing to 10: the remaining two dice must sum to 10 - 6 = 4. The partitions are {6, 1, 3} (3! = 6 permutations) and {6, 2, 2} (3!/2! = 3 permutations) -> 6 + 3 = 9 outcomes. 3) Conditional probability = 9 / 27 = 1 / 3.'
      },
      {
        id: 'apt-prob-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Cards Without Replacement — Different Suits] Three cards are drawn at random from a 52-card deck. What is the probability of getting 1 King, 1 Queen, and 1 Jack such that all three belong to DIFFERENT suits?',
        question: 'Three cards are drawn simultaneously at random from a well-shuffled standard deck of 52 playing cards. What is the probability that the three cards consist of 1 King, 1 Queen, and 1 Jack, all belonging to DIFFERENT suits?',
        options: [
          'A) 6 / 5,525',
          'B) 16 / 5,525',
          'C) 3 / 5,525',
          'D) 24 / 5,525'
        ],
        correctAnswer: 'A',
        explanation: '1) Total ways to choose 3 cards out of 52 = C(52, 3) = (52 × 51 × 50) / 6 = 22,100. 2) Favorable ways: choose 1 of the 4 Kings (4 choices), choose 1 Queen from the remaining 3 suits (3 choices), and choose 1 Jack from the remaining 2 suits (2 choices) = 4 × 3 × 2 = 24 ways. 3) Probability = 24 / 22,100 = 6 / 5,525.'
      },
      {
        id: 'apt-prob-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Circular Seating Probability] 6 men and 4 women are seated randomly around a circular table. What is the probability that no two women sit adjacent to each other?',
        question: 'Six men and four women are seated at random around a circular table. What is the probability that no two women sit next to each other?',
        options: [
          'A) 1 / 14',
          'B) 5 / 42',
          'C) 1 / 7',
          'D) 5 / 21'
        ],
        correctAnswer: 'B',
        explanation: '1) Total circular arrangements of 10 people = (10 - 1)! = 9!. 2) Favorable arrangements: seat the 6 men around the circle in (6 - 1)! = 5! ways, creating 6 gaps between them. seat the 4 women in 4 of the 6 gaps in P(6, 4) = 6 × 5 × 4 × 3 ways. 3) Probability = [5! × (6 × 5 × 4 × 3)] / 9! = (6 × 5 × 4 × 3) / (9 × 8 × 7 × 6) = 5 / 42.'
      },
      {
        id: 'apt-prob-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q7: [Infinite Geometric Series Turn-Taking Game] Three players A, B, and C take turns in order A -> B -> C -> A... rolling a fair die. The first to roll a 6 wins. Find the probability that B wins.',
        question: 'Three players A, B, and C take turns in the cyclic order A, B, C, A, B, C, ... rolling a single fair six-sided die. The first player to roll a 6 wins the game immediately. What is the exact probability that Player B wins the game?',
        options: [
          'A) 36 / 91',
          'B) 30 / 91',
          'C) 25 / 91',
          'D) 5 / 18'
        ],
        correctAnswer: 'B',
        explanation: 'On any roll, probability of winning is p = 1/6 and failing is q = 5/6. Player B wins on roll 2 (A fails, B succeeds: qp), or roll 5 (q^4 p), or roll 8 (q^7 p), and so on. Summing this infinite geometric series with first term a = qp = 5/36 and common ratio r = q^3 = 125/216 gives: P(B wins) = (5/36) / (1 - 125/216) = (30/216) / (91/216) = 30 / 91.'
      },
      {
        id: 'apt-prob-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Bayesian Witness Testimony] A speaks truth 4/5 of the time and B speaks truth 3/4 of the time. A ball is drawn from a bag of 1 white and 5 black balls. Both A and B assert that the drawn ball was white. Find the probability it was actually white.',
        question: 'Witness A speaks the truth 4 out of 5 times, and Witness B speaks the truth 3 out of 4 times. A ball is drawn at random from an urn containing 1 white ball and 5 black balls. Both A and B independently state that the drawn ball was white. What is the probability that the ball drawn was actually white?',
        options: [
          'A) 3 / 5',
          'B) 12 / 17',
          'C) 4 / 7',
          'D) 36 / 41'
        ],
        correctAnswer: 'B',
        explanation: 'Prior probabilities: P(White) = 1/6, and P(Black) = 5/6. 1) If the ball was actually White, both A and B told the truth: P(Both say W | W) = (4/5) × (3/4) = 12/20. 2) If the ball was actually Black, both A and B lied: P(Both say W | B) = (1/5) × (1/4) = 1/20. 3) By Bayes\' Theorem: P(W | Both say W) = [(1/6) × (12/20)] / [ (1/6)×(12/20) + (5/6)×(1/20) ] = 12 / (12 + 5) = 12 / 17.'
      },
      {
        id: 'apt-prob-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Leap Year Calendar Union Probability] What is the probability that a randomly selected leap year contains 53 Fridays OR 53 Saturdays?',
        question: 'What is the probability that a randomly chosen leap year contains 53 Fridays OR 53 Saturdays?',
        options: [
          'A) 2 / 7',
          'B) 3 / 7',
          'C) 4 / 7',
          'D) 1 / 7'
        ],
        correctAnswer: 'B',
        explanation: 'A leap year has 366 days = 52 full weeks (364 days) + 2 consecutive extra days. There are 7 equally likely pairs for the 2 extra days: (Sun, Mon), (Mon, Tue), (Tue, Wed), (Wed, Thu), (Thu, Fri), (Fri, Sat), and (Sat, Sun). The pairs containing Friday OR Saturday are (Thu, Fri), (Fri, Sat), and (Sat, Sun)—which is 3 out of 7 (or by Inclusion-Exclusion: 2/7 + 2/7 - 1/7 = 3/7).'
      },
      {
        id: 'apt-prob-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Binomial Trials — Biased Coin] A biased coin lands Heads with probability 2/3. If tossed 5 times, what is the probability of getting at least 4 Heads?',
        question: 'A biased coin is weighted such that the probability of landing Heads on any toss is 2/3. If the coin is tossed 5 times independently, what is the probability of obtaining AT LEAST 4 Heads?',
        options: [
          'A) 80 / 243',
          'B) 112 / 243',
          'C) 131 / 243',
          'D) 16 / 81'
        ],
        correctAnswer: 'B',
        explanation: 'Using the Binomial formula P(X = r) = C(5, r) × (2/3)^r × (1/3)^(5-r): 1) P(X = 4) = C(5, 4) × (2/3)^4 × (1/3)^1 = 5 × 16 / 243 = 80 / 243. 2) P(X = 5) = C(5, 5) × (2/3)^5 = 32 / 243. 3) P(X ≥ 4) = (80 + 32) / 243 = 112 / 243.'
      },
      {
        id: 'apt-prob-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Derangement Envelope Probability] Five letters are placed randomly into 5 addressed envelopes. Find the probability that at least 1 letter is in its right envelope, but NOT all 5 are right.',
        question: 'Five distinct letters are placed at random into 5 corresponding addressed envelopes (one letter per envelope). What is the probability that AT LEAST ONE letter is placed in its correct envelope, AND NOT all 5 letters are in their correct envelopes?',
        options: [
          'A) 11 / 30',
          'B) 5 / 8',
          'C) 19 / 30',
          'D) 7 / 12'
        ],
        correctAnswer: 'B',
        explanation: 'Total ways = 5! = 120. 1) Number of ways where 0 letters are in the right envelope (full derangement D_5) = 120 × (1/2 - 1/6 + 1/24 - 1/120) = 60 - 20 + 5 - 1 = 44. 2) Number of ways where all 5 letters are in the right envelope = 1. 3) Favorable ways = 120 - 44 - 1 = 75. 4) Probability = 75 / 120 = 5 / 8.'
      },
      {
        id: 'apt-prob-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Shoe Closet Pair Matching Probability] A rack holds 6 distinct pairs of shoes (12 shoes). If 4 shoes are picked at random, what is the probability of getting at least one matching pair?',
        question: 'A shoe rack holds 6 distinct pairs of shoes (12 individual shoes). If 4 shoes are selected at random without replacement, what is the probability that there is AT LEAST ONE complete matching pair among the 4 selected shoes?',
        options: [
          'A) 16 / 33',
          'B) 17 / 33',
          'C) 15 / 33',
          'D) 19 / 33'
        ],
        correctAnswer: 'B',
        explanation: 'Use the complement: P(at least 1 pair) = 1 - P(no matching pair). 1) Total ways to pick 4 shoes out of 12 = C(12, 4) = (12 × 11 × 10 × 9) / 24 = 495. 2) Ways to pick 4 shoes with NO matching pair: choose 4 different pairs out of the 6 pairs in C(6, 4) = 15 ways, and from each chosen pair pick either the left or right shoe in 2^4 = 16 ways -> 15 × 16 = 240 ways. 3) P(no pair) = 240 / 495 = 16 / 33. Therefore, P(at least 1 pair) = 1 - 16/33 = 17 / 33.'
      },
      {
        id: 'apt-prob-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Number Theory in Probability] Two distinct numbers are chosen at random from {1, 2, 3, ..., 30}. What is the probability that the sum of their squares (a^2 + b^2) is divisible by 3?',
        question: 'Two distinct integers a and b are chosen at random from the first 30 natural numbers {1, 2, 3, ..., 30}. What is the probability that (a^2 + b^2) is completely divisible by 3?',
        options: [
          'A) 1 / 3',
          'B) 3 / 29',
          'C) 9 / 29',
          'D) 10 / 29'
        ],
        correctAnswer: 'B',
        explanation: 'For any integer x, x^2 mod 3 is either 0 (if x is a multiple of 3) or 1 (if x is not a multiple of 3). Thus, a^2 + b^2 ≡ 0 (mod 3) is possible IF AND ONLY IF both a^2 ≡ 0 and b^2 ≡ 0 (mod 3), meaning both a and b must be multiples of 3! Among {1..30}, there are 10 multiples of 3. Thus, P = C(10, 2) / C(30, 2) = (10 × 9) / (30 × 29) = 3 / 29.'
      },
      {
        id: 'apt-prob-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Chessboard Adjacent Squares] Two 1×1 squares are chosen at random on an 8×8 chessboard. What is the probability that they share a common side?',
        question: 'Two unit squares are chosen at random without replacement from the 64 unit squares of a standard 8×8 chessboard. What is the probability that the two chosen squares share a common side?',
        options: [
          'A) 1 / 18',
          'B) 1 / 16',
          'C) 7 / 64',
          'D) 1 / 9'
        ],
        correctAnswer: 'A',
        explanation: '1) Total ways to choose 2 squares out of 64 = C(64, 2) = (64 × 63) / 2 = 2,016. 2) Favorable adjacent pairs: each of the 8 rows has 7 adjacent horizontal pairs (8 × 7 = 56), and each of the 8 columns has 7 adjacent vertical pairs (8 × 7 = 56) -> 56 + 56 = 112 pairs. 3) Probability = 112 / 2,016 = 1 / 18.'
      },
      {
        id: 'apt-prob-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Conditional Probability Sum] For two events A and B, P(A) = 3/8, P(B) = 5/8, and P(A ∪ B) = 3/4. Find the exact value of P(A | B) + P(B | A).',
        question: 'For two events A and B in a sample space, P(A) = 3/8, P(B) = 5/8, and P(A ∪ B) = 3/4. What is the exact value of P(A | B) + P(B | A)?',
        options: [
          'A) 1',
          'B) 16 / 15',
          'C) 14 / 15',
          'D) 17 / 15'
        ],
        correctAnswer: 'B',
        explanation: '1) First find P(A ∩ B) using the Addition Rule: P(A ∩ B) = P(A) + P(B) - P(A ∪ B) = 3/8 + 5/8 - 3/4 = 1 - 3/4 = 1/4. 2) Compute P(A | B) = P(A ∩ B) / P(B) = (1/4) / (5/8) = 2/5. 3) Compute P(B | A) = P(A ∩ B) / P(A) = (1/4) / (3/8) = 2/3. 4) Sum = 2/5 + 2/3 = 16 / 15.'
      },
      {
        id: 'apt-prob-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Minimum Trials Threshold] A sniper hits a target with probability 1/4 on each shot. What is the minimum number of shots needed so the probability of hitting at least once exceeds 2/3?',
        question: 'A marksman hits a target on each independent shot with probability 1/4. What is the MINIMUM number of shots he must fire so that the probability of hitting the target AT LEAST ONCE is strictly greater than 2/3?',
        options: [
          'A) 3',
          'B) 4',
          'C) 5',
          'D) 6'
        ],
        correctAnswer: 'B',
        explanation: 'We need P(at least 1 hit in n shots) = 1 - (3/4)^n > 2/3 => (3/4)^n < 1/3 => 3^(n + 1) < 4^n. Testing integers: for n = 3, 3^4 = 81 > 4^3 = 64 (fails); for n = 4, 3^5 = 243 < 4^4 = 256 (holds! 1 - 81/256 = 175/256 ≈ 0.6836 > 0.6667). Thus, minimum shots = 4.'
      },
      {
        id: 'apt-prob-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q17: [Continuous / Geometric Probability of Meeting] Two friends arrive independently and uniformly at random between 5:00 PM and 6:00 PM and wait at most 15 minutes. Find the probability they meet.',
        question: 'Two friends agree to meet at a cafe between 5:00 PM and 6:00 PM. Each arrives at a time chosen independently and uniformly at random within that 60-minute window and waits at most 15 minutes for the other before leaving. What is the probability that they actually meet?',
        options: [
          'A) 1 / 4',
          'B) 7 / 16',
          'C) 9 / 16',
          'D) 1 / 2'
        ],
        correctAnswer: 'B',
        explanation: 'Represent arrival times (x, y) on a 60 × 60 square. They meet if |x - y| ≤ 15. The region where they do NOT meet consists of two right-angled corner triangles, each with legs of length 60 - 15 = 45 minutes (3/4 of the side length). Combined area of the two non-meeting triangles as a fraction of the square is (3/4)^2 = 9/16. Therefore, the probability that they meet is 1 - 9/16 = 7 / 16.'
      },
      {
        id: 'apt-prob-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q18: [Conditional Sampling Without Replacement] A box has 6 black, 4 red, and 5 blue shirts. Four shirts are drawn at random. Given that at least one drawn shirt is red, what is the probability all 4 are red?',
        question: 'A box contains 6 black, 4 red, and 5 blue shirts. Four shirts are drawn at random without replacement. Given that AT LEAST ONE of the 4 drawn shirts is red, what is the conditional probability that ALL 4 drawn shirts are red?',
        options: [
          'A) 1 / 1,365',
          'B) 1 / 1,035',
          'C) 4 / 1,035',
          'D) 1 / 330'
        ],
        correctAnswer: 'B',
        explanation: '1) Total ways to pick 4 shirts out of 15 = C(15, 4) = 1,365. 2) Ways to pick 0 red shirts (all 4 from the 11 non-red shirts) = C(11, 4) = 330. 3) Thus, ways with AT LEAST ONE red shirt = 1,365 - 330 = 1,035. 4) Ways where ALL 4 shirts are red = C(4, 4) = 1. Conditional probability = 1 / 1,035.'
      },
      {
        id: 'apt-prob-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q19: [Random 2×2 Matrix Determinant Probability] Each of the 4 entries of a 2×2 matrix is chosen independently at random from {0, 1, 2}. What is the probability that its determinant is 0?',
        question: 'Each of the 4 entries of a 2×2 matrix M = [[a, b], [c, d]] is chosen independently and uniformly at random from the set {0, 1, 2}. What is the probability that the determinant of M (ad - bc) is equal to 0?',
        options: [
          'A) 29 / 81',
          'B) 31 / 81',
          'C) 1 / 3',
          'D) 35 / 81'
        ],
        correctAnswer: 'B',
        explanation: 'Total matrices = 3^4 = 81. For two elements x, y ∈ {0, 1, 2} (9 pairs), the product xy equals: • 0 in 5 ways: (0,0), (0,1), (0,2), (1,0), (2,0). • 1 in 1 way: (1,1). • 2 in 2 ways: (1,2), (2,1). • 4 in 1 way: (2,2). For ad - bc = 0, we need ad = bc: 5^2 + 1^2 + 2^2 + 1^2 = 25 + 1 + 4 + 1 = 31 matrices. Probability = 31 / 81.'
      },
      {
        id: 'apt-prob-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [1D Random Walk Probability] A particle at x = 0 moves +1 with probability 2/3 or -1 with probability 1/3 each second. Find the probability it is at x = +2 after 6 seconds.',
        question: 'A particle starts at x = 0 on a number line. At each step, it moves +1 unit to the right with probability 2/3, or -1 unit to the left with probability 1/3. After 6 independent steps, what is the probability that the particle is located at x = +2?',
        options: [
          'A) 80 / 243',
          'B) 160 / 729',
          'C) 64 / 729',
          'D) 40 / 243'
        ],
        correctAnswer: 'A',
        explanation: 'Let R be the number of +1 steps and L be the number of -1 steps. We have R + L = 6 and R - L = 2 => 2R = 8 => R = 4 right steps and L = 2 left steps. By the Binomial formula: P(R = 4) = C(6, 4) × (2/3)^4 × (1/3)^2 = 15 × 16 / 729 = 240 / 729 = 80 / 243.'
      }
    ]
  },

  // ===========================================================================
  // TOPIC 6: MIXTURE AND ALLIGATION (20 HARD / VERY HARD QUESTIONS — 30 MINS)
  // ===========================================================================
  {
    topic_order: 6,
    slug: 'aptitude-quant-mixture-and-alligation',
    title: 'Mixture and Alligation',
    module_name: 'Quantitative Aptitude',
    duration_minutes: 61,
    video_url: 'http://www.youtube.com/watch?v=OKSJDDAyqP0',
    video_title: 'Mixture and Alligation - Shortcuts & Tricks for 2026 Placement Tests, Job Interviews & Exams',
    short_description: 'Master the Rule of Alligation, multi-vessel ratio mixing, iterative removal and replacement formulas, dishonest milkman dilution, pulp invariance in drying fruit, and cross-application to speed and interest.',
    summary_markdown: `### 📌 1. The Rule of Alligation (Weighted Average Cross-Subtraction)
* When two ingredients (a **Cheaper** one at rate \`C\` and a **Dearer/Costlier** one at rate \`D\`) are mixed to produce a mixture with **Mean Rate \`M\`**:
  **\`(Quantity of Cheaper) / (Quantity of Dearer) = (D - M) / (M - C)\`**
* **Crucial Rules When Applying Alligation:**
  1. All three values (\`C\`, \`D\`, and \`M\`) **MUST be in the exact same units**! If the Selling Price (\`SP\`) of the mixture is given with a profit \`P%\`, first convert \`SP\` to **Cost Price \`M = SP / (1 + P/100)\`** before applying Alligation!
  2. **Denominator Unit Rule:** The ratio obtained at the bottom of the Alligation cross is always the ratio of the **denominator units** of the rates:
     * Alligation on **Price per kg (₹/kg)** $\\rightarrow$ gives ratio of **Weights (kg)**.
     * Alligation on **Speed (km/hr)** $\\rightarrow$ gives ratio of **Times (hours)** (NOT distances!).
     * Alligation on **Interest Rate (% per annum)** $\\rightarrow$ gives ratio of **Principal Amounts (₹)**.

### 💡 2. Iterative Removal & Replacement Formula
* Suppose a vessel holds **\`V\` liters** of pure liquid. If **\`x\` liters** are drawn out and replaced by water, and this operation is repeated **\`n\` times**:
  **\`(Pure Liquid Left) / (Total Volume V) = (1 - x / V)^n\`**
* **Variable Removal Amounts (\`x_1, x_2, x_3\`):**
  **\`Final Pure Liquid = V × (1 - x_1 / V) × (1 - x_2 / V) × (1 - x_3 / V)\`**

### 💡 3. Component Invariance & Dishonest Milkman Shortcuts
* **Component Invariance Principle:** When pure water is added to a mixture (or evaporated from fresh fruit to make dry fruit), **the absolute quantity of the other component (pure milk / solid fruit pulp) remains 100% unchanged!** Equate:
  \`Initial Total × (% of Invariant Component) = Final Total × (New % of Invariant Component)\`.
* **Dishonest Milkman Selling at Cost Price:** If a milkman claims to sell milk at Cost Price but adds water to gain \`G%\`, the ratio of **\`Water : Milk = G : 100\`**.`,
    questions: [
      {
        id: 'apt-mix-q1',
        questionNumber: 1,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q1: [Alligation with Profit Percentage] Two varieties of tea costing ₹320/kg and ₹440/kg are mixed and sold at ₹462/kg at a 10% profit. Find the mixing ratio.',
        question: 'A merchant mixes two varieties of Darjeeling tea costing ₹320 per kg and ₹440 per kg, and sells the resulting mixture at ₹462 per kg, thereby making a profit of 10%. In what ratio (cheaper to costlier) were the two varieties mixed?',
        options: [
          'A) 1 : 5',
          'B) 1 : 4',
          'C) 2 : 5',
          'D) 3 : 7'
        ],
        correctAnswer: 'A',
        explanation: '1) First convert the Selling Price of the mixture (₹462/kg at 10% profit) into its Cost Price (Mean Price M): M = 462 / 1.10 = ₹420/kg. 2) Apply Alligation between C = 320 and D = 440 with Mean M = 420: (Quantity of Cheaper) / (Quantity of Costlier) = (440 - 420) / (420 - 320) = 20 / 100 = 1 : 5.'
      },
      {
        id: 'apt-mix-q2',
        questionNumber: 2,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q2: [Repeated Replacement — Finding Initial Capacity] 12 L are drawn from a cask of wine and replaced with water 4 times in total. The final wine-to-water ratio is 16 : 65. Find the capacity of the cask.',
        question: 'From a cask completely full of pure wine, 12 liters are drawn out and replaced with water. This operation is performed 3 more times (4 times in total), after which the ratio of wine left in the cask to water becomes 16 : 65. What is the total capacity of the cask?',
        options: [
          'A) 30 liters',
          'B) 36 liters',
          'C) 48 liters',
          'D) 54 liters'
        ],
        correctAnswer: 'B',
        explanation: 'Total liquid in the cask = 16 + 65 = 81 parts, so the fraction of pure wine remaining after n = 4 operations is 16 / 81. Using the Repeated Replacement Formula: (1 - 12/V)^4 = 16 / 81 = (2/3)^4. Taking the 4th root on both sides gives 1 - 12/V = 2/3 => 12/V = 1/3 => V = 36 liters.'
      },
      {
        id: 'apt-mix-q3',
        questionNumber: 3,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q3: [Alligation on Two Vessels] Vessel A has acid:water = 4:9 and Vessel B has acid:water = 7:19. In what ratio should they be mixed to get acid:water = 11:28?',
        question: 'Vessel A contains a mixture of acid and water in the ratio 4 : 9, and Vessel B contains acid and water in the ratio 7 : 19. In what ratio should liquids from Vessel A and Vessel B be mixed to obtain a mixture with acid and water in the ratio 11 : 28?',
        options: [
          'A) 1 : 2',
          'B) 2 : 1',
          'C) 2 : 3',
          'D) 3 : 4'
        ],
        correctAnswer: 'A',
        explanation: 'Express the fraction of acid in each vessel: • Vessel A = 4 / (4 + 9) = 4/13. • Vessel B = 7 / (7 + 19) = 7/26. • Target Mixture = 11 / (11 + 28) = 11/39. Multiply all three fractions by their LCM denominator 78 to work with clean integers: A = (4/13)×78 = 24; B = (7/26)×78 = 21; Mean = (11/39)×78 = 22. By Alligation: Ratio A : B = (22 - 21) : (24 - 22) = 1 : 2.'
      },
      {
        id: 'apt-mix-q4',
        questionNumber: 4,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q4: [Multi-Vessel Mixing + Partial Replacement] Three honey-water solutions of 28 L (4:3), 21 L (2:1), and 51 L (9:8) are mixed, and then 20 L of the mixture is replaced with pure honey. Find the final honey:water ratio.',
        question: 'Three vessels of capacities 28 L, 21 L, and 51 L are completely filled with honey-water solutions having honey-to-water ratios of 4 : 3, 2 : 1, and 9 : 8 respectively. All three are poured into a single large drum, and then 20 L of the resulting mixture is drawn out and replaced with 20 L of pure honey. What is the final ratio of honey to water in the drum?',
        options: [
          'A) 613 : 387',
          'B) 82 : 43',
          'C) 78 : 47',
          'D) 85 : 43'
        ],
        correctAnswer: 'B',
        explanation: '1) Calculate honey and water in each vessel: • 28 L (4:3): 16 L honey, 12 L water. • 21 L (2:1): 14 L honey, 7 L water. • 51 L (9:8): 27 L honey, 24 L water. 2) Combined 100 L mixture: 16 + 14 + 27 = 57 L honey and 12 + 7 + 24 = 43 L water. 3) Removing 20 L (20% of 100 L) leaves 80% of each: 57 × 0.8 = 45.6 L honey and 43 × 0.8 = 34.4 L water. 4) Adding 20 L of pure honey brings honey to 45.6 + 20 = 65.6 L while water remains 34.4 L. Ratio = 65.6 : 34.4 = 656 : 344 = 82 : 43.'
      },
      {
        id: 'apt-mix-q5',
        questionNumber: 5,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q5: [Spill & Replacement Ratio Shift] A can has water:milk = 5:7. After 18 L of mixture spills and is replaced with 18 L of water, the ratio becomes 9:7. How much milk did the can originally hold?',
        question: 'A milkman had a water and milk mixture in a can with a water-to-milk ratio of 5 : 7. He accidentally spilled 18 liters of the mixture and then refilled the can with 18 liters of pure water. If the resulting water-to-milk ratio became 9 : 7, how many liters of milk did the can originally contain?',
        options: [
          'A) 35 liters',
          'B) 42 liters',
          'C) 49 liters',
          'D) 56 liters'
        ],
        correctAnswer: 'B',
        explanation: 'After 18 L of mixture is spilled, the remaining mixture in the can still has water:milk in the ratio 5 : 7. When 18 L of pure water is added, the milk quantity does not change and the ratio becomes 9 : 7. Notice that the milk part (7) is already identical in 5:7 and 9:7! Thus, the increase of 9 - 5 = 4 parts of water equals 18 L => 1 part = 4.5 L. The total capacity of the can (after refilling to the top) is 9 + 7 = 16 parts = 16 × 4.5 = 72 L. Therefore, the original quantity of milk in the 72 L can was (7 / 12) × 72 = 42 liters.'
      },
      {
        id: 'apt-mix-q6',
        questionNumber: 6,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q6: [Melting Three 3-Metal Alloys] Alloys A, B, and C contain copper:zinc:nickel in ratios 3:2:1, 4:5:3, and 7:6:5. If 12 kg of A, 24 kg of B, and 36 kg of C are melted together, find the final ratio.',
        question: 'Three alloys A, B, and C contain copper, zinc, and nickel in the ratios 3 : 2 : 1, 4 : 5 : 3, and 7 : 6 : 5 respectively. If 12 kg of alloy A, 24 kg of alloy B, and 36 kg of alloy C are melted together to form a new alloy, what is the ratio of copper, zinc, and nickel in the final alloy?',
        options: [
          'A) 14 : 13 : 9',
          'B) 14 : 12 : 9',
          'C) 15 : 13 : 8',
          'D) 28 : 25 : 19'
        ],
        correctAnswer: 'A',
        explanation: '1) In 12 kg of A (sum of parts = 6, multiplier = 2): Copper = 6 kg, Zinc = 4 kg, Nickel = 2 kg. 2) In 24 kg of B (sum of parts = 12, multiplier = 2): Copper = 8 kg, Zinc = 10 kg, Nickel = 6 kg. 3) In 36 kg of C (sum of parts = 18, multiplier = 2): Copper = 14 kg, Zinc = 12 kg, Nickel = 10 kg. 4) Total Copper : Zinc : Nickel = (6+8+14) : (4+10+12) : (2+6+10) = 28 : 26 : 18 = 14 : 13 : 9.'
      },
      {
        id: 'apt-mix-q7',
        questionNumber: 7,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q7: [Alligation on Speed, Time & Distance] A person travels 510 km in 9 hours, partly by car at 45 km/hr and partly by train at 65 km/hr. Find the distance traveled by train.',
        question: 'A commuter travels a total distance of 510 km in 9 hours, partly by car at 45 km/hr and the rest by train at 65 km/hr. What is the exact distance traveled by train?',
        options: [
          'A) 325.00 km',
          'B) 341.25 km',
          'C) 357.50 km',
          'D) 315.75 km'
        ],
        correctAnswer: 'B',
        explanation: '1) Overall average speed = 510 / 9 = 170/3 km/hr. 2) Apply Alligation on speeds (45 = 135/3 and 65 = 195/3 with mean 170/3) to find the ratio of TIMES: Time_Car : Time_Train = (195 - 170) : (170 - 135) = 25 : 35 = 5 : 7. 3) Out of 9 hours, Time_Train = (7 / 12) × 9 = 21/4 = 5.25 hours. 4) Distance traveled by train = 65 × (21/4) = 1365 / 4 = 341.25 km.'
      },
      {
        id: 'apt-mix-q8',
        questionNumber: 8,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q8: [Asymmetric Partial Replacement] A vessel holds 72 L of a mixture with 65% milk. How much mixture must be drawn off and replaced with HALF that amount of water so milk drops to 52%?',
        question: 'A vessel contains 72 liters of a milk-and-water mixture that is 65% milk. How many liters of the mixture must be drawn off and replaced with HALF that quantity of pure water so that the concentration of milk in the resulting mixture drops to 52%?',
        options: [
          'A) 18 liters',
          'B) 20 liters',
          'C) 24 liters',
          'D) 30 liters'
        ],
        correctAnswer: 'C',
        explanation: 'Let 2x liters of the mixture be drawn off and x liters of pure water be added back. After drawing off 2x liters, the remaining (72 - 2x) liters still contains 65% milk = 0.65(72 - 2x) liters of milk. Adding x liters of pure water changes the total volume to (72 - 2x + x) = (72 - x) liters with 52% milk: 0.65(72 - 2x) = 0.52(72 - x). Divide both sides by 0.13: 5(72 - 2x) = 4(72 - x) => 360 - 10x = 288 - 4x => 6x = 72 => x = 12. Thus, the mixture drawn off is 2x = 24 liters.'
      },
      {
        id: 'apt-mix-q9',
        questionNumber: 9,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q9: [Dishonest Milkman — Dilution + Price Markup] A milkman buys pure milk at ₹60/L, adds free water, and sells the mixture at ₹66/L to make a 37.5% profit. Find the water:milk ratio.',
        question: 'A dishonest milkman purchases pure milk at ₹60 per liter, adds a certain amount of free water to it, and sells the diluted mixture at ₹66 per liter. If his overall profit is 37.5%, what is the ratio of water to pure milk in his mixture?',
        options: [
          'A) 1 : 3',
          'B) 1 : 4',
          'C) 1 : 5',
          'D) 2 : 7'
        ],
        correctAnswer: 'B',
        explanation: '1) Since 37.5% = 3/8, Selling Price = (1 + 3/8) × CP = (11/8) × CP. Thus, the effective Cost Price of 1 liter of the mixture is 66 × (8/11) = ₹48/liter. 2) Apply Alligation between free Water (₹0/L) and Pure Milk (₹60/L) with mean ₹48/L: Water : Milk = (60 - 48) : (48 - 0) = 12 : 48 = 1 : 4.'
      },
      {
        id: 'apt-mix-q10',
        questionNumber: 10,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q10: [Alligation on Simple Interest] ₹1,35,000 is split into two parts lent at 8% p.a. and 12.5% p.a. simple interest. If the total interest in 2 years is ₹28,350, find the sum lent at 8%.',
        question: 'A sum of ₹1,35,000 is divided into two parts. One part is lent at 8% per annum and the other at 12.5% per annum simple interest. If the total simple interest earned at the end of 2 years is ₹28,350, how much money was lent at 8% per annum?',
        options: [
          'A) ₹54,000',
          'B) ₹60,000',
          'C) ₹75,000',
          'D) ₹67,500'
        ],
        correctAnswer: 'B',
        explanation: '1) Total interest for 1 year = 28,350 / 2 = ₹14,175. 2) Overall effective annual interest rate = (14,175 / 1,35,000) × 100 = 10.5%. 3) By Alligation between 8% and 12.5% with mean 10.5%: (Sum at 8%) / (Sum at 12.5%) = (12.5 - 10.5) / (10.5 - 8) = 2.0 / 2.5 = 4 : 5. 4) Sum lent at 8% = (4 / 9) × 1,35,000 = ₹60,000.'
      },
      {
        id: 'apt-mix-q11',
        questionNumber: 11,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q11: [Pulp Invariance in Drying Fruit] Fresh grapes contain 84% water, while dried raisins contain 20% water. How many kg of dried raisins can be obtained from 125 kg of fresh grapes?',
        question: 'Fresh grapes contain 84% water by weight, whereas dried raisins contain 20% water by weight. How many kilograms of dried raisins can be obtained from 125 kg of fresh grapes?',
        options: [
          'A) 20 kg',
          'B) 25 kg',
          'C) 30 kg',
          'D) 32 kg'
        ],
        correctAnswer: 'B',
        explanation: 'Only water evaporates; the solid fruit pulp weight remains constant! In 125 kg of fresh grapes (84% water), solid pulp is 16%. In W kg of dried raisins (20% water), solid pulp is 80%. Equating solid pulp weight: 16% of 125 = 80% of W => 16 × 125 = 80 × W => W = 2,000 / 80 = 25 kg.'
      },
      {
        id: 'apt-mix-q12',
        questionNumber: 12,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q12: [Simultaneous Two-Vessel Exchange to Equalize Concentration] Vessel A has 60 L of pure milk and Vessel B has 40 L of pure water. If x L are swapped simultaneously so both vessels have equal milk %, find x.',
        question: 'Vessel A contains 60 liters of pure milk, and Vessel B contains 40 liters of pure water. An equal quantity of x liters is drawn simultaneously from each vessel and poured into the other vessel. If the resulting percentage concentration of milk becomes identical in both vessels, what is the value of x?',
        options: [
          'A) 20 liters',
          'B) 24 liters',
          'C) 25 liters',
          'D) 30 liters'
        ],
        correctAnswer: 'B',
        explanation: 'After swapping x liters, Vessel A has (60 - x) liters of milk in 60 L total, and Vessel B has x liters of milk in 40 L total. Equating the milk concentrations in both vessels: (60 - x) / 60 = x / 40 => 2400 - 40x = 60x => 100x = 2400 => x = 24 liters. (Shortcut formula: x = (V_A × V_B) / (V_A + V_B) = (60 × 40) / 100 = 24 L).'
      },
      {
        id: 'apt-mix-q13',
        questionNumber: 13,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q13: [Iterative Replacement with Variable Quantities] From an 80 L tank of pure ethanol, 16 L, then 20 L, and then 24 L are successively drawn off and replaced with water. Find the remaining ethanol.',
        question: 'A tank contains 80 liters of pure ethanol. First, 16 liters of ethanol are drawn off and replaced with water. Second, 20 liters of the mixture are drawn off and replaced with water. Third, 24 liters of the mixture are drawn off and replaced with water. How many liters of pure ethanol remain in the tank at the end?',
        options: [
          'A) 28.8 liters',
          'B) 32.4 liters',
          'C) 33.6 liters',
          'D) 36.0 liters'
        ],
        correctAnswer: 'C',
        explanation: 'Multiply the initial volume (80 L) by the retention fraction at each step: Final Ethanol = 80 × (1 - 16/80) × (1 - 20/80) × (1 - 24/80) = 80 × (4/5) × (3/4) × (7/10) = 80 × (21/50) = 168 / 5 = 33.6 liters.'
      },
      {
        id: 'apt-mix-q14',
        questionNumber: 14,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q14: [Alligation on Bowling Averages] A bowler\'s average was 12.4 runs/wicket. Taking 5 wickets for 26 runs in his next match improves his average by 0.4. Find his wickets before the match.',
        question: 'A cricketer\'s bowling average was 12.4 runs per wicket. In his next match, he took 5 wickets for 26 runs, which improved (decreased) his overall bowling average by 0.4 runs per wicket. How many wickets had he taken BEFORE the last match?',
        options: [
          'A) 75',
          'B) 80',
          'C) 85',
          'D) 90'
        ],
        correctAnswer: 'C',
        explanation: '1) Previous average = 12.4; Last match average = 26 / 5 = 5.2 runs/wicket; New overall average = 12.4 - 0.4 = 12.0. 2) Apply Alligation between 12.4 and 5.2 with mean 12.0: (Previous Wickets) / (Last Match Wickets) = (12.0 - 5.2) / (12.4 - 12.0) = 6.8 / 0.4 = 17 : 1. 3) Since 1 part = 5 wickets in the last match, previous wickets = 17 × 5 = 85.'
      },
      {
        id: 'apt-mix-q15',
        questionNumber: 15,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q15: [Selling Mixture + Adding Equal Amounts of Both Components] A 160 L juice has 25% water. After selling 40 L, equal amounts of syrup and water are added, making water:syrup = 2:5. Find how much water was added.',
        question: 'A vendor had 160 liters of lemon juice containing 25% water and 75% lemon syrup. After selling 40 liters of the juice, he added equal quantities of pure lemon syrup and water to the remaining juice, changing the ratio of water to lemon syrup to 2 : 5. How many liters of water were added?',
        options: [
          'A) 8 liters',
          'B) 10 liters',
          'C) 12 liters',
          'D) 15 liters'
        ],
        correctAnswer: 'B',
        explanation: '1) After selling 40 L, the remaining 120 L still has 25% water (30 L) and 75% syrup (90 L). 2) Let x liters of water and x liters of syrup be added: (30 + x) / (90 + x) = 2 / 5 => 150 + 5x = 180 + 2x => 3x = 30 => x = 10 liters.'
      },
      {
        id: 'apt-mix-q16',
        questionNumber: 16,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q16: [Three-Variety Price Mixture with Profit] Three coffee varieties costing ₹240/kg, ₹300/kg, and ₹x/kg are mixed in ratio 3:2:5 and sold at ₹432/kg at 20% profit. Find x.',
        question: 'Three varieties of coffee beans costing ₹240/kg, ₹300/kg, and ₹x/kg are mixed in the ratio 3 : 2 : 5 respectively. If the resulting mixture is sold at ₹432/kg at a profit of 20%, what is the price per kg (₹x) of the third variety?',
        options: [
          'A) ₹420',
          'B) ₹444',
          'C) ₹456',
          'D) ₹480'
        ],
        correctAnswer: 'C',
        explanation: '1) First find the Cost Price of the mixture: CP = 432 / 1.20 = ₹360/kg. 2) Using the weighted average formula for 3 + 2 + 5 = 10 parts: 3(240) + 2(300) + 5x = 10(360) => 720 + 600 + 5x = 3600 => 5x = 2280 => x = ₹456/kg.'
      },
      {
        id: 'apt-mix-q17',
        questionNumber: 17,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q17: [Two-Stage Mixture Dilution] Solution P (40% alcohol) and Solution Q (70% alcohol) are mixed in ratio 2:3 to make 100 L. How much pure alcohol must be added to reach 75% alcohol?',
        question: 'Solution P (40% alcohol) and Solution Q (70% alcohol) are mixed in the ratio 2 : 3 by volume to form 100 liters of Mixture R. How many liters of pure (100%) alcohol must be added to Mixture R so that the final mixture contains 75% alcohol?',
        options: [
          'A) 56 liters',
          'B) 64 liters',
          'C) 68 liters',
          'D) 72 liters'
        ],
        correctAnswer: 'C',
        explanation: '1) Concentration of Mixture R (100 L): [2(40%) + 3(70%)] / 5 = 290% / 5 = 58% alcohol (58 L alcohol, 42 L water). 2) Since water (42 L) remains unchanged when pure alcohol is added, and water must become 100% - 75% = 25% (1/4) of the final mixture, the final total volume must be 42 × 4 = 168 L. 3) Pure alcohol added = 168 - 100 = 68 liters.'
      },
      {
        id: 'apt-mix-q18',
        questionNumber: 18,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Very Hard',
        title: 'Q18: [Specific Gravity Volume vs. Weight Trap] Gold is 19 times as heavy as water and copper is 9 times as heavy as water. To make an alloy 15 times as heavy as water, find the ratio by VOLUME and the ratio by WEIGHT.',
        question: 'Gold is 19 times as heavy as water, and copper is 9 times as heavy as water. If gold and copper are melted together to form an alloy that is 15 times as heavy as water, what are: (1) the ratio of Gold to Copper by VOLUME, and (2) the ratio of Gold to Copper by WEIGHT?',
        options: [
          'A) By Volume = 3 : 2 | By Weight = 19 : 6',
          'B) By Volume = 19 : 6 | By Weight = 3 : 2',
          'C) By Volume = 3 : 2 | By Weight = 3 : 2',
          'D) By Volume = 2 : 3 | By Weight = 38 : 27'
        ],
        correctAnswer: 'A',
        explanation: 'Specific gravity is Weight per unit VOLUME! 1) Therefore, applying Alligation on specific gravities (19 and 9 with mean 15) gives the ratio of VOLUMES: V_Gold : V_Copper = (15 - 9) : (19 - 15) = 6 : 4 = 3 : 2. 2) Since Weight = Volume × Density, the ratio by WEIGHT is: W_Gold : W_Copper = (3 × 19) : (2 × 9) = 57 : 18 = 19 : 6.'
      },
      {
        id: 'apt-mix-q19',
        questionNumber: 19,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q19: [Two-Step Back-and-Forth Vessel Transfer] A has 30 L alcohol and B has 30 L water. 10 L is moved from A to B, mixed, and 10 L is moved back from B to A. Find the ratio of water in A to alcohol in B.',
        question: 'Vessel A contains 30 liters of pure alcohol and Vessel B contains 30 liters of pure water. First, 10 liters of alcohol are poured from A into B and mixed thoroughly. Next, 10 liters of the resulting mixture are poured back from B into A. What is the ratio of the quantity of water in Vessel A to the quantity of alcohol in Vessel B at the end?',
        options: [
          'A) 3 : 4',
          'B) 4 : 3',
          'C) 1 : 1',
          'D) 2 : 3'
        ],
        correctAnswer: 'C',
        explanation: '1) After pouring 10 L alcohol from A into B: A has 20 L alcohol; B has 10 L alcohol + 30 L water = 40 L (ratio 1 : 3). 2) Pouring 10 L from B (1/4 of B) back into A transfers 2.5 L alcohol and 7.5 L water. 3) Final state: Vessel A has 7.5 L water (and 22.5 L alcohol), while Vessel B has 7.5 L alcohol (and 22.5 L water). Thus, the ratio is 7.5 : 7.5 = 1 : 1.'
      },
      {
        id: 'apt-mix-q20',
        questionNumber: 20,
        type: 'mcq',
        category: 'Quantitative Aptitude',
        difficulty: 'Hard',
        title: 'Q20: [Minimum Replacements Threshold] A 100 L tank of pure acid has 20 L drawn off and replaced by water in each step. Find the minimum steps needed for acid to drop strictly below 50%.',
        question: 'A container holds 100 liters of pure acid. In each operation, 20 liters of the liquid are drawn off and replaced with 20 liters of water. What is the MINIMUM number of operations required so that the quantity of pure acid remaining in the container drops strictly below 50 liters?',
        options: [
          'A) 3',
          'B) 4',
          'C) 5',
          'D) 6'
        ],
        correctAnswer: 'B',
        explanation: 'Each operation multiplies the remaining acid by (1 - 20/100) = 0.8. We need 100 × (0.8)^n < 50 => (0.8)^n < 0.5: • n = 1: 0.800 (80 L) • n = 2: 0.640 (64 L) • n = 3: 0.512 (51.2 L ≥ 50 L) • n = 4: 0.4096 (40.96 L < 50 L). Thus, a minimum of 4 operations is required.'
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

async function seedAptitudeBatch2() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('=== SEEDING APTITUDE BATCH 2 (TOPICS 4 TO 6) ===\n');

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

    // 2. Upsert Topics 4 to 6
    for (const item of aptitudeBatch2) {
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
      await client.query(`UPDATE tracks SET total_topics = 6, estimated_hours = 12 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 6, estimated_hours = 12');
    } else if (availableCols.includes('total_topics')) {
      await client.query(`UPDATE tracks SET total_topics = 6 WHERE id = $1;`, [aptitudeTrackId]);
      console.log('Updated tracks metadata: total_topics = 6');
    }

    await client.query('COMMIT');
    console.log('\n🎉 Aptitude Track Batch 2 (Topics 4 to 6) Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedAptitudeBatch2();
