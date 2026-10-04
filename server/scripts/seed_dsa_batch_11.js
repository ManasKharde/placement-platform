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

const seedDsaBatch11 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 11 (Lectures 101–110) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 11 Topics (Lectures 101–110)
  const batch11Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction (Topics 101–107)
    // =========================================================================
    {
      order: 101,
      name: "Bottom-Up Tree Modification: Children Sum Property in a Binary Tree",
      slug: "dsa-children-sum-property-binary-tree",
      subtrack: "Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction",
      description: "Convert a binary tree in-place to satisfy the children sum property in O(N) time by pushing values downward and summing them back up.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 101: Check for Children Sum Property in a Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=fnmisPM6cVo"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check for Children Sum Property in a Binary Tree",
          url: "https://takeuforward.org/data-structure/check-for-children-sum-property-in-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Check for Children Sum Property in a Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/children-sum-parent/1"),
          difficulty: "Easy",
          description: "Verify whether every non-leaf node satisfies node->data == left->data + right->data.",
        },
        {
          platform: "LeetCode",
          title: "Root Equals Sum of Children",
          url: cleanUrl("https://leetcode.com/problems/root-equals-sum-of-children/"),
          difficulty: "Easy",
          description: "Check the base 3-node children sum identity.",
        },
        {
          platform: "LeetCode",
          title: "Flatten Binary Tree to Linked List",
          url: cleanUrl("https://leetcode.com/problems/flatten-binary-tree-to-linked-list/"),
          difficulty: "Medium",
          description: "Practice in-place pointer updates across binary tree nodes.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
In a binary tree, the **Children Sum Property** states that for every non-leaf node, its value must equal the sum of its left and right children: \`node->val == (node->left ? node->left->val : 0) + (node->right ? node->right->val : 0)\`. You are allowed only to increment node values by any amount (\`val += 1\` as many times as needed), without modifying tree structure.

### 💡 Key Takeaways
- **The Top-Down Forward Push:**
  - Before recurring down, compare \`node->val\` with \`childSum = (left ? left->val : 0) + (right ? right->val : 0)\`.
  - If \`node->val > childSum\`, update both children to match \`node->val\` (\`if (node->left) node->left->val = node->val; if (node->right) node->right->val = node->val;\`). This guarantees children will never fall short when summing back up!
  - If \`childSum >= node->val\`, update \`node->val = childSum\`.
- **The Bottom-Up Backtracking Sum:**
  - Recursively process \`reorder(node->left)\` and \`reorder(node->right)\`.
  - On the way back up, set \`node->val\` to the exact sum of its updated children.
- **Complexity:** \`O(N)\` Time (single traversal) and \`O(H)\` Space.

### 💻 Children Sum Conversion Blueprint
\`\`\`cpp
void changeTree(TreeNode* root) {
    if (root == nullptr) return;

    int childSum = 0;
    if (root->left) childSum += root->left->val;
    if (root->right) childSum += root->right->val;

    // Push parent value downward if children sum is smaller
    if (childSum >= root->val) {
        root->val = childSum;
    } else {
        if (root->left) root->left->val = root->val;
        if (root->right) root->right->val = root->val;
    }

    changeTree(root->left);
    changeTree(root->right);

    // Sum back up on return
    int total = 0;
    if (root->left) total += root->left->val;
    if (root->right) total += root->right->val;
    if (root->left || root->right) root->val = total;
}
\`\`\``,
    },
    {
      order: 102,
      name: "Parent-Pointer Graph Projection: All Nodes at Distance K in Binary Tree",
      slug: "dsa-nodes-at-distance-k-binary-tree",
      subtrack: "Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction",
      description: "Find all node values located exactly distance K from a given target node using parent-pointer hashing and radial BFS.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 102: Print all the Nodes at a distance of K in Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=i9ORlEy6EsI"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Print all the Nodes at a distance of K in Binary Tree",
          url: "https://takeuforward.org/data-structure/print-all-the-nodes-at-a-distance-of-k-in-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "All Nodes Distance K in Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/"),
          difficulty: "Medium",
          description: "Find all node values located exactly distance K from a given target node.",
        },
        {
          platform: "LeetCode",
          title: "Amount of Time for Binary Tree to Be Infected",
          url: cleanUrl("https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected/"),
          difficulty: "Medium",
          description: "Simulate infection spreading upward and downward using a parent-mapped tree graph.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Nodes at given distance in binary tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/nodes-at-given-distance-in-binary-tree/1"),
          difficulty: "Hard",
          description: "Find all nodes at distance K from a target node in a binary tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a binary tree, a \`target\` node, and an integer \`k\`, return an array of all node values located **exactly distance \`k\`** away from the target node.

