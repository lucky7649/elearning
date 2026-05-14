import express from "express";
import {
  purchaseCourse,
  getAllPurchasedCourse,
  getCourseDetailsWithPurchaseStatus,
} from "../controllers/coursePurchase.controller.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.post("/course", isAuthenticated, purchaseCourse);

router.get(
  "/courses/:courseId/details-with-status",
  isAuthenticated,
  getCourseDetailsWithPurchaseStatus
);

router.get("/", isAuthenticated, getAllPurchasedCourse);

export default router;
