const pool = require("../config/db");

// Helper to remove any citations, LaTeX commands, or dollar signs
const cleanText = (str) => {
  if (!str) return str;
  return str
    .replace(/\[cite:\s*\d+\]/g, "")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "infinity")
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
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

const seedDsaBatch10 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 10 (Lectures 91–100) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 10 Topics (Lectures 91–100)
  const batch10Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 16: Binary Trees: Structural Properties & Path Sums (Topic 91)
    // =========================================================================
    {
      order: 91,
      name: "Alternating Direction BFS: Zig-Zag / Spiral Level Order Traversal",
      slug: "dsa-zigzag-spiral-level-order-traversal",
      subtrack: "Module 16: Binary Trees: Structural Properties & Path Sums",
      description: "Traverse a binary tree level by level alternating direction between left-to-right and right-to-left using index mapping.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 91: Zig-Zag or Spiral Traversal in Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=3OXWEdlIGl4"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Zig Zag Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/zig-zag-traversal-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Level Order Traversal II",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-level-order-traversal-ii/"),
          difficulty: "Medium",
          description: "Return bottom-up level order traversal alternating from the leaf levels up to root.",
        },
        {
          platform: "LeetCode",
          title: "Average of Levels in Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/average-of-levels-in-binary-tree/"),
          difficulty: "Easy",
          description: "Capture level snapshots during BFS to compute averages per level.",
        },
        {
          platform: "GeeksforGeeks",
          title: "ZigZag Tree Traversal",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/zigzag-tree-traversal/1"),
          difficulty: "Medium",
          description: "Traverse a tree in alternating left-to-right and right-to-left order.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
In a **Zig-Zag (Spiral) Traversal**, we visit level 1 from left to right, level 2 from right to left, level 3 from left to right, and continue alternating direction at every subsequent level.

### 💡 Key Takeaways
- **The Flag Index-Mapping Trick (\`leftToRight\` boolean):**
  - We do not need to reverse the queue or push children in reverse order!
  - Run standard BFS with a \`queue<TreeNode*> q\`.
  - Maintain a boolean \`leftToRight = true\`.
  - At each level with \`size\` nodes, create a fixed-size row vector: \`vector<int> row(size)\`.
  - For each node at loop index \`i\` (from \`0\` to \`size - 1\`):
    - If \`leftToRight == true\`, place the node value at \`row[i]\`.
    - If \`leftToRight == false\`, place the node value in reverse at \`row[size - 1 - i]\`.
  - Toggle \`leftToRight = !leftToRight\` after completing each level.
- **Complexity:** \`O(N)\` Time and \`O(N)\` Space.

### 💻 Zig-Zag Traversal Blueprint
\`\`\`cpp
vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (root == nullptr) return result;

    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;

    while (!q.empty()) {
        int size = q.size();
        vector<int> row(size);

        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front();
            q.pop();

            // Direct index placement based on flag
            int index = leftToRight ? i : (size - 1 - i);
            row[index] = node->val;

            if (node->left != nullptr) q.push(node->left);
            if (node->right != nullptr) q.push(node->right);
        }
        leftToRight = !leftToRight; // Switch direction for next level
        result.push_back(row);
    }
    return result;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 17: Binary Trees: Views, Projections & Ancestry Analysis (Topics 92–100)
    // =========================================================================
    {
      order: 92,
      name: "Perimeter Decomposition: Anti-Clockwise Boundary Traversal of a Binary Tree",
      slug: "dsa-boundary-traversal-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Collect the outermost perimeter nodes of a binary tree in anti-clockwise order by decomposing into left boundary, leaf nodes, and reverse right boundary.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 92: Boundary Traversal of a Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=0ca1nvR0be4"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Boundary Traversal of a Binary Tree",
          url: "https://takeuforward.org/data-structure/boundary-traversal-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Boundary Traversal of binary tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1"),
          difficulty: "Medium",
          description: "Print the boundary nodes of a binary tree in anti-clockwise direction starting from root.",
        },
        {
          platform: "LeetCode",
          title: "Boundary of Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/boundary-of-binary-tree/"),
          difficulty: "Medium",
          description: "Deconstruct anti-clockwise perimeter traversal into left boundary, leaves, and reverse right boundary.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Right Side View",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-right-side-view/"),
          difficulty: "Medium",
          description: "Compare right boundary traversal with level-order right-side projection.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
An **Anti-Clockwise Boundary Traversal** collects the outermost perimeter nodes of a binary tree: starting at the root, moving down the left boundary, across all leaf nodes from left to right, and back up the right boundary in reverse.

### 💡 Key Takeaways
- **The 3-Part Decomposition:**
  1. **Left Boundary (Excluding Leaves):** Start at \`root->left\`. Traverse downward taking \`curr = curr->left\` whenever possible; if \`left\` is null, take \`curr = curr->right\`. Stop when reaching a leaf node.
  2. **Leaf Nodes (Inorder / DFS):** Perform standard DFS preorder or inorder and append any node where \`node->left == nullptr && node->right == nullptr\`.
  3. **Right Boundary in Reverse (Excluding Leaves):** Start at \`root->right\`. Traverse downward taking \`curr = curr->right\` (or \`curr->left\` if right is null). Store nodes in an auxiliary stack/vector and push them into the result in reverse order!
- **Complexity:** \`O(N)\` Time and \`O(H)\` Space (where \`H\` is tree height).

### 💻 Boundary Traversal Blueprint
\`\`\`cpp
bool isLeaf(TreeNode* node) {
    return (node->left == nullptr && node->right == nullptr);
}

void addLeftBoundary(TreeNode* root, vector<int> &res) {
    TreeNode* curr = root->left;
    while (curr) {
        if (!isLeaf(curr)) res.push_back(curr->val);
        if (curr->left) curr = curr->left;
        else curr = curr->right;
    }
}

void addLeaves(TreeNode* root, vector<int> &res) {
    if (isLeaf(root)) {
        res.push_back(root->val);
        return;
    }
    if (root->left) addLeaves(root->left, res);
    if (root->right) addLeaves(root->right, res);
}

void addRightBoundary(TreeNode* root, vector<int> &res) {
    TreeNode* curr = root->right;
    vector<int> temp;
    while (curr) {
        if (!isLeaf(curr)) temp.push_back(curr->val);
        if (curr->right) curr = curr->right;
        else curr = curr->left;
    }
    for (int i = temp.size() - 1; i >= 0; i--) res.push_back(temp[i]);
}

vector<int> boundaryTraversal(TreeNode* root) {
    vector<int> res;
    if (root == nullptr) return res;
    if (!isLeaf(root)) res.push_back(root->val);
    addLeftBoundary(root, res);
    addLeaves(root, res);
    addRightBoundary(root, res);
    return res;
}
\`\`\``,
    },
    {
      order: 93,
      name: "Vertical Coordinate Mapping: Vertical Order Traversal of a Binary Tree",
      slug: "dsa-vertical-order-traversal-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Map nodes to 2D coordinates (x, y) and traverse vertical lines column by column using nested sorting maps.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 93: Vertical Order Traversal of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=q_a6lpbKJdw"),
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Vertical Order Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/vertical-order-traversal-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Vertical Order Traversal of a Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/"),
          difficulty: "Hard",
          description: "Sort vertical lines by column, then row, then node value for overlapping positions.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Vertical Order Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-vertical-order-traversal/"),
          difficulty: "Medium",
          description: "Traverse vertical lines from left to right without sorting ties by value.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Vertical Traversal of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/print-a-binary-tree-in-vertical-order/1"),
          difficulty: "Medium",
          description: "Print the vertical order traversal of nodes from leftmost to rightmost line.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Assign a 2D coordinate \`(x, y)\` to every node where \`x\` represents the vertical column (root starts at \`x = 0\`) and \`y\` represents the horizontal level (root starts at \`y = 0\`). Moving left is \`(x - 1, y + 1)\` and moving right is \`(x + 1, y + 1)\`. Output the nodes column by column from leftmost to rightmost.

