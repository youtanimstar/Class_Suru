import { 
  createQuestion as createQuestionModel, 
  getQuestionsByExamId as getQuestionsByExamIdModel,
  updateQuestion as updateQuestionModel
} from '../models/questionModel.js';

/**
* Controller to create a new question
*/
const createQuestion = async (req, res) => {
  try {
      const { examId, question_text, options, correct_option } = req.body;

      // ✅ Validate required fields
      if (!examId || !question_text || !options || correct_option === undefined) {
          return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      // ✅ Ensure options is an array
      if (!Array.isArray(options)) {
          return res.status(400).json({ success: false, message: '`options` must be an array' });
      }

      // ✅ Validate correct_option index
      if (correct_option < 0 || correct_option >= options.length) {
          return res.status(400).json({ success: false, message: '`correct_option` must be a valid index in options array' });
      }

      const question = await createQuestionModel(Number(examId), question_text, options, correct_option);

      res.status(201).json({ success: true, message: "Question added successfully", question });
  } catch (error) {
      console.error("❌ Error creating question:", error);
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

/**
* Controller to fetch questions by Exam ID
*/
const getQuestionsByExamId = async (req, res) => {
  try {
      const { exam_id } = req.params;

      if (!exam_id) {
          return res.status(400).json({ success: false, message: 'Exam ID is required' });
      }

      const questions = await getQuestionsByExamIdModel(Number(exam_id));
      res.status(200).json({ success: true, questions });
  } catch (error) {
      console.error("❌ Error fetching questions:", error);
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

/**
* Controller to update a question by ID
*/
const updateQuestion = async (req, res) => {
  try {
      const { questionId } = req.params;
      const updates = req.body;

      if (!questionId || Object.keys(updates).length === 0) {
          return res.status(400).json({ success: false, message: 'Question ID and update fields are required' });
      }

      // ✅ Ensure options is an array if provided
      if (updates.options && !Array.isArray(updates.options)) {
          return res.status(400).json({ success: false, message: '`options` must be an array' });
      }

      // ✅ Validate correct_option index if provided
      if (updates.correct_option !== undefined) {
          if (!updates.options) {
              return res.status(400).json({ success: false, message: 'Options array is required when updating correct_option' });
          }
          if (updates.correct_option < 0 || updates.correct_option >= updates.options.length) {
              return res.status(400).json({ success: false, message: '`correct_option` must be a valid index in options array' });
          }
      }

      const updatedQuestion = await updateQuestionModel(Number(questionId), updates);
      res.status(200).json({ success: true, message: "Question updated successfully", question: updatedQuestion });
  } catch (error) {
      console.error("❌ Error updating question:", error);
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export { createQuestion, getQuestionsByExamId, updateQuestion };
