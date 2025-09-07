import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { DatabaseConnection } from "./lib/database";
import { AppError } from "./utils/appError";
import { router } from "./routes/routes";
dotenv.config({ path: "./config.env" });
const app: Application = express();
app.use(
  express.json({
    limit: "10kb",
  })
);
DatabaseConnection();


app.use(router)
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(`Can't find ${req.originalUrl} on the server.`, 404));
// });
// Catch all unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server.`, 404));
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Something went wrong!",
  });
});

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log("App running on port " + Port);
});

