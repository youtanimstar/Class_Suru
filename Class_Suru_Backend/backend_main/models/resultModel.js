import { pool } from '../models/userModel.js'; // ✅ Correct import for PostgreSQL connection

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

 const getResultByAnswerId = async (answerId) => {
    const result = await pool.query(
      `SELECT * FROM results WHERE answer_id = $1`,
      [answerId]
    );

    return result.rows[0];
};

export { insertResult, getUserResult, getResultByAnswerId }; // ✅ Correct export for other modules to use
