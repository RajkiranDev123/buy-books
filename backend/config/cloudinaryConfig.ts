import multer from "multer";
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import { RequestHandler } from "express";

dotenv.config();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.cloudinary_name as string,
  api_key: process.env.cloudinary_api_key as string,
  api_secret: process.env.cloudinary_api_secret as string,
});

// ✅ Multer (disk storage)
const multerMiddleware: RequestHandler = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).array("images", 4);

// ✅ Upload + delete local file
const uploadToCloudinary = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    resource_type: "image",
    folder: "buy_books",
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, options, (error, result) => {
      
      // ✅ delete file (important)
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      if (error) {
        return reject(error);
      } else {
        resolve(result as UploadApiResponse);
      }
    });
  });
};

export { multerMiddleware, uploadToCloudinary };

// With memoryStorage: Client → Multer (RAM) → Cloudinary → Done ✅ ==> RAM is temporary storage managed by the runtime (Node.js + OS).
// With disk storage: Client → Multer (Disk) → Cloudinary → Delete file ❗