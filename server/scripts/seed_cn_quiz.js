const pool = require("../config/db");

const seedCnQuiz = async () => {
  console.log("🌱 Starting Computer Networks Assessment Seeding...");

  // Locate the Computer Networks topic
  const topicRes = await pool.query(
    `SELECT id, name, slug FROM topics 
     WHERE slug = 'networks-tcp-http-websockets-dns' 
        OR name ILIKE '%Computer Networks%TCP%' 
     ORDER BY id ASC 
     LIMIT 1`
  );

  if (topicRes.rows.length === 0) {
    console.warn("⚠️ Computer Networks topic not found in database. Skipping CN quiz seeding.");
    return null;
  }

  const topic = topicRes.rows[0];
  console.log(`Found Topic [ID: ${topic.id}]: "${topic.name}" (${topic.slug})`);

  const quizTitle = "Computer Networks & Web Protocols Assessment";
  const quizDescription = "Assessment on the TCP 3-way handshake, HTTP/1.1 vs HTTP/2 vs HTTP/3 architectures, DNS hierarchical lookups, and WebSockets.";
  const timeLimitMinutes = 5;
  const passingPercentage = 70;

  // Upsert quiz idempotently
  const quizRes = await pool.query(
    `INSERT INTO quizzes (topic_id, title, description, time_limit_minutes, passing_percentage)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (topic_id)
     DO UPDATE SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       time_limit_minutes = EXCLUDED.time_limit_minutes,
       passing_percentage = EXCLUDED.passing_percentage
     RETURNING id;`,
    [topic.id, quizTitle, quizDescription, timeLimitMinutes, passingPercentage]
  );

  const quizId = quizRes.rows[0].id;

  // Clear existing questions for clean idempotent reload
  await pool.query("DELETE FROM quiz_questions WHERE quiz_id = $1", [quizId]);

  const questions = [
    {
      questionText: "During the standard TCP 3-way handshake to establish a connection, what is the exact sequence of packets exchanged?",
      options: ["SYN -> ACK -> SYN-ACK", "SYN -> SYN-ACK -> ACK", "ACK -> SYN -> SYN-ACK", "SYN-ACK -> SYN -> ACK"],
      correctOptionIndex: 1,
      explanation: "The client sends a SYN packet, the server responds with SYN-ACK, and the client acknowledges with ACK to establish a full-duplex connection."
    },
    {
      questionText: "What core limitation of HTTP/1.1 does HTTP/2 solve through binary framing and stream multiplexing?",
      options: [
        "Lack of SSL/TLS transport security",
        "Head-of-Line (HoL) blocking at the application/HTTP layer",
        "Inability to send POST request bodies",
        "Single packet MTU size limitations"
      ],
      correctOptionIndex: 1,
      explanation: "HTTP/2 multiplexes multiple bidirectional request/response streams over a single TCP connection, eliminating application-layer Head-of-Line blocking."
    },
    {
      questionText: "Why does HTTP/3 switch the underlying transport protocol from TCP to QUIC (over UDP)?",
      options: [
        "UDP packets are always encrypted by hardware",
        "To eliminate TCP-level Head-of-Line blocking when individual packets are dropped on lossy connections",
        "Because UDP guarantees in-order delivery natively without acknowledgments",
        "To bypass corporate firewalls and NAT gateways"
      ],
      correctOptionIndex: 1,
      explanation: "In HTTP/2 over TCP, a single dropped packet stalls all multiplexed streams. HTTP/3 uses QUIC (UDP) so stream packet loss affects only the degraded stream."
    },
    {
      questionText: "In DNS resolution, what is the correct hierarchical lookup order if a domain is not present in the local OS/browser cache?",
      options: [
        "Authoritative Name Server -> TLD Server -> Root Server -> Recursive Resolver",
        "Recursive Resolver -> Root Name Server -> TLD Name Server -> Authoritative Name Server",
        "TLD Server -> Recursive Resolver -> Root Server -> Authoritative Server",
        "Root Name Server -> Authoritative Server -> TLD Server -> Browser Cache"
      ],
      correctOptionIndex: 1,
      explanation: "The recursive resolver queries the Root Name Server (.) -> TLD Server (.com) -> Authoritative Name Server (domain.com) to resolve the IP."
    },
    {
      questionText: "When should an engineering architecture choose WebSockets over Server-Sent Events (SSE)?",
      options: [
        "When only server-to-client unidirectional updates are required (e.g., stock ticker)",
        "When full-duplex, low-latency, bidirectional communication is required (e.g., collaborative editing, multiplayer chat)",
        "When native automatic reconnection and HTTP/2 multiplexing are critical",
        "When payload data is strictly UTF-8 text"
      ],
      correctOptionIndex: 1,
      explanation: "SSE is unidirectional (server -> client) and HTTP-based. WebSockets establish an upgraded full-duplex TCP socket enabling bidirectional data transfer."
    }
  ];

  for (const q of questions) {
    await pool.query(
      `INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option_index, explanation)
       VALUES ($1, $2, $3::jsonb, $4, $5)`,
      [quizId, q.questionText, JSON.stringify(q.options), q.correctOptionIndex, q.explanation]
    );
  }

  console.log(`✅ Successfully seeded CN Assessment (Quiz ID: ${quizId}, Topic ID: ${topic.id}, 5 Questions)`);
  return { topicId: topic.id, quizId, count: questions.length };
};

if (require.main === module) {
  seedCnQuiz()
    .then(() => pool.end())
    .catch((err) => {
      console.error("CN Quiz seeding failed:", err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedCnQuiz };
