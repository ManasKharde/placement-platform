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

const seedDsaBatch12 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 12 (Lectures 111–120) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 12 Topics (Lectures 111–120)
  const batch12Topics = [
    // =========================================================================
    // SUBTRACK: Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations (Topics 111–120)
    // =========================================================================
    {
      order: 111,
      name: "BST Ordering Invariants: Introduction to Binary Search Trees",
      slug: "dsa-introduction-to-binary-search-tree",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Master binary search tree invariants where all left subtree keys are smaller and all right subtree keys are larger, yielding sorted in-order sequences.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 111: Introduction to Binary Search Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=p7-9UvDQZ3w"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Introduction to Binary Search Trees",
          url: "https://takeuforward.org/data-structure/introduction-to-binary-search-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Binary Search Trees",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/binary-search-trees/1"),
          difficulty: "Basic",
          description: "Verify whether a given array sequence forms a valid BST property.",
        },
        {
          platform: "LeetCode",
          title: "Range Sum of BST",
          url: cleanUrl("https://leetcode.com/problems/range-sum-of-bst/"),
          difficulty: "Easy",
          description: "Prune BST branches that fall outside of [low, high] to calculate sum efficiently.",
        },
        {
          platform: "LeetCode",
          title: "Increasing Order Search Tree",
          url: cleanUrl("https://leetcode.com/problems/increasing-order-search-tree/"),
          difficulty: "Easy",
          description: "Rearrange a BST in in-order into a right-leaning skewed tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A **Binary Search Tree (BST)** is a binary tree where every node satisfies a strict structural invariant:
- All keys in the **left subtree** are strictly less than the node's key: \`left->val < node->val\`.
- All keys in the **right subtree** are strictly greater than the node's key: \`right->val > node->val\`.
- Both the left and right subtrees must themselves be valid BSTs.

### 💡 Key Takeaways
- **Why BST Over General Binary Tree?**
  - In a standard binary tree, searching for a value requires checking every node in \`O(N)\` time.
  - In a balanced BST, every comparison eliminates an entire half of the remaining tree, cutting search time down to **\`O(log2 N)\`** (or \`O(H)\` where \`H\` is height).
- **The Inorder Traversal Property:**
  - An **Inorder Traversal (\`Left → Root → Right\`) of any valid BST always yields a strictly increasing sorted sequence**.
- **Duplicates in BSTs:**
  - Standard BSTs contain only unique keys.
  - If duplicates are required, they are handled by storing a \`frequency\` count inside the node, or consistently placing equal elements only on the left (\`<=\`) or right (\`>=\`).

### ⚠️ Common Mistakes to Avoid
- **Checking Only Immediate Children:** It is not enough for \`node->left < node\` and \`node->right > node\`. Every single descendant in the left subtree must be smaller than \`node\`!`,
    },
    {
      order: 112,
      name: "Branch Elimination Search: Search in a Binary Search Tree in O(H) Time",
      slug: "dsa-search-in-a-binary-search-tree",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Search for target keys in a BST in O(H) time and O(1) space by eliminating half the remaining tree at each comparison.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 112: Search in a Binary Search Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=KcNt6v_56cc"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Search in a Binary Search Tree",
          url: "https://takeuforward.org/data-structure/search-in-a-binary-search-tree-2/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Search in a Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/search-in-a-binary-search-tree/"),
          difficulty: "Easy",
          description: "Find the node in a BST whose value equals target and return the subtree rooted at that node.",
        },
        {
          platform: "LeetCode",
          title: "Closest Binary Search Tree Value",
          url: cleanUrl("https://leetcode.com/problems/closest-binary-search-tree-value/"),
          difficulty: "Easy",
          description: "Find the value in the BST that is closest to target using branch elimination.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Search a node in BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/search-a-node-in-bst/1"),
          difficulty: "Basic",
          description: "Search for a key in a binary search tree and return 1 if found.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a Binary Search Tree and a value \`val\`, locate the node with \`val\` and return its subtree pointer, or return \`nullptr\` if it does not exist.

