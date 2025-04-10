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
  checkAdminOtp,
  addUserInfo,
} from "../controllers/authController.js";
import {
  createExam,
  getExamById,
  updateExam,
  deleteExam,
  getExamBySubjectAndType,
  getQuestionForExam,
} from "../controllers/examController.js";
import {
  createQuestion,
  getQuestionsByExamId,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

import {
  getUserResult,
  getResultByAnswerId,
} from "../controllers/resultController.js";
import {
  submitAnswer,
  getAnswerByQuestionId,
  getAnswerById,
  submitExam,
  getResultByResultId,
} from "../controllers/answerController.js";
import { deleteImage, uploadImage } from "../utils/cloudnary.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// User Apis
router.post("/signup", signup); //done
router.post("/login", login); //done
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/user/:id", verifyToken, getUserDetails);
router.put("/user/update/:id", updateUser);
router.put("/user/add/info", verifyToken, addUserInfo);

// Admin Apis
router.get("/user/all", getAllUsers);
router.post("/admin/login", adminLogin);
router.post("/admin/login/otp", checkAdminOtp);

// Exam Apis
router.post("/exam", createExam); // done
router.get("/exam/:examId", getExamById); //done
router.get("/exam/:subject/:type", getExamBySubjectAndType); // done
router.put("/exam/update/:examId", updateExam); // done
router.delete("/exam/delete/:examId", deleteExam); // done
router.post("/exam/user/:examId", getQuestionForExam);

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

router.post("/exam/submit",submitExam);
router.get("/exam/user/result/:result_id",getResultByResultId)

// cloudinary image upload
router.post("/upload-image/:folder",upload.single('image'), uploadImage);
router.delete("/delete-image", deleteImage);

// update question
// get all questions by subject name, type, exam id

// get all users data

export default router;
