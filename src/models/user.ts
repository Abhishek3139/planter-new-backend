import { NextFunction } from "express";
import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
}

interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
}
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: UserRole;
  passwordChangedAt: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changePasswordAfter?(jwtTimestamp: number): boolean;
  shippingAddress: Address[];
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
    shippingAddress: Array,
    passwordChangedAt: Date,
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

userSchema.methods.changePasswordAfter = function (
  jwtTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    // Convert `Date` → seconds
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    // If JWT was issued *before* password change → token invalid
    return jwtTimestamp < changedTimestamp;
  }

  return false; // password never changed after token issue
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
