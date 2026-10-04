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

const seedDsaBatch30 = async () => {
  console.log("🚀 Starting DSA Curriculum Batch 30 (Lectures 291–300) Seeding (Zero LaTeX / Beginner-Friendly)...");

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

  // 3. Define the 10 Expressive Batch 30 Topics (Lectures 291–300)
  const batch30Topics = [
    // =========================================================================
    // SUBTRACK: Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling (Topics 291–296)
    // =========================================================================
    {
      order: 291,
      name: "Complement of Maximum Interval Packing: Non-Overlapping Intervals",
      slug: "dsa-non-overlapping-intervals-greedy",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=HDHQ8lAWakY",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given an array of \`N\` intervals where \`intervals[i] = [start_i, end_i]\`, return the **minimum number of intervals you need to remove** to make the rest of the intervals non-overlapping. Note that intervals touching only at their boundary (such as \`[1, 2]\` and \`[2, 3]\`) are **considered non-overlapping**.

### 💡 Key Takeaways
- **The Exact Inverse of "N Meetings in One Room" (Topic 290!):**
  - Instead of asking *"Which intervals should we remove?"*, flip the question:
    **"What is the MAXIMUM number of non-overlapping intervals (\`cnt\`) we can keep?"**
  - Once we find the maximum number of compatible intervals \`cnt\` using the exact *N Meetings in One Room* greedy algorithm, the minimum number of removals is simply:
    **\`Minimum Removals = N - cnt\`**!
- **Boundary Difference From N Meetings (\`>=\` Instead of \`>\`):**
  - Sort \`intervals\` in **ascending order of \`end\` time** (\`a[1] < b[1]\`).
  - Pick the first interval: \`cnt = 1\`, \`lastEndTime = intervals[0][1]\`.
  - Loop \`i\` from \`1\` to \`N - 1\`:
    - Because touching endpoints like \`[1, 2]\` and \`[2, 3]\` are allowed here, check **\`if (intervals[i][0] >= lastEndTime)\`**:
      - Increment \`cnt++\` and update \`lastEndTime = intervals[i][1]\`.
  - Return **\`N - cnt\`**.
- **Complexity:** \`O(N log N + N)\` Time and \`O(1)\` Auxiliary Space.

### 💻 Non-Overlapping Intervals Blueprint
\`\`\`cpp
static bool comp(const vector<int> &a, const vector<int> &b) {
    return a[1] < b[1]; // Sort by end time ascending!
}

int eraseOverlapIntervals(vector<vector<int>> &intervals) {
    int n = intervals.size();
    if (n == 0) return 0;

    // 1. Sort intervals by earliest ending time
    sort(intervals.begin(), intervals.end(), comp);

    // 2. Count the maximum number of non-overlapping intervals we can keep
    int cnt = 1;
    int lastEndTime = intervals[0][1];

    for (int i = 1; i < n; i++) {
        // Touching endpoints (e.g., [1, 2] and [2, 3]) do NOT overlap -> use >=
        if (intervals[i][0] >= lastEndTime) {
            cnt++;
            lastEndTime = intervals[i][1];
        }
    }

    // 3. Minimum removals = Total intervals - Maximum kept intervals
    return n - cnt;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Sorting by Start Time (\`a[0] < b[0]\`) Without Adjusting \`lastEndTime\` on Overlap:** Sorting by **end time (\`a[1] < b[1]\`)** is much cleaner and directly reuses the *N Meetings in One Room* logic.`),
      practiceItems: [
        {
          title: "LeetCode 435: Non-overlapping Intervals",
          url: "https://leetcode.com/problems/non-overlapping-intervals/",
          difficulty: "Medium",
          description: "Given an array of intervals, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping."
        },
        {
          title: "LeetCode 452: Minimum Number of Arrows to Burst Balloons",
          url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
          difficulty: "Medium",
          description: "Sort balloon horizontal intervals by end coordinate to find the minimum arrows needed to burst all balloons."
        },
        {
          title: "GeeksforGeeks: Non Overlapping Intervals",
          url: "https://www.geeksforgeeks.org/problems/non-overlapping-intervals/1",
          difficulty: "Medium",
          description: "Find the minimum number of intervals to remove so that no two remaining intervals overlap."
        }
      ]
    },

    {
      order: 292,
      name: "Three-Phase Linear Interval Partitioning: Insert Interval",
      slug: "dsa-insert-interval-greedy-three-phase-scan",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=xxRE-46OCC8",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
You are given an array of non-overlapping \`intervals\` **already sorted in ascending order by start time**, and a \`newInterval = [start, end]\`. Insert \`newInterval\` into \`intervals\` such that the result remains sorted and non-overlapping (merging any overlapping intervals in-place along the way).

### 💡 Key Takeaways
- **Why We Don't Need \`O(N log N)\` Sorting:**
  - Because \`intervals\` is **already sorted and non-overlapping**, inserting \`newInterval\` splits the array into **3 contiguous zones** that we can process in a single **\`O(N)\` linear scan** (\`i\` from \`0\` to \`N - 1\`):
  1. **Phase 1 — Strictly Left Non-Overlapping Zone (\`intervals[i][1] < newInterval[0]\`):**
     - Any interval that **ends strictly before \`newInterval\` starts** cannot overlap with \`newInterval\`. Push \`intervals[i]\` directly into \`res\` and increment \`i++\`.
  2. **Phase 2 — Overlapping Middle Zone (\`intervals[i][0] <= newInterval[1]\`):**
     - Once Phase 1 finishes, any interval whose **start time is \`<= newInterval\`'s end time** overlaps with \`newInterval\`!
     - Absorb \`intervals[i]\` into \`newInterval\` by expanding its bounds:
       - **\`newInterval[0] = min(newInterval[0], intervals[i][0]);\`**
       - **\`newInterval[1] = max(newInterval[1], intervals[i][1]);\`**
     - After the \`while\` loop ends, push the merged \`newInterval\` into \`res\`.
  3. **Phase 3 — Strictly Right Non-Overlapping Zone (\`while (i < n)\`):**
     - All remaining intervals start strictly after \`newInterval[1]\`. Push them directly into \`res\`!
- **Complexity:** **\`O(N)\`** Time and **\`O(N)\`** Space (to return the result array).

### 💻 Insert Interval (3-Phase O(N) Scan) Blueprint
\`\`\`cpp
vector<vector<int>> insertInterval(vector<vector<int>> &intervals, vector<int> &newInterval) {
    int n = intervals.size();
    vector<vector<int>> res;
    int i = 0;

    // Phase 1: Add all intervals that end strictly before newInterval starts
    while (i < n && intervals[i][1] < newInterval[0]) {
        res.push_back(intervals[i]);
        i++;
    }

    // Phase 2: Merge all overlapping intervals that start <= newInterval's end
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.push_back(newInterval);

    // Phase 3: Add all remaining intervals to the right
    while (i < n) {
        res.push_back(intervals[i]);
        i++;
    }

    return res;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Pushing \`newInterval\` Inside the Phase 2 \`while\` Loop:** You must absorb *all* overlapping intervals into \`newInterval\` first, and push \`newInterval\` into \`res\` **once** right after the Phase 2 \`while\` loop finishes!`),
      practiceItems: [
        {
          title: "LeetCode 57: Insert Interval",
          url: "https://leetcode.com/problems/insert-interval/",
          difficulty: "Medium",
          description: "Insert newInterval into a sorted list of non-overlapping intervals such that intervals remains sorted and non-overlapping (merging if necessary)."
        },
        {
          title: "LeetCode 56: Merge Intervals",
          url: "https://leetcode.com/problems/merge-intervals/",
          difficulty: "Medium",
          description: "Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals."
        },
        {
          title: "LeetCode 715: Range Module",
          url: "https://leetcode.com/problems/range-module/",
          difficulty: "Hard",
          description: "Maintain a dynamic collection of disjoint half-open intervals supporting add, query, and remove operations."
        }
      ]
    },

    {
      order: 293,
      name: "Chronological Event-Stream Sweep: Minimum Number of Platforms Required in a Railway Station",
      slug: "dsa-minimum-number-of-platforms-required-railway-station",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=AsGzwR_FWok",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given two arrays \`arr[]\` (arrival times) and \`dep[]\` (departure times) of \`N\` trains at a railway station, find the **minimum number of platforms** required so that no train ever has to wait for a platform. If one train arrives at the exact same minute another train departs (\`arr[i] == dep[j]\`), they **cannot share** the same platform at that moment (two separate platforms are needed).

### 💡 Key Takeaways (Brute O(N²) → Optimal Chronological Two-Pointer Sweep O(N log N))
- **1. Brute Force Pairwise Overlap Counting (\`O(N²)\` Time):**
  - For each train \`i\`, count how many other trains \`j\` overlap with \`[arr[i], dep[i]]\`.
- **2. Optimal Independent Sorting + Two-Pointer Clock Sweep (\`O(2N log N + 2N)\` Time, \`O(1)\` Space):**
  - Imagine standing at the railway station watching a wall clock as the day progresses:
    - Every time *any* train **arrives**, the number of occupied platforms increases by \`+1\` (\`cnt++\`).
    - Every time *any* train **departs**, a platform becomes free, so the number of occupied platforms decreases by \`-1\` (\`cnt--\`).
  - Notice we **do not care which specific train is departing**—all we care about is the chronological order of arrival events vs. departure events!
  - **Algorithm:**
    1. Sort \`arr[]\` in ascending order and sort \`dep[]\` independently in ascending order.
    2. Set \`i = 0\` (on \`arr\`), \`j = 0\` (on \`dep\`), \`cnt = 0\`, and \`maxCnt = 0\`.
    3. Loop **\`while (i < n)\`**:
       - **If \`arr[i] <= dep[j]\`:** A train arrives before (or at the same moment) the earliest train departs → **\`cnt++\`** and **\`i++\`**.
       - **Else (\`arr[i] > dep[j]\`):** A train departs first → **\`cnt--\`** and **\`j++\`**.
       - Update **\`maxCnt = max(maxCnt, cnt)\`**.
    4. Return \`maxCnt\`!

### 💻 Minimum Number of Platforms Required Blueprint
\`\`\`cpp
int findPlatform(vector<int> &arr, vector<int> &dep) {
    int n = arr.size();
    // 1. Sort arrival and departure times independently as chronological event streams
    sort(arr.begin(), arr.end());
    sort(dep.begin(), dep.end());

    int i = 0, j = 0;
    int cnt = 0, maxCnt = 0;

    // 2. Sweep through events in chronological order
    while (i < n) {
        // Same-minute arrival and departure require separate platforms -> use <=
        if (arr[i] <= dep[j]) {
            cnt++;
            i++;
        } else {
            cnt--;
            j++;
        }
        maxCnt = max(maxCnt, cnt);
    }
    return maxCnt;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Worrying That Sorting \`arr\` and \`dep\` Separately Mixes Up Train Pairs:** Because every train's \`arr[k] <= dep[k]\` initially, at any timestamp \`T\`, the total number of trains that have arrived by \`T\` minus the total number of trains that have departed before \`T\` is **100% invariant** regardless of which arrival is paired with which departure!
- **Using \`<\` Instead of \`<=\` in \`if (arr[i] <= dep[j])\`:** In *Minimum Platforms*, if Train A departs at \`09:10\` and Train B arrives at \`09:10\`, they both occupy a platform at \`09:10\` (\`arr[i] <= dep[j]\` increments \`cnt++\` first). *(In contrast, on LeetCode 253 Meeting Rooms II, a meeting ending at \`10\` frees the room for a meeting starting at \`10\`, so \`<\` is used there!)*`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Minimum Platforms",
          url: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
          difficulty: "Medium",
          description: "Given arrival and departure times of all trains that reach a railway station, find the minimum number of platforms required so that no train is kept waiting."
        },
        {
          title: "LeetCode 253: Meeting Rooms II",
          url: "https://leetcode.com/problems/meeting-rooms-ii/",
          difficulty: "Medium",
          description: "Find the minimum number of conference rooms required to hold all given meeting intervals (isomorphic to Minimum Platforms!)."
        },
        {
          title: "LeetCode 1094: Car Pooling",
          url: "https://leetcode.com/problems/car-pooling/",
          difficulty: "Medium",
          description: "Track concurrent passenger counts across chronological pickup and drop-off events."
        }
      ]
    },

    {
      order: 294,
      name: "Min-Max Balance Range Tracking: Valid Parenthesis String With Wildcard ('*')",
      slug: "dsa-valid-parenthesis-string-greedy-range-tracking",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=cHT6sG_hUZI",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\` containing \`'('\`, \`')'\`, and \`'*'\`, where \`'*'\` can be treated as a single \`'('\`, a single \`')'\`, or an **empty string \`""\`**, return \`true\` if \`s\` can be made a valid parenthesis string.

### 💡 Progression (Recursion O(3^N) → DP O(N²) → Optimal Min-Max Range Greedy O(N))
- **1. Why Standard \`cnt\` Becomes a Range \`[minOpen, maxOpen]\`:**
  - Without \`'*'\`, we maintain a single integer \`cnt\` (\`+1\` for \`'('\`, \`-1\` for \`')'\`, invalid if \`cnt < 0\`, valid if \`cnt == 0\` at the end).
  - With \`'*'\`, each \`'*'\` can change \`cnt\` by \`-1\`, \`0\`, or \`+1\`, creating a **contiguous range of achievable open-bracket counts \`[minOpen, maxOpen]\`**!
- **2. The \`O(N)\` Time, \`O(1)\` Space Range-Tracking Rules:**
  - Initialize **\`minOpen = 0\`** and **\`maxOpen = 0\`**.
  - Loop through each character \`s[i]\`:
    - **If \`s[i] == '('\`:** Both bounds increase: \`minOpen++, maxOpen++\`.
    - **Else if \`s[i] == ')'\`:** Both bounds decrease: \`minOpen--, maxOpen--\`.
    - **Else (\`s[i] == '*'\`):**
      - \`minOpen\` treats \`'*'\` as \`')'\`: **\`minOpen = minOpen - 1\`**.
      - \`maxOpen\` treats \`'*'\` as \`'('\`: **\`maxOpen = maxOpen + 1\`**.
    - **Clamp \`minOpen\` at \`0\` (\`if (minOpen < 0) minOpen = 0;\`):**
      - We never allow negative open counts in valid branches—so if \`minOpen\` drops to \`-1\`, clamp it back to \`0\`!
    - **Fatal Deficit Check (\`if (maxOpen < 0) return false;\`):**
      - If even our **maximum possible** open count drops below \`0\` (e.g., string starts with \`")"\`), no wildcard assignment can save it—immediately return \`false\`!
  - At the end of the string, return **\`minOpen == 0\`** (meaning \`0\` lies inside \`[minOpen, maxOpen]\`)!

### 💻 Valid Parenthesis String (O(N) Time, O(1) Space) Blueprint
\`\`\`cpp
bool checkValidString(string s) {
    int minOpen = 0, maxOpen = 0;

    for (char c : s) {
        if (c == '(') {
            minOpen++;
            maxOpen++;
        } else if (c == ')') {
            minOpen--;
            maxOpen--;
        } else { // c == '*'
            minOpen--; // If '*' acts as ')'
            maxOpen++; // If '*' acts as '('
        }

        // Discard invalid negative branches from the lower bound
        if (minOpen < 0) minOpen = 0;

        // If even the upper bound is negative, too many ')' exist -> impossible!
        if (maxOpen < 0) return false;
    }

    return (minOpen == 0);
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Checking \`if (minOpen < 0)\` After \`if (maxOpen < 0)\` Without Understanding the Difference:** When \`s = ")"\`, both \`minOpen\` and \`maxOpen\` become \`-1\`. Clamping \`minOpen = 0\` is only valid when \`maxOpen >= 0\` (meaning non-negative branches still exist in the range). Checking \`if (maxOpen < 0) return false;\` catches the unrecoverable \`")"\` case immediately!`),
      practiceItems: [
        {
          title: "LeetCode 678: Valid Parenthesis String",
          url: "https://leetcode.com/problems/valid-parenthesis-string/",
          difficulty: "Medium",
          description: "Given a string s containing only three types of characters: '(', ')' and '*', return true if s is valid."
        },
        {
          title: "LeetCode 2116: Check if a Parentheses String Can Be Valid",
          url: "https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid/",
          difficulty: "Medium",
          description: "Determine if a parentheses string with unlocked wildcard positions can be made valid in O(N) time and O(1) space."
        },
        {
          title: "LeetCode 1249: Minimum Remove to Make Valid Parentheses",
          url: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/",
          difficulty: "Medium",
          description: "Remove the minimum number of '(' or ')' so that the resulting parentheses string is valid."
        }
      ]
    },

    {
      order: 295,
      name: "Value-Per-Unit-Weight Density Sorting: Fractional Knapsack Algorithm",
      slug: "dsa-fractional-knapsack-algorithm-greedy",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=1ibsQrnuEEg",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given \`N\` items where item \`i\` has \`value\` and \`weight\`, and a knapsack of maximum capacity \`W\`, find the **maximum total value** you can carry. Unlike 0/1 Knapsack, in **Fractional Knapsack** you are allowed to **break items and take a fraction** of an item proportional to its weight!

### 💡 Key Takeaways
- **Why Greedy Works for Fractional Knapsack (Whereas 0/1 Knapsack Needs DP):**
  - Because we can slice any item into arbitrary fractions, the optimal strategy is to always greedily pick the item that yields the **highest value per \`1\` unit of weight (\`(double)value / weight\`)**!
- **Algorithm Steps (\`O(N log N + N)\` Time, \`O(1)\` Space):**
  1. Sort all \`N\` items in **descending order of \`(double)item.value / (double)item.weight\`**.
  2. Initialize \`double totalVal = 0.0;\`.
  3. Iterate through each sorted item \`i\`:
     - **If \`arr[i].weight <= W\` (Fits Completely):**
       - Take the whole item: **\`totalVal += arr[i].value;\`** and reduce remaining capacity: **\`W -= arr[i].weight;\`**.
     - **Else (\`arr[i].weight > W\`, Only a Fraction Fits):**
       - Take the exact remaining capacity \`W\` at unit rate \`arr[i].value / arr[i].weight\`:
         **\`totalVal += ((double)arr[i].value / (double)arr[i].weight) * (double)W;\`**
       - Now the bag is 100% full (\`W = 0\`) → **\`break\`** immediately!
  4. Return \`totalVal\`.

### 💻 Fractional Knapsack Blueprint
\`\`\`cpp
struct Item {
    int value;
    int weight;
};

static bool comp(Item a, Item b) {
    double r1 = (double)a.value / (double)a.weight;
    double r2 = (double)b.value / (double)b.weight;
    return r1 > r2; // Sort by value-per-weight ratio descending!
}

double fractionalKnapsack(int W, Item arr[], int n) {
    // 1. Sort items by descending (value / weight) ratio
    sort(arr, arr + n, comp);

    double totalVal = 0.0;

    // 2. Greedily take full items while possible, then a fraction of the last item
    for (int i = 0; i < n; i++) {
        if (arr[i].weight <= W) {
            totalVal += arr[i].value;
            W -= arr[i].weight;
        } else {
            totalVal += ((double)arr[i].value / (double)arr[i].weight) * (double)W;
            break; // Knapsack is now completely full!
        }
    }
    return totalVal;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Forgetting \`(double)\` Typecasting Before Division:** In C++, \`a.value / a.weight\` performs **integer division** (truncating \`100 / 60 = 1\` instead of \`1.6667\`) unless you cast at least one operand to \`double\` (\`(double)a.value / (double)a.weight\`)!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Fractional Knapsack",
          url: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
          difficulty: "Medium",
          description: "Given weights and values of n items, put these items in a knapsack of capacity w to get the maximum total value in the knapsack (breaking items is allowed)."
        },
        {
          title: "LeetCode 1710: Maximum Units on a Truck",
          url: "https://leetcode.com/problems/maximum-units-on-a-truck/",
          difficulty: "Easy",
          description: "Sort box types by units per box descending and greedily load the truck up to truckSize."
        },
        {
          title: "LeetCode 2279: Maximum Bags With Full Capacity of Rocks",
          url: "https://leetcode.com/problems/maximum-bags-with-full-capacity-of-rocks/",
          difficulty: "Medium",
          description: "Greedily fill bags with the smallest remaining rock deficit first."
        }
      ]
    },

    {
      order: 296,
      name: "Mountain-Slope Peak Reconciliation: Candy Distribution Problem in O(N) Time & O(1) Space",
      slug: "dsa-candy-distribution-slope-approach-greedy",
      subtrack: "Module 41: Greedy Algorithms: Sorting Heuristics, Reachability Horizons & Interval Scheduling",
      videoUrl: "https://www.youtube.com/watch?v=IIqVFvKE6RY",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
\`N\` children stand in a line with \`ratings[i]\`. You must give candies to these children subject to two rules:
1. Every child must have **at least \`1\` candy**.
2. Children with a **strictly higher rating** get **strictly more candies** than their immediate left and right neighbors.
Return the **minimum total number of candies** you need to distribute.

### 💡 Progression (Brute O(2N) Space → Better O(N) Space → Optimal O(1) Space Slope Approach)
- **1. Brute Force (\`left[]\` and \`right[]\` Arrays — \`O(3N)\` Time, \`O(2N)\` Space):**
  - Pass 1 (Left-to-Right): Satisfy left neighbors (\`if (ratings[i] > ratings[i - 1]) left[i] = left[i - 1] + 1; else left[i] = 1;\`).
  - Pass 2 (Right-to-Left): Satisfy right neighbors (\`if (ratings[i] > ratings[i + 1]) right[i] = right[i + 1] + 1; else right[i] = 1;\`).
  - Pass 3: Sum \`max(left[i], right[i])\` for all \`i\`.
- **2. Optimal Slope Approach (\`O(N)\` Single Pass, \`O(1)\` Space!):**
  - Instead of storing arrays, view \`ratings\` as a sequence of **Flat Plateaus (\`==\`)**, **Rising Slopes (\`>\`)**, and **Falling Slopes (\`<\`)**!
  - Initialize \`sum = 1\` (for index \`0\`) and \`i = 1\`:
    1. **Flat Surface (\`ratings[i] == ratings[i - 1]\`):** Equal neighbor needs only \`1\` candy → \`sum += 1; i++; continue;\`.
    2. **Increasing Slope (\`ratings[i] > ratings[i - 1]\`):** Start \`peak = 1\`. While rising, increment \`peak++\`, add **\`sum += peak\`**, and \`i++\`.
    3. **Decreasing Slope (\`ratings[i] < ratings[i - 1]\`):** Start \`down = 1\`. While falling, add **\`sum += down\`**, increment \`down++\`, and \`i++\`.
       - *(Why can we add \`1 + 2 + 3...\` forward instead of \`3 + 2 + 1\` backward? Because the sum \`1 + 2 + ... + k\` is identical in both directions!)*
    4. **Peak Adjustment (\`if (down > peak) sum += (down - peak)\`):**
       - If the downward slope was longer than the upward slope (\`down > peak\`), the mountain peak child needs \`down\` candies instead of \`peak\` candies—so add the difference **\`sum += (down - peak)\`**!

### 💻 Candy Distribution (Optimal O(N) Time, O(1) Space Slope Method) Blueprint
\`\`\`cpp
int candy(vector<int> &ratings) {
    int n = ratings.size();
    int sum = 1; // Index 0 starts with 1 candy
    int i = 1;

    while (i < n) {
        // Case 1: Flat plateau (equal ratings)
        if (ratings[i] == ratings[i - 1]) {
            sum += 1;
            i++;
            continue;
        }

        // Case 2: Strictly increasing slope
        int peak = 1;
        while (i < n && ratings[i] > ratings[i - 1]) {
            peak += 1;
            sum += peak;
            i++;
        }

        // Case 3: Strictly decreasing slope
        int down = 1;
        while (i < n && ratings[i] < ratings[i - 1]) {
            sum += down;
            i++;
            down += 1;
        }

        // Reconcile the mountain peak if the downward slope was taller than the upward peak!
        if (down > peak) {
            sum += (down - peak);
        }
    }
    return sum;
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Incrementing \`peak += 1\` *After* \`sum += peak\` vs. \`down += 1\` *Before* \`sum += down\`:**
  - On the **rising** slope, index \`0\` (or the valley bottom) *already* got \`1\` candy, so the first rising step needs \`2\` candies (\`peak += 1\` **before** \`sum += peak\`).
  - On the **falling** slope, the peak was *already* counted in the rising loop, and the bottom of the falling slope needs \`1\` candy—so add \`sum += down\` (starting at \`1\`) **before** incrementing \`down += 1\`!`),
      practiceItems: [
        {
          title: "LeetCode 135: Candy",
          url: "https://leetcode.com/problems/candy/",
          difficulty: "Hard",
          description: "There are n children standing in a line with ratings. Give each child at least 1 candy such that children with a higher rating get more candies than their neighbors. Return the minimum candies needed."
        },
        {
          title: "GeeksforGeeks: Candy",
          url: "https://www.geeksforgeeks.org/problems/candy/1",
          difficulty: "Hard",
          description: "Find the minimum number of candies required to distribute among N children based on adjacent rating constraints."
        },
        {
          title: "LeetCode 845: Longest Mountain in Array",
          url: "https://leetcode.com/problems/longest-mountain-in-array/",
          difficulty: "Medium",
          description: "Practice single-pass upward slope and downward slope traversal in O(1) space."
        }
      ]
    },

    // =========================================================================
    // SUBTRACK: Module 42: Stack & Queue Foundations: Custom Data Structure Implementations, Expression Conversions & Min Stack (Topics 297–300)
    // =========================================================================
    {
      order: 297,
      name: "LIFO & FIFO Architecture: Implement Stack and Queue Using Arrays, Linked Lists, and Cross-Structures",
      slug: "dsa-introduction-to-stack-and-queue-implementations",
      subtrack: "Module 42: Stack & Queue Foundations: Custom Data Structure Implementations, Expression Conversions & Min Stack",
      videoUrl: "https://www.youtube.com/watch?v=tqQ5fTamIN4",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Master the core abstractions and all **6 classic interview implementations** of **Stack (LIFO: Last-In-First-Out)** and **Queue (FIFO: First-In-First-Out)**:
1. **Stack using Array:** Maintain \`top = -1\`. \`push(x)\` increments \`arr[++top] = x\`; \`pop()\` decrements \`top--\`. (\`O(1)\` time, fixed capacity).
2. **Queue using Circular Array:** Maintain \`start = -1, end = -1, currSize = 0\`. Advance pointers modulo \`maxSize\`: **\`end = (end + 1) % maxSize\`** and **\`start = (start + 1) % maxSize\`**. (\`O(1)\` time, fixed capacity).
3. **Stack using Linked List:** Insert and delete at the **Head (\`top\`)** (\`newNode->next = top; top = newNode;\`) so both \`push\` and \`pop\` run in \`O(1)\` time with dynamic sizing!
4. **Queue using Linked List:** Maintain both **\`start\` (head)** for \`O(1)\` \`pop()\` and **\`end\` (tail)** for \`O(1)\` \`push()\`.
5. **Stack using 1 Single Queue (\`O(N)\` Push, \`O(1)\` Pop/Top):**
   - Grab \`s = q.size()\`, push \`x\` into \`q\`, and then **rotate the previous \`s\` elements to the back** (\`for (int i = 0; i < s; i++) { q.push(q.front()); q.pop(); }\`).
6. **Queue using 2 Stacks (Amortized \`O(1)\` Push/Pop/Top):**
   - Maintain an **input stack \`s1\`** and an **output stack \`s2\`**.
   - \`push(x)\`: Always push onto \`s1\` (\`O(1)\`).
   - \`pop()\` / \`top()\`: If \`s2\` is non-empty, pop/read directly from \`s2.top()\` (\`O(1)\`). Only when **\`s2\` is empty**, pour all elements from \`s1\` into \`s2\`!

### 💻 Stack Using 1 Queue & Queue Using 2 Stacks (Amortized O(1)) Blueprint
\`\`\`cpp
// 1. Implement Stack Using a Single Queue (LeetCode 225)
class MyStack {
    queue<int> q;
public:
    void push(int x) {
        int s = q.size();
        q.push(x);
        // Rotate the previous 's' elements behind the newly pushed element 'x'
        for (int i = 0; i < s; i++) {
            q.push(q.front());
            q.pop();
        }
    }
    int pop() {
        int n = q.front();
        q.pop();
        return n;
    }
    int top() { return q.front(); }
    bool empty() { return q.empty(); }
};

// 2. Implement Queue Using Two Stacks in Amortized O(1) Time (LeetCode 232)
class MyQueue {
    stack<int> s1, s2;
public:
    void push(int x) {
        s1.push(x); // O(1) push into input stack
    }
    int pop() {
        if (s2.empty()) {
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
        }
        int val = s2.top();
        s2.pop();
        return val;
    }
    int peek() {
        if (s2.empty()) {
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
        }
        return s2.top();
    }
    bool empty() { return s1.empty() && s2.empty(); }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Pouring \`s1\` Into \`s2\` When \`s2\` Is NOT Empty:** In the 2-stack Queue, if \`s2\` still has elements from an earlier transfer, pouring \`s1\` on top of \`s2\` buries the older elements underneath the newer ones! Always transfer \`s1 -> s2\` **only when \`s2.empty()\` is true**.`),
      practiceItems: [
        {
          title: "LeetCode 225: Implement Stack using Queues",
          url: "https://leetcode.com/problems/implement-stack-using-queues/",
          difficulty: "Easy",
          description: "Implement a last-in-first-out (LIFO) stack using only a single queue by rotating existing elements on push."
        },
        {
          title: "LeetCode 232: Implement Queue using Stacks",
          url: "https://leetcode.com/problems/implement-queue-using-stacks/",
          difficulty: "Easy",
          description: "Implement a first-in-first-out (FIFO) queue using two stacks in amortized O(1) time per operation."
        },
        {
          title: "GeeksforGeeks: Implement Queue using Linked List",
          url: "https://www.geeksforgeeks.org/problems/implement-queue-using-linked-list/1",
          difficulty: "Basic",
          description: "Implement a Queue using a singly linked list with start and end pointers in O(1) time."
        }
      ]
    },

    {
      order: 298,
      name: "LIFO Last-Opened Bracket Matching: Check for Balanced Parentheses",
      slug: "dsa-check-for-balanced-parentheses-stack",
      subtrack: "Module 42: Stack & Queue Foundations: Custom Data Structure Implementations, Expression Conversions & Min Stack",
      videoUrl: "https://www.youtube.com/watch?v=xwjS0iZhw4I",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Given a string \`s\` containing only three types of brackets—round \`'('\`, \`')'\`, curly \`'{'\`, \`'}'\`, and square \`'['\`, \`']'\`—determine if \`s\` is **balanced**:
1. Every opening bracket must be closed by the **same type** of bracket.
2. Open brackets must be closed in the **correct LIFO order** (the **most recently opened** bracket must be closed first).
3. Every closing bracket must have a corresponding earlier opening bracket.

### 💡 Key Takeaways
- **Why a Stack Is Required:**
  - Whenever we encounter a closing bracket, we must match it against the **last unmatched opening bracket** seen so far—which is the exact definition of **LIFO (Stack)**!
- **Algorithm & The 2 Edge Cases (\`O(N)\` Time, \`O(N)\` Space):**
  - Loop through each character \`it\` in \`s\`:
    1. **If \`it\` is an Opening Bracket (\`'('\`, \`'{'\`, or \`'['\`):** Push \`it\` onto \`st\`.
    2. **Else (\`it\` is a Closing Bracket):**
       - **Edge Case 1 (\`st.empty()\`):** We found a closing bracket when the stack is empty (e.g., \`"]"\` or \`"())"\`). There is no opening bracket for it → immediately **\`return false\`**!
       - Pop \`char ch = st.top(); st.pop();\`.
       - Verify that \`(it == ')' && ch == '(') || (it == ']' && ch == '[') || (it == '}' && ch == '{')\`. If not, **\`return false\`**.
  - **Edge Case 2 (Unclosed Opening Brackets at the End, e.g., \`"(()"\`):**
    - After the loop finishes, return **\`st.empty()\`** (not \`true\`! If \`st\` still has leftover opening brackets, the string is invalid!).

### 💻 Check for Balanced Parentheses Blueprint
\`\`\`cpp
bool isValid(string s) {
    stack<char> st;

    for (char it : s) {
        if (it == '(' || it == '{' || it == '[') {
            st.push(it);
        } else {
            // Edge Case 1: Closing bracket with no matching opening bracket!
            if (st.empty()) return false;

            char ch = st.top();
            st.pop();

            if ((it == ')' && ch == '(') ||
                (it == ']' && ch == '[') ||
                (it == '}' && ch == '{')) {
                continue;
            } else {
                return false; // Mismatched bracket types!
            }
        }
    }

    // Edge Case 2: Valid ONLY if all opening brackets were closed!
    return st.empty();
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Calling \`st.top()\` Before Checking \`if (st.empty())\`:** On an input like \`")"\` or \`"()]"\`, \`st\` is empty when the extra closing bracket is reached—calling \`st.top()\` without \`if (st.empty()) return false;\` causes an immediate segmentation fault / runtime error!`),
      practiceItems: [
        {
          title: "LeetCode 20: Valid Parentheses",
          url: "https://leetcode.com/problems/valid-parentheses/",
          difficulty: "Easy",
          description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid."
        },
        {
          title: "LeetCode 32: Longest Valid Parentheses",
          url: "https://leetcode.com/problems/longest-valid-parentheses/",
          difficulty: "Hard",
          description: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring."
        },
        {
          title: "GeeksforGeeks: Parenthesis Checker",
          url: "https://www.geeksforgeeks.org/problems/parenthesis-checker2744/1",
          difficulty: "Easy",
          description: "Check if an expression string has balanced brackets (), {}, and []."
        }
      ]
    },

    {
      order: 299,
      name: "Operator Precedence & Expression Parsing: Infix, Prefix, and Postfix Conversions",
      slug: "dsa-prefix-infix-and-postfix-conversions-stack",
      subtrack: "Module 42: Stack & Queue Foundations: Custom Data Structure Implementations, Expression Conversions & Min Stack",
      videoUrl: "https://www.youtube.com/watch?v=4pIc9UBHJtk",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Understand **Operator Priority** (\`'^'\` = \`3\`, \`'*'\` and \`'/'\` = \`2\`, \`'+'\` and \`'-'\` = \`1\`, others = \`-1\`) and master all **6 classic expression conversions** between **Infix** (\`a + b\`), **Prefix** (\`+ab\`), and **Postfix / Reverse Polish Notation** (\`ab+\`):

### 💡 Summary of All 6 Conversion Algorithms (O(N) Time, O(N) Space)
1. **Infix → Postfix:**
   - Scan **Left to Right**:
     - **Operand (\`a-z, A-Z, 0-9\`):** Append directly to \`ans\`.
     - **\`'('\`:** Push onto \`st\`.
     - **\`')'\`:** Pop and append to \`ans\` until \`'('\` is at \`st.top()\`, then pop \`'('\`.
     - **Operator \`s[i]\`:** While \`!st.empty() && priority(s[i]) <= priority(st.top())\`, pop and append \`st.top()\` to \`ans\`; then push \`s[i]\`.
   - Finally, pop all remaining operators from \`st\` into \`ans\`.
2. **Infix → Prefix (3-Step Trick):**
   - **Step 1:** Reverse the infix string AND swap every \`'('\` with \`')'\`.
   - **Step 2:** Run *Controlled Infix-to-Postfix* on the reversed string: for \`'^'\`, pop while \`priority(s[i]) <= priority(st.top())\`; for all other operators (\`*, /, +, -\`), pop only while **strictly smaller** (\`priority(s[i]) < priority(st.top())\`)!
   - **Step 3:** Reverse the resulting string to get the Prefix expression!
3. **Postfix → Infix:**
   - Scan **Left to Right** with \`stack<string> st\`. Push operands. On operator \`op\`, pop \`t1 = st.top()\`, then \`t2 = st.top()\`, and push **\`"(" + t2 + op + t1 + ")"\`** (\`t2\` goes **first**!).
4. **Prefix → Infix:**
   - Scan **Right to Left** (\`N - 1\` down to \`0\`) with \`stack<string> st\`. Push operands. On operator \`op\`, pop \`t1 = st.top()\`, then \`t2 = st.top()\`, and push **\`"(" + t1 + op + t2 + ")"\`** (\`t1\` goes **first**!).
5. **Postfix → Prefix:**
   - Scan **Left to Right** with \`stack<string> st\`. Push operands. On operator \`op\`, pop \`t1\`, then \`t2\`, and push **\`op + t2 + t1\`**.
6. **Prefix → Postfix:**
   - Scan **Right to Left** (\`N - 1\` down to \`0\`) with \`stack<string> st\`. Push operands. On operator \`op\`, pop \`t1\`, then \`t2\`, and push **\`t1 + t2 + op\`**.

### 💻 Infix to Postfix & Postfix to Infix Blueprint
\`\`\`cpp
int priority(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

// 1. Infix to Postfix Conversion: O(N) Time, O(N) Space
string infixToPostfix(string s) {
    stack<char> st;
    string ans = "";

    for (char c : s) {
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')) {
            ans += c;
        } else if (c == '(') {
            st.push('(');
        } else if (c == ')') {
            while (!st.empty() && st.top() != '(') {
                ans += st.top();
                st.pop();
            }
            if (!st.empty()) st.pop(); // Pop the '('
        } else {
            while (!st.empty() && priority(c) <= priority(st.top())) {
                ans += st.top();
                st.pop();
            }
            st.push(c);
        }
    }
    while (!st.empty()) {
        ans += st.top();
        st.pop();
    }
    return ans;
}

// 2. Postfix to Infix Conversion: O(N) Time, O(N) Space
string postfixToInfix(string s) {
    stack<string> st;
    for (char c : s) {
        if (isalnum(c)) {
            st.push(string(1, c));
        } else {
            string t1 = st.top(); st.pop();
            string t2 = st.top(); st.pop();
            // In Postfix (Left-to-Right), second popped element t2 is the LEFT operand!
            st.push("(" + t2 + c + t1 + ")");
        }
    }
    return st.top();
}
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Confusing \`t1\` and \`t2\` Operand Order in Postfix vs. Prefix:**
  - When scanning **Left to Right (Postfix)**, the deeper element \`t2\` was pushed *earlier*, so **\`t2\` is the left operand** (\`t2 op t1\`).
  - When scanning **Right to Left (Prefix)**, the top element \`t1\` was pushed *most recently* from the left, so **\`t1\` is the left operand** (\`t1 op t2\`)!`),
      practiceItems: [
        {
          title: "GeeksforGeeks: Infix to Postfix",
          url: "https://www.geeksforgeeks.org/problems/infix-to-postfix-1587115620/1",
          difficulty: "Medium",
          description: "Given an infix expression in the form of string s, convert this infix expression to a postfix expression."
        },
        {
          title: "LeetCode 150: Evaluate Reverse Polish Notation",
          url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
          difficulty: "Medium",
          description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation (Postfix) using a stack."
        },
        {
          title: "GeeksforGeeks: Postfix to Infix Conversion",
          url: "https://www.geeksforgeeks.org/problems/postfix-to-infix-conversion/1",
          difficulty: "Medium",
          description: "Convert a valid postfix expression back into a fully parenthesized infix expression using a stack of strings."
        }
      ]
    },

    {
      order: 300,
      name: "Mathematical Value Encoding (2*val - min): Implement Min Stack in O(1) Time and O(N) Single-Stack Space",
      slug: "dsa-implement-min-stack-encoded-single-stack",
      subtrack: "Module 42: Stack & Queue Foundations: Custom Data Structure Implementations, Expression Conversions & Min Stack",
      videoUrl: "https://www.youtube.com/watch?v=NdDIaH91P0g",
      summaryMarkdown: cleanText(`### 📌 Topic Overview
Design a stack that supports \`push(val)\`, \`pop()\`, \`top()\`, and **\`getMin()\`**, all in **\`O(1)\` constant time**.

### 💡 Progression (O(2N) Space Pair Stack → Optimal O(N) Space Mathematical Encoding)
- **1. Approach 1 — Storing \`pair<int, int>\` (\`{val, currentMin}\` — \`O(2N)\` Space):**
  - Push \`{val, min(val, st.top().second)}\`. \`getMin()\` simply returns \`st.top().second\`.
  - Interviewers will ask: *"Can you eliminate the second element of the pair and use only \`O(N)\` space (a single \`stack<long long>\`)?"*
- **2. Approach 2 — Mathematical Encoding \`2 * val - mini\` (\`O(1)\` Time, \`O(N)\` Space!):**
  - Maintain \`stack<long long> st\` and a single variable \`long long mini\`.
  - **When \`push(val)\` is called with a NEW minimum (\`val < mini\`):**
    - Instead of pushing \`val\` directly, we encode the *old* \`mini\` into the pushed number using:
      **\`encodedVal = 2LL * val - mini\`**
    - Push \`encodedVal\` onto \`st\`, and update **\`mini = val\`**!
  - **Why Does \`encodedVal < mini\` Act as a Flag That \`val\` Was Encoded?**
    - Because \`val < oldMini\`  ⇒  \`val - oldMini < 0\`  ⇒  \`2 * val - oldMini < val\`  ⇒  **\`encodedVal < newMini\`**!
    - Thus, whenever **\`st.top() < mini\`**, we know 100% that \`st.top()\` is an **encoded value** and the **true top value is actually \`mini\`**!
  - **How \`pop()\` Restores the Previous Minimum When \`st.top() < mini\`:**
    - When popping an encoded value \`el = st.top()\` where \`el < mini\`, we recover the previous minimum using the inverse formula:
      **\`previousMini = 2LL * mini - el\`**!

### 💻 Min Stack (Optimal Single-Stack Mathematical Encoding) Blueprint
\`\`\`cpp
class MinStack {
    stack<long long> st;
    long long mini;

public:
    MinStack() {
        mini = LLONG_MAX;
    }

    void push(int value) {
        long long val = value;
        if (st.empty()) {
            mini = val;
            st.push(val);
        } else {
            if (val > mini) {
                st.push(val);
            } else {
                // Encode previous mini into the pushed value: (2 * val - mini) < val
                st.push(2LL * val - mini);
                mini = val;
            }
        }
    }

    void pop() {
        if (st.empty()) return;
        long long el = st.top();
        st.pop();

        // If popped element is < mini, it is an encoded marker -> restore previous mini!
        if (el < mini) {
            mini = 2LL * mini - el;
        }
    }

    int top() {
        if (st.empty()) return -1;
        long long el = st.top();
        // If el < mini, the actual un-encoded value sitting at the top is 'mini'!
        if (el < mini) return (int)mini;
        return (int)el;
    }

    int getMin() {
        return (int)mini;
    }
};
\`\`\`

### ⚠️ Common Mistakes to Avoid
- **Using \`int\` Instead of \`long long\` for \`2 * val - mini\`:** On LeetCode 155, \`val\` can be \`INT_MIN\` (\`-2147483648\`) and \`mini\` can be \`INT_MAX\` (\`+2147483647\`), so \`2 * val - mini\` overflows a 32-bit signed \`int\`! Always use **\`long long\`** (\`2LL * val - mini\`) for the stack and \`mini\`.`),
      practiceItems: [
        {
          title: "LeetCode 155: Min Stack",
          url: "https://leetcode.com/problems/min-stack/",
          difficulty: "Medium",
          description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time."
        },
        {
          title: "GeeksforGeeks: Get minimum element from stack",
          url: "https://www.geeksforgeeks.org/problems/get-minimum-element-from-stack/1",
          difficulty: "Medium",
          description: "Implement a stack that supports getMin() in O(1) time and O(1) extra space beyond the single stack."
        },
        {
          title: "LeetCode 895: Maximum Frequency Stack",
          url: "https://leetcode.com/problems/maximum-frequency-stack/",
          difficulty: "Hard",
          description: "Design a stack-like data structure that pops the most frequent element in O(1) time."
        }
      ]
    },
  ];

  console.log("\n📦 Upserting 10 Batch 30 Topics into 'topics' table...");
  const topicIdMap = {};

  for (const t of batch30Topics) {
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

  // 4. Link Topics to Track in 'track_topics' Table with sequential topic_order (291 to 300)
  console.log("\n🔄 Linking Batch 30 topics to 'problem-solving-dsa-sql' (orders 291..300)...");
  for (const t of batch30Topics) {
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

  console.log("\n🎉 DSA Batch 30 (Lectures 291–300) Seeding Completed Successfully!");
};

if (require.main === module) {
  seedDsaBatch30()
    .then(() => {
      console.log("✅ Finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

module.exports = seedDsaBatch30;