### 💡 Key Takeaways
- **The Core Problem with Binary Trees:**
  - Finding nodes distance \`k\` *downward* is trivial, but nodes can also lie *upward* through ancestors and across sister subtrees.
  - Since standard binary tree nodes only point to \`left\` and \`right\`, we cannot traverse upward without a parent link.
- **Two-Step Solution (\`O(N)\` Time, \`O(N)\` Space):**
  - **Step 1: Map Parent Pointers:**
    - Run a BFS or DFS starting from \`root\`. Store each node's parent in \`unordered_map<TreeNode*, TreeNode*> parentTrack\`.
  - **Step 2: Radial BFS from Target:**
    - Initialize \`queue<TreeNode*> q\` with \`target\` and mark \`target\` in \`unordered_map<TreeNode*, bool> visited\`.
    - Run BFS in level-by-level radial bursts (\`currDist = 0\` to \`k\`).
    - At each node, explore in 3 directions: \`left\`, \`right\`, and \`parentTrack[curr]\`.
    - Push unvisited neighbors to \`q\` and mark them visited.
    - When \`currDist == k\`, stop! All nodes remaining in the queue are at distance \`k\`.

### 💻 Nodes at Distance K Blueprint
\`\`\`cpp
void markParents(TreeNode* root, unordered_map<TreeNode*, TreeNode*> &parent_track) {
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* current = q.front();
        q.pop();
        if (current->left) {
            parent_track[current->left] = current;
            q.push(current->left);
        }
        if (current->right) {
            parent_track[current->right] = current;
            q.push(current->right);
        }
    }
}

vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
    unordered_map<TreeNode*, TreeNode*> parent_track;
    markParents(root, parent_track);

    unordered_map<TreeNode*, bool> visited;
    queue<TreeNode*> q;
    q.push(target);
    visited[target] = true;
    int curr_level = 0;

    while (!q.empty()) {
        int size = q.size();
        if (curr_level == k) break;
        curr_level++;

        for (int i = 0; i < size; i++) {
            TreeNode* current = q.front();
            q.pop();

            if (current->left && !visited[current->left]) {
                visited[current->left] = true;
                q.push(current->left);
            }
            if (current->right && !visited[current->right]) {
                visited[current->right] = true;
                q.push(current->right);
            }
            if (parent_track[current] && !visited[parent_track[current]]) {
                visited[parent_track[current]] = true;
                q.push(parent_track[current]);
            }
        }
    }

    vector<int> result;
    while (!q.empty()) {
        result.push_back(q.front()->val);
        q.pop();
    }
    return result;
}
\`\`\``,
    },
    {
      order: 103,
      name: "Radial Infection Simulation: Minimum Time to Burn a Binary Tree from a Target Node",
      slug: "dsa-minimum-time-to-burn-binary-tree",
      subtrack: "Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction",
      description: "Simulate radial fire propagation in a binary tree to determine minimum burn time in O(N) time and space.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 103: Minimum time taken to BURN the Binary Tree from a Node",
          url: cleanUrl("https://www.youtube.com/watch?v=2r5wLmQfD6g"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimum time taken to BURN the Binary Tree from a Node",
          url: "https://takeuforward.org/data-structure/minimum-time-taken-to-burn-the-binary-tree-from-a-node/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Amount of Time for Binary Tree to Be Infected",
          url: cleanUrl("https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected/"),
          difficulty: "Medium",
          description: "Find the total minutes required to infect an entire binary tree starting from start node.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Burning Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/burning-tree/1"),
          difficulty: "Hard",
          description: "Calculate minimum time to burn all nodes starting from target in a binary tree.",
        },
        {
          platform: "LeetCode",
          title: "All Nodes Distance K in Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/"),
          difficulty: "Medium",
          description: "Review radial BFS traversal to contrast fixed-distance collection with maximum time propagation.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a binary tree and a \`target\` node that catches fire at time \`t = 0\`, fire spreads to all adjacent connected nodes (left child, right child, and parent) in 1 second. Find the **minimum time required to completely burn the entire tree**.

