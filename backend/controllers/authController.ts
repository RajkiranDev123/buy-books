import { Request, Response } from "express";
import User from "../models/User";
import crypto from "crypto";
import { response } from "../utils/responseHandler";
import {
  sendVerificationToEmail,
  sendResetPasswordLinkToEmail,
} from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, agreeTerms } = req.body;
    // if (!name || !email || !password || !agreeTerms) {
    //   return response(res, 400, "All fields are required.");
    // }
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

    //await new User({ name, email, password, agreeTerms, verificationToken }).save(); :sh 1

    //await User.create({
    //   name,
    //   email,
    //   password,
    //   agreeTerms,
    //   verificationToken
    // }); is equivalent to

    // const user = new User({ name, email, password, agreeTerms, verificationToken });
    // await user.save();

    const result = await sendVerificationToEmail(user.email, verificationToken);
    console.log("mail res==> ", result?.response);

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

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.params;
    const user = await User.findOne({ verificationToken: token }); //match
    if (!user) {
      return response(res, 400, "Invalid or expired verification token.");
    }
    user.isVerified = true;
    user.verificationToken = undefined;

    const accessToken = generateToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    await user.save();
    return response(res, 200, "Email Verified, You can use Buy Books now.");
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

//////////////////////////////////////////////////////////////

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user?.comparePassword(password))) {
      return response(res, 400, "Invalid email or password.");
    }
    if (!user.isVerified) {
      return response(res, 400, "Plz verify email , check your inbox.");
    }

    const accessToken = generateToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return response(res, 200, "You are logged in.", {
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
};

////////////////////////////////////////////////////////////////////////////

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return response(res, 400, "No A/C found with this email address.");
    }
    const resetPasswordToken = crypto.randomBytes(10).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); //1 hour from the current time
    await user.save(); //save resetPasswordToken and resetPasswordExpires

    await sendResetPasswordLinkToEmail(user.email, resetPasswordToken);

    return response(res, 200, "Password reset link sent to your email.");
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

/////////////////////////////////////////////////////////

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return response(res, 400, "Invalid or expired reset password token.");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save(); // remove resetPasswordToken & resetPasswordExpires & save password

    return response(res, 200, "Password reset done.");
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

//////////////////////////////////////////////////////////////

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access-token", {
      httpOnly: true,
    });
    return response(res, 200, "logout done");
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

////////////////////////////////////////////////////
export const checkUserAuth = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    if (!userId) {
      return response(res, 400, "Not authenticated . plz login to access ");
    }
    const user = await User.findById(userId).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires",
    );
    if (!user) {
      return response(res, 403, "User not found.");
    }
    return response(res, 200, "User retrived successfully");
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};
