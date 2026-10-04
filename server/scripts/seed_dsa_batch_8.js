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

const seedDsaBatch8 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 8 (Lectures 71–80) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 8 Topics (Lectures 71–80)
  const batch8Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 14: Multi-Array Partitioning & 2D Matrix Binary Search (Topics 71–72)
    // =========================================================================
    {
      order: 71,
      name: "Column-Guided 2D Binary Search: Find a Peak Element in a 2D Grid (Peak Element II)",
      slug: "dsa-find-peak-element-ii-2d-grid",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Locate a 2D peak cell strictly greater than all four neighbors in O(N log M) time using column-maximum binary search.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 71: Find Peak Element II (2D Matrix)",
          url: cleanUrl("https://www.youtube.com/watch?v=nGGp5XBzC4g"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find a Peak Element in 2D Matrix",
          url: "https://takeuforward.org/data-structure/find-peak-element-ii/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find a Peak Element II",
          url: cleanUrl("https://leetcode.com/problems/find-a-peak-element-ii/"),
          difficulty: "Medium",
          description: "Locate a 2D peak cell strictly greater than its top, bottom, left, and right neighbors in O(N log M) time.",
        },
        {
          platform: "LeetCode",
          title: "Find Peak Element",
          url: cleanUrl("https://leetcode.com/problems/find-peak-element/"),
          difficulty: "Medium",
          description: "Review 1D slope elimination to contrast with 2D column-maximum elimination.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Peak element",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/peak-element/1"),
          difficulty: "Basic",
          description: "Find the index of any peak element in an array.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
In a 2D grid where no two adjacent cells are equal and the outer perimeter is surrounded by \`-1\`, a **2D Peak Element** is a cell strictly greater than all four of its neighbors (top, bottom, left, and right).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force (\`O(N * M)\` Time):**
  - Scan the entire matrix to find the global maximum element (which is guaranteed to be larger than all neighbors).
- **2. Optimal Column Binary Search (\`O(N * log2 M)\` Time, \`O(1)\` Space):**
  - Perform binary search on the columns from \`low = 0\` to \`high = m - 1\`.
  - For the middle column \`mid\`, scan its \`N\` rows to find the row index \`maxRow\` holding the **maximum value in column \`mid\`**.
  - Because \`mat[maxRow][mid]\` is the largest value in its column, it is **already guaranteed to be greater than its top and bottom neighbors**!
  - Now only compare it against its \`left\` (\`mid - 1\`) and \`right\` (\`mid + 1\`) neighbors:
    - If \`mat[maxRow][mid] > left && mat[maxRow][mid] > right\`, return \`{maxRow, mid}\`.
    - If \`mat[maxRow][mid] < left\`, a higher slope lies to the left (\`high = mid - 1\`).
    - Otherwise, move right (\`low = mid + 1\`).

### 💻 2D Peak Element Blueprint
\`\`\`cpp
int findMaxRow(vector<vector<int>> &mat, int col) {
    int maxVal = -1, rowIdx = -1;
    for (int r = 0; r < mat.size(); r++) {
        if (mat[r][col] > maxVal) {
            maxVal = mat[r][col];
            rowIdx = r;
        }
    }
    return rowIdx;
}

vector<int> findPeakGrid(vector<vector<int>> &mat) {
    int n = mat.size(), m = mat[0].size();
    int low = 0, high = m - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int r = findMaxRow(mat, mid);
        int left = (mid - 1 >= 0) ? mat[r][mid - 1] : -1;
        int right = (mid + 1 < m) ? mat[r][mid + 1] : -1;

        if (mat[r][mid] > left && mat[r][mid] > right) return {r, mid};
        else if (mat[r][mid] < left) high = mid - 1;
        else low = mid + 1;
    }
    return {-1, -1};
}
\`\`\``,
    },
    {
      order: 72,
      name: "Value-Range Binary Search & Upper-Bound Counting: Median in a Row-Wise Sorted Matrix",
      slug: "dsa-median-in-row-wise-sorted-matrix",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Find the median of an N x M row-wise sorted matrix in O(log(max - min) * N * log M) time using upper-bound binary search on value range.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 72: Median in a Row-Wise Sorted Matrix",
          url: cleanUrl("https://www.youtube.com/watch?v=Q9wXgdxJq48"),
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Median of Row Wise Sorted Matrix",
          url: "https://takeuforward.org/data-structure/median-of-row-wise-sorted-matrix/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Median in a row-wise sorted Matrix",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1"),
          difficulty: "Hard",
          description: "Find the median of an N x M row-wise sorted matrix where N and M are odd.",
        },
        {
          platform: "LeetCode",
          title: "Kth Smallest Element in a Sorted Matrix",
          url: cleanUrl("https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/"),
          difficulty: "Medium",
          description: "Use value-range binary search to count elements <= mid across sorted rows.",
        },
        {
          platform: "LeetCode",
          title: "Kth Smallest Number in Multiplication Table",
          url: cleanUrl("https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/"),
          difficulty: "Hard",
          description: "Binary search on the value range while counting row elements <= mid.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an \`N x M\` matrix where \`N\` and \`M\` are both odd and every row is sorted individually, find the overall **median** in \`O(log2(max - min) * N * log2 M)\` time without flattening the matrix.

### 💡 Key Takeaways
- **The Median Property:**
  - Since \`N * M\` is odd, the median has \`req = (N * M) / 2\` elements on its left and \`req\` elements on its right.
  - The median is the **first number \`x\`** for which the total count of matrix elements \`<= x\` is **strictly greater than \`req\`** (\`countSmallEqual(x) > (N * M) / 2\`)!
- **Counting Elements \`<= mid\` Using Upper Bound (\`O(N * log2 M)\`):**
  - Because each row is sorted, the count of elements \`<= mid\` in row \`i\` is simply the **Upper Bound index of \`mid\`** in \`matrix[i]\`!
- **Binary Search on Value Space:**
  - Set \`low\` to the minimum element in column \`0\` and \`high\` to the maximum element in column \`M - 1\`.
  - If \`countSmallEqual(mat, mid) <= req\`, we need a larger value (\`low = mid + 1\`).
  - Otherwise, try a smaller value (\`high = mid - 1\`).
  - Return \`low\`.

### 💻 Matrix Median Blueprint
\`\`\`cpp
int countSmallEqual(vector<vector<int>> &mat, int x) {
    int cnt = 0;
    for (int i = 0; i < mat.size(); i++) {
        cnt += upper_bound(mat[i].begin(), mat[i].end(), x) - mat[i].begin();
    }
    return cnt;
}

int matrixMedian(vector<vector<int>> &mat) {
    int n = mat.size(), m = mat[0].size();
    int low = INT_MAX, high = INT_MIN;
    for (int i = 0; i < n; i++) {
        low = min(low, mat[i][0]);
        high = max(high, mat[i][m - 1]);
    }
    int req = (n * m) / 2;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (countSmallEqual(mat, mid) <= req) low = mid + 1;
        else high = mid - 1;
    }
    return low;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals (Topics 73–80)
    // =========================================================================
    {
      order: 73,
      name: "Binary Tree Architecture: Hierarchical Terminology & Structural Classifications",
      slug: "dsa-introduction-to-binary-trees-and-types",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Understand hierarchical tree anatomy, subtrees, ancestors, and the five fundamental structural types of binary trees.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 73: Introduction to Trees and Types of Trees",
          url: cleanUrl("https://www.youtube.com/watch?v=_ANrF3FJm7I"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Introduction to Trees",
          url: "https://takeuforward.org/data-structure/introduction-to-trees/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Introduction to Trees",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/introduction-to-trees/1"),
          difficulty: "Easy",
          description: "Compute the maximum number of nodes possible at level i of a binary tree.",
        },
        {
          platform: "LeetCode",
          title: "Count Complete Tree Nodes",
          url: cleanUrl("https://leetcode.com/problems/count-complete-tree-nodes/"),
          difficulty: "Easy",
          description: "Use complete and perfect binary tree properties to count nodes.",
        },
        {
          platform: "LeetCode",
          title: "Balanced Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/balanced-binary-tree/"),
          difficulty: "Easy",
          description: "Verify whether a binary tree satisfies the height-balanced invariant.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Unlike linear data structures (arrays, stacks, queues, linked lists), a **Tree** is a hierarchical data structure. A **Binary Tree** is a tree in which every node has **at most 2 children** (0, 1, or 2 children).

### 💡 Core Terminology
- **Root:** The topmost starting node of the tree.
- **Children & Parent:** Nodes directly connected beneath a node are its children; the node above is their parent.
- **Leaf Node:** A node at the bottom that has **0 children**.
- **Subtree:** Any node along with all of its descendants beneath it.
- **Ancestors:** A node's parent, grandparent, and all nodes along the path up to the root.

### 🌲 The 5 Structural Types of Binary Trees
1. **Full Binary Tree:** Every node has either **0 or 2 children** (never a single child).
2. **Complete Binary Tree:** All levels are completely filled except possibly the last level, and all nodes in the last level are placed **as far left as possible**.
3. **Perfect Binary Tree:** All internal nodes have 2 children and **all leaf nodes are at the exact same level**.
4. **Balanced Binary Tree:** The height of the tree is at most **\`O(log2 N)\`** for \`N\` nodes.
5. **Degenerate (Skewed) Tree:** Every internal node has only 1 child, reducing the tree to a straight line like a Linked List (\`O(N)\` height).

### ⚠️ Common Mistakes to Avoid
- **Confusing Complete vs. Full Trees:** A tree with a single left child on the last level is a *Complete* Binary Tree, but it is **not** a *Full* Binary Tree (since that parent has 1 child instead of 0 or 2).`,
    },
    {
      order: 74,
      name: "Pointer-Based Node Allocation: Binary Tree Representation in C++",
      slug: "dsa-binary-tree-representation-cpp",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Implement self-referential pointer node structs in C++ to dynamically allocate and link binary tree nodes in memory.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 74: Binary Tree Representation in C++",
          url: cleanUrl("https://www.youtube.com/watch?v=ctCpP0RFDFc"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Binary Tree Representation in C++",
          url: "https://takeuforward.org/data-structure/binary-tree-representation-in-c/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Binary Tree Representation",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/binary-tree-representation/1"),
          difficulty: "Easy",
          description: "Construct a binary tree using pointer nodes from a level-order array.",
        },
        {
          platform: "LeetCode",
          title: "Root Equals Sum of Children",
          url: cleanUrl("https://leetcode.com/problems/root-equals-sum-of-children/"),
          difficulty: "Easy",
          description: "Access root, root->left, and root->right pointers on a 3-node binary tree.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count Leaves in Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/count-leaves-in-binary-tree/1"),
          difficulty: "Basic",
          description: "Identify leaf nodes where both left and right pointers are NULL.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
In C++, a Binary Tree is represented in memory by defining a custom \`struct Node\` (or \`class Node\`) that stores an integer \`data\` value along with two self-referential pointers: \`left\` and \`right\`.

### 💡 Key Takeaways
- **Structure of a Tree Node:**
  - \`int data\`: Holds the node's value.
  - \`Node* left\`: Points to the left child node (or \`NULL\` / \`nullptr\` if none exists).
  - \`Node* right\`: Points to the right child node (or \`NULL\` / \`nullptr\` if none exists).
- **Constructor Initialization:**
  - When a new node is created (\`new Node(val)\`), its constructor sets \`data = val\` and initializes both \`left\` and \`right\` pointers to \`NULL\`.
- **Linking Nodes Together:**
  - After creating \`Node* root = new Node(1);\`, you attach children via \`root->left = new Node(2);\` and \`root->right = new Node(3);\`.

### 💻 C++ Binary Tree Node Blueprint
\`\`\`cpp
struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int val) {
        data = val;
        left = nullptr;
        right = nullptr;
    }
};

int main() {
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->right = new Node(5);
    return 0;
}
\`\`\``,
    },
    {
      order: 75,
      name: "Object-Reference Node Modeling: Binary Tree Representation in Java",
      slug: "dsa-binary-tree-representation-java",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Model binary tree nodes in Java using class references and instantiate heap-allocated tree structures.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 75: Binary Tree Representation in Java",
          url: cleanUrl("https://www.youtube.com/watch?v=hyLyW7rP24I"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Binary Tree Representation in Java",
          url: "https://takeuforward.org/data-structure/binary-tree-representation-in-java/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Same Tree",
          url: cleanUrl("https://leetcode.com/problems/same-tree/"),
          difficulty: "Easy",
          description: "Compare two binary tree node structures recursively for structural and value equality.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Size of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/size-of-binary-tree/1"),
          difficulty: "Basic",
          description: "Count the total number of nodes in a binary tree.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Sum of Binary Tree",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/sum-of-binary-tree/1"),
          difficulty: "Basic",
          description: "Compute the sum of all node data values across a binary tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
In Java, Binary Trees are built using object references instead of raw memory pointers. Each \`Node\` class instance contains a \`data\` field and two object references (\`Node left\` and \`Node right\`) that default to \`null\`.

### 💡 Key Takeaways
- **Java \`Node\` Class Design:**
  - \`int data\`: Stores the key/value of the node.
  - \`Node left, right\`: Reference variables pointing to the left and right child objects.
  - Constructor \`public Node(int key)\` assigns \`data = key\` (and \`left\` and \`right\` are \`null\` by default).
- **Building a Tree in Java:**
  - Instantiate the root with \`Node root = new Node(1);\` and link children via dot notation: \`root.left = new Node(2);\` and \`root.right = new Node(3);\`.

### 💻 Java Binary Tree Node Blueprint
\`\`\`java
class Node {
    int data;
    Node left;
    Node right;

    public Node(int key) {
        this.data = key;
        this.left = null;
        this.right = null;
    }
}

public class Main {
    public static void main(String[] args) {
        Node root = new Node(1);
        root.left = new Node(2);
        root.right = new Node(3);
        root.right.left = new Node(5);
    }
}
\`\`\``,
    },
    {
      order: 76,
      name: "Tree Traversal Paradigms: Depth-First Search (Inorder, Preorder, Postorder) vs. Breadth-First Search",
      slug: "dsa-binary-tree-traversals-dfs-vs-bfs",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Differentiate Depth-First Search (Preorder, Inorder, Postorder) from Breadth-First Search (Level-Order) on binary trees.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 76: Binary Tree Traversals in Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=jmy0LaGET1I"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Tree Traversals",
          url: "https://takeuforward.org/data-structure/tree-traversals/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Tree Traversal (All 3 DFS in One Pass)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/preorder-traversal/1"),
          difficulty: "Easy",
          description: "Practice tracing recursive tree traversal orders.",
        },
        {
          platform: "LeetCode",
          title: "N-ary Tree Preorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/n-ary-tree-preorder-traversal/"),
          difficulty: "Easy",
          description: "Generalize root-first depth-first traversal to N-ary trees.",
        },
        {
          platform: "LeetCode",
          title: "N-ary Tree Postorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/n-ary-tree-postorder-traversal/"),
          difficulty: "Easy",
          description: "Generalize children-before-root traversal to N-ary trees.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Because a binary tree is non-linear, there are two main ways to visit every node systematically: **Depth-First Search (DFS)** (diving deep down subtrees first) and **Breadth-First Search (BFS)** (visiting nodes level by level from top to bottom).

