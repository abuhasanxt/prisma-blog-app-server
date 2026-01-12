import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "internal server error";
  let errorDetails = err;

  //prismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    (statusCode = 400),
      (errorMessage = "you provide incorrect field type or missing fields");
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