### 💡 Key Takeaways
- **Radial Propagation Mechanics:**
  - Fire spreads outward in concentric circles like an undirected graph BFS.
  - The minimum time to burn the whole tree is the **maximum distance from \`target\` to any node in the tree**.
- **Algorithm Steps (\`O(N)\` Time, \`O(N)\` Space):**
  - **Step 1:** Build parent pointers via BFS/DFS while locating the \`target\` node pointer if given only its integer value.
  - **Step 2:** Run radial BFS from \`target\` with a \`queue<TreeNode*> q\` and \`visited\` map.
  - Maintain \`int time = 0\`. For each second, pop all nodes currently on fire, ignite unburned neighbors (\`left\`, \`right\`, and \`parent\`), and push them to \`q\`.
  - Maintain a boolean \`flag = false\`. Only increment \`time++\` if at least one new neighbor caught fire during that second.
  - Return \`time\` when the queue becomes empty.

### 💻 Minimum Time to Burn Binary Tree Blueprint
\`\`\`cpp
int minTimeToBurn(TreeNode* root, TreeNode* target) {
    unordered_map<TreeNode*, TreeNode*> parentTrack;
    queue<TreeNode*> q;
    q.push(root);

    // 1. Map parent pointers
    while (!q.empty()) {
        TreeNode* curr = q.front();
        q.pop();
        if (curr->left) { parentTrack[curr->left] = curr; q.push(curr->left); }
        if (curr->right) { parentTrack[curr->right] = curr; q.push(curr->right); }
    }

    // 2. Radial BFS burn simulation
    unordered_map<TreeNode*, bool> visited;
    q.push(target);
    visited[target] = true;
    int time = 0;

    while (!q.empty()) {
        int size = q.size();
        bool burnedAny = false;

        for (int i = 0; i < size; i++) {
            TreeNode* curr = q.front();
            q.pop();

            if (curr->left && !visited[curr->left]) {
                visited[curr->left] = true;
                q.push(curr->left);
                burnedAny = true;
            }
            if (curr->right && !visited[curr->right]) {
                visited[curr->right] = true;
                q.push(curr->right);
                burnedAny = true;
            }
            if (parentTrack[curr] && !visited[parentTrack[curr]]) {
                visited[parentTrack[curr]] = true;
                q.push(parentTrack[curr]);
                burnedAny = true;
            }
        }
        if (burnedAny) time++;
    }
    return time;
}
\`\`\``,
    },
    {
      order: 104,
      name: "Subtree Completeness Invariant: Count Total Nodes in a Complete Binary Tree in O((log N)^2)",
      slug: "dsa-count-nodes-complete-binary-tree",
      subtrack: "Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction",
      description: "Count all nodes in a complete binary tree in O((log N)^2) time by detecting full subtrees with height equality.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 104: Count total Nodes in a COMPLETE Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=u-yWemKGWO0"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count total Nodes in a COMPLETE Binary Tree",
          url: "https://takeuforward.org/data-structure/count-number-of-nodes-in-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Count Complete Tree Nodes",
          url: cleanUrl("https://leetcode.com/problems/count-complete-tree-nodes/"),
          difficulty: "Easy",
          description: "Count the total nodes of a complete binary tree in strictly less than O(N) runtime.",
        },
        {
          platform: "LeetCode",
          title: "Balanced Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/balanced-binary-tree/"),
          difficulty: "Easy",
          description: "Compare subtree depth calculations with complete tree node counts.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Complete Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/complete-binary-tree/1"),
          difficulty: "Medium",
          description: "Verify whether a given binary tree satisfies the complete tree invariant.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a **Complete Binary Tree**, count its total number of nodes in **\`O((log2 N)^2)\` time**—strictly faster than \`O(N)\` linear traversal.

