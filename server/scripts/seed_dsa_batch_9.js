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

const seedDsaBatch9 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 9 (Lectures 81–90) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 9 Topics (Lectures 81–90)
  const batch9Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals (Topics 81–85)
    // =========================================================================
    {
      order: 81,
      name: "Explicit Call-Stack Simulation: Iterative Preorder Traversal of a Binary Tree",
      slug: "dsa-iterative-preorder-traversal-binary-tree",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Simulate recursive call stack mechanics iteratively using an explicit LIFO stack to achieve Root-Left-Right preorder traversal in O(N) time.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 81: Iterative Preorder Traversal of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=Bfqd8BsPVuw"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Iterative Preorder Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/iterative-preorder-traversal-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "N-ary Tree Preorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/n-ary-tree-preorder-traversal/"),
          difficulty: "Easy",
          description: "Simulate iterative preorder on trees with arbitrary child counts using a stack.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Preorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-preorder-traversal/"),
          difficulty: "Easy",
          description: "Implement stack-based preorder traversal without recursion.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Iterative Preorder",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/iterative-preorder-traversal/1"),
          difficulty: "Medium",
          description: "Traverse a binary tree iteratively in Root-Left-Right order.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
In an interview, you may be forbidden from using recursion to traverse a tree. To execute **Preorder Traversal (\`Root → Left → Right\`)** iteratively, we manually simulate the operating system's call stack using a standard **LIFO \`stack<TreeNode*>\`**.

### 💡 Key Takeaways
- **The Reverse Child Push Rule (\`Right First, Then Left\`):**
  - Because a stack is Last-In-First-Out (LIFO), whichever node is pushed **last** will be popped and processed **first**!
  - Therefore, whenever you pop \`node\`, you must push **\`node->right\` first**, and then push **\`node->left\` second** so that the left child sits on top of the stack ready to be processed next!
- **Algorithm Steps:**
  1. If \`root == nullptr\`, return an empty vector \`{}\`.
  2. Push \`root\` onto \`stack<TreeNode*> st\`.
  3. While \`!st.empty()\`:
     - Pop \`curr = st.top()\`.
     - Record \`curr->val\` into \`ans\`.
     - If \`curr->right != nullptr\`, push \`curr->right\`.
     - If \`curr->left != nullptr\`, push \`curr->left\`.
- **Complexity:** \`O(N)\` Time (every node pushed and popped once) and \`O(H)\` Space (where \`H\` is tree height).

### 💻 Iterative Preorder Blueprint
\`\`\`cpp
vector<int> iterativePreorder(TreeNode* root) {
    vector<int> ans;
    if (root == nullptr) return ans;

    stack<TreeNode*> st;
    st.push(root);

    while (!st.empty()) {
        TreeNode* curr = st.top();
        st.pop();
        ans.push_back(curr->val);

        // Push right first so left is popped first (LIFO)
        if (curr->right != nullptr) st.push(curr->right);
        if (curr->left != nullptr) st.push(curr->left);
    }
    return ans;
}
\`\`\``,
    },
    {
      order: 82,
      name: "Leftward Diving & In-Order Backtracking: Iterative Inorder Traversal of a Binary Tree",
      slug: "dsa-iterative-inorder-traversal-binary-tree",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Traverse a binary tree in Left-Root-Right order iteratively by diving down left subtrees and backtracking up the stack.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 82: Iterative Inorder Traversal of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=lxTGsVXjwvM"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Iterative Inorder Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/iterative-inorder-traversal-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Kth Smallest Element in a BST",
          url: cleanUrl("https://leetcode.com/problems/kth-smallest-element-in-a-bst/"),
          difficulty: "Medium",
          description: "Stop the iterative inorder stack traversal early once k elements have been popped.",
        },
        {
          platform: "LeetCode",
          title: "Binary Search Tree Iterator",
          url: cleanUrl("https://leetcode.com/problems/binary-search-tree-iterator/"),
          difficulty: "Medium",
          description: "Implement an iterator class using controlled iterative inorder stack progression.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Inorder Traversal (Iterative)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/inorder-traversal-iterative/1"),
          difficulty: "Medium",
          description: "Execute Left-Root-Right traversal using an explicit stack.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