### 💡 Key Takeaways
- **Branch Elimination Algorithm (\`O(H)\` Time, \`O(1)\` Space):**
  - Start at \`curr = root\`.
  - While \`curr != nullptr && curr->val != val\`:
    - If \`val < curr->val\`: The target can only exist in the left subtree—move \`curr = curr->left\`.
    - If \`val > curr->val\`: The target can only exist in the right subtree—move \`curr = curr->right\`.
  - If loop finishes and \`curr == nullptr\`, the value is not present in the tree.
- **Complexity:**
  - \`O(H)\` Time (where \`H\` is \`O(log2 N)\` for balanced trees, up to \`O(N)\` for skewed trees).
  - \`O(1)\` Space when implemented iteratively using a while loop.

### 💻 Search in BST Blueprint
\`\`\`cpp
TreeNode* searchBST(TreeNode* root, int val) {
    TreeNode* curr = root;
    while (curr != nullptr && curr->val != val) {
        if (val < curr->val) {
            curr = curr->left;
        } else {
            curr = curr->right;
        }
    }
    return curr;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using DFS to Scan Both Subtrees:** Do not search both \`curr->left\` and \`curr->right\`! Using the BST property means you explore strictly one branch at each step.`,
    },
    {
      order: 113,
      name: "Lower-Bound Invariant Search: Ceil in a Binary Search Tree",
      slug: "dsa-ceil-in-a-binary-search-tree",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Find the smallest node value greater than or equal to a given key in a BST in O(H) time and O(1) space.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 113: Ceil in a Binary Search Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=KSsk8AhdOZA"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Ceil in a Binary Search Tree",
          url: "https://takeuforward.org/data-structure/ceil-in-a-binary-search-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Ceil in BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/implementing-ceil-in-bst/1"),
          difficulty: "Medium",
          description: "Find the ceil of a given key X in a binary search tree.",
        },
        {
          platform: "LeetCode",
          title: "Closest Binary Search Tree Value",
          url: cleanUrl("https://leetcode.com/problems/closest-binary-search-tree-value/"),
          difficulty: "Easy",
          description: "Compare ceil and floor values to find the closest element to target.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Floor in BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/floor-in-bst/1"),
          difficulty: "Medium",
          description: "Contrast ceil branch decisions with floor branch decisions.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The **Ceil** of a key \`X\` in a BST is the **smallest node value strictly greater than or equal to \`X\`** (\`val >= X\`). If no such element exists, return \`-1\`.

