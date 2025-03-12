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
       

        const formattedOptions = Array.isArray(options) ? JSON.stringify(options) : "[]";

        const result = await pool.query(
            `INSERT INTO questions (exam_id, question_text, options, correct_option) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [examId, question_text, formattedOptions, correct_option]
        );

        return {
            ...result.rows[0],
            options: JSON.parse(result.rows[0].options) // Ensure it's returned as an array
        };
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
            `SELECT question_id, exam_id, question_text, options, correct_option 
             FROM questions 
             WHERE exam_id = $1`, 
            [exam_id]
        );

        // ✅ Parse JSON options safely
        return result.rows.map(row => ({
            ...row,
            options: row.options ? JSON.parse(row.options) : [] // Ensure options is always an array
        }));
    } catch (error) {
        console.error("❌ Database error (getQuestionsByExamId):", error);
        throw new Error(error.message || "Database error while fetching questions");
    }
};

/**
 * Updates an existing question.
 * @param {number} questionId - The question ID.
 * @param {Object} updates - Fields to update (e.g., question_text, options, correct_option).
 * @returns {Promise<object>} - The updated question.
 */
const updateQuestion = async (questionId, updates) => {
    try {
        const { question_text, options, correct_option } = updates;

        // ✅ Fetch existing question
        const existing = await pool.query(`SELECT * FROM questions WHERE question_id = $1`, [questionId]);
        if (existing.rows.length === 0) {
            throw new Error("Question not found");
        }

        // ✅ Merge existing values with new updates
        const newQuestionText = question_text ?? existing.rows[0].question_text;
        const newOptions = options ? JSON.stringify(options) : existing.rows[0].options;
        const newCorrectOption = correct_option ?? existing.rows[0].correct_option;

        // ✅ Ensure options is an array if updating
        if (options && !Array.isArray(options)) {
            throw new Error("Invalid format: `options` must be an array.");
        }

        // ✅ Validate correct_option index if provided
        if (correct_option !== undefined && (correct_option < 0 || correct_option >= JSON.parse(newOptions).length)) {
            throw new Error("Invalid `correct_option`: Must be a valid index within options array.");
        }

        // ✅ Update the question in the database
        const result = await pool.query(
            `UPDATE questions 
             SET question_text = $1, options = $2, correct_option = $3 
             WHERE question_id = $4 
             RETURNING *`,
            [newQuestionText, newOptions, newCorrectOption, questionId]
        );

        return{
            ...result.rows[0],
            options: JSON.parse(result.rows[0].options) // Ensure options are returned as an array
        };
    } catch (error) {
        console.error("❌ Database error (updateQuestion):", error);
        throw new Error(error.message || "Database error while updating question");
    }
};

export { createQuestion, getQuestionsByExamId, updateQuestion };
