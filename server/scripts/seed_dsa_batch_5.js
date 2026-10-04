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

const seedDsaBatch5 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 5 (Lectures 41–50) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 5 Topics (Lectures 41–50)
  const batch5Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 11: Advanced Array Patterns & Hard Interview Problems (Topics 41–44)
    // =========================================================================
    {
      order: 41,
      name: "Algebraic Sum-of-Squares & XOR Bit-Bucketing: Find the Repeating and Missing Number",
      slug: "dsa-find-missing-and-repeating-number",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Find the repeating and missing elements in an array of size N from 1 to N in O(N) time and O(1) space using algebraic difference of sums or bitwise XOR bucketing.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 41: Find the repeating and missing number",
          url: "https://www.youtube.com/watch?v=2D0D8HE6uak",
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find the repeating and missing numbers",
          url: "https://takeuforward.org/data-structure/find-the-repeating-and-missing-numbers/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find the Duplicate Number",
          url: "https://leetcode.com/problems/find-the-duplicate-number/",
          difficulty: "Medium",
          description: "Find the single repeated integer in an array of N + 1 integers in the range [1, N] using O(1) extra space.",
        },
        {
          platform: "LeetCode",
          title: "Find All Numbers Disappeared in an Array",
          url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
          difficulty: "Easy",
          description: "Identify all missing numbers in the range [1, N] in O(N) time and O(1) auxiliary space.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Two Repeated Elements",
          url: "https://www.geeksforgeeks.org/problems/two-repeated-elements-1587115621/1",
          difficulty: "Medium",
          description: "Find the two repeating numbers in an array of N + 2 elements ranging from 1 to N.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of \`N\` integers where values are supposed to be from \`1\` to \`N\`, one number \`X\` appears **twice** (repeating) and one number \`Y\` is **missing**. Your goal is to find \`{X, Y}\` in \`O(N)\` time and \`O(1)\` extra space.

### 💡 Key Takeaways (Brute → Better → 2 Optimal Solutions)
- **1. Brute Force (O(N²) Time, O(1) Space):** For each number from \`1\` to \`N\`, scan the array to count its occurrences (\`count == 2\` is repeating, \`count == 0\` is missing).
- **2. Better Approach via Hashing (O(2N) Time, O(N) Space):** Use a frequency array \`hash[N + 1] = {0}\` to record counts in one pass, then scan \`1\` to \`N\` to find which number has count \`2\` and which has count \`0\`.
- **3. Optimal Approach 1 — Basic Algebra (O(N) Time, O(1) Space):**
  - Let \`S\` be the sum of array elements and \`SN = N * (N + 1) / 2\` be the sum of \`1\` to \`N\`.
  - Subtracting gives Equation 1: **\`X - Y = S - SN\`** (\`val1\`).
  - Let \`S2\` be the sum of squares of array elements and \`S2N = N * (N + 1) * (2N + 1) / 6\`.
  - Subtracting gives: \`X² - Y² = (X - Y)(X + Y) = S2 - S2N\` (\`val2\`).
  - Divide \`val2 / val1\` to get Equation 2: **\`X + Y = val2 / val1\`**.
  - Add both equations to solve for \`X = (val1 + val2) / 2\` and \`Y = X - val1\`!
- **4. Optimal Approach 2 — Bitwise XOR Bucketing (O(N) Time, O(1) Space):**
  - XOR all array elements with \`1..N\` to get \`xr = X ^ Y\`.
  - Find the rightmost set bit where \`X\` and \`Y\` differ (\`number = xr & ~(xr - 1)\`), split all array elements and \`1..N\` into two XOR buckets (bit set vs. bit unset) to isolate \`X\` and \`Y\`, and verify which one appears twice in the array.

### 💻 Optimal Algebraic Solution Blueprint
\`\`\`cpp
vector<int> findMissingRepeatingNumbers(vector<int> a) {
    long long n = a.size();
    long long SN = (n * (n + 1)) / 2;
    long long S2N = (n * (n + 1) * (2 * n + 1)) / 6;
    long long S = 0, S2 = 0;

    for (int i = 0; i < n; i++) {
        S += a[i];
        S2 += (long long)a[i] * (long long)a[i];
    }
    long long val1 = S - SN;         // X - Y
    long long val2 = S2 - S2N;       // X^2 - Y^2
    val2 = val2 / val1;              // X + Y
    long long x = (val1 + val2) / 2; // Repeating number
    long long y = x - val1;          // Missing number
    return {(int)x, (int)y};
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 42
    // -------------------------------------------------------------------------
    {
      order: 42,
      name: "Divide & Conquer Inversion Counting: Modified Merge Sort for Ordered Pairs (A[i] > A[j])",
      slug: "dsa-count-inversions-merge-sort",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Count all inversion pairs (i < j and arr[i] > arr[j]) in O(N log N) time and O(N) auxiliary space using a modified divide-and-conquer Merge Sort.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 42: Count Inversions in an Array",
          url: "https://www.youtube.com/watch?v=AseUmwVNaoY",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count inversions in an array",
          url: "https://takeuforward.org/data-structure/count-inversions-in-an-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Global and Local Inversions",
          url: "https://leetcode.com/problems/global-and-local-inversions/",
          difficulty: "Medium",
          description: "Compare total array inversions against adjacent local inversions.",
        },
        {
          platform: "LeetCode",
          title: "Count of Smaller Numbers After Self",
          url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
          difficulty: "Hard",
          description: "Use modified Merge Sort to count how many smaller elements appear to the right of each index.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count Smaller elements",
          url: "https://www.geeksforgeeks.org/problems/count-smaller-elements2214/1",
          difficulty: "Medium",
          description: "Construct an array where each index stores the count of smaller elements to its right.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
An **inversion** in an array is a pair of indices \`(i, j)\` such that \`i < j\` (left comes before right) and **\`arr[i] > arr[j]\`** (the left element is strictly greater than the right element).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force (O(N²) Time, O(1) Space):**
  - Use two nested loops (\`i\` from \`0\` to \`n - 1\`, \`j\` from \`i + 1\` to \`n - 1\`) and increment \`cnt++\` whenever \`arr[i] > arr[j]\`.
- **2. Optimal Modified Merge Sort (O(N log N) Time, O(N) Space):**
  - Imagine we have two **sorted** halves during Merge Sort: \`left\` (\`[low ... mid]\`) and \`right\` (\`[mid + 1 ... high]\`).
  - When comparing \`arr[left]\` and \`arr[right]\`:
    - If \`arr[left] <= arr[right]\`: No inversion is formed; push \`arr[left]\` and move \`left++\`.
    - If **\`arr[left] > arr[right]\`**: Since the \`left\` half is sorted in ascending order, **every element from \`left\` up to \`mid\`** is also strictly greater than \`arr[right]\`!
    - Therefore, in a single step, we add **\`cnt += (mid - left + 1)\`** to our inversion count, push \`arr[right]\`, and move \`right++\`.

### 💻 Modified Merge Sort Blueprint
\`\`\`cpp
int mergeAndCount(vector<int> &arr, int low, int mid, int high) {
    vector<int> temp;
    int left = low, right = mid + 1, cnt = 0;

    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right]) {
            temp.push_back(arr[left++]);
        } else {
            temp.push_back(arr[right++]);
            cnt += (mid - left + 1); // All remaining elements in left half > arr[right]
        }
    }
    while (left <= mid) temp.push_back(arr[left++]);
    while (right <= high) temp.push_back(arr[right++]);
    for (int i = low; i <= high; i++) arr[i] = temp[i - low];
    return cnt;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 43
    // -------------------------------------------------------------------------
    {
      order: 43,
      name: "Asymmetric Merge-Sort Counting: Reverse Pairs (A[i] > 2 * A[j])",
      slug: "dsa-reverse-pairs-merge-sort",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Count all reverse pairs (i < j and arr[i] > 2 * arr[j]) in O(N log N) time by decoupling the two-pointer counting step immediately before each merge step.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 43: Count Reverse Pairs",
          url: "https://www.youtube.com/watch?v=0e4bZaP3MDI",
          duration: "34m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count Reverse Pairs",
          url: "https://takeuforward.org/data-structure/count-reverse-pairs/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Pairs Satisfying Inequality",
          url: "https://leetcode.com/problems/number-of-pairs-satisfying-inequality/",
          difficulty: "Hard",
          description: "Use divide-and-conquer merge sort to count index pairs satisfying a shifted inequality.",
        },
        {
          platform: "LeetCode",
          title: "Count of Range Sum",
          url: "https://leetcode.com/problems/count-of-range-sum/",
          difficulty: "Hard",
          description: "Apply two-pointer counting before the merge step on prefix sums.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number of pairs",
          url: "https://www.geeksforgeeks.org/problems/number-of-pairs-1587115620/1",
          difficulty: "Medium",
          description: "Count pairs across two arrays satisfying an exponential inequality condition.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A **Reverse Pair** is a pair of indices \`(i, j)\` such that \`i < j\` and **\`arr[i] > 2 * arr[j]\`**. While similar to Count Inversions, the \`2 * arr[j]\` condition means we **cannot** count pairs inside the standard merge loop—we must count them in a dedicated pass right **before** merging!

### 💡 Key Takeaways
- **Why Standard Inversion Counting Fails Here:**
  - In Count Inversions, if \`arr[left] > arr[right]\`, we both counted the pair and merged \`arr[right]\`.
  - Here, an element \`arr[left]\` (like \`6\`) might be greater than \`arr[right]\` (like \`3\`), so \`3\` gets merged first—even though \`6\` is **not** greater than \`2 * 3\` (\`6\`)! Meanwhile, a larger element later in the left half (like \`13\`) *is* greater than \`2 * 3\`.
- **Optimal Two-Pointer Pass Before Merging (O(2N log N) Time, O(N) Space):**
  - Before calling \`merge(arr, low, mid, high)\`, run \`countPairs(arr, low, mid, high)\`:
    - Keep \`right = mid + 1\`.
    - Loop \`i\` through the left half (\`low\` to \`mid\`).
    - Advance \`right\` while \`right <= high && arr[i] > 2LL * arr[right]\`.
    - Because both halves are sorted, all elements from \`mid + 1\` to \`right - 1\` form valid reverse pairs with \`arr[i]\`, so add **\`cnt += (right - (mid + 1))\`**.
    - Notice \`right\` **never resets** back to \`mid + 1\` when \`i\` increments, because \`arr[i + 1] >= arr[i]\`—so the entire \`countPairs\` function runs in \`O(N1 + N2)\` linear time!

### 💻 Count Reverse Pairs Helper (Called Before Merge)
\`\`\`cpp
int countPairs(vector<int> &arr, int low, int mid, int high) {
    int right = mid + 1, cnt = 0;
    for (int i = low; i <= mid; i++) {
        while (right <= high && (long long)arr[i] > 2LL * arr[right]) {
            right++;
        }
        cnt += (right - (mid + 1));
    }
    return cnt;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 44
    // -------------------------------------------------------------------------
    {
      order: 44,
      name: "Bidirectional Prefix-Suffix Accumulation: Maximum Product Subarray",
      slug: "dsa-maximum-product-subarray-prefix-suffix",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Find the contiguous subarray with the maximum product in O(N) time and O(1) space using simultaneous forward prefix and backward suffix accumulations.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 44: Maximum Product Subarray in an Array",
          url: "https://www.youtube.com/watch?v=hnswaLJvr6g",
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Product Subarray in an Array",
          url: "https://takeuforward.org/data-structure/maximum-product-subarray-in-an-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Product of Array Except Self",
          url: "https://leetcode.com/problems/product-of-array-except-self/",
          difficulty: "Medium",
          description: "Use prefix and suffix running products to compute array products without division.",
        },
        {
          platform: "LeetCode",
          title: "Subarray Product Less Than K",
          url: "https://leetcode.com/problems/subarray-product-less-than-k/",
          difficulty: "Medium",
          description: "Count contiguous subarrays whose product is strictly less than K.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count the subarrays having product less than k",
          url: "https://www.geeksforgeeks.org/problems/count-the-subarrays-having-product-less-than-k1708/1",
          difficulty: "Medium",
          description: "Maintain a running product window to count valid subarrays in O(N) time.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an integer array containing positives, negatives, and zeros, find the contiguous subarray that has the **largest product** and return that product.

### 💡 Key Takeaways (The 4 Observations)
Instead of memorizing non-intuitive DP formulas, solve this problem in **O(N) time** and **O(1) space** using four simple observations:
1. **All Positives:** The answer is simply the product of the entire array.
2. **Even Number of Negatives:** Multiplying an even number of negatives gives a positive number—so the answer is still the product of the entire array!
3. **Odd Number of Negatives:** To get a positive product, we must **exclude one negative number**. Excluding any single negative splits the array into a **prefix** (everything before that negative) and a **suffix** (everything after that negative). Thus, the maximum product will always be either a prefix product from the left or a suffix product from the right!
4. **Zeros in the Array:** Multiplying by \`0\` turns any running product into \`0\`. Whenever \`pre == 0\` or \`suff == 0\`, simply **reset it to \`1\`** to start a fresh subarray after the zero!

### 💻 Prefix & Suffix Single-Pass Blueprint
\`\`\`cpp
int maxProductSubarray(vector<int> &arr) {
    int n = arr.size();
    int pre = 1, suff = 1, ans = INT_MIN;

    for (int i = 0; i < n; i++) {
        if (pre == 0) pre = 1;   // Reset after encountering a 0
        if (suff == 0) suff = 1;

        pre = pre * arr[i];
        suff = suff * arr[n - i - 1];
        ans = max(ans, max(pre, suff));
    }
    return ans;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 12: 1D Binary Search, Bounds & Rotated Array Invariants (Topics 45–50)
    // =========================================================================
    {
      order: 45,
      name: "Binary Search Mechanics: Search Space Halving, Iterative vs. Recursive & Overflow Prevention",
      slug: "dsa-binary-search-introduction-iterative-recursive",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Understand binary search principles on sorted arrays, call stack mechanics in iterative vs recursive implementations, and 32-bit midpoint overflow prevention.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 45: Binary Search Explained",
          url: "https://www.youtube.com/watch?v=MHf6awe89xw",
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Binary Search Explained",
          url: "https://takeuforward.org/data-structure/binary-search-explained/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Guess Number Higher or Lower",
          url: "https://leetcode.com/problems/guess-number-higher-or-lower/",
          difficulty: "Easy",
          description: "Apply overflow-safe midpoint calculation to locate a secret number in [1, N].",
        },
        {
          platform: "LeetCode",
          title: "First Bad Version",
          url: "https://leetcode.com/problems/first-bad-version/",
          difficulty: "Easy",
          description: "Minimize API calls across a 1-to-N search space using binary search.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Searching an element in a sorted array",
          url: "https://www.geeksforgeeks.org/problems/who-will-win-1587115621/1",
          difficulty: "Basic",
          description: "Verify whether K is present in a sorted array in O(log N) time.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
**Binary Search** is a searching algorithm that works on any **sorted search space**. Instead of scanning elements one by one in \`O(N)\` time (Linear Search), Binary Search repeatedly cuts the search space in half, finding the target in **O(log2 N) time**.

### 💡 Key Takeaways
- **How Binary Search Works:**
  - Define the active search space between \`low = 0\` and \`high = n - 1\`.
  - While \`low <= high\`, inspect the middle index \`mid\`:
    1. If \`arr[mid] == target\`: Target found! Return \`mid\`.
    2. If \`target > arr[mid]\`: Target can only lie on the right half—eliminate the left half by setting \`low = mid + 1\`.
    3. If \`target < arr[mid]\`: Target can only lie on the left half—eliminate the right half by setting \`high = mid - 1\`.
  - If \`low\` crosses \`high\` (\`low > high\`), the search space is empty and the target does not exist (return \`-1\`).
- **Why Time Complexity is O(log2 N):**
  - An array of size \`32\` (\`2^5\`) is halved \`32 → 16 → 8 → 4 → 2 → 1\` in just ~5 steps (\`log2(32) = 5\`).
- **Preventing Integer Overflow in \`mid\`:**
  - If \`low\` and \`high\` are both near \`INT_MAX\`, calculating \`(low + high) / 2\` overflows a 32-bit \`int\`!
  - Always write: **\`mid = low + (high - low) / 2\`**.

### 💻 Iterative & Recursive Binary Search Blueprint
\`\`\`cpp
int binarySearchIterative(vector<int> &nums, int target) {
    int low = 0, high = (int)nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents (low + high) overflow
        if (nums[mid] == target) return mid;
        else if (target > nums[mid]) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 46
    // -------------------------------------------------------------------------
    {
      order: 46,
      name: "Monotonic Boundary Search: Lower Bound, Upper Bound, Search Insert Position & Floor/Ceil",
      slug: "dsa-lower-bound-upper-bound-floor-ceil",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Implement Lower Bound (smallest index with arr[i] >= x) and Upper Bound (arr[i] > x) in O(log N) time to solve Search Insert Position and Floor/Ceil queries.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 46: Implement Lower Bound and Upper Bound",
          url: "https://www.youtube.com/watch?v=6zhGS79oQ4k",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Implement Lower Bound",
          url: "https://takeuforward.org/arrays/implement-lower-bound/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find Smallest Letter Greater Than Target",
          url: "https://leetcode.com/problems/find-smallest-letter-greater-than-target/",
          difficulty: "Easy",
          description: "Apply Upper Bound binary search on a sorted character array with wrap-around.",
        },
        {
          platform: "LeetCode",
          title: "Find the Distance Value Between Two Arrays",
          url: "https://leetcode.com/problems/find-the-distance-value-between-two-arrays/",
          difficulty: "Easy",
          description: "Use lower_bound on a sorted array to check if any element falls within [x - d, x + d].",
        },
        {
          platform: "GeeksforGeeks",
          title: "Counting elements in two arrays",
          url: "https://www.geeksforgeeks.org/problems/counting-elements-in-two-arrays/1",
          difficulty: "Medium",
          description: "Use Upper Bound to count how many elements in arr2 are <= each element in arr1.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Mastering **Lower Bound** and **Upper Bound** in \`O(log2 N)\` time unlocks dozens of binary search interview questions—including **Search Insert Position** and **Floor & Ceil in a Sorted Array**.

### 💡 Key Takeaways
- **1. Lower Bound (\`arr[ind] >= x\`):**
  - The **smallest index \`ind\`** such that \`arr[ind] >= x\`. (If all elements are smaller than \`x\`, return \`n\`).
  - Whenever \`arr[mid] >= x\`, record \`ans = mid\` as a possible answer and search left (\`high = mid - 1\`) for an even smaller index. Otherwise, search right (\`low = mid + 1\`).
  - *C++ STL Shortcut:* \`lower_bound(arr.begin(), arr.end(), x) - arr.begin()\`.
- **2. Upper Bound (\`arr[ind] > x\`):**
  - The **smallest index \`ind\`** such that \`arr[ind] > x\` (strictly greater).
  - Identical code to Lower Bound, except the condition changes from \`>=\` to **\`>\`** (\`if (arr[mid] > x)\`)!
  - *C++ STL Shortcut:* \`upper_bound(arr.begin(), arr.end(), x) - arr.begin()\`.
- **3. Search Insert Position:**
  - Finding the index where \`x\` is present (or where it would be inserted in sorted order) is **100% identical to Lower Bound**!
- **4. Floor and Ceil in a Sorted Array:**
  - **Ceil of \`x\`:** Smallest element in the array \`>= x\` (the value at the Lower Bound index).
  - **Floor of \`x\`:** Largest element in the array \`<= x\` (if \`arr[mid] <= x\`, store \`ans = arr[mid]\` and move right \`low = mid + 1\`).

### 💻 Lower Bound & Upper Bound Blueprint
\`\`\`cpp
int lowerBound(vector<int> &arr, int n, int x) {
    int low = 0, high = n - 1, ans = n;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] >= x) { // Change >= to > for upperBound!
            ans = mid;
            high = mid - 1;  // Look for a smaller valid index on the left
        } else {
            low = mid + 1;
        }
    }
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 47
    // -------------------------------------------------------------------------
    {
      order: 47,
      name: "Boundary Index Pinpointing: First and Last Position of Element & Total Occurrence Count",
      slug: "dsa-first-and-last-occurrences-in-sorted-array",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Find the first and last occurrence indices of a target in a sorted duplicate array and compute its total frequency count in O(log N) time.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 47: First and Last Occurrences in Array",
          url: "https://www.youtube.com/watch?v=hjR1IYVx9lY",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count Occurrences in Sorted Array",
          url: "https://takeuforward.org/data-structure/count-occurrences-in-sorted-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find Target Indices After Sorting Array",
          url: "https://leetcode.com/problems/find-target-indices-after-sorting-array/",
          difficulty: "Easy",
          description: "Identify all matching target indices in a sorted array.",
        },
        {
          platform: "LeetCode",
          title: "Element Appearing More Than 25% In Sorted Array",
          url: "https://leetcode.com/problems/element-appearing-more-than-25-in-sorted-array/",
          difficulty: "Easy",
          description: "Use binary search first/last occurrence bounds to verify element frequency in O(log N) time.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Left most and right most index",
          url: "https://www.geeksforgeeks.org/problems/find-first-and-last-occurrence-of-x0849/1",
          difficulty: "Easy",
          description: "Find the first and last occurrence indices of X in a sorted array.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a sorted array with duplicate elements and a target \`X\`, find:
1. The **first and last index** where \`X\` occurs (or \`{-1, -1}\` if not present).
2. The **total number of occurrences** of \`X\` in \`O(log2 N)\` time.

### 💡 Key Takeaways
- **Method 1: Using Lower Bound & Upper Bound (2 * O(log2 N) Time):**
  - Find \`lb = lowerBound(arr, n, x)\`.
  - **Edge Case Check:** If \`lb == n || arr[lb] != x\`, then \`x\` does not exist in the array—return \`{-1, -1}\`!
  - Otherwise, the first occurrence is \`lb\` and the last occurrence is \`upperBound(arr, n, x) - 1\`.
- **Method 2: Raw Binary Search From Scratch (Without Bounds):**
  - **First Occurrence:** When \`arr[mid] == x\`, save \`first = mid\` and search **left** (\`high = mid - 1\`) to see if \`x\` appeared earlier.
  - **Last Occurrence:** When \`arr[mid] == x\`, save \`last = mid\` and search **right** (\`low = mid + 1\`) to see if \`x\` appears later.
  - *Optimization:* If \`first == -1\`, return \`{-1, -1}\` immediately without running the second binary search!
- **Counting Total Occurrences in O(log2 N):**
  - Once you have \`{first, last}\`, the total count of \`x\` in the sorted array is simply: **\`count = last - first + 1\`** (or \`0\` if \`first == -1\`)!

### 💻 First & Last Occurrence Blueprint
\`\`\`cpp
int firstOccurrence(vector<int> &arr, int x) {
    int low = 0, high = (int)arr.size() - 1, first = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == x) {
            first = mid;
            high = mid - 1; // Keep searching left for earlier occurrence
        } else if (arr[mid] < x) low = mid + 1;
        else high = mid - 1;
    }
    return first;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 48
    // -------------------------------------------------------------------------
    {
      order: 48,
      name: "Rotated Array Binary Search I: Identifying the Sorted Half in Distinct Elements",
      slug: "dsa-search-in-rotated-sorted-array-unique",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Search for a target key in a pivoted rotated sorted array of unique integers in O(log N) time using the sorted half identification invariant.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 48: Search in Rotated Sorted Array I",
          url: "https://www.youtube.com/watch?v=5qGrJbHhqFs",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Search in Rotated Sorted Array I",
          url: "https://takeuforward.org/data-structure/search-element-in-a-rotated-sorted-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Peak Index in a Mountain Array",
          url: "https://leetcode.com/problems/peak-index-in-a-mountain-array/",
          difficulty: "Medium",
          description: "Use binary search slope comparison to locate the peak index in O(log N) time.",
        },
        {
          platform: "LeetCode",
          title: "Find Minimum in Rotated Sorted Array",
          url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
          difficulty: "Medium",
          description: "Identify the sorted half to find the pivot minimum in a rotated array.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Search in a Rotated Array",
          url: "https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1",
          difficulty: "Medium",
          description: "Locate the index of a target key in a rotated sorted array of distinct elements.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a sorted array of **distinct** integers that has been rotated at some unknown pivot (e.g., \`[7, 8, 9, 1, 2, 3, 4, 5, 6]\`), find the index of \`target\` in **O(log2 N) time**.

### 💡 Key Takeaways
- **Why Standard Binary Search Fails:**
  - In a rotated array, comparing \`target\` with \`arr[mid]\` alone is not enough to know whether \`target\` is on the left or right, because one of the halves contains the rotation drop.
- **The Core Invariant ("Identify the Sorted Half"):**
  - Whenever you split a rotated sorted array at \`mid\`, **at least one half (either \`[low ... mid]\` or \`[mid ... high]\`) is guaranteed to be completely sorted**!
  - **Step 1:** Check if \`arr[mid] == target\`. If so, return \`mid\`.
  - **Step 2:** Check if the **left half is sorted** (\`arr[low] <= arr[mid]\`):
    - If \`target\` lies within the sorted left half (\`arr[low] <= target && target <= arr[mid]\`), eliminate the right half (\`high = mid - 1\`).
    - Otherwise, eliminate the left half (\`low = mid + 1\`).
  - **Step 3:** Otherwise, the **right half must be sorted** (\`arr[mid] <= arr[high]\`):
    - If \`target\` lies within the sorted right half (\`arr[mid] <= target && target <= arr[high]\`), eliminate the left half (\`low = mid + 1\`).
    - Otherwise, eliminate the right half (\`high = mid - 1\`).

### 💻 Search in Rotated Sorted Array I Blueprint
\`\`\`cpp
int searchRotated(vector<int> &arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;

        // 1. If Left Half is sorted
        if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target <= arr[mid]) high = mid - 1;
            else low = mid + 1;
        }
        // 2. Otherwise Right Half is sorted
        else {
            if (arr[mid] <= target && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 49
    // -------------------------------------------------------------------------
    {
      order: 49,
      name: "Rotated Array Binary Search II: Handling Duplicate Boundary Ambiguity (low == mid == high)",
      slug: "dsa-search-in-rotated-sorted-array-duplicates",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Search in a rotated sorted array containing duplicates by shrinking ambiguous low and high boundaries when arr[low] == arr[mid] == arr[high].",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 49: Search in Rotated Sorted Array II with Duplicates",
          url: "https://www.youtube.com/watch?v=w2G2W8l__pc",
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Search in Rotated Sorted Array II",
          url: "https://takeuforward.org/arrays/search-in-rotated-sorted-array-ii/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find Minimum in Rotated Sorted Array II",
          url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
          difficulty: "Hard",
          description: "Handle the low == mid == high duplicate edge case while finding the minimum element.",
        },
        {
          platform: "LeetCode",
          title: "Find in Mountain Array",
          url: "https://leetcode.com/problems/find-in-mountain-array/",
          difficulty: "Hard",
          description: "Combine peak finding with binary search on ascending and descending halves.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Search in Rotated Array 2",
          url: "https://www.geeksforgeeks.org/problems/search-in-rotated-array-2/1",
          difficulty: "Medium",
          description: "Check whether a target key exists in a rotated sorted array containing duplicate values.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
What happens to "Search in a Rotated Sorted Array" when the array contains **duplicate elements** (e.g., \`[3, 1, 2, 3, 3, 3, 3]\`)?

### 💡 Key Takeaways
- **Where Part I's Logic Breaks Down:**
  - In Part I, we compared \`arr[low] <= arr[mid]\` to tell which half was sorted.
  - When duplicates exist, we can hit the edge case: **\`arr[low] == arr[mid] && arr[mid] == arr[high]\`** (for example, all three are \`3\`).
  - When \`low\`, \`mid\`, and \`high\` all have the exact same value, it is impossible to tell whether the left half or the right half is sorted!
- **The 3-Line Shrink Fix:**
  - Since we already checked \`if (arr[mid] == target)\` at the top of the loop, if \`arr[low] == arr[mid] && arr[mid] == arr[high]\`, then \`arr[low]\` and \`arr[high]\` are also **not** the target!
  - Simply shrink both ends inward: **\`low++\`, \`high--\`, and \`continue\`** to the next iteration until the tie is broken!
- **Time Complexity:**
  - **Average Case:** \`O(log2 N)\`.
  - **Worst Case:** \`O(N / 2) → O(N)\` when almost all elements are identical (e.g., \`[3, 3, 1, 3, 3, 3, 3]\`) and we have to shrink \`low++\` and \`high--\` step by step.

### 💻 Search in Rotated Sorted Array II Blueprint
\`\`\`cpp
bool searchRotatedWithDuplicates(vector<int> &arr, int target) {
    int low = 0, high = (int)arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return true;

        // Edge case caused by duplicates: shrink both boundaries
        if (arr[low] == arr[mid] && arr[mid] == arr[high]) {
            low++;
            high--;
            continue;
        }
        if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target <= arr[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (arr[mid] <= target && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return false;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 50
    // -------------------------------------------------------------------------
    {
      order: 50,
      name: "Pivot Minimum Extraction: Finding the Minimum Element in a Rotated Sorted Array",
      slug: "dsa-minimum-in-rotated-sorted-array",
      subtrack: "Module 12: 1D Binary Search, Bounds & Rotated Array Invariants",
      description: "Find the minimum element in a rotated sorted array in O(log N) time by repeatedly recording the lowest value of the sorted half and eliminating it.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 50: Find Minimum in Rotated Sorted Array",
          url: "https://www.youtube.com/watch?v=nhEMDKMB44g",
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum in Rotated Sorted Array",
          url: "https://takeuforward.org/data-structure/minimum-in-rotated-sorted-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find Minimum in Rotated Sorted Array II",
          url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
          difficulty: "Hard",
          description: "Find the minimum element in a rotated sorted array that may contain duplicates.",
        },
        {
          platform: "LeetCode",
          title: "Find Peak Element",
          url: "https://leetcode.com/problems/find-peak-element/",
          difficulty: "Medium",
          description: "Use binary search to find a local maximum in O(log N) time.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Find Kth Rotation",
          url: "https://www.geeksforgeeks.org/problems/rotation4723/1",
          difficulty: "Easy",
          description: "Find how many times a sorted array has been rotated by locating the index of its minimum element.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a rotated sorted array of unique elements (e.g., \`[4, 5, 6, 7, 0, 1, 2]\`), find the **minimum element** in **O(log2 N) time**.

### 💡 Key Takeaways
- **Core Idea ("Pick the Minimum from the Sorted Half & Eliminate It"):**
  - Maintain \`ans = INT_MAX\`.
  - At every step \`mid\`, identify which half is sorted:
    1. **If the Left Half \`[low ... mid]\` is sorted (\`arr[low] <= arr[mid]\`):**
       - Because \`[low ... mid]\` is sorted, its smallest element is guaranteed to be \`arr[low]\`!
       - Update \`ans = min(ans, arr[low])\`, then **eliminate the entire left half** (\`low = mid + 1\`) and search the right half.
    2. **Otherwise, the Right Half \`[mid ... high]\` is sorted:**
       - Because \`[mid ... high]\` is sorted, its smallest element is guaranteed to be \`arr[mid]\`!
       - Update \`ans = min(ans, arr[mid])\`, then **eliminate the entire right half** (\`high = mid - 1\`) and search the left half.
- **Early Exit Optimization:**
  - If at any point \`arr[low] <= arr[high]\`, the entire remaining search space \`[low ... high]\` is already sorted—simply take \`ans = min(ans, arr[low])\` and \`break\` immediately!

### 💻 Minimum in Rotated Sorted Array Blueprint
\`\`\`cpp
int findMin(vector<int> &arr) {
    int low = 0, high = (int)arr.size() - 1, ans = INT_MAX;
    while (low <= high) {
        int mid = low + (high - low) / 2;

        // Optimization: entire current search space [low...high] is already sorted
        if (arr[low] <= arr[high]) {
            ans = min(ans, arr[low]);
            break;
        }
        // Left half is sorted: take arr[low] and eliminate left half
        if (arr[low] <= arr[mid]) {
            ans = min(ans, arr[low]);
            low = mid + 1;
        }
        // Right half is sorted: take arr[mid] and eliminate right half
        else {
            ans = min(ans, arr[mid]);
            high = mid - 1;
        }
    }
    return ans;
}
\`\`\``,
    },
  ];

  // 4. Upsert topics in database
  const topicIdMap = new Map();

  for (const topic of batch5Topics) {
    const cleanedSummary = cleanText(topic.summaryMarkdown);
    const cleanedDescription = cleanText(topic.description);
    const cleanedPracticeItems = topic.practiceItems.map((p) => ({
      ...p,
      title: cleanText(p.title),
      description: cleanText(p.description),
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
    if (cleanedPracticeItems && cleanedPracticeItems.length > 0) {
      for (const pItem of cleanedPracticeItems) {
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

  // 5. Update track_topics: Link Batch 5 Topics to topic_order 41 through 50
  console.log("\n🔄 Linking Batch 5 topics to 'problem-solving-dsa-sql' (orders 41..50)...");

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

  // Link Batch 5 Topics (orders 41..50)
  for (const topicDef of batch5Topics) {
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

  console.log("\n🎉 DSA Batch 5 (Lectures 41–50) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch5()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch5;
