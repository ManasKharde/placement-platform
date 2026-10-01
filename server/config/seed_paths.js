const pool = require("./db");

const seedPathsData = async () => {
  console.log("🌱 Starting preparation paths, tracks, topics & resources seeding...");

  // 1. Schema migration: Ensure daily_hours column exists
  await pool.query(`
    ALTER TABLE user_preparation_paths 
    ADD COLUMN IF NOT EXISTS daily_hours INT DEFAULT 2;
  `);
  console.log("✅ Verified daily_hours column in user_preparation_paths.");

  // Sync any null or 0 daily_hours in user_preparation_paths
  await pool.query(`
    UPDATE user_preparation_paths
    SET daily_hours = COALESCE(NULLIF(daily_study_time_minutes / 60, 0), 2)
    WHERE daily_hours IS NULL OR daily_hours = 0;
  `);

  // Idempotency Check: If active paths and topics are already populated, skip re-seeding
  const pathCountRes = await pool.query("SELECT COUNT(*)::int AS count FROM preparation_paths WHERE is_active = true");
  const topicCountRes = await pool.query("SELECT COUNT(*)::int AS count FROM topics");

  if (pathCountRes.rows[0].count >= 4 && topicCountRes.rows[0].count >= 30) {
    console.log("✅ Preparation paths, tracks, and topics are already seeded. Skipping redundant re-seed.");
    return;
  }

  // Paths definitions
  const paths = [
    {
      name: "Node.js Backend Developer",
      slug: "nodejs-backend-developer",
      description:
        "Master server-side JavaScript, Express.js, PostgreSQL, REST APIs, microservices, caching with Redis, and scalable backend architecture for top engineering placements.",
      tracks: [
        {
          name: "Node.js Core & Concurrency Architecture",
          slug: "nodejs-core-concurrency",
          description: "Event Loop, Libuv, Streams, Buffers, and Asynchronous Concurrency",
          topics: [
            {
              name: "Event Loop, Libuv & Asynchronous Concurrency",
              slug: "event-loop-libuv-concurrency",
              description: "Understanding microtasks, macrotasks, timers, and the libuv thread pool.",
              resources: [
                { title: "Node.js Event Loop Deep Dive Guide", url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick", type: "documentation", minutes: 35 },
                { title: "Mastering Asynchronous JavaScript & Libuv", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous", type: "article", minutes: 45 }
              ]
            },
            {
              name: "Streams, Buffers & File System Operations",
              slug: "streams-buffers-fs",
              description: "Memory-efficient stream processing with pipeline, transform streams, and binary buffers.",
              resources: [
                { title: "Node.js Streams Handbook", url: "https://nodejs.org/api/stream.html", type: "documentation", minutes: 40 },
                { title: "Handling Large Files using Streams", url: "https://web.dev/articles/streams", type: "practice", minutes: 50 }
              ]
            },
            {
              name: "EventEmitter, Process Lifecycle & Error Handling",
              slug: "event-emitter-process-errors",
              description: "Custom event dispatching, graceful shutdown signals (SIGTERM/SIGINT), and uncaught exception handling.",
              resources: [
                { title: "Building Event-Driven Systems with EventEmitter", url: "https://nodejs.org/api/events.html", type: "documentation", minutes: 30 },
                { title: "Node.js Production Error Handling Best Practices", url: "https://goldbergyoni.com/nodejs-best-practices/", type: "article", minutes: 45 }
              ]
            }
          ]
        },
        {
          name: "Express.js & RESTful API Engineering",
          slug: "express-rest-api",
          description: "Routing, custom middleware pipelines, validation, error handling, and security",
          topics: [
            {
              name: "Middleware Pipeline & Request Lifecycle",
              slug: "middleware-pipeline-lifecycle",
              description: "Request execution order, next(), router-level middleware, and third-party integrations.",
              resources: [
                { title: "Writing Express Middleware", url: "https://expressjs.com/en/guide/writing-middleware.html", type: "documentation", minutes: 30 },
                { title: "Custom Authentication & Logging Middleware", url: "https://expressjs.com/en/guide/using-middleware.html", type: "practice", minutes: 40 }
              ]
            },
            {
              name: "Input Validation, Sanitization & Security Headers",
              slug: "validation-sanitization-security",
              description: "Preventing SQL injection, XSS, and payload pollution with express-validator, helmet, and rate-limiting.",
              resources: [
                { title: "Express Validator Documentation", url: "https://express-validator.github.io/docs/", type: "documentation", minutes: 35 },
                { title: "Securing Express Applications with Helmet", url: "https://helmetjs.github.io/", type: "article", minutes: 30 }
              ]
            },
            {
              name: "Standardized API Error Handling & Logging",
              slug: "standardized-error-handling",
              description: "Custom AppError class, centralized error handling middleware, and structured logging.",
              resources: [
                { title: "Robust Error Handling in Express.js", url: "https://expressjs.com/en/guide/error-handling.html", type: "documentation", minutes: 30 }
              ]
            }
          ]
        },
        {
          name: "PostgreSQL & Database Engineering",
          slug: "postgresql-database-engineering",
          description: "Relational schema design, SQL optimization, transactions, and indexing",
          topics: [
            {
              name: "Relational Schema Design & Normalization",
              slug: "schema-design-normalization",
              description: "Entity relationships (1:1, 1:N, N:M), foreign keys, cascading constraints, and 3NF.",
              resources: [
                { title: "Database Normalization Explained", url: "https://www.postgresql.org/docs/current/ddl.html", type: "documentation", minutes: 45 },
                { title: "PostgreSQL Data Types & Table Constraints", url: "https://www.postgresql.org/docs/current/datatype.html", type: "documentation", minutes: 40 }
              ]
            },
            {
              name: "Advanced SQL & Query Optimization",
              slug: "sql-query-optimization",
              description: "JOIN types, aggregation, CTEs, subqueries, and EXPLAIN ANALYZE performance tuning.",
              resources: [
                { title: "Using EXPLAIN ANALYZE for Query Tuning", url: "https://www.postgresql.org/docs/current/using-explain.html", type: "article", minutes: 50 },
                { title: "PostgreSQL Indexing: B-Tree, Hash & GIN", url: "https://www.postgresql.org/docs/current/indexes.html", type: "documentation", minutes: 45 }
              ]
            },
            {
              name: "Connection Pooling & ACID Transactions",
              slug: "connection-pooling-transactions",
              description: "Configuring pg.Pool, BEGIN/COMMIT/ROLLBACK, isolation levels, and deadlock prevention.",
              resources: [
                { title: "PostgreSQL Transactions and Concurrency", url: "https://www.postgresql.org/docs/current/tutorial-transactions.html", type: "documentation", minutes: 40 }
              ]
            }
          ]
        },
        {
          name: "Authentication, JWT Security & OAuth",
          slug: "auth-jwt-security-oauth",
          description: "Bcrypt, JWT rotation with HTTP-only cookies, and Google OAuth 2.0",
          topics: [
            {
              name: "Bcrypt Hashing & Salting Best Practices",
              slug: "bcrypt-hashing-salting",
              description: "One-way cryptographic password hashing, work factor tuning, and timing-attack resistance.",
              resources: [
                { title: "Secure Password Storage with Bcrypt", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", type: "article", minutes: 35 }
              ]
            },
            {
              name: "Dual-Token JWT Rotation with HTTP-Only Cookies",
              slug: "jwt-rotation-http-cookies",
              description: "Short-lived access tokens, long-lived refresh tokens, CSRF protection, and token revocation.",
              resources: [
                { title: "JWT Handbook & Best Practices", url: "https://auth0.com/resources/ebooks/jwt-handbook", type: "article", minutes: 50 },
                { title: "HTTP-Only Secure Cookies vs LocalStorage", url: "https://owasp.org/www-community/HttpOnly", type: "article", minutes: 30 }
              ]
            },
            {
              name: "Google OAuth 2.0 Integration & Passport.js",
              slug: "google-oauth2-passport",
              description: "OAuth 2.0 authorization code flow, secure callback handling, and user profile provisioning.",
              resources: [
                { title: "OAuth 2.0 Protocol Simplified", url: "https://oauth.net/2/", type: "documentation", minutes: 45 }
              ]
            }
          ]
        },
        {
          name: "Caching, Queues & System Design Basics",
          slug: "caching-queues-system-design",
          description: "Redis caching patterns, background job queues, rate limiting, and microservices concepts",
          topics: [
            {
              name: "In-Memory Caching with Redis",
              slug: "redis-caching-patterns",
              description: "Cache-aside, write-through, TTL invalidation, and distributed locks.",
              resources: [
                { title: "Redis Commands and Data Structures", url: "https://redis.io/docs/data-types/", type: "documentation", minutes: 40 },
                { title: "API Caching Strategies with Redis", url: "https://redis.io/solutions/caching/", type: "article", minutes: 40 }
              ]
            },
            {
              name: "Message Queues & Background Processing",
              slug: "message-queues-background-jobs",
              description: "Decoupling heavy tasks, BullMQ, job retries, dead letter queues, and concurrency control.",
              resources: [
                { title: "BullMQ Guide for Node.js", url: "https://docs.bullmq.io/", type: "documentation", minutes: 45 }
              ]
            },
            {
              name: "System Design: Scalability & Load Balancing",
              slug: "scalability-load-balancing",
              description: "Horizontal vs vertical scaling, reverse proxies (Nginx), database read replicas, and stateless services.",
              resources: [
                { title: "System Design Primer: Scalability Concepts", url: "https://github.com/donnemartin/system-design-primer", type: "article", minutes: 60 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "React.js Frontend Developer",
      slug: "reactjs-frontend-developer",
      description:
        "Master modern React 19, JavaScript ES6+, TypeScript, Tailwind CSS, global state management, TanStack Query, and frontend performance optimization for product engineering roles.",
      tracks: [
        {
          name: "Modern JavaScript & TypeScript Foundations",
          slug: "modern-js-typescript",
          description: "ES6+, Closures, Event Loop, Promises, and TypeScript type safety",
          topics: [
            {
              name: "JavaScript Execution Context, Closures & Prototypal Chain",
              slug: "js-execution-closures-prototypes",
              description: "Call stack, memory heap, lexical scope, closures, and inheritance.",
              resources: [
                { title: "Deep JavaScript Foundations", url: "https://javascript.info/closure", type: "article", minutes: 45 },
                { title: "MDN Guide to Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures", type: "documentation", minutes: 35 }
              ]
            },
            {
              name: "Asynchronous JavaScript: Promises, Async/Await & Event Loop",
              slug: "async-js-promises-event-loop",
              description: "Microtask queue, event loop phases, Promise.all, Promise.allSettled, and error handling.",
              resources: [
                { title: "MDN Asynchronous JavaScript", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous", type: "documentation", minutes: 45 }
              ]
            },
            {
              name: "TypeScript for React Developers",
              slug: "typescript-for-react",
              description: "Typing props, hooks, events, generics, utility types, and strict mode.",
              resources: [
                { title: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/", type: "documentation", minutes: 50 }
              ]
            }
          ]
        },
        {
          name: "React 19 Core & Hooks Mastery",
          slug: "react-core-hooks",
          description: "Virtual DOM reconciliation, state hooks, effect lifecycles, and custom hooks",
          topics: [
            {
              name: "React Component Lifecycle & Virtual DOM Diffing",
              slug: "component-lifecycle-vdom",
              description: "Reconciliation algorithm, fibers, keys in lists, and component purity.",
              resources: [
                { title: "React.dev Official Documentation", url: "https://react.dev/learn", type: "documentation", minutes: 40 }
              ]
            },
            {
              name: "Mastering React Hooks: useState, useEffect, useRef, useMemo, useCallback",
              slug: "mastering-react-hooks",
              description: "Avoiding unnecessary re-renders, dependency array gotchas, and memoization patterns.",
              resources: [
                { title: "A Complete Guide to useEffect", url: "https://overreacted.io/a-complete-guide-to-useeffect/", type: "article", minutes: 55 }
              ]
            },
            {
              name: "Writing Custom Reusable Hooks",
              slug: "custom-reusable-hooks",
              description: "Extracting stateful component logic into clean, composable custom hooks.",
              resources: [
                { title: "Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks", type: "documentation", minutes: 45 }
              ]
            }
          ]
        },
        {
          name: "Modern UI Engineering & Tailwind CSS",
          slug: "modern-ui-tailwind",
          description: "Utility-first responsive layouts, theme tokens, accessible components, and animations",
          topics: [
            {
              name: "Tailwind CSS v4: Design Tokens & Layout Mastery",
              slug: "tailwind-tokens-layouts",
              description: "Flexbox, CSS Grid, mobile-first responsive breakpoints, and theme variables.",
              resources: [
                { title: "Tailwind CSS Official Guide", url: "https://tailwindcss.com/docs", type: "documentation", minutes: 45 }
              ]
            },
            {
              name: "Accessible UI Components & Micro-interactions",
              slug: "accessible-ui-interactions",
              description: "Keyboard navigation, ARIA attributes, focus management, and subtle hover/active states.",
              resources: [
                { title: "Web Accessibility Guidelines (W3C)", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/", type: "article", minutes: 40 }
              ]
            }
          ]
        },
        {
          name: "Data Fetching & State Architecture (TanStack Query)",
          slug: "data-fetching-state-tanstack",
          description: "Server state cache, background synchronization, optimistic updates, and Zustand",
          topics: [
            {
              name: "Server State Management with TanStack Query",
              slug: "server-state-tanstack-query",
              description: "useQuery, useMutation, query invalidation, caching strategies, and prefetching.",
              resources: [
                { title: "TanStack Query Official Docs", url: "https://tanstack.com/query/latest/docs/react/overview", type: "documentation", minutes: 50 }
              ]
            },
            {
              name: "Lightweight Client State with Zustand & Context",
              slug: "zustand-client-state",
              description: "Eliminating prop drilling, selectors for high-performance renders, and persistent state.",
              resources: [
                { title: "Zustand State Management Guide", url: "https://zustand.docs.pmnd.rs/getting-started/introduction", type: "documentation", minutes: 40 }
              ]
            }
          ]
        },
        {
          name: "Frontend Performance & Web Vitals",
          slug: "frontend-performance-vitals",
          description: "Code splitting, dynamic imports, bundle optimization, and Lighthouse metrics",
          topics: [
            {
              name: "Code Splitting, Lazy Loading & React Suspense",
              slug: "code-splitting-lazy-suspense",
              description: "Route-level code splitting with React.lazy, chunk minimization, and loading skeletons.",
              resources: [
                { title: "Optimizing Web Vitals", url: "https://web.dev/articles/vitals", type: "article", minutes: 45 }
              ]
            },
            {
              name: "Browser Rendering Optimization & Memory Leak Prevention",
              slug: "rendering-optimization-memory",
              description: "Preventing reflows/repaints, virtualizing large lists, and cleaning up event listeners.",
              resources: [
                { title: "Chrome DevTools Performance Profiling", url: "https://developer.chrome.com/docs/devtools/performance/", type: "documentation", minutes: 45 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Java Enterprise Developer",
      slug: "java-developer",
      description:
        "Enterprise backend software engineering with Core Java 21, Object-Oriented Design, Spring Boot, Hibernate/JPA, Microservices, and scalable database architectures.",
      tracks: [
        {
          name: "Core Java & Object-Oriented Programming (OOP)",
          slug: "core-java-oop",
          description: "OOP Pillars, Collections Framework, Generics, and Concurrency",
          topics: [
            {
              name: "OOP Design Principles & SOLID Concepts in Java",
              slug: "oop-solid-java",
              description: "Encapsulation, Polymorphism, Abstraction, and the 5 SOLID engineering principles.",
              resources: [
                { title: "SOLID Principles in Java", url: "https://www.baeldung.com/solid-principles", type: "article", minutes: 45 }
              ]
            },
            {
              name: "Java Collections Framework & Stream API",
              slug: "java-collections-streams",
              description: "ArrayList, LinkedList, HashMap internal implementation, ConcurrentHashMap, and Streams.",
              resources: [
                { title: "Java Collections Deep Dive", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/package-summary.html", type: "documentation", minutes: 50 }
              ]
            },
            {
              name: "Multithreading, Concurrency & Virtual Threads",
              slug: "java-concurrency-virtual-threads",
              description: "Threads, Synchronization, ExecutorService, CompletableFuture, and Java 21 Project Loom.",
              resources: [
                { title: "Java Virtual Threads Guide", url: "https://openjdk.org/jeps/444", type: "documentation", minutes: 50 }
              ]
            }
          ]
        },
        {
          name: "Relational Databases with JDBC & Hibernate/JPA",
          slug: "java-databases-jpa",
          description: "SQL integration, connection pooling with HikariCP, and ORM entity mapping",
          topics: [
            {
              name: "JDBC Connection Management & Transaction Boundaries",
              slug: "jdbc-transactions-hikaricp",
              description: "PreparedStatements, batch processing, connection pooling, and ACID guarantees in Java.",
              resources: [
                { title: "HikariCP Best Practices", url: "https://github.com/brettwooldridge/HikariCP", type: "documentation", minutes: 35 }
              ]
            },
            {
              name: "Hibernate ORM, JPA Annotations & N+1 Problem",
              slug: "hibernate-jpa-n-plus-1",
              description: "@Entity, @OneToMany, @ManyToMany, FetchType.LAZY, and solving the N+1 select query problem.",
              resources: [
                { title: "Baeldung Hibernate JPA Guide", url: "https://www.baeldung.com/learn-jpa-hibernate", type: "article", minutes: 50 }
              ]
            }
          ]
        },
        {
          name: "Spring Boot REST APIs & Microservices",
          slug: "spring-boot-microservices",
          description: "Spring Boot 3, Dependency Injection, Spring Security, and distributed architecture",
          topics: [
            {
              name: "Dependency Injection, Inversion of Control & Spring Beans",
              slug: "spring-di-ioc-beans",
              description: "@Component, @Service, @Autowired, Bean Scopes, and application context lifecycle.",
              resources: [
                { title: "Spring Framework Documentation", url: "https://docs.spring.io/spring-framework/reference/", type: "documentation", minutes: 45 }
              ]
            },
            {
              name: "Building RESTful APIs with Spring MVC & Spring Data JPA",
              slug: "spring-mvc-data-jpa",
              description: "@RestController, request validation (@Valid), DTO pattern, and CrudRepository/JpaRepository.",
              resources: [
                { title: "Building REST APIs with Spring Boot", url: "https://spring.io/guides/tutorials/rest/", type: "practice", minutes: 55 }
              ]
            },
            {
              name: "Microservices Architecture: API Gateway & Service Discovery",
              slug: "spring-microservices-patterns",
              description: "Spring Cloud Gateway, Eureka discovery, resilience with Resilience4j, and Kafka messaging.",
              resources: [
                { title: "Microservices with Spring Boot", url: "https://spring.io/microservices", type: "article", minutes: 60 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Full Stack Web Developer (MERN)",
      slug: "fullstack-developer",
      description:
        "End-to-end full stack development encompassing modern React frontend, scalable Node/Express backend, PostgreSQL & MongoDB database modeling, authentication, and cloud deployment.",
      tracks: [
        {
          name: "Full-Stack System Architecture & REST APIs",
          slug: "fullstack-architecture-apis",
          description: "Client-server communication, HTTP protocols, CORS, and full-stack project structure",
          topics: [
            {
              name: "Client-Server Contract & REST API Conventions",
              slug: "client-server-contract-rest",
              description: "HTTP verbs, status codes, standard JSON payloads, pagination, and error contracts.",
              resources: [
                { title: "RESTful API Design Standards", url: "https://restfulapi.net/", type: "article", minutes: 40 }
              ]
            },
            {
              name: "Secure Cross-Origin Resource Sharing (CORS) & Cookies",
              slug: "cors-secure-cookies-sessions",
              description: "Configuring withCredentials, sameSite lax/none, origin whitelisting, and preflight requests.",
              resources: [
                { title: "Understanding CORS and Credentials", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", type: "documentation", minutes: 40 }
              ]
            }
          ]
        },
        {
          name: "Database Engineering & Polyglot Persistence",
          slug: "database-engineering-polyglot",
          description: "Relational PostgreSQL vs Document MongoDB, indexes, and schema design",
          topics: [
            {
              name: "PostgreSQL for Relational Business Entities",
              slug: "postgres-relational-modeling",
              description: "Tables, foreign key relationships, indexes, and querying relational application data.",
              resources: [
                { title: "PostgreSQL Fundamentals", url: "https://www.postgresqltutorial.com/", type: "documentation", minutes: 45 }
              ]
            },
            {
              name: "MongoDB for Flexible Document Storage",
              slug: "mongodb-document-storage",
              description: "Collections, document schemas, embedding vs referencing, and Mongoose ORM.",
              resources: [
                { title: "MongoDB University Essentials", url: "https://www.mongodb.com/basics", type: "article", minutes: 45 }
              ]
            }
          ]
        },
        {
          name: "Full-Stack Security, Auth & Cloud Deployment",
          slug: "fullstack-security-deployment",
          description: "JWT authentication, environment isolation, Docker containerization, and production CI/CD",
          topics: [
            {
              name: "End-to-End JWT Authentication & Protected Routes",
              slug: "e2e-jwt-auth-protected-routes",
              description: "Axios interceptors for token refresh, React context authorization, and route guards.",
              resources: [
                { title: "Securing Single Page Applications", url: "https://cheatsheetseries.owasp.org/cheatsheets/Single_Page_Application_Cheat_Sheet.html", type: "article", minutes: 45 }
              ]
            },
            {
              name: "Containerization with Docker & Production Deployment",
              slug: "docker-production-deployment",
              description: "Multi-stage Dockerfiles, Docker Compose for local full-stack dev, and cloud deployment.",
              resources: [
                { title: "Docker Getting Started Guide", url: "https://docs.docker.com/get-started/", type: "documentation", minutes: 50 }
              ]
            }
          ]
        }
      ]
    }
  ];

  for (const path of paths) {
    // 1. Insert or update path
    const pathRes = await pool.query(
      `INSERT INTO preparation_paths (name, slug, description, is_active)
       VALUES ($1, $2, $3, true)
       ON CONFLICT (slug) DO UPDATE 
       SET name = EXCLUDED.name, description = EXCLUDED.description, is_active = true
       RETURNING id, name, slug`,
      [path.name, path.slug, path.description]
    );

    const pathId = pathRes.rows[0].id;
    console.log(`\n📌 Path: ${path.name} (ID: ${pathId})`);

    // 2. Clear old path_tracks for this path so track_order is clean
    await pool.query("DELETE FROM path_tracks WHERE path_id = $1", [pathId]);

    let trackOrder = 1;
    for (const track of path.tracks) {
      // Insert or update track
      let trackRes = await pool.query(
        "SELECT id FROM tracks WHERE slug = $1",
        [track.slug]
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
          "UPDATE tracks SET name = $1, description = $2 WHERE id = $3",
          [track.name, track.description, trackId]
        );
      }

      // Link path and track with order
      await pool.query(
        "INSERT INTO path_tracks (path_id, track_id, track_order) VALUES ($1, $2, $3)",
        [pathId, trackId, trackOrder]
      );

      // Clear old track_topics for this track
      await pool.query("DELETE FROM track_topics WHERE track_id = $1", [trackId]);

      let topicOrder = 1;
      for (const topic of track.topics) {
        let topicRes = await pool.query(
          "SELECT id FROM topics WHERE slug = $1",
          [topic.slug]
        );

        let topicId;
        if (topicRes.rows.length === 0) {
          const newTopic = await pool.query(
            "INSERT INTO topics (name, slug, description) VALUES ($1, $2, $3) RETURNING id",
            [topic.name, topic.slug, topic.description]
          );
          topicId = newTopic.rows[0].id;
        } else {
          topicId = topicRes.rows[0].id;
          await pool.query(
            "UPDATE topics SET name = $1, description = $2 WHERE id = $3",
            [topic.name, topic.description, topicId]
          );
        }

        // Link track and topic
        await pool.query(
          "INSERT INTO track_topics (track_id, topic_id, topic_order) VALUES ($1, $2, $3)",
          [trackId, topicId, topicOrder]
        );

        // Seed resources for this topic
        await pool.query("DELETE FROM resources WHERE topic_id = $1", [topicId]);
        for (const res of topic.resources) {
          await pool.query(
            `INSERT INTO resources (topic_id, title, url, resource_type, estimated_minutes)
             VALUES ($1, $2, $3, $4, $5)`,
            [topicId, res.title, res.url, res.type, res.minutes]
          );
        }

        topicOrder++;
      }

      trackOrder++;
    }
  }

  // Handle unique constraint on preparation_paths slug if not present
  console.log("\n🎉 Successfully seeded all preparation paths, tracks, topics and resources!");
};

module.exports = { seedPathsData };

if (require.main === module) {
  seedPathsData()
    .then(() => pool.end())
    .catch((err) => {
      console.error("Seeding error:", err);
      pool.end();
      process.exit(1);
    });
}
