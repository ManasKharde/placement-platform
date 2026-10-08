const path = require('path');
const dotenv = require('dotenv');

// Safely load environment variables BEFORE importing db pool
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = require('../config/db');

const cleanUrl = (url) => {
  if (!url) return url;
  const match = url.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const clean = match ? match[2] : url;
  return clean.trim();
};

const CLEAN_SUMMARY = `> **Note:** As this is a very big lecture (62+ hours), if there are some concepts you have already learned then please skip them to focus on the modules relevant to your preparation.

---

### 📌 Lecture Curriculum & Architectural Breakdown

### 1. Java Core Foundations & JVM Internals
* **Architecture:** Java Virtual Machine (JVM), Java Runtime Environment (JRE), Java Development Kit (JDK), Bytecode compilation, JIT Compiler, and Write Once, Run Anywhere (WORA) mechanics.
* **Primitive Types & Operations:** Primitive variable types, memory ranges, arithmetic/bitwise operators, automatic type conversion vs explicit casting.
* **Control Flow:** Ternary operator, if-else ladder, standard vs enhanced switch expressions, and nested looping constructs (for, while, do-while).

### 2. Object-Oriented Programming (OOP) & Memory Layout
* **Classes & Objects:** Stack vs Heap memory allocation, reference variables, instance methods, and method overloading.
* **Arrays & Strings:** 1D, Multi-dimensional, and Jagged arrays; Array of Objects; String Constant Pool (SCP) immutability vs heap allocations; StringBuffer and StringBuilder thread-safety.
* **Encapsulation & Scope:** The static keyword (variables, methods, initialization blocks), this keyword, constructor overloading, packages, and access modifiers.
* **Inheritance & Polymorphism:** Class hierarchy, super() vs this(), method overriding, Dynamic Method Dispatch (Runtime Polymorphism), final modifier, upcasting vs downcasting.
* **Abstraction & Contracts:** Abstract classes vs pure abstract methods, Member Inner Classes, Static Nested Classes, and Anonymous Inner Classes.

### 3. Modern Java (8 to 21) & Functional Programming
* **Interfaces:** Interface contracts, default and static methods in interfaces, multiple interface inheritance.
* **Functional Programming:** Single Abstract Method (SAM) interfaces, Lambda Expressions syntax, method references (::), and functional composition.
* **Enums & Annotations:** Custom Enumerations with fields/constructors, built-in annotations (@Override, @Deprecated, @SuppressWarnings), and custom runtime reflection annotations.

### 4. Robustness: Exception Handling & IO
* **Exception Hierarchy:** Throwable, Exception, RuntimeException, Error.
* **Flow Control:** try-catch-finally blocks, multiple catch handling, checked vs unchecked exceptions, throw vs throws propagation.
* **Resource Management:** Custom application exceptions and Automatic Resource Management via try-with-resources (AutoCloseable).
* **Console IO:** Legacy BufferedReader vs modern Scanner parsing.

### 5. Multithreading & High Concurrency
* **Thread Mechanics:** Thread lifecycle, Thread class extension vs Runnable interface implementation, thread priority states, and thread starvation.
* **Concurrency Primitives:** Race conditions, critical sections, object-level vs class-level synchronization (synchronized keyword/blocks).
* **Inter-Thread Communication:** The Producer-Consumer pattern using wait(), notify(), and notifyAll().

### 6. Java Collections Framework & Generics
* **Collection Interfaces:** Generic type safety (<T>), List, Queue, Set, and Map taxonomy.
* **List Implementations:** ArrayList (dynamic arrays, amortization) vs LinkedList (doubly-linked nodes).
* **Set & Map Internals:** HashSet vs TreeSet (Red-Black tree ordering); HashMap collision handling (hashing, buckets, treeification) vs TreeMap vs thread-safe alternatives.
* **Comparisons:** Natural ordering via Comparable (compareTo) vs dynamic ordering via Comparator (custom Lambdas).
* **Stream API:** Stream pipelines, Lazy evaluation, Intermediate operations (filter, map, sorted, distinct), Terminal operations (collect, reduce, count, forEach), and Parallel Streams.

### 7. Persistence & Database Connectivity (JDBC)
* **JDBC Architecture:** Drivers, DriverManager, database connection pooling concepts.
* **SQL Execution:** Statement vs parameterized PreparedStatement (SQL injection prevention), ResultSet cursor manipulation, and CRUD transaction lifecycle.

### 8. Web Foundations & Servlets
* **HTTP Protocol:** Web servers vs Application containers (Tomcat), Request-Response lifecycle.
* **Servlets:** Servlet container initialization, lifecycle methods (init, service, destroy), HTTP verbs handling (GET, POST).

### 9. Enterprise Java: Spring Framework & Spring Boot
* **Spring Core:** Inversion of Control (IoC), Dependency Injection (DI), Spring ApplicationContext, Bean lifecycle, annotation-driven configuration (@Component, @Autowired, @Configuration, @Bean, @Qualifier, @Value).
* **Spring Boot:** Auto-configuration architecture, Starter POM dependencies, @SpringBootApplication, application configuration (application.properties / application.yml).
* **REST API Development:** Spring MVC architecture, building production REST endpoints with @RestController, @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, request parsing (@PathVariable, @RequestParam, @RequestBody), ResponseEntity<T>, HTTP status codes, and centralized exception handling (@ControllerAdvice, @ExceptionHandler).

### 10. Spring Data JPA & Hibernate ORM
* **ORM Principles:** Object-Relational Mapping fundamentals, Hibernate SessionFactory and EntityManager.
* **JPA Annotations:** @Entity, @Table, @Id, @GeneratedValue, @Column.
* **Entity Relationships:** @OneToOne, @OneToMany, @ManyToOne, @ManyToMany, Fetch types (Lazy vs Eager), Cascading rules.
* **Data Layer:** JpaRepository abstractions, derived query methods, custom JPQL queries, native SQL queries via @Query, and transactional boundaries via @Transactional.`;