### 💡 Key Takeaways
- **The Nested Map Data Structure:**
  - Use \`map<int, map<int, multiset<int>>> nodes\`:
    - First key \`int x\`: Vertical column (sorted automatically from negative to positive).
    - Second key \`int y\`: Level row (sorted from top to bottom).
    - Value \`multiset<int>\`: Collects duplicate/overlapping nodes at the same \`(x, y)\` coordinate in sorted numerical order.
- **Queue-Based BFS Coordinates:**
  - Push \`{root, {0, 0}}\` into a \`queue<pair<TreeNode*, pair<int, int>>> q\`.
  - When popping \`{node, {x, y}}\`, insert \`node->val\` into \`nodes[x][y]\`.
  - Push \`{node->left, {x - 1, y + 1}}\` and \`{node->right, {x + 1, y + 1}}\`.
- **Complexity:** \`O(N log N)\` Time (due to sorted map and multiset insertions) and \`O(N)\` Space.

### 💻 Vertical Order Traversal Blueprint
\`\`\`cpp
vector<vector<int>> verticalTraversal(TreeNode* root) {
    map<int, map<int, multiset<int>>> nodes;
    queue<pair<TreeNode*, pair<int, int>>> q;
    q.push({root, {0, 0}});

    while (!q.empty()) {
        auto p = q.front();
        q.pop();
        TreeNode* node = p.first;
        int x = p.second.first, y = p.second.second;

        nodes[x][y].insert(node->val);
        if (node->left) q.push({node->left, {x - 1, y + 1}});
        if (node->right) q.push({node->right, {x + 1, y + 1}});
    }

    vector<vector<int>> ans;
    for (auto p : nodes) {
        vector<int> col;
        for (auto q_pair : p.second) {
            col.insert(col.end(), q_pair.second.begin(), q_pair.second.end());
        }
        ans.push_back(col);
    }
    return ans;
}
\`\`\``,
    },
    {
      order: 94,
      name: "First-Vertical Projection: Top View of a Binary Tree",
      slug: "dsa-top-view-of-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Project nodes vertically to capture the topmost visible node on each vertical line using BFS level order and hash mapping.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 94: Top View of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=Et9OCDNvJ78"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Top View of a Binary Tree",
          url: "https://takeuforward.org/data-structure/top-view-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Top View of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1"),
          difficulty: "Medium",
          description: "Return the nodes visible when looking at the tree from the top.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Vertical Order Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-vertical-order-traversal/"),
          difficulty: "Medium",
          description: "Group nodes by column offset using BFS level order.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Bottom View of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1"),
          difficulty: "Medium",
          description: "Contrast first-seen vertical projection with last-seen vertical projection.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
