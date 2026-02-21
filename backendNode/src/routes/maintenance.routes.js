import { Router } from "express";
import { logServiceEvent } from "../controllers/maintenance.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/log-service-event").post(verifyJWT, logServiceEvent);

export default router;
