import { Request, Response } from "express";
import { response } from "../utils/responseHandler";

import User from "../models/User";

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(675,userId)

    if (!userId) {
      return response(res, 400, "user id is req.");
    }

    const { name, email, phoneNumber } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber },
      { new: true, runValidators: true },
    ).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires",
    );
    if (!updateUser) {
      return response(res, 400, "User not found.");
    }

    return response(res, 200, "User profile updated", updateUser);
  } catch (error) {
    console.log(error)
    return response(res, 500, "Internal Server Error");
  }
};
