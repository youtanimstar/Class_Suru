import { pool } from "../models/userModel.js";
import { insertResult } from "./resultModel.js";

const submitAnswer = async (examId, userId, questionId, selectedOption) => {
  const questionRes = await pool.query(
    "SELECT correct_option FROM questions WHERE question_id = $1",
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
};

const submitExamModel = async (examId, userId, answers) => {
  try {
    // entry the row in result table
    const result = await pool.query(
      `INSERT INTO results (exam_id, user_id) VALUES ($1, $2) RETURNING *`,
      [examId, userId]
    );
    if (result.rowCount === 0) {
      throw new Error("Failed to insert result");
    }
    const result_id = result.rows[0].result_id; // Get the result_id

    const answer = [];

    answers.map((ele) => {
      const { id, selected_option, status } = ele;
      // console.log("ele", ele);

      if (status === 2 || status === 4) {
        if (selected_option !== -1) {
          answer.push({
            result_id,
            question_id: id,
            selected_option,
          });
        }
      }
    });

    // console.log(answer);

    if(answer.length === 0) {
      return {
        result_id,
        message: "Answers submitted successfully",
      };
    }

    // Insert into answers table
    const insertPromise = await pool.query(
      `INSERT INTO answers (result_id, question_id, selected_option)
       VALUES ${answer.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(", ")}`,
      answer.flatMap((ans) => [ans.result_id, ans.question_id, ans.selected_option])
    );

    if(insertPromise.rowCount === 0) {
      throw new Error("Failed to insert answers");
    }

    // You can return the result_id or any other information if needed
    return {
      result_id,
      message: "Answers submitted successfully",
    };
  } catch (error) {
    console.error("Error in submitExamModel:", error.message);
    throw new Error("Internal server error");
  }
};

const getAnswerByResultIdModel = async (result_id) =>{
  // get the result info from result_id
  const data = await pool.query(`SELECT * FROM results WHERE result_id = $1`,[result_id]);
  if(data.rowCount === 0){
    throw new Error("Result not found");
  }
  
  const exam_id = data.rows[0].exam_id;
  const user_id = data.rows[0].user_id;
  
  // get the exam info from exam_id
  const examData = await pool.query(`SELECT * FROM exams WHERE id = $1`,[exam_id]);
  if(examData.rowCount === 0){
    throw new Error("Exam not found");
  }
  
  const total_marks = examData.rows[0].exam_total_marks;
  let score = 0;
  let total_correct_answers = 0;
  let total_incorrect_answers = 0;
  let total_unattempted_questions = 0;
  let accuracy = 0;
   

  // get the question info from exam_id
  const questionsData = await pool.query(`SELECT * FROM questions WHERE exam_id = $1`,[exam_id]);
  if(questionsData.rowCount === 0){
    throw new Error("Questions not found");
  }

  const total_questions = questionsData.rowCount;


  // get the answers info from result_id
  const answersData = await pool.query(`SELECT * FROM answers WHERE result_id = $1`,[result_id]);
  if(answersData.rowCount === 0){
    return {
      result_id,
      exam_id,
      user_id,
      total_questions,
      total_correct_answers,
      total_incorrect_answers: total_questions,
      total_unattempted_questions,
      score,
      accuracy,
      total_marks,
    };
  }

  // console.log("resultData",data.rows);
  // console.log("examData",examData.rows);
  // console.log("questionsData",questionsData.rows);
  // console.log("answersData",answersData.rows);


  // calculate total score
  answersData.rows.map((ele) => {
    const { selected_option, question_id } = ele;
    const question = questionsData.rows.find((q) => q.question_id === question_id);
    if (question) {
      if (Number(question.correct_option) === Number(selected_option)) {
        score += Number(question.correct_marks);
        total_correct_answers++;
      } else {
        score -= Number(question.wrong_marks);
        total_incorrect_answers++;
      }
    }
  });

  total_unattempted_questions = total_questions - (total_correct_answers + total_incorrect_answers);

  if (total_questions > 0) {
    accuracy = (total_correct_answers / (total_correct_answers + total_incorrect_answers)) * 100;
  }

  return {
    result_id,
    exam_id,
    user_id,
    total_questions,
    total_correct_answers,
    total_incorrect_answers,
    total_unattempted_questions,
    score,
    accuracy,
    total_marks,
  };
}

export { submitAnswer, getAnswerByQuestionId, getAnswerById, submitExamModel, getAnswerByResultIdModel }; // ✅ Correct export for other modules to use
