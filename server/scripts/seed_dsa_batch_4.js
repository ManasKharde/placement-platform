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

const seedDsaBatch4 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 4 (Lectures 31–40) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 4 Topics (Lectures 31–40)
  const batch4Topics = [
    // =========================================================================
    // SUBTRACK 1: Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation (Topics 31–33)
    // =========================================================================
    {
      order: 31,
      name: "In-Place Matrix Transformation: Rotate Matrix / Image by 90 Degrees Clockwise",
      slug: "dsa-rotate-matrix-image-90-degrees",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Rotate an N x N matrix 90 degrees clockwise in-place using a 2-step diagonal transposition followed by horizontal row reversal.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 31: Rotate Image by 90 Degrees Clockwise",
          url: "https://www.youtube.com/watch?v=Z0R2u6gd3GU",
          duration: "25m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Rotate Image by 90 degree",
          url: "https://takeuforward.org/data-structure/rotate-image-by-90-degree/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Determine Whether Matrix Can Be Obtained By Rotation",
          url: "https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/",
          difficulty: "Easy",
          description: "Apply 90-degree matrix rotations repeatedly to check if one grid matches another.",
        },
        {
          platform: "LeetCode",
          title: "Transpose Matrix",
          url: "https://leetcode.com/problems/transpose-matrix/",
          difficulty: "Easy",
          description: "Practice swapping row and column indices across rectangular N x M matrices.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Rotate by 90 degree (Counter-Clockwise)",
          url: "https://www.geeksforgeeks.org/problems/rotate-by-90-degree-1587115621/1",
          difficulty: "Medium",
          description: "Rotate a square matrix 90 degrees anti-clockwise in O(1) extra space.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an \`N x N\` 2D square matrix representing an image, rotate the matrix by 90 degrees clockwise **in-place** (without allocating another 2D grid).

### 💡 Key Takeaways (Brute → Optimal)
- **1. Brute Force (O(N²) Time, O(N²) Extra Space):**
  - Create an auxiliary \`ans[N][N]\` grid.
  - Notice that row \`i\` of the original matrix becomes column \`N - 1 - i\` in the rotated matrix.
  - Mapping formula: \`ans[j][N - 1 - i] = matrix[i][j]\`.
- **2. Optimal In-Place 2-Step Transformation (O(N²) Time, O(1) Extra Space):**
  - **Step 1: Transpose the Matrix:**
    - Swap rows and columns across the main diagonal: \`swap(matrix[i][j], matrix[j][i])\`.
    - Loop \`i\` from \`0\` to \`n - 1\`, and \`j\` from \`i + 1\` to \`n - 1\` (only traverse above the diagonal so elements aren't swapped twice).
  - **Step 2: Reverse Every Row:**
    - Reverse each horizontal row using a two-pointer swap: \`reverse(matrix[i].begin(), matrix[i].end())\`.
    - Rotating clockwise by 90 degrees is simply: \`Transpose → Reverse Each Row\`!

### 💻 Optimal In-Place Rotation Blueprint
\`\`\`cpp
void rotateMatrix(vector<vector<int>> &matrix) {
    int n = matrix.size();
    // 1. Transpose in-place
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            swap(matrix[i][j], matrix[j][i]);
        }
    }
    // 2. Reverse each row
    for (int i = 0; i < n; i++) {
        reverse(matrix[i].begin(), matrix[i].end());
    }
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 32
    // -------------------------------------------------------------------------
    {
      order: 32,
      name: "Boundary-Bounded Layered Traversal: Spiral Traversal of a Matrix",
      slug: "dsa-spiral-traversal-matrix",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Traverse and unroll an N x M matrix spirally using 4 moving boundary pointers (top, bottom, left, right) in O(N * M) time.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 32: Spiral Traversal of a Matrix",
          url: "https://www.youtube.com/watch?v=3Zv-s9UUrFM",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Spiral Traversal of Matrix",
          url: "https://takeuforward.org/data-structure/spiral-traversal-of-matrix/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Spiral Matrix II",
          url: "https://leetcode.com/problems/spiral-matrix-ii/",
          difficulty: "Medium",
          description: "Generate an N x N matrix filled with elements from 1 to N^2 in spiral order.",
        },
        {
          platform: "LeetCode",
          title: "Spiral Matrix IV",
          url: "https://leetcode.com/problems/spiral-matrix-iv/",
          difficulty: "Medium",
          description: "Traverse an m x n grid spirally while populating values from a singly linked list.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Spirally traversing a matrix",
          url: "https://www.geeksforgeeks.org/problems/spirally-traversing-a-matrix-1587115621/1",
          difficulty: "Medium",
          description: "Return all elements of an N x M matrix in spiral order.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an \`N x M\` matrix, print or return all of its elements in clockwise spiral order (starting at \`(0,0)\`, moving right, down, left, up, and spiraling inward toward the center).

### 💡 Key Takeaways
- **The 4-Pointer Boundary Box:**
  - Maintain four boundary pointers: \`top = 0\`, \`bottom = n - 1\`, \`left = 0\`, and \`right = m - 1\`.
  - While \`top <= bottom\` and \`left <= right\`, process the perimeter in four clean steps:
    1. **Left → Right:** Traverse row \`top\` from column \`left\` to \`right\`. Then increment \`top++\`.
    2. **Top → Bottom:** Traverse column \`right\` from row \`top\` to \`bottom\`. Then decrement \`right--\`.
    3. **Right → Left (Guarded by \`top <= bottom\`):** Traverse row \`bottom\` from column \`right\` down to \`left\`. Then decrement \`bottom--\`.
    4. **Bottom → Top (Guarded by \`left <= right\`):** Traverse column \`left\` from row \`bottom\` up to \`top\`. Then increment \`left++\`.
- **Complexity:** Visits every cell exactly once → \`O(N * M)\` Time and \`O(1)\` Auxiliary Space.

### 💻 Spiral Matrix Blueprint
\`\`\`cpp
vector<int> spiralOrder(vector<vector<int>> &matrix) {
    int n = matrix.size(), m = matrix[0].size();
    int top = 0, bottom = n - 1, left = 0, right = m - 1;
    vector<int> ans;

    while (top <= bottom && left <= right) {
        // 1. Move Right
        for (int i = left; i <= right; i++) ans.push_back(matrix[top][i]);
        top++;
        // 2. Move Down
        for (int i = top; i <= bottom; i++) ans.push_back(matrix[i][right]);
        right--;
        // 3. Move Left
        if (top <= bottom) {
            for (int i = right; i >= left; i--) ans.push_back(matrix[bottom][i]);
            bottom--;
        }
        // 4. Move Up
        if (left <= right) {
            for (int i = bottom; i >= top; i--) ans.push_back(matrix[i][left]);
            left++;
        }
    }
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 33
    // -------------------------------------------------------------------------
    {
      order: 33,
      name: "Prefix Sum Frequency Hashing: Count Subarray Sum Equals K",
      slug: "dsa-count-subarray-sum-equals-k",
      subtrack: "Module 10: Array Permutations, Sequence Hashing & In-Place Matrix Manipulation",
      description: "Count all contiguous subarrays summing to K in O(N) time and O(N) space using prefix sum frequency tracking with a pre-seeded base map.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 33: Count Subarray sum Equals K",
          url: "https://www.youtube.com/watch?v=xvNwoz-ufXA",
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count Subarray sum Equals K",
          url: "https://takeuforward.org/arrays/count-subarray-sum-equals-k/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Continuous Subarray Sum",
          url: "https://leetcode.com/problems/continuous-subarray-sum/",
          difficulty: "Medium",
          description: "Use prefix sum modulo hashing to check if any subarray of length >= 2 sums to a multiple of k.",
        },
        {
          platform: "LeetCode",
          title: "Binary Subarrays With Sum",
          url: "https://leetcode.com/problems/binary-subarrays-with-sum/",
          difficulty: "Medium",
          description: "Count binary subarrays with target sum using prefix map or sliding window difference.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Subarrays with sum K",
          url: "https://www.geeksforgeeks.org/problems/subarrays-with-sum-k/1",
          difficulty: "Medium",
          description: "Count the total number of subarrays having sum equal to K.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array containing positive numbers, negative numbers, and zeros, find the **total count** of contiguous subarrays that sum up to \`K\`.

### 💡 Key Takeaways (Brute → Better → Optimal)
- **1. Brute Force (O(N³) or O(N²) Time):**
  - Check all possible subarrays \`[i ... j]\` and increment a counter whenever \`sum == K\`.
- **2. Optimal Prefix Sum + Frequency Map (O(N) Time, O(N) Space):**
  - As you iterate, calculate the running prefix sum \`prefixSum\`.
  - If a subarray ending at the current index sums to \`K\`, then some earlier prefix sum must have equaled \`remove = prefixSum - K\`.
  - The total number of valid subarrays ending right here is exactly the number of times \`remove\` appeared in the past: \`cnt += mpp[prefixSum - K]\`.
  - Store how often each prefix sum occurs: \`mpp[prefixSum]++\`.
- **Why Pre-Populating \`mpp[0] = 1\` Is Essential:**
  - If a subarray starting at index \`0\` sums directly to \`K\` (meaning \`prefixSum - K == 0\`), \`mpp[0] = 1\` ensures this subarray is counted immediately.

### 💻 Count Subarrays Sum Equals K Blueprint
\`\`\`cpp
int subarraySum(vector<int> &nums, int k) {
    unordered_map<int, int> mpp;
    mpp[0] = 1; // Base condition: prefix sum of 0 has occurred once
    int preSum = 0, cnt = 0;

    for (int x : nums) {
        preSum += x;
        int remove = preSum - k;
        if (mpp.find(remove) != mpp.end()) {
            cnt += mpp[remove];
        }
        mpp[preSum]++;
    }
    return cnt;
}
\`\`\``,
    },

    // =========================================================================
    // SUBTRACK 2: Module 11: Advanced Array Patterns & Hard Interview Problems (Topics 34–40)
    // =========================================================================
    {
      order: 34,
      name: "Combinatorial Invariants & Row Generation: Pascal's Triangle (Element, Row & Full Grid)",
      slug: "dsa-pascals-triangle-combinatorics-row-generation",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Master all 3 variations of Pascal's Triangle: single element lookup using nCr formulas, full row generation in O(N) time, and complete grid synthesis in O(N²).",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 34: Pascal's Triangle — Element, Row & Full Grid Generation",
          url: "https://www.youtube.com/watch?v=bR7mQgwQ_o8",
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Program to generate Pascal's Triangle",
          url: "https://takeuforward.org/data-structure/program-to-generate-pascals-triangle/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Pascal's Triangle II",
          url: "https://leetcode.com/problems/pascals-triangle-ii/",
          difficulty: "Easy",
          description: "Return only the kth row of Pascal's Triangle using O(K) extra space.",
        },
        {
          platform: "LeetCode",
          title: "Find Triangular Sum of an Array",
          url: "https://leetcode.com/problems/find-triangular-sum-of-an-array/",
          difficulty: "Medium",
          description: "Simulate adjacent triangular reductions modulo 10.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Pascal Triangle",
          url: "https://www.geeksforgeeks.org/problems/pascal-triangle0652/1",
          difficulty: "Easy",
          description: "Generate the Nth row of Pascal's Triangle modulo 10^9 + 7.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
In Pascal's Triangle, the first and last element of each row is \`1\`, and every other number is the sum of the two numbers directly above it. Interviewers test 3 distinct variations of this problem:
1. **Variation 1:** Find the single element at row \`R\`, column \`C\`.
2. **Variation 2:** Print the entire \`Nth\` row.
3. **Variation 3:** Generate the full triangle of \`N\` rows.

### 💡 Key Takeaways
- **Variation 1 (Element at Row \`R\`, Column \`C\`):**
  - Uses the combinatorics formula: \`Element = (R - 1) C (C - 1)\` (nCr).
  - Compute \`nCr\` in \`O(R)\` time without full factorials by multiplying and dividing on the fly:
    \`res = res * (n - i) / (i + 1)\`.
- **Variation 2 (Generate an Entire Row \`N\` in O(N) Time):**
  - Start with \`ans = 1\`.
  - For column \`col\` from \`1\` to \`row - 1\`, compute the next value iteratively from the previous one:
    \`ans = ans * (row - col) / col\`.
- **Variation 3 (Generate Full Triangle in O(N²) Time):**
  - Call the \`O(row)\` row-generator for every row from \`1\` to \`N\`. This avoids \`O(N³)\` brute-force combinations.

### 💻 Optimal Row Generator Blueprint
\`\`\`cpp
vector<long long> generateRow(int row) {
    long long ans = 1;
    vector<long long> rowList;
    rowList.push_back(1); // 0th column is always 1
    for (int col = 1; col < row; col++) {
        ans = ans * (row - col);
        ans = ans / col;
        rowList.push_back(ans);
    }
    return rowList;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 35
    // -------------------------------------------------------------------------
    {
      order: 35,
      name: "Multi-Candidate Voting Elimination: Majority Element II (> N/3 Occurrences)",
      slug: "dsa-majority-element-ii-extended-moore-voting",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Find all elements appearing strictly more than N/3 times using Extended Moore's Voting Algorithm with 2 candidate slots and an essential verification pass.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 35: Majority Elements (> N/3 times) — Find the elements that appears more than N/3 times in the array",
          url: "https://www.youtube.com/watch?v=vwZj1K0e9U8",
          duration: "30m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Majority Elements(>N/3 times) | Find the elements that appears more than N/3 times in the array",
          url: "https://takeuforward.org/data-structure/majority-elementsn-3-times-find-the-elements-that-appears-more-than-n-3-times-in-the-array/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Majority Element",
          url: "https://leetcode.com/problems/majority-element/",
          difficulty: "Easy",
          description: "Contrast the N/3 algorithm with the single-candidate N/2 baseline.",
        },
        {
          platform: "LeetCode",
          title: "Sort Characters By Frequency",
          url: "https://leetcode.com/problems/sort-characters-by-frequency/",
          difficulty: "Medium",
          description: "Use frequency mapping and bucket sorting to group elements by occurrence counts.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Majority Vote",
          url: "https://www.geeksforgeeks.org/problems/majority-vote/1",
          difficulty: "Medium",
          description: "Find all elements appearing more than N/3 times in an array.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Find all elements that appear **strictly more than \`floor(N / 3)\` times** in an array of size \`N\`.

### 💡 Key Takeaways
- **Mathematical Bound:** In any array of size \`N\`, there can be **at most 2 elements** that appear more than \`N / 3\` times (since \`3 * (floor(N / 3) + 1) > N\`).
- **Extended Moore's Voting Algorithm (O(N) Time, O(1) Space):**
  - Maintain two candidate variables (\`el1\`, \`el2\`) and two counters (\`cnt1 = 0\`, \`cnt2 = 0\`).
  - Scan the array:
    1. If \`cnt1 == 0 && arr[i] != el2\`: Assign \`el1 = arr[i]\`, \`cnt1 = 1\`.
    2. Else if \`cnt2 == 0 && arr[i] != el1\`: Assign \`el2 = arr[i]\`, \`cnt2 = 1\`.
    3. Else if \`arr[i] == el1\`: Increment \`cnt1++\`.
    4. Else if \`arr[i] == el2\`: Increment \`cnt2++\`.
    5. Else: A distinct third number is seen—decrement **both** \`cnt1--\` and \`cnt2--\`!
- **Mandatory Verification Pass:**
  - Candidates found are not guaranteed to have frequency \`> N / 3\`.
  - Count actual occurrences of \`el1\` and \`el2\` in a second pass before adding them to the result.

### 💻 Extended Moore's Voting Blueprint
\`\`\`cpp
vector<int> majorityElementTwo(vector<int> &nums) {
    int cnt1 = 0, cnt2 = 0, el1 = INT_MIN, el2 = INT_MIN;
    for (int x : nums) {
        if (cnt1 == 0 && x != el2) { el1 = x; cnt1 = 1; }
        else if (cnt2 == 0 && x != el1) { el2 = x; cnt2 = 1; }
        else if (x == el1) cnt1++;
        else if (x == el2) cnt2++;
        else { cnt1--; cnt2--; }
    }
    vector<int> ans;
    int c1 = 0, c2 = 0;
    for (int x : nums) {
        if (x == el1) c1++;
        if (x == el2) c2++;
    }
    int mini = nums.size() / 3 + 1;
    if (c1 >= mini) ans.push_back(el1);
    if (c2 >= mini) ans.push_back(el2);
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 36
    // -------------------------------------------------------------------------
    {
      order: 36,
      name: "Tri-Pointer Converging Sums: 3 Sum Problem (Unique Triplets Summing to Zero)",
      slug: "dsa-3-sum-unique-triplets-two-pointers",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Find all unique zero-sum triplets using sorted two-pointer convergence in O(N²) time and O(1) extra space while gracefully skipping duplicates.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 36: 3 Sum — Find all unique triplets that sums up to zero",
          url: "https://www.youtube.com/watch?v=DhFh8Kw7ymk",
          duration: "38m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: 3 Sum : Find triplets that add up to a zero",
          url: "https://takeuforward.org/data-structure/3-sum-find-triplets-that-add-up-to-a-zero/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "3Sum Closest",
          url: "https://leetcode.com/problems/3sum-closest/",
          difficulty: "Medium",
          description: "Use sorted tri-pointer convergence to find the three integers whose sum is closest to target.",
        },
        {
          platform: "LeetCode",
          title: "3Sum Smaller",
          url: "https://leetcode.com/problems/3sum-smaller/",
          difficulty: "Medium",
          description: "Count the number of triplets whose sum is strictly less than target.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Triplet Sum in Array",
          url: "https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1",
          difficulty: "Medium",
          description: "Determine if there exists a triplet in the array whose sum equals a given target.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of integers, find all **unique triplets** \`[nums[i], nums[j], nums[k]]\` such that \`i != j != k\` and \`nums[i] + nums[j] + nums[k] == 0\`. The result must not contain duplicate triplets.

### 💡 Key Takeaways (Brute → Better → Optimal)
- **1. Brute Force (O(N³) Time):** Three nested loops with a \`set<vector<int>>\` to filter duplicates.
- **2. Better Approach via Hashing (O(N²) Time, O(N) Space):** Fix \`i\` and \`j\`, then check if \`-(nums[i] + nums[j])\` exists in a hash set. Still requires a set of vectors for deduplication.
- **3. Optimal Sorted Two-Pointer Approach (O(N log N + N²) Time, O(1) Extra Space):**
  - Sort the array first.
  - Fix the first element using loop \`i\` from \`0\` to \`n - 1\`. If \`i > 0 && nums[i] == nums[i - 1]\`, skip it to avoid duplicates.
  - Place \`j = i + 1\` (left pointer) and \`k = n - 1\` (right pointer).
  - While \`j < k\`:
    - If \`sum < 0\`: Increment \`j++\` to increase the sum.
    - If \`sum > 0\`: Decrement \`k--\` to decrease the sum.
    - If \`sum == 0\`: Found a valid triplet! Push to result, increment \`j++\`, decrement \`k--\`, and **skip all identical neighboring duplicates** with while loops.

### 💻 Optimal 3Sum Blueprint
\`\`\`cpp
vector<vector<int>> threeSum(vector<int> &nums) {
    int n = nums.size();
    vector<vector<int>> ans;
    sort(nums.begin(), nums.end());

    for (int i = 0; i < n; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // Skip duplicate i
        int j = i + 1, k = n - 1;
        while (j < k) {
            int sum = nums[i] + nums[j] + nums[k];
            if (sum < 0) {
                j++;
            } else if (sum > 0) {
                k--;
            } else {
                ans.push_back({nums[i], nums[j], nums[k]});
                j++; k--;
                while (j < k && nums[j] == nums[j - 1]) j++; // Skip duplicate j
                while (j < k && nums[k] == nums[k + 1]) k--; // Skip duplicate k
            }
        }
    }
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 37
    // -------------------------------------------------------------------------
    {
      order: 37,
      name: "Quad-Pointer Sorted Search: 4 Sum Problem (Unique Quadruplets Summing to Target)",
      slug: "dsa-4-sum-unique-quadruplets-sorted-pointers",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Extend tri-pointer sorting to find all unique quadruplets summing to target in O(N³) time and O(1) space with 64-bit integer overflow protection.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 37: 4 Sum — Find Quads that add up to a target value",
          url: "https://www.youtube.com/watch?v=eD95WRfh81c",
          duration: "34m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: 4 Sum | Find Quads that add up to a target value",
          url: "https://takeuforward.org/data-structure/4-sum-find-quads-that-add-up-to-a-target-value/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "4Sum II",
          url: "https://leetcode.com/problems/4sum-ii/",
          difficulty: "Medium",
          description: "Count tuples from four independent arrays summing to zero using hash map pair lookups.",
        },
        {
          platform: "LeetCode",
          title: "Valid Triangle Number",
          url: "https://leetcode.com/problems/valid-triangle-number/",
          difficulty: "Medium",
          description: "Apply sorted pointer convergence to count triplets that can form valid triangles.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Find all four sum numbers",
          url: "https://www.geeksforgeeks.org/problems/find-all-four-sum-numbers1732/1",
          difficulty: "Medium",
          description: "Find all unique quadruplets in an array whose elements sum to a given target.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array and a \`target\`, find all **unique quadruplets** \`[nums[i], nums[j], nums[k], nums[l]]\` such that all four indices are distinct and their values add up to \`target\`.

### 💡 Key Takeaways
- **Generalizing From 3Sum:**
  - 3Sum fixes 1 element and converges 2 pointers (\`O(N²)\`).
  - 4Sum fixes **2 elements** (\`i\` and \`j\`) with nested loops and converges **2 pointers** (\`k = j + 1\` and \`l = n - 1\`) in \`O(N³)\` time.
- **Optimal Steps (O(N³) Time, O(1) Extra Space):**
  - Sort the array first.
  - Loop \`i\` from \`0\` to \`n - 1\`. If \`i > 0 && nums[i] == nums[i - 1]\`, skip duplicates.
  - Loop \`j\` from \`i + 1\` to \`n - 1\`. If \`j > i + 1 && nums[j] == nums[j - 1]\`, skip duplicates.
  - Converge \`k\` and \`l\`:
    - Use \`long long sum = (long long)nums[i] + nums[j] + nums[k] + nums[l]\`.
    - If \`sum < target\`: \`k++\`.
    - If \`sum > target\`: \`l--\`.
    - If \`sum == target\`: Push quadruplet, adjust \`k++\`, \`l--\`, and skip matching duplicate values of \`k\` and \`l\`.

### 💻 Optimal 4Sum Blueprint
\`\`\`cpp
vector<vector<int>> fourSum(vector<int> &nums, int target) {
    int n = nums.size();
    vector<vector<int>> ans;
    sort(nums.begin(), nums.end());

    for (int i = 0; i < n; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int k = j + 1, l = n - 1;
            while (k < l) {
                long long sum = (long long)nums[i] + nums[j] + nums[k] + nums[l];
                if (sum == target) {
                    ans.push_back({nums[i], nums[j], nums[k], nums[l]});
                    k++; l--;
                    while (k < l && nums[k] == nums[k - 1]) k++;
                    while (k < l && nums[l] == nums[l + 1]) l--;
                } else if (sum < target) k++;
                else l--;
            }
        }
    }
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 38
    // -------------------------------------------------------------------------
    {
      order: 38,
      name: "Prefix XOR & Mathematical Inversion: Count Subarrays With Given XOR K",
      slug: "dsa-count-subarrays-with-xor-k",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Count all contiguous subarrays having bitwise XOR equal to K in O(N) time and O(N) space using running prefix XOR cancellation and hash map lookups.",
      estimatedMinutes: 40,
      videoLinks: [
        {
          title: "Lecture 38: Count the number of subarrays with given xor K",
          url: "https://www.youtube.com/watch?v=eZr-6p0B7ME",
          duration: "28m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Count the number of subarrays with given xor K",
          url: "https://takeuforward.org/data-structure/count-the-number-of-subarrays-with-given-xor-k/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "XOR Queries of a Subarray",
          url: "https://leetcode.com/problems/xor-queries-of-a-subarray/",
          difficulty: "Medium",
          description: "Precompute prefix XOR arrays to answer range XOR queries in O(1) time.",
        },
        {
          platform: "LeetCode",
          title: "Bitwise XOR of All Pairings",
          url: "https://leetcode.com/problems/bitwise-xor-of-all-pairings/",
          difficulty: "Medium",
          description: "Apply parity of length and XOR cancellation properties across arrays.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Subarrays with given XOR",
          url: "https://www.geeksforgeeks.org/problems/subarrays-with-given-xor/1",
          difficulty: "Medium",
          description: "Count the number of subarrays having bitwise XOR equal to K.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of integers, find the total number of contiguous subarrays having bitwise XOR equal to \`K\`.

### 💡 Key Takeaways
- **The Mathematical Derivation:**
  - Let the running XOR from index \`0\` to \`i\` be \`XR\`.
  - Suppose there exists an earlier prefix with XOR \`X\`, followed by our target subarray with XOR \`K\`.
  - Then: \`X ^ K = XR\`.
  - XORing both sides by \`K\` gives: \`X ^ (K ^ K) = XR ^ K\` → **\`X = XR ^ K\`** (since \`K ^ K = 0\`).
  - Therefore, whenever the running XOR is \`XR\`, we simply need to count how many times an earlier prefix had XOR equal to \`XR ^ K\`!
- **Optimal Hash Map Algorithm (O(N) Time, O(N) Space):**
  - Pre-populate \`mpp[0] = 1\` (to account for target subarrays that start at index \`0\`).
  - As you iterate, maintain \`xr = xr ^ arr[i]\`.
  - Look up the required prefix in the map: \`cnt += mpp[xr ^ k]\`.
  - Increment current prefix frequency: \`mpp[xr]++\`.

### 💻 Count Subarrays With XOR K Blueprint
\`\`\`cpp
int subarraysWithXorK(vector<int> &a, int k) {
    int xr = 0, cnt = 0;
    unordered_map<int, int> mpp;
    mpp[0] = 1; // Base case: prefix XOR of 0 has occurred once

    for (int x : a) {
        xr = xr ^ x;
        int target = xr ^ k;
        if (mpp.find(target) != mpp.end()) {
            cnt += mpp[target];
        }
        mpp[xr]++;
    }
    return cnt;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 39
    // -------------------------------------------------------------------------
    {
      order: 39,
      name: "Interval Sorting & Boundary Expansion: Merge Overlapping Sub-Intervals",
      slug: "dsa-merge-overlapping-intervals",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Sort intervals by start time and dynamically expand right boundaries in a single O(N log N) pass with O(1) extra space.",
      estimatedMinutes: 45,
      videoLinks: [
        {
          title: "Lecture 39: Merge Overlapping Sub-intervals",
          url: "https://www.youtube.com/watch?v=IexN60k62jo",
          duration: "32m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Merge Overlapping Sub-intervals",
          url: "https://takeuforward.org/data-structure/merge-overlapping-sub-intervals/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Insert Interval",
          url: "https://leetcode.com/problems/insert-interval/",
          difficulty: "Medium",
          description: "Insert a new interval into a sorted list of non-overlapping intervals and merge if necessary.",
        },
        {
          platform: "LeetCode",
          title: "Non-overlapping Intervals",
          url: "https://leetcode.com/problems/non-overlapping-intervals/",
          difficulty: "Medium",
          description: "Find the minimum number of intervals to remove to make the rest non-overlapping.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Overlapping Intervals",
          url: "https://www.geeksforgeeks.org/problems/overlapping-intervals--170633/1",
          difficulty: "Medium",
          description: "Merge all overlapping intervals in-place and return the sorted result.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given an array of intervals where \`intervals[i] = [start, end]\`, merge all overlapping intervals and return an array of non-overlapping intervals that cover all the original intervals.

### 💡 Key Takeaways
- **Sort by Start Time:** Sorting intervals by their start time (\`intervals.begin(), intervals.end()\`) ensures that any intervals that could potentially overlap are placed next to each other.
- **Optimal Single-Pass Merge (O(N log N) Time, O(1) Extra Space):**
  - Iterate through the sorted intervals:
    1. If \`ans\` is empty or the current interval's \`start\` is strictly greater than the last merged interval's \`end\` (\`intervals[i][0] > ans.back()[1]\`), it cannot overlap—push \`intervals[i]\` as a new interval into \`ans\`.
    2. Otherwise, it overlaps with the last interval in \`ans\`! Expand the end boundary:
       \`ans.back()[1] = max(ans.back()[1], intervals[i][1])\`.

### 💻 Merge Overlapping Intervals Blueprint
\`\`\`cpp
vector<vector<int>> mergeIntervals(vector<vector<int>> &intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> ans;

    for (int i = 0; i < intervals.size(); i++) {
        // If current interval does not overlap with last merged interval
        if (ans.empty() || intervals[i][0] > ans.back()[1]) {
            ans.push_back(intervals[i]);
        } else {
            // Overlaps: expand current boundary
            ans.back()[1] = max(ans.back()[1], intervals[i][1]);
        }
    }
    return ans;
}
\`\`\``,
    },

    // -------------------------------------------------------------------------
    // Topic 40
    // -------------------------------------------------------------------------
    {
      order: 40,
      name: "In-Place Sorted Array Merging: Two-Pointer Swap & Shell-Sort Gap Method",
      slug: "dsa-merge-two-sorted-arrays-without-extra-space",
      subtrack: "Module 11: Advanced Array Patterns & Hard Interview Problems",
      description: "Merge two sorted arrays in-place without extra space using the cross-array two-pointer swap method or the Shell-sort gap reduction algorithm.",
      estimatedMinutes: 50,
      videoLinks: [
        {
          title: "Lecture 40: Merge two Sorted Arrays Without Extra Space",
          url: "https://www.youtube.com/watch?v=n7uwj04E0I4",
          duration: "36m",
        },
      ],
      docLinks: [
        {
          title: "TakeUForward: Merge two Sorted Arrays Without Extra Space",
          url: "https://takeuforward.org/data-structure/merge-two-sorted-arrays-without-extra-space/",
        },
      ],
      practiceItems: [
        {
          platform: "LeetCode",
          title: "Merge Sorted Array (In-Place from Back)",
          url: "https://leetcode.com/problems/merge-sorted-array/",
          difficulty: "Easy",
          description: "Merge two sorted arrays using a backward three-pointer approach into nums1.",
        },
        {
          platform: "LeetCode",
          title: "Squares of a Sorted Array",
          url: "https://leetcode.com/problems/squares-of-a-sorted-array/",
          difficulty: "Easy",
          description: "Use two pointers converging from both ends to build a sorted squared array.",
        },
        {
          platform: "GeeksforGeeks",
          title: "Merge Without Extra Space",
          url: "https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1",
          difficulty: "Hard",
          description: "Merge two sorted arrays in-place without using any auxiliary data structure.",
        },
      ],
      summaryMarkdown: `### 📌 Topic Overview
Given two sorted arrays \`arr1\` (size \`N\`) and \`arr2\` (size \`M\`), merge them in-place so that \`arr1\` contains the first \`N\` smallest elements in sorted order and \`arr2\` contains the remaining \`M\` elements in sorted order, **without using any extra space**.

### 💡 Key Takeaways (2 Optimal Solutions)
- **Optimal Approach 1: Two-Pointer Swap + Sort (O(min(N, M) + N log N + M log M) Time, O(1) Space):**
  - Place \`left = n - 1\` at the end of \`arr1\` (largest element) and \`right = 0\` at the start of \`arr2\` (smallest element).
  - If \`arr1[left] > arr2[right]\`, swap them and move \`left--\`, \`right++\`.
  - The moment \`arr1[left] <= arr2[right]\`, stop.
  - Sort both \`arr1\` and \`arr2\` individually to restore sorted order within each array.
- **Optimal Approach 2: Shell Sort "Gap Method" (O((N + M) * log(N + M)) Time, O(1) Space):**
  - Treat both arrays as one virtual array of length \`len = N + M\`.
  - Initialize \`gap = ceil(len / 2.0)\`.
  - Compare and swap elements at distance \`gap\` (\`left\` and \`right = left + gap\`).
  - After each pass, reduce \`gap = ceil(gap / 2.0)\` until \`gap == 0\`.

### 💻 Two-Pointer Swap Blueprint
\`\`\`cpp
void merge(vector<int> &arr1, vector<int> &arr2, int n, int m) {
    int left = n - 1, right = 0;
    while (left >= 0 && right < m) {
        if (arr1[left] > arr2[right]) {
            swap(arr1[left], arr2[right]);
            left--;
            right++;
        } else {
            break; // Elements are partitioned correctly
        }
    }
    sort(arr1.begin(), arr1.end());
    sort(arr2.begin(), arr2.end());
}
\`\`\``,
    },
  ];

  // 4. Upsert topics in database
  const topicIdMap = new Map();

  for (const topic of batch4Topics) {
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

  // 5. Update track_topics: Link Batch 4 Topics to topic_order 31 through 40
  console.log("\n🔄 Linking Batch 4 topics to 'problem-solving-dsa-sql' (orders 31..40)...");

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

  // Link Batch 4 Topics (orders 31..40)
  for (const topicDef of batch4Topics) {
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

  console.log("\n🎉 DSA Batch 4 (Lectures 31–40) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch4()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch4;
