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

const seedDsaBatch29 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 29 (Lectures 281–290) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 29 Topics (Lectures 281–290)
  const batch29Topics = [
    // =========================================================================
    // SUBTRACK: Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions (Topics 281–283)
    // =========================================================================
    {
      order: 281,
      name: "Odd-Parity Modulo Reduction (nums[i] % 2): Count Number of Nice Subarrays",
      slug: "dsa-count-number-of-nice-subarrays-sliding-window",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=j_QOv9OT9Og",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`nums\` and an integer \`k\`, a continuous subarray is called **Nice** if there are **exactly \`k\` odd numbers** in it. Return the total number of Nice subarrays.

### 💡 Key Takeaways
- **Reducing "Count k Odd Numbers" to "Binary Subarrays With Sum k" (Topic 280!):**
  - Why write a brand-new algorithm when we can map every element \`nums[i]\` to **\`nums[i] % 2\`**?
    - Every **odd number** satisfies \`nums[i] % 2 == 1\`.
    - Every **even number** satisfies \`nums[i] % 2 == 0\`.
  - Under this \`0/1\` mapping, a subarray has **exactly \`k\` odd numbers** if and only if the **sum of \`(nums[i] % 2)\` in that subarray equals \`k\`**!
- **Applying the \`atMost(k) - atMost(k - 1)\` Two-Pointer Engine:**
  - Instead of allocating an extra array or \`O(N)\` hash map, use our \`countAtMost(nums, k)\` function from *Binary Subarrays With Sum*:
    - When expanding \`r\`: add **\`sum += (nums[r] % 2)\`**.
    - When shrinking \`l\` (\`while (sum > goal)\`): subtract **\`sum -= (nums[l] % 2)\`** and advance \`l++\`.
    - Add \`cnt += (r - l + 1)\`.
  - Return **\`countAtMost(nums, k) - countAtMost(nums, k - 1)\`**!
- **Complexity:** **\`O(2 * 2N) = O(N)\`** Time and **\`O(1)\`** Space!

### 💻 Count Number of Nice Subarrays Blueprint
\`\`\`cpp
int countAtMostOdds(const vector<int> &nums, int goal) {
    if (goal < 0) return 0;

    int l = 0, r = 0, sum = 0, cnt = 0;
    while (r < nums.size()) {
        // Odd numbers contribute 1, even numbers contribute 0
        sum += (nums[r] % 2);

        while (sum > goal) {
            sum -= (nums[l] % 2);
            l++;
        }

        cnt += (r - l + 1);
        r++;
    }
    return cnt;
}

int numberOfSubarrays(vector<int> &nums, int k) {
    return countAtMostOdds(nums, k) - countAtMostOdds(nums, k - 1);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Mutating the Input Array \`nums[i] = nums[i] % 2\` Unnecessarily:** You don't need to modify the caller's array! Simply evaluate \`(nums[r] % 2)\` and \`(nums[l] % 2)\` on the fly inside the sliding window loop.`),
      practiceItems: [
        {
          title: "LeetCode 1248: Count Number of Nice Subarrays",
          url: "https://leetcode.com/problems/count-number-of-nice-subarrays/",
          difficulty: "Medium",
          description: "Given an array of integers nums and an integer k, return the number of continuous subarrays that contain exactly k odd numbers."
        },
        {
          title: "LeetCode 930: Binary Subarrays With Sum",
          url: "https://leetcode.com/problems/binary-subarrays-with-sum/",
          difficulty: "Medium",
          description: "Review the underlying Binary Subarray Sum engine that powers Nice Subarrays via modulo-2 transformation."
        },
        {
          title: "GeeksforGeeks: Count Subarray with k odds",
          url: "https://www.geeksforgeeks.org/problems/count-subarray-with-k-odds/1",
          difficulty: "Medium",
          description: "Count the number of contiguous subarrays having exactly k odd numbers in O(N) time and O(1) space."
        }
      ]
    },

    {
      order: 282,
      name: "Exact-Cardinality Subtraction (atMost(k) - atMost(k - 1)): Subarrays With K Different Integers",
      slug: "dsa-subarrays-with-k-different-integers-sliding-window",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=7wYGbV_LsX4",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`nums\` and an integer \`k\`, return the **number of contiguous subarrays** where the number of **different (distinct) integers** in the subarray is **exactly \`k\`**.

### 💡 Key Takeaways (Brute O(N²) → Optimal O(2N) Subtraction)
- **Why Standard Single-Pass Sliding Window Misses Valid Subarrays for \`== k\`:**
  - When \`[l ... r]\` has \`k\` distinct integers and \`r\` moves right to another duplicate of an existing number, shrinking \`l\` would miss subarrays with the new \`r\`, while advancing \`r\` without shrinking \`l\` misses shorter valid subarrays inside \`[l ... r]\`!
- **The Monotonic Reduction (\`atMostK(nums, k) - atMostK(nums, k - 1)\`):**
  - If a window \`[l ... r]\` has **at most \`k\` distinct integers** (\`mpp.size() <= k\`), then **every single sub-window ending at \`r\` (\`[l ... r], [l + 1 ... r], ..., [r ... r]\`) ALSO has at most \`k\` distinct integers**!
  - That gives us **\`r - l + 1\` valid subarrays ending at \`r\`** in one step!
  - Subtracting the count of subarrays with \`<= k - 1\` distinct integers from the count of subarrays with \`<= k\` distinct integers leaves **only subarrays with EXACTLY \`k\` distinct integers**:
    **\`ans = atMostK(nums, k) - atMostK(nums, k - 1)\`**!
- **Complexity:** **\`O(2 * 2N) = O(N)\`** Time and **\`O(N)\`** Space for the frequency hash map.

### 💻 Subarrays With K Different Integers Blueprint
\`\`\`cpp
int countAtMostKDistinct(const vector<int> &nums, int k) {
    if (k <= 0) return 0;

    int l = 0, r = 0, cnt = 0;
    unordered_map<int, int> mpp;

    while (r < nums.size()) {
        mpp[nums[r]]++;

        // Shrink from left until distinct count is <= k
        while (mpp.size() > k) {
            mpp[nums[l]]--;
            if (mpp[nums[l]] == 0) {
                mpp.erase(nums[l]);
            }
            l++;
        }

        // All (r - l + 1) subarrays ending at r within [l .. r] have <= k distinct elements!
        cnt += (r - l + 1);
        r++;
    }
    return cnt;
}

int subarraysWithKDistinct(vector<int> &nums, int k) {
    return countAtMostKDistinct(nums, k) - countAtMostKDistinct(nums, k - 1);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using \`if (mpp.size() > k)\` Instead of \`while (mpp.size() > k)\` in Counting Problems:** The single-step \`if\` trick is **only for Longest Subarray (\`maxLen\`)** problems! When **counting** subarrays via \`cnt += (r - l + 1)\`, the window \`[l ... r]\` must be 100% valid on every iteration, so you **must use \`while (mpp.size() > k)\`**!`),
      practiceItems: [
        {
          title: "LeetCode 992: Subarrays with K Different Integers",
          url: "https://leetcode.com/problems/subarrays-with-k-different-integers/",
          difficulty: "Hard",
          description: "Given an integer array nums and an integer k, return the number of good subarrays of nums that contain exactly k different integers."
        },
        {
          title: "LeetCode 2461: Maximum Sum of Distinct Subarrays With Length K",
          url: "https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/",
          difficulty: "Medium",
          description: "Maintain a frequency map over a sliding window to enforce distinct element counts."
        },
        {
          title: "GeeksforGeeks: Subarrays with K Different Integers",
          url: "https://www.geeksforgeeks.org/problems/subarrays-with-k-different-integers/1",
          difficulty: "Hard",
          description: "Find the number of subarrays with exactly K distinct elements using the two-pointer subtraction trick."
        }
      ]
    },

    {
      order: 283,
      name: "Pre-Inserted Frequency Deficit Contraction: Minimum Window Substring",
      slug: "dsa-minimum-window-substring-sliding-window",
      subtrack: "Module 40: Sliding Window & Two-Pointer Algorithms: Fixed Windows, Variable Windows & Exact-Count Reductions",
      videoUrl: "https://www.youtube.com/watch?v=WJaij9ffOIY",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given two strings \`s\` (length \`N\`) and \`t\` (length \`M\`), find and return the **minimum length substring in \`s\`** that contains **all characters of \`t\` (including their duplicate counts)**. If no such substring exists, return \`""\`.

### 💡 Key Takeaways (Pattern 4: Expand to Satisfy, Shrink to Minimize!)
- **The Pre-Inserted \`hash[256]\` + \`cnt\` Trick (\`O(1)\` Validity Check):**
  1. **Pre-insert \`t\`:** Create \`int hash[256] = {0};\` and for each character \`c\` in \`t\`, increment **\`hash[c]++\`**.
     - Now, a **positive value (\`hash[c] > 0\`)** means we **still need** character \`c\` from \`t\`!
  2. **Expand \`r\` (\`0\` to \`N - 1\`):**
     - Before decrementing \`hash[s[r]]\`, check: **\`if (hash[s[r]] > 0) cnt++;\`** (meaning \`s[r]\` was a required character from \`t\`!).
     - Then decrement **\`hash[s[r]]--\`** (extra occurrences or characters not in \`t\` go negative in \`hash[]\`).
  3. **Shrink \`l\` While Window Is Valid (\`while (cnt == m)\`):**
     - Whenever **\`cnt == m\`**, the window \`[l ... r]\` contains all \`m\` characters of \`t\`!
     - If \`r - l + 1 < minLen\`, update \`minLen = r - l + 1\` and record **\`sIndex = l\`**.
     - Now try to shrink from the left to see if we can get an even smaller valid window:
       - Put \`s[l]\` back into \`hash\`: **\`hash[s[l]]++\`**.
       - If **\`hash[s[l]] > 0\`** after incrementing, we just lost a required character of \`t\`—so decrement **\`cnt--\`**!
       - Advance \`l++\`.
  4. Return \`(sIndex == -1) ? "" : s.substr(sIndex, minLen)\`.
- **Complexity:** **\`O(2N + M)\`** Time and **\`O(256) = O(1)\`** Space.

### 💻 Minimum Window Substring Blueprint
\`\`\`cpp
string minWindow(string s, string t) {
    int n = s.size(), m = t.size();
    if (n == 0 || m == 0 || n < m) return "";

    int hash[256] = {0};
    // 1. Pre-insert all characters of t into the frequency table
    for (int i = 0; i < m; i++) {
        hash[t[i]]++;
    }

    int l = 0, r = 0, cnt = 0;
    int minLen = 1e9, sIndex = -1;

    while (r < n) {
        // 2. If s[r] has a positive count, it fulfills one needed character from t
        if (hash[s[r]] > 0) {
            cnt++;
        }
        hash[s[r]]--;

        // 3. Once all m characters of t are matched, shrink from left to minimize window!
        while (cnt == m) {
            if (r - l + 1 < minLen) {
                minLen = r - l + 1;
                sIndex = l;
            }

            hash[s[l]]++;
            // If hash[s[l]] becomes strictly positive (> 0), we lost a needed character of t!
            if (hash[s[l]] > 0) {
                cnt--;
            }
            l++;
        }
        r++;
    }

    return (sIndex == -1) ? "" : s.substr(sIndex, minLen);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Checking \`if (hash[s[l]] == 0)\` Instead of \`if (hash[s[l]] > 0)\` When Shrinking:** Unneeded characters (or extra duplicates of needed characters) have negative values in \`hash[]\` (e.g., \`-2 -> -1 -> 0\`). A character's removal only breaks the \`t\` requirement when its deficit in \`hash[s[l]]\` becomes **strictly greater than \`0\` (\`> 0\`)**!`),
      practiceItems: [
        {
          title: "LeetCode 76: Minimum Window Substring",
          url: "https://leetcode.com/problems/minimum-window-substring/",
          difficulty: "Hard",
          description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window."
        },
        {
          title: "LeetCode 567: Permutation in String",
          url: "https://leetcode.com/problems/permutation-in-string/",
          difficulty: "Medium",
          description: "Return true if s2 contains a substring of length s1.size() that is a permutation of s1."
        },
        {
          title: "GeeksforGeeks: Smallest window in a string containing all the characters of another string",
          url: "https://www.geeksforgeeks.org/problems/smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1",
          difficulty: "Hard",
          description: "Find the smallest window in string S having all characters of pattern P."
        }
      ]
    },

    // =========================================================================
    // SUBTRACK: Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling (Topics 284–290)
    // =========================================================================
    {
      order: 284,
      name: "Sorted Two-Pointer Greedy Matching: Assign Cookies",
      slug: "dsa-assign-cookies-greedy-algorithm",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=DIX2p7vb9co",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You have \`N\` children with greed factors \`g[i]\` and \`M\` cookies with sizes \`s[j]\`. Child \`i\` is content if assigned a cookie \`j\` with **\`s[j] >= g[i]\`**, and each child can receive at most 1 cookie. Maximize the number of content children.

### 💡 Key Takeaways
- **The Core Greedy Principle — Don't Waste Large Cookies on Small Greeds!**
  - If a child only needs a cookie of size \`1\`, giving them a huge cookie of size \`4\` wastes the \`4\` cookie that could have satisfied a hungrier child!
  - Instead, satisfy each child using the **smallest available cookie that meets their greed \`s[l] >= g[r]\`**!
- **Sorting + Two Pointers (\`O(N log N + M log M + M)\` Time, \`O(1)\` Space):**
  1. Sort both \`g\` (greed) and \`s\` (cookie sizes) in ascending order.
  2. Place pointer \`l = 0\` on cookies \`s\` and pointer \`r = 0\` on children \`g\`.
  3. Loop **\`while (l < m && r < n)\`**:
     - If **\`s[l] >= g[r]\`**: Cookie \`l\` satisfies child \`r\`! Move to the next child: **\`r++\`**.
     - Regardless of whether cookie \`l\` was used or was too small for \`g[r]\` (and therefore too small for all subsequent children too!), move to the next cookie: **\`l++\`**.
  4. Return **\`r\`** (the exact number of children satisfied!).

### 💻 Assign Cookies Blueprint
\`\`\`cpp
int findContentChildren(vector<int> &g, vector<int> &s) {
    int n = g.size(), m = s.size();
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());

    int l = 0; // Pointer over cookie sizes 's'
    int r = 0; // Pointer over children greed 'g'

    while (l < m && r < n) {
        if (s[l] >= g[r]) {
            r++; // Child r is satisfied; advance to next child!
        }
        l++; // Move to the next cookie in all cases
    }
    return r;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Looping \`while (l < m)\` Without Checking \`r < n\`:** If there are more cookies than children (\`m > n\`) and all \`n\` children get satisfied early, \`g[r]\` will read out of bounds (\`g[n]\`) if you don't include **\`&& r < n\`** in the \`while\` condition!`),
      practiceItems: [
        {
          title: "LeetCode 455: Assign Cookies",
          url: "https://leetcode.com/problems/assign-cookies/",
          difficulty: "Easy",
          description: "Maximize the number of content children by assigning at most one cookie of size s[j] >= g[i] to each child."
        },
        {
          title: "LeetCode 2410: Maximum Matching of Players With Trainers",
          url: "https://leetcode.com/problems/maximum-matching-of-players-with-trainers/",
          difficulty: "Medium",
          description: "Apply the exact same sorted two-pointer greedy matching to pair players with trainers."
        },
        {
          title: "LeetCode 826: Most Profit Assigning Work",
          url: "https://leetcode.com/problems/most-profit-assigning-work/",
          difficulty: "Medium",
          description: "Sort jobs and workers to greedily assign the most profitable feasible job to each worker."
        }
      ]
    },

    {
      order: 285,
      name: "Cumulative Waiting-Time Minimization: Shortest Job First (SJF) CPU Scheduling",
      slug: "dsa-shortest-job-first-sjf-cpu-scheduling-greedy",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=3-QbX1iDbXs",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`bt\` of \`N\` process execution (burst) times where **all processes arrive at time \`0\`**, compute the **floor of the average waiting time** across all \`N\` processes under the **Shortest Job First (SJF)** scheduling policy.

### 💡 Key Takeaways
- **Why Executing the Shortest Jobs First Minimizes Total Waiting Time:**
  - The execution time of the \`1st\` job gets added to the waiting time of **all \`N - 1\` subsequent jobs**!
  - Therefore, to make the cumulative waiting time as small as possible, we must **sort \`bt\` in ascending order** and run the shortest jobs first!
- **Tracking \`t\` (Current Clock Time) and \`wtTime\` (Total Waiting Time):**
  1. Sort \`bt\` in ascending order (\`O(N log N)\`).
  2. Initialize \`t = 0\` and \`wtTime = 0\`.
  3. For each process \`i\` from \`0\` to \`N - 1\`:
     - Process \`i\` starts at time \`t\`, so it waited \`t\` units of time: **\`wtTime += t;\`**
     - Process \`i\` runs for \`bt[i]\` units, advancing the clock: **\`t += bt[i];\`**
  4. Return **\`wtTime / N\`**!
- **Complexity:** \`O(N log N + N)\` Time and \`O(1)\` Space.

### 💻 Shortest Job First (SJF) Blueprint
\`\`\`cpp
long long solveSJF(vector<int> &bt) {
    int n = bt.size();
    // 1. Sort burst times in ascending order so shortest jobs execute first
    sort(bt.begin(), bt.end());

    long long t = 0;      // Tracks current elapsed CPU clock time
    long long wtTime = 0; // Tracks sum of waiting times of all processes

    for (int i = 0; i < n; i++) {
        wtTime += t;  // Process i waited 't' units before starting
        t += bt[i];   // Advance CPU clock by process i's burst time
    }

    return wtTime / n;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Swapping the Order of \`wtTime += t\` and \`t += bt[i]\`:** The very first job (\`i = 0\`) starts immediately at \`t = 0\` (\`0\` waiting time). If you add \`t += bt[i]\` *before* \`wtTime += t\`, you compute **turnaround time** (completion time) instead of **waiting time**!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Shortest Job first",
          url: "https://www.geeksforgeeks.org/problems/shortest-job-first/1",
          difficulty: "Medium",
          description: "Given an array of burst times of N processes all arriving at time 0, calculate the average waiting time using Shortest Job First scheduling."
        },
        {
          title: "LeetCode 1834: Single-Threaded CPU",
          url: "https://leetcode.com/problems/single-threaded-cpu/",
          difficulty: "Medium",
          description: "Extend Shortest Job First scheduling to tasks with variable arrival times using a Min-Heap."
        },
        {
          title: "LeetCode 1701: Average Waiting Time",
          url: "https://leetcode.com/problems/average-waiting-time/",
          difficulty: "Medium",
          description: "Simulate cumulative timer and waiting time calculations across sequential tasks."
        }
      ]
    },

    {
      order: 286,
      name: "Smaller-Denomination Preservation: Lemonade Change",
      slug: "dsa-lemonade-change-greedy-algorithm",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=n_tmibEhO6Q",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
At a lemonade stand, each lemonade costs **\`5\`**. Customers stand in a queue and pay with a **\`5\`**, **\`10\`**, or **\`20\`** bill. You start with \`0\` change in hand and must serve customers **in the exact order they arrive**. Return \`true\` if you can give every customer correct change, or \`false\` otherwise.

### 💡 Key Takeaways
- **Why We Don't Even Need a \`twenty\` Counter:**
  - You never give a \`20\` bill back as change (the maximum change ever owed is \`15\`), so you only need two integer counters: **\`five = 0\` and \`ten = 0\`**!
- **The Greedy Choice on a \`20\` Bill (Always Spend \`10 + 5\` Before \`5 + 5 + 5\`!):**
  - When a customer pays with **\`5\`**: \`five++\`.
  - When a customer pays with **\`10\`**: We owe \`5\`. If \`five > 0\`, \`five--, ten++\`; else \`return false\`.
  - When a customer pays with **\`20\`**: We owe \`15\`. There are two ways to make \`15\`:
    1. **One \`10\` + One \`5\` (\`if (ten > 0 && five > 0)\`)**
    2. **Three \`5\`s (\`else if (five >= 3)\`)**
  - **Why MUST we try \`10 + 5\` first?** Because a \`5\` bill is **more versatile** than a \`10\` bill (a \`5\` bill can make change for *both* \`10\` and \`20\`, whereas a \`10\` bill can *only* make change for \`20\`). Greedily spending the \`10\` bill first preserves our precious \`5\` bills for future \`10\`-bill customers!
- **Complexity:** \`O(N)\` Time and \`O(1)\` Space.

### 💻 Lemonade Change Blueprint
\`\`\`cpp
bool lemonadeChange(vector<int> &bills) {
    int five = 0, ten = 0;

    for (int bill : bills) {
        if (bill == 5) {
            five++;
        } else if (bill == 10) {
            if (five > 0) {
                five--;
                ten++;
            } else {
                return false;
            }
        } else { // bill == 20 (owe 15 in change)
            // Greedily use 10 + 5 first to save 5-dollar bills!
            if (ten > 0 && five > 0) {
                ten--;
                five--;
            } else if (five >= 3) {
                five -= 3;
            } else {
                return false;
            }
        }
    }
    return true;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Sorting the \`bills\` Array:** Unlike Assign Cookies or SJF, customers arrive in a **strict queue order**—you cannot sort \`bills\`!
- **Checking \`if (five >= 3)\` Before \`if (ten > 0 && five > 0)\`:** Spending three \`5\`s when you have a \`10\` available leaves you with no \`5\`s when the next customer hands you a \`10\`!`),
      practiceItems: [
        {
          title: "LeetCode 860: Lemonade Change",
          url: "https://leetcode.com/problems/lemonade-change/",
          difficulty: "Easy",
          description: "Each lemonade costs 5. Customers pay with 5, 10, or 20 bills in order. Return true if you can provide every customer with correct change."
        },
        {
          title: "GeeksforGeeks: Lemonade Change",
          url: "https://www.geeksforgeeks.org/problems/lemonade-change/1",
          difficulty: "Medium",
          description: "Determine if all customers in a queue can be given exact change from an initially empty register."
        },
        {
          title: "LeetCode 2244: Minimum Rounds to Complete All Tasks",
          url: "https://leetcode.com/problems/minimum-rounds-to-complete-all-tasks/",
          difficulty: "Medium",
          description: "Practice greedy denomination selection (preferring 3s over 2s)."
        }
      ]
    },

    {
      order: 287,
      name: "Farthest-Reachable Horizon Tracking: Jump Game I",
      slug: "dsa-jump-game-i-greedy-reachability",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=tZAa_jJ3SwQ",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`nums\` of size \`N\`, you start at index \`0\`, and \`nums[i]\` represents the **maximum jump length** from index \`i\`. Determine if you can reach the last index \`N - 1\`.

### 💡 Key Takeaways
- **Observation 1: If There Are No \`0\`s in \`nums\`, You Can Always Reach the End!**
  - Every positive integer \`>= 1\` lets you step forward at least 1 index. The only thing that can ever trap you is landing on a **\`0\` that no earlier jump can leap over**!
- **Observation 2: Track \`maxIndex\` (The Farthest Index Reachable So Far):**
  - Initialize \`maxIndex = 0\`.
  - Loop \`i\` from \`0\` to \`N - 1\`:
    1. **Unreachable Check (\`if (i > maxIndex) return false;\`):**
       - If our current index \`i\` is **strictly greater than \`maxIndex\`**, it means **no jump from any earlier index \`0 .. i - 1\` was able to reach \`i\`**! Immediately return \`false\`.
    2. **Horizon Update:** Otherwise, index \`i\` is reachable, and from \`i\` we can reach up to \`i + nums[i]\`—so update **\`maxIndex = max(maxIndex, i + nums[i])\`**.
  - If the loop completes (or as soon as \`maxIndex >= N - 1\`), return \`true\`!
- **Complexity:** \`O(N)\` Time and \`O(1)\` Space.

### 💻 Jump Game I Blueprint
\`\`\`cpp
bool canJump(vector<int> &nums) {
    int maxIndex = 0;
    int n = nums.size();

    for (int i = 0; i < n; i++) {
        // If current index i is beyond the farthest reachable horizon, we are stuck!
        if (i > maxIndex) {
            return false;
        }
        maxIndex = max(maxIndex, i + nums[i]);

        // Optional early exit once the last index is within reach
        if (maxIndex >= n - 1) return true;
    }
    return true;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Updating \`maxIndex\` Before Checking \`if (i > maxIndex)\`:** You can only jump from index \`i\` **if you were able to reach index \`i\` in the first place**! Always check \`if (i > maxIndex) return false;\` at the very top of the loop.`),
      practiceItems: [
        {
          title: "LeetCode 55: Jump Game",
          url: "https://leetcode.com/problems/jump-game/",
          difficulty: "Medium",
          description: "You are initially positioned at the array's first index, and each element represents your maximum jump length at that position. Return true if you can reach the last index."
        },
        {
          title: "LeetCode 1306: Jump Game III",
          url: "https://leetcode.com/problems/jump-game-iii/",
          difficulty: "Medium",
          description: "Check if you can reach any index with value 0 when jumping i + arr[i] or i - arr[i]."
        },
        {
          title: "GeeksforGeeks: Minimum Jumps (Reachability)",
          url: "https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1",
          difficulty: "Medium",
          description: "Determine if the end of the array is reachable and find the minimum jumps."
        }
      ]
    },

    {
      order: 288,
      name: "Level-Range BFS Horizon Expansion: Jump Game II (Minimum Jumps in O(N))",
      slug: "dsa-jump-game-ii-minimum-jumps-greedy",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=7SBVnw7GSTk",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`nums\` of length \`N\` (where it is guaranteed you can reach \`N - 1\`), return the **minimum number of jumps** required to reach the last index \`N - 1\`.

### 💡 Progression (Recursion O(N^N) → Memoization DP O(N²) → Optimal Range-Greedy O(N))
- **Why DP Takes \`O(N²)\` Time:**
  - Memoizing \`f(ind)\` explores every jump \`1 .. nums[ind]\` from every index \`ind\`.
- **The Optimal \`O(N)\` Range-Expansion Idea (\`[l ... r]\` Window per Jump):**
  - Instead of tracking individual indices recursively, track the **contiguous range \`[l ... r]\` of indices reachable in \`jumps\` jumps**!
  - Initially, with \`jumps = 0\`, we are at range **\`l = 0, r = 0\`**.
  - Loop **\`while (r < n - 1)\`** (until our reachable range covers the last index \`n - 1\`):
    1. Scan \`i\` across the current range **\`[l ... r]\`** to find the **farthest index** any element in \`[l ... r]\` can reach in 1 more jump:
       **\`farthest = max(farthest, i + nums[i]);\`**
    2. Advance to the **next jump's range**:
       - **\`l = r + 1;\`** (starts right after the old range).
       - **\`r = farthest;\`** (ends at the farthest reachable index).
       - **\`jumps++;\`**
  - Return \`jumps\`!
- **Why Is This \`O(N)\` and Not \`O(N²)\`?**
  - Because the ranges \`[0..0], [1..r1], [r1+1..r2], ...\` are completely **disjoint**—every index \`i\` in the array is visited **at most once**!

### 💻 Jump Game II (O(N) Range-Greedy) Blueprint
\`\`\`cpp
int jump(vector<int> &nums) {
    int n = nums.size();
    int jumps = 0;
    int l = 0, r = 0;

    // Expand reachable range [l .. r] until r reaches or passes n - 1
    while (r < n - 1) {
        int farthest = 0;
        for (int i = l; i <= r; i++) {
            farthest = max(farthest, i + nums[i]);
        }
        l = r + 1;
        r = farthest;
        jumps++;
    }
    return jumps;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Writing \`while (r < n)\` Instead of \`while (r < n - 1)\`:** Our goal is to reach the last index **\`n - 1\`**! If \`n == 1\` (we start at index \`0\`, which is already \`n - 1\`), \`r < n - 1\` (\`0 < 0\`) is false and rightly returns \`0\` jumps, whereas \`r < n\` would take an unnecessary extra jump!`),
      practiceItems: [
        {
          title: "LeetCode 45: Jump Game II",
          url: "https://leetcode.com/problems/jump-game-ii/",
          difficulty: "Medium",
          description: "Return the minimum number of jumps to reach nums[n - 1] in O(N) time and O(1) space."
        },
        {
          title: "LeetCode 1326: Minimum Number of Taps to Open to Water a Garden",
          url: "https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/",
          difficulty: "Hard",
          description: "Convert tap intervals into farthest right-reach jumps and apply Jump Game II's range expansion."
        },
        {
          title: "LeetCode 1024: Video Stitching",
          url: "https://leetcode.com/problems/video-stitching/",
          difficulty: "Medium",
          description: "Find the minimum number of clips needed to cover [0, time] using greedy range expansion."
        }
      ]
    },

    {
      order: 289,
      name: "Descending-Profit Latest-Slot Allocation: Job Sequencing Problem",
      slug: "dsa-job-sequencing-problem-greedy-algorithm",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=QbwltemZbRg",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given \`N\` jobs where each job has an \`id\`, a \`deadline\` (1-based day index), and a \`profit\`. Every job takes **1 single day** to complete, and only 1 job can be scheduled per day. Maximize the **total profit** and return \`{countJobs, totalProfit}\`.

### 💡 Key Takeaways
- **The Two-Part Greedy Strategy:**
  1. **Sort Jobs by \`profit\` in Descending Order:** Always consider the highest-paying jobs first!
  2. **Schedule Each Job on the LATEST Possible Free Day (\`<= deadline\`):**
     - Why schedule a job with \`deadline = 4\` on **Day \`4\`** instead of Day \`1\`?
     - Because performing it on Day \`4\` leaves Days \`1, 2, 3\` **open for other jobs that might have tighter deadlines** (\`deadline = 1, 2, 3\`)!
- **Slot Array Implementation (\`O(N log N + N * maxDeadline)\` Time):**
  - Find \`maxDeadline\` across all jobs and create \`vector<int> slot(maxDeadline + 1, -1)\`.
  - For each job \`i\` in sorted profit order:
    - Scan **\`j\` backwards from \`arr[i].dead\` down to \`1\`**:
      - If **\`slot[j] == -1\`** (Day \`j\` is free!):
        - Assign \`slot[j] = arr[i].id\`, increment \`countJobs++\`, add \`totalProfit += arr[i].profit\`, and **\`break\`**!
- *(Interview Bonus Note: In competitive programming, the inner backward loop \`j\` can be optimized from \`O(maxDeadline)\` to \`O(1)\` amortized using Disjoint Set Union (DSU)!)*

### 💻 Job Sequencing Problem Blueprint
\`\`\`cpp
struct Job {
    int id;
    int dead;
    int profit;
};

static bool comparison(Job a, Job b) {
    return (a.profit > b.profit); // Sort by profit descending!
}

pair<int, int> JobScheduling(Job arr[], int n) {
    // 1. Sort all jobs in descending order of profit
    sort(arr, arr + n, comparison);

    // 2. Find the maximum deadline to size our timeline slot array
    int maxi = arr[0].dead;
    for (int i = 1; i < n; i++) {
        maxi = max(maxi, arr[i].dead);
    }

    // 1-based day slots (days 1 .. maxi); -1 means the day is free
    vector<int> slot(maxi + 1, -1);

    int countJobs = 0, jobProfit = 0;

    // 3. Greedily assign each job to the LATEST available day <= its deadline
    for (int i = 0; i < n; i++) {
        for (int j = arr[i].dead; j > 0; j--) {
            if (slot[j] == -1) {
                slot[j] = arr[i].id;
                countJobs++;
                jobProfit += arr[i].profit;
                break; // Job scheduled; move to next job!
            }
        }
    }

    return {countJobs, jobProfit};
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Looping \`j\` Down to \`0\` (\`j >= 0\`) on 1-Based Deadlines:** On GeeksforGeeks and standard problem statements, a deadline of \`1\` means the job can only be performed on **Day \`1\`** (not Day \`0\`!). Always loop \`for (int j = arr[i].dead; j > 0; j--)\` so each job gets at most \`dead\` slots (\`1 .. dead\`).`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Job Sequencing Problem",
          url: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",
          difficulty: "Medium",
          description: "Given a set of N jobs where each job has a deadline and profit associated with it, find the number of jobs done and the maximum profit."
        },
        {
          title: "LeetCode 630: Course Schedule III",
          url: "https://leetcode.com/problems/course-schedule-iii/",
          difficulty: "Hard",
          description: "Schedule courses with durations and deadlines to maximize the number of completed courses."
        },
        {
          title: "LeetCode 1235: Maximum Profit in Job Scheduling",
          url: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
          difficulty: "Hard",
          description: "Contrast unit-duration deadline scheduling (Greedy) with variable-duration interval profit scheduling (DP + Binary Search)."
        }
      ]
    },

    {
      order: 290,
      name: "Earliest-End-Time Interval Scheduling: N Meetings in One Room",
      slug: "dsa-n-meetings-in-one-room-greedy-interval-scheduling",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=mKfhTotEguk",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You have **1 meeting room** and \`N\` meetings with start times \`start[i]\` and end times \`end[i]\`. Only one meeting can be held in the room at a time, and a new meeting can start **only if its start time is strictly greater than the end time of the previous meeting (\`start[i] > freeTime\`)**. Maximize the number of meetings held (and optionally return their original \`1\`-based meeting numbers).

### 💡 Key Takeaways
- **Why Sorting by END Time (Not Start Time or Duration!) Is Optimal:**
  - Suppose Meeting A runs \`[0, 5]\` while Meeting B runs \`[1, 2]\` and Meeting C runs \`[3, 4]\`.
  - If we greedily pick the meeting that **finishes as early as possible** (\`[1, 2]\`), the meeting room becomes **free as early as possible** (\`freeTime = 2\`), leaving maximum time for future meetings!
- **Algorithm Steps (\`O(N log N + 2N)\` Time, \`O(3N)\` Space):**
  1. Pack each meeting into a struct \`Meeting { int start, end, pos; }\` and **sort by \`end\` time ascending**.
  2. Pick the first meeting: \`count = 1\`, **\`freeTime = arr[0].end\`**, and push \`arr[0].pos\` into \`order\`.
  3. Loop \`i\` from \`1\` to \`N - 1\`:
     - If **\`arr[i].start > freeTime\`**:
       - Increment \`count++\`.
       - Update **\`freeTime = arr[i].end\`**.
       - Push \`arr[i].pos\` into \`order\`.

### 💻 N Meetings in One Room Blueprint
\`\`\`cpp
struct Meeting {
    int start;
    int end;
    int pos;
};

static bool comp(Meeting m1, Meeting m2) {
    if (m1.end < m2.end) return true;
    else if (m1.end > m2.end) return false;
    else if (m1.pos < m2.pos) return true;
    return false;
}

int maxMeetings(int start[], int end[], int n) {
    vector<Meeting> arr(n);
    for (int i = 0; i < n; i++) {
        arr[i].start = start[i];
        arr[i].end = end[i];
        arr[i].pos = i + 1;
    }

    // 1. Sort meetings by earliest end time!
    sort(arr.begin(), arr.end(), comp);

    // 2. Always schedule the first meeting that finishes earliest
    int count = 1;
    int freeTime = arr[0].end;
    vector<int> order = {arr[0].pos};

    // 3. Greedily pick subsequent compatible meetings
    for (int i = 1; i < n; i++) {
        if (arr[i].start > freeTime) {
            count++;
            freeTime = arr[i].end;
            order.push_back(arr[i].pos);
        }
    }
    return count;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Sorting by \`start\` Time Instead of \`end\` Time:** A meeting that starts at \`t = 0\` (\`[0, 100]\`) can occupy the room all day and block 10 shorter meetings! Always sort by **\`end\` time ascending**.
- **Strict vs. Non-Strict Boundary (\`>\` vs \`>=\`):** In GeeksforGeeks *N Meetings in One Room*, the start time of a meeting cannot equal the end time of the previous meeting (\`arr[i].start > freeTime\`). On LeetCode 435 (*Non-overlapping Intervals*), touching endpoints \`[1, 2]\` and \`[2, 3]\` are allowed (\`arr[i].start >= freeTime\`). Always check the problem's boundary rule!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: N meetings in one room",
          url: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",
          difficulty: "Easy",
          description: "Find the maximum number of meetings that can be accommodated in a single meeting room when start and end times are given."
        },
        {
          title: "LeetCode 646: Maximum Length of Pair Chain",
          url: "https://leetcode.com/problems/maximum-length-of-pair-chain//",
          difficulty: "Medium",
          description: "Sort pairs by their second element (end time) to greedily form the longest chain of non-overlapping pairs."
        },
        {
          title: "LeetCode 435: Non-overlapping Intervals",
          url: "https://leetcode.com/problems/non-overlapping-intervals/",
          difficulty: "Medium",
          description: "Find the minimum number of intervals to remove to make the rest non-overlapping (N - maxNonOverlappingMeetings!)."
        }
      ]
    },
  ];

  console.log("\n📦 Upserting 10 Batch 29 Topics into 'topics' table...");
  const topicIdMap = {};

  for (const t of batch29Topics) {
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

  // 4. Link Topics to Track in 'track_topics' Table with sequential topic_order (281 to 290)
  console.log("\n🔄 Linking Batch 29 topics to 'problem-solving-dsa-sql' (orders 281..290)...");
  for (const t of batch29Topics) {
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

  console.log("\n🎉 DSA Batch 29 (Lectures 281–290) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch29()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch29;
