import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import tradesRouter from "./routes/trades.route.js";
import registerRouter from "./routes/registertrades.route.js";
import getDailyRouter from "./routes/dailytrades.route.js";
dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

const PORT = 8000 || process.env.PORT;
app.use("/api/trades", tradesRouter);
app.use("/api/register", registerRouter);
app.use("/api/getdaily",getDailyRouter)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running ", PORT);
  });
});
