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

const seedDsaBatch16 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 16 (Lectures 151–160) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 16 Topics (Lectures 151–160)
  const batch16Topics = [
    // =========================================================================
    // SUBTRACK: Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs) (Topic 151)
    // =========================================================================
    {
      order: 151,
      name: "Lexicographical Dependency Graph: Alien Dictionary via Topological Sort",
      slug: "dsa-alien-dictionary-topological-sort",
      subtrack: "Module 23: Graph Coloring, Directed Cycle Detection & Topological Sort (DAGs)",
      description: "Derive alien alphabet character order from adjacent lexicographical word comparisons using Kahn's topological sort.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 151: Alien Dictionary - Topological Sort",
          url: cleanUrl("https://www.youtube.com/watch?v=U3N_je7tWAs"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Alien Dictionary",
          url: "https://takeuforward.org/data-structure/alien-dictionary-topological-sort/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Alien Dictionary",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/alien-dictionary/1"),
          difficulty: "Hard",
          description: "Given a sorted dictionary of an alien language having N words and K starting alphabets, find the order of characters.",
        },
        {
          platform: "LeetCode",
          title: "Alien Dictionary (LC 269)",
          url: cleanUrl("https://leetcode.com/problems/alien-dictionary/"),
          difficulty: "Hard",
          description: "Derive the lexicographical order of letters in an alien language from a sorted list of words.",
        },
        {
          platform: "LeetCode",
          title: "Verifying an Alien Dictionary (LC 953)",
          url: cleanUrl("https://leetcode.com/problems/verifying-an-alien-dictionary/"),
          difficulty: "Easy",
          description: "Verify whether a given sequence of words is sorted lexicographically according to a custom alphabet order.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a sorted dictionary of \`N\` words from an alien language using the first \`K\` lowercase letters (\`'a'\` to \`'a' + K - 1\`), determine a valid **alphabet order** of characters in that alien language.

### 💡 Key Takeaways
- **Building Directed Edges from Adjacent Words:**
  - Compare every pair of adjacent words \`s1 = dict[i]\` and \`s2 = dict[i + 1]\`.
  - Scan character by character up to \`min(s1.size(), s2.size())\` until you find the **first mismatching character** \`s1[ptr] != s2[ptr]\`.
  - Because \`s1\` comes before \`s2\` in the dictionary, character \`s1[ptr]\` must come before \`s2[ptr]\` in the alien alphabet!
  - Add a directed edge \`(s1[ptr] - 'a') -> (s2[ptr] - 'a')\` and **\`break\` immediately** (subsequent characters in \`s1\` and \`s2\` do not determine their relative order).
- **Running Kahn's Topological Sort:**
  - Run Kahn's BFS topological sort over the \`K\` character nodes (\`0\` to \`K - 1\`) and convert each popped integer \`u\` back to \`char(u + 'a')\`.
- **Two Invalid Dictionary Edge Cases (When Order Is Impossible):**
  1. **Prefix Violation:** A longer word appears *before* its own exact prefix (e.g., \`"abcd"\` appears before \`"abc"\`).
  2. **Cyclic Dependency:** \`"abc"\`, \`"bat"\`, \`"ade"\` implies \`a < b < a\`, which forms a cycle (\`topoOrder.size() < K\`).
- **Complexity:** \`O(N * len + K + E)\` Time and \`O(K + E)\` Space.

### 💻 Alien Dictionary Blueprint
\`\`\`cpp
string findOrder(string dict[], int N, int K) {
    vector<vector<int>> adjList(K);
    vector<int> indegree(K, 0);

    // 1. Compare adjacent words to extract directed character dependencies
    for (int i = 0; i < N - 1; i++) {
        string s1 = dict[i], s2 = dict[i + 1];
        int len = min(s1.size(), s2.size());
        for (int ptr = 0; ptr < len; ptr++) {
            if (s1[ptr] != s2[ptr]) {
                int u = s1[ptr] - 'a';
                int v = s2[ptr] - 'a';
                adjList[u].push_back(v);
                indegree[v]++;
                break; // Only the FIRST mismatching character defines the edge!
            }
        }
    }

    // 2. Kahn's BFS Topological Sort over K characters
    queue<int> q;
    for (int i = 0; i < K; i++) {
        if (indegree[i] == 0) q.push(i);
    }

    string order = "";
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order += char(u + 'a');

        for (int v : adjList[u]) {
            indegree[v]--;
            if (indegree[v] == 0) q.push(v);
        }
    }
    return order;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Continuing Comparison Past the First Mismatch:** Once you find the first index \`ptr\` where \`s1[ptr] != s2[ptr]\`, you **must \`break\`**. Characters after \`ptr\` carry zero information about the relative ordering of \`s1\` and \`s2\`!`),
      theorySummary: cleanText(`Alien Dictionary (Topological Sort):
1. Compare adjacent words to find first differing character s1[ptr] != s2[ptr], defining directed edge s1[ptr] -> s2[ptr].
2. Run Kahn's BFS over K characters to produce topological ordering.
3. Detect invalid prefix cases or cycles (order length < K).
Complexity: O(N * len + K + E) time, O(K + E) space.`),
    },

    // =========================================================================
    // SUBTRACK: Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm (Topics 152–160)
    // =========================================================================
    {
      order: 152,
      name: "Topological Edge Relaxation: Shortest Path in a Directed Acyclic Graph (DAG)",
      slug: "dsa-shortest-path-in-directed-acyclic-graph-topological-sort",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Find single-source shortest paths in weighted DAGs by relaxing edges in topological order in linear O(N + M) time.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 152: Shortest Path in Directed Acyclic Graph - Topological Sort",
          url: cleanUrl("https://www.youtube.com/watch?v=ZUFQfFaU-8U"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Shortest Path in Directed Acyclic Graph",
          url: "https://takeuforward.org/data-structure/shortest-path-in-directed-acyclic-graph-topological-sort/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Shortest path in Directed Acyclic Graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1"),
          difficulty: "Medium",
          description: "Find the shortest path from source vertex 0 to all other vertices in a weighted Directed Acyclic Graph.",
        },
        {
          platform: "LeetCode",
          title: "Parallel Courses III (LC 2050)",
          url: cleanUrl("https://leetcode.com/problems/parallel-courses-iii/"),
          difficulty: "Hard",
          description: "Relax completion times along topological order in a weighted DAG.",
        },
        {
          platform: "LeetCode",
          title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance (LC 1334)",
          url: cleanUrl("https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/"),
          difficulty: "Medium",
          description: "Practice shortest path distance calculations across weighted graphs.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a weighted **Directed Acyclic Graph (DAG)** with \`N\` vertices and \`M\` weighted edges \`[u, v, wt]\`, find the **shortest distance** from source vertex \`0\` to every other vertex (or \`-1\` if a vertex is unreachable).

### 💡 Key Takeaways
- **Why Topological Sort Beats Dijkstra on a DAG (\`O(N + M)\` vs \`O(M log N)\`):**
  - Because a DAG has **no cycles**, if we process vertices in **Topological Order**, by the time we arrive at vertex \`u\`, **every possible incoming path to \`u\` has already been relaxed**!
  - That means \`dist[u]\` is already finalized, and we only need to relax \`u\`'s outgoing edges once!
- **Two-Step Algorithm (\`O(N + M)\` Time, \`O(N + M)\` Space):**
  1. **Step 1 (Topological Sort):** Build the weighted adjacency list \`adj[u].push_back({v, wt})\` and perform DFS Topological Sort to populate \`stack<int> st\`.
  2. **Step 2 (Relax Edges in Stack Order):**
     - Initialize \`dist[N]\` with \`1e9\` (\`infinity\`), and set \`dist[src] = 0\`.
     - Pop vertices \`u\` one by one from \`st\`. If \`dist[u] != 1e9\`, relax all outgoing edges \`(v, wt)\`:
       **\`if (dist[u] + wt < dist[v]) dist[v] = dist[u] + wt;\`**.
     - Replace any remaining \`1e9\` values with \`-1\`.

### 💻 Shortest Path in DAG Blueprint
\`\`\`cpp
void topoSortDFS(int u, const vector<pair<int, int>> adj[], vector<int> &seen, stack<int> &st) {
    seen[u] = 1;
    for (auto [v, wt] : adj[u]) {
        if (!seen[v]) {
            topoSortDFS(v, adj, seen, st);
        }
    }
    st.push(u);
}

vector<int> shortestPathInDAG(int N, int M, vector<vector<int>> &edges) {
    vector<pair<int, int>> adj[N];
    for (const auto &e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
    }

    vector<int> seen(N, 0);
    stack<int> st;
    for (int i = 0; i < N; i++) {
        if (!seen[i]) topoSortDFS(i, adj, seen, st);
    }

    vector<int> dist(N, 1e9);
    dist[0] = 0; // Source node is 0

    while (!st.empty()) {
        int u = st.top();
        st.pop();

        if (dist[u] != 1e9) {
            for (auto [v, wt] : adj[u]) {
                if (dist[u] + wt < dist[v]) {
                    dist[v] = dist[u] + wt;
                }
            }
        }
    }

    for (int i = 0; i < N; i++) {
        if (dist[i] == 1e9) dist[i] = -1;
    }
    return dist;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using \`INT_MAX\` Without Checking Reachability:** If \`dist[u] == INT_MAX\`, computing \`dist[u] + wt\` overflows a 32-bit signed integer into a negative number! Use \`1e9\` as infinity and only relax outgoing edges when \`dist[u] != 1e9\`.`),
      theorySummary: cleanText(`Shortest Path in a DAG:
1. Find topological order using DFS stack.
2. Initialize distance array with 1e9, dist[src] = 0.
3. Relax edges in topological order: if dist[u] + wt < dist[v], dist[v] = dist[u] + wt.
Complexity: O(N + M) time, O(N + M) space.`),
    },

    {
      order: 153,
      name: "Unit-Weight BFS Relaxation: Shortest Path in an Undirected Graph With Unit Weights",
      slug: "dsa-shortest-path-in-undirected-graph-unit-weights",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Compute single-source shortest paths in undirected graphs with unit weights using queue-based BFS in O(V + 2E) time.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 153: Shortest Path in Undirected Graph with Unit Weights",
          url: cleanUrl("https://www.youtube.com/watch?v=C4gxoTaI71U"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Shortest Path in Undirected Graph with Unit Weights",
          url: "https://takeuforward.org/data-structure/shortest-path-in-undirected-graph-with-unit-distance/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Shortest Path in Undirected Graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1"),
          difficulty: "Medium",
          description: "Find the shortest distance from a given source vertex to all other vertices in an undirected unit-weight graph.",
        },
        {
          platform: "LeetCode",
          title: "Shortest Path in Binary Matrix (LC 1091)",
          url: cleanUrl("https://leetcode.com/problems/shortest-path-in-binary-matrix/"),
          difficulty: "Medium",
          description: "Use unit-weight BFS to find the shortest 8-directional clear path from top-left to bottom-right.",
        },
        {
          platform: "LeetCode",
          title: "Shortest Path with Alternating Colors (LC 1129)",
          url: cleanUrl("https://leetcode.com/problems/shortest-path-with-alternating-colors/"),
          difficulty: "Medium",
          description: "Apply unit-weight BFS with edge-color state tracking to compute shortest alternating paths.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an **Undirected Graph** with \`N\` vertices and \`M\` edges where **every edge has a unit weight of \`1\`**, find the shortest path distance from a given \`src\` vertex to every vertex in the graph (or \`-1\` if unreachable).

### 💡 Key Takeaways
- **Why Standard BFS Guarantees Shortest Paths for Unit Weights:**
  - In a graph where every edge costs \`1\`, a FIFO Queue (\`queue<int>\`) naturally explores vertices in strictly non-decreasing order of distance (\`dist = 0\`, then \`dist = 1\`, then \`dist = 2\`, etc.).
  - Therefore, we do not need a Priority Queue or sorting—a plain \`queue<int>\` achieves optimal **\`O(V + 2E)\`** time!
- **Algorithm Steps (\`O(V + 2E)\` Time, \`O(V)\` Space):**
  1. Build the undirected adjacency list \`adj\`.
  2. Initialize \`dist[N]\` with \`1e9\`, set \`dist[src] = 0\`, and push \`src\` into \`queue<int> q\`.
  3. While \`!q.empty()\`:
     - Pop \`u = q.front()\`.
     - For each neighbor \`v\` in \`adj[u]\`:
       - If **\`dist[u] + 1 < dist[v]\`**: update \`dist[v] = dist[u] + 1\` and push \`v\` into \`q\`.
  4. Convert any remaining \`1e9\` values in \`dist\` to \`-1\`.

### 💻 Shortest Path in Unit-Weight Undirected Graph Blueprint
\`\`\`cpp
vector<int> shortestPathUnitWeights(vector<vector<int>> &edges, int N, int M, int src) {
    vector<vector<int>> adj(N);
    for (const auto &e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }

    vector<int> dist(N, 1e9);
    dist[src] = 0;
    queue<int> q;
    q.push(src);

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v : adj[u]) {
            if (dist[u] + 1 < dist[v]) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }

    for (int i = 0; i < N; i++) {
        if (dist[i] == 1e9) dist[i] = -1;
    }
    return dist;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Hardcoding \`src = 0\`:** Always read the problem signature carefully—many unit-weight shortest path problems pass an arbitrary \`src\` parameter rather than starting at vertex \`0\`!`),
      theorySummary: cleanText(`Shortest Path in Undirected Graph with Unit Weights:
1. Standard FIFO BFS explores vertices in non-decreasing order of distance.
2. Relax neighbors: if dist[u] + 1 < dist[v], dist[v] = dist[u] + 1 and push v to queue.
Complexity: O(V + 2E) time, O(V) space.`),
    },

    {
      order: 154,
      name: "Implicit State-Space BFS: Word Ladder I (Shortest Transformation Sequence)",
      slug: "dsa-word-ladder-i-shortest-paths",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Find shortest transformation sequence length from startWord to targetWord using level-order BFS and set pruning.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 154: Word Ladder - I | Shortest Paths",
          url: cleanUrl("https://www.youtube.com/watch?v=tRPda0rcf8E"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Word Ladder I",
          url: "https://takeuforward.org/data-structure/word-ladder-i-shortest-paths/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Word Ladder (LC 127)",
          url: cleanUrl("https://leetcode.com/problems/word-ladder/"),
          difficulty: "Hard",
          description: "Return the number of words in the shortest transformation sequence from beginWord to endWord.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Genetic Mutation (LC 433)",
          url: cleanUrl("https://leetcode.com/problems/minimum-genetic-mutation/"),
          difficulty: "Medium",
          description: "Find the minimum number of single-character gene mutations needed to reach endGene using BFS.",
        },
        {
          platform: "LeetCode",
          title: "Open the Lock (LC 752)",
          url: cleanUrl("https://leetcode.com/problems/open-the-lock/"),
          difficulty: "Medium",
          description: "Model 4-wheel lock combinations as an implicit unit-weight graph and find the shortest path via BFS.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a \`startWord\`, a \`targetWord\`, and a dictionary \`wordList\`, find the **length of the shortest transformation sequence** from \`startWord\` to \`targetWord\` such that:
1. Only **one letter** can be changed at a time.
2. Every transformed intermediate word must exist in \`wordList\`.
Return \`0\` if no such sequence exists.

### 💡 Key Takeaways
- **Modeling Word Transitions as an Implicit Unit-Weight Graph:**
  - Treat each word as a node. An edge of weight \`1\` connects two words if they differ by exactly 1 character.
  - Because we want the **shortest** sequence in an unweighted graph, we use **Level-Order BFS**!
- **Fast Neighbor Discovery via \`unordered_set\` (\`26 * wordLength\` Check):**
  - Insert all words from \`wordList\` into an \`unordered_set<string> st\` for \`O(1)\` lookup and deletion.
  - Push \`{startWord, 1}\` into \`queue<pair<string, int>> q\` and erase \`startWord\` from \`st\` (erasing acts as marking visited!).
  - When popping \`{word, steps}\`:
    - For each character index \`i\` from \`0\` to \`word.size() - 1\`, try replacing \`word[i]\` with \`'a'\` through \`'z'\`.
    - If the mutated \`word\` exists in \`st\`, erase it from \`st\` and push \`{word, steps + 1}\` into \`q\`.
- **Complexity:** \`O(N * wordLength * 26)\` Time and \`O(N * wordLength)\` Space.

### 💻 Word Ladder I Blueprint
\`\`\`cpp
int wordLadderLength(string startWord, string targetWord, vector<string> &wordList) {
    unordered_set<string> st(wordList.begin(), wordList.end());
    if (st.find(targetWord) == st.end()) return 0;

    queue<pair<string, int>> q;
    q.push({startWord, 1});
    st.erase(startWord); // Mark startWord as visited

    while (!q.empty()) {
        auto [word, steps] = q.front();
        q.pop();

        if (word == targetWord) return steps;

        for (int i = 0; i < word.size(); i++) {
            char originalChar = word[i];
            for (char ch = 'a'; ch <= 'z'; ch++) {
                word[i] = ch;
                if (st.find(word) != st.end()) {
                    st.erase(word); // Erase immediately to prevent duplicate queue pushes
                    q.push({word, steps + 1});
                }
            }
            word[i] = originalChar; // Restore character before moving to next index
        }
    }
    return 0;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Restore \`word[i] = originalChar\`:** After testing \`'a'\` through \`'z'\` at index \`i\`, you must restore \`word[i]\` back to \`originalChar\` before moving to index \`i + 1\`!`),
      theorySummary: cleanText(`Word Ladder I:
1. Model word transformations as implicit unit-weight graph.
2. Try mutating each character 'a'..'z' and look up in dictionary set.
3. Erase from set upon queue insertion to mark visited.
Complexity: O(N * wordLength * 26) time, O(N * wordLength) space.`),
    },

    {
      order: 155,
      name: "Level-Delayed Set Erasure: Word Ladder II (All Shortest Transformation Sequences)",
      slug: "dsa-word-ladder-ii-shortest-paths-bfs",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Enumerate all shortest transformation sequences by delaying word erasure until each BFS level completes.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 155: Word Ladder - II | Shortest Paths",
          url: cleanUrl("https://www.youtube.com/watch?v=DREutrv2XD0"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Word Ladder II",
          url: "https://takeuforward.org/data-structure/word-ladder-ii-shortest-paths/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Word Ladder II",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/word-ladder-ii/1"),
          difficulty: "Hard",
          description: "Find all possible shortest transformation sequences from startWord to targetWord.",
        },
        {
          platform: "LeetCode",
          title: "Word Ladder II (LC 126)",
          url: cleanUrl("https://leetcode.com/problems/word-ladder-ii/"),
          difficulty: "Hard",
          description: "Return all shortest transformation sequences from beginWord to endWord.",
        },
        {
          platform: "LeetCode",
          title: "Word Ladder (LC 127)",
          url: cleanUrl("https://leetcode.com/problems/word-ladder/"),
          difficulty: "Hard",
          description: "Contrast finding the shortest sequence length with enumerating all shortest sequences.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Unlike Word Ladder I (which only asks for the shortest length), **Word Ladder II** asks you to return **all possible shortest transformation sequences** from \`startWord\` to \`targetWord\`.

### 💡 Key Takeaways
- **Storing Full Sequences in the Queue (\`queue<vector<string>>\`):**
  - Instead of storing a single word in the queue, store the **entire path vector** \`vector<string>\` taken so far (e.g., \`{"der", "dfr", "dfs"}\`).
  - To expand a path, look at its last word \`word = vec.back()\` and try all \`'a'..'z'\` single-character replacements.
- **Why We Must Delay Erasing Words Until the Level Finishes:**
  - Suppose two different paths at Level 2 (\`{"der", "dfr"}\` and \`{"der", "dkr"}\`) both transition into \`"dfs"\` at Level 3.
  - If \`"dfr"\` immediately erases \`"dfs"\` from the dictionary set \`st\`, then \`"dkr"\` will not be able to use \`"dfs"\`, causing us to miss a valid shortest path!
  - **The Fix:** Track \`usedOnLevel\` words during the current BFS level, and only erase them from \`st\` **when advancing to the next level** (\`if (vec.size() > level)\`).

### 💻 Word Ladder II (Path-Queue BFS) Blueprint
\`\`\`cpp
vector<vector<string>> findSequences(string beginWord, string endWord, vector<string> &wordList) {
    unordered_set<string> st(wordList.begin(), wordList.end());
    queue<vector<string>> q;
    q.push({beginWord});

    vector<string> usedOnLevel;
    usedOnLevel.push_back(beginWord);
    int level = 0;
    vector<vector<string>> ans;

    while (!q.empty()) {
        vector<string> vec = q.front();
        q.pop();

        // Erase all words used in the previous level once we advance to a new level
        if (vec.size() > level) {
            level++;
            for (const string &used : usedOnLevel) {
                st.erase(used);
            }
            usedOnLevel.clear();
        }

        string word = vec.back();
        if (word == endWord) {
            if (ans.empty() || ans[0].size() == vec.size()) {
                ans.push_back(vec);
            }
        }

        for (int i = 0; i < word.size(); i++) {
            char original = word[i];
            for (char c = 'a'; c <= 'z'; c++) {
                word[i] = c;
                if (st.count(word) > 0) {
                    vec.push_back(word);
                    q.push(vec);
                    usedOnLevel.push_back(word);
                    vec.pop_back(); // Backtrack path vector for next neighbor
                }
            }
            word[i] = original;
        }
    }
    return ans;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Erasing Words Immediately Upon Push:** Immediate erasure works for Word Ladder I, but in Word Ladder II it prunes away alternative shortest paths that converge on the same intermediate word at the same level!`),
      theorySummary: cleanText(`Word Ladder II (Level-Delayed Erasure):
1. Queue stores full sequence vectors.
2. Delay erasing words from dictionary set until current level finishes to preserve converging paths.
3. Return all paths matching minimum transformation length.`),
    },

    {
      order: 156,
      name: "Two-Phase BFS + Backwards DFS: Word Ladder II (Optimized Approach for Competitive Constraints)",
      slug: "dsa-word-ladder-ii-optimized-bfs-backtracking"
      ,
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Scale Word Ladder II to competitive constraints using forward step-distance BFS and backwards DFS backtracking.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 156: Word Ladder 2 | Optimised Approach for Leetcode",
          url: cleanUrl("https://www.youtube.com/watch?v=AD4SFl7tu7I"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Word Ladder II Optimized",
          url: "https://takeuforward.org/data-structure/word-ladder-ii-optimised-approach-for-leetcode/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Word Ladder II (LC 126)",
          url: cleanUrl("https://leetcode.com/problems/word-ladder-ii/"),
          difficulty: "Hard",
          description: "Implement the 2-phase BFS + reverse DFS backtracking solution to pass strict LeetCode memory/time limits.",
        },
        {
          platform: "LeetCode",
          title: "Bus Routes (LC 815)",
          url: cleanUrl("https://leetcode.com/problems/bus-routes/"),
          difficulty: "Hard",
          description: "Use BFS over route transitions to find the minimum number of buses to reach target.",
        },
        {
          platform: "LeetCode",
          title: "Word Ladder (LC 127)",
          url: cleanUrl("https://leetcode.com/problems/word-ladder/"),
          difficulty: "Hard",
          description: "Use Phase 1 of the optimized approach to map minimum step distances for each word.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
On platforms with strict time and memory limits (like LeetCode 126), storing full \`vector<string>\` paths inside a BFS queue causes **Memory Limit Exceeded (MLE) / Time Limit Exceeded (TLE)** because the number of partial paths explodes exponentially. We solve this using a **Two-Phase Approach**.

### 💡 Key Takeaways
- **Phase 1: Forward Word-Only BFS (\`unordered_map<string, int> mpp\`):**
  - Run standard Word Ladder I BFS storing **only strings** in the queue (\`queue<string>\`), and record the exact minimum step level of every reached word in \`mpp[word] = steps\`.
  - Stop as soon as \`endWord\` is popped.
- **Phase 2: Backwards DFS from \`endWord\` to \`beginWord\`:**
  - Why backtrack from \`endWord\` to \`beginWord\` instead of forward? Because many forward paths hit dead ends, whereas walking backwards from \`endWord\` along edges where **\`mpp[prevWord] + 1 == mpp[word]\`** explores **only valid shortest paths** with zero wasted dead-end branches!
  - When \`word == beginWord\`, reverse the current sequence and add it to \`ans\`.

### 💻 Word Ladder II (Optimized Two-Phase) Blueprint
\`\`\`cpp
class Solution {
    unordered_map<string, int> mpp;
    vector<vector<string>> ans;
    string bWord;

    void dfsBacktrack(string word, vector<string> &seq) {
        if (word == bWord) {
            reverse(seq.begin(), seq.end());
            ans.push_back(seq);
            reverse(seq.begin(), seq.end()); // Restore for backtracking
            return;
        }
        int steps = mpp[word];
        for (int i = 0; i < word.size(); i++) {
            char original = word[i];
            for (char ch = 'a'; ch <= 'z'; ch++) {
                word[i] = ch;
                if (mpp.find(word) != mpp.end() && mpp[word] + 1 == steps) {
                    seq.push_back(word);
                    dfsBacktrack(word, seq);
                    seq.pop_back();
                }
            }
            word[i] = original;
        }
    }

public:
    vector<vector<string>> findLadders(string beginWord, string endWord, vector<string> &wordList) {
        unordered_set<string> st(wordList.begin(), wordList.end());
        queue<string> q;
        bWord = beginWord;
        q.push(beginWord);
        mpp[beginWord] = 1;
        st.erase(beginWord);

        // Phase 1: Forward BFS to record minimum step depths
        while (!q.empty()) {
            string word = q.front();
            int steps = mpp[word];
            q.pop();
            if (word == endWord) break;

            for (int i = 0; i < word.size(); i++) {
                char original = word[i];
                for (char ch = 'a'; ch <= 'z'; ch++) {
                    word[i] = ch;
                    if (st.count(word)) {
                        q.push(word);
                        st.erase(word);
                        mpp[word] = steps + 1;
                    }
                }
                word[i] = original;
            }
        }

        // Phase 2: Backwards DFS from endWord to beginWord
        if (mpp.find(endWord) != mpp.end()) {
            vector<string> seq = {endWord};
            dfsBacktrack(endWord, seq);
        }
        return ans;
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Re-Reverse \`seq\` After Pushing to \`ans\`:** In \`dfsBacktrack\`, \`seq\` is passed by reference! After reversing \`seq\` to push the forward-ordered path into \`ans\`, you **must reverse \`seq\` back** before returning so caller stack frames aren't corrupted!`),
      theorySummary: cleanText(`Word Ladder II (Optimized Two-Phase):
1. Phase 1: Forward BFS records minimum distance steps for each word in an unordered_map.
2. Phase 2: Backwards DFS from endWord to beginWord follows only edges where mpp[prev] + 1 == mpp[curr].
3. Avoids queue memory explosion and dead-end branches.`),
    },

    {
      order: 157,
      name: "Greedy Min-Heap Relaxation: Dijkstra's Shortest Path Algorithm Using Priority Queue (Part 1)",
      slug: "dsa-dijkstras-algorithm-using-priority-queue",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Implement Dijkstra's single-source shortest path algorithm using a min-heap priority queue in O(E log V) time.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 157: Dijkstra's Algorithm - Using Priority Queue - Part 1",
          url: cleanUrl("https://www.youtube.com/watch?v=V6H1qAeB-l4"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Dijkstra's Algorithm Using Priority Queue",
          url: "https://takeuforward.org/data-structure/dijkstras-algorithm-using-priority-queue-g-32/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Implementing Dijkstra Algorithm",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1"),
          difficulty: "Medium",
          description: "Find the shortest distance from source vertex S to all vertices in a weighted undirected graph.",
        },
        {
          platform: "LeetCode",
          title: "Network Delay Time (LC 743)",
          url: cleanUrl("https://leetcode.com/problems/network-delay-time/"),
          difficulty: "Medium",
          description: "Use Dijkstra's min-heap algorithm to find the time it takes for all N nodes to receive a signal.",
        },
        {
          platform: "LeetCode",
          title: "Path with Maximum Probability (LC 1514)",
          url: cleanUrl("https://leetcode.com/problems/path-with-maximum-probability/"),
          difficulty: "Medium",
          description: "Adapt Dijkstra's priority queue relaxation to maximize product probabilities along a path.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Dijkstra's Algorithm** finds the shortest path from a starting source node \`S\` to all other vertices in a directed or undirected weighted graph with **non-negative edge weights**.

### 💡 Key Takeaways
- **Min-Heap Priority Queue (\`priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>>\`):**
  - Stores pairs of **\`{distance, node}\`** ordered so the smallest distance is always at the top.
  - Initialize \`dist[V]\` with \`1e9\`, set \`dist[S] = 0\`, and push \`{0, S}\` into the min-heap.
  - While \`!pq.empty()\`:
    - Pop \`{d, u} = pq.top()\`.
    - For each neighbor \`{v, edgeWeight}\` in \`adj[u]\`:
      - If **\`d + edgeWeight < dist[v]\`**:
        - Update \`dist[v] = d + edgeWeight\`.
        - Push \`{dist[v], v}\` into \`pq\`.
- **Why Dijkstra Fails on Negative Weights:**
  - A negative edge weight (e.g., \`-2\`) creates a negative cycle where traversing the edge back and forth reduces distance infinitely (\`-2, -4, -6...\`), trapping the priority queue in an infinite loop!
- **Complexity:** \`O(E log V)\` Time and \`O(V + E)\` Space.

### 💻 Dijkstra's Algorithm (Min-Heap) Blueprint
\`\`\`cpp
vector<int> dijkstraPriorityQueue(int V, vector<vector<int>> adj[], int S) {
    // Min-heap storing {distance, node}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(V, 1e9);

    dist[S] = 0;
    pq.push({0, S});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        for (const auto &edge : adj[u]) {
            int v = edge[0];
            int wt = edge[1];

            if (d + wt < dist[v]) {
                dist[v] = d + wt;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Putting \`{node, distance}\` Instead of \`{distance, node}\` in the Pair:** C++ \`pair\` sorts by \`.first\` first! You **must** put \`distance\` as \`.first\` (\`{dist[v], v}\`) so the min-heap orders elements by shortest distance!`),
      theorySummary: cleanText(`Dijkstra's Algorithm (Min-Heap):
1. Priority queue orders pairs by {distance, node}.
2. Initialize dist array to 1e9, dist[src] = 0.
3. Pop smallest distance, relax outgoing edges: if d + wt < dist[v], dist[v] = d + wt and push {dist[v], v}.
Complexity: O(E log V) time, O(V + E) space.`),
    },

    {
      order: 158,
      name: "Ordered Set Pruning: Dijkstra's Shortest Path Algorithm Using std::set (Part 2)",
      slug: "dsa-dijkstras-algorithm-using-set",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Implement Dijkstra's shortest path algorithm using std::set with active stale-entry deletion.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 158: Dijkstra's Algorithm - Using Set - Part 2",
          url: cleanUrl("https://www.youtube.com/watch?v=PATgNiuTP20"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Dijkstra's Algorithm Using Set",
          url: "https://takeuforward.org/data-structure/dijkstras-algorithm-using-set-g-33/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Implementing Dijkstra Algorithm (Set)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1"),
          difficulty: "Medium",
          description: "Implement Dijkstra's algorithm using std::set to erase stale distance entries upon relaxation.",
        },
        {
          platform: "LeetCode",
          title: "Design Graph With Shortest Path Calculator (LC 2642)",
          url: cleanUrl("https://leetcode.com/problems/design-graph-with-shortest-path-calculator/"),
          difficulty: "Hard",
          description: "Support dynamic edge additions and shortest-path queries using Dijkstra's algorithm.",
        },
        {
          platform: "LeetCode",
          title: "Path With Minimum Effort (LC 1631)",
          url: cleanUrl("https://leetcode.com/problems/path-with-minimum-effort/"),
          difficulty: "Medium",
          description: "Use Dijkstra's relaxation on a 2D grid to minimize the maximum absolute height difference.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
How does implementing **Dijkstra's Algorithm using \`std::set<pair<int, int>>\`** differ from using a \`priority_queue\`? Because \`std::set\` keeps elements in sorted ascending order **and** supports \`st.erase()\`, we can actively delete outdated \`{oldDist, v}\` pairs whenever we find a shorter path to \`v\`!

### 💡 Key Takeaways
- **Why Use a \`set\`?**
  - In a \`priority_queue\`, if \`dist[v]\` improves from \`10\` to \`8\`, \`{10, v}\` stays in the heap as a stale entry alongside \`{8, v}\`.
  - In a \`set\`, before updating \`dist[v] = 8\`, we check if \`dist[v] != 1e9\`: if so, we call **\`st.erase({dist[v], v})\`** to remove the outdated pair \`{10, v}\`, avoiding redundant future iterations!
- **Does \`set\` Beat \`priority_queue\` Asymptotically?**
  - No! \`st.erase()\` itself takes \`O(log V)\` time, and \`std::set\` has higher memory/pointer overhead than a contiguous vector-backed \`priority_queue\`. Both run in **\`O(E log V)\`** time.

### 💻 Dijkstra's Algorithm (Using Set) Blueprint
\`\`\`cpp
vector<int> dijkstraUsingSet(int V, vector<vector<int>> adj[], int S) {
    set<pair<int, int>> st; // Stores {distance, node} in ascending order
    vector<int> dist(V, 1e9);

    st.insert({0, S});
    dist[S] = 0;

    while (!st.empty()) {
        auto it = *(st.begin());
        int d = it.first;
        int u = it.second;
        st.erase(it);

        for (const auto &edge : adj[u]) {
            int v = edge[0];
            int wt = edge[1];

            if (d + wt < dist[v]) {
                // If v was already visited with a larger distance, erase the stale entry
                if (dist[v] != 1e9) {
                    st.erase({dist[v], v});
                }
                dist[v] = d + wt;
                st.insert({dist[v], v});
            }
        }
    }
    return dist;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Erasing After Updating \`dist[v]\`:** You must call \`st.erase({dist[v], v})\` **before** overwriting \`dist[v] = d + wt\`, because the set currently holds the *old* distance \`dist[v]\`!`),
      theorySummary: cleanText(`Dijkstra's Algorithm (Using Set):
1. std::set stores {distance, node} in sorted ascending order.
2. On finding a shorter path to v, erase the old {dist[v], v} pair before inserting the new one.
3. Eliminates stale heap entries at the cost of O(log V) erase operations.
Complexity: O(E log V) time, O(V) space.`),
    },

    {
      order: 159,
      name: "Algorithmic Analysis: Why Priority Queue Over Queue & Time Complexity Derivation of Dijkstra (Part 3)",
      slug: "dsa-dijkstras-algorithm-intuition-and-time-complexity",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Analyze why min-heap priority queues prevent redundant edge propagations and derive Dijkstra's O(E log V) complexity.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 159: Why Priority Queue is used in Dijkstra's Algorithm | Time Complexity Derivation - Part 3",
          url: cleanUrl("https://www.youtube.com/watch?v=3dINsjyfooY"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Dijkstra's Algorithm Intuition and Complexity",
          url: "https://takeuforward.org/data-structure/dijkstras-algorithm-intuition-and-time-complexity-derivation-g-34/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Network Delay Time (LC 743)",
          url: cleanUrl("https://leetcode.com/problems/network-delay-time/"),
          difficulty: "Medium",
          description: "Add an early-skip check (if d > dist[u] continue) to optimize priority queue Dijkstra.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Time to Visit Disappearing Nodes (LC 3112)",
          url: cleanUrl("https://leetcode.com/problems/minimum-time-to-visit-disappearing-nodes/"),
          difficulty: "Medium",
          description: "Apply Dijkstra's algorithm where skipping stale heap entries is mandatory to avoid TLE.",
        },
        {
          platform: "LeetCode",
          title: "Cheapest Flights Within K Stops (LC 787)",
          url: cleanUrl("https://leetcode.com/problems/cheapest-flights-within-k-stops/"),
          difficulty: "Medium",
          description: "Understand when a plain Queue sorted by stops is used vs. a Priority Queue sorted by cost.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Why do we use a **Priority Queue (\`O(E log V)\`)** instead of a plain **FIFO Queue** in Dijkstra's Algorithm, and how do we mathematically derive **\`O(E log V)\`** from first principles?

### 💡 Key Takeaways
- **1. Why a Priority Queue Instead of a Plain Queue?**
  - A plain \`queue\` will still eventually find the correct shortest distances, **but** it processes paths in arbitrary weight order.
  - If you explore a costly edge \`(0 → 1, weight = 100)\` first using a plain queue, you will relax all of \`1\`'s descendants with \`100 + ...\`, and then later when you discover \`(0 → 2 → 1, weight = 3)\`, you have to **re-relax** the entire subgraph all over again (degrading toward \`O(V * E)\`)!
  - A **Min-Heap** greedily pops the **minimal distance first**, guaranteeing we never waste time propagating suboptimal heavy paths.
- **2. Step-by-Step Derivation of \`O(E log V)\`:**
  - In the worst-case dense graph, each vertex has \`V - 1\` edges, so the heap can hold at most \`V²\` pairs (\`heapSize <= V²\`).
  - The outer loop runs at most \`V\` times, and for each vertex we iterate over its \`ne\` outgoing edges, doing a heap push (\`log(heapSize)\`):
    - \`Time = V * (popTime + ne * pushTime)\`
    - \`Time = V * (log(heapSize) + (V - 1) * log(heapSize))\`
    - \`Time = V * V * log(V²)\`
    - Since \`V² = E\` in a dense graph and \`log(V²) = 2 log V\`:
    - **\`Time = E * 2 log V = O(E log V)\`**!

### 💻 Optimized Dijkstra With Stale-Entry Skip Blueprint
\`\`\`cpp
vector<int> dijkstraOptimized(int V, vector<vector<pair<int, int>>> &adj, int src) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(V, 1e9);

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        // Crucial Optimization: Skip stale heap entries immediately!
        if (d > dist[u]) continue;

        for (auto [v, wt] : adj[u]) {
            if (d + wt < dist[v]) {
                dist[v] = d + wt;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Stating Dijkstra's Complexity as \`O(V log V)\`:** Remember that in connected graphs \`E >= V - 1\` (and up to \`V²\`), so edge relaxations dominate—always state the complexity as **\`O(E log V)\`**!`),
      theorySummary: cleanText(`Dijkstra's Intuition & Time Complexity:
1. Plain queue leads to redundant re-relaxations of subgraphs, approaching O(V * E).
2. Min-heap prioritizes minimal distances, ensuring each node is finalized efficiently.
3. Derivation: V pops + E pushes into heap of size <= V^2 yields O(E log V).
4. Optimize min-heap Dijkstra with: if (d > dist[u]) continue.`),
    },

    {
      order: 160,
      name: "Parent-Pointer Backtracking: Print Shortest Path in a Weighted Graph Using Dijkstra's Algorithm",
      slug: "dsa-print-shortest-path-dijkstras-algorithm",
      subtrack: "Module 24: Shortest Path Algorithms in Graphs: DAG Relaxation, BFS & Dijkstra's Algorithm",
      description: "Reconstruct and return the exact vertex sequence of the shortest path between two nodes using parent tracking.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 160: Print Shortest Path - Dijkstra's Algorithm",
          url: cleanUrl("https://www.youtube.com/watch?v=rp1SMw7HSO8"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Print Shortest Path - Dijkstra's Algorithm",
          url: "https://takeuforward.org/data-structure/print-shortest-path-dijkstras-algorithm-g-35/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Shortest Path in Weighted undirected graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/shortest-path-in-weighted-undirected-graph/1"),
          difficulty: "Medium",
          description: "Reconstruct and return the actual shortest path from vertex 1 to vertex N in a weighted undirected graph.",
        },
        {
          platform: "LeetCode",
          title: "Number of Ways to Arrive at Destination (LC 1976)",
          url: cleanUrl("https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/"),
          difficulty: "Medium",
          description: "Combine Dijkstra's relaxation with dynamic programming path counting.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Weighted Subgraph With the Required Paths (LC 2203)",
          url: cleanUrl("https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/"),
          difficulty: "Hard",
          description: "Run Dijkstra from multiple sources to reconstruct optimal meeting paths.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a weighted undirected graph with \`N\` vertices (\`1\` to \`N\`) and \`M\` edges, find and **reconstruct the actual sequence of vertices** along the shortest path from vertex \`1\` to vertex \`N\` (or return \`{-1}\` if vertex \`N\` is unreachable).

### 💡 Key Takeaways
- **The \`parent[]\` Memoization Array:**
  - How do we remember *where* the shortest path to each node came from?
  - Create a \`parent[N + 1]\` array where initially every node is its own parent: **\`parent[i] = i\`**.
  - During Dijkstra's relaxation, whenever **\`d + wt < dist[v]\`**:
    1. Update \`dist[v] = d + wt\`.
    2. Record **\`parent[v] = u\`** (remembering that the best path to \`v\` came directly from \`u\`)!
- **Backtracking the Path From Destination \`N\` to Source \`1\`:**
  - If \`dist[N] == 1e9\`, return \`{-1}\`.
  - Start at \`node = N\`. While \`parent[node] != node\`:
    - Push \`node\` into \`path\` and step backward: \`node = parent[node]\`.
  - Push \`1\` into \`path\`, **reverse \`path\`**, and return it!
- **Complexity:** \`O(E log V + V)\` Time and \`O(V + E)\` Space.

### 💻 Print Shortest Path (Dijkstra + Parent Array) Blueprint
\`\`\`cpp
vector<int> shortestPath(int n, int m, vector<vector<int>> &edges) {
    vector<pair<int, int>> adj[n + 1];
    for (const auto &e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});
    }

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(n + 1, 1e9), parent(n + 1);
    for (int i = 1; i <= n; i++) parent[i] = i;

    dist[1] = 0;
    pq.push({0, 1});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        for (auto [v, wt] : adj[u]) {
            if (d + wt < dist[v]) {
                dist[v] = d + wt;
                pq.push({dist[v], v});
                parent[v] = u; // Record where v came from along its shortest path
            }
        }
    }

    if (dist[n] == 1e9) return {-1};

    // Reconstruct path backwards from n to 1
    vector<int> path;
    int node = n;
    while (parent[node] != node) {
        path.push_back(node);
        node = parent[node];
    }
    path.push_back(1);
    reverse(path.begin(), path.end());
    return path;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Push the Source Vertex \`1\` After the \`while (parent[node] != node)\` Loop:** Because \`parent[1] == 1\`, the \`while\` loop terminates as soon as \`node\` reaches \`1\`. Always call \`path.push_back(1)\` after the loop before reversing!`),
      theorySummary: cleanText(`Print Shortest Path (Dijkstra + Parent Array):
1. Maintain parent[N+1] array initialized with parent[i] = i.
2. When dist[v] updates, record parent[v] = u.
3. Reconstruct path backwards from dest to src, reverse path array, and return.
Complexity: O(E log V + V) time, O(V + E) space.`),
    },
  ];

  // 4. Upsert topics and nested resources
  console.log("\n📦 Upserting 10 Batch 16 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch16Topics) {
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

  // 5. Update track_topics: Link Batch 16 Topics to topic_order 151 through 160
  console.log("\n🔄 Linking Batch 16 topics to 'problem-solving-dsa-sql' (orders 151..160)...");

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

  // Link Batch 16 Topics (orders 151..160)
  for (const topicDef of batch16Topics) {
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

  console.log("\n🎉 DSA Batch 16 (Lectures 151–160) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch16()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch16;
