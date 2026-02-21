import { Router } from "express";
import {
    createNewTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
} from "../controllers/trip.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-new-trip").post(verifyJWT, createNewTrip);

router.route("/dispatch-trip/:tripId").patch(verifyJWT, dispatchTrip);

router.route("/complete-trip/:tripId").patch(verifyJWT, completeTrip);

router.route("/cancel-trip/:tripId").patch(verifyJWT, cancelTrip);

export default router;