### 💡 Key Takeaways
- **Branch Elimination Strategy:**
  - Maintain \`ceilVal = -1\`. Start at \`curr = root\`.
  - While \`curr != nullptr\`:
    1. If \`curr->val == key\`: Exact match found! Return \`curr->val\`.
    2. If \`curr->val > key\`: \`curr->val\` is a valid candidate for Ceil! Record \`ceilVal = curr->val\`, and move **left** (\`curr = curr->left\`) to search for an even smaller candidate that is still \`>= key\`.
    3. If \`curr->val < key\`: \`curr->val\` is too small to be a Ceil—move **right** (\`curr = curr->right\`) to find larger values.
- **Complexity:** \`O(H)\` Time and \`O(1)\` Space.

### 💻 Ceil in BST Blueprint
\`\`\`cpp
int findCeil(TreeNode* root, int key) {
    int ceilVal = -1;
    TreeNode* curr = root;

    while (curr != nullptr) {
        if (curr->val == key) {
            return curr->val;
        }
        if (curr->val > key) {
            ceilVal = curr->val; // Potential ceil candidate
            curr = curr->left;   // Search for smaller valid candidate
        } else {
            curr = curr->right;  // Key is larger; search right
        }
    }
    return ceilVal;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Moving Right When curr->val > key:** When \`curr->val > key\`, going right will only make the value larger! Move left to minimize the candidate.`,
    },
    {
      order: 114,
      name: "Upper-Bound Invariant Search: Floor in a Binary Search Tree",
      slug: "dsa-floor-in-a-binary-search-tree",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Find the largest node value less than or equal to a given key in a BST in O(H) time and O(1) space.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 114: Floor in a Binary Search Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=xm_W1ub-K-w"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Floor in a Binary Search Tree",
          url: "https://takeuforward.org/data-structure/floor-in-a-binary-search-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Floor in BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/floor-in-bst/1"),
          difficulty: "Medium",
          description: "Find the floor of a given key X in a binary search tree.",
        },
        {
          platform: "LeetCode",
          title: "Two Sum IV - Input is a BST",
          url: cleanUrl("https://leetcode.com/problems/two-sum-iv-input-is-a-bst/"),
          difficulty: "Easy",
          description: "Use BST properties to locate complementary values in O(H) time.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Predecessor and Successor",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/predecessor-and-successor/1"),
          difficulty: "Medium",
          description: "Find the in-order predecessor and successor of a given key in a BST.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
The **Floor** of a key \`X\` in a BST is the **largest node value strictly less than or equal to \`X\`** (\`val <= X\`). If no such element exists, return \`-1\`.

### 💡 Key Takeaways
- **Branch Elimination Strategy:**
  - Maintain \`floorVal = -1\`. Start at \`curr = root\`.
  - While \`curr != nullptr\`:
    1. If \`curr->val == key\`: Exact match found! Return \`curr->val\`.
    2. If \`curr->val < key\`: \`curr->val\` is a valid candidate for Floor! Record \`floorVal = curr->val\`, and move **right** (\`curr = curr->right\`) to search for an even larger candidate that is still \`<= key\`.
    3. If \`curr->val > key\`: \`curr->val\` is too large—move **left** (\`curr = curr->left\`) to find smaller values.
- **Complexity:** \`O(H)\` Time and \`O(1)\` Space.

### 💻 Floor in BST Blueprint
\`\`\`cpp
int floorInBST(TreeNode* root, int key) {
    int floorVal = -1;
    TreeNode* curr = root;

    while (curr != nullptr) {
        if (curr->val == key) {
            return curr->val;
        }
        if (curr->val < key) {
            floorVal = curr->val; // Potential floor candidate
            curr = curr->right;   // Search for larger candidate <= key
        } else {
            curr = curr->left;    // Key is smaller; search left
        }
    }
    return floorVal;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Overwriting Floor on Left Move:** Only update \`floorVal\` when \`curr->val < key\`. When moving left because \`curr->val > key\`, the current node is not a valid candidate.`,
    },
    {
      order: 115,
      name: "Leaf-Level Attachment: Insert a Given Node in a Binary Search Tree",
      slug: "dsa-insert-a-given-node-in-binary-search-tree",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Insert new keys into a BST cleanly at leaf level in O(H) time without restructuring existing subtrees.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 115: Insert a given Node in Binary Search Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=FiFiNvM29ps"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Insert a Node in Binary Search Tree",
          url: "https://takeuforward.org/data-structure/insert-a-given-node-in-binary-search-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Insert into a Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/insert-into-a-binary-search-tree/"),
          difficulty: "Medium",
          description: "Insert a value into a BST and return the root of the modified tree.",
        },
        {
          platform: "LeetCode",
          title: "Delete Node in a BST",
          url: cleanUrl("https://leetcode.com/problems/delete-node-in-a-bst/"),
          difficulty: "Medium",
          description: "Contrast leaf insertion with internal node deletion and subtree splicing.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Insert a node in a BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/insert-a-node-in-a-bst/1"),
          difficulty: "Easy",
          description: "Insert a unique key into a binary search tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a BST and a new integer value \`val\` not currently in the tree, insert \`val\` into the BST such that all BST properties remain valid.

