const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

const CREATOR_NAME = 'Thapa Technical (Vinod Bahadur Thapa)';
const CREATOR_CHANNEL_URL = 'https://www.youtube.com/@ThapaTechnical';

function cleanUrl(url) {
  if (!url) return url;
  const match = url.match(/\[?(https?:\/\/[^\]\)\s]+)\]?/);
  return match ? match[1] : url;
}

const batch2Lectures = [
  {
    order: 16,
    slug: 'pg-lecture-16-pgadmin4-browser-performance-optimization',
    title: 'Lecture 16: Fixing pgAdmin 4 UI Lag — Running pgAdmin in Browser Mode via Application Server URL',
    short_description: 'Resolve desktop UI lag on macOS (M1/M2/M3) and Windows by running pgAdmin 4 directly inside Chrome/Brave via the local Application Server URL.',
    estimated_minutes: 4,
    difficulty: 'Easy',
    module_name: 'Module 1: PostgreSQL Foundations & Setup',
    video_title: 'Why pgAdmin 4 is So Slow on Mac M1/M2/M3 Pro (And How to Fix It)',
    video_url: 'https://www.youtube.com/watch?v=IIMOXsHWYjA',
    video_duration: '4m',
    official_docs_url: null,
    practice_problems: [],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
The standalone **pgAdmin 4** desktop application runs inside an embedded web wrapper that frequently suffers from 5–10 second input lag (especially on Apple Silicon M1/M2/M3 Macs and high-DPI monitors). Because pgAdmin 4 is architected as a local Python web server, you can bypass the sluggish desktop wrapper and run it at 60 FPS directly inside your web browser.

---

### ⚡ Step-by-Step Fix: Running pgAdmin 4 in Your Browser

1. **Launch the pgAdmin 4 Desktop App:** Let the application finish its initial startup sequence.
2. **Open the Server Logs:**
   * Click the **pgAdmin 4** menu (top-left menu bar on macOS or system tray icon) -> Select **View Logs**.
3. **Copy the Local Application Server URL:**
   * Scroll to the bottom of the log window and copy the **Application Server URL** (e.g., \`http://127.0.0.1:xxxxx/?key=...\`).
4. **Paste into Chrome / Brave / Edge:**
   * Open your browser, paste the URL, and press Enter. The Query Tool, Object Explorer, and data grids will now respond instantaneously.

---

### ⚠️ Critical Rule: Keep the Desktop App Running in the Background
* **Do NOT Quit (\`Cmd + Q\` / \`Alt + F4\`) the pgAdmin 4 Desktop App** while working in the browser.
* The desktop app hosts the local background server daemon and session token. Quitting the desktop app terminates the local server and triggers a \`Connection Lost\` error in your browser tab. Simply minimize it to the background.`
  },
  {
    order: 17,
    slug: 'pg-lecture-17-left-join-vs-right-join-anti-joins',
    title: 'Lecture 17: LEFT JOIN vs. RIGHT JOIN — Unmatched Rows, Ghost Hunter Anti-Joins & Perspective Flipping',
    short_description: 'Preserve all rows from the primary table with LEFT JOIN, find unmatched records using IS NULL anti-joins, and rewrite RIGHT JOINs cleanly as LEFT JOINs.',
    estimated_minutes: 19,
    difficulty: 'Medium',
    module_name: 'Module 5: Relational Joins & Multi-Table Queries',
    video_title: 'PostgreSQL LEFT JOIN vs RIGHT JOIN Explained | Real Examples, Interview Questions & Tricks',
    video_url: 'https://www.youtube.com/watch?v=LyAnUeYd2Cg',
    video_duration: '19m',
    official_docs_url: 'https://www.postgresql.org/docs/current/tutorial-join.html',
    practice_problems: [
      { title: 'Combine Two Tables (Classic LEFT JOIN)', url: 'https://leetcode.com/problems/combine-two-tables/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Customers Who Never Order (LEFT JOIN + IS NULL Anti-Join)', url: 'https://leetcode.com/problems/customers-who-never-order/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Replace Employee ID With The Unique Identifier', url: 'https://leetcode.com/problems/replace-employee-id-with-the-unique-identifier/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Employee Bonus (LEFT JOIN + NULL Handling)', url: 'https://leetcode.com/problems/employee-bonus/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Customer Who Visited but Did Not Make Any Transactions (Ghost Hunter Query)', url: 'https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Students and Examinations (LEFT JOIN Preservation)', url: 'https://leetcode.com/problems/students-and-examinations/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Average Selling Price (LEFT JOIN with Zero Units Sold)', url: 'https://leetcode.com/problems/average-selling-price/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Project Employees I', url: 'https://leetcode.com/problems/project-employees-i/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Confirmation Rate (LEFT JOIN + Conditional Aggregation)', url: 'https://leetcode.com/problems/confirmation-rate/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Monthly Transactions I', url: 'https://leetcode.com/problems/monthly-transactions-i/', difficulty: 'Medium', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
Unlike \`INNER JOIN\` (which drops rows that do not match in both tables), outer joins (**\`LEFT JOIN\`** and **\`RIGHT JOIN\`**) preserve **100% of the rows** from one side of the join and fill in \`NULL\` wherever the other table has no matching record.

---

### ⚖️ \`LEFT JOIN\` vs. \`RIGHT JOIN\` Mechanics

| Join Type | Which Table Is Fully Preserved? | What Happens When No Match Exists? | Production Usage |
| :--- | :--- | :--- | :--- |
| **\`LEFT JOIN\`** | The **First (Left)** table written after \`FROM\`. | Columns from the Right table are populated with \`NULL\`. | **Standard in 99% of production queries**. |
| **\`RIGHT JOIN\`** | The **Second (Right)** table written after \`RIGHT JOIN\`. | Columns from the Left table are populated with \`NULL\`. | Rarely used — can always be rewritten as a \`LEFT JOIN\` by swapping table order. |

---

### 🛠️ 3 Essential Production Query Patterns

#### 1. Standard \`LEFT JOIN\` (All Students + Their Enrollments, If Any)
\`\`\`sql
-- Returns ALL students, even those who have enrolled in 0 courses
SELECT 
    u.name AS student,
    e.course_id
FROM users u
LEFT JOIN enrollments e
    ON u.id = e.student_id
WHERE u.role = 'student';
\`\`\`

#### 2. The "Ghost Hunter" Anti-Join Pattern (\`LEFT JOIN\` + \`IS NULL\`)
Find records in Table A that have **zero matching records** in Table B (e.g., students who registered an account but never enrolled in any course):
\`\`\`sql
SELECT 
    u.name,
    u.email
FROM users u
LEFT JOIN enrollments e
    ON u.id = e.student_id
WHERE u.role = 'student'
  AND e.course_id IS NULL; -- Never write = NULL!
\`\`\`

#### 3. Flipping Perspectives (\`RIGHT JOIN\` Rewritten as \`LEFT JOIN\`)
Both queries below return every course (including courses with 0 enrolled students), proving why you only ever need \`LEFT JOIN\`:
\`\`\`sql
-- Using RIGHT JOIN
SELECT e.student_id, c.title AS course_name
FROM enrollments e
RIGHT JOIN courses c ON e.course_id = c.id;

-- ✅ Cleaner Equivalent Using LEFT JOIN (Simply swap table order!)
SELECT e.student_id, c.title AS course_name
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id;
\`\`\`

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 2.6: Joins Between Tables (Outer Joins)](https://www.postgresql.org/docs/current/tutorial-join.html)`
  },
  {
    order: 18,
    slug: 'pg-lecture-18-full-outer-join-vs-cross-join',
    title: 'Lecture 18: FULL OUTER JOIN vs. CROSS JOIN — Complete Reconciliation & Cartesian Products',
    short_description: 'Audit unmatched records from both tables simultaneously with FULL OUTER JOIN, and generate all possible M x N combinations with CROSS JOIN.',
    estimated_minutes: 16,
    difficulty: 'Medium',
    module_name: 'Module 5: Relational Joins & Multi-Table Queries',
    video_title: 'PostgreSQL FULL OUTER JOIN vs CROSS JOIN Explained with Real Database Examples',
    video_url: 'https://www.youtube.com/watch?v=cdgCK0Ik0tM',
    video_duration: '16m',
    official_docs_url: 'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-FROM',
    practice_problems: [
      { title: 'Employees With Missing Information (FULL OUTER JOIN Reconciliation)', url: 'https://leetcode.com/problems/employees-with-missing-information/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Students and Examinations (CROSS JOIN Grid + LEFT JOIN)', url: 'https://leetcode.com/problems/students-and-examinations/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Percentage of Users Attended a Contest', url: 'https://leetcode.com/problems/percentage-of-users-attended-a-contest/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Count Salary Categories (Complete Category Matrix)', url: 'https://leetcode.com/problems/count-salary-categories/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Average Time of Process per Machine', url: 'https://leetcode.com/problems/average-time-of-process-per-machine/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Biggest Single Number', url: 'https://leetcode.com/problems/biggest-single-number/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Consecutive Numbers', url: 'https://leetcode.com/problems/consecutive-numbers/', difficulty: 'Medium', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
This lecture explores the two remaining join operators in PostgreSQL: **\`FULL OUTER JOIN\`** (for complete two-way data reconciliation and auditing) and **\`CROSS JOIN\`** (for generating Cartesian product combinations).

---

### 🔄 1. \`FULL OUTER JOIN\` (Complete Two-Way Reconciliation)
\`FULL OUTER JOIN\` combines the effects of both \`LEFT JOIN\` and \`RIGHT JOIN\`. It returns:
1. All matched rows between Table A and Table B.
2. All unmatched rows from Table A (with \`NULL\` for Table B columns).
3. All unmatched rows from Table B (with \`NULL\` for Table A columns).

\`\`\`sql
-- Complete Reconciliation Report:
-- Shows assigned users, unassigned users (e.g. admins with no department),
-- AND empty departments that have 0 assigned users!
SELECT 
    u.name AS user_name,
    d.name AS department_name
FROM users u
FULL OUTER JOIN departments d
    ON u.department_id = d.id;
\`\`\`

---

### ✖️ 2. \`CROSS JOIN\` (Cartesian Product $M \\times N$)
\`CROSS JOIN\` pairs **every single row** from Table A with **every single row** from Table B.
* **Notice:** \`CROSS JOIN\` **never uses an \`ON\` clause** because it does not match keys—it generates all combinations.
* **Real-World E-Commerce Use Case:** Generating every possible product SKU variant from a \`merch_colors\` table (3 colors) and a \`merch_sizes\` table (4 sizes) $\\rightarrow 3 \\times 4 = 12$ total combinations.

\`\`\`sql
-- Generate all possible E-Commerce SKU combinations (Color x Size)
SELECT 
    c.name AS color,
    s.size AS size
FROM merch_colors c
CROSS JOIN merch_sizes s;

-- Practical Example on College DB: Every Department paired with Every Course
SELECT 
    d.name AS department,
    c.title AS course
FROM departments d
CROSS JOIN courses c;
\`\`\`

> 🚨 **Danger Zone (Cartesian Explosion):** If Table A has \`10,000\` rows and Table B has \`100,000\` rows, an unfiltered \`CROSS JOIN\` generates **\`1,000,000,000\` (1 Billion) rows**, instantly exhausting server RAM and freezing the connection. Only use \`CROSS JOIN\` on small dimension tables or when deliberately generating grids.

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 7.2.1: Joined Tables (FULL OUTER JOIN & CROSS JOIN)](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-FROM)`
  },
  {
    order: 19,
    slug: 'pg-lecture-19-aggregate-functions-count-sum-avg-min-max',
    title: 'Lecture 19: Aggregate Functions — COUNT, SUM, AVG, ROUND, MIN & MAX',
    short_description: 'Summarize entire columns into single metrics using COUNT(*) vs COUNT(column), SUM, AVG with ROUND(), MIN, and MAX.',
    estimated_minutes: 19,
    difficulty: 'Easy',
    module_name: 'Module 6: Aggregations, Grouping & Analytical Queries',
    video_title: 'PostgreSQL Aggregate Functions Tutorial | COUNT, SUM, AVG, MIN, MAX with Real Examples',
    video_url: 'https://www.youtube.com/watch?v=pXGCaDAgyiI',
    video_duration: '19m',
    official_docs_url: 'https://www.postgresql.org/docs/current/tutorial-agg.html',
    practice_problems: [
      { title: 'Find Total Time Spent by Each Employee (SUM Aggregation)', url: 'https://leetcode.com/problems/find-total-time-spent-by-each-employee/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Average Selling Price (SUM & ROUND Math)', url: 'https://leetcode.com/problems/average-selling-price/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Project Employees I (AVG & ROUND to 2 Decimals)', url: 'https://leetcode.com/problems/project-employees-i/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Percentage of Users Attended a Contest (COUNT & ROUND)', url: 'https://leetcode.com/problems/percentage-of-users-attended-a-contest/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Queries Quality and Percentage (AVG & ROUND)', url: 'https://leetcode.com/problems/queries-quality-and-percentage/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'The Latest Login in 2020 (MAX Timestamp)', url: 'https://leetcode.com/problems/the-latest-login-in-2020/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Game Play Analysis I (MIN Event Date)', url: 'https://leetcode.com/problems/game-play-analysis-i/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Number of Unique Subjects Taught by Each Teacher (COUNT DISTINCT)', url: 'https://leetcode.com/problems/number-of-unique-subjects-taught-by-each-teacher/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Customer Placing the Largest Number of Orders', url: 'https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Immediate Food Delivery II', url: 'https://leetcode.com/problems/immediate-food-delivery-ii/', difficulty: 'Medium', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
**Aggregate Functions** scan an entire set of rows and collapse them into a **single summarized value** (similar to \`Array.prototype.reduce()\` in JavaScript).

---

### 📊 The 5 Core SQL Aggregate Functions

| Function | Purpose | Example |
| :--- | :--- | :--- |
| **\`COUNT()\`** | Counts the number of rows or non-null values. | \`COUNT(*)\`, \`COUNT(id)\` |
| **\`SUM()\`** | Adds up all numeric values in a column. | \`SUM(amount)\` |
| **\`AVG()\`** | Calculates the arithmetic mean of a numeric column. | \`AVG(fee)\` |
| **\`MIN()\`** | Finds the smallest value (lowest price, earliest date, A–Z first). | \`MIN(fee)\` |
| **\`MAX()\`** | Finds the largest value (highest price, latest date, Z–A last). | \`MAX(fee)\` |

---

### 💻 Practical Query Blueprints

\`\`\`sql
-- 1. COUNT: Total active students currently enrolled in the college
SELECT COUNT(*) AS "Total Active Students"
FROM users
WHERE role = 'student' AND is_active = true;

-- 2. SUM: Total revenue collected from completed payments only
SELECT SUM(amount) AS "Total Revenue Collected"
FROM payments
WHERE status = 'completed';

-- 3. AVG + ROUND: Average course fee rounded cleanly to 2 decimal places
SELECT ROUND(AVG(fee), 2) AS "Average Course Fee"
FROM courses;

-- 4. MIN & MAX: Cheapest and most expensive course fees
SELECT 
    MIN(fee) AS cheapest_course,
    MAX(fee) AS most_expensive_course
FROM courses;
\`\`\`

---

### ⚠️ Two High-Frequency Interview Questions

1. **\`COUNT(*)\` vs. \`COUNT(column_name)\`:**
   * \`COUNT(*)\` counts **every row** in the result set, including rows with \`NULL\` values.
   * \`COUNT(column_name)\` counts **only rows where \`column_name IS NOT NULL\`** (silently ignoring \`NULL\`s).
2. **The Non-Aggregated Column Crash:**
   * Writing \`SELECT title, MIN(fee) FROM courses;\` throws \`ERROR: column "courses.title" must appear in the GROUP BY clause or be used in an aggregate function\`. Why? Because \`MIN(fee)\` collapses the table into **1 single value**, whereas \`title\` has 20 rows—PostgreSQL cannot squash 20 titles into 1 row without a \`GROUP BY\` rule.

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 2.7: Aggregate Functions](https://www.postgresql.org/docs/current/tutorial-agg.html)`
  },
  {
    order: 20,
    slug: 'pg-lecture-20-group-by-and-having-clauses',
    title: 'Lecture 20: Grouping Data — GROUP BY, HAVING vs. WHERE & SQL Execution Order',
    short_description: 'Bucket rows into summary groups with GROUP BY, filter aggregated buckets using HAVING, and master the internal SQL query execution pipeline.',
    estimated_minutes: 18,
    difficulty: 'Medium',
    module_name: 'Module 6: Aggregations, Grouping & Analytical Queries',
    video_title: 'PostgreSQL GROUP BY & HAVING Clause Explained with Practical Questions',
    video_url: 'https://www.youtube.com/watch?v=FsTXg74UJzE',
    video_duration: '18m',
    official_docs_url: 'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP',
    practice_problems: [
      { title: 'Classes More Than 5 Students (GROUP BY + HAVING COUNT)', url: 'https://leetcode.com/problems/classes-more-than-5-students/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Duplicate Emails (GROUP BY + HAVING COUNT > 1)', url: 'https://leetcode.com/problems/duplicate-emails/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Actors and Directors Who Cooperated At Least Three Times (Multi-Column GROUP BY)', url: 'https://leetcode.com/problems/actors-and-directors-who-cooperated-at-least-three-times/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Customer Placing the Largest Number of Orders', url: 'https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Find Followers Count (GROUP BY + ORDER BY)', url: 'https://leetcode.com/problems/find-followers-count/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Daily Leads and Partners (Multi-Column GROUP BY)', url: 'https://leetcode.com/problems/daily-leads-and-partners/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'User Activity for the Past 30 Days I (WHERE + GROUP BY)', url: 'https://leetcode.com/problems/user-activity-for-the-past-30-days-i/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Bank Account Summary II (GROUP BY + HAVING SUM)', url: 'https://leetcode.com/problems/bank-account-summary-ii/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Customers Who Bought All Products (GROUP BY + HAVING COUNT DISTINCT)', url: 'https://leetcode.com/problems/customers-who-bought-all-products/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Market Analysis I', url: 'https://leetcode.com/problems/market-analysis-i/', difficulty: 'Medium', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
While aggregate functions collapse an entire table into a single row, **\`GROUP BY\`** divides rows into distinct buckets (e.g., per role, per payment status, per department) and runs the aggregate function independently on each bucket. **\`HAVING\`** then filters those aggregated buckets.

---

### ⚖️ \`WHERE\` vs. \`HAVING\` (Classic Interview Question)

| Feature | \`WHERE\` Clause | \`HAVING\` Clause |
| :--- | :--- | :--- |
| **What It Filters** | Filters **individual raw rows**. | Filters **grouped buckets** created by \`GROUP BY\`. |
| **When It Runs** | Runs **BEFORE** \`GROUP BY\` and aggregation. | Runs **AFTER** \`GROUP BY\` and aggregation. |
| **Can It Use Aggregates (\`SUM\`, \`COUNT\`)?** | ❌ **No** (\`WHERE COUNT(*) > 5\` is a syntax error). | ✅ **Yes** (\`HAVING COUNT(id) > 5\`). |

---

### 🔄 The Golden Rule & Execution Pipeline
* **The Golden Rule:** Every column listed in \`SELECT\` that is **not** wrapped inside an aggregate function (\`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`) **MUST** be listed in the \`GROUP BY\` clause.
* **Internal SQL Execution Order:**
  \`FROM\` $\\rightarrow$ \`JOIN\` $\\rightarrow$ \`WHERE\` (filter rows) $\\rightarrow$ \`GROUP BY\` (form buckets) $\\rightarrow$ **Aggregates** $\\rightarrow$ \`HAVING\` (filter buckets) $\\rightarrow$ \`SELECT\` $\\rightarrow$ \`ORDER BY\` $\\rightarrow$ \`LIMIT\`.

---

### 💻 Practical Query Blueprints

\`\`\`sql
-- 1. Count how many active users exist in each role ('admin', 'professor', 'student')
SELECT 
    role,
    COUNT(id) AS total_users
FROM users
WHERE is_active = true
GROUP BY role;

-- 2. Group payments by status ('completed', 'pending', 'failed') to audit revenue
SELECT 
    status,
    SUM(amount) AS "Total Revenue"
FROM payments
GROUP BY status;

-- 3. HAVING Clause: Find departments that have strictly more than 5 users
SELECT 
    department_id,
    COUNT(id) AS user_count
FROM users
GROUP BY department_id
HAVING COUNT(id) > 5;
\`\`\`

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 7.2.3: The GROUP BY and HAVING Clauses](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP)`
  },
  {
    order: 21,
    slug: 'pg-lecture-21-advanced-sql-practice-joins-group-by-having-part-1',
    title: 'Lecture 21: Advanced SQL Interview Practice (Part 1) — Combining INNER JOIN, WHERE, GROUP BY, HAVING & ORDER BY',
    short_description: 'Solve multi-constraint business intelligence queries by combining table joins, row filtering, grouping, aggregate filtering, and sorting in a single pipeline.',
    estimated_minutes: 18,
    difficulty: 'Medium',
    module_name: 'Module 6: Aggregations, Grouping & Analytical Queries',
    video_title: 'Advanced PostgreSQL Practice Session | Real SQL Interview Questions & Solutions',
    video_url: 'https://www.youtube.com/watch?v=OC1R2JROmsY',
    video_duration: '18m',
    official_docs_url: 'https://www.postgresql.org/docs/current/tutorial-agg.html',
    practice_problems: [
      { title: 'Bank Account Summary II (INNER JOIN + GROUP BY + HAVING SUM)', url: 'https://leetcode.com/problems/bank-account-summary-ii/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Managers with at Least 5 Direct Reports (JOIN + GROUP BY + HAVING)', url: 'https://leetcode.com/problems/managers-with-at-least-5-direct-reports/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Customers Who Bought All Products', url: 'https://leetcode.com/problems/customers-who-bought-all-products/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Movie Rating (JOIN + WHERE + GROUP BY + ORDER BY)', url: 'https://leetcode.com/problems/movie-rating/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Monthly Transactions I', url: 'https://leetcode.com/problems/monthly-transactions-i/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Capital Gain/Loss', url: 'https://leetcode.com/problems/capital-gainloss/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Market Analysis I', url: 'https://leetcode.com/problems/market-analysis-i/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Product Sales Analysis III', url: 'https://leetcode.com/problems/product-sales-analysis-iii/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Friend Requests II: Who Has the Most Friends', url: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Trips and Users', url: 'https://leetcode.com/problems/trips-and-users/', difficulty: 'Hard', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
In real backend engineering and technical interviews, you are rarely asked to write an isolated \`JOIN\` or an isolated \`GROUP BY\`. Instead, you are given a **business problem** that requires chaining \`SELECT\`, \`FROM\`, \`INNER JOIN\`, \`WHERE\`, \`GROUP BY\`, \`HAVING\`, and \`ORDER BY\` in exact syntactic order.

---

### 🏆 Case Study 1: The VIP Top-Spending Active Students Query

#### Business Requirement:
The college wants to send a VIP thank-you gift to top-spending active students. Write a query that:
1. Calculates the **total revenue spent per student** across all their payments.
2. **Filter 1 (Row-level):** Only include students who are currently active (\`is_active = true\`).
3. **Filter 2 (Group-level):** Only show students whose total spent amount is strictly greater than \`5000\`.
4. **Sorting:** Sort the list so the highest spender appears at the very top.

#### Step-by-Step Solution:
\`\`\`sql
SELECT 
    u.name AS student_name,
    SUM(p.amount) AS total_spent
FROM users u
INNER JOIN payments p
    ON u.id = p.student_id
WHERE u.is_active = true
GROUP BY u.name
HAVING SUM(p.amount) > 5000
ORDER BY total_spent DESC;
\`\`\`

---

### 🧠 Why Every Clause Is Positioned Where It Is
1. **\`INNER JOIN payments p ON u.id = p.student_id\`** comes immediately after \`FROM users u\` — **before** \`WHERE\`.
2. **\`WHERE u.is_active = true\`** filters out inactive students **before** PostgreSQL spends CPU cycles grouping their payments.
3. **\`GROUP BY u.name\`** collapses multiple payment rows per student into a single summary bucket per student.
4. **\`HAVING SUM(p.amount) > 5000\`** filters the aggregated buckets after \`SUM(p.amount)\` has been computed.
5. **\`ORDER BY total_spent DESC\`** runs after \`SELECT\`, which is why it can reference the output alias \`total_spent\` directly.

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 2.7: Aggregate Functions & HAVING](https://www.postgresql.org/docs/current/tutorial-agg.html)`
  },
  {
    order: 22,
    slug: 'pg-lecture-22-advanced-sql-practice-3-table-joins-aggregations-part-2',
    title: 'Lecture 22: Advanced SQL Interview Practice (Part 2) — 3-Table Joins with GROUP BY, HAVING & ROUND(AVG)',
    short_description: 'Master 3-table relational hops (courses -> users -> enrollments and departments -> users -> courses) combined with multi-column GROUP BY and HAVING.',
    estimated_minutes: 11,
    difficulty: 'Medium',
    module_name: 'Module 6: Aggregations, Grouping & Analytical Queries',
    video_title: 'Can You Solve These Advanced PostgreSQL Queries? 🔥 Joins, GROUP BY, HAVING',
    video_url: 'https://www.youtube.com/watch?v=3CuGME7ZC-g',
    video_duration: '11m',
    official_docs_url: 'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP',
    practice_problems: [
      { title: 'Students and Examinations (3-Table Join + GROUP BY)', url: 'https://leetcode.com/problems/students-and-examinations/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Project Employees I (JOIN + GROUP BY + ROUND AVG)', url: 'https://leetcode.com/problems/project-employees-i/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Average Selling Price (JOIN + GROUP BY + ROUND)', url: 'https://leetcode.com/problems/average-selling-price/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'The Number of Employees Which Report to Each Employee (JOIN + GROUP BY + ROUND AVG)', url: 'https://leetcode.com/problems/the-number-of-employees-which-report-to-each-employee/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Confirmation Rate', url: 'https://leetcode.com/problems/confirmation-rate/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Department Highest Salary', url: 'https://leetcode.com/problems/department-highest-salary/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Monthly Transactions I', url: 'https://leetcode.com/problems/monthly-transactions-i/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Restaurant Growth', url: 'https://leetcode.com/problems/restaurant-growth/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Department Top Three Salaries', url: 'https://leetcode.com/problems/department-top-three-salaries/', difficulty: 'Hard', platform: 'LeetCode' },
      { title: 'Human Traffic of Stadium', url: 'https://leetcode.com/problems/human-traffic-of-stadium/', difficulty: 'Hard', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
This lecture solves the two remaining multi-table analytical challenges from Part 1, demonstrating how to chain **3-table \`INNER JOIN\`s** with **multi-column \`GROUP BY\`**, **\`HAVING\`**, and **\`ROUND(AVG(...), 2)\`**.

---

### 🏆 Challenge 2: Popular Premium Courses (3-Table Join)

#### Business Requirement:
Identify which expensive courses are actually popular so the college can award bonuses to the teaching professors:
* Display the **course title**, **professor name**, and **total number of enrolled students**.
* **Filter 1 (Row-level):** Only include premium courses where \`fee > 3000\`.
* **Filter 2 (Group-level):** Only include courses that have **at least 2 enrolled students** (\`>= 2\`).
* **Sorting:** Sort by total enrolled students descending.

\`\`\`sql
SELECT 
    c.title AS course_title,
    u.name AS professor_name,
    COUNT(e.student_id) AS total_students
FROM courses c
INNER JOIN users u
    ON c.instructor_id = u.id
INNER JOIN enrollments e
    ON c.id = e.course_id
WHERE c.fee > 3000
GROUP BY c.title, u.name
HAVING COUNT(e.student_id) >= 2
ORDER BY total_students DESC;
\`\`\`
*(Note: Because both \`c.title\` and \`u.name\` appear in \`SELECT\` outside of \`COUNT()\`, both must be listed in \`GROUP BY c.title, u.name\`)*.

---

### 🏆 Challenge 3: The Department Budget Audit (\`ROUND(AVG(), 2)\`)

#### Business Requirement:
The finance department is auditing the average course fee across departments taught by active professors:
* Calculate the **average course fee per department**, rounded to **2 decimal places**.
* **Filter 1 (Row-level):** Only include courses taught by professors who are currently active (\`u.is_active = true\`).
* **Filter 2 (Group-level):** Only show affordable departments where the average course fee is strictly less than \`4000\`.
* **Sorting:** Sort from cheapest to most expensive (\`ASC\`).

\`\`\`sql
SELECT 
    d.name AS department_name,
    ROUND(AVG(c.fee), 2) AS avg_course_fee
FROM departments d
INNER JOIN users u
    ON d.id = u.department_id
INNER JOIN courses c
    ON u.id = c.instructor_id
WHERE u.is_active = true
GROUP BY d.name
HAVING AVG(c.fee) < 4000
ORDER BY avg_course_fee ASC;
\`\`\`

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 7.2.3: The GROUP BY and HAVING Clauses](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP)`
  },
  {
    order: 23,
    slug: 'pg-lecture-23-date-time-functions-timestamp-interval-extract-to-char',
    title: 'Lecture 23: Date & Time Functions — TIMESTAMPTZ, NOW(), INTERVAL, EXTRACT & TO_CHAR',
    short_description: 'Perform relative date math with INTERVAL, slice date components for monthly revenue reports using EXTRACT, and format timestamps into strings with TO_CHAR.',
    estimated_minutes: 22,
    difficulty: 'Medium',
    module_name: 'Module 7: Temporal Queries, Subqueries & CTEs',
    video_title: 'PostgreSQL Date & Time Functions Explained | Timestamp, Interval, EXTRACT & TO_CHAR with Queries',
    video_url: 'https://www.youtube.com/watch?v=qM2tokrgpFE',
    video_duration: '22m',
    official_docs_url: 'https://www.postgresql.org/docs/current/functions-datetime.html',
    practice_problems: [
      { title: 'Rising Temperature (Date Interval Comparison)', url: 'https://leetcode.com/problems/rising-temperature/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'User Activity for the Past 30 Days I (30-Day Window Filter)', url: 'https://leetcode.com/problems/user-activity-for-the-past-30-days-i/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'List the Products Ordered in a Period (Month/Year Extraction)', url: 'https://leetcode.com/problems/list-the-products-ordered-in-a-period/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'The Latest Login in 2020 (EXTRACT YEAR Filter)', url: 'https://leetcode.com/problems/the-latest-login-in-2020/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Game Play Analysis I (First Login Date)', url: 'https://leetcode.com/problems/game-play-analysis-i/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Sales Analysis III (Date Boundary Filtering)', url: 'https://leetcode.com/problems/sales-analysis-iii/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Monthly Transactions I (TO_CHAR YYYY-MM Grouping)', url: 'https://leetcode.com/problems/monthly-transactions-i/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Game Play Analysis IV (Consecutive Day INTERVAL + 1 day)', url: 'https://leetcode.com/problems/game-play-analysis-iv/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Restaurant Growth (7-Day Moving Window)', url: 'https://leetcode.com/problems/restaurant-growth/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Market Analysis I (Year Extraction in Join)', url: 'https://leetcode.com/problems/market-analysis-i/', difficulty: 'Medium', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
Activity feeds (*"Enrolled in the last 30 days"*), subscription expirations (*"+ 6 months"*), and monthly financial reports (*"Revenue grouped by month"*) all rely on PostgreSQL's built-in temporal data types and functions.

---

### 🕒 Core Temporal Types & Functions

| Keyword / Function | Description | Example |
| :--- | :--- | :--- |
| **\`TIMESTAMP\` vs. \`TIMESTAMPTZ\`** | Stores both date and time. Always prefer **\`TIMESTAMPTZ\`** (\`TIMESTAMP WITH TIME ZONE\`) in production to avoid cross-country UTC bugs. | \`2026-06-20 14:30:00+05:30\` |
| **\`NOW()\` / \`CURRENT_TIMESTAMP\`** | Returns the exact server date and time when the query executes. | \`SELECT NOW();\` |
| **\`INTERVAL\`** | Adds or subtracts human-readable time durations (automatically handles leap years and 28/30/31-day months). | \`NOW() - INTERVAL '30 days'\`, \`NOW() + INTERVAL '6 months'\` |
| **\`EXTRACT(part FROM col)\`** | Plucks a specific numeric component (\`YEAR\`, \`MONTH\`, \`DAY\`, \`HOUR\`) out of a timestamp. | \`EXTRACT(MONTH FROM paid_at)\` $\\rightarrow$ \`6\` |
| **\`TO_CHAR(col, format)\`** | Formats a timestamp into a custom display string (respects capitalization of \`Month\` vs \`month\`). | \`TO_CHAR(NOW(), 'DD Mon YYYY')\` $\\rightarrow$ \`'20 Jun 2026'\` |

---

### 💻 Real-World Query Blueprints

#### 1. Recent Activity Feed (Students Enrolled in the Last 30 Days)
\`\`\`sql
SELECT 
    u.name,
    e.enrolled_on
FROM enrollments e
INNER JOIN users u
    ON e.student_id = u.id
WHERE e.enrolled_on >= NOW() - INTERVAL '30 days';
\`\`\`

#### 2. Monthly Revenue Report (\`EXTRACT\` + \`GROUP BY\`)
\`\`\`sql
SELECT 
    EXTRACT(MONTH FROM paid_at) AS payment_month,
    SUM(amount) AS monthly_revenue
FROM payments
WHERE status = 'completed'
GROUP BY EXTRACT(MONTH FROM paid_at)
ORDER BY payment_month ASC;
\`\`\`

#### 3. Certificate Date Formatting (\`TO_CHAR\`) & Graduation Deadlines (\`INTERVAL\`)
\`\`\`sql
-- Format certificate issue date cleanly as '20 June 2026'
SELECT 
    student_id,
    TO_CHAR(issued_at, 'DD Month YYYY') AS formatted_issue_date
FROM certificates;

-- Calculate 6-Month Bootcamp Graduation Date
SELECT 
    student_id,
    enrolled_on,
    enrolled_on + INTERVAL '6 months' AS graduation_date
FROM enrollments;
\`\`\`

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 9.9: Date/Time Functions and Operators (EXTRACT, INTERVAL)](https://www.postgresql.org/docs/current/functions-datetime.html)
* [PostgreSQL Official Docs — Section 9.8: Data Type Formatting Functions (TO_CHAR)](https://www.postgresql.org/docs/current/functions-formatting.html)`
  },
  {
    order: 24,
    slug: 'pg-lecture-24-subqueries-scalar-and-list-subqueries',
    title: 'Lecture 24: Subqueries in PostgreSQL — Scalar Subqueries, List (IN) Subqueries & Execution Flow',
    short_description: 'Write nested queries inside WHERE clauses, distinguish single-value Scalar Subqueries from multi-row List Subqueries, and avoid the multi-row = operator crash.',
    estimated_minutes: 14,
    difficulty: 'Medium',
    module_name: 'Module 7: Temporal Queries, Subqueries & CTEs',
    video_title: 'PostgreSQL Subqueries Tutorial for Beginners | Scalar & List Subquery with Practical Examples',
    video_url: 'https://www.youtube.com/watch?v=phyYIVz5Ev0',
    video_duration: '14m',
    official_docs_url: 'https://www.postgresql.org/docs/current/functions-subquery.html',
    practice_problems: [
      { title: 'Employees Whose Manager Left the Company (IN / NOT IN Subquery)', url: 'https://leetcode.com/problems/employees-whose-manager-left-the-company/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Customers Who Never Order (NOT IN Subquery)', url: 'https://leetcode.com/problems/customers-who-never-order/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Sales Person (Nested IN / NOT IN Subquery)', url: 'https://leetcode.com/problems/sales-person/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Biggest Single Number (Scalar Subquery with MAX)', url: 'https://leetcode.com/problems/biggest-single-number/', difficulty: 'Easy', platform: 'LeetCode' },
      { title: 'Second Highest Salary (Scalar Subquery Comparison)', url: 'https://leetcode.com/problems/second-highest-salary/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Exchange Seats (Scalar Subquery COUNT)', url: 'https://leetcode.com/problems/exchange-seats/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Tree Node (IN Subquery Classification)', url: 'https://leetcode.com/problems/tree-node/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Department Highest Salary (Tuple IN Subquery)', url: 'https://leetcode.com/problems/department-highest-salary/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Investments in 2016 (Multi-Subquery Filtering)', url: 'https://leetcode.com/problems/investments-in-2016/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Customers Who Bought All Products (Scalar Subquery in HAVING)', url: 'https://leetcode.com/problems/customers-who-bought-all-products/', difficulty: 'Medium', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
Suppose you need to find all courses priced higher than the average course fee. Writing \`WHERE fee > AVG(fee)\` fails immediately with \`ERROR: aggregate functions are not allowed in WHERE\`. We solve this using a **Subquery** (a query nested inside parentheses within another query).

---

### 🔍 How Subqueries Execute
1. **Inner Query Runs First:** PostgreSQL executes the parenthesized inner query first.
2. **Outer Query Consumes the Result:** The output of the inner query is substituted into the outer query's condition.

---

### ⚖️ 1. Scalar Subquery vs. 2. List Subquery

| Type | What the Inner Query Returns | Compatible Outer Operators | Example |
| :--- | :--- | :--- | :--- |
| **Scalar Subquery** | **Exactly 1 row and 1 column** (a single atomic value). | \`=\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\` | \`WHERE fee > (SELECT AVG(fee) FROM courses)\` |
| **List Subquery** | **Multiple rows** in 1 column (a list of values). | \`IN\`, \`NOT IN\`, \`ANY\`, \`ALL\` | \`WHERE department_id IN (SELECT id FROM ...)\` |

---

### 💻 Practical Query Blueprints

\`\`\`sql
-- 1. Scalar Subquery: Find all courses priced strictly above the average fee
SELECT title, fee
FROM courses
WHERE fee > (
    SELECT AVG(fee) FROM courses
);

-- 2. List Subquery: Find all users belonging to any 'Engineering' department
-- (Matches both 'Mechanical Engineering', 'Civil Engineering', 'Computer Science', etc.)
SELECT name, email
FROM users
WHERE department_id IN (
    SELECT id
    FROM departments
    WHERE name ILIKE '%Engineering%'
);
\`\`\`

---

### 🚨 Common Pitfall: "more than one row returned by a subquery"
* If an inner query returns multiple rows (e.g., \`SELECT id FROM departments WHERE name ILIKE '%Engineering%'\` returns IDs \`2\` and \`3\`), using \`=\` (\`WHERE department_id = (...)\`) will crash!
* Always pair multi-row subqueries with **\`IN\`** (or \`NOT IN\`).

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 9.23: Subquery Expressions (IN, NOT IN, ANY, ALL)](https://www.postgresql.org/docs/current/functions-subquery.html)`
  },
  {
    order: 25,
    slug: 'pg-lecture-25-common-table-expressions-cte-with-clause',
    title: 'Lecture 25: Common Table Expressions (CTEs) — WITH Clause, Pre-Join Aggregation & Chained CTEs',
    short_description: 'Refactor deeply nested subqueries into clean, self-documenting virtual tables using the WITH clause, pre-aggregate data before joining, and chain multiple CTEs.',
    estimated_minutes: 24,
    difficulty: 'Medium',
    module_name: 'Module 7: Temporal Queries, Subqueries & CTEs',
    video_title: 'CTE in PostgreSQL Explained | WITH Clause, Syntax, Examples & Multi-Step CTE Query',
    video_url: 'https://www.youtube.com/watch?v=7FcyISrErmQ',
    video_duration: '24m',
    official_docs_url: 'https://www.postgresql.org/docs/current/queries-with.html',
    practice_problems: [
      { title: 'Friend Requests II: Who Has the Most Friends (CTE Union & Aggregation)', url: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Restaurant Growth (Multi-Step CTE Pipeline)', url: 'https://leetcode.com/problems/restaurant-growth/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Last Person to Fit in the Bus (CTE Running Total)', url: 'https://leetcode.com/problems/last-person-to-fit-in-the-bus/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Count Salary Categories (Chained CTEs)', url: 'https://leetcode.com/problems/count-salary-categories/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Product Price at a Given Date (CTE Latest State)', url: 'https://leetcode.com/problems/product-price-at-a-given-date/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Immediate Food Delivery II (First Order CTE)', url: 'https://leetcode.com/problems/immediate-food-delivery-ii/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Movie Rating (Dual CTE Aggregation)', url: 'https://leetcode.com/problems/movie-rating/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Consecutive Numbers', url: 'https://leetcode.com/problems/consecutive-numbers/', difficulty: 'Medium', platform: 'LeetCode' },
      { title: 'Department Top Three Salaries (CTE + Ranking)', url: 'https://leetcode.com/problems/department-top-three-salaries/', difficulty: 'Hard', platform: 'LeetCode' },
      { title: 'Trips and Users (CTE Filtering & Cancellation Rate)', url: 'https://leetcode.com/problems/trips-and-users/', difficulty: 'Hard', platform: 'LeetCode' }
    ],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
A **Common Table Expression (CTE)** is a named, temporary virtual table declared at the top of a query using the **\`WITH\`** keyword. Think of a CTE like declaring a clean variable or helper function in JavaScript: you define complex logic once at the top, and reference it like a regular table in your main query below.

---

### 🛠️ 3 Progressive CTE Patterns

#### 1. Basic CTE (Self-Documenting Average Filter)
\`\`\`sql
WITH avg_course_price AS (
    SELECT AVG(fee) AS avg_fee
    FROM courses
)
SELECT title, fee
FROM courses
WHERE fee > (SELECT avg_fee FROM avg_course_price);
\`\`\`

#### 2. Pre-Aggregating Data *Before* Joining (Cleaner & Faster Joins)
Instead of joining a massive \`users\` table with millions of \`payments\` rows and grouping afterward, calculate the per-student math inside a CTE first, then join only the summarized rows:
\`\`\`sql
WITH student_spending AS (
    SELECT 
        student_id,
        SUM(amount) AS total_spent
    FROM payments
    WHERE status = 'completed'
    GROUP BY student_id
)
SELECT 
    u.id,
    u.name,
    s.total_spent
FROM users u
INNER JOIN student_spending s
    ON u.id = s.student_id;
\`\`\`

#### 3. Chaining Multiple CTEs (The Single-\`WITH\` Comma Rule)
When defining multiple CTEs, write the **\`WITH\` keyword only once** at the very top and separate subsequent CTE blocks with a **comma (\`,\`)**:
\`\`\`sql
WITH active_students AS (
    SELECT id, name
    FROM users
    WHERE role = 'student' AND is_active = true
),
premium_courses AS (
    SELECT id, title
    FROM courses
    WHERE fee > 4000
)
SELECT 
    a.name AS student_name,
    p.title AS course_title
FROM enrollments e
INNER JOIN active_students a ON e.student_id = a.id
INNER JOIN premium_courses p ON e.course_id = p.id;
\`\`\`

---

### 💡 Key CTE Engineering Facts
* **Ephemeral Lifespan:** A CTE exists in memory **only while that single SQL statement is executing** and vanishes immediately after—it does not permanently create a table on disk.
* **No Trailing Comma Before Main \`SELECT\`:** Place commas between CTE definitions, but **never** place a comma after the closing parenthesis of the final CTE before the main \`SELECT\`.

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Section 7.8: WITH Queries (Common Table Expressions)](https://www.postgresql.org/docs/current/queries-with.html)`
  },
  {
    order: 26,
    slug: 'pg-lecture-26-database-backup-and-restore-pgadmin4',
    title: 'Lecture 26: Database Backup & Restore in pgAdmin 4 — Pre-Data, Data, Post-Data & Plain SQL Dumps',
    short_description: 'Understand the 3 phases of a PostgreSQL dump (Pre-data, Data, Post-data), export full portable .sql backups, and restore them into fresh databases.',
    estimated_minutes: 8,
    difficulty: 'Easy',
    module_name: 'Module 8: Database Administration & Operations',
    video_title: 'How to Backup & Restore PostgreSQL Database in pgAdmin 4',
    video_url: 'https://www.youtube.com/watch?v=61483D31Xyg',
    video_duration: '8m',
    official_docs_url: 'https://www.postgresql.org/docs/current/backup-dump.html',
    practice_problems: [],
    description: `> 🎥 **Video Creator Credit:** [Thapa Technical (Vinod Bahadur Thapa)](https://www.youtube.com/@ThapaTechnical) — Streamed via official YouTube embed.

### 📌 Topic Overview
Whether you are migrating a database to a production cloud server, taking a snapshot before a risky migration, or sharing a complete project database with teammates, you need a reliable **Backup & Restore** workflow.

---

### 🏗️ The 3 Anatomical Phases of a PostgreSQL Backup
When PostgreSQL exports a database (via \`pg_dump\` or pgAdmin 4), it structures the backup in three sequential stages so constraints never fail during restoration:

1. **Pre-Data:** Empty table definitions (\`CREATE TABLE\`), types, and schemas—no rows or foreign keys yet.
2. **Data:** The actual row records (\`COPY\` / \`INSERT\` statements).
3. **Post-Data:** Constraints, Primary Keys, Foreign Keys, Indexes, Triggers, and Rules applied *after* all data is safely loaded.

---

### 💾 Step-by-Step: Creating a Full Backup in pgAdmin 4

1. Right-click your target database (e.g., \`college_management\`) -> Select **Backup...**.
2. **Filename:** Click the folder icon, choose your destination folder, and name your file ending in \`.sql\` (e.g., \`college_management_backup.sql\`).
3. **Format:**
   * **Plain:** Generates a human-readable, portable \`.sql\` script containing all Pre-data, Data, and Post-data commands.
   * **Custom / Tar / Directory:** Generates compressed binary archives intended for \`pg_restore\`.
4. Click **Backup** and verify the process notification reports **Finished / Successfully completed**.

---

### 🔄 Step-by-Step: Restoring a Backup into a New Database

1. Right-click **Databases** -> **Create** -> **Database...** -> Enter a new database name (e.g., \`thapa_college_management\`) and click **Save**.
2. Right-click the newly created database -> Select **Restore...** (or open the Query Tool for Plain SQL scripts).
3. Set **Format** to match your backup format (e.g., **Plain** or **Custom**), switch the file picker filter to **All Files** / **\`.sql\`**, select your backup file, and click **Restore**.
4. Right-click **Tables** under \`Schemas -> public\` and click **Refresh** to see all restored tables, rows, and constraints.

---

### 📚 Official PostgreSQL Documentation
* [PostgreSQL Official Docs — Chapter 26.1: SQL Dump (pg_dump & pg_restore)](https://www.postgresql.org/docs/current/backup-dump.html)`
  }
];

async function seedPostgresBatch2() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding PostgreSQL Mastery: Batch 2 (Lectures 16 to 26) ---');
    await client.query('BEGIN');

    const trackRes = await client.query(`
      SELECT id, name, title FROM tracks WHERE slug = 'postgresql-mastery' LIMIT 1;
    `);
    if (trackRes.rows.length === 0) {
      throw new Error('Track "postgresql-mastery" not found.');
    }
    const trackId = trackRes.rows[0].id;
    console.log(`Target Track ID: ${trackId} (${trackRes.rows[0].title || trackRes.rows[0].name})`);

    for (const lec of batch2Lectures) {
      const cleanVideoUrl = cleanUrl(lec.video_url);
      const cleanDocsUrl = cleanUrl(lec.official_docs_url);

      const videoLinksJson = JSON.stringify([
        {
          title: lec.video_title,
          url: cleanVideoUrl,
          duration: lec.video_duration,
          creator_name: CREATOR_NAME,
          creator_channel_url: CREATOR_CHANNEL_URL
        }
      ]);

      const practiceProblemsJson = JSON.stringify(lec.practice_problems);

      const practiceItems = lec.practice_problems.map((prob, idx) => ({
        title: prob.title,
        problemId: `${lec.order}_${idx + 1}`,
        platform: prob.platform || 'LeetCode',
        difficulty: prob.difficulty || 'Medium',
        url: prob.url,
        description: `Solve on ${prob.platform || 'LeetCode'}`
      }));
      const practiceItemsJson = JSON.stringify(practiceItems);

      const docLinks = cleanDocsUrl
        ? [{ title: `Official PostgreSQL Docs — Chapter ${lec.order}`, url: cleanDocsUrl }]
        : [];
      const docLinksJson = JSON.stringify(docLinks);

      const existingRes = await client.query(
        `SELECT id FROM topics WHERE slug = $1 AND track_id = $2 LIMIT 1;`,
        [lec.slug, trackId]
      );

      let topicId;
      if (existingRes.rows.length > 0) {
        topicId = existingRes.rows[0].id;
        await client.query(`
          UPDATE topics SET
            name = $1,
            title = $1,
            description = $2,
            summary_markdown = $2,
            theory_summary = $2,
            short_description = $3,
            estimated_minutes = $4,
            difficulty = $5,
            module_name = $6,
            topic_order = $7,
            video_links = $8::jsonb,
            practice_problems = $9::jsonb,
            practice_items = $10::jsonb,
            doc_links = $11::jsonb,
            creator_name = $12,
            creator_channel_url = $13,
            official_docs_url = $14
          WHERE id = $15;
        `, [
          lec.title,
          lec.description,
          lec.short_description,
          lec.estimated_minutes,
          lec.difficulty,
          lec.module_name,
          lec.order,
          videoLinksJson,
          practiceProblemsJson,
          practiceItemsJson,
          docLinksJson,
          CREATOR_NAME,
          CREATOR_CHANNEL_URL,
          cleanDocsUrl,
          topicId
        ]);
      } else {
        const insertRes = await client.query(`
          INSERT INTO topics (
            track_id,
            name,
            title,
            slug,
            description,
            summary_markdown,
            theory_summary,
            short_description,
            estimated_minutes,
            difficulty,
            module_name,
            topic_order,
            video_links,
            practice_problems,
            practice_items,
            doc_links,
            creator_name,
            creator_channel_url,
            official_docs_url
          )
          VALUES ($1, $2, $2, $3, $4, $4, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14, $15, $16)
          RETURNING id;
        `, [
          trackId,
          lec.title,
          lec.slug,
          lec.description,
          lec.short_description,
          lec.estimated_minutes,
          lec.difficulty,
          lec.module_name,
          lec.order,
          videoLinksJson,
          practiceProblemsJson,
          practiceItemsJson,
          docLinksJson,
          CREATOR_NAME,
          CREATOR_CHANNEL_URL,
          cleanDocsUrl
        ]);
        topicId = insertRes.rows[0].id;
      }

      // Link to track_topics table
      await client.query(`
        INSERT INTO track_topics (track_id, topic_id, topic_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (track_id, topic_id) DO UPDATE SET
          topic_order = EXCLUDED.topic_order;
      `, [trackId, topicId, lec.order]);

      // Sync resources table
      await client.query(`DELETE FROM resources WHERE topic_id = $1;`, [topicId]);

      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'video', $4);
      `, [topicId, lec.video_title, cleanVideoUrl, lec.estimated_minutes]);

      if (cleanDocsUrl) {
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
          VALUES ($1, $2, $3, 'article', 10);
        `, [topicId, `Official PostgreSQL Docs — ${lec.title.split('—')[0].trim()}`, cleanDocsUrl]);
      }

      for (const prob of lec.practice_problems) {
        const probTitle = prob.title.includes('(') ? prob.title : `${prob.title} (${prob.difficulty})`;
        await client.query(`
          INSERT INTO resources (topic_id, title, url, resource_type, difficulty, estimated_minutes)
          VALUES ($1, $2, $3, 'problem', $4, 15);
        `, [topicId, probTitle, prob.url, prob.difficulty]);
      }

      console.log(`[SEEDED] Lecture ${lec.order}: ${lec.title} (Problems: ${lec.practice_problems.length})`);
    }

    await client.query('COMMIT');
    const totalCount = await client.query(`SELECT COUNT(*) FROM topics WHERE track_id = $1;`, [trackId]);
    console.log(`\nTotal topics now in PostgreSQL Mastery track: ${totalCount.rows[0].count} (Expected: 26)`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding PostgreSQL Batch 2:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedPostgresBatch2();
