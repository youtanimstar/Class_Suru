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
import { createQuestion, getQuestionsByExamId ,getQuestionById, updateQuestion, deleteQuestion} from "../controllers/questionController.js";


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
router.get("/exam/:subject/:type", getExamBySubjectAndType); // done
router.put("/exam/update/:examId", updateExam);
router.delete("/exam/delete/:examId", deleteExam);


// Questions Apis
router.post("/question/add", createQuestion); // done
router.get("/question/exam/:exam_id", getQuestionsByExamId); //done
router.get("/question/:question_id", getQuestionById);
router.put("/question/update/:question_id", updateQuestion);
router.delete("/question/delete/:question_id", deleteQuestion);



// update question
// get all questions by subject name, type, exam id

// get all users data 




export default router;
