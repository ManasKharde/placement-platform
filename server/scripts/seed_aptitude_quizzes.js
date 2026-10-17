const pool = require("../config/db");

const seedAptitudeQuizzes = async () => {
  console.log("🌱 Starting Aptitude Quizzes Seeding...");

  try {
    const topicsRes = await pool.query(`
      SELECT t.id, t.name, t.slug, t.description, t.practice_items 
      FROM topics t 
      JOIN track_topics tt ON t.id = tt.topic_id 
      JOIN tracks tr ON tt.track_id = tr.id 
      WHERE tr.slug = 'aptitude' OR t.slug LIKE 'aptitude-%'
    `);

    console.log(`Found ${topicsRes.rows.length} Aptitude topics to verify/seed.`);

    for (const topic of topicsRes.rows) {
      const practiceItems = Array.isArray(topic.practice_items) ? topic.practice_items : [];
      const mcqs = practiceItems.filter(
        (item) => item && (item.type === "mcq" || Array.isArray(item.options))
      );

      if (mcqs.length === 0) continue;

      // 1. Upsert quiz for topic
      const quizRes = await pool.query(
        `INSERT INTO quizzes (topic_id, title, description, time_limit_minutes, passing_percentage)
         VALUES ($1, $2, $3, 20, 70)
         ON CONFLICT (topic_id) 
         DO UPDATE SET 
           title = EXCLUDED.title,
           passing_percentage = 70
         RETURNING id;`,
        [
          topic.id,
          `${topic.name} Practical Evaluation`,
          topic.description || "Timed placement screening evaluation for quantitative aptitude.",
        ]
      );

      const quizId = quizRes.rows[0].id;

      // 2. Clear existing questions for clean idempotent reload
      await pool.query("DELETE FROM quiz_questions WHERE quiz_id = $1", [quizId]);

      // 3. Insert questions
      for (const item of mcqs) {
        let correctIdx = 0;
        if (typeof item.correct_option_index === "number") {
          correctIdx = item.correct_option_index;
        } else if (item.correctAnswer) {
          const letter = String(item.correctAnswer).trim().toUpperCase();
          correctIdx = ["A", "B", "C", "D"].indexOf(letter);
          if (correctIdx === -1) correctIdx = 0;
        } else if (Array.isArray(item.options)) {
          const foundIdx = item.options.findIndex(
            (opt) => (typeof opt === "object" && opt && (opt.isCorrect || opt.correct))
          );
          if (foundIdx !== -1) correctIdx = foundIdx;
        }

        const optionsArray = Array.isArray(item.options)
          ? item.options.map((opt) =>
              typeof opt === "object" && opt !== null ? opt.text || opt.label || JSON.stringify(opt) : String(opt)
            )
          : [];

        await pool.query(
          `INSERT INTO quiz_questions (quiz_id, question_text, options, correct_option_index, explanation)
           VALUES ($1, $2, $3::jsonb, $4, $5)`,
          [
            quizId,
            item.question || item.title || "Aptitude Problem",
            JSON.stringify(optionsArray),
            correctIdx,
            item.explanation || "",
          ]
        );
      }
    }

    console.log("🎉 Aptitude Quizzes Seeding Completed Successfully!");
  } catch (err) {
    console.error("Error seeding Aptitude quizzes:", err);
  }
};

if (require.main === module) {
  seedAptitudeQuizzes()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err);
      pool.end();
      process.exit(1);
    });
}

module.exports = { seedAptitudeQuizzes };