**Iterative Inorder Traversal (\`Left → Root → Right\`)** requires visiting the leftmost leaf before printing any parent. We achieve this iteratively using an auxiliary stack and a current pointer \`node = root\`.

### 💡 Key Takeaways
- **The Two-Phase State Loop:**
  - **Phase 1 (Diving Left):** While \`node != nullptr\`, push \`node\` onto the stack and dive deeper left: \`node = node->left\`.
  - **Phase 2 (Processing Root & Pivoting Right):** When \`node == nullptr\` (we have hit the bottom left), pop the top node from the stack, record its value, and pivot to its right subtree: \`node = topNode->right\`.
- **Termination Condition:** Run while \`node != nullptr || !st.empty()\`. When both are false, the entire tree has been traversed.
- **Complexity:** \`O(N)\` Time and \`O(H)\` Space (where \`H\` is tree height).

### 💻 Iterative Inorder Blueprint
\`\`\`cpp
vector<int> iterativeInorder(TreeNode* root) {
    vector<int> ans;
    stack<TreeNode*> st;
    TreeNode* node = root;

    while (true) {
        if (node != nullptr) {
            st.push(node);
            node = node->left; // Keep diving left
        } else {
            if (st.empty()) break;
            node = st.top();
            st.pop();
            ans.push_back(node->val); // Process root
            node = node->right;       // Move right
        }
    }
    return ans;
}
\`\`\``,
    },
    {
      order: 83,
      name: "Dual-Stack Inversion Pipeline: Iterative Postorder Traversal Using 2 Stacks",
      slug: "dsa-iterative-postorder-traversal-two-stacks",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Leverage dual stacks to exploit reversal symmetry (Root-Right-Left reverses into Left-Right-Root) for clean postorder traversal.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 83: Post-order Traversal of Binary Tree using 2 Stacks",
          url: cleanUrl("https://www.youtube.com/watch?v=2YBhNLodD8Q"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Iterative Postorder Traversal using 2 Stacks",
          url: "https://takeuforward.org/data-structure/iterative-postorder-traversal-using-2-stacks/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Postorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-postorder-traversal/"),
          difficulty: "Easy",
          description: "Implement postorder traversal using an iterative stack approach.",
        },
        {
          platform: "LeetCode",
          title: "N-ary Tree Postorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/n-ary-tree-postorder-traversal/"),
          difficulty: "Easy",
          description: "Generalize two-stack postorder reversal to N-ary trees.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Postorder Traversal (Iterative)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/postorder-traversal-iterative/1"),
          difficulty: "Medium",
          description: "Traverse a tree in Left-Right-Root order using iterative methods.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
