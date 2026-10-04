const pool = require("../config/db");

const seedDsaBatch1 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 1 (Lectures 1–10) Seeding (Zero LaTeX / Beginner-Friendly)...");

  // 1. Upgrade schema if not already present
  await pool.query(`
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS subtrack VARCHAR(150);
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS summary_markdown TEXT;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS theory_summary TEXT;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS doc_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS video_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS practice_items JSONB DEFAULT '[]'::jsonb;
  `);
  console.log("✅ Verified topics schema: subtrack, summary_markdown, theory_summary, practice_items, video_links, doc_links");

  // 2. Ensure target track "Problem Solving: DSA & SQL" exists
  const trackSlug = "problem-solving-dsa-sql";
  let trackRes = await pool.query(
    "SELECT id, name, slug FROM tracks WHERE slug = $1 LIMIT 1",
    [trackSlug]
  );

  let trackId;
  if (trackRes.rows.length === 0) {
    const insertTrack = await pool.query(
      `INSERT INTO tracks (name, slug, description, evaluation_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id;`,
      [
        "Problem Solving: DSA & SQL",
        trackSlug,
        "Algorithmic data structures, problem-solving patterns, and advanced relational query optimization.",
        "practice",
      ]
    );
    trackId = insertTrack.rows[0].id;
    console.log(`✅ Created track 'Problem Solving: DSA & SQL' (ID: ${trackId})`);
  } else {
    trackId = trackRes.rows[0].id;
    console.log(`✅ Found existing track 'Problem Solving: DSA & SQL' (ID: ${trackId})`);
  }

  // 3. Define the 10 Expressive Batch 1 Topics (Zero LaTeX / Clean Overviews)
  const batch1Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 1: Algorithmic Foundations & Environment
    // =========================================================================
    {
      name: "Algorithmic Problem-Solving Methodology & Curriculum Blueprint",
      slug: "algorithmic-problem-solving-methodology",
      subtrack: "Module 1: Algorithmic Foundations & Environment",
      description: "Master the active problem-solving framework, brute-force-to-optimal progression, language-agnostic logic, and contest strategy.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 1: How to use this 455-Lecture DSA Sheet & Problem-Solving Strategy",
          url: "https://www.youtube.com/watch?v=0bHoB32fuj0",
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "Striver's A2Z DSA Course Blueprint",
          url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
        },
        {
          title: "GeeksforGeeks: How to Begin Competitive Programming",
          url: "https://www.geeksforgeeks.org/how-to-start-with-competitive-programming-in-2024/",
        },
      ],
      practiceItems: [
        {
          title: "Running Sum of 1d Array",
          problemId: "1480",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/running-sum-of-1d-array/",
          description: "Compute prefix sums sequentially to build intuition for running state transformation.",
        },
        {
          title: "Concatenation of Array",
          problemId: "1929",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/concatenation-of-array/",
          description: "Construct contiguous repetition of an array testing memory bounds and basic indexing.",
        },
        {
          title: "Largest Element in Array",
          problemId: "gfg-largest-elem",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1",
          description: "Perform single-pass linear traversal with state comparison to identify peak value.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Learning Data Structures and Algorithms (DSA) is about building problem-solving habits rather than memorizing theory. This introductory guide explains how to approach the curriculum step by step, move from beginner to advanced problems, and build consistency for placement coding rounds.

### 💡 Key Takeaways
- **Practice Over Theory:** Watch the concept explanation briefly, then spend most of your energy actually writing and submitting code.
- **Start With Brute Force:** Always code the simplest working idea that comes to your mind first—even if it is slow—before trying to optimize it.
- **Learn in Pseudocode:** Focus on the core logic of the algorithm. Once you understand the steps, you can easily write it in C++, Java, Python, or JavaScript.
- **Keep Short Revision Notes:** Whenever you learn a new trick or pattern, jot down a quick summary in your own words so you can revise it before interviews.
- **Give Weekly Contests:** Start participating in coding contests early—even if you can only solve 1 question at first—to get comfortable solving unseen problems under a timer.

### ⚠️ Common Mistakes to Avoid
- **Don't Get Stuck in Tutorial Hell:** Watching videos without coding the problems yourself builds false confidence.
- **Don't Memorize Solutions:** Focus on why an approach works so you can apply the same idea to different questions.`,
    },

    {
      name: "Local Competitive Programming Environment & Automated I/O Redirection",
      slug: "competitive-programming-environment-io-redirection",
      subtrack: "Module 1: Algorithmic Foundations & Environment",
      description: "Configure VS Code with split-screen layout, automated compilation via tasks.json, and stream redirection via input.txt and output.txt.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 2: Setting up C++ / Java Environment for Competitive Programming & VS Code",
          url: "https://www.youtube.com/watch?v=h3uDCJ5mvgw",
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "VS Code C++ Programming & Build Tasks",
          url: "https://code.visualstudio.com/docs/languages/cpp",
        },
        {
          title: "Competitive Programmer's Handbook (Antti Laaksonen)",
          url: "https://cses.fi/book/book.pdf",
        },
      ],
      practiceItems: [
        {
          title: "Build Array from Permutation",
          problemId: "1920",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/build-array-from-permutation/",
          description: "Zero-based indexing permutation array construction testing clean local I/O validation.",
        },
        {
          title: "Greatest of Three Numbers",
          problemId: "gfg-greatest-3",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/greatest-of-three-numbers2520/1",
          description: "Test basic conditional branches and stream redirection without interactive terminal prompts.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Setting up a clean local coding workspace saves time when testing and debugging your programs. This lecture walks through configuring VS Code with a split-screen layout where your code automatically reads test inputs from an \`input.txt\` file and prints results to an \`output.txt\` file with a single shortcut.

### 💡 Key Takeaways
- **3-Pane Workspace Layout:** Keep your main code file (\`demo.cpp\` or \`demo.java\`) on the left, \`input.txt\` on the top-right, and \`output.txt\` on the bottom-right.
- **One-Click Build & Run:** Configure \`.vscode/tasks.json\` so pressing \`Ctrl + Shift + B\` (or \`Cmd + Shift + B\` on Mac) compiles your program and writes the output automatically.
- **Faster Debugging:** Using text files for input means you don't have to manually type long test cases into the terminal every time you re-run your code.
- **Balance DSA with Projects:** Alongside daily DSA practice, consistently build real development projects to make your resume stand out during placements.

### ⚠️ Common Mistakes to Avoid
- **Folder Mismatch:** Remember that \`.vscode/tasks.json\` lives inside the specific folder you opened. If you switch to a new workspace folder, copy the \`.vscode\` folder over.
- **Infinite Loops Freeze Output:** If your program has an infinite loop, \`output.txt\` may keep filling up until the task is stopped.`,
    },

    {
      name: "Core Programming Constructs: Data Types, Control Flow & Memory Passing",
      slug: "programming-constructs-data-types-memory-passing",
      subtrack: "Module 1: Algorithmic Foundations & Environment",
      description: "Primitive ranges (int vs long long), control flow with if-else and switch, loops, arrays, and pass-by-value vs pass-by-reference.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 3: C++ Basics — User Input/Output, Data Types, If-Else, Loops, Functions & Arrays",
          url: "https://www.youtube.com/watch?v=EAR7De6Goz4",
          duration: "45m",
        },
      ],
      docLinks: [
        {
          title: "cppreference: Fundamental Types and Integer Ranges",
          url: "https://en.cppreference.com/w/cpp/language/types",
        },
        {
          title: "GeeksforGeeks: Pass By Value vs Pass By Reference in C++",
          url: "https://www.geeksforgeeks.org/pass-by-value-vs-pass-by-reference-in-cpp/",
        },
      ],
      practiceItems: [
        {
          title: "Richest Customer Wealth",
          problemId: "1672",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/richest-customer-wealth/",
          description: "2D grid traversal computing row-wise sums testing multidimensional indexing and accumulator types.",
        },
        {
          title: "Step by Step Condition",
          problemId: "gfg-step-cond",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/step-by-step-condition/1",
          description: "Practice cleanly structured if-else ladder evaluation without redundant boolean clauses.",
        },
        {
          title: "The Else if Statement",
          problemId: "gfg-else-if",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/the-else-if-statement/1",
          description: "Evaluate multi-branch conditional flows with strict boundary guarantees.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Before diving into data structures, you need a solid grip on the building blocks of your programming language. This lecture covers standard input/output, choosing the right data types, writing clean \`if-else\` conditions and loops, working with arrays and strings, and understanding how functions pass data in memory.

### 💡 Key Takeaways
- **Choosing Data Types Safely:**
  - \`int\`: Stores whole numbers up to roughly 10^9 (1 billion).
  - \`long long\`: Stores large whole numbers up to roughly 10^18—use this whenever multiplication or large sums might overflow \`int\`.
  - \`float\` / \`double\`: Used for decimal numbers.
  - \`string\` & \`getline\`: \`cin >> s\` stops reading at spaces, whereas \`getline(cin, s)\` reads an entire line of text.
- **Control Flow (\`if-else\` & \`switch\`):** Use \`else if\` chains instead of separate \`if\` statements so the program stops checking once a match is found.
- **1D & 2D Arrays:** Arrays store elements of the same type in consecutive memory slots starting at index \`0\`.
- **Loops (\`for\`, \`while\`, \`do-while\`):** Use loops to repeat actions cleanly. A \`do-while\` loop is guaranteed to run at least once even if the condition is false initially.
- **Pass by Value vs. Pass by Reference:**
  - **Pass by Value (\`void func(int x)\`):** Sends a copy of the variable. Changes inside the function do not affect the original variable.
  - **Pass by Reference (\`void func(int &x)\`):** Sends the actual variable using \`&\`. Changes inside the function directly update the original variable. (Note: C++ arrays are always passed by reference automatically).

### 💻 Quick Syntax Example
\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

void addFiveByValue(int a) {
    a = a + 5; // Only modifies the local copy
}

void addFiveByRef(int &b) {
    b = b + 5; // Modifies the original variable
}

int main() {
    int x = 10, y = 10;
    addFiveByValue(x);
    addFiveByRef(y);
    cout << x << " " << y << "\n"; // Prints: 10 15
    return 0;
}
\`\`\``,
    },

    {
      name: "Asymptotic Analysis: Big-O Time & Auxiliary Space Complexity",
      slug: "asymptotic-analysis-big-o-space-complexity",
      subtrack: "Module 1: Algorithmic Foundations & Environment",
      description: "Understand Big-O notation, the 3 rules of complexity analysis, input vs auxiliary space, and the 10^8 operations per second rule.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 4: Time and Space Complexity — Big O, Omega, Theta, Worst Case & Best Case",
          url: "https://www.youtube.com/watch?v=FPu9Uld7W-E",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "MIT OpenCourseWare: Introduction to Algorithms — Asymptotic Complexity",
          url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-1-algorithmic-thinking-peak-finding/",
        },
        {
          title: "GeeksforGeeks: Analysis of Algorithms | Big-O Notation",
          url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/",
        },
      ],
      practiceItems: [
        {
          title: "Number of Good Pairs",
          problemId: "1512",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/number-of-good-pairs/",
          description: "Compare the O(N²) pairwise brute force against the optimal O(N) frequency counting method.",
        },
        {
          title: "Kids With the Greatest Number of Candies",
          problemId: "1431",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/",
          description: "Analyze O(N) linear scan bounds checking against peak element reference.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
How do interviewers judge whether your code is fast and efficient? Since different computers run at different speeds, we don't measure code in seconds. Instead, we use **Time Complexity** (how the number of steps grows as input size \`N\` grows) and **Space Complexity** (how much extra memory your code uses).

### 💡 Key Takeaways
- **What is Time Complexity?** It measures the rate at which the number of operations increases as the input size \`N\` gets larger, written using **Big-O Notation** (\`O(...)\`).
- **The 3 Simple Rules of Big-O:**
  1. **Always Calculate for the Worst Case:** Plan for the toughest input your program might face.
  2. **Ignore Constants:** \`O(3N)\` or \`O(N / 2)\` is simply written as \`O(N)\`.
  3. **Drop Smaller Terms:** In \`O(N² + N + 5)\`, when \`N\` is large, \`N²\` dominates everything else, so we write \`O(N²)\`.
- **Space Complexity = Input Space + Auxiliary Space:**
  - *Input Space:* Memory used to store the given problem inputs.
  - *Auxiliary Space:* Extra variables or arrays you create to solve the problem.
- **The 1-Second Online Judge Rule:** Coding platforms (like LeetCode and GFG) execute roughly **10^8 (100 million) operations per second**. If \`N = 10^5\`, an \`O(N²)\` solution takes \`10^10\` steps (which causes **Time Limit Exceeded / TLE**), so you need an \`O(N)\` or \`O(N log N)\` approach.

### 💻 Common Loop Complexities
\`\`\`cpp
// 1. Single Loop -> O(N) Time
for (int i = 0; i < n; i++) {
    // Runs N times
}

// 2. Nested Loop -> O(N²) Time
for (int i = 0; i < n; i++) {
    for (int j = 0; j <= i; j++) {
        // Runs 1 + 2 + 3 + ... + N = N*(N+1)/2 times -> O(N²)
    }
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 2: Nested Loop Mechanics & Coordinate Patterns
    // =========================================================================
    {
      name: "2D Grid & Nested Loop Mastery: Symmetry, Space-Star Formulas & Distance Matrices",
      slug: "grid-nested-loop-patterns-symmetry-distance",
      subtrack: "Module 2: Nested Loop Mechanics & Coordinate Patterns",
      description: "Master the 4-step coordinate rule for patterns: row counts, column formulas, symmetry breakpoints, and pyramid space-star breakdowns.",
      estimatedMinutes: 60,
      videoLinks: [
        {
          title: "Lecture 5: Master Nested Loops & Pattern Problems in C++ (22 Patterns Blueprint)",
          url: "https://www.youtube.com/watch?v=tNm_NNSB3_w",
          duration: "55m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Must Do Pattern Problems",
          url: "https://takeuforward.org/strivers-a2z-dsa-course/must-do-pattern-problems-using-c/",
        },
        {
          title: "GeeksforGeeks: Programs for Printing Pyramid Patterns in C++",
          url: "https://www.geeksforgeeks.org/programs-for-printing-pyramid-patterns-in-cpp/",
        },
      ],
      practiceItems: [
        {
          title: "Pascal's Triangle",
          problemId: "118",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/pascals-triangle/",
          description: "Generate 2D coordinate grid where each cell is computed from the sum of adjacent cells directly above.",
        },
        {
          title: "Inverted Triangle of Stars",
          problemId: "gfg-inv-tri",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/inverted-triangle-of-stars0110/1",
          description: "Formulate spaces and star counts as decreasing mathematical functions of current row index i.",
        },
        {
          title: "Half Diamond Star Pattern",
          problemId: "gfg-half-diamond",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/triangle-pattern-1661718013/1",
          description: "Implement horizontal symmetry inversion breakpoint at row index N.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Solving star and number pattern problems is the best way to master nested \`for\` loops. Almost every matrix, grid, and dynamic programming problem uses the same row-and-column loop logic practiced here.

### 💡 Key Takeaways
- **The 4-Step Rule for Any Pattern:**
  1. **Count the Total Rows:** Set your outer loop (\`i\`) to run for the total number of lines.
  2. **Relate Columns to the Current Row:** Figure out how many items are printed in row \`i\` and set that as your inner loop (\`j\`) condition.
  3. **Print Inside the Inner Loop:** Print the character or number inside the \`j\` loop, then print a newline (\`\\n\`) right after the \`j\` loop finishes.
  4. **Spot Symmetry:** If a pattern grows and then shrinks (like a diamond), split the logic at the middle row (\`N\`) and reverse the formula for the bottom half.
- **Splitting Rows into \`[Spaces + Stars + Spaces]\`:** For pyramid patterns, use separate inner loops inside the same row: first print \`(N - i - 1)\` spaces, then print \`(2*i + 1)\` stars.
- **Character Patterns:** Characters can be incremented just like numbers using ASCII values (for example, \`'A' + 1\` gives \`'B'\`, and \`'A' + 2\` gives \`'C'\`).

### 💻 Pyramid Pattern Blueprint
\`\`\`cpp
void printPyramid(int n) {
    for (int i = 0; i < n; i++) {
        // 1. Leading spaces: n - i - 1
        for (int j = 0; j < n - i - 1; j++) cout << " ";
        // 2. Stars: 2*i + 1
        for (int j = 0; j < 2 * i + 1; j++) cout << "*";
        // 3. Newline after finishing the row
        cout << "\n";
    }
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 3: Module 3: Standard Template Library (STL) & Containers
    // =========================================================================
    {
      name: "C++ STL Architecture: Dynamic Containers, Iterators, Hashing & Custom Comparators",
      slug: "cpp-stl-containers-iterators-comparators",
      subtrack: "Module 3: Standard Template Library (STL) & Containers",
      description: "Master std::vector, pair, stack, queue, priority_queue, set, unordered_map, and built-in sorting algorithms.",
      estimatedMinutes: 65,
      videoLinks: [
        {
          title: "Lecture 6: C++ STL Full Course — Vectors, Pairs, Stacks, Queues, Sets, Maps & Algorithms",
          url: "https://www.youtube.com/watch?v=RRVYpIET_RU",
          duration: "1h 15m",
        },
      ],
      docLinks: [
        {
          title: "cppreference: C++ Standard Library Containers",
          url: "https://en.cppreference.com/w/cpp/container",
        },
        {
          title: "TakeUForward: C++ STL Complete Cheat Sheet",
          url: "https://takeuforward.org/c/c-stl-tutorial-most-frequent-used-stl-containers/",
        },
      ],
      practiceItems: [
        {
          title: "Jewels and Stones",
          problemId: "771",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/jewels-and-stones/",
          description: "Use std::unordered_set to perform constant time O(1) character membership queries.",
        },
        {
          title: "C++ STL | Set 2 (pair)",
          problemId: "gfg-stl-pair",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/c-stl-set-2-pair/1",
          description: "Instantiate, compare, and unpack std::pair containers across structured coordinate pairs.",
        },
        {
          title: "C++ STL | Set 1 (vector)",
          problemId: "gfg-stl-vector",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/c-stl-set-1-vector/1",
          description: "Execute dynamic capacity operations: push_back, pop_back, sort, and iterator traversals.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The C++ Standard Template Library (STL) gives you ready-to-use data structures (like dynamic arrays, stacks, queues, sets, and hash maps) and built-in algorithms (like sorting and binary search) so you don't have to code them from scratch during interviews.

### 💡 Key Takeaways
- **Sequence Containers:**
  - \`pair<int, int>\`: Groups two values together (\`p.first\` and \`p.second\`).
  - \`vector<int>\`: A dynamic array that grows automatically via \`push_back()\`.
  - \`list<int>\` & \`deque<int>\`: Allow fast insertions at both the front (\`push_front()\`) and back (\`push_back()\`).
- **Adapter Containers:**
  - \`stack<int>\`: **LIFO** (Last-In, First-Out) using \`push()\`, \`pop()\`, and \`top()\` in \`O(1)\` time.
  - \`queue<int>\`: **FIFO** (First-In, First-Out) using \`push()\`, \`pop()\`, and \`front()\` in \`O(1)\` time.
  - \`priority_queue<int>\`: Keeps the largest element on top by default (**Max-Heap**). Push and pop take \`O(log N)\` time.
- **Set & Map Containers:**
  - \`set<int>\` vs \`unordered_set<int>\`: Both store **unique** elements only. \`set\` keeps them sorted in \`O(log N)\` time; \`unordered_set\` is unsorted but faster at \`O(1)\` average time.
  - \`map<K, V>\` vs \`unordered_map<K, V>\`: Store **key-value pairs** with unique keys. \`map\` is sorted by key (\`O(log N)\`); \`unordered_map\` is hash-based (\`O(1)\` average).
- **Essential Built-in Algorithms:**
  - \`sort(v.begin(), v.end())\`: Sorts in \`O(N log N)\` time. You can pass a custom \`bool comp(a, b)\` function to sort in your own order.
  - \`*max_element(v.begin(), v.end())\`: Finds the maximum value in a vector or array.

### 💻 Quick STL Cheat Sheet
\`\`\`cpp
vector<int> nums = {5, 1, 4, 2};
sort(nums.begin(), nums.end()); // Sorts to: {1, 2, 4, 5}

unordered_map<int, int> freq;
for (int x : nums) {
    freq[x]++; // Counts frequency of each number in O(1) average time
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 4: Module 4: Number Theory & Mathematical Foundations
    // =========================================================================
    {
      name: "Number Theory Essentials: Digit Extraction, Sqrt(N) Factorization & Euclidean GCD",
      slug: "number-theory-digit-extraction-sqrt-euclidean-gcd",
      subtrack: "Module 4: Number Theory & Mathematical Foundations",
      description: "Master digit extraction via modulo division, number reversal, O(sqrt(N)) paired divisor counting, and the Euclidean GCD algorithm.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 7: Basic Math for DSA — Count Digits, Reverse Number, Palindrome, GCD, Divisors, Prime",
          url: "https://www.youtube.com/watch?v=1xNbjMdbjug",
          duration: "40m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Basic Maths for DSA Series",
          url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/#basic-maths",
        },
        {
          title: "Khan Academy: The Euclidean Algorithm for Greatest Common Divisor",
          url: "https://www.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/the-euclidean-algorithm",
        },
      ],
      practiceItems: [
        {
          title: "Subtract the Product and Sum of Digits of an Integer",
          problemId: "1281",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/",
          description: "Extract digits via modulo-10 division while maintaining dual running product and sum accumulators.",
        },
        {
          title: "Find Greatest Common Divisor of Array",
          problemId: "1979",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/find-greatest-common-divisor-of-array/",
          description: "Find extremal elements in O(N) and compute their GCD using the Euclidean algorithm.",
        },
        {
          title: "Three Divisors",
          problemId: "1952",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/three-divisors/",
          description: "Leverage sqrt(N) factor pairing: a number has exactly 3 divisors iff it is the square of a prime.",
        },
        {
          title: "Number of Factors",
          problemId: "gfg-num-factors",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/number-of-factors1435/1",
          description: "Enumerate all paired divisors i and n/i up to sqrt(N) guarding against perfect square duplicates.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Many coding problems revolve around breaking numbers into digits, finding factors, checking if a number is prime, or finding the Greatest Common Divisor (GCD). This lecture covers the essential math tricks that turn slow \`O(N)\` loops into fast \`O(log N)\` and \`O(sqrt(N))\` solutions.

### 💡 Key Takeaways
- **Extracting Digits (\`% 10\` and \`/ 10\`):**
  - \`n % 10\` gives you the **last digit** of \`n\`.
  - \`n = n / 10\` removes the last digit. Repeating this in a loop processes all digits in \`O(log10(N))\` steps.
- **Reversing a Number & Palindromes:** Build the reversed number step by step using \`rev = (rev * 10) + lastDigit\`. A number is a palindrome if its reverse equals the original number.
- **Finding Divisors & Checking Primes in \`O(sqrt(N))\`:**
  - Divisors always come in pairs: if \`i\` divides \`n\`, then \`n / i\` also divides \`n\`.
  - You only need to loop from \`i = 1\` while \`i * i <= n\`.
  - A **Prime Number** is a number greater than 1 that has **exactly two factors** (1 and itself).
- **Euclidean Algorithm for GCD:** Instead of looping to find the greatest common factor of \`a\` and \`b\`, repeatedly take \`a = a % b\` (or \`b = b % a\`) until one number becomes \`0\`. The remaining non-zero number is the GCD!

### 💻 Fast Prime Check & Euclidean GCD
\`\`\`cpp
// Euclidean GCD in logarithmic time
int findGCD(int a, int b) {
    while (a > 0 && b > 0) {
        if (a > b) a = a % b;
        else b = b % a;
    }
    return (a == 0) ? b : a;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 5: Module 5: Recursion & Call Stack Mechanics
    // =========================================================================
    {
      name: "Recursion Mechanics: Call Stack Frames, Base Conditions & Recursion Trees",
      slug: "recursion-call-stack-frames-base-conditions",
      subtrack: "Module 5: Recursion & Call Stack Mechanics",
      description: "Understand activation records on the call stack, stack overflow prevention, base conditions, and drawing recursion trees.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 8: Introduction to Recursion — Call Stack, Stack Overflow & Base Condition",
          url: "https://www.youtube.com/watch?v=yVdKa8dnKiE",
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "GeeksforGeeks: Understanding Recursion and Call Stack with Diagrams",
          url: "https://www.geeksforgeeks.org/recursion/",
        },
        {
          title: "Stanford CS: Recursion and Backtracking Lecture Notes",
          url: "https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1206/lectures/recursion/",
        },
      ],
      practiceItems: [
        {
          title: "Power of Two",
          problemId: "231",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/power-of-two/",
          description: "Decompose problem into recursive division by 2 with strict base condition checks.",
        },
        {
          title: "Power of Three",
          problemId: "326",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/power-of-three/",
          description: "Verify recursive divisibility and termination boundary conditions without iterative loops.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
**Recursion** happens when a function calls itself to solve a smaller version of the same problem. Understanding how recursive calls pause, wait in memory, and return back is the foundation for trees, graphs, backtracking, and dynamic programming.

### 💡 Key Takeaways
- **What is a Base Condition?** Every recursive function must have a stopping rule (base case) at the top. When the base condition is met, the function returns instead of calling itself again.
- **How the Call Stack Works:** When function \`A\` calls another copy of itself, the first call pauses and waits inside the computer's **Call Stack**. Once the deepest call hits the base case and returns, the waiting functions finish one by one in reverse order.
- **Stack Overflow Error:** If you forget to write a base condition (or write one that is never reached), the function keeps calling itself endlessly until the call stack runs out of memory and crashes.
- **Drawing a Recursion Tree:** Instead of tracing entire blocks of code in your head, draw a simple diagram showing \`f(0) → f(1) → f(2) → f(3)\` to visualize how parameters change at each step.

### 💻 Basic Recursive Blueprint
\`\`\`cpp
void printCount(int count) {
    if (count == 3) return; // Base condition stops recursion

    cout << count << " ";
    printCount(count + 1);  // Recursive call with updated state
}
\`\`\``,
    },

    {
      name: "Linear Recursion vs. Backtracking: Pre-Call Execution & Post-Call Stack Unwinding",
      slug: "linear-recursion-backtracking-unwinding",
      subtrack: "Module 5: Recursion & Call Stack Mechanics",
      description: "Master parameter state propagation, pre-call forward execution vs post-call backtracking on stack unwinding.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 9: Problems on Recursion — Print 1 to N, N to 1, and Backtracking Execution Order",
          url: "https://www.youtube.com/watch?v=un6PLygfXrA",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "GeeksforGeeks: Backtracking Algorithms Introduction",
          url: "https://www.geeksforgeeks.org/backtracking-algorithms/",
        },
        {
          title: "TakeUForward: Recursion and Backtracking Playlist Guide",
          url: "https://takeuforward.org/recursion/introduction-to-recursion-understand-recursion-by-printing-something-n-times/",
        },
      ],
      practiceItems: [
        {
          title: "Print Pattern (Recursive Decrease & Increase Without Loop)",
          problemId: "gfg-print-pattern",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/print-pattern3549/1",
          description: "Execute pre-call subtraction followed by post-call unwinding addition without any iterative loops.",
        },
        {
          title: "Power of Four",
          problemId: "342",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/power-of-four/",
          description: "Verify recursive base cases with single-branch reduction testing call stack state integrity.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Where you place your code inside a recursive function completely changes the order in which things happen. This lecture shows the difference between doing work **before** the recursive call (going down the tree) versus doing work **after** the recursive call returns (**Backtracking**).

### 💡 Key Takeaways
- **Passing State Through Parameters:** Instead of using global variables, pass counters directly as function parameters like \`solve(i, n)\`.
- **Pre-Call Execution (Top-Down):** If you place \`cout << i\` *before* calling \`solve(i + 1, n)\`, the numbers print immediately as the calls go deeper (\`1, 2, 3...\`).
- **Post-Call Execution / Backtracking (Bottom-Up):** If you place \`cout << i\` *after* the recursive call \`solve(i - 1, n)\`, the print line waits until the smaller call finishes! This lets you start at \`i = N\`, recurse down to \`1\`, and print \`1, 2, 3... N\` on the way back up.
- **Time & Space Complexity:** Calling a function \`N\` times takes \`O(N)\` time and \`O(N)\` auxiliary stack space (since \`N\` function calls wait on the call stack).

### 💻 Pre-Call vs. Backtracking Order
\`\`\`cpp
// Prints 1 to N using Backtracking (without using i + 1)
void printOneToN(int i) {
    if (i < 1) return;

    printOneToN(i - 1); // First go all the way down to 1
    cout << i << " ";   // Prints on the way back up: 1 2 3 ... N
}
\`\`\``,
    },

    {
      name: "Parameterized Accumulators vs. Functional Recurrence Relations",
      slug: "parameterized-vs-functional-recursion-recurrence",
      subtrack: "Module 5: Recursion & Call Stack Mechanics",
      description: "Master parameter-carried state vs value-returning functional recursion, laying the foundation for recurrence relations.",
      estimatedMinutes: 55,
      videoLinks: [
        {
          title: "Lecture 10: Parameterised and Functional Recursion — Sum of First N Numbers & Factorial",
          url: "https://www.youtube.com/watch?v=69ZCDFy-OUo",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Parameterised and Functional Recursion Deep Dive",
          url: "https://takeuforward.org/data-structure/sum-of-first-n-natural-numbers/",
        },
        {
          title: "MIT OpenCourseWare: Recurrence Relations and Dynamic Programming",
          url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-19-dynamic-programming-i-fibonacci-shortest-paths/",
        },
      ],
      practiceItems: [
        {
          title: "Fibonacci Number",
          problemId: "509",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/fibonacci-number/",
          description: "Model mathematical functional recurrence f(n) = f(n-1) + f(n-2) with dual base cases.",
        },
        {
          title: "Add Digits",
          problemId: "258",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/add-digits/",
          description: "Implement functional recursive digital root aggregation until a single digit remains.",
        },
        {
          title: "Factorials of Large Numbers",
          problemId: "gfg-fact-large",
          platform: "GeeksforGeeks",
          difficulty: "Medium",
          url: "https://www.geeksforgeeks.org/problems/factorials-of-large-numbers2508/1",
          description: "Bridge functional recurrence with array-based multiplication to prevent 64-bit integer overflow.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
When solving a problem recursively (like finding the sum or factorial of \`1\` to \`N\`), there are two ways to get the answer: carry the running answer inside a parameter (**Parameterized Recursion**) or have the function return the answer directly (**Functional Recursion**).

### 💡 Key Takeaways
- **1. Parameterized Recursion (\`void\` function):**
  - You pass an extra variable (like \`sum\`) into the function parameters: \`solve(i - 1, sum + i)\`.
  - Once you hit the base case (\`i < 1\`), \`sum\` holds the final answer and you print it.
- **2. Functional Recursion (Return-based function):**
  - Instead of printing inside the base case, the function **returns** the result of smaller subproblems: \`return n + sum(n - 1)\`.
  - For example, \`sum(3)\` returns \`3 + sum(2)\`, which returns \`2 + sum(1)\`, building the final result cleanly.
  - **Why Functional Matters:** Functional recursion is the exact pattern you will use later in Trees and Dynamic Programming!

### 💻 Parameterized vs. Functional Examples
\`\`\`cpp
// 1. Functional Sum of First N Numbers
int sumN(int n) {
    if (n == 0) return 0;      // Base case for addition is 0
    return n + sumN(n - 1);
}

// 2. Functional Factorial of N (1 * 2 * ... * N)
int factorial(int n) {
    if (n == 0) return 1;      // Base case for multiplication must be 1!
    return n * factorial(n - 1);
}
\`\`\``,
    },
  ];

  // 4. Upsert topics in database
  const topicIdMap = new Map();

  for (const topic of batch1Topics) {
    const res = await pool.query(
      `INSERT INTO topics (
        name, slug, description, subtrack, 
        summary_markdown, theory_summary, 
        doc_links, video_links, practice_items
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        subtrack = EXCLUDED.subtrack,
        summary_markdown = EXCLUDED.summary_markdown,
        theory_summary = EXCLUDED.theory_summary,
        doc_links = EXCLUDED.doc_links,
        video_links = EXCLUDED.video_links,
        practice_items = EXCLUDED.practice_items
      RETURNING id, name, slug, subtrack;`,
      [
        topic.name,
        topic.slug,
        topic.description,
        topic.subtrack,
        topic.summaryMarkdown,
        topic.summaryMarkdown, // Both theory_summary and summary_markdown synced
        JSON.stringify(topic.docLinks),
        JSON.stringify(topic.videoLinks),
        JSON.stringify(topic.practiceItems),
      ]
    );

    const seededTopic = res.rows[0];
    topicIdMap.set(seededTopic.slug, seededTopic);
    console.log(`✅ Upserted Topic [ID: ${seededTopic.id}]: "${seededTopic.name}" under [${seededTopic.subtrack}]`);

    // Sync entries in resources table for this topic
    await pool.query("DELETE FROM resources WHERE topic_id = $1", [seededTopic.id]);

    // Primary Video Resource
    if (topic.videoLinks?.[0]) {
      await pool.query(
        `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
         VALUES ($1, $2, $3, 'video', $4)`,
        [
          seededTopic.id,
          topic.videoLinks[0].title,
          topic.videoLinks[0].url,
          topic.estimatedMinutes,
        ]
      );
    }

    // Official Documentation Resource
    if (topic.docLinks?.[0]) {
      await pool.query(
        `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
         VALUES ($1, $2, $3, 'documentation', $4)`,
        [
          seededTopic.id,
          topic.docLinks[0].title,
          topic.docLinks[0].url,
          Math.round(topic.estimatedMinutes * 0.5),
        ]
      );
    }

    // Additional Practice Problems in resources table
    if (topic.practiceItems && topic.practiceItems.length > 0) {
      for (const pItem of topic.practiceItems) {
        await pool.query(
          `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
           VALUES ($1, $2, $3, 'practice', 20)`,
          [
            seededTopic.id,
            `[${pItem.platform}] ${pItem.title} (${pItem.difficulty})`,
            pItem.url,
          ]
        );
      }
    }
  }

  // 5. Update track_topics: 
  // Batch 1 (Lectures 1–10) are assigned topic_order 1 to 10 in sequential order.
  // REMOVE all legacy demo topics from problem-solving-dsa-sql track so that it ONLY contains our 10 real topics.
  console.log("\n🔄 Cleaning up track_topics for 'problem-solving-dsa-sql'...");

  const legacySlugs = [
    "arrays-and-hashing",
    "two-pointers-sliding-window",
    "linked-lists-interview",
    "trees-binary-search-trees",
    "relational-sql-joins-window-functions",
    "sql-query-optimization",
    "schema-design-normalization",
  ];

  // Remove legacy demo topics from problem-solving-dsa-sql
  const deleteRes = await pool.query(
    `DELETE FROM track_topics 
     WHERE track_id = $1 
       AND topic_id IN (
         SELECT id FROM topics WHERE slug = ANY($2::text[])
       )`,
    [trackId, legacySlugs]
  );
  if (deleteRes.rowCount > 0) {
    console.log(`🧹 Removed ${deleteRes.rowCount} legacy/demo topics from 'problem-solving-dsa-sql'.`);
  }

  // Temporarily shift existing records to avoid unique_track_topic_order collision during reordering
  await pool.query(
    `UPDATE track_topics SET topic_order = topic_order + 1000 WHERE track_id = $1`,
    [trackId]
  );

  // Link Batch 1 Topics (orders 1..10)
  for (let i = 0; i < batch1Topics.length; i++) {
    const topicDef = batch1Topics[i];
    const seededTopic = topicIdMap.get(topicDef.slug);
    const targetOrder = i + 1;

    await pool.query(
      `INSERT INTO track_topics (track_id, topic_id, topic_order)
       VALUES ($1, $2, $3)
       ON CONFLICT (track_id, topic_id) DO UPDATE SET
         topic_order = EXCLUDED.topic_order`,
      [trackId, seededTopic.id, targetOrder]
    );
    console.log(`📌 Linked Topic #${targetOrder}: "${seededTopic.name}"`);
  }

  console.log("\n🎉 DSA Batch 1 (Lectures 1–10) Seeding Completed Successfully with 0 Legacy Topics!");
};

if (require.main === module) {
  seedDsaBatch1()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch1;