### 💡 Key Takeaways
- **The Standard Leaf Insertion Strategy:**
  - You never need to reorganize the existing tree or split nodes! Every new key can always be attached cleanly as a new **leaf node**.
  - If \`root == nullptr\`, simply return \`new TreeNode(val)\`.
- **Iterative Search (\`O(H)\` Time, \`O(1)\` Space):**
  - Walk down the tree comparing \`val\` with \`curr->val\`:
    - If \`val > curr->val\`:
      - If \`curr->right != nullptr\`, move \`curr = curr->right\`.
      - Else, attach \`curr->right = new TreeNode(val)\` and \`break\`.
    - If \`val < curr->val\`:
      - If \`curr->left != nullptr\`, move \`curr = curr->left\`.
      - Else, attach \`curr->left = new TreeNode(val)\` and \`break\`.
  - Return the original \`root\`.

### 💻 Insert into BST Blueprint
\`\`\`cpp
TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (root == nullptr) return new TreeNode(val);
    TreeNode* curr = root;

    while (true) {
        if (val > curr->val) {
            if (curr->right != nullptr) {
                curr = curr->right;
            } else {
                curr->right = new TreeNode(val);
                break;
            }
        } else {
            if (curr->left != nullptr) {
                curr = curr->left;
            } else {
                curr->left = new TreeNode(val);
                break;
            }
        }
    }
    return root;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Empty Tree Edge Case:** Forgetting to handle \`if (root == nullptr) return new TreeNode(val);\` leads to dereferencing a null pointer.`,
    },
    {
      order: 116,
      name: "Subtree Re-Wiring & Predecessor Splicing: Delete a Node in a Binary Search Tree",
      slug: "dsa-delete-a-node-in-binary-search-tree",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Delete nodes from a BST across 0-child, 1-child, and 2-child cases in O(H) time using inorder predecessor splicing.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 116: Delete a Node in Binary Search Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=kouxiP_H5WE"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Delete a Node in Binary Search Tree",
          url: "https://takeuforward.org/data-structure/delete-a-node-in-binary-search-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Delete Node in a BST",
          url: cleanUrl("https://leetcode.com/problems/delete-node-in-a-bst/"),
          difficulty: "Medium",
          description: "Delete a node with a given key in a BST and restore valid BST properties.",
        },
        {
          platform: "LeetCode",
          title: "Trim a Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/trim-a-binary-search-tree/"),
          difficulty: "Medium",
          description: "Trim nodes whose values fall outside [low, high] by splicing child subtrees.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Delete a node from BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/delete-a-node-from-bst/1"),
          difficulty: "Medium",
          description: "Delete a specified key from a binary search tree.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a BST and a \`key\`, delete the node with \`key\` and return the new root while preserving all BST invariants.