### 💡 Key Takeaways
- **1. Depth-First Search (DFS) — 3 Variants:**
  - Easy mnemonic: The name tells you **where the \`Root\` is placed** relative to \`Left\` and \`Right\`!
  - **Preorder (\`Root → Left → Right\`):** \`Pre\` means Root comes *first*, followed by the left subtree, then the right subtree.
  - **Inorder (\`Left → Root → Right\`):** \`In\` means Root sits *in between* the left subtree and the right subtree.
  - **Postorder (\`Left → Right → Root\`):** \`Post\` means Root comes *last*, after both left and right subtrees finish.
- **2. Breadth-First Search (BFS / Level-Order Traversal):**
  - Visits nodes **level by level** from top to bottom, and from left to right within each level.

### 💻 Quick Example Trace
For a simple tree where \`1\` has left child \`2\` (with children \`4, 5\`) and right child \`3\` (with children \`6, 7\`):
- **Inorder (\`Left → Root → Right\`):** \`4, 2, 5, 1, 6, 3, 7\`
- **Preorder (\`Root → Left → Right\`):** \`1, 2, 4, 5, 3, 6, 7\`
- **Postorder (\`Left → Right → Root\`):** \`4, 5, 2, 6, 7, 3, 1\`
- **Level-Order (BFS):** \`1, 2, 3, 4, 5, 6, 7\`

### ⚠️ Common Mistakes to Avoid
- **Applying Order Only at the Top Root:** Remember that the traversal rule (\`Left → Root → Right\`, etc.) must be applied **recursively to every single subtree**, not just the top root!`,
    },
    {
      order: 77,
      name: "Recursive Preorder Traversal: Root-Left-Right Call Stack Execution",
      slug: "dsa-preorder-traversal-binary-tree",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Execute recursive preorder traversal (Root -> Left -> Right) with O(N) time and call stack tracing.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 77: Preorder Traversal of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=RlUu72JrOCQ"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Preorder Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/preorder-traversal-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Preorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-preorder-traversal/"),
          difficulty: "Easy",
          description: "Return the preorder traversal of a binary tree's node values.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Depth of Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/maximum-depth-of-binary-tree/"),
          difficulty: "Easy",
          description: "Use recursive DFS traversal to compute the height of a binary tree.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Preorder Traversal",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/preorder-traversal/1"),
          difficulty: "Basic",
          description: "Implement recursive preorder traversal of a binary tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
