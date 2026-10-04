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

const seedDsaBatch22 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 22 (Lectures 211–220) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 22 Topics (Lectures 211–220)
  const batch22Topics = [
    // =========================================================================
    // SUBTRACK: Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences (Topics 211–215)
    // =========================================================================
    {
      order: 211,
      name: "LCS Preservation Formula: Minimum Insertions and Deletions to Convert String A to String B",
      slug: "dsa-minimum-insertions-deletions-to-convert-string-a-to-b",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Minimize total insertions and deletions to transform string A into string B by preserving their Longest Common Subsequence intact.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 211: Minimum Insertions/Deletions to Convert String (DP 30)",
          url: cleanUrl("https://www.youtube.com/watch?v=yMnH0jrir0Q"),
          duration: "15m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Insertions/Deletions to Convert String",
          url: "https://takeuforward.org/data-structure/minimum-insertions-deletions-to-convert-string-dp-30/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Delete Operation for Two Strings (LC 583)",
          url: cleanUrl("https://leetcode.com/problems/delete-operation-for-two-strings/"),
          difficulty: "Medium",
          description: "Return the minimum number of steps required to make word1 and word2 the same, where in each step you can delete one character in either string.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Minimum number of deletions and insertions",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-number-of-deletions-and-insertions0209/1"),
          difficulty: "Medium",
          description: "Find the minimum number of deletions and insertions required to transform string str1 into str2.",
        },
        {
          platform: "LeetCode",
          title: "Minimum ASCII Delete Sum for Two Strings (LC 712)",
          url: cleanUrl("https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/"),
          difficulty: "Medium",
          description: "Generalize character deletion counts to minimizing the sum of ASCII values of deleted characters.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given two strings \`s1\` (length \`N\`) and \`s2\` (length \`M\`), you are allowed to **delete** any character from \`s1\` and **insert** any character anywhere into \`s1\`. Find the **minimum total operations (deletions + insertions)** required to transform \`s1\` into \`s2\`.

### 💡 Key Takeaways
- **Keep the Longest Common Subsequence Untouched:**
  - To minimize operations, what is the largest part of \`s1\` that already appears in the exact same order inside \`s2\`? Their **Longest Common Subsequence (\`LCS(s1, s2)\`)**!
  - Let \`k = LCS(s1, s2)\`.
  - **Step 1 (Deletions from \`s1\`):** Every character in \`s1\` that is *not* part of the LCS must be deleted:
    **\`Deletions = N - k\`**.
  - **Step 2 (Insertions into \`s1\`):** To turn the remaining \`k\`-character LCS into \`s2\` (length \`M\`), we must insert all characters of \`s2\` that are *not* in the LCS:
    **\`Insertions = M - k\`**.
  - **Total Minimum Operations:** **\`(N - k) + (M - k) = N + M - 2 * LCS(s1, s2)\`**!
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Space.

### 💻 Minimum Insertions/Deletions to Convert String Blueprint
~~~cpp
int longestCommonSubsequence(string &s1, string &s2) {
    int n = s1.size(), m = s2.size();
    vector<int> prev(m + 1, 0), cur(m + 1, 0);

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                cur[j] = 1 + prev[j - 1];
            } else {
                cur[j] = max(prev[j], cur[j - 1]);
            }
        }
        prev = cur;
    }
    return prev[m];
}

int canYouMake(string &s1, string &s2) {
    int n = s1.size(), m = s2.size();
    int lcsLen = longestCommonSubsequence(s1, s2);
    int deletions = n - lcsLen;
    int insertions = m - lcsLen;
    return deletions + insertions;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Confusing This With Edit Distance (DP 33):** This problem **only** allows Insertions and Deletions (no Replace operation!). Because Replace is not allowed, the problem reduces directly to \`N + M - 2 * LCS(s1, s2)\`.`),
      theorySummary: cleanText(`Transforming s1 to s2 using only insertions and deletions preserves their Longest Common Subsequence, requiring (n - LCS) deletions and (m - LCS) insertions for a total of n + m - 2 * LCS operations.`),
    },

    // -------------------------------------------------------------------------
    // Topic 212
    // -------------------------------------------------------------------------
    {
      order: 212,
      name: "LCS Table Merge Reconstruction: Shortest Common Supersequence (SCS)",
      slug: "dsa-shortest-common-supersequence-dp-on-strings",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Reconstruct the shortest string containing both s1 and s2 as subsequences by backtracking the 2D LCS table and appending leftover prefixes.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 212: Shortest Common Supersequence (DP 31)",
          url: cleanUrl("https://www.youtube.com/watch?v=xElxAuBcvsU"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Shortest Common Supersequence",
          url: "https://takeuforward.org/data-structure/shortest-common-supersequence-dp-31/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Shortest Common Supersequence (LC 1092)",
          url: cleanUrl("https://leetcode.com/problems/shortest-common-supersequence/"),
          difficulty: "Hard",
          description: "Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Shortest Common Supersequence",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/shortest-common-supersequence0322/1"),
          difficulty: "Medium",
          description: "Find the length of the smallest string which has both X and Y as subsequences.",
        },
        {
          platform: "LeetCode",
          title: "Longest Common Subsequence (LC 1143)",
          url: cleanUrl("https://leetcode.com/problems/longest-common-subsequence/"),
          difficulty: "Medium",
          description: "Review the 2D LCS DP table used to reconstruct the Shortest Common Supersequence.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A **Supersequence** of two strings \`s1\` (length \`N\`) and \`s2\` (length \`M\`) is a string that contains **both \`s1\` and \`s2\` as subsequences**. Find the **Shortest Common Supersequence (SCS)**—both its length and the actual string itself!

### 💡 Key Takeaways
- **1. Length of the Shortest Common Supersequence:**
  - Concatenating \`s1 + s2\` gives a trivial supersequence of length \`N + M\`, but it includes their common characters twice!
  - To make the supersequence as short as possible, include the **Longest Common Subsequence (\`LCS\`) only once**:
    **\`SCS Length = N + M - LCS(s1, s2)\`**!
- **2. Reconstructing the SCS String From the 2D LCS Table:**
  - Build the standard 2D LCS table \`dp[N + 1][M + 1]\` and start backtracking at \`i = N, j = M\`:
    - **If \`s1[i - 1] == s2[j - 1]\` (LCS Match):** Include the shared character **once** (\`ans += s1[i - 1]\`), and move diagonally: **\`i--, j--\`**.
    - **Else if \`dp[i - 1][j] > dp[i][j - 1]\` (Move Up):** Before leaving row \`i\`, we **must include \`s1[i - 1]\`** (\`ans += s1[i - 1]\`), then **\`i--\`**.
    - **Else (Move Left):** Before leaving col \`j\`, we **must include \`s2[j - 1]\`** (\`ans += s2[j - 1]\`), then **\`j--\`**.
  - **Crucial Leftover Loops:** After \`while (i > 0 && j > 0)\` ends, append any remaining prefix characters via \`while (i > 0) { ans += s1[i - 1]; i--; }\` and \`while (j > 0) { ans += s2[j - 1]; j--; }\`, then **reverse \`ans\`**!
- **Complexity:** \`O(N * M)\` Time and \`O(N * M)\` Space.

### 💻 Shortest Common Supersequence Blueprint
~~~cpp
string shortestCommonSupersequence(string s1, string s2) {
    int n = s1.size(), m = s2.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

    // 1. Build 2D LCS DP table
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    // 2. Backtrack from (n, m) collecting both common and non-common characters
    string ans = "";
    int i = n, j = m;
    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            ans += s1[i - 1];
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            ans += s1[i - 1];
            i--;
        } else {
            ans += s2[j - 1];
            j--;
        }
    }

    // 3. Append any remaining characters when one string finishes before the other!
    while (i > 0) { ans += s1[i - 1]; i--; }
    while (j > 0) { ans += s2[j - 1]; j--; }

    reverse(ans.begin(), ans.end());
    return ans;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting the Two Leftover \`while (i > 0)\` and \`while (j > 0)\` Loops:** In Print LCS (DP 26), we stopped as soon as \`i == 0 || j == 0\`. In **SCS**, if \`j\` hits \`0\` while \`i > 0\`, the remaining \`i\` characters of \`s1\` are still needed to form a valid supersequence!`),
      theorySummary: cleanText(`The Shortest Common Supersequence has length n + m - LCS(s1, s2). Backtracking the 2D table incorporates common characters once and appends unmatched branch characters.`),
    },

    // -------------------------------------------------------------------------
    // Topic 213
    // -------------------------------------------------------------------------
    {
      order: 213,
      name: "Subsequence Occurrence Counting & 1D Array Optimization: Distinct Subsequences",
      slug: "dsa-distinct-subsequences-1d-array-optimization",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Count distinct occurrences of pattern string t as a subsequence in string s using right-to-left 1D single-array space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 213: Distinct Subsequences (1D Array Optimization - DP 32)",
          url: cleanUrl("https://www.youtube.com/watch?v=nVG7eTiD2bY"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Distinct Subsequences",
          url: "https://takeuforward.org/data-structure/distinct-subsequences-dp-32/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Distinct Subsequences (LC 115)",
          url: cleanUrl("https://leetcode.com/problems/distinct-subsequences/"),
          difficulty: "Hard",
          description: "Given two strings s and t, return the number of distinct subsequences of s which equals t.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Distinct occurrences",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/distinct-occurrences/1"),
          difficulty: "Medium",
          description: "Count the number of distinct occurrences of string T as a subsequence in string S.",
        },
        {
          platform: "LeetCode",
          title: "Distinct Subsequences II (LC 940)",
          url: cleanUrl("https://leetcode.com/problems/distinct-subsequences-ii/"),
          difficulty: "Hard",
          description: "Count the number of distinct non-empty subsequences of a single string s modulo 10^9 + 7.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given two strings \`s\` (length \`N\`) and \`t\` (length \`M\`), count how many **distinct subsequences of \`s\`** equal the target string \`t\`.

### 💡 Key Takeaways
- **Top-Down Recurrence (\`f(i, j)\` = ways to match \`t[0..j]\` inside \`s[0..i]\`):**
  - **Base Case 1 (\`j < 0\` or \`j == 0\` in 1-based indexing):** All characters of \`t\` have been matched! Return **\`1\`**.
  - **Base Case 2 (\`i < 0\` or \`i == 0\` while \`j > 0\`):** String \`s\` is exhausted, but \`t\` still has unmatched characters! Return **\`0\`**.
  - **Transitions:**
    1. **If \`s[i - 1] == t[j - 1]\` (Characters Match):** We can *either* match \`s[i - 1]\` with \`t[j - 1]\` (\`f(i - 1, j - 1)\`) *or* skip \`s[i - 1]\` and look for an earlier occurrence (\`f(i - 1, j)\`):
       **\`dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j]\`**.
    2. **Else (\`s[i - 1] != t[j - 1]\`):** We must skip \`s[i - 1]\`:
       **\`dp[i][j] = dp[i - 1][j]\`**.
- **The 1D Single-Array Right-to-Left Optimization (\`O(M)\` Space):**
  - Notice that row \`i\` only depends on \`prev[j]\` and \`prev[j - 1]\` (exactly like 0/1 Knapsack!).
  - By iterating \`j\` **from Right to Left (\`M\` down to \`1\`)** on a single 1D array \`dp(M + 1, 0)\` with \`dp[0] = 1\`, when \`s[i - 1] == t[j - 1]\` we simply do **\`dp[j] = dp[j] + dp[j - 1]\`**!
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Single-Array Space.

### 💻 Distinct Subsequences (1-Array Space Optimized) Blueprint
~~~cpp
int numDistinct(string s, string t) {
    int n = s.size(), m = t.size();
    // Use double or unsigned long long to prevent intermediate overflow on LeetCode 115
    vector<double> dp(m + 1, 0);

    // Base case: empty target t (j == 0) is matched in 1 way
    dp[0] = 1;

    for (int i = 1; i <= n; i++) {
        // Iterate j from RIGHT TO LEFT (m down to 1) for single-array optimization!
        for (int j = m; j >= 1; j--) {
            if (s[i - 1] == t[j - 1]) {
                dp[j] = dp[j - 1] + dp[j];
            }
            // If s[i - 1] != t[j - 1], dp[j] stays dp[j] (no update needed!)
        }
    }
    return (int)dp[m];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Swapping the Order of Base Cases (\`if (i == 0)\` before \`if (j == 0)\`):** When both \`i == 0\` and \`j == 0\`, both strings are empty, which is a **valid match (\`1\`)**! Always set \`dp[0] = 1\` (or check \`if (j < 0) return 1;\` **before** \`if (i < 0) return 0;\`)!`),
      theorySummary: cleanText(`Distinct subsequences counts occurrences of t in s: on match, dp[j] = dp[j] + dp[j - 1]; on mismatch, dp[j] remains unchanged. Iterating j right-to-left compresses storage to a single array of size M + 1.`),
    },

    // -------------------------------------------------------------------------
    // Topic 214
    // -------------------------------------------------------------------------
    {
      order: 214,
      name: "3-Way String Mutation Recurrence: Edit Distance (Levenshtein Distance)",
      slug: "dsa-edit-distance-dp-on-strings",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Find the minimum insertions, deletions, and replacements to convert s1 into s2 using 2-row space-optimized Levenshtein dynamic programming.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 214: Edit Distance (DP on Strings - DP 33)",
          url: cleanUrl("https://www.youtube.com/watch?v=fJaKO8FbDdo"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Edit Distance",
          url: "https://takeuforward.org/data-structure/edit-distance-dp-33/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Edit Distance (LC 72)",
          url: cleanUrl("https://leetcode.com/problems/edit-distance/"),
          difficulty: "Medium",
          description: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 to word2.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Edit Distance",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/edit-distance3702/1"),
          difficulty: "Medium",
          description: "Find the minimum number of edits (insert, remove, replace) required to convert string s into string t.",
        },
        {
          platform: "LeetCode",
          title: "One Edit Distance (LC 161)",
          url: cleanUrl("https://leetcode.com/problems/one-edit-distance/"),
          difficulty: "Medium",
          description: "Determine if two strings are exactly one edit distance apart in O(N) time.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given two strings \`s1\` (length \`N\`) and \`s2\` (length \`M\`), find the **minimum number of operations** required to convert \`s1\` into \`s2\` using three allowed operations on \`s1\`: **Insert** a character, **Delete** a character, or **Replace** a character.

### 💡 Key Takeaways
- **Base Cases (1-Based Indexing \`i\` in \`0..N\`, \`j\` in \`0..M\`):**
  - **\`i == 0\` (\`s1\` is empty):** To turn an empty string into \`s2[0..j-1]\` of length \`j\`, we need **\`j\` insertions** (\`dp[0][j] = j\`).
  - **\`j == 0\` (\`s2\` is empty):** To turn \`s1[0..i-1]\` of length \`i\` into an empty string, we need **\`i\` deletions** (\`dp[i][0] = i\`, or **\`cur[0] = i\`** at the start of every row in space optimization!).
- **Transitions at \`(i, j)\`:**
  - **If \`s1[i - 1] == s2[j - 1]\` (Characters Match):** \`0\` operations needed! Move both pointers: **\`dp[i - 1][j - 1]\`**.
  - **Else (\`s1[i - 1] != s2[j - 1]\`):** Try all 3 operations (each costs \`1\` operation) and take the minimum:
    1. **Insert \`s2[j - 1]\` after \`i\`:** Matches \`j\`, \`i\` stays at \`i\` → **\`1 + dp[i][j - 1]\`**
    2. **Delete \`s1[i - 1]\`:** Moves \`i\` back, \`j\` stays at \`j\` → **\`1 + dp[i - 1][j]\`**
    3. **Replace \`s1[i - 1]\` with \`s2[j - 1]\`:** Both match and move back → **\`1 + dp[i - 1][j - 1]\`**
- **Why Edit Distance Cannot Be Reduced to \`1\` Single Array Easily:**
  - Because \`cur[j]\` depends on \`prev[j - 1]\`, \`prev[j]\`, **AND \`cur[j - 1]\`**, overwriting in-place from left-to-right destroys \`prev[j - 1]\`, and right-to-left lacks \`cur[j - 1]\`. Two 1D arrays (\`prev\` and \`cur\`) of size \`M + 1\` are ideal!
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Space.

### 💻 Edit Distance (2-Row Space Optimized) Blueprint
~~~cpp
int editDistance(string s1, string s2) {
    int n = s1.size(), m = s2.size();
    vector<int> prev(m + 1, 0), cur(m + 1, 0);

    // Base Case 1: i == 0 requires j insertions
    for (int j = 0; j <= m; j++) prev[j] = j;

    for (int i = 1; i <= n; i++) {
        cur[0] = i; // Base Case 2: j == 0 requires i deletions!
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                cur[j] = prev[j - 1];
            } else {
                int insertOp  = 1 + cur[j - 1];
                int deleteOp  = 1 + prev[j];
                int replaceOp = 1 + prev[j - 1];
                cur[j] = min({insertOp, deleteOp, replaceOp});
            }
        }
        prev = cur;
    }
    return prev[m];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`cur[0] = i;\` Inside the Outer Loop:** In space-optimized Edit Distance, column \`0\` is **not \`0\`**—converting a prefix of length \`i\` to an empty string takes \`i\` deletions, so you **must set \`cur[0] = i;\`** at the start of every row \`i\`!`),
      theorySummary: cleanText(`Edit distance evaluates 3 edit operations on character mismatch: 1 + min(insert: cur[j - 1], delete: prev[j], replace: prev[j - 1]). Two 1D arrays provide O(M) space optimization.`),
    },

    // -------------------------------------------------------------------------
    // Topic 215
    // -------------------------------------------------------------------------
    {
      order: 215,
      name: "Variable-Length Kleene Star Matching: Wildcard Pattern Matching",
      slug: "dsa-wildcard-matching-dp-on-strings",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Match pattern strings with ? and * wildcards against text using a 2-way branching star recurrence in O(N * M) time and O(M) space.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 215: Wildcard Matching (DP on Strings - DP 34)",
          url: cleanUrl("https://www.youtube.com/watch?v=ZmlQ3vgAOMo"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Wildcard Matching",
          url: "https://takeuforward.org/data-structure/wildcard-matching-dp-34/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Wildcard Matching (LC 44)",
          url: cleanUrl("https://leetcode.com/problems/wildcard-matching/"),
          difficulty: "Hard",
          description: "Given an input string s and a pattern p, implement wildcard pattern matching with support for '?' and '*'.",
        },
        {
          platform: "LeetCode",
          title: "Regular Expression Matching (LC 10)",
          url: cleanUrl("https://leetcode.com/problems/regular-expression-matching/"),
          difficulty: "Hard",
          description: "Extend wildcard matching to regex matching where '*' repeats the preceding character zero or more times.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Wildcard Pattern Matching",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/wildcard-pattern-matching/1"),
          difficulty: "Hard",
          description: "Check if a wildcard pattern containing '?' and '*' matches a given text string.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a pattern \`S1\` (length \`N\`, which may contain \`'?'\` and \`'*'\`) and a text string \`S2\` (length \`M\`), determine if \`S1\` completely matches \`S2\`:
- \`'?'\` matches **any single character**.
- \`'*'\` matches **any sequence of characters of length \`0\` or more** (including an empty sequence).

### 💡 Key Takeaways
- **The 3 Base Cases (1-Based Indexing \`i\` for Pattern \`S1\`, \`j\` for Text \`S2\`):**
  1. **\`i == 0 && j == 0\`:** Both pattern and text are exhausted → **\`true\`**.
  2. **\`i == 0 && j > 0\`:** Pattern is exhausted, but text remains → **\`false\`**.
  3. **\`j == 0 && i > 0\`:** Text is exhausted, but pattern \`S1[0..i-1]\` remains! When can a non-empty pattern match an empty string? **If and only if every remaining character in \`S1[0..i-1]\` is \`'*'\`**!
- **The 2-Way \`'*'\` Recurrence (No \`for\` Loop Needed!):**
  - **If \`S1[i - 1] == S2[j - 1] || S1[i - 1] == '?'\`:** Characters match! Return **\`f(i - 1, j - 1)\`**.
  - **If \`S1[i - 1] == '*'\`:** We don't need a loop over all lengths! We simply branch into two choices:
    1. Let \`'*'\` match **nothing (\`0\` chars)** and move pattern back: **\`f(i - 1, j)\`**
    2. Let \`'*'\` consume **1 character of \`S2\`** and **stay at \`'*'\` (\`i\`)** so it can keep consuming more characters in recursive calls: **\`f(i, j - 1)\`**!
    - Return **\`f(i - 1, j) || f(i, j - 1)\`**.
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Space.

### 💻 Wildcard Matching (Space Optimized) Blueprint
~~~cpp
bool wildcardMatching(string pattern, string text) {
    int n = pattern.size(), m = text.size();
    vector<bool> prev(m + 1, false), cur(m + 1, false);

    // Base Case 1: i == 0 && j == 0 is true (i == 0 && j > 0 is already false)
    prev[0] = true;

    for (int i = 1; i <= n; i++) {
        // Base Case 3: j == 0 is true ONLY if pattern[0 .. i-1] consists entirely of '*'
        bool allStars = true;
        for (int ii = 1; ii <= i; ii++) {
            if (pattern[ii - 1] != '*') {
                allStars = false;
                break;
            }
        }
        cur[0] = allStars;

        for (int j = 1; j <= m; j++) {
            if (pattern[i - 1] == text[j - 1] || pattern[i - 1] == '?') {
                cur[j] = prev[j - 1];
            } else if (pattern[i - 1] == '*') {
                // Match 0 chars (prev[j]) OR match >=1 chars (cur[j - 1])
                cur[j] = prev[j] || cur[j - 1];
            } else {
                cur[j] = false;
            }
        }
        prev = cur;
    }
    return prev[m];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Setting \`cur[0] = false\` Unconditionally:** If the pattern starts with leading stars (e.g., \`"***abc"\`), \`cur[0]\` must be **\`true\`** for all leading \`'*'\` characters so they can match an empty prefix of \`text\`!`),
      theorySummary: cleanText(`Wildcard pattern matching resolves '*' via two branches: match zero characters prev[j] or match one-or-more characters cur[j - 1]. Leading '*' characters match empty prefixes.`),
    },

    // =========================================================================
    // SUBTRACK: Module 32: Dynamic Programming on Stocks: State Machines, Transaction Caps, Cooldowns & Fees (Topics 216–220)
    // =========================================================================
    {
      order: 216,
      name: "Unlimited-Transaction Hold/Not-Hold State Machine: Best Time to Buy and Sell Stock II",
      slug: "dsa-best-time-to-buy-and-sell-stock-ii-unlimited-transactions",
      subtrack: "Module 32: Dynamic Programming on Stocks: State Machines, Transaction Caps, Cooldowns & Fees",
      description: "Model unlimited stock transactions using a 2-state (buy/sell) state machine optimized to 4 variables in O(N) time and O(1) space.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 216: Best Time to Buy and Sell Stock II (DP 36)",
          url: cleanUrl("https://www.youtube.com/watch?v=nGJmxkUJQGs"),
          duration: "21m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Best Time to Buy and Sell Stock II",
          url: "https://takeuforward.org/data-structure/buy-and-sell-stock-ii-dp-36/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock II (LC 122)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/"),
          difficulty: "Medium",
          description: "Find the maximum profit you can achieve with unlimited buy/sell transactions (holding at most one share at a time).",
        },
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock (LC 121)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"),
          difficulty: "Easy",
          description: "Review single-transaction stock profit maximization.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Stock buy and sell II",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/stock-buy-and-sell2615/1"),
          difficulty: "Medium",
          description: "Maximize profit across N days when unlimited buy-then-sell transactions are allowed.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`prices\` of length \`N\`, you may buy and sell the stock **as many times as you like**, provided you **sell your current stock before buying again** (you can hold at most \`1\` share at a time). Maximize total profit.

