import { 
  createQuestion as createQuestionModel, 
  getQuestionsByExamId as getQuestionByIdModel 
} from '../models/questionModel.js';

/**
* Controller to create a new question
*/
const createQuestion = async (req, res) => {
try {
  const { examId, question_text, options, correct_option } = req.body;

  // ✅ Validate input fields
  if (!examId || !question_text || !options || correct_option === undefined) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // ✅ Ensure options is an array
  if (!Array.isArray(options)) {
    return res.status(400).json({ success: false, message: '`options` must be an array' });
  }

  const question = await createQuestionModel(examId, question_text, options, correct_option);

  res.status(201).json({ success: true, message: "Question added successfully", question });
} catch (error) {
  console.error("Error creating question:", error);
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

  const questions = await getQuestionByIdModel(exam_id);
  res.status(200).json({ success: true, questions });
} catch (error) {
  console.error("Error fetching questions:", error);
  res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
}
};

export { createQuestion, getQuestionsByExamId };
