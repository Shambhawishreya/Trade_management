import { Router } from "express";
import { getDailyTrades } from "../controllers/dailytrades.controller.js";
const getDailyRouter = Router();
console.log("Daily trades router initialized.");
getDailyRouter.get("/daily-trade", getDailyTrades);
export default getDailyRouter;