While **Postorder Traversal (\`Left → Right → Root\`)** is tricky to do iteratively with one stack, it becomes trivial using **two stacks** by exploiting reversal symmetry!

### 💡 Key Takeaways
- **The Reversal Intuition (\`Root-Right-Left Reverses to Left-Right-Root\`):**
  - Recall that standard preorder is \`Root → Left → Right\`.
  - If we instead traverse in \`Root → Right → Left\` order and push every visited node into a second stack \`st2\`, popping \`st2\` at the end outputs the exact reverse: **\`Left → Right → Root\` (Postorder)**!
- **Algorithm Steps:**
  1. Push \`root\` into \`st1\`.
  2. While \`!st1.empty()\`:
     - Pop \`curr = st1.top()\`.
     - Push \`curr\` into \`st2\`.
     - If \`curr->left != nullptr\`, push \`curr->left\` into \`st1\`.
     - If \`curr->right != nullptr\`, push \`curr->right\` into \`st1\`.
  3. Pop all elements from \`st2\` into \`ans\`.
- **Complexity:** \`O(N)\` Time and \`O(2N)\` Space across both stacks.

### 💻 Iterative Postorder (2 Stacks) Blueprint
\`\`\`cpp
vector<int> postorderTwoStacks(TreeNode* root) {
    vector<int> ans;
    if (root == nullptr) return ans;

    stack<TreeNode*> st1, st2;
    st1.push(root);

    while (!st1.empty()) {
        TreeNode* curr = st1.top();
        st1.pop();
        st2.push(curr);

        if (curr->left != nullptr) st1.push(curr->left);
        if (curr->right != nullptr) st1.push(curr->right);
    }

    while (!st2.empty()) {
        ans.push_back(st2.top()->val);
        st2.pop();
    }
    return ans;
}
\`\`\``,
    },
    {
      order: 84,
      name: "Single-Stack Boundary Tracking: Iterative Postorder Traversal Using 1 Stack",
      slug: "dsa-iterative-postorder-traversal-one-stack",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Execute Left-Right-Root postorder traversal iteratively with strictly one stack by tracking right child completion and unwinding ancestors.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 84: Post-order Traversal of Binary Tree using 1 Stack",
          url: cleanUrl("https://www.youtube.com/watch?v=NzIGLLwZBS8"),
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Iterative Postorder Traversal using 1 Stack",
          url: "https://takeuforward.org/data-structure/iterative-postorder-traversal-using-1-stack/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Postorder Traversal (Constant Space / 1 Stack)",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-postorder-traversal/"),
          difficulty: "Easy",
          description: "Perform postorder traversal using strictly one stack.",
        },
        {
          platform: "LeetCode",
          title: "Vertical Order Traversal of a Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/"),
          difficulty: "Hard",
          description: "Coordinate postorder and vertical tree coordinates using custom stack/map tracking.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Postorder Traversal from given Inorder and Preorder",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/postorder-traversal-from-given-inorder-and-preorder-traversals/1"),
          difficulty: "Medium",
          description: "Construct postorder sequence directly without full tree instantiation.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Implementing iterative Postorder using **only 1 stack** is a classic FAANG interview question. Because a parent node must wait for its right child to complete before it can be processed, we dive left, check the right child, and backtrack up the stack when returning from right subtrees.

### 💡 Key Takeaways
- **The Single-Stack State Invariant:**
  - Maintain pointer \`curr = root\` and an auxiliary stack.
  - While \`curr != nullptr || !st.empty()\`:
    1. If \`curr != nullptr\`: Push \`curr\` to stack and continue diving left (\`curr = curr->left\`).
    2. Else: Check \`temp = st.top()->right\`.
       - If \`temp != nullptr\`: A right child exists and hasn't been visited—set \`curr = temp\` to explore it.
       - If \`temp == nullptr\`: No right child exists! Pop \`temp = st.top()\`, append to \`ans\`, and **unwind all completed ancestors** whose right child equals \`temp\` using an inner while loop!
- **Complexity:** \`O(2N) = O(N)\` Time (every node is visited at most twice) and \`O(H)\` Space (strictly one stack of height \`H\`).

### 💻 Iterative Postorder (1 Stack) Blueprint
\`\`\`cpp
vector<int> postorderOneStack(TreeNode* root) {
    vector<int> ans;
    stack<TreeNode*> st;
    TreeNode* curr = root;

    while (curr != nullptr || !st.empty()) {
        if (curr != nullptr) {
            st.push(curr);
            curr = curr->left;
        } else {
            TreeNode* temp = st.top()->right;
            if (temp == nullptr) {
                temp = st.top();
                st.pop();
                ans.push_back(temp->val);
                // Unwind completed parent nodes
                while (!st.empty() && temp == st.top()->right) {
                    temp = st.top();
                    st.pop();
                    ans.push_back(temp->val);
                }
            } else {
                curr = temp;
            }
        }
    }
    return ans;
}
\`\`\``,
    },
    {
      order: 85,
      name: "State-Tagged Stack Unification: Preorder, Inorder & Postorder in a Single Traversal",
      slug: "dsa-all-traversals-in-one-pass",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Unify preorder, inorder, and postorder traversals in a single pass using state-tagged stack pairs tracking node visit counts.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 85: Preorder, Inorder, and Postorder in One Traversal",
          url: cleanUrl("https://www.youtube.com/watch?v=ySp2epYvgTE"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Preorder Inorder Postorder in One Traversal",
          url: "https://takeuforward.org/data-structure/preorder-inorder-postorder-traversals-in-one-traversal/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Tree Traversals",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/tree-traversal--170646/1"),
          difficulty: "Easy",
          description: "Return inorder, preorder, and postorder traversals in a single combined pass.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Level Order Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-level-order-traversal/"),
          difficulty: "Medium",
          description: "Compare single-stack DFS state transitions with single-queue BFS level snapshots.",
        },
        {
          platform: "LeetCode",
          title: "Binary Tree Inorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-inorder-traversal/"),
          difficulty: "Easy",
          description: "Contrast state-tagged stack iteration with classical two-phase inorder.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Instead of writing three separate algorithms, we can generate **Preorder, Inorder, and Postorder simultaneously in a single pass** using a stack of pairs: **\`stack<pair<TreeNode*, int>> st\`**, where \`int num\` tracks how many times a node has been visited (1, 2, or 3).

