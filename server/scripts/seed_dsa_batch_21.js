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

const seedDsaBatch21 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 21 (Lectures 201–210) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 21 Topics (Lectures 201–210)
  const batch21Topics = [
    // =========================================================================
    // SUBTRACK: Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack (Topics 201–205)
    // =========================================================================
    {
      order: 201,
      name: "Infinite-Supply Subsequence DP: Minimum Coins (Coin Change I)",
      slug: "dsa-minimum-coins-infinite-supply-pattern",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Find the minimum coins needed to make amount X from infinite denominations by remaining at the current index during take transitions.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 201: Minimum Coins (Coin Change - DP 20)",
          url: cleanUrl("https://www.youtube.com/watch?v=myPeWb3Y68A"),
          duration: "21m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Coins (Coin Change)",
          url: "https://takeuforward.org/data-structure/minimum-coins-dp-20/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Coin Change (LC 322)",
          url: cleanUrl("https://leetcode.com/problems/coin-change/"),
          difficulty: "Medium",
          description: "Return the fewest number of coins that you need to make up amount, or -1 if that amount cannot be made.",
        },
        {
          platform: "LeetCode",
          title: "Perfect Squares (LC 279)",
          url: cleanUrl("https://leetcode.com/problems/perfect-squares/"),
          difficulty: "Medium",
          description: "Find the least number of perfect square numbers that sum to n (identical to Coin Change with square denominations).",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number of Coins",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-coins1824/1"),
          difficulty: "Medium",
          description: "Find the minimum number of coins required to make a given value V from an infinite supply of coins.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`num\` of \`N\` distinct coin denominations and a target sum \`X\`, find the **minimum number of coins** needed to form \`X\` assuming you have an **infinite supply** of each coin denomination. Return \`-1\` if \`X\` cannot be formed.

### 💡 Key Takeaways
- **Why Greedy Fails for General Coin Systems:**
  - If \`coins = {9, 6, 5, 1}\` and \`X = 11\`, Greedy picks the largest coin \`9 + 1 + 1\` (\`3\` coins), missing the optimal \`6 + 5\` (\`2\` coins)! Because coins are not always canonical multiples, we must use DP.
- **The Universal Infinite-Supply Rule (\`Stay at ind When Picking\`):**
  - In standard 0/1 subsequence problems, both \`take\` and \`notTake\` move to \`ind - 1\`.
  - Whenever an item has **infinite supply** (can be picked multiple times):
    - **\`notTake\` moves to \`ind - 1\`:** \`0 + f(ind - 1, T)\`
    - **\`take\` STAYS at \`ind\`:** **\`1 + f(ind, T - num[ind])\`**!
- **Base Case (\`ind == 0\`):**
  - At index \`0\`, we only have coin \`num[0]\`. If \`T % num[0] == 0\`, we need **\`T / num[0]\`** coins; otherwise return **\`1e9\`** (never \`INT_MAX\`, because \`1 + INT_MAX\` overflows!).
- **Complexity:** \`O(N * X)\` Time and \`O(X)\` Space.

### 💻 Minimum Coins (Space Optimized) Blueprint
~~~cpp
int minimumElements(vector<int> &num, int x) {
    int n = num.size();
    vector<int> prev(x + 1, 0), cur(x + 1, 0);

    // 1. Base case at index 0: check divisibility by num[0]
    for (int T = 0; T <= x; T++) {
        if (T % num[0] == 0) prev[T] = T / num[0];
        else prev[T] = 1e9;
    }

    // 2. Fill for indices 1 to n - 1
    for (int ind = 1; ind < n; ind++) {
        for (int T = 0; T <= x; T++) {
            int notTake = 0 + prev[T];
            int take = 1e9;
            if (num[ind] <= T) {
                // Infinite supply: read from 'cur' (same row ind), NOT 'prev'!
                take = 1 + cur[T - num[ind]];
            }
            cur[T] = min(take, notTake);
        }
        prev = cur;
    }

    int ans = prev[x];
    return (ans >= 1e9) ? -1 : ans;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Reading \`prev[T - num[ind]]\` Instead of \`cur[T - num[ind]]\` in \`take\`:** Because \`take\` stays on the **same index \`ind\`** (\`f(ind, T - num[ind])\`), in space-optimized tabulation you must read from the **current row \`cur[T - num[ind]]\`**, not \`prev\`!`),
      theorySummary: cleanText(`Infinite-supply subsequence problems stay at index ind upon picking an element: take = 1 + f(ind, T - num[ind]). In bottom-up DP, this corresponds to reading from cur[T - coin] rather than prev.`),
    },

    // -------------------------------------------------------------------------
    // Topic 202
    // -------------------------------------------------------------------------
    {
      order: 202,
      name: "Sign-Assignment Partition Reduction: Target Sum",
      slug: "dsa-target-sum-dp-on-subsequences",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Map + and - sign assignments directly to partition difference S1 - S2 = target and count valid subsets for target (totSum - target) / 2.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 202: Target Sum (DP 21)",
          url: cleanUrl("https://www.youtube.com/watch?v=b3GD8263-PQ"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Target Sum",
          url: "https://takeuforward.org/data-structure/target-sum-dp-21/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Target Sum (LC 494)",
          url: cleanUrl("https://leetcode.com/problems/target-sum/"),
          difficulty: "Medium",
          description: "Return the number of different expressions that you can build by adding '+' or '-' before each integer so they evaluate to target.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Target Sum",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/target-sum-1626326450/1"),
          difficulty: "Medium",
          description: "Count the number of ways to assign + and - signs to array elements to achieve the target sum.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Partitions with Given Difference",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/partitions-with-given-difference/1"),
          difficulty: "Medium",
          description: "Verify how Target Sum maps directly to Count Partitions With Given Difference (S1 - S2 == target).",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`arr\` of size \`N\` and an integer \`target\`, you must place either a \`'+'\` or a \`'-'\` sign in front of every element in \`arr\`. Count how many different sign assignments evaluate to \`target\`.

### 💡 Key Takeaways
- **Why Shifting Negative Sums in Memoization Is Suboptimal:**
  - If you track \`(ind, currentSum)\` directly, \`currentSum\` can become negative, requiring an offset table or hash map.
- **The Exact Reduction to DP 18 (\`Count Partitions With Given Difference\`):**
  - Group all elements assigned \`'+'\` into subset **\`S1\`**, and all elements assigned \`'-'\` into subset **\`S2\`**.
  - Then we want **\`S1 - S2 == target\`**!
  - Since \`S1 + S2 = totSum\`, substituting \`S1 = totSum - S2\` gives:
    \`(totSum - S2) - S2 = target\`  ⇒  **\`S2 = (totSum - target) / 2\`**!
  - Thus, **Target Sum is 100% identical to counting subsets with sum \`k = (totSum - target) / 2\`**!
- **Complexity:** \`O(N * ((totSum - target) / 2))\` Time and \`O((totSum - target) / 2)\` Space.

### 💻 Target Sum Blueprint
~~~cpp
int findTargetSumWays(vector<int> &nums, int target) {
    int n = nums.size();
    int totSum = 0;
    for (int x : nums) totSum += x;

    // (totSum - target) must be non-negative and even!
    if (totSum - target < 0 || (totSum - target) % 2 != 0) return 0;

    int k = (totSum - target) / 2;
    vector<int> prev(k + 1, 0), cur(k + 1, 0);

    if (nums[0] == 0) prev[0] = 2;
    else prev[0] = 1;

    if (nums[0] != 0 && nums[0] <= k) prev[nums[0]] = 1;

    for (int ind = 1; ind < n; ind++) {
        for (int sum = 0; sum <= k; sum++) {
            int notTake = prev[sum];
            int take = 0;
            if (nums[ind] <= sum) take = prev[sum - nums[ind]];
            cur[sum] = take + notTake;
        }
        prev = cur;
    }
    return prev[k];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting When \`target\` Is Negative (\`totSum - target\`):** Even if \`target\` is negative (e.g., \`target = -5\`), \`totSum - target\` becomes \`totSum + 5\`. However, if \`abs(target) > totSum\`, \`totSum - abs(target) < 0\`, so checking \`totSum - target < 0\` and \`totSum + target < 0\` (or checking \`k <= totSum\`) keeps bounds safe!`),
      theorySummary: cleanText(`Target sum partitions an array into positive S1 and negative S2 sets where S1 - S2 = target. This reduces algebraically to counting subsets with sum S2 = (totSum - target) / 2.`),
    },

    // -------------------------------------------------------------------------
    // Topic 203
    // -------------------------------------------------------------------------
    {
      order: 203,
      name: "Infinite-Supply Combinatorial Counting: Coin Change II (Ways to Make Coin Change)",
      slug: "dsa-coin-change-2-infinite-supply-ways",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Count total combinations to make change for an amount with infinite coin supplies using single-array left-to-right tabulation.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 203: Coin Change II (Ways to Make Coin Change - DP 22)",
          url: cleanUrl("https://www.youtube.com/watch?v=HgyouUi11zk"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Coin Change 2",
          url: "https://takeuforward.org/data-structure/coin-change-2-dp-22/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Coin Change II (LC 518)",
          url: cleanUrl("https://leetcode.com/problems/coin-change-ii/"),
          difficulty: "Medium",
          description: "Return the number of combinations that make up amount from an infinite supply of given coin denominations.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Coin Change (Count Ways)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/coin-change2448/1"),
          difficulty: "Medium",
          description: "Find the number of ways to make change for sum N using an infinite supply of coins.",
        },
        {
          platform: "LeetCode",
          title: "Combination Sum IV (LC 377)",
          url: cleanUrl("https://leetcode.com/problems/combination-sum-iv/"),
          difficulty: "Medium",
          description: "Contrast unordered combinations (outer loop over coins) with ordered permutations (outer loop over target).",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`coins\` of \`N\` distinct denominations (each available in **infinite supply**) and a total \`amount\`, count the **total number of distinct combinations** of coins that sum up to \`amount\`.

### 💡 Key Takeaways
- **Difference Between Coin Change I (DP 20) and Coin Change II (DP 22):**
  1. **Base Case (\`ind == 0\`):**
     - In Coin Change I (min coins), if \`T % coins[0] == 0\`, we returned \`T / coins[0]\`.
     - In **Coin Change II (count ways)**, if \`T % coins[0] == 0\`, using coin \`0\` repeatedly forms **1 single valid combination**—so we return **\`1\`** (and \`0\` otherwise)!
  2. **Transition:**
     - \`notTake = f(ind - 1, T)\`
     - \`take = 0; if (coins[ind] <= T) take = f(ind, T - coins[ind]);\` (no \`+1\` added, just the count of ways!)
     - Return **\`take + notTake\`**.
- **Single-Array Left-to-Right Space Optimization (\`O(amount)\` Space):**
  - Because \`cur[T]\` needs \`prev[T]\` (\`notTake\`) and **\`cur[T - coins[ind]]\`** (\`take\` from the **same row**), iterating \`T\` **from Left to Right (\`0\` to \`amount\`)** on a single 1D array \`dp\` updates \`dp[T]\` in-place!
- **Complexity:** \`O(N * amount)\` Time and \`O(amount)\` Space.

### 💻 Coin Change II (1D Space Optimized) Blueprint
~~~cpp
long countWaysToMakeChange(vector<int> &coins, int n, int value) {
    vector<long> prev(value + 1, 0), cur(value + 1, 0);

    // 1. Base case at index 0: 1 way if divisible by coins[0], else 0
    for (int T = 0; T <= value; T++) {
        prev[T] = (T % coins[0] == 0) ? 1 : 0;
    }

    // 2. Iterate over remaining coins 1 to n - 1
    for (int ind = 1; ind < n; ind++) {
        for (int T = 0; T <= value; T++) {
            long notTake = prev[T];
            long take = 0;
            if (coins[ind] <= T) {
                take = cur[T - coins[ind]]; // Stay at ind -> read from 'cur'!
            }
            cur[T] = take + notTake;
        }
        prev = cur;
    }
    return prev[value];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Returning \`T / coins[0]\` in the Base Case:** In Coin Change II, we are counting **ways**, not the number of coins! Even if it takes five \`2\`-rupee coins to make \`10\`, that is still **1 way** (\`return 1\`), not \`5\` ways!`),
      theorySummary: cleanText(`Coin Change II counts combinations with infinite coin availability: take = f(ind, T - coins[ind]) and notTake = f(ind - 1, T). Divisible base case returns 1 way.`),
    },

    // -------------------------------------------------------------------------
    // Topic 204
    // -------------------------------------------------------------------------
    {
      order: 204,
      name: "Single-Array Left-to-Right Space Optimization: Unbounded Knapsack",
      slug: "dsa-unbounded-knapsack-1d-space-optimized",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Maximize profit with infinite item supplies by iterating capacity left-to-right on a single 1D array in O(N * W) time and O(W) space.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 204: Unbounded Knapsack (DP 23)",
          url: cleanUrl("https://www.youtube.com/watch?v=OgvOZ6OrJoY"),
          duration: "21m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Unbounded Knapsack",
          url: "https://takeuforward.org/data-structure/unbounded-knapsack-dp-23/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Knapsack with Duplicate Items (Unbounded Knapsack)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1"),
          difficulty: "Medium",
          description: "Given N items with weights and values and a knapsack limit W, maximize profit when each item can be picked any number of times.",
        },
        {
          platform: "LeetCode",
          title: "Coin Change (LC 322)",
          url: cleanUrl("https://leetcode.com/problems/coin-change/"),
          difficulty: "Medium",
          description: "Compare minimizing coins in infinite supply with maximizing value in Unbounded Knapsack.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Rod Cutting",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/rod-cutting0840/1"),
          difficulty: "Medium",
          description: "Apply Unbounded Knapsack directly to maximize profit from cutting a rod of length N.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In **Unbounded Knapsack**, you are given \`N\` items with weights \`wt[i]\` and values \`val[i]\`, and a bag of capacity \`W\`. Unlike 0/1 Knapsack, you have an **infinite supply of each item**! Maximize the total value inside capacity \`W\`.

### 💡 Key Takeaways
- **Base Case at \`ind == 0\` (\`(W / wt[0]) * val[0]\`):**
  - If we are at item \`0\` with remaining capacity \`W\`, how many copies of item \`0\` should we steal?
  - As many as fit! We can fit **\`(int)(W / wt[0])\` copies**, earning a total value of **\`(W / wt[0]) * val[0]\`**!
- **Why Single-Array Optimization Iterates LEFT-TO-RIGHT (\`0\` to \`W\`):**
  - In **0/1 Knapsack**, \`cur[w]\` needed \`prev[w - wt[ind]]\` (from the *previous* row), so we had to iterate \`w\` from **Right to Left** (\`W → 0\`) to avoid overwriting \`prev\`.
  - In **Unbounded Knapsack**, \`cur[w]\` needs \`prev[w]\` (right above it) and **\`cur[w - wt[ind]]\`** (from the **current row** to the left!).
  - Therefore, iterating \`w\` from **Left to Right (\`0 → W\`)** on a **single array \`cur\`** means \`cur[w - wt[ind]]\` has *already* been updated for the current row \`ind\`—which is **exactly what we need**!
- **Complexity:** \`O(N * W)\` Time and **\`O(W)\` Single-Array Space**.

### 💻 Unbounded Knapsack (1-Array Space Optimized) Blueprint
~~~cpp
int unboundedKnapsack(int n, int w, vector<int> &profit, vector<int> &weight) {
    // Single 1D array of size w + 1!
    vector<int> cur(w + 1, 0);

    // 1. Base case at index 0: take as many copies of item 0 as fit in W
    for (int W = 0; W <= w; W++) {
        cur[W] = (W / weight[0]) * profit[0];
    }

    // 2. Iterate W from LEFT TO RIGHT (0 to w) on the single array!
    for (int ind = 1; ind < n; ind++) {
        for (int W = 0; W <= w; W++) {
            int notTake = 0 + cur[W]; // cur[W] currently holds prev[W]
            int take = 0;
            if (weight[ind] <= W) {
                take = profit[ind] + cur[W - weight[ind]]; // cur[W - wt] holds updated current row!
            }
            cur[W] = max(take, notTake);
        }
    }
    return cur[w];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Writing \`(W / weight[0])\` Outside Parentheses Without Integer Division:** In C++, \`(W / weight[0]) * profit[0]\` performs integer floor division first (\`10 / 3 = 3\`, \`3 * profit[0]\`). Never write \`(W * profit[0]) / weight[0]\`, which would award fractional item values!`),
      theorySummary: cleanText(`Unbounded Knapsack allows infinite picks of each item: take = val[i] + cur[W - wt[i]]. Iterating capacity left-to-right on a single array naturally updates using current-row states in O(W) space.`),
    },

    // -------------------------------------------------------------------------
    // Topic 205
    // -------------------------------------------------------------------------
    {
      order: 205,
      name: "Piece-Collection Framing: Rod Cutting Problem (1D Space Optimized)",
      slug: "dsa-rod-cutting-problem-unbounded-knapsack",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Reframe cutting a rod of length N into picking rod pieces of length ind + 1 under an Unbounded Knapsack formulation in O(N^2) time.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 205: Rod Cutting Problem (DP 24)",
          url: cleanUrl("https://www.youtube.com/watch?v=mO8XpGoJwuo"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Rod Cutting Problem",
          url: "https://takeuforward.org/data-structure/rod-cutting-problem-dp-24/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Rod Cutting",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/rod-cutting0840/1"),
          difficulty: "Medium",
          description: "Given a rod of length N inches and an array of prices for pieces of size 1 to N, determine the maximum value obtainable by cutting up the rod.",
        },
        {
          platform: "LeetCode",
          title: "Integer Break (LC 343)",
          url: cleanUrl("https://leetcode.com/problems/integer-break/"),
          difficulty: "Medium",
          description: "Break an integer n into the sum of k >= 2 positive integers to maximize the product of those integers.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Cost to Cut a Stick (LC 1547)",
          url: cleanUrl("https://leetcode.com/problems/minimum-cost-to-cut-a-stick/"),
          difficulty: "Hard",
          description: "Contrast Unbounded Knapsack rod cutting with partition-DP stick cutting.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a rod of length \`N\` and an array \`price\` of size \`N\` where \`price[i]\` represents the price of a rod piece of length **\`i + 1\`**, find the **maximum value** obtainable by cutting the rod into pieces and selling them.

### 💡 Key Takeaways
- **Reframing "Cutting a Rod" as "Collecting Rod Pieces to Sum to \`N\`" (Unbounded Knapsack!):**
  - Instead of thinking about where to slice the rod, flip the perspective:
    - Total Knapsack Capacity **\`W = N\`** (the target rod length).
    - At index \`ind\` (\`0\` to \`N - 1\`), the piece has **\`rodLength = ind + 1\`** and value **\`price[ind]\`**.
    - We can pick a piece of \`rodLength\` **as many times as we want** (infinite supply) until the sum of piece lengths equals \`N\`!
- **Base Case (\`ind == 0\`):**
  - At \`ind == 0\`, \`rodLength = 1\`. To form remaining length \`N\`, we must pick \`N\` pieces of length \`1\`, giving total value **\`N * price[0]\`**!
- **Complexity:** \`O(N * N)\` Time and **\`O(N)\` Single-Array Space**.

### 💻 Rod Cutting Problem (1-Array Space Optimized) Blueprint
~~~cpp
int cutRod(vector<int> &price, int n) {
    vector<int> cur(n + 1, 0);

    // 1. Base case at ind == 0 (rodLength == 1): N pieces of length 1 cost N * price[0]
    for (int N = 0; N <= n; N++) {
        cur[N] = N * price[0];
    }

    // 2. Process piece indices 1 to n - 1 using single-array left-to-right iteration
    for (int ind = 1; ind < n; ind++) {
        int rodLength = ind + 1;
        for (int N = 0; N <= n; N++) {
            int notTake = 0 + cur[N];
            int take = INT_MIN;
            if (rodLength <= N) {
                take = price[ind] + cur[N - rodLength];
            }
            cur[N] = max(take, notTake);
        }
    }
    return cur[n];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Using \`ind\` Instead of \`ind + 1\` as the Piece Length:** Because arrays are 0-indexed, index \`ind\` corresponds to a piece of length **\`rodLength = ind + 1\`**! Using \`ind\` directly would treat index \`0\` as a piece of length \`0\` and loop infinitely.`),
      theorySummary: cleanText(`Rod cutting maps directly to Unbounded Knapsack where knapsack capacity is total rod length N, piece lengths are ind + 1, and values are prices[ind], solvable in O(N) space.`),
    },

    // =========================================================================
    // SUBTRACK: Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences (Topics 206–210)
    // =========================================================================
    {
      order: 206,
      name: "Two-String Index-Shifted Recurrence: Longest Common Subsequence (LCS)",
      slug: "dsa-longest-common-subsequence-dp-on-strings",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Compute the length of the longest common subsequence across two strings using match/not-match transitions and 1-based index shifting.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 206: Longest Common Subsequence (DP on Strings - DP 25)",
          url: cleanUrl("https://www.youtube.com/watch?v=NPZn9jBrX8U"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Common Subsequence",
          url: "https://takeuforward.org/data-structure/longest-common-subsequence-dp-25/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Longest Common Subsequence (LC 1143)",
          url: cleanUrl("https://leetcode.com/problems/longest-common-subsequence/"),
          difficulty: "Medium",
          description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
        },
        {
          platform: "LeetCode",
          title: "Uncrossed Lines (LC 1035)",
          url: cleanUrl("https://leetcode.com/problems/uncrossed-lines/"),
          difficulty: "Medium",
          description: "Find the maximum number of non-intersecting connecting lines between two arrays (identical to LCS!).",
        },
        {
          platform: "GeeksforGeeks",
          title: "Longest Common Subsequence",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1"),
          difficulty: "Medium",
          description: "Find the length of the longest common subsequence in two given strings.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given two strings \`s1\` (length \`N\`) and \`s2\` (length \`M\`), find the length of the **Longest Common Subsequence (LCS)**—the longest sequence of characters that appears in the same relative left-to-right order in both strings (not necessarily contiguous).

### 💡 Key Takeaways
- **The Match vs. Not-Match Recurrence (\`f(i, j)\`):**
  - Maintain index \`i\` in \`s1\` and index \`j\` in \`s2\`.
  - **Base Case (\`i < 0 || j < 0\`):** An empty prefix has \`0\` common characters → \`return 0\`.
  - **1. Characters Match (\`s1[i] == s2[j]\`):**
    - Both characters match! Count \`1\` and move **both** indices back:
      **\`return 1 + f(i - 1, j - 1)\`**.
  - **2. Characters Do NOT Match (\`s1[i] != s2[j]\`):**
    - Try shrinking \`s1\` (\`f(i - 1, j)\`) OR shrinking \`s2\` (\`f(i, j - 1)\`), and take the best of both:
      **\`return max(f(i - 1, j), f(i, j - 1))\`**.
- **The Right-Shifting Index Trick (\`1\`-Based Indexing for Tabulation):**
  - In recursion, base cases happen at \`i == -1\` or \`j == -1\`, which cannot be indexed in a C++ array \`dp[-1]\`.
  - **The Fix:** Shift all indices right by \`+1\` so index \`i\` in \`dp[N + 1][M + 1]\` represents character **\`s1[i - 1]\`**! Now the base case is cleanly **\`i == 0 || j == 0\` (\`dp[i][0] = 0\`, \`dp[0][j] = 0\`)**!
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Space.

### 💻 Longest Common Subsequence (Space Optimized) Blueprint
~~~cpp
int longestCommonSubsequence(string s1, string s2) {
    int n = s1.size(), m = s2.size();
    vector<int> prev(m + 1, 0), cur(m + 1, 0);

    // Base case: row 0 (prev[j] = 0) and col 0 (cur[0] = 0) are already 0
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            // Shifted index: i corresponds to s1[i - 1], j corresponds to s2[j - 1]
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
~~~

### ⚠️ Common Mistakes to Avoid
- **Comparing \`s1[i] == s2[j]\` Instead of \`s1[i - 1] == s2[j - 1]\` in Shifted Tabulation:** When looping \`i\` from \`1\` to \`n\` and \`j\` from \`1\` to \`m\`, always compare **\`s1[i - 1] == s2[j - 1]\`** so you don't skip index \`0\` and read \`s1[n]\` out of bounds!`),
      theorySummary: cleanText(`LCS transitions evaluate: match -> 1 + f(i - 1, j - 1) and mismatch -> max(f(i - 1, j), f(i, j - 1)). Shifting indices by +1 enables elegant 1-based tabulation with row-space optimization.`),
    },

    // -------------------------------------------------------------------------
    // Topic 207
    // -------------------------------------------------------------------------
    {
      order: 207,
      name: "2D DP Table Backtracking: Print Longest Common Subsequence",
      slug: "dsa-print-longest-common-subsequence",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Backtrack through the completed 2D LCS dynamic programming table to reconstruct and output the actual longest common subsequence string.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 207: Print Longest Common Subsequence (DP 26)",
          url: cleanUrl("https://www.youtube.com/watch?v=-zI4mrF2Pb4"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Print Longest Common Subsequence",
          url: "https://takeuforward.org/data-structure/print-longest-common-subsequence-dp-26/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Print all LCS sequences",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/print-all-lcs-sequences3413/1"),
          difficulty: "Hard",
          description: "Reconstruct the Longest Common Subsequence string(s) from the 2D LCS tabulation table.",
        },
        {
          platform: "LeetCode",
          title: "Shortest Common Supersequence (LC 1092)",
          url: cleanUrl("https://leetcode.com/problems/shortest-common-supersequence/"),
          difficulty: "Hard",
          description: "Use the exact same 2D LCS table backtracking from (n, m) to (0, 0) to build the Shortest Common Supersequence.",
        },
        {
          platform: "AtCoder",
          title: "LCS (DP Contest F)",
          url: cleanUrl("https://atcoder.jp/contests/dp/tasks/dp_f"),
          difficulty: "Medium",
          description: "Find and print any one Longest Common Subsequence of strings s and t.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given two strings \`s1\` and \`s2\`, reconstruct and **return the actual Longest Common Subsequence string** (not just its length!).

### 💡 Key Takeaways
- **How to Backtrack the 2D \`dp[n + 1][m + 1]\` Table:**
  1. First, build the full 2D LCS table \`dp[n + 1][m + 1]\`. The length of the LCS is \`len = dp[n][m]\`.
  2. Pre-allocate a result string \`ans\` of size \`len\` filled with dummy characters (\`'$'\`), and set \`index = len - 1\` (filling from back to front in \`O(1)\` without string reversal!).
  3. Start at the bottom-right cell **\`i = n, j = m\`**, and loop **\`while (i > 0 && j > 0)\`**:
     - **If \`s1[i - 1] == s2[j - 1]\`:** Where did \`dp[i][j]\` come from? It came diagonally from \`(i - 1, j - 1)\`! Place \`ans[index--] = s1[i - 1]\`, and move diagonally: **\`i--, j--\`**.
     - **Else if \`dp[i - 1][j] > dp[i][j - 1]\`:** Move Up: **\`i--\`**.
     - **Else:** Move Left: **\`j--\`**.
- **Complexity:** \`O(N * M)\` Time (to build table + \`O(N + M)\` to backtrack) and \`O(N * M)\` Space.

### 💻 Print Longest Common Subsequence Blueprint
~~~cpp
string findLCSString(int n, int m, string &s1, string &s2) {
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));

    // 1. Build the 2D LCS DP Table
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // 2. Backtrack from (n, m) to reconstruct the LCS string
    int len = dp[n][m];
    string ans(len, '$');
    int index = len - 1;
    int i = n, j = m;

    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            ans[index] = s1[i - 1];
            index--;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return ans;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Trying to Reconstruct the LCS String Using Only 1D Space-Optimized Arrays:** To trace the path from \`(n, m)\` back to \`(0, 0)\`, you need the full 2D \`dp[n + 1][m + 1]\` table in memory!`),
      theorySummary: cleanText(`To print the LCS, backtrack the completed 2D table from (n, m) to (0, 0): if s1[i - 1] == s2[j - 1], prepend the character and move diagonally; otherwise follow the larger adjacent cell.`),
    },

    // -------------------------------------------------------------------------
    // Topic 208
    // -------------------------------------------------------------------------
    {
      order: 208,
      name: "Contiguous Match Reset: Longest Common Substring",
      slug: "dsa-longest-common-substring-dp-on-strings",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Find the longest contiguous common substring by maintaining match streaks and resetting cells to zero upon character mismatches.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 208: Longest Common Substring (DP 27)",
          url: cleanUrl("https://www.youtube.com/watch?v=_wP9mWNPL5w"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Common Substring",
          url: "https://takeuforward.org/data-structure/longest-common-substring-dp-27/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Longest Common Substring",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/longest-common-substring1452/1"),
          difficulty: "Medium",
          description: "Given two strings S1 and S2, find the length of the longest common contiguous substring.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Length of Repeated Subarray (LC 718)",
          url: cleanUrl("https://leetcode.com/problems/maximum-length-of-repeated-subarray/"),
          difficulty: "Medium",
          description: "Return the maximum length of a contiguous subarray that appears in both integer arrays (identical to Longest Common Substring).",
        },
        {
          platform: "LeetCode",
          title: "Longest Palindromic Substring (LC 5)",
          url: cleanUrl("https://leetcode.com/problems/longest-palindromic-substring/"),
          difficulty: "Medium",
          description: "Explore contiguous substring matching constraints.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Unlike a *subsequence*, a **Substring** must be **contiguous** (consecutive characters with zero gaps). Given two strings \`s1\` and \`s2\`, find the length of their **Longest Common Substring**.

### 💡 Key Takeaways
- **The 1-Line Modification From LCS (\`Reset to 0 on Mismatch!\`):**
  - In LCS, when \`s1[i - 1] != s2[j - 1]\`, we carried over previous matches via \`max(dp[i - 1][j], dp[i][j - 1])\`.
  - In **Longest Common Substring**, characters must be consecutive! So what does \`dp[i][j]\` represent?
    - \`dp[i][j]\` = length of the common substring **ending at index \`i - 1\` in \`s1\` and index \`j - 1\` in \`s2\`**.
    - **If \`s1[i - 1] == s2[j - 1]\`:** Extend the consecutive streak from \`(i - 1, j - 1)\`:
      **\`dp[i][j] = 1 + dp[i - 1][j - 1]\`**, and update **\`ans = max(ans, dp[i][j])\`**!
    - **Else (\`s1[i - 1] != s2[j - 1]\`):** The contiguous streak is broken! Reset **\`dp[i][j] = 0\`**!
- **Why the Answer Is the Global Max Across the Whole Table (Not \`dp[n][m]\`):**
  - The longest common substring can end anywhere in the middle of \`s1\` and \`s2\`, so we track \`ans = max(ans, cur[j])\` across every cell \`(i, j)\`!
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Space.

### 💻 Longest Common Substring (Space Optimized) Blueprint
~~~cpp
int longestCommonSubstring(string &s1, string &s2) {
    int n = s1.size(), m = s2.size();
    vector<int> prev(m + 1, 0), cur(m + 1, 0);
    int ans = 0;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                cur[j] = 1 + prev[j - 1];
                ans = max(ans, cur[j]); // Track global maximum across all cells!
            } else {
                cur[j] = 0; // Contiguity broken -> reset to 0!
            }
        }
        prev = cur;
    }
    return ans;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Returning \`prev[m]\` (\`dp[n][m]\`) Instead of \`ans\`:** \`dp[n][m]\` only gives the length of the common suffix ending at the very last characters of \`s1\` and \`s2\`. Always return the running maximum \`ans\`!`),
      theorySummary: cleanText(`Contiguous substring matching requires dp[i][j] = 1 + dp[i - 1][j - 1] on match, but resets dp[i][j] = 0 on mismatch. The global maximum across all cells yields the longest substring.`),
    },

    // -------------------------------------------------------------------------
    // Topic 209
    // -------------------------------------------------------------------------
    {
      order: 209,
      name: "Reverse-String LCS Reduction: Longest Palindromic Subsequence (LPS)",
      slug: "dsa-longest-palindromic-subsequence",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Find the longest palindromic subsequence by reducing LPS(s) directly to LCS(s, reverse(s)) in O(N^2) time and O(N) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 209: Longest Palindromic Subsequence (DP 28)",
          url: cleanUrl("https://www.youtube.com/watch?v=6i_T5kkfv4A"),
          duration: "15m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Palindromic Subsequence",
          url: "https://takeuforward.org/data-structure/longest-palindromic-subsequence-dp-28/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Longest Palindromic Subsequence (LC 516)",
          url: cleanUrl("https://leetcode.com/problems/longest-palindromic-subsequence/"),
          difficulty: "Medium",
          description: "Given a string s, find the longest palindromic subsequence's length in s.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Longest Palindromic Subsequence",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/longest-palindromic-subsequence-1612327878/1"),
          difficulty: "Medium",
          description: "Find the length of the longest palindromic subsequence of a given string.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Insertion Steps to Make a String Palindrome (LC 1312)",
          url: cleanUrl("https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/"),
          difficulty: "Hard",
          description: "Use the Longest Palindromic Subsequence length to compute minimum palindrome insertions.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\`, find the length of its **Longest Palindromic Subsequence (LPS)**—the longest subsequence of \`s\` that reads the exact same forward and backward.

### 💡 Key Takeaways
- **The Reverse-String Insight (\`LPS(s) == LCS(s, reverse(s))\`):**
  - What is a palindrome? A sequence that reads the same from left-to-right (in \`s\`) as it does from right-to-left (which is left-to-right in **\`t = reverse(s)\`**!).
  - Therefore, any subsequence that is common to both \`s\` and \`reverse(s)\` is a palindromic subsequence, and the **Longest Palindromic Subsequence of \`s\` is simply the Longest Common Subsequence of \`s\` and \`reverse(s)\`**!
- **Complexity:** \`O(N²)\` Time and \`O(N)\` Space.

### 💻 Longest Palindromic Subsequence Blueprint
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

int longestPalindromeSubseq(string s) {
    string t = s;
    reverse(t.begin(), t.end());
    return longestCommonSubsequence(s, t);
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Confusing Longest Palindromic Subsequence With Longest Palindromic Substring:** \`LCS(s, reverse(s))\` works 100% for **Subsequence**, but does *not* work unconditionally for *Substring* (because a non-palindromic substring can appear reversed elsewhere in \`s\`). For Palindromic **Subsequence**, \`LCS(s, reverse(s))\` is always exact!`),
      theorySummary: cleanText(`Because a palindrome reads identically forward and backward, the longest palindromic subsequence of string s equals the longest common subsequence of s and reverse(s).`),
    },

    // -------------------------------------------------------------------------
    // Topic 210
    // -------------------------------------------------------------------------
    {
      order: 210,
      name: "Palindromic Core Preservation: Minimum Insertions to Make a String Palindrome",
      slug: "dsa-minimum-insertions-to-make-string-palindrome",
      subtrack: "Module 31: Dynamic Programming on Strings: LCS, Substrings & Palindromic Subsequences",
      description: "Minimize character insertions or deletions to form a palindrome by keeping the Longest Palindromic Subsequence intact via N - LPS(s).",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 210: Minimum Insertions to Make String Palindrome (DP 29)",
          url: cleanUrl("https://www.youtube.com/watch?v=xPBLEj41rFU"),
          duration: "15m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Insertions to Make String Palindrome",
          url: "https://takeuforward.org/data-structure/minimum-insertions-to-make-string-palindrome-dp-29/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimum Insertion Steps to Make a String Palindrome (LC 1312)",
          url: cleanUrl("https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/"),
          difficulty: "Hard",
          description: "Return the minimum number of character insertions needed to make string s a palindrome.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Form a palindrome",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/form-a-palindrome1455/1"),
          difficulty: "Medium",
          description: "Find the minimum number of insertions required to convert a given string into a palindrome.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Minimum Deletions",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-deletions1648/1"),
          difficulty: "Medium",
          description: "Find the minimum number of deletions required to make a string palindrome (uses the exact same N - LPS(s) formula!).",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\` of length \`N\`, you can insert any character at any position in \`s\`. Find the **minimum number of insertions** needed to make \`s\` a palindrome.

### 💡 Key Takeaways
- **Maximum Possible Operations:**
  - You can always make any string of length \`N\` a palindrome in \`N\` insertions by concatenating \`reverse(s)\` to \`s\`!
- **How to Minimize Insertions (\`Keep the Longest Palindromic Subsequence Intact!\`):**
  - To insert as **few** characters as possible, we should keep the **longest already-palindromic portion** of \`s\` untouched, and only insert mirror copies for the remaining characters that don't match!
  - What is the longest already-palindromic portion of \`s\`? The **Longest Palindromic Subsequence (\`LPS(s)\`)**!
  - Every character **not** in \`LPS(s)\` needs exactly \`1\` matching character inserted on the opposite side.
  - Therefore:
    **\`Minimum Insertions = N - LPS(s)\`**!
  - *(Bonus Note: The **Minimum Deletions** to make a string palindrome is also \`N - LPS(s)\`!)*
- **Complexity:** \`O(N²)\` Time and \`O(N)\` Space.

### 💻 Minimum Insertions to Make String Palindrome Blueprint
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

int minInsertions(string s) {
    string t = s;
    reverse(t.begin(), t.end());
    int lpsLength = longestCommonSubsequence(s, t);
    return s.size() - lpsLength;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Writing a Separate Interval DP From Scratch When \`s.size() - LPS(s)\` Solves Both Insertions and Deletions:** Recognizing that \`minInsertions(s) == minDeletions(s) == s.size() - LCS(s, reverse(s))\` lets you reuse your space-optimized LCS code directly in interviews!`),
      theorySummary: cleanText(`Preserving the longest palindromic subsequence (LPS) requires adding mirror characters only for the non-palindromic characters, yielding minimum insertions = n - LPS(s) in O(N^2) time.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 21 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch21Topics) {
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
        topic.name,
        topic.slug,
        topic.subtrack,
        topic.description,
        topic.summaryMarkdown,
        topic.theorySummary,
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

  // 5. Update track_topics: Link Batch 21 Topics to topic_order 201 through 210
  console.log("\n🔄 Linking Batch 21 topics to 'problem-solving-dsa-sql' (orders 201..210)...");

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

  // Link Batch 21 Topics (orders 201..210)
  for (const topicDef of batch21Topics) {
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

  console.log("\n🎉 DSA Batch 21 (Lectures 201–210) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch21()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch21;
