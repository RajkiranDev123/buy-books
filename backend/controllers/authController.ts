import { Request, Response } from "express";
import User from "../models/User";
import crypto from "crypto";
import { response } from "../utils/responseHandler";
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, agreeTerms } = req.body;
    if (!name || !email || !password || !agreeTerms) {
      return response(res, 400, "All fields are required.");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, "User already exists.");
    }
    const verificationToken = crypto.randomBytes(10).toString("hex");
    const user = new User({
      name,
      email,
      password,
      agreeTerms,
      verificationToken,
    });
    await user.save();
    // const result = await sendVeerificationToEmail(
    //   user.email,
    //   verificationToken,
    // );
    // console.log(result)

    return response(
      res,
      200,
      "Registration done, Plz check your email to verify!",
    );
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

//////////////////////////////////////////////////////////////


