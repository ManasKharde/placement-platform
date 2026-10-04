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

const seedDsaBatch3 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 3 (Lectures 21–30) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 3 Topics (Lectures 21–30)
  const batch3Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 9: Medium Array Patterns & Classic Named Algorithms (Topics 21–25)
    // =========================================================================
    {
      order: 21,
      name: "Pair Sum & Complement Lookups: Two Sum (Boolean Check & Index Retrieval)",
      slug: "dsa-two-sum-complement-hashing-and-two-pointers",
      subtrack: "Module 9: Medium Array Patterns & Classic Named Algorithms",
      description: "Master the classic Two Sum pattern using Brute Force, Hash Map complement lookups for index retrieval, and two-pointer greedy convergence on sorted arrays.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 21: Two Sum — Check if a pair with given sum exists in Array",
          url: "https://www.youtube.com/watch?v=UXDSeD9mN-k",
          duration: "35m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Two Sum — Check if a pair with given sum exists in Array",
          url: "https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Two Sum II - Input Array Is Sorted",
          url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
          difficulty: "Medium",
          description: "Use converging left and right pointers to find two numbers that add up to the target in O(1) extra space.",
        },
        {
          platform: "LeetCode",
          title: "Max Number of K-Sum Pairs",
          url: "https://leetcode.com/problems/max-number-of-k-sum-pairs/",
          difficulty: "Medium",
          description: "Apply sorting + two pointers or frequency hashing to count disjoint pairs summing to K.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Count pairs with given sum",
          url: "https://www.geeksforgeeks.org/problems/count-pairs-with-given-sum5022/1",
          difficulty: "Easy",
          description: "Use a hash map to count all index pairs whose values add up to the target sum.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of integers and a \`target\` sum, the **Two Sum** problem asks two common variations in interviews:
1. **Variety 1 (Yes / No):** Return \`YES\` if any two elements add up to \`target\`, or \`NO\` otherwise.
2. **Variety 2 (Return Indices):** Return the exact indices \`[i, j]\` of the two elements that add up to \`target\`.

### 💡 Key Takeaways (Brute → Better → Optimal)
- **1. Brute Force (O(N²) Time, O(1) Space):**
  - Use two nested loops (\`i\` from \`0\` to \`n - 1\`, and \`j\` from \`i + 1\` to \`n - 1\`) to check every pair \`arr[i] + arr[j] == target\`.
- **2. Hash Map Complement Lookup (Optimal for Variety 2 — O(N) or O(N log N) Time, O(N) Space):**
  - As you iterate at element \`arr[i]\`, calculate how much more you need: \`more = target - arr[i]\`.
  - Check if \`more\` is already stored inside your hash map (\`mpp\`). If it is, return \`{mpp[more], i}\` (or \`"YES"\`).
  - Otherwise, store the current element and its index in the map (\`mpp[arr[i]] = i\`) and move on.
- **3. Sorting + Two Pointers (Optimal for Variety 1 without Extra Space — O(N log N) Time, O(1) Space):**
  - Sort the array first, then place \`left = 0\` at the start and \`right = n - 1\` at the end.
  - If \`arr[left] + arr[right] < target\`, move \`left++\` to increase the sum.
  - If \`arr[left] + arr[right] > target\`, move \`right--\` to decrease the sum.

### 💻 Hash Map Two Sum Blueprint
\`\`\`cpp
vector<int> twoSumIndices(vector<int> &nums, int target) {
    unordered_map<int, int> mpp; // Stores {element -> index}
    for (int i = 0; i < nums.size(); i++) {
        int more = target - nums[i];
        if (mpp.find(more) != mpp.end()) {
            return {mpp[more], i};
        }
        mpp[nums[i]] = i;
    }
    return {-1, -1};
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 22
    // -------------------------------------------------------------------------
    {
      order: 22,
      name: "Three-Way Partitioning: Dutch National Flag Algorithm (Sort 0s, 1s, and 2s)",
      slug: "dsa-dutch-national-flag-three-way-partitioning",
      subtrack: "Module 9: Medium Array Patterns & Classic Named Algorithms",
      description: "Sort an array containing only 0s, 1s, and 2s in a single pass using Dijkstra's Dutch National Flag 3-pointer partition invariant (low, mid, high).",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 22: Sort an array of 0's 1's and 2's — Dutch National Flag Algorithm",
          url: "https://www.youtube.com/watch?v=tp8JIuCXBaU",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Sort an array of 0s, 1s and 2s",
          url: "https://takeuforward.org/data-structure/sort-an-array-of-0s-1s-and-2s/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Partition Array According to Given Pivot",
          url: "https://leetcode.com/problems/partition-array-according-to-given-pivot/",
          difficulty: "Medium",
          description: "Partition elements into three groups (< pivot, == pivot, > pivot).",
        },
        {
          platform: "LeetCode",
          title: "Sort Array By Parity II",
          url: "https://leetcode.com/problems/sort-array-by-parity-ii/",
          difficulty: "Easy",
          description: "Use multi-pointer swapping to place even and odd integers at matching parity indices.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Three way partitioning",
          url: "https://www.geeksforgeeks.org/problems/three-way-partitioning/1",
          difficulty: "Easy",
          description: "Apply the Dutch National Flag 3-pointer partitioning around a given range [a, b].",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
When an array contains only \`0\`s, \`1\`s, and \`2\`s, standard sorting takes \`O(N log N)\` time and counting frequencies takes two passes (\`O(2N)\`). The **Dutch National Flag Algorithm** sorts the array in a **single pass (O(N) time)** and **O(1) space** using three pointers: \`low\`, \`mid\`, and \`high\`.

### 💡 Key Takeaways (The 4-Region Invariant)
The algorithm divides the array into four sections:
- \`0\` to \`low - 1\` → All \`0\`s (extreme left)
- \`low\` to \`mid - 1\` → All \`1\`s (middle sorted section)
- \`mid\` to \`high\` → **Unsorted elements** we are currently processing
- \`high + 1\` to \`n - 1\` → All \`2\`s (extreme right)

### ⚡ The 3 Pointer Rules (While \`mid <= high\`)
Start with \`low = 0\`, \`mid = 0\`, and \`high = n - 1\`:
1. **If \`arr[mid] == 0\`:** Swap \`arr[low]\` and \`arr[mid]\`, then increment both \`low++\` and \`mid++\`.
2. **If \`arr[mid] == 1\`:** It is already in the right place; simply move \`mid++\`.
3. **If \`arr[mid] == 2\`:** Swap \`arr[mid]\` and \`arr[high]\`, then decrement **only** \`high--\` (do not move \`mid\` yet, because the new element swapped from \`high\` is still uninspected).

### 💻 Dutch National Flag Blueprint
\`\`\`cpp
void sortZeroOneTwo(vector<int> &arr) {
    int low = 0, mid = 0, high = arr.size() - 1;
    while (mid <= high) {
        if (arr[mid] == 0) {
            swap(arr[low], arr[mid]);
            low++;
            mid++;
        } else if (arr[mid] == 1) {
            mid++;
        } else {
            swap(arr[mid], arr[high]);
            high--;
        }
    }
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 23
    // -------------------------------------------------------------------------
    {
      order: 23,
      name: "Frequency Cancellation: Moore's Voting Algorithm (Majority Element > N/2)",
      slug: "dsa-moores-voting-algorithm-majority-element",
      subtrack: "Module 9: Medium Array Patterns & Classic Named Algorithms",
      description: "Find the majority element appearing strictly more than N/2 times using Moore's Voting vote cancellation principle in O(N) time and O(1) space.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 23: Find the Majority Element that occurs more than N/2 times",
          url: "https://www.youtube.com/watch?v=nP_ns3uSh80",
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find the Majority Element that occurs more than N/2 times",
          url: "https://takeuforward.org/data-structure/find-the-majority-element-that-occurs-more-than-n-2-times/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Majority Element II",
          url: "https://leetcode.com/problems/majority-element-ii/",
          difficulty: "Medium",
          description: "Extend Moore's Voting Algorithm to find all elements appearing more than N/3 times.",
        },
        {
          platform: "LeetCode",
          title: "Most Frequent Even Element",
          url: "https://leetcode.com/problems/most-frequent-even-element/",
          difficulty: "Easy",
          description: "Track frequency counts with tie-breaking rules to find the dominant even integer.",
        },
        {
          platform: "GeeksforGeeks",
          title: "More than n/k Occurrences",
          url: "https://www.geeksforgeeks.org/problems/count-element-occurences/1",
          difficulty: "Easy",
          description: "Count how many elements appear strictly more than N/k times in an array.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
A **Majority Element** is an element that appears **strictly more than \`N / 2\` times** in an array of size \`N\`. While a hash map solves this in \`O(N)\` space, **Moore's Voting Algorithm** finds the majority candidate in **O(N) time** and **O(1) extra space**.

### 💡 Key Takeaways
- **Core Intuition (Vote Cancellation):** If an element appears more than half the time (\`> N / 2\`), all other elements combined cannot completely cancel out its occurrences.
- **Step 1: Apply Moore's Voting Algorithm:**
  - Maintain two variables: \`cnt = 0\` and \`el\` (current candidate).
  - Loop through the array:
    - If \`cnt == 0\`, pick the current number as the new candidate (\`el = arr[i]\`, \`cnt = 1\`).
    - Else if \`arr[i] == el\`, increment \`cnt++\`.
    - Else, decrement \`cnt--\` (canceling out one vote).
- **Step 2: Verify the Candidate (When Majority is Not Guaranteed):**
  - If the problem guarantees a majority element exists, \`el\` is automatically the answer.
  - If a majority element might not exist, run a quick second pass to count how many times \`el\` actually appears and check if \`count > N / 2\`.

### 💻 Moore's Voting Algorithm Blueprint
\`\`\`cpp
int majorityElement(vector<int> &v) {
    int cnt = 0, el = 0;
    for (int x : v) {
        if (cnt == 0) {
            cnt = 1;
            el = x;
        } else if (x == el) {
            cnt++;
        } else {
            cnt--;
        }
    }
    // Optional verification pass if majority element is not guaranteed
    int actualCount = 0;
    for (int x : v) if (x == el) actualCount++;
    return (actualCount > v.size() / 2) ? el : -1;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 24
    // -------------------------------------------------------------------------
    {
      order: 24,
      name: "Maximum Subarray Sum & Subarray Reconstruction: Kadane's Algorithm",
      slug: "dsa-kadanes-algorithm-maximum-subarray-sum",
      subtrack: "Module 9: Medium Array Patterns & Classic Named Algorithms",
      description: "Solve the maximum contiguous subarray sum in O(N) time using Kadane's Algorithm and track start/end indices to reconstruct the subarray.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 24: Kadane's Algorithm — Maximum Subarray Sum in an Array",
          url: "https://www.youtube.com/watch?v=AHZpyENo7k4",
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Kadane's Algorithm — Maximum Subarray Sum in an Array",
          url: "https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Maximum Sum Circular Subarray",
          url: "https://leetcode.com/problems/maximum-sum-circular-subarray/",
          difficulty: "Medium",
          description: "Apply Kadane's Algorithm to find the maximum subarray sum in a circular array.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Absolute Sum of Any Subarray",
          url: "https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/",
          difficulty: "Medium",
          description: "Track both maximum positive and minimum negative running sums using Kadane's intuition.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Smallest sum contiguous subarray",
          url: "https://www.geeksforgeeks.org/problems/smallest-sum-contiguous-subarray/1",
          difficulty: "Medium",
          description: "Invert Kadane's Algorithm to find the contiguous subarray with the minimum sum.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array with both positive and negative numbers, how do we find the contiguous subarray with the **largest sum**? Checking all subarrays takes \`O(N²)\` time, whereas **Kadane's Algorithm** solves it in a single **O(N) pass** and **O(1) space**.

### 💡 Key Takeaways
- **Core Intuition of Kadane's Algorithm:**
  - Carry a running \`sum\` as you move from left to right.
  - Even if you hit a negative number, keep carrying \`sum\` forward **as long as \`sum\` remains positive**, because a positive sum still adds value to future elements.
  - The moment \`sum\` drops below zero (\`sum < 0\`), carrying a negative sum forward will only shrink future subarrays—so **reset \`sum = 0\`** and start fresh from the next element!
- **Follow-Up: Printing the Maximum Subarray Indices:**
  - Whenever \`sum == 0\`, record \`start = i\` as the potential start of a new subarray.
  - Whenever \`sum > maxi\`, update \`maxi = sum\` and save \`ansStart = start\` and \`ansEnd = i\`.

### 💻 Kadane's Algorithm (With Subarray Index Tracking)
\`\`\`cpp
long long maxSubarraySum(vector<int> &arr) {
    long long sum = 0, maxi = LLONG_MIN;
    int start = 0, ansStart = -1, ansEnd = -1;

    for (int i = 0; i < arr.size(); i++) {
        if (sum == 0) start = i; // Potential start of a new subarray
        sum += arr[i];

        if (sum > maxi) {
            maxi = sum;
            ansStart = start;
            ansEnd = i;
        }
        if (sum < 0) sum = 0;    // Drop negative prefix sum
    }
    return maxi;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 25
    // -------------------------------------------------------------------------
    {
      order: 25,
      name: "Single-Pass Prefix Minimum Tracking: Best Time to Buy and Sell Stock",
      slug: "dsa-best-time-to-buy-and-sell-stock-single-pass",
      subtrack: "Module 9: Medium Array Patterns & Classic Named Algorithms",
      description: "Maximize stock profit by tracking running prefix minimum prices in a single O(N) pass with O(1) space.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 25: Stock Buy and Sell — Maximize Profit with Single Transaction",
          url: "https://www.youtube.com/watch?v=excAOvwF_Wk",
          duration: "22m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Stock Buy And Sell",
          url: "https://takeuforward.org/data-structure/stock-buy-and-sell/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Maximum Difference Between Increasing Elements",
          url: "https://leetcode.com/problems/maximum-difference-between-increasing-elements/",
          difficulty: "Easy",
          description: "Track the minimum element seen so far to maximize nums[j] - nums[i] for i < j.",
        },
        {
          platform: "LeetCode",
          title: "Best Time to Buy and Sell Stock II",
          url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
          difficulty: "Medium",
          description: "Extend stock profit logic when you are allowed to buy and sell multiple times.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Stock buy and sell",
          url: "https://www.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1",
          difficulty: "Medium",
          description: "Identify optimal buy and sell days across a price series.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`, you want to maximize your profit by choosing **one day to buy** and a **later day to sell**.

### 💡 Key Takeaways
- **Buy Before You Sell:** You cannot sell on day \`1\` and buy on day \`2\`—the buy day must strictly come before the sell day.
- **Core Intuition ("Remember the Minimum on the Left"):**
  - If you decide to sell the stock on day \`i\`, when should you have bought it to get the maximum profit?
  - On whichever previous day (\`0\` to \`i - 1\`) had the **lowest price**!
- **Single-Pass Algorithm (O(N) Time, O(1) Space):**
  - Initialize \`mini = prices[0]\` (cheapest buy price seen so far) and \`maxProfit = 0\`.
  - Loop \`i\` from \`1\` to \`n - 1\`:
    1. Calculate the profit if sold today: \`cost = prices[i] - mini\`.
    2. Update \`maxProfit = max(maxProfit, cost)\`.
    3. Update the lowest buy price for future days: \`mini = min(mini, prices[i])\`.

### 💻 Best Time to Buy & Sell Stock Blueprint
\`\`\`cpp
int maxProfit(vector<int> &prices) {
    int mini = prices[0], maxProfit = 0;
    for (int i = 1; i < prices.size(); i++) {
        int cost = prices[i] - mini;
        maxProfit = max(maxProfit, cost);
        mini = min(mini, prices[i]); // Remember minimum price seen so far
    }
    return maxProfit;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation (Topics 26–30)
    // =========================================================================
    {
      order: 26,
      name: "Alternating Sign Rearrangement: Equal & Unequal Positive-Negative Partitioning",
      slug: "dsa-rearrange-array-elements-by-sign",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Rearrange positive and negative numbers alternately (+, -, +, - ...) in O(N) time for equal counts via two pointers, and handle unequal lists gracefully.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 26: Rearrange Array Elements by Sign",
          url: "https://www.youtube.com/watch?v=h4aBagy4Uok",
          duration: "26m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Rearrange Array Elements by Sign",
          url: "https://takeuforward.org/arrays/rearrange-array-elements-by-sign/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Sort Even and Odd Indices Independently",
          url: "https://leetcode.com/problems/sort-even-and-odd-indices-independently/",
          difficulty: "Easy",
          description: "Manipulate even-indexed and odd-indexed positions separately.",
        },
        {
          platform: "LeetCode",
          title: "Shuffle the Array",
          url: "https://leetcode.com/problems/shuffle-the-array/",
          difficulty: "Easy",
          description: "Interleave two halves of an array at alternating even and odd positions.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Positive and negative elements",
          url: "https://www.geeksforgeeks.org/problems/positive-and-negative-elements4613/1",
          difficulty: "Easy",
          description: "Arrange positive and negative numbers alternatively while maintaining relative order.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of positive and negative integers, your goal is to rearrange them so they alternate (\`+ , - , + , - ...\`) while **preserving their original relative order**. This lecture covers both **Variety 1** (equal count of positives and negatives) and **Variety 2** (unequal counts).

### 💡 Key Takeaways
- **Even vs. Odd Index Observation:**
  - Because the rearranged array starts with a positive number (\`+ , - , + , - ...\`), all **positive** numbers land on **even indices** (\`0, 2, 4...\`) and all **negative** numbers land on **odd indices** (\`1, 3, 5...\`).
- **Variety 1 (Equal Positives & Negatives — Single Pass O(N) Time, O(N) Space):**
  - Create an \`ans\` vector of size \`n\` and keep two pointers: \`posIndex = 0\` and \`negIndex = 1\`.
  - In a single loop, if \`nums[i] > 0\`, place it at \`ans[posIndex]\` and advance \`posIndex += 2\`. If \`nums[i] < 0\`, place it at \`ans[negIndex]\` and advance \`negIndex += 2\`.
- **Variety 2 (Unequal Positives & Negatives — Two Pass O(2N) Time, O(N) Space):**
  - When counts are unequal, we cannot jump by \`+2\` all the way to the end.
  - Collect positives in a \`pos\` vector and negatives in a \`neg\` vector.
  - Fill alternating pairs up to \`min(pos.size(), neg.size())\` at \`arr[2 * i]\` and \`arr[2 * i + 1]\`, then append all leftover elements from the larger list at the end.

### 💻 Single-Pass Alternating Placement (Variety 1)
\`\`\`cpp
vector<int> rearrangeBySign(vector<int> &nums) {
    int n = nums.size();
    vector<int> ans(n, 0);
    int posIndex = 0, negIndex = 1;

    for (int x : nums) {
        if (x < 0) {
            ans[negIndex] = x;
            negIndex += 2;
        } else {
            ans[posIndex] = x;
            posIndex += 2;
        }
    }
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 27
    // -------------------------------------------------------------------------
    {
      order: 27,
      name: "Lexicographical Ordering & Breakpoint Pivot: Next Permutation Algorithm",
      slug: "dsa-next-permutation-lexicographical-breakpoint",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Generate the next lexicographical permutation in O(N) time and O(1) space via the 3-step breakpoint pivot, swap, and suffix reversal algorithm.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 27: Next Permutation — Find next lexicographically greater permutation",
          url: "https://www.youtube.com/watch?v=JDOXKqF60RQ",
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Next Permutation — Find next lexicographically greater permutation",
          url: "https://takeuforward.org/data-structure/next_permutation-find-next-lexicographically-greater-permutation/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Next Greater Element III",
          url: "https://leetcode.com/problems/next-greater-element-iii/",
          difficulty: "Medium",
          description: "Apply the exact Next Permutation 3-step algorithm to the digits of a 32-bit integer.",
        },
        {
          platform: "LeetCode",
          title: "Previous Permutation With One Swap",
          url: "https://leetcode.com/problems/previous-permutation-with-one-swap/",
          difficulty: "Medium",
          description: "Invert breakpoint logic to find the lexicographically largest smaller permutation.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Permutations of a given string",
          url: "https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1",
          difficulty: "Medium",
          description: "Generate all unique lexicographically sorted permutations of a string.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of numbers, its **Next Permutation** is the very next arrangement that would appear in dictionary (lexicographical) order. If the array is already the largest possible arrangement (like \`[3, 2, 1]\`), we wrap around to the smallest sorted arrangement (\`[1, 2, 3]\`).

### 💡 Key Takeaways (The 3-Step Optimal Algorithm)
Instead of generating all \`N!\` permutations, we can find the next permutation in-place in **O(N) time** and **O(1) space** using 3 observations:
1. **Step 1: Find the Breakpoint (\`ind\`) from the Right:**
   - Scan backward from \`i = n - 2\` down to \`0\` to find the first dip where \`arr[i] < arr[i + 1]\`.
   - This keeps the longest possible prefix unchanged.
   - *Edge Case:* If no dip exists (\`ind == -1\`), the entire array is in descending order—simply reverse the whole array and return!
2. **Step 2: Swap With the Smallest Element Greater Than \`arr[ind]\`:**
   - Since the suffix to the right of \`ind\` is sorted in decreasing order from left to right (increasing from right to left), scan backward from \`i = n - 1\` down to \`ind + 1\`.
   - Find the first element \`arr[i] > arr[ind]\`, swap \`swap(arr[i], arr[ind])\`, and break.
3. **Step 3: Reverse the Suffix (\`ind + 1\` to \`n - 1\Single):**
   - To make the remaining suffix as small as possible, simply reverse \`arr\` from \`ind + 1\` to the end!

### 💻 Next Permutation Blueprint
\`\`\`cpp
void nextPermutation(vector<int> &a) {
    int n = a.size(), ind = -1;
    // 1. Find breakpoint dip from the back
    for (int i = n - 2; i >= 0; i--) {
        if (a[i] < a[i + 1]) {
            ind = i;
            break;
        }
    }
    if (ind == -1) {
        reverse(a.begin(), a.end());
        return;
    }
    // 2. Swap with the smallest element > a[ind] from the back
    for (int i = n - 1; i > ind; i--) {
        if (a[i] > a[ind]) {
            swap(a[i], a[ind]);
            break;
        }
    }
    // 3. Reverse the right half to make it as small as possible
    reverse(a.begin() + ind + 1, a.end());
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 28
    // -------------------------------------------------------------------------
    {
      order: 28,
      name: "Right-to-Left Suffix Maximum Scan: Finding Leaders in an Array",
      slug: "dsa-leaders-in-an-array-suffix-max",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Find all leader elements that are strictly greater than all elements to their right using an optimal right-to-left suffix maximum scan in O(N) time.",
      estimatedMinutes: 35,
      videoLinks: [
        {
          title: "Lecture 28: Leaders in an Array",
          url: "https://www.youtube.com/watch?v=cHrH9CQ8pmY",
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Leaders in an Array",
          url: "https://takeuforward.org/data-structure/leaders-in-an-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Replace Elements with Greatest Element on Right Side",
          url: "https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/",
          difficulty: "Easy",
          description: "Scan backward from right to left while maintaining the running suffix maximum.",
        },
        {
          platform: "LeetCode",
          title: "Next Greater Element I",
          url: "https://leetcode.com/problems/next-greater-element-i/",
          difficulty: "Easy",
          description: "Identify the next greater element to the right for each target query.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Elements before which no element is bigger",
          url: "https://www.geeksforgeeks.org/problems/elements-before-which-no-element-is-bigger0632/1",
          difficulty: "Easy",
          description: "Count elements that are strictly greater than all elements preceding them.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
An element in an array is called a **Leader** if it is greater than all the elements to its right. Note that the rightmost element of the array is always a leader because there are no elements to its right.

### 💡 Key Takeaways
- **Brute Force (O(N²) Time):** For every element \`arr[i]\`, scan all elements to its right (\`j = i + 1\` to \`n - 1\`) to check if anything is larger.
- **Optimal Suffix Maximum Scan (O(N) Time, O(1) Extra Space):**
  - If \`arr[i]\` is greater than the **maximum element to its right**, then it is automatically greater than *every* element to its right!
  - Start iterating from the back of the array (\`i = n - 1\` down to \`0\`) while maintaining \`maxi = INT_MIN\`.
  - Whenever \`arr[i] > maxi\`, add \`arr[i]\` to your leaders list and update \`maxi = arr[i]\`.
  - Finally, reverse (or sort, depending on what the question asks) the collected leaders list.

### 💻 Right-to-Left Leader Scan Blueprint
\`\`\`cpp
vector<int> findLeaders(vector<int> &a) {
    vector<int> ans;
    int maxi = INT_MIN;
    int n = a.size();

    for (int i = n - 1; i >= 0; i--) {
        if (a[i] > maxi) {
            ans.push_back(a[i]);
        }
        maxi = max(maxi, a[i]);
    }
    reverse(ans.begin(), ans.end()); // Restore original left-to-right order
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 29
    // -------------------------------------------------------------------------
    {
      order: 29,
      name: "Hash Set Sequence Building: Longest Consecutive Sequence in O(N) Time",
      slug: "dsa-longest-consecutive-sequence-hash-set",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Find the longest contiguous consecutive sequence length in O(N) time using an unordered set and the sequence starter trick (checking if x - 1 exists).",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 29: Longest Consecutive Sequence in an Array",
          url: "https://www.youtube.com/watch?v=oO5uLE7EUlM",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Longest Consecutive Sequence in an Array",
          url: "https://takeuforward.org/data-structure/longest-consecutive-sequence-in-an-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Find Three Consecutive Integers That Sum to a Given Number",
          url: "https://leetcode.com/problems/find-three-consecutive-integers-that-sum-to-a-given-number/",
          difficulty: "Medium",
          description: "Use consecutive integer properties to determine if x - 1, x, x + 1 sum to num.",
        },
        {
          platform: "LeetCode",
          title: "Longest Square Streak in an Array",
          url: "https://leetcode.com/problems/longest-square-streak-in-an-array/",
          difficulty: "Medium",
          description: "Use a hash set to build the longest streak where each next element is the square of the previous.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Array Subset of another array",
          url: "https://www.geeksforgeeks.org/problems/array-subset-of-another-array2317/1",
          difficulty: "Easy",
          description: "Practice O(1) hash lookups to verify element membership across arrays.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an unsorted array of integers (e.g., \`[102, 4, 100, 1, 101, 3, 2, 1, 1]\`), find the length of the **longest consecutive sequence** (here \`[1, 2, 3, 4]\` has length \`4\`, while \`[100, 101, 102]\` has length \`3\`).

### 💡 Key Takeaways (Brute → Better → Optimal)
- **1. Brute Force (O(N²) Time):** For every element \`x\`, repeatedly run a linear search for \`x + 1\`, \`x + 2\`, etc.
- **2. Better Approach via Sorting (O(N log N) Time, O(1) Space):**
  - Sort the array and track \`lastSmaller\`.
  - If \`arr[i] - 1 == lastSmaller\`, extend the current streak (\`cnt++\`).
  - If \`arr[i] == lastSmaller\`, skip the duplicate.
  - Otherwise, reset \`cnt = 1\` and start a new sequence at \`arr[i]\`.
- **3. Optimal Unordered Set Approach (O(N) Time, O(N) Space):**
  - Insert all array elements into an \`unordered_set<int> st\`.
  - Iterate through each unique number \`it\` in the set.
  - **The Sequence Start Trick:** Only start counting a streak from \`it\` if **\`it - 1\` is NOT in the set** (\`st.find(it - 1) == st.end()\`)!
  - Why? Because if \`it - 1\` exists (for example, we are at \`101\` and \`100\` is in the set), \`101\` is in the middle of a sequence—not the start. Skipping non-starters ensures every element is visited at most twice (\`O(3N) → O(N)\` time)!

### 💻 Optimal Hash Set Sequence Builder
\`\`\`cpp
int longestConsecutive(vector<int> &a) {
    if (a.empty()) return 0;
    unordered_set<int> st(a.begin(), a.end());
    int longest = 1;

    for (int it : st) {
        // Only start counting if 'it' is the very first number of a sequence
        if (st.find(it - 1) == st.end()) {
            int cnt = 1;
            int x = it;
            while (st.find(x + 1) != st.end()) {
                x++;
                cnt++;
            }
            longest = max(longest, cnt);
        }
    }
    return longest;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 30
    // -------------------------------------------------------------------------
    {
      order: 30,
      name: "2D Matrix In-Place State Marking: Set Matrix Zeroes in O(1) Extra Space",
      slug: "dsa-set-matrix-zeroes-inplace-constant-space",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Set entire rows and columns to zero in-place using the first row and column as marker arrays with a col0 flag to achieve O(1) auxiliary space.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 30: Set Matrix Zeroes — In-Place Matrix Marking",
          url: "https://www.youtube.com/watch?v=N0MgLvceX7M",
          duration: "38m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Set Matrix Zero",
          url: "https://takeuforward.org/data-structure/set-matrix-zero/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Game of Life",
          url: "https://leetcode.com/problems/game-of-life/",
          difficulty: "Medium",
          description: "Update a 2D board in-place using state markers so simultaneous transitions don't corrupt neighbors.",
        },
        {
          platform: "LeetCode",
          title: "Check if Every Row and Column Contains All Numbers",
          url: "https://leetcode.com/problems/check-if-every-row-and-column-contains-all-numbers/",
          difficulty: "Easy",
          description: "Practice 2D row and column state verification on an N x N matrix.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Boolean Matrix",
          url: "https://www.geeksforgeeks.org/problems/boolean-matrix-problem-1587115620/1",
          difficulty: "Medium",
          description: "Modify a matrix in-place so that if a cell is 1, its entire row and column become 1.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an \`N x M\` matrix, whenever you find an original \`0\` at cell \`(i, j)\`, you must set its **entire row \`i\`** and **entire column \`j\`** to \`0\` in-place.

### 💡 Key Takeaways (Brute → Better → Optimal)
- **1. Brute Force (O((N*M)*(N+M)) Time, O(1) Space):**
  - You cannot immediately turn neighbors into \`0\` while scanning, or those new \`0\`s will wipe out the whole matrix! Instead, mark affected non-zero cells as \`-1\` first, then convert all \`-1\`s to \`0\` in a second pass.
- **2. Better Approach (O(2 * N * M) Time, O(N + M) Space):**
  - Create two marker arrays: \`row[N] = {0}\` and \`col[M] = {0}\`.
  - Pass 1: Whenever \`matrix[i][j] == 0\`, mark \`row[i] = 1\` and \`col[j] = 1\`.
  - Pass 2: Set \`matrix[i][j] = 0\` if \`row[i] == 1\` or \`col[j] == 1\`.
- **3. Optimal In-Place Marker Approach (O(2 * N * M) Time, O(1) Extra Space):**
  - Instead of external \`row\` and \`col\` arrays, use the **first column** (\`matrix[i][0]\`) as your row marker and the **first row** (\`matrix[0][j]\`) as your column marker!
  - Because cell \`matrix[0][0]\` overlaps both, use \`matrix[0][0]\` for row \`0\` and keep one separate integer variable \`col0 = 1\` to track column \`0\`.
  - **Crucial Update Order:** First update the inner submatrix (\`i = 1..n-1\`, \`j = 1..m-1\`), then update the first row (\`if matrix[0][0] == 0\`), and finally update the first column (\`if col0 == 0\`) so you don't overwrite your markers too early!

### 💻 Optimal O(1) Space Blueprint
\`\`\`cpp
void setZeroes(vector<vector<int>> &matrix) {
    int n = matrix.size(), m = matrix[0].size();
    int col0 = 1;

    // 1. Mark first row and first column
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                if (j != 0) matrix[0][j] = 0;
                else col0 = 0;
            }
        }
    }
    // 2. Update inner cells (1 to n-1, 1 to m-1)
    for (int i = 1; i < n; i++) {
        for (int j = 1; j < m; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0;
            }
        }
    }
    // 3. Update first row, then first column
    if (matrix[0][0] == 0) {
        for (int j = 0; j < m; j++) matrix[0][j] = 0;
    }
    if (col0 == 0) {
        for (int i = 0; i < n; i++) matrix[i][0] = 0;
    }
}
\`\`\``,
    },
  ];

  // 4. Upsert topics in database
  const topicIdMap = new Map();

  for (const topic of batch3Topics) {
    const cleanedSummary = cleanText(topic.summaryMarkdown);
    const cleanedDescription = cleanText(topic.description);
    const cleanedPracticeItems = topic.practiceItems.map((p) => ({
      ...p,
      title: cleanText(p.title),
      description: cleanText(p.description),
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
          topic.videoLinks[0].url,
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
          topic.docLinks[0].url,
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
            pItem.url,
          ]
        );
      }
    }
  }

  // 5. Update track_topics: Link Batch 3 Topics to topic_order 21 through 30
  console.log("\n🔄 Linking Batch 3 topics to 'problem-solving-dsa-sql' (orders 21..30)...");

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

  // Link Batch 3 Topics (orders 21..30)
  for (const topicDef of batch3Topics) {
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

  console.log("\n🎉 DSA Batch 3 (Lectures 21–30) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch3()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch3;
