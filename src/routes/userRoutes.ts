import express, { Router } from "express";
import { signIn, signUp } from "../controllers/authController";

export const userRouter: Router = express.Router();
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
