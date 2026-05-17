import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { GoogleGenAI } from "@google/genai";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  deleteRawFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Fields are empty.",
      });
    }

    const course = await Course.create({
      courseTitle: title,
      category,
      creator: req.id,
    });

    return res.status(201).json({
      success: true,
      course,
      message: "Course created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      courseThumbnail = await uploadMedia(req.file.path);
    }

    const updatedData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(req.params.courseId, updatedData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      course,
      message: "Course updated.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit course",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const creatorId = req.id;
    const courses = await Course.find({ creator: creatorId }).populate({
      path: "lectures",
    });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Course Not found",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get creator course",
    });
  }
};

export const getAllCourses = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all courses",
    });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId)
      .populate({ path: "creator", select: "name" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get single course",
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1;
    }

    let courses = await Course.find(searchCriteria)
      .populate({
        path: "creator",
        select: "name photoUrl",
      })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to search for courses",
    });
  }
};

export const getCourseLectures = async (req, res) => {
  try {
    const { courseId