When looking at a binary tree from the top, you only see the **very first node** that appears on each vertical line \`x\`. Nodes directly underneath on the same vertical line are hidden from sight.

### 💡 Key Takeaways
- **Why BFS Level Order Must Be Used (Not DFS):**
  - BFS visits nodes strictly from higher levels to lower levels.
  - The first time a vertical line \`line\` is visited during BFS, the current node is guaranteed to be the topmost node on that line!
- **Data Structures:**
  - \`map<int, int> mpp\`: Stores \`{line -> nodeValue}\` (sorted automatically from leftmost line to rightmost line).
  - \`queue<pair<TreeNode*, int>> q\`: Holds \`{node, line}\` pairs.
- **Top View Invariant:**
  - When popping \`{node, line}\`, only insert into \`mpp\` if \`mpp.find(line) == mpp.end()\`!
  - If \`line\` is already present, ignore it because a higher node on that vertical line was already recorded.

### 💻 Top View Blueprint
\`\`\`cpp
vector<int> topView(TreeNode* root) {
    vector<int> ans;
    if (root == nullptr) return ans;

    map<int, int> mpp; // {line -> first node val}
    queue<pair<TreeNode*, int>> q;
    q.push({root, 0});

    while (!q.empty()) {
        auto it = q.front();
        q.pop();
        TreeNode* node = it.first;
        int line = it.second;

        if (mpp.find(line) == mpp.end()) {
            mpp[line] = node->val; // Record only the first node seen on this line
        }
        if (node->left != nullptr) q.push({node->left, line - 1});
        if (node->right != nullptr) q.push({node->right, line + 1});
    }

    for (auto it : mpp) ans.push_back(it.second);
    return ans;
}
\`\`\``,
    },
    {
      order: 95,
      name: "Last-Vertical Projection: Bottom View of a Binary Tree",
      slug: "dsa-bottom-view-of-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Capture the bottommost node on each vertical line by unconditionally overwriting map entries during BFS level traversal.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 95: Bottom View of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=0FtVY6I4pB8"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Bottom View of a Binary Tree",
          url: "https://takeuforward.org/data-structure/bottom-view-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Bottom View of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1"),
          difficulty: "Medium",
          description: "Print the nodes visible when looking at the tree from the bottom.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Level Order Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-level-order-traversal/"),
          difficulty: "Medium",
          description: "Use FIFO queue processing to maintain vertical and level updates.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Top View of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1"),
          difficulty: "Medium",
          description: "Contrast bottom-view overwriting with top-view first-seen guards.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
