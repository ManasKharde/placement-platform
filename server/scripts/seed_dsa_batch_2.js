const pool = require("../config/db");

const seedDsaBatch2 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 2 (Lectures 11–20) Seeding (Zero LaTeX / Beginner-Friendly)...");

  // 1. Upgrade schema if not already present
  await pool.query(`
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS subtrack VARCHAR(150);
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS summary_markdown TEXT;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS theory_summary TEXT;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS doc_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS video_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS practice_items JSONB DEFAULT '[]'::jsonb;
  `);

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

  // 3. Define the 10 Expressive Batch 2 Topics (Lectures 11–20)
  const batch2Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 5: Recursion & Call Stack Mechanics (Topics 11–12)
    // =========================================================================
    {
      order: 11,
      name: "Functional Recursion on Arrays & Strings: Two-Pointer Reversal & Palindrome Checks",
      slug: "dsa-functional-recursion-arrays-palindromes",
      subtrack: "Module 5: Recursion & Call Stack Mechanics",
      description: "Apply functional recursion to arrays and strings, utilizing single index mirror formulas (n - i - 1) for palindrome verification and in-place reversal.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 11: Problems on Functional Recursion — Reverse Array & Check Palindrome",
          url: "https://www.youtube.com/watch?v=twuC1F6gLI8",
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check if a String is Palindrome or Not Using Recursion",
          url: "https://takeuforward.org/data-structure/check-if-the-given-string-is-palindrome-or-not/",
        },
        {
          title: "GeeksforGeeks: Reverse an Array using Recursion",
          url: "https://www.geeksforgeeks.org/program-to-reverse-an-array/",
        },
      ],
      practiceItems: [
        {
          title: "Reverse String",
          problemId: "344",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/reverse-string/",
          description: "Apply two-pointer symmetry to reverse a character array in-place.",
        },
        {
          title: "Valid Palindrome II",
          problemId: "680",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/valid-palindrome-ii/",
          description: "Check whether a string can become a palindrome after deleting at most one character.",
        },
        {
          title: "Sum of Array Elements",
          problemId: "gfg-sum-array",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/sum-of-array2326/1",
          description: "Practice traversing an array recursively using index parameters.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Any iterative two-pointer operation on an array or string—such as reversing an array or checking if a word is a palindrome—can also be written using recursion. Instead of using two separate variables \`left\` and \`right\`, we can use a single index \`i\` and compare it with its mirror index \`n - i - 1\`.

### 💡 Key Takeaways
- **Mirror Index Formula:** For any index \`i\` from the left, its matching element from the right is at index \`n - i - 1\`.
- **Stopping at the Middle (\`i >= n / 2\`):** When reversing or checking a palindrome, you only need to process the first half of the array. Once \`i\` reaches \`n / 2\`, all pairs have been checked or swapped.
- **Void vs. Boolean Recursion:**
  - *Reversing an Array:* Uses a \`void\` function that swaps \`arr[i]\` with \`arr[n - i - 1]\` and then calls \`reverse(i + 1)\`.
  - *Checking a Palindrome:* Uses a \`bool\` function that immediately returns \`false\` if \`s[i] != s[n - i - 1]\`, or keeps checking \`isPalindrome(i + 1)\` until the middle is reached.
- **Time & Space Complexity:** Both operations run in \`O(N / 2)\` steps—simplified to \`O(N)\` Time and \`O(N)\` Auxiliary Stack Space.

### 💻 Quick Code Blueprint
\`\`\`cpp
// Functional Recursion: Check if a string is a Palindrome
bool isPalindrome(int i, string &s) {
    int n = s.size();
    if (i >= n / 2) return true;            // Base case: reached the middle
    if (s[i] != s[n - i - 1]) return false; // Mismatch found
    return isPalindrome(i + 1, s);          // Check next inward pair
}
\`\`\``,
    },

    {
      order: 12,
      name: "Branching Recursion & Execution Trees: Multiple Recursive Calls",
      slug: "dsa-multiple-recursion-calls-execution-trees",
      subtrack: "Module 5: Recursion & Call Stack Mechanics",
      description: "Analyze sequential execution order and exponential O(2^N) time complexity across multiple recursive branches, recursion trees, and call stack depths.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 12: Multiple Recursion Calls — Fibonacci Number & Recursion Tree Analysis",
          url: "https://www.youtube.com/watch?v=kvRjNm4rVBE",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Print Fibonacci Series up to Nth Term",
          url: "https://takeuforward.org/data-structure/print-fibonacci-series-up-to-nth-term/",
        },
        {
          title: "MIT OpenCourseWare: Recursion Trees and Divide-and-Conquer",
          url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-3-insertion-sort-merge-sort/",
        },
      ],
      practiceItems: [
        {
          title: "Climbing Stairs",
          problemId: "70",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/climbing-stairs/",
          description: "Count distinct ways to reach the top when you can climb 1 or 2 steps at a time.",
        },
        {
          title: "N-th Tribonacci Number",
          problemId: "1137",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/n-th-tribonacci-number/",
          description: "Extend two-branch recurrence logic to a three-branch sequence.",
        },
        {
          title: "Nth Fibonacci Number",
          problemId: "gfg-nth-fib",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/nth-fibonacci-number1335/1",
          description: "Compute the Nth Fibonacci number under modulo arithmetic.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
So far, our recursive functions only called themselves once per step. Many advanced topics—like Trees, Backtracking, Merge Sort, and Dynamic Programming—require **Multiple Recursion Calls**, where a single function calls itself two or more times.

### 💡 Key Takeaways
- **Sequential Execution (Not Simultaneous):** When a function makes two recursive calls like \`last = f(n - 1)\` and \`secondLast = f(n - 2)\`, they do **not** run at the same time. The computer completely finishes the entire \`f(n - 1)\` call tree before it even starts \`f(n - 2)\`.
- **The Fibonacci Pattern:** In the Fibonacci sequence (\`0, 1, 1, 2, 3, 5, 8...\`), every number is the sum of the previous two numbers: \`f(n) = f(n - 1) + f(n - 2)\` with base cases \`f(0) = 0\` and \`f(1) = 1\`.
- **Exponential Time Complexity (\`O(2^N)\`):** Because each call branches into 2 more calls, the total number of calls roughly doubles at every level (\`2 * 2 * 2...\`), resulting in \`O(2^N)\` time complexity.
- **Stack Space (\`O(N)\`):** Even though there are \`2^N\` total calls, at most \`N\` calls wait on the call stack at any single moment because branches run one after another.

### 💻 Multiple Recursion Blueprint
\`\`\`cpp
int fib(int n) {
    if (n <= 1) return n;       // Base case: fib(0) = 0, fib(1) = 1
    int last = fib(n - 1);      // 1. Completely finishes left branch first
    int slast = fib(n - 2);     // 2. Then runs right branch
    return last + slast;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 6: Hashing & Frequency Precomputation (Topic 13)
    // =========================================================================
    {
      order: 13,
      name: "Hashing Fundamentals: Frequency Arrays, ASCII Mapping, Hash Maps & Collision Handling",
      slug: "dsa-hashing-frequency-maps-collisions",
      subtrack: "Module 6: Hashing & Frequency Precomputation",
      description: "Master frequency precomputation, 26-slot character mapping, unordered_map O(1) average lookups, collision chaining, and memory constraints.",
      estimatedMinutes: 55,
      videoLinks: [
        {
          title: "Lecture 13: Hashing Complete Course — Counting Frequencies, Maps & Unordered Maps",
          url: "https://www.youtube.com/watch?v=KEs5UyBJ39g",
          duration: "50m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Complete Hashing Theory & Cheatsheet",
          url: "https://takeuforward.org/data-structure/hashing-basics/",
        },
        {
          title: "cppreference: std::unordered_map",
          url: "https://en.cppreference.com/w/cpp/container/unordered_map",
        },
      ],
      practiceItems: [
        {
          title: "Valid Anagram",
          problemId: "242",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/valid-anagram/",
          description: "Use a 26-slot character frequency array to verify if two strings contain identical character counts.",
        },
        {
          title: "First Unique Character in a String",
          problemId: "387",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/first-unique-character-in-a-string/",
          description: "Precompute character frequencies to find the first non-repeating character in O(N) time.",
        },
        {
          title: "Frequencies of Limited Range Array Elements",
          problemId: "gfg-freq-array",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/frequency-of-array-elements-1587115620/0",
          description: "Count the frequency of each number from 1 to N in an array.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
If you have an array of size \`N\` and someone asks \`Q\` times how often different numbers appear, scanning the array from scratch each time takes \`O(Q * N)\` steps—which is far too slow. **Hashing** solves this by **pre-storing** frequencies in a single pass so every lookup happens almost instantly.

### 💡 Key Takeaways
- **1. Number Hashing with Arrays:**
  - If the maximum value in the array is small (e.g., up to \`10^5\`), create a frequency array \`hash[maxVal + 1]\` initialized to \`0\` and increment \`hash[arr[i]]++\`.
  - **Memory Limits for \`int\` Arrays:** Inside \`main()\`, the maximum array size is roughly \`10^6\`. Declared globally (outside \`main()\`), it can go up to \`10^7\`.
- **2. Character Hashing with ASCII Offsets:**
  - For lowercase letters (\`'a'\` to \`'z'\`), use an array of size \`26\` and map each character to index \`ch - 'a'\` (since \`'a' - 'a' = 0\`, \`'b' - 'a' = 1\`, ..., \`'z' - 'a' = 25\`).
  - If the string contains uppercase letters, digits, and symbols, simply use an array of size \`256\` and index directly by \`hash[ch]++\`.
- **3. Hashing Large Numbers (\`> 10^7\`) with Maps:**
  - When numbers reach \`10^9\` or \`10^18\`, you cannot create an array that large. Use \`unordered_map<int, int>\` or \`map<int, int>\` instead.
  - **\`unordered_map\`:** Takes \`O(1)\` time on average and best case, and \`O(N)\` in the rare worst case when all keys land in the same bucket (**Collision**).
  - **\`map\`:** Stores keys in sorted order and always takes \`O(log N)\` time in best, average, and worst cases.

### 💻 Character & Map Hashing Example
\`\`\`cpp
// 1. Lowercase Character Hashing (Size 26)
int charHash[26] = {0};
for (char ch : s) {
    charHash[ch - 'a']++;
}

// 2. Unordered Map Hashing for Large Integers
unordered_map<int, int> freq;
for (int x : arr) {
    freq[x]++; // O(1) average time
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 3: Module 7: Classical & Divide-and-Conquer Sorting (Topics 14–15)
    // =========================================================================
    {
      order: 14,
      name: "Elementary Sorting Algorithms: Selection Sort, Bubble Sort & Insertion Sort",
      slug: "dsa-elementary-sorting-selection-bubble-insertion",
      subtrack: "Module 7: Classical & Divide-and-Conquer Sorting Algorithms",
      description: "Master Selection Sort, Bubble Sort with didSwap flag optimization, and Insertion Sort with inward left-sliding element shifts.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 14: Selection Sort, Bubble Sort & Insertion Sort Tutorial and Code",
          url: "https://www.youtube.com/watch?v=HGk_ypEuS24",
          duration: "40m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Selection Sort Algorithm",
          url: "https://takeuforward.org/sorting/selection-sort-algorithm/",
        },
        {
          title: "TakeUForward: Bubble Sort Algorithm",
          url: "https://takeuforward.org/data-structure/bubble-sort-algorithm/",
        },
        {
          title: "TakeUForward: Insertion Sort Algorithm",
          url: "https://takeuforward.org/data-structure/insertion-sort-algorithm/",
        },
      ],
      practiceItems: [
        {
          title: "Sort Colors",
          problemId: "75",
          platform: "LeetCode",
          difficulty: "Medium",
          url: "https://leetcode.com/problems/sort-colors/",
          description: "Sort an array of 0s, 1s, and 2s in-place without using the built-in sort library.",
        },
        {
          title: "Height Checker",
          problemId: "1051",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/height-checker/",
          description: "Compare an array against its non-decreasing sorted order to count misplaced elements.",
        },
        {
          title: "Insertion Sort",
          problemId: "gfg-insert-sort",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/insertion-sort/1",
          description: "Implement the Insertion Sort algorithm from scratch.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Understanding how basic sorting algorithms work under the hood is a common technical interview requirement. This lecture breaks down the three classic \`O(N²)\` sorting algorithms: **Selection Sort**, **Bubble Sort**, and **Insertion Sort**.

### 💡 Key Takeaways
- **1. Selection Sort ("Select the Minimum & Swap"):**
  - In each step \`i\`, scan the unsorted portion \`[i ... n - 1]\` to find the index of the minimum element, then swap it with \`arr[i]\`.
  - **Complexity:** \`O(N²)\` in Best, Average, and Worst cases.
- **2. Bubble Sort ("Push the Maximum to the End"):**
  - Repeatedly compare adjacent elements (\`arr[j]\` and \`arr[j + 1]\`) and swap them if they are in the wrong order. After each pass, the largest remaining element bubbles to the end.
  - **Optimization:** Track a \`didSwap\` flag. If a pass makes \`0\` swaps, the array is already sorted and we can break early!
  - **Complexity:** \`O(N²)\` Worst/Average case, \`O(N)\` Best case (when already sorted).
- **3. Insertion Sort ("Slide Element Left Into Sorted Position"):**
  - Pick element \`arr[i]\` and repeatedly swap it with its left neighbor (\`arr[j - 1]\`) as long as \`arr[j - 1] > arr[j]\`.
  - **Complexity:** \`O(N²)\` Worst/Average case, \`O(N)\` Best case (when already sorted).

### 💻 Optimized Bubble Sort & Insertion Sort
\`\`\`cpp
// Insertion Sort: Slide each element left into its sorted spot
void insertionSort(vector<int> &arr, int n) {
    for (int i = 0; i < n; i++) {
        int j = i;
        while (j > 0 && arr[j - 1] > arr[j]) {
            swap(arr[j - 1], arr[j]);
            j--;
        }
    }
}
\`\`\``,
    },

    {
      order: 15,
      name: "Divide & Conquer Sorting: Merge Sort Algorithm, Recursion Trace & Complexity",
      slug: "dsa-merge-sort-divide-and-conquer",
      subtrack: "Module 7: Classical & Divide-and-Conquer Sorting Algorithms",
      description: "Implement recursive Divide & Conquer Merge Sort in O(N log N) time, tracing midpoint subsegment splits and two-pointer merging.",
      estimatedMinutes: 55,
      videoLinks: [
        {
          title: "Lecture 15: Merge Sort Algorithm — Full Breakdown, Code and Time Complexity",
          url: "https://www.youtube.com/watch?v=ogjf7ORKfd8",
          duration: "45m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Merge Sort Algorithm Detailed Walkthrough",
          url: "https://takeuforward.org/data-structure/merge-sort-algorithm/",
        },
        {
          title: "GeeksforGeeks: Merge Sort Algorithm",
          url: "https://www.geeksforgeeks.org/merge-sort/",
        },
      ],
      practiceItems: [
        {
          title: "Sort an Array",
          problemId: "912",
          platform: "LeetCode",
          difficulty: "Medium",
          url: "https://leetcode.com/problems/sort-an-array/",
          description: "Sort an array in O(N log N) time using Merge Sort without built-in functions.",
        },
        {
          title: "Merge Sorted Array",
          problemId: "88",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/merge-sorted-array/",
          description: "Practice the two-pointer merge procedure on two sorted arrays.",
        },
        {
          title: "Merge Sort",
          problemId: "gfg-merge-sort",
          platform: "GeeksforGeeks",
          difficulty: "Medium",
          url: "https://www.geeksforgeeks.org/problems/merge-sort/1",
          description: "Implement the recursive divide and merge functions for Merge Sort.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
While Selection, Bubble, and Insertion Sort take \`O(N²)\` time, **Merge Sort** sorts an array in \`O(N log N)\` time using two core steps: **Divide** and **Merge**.

### 💡 Key Takeaways
- **Step 1: Divide (Using Index Ranges):**
  - Instead of creating new subarrays at every step, pass \`low\` and \`high\` indices.
  - Find the midpoint \`mid = (low + high) / 2\`, recursively sort the left half \`[low ... mid]\`, and recursively sort the right half \`[mid + 1 ... high]\`.
  - **Base Case:** When \`low >= high\`, the subarray has only 1 element, which is already sorted.
- **Step 2: Merge Two Sorted Halves:**
  - Place a \`left\` pointer at \`low\` and a \`right\` pointer at \`mid + 1\`.
  - Compare \`arr[left]\` and \`arr[right]\`, push the smaller value into a \`temp\` vector, and advance that pointer.
  - Once one half finishes, append any remaining elements from the other half, then copy \`temp\` back into \`arr[low ... high]\` using \`arr[i] = temp[i - low]\`.
- **Time & Space Complexity:**
  - **Time Complexity:** \`O(N log N)\` in Best, Average, and Worst cases (dividing in half takes \`log2(N)\` levels, and merging takes up to \`O(N)\` work per level).
  - **Space Complexity:** \`O(N)\` extra space for the \`temp\` vector used during merging.

### 💻 Merge Sort Core Structure
\`\`\`cpp
void mergeSort(vector<int> &arr, int low, int high) {
    if (low >= high) return; // Base case: 1 element
    int mid = (low + high) / 2;
    mergeSort(arr, low, mid);       // Sort left half
    mergeSort(arr, mid + 1, high);  // Sort right half
    merge(arr, low, mid, high);     // Merge both sorted halves
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 4: Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums (Topics 16–20)
    // =========================================================================
    {
      order: 16,
      name: "Array Traversal & Order Statistics: Finding Largest & Second Largest Elements in Single Pass",
      slug: "dsa-arrays-largest-and-second-largest-single-pass",
      subtrack: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      description: "Master the Brute to Better to Optimal interview progression, finding largest and second-largest elements in a single O(N) linear pass.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 16: Largest and Second Largest Element in an Array (Brute, Better, Optimal)",
          url: "https://www.youtube.com/watch?v=37E9ckMDdTk",
          duration: "35m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find the Largest element in an array",
          url: "https://takeuforward.org/data-structure/find-the-largest-element-in-an-array/",
        },
        {
          title: "TakeUForward: Find Second Smallest and Second Largest Element in an array",
          url: "https://takeuforward.org/data-structure/find-second-smallest-and-second-largest-element-in-an-array/",
        },
      ],
      practiceItems: [
        {
          title: "Third Maximum Number",
          problemId: "414",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/third-maximum-number/",
          description: "Extend single-pass tracking to find the third distinct maximum number in an array.",
        },
        {
          title: "Maximum Product of Two Elements in an Array",
          problemId: "1464",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/",
          description: "Track the largest and second-largest numbers in a single pass to compute the maximum product.",
        },
        {
          title: "Third Largest Element",
          problemId: "gfg-third-largest",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/third-largest-element/1",
          description: "Find the third largest element in an array in linear O(N) time.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
This lecture introduces the **Brute → Better → Optimal** interview framework and applies it to finding the **Largest** and **Second Largest** (or **Second Smallest**) elements in an array without sorting.

### 💡 Key Takeaways
- **Drive the Interview (\`Brute → Better → Optimal\`):** In coding interviews, never blurt out the final trick immediately. Walk the interviewer through the Brute Force approach first, explain its complexity, and then optimize it step by step.
- **Finding the Largest Element:**
  - *Brute Force:* Sort the array (\`O(N log N)\`) and return \`arr[n - 1]\`.
  - *Optimal:* Track a \`largest = arr[0]\` variable and update it in a single \`O(N)\` loop.
- **Finding the Second Largest Element Without Sorting:**
  - *Brute Force (\`O(N log N)\`):* Sort the array, then scan backward from \`n - 2\` to find the first element not equal to \`largest\`.
  - *Better (\`O(2N)\`):* Find \`largest\` in pass 1, then find the largest number not equal to \`largest\` in pass 2.
  - *Optimal (\`O(N)\` Single Pass):* Maintain \`largest = arr[0]\` and \`sLargest = INT_MIN\`. Whenever you find a new \`arr[i] > largest\`, the old \`largest\` becomes \`sLargest\`, and \`arr[i]\` becomes the new \`largest\`. Otherwise, if \`arr[i] < largest && arr[i] > sLargest\`, update \`sLargest = arr[i]\`.

### 💻 Single-Pass Second Largest Blueprint
\`\`\`cpp
int secondLargest(vector<int> &arr) {
    int largest = arr[0], sLargest = INT_MIN;
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > largest) {
            sLargest = largest;
            largest = arr[i];
        } else if (arr[i] < largest && arr[i] > sLargest) {
            sLargest = arr[i];
        }
    }
    return sLargest;
}
\`\`\``,
    },

    {
      order: 17,
      name: "Sorted Array Invariants: Monotonicity Check & In-Place Two-Pointer Deduplication",
      slug: "dsa-arrays-sorted-check-and-inplace-deduplication",
      subtrack: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      description: "Verify sorted order in O(N) and master the slow-and-fast two-pointer pattern to remove duplicates from a sorted array in-place in O(1) space.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 17: Check if Array is Sorted & Remove Duplicates from Sorted Array In-Place",
          url: "https://www.youtube.com/watch?v=37E9ckMDdTk",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check if an Array is Sorted",
          url: "https://takeuforward.org/data-structure/check-if-an-array-is-sorted/",
        },
        {
          title: "TakeUForward: Remove Duplicates in-place from Sorted Array",
          url: "https://takeuforward.org/data-structure/remove-duplicates-in-place-from-sorted-array/",
        },
      ],
      practiceItems: [
        {
          title: "Check if Array Is Sorted and Rotated",
          problemId: "1752",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/",
          description: "Check adjacent order drops to determine if an array is sorted and rotated.",
        },
        {
          title: "Remove Element",
          problemId: "27",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/remove-element/",
          description: "Use the slow-and-fast two-pointer pattern to filter out target values in-place.",
        },
        {
          title: "Remove Duplicates from Sorted Array II",
          problemId: "80",
          platform: "LeetCode",
          difficulty: "Medium",
          url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/",
          description: "Extend in-place two-pointer deduplication so each unique element appears at most twice.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
This topic focuses on two classic sorted-array problems: verifying whether an array is sorted in non-decreasing order, and **Removing Duplicates In-Place from a Sorted Array** in \`O(N)\` time and \`O(1)\` extra space using the **Slow & Fast Two-Pointer** pattern.

### 💡 Key Takeaways
- **1. Checking if an Array is Sorted (\`O(N)\`):**
  - Loop from \`i = 1\` to \`n - 1\` and check if every element is greater than or equal to its previous neighbor (\`arr[i] >= arr[i - 1]\`). If any element is smaller than the previous one, immediately return \`false\`.
- **2. Removing Duplicates from a Sorted Array:**
  - *Brute Force (\`O(N log N)\` Time, \`O(N)\` Space):* Insert all elements into a \`set<int>\` (which keeps unique sorted values), then copy them back into the front of the array.
  - *Optimal Two-Pointer (\`O(N)\` Time, \`O(1)\` Space):*
    - Keep pointer \`i = 0\` marking the last unique element placed.
    - Scan pointer \`j\` from \`1\` to \`n - 1\`.
    - Whenever \`arr[j] != arr[i]\`, we have found a new unique number! Place it at \`arr[i + 1] = arr[j]\` and increment \`i++\`.
    - Return \`i + 1\` as the count of unique elements.

### 💻 Two-Pointer In-Place Deduplication
\`\`\`cpp
int removeDuplicates(vector<int> &arr) {
    int i = 0; // Points to the last unique element
    for (int j = 1; j < arr.size(); j++) {
        if (arr[j] != arr[i]) {
            arr[i + 1] = arr[j];
            i++;
        }
    }
    return i + 1; // Total count of unique elements
}
\`\`\``,
    },

    {
      order: 18,
      name: "Array Rotations & Two-Pointer Partitioning: Reversal Algorithm, Move Zeroes & Sorted Set Operations",
      slug: "dsa-array-rotations-move-zeroes-union-intersection",
      subtrack: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      description: "Master left and right array rotation by D places using 3-step reversals in O(1) space, moving zeroes to the end, and two-pointer union/intersection.",
      estimatedMinutes: 55,
      videoLinks: [
        {
          title: "Lecture 18: Left Rotate Array by D Places, Move Zeroes to End, Union & Intersection",
          url: "https://www.youtube.com/watch?v=wvcQg43_V8U",
          duration: "45m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Rotate Array by K Elements",
          url: "https://takeuforward.org/data-structure/rotate-array-by-k-elements/",
        },
        {
          title: "TakeUForward: Move all Zeros to the end of the array",
          url: "https://takeuforward.org/data-structure/move-all-zeros-to-the-end-of-the-array/",
        },
        {
          title: "TakeUForward: Union of Two Sorted Arrays",
          url: "https://takeuforward.org/data-structure/union-of-two-sorted-arrays/",
        },
      ],
      practiceItems: [
        {
          title: "Sort Array By Parity",
          problemId: "905",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/sort-array-by-parity/",
          description: "Apply the Move Zeroes two-pointer swap pattern to move all even integers to the front.",
        },
        {
          title: "Intersection of Two Arrays",
          problemId: "349",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/intersection-of-two-arrays/",
          description: "Compute the unique intersection of two integer arrays.",
        },
        {
          title: "Segregate 0s and 1s",
          problemId: "gfg-segregate-01",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          url: "https://www.geeksforgeeks.org/problems/segregate-0s-and-1s5106/1",
          description: "Partition 0s and 1s in-place in a single O(N) pass.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
This lecture covers four essential in-place and two-pointer array techniques: **Rotating an Array by \`D\` Places**, **Moving All Zeros to the End**, **Linear Search**, and finding the **Union and Intersection of Two Sorted Arrays**.

### 💡 Key Takeaways
- **1. Rotating an Array by \`D\` Places:**
  - Always normalize \`d = d % n\` first, because rotating an array of size \`n\` by \`n\` places brings it right back to the original order.
  - **Optimal 3-Step Reversal Trick (\`O(N)\` Time, \`O(1)\` Extra Space):** To left-rotate by \`d\` places without a temp array:
    1. Reverse the first \`d\` elements: \`reverse(0, d - 1)\`
    2. Reverse the remaining \`n - d\` elements: \`reverse(d, n - 1)\`
    3. Reverse the entire array: \`reverse(0, n - 1)\`
- **2. Moving All Zeros to the End (\`O(N)\` Time, \`O(1)\` Space):**
  - Find the index \`j\` of the very first \`0\` in the array.
  - Loop \`i\` from \`j + 1\` to \`n - 1\`. Whenever \`arr[i] != 0\`, swap \`arr[i]\` with \`arr[j]\` and advance \`j++\`.
- **3. Union & Intersection of Two Sorted Arrays (\`O(N1 + N2)\` Time):**
  - Use two pointers \`i\` (on array \`A\`) and \`j\` (on array \`B\`).
  - For **Union**, always pick the smaller element (\`A[i]\` or \`B[j]\`), append it if it isn't a duplicate of \`unionArr.back()\`, and advance the pointer.
  - For **Intersection**, advance whichever pointer has the smaller value; when \`A[i] == B[j]\`, add the element to the answer and advance **both** \`i++\` and \`j++\`.

### 💻 3-Step Array Rotation & Move Zeroes
\`\`\`cpp
// Optimal Left Rotate by D places in O(1) extra space
void leftRotate(vector<int> &arr, int d) {
    int n = arr.size();
    d = d % n;
    reverse(arr.begin(), arr.begin() + d);
    reverse(arr.begin() + d, arr.end());
    reverse(arr.begin(), arr.end());
}
\`\`\``,
    },

    {
      order: 19,
      name: "Bitwise XOR & Mathematical Array Tricks: Missing Number, Consecutive Streaks & Single Number",
      slug: "dsa-arrays-xor-missing-number-consecutive-ones",
      subtrack: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      description: "Solve Missing Number, Maximum Consecutive Ones, and Single Number in O(N) time and O(1) space leveraging XOR self-cancellation properties.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 19: Find Missing Number, Maximum Consecutive Ones & Find Single Number in Array",
          url: "https://www.youtube.com/watch?v=bYWLJb3vCWY",
          duration: "35m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find the missing number in an array",
          url: "https://takeuforward.org/arrays/find-the-missing-number-in-an-array/",
        },
        {
          title: "TakeUForward: Count Maximum Consecutive One's in the array",
          url: "https://takeuforward.org/data-structure/count-maximum-consecutive-ones-in-the-array/",
        },
        {
          title: "TakeUForward: Find the number that appears once, and the other numbers twice",
          url: "https://takeuforward.org/arrays/find-the-number-that-appears-once-and-the-other-numbers-twice/",
        },
      ],
      practiceItems: [
        {
          title: "Set Mismatch",
          problemId: "645",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/set-mismatch/",
          description: "Find both the duplicated number and the missing number in a 1-to-N array.",
        },
        {
          title: "Consecutive Characters",
          problemId: "1446",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/consecutive-characters/",
          description: "Apply the consecutive streak counter pattern to find the longest repeating character substring.",
        },
        {
          title: "Find the Difference",
          problemId: "389",
          platform: "LeetCode",
          difficulty: "Easy",
          url: "https://leetcode.com/problems/find-the-difference/",
          description: "Use bitwise XOR cancellation to identify the single added character between two strings.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Many array problems that seem to require hash maps (\`O(N)\` extra space) can actually be solved in \`O(1)\` space using simple math or the **Bitwise XOR (\`^\`)** operator. This lecture covers **Missing Number**, **Maximum Consecutive Ones**, and **Single Number**.

### 💡 Key Takeaways
- **The 2 Golden Properties of XOR (\`^\`):**
  1. **Same numbers cancel out to zero:** \`a ^ a = 0\` (e.g., \`5 ^ 5 = 0\`).
  2. **Zero XOR any number is the number itself:** \`0 ^ a = a\` (e.g., \`0 ^ 5 = 5\`).
- **1. Finding the Missing Number (\`1\` to \`N\`):**
  - *Sum Formula (\`O(N)\` Time, \`O(1)\` Space):* Subtract the sum of the array from \`N * (N + 1) / 2\`. (Note: requires \`long long\` when \`N = 10^5\` so \`N * (N + 1)\` doesn't overflow).
  - *XOR Approach (\`O(N)\` Time, \`O(1)\` Space, Zero Overflow):* XOR all numbers from \`1\` to \`N\` (\`xor1\`) and XOR all elements in the array (\`xor2\`). Every present number cancels out, leaving \`xor1 ^ xor2\` as the missing number!
- **2. Maximum Consecutive Ones (\`O(N)\` Time, \`O(1)\` Space):**
  - Keep a running \`cnt\` and \`maxi\`. Increment \`cnt++\` when you see \`1\` (and update \`maxi = max(maxi, cnt)\`), and reset \`cnt = 0\` whenever you see \`0\`.
- **3. Finding the Number That Appears Once (When Others Appear Twice):**
  - Simply XOR all elements in the array together! Every pair cancels to \`0\`, leaving only the unique single number.

### 💻 Bitwise XOR Single Number Blueprint
\`\`\`cpp
int singleNumber(vector<int> &nums) {
    int xorr = 0;
    for (int num : nums) {
        xorr = xorr ^ num; // Duplicate pairs cancel out to 0
    }
    return xorr;
}
\`\`\``,
    },

    {
      order: 20,
      name: "Subarray Sum Patterns: Prefix Sum + Hash Map vs. Variable-Size Sliding Window",
      slug: "dsa-longest-subarray-with-sum-k-prefix-sum-sliding-window",
      subtrack: "Module 8: Array Manipulation, Two-Pointer Patterns & Prefix Sums",
      description: "Master Prefix Sum + Hash Map for arrays with positives, zeroes, and negatives, contrasted with two-pointer sliding window for positive-only arrays.",
      estimatedMinutes: 60,
      videoLinks: [
        {
          title: "Lecture 20: Longest Subarray with Sum K — Prefix Sum Map vs 2-Pointer Sliding Window",
          url: "https://www.youtube.com/watch?v=frf7qxiN2qU",
          duration: "50m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Subarray with given Sum K (Positives & Negatives)",
          url: "https://takeuforward.org/data-structure/longest-subarray-with-given-sum-k/",
        },
        {
          title: "GeeksforGeeks: Longest Subarray with Sum K",
          url: "https://www.geeksforgeeks.org/longest-sub-array-sum-k/",
        },
      ],
      practiceItems: [
        {
          title: "Subarray Sum Equals K",
          problemId: "560",
          platform: "LeetCode",
          difficulty: "Medium",
          url: "https://leetcode.com/problems/subarray-sum-equals-k/",
          description: "Use Prefix Sum + Hash Map to count the total number of contiguous subarrays summing to K.",
        },
        {
          title: "Minimum Size Subarray Sum",
          problemId: "209",
          platform: "LeetCode",
          difficulty: "Medium",
          url: "https://leetcode.com/problems/minimum-size-subarray-sum/",
          description: "Use the two-pointer shrinking window technique on positive numbers to find the shortest subarray with sum >= target.",
        },
        {
          title: "Subarray with 0 sum",
          problemId: "gfg-subarray-0-sum",
          platform: "GeeksforGeeks",
          difficulty: "Medium",
          url: "https://www.geeksforgeeks.org/problems/subarray-with-0-sum-1587115621/1",
          description: "Detect whether any contiguous subarray sums to zero using a prefix sum set.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A **subarray** is a contiguous slice of an array. Finding the **Longest Subarray with Sum \`K\`** is one of the most frequently asked interview patterns because its optimal solution depends on whether the array contains **negative numbers** or **only positives and zeros**.

### 💡 Key Takeaways
- **Approach 1: Prefix Sum + Hash Map (Optimal when array has Positives, Zeros & Negatives):**
  - As you iterate to index \`i\`, maintain the running \`sum\` from index \`0\` to \`i\`.
  - If the total sum at \`i\` is \`sum\`, and we want a subarray ending at \`i\` with sum \`K\`, we check if a prefix sum of \`rem = sum - K\` appeared at some earlier index \`j\`. If it did, the slice from \`j + 1\` to \`i\` has sum \`K\` and length \`i - j\`!
  - **Zero Edge Case Rule:** Only store \`preSumMap[sum] = i\` if \`sum\` is **not already in the map**. Keeping the earliest (leftmost) index guarantees we get the **longest** subarray.
  - **Complexity:** \`O(N)\` or \`O(N log N)\` Time, \`O(N)\` Space.
- **Approach 2: Two-Pointer Sliding Window (Optimal when array has ONLY Positives & Zeros):**
  - Keep \`left = 0\` and \`right = 0\`. Expand the window by moving \`right\` and adding \`arr[right]\` to \`sum\`.
  - Whenever \`sum > K\`, shrink the window from the left (\`sum -= arr[left]; left++\`).
  - Whenever \`sum == K\`, update \`maxLen = max(maxLen, right - left + 1)\`.
  - **Complexity:** \`O(2N) → O(N)\` Time and \`O(1)\` Space.

### 💻 Two-Pointer Sliding Window (Positives & Zeros)
\`\`\`cpp
int longestSubarrayWithSumK(vector<int> &a, long long k) {
    int left = 0, right = 0, maxLen = 0, n = a.size();
    long long sum = a[0];
    while (right < n) {
        while (left <= right && sum > k) {
            sum -= a[left];
            left++;
        }
        if (sum == k) maxLen = max(maxLen, right - left + 1);
        right++;
        if (right < n) sum += a[right];
    }
    return maxLen;
}
\`\`\``,
    },
  ];

  // 4. Upsert topics in database
  const topicIdMap = new Map();

  for (const topic of batch2Topics) {
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

  // 5. Update track_topics: Link Batch 2 Topics to topic_order 11 through 20
  console.log("\n🔄 Linking Batch 2 topics to 'problem-solving-dsa-sql' (orders 11..20)...");

  // Remove any legacy demo topics that might still be present
  const legacySlugs = [
    "arrays-and-hashing",
    "two-pointers-sliding-window",
    "linked-lists-interview",
    "trees-binary-search-trees",
    "relational-sql-joins-window-functions",
    "sql-query-optimization",
    "schema-design-normalization",
  ];
  await pool.query(
    `DELETE FROM track_topics 
     WHERE track_id = $1 
       AND topic_id IN (
         SELECT id FROM topics WHERE slug = ANY($2::text[])
       )`,
    [trackId, legacySlugs]
  );

  // Link Batch 2 Topics (orders 11..20)
  for (const topicDef of batch2Topics) {
    const seededTopic = topicIdMap.get(topicDef.slug);
    const targetOrder = topicDef.order;

    await pool.query(
      `INSERT INTO track_topics (track_id, topic_id, topic_order)
       VALUES ($1, $2, $3)
       ON CONFLICT (track_id, topic_id) DO UPDATE SET
         topic_order = EXCLUDED.topic_order`,
      [trackId, seededTopic.id, targetOrder]
    );
    console.log(`📌 Linked Topic #${targetOrder}: "${seededTopic.name}"`);
  }

  console.log("\n🎉 DSA Batch 2 (Lectures 11–20) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch2()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch2;
