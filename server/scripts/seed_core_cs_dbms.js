const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../config/db');

function cleanMarkdown(md) {
  if (!md) return '';
  return md
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      if (/^[-*_]{3,}$/.test(trimmed)) return false;
      if (/^\|[-:\s|]+\|$/.test(trimmed)) return false;
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) return false;
      return true;
    })
    .map((line) => {
      let l = line;
      if (l.trim().startsWith('>')) {
        l = l.replace(/^\s*>\s*/, '');
      }
      return l;
    })
    .join('\n')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim();
}

const summaryMarkdown = `### 📌 1. Why DBMS Over File Systems & The 3-Schema Architecture
Traditional flat-file systems suffer from **Data Redundancy & Inconsistency**, **Lack of Concurrent Access Control** (race conditions when two processes write simultaneously), **No Atomic Crash Recovery**, **Poor Security Granularity**, and $O(N)$ linear file scans. A **DBMS (Database Management System)** solves these using a layered architecture.
* **Three-Schema ANSI-SPARC Architecture:**
  1. **Internal (Physical) Level:** Describes how data is physically stored on disk (byte offsets, B+ Tree indexes, block allocation, compression).
  2. **Conceptual (Logical) Level:** Describes *what* data is stored across the entire database (tables, columns, data types, constraints, relationships).
  3. **External (View) Level:** Customized sub-views tailored to specific user roles (e.g., Logistics only sees shipping addresses; Finance sees billing records).
* **Data Independence:**
  * **Physical Data Independence:** Ability to modify the Physical Schema (e.g., switching from a hash index to a B+ Tree or moving data files to a new SSD) without altering the Conceptual Schema or application queries.
  * **Logical Data Independence:** Ability to modify the Conceptual Schema (e.g., adding a new column or splitting a table) without rewriting External Views or application code. (Harder to achieve than Physical Data Independence).

### 💡 2. Entity-Relationship (ER) Modeling & Reduction to Relational Tables
* **Attributes:** **Simple** vs. **Composite** (e.g., \`Name\` -> \`firstName\`, \`lastName\`), **Single-valued** vs. **Multivalued** (double oval, e.g., \`phoneNumbers\` — always requires a **separate table**!), **Stored** vs. **Derived** (dashed oval, e.g., \`age\` computed from \`dob\`).
* **Weak Entity Set (Double Rectangle):** Lacks sufficient attributes to form a Primary Key of its own; depends on a **Strong (Owner) Entity** via an **Identifying Relationship** (double diamond) and uses a **Partial Key (Discriminator)** (dashed underline). Always has **Total Participation** (double line) in its identifying relationship.
* **Minimum Number of Tables Required When Converting an ER Diagram:**
  * **1:1 Relationship:** Merge into either entity's table (if one side has Total Participation, merge into that side; if both have Total Participation, merge both entities into 1 single table).
  * **1:N (One-to-Many) Relationship:** Merge the relationship into the **Many ($N$) side's table** by adding the Primary Key of the $1$-side as a Foreign Key.
  * **M:N (Many-to-Many) Relationship:** Always requires a **separate junction/bridge table** whose Primary Key is the composite of both entities' Primary Keys.
  * **Multivalued Attribute:** Always requires a **separate table** \`(entity_pk, multivalued_attr)\`.

### 💡 3. Keys, Relational Algebra & Tuple Relational Calculus
* **Superkey (SK):** Any set of attributes that uniquely identifies a tuple in a relation. If a relation $R$ has $n$ attributes and a single simple Candidate Key of 1 attribute, the number of Superkeys is $2^{n-1}$.
* **Candidate Key (CK):** A **minimal Superkey** (no proper subset of a Candidate Key is a Superkey). Attributes that belong to *at least one* Candidate Key are called **Prime Attributes**; all others are **Non-Prime Attributes**.
* **Primary Key (PK) vs. Unique Key:** A table can have only **one** Primary Key (\`NOT NULL\` + Unique, Entity Integrity), whereas it can have **multiple** Unique Keys (which allow \`NULL\` values).
* **Relational Algebra (Procedural — Specifies *How* to Obtain Results):**
  * **6 Fundamental Operators:** Selection ($\sigma$), Projection ($\pi$ — automatically eliminates duplicate rows!), Cartesian Product ($\times$), Set Union ($\cup$), Set Difference ($-$), and Rename ($\rho$).
  * **Derived Operators:** Natural Join ($\bowtie$), Theta/Equi Join ($\bowtie_\\theta$), Set Intersection ($R \\cap S = R - (R - S)$), and Division ($R(A,B) \\div S(B)$ — finds all $A$ values associated with *every* $B$ value in $S$, expressed as $\\pi_A(R) - \\pi_A((\\pi_A(R) \\times S) - R)$).
* **Tuple Relational Calculus (TRC — Non-Procedural / Declarative):** $\\{ t \\mid P(t) \\}$ specifies *what* tuples to retrieve rather than how.

### 💡 4. Functional Dependencies (FDs), Closures & Normalization (\`1NF\` to \`BCNF\` / \`4NF\`)
* **Functional Dependency ($X \\rightarrow Y$):** If two tuples agree on attribute set $X$, they must also agree on attribute set $Y$ ($t_1[X] = t_2[X] \\implies t_1[Y] = t_2[Y]$).
* **Finding Attribute Closure ($X^+$):** Start with $result = X$. Repeatedly add $B$ to $result$ for every FD $A \\rightarrow B$ where $A \\subseteq result$. If $X^+$ contains all attributes of $R$, then $X$ is a **Superkey**.
* **Normal Forms Hierarchy (Eliminating Update, Insertion, and Deletion Anomalies):**
  1. **1NF (First Normal Form):** Every attribute must hold **atomic (indivisible)** values (no arrays or comma-separated lists in a cell).
  2. **2NF (Second Normal Form):** Must be in 1NF + **No Partial Dependency** (no **Non-Prime** attribute can depend on a *proper subset* of any Candidate Key). Note: If every Candidate Key is a single attribute, the relation is **automatically in 2NF**!
  3. **3NF (Third Normal Form):** Must be in 2NF + **No Transitive Dependency** of a Non-Prime attribute on a Superkey. Formally, for every non-trivial FD $X \\rightarrow Y$: **either $X$ is a Superkey OR $Y$ is a Prime Attribute**.
  4. **BCNF (Boyce-Codd Normal Form):** Strictly stronger than 3NF. For every non-trivial FD $X \\rightarrow Y$: **$X$ MUST be a Superkey** (even if $Y$ is a Prime Attribute!).
  5. **4NF (Fourth Normal Form):** Must be in BCNF + contains **no non-trivial Multivalued Dependencies ($X \\twoheadrightarrow Y$)** where $X$ is not a Superkey.
* **Decomposition Properties (When Splitting $R$ into $R_1$ and $R_2$):**
  * **Lossless-Join Decomposition (Mandatory):** Natural join $R_1 \\bowtie R_2$ must reconstruct exact original relation $R$ without generating spurious tuples. Condition: $(R_1 \\cap R_2) \\rightarrow R_1$ OR $(R_1 \\cap R_2) \\rightarrow R_2$ (the common attributes must be a Superkey of at least one decomposed table).
  * **Dependency Preservation:** Every FD in $F^+$ can be checked within a single table without joining tables. **3NF decomposition is ALWAYS both Lossless and Dependency-Preserving**; **BCNF decomposition is ALWAYS Lossless, but NOT always Dependency-Preserving**!

### 💡 5. SQL Execution Order & Query Optimization Essentials
\`\`\`sql
-- Logical Order of SQL Execution by the Query Engine:
-- 1. FROM & JOIN (Cartesian product + ON filter)
-- 2. WHERE       (Row-level filter BEFORE grouping; cannot use aggregate functions)
-- 3. GROUP BY    (Buckets rows into groups)
-- 4. HAVING      (Group-level filter AFTER grouping; can use COUNT, SUM, AVG)
-- 5. SELECT      (Evaluates expressions and column aliases)
-- 6. DISTINCT    (Removes duplicate output rows)
-- 7. ORDER BY    (Sorts result set; can reference SELECT aliases)
-- 8. LIMIT / OFFSET

SELECT d.dept_name, COUNT(e.emp_id) AS emp_count, AVG(e.salary) AS avg_sal
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
WHERE e.is_active = TRUE
GROUP BY d.dept_id, d.dept_name
HAVING COUNT(e.emp_id) >= 5
ORDER BY avg_sal DESC
LIMIT 10;
\`\`\`

### 💡 6. Transactions, ACID Properties, Serializability & Concurrency Control
* **ACID Properties & Responsible DBMS Subsystems:**
  * **Atomicity ("All or Nothing"):** Enforced by the **Recovery / Transaction Manager** using **Undo Logs**.
  * **Consistency (Preserving Invariants):** Enforced by **Integrity Constraints** + **Application Logic**.
  * **Isolation (Concurrent Execution Independence):** Enforced by the **Concurrency Control Manager** (Locks, Timestamps, MVCC).
  * **Durability (Surviving Power Loss/Crashes):** Enforced by the **Recovery Manager** using **Write-Ahead Logging (WAL) / Redo Logs**.
* **Concurrency Anomalies & SQL Isolation Levels:**
  * **Dirty Read:** Reading uncommitted data written by another transaction that later rolls back.
  * **Non-Repeatable Read:** Reading the same row twice in a transaction and getting different values because another committed transaction \`UPDATE\`d it.
  * **Phantom Read:** Running the same range query (\`WHERE salary > 50000\`) twice and getting extra rows because another committed transaction \`INSERT\`ed/\`DELETE\`d matching rows.
  * **Isolation Levels:** \`READ UNCOMMITTED\` (allows all 3) -> \`READ COMMITTED\` (prevents Dirty Reads; default in PostgreSQL/Oracle) -> \`REPEATABLE READ\` (prevents Dirty & Non-Repeatable Reads; default in MySQL InnoDB) -> \`SERIALIZABLE\` (prevents all 3).
* **Serializability & Precedence Graphs:**
  * Two operations conflict if they belong to **different transactions**, operate on the **same data item**, and **at least one of them is a \`WRITE\`** (\`R-W\`, \`W-R\`, \`W-W\`).
  * A schedule $S$ is **Conflict Serializable** if and only if its **Precedence (Serialization) Graph is a DAG (contains NO cycles)**. Every Conflict Serializable schedule is View Serializable, whereas a View Serializable schedule that is not Conflict Serializable must contain **Blind Writes**.
* **Locking & Timestamp Protocols:**
  * **Basic 2PL (Two-Phase Locking):** Growing Phase (acquire locks only) -> Shrinking Phase (release locks only). Guarantees **Conflict Serializability**, but is vulnerable to **Deadlocks** and **Cascading Rollbacks**.
  * **Strict 2PL:** Holds all **Exclusive (\`X\` / Write) locks** until \`COMMIT\`/\`ABORT\` — guarantees **Strict & Cascadeless schedules**!
  * **Rigorous 2PL:** Holds **both Shared (\`S\`) and Exclusive (\`X\`) locks** until \`COMMIT\`/\`ABORT\`.
  * **Deadlock Prevention (Timestamp-Based, where smaller $TS$ = older transaction):**
    * **Wait-Die (Non-Preemptive):** Older waits for Younger; Younger dies (rolls back) if it requests a lock held by Older.
    * **Wound-Wait (Preemptive):** Older wounds (preempts/rolls back) Younger; Younger waits for Older.

### 💡 7. Indexing (\`B-Tree\` vs. \`B+ Tree\`), Crash Recovery (WAL) & Scaling
* **Types of Indexes:**
  * **Primary Index:** Ordered data file + index on **Primary Key** (Sparse — 1 entry per disk block anchor record).
  * **Clustering Index:** Ordered data file + index on a **Non-Key** ordering field (Sparse). At most **1 Primary or Clustering index** can exist per table because rows can only be physically sorted in one order on disk!
  * **Secondary Index:** Unordered field (Candidate Key or Non-Key). **Must be Dense** (1 entry per record) because records with the same value are scattered across different disk blocks.
* **Why RDBMS Engines Use \`B+ Trees\` Over \`B-Trees\`:**
  1. **Higher Fanout / Lower Tree Height:** \`B+ Tree\` internal nodes store **only routing keys and child block pointers** (zero data records/record pointers!). More keys fit in a single $4\\text{ KB}$ internal block, keeping tree height at 3–4 levels even for billions of rows.
  2. **Fast Range Queries ($O(\\log N + K)$):** All keys and data pointers reside in the **Leaf Nodes**, which are linked together in a sorted **doubly linked list**—allowing \`WHERE age BETWEEN 20 AND 30\` to scan leaves sequentially without climbing back up the tree!
* **Write-Ahead Logging (WAL):** Log records must be flushed to stable disk **before** the modified data page is written to disk (and all log records of a transaction must be flushed before \`COMMIT\` returns).`;