### 💡 Key Takeaways
- **The 3 Deletion Cases for Target Node \`target\`:**
  1. **Leaf Node (0 children):** Simply remove the node and return \`nullptr\`.
  2. **1 Child:** Bypass the target by connecting target's parent directly to target's existing child (\`target->left\` or \`target->right\`).
  3. **2 Children (Splicing Subtrees):**
     - Keep \`target->left\` as the new replacement subtree root.
     - Where does \`target->right\` go?
     - Find the **inorder predecessor** (the rightmost node of \`target->left\`).
     - Attach \`target->right\` to the right of this predecessor (\`findLastRight(target->left)->right = target->right\`)!
- **Complexity:** \`O(H)\` Time and \`O(1)\` Space.

### 💻 Delete Node in BST Blueprint
\`\`\`cpp
TreeNode* findLastRight(TreeNode* root) {
    if (root->right == nullptr) return root;
    return findLastRight(root->right);
}

TreeNode* helper(TreeNode* root) {
    if (root->left == nullptr) return root->right;
    if (root->right == nullptr) return root->left;

    TreeNode* rightChild = root->right;
    TreeNode* lastRight = findLastRight(root->left);
    lastRight->right = rightChild; // Splice right subtree to predecessor
    return root->left;
}

TreeNode* deleteNode(TreeNode* root, int key) {
    if (root == nullptr) return nullptr;
    if (root->val == key) return helper(root);

    TreeNode* curr = root;
    while (curr != nullptr) {
        if (curr->val > key) {
            if (curr->left != nullptr && curr->left->val == key) {
                curr->left = helper(curr->left);
                break;
            } else {
                curr = curr->left;
            }
        } else {
            if (curr->right != nullptr && curr->right->val == key) {
                curr->right = helper(curr->right);
                break;
            } else {
                curr = curr->right;
            }
        }
    }
    return root;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Deleting the Root Node:** If \`root->val == key\`, handle it upfront via \`if (root->val == key) return helper(root);\`.`,
    },
    {
      order: 117,
      name: "In-Order Sorted Count Extraction: K-th Smallest and Largest Element in a BST",
      slug: "dsa-kth-smallest-and-largest-element-in-bst",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Extract the k-th smallest and largest values in a BST in O(min(K, N)) time using in-order and reverse in-order early-exit counters.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 117: Find K-th Smallest/Largest element in BST",
          url: cleanUrl("https://www.youtube.com/watch?v=9TJYWh0adfk"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Kth largest/smallest element in Binary Search Tree",
          url: "https://takeuforward.org/data-structure/kth-largest-smallest-element-in-binary-search-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Kth Smallest Element in a BST",
          url: cleanUrl("https://leetcode.com/problems/kth-smallest-element-in-a-bst/"),
          difficulty: "Medium",
          description: "Find the kth smallest value in a BST using in-order traversal.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Kth largest element in BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/kth-largest-element-in-bst/1"),
          difficulty: "Easy",
          description: "Find the kth largest element in a BST using reverse in-order (Right-Root-Left).",
        },
        {
          platform: "LeetCode",
          title: "Convert BST to Greater Tree",
          url: cleanUrl("https://leetcode.com/problems/convert-bst-to-greater-tree/"),
          difficulty: "Medium",
          description: "Use reverse in-order traversal to accumulate suffixes into nodes.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Find the **k-th smallest** (and **k-th largest**) element in a Binary Search Tree without copying all elements into an array.

### 💡 Key Takeaways
- **The Inorder Traversal Invariant:**
  - Standard Inorder (\`Left → Root → Right\`) visits elements in **strictly ascending order**.
  - The \`k\`-th node visited during Inorder is guaranteed to be the **k-th smallest element**!
- **Early-Exit Counter:**
  - Maintain \`cnt = 0\` and \`ans = -1\`.
  - Traverse left.
  - Increment \`cnt++\`. If \`cnt == k\`, record \`ans = node->val\` and return immediately.
  - Traverse right.
- **K-th Largest via Reverse Inorder (\`Right → Root → Left\`):**
  - Visiting \`Right → Root → Left\` traverses the BST in **descending order**.
  - The \`k\`-th node visited is the **k-th largest element**! (Alternatively, find the \`(N - k + 1)\`-th smallest element).
- **Complexity:** \`O(min(K, N))\` Time and \`O(H)\` Space (or \`O(1)\` space using Morris Inorder).

### 💻 K-th Smallest in BST Blueprint
\`\`\`cpp
void inorder(TreeNode* root, int &cnt, int k, int &ans) {
    if (root == nullptr || cnt >= k) return;

    inorder(root->left, cnt, k, ans);

    cnt++;
    if (cnt == k) {
        ans = root->val;
        return;
    }

    inorder(root->right, cnt, k, ans);
}

int kthSmallest(TreeNode* root, int k) {
    int cnt = 0, ans = -1;
    inorder(root, cnt, k, ans);
    return ans;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Passing cnt by Value:** Pass \`cnt\` by reference (\`int &cnt\`), otherwise recursive branches retain stale counts.`,
    },
    {
      order: 118,
      name: "Global Boundary Envelope Validation: Check if a Binary Tree Is a Valid BST",
      slug: "dsa-check-if-tree-is-valid-bst",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Validate if an arbitrary binary tree is a valid BST in O(N) time using open interval range propagation (minVal, maxVal).",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 118: Check if a tree is a BST or BT | Validate a BST",
          url: cleanUrl("https://www.youtube.com/watch?v=f-sj7I5oXEI"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check if a tree is a BST or BT",
          url: "https://takeuforward.org/data-structure/check-if-a-tree-is-a-bst-or-bt-validate-a-bst/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Validate Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/validate-binary-search-tree/"),
          difficulty: "Medium",
          description: "Determine if an arbitrary binary tree is a valid Binary Search Tree.",
        },
        {
          platform: "LeetCode",
          title: "Recover Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/recover-binary-search-tree/"),
          difficulty: "Medium",
          description: "Identify and swap two misplaced nodes in a BST using in-order order checks.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Check for BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/check-for-bst/1"),
          difficulty: "Easy",
          description: "Verify whether a binary tree is a valid BST.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given the root of a binary tree, determine whether it is a **valid Binary Search Tree (BST)**.

