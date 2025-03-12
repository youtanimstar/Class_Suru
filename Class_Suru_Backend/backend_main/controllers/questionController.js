import { 
  createQuestion as createQuestionModel, 
  getQuestionsByExamId as getQuestionByIdModel,
  getQuestionByQuestionId as getQuestionByQuestionIdModel,
  updateQuestion as updateQuestionModel,
  deleteQuestion as deleteQuestionModel
} from '../models/questionModel.js';

/**
* Controller to create a new question
*/
const createQuestion = async (req, res) => {
try {
  const { exam_id, question_text,question_img_url, option_1,option_2,option_3,option_4,correct_marks, correct_option,wrong_marks  } = req.body;

  // ✅ Validate input fields
  if (!exam_id || !question_text || !question_img_url || !option_1 || !option_2 || !option_3 || !option_4 || !correct_option || !correct_marks || !wrong_marks) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // // ✅ Ensure options is an array
  // if (!Array.isArray(options)) {
  //   return res.status(400).json({ success: false, message: '`options` must be an array' });
  // }

  await createQuestionModel(exam_id, question_text,question_img_url, option_1,option_2,option_3,option_4,correct_marks, correct_option,wrong_marks);

  res.status(201).json({ success: true, message: "Question added successfully"});
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

const getQuestionById = async (req, res) => {
try {
  const { question_id } = req.params;

  if (!question_id) {
    return res.status(400).json({ success: false, message: 'Question ID is required' });
  }

  const question = await getQuestionByQuestionIdModel(question_id);
  res.status(200).json({ success: true, question });
}
catch (error) {
  console.error("Error fetching question:", error);
  res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
}
};

const updateQuestion = async (req, res) => {
try {
  const { question_id } = req.params;
  const updates = req.body;

  // ✅ Validate input fields
  if (!updates) {
    return res.status(400).json({ success: false, message: 'some update field required' });
  }

  // // ✅ Ensure options is an array
  // if (!Array.isArray(options)) {
  //   return res.status(400).json({ success: false, message: '`options` must be an array' });
  // }

  await updateQuestionModel(question_id, updates);

  res.status(200).json({ success: true, message: "Question updated successfully"});
}
catch (error) {
  console.error("Error updating question:", error);
  res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
}
};

const deleteQuestion = async (req, res) => {
try {
  const { question_id } = req.params;

  if (!question_id) {
    return res.status(400).json({ success: false, message: 'Question ID is required' });
  }

  await deleteQuestionModel(question_id);
  res.status(200).json({ success: true, message: "Question deleted successfully"});
}
catch (error) {
  console.error("Error deleting question:", error);
  res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
}
};

export { createQuestion, getQuestionsByExamId, getQuestionById, updateQuestion, deleteQuestion };