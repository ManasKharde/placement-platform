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

const seedDsaBatch26 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 26 (Lectures 251–260) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 26 Topics (Lectures 251–260)
  const batch26Topics = [
    // =========================================================================
    // SUBTRACK: Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers (Topics 251–253)
    // =========================================================================
    {
      order: 251,
      name: "Collision-Point Loop Traversal: Find the Length of a Loop in a Linked List",
      slug: "dsa-find-length-of-loop-in-linked-list",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Detect cycle collision using Tortoise and Hare, then hold slow stationary and advance fast by 1 step to count the loop length in O(N) time and O(1) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 251: Find Length of Loop in Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=I4g1qbkTPus"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find Length of Loop in Linked List",
          url: "https://takeuforward.org/data-structure/find-length-of-loop-in-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Find length of Loop",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/find-length-of-loop/1"),
          difficulty: "Easy",
          description: "Given the head of a linked list, determine whether a loop exists and return the number of nodes in the loop (or 0 if no loop exists).",
        },
        {
          platform: "LeetCode",
          title: "Linked List Cycle (LC 141)",
          url: cleanUrl("https://leetcode.com/problems/linked-list-cycle/"),
          difficulty: "Easy",
          description: "Use Floyd's Tortoise and Hare pointers to locate the collision point inside a linked list cycle.",
        },
        {
          platform: "LeetCode",
          title: "Longest Cycle in a Graph (LC 2360)",
          url: cleanUrl("https://leetcode.com/problems/longest-cycle-in-a-graph/"),
          difficulty: "Hard",
          description: "Extend timestamp-difference cycle length measurement from linked lists to directed graphs.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list, determine if the list contains a loop, and if so, return the **exact number of nodes in the loop** (or \`0\` if there is no loop).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Using a Hash Map With a Step Timer (\`O(N)\` Time, \`O(N)\` Space):**
  - Maintain \`unordered_map<Node*, int> visited\` and an integer \`timer = 1\`.
  - As you traverse \`temp\` from \`head\`, if \`temp\` is already in \`visited\`, the loop length is simply **\`timer - visited[temp]\`**!
- **2. Optimal Tortoise & Hare Collision Walk (\`O(N)\` Time, \`O(1)\` Space):**
  - **Step 1 (Detect Collision):** Move \`slow\` by \`1\` step and \`fast\` by \`2\` steps. If \`fast == nullptr || fast->next == nullptr\`, return \`0\` (no loop).
  - **Step 2 (Count Loop Length from Collision Node):**
    - Once \`slow == fast\`, both pointers are standing on the **exact same node inside the loop**!
    - Keep \`slow\` stationary as an anchor, initialize \`cnt = 1\`, and advance \`fast = fast->next\` (by \`1\` step at a time!).
    - Loop **\`while (slow != fast)\`**: increment \`cnt++\` and move \`fast = fast->next;\`.
    - The moment \`fast\` laps the cycle and reaches \`slow\` again, return \`cnt\`!

### 💻 Find Length of Loop in Linked List Blueprint
~~~cpp
int findLoopLength(Node* slow, Node* fast) {
    int cnt = 1;
    fast = fast->next;
    while (slow != fast) {
        cnt++;
        fast = fast->next;
    }
    return cnt;
}

int countNodesinLoop(Node* head) {
    Node* slow = head;
    Node* fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;

        if (slow == fast) {
            return findLoopLength(slow, fast);
        }
    }
    return 0; // Linear list with no loop
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Advance \`fast = fast->next\` Before \`while (slow != fast)\`:** At the moment of collision, \`slow == fast\` is already true! You must step \`fast = fast->next\` with \`cnt = 1\` **before** entering \`while (slow != fast)\` so the loop actually executes!`),
      theorySummary: cleanText(`After detecting collision via Tortoise-Hare, freeze slow as an anchor and step fast one node at a time around the cycle until fast meets slow again, counting total cycle nodes in O(N) time and O(1) space.`),
    },

    {
      order: 252,
      name: "One-Step-Delayed Tortoise & Hare: Delete the Middle Node of a Linked List",
      slug: "dsa-delete-middle-node-of-linked-list",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Delete the middle node in a single pass by starting fast at head->next->next, stopping slow exactly one node before the middle in O(1) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 252: Delete Middle Node of Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=ePpV-_pfOeI"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Delete Middle Node of Linked List",
          url: "https://takeuforward.org/data-structure/delete-the-middle-node-of-the-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Delete the Middle Node of a Linked List (LC 2095)",
          url: cleanUrl("https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/"),
          difficulty: "Medium",
          description: "Given the head of a linked list, delete the middle node (floor(n / 2)-th 0-indexed node) and return the head of the modified linked list.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Delete Middle of Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/delete-middle-of-linked-list/1"),
          difficulty: "Easy",
          description: "Delete the middle node of a singly linked list (or the second middle node if length is even).",
        },
        {
          platform: "LeetCode",
          title: "Middle of the Linked List (LC 876)",
          url: cleanUrl("https://leetcode.com/problems/middle-of-the-linked-list/"),
          difficulty: "Easy",
          description: "Compare landing on the middle node vs. landing one node before the middle node.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list, delete its **middle node** (for an even-length list with two middles \`m1\` and \`m2\`, delete the **second middle \`m2\`**) and return the updated head. If the list has only \`1\` node, return \`nullptr\`.

### 💡 Key Takeaways (Brute → Optimal)
- **Why Landing ON the Middle Node Is Not Enough:**
  - To delete the middle node in a singly linked list, we must re-wire the \`next\` pointer of the node **immediately BEFORE the middle node**!
- **1. Brute Force Two-Pass (\`O(N + N/2)\` Time, \`O(1)\` Space):**
  - Count total nodes \`N\`, then walk \`res = N / 2\` steps from \`head\` to stop right before the middle node.
- **2. Optimal 1-Step-Skip Tortoise & Hare (\`O(N / 2)\` Single Pass, \`O(1)\` Space — No Extra \`prev\` Pointer Needed!):**
  - In standard Tortoise & Hare, both \`slow\` and \`fast\` start at \`head\` and move together, causing \`slow\` to land **on** the middle node.
  - How do we make \`slow\` stop **1 node before** the middle node? Simply **skip \`slow\`'s very first move**!
  - Start \`slow = head\` and \`fast = head->next->next;\` (giving \`fast\` a 2-step head start while \`slow\` stays at \`head\`).
  - Then run the standard loop \`while (fast != nullptr && fast->next != nullptr)\` moving \`slow\` by \`1\` and \`fast\` by \`2\`.
  - When the loop finishes, \`slow\` is guaranteed to sit **1 node before the middle node**! Simply re-link \`slow->next = slow->next->next\` and \`delete middle\`.

### 💻 Delete the Middle Node (One-Step-Skip Tortoise & Hare) Blueprint
~~~cpp
Node* deleteMiddle(Node* head) {
    // Edge case: 0 or 1 node -> deleting middle leaves an empty list
    if (head == nullptr || head->next == nullptr) {
        return nullptr;
    }

    Node* slow = head;
    // Skip slow's first step by giving fast a 2-step head start!
    Node* fast = head->next->next;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }

    // 'slow' now sits immediately before the middle node
    Node* middle = slow->next;
    slow->next = slow->next->next;
    delete middle;

    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting the Single-Node Edge Case (\`head->next == nullptr\`):** If the list has only \`1\` node, \`head->next\` is \`nullptr\`, so \`head->next->next\` will cause an immediate null-pointer crash! Always check \`if (head == nullptr || head->next == nullptr) return nullptr;\` first.`),
      theorySummary: cleanText(`Giving fast a 2-step head start (fast = head->next->next) causes slow to stop exactly one node prior to the middle node, enabling single-pass deletion via slow->next = slow->next->next in O(N/2) time and O(1) space.`),
    },

    {
      order: 253,
      name: "L1-Distance Mathematical Proof: Find the Starting Point of a Loop/Cycle in a Linked List",
      slug: "dsa-find-starting-point-of-loop-in-linked-list",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Locate the exact loop entrance node by resetting slow to head after collision and stepping slow and fast in lockstep, supported by mathematical proof.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 253: Find Starting Point of Loop in Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=2Kd0KKmmHFc"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find Starting Point of Loop in Linked List",
          url: "https://takeuforward.org/data-structure/starting-point-of-loop-in-a-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Linked List Cycle II (LC 142)",
          url: cleanUrl("https://leetcode.com/problems/linked-list-cycle-ii/"),
          difficulty: "Medium",
          description: "Given the head of a linked list, return the node where the cycle begins (or nullptr if there is no cycle) in O(1) memory.",
        },
        {
          platform: "LeetCode",
          title: "Find the Duplicate Number (LC 287)",
          url: cleanUrl("https://leetcode.com/problems/find-the-duplicate-number/"),
          difficulty: "Medium",
          description: "Model an array of [1..n] integers as a linked list with a cycle and find the cycle entry point using Floyd's algorithm.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Find the first node of loop in linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/find-the-first-node-of-loop-in-linked-list--170645/1"),
          difficulty: "Easy",
          description: "Return the first node of the loop in a linked list, or -1 if no loop exists.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a linked list, return the **exact starting \`Node*\` where the cycle begins** (or \`nullptr\` if there is no cycle) in **\`O(N)\` time and \`O(1)\` extra space**.

