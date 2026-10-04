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

const seedDsaBatch23 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 23 (Lectures 221–230) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 23 Topics (Lectures 221–230)
  const batch23Topics = [
    // =========================================================================
    // SUBTRACK: Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants (Topics 221–227)
    // =========================================================================
    {
      order: 221,
      name: "Coordinate-Shifted 2D State Recurrence: Longest Increasing Subsequence (Recursion & Memoization)",
      slug: "dsa-longest-increasing-subsequence-memoization",
      subtrack: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      description: "Find the length of the longest strictly increasing subsequence using the 2D (ind, prev_ind) state and +1 coordinate shift memoization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 221: Longest Increasing Subsequence | Recursion to Tabulation (DP 41)",
          url: cleanUrl("https://www.youtube.com/watch?v=ekcwMsSIzVc"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Increasing Subsequence (DP 41)",
          url: "https://takeuforward.org/data-structure/longest-increasing-subsequence-dp-41/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Longest Increasing Subsequence (LC 300)",
          url: cleanUrl("https://leetcode.com/problems/longest-increasing-subsequence/"),
          difficulty: "Medium",
          description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Longest Increasing Subsequence",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/longest-increasing-subsequence-1587115620/1"),
          difficulty: "Medium",
          description: "Find the length of the longest subsequence of a given array such that all elements of the subsequence are sorted in strictly increasing order.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Length of Pair Chain (LC 646)",
          url: cleanUrl("https://leetcode.com/problems/maximum-length-of-pair-chain/"),
          difficulty: "Medium",
          description: "Extend the LIS pick/not-pick recurrence to chains of intervals.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`arr\` of length \`N\`, find the length of the **Longest Increasing Subsequence (LIS)**—the longest subsequence in which every element is **strictly greater** than the previous element picked.

### 💡 Key Takeaways
- **The 2D State \`(ind, prev_ind)\`:**
  - To decide whether we can pick \`arr[ind]\`, we must know the index of the **previous element we picked (\`prev_ind\`)**, starting at \`prev_ind = -1\` (nothing picked yet).
  - **Base Case (\`ind == N\`):** No elements left → \`return 0\`.
  - **Transitions:**
    1. **Not Take:** Skip \`arr[ind]\` and keep \`prev_ind\` unchanged:
       \`len = 0 + f(ind + 1, prev_ind)\`
    2. **Take:** Allowed **if and only if \`prev_ind == -1 || arr[ind] > arr[prev_ind]\`**:
       \`len = max(len, 1 + f(ind + 1, ind))\` (now \`ind\` becomes the new \`prev_ind\`!).
- **The \`+1\` Coordinate Shift for \`prev_ind\` in Memoization:**
  - Because \`prev_ind\` starts at \`-1\` (\`-1\` to \`N - 1\`), we cannot index \`dp[ind][-1]\` directly.
  - **The Fix:** Store \`prev_ind\` at column **\`prev_ind + 1\`** inside an \`N x (N + 1)\` DP table \`dp[N][N + 1]\`!
- **Complexity:** \`O(N²)\` Time and \`O(N²)\` Space (reduced to \`O(N)\` in DP 42!).

### 💻 Longest Increasing Subsequence (Coordinate-Shifted Memoization) Blueprint
~~~cpp
int solveLIS(int ind, int prev_ind, int n, const vector<int> &arr, vector<vector<int>> &dp) {
    if (ind == n) return 0;

    // Coordinate shift: prev_ind (-1 .. n-1) is stored at (prev_ind + 1) (0 .. n)
    if (dp[ind][prev_ind + 1] != -1) return dp[ind][prev_ind + 1];

    // Choice 1: Do not pick arr[ind]
    int len = 0 + solveLIS(ind + 1, prev_ind, n, arr, dp);

    // Choice 2: Pick arr[ind] if it is strictly greater than arr[prev_ind]
    if (prev_ind == -1 || arr[ind] > arr[prev_ind]) {
        len = max(len, 1 + solveLIS(ind + 1, ind, n, arr, dp));
    }

    return dp[ind][prev_ind + 1] = len;
}

int lengthOfLIS(vector<int> &nums) {
    int n = nums.size();
    vector<vector<int>> dp(n, vector<int>(n + 1, -1));
    return solveLIS(0, -1, n, nums, dp);
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Indexing \`arr[prev_ind + 1]\` Instead of \`arr[prev_ind]\`:** The \`+1\` shift is **only** for the \`dp\` table column (\`dp[ind][prev_ind + 1]\`)! When comparing values in the original array \`arr\`, always compare \`arr[ind] > arr[prev_ind]\`.`),
      theorySummary: cleanText(`LIS state is formulated as (ind, prev_ind). Because prev_ind ranges from -1 to N-1, coordinate shift prev_ind + 1 allows direct indexing into an N x (N+1) DP table in O(N^2) time.`),
    },

    {
      order: 222,
      name: "1D Tabulation & Backtrack Hash Array: Printing the Longest Increasing Subsequence",
      slug: "dsa-printing-longest-increasing-subsequence-tabulation",
      subtrack: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      description: "Tabulate LIS in a single 1D array where dp[i] represents the LIS ending at index i, and reconstruct the full sequence using a parent hash array.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 222: Printing Longest Increasing Subsequence | Tabulation | Algorithm (DP 42)",
          url: cleanUrl("https://www.youtube.com/watch?v=IFfYfonAFGc"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Printing Longest Increasing Subsequence (DP 42)",
          url: "https://takeuforward.org/data-structure/printing-longest-increasing-subsequence-dp-42/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Print Longest Increasing Subsequence",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/printing-longest-increasing-subsequence/1"),
          difficulty: "Medium",
          description: "Find and return the actual Longest Increasing Subsequence array using 1D DP and a parent hash array.",
        },
        {
          platform: "LeetCode",
          title: "Longest Increasing Subsequence (LC 300)",
          url: cleanUrl("https://leetcode.com/problems/longest-increasing-subsequence/"),
          difficulty: "Medium",
          description: "Implement the 1D O(N^2) DP array where dp[i] stores the LIS ending at index i.",
        },
        {
          platform: "LeetCode",
          title: "Best Team With No Conflicts (LC 1626)",
          url: cleanUrl("https://leetcode.com/problems/best-team-with-no-conflicts/"),
          difficulty: "Medium",
          description: "Sort players by age and apply the 1D LIS tabulation loop to maximize team score.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In addition to converting the 2D LIS state into a **2-Row Space-Optimized \`O(N)\` table**, there is a much more powerful **Single-Array \`1D\` Tabulation (\`dp[N]\`)** that is required whenever you need to **trace back and print the actual LIS** (and serves as the foundation for DP 44, 45, 46, and 47!).

### 💡 Key Takeaways
- **The 1D \`dp[i]\` Definition (\`LIS Ending at Index i\`):**
  - Define \`dp[i]\` = length of the Longest Increasing Subsequence that **ends at index \`i\`**.
  - Initially, every element forms a valid LIS of length \`1\` by itself: **\`vector<int> dp(n, 1);\`**.
  - For each index \`i\` from \`0\` to \`n - 1\`, scan all previous indices \`prev\` from \`0\` to \`i - 1\`:
    - If **\`arr[prev] < arr[i]\`** and **\`1 + dp[prev] > dp[i]\`**:
      - Update **\`dp[i] = 1 + dp[prev]\`**!
- **How to Print the LIS Using a \`hash[]\` (Parent) Array:**
  - Maintain \`hash[i] = i\` initially (each element is its own start).
  - Whenever \`1 + dp[prev] > dp[i]\`, also record **\`hash[i] = prev\`** (remembering that \`i\` extended the LIS from \`prev\`!).
  - Track \`lastIndex\` where the global maximum \`maxi = max(maxi, dp[i])\` occurred.
  - Backtrack via \`while (hash[lastIndex] != lastIndex)\` pushing \`arr[lastIndex]\`, then push the final starting element and **reverse the result**!
- **Complexity:** \`O(N²)\` Time and \`O(N)\` Space.

### 💻 Print Longest Increasing Subsequence Blueprint
~~~cpp
vector<int> printingLongestIncreasingSubsequence(vector<int> &arr, int n) {
    vector<int> dp(n, 1), hash(n);
    int maxi = 1;
    int lastIndex = 0;

    for (int i = 0; i < n; i++) {
        hash[i] = i;
        for (int prev = 0; prev < i; prev++) {
            if (arr[prev] < arr[i] && 1 + dp[prev] > dp[i]) {
                dp[i] = 1 + dp[prev];
                hash[i] = prev; // Record predecessor index for backtracking!
            }
        }
        if (dp[i] > maxi) {
            maxi = dp[i];
            lastIndex = i;
        }
    }

    // Backtrack from lastIndex using hash[] to reconstruct the LIS
    vector<int> temp;
    temp.push_back(arr[lastIndex]);
    while (hash[lastIndex] != lastIndex) {
        lastIndex = hash[lastIndex];
        temp.push_back(arr[lastIndex]);
    }
    reverse(temp.begin(), temp.end());
    return temp;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Initializing \`dp(n, 0)\` Instead of \`dp(n, 1)\`:** Every single element \`arr[i]\` is already an increasing subsequence of length \`1\` on its own! Always initialize \`dp\` with **\`1\`**, not \`0\`.`),
      theorySummary: cleanText(`Defining dp[i] as the LIS ending at index i reduces space to O(N). Tracking predecessor indices in hash[i] enables linear backtracking to reconstruct the optimal subsequence.`),
    },

    {
      order: 223,
      name: "Patience-Sorting Lower-Bound Replacement: Longest Increasing Subsequence Using Binary Search in O(N log N)",
      slug: "dsa-longest-increasing-subsequence-binary-search",
      subtrack: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      description: "Compute the exact length of the Longest Increasing Subsequence in O(N log N) time using greedy tail minimization and std::lower_bound.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 223: Longest Increasing Subsequence | Binary Search (DP 43)",
          url: cleanUrl("https://www.youtube.com/watch?v=on2hvxBXJH4"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Increasing Subsequence Binary Search (DP 43)",
          url: "https://takeuforward.org/data-structure/longest-increasing-subsequence-binary-search-dp-43/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Longest Increasing Subsequence (O(N log N)) (LC 300)",
          url: cleanUrl("https://leetcode.com/problems/longest-increasing-subsequence/"),
          difficulty: "Medium",
          description: "Solve Longest Increasing Subsequence in O(N log N) time using std::lower_bound.",
        },
        {
          platform: "LeetCode",
          title: "Russian Doll Envelopes (LC 354)",
          url: cleanUrl("https://leetcode.com/problems/russian-doll-envelopes/"),
          difficulty: "Hard",
          description: "Sort envelopes by width ascending (and height descending on ties), then run O(N log N) Binary Search LIS on heights!",
        },
        {
          platform: "LeetCode",
          title: "Find the Longest Valid Obstacle Course at Each Position (LC 1964)",
          url: cleanUrl("https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/"),
          difficulty: "Hard",
          description: "Use upper_bound instead of lower_bound to find the longest non-decreasing subsequence in O(N log N).",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
When \`N = 10^5\`, the \`O(N²)\` DP solution for Longest Increasing Subsequence causes Time Limit Exceeded (\`10^{10}\` operations). By combining greedy tail minimization with **Binary Search (\`std::lower_bound\`)**, we can compute the exact **length of the LIS in \`O(N log N)\` time**!

### 💡 Key Takeaways
- **The Greedy Tail-Replacement Intuition:**
  - Instead of generating dozens of separate subsequence arrays, maintain a single sorted vector \`temp\`.
  - Iterate through each \`arr[i]\`:
    1. **If \`arr[i] > temp.back()\`:** \`arr[i]\` extends our longest subsequence! Append \`temp.push_back(arr[i])\`.
    2. **Else (\`arr[i] <= temp.back()\`):** Find the **first element in \`temp\` that is \`>= arr[i]\`** using **\`lower_bound(temp.begin(), temp.end(), arr[i])\`**, and **overwrite** \`temp[ind] = arr[i]\`!
  - Why does overwriting work? Replacing a larger value in \`temp\` with a smaller value \`arr[i]\` at index \`ind\` preserves the length of \`temp\` while making it easier for future elements to extend a subsequence of length \`ind + 1\`!
- **Crucial Warning:**
  - The vector \`temp\` is **NOT** the actual LIS string itself—it only has the **exact same length (\`temp.size()\`)** as the true LIS!
- **Complexity:** \`O(N log N)\` Time and \`O(N)\` Space.

### 💻 Longest Increasing Subsequence (O(N log N) Binary Search) Blueprint
~~~cpp
int longestIncreasingSubsequenceBS(vector<int> &arr, int n) {
    vector<int> temp;
    temp.push_back(arr[0]);

    for (int i = 1; i < n; i++) {
        if (arr[i] > temp.back()) {
            // Extends the longest increasing subsequence found so far
            temp.push_back(arr[i]);
        } else {
            // Find the first element >= arr[i] and replace it to keep tails minimal
            int ind = lower_bound(temp.begin(), temp.end(), arr[i]) - temp.begin();
            temp[ind] = arr[i];
        }
    }
    return temp.size();
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Printing \`temp\` When Asked to Print the Actual LIS:** Overwriting earlier positions in \`temp\` (e.g., replacing \`1\` with \`-1\` in \`[1, 7, 8]\` to get \`[-1, 7, 8]\`) breaks relative index order! \`temp.size()\` gives the **exact LIS length**, whereas printing the LIS requires the \`hash[]\` array method from DP 42.`),
      theorySummary: cleanText(`Patience sorting maintains the smallest tail of each subsequence length. By using lower_bound to overwrite or extend the tail array, LIS length is solved in O(N log N) time and O(N) space.`),
    },

    {
      order: 224,
      name: "Transitive Divisibility Sorting: Largest Divisible Subset",
      slug: "dsa-largest-divisible-subset-lis-variant",
      subtrack: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      description: "Sort the array to establish transitive divisibility, then apply 1D LIS tabulation with backtracking to extract the largest divisible subset.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 224: Largest Divisible Subset | Longest Increasing Subsequence (DP 44)",
          url: cleanUrl("https://www.youtube.com/watch?v=gDuZwBW9VvM"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Largest Divisible Subset (DP 44)",
          url: "https://takeuforward.org/data-structure/largest-divisible-subset-dp-44/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Largest Divisible Subset (LC 368)",
          url: cleanUrl("https://leetcode.com/problems/largest-divisible-subset/"),
          difficulty: "Medium",
          description: "Given a set of distinct positive integers nums, return the largest subset answer such that every pair (answer[i], answer[j]) satisfies answer[i] % answer[j] == 0 or answer[j] % answer[i] == 0.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Largest Divisible Subset",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/largest-divisible-subset--170643/1"),
          difficulty: "Medium",
          description: "Find and print the largest subset where every pair of elements is mutually divisible.",
        },
        {
          platform: "LeetCode",
          title: "Longest Increasing Subsequence (LC 300)",
          url: cleanUrl("https://leetcode.com/problems/longest-increasing-subsequence/"),
          difficulty: "Medium",
          description: "Compare how sorting transforms pairwise divisibility into a single-check LIS recurrence.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`arr\` of \`N\` distinct positive integers, find and return the **Largest Divisible Subset**—the largest subset in which for **every pair \`(x, y)\`** in the subset, either \`x % y == 0\` or \`y % x == 0\`.

### 💡 Key Takeaways
- **Why Sorting Unlocked the Transitive LIS Property:**
  - Unlike a subsequence, a **subset** has no order constraint, so **we are free to sort \`arr\` in ascending order first**!
  - Suppose \`arr\` is sorted and we have picked \`[1, 4, 8]\` (\`4 % 1 == 0\` and \`8 % 4 == 0\`).
  - Now we consider \`16\`: if **\`16 % 8 == 0\`** (divisible by the **last element \`8\`**), because \`8\` is already a multiple of \`4\` and \`1\`, by **transitivity of divisibility**, \`16\` is automatically divisible by \`4\` and \`1\` too!
  - Therefore, **after sorting \`arr\`, Largest Divisible Subset is 100% identical to Printing LIS (DP 42)**, replacing \`arr[i] > arr[prev]\` with **\`arr[i] % arr[prev] == 0\`**!
- **Complexity:** \`O(N²)\` Time (plus \`O(N log N)\` for sorting) and \`O(N)\` Space.

### 💻 Largest Divisible Subset Blueprint
~~~cpp
vector<int> largestDivisibleSubset(vector<int> &arr) {
    int n = arr.size();
    // 1. Sort the array so divisibility becomes transitive!
    sort(arr.begin(), arr.end());

    vector<int> dp(n, 1), hash(n);
    int maxi = 1, lastIndex = 0;

    // 2. Run 1D LIS Tabulation with (arr[i] % arr[prev] == 0)
    for (int i = 0; i < n; i++) {
        hash[i] = i;
        for (int prev = 0; prev < i; prev++) {
            if (arr[i] % arr[prev] == 0 && 1 + dp[prev] > dp[i]) {
                dp[i] = 1 + dp[prev];
                hash[i] = prev;
            }
        }
        if (dp[i] > maxi) {
            maxi = dp[i];
            lastIndex = i;
        }
    }

    // 3. Reconstruct the subset using hash[]
    vector<int> temp;
    temp.push_back(arr[lastIndex]);
    while (hash[lastIndex] != lastIndex) {
        lastIndex = hash[lastIndex];
        temp.push_back(arr[lastIndex]);
    }
    reverse(temp.begin(), temp.end());
    return temp;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`sort(arr.begin(), arr.end())\` Before Running DP:** Without sorting, \`[8, 4, 16]\` fails \`4 % 8 == 0\`, breaking the transitive divisibility chain!`),
      theorySummary: cleanText(`Sorting the array upfront renders pairwise divisibility transitive: if arr[i] % arr[prev] == 0, arr[i] is divisible by all earlier chain members. The problem reduces to 1D LIS with modulo condition.`),
    },

    {
      order: 225,
      name: "Length-Sorted Single-Insertion Matching: Longest String Chain",
      slug: "dsa-longest-string-chain-lis-variant",
      subtrack: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      description: "Sort words by length and utilize a two-pointer predecessor check within the 1D LIS recurrence to find the longest valid string chain.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 225: Longest String Chain | Longest Increasing Subsequence (DP 45)",
          url: cleanUrl("https://www.youtube.com/watch?v=YY8iBaYcc4g"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest String Chain (DP 45)",
          url: "https://takeuforward.org/data-structure/longest-string-chain-dp-45/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Longest String Chain (LC 1048)",
          url: cleanUrl("https://leetcode.com/problems/longest-string-chain/"),
          difficulty: "Medium",
          description: "Return the length of the longest possible word chain where each word is formed by inserting exactly one letter into the previous word.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Longest String Chain",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/longest-string-chain/1"),
          difficulty: "Medium",
          description: "Find the length of the longest string chain from a given list of words.",
        },
        {
          platform: "LeetCode",
          title: "Longest Word in Dictionary (LC 720)",
          url: cleanUrl("https://leetcode.com/problems/longest-word-in-dictionary/"),
          difficulty: "Medium",
          description: "Find the longest word that can be built one character at a time by other words in the dictionary.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array of words \`words\`, word \`A\` is a **predecessor** of word \`B\` if and only if we can insert **exactly one letter** anywhere in \`A\` without changing the order of the remaining characters to make it equal to \`B\` (e.g., \`"abc"\` → \`"abdc"\`). Return the length of the **Longest String Chain**.

### 💡 Key Takeaways
- **Step 1: Sort Words by String Length (\`comp(s1, s2)\`):**
  - Because a chain can pick words from any index in \`words\` (subset), sort \`words\` in **ascending order of length** (\`s1.size() < s2.size()\`) first!
- **Step 2: Two-Pointer Predecessor Check \`checkPossible(longer, shorter)\`:**
  - First check **\`longer.size() == shorter.size() + 1\`**. If not, return \`false\`.
  - Maintain \`first = 0\` (on \`longer\`) and \`second = 0\` (on \`shorter\`).
  - While \`first < longer.size()\`:
    - If \`second < shorter.size() && longer[first] == shorter[second]\`, advance **both**: \`first++, second++\`.
    - Else (mismatch corresponds to the 1 inserted character in \`longer\`), advance **only \`first++\`**.
  - Return **\`first == longer.size() && second == shorter.size()\`**!
- **Step 3: Apply the 1D LIS Loop:**
  - Replace \`arr[i] > arr[prev]\` with \`checkPossible(words[i], words[prev])\`!
- **Complexity:** \`O(N² * L + N log N)\` Time (where \`L\` is max word length) and \`O(N)\` Space.

### 💻 Longest String Chain Blueprint
~~~cpp
bool checkPossible(const string &s1, const string &s2) {
    // s1 is the longer string, s2 is the shorter string
    if (s1.size() != s2.size() + 1) return false;
    int first = 0, second = 0;

    while (first < s1.size()) {
        if (second < s2.size() && s1[first] == s2[second]) {
            first++;
            second++;
        } else {
            first++; // Skip the extra inserted character in s1
        }
    }
    return (first == s1.size() && second == s2.size());
}

static bool comp(const string &s1, const string &s2) {
    return s1.size() < s2.size();
}

int longestStrChain(vector<string> &words) {
    int n = words.size();
    // 1. Sort words by length ascending (NOT lexicographically!)
    sort(words.begin(), words.end(), comp);

    vector<int> dp(n, 1);
    int maxi = 1;

    // 2. Run 1D LIS Tabulation with checkPossible(words[i], words[prev])
    for (int i = 0; i < n; i++) {
        for (int prev = 0; prev < i; prev++) {
            if (checkPossible(words[i], words[prev]) && 1 + dp[prev] > dp[i]) {
                dp[i] = 1 + dp[prev];
            }
        }
        maxi = max(maxi, dp[i]);
    }
    return maxi;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Using Default \`sort(words.begin(), words.end())\` Without a Length Comparator:** Default \`sort\` sorts strings *alphabetically* (\`"ba"\` after \`"a"\`, \`"bca"\` after \`"ba"\`, but \`"bda"\` might appear out of length order if prefixes differ, e.g., \`"z"\` after \`"abcd"\`!). Always pass a custom comparator sorting by **\`s1.size() < s2.size()\`**!`),
      theorySummary: cleanText(`Sort words by string length ascending to establish a topological chain. A two-pointer helper verifies single-character insertion in O(L) time within the 1D LIS recurrence.`),
    },

    {
      order: 226,
      name: "Bidirectional Prefix/Suffix LIS: Longest Bitonic Subsequence",
      slug: "dsa-longest-bitonic-subsequence-lis",
      subtrack: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      description: "Compute forward LIS and backward LIS tables to find the maximum combined peak bitonic subsequence length dp1[i] + dp2[i] - 1.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 226: Longest Bitonic Subsequence | LIS (DP 46)",
          url: cleanUrl("https://www.youtube.com/watch?v=y4vN0WNdrlg"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Bitonic Subsequence (DP 46)",
          url: "https://takeuforward.org/data-structure/longest-bitonic-subsequence-dp-46/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimum Number of Removals to Make Mountain Array (LC 1671)",
          url: cleanUrl("https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/"),
          difficulty: "Hard",
          description: "Find the minimum deletions to form a mountain array (N - Longest Bitonic Subsequence with dp1[i] > 1 and dp2[i] > 1).",
        },
        {
          platform: "GeeksforGeeks",
          title: "Longest Bitonic subsequence",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0824/1"),
          difficulty: "Medium",
          description: "Find the length of the longest subsequence that is first strictly increasing and then strictly decreasing.",
        },
        {
          platform: "LeetCode",
          title: "Longest Mountain in Array (LC 845)",
          url: cleanUrl("https://leetcode.com/problems/longest-mountain-in-array/"),
          difficulty: "Medium",
          description: "Contrast contiguous mountain subarrays with non-contiguous bitonic subsequences.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A **Bitonic Subsequence** is a subsequence that first **strictly increases** and then **strictly decreases** (note: in classic definitions, a purely increasing or purely decreasing subsequence is also considered bitonic; on LeetCode 1671 "Mountain Array", both slopes must be non-empty).

### 💡 Key Takeaways
- **Viewing a Decreasing Suffix from Right-to-Left as an Increasing Sequence:**
  - Suppose peak element \`arr[i]\` is the turning point of the bitonic subsequence.
  - From **\`0\` to \`i\` (Left to Right)**, the elements must be **strictly increasing** (\`dp1[i]\`).
  - From **\`i\` to \`n - 1\` (Left to Right)**, the elements must be **strictly decreasing**—which is **100% identical to being strictly increasing when read backward from \`n - 1\` down to \`i\` (\`dp2[i]\`)**!
- **Combining \`dp1[i]\` and \`dp2[i]\` Without Double-Counting Peak \`i\`:**
  - Run standard 1D LIS from left to right (\`0\` to \`n - 1\`) to fill \`dp1[i]\`.
  - Run standard 1D LIS from right to left (\`n - 1\` down to \`0\`) to fill \`dp2[i]\`.
  - Because peak \`arr[i]\` is counted once in \`dp1[i]\` and once in \`dp2[i]\`, subtract \`1\`:
    **\`maxi = max(maxi, dp1[i] + dp2[i] - 1)\`**!
- **Complexity:** \`O(N²)\` Time and \`O(N)\` Space.

### 💻 Longest Bitonic Subsequence Blueprint
~~~cpp
int longestBitonicSequence(vector<int> &arr, int n) {
    vector<int> dp1(n, 1); // LIS from Left to Right (0 .. n-1)
    for (int i = 0; i < n; i++) {
        for (int prev = 0; prev < i; prev++) {
            if (arr[prev] < arr[i] && 1 + dp1[prev] > dp1[i]) {
                dp1[i] = 1 + dp1[prev];
            }
        }
    }

    vector<int> dp2(n, 1); // LIS from Right to Left (n-1 .. 0)
    for (int i = n - 1; i >= 0; i--) {
        for (int prev = n - 1; prev > i; prev--) {
            if (arr[prev] < arr[i] && 1 + dp2[prev] > dp2[i]) {
                dp2[i] = 1 + dp2[prev];
            }
        }
    }

    int maxi = 0;
    for (int i = 0; i < n; i++) {
        // Subtract 1 because peak element arr[i] is included in both dp1[i] and dp2[i]
        maxi = max(maxi, dp1[i] + dp2[i] - 1);
    }
    return maxi;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Strict Mountain Requirement (LeetCode 1671 & Updated GFG):** If a problem requires **both** an increasing part and a decreasing part to be non-empty, only update \`maxi\` when **\`dp1[i] > 1 && dp2[i] > 1\`**!`),
      theorySummary: cleanText(`Bitonic sequences are solved via two passes: forward LIS (dp1) and backward LIS (dp2). The optimal peak maximizes dp1[i] + dp2[i] - 1, subtracting 1 to avoid double-counting the peak element.`),
    },

    {
      order: 227,
      name: "Dual Length & Frequency DP Arrays: Number of Longest Increasing Subsequences",
      slug: "dsa-number-of-longest-increasing-subsequences",
      subtrack: "Module 33: Dynamic Programming on Longest Increasing Subsequences (LIS) & Chain Variants",
      description: "Track both maximum LIS lengths and occurrence frequencies using dual 1D arrays with reset and accumulate transition rules.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 227: Number of Longest Increasing Subsequences (DP 47)",
          url: cleanUrl("https://www.youtube.com/watch?v=cKVl1TFdNXg"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Longest Increasing Subsequences (DP 47)",
          url: "https://takeuforward.org/data-structure/number-of-longest-increasing-subsequences-dp-47/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Longest Increasing Subsequences (LC 673)",
          url: cleanUrl("https://leetcode.com/problems/number-of-longest-increasing-subsequences/"),
          difficulty: "Medium",
          description: "Given an integer array nums, return the number of longest increasing subsequences.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number of Longest Increasing Subsequence",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-longest-increasing-subsequence/1"),
          difficulty: "Medium",
          description: "Count the total number of Longest Increasing Subsequences in a given array.",
        },
        {
          platform: "LeetCode",
          title: "Number of Ways to Arrive at Destination (LC 1976)",
          url: cleanUrl("https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/"),
          difficulty: "Medium",
          description: "Compare the dual-array (reset vs. accumulate) pattern in LIS counting with shortest-path counting.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`arr\` of length \`N\`, find the **total number of Longest Increasing Subsequences** (if the maximum LIS length is \`L\`, count how many distinct index subsequences of length \`L\` exist).

### 💡 Key Takeaways
- **Maintaining Two 1D Arrays (\`dp[i]\` and \`cnt[i]\`):**
  - \`dp[i]\` = length of the LIS ending at index \`i\` (initialized to \`1\`).
  - \`cnt[i]\` = number of such LIS of length \`dp[i]\` ending at index \`i\` (initialized to \`1\`).
- **The Reset vs. Accumulate Rule When \`arr[prev] < arr[i]\`:**
  1. **Strictly Longer LIS Found (\`dp[prev] + 1 > dp[i]\`):**
     - Update length: **\`dp[i] = dp[prev] + 1\`**.
     - **Inherit count:** \`cnt[i] = cnt[prev]\` (all longest subsequences ending at \`prev\` now extend to \`i\`!).
  2. **Another Equal-Length LIS Found (\`dp[prev] + 1 == dp[i]\`):**
     - Length stays \`dp[i]\`.
     - **Accumulate count:** **\`cnt[i] += cnt[prev]\`** (add the new ways from \`prev\`!).
- **Final Aggregation:**
  - Find the global maximum length \`maxi\`. Sum \`cnt[i]\` across **all indices \`i\` where \`dp[i] == maxi\`**!
- **Complexity:** \`O(N²)\` Time and \`O(N)\` Space.

### 💻 Number of Longest Increasing Subsequences Blueprint
~~~cpp
int findNumberOfLIS(vector<int> &arr) {
    int n = arr.size();
    vector<int> dp(n, 1), cnt(n, 1);
    int maxi = 1;

    for (int i = 0; i < n; i++) {
        for (int prev = 0; prev < i; prev++) {
            if (arr[prev] < arr[i] && 1 + dp[prev] > dp[i]) {
                dp[i] = 1 + dp[prev];
                cnt[i] = cnt[prev]; // Inherit count for the new longer length
            } else if (arr[prev] < arr[i] && 1 + dp[prev] == dp[i]) {
                cnt[i] += cnt[prev]; // Add ways of achieving the same max length
            }
        }
        maxi = max(maxi, dp[i]);
    }

    int totalWays = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] == maxi) {
            totalWays += cnt[i];
        }
    }
    return totalWays;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Writing \`cnt[i]++\` Instead of \`cnt[i] += cnt[prev]\`:** If there were \`3\` ways to form an LIS of length \`4\` ending at \`prev\`, extending \`prev\` to \`i\` creates **\`3\` new ways** of length \`5\`, not just \`1\`! Always add \`cnt[prev]\`.`),
      theorySummary: cleanText(`Tracking count along with length uses dual 1D arrays: if dp[prev] + 1 > dp[i], reset count to cnt[prev]; if equal, accumulate cnt[i] += cnt[prev]. Sum counts of all entries with dp[i] == maxi.`),
    },

    // =========================================================================
    // SUBTRACK: Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting) (Topics 228–230)
    // =========================================================================
    {
      order: 228,
      name: "Interval Split Pattern: Matrix Chain Multiplication (MCM) & Partition DP Foundations",
      slug: "dsa-matrix-chain-multiplication-partition-dp-memoization",
      subtrack: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      description: "Master the 4-rule Partition DP framework on ranges [i..j] with split points k applied to Matrix Chain Multiplication top-down memoization.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 228: Matrix Chain Multiplication | MCM | Partition DP (DP 48)",
          url: cleanUrl("https://www.youtube.com/watch?v=vRVfmbCFW7Y"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Matrix Chain Multiplication (DP 48)",
          url: "https://takeuforward.org/data-structure/matrix-chain-multiplication-dp-48/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Matrix Chain Multiplication",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1"),
          difficulty: "Hard",
          description: "Given a sequence of matrices, find the most efficient way to multiply these matrices together (minimum scalar multiplications).",
        },
        {
          platform: "LeetCode",
          title: "Minimum Score Triangulation of Polygon (LC 1039)",
          url: cleanUrl("https://leetcode.com/problems/minimum-score-triangulation-of-polygon/"),
          difficulty: "Medium",
          description: "Triangulate a convex N-gon into N - 2 triangles with minimum vertex-product sum (isomorphic to Matrix Chain Multiplication!).",
        },
        {
          platform: "LeetCode",
          title: "Different Ways to Add Parentheses (LC 241)",
          url: cleanUrl("https://leetcode.com/problems/different-ways-to-add-parentheses/"),
          difficulty: "Medium",
          description: "Practice partitioning expressions at every operator k between i and j.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Whenever a problem asks you to solve a range \`[i ... j]\` by **trying all possible split points \`k\` inside that range** (\`[i ... k]\` and \`[k + 1 ... j]\`) and choosing the optimal order of operations, it belongs to **Partition DP**! The classic prototype is **Matrix Chain Multiplication (MCM)**.

### 💡 Striver's 4 Rules for Every Partition DP Problem
Given an array \`arr\` of size \`N\` representing \`N - 1\` matrices where Matrix \`i\` (\`1 <= i <= N - 1\`) has dimensions **\`arr[i - 1] x arr[i]\`**:
1. **Start with the entire block \`(i, j)\`:** Here, \`i = 1\` and \`j = N - 1\`.
2. **Write the base case:** When \`i == j\` (a single matrix by itself), \`0\` multiplications are needed → **\`if (i == j) return 0;\`**.
3. **Run a loop \`k\` to try all partitions:** For \`k\` from \`i\` to \`j - 1\`, split \`[i ... j]\` into left block **\`f(i, k)\`** (resulting in dimension \`arr[i - 1] x arr[k]\`) and right block **\`f(k + 1, j)\`** (resulting in dimension \`arr[k] x arr[j]\`).
   - Cost to multiply the two resulting matrices together: **\`arr[i - 1] * arr[k] * arr[j]\`**.
   - Total cost for split \`k\`: **\`steps = arr[i - 1] * arr[k] * arr[j] + f(i, k) + f(k + 1, j)\`**.
4. **Return the best (\`min\` or \`max\`) across all splits \`k\`!**
- **Complexity:** \`O(N³)\` Time (\`N²\` states \`(i, j)\`, each running a loop of \`N\` splits \`k\`) and \`O(N²)\` Space.

### 💻 Matrix Chain Multiplication (Top-Down Memoization) Blueprint
~~~cpp
int solveMCM(int i, int j, const vector<int> &arr, vector<vector<int>> &dp) {
    // Base case: single matrix requires 0 multiplications
    if (i == j) return 0;

    if (dp[i][j] != -1) return dp[i][j];

    int mini = 1e9;
    // Try every possible split point k from i to j - 1
    for (int k = i; k < j; k++) {
        int steps = arr[i - 1] * arr[k] * arr[j]
                    + solveMCM(i, k, arr, dp)
                    + solveMCM(k + 1, j, arr, dp);
        mini = min(mini, steps);
    }
    return dp[i][j] = mini;
}

int matrixMultiplication(vector<int> &arr, int N) {
    vector<vector<int>> dp(N, vector<int>(N, -1));
    return solveMCM(1, N - 1, arr, dp);
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Starting \`i\` at \`0\` Instead of \`1\`:** Matrix \`1\` has dimensions \`arr[0] x arr[1]\`, so \`i\` must start at **\`1\`** (not \`0\`), otherwise \`arr[i - 1]\` accesses \`arr[-1]\` out of bounds!`),
      theorySummary: cleanText(`Partition DP solves interval ranges [i..j] by iterating an internal split point k from i to j-1, combining independent subproblem costs with the cross-product merge cost in O(N^3) time.`),
    },

    {
      order: 229,
      name: "Bottom-Up Interval Tabulation: Matrix Chain Multiplication (Tabulation)",
      slug: "dsa-matrix-chain-multiplication-bottom-up-tabulation",
      subtrack: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      description: "Convert top-down MCM recursion into bottom-up iterative tabulation by reversing loop bounds: i from N-1 down to 1, and j from i+1 up to N-1.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 229: Matrix Chain Multiplication | Tabulation (DP 49)",
          url: cleanUrl("https://www.youtube.com/watch?v=pDCXsbAw5Cg"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Matrix Chain Multiplication Tabulation (DP 49)",
          url: "https://takeuforward.org/data-structure/matrix-chain-multiplication-tabulation-dp-49/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Matrix Chain Multiplication (Tabulation)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1"),
          difficulty: "Hard",
          description: "Convert recursive Matrix Chain Multiplication into bottom-up tabulation without recursion stack overhead.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Score Triangulation of Polygon (LC 1039)",
          url: cleanUrl("https://leetcode.com/problems/minimum-score-triangulation-of-polygon/"),
          difficulty: "Medium",
          description: "Use the exact bottom-up loop order (i from N - 1 down to 1, j from i + 1 to N - 1) to triangulate a polygon.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Brackets in Matrix Chain Multiplication",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/brackets-in-matrix-chain-multiplication1024/1"),
          difficulty: "Hard",
          description: "Record the optimal split index k in a 2D table to reconstruct the optimal parenthesization string.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
How do we convert top-down Partition DP (\`f(1, N - 1)\`) into **Bottom-Up Tabulation** without memorizing awkward diagonal length loops? By reversing the direction of the top-down parameters \`i\` and \`j\`!

### 💡 Key Takeaways
- **Deriving the Exact Loop Directions for Partition DP Tabulation:**
  1. **Base Case:** For all \`i\` from \`1\` to \`N - 1\`, \`dp[i][i] = 0\`.
  2. **Direction of \`i\`:** In top-down recursion, \`i\` started at \`1\` and moved toward \`N - 1\` (\`f(k + 1, j)\`). Therefore, in bottom-up tabulation, **\`i\` goes from \`N - 1\` down to \`1\`**!
  3. **Direction of \`j\`:** In a valid subproblem \`(i, j)\`, \`j\` is always to the right of \`i\` (\`j >= i\`). Since \`j == i\` is already \`0\`, **\`j\` goes from \`i + 1\` up to \`N - 1\`**!
  4. **Inner Split Loop \`k\`:** Copy the exact inner loop \`for (int k = i; k < j; k++)\` and replace recursive calls with \`dp[i][k] + dp[k + 1][j]\`.
  5. Return **\`dp[1][N - 1]\`**!
- **Complexity:** \`O(N³)\` Time and \`O(N²)\` Space (with zero recursion stack space).

### 💻 Matrix Chain Multiplication (Bottom-Up Tabulation) Blueprint
~~~cpp
int matrixMultiplicationTabulation(vector<int> &arr, int N) {
    vector<vector<int>> dp(N, vector<int>(N, 0));

    // Base case: dp[i][i] = 0 is already initialized

    // 1. i moves backwards from N - 1 down to 1
    for (int i = N - 1; i >= 1; i--) {
        // 2. j is always strictly to the right of i: i + 1 to N - 1
        for (int j = i + 1; j < N; j++) {
            int mini = 1e9;
            // 3. Try all split points k between i and j - 1
            for (int k = i; k < j; k++) {
                int steps = arr[i - 1] * arr[k] * arr[j]
                            + dp[i][k]
                            + dp[k + 1][j];
                mini = min(mini, steps);
            }
            dp[i][j] = mini;
        }
    }
    return dp[1][N - 1];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Looping \`j\` From \`1\` to \`N - 1\`:** Whenever \`j < i\`, the interval \`[i ... j]\` is invalid (empty), and when \`j == i\`, it is the base case \`0\`. Starting \`j\` at **\`i + 1\`** skips all invalid and base states automatically!`),
      theorySummary: cleanText(`Tabulating MCM is achieved systematically by varying i backwards from N-1 to 1 and j forwards from i+1 to N-1, eliminating recursion call stack overhead.`),
    },

    {
      order: 230,
      name: "Sorted Cut-Point Partition DP: Minimum Cost to Cut a Stick",
      slug: "dsa-minimum-cost-to-cut-the-stick-partition-dp",
      subtrack: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      description: "Pre-sort cut coordinates and append stick boundaries 0 and n to decouple subproblems into independent interval partitions.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 230: Minimum Cost to Cut the Stick | Partition DP (DP 50)",
          url: cleanUrl("https://www.youtube.com/watch?v=xwomavsC86c"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Cost to Cut a Stick (DP 50)",
          url: "https://takeuforward.org/data-structure/minimum-cost-to-cut-a-stick-dp-50/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimum Cost to Cut a Stick (LC 1547)",
          url: cleanUrl("https://leetcode.com/problems/minimum-cost-to-cut-a-stick/"),
          difficulty: "Hard",
          description: "Given a wooden stick of length n and an array cuts of positions to cut, return the minimum total cost of the cuts.",
        },
        {
          platform: "LeetCode",
          title: "Burst Balloons (LC 312)",
          url: cleanUrl("https://leetcode.com/problems/burst-balloons/"),
          difficulty: "Hard",
          description: "Compare top-down first-cut partitioning (Stick Cutting) with last-burst partitioning (Burst Balloons).",
        },
        {
          platform: "LeetCode",
          title: "Minimum Cost to Merge Stones (LC 1000)",
          url: cleanUrl("https://leetcode.com/problems/minimum-cost-to-merge-stones/"),
          difficulty: "Hard",
          description: "Extend interval partition DP to merging k consecutive piles of stones.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given a wooden stick of length \`n\` (marked from \`0\` to \`n\`) and an integer array \`cuts\` of size \`c\` indicating positions where you must cut the stick. The cost of making a cut is equal to the **current length of the stick segment being cut**. Find the **minimum total cost** to perform all \`c\` cuts in an optimal order.

### 💡 Key Takeaways
- **Why We MUST Sort \`cuts\` First:**
  - Suppose \`cuts = [1, 3, 4, 5, 2]\` is unsorted and we cut at \`4\`. Then \`2\` (which physically lies in the left piece \`[0 .. 4]\`) is still sitting in the right subarray!
  - If the left and right subproblems share overlapping physical stick segments, they **cannot be solved independently**!
  - **Sorting \`cuts\` in ascending order** guarantees that when we make a cut at \`cuts[ind]\`, all cuts \`i .. ind - 1\` lie strictly in the left stick segment and all cuts \`ind + 1 .. j\` lie strictly in the right stick segment!
- **Inserting Boundary Sentinels \`0\` and \`n\`:**
  - Insert \`0\` at the front of \`cuts\` and push \`n\` at the back of \`cuts\` (so \`cuts\` now has size \`c + 2\`, with actual cuts at indices \`1 .. c\`).
  - Now, for any active cut subproblem \`(i, j)\`, what is the exact physical length of the current stick segment?
    **\`currentLength = cuts[j + 1] - cuts[i - 1]\`**!
- **Recurrence (\`f(i, j)\` for \`1 <= i, j <= c\`):**
  - **Base Case (\`i > j\`):** No cuts left in this range → \`return 0\`.
  - **Transition:** For \`ind\` from \`i\` to \`j\`:
    \`cost = (cuts[j + 1] - cuts[i - 1]) + f(i, ind - 1) + f(ind + 1, j)\`
- **Complexity:** \`O(c³)\` Time and \`O(c²)\` Space.

### 💻 Minimum Cost to Cut a Stick (Tabulation) Blueprint
~~~cpp
int minCost(int n, vector<int> &cuts) {
    int c = cuts.size();

    // 1. Insert 0 and n as boundary endpoints, then sort!
    cuts.push_back(n);
    cuts.insert(cuts.begin(), 0);
    sort(cuts.begin(), cuts.end());

    // 2. Allocate (c + 2) x (c + 2) DP table initialized to 0
    vector<vector<int>> dp(c + 2, vector<int>(c + 2, 0));

    // 3. Bottom-up tabulation: i from c down to 1, j from 1 to c
    for (int i = c; i >= 1; i--) {
        for (int j = 1; j <= c; j++) {
            if (i > j) continue; // Base case: i > j is already 0

            int mini = 1e9;
            for (int ind = i; ind <= j; ind++) {
                int cost = (cuts[j + 1] - cuts[i - 1])
                           + dp[i][ind - 1]
                           + dp[ind + 1][j];
                mini = min(mini, cost);
            }
            dp[i][j] = mini;
        }
    }
    return dp[1][c];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Allocating \`dp(c + 1)\` Instead of \`dp(c + 2)\`:** When \`ind == c\`, \`dp[ind + 1][j]\` accesses row **\`c + 1\`**! Always allocate **\`c + 2\`** rows and columns so \`dp[c + 1][j]\` is safely in bounds.`),
      theorySummary: cleanText(`Sorting the cut positions guarantees subproblem independence. Sentinels 0 and n allow the stick length at any cut step to be evaluated as cuts[j + 1] - cuts[i - 1] in O(c^3) partition DP.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 23 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch23Topics) {
    const cleanedPracticeItems = (topic.practiceItems || []).map((p) => ({
      ...p,
      title: cleanText(p.title),
      description: cleanText(p.description),
      url: cleanUrl(p.url),
    }));

    const cleanedVideoLinks = (topic.videoLinks || []).map((v) => ({
      ...v,
      title: cleanText(v.title),
      url: cleanUrl(v.url),
    }));

    const cleanedDocLinks = (topic.docLinks || []).map((d) => ({
      ...d,
      title: cleanText(d.title),
      url: cleanUrl(d.url),
    }));

    const upsertRes = await pool.query(
      `INSERT INTO topics (
        name, slug, subtrack, description, summary_markdown, theory_summary,
        doc_links, video_links, practice_items
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        subtrack = EXCLUDED.subtrack,
        description = EXCLUDED.description,
        summary_markdown = EXCLUDED.summary_markdown,
        theory_summary = EXCLUDED.theory_summary,
        doc_links = EXCLUDED.doc_links,
        video_links = EXCLUDED.video_links,
        practice_items = EXCLUDED.practice_items
      RETURNING id, name, slug;`,
      [
        cleanText(topic.name),
        topic.slug,
        cleanText(topic.subtrack),
        cleanText(topic.description),
        cleanText(topic.summaryMarkdown),
        cleanText(topic.theorySummary),
        JSON.stringify(cleanedDocLinks),
        JSON.stringify(cleanedVideoLinks),
        JSON.stringify(cleanedPracticeItems),
      ]
    );

    const seededTopic = upsertRes.rows[0];
    topicIdMap.set(topic.slug, seededTopic);
    console.log(`  ✅ Upserted Topic [${topic.order}]: "${seededTopic.name}" (ID: ${seededTopic.id})`);

    // Ensure resources table entries
    await pool.query("DELETE FROM resources WHERE topic_id = $1", [seededTopic.id]);

    // Primary Video
    if (cleanedVideoLinks && cleanedVideoLinks.length > 0) {
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

    // Documentation
    if (cleanedDocLinks && cleanedDocLinks.length > 0) {
      await pool.query(
        `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
         VALUES ($1, $2, $3, 'article', $4)`,
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

  // 5. Update track_topics: Link Batch 23 Topics to topic_order 221 through 230
  console.log("\n🔄 Linking Batch 23 topics to 'problem-solving-dsa-sql' (orders 221..230)...");

  // Remove legacy demo topics if still present
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

  // Link Batch 23 Topics (orders 221..230)
  for (const topicDef of batch23Topics) {
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

  console.log("\n🎉 DSA Batch 23 (Lectures 221–230) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch23()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch23;