### 💡 Key Takeaways
- **The 3-State Rule:**
  - **State 1 (First visit → Preorder):** Append \`node->val\` to \`preorder\`, increment \`num = 2\`, and push \`node->left\` with state \`1\`.
  - **State 2 (Second visit → Inorder):** Append \`node->val\` to \`inorder\`, increment \`num = 3\`, and push \`node->right\` with state \`1\`.
  - **State 3 (Third visit → Postorder):** Append \`node->val\` to \`postorder\` and **pop** the node permanently from the stack!
- **Complexity:** \`O(3N) = O(N)\` Time and \`O(4N)\` Space (holding the 3 result lists plus stack).

### 💻 Preorder, Inorder & Postorder in One Pass Blueprint
\`\`\`cpp
void allTraversals(TreeNode* root, vector<int> &pre, vector<int> &in, vector<int> &post) {
    if (root == nullptr) return;
    stack<pair<TreeNode*, int>> st;
    st.push({root, 1});

    while (!st.empty()) {
        auto p = st.top();
        st.pop();

        if (p.second == 1) {
            pre.push_back(p.first->val);
            p.second++;
            st.push(p);
            if (p.first->left != nullptr) st.push({p.first->left, 1});
        } else if (p.second == 2) {
            in.push_back(p.first->val);
            p.second++;
            st.push(p);
            if (p.first->right != nullptr) st.push({p.first->right, 1});
        } else {
            post.push_back(p.first->val);
        }
    }
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 16: Binary Trees: Structural Properties & Path Sums (Topics 86–90)
    // =========================================================================
    {
      order: 86,
      name: "Subtree Height Recurrence: Maximum Depth of a Binary Tree (DFS & BFS)",
      slug: "dsa-maximum-depth-of-binary-tree",
      subtrack: "Module 16: Binary Trees: Structural Properties & Path Sums",
      description: "Calculate tree height using recursive bottom-up subtree evaluation (1 + max(lh, rh)) and queue-based level counting.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 86: Maximum Depth in Binary Tree | Height of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=eD3tmO66aBA"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Depth of a Binary Tree",
          url: "https://takeuforward.org/data-structure/maximum-depth-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimum Depth of Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/minimum-depth-of-binary-tree/"),
          difficulty: "Easy",
          description: "Find the minimum depth to the nearest leaf node, handling single-child cases correctly.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Depth of N-ary Tree",
          url: cleanUrl("https://leetcode.com/problems/maximum-depth-of-n-ary-tree/"),
          difficulty: "Easy",
          description: "Generalize max depth recurrence across arbitrary child branches.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Height of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/height-of-binary-tree/1"),
          difficulty: "Easy",
          description: "Calculate the maximum number of edges or nodes on the longest root-to-leaf path.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The **Maximum Depth (Height)** of a binary tree is the number of nodes along the longest path from the root node down to the farthest leaf node.

### 💡 Key Takeaways
- **The Core Recurrence:**
  - The height of any node is: **\`1 + max(height(left), height(right))\`**.
  - **Base Case:** If \`node == nullptr\`, return \`0\`.
- **Alternative BFS Level Count:**
  - You can also compute height using Level-Order Traversal (BFS) by counting how many total levels the queue processes.
- **Complexity:** \`O(N)\` Time and \`O(H)\` Space (where \`H\` is tree height).

### 💻 Maximum Depth Blueprint
\`\`\`cpp
int maxDepth(TreeNode* root) {
    if (root == nullptr) return 0;
    int lh = maxDepth(root->left);
    int rh = maxDepth(root->right);
    return 1 + max(lh, rh);
}
\`\`\``,
    },
    {
      order: 87,
      name: "Bottom-Up Height-Balance Validation: Check if a Binary Tree Is Balanced in O(N) Time",
      slug: "dsa-check-for-balanced-binary-tree",
      subtrack: "Module 16: Binary Trees: Structural Properties & Path Sums",
      description: "Verify if a binary tree is height-balanced in O(N) time by returning -1 on subtree imbalance instead of repeating height calculations.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 87: Check for Balanced Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=Yt50Jfbd8Po"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check for Balanced Binary Tree",
          url: "https://takeuforward.org/data-structure/check-for-balanced-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Balanced Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/balanced-binary-tree/"),
          difficulty: "Easy",
          description: "Determine if a binary tree is height-balanced in O(N) time.",
        },
        {
          platform: "LeetCode",
          title: "Balance a Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/balance-a-binary-search-tree/"),
          difficulty: "Medium",
          description: "Convert an unbalanced BST into a balanced BST using sorted inorder construction.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Check for Balanced Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/check-for-balanced-tree/1"),
          difficulty: "Easy",
          description: "Return true if the height difference between left and right subtrees <= 1 for all nodes.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A binary tree is **Height-Balanced** if, for every node in the tree, the absolute difference in height between its left subtree and right subtree is **at most 1** (\`|height(left) - height(right)| <= 1\`).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force (\`O(N²)\` Time):** At every node, call \`maxDepth\` on left and right subtrees (\`O(N)\` per node).
