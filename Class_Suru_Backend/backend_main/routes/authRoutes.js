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
import { createExam, getExamById } from "../controllers/examController.js";
import { createQuestion, getQuestionsByExamId } from "../controllers/questionController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);  // New route for password reset request
router.post("/reset-password", resetPassword);    // New route to reset the password
router.post("/user/:id", verifyToken, getUserDetails); 
router.post("/exam", createExam);
router.get("/exam/:examId", getExamById);
router.put("/user/update", verifyToken, updateUser);
router.post("/question/add", createQuestion);
router.post("/question/exam/:exam_id", getQuestionsByExamId);

export default router;
