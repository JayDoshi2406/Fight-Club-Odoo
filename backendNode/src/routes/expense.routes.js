import { Router } from "express";
import { logFuelEntry } from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/log-fuel-entry").post(verifyJWT, logFuelEntry);

export default router;