- **2. Optimal Bottom-Up Propagation (\`O(N)\` Time, \`O(H)\` Space):**
  - Modify the standard \`maxDepth\` function so that it checks balance **while** calculating height!
  - If a subtree is unbalanced, immediately return **\`-1\`** to signal failure up the call stack.
  - If either \`lh == -1\` or \`rh == -1\`, or \`abs(lh - rh) > 1\`, return \`-1\`.
  - Otherwise, return \`1 + max(lh, rh)\`.

### 💻 Balanced Binary Tree Blueprint
\`\`\`cpp
int checkHeight(TreeNode* root) {
    if (root == nullptr) return 0;

    int lh = checkHeight(root->left);
    if (lh == -1) return -1; // Left subtree is already unbalanced

    int rh = checkHeight(root->right);
    if (rh == -1) return -1; // Right subtree is already unbalanced

    if (abs(lh - rh) > 1) return -1; // Current node violates balance
    return 1 + max(lh, rh);
}

bool isBalanced(TreeNode* root) {
    return checkHeight(root) != -1;
}
\`\`\``,
    },
    {
      order: 88,
      name: "Longest Inter-Node Path: Diameter of a Binary Tree in O(N) Time",
      slug: "dsa-diameter-of-binary-tree",
      subtrack: "Module 16: Binary Trees: Structural Properties & Path Sums",
      description: "Compute the longest path between any two nodes in a tree in a single O(N) postorder pass by tracking left plus right subtree heights.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 88: Diameter of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=Rezetez59Nk"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Calculate the Diameter of a Binary Tree",
          url: "https://takeuforward.org/data-structure/calculate-the-diameter-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Diameter of Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/diameter-of-binary-tree/"),
          difficulty: "Easy",
          description: "Compute the length of the longest path between any two nodes in a tree.",
        },
        {
          platform: "LeetCode",
          title: "Tree Diameter",
          url: cleanUrl("https://leetcode.com/problems/tree-diameter/"),
          difficulty: "Medium",
          description: "Calculate diameter on an undirected tree using two-pass BFS/DFS.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Diameter of a Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1"),
          difficulty: "Medium",
          description: "Find the longest path between any two end nodes of a binary tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The **Diameter** of a binary tree is the length of the longest path between any two nodes. This path **does not need to pass through the root**.

