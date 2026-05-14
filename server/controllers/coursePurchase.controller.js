import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

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
