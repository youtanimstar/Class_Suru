import {pool} from "../models/userModel.js";  // Ensure correct database connection import

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

const getExamById = async (examId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM exams WHERE id = $1',  // Ensure correct column name (id instead of exam_id)
            [examId]
        );
        return result.rows[0] || null;  // Return null if no exam is found
    } catch (error) {
        console.error("Database error (getExamById):", error);
        throw new Error("Database error");
    }
};

export { createExam, getExamById };
