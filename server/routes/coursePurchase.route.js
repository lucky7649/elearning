import express from "express";
import {
  purchaseCourse,
  getAllPurchasedCourse,
  getCourseDetailsWithPurchaseStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/coursePurchase.controller.js";
import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.post("/course", isAuthenticated, purchaseCourse);

router.post("/razorpay/order", isAuthenticated, createRazorpayOrder);
router.post("/razorpay/verify", isAuthenticated, verifyRazorpayPayment);

router.get(
  "/courses/:courseId/details-with-status",
  isAuthenticated,
  getCourseDetailsWithPurchaseStatus
);

router.get("/", isAuthenticated, getAllPurchasedCourse);

export default router;
