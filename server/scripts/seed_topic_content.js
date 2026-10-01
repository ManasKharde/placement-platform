const pool = require("../config/db");

const seedTopicContent = async () => {
  console.log("🚀 Starting Topic Detail Schema Migration & Content Seeding...");

  // 1. Add columns to topics table if not exists
  await pool.query(`
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS theory_summary TEXT;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS doc_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS video_links JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE topics ADD COLUMN IF NOT EXISTS practice_items JSONB DEFAULT '[]'::jsonb;
  `);
  console.log("✅ Verified schema columns: theory_summary, doc_links, video_links, practice_items");

  // 2. Define rich, authentic content tailored for Node.js & Placement Topics
  const topicContents = {
    // ----------------------------------------------------
    // Express Middleware Pipeline
    // ----------------------------------------------------
    "middleware-pipeline-lifecycle": {
      theory_summary: `### 🎯 Core Concepts & Architecture Breakdown
Express.js is fundamentally a routing and middleware web framework. At its core, an Express application is an onion-like stack of middleware functions executed in sequential order.

- **Request Lifecycle**: An incoming HTTP request triggers the middleware stack. Each middleware receives \`(req, res, next)\`.
- **The Role of \`next()\`**: Calling \`next()\` passes control to the subsequent middleware function in the chain. If \`next()\` is never invoked and no response is returned, the client connection hangs indefinitely.
- **Error Middleware**: Middleware with 4 parameters \`(err, req, res, next)\` is identified by Express as dedicated error-handling middleware. Calling \`next(err)\` skips all non-error middlewares directly to this handler.

### ⚡ How It Works Under The Hood
\`\`\`javascript
app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(\`[\${req.method}] \${req.url}\`);
  next(); // Pass control to next layer
});
\`\`\`

### 💡 Placement & Interview Key Takeaways
1. **Middleware Ordering Matters**: Place authentication, body parsers (\`express.json()\`), and logging before route handlers. Place 404 and global error handlers at the very bottom.
2. **Difference between App-level vs Router-level**: App-level middleware binds to the \`app\` instance using \`app.use()\`. Router-level binds to an instance of \`express.Router()\`.
3. **Third-Party Middleware**: Common production middleware includes \`helmet\` (security headers), \`cors\` (cross-origin resource sharing), \`morgan\` (HTTP request logger), and \`compression\` (Gzip/Brotli).

### ⚠️ Common Traps & Production Gotchas
- Sending headers twice: Invoking \`res.json()\` and subsequently calling \`next()\` or another \`res.send()\` triggers the dreaded \`ERR_HTTP_HEADERS_SENT\`. Always \`return res.status(...).json(...)\` when terminating a handler.`,
      doc_links: [
        { title: "Express.js Official Guide: Using Middleware", url: "https://expressjs.com/en/guide/using-middleware.html" },
        { title: "Writing Custom Express Middleware Functions", url: "https://expressjs.com/en/guide/writing-middleware.html" },
        { title: "Express Router & Sub-Applications Guide", url: "https://expressjs.com/en/guide/routing.html" }
      ],
      video_links: [
        { title: "Express.js Middleware Explained in 10 Minutes", url: "https://www.youtube.com/watch?v=lY6icfhap2o", duration: "12m" },
        { title: "Deep Dive into Node & Express Request Lifecycle", url: "https://www.youtube.com/watch?v=nS8Bq2XwG_o", duration: "24m" }
      ],
      practice_items: [
        {
          type: "assignment",
          title: "Build a Production Request Context & Latency Tracking Middleware",
          description: "Implement a custom Express middleware that generates a unique UUID (x-request-id) for every incoming request, attaches it to the request object, records request start time, and upon response finish logs the duration in milliseconds with status code and method.",
          starterCodeUrl: "https://github.com/expressjs/express/tree/master/examples",
          checklist: [
            "Intercept incoming request and assign req.id = crypto.randomUUID()",
            "Set response header 'X-Request-Id'",
            "Listen to res.on('finish', ...) to calculate elapsed time",
            "Prevent memory leaks by properly releasing event listeners"
          ]
        },
        {
          type: "quiz",
          title: "Interview Output Question: Middleware Execution Sequence",
          description: "Analyze how multiple middleware functions with next() and async/await execute, and predict the exact console output order.",
          starterCodeUrl: "",
          checklist: [
            "Explain synchronous vs asynchronous next() execution",
            "Explain what happens if next(new Error('Auth failed')) is called"
          ]
        }
      ]
    },

    // ----------------------------------------------------
    // JWT Authentication & Cookies
    // ----------------------------------------------------
    "jwt-authentication-cookies": {
      theory_summary: `### 🎯 Core Concepts & Architecture Breakdown
JSON Web Token (JWT) is an open industry standard (RFC 7519) for securely transmitting information between parties as a verifiable JSON object.

- **Structure of a JWT**: Consists of three parts separated by dots: \`Header.Payload.Signature\`.
  - **Header**: Algorithm and token type (e.g., \`{ "alg": "HS256", "typ": "JWT" }\`).
  - **Payload**: Claims including subject \`sub\`, expiration \`exp\`, and non-sensitive user metadata.
  - **Signature**: Hash of header + payload signed with server secret key: \`HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)\`.

### ⚡ Dual-Token Architecture (Access + Refresh Tokens)
1. **Short-lived Access Token** (10-15 mins): Included in HTTP-Only Cookie or Authorization Bearer header.
2. **Long-lived Refresh Token** (7-30 days): Stored securely in a database with revocation tracking, sent via strict HTTP-Only cookie.

### 💡 Placement & Interview Key Takeaways
1. **Never Store Sensitive Data in Payload**: The payload is merely Base64Url-encoded, NOT encrypted! Anyone can decode and inspect it via \`jwt.io\`.
2. **LocalStorage vs HTTP-Only Cookies**: Storing tokens in \`localStorage\` makes your app vulnerable to XSS (Cross-Site Scripting). HTTP-Only, Secure, SameSite cookies cannot be accessed via JavaScript \`document.cookie\`.
3. **CSRF Mitigation**: Use \`SameSite=Lax\` or \`SameSite=Strict\` cookies combined with anti-CSRF tokens for mutating actions.

### ⚠️ Common Traps & Production Gotchas
- Accepting the \`none\` algorithm: Malicious clients can alter the token header to \`"alg": "none"\`. Always enforce explicit algorithm verification in \`jwt.verify(token, secret, { algorithms: ['HS256'] })\`.`,
      doc_links: [
        { title: "JWT.io Introduction and Token Debugger", url: "https://jwt.io/introduction" },
        { title: "OWASP JSON Web Token Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" },
        { title: "MDN Guide on HTTP-Only & Secure Cookies", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" }
      ],
      video_links: [
        { title: "JWT Authentication Full Flow in Node.js", url: "https://www.youtube.com/watch?v=mbsmsi7l3r4", duration: "18m" },
        { title: "Why Storing Tokens in LocalStorage is Dangerous", url: "https://www.youtube.com/watch?v=67mezK3Nzp8", duration: "14m" }
      ],
      practice_items: [
        {
          type: "assignment",
          title: "Implement Silent Token Refresh with HTTP-Only Cookies",
          description: "Write an Express authentication route '/api/auth/refresh' that extracts the refresh token from an HTTP-Only cookie, verifies it against the database, checks for token reuse (revocation), and issues a fresh 15-minute access token.",
          starterCodeUrl: "https://github.com/auth0/node-jsonwebtoken",
          checklist: [
            "Validate presence of req.cookies.refreshToken",
            "Verify token signature and expiration with jsonwebtoken",
            "Ensure token is present and unrevoked in users table",
            "Issue new access token cookie and update last_active timestamp"
          ]
        },
        {
          type: "quiz",
          title: "System Design Interview: Token Invalidation at Scale",
          description: "How do you immediately invalidate an active JWT if a user logs out or changes their password before the 15-minute expiration?",
          starterCodeUrl: "",
          checklist: [
            "Explain Redis token blocklist with TTL matching remaining token lifespan",
            "Explain token versioning (token_version integer column in users table)"
          ]
        }
      ]
    },

    // ----------------------------------------------------
    // Relational Schema Design & Normalization
    // ----------------------------------------------------
    "schema-design-normalization": {
      theory_summary: `### 🎯 Core Concepts & Architecture Breakdown
Relational Database Management Systems (RDBMS) model data into tables (relations) with strict schemas, foreign keys, and referential integrity constraints.

- **Entity-Relationship Modeling**: Identifying entities, attributes, and relationships:
  - **1:1 (One-to-One)**: User and User Profile (often combined or separated for privacy/performance).
  - **1:N (One-to-Many)**: User and Orders (foreign key \`user_id\` placed on the 'many' table).
  - **N:M (Many-to-Many)**: Students and Courses (requires a junction/pivot table \`student_courses\`).

### ⚡ Normalization Forms (1NF, 2NF, 3NF, BCNF)
1. **1NF (First Normal Form)**: Each column contains atomic (indivisible) values. No repeating groups or comma-separated lists.
2. **2NF (Second Normal Form)**: Meets 1NF, and all non-key attributes are fully functionally dependent on the entire primary key (eliminates partial dependency in composite keys).
3. **3NF (Third Normal Form)**: Meets 2NF, and no non-key attribute is transitively dependent on the primary key (no \`A -> B -> C\`).

### 💡 Placement & Interview Key Takeaways
1. **3NF vs Denormalization Tradeoff**: Highly normalized schemas eliminate data anomalies and save storage, but require multi-table JOINs. Read-heavy analytics systems frequently denormalize data to optimize query performance.
2. **Foreign Key Constraints**: Understand \`ON DELETE CASCADE\`, \`ON DELETE SET NULL\`, and \`ON DELETE RESTRICT\`.
3. **Surrogate Keys vs Natural Keys**: Surrogate keys (auto-incrementing integers or UUIDs) decouple domain logic from row identity.

### ⚠️ Common Traps & Production Gotchas
- Storing JSON or arrays instead of properly normalized child tables for relational queries: Avoid anti-pattern of storing \`tag1,tag2,tag3\` in text columns.`,
      doc_links: [
        { title: "PostgreSQL DDL & Schema Architecture", url: "https://www.postgresql.org/docs/current/ddl.html" },
        { title: "Database Normalization Principles: 1NF to 3NF", url: "https://en.wikipedia.org/wiki/Database_normalization" },
        { title: "PostgreSQL Constraints & Foreign Keys", url: "https://www.postgresql.org/docs/current/ddl-constraints.html" }
      ],
      video_links: [
        { title: "Database Normalization Explained in Simple Terms", url: "https://www.youtube.com/watch?v=UrYLYV7WSHM", duration: "16m" },
        { title: "PostgreSQL Schema Design Best Practices", url: "https://www.youtube.com/watch?v=remG3xZ4g0U", duration: "32m" }
      ],
      practice_items: [
        {
          type: "assignment",
          title: "Design an E-Commerce Placement Schema in 3NF",
          description: "Write DDL SQL statements creating tables for Users, Categories, Products, Orders, and OrderItems. Enforce primary keys, unique constraints, foreign keys with ON DELETE CASCADE where appropriate, and check constraints (e.g. price > 0).",
          starterCodeUrl: "https://www.postgresql.org/docs/current/tutorial-sql.html",
          checklist: [
            "Create products table with DECIMAL(10,2) price and positive CHECK constraint",
            "Create orders table with status enum ('pending', 'paid', 'shipped')",
            "Create order_items junction table capturing price_at_purchase to preserve historical integrity",
            "Add composite index on (order_id, product_id)"
          ]
        },
        {
          type: "quiz",
          title: "SQL Practice Challenge: Detect Anomalies in Un-normalized Schema",
          description: "Given a flat table containing Student, College, CollegeAddress, and HODName, identify update, insertion, and deletion anomalies, and normalize to 3NF.",
          starterCodeUrl: "",
          checklist: [
            "Decompose into Students and Colleges tables",
            "Establish foreign key relationship student.college_id -> college.id"
          ]
        }
      ]
    },

    // ----------------------------------------------------
    // Event Loop, Libuv & Asynchronous Concurrency
    // ----------------------------------------------------
    "event-loop-libuv-concurrency": {
      theory_summary: `### 🎯 Core Concepts & Architecture Breakdown
Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Although JavaScript is single-threaded in the V8 engine, Node.js achieves high concurrency via the **Libuv** C library.

- **The Libuv Thread Pool**: By default, Libuv maintains a thread pool of 4 worker threads (\`UV_THREADPOOL_SIZE=4\`) used for heavy operations like file system I/O, DNS lookups, compression (zlib), and cryptographic operations (crypto).
- **Phases of the Event Loop**:
  1. **Timers**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
  2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
  3. **Idle, Prepare**: Used internally by Node.
  4. **Poll**: Retrieves new I/O events; executes I/O-related callbacks.
  5. **Check**: Executes \`setImmediate()\` callbacks.
  6. **Close Callbacks**: Handles close events (e.g. \`socket.on('close', ...)\`).

### ⚡ Microtasks: process.nextTick vs Promise.then
- **\`process.nextTick()\` Queue**: Has the highest priority. Executes immediately after the currently running operation, before any other phase.
- **Promise Microtask Queue**: Runs immediately after \`process.nextTick()\`, before the event loop advances to the next phase.

### 💡 Placement & Interview Key Takeaways
1. **Never Block the Event Loop**: Heavy CPU-bound computations (like calculating primes or complex image processing) in the main thread freeze all incoming client requests. Offload CPU-bound tasks to Worker Threads (\`worker_threads\`) or a microservice.
2. **Difference between \`setImmediate()\` and \`setTimeout(fn, 0)\`**: \`setImmediate\` is designed to execute a script once the current poll phase completes. \`setTimeout(fn, 0)\` executes after a minimum threshold (typically 1ms) in the timers phase.`,
      doc_links: [
        { title: "Node.js Official Event Loop Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" },
        { title: "Libuv Design & Architecture Documentation", url: "https://docs.libuv.org/en/v1.x/design.html" },
        { title: "Don't Block the Event Loop (Node.js Docs)", url: "https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" }
      ],
      video_links: [
        { title: "What the heck is the event loop anyway? - Philip Roberts", url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ", duration: "26m" },
        { title: "Node.js Event Loop and Libuv Thread Pool Explained", url: "https://www.youtube.com/watch?v=PNa9OM6494M", duration: "19m" }
      ],
      practice_items: [
        {
          type: "quiz",
          title: "Predict Event Loop Execution Order Output",
          description: "Determine the exact console output order for a snippet mixing console.log, setTimeout(0), setImmediate, Promise.resolve().then, and process.nextTick.",
          starterCodeUrl: "",
          checklist: [
            "Identify synchronous code executed first",
            "Evaluate process.nextTick queue",
            "Evaluate Promise microtask queue",
            "Trace timers vs check phase execution"
          ]
        },
        {
          type: "assignment",
          title: "Benchmark CPU Starvation vs Worker Threads",
          description: "Create an Express endpoint that performs heavy PBKDF2 hashing synchronously vs asynchronously vs inside a Worker Thread, and measure latency degradation with an Apache Bench / Autocannon load test.",
          starterCodeUrl: "https://nodejs.org/api/worker_threads.html",
          checklist: [
            "Simulate 100 concurrent requests while heavy task runs",
            "Demonstrate event loop recovery using worker_threads"
          ]
        }
      ]
    },

    // ----------------------------------------------------
    // Advanced SQL & Query Optimization
    // ----------------------------------------------------
    "sql-query-optimization": {
      theory_summary: `### 🎯 Core Concepts & Architecture Breakdown
In production backend engineering, slow database queries are the primary cause of latency bottlenecks. Writing optimized queries and indexing properly is essential.

- **EXPLAIN and EXPLAIN ANALYZE**:
  - \`EXPLAIN\` shows the query execution plan generated by the database planner based on table statistics.
  - \`EXPLAIN ANALYZE\` actually executes the query and reports real runtime elapsed time and node execution counts.
- **Index Types in PostgreSQL**:
  - **B-Tree**: The default index. Ideal for equality (\`=\`) and range queries (\`<\`, \`<=\`, \`>\`, \`BETWEEN\`).
  - **Hash Index**: Fast for equality comparisons only.
  - **GIN (Generalized Inverted Index)**: Essential for searching inside JSONB, arrays, and full-text search.
  - **GiST**: Spatial and geometric data.

### ⚡ Query Plan Nodes to Watch Out For
1. **Seq Scan (Sequential Scan)**: The database scans every single row in the table. Unacceptable on large tables for point queries.
2. **Index Scan vs Index Only Scan**: Index Scan reads index then visits heap pages for remaining columns. Index Only Scan fetches all requested columns directly from the index (covered query).
3. **Hash Join vs Nested Loop**: Nested loop is optimal when one dataset is very small and indexed; Hash join is optimal for joining larger tables.

### 💡 Placement & Interview Key Takeaways
1. **Composite Indexes & The Leftmost Prefix Rule**: An index on \`(last_name, first_name)\` can accelerate queries searching by \`last_name\` or \`last_name AND first_name\`, but CANNOT be used efficiently for queries searching only by \`first_name\`.
2. **Index Selectivity**: An index is most useful on columns with high cardinality (many distinct values, e.g. emails, usernames). Indexing boolean flags is usually ignored by the query planner unless combined with a partial index.`,
      doc_links: [
        { title: "PostgreSQL Official: Using EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html" },
        { title: "PostgreSQL Indexes: Types & Strategies", url: "https://www.postgresql.org/docs/current/indexes-types.html" },
        { title: "Use The Index, Luke! - A Guide to Database Performance", url: "https://use-the-index-luke.com/" }
      ],
      video_links: [
        { title: "PostgreSQL EXPLAIN ANALYZE Deep Dive - Hussein Nasser", url: "https://www.youtube.com/watch?v=mD0B4s_X2W0", duration: "25m" },
        { title: "Database Indexing Explained Visually", url: "https://www.youtube.com/watch?v=-qNSXK7s7_w", duration: "15m" }
      ],
      practice_items: [
        {
          type: "assignment",
          title: "Optimize a Slow 500,000 Row Query with Composite & Partial Indexes",
          description: "Generate mock data of 500,000 orders. Run an EXPLAIN ANALYZE query filtering by status='completed' and order_date >= NOW() - INTERVAL '30 days'. Create a partial index to reduce execution time from 150ms to under 2ms.",
          starterCodeUrl: "https://www.postgresql.org/docs/current/indexes-partial.html",
          checklist: [
            "Inspect query cost before index creation",
            "Create partial index CREATE INDEX idx_orders_active ON orders (order_date) WHERE status = 'completed'",
            "Confirm Index Scan replaces Seq Scan in EXPLAIN ANALYZE output"
          ]
        },
        {
          type: "quiz",
          title: "SQL Placement Challenge: Window Functions (DENSE_RANK)",
          description: "Write a clean SQL query to find the Nth highest salary in each department using DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC).",
          starterCodeUrl: "",
          checklist: [
            "Use CTE (WITH ranked_salaries AS ...)",
            "Filter WHERE rank_num = 2 to extract second highest"
          ]
        }
      ]
    },

    // ----------------------------------------------------
    // Redis In-Memory Caching
    // ----------------------------------------------------
    "redis-caching-invalidation": {
      theory_summary: `### 🎯 Core Concepts & Architecture Breakdown
Redis (Remote Dictionary Server) is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine.

- **Why Redis is Blazing Fast**: Operations execute in memory (RAM) with sub-millisecond response times. Single-threaded event loop eliminates locking and thread context switching overhead for command execution.
- **Cache-Aside Pattern (Lazy Loading)**:
  1. Application checks Redis for the key.
  2. If found (Cache Hit), return cached data immediately.
  3. If not found (Cache Miss), query database, write result into Redis with a TTL (Time To Live), and return data.
- **Write-Through vs Write-Back**:
  - Write-Through: Data is written to cache and DB simultaneously.
  - Write-Back: Data written to cache first; DB updated asynchronously in batches.

### 💡 Placement & Interview Key Takeaways
1. **Cache Invalidation & TTL**: "There are only two hard things in Computer Science: cache invalidation and naming things." Always configure a TTL to avoid stale data zombies.
2. **Eviction Policies**: Understand \`allkeys-lru\` (Least Recently Used), \`volatile-lru\`, and \`allkeys-lfu\` (Least Frequently Used).
3. **Cache Penetration vs Cache Avalanche vs Cache Stampede**:
   - *Penetration*: Querying non-existent keys repeatedly hits DB (solve with Bloom filter or caching null with short TTL).
   - *Avalanche*: Many keys expire at the exact same second, flooding DB (solve with jitter/randomized TTL).
   - *Stampede*: A popular key expires and 10,000 concurrent requests simultaneously query DB (solve with mutex locking).`,
      doc_links: [
        { title: "Redis Official Documentation", url: "https://redis.io/docs/latest/" },
        { title: "AWS Architecture: Caching Strategies & Best Practices", url: "https://aws.amazon.com/caching/best-practices/" },
        { title: "Node Redis (node-redis) Official Client Guide", url: "https://github.com/redis/node-redis" }
      ],
      video_links: [
        { title: "Redis in 100 Seconds - Fireship", url: "https://www.youtube.com/watch?v=G1rOthIU-uo", duration: "3m" },
        { title: "How Caching Works & Cache Invalidation Strategies", url: "https://www.youtube.com/watch?v=U3RkDLtS7uY", duration: "18m" }
      ],
      practice_items: [
        {
          type: "assignment",
          title: "Implement Cache-Aside Middleware with Redis & TTL Jitter",
          description: "Build an Express cache wrapper utility \`cacheMiddleware(keyPrefix, ttlSeconds)\` that checks Redis before route execution. Apply randomized TTL jitter (e.g. ttl ± 10%) to prevent cache avalanche.",
          starterCodeUrl: "https://github.com/redis/node-redis",
          checklist: [
            "Connect using createClient() with error handling",
            "Store JSON stringified responses with EX ttl",
            "Invalidate cache key upon POST/PUT/DELETE mutations"
          ]
        },
        {
          type: "quiz",
          title: "System Design Question: Cache Stampede Mitigation",
          description: "Explain how to implement distributed mutex locking (Redlock) or probabilistic early expiration (XFetch algorithm) to prevent cache stampedes.",
          starterCodeUrl: "",
          checklist: [
            "Explain SET key value NX EX lock acquisition",
            "Explain releasing lock with Lua script verifying token ownership"
          ]
        }
      ]
    }
  };

  // 3. Fallback generator for other topics based on keywords
  const generateFallbackContent = (topicName, topicSlug, trackName) => {
    const isDSA = /dsa|algo|array|tree|graph|pointer|search|dp|sort/i.test(topicSlug + " " + topicName);
    const isSQL = /sql|database|postgres|query|schema|index|transaction/i.test(topicSlug + " " + topicName);
    const isCS = /os|network|concurrency|process|memory|protocol|architecture/i.test(topicSlug + " " + topicName);

    if (isDSA) {
      return {
        theory_summary: `### 🎯 Algorithmic Pattern Breakdown: ${topicName}
Mastering this module is critical for technical coding rounds and LeetCode algorithmic interviews.

- **Core Problem-Solving Pattern**: Break down problem constraints, identify edge cases (empty inputs, negative values, integer overflow), and establish time/space complexity bounds.
- **Optimal Complexity Target**: Aim for O(N) or O(N log N) time complexity with O(1) or O(N) auxiliary space.
- **Interview Walkthrough Strategy**:
  1. Clarify inputs, outputs, and constraints before coding.
  2. State brute force approach and explain why it is sub-optimal.
  3. Walk the interviewer through the optimized algorithm with a small test case.
  4. Write clean, modular code with descriptive variable names.`,
        doc_links: [
          { title: "NeetCode Algorithmic Roadmap", url: "https://neetcode.io/roadmap" },
          { title: "LeetCode Problem Set", url: "https://leetcode.com/problemset/all/" }
        ],
        video_links: [
          { title: `Mastering ${topicName} - Core Patterns`, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(topicName + " dsa pattern"), duration: "22m" }
        ],
        practice_items: [
          {
            type: "dsa",
            title: `Solve 2 Curated Problems for ${topicName}`,
            description: "Practice key problem patterns on LeetCode with optimal time and space complexity.",
            starterCodeUrl: "https://leetcode.com",
            checklist: [
              "Solve Easy warm-up problem without looking at editorial",
              "Solve Medium interview classic handling boundary edge cases"
            ]
          }
        ]
      };
    }

    if (isCS) {
      return {
        theory_summary: `### 🎯 Computer Science Fundamentals: ${topicName}
Core systems concepts frequently tested in technical screening rounds and engineering interviews.

- **System Architecture**: How modern operating systems, networks, and processors coordinate resources.
- **Key Concepts to Master**: Concurrency primitives, resource isolation, latency vs throughput tradeoffs, and fault tolerance.
- **Interview Key Takeaways**:
  - Be prepared to draw diagrams explaining data flow and component lifecycles.
  - Explain practical real-world applications (e.g. why databases use WAL, why HTTP/2 uses multiplexing).`,
        doc_links: [
          { title: "OS Three Easy Pieces Guide", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
          { title: "GeeksforGeeks CS Fundamentals", url: "https://www.geeksforgeeks.org/operating-systems/" }
        ],
        video_links: [
          { title: `${topicName} - Core Systems Architecture`, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(topicName + " computer science"), duration: "25m" }
        ],
        practice_items: [
          {
            type: "cs",
            title: "Top 5 Technical Screening Interview Questions",
            description: `Review and self-evaluate on the 5 most common technical interview questions for ${topicName}.`,
            starterCodeUrl: "",
            checklist: [
              "Define core terminology and real-world engineering analogy",
              "Explain failure scenarios and how production systems mitigate them"
            ]
          }
        ]
      };
    }

    // Default Development / Engineering content
    return {
      theory_summary: `### 🎯 Engineering Guide: ${topicName}
Part of the **${trackName || "Software Engineering"}** curriculum designed for modern software development.

- **Core Concepts**: Architectural patterns, modular design principles, and production best practices.
- **Hands-on Objective**: Understand the lifecycle, error boundaries, and integration points with the rest of the application stack.
- **Production Checklist**:
  - Clean separation of concerns (controller, service, repository layers).
  - Robust error handling and structured logging.
  - Unit and integration testing considerations.`,
      doc_links: [
        { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        { title: "Official Documentation & API Reference", url: "https://devdocs.io/" }
      ],
      video_links: [
        { title: `${topicName} Full Guide`, url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(topicName + " tutorial"), duration: "18m" }
      ],
      practice_items: [
        {
          type: "assignment",
          title: `Build & Test a Working Implementation of ${topicName}`,
          description: `Implement a production-grade module demonstrating the core principles of ${topicName}.`,
          starterCodeUrl: "",
          checklist: [
            "Implement core logic with validation and boundary checks",
            "Write tests verifying expected output and edge cases"
          ]
        }
      ]
    };
  };

  // 4. Fetch all topics from DB and update their content
  const topicsRes = await pool.query(`
    SELECT t.id, t.name, t.slug, tr.name AS track_name
    FROM topics t
    LEFT JOIN track_topics tt ON t.id = tt.topic_id
    LEFT JOIN tracks tr ON tt.track_id = tr.id
  `);

  console.log(`Found ${topicsRes.rows.length} topics in database to enrich.`);

  for (const row of topicsRes.rows) {
    const specific = topicContents[row.slug];
    const content = specific || generateFallbackContent(row.name, row.slug, row.track_name);

    await pool.query(
      `UPDATE topics 
       SET theory_summary = $1,
           doc_links = $2::jsonb,
           video_links = $3::jsonb,
           practice_items = $4::jsonb
       WHERE id = $5`,
      [
        content.theory_summary,
        JSON.stringify(content.doc_links),
        JSON.stringify(content.video_links),
        JSON.stringify(content.practice_items),
        row.id,
      ]
    );
  }

  console.log("🎉 Successfully enriched all topics with rich theory, doc links, video links, and practice evaluation items!");
};

if (require.main === module) {
  seedTopicContent()
    .then(() => pool.end())
    .catch((err) => {
      console.error("Migration error:", err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedTopicContent };
