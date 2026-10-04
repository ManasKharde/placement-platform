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

const seedDsaBatch18 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 18 (Lectures 171–180) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 18 Topics (Lectures 171–180)
  const batch18Topics = [
    // =========================================================================
    // SUBTRACK: Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity (Topics 171–178)
    // =========================================================================
    {
      order: 171,
      name: "Dynamic Graph Connectivity: Disjoint Set (Union by Rank, Union by Size & Path Compression)",
      slug: "dsa-disjoint-set-union-by-rank-size-path-compression",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Perform near-constant time component lookups and dynamic component unions using path compression and union by rank/size.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 171: Disjoint Set (Union by Rank & Size, Path Compression)",
          url: cleanUrl("https://www.youtube.com/watch?v=aBxjDBC4M1U"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Disjoint Set Union",
          url: "https://takeuforward.org/data-structure/disjoint-set-union-by-rank-union-by-size-path-compression-g-46/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Disjoint set (Union-Find)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/disjoint-set-union-find/1"),
          difficulty: "Easy",
          description: "Implement find and unionSet operations for a Disjoint Set data structure.",
        },
        {
          platform: "LeetCode",
          title: "Redundant Connection (LC 684)",
          url: cleanUrl("https://leetcode.com/problems/redundant-connection/"),
          difficulty: "Medium",
          description: "Use Disjoint Set Union to identify the first edge that connects two vertices already in the same component.",
        },
        {
          platform: "LeetCode",
          title: "Satisfiability of Equality Equations (LC 990)",
          url: cleanUrl("https://leetcode.com/problems/satisfiability-of-equality-equations/"),
          difficulty: "Medium",
          description: "Union all '==' variable pairs first, then verify that no '!=' pair shares the same ultimate parent.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a graph whose edges are added dynamically, checking whether two nodes \`u\` and \`v\` belong to the same connected component using BFS/DFS takes \`O(V + E)\` time per query. The **Disjoint Set Union (DSU)** data structure answers connectivity queries and merges components in **nearly constant \`O(4 * alpha) ≈ O(1)\` time**!

### 💡 Key Takeaways
- **Two Core Operations of DSU:**
  1. **\`findUPar(node)\` (Find Ultimate Parent with Path Compression):**
     - Recursively climbs the \`parent[]\` tree until \`node == parent[node]\`, and rewires every intermediate node along the path to point **directly** to the ultimate root (\`return parent[node] = findUPar(parent[node])\`).
  2. **\`unionByRank(u, v)\` / \`unionBySize(u, v)\`:**
     - Find ultimate parents \`ulp_u = findUPar(u)\` and \`ulp_v = findUPar(v)\`. If \`ulp_u == ulp_v\`, they are already in the same set (\`return\`).
     - **Why attach the smaller tree under the larger tree?** Attaching the smaller tree under the larger one keeps the overall tree depth minimal, ensuring shorter paths for future lookups!
     - In **Union by Size**, maintain \`size[i] = 1\` initially; when attaching \`ulp_u\` under \`ulp_v\`, update \`parent[ulp_u] = ulp_v\` and \`size[ulp_v] += size[ulp_u]\`.
- **Complexity:** \`O(4 * alpha) ≈ O(1)\` amortized Time per operation (where \`alpha\` is the Inverse Ackermann function) and \`O(N)\` Space.

### 💻 Disjoint Set Class Blueprint (Union by Rank & Size)
~~~cpp
class DisjointSet {
    vector<int> rank, parent, size;
public:
    DisjointSet(int n) {
        rank.resize(n + 1, 0);
        parent.resize(n + 1);
        size.resize(n + 1, 1);
        for (int i = 0; i <= n; i++) parent[i] = i;
    }

    int findUPar(int node) {
        if (node == parent[node]) return node;
        return parent[node] = findUPar(parent[node]); // Path compression
    }

    void unionByRank(int u, int v) {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v) return;
        if (rank[ulp_u] < rank[ulp_v]) {
            parent[ulp_u] = ulp_v;
        } else if (rank[ulp_v] < rank[ulp_u]) {
            parent[ulp_v] = ulp_u;
        } else {
            parent[ulp_v] = ulp_u;
            rank[ulp_u]++;
        }
    }

    void unionBySize(int u, int v) {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v) return;
        if (size[ulp_u] < size[ulp_v]) {
            parent[ulp_u] = ulp_v;
            size[ulp_v] += size[ulp_u];
        } else {
            parent[ulp_v] = ulp_u;
            size[ulp_u] += size[ulp_v];
        }
    }

    int getSize(int node) {
        return size[findUPar(node)];
    }
};
~~~

### ⚠️ Common Mistakes to Avoid
- **Comparing \`parent[u] == parent[v]\` Instead of \`findUPar(u) == findUPar(v)\`:** Because path compression happens lazily during \`findUPar\`, \`parent[u]\` might not be up to date yet—always call \`findUPar(u) == findUPar(v)\` to check if two nodes share a component!`),
      theorySummary: cleanText(`Disjoint Set Union maintains dynamic components in nearly constant O(1) time using path compression and union by rank or size. Always verify shared components using findUPar(u) == findUPar(v).`),
    },

    // -------------------------------------------------------------------------
    // Topic 172
    // -------------------------------------------------------------------------
    {
      order: 172,
      name: "Greedy Edge-Sorted MST Construction: Kruskal's Algorithm Using Disjoint Set",
      slug: "dsa-kruskals-algorithm-minimum-spanning-tree",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Sort all edges by weight and greedily link disconnected components using Disjoint Set Union to build the Minimum Spanning Tree.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 172: Kruskal's Algorithm (Minimum Spanning Tree)",
          url: cleanUrl("https://www.youtube.com/watch?v=DMnDM_sxVig"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Kruskal's Algorithm",
          url: "https://takeuforward.org/data-structure/kruskals-algorithm-minimum-spanning-tree-g-47/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Minimum Spanning Tree (Kruskal's Algorithm)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1"),
          difficulty: "Medium",
          description: "Find the sum of weights of the Minimum Spanning Tree using Kruskal's Algorithm and Disjoint Set.",
        },
        {
          platform: "LeetCode",
          title: "Min Cost to Connect All Points (LC 1584)",
          url: cleanUrl("https://leetcode.com/problems/min-cost-to-connect-all-points/"),
          difficulty: "Medium",
          description: "Generate all pairwise edges, sort by Manhattan distance, and build the MST using Kruskal's algorithm.",
        },
        {
          platform: "LeetCode",
          title: "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree (LC 1489)",
          url: cleanUrl("https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/"),
          difficulty: "Hard",
          description: "Run Kruskal's MST with forced edge inclusion and exclusion to classify critical MST edges.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Kruskal's Algorithm** finds the **Minimum Spanning Tree (MST)** of a weighted undirected graph by sorting all edges in ascending order of weight and greedily adding each edge \`(u, v, wt)\` to the MST **if and only if \`u\` and \`v\` do not already belong to the same connected component** (checked in \`O(1)\` via Disjoint Set).

### 💡 Key Takeaways
- **Algorithm Steps:**
  1. Extract all edges as tuples \`{wt, {u, v}}\` and **sort them in ascending order of weight \`wt\`** (\`O(M log M)\`).
  2. Initialize a \`DisjointSet ds(V)\` where every vertex starts in its own component.
  3. Iterate through the sorted edges:
     - If **\`ds.findUPar(u) != ds.findUPar(v)\`**:
       - Add \`mstWt += wt\`.
       - Merge their components via \`ds.unionBySize(u, v)\`.
     - Else: skip the edge (adding it would create a cycle!).
- **Complexity:** \`O(V + E + E log E + E * 4 * alpha)\` Time and \`O(V + E)\` Space.

### 💻 Kruskal's Algorithm Blueprint
~~~cpp
int spanningTreeKruskal(int V, vector<vector<int>> adj[]) {
    vector<pair<int, pair<int, int>>> edges;
    for (int u = 0; u < V; u++) {
        for (const auto &it : adj[u]) {
            int v = it[0], wt = it[1];
            edges.push_back({wt, {u, v}});
        }
    }

    // 1. Sort all edges by weight ascending
    sort(edges.begin(), edges.end());

    // 2. Greedily union disconnected components
    DisjointSet ds(V);
    int mstWt = 0;

    for (const auto &e : edges) {
        int wt = e.first;
        int u = e.second.first;
        int v = e.second.second;

        if (ds.findUPar(u) != ds.findUPar(v)) {
            mstWt += wt;
            ds.unionBySize(u, v);
        }
    }
    return mstWt;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Worrying About Bidirectional Duplicate Edges in \`edges\`:** Even if an undirected edge \`(u, v)\` is added twice into \`edges\` (once from \`adj[u]\` and once from \`adj[v]\`), the first occurrence unions \`u\` and \`v\`, so the second occurrence automatically fails \`ds.findUPar(u) != ds.findUPar(v)\` and is harmlessly ignored!`),
      theorySummary: cleanText(`Kruskal's algorithm sorts all edges by weight and uses Disjoint Set Union to greedily combine disconnected vertices, preventing cycle formation in O(E log E) time.`),
    },

    // -------------------------------------------------------------------------
    // Topic 173
    // -------------------------------------------------------------------------
    {
      order: 173,
      name: "Ultimate-Parent Counting: Number of Provinces Using Disjoint Set",
      slug: "dsa-number-of-provinces-disjoint-set",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Count total connected graph components by linking adjacent vertices in DSU and counting nodes that serve as their own ultimate parent.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 173: Number of Provinces Using Disjoint Set",
          url: cleanUrl("https://www.youtube.com/watch?v=ZGr5nX-Gi6Y"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Provinces (DSU)",
          url: "https://takeuforward.org/data-structure/number-of-provinces-disjoint-set-g-48/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Provinces (LC 547)",
          url: cleanUrl("https://leetcode.com/problems/number-of-provinces/"),
          difficulty: "Medium",
          description: "Count the total number of provinces using Disjoint Set Union and ultimate-parent counting.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Number of Provinces",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-provinces/1"),
          difficulty: "Medium",
          description: "Find the number of connected components in an adjacency matrix using DSU.",
        },
        {
          platform: "LeetCode",
          title: "Number of Connected Components in an Undirected Graph (LC 323)",
          url: cleanUrl("https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/"),
          difficulty: "Medium",
          description: "Union all given edges and count the remaining distinct root parents.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
How do we count the **Number of Provinces (Connected Components)** using a **Disjoint Set** instead of BFS/DFS? After performing \`unionBySize(i, j)\` for every edge in the graph, each connected component has **exactly one unique ultimate parent (boss node)** where **\`ds.parent[i] == i\`**!

### 💡 Key Takeaways
- **Counting Components via Boss Nodes:**
  1. Initialize \`DisjointSet ds(V)\`.
  2. Loop over the adjacency matrix: whenever \`adj[i][j] == 1\`, call \`ds.unionBySize(i, j)\`.
  3. Loop \`i\` from \`0\` to \`V - 1\`: if **\`ds.findUPar(i) == i\`** (or \`ds.parent[i] == i\`), increment \`cnt++\`!
- **Complexity:** \`O(V²)\` Time (to scan the \`V x V\` input matrix) and \`O(V)\` Space.

### 💻 Number of Provinces (DSU) Blueprint
~~~cpp
int numProvincesDSU(vector<vector<int>> &adj, int V) {
    DisjointSet ds(V);

    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (adj[i][j] == 1) {
                ds.unionBySize(i, j);
            }
        }
    }

    int provinces = 0;
    for (int i = 0; i < V; i++) {
        // Count how many nodes are their own ultimate parent (component root)
        if (ds.findUPar(i) == i) {
            provinces++;
        }
    }
    return provinces;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Counting Distinct Values in \`parent[i]\` Without Calling \`findUPar(i)\`:** Unless you check \`ds.findUPar(i) == i\` (which simply checks if \`i\` is a root node where \`parent[i] == i\`), un-compressed intermediate parents in \`parent[]\` could mislead you if you try inserting \`parent[i]\` into a set! Checking \`ds.findUPar(i) == i\` is always safe and \`O(1)\`.`),
      theorySummary: cleanText(`Every connected component in DSU is represented by exactly one unique ultimate root node where findUPar(i) == i. Counting these roots yields the province count.`),
    },

    // -------------------------------------------------------------------------
    // Topic 174
    // -------------------------------------------------------------------------
    {
      order: 174,
      name: "Redundant Edge Re-Routing: Number of Operations to Make Network Connected (DSU)",
      slug: "dsa-number-of-operations-to-make-network-connected-dsu",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Detect cycle-forming redundant cables using DSU and determine whether they suffice to connect all disconnected components.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 174: Number of Operations to Make Network Connected",
          url: cleanUrl("https://www.youtube.com/watch?v=FYrl7iz9_ZU"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Operations to Make Network Connected",
          url: "https://takeuforward.org/data-structure/number-of-operations-to-make-network-connected-dsu-g-49/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Operations to Make Network Connected (LC 1319)",
          url: cleanUrl("https://leetcode.com/problems/number-of-operations-to-make-network-connected/"),
          difficulty: "Medium",
          description: "Return the minimum number of cables you need to extract and re-place to connect all computers, or -1 if impossible.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Connecting the graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/connecting-the-graph/1"),
          difficulty: "Medium",
          description: "Find the minimum number of edge re-wirings required to make a disconnected graph connected.",
        },
        {
          platform: "LeetCode",
          title: "Remove Max Number of Edges to Keep Graph Fully Traversable (LC 1579)",
          url: cleanUrl("https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/"),
          difficulty: "Hard",
          description: "Count redundant edges across two DSU instances while ensuring full graph connectivity.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given \`n\` computers (\`0\` to \`n - 1\`) and a list of existing cables \`edges\`, you can unplug any **redundant cable** (an edge that forms a cycle within an already-connected component) and use it to connect two disconnected components. Find the **minimum number of operations** to connect the entire network, or return \`-1\` if there aren't enough extra cables.

### 💡 Key Takeaways
- **Connecting \`C\` Components Requires \`C - 1\` Cables:**
  - If the graph currently has \`cntC\` connected components, we need **at least \`ans = cntC - 1\` cables** to link them into a single component.
- **How to Count \`cntExtras\` (Redundant Cables) Using DSU:**
  - Iterate through each edge \`(u, v)\`:
    - If **\`ds.findUPar(u) == ds.findUPar(v)\`**: \`u\` and \`v\` are already connected! This cable is **redundant**, so increment \`cntExtras++\`.
    - Else: call \`ds.unionBySize(u, v)\`.
  - Count total components \`cntC\` where \`ds.findUPar(i) == i\`.
  - If **\`cntExtras >= cntC - 1\`**, return \`cntC - 1\`; otherwise return \`-1\`!
- **Complexity:** \`O(E * 4 * alpha + N * 4 * alpha)\` Time and \`O(N)\` Space.

### 💻 Make Network Connected (DSU) Blueprint
~~~cpp
int makeConnected(int n, vector<vector<int>> &edges) {
    DisjointSet ds(n);
    int cntExtras = 0;

    for (const auto &it : edges) {
        int u = it[0], v = it[1];
        if (ds.findUPar(u) == ds.findUPar(v)) {
            cntExtras++; // Redundant cycle edge that can be unplugged!
        } else {
            ds.unionBySize(u, v);
        }
    }

    int cntC = 0;
    for (int i = 0; i < n; i++) {
        if (ds.findUPar(i) == i) cntC++;
    }

    int needed = cntC - 1;
    if (cntExtras >= needed) return needed;
    return -1;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Inventing New Cables:** You can only connect components using existing redundant cables (\`cntExtras\`). Always verify \`cntExtras >= cntC - 1\` (or \`edges.size() >= n - 1\`)!`),
      theorySummary: cleanText(`To connect C independent components, exactly C - 1 extra edges are required. Disjoint Set counts redundant cycle edges whenever an edge connects two nodes already sharing an ultimate parent.`),
    },

    // -------------------------------------------------------------------------
    // Topic 175
    // -------------------------------------------------------------------------
    {
      order: 175,
      name: "Hash-Mapped Equivalence Classes: Accounts Merge Using Disjoint Set",
      slug: "dsa-accounts-merge-disjoint-set",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Map email addresses to account indices and merge equivalence classes using DSU, sorting emails per component.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 175: Accounts Merge Using Disjoint Set",
          url: cleanUrl("https://www.youtube.com/watch?v=FMwpt_aQOGw"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Accounts Merge",
          url: "https://takeuforward.org/data-structure/accounts-merge-dsu-g-50/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Accounts Merge (LC 721)",
          url: cleanUrl("https://leetcode.com/problems/accounts-merge/"),
          difficulty: "Medium",
          description: "Merge accounts that share at least one common email address and return emails in sorted order.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Account Merge",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/account-merge/1"),
          difficulty: "Hard",
          description: "Combine user accounts sharing common emails using Disjoint Set Union.",
        },
        {
          platform: "LeetCode",
          title: "Smallest String With Swaps (LC 1202)",
          url: cleanUrl("https://leetcode.com/problems/smallest-string-with-swaps/"),
          difficulty: "Medium",
          description: "Group swappable character indices using DSU, sort characters within each component, and reconstruct the string.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a list of \`N\` accounts where \`accounts[i][0]\` is a person's name and the remaining strings \`accounts[i][1...]\` are their emails, merge any two accounts that share **at least one common email** and return each merged account with its emails sorted alphabetically.

### 💡 Key Takeaways
- **Treat Account Indices \`0 .. N - 1\` as DSU Nodes:**
  - Maintain a hash map \`unordered_map<string, int> mapMailNode\` that maps each email string to the account index \`i\` where it was first seen.
- **3-Step DSU Pipeline:**
  1. **Map & Union:** For each account \`i\` and each of its emails \`mail\` (starting at index \`j = 1\`):
     - If \`mail\` is not in \`mapMailNode\`, set \`mapMailNode[mail] = i\`.
     - If \`mail\` **already exists** in \`mapMailNode\`, union the current account \`i\` with the previous owner: **\`ds.unionBySize(i, mapMailNode[mail])\`**!
  2. **Group Emails by Ultimate Parent:** Iterate through \`{mail, node}\` in \`mapMailNode\` and append \`mail\` into \`mergedMail[ds.findUPar(node)]\`.
  3. **Sort & Format Output:** For each account index \`i\` from \`0\` to \`N - 1\`, if \`mergedMail[i]\` is non-empty, sort \`mergedMail[i]\`, prepend the owner's name \`accounts[i][0]\`, and push into \`ans\`.
- **Complexity:** \`O(N * K * log(N * K))\` Time (where \`K\` is average emails per account) and \`O(N * K)\` Space.

### 💻 Accounts Merge (DSU) Blueprint
~~~cpp
vector<vector<string>> accountsMerge(vector<vector<string>> &details) {
    int n = details.size();
    DisjointSet ds(n);
    unordered_map<string, int> mapMailNode;

    // 1. Map emails to account index and union accounts sharing an email
    for (int i = 0; i < n; i++) {
        for (int j = 1; j < details[i].size(); j++) {
            string mail = details[i][j];
            if (mapMailNode.find(mail) == mapMailNode.end()) {
                mapMailNode[mail] = i;
            } else {
                ds.unionBySize(i, mapMailNode[mail]);
            }
        }
    }

    // 2. Group unique emails under their ultimate parent account index
    vector<string> mergedMail[n];
    for (const auto &it : mapMailNode) {
        string mail = it.first;
        int uNode = ds.findUPar(it.second);
        mergedMail[uNode].push_back(mail);
    }

    // 3. Sort each merged account's emails and attach the account holder's name
    vector<vector<string>> ans;
    for (int i = 0; i < n; i++) {
        if (mergedMail[i].empty()) continue;
        sort(mergedMail[i].begin(), mergedMail[i].end());
        vector<string> temp;
        temp.push_back(details[i][0]);
        for (const string &mail : mergedMail[i]) {
            temp.push_back(mail);
        }
        ans.push_back(temp);
    }
    return ans;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Starting the Email Loop at \`j = 0\` Instead of \`j = 1\`:** Index \`0\` (\`details[i][0]\`) is the **person's name**, not an email! Different people can have the exact same name (e.g., \`"John"\`), so never union accounts by name—always start the email loop at **\`j = 1\`**!`),
      theorySummary: cleanText(`Treating user indices as DSU nodes and mapping shared email strings to first-seen accounts allows unioning overlapping accounts in near O(1) time per email.`),
    },

    // -------------------------------------------------------------------------
    // Topic 176
    // -------------------------------------------------------------------------
    {
      order: 176,
      name: "Dynamic 2D Grid Flattening: Number of Islands II (Online Queries Using DSU)",
      slug: "dsa-number-of-islands-ii-online-queries-dsu",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Flatten 2D grid coordinates into 1D integers and track the online island count as land cells are dynamically activated.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 176: Number of Islands II (Online Queries Using DSU)",
          url: cleanUrl("https://www.youtube.com/watch?v=Rn6B-Q4SNyA"),
          duration: "21m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Number of Islands II",
          url: "https://takeuforward.org/data-structure/number-of-islands-ii-online-queries-dsu-g-51/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Number Of Islands",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/number-of-islands/1"),
          difficulty: "Medium",
          description: "Process online land-addition queries on an N x M sea grid and return the island count after each query.",
        },
        {
          platform: "LeetCode",
          title: "Number of Islands II (LC 305)",
          url: cleanUrl("https://leetcode.com/problems/number-of-islands-ii/"),
          difficulty: "Hard",
          description: "Return an array of the number of islands after each addLand(row, col) operation.",
        },
        {
          platform: "LeetCode",
          title: "Last Day Where You Can Still Cross (LC 1970)",
          url: cleanUrl("https://leetcode.com/problems/last-day-where-you-can-still-cross/"),
          difficulty: "Hard",
          description: "Use 2D-to-1D DSU flattening in reverse across daily grid updates to detect top-to-bottom connectivity.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given an \`n x m\` grid initially filled with \`0\`s (water) and a list of \`Q\` online queries \`(r, c)\` that turn cell \`(r, c)\` into \`1\` (land) one by one. Return the **total number of islands after each individual query**.

### 💡 Key Takeaways
- **1D Coordinate Flattening Formula (\`nodeNo = r * m + c\`):**
  - To use a 1D \`DisjointSet ds(n * m)\` on an \`n x m\` 2D grid, map every cell \`(r, c)\` to a unique 1D integer ID:
    **\`nodeNo = r * m + c\`** (where \`m\` is the number of columns).
- **Dynamic Island Counter Maintenance (\`cnt\`):**
  - When query \`(r, c)\` arrives:
    1. **Duplicate Query Guard:** If \`vis[r][c] == 1\`, \`(r, c)\` is already land—append the current \`cnt\` to \`ans\` and \`continue\`!
    2. Mark \`vis[r][c] = 1\` and increment **\`cnt++\`** (assuming the new cell forms a standalone island of size 1).
    3. Check all 4 neighbors \`(adjR, adjC)\`:
       - If \`(adjR, adjC)\` is valid AND is already land (\`vis[adjR][adjC] == 1\`):
         - If **\`ds.findUPar(nodeNo) != ds.findUPar(adjNodeNo)\`**, merge them via \`ds.unionBySize(nodeNo, adjNodeNo)\` and decrement **\`cnt--\`**!
    4. Append \`cnt\` to \`ans\`.
- **Complexity:** \`O(Q * 4 * alpha) ≈ O(Q)\` Time and \`O(N * M)\` Space.

### 💻 Number of Islands II (Online Queries DSU) Blueprint
~~~cpp
vector<int> numOfIslandsOnline(int n, int m, vector<vector<int>> &operators) {
    DisjointSet ds(n * m);
    vector<vector<int>> vis(n, vector<int>(m, 0));
    int cnt = 0;
    vector<int> ans;

    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    for (const auto &it : operators) {
        int r = it[0], c = it[1];
        if (vis[r][c] == 1) {
            ans.push_back(cnt);
            continue;
        }
        vis[r][c] = 1;
        cnt++; // New land cell initially adds 1 island

        int nodeNo = r * m + c;
        for (int i = 0; i < 4; i++) {
            int adjR = r + dr[i], adjC = c + dc[i];
            if (adjR >= 0 && adjR < n && adjC >= 0 && adjC < m && vis[adjR][adjC] == 1) {
                int adjNodeNo = adjR * m + adjC;
                if (ds.findUPar(nodeNo) != ds.findUPar(adjNodeNo)) {
                    cnt--; // Two separate islands merged into one!
                    ds.unionBySize(nodeNo, adjNodeNo);
                }
            }
        }
        ans.push_back(cnt);
    }
    return ans;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Check \`if (vis[r][c] == 1)\` First:** Online query lists often contain duplicate coordinates \`(r, c)\`. Without the duplicate guard, \`cnt++\` will falsely inflate the island count!`),
      theorySummary: cleanText(`Mapping 2D coordinates to 1D via nodeNo = r * m + c enables dynamic island connectivity tracking: increment island count on land placement and decrement each time an adjacent land component is unioned.`),
    },

    // -------------------------------------------------------------------------
    // Topic 177
    // -------------------------------------------------------------------------
    {
      order: 177,
      name: "Component-Size Aggregation: Making a Large Island Using Disjoint Set",
      slug: "dsa-making-a-large-island-dsu",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Aggregate component sizes using DSU unionBySize and evaluate all zero-cells by summing unique neighboring island sizes.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 177: Making a Large Island Using Disjoint Set",
          url: cleanUrl("https://www.youtube.com/watch?v=lgiz0Oup6gM"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Making a Large Island",
          url: "https://takeuforward.org/data-structure/making-a-large-island-dsu-g-52/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Making A Large Island (LC 827)",
          url: cleanUrl("https://leetcode.com/problems/making-a-large-island/"),
          difficulty: "Hard",
          description: "You are allowed to change at most one 0 to be 1. Return the size of the largest island in grid after applying this operation.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Maximum Connected group",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/maximum-connected-group/1"),
          difficulty: "Hard",
          description: "Find the maximum size of a connected group of 1s after flipping at most one 0 to 1.",
        },
        {
          platform: "LeetCode",
          title: "Max Area of Island (LC 695)",
          url: cleanUrl("https://leetcode.com/problems/max-area-of-island/"),
          difficulty: "Medium",
          description: "Compute the maximum island size when no 0-to-1 flip is performed.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`n x n\` binary grid, you are allowed to flip **at most one \`0\` into a \`1\`**. Return the size of the **largest island** of \`1\`s possible after this operation.

### 💡 Key Takeaways
- **Why \`unionBySize\` Shines Here:**
  - \`DisjointSet\` with \`unionBySize\` automatically stores the exact cell count of every island component at its ultimate parent \`ds.size[ds.findUPar(node)]\`!
- **Two-Step Algorithm (\`O(N²)\` Time, \`O(N²)\` Space):**
  1. **Step 1 (Connect Existing \`1\`s):**
     - Traverse the \`n x n\` grid. For every cell \`(r, c)\` where \`grid[r][c] == 1\`, union \`r * n + c\` with all valid 4-directional neighbors that are also \`1\`.
  2. **Step 2 (Try Flipping Each \`0\` to \`1\`):**
     - For every cell \`(r, c)\` where \`grid[r][c] == 0\`:
       - Create a \`set<int> components\` and insert the **ultimate parent** \`ds.findUPar(adjR * n + adjC)\` of all valid 4-directional neighbors that are \`1\`.
       - Why use a \`set\` of ultimate parents? Because two neighbors (e.g., Up and Right) might belong to the **exact same island**, and we must not double-count that island's size!
       - Sum \`sizeTotal = 1\` (for the flipped cell itself) \`+ sum(ds.size[it])\` for each unique parent \`it\` in \`components\`, and update \`mx = max(mx, sizeTotal)\`.
  3. **All-1s Edge Case:** Also check \`mx = max(mx, ds.size[ds.findUPar(i)])\` across all cells in case the grid contains zero \`0\`s!

### 💻 Making a Large Island (DSU) Blueprint
~~~cpp
int largestIsland(vector<vector<int>> &grid) {
    int n = grid.size();
    DisjointSet ds(n * n);
    int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1};

    // Step 1: Connect all existing 1s in DSU
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 0) continue;
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i], nc = c + dc[i];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                    ds.unionBySize(r * n + c, nr * n + nc);
                }
            }
        }
    }

    // Step 2: Try converting each 0 to 1 and sum unique neighboring component sizes
    int mx = 0;
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) continue;
            set<int> uniqueParents;
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i], nc = c + dc[i];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                    uniqueParents.insert(ds.findUPar(nr * n + nc));
                }
            }
            int sizeTotal = 1; // +1 for flipping current (r, c) from 0 to 1
            for (int ulp : uniqueParents) {
                sizeTotal += ds.getSize(ulp); // ds.size[ulp]
            }
            mx = max(mx, sizeTotal);
        }
    }

    // Step 3: Handle edge case where the entire grid is already 1s
    for (int cellNo = 0; cellNo < n * n; cellNo++) {
        mx = max(mx, ds.getSize(ds.findUPar(cellNo)));
    }
    return mx;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Summing Neighbor Sizes Without Deduplicating Ultimate Parents:** If a \`0\` touches the same C-shaped island on its top, left, and bottom sides, adding sizes without a \`set<int> uniqueParents\` will triple-count that island!`),
      theorySummary: cleanText(`Use unionBySize to store component sizes at roots. When evaluating each 0 cell, sum the sizes of unique neighboring component roots using a hash set to avoid double-counting.`),
    },

    // -------------------------------------------------------------------------
    // Topic 178
    // -------------------------------------------------------------------------
    {
      order: 178,
      name: "Bipartite Row-Column Coordinate Union: Most Stones Removed With Same Row or Column (DSU)",
      slug: "dsa-most-stones-removed-with-same-row-or-column-dsu",
      subtrack: "Module 26: Disjoint Set Union (DSU), Kruskal's MST & Dynamic Connectivity",
      description: "Model row and column coordinates as distinct bipartite nodes in DSU to determine maximum stone removals via n - components.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 178: Most Stones Removed With Same Row or Column",
          url: cleanUrl("https://www.youtube.com/watch?v=OwMNX8SPavM"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Most Stones Removed",
          url: "https://takeuforward.org/data-structure/most-stones-removed-with-same-row-or-column-dsu-g-53/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Most Stones Removed with Same Row or Column (LC 947)",
          url: cleanUrl("https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/"),
          difficulty: "Medium",
          description: "Return the largest possible number of stones that can be removed if a stone can be removed when it shares a row or column with another stone.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Maximum Stone Removal",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/maximum-stone-removal-1662179442/1"),
          difficulty: "Medium",
          description: "Find the maximum number of stones that can be removed from a 2D plane using row-column DSU.",
        },
        {
          platform: "LeetCode",
          title: "Remove Max Number of Edges to Keep Graph Fully Traversable (LC 1579)",
          url: cleanUrl("https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/"),
          difficulty: "Hard",
          description: "Practice component-level removal formulas where each connected component leaves 1 surviving element.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
On a 2D plane, we place \`n\` stones at integer coordinates \`[r, c]\`. A stone can be removed if there is at least one other stone left in the **same row or the same column**. Find the **maximum number of stones** that can be removed.

### 💡 Key Takeaways
- **The Mathematical Formula (\`ans = n - numberOfConnectedComponents\`):**
  - If \`k\` stones are connected via shared rows or columns into a single component, we can remove **\`k - 1\` stones** one by one, leaving **1 final stone** per component!
  - Summing across all \`C\` components: \`(k1 - 1) + (k2 - 1) + ... + (kC - 1) = (k1 + k2 + ... + kC) - C =\` **\`n - C\`**!
- **Row-Column Node Mapping Trick in DSU:**
  - Instead of treating the \`n\` stones as nodes (\`O(N²)\` pairwise comparisons), treat **each Row \`0 .. maxRow\`** and **each Column \`0 .. maxCol\`** as nodes in DSU!
  - Shift column indices by \`+ maxRow + 1\` so row and column IDs never collide:
    - \`nodeRow = r\`
    - **\`nodeCol = c + maxRow + 1\`**
  - For every stone \`[r, c]\`, simply call **\`ds.unionBySize(nodeRow, nodeCol)\`** and record \`nodeRow\` and \`nodeCol\` in \`stoneNodes\`!
  - Count how many active \`stoneNodes\` satisfy \`ds.findUPar(it) == it\` to get \`C\`, and return \`n - C\`!
- **Complexity:** \`O(N * 4 * alpha)\` Time and \`O(maxRow + maxCol)\` Space.

### 💻 Most Stones Removed (Row-Column DSU) Blueprint
~~~cpp
int removeStones(vector<vector<int>> &stones) {
    int n = stones.size();
    int maxRow = 0, maxCol = 0;
    for (const auto &it : stones) {
        maxRow = max(maxRow, it[0]);
        maxCol = max(maxCol, it[1]);
    }

    DisjointSet ds(maxRow + maxCol + 1);
    unordered_map<int, int> stoneNodes;

    for (const auto &it : stones) {
        int nodeRow = it[0];
        int nodeCol = it[1] + maxRow + 1; // Offset column index to avoid collision with rows
        ds.unionBySize(nodeRow, nodeCol);
        stoneNodes[nodeRow] = 1;
        stoneNodes[nodeCol] = 1;
    }

    int cntComponents = 0;
    for (const auto &it : stoneNodes) {
        if (ds.findUPar(it.first) == it.first) {
            cntComponents++;
        }
    }
    return n - cntComponents;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Counting Empty Rows/Columns as Components:** A row or column with zero stones is initialized in \`DisjointSet\` as its own parent, but it is **not** a stone component! Only count roots among rows/columns that actually contain at least one stone (\`stoneNodes\`).`),
      theorySummary: cleanText(`Each stone connects a row-node and a column-node. Every connected component of stones can be reduced to 1 surviving stone, yielding maximum removals = n - components.`),
    },

    // =========================================================================
    // SUBTRACK: Module 27: Strongly Connected Components (Kosaraju's) & Tarjan's Bridge Detection (Topics 179–180)
    // =========================================================================
    {
      order: 179,
      name: "Finish-Time Ordering & Edge Reversal: Strongly Connected Components (Kosaraju's Algorithm)",
      slug: "dsa-strongly-connected-components-kosarajus-algorithm",
      subtrack: "Module 27: Strongly Connected Components (Kosaraju's) & Tarjan's Bridge Detection",
      description: "Find all Strongly Connected Components in directed graphs using post-order finish time sorting, graph transposing, and stack-ordered DFS.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 179: Strongly Connected Components (Kosaraju's Algorithm)",
          url: cleanUrl("https://www.youtube.com/watch?v=R6uoSjZ2imo"),
          duration: "23m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Strongly Connected Components",
          url: "https://takeuforward.org/data-structure/strongly-connected-components-kosarajus-algorithm-g-54/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Strongly Connected Components (Kosaraju's Algo)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1"),
          difficulty: "Medium",
          description: "Find the number of Strongly Connected Components in a directed graph using Kosaraju's Algorithm.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Employees to Be Invited to a Meeting (LC 2127)",
          url: cleanUrl("https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting/"),
          difficulty: "Hard",
          description: "Analyze directed cycles (strongly connected components) and chains in a directed graph.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Number of Days to Disconnect Island (LC 1568)",
          url: cleanUrl("https://leetcode.com/problems/minimum-number-of-days-to-disconnect-island/"),
          difficulty: "Hard",
          description: "Explore graph connectivity and component separation properties.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In a **Directed Graph**, a **Strongly Connected Component (SCC)** is a maximal subset of vertices where **every vertex in the subset is reachable from every other vertex in the subset** (\`u\` can reach \`v\` AND \`v\` can reach \`u\`). **Kosaraju's Algorithm** finds all SCCs in **\`O(V + E)\`** time!

