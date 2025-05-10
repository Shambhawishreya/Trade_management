import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not defined in the environment variables.");
// }

const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Database Connected Successfully using Prisma.");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process with failure
  }
}

export default prisma;

// Named export for connectDB (optional if needed elsewhere)
export { connectDB };
