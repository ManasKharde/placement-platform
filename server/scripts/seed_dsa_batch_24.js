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

const seedDsaBatch24 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 24 (Lectures 231–240) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 24 Topics (Lectures 231–240)
  const batch24Topics = [
    // =========================================================================
    // SUBTRACK: Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting) (Topics 231–234)
    // =========================================================================
    {
      order: 231,
      name: "Reverse-Elimination Partition DP: Burst Balloons",
      slug: "dsa-burst-balloons-partition-dp",
      subtrack: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      description: "Solve the Burst Balloons problem by considering which balloon bursts last in an interval [i..j], keeping subproblems independent.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 231: Burst Balloons | Partition DP (DP 51)",
          url: cleanUrl("https://www.youtube.com/watch?v=Yz4LlDSlkns"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Burst Balloons (DP 51)",
          url: "https://takeuforward.org/data-structure/burst-balloons-partition-dp-dp-51/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Burst Balloons (LC 312)",
          url: cleanUrl("https://leetcode.com/problems/burst-balloons/"),
          difficulty: "Hard",
          description: "Return the maximum coins you can collect by bursting all balloons wisely.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Burst Balloons",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/burst-balloons/1"),
          difficulty: "Hard",
          description: "Find the maximum coins obtainable by bursting N balloons in an optimal sequence.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Cost to Merge Stones (LC 1000)",
          url: cleanUrl("https://leetcode.com/problems/minimum-cost-to-merge-stones/"),
          difficulty: "Hard",
          description: "Practice bottom-up interval partition DP where subproblems depend on surviving outer boundaries.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given \`n\` balloons indexed \`0\` to \`n - 1\`, each painted with a number \`a[i]\`. If you burst balloon \`i\`, you earn **\`a[i - 1] * a[i] * a[i + 1]\`** coins (where out-of-bounds neighbors at \`-1\` and \`n\` have a virtual value of \`1\`), and afterward balloons \`i - 1\` and \`i + 1\` become adjacent! Find the **maximum coins** you can collect by bursting all balloons.

### 💡 Key Takeaways
- **Why Choosing Which Balloon to Burst FIRST Fails:**
  - Suppose you burst balloon \`ind\` **first** in \`[b1, b2, b3, b4, b5]\`. Once \`b3\` disappears, \`b2\` (in the left subarray) and \`b4\` (in the right subarray) become adjacent!
  - Because bursting a balloon in the left subarray now depends on which balloons survive in the right subarray, the left and right subproblems \`[i .. ind - 1]\` and \`[ind + 1 .. j]\` are **NOT independent**!
- **The Genius Fix — Choose Which Balloon in \`[i .. j]\` Is Burst LAST!**
  - Think in reverse: in the range \`[i .. j]\`, suppose \`ind\` is the **very last balloon burst** inside \`[i .. j]\`.
  - When \`ind\` is burst last in \`[i .. j]\`, every other balloon in \`[i .. j]\` has already been burst, while the boundary balloons **\`i - 1\` and \`j + 1\` just outside the range \`[i .. j]\` are still alive**!
  - Therefore:
    1. Coins earned when \`ind\` bursts last in \`[i .. j]\`: **\`a[i - 1] * a[ind] * a[j + 1]\`**!
    2. While \`ind\` is still alive separating \`[i .. ind - 1]\` and \`[ind + 1 .. j]\`, the left and right subproblems are **100% independent** (\`f(i, ind - 1) + f(ind + 1, j)\`)!
- **Complexity:** \`O(N³)\` Time and \`O(N²)\` Space.

### 💻 Burst Balloons (Bottom-Up Tabulation) Blueprint
~~~cpp
int maxCoins(vector<int> &a) {
    int n = a.size();
    // 1. Pad array with 1 at the front (index 0) and 1 at the back (index n + 1)
    a.push_back(1);
    a.insert(a.begin(), 1);

    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));

    // 2. Bottom-up tabulation: i from n down to 1, j from 1 to n
    for (int i = n; i >= 1; i--) {
        for (int j = 1; j <= n; j++) {
            if (i > j) continue; // Base case: empty range yields 0 coins

            int maxi = INT_MIN;
            // Try every balloon 'ind' as the LAST balloon burst in [i .. j]
            for (int ind = i; ind <= j; ind++) {
                int cost = a[i - 1] * a[ind] * a[j + 1]
                           + dp[i][ind - 1]
                           + dp[ind + 1][j];
                maxi = max(maxi, cost);
            }
            dp[i][j] = maxi;
        }
    }
    return dp[1][n];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Multiplying \`a[ind - 1] * a[ind] * a[ind + 1]\` Instead of \`a[i - 1] * a[ind] * a[j + 1]\`:** Because \`ind\` is the **last** balloon burst in the interval \`[i .. j]\`, all balloons between \`i .. ind - 1\` and \`ind + 1 .. j\` are already gone! Its immediate surviving neighbors at the moment it bursts are **\`i - 1\` and \`j + 1\`**.`),
      theorySummary: cleanText(`Choosing the last balloon to burst in interval [i..j] preserves subproblem independence. Its neighbors at burst time are guaranteed to be surviving boundaries i-1 and j+1, yielding an O(N^3) tabulation solution.`),
    },

    {
      order: 232,
      name: "3D Truth-Value Partition DP: Evaluate Boolean Expression to True",
      slug: "dsa-evaluate-boolean-expression-to-true-partition-dp",
      subtrack: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      description: "Count ways to parenthesize a boolean expression to True using 3D partition DP (i, j, isTrue) stepping by 2 across operator boundaries.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 232: Evaluate Boolean Expression to True | Partition DP (DP 52)",
          url: cleanUrl("https://www.youtube.com/watch?v=MM7fXopgyjw"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Evaluate Boolean Expression to True (DP 52)",
          url: "https://takeuforward.org/data-structure/evaluate-boolean-expression-to-true-partition-dp-dp-52/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Boolean Parenthesization",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/boolean-parenthesization5610/1"),
          difficulty: "Hard",
          description: "Count the number of ways we can parenthesize a boolean expression of T, F, &, |, and ^ so that the value of expression evaluates to true.",
        },
        {
          platform: "LeetCode",
          title: "Parsing A Boolean Expression (LC 1106)",
          url: cleanUrl("https://leetcode.com/problems/parsing-a-boolean-expression/"),
          difficulty: "Hard",
          description: "Evaluate complex nested boolean expressions with AND, OR, and NOT operators.",
        },
        {
          platform: "LeetCode",
          title: "Different Ways to Add Parentheses (LC 241)",
          url: cleanUrl("https://leetcode.com/problems/different-ways-to-add-parentheses/"),
          difficulty: "Medium",
          description: "Split an arithmetic expression at every operator index and combine all left and right sub-results.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a boolean expression string \`exp\` containing operands \`'T'\` (True) and \`'F'\` (False) separated by operators \`'&'\` (AND), \`'|'\` (OR), and \`'^'\` (XOR), count the **number of ways to parenthesize** \`exp\` so that it evaluates to **True**.

### 💡 Key Takeaways
- **Why We Need a 3rd Parameter \`isTrue\` (\`f(i, j, isTrue)\`):**
  - Look at the XOR operator \`'^'\`: \`True ^ False = True\` and \`False ^ True = True\`!
  - Similarly, for OR \`'|'\`: \`True | False = True\`.
  - To know how many ways \`left op right\` evaluates to **True**, we need to know **both** how many ways the left/right subexpressions evaluate to **True (\`lT, rT\`)** AND how many ways they evaluate to **False (\`lF, rF\`)**!
- **Stepping by \`ind += 2\` Over Operators:**
  - Operands sit at even indices (\`i, i + 2, ..., j\`) and operators sit at \`ind = i + 1, i + 3, ..., j - 1\`.
  - **Base Cases:**
    - \`if (i > j) return 0;\`
    - \`if (i == j)\`: If \`isTrue == 1\`, return \`exp[i] == 'T'\`; else return \`exp[i] == 'F'\`.
  - **Combinatorial Rules at Operator \`exp[ind]\`:**
    - **If \`exp[ind] == '&'\`:**
      - Ways for True: \`lT * rT\`
      - Ways for False: \`(lT * rF) + (lF * rT) + (lF * rF)\`
    - **If \`exp[ind] == '|'\`:**
      - Ways for True: \`(lT * rT) + (lT * rF) + (lF * rT)\`
      - Ways for False: \`lF * rF\`
    - **If \`exp[ind] == '^'\`:**
      - Ways for True: \`(lT * rF) + (lF * rT)\`
      - Ways for False: \`(lT * rT) + (lF * rF)\`
- **Complexity:** \`O(N³)\` Time and \`O(2 * N²)\` Space.

### 💻 Evaluate Boolean Expression to True Blueprint
~~~cpp
long long solveBool(int i, int j, int isTrue, const string &exp,
                    vector<vector<vector<long long>>> &dp) {
    if (i > j) return 0;
    if (i == j) {
        if (isTrue == 1) return exp[i] == 'T';
        else return exp[i] == 'F';
    }
    if (dp[i][j][isTrue] != -1) return dp[i][j][isTrue];

    long long ways = 0;
    long long mod = 1000000007;

    // Operators are at every 2nd index: i + 1, i + 3, ..., j - 1
    for (int ind = i + 1; ind <= j - 1; ind += 2) {
        long long lT = solveBool(i, ind - 1, 1, exp, dp);
        long long lF = solveBool(i, ind - 1, 0, exp, dp);
        long long rT = solveBool(ind + 1, j, 1, exp, dp);
        long long rF = solveBool(ind + 1, j, 0, exp, dp);

        if (exp[ind] == '&') {
            if (isTrue) ways = (ways + (lT * rT) % mod) % mod;
            else ways = (ways + (lT * rF) % mod + (lF * rT) % mod + (lF * rF) % mod) % mod;
        } else if (exp[ind] == '|') {
            if (isTrue) ways = (ways + (lT * rT) % mod + (lT * rF) % mod + (lF * rT) % mod) % mod;
            else ways = (ways + (lF * rF) % mod) % mod;
        } else if (exp[ind] == '^') {
            if (isTrue) ways = (ways + (lT * rF) % mod + (lF * rT) % mod) % mod;
            else ways = (ways + (lT * rT) % mod + (lF * rF) % mod) % mod;
        }
    }
    return dp[i][j][isTrue] = ways;
}

int evaluateExp(string &exp) {
    int n = exp.size();
    vector<vector<vector<long long>>> dp(n, vector<vector<long long>>(n, vector<long long>(2, -1)));
    return solveBool(0, n - 1, 1, exp, dp);
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Incrementing \`ind++\` Instead of \`ind += 2\`:** Every operator is separated by an operand (\`T\` or \`F\`), so the partition loop must start at \`ind = i + 1\` and step by **\`ind += 2\`**!`),
      theorySummary: cleanText(`Evaluating boolean expressions requires tracking both True and False outcomes across left and right partitions (lT, lF, rT, rF) for operators &, |, and ^ in O(N^3) time.`),
    },

    {
      order: 233,
      name: "1D Front Partitioning: Palindrome Partitioning II (Minimum Cuts)",
      slug: "dsa-palindrome-partitioning-ii-front-partition-dp",
      subtrack: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      description: "Reduce interval partition to 1D front partition DP f(i) = 1 + f(j+1) for each palindromic prefix s[i..j], subtracting 1 to find minimum cuts.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 233: Palindrome Partitioning - II | Front Partition (DP 53)",
          url: cleanUrl("https://www.youtube.com/watch?v=_H8V5hJUGd0"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Palindrome Partitioning II (DP 53)",
          url: "https://takeuforward.org/data-structure/palindrome-partitioning-ii-front-partition-dp-53/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Palindrome Partitioning II (LC 132)",
          url: cleanUrl("https://leetcode.com/problems/palindrome-partitioning-ii/"),
          difficulty: "Hard",
          description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Palindromic Partitioning",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/palindromic-patitioning4845/1"),
          difficulty: "Hard",
          description: "Find the fewest cuts needed for palindrome partitioning of a given string.",
        },
        {
          platform: "LeetCode",
          title: "Palindrome Partitioning (LC 131)",
          url: cleanUrl("https://leetcode.com/problems/palindrome-partitioning/"),
          difficulty: "Medium",
          description: "Contrast enumerating all palindrome partitions via backtracking with finding the minimum cuts via 1D Front Partition DP.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\` of length \`N\`, find the **minimum number of cuts (partitions)** needed such that **every resulting substring is a palindrome**.

### 💡 Key Takeaways
- **What Is "Front Partition DP" (\`1D\` State \`f(i)\` Instead of \`2D\` \`f(i, j)\`)?**
  - Instead of partitioning in the middle like MCM, we only need to check prefixes starting from index \`i\`:
  - If the substring **\`s[i ... j]\` is a palindrome**, we can make **1 cut right after \`j\`** and recursively solve the remaining suffix **\`f(j + 1)\`**!
  - Because the right boundary is always \`N - 1\`, our state only needs **1 parameter \`i\`** (\`O(N)\` states instead of \`O(N²)\`!).
- **Why We Subtract \`1\` at the End (\`return dp[0] - 1\`):**
  - When \`j == N - 1\` (the very end of the string), our code counts \`1 + f(N) = 1 + 0 = 1\`, which places a partition cut **after the last character** of the string (e.g., \`"a | b | c |"\` counts 3 cuts instead of 2).
  - Subtracting \`1\` at the very end (\`dp[0] - 1\`) removes that trailing cut after \`N - 1\`!
- **Complexity:** \`O(N²)\` Time and \`O(N)\` Space.

### 💻 Palindrome Partitioning II (Bottom-Up Tabulation) Blueprint
~~~cpp
bool isPalindrome(int i, int j, const string &s) {
    while (i < j) {
        if (s[i] != s[j]) return false;
        i++;
        j--;
    }
    return true;
}

int minCut(string s) {
    int n = s.size();
    vector<int> dp(n + 1, 0);
    dp[n] = 0; // Base case: empty suffix at index n requires 0 cuts

    // Move i backwards from n - 1 down to 0
    for (int i = n - 1; i >= 0; i--) {
        int minCost = INT_MAX;
        // Try every valid palindromic prefix s[i ... j]
        for (int j = i; j < n; j++) {
            if (isPalindrome(i, j, s)) {
                int cost = 1 + dp[j + 1];
                minCost = min(minCost, cost);
            }
        }
        dp[i] = minCost;
    }
    // Subtract 1 to exclude the cut counted after the last character (index n - 1)
    return dp[0] - 1;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`- 1\` on Return (\`return dp[0] - 1\`):** A string that is already a palindrome (like \`"aba"\`) takes \`1\` step in our recurrence (\`"aba|"\`)—subtracting \`1\` properly returns \`0\` cuts!`),
      theorySummary: cleanText(`Front partition DP simplifies interval DP to 1D: whenever prefix s[i..j] is a palindrome, recurse on suffix j+1 with cost 1 + dp[j+1]. Subtract 1 from dp[0] to discount the trailing cut.`),
    },

    {
      order: 234,
      name: "Bounded-Window Front Partitioning: Partition Array for Maximum Sum",
      slug: "dsa-partition-array-for-maximum-sum-front-partition-dp",
      subtrack: "Module 34: Partition Dynamic Programming (MCM Pattern & Interval Splitting)",
      description: "Partition an array into subarrays of length at most k to maximize total element sum using 1D front partition DP in O(N*k) time.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 234: Partition Array for Maximum Sum | Front Partition (DP 54)",
          url: cleanUrl("https://www.youtube.com/watch?v=PhWWJmaKfMc"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Partition Array for Maximum Sum (DP 54)",
          url: "https://takeuforward.org/data-structure/partition-array-for-maximum-sum-front-partition-dp-54/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Partition Array for Maximum Sum (LC 1043)",
          url: cleanUrl("https://leetcode.com/problems/partition-array-for-maximum-sum/"),
          difficulty: "Medium",
          description: "Partition the array into contiguous subarrays of length at most k. After partitioning, each subarray has its values changed to become the maximum value of that subarray. Return the largest sum.",
        },
        {
          platform: "LeetCode",
          title: "Filling Bookcase Shelves (LC 1105)",
          url: cleanUrl("https://leetcode.com/problems/filling-bookcase-shelves/"),
          difficulty: "Medium",
          description: "Use the exact same bounded Front Partition DP to group consecutive books onto shelves.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Partition Array for Maximum Sum",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/partition-array-for-maximum-sum/1"),
          difficulty: "Medium",
          description: "Maximize the array sum by partitioning into contiguous subarrays of size at most K.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`num\` of size \`N\` and an integer \`k\`, partition the array into contiguous subarrays of length **at most \`k\`**. After partitioning, every element inside a subarray is replaced by the **maximum value in that subarray**. Find the **largest possible total sum** after partitioning.

### 💡 Key Takeaways
- **Applying Front Partition DP (\`f(ind)\`):**
  - Starting at index \`ind\`, how far can the current subarray \`[ind ... j]\` extend?
  - At most \`k\` elements (\`ind\` up to \`ind + k - 1\`), provided \`j\` does not exceed \`N - 1\`!
  - Therefore, loop **\`j\` from \`ind\` to \`min(n, ind + k) - 1\`**:
    - Increment \`len++\`.
    - Update the running maximum in \`[ind ... j]\`: **\`maxi = max(maxi, num[j])\`**.
    - Since all \`len\` elements in \`[ind ... j]\` become \`maxi\`, the sum of this subarray is **\`len * maxi\`**!
    - Total sum for this partition choice: **\`sum = (len * maxi) + f(j + 1)\`**.
    - Track \`maxAns = max(maxAns, sum)\`.
- **Complexity:** \`O(N * k)\` Time and \`O(N)\` Space.

### 💻 Partition Array for Maximum Sum (Tabulation) Blueprint
~~~cpp
int maxSumAfterPartitioning(vector<int> &num, int k) {
    int n = num.size();
    vector<int> dp(n + 1, 0);

    // Move ind backwards from n - 1 down to 0
    for (int ind = n - 1; ind >= 0; ind--) {
        int len = 0;
        int maxi = INT_MIN;
        int maxAns = INT_MIN;

        // Subarray [ind ... j] can have length at most k (and cannot exceed n - 1)
        for (int j = ind; j < min(n, ind + k); j++) {
            len++;
            maxi = max(maxi, num[j]);
            int sum = (len * maxi) + dp[j + 1];
            maxAns = max(maxAns, sum);
        }
        dp[ind] = maxAns;
    }
    return dp[0];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Looping \`j < ind + k\` Without \`min(n, ind + k)\`:** When \`ind\` is near the end of the array (e.g., \`ind = n - 1\` and \`k = 3\`), \`ind + k\` exceeds \`n\`, causing an out-of-bounds read on \`num[j]\`! Always bound the loop with **\`min(n, ind + k)\`**.`),
      theorySummary: cleanText(`Subarrays of length up to k are evaluated by tracking the running maximum across [ind..j] and adding dp[j+1], achieving an optimal total sum in O(N*k) time and O(N) space.`),
    },

    // =========================================================================
    // SUBTRACK: Module 35: Dynamic Programming on Rectangles & Submatrices (Topics 235–236)
    // =========================================================================
    {
      order: 235,
      name: "Row-Wise Histogram Reduction: Maximum Rectangle Area With All 1's",
      slug: "dsa-maximum-rectangle-area-with-all-1s-dp-on-rectangles",
      subtrack: "Module 35: Dynamic Programming on Rectangles & Submatrices",
      description: "Reduce 2D binary matrix maximal rectangle area to N rows of 1D histogram heights using DP column accumulation and monotonic stack evaluation.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 235: Maximum Rectangle Area with all 1's | DP on Rectangles (DP 55)",
          url: cleanUrl("https://www.youtube.com/watch?v=tOylVCugy9k"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Rectangle Area with all 1's (DP 55)",
          url: "https://takeuforward.org/data-structure/maximum-rectangle-area-with-all-1s-dp-on-rectangles-dp-55/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Maximal Rectangle (LC 85)",
          url: cleanUrl("https://leetcode.com/problems/maximal-rectangle/"),
          difficulty: "Hard",
          description: "Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
        },
        {
          platform: "LeetCode",
          title: "Largest Rectangle in Histogram (LC 84)",
          url: cleanUrl("https://leetcode.com/problems/largest-rectangle-in-histogram/"),
          difficulty: "Hard",
          description: "Master the monotonic stack O(M) subroutine used on each row of Maximal Rectangle.",
        },
        {
          platform: "LeetCode",
          title: "Maximal Square (LC 221)",
          url: cleanUrl("https://leetcode.com/problems/maximal-square/"),
          difficulty: "Medium",
          description: "Find the largest square containing only 1's and return its area.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` binary matrix filled with \`0\`s and \`1\`s, find the **area of the largest rectangle** containing only \`1\`s.

### 💡 Key Takeaways
- **Reducing a 2D Binary Matrix to \`N\` 1D Histograms:**
  - Maintain a 1D array \`height(M, 0)\` representing the consecutive vertical column heights of \`1\`s ending at the current row \`i\`.
  - As we move down row by row (\`i\` from \`0\` to \`N - 1\`):
    - For each column \`j\` (\`0\` to \`M - 1\`):
      - **If \`mat[i][j] == 1\`:** Increment **\`height[j]++\`** (the vertical bar of \`1\`s grows taller by 1!).
      - **Else (\`mat[i][j] == 0\`):** Reset **\`height[j] = 0\`** (a \`0\` at the base breaks the vertical bar completely!).
    - Pass the updated \`height\` array into the **\`largestRectangleArea(height)\`** (Monotonic Stack Histogram algorithm) in \`O(M)\` time and update \`maxArea = max(maxArea, area)\`!
- **Why Is This Considered DP?**
  - Because we **remember** the vertical bar heights from row \`i - 1\` (\`height[j]\`) to compute row \`i\`'s histogram in \`O(1)\` per cell instead of recounting upward from scratch!
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Space.

### 💻 Maximum Rectangle Area With All 1's Blueprint
~~~cpp
int largestRectangleArea(const vector<int> &histo) {
    stack<int> st;
    int maxA = 0;
    int n = histo.size();
    for (int i = 0; i <= n; i++) {
        while (!st.empty() && (i == n || histo[st.top()] >= histo[i])) {
            int height = histo[st.top()];
            st.pop();
            int width = st.empty() ? i : (i - st.top() - 1);
            maxA = max(maxA, width * height);
        }
        st.push(i);
    }
    return maxA;
}

int maximalAreaOfSubMatrixOfAll1(vector<vector<int>> &mat, int n, int m) {
    int maxArea = 0;
    vector<int> height(m, 0);

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (mat[i][j] == 1) height[j]++;
            else height[j] = 0; // Reset bar height to 0 if base cell is 0!
        }
        int area = largestRectangleArea(height);
        maxArea = max(maxArea, area);
    }
    return maxArea;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Keeping \`height[j]\` Unchanged When \`mat[i][j] == 0\`:** A histogram bar cannot float in mid-air above a \`0\`! Whenever \`mat[i][j] == 0\`, you **must reset \`height[j] = 0\`**.`),
      theorySummary: cleanText(`Each row is transformed into a histogram of consecutive vertical 1s using height[j] = mat[i][j] ? height[j] + 1 : 0. Running the monotonic stack histogram algorithm on each row solves maximal rectangle in O(N*M).`),
    },

    {
      order: 236,
      name: "Bottom-Right Corner Square Expansion: Count Square Submatrices With All Ones",
      slug: "dsa-count-square-submatrices-with-all-ones-dp-on-rectangles",
      subtrack: "Module 35: Dynamic Programming on Rectangles & Submatrices",
      description: "Count all-1 square submatrices by defining dp[i][j] = 1 + min({up, left, diag}) as the side length of the largest square with bottom-right corner at (i, j).",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 236: Count Square Submatrices with All Ones | DP on Rectangles (DP 56)",
          url: cleanUrl("https://www.youtube.com/watch?v=auS1fynpnjo"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count Square Submatrices with All Ones (DP 56)",
          url: "https://takeuforward.org/data-structure/count-square-submatrices-with-all-ones-dp-on-rectangles-dp-56/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Count Square Submatrices with All Ones (LC 1277)",
          url: cleanUrl("https://leetcode.com/problems/count-square-submatrices-with-all-ones/"),
          difficulty: "Medium",
          description: "Given an m x n matrix of ones and zeros, return how many square submatrices have all ones.",
        },
        {
          platform: "LeetCode",
          title: "Maximal Square (LC 221)",
          url: cleanUrl("https://leetcode.com/problems/maximal-square/"),
          difficulty: "Medium",
          description: "Use the exact same dp[i][j] = 1 + min({up, left, diag}) recurrence to find the largest square's side length.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count Square Submatrices with all Ones",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/count-square-submatrices-with-all-ones/1"),
          difficulty: "Medium",
          description: "Calculate the total number of square submatrices composed entirely of 1s.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` binary matrix of \`0\`s and \`1\`s, count the **total number of square submatrices** (of size \`1x1\`, \`2x2\`, \`3x3\`, etc.) that contain **all \`1\`s**.

### 💡 Key Takeaways
- **Why Direct Bottom-Up Tabulation Is More Intuitive Than Recursion For Squares:**
  - Define **\`dp[i][j]\`** = the number of all-\`1\` square submatrices whose **bottom-right corner is at \`(i, j)\`** (which is also equal to the side length of the largest all-\`1\` square ending at \`(i, j)\`!).
  - **1. First Row & First Column (\`i == 0\` or \`j == 0\`):**
    - A cell on row \`0\` or column \`0\` can only form a \`1x1\` square if it is \`1\`: **\`dp[i][j] = arr[i][j]\`**.
  - **2. Interior Cells (\`i > 0 && j > 0\`):**
    - If \`arr[i][j] == 0\`, then \`0\` squares can end at \`(i, j)\` → **\`dp[i][j] = 0\`**.
    - If \`arr[i][j] == 1\`, how big of a square can end at \`(i, j)\`? It is constrained by the **minimum** of its three neighbors (Up, Left, and Up-Left Diagonal), plus \`1\` for the \`1x1\` square itself:
      **\`dp[i][j] = 1 + min({dp[i - 1][j], dp[i - 1][j - 1], dp[i][j - 1]})\`**!
  - **3. Final Answer:** Sum \`dp[i][j]\` across all cells \`(i, j)\` in the table!
- **Complexity:** \`O(N * M)\` Time and \`O(N * M)\` Space.

### 💻 Count Square Submatrices With All Ones Blueprint
~~~cpp
int countSquares(int n, int m, vector<vector<int>> &arr) {
    vector<vector<int>> dp(n, vector<int>(m, 0));

    // 1. Copy first row and first column directly
    for (int j = 0; j < m; j++) dp[0][j] = arr[0][j];
    for (int i = 0; i < n; i++) dp[i][0] = arr[i][0];

    // 2. Fill interior cells using the 3-neighbor minimum rule
    for (int i = 1; i < n; i++) {
        for (int j = 1; j < m; j++) {
            if (arr[i][j] == 0) {
                dp[i][j] = 0;
            } else {
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i - 1][j - 1], dp[i][j - 1]});
            }
        }
    }

    // 3. Sum all dp[i][j] values
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            sum += dp[i][j];
        }
    }
    return sum;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Taking \`max\` Instead of \`min\` of the 3 Neighbors:** If Up is \`2\`, Diagonal is \`2\`, and Left is \`0\`, you **cannot** form a \`2x2\` square because the left cell is \`0\`! A square requires **all three** neighboring directions to support it, which is why we take **\`min\`**.`),
      theorySummary: cleanText(`dp[i][j] tracks the largest square ending at (i, j) as 1 + min(dp[i-1][j], dp[i-1][j-1], dp[i][j-1]) when arr[i][j] == 1. Summing dp[i][j] over the entire grid yields the total count of square submatrices in O(N*M).`),
    },

    // =========================================================================
    // SUBTRACK: Module 36: Singly & Doubly Linked Lists: Memory Architecture, Pointer Mutations & Reversal (Topics 237–240)
    // =========================================================================
    {
      order: 237,
      name: "Heap Node Architecture & Pointer Traversal: Introduction to Singly Linked List",
      slug: "dsa-introduction-to-singly-linked-list",
      subtrack: "Module 36: Singly & Doubly Linked Lists: Memory Architecture, Pointer Mutations & Reversal",
      description: "Understand non-contiguous heap node architecture, head reference preservation, array-to-linked-list conversion, length calculation, and element searching.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 237: Introduction to Singly Linked List | Traversal & Search",
          url: cleanUrl("https://www.youtube.com/watch?v=Nq7ok-OyEpg"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Introduction to Singly Linked List",
          url: "https://takeuforward.org/data-structure/introduction-to-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Array to Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/introduction-to-linked-list/1"),
          difficulty: "Easy",
          description: "Construct a singly linked list from a given 1D integer array and return its head.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count Linked List Nodes",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/1"),
          difficulty: "Basic",
          description: "Traverse a singly linked list and return its total number of nodes.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Search in Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/search-in-linked-list-1664434326/1"),
          difficulty: "Easy",
          description: "Check whether a given key exists in a singly linked list.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Unlike arrays (which are stored in **contiguous** memory locations of fixed size), a **Linked List** is a linear data structure stored in **non-contiguous heap memory** that can dynamically grow or shrink at runtime. Each **Node** stores two things:
1. **\`data\`**: The value stored in the node.
2. **\`next\` (\`Node*\`)**: A pointer storing the memory address of the next node in the list (or \`nullptr\` at the tail).

### 💡 Key Takeaways
- **Golden Rule of Linked Lists — NEVER Tamper With \`head\`!**
  - If you move \`head = head->next\` during a traversal, you permanently lose the starting address of the linked list!
  - Always copy \`Node* temp = head;\` and advance \`temp = temp->next\`!
- **Converting an Array \`arr\` to a Linked List (\`O(N)\` Time):**
  1. Create \`Node* head = new Node(arr[0]);\` and set \`Node* mover = head;\`.
  2. Loop \`i\` from \`1\` to \`n - 1\`:
     - Allocate \`Node* temp = new Node(arr[i]);\`.
     - Link \`mover->next = temp;\`.
     - Advance \`mover = temp;\` (or \`mover = mover->next;\`).
  3. Return \`head\`.

### 💻 Singly Linked List Struct, Conversion, Length & Search Blueprint
~~~cpp
class Node {
public:
    int data;
    Node* next;

    Node(int data1, Node* next1 = nullptr) {
        data = data1;
        next = next1;
    }
};

// 1. Convert Array to Linked List: O(N) Time
Node* convertArr2LL(const vector<int> &arr) {
    if (arr.empty()) return nullptr;
    Node* head = new Node(arr[0]);
    Node* mover = head;
    for (int i = 1; i < arr.size(); i++) {
        Node* temp = new Node(arr[i]);
        mover->next = temp;
        mover = temp;
    }
    return head;
}

// 2. Length of Linked List: O(N) Time, O(1) Space
int lengthOfLL(Node* head) {
    int cnt = 0;
    Node* temp = head; // Never move head directly!
    while (temp != nullptr) {
        cnt++;
        temp = temp->next;
    }
    return cnt;
}

// 3. Search an Element in Linked List: O(N) Time
bool checkIfPresent(Node* head, int val) {
    Node* temp = head;
    while (temp != nullptr) {
        if (temp->data == val) return true;
        temp = temp->next;
    }
    return false;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Confusing \`Node\` Object With \`Node*\` Pointer:** \`Node y = Node(2, nullptr)\` creates a stack object, whereas \`Node* y = new Node(2, nullptr)\` allocates a node on the heap and returns its memory address pointer!`),
      theorySummary: cleanText(`Linked lists allocate independent heap nodes linked via pointers. Maintaining head immutability and using mover/temp pointers ensures O(N) traversal, search, and dynamic sizing without contiguous buffer reallocation.`),
    },

    {
      order: 238,
      name: "Pointer Splicing & Memory Deallocation: 8 Deletion and Insertion Operations in a Singly Linked List",
      slug: "dsa-deletion-and-insertion-in-singly-linked-list",
      subtrack: "Module 36: Singly & Doubly Linked Lists: Memory Architecture, Pointer Mutations & Reversal",
      description: "Master all 8 fundamental insertion and deletion operations in a singly linked list with proper pointer splicing and heap memory deallocation.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 238: Insertion and Deletion in Singly Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=VaECK03Dz-g"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Insertion and Deletion in Singly Linked List",
          url: "https://takeuforward.org/data-structure/insertion-and-deletion-in-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Design Linked List (LC 707)",
          url: cleanUrl("https://leetcode.com/problems/design-linked-list/"),
          difficulty: "Medium",
          description: "Implement get, addAtHead, addAtTail, addAtIndex, and deleteAtIndex in a linked list.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Delete a Node in Single Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/delete-a-node-in-single-linked-list/1"),
          difficulty: "Easy",
          description: "Delete the x-th node (1-based index) from a singly linked list and return the updated head.",
        },
        {
          platform: "LeetCode",
          title: "Delete Node in a Linked List (LC 237)",
          url: cleanUrl("https://leetcode.com/problems/delete-node-in-a-linked-list/"),
          difficulty: "Medium",
          description: "Delete a node in a singly linked list when given access only to that node (not the head).",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Master all **8 foundational pointer mutations** on a Singly Linked List:
- **4 Deletions:** (1) Delete Head, (2) Delete Tail, (3) Delete \`K\`-th Node (\`1\`-based), (4) Delete Node by Value \`el\`.
- **4 Insertions:** (1) Insert at Head, (2) Insert at Tail, (3) Insert at \`K\`-th Position, (4) Insert Before Value \`val\`.

### 💡 Key Takeaways
- **1. Deleting the Head (\`O(1)\`):**
  - Guard \`if (head == nullptr) return head;\`.
  - Save \`Node* temp = head;\`, advance \`head = head->next;\`, **\`delete temp;\`** (free heap memory in C++!), and return \`head\`.
- **2. Deleting the Tail (\`O(N)\`):**
  - Guard \`if (head == nullptr || head->next == nullptr) return nullptr;\`.
  - Stop at the **second-to-last node** where **\`temp->next->next == nullptr\`**, \`delete temp->next;\`, and set \`temp->next = nullptr;\`.
- **3. Deleting the \`K\`-th Node (\`O(K)\`):**
  - If \`k == 1\`, delete head. Otherwise, track \`prev = nullptr\` while advancing \`temp\` and \`cnt++\`. When \`cnt == k\`, bypass \`temp\` via **\`prev->next = prev->next->next;\`** and \`delete temp;\`.
- **4. Inserting at the \`K\`-th Position (\`O(K)\`):**
  - If \`k == 1\`, return \`new Node(el, head);\`.
  - Otherwise, stop at the **\`(K - 1)\`-th node** (\`cnt == k - 1\`), allocate \`Node* x = new Node(el, temp->next);\`, and link **\`temp->next = x;\`**!

### 💻 Singly Linked List Deletions & Insertions Blueprint
~~~cpp
// 1. Delete K-th Element (1-based) in Singly Linked List
Node* removeK(Node* head, int k) {
    if (head == nullptr) return head;
    if (k == 1) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return head;
    }
    int cnt = 0;
    Node* temp = head;
    Node* prev = nullptr;
    while (temp != nullptr) {
        cnt++;
        if (cnt == k) {
            prev->next = prev->next->next;
            delete temp;
            break;
        }
        prev = temp;
        temp = temp->next;
    }
    return head;
}

// 2. Insert at K-th Position (1 <= k <= length + 1)
Node* insertPosition(Node* head, int el, int k) {
    if (head == nullptr) {
        if (k == 1) return new Node(el);
        else return head;
    }
    if (k == 1) return new Node(el, head);

    int cnt = 0;
    Node* temp = head;
    while (temp != nullptr) {
        cnt++;
        if (cnt == k - 1) {
            Node* x = new Node(el, temp->next);
            temp->next = x;
            break;
        }
        temp = temp->next;
    }
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Overwriting \`temp->next = x\` Before Setting \`x->next = temp->next\`:** When inserting \`x\` after \`temp\`, always point \`x->next = temp->next\` **first** (or pass \`temp->next\` to the constructor \`new Node(el, temp->next)\`), otherwise you lose the rest of the linked list!`),
      theorySummary: cleanText(`Insertion and deletion require careful pointer updates: preserve successor addresses prior to link assignment, handle boundary head/tail cases explicitly, and free unlinked heap memory with delete.`),
    },

    {
      order: 239,
      name: "Bidirectional Pointer Re-Wiring: Doubly Linked List (Representation, Insertions & Deletions)",
      slug: "dsa-introduction-to-doubly-linked-list-insertions-deletions",
      subtrack: "Module 36: Singly & Doubly Linked Lists: Memory Architecture, Pointer Mutations & Reversal",
      description: "Implement bidirectional doubly linked lists with both next and back pointers, enabling O(1) arbitrary node deletion and flexible insertions.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 239: Introduction to Doubly Linked List | Insertion and Deletion",
          url: cleanUrl("https://www.youtube.com/watch?v=0eKMU10uEDI"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Introduction to Doubly Linked List",
          url: "https://takeuforward.org/data-structure/introduction-to-doubly-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Introduction to Doubly Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/introduction-to-doubly-linked-list/1"),
          difficulty: "Easy",
          description: "Construct a doubly linked list from an integer array and return its head.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Delete node in Doubly Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1"),
          difficulty: "Easy",
          description: "Delete the node at position x (1-based) in a Doubly Linked List.",
        },
        {
          platform: "LeetCode",
          title: "LRU Cache (LC 146)",
          url: cleanUrl("https://leetcode.com/problems/lru-cache/"),
          difficulty: "Medium",
          description: "Apply O(1) Doubly Linked List node deletion and head insertion to build an LRU Cache.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A **Doubly Linked List (DLL)** node maintains **two pointers**: **\`next\`** (pointing to the next node) and **\`back\` / \`prev\`** (pointing to the previous node). This bidirectional linkage allows us to traverse in both directions and delete any given \`Node*\` in **\`O(1)\` time** without needing a separate traversal to find its predecessor!

### 💡 Key Takeaways
- **Deleting the \`K\`-th Node in a DLL (The 4-Case Breakdown):**
  - Advance \`kNode\` to the \`K\`-th node and grab \`Node* prev = kNode->back;\` and \`Node* front = kNode->next;\`.
  - **Case 1 (\`prev == nullptr && front == nullptr\`):** Only 1 node in the DLL → \`delete kNode; return nullptr;\`.
  - **Case 2 (\`prev == nullptr\`):** \`kNode\` is the **Head** → move \`head = head->next; head->back = nullptr; kNode->next = nullptr; delete kNode;\`.
  - **Case 3 (\`front == nullptr\`):** \`kNode\` is the **Tail** → set \`prev->next = nullptr; kNode->back = nullptr; delete kNode;\`.
  - **Case 4 (Interior Node):** Both \`prev\` and \`front\` exist! Link **\`prev->next = front;\`** and **\`front->back = prev;\`**, isolate \`kNode\`, and \`delete kNode;\`!
- **Inserting Before the \`K\`-th Node in a DLL:**
  - If \`k == 1\`, insert before head: \`Node* newHead = new Node(val, head, nullptr); head->back = newHead; return newHead;\`.
  - Otherwise, reach the \`K\`-th node \`temp\` with \`prev = temp->back\`. Allocate **\`Node* newNode = new Node(val, temp, prev);\`** and wire **\`prev->next = newNode; temp->back = newNode;\`**!

### 💻 Doubly Linked List Struct, Deletion & Insertion Blueprint
~~~cpp
class Node {
public:
    int data;
    Node* next;
    Node* back;

    Node(int data1, Node* next1 = nullptr, Node* back1 = nullptr) {
        data = data1;
        next = next1;
        back = back1;
    }
};

// 1. Delete K-th Element in a Doubly Linked List
Node* deleteKthElement(Node* head, int k) {
    if (head == nullptr) return nullptr;
    int cnt = 0;
    Node* kNode = head;
    while (kNode != nullptr) {
        cnt++;
        if (cnt == k) break;
        kNode = kNode->next;
    }
    Node* prev = kNode->back;
    Node* front = kNode->next;

    if (prev == nullptr && front == nullptr) {
        delete kNode;
        return nullptr;
    } else if (prev == nullptr) {
        head = head->next;
        head->back = nullptr;
        kNode->next = nullptr;
        delete kNode;
        return head;
    } else if (front == nullptr) {
        prev->next = nullptr;
        kNode->back = nullptr;
        delete kNode;
        return head;
    }
    prev->next = front;
    front->back = prev;
    kNode->next = kNode->back = nullptr;
    delete kNode;
    return head;
}

// 2. Insert Before K-th Element in a Doubly Linked List
Node* insertBeforeKthElement(Node* head, int k, int val) {
    if (k == 1) {
        Node* newHead = new Node(val, head, nullptr);
        head->back = newHead;
        return newHead;
    }
    Node* temp = head;
    int cnt = 0;
    while (temp != nullptr) {
        cnt++;
        if (cnt == k) break;
        temp = temp->next;
    }
    Node* prev = temp->back;
    Node* newNode = new Node(val, temp, prev);
    prev->next = newNode;
    temp->back = newNode;
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Update \`back\` Pointers:** In a Doubly Linked List, every structural change requires updating **both** \`next\` and \`back\` pointers (\`prev->next = newNode\` AND \`temp->back = newNode\`)!`),
      theorySummary: cleanText(`Doubly linked lists store next and back pointers per node. This symmetric design enables O(1) node deletion by wiring prev->next = front and front->back = prev without preceding traversals.`),
    },

    {
      order: 240,
      name: "In-Place Bidirectional Pointer Swap: Reverse a Doubly Linked List",
      slug: "dsa-reverse-a-doubly-linked-list",
      subtrack: "Module 36: Singly & Doubly Linked Lists: Memory Architecture, Pointer Mutations & Reversal",
      description: "Reverse a doubly linked list in a single pass in O(N) time and O(1) space by swapping next and back pointers at every node.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 240: Reverse a Doubly Linked List | In-Place Swap",
          url: cleanUrl("https://www.youtube.com/watch?v=u3WUW2qe6ww"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Reverse a Doubly Linked List",
          url: "https://takeuforward.org/data-structure/reverse-a-doubly-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Reverse a Doubly Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1"),
          difficulty: "Easy",
          description: "Given a doubly linked list, reverse it in-place in a single traversal and return the new head.",
        },
        {
          platform: "LeetCode",
          title: "Reverse Linked List (LC 206)",
          url: cleanUrl("https://leetcode.com/problems/reverse-linked-list/"),
          difficulty: "Easy",
          description: "Compare reversing a Doubly Linked List with reversing a Singly Linked List.",
        },
        {
          platform: "LeetCode",
          title: "Reverse Linked List II (LC 92)",
          url: cleanUrl("https://leetcode.com/problems/reverse-linked-list-ii/"),
          difficulty: "Medium",
          description: "Reverse a sublist of a linked list from position left to right in one pass.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a **Doubly Linked List**, reverse the list in-place and return the new head.

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Using a Stack (\`O(2N)\` Time, \`O(N)\` Space):**
  - Pass 1: Traverse the DLL and push all \`temp->data\` values onto a \`stack<int> st\`.
  - Pass 2: Traverse the DLL again and overwrite \`temp->data = st.top(); st.pop();\`.
  - **Why Interviewers Reject This:** It takes two passes, uses \`O(N)\` extra memory, and only swaps data instead of reversing the actual node links!
- **2. Optimal In-Place Single-Pass Link Swap (\`O(N)\` Time, \`O(1)\` Space):**
  - Just like swapping two integers \`a\` and \`b\` using a temporary variable (\`temp = a; a = b; b = temp;\`), at every node \`current\` we simply **swap its \`back\` and \`next\` pointers**!
  - Let \`prev = nullptr\` and \`current = head\`.
  - While \`current != nullptr\`:
    1. Save **\`prev = current->back;\`**
    2. Redirect **\`current->back = current->next;\`**
    3. Redirect **\`current->next = prev;\`**
    4. **How do we move \`current\` forward to the next node in the original list?** Since we just swapped \`back\` and \`next\`, the original \`next\` node is now stored in **\`current->back\`**! So advance via **\`current = current->back;\`**!
  - When \`current\` becomes \`nullptr\`, \`prev\` holds the \`back\` pointer of the new head (which is the second node in the reversed list), so the **new head is \`prev->back\`**!

### 💻 Reverse a Doubly Linked List (Single-Pass O(1) Space) Blueprint
~~~cpp
Node* reverseDLL(Node* head) {
    // Edge case: empty list or single-node list
    if (head == nullptr || head->next == nullptr) {
        return head;
    }

    Node* prev = nullptr;
    Node* current = head;

    while (current != nullptr) {
        // Swap current->back and current->next
        prev = current->back;
        current->back = current->next;
        current->next = prev;

        // Because back and next were swapped, move to the next original node via current->back!
        current = current->back;
    }

    // 'prev' sits at the old 2nd-to-last node, so prev->back is the old tail (new head)!
    return prev->back;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Advancing \`current = current->next\` After Swapping Pointers:** Once you swap \`current->back\` and \`current->next\`, \`current->next\` points *backward*! To move forward to the next original node, you **must** write **\`current = current->back;\`**.
- **Forgetting the Single-Node Edge Case (\`head->next == nullptr\`):** If the list has only \`1\` node, \`prev\` remains \`nullptr\` after the loop, so \`prev->back\` would crash! Always check \`if (head == nullptr || head->next == nullptr) return head;\` at the top.`),
      theorySummary: cleanText(`Optimal reversal swaps back and next pointers at each node in-place. After swapping, advancing current = current->back reaches the next original node, returning prev->back as the new head in O(N) time and O(1) space.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 24 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch24Topics) {
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

  // 5. Update track_topics: Link Batch 24 Topics to topic_order 231 through 240
  console.log("\n🔄 Linking Batch 24 topics to 'problem-solving-dsa-sql' (orders 231..240)...");

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

  // Link Batch 24 Topics (orders 231..240)
  for (const topicDef of batch24Topics) {
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

  console.log("\n🎉 DSA Batch 24 (Lectures 231–240) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch24()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch24;
