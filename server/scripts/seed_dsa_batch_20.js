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

const seedDsaBatch20 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 20 (Lectures 191–200) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 20 Topics (Lectures 191–200)
  const batch20Topics = [
    // =========================================================================
    // SUBTRACK: Module 29: 2D Dynamic Programming on Multi-Choice States & Grids (Topics 191–194)
    // =========================================================================
    {
      order: 191,
      name: "Cost-Accumulating Grid DP: Minimum Path Sum in a Grid",
      slug: "dsa-minimum-path-sum-in-grid",
      subtrack: "Module 29: 2D Dynamic Programming on Multi-Choice States & Grids",
      description: "Find the path from top-left to bottom-right minimizing accumulated cell costs using 2D DP and 1D space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 191: Minimum Path Sum in a Grid (DP 10)",
          url: cleanUrl("https://www.youtube.com/watch?v=_rgTlyky1uQ"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Path Sum in Grid",
          url: "https://takeuforward.org/data-structure/minimum-path-sum-in-a-grid-dp-10/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimum Path Sum (LC 64)",
          url: cleanUrl("https://leetcode.com/problems/minimum-path-sum/"),
          difficulty: "Medium",
          description: "Given an m x n grid filled with non-negative numbers, find a path from top-left to bottom-right which minimizes the sum of all numbers along its path.",
        },
        {
          platform: "LeetCode",
          title: "Dungeon Game (LC 174)",
          url: cleanUrl("https://leetcode.com/problems/dungeon-game/"),
          difficulty: "Hard",
          description: "Use reverse 2D grid DP from bottom-right to top-left to determine the minimum initial health needed by the knight.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Minimum Cost Path",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-cost-path3833/1"),
          difficulty: "Hard",
          description: "Contrast 2-directional (Right/Down) DP with 4-directional grid path minimization.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` grid filled with non-negative integers, find a path from the top-left corner \`(0, 0)\` to the bottom-right corner \`(N - 1, M - 1)\` that **minimizes the sum of all numbers** along its path. You can only move **Right** or **Down** at any step.

### 💡 Key Takeaways
- **Why Greedy Fails:**
  - Choosing the smaller immediate neighbor (\`Right\` vs \`Down\`) at \`(0, 0)\` can force you into huge numbers later in the grid! We must explore all valid paths via DP.
- **Top-Down Recurrence (\`f(i, j)\` = min path sum from \`(0, 0)\` to \`(i, j)\`):**
  - **Base Case 1 (\`i == 0 && j == 0\`):** Return \`grid[0][0]\`.
  - **Base Case 2 (\`i < 0 || j < 0\`):** Out of bounds! Return a huge sentinel value **\`1e9\`** (not \`INT_MAX\`, because adding \`grid[i][j] + INT_MAX\` will overflow a 32-bit integer!).
  - **Transitions:**
    - \`up = grid[i][j] + f(i - 1, j)\`
    - \`left = grid[i][j] + f(i, j - 1)\`
    - Return **\`min(up, left)\`**.
- **Space Optimization (\`O(N * M)\` Time, \`O(M)\` Space):**
  - Since row \`i\` only depends on \`prev[j]\` (from row \`i - 1\`) and \`cur[j - 1]\` (from the current row), we only need two 1D vectors of size \`M\`!

### 💻 Minimum Path Sum (1D Space Optimized) Blueprint
~~~cpp
int minPathSum(vector<vector<int>> &grid) {
    int n = grid.size(), m = grid[0].size();
    vector<int> prev(m, 0);

    for (int i = 0; i < n; i++) {
        vector<int> cur(m, 0);
        for (int j = 0; j < m; j++) {
            if (i == 0 && j == 0) {
                cur[j] = grid[i][j];
            } else {
                int up = grid[i][j] + ((i > 0) ? prev[j] : 1e9);
                int left = grid[i][j] + ((j > 0) ? cur[j - 1] : 1e9);
                cur[j] = min(up, left);
            }
        }
        prev = cur;
    }
    return prev[m - 1];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Returning \`0\` for Out-of-Bounds Base Cases:** In counting problems, out-of-bounds returns \`0\`. In **minimization** problems, returning \`0\` makes out-of-bounds look like a free \`0\`-cost path! Always return **\`1e9\`** when out of bounds.`),
      theorySummary: cleanText(`Minimum Path Sum minimizes cell accumulation: f(i, j) = grid[i][j] + min(f(i - 1, j), f(i, j - 1)). Out-of-bounds states return 1e9 to avoid picking invalid coordinates.`),
    },

    // -------------------------------------------------------------------------
    // Topic 192
    // -------------------------------------------------------------------------
    {
      order: 192,
      name: "Fixed Start to Variable Destination DP: Minimum Path Sum in a Triangle Grid",
      slug: "dsa-triangle-minimum-path-sum-variable-ending-point",
      subtrack: "Module 29: 2D Dynamic Programming on Multi-Choice States & Grids",
      description: "Solve fixed-origin to variable-destination triangular grid path minimization by starting recursion from (0, 0) and tabulating bottom-up.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 192: Minimum Path Sum in Triangular Grid (DP 11)",
          url: cleanUrl("https://www.youtube.com/watch?v=SrP-PiLSYC0"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Path Sum in Triangular Grid",
          url: "https://takeuforward.org/data-structure/minimum-path-sum-in-triangular-grid-dp-11/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Triangle (LC 120)",
          url: cleanUrl("https://leetcode.com/problems/triangle/"),
          difficulty: "Medium",
          description: "Given a triangle array, return the minimum path sum from top to bottom moving to index i or i + 1 on the next row.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Triangle Path Sum",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/triangle-path-sum/1"),
          difficulty: "Medium",
          description: "Find the minimum path sum from the top of a triangular grid to any cell in the bottom row.",
        },
        {
          platform: "LeetCode",
          title: "Pascal's Triangle (LC 118)",
          url: cleanUrl("https://leetcode.com/problems/pascals-triangle/"),
          difficulty: "Easy",
          description: "Practice indexing and row-by-row transitions on triangular arrays.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a triangular array \`triangle\` with \`N\` rows (where row \`i\` has \`i + 1\` elements), start at the single top element \`(0, 0)\` and reach **any cell in the bottom row \`N - 1\`**. From \`(i, j)\`, you can move **Down** to \`(i + 1, j)\` or **Diagonally Down-Right** to \`(i + 1, j + 1)\`. Find the minimum path sum.

### 💡 Key Takeaways
- **Why Start Recursion From \`(0, 0)\` Instead of \`(N - 1, j)\`?**
  - In previous grid problems, both the start \`(0, 0)\` and destination \`(N - 1, M - 1)\` were fixed.
  - Here, the starting point \`(0, 0)\` is **fixed**, while the ending point can be **any of the \`N\` cells in row \`N - 1\`**!
  - If we started recursion from the bottom row, we would have to run \`N\` separate recursive calls. Starting from **\`(0, 0)\` downward** requires only **1 call**, with the base case at **\`i == N - 1\`**!
- **Recurrence & Bottom-Up Tabulation Direction:**
  - **Base Case (\`i == N - 1\`):** For any column \`j\` in the last row, \`f(N - 1, j) = triangle[N - 1][j]\`.
  - **Transition:** \`f(i, j) = triangle[i][j] + min(f(i + 1, j), f(i + 1, j + 1))\`.
  - **Tabulation:** Since recursion goes from \`0\` down to \`N - 1\`, **Tabulation goes in the exact opposite direction: from row \`N - 2\` up to \`0\`**!
- **Complexity:** \`O(N²)\` Time and \`O(N)\` Space using a single \`front\` row vector.

### 💻 Triangle Minimum Path Sum (O(N) Space Optimized) Blueprint
~~~cpp
int minimumTotal(vector<vector<int>> &triangle) {
    int n = triangle.size();
    vector<int> front(n, 0), cur(n, 0);

    // 1. Base case: initialize 'front' with the last row (row n - 1)
    for (int j = 0; j < n; j++) {
        front[j] = triangle[n - 1][j];
    }

    // 2. Move bottom-up from row n - 2 up to row 0
    for (int i = n - 2; i >= 0; i--) {
        for (int j = i; j >= 0; j--) {
            int down = triangle[i][j] + front[j];
            int diagonal = triangle[i][j] + front[j + 1];
            cur[j] = min(down, diagonal);
        }
        front = cur;
    }
    return front[0];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Adding Out-of-Bounds Checks in Triangle DP:** Because row \`i\` has \`i + 1\` columns (\`j\` from \`0\` to \`i\`) and row \`i + 1\` has \`i + 2\` columns (\`0\` to \`i + 1\`), both \`(i + 1, j)\` and \`(i + 1, j + 1)\` are **always valid in bounds** until you hit row \`N - 1\`!`),
      theorySummary: cleanText(`When a problem has a fixed origin (0, 0) and variable ending points in the last row, starting recursion from (0, 0) down to row N - 1 enables single-pass tabulation from N - 2 up to 0 in O(N) space.`),
    },

    // -------------------------------------------------------------------------
    // Topic 193
    // -------------------------------------------------------------------------
    {
      order: 193,
      name: "Variable Start to Variable Destination DP: Minimum / Maximum Falling Path Sum",
      slug: "dsa-minimum-maximum-falling-path-sum-grid-dp",
      subtrack: "Module 29: 2D Dynamic Programming on Multi-Choice States & Grids",
      description: "Compute falling path optimization from any first-row cell to any last-row cell using 3-directional transitions and O(M) space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 193: Minimum/Maximum Falling Path Sum (DP 12)",
          url: cleanUrl("https://www.youtube.com/watch?v=N_aJ5qQbYA0"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Falling Path Sum",
          url: "https://takeuforward.org/data-structure/maximum-falling-path-sum-dp-12/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimum Falling Path Sum (LC 931)",
          url: cleanUrl("https://leetcode.com/problems/minimum-falling-path-sum/"),
          difficulty: "Medium",
          description: "Return the minimum sum of any falling path through an n x n matrix.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Falling Path Sum II (LC 1289)",
          url: cleanUrl("https://leetcode.com/problems/minimum-falling-path-sum-ii/"),
          difficulty: "Hard",
          description: "Find the minimum falling path sum where no two elements chosen in adjacent rows are in the same column.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Maximum path sum in matrix",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/path-in-matrix3805/1"),
          difficulty: "Medium",
          description: "Find the maximum sum of any path starting from any column in row 0 and ending at any column in row N - 1.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` matrix, a **Falling Path** starts at **any cell in the first row (\`0\`)** and ends at **any cell in the last row (\`N - 1\`)**. From \`(i, j)\`, you can move to **\`(i + 1, j - 1)\` (Down-Left)**, **\`(i + 1, j)\` (Down-Straight)**, or **\`(i + 1, j + 1)\` (Down-Right)**. Find the **Maximum** (or **Minimum**) Falling Path Sum.

### 💡 Key Takeaways
- **Handling Variable Starting AND Variable Ending Points:**
  - Define \`f(i, j)\` as the max path sum to reach \`(i, j)\` from **any cell in row \`0\`**.
  - **Base Case 1 (Out of Column Bounds \`j < 0 || j >= M\`):** Return **\`-1e8\`** for Max Path Sum (or **\`+1e8\`** for Min Path Sum).
  - **Base Case 2 (First Row \`i == 0\`):** Return \`matrix[0][j]\`.
  - **3-Way Transition:**
    - \`up = matrix[i][j] + f(i - 1, j)\`
    - \`leftDiag = matrix[i][j] + f(i - 1, j - 1)\`
    - \`rightDiag = matrix[i][j] + f(i - 1, j + 1)\`
    - Return \`max({up, leftDiag, rightDiag})\`.
  - Finally, take the maximum of \`dp[N - 1][j]\` across all columns \`j\` from \`0\` to \`M - 1\`!
- **Complexity:** \`O(N * M)\` Time and \`O(M)\` Space.

### 💻 Maximum Falling Path Sum (O(M) Space Optimized) Blueprint
~~~cpp
int getMaxPathSum(vector<vector<int>> &matrix) {
    int n = matrix.size(), m = matrix[0].size();
    vector<int> prev(m, 0), cur(m, 0);

    // 1. Base case: Row 0
    for (int j = 0; j < m; j++) {
        prev[j] = matrix[0][j];
    }

    // 2. Fill rows 1 to n - 1
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < m; j++) {
            int up = matrix[i][j] + prev[j];
            int leftDiag = matrix[i][j] + ((j - 1 >= 0) ? prev[j - 1] : -1e8);
            int rightDiag = matrix[i][j] + ((j + 1 < m) ? prev[j + 1] : -1e8);

            cur[j] = max({up, leftDiag, rightDiag});
        }
        prev = cur;
    }

    // 3. Answer is the maximum across all columns in the last row
    int maxi = -1e8;
    for (int j = 0; j < m; j++) {
        maxi = max(maxi, prev[j]);
    }
    return maxi;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Using \`INT_MIN\` (\`-2e9\`) as the Out-of-Bounds Sentinel:** If \`matrix[i][j]\` is negative (e.g., \`-10\`), computing \`matrix[i][j] + INT_MIN\` underflows a 32-bit signed integer into a huge positive number! Always use **\`-1e8\` (or \`-1e9\`)** instead of \`INT_MIN\`.`),
      theorySummary: cleanText(`Falling path problems evaluate 3 transitions (up, left-diagonal, right-diagonal) from any starting column in row 0 to any destination column in row N - 1 in O(N * M) time and O(M) space.`),
    },

    // -------------------------------------------------------------------------
    // Topic 194
    // -------------------------------------------------------------------------
    {
      order: 194,
      name: "Simultaneous Two-Agent 3D Grid DP: Cherry Pickup II",
      slug: "dsa-cherry-pickup-ii-3d-dp-on-grids",
      subtrack: "Module 29: 2D Dynamic Programming on Multi-Choice States & Grids",
      description: "Model two simultaneous agents moving down a grid together using a 3D DP state (row, col1, col2) with 9 directional combinations.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 194: Cherry Pickup II (3D DP on Grids - DP 13)",
          url: cleanUrl("https://www.youtube.com/watch?v=QGfn7JeXK54"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Cherry Pickup II (3D DP)",
          url: "https://takeuforward.org/data-structure/3-d-dp-ninja-and-his-friends-cherry-pickup-ii-dp-13/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Cherry Pickup II (LC 1463)",
          url: cleanUrl("https://leetcode.com/problems/cherry-pickup-ii/"),
          difficulty: "Hard",
          description: "Return the maximum number of cherries two robots starting at (0, 0) and (0, cols - 1) can collect.",
        },
        {
          platform: "LeetCode",
          title: "Cherry Pickup (LC 741)",
          url: cleanUrl("https://leetcode.com/problems/cherry-pickup/"),
          difficulty: "Hard",
          description: "Model a round-trip from (0, 0) to (n - 1, n - 1) and back as two simultaneous agents moving together.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Chocolates Pickup",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/chocolates-pickup/1"),
          difficulty: "Hard",
          description: "Find the maximum chocolates two robots starting at top-left and top-right corners can collect.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`R x C\` grid of cherries, **Alice** starts at top-left \`(0, 0)\` and **Bob** starts at top-right \`(0, C - 1)\`. In each step, both move down one row to \`(i + 1, j - 1)\`, \`(i + 1, j)\`, or \`(i + 1, j + 1)\`. If both land on the **exact same cell \`(i, j1 == j2)\`**, only **one** of them collects the cherries! Find the maximum total cherries they can collect together.

### 💡 Key Takeaways
- **Why We Must Move Both Agents Simultaneously (3D State \`(i, j1, j2)\`):**
  - If we moved Alice first and Bob second separately, we couldn't easily track which cells they stepped on together without passing the entire grid state.
  - Since both Alice and Bob step down **1 row at the exact same time**, they are **always on the same row \`i\`**!
  - Thus, instead of 4 parameters \`(i1, j1, i2, j2)\`, our state needs only **3 parameters: \`(i, j1, j2)\`**!
- **9 Combined Transitions (\`dj1\` in \`-1..+1\` × \`dj2\` in \`-1..+1\`):**
  - **Shared Cell Rule:** If \`j1 == j2\`, add \`grid[i][j1]\` **once**; otherwise add \`grid[i][j1] + grid[i][j2]\`.
  - **9 Moves:** Loop \`dj1\` from \`-1\` to \`+1\` and \`dj2\` from \`-1\` to \`+1\`, calling \`f(i + 1, j1 + dj1, j2 + dj2)\`.
- **Complexity:** \`O(R * C * C * 9)\` Time and \`O(C * C)\` Space (when space-optimized from 3D \`dp[R][C][C]\` to 2D \`front[C][C]\`).

### 💻 Cherry Pickup II (3D Memoization) Blueprint
~~~cpp
int solve3D(int i, int j1, int j2, int r, int c, const vector<vector<int>> &grid,
            vector<vector<vector<int>>> &dp) {
    // 1. Out-of-bounds base case
    if (j1 < 0 || j1 >= c || j2 < 0 || j2 >= c) return -1e8;

    // 2. Destination base case (last row)
    if (i == r - 1) {
        if (j1 == j2) return grid[i][j1];
        else return grid[i][j1] + grid[i][j2];
    }

    if (dp[i][j1][j2] != -1) return dp[i][j1][j2];

    // 3. Explore all 3 x 3 = 9 simultaneous moves of Alice and Bob
    int maxi = -1e8;
    for (int dj1 = -1; dj1 <= 1; dj1++) {
        for (int dj2 = -1; dj2 <= 1; dj2++) {
            int value = (j1 == j2) ? grid[i][j1] : (grid[i][j1] + grid[i][j2]);
            value += solve3D(i + 1, j1 + dj1, j2 + dj2, r, c, grid, dp);
            maxi = max(maxi, value);
        }
    }
    return dp[i][j1][j2] = maxi;
}

int cherryPickup(vector<vector<int>> &grid) {
    int r = grid.size(), c = grid[0].size();
    vector<vector<vector<int>>> dp(r, vector<vector<int>>(c, vector<int>(c, -1)));
    return solve3D(0, 0, c - 1, r, c, grid, dp);
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Double-Counting When \`j1 == j2\`:** Check \`if (j1 == j2)\` in **both** the last-row base case (\`i == r - 1\`) and the general transition step so shared cells are never added twice!`),
      theorySummary: cleanText(`Because both agents step down one row in lockstep, their state collapses into a 3D tuple (row, col1, col2). Exploring all 3 x 3 = 9 joint transitions yields an optimal O(R * C^2) solution.`),
    },

    // =========================================================================
    // SUBTRACK: Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack (Topics 195–200)
    // =========================================================================
    {
      order: 195,
      name: "Subsequence Target Existence: Subset Sum Equals to Target",
      slug: "dsa-subset-sum-equals-to-target-dp-on-subsequences",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Determine whether a subset sums to target K using pick/not-pick transitions on state (ind, target) with O(K) space optimization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 195: Subset Sum Equals to Target (DP 14)",
          url: cleanUrl("https://www.youtube.com/watch?v=fWX9xDmIzRI"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Subset Sum Equals to Target",
          url: "https://takeuforward.org/data-structure/subset-sum-equal-to-target-dp-14/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Subset Sum Problem",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1"),
          difficulty: "Medium",
          description: "Given an array of non-negative integers and a value sum, check if there is a subset of the given set with sum equal to given sum.",
        },
        {
          platform: "LeetCode",
          title: "Partition Equal Subset Sum (LC 416)",
          url: cleanUrl("https://leetcode.com/problems/partition-equal-subset-sum/"),
          difficulty: "Medium",
          description: "Reduce equal-sum array partitioning directly to Subset Sum Equals Target (target = totalSum / 2).",
        },
        {
          platform: "LeetCode",
          title: "Minimize the Difference Between Target and Chosen Elements (LC 1981)",
          url: cleanUrl("https://leetcode.com/problems/minimize-the-difference-between-target-and-chosen-elements/"),
          difficulty: "Medium",
          description: "Track reachable subset sums across rows to minimize absolute difference from target.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`arr\` of \`N\` positive integers and a target integer \`K\`, determine whether there exists a **subset (subsequence)** of \`arr\` whose elements sum to **exactly \`K\`**.

### 💡 Key Takeaways
- **2D State \`(ind, target)\`:**
  - \`f(ind, target)\` answers: *"In the subarray \`0 .. ind\`, does there exist a subsequence that sums to \`target\`?"*
  - **Base Case 1 (\`target == 0\`):** Return \`true\` (we can always form sum \`0\` by picking nothing!).
  - **Base Case 2 (\`ind == 0\`):** Return \`(arr[0] == target)\` (at index \`0\`, we can form \`target\` if and only if \`arr[0]\` equals \`target\`).
  - **Transitions:**
    - \`notTake = f(ind - 1, target)\`
    - \`take = false; if (arr[ind] <= target) take = f(ind - 1, target - arr[ind]);\`
    - Return **\`take || notTake\`**.
- **Tabulation Base-Case Guard (\`if (arr[0] <= k) dp[0][arr[0]] = true;\`):**
  - When initializing row \`0\` in bottom-up tabulation, only mark \`dp[0][arr[0]] = true\` if **\`arr[0] <= k\`** (otherwise \`arr[0]\` goes out of column bounds!).
- **Complexity:** \`O(N * K)\` Time and \`O(K)\` Space (using \`prev\` and \`cur\` boolean vectors of size \`K + 1\`).

### 💻 Subset Sum Equals to Target (Space Optimized) Blueprint
~~~cpp
bool subsetSumToK(int n, int k, vector<int> &arr) {
    vector<bool> prev(k + 1, false), cur(k + 1, false);

    // Base Case 1: target == 0 is always achievable
    prev[0] = cur[0] = true;

    // Base Case 2: index 0 can form sum arr[0] (if within target bound k)
    if (arr[0] <= k) prev[arr[0]] = true;

    for (int ind = 1; ind < n; ind++) {
        for (int target = 1; target <= k; target++) {
            bool notTake = prev[target];
            bool take = false;
            if (arr[ind] <= target) {
                take = prev[target - arr[ind]];
            }
            cur[target] = take || notTake;
        }
        prev = cur;
    }
    return prev[k];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Writing \`prev[arr[0]] = true;\` Without Checking \`if (arr[0] <= k)\`:** If \`arr[0] = 100\` and \`k = 10\`, indexing \`prev[100]\` causes an immediate out-of-bounds memory crash!`),
      theorySummary: cleanText(`Subset sum existence models each element as take vs notTake: dp[target] = dp[target] || dp[target - arr[ind]]. Base case target = 0 is always true.`),
    },

    // -------------------------------------------------------------------------
    // Topic 196
    // -------------------------------------------------------------------------
    {
      order: 196,
      name: "Half-Sum Reduction: Partition Equal Subset Sum",
      slug: "dsa-partition-equal-subset-sum",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Reduce the two-subset equal partition problem to single-subset sum checking with target = totalSum / 2.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 196: Partition Equal Subset Sum (DP 15)",
          url: cleanUrl("https://www.youtube.com/watch?v=7win3dcgo3k"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Partition Equal Subset Sum",
          url: "https://takeuforward.org/data-structure/partition-equal-subset-sum-dp-15/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Partition Equal Subset Sum (LC 416)",
          url: cleanUrl("https://leetcode.com/problems/partition-equal-subset-sum/"),
          difficulty: "Medium",
          description: "Return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Partition Equal Subset Sum",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/subset-sum-problem2014/1"),
          difficulty: "Medium",
          description: "Determine if an array can be divided into two subsets with equal sum.",
        },
        {
          platform: "LeetCode",
          title: "Partition to K Equal Sum Subsets (LC 698)",
          url: cleanUrl("https://leetcode.com/problems/partition-to-k-equal-sum-subsets/"),
          difficulty: "Medium",
          description: "Generalize 2-subset equal partitioning to k equal-sum subsets.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`nums\` of size \`N\`, determine if the array can be partitioned into **two subsets \`S1\` and \`S2\`** such that the sum of elements in \`S1\` equals the sum of elements in \`S2\`.

### 💡 Key Takeaways
- **Reducing Two-Subset Partition to Single-Subset Target Sum:**
  - Let \`totSum\` be the sum of all elements in \`nums\`.
  - **1. Odd Sum Check:** If \`totSum\` is **odd** (\`totSum % 2 != 0\`), it is mathematically impossible to split an odd integer into two equal integer halves—immediately return **\`false\`**!
  - **2. Even Sum Reduction:** If \`totSum\` is **even**, and we find **just one subset \`S1\`** whose sum equals **\`target = totSum / 2\`**, the remaining elements \`S2\` are automatically guaranteed to sum to \`totSum - (totSum / 2) = totSum / 2\`!
  - Therefore, simply call **\`subsetSumToK(n, totSum / 2, nums)\`** from DP 14!
- **Complexity:** \`O(N * (totSum / 2))\` Time and \`O(totSum / 2)\` Space.

### 💻 Partition Equal Subset Sum Blueprint
~~~cpp
bool canPartition(vector<int> &nums) {
    int n = nums.size();
    int totSum = 0;
    for (int x : nums) totSum += x;

    // Odd total sum can never be split into two equal integer halves
    if (totSum % 2 != 0) return false;

    int target = totSum / 2;
    vector<bool> prev(target + 1, false), cur(target + 1, false);
    prev[0] = cur[0] = true;
    if (nums[0] <= target) prev[nums[0]] = true;

    for (int ind = 1; ind < n; ind++) {
        for (int t = 1; t <= target; t++) {
            bool notTake = prev[t];
            bool take = false;
            if (nums[ind] <= t) take = prev[t - nums[ind]];
            cur[t] = take || notTake;
        }
        prev = cur;
    }
    return prev[target];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting the \`totSum % 2 != 0\` Check:** Integer division \`totSum / 2\` truncates odd numbers (e.g., \`15 / 2 = 7\`), which would falsely return \`true\` if a subset sums to \`7\` while the other sums to \`8\`!`),
      theorySummary: cleanText(`Equal partition checks if totSum is even and delegates to subset sum with target = totSum / 2. If one subset achieves totSum / 2, the complement automatically matches.`),
    },

    // -------------------------------------------------------------------------
    // Topic 197
    // -------------------------------------------------------------------------
    {
      order: 197,
      name: "DP Table Last-Row Inspection: Partition a Set Into Two Subsets With Minimum Absolute Sum Difference",
      slug: "dsa-partition-set-into-two-subsets-minimum-absolute-sum-difference",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Inspect the final row of the subset sum DP table to evaluate all achievable sums s1 <= totSum / 2 and minimize |s1 - s2|.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 197: Partition Set With Minimum Absolute Sum Difference (DP 16)",
          url: cleanUrl("https://www.youtube.com/watch?v=GS_OqZb2CWc"),
          duration: "21m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Subset Sum Difference",
          url: "https://takeuforward.org/data-structure/partition-a-set-into-two-subsets-with-minimum-absolute-sum-difference-dp-16/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Minimum sum partition",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-sum-partition3317/1"),
          difficulty: "Hard",
          description: "Given an array of non-negative integers, divide it into two sets S1 and S2 such that the absolute difference between their sums is minimum.",
        },
        {
          platform: "LeetCode",
          title: "Last Stone Weight II (LC 1049)",
          url: cleanUrl("https://leetcode.com/problems/last-stone-weight-ii/"),
          difficulty: "Medium",
          description: "Model pairwise stone smashing as partitioning stones into two groups with minimum absolute sum difference.",
        },
        {
          platform: "LeetCode",
          title: "Partition Array Into Two Arrays to Minimize Sum Difference (LC 2035)",
          url: cleanUrl("https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/"),
          difficulty: "Hard",
          description: "Extend minimum sum difference partitioning to equal-sized halves with negative numbers via Meet-in-the-Middle.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`arr\` of \`N\` non-negative integers, partition the array into two subsets \`S1\` and \`S2\` such that the **absolute difference between their sums \`|sum(S1) - sum(S2)|\` is minimized**.

### 💡 Key Takeaways
- **The Last-Row Power of Subset Sum Tabulation:**
  - When we run the bottom-up **Subset Sum** tabulation up to \`k = totSum\`, the final row \`dp[N - 1][s1]\` (or \`prev[s1]\`) tells us in \`O(1)\` time whether **every possible subset sum \`s1\` from \`0\` to \`totSum\`** is achievable!
- **Scanning Achieved Sums up to \`totSum / 2\`:**
  - For any achievable subset sum \`s1\` (\`prev[s1] == true\`), the second subset automatically has sum **\`s2 = totSum - s1\`**.
  - Their absolute difference is **\`abs(s1 - (totSum - s1)) = abs(totSum - 2 * s1)\`**.
  - Loop \`s1\` from \`0\` to \`totSum / 2\`: whenever \`prev[s1] == true\`, update **\`mini = min(mini, totSum - 2 * s1)\`**!
- **Complexity:** \`O(N * totSum)\` Time and \`O(totSum)\` Space.

### 💻 Minimum Subset Sum Difference Blueprint
~~~cpp
int minSubsetSumDifference(vector<int> &arr, int n) {
    int totSum = 0;
    for (int x : arr) totSum += x;

    int k = totSum;
    vector<bool> prev(k + 1, false), cur(k + 1, false);
    prev[0] = cur[0] = true;
    if (arr[0] <= k) prev[arr[0]] = true;

    for (int ind = 1; ind < n; ind++) {
        for (int target = 1; target <= k; target++) {
            bool notTake = prev[target];
            bool take = false;
            if (arr[ind] <= target) take = prev[target - arr[ind]];
            cur[target] = take || notTake;
        }
        prev = cur;
    }

    // Inspect the final DP row for all achievable sums s1 in [0 .. totSum / 2]
    int mini = 1e9;
    for (int s1 = 0; s1 <= totSum / 2; s1++) {
        if (prev[s1] == true) {
            int s2 = totSum - s1;
            mini = min(mini, abs(s2 - s1));
        }
    }
    return mini;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Using Top-Down Memoization Instead of Tabulation Here:** Top-down memoization \`f(N - 1, totSum)\` only populates the specific states needed for \`totSum\`, leaving many intermediate sums \`s1\` uncomputed (\`-1\`). Bottom-up **Tabulation** computes all \`0 .. totSum\` columns in one sweep!`),
      theorySummary: cleanText(`Tabulating subset sum up to totSum populates all reachable sums in the final DP row. Iterating s1 up to totSum / 2 finds min(totSum - 2 * s1) across all valid subsets.`),
    },

    // -------------------------------------------------------------------------
    // Topic 198
    // -------------------------------------------------------------------------
    {
      order: 198,
      name: "Subsequence Combinatorial Counting & The Zero-Element Trap: Count Subsets With Sum K",
      slug: "dsa-count-subsets-with-sum-k",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Count subsets summing to K while correctly handling zero elements which double valid combinations at sum 0.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 198: Count Subsets With Sum K (DP 17)",
          url: cleanUrl("https://www.youtube.com/watch?v=ZHyb-A2Mte4"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count Subsets with Sum K",
          url: "https://takeuforward.org/data-structure/count-subsets-with-sum-k-dp-17/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Perfect Sum Problem (Count Subsets with Sum K)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1"),
          difficulty: "Medium",
          description: "Given an array of non-negative integers (including 0s) and an integer sum, count all subsets whose sum equals sum.",
        },
        {
          platform: "LeetCode",
          title: "Target Sum (LC 494)",
          url: cleanUrl("https://leetcode.com/problems/target-sum/"),
          difficulty: "Medium",
          description: "Count the number of ways to assign + and - signs to array elements to reach target.",
        },
        {
          platform: "LeetCode",
          title: "Combination Sum IV (LC 377)",
          url: cleanUrl("https://leetcode.com/problems/combination-sum-iv/"),
          difficulty: "Medium",
          description: "Contrast unordered subset sum counting with ordered permutation sum counting.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`num\` of \`N\` non-negative integers and a target \`K\`, **count the total number of subsets** whose elements sum to \`K\`.

### 💡 Key Takeaways
- **Replacing \`||\` With \`+\`:**
  - In DP 14 (Subset Sum Existence), we returned \`take || notTake\`.
  - To **count** all valid subsets, we sum the two choices: **\`return take + notTake\`**!
- **The Critical \`arr[i] == 0\` Trap (Why Early Stopping at \`sum == 0\` Fails When Zeros Exist!):**
  - If all array elements are **strictly positive (\`>= 1\`)**, there is only \`1\` way to make sum \`0\` at index \`0\` (\`pick nothing\`), and \`1\` way to make \`num[0]\`.
  - **What if the array contains \`0\`s (e.g., \`arr = {0, 0, 1}\`, \`target = 1\`)?**
    - Picking \`0\` or not picking \`0\` **both** leave the sum unchanged, doubling the number of ways!
    - Therefore, do **NOT** return early when \`sum == 0\`! Dive all the way down to **\`ind == 0\`**, and handle the base case at \`ind == 0\` as:
      - **\`if (sum == 0 && num[0] == 0) return 2;\`** (both picking \`0\` and not picking \`0\` are valid!).
      - **\`if (sum == 0 || sum == num[0]) return 1;\`**
      - **\`return 0;\`**
- **Complexity:** \`O(N * K)\` Time and \`O(K)\` Space.

### 💻 Count Subsets With Sum K (Handling Zeros) Blueprint
~~~cpp
int findWays(vector<int> &num, int k) {
    int n = num.size();
    vector<int> prev(k + 1, 0), cur(k + 1, 0);
    int mod = 1e9 + 7;

    // Base cases at index 0 (correctly handling num[0] == 0!)
    if (num[0] == 0) {
        prev[0] = 2; // 2 ways for sum 0: pick num[0] or don't pick num[0]
    } else {
        prev[0] = 1; // 1 way for sum 0: don't pick num[0]
    }

    if (num[0] != 0 && num[0] <= k) {
        prev[num[0]] = 1;
    }

    for (int ind = 1; ind < n; ind++) {
        // Note: sum starts from 0 (not 1!) so zeros at index > 0 are counted!
        for (int sum = 0; sum <= k; sum++) {
            int notTake = prev[sum];
            int take = 0;
            if (num[ind] <= sum) {
                take = prev[sum - num[ind]];
            }
            cur[sum] = (take + notTake) % mod;
        }
        prev = cur;
    }
    return prev[k];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Starting the Inner Loop at \`sum = 1\` When Zeros Exist:** When the array can contain \`0\`, \`cur[0]\` can grow from \`1\` to \`2, 4, 8...\` as more zeros are encountered! Always start the inner loop at **\`sum = 0\`**!`),
      theorySummary: cleanText(`Counting subsets with sum K sums take and notTake branches. When zeros exist, sum 0 combinations double at each zero, requiring base case handling at ind = 0 and inner loops starting from sum = 0.`),
    },

    // -------------------------------------------------------------------------
    // Topic 199
    // -------------------------------------------------------------------------
    {
      order: 199,
      name: "Algebraic Target Reduction: Count Partitions With Given Difference (Target Sum)",
      slug: "dsa-count-partitions-with-given-difference",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Transform subset difference constraints S1 - S2 = D into target sum S2 = (totSum - D) / 2 and apply non-negative subset counting.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 199: Count Partitions With Given Difference (DP 18)",
          url: cleanUrl("https://www.youtube.com/watch?v=zoilQD1kYSg"),
          duration: "19m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count Partitions with Given Difference",
          url: "https://takeuforward.org/data-structure/count-partitions-with-given-difference-dp-18/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Partitions with Given Difference",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/partitions-with-given-difference/1"),
          difficulty: "Medium",
          description: "Count the number of ways to partition an array into two subsets S1 and S2 such that S1 >= S2 and S1 - S2 == d.",
        },
        {
          platform: "LeetCode",
          title: "Target Sum (LC 494)",
          url: cleanUrl("https://leetcode.com/problems/target-sum/"),
          difficulty: "Medium",
          description: "Assign + and - signs to each number so the expression evaluates to target (identical to S1 - S2 == target).",
        },
        {
          platform: "GeeksforGeeks",
          title: "Perfect Sum Problem",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1"),
          difficulty: "Medium",
          description: "Use the Count Subsets With Sum K engine to solve the reduced target (totSum - d) / 2.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`arr\` of \`N\` non-negative integers and an integer difference \`D\`, count the number of ways to partition \`arr\` into two subsets \`S1\` and \`S2\` such that **\`S1 >= S2\`** and **\`S1 - S2 == D\`**.

### 💡 Key Takeaways
- **Algebraic Reduction to "Count Subsets With Sum K" (DP 17):**
  - We know two equations:
    1. \`S1 + S2 = totSum\`  ⇒  \`S1 = totSum - S2\`
    2. \`S1 - S2 = D\`
  - Substitute \`S1\` into equation 2:
    \`(totSum - S2) - S2 = D\`
    \`totSum - 2 * S2 = D\`
    **\`S2 = (totSum - D) / 2\`**!
  - Therefore, counting partitions with \`S1 - S2 == D\` is **100% equivalent** to counting subsets with sum **\`target = (totSum - D) / 2\`**!
- **Two Mandatory Validity Checks Before Running DP:**
  1. **\`totSum - D < 0\`:** Target sum cannot be negative (\`return 0\`).
  2. **\`(totSum - D) % 2 != 0\`:** \`totSum - D\` must be **even** so that \`S2\` is a whole integer (\`return 0\`)!
- **Complexity:** \`O(N * ((totSum - D) / 2))\` Time and \`O((totSum - D) / 2)\` Space.

### 💻 Count Partitions With Given Difference Blueprint
~~~cpp
int countPartitions(int n, int d, vector<int> &arr) {
    int totSum = 0;
    for (int x : arr) totSum += x;

    // Validity checks: (totSum - d) must be non-negative and even!
    if (totSum - d < 0 || (totSum - d) % 2 != 0) return 0;

    int k = (totSum - d) / 2;
    int mod = 1e9 + 7;

    vector<int> prev(k + 1, 0), cur(k + 1, 0);
    if (arr[0] == 0) prev[0] = 2;
    else prev[0] = 1;

    if (arr[0] != 0 && arr[0] <= k) prev[arr[0]] = 1;

    for (int ind = 1; ind < n; ind++) {
        for (int sum = 0; sum <= k; sum++) {
            int notTake = prev[sum];
            int take = 0;
            if (arr[ind] <= sum) take = prev[sum - arr[ind]];
            cur[sum] = (take + notTake) % mod;
        }
        prev = cur;
    }
    return prev[k];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting that LeetCode 494 (Target Sum) Is the Exact Same Problem:** Assigning \`+\` to some elements (group \`S1\`) and \`-\` to the rest (group \`S2\`) so \`S1 - S2 = target\` is literally **Count Partitions With Given Difference**!`),
      theorySummary: cleanText(`Combining S1 + S2 = totSum and S1 - S2 = D yields target S2 = (totSum - D) / 2. If totSum - D < 0 or is odd, return 0; otherwise count subsets with sum S2.`),
    },

    // -------------------------------------------------------------------------
    // Topic 200
    // -------------------------------------------------------------------------
    {
      order: 200,
      name: "Single-Array Right-to-Left Space Optimization: 0/1 Knapsack Problem",
      slug: "dsa-0-1-knapsack-problem-single-array-space-optimization",
      subtrack: "Module 30: Dynamic Programming on Subsequences, Subset Sums & 0/1 Knapsack",
      description: "Solve classical 0/1 Knapsack capacity allocation and optimize space from 2D table to a single 1D array by iterating weights right-to-left.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 200: 0/1 Knapsack Problem (DP 19)",
          url: cleanUrl("https://www.youtube.com/watch?v=GqOmJHQZivw"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: 0/1 Knapsack Problem",
          url: "https://takeuforward.org/data-structure/0-1-knapsack-dp-19/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "0 - 1 Knapsack Problem",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1"),
          difficulty: "Medium",
          description: "Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value.",
        },
        {
          platform: "LeetCode",
          title: "Ones and Zeroes (LC 474)",
          url: cleanUrl("https://leetcode.com/problems/ones-and-zeroes/"),
          difficulty: "Medium",
          description: "Extend 0/1 Knapsack single-array reverse iteration to a 2D capacity constraint (at most m 0s and n 1s).",
        },
        {
          platform: "LeetCode",
          title: "Last Stone Weight II (LC 1049)",
          url: cleanUrl("https://leetcode.com/problems/last-stone-weight-ii/"),
          difficulty: "Medium",
          description: "Use 0/1 Knapsack up to capacity totalSum / 2 to maximize the weight of one stone group.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A thief has a knapsack with maximum weight capacity \`W\` and \`N\` items, where item \`i\` has weight \`wt[i]\` and value \`val[i]\`. Each item can be picked **at most once (\`0\` or \`1\` time)**. Maximize the total value of items placed in the knapsack without exceeding capacity \`W\`.

### 💡 Key Takeaways
- **2D Recurrence (\`f(ind, W)\`):**
  - **Base Case (\`ind == 0\`):** If \`wt[0] <= W\`, we can steal item \`0\` and gain \`val[0]\`; otherwise return \`0\`.
  - **Transitions:**
    - \`notTake = 0 + f(ind - 1, W)\`
    - \`take = INT_MIN; if (wt[ind] <= W) take = val[ind] + f(ind - 1, W - wt[ind]);\`
    - Return **\`max(take, notTake)\`**.
- **The Single-Array (\`O(W)\`) Right-to-Left Trick:**
  - Notice that \`cur[w]\` only depends on \`prev[w]\` and \`prev[w - wt[ind]]\` (values to the **left** of \`w\` in the previous row!).
  - If we iterate capacity \`w\` **from Right to Left (\`W\` down to \`0\`)** on a **single array \`prev\`**, when we are at \`prev[w]\`, all values to the left (\`prev[w - wt[ind]]\`) still hold the untouched \`ind - 1\` row values!
  - Thus we can eliminate the \`cur\` array completely and solve 0/1 Knapsack using **just ONE array of size \`W + 1\`**!

### 💻 0/1 Knapsack (Single-Array Space Optimized) Blueprint
~~~cpp
int knapsack01(vector<int> &wt, vector<int> &val, int n, int maxWeight) {
    // Single 1D array of size maxWeight + 1!
    vector<int> prev(maxWeight + 1, 0);

    // 1. Base case for item 0: any capacity W >= wt[0] can take item 0
    for (int W = wt[0]; W <= maxWeight; W++) {
        prev[W] = val[0];
    }

    // 2. Process items 1 to n - 1 iterating W from RIGHT TO LEFT!
    for (int ind = 1; ind < n; ind++) {
        for (int W = maxWeight; W >= 0; W--) {
            int notTake = 0 + prev[W];
            int take = INT_MIN;
            if (wt[ind] <= W) {
                take = val[ind] + prev[W - wt[ind]];
            }
            prev[W] = max(take, notTake);
        }
    }
    return prev[maxWeight];
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Iterating \`W\` From Left to Right (\`0\` to \`maxWeight\`) on a Single Array:** If you overwrite \`prev[W]\` from left to right, then later when a larger capacity reads \`prev[W - wt[ind]]\`, it will read the **already-updated current row value**, effectively picking the same item multiple times (turning 0/1 Knapsack into Unbounded Knapsack)! For 0/1 Knapsack on a single array, **always iterate \`W\` from \`maxWeight\` down to \`0\`**.`),
      theorySummary: cleanText(`0/1 Knapsack transitions max(val + prev[W - wt], prev[W]). Iterating capacity W from right to left allows updating in-place within a single array of size W + 1 in O(N * W) time and O(W) space.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 20 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch20Topics) {
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

  // 5. Update track_topics: Link Batch 20 Topics to topic_order 191 through 200
  console.log("\n🔄 Linking Batch 20 topics to 'problem-solving-dsa-sql' (orders 191..200)...");

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

  // Link Batch 20 Topics (orders 191..200)
  for (const topicDef of batch20Topics) {
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

  console.log("\n🎉 DSA Batch 20 (Lectures 191–200) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch20()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch20;