**Preorder Traversal** visits nodes in the order **\`Root → Left → Right\`**. As soon as you arrive at a node, you process/print its value first, then recursively traverse its entire left subtree, and finally traverse its right subtree.

### 💡 Key Takeaways
- **Base Case:** If \`node == nullptr\`, return immediately.
- **Recursive Steps:**
  1. Process/record \`node->data\`.
  2. Call \`preorder(node->left)\`.
  3. Call \`preorder(node->right)\`.
- **Time & Space Complexity:**
  - **Time Complexity:** \`O(N)\` because every node is visited exactly once.
  - **Space Complexity:** \`O(H)\` auxiliary recursion stack space, where \`H\` is the height of the tree (up to \`O(N)\` worst case for a skewed tree).

### 💻 Recursive Preorder Blueprint
\`\`\`cpp
void dfsPreorder(TreeNode* node, vector<int> &ans) {
    if (node == nullptr) return;
    ans.push_back(node->val);       // 1. Root
    dfsPreorder(node->left, ans);   // 2. Left
    dfsPreorder(node->right, ans);  // 3. Right
}

vector<int> preorderTraversal(TreeNode* root) {
    vector<int> ans;
    dfsPreorder(root, ans);
    return ans;
}
\`\`\``,
    },
    {
      order: 78,
      name: "Recursive Inorder Traversal: Left-Root-Right Call Stack Unwinding",
      slug: "dsa-inorder-traversal-binary-tree",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Execute recursive inorder traversal (Left -> Root -> Right) and understand its relationship to sorted BST ordering.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 78: Inorder Traversal of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=Z_NEgBgbRVI"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Inorder Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/inorder-traversal-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Inorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-inorder-traversal/"),
          difficulty: "Easy",
          description: "Return the inorder traversal of a binary tree's node values.",
        },
        {
          platform: "LeetCode",
          title: "Sum of Left Leaves",
          url: cleanUrl("https://leetcode.com/problems/sum-of-left-leaves/"),
          difficulty: "Easy",
          description: "Traverse a binary tree recursively to accumulate values of all left leaf nodes.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Inorder Traversal",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/inorder-traversal/1"),
          difficulty: "Basic",
          description: "Return a list containing the inorder traversal of a given binary tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
**Inorder Traversal** visits nodes in the order **\`Left → Root → Right\`**. You recursively dive as far left as possible first, process the current node when returning from the left branch, and then explore the right branch.

### 💡 Key Takeaways
- **Base Case:** If \`node == nullptr\`, return immediately.
- **Recursive Steps:**
  1. Call \`inorder(node->left)\`.
  2. Process/record \`node->data\`.
  3. Call \`inorder(node->right)\`.
- **Why Inorder Matters:** In a Binary Search Tree (BST), an Inorder Traversal visits all elements in **sorted ascending order**!
- **Complexity:** \`O(N)\` Time and \`O(H)\` Auxiliary Call Stack Space (where \`H\` is tree height, \`O(N)\` worst case).

### 💻 Recursive Inorder Blueprint
\`\`\`cpp
void dfsInorder(TreeNode* node, vector<int> &ans) {
    if (node == nullptr) return;
    dfsInorder(node->left, ans);    // 1. Left
    ans.push_back(node->val);       // 2. Root
    dfsInorder(node->right, ans);   // 3. Right
}

vector<int> inorderTraversal(TreeNode* root) {
    vector<int> ans;
    dfsInorder(root, ans);
    return ans;
}
\`\`\``,
    },
    {
      order: 79,
      name: "Recursive Postorder Traversal: Left-Right-Root Bottom-Up Aggregation",
      slug: "dsa-postorder-traversal-binary-tree",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Execute recursive postorder traversal (Left -> Right -> Root) for bottom-up calculation and tree cleanup.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 79: Postorder Traversal of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=COQOU6klsBg"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Postorder Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/postorder-traversal-of-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Postorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-postorder-traversal/"),
          difficulty: "Easy",
          description: "Return the postorder traversal of a binary tree's node values.",
        },
        {
          platform: "LeetCode",
          title: "Invert Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/invert-binary-tree/"),
          difficulty: "Easy",
          description: "Recursively swap left and right subtrees across all nodes.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Postorder Traversal",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/postorder-traversal/1"),
          difficulty: "Basic",
          description: "Return a list containing the postorder traversal of a binary tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
