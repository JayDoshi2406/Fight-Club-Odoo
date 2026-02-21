import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FuelExpense } from "../models/fuelExpense.model.js";

const logFuelEntry = asyncHandler(async (req, res) => {
    const { vehicleId, tripId, date, liters, cost } = req.body;

    if (!vehicleId || !liters || !cost) {
        throw new ApiError(400, "vehicleId, liters, and cost are required");
    }

    const fuelExpense = await FuelExpense.create({
        vehicleId,
        tripId: tripId || undefined,
        date: date || Date.now(),
        liters,
        cost,
    });

    res.status(201).json(
        new ApiResponse(201, { fuelExpense }, "Fuel entry logged successfully")
    );
});

export {
    logFuelEntry,
};