### 💡 Key Takeaways
- **The 2D State \`(ind, buy)\` (Foundation for All Stock DP Problems):**
  - \`ind\`: Current day (\`0\` to \`N - 1\`).
  - \`buy\`: Boolean state (\`1\` = we are **allowed to buy**, \`0\` = we already hold a stock and **must sell** before buying again).
  - **Base Case (\`ind == N\`):** Market is closed! Return \`0\`.
  - **Transitions:**
    1. **If \`buy == 1\` (Can Buy Today):**
       - **Buy today:** Spend \`prices[ind]\` (\`-prices[ind]\`) and transition to \`buy = 0\`: \`-prices[ind] + f(ind + 1, 0)\`
       - **Skip today:** Stay at \`buy = 1\`: \`0 + f(ind + 1, 1)\`
       - \`profit = max(-prices[ind] + f(ind + 1, 0), 0 + f(ind + 1, 1))\`
    2. **Else (\`buy == 0\`, Must Sell Today or Hold):**
       - **Sell today:** Gain \`+prices[ind]\` and transition to \`buy = 1\`: \`+prices[ind] + f(ind + 1, 1)\`
       - **Hold today:** Stay at \`buy = 0\`: \`0 + f(ind + 1, 0)\`
       - \`profit = max(prices[ind] + f(ind + 1, 1), 0 + f(ind + 1, 0))\`
- **4-Variable \`O(1)\` Space Optimization:**
  - Since day \`ind\` only depends on day \`ind + 1\` (\`aheadBuy\` and \`aheadNotBuy\`), we only need 4 integer variables!
- **Complexity:** \`O(N)\` Time and \`O(1)\` Space.

### 💻 Buy and Sell Stock II (4-Variable O(1) Space DP) Blueprint
~~~cpp
int maxProfitStockII(vector<int> &prices) {
    int n = prices.size();
    int aheadNotBuy = 0, aheadBuy = 0;
    int curNotBuy = 0, curBuy = 0;

    // Tabulate backwards from day n - 1 down to day 0
    for (int ind = n - 1; ind >= 0; ind--) {
        // State 1: buy == 1 (allowed to buy)
        curBuy = max(-prices[ind] + aheadNotBuy, 0 + aheadBuy);

        // State 0: buy == 0 (holding stock, allowed to sell)
        curNotBuy = max(prices[ind] + aheadBuy, 0 + aheadNotBuy);

        aheadBuy = curBuy;
        aheadNotBuy = curNotBuy;
    }
    return aheadBuy; // On day 0, we start with buy == 1
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Returning \`aheadNotBuy\` Instead of \`aheadBuy\` at the End:** On Day \`0\`, we do not own any stock yet, so we start with permission to buy (\`buy == 1\`, i.e., \`aheadBuy\`)!`),
      theorySummary: cleanText(`Stock II establishes the core state-machine DP: when buy = 1, choose between buying (-prices[i] + sell_state) or skipping; when buy = 0, choose between selling (+prices[i] + buy_state) or holding in O(1) space.`),
    },

    // -------------------------------------------------------------------------
    // Topic 217
    // -------------------------------------------------------------------------
    {
      order: 217,
      name: "Bounded-Capacity 3D Stock DP: Best Time to Buy and Sell Stock III (At Most 2 Transactions)",
      slug: "dsa-best-time-to-buy-and-sell-stock-iii-at-most-2-transactions",
      subtrack: "Module 32: Dynamic Programming on Stocks: State Machines, Transaction Caps, Cooldowns & Fees",
      description: "Bound stock trading to at most 2 transactions by adding a capacity counter cap that decrements upon selling, solvable in O(1) space.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 217: Best Time to Buy and Sell Stock III (DP 37)",
          url: cleanUrl("https://www.youtube.com/watch?v=-uQGzhYj8BQ"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Best Time to Buy and Sell Stock III",
          url: "https://takeuforward.org/data-structure/buy-and-sell-stock-iii-dp-37/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock III (LC 123)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/"),
          difficulty: "Hard",
          description: "Find the maximum profit you can achieve when you may complete at most two transactions.",
        },
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock IV (LC 188)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/"),
          difficulty: "Hard",
          description: "Generalize the 3D (ind, buy, cap) state from cap = 2 to cap = k transactions.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Buy and Sell a Share at most twice",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/buy-and-sell-a-share-at-most-twice/1"),
          difficulty: "Medium",
          description: "Calculate the maximum profit from at most 2 stock buy-sell transactions.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`prices\` of length \`N\`, find the maximum profit you can achieve if you are allowed to complete **at most \`2\` transactions** (a transaction is a complete \`Buy + Sell\` pair, and you cannot hold multiple shares simultaneously).

