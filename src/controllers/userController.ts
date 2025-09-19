import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { UserModel } from "../models/user";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserModel.find({});
    res.status(200).json({ users });
  }
);
