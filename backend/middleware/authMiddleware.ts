import { Request, Response, NextFunction } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}
//“Go to the existing Express namespace and add this property to Request.”
//namespace is a TypeScript keyword used to group related types or interfaces together.
//Only interface supports declaration merging.
//Extending the existing Request interface
// declare namespace Express {
//   interface Request { ... }
//   interface Response { ... }
// }

export const auth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return response(res, 401, "User not authenticated.");
  }

  try {
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload;

    req.id = decode.userId as string;

    next();
  } catch (error) {
    return response(res, 401, "Invalid or expired token.");
  }
};