### 💡 Key Takeaways
- **Why Reversing All Edges Isolates SCCs:**
  - If you condense each SCC into a single super-node, a directed graph looks like a chain of SCCs: \`SCC1 → SCC2 → SCC3\`.
  - If you run a normal DFS starting in \`SCC1\`, it leaks across the bridge edge \`SCC1 → SCC2\` and visits the whole graph at once!
  - **The Genius of Kosaraju's Algorithm:** If we **reverse all edges** (\`SCC1 ← SCC2 ← SCC3\`), every internal cycle inside \`SCC1\` remains a valid cycle, **but** the outgoing bridge edge from \`SCC1\` to \`SCC2\` is flipped backward (\`SCC1 ← SCC2\`), **trapping the DFS strictly inside \`SCC1\`**!
- **The 3 Steps of Kosaraju's Algorithm (\`O(V + E)\` Time, \`O(V + E)\` Space):**
  1. **Step 1 (Sort Nodes by Finishing Time):** Run a standard post-order DFS across all vertices \`0 .. V - 1\` and push each node onto \`stack<int> st\` when its DFS finishes (so \`SCC1\` nodes sit at the top of the stack).
  2. **Step 2 (Reverse the Graph):** Build \`adjT\` where every directed edge \`u → v\` becomes \`v → u\`.
  3. **Step 3 (DFS in Stack Order on \`adjT\`):** Pop nodes from \`st\` one by one. Whenever a popped node \`u\` is unvisited, increment \`sccCount++\` and run \`dfs3(u, adjT, vis)\` to mark its entire isolated SCC!

### 💻 Kosaraju's Algorithm (SCC) Blueprint
~~~cpp
void dfsFinishOrder(int u, const vector<vector<int>> &adj, vector<int> &vis, stack<int> &st) {
    vis[u] = 1;
    for (int v : adj[u]) {
        if (!vis[v]) dfsFinishOrder(v, adj, vis, st);
    }
    st.push(u);
}

void dfsReversed(int u, const vector<vector<int>> &adjT, vector<int> &vis) {
    vis[u] = 1;
    for (int v : adjT[u]) {
        if (!vis[v]) dfsReversed(v, adjT, vis);
    }
}

int kosarajuSCC(int V, vector<vector<int>> &adj) {
    // Step 1: Order vertices by finish time in stack
    vector<int> vis(V, 0);
    stack<int> st;
    for (int i = 0; i < V; i++) {
        if (!vis[i]) dfsFinishOrder(i, adj, vis, st);
    }

    // Step 2: Reverse all directed edges (Transpose Graph)
    vector<vector<int>> adjT(V);
    for (int u = 0; u < V; u++) {
        vis[u] = 0; // Reset vis array for Step 3
        for (int v : adj[u]) {
            adjT[v].push_back(u);
        }
    }

    // Step 3: Process vertices in stack order on the reversed graph
    int sccCount = 0;
    while (!st.empty()) {
        int u = st.top();
        st.pop();
        if (!vis[u]) {
            sccCount++;
            dfsReversed(u, adjT, vis);
        }
    }
    return sccCount;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Skipping Step 1 (Running DFS on \`adjT\` in Arbitrary Order \`0 .. V - 1\`):** If you start DFS on the reversed graph from \`SCC3\` instead of \`SCC1\`, the reversed edge \`SCC1 ← SCC2 ← SCC3\` will allow \`SCC3\` to leak backward into \`SCC2\` and \`SCC1\`! You **must** process \`adjT\` in the exact finishing-time stack order from Step 1.`),
      theorySummary: cleanText(`Kosaraju's algorithm computes SCCs in O(V + E) by (1) pushing nodes to a stack by post-order finish time, (2) reversing all edges, and (3) launching DFS calls in stack order on the transposed graph.`),
    },

    // -------------------------------------------------------------------------
    // Topic 180
    // -------------------------------------------------------------------------
    {
      order: 180,
      name: "Insertion & Lowest-Reachable Timestamps: Bridges in a Graph Using Tarjan's Algorithm",
      slug: "dsa-bridges-in-graph-tarjans-algorithm",
      subtrack: "Module 27: Strongly Connected Components (Kosaraju's) & Tarjan's Bridge Detection",
      description: "Detect critical connections (bridges) whose removal disconnects the graph using DFS discovery timestamps and lowest reachable ancestors.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 180: Bridges in Graph (Tarjan's Algorithm)",
          url: cleanUrl("https://www.youtube.com/watch?v=qrAub5z8FeA"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Bridges in Graph",
          url: "https://takeuforward.org/data-structure/bridges-in-graph-using-tarjans-algorithm-g-55/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Critical Connections in a Network (LC 1192)",
          url: cleanUrl("https://leetcode.com/problems/critical-connections-in-a-network/"),
          difficulty: "Hard",
          description: "Return all critical connections (bridges) in an undirected network of n servers using Tarjan's algorithm.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Bridge edge in a graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/bridge-edge-in-graph/1"),
          difficulty: "Medium",
          description: "Determine whether a given edge (c, d) is a bridge in an undirected graph.",
        },
        {
          platform: "LeetCode",
          title: "Longest Cycle in a Graph (LC 2360)",
          url: cleanUrl("https://leetcode.com/problems/longest-cycle-in-a-graph/"),
          difficulty: "Hard",
          description: "Practice DFS discovery-time tracking across graph edges.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A **Bridge (Critical Connection)** in an undirected graph is any edge whose removal **increases the number of connected components** (disconnects the graph into two or more pieces). **Tarjan's Bridge-Finding Algorithm** finds all bridges in a single DFS pass in **\`O(V + 2E)\`** time!

### 💡 Key Takeaways
- **Two Timestamp Arrays (\`tin[]\` and \`low[]\`):**
  - **\`tin[node]\` (Time of Insertion):** The DFS step counter at the moment \`node\` is first visited.
  - **\`low[node]\` (Lowest Time of Insertion):** The minimum \`tin\` reachable from \`node\` (and its DFS subtree) using any path **except** going directly back to its immediate \`parent\`!
- **The Bridge Condition (\`low[it] > tin[node]\`):**
  - When exploring an unvisited child \`it\` from \`node\`:
    1. Recurse \`dfs(it, node, ...)\`.
    2. On return, update \`low[node] = min(low[node], low[it])\`.
    3. Check: **\`if (low[it] > tin[node])\`** → The subtree rooted at \`it\` has **no back-edge** reaching \`node\` or any ancestor of \`node\`! Therefore, edge \`{node, it}\` is a **Bridge**!
  - If neighbor \`it\` is **already visited** (and \`it != parent\`), simply update \`low[node] = min(low[node], low[it])\`.
- **Complexity:** \`O(V + 2E)\` Time and \`O(V + 2E) + O(3V)\` Space.

### 💻 Tarjan's Bridge-Finding Algorithm Blueprint
~~~cpp
class Solution {
    int timer = 1;

    void dfsBridge(int node, int parent, const vector<int> adj[], vector<int> &vis,
                   vector<int> &tin, vector<int> &low, vector<vector<int>> &bridges) {
        vis[node] = 1;
        tin[node] = low[node] = timer++;

        for (int it : adj[node]) {
            if (it == parent) continue; // Never look back at immediate parent!

            if (!vis[it]) {
                dfsBridge(it, node, adj, vis, tin, low, bridges);
                low[node] = min(low[node], low[it]);

                // Can child 'it' reach 'node' or above via an alternate back-edge?
                if (low[it] > tin[node]) {
                    bridges.push_back({it, node});
                }
            } else {
                // Already visited non-parent neighbor (back-edge)
                low[node] = min(low[node], low[it]);
            }
        }
    }

public:
    vector<vector<int>> criticalConnections(int n, vector<vector<int>> &connections) {
        vector<int> adj[n];
        for (const auto &it : connections) {
            adj[it[0]].push_back(it[1]);
            adj[it[1]].push_back(it[0]);
        }

        vector<int> vis(n, 0), tin(n), low(n);
        vector<vector<int>> bridges;
        dfsBridge(0, -1, adj, vis, tin, low, bridges);
        return bridges;
    }
};
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`if (it == parent) continue;\`:** If a child updates \`low[it]\` using its immediate \`parent\`, \`low[it]\` will always become \`<= tin[node]\`, hiding every single bridge in the graph!`),
      theorySummary: cleanText(`Tarjan's algorithm tracks discovery times tin and lowest reachable ancestor times low. An edge (u, v) is a bridge if low[v] > tin[u], indicating no back-edge exists from v's subtree to u or above.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 18 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch18Topics) {
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

  // 5. Update track_topics: Link Batch 18 Topics to topic_order 171 through 180
  console.log("\n🔄 Linking Batch 18 topics to 'problem-solving-dsa-sql' (orders 171..180)...");

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

  // Link Batch 18 Topics (orders 171..180)
  for (const topicDef of batch18Topics) {
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

  console.log("\n🎉 DSA Batch 18 (Lectures 171–180) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch18()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch18;
