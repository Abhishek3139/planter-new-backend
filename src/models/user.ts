import { NextFunction } from "express";
import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
}
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: UserRole;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: 8,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
export const UserModel = mongoose.model<IUser>("User", userSchema);
