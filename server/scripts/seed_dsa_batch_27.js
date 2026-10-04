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

const seedDsaBatch27 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 27 (Lectures 261–270) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 27 Topics (Lectures 261–270)
  const batch27Topics = [
    // =========================================================================
    // SUBTRACK: Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening) (Topics 261–264)
    // =========================================================================
    {
      order: 261,
      name: "Min-Heap K-Way Zipper: Merge K Sorted Linked Lists",
      slug: "dsa-merge-k-sorted-linked-lists-min-heap",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      videoUrl: "https://www.youtube.com/watch?v=1zktEppsdig",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`lists\` containing the heads of \`K\` sorted singly linked lists, merge all \`K\` lists into a **single sorted linked list** and return its head.

### 💡 Progression of 3 Approaches (Brute → Better → Optimal)
- **1. Brute Force Array Extraction (\`O(M log M)\` Time, \`O(M)\` Space, where \`M = N * K\`):**
  - Collect all node values from all \`K\` lists into a vector, sort it, and build a brand-new linked list. Wastes both time and \`O(N * K)\` memory!
- **2. Better Sequential Pairwise Merging (\`O(N * K * (K + 1) / 2)\` Time, \`O(1)\` Space):**
  - Merge \`list[0]\` and \`list[1]\`, then merge that result with \`list[2]\`, up to \`list[K - 1]\`. Repeatedly scanning the growing prefix list degrades time to \`O(N * K²)\`.
- **3. Optimal Min-Heap Priority Queue (\`O(K log K + N * K * log K)\` Time, \`O(K)\` Space):**
  - Use a **Min-Heap** storing **\`pair<int, Node*>\`** (\`{node->data, node}\`) so the smallest value across the \`K\` active list heads is always at \`pq.top()\`.
  - **Step 1:** Push \`{list[i]->data, list[i]}\` for all non-empty heads (\`i\` from \`0\` to \`K - 1\`).
  - **Step 2:** Create a \`dummyNode = new Node(-1)\` and \`temp = dummyNode\`.
  - **Step 3:** While \`!pq.empty()\`:
    - Pop \`{val, currNode} = pq.top()\`.
    - Attach \`temp->next = currNode;\` and advance \`temp = temp->next;\`.
    - If **\`currNode->next != nullptr\`**, push **\`{currNode->next->data, currNode->next}\`** into the min-heap!
  - Return \`dummyNode->next\`.

### 💻 Merge K Sorted Lists (Min-Heap) Blueprint
\`\`\`cpp
Node* mergeKLists(vector<Node*> &listArray) {
    // Min-heap storing {node->data, node}
    priority_queue<pair<int, Node*>,
                   vector<pair<int, Node*>>,
                   greater<pair<int, Node*>>> pq;

    // 1. Push the head of each non-empty list into the Min-Heap (O(K log K))
    for (int i = 0; i < listArray.size(); i++) {
        if (listArray[i] != nullptr) {
            pq.push({listArray[i]->data, listArray[i]});
        }
    }

    Node* dummyNode = new Node(-1);
    Node* temp = dummyNode;

    // 2. Extract minimum node and push its next neighbor into the heap
    while (!pq.empty()) {
        auto it = pq.top();
        pq.pop();

        Node* currNode = it.second;
        if (currNode->next != nullptr) {
            pq.push({currNode->next->data, currNode->next});
        }

        temp->next = currNode;
        temp = temp->next;
    }

    Node* mergedHead = dummyNode->next;
    delete dummyNode;
    return mergedHead;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Pushing Null Heads Into the Priority Queue:** The input \`listArray\` can contain empty lists (\`nullptr\`)! Always guard \`if (listArray[i] != nullptr)\` before dereferencing \`listArray[i]->data\`.`),
      practiceItems: [
        {
          title: "LeetCode 23: Merge k Sorted Lists",
          url: "https://leetcode.com/problems/merge-k-sorted-lists/",
          difficulty: "Hard",
          description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it."
        },
        {
          title: "GeeksforGeeks: Merge K sorted linked lists",
          url: "https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1",
          difficulty: "Medium",
          description: "Merge K sorted linked lists of different sizes into a single sorted linked list in-place."
        },
        {
          title: "LeetCode 378: Kth Smallest Element in a Sorted Matrix",
          url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
          difficulty: "Medium",
          description: "Use the exact same K-way Min-Heap frontier expansion across sorted rows of a matrix."
        }
      ]
    },

    {
      order: 262,
      name: "Divide-and-Conquer In-Place Sorting: Sort a Linked List Using Merge Sort",
      slug: "dsa-sort-a-linked-list-merge-sort",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      videoUrl: "https://www.youtube.com/watch?v=8ocB7a_c-Cc",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given the \`head\` of an unsorted singly linked list, sort it in ascending order in **\`O(N log N)\` time** without using an external array (reusing the existing nodes in-place via **Merge Sort**).

### 💡 Key Takeaways
- **Why Modified Tortoise & Hare (\`fast = head->next\`) Is Mandatory Here:**
  - Standard Tortoise & Hare (\`slow = head, fast = head\`) returns the **second middle (\`m2\`)** for even-length lists.
  - If you have a 2-node list \`3 -> 4\` and \`findMiddle\` returns the 2nd node (\`4\`), then setting \`middle->next = nullptr\` leaves \`left = 3 -> 4\` (size 2) and \`right = nullptr\` (size 0), causing **infinite recursion**!
  - **The Fix:** Initialize **\`fast = head->next\`**! Now for any even-length list, \`slow\` stops at the **first middle (\`m1\`)** (end of the left half), so \`3 -> 4\` splits cleanly into \`3\` and \`4\`!
- **The 3-Step Recursive Merge Sort Pipeline (\`O(N log N)\` Time, \`O(log N)\` Stack Space):**
  1. **Base Case:** \`if (head == nullptr || head->next == nullptr) return head;\`.
  2. **Split at First Middle:**
     - \`Node* middle = findMiddle(head);\`
     - \`Node* right = middle->next;\`
     - **\`middle->next = nullptr;\`** (sever the left half from the right half!).
     - \`Node* left = head;\`
  3. **Recurse & Merge:**
     - \`left = sortLL(left);\`
     - \`right = sortLL(right);\`
     - \`return mergeTwoLists(left, right);\`!

### 💻 Sort a Linked List (Merge Sort) Blueprint
\`\`\`cpp
Node* findFirstMiddle(Node* head) {
    Node* slow = head;
    // Start fast 1 step ahead so slow stops at the FIRST middle on even lengths!
    Node* fast = head->next;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

Node* mergeTwoLists(Node* list1, Node* list2) {
    Node* dummyNode = new Node(-1);
    Node* temp = dummyNode;

    while (list1 != nullptr && list2 != nullptr) {
        if (list1->data < list2->data) {
            temp->next = list1;
            temp = list1;
            list1 = list1->next;
        } else {
            temp->next = list2;
            temp = list2;
            list2 = list2->next;
        }
    }
    if (list1 != nullptr) temp->next = list1;
    else temp->next = list2;

    Node* newHead = dummyNode->next;
    delete dummyNode;
    return newHead;
}

Node* sortLL(Node* head) {
    if (head == nullptr || head->next == nullptr) {
        return head;
    }

    Node* middle = findFirstMiddle(head);
    Node* right = middle->next;
    middle->next = nullptr; // Sever left half from right half!
    Node* left = head;

    left = sortLL(left);
    right = sortLL(right);
    return mergeTwoLists(left, right);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Starting \`fast = head\` Instead of \`fast = head->next\` in \`findFirstMiddle\`:** On a 2-node list, \`fast = head\` makes \`slow\` land on node 2, so \`middle->next = nullptr\` fails to shrink the left half and triggers a Stack Overflow!`),
      practiceItems: [
        {
          title: "LeetCode 148: Sort List",
          url: "https://leetcode.com/problems/sort-list/",
          difficulty: "Medium",
          description: "Given the head of a linked list, return the list after sorting it in ascending order in O(N log N) time."
        },
        {
          title: "LeetCode 147: Insertion Sort List",
          url: "https://leetcode.com/problems/insertion-sort-list/",
          difficulty: "Medium",
          description: "Compare O(N^2) Insertion Sort on a linked list with O(N log N) Merge Sort."
        },
        {
          title: "GeeksforGeeks: Merge Sort for Linked List",
          url: "https://www.geeksforgeeks.org/problems/sort-a-linked-list/1",
          difficulty: "Medium",
          description: "Sort a given singly linked list using the Merge Sort algorithm."
        }
      ]
    },

    {
      order: 263,
      name: "Interleaved Node Weaving: Clone a Linked List With Next and Random Pointers",
      slug: "dsa-clone-linked-list-with-next-and-random-pointers",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      videoUrl: "https://www.youtube.com/watch?v=q570bKdrnlw",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Each node in a linked list has a \`data\` value, a \`next\` pointer, and a **\`random\` pointer** that can point to **any node in the list or \`nullptr\`**. Construct a **deep copy (clone)** of the list without using an \`O(N)\` hash map!

### 💡 Key Takeaways (Brute Hash Map → Optimal 3-Pass Interleaving)
- **1. Brute Force Using \`unordered_map<Node*, Node*>\` (\`O(2N)\` Time, \`O(N)\` Extra Space):**
  - Pass 1: Create \`mpp[temp] = new Node(temp->data)\` for every node.
  - Pass 2: Set \`copy->next = mpp[temp->next]\` and \`copy->random = mpp[temp->random]\`.
- **2. Optimal 3-Pass Interleaved Node Weaving (\`O(3N)\` Time, \`O(1)\` Extra Space!):**
  - How do we locate the clone of \`temp->random\` in \`O(1)\` time without a hash map? By **inserting each cloned node immediately after its original node** (\`orig1 -> copy1 -> orig2 -> copy2 -> ...\`)!
  - **Pass 1 (Insert Copy Nodes in Between):**
    - For each original node \`temp\`, create \`copyNode = new Node(temp->data)\`, set \`copyNode->next = temp->next; temp->next = copyNode;\`, and jump \`temp = temp->next->next;\`.
  - **Pass 2 (Connect \`random\` Pointers):**
    - For each original node \`temp\`, its clone is \`copyNode = temp->next\`.
    - Where is the clone of \`temp->random\`? Right at **\`temp->random->next\`**!
    - Set **\`copyNode->random = (temp->random != nullptr) ? temp->random->next : nullptr;\`**, and jump \`temp = temp->next->next;\`.
  - **Pass 3 (Extract Cloned List & Restore Original \`next\` Pointers):**
    - Use \`dummyNode\` and \`res\`: set \`res->next = temp->next; res = res->next;\`, restore **\`temp->next = temp->next->next;\`**, and advance \`temp = temp->next;\`.

### 💻 Clone Linked List With Random Pointers (O(1) Extra Space) Blueprint
\`\`\`cpp
void insertCopyInBetween(Node* head) {
    Node* temp = head;
    while (temp != nullptr) {
        Node* nextElement = temp->next;
        Node* copy = new Node(temp->data);

        copy->next = nextElement;
        temp->next = copy;

        temp = nextElement;
    }
}

void connectRandomPointers(Node* head) {
    Node* temp = head;
    while (temp != nullptr) {
        Node* copyNode = temp->next;
        if (temp->random != nullptr) {
            copyNode->random = temp->random->next; // Clone of temp->random!
        } else {
            copyNode->random = nullptr;
        }
        temp = temp->next->next;
    }
}

Node* getDeepCopyList(Node* head) {
    Node* temp = head;
    Node* dummyNode = new Node(-1);
    Node* res = dummyNode;

    while (temp != nullptr) {
        // 1. Extract the cloned node into the result chain
        res->next = temp->next;
        res = res->next;

        // 2. Restore the original list's next pointer
        temp->next = temp->next->next;
        temp = temp->next;
    }
    Node* clonedHead = dummyNode->next;
    delete dummyNode;
    return clonedHead;
}

Node* cloneLL(Node* head) {
    if (head == nullptr) return nullptr;
    insertCopyInBetween(head);
    connectRandomPointers(head);
    return getDeepCopyList(head);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Trying to Separate \`next\` Pointers in Pass 2 While Assigning \`random\` Pointers:** Do **not** restore \`temp->next\` in Pass 2! If a later node's \`random\` pointer points *backward* to an earlier node whose interleaved link was already broken, \`temp->random->next\` will no longer point to its clone! Always keep Pass 2 (\`random\` pointers) and Pass 3 (\`next\` extraction) separate.`),
      practiceItems: [
        {
          title: "LeetCode 138: Copy List with Random Pointer",
          url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
          difficulty: "Medium",
          description: "Construct a deep copy of a linked list where each node contains an additional random pointer which could point to any node in the list, or null."
        },
        {
          title: "GeeksforGeeks: Clone a linked list with next and random pointer",
          url: "https://www.geeksforgeeks.org/problems/clone-a-linked-list-with-next-and-random-pointer/1",
          difficulty: "Hard",
          description: "Clone a linked list with next and random pointers in O(N) time and O(1) auxiliary space."
        },
        {
          title: "LeetCode 133: Clone Graph",
          url: "https://leetcode.com/problems/clone-graph/",
          difficulty: "Medium",
          description: "Compare deep-copying arbitrary pointer graphs via hash maps with O(1) interleaved list cloning."
        }
      ]
    },

    {
      order: 264,
      name: "Bidirectional Navigation State Machine: Design a Browser History Using a Doubly Linked List",
      slug: "dsa-design-browser-history-doubly-linked-list",
      subtrack: "Module 38: Doubly Linked List Medium Problems & Hard Linked List Re-Wiring (K-Group Reversal, Rotation & Multi-Level Flattening)",
      videoUrl: "https://www.youtube.com/watch?v=mG3KLugbOdc",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Design a **Browser History** system for a single tab that starts on a \`homepage\` and supports:
1. **\`visit(string url)\`**: Visits \`url\` from the current page and **clears all forward history**.
2. **\`back(int steps)\`**: Moves \`steps\` back in history (or as far back as the \`homepage\` if \`steps\` exceeds available history) and returns the current URL.
3. **\`forward(int steps)\`**: Moves \`steps\` forward in history (or as far forward as possible) and returns the current URL.

### 💡 Key Takeaways
- **Why a Doubly Linked List (\`Node\` with \`string data\`, \`Node* next\`, \`Node* back\`) Is Ideal:**
  - Maintain a single pointer **\`Node* currentPage;\`**.
  - **Constructor \`Browser(homepage)\` (\`O(1)\`):** Set \`currentPage = new Node(homepage);\`.
  - **\`visit(url)\` (\`O(1)\`):**
    - Allocate \`Node* newNode = new Node(url);\`.
    - Link **\`newNode->back = currentPage;\`** and **\`currentPage->next = newNode;\`** (overwriting \`currentPage->next\` automatically detaches all old forward history!).
    - Advance **\`currentPage = newNode;\`**.
  - **\`back(steps)\` (\`O(steps)\`):**
    - Loop \`while (steps > 0 && currentPage->back != nullptr)\`: move \`currentPage = currentPage->back;\` and \`steps--;\`. Return \`currentPage->data\`.
  - **\`forward(steps)\` (\`O(steps)\`):**
    - Loop \`while (steps > 0 && currentPage->next != nullptr)\`: move \`currentPage = currentPage->next;\` and \`steps--;\`. Return \`currentPage->data\`.

### 💻 Design Browser History (Doubly Linked List) Blueprint
\`\`\`cpp
class BrowserNode {
public:
    string data;
    BrowserNode* next;
    BrowserNode* back;

    BrowserNode(string x) : data(x), next(nullptr), back(nullptr) {}
};

class BrowserHistory {
    BrowserNode* currentPage;

public:
    BrowserHistory(string homepage) {
        currentPage = new BrowserNode(homepage);
    }

    void visit(string url) {
        BrowserNode* newNode = new BrowserNode(url);
        currentPage->next = newNode; // Detaches any old forward history
        newNode->back = currentPage;
        currentPage = newNode;
    }

    string back(int steps) {
        while (steps > 0) {
            if (currentPage->back != nullptr) {
                currentPage = currentPage->back;
            } else {
                break; // Reached homepage; cannot go back further
            }
            steps--;
        }
        return currentPage->data;
    }

    string forward(int steps) {
        while (steps > 0) {
            if (currentPage->next != nullptr) {
                currentPage = currentPage->next;
            } else {
                break; // Reached latest page; cannot go forward further
            }
            steps--;
        }
        return currentPage->data;
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`newNode->back = currentPage;\` in \`visit(url)\`:** If you only set \`currentPage->next = newNode\` without setting \`newNode->back = currentPage\`, subsequent \`back()\` calls will hit \`nullptr\` immediately!`),
      practiceItems: [
        {
          title: "LeetCode 1472: Design Browser History",
          url: "https://leetcode.com/problems/design-browser-history/",
          difficulty: "Medium",
          description: "Implement BrowserHistory(homepage), visit(url), back(steps), and forward(steps)."
        },
        {
          title: "LeetCode 707: Design Linked List",
          url: "https://leetcode.com/problems/design-linked-list/",
          difficulty: "Medium",
          description: "Design and implement a custom Doubly Linked List class from scratch."
        },
        {
          title: "LeetCode 2296: Design a Text Editor",
          url: "https://leetcode.com/problems/design-a-text-editor/",
          difficulty: "Hard",
          description: "Use bidirectional pointer movement to simulate cursor left/right movement and text insertion/deletion."
        }
      ]
    },

    // =========================================================================
    // SUBTRACK: Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation (Topics 265–270)
    // =========================================================================
    {
      order: 265,
      name: "Square-Root Factor Pairing: Print All Divisors of a Number",
      slug: "dsa-print-all-divisors-of-a-number",
      subtrack: "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation",
      videoUrl: "https://www.youtube.com/watch?v=Ae_Ag_saG9s",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a positive integer \`N\`, find and return **all divisors of \`N\`**.

### 💡 Key Takeaways (Brute O(N) → Optimal O(sqrt(N)))
- **The Complementary Divisor Pair Observation (\`i\` and \`N / i\`):**
  - Divisors always come in pairs that multiply to \`N\`! For \`N = 36\`:
    - \`1 * 36 = 36\`
    - \`2 * 18 = 36\`
    - \`3 * 12 = 36\`
    - \`4 * 9  = 36\`
    - \`6 * 6  = 36\` (the turning point at \`sqrt(36) = 6\`!).
  - Notice that in every pair \`(i, N / i)\`, the smaller divisor \`i\` is **at most \`sqrt(N)\`**!
  - Therefore, we only need to loop \`i\` from \`1\` up to **\`i * i <= N\`**! Whenever \`N % i == 0\`, we immediately get **two divisors at once**: **\`i\` and \`N / i\`**!
- **The Perfect-Square Duplicate Guard (\`if ((N / i) != i)\`):**
  - When \`N = 36\` and \`i = 6\`, both \`i\` and \`N / i\` equal \`6\`. Always check **\`if ((N / i) != i)\`** before pushing \`N / i\` so \`6\` is not added twice!
- **Why Write \`i * i <= N\` Instead of \`i <= sqrt(N)\`?**
  - \`sqrt(N)\` calls an STL floating-point library function on every iteration, whereas \`i * i <= N\` uses fast integer multiplication!
- **Complexity:** \`O(sqrt(N))\` Time (plus \`O(D log D)\` if sorting the \`D\` divisors) and \`O(D)\` Space for the output list.

### 💻 Print All Divisors in O(sqrt(N)) Blueprint
\`\`\`cpp
vector<int> printDivisors(int n) {
    vector<int> divisors;

    // Loop up to sqrt(n) using i * i <= n
    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            divisors.push_back(i);

            // Add the complementary divisor (n / i) if it is distinct from i
            if ((n / i) != i) {
                divisors.push_back(n / i);
            }
        }
    }

    // Optional: sort if ascending order is required
    sort(divisors.begin(), divisors.end());
    return divisors;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`if ((n / i) != i)\`:** On every perfect square (\`1, 4, 9, 16, 25, 36...\`), omitting this check pushes the square root twice into your divisor list!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: All divisors of a Number",
          url: "https://www.geeksforgeeks.org/problems/all-divisors-of-a-number/1",
          difficulty: "Easy",
          description: "Given an integer N, print all the divisors of N in ascending order in O(sqrt(N)) time."
        },
        {
          title: "LeetCode 1492: The kth Factor of n",
          url: "https://leetcode.com/problems/the-kth-factor-of-n/",
          difficulty: "Medium",
          description: "Find all factors of n using the sqrt(n) pairing property and return the k-th smallest factor."
        },
        {
          title: "LeetCode 507: Perfect Number",
          url: "https://leetcode.com/problems/perfect-number/",
          difficulty: "Easy",
          description: "Sum all positive divisors of num (excluding num itself) in O(sqrt(num)) time to check if num is a perfect number."
        }
      ]
    },

    {
      order: 266,
      name: "Square-Root Primality Testing: Check if a Number Is Prime or Not",
      slug: "dsa-check-if-a-number-is-prime-or-not",
      subtrack: "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation",
      videoUrl: "https://www.youtube.com/watch?v=MJcckSfoYdI",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a positive integer \`N\`, determine whether \`N\` is a **Prime Number** in **\`O(sqrt(N))\` time** and **\`O(1)\` space**.

### 💡 Key Takeaways
- **The Exact Mathematical Definition of a Prime Number:**
  - Why is *"a number divisible by 1 and itself"* an incomplete definition? Because \`N = 1\` is divisible by \`1\` and itself (\`1\`), yet **\`1\` is NOT a prime number**!
  - **Exact Definition:** A prime number is a natural number greater than \`1\` that has **EXACTLY \`2\` distinct positive divisors** (\`1\` and \`N\`). Since \`1\` has only \`1\` divisor, \`1\` is not prime!
- **Counting Divisors in \`O(sqrt(N))\` Time:**
  - Initialize \`cnt = 0\` and loop \`i\` from \`1\` while \`i * i <= N\`.
  - Whenever \`N % i == 0\`:
    - Increment \`cnt++\` (for divisor \`i\`).
    - If \`(N / i) != i\`, increment \`cnt++\` (for complementary divisor \`N / i\`).
  - After the loop (or breaking early as soon as \`cnt > 2\`), return **\`cnt == 2\`**!

### 💻 Check if a Number Is Prime Blueprint
\`\`\`cpp
bool isPrime(int n) {
    int cnt = 0;

    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            cnt++;
            if ((n / i) != i) {
                cnt++;
            }
            // Early exit optimization: more than 2 divisors means composite!
            if (cnt > 2) return false;
        }
    }
    // Returns true ONLY if n has exactly 2 divisors (automatically false for n = 1!)
    return cnt == 2;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Returning \`true\` for \`n = 1\`:** If you loop from \`i = 2\` to \`i * i <= n\` and return \`true\` at the end without an explicit \`if (n <= 1) return false;\` check, your function will falsely claim \`1\` is prime! Using \`cnt == 2\` (or checking \`if (n <= 1) return false;\` upfront) handles \`n = 1\` cleanly.`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Prime Number",
          url: "https://www.geeksforgeeks.org/problems/prime-number2314/1",
          difficulty: "Basic",
          description: "For a given number N, check if it is prime or not in O(sqrt(N)) time."
        },
        {
          title: "LeetCode 1952: Three Divisors",
          url: "https://leetcode.com/problems/three-divisors/",
          difficulty: "Easy",
          description: "Count the exact number of divisors of n using the sqrt(n) loop and check if the count equals 3."
        },
        {
          title: "LeetCode 2614: Prime In Diagonal",
          url: "https://leetcode.com/problems/prime-in-diagonal/",
          difficulty: "Easy",
          description: "Apply O(sqrt(N)) primality testing to find the largest prime number on the diagonals of a 2D matrix."
        }
      ]
    },

    {
      order: 267,
      name: "Square-Root Trial Division: Print All Prime Factors of a Number",
      slug: "dsa-print-all-prime-factors-of-a-number",
      subtrack: "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation",
      videoUrl: "https://www.youtube.com/watch?v=LT7XhVdeRyg",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer \`N\`, return a list of all **unique prime factors** of \`N\` (divisors of \`N\` that are prime numbers). For example, for \`N = 780\`, the unique prime factors are \`[2, 3, 5, 13]\`.

### 💡 Progression of Approaches (Brute → Optimal School Division up to sqrt(N))
- **1. Brute/Better Divisor + Prime Check (\`O(sqrt(N) * 2 * sqrt(N))\`):**
  - Find every divisor \`(i, N / i)\` and run \`isPrime()\` on each.
- **2. Optimal Repeated Division up to \`sqrt(N)\` (\`O(sqrt(N) * log N)\` Time):**
  - Start \`i\` from \`2\` (the first prime) and loop while **\`i * i <= N\`**:
    - If **\`N % i == 0\`**:
      1. Append \`i\` to \`list\` (why is \`i\` guaranteed to be prime without calling \`isPrime(i)\`? Because we already completely divided out all smaller prime factors \`2, 3, ...\` before reaching \`i\`, so no composite multiple like \`4\` or \`6\` can ever divide the reduced \`N\`!).
      2. **Exhaust \`i\` completely:** Run **\`while (N % i == 0) N = N / i;\`**!
  - **The Crucial Post-Loop Check (\`if (N != 1) list.push_back(N);\`):**
    - What if \`N\` itself is a prime (like \`37\`), or after dividing out \`2, 3, 5\` from \`780\` we are left with \`N = 13\` (a prime factor larger than \`sqrt(13)\`)?
    - When the loop \`i * i <= N\` finishes, if **\`N != 1\`**, the remaining \`N\` is guaranteed to be a prime factor—append \`N\` to \`list\`!

### 💻 Print All Unique Prime Factors Blueprint
\`\`\`cpp
vector<int> AllPrimeFactors(int N) {
    vector<int> primeFactors;

    // 1. Trial division up to sqrt(N)
    for (int i = 2; i * i <= N; i++) {
        if (N % i == 0) {
            primeFactors.push_back(i);
            // Divide N by i as many times as possible to strip all powers of i
            while (N % i == 0) {
                N = N / i;
            }
        }
    }

    // 2. If N is still > 1, the remaining N is itself a prime factor!
    if (N != 1) {
        primeFactors.push_back(N);
    }

    return primeFactors;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`if (N != 1) primeFactors.push_back(N);\` After the Loop:** Any number \`N\` can have at most one prime factor greater than \`sqrt(N)\` (e.g., \`13\` in \`780\`, or \`37\` in \`37\`). Without \`if (N != 1)\`, that largest prime factor is completely missed!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Prime Factors",
          url: "https://www.geeksforgeeks.org/problems/prime-factors5052/1",
          difficulty: "Easy",
          description: "Given a number N, find all its unique prime factors in increasing order."
        },
        {
          title: "LeetCode 2521: Distinct Prime Factors of Product of Array",
          url: "https://leetcode.com/problems/distinct-prime-factors-of-product-of-array/",
          difficulty: "Medium",
          description: "Extract all distinct prime factors of each number in an array using O(sqrt(N)) trial division."
        },
        {
          title: "LeetCode 2507: Smallest Value After Replacing With Sum of Prime Factors",
          url: "https://leetcode.com/problems/smallest-value-after-replacing-with-sum-of-prime-factors/",
          difficulty: "Medium",
          description: "Repeatedly replace n with the sum of its prime factors using trial division."
        }
      ]
    },

    {
      order: 268,
      name: "Binary Exponentiation (Exponentiation by Squaring): Power(x, n) in O(log N)",
      slug: "dsa-power-exponentiation-binary-exponentiation",
      subtrack: "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation",
      videoUrl: "https://www.youtube.com/watch?v=hFWckDXE-K8",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a floating-point or integer base \`x\` and an integer exponent \`n\` (which may be positive, zero, or **negative**), compute **\`x^n\`** in **\`O(log2 N)\` time** and **\`O(1)\` space**.

### 💡 Key Takeaways
- **Why Naive Multiplication (\`O(N)\`) Fails:**
  - When \`n = 2 * 10^9\`, multiplying \`x\` one by one \`n\` times takes billions of operations and causes Time Limit Exceeded.
- **Binary Exponentiation Rules (\`while (nn > 0)\`):**
  - Initialize \`double ans = 1.0;\` and copy \`long long nn = abs((long long)n);\`.
  1. **If \`nn\` is Odd (\`nn % 2 == 1\`):**
     - Pull one factor of \`x\` out into \`ans\`: **\`ans = ans * x;\`** and decrement **\`nn = nn - 1;\`**.
  2. **If \`nn\` is Even (\`nn % 2 == 0\`):**
     - Since \`x^nn = (x²)^(nn / 2)\`, **square the base (\`x = x * x;\`)** and **halve the exponent (\`nn = nn / 2;\`)**!
  - **Handling Negative Exponents (\`n < 0\`):**
    - Since \`x^(-n) = 1 / (x^n)\`, if the original \`n < 0\`, set **\`ans = 1.0 / ans;\`** at the very end!
- **Complexity:** \`O(log2 N)\` Time and \`O(1)\` Space.

### 💻 Binary Exponentiation (Pow(x, n)) Blueprint
\`\`\`cpp
double myPow(double x, int n) {
    double ans = 1.0;
    // Use long long before taking abs() so n = INT_MIN (-2147483648) never overflows!
    long long nn = n;
    if (nn < 0) nn = -1 * nn;

    while (nn > 0) {
        if (nn % 2 == 1) {
            ans = ans * x;
            nn = nn - 1;
        } else {
            x = x * x;
            nn = nn / 2;
        }
    }

    if (n < 0) {
        ans = (double)(1.0) / (double)(ans);
    }
    return ans;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Negating \`int n\` Before Casting to \`long long\`:** In 32-bit signed integers, \`INT_MIN\` is \`-2147483648\`, while \`INT_MAX\` is \`+2147483647\`. Writing \`n = -n\` on a 32-bit \`int\` when \`n == INT_MIN\` causes signed integer overflow! Always copy \`long long nn = n;\` first and negate \`nn\`.`),
      practiceItems: [
        {
          title: "LeetCode 50: Pow(x, n)",
          url: "https://leetcode.com/problems/powx-n/",
          difficulty: "Medium",
          description: "Implement pow(x, n), which calculates x raised to the power n (both positive and negative integers n) in O(log N) time."
        },
        {
          title: "LeetCode 1922: Count Good Numbers",
          url: "https://leetcode.com/problems/count-good-numbers/",
          difficulty: "Medium",
          description: "Use modular binary exponentiation to compute 5^((n+1)/2) * 4^(n/2) % (10^9 + 7) for n up to 10^15."
        },
        {
          title: "GeeksforGeeks: Power Of Numbers",
          url: "https://www.geeksforgeeks.org/problems/power-of-numbers-1587115620/1",
          difficulty: "Medium",
          description: "Compute N raised to the power R modulo 10^9 + 7 using binary exponentiation."
        }
      ]
    },

    {
      order: 269,
      name: "Harmonic Multiple Elimination: Sieve of Eratosthenes (All Primes up to N)",
      slug: "dsa-sieve-of-eratosthenes-all-primes-up-to-n",
      subtrack: "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation",
      videoUrl: "https://www.youtube.com/watch?v=g5Fuxn_AvSk",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer \`N\`, find all prime numbers from \`2\` up to \`N\`. Instead of testing each number individually in \`O(N * sqrt(N))\` time, the **Sieve of Eratosthenes** precomputes primality for **all numbers from \`2\` to \`N\` in \`O(N log(log N))\` time**, turning every subsequent primality check into an **\`O(1)\` lookup**!

### 💡 Key Takeaways & The Two Optimizations
- **Core Idea:**
  - Create an array \`prime(N + 1, 1)\` initialized to \`1\` (meaning prime), with \`prime[0] = prime[1] = 0\`.
  - When we visit \`i\` (starting from \`i = 2\`) and see \`prime[i] == 1\`, \`i\` is prime—so we mark all multiples of \`i\` as \`0\` (composite)!
- **Optimization 1: Start the Inner Loop at \`j = i * i\` (Not \`2 * i\`!):**
  - Why don't we need to mark \`2 * i, 3 * i, ..., (i - 1) * i\` when we are at prime \`i\`?
  - Because every smaller multiple \`k * i\` (where \`k < i\`) has a smaller factor \`k\` and **was already marked as \`0\` when the outer loop processed \`k\`**!
  - For example, when \`i = 5\`, \`5 * 2 = 10\`, \`5 * 3 = 15\`, and \`5 * 4 = 20\` were already marked by \`2\` and \`3\`. The very first unmarked multiple of \`5\` is **\`5 * 5 = 25\` (\`i * i\`)**!
- **Optimization 2: Stop the Outer Loop at \`i * i <= N\`:**
  - Since the inner loop starts at \`j = i * i\`, once \`i * i > N\`, the inner loop won't execute at all! Thus the outer loop only needs to run while **\`i * i <= N\`**.
- **Complexity:** **\`O(N log(log N))\`** Time (Prime Harmonic Series) and **\`O(N)\`** Space.

### 💻 Sieve of Eratosthenes Blueprint
\`\`\`cpp
vector<int> sieveOfEratosthenes(int N) {
    vector<int> prime(N + 1, 1);
    if (N >= 0) prime[0] = 0;
    if (N >= 1) prime[1] = 0;

    // Optimization 2: Outer loop only needs to run up to i * i <= N
    for (int i = 2; i * i <= N; i++) {
        if (prime[i] == 1) {
            // Optimization 1: Start marking multiples from i * i with step +i
            for (int j = i * i; j <= N; j += i) {
                prime[j] = 0;
            }
        }
    }

    // Collect all primes up to N
    vector<int> primesList;
    for (int i = 2; i <= N; i++) {
        if (prime[i] == 1) {
            primesList.push_back(i);
        }
    }
    return primesList;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Incrementing the Inner Loop by \`j++\` Instead of \`j += i\`:** We want to mark **multiples of \`i\`** (\`i * i, i * i + i, i * i + 2i...\`), so the inner loop step must be **\`j += i\`**!`),
      practiceItems: [
        {
          title: "LeetCode 204: Count Primes",
          url: "https://leetcode.com/problems/count-primes/",
          difficulty: "Medium",
          description: "Given an integer n, return the number of prime numbers that are strictly less than n using the Sieve of Eratosthenes."
        },
        {
          title: "GeeksforGeeks: Sieve of Eratosthenes",
          url: "https://www.geeksforgeeks.org/problems/sieve-of-eratosthenes5242/1",
          difficulty: "Easy",
          description: "Find all prime numbers less than or equal to a given integer N."
        },
        {
          title: "LeetCode 2523: Closest Prime Numbers in Range",
          url: "https://leetcode.com/problems/closest-prime-numbers-in-range/",
          difficulty: "Medium",
          description: "Precompute primes up to right using the Sieve of Eratosthenes and find the adjacent prime pair with minimum gap."
        }
      ]
    },

    {
      order: 270,
      name: "Sieve + Prefix Sum Precomputation: Count Primes in a Range [L, R] for Multiple Queries",
      slug: "dsa-count-primes-in-range-l-to-r-sieve-prefix-sum",
      subtrack: "Module 39: Mathematical & Number Theory Algorithms: Divisors, Primes, Binary Exponentiation & Sieve Precomputation",
      videoUrl: "https://www.youtube.com/watch?v=os82DjD2-MA",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given \`Q\` queries (\`Q <= 10^5\`), where each query provides a range **\`[L, R]\`** (\`1 <= L <= R <= 10^6\`). For each query, return the **count of prime numbers between \`L\` and \`R\` inclusive**.

### 💡 Progression of 3 Approaches (Brute → Better → Optimal O(1) per Query)
- **1. Brute Force (\`O(Q * (R - L + 1) * sqrt(N))\`):**
  - For each query, loop \`j\` from \`L\` to \`R\` and call \`isPrime(j)\`. Easily exceeds \`10^{11}\` operations (TLE).
- **2. Better — Sieve Without Prefix Sum (\`O(N log(log N) + Q * (R - L + 1))\`):**
  - Precompute the Sieve array \`prime\` once, then loop from \`L\` to \`R\` per query summing \`prime[j]\`. Still \`O(Q * N) ≈ 10^{11}\` operations in the worst case!
- **3. Optimal — Sieve + Prefix Sum Array (\`O(N log(log N) + N + Q)\` Time — \`O(1)\` per Query!):**
  - **Step 1 (Build Sieve):** Compute the \`prime[0 .. 10^6]\` array using the Sieve of Eratosthenes in \`O(N log(log N))\`.
  - **Step 2 (Convert \`prime\` into a Cumulative Prefix Count Array):**
    - Maintain \`cnt = 0\`. Loop \`i\` from \`2\` to \`10^6\`:
      **\`cnt += prime[i]; prime[i] = cnt;\`**
    - Now \`prime[x]\` stores the **total number of primes in \`[1 .. x]\`**!
  - **Step 3 (Answer Every Query \`[L, R]\` in \`O(1)\` Time):**
    - The number of primes in \`[L .. R]\` is simply all primes up to \`R\` minus all primes strictly before \`L\` (\`[1 .. L - 1]\`):
      **\`ans = prime[R] - prime[L - 1]\`**!

### 💻 Count Primes in Range [L, R] (Sieve + Prefix Sum) Blueprint
\`\`\`cpp
vector<int> countPrimesInRanges(vector<pair<int, int>> &queries) {
    int maxVal = 1000000;
    vector<int> prime(maxVal + 1, 1);
    prime[0] = prime[1] = 0;

    // 1. Precompute Sieve of Eratosthenes up to 10^6: O(N log(log N))
    for (int i = 2; i * i <= maxVal; i++) {
        if (prime[i] == 1) {
            for (int j = i * i; j <= maxVal; j += i) {
                prime[j] = 0;
            }
        }
    }

    // 2. Convert Sieve into a Prefix-Count Array in-place: O(N)
    int cnt = 0;
    for (int i = 2; i <= maxVal; i++) {
        cnt += prime[i];
        prime[i] = cnt;
    }

    // 3. Answer each [L, R] query in O(1) time: O(Q)
    vector<int> ans;
    for (const auto &q : queries) {
        int L = q.first;
        int R = q.second;
        int primesInRange = prime[R] - (L > 0 ? prime[L - 1] : 0);
        ans.push_back(primesInRange);
    }
    return ans;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Writing \`prime[R] - prime[L]\` Instead of \`prime[R] - prime[L - 1]\`:** Because the range \`[L, R]\` is **inclusive of \`L\`**, subtracting \`prime[L]\` would wrongly exclude \`L\` if \`L\` itself is a prime number! Always subtract **\`prime[L - 1]\`**.`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Count Primes In Range",
          url: "https://www.geeksforgeeks.org/problems/find-prime-numbers-in-a-range4718/1",
          difficulty: "Medium",
          description: "Count or list prime numbers in a given range [L, R]."
        },
        {
          title: "LeetCode 204: Count Primes",
          url: "https://leetcode.com/problems/count-primes/",
          difficulty: "Medium",
          description: "Count the number of primes less than n using Sieve precomputation."
        },
        {
          title: "LeetCode 303: Range Sum Query - Immutable",
          url: "https://leetcode.com/problems/range-sum-query-immutable/",
          difficulty: "Easy",
          description: "Review how 1D prefix sums answer [L, R] range queries in O(1) time via prefix[R] - prefix[L - 1]."
        }
      ]
    },
  ];

  console.log("\n📦 Upserting 10 Batch 27 Topics into 'topics' table...");
  const topicIdMap = {};

  for (const t of batch27Topics) {
    const videoUrlClean = cleanUrl(t.videoUrl);
    const videoLinksJson = JSON.stringify([
      { title: cleanText(t.name) + " - Full Lecture", url: videoUrlClean }
    ]);

    const sanitizedPracticeItems = (t.practiceItems || []).map((p) => ({
      title: cleanText(p.title),
      url: cleanUrl(p.url),
      difficulty: cleanText(p.difficulty),
      description: cleanText(p.description),
    }));
    const practiceItemsJson = JSON.stringify(sanitizedPracticeItems);

    const docLinksJson = JSON.stringify(
      sanitizedPracticeItems.map((p) => ({ title: p.title, url: p.url }))
    );

    const upsertRes = await pool.query(
      `INSERT INTO topics (
         name, slug, subtrack, summary_markdown, theory_summary,
         video_links, practice_items, doc_links, description
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         subtrack = EXCLUDED.subtrack,
         summary_markdown = EXCLUDED.summary_markdown,
         theory_summary = EXCLUDED.theory_summary,
         video_links = EXCLUDED.video_links,
         practice_items = EXCLUDED.practice_items,
         doc_links = EXCLUDED.doc_links,
         description = EXCLUDED.description
       RETURNING id, slug;`,
      [
        cleanText(t.name),
        t.slug,
        cleanText(t.subtrack),
        t.summaryMarkdown,
        t.summaryMarkdown,
        videoLinksJson,
        practiceItemsJson,
        docLinksJson,
        `Master ${cleanText(t.name)} with step-by-step intuition, code blueprints, and verified LeetCode/GFG practice.`,
      ]
    );

    const topicId = upsertRes.rows[0].id;
    topicIdMap[t.slug] = topicId;
    console.log(`  ✅ Upserted Topic [${t.order}]: "${t.name}" (ID: ${topicId})`);
  }

  // 4. Link Topics to Track in 'track_topics' Table with sequential topic_order (261 to 270)
  console.log("\n🔄 Linking Batch 27 topics to 'problem-solving-dsa-sql' (orders 261..270)...");
  for (const t of batch27Topics) {
    const topicId = topicIdMap[t.slug];
    await pool.query(
      `INSERT INTO track_topics (track_id, topic_id, topic_order)
       VALUES ($1, $2, $3)
       ON CONFLICT (track_id, topic_id) DO UPDATE SET
         topic_order = EXCLUDED.topic_order;`,
      [trackId, topicId, t.order]
    );
    console.log(`📌 Linked Topic #${t.order}: "${t.name}"`);
  }

  console.log("\n🎉 DSA Batch 27 (Lectures 261–270) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch27()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch27;
