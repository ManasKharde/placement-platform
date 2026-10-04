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

const seedDsaBatch7 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 7 (Lectures 61–70) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 7 Topics (Lectures 61–70)
  const batch7Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 13: Binary Search on Answer Space & Monotonic Predicate Functions (Topics 61–64)
    // =========================================================================
    {
      order: 61,
      name: "Greedy Stall Allocation: Aggressive Cows (Maximize Minimum Distance)",
      slug: "dsa-aggressive-cows-maximize-minimum-distance",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Assign K cows to stalls such that the minimum distance between any two cows is maximized using binary search on answer space.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 61: Aggressive Cows",
          url: cleanUrl("https://www.youtube.com/watch?v=R_Mfw4ew-Vo"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Aggressive Cows",
          url: "https://takeuforward.org/data-structure/aggressive-cows-detailed-solution/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Magnetic Force Between Two Balls",
          url: cleanUrl("https://leetcode.com/problems/magnetic-force-between-two-balls/"),
          difficulty: "Medium",
          description: "Maximize the minimum magnetic force between m balls placed in baskets.",
        },
        {
          platform: "LeetCode",
          title: "Maximum Tastiness of Candy Basket",
          url: cleanUrl("https://leetcode.com/problems/maximum-tastiness-of-candy-basket/"),
          difficulty: "Medium",
          description: "Find the maximum tastiness of a candy basket using binary search on minimum absolute difference.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Aggressive Cows",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/aggressive-cows/1"),
          difficulty: "Medium",
          description: "Assign K cows to stalls such that the minimum distance between any two cows is maximized.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given \`n\` stall coordinates and \`k\` aggressive cows, place all \`k\` cows in stalls such that the **minimum distance between any two cows is as large as possible** (Max-of-Min pattern).

### 💡 Key Takeaways
- **Sort the Stalls First:**
  - Sorting the coordinates allows us to measure distances strictly between consecutive cows.
- **Answer Space Range (\`[1, max(stalls) - min(stalls)]\`):**
  - Minimum possible distance between two cows is \`1\`.
  - Maximum possible distance is placing cows at the two extreme ends: \`stalls[n - 1] - stalls[0]\`.
- **Greedy Feasibility Check (\`canWePlace(stalls, dist, k)\`):**
  - Always place the first cow at \`stalls[0]\`.
  - Iterate through subsequent stalls: if \`stalls[i] - lastStall >= dist\`, place the next cow here and update \`lastStall = stalls[i]\`.
  - If we can place all \`k\` cows, this distance is feasible.
- **Binary Search Elimination:**
  - If \`canWePlace\` returns true: Distance \`mid\` is feasible. Since we want to **maximize** distance, search right (\`low = mid + 1\`).
  - Otherwise: Cows are spaced too far apart—search left (\`high = mid - 1\`).
  - \`high\` ends at the maximum feasible distance!

### 💻 Aggressive Cows Blueprint
\`\`\`cpp
bool canWePlace(vector<int> &stalls, int dist, int cows) {
    int cntCows = 1, last = stalls[0];
    for (int i = 1; i < stalls.size(); i++) {
        if (stalls[i] - last >= dist) {
            cntCows++;
            last = stalls[i];
        }
        if (cntCows >= cows) return true;
    }
    return false;
}

int aggressiveCows(vector<int> &stalls, int k) {
    sort(stalls.begin(), stalls.end());
    int low = 1, high = stalls.back() - stalls.front();
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canWePlace(stalls, mid, k)) {
            low = mid + 1;  // Try a larger minimum distance
        } else {
            high = mid - 1; // Try a smaller distance
        }
    }
    return high;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 62
    // -------------------------------------------------------------------------
    {
      order: 62,
      name: "Contiguous Page Allocation: Book Allocation Problem (Minimize Maximum Pages)",
      slug: "dsa-book-allocation-problem-binary-search",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Allocate books contiguously to M students to minimize the maximum pages assigned to any student in O(N * log(sum - max)) time.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 62: Book Allocation Problem",
          url: cleanUrl("https://www.youtube.com/watch?v=Z0hwjftStI4"),
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Allocate Minimum Number of Pages",
          url: "https://takeuforward.org/data-structure/allocate-minimum-number-of-pages/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Split Array Largest Sum",
          url: cleanUrl("https://leetcode.com/problems/split-array-largest-sum/"),
          difficulty: "Hard",
          description: "Split an array into k non-empty contiguous subarrays to minimize the largest subarray sum.",
        },
        {
          platform: "LeetCode",
          title: "Capacity To Ship Packages Within D Days",
          url: cleanUrl("https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/"),
          difficulty: "Medium",
          description: "Determine the least ship weight capacity required to ship packages within D days.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Allocate Minimum Pages",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1"),
          difficulty: "Medium",
          description: "Allocate books to students so that the maximum pages assigned to any student is minimized.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given \`n\` books with \`arr[i]\` pages and \`m\` students, allocate books contiguously such that every student gets at least one book and the **maximum pages assigned to any student is minimized** (Min-of-Max pattern).

### 💡 Key Takeaways
- **Impossible Case:** If \`m > n\` (more students than books), it is impossible to give each student at least one book—return \`-1\`.
- **Search Range (\`[max(arr), sum(arr)]\`):**
  - \`low = max(arr)\`: A student assigned the thickest book must be able to hold at least its page count.
  - \`high = sum(arr)\`: If only 1 student existed, they would read all pages.
- **Feasibility Simulation (\`countStudents(arr, maxPages)\`):**
  - Traverse the books, adding pages to the current student.
  - If adding the next book exceeds \`maxPages\`, increment student count (\`students++\`) and assign the new book to the next student.
- **Binary Search Elimination:**
  - If \`countStudents(arr, mid) > m\`: The page barrier \`mid\` is too tight (requires too many students), so increase barrier (\`low = mid + 1\`).
  - Otherwise: \`mid\` works with \`<= m\` students—try minimizing pages further (\`high = mid - 1\`).
  - \`low\` ends at the optimal minimum maximum page allocation!

### 💻 Book Allocation Blueprint
\`\`\`cpp
int countStudents(vector<int> &arr, int pages) {
    int students = 1, pagesStudent = 0;
    for (int p : arr) {
        if (pagesStudent + p <= pages) {
            pagesStudent += p;
        } else {
            students++;
            pagesStudent = p;
        }
    }
    return students;
}

int findPages(vector<int> &arr, int n, int m) {
    if (m > n) return -1;
    int low = *max_element(arr.begin(), arr.end());
    int high = accumulate(arr.begin(), arr.end(), 0);

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (countStudents(arr, mid) > m) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 63
    // -------------------------------------------------------------------------
    {
      order: 63,
      name: "Contiguous Subarray Partitioning: Painter's Partition & Split Array Largest Sum",
      slug: "dsa-painters-partition-and-split-array-largest-sum",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Solve Painter's Partition and Split Array Largest Sum using the unified contiguous allocation binary search template.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 63: Painter's Partition & Split Array Largest Sum",
          url: cleanUrl("https://www.youtube.com/watch?v=thUd_WJn6wk"),
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Painter's Partition Problem",
          url: "https://takeuforward.org/arrays/painters-partition-problem/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Split Array Largest Sum",
          url: cleanUrl("https://leetcode.com/problems/split-array-largest-sum/"),
          difficulty: "Hard",
          description: "Divide array into k subarrays such that the maximum subarray sum is minimized.",
        },
        {
          platform: "LeetCode",
          title: "Minimum Number of Days to Make m Bouquets",
          url: cleanUrl("https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/"),
          difficulty: "Medium",
          description: "Binary search on day answer space to assemble m bouquets from adjacent flowers.",
        },
        {
          platform: "GeeksforGeeks",
          title: "The Painter's Partition Problem-II",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/the-painters-partition-problem1535/1"),
          difficulty: "Hard",
          description: "Find the minimum time to paint all boards using k painters working continuously.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Both **Painter's Partition** (distributing \`n\` contiguous boards among \`k\` painters) and **Split Array Largest Sum** (splitting an array into \`k\` contiguous subarrays) share the **exact same underlying invariant as Book Allocation**.

### 💡 Key Takeaways
- **Concept Equivalence:**
  - Books \`arr[i]\` → Board lengths \`boards[i]\` → Array elements \`nums[i]\`.
  - Students \`m\` → Painters \`k\` → Subarrays \`k\`.
  - Max pages per student → Max time per painter → Largest subarray sum.
- **Search Space:**
  - \`low = max(boards)\` (slowest single unit that must be processed).
  - \`high = sum(boards)\` (all units painted by a single painter).
- **Complexity:**
  - \`O(N * log2(sum - max + 1))\` Time and \`O(1)\` Space.

### 💻 Unified Partition Blueprint
\`\`\`cpp
int countPartitions(vector<int> &a, int maxSum) {
    int partitions = 1, currentSum = 0;
    for (int x : a) {
        if (currentSum + x <= maxSum) {
            currentSum += x;
        } else {
            partitions++;
            currentSum = x;
        }
    }
    return partitions;
}

int splitArray(vector<int> &nums, int k) {
    int low = *max_element(nums.begin(), nums.end());
    int high = accumulate(nums.begin(), nums.end(), 0);

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (countPartitions(nums, mid) > k) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return low;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 64
    // -------------------------------------------------------------------------
    {
      order: 64,
      name: "Real-Valued Binary Search & Priority Queue Optimization: Minimise Maximum Distance to Gas Stations",
      slug: "dsa-minimise-maximum-distance-between-gas-stations",
      subtrack: "Module 13: Binary Search on Answer Space & Monotonic Predicate Functions",
      description: "Minimize the maximum distance between adjacent gas stations within 10^-6 precision using real-valued binary search or max-heap greedy insertion.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 64: Minimise Maximum Distance to Gas Station",
          url: cleanUrl("https://www.youtube.com/watch?v=kMSBvlZ-_HA"),
          duration: "35m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Minimise Maximum Distance between Gas Stations",
          url: "https://takeuforward.org/arrays/minimise-maximum-distance-between-gas-stations/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Minimize Max Distance to Gas Station",
          url: cleanUrl("https://leetcode.com/problems/minimize-max-distance-to-gas-station/"),
          difficulty: "Hard",
          description: "Add k gas stations to minimize the maximum distance between adjacent stations with precision 10^-6.",
        },
        {
          platform: "LeetCode",
          title: "Koko Eating Bananas",
          url: cleanUrl("https://leetcode.com/problems/koko-eating-bananas/"),
          difficulty: "Medium",
          description: "Binary search on integer eating speeds to satisfy hour constraints.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Minimize Max Distance to Gas Station",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/minimize-max-distance-to-gas-station/1"),
          difficulty: "Hard",
          description: "Add k stations along a road to minimize the maximum segment distance.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given \`n\` gas station coordinates and an integer \`k\`, place \`k\` new gas stations between existing ones so that the **maximum distance between adjacent stations is minimized**. The answer must be accurate within \`10^-6\`.

### 💡 Key Takeaways
- **Heap Approach (Better — O(K log N) Time, O(N) Space):**
  - Use a max-heap (\`priority_queue\`) to greedily find the section with the largest distance and insert a gas station there.
- **Binary Search on Real Values (Optimal — O(N * log((maxDist)/10^-6)) Time, O(1) Space):**
  - \`low = 0.0\`, \`high = max consecutive distance\`.
  - Termination condition: Run while \`high - low > 1e-6\` (precision limit).
  - Predicate function: For a trial max distance \`dist\`, count how many stations are needed across all intervals:
    \`stationsNeeded += (stations[i] - stations[i-1]) / dist\`.
  - If \`stationsNeeded <= k\`: Distance \`mid\` is achievable; search smaller distances (\`high = mid\`).
  - Otherwise: \`low = mid\`.

### 💻 Real-Valued Binary Search Blueprint
\`\`\`cpp
int numberOfGasStationsRequired(long double dist, vector<int> &arr) {
    int cnt = 0;
    for (int i = 1; i < arr.size(); i++) {
        int numberInBetween = (arr[i] - arr[i - 1]) / dist;
        if ((arr[i] - arr[i - 1]) == numberInBetween * dist) {
            numberInBetween--;
        }
        cnt += numberInBetween;
    }
    return cnt;
}

long double minimiseMaxDistance(vector<int> &arr, int k) {
    long double low = 0, high = 0;
    for (int i = 0; i < arr.size() - 1; i++) {
        high = max(high, (long double)(arr[i + 1] - arr[i]));
    }
    long double diff = 1e-6;
    while (high - low > diff) {
        long double mid = (low + high) / (2.0);
        int cnt = numberOfGasStationsRequired(mid, arr);
        if (cnt > k) {
            low = mid;
        } else {
            high = mid;
        }
    }
    return high;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 14: Multi-Array Partitioning & 2D Matrix Binary Search (Topics 65–70)
    // =========================================================================
    {
      order: 65,
      name: "Virtual Pointer Merge & Parity Splits: Median of Two Sorted Arrays (Brute & Better)",
      slug: "dsa-median-of-two-sorted-arrays-brute-better",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Find the median of two sorted arrays in O(N1 + N2) time and O(1) space using two-pointer index counting without third array allocation.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 65: Median of Two Sorted Arrays — Brute and Better Approaches",
          url: cleanUrl("https://www.youtube.com/watch?v=C2rRzz-JDk8"),
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Median of Two Sorted Arrays",
          url: "https://takeuforward.org/data-structure/median-of-two-sorted-arrays-of-different-sizes/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Merge Sorted Array",
          url: cleanUrl("https://leetcode.com/problems/merge-sorted-array/"),
          difficulty: "Easy",
          description: "Merge two sorted arrays in-place using two-pointer traversal from the back.",
        },
        {
          platform: "LeetCode",
          title: "Squares of a Sorted Array",
          url: cleanUrl("https://leetcode.com/problems/squares-of-a-sorted-array/"),
          difficulty: "Easy",
          description: "Two pointers converging from ends to create a single sorted sequence.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Median of 2 Sorted Arrays of Different Sizes",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/median-of-2-sorted-arrays-of-different-sizes/1"),
          difficulty: "Hard",
          description: "Find the median of two sorted arrays of different sizes.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given two sorted arrays \`nums1\` and \`nums2\` of sizes \`n1\` and \`n2\`, find the median of the combined sorted array in \`O(N)\` time without fully allocating a third merged array.

### 💡 Key Takeaways
- **Brute Force (O(N1 + N2) Time, O(N1 + N2) Space):**
  - Allocate a third array, merge both sorted arrays using two pointers, and pick the middle element(s).
- **Better Approach (O(N1 + N2) Time, O(1) Space):**
  - We only need the elements at indices \`(n1 + n2) / 2\` and \`(n1 + n2) / 2 - 1\`.
  - Simulate the two-pointer merge with a counter \`cnt\` without saving all elements.
  - Store only \`el1\` and \`el2\` when \`cnt\` reaches the target median indices.

### 💻 Space-Optimized Two-Pointer Blueprint
\`\`\`cpp
double findMedianSortedArraysBetter(vector<int> &a, vector<int> &b) {
    int n1 = a.size(), n2 = b.size();
    int n = n1 + n2;
    int ind2 = n / 2, ind1 = ind2 - 1;
    int cnt = 0, el1 = -1, el2 = -1;
    int i = 0, j = 0;

    while (i < n1 && j < n2) {
        if (a[i] <= b[j]) {
            if (cnt == ind1) el1 = a[i];
            if (cnt == ind2) el2 = a[i];
            cnt++; i++;
        } else {
            if (cnt == ind1) el1 = b[j];
            if (cnt == ind2) el2 = b[j];
            cnt++; j++;
        }
    }
    while (i < n1) {
        if (cnt == ind1) el1 = a[i];
        if (cnt == ind2) el2 = a[i];
        cnt++; i++;
    }
    while (j < n2) {
        if (cnt == ind1) el1 = b[j];
        if (cnt == ind2) el2 = b[j];
        cnt++; j++;
    }
    if (n % 2 == 1) return el2;
    return (double)(el1 + el2) / 2.0;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 66
    // -------------------------------------------------------------------------
    {
      order: 66,
      name: "Cross-Partition Symmetry: Median of Two Sorted Arrays in O(log(min(N1, N2))) Time",
      slug: "dsa-median-of-two-sorted-arrays-optimal-binary-search",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Find the median of two sorted arrays in O(log(min(N1, N2))) time and O(1) space using binary search cross-partition symmetry.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 66: Median of Two Sorted Arrays — Optimal Binary Search",
          url: cleanUrl("https://www.youtube.com/watch?v=F9c7LpRZWVQ"),
          duration: "35m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Median of Two Sorted Arrays (Optimal)",
          url: "https://takeuforward.org/data-structure/median-of-two-sorted-arrays-of-different-sizes/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Median of Two Sorted Arrays",
          url: cleanUrl("https://leetcode.com/problems/median-of-two-sorted-arrays/"),
          difficulty: "Hard",
          description: "Find the median of two sorted arrays in O(log(min(m, n))) runtime.",
        },
        {
          platform: "LeetCode",
          title: "Longest Subsequence With Limited Sum",
          url: cleanUrl("https://leetcode.com/problems/longest-subsequence-with-limited-sum/"),
          difficulty: "Easy",
          description: "Use prefix sums and binary search upper_bound to answer multiple range queries.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Median in a row-wise sorted Matrix",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1"),
          difficulty: "Hard",
          description: "Locate the median of a row-wise sorted matrix using binary search on answer value.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Find the median of two sorted arrays in **O(log(min(N1, N2))) time** and **O(1) space** using symmetry partitioning.

### 💡 Key Takeaways
- **Always Binary Search on the Shorter Array:**
  - If \`a.size() > b.size()\`, swap the call \`return findMedian(b, a)\` so the search range is minimized.
- **Partition Invariant (\`leftHalfSize = (n1 + n2 + 1) / 2\`):**
  - Divide the combined elements into a left half and right half.
  - Pick \`mid1\` elements from array \`a\`, and the remaining \`mid2 = leftHalfSize - mid1\` elements from array \`b\`.
  - Boundary elements:
    - \`l1 = a[mid1 - 1]\`, \`r1 = a[mid1]\`
    - \`l2 = b[mid2 - 1]\`, \`r2 = b[mid2]\`
    - Use \`INT_MIN\` if a left boundary has no elements, and \`INT_MAX\` if a right boundary has none.
- **Validity Condition:**
  - The partition is correct if **\`l1 <= r2 && l2 <= r1\`**!
  - If \`l1 > r2\`: Too many elements taken from \`a\`—search left (\`high = mid1 - 1\`).
  - If \`l2 > r1\`: Too few elements taken from \`a\`—search right (\`low = mid1 + 1\`).

### 💻 Optimal Binary Search Partition Blueprint
\`\`\`cpp
double findMedianSortedArrays(vector<int> &a, vector<int> &b) {
    int n1 = a.size(), n2 = b.size();
    if (n1 > n2) return findMedianSortedArrays(b, a);

    int low = 0, high = n1;
    int left = (n1 + n2 + 1) / 2;
    int n = n1 + n2;

    while (low <= high) {
        int mid1 = (low + high) >> 1;
        int mid2 = left - mid1;
        int l1 = (mid1 > 0) ? a[mid1 - 1] : INT_MIN;
        int l2 = (mid2 > 0) ? b[mid2 - 1] : INT_MIN;
        int r1 = (mid1 < n1) ? a[mid1] : INT_MAX;
        int r2 = (mid2 < n2) ? b[mid2] : INT_MAX;

        if (l1 <= r2 && l2 <= r1) {
            if (n % 2 == 1) return max(l1, l2);
            return ((double)(max(l1, l2) + min(r1, r2))) / 2.0;
        } else if (l1 > r2) {
            high = mid1 - 1;
        } else {
            low = mid1 + 1;
        }
    }
    return 0.0;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 67
    // -------------------------------------------------------------------------
    {
      order: 67,
      name: "Target-Rank Partitioning: K-th Element of Two Sorted Arrays",
      slug: "dsa-kth-element-of-two-sorted-arrays",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Find the K-th smallest element of two sorted arrays in O(log(min(N1, N2))) time using bounded partition binary search.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 67: K-th Element of Two Sorted Arrays",
          url: cleanUrl("https://www.youtube.com/watch?v=D1oDwWCq50g"),
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: K-th Element of Two Sorted Arrays",
          url: "https://takeuforward.org/data-structure/k-th-element-of-two-sorted-arrays/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Kth Smallest Element in a Sorted Matrix",
          url: cleanUrl("https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/"),
          difficulty: "Medium",
          description: "Find the kth smallest element in an n x n matrix where each row and column is sorted.",
        },
        {
          platform: "LeetCode",
          title: "Find K-th Smallest Pair Distance",
          url: cleanUrl("https://leetcode.com/problems/find-k-th-smallest-pair-distance/"),
          difficulty: "Hard",
          description: "Combine two-pointer counting with binary search on difference values.",
        },
        {
          platform: "GeeksforGeeks",
          title: "K-th element of two Arrays",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-arrays1317/1"),
          difficulty: "Medium",
          description: "Find the element that would be at the kth position in the final sorted array.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given two sorted arrays \`arr1\` and \`arr2\` and an integer \`k\`, find the element that would appear at index \`k - 1\` (1-based position \`k\`) in the merged sorted array in \`O(log(min(N1, N2)))\` time.

### 💡 Key Takeaways
- **Direct Extension of Median Partitioning:**
  - In Median, the left partition size was fixed at \`(n1 + n2 + 1) / 2\`.
  - In K-th Element, the left partition size is fixed at exactly **\`k\`**!
- **Search Space Bounds for \`mid1\`:**
  - \`low = max(0, k - n2)\`: If \`k > n2\`, even taking all elements of \`arr2\` is not enough, so we must take at least \`k - n2\` elements from \`arr1\`.
  - \`high = min(k, n1)\`: We cannot take more elements from \`arr1\` than its total size \`n1\`, nor more than \`k\`.
- **Result:**
  - Once \`l1 <= r2 && l2 <= r1\`, the k-th element is simply **\`max(l1, l2)\`**!

### 💻 K-th Element Blueprint
\`\`\`cpp
int kthElement(vector<int> &a, vector<int> &b, int n1, int n2, int k) {
    if (n1 > n2) return kthElement(b, a, n2, n1, k);

    int low = max(0, k - n2), high = min(k, n1);
    while (low <= high) {
        int mid1 = (low + high) >> 1;
        int mid2 = k - mid1;
        int l1 = (mid1 > 0) ? a[mid1 - 1] : INT_MIN;
        int l2 = (mid2 > 0) ? b[mid2 - 1] : INT_MIN;
        int r1 = (mid1 < n1) ? a[mid1] : INT_MAX;
        int r2 = (mid2 < n2) ? b[mid2] : INT_MAX;

        if (l1 <= r2 && l2 <= r1) {
            return max(l1, l2);
        } else if (l1 > r2) {
            high = mid1 - 1;
        } else {
            low = mid1 + 1;
        }
    }
    return 0;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 68
    // -------------------------------------------------------------------------
    {
      order: 68,
      name: "Row-Level Binary Search: Find the Row With Maximum Number of 1s in a Binary Matrix",
      slug: "dsa-row-with-maximum-number-of-1s",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Identify the row with the maximum number of 1s in an N x M row-sorted binary matrix in O(N * log M) time using lower bound.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 68: Find the row with maximum number of 1's",
          url: cleanUrl("https://www.youtube.com/watch?v=SCz-1TtYxDI"),
          duration: "24m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Find the row with maximum number of 1's",
          url: "https://takeuforward.org/data-structure/find-the-row-with-maximum-number-of-1s/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Row With Maximum Ones",
          url: cleanUrl("https://leetcode.com/problems/row-with-maximum-ones/"),
          difficulty: "Easy",
          description: "Count ones in each row and return the smallest row index with the maximum count.",
        },
        {
          platform: "LeetCode",
          title: "Count Negative Numbers in a Sorted Matrix",
          url: cleanUrl("https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/"),
          difficulty: "Easy",
          description: "Count negative numbers in a row-and-column sorted matrix in O(n + m) or O(n log m) time.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Row with max 1s",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/row-with-max-1s0023/1"),
          difficulty: "Medium",
          description: "Find the 0-based index of the first row that has the maximum number of 1s.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an \`N x M\` binary matrix where every row is sorted in non-decreasing order (\`0\`s followed by \`1\`s), find the row index with the **maximum number of 1s**. If multiple rows tie, return the smallest index.

### 💡 Key Takeaways
- **Row-Wise Lower Bound (O(N * log2 M) Time):**
  - Because each row is sorted, all \`1\`s appear consecutively at the end of the row.
  - The number of \`1\`s in row \`i\` is: \`m - firstOccurrenceOfOne(row[i])\` (where \`firstOccurrence\` is found using \`lower_bound\` for \`1\`).
- **Iteration:**
  - Loop \`i\` from \`0\` to \`n - 1\`.
  - Calculate \`countOnes = m - lowerBound(matrix[i], 1)\`.
  - If \`countOnes > maxCount\`, update \`maxCount = countOnes\` and \`index = i\`.
  - If \`maxCount == 0\`, return \`-1\`.

### 💻 Row With Maximum 1s Blueprint
\`\`\`cpp
int rowWithMax1s(vector<vector<int>> &matrix, int n, int m) {
    int maxCnt = 0, index = -1;
    for (int i = 0; i < n; i++) {
        // lower_bound gives first occurrence of 1 in the sorted row
        int firstOne = lower_bound(matrix[i].begin(), matrix[i].end(), 1) - matrix[i].begin();
        int countOnes = m - firstOne;
        if (countOnes > maxCnt) {
            maxCnt = countOnes;
            index = i;
        }
    }
    return index;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 69
    // -------------------------------------------------------------------------
    {
      order: 69,
      name: "Index Flattening & 2D Coordinates: Search in a Sorted 2D Matrix (Part I)",
      slug: "dsa-search-in-a-2d-matrix-flattening",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Search for target in an N x M sorted matrix in O(log(N * M)) time using virtual 1D index flattening with row = mid / m and col = mid % m.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 69: Search in a 2D Matrix — Part 1",
          url: cleanUrl("https://www.youtube.com/watch?v=JXU4Akft7yk"),
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Search in a 2D Matrix",
          url: "https://takeuforward.org/data-structure/search-in-a-2d-matrix/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Search a 2D Matrix",
          url: cleanUrl("https://leetcode.com/problems/search-a-2d-matrix/"),
          difficulty: "Medium",
          description: "Search for target in an m x n integer matrix with row-to-row strict sorted ordering.",
        },
        {
          platform: "LeetCode",
          title: "Search a 2D Matrix II",
          url: cleanUrl("https://leetcode.com/problems/search-a-2d-matrix-ii/"),
          difficulty: "Medium",
          description: "Search when rows and columns are sorted independently without global flattening.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Search in a matrix",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/search-in-a-matrix-1587115621/1"),
          difficulty: "Easy",
          description: "Determine whether a target integer exists in a sorted 2D matrix.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an \`N x M\` 2D matrix where every row is sorted and the first integer of each row is strictly greater than the last integer of the previous row, search for \`target\` in **O(log2(N * M)) time**.

### 💡 Key Takeaways
- **The 1D Coordinate Flattening Invariant:**
  - The entire matrix can be treated as a single virtual 1D sorted array of length \`N * M\` (indices \`0\` to \`N * M - 1\`).
  - **Conversion Formula:**
    - \`row = mid / m\`
    - \`col = mid % m\`
- **Pure Binary Search on Virtual Array:**
  - \`low = 0\`, \`high = n * m - 1\`.
  - Calculate \`val = matrix[mid / m][mid % m]\`.
  - If \`val == target\`: return \`true\`.
  - If \`val < target\`: \`low = mid + 1\`.
  - If \`val > target\`: \`high = mid - 1\`.

### 💻 Flattened 2D Binary Search Blueprint
\`\`\`cpp
bool searchMatrix(vector<vector<int>> &matrix, int target) {
    int n = matrix.size(), m = matrix[0].size();
    int low = 0, high = n * m - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        int row = mid / m;
        int col = mid % m;
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 70
    // -------------------------------------------------------------------------
    {
      order: 70,
      name: "Staircase Elimination: Search in a Row and Column-Wise Sorted Matrix (Part II)",
      slug: "dsa-search-in-a-2d-matrix-ii-staircase",
      subtrack: "Module 14: Multi-Array Partitioning & 2D Matrix Binary Search",
      description: "Search in an N x M matrix with independent row and column sorted properties in O(N + M) time using top-right corner staircase elimination.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 70: Search in a 2D Matrix — Part 2",
          url: cleanUrl("https://www.youtube.com/watch?v=9ZbB397jU4k"),
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Search in a row and column-wise sorted 2d matrix",
          url: "https://takeuforward.org/data-structure/search-in-a-row-and-column-wise-sorted-matrix/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Search a 2D Matrix II",
          url: cleanUrl("https://leetcode.com/problems/search-a-2d-matrix-ii/"),
          difficulty: "Medium",
          description: "Search for a target value in an m x n matrix sorted row-wise and column-wise.",
        },
        {
          platform: "LeetCode",
          title: "Kth Smallest Element in a Sorted Matrix",
          url: cleanUrl("https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/"),
          difficulty: "Medium",
          description: "Apply staircase counting inside binary search on value range.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Search in a row-column sorted matrix",
          url: cleanUrl("https://www.geeksforgeeks.org/problems/search-in-a-matrix17201720/1"),
          difficulty: "Medium",
          description: "Search a target in a 2D matrix where both rows and columns are sorted.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an \`N x M\` matrix where rows are sorted from left to right and columns are sorted from top to bottom (but the whole matrix is **not** flattened sequentially), find if \`target\` exists in **O(N + M) time**.

### 💡 Key Takeaways
- **Why Virtual Flattening Fails Here:**
  - The last element of row 0 is not necessarily smaller than the first element of row 1 (e.g., row 0 ends in 15, row 1 starts with 2). Flattening into a 1D binary search does not work.
- **The Top-Right (or Bottom-Left) Corner Invariant:**
  - Start at the top-right corner: \`row = 0\`, \`col = m - 1\`.
  - Notice the perpendicular properties of \`(row, col)\`:
    - Moving **left** (\`col--\`) decreases elements.
    - Moving **down** (\`row++\`) increases elements.
- **Staircase Elimination Loop (\`while (row < n && col >= 0)\`):**
  - If \`matrix[row][col] == target\`: Found! Return \`true\`.
  - If \`matrix[row][col] > target\`: Everything below in this column is even larger—eliminate column (\`col--\`).
  - If \`matrix[row][col] < target\`: Everything to the left in this row is even smaller—eliminate row (\`row++\`).
  - Maximum steps: At most \`N + M\` steps to traverse across the grid!

### 💻 Staircase Search Blueprint
\`\`\`cpp
bool searchMatrixII(vector<vector<int>> &matrix, int target) {
    int n = matrix.size(), m = matrix[0].size();
    int row = 0, col = m - 1; // Start at top-right corner

    while (row < n && col >= 0) {
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] > target) col--; // Eliminate column
        else row++; // Eliminate row
    }
    return false;
}
\`\`\``,
    },
  ];

  // 4. Upsert topics in database
  const topicIdMap = new Map();

  for (const topic of batch7Topics) {
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

  // 5. Update track_topics: Link Batch 7 Topics to topic_order 61 through 70
  console.log("\n🔄 Linking Batch 7 topics to 'problem-solving-dsa-sql' (orders 61..70)...");

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

  // Link Batch 7 Topics (orders 61..70)
  for (const topicDef of batch7Topics) {
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

  console.log("\n🎉 DSA Batch 7 (Lectures 61–70) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch7()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch7;
