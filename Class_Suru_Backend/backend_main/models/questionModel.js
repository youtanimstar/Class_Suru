import pool from "../models/userModel.js"  

const createQuestion = async (examId, question_body, correct_option, options) => {
    try {
        const result = await pool.query(
            `INSERT INTO questions (exam_id, question_body, correct_option, options) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [examId, question_body, correct_option, JSON.stringify(options)] 
        );
        return result.rows[0];  
    } catch (error) {
        console.error("Database error (createQuestion):", error);
        throw new Error("Database error");
    }
};

const getQuestionsByExamId = async (examId) => {
    try {
        const result = await pool.query(
            `SELECT id, exam_id, question_body, correct_option, options FROM questions 
             WHERE exam_id = $1`, 
            [examId]
        );
        return result.rows.map(row => ({
            ...row,
            options: JSON.parse(row.options)  // Parse options from JSON string to object
        }));
    } catch (error) {
        console.error("Database error (getQuestionsByExamId):", error);
        throw new Error("Database error");
    }
};

export { createQuestion, getQuestionsByExamId };
