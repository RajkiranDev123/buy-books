import multer from "multer";
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";

import dotenv from "dotenv";
import { RequestHandler } from "express";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloudinary_name as string,
  api_key: process.env.cloudinary_api_key as string,
  api_secret: process.env.cloudinary_api_secret as string,
});

interface CustomFile extends Express.Multer.File {
  path: string;
}

const uploadToCloudinary = (file: CustomFile): Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    resource_type: "image",
  };
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, options, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        resolve(result as UploadApiResponse);
      }
    });
  });
};

const multerMiddleware: RequestHandler = multer({ dest: "uploads/" }).array(
  "images",
  4,
);

export { multerMiddleware, uploadToCloudinary };
