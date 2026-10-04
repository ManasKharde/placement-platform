const pool = require("../config/db");

// Helper to remove any citations, LaTeX commands, or dollar signs
const cleanText = (str) => {
  if (!str) return str;
  return str
    .replace(/\[cite:\s*\d+\]/g, "")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "infinity")
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

const seedDsaBatch17 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 17 (Lectures 161–170) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 17 Topics (Lectures 161–170)
  const batch17Topics = [
    // =========================================================================
    // SUBTRACK: Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm (Topics 161–165)
    // =========================================================================
    {
      order: 161,
      name: "Unit-Weight Grid Dijkstra: Shortest Distance in a Binary Maze",
      slug: "dsa-shortest-distance-in-a-binary-maze",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Find the shortest distance between source and destination cells in a binary maze using unit-weight queue BFS.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 161: Shortest Distance in a Binary Maze",
          url: cleanUrl("https://www.youtube.com/watch?v=U5Mw4eyUmw4"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Shortest Distance in a Binary Maze",
          url: "https://takeuforward.org/data-structure/shortest-distance-in-a-binary-maze/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Shortest Path in Binary Matrix (LC 1091)",
          url: cleanUrl("https://leetcode.com/problems/shortest-path-in-binary-matrix/"),
          difficulty: "Medium",
          description: "Find the shortest 8-directional clear path from top-left (0, 0) to bottom-right (n - 1, n - 1) in a binary matrix.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Shortest Distance in a Binary Maze",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/shortest-path-in-a-binary-maze-1655453161/1"),
          difficulty: "Medium",
          description: "Find the shortest 4-directional path from a given source cell to a destination cell in a binary grid.",
        },
        {
          platform: "LeetCode",
          title: "Nearest Exit from Entrance in Maze (LC 1926)",
          url: cleanUrl("https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/"),
          difficulty: "Medium",
          description: "Use unit-weight grid BFS to find the minimum steps from entrance to the nearest border exit.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` binary grid where \`1\` represents an open cell and \`0\` represents a blocked cell, find the **shortest distance** from a \`source\` coordinate \`{sr, sc}\` to a \`destination\` coordinate \`{dr, dc}\` moving in 4 cardinal directions (or 8 directions on LeetCode 1091). Return \`-1\` if unreachable.

### 💡 Key Takeaways
- **Why Plain Queue Replaces Priority Queue Here:**
  - Every move to an adjacent cell adds an identical step cost of \`+1\`.
  - Because edge weights are uniform (\`1\`), elements pushed into a standard FIFO \`queue<pair<int, pair<int, int>>>\` are **already naturally sorted by distance**!
  - Using a plain \`queue\` instead of a \`priority_queue\` saves the \`O(log(N * M))\` heap overhead per push, reducing runtime to pure **\`O(N * M)\`**!
- **Early Termination Optimization:**
  - As soon as a step transition reaches \`nr == destination.first && nc == destination.second\` (or if \`source == destination\` initially), return \`d + 1\` (or \`0\`) immediately!

### 💻 Shortest Distance in a Binary Maze Blueprint
\`\`\`cpp
int shortestPathBinaryMaze(vector<vector<int>> &grid, pair<int, int> source, pair<int, int> destination) {
    if (source.first == destination.first && source.second == destination.second) return 0;

    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> dist(rows, vector<int>(cols, 1e9));
    queue<pair<int, pair<int, int>>> q; // Stores {distance, {r, c}}

    dist[source.first][source.second] = 0;
    q.push({0, {source.first, source.second}});

    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    while (!q.empty()) {
        auto [d, coords] = q.front();
        q.pop();
        int r = coords.first, c = coords.second;

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                grid[nr][nc] == 1 && d + 1 < dist[nr][nc]) {
                dist[nr][nc] = d + 1;
                if (nr == destination.first && nc == destination.second) {
                    return d + 1;
                }
                q.push({d + 1, {nr, nc}});
            }
        }
    }
    return -1;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Missing the \`source == destination\` Edge Case:** If the starting cell is already the destination cell, the inner neighbor loop won't trigger for it—always check \`if (source == destination) return 0;\` at the very top!`),
      theorySummary: cleanText(`Shortest Distance in a Binary Maze:
1. Because step cost is uniform (+1), standard queue-based BFS explores cells in increasing order of distance.
2. Relax neighbors: if d + 1 < dist[nr][nc], update dist and push to queue.
3. Return d + 1 upon reaching destination (or 0 if source == destination).
Complexity: O(N * M) time, O(N * M) space.`),
    },

    {
      order: 162,
      name: "Minimax Edge Relaxation: Path With Minimum Effort Using Dijkstra's Algorithm",
      slug: "dsa-path-with-minimum-effort-dijkstra",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Find the 2D grid path minimizing the maximum absolute height difference between consecutive cells using minimax Dijkstra.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 162: Path With Minimum Effort",
          url: cleanUrl("https://www.youtube.com/watch?v=0ytpZyiZFhA"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Path With Minimum Effort",
          url: "https://takeuforward.org/data-structure/g-37-path-with-minimum-effort/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Path With Minimum Effort (LC 1631)",
          url: cleanUrl("https://leetcode.com/problems/path-with-minimum-effort/"),
          difficulty: "Medium",
          description: "Find a route from (0, 0) to (rows - 1, cols - 1) that minimizes the maximum absolute height difference between consecutive cells.",
        },
        {
          platform: "LeetCode",
          title: "Swim in Rising Water (LC 778)",
          url: cleanUrl("https://leetcode.com/problems/swim-in-rising-water/"),
          difficulty: "Hard",
          description: "Use minimax Dijkstra on a 2D elevation grid to minimize the maximum elevation encountered along the path.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Path With Minimum Effort",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/path-with-minimum-effort/1"),
          difficulty: "Medium",
          description: "Compute the minimum effort required to travel from the top-left cell to the bottom-right cell.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given a 2D \`heights\` grid of size \`rows x cols\`. A path's **Effort** is defined as the **maximum absolute difference in heights** between any two consecutive cells along the path. Find the **minimum effort** required to travel from \`(0, 0)\` to \`(rows - 1, cols - 1)\`.

### 💡 Key Takeaways
- **Minimax Dijkstra Relaxation Rule:**
  - Instead of summing edge weights (\`d + wt\`), the effort of extending a path to \`(nr, nc)\` is the **maximum** of the effort experienced so far (\`diff\`) and the current step's height jump:
    **\`newEffort = max(diff, abs(heights[r][c] - heights[nr][nc]))\`**.
  - If \`newEffort < dist[nr][nc]\`, update \`dist[nr][nc] = newEffort\` and push \`{newEffort, {nr, nc}}\` into the min-heap!
- **Why Popping the Destination Guarantees Optimality:**
  - Because the min-heap always pops the globally smallest effort across all active frontier cells, the **moment \`(rows - 1, cols - 1)\` is popped from \`pq.top()\`**, its effort \`diff\` cannot possibly be improved by any other path in the queue!
- **Complexity:** \`O(4 * N * M * log(N * M))\` Time and \`O(N * M)\` Space.

### 💻 Path With Minimum Effort Blueprint
\`\`\`cpp
int minimumEffortPath(vector<vector<int>> &heights) {
    int rows = heights.size(), cols = heights[0].size();
    priority_queue<pair<int, pair<int, int>>,
                   vector<pair<int, pair<int, int>>>,
                   greater<pair<int, pair<int, int>>>> pq;

    vector<vector<int>> dist(rows, vector<int>(cols, 1e9));
    dist[0][0] = 0;
    pq.push({0, {0, 0}});

    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    while (!pq.empty()) {
        auto [diff, coords] = pq.top();
        pq.pop();
        int r = coords.first, c = coords.second;

        // Optimal early return when destination is popped from min-heap!
        if (r == rows - 1 && c == cols - 1) return diff;

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                int newEffort = max(abs(heights[r][c] - heights[nr][nc]), diff);
                if (newEffort < dist[nr][nc]) {
                    dist[nr][nc] = newEffort;
                    pq.push({newEffort, {nr, nc}});
                }
            }
        }
    }
    return 0;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Returning When Pushing Instead of When Popping:** Unlike unit-weight BFS, edge jumps here vary wildly! Do **not** return \`newEffort\` inside the \`for\` loop when pushing \`(rows - 1, cols - 1)\`—wait until \`(rows - 1, cols - 1)\` is **popped** from \`pq.top()\`!`),
      theorySummary: cleanText(`Path With Minimum Effort (Minimax Dijkstra):
1. Effort along path is max of prior effort and current height step: newEffort = max(diff, abs(heights[r][c] - heights[nr][nc])).
2. Use min-heap ordered by effort.
3. Return diff immediately when destination (rows - 1, cols - 1) is popped from heap.
Complexity: O(4 * N * M * log(N * M)) time, O(N * M) space.`),
    },

    {
      order: 163,
      name: "Stop-Prioritized Queue Relaxation: Cheapest Flights Within K Stops",
      slug: "dsa-cheapest-flights-within-k-stops",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Find the cheapest flight price from source to destination constrained by at most K intermediate stops using queue-based BFS.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 163: Cheapest Flights Within K Stops",
          url: cleanUrl("https://www.youtube.com/watch?v=9XybHVqTHcQ"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Cheapest Flights Within K Stops",
          url: "https://takeuforward.org/data-structure/g-38-cheapest-flights-within-k-stops/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Cheapest Flights Within K Stops (LC 787)",
          url: cleanUrl("https://leetcode.com/problems/cheapest-flights-within-k-stops/"),
          difficulty: "Medium",
          description: "Return the cheapest price from src to dst with at most k stops, or -1 if no such route exists.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Cost to Reach Destination in Time (LC 1928)",
          url: cleanUrl("https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/"),
          difficulty: "Hard",
          description: "Find the minimum passing fee to reach city n - 1 within maxTime minutes using constrained Dijkstra.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Cheapest Flights Within K Stops",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/cheapest-flights-within-k-stops/1"),
          difficulty: "Medium",
          description: "Find the cheapest flight cost from source to destination using at most K intermediate stops.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given \`n\` cities and weighted directed flights \`[from, to, price]\`, find the **cheapest price** from \`src\` to \`dst\` with **at most \`K\` intermediate stops** (or \`-1\` if impossible).

### 💡 Key Takeaways
- **Why Prioritizing by Cost (\`dist\`) Fails Here:**
  - Suppose path A reaches city \`X\` with a cheap cost of \`5\` but uses \`3\` stops, while path B reaches city \`X\` with a slightly higher cost of \`7\` but uses only \`1\` stop.
  - If we prioritize by minimum cost first, path A overwrites \`dist[X] = 5\`, blocking path B (\`7 > 5\`). Later, path A runs out of allowed stops (\`> K\`) before reaching \`dst\`, whereas path B could have reached \`dst\` within \`K\` stops!
- **The Solution: Prioritize by \`stops\` Using a Plain Queue (\`{stops, {node, cost}}\`):**
  - Because \`stops\` increases by \`+1\` at every step, a plain FIFO \`queue\` processes states in strictly increasing order of \`stops\` (\`0\` stops, then \`1\` stop, ..., up to \`K\` stops)!
  - If \`stops > K\`, \`continue\` without expanding further.
- **Complexity:** \`O(E)\` Time (where \`E = flights.size()\`) and \`O(V + E)\` Space.

### 💻 Cheapest Flights Within K Stops Blueprint
\`\`\`cpp
int findCheapestPrice(int n, vector<vector<int>> &flights, int src, int dst, int K) {
    vector<pair<int, int>> adj[n];
    for (const auto &f : flights) {
        adj[f[0]].push_back({f[1], f[2]});
    }

    // Plain FIFO queue ordered naturally by stops: {stops, {node, cost}}
    queue<pair<int, pair<int, int>>> q;
    q.push({0, {src, 0}});
    vector<int> dist(n, 1e9);
    dist[src] = 0;

    while (!q.empty()) {
        auto [stops, state] = q.front();
        q.pop();
        int u = state.first, cost = state.second;

        if (stops > K) continue;

        for (auto [v, edgePrice] : adj[u]) {
            if (cost + edgePrice < dist[v] && stops <= K) {
                dist[v] = cost + edgePrice;
                q.push({stops + 1, {v, cost + edgePrice}});
            }
        }
    }

    return (dist[dst] == 1e9) ? -1 : dist[dst];
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using \`dist[u]\` Instead of \`cost\` in \`cost + edgePrice < dist[v]\`:** Because multiple paths with different stop counts can update \`dist[u]\` while earlier states are still in the queue, always add \`edgePrice\` to the popped state's \`cost\`, **not** \`dist[u]\`!`),
      theorySummary: cleanText(`Cheapest Flights Within K Stops:
1. Prioritize queue states by stops (0, 1, ..., K) rather than cost to prevent cheaper paths with high stops from blocking valid paths.
2. State: {stops, {node, cost}}. Relax when cost + edgePrice < dist[v] and stops <= K.
3. If stops > K, continue without expanding.
Complexity: O(E) time, O(V + E) space.`),
    },

    {
      order: 164,
      name: "Bounded Modulo State-Space BFS: Minimum Multiplications to Reach End",
      slug: "dsa-minimum-multiplications-to-reach-end",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Calculate minimum multiplication steps to reach target modulo 100,000 using bounded state-space queue BFS.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 164: Minimum Multiplications to Reach End",
          url: cleanUrl("https://www.youtube.com/watch?v=_BvEJ3VIDWw"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Multiplications to Reach End",
          url: "https://takeuforward.org/data-structure/g-39-minimum-multiplications-to-reach-end/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Minimum Multiplications to reach End",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-multiplications-to-reach-end/1"),
          difficulty: "Medium",
          description: "Find the minimum steps to multiply start by array elements modulo 100000 to reach end.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Operations to Convert Number (LC 2059)",
          url: cleanUrl("https://leetcode.com/problems/minimum-operations-to-convert-number/"),
          difficulty: "Medium",
          description: "Run bounded state-space BFS over [0, 1000] using +, -, and ^ operations with array elements.",
        },
        {
          platform: "LeetCode",
          title: "Broken Calculator (LC 991)",
          url: cleanUrl("https://leetcode.com/problems/broken-calculator/"),
          difficulty: "Medium",
          description: "Explore state transitions to transform startValue into targetValue in minimum operations.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer \`start\`, an integer \`end\`, and an array \`arr\`, in each step you can multiply \`start\` by any element in \`arr\` and take the result **modulo \`100,000\` (\`10^5\`)**. Find the **minimum number of multiplications** needed to reach \`end\`, or \`-1\` if impossible.

### 💡 Key Takeaways
- **Recognizing the Implicit State-Space Graph (\`100,000\` Nodes):**
  - Because every multiplication is taken \`% 100000\`, any state number \`num\` is strictly bounded in the range **\`[0, 99999]\`**!
  - Therefore, there are at most \`100,000\` possible nodes in this graph, and every multiplication step costs \`+1\` operation.
- **Unit-Weight BFS With \`dist[100000]\`:**
  - Initialize \`vector<int> dist(100000, 1e9)\` and set \`dist[start] = 0\`.
  - Push \`{start, 0}\` into a FIFO \`queue<pair<int, int>> q\`.
  - For each popped \`{node, steps}\`, loop through every multiplier \`it\` in \`arr\`:
    - Compute \`nextNum = (node * it) % 100000\`.
    - If \`steps + 1 < dist[nextNum]\`, update \`dist[nextNum] = steps + 1\` and push \`{nextNum, steps + 1}\` (returning \`steps + 1\` immediately if \`nextNum == end\`).
- **Complexity:** \`O(100000 * N)\` Time and \`O(100000)\` Space.

### 💻 Minimum Multiplications to Reach End Blueprint
\`\`\`cpp
int minimumMultiplications(vector<int> &arr, int start, int end) {
    if (start == end) return 0;

    queue<pair<int, int>> q;
    q.push({start, 0});
    vector<int> dist(100000, 1e9);
    dist[start] = 0;
    int mod = 100000;

    while (!q.empty()) {
        auto [node, steps] = q.front();
        q.pop();

        for (int factor : arr) {
            int num = (node * factor) % mod;
            if (steps + 1 < dist[num]) {
                dist[num] = steps + 1;
                if (num == end) return steps + 1;
                q.push({num, steps + 1});
            }
        }
    }
    return -1;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Thinking the State Space Is Infinite:** The \`% 100000\` operation caps the total distinct states at \`100,000\`, which is why a fixed-size array \`dist(100000, 1e9)\` works without hashing!`),
      theorySummary: cleanText(`Minimum Multiplications to Reach End:
1. The modulo 100000 caps the state space at 100,000 nodes [0, 99999].
2. Run unit-weight BFS using dist array of size 100000.
3. For each multiplier in arr: nextNum = (node * factor) % 100000. Relax if steps + 1 < dist[nextNum].
Complexity: O(100000 * N) time, O(100000) space.`),
    },

    {
      order: 165,
      name: "Shortest-Path DP Counting: Number of Ways to Arrive at Destination",
      slug: "dsa-number-of-ways-to-arrive-at-destination",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Count the number of distinct shortest paths from source to destination modulo 10^9 + 7 by combining Dijkstra with dynamic programming.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 165: Number of Ways to Arrive at Destination",
          url: cleanUrl("https://www.youtube.com/watch?v=_-0mx0SmYxA"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Ways to Arrive at Destination",
          url: "https://takeuforward.org/data-structure/g-40-number-of-ways-to-arrive-at-destination/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Ways to Arrive at Destination (LC 1976)",
          url: cleanUrl("https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/"),
          difficulty: "Medium",
          description: "Return the number of ways you can arrive at intersection n - 1 from 0 in the shortest amount of time modulo 10^9 + 7.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number of Ways to Arrive at Destination",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-ways-to-arrive-at-destination/1"),
          difficulty: "Medium",
          description: "Count the total distinct shortest paths from node 0 to node n - 1 in a weighted undirected graph.",
        },
        {
          platform: "LeetCode",
          title: "All Paths From Source to Target (LC 797)",
          url: cleanUrl("https://leetcode.com/problems/all-paths-from-source-to-target/"),
          difficulty: "Medium",
          description: "Contrast enumerating all paths with counting shortest paths via DP + Dijkstra.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an undirected weighted graph of \`n\` intersections (\`0\` to \`n - 1\`), find the **number of distinct shortest paths** from intersection \`0\` to intersection \`n - 1\` modulo \`10^9 + 7\`.

### 💡 Key Takeaways
- **Combining Dijkstra's \`dist[]\` With a DP \`ways[]\` Array:**
  - Maintain \`dist[n]\` initialized to \`LLONG_MAX\` and \`ways[n]\` initialized to \`0\`.
  - Base case at source \`0\`: \`dist[0] = 0\` and **\`ways[0] = 1\`**.
  - When relaxing edge \`u → v\` with weight \`wt\`:
    1. **Strictly Shorter Path Found (\`d + wt < dist[v]\`):**
       - Update \`dist[v] = d + wt\`.
       - Reset ways to match \`u\`: **\`ways[v] = ways[u]\`**!
       - Push \`{dist[v], v}\` into the min-heap.
    2. **Another Equal Shortest Path Found (\`d + wt == dist[v]\`):**
       - Do **not** push \`v\` into the heap again!
       - Simply add \`u\`'s ways into \`v\`: **\`ways[v] = (ways[v] + ways[u]) % MOD\`**!
- **Complexity:** \`O(E log V)\` Time and \`O(V + E)\` Space.

### 💻 Number of Ways to Arrive at Destination Blueprint
\`\`\`cpp
int countPaths(int n, vector<vector<int>> &roads) {
    vector<pair<int, long long>> adj[n];
    for (const auto &r : roads) {
        adj[r[0]].push_back({r[1], r[2]});
        adj[r[1]].push_back({r[0], r[2]});
    }

    priority_queue<pair<long long, int>,
                   vector<pair<long long, int>>,
                   greater<pair<long long, int>>> pq;

    vector<long long> dist(n, LLONG_MAX);
    vector<long long> ways(n, 0);
    long long mod = 1e9 + 7;

    dist[0] = 0;
    ways[0] = 1;
    pq.push({0, 0});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (auto [v, wt] : adj[u]) {
            if (d + wt < dist[v]) {
                dist[v] = d + wt;
                pq.push({dist[v], v});
                ways[v] = ways[u]; // Reset ways to ways[u]
            } else if (d + wt == dist[v]) {
                ways[v] = (ways[v] + ways[u]) % mod; // Accumulate additional shortest paths
            }
        }
    }
    return ways[n - 1] % mod;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **32-Bit Integer Overflow on \`dist\`:** Edge weights in LeetCode 1976 can be up to \`10^9\`, so path distances easily exceed \`2 * 10^9\` (\`INT_MAX\`). Always use **\`long long\`** and **\`LLONG_MAX\`** for \`dist\` and the priority queue!`),
      theorySummary: cleanText(`Number of Ways to Arrive at Destination:
1. Maintain dist[n] and ways[n] with ways[0] = 1.
2. If d + wt < dist[v]: dist[v] = d + wt, ways[v] = ways[u], push to min-heap.
3. If d + wt == dist[v]: ways[v] = (ways[v] + ways[u]) % MOD without pushing to heap again.
4. Use long long for dist to prevent integer overflow.
Complexity: O(E log V) time, O(V + E) space.`),
    },

    // =========================================================================
    // SUBTRACK: Module 25: Negative-Weight Shortest Paths, All-Pairs Shortest Paths & Minimum Spanning Trees (Topics 166–170)
    // =========================================================================
    {
      order: 166,
      name: "Sequential Edge Relaxation & Negative Cycle Detection: Bellman-Ford Algorithm",
      slug: "dsa-bellman-ford-algorithm-negative-cycles",
      subtrack: "Module 25: Negative-Weight Shortest Paths, All-Pairs Shortest Paths & Minimum Spanning Trees",
      description: "Compute shortest paths in graphs with negative edge weights and detect negative weight cycles via V - 1 edge relaxations.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 166: Bellman Ford Algorithm",
          url: cleanUrl("https://www.youtube.com/watch?v=0vVofAhAYjc"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Bellman Ford Algorithm",
          url: "https://takeuforward.org/data-structure/bellman-ford-algorithm-g-41/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Distance from the Source (Bellman-Ford Algorithm)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1"),
          difficulty: "Medium",
          description: "Compute shortest paths from source S to all vertices and detect negative weight cycles.",
        },
        {
          platform: "LeetCode",
          title: "Cheapest Flights Within K Stops (LC 787)",
          url: cleanUrl("https://leetcode.com/problems/cheapest-flights-within-k-stops/"),
          difficulty: "Medium",
          description: "Solve K-stop shortest paths using K + 1 iterations of Bellman-Ford edge relaxation.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Negative weight cycle",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/negative-weight-cycle3504/1"),
          difficulty: "Medium",
          description: "Determine whether a directed weighted graph contains a negative weight cycle.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
While Dijkstra's Algorithm fails on graphs with negative edge weights, the **Bellman-Ford Algorithm** computes single-source shortest paths in directed graphs **even with negative weights** and detects **negative weight cycles** (cycles whose total edge weight sum is \`< 0\`).

### 💡 Key Takeaways
- **Why Relax All Edges \`V - 1\` Times?**
  - Any simple shortest path in a graph of \`V\` vertices can contain at most **\`V - 1\` edges**.
  - In iteration 1, we are guaranteed to relax the 1st edge of any shortest path; in iteration 2, the 2nd edge; and after **\`V - 1\` full iterations** over all \`E\` edges, all shortest distances are guaranteed to be finalized!
- **How to Detect a Negative Cycle (The \`V\`-th Iteration):**
  - After completing \`V - 1\` iterations, run **one more (\`V\`-th) iteration** over all edges.
  - If **\`dist[u] + wt < dist[v]\`** still holds for any edge on the \`V\`-th pass, a reachable **negative weight cycle** exists—return \`{-1}\`!
- **Complexity:** \`O(V * E)\` Time and \`O(V)\` Space.

### 💻 Bellman-Ford Algorithm Blueprint
\`\`\`cpp
vector<int> bellmanFord(int V, vector<vector<int>> &edges, int S) {
    vector<int> dist(V, 1e8);
    dist[S] = 0;

    // 1. Relax all E edges exactly V - 1 times
    for (int i = 0; i < V - 1; i++) {
        for (const auto &it : edges) {
            int u = it[0], v = it[1], wt = it[2];
            if (dist[u] != 1e8 && dist[u] + wt < dist[v]) {
                dist[v] = dist[u] + wt;
            }
        }
    }

    // 2. N-th relaxation to check for negative weight cycles
    for (const auto &it : edges) {
        int u = it[0], v = it[1], wt = it[2];
        if (dist[u] != 1e8 && dist[u] + wt < dist[v]) {
            return {-1}; // Negative cycle detected!
        }
    }

    return dist;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Relaxing From Unreachable Nodes (\`dist[u] == 1e8\`):** With negative weights (e.g., \`wt = -5\`), if you don't check \`dist[u] != 1e8\`, an unreachable node's distance will become \`1e8 - 5\`, corrupting \`dist[v]\`!`),
      theorySummary: cleanText(`Bellman-Ford Algorithm:
1. Relax all E edges V - 1 times from source S.
2. Any simple shortest path contains at most V - 1 edges.
3. Run V-th pass: if any edge can still be relaxed (dist[u] + wt < dist[v]), a negative cycle exists.
Complexity: O(V * E) time, O(V) space.`),
    },

    {
      order: 167,
      name: "All-Pairs Dynamic Programming: Floyd-Warshall Algorithm",
      slug: "dsa-floyd-warshall-algorithm-all-pairs-shortest-path",
      subtrack: "Module 25: Negative-Weight Shortest Paths, All-Pairs Shortest Paths & Minimum Spanning Trees",
      description: "Compute shortest distances between all vertex pairs and detect negative cycles using the Floyd-Warshall dynamic programming algorithm.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 167: Floyd Warshall Algorithm",
          url: cleanUrl("https://www.youtube.com/watch?v=YbY8cVwWAvw"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Floyd Warshall Algorithm",
          url: "https://takeuforward.org/data-structure/floyd-warshall-algorithm-g-42/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Floyd Warshall",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1"),
          difficulty: "Medium",
          description: "Find the shortest distances between every pair of vertices in a given edge-weighted directed graph.",
        },
        {
          platform: "LeetCode",
          title: "Course Schedule IV (LC 1462)",
          url: cleanUrl("https://leetcode.com/problems/course-schedule-iv/"),
          difficulty: "Medium",
          description: "Compute all-pairs transitive closure reachability using the Floyd-Warshall triple loop.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Cost to Convert String I (LC 2976)",
          url: cleanUrl("https://leetcode.com/problems/minimum-cost-to-convert-string-i/"),
          difficulty: "Medium",
          description: "Run Floyd-Warshall over the 26 lowercase characters to find minimum conversion costs between all letter pairs.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Unlike Dijkstra and Bellman-Ford (which are *single-source* shortest path algorithms), the **Floyd-Warshall Algorithm** is a **Multi-Source (All-Pairs) Shortest Path** algorithm that computes the shortest distance between **every pair of vertices \`(i, j)\`** using Dynamic Programming in **\`O(V³)\`** time.

### 💡 Key Takeaways
- **The Intermediate Vertex Recurrence (\`via\` Loop on the Outside):**
  - Try routing the path from \`i\` to \`j\` through every possible intermediate vertex \`via\` (\`0\` to \`V - 1\`):
    **\`matrix[i][j] = min(matrix[i][j], matrix[i][via] + matrix[via][j])\`**.
  - **Crucial Loop Order:** The \`via\` (or \`k\`) loop **must** be the outermost loop (\`for via -> for i -> for j\`)!
- **How to Detect a Negative Cycle With Floyd-Warshall:**
  - The distance from any vertex \`i\` to itself is initially \`matrix[i][i] = 0\`.
  - If after running Floyd-Warshall, **\`matrix[i][i] < 0\`** for any vertex \`i\`, then a negative cycle exists!
- **Complexity:** \`O(V³)\` Time and \`O(V²)\` Space (in-place on the adjacency matrix).

### 💻 Floyd-Warshall Algorithm Blueprint
\`\`\`cpp
void floydWarshall(vector<vector<int>> &matrix) {
    int n = matrix.size();

    // 1. Replace -1 (no edge) with 1e9 and ensure diagonal is 0
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == -1) matrix[i][j] = 1e9;
            if (i == j) matrix[i][j] = 0;
        }
    }

    // 2. Relax all pairs (i, j) via each intermediate vertex k
    for (int via = 0; via < n; via++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][via] != 1e9 && matrix[via][j] != 1e9) {
                    matrix[i][j] = min(matrix[i][j], matrix[i][via] + matrix[via][j]);
                }
            }
        }
    }

    // 3. Restore unreachable cells back to -1
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == 1e9) matrix[i][j] = -1;
        }
    }
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Putting the \`via\` (\`k\`) Loop Inside \`i\` and \`j\`:** Putting \`via\` as the innermost loop only checks single-hop intermediates \`i -> via -> j\` instead of building multi-hop shortest paths dynamically. **\`via\` must always be the outermost loop!**`),
      theorySummary: cleanText(`Floyd-Warshall Algorithm (All-Pairs Shortest Path):
1. Dynamic programming recurrence: matrix[i][j] = min(matrix[i][j], matrix[i][via] + matrix[via][j]).
2. via loop must be outermost.
3. If matrix[i][i] < 0 after completion, a negative cycle exists.
Complexity: O(V^3) time, O(V^2) space.`),
    },

    {
      order: 168,
      name: "All-Pairs Threshold Filtering: Find the City With the Smallest Number of Neighbors at a Threshold Distance",
      slug: "dsa-find-city-with-smallest-number-of-neighbors-threshold-distance",
      subtrack: "Module 25: Negative-Weight Shortest Paths, All-Pairs Shortest Paths & Minimum Spanning Trees",
      description: "Filter all-pairs distance matrices within a distance threshold to identify the least connected city with tie-breaking.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 168: Find the City With the Smallest Number of Neighbours at a Threshold Distance",
          url: cleanUrl("https://www.youtube.com/watch?v=PwMVNSJ5SLI"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find the City With the Smallest Number of Neighbours at a Threshold Distance",
          url: "https://takeuforward.org/data-structure/find-the-city-with-the-smallest-number-of-neighbours-at-a-threshold-distance-g-43/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance (LC 1334)",
          url: cleanUrl("https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/"),
          difficulty: "Medium",
          description: "Return the city with the smallest number of reachable cities within distanceThreshold (breaking ties by largest city index).",
        },
        {
          platform: "GeeksforGeeks",
          title: "City With the Smallest Number of Neighbors at a Threshold Distance",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/1"),
          difficulty: "Medium",
          description: "Apply Floyd-Warshall or V runs of Dijkstra to find the least-connected city within a distance threshold.",
        },
        {
          platform: "LeetCode",
          title: "Number of Possible Sets of Closing Branches (LC 2959)",
          url: cleanUrl("https://leetcode.com/problems/number-of-possible-sets-of-closing-branches/"),
          difficulty: "Hard",
          description: "Use Floyd-Warshall on subsets of nodes to verify maximum distance thresholds.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given \`n\` cities (\`0\` to \`n - 1\`), undirected weighted \`edges\`, and a \`distanceThreshold\`, find the city that can reach the **smallest number of other cities** with a shortest-path distance **\`<= distanceThreshold\`**. If multiple cities tie, return the city with the **greatest number (largest index)**.

### 💡 Key Takeaways
- **Step 1: Compute All-Pairs Shortest Paths (\`dist[n][n]\`):**
  - Build the \`n x n\` distance matrix (\`dist[i][i] = 0\`, edges filled symmetrically) and run the **Floyd-Warshall Algorithm** (or run Dijkstra \`n\` times, once from each city).
- **Step 2: Count Reachable Cities & Break Ties with \`<=\`:**
  - For each city \`city\` from \`0\` to \`n - 1\`, count how many cities \`adjCity\` satisfy \`dist[city][adjCity] <= distanceThreshold\`.
  - If \`cnt <= cntMax\`, update \`cntMax = cnt\` and \`cityNo = city\`.
  - Using **\`<=\`** (instead of \`<\`) while iterating \`city\` from \`0\` to \`n - 1\` automatically breaks ties in favor of the **larger city index**!
- **Complexity:** \`O(N³)\` Time and \`O(N²)\` Space.

### 💻 Find the City (Floyd-Warshall) Blueprint
\`\`\`cpp
int findTheCity(int n, vector<vector<int>> &edges, int distanceThreshold) {
    vector<vector<int>> dist(n, vector<int>(n, 1e9));
    for (int i = 0; i < n; i++) dist[i][i] = 0;

    for (const auto &e : edges) {
        int u = e[0], v = e[1], wt = e[2];
        dist[u][v] = wt;
        dist[v][u] = wt;
    }

    // Floyd-Warshall all-pairs shortest paths
    for (int via = 0; via < n; via++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][via] != 1e9 && dist[via][j] != 1e9) {
                    dist[i][j] = min(dist[i][j], dist[i][via] + dist[via][j]);
                }
            }
        }
    }

    int minReachable = n + 1;
    int bestCity = -1;

    for (int city = 0; city < n; city++) {
        int cnt = 0;
        for (int adjCity = 0; adjCity < n; adjCity++) {
            if (dist[city][adjCity] <= distanceThreshold) {
                cnt++;
            }
        }
        // Using <= ensures ties are broken by the largest city index!
        if (cnt <= minReachable) {
            minReachable = cnt;
            bestCity = city;
        }
    }
    return bestCity;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using \`<\` Instead of \`<=\` When Updating \`bestCity\`:** The problem requires returning the city with the **greatest index** if there is a tie. Using \`cnt <= minReachable\` ensures later (larger) indices overwrite earlier ones!`),
      theorySummary: cleanText(`Find the City With the Smallest Number of Neighbors:
1. Compute all-pairs shortest paths using Floyd-Warshall (or V runs of Dijkstra).
2. For each city, count reachable cities with dist <= distanceThreshold.
3. Pick city with minimum count. Break ties in favor of largest index using <=.
Complexity: O(N^3) time, O(N^2) space.`),
    },

    {
      order: 169,
      name: "Spanning Trees & Minimum Cost Connectivity: Minimum Spanning Tree (MST) Theory",
      slug: "dsa-minimum-spanning-tree-theory",
      subtrack: "Module 25: Negative-Weight Shortest Paths, All-Pairs Shortest Paths & Minimum Spanning Trees",
      description: "Understand spanning tree structural invariants (N vertices, N - 1 edges, acyclic connectivity) and MST definitions.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 169: Minimum Spanning Tree - Theory",
          url: cleanUrl("https://www.youtube.com/watch?v=ZSPjZuZWCME"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum Spanning Tree Theory",
          url: "https://takeuforward.org/data-structure/minimum-spanning-tree-mst-theory/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Min Cost to Connect All Points (LC 1584)",
          url: cleanUrl("https://leetcode.com/problems/min-cost-to-connect-all-points/"),
          difficulty: "Medium",
          description: "Find the minimum Manhattan distance cost to connect all 2D points into a single spanning tree.",
        },
        {
          platform: "LeetCode",
          title: "Connecting Cities With Minimum Cost (LC 1135)",
          url: cleanUrl("https://leetcode.com/problems/connecting-cities-with-minimum-cost/"),
          difficulty: "Medium",
          description: "Return the minimum cost to connect all N cities so that there is a path between every pair of cities.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Minimum Spanning Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1"),
          difficulty: "Medium",
          description: "Calculate the sum of weights of the edges of the Minimum Spanning Tree.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an undirected, connected, weighted graph with \`N\` vertices and \`M\` edges:
- A **Spanning Tree** is a subgraph that connects **all \`N\` vertices** using **exactly \`N - 1\` edges** (which guarantees **zero cycles** and a single connected component).
- A **Minimum Spanning Tree (MST)** is the spanning tree that has the **minimum possible total sum of edge weights** among all valid spanning trees of the graph.

### 💡 Key Takeaways
- **Core Properties of Every Spanning Tree:**
  1. Contains **all \`N\` vertices** of the original graph.
  2. Contains **exactly \`N - 1\` edges**.
  3. Is **100% connected** (every vertex can reach every other vertex) and **acyclic** (adding even 1 more edge creates a cycle; removing even 1 edge disconnects the tree).
- **The Two Classical Algorithms to Find an MST:**
  1. **Prim's Algorithm (\`O(E log E)\`):** Greedy node-based expansion starting from a single vertex using a Min-Heap Priority Queue.
  2. **Kruskal's Algorithm (\`O(E log E)\`):** Greedy edge-based sorting combined with the **Disjoint Set (Union-Find)** data structure.

### ⚠️ Common Mistakes to Avoid
- **Confusing Shortest Path Tree (Dijkstra) With Minimum Spanning Tree (Prim/Kruskal):** Dijkstra minimizes the path distance from a specific source \`S\` to each individual node, whereas an MST minimizes the **total sum of all \`N - 1\` edge weights** needed to wire the whole network together!`),
      theorySummary: cleanText(`Minimum Spanning Tree (MST) Theory:
1. A spanning tree connects all N vertices using exactly N - 1 edges with zero cycles.
2. MST minimizes total sum of edge weights among all valid spanning trees.
3. Solved using Prim's Algorithm (min-heap cut expansion) or Kruskal's Algorithm (sorted edges + Disjoint Set).`),
    },

    {
      order: 170,
      name: "Greedy Cut-Edge Selection: Prim's Algorithm for Minimum Spanning Tree",
      slug: "dsa-prims-algorithm-minimum-spanning-tree",
      subtrack: "Module 25: Negative-Weight Shortest Paths, All-Pairs Shortest Paths & Minimum Spanning Trees",
      description: "Construct Minimum Spanning Trees greedily using min-heap cut-edge selection in O(E log E) time.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 170: Prim's Algorithm - Minimum Spanning Tree - MST",
          url: cleanUrl("https://www.youtube.com/watch?v=mJcZjjKzeqk"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Prim's Algorithm Minimum Spanning Tree",
          url: "https://takeuforward.org/data-structure/prims-algorithm-minimum-spanning-tree-c-and-java-g-45/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Minimum Spanning Tree (Prim's Algorithm)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1"),
          difficulty: "Medium",
          description: "Find the sum of weights of the edges of the Minimum Spanning Tree using Prim's Algorithm.",
        },
        {
          platform: "LeetCode",
          title: "Min Cost to Connect All Points (LC 1584)",
          url: cleanUrl("https://leetcode.com/problems/min-cost-to-connect-all-points/"),
          difficulty: "Medium",
          description: "Apply Prim's min-heap algorithm to connect N points on a 2D plane with minimum total Manhattan cost.",
        },
        {
          platform: "LeetCode",
          title: "Optimize Water Distribution in a Village (LC 1168)",
          url: cleanUrl("https://leetcode.com/problems/optimize-water-distribution-in-a-village/"),
          difficulty: "Hard",
          description: "Add a virtual well node 0 and find the Minimum Spanning Tree using Prim's or Kruskal's algorithm.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Prim's Algorithm** builds a **Minimum Spanning Tree (MST)** greedily by starting at an arbitrary node (\`0\`) and repeatedly picking the **minimum-weight edge** that connects a visited MST node to an unvisited node using a **Min-Heap Priority Queue**.

### 💡 Key Takeaways
- **Critical Difference From BFS — Mark Visited ONLY When POPPING:**
  - In standard BFS, we mark a node visited as soon as we *push* it into the queue.
  - In **Prim's Algorithm**, multiple edges of different weights (\`10\`, \`4\`, \`2\`) can point to the same unvisited node \`v\`. If you mark \`v\` visited when pushing \`{10, v}\`, you will ignore the cheaper \`{2, v}\` edge later!
  - **Rule:** Never mark \`seen[v] = 1\` when pushing! Only mark **\`seen[u] = 1\` at the exact moment \`u\` is POPPED from \`pq.top()\`** (after checking \`if (seen[u] == 1) continue;\`).
- **Algorithm Steps (\`O(E log E)\` Time, \`O(V + E)\` Space):**
  1. Initialize \`seen[V] = {0}\`, \`mstSum = 0\`, and push \`{0, 0}\` (\`{weight, node}\`) into the min-heap \`pq\`. (If you also need the MST edges, store \`{weight, {node, parent}}\`).
  2. While \`!pq.empty()\`:
     - Pop \`{wt, u} = pq.top()\`.
     - If \`seen[u] == 1\`, \`continue\` (already part of the MST).
     - Mark **\`seen[u] = 1\`** and add **\`mstSum += wt\`**.
     - Loop through all neighbors \`{v, edW}\` in \`adj[u]\`: if \`!seen[v]\`, push \`{edW, v}\` into \`pq\`.

### 💻 Prim's Algorithm (MST Weight Sum) Blueprint
\`\`\`cpp
int spanningTreePrims(int V, vector<vector<int>> adj[]) {
    // Min-heap storing {edgeWeight, node}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> seen(V, 0);

    pq.push({0, 0}); // Start at node 0 with weight 0
    int mstSum = 0;

    while (!pq.empty()) {
        auto [wt, u] = pq.top();
        pq.pop();

        // Skip if node u is already included in the MST
        if (seen[u] == 1) continue;

        // Include node u in the MST now!
        seen[u] = 1;
        mstSum += wt;

        for (const auto &edge : adj[u]) {
            int v = edge[0];
            int edW = edge[1];
            if (!seen[v]) {
                pq.push({edW, v});
            }
        }
    }
    return mstSum;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Marking \`seen[v] = 1\` Inside the \`for\` Loop:** Marking \`seen[v] = 1\` when pushing into the priority queue locks in the *first* edge seen to \`v\` rather than the *minimum-weight* edge to \`v\`! Always mark \`seen[u] = 1\` **only after popping \`u\` from \`pq.top()\`**.`),
      theorySummary: cleanText(`Prim's Algorithm (MST):
1. Greedily expand MST using min-heap storing {weight, node}.
2. Mark seen[u] = 1 ONLY upon popping from heap (skip if already seen).
3. Add weight to mstSum and push unvisited neighbors {edgeWeight, neighbor} to heap.
Complexity: O(E log E) time, O(V + E) space.`),
    },
  ];

  // 4. Upsert topics and nested resources
  console.log("\n📦 Upserting 10 Batch 17 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch17Topics) {
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
         name, slug, subtrack, description,
         summary_markdown, theory_summary, video_links, doc_links, practice_items
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         subtrack = EXCLUDED.subtrack,
         description = EXCLUDED.description,
         summary_markdown = EXCLUDED.summary_markdown,
         theory_summary = EXCLUDED.theory_summary,
         video_links = EXCLUDED.video_links,
         doc_links = EXCLUDED.doc_links,
         practice_items = EXCLUDED.practice_items
       RETURNING id, name, slug;`,
      [
        topic.name,
        topic.slug,
        topic.subtrack,
        topic.description,
        topic.summaryMarkdown,
        topic.theorySummary,
        JSON.stringify(cleanedVideoLinks),
        JSON.stringify(cleanedDocLinks),
        JSON.stringify(cleanedPracticeItems),
      ]
    );

    const seededTopic = upsertRes.rows[0];
    topicIdMap.set(topic.slug, seededTopic);
    console.log(`  ✅ Upserted Topic [${topic.order}]: "${seededTopic.name}" (ID: ${seededTopic.id})`);

    // Clean old resources for idempotency
    await pool.query("DELETE FROM resources WHERE topic_id = $1", [seededTopic.id]);

    // Primary Video Resource
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

    // Primary Doc Resource
    if (cleanedDocLinks && cleanedDocLinks.length > 0) {
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

  // 5. Update track_topics: Link Batch 17 Topics to topic_order 161 through 170
  console.log("\n🔄 Linking Batch 17 topics to 'problem-solving-dsa-sql' (orders 161..170)...");

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

  // Link Batch 17 Topics (orders 161..170)
  for (const topicDef of batch17Topics) {
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

  console.log("\n🎉 DSA Batch 17 (Lectures 161–170) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch17()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch17;
