const pool = require("../config/db");

// GET /api/topics/:topicId/quiz — Fetch topic quiz without leaking answers
const getTopicQuiz = async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user?.id;

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topic ID format." });
  }

  try {
    // 1. Fetch quiz for the topic
    const quizResult = await pool.query(
      `SELECT id, title, description, time_limit_minutes, passing_percentage
       FROM quizzes
       WHERE topic_id = $1`,
      [topicId]
    );

    if (quizResult.rows.length === 0) {
      return res.status(200).json({
        hasQuiz: false,
        message: "No assessment quiz found for this topic.",
      });
    }

    const quiz = quizResult.rows[0];

    // 2. Fetch quiz questions WITHOUT correct_option_index or explanation (SECURITY GUARD)
    const questionsResult = await pool.query(
      `SELECT id, question_text, options
       FROM quiz_questions
       WHERE quiz_id = $1
       ORDER BY id ASC`,
      [quiz.id]
    );

    // 3. Fetch user's latest attempt if authenticated
    let latestAttempt = null;
    if (userId) {
      const attemptResult = await pool.query(
        `SELECT id, score, total_questions, percentage, passed, attempted_at
         FROM quiz_attempts
         WHERE user_id = $1 AND quiz_id = $2
         ORDER BY attempted_at DESC
         LIMIT 1`,
        [userId, quiz.id]
      );
      if (attemptResult.rows.length > 0) {
        latestAttempt = attemptResult.rows[0];
      }
    }

    return res.status(200).json({
      hasQuiz: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        time_limit_minutes: quiz.time_limit_minutes || 5,
        passing_percentage: quiz.passing_percentage || 70,
      },
      questions: questionsResult.rows,
      latest_attempt: latestAttempt,
    });
  } catch (err) {
    console.error("Error fetching topic quiz:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// POST /api/topics/:topicId/quiz/submit — Evaluate user quiz answers & enforce completion gateway
const submitTopicQuiz = async (req, res) => {
  const { topicId } = req.params;
  const userId = req.user?.id;
  const { answers } = req.body; // Map of { [questionId]: selectedOptionIndex }

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topic ID format." });
  }

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Answers payload must be an object." });
  }

  try {
    // 1. Fetch quiz details
    const quizResult = await pool.query(
      `SELECT id, title, passing_percentage
       FROM quizzes
       WHERE topic_id = $1`,
      [topicId]
    );

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: "Quiz not found for this topic." });
    }

    const quiz = quizResult.rows[0];

    // 2. Fetch all questions with correct answers for server-side evaluation
    const questionsResult = await pool.query(
      `SELECT id, question_text, options, correct_option_index, explanation
       FROM quiz_questions
       WHERE quiz_id = $1
       ORDER BY id ASC`,
      [quiz.id]
    );

    const questions = questionsResult.rows;
    if (questions.length === 0) {
      return res.status(400).json({ error: "No questions configured for this quiz." });
    }

    let score = 0;
    const review = [];

    // 3. Score each question and construct review
    for (let idx = 0; idx < questions.length; idx++) {
      const q = questions[idx];
      let userSelected =
        answers[q.id] !== undefined
          ? answers[q.id]
          : answers[idx] !== undefined
          ? answers[idx]
          : null;

      if (typeof userSelected === "string" && /^[A-D]$/i.test(userSelected.trim())) {
        userSelected = ["A", "B", "C", "D"].indexOf(userSelected.trim().toUpperCase());
      } else if (userSelected !== null && userSelected !== undefined && userSelected !== "") {
        userSelected = Number(userSelected);
      } else {
        userSelected = null;
      }

      const isCorrect =
        userSelected !== null &&
        !isNaN(userSelected) &&
        userSelected === q.correct_option_index;

      if (isCorrect) {
        score++;
      }

      review.push({
        questionId: q.id,
        question_text: q.question_text,
        options: q.options,
        user_selected_index: userSelected,
        correct_option_index: q.correct_option_index,
        is_correct: isCorrect,
        explanation: q.explanation,
      });
    }

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= (quiz.passing_percentage || 70);

    // 4. Save attempt to quiz_attempts
    await pool.query(
      `INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, percentage, passed, user_answers)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)`,
      [userId, quiz.id, score, totalQuestions, percentage, passed, JSON.stringify(answers)]
    );

    // 5. CRITICAL GATEWAY: If passed, mark user topic progress as completed
    if (passed) {
      await pool.query(
        `INSERT INTO user_progress (user_id, topic_id, status, completed_at)
         VALUES ($1, $2, 'completed', NOW())
         ON CONFLICT (user_id, topic_id)
         DO UPDATE SET status = 'completed', completed_at = NOW();`,
        [userId, topicId]
      );
    }

    return res.status(200).json({
      success: true,
      score,
      total_questions: totalQuestions,
      percentage,
      passed,
      passing_percentage: quiz.passing_percentage || 70,
      review,
      message: passed
        ? `Congratulations! Assessment Passed (${percentage}%). Topic marked as completed.`
        : `Assessment Score: ${percentage}%. You need at least ${quiz.passing_percentage}% to complete this topic. Review your answers below and try again.`,
    });
  } catch (err) {
    console.error("Error evaluating quiz submission:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  getTopicQuiz,
  submitTopicQuiz,
};
