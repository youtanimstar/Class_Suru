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
router.post("/signup", signup); //done
router.post("/login", login); //done
router.post("/forgot-password", forgotPassword);  
router.post("/reset-password", resetPassword);    
router.post("/user/:id", verifyToken, getUserDetails);
router.put("/user/update", verifyToken, updateUser);  

router.get("/user/all",getAllUsers);

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



// update question
// get all questions by subject name, type, exam id

// get all users data 




export default router;
