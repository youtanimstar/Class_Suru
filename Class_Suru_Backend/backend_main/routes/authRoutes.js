import express from "express";
import { 
    signup, 
    login, 
    forgotPassword, 
    resetPassword, 
    getUserDetails, 
    verifyToken, 
    updateUser 
} from "../controllers/authController.js";
import { createExam, getExamById, updateExam, deleteExam, getExamBySubjectAndType } from "../controllers/examController.js";
import { createQuestion, getQuestionsByExamId } from "../controllers/questionController.js";


const router = express.Router();

// User Apis
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);  // New route for password reset request
router.post("/reset-password", resetPassword);    // New route to reset the password
router.post("/user/:id", verifyToken, getUserDetails);
router.put("/user/update", verifyToken, updateUser);//  

// Exam Apis
router.post("/exam", createExam); // done
router.get("/exam/:examId", getExamById);
router.get("/exam/:subject/:type", getExamBySubjectAndType);
router.put("/exam/update/:examId", updateExam);
router.delete("/exam/delete/:examId", deleteExam);


// Questions Apis
router.post("/question/add", createQuestion);
router.get("/question/exam/:exam_id", getQuestionsByExamId);
router.get("/question/:question_id", getQuestionById);



// update question
// get all questions by subject name, type, exam id

// get all users data 




export default router;
