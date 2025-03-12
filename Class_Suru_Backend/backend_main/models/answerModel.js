import { pool } from '../models/userModel.js';
import { insertResult } from './resultModel.js';


 
   const submitAnswer = async (examId, userId, questionId, selectedOption) => {
    const questionRes = await pool.query(
      'SELECT correct_option FROM questions WHERE question_id = $1',
      [questionId]
    );

    if (questionRes.rows.length === 0) throw new Error("Question not found");

    const isCorrect = selectedOption === questionRes.rows[0].correct_option;

    const answerRes = await pool.query(
      `INSERT INTO answers (exam_id, user_id, question_id, selected_option, is_correct) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [examId, userId, questionId, selectedOption, isCorrect]
    );

    const answerId = answerRes.rows[0].answer_id;
     await insertResult(answerId, examId, userId, isCorrect);

    return answerRes.rows[0];
  };

  const getAnswerByQuestionId = async (questionId) => {
    const result = await pool.query(
      `SELECT * FROM answers WHERE question_id = $1`,
      [questionId]
    );
    return result.rows;
  };

   const getAnswerById = async (answerId) => {
    const result = await pool.query(
      `SELECT * FROM answers WHERE answer_id = $1`,
      [answerId]
    );
    return result.rows[0];
  }


export { submitAnswer, getAnswerByQuestionId, getAnswerById }; // ✅ Correct export for other modules to use