When looking at a binary tree from the bottom, you see the **bottommost node** on each vertical line \`x\`. If two nodes overlap at the exact same depth on a line, the rightmost node obscures the left.

### 💡 Key Takeaways
- **The 1-Line Change From Top View:**
  - In Top View, we only wrote to \`mpp[line]\` if the key didn't exist yet.
  - In **Bottom View**, we unconditionally overwrite: **\`mpp[line] = node->val\`** on every visit!
  - Because BFS visits from top to bottom, the last node to overwrite \`mpp[line]\` is guaranteed to be the lowest node on that vertical line.
- **Complexity:** \`O(N log N)\` Time and \`O(N)\` Space.

### 💻 Bottom View Blueprint
\`\`\`cpp
vector<int> bottomView(TreeNode* root) {
    vector<int> ans;
    if (root == nullptr) return ans;

    map<int, int> mpp; // {line -> last node val}
    queue<pair<TreeNode*, int>> q;
    q.push({root, 0});

    while (!q.empty()) {
        auto it = q.front();
        q.pop();
        TreeNode* node = it.first;
        int line = it.second;

        // Unconditionally overwrite so the bottommost node remains
        mpp[line] = node->val;

        if (node->left != nullptr) q.push({node->left, line - 1});
        if (node->right != nullptr) q.push({node->right, line + 1});
    }

    for (auto it : mpp) ans.push_back(it.second);
    return ans;
}
\`\`\``,
    },
    {
      order: 96,
      name: "Level-Depth Projections: Right Side View & Left Side View of a Binary Tree",
      slug: "dsa-right-and-left-view-of-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Capture rightmost and leftmost nodes at each depth level in O(N) time and O(H) auxiliary space using reverse preorder DFS.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 96: Right and Left View of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=KV4mRzTjlAk"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Right/Left View of Binary Tree",
          url: "https://takeuforward.org/data-structure/right-left-view-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Right Side View",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-right-side-view/"),
          difficulty: "Medium",
          description: "Return the values of nodes visible from the right side.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Left View of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1"),
          difficulty: "Easy",
          description: "Print the nodes visible when viewed from the left side.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Depth of Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/maximum-depth-of-binary-tree/"),
          difficulty: "Easy",
          description: "Leverage depth tracking to record the first node discovered at each level.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The **Right View** of a binary tree contains the rightmost node at each depth level. The **Left View** contains the leftmost node at each depth level.

