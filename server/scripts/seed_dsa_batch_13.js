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

const seedDsaBatch13 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 13 (Lectures 121–130) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 13 Topics (Lectures 121–130)
  const batch13Topics = [
    // =========================================================================
    // SUBTRACK: Module 20: Advanced Binary Search Tree Operations & Validation (Topics 121–125)
    // =========================================================================
    {
      order: 121,
      name: "Ordered Neighbor Search: Inorder Successor and Predecessor in a BST",
      slug: "dsa-inorder-successor-and-predecessor-in-bst",
      subtrack: "Module 20: Advanced Binary Search Tree Operations & Validation",
      description: "Find the inorder successor (smallest node strictly greater) and predecessor (largest node strictly smaller) in a BST in O(H) time without storing full traversals.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 121: Inorder Successor and Predecessor in BST",
          url: cleanUrl("https://www.youtube.com/watch?v=SXKAD2svfmI"),
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Inorder Successor and Predecessor in BST",
          url: "https://takeuforward.org/data-structure/inorder-successor-predecessor-in-bst/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Inorder Successor in BST (LC 285)",
          url: cleanUrl("https://leetcode.com/problems/inorder-successor-in-bst/"),
          difficulty: "Medium",
          description: "Find the in-order successor of a given node in a Binary Search Tree in O(H) time.",
        },
        {
          platform: "LeetCode",
          title: "Inorder Successor in BST II (LC 510)",
          url: cleanUrl("https://leetcode.com/problems/inorder-successor-in-bst-ii/"),
          difficulty: "Medium",
          description: "Find the in-order successor of a BST node when given parent pointers instead of the root.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Predecessor and Successor",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/predecessor-and-successor/1"),
          difficulty: "Medium",
          description: "Find both the inorder predecessor and successor of a given key in a BST.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a BST and a target node \`p\`, the **Inorder Successor** is the node with the smallest key **strictly greater than \`p->val\`**, and the **Inorder Predecessor** is the node with the largest key **strictly smaller than \`p->val\`**.

### 💡 Key Takeaways (Brute → Better → Optimal)
- **1. Brute Force (\`O(N)\` Time, \`O(N)\` Space):** Store the full inorder traversal in an array and binary search for the element right after \`p->val\`.
- **2. Better Approach (\`O(N)\` Time, \`O(1)\` Space):** Perform an inorder traversal (e.g., Morris traversal) and return the first node encountered with \`val > p->val\`.
- **3. Optimal BST Branch Elimination (\`O(H)\` Time, \`O(1)\` Space):**
  - **For Inorder Successor:**
    - Initialize \`successor = nullptr\` and start at \`curr = root\`.
    - If \`p->val >= curr->val\`: \`curr\` and its entire left subtree are \`<= p->val\`, so they cannot be the successor. Move right: \`curr = curr->right\`.
    - If \`p->val < curr->val\`: \`curr\` is strictly greater than \`p\`, so it is a potential successor! Record \`successor = curr\`, and move left (\`curr = curr->left\`) to look for an even smaller valid value.
  - **For Inorder Predecessor:**
    - Mirror the logic: when \`curr->val < p->val\`, record \`predecessor = curr\` and move right (\`curr = curr->right\`); otherwise move left (\`curr = curr->left\`).

### 💻 Inorder Successor & Predecessor Blueprint
\`\`\`cpp
TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {
    TreeNode* successor = nullptr;
    while (root != nullptr) {
        if (p->val >= root->val) {
            root = root->right;
        } else {
            successor = root;
            root = root->left;
        }
    }
    return successor;
}

TreeNode* inorderPredecessor(TreeNode* root, TreeNode* p) {
    TreeNode* predecessor = nullptr;
    while (root != nullptr) {
        if (p->val <= root->val) {
            root = root->left;
        } else {
            predecessor = root;
            root = root->right;
        }
    }
    return predecessor;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting Equality in \`p->val >= root->val\`:** When \`root->val == p->val\`, the node itself cannot be its own successor—you must move right (\`root = root->right\`) to find a strictly larger value!`),
      theorySummary: cleanText(`Find Inorder Successor and Predecessor in BST:
1. Successor: When p->val >= root->val, go right. When p->val < root->val, save successor = root and go left.
2. Predecessor: When p->val <= root->val, go left. When p->val > root->val, save predecessor = root and go right.
Time Complexity: O(H), Space Complexity: O(1).`),
    },

    {
      order: 122,
      name: "Controlled Call-Stack Streaming: Binary Search Tree Iterator in O(H) Space",
      slug: "dsa-binary-search-tree-iterator",
      subtrack: "Module 20: Advanced Binary Search Tree Operations & Validation",
      description: "Implement a memory-efficient BST iterator streaming elements in ascending order with amortized O(1) next() and strictly O(H) auxiliary space.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 122: BST Iterator",
          url: cleanUrl("https://www.youtube.com/watch?v=D2jMcmxU4bs"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: BST Iterator",
          url: "https://takeuforward.org/data-structure/bst-iterator/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Binary Search Tree Iterator (LC 173)",
          url: cleanUrl("https://leetcode.com/problems/binary-search-tree-iterator/"),
          difficulty: "Medium",
          description: "Implement an iterator over a binary search tree with amortized O(1) next() and O(H) memory.",
        },
        {
          platform: "LeetCode",
          title: "Binary Search Tree Iterator II (LC 1586)",
          url: cleanUrl("https://leetcode.com/problems/binary-search-tree-iterator-ii/"),
          difficulty: "Medium",
          description: "Extend the BST iterator to support both next() and prev() bidirectional operations.",
        },
        {
          platform: "LeetCode",
          title: "Peeking Iterator (LC 284)",
          url: cleanUrl("https://leetcode.com/problems/peeking-iterator/"),
          difficulty: "Medium",
          description: "Design an iterator that supports peeking at the next element without advancing.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Design a \`BSTIterator\` class that iterates over the **Inorder Traversal** of a BST:
- \`next()\` returns the next smallest number in the BST.
- \`hasNext()\` returns \`true\` if there is a next number in the traversal.
- Both operations must run in **average \`O(1)\` time** and use strictly **\`O(H)\` memory** (where \`H\` is tree height), forbidding \`O(N)\` array pre-storage.

### 💡 Key Takeaways
- **Lazy Left-Chain Stack Pushing (\`pushAll\`):**
  - Instead of storing the whole inorder sequence in \`O(N)\` space, maintain a \`stack<TreeNode*> myStack\` that stores only the left spine of the current subtree (\`O(H)\` nodes).
  - **Constructor:** Call \`pushAll(root)\`, which pushes \`root\` and all of its left descendants (\`node = node->left\`) onto the stack.
  - **\`hasNext()\`:** Returns \`!myStack.empty()\`.
  - **\`next()\`:**
    1. Pop the top node \`tmpNode = myStack.top()\`.
    2. Before returning \`tmpNode->val\`, call \`pushAll(tmpNode->right)\` to load the leftmost chain of its right subtree!
- **Why Average Time Complexity is \`O(1)\`:**
  - Across \`N\` calls to \`next()\`, every node in the tree is pushed and popped **exactly once**. Total work for \`N\` calls is \`O(N)\`, so the amortized cost per \`next()\` call is \`O(N) / N = O(1)\`!

### 💻 BST Iterator Blueprint
\`\`\`cpp
class BSTIterator {
private:
    stack<TreeNode*> myStack;

    void pushAll(TreeNode* node) {
        while (node != nullptr) {
            myStack.push(node);
            node = node->left;
        }
    }

public:
    BSTIterator(TreeNode* root) {
        pushAll(root);
    }

    bool hasNext() {
        return !myStack.empty();
    }

    int next() {
        TreeNode* tmpNode = myStack.top();
        myStack.pop();
        pushAll(tmpNode->right); // Load left chain of right child
        return tmpNode->val;
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Precomputing the Full Inorder Vector:** Storing all N elements in a vector inside the constructor violates the O(H) memory constraint required by interviewers.`),
      theorySummary: cleanText(`BST Iterator:
1. Maintain a stack of nodes representing the leftmost path.
2. next() pops the stack top, pushes all left children of top->right, and returns top->val.
3. hasNext() checks if the stack is non-empty.
Complexity: Amortized O(1) time per next(), strictly O(H) space.`),
    },

    {
      order: 123,
      name: "Bidirectional BST Iterators: Two Sum in a BST in O(H) Space",
      slug: "dsa-two-sum-in-bst-bidirectional-iterator",
      subtrack: "Module 20: Advanced Binary Search Tree Operations & Validation",
      description: "Solve Two Sum in a Binary Search Tree in O(N) time and O(H) space using concurrent forward and backward BST iterators.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 123: Two Sum in BST",
          url: cleanUrl("https://www.youtube.com/watch?v=ssL3sHwPeb4"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Two Sum IV - Input is a BST",
          url: "https://takeuforward.org/data-structure/two-sum-in-a-bst/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Two Sum IV - Input is a BST (LC 653)",
          url: cleanUrl("https://leetcode.com/problems/two-sum-iv-input-is-a-bst/"),
          difficulty: "Easy",
          description: "Return true if there exist two elements in the BST such that their sum equals k.",
        },
        {
          platform: "LeetCode",
          title: "Two Sum BSTs (LC 1214)",
          url: cleanUrl("https://leetcode.com/problems/two-sum-bsts/"),
          difficulty: "Medium",
          description: "Find if there is a node in the first BST and a node in the second BST that sum to target.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Find a pair with given target in BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/find-a-pair-with-given-target-in-bst/1"),
          difficulty: "Medium",
          description: "Check if a pair of nodes summing to target exists in a BST using O(H) auxiliary space.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the root of a Binary Search Tree and a target integer \`k\`, determine whether there exist two distinct nodes in the BST whose values add up to \`k\`.

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force (\`O(N)\` Time, \`O(N)\` Space):**
  - Store the full inorder traversal in a sorted vector and run the standard two-pointer \`left\` and \`right\` convergence.
- **2. Optimal Bidirectional \`BSTIterator\` (\`O(N)\` Time, \`O(2H)\` Space):**
  - Parameterize our \`BSTIterator\` class with a boolean \`reverse\`:
    - \`reverse == false\` (\`next\`): Normal ascending iterator (\`Left → Root → Right\`), starting at the smallest element.
    - \`reverse == true\` (\`before\`): Descending iterator (\`Right → Root → Left\`), starting at the largest element.
  - Instantiate two iterators on the same tree: \`BSTIterator l(root, false)\` and \`BSTIterator r(root, true)\`.
  - Fetch \`i = l.next()\` (smallest) and \`j = r.next()\` (largest).
  - While \`i < j\`:
    - If \`i + j == k\`, return \`true\`.
    - If \`i + j < k\`, advance \`i = l.next()\`.
    - Else, advance \`j = r.next()\`.

### 💻 Bidirectional BST Iterator Two Sum Blueprint
\`\`\`cpp
class BSTIterator {
    stack<TreeNode*> myStack;
    bool reverse; // false = ascending (next), true = descending (before)

    void pushAll(TreeNode* node) {
        while (node != nullptr) {
            myStack.push(node);
            node = reverse ? node->right : node->left;
        }
    }
public:
    BSTIterator(TreeNode* root, bool isReverse) : reverse(isReverse) {
        pushAll(root);
    }

    int next() {
        TreeNode* tmp = myStack.top();
        myStack.pop();
        if (!reverse) pushAll(tmp->right);
        else pushAll(tmp->left);
        return tmp->val;
    }
};

bool findTarget(TreeNode* root, int k) {
    if (!root) return false;
    BSTIterator l(root, false); // Ascending from smallest
    BSTIterator r(root, true);  // Descending from largest

    int i = l.next();
    int j = r.next();
    while (i < j) {
        if (i + j == k) return true;
        else if (i + j < k) i = l.next();
        else j = r.next();
    }
    return false;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Writing \`i <= j\` Instead of \`i < j\`:** You must pick two distinct nodes. Because all values in a standard BST are unique, stopping as soon as \`i >= j\` prevents pairing a node with itself!`),
      theorySummary: cleanText(`Two Sum in BST with O(H) Space:
1. Build bidirectional iterators (one ascending Left-Root-Right, one descending Right-Root-Left).
2. Use standard two-pointer convergence: if i + j == k return true; if i + j < k advance left; else advance right.
Complexity: O(N) time, O(H) space.`),
    },

    {
      order: 124,
      name: "Inorder Inversion Detection: Recover a BST With Two Swapped Nodes",
      slug: "dsa-recover-bst-two-nodes-swapped",
      subtrack: "Module 20: Advanced Binary Search Tree Operations & Validation",
      description: "Detect and correct two swapped nodes in a Binary Search Tree by tracking adjacent and non-adjacent inorder traversal inversions.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 124: Recover BST | Correct BST with two nodes swapped",
          url: cleanUrl("https://www.youtube.com/watch?v=ZWGW7FminDM"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Recover BST | Correct BST with Two Nodes Swapped",
          url: "https://takeuforward.org/data-structure/recover-bst-correct-bst-with-two-nodes-swapped/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Recover Binary Search Tree (LC 99)",
          url: cleanUrl("https://leetcode.com/problems/recover-binary-search-tree/"),
          difficulty: "Medium",
          description: "Recover a BST where the values of exactly two nodes were swapped by mistake.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Fixing Two nodes of a BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/fixed-two-nodes-of-a-bst/1"),
          difficulty: "Hard",
          description: "Correct a BST in-place without changing its structure.",
        },
        {
          platform: "LeetCode",
          title: "Validate Binary Search Tree (LC 98)",
          url: cleanUrl("https://leetcode.com/problems/validate-binary-search-tree/"),
          difficulty: "Medium",
          description: "Detect ordering violations during tree traversal.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given the root of a Binary Search Tree in which the values of **exactly two nodes were swapped by mistake**. Recover the tree by swapping their values back without changing its structure.

### 💡 Key Takeaways
- **The Sorted Array Inversion Analogy:**
  - Since the Inorder Traversal of a valid BST is strictly increasing, swapping two nodes creates inversions where **\`root->val < prev->val\`**.
  - There are **2 possible cases** when two elements are swapped in a sorted sequence:
    1. **Swapped Nodes Are Non-Adjacent** (e.g., \`[3, 25, 7, 8, 10, 15, 20, 5]\` where \`25\` and \`5\` are swapped):
       - Produces **2 violations**: First at \`(25, 7)\` (\`first = 25\`, \`middle = 7\`), and second at \`(20, 5)\` (\`last = 5\`).
       - Fix: **\`swap(first->val, last->val)\`**.
    2. **Swapped Nodes Are Adjacent** (e.g., \`[3, 5, 8, 7, 10, 15, 20, 25]\` where \`8\` and \`7\` are swapped):
       - Produces **only 1 violation**: At \`(8, 7)\` (\`first = 8\`, \`middle = 7\`), and \`last\` remains \`nullptr\`.
       - Fix: **\`swap(first->val, middle->val)\`**.
- **Complexity:** \`O(N)\` Time and \`O(H)\` Recursion Space (or \`O(1)\` Space using Morris Inorder Traversal).

### 💻 Recover BST Blueprint
\`\`\`cpp
class Solution {
    TreeNode *first, *prev, *middle, *last;

    void inorder(TreeNode* root) {
        if (root == nullptr) return;
        inorder(root->left);

        if (prev != nullptr && (root->val < prev->val)) {
            // First violation: record both prev (first) and root (middle)
            if (first == nullptr) {
                first = prev;
                middle = root;
            }
            // Second violation: record root (last)
            else {
                last = root;
            }
        }
        prev = root;
        inorder(root->right);
    }

public:
    void recoverTree(TreeNode* root) {
        first = middle = last = nullptr;
        prev = new TreeNode(INT_MIN);
        inorder(root);
        if (first && last) swap(first->val, last->val);
        else if (first && middle) swap(first->val, middle->val);
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting the \`middle\` Pointer:** If you only track \`first\` and \`last\`, your code will fail whenever the two swapped nodes happen to be adjacent in the inorder sequence (because a second violation never occurs).`),
      theorySummary: cleanText(`Recover BST with Two Swapped Nodes:
1. Inorder traversal of BST must be sorted. Swapping two nodes produces either 1 inversion (adjacent) or 2 inversions (non-adjacent).
2. On first inversion: first = prev, middle = root. On second inversion: last = root.
3. If last exists, swap(first->val, last->val); else swap(first->val, middle->val).
Complexity: O(N) time, O(H) space.`),
    },

    {
      order: 125,
      name: "Postorder Subtree Envelope Aggregation: Largest BST in a Binary Tree",
      slug: "dsa-largest-bst-in-binary-tree",
      subtrack: "Module 20: Advanced Binary Search Tree Operations & Validation",
      description: "Find the size of the largest subtree that is a valid BST in an arbitrary binary tree using bottom-up postorder property aggregation in O(N) time.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 125: Largest BST in Binary Tree",
          url: cleanUrl("https://www.youtube.com/watch?v=X0oXMdtUDwo"),
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Maximum Sum BST / Largest BST in Binary Tree",
          url: "https://takeuforward.org/data-structure/maximum-sum-bst-in-binary-tree/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Largest BST",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/largest-bst/1"),
          difficulty: "Medium",
          description: "Find the size (number of nodes) of the largest subtree that is a valid BST.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Sum BST in Binary Tree (LC 1373)",
          url: cleanUrl("https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/"),
          difficulty: "Hard",
          description: "Apply the exact postorder {minNode, maxNode, maxSum} tuple technique to find the maximum sum BST.",
        },
        {
          platform: "LeetCode",
          title: "Largest BST Subtree (LC 333)",
          url: cleanUrl("https://leetcode.com/problems/largest-bst-subtree/"),
          difficulty: "Medium",
          description: "Return the number of nodes in the largest subtree that is a Binary Search Tree.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an arbitrary Binary Tree, find the **size (number of nodes) of the largest subtree that is also a valid Binary Search Tree (BST)**.

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force (\`O(N²)\` Time):** At every node, call \`isValidBST(node)\` (\`O(N)\`) and if valid, count its nodes.
- **2. Optimal Postorder Bottom-Up Aggregation (\`O(N)\` Time, \`O(H)\` Space):**
  - For a subtree rooted at \`root\` to be a valid BST, we need info from both its \`left\` and \`right\` subtrees *first*—so we use **Postorder Traversal (\`Left → Right → Root\`)**!
  - Every recursive call returns a \`NodeValue(minNode, maxNode, maxSize)\` object:
    - **Base Case (\`root == nullptr\`):** Return \`NodeValue(INT_MAX, INT_MIN, 0)\` so an empty child always satisfies \`left.maxNode < root->val < right.minNode\`.
    - **Valid BST Condition:** If **\`left.maxNode < root->val && root->val < right.minNode\`**, then \`root\` forms a valid BST! Return:
      - \`minNode = min(root->val, left.minNode)\`
      - \`maxNode = max(root->val, right.maxNode)\`
      - \`maxSize = left.maxSize + right.maxSize + 1\`
    - **Invalid BST Condition:** Otherwise, \`root\` is NOT a BST. Poison the bounds by returning \`NodeValue(INT_MIN, INT_MAX, max(left.maxSize, right.maxSize))\` so no ancestor can ever include \`root\` in a valid BST, while preserving the largest BST size found so far!

### 💻 Largest BST Subtree Blueprint
\`\`\`cpp
class NodeValue {
public:
    int minNode, maxNode, maxSize;
    NodeValue(int minNode, int maxNode, int maxSize)
        : minNode(minNode), maxNode(maxNode), maxSize(maxSize) {}
};

class Solution {
    NodeValue helper(TreeNode* root) {
        if (!root) return NodeValue(INT_MAX, INT_MIN, 0);

        auto left = helper(root->left);
        auto right = helper(root->right);

        // Current subtree is a valid BST
        if (left.maxNode < root->val && root->val < right.minNode) {
            return NodeValue(
                min(root->val, left.minNode),
                max(root->val, right.maxNode),
                left.maxSize + right.maxSize + 1
            );
        }
        // Not a BST: poison bounds [INT_MIN, INT_MAX] so ancestors fail check
        return NodeValue(INT_MIN, INT_MAX, max(left.maxSize, right.maxSize));
    }

public:
    int largestBst(TreeNode* root) {
        return helper(root).maxSize;
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Swapping Base Case Bounds (\`INT_MAX\` vs. \`INT_MIN\`):** For a \`nullptr\` node, \`minNode\` must be \`INT_MAX\` and \`maxNode\` must be \`INT_MIN\` so that leaf checks (\`INT_MIN < leaf->val < INT_MAX\`) succeed. Conversely, when poisoning an invalid subtree, return \`minNode = INT_MIN\` and \`maxNode = INT_MAX\` so parent checks always fail!`),
      theorySummary: cleanText(`Largest BST in Binary Tree:
1. Use postorder traversal returning {minVal, maxVal, maxSize}.
2. Subtree is BST if left.maxVal < root->val < right.minVal.
3. If valid, size is left.maxSize + right.maxSize + 1. If invalid, return bounds {INT_MIN, INT_MAX, max(left.maxSize, right.maxSize)}.
Complexity: O(N) time, O(H) space.`),
    },

    // =========================================================================
    // SUBTRACK: Module 21: Graph Theory Foundations, Representations & Traversals (Topics 126–130)
    // =========================================================================
    {
      order: 126,
      name: "Graph Theory Foundations: Directed vs. Undirected Graphs, Cycles, Degrees & Edge Weights",
      slug: "dsa-introduction-to-graphs-types-and-conventions",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Learn graph terminology including vertices, edges, directed vs undirected graphs, cycles, DAGs, vertex degrees, and edge weights.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 126: Introduction to Graphs | Types, Definitions and Properties",
          url: cleanUrl("https://www.youtube.com/watch?v=M3_pLsDdeuU"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Introduction to Graphs",
          url: "https://takeuforward.org/graph/introduction-to-graph/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Graph and Vertices",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/graph-and-vertices/1"),
          difficulty: "Easy",
          description: "Calculate the total number of undirected graphs that can be constructed from N vertices.",
        },
        {
          platform: "LeetCode",
          title: "Find Center of Star Graph (LC 1791)",
          url: cleanUrl("https://leetcode.com/problems/find-center-of-star-graph/"),
          difficulty: "Easy",
          description: "Identify the center node of an undirected star graph using vertex degrees.",
        },
        {
          platform: "LeetCode",
          title: "Find the Town Judge (LC 997)",
          url: cleanUrl("https://leetcode.com/problems/find-the-town-judge/"),
          difficulty: "Easy",
          description: "Use directed graph Indegree and Outdegree properties to find the town judge.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A **Graph** is a non-linear data structure consisting of **Nodes (Vertices \`V\`)** connected by **Edges (\`E\`)**. Every tree is actually a restricted graph (an undirected connected acyclic graph), whereas general graphs can have cycles, directed edges, and multiple disconnected pieces.

### 💡 Core Graph Terminology & Rules
- **1. Undirected vs. Directed Graphs:**
  - **Undirected Graph:** Edges are bidirectional (\`u — v\` means you can travel \`u → v\` and \`v → u\`).
  - **Directed Graph (Digraph):** Edges have arrows (\`u → v\` means you can only travel from \`u\` to \`v\`).
- **2. Cycles & DAGs:**
  - **Cycle:** A path that starts at a node and returns to that exact same node.
  - **DAG (Directed Acyclic Graph):** A directed graph containing **zero cycles**.
- **3. Path:** A sequence of reachable vertices connected by edges where **no node is visited more than once**.
- **4. Degree of a Vertex:**
  - **Undirected Graph:** \`Degree(u)\` = number of edges attached to \`u\`.
  - **Handshaking Lemma:** **\`Total Degree of an Undirected Graph = 2 * E\`** (since every edge connects 2 endpoints).
  - **Directed Graph:**
    - \`Indegree(u)\` = number of incoming edges (\`→ u\`).
    - \`Outdegree(u)\` = number of outgoing edges (\`u →\`).
- **5. Edge Weights:**
  - Edges may carry costs/distances (\`weighted graph\`). If no weights are given, assume **unit weight (\`1\`)** on every edge.

### ⚠️ Common Mistakes to Avoid
- **Repeating Nodes in a Path:** By definition, a simple path cannot visit the same vertex twice.
- **Confusing Degrees in Directed vs Undirected Graphs:** In undirected graphs, each edge contributes 2 to the total degree sum. In directed graphs, sum of indegrees equals sum of outdegrees equals E.`),
      theorySummary: cleanText(`Graph Theory Foundations:
1. Graph G = (V, E) where V are vertices and E are edges.
2. Undirected: edges are two-way, total degree = 2 * E. Directed: edges have direction, indegree and outdegree.
3. Path: Sequence of vertices where no vertex is repeated. Cycle: Path that starts and ends at same vertex.`),
    },

    {
      order: 127,
      name: "Memory-Efficient Graph Modeling in C++: Adjacency Matrix vs. Adjacency List",
      slug: "dsa-graph-representation-in-cpp",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Compare Adjacency Matrix (O(N^2) space) with Adjacency List (O(2E) space) in C++ for unweighted and weighted undirected/directed graphs.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 127: Graph Representation in C++",
          url: cleanUrl("https://www.youtube.com/watch?v=3oI-34aPMWM"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Graph Representation in C++",
          url: "https://takeuforward.org/graph/graph-representation-in-c/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Print adjacency list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/print-adjacency-list-1587115620/1"),
          difficulty: "Easy",
          description: "Construct and return the adjacency list representation of an undirected graph.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Number of Vertices to Reach All Nodes (LC 1557)",
          url: cleanUrl("https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/"),
          difficulty: "Medium",
          description: "Process a directed edge list to find all vertices with zero incoming edges.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Total Importance of Roads (LC 2285)",
          url: cleanUrl("https://leetcode.com/problems/maximum-total-importance-of-roads/"),
          difficulty: "Medium",
          description: "Count vertex degrees from an edge list to maximize road importance.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Graph problems typically provide \`N\` (nodes) and \`M\` (edges), followed by \`M\` pairs \`(u, v)\`. To run graph algorithms, we must store these edges in either an **Adjacency Matrix** or an **Adjacency List**.

### 💡 Key Takeaways
- **1. Adjacency Matrix (\`int adj[N + 1][N + 1]\`):**
  - Mark \`adj[u][v] = 1\` and \`adj[v][u] = 1\` (for weighted graphs, store \`adj[u][v] = wt\`).
  - **Space Complexity:** **\`O(N²)\`** — wastes massive memory when \`N = 10^5\`! Only use for small, dense graphs (\`N <= 1000\`).
- **2. Adjacency List (\`vector<int> adj[N + 1]\`):**
  - An array of vectors where \`adj[u]\` stores all direct neighbors of node \`u\`.
  - **Undirected Graph:** Push both ways (\`adj[u].push_back(v)\` and \`adj[v].push_back(u)\`) → **\`O(2E)\` Space**.
  - **Directed Graph (\`u → v\`):** Push only one way (\`adj[u].push_back(v)\`) → **\`O(E)\` Space**.
  - **Weighted Graph:** Store pairs of \`{neighbor, weight}\` using **\`vector<pair<int, int>> adj[N + 1]\`**.

### 💻 C++ Adjacency List Blueprint (Unweighted & Weighted)
\`\`\`cpp
// 1. Unweighted Undirected Graph: O(2E) Space
void buildUnweightedGraph(int n, int m, vector<pair<int, int>> &edges) {
    vector<int> adj[n + 1];
    for (auto &edge : edges) {
        int u = edge.first, v = edge.second;
        adj[u].push_back(v);
        adj[v].push_back(u); // Omit this line if Directed Graph (u -> v)
    }
}

// 2. Weighted Undirected Graph: Stores {neighbor, edgeWeight}
void buildWeightedGraph(int n, vector<tuple<int, int, int>> &edges) {
    vector<pair<int, int>> adj[n + 1];
    for (auto &[u, v, wt] : edges) {
        adj[u].push_back({v, wt});
        adj[v].push_back({u, wt});
    }
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **0-Based vs. 1-Based Indexing:** If node labels run from \`1\` to \`N\`, always allocate size \`N + 1\` (\`vector<int> adj[n + 1]\`) so accessing index \`n\` does not go out of bounds!`),
      theorySummary: cleanText(`Graph Representation in C++:
1. Adjacency Matrix: 2D array matrix[N][N], O(N^2) space, optimal only for dense graphs.
2. Adjacency List: vector<int> adj[N+1], O(2E) space for undirected, O(E) for directed.
3. For weighted graphs, use vector<pair<int, int>> adj[N+1].`),
    },

    {
      order: 128,
      name: "Nested Collection Graph Modeling in Java: ArrayList of ArrayLists",
      slug: "dsa-graph-representation-in-java",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Model undirected and directed graphs in Java using nested collection structures ArrayList<ArrayList<Integer>> with proper 1-based indexing initialization.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 128: Graph Representation in Java",
          url: cleanUrl("https://www.youtube.com/watch?v=OsNklbh9gYI"),
          duration: "18m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Graph Representation in Java",
          url: "https://takeuforward.org/graph/graph-representation-in-java/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Print adjacency list (Java)",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/print-adjacency-list-1587115620/1"),
          difficulty: "Easy",
          description: "Build an ArrayList<ArrayList<Integer>> adjacency list for an undirected graph.",
        },
        {
          platform: "LeetCode",
          title: "All Paths From Source to Target (LC 797)",
          url: cleanUrl("https://leetcode.com/problems/all-paths-from-source-to-target/"),
          difficulty: "Medium",
          description: "Traverse a pre-built 2D adjacency list of a DAG from node 0 to n - 1.",
        },
        {
          platform: "LeetCode",
          title: "Keys and Rooms (LC 841)",
          url: cleanUrl("https://leetcode.com/problems/keys-and-rooms/"),
          difficulty: "Medium",
          description: "Traverse a List<List<Integer>> graph representation to check room reachability.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In Java, an **Adjacency List** is represented using a nested \`ArrayList<ArrayList<Integer>> adj\`. Before adding edges, you must initialize \`N + 1\` empty inner \`ArrayList\` objects inside the outer list.

### 💡 Key Takeaways
- **Two-Step Initialization in Java:**
  1. Instantiate the outer list: \`ArrayList<ArrayList<Integer>> adj = new ArrayList<>();\`
  2. Run a loop \`i\` from \`0\` to \`n\` and add \`new ArrayList<>()\` at every index!
- **Adding Edges:**
  - For an undirected edge \`(u, v)\`:
    - \`adj.get(u).add(v);\`
    - \`adj.get(v).add(u);\` (omit for directed graphs).
  - **Space Complexity:** \`O(2E)\` for undirected graphs, \`O(E)\` for directed graphs.

### 💻 Java Adjacency List Blueprint
\`\`\`java
import java.util.*;

public class GraphRepresentation {
    public static ArrayList<ArrayList<Integer>> buildGraph(int n, int[][] edges) {
        ArrayList<ArrayList<Integer>> adj = new ArrayList<>();

        // 1. Initialize N + 1 empty inner lists (supports 1-based indexing)
        for (int i = 0; i <= n; i++) {
            adj.add(new ArrayList<>());
        }

        // 2. Populate undirected edges
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            adj.get(u).add(v);
            adj.get(v).add(u); // Remove this line for a Directed Graph
        }
        return adj;
    }
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Calling \`adj.get(u).add(v)\` Before Initializing Inner Lists:** If you forget the \`for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());\` loop, \`adj.get(u)\` will throw an \`IndexOutOfBoundsException\`!`),
      theorySummary: cleanText(`Graph Representation in Java:
1. Use ArrayList<ArrayList<Integer>> adj = new ArrayList<>().
2. Initialize inner lists with a loop from 0 to N before adding edges.
3. For edge (u, v), adj.get(u).add(v) and adj.get(v).add(u).
Complexity: O(2E) space for undirected graphs.`),
    },

    {
      order: 129,
      name: "Multi-Component Graph Architecture: Visited Array Invariant & Connected Components",
      slug: "dsa-connected-components-in-graphs",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Master the connected components loop pattern with a visited array to guarantee complete traversal across disconnected graph components.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 129: Connected Components in Graph",
          url: cleanUrl("https://www.youtube.com/watch?v=lea-Wl_uWXY"),
          duration: "16m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Connected Components in Graph",
          url: "https://takeuforward.org/graph/connected-components-in-graph/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Number of Provinces (LC 547)",
          url: cleanUrl("https://leetcode.com/problems/number-of-provinces/"),
          difficulty: "Medium",
          description: "Count the total number of connected components in an undirected graph.",
        },
        {
          platform: "LeetCode",
          title: "Number of Connected Components in an Undirected Graph (LC 323)",
          url: cleanUrl("https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/"),
          difficulty: "Medium",
          description: "Use a visited array loop over all vertices to count disconnected graph components.",
        },
        {
          platform: "LeetCode",
          title: "Count the Number of Complete Components (LC 2685)",
          url: cleanUrl("https://leetcode.com/problems/count-the-number-of-complete-components/"),
          difficulty: "Medium",
          description: "Traverse each connected component and verify if every pair of nodes in it has an edge.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A single graph does not have to be one connected piece—it can consist of **multiple disconnected islands (Connected Components)**. If you only start a graph traversal from node \`1\`, you will completely miss all other disconnected components!

### 💡 Key Takeaways
- **Why Starting Only at Node \`1\` Fails:**
  - A traversal (BFS or DFS) starting at node \`1\` can only visit nodes reachable from \`1\` (Component 1).
- **The Universal Connected-Components Loop Pattern:**
  - Always maintain a \`vis[N + 1] = {0}\` array.
  - Loop \`i\` from \`1\` to \`N\` across every vertex in the graph:
    - If \`!vis[i]\`, then vertex \`i\` belongs to a **brand-new unvisited component**!
    - Increment \`componentCount++\` and launch \`traverse(i, adj, vis)\`, which will visit and mark every node inside that component.

### 💻 Universal Connected Components Blueprint
\`\`\`cpp
void traverseComponent(int startNode, vector<int> adj[], vector<int> &vis) {
    // Standard BFS or DFS marks all reachable nodes in this component as vis = 1
    queue<int> q;
    q.push(startNode);
    vis[startNode] = 1;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        for (int neighbor : adj[node]) {
            if (!vis[neighbor]) {
                vis[neighbor] = 1;
                q.push(neighbor);
            }
        }
    }
}

int countComponents(int n, vector<int> adj[]) {
    vector<int> vis(n + 1, 0);
    int components = 0;

    for (int i = 1; i <= n; i++) {
        if (!vis[i]) {
            components++; // Found a new disconnected component!
            traverseComponent(i, adj, vis);
        }
    }
    return components;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting the Outer 1..N Loop in Graph Problems:** In interviews, unless the problem explicitly guarantees the graph is fully connected, always wrap your BFS/DFS inside a \`for (int i = 1; i <= n; i++) if (!vis[i])\` loop!`),
      theorySummary: cleanText(`Connected Components in Graphs:
1. Graphs can have multiple disconnected pieces.
2. Maintain a visited array vis[N+1] initialized to 0.
3. Iterate i from 1 to N: if !vis[i], increment component count and trigger BFS/DFS traversal.
Complexity: O(V + 2E) total time, O(V) space.`),
    },

    {
      order: 130,
      name: "Level-Wave Graph Exploration: Breadth-First Search (BFS) in O(V + 2E) Time",
      slug: "dsa-breadth-first-search-bfs-in-graphs",
      subtrack: "Module 21: Graph Theory Foundations, Representations & Traversals",
      description: "Implement radial level-order graph traversal using a FIFO queue and visited array with rigorous O(V + 2E) time complexity analysis.",
      estimatedMinutes: 30,
      videoLinks: [
        {
          title: "Lecture 130: Breadth-First Search (BFS) in Graph",
          url: cleanUrl("https://www.youtube.com/watch?v=-tgVpUgsQ5k"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Breadth First Search (BFS) Level Order Traversal",
          url: "https://takeuforward.org/graph/breadth-first-search-bfs-level-order-traversal/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "BFS of graph",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1"),
          difficulty: "Easy",
          description: "Perform Breadth-First Search traversal starting from vertex 0 on a given adjacency list.",
        },
        {
          platform: "LeetCode",
          title: "Find if Path Exists in Graph (LC 1971)",
          url: cleanUrl("https://leetcode.com/problems/find-if-path-exists-in-graph/"),
          difficulty: "Easy",
          description: "Use BFS with a queue and visited array to check if destination is reachable from source.",
        },
        {
          platform: "LeetCode",
          title: "Keys and Rooms (LC 841)",
          url: cleanUrl("https://leetcode.com/problems/keys-and-rooms/"),
          difficulty: "Medium",
          description: "Explore rooms level by level using BFS to determine if all rooms can be unlocked.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
**Breadth-First Search (BFS)** explores a graph radially outward **level by level** (distance \`0\`, then distance \`1\`, then distance \`2\`, etc.) from a starting node using a **FIFO Queue (\`queue<int>\`)** and a **Visited Array (\`vis[]\`)**.

### 💡 Key Takeaways
- **Initial Configuration:**
  1. Create \`vis[V] = {0}\` and mark the starting node \`vis[0] = 1\`.
  2. Push the starting node \`0\` into \`queue<int> q\`.
- **The BFS Wave Loop:**
  - While \`!q.empty()\`:
    1. Pop \`node = q.front()\` and append \`node\` to \`bfs\` result.
    2. Iterate through every neighbor \`it\` in \`adj[node]\`:
       - If \`!vis[it]\`, immediately mark **\`vis[it] = 1\`** and push \`it\` into \`q\`.
- **Exact Time & Space Complexity Derivation:**
  - **Time Complexity: \`O(V + 2E)\`** (for undirected graphs; \`O(V + E)\` for directed).
    - Why? Every vertex enters the queue once (\`O(V)\`), and for each vertex, the inner \`for\` loop runs over all its neighbors—summing to the **Total Degree of the Graph (\`2E\`)**!
  - **Space Complexity: \`O(3V) → O(V)\`** (for \`queue\`, \`vis\` array, and \`bfs\` output list).

### 💻 Graph BFS Blueprint
\`\`\`cpp
vector<int> bfsOfGraph(int V, vector<int> adj[]) {
    vector<int> vis(V, 0);
    vis[0] = 1;
    queue<int> q;
    q.push(0);

    vector<int> bfs;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        bfs.push_back(node);

        for (int neighbor : adj[node]) {
            if (!vis[neighbor]) {
                vis[neighbor] = 1; // Mark visited BEFORE pushing to queue!
                q.push(neighbor);
            }
        }
    }
    return bfs;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Marking \`vis[node] = 1\` When Popping Instead of When Pushing:** If you wait until a node is popped to mark it visited, multiple neighbors at the same level will push duplicate copies of that node into the queue! Always mark \`vis[neighbor] = 1\` at the exact moment you push it into the queue.`),
      theorySummary: cleanText(`Breadth-First Search (BFS):
1. Explore graph level-by-level using a FIFO queue and visited array.
2. Mark visited immediately when pushing to queue to avoid duplicate insertions.
3. Time Complexity: O(V + 2E) for undirected graphs, O(V + E) for directed.
4. Space Complexity: O(V) for queue, visited array, and traversal output.`),
    },
  ];

  // 4. Upsert topics and nested resources
  console.log("\n📦 Upserting 10 Batch 13 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch13Topics) {
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

  // 5. Update track_topics: Link Batch 13 Topics to topic_order 121 through 130
  console.log("\n🔄 Linking Batch 13 topics to 'problem-solving-dsa-sql' (orders 121..130)...");

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

  // Link Batch 13 Topics (orders 121..130)
  for (const topicDef of batch13Topics) {
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

  console.log("\n🎉 DSA Batch 13 (Lectures 121–130) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch13()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch13;
