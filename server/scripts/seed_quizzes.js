const pool = require("../config/db");

const seedQuizzes = async () => {
  console.log("🌱 Starting Quiz Content Seeding...");

  const quizDefinitions = [
    // 1. Operating Systems
    {
      topicSlug: "os-concurrency-deadlocks-memory",
      title: "Operating Systems Core Screening Assessment",
      description: "Timed technical screening assessment on concurrency, Coffman deadlock conditions, CPU scheduling, and virtual memory.",
      timeLimitMinutes: 5,
      passingPercentage: 70,
      questions: [
        {
          questionText: "Which of the following is NOT one of Coffman's four necessary conditions for a system deadlock to occur?",
          options: ["Mutual Exclusion", "Hold and Wait", "Preemption Allowed", "Circular Wait"],
          correctOptionIndex: 2,
          explanation: "Preemption allowed prevents deadlocks; Coffman's condition is 'No Preemption'."
        },
        {
          questionText: "What is thrashing in an operating system's virtual memory management?",
          options: [
            "High CPU clock speed during compute tasks",
            "Excessive paging activity where the system spends more time swapping pages than executing code",
            "Deadlock caused by multiple threads accessing cache",
            "Failure of the hard drive mechanical head"
          ],
          correctOptionIndex: 1,
          explanation: "Thrashing occurs when the working sets of active processes exceed available physical memory, causing constant page faults."
        },
        {
          questionText: "What is the primary architectural difference between a process and a thread?",
          options: [
            "Threads have independent virtual memory address spaces",
            "Threads of the same process share code segment, data segment, and open file descriptors",
            "Processes share stack space with each other",
            "A thread cannot be scheduled independently by the OS kernel"
          ],
          correctOptionIndex: 1,
          explanation: "Threads within the same process share memory space (heap/data/code), while processes maintain isolated virtual memory addresses."
        },
        {
          questionText: "In Unix-like systems, which system call creates a new child process by duplicating the calling process?",
          options: ["exec()", "fork()", "clone()", "pthread_create()"],
          correctOptionIndex: 1,
          explanation: "fork() creates an exact duplicate child process with separate copy-on-write memory."
        },
        {
          questionText: "Which CPU scheduling algorithm guarantees minimal average waiting time for a set of stationary processes if burst times are known in advance?",
          options: ["Round Robin (RR)", "First-Come, First-Served (FCFS)", "Shortest Job First (SJF)", "Priority Scheduling"],
          correctOptionIndex: 2,
          explanation: "Shortest Job First (SJF) is mathematically optimal with respect to minimum average waiting time."
        }
      ]
    },

    // 2. DBMS
    {
      topicSlug: "dbms-acid-indexing-transactions",
      title: "DBMS Internals & Transactions Assessment",
      description: "Assessment on ACID guarantees, B+ Tree indexing mechanisms, and transaction isolation levels.",
      timeLimitMinutes: 5,
      passingPercentage: 70,
      questions: [
        {
          questionText: "Which SQL transaction isolation level prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
          options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
          correctOptionIndex: 3,
          explanation: "Serializable is the highest isolation level and prevents all three standard concurrency phenomena."
        },
        {
          questionText: "Why do relational database engines utilize B+ Trees instead of standard B-Trees for disk-based indexes?",
          options: [
            "B+ Trees store full row records inside internal nodes",
            "Leaf nodes in B+ Trees are linked sequentially, allowing efficient range queries with sequential I/O",
            "B+ Trees have higher tree height, requiring fewer node splits",
            "B+ Trees do not require disk seeks"
          ],
          correctOptionIndex: 1,
          explanation: "B+ Tree leaf nodes form a doubly linked list, enabling fast sequential range scans after a single binary lookup."
        },
        {
          questionText: "What does the 'Durability' property in ACID guarantee?",
          options: [
            "All integrity constraints are verified before commit",
            "Committed transactions will survive subsequent crashes or power outages",
            "Transactions execute concurrently without interference",
            "Operations are all-or-nothing"
          ],
          correctOptionIndex: 1,
          explanation: "Durability guarantees committed transactions are safely persisted (typically via Write-Ahead Logging/WAL)."
        }
      ]
    },

    // 3. Quantitative Aptitude
    {
      topicSlug: "quantitative-aptitude-speed-distance-work",
      title: "Quantitative Placement Assessment: Speed, Work & Interest",
      description: "Placement preliminary elimination test covering speed-distance-time, relative velocity, work-rate efficiency, and simple interest.",
      timeLimitMinutes: 5,
      passingPercentage: 70,
      questions: [
        {
          questionText: "A train traveling at 72 km/h crosses a 200m long platform in 20 seconds. What is the length of the train?",
          options: ["150 meters", "200 meters", "250 meters", "300 meters"],
          correctOptionIndex: 1,
          explanation: "Speed = 72 * (5/18) = 20 m/s. Total distance = 20 * 20 = 400m. Train length = 400m - 200m = 200 meters."
        },
        {
          questionText: "Worker A completes a task in 12 days, while Worker B completes the same task in 24 days. Working together, how many days will they take?",
          options: ["6 days", "8 days", "10 days", "16 days"],
          correctOptionIndex: 1,
          explanation: "Combined rate = 1/12 + 1/24 = 3/24 = 1/8. Time taken = 8 days."
        },
        {
          questionText: "If a principal doubles itself in 5 years under simple interest, what is the annual interest rate?",
          options: ["10%", "15%", "20%", "25%"],
          correctOptionIndex: 2,
          explanation: "Simple Interest = Principal -> P = (P * R * 5) / 100 -> R = 100 / 5 = 20%."
        }
      ]
    }
  ];

  for (const qDef of quizDefinitions) {
    // 1. Locate topic by slug
    const topicRes = await pool.query("SELECT id, name FROM topics WHERE slug = $1", [qDef.topicSlug]);
    if (topicRes.rows.length === 0) {
      console.warn(`⚠️ Topic with slug '${qDef.topicSlug}' not found. Skipping quiz.`);
      continue;
    }
    const topicId = topicRes.rows[0].id;

    // 2. Upsert quiz
    let quizRes = await pool.query(
      `INSERT INTO quizzes (topic_id, title, description, time_limit_minutes, passing_percentage)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (topic_id) 
       DO UPDATE SET 
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         time_limit_minutes = EXCLUDED.time_limit_minutes,
         passing_percentage = EXCLUDED.passing_percentage
       RETURNING id;`,
      [topicId, qDef.title, qDef.description, qDef.timeLimitMinutes, qDef.passingPercentage]
    );
    const quizId = quizRes.rows[0].id;

    // 3. Clear existing questions for clean idempotent reload
    await pool.query("DELETE FROM quiz_questions WHERE quiz_id = $1", [quizId]);

    // 4. Insert questions
    for (const q of qDef.questions) {
      await pool.query(
        `INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option_index, explanation)
         VALUES ($1, $2, $3::jsonb, $4, $5)`,
        [quizId, q.questionText, JSON.stringify(q.options), q.correctOptionIndex, q.explanation]
      );
    }

    console.log(`✅ Seeded Quiz for topic '${topicRes.rows[0].name}' (Quiz ID: ${quizId}, Questions: ${qDef.questions.length})`);
  }

  console.log("🎉 Quiz Seeding Completed Successfully!");
};

if (require.main === module) {
  seedQuizzes()
    .then(() => pool.end())
    .catch((err) => {
      console.error("Quiz seeding failed:", err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedQuizzes };
