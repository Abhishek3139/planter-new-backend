import express, { Router } from "express";
import { protect, signIn, signUp } from "../controllers/authController";
import { getAllUsers, getUser } from "../controllers/userController";

export const userRouter: Router = express.Router();
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.get("/all", protect, getAllUsers);
userRouter.get("/", protect, getUser);
