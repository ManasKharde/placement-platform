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

const seedDsaBatch31 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 31 (Lectures 301–315) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 15 Expressive Batch 31 Topics (Lectures 301–315)
  const batch31Topics = [
    // =========================================================================
    // SUBTRACK: Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations (Topics 301–310)
    // =========================================================================
    {
      order: 301,
      name: "Monotonic Decreasing Stack (Light-Pole Intuition): Next Greater Element I",
      slug: "dsa-next-greater-element-i-monotonic-stack",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=e7XQLtOQM3I",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`arr\` of size \`N\`, for every element \`arr[i]\`, find its **Next Greater Element (NGE)**—the **first element to the right of \`arr[i]\`** that is strictly greater than \`arr[i]\` (or \`-1\` if no such element exists).

### 💡 Key Takeaways (Brute O(N²) → Optimal Monotonic Stack O(2N))
- **What Is a Monotonic Stack?**
  - A stack that maintains its elements in a **strictly specific order** (either strictly increasing or strictly decreasing from bottom to top).
- **The Light-Pole Intuition (Why We Traverse Backwards N - 1 down to 0):**
  - To know the first greater element to the **right** of \`arr[i]\`, we must already know the elements to its right—so we traverse **from right to left (\`N - 1\` down to \`0\`)**!
  - Imagine each number is a **light pole of height \`arr[i]\`**. When standing at \`arr[i]\` looking right, any shorter or equal poles (\`<= arr[i]\`) immediately to the right are **blocked from view** by \`arr[i]\` for all future elements to the left!
  - Therefore, while \`!st.empty() && st.top() <= arr[i]\`, **pop \`st.top()\`**!
  - After popping all \`<= arr[i]\` elements:
    - If \`st.empty()\`, \`nge[i] = -1\`; else **\`nge[i] = st.top()\`**.
    - Push \`arr[i]\` onto \`st\`.
- **Why Is Time Complexity O(2N) and Not O(N²)?**
  - The outer \`for\` loop runs \`N\` times, and each element is pushed onto \`st\` once and can be popped **at most once** across the entire run (\`<= N\` total pops)!

### 💻 Next Greater Element Blueprint
\`\`\`cpp
vector<int> nextGreaterElement(vector<int> &arr) {
    int n = arr.size();
    vector<int> nge(n, -1);
    stack<int> st;

    // Traverse backwards from right to left (n - 1 down to 0)
    for (int i = n - 1; i >= 0; i--) {
        // Pop all elements smaller than or equal to arr[i] (maintain decreasing order)
        while (!st.empty() && st.top() <= arr[i]) {
            st.pop();
        }

        if (st.empty()) {
            nge[i] = -1;
        } else {
            nge[i] = st.top();
        }

        st.push(arr[i]);
    }
    return nge;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using < Instead of <= in \`while (!st.empty() && st.top() <= arr[i])\`:** We need the next **strictly greater** element! If \`st.top() == arr[i]\` and you don't pop it, \`nge[i]\` will falsely be set to \`arr[i]\` itself!`),
      practiceItems: [
        {
          title: "LeetCode 496: Next Greater Element I",
          url: "https://leetcode.com/problems/next-greater-element-i/",
          difficulty: "Easy",
          description: "Find the next greater element for each element of nums1 in nums2 using a monotonic decreasing stack and a hash map."
        },
        {
          title: "GeeksforGeeks: Next Greater Element",
          url: "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1",
          difficulty: "Medium",
          description: "Given an array arr of size N, find the next greater element for each element of the array in order of their appearance."
        },
        {
          title: "LeetCode 739: Daily Temperatures",
          url: "https://leetcode.com/problems/daily-temperatures/",
          difficulty: "Medium",
          description: "Store indices in a monotonic decreasing stack to find how many days you have to wait until a warmer temperature."
        }
      ]
    },

    {
      order: 302,
      name: "Virtual Array Doubling & Modulo Indexing: Next Greater Element II (Circular Array)",
      slug: "dsa-next-greater-element-ii-circular-array",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=7PrncD7v9YQ",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a **circular integer array** \`arr\` of size \`N\` (where the element after \`arr[N - 1]\` wraps around to \`arr[0]\`), find the **Next Greater Element** for every index \`0 .. N - 1\`.

### 💡 Key Takeaways (Brute O(N²) → Optimal Virtual Doubling O(4N))
- **How to Handle Circular Wrap-Around Without Allocating a 2N Array:**
  - Mentally append a copy of \`arr\` to the end of \`arr\` so the virtual array has length **\`2 * N\`** (indices \`0\` to \`2 * N - 1\`).
  - How do we access virtual index \`i\` (\`0 <= i < 2 * N\`) in the original array of size \`N\`? Using the **modulo operator: \`arr[i % N]\`**!
- **Algorithm Steps (O(4N) Time, O(2N) Space):**
  1. Loop \`i\` backwards from **\`2 * N - 1\` down to \`0\`**:
  2. Pop elements \`<= arr[i % N]\`: \`while (!st.empty() && st.top() <= arr[i % N]) st.pop();\`.
  3. **Only record answers when \`i < N\`:**
     - \`if (i < N) nge[i] = st.empty() ? -1 : st.top();\`
  4. Push \`st.push(arr[i % N]);\`.
- **Why O(4N) Time?** The outer loop runs \`2N\` times (\`2N\` pushes) and the \`while\` loop pops at most \`2N\` elements total (\`2N + 2N = 4N\`).

### 💻 Next Greater Element II (Circular Array) Blueprint
\`\`\`cpp
vector<int> nextGreaterElementsCircular(vector<int> &nums) {
    int n = nums.size();
    vector<int> nge(n, -1);
    stack<int> st;

    // Traverse hypothetical doubled array from 2*n - 1 down to 0
    for (int i = 2 * n - 1; i >= 0; i--) {
        while (!st.empty() && st.top() <= nums[i % n]) {
            st.pop();
        }

        // Only populate nge[i] when i is in the actual array range [0 .. n - 1]
        if (i < n) {
            nge[i] = st.empty() ? -1 : st.top();
        }

        st.push(nums[i % n]);
    }
    return nge;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Writing \`nge[i % n] = ...\` Without \`if (i < n)\`:** While overwriting \`nge[i % n]\` during the first half \`2N - 1 .. N\` and then overwriting it again during \`N - 1 .. 0\` happens to produce the same final result, wrapping the assignment in \`if (i < n)\` avoids \`N\` wasted array writes!`),
      practiceItems: [
        {
          title: "LeetCode 503: Next Greater Element II",
          url: "https://leetcode.com/problems/next-greater-element-ii/",
          difficulty: "Medium",
          description: "Given a circular integer array nums, return the next greater number for every element in nums."
        },
        {
          title: "GeeksforGeeks: Next Greater Element in Circular Array",
          url: "https://www.geeksforgeeks.org/problems/next-greater-element-2/1",
          difficulty: "Medium",
          description: "Find the next greater element for each element in a circular array in O(N) time."
        },
        {
          title: "LeetCode 1019: Next Greater Node In Linked List",
          url: "https://leetcode.com/problems/next-greater-node-in-linked-list/",
          difficulty: "Medium",
          description: "Apply monotonic decreasing stack logic to find the next greater node value for each node in a linked list."
        }
      ]
    },

    {
      order: 303,
      name: "Monotonic Increasing Stack: Previous Smaller Element (Nearest Smaller Element on Left)",
      slug: "dsa-previous-smaller-element-monotonic-stack",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=zMdbdGJNlh4",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`arr\` of size \`N\`, for every element \`arr[i]\`, find its **Previous Smaller Element (PSE / Nearest Smaller Element on the Left)**—the first element to the **left** of \`arr[i]\` that is strictly smaller than \`arr[i]\` (or \`-1\` if none exists).

### 💡 Key Takeaways (The 4-Variant Monotonic Stack Matrix)
- **How PSE Differs From NGE:**
  1. **Direction of Traversal (Left to Right: 0 .. N - 1):** Because we want the nearest smaller element on the **left**, we traverse forward from \`0\` to \`N - 1\` so left elements are already in the stack!
  2. **Monotonic Increasing Order (\`st.top() >= arr[i]\`):** Any element on the left that is **\`>= arr[i]\`** can never be the nearest smaller element for \`arr[i]\` *or* for any future element to the right (since \`arr[i]\` is both smaller and closer!). So we pop while **\`!st.empty() && st.top() >= arr[i]\`**!
- **Master Reference Table for All 4 Monotonic Stack Variants:**
  - **Next Greater (NGE):** Traverse \`N - 1 → 0\`, pop \`st.top() <= arr[i]\` (Decreasing Stack).
  - **Previous Greater (PGE):** Traverse \`0 → N - 1\`, pop \`st.top() <= arr[i]\` (Decreasing Stack).
  - **Next Smaller (NSE):** Traverse \`N - 1 → 0\`, pop \`st.top() >= arr[i]\` (Increasing Stack).
  - **Previous Smaller (PSE):** Traverse \`0 → N - 1\`, pop \`st.top() >= arr[i]\` (Increasing Stack).
- **Complexity:** \`O(2N)\` Time and \`O(N)\` Space.

### 💻 Previous Smaller Element Blueprint
\`\`\`cpp
vector<int> previousSmallerElement(vector<int> &arr) {
    int n = arr.size();
    vector<int> pse(n, -1);
    stack<int> st;

    // Traverse forward from left to right (0 to n - 1)
    for (int i = 0; i < n; i++) {
        // Pop all elements greater than or equal to arr[i] (maintain increasing order)
        while (!st.empty() && st.top() >= arr[i]) {
            st.pop();
        }

        pse[i] = st.empty() ? -1 : st.top();
        st.push(arr[i]);
    }
    return pse;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Traversing Backwards for Previous Smaller Element:** Always match your loop direction to the side you are querying: query **Left (Previous)** → loop **\`0\` to \`N - 1\`**; query **Right (Next)** → loop **\`N - 1\` down to \`0\`**!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Smallest number on left (Previous Smaller Element)",
          url: "https://www.geeksforgeeks.org/problems/smallest-number-on-left3403/1",
          difficulty: "Medium",
          description: "Given an array a of integers of length n, find the nearest smaller number for every element such that the smaller element is on the left side."
        },
        {
          title: "LeetCode 1475: Final Prices With a Special Discount in a Shop",
          url: "https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/",
          difficulty: "Easy",
          description: "Use a monotonic increasing stack to find the nearest smaller or equal price to the right for each item."
        },
        {
          title: "LeetCode 84: Largest Rectangle in Histogram",
          url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
          difficulty: "Hard",
          description: "Combine Previous Smaller Element (PSE) and Next Smaller Element (NSE) to bound each histogram bar's width."
        }
      ]
    },

    {
      order: 304,
      name: "Prefix/Suffix Envelopes vs. Converging Two Pointers: Trapping Rainwater",
      slug: "dsa-trapping-rainwater-two-pointers",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=1_5VuquLbXg",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`arr\` of \`N\` non-negative integers representing building heights of width \`1\`, compute the **total units of rainwater trapped** between the buildings after it rains.

### 💡 Progression (Prefix/Suffix Max O(2N) Space → Optimal Two-Pointer O(1) Space)
- **The Per-Building Water Formula:**
  - Water can sit on top of building \`i\` **if and only if** there is a taller building somewhere on its left (\`leftMax\`) AND a taller building somewhere on its right (\`rightMax\`).
  - The water level at \`i\` is bottlenecked by the **smaller** of those two tallest walls:
    **\`water[i] = min(leftMax[i], rightMax[i]) - arr[i]\`**!
- **1. Approach 1 — Prefix Max & Suffix Max Arrays (\`O(3N)\` Time, \`O(2N)\` Space):**
  - Precompute \`prefixMax[i] = max(prefixMax[i - 1], arr[i])\` and \`suffixMax[i] = max(suffixMax[i + 1], arr[i])\`, then sum \`min(prefixMax[i], suffixMax[i]) - arr[i]\`.
- **2. Approach 2 — Optimal Converging Two Pointers (\`O(N)\` Time, \`O(1)\` Space!):**
  - Why do we need *both* \`leftMax\` and \`rightMax\` if only the **smaller** one determines the water height?
  - Maintain \`l = 0, r = n - 1\`, \`lMax = 0, rMax = 0\`, and \`total = 0\`.
  - Loop **\`while (l < r)\`** and always process the **shorter building (\`if (arr[l] <= arr[r])\`)**:
    - **If \`arr[l] <= arr[r]\`:** We are 100% certain there is a building on the right (\`arr[r]\`) at least as tall as \`arr[l]\` (and also \`>= lMax\`, because we only ever advance the smaller pointer!). So water at \`l\` depends **solely on \`lMax\`**:
      - If \`lMax > arr[l]\`, add **\`total += lMax - arr[l]\`**; else update **\`lMax = arr[l]\`**.
      - Advance **\`l++\`**.
    - **Else (\`arr[r] < arr[l]\`):** Water at \`r\` depends **solely on \`rMax\`**:
      - If \`rMax > arr[r]\`, add **\`total += rMax - arr[r]\`**; else update **\`rMax = arr[r]\`**.
      - Advance **\`r--\`**.

### 💻 Trapping Rainwater (Optimal O(N) Time, O(1) Space) Blueprint
\`\`\`cpp
int trap(vector<int> &arr) {
    int n = arr.size();
    int l = 0, r = n - 1;
    int lMax = 0, rMax = 0, total = 0;

    while (l < r) {
        // Always process the smaller boundary first!
        if (arr[l] <= arr[r]) {
            if (lMax > arr[l]) {
                total += lMax - arr[l];
            } else {
                lMax = arr[l];
            }
            l++;
        } else {
            if (rMax > arr[r]) {
                total += rMax - arr[r];
            } else {
                rMax = arr[r];
            }
            r--;
        }
    }
    return total;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Comparing \`if (lMax <= rMax)\` without advancing the smaller bar \`arr[l] <= arr[r]\`:** Comparing \`arr[l] <= arr[r]\` guarantees that the opposite pointer's current bar (\`arr[r]\`) is a real physical wall at least as tall as \`lMax\`!`),
      practiceItems: [
        {
          title: "LeetCode 42: Trapping Rain Water",
          url: "https://leetcode.com/problems/trapping-rain-water/",
          difficulty: "Hard",
          description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining."
        },
        {
          title: "LeetCode 11: Container With Most Water",
          url: "https://leetcode.com/problems/container-with-most-water/",
          difficulty: "Medium",
          description: "Use converging two pointers moving the shorter boundary inward to maximize water area between two lines."
        },
        {
          title: "GeeksforGeeks: Trapping Rain Water",
          url: "https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1",
          difficulty: "Hard",
          description: "Compute the total volume of trapped rainwater across N elevation bars in O(N) time and O(1) space."
        }
      ]
    },

    {
      order: 305,
      name: "Element-Contribution Technique & Duplicate Asymmetry (NSE vs PSEE): Sum of Subarray Minimums",
      slug: "dsa-sum-of-subarray-minimums-monotonic-stack",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=v0e8p9JCgRc",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`arr\` of \`N\` integers, find the **sum of the minimum elements of all possible contiguous subarrays** of \`arr\`, modulo \`10^9 + 7\`.

### 💡 Key Takeaways (Brute O(N²) → Optimal Contribution Technique O(5N))
- **Counting How Many Subarrays Have \`arr[i]\` as Their Minimum:**
  - Suppose for index \`i\`, the **Previous Smaller Element** is at index \`pse[i]\` (or \`-1\` if none) and the **Next Smaller Element** is at index \`nse[i]\` (or \`N\` if none).
  - Then \`arr[i]\` is the minimum element for any subarray that starts in \`[pse[i] + 1 ... i]\` and ends in \`[i ... nse[i] - 1]\`.
  - Number of left choices: **\`left = i - pse[i]\`**.
  - Number of right choices: **\`right = nse[i] - i\`**.
  - Total subarrays where \`arr[i]\` is minimum = **\`left * right\`**, contributing **\`(left * right * arr[i]) % MOD\`** to the total sum!
- **The Critical Duplicate Edge Case (NSE vs. PSEE — Why One Side Must Include =!):**
  - What if \`arr = [1, 1]\`? If both \`PSE\` and \`NSE\` look for *strictly* smaller elements, then for index \`0\`, \`[1, 1]\` is counted, AND for index \`1\`, \`[1, 1]\` is counted **again**!
  - **The Fix:** Break ties asymmetrically!
    - **\`findNSE\` (Next Smaller Element):** Stop at **strictly smaller** elements (pop \`>=\`, so equals are included on the right).
    - **\`findPSEE\` (Previous Smaller OR EQUAL Element):** Stop at **smaller OR equal** elements (pop only strictly \`>\`, so equals are **not** extended to the left!).

### 💻 Sum of Subarray Minimums Blueprint
\`\`\`cpp
vector<int> findNSE(const vector<int> &arr) {
    int n = arr.size();
    vector<int> nse(n);
    stack<int> st;
    for (int i = n - 1; i >= 0; i--) {
        // Pop >= so we stop only at a STRICTLY smaller element on the right
        while (!st.empty() && arr[st.top()] >= arr[i]) {
            st.pop();
        }
        nse[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    return nse;
}

vector<int> findPSEE(const vector<int> &arr) {
    int n = arr.size();
    vector<int> psee(n);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        // Pop strictly > so we stop at a smaller OR EQUAL element on the left!
        while (!st.empty() && arr[st.top()] > arr[i]) {
            st.pop();
        }
        psee[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    return psee;
}

int sumSubarrayMins(vector<int> &arr) {
    int n = arr.size();
    vector<int> nse = findNSE(arr);
    vector<int> psee = findPSEE(arr);
    long long total = 0;
    long long mod = 1e9 + 7;

    for (int i = 0; i < n; i++) {
        long long left = i - psee[i];
        long long right = nse[i] - i;
        total = (total + (left * right % mod) * arr[i] % mod) % mod;
    }
    return (int)total;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using >= in Both findNSE and findPSEE (or > in Both):**
  - Using \`>=\` in both **misses** duplicate subarrays like \`[1, 1]\`.
  - Using \`>\` in both **double-counts** duplicate subarrays like \`[1, 1]\`.
  - Always use **\`>=\` in \`findNSE\`** and **\`>\` in \`findPSEE\`**!`),
      practiceItems: [
        {
          title: "LeetCode 907: Sum of Subarray Minimums",
          url: "https://leetcode.com/problems/sum-of-subarray-minimums/",
          difficulty: "Medium",
          description: "Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr, modulo 10^9 + 7."
        },
        {
          title: "LeetCode 2104: Sum of Subarray Ranges",
          url: "https://leetcode.com/problems/sum-of-subarray-ranges/",
          difficulty: "Medium",
          description: "Extend Sum of Subarray Minimums to compute Sum of Subarray Maximums - Sum of Subarray Minimums."
        },
        {
          title: "LeetCode 1856: Maximum Subarray Min-Product",
          url: "https://leetcode.com/problems/maximum-subarray-min-product/",
          difficulty: "Medium",
          description: "Use PSE and NSE boundaries for each element to maximize (element * sum of subarray where element is minimum)."
        }
      ]
    },

    {
      order: 306,
      name: "Linearity of Max-Min Contributions: Sum of Subarray Ranges",
      slug: "dsa-sum-of-subarray-ranges-monotonic-stack",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=gIrMptNPf5M",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
The **range** of a subarray is the difference between the **largest** and **smallest** element in that subarray (\`max(subarray) - min(subarray)\`). Given an integer array \`nums\`, return the **sum of all subarray ranges** of \`nums\`.

### 💡 Key Takeaways (Brute O(N²) → Optimal Decomposition O(N))
- **Algebraic Decomposition Into Two Independent Sums:**
  - Summing \`(max(sub) - min(sub))\` across every subarray \`sub\` can be split by linearity of summation into:
    **\`Sum of All Subarray Ranges = (Sum of Subarray Maximums) - (Sum of Subarray Minimums)\`**!
- **How to Compute Both in O(N) Time:**
  1. **\`sumSubarrayMins(nums)\`:** Uses \`findNSE\` (\`>=\`) and \`findPSEE\` (\`>\`) from Topic 305.
  2. **\`sumSubarrayMaxs(nums)\`:** Uses the exact mirror functions:
     - **\`findNGE\` (Next Greater Element):** Pop \`<=\` (\`arr[st.top()] <= arr[i]\`).
     - **\`findPGEE\` (Previous Greater OR Equal Element):** Pop strictly \`<\` (\`arr[st.top()] < arr[i]\`).
  3. Return **\`sumSubarrayMaxs(nums) - sumSubarrayMins(nums)\`** (using \`long long\` without modulo, as required by LeetCode 2104)!

### 💻 Sum of Subarray Ranges Blueprint
\`\`\`cpp
long long sumSubarrayMins(const vector<int> &arr) {
    int n = arr.size();
    vector<int> nse(n), psee(n);
    stack<int> st;

    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && arr[st.top()] >= arr[i]) st.pop();
        nse[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    while (!st.empty()) st.pop();

    for (int i = 0; i < n; i++) {
        while (!st.empty() && arr[st.top()] > arr[i]) st.pop();
        psee[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }

    long long total = 0;
    for (int i = 0; i < n; i++) {
        total += 1LL * (i - psee[i]) * (nse[i] - i) * arr[i];
    }
    return total;
}

long long sumSubarrayMaxs(const vector<int> &arr) {
    int n = arr.size();
    vector<int> nge(n), pgee(n);
    stack<int> st;

    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && arr[st.top()] <= arr[i]) st.pop();
        nge[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    while (!st.empty()) st.pop();

    for (int i = 0; i < n; i++) {
        while (!st.empty() && arr[st.top()] < arr[i]) st.pop();
        pgee[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }

    long long total = 0;
    for (int i = 0; i < n; i++) {
        total += 1LL * (i - pgee[i]) * (nge[i] - i) * arr[i];
    }
    return total;
}

long long subArrayRanges(vector<int> &nums) {
    return sumSubarrayMaxs(nums) - sumSubarrayMins(nums);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Applying Modulo 10^9 + 7 on LeetCode 2104:** Unlike LeetCode 907 (which asks for modulo \`10^9 + 7\`), LeetCode 2104 asks for the exact \`long long\` 64-bit integer sum! Always check the return type of the problem.`),
      practiceItems: [
        {
          title: "LeetCode 2104: Sum of Subarray Ranges",
          url: "https://leetcode.com/problems/sum-of-subarray-ranges/",
          difficulty: "Medium",
          description: "The range of a subarray of nums is the difference between the largest and smallest element in the subarray. Return the sum of all subarray ranges of nums."
        },
        {
          title: "LeetCode 907: Sum of Subarray Minimums",
          url: "https://leetcode.com/problems/sum-of-subarray-minimums/",
          difficulty: "Medium",
          description: "Compute the sumSubarrayMins component of Sum of Subarray Ranges."
        },
        {
          title: "GeeksforGeeks: Sum of Subarray Ranges",
          url: "https://www.geeksforgeeks.org/problems/sum-of-subarray-ranges/1",
          difficulty: "Medium",
          description: "Calculate the sum of (max - min) over all contiguous subarrays in O(N) time."
        }
      ]
    },

    {
      order: 307,
      name: "Directional Collision Simulation: Asteroid Collision",
      slug: "dsa-asteroid-collision-stack-simulation",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=_eYGqw_VDR4",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`asteroids\` where \`abs(asteroids[i])\` is the size and the sign (\`+\` = moving right, \`-\` = moving left) is the direction, simulate all collisions:
- When two asteroids collide, the **smaller one explodes**.
- If both are the **exact same size, BOTH explode**.
- Two asteroids moving in the same direction (or a left-moving asteroid on the left and a right-moving asteroid on the right, \`<-\` and \`->\`) **never collide**!

### 💡 Key Takeaways
- **Why Use a \`vector<int> st\` Instead of \`std::stack<int>\`:**
  - \`vector<int>\` supports \`.push_back()\`, \`.pop_back()\`, and \`.back()\` in \`O(1)\` time just like a stack, **and** can be returned directly at the end without needing to pop and reverse!
- **The 3 Cases for an Incoming Asteroid \`arr[i]\`:**
  - **If \`arr[i] > 0\` (Moving Right):** It can never collide with anything currently on its left → **\`st.push_back(arr[i])\`**.
  - **Else (\`arr[i] < 0\`, Moving Left):**
    1. **Destroy Smaller Right-Moving Asteroids:**
       \`while (!st.empty() && st.back() > 0 && st.back() < abs(arr[i])) st.pop_back();\`
    2. **Equal Size Mutual Destruction:**
       \`if (!st.empty() && st.back() == abs(arr[i])) st.pop_back();\` (both \`st.back()\` and \`arr[i]\` are destroyed!).
    3. **Surviving Negative Asteroid:**
       \`else if (st.empty() || st.back() < 0) st.push_back(arr[i]);\` (if the stack is now empty OR its top is also negative, \`arr[i]\` survives and joins \`st\`!).
- **Complexity:** \`O(2N)\` Time and \`O(N)\` Space.

### 💻 Asteroid Collision Blueprint
\`\`\`cpp
vector<int> asteroidCollision(vector<int> &arr) {
    vector<int> st; // Using vector as a stack to return directly in left-to-right order

    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] > 0) {
            st.push_back(arr[i]);
        } else {
            // 1. Destroy all smaller right-moving (positive) asteroids on top of stack
            while (!st.empty() && st.back() > 0 && st.back() < abs(arr[i])) {
                st.pop_back();
            }

            // 2. If equal-sized right-moving asteroid is on top, both explode!
            if (!st.empty() && st.back() == abs(arr[i])) {
                st.pop_back();
            }
            // 3. Negative asteroid only survives if stack is empty or top is also negative!
            else if (st.empty() || st.back() < 0) {
                st.push_back(arr[i]);
            }
        }
    }
    return st;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Colliding When \`st.back() < 0\` and \`arr[i] > 0\`:** If \`st.back()\` is \`-5\` (moving **left** \`<-\`) and \`arr[i]\` is \`+10\` (moving **right** \`->\`), they are moving **away from each other** and NEVER collide! Collisions ONLY happen when \`st.back() > 0\` (\`->\`) and \`arr[i] < 0\` (\`<-\`).`),
      practiceItems: [
        {
          title: "LeetCode 735: Asteroid Collision",
          url: "https://leetcode.com/problems/asteroid-collision/",
          difficulty: "Medium",
          description: "Find out the state of the asteroids after all collisions. Positive means moving right, negative means moving left."
        },
        {
          title: "LeetCode 2211: Count Collisions on a Road",
          url: "https://leetcode.com/problems/count-collisions-on-a-road/",
          difficulty: "Medium",
          description: "Simulate directional L, R, and S car collisions along a 1D road."
        },
        {
          title: "GeeksforGeeks: Asteroid Collision",
          url: "https://www.geeksforgeeks.org/problems/asteroid-collision/1",
          difficulty: "Medium",
          description: "Simulate all asteroid collisions and return the surviving asteroids in order."
        }
      ]
    },

    {
      order: 308,
      name: "Single-Pass On-The-Fly PSE/NSE Resolution: Largest Rectangle in Histogram",
      slug: "dsa-largest-rectangle-in-histogram-monotonic-stack",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=Bzat9vgD0fs",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array \`heights\` of \`N\` bars (each of width \`1\`), find the **area of the largest rectangle** that can be formed within the histogram.

### 💡 Progression (2-Pass Precomputed PSE/NSE O(5N) → Optimal 1-Pass On-the-Fly O(2N))
- **1. Approach 1 — Precomputing \`PSE[]\` and \`NSE[]\` Arrays (\`O(5N)\` Time, \`O(4N)\` Space):**
  - A bar of height \`arr[i]\` can expand left until \`pse[i]\` and right until \`nse[i]\`.
  - Its width is **\`nse[i] - pse[i] - 1\`**, giving area **\`arr[i] * (nse[i] - pse[i] - 1)\`**.
- **2. Approach 2 — Optimal Single-Pass On-the-Fly Stack (\`O(2N)\` Time, \`O(N)\` Space!):**
  - How do we know **both** \`pse\` and \`nse\` in a single pass without precomputing arrays?
  - Maintain a **monotonic increasing stack** of indices.
  - When we are at index \`i\` and see **\`arr[st.top()] > arr[i]\`**, we have to **pop \`element = st.top()\`**:
    1. **Who knocked \`element\` out of the stack?** The current index **\`i\`**! That means **\`nse = i\`** is the **Next Smaller Element** of \`element\`!
    2. **Who is sitting directly below \`element\` in the stack after \`element\` is popped?** Its **Previous Smaller Element** (\`pse = st.empty() ? -1 : st.top()\`)!
    3. Compute area for \`element\` immediately while popping:
       **\`maxArea = max(maxArea, arr[element] * (nse - pse - 1))\`**!
  - **Post-Loop Cleanup (\`while (!st.empty())\`):**
    - Any indices still left in \`st\` after the loop ends had **no smaller element on the right**—so their **\`nse = n\`** and their \`pse = st.empty() ? -1 : st.top()\`!

### 💻 Largest Rectangle in Histogram (Optimal 1-Pass) Blueprint
\`\`\`cpp
int largestRectangleArea(vector<int> &arr) {
    int n = arr.size();
    stack<int> st;
    int maxArea = 0;

    for (int i = 0; i < n; i++) {
        // When arr[i] is smaller than arr[st.top()], arr[i] is the NSE of st.top()!
        while (!st.empty() && arr[st.top()] > arr[i]) {
            int element = st.top();
            st.pop();

            int nse = i;
            int pse = st.empty() ? -1 : st.top();

            maxArea = max(maxArea, arr[element] * (nse - pse - 1));
        }
        st.push(i);
    }

    // Cleanup remaining bars in stack (they have no NSE, so nse = n!)
    while (!st.empty()) {
        int nse = n;
        int element = st.top();
        st.pop();
        int pse = st.empty() ? -1 : st.top();

        maxArea = max(maxArea, arr[element] * (nse - pse - 1));
    }

    return maxArea;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Reading \`pse = st.top()\` BEFORE Calling \`st.pop()\`:** The element's \`pse\` is the index sitting **below** \`element\` in the stack! Always save \`int element = st.top();\`, call **\`st.pop()\` first**, and **then** read \`int pse = st.empty() ? -1 : st.top();\`!`),
      practiceItems: [
        {
          title: "LeetCode 84: Largest Rectangle in Histogram",
          url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
          difficulty: "Hard",
          description: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram."
        },
        {
          title: "LeetCode 85: Maximal Rectangle",
          url: "https://leetcode.com/problems/maximal-rectangle/",
          difficulty: "Hard",
          description: "Apply Largest Rectangle in Histogram across each row of a 2D binary matrix."
        },
        {
          title: "LeetCode 1793: Maximum Score of a Good Subarray",
          url: "https://leetcode.com/problems/maximum-score-of-a-good-subarray/",
          difficulty: "Hard",
          description: "Maximize min(subarray) * width containing index k using histogram-style expansion."
        }
      ]
    },

    {
      order: 309,
      name: "2D Prefix-Height Histogram Reduction: Maximal Rectangle in a Binary Matrix",
      slug: "dsa-maximal-rectangle-in-binary-matrix-stack",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=ttVu6G7Ayik",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an \`N x M\` binary matrix filled with \`0\`s and \`1\`s, find the **area of the largest rectangle containing only \`1\`s**.

### 💡 Key Takeaways
- **Reducing Each Row to "Largest Rectangle in Histogram" (Topic 308!):**
  - If we treat each row \`i\` (\`0\` to \`N - 1\`) as the base of a histogram, the height of bar \`j\` on row \`i\` is simply the **number of consecutive \`1\`s stacked vertically above \`(i, j)\`**!
  - **Step 1 (Column-Wise Prefix Heights \`pSum[N][M]\`):**
    - For each column \`j\` (\`0\` to \`M - 1\`), maintain a running \`sum = 0\` down the rows \`i\` (\`0\` to \`N - 1\`):
      - If \`matrix[i][j] == 1\`, \`sum += 1\`.
      - If **\`matrix[i][j] == 0\`**, reset **\`sum = 0\`** (because a \`0\` at the base breaks the vertical bar of \`1\`s!).
      - Store \`pSum[i][j] = sum\`.
  - **Step 2 (Pass Each Row \`pSum[i]\` to \`largestRectangleArea\`):**
    - Loop \`i\` from \`0\` to \`N - 1\`: \`maxArea = max(maxArea, largestRectangleArea(pSum[i]))\`.
- **Complexity:** **\`O(N * M + N * 2M) = O(N * M)\`** Time and **\`O(N * M)\`** Space (or \`O(M)\` Space if updating a single 1D \`heights[M]\` row on the fly!).

### 💻 Maximal Rectangle Blueprint
\`\`\`cpp
int largestHist(const vector<int> &arr) {
    int n = arr.size();
    stack<int> st;
    int maxArea = 0;

    for (int i = 0; i < n; i++) {
        while (!st.empty() && arr[st.top()] > arr[i]) {
            int element = st.top();
            st.pop();
            int nse = i;
            int pse = st.empty() ? -1 : st.top();
            maxArea = max(maxArea, arr[element] * (nse - pse - 1));
        }
        st.push(i);
    }
    while (!st.empty()) {
        int nse = n;
        int element = st.top();
        st.pop();
        int pse = st.empty() ? -1 : st.top();
        maxArea = max(maxArea, arr[element] * (nse - pse - 1));
    }
    return maxArea;
}

int maximalRectangle(vector<vector<char>> &matrix) {
    if (matrix.empty()) return 0;
    int n = matrix.size(), m = matrix[0].size();
    vector<vector<int>> pSum(n, vector<int>(m, 0));

    // 1. Precompute vertical consecutive 1-heights column by column
    for (int j = 0; j < m; j++) {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            if (matrix[i][j] == '1') sum += 1;
            else sum = 0; // Reset height to 0 whenever base cell is '0'!
            pSum[i][j] = sum;
        }
    }

    // 2. Run Largest Rectangle in Histogram on each row
    int maxArea = 0;
    for (int i = 0; i < n; i++) {
        maxArea = max(maxArea, largestHist(pSum[i]));
    }
    return maxArea;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Doing a Standard Prefix Sum Without Resetting \`sum = 0\` on \`'0'\`:** If a column has \`['1', '0', '1']\`, the bar height at row 2 is **\`1\`** (not \`2\`!), because the \`'0'\` at row 1 breaks vertical contiguity!`),
      practiceItems: [
        {
          title: "LeetCode 85: Maximal Rectangle",
          url: "https://leetcode.com/problems/maximal-rectangle/",
          difficulty: "Hard",
          description: "Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area."
        },
        {
          title: "LeetCode 84: Largest Rectangle in Histogram",
          url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
          difficulty: "Hard",
          description: "Use the 1-pass O(2M) histogram solver as the row-level engine for Maximal Rectangle."
        },
        {
          title: "GeeksforGeeks: Max rectangle",
          url: "https://www.geeksforgeeks.org/problems/max-rectangle/1",
          difficulty: "Hard",
          description: "Find the maximum area of a rectangle formed only of 1s in the given binary matrix."
        }
      ]
    },

    {
      order: 310,
      name: "Lexicographical Prefix Minimization: Remove K Digits",
      slug: "dsa-remove-k-digits-monotonic-stack",
      subtrack: "Module 43: Monotonic Stack & Contribution Algorithms: Next/Previous Greater/Smaller, Rainwater & Subarray Aggregations",
      videoUrl: "https://www.youtube.com/watch?v=jmbuRzYPGrg",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`num\` representing a non-negative integer of length \`N\` and an integer \`k\`, remove **\`k\` digits** from \`num\` so that the new number is the **smallest possible** integer.

### 💡 Key Takeaways & The 3 Crucial Edge Cases
- **Greedy Intuition (Keep Smaller Digits at the Most Significant Left Positions!):**
  - In \`"1432219"\`, why is removing \`'4'\`, \`'3'\`, \`'2'\` (\`"1219"\`) optimal? Because replacing a larger digit (\`'4'\`) on the left with a smaller digit (\`'3'\`, then \`'2'\`) immediately reduces the most significant place values!
  - Traverse \`i\` from \`0\` to \`N - 1\` maintaining a **monotonic non-decreasing stack**:
    - **\`while (!st.empty() && k > 0 && st.top() > num[i]) { st.pop(); k--; }\`**
    - Push \`st.push(num[i])\`.
- **The 3 Mandatory Edge Cases to Handle:**
  1. **Edge Case 1 (\`k > 0\` Remaining After the Loop, e.g., \`"123456"\`):**
     - If the digits were already in increasing order, nothing got popped! Pop the remaining \`k\` largest digits from the top of the stack: **\`while (k > 0 && !st.empty()) { st.pop(); k--; }\`**.
  2. **Edge Case 2 (Empty Stack When \`k == N\`):**
     - If \`st.empty()\`, return **\`"0"\`**.
  3. **Edge Case 3 (Leading Zeros, e.g., \`"00100"\` → \`"100"\`, or \`"000"\` → \`"0"\`):**
     - When popping characters from \`st\` into \`res\` (in reverse order), strip all leading zeros (which sit at the **back of \`res\` before reversing**):
       \`while (!res.empty() && res.back() == '0') res.pop_back();\`
     - Reverse \`res\`, and if \`res.empty()\`, return \`"0"\`!
- **Complexity:** \`O(3N + K)\` Time and \`O(2N)\` Space.

### 💻 Remove K Digits Blueprint
\`\`\`cpp
string removeKdigits(string num, int k) {
    stack<char> st;

    for (char digit : num) {
        // Greedily pop larger preceding digits while we still have k removals left
        while (!st.empty() && k > 0 && (st.top() - '0') > (digit - '0')) {
            st.pop();
            k--;
        }
        st.push(digit);
    }

    // Edge Case 1: If k > 0 remains (e.g., "123456"), remove largest digits from the end
    while (k > 0 && !st.empty()) {
        st.pop();
        k--;
    }

    // Edge Case 2: All digits removed
    if (st.empty()) return "0";

    // Extract characters from stack (currently in reverse order)
    string res = "";
    while (!st.empty()) {
        res.push_back(st.top());
        st.pop();
    }

    // Edge Case 3: Strip leading zeros (which are at the back of 'res' before reversing!)
    while (!res.empty() && res.back() == '0') {
        res.pop_back();
    }

    reverse(res.begin(), res.end());
    if (res.empty()) return "0";
    return res;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Concatenating \`res = res + st.top()\` Inside a Loop on Large Strings:** On LeetCode 402 (\`N = 10^5\`), writing \`res = res + st.top()\` copies the entire string \`res\` on every iteration, causing \`O(N²)\` Time Limit Exceeded or Memory Limit Exceeded! Always use **\`res.push_back(st.top())\`** (\`O(1)\` amortized)!`),
      practiceItems: [
        {
          title: "LeetCode 402: Remove K Digits",
          url: "https://leetcode.com/problems/remove-k-digits/",
          difficulty: "Medium",
          description: "Given string num representing a non-negative integer num, and an integer k, return the smallest possible integer after removing k digits from num."
        },
        {
          title: "LeetCode 316: Remove Duplicate Letters",
          url: "https://leetcode.com/problems/remove-duplicate-letters/",
          difficulty: "Medium",
          description: "Use a monotonic increasing stack with remaining-count checks to produce the lexicographically smallest subsequence of unique characters."
        },
        {
          title: "LeetCode 1673: Find the Most Competitive Subsequence",
          url: "https://leetcode.com/problems/find-the-most-competitive-subsequence/",
          difficulty: "Medium",
          description: "Keep the smallest digits at the front using the exact same Remove (N - K) Digits monotonic stack!"
        }
      ]
    },

    // =========================================================================
    // SUBTRACK: Module 44: Advanced Stack, Monotonic Deque & Cache Design: Stock Span, Sliding Window Max, Celebrity & LRU/LFU Caches (Topics 311–315)
    // =========================================================================
    {
      order: 311,
      name: "Previous Greater Element (PGE) Stream Horizon: Online Stock Span Problem",
      slug: "dsa-online-stock-span-problem-monotonic-stack",
      subtrack: "Module 44: Advanced Stack, Monotonic Deque & Cache Design: Stock Span, Sliding Window Max, Celebrity & LRU/LFU Caches",
      videoUrl: "https://www.youtube.com/watch?v=eay-zoSRkVc",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Design a \`StockSpanner\` class where each call to \`next(int price)\` returns the **span** of the stock's price today—defined as the **maximum number of consecutive days** (starting from today and going backward) for which the stock price was **less than or equal to (\`<=\`)** today's price.

### 💡 Key Takeaways (Brute O(N²) → Optimal Monotonic PGE Stack O(2N) Total)
- **Reframing Stock Span as Previous Greater Element (PGE):**
  - What stops the consecutive backward streak of days with price \`<= today's price\`?
  - The **first day in the past whose price was STRICTLY GREATER than today's price (PGE)**!
  - Therefore, if today is at 0-based index \`ind\` and the **Previous Greater Element** sits at index \`pgeIndex\` (or \`-1\` if no previous day was strictly greater), then the number of consecutive valid days is simply:
    **\`span = ind - pgeIndex\`**!
- **Maintaining a Monotonic Decreasing Stack of \`{price, index}\`:**
  - Maintain \`stack<pair<int, int>> st\` and \`ind = -1\`.
  - On each \`next(val)\` call:
    1. Increment **\`ind++\`**.
    2. Pop all previous days with price **\`<= val\`**:
       \`while (!st.empty() && st.top().first <= val) st.pop();\`
    3. Compute \`ans = ind - (st.empty() ? -1 : st.top().second);\`.
    4. Push \`st.push({val, ind});\` and return \`ans\`.
- **Complexity:** **\`O(2N)\`** overall time across \`N\` calls to \`next()\` (**\`O(1)\` amortized per call**) and \`O(N)\` space.

### 💻 Online Stock Span Blueprint
\`\`\`cpp
class StockSpanner {
    stack<pair<int, int>> st; // Stores {price, dayIndex}
    int ind;

public:
    StockSpanner() {
        ind = -1;
    }

    int next(int val) {
        ind = ind + 1;

        // Pop all previous days whose price is <= today's price (find Previous Greater Element)
        while (!st.empty() && st.top().first <= val) {
            st.pop();
        }

        int pgeIndex = st.empty() ? -1 : st.top().second;
        int ans = ind - pgeIndex;

        st.push({val, ind});
        return ans;
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Pushing \`{val, ind}\` Onto the Stack BEFORE Computing \`ans\`:** If you push \`{val, ind}\` before reading \`st.top().second\`, \`st.top()\` will be \`{val, ind}\` itself instead of the Previous Greater Element! Always compute \`ans\` **before** \`st.push({val, ind})\`.`),
      practiceItems: [
        {
          title: "LeetCode 901: Online Stock Span",
          url: "https://leetcode.com/problems/online-stock-span/",
          difficulty: "Medium",
          description: "Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day."
        },
        {
          title: "GeeksforGeeks: Stock span problem",
          url: "https://www.geeksforgeeks.org/problems/stock-span-problem-1587115621/1",
          difficulty: "Medium",
          description: "Calculate the stock span (consecutive preceding days with price <= today's price) for all N days."
        },
        {
          title: "LeetCode 739: Daily Temperatures",
          url: "https://leetcode.com/problems/daily-temperatures/",
          difficulty: "Medium",
          description: "Compare looking for the Next Greater Element (Daily Temperatures) with the Previous Greater Element (Stock Span)."
        }
      ]
    },

    {
      order: 312,
      name: "Monotonic Decreasing Deque: Sliding Window Maximum in O(N)",
      slug: "dsa-sliding-window-maximum-monotonic-deque",
      subtrack: "Module 44: Advanced Stack, Monotonic Deque & Cache Design: Stock Span, Sliding Window Max, Celebrity & LRU/LFU Caches",
      videoUrl: "https://www.youtube.com/watch?v=NwBvene4Imo",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an integer array \`arr\` of size \`N\` and a sliding window of size \`k\`, return a list containing the **maximum element in each window of size \`k\`** as it slides from left to right (\`N - k + 1\` windows total).

### 💡 Key Takeaways (Brute O((N - K) * K) → Optimal Monotonic Deque O(2N))
- **Why We Need a Double-Ended Queue (\`std::deque<int> dq\`):**
  - We need **two operations simultaneously**:
    1. **Evict Out-of-Window Elements from the FRONT (\`dq.pop_front()\`):** When we are at index \`i\`, the current window covers \`[i - k + 1 ... i]\`. Any index **\`<= i - k\`** sitting at \`dq.front()\` has fallen out of the window!
    2. **Maintain Monotonic Decreasing Order from the BACK (\`dq.pop_back()\`):** Before pushing index \`i\` at the back, any smaller or equal elements **\`arr[dq.back()] <= arr[i]\`** inside the deque can never be the maximum of this or any future window—so pop them from the back!
  - Because \`dq\` is kept in **strictly decreasing order of values from front to back**, the **maximum element of the current window is ALWAYS sitting at \`arr[dq.front()]\`** in \`O(1)\` time!
- **Complexity:** **\`O(2N)\`** Time (each index is pushed once and popped at most once) and **\`O(K)\`** Auxiliary Space!

### 💻 Sliding Window Maximum (Monotonic Deque) Blueprint
\`\`\`cpp
vector<int> maxSlidingWindow(vector<int> &arr, int k) {
    int n = arr.size();
    deque<int> dq; // Stores indices in decreasing order of their array values
    vector<int> ans;

    for (int i = 0; i < n; i++) {
        // 1. Remove front index if it has fallen outside the current window [i - k + 1 .. i]
        if (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        // 2. Maintain monotonic decreasing order: pop smaller/equal elements from the back
        while (!dq.empty() && arr[dq.back()] <= arr[i]) {
            dq.pop_back();
        }

        // 3. Push current index i into the back of the deque
        dq.push_back(i);

        // 4. Once the first full window of size k is formed (i >= k - 1), record the front max!
        if (i >= k - 1) {
            ans.push_back(arr[dq.front()]);
        }
    }
    return ans;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Storing Values \`arr[i]\` Instead of Indices \`i\` in \`dq\`:** If you only store values in \`dq\`, you cannot tell when \`dq.front()\` has stepped outside the \`k\`-sized window (\`dq.front() <= i - k\`)! Always store **indices \`i\`** in \`dq\`.`),
      practiceItems: [
        {
          title: "LeetCode 239: Sliding Window Maximum",
          url: "https://leetcode.com/problems/sliding-window-maximum/",
          difficulty: "Hard",
          description: "You are given an array of integers nums and a sliding window of size k moving from left to right. Return the max sliding window."
        },
        {
          title: "LeetCode 1438: Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
          url: "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/",
          difficulty: "Medium",
          description: "Maintain both a max-deque and a min-deque simultaneously to track the window's max - min in O(1) time."
        },
        {
          title: "GeeksforGeeks: Maximum of all subarrays of size k",
          url: "https://www.geeksforgeeks.org/problems/maximum-of-all-subarrays-of-size-k3101/1",
          difficulty: "Medium",
          description: "Find the maximum element in every contiguous subarray of size k in O(N) time."
        }
      ]
    },

    {
      order: 313,
      name: "Pairwise Two-Pointer Elimination: The Celebrity Problem",
      slug: "dsa-the-celebrity-problem-two-pointer-elimination",
      subtrack: "Module 44: Advanced Stack, Monotonic Deque & Cache Design: Stock Span, Sliding Window Max, Celebrity & LRU/LFU Caches",
      videoUrl: "https://www.youtube.com/watch?v=cEadsbTeze4",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
In a party of \`N\` people (\`0\` to \`N - 1\`), a **Celebrity** is someone who is **known by everyone else** (\`N - 1\` people) but **knows NO ONE** (\`0\` people). Given an \`N x N\` binary matrix \`mat\` where \`mat[i][j] == 1\` means person \`i\` knows person \`j\`, return the celebrity's index (or \`-1\` if no celebrity exists).

### 💡 Key Takeaways (Brute O(N²) → Optimal Two-Pointer Elimination O(2N))
- **Why There Can Be AT MOST 1 Celebrity:**
  - If X is a celebrity, everyone knows X and X knows nobody—so no other person Y can also know nobody while knowing X!
- **1. Brute Force (\`knowMe[N]\` and \`iKnow[N]\` Arrays — \`O(N²)\` Time, \`O(2N)\` Space):**
  - Scan the entire \`N x N\` matrix and check for a person \`i\` with \`knowMe[i] == N - 1 && iKnow[i] == 0\`.
- **2. Optimal Pairwise Two-Pointer Elimination (\`O(2N)\` Time, \`O(1)\` Space!):**
  - Place \`top = 0\` and \`down = N - 1\`.
  - Loop **\`while (top < down)\`**:
    - **If \`mat[top][down] == 1\` (\`top\` knows \`down\`):** Since \`top\` knows someone, **\`top\` CANNOT be a celebrity** → **\`top++\`**!
    - **Else if \`mat[down][top] == 1\` (\`down\` knows \`top\`):** Since \`down\` knows someone, **\`down\` CANNOT be a celebrity** → **\`down--\`**!
    - **Else (neither knows the other):** Since a celebrity must be known by everyone, **NEITHER \`top\` nor \`down\` can be a celebrity** → **\`top++, down--\`**!
  - **Final Verification Pass (\`O(N)\`):**
    - If \`top > down\`, return \`-1\`.
    - When \`top == down\`, verify candidate \`top\` by scanning row \`top\` and column \`top\` (\`i\` from \`0\` to \`N - 1\`, skipping diagonal \`i == top\`): every \`mat[top][i]\` must be \`0\` AND every \`mat[i][top]\` must be \`1\`!

### 💻 The Celebrity Problem (Optimal O(2N) Time, O(1) Space) Blueprint
\`\`\`cpp
int celebrity(vector<vector<int>> &mat) {
    int n = mat.size();
    int top = 0, down = n - 1;

    // Step 1: Eliminate non-celebrities pairwise in O(N) time
    while (top < down) {
        if (mat[top][down] == 1) {
            top++;  // 'top' knows 'down', so 'top' cannot be a celebrity
        } else if (mat[down][top] == 1) {
            down--; // 'down' knows 'top', so 'down' cannot be a celebrity
        } else {
            // Neither knows the other -> neither is known by everyone!
            top++;
            down--;
        }
    }

    if (top > down) return -1;

    // Step 2: Verify the single surviving candidate 'top' in O(N) time
    for (int i = 0; i < n; i++) {
        if (i == top) continue; // Skip diagonal!
        if (mat[top][i] == 0 && mat[i][top] == 1) {
            continue;
        } else {
            return -1;
        }
    }
    return top;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Returning \`top\` Without the Step 2 Verification Loop:** The \`while (top < down)\` loop only proves that *everyone except \`top\`* has been eliminated—it does not guarantee that \`top\` is actually a celebrity! Always verify \`top\`'s full row and column in \`O(N)\` before returning \`top\`.`),
      practiceItems: [
        {
          title: "GeeksforGeeks: The Celebrity Problem",
          url: "https://www.geeksforgeeks.org/problems/the-celebrity-problem/1",
          difficulty: "Medium",
          description: "Given a square N x N matrix M representing whether person i knows person j, find the index of the celebrity (or -1 if none exists)."
        },
        {
          title: "LeetCode 277: Find the Celebrity",
          url: "https://leetcode.com/problems/find-the-celebrity/",
          difficulty: "Medium",
          description: "Find the celebrity among n people using the minimum number of knows(a, b) queries."
        },
        {
          title: "LeetCode 997: Find the Town Judge",
          url: "https://leetcode.com/problems/find-the-town-judge/",
          difficulty: "Easy",
          description: "Apply the indegree == N - 1 and outdegree == 0 celebrity definition to directed trust pairs."
        }
      ]
    },

    {
      order: 314,
      name: "Hash Map + Doubly Linked List Recency Queue: Implement LRU Cache in O(1)",
      slug: "dsa-implement-lru-cache-doubly-linked-list-hashmap",
      subtrack: "Module 44: Advanced Stack, Monotonic Deque & Cache Design: Stock Span, Sliding Window Max, Celebrity & LRU/LFU Caches",
      videoUrl: "https://www.youtube.com/watch?v=z9bJUPxzFOw",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Design a **Least Recently Used (LRU) Cache** of fixed \`capacity\` supporting:
1. **\`get(key)\` (\`O(1)\`):** Return the value of \`key\` if present (and mark \`key\` as **most recently used**), else return \`-1\`.
2. **\`put(key, value)\` (\`O(1)\`):** Update \`key\`'s value if present (and mark as most recently used), or insert \`(key, value)\`. If the cache is at full \`capacity\`, **evict the Least Recently Used key** first!

### 💡 Key Takeaways (The \`unordered_map<int, Node*>\` + Dummy-Head/Tail DLL Architecture)
- **Why We Combine a Doubly Linked List With a Hash Map:**
  - A **Hash Map (\`mpp[key] = Node*\`)** gives \`O(1)\` lookup directly to a node's memory address.
  - A **Doubly Linked List (DLL)** with a **dummy \`head\`** and **dummy \`tail\`** lets us **\`deleteNode(node)\`** from anywhere and **\`insertAfterHead(node)\`** in **\`O(1)\` pointer operations**!
  - **Ordering Invariant:**
    - Nodes **right after \`head\` (\`head->next\`)** are **Most Recently Used (MRU)**.
    - Nodes **right before \`tail\` (\`tail->prev\`)** are **Least Recently Used (LRU)**!
- **Two Reusable Helper Functions (\`deleteNode\` and \`insertAfterHead\`):**
  - On **\`get(key)\`**: If in \`mpp\`, grab \`node = mpp[key]\`, call \`deleteNode(node)\` and \`insertAfterHead(node)\` (reusing the exact same \`Node*\` without changing \`mpp\`!), and return \`node->val\`.
  - On **\`put(key, value)\`**:
    - If \`key\` already exists: update \`node->val = value\`, \`deleteNode(node)\`, and \`insertAfterHead(node)\`.
    - If \`key\` is new and \`mpp.size() == cap\`: evict **\`lruNode = tail->prev\`** via \`mpp.erase(lruNode->key)\` and \`deleteNode(lruNode)\`, then insert the new node right after \`head\`!

### 💻 Implement LRU Cache Blueprint
\`\`\`cpp
class LRUCache {
public:
    class Node {
    public:
        int key;
        int val;
        Node* next;
        Node* prev;
        Node(int _key, int _val) : key(_key), val(_val), next(nullptr), prev(nullptr) {}
    };

    Node* head = new Node(-1, -1);
    Node* tail = new Node(-1, -1);
    int cap;
    unordered_map<int, Node*> mpp;

    LRUCache(int capacity) {
        cap = capacity;
        head->next = tail;
        tail->prev = head;
    }

    void insertAfterHead(Node* currNode) {
        Node* curAfterHead = head->next;
        head->next = currNode;
        currNode->next = curAfterHead;
        currNode->prev = head;
        curAfterHead->prev = currNode;
    }

    void deleteNode(Node* delNode) {
        Node* delPrev = delNode->prev;
        Node* delNext = delNode->next;
        delPrev->next = delNext;
        delNext->prev = delPrev;
    }

    int get(int key) {
        if (mpp.find(key) == mpp.end()) return -1;

        Node* resNode = mpp[key];
        int res = resNode->val;
        // Move accessed node to Most Recently Used position (right after head)
        deleteNode(resNode);
        insertAfterHead(resNode);
        return res;
    }

    void put(int key, int value) {
        if (mpp.find(key) != mpp.end()) {
            Node* existingNode = mpp[key];
            existingNode->val = value;
            deleteNode(existingNode);
            insertAfterHead(existingNode);
            return;
        }

        if (mpp.size() == cap) {
            // Evict Least Recently Used node (sitting right before dummy tail)
            Node* lruNode = tail->prev;
            mpp.erase(lruNode->key);
            deleteNode(lruNode);
        }

        Node* newNode = new Node(key, value);
        insertAfterHead(newNode);
        mpp[key] = newNode;
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Storing Only \`val\` (Not \`key\`) Inside \`Node\`:** When the cache is full and we evict \`lruNode = tail->prev\`, we must also delete its entry from the hash map via **\`mpp.erase(lruNode->key)\`**! Without storing \`key\` inside \`Node\`, you wouldn't know which key to erase from \`mpp\`!`),
      practiceItems: [
        {
          title: "LeetCode 146: LRU Cache",
          url: "https://leetcode.com/problems/lru-cache/",
          difficulty: "Medium",
          description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache where get and put run in O(1) average time."
        },
        {
          title: "LeetCode 460: LFU Cache",
          url: "https://leetcode.com/problems/lfu-cache/",
          difficulty: "Hard",
          description: "Extend LRU Cache to Least Frequently Used (LFU) eviction with LRU tie-breaking."
        },
        {
          title: "GeeksforGeeks: LRU Cache",
          url: "https://www.geeksforgeeks.org/problems/lru-cache/1",
          difficulty: "Hard",
          description: "Implement an LRU Cache supporting O(1) get(key) and set(key, value) operations."
        }
      ]
    },

    {
      order: 315,
      name: "Frequency-Bucketed Doubly Linked Lists: Implement LFU Cache in O(1)",
      slug: "dsa-implement-lfu-cache-frequency-lists-hashmap",
      subtrack: "Module 44: Advanced Stack, Monotonic Deque & Cache Design: Stock Span, Sliding Window Max, Celebrity & LRU/LFU Caches",
      videoUrl: "https://www.youtube.com/watch?v=mzqHlAW7jeE",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Design a **Least Frequently Used (LFU) Cache** of fixed \`capacity\` where both \`get(key)\` and \`put(key, value)\` run in **\`O(1)\` time**:
- Each time a key is accessed (\`get\` or \`put\`), its **use counter (\`cnt\`) increments by \`+1\`**.
- When the cache is full and a new key must be inserted, evict the key with the **lowest frequency (\`minFreq\`)**.
- **Tie-Breaker Rule:** If multiple keys share the same lowest frequency \`minFreq\`, evict the **Least Recently Used (LRU)** key among them!

### 💡 Key Takeaways (Two Hash Maps + Per-Frequency Doubly Linked Lists)
- **Data Structures Required:**
  1. **\`Node\`**: Stores \`(key, value, cnt, prev, next)\`.
  2. **\`List\` (DLL with \`size\` counter)**: Each frequency bucket (\`cnt = 1, 2, 3...\`) has its own LRU Doubly Linked List (\`addFront(node)\` and \`removeNode(node)\`), automatically handling LRU tie-breaking within that frequency!
  3. **\`keyNode\` (\`unordered_map<int, Node*>\`)**: Maps \`key -> Node*\` for \`O(1)\` node lookup.
  4. **\`freqListMap\` (\`unordered_map<int, List*>\`)**: Maps \`frequency -> List*\` (the DLL of all nodes currently having that frequency).
  5. **\`minFreq\`**: Tracks the current minimum frequency across the cache.
- **How \`updateFreqListMap(node)\` Promotes a Node in O(1):**
  1. Remove \`node\` from its current frequency list \`freqListMap[node->cnt]->removeNode(node)\`.
  2. **Crucial \`minFreq\` Increment Check:** If \`node->cnt == minFreq\` AND **\`freqListMap[node->cnt]->size == 0\`** (that was the last node at \`minFreq\`!), increment **\`minFreq++\`**!
  3. Increment \`node->cnt++\` and insert \`node\` at the front of \`freqListMap[node->cnt]\`!
- **How \`put(key, value)\` Handles New Insertions in O(1):**
  - If \`curSize == maxSizeCache\`, look up \`List* list = freqListMap[minFreq]\`, evict its LRU tail **\`list->tail->prev\`**, and erase it from \`keyNode\`.
  - Since a brand-new key always starts with frequency \`1\`, reset **\`minFreq = 1\`** and insert the new node at the front of \`freqListMap[1]\`!

### 💻 Implement LFU Cache Blueprint
\`\`\`cpp
struct LFUNode {
    int key, value, cnt;
    LFUNode *next, *prev;
    LFUNode(int _key, int _value) : key(_key), value(_value), cnt(1), next(nullptr), prev(nullptr) {}
};

struct LFUList {
    int size;
    LFUNode *head, *tail;
    LFUList() {
        head = new LFUNode(0, 0);
        tail = new LFUNode(0, 0);
        head->next = tail;
        tail->prev = head;
        size = 0;
    }

    void addFront(LFUNode *node) {
        LFUNode *temp = head->next;
        node->next = temp;
        node->prev = head;
        head->next = node;
        temp->prev = node;
        size++;
    }

    void removeNode(LFUNode *delnode) {
        LFUNode *delprev = delnode->prev;
        LFUNode *delnext = delnode->next;
        delprev->next = delnext;
        delnext->prev = delprev;
        size--;
    }
};

class LFUCache {
    unordered_map<int, LFUNode*> keyNode;
    unordered_map<int, LFUList*> freqListMap;
    int maxSizeCache;
    int minFreq;
    int curSize;

public:
    LFUCache(int capacity) {
        maxSizeCache = capacity;
        minFreq = 0;
        curSize = 0;
    }

    void updateFreqListMap(LFUNode *node) {
        freqListMap[node->cnt]->removeNode(node);

        // If this was the only node at minFreq, minFreq increases by 1!
        if (node->cnt == minFreq && freqListMap[node->cnt]->size == 0) {
            minFreq++;
        }

        LFUList *nextHigherFreqList = new LFUList();
        if (freqListMap.find(node->cnt + 1) != freqListMap.end()) {
            nextHigherFreqList = freqListMap[node->cnt + 1];
        }
        node->cnt += 1;
        nextHigherFreqList->addFront(node);
        freqListMap[node->cnt] = nextHigherFreqList;
    }

    int get(int key) {
        if (keyNode.find(key) != keyNode.end()) {
            LFUNode *node = keyNode[key];
            int val = node->value;
            updateFreqListMap(node);
            return val;
        }
        return -1;
    }

    void put(int key, int value) {
        if (maxSizeCache == 0) return;

        if (keyNode.find(key) != keyNode.end()) {
            LFUNode *node = keyNode[key];
            node->value = value;
            updateFreqListMap(node);
        } else {
            if (curSize == maxSizeCache) {
                LFUList *list = freqListMap[minFreq];
                keyNode.erase(list->tail->prev->key);
                list->removeNode(list->tail->prev);
                curSize--;
            }
            curSize++;
            // Brand-new element always has frequency 1!
            minFreq = 1;
            LFUList *listFreq = new LFUList();
            if (freqListMap.find(minFreq) != freqListMap.end()) {
                listFreq = freqListMap[minFreq];
            }
            LFUNode *node = new LFUNode(key, value);
            listFreq->addFront(node);
            keyNode[key] = node;
            freqListMap[minFreq] = listFreq;
        }
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting to Reset \`minFreq = 1\` When Inserting a Brand-New Key:** Even if \`minFreq\` had climbed to \`5\` from earlier \`get()\` calls, any newly inserted key starts with frequency \`1\`—so \`minFreq\` **must** be reset to \`1\` on every new key insertion!`),
      practiceItems: [
        {
          title: "LeetCode 460: LFU Cache",
          url: "https://leetcode.com/problems/lfu-cache/",
          difficulty: "Hard",
          description: "Design and implement a data structure for a Least Frequently Used (LFU) cache where get and put run in O(1) average time complexity."
        },
        {
          title: "LeetCode 432: All O`one Data Structure",
          url: "https://leetcode.com/problems/all-oone-data-structure/",
          difficulty: "Hard",
          description: "Maintain strings organized by frequency buckets in a Doubly Linked List to support O(1) inc, dec, getMaxKey, and getMinKey."
        },
        {
          title: "LeetCode 895: Maximum Frequency Stack",
          url: "https://leetcode.com/problems/maximum-frequency-stack/",
          difficulty: "Hard",
          description: "Use frequency-bucketed stacks (freqMap + groupStackMap + maxFreq) to pop the most frequent element in O(1) time."
        }
      ]
    },
  ];

  console.log("\n📦 Upserting 15 Batch 31 Topics into 'topics' table...");
  const topicIdMap = {};

  for (const t of batch31Topics) {
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

  // 4. Link Topics to Track in 'track_topics' Table with sequential topic_order (301 to 315)
  console.log("\n🔄 Linking Batch 31 topics to 'problem-solving-dsa-sql' (orders 301..315)...");
  for (const t of batch31Topics) {
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

  console.log("\n🎉 DSA Batch 31 (Lectures 301–315) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch31()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch31;
