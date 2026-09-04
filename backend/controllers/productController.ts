import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import Products from "../models/Products";

// 5

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      subject,
      category,
      condition,
      classType,
      price,
      author,
      edition,
      description,
      finalPrice,
      shippingCharge,
      seller,
      paymentMode,
      paymentDetails,
    } = req.body;

    const sellerId = req.id;

    const images = req.files as Express.Multer.File[];
    if (!images || images.length === 0) {
      return response(res, 400, "Image is required.");
    }

    let parsedPaymentDetails = JSON.parse(paymentDetails);
    console.log(77, parsedPaymentDetails);
    console.log(78, paymentMode);

    if (
      paymentMode === "UPI" &&
      (!parsedPaymentDetails || !parsedPaymentDetails.upiID)
    ) {
      return response(res, 400, "UPI ID is required.");
    }
    if (
      paymentMode === "Bank Account" &&
      (!parsedPaymentDetails ||
        !parsedPaymentDetails.bankDetails ||
        !parsedPaymentDetails.bankDetails.accountNumber ||
        !parsedPaymentDetails.bankDetails.ifscCode ||
        !parsedPaymentDetails.bankDetails.bankName)
    ) {
      return response(res, 400, "Bank Account Details is required.");
    }

    const uploadPromise = images.map((file) => uploadToCloudinary(file as any));
    // map() gives you: [Promise , Promise] and It just collects the returned Promises into an array.
    // Then Promise.all() waits for all of them:

    const uploadImages = await Promise.all(uploadPromise);

    const imageUrls = uploadImages.map((image) => image.secure_url);

    const product = new Products({
      title,
      description,
      subject,
      category,
      condition,
      classType,
      price,
      finalPrice,
      shippingCharge,
      paymentMode,
      paymentDetails: parsedPaymentDetails,
      author,
      edition,
      seller: sellerId,
      images: imageUrls,
    });

    await product.save();
    return response(res, 200, "Product created successfully", product);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Products.find()
      .sort({ createdAt: -1 })
      .populate("seller", "name email");

    return response(res, 200, "All Products fetched", products);
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
      return response(res, 404, "Product not found for this id");
    }

    return response(res, 200, "Product fetched by id", product);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.productId);

    if (!product) {
      return response(res, 404, "Product not found for this id");
    }

    return response(res, 200, "Product deleted", product);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const getProductBySellerId = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;
    if (!sellerId) {
      return response(res, 400, "seller id is required");
    }

    const product = await Products.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("seller", "name email profilepicture phoneNumber address");

    if (!product) {
      return response(res, 404, "Product not found for this seller");
    }

    return response(res, 200, "Product fetched by seller id", product);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};
