import { pool } from "../models/userModel.js";

/**
 * Creates a new question for a given exam.
 * @param {number} examId - The exam ID.
 * @param {string} question_text - The question text.
 * @param {Array} options - The list of options.
 * @param {number} correct_option - The correct option index.
 * @returns {Promise<object>} - The created question.
 */
const createQuestion = async (exam_id, question_text,question_img_url, option_1,option_2,option_3,option_4,correct_marks, correct_option,wrong_marks,question_ans, question_ans_img) => {
    try {
        // Ensure options is stored as a JSON string
        // const formattedOptions = Array.isArray(options) ? JSON.stringify(options) : "[]";

        const result = await pool.query(
            `INSERT INTO questions (exam_id, question_text,question_img_url, option_1,option_2,option_3,option_4,correct_marks, correct_option,wrong_marks,question_ans, question_ans_img) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING *`,
            [exam_id, question_text,question_img_url, option_1,option_2,option_3,option_4,correct_marks, correct_option,wrong_marks,question_ans, question_ans_img]
        );

       if(!result) throw new Error("Failed to create question");

        // return {
        //     ...result.rows[0]
        //     // options: JSON.parse(result.rows[0].options) // Ensure it's returned as an array
        // };
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
            `SELECT * 
             FROM questions 
             WHERE exam_id = $1 
             ORDER BY question_id`, 
            [exam_id]
        );

        // Parse JSON options safely
        return result.rows.map(row => ({
            ...row,
            // options: (typeof row.options === "string" && row.options.trim() !== "") 
            //     ? JSON.parse(row.options) 
            //     : [] // Return empty array if options are invalid or NULL
        }));
    } catch (error) {
        console.error("Database error (getQuestionsByExamId):", error);
        throw new Error(error.message || "Database error while fetching questions");
    }
};

const getQuestionByQuestionId = async (question_id) => {
    try {
        const result = await pool.query(
            `SELECT * 
             FROM questions 
             WHERE question_id = $1`, 
            [question_id]
        );

        // Parse JSON options safely
        return result.rows.map(row => ({
            ...row,
            // options: (typeof row.options === "string" && row.options.trim() !== "") 
            //     ? JSON.parse(row.options) 
            //     : [] // Return empty array if options are invalid or NULL
        }));
    } catch (error) {
        console.error("Database error (getQuestionById):", error);
        throw new Error(error.message || "Database error while fetching question");
    }
}


const updateQuestion = async (question_id, updates) => {
    try {
        // ✅ Validate input fields
        if (!updates) {
            throw new Error("Some update field required");
        }

        const fields = Object.keys(updates);
        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        const values = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");
        const query = `UPDATE questions SET ${values} WHERE question_id = $1 RETURNING *`;

        const result = await pool.query(query, [question_id, ...fields.map(field => updates[field])]);

        return result.rows[0] || null;
    } catch (error) {
        console.error("Database error (updateQuestion):", error);
        throw new Error(error.message || "Database error while updating question");
    }
}

const deleteQuestion = async (question_id) => {
    try {
        const result = await pool.query(
            `DELETE FROM questions 
             WHERE question_id = $1 
             RETURNING *`,
            [question_id]
        );

        return result.rows[0] || null;
    } catch (error) {
        console.error("Database error (deleteQuestion):", error);
        throw new Error(error.message || "Database error while deleting question");
    }
}


export { createQuestion, getQuestionsByExamId, getQuestionByQuestionId, updateQuestion, deleteQuestion };