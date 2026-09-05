import multer from "multer";

import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";

import dotenv from "dotenv";
import fs from "fs";
import { RequestHandler } from "express";
// "RequestHandler" represents the entire middleware function.
// Conceptually, it is roughly: type RequestHandler = ( req: Request, res: Response, next: NextFunction ) => void;
// and "Request" represents the incoming HTTP request object.

dotenv.config();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// ✅ Multer (disk storage)
const multerMiddleware: RequestHandler = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).array("images", 4); // Accept up to 4 files, and the HTML form field name must be "images".


// ✅ Upload + delete local file
// There is no await inside the function, so you don't need async.

//  const uploadPromise = images.map((file) => uploadToCloudinary(file as any));
//  const uploadImages = await Promise.all(uploadPromise);

const uploadToCloudinary = ( file: Express.Multer.File ): Promise<UploadApiResponse> => {

  const options: UploadApiOptions = { resource_type: "image", folder: "buy_books" };

  return new Promise((resolve, reject) => {

    cloudinary.uploader.upload(file.path, options, (error, result) => {
      // This part is the callback function given to Cloudinary:
      // It runs after Cloudinary finishes trying to upload the file.

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

const deleteFromCloudinary = (publicId: string): Promise<any> => {

  return new Promise((resolve, reject) => {

    cloudinary.uploader.destroy(publicId, (error, result) => {
      
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }

    });

  });

};

export { multerMiddleware, uploadToCloudinary , deleteFromCloudinary }; // same as export const multerMiddleware = ...

// With memoryStorage: Client → Multer (RAM) → Cloudinary → Done ✅ ==> RAM is temporary storage managed by the runtime (Node.js + OS).
// With disk storage: Client → Multer (Disk) → Cloudinary → Delete file ❗



// function x(){
//   return new Promise(
//     (resolve,reject)=>{
//       resolve(99)
//   }
//   )
// }
// bb=x()
// console.log(bb) // Promise { 99 }
// bb.then((value)=>console.log(value)) // 99
// async function test() {
//   const bb = x();
//   console.log(bb); // Promise { 99 }
//   const value = await bb;
//   console.log(value); // 99
// }
// test();
