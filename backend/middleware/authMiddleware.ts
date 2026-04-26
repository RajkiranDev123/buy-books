import { Request, Response, NextFunction } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string; // req.id
    }
  }
}
// “Go to the existing Express namespace and add (id) property to Request.”
// namespace is a TypeScript keyword used to group related types or interfaces together.
// Only interface supports declaration merging. Extending the existing Request interface

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req?.cookies?.access_token; // app.use(cookieParser());

  if (!token) {
    return response(res, 401, "User is not authenticated.");
  }

  try {
    // jwt.verify(token, secret, options)
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload;

    req.id = decode.userId as string; // jwt.sign({ userId: user?._id }, process.env.JWT_SECRET as string, { expiresIn: "90d" });

    next();
  } catch (error) {
    return response(res, 401, "Invalid or expired token.");
  }
};

// as (type assertion)    =  It tells TypeScript: “Trust me, I know the type of this value.”
// ! (non-null assertion) = “This value is NOT null or undefined.” ==>
