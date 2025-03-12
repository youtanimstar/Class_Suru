import { 
  submitAnswer as submitAnswerModel, 
  getAnswerByQuestionId as getAnswerByQuestionIdModel, 
  getAnswerById as getAnswerByIdModel  
} from "../models/answerModel.js";

const submitAnswer = async (req, res) => {
  try {
    const { examId, userId, questionId, selectedOption } = req.body;

    if (!examId || !userId || !questionId || !selectedOption) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const answer = await submitAnswerModel(examId, userId, questionId, selectedOption);
    res.status(201).json({ success: true, message: "Answer submitted successfully", answer });

  } catch (error) {
    console.error("Error in submitAnswer:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAnswerByQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({ success: false, message: "Question ID is required" });
    }

    const answers = await getAnswerByQuestionIdModel(questionId);

    if (answers.length === 0) {
      return res.status(404).json({ success: false, message: "No answers found for this question" });
    }

    res.status(200).json({ success: true, answers });

  } catch (error) {
    console.error("Error in getAnswerByQuestionId:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAnswerById = async (req, res) => {
  try {
    const { answerId } = req.params;

    if (!answerId) {
      return res.status(400).json({ success: false, message: "Answer ID is required" });
    }

    const answer = await getAnswerByIdModel(answerId);

    if (!answer) {
      return res.status(404).json({ success: false, message: "Answer not found" });
    }

    res.status(200).json({ success: true, answer });

  } catch (error) {
    console.error("Error in getAnswerById:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { submitAnswer, getAnswerByQuestionId, getAnswerById };
