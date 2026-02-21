import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ServiceLog } from "../models/serviceLog.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { publishEvent } from "../utils/redis.js";
import mongoose from "mongoose";

const logServiceEvent = asyncHandler(async (req, res) => {
    const { vehicleId, serviceType, date, cost, notes } = req.body || {};

    if (!vehicleId || !serviceType || !cost) {
        throw new ApiError(400, "vehicleId, serviceType, and cost are required");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const vehicle = await Vehicle.findById(vehicleId).session(session);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }

        const [serviceLog] = await ServiceLog.create(
            [
                {
                    vehicleId,
                    serviceType,
                    date: date || Date.now(),
                    cost,
                    notes,
                },
            ],
            { session }
        );

        vehicle.status = "In Shop";
        await vehicle.save({ session, validateModifiedOnly: true });

        await session.commitTransaction();
        session.endSession();

        await publishEvent("vehicle.updated", { vehicleId: vehicle._id, status: vehicle.status });

        res.status(201).json(
            new ApiResponse(201, { serviceLog }, "Service event logged successfully")
        );
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to log service event: " + err.message);
    }
});

export {
    logServiceEvent,
};