### 💡 Key Takeaways
- **The Perfect Binary Tree Shortcut:**
  - If a tree of height \`h\` is completely full, its total node count is **\`2^h - 1\`** (computed via bitshift \`(1 << h) - 1\`).
- **Optimal Subtree Pruning (\`O((log2 N)^2)\` Time, \`O(log2 N)\` Space):**
  - At any node \`curr\`:
    - Compute \`leftHeight\`: traverse strictly down left edges (\`curr = curr->left\`).
    - Compute \`rightHeight\`: traverse strictly down right edges (\`curr = curr->right\`).
    - **If \`leftHeight == rightHeight\`:** The subtree is a perfect binary tree! Immediately return **\`(1 << leftHeight) - 1\`** without traversing internal nodes!
    - **If \`leftHeight != rightHeight\`:** The bottom level is partially filled on the right. Return **\`1 + countNodes(curr->left) + countNodes(curr->right)\`**.
- **Why Time is \`O((log2 N)^2)\`:**
  - Finding heights takes \`O(log2 N)\` time.
  - At each branching step, at least one of the two subtrees is guaranteed to be a perfect binary tree and finishes in \`O(1)\`! We only dive deeper into the single irregular branch, so height comparisons run at most \`O(log2 N)\` times: \`O(log N * log N) = O((log2 N)^2)\`.

### 💻 Count Nodes in Complete Tree Blueprint
\`\`\`cpp
int findHeightLeft(TreeNode* node) {
    int h = 0;
    while (node) { h++; node = node->left; }
    return h;
}

int findHeightRight(TreeNode* node) {
    int h = 0;
    while (node) { h++; node = node->right; }
    return h;
}

int countNodes(TreeNode* root) {
    if (root == nullptr) return 0;

    int lh = findHeightLeft(root);
    int rh = findHeightRight(root);

    if (lh == rh) return (1 << lh) - 1; // Formula shortcut: 2^h - 1

    return 1 + countNodes(root->left) + countNodes(root->right);
}
\`\`\``,
    },
    {
      order: 105,
      name: "Combinatorial Reconstruction Theory: Requirements to Construct a Unique Binary Tree",
      slug: "dsa-requirements-to-construct-unique-binary-tree",
      subtrack: "Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction",
      description: "Understand why inorder traversal is mathematically mandatory alongside preorder or postorder to reconstruct a unique binary tree.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 105: Requirements needed to construct a Unique Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=9GMECGQgWrQ"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Requirements to Construct a Unique Binary Tree",
          url: "https://takeuforward.org/data-structure/requirements-needed-to-construct-a-unique-binary-tree-theory/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Unique Binary Tree Requirements",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/unique-binary-tree-requirements/1"),
          difficulty: "Easy",
          description: "Determine whether given pairs of traversals can construct a unique binary tree.",
        },
        {
          platform: "LeetCode",
          title: "Construct Binary Tree from Preorder and Inorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"),
          difficulty: "Medium",
          description: "Construct a unique binary tree given Preorder and Inorder arrays.",
        },
        {
          platform: "LeetCode",
          title: "Construct Binary Tree from Inorder and Postorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/"),
          difficulty: "Medium",
          description: "Construct a unique binary tree given Inorder and Postorder arrays.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Can we always reconstruct a unique binary tree given any two traversal sequences? This theoretical lecture covers the mathematical requirements needed to guarantee a single unique tree.

### 💡 Key Takeaways
- **Why Inorder is Mandatory:**
  - **Preorder (\`Root → Left → Right\`)** and **Postorder (\`Left → Right → Root\`)** tell you which node is the parent, but they **cannot distinguish** whether a single child belongs to the left subtree or the right subtree!
  - **Inorder (\`Left → Root → Right\`)** is the only traversal that provides spatial separation: once you identify the root, everything to its left belongs to the left subtree, and everything to its right belongs to the right subtree.
- **Valid Traversal Pairs:**
  - **\`Preorder + Inorder\`:** Always constructs a unique binary tree.
  - **\`Postorder + Inorder\`:** Always constructs a unique binary tree.
  - **\`Preorder + Postorder\`:** Does **NOT** construct a unique binary tree in general (it only works if the tree is guaranteed to be a *Full* Binary Tree where every node has 0 or 2 children).`,
    },
    {
      order: 106,
      name: "Index-Window Boundary Splitting: Construct Binary Tree from Preorder and Inorder Traversal",
      slug: "dsa-construct-binary-tree-from-preorder-and-inorder",
      subtrack: "Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction",
      description: "Construct a unique binary tree from preorder and inorder arrays in O(N) time using hash-mapped index windows.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 106: Construct A Binary Tree from Inorder and Preorder Traversal",
          url: cleanUrl("https://www.youtube.com/watch?v=aZNaLrVebKQ"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Construct A Binary Tree from Inorder and Preorder Traversal",
          url: "https://takeuforward.org/data-structure/construct-a-binary-tree-from-inorder-and-preorder-traversal/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Construct Binary Tree from Preorder and Inorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"),
          difficulty: "Medium",
          description: "Build and return the binary tree from preorder and inorder arrays.",
        },
        {
          platform: "LeetCode",
          title: "Construct Binary Tree from Preorder and Postorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/"),
          difficulty: "Medium",
          description: "Reconstruct a tree using preorder and postorder with full tree assumptions.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Construct Tree from Inorder & Preorder",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/construct-tree-1/1"),
          difficulty: "Medium",
          description: "Build a tree from inorder and preorder traversal arrays.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given two integer arrays \`preorder\` and \`inorder\` with unique values, reconstruct and return the unique binary tree in \`O(N)\` time.