const dbmsEvaluationTest = [
  // =========================================================================
  // SECTION A: THEORY & CONCEPT APPLICATION (QUESTIONS 1 TO 25)
  // =========================================================================
  {
    id: 'dbms-test-q1',
    questionNumber: 1,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q1: In the ANSI-SPARC 3-Schema Architecture, a DBA replaces a hash index on the "orders" table with a B+ Tree index and moves the data file to a new NVMe partition without changing any table definitions or application SQL queries. Which property does this demonstrate?',
    question: 'In the ANSI-SPARC 3-Schema Architecture, a DBA replaces a hash index on the "orders" table with a B+ Tree index and moves the data file to a new NVMe partition without changing any table definitions or application SQL queries. Which property does this demonstrate?',
    options: [
      'A) Logical Data Independence',
      'B) Physical Data Independence',
      'C) View Serializability',
      'D) Referential Integrity'
    ],
    correctAnswer: 'B',
    explanation: 'Physical Data Independence is the capacity to change the Internal (Physical) Schema—such as file organization, storage devices, or index structures—without having to alter the Conceptual (Logical) Schema or external application queries.'
  },
  {
    id: 'dbms-test-q2',
    questionNumber: 2,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q2: Which of the following statements regarding a Weak Entity Set in an Entity-Relationship (ER) diagram is ALWAYS true?',
    question: 'Which of the following statements regarding a Weak Entity Set in an Entity-Relationship (ER) diagram is ALWAYS true?',
    options: [
      'A) It can have partial participation in its identifying relationship.',
      'B) It must have total participation in its identifying relationship, and its primary key in the relational model is formed by combining the primary key of its owner (strong) entity set with its own partial key (discriminator).',
      'C) Its identifying relationship always requires a separate relational table in the database.',
      'D) It cannot have any non-key attributes of its own.'
    ],
    correctAnswer: 'B',
    explanation: 'A Weak Entity cannot exist without an owner Strong Entity, so it ALWAYS has Total Participation (double line) in its identifying relationship. When reduced to a relational table, the Weak Entity table automatically absorbs the Identifying Relationship by combining the Owner\'s Primary Key with its own Partial Key (Discriminator), so no separate table is needed for the identifying relationship.'
  },
  {
    id: 'dbms-test-q3',
    questionNumber: 3,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q3: Table Orders(order_id PK, cust_id FK) references Customers(cust_id PK) with ON DELETE SET NULL. Under what condition will defining this Foreign Key fail or cause a constraint conflict when a Customer is deleted?',
    question: 'Table Orders(order_id PK, cust_id FK) references Customers(cust_id PK) with ON DELETE SET NULL. Under what condition will defining or triggering this rule fail when a Customer is deleted?',
    options: [
      'A) When cust_id in the Orders table is declared with a NOT NULL constraint (or is part of Orders\'s Primary Key).',
      'B) When the Customer has 0 orders in the Orders table.',
      'C) When Orders has more rows than Customers.',
      'D) ON DELETE SET NULL deletes the entire row from Orders.'
    ],
    correctAnswer: 'A',
    explanation: 'ON DELETE SET NULL updates the foreign key column (Orders.cust_id) to NULL whenever the referenced parent row in Customers is deleted. If Orders.cust_id was defined as NOT NULL (or is part of the Primary Key, which enforces Entity Integrity / NOT NULL), setting it to NULL violates the NOT NULL constraint and fails!'
  },
  {
    id: 'dbms-test-q4',
    questionNumber: 4,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q4: Which of the following correctly compares Relational Algebra (RA) and Tuple Relational Calculus (TRC)?',
    question: 'Which of the following correctly compares Relational Algebra (RA) and Tuple Relational Calculus (TRC)?',
    options: [
      'A) Both RA and TRC are procedural query languages.',
      'B) RA is a procedural language (specifies step-by-step operations on how to retrieve data), whereas TRC is a non-procedural / declarative language (specifies what predicate the resulting tuples must satisfy); Safe TRC and Basic RA are relationally complete (equally expressive).',
      'C) TRC is procedural and strictly more expressive than RA.',
      'D) RA allows infinite result sets while TRC does not.'
    ],
    correctAnswer: 'B',
    explanation: 'Relational Algebra is procedural because an expression prescribes an ordered sequence of operations (selection, projection, join) to compute the result. Tuple Relational Calculus ({t | P(t)}) is declarative/non-procedural. By Codd\'s Theorem, Basic Relational Algebra and Safe Tuple Relational Calculus have identical expressive power (Relational Completeness).'
  },
  {
    id: 'dbms-test-q5',
    questionNumber: 5,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q5: In Relational Algebra, the Division operator R(A, B) ÷ S(B) returns all distinct A values that are paired with EVERY B value in S. Which expression using only fundamental operators is equivalent to R ÷ S?',
    question: 'In Relational Algebra, the Division operator R(A, B) ÷ S(B) returns all distinct A values that are paired with EVERY B value in S. Which expression using only fundamental operators is equivalent to R ÷ S?',
    options: [
      'A) π_A(R) - π_A((π_A(R) × S) - R)',
      'B) π_A(R × S) - π_A(R - S)',
      'C) π_A(R) ∩ π_B(S)',
      'D) σ_{A=B}(R × S)'
    ],
    correctAnswer: 'A',
    explanation: 'To compute R(A,B) ÷ S(B): 1) π_A(R) × S generates all possible (A, B) pairs if every A in R were paired with every B in S. 2) Subtracting R from that ((π_A(R) × S) - R) yields the "missing/disqualified" pairs. 3) Projecting A on those missing pairs gives all A values that failed to match at least one B in S. 4) Subtracting those disqualified A values from π_A(R) leaves only the A values paired with EVERY B in S!'
  },
  {
    id: 'dbms-test-q6',
    questionNumber: 6,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q6: If a Functional Dependency X -> Y holds on a relation schema R, which statement is guaranteed to be true for any valid instance r(R) and any two tuples t1 and t2?',
    question: 'If a Functional Dependency X -> Y holds on a relation schema R, which statement is guaranteed to be true for any valid instance r(R) and any two tuples t1 and t2?',
    options: [
      'A) If t1[Y] == t2[Y], then t1[X] must equal t2[X].',
      'B) If t1[X] == t2[X], then t1[Y] must equal t2[Y]; however, if t1[X] != t2[X], t1[Y] and t2[Y] may be either equal or different.',
      'C) All values in column X must be unique across the entire table.',
      'D) X and Y must have the same data type.'
    ],
    correctAnswer: 'B',
    explanation: 'A functional dependency X -> Y is a many-to-one mapping from X to Y: whenever two rows have identical X values (t1[X] == t2[X]), they are strictly required to have identical Y values (t1[Y] == t2[Y]). Only if t1[X] == t2[X] and t1[Y] != t2[Y] is X -> Y violated.'
  },
  {
    id: 'dbms-test-q7',
    questionNumber: 7,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q7: Under what exact condition is a relation R in Third Normal Form (3NF), and how does Boyce-Codd Normal Form (BCNF) tighten that rule?',
    question: 'Under what exact condition is a relation R in Third Normal Form (3NF), and how does Boyce-Codd Normal Form (BCNF) tighten that rule?',
    options: [
      'A) 3NF requires every non-trivial FD X -> Y to have X as a Superkey OR Y as a Prime Attribute; BCNF drops the second allowance and requires X to be a Superkey for EVERY non-trivial FD X -> Y.',
      'B) BCNF allows Partial Dependencies if Y is a Prime Attribute, whereas 3NF does not.',
      'C) 3NF eliminates Multivalued Dependencies, whereas BCNF eliminates Join Dependencies.',
      'D) Every 3NF relation is automatically in BCNF, but not every BCNF relation is in 3NF.'
    ],
    correctAnswer: 'A',
    explanation: 'A relation is in 3NF if for every non-trivial FD X -> Y, either (1) X is a Superkey, OR (2) every attribute in Y - X is a Prime Attribute (part of some Candidate Key). BCNF removes condition (2) and strictly requires that X MUST be a Superkey for every non-trivial FD X -> Y.'
  },
  {
    id: 'dbms-test-q8',
    questionNumber: 8,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q8: Consider relation R(A, B, C) with functional dependencies AB -> C and C -> B. What are the Candidate Keys of R, which Normal Form does R satisfy, and why is decomposing R into BCNF problematic?',
    question: 'Consider relation R(A, B, C) with functional dependencies AB -> C and C -> B. What are the Candidate Keys of R, which Normal Form does R satisfy, and why is decomposing R into BCNF problematic?',
    options: [
      'A) Candidate Keys: AB and AC; R is in 3NF (because B is a prime attribute in C -> B) but violates BCNF (because C is not a superkey); decomposing into BCNF (R1(C,B) and R2(A,C)) loses the functional dependency AB -> C!',
      'B) Candidate Key: C only; R is in BCNF.',
      'C) Candidate Keys: AB and BC; R violates 2NF.',
      'D) R is in 1NF only and can be decomposed into BCNF without losing any dependencies.'
    ],
    correctAnswer: 'A',
    explanation: 'This is the classic textbook example of 3NF vs. BCNF! Since A is never on the RHS of any FD, A must be in every key. AB+ = ABC and AC+ = ACB, so the Candidate Keys are AB and AC (making A, B, and C all Prime Attributes!). In C -> B, C is not a superkey (violating BCNF), but B is a Prime Attribute (satisfying 3NF!). If you decompose R into R1(C, B) and R2(A, C) to achieve BCNF, the decomposition is lossless, but the FD AB -> C is no longer preserved!'
  },
  {
    id: 'dbms-test-q9',
    questionNumber: 9,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q9: When decomposing a relation R(A, B, C, D) into two relations R1(A, B, C) and R2(C, D), what is the necessary and sufficient condition for the decomposition to be a Lossless-Join Decomposition?',
    question: 'When decomposing a relation R(A, B, C, D) into two relations R1(A, B, C) and R2(C, D), what is the necessary and sufficient condition for the decomposition to be a Lossless-Join Decomposition?',
    options: [
      'A) R1 ∩ R2 must be empty (∅).',
      'B) The common attribute(s) (R1 ∩ R2 = {C}) must functionally determine all attributes of R1 (C -> ABC) OR functionally determine all attributes of R2 (C -> CD) in F+.',
      'C) Both R1 and R2 must have the same number of attributes.',
      'D) C must be a non-prime attribute in R.'
    ],
    correctAnswer: 'B',
    explanation: 'By Heath\'s Theorem, decomposing R into R1 and R2 is lossless if and only if the intersection of their attributes (R1 ∩ R2) is a Superkey of R1 ((R1 ∩ R2) -> R1) OR a Superkey of R2 ((R1 ∩ R2) -> R2).'
  },
  {
    id: 'dbms-test-q10',
    questionNumber: 10,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q10: A table EmpSkillsHobbies(emp_id, skill, hobby) has NO non-trivial functional dependencies (its only key is the all-attribute composite key {emp_id, skill, hobby}), yet an employee\'s skills are completely independent of their hobbies. Which Normal Form is violated and why?',
    question: 'A table EmpSkillsHobbies(emp_id, skill, hobby) has NO non-trivial functional dependencies (its only key is {emp_id, skill, hobby}), yet an employee\'s skills are independent of their hobbies (emp_id ->> skill and emp_id ->> hobby). Which Normal Form is violated?',
    options: [
      'A) It violates 2NF due to partial dependency.',
      'B) It is in BCNF (since there are no non-trivial FDs), but violates Fourth Normal Form (4NF) due to a non-trivial Multivalued Dependency (emp_id ->> skill) where emp_id is not a superkey!',
      'C) It violates 3NF due to transitive dependency.',
      'D) It is already in 4NF and 5NF.'
    ],
    correctAnswer: 'B',
    explanation: 'Because the only key is {emp_id, skill, hobby} and there are no non-trivial FDs, the table automatically satisfies 1NF, 2NF, 3NF, and BCNF! However, storing two independent 1:N relationships (skills and hobbies) in the same table creates a cross-product redundancy (Multivalued Dependency emp_id ->> skill | hobby) where emp_id is not a superkey—violating 4NF. Decomposing into EmpSkills(emp_id, skill) and EmpHobbies(emp_id, hobby) achieves 4NF.'
  },
  {
    id: 'dbms-test-q11',
    questionNumber: 11,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q11: Why does the SQL query SELECT dept_id, COUNT(*) AS total FROM employees WHERE total > 5 GROUP BY dept_id; fail with a syntax/column error, whereas placing the condition in HAVING works?',
    question: 'Why does the SQL query SELECT dept_id, COUNT(*) AS total FROM employees WHERE total > 5 GROUP BY dept_id; fail, whereas HAVING COUNT(*) > 5 works?',
    options: [
      'A) Because the SQL engine executes WHERE (Step 2) BEFORE GROUP BY (Step 3) and SELECT (Step 5), so neither the group aggregates nor the SELECT alias "total" exist yet when WHERE is evaluated!',
      'B) Because COUNT(*) can only be used with ORDER BY.',
      'C) Because WHERE only works on string columns.',
      'D) Because GROUP BY executes after ORDER BY.'
    ],
    correctAnswer: 'A',
    explanation: 'In the logical query processing order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY), the WHERE clause filters individual rows before grouping occurs and before SELECT aliases are computed. Aggregate functions (COUNT, SUM, AVG) and group filters are evaluated in HAVING (after GROUP BY).'
  },
  {
    id: 'dbms-test-q12',
    questionNumber: 12,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q12: Which statement accurately contrasts the SQL commands DELETE, TRUNCATE, and DROP?',
    question: 'Which statement accurately contrasts the SQL commands DELETE, TRUNCATE, and DROP?',
    options: [
      'A) DELETE is a DML command that removes rows one-by-one, logs each row deletion, fires DELETE triggers, and supports a WHERE clause; TRUNCATE is a DDL operation that deallocates data pages in bulk without firing row-level DELETE triggers; DROP removes both the data and the table schema definition.',
      'B) TRUNCATE supports a WHERE clause while DELETE does not.',
      'C) DELETE cannot be rolled back inside a transaction, whereas DROP can never be used on indexed tables.',
      'D) Both TRUNCATE and DROP delete only matching rows and preserve indexes.'
    ],
    correctAnswer: 'A',
    explanation: 'DELETE (DML) scans and deletes matching rows individually, writing undo/redo log entries per row and firing ON DELETE triggers. TRUNCATE (DDL) deallocates whole data pages at once, resets auto-increment counters, does not support a WHERE clause, and does not fire row-level DELETE triggers. DROP (DDL) removes the entire table structure, data, and indexes from the catalog.'
  },
  {
    id: 'dbms-test-q13',
    questionNumber: 13,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q13: Classic SQL Interview Trap: What does SELECT * FROM Emp WHERE dept_id NOT IN (10, 20, NULL); return, and why does NOT EXISTS behave differently?',
    question: 'What does SELECT * FROM Emp WHERE dept_id NOT IN (10, 20, NULL); return in standard SQL?',
    options: [
      'A) All employees whose dept_id is neither 10 nor 20.',
      'B) Exactly 0 rows (an empty result set)! Because x NOT IN (10, 20, NULL) expands to (x != 10 AND x != 20 AND x != NULL); in SQL 3-valued logic, x != NULL evaluates to UNKNOWN, and TRUE AND UNKNOWN evaluates to UNKNOWN (which WHERE filters out)!',
      'C) All employees whose dept_id is NULL.',
      'D) A syntax error because NULL cannot appear inside IN().'
    ],
    correctAnswer: 'B',
    explanation: 'This is one of the most famous SQL production bugs! When a subquery inside NOT IN (SELECT mgr_id FROM ...) returns even a single NULL value, x NOT IN (10, 20, NULL) is logically equivalent to x != 10 AND x != 20 AND x != NULL. Because any comparison with NULL using = or != yields UNKNOWN (never TRUE), the entire AND conjunction evaluates to UNKNOWN (or FALSE) for every single row—returning 0 rows! Using NOT EXISTS avoids this trap.'
  },
  {
    id: 'dbms-test-q14',
    questionNumber: 14,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q14: Which internal DBMS components are directly responsible for enforcing Atomicity, Isolation, and Durability in ACID transactions?',
    question: 'Which internal DBMS components are directly responsible for enforcing Atomicity, Isolation, and Durability in ACID transactions?',
    options: [
      'A) Atomicity: Query Optimizer | Isolation: Disk Controller | Durability: Deadlock Detector',
      'B) Atomicity: Recovery Manager (Undo Log) | Isolation: Concurrency Control Manager (Locks / MVCC) | Durability: Recovery Manager (Redo Log / Write-Ahead Logging)',
      'C) Atomicity: B+ Tree Index | Isolation: Foreign Keys | Durability: Buffer Pool',
      'D) All three are enforced solely by the client application code.'
    ],
    correctAnswer: 'B',
    explanation: '1) Atomicity ("all or nothing") is guaranteed by the Recovery Manager using Undo logs to roll back partial changes of aborted transactions. 2) Isolation is guaranteed by the Concurrency Control Manager using 2PL locking, timestamps, or MVCC snapshots. 3) Durability is guaranteed by the Recovery Manager flushing Redo logs (WAL) to non-volatile disk before acknowledging commit.'
  },
  {
    id: 'dbms-test-q15',
    questionNumber: 15,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q15: Under the SQL standard, which concurrency anomalies are prevented by the REPEATABLE READ isolation level, and which anomaly can still theoretically occur according to the ANSI SQL specification?',
    question: 'Under the ANSI SQL standard, which concurrency anomalies are prevented by the REPEATABLE READ isolation level, and which anomaly can still occur?',
    options: [
      'A) Prevents Dirty Reads and Non-Repeatable Reads, but still allows Phantom Reads.',
      'B) Prevents only Dirty Reads, and allows Non-Repeatable Reads and Phantom Reads.',
      'C) Prevents Phantom Reads, but allows Dirty Reads.',
      'D) Prevents all anomalies only when autocommit is disabled.'
    ],
    correctAnswer: 'A',
    explanation: 'In the ANSI SQL standard hierarchy: READ COMMITTED prevents Dirty Reads; REPEATABLE READ prevents both Dirty Reads and Non-Repeatable Reads (by holding read locks or snapshot versions on read rows), but still permits Phantom Reads (new rows inserted by another transaction matching a WHERE range predicate); SERIALIZABLE prevents all three.'
  },
  {
    id: 'dbms-test-q16',
    questionNumber: 16,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q16: Which pair of operations in a concurrent schedule S does NOT constitute a conflict pair when constructing a Precedence (Serialization) Graph?',
    question: 'Which pair of operations in a concurrent schedule S does NOT constitute a conflict pair when constructing a Precedence (Serialization) Graph?',
    options: [
      'A) R1(A) followed by W2(A)',
      'B) W1(A) followed by R2(A)',
      'C) R1(A) followed by R2(A), OR W1(A) followed by W2(B)',
      'D) W1(A) followed by W2(A)'
    ],
    correctAnswer: 'C',
    explanation: 'Two operations conflict if and only if: (1) they belong to different transactions (Ti != Tj), (2) they access the exact same data item (both on A), AND (3) at least one of them is a Write operation (RW, WR, or WW). Two Read operations on the same item (R1(A), R2(A)) commute and never conflict; operations on different data items (W1(A), W2(B)) also never conflict.'
  },
  {
    id: 'dbms-test-q17',
    questionNumber: 17,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q17: Which statement regarding the relationship between Conflict Serializability and View Serializability is TRUE?',
    question: 'Which statement regarding the relationship between Conflict Serializability and View Serializability is TRUE?',
    options: [
      'A) Every View Serializable schedule is Conflict Serializable.',
      'B) Every Conflict Serializable schedule is View Serializable, and any schedule that is View Serializable but NOT Conflict Serializable MUST contain at least one Blind Write (a Write operation performed without having read the item first).',
      'C) Checking View Serializability takes O(V + E) polynomial time, whereas checking Conflict Serializability is NP-Complete.',
      'D) A schedule with a cycle in its Precedence Graph can never be View Serializable.'
    ],
    correctAnswer: 'B',
    explanation: 'Conflict Serializability is a subset of View Serializability (Conflict Serializable => View Serializable). Testing Conflict Serializability via cycle detection in a Precedence Graph takes polynomial time O(V + E), whereas testing View Serializability is NP-Complete! Crucially, if a schedule has a cycle in its Precedence Graph yet is still View Serializable, it is guaranteed to contain a Blind Write (writing a value without reading it first).'
  },
  {
    id: 'dbms-test-q18',
    questionNumber: 18,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q18: Consider the hierarchy of schedule recoverability: Strict Schedules, Cascadeless (ACA) Schedules, and Recoverable Schedules. What is the exact subset relationship and rule for each?',
    question: 'Consider the hierarchy of schedule recoverability: Strict Schedules, Cascadeless (ACA) Schedules, and Recoverable Schedules. What is the exact subset relationship and rule for each?',
    options: [
      'A) Strict ⊂ Cascadeless ⊂ Recoverable: Recoverable requires Tj (which reads from Ti) to commit after Ti commits; Cascadeless requires Tj to read only after Ti commits (no dirty reads); Strict requires Tj to neither read NOR write an item written by Ti until Ti commits or aborts.',
      'B) Recoverable ⊂ Cascadeless ⊂ Strict.',
      'C) Cascadeless schedules allow dirty reads as long as commits happen in order.',
      'D) Every Conflict Serializable schedule is automatically Recoverable.'
    ],
    correctAnswer: 'A',
    explanation: '1) Recoverable: If Tj reads an uncommitted value written by Ti, Tj must not commit until Ti commits. 2) Cascadeless (Avoids Cascading Aborts): Tj is not allowed to READ an item written by Ti until Ti has committed (eliminates dirty reads). 3) Strict: Tj is not allowed to READ OR OVERWRITE (Write) an item written by Ti until Ti has committed or aborted. Therefore, Every Strict schedule is Cascadeless, and every Cascadeless schedule is Recoverable (Strict ⊂ Cascadeless ⊂ Recoverable).'
  },
  {
    id: 'dbms-test-q19',
    questionNumber: 19,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q19: How do Basic 2PL, Strict 2PL, Rigorous 2PL, and Conservative (Static) 2PL differ in terms of Cascading Rollbacks and Deadlocks?',
    question: 'How do Basic 2PL, Strict 2PL, Rigorous 2PL, and Conservative (Static) 2PL differ in terms of Cascading Rollbacks and Deadlocks?',
    options: [
      'A) Basic 2PL prevents deadlocks; Strict 2PL allows cascading rollbacks.',
      'B) Strict 2PL holds all Exclusive (X) locks until commit/abort (preventing cascading rollbacks) and Rigorous 2PL holds both S and X locks until commit/abort, but BOTH can still deadlock; Conservative 2PL pre-declares and acquires all locks before execution starts, making it 100% Deadlock-Free!',
      'C) Rigorous 2PL is deadlock-free while Conservative 2PL can deadlock.',
      'D) None of the 2PL variants guarantee Conflict Serializability.'
    ],
    correctAnswer: 'B',
    explanation: 'All 2PL variants guarantee Conflict Serializability. Basic 2PL can suffer from both cascading rollbacks (because locks are released early in the shrinking phase before commit) and deadlocks. Strict 2PL (holds X locks until commit) and Rigorous 2PL (holds all S and X locks until commit) eliminate cascading rollbacks and guarantee strict schedules, but can still deadlock. Conservative (Static) 2PL requires a transaction to lock all items it needs upfront before starting (or release all and wait), eliminating hold-and-wait and making it Deadlock-Free.'
  },
  {
    id: 'dbms-test-q20',
    questionNumber: 20,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q20: In Timestamp Ordering Concurrency Control, how does Thomas\'s Write Rule modify the standard Timestamp Ordering protocol when Transaction Ti issues Write(X) with TS(Ti) < W-timestamp(X) (and TS(Ti) >= R-timestamp(X))?',
    question: 'In Timestamp Ordering Concurrency Control, how does Thomas\'s Write Rule modify the standard protocol when Transaction Ti issues Write(X) with TS(Ti) < W-timestamp(X) (and TS(Ti) >= R-timestamp(X))?',
    options: [
      'A) Standard Timestamp Ordering rolls back Ti, whereas Thomas\'s Write Rule simply ignores (skips) Ti\'s obsolete Write(X) and allows Ti to continue without rolling back!',
      'B) Thomas\'s Write Rule rolls back the younger transaction that wrote X.',
      'C) Thomas\'s Write Rule overwrites X anyway and updates W-timestamp(X) to TS(Ti).',
      'D) Thomas\'s Write Rule converts Write(X) into a Read(X).'
    ],
    correctAnswer: 'A',
    explanation: 'If TS(Ti) < W-timestamp(X), a younger transaction Tj has already overwritten X with a newer value. Provided no transaction has needed to read Ti\'s value (TS(Ti) >= R-timestamp(X)), Ti\'s write is an "obsolete write" that would have been immediately overwritten by Tj in a serial schedule anyway. Instead of aborting Ti (as Basic Timestamp Ordering does), Thomas\'s Write Rule ignores the obsolete write and lets Ti proceed—allowing more View Serializable schedules.'
  },
  {
    id: 'dbms-test-q21',
    questionNumber: 21,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q21: Transaction T1 has timestamp TS(T1) = 10 (Older) and Transaction T2 has timestamp TS(T2) = 20 (Younger). If T1 requests a lock currently held by T2, and separately if T2 requests a lock currently held by T1, what happens under Wait-Die vs. Wound-Wait?',
    question: 'Transaction T1 has timestamp TS(T1) = 10 (Older) and Transaction T2 has timestamp TS(T2) = 20 (Younger). Compare what happens when (Case 1) Older T1 requests a lock held by Younger T2, and (Case 2) Younger T2 requests a lock held by Older T1 under Wait-Die vs. Wound-Wait:',
    options: [
      'A) Wait-Die: Case 1 -> T1 waits, Case 2 -> T2 dies (aborts) | Wound-Wait: Case 1 -> T1 wounds (aborts) T2, Case 2 -> T2 waits.',
      'B) Wait-Die: Case 1 -> T1 dies, Case 2 -> T2 waits | Wound-Wait: Case 1 -> T1 waits, Case 2 -> T2 dies.',
      'C) Both schemes abort the older transaction T1 in Case 1.',
      'D) Wait-Die is preemptive while Wound-Wait is non-preemptive.'
    ],
    correctAnswer: 'A',
    explanation: 'Wait-Die is non-preemptive: an Older transaction is allowed to WAIT for a Younger one (Case 1: T1 waits), while a Younger transaction requesting a lock held by an Older one DIES/rolls back (Case 2: T2 dies). Wound-Wait is preemptive: an Older transaction WOUNDS/preempts a Younger lock holder (Case 1: T2 is rolled back and T1 gets the lock), while a Younger transaction is allowed to WAIT for an Older one (Case 2: T2 waits). In both schemes, a rolled-back transaction keeps its original timestamp so it never starves.'
  },
  {
    id: 'dbms-test-q22',
    questionNumber: 22,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q22: Why must a Secondary Index (on a non-ordering field) ALWAYS be a Dense Index, whereas a Primary Index (on the ordering Primary Key) can be a Sparse Index?',
    question: 'Why must a Secondary Index (on a non-ordering field) ALWAYS be a Dense Index, whereas a Primary Index (on the ordering Primary Key) can be a Sparse Index?',
    options: [
      'A) Because Secondary Indexes are stored in RAM whereas Primary Indexes are stored on disk.',
      'B) Because the data file is physically sorted by the Primary Key—so a Primary Index only needs 1 entry per disk block (pointing to the block\'s anchor record), whereas records ordered by a Secondary Index key are physically scattered across arbitrary disk blocks, requiring an index entry for every single record!',
      'C) Because Primary Keys cannot be integers.',
      'D) Because Sparse Indexes cannot use binary search.'
    ],
    correctAnswer: 'B',
    explanation: 'A Sparse Index only works when the underlying data file is physically sorted on disk by the indexed search key (so if you look for key 45 and block 1 starts at 10 and block 2 starts at 50, you know key 45 must be inside block 1). For a Secondary Index, the data file is NOT physically sorted by that secondary column, so consecutive key values live in completely different disk blocks—requiring a Dense Index with a pointer to every individual record (or every unique key\'s bucket).'
  },
  {
    id: 'dbms-test-q23',
    questionNumber: 23,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q23: Why do almost all production RDBMS storage engines (PostgreSQL, MySQL InnoDB, SQL Server, Oracle) use B+ Trees instead of B-Trees for table and column indexes?',
    question: 'Why do almost all production RDBMS storage engines (PostgreSQL, MySQL InnoDB, SQL Server, Oracle) use B+ Trees instead of B-Trees for table and column indexes?',
    options: [
      'A) B+ Trees are binary trees with at most 2 children per node.',
      'B) In a B+ Tree, internal nodes store ONLY routing keys and child block pointers (no data records/record pointers), which maximizes node fanout and reduces tree height (fewer disk I/Os), AND all leaf nodes are linked in a sorted doubly linked list for fast O(log N + K) range queries!',
      'C) B-Trees duplicate keys in leaf nodes whereas B+ Trees never duplicate keys.',
      'D) B+ Trees do not require rebalancing on insertions or deletions.'
    ],
    correctAnswer: 'B',
    explanation: 'In a B-Tree, data record pointers are stored inside internal nodes alongside keys, consuming valuable space inside each 4KB/8KB disk block and reducing the branching factor (fanout). A B+ Tree strips all data pointers out of internal nodes (putting them exclusively in the leaves), packing 2x–3x more keys per internal node so a 3-level B+ Tree can index hundreds of millions of rows. Plus, the linked leaf nodes make range queries (`BETWEEN`, `>`, `<`) a fast sequential scan instead of an in-order tree traversal.'
  },
  {
    id: 'dbms-test-q24',
    questionNumber: 24,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Hard',
    title: 'Q24: In Crash Recovery using Write-Ahead Logging (WAL), what is the difference between Deferred Database Modification and Immediate Database Modification?',
    question: 'In Crash Recovery using Write-Ahead Logging (WAL), what is the difference between Deferred Database Modification and Immediate Database Modification?',
    options: [
      'A) Deferred Modification buffers all database page writes until the transaction commits (so recovery requires ONLY Redo and NO Undo, known as NO-UNDO/REDO); Immediate Modification allows uncommitted dirty pages to be flushed to disk before commit (requiring BOTH Undo for active/aborted transactions and Redo for committed transactions).',
      'B) Deferred Modification requires only Undo and no Redo.',
      'C) Immediate Modification does not write log records before modifying disk pages.',
      'D) Both schemes require identical Undo passes for committed transactions.'
    ],
    correctAnswer: 'A',
    explanation: 'Under Deferred Database Modification (NO-STEAL), uncommitted changes are never written to the database disk files before the transaction commits—so if a crash occurs before commit, the database disk is untouched and needs NO Undo (only Redo for committed transactions). Under Immediate Database Modification (STEAL/NO-FORCE, used by ARIES in real databases), dirty pages can be written to disk before commit as long as the Undo/Redo log record is flushed to disk first (WAL), requiring both Undo (for uncommitted transactions) and Redo (for committed transactions) on crash recovery.'
  },
  {
    id: 'dbms-test-q25',
    questionNumber: 25,
    type: 'mcq',
    category: 'Theory & Concept',
    difficulty: 'Moderate',
    title: 'Q25: According to the CAP Theorem for Distributed Databases, why can a distributed system guarantee at most 2 out of 3 properties (Consistency, Availability, Partition Tolerance), and which trade-off must real-world distributed databases actually choose?',
    question: 'According to the CAP Theorem for Distributed Databases, which trade-off must real-world distributed databases actually choose when a network partition occurs between nodes?',
    options: [
      'A) Real-world networks never partition, so distributed databases always choose CA.',
      'B) Because network partitions (P) are inevitable in distributed networks, a system must choose between CP (Consistency + Partition Tolerance: reject/block requests on the disconnected side to prevent stale data) and AP (Availability + Partition Tolerance: serve requests on both sides and resolve eventual consistency later).',
      'C) CAP Theorem states that single-node SQL databases cannot have ACID Consistency.',
      'D) AP systems guarantee strict linearizability at all times.'
    ],
    correctAnswer: 'B',
    explanation: 'In any distributed system across multiple machines/datacenters, network packet drops and partitions (P) are a physical reality. When a network partition splits Node A and Node B, the database must either: (1) choose CP (cancel/error writes on the minority partition so no client ever reads stale inconsistent data), or (2) choose AP (allow both nodes to remain 100% available for reads/writes and reconcile conflicts asynchronously via Eventual Consistency).'
  },

  // =========================================================================
  // SECTION B: NUMERICAL & CALCULATION PROBLEMS (QUESTIONS 26 TO 40)
  // =========================================================================
  {
    id: 'dbms-test-q26',
    questionNumber: 26,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q26: [Candidate Key Count Math] Consider relation R(A, B, C, D, E, F) with the set of Functional Dependencies F = { AB -> C, C -> D, D -> B, E -> F }. How many Candidate Keys does R have, and what are they?',
    question: 'Consider relation R(A, B, C, D, E, F) with the set of Functional Dependencies:\nF = { AB -> C, C -> D, D -> B, E -> F }\nHow many Candidate Keys does R have, and what are they?',
    options: [
      'A) 1 Candidate Key: { ABE }',
      'B) 2 Candidate Keys: { ABE, ACE }',
      'C) 3 Candidate Keys: { ABE, ACE, ADE }',
      'D) 4 Candidate Keys: { ABE, ACE, ADE, AFE }'
    ],
    correctAnswer: 'C',
    explanation: 'Step 1: Find essential attributes (attributes that NEVER appear on the right-hand side of any FD): A and E never appear on the RHS, so {A, E} MUST be part of every Candidate Key! Step 2: Compute closure of {A, E}+ = {A, E, F} (missing B, C, D). Step 3: Try adding one attribute from {B, C, D}: (1) {ABE}+ = {A, B, E, F, C, D} (All 6! So ABE is a CK). (2) Since C -> D -> B, replacing B with C gives {ACE}+ = {A, C, E, F, D, B} (All 6! So ACE is a CK). (3) Since D -> B, replacing B with D gives {ADE}+ = {A, D, E, F, B, C} (All 6! So ADE is a CK). Total = 3 Candidate Keys: {ABE, ACE, ADE}.'
  },
  {
    id: 'dbms-test-q27',
    questionNumber: 27,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q27: [Superkey Combinatorics Math] A relation R(A, B, C, D, E, F) with 6 attributes has exactly two Candidate Keys: {A, B} and {B, C}. What is the exact total number of Superkeys for R?',
    question: 'A relation R(A, B, C, D, E, F) with 6 attributes has exactly two Candidate Keys: {A, B} and {B, C}. What is the exact total number of Superkeys for R?',
    options: [
      'A) 16',
      'B) 24',
      'C) 32',
      'D) 28'
    ],
    correctAnswer: 'B',
    explanation: 'Use the Principle of Inclusion-Exclusion! A Superkey is any subset of {A,B,C,D,E,F} that contains {A,B} OR contains {B,C}: 1) Number of subsets containing {A, B} (4 remaining attributes C, D, E, F can each be present or absent) = 2^(6-2) = 2^4 = 16. 2) Number of subsets containing {B, C} (4 remaining attributes A, D, E, F) = 2^(6-2) = 2^4 = 16. 3) Subsets containing BOTH {A, B} and {B, C} (i.e., containing {A, B, C}, with 3 remaining attributes D, E, F) were counted twice = 2^(6-3) = 2^3 = 8. Total Superkeys = 16 + 16 - 8 = 24.'
  },
  {
    id: 'dbms-test-q28',
    questionNumber: 28,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q28: [Highest Normal Form Calculation] Given relation R(A, B, C, D, E) with FDs F = { AB -> C, C -> D, B -> E }, what is the Candidate Key of R and what is the HIGHEST Normal Form satisfied by R?',
    question: 'Given relation R(A, B, C, D, E) with Functional Dependencies:\nF = { AB -> C, C -> D, B -> E }\nWhat is the Candidate Key of R, and what is the HIGHEST Normal Form satisfied by R?',
    options: [
      'A) Candidate Key: AB | Highest Normal Form: 1NF (violates 2NF because Non-Prime E depends on proper subset B of Candidate Key AB)',
      'B) Candidate Key: AB | Highest Normal Form: 2NF (violates 3NF due to C -> D)',
      'C) Candidate Key: ABC | Highest Normal Form: 3NF',
      'D) Candidate Key: AB | Highest Normal Form: BCNF'
    ],
    correctAnswer: 'A',
    explanation: 'Step 1: Find Candidate Key: A and B never appear on the RHS of any FD. Check closure {AB}+: AB -> C, C -> D, B -> E, so {AB}+ = {A, B, C, D, E}. Thus, the sole Candidate Key is AB! Prime attributes = {A, B}; Non-Prime attributes = {C, D, E}. Step 2: Check 2NF: In the FD B -> E, the LHS (B) is a proper subset of the Candidate Key AB, and the RHS (E) is a Non-Prime attribute! This is a textbook Partial Dependency, so R violates 2NF! Highest Normal Form satisfied is 1NF.'
  },
  {
    id: 'dbms-test-q29',
    questionNumber: 29,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q29: [ER-to-Relational Table Count Math] An ER diagram consists of: 3 strong entity sets (E1, E2, E3), 1 weak entity set W (identified by E1 via identifying relationship R_w), a 1:N relationship R1 between E1 and E2, an M:N relationship R2 between E2 and E3, and 1 multivalued attribute on E3. What is the MINIMUM number of relational tables required to represent this database without redundancy?',
    question: 'An ER diagram consists of: 3 strong entity sets (E1, E2, E3), 1 weak entity set W (identified by E1 via identifying relationship R_w), a 1:N relationship R1 between E1 and E2, an M:N relationship R2 between E2 and E3, and 1 multivalued attribute on E3. What is the MINIMUM number of relational tables required?',
    options: [
      'A) 4 tables',
      'B) 5 tables',
      'C) 6 tables',
      'D) 7 tables'
    ],
    correctAnswer: 'C',
    explanation: 'Let\'s count each required table: 1) Three strong entity sets E1, E2, E3 -> 3 tables (the 1:N relationship R1 between E1 and E2 is merged into the N-side table E2 as a foreign key, adding 0 extra tables). 2) Weak entity set W + its identifying relationship R_w -> 1 combined table (+1 = 4). 3) M:N relationship R2 between E2 and E3 -> requires 1 separate junction table (+1 = 5). 4) Multivalued attribute on E3 -> requires 1 separate table (+1 = 6). Total = 6 tables.'
  },
  {
    id: 'dbms-test-q30',
    questionNumber: 30,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q30: [Join Cardinality Bounds Math] Relation R(A, B) has 150 tuples and relation S(B, C) has 60 tuples. Attribute B is the Primary Key of S, and B in R is a Foreign Key referencing S(B) with a NOT NULL constraint. What are the MINIMUM and MAXIMUM number of tuples in the Natural Join R ⋈ S?',
    question: 'Relation R(A, B) has 150 tuples and relation S(B, C) has 60 tuples. Attribute B is the Primary Key of S, and B in R is a Foreign Key referencing S(B) with a NOT NULL constraint. What are the MINIMUM and MAXIMUM number of tuples in the Natural Join R ⋈ S?',
    options: [
      'A) Minimum = 0, Maximum = 9000',
      'B) Minimum = 60, Maximum = 150',
      'C) Minimum = 150, Maximum = 150',
      'D) Minimum = 0, Maximum = 150'
    ],
    correctAnswer: 'C',
    explanation: 'Because R.B is a NOT NULL Foreign Key referencing the Primary Key S.B, every single one of the 150 tuples in R is guaranteed to match AT LEAST one tuple in S (referential integrity + NOT NULL) and AT MOST one tuple in S (since S.B is a unique Primary Key)! Therefore, every tuple in R produces exactly 1 joined tuple, so both the minimum and maximum cardinality of R ⋈ S are 150!'
  },
  {
    id: 'dbms-test-q31',
    questionNumber: 31,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q31: [Concurrent vs. Serial Schedule Count Math] Transaction T1 has 3 operations and Transaction T2 has 4 operations. How many total valid interleaved (concurrent + serial) schedules exist, and how many of them are strictly non-serial?',
    question: 'Transaction T1 consists of 3 operations and Transaction T2 consists of 4 operations. How many total valid schedules (preserving the internal operation order of each transaction) exist, and how many of them are strictly non-serial?',
    options: [
      'A) Total = 35 schedules | Non-serial = 33 schedules',
      'B) Total = 12 schedules | Non-serial = 10 schedules',
      'C) Total = 70 schedules | Non-serial = 68 schedules',
      'D) Total = 5040 schedules | Non-serial = 5038 schedules'
    ],
    correctAnswer: 'A',
    explanation: 'For k transactions with n1, n2, ... operations, the total number of valid schedules that preserve each transaction\'s internal instruction order is (n1 + n2)! / (n1! * n2!) = (3 + 4)! / (3! * 4!) = 7! / (6 * 24) = (7 * 6 * 5) / 6 = 35 total schedules. Since there are k! = 2! = 2 serial schedules (T1->T2 and T2->T1), the number of strictly non-serial schedules is 35 - 2 = 33.'
  },
  {
    id: 'dbms-test-q32',
    questionNumber: 32,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q32: [Precedence Graph & Serial Order Math] Consider schedule S: R1(A), R2(B), W1(B), R3(A), W2(C), W3(B), R1(C). By constructing the Precedence Graph for S, determine whether S is Conflict Serializable and its equivalent serial order:',
    question: 'Consider the schedule S across transactions T1, T2, and T3:\nS: R1(A), R2(B), W1(B), R3(A), W2(C), W3(B), R1(C)\nBy constructing the Precedence Graph for S, determine whether S is Conflict Serializable:',
    options: [
      'A) Conflict Serializable; equivalent to T2 -> T1 -> T3',
      'B) Conflict Serializable; equivalent to T1 -> T2 -> T3',
      'C) Conflict Serializable; equivalent to T3 -> T1 -> T2',
      'D) Not Conflict Serializable because the Precedence Graph contains a cycle between T1 and T2.'
    ],
    correctAnswer: 'A',
    explanation: 'Let\'s find all conflicting pairs on A, B, and C: 1) On A: Only R1(A) and R3(A) (both Reads -> 0 conflicts). 2) On B: R2(B) before W1(B) gives edge T2 -> T1; R2(B) before W3(B) gives edge T2 -> T3; W1(B) before W3(B) gives edge T1 -> T3. 3) On C: W2(C) before R1(C) gives edge T2 -> T1. Combined directed edges: T2 -> T1, T2 -> T3, and T1 -> T3. There are NO cycles (DAG)! The unique topological sort is T2 -> T1 -> T3.'
  },
  {
    id: 'dbms-test-q33',
    questionNumber: 33,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q33: [B+ Tree Internal Node Order Math] A database has a disk block size of 4096 bytes. A search key field is 12 bytes long, and a disk block pointer is 8 bytes long. What is the maximum order p (maximum number of block pointers) of an internal B+ Tree node?',
    question: 'A database uses a disk block size of 4096 bytes. The search key field is 12 bytes long, a disk block pointer is 8 bytes long, and a data record pointer is 10 bytes long. What is the maximum order p (maximum number of child block pointers) of an INTERNAL node in a B+ Tree?',
    options: [
      'A) 136',
      'B) 186',
      'C) 205',
      'D) 256'
    ],
    correctAnswer: 'C',
    explanation: 'Crucial B+ Tree fact: Internal nodes of a B+ Tree do NOT store data record pointers (the 10-byte record pointer is only in leaf nodes or B-Trees!). An internal node of order p contains at most p block pointers (8B each) and p - 1 search keys (12B each). Setting up the inequality: 8p + 12(p - 1) <= 4096 => 20p - 12 <= 4096 => 20p <= 4108 => p <= 205.4. Flooring to an integer gives p = 205.'
  },
  {
    id: 'dbms-test-q34',
    questionNumber: 34,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q34: [B-Tree vs. B+ Tree Leaf Order Math] Using the same parameters from Q33 (Block size = 4096B, Search Key = 12B, Block Pointer = 8B, Data Record Pointer = 10B), what is the maximum number of (key, record_pointer) entries that can fit in a B+ Tree LEAF node (which also holds 1 next-leaf block pointer)?',
    question: 'Using the parameters from Q33 (Block size = 4096B, Search Key = 12B, Block Pointer = 8B, Data Record Pointer = 10B), what is the maximum number of (key, record_pointer) pairs p_leaf that can fit inside a B+ Tree LEAF node?',
    options: [
      'A) 136',
      'B) 185',
      'C) 204',
      'D) 205'
    ],
    correctAnswer: 'B',
    explanation: 'A B+ Tree leaf node holds p_leaf pairs of (Search Key + Data Record Pointer) plus 1 block pointer to the next sibling leaf node. Inequality: p_leaf * (12 + 10) + 8 <= 4096 => 22 * p_leaf <= 4088 => p_leaf <= 185.81 => p_leaf = 185 entries.'
  },
  {
    id: 'dbms-test-q35',
    questionNumber: 35,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q35: [Primary Sparse Index Disk I/O Math] An ordered file has 30,000 records of size 100 bytes each, stored unspanned in disk blocks of 1024 bytes. A sparse Primary Index is built with key = 9 bytes and block pointer = 6 bytes. How many disk block accesses are needed to locate and fetch a record using binary search on the Primary Index?',
    question: 'An ordered file has 30,000 records of size 100 bytes each, stored unspanned in disk blocks of 1024 bytes. A sparse Primary Index is built with search key = 9 bytes and block pointer = 6 bytes. How many total disk block accesses are required in the worst case to locate and fetch a data record using binary search on the Primary Index?',
    options: [
      'A) 6 block accesses',
      'B) 7 block accesses',
      'C) 12 block accesses',
      'D) 13 block accesses'
    ],
    correctAnswer: 'B',
    explanation: 'Step 1: Data file blocking factor bfr = floor(1024 / 100) = 10 records/block. Total data blocks B = ceil(30,000 / 10) = 3,000 data blocks (without an index, binary search on the data file would take ceil(log2(3000)) = 12 block accesses). Step 2: Since a Primary Index is SPARSE, it has 1 index entry per data block = 3,000 index entries! Step 3: Index blocking factor bfr_i = floor(1024 / (9 + 6)) = floor(1024 / 15) = 68 index entries/block. Total index blocks B_i = ceil(3,000 / 68) = 45 index blocks. Step 4: Binary search on 45 index blocks takes ceil(log2(45)) = 6 block accesses + 1 block access to read the actual target data block = 7 block accesses!'
  },
  {
    id: 'dbms-test-q36',
    questionNumber: 36,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q36: [Timestamp Ordering Rejection Trace] Transactions T1, T2, and T3 have timestamps TS(T1) = 10, TS(T2) = 20, and TS(T3) = 30. Initially R-TS(A) = W-TS(A) = 0. Given the sequence: R1(A), W3(A), R2(A), W2(A), which exact operation is rejected and causes its transaction to roll back under the Basic Timestamp Ordering protocol?',
    question: 'Transactions T1, T2, and T3 have timestamps TS(T1) = 10, TS(T2) = 20, and TS(T3) = 30. Initially R-TS(A) = 0 and W-TS(A) = 0. Under the Basic Timestamp Ordering protocol, trace the sequence:\n1. R1(A)   2. W3(A)   3. R2(A)   4. W2(A)\nWhich operation is the FIRST to be rejected and cause a rollback?',
    options: [
      'A) Step 1: R1(A)',
      'B) Step 2: W3(A)',
      'C) Step 3: R2(A) (because TS(T2) = 20 < W-TS(A) = 30)',
      'D) Step 4: W2(A)'
    ],
    correctAnswer: 'C',
    explanation: 'Let\'s trace step-by-step: 1) R1(A): TS(T1)=10 >= W-TS(A)=0 -> Allowed! R-TS(A) becomes max(0, 10) = 10. 2) W3(A): TS(T3)=30 >= R-TS(A)=10 and >= W-TS(A)=0 -> Allowed! W-TS(A) becomes 30. 3) R2(A): T2 tries to read A, so we check if TS(T2) < W-TS(A). Since TS(T2) = 20 < W-TS(A) = 30, a younger transaction (T3) has already overwritten A! Therefore, R2(A) is rejected at Step 3 and T2 is rolled back and restarted with a new timestamp.'
  },
  {
    id: 'dbms-test-q37',
    questionNumber: 37,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q37: [Undo/Redo Crash Recovery Log Math] A system using Immediate Database Modification crashes. The recovery log on disk contains (in format <Ti, Var, OldVal, NewVal>): <T1, start>, <T1, A, 10, 50>, <T2, start>, <T2, B, 20, 80>, <T1, commit>, <T3, start>, <T3, C, 30, 90>. After recovery completes, what are the guaranteed values of A, B, and C, and which operations were performed?',
    question: 'A system using Immediate Database Modification crashes. The WAL log on disk shows:\n<T1, start>\n<T1, A, 10, 50>\n<T2, start>\n<T2, B, 20, 80>\n<T1, commit>\n<T3, start>\n<T3, C, 30, 90>\n[CRASH]\nWhat are the recovery actions and final values of A, B, and C after recovery?',
    options: [
      'A) Redo T1; Undo T2 and T3 -> Final values: A = 50, B = 20, C = 30',
      'B) Redo T1, T2, and T3 -> Final values: A = 50, B = 80, C = 90',
      'C) Undo T1, T2, and T3 -> Final values: A = 10, B = 20, C = 30',
      'D) Redo T1 and T2; Undo T3 -> Final values: A = 50, B = 80, C = 30'
    ],
    correctAnswer: 'A',
    explanation: 'During recovery under Immediate Modification: 1) Transaction T1 has both <T1, start> and <T1, commit> in the log, so T1 is placed in the REDO list (setting A to its new value 50). 2) Transactions T2 and T3 have <start> records but NO <commit> record before the crash, so both T2 and T3 are placed in the UNDO list (restoring B to its old value 20 and C to its old value 30). Final values: A = 50, B = 20, C = 30.'
  },
  {
    id: 'dbms-test-q38',
    questionNumber: 38,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q38: [SQL NULL Aggregate Math] Table "Products" has 5 rows with "bonus" column values: 100, NULL, 200, NULL, 300. What is the exact numerical output of: SELECT COUNT(*), COUNT(bonus), AVG(bonus), SUM(bonus) FROM Products;?',
    question: 'Table "Products" has 5 rows with "bonus" column values: 100, NULL, 200, NULL, 300. What is the exact numerical output of:\nSELECT COUNT(*), COUNT(bonus), AVG(bonus), SUM(bonus) FROM Products;',
    options: [
      'A) 5, 5, 120, 600',
      'B) 5, 3, 200, 600',
      'C) 3, 3, 200, 600',
      'D) 5, 3, NULL, NULL'
    ],
    correctAnswer: 'B',
    explanation: 'In SQL, all aggregate functions EXCEPT COUNT(*) completely ignore NULL values! 1) COUNT(*) counts all 5 rows = 5. 2) COUNT(bonus) counts only non-null values (100, 200, 300) = 3. 3) SUM(bonus) = 100 + 200 + 300 = 600. 4) AVG(bonus) divides the sum by the count of non-null rows (600 / 3 = 200, NOT 600 / 5 = 120!). Output: 5, 3, 200, 600.'
  },
  {
    id: 'dbms-test-q39',
    questionNumber: 39,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Hard',
    title: 'Q39: [Block Nested Loop Join Disk I/O Math] Relation R occupies 600 disk blocks and relation S occupies 100 disk blocks. The buffer pool has 22 memory frames available (20 frames for the outer relation chunk, 1 frame for the inner relation block, 1 frame for output). What is the minimum number of disk block reads required to perform a Block Nested Loop Join of R and S?',
    question: 'Relation R occupies 600 disk blocks and relation S occupies 100 disk blocks. The buffer pool has 22 memory frames available (M - 2 = 20 frames for buffering chunks of the outer relation, 1 frame for the inner relation, 1 frame for output). What is the MINIMUM number of disk block I/O reads required for a Block Nested Loop Join?',
    options: [
      'A) 3,100 block reads',
      'B) 6,100 block reads',
      'C) 18,600 block reads',
      'D) 60,100 block reads'
    ],
    correctAnswer: 'A',
    explanation: 'In a Block Nested Loop Join with buffer chunk size B_chunk = M - 2 = 20 blocks, the cost formula is: B_outer + ceil(B_outer / 20) * B_inner. Always choose the SMALLER relation (S = 100 blocks) as the outer relation! Cost = 100 + ceil(100 / 20) * 600 = 100 + 5 * 600 = 3,100 disk block reads. (If R were chosen as outer, cost would be 600 + ceil(600/20)*100 = 3,600).'
  },
  {
    id: 'dbms-test-q40',
    questionNumber: 40,
    type: 'mcq',
    category: 'Numerical & Calculation',
    difficulty: 'Moderate',
    title: 'Q40: [Canonical / Minimal Cover Math] Given relation R(A, B, C) and Functional Dependencies F = { A -> BC, B -> C, A -> B, AB -> C }, what is the exact Minimal (Canonical) Cover Fc of F?',
    question: 'Given relation R(A, B, C) and Functional Dependencies:\nF = { A -> BC, B -> C, A -> B, AB -> C }\nWhat is the exact Minimal (Canonical) Cover Fc of F?',
    options: [
      'A) { A -> B, B -> C } (2 FDs)',
      'B) { A -> BC, B -> C } (2 FDs)',
      'C) { A -> B, A -> C, B -> C } (3 FDs)',
      'D) { AB -> C, A -> B } (2 FDs)'
    ],
    correctAnswer: 'A',
    explanation: 'Step 1 (Singleton RHS): Split A -> BC into A -> B and A -> C. Set becomes { A -> B, A -> C, B -> C, AB -> C }. Step 2 (Remove extraneous LHS attributes): In AB -> C, since A+ includes B (via A -> B), B is extraneous on the LHS, reducing AB -> C to A -> C. Set becomes { A -> B, A -> C, B -> C }. Step 3 (Remove redundant FDs): Since A -> B and B -> C transitively imply A -> C, the FD A -> C is redundant and removed! The canonical cover is { A -> B, B -> C }.'
  },

  // =========================================================================
  // SECTION C: REAL-WORLD ENGINEERING & PRODUCTION SCENARIOS (QUESTIONS 41 TO 50)
  // =========================================================================
  {
    id: 'dbms-test-q41',
    questionNumber: 41,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q41: [Composite Index Leftmost Prefix Trap] An e-commerce engineering team creates a composite B+ Tree index CREATE INDEX idx_orders ON orders(customer_id, status, created_at);. Queries with WHERE customer_id = 101 AND status = \'PAID\' run in 2ms, but the admin dashboard query WHERE status = \'PAID\' AND created_at >= \'2026-01-01\' takes 4,500ms and performs a Full Table Scan! Why?',
    question: 'An engineering team creates a composite B+ Tree index on orders(customer_id, status, created_at). Queries filtering by (customer_id, status) run in 2ms, but queries filtering only by WHERE status = \'PAID\' AND created_at >= \'2026-01-01\' perform a slow Full Table Scan! Why?',
    options: [
      'A) B+ Tree indexes cannot index VARCHAR and TIMESTAMP columns together.',
      'B) Because of the B+ Tree Leftmost Prefix Rule: a composite index on (A, B, C) is sorted first by A, then by B within each A, and then by C. If the leading column (customer_id) is omitted from the WHERE clause, the engine cannot traverse the B+ Tree for (status, created_at)!',
      'C) Composite indexes only work on JOIN queries, not WHERE clauses.',
      'D) The query must use HAVING instead of WHERE.'
    ],
    correctAnswer: 'B',
    explanation: 'A composite B+ Tree index on (customer_id, status, created_at) is like a phonebook sorted by (LastName, FirstName, City). You can use it to look up (customer_id), (customer_id, status), or (customer_id, status, created_at). However, if you omit the leftmost prefix column (customer_id), the values of status ("PAID") are scattered across the entire tree under every customer_id—so the query planner cannot do a B+ Tree search and falls back to a scan (or requires a separate index starting with status).'
  },
  {
    id: 'dbms-test-q42',
    questionNumber: 42,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q42: [Race Condition in Flash-Sale / Ticket Booking] In a train ticket booking API, two users simultaneously click "Book" on the last remaining seat. Both requests run: SELECT seats_left FROM trains WHERE id = 99; (both read 1), and both run UPDATE trains SET seats_left = seats_left - 1 WHERE id = 99;, resulting in 2 confirmed tickets and seats_left = -1! Which database patterns prevent this Lost Update / Double-Booking bug?',
    question: 'Two users simultaneously click "Book" on the last train seat. Both transactions execute SELECT seats_left (both read 1) and then execute UPDATE trains SET seats_left = 0, double-booking the seat! Which database patterns properly prevent this?',
    options: [
      'A) Using READ UNCOMMITTED isolation level.',
      'B) Either (1) Pessimistic Locking: SELECT seats_left FROM trains WHERE id = 99 FOR UPDATE (acquires an exclusive row lock so the second transaction waits until the first commits), OR (2) Atomic Conditional Update / Optimistic Locking: UPDATE trains SET seats_left = seats_left - 1 WHERE id = 99 AND seats_left > 0 (and checking affectedRows == 1).',
      'C) Adding a secondary index on seats_left.',
      'D) Using LEFT JOIN instead of INNER JOIN.'
    ],
    correctAnswer: 'B',
    explanation: 'When reading a value in application memory and then issuing a separate UPDATE based on that read, two concurrent transactions under READ COMMITTED both read seats_left = 1 before either writes. Using SELECT ... FOR UPDATE locks the row on read so the second transaction blocks until the first commits (and then reads 0). Alternatively, a single atomic UPDATE ... WHERE id = 99 AND seats_left > 0 (or Optimistic Concurrency Control with a version column) ensures only 1 transaction gets affectedRows == 1.'
  },
  {
    id: 'dbms-test-q43',
    questionNumber: 43,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q43: [Deadlock Elimination in Wallet Transfers] In a payment microservice, User 1 transfers ₹100 to User 2 at the exact same millisecond that User 2 transfers ₹50 to User 1. Transaction 1 locks Wallet #1 and waits for Wallet #2; Transaction 2 locks Wallet #2 and waits for Wallet #1—triggering a database Deadlock! How do backend engineers structurally eliminate this deadlock?',
    question: 'User 1 transfers money to User 2 at the exact same millisecond that User 2 transfers money to User 1. T1 locks Wallet 1 then requests Wallet 2; T2 locks Wallet 2 then requests Wallet 1—causing a Deadlock! How do you structurally prevent this deadlock in code?',
    options: [
      'A) Increase the database connection pool size.',
      'B) Enforce a deterministic Canonical Lock Ordering: always sort the account IDs and acquire row locks in ascending order of account_id (first lock min(id1, id2), then lock max(id1, id2)), which breaks the Circular Wait condition!',
      'C) Disable database transactions.',
      'D) Catch the deadlock error and ignore it without retrying.'
    ],
    correctAnswer: 'B',
    explanation: 'A deadlock requires a Circular Wait cycle in the Wait-For Graph (T1 -> T2 -> T1). By enforcing a strict global lock acquisition order—always locking the smaller wallet_id first (Wallet #1) and the larger wallet_id second (Wallet #2) regardless of who is sender or receiver—both T1 and T2 try to lock Wallet #1 first! One succeeds and completes both updates while the other waits cleanly, making a cycle mathematically impossible.'
  },
  {
    id: 'dbms-test-q44',
    questionNumber: 44,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q44: [The N+1 Query Problem] A social media feed endpoint fetches the latest 100 posts (SELECT * FROM posts LIMIT 100;) and then loops over those 100 posts in Node.js, executing SELECT * FROM users WHERE id = ? for each post\'s author—sending 101 separate network round-trips to the database! How do you fix this?',
    question: 'An API endpoint fetches 100 posts (1 query) and then loops over the 100 posts in application code, executing SELECT * FROM users WHERE id = ? for each post (100 queries = 101 DB round-trips). What is this anti-pattern called and how is it solved?',
    options: [
      'A) It is called Object Slicing; solved by adding a B-Tree index.',
      'B) It is the N+1 Query Problem; solved by eager loading via a single SQL JOIN (SELECT p.*, u.name FROM posts p JOIN users u ON p.author_id = u.id) or batching with WHERE u.id IN (id1, id2, ..., id100), reducing 101 queries down to 1 or 2 queries!',
      'C) It is called Phantom Read; solved by SERIALIZABLE isolation.',
      'D) It is called Sharding; solved by splitting the table.'
    ],
    correctAnswer: 'B',
    explanation: 'The N+1 Query Problem is the #1 performance killer in backend applications using ORMs/ODMs. Even if each individual query takes 2ms, 101 sequential network round-trips add >200ms of latency. Combining them into a single SQL JOIN (or 2 queries using WHERE id IN (...)) fetches all data in 1–2 round-trips.'
  },
  {
    id: 'dbms-test-q45',
    questionNumber: 45,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q45: [Unindexed Foreign Key Trap on DELETE] A database has users(id PK) with 100,000 rows and activity_logs(id PK, user_id FK referencing users.id ON DELETE CASCADE) with 50,000,000 rows. Deleting a single user (DELETE FROM users WHERE id = 500) takes 18 seconds and spikes CPU to 100%, even though users.id is the Primary Key! Why?',
    question: 'Table users(id PK) has 100k rows and activity_logs(id PK, user_id FK ON DELETE CASCADE) has 50M rows. Executing DELETE FROM users WHERE id = 500 takes 18 seconds! Since users.id is already indexed as a Primary Key, why is DELETE so slow?',
    options: [
      'A) Primary Keys are only used for SELECT queries, not DELETE queries.',
      'B) To enforce the Foreign Key constraint (ON DELETE CASCADE / RESTRICT) when a row in users is deleted, the DBMS must check activity_logs for matching user_id = 500 rows. Because PostgreSQL/SQL Server do NOT automatically create an index on the Foreign Key column (activity_logs.user_id), it performs a Full Table Scan of all 50,000,000 rows in activity_logs!',
      'C) DELETE cannot use B+ Trees.',
      'D) The users table needs to be denormalized.'
    ],
    correctAnswer: 'B',
    explanation: 'While RDBMS engines automatically create a unique B+ Tree index on a Primary Key (users.id), many engines (like PostgreSQL, SQL Server, Oracle) do NOT automatically create an index on the child table\'s Foreign Key column (activity_logs.user_id)! Whenever you DELETE or UPDATE a parent key in users, the database must search the child table activity_logs to check for dependent rows—triggering a 50-million-row sequential scan unless you explicitly create an index on activity_logs(user_id).'
  },
  {
    id: 'dbms-test-q46',
    questionNumber: 46,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q46: [Over-Indexing Write Amplification] A developer adds 12 separate secondary B+ Tree indexes to a high-velocity telemetry_events table to make every possible analytics filter fast. Immediately, INSERT and UPDATE throughput drops by 75%. Why?',
    question: 'A developer adds 12 secondary B+ Tree indexes to a write-heavy telemetry_events table. Immediately, INSERT and UPDATE throughput drops by 75%. Why do excessive indexes hurt write performance?',
    options: [
      'A) Because every single INSERT, DELETE, or indexed-column UPDATE must not only write the table row, but also traverse, update, and potentially split/rebalance leaf blocks across all 12 separate B+ Tree structures on disk (Write Amplification)!',
      'B) Because tables with more than 5 indexes disable the buffer pool.',
      'C) Because B+ Trees lock the entire database during SELECT queries.',
      'D) Secondary indexes only slow down DELETE, never INSERT.'
    ],
    correctAnswer: 'A',
    explanation: 'Every secondary B+ Tree index is a separate physical data structure on disk. When a new row is inserted into a table with 12 indexes, the storage engine must insert 12 new entries into 12 different B+ Trees, dirtying up to 12 random disk pages, writing WAL log records for all of them, and triggering node splits.'
  },
  {
    id: 'dbms-test-q47',
    questionNumber: 47,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q47: [Master-Slave Replication Lag — Read-Your-Own-Writes] To scale read traffic, an architecture sends all WRITE queries (INSERT/UPDATE) to the Primary (Master) DB and routes all READ queries (SELECT) to 3 Asynchronous Read Replicas. A user updates their shipping address and immediately gets redirected to the Checkout page, which still shows their OLD address for 2 seconds! Why did this happen and how do you fix it?',
    question: 'All writes go to the Primary DB and all reads go to Asynchronous Read Replicas. A user updates their address and is immediately redirected to a page that reads from a Read Replica—showing their OLD address! What caused this and how is it solved?',
    options: [
      'A) The Primary DB rolled back the transaction.',
      'B) Asynchronous Replication Lag: the Read Replica had not yet applied the WAL stream from the Primary DB when the redirect GET arrived. Fix it using "Read-Your-Own-Writes" routing (routing a user\'s reads to the Primary DB for a short window after they perform a write, or tracking WAL LSN positions).',
      'C) B+ Tree corruption on the replica.',
      'D) Missing Foreign Key constraint.'
    ],
    correctAnswer: 'B',
    explanation: 'In Asynchronous Master-Replica replication, the Primary DB commits and responds to the client immediately while shipping WAL logs to Read Replicas asynchronously (which may lag by 50ms–2000ms). If the user\'s next GET request hits a lagging replica, they see stale state. Routing the mutating user\'s own reads to the Primary DB for a brief window (e.g., 5 seconds via session/cookie timestamp or LSN check) guarantees Read-Your-Own-Writes consistency.'
  },
  {
    id: 'dbms-test-q48',
    questionNumber: 48,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q48: [Deep Offset Pagination Bottleneck vs. Keyset Pagination] On a table with 20,000,000 posts, Page 1 (SELECT * FROM posts ORDER BY id DESC LIMIT 20 OFFSET 0) takes 1ms, but Page 50,000 (LIMIT 20 OFFSET 1000000) takes 3.2 seconds! Why is large OFFSET slow, and how does Cursor/Keyset Pagination fix it?',
    question: 'On a 20M-row table, LIMIT 20 OFFSET 0 takes 1ms, but LIMIT 20 OFFSET 1000000 takes 3.2 seconds! Why does OFFSET degrade linearly O(N), and how does Keyset (Cursor) Pagination solve it?',
    options: [
      'A) With OFFSET 1000000, the database must still scan, fetch, and count through 1,000,020 rows before discarding the first 1,000,000! Keyset Pagination replaces OFFSET with a B+ Tree range seek (WHERE id < :last_seen_id ORDER BY id DESC LIMIT 20), jumping directly to the exact starting row in O(log N) time!',
      'B) OFFSET disables all indexes when the number exceeds 1,000.',
      'C) Keyset Pagination loads all 20M rows into Node.js RAM.',
      'D) Using OFFSET with ASC instead of DESC makes it O(1).'
    ],
    correctAnswer: 'A',
    explanation: 'B+ Trees do not store absolute row offsets inside nodes (because every insert/delete would require updating offsets across the entire tree). Thus, OFFSET 1,000,000 forces the engine to walk through 1,000,000 records and throw them away. Keyset/Cursor Pagination passes the last seen indexed value from the previous page (WHERE id < 849201 ORDER BY id DESC LIMIT 20), allowing the B+ Tree to seek directly to id 849201 in O(log N) time regardless of how deep the user scrolls!'
  },
  {
    id: 'dbms-test-q49',
    questionNumber: 49,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Hard',
    title: 'Q49: [Database Sharding — Hot Partition Anti-Pattern] A large analytics platform horizontally shards its events table across 16 database servers using range-based sharding on the created_date column (each month mapped to a shard). Despite having 16 servers, 15 servers sit at 2% CPU while 1 server is overloaded at 100% CPU! Why?',
    question: 'An analytics platform shards its events table across 16 database servers by created_date (month). 15 shards sit idle at 2% CPU while 1 shard is overwhelmed at 100% CPU! What caused this "Hot Shard" bottleneck and how do you fix the shard key?',
    options: [
      'A) Because monotonically increasing timestamp/date shard keys route 100% of current real-time writes and recent dashboard reads to the single shard holding the current month! Fix it by sharding on a high-cardinality hash key (e.g., hash(tenant_id) or hash(user_id)) to distribute writes uniformly across all 16 shards.',
      'B) Because 16 is not a prime number.',
      'C) Because range sharding only works on string columns.',
      'D) Because B+ Trees cannot be used on sharded tables.'
    ],
    correctAnswer: 'A',
    explanation: 'Using a monotonically increasing key (like created_date or an auto-incrementing ID) for range-based sharding directs every single new INSERT and most recent SELECT queries to the latest range shard (the "Hot Shard"), leaving historical shards idle. Choosing a high-cardinality hash-based or composite shard key (like tenant_id or user_id) spreads concurrent writes evenly across all shards.'
  },
  {
    id: 'dbms-test-q50',
    questionNumber: 50,
    type: 'mcq',
    category: 'Real-World Engineering Scenario',
    difficulty: 'Moderate',
    title: 'Q50: [Denormalization Trade-Off in High-Read Systems] On an e-commerce platform, product pages are viewed 10,000 times per second, while new product reviews are posted 2 times per minute. Computing AVG(rating) and COUNT(*) from a 50M-row reviews table on every page view overloads the DB. The team adds avg_rating and review_count columns directly onto the products table. What is this technique called and what is its trade-off?',
    question: 'To avoid running AVG(rating) and COUNT(*) across a 50M-row reviews table on every product page view, the engineering team stores avg_rating and review_count directly on the products table. What is this technique called and what is the trade-off?',
    options: [
      'A) It is called 4NF Normalization; it slows down reads and speeds up writes.',
      'B) It is Controlled Denormalization (Materializing Aggregates): it introduces controlled redundancy to make read queries O(1) without joins/aggregations, at the cost of requiring transactional updates (or triggers/events) to keep products.avg_rating in sync whenever a review is inserted, updated, or deleted.',
      'C) It is called Lossy Decomposition; it deletes the reviews table.',
      'D) It violates 1NF and prevents indexing.'
    ],
    correctAnswer: 'B',
    explanation: 'While strict 3NF/BCNF normalization forbids storing derived/redundant aggregates, in read-heavy production systems (10,000 reads/sec vs. 2 writes/min), Controlled Denormalization trades a slightly more complex write path (updating the cached count/average inside the same transaction when a review is added) for massive read performance gains.'
  }
];

