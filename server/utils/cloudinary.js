import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
  secure: true, // always use https
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      access_mode: "public", // ✅ force public access for PDFs/raw files
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
  } catch (error) {
    console.log(error);
  }
};

// ✅ Add this for generating signed URLs (for private assets)
export const getSignedUrl = (publicId, resourceType = "raw") => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  });
};