### 💡 Key Takeaways
- **Precomputing Inorder Indices in a Hash Map (\`O(N)\` Time):**
  - Store each value's index in \`inMap[inorder[i]] = i\` for \`O(1)\` root lookups.
- **The Index-Window Recurrence:**
  - In \`preorder\`, the root node is always \`preorder[preStart]\`.
  - Look up root in \`inMap\`: \`inRoot = inMap[root->val]\`.
  - Count left subtree size: **\`numsLeft = inRoot - inStart\`**.
  - **Left Subtree Windows:**
    - Preorder: \`[preStart + 1 ... preStart + numsLeft]\`
    - Inorder: \`[inStart ... inRoot - 1]\`
  - **Right Subtree Windows:**
    - Preorder: \`[preStart + numsLeft + 1 ... preEnd]\`
    - Inorder: \`[inRoot + 1 ... inEnd]\`

### 💻 Construct from Preorder and Inorder Blueprint
\`\`\`cpp
TreeNode* build(vector<int> &preorder, int preStart, int preEnd,
                vector<int> &inorder, int inStart, int inEnd,
                unordered_map<int, int> &inMap) {
    if (preStart > preEnd || inStart > inEnd) return nullptr;

    TreeNode* root = new TreeNode(preorder[preStart]);
    int inRoot = inMap[root->val];
    int numsLeft = inRoot - inStart;

    root->left = build(preorder, preStart + 1, preStart + numsLeft,
                       inorder, inStart, inRoot - 1, inMap);
    root->right = build(preorder, preStart + numsLeft + 1, preEnd,
                        inorder, inRoot + 1, inEnd, inMap);
    return root;
}

TreeNode* buildTree(vector<int> &preorder, vector<int> &inorder) {
    unordered_map<int, int> inMap;
    for (int i = 0; i < inorder.size(); i++) inMap[inorder[i]] = i;
    return build(preorder, 0, preorder.size() - 1,
                 inorder, 0, inorder.size() - 1, inMap);
}
\`\`\``,
    },
    {
      order: 107,
      name: "Suffix-Root Window Splitting: Construct Binary Tree from Postorder and Inorder Traversal",
      slug: "dsa-construct-binary-tree-from-postorder-and-inorder",
      subtrack: "Module 18: Binary Trees: Node Distances, Tree Modifications & Reconstruction",
      description: "Construct a unique binary tree from postorder and inorder arrays in O(N) time using suffix-root window splitting.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 107: Construct the Binary Tree from Postorder and Inorder Traversal",
          url: cleanUrl("https://www.youtube.com/watch?v=LgLRTaEMRVc"),
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Construct the Binary Tree from Postorder and Inorder Traversal",
          url: "https://takeuforward.org/data-structure/construct-the-binary-tree-from-postorder-and-inorder-traversal/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Construct Binary Tree from Inorder and Postorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/"),
          difficulty: "Medium",
          description: "Reconstruct and return the root of the binary tree from inorder and postorder.",
        },
        {
          platform: "LeetCode",
          title: "Construct Binary Search Tree from Preorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/"),
          difficulty: "Medium",
          description: "Construct a BST using upper bound validation on preorder sequence.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Tree from Postorder and Inorder",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/tree-from-postorder-and-inorder/1"),
          difficulty: "Medium",
          description: "Reconstruct a tree using its inorder and postorder traversals.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given two integer arrays \`inorder\` and \`postorder\`, reconstruct and return the unique binary tree.

