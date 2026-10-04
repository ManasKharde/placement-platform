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

const seedDsaBatch25 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 25 (Lectures 241–250) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 25 Topics (Lectures 241–250)
  const batch25Topics = [
    // =========================================================================
    // SUBTRACK: Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers (Topics 241–250)
    // =========================================================================
    {
      order: 241,
      name: "Dummy Node & Carry Propagation: Add Two Numbers in a Linked List",
      slug: "dsa-add-two-numbers-in-linked-list-dummy-node",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Sum two numbers represented by linked lists in reverse digit order using a dummy node and carry propagation in a single pass.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 241: Add 2 Numbers in Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=XmRrGzR6udg"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Add Two Numbers in Linked List",
          url: "https://takeuforward.org/data-structure/add-two-numbers-represented-as-linked-lists/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Add Two Numbers (LC 2)",
          url: cleanUrl("https://leetcode.com/problems/add-two-numbers/"),
          difficulty: "Medium",
          description: "Add two non-negative numbers whose digits are stored in reverse order in two linked lists and return the sum as a linked list.",
        },
        {
          platform: "LeetCode",
          title: "Add Two Numbers II (LC 445)",
          url: cleanUrl("https://leetcode.com/problems/add-two-numbers-ii/"),
          difficulty: "Medium",
          description: "Add two numbers represented by linked lists when the most significant digit comes first.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Add two numbers represented by linked lists",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1"),
          difficulty: "Medium",
          description: "Sum two numbers represented by linked lists and return the head of the sum list.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given two non-empty linked lists \`num1\` and \`num2\` representing two non-negative integers where the digits are stored in **reverse order** (the head node holds the units digit \`10^0\`, the second node holds \`10^1\`, etc.). Add the two numbers and return the sum as a linked list in the same reversed digit order.

### 💡 Key Takeaways
- **Why the Dummy Node Pattern Simplifies List Construction:**
  - Whenever a problem asks you to **build and return a brand-new linked list**, allocate a **\`Node* dummyNode = new Node(-1);\`** and set \`Node* curr = dummyNode;\`.
  - Without a dummy node, you have to write awkward \`if (head == nullptr)\` checks on the first iteration. With \`dummyNode\`, you simply attach \`curr->next = newNode; curr = curr->next;\` on every step and return **\`dummyNode->next\`** at the end!
- **Digit-by-Digit Addition With \`carry\` (\`O(max(N1, N2))\` Time, \`O(max(N1, N2))\` Space):**
  - Initialize \`carry = 0\`, \`t1 = num1\`, \`t2 = num2\`.
  - Loop \`while (t1 != nullptr || t2 != nullptr)\`:
    - \`sum = carry\`
    - If \`t1\` exists: \`sum += t1->data; t1 = t1->next;\`
    - If \`t2\` exists: \`sum += t2->data; t2 = t2->next;\`
    - Create \`new Node(sum % 10)\`, attach to \`curr->next\`, advance \`curr\`, and update **\`carry = sum / 10\`**.
  - **Crucial Final Check:** After the loop finishes, if **\`carry > 0\`**, attach one final node **\`curr->next = new Node(carry)\`**!

### 💻 Add Two Numbers in Linked List Blueprint
~~~cpp
Node* addTwoNumbers(Node* num1, Node* num2) {
    Node* dummyHead = new Node(-1);
    Node* curr = dummyHead;
    Node* t1 = num1;
    Node* t2 = num2;
    int carry = 0;

    while (t1 != nullptr || t2 != nullptr) {
        int sum = carry;
        if (t1 != nullptr) {
            sum += t1->data;
            t1 = t1->next;
        }
        if (t2 != nullptr) {
            sum += t2->data;
            t2 = t2->next;
        }

        Node* newNode = new Node(sum % 10);
        carry = sum / 10;
        curr->next = newNode;
        curr = curr->next;
    }

    // Don't forget leftover carry after the most significant digits!
    if (carry > 0) {
        curr->next = new Node(carry);
    }

    return dummyHead->next;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting Leftover \`carry\` After the Loop (e.g., \`99 + 1 = 100\`):** When both \`t1\` and \`t2\` become \`nullptr\`, \`carry\` can still be \`1\`! Always check \`if (carry > 0) curr->next = new Node(carry);\` after the \`while\` loop.`),
      theorySummary: cleanText(`Use a dummy head node to assemble the sum list. Traverse both input lists in lockstep, computing sum = carry + t1.val + t2.val, storing sum % 10, propagating carry = sum / 10, and appending any leftover carry node in O(max(N1, N2)).`),
    },

    {
      order: 242,
      name: "Alternating Stride Pointer Splicing: Odd Even Linked List",
      slug: "dsa-odd-even-linked-list-pointer-splicing",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Rearrange a linked list into odd-indexed nodes followed by even-indexed nodes in-place using two parallel pointers and pointer splicing in O(1) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 242: Segregate Odd and Even Nodes in Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=qf6qp7GzD5Q"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Segregate Odd and Even Nodes in Linked List",
          url: "https://takeuforward.org/data-structure/segregate-even-and-odd-nodes-in-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Odd Even Linked List (LC 328)",
          url: cleanUrl("https://leetcode.com/problems/odd-even-linked-list/"),
          difficulty: "Medium",
          description: "Group all nodes with odd 1-based indices together followed by the nodes with even indices in O(1) extra space and O(N) time.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Rearrange a linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/rearrange-a-linked-list/1"),
          difficulty: "Medium",
          description: "Place all odd-positioned nodes before all even-positioned nodes in-place.",
        },
        {
          platform: "LeetCode",
          title: "Partition List (LC 86)",
          url: cleanUrl("https://leetcode.com/problems/partition-list/"),
          difficulty: "Medium",
          description: "Partition a linked list into two chains (less than x and greater than or equal to x) and splice them together.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list, group all nodes at **odd indices** (\`1st, 3rd, 5th...\`) together followed by all nodes at **even indices** (\`2nd, 4th, 6th...\`), preserving their relative order, in **\`O(N)\` time and \`O(1)\` extra space**.

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force (\`O(2N)\` Time, \`O(N)\` Space):**
  - Traverse the list starting at \`head\` jumping by 2 (\`temp = temp->next->next\`) to collect odd-indexed values into a vector, then start at \`head->next\` jumping by 2 to collect even-indexed values, and finally overwrite the list's node values in a second pass.
- **2. Optimal In-Place Pointer Re-Wiring (\`O(N)\` Time, \`O(1)\` Space):**
  - Initialize \`Node* odd = head;\`, \`Node* even = head->next;\`, and **save \`Node* evenHead = head->next;\`** (so we don't lose the start of the even chain!).
  - Why check **\`while (even != nullptr && even->next != nullptr)\`**?
    - Because \`even\` is always **ahead of \`odd\`**! If \`even\` and \`even->next\` are non-null, \`odd\` and \`odd->next\` are guaranteed to be valid.
  - Inside the loop:
    1. Link \`odd\` to the next odd node: **\`odd->next = odd->next->next;\`**
    2. Link \`even\` to the next even node: **\`even->next = even->next->next;\`**
    3. Advance both: **\`odd = odd->next;\`** and **\`even = even->next;\`**.
  - After the loop, attach the tail of the odd chain to the head of the even chain: **\`odd->next = evenHead;\`**!

### 💻 Odd Even Linked List (In-Place O(1) Space) Blueprint
~~~cpp
Node* oddEvenList(Node* head) {
    if (head == nullptr || head->next == nullptr) return head;

    Node* odd = head;
    Node* even = head->next;
    Node* evenHead = head->next; // Save start of even chain!

    while (even != nullptr && even->next != nullptr) {
        odd->next = odd->next->next;
        even->next = even->next->next;

        odd = odd->next;
        even = even->next;
    }

    // Splice the end of the odd chain to the start of the even chain
    odd->next = evenHead;
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Advancing \`odd = odd->next\` Before Updating \`even->next\` (If Using \`even = odd->next\`):** Always update **both** \`odd->next = odd->next->next;\` and \`even->next = even->next->next;\` in lockstep, and never forget to save \`evenHead = head->next\` before the loop starts!`),
      theorySummary: cleanText(`Maintain odd and even pointers while saving evenHead. Advancing each pointer by odd->next = odd->next->next and even->next = even->next->next until even or even->next is null splices odd->next = evenHead in O(N) time and O(1) space.`),
    },

    {
      order: 243,
      name: "Three-Chain Dummy Partitioning: Sort a Linked List of 0's, 1's and 2's by Changing Links",
      slug: "dsa-sort-linked-list-of-0s-1s-and-2s",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Segregate 0s, 1s, and 2s in a single pass by distributing nodes into three dummy-headed chains and splicing them with null termination.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 243: Sort a Linked List of 0's, 1's and 2's",
          url: cleanUrl("https://www.youtube.com/watch?v=gRII7LhdJWc"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Sort Linked List of 0s 1s and 2s",
          url: "https://takeuforward.org/data-structure/sort-a-linked-list-of-0s-1s-or-2s/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Given a linked list of 0s, 1s and 2s, sort it",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/given-a-linked-list-of-0s-1s-and-2s-sort-it/1"),
          difficulty: "Medium",
          description: "Sort a linked list of 0s, 1s, and 2s in a single pass by re-linking nodes in O(1) auxiliary space.",
        },
        {
          platform: "LeetCode",
          title: "Partition List (LC 86)",
          url: cleanUrl("https://leetcode.com/problems/partition-list/"),
          difficulty: "Medium",
          description: "Use two dummy heads to partition a linked list around a pivot value x in one pass.",
        },
        {
          platform: "LeetCode",
          title: "Sort Colors (LC 75)",
          url: cleanUrl("https://leetcode.com/problems/sort-colors/"),
          difficulty: "Medium",
          description: "Compare array-based Dutch National Flag sorting with linked-list 3-dummy-chain splicing.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a linked list where each node contains \`0\`, \`1\`, or \`2\`, sort the linked list in **a single traversal (\`O(N)\` time)** and **\`O(1)\` extra space** by **changing node links** (without overwriting \`node->data\`).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Data Replacement (\`O(2N)\` Time, \`O(1)\` Space):**
  - Pass 1: Count \`cnt0\`, \`cnt1\`, \`cnt2\`. Pass 2: Overwrite node values.
  - Interviewers quickly follow up: *"Do it in ONE pass without modifying node data!"*
- **2. Optimal Three-Dummy-Head Chain Splicing (\`O(N)\` Single Pass, \`O(1)\` Space):**
  - Create **3 dummy heads** and 3 moving tail pointers:
    - \`zeroHead = new Node(-1); zero = zeroHead;\`
    - \`oneHead  = new Node(-1); one  = oneHead;\`
    - \`twoHead  = new Node(-1); two  = twoHead;\`
  - Traverse \`temp\` from \`head\`:
    - If \`temp->data == 0\`: \`zero->next = temp; zero = temp;\`
    - Else if \`temp->data == 1\`: \`one->next = temp; one = temp;\`
    - Else (\`temp->data == 2\`): \`two->next = temp; two = temp;\`
  - **Connecting the 3 Chains Safely (Handling Empty Sub-Lists!):**
    - **\`zero->next = (oneHead->next != nullptr) ? oneHead->next : twoHead->next;\`** (if there are no \`1\`s, \`zero\` connects directly to \`twoHead->next\`!).
    - **\`one->next = twoHead->next;\`**
    - **\`two->next = nullptr;\`** (critical to terminate the list and avoid a cycle!).
  - Return \`zeroHead->next\` (after deleting the 3 dummy nodes).

### 💻 Sort a Linked List of 0s, 1s, and 2s Blueprint
~~~cpp
Node* segregate012(Node* head) {
    if (head == nullptr || head->next == nullptr) return head;

    Node* zeroHead = new Node(-1);
    Node* oneHead  = new Node(-1);
    Node* twoHead  = new Node(-1);

    Node* zero = zeroHead;
    Node* one  = oneHead;
    Node* two  = twoHead;
    Node* temp = head;

    while (temp != nullptr) {
        if (temp->data == 0) {
            zero->next = temp;
            zero = temp;
        } else if (temp->data == 1) {
            one->next = temp;
            one = temp;
        } else {
            two->next = temp;
            two = temp;
        }
        temp = temp->next;
    }

    // Connect the 3 chains (handling cases where 0s, 1s, or 2s are absent!)
    zero->next = (oneHead->next != nullptr) ? oneHead->next : twoHead->next;
    one->next  = twoHead->next;
    two->next  = nullptr; // Terminate the final tail!

    Node* newHead = zeroHead->next;
    delete zeroHead;
    delete oneHead;
    delete twoHead;
    return newHead;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`two->next = nullptr;\`:** The last node appended to the \`2\`s chain might still have its old \`next\` pointer pointing back to a \`0\` or \`1\` node earlier in the list, creating an **infinite cycle**! Always set \`two->next = nullptr;\`.`),
      theorySummary: cleanText(`Distribute nodes into zero, one, and two chains using 3 dummy nodes in a single traversal. Splice zero->next to oneHead->next (or twoHead->next if empty) and terminate two->next = nullptr in O(N) time and O(1) space.`),
    },

    {
      order: 244,
      name: "Fixed-Gap Two-Pointer Lead: Remove N-th Node From the End of a Linked List",
      slug: "dsa-remove-nth-node-from-end-of-linked-list",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Delete the N-th node from the end of a linked list in a single traversal by advancing a fast pointer N steps ahead before moving slow and fast together.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 244: Remove Nth Node from End of Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=3kMKYQ2wNIU"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Remove Nth Node From End of List",
          url: "https://takeuforward.org/data-structure/remove-nth-node-from-the-end-of-a-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Remove Nth Node From End of List (LC 19)",
          url: cleanUrl("https://leetcode.com/problems/remove-nth-node-from-end-of-list/"),
          difficulty: "Medium",
          description: "Given the head of a linked list, remove the nth node from the end of the list in one pass and return its head.",
        },
        {
          platform: "LeetCode",
          title: "Swapping Nodes in a Linked List (LC 1721)",
          url: cleanUrl("https://leetcode.com/problems/swapping-nodes-in-a-linked-list/"),
          difficulty: "Medium",
          description: "Use the N-step pointer lead technique to locate both the k-th node from the start and the k-th node from the end in one pass.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Kth from End of Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1"),
          difficulty: "Easy",
          description: "Find the data of the k-th node from the end of a linked list in a single traversal.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a linked list of length \`L\` and an integer \`N\` (\`1 <= N <= L\`), delete the **\`N\`-th node from the end** of the linked list and return the updated head.

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Two-Pass (\`O(2L)\` Time, \`O(1)\` Space):**
  - Pass 1: Count total nodes \`L\`. If \`L == N\`, delete the head (\`return head->next\`).
  - Pass 2: Walk \`res = L - N\` steps to stop at the **\`(L - N)\`-th node from the start** (just before the target node), and re-link \`temp->next = temp->next->next\`.
- **2. Optimal Single-Pass Fixed-Gap Two Pointers (\`O(L)\` Time, \`O(1)\` Space):**
  - How do we reach the \`(L - N)\`-th node without knowing \`L\` in advance?
  - Start \`fast = head\` and advance \`fast\` by **exactly \`N\` steps** first!
  - **Head Deletion Edge Case (\`fast == nullptr\`):** If \`fast\` is already \`nullptr\` after \`N\` steps, then \`N == L\` (we need to delete the head node!) → delete \`head\` and return \`head->next\`.
  - Otherwise, start \`slow = head\` and advance **both \`fast\` and \`slow\` by 1 step simultaneously** **\`while (fast->next != nullptr)\`**!
  - When \`fast\` lands on the last node (\`fast->next == nullptr\`), \`slow\` is guaranteed to sit **immediately before** the \`N\`-th node from the end!

### 💻 Remove N-th Node From End (Single-Pass) Blueprint
~~~cpp
Node* removeNthFromEnd(Node* head, int n) {
    Node* fast = head;
    Node* slow = head;

    // 1. Advance 'fast' by N steps ahead
    for (int i = 0; i < n; i++) {
        fast = fast->next;
    }

    // 2. Edge Case: If fast reached nullptr, N == length of list (delete head!)
    if (fast == nullptr) {
        Node* newHead = head->next;
        delete head;
        return newHead;
    }

    // 3. Move both pointers 1 step at a time until fast reaches the tail node
    while (fast->next != nullptr) {
        fast = fast->next;
        slow = slow->next;
    }

    // 4. 'slow' is now right before the target node to delete
    Node* delNode = slow->next;
    slow->next = slow->next->next;
    delete delNode;

    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Looping \`while (fast != nullptr)\` Instead of \`while (fast->next != nullptr)\`:** If you stop when \`fast == nullptr\`, \`slow\` lands **on** the node to be deleted instead of **one node before** it! Stopping at \`fast->next == nullptr\` stops \`slow\` at the predecessor node.`),
      theorySummary: cleanText(`Advance fast N steps ahead. If fast is null, the target is the head node. Otherwise, advance slow and fast in lockstep until fast->next is null, positioning slow right before the deleted node in one pass.`),
    },

    {
      order: 245,
      name: "3-Pointer Iterative & Recursive Link Inversion: Reverse a Singly Linked List",
      slug: "dsa-reverse-singly-linked-list-iterative-and-recursive",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Invert pointer directions in a singly linked list in-place using the 3-pointer iterative pattern in O(1) space and the recursive leap-of-faith approach.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 245: Reverse a Singly Linked List | Iterative and Recursive",
          url: cleanUrl("https://www.youtube.com/watch?v=D2vI2DNJGd8"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Reverse a Singly Linked List",
          url: "https://takeuforward.org/data-structure/reverse-a-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Reverse Linked List (LC 206)",
          url: cleanUrl("https://leetcode.com/problems/reverse-linked-list/"),
          difficulty: "Easy",
          description: "Given the head of a singly linked list, reverse the list iteratively and recursively.",
        },
        {
          platform: "LeetCode",
          title: "Reverse Linked List II (LC 92)",
          url: cleanUrl("https://leetcode.com/problems/reverse-linked-list-ii/"),
          difficulty: "Medium",
          description: "Reverse the nodes of a linked list from position left to position right in a single pass.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Reverse a linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1"),
          difficulty: "Easy",
          description: "Reverse a singly linked list in-place and return the new head.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list, reverse the direction of all links in-place and return the \`newHead\`. You must know **both** the **Iterative (\`O(1)\` Space)** and **Recursive (\`O(N)\` Stack Space)** implementations for interviews!

### 💡 Key Takeaways
- **1. Iterative 3-Pointer Reversal (\`O(N)\` Time, \`O(1)\` Space):**
  - Maintain \`temp = head\` and \`prev = nullptr\`.
  - While \`temp != nullptr\`:
    1. Save the next node before breaking the link: **\`Node* front = temp->next;\`**
    2. Reverse the link backward: **\`temp->next = prev;\`**
    3. Advance \`prev = temp;\` and \`temp = front;\`.
  - Return **\`prev\`** (which lands on the old tail / new head).
- **2. Recursive Subproblem Reversal (\`O(N)\` Time, \`O(N)\` Stack Space):**
  - **Base Case:** A list of 0 or 1 node is already reversed: \`if (head == nullptr || head->next == nullptr) return head;\`.
  - **Recursive Leap:** Reverse the remaining \`N - 1\` nodes: \`Node* newHead = reverseRecursive(head->next);\`.
  - Now \`head->next\` is the **tail of the reversed sublist** (\`Node* front = head->next;\`)!
  - Make \`front\` point back to \`head\`: **\`front->next = head;\`**, set **\`head->next = nullptr;\`**, and return \`newHead\`!

### 💻 Reverse Singly Linked List (Iterative & Recursive) Blueprint
~~~cpp
// 1. Optimal Iterative Approach: O(N) Time, O(1) Space
Node* reverseIterative(Node* head) {
    Node* temp = head;
    Node* prev = nullptr;

    while (temp != nullptr) {
        Node* front = temp->next; // Save next node
        temp->next = prev;        // Reverse link backward
        prev = temp;              // Move prev forward
        temp = front;             // Move temp forward
    }
    return prev;
}

// 2. Recursive Approach: O(N) Time, O(N) Recursion Stack Space
Node* reverseRecursive(Node* head) {
    if (head == nullptr || head->next == nullptr) {
        return head;
    }

    Node* newHead = reverseRecursive(head->next);
    Node* front = head->next;
    front->next = head;
    head->next = nullptr;
    return newHead;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`head->next = nullptr;\` in Recursive Reversal:** Without setting \`head->next = nullptr\`, the original first and second nodes point to each other (\`1 <-> 2\`), creating an infinite cycle at the tail of the reversed list!`),
      theorySummary: cleanText(`Iteratively reverse links using prev, temp, and front pointers in O(N) time and O(1) space. Recursively, reverse head->next, link front->next = head, and set head->next = nullptr upon backtracking.`),
    },

    {
      order: 246,
      name: "Tortoise-Hare Midpoint & Second-Half Reversal: Check if a Linked List Is a Palindrome",
      slug: "dsa-check-if-linked-list-is-palindrome",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Find the middle of a linked list, reverse the second half, compare node values in O(1) space, and restore the original list structure before returning.",
      estimatedMinutes: 25,
      videoLinks: [
        {
          title: "Lecture 246: Check if a Linked List is Palindrome",
          url: cleanUrl("https://www.youtube.com/watch?v=lRY_G-u_8jk"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Check if a Linked List is Palindrome",
          url: "https://takeuforward.org/data-structure/check-if-given-linked-list-is-palindrome/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Palindrome Linked List (LC 234)",
          url: cleanUrl("https://leetcode.com/problems/palindrome-linked-list/"),
          difficulty: "Easy",
          description: "Given the head of a singly linked list, return true if it is a palindrome in O(N) time and O(1) space.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Twin Sum of a Linked List (LC 2130)",
          url: cleanUrl("https://leetcode.com/problems/maximum-twin-sum-of-a-linked-list/"),
          difficulty: "Medium",
          description: "Use the exact same midpoint-finding + second-half reversal pattern to pair twin nodes in O(1) space.",
        },
        {
          platform: "LeetCode",
          title: "Reorder List (LC 143)",
          url: cleanUrl("https://leetcode.com/problems/reorder-list/"),
          difficulty: "Medium",
          description: "Find the middle, reverse the second half, and interleave the two halves in-place.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list, determine whether it is a **Palindrome** in **\`O(N)\` time and \`O(1)\` extra space**.

### 💡 Key Takeaways
- **Why Stopping \`slow\` at the First Middle (\`m1\`) Is Crucial for Even Lengths:**
  - Start \`slow = head, fast = head\`.
  - Loop **\`while (fast->next != nullptr && fast->next->next != nullptr)\`** (stopping when \`fast\` reaches the last node for odd length, or the **second-to-last node** for even length!).
  - This guarantees \`slow\` lands at the **end of the first half** (\`m1\`), so \`slow->next\` is always the exact start of the second half!
- **The 4-Step \`O(1)\` Space Algorithm:**
  1. **Find Middle (\`O(N / 2)\`):** Stop \`slow\` at the end of the first half.
  2. **Reverse Second Half (\`O(N / 2)\`):** Call \`Node* newHead = reverseIterative(slow->next);\`.
  3. **Compare Both Halves (\`O(N / 2)\`):** Compare \`first = head\` and \`second = newHead\` while \`second != nullptr\`.
  4. **Restore the Original List (\`O(N / 2)\` — Mandatory Interview Best Practice!):** Call \`reverseIterative(newHead)\` again before returning \`true\` or \`false\` so the caller's input data is never left mutated!

### 💻 Check Palindrome Linked List (O(1) Space) Blueprint
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

bool isPalindrome(Node* head) {
    if (head == nullptr || head->next == nullptr) return true;

    // 1. Find the end of the first half (first middle for even-length lists)
    Node* slow = head;
    Node* fast = head;
    while (fast->next != nullptr && fast->next->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }

    // 2. Reverse the second half starting at slow->next
    Node* newHead = reverseLinkedList(slow->next);

    // 3. Compare the first half and the reversed second half
    Node* first = head;
    Node* second = newHead;
    while (second != nullptr) {
        if (first->data != second->data) {
            reverseLinkedList(newHead); // Restore original list before returning!
            return false;
        }
        first = first->next;
        second = second->next;
    }

    // 4. Restore the second half back to its original order
    reverseLinkedList(newHead);
    return true;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Un-Reverse (\`reverseLinkedList(newHead)\`) Before Returning:** In production and interviews, mutating an input linked list inside a read-only \`isPalindrome()\` check is considered bad engineering practice. Always restore the second half before returning!`),
      theorySummary: cleanText(`Locate the first middle node using tortoise-hare fast->next and fast->next->next checks, reverse the second half starting at slow->next, compare node values with the first half, and restore the list in O(N) time and O(1) space.`),
    },

    {
      order: 247,
      name: "Recursive Backtracking Carry Propagation: Add 1 to a Number Represented by a Linked List",
      slug: "dsa-add-1-to-number-represented-by-linked-list",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Add 1 to a most-significant-digit-first linked list using single-pass recursive backtracking without reversing the list.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 247: Add 1 to a Number Represented as Linked List",
          url: cleanUrl("https://www.youtube.com/watch?v=aXQWhbvT3w0"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Add 1 to a Number Represented as Linked List",
          url: "https://takeuforward.org/data-structure/add-1-to-a-number-represented-by-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "GeeksforGeeks",
          title: "Add 1 to a Linked List Number",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/add-1-to-a-number-represented-as-linked-list/1"),
          difficulty: "Medium",
          description: "A number is represented in a linked list such that each digit corresponds to a node. Add 1 to it.",
        },
        {
          platform: "LeetCode",
          title: "Plus One Linked List (LC 369)",
          url: cleanUrl("https://leetcode.com/problems/plus-one-linked-list/"),
          difficulty: "Medium",
          description: "Given a non-negative integer represented as a linked list of digits (most significant digit first), plus one to the integer.",
        },
        {
          platform: "LeetCode",
          title: "Double a Number Represented as a Linked List (LC 2816)",
          url: cleanUrl("https://leetcode.com/problems/double-a-number-represented-as-a-linked-list/"),
          difficulty: "Medium",
          description: "Use recursive backtracking carry propagation to double a linked-list number in a single pass.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
A number is represented by a singly linked list where the **head is the most significant digit** and the **tail is the units digit** (e.g., \`1 -> 5 -> 9\` represents \`159\`, and \`9 -> 9 -> 9\` represents \`999\`). Add \`1\` to the number and return the updated head.

### 💡 Comparing the Two Approaches
- **1. Iterative Approach via 2 Reversals (\`O(3N)\` Time, \`O(1)\` Space):**
  1. Reverse the list (\`O(N)\`) so the units digit is at the head.
  2. Traverse with \`carry = 1\` adding to each node (\`O(N)\`), breaking early as soon as \`carry == 0\`.
  3. Reverse the list back (\`O(N)\`), and if \`carry == 1\` still remains, prepend \`new Node(1, head)\`.
- **2. Optimal Single-Pass Recursive Backtracking (\`O(N)\` Time, \`O(N)\` Stack Space — Zero List Reversals!):**
  - Because singly linked lists cannot move backward iteratively, **recursion gives us natural backward traversal during backtracking**!
  - Write \`int addHelper(Node* temp)\`:
    - **Base Case (\`temp == nullptr\`):** We just stepped past the units digit! Return **\`1\`** (the \`+1\` we want to add!).
    - **Recursive Call:** \`int carry = addHelper(temp->next);\`
    - **Backtracking Step:** Add \`temp->data += carry;\`:
      - If **\`temp->data < 10\`**: No further carry! Return **\`0\`**.
      - Else (\`temp->data == 10\`): Set **\`temp->data = 0;\`** and return **\`1\`**!
  - In \`addOne(head)\`: if \`addHelper(head) == 1\`, prepend \`new Node(1)\` in front of \`head\`!

### 💻 Add 1 to Linked List (Recursive Backtracking) Blueprint
~~~cpp
int addHelper(Node* temp) {
    // Base case: past the tail node, return initial carry of 1
    if (temp == nullptr) return 1;

    int carry = addHelper(temp->next);
    temp->data = temp->data + carry;

    if (temp->data < 10) {
        return 0; // Carry absorbed; no further carry needed
    }
    temp->data = 0;
    return 1; // Propagate carry of 1 to the previous digit
}

Node* addOne(Node* head) {
    int carry = addHelper(head);
    if (carry == 1) {
        Node* newNode = new Node(1);
        newNode->next = head;
        return newNode;
    }
    return head;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Comparing \`temp->data\` Values Instead of Returning \`carry\`:** In \`9 -> 9 -> 9\`, every node becomes \`0\` and a brand-new head node \`1\` must be allocated (\`1 -> 0 -> 0 -> 0\`). Always check \`if (carry == 1)\` at the root call!`),
      theorySummary: cleanText(`Recursion traverses forward to the tail and propagates carry backward upon returning. Base case returns 1; each step updates temp->data + carry, resetting to 0 and propagating carry = 1 if the sum hits 10.`),
    },

    {
      order: 248,
      name: "Cross-Head Pointer Synchronization: Find the Intersection Point of a Y-Shaped Linked List",
      slug: "dsa-find-intersection-point-of-y-linked-list",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Find the merge node of two intersecting linked lists by redirecting pointers to opposite heads upon reaching null in O(N1 + N2) time and O(1) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 248: Find Intersection of Two Linked Lists",
          url: cleanUrl("https://www.youtube.com/watch?v=0DYoPz2Tpt4"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find Intersection of Two Linked Lists",
          url: "https://takeuforward.org/data-structure/find-intersection-of-two-linked-lists/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Intersection of Two Linked Lists (LC 160)",
          url: cleanUrl("https://leetcode.com/problems/intersection-of-two-linked-lists/"),
          difficulty: "Easy",
          description: "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect in O(N + M) time and O(1) space.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Intersection Point in Y Shaped Linked Lists",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/intersection-point-in-y-shapped-linked-lists/1"),
          difficulty: "Medium",
          description: "Find the node where two Y-shaped singly linked lists merge.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Index Sum of Two Lists (LC 599)",
          url: cleanUrl("https://leetcode.com/problems/minimum-index-sum-of-two-lists/"),
          difficulty: "Easy",
          description: "Practice finding common elements across two lists with minimal index offset.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the heads \`head1\` and \`head2\` of two singly linked lists that merge into a shared tail (a **Y-shaped intersection**), return the **first intersecting \`Node*\`** (by memory address \`t1 == t2\`, **not** by node value!), or \`nullptr\` if they do not intersect.

### 💡 Progression of 3 Approaches
- **1. Brute Force Hashing (\`O(N1 + N2)\` Time, \`O(N1)\` Space):**
  - Store all \`Node*\` pointers of List 1 in a hash map/set, then traverse List 2 and return the first \`Node*\` found in the set.
- **2. Better Length-Difference Alignment (\`O(N1 + 2*N2)\` Time, \`O(1)\` Space):**
  - Compute lengths \`N1\` and \`N2\`, advance the longer list's pointer by \`abs(N1 - N2)\` steps so both pointers are equidistant from the intersection, and then step both together.
- **3. Optimal Cross-Head Switching (\`O(N1 + N2)\` Time, \`O(1)\` Space — Clean & Concise!):**
  - Start \`t1 = head1\` and \`t2 = head2\`.
  - Loop **\`while (t1 != t2)\`**:
    - Advance \`t1 = t1->next;\` and \`t2 = t2->next;\`.
    - If \`t1 == t2\`, return \`t1\` (handles both intersection and the case where both hit \`nullptr\` simultaneously when no intersection exists!).
    - When \`t1\` hits \`nullptr\`, redirect **\`t1 = head2\`**!
    - When \`t2\` hits \`nullptr\`, redirect **\`t2 = head1\`**!
  - **Why does this work?** By walking List 1 + List 2 (\`N1 + N2\` steps) and List 2 + List 1 (\`N2 + N1\` steps), both pointers automatically cancel out their length difference \`|N1 - N2|\` and land on the intersection node at the **exact same step**!

### 💻 Intersection of Y-Shaped Linked List Blueprint
~~~cpp
Node* findIntersection(Node* firstHead, Node* secondHead) {
    if (firstHead == nullptr || secondHead == nullptr) return nullptr;

    Node* t1 = firstHead;
    Node* t2 = secondHead;

    while (t1 != t2) {
        t1 = t1->next;
        t2 = t2->next;

        // Meets at the intersection node OR both reach nullptr at the exact same time!
        if (t1 == t2) return t1;

        // Switch to the opposite list's head upon reaching nullptr
        if (t1 == nullptr) t1 = secondHead;
        if (t2 == nullptr) t2 = firstHead;
    }
    return t1;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Comparing \`t1->data == t2->data\` Instead of \`t1 == t2\`:** Two distinct nodes before the merge point can easily hold the same integer value (e.g., \`4\`)! Intersection is defined strictly by **shared node memory address (\`t1 == t2\`)**.`),
      theorySummary: cleanText(`Redirecting pointer t1 to head2 and t2 to head1 upon reaching nullptr aligns their cumulative paths to N1 + N2 steps, causing them to meet at the identical intersection address in O(N1 + N2) time and O(1) space.`),
    },

    {
      order: 249,
      name: "Tortoise & Hare Algorithm: Find the Middle Element of a Linked List",
      slug: "dsa-find-middle-element-of-linked-list-tortoise-hare",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Find the middle node of a linked list in a single pass using slow (+1) and fast (+2) pointers with safe termination conditions.",
      estimatedMinutes: 15,
      videoLinks: [
        {
          title: "Lecture 249: Find Middle Element of Linked List | Tortoise and Hare",
          url: cleanUrl("https://www.youtube.com/watch?v=7LjQ57RqgEc"),
          duration: "15m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find Middle Element of Linked List",
          url: "https://takeuforward.org/data-structure/find-middle-element-in-a-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Middle of the Linked List (LC 876)",
          url: cleanUrl("https://leetcode.com/problems/middle-of-the-linked-list/"),
          difficulty: "Easy",
          description: "Given the head of a singly linked list, return the middle node of the linked list (or the second middle node if there are two).",
        },
        {
          platform: "LeetCode",
          title: "Delete the Middle Node of a Linked List (LC 2095)",
          url: cleanUrl("https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/"),
          difficulty: "Medium",
          description: "Use Tortoise and Hare pointers to delete the middle node of a linked list in one pass.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Middle of a Linked List",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/finding-middle-element-in-a-linked-list/1"),
          difficulty: "Easy",
          description: "Return the data of the middle element of a singly linked list.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list of length \`N\`, return the **middle node** (if \`N\` is even, so there are two middle nodes \`m1\` and \`m2\`, return the **second middle node \`m2\`** at 1-based position \`(N / 2) + 1\`).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force Two-Pass (\`O(N + N/2)\` Time, \`O(1)\` Space):**
  - Pass 1: Count length \`N\`. Pass 2: Walk \`(N / 2)\` steps from \`head\` to reach node \`(N / 2) + 1\`.
- **2. Optimal Tortoise & Hare Algorithm (\`O(N / 2)\` Single Pass, \`O(1)\` Space):**
  - Initialize \`slow = head\` (Tortoise, moves \`1\` step) and \`fast = head\` (Hare, moves \`2\` steps).
  - Because \`fast\` moves at **twice the speed (\`2x\`)** of \`slow\` (\`x\`), when \`fast\` covers the full distance \`D\`, \`slow\` has covered **exactly \`D / 2\`**!
  - **Stopping Condition (\`while (fast != nullptr && fast->next != nullptr)\`):**
    - For **Odd length \`N\`**, \`fast\` stops on the **last node** (\`fast->next == nullptr\`).
    - For **Even length \`N\`**, \`fast\` jumps past the tail and stops at **\`nullptr\`** (\`fast == nullptr\`), placing \`slow\` on the **second middle node \`m2\`**!

### 💻 Find Middle of Linked List (Tortoise & Hare) Blueprint
~~~cpp
Node* middleNode(Node* head) {
    Node* slow = head;
    Node* fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;       // Move 1 step
        fast = fast->next->next; // Move 2 steps
    }
    return slow;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Writing \`while (fast->next != nullptr && fast != nullptr)\` in the Wrong Order:** Always check **\`fast != nullptr\` FIRST** before dereferencing \`fast->next != nullptr\`! On an even-length list, \`fast\` becomes \`nullptr\`, so checking \`fast->next\` first causes a segmentation fault!`),
      theorySummary: cleanText(`Advancing slow by 1 and fast by 2 guarantees that when fast reaches the tail or null, slow sits precisely at the middle node (or second middle for even lengths) in O(N/2) time and O(1) space.`),
    },

    {
      order: 250,
      name: "Relative-Velocity Gap Reduction: Detect a Loop or Cycle in a Linked List (Floyd's Cycle Detection)",
      slug: "dsa-detect-loop-or-cycle-in-linked-list",
      subtrack: "Module 37: Linked List Medium Problems: Dummy Nodes, In-Place Re-Linking & Tortoise-Hare Pointers",
      description: "Detect cycles in a linked list using Floyd's Tortoise and Hare algorithm, proven by relative velocity reducing the gap by 1 each step in O(N) time and O(1) space.",
      estimatedMinutes: 20,
      videoLinks: [
        {
          title: "Lecture 250: Detect a Loop in Linked List | Floyd's Cycle Detection",
          url: cleanUrl("https://www.youtube.com/watch?v=wiOo4DC5GGA"),
          duration: "20m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Detect a Loop in Linked List",
          url: "https://takeuforward.org/data-structure/detect-a-cycle-in-a-linked-list/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Linked List Cycle (LC 141)",
          url: cleanUrl("https://leetcode.com/problems/linked-list-cycle/"),
          difficulty: "Easy",
          description: "Given head, determine if the linked list has a cycle in it in O(1) memory.",
        },
        {
          platform: "LeetCode",
          title: "Happy Number (LC 202)",
          url: cleanUrl("https://leetcode.com/problems/happy-number/"),
          difficulty: "Easy",
          description: "Apply Floyd's Tortoise and Hare cycle detection to a sequence of sum-of-squared-digits transitions.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Detect Loop in linked list",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1"),
          difficulty: "Medium",
          description: "Check if a given singly linked list contains a loop.",
        },
      ],
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of a singly linked list, determine whether the list contains a **cycle (loop)**—a path where starting from a node and following \`next\` pointers eventually brings you back to that exact same node.

### 💡 Key Takeaways (Brute → Optimal + Mathematical Proof)
- **1. Brute Force Hashing (\`O(N)\` Time, \`O(N)\` Space):**
  - Store visited \`Node*\` pointers in an \`unordered_map<Node*, int>\`. If a \`Node*\` is seen again, return \`true\`.
- **2. Optimal Tortoise & Hare (\`O(N)\` Time, \`O(1)\` Space):**
  - Start \`slow = head\` (\`+1\` step) and \`fast = head\` (\`+2\` steps).
  - Inside \`while (fast != nullptr && fast->next != nullptr)\`, advance \`slow = slow->next;\` and \`fast = fast->next->next;\`.
  - If **\`slow == fast\`** at any step, a cycle exists → **\`return true\`**!
- **Mathematical Proof — Why Are \`slow\` and \`fast\` Guaranteed to Collide (And Never Jump Over Each Other)?**
  - Once both \`slow\` and \`fast\` are inside the loop, suppose the distance from \`fast\` behind \`slow\` is **\`d\`**.
  - In every single iteration, \`fast\` moves \`+2\` steps toward \`slow\` while \`slow\` moves \`+1\` step away from \`fast\`.
  - Therefore, the gap \`d\` between them shrinks by **exactly \`2 - 1 = 1\` per step**:
    **\`d → d - 1 → d - 2 → ... → 2 → 1 → 0\`**!
  - Because \`d\` decreases by **\`1\` (not \`2\` or \`3\`)**, \`d\` can **never skip over \`0\`**—they are 100% mathematically guaranteed to land on the exact same node (\`d == 0\`)!

### 💻 Detect Cycle in Linked List (Floyd's Tortoise & Hare) Blueprint
~~~cpp
bool detectCycle(Node* head) {
    Node* slow = head;
    Node* fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;

        // Check collision AFTER advancing pointers (since both start at head!)
        if (slow == fast) {
            return true;
        }
    }
    return false;
}
~~~

### ⚠️ Common Mistakes to Avoid
- **Checking \`if (slow == fast)\` Before Moving \`slow\` and \`fast\`:** Since both \`slow\` and \`fast\` are initialized to \`head\`, checking \`slow == fast\` at the top of the \`while\` loop before advancing them would immediately return \`true\` on the very first iteration even for a loop-free list!`),
      theorySummary: cleanText(`Floyd's cycle detection advances slow by 1 and fast by 2. Inside a cycle of length C, the relative velocity of 1 step per iteration reduces the distance d -> d - 1, guaranteeing collision in O(N) time and O(1) space.`),
    },
  ];

  // 4. Upsert topics into 'topics' table
  console.log("\n📦 Upserting 10 Batch 25 Topics into 'topics' table...");
  const topicIdMap = new Map();

  for (const topic of batch25Topics) {
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

  // 5. Update track_topics: Link Batch 25 Topics to topic_order 241 through 250
  console.log("\n🔄 Linking Batch 25 topics to 'problem-solving-dsa-sql' (orders 241..250)...");

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

  // Link Batch 25 Topics (orders 241..250)
  for (const topicDef of batch25Topics) {
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

  console.log("\n🎉 DSA Batch 25 (Lectures 241–250) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch25()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch25;
