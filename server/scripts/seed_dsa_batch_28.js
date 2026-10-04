const pool = require("../config/db");

// Helper to remove any citations, LaTeX commands, or dollar signs
const cleanText = (str) => {
  if (!str) return str;
  return str
    .replace(/\[cite:\s*\d+\]/g, "")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "infinity")
    .replace(/\\alpha/g, "alpha")
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
    .replace(/\\log\^2/g, "log^2")
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

const seedDsaBatch28 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 28 (Lectures 271–280) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 28 Topics (Lectures 271–280)
  const batch28Topics = [
    // =========================================================================
    // SUBTRACK: Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation (Topic 271)
    // =========================================================================
    {
      order: 271,
      name: "Smallest Prime Factor (SPF) Sieve: Prime Factorization for Multiple Queries in O(log N)",
      slug: "dsa-smallest-prime-factor-spf-prime-factorization-queries",
      subtrack: "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation",
      videoUrl: "https://www.youtube.com/watch?v=glKWkmKFlMw",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Unlike finding *unique* prime factors (\`60 -> [2, 3, 5]\`), **Prime Factorization** asks for all prime factors **with their exact multiplicity** (\`60 -> [2, 2, 3, 5]\`, \`16 -> [2, 2, 2, 2]\`). When given \`Q\` queries (\`Q <= 10^5\`, \`N <= 10^5\`), running \`O(sqrt(N))\` trial division per query takes \`O(Q * sqrt(N))\` time. Using **Smallest Prime Factor (SPF) Sieve Precomputation**, we reduce each query to **\`O(log2 N)\`** time!

### 💡 Key Takeaways (Brute O(Q * sqrt(N)) → Optimal SPF Sieve O(N log(log N) + Q log2 N))
- **How the Smallest Prime Factor (\`spf[]\`) Sieve Works:**
  1. Create an array \`spf(MAXN + 1)\` where initially **every index stores itself**: **\`spf[i] = i\`**.
  2. Loop \`i\` from \`2\` while \`i * i <= MAXN\`:
     - If **\`spf[i] == i\`**, then \`i\` has not been touched by any smaller prime—so \`i\` is **Prime**!
     - Loop through multiples \`j\` from \`i * i\` to \`MAXN\` with step \`j += i\`:
       - **Crucial Check (\`if (spf[j] == j)\`):** Only overwrite \`spf[j] = i\` if \`spf[j]\` is **still unmarked (\`spf[j] == j\`)**! For example, \`12\` is first marked \`spf[12] = 2\` when \`i = 2\`; when \`i = 3\` visits \`12\`, we must **not** overwrite \`2\` with \`3\` because we want the *smallest* prime factor!
- **Answering Each Factorization Query \`n\` in \`O(log2 N)\` Time:**
  - While **\`n != 1\`**:
    - Append **\`spf[n]\`** to the answer list.
    - Divide \`n\` by its smallest prime factor: **\`n = n / spf[n]\`**!

### 💻 Smallest Prime Factor (SPF) Sieve Blueprint
\`\`\`cpp
vector<vector<int>> primeFactorizationQueries(vector<int> &queries) {
    int maxN = 100000;
    vector<int> spf(maxN + 1);
    for (int i = 1; i <= maxN; i++) spf[i] = i;

    // 1. Precompute Smallest Prime Factor (SPF) in O(N log(log N))
    for (int i = 2; i * i <= maxN; i++) {
        if (spf[i] == i) { // i is prime
            for (int j = i * i; j <= maxN; j += i) {
                // Only mark j if it hasn't been marked by a smaller prime yet!
                if (spf[j] == j) {
                    spf[j] = i;
                }
            }
        }
    }

    // 2. Factorize each query in O(log2 N) time
    vector<vector<int>> results;
    for (int n : queries) {
        vector<int> factors;
        while (n != 1) {
            factors.push_back(spf[n]);
            n = n / spf[n];
        }
        results.push_back(factors);
    }
    return results;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Overwriting \`spf[j] = i\` Unconditionally:** Without \`if (spf[j] == j)\`, \`spf[j]\` ends up storing the **largest** prime factor (\`<= sqrt(N)\`) instead of the **smallest** prime factor!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Prime Factorization using Sieve",
          url: "https://www.geeksforgeeks.org/problems/prime-factorization-using-sieve/1",
          difficulty: "Medium",
          description: "Find the prime factorization (with multiplicity) of a given number N using Smallest Prime Factor (SPF) precomputation."
        },
        {
          title: "LeetCode 952: Largest Component Size by Common Factor",
          url: "https://leetcode.com/problems/largest-component-size-by-common-factor/",
          difficulty: "Hard",
          description: "Factorize array elements rapidly using SPF/trial division and union numbers sharing a common prime factor."
        },
        {
          title: "LeetCode 2507: Smallest Value After Replacing With Sum of Prime Factors",
          url: "https://leetcode.com/problems/smallest-value-after-replacing-with-sum-of-prime-factors/",
          difficulty: "Medium",
          description: "Repeatedly sum prime factors with multiplicity until reaching a fixed prime point."
        }
      ]
    },

    // =========================================================================
    // SUBTRACK: Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions (Topics 272–280)
    // =========================================================================
    {
      order: 272,
      name: "The 4 Core Sliding Window & Two-Pointer Patterns: Constant Window, Longest Subarray, Subarray Counting & Minimum Window",
      slug: "dsa-introduction-to-sliding-window-and-two-pointers-templates",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=9kdHxplyl5I",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Sliding Window & Two Pointers** is a constructive paradigm where a dynamic window \`[l ... r]\` expands to the right (\`r++\`) and shrinks from the left (\`l++\`) across an array or string. Almost every interview problem in this topic falls into **one of 4 universal patterns**!

### 💡 The 4 Universal Sliding Window Patterns
1. **Pattern 1: Constant Window Size \`K\` (\`O(N)\` Time):**
   - Compute the sum of the initial window \`[0 ... K - 1]\`. Then slide \`[l ... r]\` one step right at a time: subtract \`arr[l]\`, increment \`l++\`, increment \`r++\`, and add \`arr[r]\`.
2. **Pattern 2: Longest Subarray / Substring With \`<condition>\` (Most Common Pattern!):**
   - **Brute Force (\`O(N²)\`):** Two nested loops \`i\` (\`0..n-1\`) and \`j\` (\`i..n-1\`) generating all subarrays.
   - **Better (\`O(2N)\`):** Expand \`r++\`; whenever the window violates \`<condition>\`, use a **\`while\` loop** to shrink \`l++\` until the window becomes valid again.
   - **Optimal (\`O(N)\` — When Only Length Is Asked):** Replace the inner \`while\` loop with a **single \`if\`**! Once we have found a valid window of size \`maxLen\`, we never need to shrink the window below \`maxLen\`—we just slide \`l++\` by \`1\` step along with \`r++\` to keep testing windows of size \`>= maxLen\`!
3. **Pattern 3: Number of Subarrays With \`<Exact Condition == K>\` (\`O(2N)\` Time):**
   - Because exact equality makes it ambiguous when to expand vs. shrink, reduce it using Pattern 2:
     **\`count(sum == K) = count(sum <= K) - count(sum <= K - 1)\`**!
4. **Pattern 4: Shortest / Minimum Window With \`<condition>\` (\`O(2N)\` Time):**
   - Expand \`r++\` until the window is **valid**. Then, **\`while\` the window remains valid**, record \`minLen = min(minLen, r - l + 1)\` and shrink \`l++\` to find the smallest valid window!

### 💻 Universal Template for Pattern 2 (Longest Subarray with sum <= k) Blueprint
\`\`\`cpp
// 1. Better Approach (Using inner 'while' loop - needed if printing the actual subarray): O(2N) Time
int longestSubarrayBetter(const vector<int> &arr, int k) {
    int n = arr.size(), l = 0, r = 0, sum = 0, maxLen = 0;
    while (r < n) {
        sum += arr[r];
        while (sum > k) { // Shrink completely until valid
            sum -= arr[l];
            l++;
        }
        if (sum <= k) {
            maxLen = max(maxLen, r - l + 1);
        }
        r++;
    }
    return maxLen;
}

// 2. Optimal Approach (Replacing inner 'while' with 'if' - when only maxLen is needed): O(N) Time
int longestSubarrayOptimal(const vector<int> &arr, int k) {
    int n = arr.size(), l = 0, r = 0, sum = 0, maxLen = 0;
    while (r < n) {
        sum += arr[r];
        if (sum > k) { // Shrink by ONLY 1 step to lock window size at >= maxLen!
            sum -= arr[l];
            l++;
        }
        if (sum <= k) {
            maxLen = max(maxLen, r - l + 1);
        }
        r++;
    }
    return maxLen;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using the \`if\` (instead of \`while\`) Trick When Asked to Print the Subarray:** The \`if\` optimization keeps \`[l ... r]\` at length \`maxLen\` even when \`[l ... r]\` is temporarily invalid. It is 100% exact for **finding \`maxLen\`**, but if you must return the **actual subarray**, always use the \`while\` loop!`),
      practiceItems: [
        {
          title: "LeetCode 643: Maximum Average Subarray I",
          url: "https://leetcode.com/problems/maximum-average-subarray-i/",
          difficulty: "Easy",
          description: "Apply Pattern 1 (Constant Window of size k) to find the contiguous subarray of length k with maximum average."
        },
        {
          title: "LeetCode 209: Minimum Size Subarray Sum",
          url: "https://leetcode.com/problems/minimum-size-subarray-sum/",
          difficulty: "Medium",
          description: "Apply Pattern 4 (Shortest/Minimum Window) to find the minimal length of a subarray whose sum is >= target."
        },
        {
          title: "GeeksforGeeks: Max Sum Subarray of size K",
          url: "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
          difficulty: "Easy",
          description: "Find the maximum sum of a subarray of fixed size K using a sliding window."
        }
      ]
    },

    {
      order: 273,
      name: "Prefix-Suffix Boundary Window: Maximum Points You Can Obtain From Cards",
      slug: "dsa-maximum-points-you-can-obtain-from-cards",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=pBWCOCS636U",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`cardPoints\` of size \`N\` and an integer \`k\`, you must pick **exactly \`k\` cards** consecutively from either the **front (left end)** or the **back (right end)** of the row. Return the **maximum score** you can obtain.

### 💡 Key Takeaways
- **Sliding Across the Array Boundary (\`k\` Left + \`0\` Right → \`0\` Left + \`k\` Right):**
  - Since you can only pick from the front or back, the \`k\` chosen cards always consist of **\`i\` cards from the left prefix** and **\`k - i\` cards from the right suffix**!
  - **Step 1 (\`k\` from Left, \`0\` from Right):** Sum the first \`k\` cards (\`0\` to \`k - 1\`) into \`lSum\`, set \`rSum = 0\`, and initialize \`maxSum = lSum\`.
  - **Step 2 (Trade 1 Left Card for 1 Right Card \`k\` Times):**
    - Maintain \`rIndex = n - 1\`.
    - Loop \`i\` backwards from \`k - 1\` down to \`0\`:
      1. Remove \`cardPoints[i]\` from the left window: **\`lSum -= cardPoints[i];\`**
      2. Add \`cardPoints[rIndex]\` to the right window: **\`rSum += cardPoints[rIndex];\`**
      3. Decrement **\`rIndex--\`** and update **\`maxSum = max(maxSum, lSum + rSum)\`**!
- **Complexity:** **\`O(2 * K)\`** Time and **\`O(1)\`** Space!

### 💻 Maximum Points You Can Obtain From Cards Blueprint
\`\`\`cpp
int maxScore(vector<int> &cardPoints, int k) {
    int lSum = 0, rSum = 0, maxSum = 0;

    // 1. Pick all k cards from the left end initially: O(K)
    for (int i = 0; i < k; i++) {
        lSum += cardPoints[i];
    }
    maxSum = lSum;

    // 2. One by one, drop 1 card from the left and pick 1 card from the right end: O(K)
    int rIndex = cardPoints.size() - 1;
    for (int i = k - 1; i >= 0; i--) {
        lSum -= cardPoints[i];
        rSum += cardPoints[rIndex];
        rIndex--;

        maxSum = max(maxSum, lSum + rSum);
    }

    return maxSum;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Trying a Greedy Two-Pointer Comparison (\`max(cardPoints[l], cardPoints[r])\`):** Picking the locally larger card at the front vs. back fails whenever a small outer card unlocks a massive card right behind it (e.g., \`[1, 100, 1, 1, 2]\` with \`k = 2\`). Always test all \`k + 1\` prefix-suffix splits in \`O(2K)\` time!`),
      practiceItems: [
        {
          title: "LeetCode 1423: Maximum Points You Can Obtain from Cards",
          url: "https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/",
          difficulty: "Medium",
          description: "In one step, you can take one card from the beginning or from the end of the row. You have to take exactly k cards. Return the maximum score."
        },
        {
          title: "LeetCode 1658: Minimum Operations to Reduce X to Zero",
          url: "https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/",
          difficulty: "Medium",
          description: "Pick elements from the left and right ends of nums to sum to x in minimum operations."
        },
        {
          title: "LeetCode 2379: Minimum Recolors to Get K Consecutive Black Blocks",
          url: "https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/",
          difficulty: "Easy",
          description: "Practice fixed-size K window transitions across an array."
        }
      ]
    },

    {
      order: 274,
      name: "Last-Seen Index Jump: Longest Substring Without Repeating Characters",
      slug: "dsa-longest-substring-without-repeating-characters",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=-zSxTJkcdAo",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\` (which may contain lowercase letters, uppercase letters, digits, symbols, or spaces—any of the \`256\` ASCII characters), find the length of the **longest substring without repeating characters**.

### 💡 Key Takeaways (Brute O(N²) → Optimal Direct Jump O(N))
- **Why Storing the Last-Seen Index (\`hash[256]\`) Beats Incrementing \`l++\` One by One:**
  - Initialize an array \`hash(256, -1)\` storing the **last index where each ASCII character was seen**.
  - Maintain window \`[l ... r]\` starting at \`l = 0, r = 0\`.
  - When we are at \`s[r]\`, check if \`s[r]\` was seen previously (\`hash[s[r]] != -1\`):
    - **The Crucial Boundary Guard (\`if (hash[s[r]] >= l)\`):**
      - What if \`s[r]\` was seen at index \`1\`, but our left pointer \`l\` has **already moved ahead to index \`4\`**?
      - Then that old occurrence at index \`1\` is **outside our current window \`[l ... r]\`** and is NOT a duplicate!
      - Only if **\`hash[s[r]] >= l\`** (the previous occurrence is *inside* our active window \`[l ... r]\`), we jump \`l\` directly past that duplicate: **\`l = hash[s[r]] + 1\`**!
  - Update \`maxLen = max(maxLen, r - l + 1)\`, record **\`hash[s[r]] = r\`**, and advance \`r++\`.
- **Complexity:** **\`O(N)\`** Single-Pass Time (no inner loop!) and **\`O(256) = O(1)\`** Space.

### 💻 Longest Substring Without Repeating Characters Blueprint
\`\`\`cpp
int lengthOfLongestSubstring(string s) {
    int n = s.size();
    // Stores the last seen index of each of the 256 ASCII characters (-1 if unseen)
    vector<int> hash(256, -1);

    int l = 0, r = 0, maxLen = 0;

    while (r < n) {
        // If s[r] was seen before AND its last occurrence is inside the current window [l .. r]
        if (hash[s[r]] != -1) {
            if (hash[s[r]] >= l) {
                l = hash[s[r]] + 1; // Jump l directly past the previous occurrence!
            }
        }

        int len = r - l + 1;
        maxLen = max(maxLen, len);

        // Update the last seen index of s[r] to current index r
        hash[s[r]] = r;
        r++;
    }
    return maxLen;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Jumping \`l = hash[s[r]] + 1\` Without Checking \`if (hash[s[r]] >= l)\`:** On \`"abba"\`, when \`r = 2\` (\`'b'\`), \`l\` moves to \`2\`. Then when \`r = 3\` (\`'a'\`), \`hash['a']\` is \`0\`. Without \`if (hash[s[r]] >= l)\`, \`l\` jumps **backward** from \`2\` to \`0 + 1 = 1\`, falsely including \`"bb"\` inside the window!`),
      practiceItems: [
        {
          title: "LeetCode 3: Longest Substring Without Repeating Characters",
          url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
          difficulty: "Medium",
          description: "Given a string s, find the length of the longest substring without repeating characters."
        },
        {
          title: "LeetCode 1695: Maximum Erasure Value",
          url: "https://leetcode.com/problems/maximum-erasure-value/",
          difficulty: "Medium",
          description: "Find the contiguous subarray of unique elements with the maximum sum."
        },
        {
          title: "GeeksforGeeks: Longest Distinct characters in string",
          url: "https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1",
          difficulty: "Easy",
          description: "Find the length of the longest substring with all distinct characters."
        }
      ]
    },

    {
      order: 275,
      name: "Bounded-Defect Window Locking: Max Consecutive Ones III",
      slug: "dsa-max-consecutive-ones-iii-sliding-window",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=3E4JBHSLpYk",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a binary array \`nums\` (\`0\`s and \`1\`s) and an integer \`k\`, return the maximum number of consecutive \`1\`s in the array if you are allowed to **flip at most \`k\` \`0\`s**.

### 💡 Key Takeaways (Brute O(N²) → Better O(2N) → Optimal O(N))
- **Reframing the Problem as Pattern 2:**
  - *"Flipping at most \`k\` \`0\`s to get the longest streak of \`1\`s"* is 100% equivalent to:
    **"Find the longest subarray containing AT MOST \`k\` zeros!"**
- **1. Better Approach (\`while (zeros > k)\` — \`O(2N)\` Time):**
  - Expand \`r++\` and increment \`zeros++\` whenever \`nums[r] == 0\`.
  - While \`zeros > k\`, shrink from the left: if \`nums[l] == 0\`, decrement \`zeros--\`; then \`l++\`.
- **2. Optimal Approach (\`if (zeros > k)\` — Pure \`O(N)\` Time!):**
  - Replace \`while (zeros > k)\` with **\`if (zeros > k)\`**!
  - Whenever \`zeros > k\`, we only move \`l\` forward by **1 step** (\`if (nums[l] == 0) zeros--; l++;\`).
  - Why? Because this locks the window width at \`maxLen\` (\`r\` moves \`+1\` and \`l\` moves \`+1\`), refusing to let the window grow until \`zeros\` drops back to \`<= k\`, while avoiding the extra \`O(N)\` inner loop!

### 💻 Max Consecutive Ones III (Optimal O(N) Single-Pass) Blueprint
\`\`\`cpp
int longestOnes(vector<int> &nums, int k) {
    int l = 0, r = 0, maxLen = 0, zeros = 0;
    int n = nums.size();

    while (r < n) {
        if (nums[r] == 0) zeros++;

        // Optimal O(N) trick: use 'if' instead of 'while' to lock window size at maxLen!
        if (zeros > k) {
            if (nums[l] == 0) zeros--;
            l++;
        }

        if (zeros <= k) {
            int len = r - l + 1;
            maxLen = max(maxLen, len);
        }
        r++;
    }
    return maxLen;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Updating \`maxLen\` Without Checking \`if (zeros <= k)\` in the Optimal \`if\` Version:** Because a single \`if (zeros > k)\` step only shifts \`l\` by 1 position, \`zeros\` might still be \`> k\` on that iteration! Always wrap \`maxLen = max(maxLen, r - l + 1)\` inside **\`if (zeros <= k)\`**!`),
      practiceItems: [
        {
          title: "LeetCode 1004: Max Consecutive Ones III",
          url: "https://leetcode.com/problems/max-consecutive-ones-iii/",
          difficulty: "Medium",
          description: "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's."
        },
        {
          title: "LeetCode 1493: Longest Subarray of 1's After Deleting One Element",
          url: "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/",
          difficulty: "Medium",
          description: "Special case of Max Consecutive Ones III where k = 1 and the deleted element is not counted in the final length."
        },
        {
          title: "LeetCode 2024: Maximize the Confusion of an Exam",
          url: "https://leetcode.com/problems/maximize-the-confusion-of-an-exam/",
          difficulty: "Medium",
          description: "Apply Max Consecutive Ones III to a string of 'T' and 'F' characters with at most k flips."
        }
      ]
    },

    {
      order: 276,
      name: "Bounded-Cardinality Frequency Window: Fruit Into Baskets (At Most 2 Distinct Types)",
      slug: "dsa-fruit-into-baskets-sliding-window",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=e3bs0uA1NhQ",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given an integer array \`fruits\` where \`fruits[i]\` is the type of fruit the \`i\`-th tree produces. You have **2 baskets**, each capable of holding an unlimited quantity of **only 1 fruit type**, and you must pick from a contiguous segment of trees. Find the maximum number of fruits you can collect.

### 💡 Key Takeaways (Brute O(N²) → Better O(2N) → Optimal O(N))
- **Reframing the Problem Statement:**
  - Strip away the story: this problem simply asks for the **Longest Subarray With At Most \`2\` Distinct Numbers** (\`k = 2\`)!
- **Tracking Distinct Types via \`unordered_map<int, int> mpp\`:**
  - Expand \`r\`: increment \`mpp[fruits[r]]++\`.
  - When \`mpp.size() > 2\` (using \`while\` for \`O(2N)\` or **\`if\` for \`O(N)\`**):
    1. Decrement \`mpp[fruits[l]]--\`.
    2. **Crucial Map Erasure:** If **\`mpp[fruits[l]] == 0\`**, call **\`mpp.erase(fruits[l])\`** so \`mpp.size()\` accurately reflects the number of distinct fruit types remaining in \`[l ... r]\`!
    3. Advance \`l++\`.
  - If \`mpp.size() <= 2\`, update \`maxLen = max(maxLen, r - l + 1)\`.
- **Complexity:** **\`O(N)\`** Time and **\`O(3) = O(1)\`** Space (since \`mpp\` holds at most \`3\` keys at any moment!).

### 💻 Fruit Into Baskets (Optimal O(N) Single-Pass) Blueprint
\`\`\`cpp
int totalFruit(vector<int> &fruits) {
    int l = 0, r = 0, maxLen = 0;
    int k = 2; // At most 2 baskets (2 distinct fruit types)
    unordered_map<int, int> mpp;

    while (r < fruits.size()) {
        mpp[fruits[r]]++;

        // Optimal O(N) non-shrinking window lock: use 'if' instead of 'while'
        if (mpp.size() > k) {
            mpp[fruits[l]]--;
            if (mpp[fruits[l]] == 0) {
                mpp.erase(fruits[l]); // Must erase key when frequency hits 0!
            }
            l++;
        }

        if (mpp.size() <= k) {
            maxLen = max(maxLen, r - l + 1);
        }
        r++;
    }
    return maxLen;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`if (mpp[fruits[l]] == 0) mpp.erase(fruits[l]);\`:** In C++, setting \`mpp[key] = 0\` **does NOT remove \`key\` from the map**—\`mpp.size()\` will still count that key! You must explicitly call \`mpp.erase(fruits[l])\` when its count reaches \`0\`.`),
      practiceItems: [
        {
          title: "LeetCode 904: Fruit Into Baskets",
          url: "https://leetcode.com/problems/fruit-into-baskets/",
          difficulty: "Medium",
          description: "You have two baskets, and each basket can only hold a single type of fruit. Return the maximum number of fruits you can pick from a contiguous subarray of trees."
        },
        {
          title: "LeetCode 159: Longest Substring with At Most Two Distinct Characters",
          url: "https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/",
          difficulty: "Medium",
          description: "String equivalent of Fruit Into Baskets: find the longest substring with at most 2 distinct characters."
        },
        {
          title: "GeeksforGeeks: Fruit Into Baskets",
          url: "https://www.geeksforgeeks.org/problems/fruit-into-baskets-1663137462/1",
          difficulty: "Medium",
          description: "Find the length of the longest subarray containing at most 2 distinct integers."
        }
      ]
    },

    {
      order: 277,
      name: "Generalized K-Distinct Sliding Window: Longest Substring With At Most K Distinct Characters",
      slug: "dsa-longest-substring-with-at-most-k-distinct-characters",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=teM9ZsVRQyc",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\` and an integer \`k\`, find the length of the **longest substring** that contains **at most \`k\` distinct characters**.

### 💡 Key Takeaways (Brute O(N²) → Better O(2N) → Optimal O(N))
- **Direct Generalization of Fruit Into Baskets (\`2\` → \`k\`):**
  - Maintain \`unordered_map<char, int> mpp\` tracking character frequencies inside \`[l ... r]\`.
  - **1. Better Approach (\`while (mpp.size() > k)\`):**
    - Shrinks \`l++\` completely until \`mpp.size() <= k\`. Takes \`O(2N)\` time.
  - **2. Optimal Approach (\`if (mpp.size() > k)\`):**
    - Shrinks \`l++\` by **only 1 character** whenever \`mpp.size() > k\`.
    - Keeps the sliding window locked at the maximum valid size \`maxLen\` found so far, running in **pure \`O(N)\` time**!
- **Complexity:** **\`O(N)\`** Time and **\`O(min(N, 256))\`** Space.

### 💻 Longest Substring With At Most K Distinct Characters Blueprint
\`\`\`cpp
int kDistinctChars(int k, string &s) {
    int l = 0, r = 0, maxLen = 0;
    unordered_map<char, int> mpp;

    while (r < s.size()) {
        mpp[s[r]]++;

        // Optimal O(N) single-step shrink when distinct characters exceed k
        if (mpp.size() > k) {
            mpp[s[l]]--;
            if (mpp[s[l]] == 0) {
                mpp.erase(s[l]);
            }
            l++;
        }

        if (mpp.size() <= k) {
            maxLen = max(maxLen, r - l + 1);
        }
        r++;
    }
    return maxLen;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Confusing "At Most K Distinct" With "Exactly K Distinct" (GFG Variant):** If a problem asks for **exactly \`K\`** unique characters (returning \`-1\` if fewer than \`K\` exist), initialize \`maxLen = -1\` and change the update condition from \`if (mpp.size() <= k)\` to **\`if (mpp.size() == k)\`** (using the \`while (mpp.size() > k)\` shrink loop)!`),
      practiceItems: [
        {
          title: "LeetCode 340: Longest Substring with At Most K Distinct Characters",
          url: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
          difficulty: "Medium",
          description: "Given a string s and an integer k, return the length of the longest substring of s that contains at most k distinct characters."
        },
        {
          title: "GeeksforGeeks: Longest K unique characters substring",
          url: "https://www.geeksforgeeks.org/problems/longest-k-unique-characters-substring0853/1",
          difficulty: "Medium",
          description: "Find the length of the longest possible substring that has exactly K unique characters (or -1 if none exists)."
        },
        {
          title: "LeetCode 992: Subarrays with K Different Integers",
          url: "https://leetcode.com/problems/subarrays-with-k-different-integers/",
          difficulty: "Hard",
          description: "Combine At Most K Distinct with Pattern 3 (f(k) - f(k - 1)) to count subarrays with exactly K distinct integers."
        }
      ]
    },

    {
      order: 278,
      name: "Minimal Ending-Window Prefix Extension: Number of Substrings Containing All Three Characters",
      slug: "dsa-number-of-substrings-containing-all-three-characters",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=xtqN4qlgr8s",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\` consisting only of \`'a'\`, \`'b'\`, and \`'c'\`, return the **total number of substrings** that contain **at least one occurrence of all three characters \`'a'\`, \`'b'\`, and \`'c'\`**.

### 💡 Key Takeaways
- **Counting Substrings That END at Index \`i\` Using \`lastSeen[3]\`:**
  - Every valid substring must **end** at some index \`i\` (\`0\` to \`n - 1\`).
  - Maintain \`int lastSeen[3] = {-1, -1, -1}\` tracking the **most recent index** where \`'a'\`, \`'b'\`, and \`'c'\` were seen.
  - At index \`i\`:
    1. Update **\`lastSeen[s[i] - 'a'] = i;\`**.
    2. What is the **smallest (minimal) valid substring ending at \`i\`** that contains \`'a'\`, \`'b'\`, and \`'c'\`?
       - It starts at the **leftmost** of the three last-seen indices: **\`minIndex = min({lastSeen[0], lastSeen[1], lastSeen[2]})\`**!
    3. If \`minIndex != -1\` (all three characters have been seen at least once):
       - Not only is \`s[minIndex ... i]\` a valid substring (\`1\`), **every character before \`minIndex\` (\`0, 1, ..., minIndex - 1\`) can also be prepended** to form a valid substring ending at \`i\`!
       - How many valid substrings end at \`i\`? Exactly **\`1 + minIndex\`**!
- **Note:** Even if one character hasn't been seen yet (\`minIndex == -1\`), \`1 + (-1) = 0\`, so \`cnt += 1 + min({lastSeen[0], lastSeen[1], lastSeen[2]})\` works cleanly even without an \`if\` check!
- **Complexity:** **\`O(N)\`** Time and **\`O(1)\`** Space (\`3\` integers).

### 💻 Number of Substrings Containing All Three Characters Blueprint
\`\`\`cpp
int numberOfSubstrings(string s) {
    int lastSeen[3] = {-1, -1, -1};
    int cnt = 0;

    for (int i = 0; i < s.size(); i++) {
        lastSeen[s[i] - 'a'] = i;

        // If all three characters have been seen, the minimal valid window starts at
        // min(lastSeen[0], lastSeen[1], lastSeen[2]), giving (1 + minIndex) valid substrings!
        if (lastSeen[0] != -1 && lastSeen[1] != -1 && lastSeen[2] != -1) {
            cnt += (1 + min({lastSeen[0], lastSeen[1], lastSeen[2]}));
        }
    }
    return cnt;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Adding \`1\` Instead of \`1 + minIndex\`:** Finding the minimal valid window \`[minIndex ... i]\` gives \`1\` substring, plus all \`minIndex\` extensions to the left (\`[0 ... i], [1 ... i], ..., [minIndex - 1 ... i]\`), totaling **\`1 + minIndex\`** substrings ending at \`i\`!`),
      practiceItems: [
        {
          title: "LeetCode 1358: Number of Substrings Containing All Three Characters",
          url: "https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/",
          difficulty: "Medium",
          description: "Given a string s consisting only of characters a, b and c, return the number of substrings containing at least one occurrence of all these characters."
        },
        {
          title: "LeetCode 2962: Count Subarrays Where Max Element Appears at Least K Times",
          url: "https://leetcode.com/problems/count-subarrays-where-max-element-appears-at-least-k-times/",
          difficulty: "Medium",
          description: "Use the exact same minimal-window prefix counting pattern to count valid subarrays ending at index r."
        },
        {
          title: "LeetCode 2799: Count Complete Subarrays in an Array",
          url: "https://leetcode.com/problems/count-complete-subarrays-in-an-array/",
          difficulty: "Medium",
          description: "Count subarrays that contain all distinct elements present in the whole array."
        }
      ]
    },

    {
      order: 279,
      name: "Majority-Frequency Minority Replacement: Longest Repeating Character Replacement",
      slug: "dsa-longest-repeating-character-replacement-sliding-window",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=_eNhaDCr6P0",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an uppercase string \`s\` and an integer \`k\`, you can replace **at most \`k\` characters** in a substring with any uppercase letter so that all characters in that substring become identical. Return the **maximum length** of such a substring.

### 💡 Key Takeaways (Brute O(N²) → Better O(2N * 26) → Optimal O(N))
- **The Replacement Formula (\`(r - l + 1) - maxf <= k\`):**
  - In any window \`[l ... r]\` of length \`len = r - l + 1\`, which character should we turn all other characters into?
  - To minimize replacements, keep the **most frequent character (\`maxf\`)** untouched and replace all remaining characters!
  - Therefore, the number of replacements required is:
    **\`changes = (r - l + 1) - maxf\`**.
  - A window is valid if and only if **\`(r - l + 1) - maxf <= k\`**!
- **Why We NEVER Need to Decrement \`maxf\` (Or Rescan \`hash[26]\`) When Shrinking!**
  - Suppose we found a valid window of length \`5\` with \`maxf = 3\` (\`5 - 3 <= 2\`).
  - To beat \`maxLen = 5\` and find a valid window of length \`6\`, what must \`maxf\` be? Since \`6 - maxf <= 2\`, we **must find a future window where \`maxf >= 4\`**!
  - Reducing \`maxf\` from \`3\` down to \`2\` when shrinking \`l\` can **never** help us achieve a larger \`maxLen\`—only a **strictly larger \`maxf\`** can ever grow \`maxLen\`!
  - Combining **no \`maxf\` rescan** with our **single-step \`if\` shrink** reduces complexity from \`O(2N * 26)\` to pure **\`O(N)\`**!

### 💻 Longest Repeating Character Replacement (Optimal O(N)) Blueprint
\`\`\`cpp
int characterReplacement(string s, int k) {
    int l = 0, r = 0, maxLen = 0, maxf = 0;
    int hash[26] = {0};

    while (r < s.size()) {
        hash[s[r] - 'A']++;
        maxf = max(maxf, hash[s[r] - 'A']);

        // Optimal O(N): single-step 'if' shrink without rescanning hash[26] for maxf!
        if ((r - l + 1) - maxf > k) {
            hash[s[l] - 'A']--;
            l++;
        }

        if ((r - l + 1) - maxf <= k) {
            maxLen = max(maxLen, r - l + 1);
        }
        r++;
    }
    return maxLen;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Rescanning All 26 Buckets on Every Shrink:** While rescanning \`hash[0..25]\` inside a \`while\` loop is still accepted (\`O(26 * 2N)\`), explaining in an interview *why* \`maxf\` never needs to be decremented is what distinguishes a top-tier \`O(N)\` solution!`),
      practiceItems: [
        {
          title: "LeetCode 424: Longest Repeating Character Replacement",
          url: "https://leetcode.com/problems/longest-repeating-character-replacement/",
          difficulty: "Medium",
          description: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter."
        },
        {
          title: "LeetCode 2024: Maximize the Confusion of an Exam",
          url: "https://leetcode.com/problems/maximize-the-confusion-of-an-exam/",
          difficulty: "Medium",
          description: "Special 2-character case of Longest Repeating Character Replacement."
        },
        {
          title: "GeeksforGeeks: Longest Repeating Character Replacement",
          url: "https://www.geeksforgeeks.org/problems/longest-repeating-character-replacement/1",
          difficulty: "Medium",
          description: "Find the maximum length of a substring with identical characters after at most K replacements."
        }
      ]
    },

    {
      order: 280,
      name: "Exact-Count Subtraction Trick (f(goal) - f(goal - 1)): Binary Subarrays With Sum",
      slug: "dsa-binary-subarrays-with-sum-sliding-window",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=XnMdNUkX6VM",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a **binary array \`nums\`** (\`0\`s and \`1\`s) and an integer \`goal\`, return the **number of non-empty subarrays** with a sum equal to \`goal\` in **\`O(N)\` time and \`O(1)\` extra space** (eliminating the \`O(N)\` hash map used in general Prefix Sum).

### 💡 Key Takeaways (Pattern 3: atMost(goal) - atMost(goal - 1))
- **Why Standard Sliding Window Struggles With \`sum == goal\` Directly:**
  - Because \`nums\` contains \`0\`s, shrinking \`l++\` or expanding \`r++\` across \`0\`s does not change \`sum\`, creating ambiguity about whether to move \`l\` or \`r\` first!
- **The Exact-to-At-Most Reduction (\`f(goal) - f(goal - 1)\`):**
  - While counting \`sum == goal\` directly is tricky, counting subarrays where **\`sum <= goal\`** (\`atMost(nums, goal)\`) is super easy!
  - In \`atMost(nums, goal)\`:
    1. **Crucial Base Case:** **\`if (goal < 0) return 0;\`** (when \`goal == 0\`, calling \`atMost(nums, goal - 1)\` passes \`-1\`; since a binary array cannot have a negative sum, it must immediately return \`0\`!).
    2. Expand \`r\`: \`sum += nums[r]\`.
    3. Shrink \`while (sum > goal)\`: \`sum -= nums[l]; l++;\`.
    4. Every subarray ending at \`r\` and starting anywhere in \`[l ... r]\` now has \`sum <= goal\`—so add **\`cnt += (r - l + 1)\`**!
  - Finally, subtract subarrays with \`sum <= goal - 1\` from subarrays with \`sum <= goal\`:
    **\`return atMost(nums, goal) - atMost(nums, goal - 1);\`**!
- **Complexity:** **\`O(2 * 2N) = O(N)\`** Time and **\`O(1)\`** Space!

### 💻 Binary Subarrays With Sum (O(1) Space Sliding Window) Blueprint
\`\`\`cpp
int countAtMost(const vector<int> &nums, int goal) {
    // Essential edge case when goal == 0 and we call countAtMost(nums, goal - 1 = -1)!
    if (goal < 0) return 0;

    int l = 0, r = 0, sum = 0, cnt = 0;
    while (r < nums.size()) {
        sum += nums[r];

        while (sum > goal) {
            sum -= nums[l];
            l++;
        }

        // All (r - l + 1) subarrays ending at r within [l .. r] have sum <= goal!
        cnt += (r - l + 1);
        r++;
    }
    return cnt;
}

int numSubarraysWithSum(vector<int> &nums, int goal) {
    return countAtMost(nums, goal) - countAtMost(nums, goal - 1);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Omitting \`if (goal < 0) return 0;\` at the Top of \`countAtMost\`:** When \`goal = 0\`, \`countAtMost(nums, goal - 1)\` passes \`goal = -1\`. Without \`if (goal < 0) return 0;\`, \`while (sum > -1)\` will push \`l\` past \`r\` (\`l = r + 1\`) and corrupt the count!
- **Applying This Trick to Arrays With Negative Numbers:** The \`atMost(goal)\` sliding window relies on monotonicity (moving \`r++\` never decreases \`sum\`, and moving \`l++\` never increases \`sum\`). It works for non-negative arrays (\`>= 0\`), whereas arrays with **negative numbers** require the Prefix Sum + Hash Map (\`O(N)\` space) approach!`),
      practiceItems: [
        {
          title: "LeetCode 930: Binary Subarrays With Sum",
          url: "https://leetcode.com/problems/binary-subarrays-with-sum/",
          difficulty: "Medium",
          description: "Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum equal to goal in O(1) extra space."
        },
        {
          title: "LeetCode 1248: Count Number of Nice Subarrays",
          url: "https://leetcode.com/problems/count-number-of-nice-subarrays/",
          difficulty: "Medium",
          description: "Treat odd numbers as 1 and even numbers as 0 to reduce Nice Subarrays directly to Binary Subarrays With Sum!"
        },
        {
          title: "LeetCode 992: Subarrays with K Different Integers",
          url: "https://leetcode.com/problems/subarrays-with-k-different-integers/",
          difficulty: "Hard",
          description: "Apply the exact same atMost(k) - atMost(k - 1) subtraction pattern to count subarrays with k distinct integers."
        }
      ]
    },
  ];

  console.log("\n📦 Upserting 10 Batch 28 Topics into 'topics' table...");
  const topicIdMap = {};

  for (const t of batch28Topics) {
    const videoUrlClean = cleanUrl(t.videoUrl);
    const videoLinksJson = JSON.stringify([
      { title: cleanText(t.name) + " - Full Lecture", url: videoUrlClean }
    ]);

    const sanitizedPracticeItems = (t.practiceItems || []).map((p) => ({
      title: cleanText(p.title),
      url: cleanUrl(p.url),
      difficulty: cleanText(p.difficulty),
      description: cleanText(p.description),
    }));
    const practiceItemsJson = JSON.stringify(sanitizedPracticeItems);

    const docLinksJson = JSON.stringify(
      sanitizedPracticeItems.map((p) => ({ title: p.title, url: p.url }))
    );

    const upsertRes = await pool.query(
      `INSERT INTO topics (
         name, slug, subtrack, summary_markdown, theory_summary,
         video_links, practice_items, doc_links, description
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         subtrack = EXCLUDED.subtrack,
         summary_markdown = EXCLUDED.summary_markdown,
         theory_summary = EXCLUDED.theory_summary,
         video_links = EXCLUDED.video_links,
         practice_items = EXCLUDED.practice_items,
         doc_links = EXCLUDED.doc_links,
         description = EXCLUDED.description
       RETURNING id, slug;`,
      [
        cleanText(t.name),
        t.slug,
        cleanText(t.subtrack),
        t.summaryMarkdown,
        t.summaryMarkdown,
        videoLinksJson,
        practiceItemsJson,
        docLinksJson,
        `Master ${cleanText(t.name)} with step-by-step intuition, code blueprints, and verified LeetCode/GFG practice.`,
      ]
    );

    const topicId = upsertRes.rows[0].id;
    topicIdMap[t.slug] = topicId;
    console.log(`  ✅ Upserted Topic [${t.order}]: "${t.name}" (ID: ${topicId})`);
  }

  // 4. Link Topics to Track in 'track_topics' Table with sequential topic_order (271 to 280)
  console.log("\n🔄 Linking Batch 28 topics to 'problem-solving-dsa-sql' (orders 271..280)...");
  for (const t of batch28Topics) {
    const topicId = topicIdMap[t.slug];
    await pool.query(
      `INSERT INTO track_topics (track_id, topic_id, topic_order)
       VALUES ($1, $2, $3)
       ON CONFLICT (track_id, topic_id) DO UPDATE SET
         topic_order = EXCLUDED.topic_order;`,
      [trackId, topicId, t.order]
    );
    console.log(`📌 Linked Topic #${t.order}: "${t.name}"`);
  }

  console.log("\n🎉 DSA Batch 28 (Lectures 271–280) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch28()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch28;
