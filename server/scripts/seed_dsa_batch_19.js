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

const seedDsaBatch19 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 19 (Lectures 181–190) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 19 Topics (Lectures 181–190)
  const batch19Topics = [
    // =========================================================================
    // SUBTRACK: Module 27: Strongly Connected Components (Kosaraju's) & Tarjan's Bridge Detection (Topic 181)
    // =========================================================================
    {
      order: 181,
      name: "Cut-Vertex Discovery: Articulation Points in a Graph Using Tarjan's DFS Timestamps",
      slug: "dsa-articulation-point-in-graph-tarjans-algorithm",
      subtrack: "Module 27: Strongly Connected Components (Kosaraju's) & Tarjan's Bridge Detection",
      description: "Detect articulation points whose removal disconnects the graph using DFS discovery times, non-root condition low[it] >= tin[node], and root child counting.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 181: Articulation Point in Graph (Tarjan's Algorithm)",
          url: cleanUrl("https://www.youtube.com/watch?v=j1QDfU21iZk"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Articulation Point in Graph",
          url: "https://takeuforward.org/data-structure/articulation-point-in-graph-g-56/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Articulation Point - I",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/articulation-point-1/1"),
          difficulty: "Hard",
          description: "Find all articulation points (cut vertices) in an undirected connected graph in sorted order.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Number of Days to Disconnect Island (LC 1568)",
          url: cleanUrl("https://leetcode.com/problems/minimum-number-of-days-to-disconnect-island/"),
          difficulty: "Hard",
          description: "Check if an island grid contains an articulation point to disconnect it in 1 day instead of 2.",
        },
        {
          platform: "LeetCode",
          title: "Critical Connections in a Network (LC 1192)",
          url: cleanUrl("https://leetcode.com/problems/critical-connections-in-a-network/"),
          difficulty: "Hard",
          description: "Contrast Tarjan's strict inequality for bridges (low[it] > tin[node]) with articulation points (low[it] >= tin[node]).",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
An **Articulation Point (Cut Vertex)** in an undirected graph is any vertex whose removal (along with all its incident edges) **increases the number of connected components** in the graph.

### 💡 Key Takeaways
- **Crucial Differences From Bridges (\`low[it] >= tin[node]\`):**
  1. **Condition Change (\`>=\` instead of \`>\`):**
     - In Bridges, if a child \`it\` could reach \`node\` itself (\`low[it] == tin[node]\`), removing edge \`(node, it)\` didn't disconnect \`it\`.
     - For **Articulation Points**, we are removing \`node\` itself! So if child \`it\` can only reach as high as \`node\` (\`low[it] == tin[node]\`) and **cannot** reach an ancestor strictly before \`node\` (\`< tin[node]\`), removing \`node\` still disconnects \`it\`!
     - Thus, for any non-root vertex (\`parent != -1\`), \`node\` is an articulation point if **\`low[it] >= tin[node]\`**!
  2. **Visited Back-Edge Update (\`tin[it]\` instead of \`low[it]\`):**
     - When \`it\` is already visited (\`vis[it] == 1\`), update **\`low[node] = min(low[node], tin[it])\`**. Why \`tin[it]\` instead of \`low[it]\`? Because if \`it\` is an articulation point itself, we cannot pass through \`it\` to reach even higher ancestors if \`it\` were removed!
  3. **Special Root Rule (\`parent == -1 && child > 1\`):**
     - The starting root node of a DFS tree has no ancestors above it, so \`low[it] >= tin[root]\` is always true. Instead, the root is an articulation point **if and only if it has more than 1 independent DFS child (\`child > 1\`)**!
- **Complexity:** \`O(V + 2E)\` Time and \`O(3V)\` Space.

### 💻 Articulation Point Blueprint
~~~cpp
class Solution {
    int timer = 1;

    void dfsArticulation(int node, int parent, vector<int> &vis, int tin[], int low[],
                         vector<int> &mark, vector<int> adj[]) {
        vis[node] = 1;
        tin[node] = low[node] = timer++;
        int child = 0;

        for (int it : adj[node]) {
            if (it == parent) continue;
            if (!vis[it]) {
                dfsArticulation(it, node, vis, tin, low, mark, adj);
                low[node] = min(low[node], low[it]);

                // Non-root articulation point check
                if (low[it] >= tin[node] && parent != -1) {
                    mark[node] = 1;
                }
                child++;
            } else {
                // Back-edge to an already-visited ancestor: compare with tin[it]!
                low[node] = min(low[node], tin[it]);
            }
        }
        // Special check for the DFS root node
        if (child > 1 && parent == -1) {
            mark[node] = 1;
        }
    }

public:
    vector<int> articulationPoints(int n, vector<int> adj[]) {
        vector<int> vis(n, 0), mark(n, 0);
        int tin[n], low[n];
        for (int i = 0; i < n; i++) {
            if (!vis[i]) {
                dfsArticulation(i, -1, vis, tin, low, mark, adj);
            }
        }
        vector<int> ans;
        for (int i = 0; i < n; i++) {
            if (mark[i] == 1) ans.push_back(i);
        }
        if (ans.empty()) return {-1};
        return ans;
    }
};
~~~

### ⚠️ Common Mistakes to Avoid
- **Pushing \`node\` Directly Into \`ans\` Inside the DFS Loop:** A single vertex \`node\` can satisfy \`low[it] >= tin[node]\` for multiple child branches \`it\`. Always mark \`mark[node] = 1\` in a hash/boolean array first to avoid duplicate entries in your output!`),
      theorySummary: cleanText(`An articulation point is a vertex whose removal disconnects the graph. A non-root node is an articulation point if low[it] >= tin[node], while the DFS root is an articulation point if it has more than 1 independent DFS child.`),
    },

    // =========================================================================
    // SUBTRACK: Module 28: 1D Dynamic Programming: Recurrences, Memoization, Tabulation & Space Optimization (Topics 182–187)
    // =========================================================================
    {
      order: 182,
      name: "Overlapping Subproblems & Optimal Substructure: Introduction to Dynamic Programming (Memoization, Tabulation & Space Optimization)",
      slug: "dsa-introduction-to-dynamic-programming",
      subtrack: "Module 28: 1D Dynamic Programming: Recurrences, Memoization, Tabulation & Space Optimization",
      description: "Understand the core principles of Dynamic Programming through Fibonacci: recursion, memoization, bottom-up tabulation, and space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 182: Introduction to Dynamic Programming",
          url: cleanUrl("https://www.youtube.com/watch?v=tyB0ztf0DNY"),
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Dynamic Programming Introduction",
          url: "https://takeuforward.org/data-structure/dynamic-programming-introduction/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Fibonacci Number (LC 509)",
          url: cleanUrl("https://leetcode.com/problems/fibonacci-number/"),
          difficulty: "Easy",
          description: "Compute the N-th Fibonacci number progressing from recursion to memoization, tabulation, and O(1) space.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Introduction to DP",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/introduction-to-dp/1"),
          difficulty: "Medium",
          description: "Implement both top-down memoization and bottom-up tabulation for the N-th Fibonacci number.",
        },
        {
          platform: "LeetCode",
          title: "N-th Tribonacci Number (LC 1137)",
          url: cleanUrl("https://leetcode.com/problems/n-th-tribonacci-number/"),
          difficulty: "Easy",
          description: "Extend 2-variable Fibonacci space optimization to a 3-variable state window.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
*"Those who cannot remember the past are condemned to repeat it."* **Dynamic Programming (DP)** optimizes recursive problems that exhibit **Overlapping Subproblems** (solving the exact same subproblem multiple times) by storing and reusing subproblem results instead of recomputing them!

### 💡 The 4-Stage DP Progression (Using Fibonacci \`f(n) = f(n-1) + f(n-2)\`)
1. **Stage 1: Pure Recursion (\`O(2^N)\` Time, \`O(N)\` Stack Space):**
   - Directly calls \`f(n - 1) + f(n - 2)\`, recomputing subtrees like \`f(2)\` and \`f(3)\` exponentially many times.
2. **Stage 2: Top-Down Memoization (\`O(N)\` Time, \`O(N)\` Stack + \`O(N)\` Array Space):**
   - Start from the required answer \`n\` and recurse down toward the base cases.
   - Create \`vector<int> dp(n + 1, -1)\`. Before computing \`f(n)\`, check **\`if (dp[n] != -1) return dp[n];\`**, and store the result **\`return dp[n] = f(n - 1, dp) + f(n - 2, dp);\`**!
3. **Stage 3: Bottom-Up Tabulation (\`O(N)\` Time, \`O(N)\` Array Space — Zero Recursion Stack):**
   - Start from the base cases (\`dp[0] = 0, dp[1] = 1\`) and iterate \`i\` from \`2\` to \`n\`: \`dp[i] = dp[i - 1] + dp[i - 2]\`.
4. **Stage 4: Space Optimization (\`O(N)\` Time, \`O(1)\` Space):**
   - Since \`dp[i]\` only depends on the **previous two values** (\`dp[i - 1]\` and \`dp[i - 2]\`), replace the entire \`dp[]\` array with two variables **\`prev\` and \`prev2\`**!

### 💻 All 3 DP Techniques Blueprint (Fibonacci)
~~~cpp
// 1. Top-Down Memoization: O(N) Time, O(2N) Space
int fibMemo(int n, vector<int> &dp) {
    if (n <= 1) return n;
    if (dp[n] != -1) return dp[n];
    return dp[n] = fibMemo(n - 1, dp) + fibMemo(n - 2, dp);
}

// 2. Bottom-Up Tabulation: O(N) Time, O(N) Space
int fibTabulation(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1, 0);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// 3. Space Optimization: O(N) Time, O(1) Space
int fibSpaceOptimized(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev = 1;
    for (int i = 2; i <= n; i++) {
        int curi = prev + prev2;
        prev2 = prev;
        prev = curi;
    }
    return prev;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Allocating \`dp(n)\` Instead of \`dp(n + 1)\`:** If you need to store answers for indices \`0\` through \`n\` inclusive, your DP table must have size **\`n + 1\`**, not \`n\`!`),
      theorySummary: cleanText(`Dynamic Programming eliminates exponential recomputation by caching solutions to overlapping subproblems. The standard progression moves from recursion to memoization, tabulation, and O(1) space optimization.`),
    },

    // -------------------------------------------------------------------------
    // Topic 183
    // -------------------------------------------------------------------------
    {
      order: 183,
      name: "How to Write 1D Recurrence Relations: Climbing Stairs",
      slug: "dsa-climbing-stairs-1d-recurrence-relations",
      subtrack: "Module 28: 1D Dynamic Programming: Recurrences, Memoization, Tabulation & Space Optimization",
      description: "Formulate 1D dynamic programming recurrence relations using Striver's 3-step blueprint and solve Climbing Stairs in O(1) auxiliary space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 183: Climbing Stairs (1D DP)",
          url: cleanUrl("https://www.youtube.com/watch?v=mLfjzJsN8us"),
          duration: "15m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Climbing Stairs",
          url: "https://takeuforward.org/data-structure/dynamic-programming-climbing-stairs/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Climbing Stairs (LC 70)",
          url: cleanUrl("https://leetcode.com/problems/climbing-stairs/"),
          difficulty: "Easy",
          description: "Find the number of distinct ways to climb to the top of n stairs taking 1 or 2 steps at a time.",
        },
        {
          platform: "LeetCode",
          title: "Min Cost Climbing Stairs (LC 746)",
          url: cleanUrl("https://leetcode.com/problems/min-cost-climbing-stairs/"),
          difficulty: "Easy",
          description: "Find the minimum cost to reach the top of the floor starting from step 0 or step 1.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count ways to reach the n'th stair",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/count-ways-to-reach-the-nth-stair-1587115620/1"),
          difficulty: "Medium",
          description: "Count distinct ways to reach the N-th stair using 1 or 2 steps.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are standing at the \`0\`-th stair and want to reach the \`n\`-th stair. Each time you can climb either **\`1\` step or \`2\` steps**. In how many distinct ways can you climb to the top?

### 💡 Striver's 3-Step Shortcut to Write Any 1D Recurrence Relation
Whenever you face a DP problem, follow these 3 universal rules to write the recurrence first:
1. **Represent the problem in terms of an index \`ind\`** (here, \`ind\` is the current stair \`0 .. n\`).
2. **Do all possible stuffs on that index** according to the problem statement (jump \`1\` step to \`ind - 1\`, or jump \`2\` steps to \`ind - 2\`).
3. **Aggregate the results:**
   - If the problem asks to **"Count all ways"** → **Sum up** all stuffs (\`left + right\`).
   - If the problem asks for **"Minimum / Maximum"** → Take **\`min(left, right)\` or \`max(left, right)\`**!
- **Base Cases for Climbing Stairs:**
  - \`ind == 0\`: \`1\` way (we are already at stair 0).
  - \`ind == 1\`: \`1\` way (only a single 1-step jump from 0 to 1 is valid).
  - Recurrence: **\`f(ind) = f(ind - 1) + f(ind - 2)\`** (identical to Fibonacci with \`f(0) = 1, f(1) = 1\`!).

### 💻 Climbing Stairs (O(1) Space Optimized) Blueprint
~~~cpp
int climbStairs(int n) {
    if (n <= 1) return 1;
    int prev2 = 1; // Base case: 0-th stair = 1 way
    int prev = 1;  // Base case: 1-st stair = 1 way

    for (int i = 2; i <= n; i++) {
        int curi = prev + prev2;
        prev2 = prev;
        prev = curi;
    }
    return prev;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Setting \`dp[0] = 0\` Like Standard Fibonacci:** In Climbing Stairs, reaching stair \`0\` from stair \`2\` via a 2-step jump is a valid completed path! Therefore \`dp[0]\` must be **\`1\`**, not \`0\`.`),
      theorySummary: cleanText(`To write 1D recurrences: (1) represent subproblems via an index ind, (2) execute all allowed transitions, and (3) aggregate via summation for counting ways or min/max for optimization.`),
    },

    // -------------------------------------------------------------------------
    // Topic 184
    // -------------------------------------------------------------------------
    {
      order: 184,
      name: "Minimum-Cost State Transitions: Frog Jump (1D DP)",
      slug: "dsa-frog-jump-1d-dynamic-programming",
      subtrack: "Module 28: 1D Dynamic Programming: Recurrences, Memoization, Tabulation & Space Optimization",
      description: "Compute the minimum energy required to reach the N-th stair allowing 1-step and 2-step jumps using 1D DP with O(1) space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 184: Frog Jump (1D DP)",
          url: cleanUrl("https://www.youtube.com/watch?v=EgG3jsGoPvQ"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Frog Jump (DP 3)",
          url: "https://takeuforward.org/data-structure/dynamic-programming-frog-jump-dp-3/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Geek Jump (Frog Jump)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/geek-jump/1"),
          difficulty: "Easy",
          description: "Find the minimum total energy used by Geek to jump from stair 0 to stair N - 1 taking 1 or 2 steps.",
        },
        {
          platform: "LeetCode",
          title: "Min Cost Climbing Stairs (LC 746)",
          url: cleanUrl("https://leetcode.com/problems/min-cost-climbing-stairs/"),
          difficulty: "Easy",
          description: "Compute the minimum cost to reach the top of a staircase with per-step costs.",
        },
        {
          platform: "AtCoder",
          title: "Frog 1 (DP Contest A)",
          url: cleanUrl("https://atcoder.jp/contests/dp/tasks/dp_a"),
          difficulty: "Easy",
          description: "Find the minimum possible total cost incurred before the frog reaches Stone N.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A frog wants to climb from stair \`0\` to stair \`N - 1\`. In one jump, it can jump to \`i + 1\` or \`i + 2\`. The energy lost in a jump from \`i\` to \`j\` is **\`abs(heights[i] - heights[j])\`**. Find the **minimum total energy** required to reach stair \`N - 1\`.

### 💡 Key Takeaways
- **Why Greedy Fails Here:**
  - Taking the locally smaller jump from stair \`0\` might trap the frog on a stone that forces a massive height jump on the next step! We must try **all possible paths** using DP.
- **1D Recurrence Relation (\`f(ind)\` = min energy to reach \`ind\` from \`0\`):**
  - Base case: \`f(0) = 0\` (cost to stand at \`0\` is \`0\`).
  - \`jumpOne = f(ind - 1) + abs(heights[ind] - heights[ind - 1])\`
  - \`jumpTwo = INT_MAX\`
  - If \`ind > 1\`: \`jumpTwo = f(ind - 2) + abs(heights[ind] - heights[ind - 2])\`
  - Return **\`min(jumpOne, jumpTwo)\`**.
- **Progression:** Recursion (\`O(2^N)\`) → Memoization (\`O(N)\` Time, \`O(2N)\` Space) → Tabulation (\`O(N)\` Time, \`O(N)\` Space) → Space Optimization (\`O(N)\` Time, **\`O(1)\` Space** using \`prev\` and \`prev2\`).

### 💻 Frog Jump (Memoization, Tabulation & O(1) Space) Blueprint
~~~cpp
// 1. Top-Down Memoization: O(N) Time, O(N) Space
int solveMemo(int ind, const vector<int> &heights, vector<int> &dp) {
    if (ind == 0) return 0;
    if (dp[ind] != -1) return dp[ind];

    int left = solveMemo(ind - 1, heights, dp) + abs(heights[ind] - heights[ind - 1]);
    int right = INT_MAX;
    if (ind > 1) {
        right = solveMemo(ind - 2, heights, dp) + abs(heights[ind] - heights[ind - 2]);
    }
    return dp[ind] = min(left, right);
}

// 2. Space-Optimized Bottom-Up: O(N) Time, O(1) Space
int frogJumpSpaceOptimized(int n, vector<int> &heights) {
    int prev = 0, prev2 = 0;
    for (int i = 1; i < n; i++) {
        int fs = prev + abs(heights[i] - heights[i - 1]);
        int ss = INT_MAX;
        if (i > 1) {
            ss = prev2 + abs(heights[i] - heights[i - 2]);
        }
        int curi = min(fs, ss);
        prev2 = prev;
        prev = curi;
    }
    return prev;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`if (ind > 1)\` Before Computing the 2-Step Jump:** When \`ind == 1\`, \`ind - 2\` evaluates to \`-1\` (out of bounds)! Always guard the 2-step jump with \`if (ind > 1)\` and initialize \`right = INT_MAX\`.`),
      theorySummary: cleanText(`Frog Jump evaluates min(jump1, jump2) at each stair ind, where jump costs are absolute height differences. Storing only the last two stair states achieves O(N) time and O(1) auxiliary space.`),
    },

    // -------------------------------------------------------------------------
    // Topic 185
    // -------------------------------------------------------------------------
    {
      order: 185,
      name: "Parameterized Multi-Step Transitions: Frog Jump With K Distance",
      slug: "dsa-frog-jump-with-k-distance",
      subtrack: "Module 28: 1D Dynamic Programming: Recurrences, Memoization, Tabulation & Space Optimization",
      description: "Generalize Frog Jump to allow variable step jumps from 1 up to K distance and solve in O(N * K) time.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 185: Frog Jump With K Distance (DP 4)",
          url: cleanUrl("https://www.youtube.com/watch?v=Kmh3rhyEtB8"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Frog Jump with K Distance",
          url: "https://takeuforward.org/data-structure/dynamic-programming-frog-jump-with-k-distances-dp-4/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Minimal Cost (Frog Jump with K Distance)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimal-cost/1"),
          difficulty: "Medium",
          description: "Find the minimum cost to reach stone N - 1 when the frog can jump up to K stones at a time.",
        },
        {
          platform: "AtCoder",
          title: "Frog 2 (DP Contest B)",
          url: cleanUrl("https://atcoder.jp/contests/dp/tasks/dp_b"),
          difficulty: "Easy",
          description: "Generalize Frog Jump to allow jumps of length 1, 2, ..., K.",
        },
        {
          platform: "LeetCode",
          title: "Jump Game VI (LC 1696)",
          url: cleanUrl("https://leetcode.com/problems/jump-game-vi/"),
          difficulty: "Medium",
          description: "Maximize the score of jumping at most k steps at a time from index 0 to n - 1.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Instead of jumping only \`1\` or \`2\` steps, what if the frog is allowed to jump anywhere from **\`1\` to \`K\` steps** (\`ind + 1, ind + 2, ..., ind + K\`) in a single leap? Find the minimum total energy to reach index \`N - 1\`.

### 💡 Key Takeaways
- **Replacing 2 Fixed Branches With a \`1..K\` Loop:**
  - In standard Frog Jump, we wrote two separate variables (\`jumpOne\` and \`jumpTwo\`).
  - For \`K\` jumps, initialize \`minSteps = INT_MAX\` and loop \`j\` from \`1\` to \`K\`:
    - If **\`ind - j >= 0\`**:
      - \`jump = dp[ind - j] + abs(heights[ind] - heights[ind - j])\`
      - \`minSteps = min(minSteps, jump)\`
- **Time & Space Complexity:**
  - **Time Complexity:** **\`O(N * K)\`** (for each of the \`N\` states, we run a loop of at most \`K\` transitions).
  - **Space Complexity:** **\`O(N)\`** for \`dp[N]\`. (Note: Space optimization to \`O(K)\` is possible using a sliding window/list of \`K\` elements, but in worst case \`K == N\` it remains \`O(N)\`, so standard \`O(N)\` tabulation is clean and sufficient!).

### 💻 Frog Jump With K Distance (Tabulation) Blueprint
~~~cpp
int minimizeCostKSteps(int n, int k, vector<int> &height) {
    vector<int> dp(n, 0);
    dp[0] = 0; // Base case: starting at index 0 costs 0 energy

    for (int i = 1; i < n; i++) {
        int mmSteps = INT_MAX;
        for (int j = 1; j <= k; j++) {
            if (i - j >= 0) {
                int jump = dp[i - j] + abs(height[i] - height[i - j]);
                mmSteps = min(mmSteps, jump);
            } else {
                break; // i - j is negative, so larger j values will also be negative
            }
        }
        dp[i] = mmSteps;
    }
    return dp[n - 1];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Initializing \`mmSteps\` Outside the Outer \`i\` Loop:** \`mmSteps = INT_MAX\` must be reset **inside** the \`for (int i = 1; i < n; i++)\` loop for every new stone \`i\`!`),
      theorySummary: cleanText(`Generalizing 2-step jumps to K-distance loops over all jumps 1 <= j <= K for each stone, yielding an O(N * K) time and O(N) space bottom-up solution.`),
    },

    // -------------------------------------------------------------------------
    // Topic 186
    // -------------------------------------------------------------------------
    {
      order: 186,
      name: "Pick / Non-Pick Subsequence Pattern: Maximum Sum of Non-Adjacent Elements (House Robber I)",
      slug: "dsa-maximum-sum-of-non-adjacent-elements-house-robber",
      subtrack: "Module 28: 1D Dynamic Programming: Recurrences, Memoization, Tabulation & Space Optimization",
      description: "Apply the pick/not-pick DP pattern to maximize subsequence sums without taking adjacent elements in O(N) time and O(1) space.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 186: Maximum Sum of Non-Adjacent Elements (House Robber)",
          url: cleanUrl("https://www.youtube.com/watch?v=GrMBfJNk_NY"),
          duration: "23m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Sum of Non-Adjacent Elements",
          url: "https://takeuforward.org/data-structure/maximum-sum-of-non-adjacent-elements-dp-5/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "House Robber (LC 198)",
          url: cleanUrl("https://leetcode.com/problems/house-robber/"),
          difficulty: "Medium",
          description: "Return the maximum amount of money you can rob tonight without alerting the police (no two adjacent houses).",
        },
        {
          platform: "GeeksforGeeks",
          title: "Stickler Thief (Max Sum without Adjacents)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/stickler-theif-1587115621/1"),
          difficulty: "Medium",
          description: "Find the maximum sum of a subsequence with no two adjacent elements.",
        },
        {
          platform: "LeetCode",
          title: "Delete and Earn (LC 740)",
          url: cleanUrl("https://leetcode.com/problems/delete-and-earn/"),
          difficulty: "Medium",
          description: "Bucket element sums by value to reduce the problem directly to House Robber.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`nums\` of \`N\` integers, return the **maximum sum of any subsequence** such that **no two picked elements are adjacent** in the original array.

### 💡 Key Takeaways
- **The Pick / Not-Pick Recurrence (\`f(ind)\`):**
  - At any index \`ind\`, we have two mutually exclusive choices:
    1. **Pick \`nums[ind]\`:** We gain \`nums[ind]\`, and because we **cannot** pick the adjacent element \`ind - 1\`, we must jump to **\`ind - 2\`**:
       **\`pick = nums[ind] + f(ind - 2)\`**.
    2. **Not Pick \`nums[ind]\`:** We gain \`0\`, and we are free to consider the adjacent element **\`ind - 1\`**:
       **\`notPick = 0 + f(ind - 1)\`**.
  - Return **\`max(pick, notPick)\`**.
- **Base Cases:**
  - \`ind == 0\`: Return \`nums[0]\` (if we reached \`0\`, we hadn't picked \`1\`, so picking \`nums[0]\` is always optimal).
  - \`ind < 0\`: Return \`0\` (handles \`ind - 2\` when \`ind == 1\`).
- **Space Optimization (\`O(N)\` Time, \`O(1)\` Space):**
  - Since \`dp[i]\` only requires \`dp[i - 1]\` (\`prev\`) and \`dp[i - 2]\` (\`prev2\`), we can compute the answer in **\`O(1)\` auxiliary space**!

### 💻 Maximum Non-Adjacent Sum (O(1) Space Optimized) Blueprint
~~~cpp
int maximumNonAdjacentSum(vector<int> &nums) {
    int n = nums.size();
    if (n == 0) return 0;

    int prev = nums[0]; // Represents dp[i - 1]
    int prev2 = 0;      // Represents dp[i - 2]

    for (int i = 1; i < n; i++) {
        int take = nums[i];
        if (i > 1) take += prev2;

        int notTake = 0 + prev;

        int curi = max(take, notTake);
        prev2 = prev;
        prev = curi;
    }
    return prev;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Add \`nums[i]\` When \`i == 1\`:** When \`i == 1\`, \`i - 2\` is \`-1\` (out of bounds), **but you still get \`nums[1]\` if you pick index \`1\`**! Always initialize \`int take = nums[i];\` first, and then add \`if (i > 1) take += prev2;\`.`),
      theorySummary: cleanText(`The pick/not-pick recurrence sets take = nums[i] + dp[i - 2] and notTake = dp[i - 1]. Space optimization reduces memory to O(1) using two rolling variables.`),
    },

    // -------------------------------------------------------------------------
    // Topic 187
    // -------------------------------------------------------------------------
    {
      order: 187,
      name: "Circular Array Decomposition: House Robber II (First and Last Adjacent)",
      slug: "dsa-house-robber-ii-circular-array-dp",
      subtrack: "Module 28: 1D Dynamic Programming: Recurrences, Memoization, Tabulation & Space Optimization",
      description: "Decompose circular array dependencies by running linear non-adjacent DP twice: once excluding the first element and once excluding the last element.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 187: House Robber II (Circular Array DP)",
          url: cleanUrl("https://www.youtube.com/watch?v=3WaxQMELSkw"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: House Robber II",
          url: "https://takeuforward.org/data-structure/dynamic-programming-house-robber-dp-6/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "House Robber II (LC 213)",
          url: cleanUrl("https://leetcode.com/problems/house-robber-ii/"),
          difficulty: "Medium",
          description: "All houses are arranged in a circle. Return the maximum amount of money you can rob without alerting the police.",
        },
        {
          platform: "LeetCode",
          title: "Pizza With 3n Slices (LC 1388)",
          url: cleanUrl("https://leetcode.com/problems/pizza-with-3n-slices/"),
          difficulty: "Hard",
          description: "Apply the exact circular array split (excluding first vs. excluding last) to pick n non-adjacent slices.",
        },
        {
          platform: "LeetCode",
          title: "House Robber III (LC 337)",
          url: cleanUrl("https://leetcode.com/problems/house-robber-iii/"),
          difficulty: "Medium",
          description: "Extend the non-adjacent House Robber DP pattern from arrays to binary trees.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
All \`N\` houses are arranged in a **circle**, meaning the **first house (\`0\`) and the last house (\`N - 1\`) are adjacent**! You cannot rob two adjacent houses. Find the maximum money you can rob.

### 💡 Key Takeaways
- **The Circular Exclusion Insight:**
  - Because house \`0\` and house \`N - 1\` are neighbors, **no valid answer can ever contain both house \`0\` and house \`N - 1\` simultaneously**!
  - Therefore, the optimal answer is either:
    1. The best answer when we **leave out the first house** (solving linear House Robber I on indices **\`[1 ... N - 1]\`**), OR
    2. The best answer when we **leave out the last house** (solving linear House Robber I on indices **\`[0 ... N - 2]\`**).
  - Final Answer: **\`max(solveLinear(temp1), solveLinear(temp2))\`**!
- **Single-Element Edge Case:**
  - If \`N == 1\`, both \`temp1\` and \`temp2\` would be empty—so always check **\`if (n == 1) return nums[0];\`** upfront!
- **Complexity:** \`O(N)\` Time and \`O(1)\` Auxiliary Space (when slicing via index bounds).

### 💻 House Robber II Blueprint
~~~cpp
long long solveLinear(const vector<int> &nums) {
    int n = nums.size();
    long long prev = nums[0];
    long long prev2 = 0;

    for (int i = 1; i < n; i++) {
        long long take = nums[i];
        if (i > 1) take += prev2;
        long long notTake = 0 + prev;

        long long curi = max(take, notTake);
        prev2 = prev;
        prev = curi;
    }
    return prev;
}

long long houseRobberCircular(vector<int> &valueInHouse) {
    int n = valueInHouse.size();
    if (n == 1) return valueInHouse[0];

    vector<int> withoutFirst, withoutLast;
    for (int i = 0; i < n; i++) {
        if (i != 0) withoutFirst.push_back(valueInHouse[i]);
        if (i != n - 1) withoutLast.push_back(valueInHouse[i]);
    }

    return max(solveLinear(withoutFirst), solveLinear(withoutLast));
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`if (n == 1) return valueInHouse[0];\`:** When \`n == 1\`, index \`0\` is both the first and the last element, so \`withoutFirst\` and \`withoutLast\` become empty vectors and \`nums[0]\` crashes!`),
      theorySummary: cleanText(`Circular adjacency between elements 0 and N - 1 is resolved by decomposing the problem into two linear DP runs: one on indices [1..N - 1] and one on [0..N - 2], taking the maximum of both.`),
    },

    // =========================================================================
    // SUBTRACK: Module 29: 2D Dynamic Programming on Multi-Choice States & Grids (Topics 188–190)
    // =========================================================================
    {
      order: 188,
      name: "Multi-State 2D DP Transitions: Ninja's Training (AtCoder Vacation)",
      slug: "dsa-ninjas-training-2d-dp-concepts",
      subtrack: "Module 29: 2D Dynamic Programming on Multi-Choice States & Grids",
      description: "Solve multi-choice daily scheduling under consecutive-activity constraints using a 2D DP state (day, last) in O(N) time and O(1) space.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 188: Ninja's Training (2D Dynamic Programming)",
          url: cleanUrl("https://www.youtube.com/watch?v=AE39gJYuRog"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Ninja's Training",
          url: "https://takeuforward.org/data-structure/dynamic-programming-ninjas-training-dp-7/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Geek's Training (Ninja's Training)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/geeks-training/1"),
          difficulty: "Medium",
          description: "Find the maximum merit points Geek can earn over N days without performing the same activity on two consecutive days.",
        },
        {
          platform: "AtCoder",
          title: "Vacation (DP Contest C)",
          url: cleanUrl("https://atcoder.jp/contests/dp/tasks/dp_c"),
          difficulty: "Easy",
          description: "Maximize total happiness over N days of choosing among 3 activities with no two consecutive days having the same activity.",
        },
        {
          platform: "LeetCode",
          title: "Paint House (LC 256)",
          url: cleanUrl("https://leetcode.com/problems/paint-house/"),
          difficulty: "Medium",
          description: "Minimize the cost of painting N houses using 3 colors such that no two adjacent houses have the same color.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A ninja trains for \`N\` days. Each day \`i\`, he can perform one of \`3\` activities (\`0\`, \`1\`, or \`2\`), earning \`points[i][task]\` merit points. Because he **cannot perform the same activity on two consecutive days**, we need a **2D DP state \`(day, last)\`**, where \`last\` (\`0, 1, 2\`, or \`3\` for "none chosen yet" on the starting call) tracks the activity performed on \`day + 1\`.

### 💡 Key Takeaways
- **Why 1D DP Is Not Enough:**
  - Knowing only the \`day\` index doesn't tell us which activity is forbidden today! We must carry a second state parameter **\`last\`** (\`0..3\`), creating an **\`N x 4\` DP table**.
- **2D Recurrence & Base Case:**
  - **Base Case (\`day == 0\`):** Return the maximum of \`points[0][task]\` across all \`task\` in \`{0, 1, 2}\` where \`task != last\`.
  - **Transition (\`day > 0\`):** Loop \`task\` from \`0\` to \`2\`: if \`task != last\`, compute \`points[day][task] + f(day - 1, task)\` and take the maximum!
- **Space Optimization (\`O(N * 4)\` Time, \`O(4) = O(1)\` Space):**
  - Since \`dp[day][last]\` only depends on the previous row \`dp[day - 1][...]\`, replace the \`N x 4\` matrix with a single 4-element vector \`prev(4, 0)\`!

### 💻 Ninja's Training (Space-Optimized 2D DP) Blueprint
~~~cpp
int ninjaTraining(int n, vector<vector<int>> &points) {
    vector<int> prev(4, 0);

    // Base cases for Day 0 for each possible 'last' value (0, 1, 2, or 3)
    prev[0] = max(points[0][1], points[0][2]);
    prev[1] = max(points[0][0], points[0][2]);
    prev[2] = max(points[0][0], points[0][1]);
    prev[3] = max({points[0][0], points[0][1], points[0][2]});

    for (int day = 1; day < n; day++) {
        vector<int> temp(4, 0);
        for (int last = 0; last < 4; last++) {
            temp[last] = 0;
            for (int task = 0; task < 3; task++) {
                if (task != last) {
                    int point = points[day][task] + prev[task];
                    temp[last] = max(temp[last], point);
                }
            }
        }
        prev = temp;
    }
    return prev[3];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Allocating \`dp[N][3]\` Instead of \`dp[N][4]\`:** On the very first day (\`N - 1\`), **no activity has been performed yet**, so all 3 tasks (\`0, 1, 2\`) are allowed! Representing "no previous task" requires index **\`3\`**, which means the second dimension must have size **\`4\`**!`),
      theorySummary: cleanText(`Multi-choice constraints require a 2D state (day, lastTask). Bottom-up tabulation updates state transitions across allowed choices and compresses memory to a 4-element array.`),
    },

    // -------------------------------------------------------------------------
    // Topic 189
    // -------------------------------------------------------------------------
    {
      order: 189,
      name: "2D Grid Combinatorial DP: Grid Unique Paths (Recursion, Memoization, Tabulation & Space Optimization)",
      slug: "dsa-grid-unique-paths-dp-on-grids",
      subtrack: "Module 29: 2D Dynamic Programming on Multi-Choice States & Grids",
      description: "Count all unique paths in an M x N grid moving only right and down, progressing from 2D recursion to O(N) space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 189: Grid Unique Paths (DP on Grids)",
          url: cleanUrl("https://www.youtube.com/watch?v=sdE0A2Oxofw"),
          duration: "21m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Grid Unique Paths",
          url: "https://takeuforward.org/data-structure/grid-unique-paths-dp-on-grids-dp8/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Unique Paths (LC 62)",
          url: cleanUrl("https://leetcode.com/problems/unique-paths/"),
          difficulty: "Medium",
          description: "Return the number of possible unique paths that the robot can take to reach the bottom-right corner of an m x n grid.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number of Unique Paths",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-unique-paths5339/1"),
          difficulty: "Easy",
          description: "Find the total number of unique paths from top-left to bottom-right moving only right and down.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Path Sum (LC 64)",
          url: cleanUrl("https://leetcode.com/problems/minimum-path-sum/"),
          difficulty: "Medium",
          description: "Adapt the 2D grid recurrence from counting paths to minimizing path sum.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`M x N\` grid, a robot starts at top-left \`(0, 0)\` and wants to reach bottom-right \`(M - 1, N - 1)\`, moving only **Right** or **Down**. Count the total number of **Unique Paths**.

### 💡 Key Takeaways
- **Top-Down Recurrence (\`f(i, j)\` = ways from \`(0, 0)\` to \`(i, j)\`):**
  - Moving backward from \`(M - 1, N - 1)\` to \`(0, 0)\`: we can move **Up** \`(i - 1, j)\` or **Left** \`(i, j - 1)\`.
  - **Base Cases:**
    - \`if (i == 0 && j == 0) return 1;\` (reached the start!).
    - \`if (i < 0 || j < 0) return 0;\` (stepped out of grid bounds!).
  - **Transition:** **\`f(i, j) = f(i - 1, j) + f(i, j - 1)\`**.
- **Row-Level Space Optimization (\`O(M * N)\` Time, \`O(N)\` Space):**
  - Whenever a 2D DP transition only uses **\`dp[i - 1][j]\` (previous row)** and **\`dp[i][j - 1]\` (current row)**, you only need a single 1D array \`prev(N, 0)\` for the previous row and \`cur(N, 0)\` for the current row!

### 💻 Grid Unique Paths (Tabulation & 1D Space Optimized) Blueprint
~~~cpp
int uniquePaths(int m, int n) {
    vector<int> prev(n, 0);

    for (int i = 0; i < m; i++) {
        vector<int> cur(n, 0);
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) {
                cur[j] = 1; // Base case: starting cell
            } else {
                int up = (i > 0) ? prev[j] : 0;
                int left = (j > 0) ? cur[j - 1] : 0;
                cur[j] = up + left;
            }
        }
        prev = cur;
    }
    return prev[n - 1];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Overwriting the Base Case \`cur[0] = 1\` on Row \`0\`:** Inside the nested tabulation loop, when \`i == 0 && j == 0\`, set \`cur[0] = 1\` and use an **\`else\`** branch so \`up + left\` (\`0 + 0 = 0\`) does not overwrite \`cur[0]\` back to \`0\`!`),
      theorySummary: cleanText(`In grid DP moving right and down, ways to cell (i, j) equal ways(i - 1, j) + ways(i, j - 1). Because transitions depend only on the previous and current rows, memory can be reduced to O(N).`),
    },

    // -------------------------------------------------------------------------
    // Topic 190
    // -------------------------------------------------------------------------
    {
      order: 190,
      name: "Blocked-State Pruning in Grid DP: Unique Paths II (Maze With Obstacles)",
      slug: "dsa-unique-paths-ii-grid-with-obstacles",
      subtrack: "Module 29: 2D Dynamic Programming on Multi-Choice States & Grids",
      description: "Count unique grid paths in the presence of obstacles by pruning blocked cells to zero and applying 1D space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 190: Unique Paths II (Maze With Obstacles)",
          url: cleanUrl("https://www.youtube.com/watch?v=TmhpgXScLyY"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Unique Paths II",
          url: "https://takeuforward.org/data-structure/grid-unique-paths-2-dp-9/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Unique Paths II (LC 63)",
          url: cleanUrl("https://leetcode.com/problems/unique-paths-ii/"),
          difficulty: "Medium",
          description: "Return the number of unique paths from top-left to bottom-right in an m x n grid containing obstacles.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Grid Path 2",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/grid-path-2/1"),
          difficulty: "Medium",
          description: "Count unique paths in a grid with obstacles modulo 10^9 + 7.",
        },
        {
          platform: "LeetCode",
          title: "Unique Paths III (LC 980)",
          url: cleanUrl("https://leetcode.com/problems/unique-paths-iii/"),
          difficulty: "Hard",
          description: "Explore grid paths with obstacles when every non-obstacle square must be visited exactly once.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`M x N\` \`obstacleGrid\` where \`0\` is an open space and \`1\` (or \`-1\`) is a blocked obstacle, count the number of unique paths from \`(0, 0)\` to \`(M - 1, N - 1)\` moving only Right or Down.

### 💡 Key Takeaways
- **The 1-Line Obstacle Base Case Addition:**
  - This problem is 99% identical to **Grid Unique Paths I**, with **one extra base case at the very top**:
    - If \`(i >= 0 && j >= 0 && obstacleGrid[i][j] == 1)\` → **Return \`0\`** (\`cur[j] = 0\`)!
  - Why check the obstacle condition **before** \`if (i == 0 && j == 0) return 1;\`?
    - Because if the starting cell \`(0, 0)\` itself has an obstacle (\`obstacleGrid[0][0] == 1\`), there are **\`0\` ways** to start! Checking the obstacle condition first handles a blocked \`(0, 0)\` automatically.
- **Complexity:** \`O(M * N)\` Time and \`O(N)\` Space.

### 💻 Unique Paths II (With Obstacles, Space Optimized) Blueprint
~~~cpp
int uniquePathsWithObstacles(vector<vector<int>> &obstacleGrid) {
    int m = obstacleGrid.size(), n = obstacleGrid[0].size();
    vector<int> prev(n, 0);

    for (int i = 0; i < m; i++) {
        vector<int> cur(n, 0);
        for (int j = 0; j < n; j++) {
            // 1. Check for obstacle FIRST (even at (0, 0))!
            if (obstacleGrid[i][j] == 1) {
                cur[j] = 0;
            } else if (i == 0 && j == 0) {
                cur[j] = 1;
            } else {
                int up = (i > 0) ? prev[j] : 0;
                int left = (j > 0) ? cur[j - 1] : 0;
                cur[j] = up + left;
            }
        }
        prev = cur;
    }
    return prev[n - 1];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Checking \`i == 0 && j == 0\` Before Checking \`obstacleGrid[i][j] == 1\`:** If \`obstacleGrid[0][0] == 1\` (the starting cell is blocked), checking \`i == 0 && j == 0\` first falsely sets \`cur[0] = 1\` instead of \`0\`! Always check for an obstacle first.`),
      theorySummary: cleanText(`Obstacles in grid DP prune states by setting cur[j] = 0 whenever obstacleGrid[i][j] == 1. Checking the obstacle condition before the (0, 0) base case prevents invalid path propagation.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 19 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch19Topics) {
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

  // 5. Update track_topics: Link Batch 19 Topics to topic_order 181 through 190
  console.log("\n🔄 Linking Batch 19 topics to 'problem-solving-dsa-sql' (orders 181..190)...");

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

  // Link Batch 19 Topics (orders 181..190)
  for (const topicDef of batch19Topics) {
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

  console.log("\n🎉 DSA Batch 19 (Lectures 181–190) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch19()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch19;
