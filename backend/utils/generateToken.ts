import jwt from "jsonwebtoken";
import { IUSER } from "../models/User";

// const token = jwt.sign(payload, secret, options);
export const generateToken = (user: IUSER): string => {
  return jwt.sign({ userId: user?._id }, process.env.JWT_SECRET as string, {
    expiresIn: "90d",
  });
};