**Postorder Traversal** visits nodes in the order **\`Left → Right → Root\`**. A node is only processed *after* both its left subtree and right subtree have completely finished executing.

### 💡 Key Takeaways
- **Base Case:** If \`node == nullptr\`, return immediately.
- **Recursive Steps:**
  1. Call \`postorder(node->left)\`.
  2. Call \`postorder(node->right)\`.
  3. Process/record \`node->data\`.
- **Why Postorder Matters:** Anytime a parent node's calculation depends on answers from both of its children (such as tree height, diameter, subtree sum, or deleting a tree), you are using Postorder logic!
- **Complexity:** \`O(N)\` Time and \`O(H)\` Auxiliary Call Stack Space.

### 💻 Recursive Postorder Blueprint
\`\`\`cpp
void dfsPostorder(TreeNode* node, vector<int> &ans) {
    if (node == nullptr) return;
    dfsPostorder(node->left, ans);   // 1. Left
    dfsPostorder(node->right, ans);  // 2. Right
    ans.push_back(node->val);        // 3. Root
}

vector<int> postorderTraversal(TreeNode* root) {
    vector<int> ans;
    dfsPostorder(root, ans);
    return ans;
}
\`\`\``,
    },
    {
      order: 80,
      name: "Breadth-First Queue Traversal: Level-Order Traversal of a Binary Tree",
      slug: "dsa-level-order-traversal-bfs-binary-tree",
      subtrack: "Module 15: Binary Trees: Hierarchical Representation & Fundamental Traversals",
      description: "Traverse a binary tree level by level using a FIFO queue and level-snapshot loop in O(N) time and space.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 80: Level Order Traversal of Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=EoAsWbO7sqg"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Level Order Traversal of Binary Tree",
          url: "https://takeuforward.org/data-structure/level-order-traversal-of-a-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Tree Level Order Traversal",
          url: cleanUrl("https://leetcode.com/problems/binary-tree-level-order-traversal/"),
          difficulty: "Medium",
          description: "Return the level-by-level node values of a binary tree from top to bottom.",
        },
        {
          platform: "LeetCode",
          title: "Average of Levels in Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/average-of-levels-in-binary-tree/"),
          difficulty: "Easy",
          description: "Use queue-based BFS level snapshots to compute the average value on each level.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Level order traversal",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/level-order-traversal/1"),
          difficulty: "Easy",
          description: "Traverse a binary tree level by level using a FIFO queue.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