### 💡 The 2-Phase Tortoise & Hare Algorithm + Mathematical Proof (\`L1 == Remaining Loop Distance\`)
- **Algorithm:**
  1. **Phase 1 (Find Collision Point):** Move \`slow\` by \`1\` step and \`fast\` by \`2\` steps from \`head\` until **\`slow == fast\`** (if \`fast\` hits \`nullptr\`, return \`nullptr\`).
  2. **Phase 2 (Reset \`slow\` to \`head\` and Walk Both by 1 Step):**
     - Place \`slow = head;\` while leaving \`fast\` at the collision point.
     - Move **both \`slow\` and \`fast\` by \`1\` step at a time** (\`while (slow != fast)\`).
     - The node where they collide again is the **starting point of the loop**!
- **Mathematical Proof — Why Does Distance \`head → start\` Equal \`collision → start\`?**
  - Let **\`L1\`** be the distance from \`head\` to the loop's starting node.
  - Let **\`d\`** be the forward distance along the loop from the starting node to the collision point.
  - When \`slow\` first enters the loop at the starting node (after \`L1\` steps), \`fast\` has already taken \`2 * L1\` steps (\`L1\` steps into the loop).
  - If the total loop circumference is \`C\`, the remaining distance from \`fast\` behind \`slow\` is **\`d = C - L1\`**.
  - Because \`fast\` closes the gap by \`1\` unit per step, they collide after \`slow\` walks **\`d\`** more steps!
  - Since total loop length is \`C = L1 + d\`, and the collision point is at distance \`d\` from the start of the loop, the **remaining forward distance from the collision point back to the start of the loop is \`C - d = (L1 + d) - d = L1\`**!
  - Because both distances equal **\`L1\`**, walking \`slow\` from \`head\` (\`L1\` steps) and \`fast\` from the collision point (\`L1\` steps) at \`1\` step each guarantees they meet at the **exact loop entrance**!

### 💻 Find Starting Point of Loop in Linked List Blueprint
~~~cpp
Node* detectCycleStart(Node* head) {
    Node* slow = head;
    Node* fast = head;

    // Phase 1: Detect cycle collision point
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;

        if (slow == fast) {
            // Phase 2: Reset slow to head and advance both by 1 step!
            slow = head;
            while (slow != fast) {
                slow = slow->next;
                fast = fast->next;
            }
            return slow; // Starting node of the cycle!
        }
    }
    return nullptr; // No cycle
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Storing \`node->data\` Instead of \`Node*\` in Brute Force Hashing:** Two distinct nodes can have the same integer value \`15\`—always hash the **pointer address \`Node*\`**, never \`node->data\`!`),
      theorySummary: cleanText(`Mathematical proof shows L1 (distance from head to cycle entrance) equals the remaining cycle distance from collision point to entrance (C - d). Resetting slow to head and stepping both by 1 reveals the cycle entrance in O(N).`),
    },

    // =========================================================================
    // SUBTRACK: Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening) (Topics 254–260)
    // =========================================================================
    {
      order: 254,
      name: "Bidirectional Target Deletion: Delete All Occurrences of a Key in a Doubly Linked List",
      slug: "dsa-delete-all-occurrences-of-key-in-doubly-linked-list",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      description: "Delete all occurrences of a target key in a doubly linked list in a single pass with head shifting, pointer re-wiring, and null-boundary guards.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 254: Delete All Occurrences of a Key in Doubly Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=Mh0NH_SD92k"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Delete All Occurrences of Key in DLL",
          url: "https://takeuforward.org/data-structure/delete-all-occurrences-of-a-key-in-dll/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Delete all occurrences of a given key in a doubly linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list/1"),
          difficulty: "Medium",
          description: "Delete all occurrences of a given key x in a doubly linked list and return the updated head.",
        },
        {
          platform: "LeetCode",
          title: "Remove Linked List Elements (LC 203)",
          url: cleanUrl("https://leetcode.com/problems/remove-linked-list-elements/"),
          difficulty: "Easy",
          description: "Remove all nodes of a singly linked list that have Node.val == val and return the new head.",
        },
        {
          platform: "LeetCode",
          title: "Delete Nodes From Linked List Present in Array (LC 3217)",
          url: cleanUrl("https://leetcode.com/problems/delete-nodes-from-linked-list-present-in-array/"),
          difficulty: "Medium",
          description: "Delete all occurrences of a set of target keys from a linked list in a single pass.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a **Doubly Linked List (DLL)** and an integer \`key\`, delete **every node** whose value equals \`key\`, re-wire the remaining \`next\` and \`prev\` pointers, and return the updated \`head\`.

### 💡 Key Takeaways
- **Handling Head Updates & Null Boundary Guards (\`O(N)\` Time, \`O(1)\` Space):**
  - Traverse \`temp\` starting from \`head\`.
  - Whenever **\`temp->data == key\`**:
    1. **Head Check (\`if (temp == head)\`):** If \`temp\` is currently the \`head\` of the DLL, advance **\`head = head->next;\`** so \`head\` never points to a deleted node!
    2. Grab neighbors: \`Node* nextNode = temp->next;\` and \`Node* prevNode = temp->prev;\`.
    3. **Link \`nextNode\` back to \`prevNode\` (if \`nextNode\` exists):**
       \`if (nextNode != nullptr) nextNode->prev = prevNode;\`
    4. **Link \`prevNode\` forward to \`nextNode\` (if \`prevNode\` exists):**
       \`if (prevNode != nullptr) prevNode->next = nextNode;\`
    5. Free memory (\`delete temp;\` or \`free(temp);\`) and advance **\`temp = nextNode;\`**.
  - Else (\`temp->data != key\`): simply advance \`temp = temp->next;\`.

### 💻 Delete All Occurrences of a Key in DLL Blueprint
~~~cpp
Node* deleteAllOccurrences(Node* head, int key) {
    Node* temp = head;

    while (temp != nullptr) {
        if (temp->data == key) {
            // 1. If deleting the current head, shift head forward first!
            if (temp == head) {
                head = head->next;
            }

            Node* nextNode = temp->next;
            Node* prevNode = temp->prev;

            // 2. Re-wire neighbors with null-pointer guards
            if (nextNode != nullptr) nextNode->prev = prevNode;
            if (prevNode != nullptr) prevNode->next = nextNode;

            delete temp;
            temp = nextNode;
        } else {
            temp = temp->next;
        }
    }
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Only Checking \`if (temp == head)\` Once Before the Loop:** If the DLL starts with **multiple consecutive \`key\` nodes** (e.g., \`10 <-> 10 <-> 4\` with \`key = 10\`), the second \`10\` becomes the *new* \`head\` after the first \`10\` is deleted! Checking \`if (temp == head)\` **inside** the loop handles any number of leading \`key\` nodes automatically.`),
      theorySummary: cleanText(`Deleting target keys in a DLL requires checking if temp == head to advance head dynamically, and linking nextNode->prev = prevNode and prevNode->next = nextNode with null checks before deleting temp in O(N) time and O(1) space.`),
    },

    {
      order: 255,
      name: "Converging Head-Tail Two Pointers: Find All Pairs With Given Sum in a Sorted Doubly Linked List",
      slug: "dsa-find-all-pairs-with-given-sum-in-sorted-dll",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      description: "Find all pairs adding to target in a sorted doubly linked list using converging left and right pointers in O(N) time and O(1) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 255: Find Pairs with Given Sum in Doubly Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=YitR4dQsddE"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find Pairs with Given Sum in DLL",
          url: "https://takeuforward.org/data-structure/find-pairs-with-given-sum-in-dll/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Find pairs with given sum in doubly linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1"),
          difficulty: "Easy",
          description: "Given a sorted doubly linked list of positive distinct elements, find all pairs of nodes whose sum equals target.",
        },
        {
          platform: "LeetCode",
          title: "Two Sum II - Input Array Is Sorted (LC 167)",
          url: cleanUrl("https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"),
          difficulty: "Medium",
          description: "Apply the exact same converging left/right two-pointer pattern on a sorted 1D array.",
        },
        {
          platform: "LeetCode",
          title: "Two Sum IV - Input is a BST (LC 653)",
          url: cleanUrl("https://leetcode.com/problems/two-sum-iv-input-is-a-bst/"),
          difficulty: "Easy",
          description: "Extend sorted two-pointer pair finding to a Binary Search Tree.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a **sorted Doubly Linked List** of distinct positive integers and a target integer \`sum\`, find and return **all pairs \`{a, b}\`** whose values add up to \`sum\` in **\`O(N)\` time and \`O(1)\` auxiliary space**.

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Nested Traversal (\`O(N²)\` Time, \`O(1)\` Space):**
  - For each node \`temp1\`, scan \`temp2\` from \`temp1->next\` onward while \`temp1->data + temp2->data <= sum\`.
- **2. Optimal Converging Two Pointers (\`O(2N)\` Time, \`O(1)\` Auxiliary Space):**
  - Because the DLL is **sorted** and has **\`prev\` pointers**, we can use the exact same two-pointer technique as sorted arrays!
  - Set \`left = head\` and walk \`right\` to the **tail node** (\`O(N)\`).
  - Loop **\`while (left->data < right->data)\`**:
    - **If \`left->data + right->data == sum\`:**
      - Add \`{left->data, right->data}\` to \`ans\`.
      - Advance **both** inward: \`left = left->next;\` and \`right = right->prev;\`.
    - **Else if \`left->data + right->data < sum\`:**
      - We need a larger sum → move \`left = left->next;\`.
    - **Else (\`> sum\`):**
      - We need a smaller sum → move \`right = right->prev;\`.

### 💻 Find All Pairs With Given Sum in Sorted DLL Blueprint
~~~cpp
Node* findTail(Node* head) {
    Node* tail = head;
    while (tail->next != nullptr) {
        tail = tail->next;
    }
    return tail;
}

vector<pair<int, int>> findPairsWithGivenSum(Node* head, int k) {
    vector<pair<int, int>> ans;
    if (head == nullptr) return ans;

    Node* left = head;
    Node* right = findTail(head); // O(N) to locate tail

    // O(N) converging two-pointer scan
    while (left->data < right->data) {
        int curSum = left->data + right->data;
        if (curSum == k) {
            ans.push_back({left->data, right->data});
            left = left->next;
            right = right->prev;
        } else if (curSum < k) {
            left = left->next;
        } else {
            right = right->prev;
        }
    }
    return ans;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Using \`while (left != right)\` Instead of \`while (left->data < right->data)\`:** When \`left\` and \`right\` are adjacent and both move inward (\`left = left->next; right = right->prev;\`), they **cross over each other** without ever landing on the exact same node! Checking \`left->data < right->data\` (or \`left != right && left->prev != right\`) stops immediately upon crossover!`),
      theorySummary: cleanText(`Leverage sorted DLL bidirectional links: position left at head and right at tail. Converge inward while left->data < right->data, incrementing left if sum < k and decrementing right if sum > k in O(N) time and O(1) space.`),
    },

    {
      order: 256,
      name: "Contiguous Duplicate Skipping: Remove Duplicates From a Sorted Doubly Linked List",
      slug: "dsa-remove-duplicates-from-sorted-doubly-linked-list",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      description: "Eliminate duplicate values from a sorted doubly linked list in O(N) single-pass time by skipping adjacent identical nodes and re-linking next/prev pointers.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 256: Remove Duplicates from Sorted Doubly Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=YJKVTnOJXSY"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Remove Duplicates from Sorted DLL",
          url: "https://takeuforward.org/data-structure/remove-duplicates-from-a-sorted-doubly-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Remove duplicates from a sorted doubly linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/remove-duplicates-from-a-sorted-doubly-linked-list/1"),
          difficulty: "Easy",
          description: "Given a doubly linked list of n nodes sorted by values, remove duplicate nodes so each value appears once.",
        },
        {
          platform: "LeetCode",
          title: "Remove Duplicates from Sorted List (LC 83)",
          url: cleanUrl("https://leetcode.com/problems/remove-duplicates-from-sorted-list/"),
          difficulty: "Easy",
          description: "Delete all duplicates such that each element appears only once in a sorted singly linked list.",
        },
        {
          platform: "LeetCode",
          title: "Remove Duplicates from Sorted List II (LC 82)",
          url: cleanUrl("https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/"),
          difficulty: "Medium",
          description: "Delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a **sorted Doubly Linked List**, remove all duplicate nodes in-place so that each distinct value appears **only once**, and return the \`head\`.

### 💡 Key Takeaways
- **Why Two Nested \`while\` Loops Still Run in \`O(N)\` Linear Time (Not \`O(N²)\`!):**
  - Because the DLL is sorted, all duplicates of \`temp->data\` sit **contiguously** right after \`temp\`.
  - For each unique node \`temp\`, start \`nextNode = temp->next\`.
  - Inner loop: **\`while (nextNode != nullptr && nextNode->data == temp->data)\`**:
    - Save \`Node* duplicate = nextNode;\`, advance \`nextNode = nextNode->next;\`, and **\`delete duplicate;\`**.
  - Once \`nextNode\` lands on the **first node whose value differs from \`temp->data\`** (or \`nullptr\`):
    1. Wire **\`temp->next = nextNode;\`**
    2. If \`nextNode != nullptr\`, wire **\`nextNode->prev = temp;\`**
    3. Advance **\`temp = temp->next;\`** (which jumps directly over all the deleted duplicates to \`nextNode\`!).
  - **Complexity Analysis:** The inner loop only visits duplicate nodes, and the outer loop only visits unique nodes—so **every node in the DLL is visited at most once (\`O(N)\` Time, \`O(1)\` Space)**!

### 💻 Remove Duplicates From Sorted DLL Blueprint
~~~cpp
Node* removeDuplicates(Node* head) {
    Node* temp = head;

    while (temp != nullptr && temp->next != nullptr) {
        Node* nextNode = temp->next;

        // Skip and free all contiguous duplicate nodes matching temp->data
        while (nextNode != nullptr && nextNode->data == temp->data) {
            Node* duplicate = nextNode;
            nextNode = nextNode->next;
            delete duplicate;
        }

        // Link temp directly to the first distinct nextNode
        temp->next = nextNode;
        if (nextNode != nullptr) {
            nextNode->prev = temp;
        }

        // Advance temp to the next distinct node
        temp = temp->next;
    }
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Setting \`nextNode->prev = temp\` Without Checking \`if (nextNode != nullptr)\`:** If the tail of the DLL consists of duplicates (e.g., \`... <-> 4 <-> 4\`), \`nextNode\` reaches \`nullptr\` at the end of the inner loop! Always guard \`if (nextNode != nullptr)\` before dereferencing \`nextNode->prev\`.`),
      theorySummary: cleanText(`Scan through sorted DLL nodes: for each unique temp, skip contiguous duplicates via nextNode = nextNode->next while freeing memory, then wire temp->next = nextNode and nextNode->prev = temp in O(N) time and O(1) space.`),
    },

    {
      order: 257,
      name: "Segment Isolation & Inter-Group Stitching: Reverse Nodes in K-Group Size of a Linked List",
      slug: "dsa-reverse-nodes-in-k-group-linked-list",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      description: "Reverse linked list nodes k at a time by isolating k-node segments, reversing them in-place, and stitching previous tails to new segment heads in O(N) time.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 257: Reverse Nodes in k-Group Size of Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=lIar1skcQYI"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Reverse Nodes in k-Group",
          url: "https://takeuforward.org/data-structure/reverse-linked-list-in-groups-of-size-k/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Reverse Nodes in k-Group (LC 25)",
          url: cleanUrl("https://leetcode.com/problems/reverse-nodes-in-k-group/"),
          difficulty: "Hard",
          description: "Given the head of a linked list, reverse the nodes of the list k at a time, leaving leftover nodes (< k) as-is.",
        },
        {
          platform: "LeetCode",
          title: "Swap Nodes in Pairs (LC 24)",
          url: cleanUrl("https://leetcode.com/problems/swap-nodes-in-pairs/"),
          difficulty: "Medium",
          description: "Special case of Reverse Nodes in k-Group where k = 2.",
        },
        {
          platform: "LeetCode",
          title: "Reverse Nodes in Even Length Groups (LC 2074)",
          url: cleanUrl("https://leetcode.com/problems/reverse-nodes-in-even-length-groups/"),
          difficulty: "Medium",
          description: "Apply segment isolation and reversal to groups of increasing lengths 1, 2, 3, ... when group length is even.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list and an integer \`k\`, reverse the nodes of the list **\`k\` at a time** in-place and return the modified list. If the number of remaining nodes at the end is **less than \`k\`**, leave them in their original order without reversing.

### 💡 Key Takeaways (The Modular \`getKthNode\` + Isolate + Reverse Pattern)
- **Why We Isolate Each \`k\`-Group (\`kThNode->next = nullptr\`):**
  - Our standard \`reverseLinkedList(temp)\` reverses until it hits \`nullptr\`.
  - So for each group starting at \`temp\`:
    1. **Find \`kThNode\`:** Walk \`k - 1\` steps from \`temp\` using \`getKthNode(temp, k)\`.
    2. **Incomplete Group Check (\`kThNode == nullptr\`):** If fewer than \`k\` nodes remain, attach \`if (prevLast != nullptr) prevLast->next = temp;\` and **\`break\`**!
    3. **Save \`nextNode\` & Sever the Group:** Save \`Node* nextNode = kThNode->next;\`, then set **\`kThNode->next = nullptr;\`** so \`[temp ... kThNode]\` is an isolated list!
    4. **Reverse the Isolated Group:** Call \`reverseLinkedList(temp);\`. Now \`kThNode\` is the new front of this group and \`temp\` is the new tail of this group!
    5. **Stitch to Previous Group (or Update \`head\`):**
       - If \`temp == head\` (first group): update **\`head = kThNode;\`**.
       - Else (subsequent groups): link **\`prevLast->next = kThNode;\`**.
    6. **Advance Pointers:** Save **\`prevLast = temp;\`** and move **\`temp = nextNode;\`**!
- **Complexity:** \`O(2N)\` Time (\`O(N)\` to find \`k\`-th nodes + \`O(N)\` to reverse segments) and \`O(1)\` Space.

### 💻 Reverse Nodes in K-Group Blueprint
~~~cpp
Node* reverseLinkedList(Node* head) {
    Node* temp = head;
    Node* prev = nullptr;
    while (temp != nullptr) {
        Node* front = temp->next;
        temp->next = prev;
        prev = temp;
        temp = front;
    }
    return prev;
}

Node* getKthNode(Node* temp, int k) {
    k -= 1;
    while (temp != nullptr && k > 0) {
        k--;
        temp = temp->next;
    }
    return temp;
}

Node* kReverse(Node* head, int k) {
    Node* temp = head;
    Node* prevLast = nullptr;

    while (temp != nullptr) {
        Node* kThNode = getKthNode(temp, k);
        // If remaining nodes are fewer than k, link them as-is and break!
        if (kThNode == nullptr) {
            if (prevLast != nullptr) prevLast->next = temp;
            break;
        }

        Node* nextNode = kThNode->next; // Preserve start of next group
        kThNode->next = nullptr;        // Isolate current k-group

        reverseLinkedList(temp);

        if (temp == head) {
            head = kThNode;             // First group updates overall head
        } else {
            prevLast->next = kThNode;   // Stitch previous group's tail to current group's new head
        }

        prevLast = temp;                // 'temp' is now the tail of the reversed group!
        temp = nextNode;
    }
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`if (prevLast != nullptr) prevLast->next = temp;\` When \`kThNode == nullptr\`:** Because the previous group's \`kThNode->next\` was set to \`nullptr\` to isolate it, its new tail \`prevLast\` currently points to \`nullptr\`! You **must** re-attach \`prevLast->next = temp\` before breaking so the leftover \`< k\` tail nodes aren't lost!`),
      theorySummary: cleanText(`For each k-node chunk, locate the k-th node, sever kThNode->next = nullptr, reverse the sublist, stitch prevLast->next to kThNode (or update head), and connect any leftover nodes (< k) in O(N) time and O(1) space.`),
    },

    {
      order: 258,
      name: "Circular Tail-to-Head Ring Splicing: Rotate a Linked List by K Places",
      slug: "dsa-rotate-a-linked-list",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      description: "Rotate a linked list by k positions by connecting tail to head into a ring, reducing k = k % len, and breaking the link at the (len - k)-th node in O(N) time.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 258: Rotate a Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=uT7YI7XbTY8"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Rotate a Linked List",
          url: "https://takeuforward.org/data-structure/rotate-a-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Rotate List (LC 61)",
          url: cleanUrl("https://leetcode.com/problems/rotate-list/"),
          difficulty: "Medium",
          description: "Given the head of a linked list, rotate the list to the right by k places.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Rotate a Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/rotate-a-linked-list/1"),
          difficulty: "Medium",
          description: "Rotate a singly linked list by k nodes in O(N) time and O(1) space.",
        },
        {
          platform: "LeetCode",
          title: "Split Linked List in Parts (LC 725)",
          url: cleanUrl("https://leetcode.com/problems/split-linked-list-in-parts/"),
          difficulty: "Medium",
          description: "Practice length-based index arithmetic and tail severing in singly linked lists.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list of length \`len\` and a non-negative integer \`k\`, **rotate the list to the right by \`k\` places** (moving the last \`k % len\` nodes to the front) in **\`O(N)\` time and \`O(1)\` space**.

### 💡 Key Takeaways
- **1. Modulo Reduction for Large \`k\` (\`k = k % len\`):**
  - Rotating a list of length \`5\` by \`5\`, \`10\`, or \`15\` times brings it right back to its original configuration!
  - Therefore:
    - If **\`k % len == 0\`**, no rotation is needed → **return \`head\` immediately**!
    - Otherwise, reduce **\`k = k % len\`**.
- **2. The Circular Ring Cut Technique (\`len - k\`-th Node Becomes the New Tail):**
  1. Walk \`tail\` from \`head\` to the last node (\`while (tail->next != nullptr)\`), counting \`len\` (starting at \`len = 1\`).
  2. Check \`if (k % len == 0) return head;\` and set \`k = k % len;\`.
  3. **Connect the Tail to the Head:** Set **\`tail->next = head;\`** (forming a temporary circular ring!).
  4. **Find the New Last Node (\`(len - k)\`-th node from \`head\`):** Walk to the \`(len - k)\`-th node \`newLastNode\`.
  5. **Break the Ring:** Set **\`head = newLastNode->next;\`** and **\`newLastNode->next = nullptr;\`**!

### 💻 Rotate a Linked List Blueprint
~~~cpp
Node* findNthNode(Node* temp, int k) {
    int cnt = 1;
    while (temp != nullptr) {
        if (cnt == k) return temp;
        cnt++;
        temp = temp->next;
    }
    return temp;
}

Node* rotateRight(Node* head, int k) {
    if (head == nullptr || head->next == nullptr || k == 0) return head;

    // 1. Find length and locate the current tail node
    Node* tail = head;
    int len = 1;
    while (tail->next != nullptr) {
        tail = tail->next;
        len++;
    }

    // 2. Handle multiples of len
    if (k % len == 0) return head;
    k = k % len;

    // 3. Attach tail to head, find the (len - k)-th node, and break the ring!
    tail->next = head;
    Node* newLastNode = findNthNode(head, len - k);

    head = newLastNode->next;
    newLastNode->next = nullptr;

    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Simulating \`k\` Rotations One by One:** When \`k = 2 * 10^9\` (as on LeetCode 61), rotating 1 step at a time causes Time Limit Exceeded! Reducing \`k = k % len\` upfront guarantees at most \`2\` linear passes regardless of how huge \`k\` is.`),
      theorySummary: cleanText(`Compute list length and connect tail->next = head into a circular ring. Reduce k = k % len, navigate to the (len - k)-th node, designate its successor as the new head, and sever the ring in O(N) time and O(1) space.`),
    },

    {
      order: 259,
      name: "In-Place Dummy-Head Two-Pointer Zipper: Merge Two Sorted Linked Lists",
      slug: "dsa-merge-two-sorted-linked-lists",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      description: "Merge two sorted linked lists in-place in O(N1 + N2) time and O(1) space by re-wiring next pointers using a dummy head zipper.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 259: Merge Two Sorted Linked Lists",
          url: cleanUrl("https://www.youtube.com/watch?v=jXu-H7XuClE"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Merge Two Sorted Linked Lists",
          url: "https://takeuforward.org/data-structure/merge-two-sorted-linked-lists/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Merge Two Sorted Lists (LC 21)",
          url: cleanUrl("https://leetcode.com/problems/merge-two-sorted-lists/"),
          difficulty: "Easy",
          description: "Merge the two sorted lists into one sorted list by splicing together the nodes of the first two lists.",
        },
        {
          platform: "LeetCode",
          title: "Merge k Sorted Lists (LC 23)",
          url: cleanUrl("https://leetcode.com/problems/merge-k-sorted-lists/"),
          difficulty: "Hard",
          description: "Extend merging 2 sorted lists to merging k sorted lists.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Merge two sorted linked lists",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/1"),
          difficulty: "Medium",
          description: "Merge two sorted linked lists in-place in O(1) auxiliary space.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the heads \`list1\` and \`list2\` of two sorted singly linked lists, merge them into a **single sorted linked list in-place** (by reusing and re-linking the existing nodes, without allocating \`N1 + N2\` new nodes!) and return the merged head.

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Array + Sort (\`O((N1 + N2) log(N1 + N2))\` Time, \`O(N1 + N2)\` Space):**
  - Copy all values into a vector, sort it, and build a new linked list. Wastes both time and memory!
- **2. Optimal In-Place Dummy-Node Two-Pointer Zipper (\`O(N1 + N2)\` Time, \`O(1)\` Space):**
  - Allocate a single **\`Node* dummyNode = new Node(-1);\`** and set \`Node* temp = dummyNode;\`.
  - Maintain \`t1 = list1\` and \`t2 = list2\`.
  - Loop **\`while (t1 != nullptr && t2 != nullptr)\`**:
    - **If \`t1->data < t2->data\`:** Point \`temp->next = t1;\`, move \`temp = t1;\`, and advance \`t1 = t1->next;\`.
    - **Else:** Point \`temp->next = t2;\`, move \`temp = t2;\`, and advance \`t2 = t2->next;\`.
  - **Attach the Remaining Non-Empty Tail in \`O(1)\`:**
    - Once one list finishes, attach the entire remaining chain of the other list in a single assignment:
      **\`if (t1 != nullptr) temp->next = t1; else temp->next = t2;\`**!
  - Return **\`dummyNode->next\`**.

### 💻 Merge Two Sorted Linked Lists (In-Place O(1) Space) Blueprint
~~~cpp
Node* sortTwoLists(Node* list1, Node* list2) {
    Node* t1 = list1;
    Node* t2 = list2;
    Node* dummyNode = new Node(-1);
    Node* temp = dummyNode;

    while (t1 != nullptr && t2 != nullptr) {
        if (t1->data < t2->data) {
            temp->next = t1;
            temp = t1;
            t1 = t1->next;
        } else {
            temp->next = t2;
            temp = t2;
            t2 = t2->next;
        }
    }

    // Attach whichever list still has remaining nodes in O(1)
    if (t1 != nullptr) temp->next = t1;
    else temp->next = t2;

    Node* mergedHead = dummyNode->next;
    delete dummyNode;
    return mergedHead;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Using a \`while\` Loop to Append Leftover Nodes:** Unlike merging arrays (where you must copy remaining elements one by one), in a linked list all remaining nodes are **already linked together**! A single \`if (t1 != nullptr) temp->next = t1; else temp->next = t2;\` attaches the entire tail in \`O(1)\` time.`),
      theorySummary: cleanText(`Compare t1 and t2 in a two-pointer zipper using a dummy node. Append the smaller node to temp->next, advance that list pointer, and splice the remaining non-null sublist in O(1) time without extra memory.`),
    },

    {
      order: 260,
      name: "Recursive Backtracking Vertical Merge: Flattening a Linked List (Next & Child Pointers)",
      slug: "dsa-flattening-a-linked-list-vertical-merge",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      description: "Flatten a 2D linked list with next and child pointers into a single sorted vertical chain using recursive horizontal traversal and two-pointer vertical merging.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 260: Flattening a Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=ykelywHJWLg"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Flattening a Linked List",
          url: "https://takeuforward.org/data-structure/flattening-a-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Flattening a Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1"),
          difficulty: "Medium",
          description: "Given a linked list where every node represents a sorted vertical sub-linked-list via bottom/child pointers, flatten the list into a single sorted vertical list.",
        },
        {
          platform: "LeetCode",
          title: "Flatten a Multilevel Doubly Linked List (LC 430)",
          url: cleanUrl("https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/"),
          difficulty: "Medium",
          description: "Flatten a multilevel doubly linked list with next, prev, and child pointers into a single-level list.",
        },
        {
          platform: "LeetCode",
          title: "Merge k Sorted Lists (LC 23)",
          url: cleanUrl("https://leetcode.com/problems/merge-k-sorted-lists/"),
          difficulty: "Hard",
          description: "Compare recursive pairwise list merging with min-heap k-way merging.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given a 2D linked list where each top-level node has **two pointers**:
1. **\`next\`**: Points horizontally to the next top-level head node (\`N\` horizontal heads total).
2. **\`child\` (or \`bottom\`)**: Points vertically downward to a **sorted vertical sub-linked-list** of average length \`M\`.
Your task is to **flatten** the entire structure into **one single sorted vertical linked list** connected via **\`child\` pointers** (with every node's \`next\` pointer set to \`nullptr\`) in-place!

### 💡 Key Takeaways
- **Step 1: Adapt "Merge Two Sorted Lists" to Use \`child\` Pointers (\`mergeTwoVerticalLists(list1, list2)\`):**
  - Instead of linking \`res->next\`, link **\`res->child = list1\` (or \`list2\`)**, advance via **\`list1 = list1->child\`**, and explicitly set **\`res->next = nullptr\`** on every merged node so horizontal links are cleared!
- **Step 2: Recursive Backtracking Across Horizontal Heads (\`flattenLinkedList(head)\`):**
  - **Base Case:** \`if (head == nullptr || head->next == nullptr) return head;\` (a single vertical list is already sorted and flattened!).
  - **Recursive Call:** Flatten everything to the right first:
    **\`Node* mergedHead = flattenLinkedList(head->next);\`**
  - **Backtracking Merge:** Merge the current vertical list \`head\` with \`mergedHead\`:
    **\`return mergeTwoVerticalLists(head, mergedHead);\`**!
- **Complexity:** **\`O(N * 2M) = O(2 * N * M)\`** Time and **\`O(N)\`** Recursion Stack Space (\`O(1)\` auxiliary heap space since all nodes are reused in-place!).

### 💻 Flatten a Multi-Level Sorted Linked List Blueprint
~~~cpp
Node* mergeTwoVerticalLists(Node* list1, Node* list2) {
    Node* dummyNode = new Node(-1);
    Node* res = dummyNode;

    while (list1 != nullptr && list2 != nullptr) {
        if (list1->data < list2->data) {
            res->child = list1;
            res = list1;
            list1 = list1->child;
        } else {
            res->child = list2;
            res = list2;
            list2 = list2->child;
        }
        res->next = nullptr; // Clear horizontal next pointer!
    }

    if (list1 != nullptr) res->child = list1;
    else res->child = list2;

    if (dummyNode->child != nullptr) {
        dummyNode->child->next = nullptr;
    }

    Node* newHead = dummyNode->child;
    delete dummyNode;
    return newHead;
}

Node* flattenLinkedList(Node* head) {
    // Base case: 0 or 1 horizontal list is already flattened
    if (head == nullptr || head->next == nullptr) {
        return head;
    }

    // Recursively flatten the right side, then merge with current vertical list
    Node* mergedHead = flattenLinkedList(head->next);
    head = mergeTwoVerticalLists(head, mergedHead);
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Advancing via \`list1->next\` or Returning \`dummyNode->next\`:** In the flattened list, all nodes must be chained vertically via **\`child\` (or \`bottom\`)** pointers, while every \`next\` pointer must be \`nullptr\`!`),
      theorySummary: cleanText(`Recursively traverse horizontally to the final pair of lists and merge them vertically via child pointers in ascending order while clearing next pointers to null. Backtracking merges all N vertical chains in O(N*M) time.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 26 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch26Topics) {
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
        cleanText(topic.name),
        topic.slug,
        cleanText(topic.subtrack),
        cleanText(topic.description),
        cleanText(topic.summaryMarkdown),
        cleanText(topic.theorySummary),
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

  // 5. Update track_topics: Link Batch 26 Topics to topic_order 251 through 260
  console.log("\n🔄 Linking Batch 26 topics to 'problem-solving-dsa-sql' (orders 251..260)...");

  // Remove legacy demo topics if still present
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

  // Link Batch 26 Topics (orders 251..260)
  for (const topicDef of batch26Topics) {
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

  console.log("\n🎉 DSA Batch 26 (Lectures 251–260) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch26()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch26;
