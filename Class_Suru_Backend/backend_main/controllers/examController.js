import { 
  createExam as createExamModel, 
  getExamById as getExamByIdModel, 
  updateExam as updateExamModel ,
  deleteExam as deleteExamModel,
  getExamBySubjectAndType as getExamBySubjectAndTypeModel
} from '../models/examModel.js';

/**
* Controller to create a new exam.
*/
const createExam = async (req, res) => {
  try {
      const { title, type, exam_description, exam_duration, exam_total_marks, exam_subject } = req.body;

      // Validate request body
      if (!title || !type || !exam_description || !exam_duration || !exam_total_marks || !exam_subject || !exam_subject) {
          return res.status(400).json({ success: false, message: "All fields are required" });
      }

      // Create exam in the database
      const exam = await createExamModel(title, type, exam_duration, exam_total_marks, exam_subject,exam_description);

      res.status(201).json({ success: true, message: "Exam created successfully", exam });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

/**
* Controller to fetch an exam by its ID.
*/
const getExamById = async (req, res) => {
  try {
      const { examId } = req.params;

      // Fetch exam from the database
      const exam = await getExamByIdModel(examId);

      if (!exam) {
          return res.status(404).json({ success: false, message: "Exam not found" });
      }

      res.status(200).json({ success: true, exam });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

/**
* Controller to update exam details.
*/
const updateExam = async (req, res) => {
  try {
      const { examId } = req.params;
      const updates = req.body;

      // Ensure there are fields to update
      if (Object.keys(updates).length === 0) {
          return res.status(400).json({ success: false, message: "No fields provided for update" });
      }

      // Update exam in the database
      const updatedExam = await updateExamModel(examId, updates);

      if (!updatedExam) {
          return res.status(404).json({ success: false, message: "Exam not found" });
      }

      res.status(200).json({ success: true, message: "Exam updated successfully", updatedExam });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExam = async (req, res) => {
  try {
      const { examId } = req.params;

      // Delete exam from the database
      const deletedExam = await deleteExamModel(examId);

      if (!deletedExam) {
          return res.status(404).json({ success: false, message: "Exam not found" });
      }

      res.status(200).json({ success: true, message: "Exam deleted successfully", deletedExam });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
}

const getExamBySubjectAndType = async (req, res) => {
    try {
        const { subject, type } = req.params;
    
        // Fetch exam from the database
        const exam = await getExamBySubjectAndTypeModel(subject, type);
    
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }
    
        res.status(200).json({ success: true, exam });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    };

// Export controllers
export { createExam, getExamById, updateExam, deleteExam, getExamBySubjectAndType };