### 💡 Key Takeaways
- **The Reverse Preorder Trick (\`Root → Right → Left\` for Right View):**
  - By visiting \`Right\` before \`Left\`, the first node we encounter at any level \`level\` is guaranteed to be the rightmost node on that level!
  - Condition: If \`level == ans.size()\`, this is our first time reaching this depth—append \`node->val\` to \`ans\`.
- **For Left View (\`Root → Left → Right\`):**
  - Simply reverse the recursion order to visit \`Left\` before \`Right\`!
- **Complexity:** \`O(N)\` Time and \`O(H)\` Space (auxiliary stack), which is strictly superior to queue-based \`O(N)\` space.

### 💻 Right View (Reverse Preorder) Blueprint
\`\`\`cpp
void recursionRight(TreeNode* root, int level, vector<int> &res) {
    if (root == nullptr) return;

    // First time arriving at this level
    if (res.size() == level) res.push_back(root->val);

    recursionRight(root->right, level + 1, res); // Explore right first
    recursionRight(root->left, level + 1, res);  // Explore left second
}

vector<int> rightSideView(TreeNode* root) {
    vector<int> res;
    recursionRight(root, 0, res);
    return res;
}
\`\`\``,
    },
    {
      order: 97,
      name: "Mirror Reflection Invariant: Check for Symmetrical Binary Tree",
      slug: "dsa-symmetric-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Verify whether a binary tree is symmetric around its vertical axis by checking mirror equality on outer and inner subtree branches.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 97: Check for Symmetrical Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=nKggNAiEpBE"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check for Symmetrical Binary Tree",
          url: "https://takeuforward.org/data-structure/check-for-symmetrical-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Symmetric Tree",
          url: cleanUrl("https://leetcode.com/problems/symmetric-tree/"),
          difficulty: "Easy",
          description: "Check whether a tree is a mirror of itself around the center axis.",
        },
        {
          platform: "LeetCode",
          title: "Invert Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/invert-binary-tree/"),
          difficulty: "Easy",
          description: "Transform a tree into its exact mirror reflection in-place.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Symmetric Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/symmetric-tree/1"),
          difficulty: "Easy",
          description: "Verify if a binary tree is symmetric around its vertical center.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A binary tree is **Symmetric** if it forms an exact mirror reflection of itself around its vertical center root axis.