**Level-Order Traversal (BFS)** visits a binary tree level by level from top to bottom, and from left to right within each level, using a **FIFO Queue (\`queue<TreeNode*>\`)**.

### 💡 Key Takeaways
- **Queue Snapshot Technique:**
  1. If \`root == nullptr\`, return an empty 2D vector \`{}\`.
  2. Push \`root\` into a \`queue<TreeNode*> q\`.
  3. While \`!q.empty()\`:
     - Capture the current level's node count: **\`int size = q.size();\`**.
     - Create a \`vector<int> level\` and loop \`size\` times:
       - Pop the front node from \`q\`.
       - If \`node->left != nullptr\`, push \`node->left\` into \`q\`.
       - If \`node->right != nullptr\`, push \`node->right\` into \`q\`.
       - Append \`node->val\` to \`level\`.
     - Push \`level\` into \`ans\`.
- **Complexity:** \`O(N)\` Time (each node is pushed and popped once) and \`O(N)\` Space (queue holds at most one level of nodes).

### 💻 Level-Order BFS Blueprint
\`\`\`cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> ans;
    if (root == nullptr) return ans;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int size = q.size(); // Snapshot of nodes in current level
        vector<int> level;
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front();
            q.pop();
            if (node->left != nullptr) q.push(node->left);
            if (node->right != nullptr) q.push(node->right);
            level.push_back(node->val);
        }
        ans.push_back(level);
    }
    return ans;
}
\`\`\``,
    },
  ];

  // 4. Upsert topics into database
  console.log("\n📦 Upserting 10 Batch 8 Topics into PostgreSQL...");
  const topicIdMap = new Map();

  for (const topic of batch8Topics) {
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

  // 5. Update track_topics: Link Batch 8 Topics to topic_order 71 through 80
  console.log("\n🔄 Linking Batch 8 topics to 'problem-solving-dsa-sql' (orders 71..80)...");

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

  // Link Batch 8 Topics (orders 71..80)
  for (const topicDef of batch8Topics) {
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

  console.log("\n🎉 DSA Batch 8 (Lectures 71–80) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch8()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch8;