### 💡 Key Takeaways
- **Why Local Child Checks Fail:**
  - Checking only \`node->left->val < node->val && node->right->val > node->val\` is a common mistake!
  - A node deep in the right subtree could be smaller than the root ancestor (e.g., root is \`5\`, right child is \`6\`, and \`6\`'s left child is \`4\`). Locally \`4 < 6\`, but globally \`4 < 5\` violates the right-subtree rule!
- **The Valid Interval Envelope \`(minVal, maxVal)\`:**
  - Every node must lie strictly inside an open range: \`minVal < node->val < maxVal\`.
  - Root starts with \`(-infinity, +infinity)\`.
  - When moving **left**, update upper bound: \`(minVal, node->val)\`.
  - When moving **right**, update lower bound: \`(node->val, maxVal)\`.
  - If any node violates \`node->val <= minVal || node->val >= maxVal\`, the tree is invalid!
- **Complexity:** \`O(N)\` Time and \`O(H)\` Space.

### 💻 Validate BST Blueprint
\`\`\`cpp
bool isValid(TreeNode* root, long long minVal, long long maxVal) {
    if (root == nullptr) return true;

    if (root->val <= minVal || root->val >= maxVal) return false;

    return isValid(root->left, minVal, root->val) &&
           isValid(root->right, root->val, maxVal);
}

bool isValidBST(TreeNode* root) {
    return isValid(root, LLONG_MIN, LLONG_MAX);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using INT_MIN and INT_MAX:** If a tree contains a node with value \`INT_MIN\` or \`INT_MAX\`, \`root->val <= minVal\` will fail. Always use \`long long\` (\`LLONG_MIN\` and \`LLONG_MAX\`) for initial bounds!`,
    },
    {
      order: 119,
      name: "Branch Split Point: Lowest Common Ancestor (LCA) in a Binary Search Tree",
      slug: "dsa-lowest-common-ancestor-in-bst",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Find the lowest common ancestor of two nodes in a BST in O(H) time and O(1) space by tracking the branch split point.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 119: LCA in Binary Search Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=cX_kPV_foZc"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: LCA in Binary Search Tree",
          url: "https://takeuforward.org/data-structure/lca-in-binary-search-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Lowest Common Ancestor of a Binary Search Tree",
          url: cleanUrl("https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"),
          difficulty: "Medium",
          description: "Find the LCA of two nodes in a BST in O(H) time without searching both subtrees.",
        },
        {
          platform: "LeetCode",
          title: "Lowest Common Ancestor of a Binary Tree",
          url: cleanUrl("https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"),
          difficulty: "Medium",
          description: "Contrast BST branch splitting with general binary tree divergence checks.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Lowest Common Ancestor in a BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-bst/1"),
          difficulty: "Easy",
          description: "Find the lowest common ancestor node in a BST.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given a BST and two nodes \`p\` and \`q\`, find their **Lowest Common Ancestor (LCA)**.

