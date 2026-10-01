const pool = require("../config/db");

const seedCompletePillars = async () => {
  console.log("🚀 Starting Complete 4-Pillar Seeding for Node.js Backend Developer...");

  // Ensure columns exist
  await pool.query(`
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS theory_summary TEXT;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS doc_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS video_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS practice_items JSONB DEFAULT '[]'::jsonb;
  `);

  // 1. Get Node.js Backend Developer path ID
  const pathRes = await pool.query(
    "SELECT id, name FROM preparation_paths WHERE slug = 'nodejs-backend-developer'"
  );
  if (pathRes.rows.length === 0) {
    console.error("❌ Node.js Backend Developer path not found.");
    return;
  }
  const pathId = pathRes.rows[0].id;
  console.log(`Found path: ${pathRes.rows[0].name} (ID: ${pathId})`);

  // 2. Define the Pillars 2, 3, 4 Tracks and their Topics
  const additionalPillarsTracks = [
    // =========================================================================
    // PILLAR 2: PROBLEM SOLVING (DSA)
    // =========================================================================
    {
      name: "Data Structures & Algorithms",
      slug: "data-structures-algorithms",
      description: "Core algorithmic problem solving, pattern recognition, and coding interview rounds for tech placements.",
      trackOrder: 6,
      topics: [
        {
          name: "Arrays & Hashing",
          slug: "arrays-and-hashing",
          description: "Hash maps, frequency tables, prefix sums, and O(1) lookups for LeetCode array patterns.",
          estimatedMinutes: 60,
          theory_summary: `### 🎯 Core Algorithmic Breakdown: Arrays & Hashing
Arrays and Hash Maps are the foundational data structures of technical coding rounds. Almost 60% of all interview problems utilize hash-based lookups to reduce time complexity from O(N²) to O(N).

- **Direct Addressing & Hash Functions**: A Hash Map maps arbitrary keys to bucket indices using a hash code. On average, lookup, insertion, and deletion are **O(1)**.
- **Collision Resolution**: Handled via Separate Chaining (linked lists or balanced trees per bucket) or Open Addressing (Linear/Quadratic Probing).
- **Prefix Sum Technique**: Precomputing cumulative sums enables O(1) range sum queries and subarray sum equals K lookups using a hash map of frequencies.

### ⚡ Optimal Complexity Target
- **Time Complexity**: Target O(N) by trading auxiliary memory.
- **Space Complexity**: Target O(N) for hash frequency counters.

### 💡 Placement Interview Walkthrough Strategy
1. Never jump directly into coding. State the brute-force approach first (nested loops, O(N²)).
2. Identify why it is slow: "We are repeatedly scanning the array to check if complement \`target - nums[i]\` exists."
3. Introduce Hash Table: "By storing each seen element in a hash map, we can achieve an immediate O(1) complement lookup."`,
          doc_links: [
            { title: "NeetCode: Arrays & Hashing Roadmap", url: "https://neetcode.io/roadmap" },
            { title: "LeetCode Explore: Array and String", url: "https://leetcode.com/explore/learn/card/array-and-string/" },
            { title: "GeeksforGeeks: Hashing Data Structure", url: "https://www.geeksforgeeks.org/hashing-data-structure/" }
          ],
          video_links: [
            { title: "Two Sum - LeetCode 1 - Blind 75", url: "https://www.youtube.com/watch?v=KLlXCFG5TnA", duration: "10m" },
            { title: "Group Anagrams - Categorizing by Frequency Counts", url: "https://www.youtube.com/watch?v=vzdNOK2oDA4", duration: "14m" }
          ],
          practice_items: [
            {
              title: "Two Sum",
              problemId: "1",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/two-sum/",
              platform: "LeetCode",
              description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(N) time."
            },
            {
              title: "Group Anagrams",
              problemId: "49",
              difficulty: "Medium",
              url: "https://leetcode.com/problems/group-anagrams/",
              platform: "LeetCode",
              description: "Group an array of strings into anagrams using sorted string keys or character count tuples in O(N * K) time."
            },
            {
              title: "Contains Duplicate",
              problemId: "217",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/contains-duplicate/",
              platform: "LeetCode",
              description: "Given an integer array nums, return true if any value appears at least twice in the array using a HashSet."
            }
          ]
        },
        {
          name: "Two Pointers & Sliding Window",
          slug: "two-pointers-sliding-window",
          description: "Converging pointers, fast/slow runners, fixed and dynamic sliding window algorithms.",
          estimatedMinutes: 65,
          theory_summary: `### 🎯 Core Algorithmic Breakdown: Two Pointers & Sliding Window
Two Pointers and Sliding Window techniques optimize array and string algorithms by eliminating redundant re-scanning of subarrays.

- **Opposite-Direction Pointers**: Left pointer starts at index 0, Right pointer starts at \`n - 1\`. They converge towards the middle. Essential for sorted arrays (e.g. Two Sum II, Valid Palindrome, Container With Most Water).
- **Same-Direction (Fast & Slow) Pointers**: Slow pointer marks insertion/unique boundary; Fast pointer scans forward (e.g. Remove Duplicates in-place).
- **Dynamic Sliding Window**: Expand \`right\` pointer until condition is met or violated, then contract \`left\` pointer to maintain valid invariant.

### ⚡ Placement Key Takeaways
1. Whenever the problem mentions **sorted array** or **continuous subarray/substring**, immediately consider Two Pointers or Sliding Window.
2. In Sliding Window, maintain a state variable (e.g. running sum, hash map of character counts). Add \`s[right]\` when expanding, remove \`s[left]\` when contracting.`,
          doc_links: [
            { title: "LeetCode: Two Pointers Card", url: "https://leetcode.com/explore/learn/card/array-and-string/205/array-two-pointer-technique/" },
            { title: "Sliding Window Algorithm Patterns", url: "https://leetcode.com/discuss/study-guide/3722472/mastering-sliding-window-technique-a-comprehensive-guide" }
          ],
          video_links: [
            { title: "Valid Palindrome - Two Pointer Solution", url: "https://www.youtube.com/watch?v=jJXJ16kPFWg", duration: "8m" },
            { title: "Best Time to Buy and Sell Stock - Sliding Window", url: "https://www.youtube.com/watch?v=1pkOGcDnx5o", duration: "12m" }
          ],
          practice_items: [
            {
              title: "Valid Palindrome",
              problemId: "125",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/valid-palindrome/",
              platform: "LeetCode",
              description: "Determine if a string is a palindrome after converting all uppercase letters to lowercase and removing non-alphanumeric characters."
            },
            {
              title: "Best Time to Buy and Sell Stock",
              problemId: "121",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
              platform: "LeetCode",
              description: "Find the maximum profit achievable from a single buy and sell transaction using a one-pass minimum price tracker."
            },
            {
              title: "Longest Substring Without Repeating Characters",
              problemId: "3",
              difficulty: "Medium",
              url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
              platform: "LeetCode",
              description: "Find the length of the longest substring without duplicate characters using a dynamic sliding window and last-seen index map."
            }
          ]
        },
        {
          name: "Linked Lists",
          slug: "linked-lists-interview",
          description: "Pointer manipulation, sentinel dummy nodes, cycle detection with Floyd's algorithm, and list reversal.",
          estimatedMinutes: 50,
          theory_summary: `### 🎯 Core Algorithmic Breakdown: Linked Lists
Linked Lists test clean pointer arithmetic and edge case handling (empty lists, single-node lists, even/odd lengths).

- **Sentinel (Dummy) Node Pattern**: Creating a dummy node \`const dummy = new ListNode(0); dummy.next = head;\` eliminates special edge-case handling for modifying or deleting the list's head node.
- **In-Place List Reversal**: Maintain three pointers: \`prev = null\`, \`curr = head\`, and temporary \`nextTemp = curr.next\`. Swap \`curr.next = prev\`, then advance \`prev = curr\` and \`curr = nextTemp\`.
- **Floyd's Tortoise and Hare (Cycle Detection)**: Slow pointer moves 1 step; Fast pointer moves 2 steps. If a cycle exists, they will collide in O(N) time with O(1) space.`,
          doc_links: [
            { title: "LeetCode Explore: Linked List Card", url: "https://leetcode.com/explore/learn/card/linked-list/" },
            { title: "Floyd's Cycle-Finding Algorithm Explained", url: "https://en.wikipedia.org/wiki/Cycle_detection" }
          ],
          video_links: [
            { title: "Reverse Linked List - Iterative & Recursive", url: "https://www.youtube.com/watch?v=G0_I-ZF0S38", duration: "10m" },
            { title: "Merge Two Sorted Lists - LeetCode 21", url: "https://www.youtube.com/watch?v=XIdigk956u0", duration: "9m" }
          ],
          practice_items: [
            {
              title: "Reverse Linked List",
              problemId: "206",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/reverse-linked-list/",
              platform: "LeetCode",
              description: "Reverse a singly linked list iteratively in O(N) time and O(1) space."
            },
            {
              title: "Merge Two Sorted Lists",
              problemId: "21",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/merge-two-sorted-lists/",
              platform: "LeetCode",
              description: "Merge two sorted linked lists into one sorted list using a dummy head pointer."
            },
            {
              title: "Linked List Cycle",
              problemId: "141",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/linked-list-cycle/",
              platform: "LeetCode",
              description: "Determine if a linked list contains a cycle using Floyd's Tortoise and Hare algorithm in O(1) memory."
            }
          ]
        },
        {
          name: "Trees & Binary Search Trees",
          slug: "trees-binary-search-trees",
          description: "Tree traversals (DFS Pre/In/Post order, BFS Level Order), BST properties, recursion, and lowest common ancestors.",
          estimatedMinutes: 70,
          theory_summary: `### 🎯 Core Algorithmic Breakdown: Binary Trees & BST
Hierarchical tree structures are heavily tested in engineering interviews.

- **DFS Traversals**:
  - **In-order (Left, Root, Right)**: Yields sorted order on a Binary Search Tree (BST).
  - **Pre-order (Root, Left, Right)**: Ideal for copying or serializing tree structures.
  - **Post-order (Left, Right, Root)**: Ideal for deleting trees or calculating bottom-up heights.
- **BFS (Breadth-First Search / Level-Order)**: Uses a Queue data structure to traverse node-by-node level by level.
- **BST Invariant**: For every node \`X\`, all keys in the left subtree are \`< X.val\` and all keys in the right subtree are \`> X.val\`.`,
          doc_links: [
            { title: "LeetCode Explore: Binary Tree Card", url: "https://leetcode.com/explore/learn/card/data-structure-tree/" },
            { title: "Binary Search Tree Properties Guide", url: "https://en.wikipedia.org/wiki/Binary_search_tree" }
          ],
          video_links: [
            { title: "Invert Binary Tree - LeetCode 226", url: "https://www.youtube.com/watch?v=OnSn2XEQ4MY", duration: "7m" },
            { title: "Maximum Depth of Binary Tree - BFS and DFS", url: "https://www.youtube.com/watch?v=hTM3phJS6GE", duration: "9m" }
          ],
          practice_items: [
            {
              title: "Invert Binary Tree",
              problemId: "226",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/invert-binary-tree/",
              platform: "LeetCode",
              description: "Invert a binary tree in-place recursively or using an iterative BFS queue."
            },
            {
              title: "Maximum Depth of Binary Tree",
              problemId: "104",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
              platform: "LeetCode",
              description: "Find the maximum depth from root to the farthest leaf node using post-order recursion: 1 + max(left, right)."
            },
            {
              title: "Validate Binary Search Tree",
              problemId: "98",
              difficulty: "Medium",
              url: "https://leetcode.com/problems/validate-binary-search-tree/",
              platform: "LeetCode",
              description: "Determine if a binary tree is a valid BST by enforcing (min < val < max) bounds during recursive traversal."
            }
          ]
        }
      ]
    },

    // =========================================================================
    // PILLAR 3: CS FUNDAMENTALS
    // =========================================================================
    {
      name: "Core Computer Science",
      slug: "core-computer-science-fundamentals",
      description: "Operating Systems, DBMS internals, Computer Networks, and low-level architecture for technical screening rounds.",
      trackOrder: 7,
      topics: [
        {
          name: "Operating Systems: Concurrency, Deadlocks & Virtual Memory",
          slug: "os-concurrency-deadlocks-memory",
          description: "Processes vs threads, CPU scheduling, synchronization primitives (mutex/semaphores), deadlock conditions, and paging.",
          estimatedMinutes: 55,
          theory_summary: `### 🎯 Core Systems Breakdown: Operating Systems
Operating Systems manage hardware resources and coordinate execution of multiple software applications safely.

- **Process vs Thread**: A process is an independent execution unit with isolated virtual memory. A thread is an execution context within a process that shares code, heap, and open files with sibling threads.
- **Deadlock**: A state where a set of processes are blocked because each is holding a resource and waiting for another. The 4 Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.
- **Virtual Memory & Paging**: The OS maps contiguous virtual addresses to fragmented physical RAM pages via the Memory Management Unit (MMU) and Page Tables. Translation Lookaside Buffer (TLB) acts as a hardware cache.`,
          doc_links: [
            { title: "Operating Systems: Three Easy Pieces (OSTEP)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
            { title: "GeeksforGeeks OS Interview Questions", url: "https://www.geeksforgeeks.org/operating-systems/" }
          ],
          video_links: [
            { title: "Processes vs Threads Explained Visually", url: "https://www.youtube.com/watch?v=4rLW7ZG20DQ", duration: "16m" },
            { title: "Virtual Memory & Paging Deep Dive", url: "https://www.youtube.com/watch?v=qcBIvHMzU8k", duration: "20m" }
          ],
          practice_items: [
            {
              question: "What is the difference between a Process and a Thread?",
              answer: "A process is an executing program instance with its own private virtual memory space, file handles, and resources. A thread is the smallest unit of CPU execution within a process; multiple threads of the same process share code, data, and heap, but each has its own private stack and registers.",
              difficulty: "Core Screening"
            },
            {
              question: "Explain the 4 Coffman conditions required for a Deadlock to occur.",
              answer: "Deadlock can arise if and only if all four conditions hold simultaneously: 1. Mutual Exclusion (non-shareable resources), 2. Hold and Wait (process holds resource while waiting for another), 3. No Preemption (resources cannot be forcibly taken), 4. Circular Wait (closed chain of processes waiting on each other).",
              difficulty: "Classic Interview"
            },
            {
              question: "What is the difference between a Mutex and a Counting Semaphore?",
              answer: "A Mutex (Mutual Exclusion Object) is a locking mechanism owned by a single thread at a time (strict ownership). A Semaphore is a signaling mechanism with an integer counter allowing up to N concurrent threads to access a shared resource pool.",
              difficulty: "Core Screening"
            },
            {
              question: "What is a Page Fault and what happens when it occurs?",
              answer: "A Page Fault is a hardware trap raised by the MMU when a program accesses a virtual memory address whose page table entry has the valid bit set to 0 (not loaded in physical RAM). The OS pauses execution, swaps the missing page from disk (swap space) into an available RAM frame, updates the page table, and resumes the instruction.",
              difficulty: "Systems Architecture"
            },
            {
              question: "What is Thrashing in an Operating System?",
              answer: "Thrashing occurs when the system spends more time servicing page faults and swapping pages between RAM and disk than executing useful CPU instructions. It happens when total working set sizes of all active processes exceed available physical memory.",
              difficulty: "Senior Engineering"
            }
          ]
        },
        {
          name: "DBMS: ACID Properties, Indexing (B-Trees) & Transactions",
          slug: "dbms-acid-indexing-transactions",
          description: "ACID guarantees, Transaction Isolation Levels, B-Tree index traversal, write-ahead logging (WAL), and concurrency anomalies.",
          estimatedMinutes: 50,
          theory_summary: `### 🎯 Core Systems Breakdown: Database Management Systems (DBMS)
Databases guarantee reliable persistence, high availability, and concurrent access without corrupting data.

- **ACID Guarantees**:
  - **Atomicity**: All operations in a transaction succeed or all roll back (All-or-Nothing).
  - **Consistency**: The database transitions from one valid state to another, enforcing foreign keys and constraints.
  - **Isolation**: Concurrent transactions execute without interfering with one another.
  - **Durability**: Once committed, changes survive system crashes (via Write-Ahead Logging / WAL).
- **Transaction Isolation Levels (SQL Standard)**:
  1. *Read Uncommitted*: Subject to Dirty Reads, Non-repeatable Reads, Phantom Reads.
  2. *Read Committed*: Prevents Dirty Reads. Most common production default.
  3. *Repeatable Read*: Prevents Dirty Reads and Non-repeatable Reads.
  4. *Serializable*: Complete isolation; prevents phantom reads via predicate locks or snapshot isolation.
- **B-Tree Indexing**: Self-balancing search trees where each node holds multiple keys and pointers, maximizing disk block I/O efficiency (logarithmic depth O(log_B N)).`,
          doc_links: [
            { title: "PostgreSQL Concurrency Control & Isolation", url: "https://www.postgresql.org/docs/current/mvcc.html" },
            { title: "Database System Concepts - Silberschatz & Korth", url: "https://www.db-book.com/" }
          ],
          video_links: [
            { title: "ACID Transactions Explained Simply", url: "https://www.youtube.com/watch?v=pomxJODBcKs", duration: "12m" },
            { title: "How B-Tree Indexes Work in Databases", url: "https://www.youtube.com/watch?v=aZjYr87r1b8", duration: "18m" }
          ],
          practice_items: [
            {
              question: "Explain the difference between Dirty Read, Non-Repeatable Read, and Phantom Read.",
              answer: "Dirty Read: Transaction A reads uncommitted data written by Transaction B (which may roll back). Non-Repeatable Read: Transaction A re-reads a row and finds values changed by a committed Transaction B. Phantom Read: Transaction A re-executes a range query and finds new rows inserted by committed Transaction B.",
              difficulty: "Classic Interview"
            },
            {
              question: "Why do relational databases use B-Trees instead of Binary Search Trees for indexes?",
              answer: "Databases store data on secondary storage (disks/SSDs). BSTs have high tree height causing numerous disk I/O seeks. B-Trees have massive branching factors (hundreds of keys per node), fitting an entire node into a single 4KB/8KB disk page. A 3-level B-Tree can index millions of rows with only 3 disk reads.",
              difficulty: "Systems Architecture"
            },
            {
              question: "What is Write-Ahead Logging (WAL) and how does it guarantee durability?",
              answer: "WAL ensures that database modifications are written and flushed sequentially to a dedicated append-only log on disk before dirty data pages in the buffer pool are written back to table files. In a power outage or crash, the database recovers by replaying committed WAL records.",
              difficulty: "Senior Engineering"
            }
          ]
        },
        {
          name: "Computer Networks: TCP/IP, HTTP/HTTPS, WebSockets & DNS",
          slug: "networks-tcp-http-websockets-dns",
          description: "OSI layers, TCP 3-way handshake, UDP, TLS/SSL handshake, HTTP/1.1 vs HTTP/2 vs HTTP/3, WebSockets, and DNS resolution.",
          estimatedMinutes: 50,
          theory_summary: `### 🎯 Core Systems Breakdown: Computer Networks
Modern software engineering and distributed systems rely on reliable network communication protocols.

- **TCP vs UDP**: TCP is connection-oriented, reliable, guarantees in-order packet delivery via sequence numbers and ACK packets, and handles congestion control. UDP is connectionless, lightweight, unreliable, and optimal for real-time gaming, VoIP, and video streaming.
- **TCP Three-Way Handshake**:
  1. Client sends \`SYN\` (Synchronize sequence number).
  2. Server responds with \`SYN-ACK\` (Synchronize + Acknowledge).
  3. Client responds with \`ACK\` (Acknowledge). Connection established!
- **HTTP/1.1 vs HTTP/2 vs HTTP/3**:
  - HTTP/1.1: Persistent connections, head-of-line blocking on single TCP stream.
  - HTTP/2: Binary protocol with multiplexed streams over a single TCP connection, HPACK header compression.
  - HTTP/3: Runs over QUIC (UDP), eliminating TCP head-of-line blocking when packet loss occurs.`,
          doc_links: [
            { title: "MDN: An Overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
            { title: "High Performance Browser Networking - Ilya Grigorik", url: "https://hpbn.co/" }
          ],
          video_links: [
            { title: "TCP 3-Way Handshake and Teardown Explained", url: "https://www.youtube.com/watch?v=F27PLhn3W04", duration: "12m" },
            { title: "How HTTPS and TLS Work - Computerphile", url: "https://www.youtube.com/watch?v=T43qmd05j7c", duration: "15m" }
          ],
          practice_items: [
            {
              question: "What happens from the moment you type 'google.com' in a browser until the page renders?",
              answer: "1. Browser checks local cache (DNS cache, OS hosts file). 2. Recursive DNS resolution queries root, TLD, and authoritative nameservers to resolve IP. 3. Browser initiates TCP 3-way handshake (SYN, SYN-ACK, ACK). 4. TLS Handshake negotiates encryption keys. 5. Browser issues HTTP GET request. 6. Server responds with HTTP 200 and HTML payload. 7. Browser parses DOM/CSSOM and renders page.",
              difficulty: "Most Famous Interview Question"
            },
            {
              question: "Why does HTTP/2 multiplexing suffer from TCP Head-of-Line (HoL) blocking?",
              answer: "HTTP/2 multiplexes multiple logical request streams into a single TCP connection. However, TCP operates at the transport layer without stream awareness; if a single IP packet drops, TCP halts delivery of all subsequent packets on that connection until the lost packet is retransmitted. HTTP/3 solves this by using QUIC over UDP.",
              difficulty: "Systems Architecture"
            },
            {
              question: "When should you choose WebSockets over Server-Sent Events (SSE) or HTTP Long Polling?",
              answer: "Use WebSockets when full-duplex (bidirectional), low-latency communication is required (chat apps, collaborative whiteboards, multiplayer games). Use Server-Sent Events (SSE) when updates only flow from server to client (live financial tickers, notifications), as SSE uses standard HTTP and supports automatic reconnection out of the box.",
              difficulty: "Core Engineering"
            }
          ]
        }
      ]
    },

    // =========================================================================
    // PILLAR 4: APTITUDE & SQL
    // =========================================================================
    {
      name: "Quantitative Aptitude & Advanced SQL",
      slug: "quantitative-aptitude-advanced-sql",
      description: "Complex multi-table queries, analytical window functions, subqueries, and quantitative placement problem solving.",
      trackOrder: 8,
      topics: [
        {
          name: "Relational SQL: Complex Joins, Window Functions & GROUP BY",
          slug: "relational-sql-joins-window-functions",
          description: "INNER/LEFT/RIGHT/FULL OUTER joins, DENSE_RANK(), ROW_NUMBER(), PARTITION BY, and HAVING filters for database tests.",
          estimatedMinutes: 50,
          theory_summary: `### 🎯 Core Database Breakdown: Advanced SQL
SQL questions are asked in virtually every preliminary technical screening round for engineering placements.

- **Types of Joins**:
  - \`INNER JOIN\`: Returns rows where matching keys exist in both tables.
  - \`LEFT JOIN\`: Returns all rows from left table, with NULLs for unmatched right table rows.
  - \`FULL OUTER JOIN\`: Returns all rows from both tables, filling NULLs where there is no match.
  - \`CROSS JOIN\`: Cartesian product of two tables.
- **Window Functions (\`OVER (PARTITION BY ... ORDER BY ...)\`)**:
  - Unlike \`GROUP BY\` which collapses rows, window functions calculate aggregates while preserving individual row identities.
  - \`ROW_NUMBER()\`: Assigns sequential integers (1, 2, 3...).
  - \`RANK()\`: Assigns ranks with gaps for ties (1, 2, 2, 4...).
  - \`DENSE_RANK()\`: Assigns ranks without gaps for ties (1, 2, 2, 3...).
- **WHERE vs HAVING**:
  - \`WHERE\` filters individual rows BEFORE aggregation.
  - \`HAVING\` filters aggregated groups AFTER \`GROUP BY\`.`,
          doc_links: [
            { title: "PostgreSQL: Window Functions Tutorial", url: "https://www.postgresql.org/docs/current/tutorial-window.html" },
            { title: "Mode Analytics: Advanced SQL Queries Guide", url: "https://mode.com/sql-tutorial/sql-window-functions/" }
          ],
          video_links: [
            { title: "SQL Window Functions in 15 Minutes - Luke Barousse", url: "https://www.youtube.com/watch?v=Ww71knvhQ-s", duration: "16m" },
            { title: "Top 5 SQL Interview Questions - Ankit Bansal", url: "https://www.youtube.com/watch?v=kYeezJzE_0Y", duration: "25m" }
          ],
          practice_items: [
            {
              title: "Nth Highest Salary",
              problemId: "177",
              platform: "LeetCode SQL",
              difficulty: "Medium",
              url: "https://leetcode.com/problems/nth-highest-salary/",
              description: "Write a SQL query using DENSE_RANK() or LIMIT OFFSET to find the nth highest salary from the Employee table."
            },
            {
              title: "Consecutive Numbers",
              problemId: "180",
              platform: "LeetCode SQL",
              difficulty: "Medium",
              url: "https://leetcode.com/problems/consecutive-numbers/",
              description: "Find all numbers that appear at least three times consecutively using LEAD() and LAG() window functions."
            },
            {
              title: "Department Top Three Salaries",
              problemId: "185",
              platform: "LeetCode SQL",
              difficulty: "Hard",
              url: "https://leetcode.com/problems/department-top-three-salaries/",
              description: "Write a SQL query to find employees who earn top three unique salaries in each department using DENSE_RANK() OVER (PARTITION BY DepartmentId ORDER BY Salary DESC)."
            }
          ]
        },
        {
          name: "Quantitative Aptitude: Speed, Distance, Time & Work",
          slug: "quantitative-aptitude-speed-distance-work",
          description: "Relative speed, trains crossing, pipes and cisterns, work-rate efficiency formulas, and placement aptitude shortcuts.",
          estimatedMinutes: 45,
          theory_summary: `### 🎯 Quantitative Placement Aptitude: Time, Speed & Work
Aptitude assessment tests are the first elimination round for campus recruitment drives (TCS, Infosys, Wipro, Capgemini, Accenture).

- **Speed, Distance, Time Formulas**:
  - \`Speed = Distance / Time\`
  - \`km/hr\` to \`m/s\`: Multiply by \`5/18\`
  - \`m/s\` to \`km/hr\`: Multiply by \`18/5\`
- **Relative Speed**:
  - Objects moving in **opposite directions**: \`Relative Speed = S1 + S2\`
  - Objects moving in **same direction**: \`Relative Speed = |S1 - S2|\`
- **Time and Work Principles**:
  - If a person completes a job in \`D\` days, their 1-day work rate is \`1/D\`.
  - If A takes \`A\` days and B takes \`B\` days, together they take \`(A * B) / (A + B)\` days.
  - Negative work (pipes emptying a tank) is represented as negative fractional rates.`,
          doc_links: [
            { title: "IndiaBIX: Time and Distance Practice", url: "https://www.indiabix.com/aptitude/time-and-distance/" },
            { title: "GeeksforGeeks: Time and Work Shortcuts", url: "https://www.geeksforgeeks.org/time-and-work/" }
          ],
          video_links: [
            { title: "Time and Work Shortcuts & Tricks - CareerRide", url: "https://www.youtube.com/watch?v=KE7tQf9spPg", duration: "18m" },
            { title: "Speed, Distance & Trains Problems Made Easy", url: "https://www.youtube.com/watch?v=Nn_k-5o_8o0", duration: "20m" }
          ],
          practice_items: [
            {
              title: "Opposite Direction Trains Crossing",
              platform: "Placement Aptitude",
              difficulty: "Medium",
              url: "https://www.indiabix.com/aptitude/problems-on-trains/",
              description: "Two trains of length 150m and 120m run on parallel tracks in opposite directions at 65 km/hr and 43 km/hr. Find the time taken to completely cross each other."
            },
            {
              title: "Alternating Work Rates with Efficiency",
              platform: "Placement Aptitude",
              difficulty: "Medium",
              url: "https://www.indiabix.com/aptitude/time-and-work/",
              description: "A can do a piece of work in 12 days and B in 15 days. If they work on alternate days starting with A, in how many days will the work be finished?"
            },
            {
              title: "Pipes & Cisterns with Leakage",
              platform: "Placement Aptitude",
              difficulty: "Easy",
              url: "https://www.indiabix.com/aptitude/pipes-and-cistern/",
              description: "Pipe A fills a tank in 6 hours, Pipe B fills it in 8 hours. A leak empties it in 12 hours. Find the time taken to fill the tank with all three open."
            }
          ]
        }
      ]
    }
  ];

  // 3. Process each track and topics into DB
  for (const track of additionalPillarsTracks) {
    // Upsert track
    let trackRes = await pool.query(
      "SELECT id FROM tracks WHERE slug = $1 OR name = $2",
      [track.slug, track.name]
    );

    let trackId;
    if (trackRes.rows.length === 0) {
      const newTrack = await pool.query(
        "INSERT INTO tracks (name, slug, description) VALUES ($1, $2, $3) RETURNING id",
        [track.name, track.slug, track.description]
      );
      trackId = newTrack.rows[0].id;
    } else {
      trackId = trackRes.rows[0].id;
      await pool.query(
        "UPDATE tracks SET name = $1, slug = $2, description = $3 WHERE id = $4",
        [track.name, track.slug, track.description, trackId]
      );
    }

    // Link track to Node.js Backend Developer path
    await pool.query(
      "DELETE FROM path_tracks WHERE path_id = $1 AND track_id = $2",
      [pathId, trackId]
    );
    await pool.query(
      "INSERT INTO path_tracks (path_id, track_id, track_order) VALUES ($1, $2, $3)",
      [pathId, trackId, track.trackOrder]
    );

    // Clear old track_topics for clean re-linking
    await pool.query("DELETE FROM track_topics WHERE track_id = $1", [trackId]);

    let topicOrder = 1;
    for (const topic of track.topics) {
      let topicRes = await pool.query(
        "SELECT id FROM topics WHERE slug = $1 OR name = $2",
        [topic.slug, topic.name]
      );

      let topicId;
      if (topicRes.rows.length === 0) {
        const newTopic = await pool.query(
          `INSERT INTO topics (name, slug, description, theory_summary, doc_links, video_links, practice_items) 
           VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb) 
           RETURNING id`,
          [
            topic.name,
            topic.slug,
            topic.description,
            topic.theory_summary,
            JSON.stringify(topic.doc_links),
            JSON.stringify(topic.video_links),
            JSON.stringify(topic.practice_items),
          ]
        );
        topicId = newTopic.rows[0].id;
      } else {
        topicId = topicRes.rows[0].id;
        await pool.query(
          `UPDATE topics 
           SET name = $1, slug = $2, description = $3, theory_summary = $4, 
               doc_links = $5::jsonb, video_links = $6::jsonb, practice_items = $7::jsonb 
           WHERE id = $8`,
          [
            topic.name,
            topic.slug,
            topic.description,
            topic.theory_summary,
            JSON.stringify(topic.doc_links),
            JSON.stringify(topic.video_links),
            JSON.stringify(topic.practice_items),
            topicId,
          ]
        );
      }

      // Link topic to track
      await pool.query(
        "INSERT INTO track_topics (track_id, topic_id, topic_order) VALUES ($1, $2, $3)",
        [trackId, topicId, topicOrder]
      );

      // Seed resources table entries
      await pool.query("DELETE FROM resources WHERE topic_id = $1", [topicId]);
      await pool.query(
        `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          topicId,
          `${topic.name} Core Documentation & Notes`,
          topic.doc_links[0]?.url || "https://developer.mozilla.org",
          "documentation",
          Math.round(topic.estimatedMinutes * 0.5),
        ]
      );
      if (topic.video_links[0]) {
        await pool.query(
          `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            topicId,
            topic.video_links[0].title,
            topic.video_links[0].url,
            "video",
            Math.round(topic.estimatedMinutes * 0.5),
          ]
        );
      }

      topicOrder++;
    }
    console.log(`✅ Seeded track '${track.name}' with ${track.topics.length} authentic topics.`);
  }

  console.log("🎉 Complete 4-Pillar Seeding for Node.js Backend Developer finished successfully!");
};

if (require.main === module) {
  seedCompletePillars()
    .then(() => pool.end())
    .catch((err) => {
      console.error("Seeding error:", err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedCompletePillars };
