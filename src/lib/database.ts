import mongoose from "mongoose";

export const DatabaseConnection = async (): Promise<void> => {
  try {
    const url: string = process.env.DB_URL || "";

    if (!url) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    await mongoose.connect(url);

    console.log("✅ MongoDB Connected");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection error:", error.message);
    } else {
      console.error("❌ Unknown error while connecting to MongoDB:", error);
    }
 
    process.exit(1);
  }
};
