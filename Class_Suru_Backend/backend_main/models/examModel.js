import { pool } from "../models/userModel.js";

/**
 * Creates a new exam.
 */
const createExam = async (title, type, exam_duration, exam_total_marks, exam_subject) => {
    try {
        const result = await pool.query(
            `INSERT INTO exams (title, type, exam_duration, exam_total_marks, exam_subject) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, type, exam_duration, exam_total_marks, exam_subject]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Database error (createExam):", error);
        throw new Error("Database error");
    }
};

/**
 * Fetches an exam by its ID.
 */
const getExamById = async (examId) => {
    try {
        const result = await pool.query(
            "SELECT * FROM exams WHERE id = $1",
            [examId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error("Database error (getExamById):", error);
        throw new Error("Database error");
    }
};

/**
 * Updates an exam's details.
 * Supports partial updates (only updates provided fields).
 */
const updateExam = async (examId, updates) => {
    try {
        // Build dynamic query based on provided fields
        const fields = Object.keys(updates);
        if (fields.length === 0) {
            throw new Error("No fields to update");
        }

        const values = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");
        const query = `UPDATE exams SET ${values} WHERE id = $1 RETURNING *`;

        const result = await pool.query(query, [examId, ...fields.map(field => updates[field])]);

        return result.rows[0] || null;
    } catch (error) {
        console.error("Database error (updateExam):", error);
        throw new Error("Database error while updating exam");
    }
};

const deleteExam = async (examId) => {
    try {
        const result = await pool.query(
            "DELETE FROM exams WHERE id = $1 RETURNING *",
            [examId]
        );
        await pool.query(
            "DELETE FROM questions WHERE exam_id = $1",
            [examId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error("Database error (deleteExam):", error);
        throw new Error("Database error while deleting exam");
    }
}

const getExamBySubjectAndType = async (subject, type) => {
    try {
        const result = await pool.query(
            "SELECT * FROM exams WHERE exam_subject = $1 AND type = $2 order by id desc",
            [subject, type]
        );
        return result.rows || [];
    } catch (error) {
        console.error("Database error (getExamBySubjectAndType):", error);
        throw new Error("Database error while fetching exam");
    }
}

export { createExam, getExamById, updateExam,deleteExam, getExamBySubjectAndType };