async function fixJavaMasterclassMetadata() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Delete any quizzes and quiz questions linked to topic 22262
    const quizTableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('quizzes', 'quiz_questions', 'quiz_options', 'quiz_submissions', 'user_quiz_attempts');
    `);
    const existingTables = new Set(quizTableCheck.rows.map(r => r.table_name));

    if (existingTables.has('quizzes')) {
      const quizCheck = await client.query(`SELECT id FROM quizzes WHERE topic_id = 22262;`);
      for (const q of quizCheck.rows) {
        if (existingTables.has('quiz_submissions')) {
          await client.query(`DELETE FROM quiz_submissions WHERE quiz_id = $1;`, [q.id]).catch(() => {});
        }
        if (existingTables.has('user_quiz_attempts')) {
          await client.query(`DELETE FROM user_quiz_attempts WHERE quiz_id = $1;`, [q.id]).catch(() => {});
        }
        if (existingTables.has('quiz_options')) {
          await client.query(`DELETE FROM quiz_options WHERE question_id IN (SELECT id FROM quiz_questions WHERE quiz_id = $1);`, [q.id]).catch(() => {});
        }
        if (existingTables.has('quiz_questions')) {
          await client.query(`DELETE FROM quiz_questions WHERE quiz_id = $1;`, [q.id]).catch(() => {});
        }
      }
      await client.query(`DELETE FROM quizzes WHERE topic_id = 22262;`);
    }

    if (existingTables.has('quiz_questions')) {
      // Also delete any dangling questions directly linked by topic_id if column exists
      const qqColsRes = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'quiz_questions';
      `);
      const qqCols = new Set(qqColsRes.rows.map(r => r.column_name));
      if (qqCols.has('topic_id')) {
        await client.query(`DELETE FROM quiz_questions WHERE topic_id = 22262;`);
      }
    }
    console.log('Cleared quiz and evaluation questions for topic 22262.');

    // 2. Inspect 'topics' columns dynamically
    const topicColsRes = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'topics';
    `);
    const topicCols = new Set(topicColsRes.rows.map(r => r.column_name));

    const videoLinksObj = [
      {
        title: 'Complete Java Development Course - 62+ Hours Bootcamp',
        url: cleanUrl('https://youtu.be/q6z_UCBM5Ek'),
        duration: '62:55:08',
        duration_minutes: 3775,
        creator_name: 'Telusko',
        creator_channel_url: cleanUrl('https://www.youtube.com/@Telusko')
      }
    ];

    const topicUpdates = [];
    const topicParams = [];

    const addTopicField = (col, val, cast = null) => {
      if (topicCols.has(col)) {
        topicParams.push(val);
        topicUpdates.push(`${col} = $${topicParams.length}${cast ? `::${cast}` : ''}`);
      }
    };

    addTopicField('title', 'Complete Java Backend Development Masterclass');
    addTopicField('name', 'Complete Java Backend Development Masterclass');
    addTopicField('duration_minutes', 3775);
    addTopicField('estimated_minutes', 3775);
    addTopicField('duration', 3775);
    addTopicField('practice_items', '[]', 'jsonb');
    addTopicField('practice_problems', '[]', 'jsonb');
    addTopicField('creator_name', 'Telusko');
    addTopicField('creator_channel_url', cleanUrl('https://www.youtube.com/@Telusko'));
    addTopicField('summary_markdown', CLEAN_SUMMARY);
    addTopicField('theory_summary', CLEAN_SUMMARY);
    addTopicField('video_url', cleanUrl('https://youtu.be/q6z_UCBM5Ek'));
    addTopicField('video_title', 'Complete Java Development Course - 62+ Hours Bootcamp');
    addTopicField('video_links', JSON.stringify(videoLinksObj), 'jsonb');

    topicParams.push(22262);
    const topicIdParamIndex = topicParams.length;

    await client.query(`
      UPDATE topics 
      SET ${topicUpdates.join(', ')}
      WHERE id = $${topicIdParamIndex} OR slug = 'java-backend-one-shot';
    `, topicParams);
    console.log('Updated topic 22262 with duration_minutes/estimated_minutes = 3775, video duration = 62:55:08, and cleaned summary.');

    // 3. Inspect and update 'resources' table if present
    const resTableCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'resources';
    `);
    const resCols = new Set(resTableCheck.rows.map(r => r.column_name));

    if (resCols.size > 0 && resCols.has('topic_id')) {
      const resUpdates = [];
      const resParams = [];

      const addResField = (col, val) => {
        if (resCols.has(col)) {
          resParams.push(val);
          resUpdates.push(`${col} = $${resParams.length}`);
        }
      };

      addResField('title', 'Complete Java Development Course - 62+ Hours Bootcamp');
      addResField('url', cleanUrl('https://youtu.be/q6z_UCBM5Ek'));
      addResField('duration_minutes', 3775);
      addResField('duration', '62:55:08');
      addResField('creator_name', 'Telusko');
      addResField('creator_channel_url', cleanUrl('https://www.youtube.com/@Telusko'));

      if (resUpdates.length > 0) {
        resParams.push(22262);
        await client.query(`
          UPDATE resources 
          SET ${resUpdates.join(', ')}
          WHERE topic_id = $${resParams.length};
        `, resParams);
        console.log('Updated resources table for topic 22262.');
      }
    }

    // 4. Update Development track duration
    const trackColsRes = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'tracks';
    `);
    const trackCols = new Set(trackColsRes.rows.map(r => r.column_name));

    const trackUpdates = [];
    const trackParams = [];

    if (trackCols.has('duration_hours')) {
      trackParams.push(63);
      trackUpdates.push(`duration_hours = $${trackParams.length}`);
    }
    if (trackCols.has('duration_minutes')) {
      trackParams.push(3775);
      trackUpdates.push(`duration_minutes = $${trackParams.length}`);
    }

    if (trackUpdates.length > 0) {
      await client.query(`
        UPDATE tracks 
        SET ${trackUpdates.join(', ')}
        WHERE slug = 'java-backend-development' OR id = 712;
      `, trackParams);
      console.log('Updated tracks table duration metadata.');
    }

    // 5. Update preparation_paths if duration column exists
    const pathColsRes = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'preparation_paths';
    `);
    const pathCols = new Set(pathColsRes.rows.map(r => r.column_name));
    if (pathCols.has('duration_hours')) {
      // Sum up duration_hours of linked tracks
      const sumRes = await client.query(`
        SELECT COALESCE(SUM(t.duration_hours), 0) AS total_hrs
        FROM path_tracks pt
        JOIN tracks t ON t.id = pt.track_id
        WHERE pt.path_id = 2;
      `);
      await client.query(`
        UPDATE preparation_paths
        SET duration_hours = $1
        WHERE id = 2;
      `, [sumRes.rows[0].total_hrs]);
      console.log(`Updated preparation_paths (id 2) duration_hours = ${sumRes.rows[0].total_hrs}.`);
    }

    await client.query('COMMIT');
    console.log('Database updates committed successfully!');

    // 6. Verification
    const durationCol = topicCols.has('estimated_minutes') ? 'estimated_minutes' : 'duration_minutes';
    const verify = await client.query(`
      SELECT id, title, slug, ${durationCol} AS duration_minutes, creator_name, creator_channel_url,
             practice_items,
             (SELECT COUNT(*) FROM quizzes WHERE topic_id = t.id) AS quiz_count
      FROM topics t
      WHERE id = 22262;
    `);
    console.log('\n=== VERIFICATION: TOPIC 22262 UPDATED METADATA ===');
    console.table(verify.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during update:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

fixJavaMasterclassMetadata();
