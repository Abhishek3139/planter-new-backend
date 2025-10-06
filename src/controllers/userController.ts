import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { UserModel } from "../models/user";
import { AppError } from "../utils/appError";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserModel.find({});
    res.status(200).json({ users });
  }
);

export const getUser = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const userExist = await UserModel.findById(req.user._id);

    if (!userExist) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({ user: userExist });
  }
);

export const updateUser = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const userExist = await UserModel.findById(userId);

    if (!userExist) {
      return next(new AppError("User not found.", 404));
    }

    await UserModel.findByIdAndUpdate(userId, {
      ...req.body,
    });

    res.status(200).json({ message: "User updated." });
  }
);
