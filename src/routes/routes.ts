import express, { Router } from "express";
import { userRouter } from "./userRoutes";

export const router: Router = express.Router();
router.use("/api/v1/users", userRouter);
