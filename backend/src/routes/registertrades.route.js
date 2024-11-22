import { Router } from "express";
import { registerTradeController } from "../controllers/registertrades.controller.js";
const registerRouter = Router();
registerRouter.post("/register-trade", registerTradeController);
export default registerRouter;
