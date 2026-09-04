import jwt from "jsonwebtoken";
import { IUSER } from "../models/User";

// jwt.sign(payload, secret, options);

export const generateToken = (user: IUSER): string => {
  
    return jwt.sign({ userId : user?._id }, process.env.JWT_SECRET as string, { expiresIn: "90d"});

};

// user?._id is a Mongoose ObjectId at the TypeScript/Mongoose level.

// when jwt.sign() creates the JWT, the payload is JSON-serialized, 
// so the ObjectId is effectively represented as its string value inside the JWT.