### 💡 Key Takeaways
- **Root is at the End of Postorder:**
  - Because postorder is \`Left → Right → Root\`, the root of the current subtree is always **\`postorder[postEnd]\`**.
- **Calculating Window Offsets:**
  - Find root in inorder: \`inRoot = inMap[postorder[postEnd]]\`.
  - Count left subtree size: \`numsLeft = inRoot - inStart\`.
  - **Left Subtree Windows:**
    - Postorder: \`[postStart ... postStart + numsLeft - 1]\`
    - Inorder: \`[inStart ... inRoot - 1]\`
  - **Right Subtree Windows:**
    - Postorder: \`[postStart + numsLeft ... postEnd - 1]\` (skipping the last element, which is the current root!)
    - Inorder: \`[inRoot + 1 ... inEnd]\`

### 💻 Construct from Postorder and Inorder Blueprint
\`\`\`cpp
TreeNode* build(vector<int> &inorder, int is, int ie,
                vector<int> &postorder, int ps, int pe,
                unordered_map<int, int> &inMap) {
    if (ps > pe || is > ie) return nullptr;

    TreeNode* root = new TreeNode(postorder[pe]);
    int inRoot = inMap[postorder[pe]];
    int numsLeft = inRoot - is;

    root->left = build(inorder, is, inRoot - 1,
                       postorder, ps, ps + numsLeft - 1, inMap);
    root->right = build(inorder, inRoot + 1, ie,
                        postorder, ps + numsLeft, pe - 1, inMap);
    return root;
}

TreeNode* buildTree(vector<int> &inorder, vector<int> &postorder) {
    unordered_map<int, int> inMap;
    for (int i = 0; i < inorder.size(); i++) inMap[inorder[i]] = i;
    return build(inorder, 0, inorder.size() - 1,
                 postorder, 0, postorder.size() - 1, inMap);
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 19: Binary Trees: Threaded Binary Trees & Morris Traversal (Topics 108–110)
    // =========================================================================
    {
      order: 108,
      name: "Delimiter Tokenization & Stream Deserialization: Serialize and Deserialize a Binary Tree",
      slug: "dsa-serialize-and-deserialize-binary-tree",
      subtrack: "Module 19: Binary Trees: Threaded Binary Trees & Morris Traversal",
      description: "Design level-order serialization and stream-based deserialization algorithms to encode and decode binary trees in O(N) time.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 108: Serialize and De-serialize Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=-YbXySKJsX8"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Serialize and Deserialize Binary Tree",
          url: "https://takeuforward.org/data-structure/serialize-and-deserialize-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Serialize and Deserialize Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"),
          difficulty: "Hard",
          description: "Design an algorithm to serialize a binary tree to a string and deserialize it back.",
        },
        {
          platform: "LeetCode",
          title: "Serialize and Deserialize BST",
          url: cleanUrl("https://leetcode.com/problems/serialize-and-deserialize-bst/"),
          difficulty: "Medium",
          description: "Optimize tree serialization using BST key boundary properties.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Serialize and deserialize a binary tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1"),
          difficulty: "Medium",
          description: "Convert a tree into an array of integers and reconstruct it back.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Design an algorithm to **serialize** a binary tree into a single string, and **deserialize** that string back into the identical original binary tree.

### 💡 Key Takeaways
- **1. Serialization via Level-Order BFS:**
  - Run standard BFS queue traversal, appending node values separated by commas (\`,\`).
  - When encountering a \`nullptr\` child, append a special null symbol (e.g., \`'#'\` or \`'null'\`).
  - Example string: \`"1,2,3,#,#,4,5,#,#,#,#,"\`.
- **2. Deserialization via \`stringstream\` + \`getline\`:**
  - Wrap the string in \`stringstream s(data)\`.
  - Read the first token using \`getline(s, str, ',')\` and allocate \`root = new TreeNode(stoi(str))\`.
  - Push \`root\` to queue \`q\`.
  - While \`!q.empty()\`:
    - Pop \`curr = q.front()\`.
    - Read next token for left child: if \`str != "#"\`, create \`curr->left\` and push to \`q\`.
    - Read next token for right child: if \`str != "#"\`, create \`curr->right\` and push to \`q\`.
- **Complexity:** \`O(N)\` Time and \`O(N)\` Space for both operations.

### 💻 Serialize & Deserialize Blueprint
\`\`\`cpp
class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "";
        string s = "";
        queue<TreeNode*> q;
        q.push(root);

        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();
            if (curr == nullptr) {
                s += "#,";
            } else {
                s += to_string(curr->val) + ",";
                q.push(curr->left);
                q.push(curr->right);
            }
        }
        return s;
    }

    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        stringstream s(data);
        string str;
        getline(s, str, ',');
        TreeNode* root = new TreeNode(stoi(str));
        queue<TreeNode*> q;
        q.push(root);

        while (!q.empty()) {
            TreeNode* curr = q.front();
            q.pop();

            // Left child
            getline(s, str, ',');
            if (str != "#") {
                curr->left = new TreeNode(stoi(str));
                q.push(curr->left);
            }

            // Right child
            getline(s, str, ',');
            if (str != "#") {
                curr->right = new TreeNode(stoi(str));
                q.push(curr->right);
            }
        }
        return root;
    }
};
\`\`\``,
    },
    {
      order: 109,
      name: "Threaded Binary Trees: Morris Inorder & Preorder Traversal in O(1) Auxiliary Space",
      slug: "dsa-morris-traversal-inorder-preorder",
      subtrack: "Module 19: Binary Trees: Threaded Binary Trees & Morris Traversal",
      description: "Traverse binary trees in O(N) time and O(1) auxiliary space without recursion or stack by temporarily threading predecessor pointers.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 109: Morris Traversal | Preorder | Inorder",
          url: cleanUrl("https://www.youtube.com/watch?v=80Zug6D1_r4"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Morris Inorder Traversal of a Binary Tree",
          url: "https://takeuforward.org/data-structure/morris-inorder-traversal-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Inorder Traversal (Morris O(1) Space)",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-inorder-traversal/"),
          difficulty: "Easy",
          description: "Implement Inorder traversal in O(1) extra space using temporary threaded pointers.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Preorder Traversal (Morris O(1) Space)",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-preorder-traversal/"),
          difficulty: "Easy",
          description: "Implement Preorder traversal in O(1) extra space using Morris threading.",
        },
        {
          platform: "LeetCode",
          title: "Recover Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/recover-binary-search-tree/"),
          difficulty: "Medium",
          description: "Fix swapped BST nodes in O(1) space using Morris inorder traversal.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Standard recursive and stack-based traversals require \`O(H)\` auxiliary stack space. **Morris Traversal** uses the concept of **Threaded Binary Trees** to traverse in **\`O(N)\` Time** using strictly **\`O(1)\` Extra Space** without modifying the tree structure permanently!

### 💡 Key Takeaways
- **The Core Problem:**
  - After finishing a left subtree, how do we jump back up to the root without a call stack?
  - The last node visited in a left subtree during Inorder is its **inorder predecessor** (the rightmost node of the left subtree).
- **The Temporary Thread Trick:**
  - Before descending into \`curr->left\`, find its predecessor: \`prev = curr->left; while (prev->right && prev->right != curr) prev = prev->right;\`.
  - **Case 1 (Thread Doesn't Exist):** Create a temporary bridge \`prev->right = curr\`, and move \`curr = curr->left\`. (For *Preorder*, record \`curr->val\` right here before diving left!).
  - **Case 2 (Thread Already Exists):** We have returned from the left subtree! Cut the thread \`prev->right = nullptr\` to restore the tree. (For *Inorder*, record \`curr->val\` here!). Then move \`curr = curr->right\`.
- **Case 3 (No Left Child):** Record \`curr->val\` and move \`curr = curr->right\`.

### 💻 Morris Inorder Blueprint
\`\`\`cpp
vector<int> getInorderMorris(TreeNode* root) {
    vector<int> inorder;
    TreeNode* curr = root;

    while (curr != nullptr) {
        if (curr->left == nullptr) {
            inorder.push_back(curr->val);
            curr = curr->right;
        } else {
            TreeNode* prev = curr->left;
            while (prev->right && prev->right != curr) {
                prev = prev->right;
            }
            if (prev->right == nullptr) {
                prev->right = curr; // Create thread
                curr = curr->left;
            } else {
                prev->right = nullptr; // Sever thread (restore tree)
                inorder.push_back(curr->val);
                curr = curr->right;
            }
        }
    }
    return inorder;
}
\`\`\``,
    },
    {
      order: 110,
      name: "In-Place Suffix Threading: Flatten a Binary Tree to a Linked List",
      slug: "dsa-flatten-binary-tree-to-linked-list",
      subtrack: "Module 19: Binary Trees: Threaded Binary Trees & Morris Traversal",
      description: "Flatten a binary tree into a right-skewed linked list in-place using O(1) space Morris threading and reverse postorder recursion.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 110: Flatten a Binary Tree to Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=sWf7k1x9XR4"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Flatten a Binary Tree to Linked List",
          url: "https://takeuforward.org/data-structure/flatten-a-binary-tree-to-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Flatten Binary Tree to Linked List",
          url: cleanUrl("https://leetcode.com/problems/flatten-binary-tree-to-linked-list/"),
          difficulty: "Medium",
          description: "Flatten binary tree to a linked list in-place according to preorder sequence.",
        },
        {
          platform: "LeetCode",
          title: "Flatten a Multilevel Doubly Linked List",
          url: cleanUrl("https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/"),
          difficulty: "Medium",
          description: "Flatten multilevel child pointers into a single doubly linked list.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Flatten binary tree to linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/flatten-binary-tree-to-linked-list/1"),
          difficulty: "Medium",
          description: "Rearrange tree nodes in-place such that left pointers are NULL and right pointers follow preorder.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a binary tree, flatten the tree into a "linked list" **in-place**:
- Every node's \`left\` child pointer must be set to \`nullptr\`.
- Every node's \`right\` child pointer points to the next node in the tree's **Preorder Traversal**.
- You must **rearrange the existing nodes** (allocating new nodes is strictly forbidden).

### 💡 Key Takeaways (3 Approaches)
- **Approach 1: Reverse Postorder Recursion (\`Right → Left → Root\` — \`O(N)\` Time, \`O(H)\` Space):**
  - Maintain global \`TreeNode* prev = nullptr\`.
  - Recurse \`flatten(root->right)\`, then \`flatten(root->left)\`.
  - Set \`root->right = prev\`, \`root->left = nullptr\`, and update \`prev = root\`.
- **Approach 2: Iterative Stack (\`O(N)\` Time, \`O(N)\` Space):**
  - Push \`root\` into a stack. While \`!st.empty()\`, pop \`curr\`, push \`curr->right\`, then \`curr->left\`. Set \`curr->right = st.top()\`, \`curr->left = nullptr\`.
- **Approach 3: Morris In-Place Threading (Optimal — \`O(N)\` Time, \`O(1)\` Space):**
  - For current node \`curr\`:
    - If \`curr->left != nullptr\`:
      - Find the rightmost node of \`curr->left\` (\`prev = curr->left; while (prev->right) prev = prev->right;\`).
      - Connect: \`prev->right = curr->right\`.
      - Shift left branch to right: \`curr->right = curr->left; curr->left = nullptr\`.
    - Advance \`curr = curr->right\`.

### 💻 Optimal O(1) Space Morris Flattening Blueprint
\`\`\`cpp
void flatten(TreeNode* root) {
    TreeNode* curr = root;
    while (curr != nullptr) {
        if (curr->left != nullptr) {
            TreeNode* prev = curr->left;
            while (prev->right != nullptr) {
                prev = prev->right;
            }
            // Attach original right subtree to rightmost leaf of left branch
            prev->right = curr->right;
            curr->right = curr->left;
            curr->left = nullptr;
        }
        curr = curr->right;
    }
}
\`\`\``,
    },
  ];

  // 4. Upsert topics into database
  console.log("\n📦 Upserting 10 Batch 11 Topics into PostgreSQL...");
  const topicIdMap = new Map();

  for (const topic of batch11Topics) {
    const cleanedSummary = cleanText(topic.summaryMarkdown);
    const cleanedDescription = cleanText(topic.description);
    const cleanedPracticeItems = topic.practiceItems.map((p) => ({
      ...p,
      title: cleanText(p.title),
      description: cleanText(p.description),
      url: cleanUrl(p.url),
    }));

    const res = await pool.query(
      `INSERT INTO topics (
        name, slug, description, subtrack, 
        summary_markdown, theory_summary, 
        doc_links, video_links, practice_items
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9::jsonb)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        subtrack = EXCLUDED.subtrack,
        summary_markdown = EXCLUDED.summary_markdown,
        theory_summary = EXCLUDED.theory_summary,
        doc_links = EXCLUDED.doc_links,
        video_links = EXCLUDED.video_links,
        practice_items = EXCLUDED.practice_items
      RETURNING id, name, slug, subtrack;`,
      [
        topic.name,
        topic.slug,
        cleanedDescription,
        topic.subtrack,
        cleanedSummary,
        cleanedSummary, // Sync theory_summary with summary_markdown
        JSON.stringify(topic.docLinks),
        JSON.stringify(topic.videoLinks),
        JSON.stringify(cleanedPracticeItems),
      ]
    );

    const seededTopic = res.rows[0];
    topicIdMap.set(seededTopic.slug, seededTopic);
    console.log(`✅ Upserted Topic [ID: ${seededTopic.id}]: "${seededTopic.name}" under [${seededTopic.subtrack}]`);

    // Sync entries in resources table for this topic
    await pool.query("DELETE FROM resources WHERE topic_id = $1", [seededTopic.id]);

    // Primary Video Resource
    if (topic.videoLinks?.[0]) {
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

    // Official Documentation Resource
    if (topic.docLinks?.[0]) {
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

  // 5. Update track_topics: Link Batch 11 Topics to topic_order 101 through 110
  console.log("\n🔄 Linking Batch 11 topics to 'problem-solving-dsa-sql' (orders 101..110)...");

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

  // Link Batch 11 Topics (orders 101..110)
  for (const topicDef of batch11Topics) {
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

  console.log("\n🎉 DSA Batch 11 (Lectures 101–110) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch11()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch11;
