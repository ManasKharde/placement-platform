const pool = require("../config/db");

// Helper to remove any citations, LaTeX commands, or dollar signs
const cleanText = (str) => {
  if (!str) return str;
  return str
    .replace(/\[cite:\s*\d+\]/g, "")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "infinity")
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
    .replace(/\\log/g, "log")
    .replace(/\\times/g, "*")
    .replace(/\\le/g, "<=")
    .replace(/\\ge/g, ">=")
    .replace(/\$/g, "")
    .trim();
};

const cleanUrl = (url) => {
  if (!url) return url;
  const match = url.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const clean = match ? match[2] : url;
  return clean.replace(/^http:\/\//, "https://").trim();
};

const seedDsaBatch6 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 6 (Lectures 51–60) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 6 Topics (Lectures 51–60)
  const batch6Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 12: 1D Binary Search, Bounds & Rotated Array Invariants (Topics 51–53)
    // =========================================================================
    {
      order: 51,
      name: "Rotation Count via Pivot Index: Finding How Many Times a Sorted Array Has Been Rotated",
      slug: "dsa-find-how-many-times-array-rotated",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Find the rotation count of a rotated sorted array in O(log N) time by locating the index of the minimum element using sorted-half elimination.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 51: Find out how many times the array has been rotated",
          url: cleanUrl("http://www.youtube.com/watch?v=jtSiWTPLwd0"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find out how many times the array has been rotated",
          url: "https://takeuforward.org/data-structure/find-out-how-many-times-the-array-has-been-rotated/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Check if Array Is Sorted and Rotated",
          url: cleanUrl("https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/"),
          difficulty: "Easy",
          description: "Verify whether an array was originally sorted in non-decreasing order and then rotated.",
        },
        {
          platform: "LeetCode",
          title: "Find Minimum in Rotated Sorted Array",
          url: cleanUrl("https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"),
          difficulty: "Medium",
          description: "Find the pivot minimum value in a rotated sorted array in O(log N) time.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Search in a Rotated Array",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1"),
          difficulty: "Medium",
          description: "Use sorted-half identification to locate a target index in a rotated array.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a rotated sorted array of distinct numbers (for example, \`[3, 4, 5, 1, 2]\`), how do we find out **how many times** the array has been rotated in \`O(log2 N)\` time?

### 💡 Key Takeaways
- **The Key Observation (Rotation Count == Index of Minimum Element):**
  - In an unrotated sorted array \`[1, 2, 3, 4, 5]\`, the minimum element \`1\` sits at index \`0\` (rotated \`0\` times).
  - In \`[3, 4, 5, 1, 2]\`, the minimum element \`1\` sits at index \`3\`—which means the array was rotated **3 times**!
  - Therefore, finding how many times an array has been rotated is **identical to finding the index of its minimum element**.
- **Optimal Binary Search (O(log2 N) Time, O(1) Space):**
  - Maintain both \`ans = INT_MAX\` (smallest value seen) and \`index = -1\` (index of that smallest value).
  - If the entire current range \`[low ... high]\` is already sorted (\`arr[low] <= arr[high]\`), check if \`arr[low] < ans\`. If so, update \`ans = arr[low]\`, \`index = low\`, and \`break\`.
  - If the left half is sorted (\`arr[low] <= arr[mid]\`), compare \`arr[low]\` against \`ans\` (updating \`ans\` and \`index = low\` if smaller), then eliminate the left half (\`low = mid + 1\`).
  - Otherwise, the right half is sorted: compare \`arr[mid]\` against \`ans\` (updating \`ans\` and \`index = mid\` if smaller), then eliminate the right half (\`high = mid - 1\`).

### 💻 Rotation Count Blueprint
\`\`\`cpp
int findKRotation(vector<int> &arr) {
    int low = 0, high = (int)arr.size() - 1;
    int ans = INT_MAX, index = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[low] <= arr[high]) {
            if (arr[low] < ans) {
                ans = arr[low];
                index = low;
            }
            break;
        }
        if (arr[low] <= arr[mid]) {
            if (arr[low] < ans) {
                ans = arr[low];
                index = low;
            }
            low = mid + 1;
        } else {
            if (arr[mid] < ans) {
                ans = arr[mid];
                index = mid;
            }
            high = mid - 1;
        }
    }
    return index;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 52
    // -------------------------------------------------------------------------
    {
      order: 52,
      name: "Index Parity Elimination: Finding the Single Element in a Sorted Array",
      slug: "dsa-single-element-in-sorted-array",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Find the single unique non-duplicate element in a sorted array in O(log N) time and O(1) space using the (even, odd) vs (odd, even) index parity invariant.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 52: Search Single Element in a sorted array",
          url: cleanUrl("http://www.youtube.com/watch?v=AZOmHuHadxQ"),
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Search Single Element in a sorted array",
          url: "https://takeuforward.org/data-structure/search-single-element-in-a-sorted-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Single Number",
          url: cleanUrl("https://leetcode.com/problems/single-number/"),
          difficulty: "Easy",
          description: "Compare O(N) XOR cancellation on unsorted arrays against O(log N) binary search on sorted arrays.",
        },
        {
          platform: "LeetCode",
          title: "Single Number II",
          url: cleanUrl("https://leetcode.com/problems/single-number-ii/"),
          difficulty: "Medium",
          description: "Find the single element in an array where every other element appears three times.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Element appearing once",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/element-appearing-once2552/1"),
          difficulty: "Medium",
          description: "Find the element that appears once in a sorted array where all other elements appear twice.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a **sorted** array where every element appears **twice** except for one element that appears **once** (e.g., \`[1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6]\`), find that single element in **O(log2 N) time** and **O(1) space**.

### 💡 Key Takeaways
- **The (even, odd) vs. (odd, even) Index Parity Trick:**
  - Before the single element (\`4\`), every duplicate pair starts at an **even** index and ends at an **odd** index: \`(even, odd)\`.
  - After the single element (\`4\`), the single element shifts every subsequent pair by 1, so every duplicate pair starts at an **odd** index and ends at an **even** index: \`(odd, even)\`!
- **Trimming Boundary Edge Cases First:**
  - To avoid messy out-of-bounds checks on \`mid - 1\` and \`mid + 1\`, handle \`n == 1\`, index \`0\` (\`arr[0] != arr[1]\`), and index \`n - 1\` (\`arr[n - 1] != arr[n - 2]\`) upfront, then run Binary Search from **\`low = 1\` to \`high = n - 2\`**!
- **Elimination Rules at \`mid\`:**
  - **Found Single Element:** If \`arr[mid] != arr[mid - 1] && arr[mid] != arr[mid + 1]\`, return \`arr[mid]\`.
  - **Standing in the Left Half (even, odd):** If \`(mid % 2 == 1 && arr[mid] == arr[mid - 1])\` OR \`(mid % 2 == 0 && arr[mid] == arr[mid + 1])\`, the single element is to our right—eliminate the left half (\`low = mid + 1\`).
  - **Standing in the Right Half (odd, even):** Otherwise, the single element is to our left—eliminate the right half (\`high = mid - 1\`).

### 💻 Single Element in Sorted Array Blueprint
\`\`\`cpp
int singleNonDuplicate(vector<int> &arr) {
    int n = arr.size();
    if (n == 1) return arr[0];
    if (arr[0] != arr[1]) return arr[0];
    if (arr[n - 1] != arr[n - 2]) return arr[n - 1];

    int low = 1, high = n - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] != arr[mid + 1] && arr[mid] != arr[mid - 1]) {
            return arr[mid];
        }
        // We are in the left half (even, odd) -> single element is on the right
        if ((mid % 2 == 1 && arr[mid] == arr[mid - 1]) ||
            (mid % 2 == 0 && arr[mid] == arr[mid + 1])) {
            low = mid + 1;
        } else {
            high = mid - 1; // We are in the right half -> go left
        }
    }
    return -1;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 53
    // -------------------------------------------------------------------------
    {
      order: 53,
      name: "Slope-Guided Binary Search: Finding a Peak Element in 1D Arrays (Single & Multiple Peaks)",
      slug: "dsa-find-peak-element-binary-search",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Find any local peak element in a 1D array in O(log N) time using slope-guided binary search by climbing the increasing slope.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 53: Peak element in Array",
          url: cleanUrl("http://www.youtube.com/watch?v=cXxmbemS6XM"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Peak element in Array",
          url: "https://takeuforward.org/data-structure/peak-element-in-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Peak Index in a Mountain Array",
          url: cleanUrl("https://leetcode.com/problems/peak-index-in-a-mountain-array/"),
          difficulty: "Medium",
          description: "Locate the peak index of a strictly unimodal mountain array in O(log N) time.",
        },
        {
          platform: "LeetCode",
          title: "Find a Peak Element II",
          url: cleanUrl("https://leetcode.com/problems/find-a-peak-element-ii/"),
          difficulty: "Medium",
          description: "Extend 1D slope-guided binary search to find a 2D grid peak element.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Bitonic Point",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/maximum-value-in-a-bitonic-array3001/1"),
          difficulty: "Easy",
          description: "Find the maximum element in an array that first strictly increases and then decreases.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A **Peak Element** is an element that is strictly greater than both its left and right neighbors (\`arr[i - 1] < arr[i] > arr[i + 1]\`), assuming \`-infinity\` outside both ends of the array. Even though the array is not globally sorted, we can find any peak in **O(log2 N) time** using slope-guided binary search!

### 💡 Key Takeaways
- **Clean Boundary Handling (\`low = 1\` to \`high = n - 2\`):**
  - Just like in Single Element, check \`n == 1\`, index \`0\` (\`arr[0] > arr[1]\`), and index \`n - 1\` (\`arr[n - 1] > arr[n - 2]\`) upfront.
  - Then run Binary Search safely between \`low = 1\` and \`high = n - 2\`.
- **Visualizing the Slope at \`mid\`:**
  1. **At a Peak (\`arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]\`):** Return \`mid\`!
  2. **On an Increasing Slope (\`arr[mid] > arr[mid - 1]\`):** The curve is rising toward the right, so a peak is guaranteed to exist on the right—eliminate the left half (\`low = mid + 1\`).
  3. **On a Decreasing Slope or Valley (\`else\`):** Otherwise, a peak is guaranteed to exist on the left—eliminate the right half (\`high = mid - 1\`).

### 💻 Find Peak Element Blueprint
\`\`\`cpp
int findPeakElement(vector<int> &arr) {
    int n = arr.size();
    if (n == 1) return 0;
    if (arr[0] > arr[1]) return 0;
    if (arr[n - 1] > arr[n - 2]) return n - 1;

    int low = 1, high = n - 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] > arr[mid - 1] && arr[mid] > arr[mid + 1]) {
            return mid;
        }
        if (arr[mid] > arr[mid - 1]) {
            low = mid + 1;  // Increasing slope -> peak is on the right
        } else {
            high = mid - 1; // Decreasing slope or valley -> go left
        }
    }
    return -1;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 13: Binary Search on Answer Space & Monotonic Predicate Functions (Topics 54–60)
    // =========================================================================
    {
      order: 54,
      name: "Binary Search on Answer Space: Floor Square Root of an Integer in O(log N) Time",
      slug: "dsa-square-root-of-number-binary-search",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Find the floor square root of an integer in O(log N) time using binary search on the answer range [1, N] with opposite polarity convergence.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 54: Finding Sqrt of a number using Binary Search",
          url: cleanUrl("http://www.youtube.com/watch?v=Bsv3FPUX_BA"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Finding Sqrt of a number using Binary Search",
          url: "https://takeuforward.org/binary-search/finding-sqrt-of-a-number-using-binary-search/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Valid Perfect Square",
          url: cleanUrl("https://leetcode.com/problems/valid-perfect-square/"),
          difficulty: "Easy",
          description: "Use binary search on the answer range [1, num] to check if num is a perfect square without built-in sqrt.",
        },
        {
          platform: "LeetCode",
          title: "Sum of Square Numbers",
          url: cleanUrl("https://leetcode.com/problems/sum-of-square-numbers/"),
          difficulty: "Medium",
          description: "Determine whether two integers a and b exist such that a^2 + b^2 = c.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count Squares",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/count-squares3649/1"),
          difficulty: "Basic",
          description: "Count the number of perfect squares strictly less than a given integer N.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a positive integer \`n\`, find the **floor of its square root** (the largest integer \`x\` such that \`x * x <= n\`) in \`O(log2 N)\` time without using built-in \`sqrt()\`. This problem introduces one of the most important patterns in interviews: **Binary Search on Answers**.

### 💡 Key Takeaways
- **When to Use "Binary Search on Answers":**
  - Whenever a question asks for the **minimum** or **maximum** possible integer that satisfies a condition, and you know the **range \`[low, high]\`** where the answer must lie.
  - Notice the monotonic pattern for \`n = 28\`: \`1, 2, 3, 4, 5\` are **possible** (\`x * x <= 28\`), while \`6, 7, 8...\` are **not possible** (\`x * x > 28\`).
- **Optimal Binary Search (O(log2 N) Time, O(1) Space):**
  - Set \`low = 1\` and \`high = n\`.
  - Check \`mid = low + (high - low) / 2\`:
    - If \`(long long)mid * mid <= n\`: \`mid\` is a possible answer, but we want the **largest** possible value, so eliminate the left half (\`low = mid + 1\`).
    - Otherwise (\`mid * mid > n\`): \`mid\` is too large, so eliminate the right half (\`high = mid - 1\`).
  - **Opposite Polarity Property:** \`low\` starts in the *possible* zone and ends at the first *impossible* value, while \`high\` starts in the *impossible* zone and ends at the **last possible value**—so \`high\` holds the exact answer!

### 💻 Floor Square Root Blueprint
\`\`\`cpp
long long floorSqrt(long long n) {
    long long low = 1, high = n;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        long long val = mid * mid;
        if (val <= n) {
            low = mid + 1;  // Possible answer; try to find a larger valid integer
        } else {
            high = mid - 1; // Exceeded n; move left to smaller numbers
        }
    }
    return high; // Ends at the largest valid integer
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 55
    // -------------------------------------------------------------------------
    {
      order: 55,
      name: "Overflow-Safe Power Evaluation: Finding the Nth Root of an Integer via Binary Search",
      slug: "dsa-nth-root-of-an-integer-binary-search",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Find the exact integer Nth root of M in O(N * log M) time using binary search with an overflow-safe early-exit multiplication helper.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 55: Nth Root of a Number using Binary Search",
          url: cleanUrl("http://www.youtube.com/watch?v=rjEJeYCasHs"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Nth Root of a Number using Binary Search",
          url: "https://takeuforward.org/data-structure/nth-root-of-a-number-using-binary-search/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Pow(x, n)",
          url: cleanUrl("https://leetcode.com/problems/powx-n/"),
          difficulty: "Medium",
          description: "Implement fast binary exponentiation in O(log N) time.",
        },
        {
          platform: "LeetCode",
          title: "Arranging Coins",
          url: cleanUrl("https://leetcode.com/problems/arranging-coins/"),
          difficulty: "Easy",
          description: "Use binary search on the answer range [1, n] with overflow-safe multiplication.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Power Of Numbers",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/power-of-numbers-1587115620/1"),
          difficulty: "Medium",
          description: "Compute modular exponentiation for large integer powers.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given two integers \`n\` and \`m\`, find the exact integer **\`n\`-th root of \`m\`** (the integer \`x\` such that \`x^n == m\`), or return \`-1\` if no exact integer root exists.

### 💡 Key Takeaways
- **Binary Search Range (\`[1, m]\`):**
  - Set \`low = 1\` and \`high = m\`.
  - At each \`mid\`, we want to compare \`mid^n\` against \`m\`.
- **Why Computing \`pow(mid, n)\` Directly Fails (Massive Overflow):**
  - Suppose \`n = 10\` and \`m = 10^9\`. In the first step, \`mid\` is around \`5 * 10^8\`.
  - Raising \`5 * 10^8\` to the power \`10\` produces a number around \`10^87\`, which overflows even a 64-bit \`long long\`!
- **The Early-Exit Multiplication Helper (\`func(mid, n, m)\`):**
  - We don't actually care about the exact value of \`mid^n\` once it exceeds \`m\`!
  - Multiply \`ans = ans * mid\` in a loop \`n\` times, and **the moment \`ans > m\`, immediately stop and return \`2\`** (meaning too large)!
  - If the loop finishes and \`ans == m\`, return \`1\` (exact match found!).
  - Otherwise (\`ans < m\`), return \`0\` (too small).

### 💻 Overflow-Safe Nth Root Blueprint
\`\`\`cpp
// Returns 1 if mid^n == m, 0 if mid^n < m, 2 if mid^n > m
int checkPower(int mid, int n, int m) {
    long long ans = 1;
    for (int i = 1; i <= n; i++) {
        ans = ans * mid;
        if (ans > m) return 2; // Early exit prevents overflow!
    }
    if (ans == m) return 1;
    return 0;
}

int NthRoot(int n, int m) {
    int low = 1, high = m;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int midN = checkPower(mid, n, m);
        if (midN == 1) return mid;
        else if (midN == 0) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 56
    // -------------------------------------------------------------------------
    {
      order: 56,
      name: "Rate-Optimization Binary Search: Koko Eating Bananas (Minimum Feasible Speed)",
      slug: "dsa-koko-eating-bananas-binary-search",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Find the minimum integer eating speed k to finish all banana piles within h hours in O(N * log(max)) time using binary search on speed.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 56: Koko Eating Bananas",
          url: cleanUrl("http://www.youtube.com/watch?v=qyfekrNni90"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Koko Eating Bananas",
          url: "https://takeuforward.org/binary-search/koko-eating-bananas/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimum Speed to Arrive on Time",
          url: cleanUrl("https://leetcode.com/problems/minimum-speed-to-arrive-on-time/"),
          difficulty: "Medium",
          description: "Binary search for the minimum integer train speed needed to reach the office within hour.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Time to Complete Trips",
          url: cleanUrl("https://leetcode.com/problems/minimum-time-to-complete-trips/"),
          difficulty: "Medium",
          description: "Find the minimum time required for buses to complete at least totalTrips.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Minimum time to fulfil all orders",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-time-to-fulfil-all-orders/1"),
          difficulty: "Hard",
          description: "Use binary search on time to determine the minimum minutes needed to make N donuts.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Koko has \`N\` piles of bananas and \`h\` hours to eat them all. Each hour, she picks a pile and eats \`k\` bananas from it (if the pile has fewer than \`k\` bananas, she finishes that pile and waits until the next hour). Find the **minimum integer eating speed \`k\`** (bananas/hour) so she finishes all piles within \`h\` hours.

### 💡 Key Takeaways
- **Identifying the Search Range (\`[1, max(piles)]\`):**
  - The slowest speed Koko can try is \`1\` banana/hour.
  - The fastest speed she ever needs is \`max(piles)\` (the largest pile in the array), because eating any faster than \`max(piles)\` still takes \`1\` full hour per pile!
- **Calculating Total Hours for Speed \`mid\`:**
  - For each pile \`piles[i]\`, the hours needed is **\`ceil((double)piles[i] / (double)mid)\`**.
- **Binary Search Elimination (O(N * log2(maxElement)) Time):**
  - If \`totalHours <= h\`: Speed \`mid\` works! Since we want the **minimum** speed \`k\`, eliminate the right half (\`high = mid - 1\`) to try slower speeds.
  - If \`totalHours > h\`: Speed \`mid\` is too slow! Eliminate the left half (\`low = mid + 1\`) to try faster speeds.
  - By opposite polarity, \`low\` ends at the smallest valid speed \`k\`!

### 💻 Koko Eating Bananas Blueprint
\`\`\`cpp
long long calculateTotalHours(vector<int> &piles, int hourlySpeed) {
    long long totalH = 0;
    for (int bananas : piles) {
        totalH += ceil((double)bananas / (double)hourlySpeed);
    }
    return totalH;
}

int minEatingSpeed(vector<int> &piles, int h) {
    int low = 1, high = *max_element(piles.begin(), piles.end());
    while (low <= high) {
        int mid = low + (high - low) / 2;
        long long totalH = calculateTotalHours(piles, mid);
        if (totalH <= h) {
            high = mid - 1; // Possible; search left for a smaller speed
        } else {
            low = mid + 1;  // Too slow; search right for a faster speed
        }
    }
    return low;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 57
    // -------------------------------------------------------------------------
    {
      order: 57,
      name: "Adjacency-Constrained Answer Search: Minimum Days to Make M Bouquets",
      slug: "dsa-minimum-days-to-make-m-bouquets",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Determine the minimum bloom days required to make m bouquets of k adjacent flowers in O(N * log(max - min)) time using streak feasibility counting.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 57: Minimum days to make M bouquets",
          url: cleanUrl("http://www.youtube.com/watch?v=TXAuxeYBTdg"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum days to make M bouquets",
          url: "https://takeuforward.org/arrays/minimum-days-to-make-m-bouquets/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Magnetic Force Between Two Balls",
          url: cleanUrl("https://leetcode.com/problems/magnetic-force-between-two-balls/"),
          difficulty: "Medium",
          description: "Binary search on the answer space using a greedy placement feasibility check.",
        },
        {
          platform: "LeetCode",
          title: "Minimized Maximum of Products Distributed to Any Store",
          url: cleanUrl("https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/"),
          difficulty: "Medium",
          description: "Find the minimum maximum quantity distributed per store via binary search.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Allocate Minimum Pages",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1"),
          difficulty: "Medium",
          description: "Use binary search on the answer range to minimize the maximum pages allocated.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
You are given an array \`bloomDay\` where flower \`i\` blooms on day \`bloomDay[i]\`. You need to make \`m\` bouquets, and each bouquet requires **\`k\` adjacent bloomed flowers**. Find the **minimum number of days** you must wait to make \`m\` bouquets, or return \`-1\` if it is impossible.

### 💡 Key Takeaways
- **1. The Impossible Case Check (\`m * k > n\`):**
  - Making \`m\` bouquets of \`k\` flowers each requires \`m * k\` total flowers.
  - If \`(long long)m * k > arr.size()\`, even waiting forever won't give enough flowers—immediately return \`-1\`!
- **2. Defining the Tightest Search Range (\`[min(bloomDay), max(bloomDay)]\`):**
  - No flower blooms before \`min(bloomDay)\`, and *every* flower is bloomed by \`max(bloomDay)\`.
  - So set \`low = *min_element(...)\` and \`high = *max_element(...)\`.
- **3. Counting Bouquets on Day \`mid\` (\`possible(arr, mid, m, k)\`):**
  - Scan the array while maintaining a streak counter \`cnt = 0\` of consecutive bloomed flowers (\`arr[i] <= day\`).
  - Whenever you hit an unbloomed flower (\`arr[i] > day\`), add **\`noOfB += (cnt / k)\`** to your bouquet total and reset \`cnt = 0\`.
  - After the loop ends, remember to add the final streak: **\`noOfB += (cnt / k)\`**.
  - Return \`noOfB >= m\`.

### 💻 Minimum Days to Make M Bouquets Blueprint
\`\`\`cpp
bool possible(vector<int> &arr, int day, int m, int k) {
    int cnt = 0, noOfB = 0;
    for (int bloom : arr) {
        if (bloom <= day) {
            cnt++;
        } else {
            noOfB += (cnt / k);
            cnt = 0;
        }
    }
    noOfB += (cnt / k); // Don't forget the last streak at the end of the array!
    return noOfB >= m;
}

int minDays(vector<int> &bloomDay, int m, int k) {
    long long val = 1LL * m * k;
    if (val > bloomDay.size()) return -1;

    int low = *min_element(bloomDay.begin(), bloomDay.end());
    int high = *max_element(bloomDay.begin(), bloomDay.end());

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (possible(bloomDay, mid, m, k)) {
            high = mid - 1; // Possible; try earlier days
        } else {
            low = mid + 1;  // Not enough bouquets; wait more days
        }
    }
    return low;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 58
    // -------------------------------------------------------------------------
    {
      order: 58,
      name: "Ceiling-Sum Monotonicity: Finding the Smallest Divisor Given a Threshold",
      slug: "dsa-smallest-divisor-given-threshold",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Find the smallest positive divisor such that the sum of ceiling divisions is <= threshold in O(N * log(max)) time using answer space search.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 58: Find the Smallest Divisor Given a Threshold",
          url: cleanUrl("http://www.youtube.com/watch?v=UvBKTVaG6U8"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find the Smallest Divisor Given a Threshold",
          url: "https://takeuforward.org/arrays/find-the-smallest-divisor-given-a-threshold/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Maximum Candies Allocated to K Children",
          url: cleanUrl("https://leetcode.com/problems/maximum-candies-allocated-to-k-children/"),
          difficulty: "Medium",
          description: "Binary search for the largest divisor pile size such that at least k sub-piles can be formed.",
        },
        {
          platform: "LeetCode",
          title: "Sum of Mutated Array Closest to Target",
          url: cleanUrl("https://leetcode.com/problems/sum-of-mutated-array-closest-to-target/"),
          difficulty: "Medium",
          description: "Use binary search on the answer space to find the cap value that brings the array sum closest to target.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Smallest Divisor",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/smallest-divisor/1"),
          difficulty: "Medium",
          description: "Find the smallest positive integer divisor such that the sum of ceiling divisions is <= K.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of integers \`nums\` and an integer \`threshold\`, find the **smallest positive integer divisor \`d\`** such that if you divide every element in the array by \`d\` (rounding up via \`ceil\`) and sum the results, the total sum is \`<= threshold\`.

### 💡 Key Takeaways
- **Defining the Search Space (\`[1, max(nums)]\`):**
  - The smallest positive divisor is \`1\`.
  - Dividing by \`max(nums)\` (or anything larger) makes every element's ceiling division equal to \`1\`, producing the minimum possible sum of \`N\` (the array's size).
  - *Impossible Edge Case:* If \`nums.size() > threshold\`, even dividing by \`max(nums)\` gives a sum of \`N > threshold\`, so return \`-1\`!
- **Monotonicity of Divisor \`d\`:**
  - Smaller divisor \`d\` → Larger division sum (might exceed \`threshold\`).
  - Larger divisor \`d\` → Smaller division sum (fits under \`threshold\`).
- **Binary Search (O(N * log2(maxElement)) Time, O(1) Space):**
  - At \`mid\`, compute \`sumByD(nums, mid)\`.
  - If \`sum <= threshold\`: \`mid\` is valid! Since we want the **smallest** divisor, search left (\`high = mid - 1\`).
  - Otherwise (\`sum > threshold\`): \`mid\` is too small (sum is too big), so search right (\`low = mid + 1\`) to use a larger divisor.

### 💻 Smallest Divisor Blueprint
\`\`\`cpp
int sumByD(vector<int> &arr, int div) {
    int sum = 0;
    for (int x : arr) {
        sum += ceil((double)x / (double)div);
    }
    return sum;
}

int smallestDivisor(vector<int> &arr, int threshold) {
    if (arr.size() > threshold) return -1;
    int low = 1, high = *max_element(arr.begin(), arr.end());

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (sumByD(arr, mid) <= threshold) {
            high = mid - 1; // Valid divisor; look for a smaller one on the left
        } else {
            low = mid + 1;  // Sum exceeded threshold; need a larger divisor
        }
    }
    return low;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 59
    // -------------------------------------------------------------------------
    {
      order: 59,
      name: "Capacity-Bounded Partition Search: Least Capacity to Ship Packages Within D Days",
      slug: "dsa-capacity-to-ship-packages-within-d-days",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Find the minimum conveyor ship weight capacity to ship all packages within D days in O(N * log(sum - max)) time using greedy day simulation.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 59: Capacity to Ship Packages within D Days",
          url: cleanUrl("http://www.youtube.com/watch?v=MG-Ac4TAvTY"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Capacity to Ship Packages within D Days",
          url: "https://takeuforward.org/arrays/capacity-to-ship-packages-within-d-days/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Split Array Largest Sum",
          url: cleanUrl("https://leetcode.com/problems/split-array-largest-sum/"),
          difficulty: "Hard",
          description: "Apply the exact [maxElement, sumOfArray] binary search pattern to minimize the largest subarray sum.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Limit of Balls in a Bag",
          url: cleanUrl("https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/"),
          difficulty: "Medium",
          description: "Use binary search on the penalty answer space to minimize the maximum bag size.",
        },
        {
          platform: "GeeksforGeeks",
          title: "The Painter's Partition Problem-II",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/the-painters-partition-problem1535/1"),
          difficulty: "Hard",
          description: "Minimize the maximum time to paint all boards using binary search on capacity.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A conveyor belt has packages with weights \`weights[i]\` that must be shipped **in order** within \`D\` days. Find the **least weight capacity** of the ship so that all packages can be shipped within \`D\` days.

### 💡 Key Takeaways
- **Defining the Search Range (\`[max(weights), sum(weights)]\`):**
  - **Minimum Possible Capacity (\`low = max(weights)\`):** The ship's capacity cannot be less than the heaviest single package, or that package could never be loaded onto the ship!
  - **Maximum Needed Capacity (\`high = sum(weights)\`):** If the ship's capacity equals the sum of all weights, every package can be shipped in just \`1\` day.
- **Simulating Days Required for Capacity \`cap\` (\`findDays(weights, cap)\`):**
  - Start on \`days = 1\` with current \`load = 0\`.
  - For each package \`weights[i]\`:
    - If \`load + weights[i] > cap\`: It doesn't fit today—move to the next day (\`days++\`) and start the new day's load with \`load = weights[i]\`.
    - Otherwise: Load it onto today's ship (\`load += weights[i]\`).
- **Binary Search (O(N * log2(sum - max + 1)) Time, O(1) Space):**
  - If \`findDays(weights, mid) <= D\`: Capacity \`mid\` works! Search left (\`high = mid - 1\`) for a smaller capacity.
  - Otherwise: Capacity \`mid\` is too small (takes too many days), so search right (\`low = mid + 1\`).

### 💻 Capacity to Ship Packages Blueprint
\`\`\`cpp
int findDays(vector<int> &weights, int cap) {
    int days = 1, load = 0;
    for (int w : weights) {
        if (load + w > cap) {
            days += 1;
            load = w; // Load current package on the next day
        } else {
            load += w;
        }
    }
    return days;
}

int leastWeightCapacity(vector<int> &weights, int d) {
    int low = *max_element(weights.begin(), weights.end());
    int high = accumulate(weights.begin(), weights.end(), 0);

    while (low <= high) {
        int mid = low + (high - low) / 2;
        int numberOfDays = findDays(weights, mid);
        if (numberOfDays <= d) {
            high = mid - 1; // Possible; try smaller capacity
        } else {
            low = mid + 1;  // Too many days; increase capacity
        }
    }
    return low;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 60
    // -------------------------------------------------------------------------
    {
      order: 60,
      name: "Prefix Missing-Count Derivation: Finding the Kth Missing Positive Number in O(log N) Time",
      slug: "dsa-kth-missing-positive-number-binary-search",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Find the Kth missing positive integer in an increasing array in O(log N) time using binary search on missing = arr[mid] - (mid + 1) and low + k derivation.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 60: Kth Missing Positive Number",
          url: cleanUrl("http://www.youtube.com/watch?v=uZ0N_hZpyps"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Kth Missing Positive Number",
          url: "https://takeuforward.org/arrays/kth-missing-positive-number/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Missing Element in Sorted Array",
          url: cleanUrl("https://leetcode.com/problems/missing-element-in-sorted-array/"),
          difficulty: "Medium",
          description: "Find the kth missing number starting from the leftmost element of a sorted array.",
        },
        {
          platform: "LeetCode",
          title: "First Missing Positive",
          url: cleanUrl("https://leetcode.com/problems/first-missing-positive/"),
          difficulty: "Hard",
          description: "Find the smallest missing positive integer in an unsorted array in O(N) time and O(1) space.",
        },
        {
          platform: "GeeksforGeeks",
          title: "K-th missing element",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/k-th-missing-element3635/1"),
          difficulty: "Basic",
          description: "Find the K-th missing element in an increasing sequence of integers.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a strictly increasing array of positive integers (e.g., \`[2, 3, 4, 7, 11]\`) and an integer \`k = 5\`, find the **\`k\`-th positive integer that is missing** from this array (here the missing positives are \`[1, 5, 6, 8, 9, 10...]\`, so the 5th missing number is \`9\`).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Shift (O(N) Time):**
  - Start with \`ans = k\`. Loop through each \`arr[i]\`: whenever \`arr[i] <= k\`, that element occupies one of the spots before \`k\`, so increment \`k++\`; otherwise \`break\` and return \`k\`.
- **2. Optimal Binary Search + Mathematical Formula (O(log2 N) Time, O(1) Space):**
  - **How Many Numbers Are Missing Up to Index \`i\`?**
    - If no numbers were missing, index \`i\` (0-based) would hold the number \`i + 1\`.
    - Since it actually holds \`arr[i]\`, the count of missing numbers up to index \`i\` is:
      **\`missing = arr[i] - (i + 1)\`**!
  - **Binary Search for the Bounding Indices:**
    - Run Binary Search on \`[0 ... n - 1]\`:
    - If \`missing < k\`, we need more missing numbers—move right (\`low = mid + 1\`).
    - Otherwise (\`missing >= k\`), move left (\`high = mid - 1\`).
  - **The Clean Algebraic Derivation (\`low + k\` or \`high + 1 + k\`):**
    - When the loop ends, \`high\` and \`low\` cross (\`low == high + 1\`) right around where the \`k\`-th missing number belongs.
    - Instead of computing \`arr[high] + more\` (which crashes when \`high == -1\` if the missing number is smaller than \`arr[0]\`), substitute \`more = k - (arr[high] - high - 1)\`:
      \`Answer = arr[high] + k - arr[high] + high + 1\` → **\`high + 1 + k\`** (which equals **\`low + k\`**)!

### 💻 Kth Missing Positive Number Blueprint
\`\`\`cpp
int findKthPositive(vector<int> &arr, int k) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int missing = arr[mid] - (mid + 1);
        if (missing < k) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return k + high + 1; // Or equivalently: return low + k;
}
\`\`\``,
    },
  ];

  // 4. Upsert topics in database
  const topicIdMap = new Map();

  for (const topic of batch6Topics) {
    const cleanedSummary = cleanText(topic.summaryMarkdown);
    const cleanedDescription = cleanText(topic.description);
    const cleanedPracticeItems = topic.practiceItems.map((p) => ({
      ...p,
      title: cleanText(p.title),
      description: cleanText(p.description),
      url: cleanUrl(p.url),
    }));

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
        cleanedDescription,
        topic.subtrack,
        cleanedSummary,
        cleanedSummary, // Sync theory_summary with summary_markdown
        JSON.stringify(topic.docLinks),
        JSON.stringify(topic.videoLinks),
        JSON.stringify(cleanedPracticeItems),
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
          cleanUrl(topic.videoLinks[0].url),
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
          cleanUrl(topic.docLinks[0].url),
          Math.round(topic.estimatedMinutes * 0.5),
        ]
      );
    }

    // Additional Practice Problems in resources table
    if (cleanedPracticeItems && cleanedPracticeItems.length > 0) {
      for (const pItem of cleanedPracticeItems) {
        await pool.query(
          `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
           VALUES ($1, $2, $3, 'practice', 20)`,
          [
            seededTopic.id,
            `[${pItem.platform}] ${pItem.title} (${pItem.difficulty})`,
            cleanUrl(pItem.url),
          ]
        );
      }
    }
  }

  // 5. Update track_topics: Link Batch 6 Topics to topic_order 51 through 60
  console.log("\n🔄 Linking Batch 6 topics to 'problem-solving-dsa-sql' (orders 51..60)...");

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

  // Link Batch 6 Topics (orders 51..60)
  for (const topicDef of batch6Topics) {
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

  console.log("\n🎉 DSA Batch 6 (Lectures 51–60) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch6()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch6;
