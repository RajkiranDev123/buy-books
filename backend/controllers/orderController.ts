import { Request, Response } from "express";
import CartItems from "../models/CartItems";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    console.log(876756453,req.body)
    const userId = req.id;
    const {
      orderId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentDetails,
    } = req.body;

    const cart = await CartItems.findOne({ user: userId }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return response(res, 400, "cart is empty");
    }
    let order = await Order.findOne({ _id: orderId });
    if (order) {
      order.shippingAddress = shippingAddress || order.shippingAddress;
      order.paymentMethod = paymentMethod || order.paymentMethod;
      order.totalAmount = totalAmount || order.totalAmount;
      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
        order.paymentStatus = "complete";
        order.status = "processing";
      }
    } else {
      order = new Order({
        user: userId,
        items: cart.items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentDetails,
        paymentStatus: paymentDetails ? "completed" : "pending",
      });
    }
    await order.save();
    if (paymentDetails) {
      await CartItems.findOneAndUpdate(
        {
          user: userId,
        },
        { $set: { items: [] } },
      );
    }
    return response(res, 200, "order created/updated successfully", order);
  } catch (error) {
    console.log(error)
    return response(res, 500, "Internal Server Error");
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const order = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.product",
        model: "Product",
      });
    if (!order) {
      return response(res, 404, "order not found");
    }

    return response(res, 200, "Order fetched successfully", order);
  } catch (error) {
    console.log(777,error)
    return response(res, 500, "Internal Server Error");
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        model: "Product",
      });

    if (!order) {
      return response(res, 404, "order not found ");
    }

    return response(res, 200, "order fetched by id", order);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response,
) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return response(res, 404, "Order not found");
    }
    const razorPayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order?._id.toString(),
    });
    return response(res, 200, "Razorpay order and payment created", {
      order: razorPayOrder,
    });
  } catch (error) {
    console.log(56,error)
    return response(res, 500, "Internal Server Error");
  }
};

export const handleRazorPayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const paymentId = req.body.payload.payment.entity.id;
      const orderId = req.body.payload.payment.entity.order.id;

      await Order.findOneAndUpdate(
        {
          "paymentDetails.razorpay_order_id": orderId,
        },
        {
          paymentStatus: "complete",
          status: "processing",
          "paymentDetails.razorpay_payment_id": paymentId,
        },
      );
      return response(res, 200, "webhook processed successfully");
    } else {
      return response(res, 400, "Invalid signature");
    }
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};