### 💡 Key Takeaways
- **Adding the 3rd State Parameter \`cap\` (\`(ind, buy, cap)\`):**
  - Extend Stock II's \`(ind, buy)\` state with **\`cap\`** (\`2, 1, 0\`), representing how many transactions we have left!
  - **When does \`cap\` decrement (\`cap - 1\`)?** A transaction is only completed when we **SELL** a stock!
    - When **Buying (\`buy == 1\`)**: \`cap\` stays **\`cap\`** (\`-prices[ind] + f(ind + 1, 0, cap)\`).
    - When **Selling (\`buy == 0\`)**: \`cap\` becomes **\`cap - 1\`** (\`+prices[ind] + f(ind + 1, 1, cap - 1)\`)!
  - **Base Cases:** If \`ind == N\` OR **\`cap == 0\`**, return \`0\`.
- **Alternative \`N x 4\` Transaction-Number Method (\`tranNo = 0, 1, 2, 3\`):**
  - Instead of \`(buy, cap)\`, track a single integer \`tranNo\` from \`0\` to \`3\` (\`0: Buy1, 1: Sell1, 2: Buy2, 3: Sell2\`). Even \`tranNo\` (\`tranNo % 2 == 0\`) means **Buy**, odd \`tranNo\` means **Sell**!
- **Complexity:** \`O(N * 2 * 3)\` Time and **\`O(2 * 3) = O(1)\` Auxiliary Space** (using \`after[2][3]\` and \`cur[2][3]\`).

### 💻 Buy and Sell Stock III (Constant O(1) Space DP) Blueprint
~~~cpp
int maxProfitStockIII(vector<int> &prices) {
    int n = prices.size();
    // 2 x 3 constant-size tables: buy in {0, 1}, cap in {0, 1, 2}
    vector<vector<int>> after(2, vector<int>(3, 0));
    vector<vector<int>> cur(2, vector<int>(3, 0));

    for (int ind = n - 1; ind >= 0; ind--) {
        for (int buy = 0; buy <= 1; buy++) {
            // cap == 0 is always 0 (base case), so loop cap from 1 to 2
            for (int cap = 1; cap <= 2; cap++) {
                if (buy == 1) {
                    cur[buy][cap] = max(-prices[ind] + after[0][cap],
                                         0 + after[1][cap]);
                } else {
                    // Selling completes 1 transaction -> cap - 1!
                    cur[buy][cap] = max(prices[ind] + after[1][cap - 1],
                                        0 + after[0][cap]);
                }
            }
        }
        after = cur;
    }
    return after[1][2]; // Start at day 0 with buy = 1 and cap = 2
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Decrementing \`cap\` on Both Buy and Sell:** A single transaction consists of **both** a buy and a sell. If you decrement \`cap\` on buy *and* on sell, \`cap = 2\` will only allow 1 full transaction! Decrement \`cap - 1\` **only when selling**.`),
      theorySummary: cleanText(`Limiting stock transactions to at most 2 incorporates a transaction counter cap: cap decrements only upon selling (+prices[i] + after[1][cap - 1]), running in O(N) time and O(1) space.`),
    },

    // -------------------------------------------------------------------------
    // Topic 218
    // -------------------------------------------------------------------------
    {
      order: 218,
      name: "Generalized K-Transaction State Compression: Best Time to Buy and Sell Stock IV",
      slug: "dsa-best-time-to-buy-and-sell-stock-iv-k-transactions",
      subtrack: "Module 32: Dynamic Programming on Stocks: State Machines, Transaction Caps, Cooldowns & Fees",
      description: "Generalize transaction caps to K transactions using a 2*K transaction index state to achieve O(N * K) time and O(K) space.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 218: Best Time to Buy and Sell Stock IV (DP 38)",
          url: cleanUrl("https://www.youtube.com/watch?v=IV1dHbk5CDc"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Best Time to Buy and Sell Stock IV",
          url: "https://takeuforward.org/data-structure/buy-and-sell-stock-iv-dp-38/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock IV (LC 188)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/"),
          difficulty: "Hard",
          description: "Find the maximum profit you can achieve when you may complete at most k transactions.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Maximum Profit (At Most K Transactions)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/maximum-profit4657/1"),
          difficulty: "Hard",
          description: "Compute the maximum profit achievable by buying and selling a share at most K times.",
        },
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock III (LC 123)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/"),
          difficulty: "Hard",
          description: "Verify that setting k = 2 in Stock IV solves Stock III identically.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer \`K\` and an array \`prices\` of length \`N\`, find the maximum profit you can achieve by completing **at most \`K\` transactions**.

