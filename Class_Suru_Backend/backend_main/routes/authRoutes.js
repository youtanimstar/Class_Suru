import express from "express";
import { 
    signup, 
    login, 
    forgotPassword, 
    resetPassword, 
    getUserDetails, 
    verifyToken, 
    updateUser,
    getAllUsers
} from "../controllers/authController.js";
import { createExam, getExamById, updateExam, deleteExam, getExamBySubjectAndType } from "../controllers/examController.js";
import { createQuestion, getQuestionsByExamId, updateQuestion} from "../controllers/questionController.js";
import {getUserResult, getResultByAnswerId } from "../controllers/resultController.js";
import { submitAnswer, getAnswerByQuestionId, getAnswerById   } from "../models/answerModel.js";




const router = express.Router();

// User Apis
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);  // New route for password reset request
router.post("/reset-password", resetPassword);    // New route to reset the password
router.post("/user/:id", verifyToken, getUserDetails);
router.put("/user/update", verifyToken, updateUser);//  

router.get("/user/all",getAllUsers);

// Exam Apis
router.post("/exam", createExam); // done
router.get("/exam/:examId", getExamById);
router.get("/exam/:subject/:type", getExamBySubjectAndType);
router.put("/exam/update/:examId", updateExam);
router.delete("/exam/delete/:examId", deleteExam);


// Questions Apis
router.post("/question/add", createQuestion);
router.post("/question/exam/:exam_id", getQuestionsByExamId);
router.post("/exam/update/:examId", updateExam);
router.post("/question/edit/:questionId", updateQuestion);

// Result Apis
router.get("/result/:answerId", getResultByAnswerId);
router.get("/result/user/:userId", getUserResult);

//answer Apis
router.post("/answers/submit", submitAnswer);
router.get("/answer/:questionId", getAnswerByQuestionId);       
router.get("/answer/:answerId", getAnswerById);



export default router;
