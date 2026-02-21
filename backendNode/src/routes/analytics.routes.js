import { Router } from "express";
import { calculateVehicleROI } from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/calculate-vehicle-roi/:vehicleId").get(verifyJWT, calculateVehicleROI);

export default router;
