import express from "express";
import { 
    signup, 
    login, 
    forgotPassword, 
    resetPassword, 
    getUserDetails, 
    verifyToken, 
    updateUser,
    getAllUsers,
    adminLogin,
    checkAdminOtp
} from "../controllers/authController.js";
import { createExam, getExamById, updateExam, deleteExam, getExamBySubjectAndType } from "../controllers/examController.js";
import { createQuestion, getQuestionsByExamId ,getQuestionById, updateQuestion, deleteQuestion} from "../controllers/questionController.js";

import {getUserResult, getResultByAnswerId } from "../controllers/resultController.js";
import { submitAnswer, getAnswerByQuestionId, getAnswerById   } from "../controllers/answerController.js";
import { deleteImage, uploadImage } from "../utils/cloudnary.js";




const router = express.Router();

// User Apis
router.post("/signup", signup); //done
router.post("/login", login); //done
router.post("/forgot-password", forgotPassword);  
router.post("/reset-password", resetPassword);    
router.post("/user/:id", verifyToken, getUserDetails);
router.put("/user/update", verifyToken, updateUser);  

// Admin Apis
router.get("/user/all",getAllUsers);
router.post("/admin/login",adminLogin);
router.post("/admin/login/otp",checkAdminOtp);

// Exam Apis
router.post("/exam", createExam); // done
router.get("/exam/:examId", getExamById); //done
router.get("/exam/:subject/:type", getExamBySubjectAndType); // done
router.put("/exam/update/:examId", updateExam); // done
router.delete("/exam/delete/:examId", deleteExam); // done


// Questions Apis
router.post("/question/add", createQuestion); // done
router.get("/question/exam/:exam_id", getQuestionsByExamId); //done
router.get("/question/:question_id", getQuestionById); // done
router.put("/question/update/:question_id", updateQuestion); // done
router.delete("/question/delete/:question_id", deleteQuestion); // done

// Result Apis
router.get("/result/:answerId", getResultByAnswerId);
router.get("/result/user/:userId", getUserResult);

//answer Apis
router.post("/answers/submit", submitAnswer);
router.get("/answer/:questionId", getAnswerByQuestionId);       
router.get("/answer/byid/:answerId", getAnswerById);



// cloudinary image upload
router.post("/:folder/upload-image", uploadImage);
router.delete("/delete-image", deleteImage);

// update question
// get all questions by subject name, type, exam id

// get all users data 




export default router;