### 💡 Key Takeaways
- **1. Direct Generalization of Stock III (\`cap\` up to \`K\`):**
  - Replace \`cap = 2\` from Stock III with \`cap = K\`!
- **2. The \`2 * K\` Transaction-Number (\`tranNo\`) Optimization (\`O(2 * K)\` Space):**
  - Since \`K\` transactions consist of **\`2 * K\` alternating actions**:
    - \`tranNo = 0\` (Buy 1), \`1\` (Sell 1), \`2\` (Buy 2), \`3\` (Sell 2), ..., \`2*K - 1\` (Sell K).
  - Whenever **\`tranNo % 2 == 0\`**, we are in a **Buy** state:
    \`cur[tranNo] = max(-prices[ind] + after[tranNo + 1], 0 + after[tranNo])\`
  - Whenever **\`tranNo % 2 != 0\`**, we are in a **Sell** state:
    \`cur[tranNo] = max(+prices[ind] + after[tranNo + 1], 0 + after[tranNo])\`
  - Base case: \`tranNo == 2 * K\` is \`0\`.
- **Complexity:** \`O(N * 2 * K)\` Time and **\`O(2 * K)\` Space** (two 1D vectors of size \`2 * K + 1\`).

### 💻 Buy and Sell Stock IV (1D \`2*K\` Transaction State) Blueprint
~~~cpp
int maxProfitStockIV(int k, vector<int> &prices) {
    int n = prices.size();
    vector<int> after(2 * k + 1, 0), cur(2 * k + 1, 0);

    for (int ind = n - 1; ind >= 0; ind--) {
        for (int tranNo = 2 * k - 1; tranNo >= 0; tranNo--) {
            if (tranNo % 2 == 0) {
                // Even transaction number -> ALLOWED TO BUY
                cur[tranNo] = max(-prices[ind] + after[tranNo + 1],
                                   0 + after[tranNo]);
            } else {
                // Odd transaction number -> ALLOWED TO SELL
                cur[tranNo] = max(prices[ind] + after[tranNo + 1],
                                  0 + after[tranNo]);
            }
        }
        after = cur;
    }
    return after[0];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Allocating \`vector<int> after(2 * k, 0)\` Instead of \`2 * k + 1\`:** When \`tranNo == 2 * k - 1\` (the final sell), the transition reads \`after[tranNo + 1] = after[2 * k]\`. Always allocate size **\`2 * k + 1\`** so \`after[2 * k] == 0\` is safely in bounds!`),
      theorySummary: cleanText(`Generalizing stock transactions to K actions maps 2*K alternating buy (even) and sell (odd) operations, solvable via a single 1D rolling array of size 2*K + 1 in O(N * K) time.`),
    },

    // -------------------------------------------------------------------------
    // Topic 219
    // -------------------------------------------------------------------------
    {
      order: 219,
      name: "Post-Sale State Skipping (ind + 2): Best Time to Buy and Sell Stock With Cooldown",
      slug: "dsa-best-time-to-buy-and-sell-stock-with-cooldown",
      subtrack: "Module 32: Dynamic Programming on Stocks: State Machines, Transaction Caps, Cooldowns & Fees",
      description: "Implement a mandatory 1-day cooldown period after every stock sale by jumping to day ind + 2 upon selling in O(N) time and O(1) space.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 219: Buy and Sell Stock With Cooldown (DP 39)",
          url: cleanUrl("https://www.youtube.com/watch?v=IGIe46xw3YY"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Buy and Sell Stock with Cooldown",
          url: "https://takeuforward.org/data-structure/buy-and-sell-stock-with-cooldown-dp-39/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock with Cooldown (LC 309)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/"),
          difficulty: "Medium",
          description: "Find the maximum profit with unlimited transactions where after you sell your stock, you cannot buy stock on the next day (1-day cooldown).",
        },
        {
          platform: "GeeksforGeeks",
          title: "Buy Stock with Cooldown",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/buy-stock-with-cooldown/1"),
          difficulty: "Medium",
          description: "Maximize stock profit under a mandatory 1-day cooldown period after each sale.",
        },
        {
          platform: "LeetCode",
          title: "Domino and Tromino Tiling (LC 790)",
          url: cleanUrl("https://leetcode.com/problems/domino-and-tromino-tiling/"),
          difficulty: "Medium",
          description: "Practice multi-step state machine DP transitions.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You can complete unlimited stock transactions, **with one restriction**: after you **sell** your stock on day \`ind\`, you **cannot buy stock on the next day (\`ind + 1\`)** (a mandatory 1-day cooldown!). Find the maximum profit.

### 💡 Key Takeaways
- **The 2-Character Modification From Stock II (\`ind + 2\` on Sell!):**
  - Everything is identical to **Buy and Sell Stock II (DP 36)**, except when we **sell** on day \`ind\`:
  - Because we cannot buy on \`ind + 1\`, after selling on day \`ind\` we simply jump directly to **\`ind + 2\`** with \`buy = 1\`:
    **\`dp[ind][0] = max(prices[ind] + dp[ind + 2][1], 0 + dp[ind + 1][0])\`**!
- **Base Case Adjustment (\`ind >= N\`):**
  - Because \`ind + 2\` can jump from \`N - 1\` to \`N + 1\`, our base case is \`if (ind >= N) return 0;\`, and in tabulation we allocate **\`dp(N + 2, vector<int>(2, 0))\`**!
- **3-Row Space Optimization (\`O(N)\` Time, \`O(1)\` Space):**
  - Maintain \`front1(2, 0)\` (for \`ind + 1\`), \`front2(2, 0)\` (for \`ind + 2\`), and \`cur(2, 0)\`.

### 💻 Buy and Sell Stock With Cooldown (O(1) Space) Blueprint
~~~cpp
int maxProfitWithCooldown(vector<int> &prices) {
    int n = prices.size();
    vector<int> front2(2, 0); // Represents dp[ind + 2]
    vector<int> front1(2, 0); // Represents dp[ind + 1]
    vector<int> cur(2, 0);    // Represents dp[ind]

    for (int ind = n - 1; ind >= 0; ind--) {
        // buy == 1: allowed to buy
        cur[1] = max(-prices[ind] + front1[0], 0 + front1[1]);

        // buy == 0: selling triggers 1-day cooldown -> jump to front2[1] (ind + 2)!
        cur[0] = max(prices[ind] + front2[1], 0 + front1[0]);

        front2 = front1;
        front1 = cur;
    }
    return cur[1];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Allocating \`dp(n + 1)\` Instead of \`dp(n + 2)\` in Tabulation:** On day \`ind = n - 1\`, \`dp[ind + 2][1]\` accesses index **\`n + 1\`**! If you use a 2D DP table, always size it **\`n + 2\`**!`),
      theorySummary: cleanText(`Cooldown after selling transitions directly from day ind to day ind + 2 with buy = 1. Maintaining 3 rolling 2-state vectors achieves O(N) time and O(1) space.`),
    },

    // -------------------------------------------------------------------------
    // Topic 220
    // -------------------------------------------------------------------------
    {
      order: 220,
      name: "Per-Transaction Cost Deduction: Best Time to Buy and Sell Stock With Transaction Fee",
      slug: "dsa-best-time-to-buy-and-sell-stock-with-transaction-fee",
      subtrack: "Module 32: Dynamic Programming on Stocks: State Machines, Transaction Caps, Cooldowns & Fees",
      description: "Deduct a fixed fee once per round-trip trade during sell state transitions in O(N) time and O(1) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 220: Buy and Sell Stock With Transaction Fee (DP 40)",
          url: cleanUrl("https://www.youtube.com/watch?v=k4eK-vEmnKg"),
          duration: "15m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Buy and Sell Stock with Transaction Fee",
          url: "https://takeuforward.org/data-structure/buy-and-sell-stocks-with-transaction-fees-dp-40/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock with Transaction Fee (LC 714)",
          url: cleanUrl("https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/"),
          difficulty: "Medium",
          description: "Return the maximum profit you can achieve with unlimited transactions where you pay 'fee' for each transaction.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Buy Stock with Transaction Fee",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/buy-stock-with-transaction-fee/1"),
          difficulty: "Medium",
          description: "Calculate maximum profit when every completed stock transaction incurs a fixed transaction fee.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Alternating Subsequence Sum (LC 1911)",
          url: cleanUrl("https://leetcode.com/problems/maximum-alternating-subsequence-sum/"),
          difficulty: "Medium",
          description: "Apply the exact same Buy/Sell state-machine DP to maximize alternating subsequence sums.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`prices\` of length \`N\` and a fixed integer \`fee\`, you may complete unlimited transactions, but you must pay **\`fee\` once for every completed transaction (Buy + Sell pair)**. Maximize your total profit.

### 💡 Key Takeaways
- **The 1-Line Modification From Stock II (\`Deduct fee Once per Transaction\`):**
  - Take the exact **Buy and Sell Stock II (DP 36)** code and subtract \`fee\` **either** when you **Sell** (\`prices[ind] - fee + aheadBuy\`) **or** when you **Buy** (\`-prices[ind] - fee + aheadNotBuy\`)!
  - Never subtract \`fee\` on *both* buy and sell—a transaction fee is charged **once per round-trip trade**!
- **Complexity:** \`O(N)\` Time and \`O(1)\` Space.

### 💻 Buy and Sell Stock With Transaction Fee (O(1) Space) Blueprint
~~~cpp
int maxProfitWithFee(vector<int> &prices, int fee) {
    int n = prices.size();
    int aheadNotBuy = 0, aheadBuy = 0;
    int curNotBuy = 0, curBuy = 0;

    for (int ind = n - 1; ind >= 0; ind--) {
        // State 1: buy == 1 (allowed to buy)
        curBuy = max(-prices[ind] + aheadNotBuy, 0 + aheadBuy);

        // State 0: buy == 0 (deduct 'fee' upon completing the sale!)
        curNotBuy = max(prices[ind] - fee + aheadBuy, 0 + aheadNotBuy);

        aheadBuy = curBuy;
        aheadNotBuy = curNotBuy;
    }
    return aheadBuy;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Subtracting \`fee\` on Buy When Using Top-Down Memoization With \`INT_MIN\`:** Subtracting \`fee\` when selling (\`prices[ind] - fee + aheadBuy\`) is safer against integer underflow than subtracting \`fee\` when buying (\`-prices[ind] - fee\`).`),
      theorySummary: cleanText(`Transaction fee is accounted for by subtracting fee once per round-trip, typically during the sell state transition: curNotBuy = max(prices[ind] - fee + aheadBuy, aheadNotBuy).`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 22 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch22Topics) {
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

  // 5. Update track_topics: Link Batch 22 Topics to topic_order 211 through 220
  console.log("\n🔄 Linking Batch 22 topics to 'problem-solving-dsa-sql' (orders 211..220)...");

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

  // Link Batch 22 Topics (orders 211..220)
  for (const topicDef of batch22Topics) {
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

  console.log("\n🎉 DSA Batch 22 (Lectures 211–220) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch22()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch22;
