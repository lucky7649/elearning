import express from "express"
import isAuthenticated from "../middlewares/auth.js";
import {getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress, submitQuiz } from "../controllers/courseprogress.controller.js";

const router = express.Router();

// Route to get course progress
router.route('/:courseId').get(isAuthenticated, getCourseProgress);

// Route to update lecture progress
router.route('/:courseId/lectures/:lectureId/view').post(isAuthenticated, updateLectureProgress);

// Route to mark a course as completed
router.route('/:courseId/complete').post(isAuthenticated, markAsCompleted);
router.route('/:courseId/incomplete').post(isAuthenticated, markAsInCompleted);

// Route to submit quiz for a lecture
router.route('/:courseId/lectures/:lectureId/quiz').post(isAuthenticated, submitQuiz);

export default router;