### 💡 Key Takeaways
- **The Split Point Invariant:**
  - In a general binary tree, finding LCA requires searching both subtrees (\`O(N)\`).
  - In a BST, keys guide the search:
    1. If both \`p->val < curr->val\` and \`q->val < curr->val\`: Both targets lie in the left subtree—move \`curr = curr->left\`.
    2. If both \`p->val > curr->val\` and \`q->val > curr->val\`: Both targets lie in the right subtree—move \`curr = curr->right\`.
    3. **The Split Point:** If one target is on the left and the other is on the right, or if \`curr == p\` or \`curr == q\`, the paths to \`p\` and \`q\` diverge here! **\`curr\` is the LCA**!
- **Complexity:** \`O(H)\` Time and \`O(1)\` Space.

### 💻 LCA in BST Blueprint
\`\`\`cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* curr = root;
    while (curr != nullptr) {
        if (p->val < curr->val && q->val < curr->val) {
            curr = curr->left;
        } else if (p->val > curr->val && q->val > curr->val) {
            curr = curr->right;
        } else {
            return curr; // First point of divergence is the LCA!
        }
    }
    return nullptr;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using General Tree LCA (O(N)):** General tree LCA searches both left and right branches blindly. In a BST interview, you are expected to follow the split point in \`O(H)\` time and \`O(1)\` space.`,
    },
    {
      order: 120,
      name: "Upper-Bound Prefix Validation: Construct a BST from Preorder Traversal",
      slug: "dsa-construct-bst-from-preorder-traversal",
      subtrack: "Module 19: Binary Search Trees: Concepts, Validations & Structural Mutations",
      description: "Reconstruct the unique BST from its preorder sequence in O(N) time and O(H) space using single upper-bound propagation.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 120: Construct a BST from a preorder traversal",
          url: cleanUrl("https://www.youtube.com/watch?v=UmJT3j26t1I"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Construct a BST from a preorder traversal",
          url: "https://takeuforward.org/data-structure/construct-a-bst-from-a-preorder-traversal/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Construct Binary Search Tree from Preorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/"),
          difficulty: "Medium",
          description: "Construct and return the root of the BST matching the preorder sequence in O(N) time.",
        },
        {
          platform: "LeetCode",
          title: "Construct Binary Tree from Preorder and Inorder Traversal",
          url: cleanUrl("https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"),
          difficulty: "Medium",
          description: "Compare general tree inorder construction with BST upper-bound construction.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Preorder to BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/preorder-to-postorder4423/1"),
          difficulty: "Medium",
          description: "Build a BST from its preorder sequence and return the root.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of integers representing the **Preorder Traversal** of a BST, reconstruct and return the root of the unique BST in **\`O(N)\` time**.

### 💡 Key Takeaways (Brute → Better → Optimal)
- **1. Brute Force (\`O(N²)\` Time):** Insert elements one by one into an initially empty BST using standard BST insertion.
- **2. Better Approach via Sorting (\`O(N log N)\` Time):** Sort \`preorder\` to obtain the \`inorder\` traversal, then use the \`Preorder + Inorder\` tree reconstruction algorithm.
- **3. Optimal Upper-Bound Technique (\`O(N)\` Time, \`O(H)\` Space):**
  - Maintain a global index pointer \`i = 0\` into \`preorder\`.
  - Pass an \`upperBound\` into the recursive function (initially \`INT_MAX\`).
  - At each step:
    - If \`i == preorder.size()\` or \`preorder[i] > upperBound\`, return \`nullptr\`.
    - Allocate \`root = new TreeNode(preorder[i++])\`.
    - For \`root->left\`: upper bound becomes \`root->val\`.
    - For \`root->right\`: upper bound remains the parent's \`upperBound\`.
  - Notice you do **not** need a lower bound! Any element that fails the left upper bound is automatically redirected to the right child.

### 💻 Construct BST from Preorder Blueprint
\`\`\`cpp
TreeNode* build(vector<int> &A, int &i, int bound) {
    if (i == A.size() || A[i] > bound) return nullptr;

    TreeNode* root = new TreeNode(A[i++]);
    root->left = build(A, i, root->val); // Upper bound for left is root->val
    root->right = build(A, i, bound);    // Upper bound for right remains bound
    return root;
}

TreeNode* bstFromPreorder(vector<int> &preorder) {
    int i = 0;
    return build(preorder, i, INT_MAX);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Passing Index i by Value:** In \`build(A, int &i, int bound)\`, \`i\` must be passed by reference (\`int &i\`) so that index advances across all recursive calls!`,
    },
  ];

  // 4. Upsert topics into database
  console.log("\n📦 Upserting 10 Batch 12 Topics into PostgreSQL...");
  const topicIdMap = new Map();

  for (const topic of batch12Topics) {
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

  // 5. Update track_topics: Link Batch 12 Topics to topic_order 111 through 120
  console.log("\n🔄 Linking Batch 12 topics to 'problem-solving-dsa-sql' (orders 111..120)...");

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

  // Link Batch 12 Topics (orders 111..120)
  for (const topicDef of batch12Topics) {
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

  console.log("\n🎉 DSA Batch 12 (Lectures 111–120) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch12()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch12;