async function seedCoreCsDbms() {
  const client = await pool.connect();
  try {
    console.log('--- Starting Seeding for Core Computer Science: DBMS ---');
    await client.query('BEGIN');

    // 1. Locate Core Computer Science Track
    const trackRes = await client.query(`
      SELECT t.id, t.name, t.slug 
      FROM tracks t
      WHERE t.id = (
        SELECT track_id FROM topics WHERE slug = 'cs-oop-complete-oneshot-mastery' LIMIT 1
      )
      OR t.id = 22
      OR t.slug = 'core-computer-science-fundamentals'
      OR t.slug = 'core-computer-science'
      LIMIT 1;
    `);

    if (trackRes.rows.length === 0) {
      throw new Error('Core Computer Science track could not be found!');
    }

    const csTrackId = trackRes.rows[0].id;
    console.log(`Found Core Computer Science track: [ID:${csTrackId}] "${trackRes.rows[0].name}" (slug: ${trackRes.rows[0].slug})`);

    // 2. Upsert Subject 2: Database Management Systems (Complete DBMS in 1 Shot)
    const topicSlug = 'cs-dbms-complete-oneshot-mastery';
    const topicTitle = 'DBMS: Complete Database Management Systems in 1 Shot (Placement & GATE Edition)';
    const topicOrder = 2;
    const durationMinutes = 702;
    const videoUrl = 'http://www.youtube.com/watch?v=dl00fOOYLOM';
    const videoTitle = 'Complete DBMS in 1 Video (With Notes) || For Placement Interviews';
    const creatorName = 'CodeHelp - by Babbar';
    const creatorChannelUrl = 'https://www.youtube.com/@CodeHelp';

    const docLinks = [
      {
        title: 'PostgreSQL Official Documentation — Concurrency Control, MVCC & Indexing Reference',
        url: 'https://www.postgresql.org/docs/current/mvcc.html',
        link: 'https://www.postgresql.org/docs/current/mvcc.html'
      }
    ];

    const shortDescription = 'Master Database Management Systems from scratch to advanced system design—3-Schema Architecture, ER Modeling, Relational Algebra, Functional Dependencies, Normalization (1NF to BCNF/4NF), SQL, ACID Transactions, Concurrency Control (2PL, Timestamp Ordering), B/B+ Tree Indexing, Crash Recovery (WAL), and Sharding—followed by a 50-question timed evaluation test.';
    const cleanSummary = cleanMarkdown(summaryMarkdown);

    const docLinksJson = JSON.stringify(docLinks);
    const videoLinksJson = JSON.stringify([
      {
        title: videoTitle,
        url: videoUrl,
        duration: `${durationMinutes}m`,
        creator_name: creatorName,
        creator_channel_url: creatorChannelUrl
      }
    ]);
    const practiceJson = JSON.stringify(dbmsEvaluationTest);

    // Check if topic already exists by slug
    const existingTopic = await client.query('SELECT id FROM topics WHERE slug = $1 LIMIT 1;', [topicSlug]);
    let topicId;

    if (existingTopic.rows.length > 0) {
      topicId = existingTopic.rows[0].id;
      await client.query(`
        UPDATE topics SET
          name = $1,
          title = $1,
          topic_order = $2,
          short_description = $3,
          description = $3,
          summary_markdown = $4,
          theory_summary = $4,
          official_docs_url = $5,
          practice_items = $6::jsonb,
          practice_problems = $6::jsonb,
          doc_links = $7::jsonb,
          video_links = $8::jsonb,
          creator_name = $9,
          creator_channel_url = $10,
          track_id = $11
        WHERE id = $12;
      `, [
        topicTitle,
        topicOrder,
        shortDescription,
        cleanSummary,
        docLinks[0].url,
        practiceJson,
        docLinksJson,
        videoLinksJson,
        creatorName,
        creatorChannelUrl,
        csTrackId,
        topicId
      ]);
      console.log(`Updated existing topic ID ${topicId} (${topicSlug})`);
    } else {
      const insertRes = await client.query(`
        INSERT INTO topics (
          name, title, slug, topic_order, short_description, description,
          summary_markdown, theory_summary, official_docs_url,
          practice_items, practice_problems, doc_links, video_links,
          creator_name, creator_channel_url, track_id
        ) VALUES (
          $1, $1, $2, $3, $4, $4,
          $5, $5, $6,
          $7::jsonb, $7::jsonb, $8::jsonb, $9::jsonb,
          $10, $11, $12
        ) RETURNING id;
      `, [
        topicTitle,
        topicSlug,
        topicOrder,
        shortDescription,
        cleanSummary,
        docLinks[0].url,
        practiceJson,
        docLinksJson,
        videoLinksJson,
        creatorName,
        creatorChannelUrl,
        csTrackId
      ]);
      topicId = insertRes.rows[0].id;
      console.log(`Inserted new topic ID ${topicId} (${topicSlug})`);
    }

    // Map in track_topics
    await client.query(`
      DELETE FROM track_topics WHERE track_id = $1 AND topic_order = $2;
    `, [csTrackId, topicOrder]);

    await client.query(`
      INSERT INTO track_topics (track_id, topic_id, topic_order)
      VALUES ($1, $2, $3)
      ON CONFLICT (track_id, topic_id) DO UPDATE SET topic_order = EXCLUDED.topic_order;
    `, [csTrackId, topicId, topicOrder]);

    // Sync resources table for video and documentation
    await client.query(`
      DELETE FROM resources WHERE topic_id = $1 AND resource_type IN ('problem', 'practice', 'video', 'documentation');
    `, [topicId]);

    await client.query(`
      INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
      VALUES ($1, $2, $3, 'video', $4);
    `, [topicId, videoTitle, videoUrl, durationMinutes]);

    for (const doc of docLinks) {
      await client.query(`
        INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
        VALUES ($1, $2, $3, 'documentation', 15);
      `, [topicId, doc.title, doc.url]);
    }

    await client.query('COMMIT');
    console.log('✅ Core Computer Science: DBMS One-Shot & 50-Question Timed Evaluation Test Seeded Successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding Core CS DBMS failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedCoreCsDbms();