### 💡 Key Takeaways
- **The Mirror Invariant:**
  - For two subtrees \`left\` and \`right\` to be mirror images:
    1. Their root values must be equal (\`left->val == right->val\`).
    2. The outer branches must mirror each other: \`left->left\` mirrors \`right->right\`.
    3. The inner branches must mirror each other: \`left->right\` mirrors \`right->left\`.
- **Base Conditions:**
  - If both \`left == nullptr && right == nullptr\`: return \`true\`.
  - If only one is \`nullptr\`: return \`false\`.
- **Complexity:** \`O(N)\` Time and \`O(H)\` Space.

### 💻 Symmetric Tree Blueprint
\`\`\`cpp
bool isMirror(TreeNode* left, TreeNode* right) {
    if (left == nullptr || right == nullptr) {
        return (left == right);
    }
    return (left->val == right->val) &&
           isMirror(left->left, right->right) && // Outer branches
           isMirror(left->right, right->left);   // Inner branches
}

bool isSymmetric(TreeNode* root) {
    if (root == nullptr) return true;
    return isMirror(root->left, root->right);
}
\`\`\``,
    },
    {
      order: 98,
      name: "Backtracking Path Reconstruction: Print Root-to-Node Path in a Binary Tree",
      slug: "dsa-root-to-node-path-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Reconstruct the exact path of node values from root to any target node using boolean-guarded DFS backtracking.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 98: Print Root to Node Path in Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=fmflMqVOC7k"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Print Root to Node Path in a Binary Tree",
          url: "https://takeuforward.org/data-structure/print-root-to-node-path-in-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Paths",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-paths/"),
          difficulty: "Easy",
          description: "Return all root-to-leaf paths formatted as strings.",
        },
        {
          platform: "LeetCode",
          title: "Path Sum II",
          url: cleanUrl("https://leetcode.com/problems/path-sum-ii/"),
          difficulty: "Medium",
          description: "Find all root-to-leaf paths where the sum of values equals targetSum.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Root to Leaf Paths",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1"),
          difficulty: "Medium",
          description: "Find all full paths from the root node to all leaf nodes.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a binary tree and a target node value \`B\`, return the complete path of node values from the \`root\` down to node \`B\` in order.

### 💡 Key Takeaways
- **DFS Backtracking With Boolean Return:**
  - Maintain a running path vector \`arr\`.
  - At node \`curr\`:
    1. If \`curr == nullptr\`, return \`false\`.
    2. Add \`curr->val\` to \`arr\`.
    3. If \`curr->val == B\`, target found! Return \`true\` without popping.
    4. Explore \`getPath(curr->left, arr, B)\` or \`getPath(curr->right, arr, B)\`. If either returns \`true\`, return \`true\` immediately!
    5. If neither child branch reaches \`B\`, backtrack: pop \`arr.pop_back()\` and return \`false\`.
- **Complexity:** \`O(N)\` Time and \`O(H)\` Space.

### 💻 Root-to-Node Path Blueprint
\`\`\`cpp
bool getPath(TreeNode* root, vector<int> &arr, int x) {
    if (root == nullptr) return false;

    arr.push_back(root->val);
    if (root->val == x) return true;

    if (getPath(root->left, arr, x) || getPath(root->right, arr, x)) {
        return true;
    }
    arr.pop_back(); // Backtrack if x is not in this subtree
    return false;
}

vector<int> solve(TreeNode* root, int b) {
    vector<int> arr;
    if (root == nullptr) return arr;
    getPath(root, arr, b);
    return arr;
}
\`\`\``,
    },
    {
      order: 99,
      name: "Recursive Divergence Point: Lowest Common Ancestor (LCA) in a Binary Tree",
      slug: "dsa-lowest-common-ancestor-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Identify the lowest common ancestor of two nodes in O(N) time and O(H) space using single-pass bottom-up DFS divergence.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 99: Lowest Common Ancestor in Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=_-QHfMDde90"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Lowest Common Ancestor for two given Nodes",
          url: "https://takeuforward.org/data-structure/lowest-common-ancestor-for-two-given-nodes/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Lowest Common Ancestor of a Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"),
          difficulty: "Medium",
          description: "Find the lowest common ancestor node of two given nodes in a binary tree.",
        },
        {
          platform: "LeetCode",
          title: "Lowest Common Ancestor of a Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"),
          difficulty: "Medium",
          description: "Exploit BST key ordering to find LCA without searching both branches.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Lowest Common Ancestor in a Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1"),
          difficulty: "Medium",
          description: "Find the LCA of two nodes in a binary tree in O(N) time and O(1) extra space.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The **Lowest Common Ancestor (LCA)** of two nodes \`p\` and \`q\` is the deepest node in the tree that has both \`p\` and \`q\` as descendants (a node can be a descendant of itself).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force via Root-to-Node Paths (\`O(2N)\` Time, \`O(2N)\` Space):**
  - Find path 1 from root to \`p\` (\`[1, 2, 4]\`).
  - Find path 2 from root to \`q\` (\`[1, 2, 5, 7]\`).
  - Compare both paths from start to find the last common node (\`2\`).
- **2. Optimal Single-Pass DFS (\`O(N)\` Time, \`O(H)\` Space):**
  - Base Case: If \`root == nullptr || root == p || root == q\`, return \`root\`.
  - Recurse left: \`left = lowestCommonAncestor(root->left, p, q)\`.
  - Recurse right: \`right = lowestCommonAncestor(root->right, p, q)\`.
  - **Divergence Rule:**
    - If both \`left != nullptr && right != nullptr\`, one target was found in the left subtree and the other in the right subtree—**\`root\` is the LCA**!
    - If \`left == nullptr\`, return \`right\` (both targets lie in the right branch).
    - If \`right == nullptr\`, return \`left\`.

### 💻 Lowest Common Ancestor Blueprint
\`\`\`cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (root == nullptr || root == p || root == q) {
        return root;
    }
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if (left == nullptr) return right;
    else if (right == nullptr) return left;
    else return root; // Both left and right returned non-null -> root is LCA!
}
\`\`\``,
    },
    {
      order: 100,
      name: "Level-Indexed Coordinate Normalization: Maximum Width of a Binary Tree",
      slug: "dsa-maximum-width-of-binary-tree",
      subtrack: "Module 17: Binary Trees: Views, Projections & Ancestry Analysis",
      description: "Compute the maximum level width in a binary tree including virtual null nodes using 0-based coordinate normalization to prevent integer overflow.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 100: Maximum Width of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=ZbybYvcVLks"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Width of a Binary Tree",
          url: "https://takeuforward.org/data-structure/maximum-width-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Maximum Width of Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/maximum-width-of-binary-tree/"),
          difficulty: "Medium",
          description: "Find the maximum width of a binary tree including null nodes between end nodes.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Level Order Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-level-order-traversal/"),
          difficulty: "Medium",
          description: "Track queue level snapshots to frame width calculation.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Maximum Width of Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/maximum-width-of-tree/1"),
          difficulty: "Easy",
          description: "Compute the maximum number of nodes present across any single level.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The **Maximum Width** of a binary tree is the maximum width among all levels. The width of a level is defined as the length between the leftmost and rightmost non-null nodes, **including any null nodes** that would lie between them in a complete binary tree.

