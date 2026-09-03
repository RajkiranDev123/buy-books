import { Request, Response } from "express";
import User from "../models/User";
import crypto from "crypto";
import { response } from "../utils/responseHandler";
import {
  sendVerificationToEmail,
  sendResetPasswordLinkToEmail,
} from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";

// 7 controllers

export const register = async (req: Request, res: Response) => {
  
  try {

    const { name, email, password, agreeTerms } = req.body;

    if (!name || !email || !password || !agreeTerms) {
      return response(res, 400, "All fields are required.");
    }

    const existingUser = await User.findOne({ email }); // findOne takes query object
    // .lean() ==> without it you don’t get a simple js object.
    // You get a Mongoose document instance — kind of like a “smart object”.
    // & includes methods like .save()
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

    // const user = await new User({ name, email, password, agreeTerms, verificationToken }).save();

    // or

    // await User.create({
    //   name,
    //   email,
    //   password,
    //   agreeTerms,
    //   verificationToken
    // }); is equivalent to

    // const user = new User({ name, email, password, agreeTerms, verificationToken }); and await user.save();
    

    const result = await sendVerificationToEmail(user.email, verificationToken);

    console.log("mail res sendVerificationToEmail ==> ", result?.response);

    return response(
      res,
      200,
      "Registration done, Please check your email to verify!",
    );

    // response object , status code , message and data

  } catch (error) {

    return response(res, 500, "Internal Server Error");

  }

};

//////////////////////////////////////////////////////////////

export const verifyEmail = async (req: Request, res: Response) => {

  try {
    
    // /users and /users/:id are different routes. not optional like query params : /users?id=123
    const { token } = req.params; // router.post("/verify-email/:token", authController.verifyEmail);
    
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return response(res, 400, "Invalid or expired verification token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    const accessToken = generateToken(user);

    // res.cookie(name, value, options);
    res.cookie("access_token", accessToken, {
      httpOnly: true, // JavaScript (browser) cannot access it
      maxAge: 24 * 60 * 60 * 1000,
    });

    // httpOnly ==>	JS cannot access cookie : true/false
    // secure	  ==> Only sent over HTTPS    : true/false
    // sameSite	==> Controls cross-site sending : strict , lax and none

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
// generate resetPasswordToken and resetPasswordExpires
// send mail
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return response(res, 404, "No account found with this email address.");
    }
    const resetPasswordToken = crypto.randomBytes(10).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from the current time
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
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      // Expiry time (resetPasswordExpires): 2:00 PM
      // Current time: 1:30 PM → ✅ valid (2:00 > 1:30)
    });
    if (!user) {
      return response(res, 400, "Invalid or expired reset password token.");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    // Remove the field (unset it)” : undefined
    // We don’t even need the field anymore
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
    res.clearCookie("access_token", {
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
      // 401 Unauthorized → user not logged in / no token
      return response(res, 401, "Not authenticated , Please login to access. ");
    }
    const user = await User.findById(userId).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires",
    );
    if (!user) {
      return response(res, 404, "User not found.");
      // 404 , Not Found , Resource doesn’t exist
      // 403 = authenticated but forbidden
    }
    return response(res, 200, "User retreived successfully", user);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

//Port 80 : http
//Port 443 : Default port for HTTPS (secure web) : Data is encrypted (SSL/TLS)
//Port 8000 : Common port for development servers
