import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await UserModel.create(req.body);
    res.status(201).json({ user: newUser });
  }
);

export const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Missing or invalid feilds.", 400));
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(new AppError("User not found.", 404))
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    user.password=undefined as any
    res.status(200).json({ user });
  }
);