### 💡 Key Takeaways
- **Zero-Based Segment Tree Indexing:**
  - If a parent node at a level has index \`i\`:
    - Its left child has index \`2 * i + 1\`.
    - Its right child has index \`2 * i + 2\`.
  - The width of any level is: \`lastIndex - firstIndex + 1\`.
- **The Critical Integer Overflow Fix (Level-Normalization):**
  - In a deep skewed tree of height 1000, \`2 * i\` doubles at each level and quickly overflows 64-bit integers (\`2^1000\`).
  - **The Fix:** At the start of each level, capture \`minId = q.front().second\` (the index of the level's first node).
  - Subtract \`minId\` from every node's index at that level: **\`curr_id = q.front().second - minId\`**!
  - Now indices reset to \`0\` at the start of each level, completely preventing overflow!

### 💻 Maximum Width Blueprint
\`\`\`cpp
int widthOfBinaryTree(TreeNode* root) {
    if (root == nullptr) return 0;
    long long maxWidth = 0;
    queue<pair<TreeNode*, long long>> q;
    q.push({root, 0});

    while (!q.empty()) {
        int size = q.size();
        long long minId = q.front().second; // First index of current level
        long long first = 0, last = 0;

        for (int i = 0; i < size; i++) {
            long long curr_id = q.front().second - minId; // Normalize to avoid overflow
            TreeNode* node = q.front().first;
            q.pop();

            if (i == 0) first = curr_id;
            if (i == size - 1) last = curr_id;

            if (node->left) q.push({node->left, curr_id * 2 + 1});
            if (node->right) q.push({node->right, curr_id * 2 + 2});
        }
        maxWidth = max(maxWidth, last - first + 1);
    }
    return maxWidth;
}
\`\`\``,
    },
  ];

  // 4. Upsert topics into database
  console.log("\n📦 Upserting 10 Batch 10 Topics into PostgreSQL...");
  const topicIdMap = new Map();

  for (const topic of batch10Topics) {
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

  // 5. Update track_topics: Link Batch 10 Topics to topic_order 91 through 100
  console.log("\n🔄 Linking Batch 10 topics to 'problem-solving-dsa-sql' (orders 91..100)...");

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

  // Link Batch 10 Topics (orders 91..100)
  for (const topicDef of batch10Topics) {
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

  console.log("\n🎉 DSA Batch 10 (Lectures 91–100) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch10()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch10;
