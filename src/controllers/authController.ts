import { NextFunction, Request, Response } from "express";
import { IUser, UserModel } from "../models/user";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv({ path: "././config.env" });
const jwtSecret = process.env.JWT_SECRET || "";
const signToken = (id: string) =>
  jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });
export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, password, role, email } = req.body;

    if (!email || !password || !lastName || !firstName) {
      return next(new AppError("Missing or invalid feilds.", 400));
    }
    const newUser = await UserModel.create({
      firstName,
      lastName,
      password,
      role,
      email,
    });

    const token = signToken(newUser.id);

    res.status(201).json({ user: newUser, token });
  }
);

export const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Missing or invalid feilds.", 400));
    }
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    user.password = undefined as any;

    const token = signToken(user.id);

    res.status(200).json({ user, token });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization?.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Your are not logged in.", 401));
    }

    const decoded = await new Promise<JwtPayload | string>(
      (resolve, reject) => {
        jwt.verify(token!, jwtSecret, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded!);
        });
      }
    );

    const userExist = await UserModel.findById((decoded as JwtPayload).id);
    if (!userExist) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 🔒 Check if password was changed after token was issued
    if (
      userExist.changePasswordAfter &&
      userExist.changePasswordAfter((decoded as JwtPayload).iat!)
    ) {
      return next(
        new AppError(
          "User recently changed password. Please log in again.",
          401
        )
      );
    }

    (req as Request & { user?: IUser }).user = userExist;
    next();
  }
);
