import { pool } from "../models/userModel.js";

/**
 * Creates a new question for a given exam.
 * @param {number} examId - The exam ID.
 * @param {string} question_text - The question text.
 * @param {Array} options - The list of options.
 * @param {number} correct_option - The correct option index.
 * @returns {Promise<object>} - The created question.
 */
const createQuestion = async (examId, question_text, options, correct_option) => {
    try {
        // Ensure options is stored as a JSON string
        const formattedOptions = JSON.stringify(options);

        const result = await pool.query(
            `INSERT INTO questions (exam_id, question_text, options, correct_option) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [examId, question_text, formattedOptions, correct_option]
        );

        return result.rows[0]; // Return inserted question
    } catch (error) {
        console.error("Database error (createQuestion):", error);
        throw new Error(error.message || "Database error while creating question");
    }
};


/**
 * Fetches all questions for a given exam.
 * @param {number} exam_id - The exam ID.
 * @returns {Promise<Array>} - List of questions.
 */
const getQuestionsByExamId = async (exam_id) => {
    try {
        const result = await pool.query(
            `SELECT exam_id, question_text, options, correct_option 
             FROM questions 
             WHERE exam_id = $1`, 
            [exam_id]
        );

        // Parse JSON options safely
        return result.rows.map(row => ({
            ...row,
            options: row.options ? JSON.parse(row.options) : [] // Avoid errors if NULL
        }));
    } catch (error) {
        console.error("Database error (getQuestionsByExamId):", error);
        throw new Error(error.message || "Database error while fetching questions");
    }
};

export { createQuestion, getQuestionsByExamId };
