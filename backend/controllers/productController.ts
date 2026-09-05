import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary , deleteFromCloudinary} from "../config/cloudinaryConfig";
import Products from "../models/Products";

// 5

export const createProduct = async (req: Request, res: Response) => {

  try {

    const {
      title, subject, category, condition, classType, price, author,
      edition, description, finalPrice, shippingCharge,
      paymentMode, paymentDetails } = req.body;

    const sellerId = req.id;

    const images = req.files as Express.Multer.File[]; // Multer's .d.ts file extends the Express namespace.
    // console.log("images ==> ",images)

    if (!images || images.length === 0) {
      // So if no files were uploaded and req.files is undefined.
      return response(res, 400, "Image is required.");
    }

    // If you do not supply paymentDetails in req.body, then : const { paymentDetails } = req.body
    // makes : paymentDetails === undefined
    // console.log("paymentDetails ==> ", typeof paymentDetails) // string
    let parsedPaymentDetails = paymentDetails ? JSON.parse(paymentDetails) : null
    // JSON.parse() expects a JSON string.

    // If you send : paymentDetails : { upiId :  "rajkir783@oksbi" }
    // as part of a multipart/form-data request, the server receives the field roughly like :
    // '{"upiId":"rajkir783@oksbi"}' and JSON.parse() turns into { upiId : "rajkir783@oksbi" }
    // With multipart/form-data, form fields are sent as text values (plus files).
    // even if js object sent then server will receive it as string
    // If you use application/json , then you can send an object directly & no need JSON.parse() 


    if ( paymentMode === "UPI" && (!parsedPaymentDetails || !parsedPaymentDetails.upiId) ) {
      return response(res, 400, "UPI ID is required."); // false || undefined || 9 (stops immediately) is 9 , falsey then go next and check
    }

    if ( paymentMode === "Bank Account" &&
      (!parsedPaymentDetails ||
        !parsedPaymentDetails.bankDetails ||
        !parsedPaymentDetails.bankDetails.accountNumber ||
        !parsedPaymentDetails.bankDetails.ifscCode ||
        !parsedPaymentDetails.bankDetails.bankName)
    ) {
      return response(res, 400, "Bank Account Details is required.");
    }

    const uploadPromise = images.map((file) => uploadToCloudinary(file as Express.Multer.File ));
    // map() gives you: [Promise , Promise] and It just collects the returned Promises into an array.
    // Then Promise.all() waits for all of them to resolve : and if fail them jump to catch block

    const uploadImages = await Promise.all(uploadPromise);
   

    // Promise.all([p1, p2, p3]) ==> p1, p2, and p3 should be Promise objects, not the resolved values.

    const imageUrls = uploadImages.map((image) => image.secure_url);

    const product = new Products({
      title, description, subject, category, condition, classType, price, finalPrice,
      shippingCharge, paymentMode, paymentDetails: parsedPaymentDetails, author, edition,
      seller: sellerId, images: imageUrls
   });

    await product.save();

    return response(res, 200, "Product created successfully.", product);

  } catch (error ) {
    console.log((error as any))
    return response(res, 500, "Internal Server Error");

  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {

    const products = await Products.find()
      .sort({ createdAt: -1 })
      .populate("seller", "name email");

    return response(res, 200, "All Products fetched.", products);

  } catch (error) {

    return response(res, 500, "Internal Server Error");

  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {

    const product = await Products.findById(req.params.id).populate({
      path: "seller",
      select: "name email profilePicture phoneNumber addresses",
      populate: {
        path: "addresses",
        model: "Address",
      },
    });

    if (!product) {
      return response(res, 404, "Product not found for this id.");
    }

    return response(res, 200, "Product fetched by id.", product);

  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {

  try {
    // Find product
    const product = await Products.findById(req.params.productId);

    if (!product) {
      return response(res, 404, "Product not found for this id.");
    }

    // Delete images from Cloudinary
    await Promise.all(

      product.images.map(image => {

        const publicId = image
          .split("/upload/")[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, "");

        return deleteFromCloudinary(publicId);

      })
      
    );

    // Delete product from MongoDB
    await Products.findByIdAndDelete(req.params.productId);

    return response(res, 200, "Product deleted", product);

  } catch (error) {

    console.error(error);

    return response(res, 500, "Internal Server Error");
  }
};

export const getProductsBySellerId = async (req: Request, res: Response) => {

  try {

    const sellerId = req.params.sellerId;

    if (!sellerId) {
      return response(res, 400, "seller id is required.");
    }

    const product = await Products.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("seller", "name email profilepicture phoneNumber address");

    if (!product) {
      return response(res, 404, "Product not found for this seller");
    }

    return response(res, 200, "Product fetched by seller id.", product);

  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};
