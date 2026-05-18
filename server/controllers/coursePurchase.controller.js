import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay API Keys (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing in the server .env file.");
  }

  return new Razorpay({ key_id, key_secret });
};

/* ---------------- BUY COURSE ---------------- */
export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if already purchased
    const existingPurchase = await CoursePurchase.findOne({ userId, courseId });
    if (existingPurchase && existingPurchase.status === "completed") {
      return res.status(400).json({ message: "Course already purchased." });
    }

    // Create a mock purchase
    const newPurchase = new CoursePurchase({
      userId,
      courseId,
      amount: course.coursePrice,
      status: "completed",
      paymentIntentId: `mock_payment_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    });

    await newPurchase.save();

    // Update User's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    // Update Course's enrolled students
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: userId },
    });

    console.log("✅ Mock payment saved in DB");
    res.status(200).json({ success: true, message: "Purchase completed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ---------------- COURSE DETAILS ---------------- */
export const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
    });

    res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};

/* ---------------- ALL PURCHASED ---------------- */
export const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching purchased courses" });
  }
};

/* ---------------- CREATE RAZORPAY ORDER ---------------- */
export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already purchased
    const existingPurchase = await CoursePurchase.findOne({ userId, courseId });
    if (existingPurchase && existingPurchase.status === "completed") {
      return res.status(400).json({ message: "Course already purchased." });
    }

    // Create Razorpay Order options
    const options = {
      amount: course.coursePrice * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    // Create purchase record in database (initially pending)
    const newPurchase = new CoursePurchase({
      userId,
      courseId,
      amount: course.coursePrice,
      status: "pending",
      paymentIntentId: order.id, // Store Order ID temporarily
    });
    await newPurchase.save();

    res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("Error creating Razorpay order:", error);
    res.status(500).json({ message: error.message || "Failed to create Razorpay order" });
  }
};

/* ---------------- VERIFY RAZORPAY PAYMENT ---------------- */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.id;

    // HMAC verification
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed. Invalid signature." });
    }

    // Find the pending purchase and update it
    const purchase = await CoursePurchase.findOne({ userId, courseId, paymentIntentId: razorpay_order_id });
    if (!purchase) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    purchase.status = "completed";
    purchase.paymentIntentId = razorpay_payment_id;
    await purchase.save();

    // Update User enrolled courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    // Update Course enrolled students
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: userId },
    });

    res.status(200).json({ success: true, message: "Payment verified and course unlocked successfully!" });
  } catch (error) {
    console.log("Error verifying Razorpay payment:", error);
    res.status(500).json({ message: "Failed to verify Razorpay payment" });
  }
};
