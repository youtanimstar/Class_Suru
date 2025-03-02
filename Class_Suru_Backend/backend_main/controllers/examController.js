import { createExam as createExamModel, getExamById as getExamByIdModel } from '../models/examModel.js';

const createExam = async (req, res) => {
  try {
    const { title, type, exam_description, exam_duration, exam_total_marks, exam_subject, } = req.body;

    // Validate request body
    if (!title || !type || !exam_description || !exam_duration || !exam_total_marks || !exam_subject) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Call the model function to create the exam
    const exam = await createExamModel(title, type, exam_duration, exam_total_marks, exam_subject);

    res.status(201).json({ success: true, message: "Exam created successfully", exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExamById = async (req, res) => {
  try {
    const { examId } = req.params;

    // Fetch exam from the database
    const exam = await getExamByIdModel(examId);

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export functions properly
export { createExam, getExamById };