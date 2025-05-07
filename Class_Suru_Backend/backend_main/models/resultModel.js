import { pool } from '../models/userModel.js';

// Not used in bulk mode, but can still be useful elsewhere
const insertResult = async (answerId, examId, userId, isCorrect) => {
  const status = isCorrect ? 'Correct' : 'Incorrect';
  const obtainedMarks = isCorrect ? 5 : 0;

  const result = await pool.query(
    `INSERT INTO results (answer_id, exam_id, user_id, status, total_marks, obtained_marks) 
     VALUES ($1, $2, $3, $4, 5, $5) RETURNING *`,
    [answerId, examId, userId, status, obtainedMarks]
  );

  return result.rows[0];
};

// Get result summary (useful for user profile, dashboard)
const getUserResult = async (examId, userId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS total_questions, 
            SUM(CASE WHEN status = 'Correct' THEN 1 ELSE 0 END) AS correct_answers,
            SUM(total_marks) AS total_marks,
            SUM(obtained_marks) AS obtained_marks
     FROM results 
     WHERE exam_id = $1 AND user_id = $2`,
    [examId, userId]
  );

  return result.rows[0];
};

// Utility for checking if answer already has a result entry
const getResultByAnswerId = async (answerId) => {
  const result = await pool.query(
    `SELECT * FROM results WHERE answer_id = $1`,
    [answerId]
  );

  return result.rows[0];
};

// 🔍 Detailed question-level result view (for review screen)
const getResultDetailsByResultId = async (resultId) => {
  const result = await pool.query(
    `SELECT 
        q.question_id,
        q.exam_id,
        q.question_text,
        q.correct_option,
        q.option_1,
        q.option_2,
        q.option_3,
        q.option_4,
        q.correct_marks,
        q.wrong_marks,
        q.question_img_url,
        q.question_ans,
        q.question_ans_img,
        a.selected_option AS user_answer
     FROM results r
     JOIN answers a ON r.result_id = a.result_id
     JOIN questions q ON a.question_id = q.question_id
     WHERE r.result_id = $1`,
    [resultId]
  );

  return result.rows;
};

export {
  insertResult,
  getUserResult,
  getResultByAnswerId,
  getResultDetailsByResultId
};
