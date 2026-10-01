const pool = require("../config/db");

const migrateQuizzes = async () => {
  console.log("🚀 Starting Quiz Engine Database Migration...");

  // 1. Quizzes table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      topic_id INT REFERENCES topics(id) ON DELETE CASCADE UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      time_limit_minutes INT DEFAULT 5,
      passing_percentage INT DEFAULT 70,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ Verified 'quizzes' table.");

  // 2. Quiz Questions table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id SERIAL PRIMARY KEY,
      quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_option_index INT NOT NULL,
      explanation TEXT NOT NULL
    );
  `);
  console.log("✅ Verified 'quiz_questions' table.");

  // 3. Quiz Attempts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
      score INT NOT NULL,
      total_questions INT NOT NULL,
      percentage INT NOT NULL,
      passed BOOLEAN NOT NULL,
      user_answers JSONB,
      attempted_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ Verified 'quiz_attempts' table.");

  // Indexes for query performance
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_quizzes_topic_id ON quizzes(topic_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
  `);
  console.log("✅ Verified quiz indexes.");
  console.log("🎉 Quiz Engine Migration Completed Successfully!");
};

if (require.main === module) {
  migrateQuizzes()
    .then(() => pool.end())
    .catch((err) => {
      console.error("Quiz migration failed:", err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { migrateQuizzes };
