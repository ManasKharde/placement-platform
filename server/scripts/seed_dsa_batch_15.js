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

const seedDsaBatch15 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 15 (Lectures 141–150) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 15 Topics (Lectures 141–150)
  const batch15Topics = [
    // =========================================================================
    // SUBTRACK: Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms (Topic 141)
    // =========================================================================
    {
      order: 141,
      name: "Relative Coordinate Normalization: Number of Distinct Islands via Shape Hashing",
      slug: "dsa-number-of-distinct-islands-shape-hashing",
      subtrack: "Module 22: Graph Cycle Detection, Multi-Source BFS & Boundary Flood Algorithms",
      description: "Count distinct island shapes in a 2D binary grid using base-coordinate relative offset normalization and set hashing.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 141: Number of Distinct Islands",
          url: cleanUrl("https://www.youtube.com/watch?v=7zmgQSJghpo"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Distinct Islands",
          url: "https://takeuforward.org/data-structure/number-of-distinct-islands/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Number of Distinct Islands",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-distinct-islands/1"),
          difficulty: "Medium",
          description: "Count the number of distinct island shapes in a 2D binary grid using relative coordinate normalization.",
        },
        {
          platform: "LeetCode",
          title: "Number of Distinct Islands (LC 694)",
          url: cleanUrl("https://leetcode.com/problems/number-of-distinct-islands/"),
          difficulty: "Medium",
          description: "Return the number of distinct 4-directionally connected island shapes under translation.",
        },
        {
          platform: "LeetCode",
          title: "Count Sub Islands (LC 1905)",
          url: cleanUrl("https://leetcode.com/problems/count-sub-islands/"),
          difficulty: "Medium",
          description: "Use DFS across two binary grids to count islands in grid2 that are completely contained within islands of grid1.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an N x M binary matrix where 1 represents land and 0 represents water, count the number of **distinct islands**. Two islands are considered identical if one can be translated (shifted without rotation or reflection) to match the other's exact shape.

### 💡 Key Takeaways
- **The Base-Coordinate Subtraction Trick:**
  - How do we store an island's shape in a \`set\` so that two identical shapes at different locations produce the exact same representation?
  - Record the starting cell where you initiate the island's DFS as the **base coordinate \`(baseR, baseC)\`**.
  - For every cell \`(r, c)\` visited in that island, subtract the base coordinate and append the relative offset **\`(r - baseR, c - baseC)\`** into a \`vector<pair<int, int>> shape\`.
  - If two islands have the same shape and you traverse neighbors in the **exact same fixed direction order** (Up, Right, Down, Left), their relative offset vectors will be 100% identical!
- **Inserting Shapes into a Set:**
  - Insert each island's \`shape\` vector into a \`set<vector<pair<int, int>>> uniqueShapes\`.
  - The total number of distinct islands is simply \`uniqueShapes.size()\`.
- **Time & Space Complexity:**
  - **Time Complexity:** \`O(N * M * log(N * M)) + O(N * M * 4)\` (grid scan + 4-directional DFS + set insertion).
  - **Space Complexity:** \`O(N * M)\` for the \`seen\` matrix and \`uniqueShapes\` set.

### 💻 Number of Distinct Islands Blueprint
\`\`\`cpp
void recordShapeDFS(int r, int c, int baseR, int baseC, const vector<vector<int>> &grid,
                    vector<vector<int>> &seen, vector<pair<int, int>> &shape) {
    seen[r][c] = 1;
    shape.push_back({r - baseR, c - baseC}); // Store relative offset from base

    int rows = grid.size(), cols = grid[0].size();
    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    for (int i = 0; i < 4; i++) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
            !seen[nr][nc] && grid[nr][nc] == 1) {
            recordShapeDFS(nr, nc, baseR, baseC, grid, seen, shape);
        }
    }
}

int countDistinctIslands(vector<vector<int>> &grid) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> seen(rows, vector<int>(cols, 0));
    set<vector<pair<int, int>>> uniqueShapes;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (!seen[r][c] && grid[r][c] == 1) {
                vector<pair<int, int>> shape;
                recordShapeDFS(r, c, r, c, grid, seen, shape);
                uniqueShapes.insert(shape);
            }
        }
    }
    return uniqueShapes.size();
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Subtracting the Previous Cell Instead of the Base Cell:** Always subtract the **original starting cell \`(baseR, baseC)\`** of the island, not the immediate parent cell in the DFS tree!`),
      theorySummary: cleanText(`Number of Distinct Islands:
1. Normalize island shapes by subtracting the base coordinate (baseR, baseC) for each cell in that island.
2. Store each normalized shape vector in a set to eliminate duplicate shapes.
3. Return set size as total distinct islands.
Complexity: O(N * M * log(N * M)) time, O(N * M) space.`),
    },

    // =========================================================================
    // SUBTRACK: Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs) (Topics 142–150)
    // =========================================================================
    {
      order: 142,
      name: "2-Coloring Wavefront Validation: Bipartite Graph Check Using BFS",
      slug: "dsa-bipartite-graph-check-bfs",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Determine if an undirected graph is bipartite by validating alternating 2-color BFS waves across odd/even cycle parities.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 142: Bipartite Graph Check using BFS",
          url: cleanUrl("https://www.youtube.com/watch?v=-vu34sct1g8"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Bipartite Graph BFS",
          url: "https://takeuforward.org/graph/bipartite-graph-bfs/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Is Graph Bipartite? (LC 785)",
          url: cleanUrl("https://leetcode.com/problems/is-graph-bipartite/"),
          difficulty: "Medium",
          description: "Return true if and only if an undirected graph can be partitioned into two independent sets.",
        },
        {
          platform: "LeetCode",
          title: "Possible Bipartition (LC 886)",
          url: cleanUrl("https://leetcode.com/problems/possible-bipartition/"),
          difficulty: "Medium",
          description: "Model dislike pairs as edges and check if people can be split into two groups using 2-coloring.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Bipartite Graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/bipartite-graph/1"),
          difficulty: "Medium",
          description: "Check whether a given undirected graph is bipartite using BFS 2-coloring.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A **Bipartite Graph** is a graph whose vertices can be colored using **at most 2 colors** (say \`0\` and \`1\`) such that **no two adjacent vertices share the same color**.

### 💡 Key Takeaways
- **Cycle Parity Rule (The Core Theorem):**
  - Any **acyclic (linear/tree) graph** is always bipartite.
  - Any graph with only **even-length cycles** is always bipartite.
  - Any graph containing an **odd-length cycle** can **NEVER** be bipartite!
- **BFS 2-Coloring Algorithm (\`O(V + 2E)\` Time, \`O(V)\` Space):**
  1. Initialize a \`color\` array of size \`V\` with \`-1\` (meaning uncolored).
  2. Loop \`i\` from \`0\` to \`V - 1\` to cover all disconnected components.
  3. If \`color[i] == -1\`, assign \`color[i] = 0\` and push \`i\` into a BFS queue.
  4. When popping \`curr\`, inspect each \`neighbor\`:
     - If \`color[neighbor] == -1\`: color it with the **opposite color** (\`!color[curr]\`) and push to queue.
     - Else if \`color[neighbor] == color[curr]\`: an adjacent node already has the exact same color—return \`false\`!

### 💻 Bipartite Graph Check (BFS) Blueprint
\`\`\`cpp
bool checkComponentBFS(int startNode, const vector<vector<int>> &adjList, vector<int> &color) {
    queue<int> q;
    q.push(startNode);
    color[startNode] = 0;

    while (!q.empty()) {
        int curr = q.front();
        q.pop();

        for (int neighbor : adjList[curr]) {
            if (color[neighbor] == -1) {
                color[neighbor] = !color[curr]; // Assign opposite color (0 -> 1, 1 -> 0)
                q.push(neighbor);
            } else if (color[neighbor] == color[curr]) {
                return false; // Conflict: two adjacent nodes have the same color
            }
        }
    }
    return true;
}

bool isBipartite(vector<vector<int>> &graph) {
    int V = graph.size();
    vector<int> color(V, -1);

    for (int i = 0; i < V; i++) {
        if (color[i] == -1) {
            if (!checkComponentBFS(i, graph, color)) return false;
        }
    }
    return true;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Only Checking From Node 0:** A disconnected graph may have an even cycle in Component 1 and an odd cycle in Component 2. Always wrap your check in a \`0\` to \`V - 1\` loop!`),
      theorySummary: cleanText(`Bipartite Graph Check (BFS):
1. A graph is bipartite if and only if it contains no odd-length cycles.
2. Initialize color array with -1; color alternatingly with 0 and 1 via BFS.
3. If neighbor has the same color as current node, return false.
Complexity: O(V + 2E) time, O(V) space.`),
    },

    {
      order: 143,
      name: "Recursive Alternating 2-Coloring: Bipartite Graph Check Using DFS",
      slug: "dsa-bipartite-graph-check-dfs",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Verify bipartite graph properties using recursive DFS alternating color propagation with conflict detection.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 143: Bipartite Graph Check using DFS",
          url: cleanUrl("https://www.youtube.com/watch?v=KG5YFfR0j8A"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Bipartite Graph DFS",
          url: "https://takeuforward.org/data-structure/bipartite-graph-dfs-color-graph/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Possible Bipartition (LC 886)",
          url: cleanUrl("https://leetcode.com/problems/possible-bipartition/"),
          difficulty: "Medium",
          description: "Use recursive DFS 2-coloring to determine if N people can be partitioned into two conflict-free groups.",
        },
        {
          platform: "LeetCode",
          title: "Is Graph Bipartite? (LC 785)",
          url: cleanUrl("https://leetcode.com/problems/is-graph-bipartite/"),
          difficulty: "Medium",
          description: "Implement recursive DFS alternating color assignment across all graph components.",
        },
        {
          platform: "LeetCode",
          title: "Flower Planting With No Adjacent (LC 1042)",
          url: cleanUrl("https://leetcode.com/problems/flower-planting-with-no-adjacent/"),
          difficulty: "Medium",
          description: "Generalize graph coloring to assign 4 flower types so no two adjacent gardens share a type.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
We can also verify whether a graph is **Bipartite** using **Depth-First Search (DFS)** by recursively passing the alternating color (\`!col\`) to each uncolored neighbor and checking for same-color conflicts.

### 💡 Key Takeaways
- **Recursive State \`(curr, col)\`:**
  1. Set \`color[curr] = col\`.
  2. Loop through every \`neighbor\` in \`adjList[curr]\`:
     - If \`color[neighbor] == -1\`: call \`checkDFS(neighbor, !col)\`. If that recursive call returns \`false\`, immediately return \`false\`!
     - Else if \`color[neighbor] == col\`: the neighbor is already colored with the **same color** as \`curr\`—return \`false\`!
  3. If all neighbors succeed, return \`true\`.
- **Complexity:** \`O(V + 2E)\` Time and \`O(V)\` Space (color array + recursion stack).

### 💻 Bipartite Graph Check (DFS) Blueprint
\`\`\`cpp
bool checkComponentDFS(int curr, int col, const vector<vector<int>> &adjList, vector<int> &color) {
    color[curr] = col;

    for (int neighbor : adjList[curr]) {
        if (color[neighbor] == -1) {
            if (!checkComponentDFS(neighbor, !col, adjList, color)) {
                return false;
            }
        } else if (color[neighbor] == col) {
            return false; // Neighbor already has the same color
        }
    }
    return true;
}

bool isBipartite(vector<vector<int>> &graph) {
    int V = graph.size();
    vector<int> color(V, -1);

    for (int i = 0; i < V; i++) {
        if (color[i] == -1) {
            if (!checkComponentDFS(i, 0, graph, color)) return false;
        }
    }
    return true;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Initializing \`color\` With \`0\` Instead of \`-1\`:** Since \`0\` and \`1\` are our two active colors, unvisited nodes must be initialized to \`-1\` so they aren't mistaken for color \`0\`.`),
      theorySummary: cleanText(`Bipartite Graph Check (DFS):
1. Recursively pass alternating color !col to unvisited neighbors.
2. If neighbor is already colored with col, return false (odd cycle detected).
3. If all branches succeed, graph component is bipartite.
Complexity: O(V + 2E) time, O(V) space.`),
    },

    {
      order: 144,
      name: "Active Call-Stack Path Tracking: Detect a Cycle in a Directed Graph Using DFS",
      slug: "dsa-detect-cycle-in-directed-graph-dfs",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Detect directed cycles by distinguishing visited cross-edges from active recursion stack back-edges.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 144: Detect Cycle in a Directed Graph using DFS",
          url: cleanUrl("https://www.youtube.com/watch?v=9twcmtQj4DU"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Detect Cycle in a Directed Graph using DFS",
          url: "https://takeuforward.org/data-structure/detect-cycle-in-a-directed-graph-using-dfs/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Directed Graph Cycle",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1"),
          difficulty: "Medium",
          description: "Given a Directed Graph with V vertices and E edges, check whether it contains any cycle.",
        },
        {
          platform: "LeetCode",
          title: "Course Schedule (LC 207)",
          url: cleanUrl("https://leetcode.com/problems/course-schedule/"),
          difficulty: "Medium",
          description: "Detect if a circular prerequisite dependency exists in a directed course graph.",
        },
        {
          platform: "LeetCode",
          title: "Longest Cycle in a Graph (LC 2360)",
          url: cleanUrl("https://leetcode.com/problems/longest-cycle-in-a-graph/"),
          difficulty: "Hard",
          description: "Track active path timestamps during directed DFS to measure the length of the longest cycle.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Why does standard undirected cycle detection fail on a **Directed Graph**? Because in a directed graph, two different paths \`A → B → C\` and \`A → D → C\` can converge at \`C\` without forming a cycle! A cycle in a directed graph exists **if and only if** we reach a node that is currently active **on the exact same ongoing DFS path**.

### 💡 Key Takeaways
- **Dual State Tracking (\`seen[]\` and \`inCurrentPath[]\`):**
  - \`seen[u] = 1\`: Node \`u\` has been visited at some point (prevents re-exploring finished branches).
  - \`inCurrentPath[u] = 1\`: Node \`u\` is currently on the active recursion stack!
- **Backtracking Reset Rule:**
  - When entering \`u\`: mark both \`seen[u] = 1\` and \`inCurrentPath[u] = 1\`.
  - For each \`neighbor\` of \`u\`:
    - If \`!seen[neighbor]\`: recurse. If it returns \`true\`, return \`true\`.
    - Else if \`inCurrentPath[neighbor] == 1\`: we looped back onto our own active path—**Cycle detected (\`return true\`)**!
  - When leaving \`u\` (backtracking): reset **\`inCurrentPath[u] = 0\`**, while keeping \`seen[u] = 1\`!
- **Complexity:** \`O(V + E)\` Time and \`O(2V)\` Space (can also be combined into a single array using states \`0\` = unvisited, \`1\` = visited, \`2\` = path-visited).

### 💻 Directed Graph Cycle Detection (DFS) Blueprint
\`\`\`cpp
bool checkCycleDFS(int curr, const vector<int> adjList[], vector<int> &seen, vector<int> &inCurrentPath) {
    seen[curr] = 1;
    inCurrentPath[curr] = 1;

    for (int neighbor : adjList[curr]) {
        if (!seen[neighbor]) {
            if (checkCycleDFS(neighbor, adjList, seen, inCurrentPath)) {
                return true;
            }
        } else if (inCurrentPath[neighbor] == 1) {
            return true; // Node is already active on the current recursion path!
        }
    }

    inCurrentPath[curr] = 0; // Unmark from current path upon backtracking
    return false;
}

bool isCyclic(int V, vector<int> adjList[]) {
    vector<int> seen(V, 0), inCurrentPath(V, 0);

    for (int i = 0; i < V; i++) {
        if (!seen[i]) {
            if (checkCycleDFS(i, adjList, seen, inCurrentPath)) return true;
        }
    }
    return false;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`inCurrentPath[curr] = 0\` When Backtracking:** If you forget to unmark \`inCurrentPath[curr]\` before returning \`false\`, cross-edges from later branches will falsely trigger cycle detection!`),
      theorySummary: cleanText(`Detect Cycle in Directed Graph (DFS):
1. In directed graphs, a cycle exists only if a node loops back to an active ancestor on the current recursion path.
2. Track seen[] and inCurrentPath[]. Reset inCurrentPath[curr] = 0 upon backtracking.
3. If neighbor is already in inCurrentPath, cycle detected.
Complexity: O(V + E) time, O(V) space.`),
    },

    {
      order: 145,
      name: "Cycle-Free Reachability Pruning: Find Eventual Safe States Using DFS",
      slug: "dsa-find-eventual-safe-states-dfs",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Identify all nodes whose outgoing paths avoid cycles and terminate exclusively at safe terminal nodes.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 145: Find Eventual Safe States - DFS",
          url: cleanUrl("https://www.youtube.com/watch?v=uRbJ1OF9aYM"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find Eventual Safe States - DFS",
          url: "https://takeuforward.org/data-structure/find-eventual-safe-states-dfs/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find Eventual Safe States (LC 802)",
          url: cleanUrl("https://leetcode.com/problems/find-eventual-safe-states/"),
          difficulty: "Medium",
          description: "Return an array of all safe nodes in ascending order using DFS cycle detection.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Eventual Safe States",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/eventual-safe-states/1"),
          difficulty: "Medium",
          description: "Identify all vertices in a directed graph whose paths exclusively lead to terminal nodes.",
        },
        {
          platform: "LeetCode",
          title: "Find All Possible Recipes from Given Supplies (LC 2115)",
          url: cleanUrl("https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/"),
          difficulty: "Medium",
          description: "Determine which recipes can be created without circular ingredient dependencies.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In a directed graph, a **Terminal Node** is a node with \`0\` outgoing edges. A node is an **Eventual Safe Node** if **every possible path** starting from that node eventually leads to a terminal node. Return all safe nodes sorted in ascending order.

### 💡 Key Takeaways
- **The Cycle Exclusion Observation:**
  - When does a node fail to be safe?
    1. If the node is **part of a cycle**.
    2. If the node has a directed path that **leads into a cycle**.
  - Every other node is guaranteed to reach a terminal node and is **safe**!
- **Adapting Directed Cycle DFS (\`safe[]\` Array):**
  - Run our standard Directed Cycle DFS (\`seen[]\` and \`inCurrentPath[]\`) along with a \`safe[V] = {0}\` array.
  - Whenever a cycle is detected along a branch, return \`true\` **immediately** without resetting \`inCurrentPath[curr] = 0\`. That way, every node in the cycle (and every ancestor leading into it) retains \`inCurrentPath == 1\` and \`safe == 0\`!
  - If a node explores all of its outgoing edges without hitting any cycle, mark **\`safe[curr] = 1\`**, reset \`inCurrentPath[curr] = 0\`, and return \`false\` (no cycle).
- **Complexity:** \`O(V + E)\` Time and \`O(3V)\` Space.

### 💻 Eventual Safe States (DFS) Blueprint
\`\`\`cpp
bool hasCycleDFS(int curr, const vector<vector<int>> &adjList,
                 vector<int> &seen, vector<int> &inCurrentPath, vector<int> &safe) {
    seen[curr] = 1;
    inCurrentPath[curr] = 1;
    safe[curr] = 0;

    for (int neighbor : adjList[curr]) {
        if (!seen[neighbor]) {
            if (hasCycleDFS(neighbor, adjList, seen, inCurrentPath, safe)) {
                return true; // Leads to a cycle -> unsafe!
            }
        } else if (inCurrentPath[neighbor] == 1) {
            return true;     // Part of a cycle -> unsafe!
        }
    }

    // All outgoing paths are cycle-free -> node is safe!
    safe[curr] = 1;
    inCurrentPath[curr] = 0;
    return false;
}

vector<int> eventualSafeNodes(vector<vector<int>> &graph) {
    int V = graph.size();
    vector<int> seen(V, 0), inCurrentPath(V, 0), safe(V, 0);

    for (int i = 0; i < V; i++) {
        if (!seen[i]) {
            hasCycleDFS(i, graph, seen, inCurrentPath, safe);
        }
    }

    vector<int> safeNodes;
    for (int i = 0; i < V; i++) {
        if (safe[i] == 1) safeNodes.push_back(i);
    }
    return safeNodes;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Resetting \`inCurrentPath[curr] = 0\` When Returning \`true\`:** If a node leads to a cycle, you must leave \`inCurrentPath[curr] = 1\` so that any future node pointing to \`curr\` immediately recognizes that \`curr\` is unsafe!`),
      theorySummary: cleanText(`Find Eventual Safe States (DFS):
1. A node is safe if every path from it leads to a terminal node (never enters a cycle).
2. Nodes in or leading to cycles remain safe = 0.
3. If all outgoing paths from curr are cycle-free, mark safe[curr] = 1.
Complexity: O(V + E) time, O(V) space.`),
    },

    {
      order: 146,
      name: "Post-Order Dependency Stacking: Topological Sort Algorithm Using DFS",
      slug: "dsa-topological-sort-algorithm-dfs",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Compute linear topological orderings in Directed Acyclic Graphs (DAGs) using post-order DFS stack reversal.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 146: Topological Sort Algorithm | DFS",
          url: cleanUrl("https://www.youtube.com/watch?v=5lZ0iJMrUMk"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Topological Sort Algorithm | DFS",
          url: "https://takeuforward.org/data-structure/topological-sort-algorithm-dfs/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Topological sort",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/topological-sort/1"),
          difficulty: "Medium",
          description: "Return a valid topological linear ordering of vertices in a Directed Acyclic Graph (DAG).",
        },
        {
          platform: "LeetCode",
          title: "Course Schedule II (LC 210)",
          url: cleanUrl("https://leetcode.com/problems/course-schedule-ii/"),
          difficulty: "Medium",
          description: "Use post-order DFS stack ordering to find a valid sequence to finish all courses.",
        },
        {
          platform: "LeetCode",
          title: "Loud and Rich (LC 851)",
          url: cleanUrl("https://leetcode.com/problems/loud-and-rich/"),
          difficulty: "Medium",
          description: "Propagate minimum quietness values across a DAG using DFS post-order traversal.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Topological Sorting** of a **Directed Acyclic Graph (DAG)** is a linear ordering of its vertices such that for every directed edge \`u → v\`, vertex **\`u\` always appears before \`v\`** in the ordering.

### 💡 Key Takeaways
- **Why Topological Sort Only Exists for DAGs:**
  - **Undirected graphs** have bidirectional edges (\`u — v\` implies both \`u → v\` and \`v → u\`), so neither can come first.
  - **Cyclic graphs** have circular dependencies (\`1 → 2 → 3 → 1\`), making linear ordering impossible.
- **Post-Order DFS + Stack Intuition (\`O(V + E)\` Time, \`O(V)\` Space):**
  - Run DFS from every unvisited node \`u\`.
  - First recursively visit **all** outgoing descendants of \`u\`.
  - Only **after** the DFS for \`u\` is 100% finished, push \`u\` onto a \`stack<int> st\`!
  - Because all dependents \`v\` finish their DFS and get pushed onto the stack *before* \`u\` finishes, \`u\` sits above \`v\` in the stack—so popping the stack from top to bottom outputs \`u\` before \`v\`!

### 💻 Topological Sort (DFS) Blueprint
\`\`\`cpp
void topoSortDFS(int curr, const vector<int> adjList[], vector<int> &seen, stack<int> &st) {
    seen[curr] = 1;

    for (int neighbor : adjList[curr]) {
        if (!seen[neighbor]) {
            topoSortDFS(neighbor, adjList, seen, st);
        }
    }
    // Push curr ONLY after all of its outgoing dependencies have finished
    st.push(curr);
}

vector<int> topoSort(int V, vector<int> adjList[]) {
    vector<int> seen(V, 0);
    stack<int> st;

    for (int i = 0; i < V; i++) {
        if (!seen[i]) {
            topoSortDFS(i, adjList, seen, st);
        }
    }

    vector<int> order;
    while (!st.empty()) {
        order.push_back(st.top());
        st.pop();
    }
    return order;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Pushing \`curr\` Onto the Stack Before the Neighbor Loop:** Pushing on entry produces a Preorder traversal, which violates topological ordering when branches reconverge. Always push **at the very end** of the DFS function!`),
      theorySummary: cleanText(`Topological Sort (DFS):
1. Linear ordering of vertices where u appears before v for every directed edge u -> v.
2. Valid only on Directed Acyclic Graphs (DAGs).
3. Push node onto stack only after all outgoing neighbors have completed DFS traversal. Pop stack to retrieve order.
Complexity: O(V + E) time, O(V) space.`),
    },

    {
      order: 147,
      name: "Indegree Zero Peeling: Kahn's Algorithm for Topological Sort Using BFS",
      slug: "dsa-kahns-algorithm-topological-sort-bfs",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Compute topological ordering iteratively using Kahn's algorithm by progressively removing vertices with indegree zero.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 147: Kahn's Algorithm | Topological Sort Algorithm | BFS",
          url: cleanUrl("https://www.youtube.com/watch?v=73sneFXuTEg"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Kahn's Algorithm | Topological Sort",
          url: "https://takeuforward.org/data-structure/kahns-algorithm-topological-sort-algorithm-bfs/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Topological sort (Kahn's BFS)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/topological-sort/1"),
          difficulty: "Medium",
          description: "Implement Kahn's Indegree BFS algorithm to generate a valid topological ordering.",
        },
        {
          platform: "LeetCode",
          title: "Parallel Courses (LC 1136)",
          url: cleanUrl("https://leetcode.com/problems/parallel-courses/"),
          difficulty: "Medium",
          description: "Use level-by-level Kahn's BFS to find the minimum number of semesters needed to complete all courses.",
        },
        {
          platform: "LeetCode",
          title: "Find All Possible Recipes from Given Supplies (LC 2115)",
          url: cleanUrl("https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/"),
          difficulty: "Medium",
          description: "Track ingredient indegrees and peel zero-indegree supplies using a BFS queue.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Kahn's Algorithm** computes a **Topological Sort** iteratively using **BFS** and an **\`indegree[]\` array** (where \`indegree[v]\` is the number of incoming directed edges pointing into \`v\`).

### 💡 Key Takeaways
- **The Indegree-Zero Invariant:**
  - Any vertex with \`indegree == 0\` has **no prerequisites** (no incoming edges), so it can safely be placed at the very front of our linear ordering!
  - Every DAG is guaranteed to have at least one vertex with \`indegree == 0\`.
- **Kahn's Algorithm Steps (\`O(V + E)\` Time, \`O(V)\` Space):**
  1. Compute \`indegree[v]\` for all vertices by scanning \`adjList\`.
  2. Push all vertices with \`indegree[i] == 0\` into a \`queue<int> q\`.
  3. While \`!q.empty()\`:
     - Pop \`curr = q.front()\` and append \`curr\` to \`topoOrder\`.
     - For each \`neighbor\` in \`adjList[curr]\`:
       - Decrement \`indegree[neighbor]--\` (virtually removing the edge \`curr → neighbor\`).
       - If \`indegree[neighbor] == 0\`, all of its prerequisites are now satisfied—push \`neighbor\` into \`q\`!

### 💻 Kahn's Algorithm (BFS Topological Sort) Blueprint
\`\`\`cpp
vector<int> kahnsTopoSort(int V, vector<int> adjList[]) {
    vector<int> indegree(V, 0);
    for (int u = 0; u < V; u++) {
        for (int v : adjList[u]) {
            indegree[v]++;
        }
    }

    queue<int> q;
    for (int i = 0; i < V; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }

    vector<int> topoOrder;
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        topoOrder.push_back(curr);

        // Remove outgoing edges from curr and unlock newly independent neighbors
        for (int neighbor : adjList[curr]) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    return topoOrder;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using a Visited Array Unnecessarily:** In Kahn's algorithm, a node is pushed into the queue **only at the exact moment its \`indegree\` drops from \`1\` to \`0\`**, so it can never be pushed twice!`),
      theorySummary: cleanText(`Kahn's Algorithm (BFS Topological Sort):
1. Compute indegrees of all nodes. Push all nodes with indegree == 0 to queue.
2. Pop node, append to topological order, and decrement indegree of all its neighbors.
3. If neighbor's indegree reaches 0, push to queue.
Complexity: O(V + E) time, O(V) space.`),
    },

    {
      order: 148,
      name: "Incomplete Topological Ordering: Detect a Cycle in a Directed Graph Using Kahn's BFS",
      slug: "dsa-detect-cycle-in-directed-graph-kahns-bfs",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Detect directed cycles by verifying whether Kahn's BFS algorithm can process all V vertices.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 148: Detect a Cycle in Directed Graph | Topo Sort | Kahn's Algorithm | BFS",
          url: cleanUrl("https://www.youtube.com/watch?v=iTBaI90lpDQ"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Detect Cycle in Directed Graph Kahn's BFS",
          url: "https://takeuforward.org/data-structure/detect-a-cycle-in-directed-graph-topological-sort-kahns-algorithm-bfs/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Directed Graph Cycle (BFS)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1"),
          difficulty: "Medium",
          description: "Detect whether a directed graph contains a cycle using Kahn's BFS algorithm.",
        },
        {
          platform: "LeetCode",
          title: "Course Schedule (LC 207)",
          url: cleanUrl("https://leetcode.com/problems/course-schedule/"),
          difficulty: "Medium",
          description: "Check if all courses can be completed by verifying that Kahn's BFS visits all V nodes.",
        },
        {
          platform: "LeetCode",
          title: "Largest Color Value in a Directed Graph (LC 1857)",
          url: cleanUrl("https://leetcode.com/problems/largest-color-value-in-a-directed-graph/"),
          difficulty: "Hard",
          description: "Use Kahn's BFS to simultaneously detect cycles and propagate DP color counts across a DAG.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
How can we detect a cycle in a **Directed Graph** using **BFS**? Since Topological Sort is only valid for Directed Acyclic Graphs (DAGs), we simply run **Kahn's Algorithm** and check how many vertices get processed!

### 💡 Key Takeaways
- **Why Nodes in a Cycle Never Enter the Queue:**
  - Every vertex inside a directed cycle has an \`indegree >= 1\` from the previous vertex in the cycle.
  - Because no vertex in the cycle ever reaches \`indegree == 0\`, the cycle can never be unlocked or pushed into the queue!
- **The Count Check (\`visitedCount < V\`):**
  - Run Kahn's BFS and increment \`visitedCount++\` every time a vertex is popped from the queue.
  - If **\`visitedCount == V\`**, a full topological ordering was produced, so the graph is **acyclic** (\`return false\`).
  - If **\`visitedCount < V\`**, the queue became empty prematurely because a cyclic dependency blocked the remaining nodes—**a cycle exists (\`return true\`)**!
- **Complexity:** \`O(V + E)\` Time and \`O(V)\` Space.

### 💻 Directed Cycle Detection (Kahn's BFS) Blueprint
\`\`\`cpp
bool isCyclicKahnsBFS(int V, vector<int> adjList[]) {
    vector<int> indegree(V, 0);
    for (int u = 0; u < V; u++) {
        for (int v : adjList[u]) {
            indegree[v]++;
        }
    }

    queue<int> q;
    for (int i = 0; i < V; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    int visitedCount = 0;
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        visitedCount++;

        for (int neighbor : adjList[curr]) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    // If we couldn't visit all V vertices, the graph contains a cycle!
    return visitedCount != V;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Inverting the Return Boolean:** Remember that \`visitedCount == V\` means **NO cycle** (\`false\`), whereas \`visitedCount < V\` means **YES cycle** (\`true\`)!`),
      theorySummary: cleanText(`Detect Cycle in Directed Graph (Kahn's BFS):
1. Nodes inside cycles never reach indegree == 0, so they cannot enter the BFS queue.
2. Count total processed nodes during Kahn's BFS.
3. If visitedCount == V, no cycle. If visitedCount < V, cycle detected.
Complexity: O(V + E) time, O(V) space.`),
    },

    {
      order: 149,
      name: "Dependency Resolution & Task Scheduling: Course Schedule I and II via Topological Sort",
      slug: "dsa-course-schedule-i-and-ii-topological-sort",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Solve course prerequisites and dependency task ordering using Kahn's topological sort.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 149: Course Schedule I and II | Pre-requisite Tasks | Topological Sort",
          url: cleanUrl("https://www.youtube.com/watch?v=WAOfKpxYHR8"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Course Schedule I and II",
          url: "https://takeuforward.org/data-structure/course-schedule-i-and-ii-pre-requisite-tasks-topological-sort/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Course Schedule (LC 207)",
          url: cleanUrl("https://leetcode.com/problems/course-schedule/"),
          difficulty: "Medium",
          description: "Determine if it is possible to finish all courses given prerequisite pairs.",
        },
        {
          platform: "LeetCode",
          title: "Course Schedule II (LC 210)",
          url: cleanUrl("https://leetcode.com/problems/course-schedule-ii/"),
          difficulty: "Medium",
          description: "Return the ordering of courses you should take to finish all courses, or an empty array if impossible.",
        },
        {
          platform: "LeetCode",
          title: "Course Schedule IV (LC 1462)",
          url: cleanUrl("https://leetcode.com/problems/course-schedule-iv/"),
          difficulty: "Medium",
          description: "Answer multiple queries asking whether course u is an indirect prerequisite of course v.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given \`N\` courses labeled \`0\` to \`N - 1\` and a list of prerequisite pairs \`[a, b]\` (meaning to take course \`a\`, you must first complete course \`b\`):
- **Course Schedule I:** Return \`true\` if you can finish all courses, or \`false\` if a circular dependency exists.
- **Course Schedule II:** Return a valid course ordering to finish all courses, or an empty array \`{}\` if impossible.

### 💡 Key Takeaways
- **Modeling Prerequisites as Directed Edges:**
  - Whenever a problem states *"Task B must be completed before Task A"*, draw a directed edge **\`B → A\`**!
- **Unified Kahn's Algorithm Solution (\`O(V + E)\` Time, \`O(V + E)\` Space):**
  1. Build the adjacency list (\`adjList[b].push_back(a)\`) and compute \`indegree[a]++\`.
  2. Run Kahn's BFS to collect \`topoOrder\`.
  3. **For Course Schedule I:** Return \`topoOrder.size() == numCourses\`.
  4. **For Course Schedule II:** If \`topoOrder.size() == numCourses\`, return \`topoOrder\`; otherwise return \`{}\`!

### 💻 Course Schedule I & II Blueprint
\`\`\`cpp
vector<int> findOrder(int numCourses, vector<vector<int>> &prerequisites) {
    vector<vector<int>> adjList(numCourses);
    vector<int> indegree(numCourses, 0);

    // Pair [course, prereq] means: prereq -> course
    for (const auto &edge : prerequisites) {
        int course = edge[0], prereq = edge[1];
        adjList[prereq].push_back(course);
        indegree[course]++;
    }

    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    vector<int> topoOrder;
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        topoOrder.push_back(curr);

        for (int nextCourse : adjList[curr]) {
            indegree[nextCourse]--;
            if (indegree[nextCourse] == 0) {
                q.push(nextCourse);
            }
        }
    }

    if (topoOrder.size() == numCourses) return topoOrder;
    return {}; // Cycle detected: impossible to complete all courses
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Reversing Edge Direction in Course Schedule II:** Check the problem statement carefully! In \`[a, b]\`, \`b\` is the prerequisite for \`a\`, so the directed edge must go from **\`b → a\`**. If you reverse it in Course Schedule II, your returned array will be backwards!`),
      theorySummary: cleanText(`Course Schedule I & II (Topological Sort):
1. Map prerequisite pair [a, b] to directed edge b -> a.
2. Run Kahn's BFS algorithm tracking the topological order.
3. If order length == numCourses, scheduling is possible (Course Schedule I returns true, II returns order); otherwise impossible (return false or empty array).
Complexity: O(V + E) time, O(V + E) space.`),
    },

    {
      order: 150,
      name: "Edge-Reversal Indegree Reduction: Find Eventual Safe States Using BFS (Kahn's Algorithm)",
      slug: "dsa-find-eventual-safe-states-bfs-topological-sort",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Identify safe terminal-leading nodes in directed graphs by reversing all edges and applying Kahn's BFS algorithm.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 150: Find Eventual Safe States - BFS - Topological Sort",
          url: cleanUrl("https://www.youtube.com/watch?v=2gtg3VsDGyc"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find Eventual Safe States - BFS",
          url: "https://takeuforward.org/data-structure/find-eventual-safe-states-bfs-topological-sort/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find Eventual Safe States (LC 802)",
          url: cleanUrl("https://leetcode.com/problems/find-eventual-safe-states/"),
          difficulty: "Medium",
          description: "Solve Eventual Safe States using edge reversal and Kahn's BFS algorithm.",
        },
        {
          platform: "LeetCode",
          title: "All Ancestors of a Node in a Directed Acyclic Graph (LC 2192)",
          url: cleanUrl("https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/"),
          difficulty: "Medium",
          description: "Propagate ancestor sets along topological order using Kahn's BFS.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Eventual Safe States",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/eventual-safe-states/1"),
          difficulty: "Medium",
          description: "Return a sorted list of all eventual safe nodes in a directed graph.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
How do we find all **Eventual Safe Nodes** using **Kahn's BFS Algorithm**? In the original graph, terminal nodes have **\`outdegree == 0\`**, whereas Kahn's algorithm works with **\`indegree == 0\`**. By **reversing all edges** in the graph, terminal nodes become nodes with \`indegree == 0\`!

### 💡 Key Takeaways
- **Why Reversing Edges Unlocks Kahn's Algorithm:**
  - In the original graph, a node \`u\` is safe if **all** of its outgoing edges lead solely to safe nodes.
  - When we reverse every edge (\`u → v\` becomes \`v → u\`), the original \`outdegree\` of \`u\` becomes the **\`indegree\` of \`u\`** in the reversed graph!
  - Starting from terminal nodes (\`indegree == 0\` in the reversed graph), Kahn's BFS peels back incoming edges step by step.
  - A node \`u\` reaches \`indegree == 0\` in the reversed graph **if and only if** every single one of its original outgoing paths led to a terminal/safe node! Nodes trapped in or leading to a cycle will never reach \`indegree == 0\`.
- **Complexity:** \`O(V + E + V log V)\` Time (Kahn's BFS + sorting the safe nodes) and \`O(V + E)\` Space (storing \`adjRev\`).

### 💻 Eventual Safe States (Edge Reversal + Kahn's BFS) Blueprint
\`\`\`cpp
vector<int> eventualSafeNodesBFS(vector<vector<int>> &graph) {
    int V = graph.size();
    vector<vector<int>> adjRev(V);
    vector<int> indegree(V, 0);

    // 1. Reverse all edges: u -> v becomes v -> u
    for (int u = 0; u < V; u++) {
        for (int v : graph[u]) {
            adjRev[v].push_back(u);
            indegree[u]++;
        }
    }

    // 2. Push all terminal nodes (indegree == 0 in reversed graph)
    queue<int> q;
    for (int i = 0; i < V; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    // 3. Run Kahn's BFS to unlock all safe nodes
    vector<int> safeNodes;
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        safeNodes.push_back(curr);

        for (int prevNode : adjRev[curr]) {
            indegree[prevNode]--;
            if (indegree[prevNode] == 0) {
                q.push(prevNode);
            }
        }
    }

    // 4. Sort safe nodes in ascending order as required
    sort(safeNodes.begin(), safeNodes.end());
    return safeNodes;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Sort \`safeNodes\` at the End:** Kahn's BFS discovers safe nodes in order of their distance from terminal nodes, not by vertex index. Always call \`sort(safeNodes.begin(), safeNodes.end())\` before returning!`),
      theorySummary: cleanText(`Eventual Safe States (Edge Reversal + Kahn's BFS):
1. Reverse all edges (u -> v becomes v -> u).
2. Terminal nodes (outdegree 0 in original graph) now have indegree 0 in reversed graph.
3. Run Kahn's BFS on reversed graph: all processed nodes are safe. Sort and return.
Complexity: O(V + E + V log V) time, O(V + E) space.`),
    },
  ];

  // 4. Upsert topics and nested resources
  console.log("\n📦 Upserting 10 Batch 15 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch15Topics) {
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

  // 5. Update track_topics: Link Batch 15 Topics to topic_order 141 through 150
  console.log("\n🔄 Linking Batch 15 topics to 'problem-solving-dsa-sql' (orders 141..150)...");

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

  // Link Batch 15 Topics (orders 141..150)
  for (const topicDef of batch15Topics) {
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

  console.log("\n🎉 DSA Batch 15 (Lectures 141–150) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch15()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch15;