### 💡 Key Takeaways
- **The Longest Path Through a Node:**
  - The longest path turning at any node \`curr\` is: **\`lh + rh\`** (left subtree height + right subtree height).
- **Optimal Single Pass (\`O(N)\` Time, \`O(H)\` Space):**
  - Pass a reference \`diameter = 0\` into the \`maxDepth\` function.
  - At every node:
    1. Compute \`lh = height(curr->left)\` and \`rh = height(curr->right)\`.
    2. Update global diameter: \`diameter = max(diameter, lh + rh)\`.
    3. Return node height to parent: \`1 + max(lh, rh)\`.

### 💻 Diameter of Binary Tree Blueprint
\`\`\`cpp
int calculateHeight(TreeNode* node, int &diameter) {
    if (node == nullptr) return 0;
    int lh = calculateHeight(node->left, diameter);
    int rh = calculateHeight(node->right, diameter);

    diameter = max(diameter, lh + rh); // Update longest path seen so far
    return 1 + max(lh, rh);            // Return height to parent
}

int diameterOfBinaryTree(TreeNode* root) {
    int diameter = 0;
    calculateHeight(root, diameter);
    return diameter;
}
\`\`\``,
    },
    {
      order: 89,
      name: "Negative-Pruned Branch Selection: Maximum Path Sum in a Binary Tree",
      slug: "dsa-maximum-path-sum-binary-tree",
      subtrack: "Module 16: Binary Trees: Structural Properties & Path Sums",
      description: "Find the maximum path sum between any two nodes in a tree with negative node values by pruning sub-zero branch gains to 0.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 89: Maximum Path Sum in Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=WszrfSwMz58"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Sum Path in Binary Tree",
          url: "https://takeuforward.org/data-structure/maximum-sum-path-in-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Maximum Path Sum",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-maximum-path-sum/"),
          difficulty: "Hard",
          description: "Find the maximum path sum between any two nodes in a binary tree.",
        },
        {
          platform: "LeetCode",
          title: "Path Sum",
          url: cleanUrl("https://leetcode.com/problems/path-sum/"),
          difficulty: "Easy",
          description: "Check if a root-to-leaf path equals targetSum.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Maximum Path Sum between 2 Special Nodes",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/maximum-path-sum/1"),
          difficulty: "Hard",
          description: "Find the maximum path sum strictly between two leaf nodes.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a binary tree where nodes can contain **negative values**, find the maximum path sum between any two nodes (each node visited at most once).

### 💡 Key Takeaways
- **Extension of Tree Diameter:**
  - In Diameter, each edge added \`1\`. Here, each node contributes its integer \`val\`.
  - The maximum curved path turning at \`curr\` is: **\`curr->val + leftGain + rightGain\`**.
- **Crucial Negative-Pruning Rule (\`max(0, gain)\`):**
  - If a child subtree returns a negative sum (e.g., \`-10\`), including it will only hurt our total!
  - Always prune negative branch sums to \`0\`:
    **\`leftGain = max(0, findMaxPath(node->left))\`** and **\`rightGain = max(0, findMaxPath(node->right))\`**!
- **Returning to Parent:**
  - A path cannot branch in both directions when extending upward to a parent.
  - Return: **\`node->val + max(leftGain, rightGain)\`**.

### 💻 Maximum Path Sum Blueprint
\`\`\`cpp
int maxPathDown(TreeNode* node, int &maxi) {
    if (node == nullptr) return 0;

    // Prune negative sums to 0
    int left = max(0, maxPathDown(node->left, maxi));
    int right = max(0, maxPathDown(node->right, maxi));

    // Update global maximum path turning at this node
    maxi = max(maxi, node->val + left + right);

    // Return single best branch upward
    return node->val + max(left, right);
}

int maxPathSum(TreeNode* root) {
    int maxi = INT_MIN;
    maxPathDown(root, maxi);
    return maxi;
}
\`\`\``,
    },
    {
      order: 90,
      name: "Dual-Tree Simultaneous Traversal: Check if Two Binary Trees Are Identical",
      slug: "dsa-check-if-two-trees-are-identical",
      subtrack: "Module 16: Binary Trees: Structural Properties & Path Sums",
      description: "Check structural and value equality across two binary trees using synchronized dual-tree preorder traversal.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 90: Check if two trees are identical or not",
          url: cleanUrl("https://www.youtube.com/watch?v=BhuvF_-PWS0"),
          duration: "15m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check if two trees are identical",
          url: "https://takeuforward.org/data-structure/check-if-two-trees-are-identical-or-not/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Same Tree",
          url: cleanUrl("https://leetcode.com/problems/same-tree/"),
          difficulty: "Easy",
          description: "Verify structural and value identity across two binary trees.",
        },
        {
          platform: "LeetCode",
          title: "Symmetric Tree",
          url: cleanUrl("https://leetcode.com/problems/symmetric-tree/"),
          difficulty: "Easy",
          description: "Verify whether a tree is a mirror image of itself using dual simultaneous traversal.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Determine if Two Trees are Identical",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/determine-if-two-trees-are-identical/1"),
          difficulty: "Easy",
          description: "Check if two binary trees are identical in structure and data.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the roots of two binary trees \`p\` and \`q\`, check whether they are structurally identical and have the exact same node values.

### 💡 Key Takeaways
- **Simultaneous Preorder Traversal:**
  - Traverse both trees in parallel.
- **Base Conditions:**
  - If both \`p == nullptr && q == nullptr\`, return \`true\` (both reached empty leaves simultaneously).
  - If one is \`nullptr\` and the other is not (\`p == nullptr || q == nullptr\`), return \`false\` (structural mismatch).
- **Recursive Step:**
  - Return \`(p->val == q->val) && isSameTree(p->left, q->left) && isSameTree(p->right, q->right)\`.
- **Complexity:** \`O(min(N, M))\` Time and \`O(min(H1, H2))\` Space.

### 💻 Identical Trees Blueprint
\`\`\`cpp
bool isSameTree(TreeNode* p, TreeNode* q) {
    if (p == nullptr || q == nullptr) {
        return (p == q); // Returns true only if both are nullptr
    }
    return (p->val == q->val) &&
           isSameTree(p->left, q->left) &&
           isSameTree(p->right, q->right);
}
\`\`\``,
    },
  ];

  // 4. Upsert topics into database
  console.log("\n📦 Upserting 10 Batch 9 Topics into PostgreSQL...");
  const topicIdMap = new Map();

  for (const topic of batch9Topics) {
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

  // 5. Update track_topics: Link Batch 9 Topics to topic_order 81 through 90
  console.log("\n🔄 Linking Batch 9 topics to 'problem-solving-dsa-sql' (orders 81..90)...");

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

  // Link Batch 9 Topics (orders 81..90)
  for (const topicDef of batch9Topics) {
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

  console.log("\n🎉 DSA Batch 9 (Lectures 81–90) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch9()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch9;
