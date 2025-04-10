import { 
  submitAnswer as submitAnswerModel, 
  getAnswerByQuestionId as getAnswerByQuestionIdModel, 
  getAnswerById as getAnswerByIdModel,  
  submitExamModel,
  getAnswerByResultIdModel
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

const submitExam = async (req,res)=>{
  try {
    const {exam_id,user_id,answers} = req.body;
    if(!exam_id || !user_id || !answers){
      return res.status(400).json({success:false,message:"Missing required fields"});
    }
    // console.log('answers',answers);
    
    const result = await submitExamModel(exam_id,user_id,answers);
    if(!result){
      return res.status(404).json({success:false,message:"Exam not found"});
    }
    res.status(201).json({success:true,message:"Exam submitted successfully",result});
  } catch (error) {
    console.log('Error in submitExam:', error.message);
    res.status(500).json({success:false,message:"Internal server error"});
    
  }
}

const getResultByResultId = async (req,res)=>{
  try {
    // console.log('get Result by id called');
    
    const {result_id} = req.params;
    if(!result_id){
      return res.status(400).json({success:false,message:"Result ID is required"});
    }
    const result = await getAnswerByResultIdModel(result_id);
    if(!result){
      return res.status(404).json({success:false,message:"Result not found"});
    }
    res.status(200).json({success:true,result});
  } catch (error) {
    console.log('Error in getResultByResultId:', error.message);
    res.status(500).json({success:false,message:"Internal server error"});
  }
}

export { submitAnswer, getAnswerByQuestionId, getAnswerById, submitExam,getResultByResultId };
