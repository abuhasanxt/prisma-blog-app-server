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
  //PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      (statusCode = 400),
        (errorMessage =
          "An operation failed because it depends on one or more records that were required but not found");
    } else if (err.code === "P2002") {
      (statusCode = 400), (errorMessage = "Duplicate kye error");
    } else if (err.code === "P2003") {
      (statusCode = 400), (errorMessage = "Foreign  kye constraint failed");
    }
  }
  //PrismaClientUnknownRequestError
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    (statusCode = 500),
      (errorMessage = "Error occurred during query execution");
  }
  //PrismaClientRustPanicError
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    (statusCode = 400),
      (errorMessage =
        "The error message usually provides details about where in the internal Rust code the panic occurred, which often points to a bug in Prisma's engines rather than a user configuration error (unless the configuration is fundamentally invalid");
  }
  //PrismaClientInitializationError
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      (statusCode = 401),
        (errorMessage =
          "Authentication failed . please check your credentials !");
    }

    else if (err.errorCode==="P1001") {
          (statusCode = 400),
        (errorMessage =
          "Can't reach database server !");
    }
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
