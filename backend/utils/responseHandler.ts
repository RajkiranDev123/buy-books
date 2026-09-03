import { Response } from "express";

export const response = ( res: Response, statusCode: number, message: string, data?: any ) => {

  return res.status(statusCode).json({

    success: statusCode >= 200 && statusCode < 300,
    message,
    data: data || null

  });
  
};

// 299 → non-standard/custom success status ✅
// 300	Multiple Choices	
// 301	Moved Permanently	