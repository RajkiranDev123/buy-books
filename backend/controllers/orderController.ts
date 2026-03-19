import { Request, Response } from "express";
import CartItems from "../models/CartItems";
import { response } from "../utils/responseHandler";
import Order from "../models/Order";
import Razorpay from "razorpay";

const razorpay=new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID as string,
  key_secret:process.env.RAZORPAY_KEY_SECRET as string,
})

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
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
    return response(res, 200, "order created/updated successfully",order);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const order = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "item.product",
        model: "Product",
      });
    if (!order) {
      return response(res, 404, "order not found");
    }

    return response(res, 200, "Order fetched successfully", order);
  } catch (error) {
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

