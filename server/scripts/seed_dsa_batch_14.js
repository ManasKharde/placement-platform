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

const seedDsaBatch14 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 14 (Lectures 131–140) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 14 Topics (Lectures 131–140)
  const batch14Topics = [
    // =========================================================================
    // SUBTRACK: Module 21: Graph Theory Foundations, Representations & Traversals (Topics 131–135)
    // =========================================================================
    {
      order: 131,
      name: "Recursive Depth-First Exploration: Depth-First Search (DFS) in Graphs",
      slug: "dsa-depth-first-search-dfs-in-graphs",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Explore graphs deeply using recursive backtracking with a visited array in O(V + 2E) time.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 131: Depth First Search (DFS) in Graph",
          url: cleanUrl("https://www.youtube.com/watch?v=Qzf1a--rhp8"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Depth First Search (DFS)",
          url: "https://takeuforward.org/data-structure/depth-first-search-dfs/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "DFS of Graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1"),
          difficulty: "Easy",
          description: "Return a list containing the DFS traversal of a connected undirected graph starting from vertex 0.",
        },
        {
          platform: "LeetCode",
          title: "Keys and Rooms (LC 841)",
          url: cleanUrl("https://leetcode.com/problems/keys-and-rooms/"),
          difficulty: "Medium",
          description: "Use recursive DFS to check if all rooms in a directed graph can be visited starting from room 0.",
        },
        {
          platform: "LeetCode",
          title: "Find if Path Exists in Graph (LC 1971)",
          url: cleanUrl("https://leetcode.com/problems/find-if-path-exists-in-graph/"),
          difficulty: "Easy",
          description: "Apply recursive DFS with a visited array to verify reachability between two vertices.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Depth-First Search (DFS)** explores a graph by diving as deep as possible along each branch before backtracking. Starting at a source vertex, it recursively visits an unvisited neighbor, explores that neighbor's entire connected path to the bottom, and then backtracks to explore remaining neighbors.

### 💡 Key Takeaways
- **Core Recursive Mechanism:**
  1. Maintain a \`seen\` (visited) array initialized to \`0\` so vertices are never processed twice.
  2. Upon entering \`explore(u)\`, mark \`seen[u] = 1\` and append \`u\` to the result list.
  3. Loop through each neighbor \`v\` in \`adjList[u]\`: if \`!seen[v]\`, recursively call \`explore(v)\`.
- **Time & Space Complexity:**
  - **Time Complexity:** \`O(V + 2E)\` for an undirected graph (each vertex is visited once, and all incident edges summing to total degree \`2E\` are checked) or \`O(V + E)\` for a directed graph.
  - **Space Complexity:** \`O(V)\` for the \`seen\` array, output list, and worst-case recursion call stack depth on a skewed graph.

### 💻 Graph DFS Blueprint
\`\`\`cpp
void exploreDFS(int curr, const vector<int> adjList[], vector<int> &seen, vector<int> &order) {
    seen[curr] = 1;
    order.push_back(curr);

    for (int nextNode : adjList[curr]) {
        if (!seen[nextNode]) {
            exploreDFS(nextNode, adjList, seen, order);
        }
    }
}

vector<int> dfsTraversal(int numVertices, vector<int> adjList[]) {
    vector<int> seen(numVertices, 0);
    vector<int> order;
    exploreDFS(0, adjList, seen, order);
    return order;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Pass Vectors by Reference:** Always pass seen and order by reference (&) into the recursive helper; passing by value copies the arrays on every call and breaks visited tracking!`),
      theorySummary: cleanText(`Depth-First Search (DFS) in Graphs:
1. Recursive traversal exploring as deep as possible along each branch before backtracking.
2. Mark current node visited, add to traversal list, and recurse on each unvisited neighbor.
3. Time Complexity: O(V + 2E) for undirected graphs, O(V + E) for directed graphs.
4. Space Complexity: O(V) for visited array and recursive call stack.`),
    },

    {
      order: 132,
      name: "Disjoint Subgraph Counting: Number of Provinces via Connected Components",
      slug: "dsa-number-of-provinces-connected-components",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Count independent connected components (provinces) in an undirected graph represented as an adjacency matrix.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 132: Number of Provinces",
          url: cleanUrl("https://www.youtube.com/watch?v=ACzkVtewUYA"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Provinces",
          url: "https://takeuforward.org/data-structure/number-of-provinces/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Provinces (LC 547)",
          url: cleanUrl("https://leetcode.com/problems/number-of-provinces/"),
          difficulty: "Medium",
          description: "Given an N x N adjacency matrix of direct connections, return the total number of provinces.",
        },
        {
          platform: "LeetCode",
          title: "Count Unreachable Pairs of Nodes in an Undirected Graph (LC 2316)",
          url: cleanUrl("https://leetcode.com/problems/count-unreachable-pairs-of-nodes-in-an-undirected-graph/"),
          difficulty: "Medium",
          description: "Find the size of each connected component using DFS/BFS to count pairs of nodes in different components.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number of Provinces",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-provinces/1"),
          difficulty: "Medium",
          description: "Count the number of connected components in an undirected graph represented as an adjacency matrix.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A **Province** is a group of directly or indirectly connected vertices with no connections to vertices outside the group. Finding the total number of provinces is equivalent to counting the **number of connected components** in an undirected graph.

### 💡 Key Takeaways
- **Counting Starting Points:**
  - A single DFS or BFS call starting at vertex \`u\` automatically marks every vertex in \`u\`'s province as visited.
  - Therefore, if we iterate \`i\` from \`0\` to \`V - 1\` and trigger a traversal only when \`!seen[i]\`, the **exact number of times we initiate a new traversal** equals the total number of provinces!
- **Time & Space Complexity:**
  - **Time Complexity:** \`O(V) + O(V + 2E)\` for the traversal loop (plus \`O(V²)\` if converting an input \`V x V\` adjacency matrix into an adjacency list).
  - **Space Complexity:** \`O(V)\` for the \`seen\` array and recursion stack.

### 💻 Number of Provinces Blueprint
\`\`\`cpp
void markComponent(int u, const vector<vector<int>> &matrix, vector<int> &seen) {
    seen[u] = 1;
    for (int v = 0; v < matrix.size(); v++) {
        if (matrix[u][v] == 1 && !seen[v]) {
            markComponent(v, matrix, seen);
        }
    }
}

int countProvinces(vector<vector<int>> &isConnected) {
    int n = isConnected.size();
    vector<int> seen(n, 0);
    int provinces = 0;

    for (int i = 0; i < n; i++) {
        if (!seen[i]) {
            provinces++; // Found a new unvisited province
            markComponent(i, isConnected, seen);
        }
    }
    return provinces;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Assuming Complexity is O(V * (V + 2E)):** The outer loop checks seen[i] V times, but the inner DFS only visits each vertex and edge once across the entire execution, so traversal time sums to O(V + 2E), not a product!`),
      theorySummary: cleanText(`Number of Provinces (Connected Components):
1. A province is an isolated connected component.
2. Maintain seen array of size V.
3. Loop i from 0 to V - 1: if !seen[i], increment province counter and trigger DFS/BFS to visit the entire component.
Complexity: O(V^2) for matrix representation, O(V) space.`),
    },

    {
      order: 133,
      name: "2D Grid Component Traversal: Number of Islands (8-Directional & 4-Directional)",
      slug: "dsa-number-of-islands-connected-components-in-grid",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Count distinct land components in 2D binary grids across 4-directional and 8-directional neighbor connection models.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 133: Number of Islands | Number of Connected Components in Grid",
          url: cleanUrl("https://www.youtube.com/watch?v=muncqlKJrH0"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Islands",
          url: "https://takeuforward.org/data-structure/number-of-islands/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Islands (LC 200)",
          url: cleanUrl("https://leetcode.com/problems/number-of-islands/"),
          difficulty: "Medium",
          description: "Count the number of 4-directionally connected land islands in an M x N binary grid.",
        },
        {
          platform: "LeetCode",
          title: "Max Area of Island (LC 695)",
          url: cleanUrl("https://leetcode.com/problems/max-area-of-island/"),
          difficulty: "Medium",
          description: "Traverse each island component in a 2D grid and track the maximum cell count.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Find the number of islands",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1"),
          difficulty: "Medium",
          description: "Count islands where land cells are connected horizontally, vertically, and diagonally (8 directions).",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` grid of \`'1'\`s (land) and \`'0'\`s (water), count the total **Number of Islands**. Treat every \`'1'\` cell as a graph vertex connected to its neighboring \`'1'\` cells—either in **8 directions** (horizontal, vertical, and diagonal, as on GeeksforGeeks) or **4 directions** (as on LeetCode).

### 💡 Key Takeaways
- **Grid as an Implicit Graph:**
  - Scan every cell \`(r, c)\` in the \`N x M\` grid.
  - Whenever you find an unvisited land cell (\`grid[r][c] == '1' && !seen[r][c]\`), increment \`islands++\` and launch a BFS/DFS from \`(r, c)\` to mark all connected land cells in that island.
- **8-Directional Offset Shortcut:**
  - Instead of writing 8 separate \`if\` statements, loop \`dr\` from \`-1\` to \`+1\` and \`dc\` from \`-1\` to \`+1\` to generate all 8 neighbors \`(r + dr, c + dc)\` cleanly!
- **Complexity:** \`O(N * M)\` Time and \`O(N * M)\` Space.

### 💻 Number of Islands (8-Directional BFS) Blueprint
\`\`\`cpp
void exploreIslandBFS(int startR, int startC, const vector<vector<char>> &grid, vector<vector<int>> &seen) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<int, int>> q;
    q.push({startR, startC});
    seen[startR][startC] = 1;

    while (!q.empty()) {
        auto [r, c] = q.front();
        q.pop();

        // Traverse all 8 surrounding directions
        for (int dr = -1; dr <= 1; dr++) {
            for (int dc = -1; dc <= 1; dc++) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] == '1' && !seen[nr][nc]) {
                    seen[nr][nc] = 1;
                    q.push({nr, nc});
                }
            }
        }
    }
}

int numIslands(vector<vector<char>> &grid) {
    int rows = grid.size(), cols = grid[0].size(), islands = 0;
    vector<vector<int>> seen(rows, vector<int>(cols, 0));

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1' && !seen[r][c]) {
                islands++;
                exploreIslandBFS(r, c, grid, seen);
            }
        }
    }
    return islands;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Confusing 4-Directional vs. 8-Directional Rules:** Always read the problem statement carefully—LeetCode 200 only connects 4 cardinal neighbors (dr = {-1, 0, 1, 0}, dc = {0, 1, 0, -1}), whereas GFG connects all 8 neighbors.`),
      theorySummary: cleanText(`Number of Islands in 2D Grid:
1. Scan grid: on finding unvisited land '1', increment island count and launch BFS/DFS.
2. For 4 directions use delta arrays dr={-1,0,1,0}, dc={0,1,0,-1}. For 8 directions loop dr, dc from -1 to 1.
3. Time Complexity: O(N * M), Space Complexity: O(N * M).`),
    },

    {
      order: 134,
      name: "Connected Region Recoloring: Flood Fill Algorithm via 4-Directional DFS/BFS",
      slug: "dsa-flood-fill-algorithm",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Recolor connected regions of matching pixel values using 4-directional DFS with zero redundant visited memory.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 134: Flood Fill Algorithm",
          url: cleanUrl("https://www.youtube.com/watch?v=C-2_uSRli8o"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Flood Fill Algorithm",
          url: "https://takeuforward.org/graph/flood-fill-algorithm/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Flood Fill (LC 733)",
          url: cleanUrl("https://leetcode.com/problems/flood-fill/"),
          difficulty: "Easy",
          description: "Recolor all 4-directionally connected pixels matching the starting pixel's color.",
        },
        {
          platform: "LeetCode",
          title: "Coloring A Border (LC 1034)",
          url: cleanUrl("https://leetcode.com/problems/coloring-a-border/"),
          difficulty: "Medium",
          description: "Use flood-fill traversal to identify and recolor only the boundary cells of a connected component.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Flood fill Algorithm",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/flood-fill-algorithm1856/1"),
          difficulty: "Medium",
          description: "Replace the color of the starting cell and all 4-directionally connected cells of the same initial color.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a 2D \`image\` grid, a starting pixel \`(sr, sc)\`, and a \`targetColor\`, the **Flood Fill Algorithm** recolors \`(sr, sc)\` and all 4-directionally connected pixels that share the **exact same \`startColor\`** into \`targetColor\`.

### 💡 Key Takeaways
- **4-Directional Delta Arrays:**
  - Represent the 4 cardinal moves (Up, Right, Down, Left) using two 4-element arrays:
    \`rowOffsets = {-1, 0, 1, 0}\` and \`colOffsets = {0, 1, 0, -1}\`.
- **Avoiding Separate Visited Memory:**
  - Work on a copy of the grid \`result = image\`.
  - Before recursing into neighbor \`(nr, nc)\`, verify two things:
    1. It originally had the starting color (\`image[nr][nc] == startColor\`).
    2. It has not already been painted with \`targetColor\` (\`result[nr][nc] != targetColor\`)!
- **Complexity:** \`O(N * M)\` Time and \`O(N * M)\` Space.

### 💻 Flood Fill DFS Blueprint
\`\`\`cpp
void paintRegion(int r, int c, vector<vector<int>> &result, const vector<vector<int>> &image,
                 int startColor, int targetColor, const int dr[], const int dc[]) {
    result[r][c] = targetColor;
    int rows = image.size(), cols = image[0].size();

    for (int i = 0; i < 4; i++) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
            image[nr][nc] == startColor && result[nr][nc] != targetColor) {
            paintRegion(nr, nc, result, image, startColor, targetColor, dr, dc);
        }
    }
}

vector<vector<int>> floodFill(vector<vector<int>> &image, int sr, int sc, int newColor) {
    int startColor = image[sr][sc];
    vector<vector<int>> result = image;
    if (startColor == newColor) return result;

    int dr[] = {-1, 0, 1, 0};
    int dc[] = {0, 1, 0, -1};
    paintRegion(sr, sc, result, image, startColor, newColor, dr, dc);
    return result;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Infinite Recursion When startColor == newColor:** If the new color is identical to the starting color, checking result[nr][nc] != targetColor (or returning early when startColor == newColor) is essential to prevent bouncing back and forth forever between two adjacent cells!`),
      theorySummary: cleanText(`Flood Fill Algorithm:
1. Recolor starting cell and all 4-directionally connected cells with the same initial color.
2. Return immediately if startColor == newColor to avoid infinite loops.
3. Recurse in 4 directions if neighbor color == startColor and result != newColor.
Complexity: O(N * M) time, O(N * M) recursion stack.`),
    },

    {
      order: 135,
      name: "Simultaneous Multi-Source BFS: Rotten Oranges (Minimum Time to Rot All Oranges)",
      slug: "dsa-rotten-oranges-multisource-bfs",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Model simultaneous pathogen spread across a 2D grid using multi-source BFS in O(N * M) time.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 135: Rotten Oranges | Min time to rot all oranges",
          url: cleanUrl("https://www.youtube.com/watch?v=yf3oUhkvqA0"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Rotten Oranges",
          url: "https://takeuforward.org/data-structure/rotten-oranges/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Rotting Oranges (LC 994)",
          url: cleanUrl("https://leetcode.com/problems/rotting-oranges/"),
          difficulty: "Medium",
          description: "Return the minimum number of minutes that must elapse until no cell has a fresh orange, or -1 if impossible.",
        },
        {
          platform: "LeetCode",
          title: "Walls and Gates (LC 286)",
          url: cleanUrl("https://leetcode.com/problems/walls-and-gates/"),
          difficulty: "Medium",
          description: "Run multi-source BFS starting from all gates simultaneously to fill each empty room with its nearest gate distance.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Rotten Oranges",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/rotten-oranges2536/1"),
          difficulty: "Medium",
          description: "Determine the minimum time required to rot all fresh oranges in a grid.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In an \`N x M\` grid where \`0\` is an empty cell, \`1\` is a fresh orange, and \`2\` is a rotten orange, every rotten orange rots its 4-directional fresh neighbors in \`1\` unit of time. Find the **minimum time** required for all fresh oranges to rot, or return \`-1\` if any fresh orange remains unreachable.

### 💡 Key Takeaways
- **Why Multi-Source BFS Is Mandatory (Not DFS):**
  - Multiple rotten oranges spread rot **simultaneously** at the exact same pace.
  - DFS explores one path deeply first, overcounting time, whereas **Multi-Source BFS** processes all starting rotten oranges in parallel level-by-level waves!
- **Algorithm Steps (\`O(N * M)\` Time, \`O(N * M)\` Space):**
  1. Scan the grid: push **every initial rotten orange (\`2\`)** into the queue as \`{{r, c}, 0}\` and count total \`freshCount\`.
  2. Pop \`{{r, c}, t}\` from the queue, update \`maxTime = max(maxTime, t)\`, and check all 4 neighbors.
  3. Whenever a fresh neighbor is rotted, push \`{{nr, nc}, t + 1}\` and increment \`rottedCount++\`.
  4. After the queue empties, if \`rottedCount != freshCount\`, return \`-1\`; otherwise return \`maxTime\`.

### 💻 Multi-Source BFS Rotten Oranges Blueprint
\`\`\`cpp
int orangesRotting(vector<vector<int>> &grid) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<pair<int, int>, int>> q;
    vector<vector<int>> state(rows, vector<int>(cols, 0));
    int freshCount = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) {
                q.push({{r, c}, 0});
                state[r][c] = 2;
            } else if (grid[r][c] == 1) {
                freshCount++;
            }
        }
    }

    int maxTime = 0, rottedCount = 0;
    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    while (!q.empty()) {
        auto [coords, t] = q.front();
        q.pop();
        int r = coords.first, c = coords.second;
        maxTime = max(maxTime, t);

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                grid[nr][nc] == 1 && state[nr][nc] != 2) {
                state[nr][nc] = 2;
                rottedCount++;
                q.push({{nr, nc}, t + 1});
            }
        }
    }
    return (rottedCount == freshCount) ? maxTime : -1;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting Unreachable Fresh Oranges:** An isolated fresh orange surrounded by 0s will never be reached by the queue. Always verify rottedCount == freshCount before returning maxTime!`),
      theorySummary: cleanText(`Rotten Oranges (Multi-Source BFS):
1. Push all initially rotten oranges into BFS queue at time t = 0.
2. Advance level-by-level in 4 directions, incrementing time and counting rotted fresh oranges.
3. Return maxTime if all fresh oranges rotted; otherwise return -1.
Complexity: O(N * M) time, O(N * M) space.`),
    },

    // =========================================================================
    // SUBTRACK: Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms (Topics 136–140)
    // =========================================================================
    {
      order: 136,
      name: "Parent-Tracked Wave Collision: Detect a Cycle in an Undirected Graph Using BFS",
      slug: "dsa-detect-cycle-in-undirected-graph-bfs",
      subtrack: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      description: "Detect cycles in undirected graphs using breadth-first wave collision with explicit parent tracking.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 136: Detect a Cycle in an Undirected Graph using BFS",
          url: cleanUrl("https://www.youtube.com/watch?v=BPlrALf1LDU"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Detect Cycle in an Undirected Graph using BFS",
          url: "https://takeuforward.org/data-structure/detect-cycle-in-an-undirected-graph-using-bfs/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Undirected Graph Cycle",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1"),
          difficulty: "Medium",
          description: "Detect whether an undirected graph with V vertices and E edges contains a cycle.",
        },
        {
          platform: "LeetCode",
          title: "Redundant Connection (LC 684)",
          url: cleanUrl("https://leetcode.com/problems/redundant-connection/"),
          difficulty: "Medium",
          description: "Identify the extra edge that creates a cycle in an undirected tree graph.",
        },
        {
          platform: "LeetCode",
          title: "Graph Valid Tree (LC 261)",
          url: cleanUrl("https://leetcode.com/problems/graph-valid-tree/"),
          difficulty: "Medium",
          description: "Verify that an undirected graph is connected and contains zero cycles.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In an **Undirected Graph**, how do we detect if a cycle exists using **Breadth-First Search (BFS)**? If two separate BFS paths diverge from a starting node and later collide at the **same already-visited vertex**, the graph contains a cycle!

### 💡 Key Takeaways
- **Why We Must Track \`parent\` in the Queue (\`pair<int, int>\`):**
  - Because edges are bidirectional (\`u — v\`), when you move from \`u\` to \`v\`, \`u\` is still in \`v\`'s adjacency list and is already marked visited!
  - Seeing the immediate \`parent\` you just came from is **not** a cycle.
  - A cycle exists **if and only if** a neighbor \`nextNode\` is **already visited AND \`nextNode != parent\`**!
- **Handling Disconnected Components:**
  - Always loop \`i\` from \`0\` to \`V - 1\` and run \`hasCycleBFS(i)\` for every unvisited component.
- **Complexity:** \`O(V + 2E)\` Time and \`O(V)\` Space.

### 💻 Cycle Detection in Undirected Graph (BFS) Blueprint
\`\`\`cpp
bool hasCycleBFS(int startNode, const vector<int> adjList[], vector<int> &seen) {
    queue<pair<int, int>> q; // Stores {currentNode, parentNode}
    q.push({startNode, -1});
    seen[startNode] = 1;

    while (!q.empty()) {
        auto [curr, parent] = q.front();
        q.pop();

        for (int neighbor : adjList[curr]) {
            if (!seen[neighbor]) {
                seen[neighbor] = 1;
                q.push({neighbor, curr});
            } else if (neighbor != parent) {
                // Visited node that is NOT the parent we just came from -> Cycle!
                return true;
            }
        }
    }
    return false;
}

bool isCycle(int V, vector<int> adjList[]) {
    vector<int> seen(V, 0);
    for (int i = 0; i < V; i++) {
        if (!seen[i] && hasCycleBFS(i, adjList, seen)) {
            return true;
        }
    }
    return false;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Flagging neighbor == parent as a Cycle:** Every undirected edge u — v would immediately trigger a false-positive cycle if you don't check neighbor != parent!`),
      theorySummary: cleanText(`Detect Cycle in Undirected Graph (BFS):
1. Push {startNode, -1} into BFS queue and mark visited.
2. For each neighbor: if unvisited, push {neighbor, curr} and mark visited.
3. If neighbor is already visited and neighbor != parent, a cycle is confirmed.
Complexity: O(V + 2E) time, O(V) space.`),
    },

    {
      order: 137,
      name: "Back-Edge Discovery: Detect a Cycle in an Undirected Graph Using DFS",
      slug: "dsa-detect-cycle-in-undirected-graph-dfs",
      subtrack: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      description: "Detect cycles in undirected graphs via recursive DFS back-edge discovery to non-parent ancestors.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 137: Detect a Cycle in an Undirected Graph using DFS",
          url: cleanUrl("https://www.youtube.com/watch?v=zQ3zgFypzX4"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Detect Cycle in an Undirected Graph using DFS",
          url: "https://takeuforward.org/data-structure/detect-cycle-in-an-undirected-graph-using-dfs/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Detect Cycles in 2D Grid (LC 1559)",
          url: cleanUrl("https://leetcode.com/problems/detect-cycles-in-2d-grid/"),
          difficulty: "Medium",
          description: "Use parent-tracked DFS to detect cycles of same-character cells in a 2D grid.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Undirected Graph Cycle (DFS)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1"),
          difficulty: "Medium",
          description: "Implement recursive DFS cycle detection across all connected components.",
        },
        {
          platform: "LeetCode",
          title: "Graph Valid Tree (LC 261)",
          url: cleanUrl("https://leetcode.com/problems/graph-valid-tree/"),
          difficulty: "Medium",
          description: "Use DFS cycle detection and component counting to validate a tree.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
To detect a cycle in an **Undirected Graph** using **Depth-First Search (DFS)**, we pass \`(currNode, parentNode)\` down the recursion stack. If our DFS path encounters a neighbor that is **already visited and is not \`parentNode\`**, we have looped back to an ancestor in the current component—proving a cycle exists!

### 💡 Key Takeaways
- **Recursive State \`(curr, parent)\`:**
  1. Mark \`seen[curr] = 1\`.
  2. For each \`neighbor\` in \`adjList[curr]\`:
     - If \`!seen[neighbor]\`: recursively call \`hasCycleDFS(neighbor, curr)\`. If that call returns \`true\`, immediately propagate \`true\` up the call stack!
     - Else if \`neighbor != parent\`: we hit a visited node that isn't our direct parent—return \`true\`!
  3. If all neighbors finish without finding a cycle, return \`false\`.
- **Complexity:** \`O(V + 2E)\` Time and \`O(V)\` Space.

### 💻 Cycle Detection in Undirected Graph (DFS) Blueprint
\`\`\`cpp
bool hasCycleDFS(int curr, int parent, const vector<int> adjList[], vector<int> &seen) {
    seen[curr] = 1;

    for (int neighbor : adjList[curr]) {
        if (!seen[neighbor]) {
            if (hasCycleDFS(neighbor, curr, adjList, seen)) {
                return true; // Propagate cycle detection upward immediately
            }
        } else if (neighbor != parent) {
            return true;     // Back-edge to an already-visited non-parent node
        }
    }
    return false;
}

bool isCycle(int V, vector<int> adjList[]) {
    vector<int> seen(V, 0);
    for (int i = 0; i < V; i++) {
        if (!seen[i]) {
            if (hasCycleDFS(i, -1, adjList, seen)) return true;
        }
    }
    return false;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Writing return hasCycleDFS(...) Unconditionally:** Never write return hasCycleDFS(neighbor, curr, ...) directly inside the for loop! If the first branch returns false, you must continue checking the remaining neighbors—only return early when hasCycleDFS(...) == true!`),
      theorySummary: cleanText(`Detect Cycle in Undirected Graph (DFS):
1. In recursive DFS, pass (curr, parent).
2. For each neighbor: if unvisited, recurse; if returned true, propagate true.
3. If visited and neighbor != parent, back-edge detected -> cycle exists.
Complexity: O(V + 2E) time, O(V) space.`),
    },

    {
      order: 138,
      name: "Manhattan Distance Wavefront: Distance of Nearest Cell Having 1 (0/1 Matrix)",
      slug: "dsa-distance-of-nearest-cell-having-1-01-matrix",
      subtrack: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      description: "Compute shortest distances to nearest target cells across a 2D matrix using reverse multi-source BFS.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 138: Distance of nearest cell having 1 | 0/1 Matrix",
          url: cleanUrl("https://www.youtube.com/watch?v=edXdVwkYHF8"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Distance of Nearest Cell Having 1",
          url: "https://takeuforward.org/data-structure/distance-of-nearest-cell-having-1/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "01 Matrix (LC 542)",
          url: cleanUrl("https://leetcode.com/problems/01-matrix/"),
          difficulty: "Medium",
          description: "Return the distance of the nearest 0 for each cell in a binary matrix using multi-source BFS.",
        },
        {
          platform: "LeetCode",
          title: "As Far from Land as Possible (LC 1162)",
          url: cleanUrl("https://leetcode.com/problems/as-far-from-land-as-possible/"),
          difficulty: "Medium",
          description: "Push all land cells into a BFS queue to find the water cell with maximum distance to the nearest land.",
        },
        {
          platform: "LeetCode",
          title: "Map of Highest Peak (LC 1765)",
          url: cleanUrl("https://leetcode.com/problems/map-of-highest-peak/"),
          difficulty: "Medium",
          description: "Assign heights starting from all water cells at height 0 using multi-source BFS.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` binary grid, find the Manhattan distance (\`|r1 - r2| + |c1 - c2|\`) to the **nearest \`1\`** for every cell in the grid. (Note: LeetCode 542 "01 Matrix" asks the exact mirror question: distance to the nearest \`0\`).

### 💡 Key Takeaways
- **Reverse Multi-Source BFS Intuition:**
  - Instead of running a separate BFS from every \`0\` to find its nearest \`1\` (which takes \`O((N * M)²)\` time), **start from all \`1\`s simultaneously** at distance \`0\`!
  - Push every cell \`(r, c)\` that contains a \`1\` into the queue as \`{{r, c}, 0}\` and mark it visited.
  - Expand outward 1 step at a time in 4 directions: the first time the wavefront reaches any \`0\` cell at step \`d\`, \`d\` is guaranteed to be its shortest distance to the nearest \`1\`!
- **Complexity:** \`O(N * M)\` Time and \`O(N * M)\` Space.

### 💻 Nearest Cell Distance (Multi-Source BFS) Blueprint
\`\`\`cpp
vector<vector<int>> nearestOneDistance(vector<vector<int>> &grid) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> seen(rows, vector<int>(cols, 0));
    vector<vector<int>> dist(rows, vector<int>(cols, 0));
    queue<pair<pair<int, int>, int>> q;

    // 1. Push all target cells (1s) as starting sources with distance 0
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) {
                q.push({{r, c}, 0});
                seen[r][c] = 1;
            }
        }
    }

    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    // 2. Expand wavefront step by step
    while (!q.empty()) {
        auto [coords, steps] = q.front();
        q.pop();
        int r = coords.first, c = coords.second;
        dist[r][c] = steps;

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr][nc]) {
                seen[nr][nc] = 1;
                q.push({{nr, nc}, steps + 1});
            }
        }
    }
    return dist;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Running BFS From Each 0 Individually:** Starting a fresh BFS from every 0 cell causes Time Limit Exceeded (O((N*M)²)). Always push all sources into a single queue upfront so each cell is visited only once!`),
      theorySummary: cleanText(`Distance of Nearest Cell Having 1 (0/1 Matrix):
1. Push all target cells (1s) into BFS queue at distance 0 and mark visited.
2. Run multi-source BFS outward in 4 directions, recording steps for each unvisited cell.
3. Time Complexity: O(N * M), Space Complexity: O(N * M).`),
    },

    {
      order: 139,
      name: "Boundary-Inward Flood Protection: Surrounded Regions (Replace O's With X's)",
      slug: "dsa-surrounded-regions-replace-os-with-xs",
      subtrack: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      description: "Capture interior surrounded regions by preserving boundary-connected components using inward flood traversal.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 139: Surrounded Regions | Replace O's with X's",
          url: cleanUrl("https://www.youtube.com/watch?v=BtdgAys4yMk"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Surrounded Regions | Replace O's with X's",
          url: "https://takeuforward.org/data-structure/surrounded-regions-replace-os-with-xs/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Surrounded Regions (LC 130)",
          url: cleanUrl("https://leetcode.com/problems/surrounded-regions/"),
          difficulty: "Medium",
          description: "Capture all regions of 'O's that are 4-directionally surrounded by 'X's and flip them to 'X'.",
        },
        {
          platform: "LeetCode",
          title: "Number of Closed Islands (LC 1254)",
          url: cleanUrl("https://leetcode.com/problems/number-of-closed-islands/"),
          difficulty: "Medium",
          description: "Eliminate boundary-connected land components first, then count remaining closed interior islands.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Replace O's with X's",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/replace-os-with-xs0052/1"),
          difficulty: "Medium",
          description: "Replace all 'O's or groups of 'O's that are completely surrounded by 'X's.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` board of \`'X'\` and \`'O'\` characters, capture all regions of \`'O'\`s that are completely surrounded on all 4 sides by \`'X'\`s by flipping them to \`'X'\`.

### 💡 Key Takeaways
- **The Boundary Escape Observation:**
  - When can a group of \`'O'\`s **never** be surrounded by \`'X'\`s? Whenever at least one \`'O'\` in that connected group touches the **outer boundary** of the board (first row, last row, first column, or last column)!
- **Boundary-Inward DFS Algorithm (\`O(N * M)\` Time, \`O(N * M)\` Space):**
  1. Traverse the **4 outer borders** of the grid.
  2. Whenever you see a boundary \`'O'\` that is not yet visited, launch a DFS/BFS to mark it and all \`'O'\`s connected to it in \`seen\` as **safe** (cannot be flipped).
  3. Scan the entire grid: any \`'O'\` that was **not** marked in \`seen\` is completely enclosed inside the grid—flip it to \`'X'\`!

### 💻 Surrounded Regions Blueprint
\`\`\`cpp
void markSafeDFS(int r, int c, const vector<vector<char>> &board, vector<vector<int>> &seen) {
    seen[r][c] = 1;
    int rows = board.size(), cols = board[0].size();
    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    for (int i = 0; i < 4; i++) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
            !seen[nr][nc] && board[nr][nc] == 'O') {
            markSafeDFS(nr, nc, board, seen);
        }
    }
}

void solveSurroundedRegions(vector<vector<char>> &board) {
    int rows = board.size(), cols = board[0].size();
    vector<vector<int>> seen(rows, vector<int>(cols, 0));

    // 1. Check first and last rows
    for (int c = 0; c < cols; c++) {
        if (!seen[0][c] && board[0][c] == 'O') markSafeDFS(0, c, board, seen);
        if (!seen[rows - 1][c] && board[rows - 1][c] == 'O') markSafeDFS(rows - 1, c, board, seen);
    }
    // 2. Check first and last columns
    for (int r = 0; r < rows; r++) {
        if (!seen[r][0] && board[r][0] == 'O') markSafeDFS(r, 0, board, seen);
        if (!seen[r][cols - 1] && board[r][cols - 1] == 'O') markSafeDFS(r, cols - 1, board, seen);
    }
    // 3. Flip all unvisited interior 'O's to 'X'
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (!seen[r][c] && board[r][c] == 'O') {
                board[r][c] = 'X';
            }
        }
    }
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Trying to Check "Is Surrounded" From the Inside Out:** Starting from interior 'O's makes it hard to tell whether a component eventually leaks to the border without backtracking. Starting from the border inward solves the problem in one clean pass!`),
      theorySummary: cleanText(`Surrounded Regions (Replace O's with X's):
1. Identify all boundary 'O's and flood fill inward to mark them and connected 'O's as safe.
2. Iterate through entire grid: any 'O' not marked safe is completely surrounded—flip to 'X'.
Complexity: O(N * M) time, O(N * M) space.`),
    },

    {
      order: 140,
      name: "Boundary Multi-Source Elimination: Number of Enclaves",
      slug: "dsa-number-of-enclaves-multisource-bfs",
      subtrack: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      description: "Count trapped interior land cells by eliminating boundary-reachable components using multi-source BFS.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 140: Number of Enclaves | Multi-source BFS",
          url: cleanUrl("https://www.youtube.com/watch?v=rxKcepXQgU4"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Enclaves",
          url: "https://takeuforward.org/data-structure/number-of-enclaves/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Enclaves (LC 1020)",
          url: cleanUrl("https://leetcode.com/problems/number-of-enclaves/"),
          difficulty: "Medium",
          description: "Return the number of land cells in the grid from which we cannot walk off the boundary of the grid.",
        },
        {
          platform: "LeetCode",
          title: "Pacific Atlantic Water Flow (LC 417)",
          url: cleanUrl("https://leetcode.com/problems/pacific-atlantic-water-flow/"),
          difficulty: "Medium",
          description: "Run boundary-inward BFS/DFS from both ocean borders to find cells that can reach both oceans.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number Of Enclaves",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-enclaves/1"),
          difficulty: "Medium",
          description: "Count land cells that cannot reach the grid boundary via 4-directional land moves.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` binary matrix where \`0\` is sea and \`1\` is land, count the **Number of Enclaves**: the total number of land cells (\`1\`s) from which it is **impossible to walk off the boundary** of the grid using 4-directional moves.

### 💡 Key Takeaways
- **Direct Application of Boundary Flood (Multi-Source BFS):**
  - Any land cell (\`1\`) on the outer perimeter (row \`0\`, row \`N - 1\`, col \`0\`, or col \`M - 1\`), along with any land cell 4-directionally connected to it, can walk off the grid.
- **Algorithm Steps (\`O(N * M)\` Time, \`O(N * M)\` Space):**
  1. Scan the grid and push **all boundary \`1\`s** (\`r == 0 || r == rows - 1 || c == 0 || c == cols - 1\`) into a BFS queue, marking them visited in \`seen\`.
  2. Run Multi-Source BFS to mark all land cells reachable from those boundary cells.
  3. Count and return the number of remaining land cells where \`grid[r][c] == 1 && !seen[r][c]\`!

### 💻 Number of Enclaves (Multi-Source BFS) Blueprint
\`\`\`cpp
int numEnclaves(vector<vector<int>> &grid) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> seen(rows, vector<int>(cols, 0));
    queue<pair<int, int>> q;

    // 1. Push all boundary land cells into the queue
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (r == 0 || r == rows - 1 || c == 0 || c == cols - 1) {
                if (grid[r][c] == 1) {
                    q.push({r, c});
                    seen[r][c] = 1;
                }
            }
        }
    }

    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    // 2. Mark all land cells connected to the boundary
    while (!q.empty()) {
        auto [r, c] = q.front();
        q.pop();

        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                !seen[nr][nc] && grid[nr][nc] == 1) {
                seen[nr][nc] = 1;
                q.push({nr, nc});
            }
        }
    }

    // 3. Count unvisited interior land cells (enclaves)
    int enclaves = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1 && !seen[r][c]) {
                enclaves++;
            }
        }
    }
    return enclaves;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Mark Boundary Cells as Visited When Pushing:** Always set seen[r][c] = 1 at the moment you push boundary cells into the queue so corner/edge neighbors aren't pushed multiple times.`),
      theorySummary: cleanText(`Number of Enclaves (Multi-Source BFS):
1. Push all boundary land cells (1s) into BFS queue and mark visited.
2. Traverse outward from boundary cells to mark all reachable land cells.
3. Count remaining unvisited interior land cells: these are enclosed enclaves.
Complexity: O(N * M) time, O(N * M) space.`),
    },
  ];

  // 4. Upsert topics and nested resources
  console.log("\n📦 Upserting 10 Batch 14 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch14Topics) {
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

  // 5. Update track_topics: Link Batch 14 Topics to topic_order 131 through 140
  console.log("\n🔄 Linking Batch 14 topics to 'problem-solving-dsa-sql' (orders 131..140)...");

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

  // Link Batch 14 Topics (orders 131..140)
  for (const topicDef of batch14Topics) {
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

  console.log("\n🎉 DSA Batch 14 (Lectures 131–140) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch14()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch14;
