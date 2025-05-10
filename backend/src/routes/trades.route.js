import { Router } from "express";
import { getTradesController } from "../controllers/trades.controller.js";
const tradesRouter = Router();
tradesRouter.get("/get-trades", getTradesController);

export default tradesRouter;
