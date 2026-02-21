import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Trip } from "../models/trip.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { Driver } from "../models/driver.model.js";
import { publishEvent } from "../utils/redis.js";
import mongoose from "mongoose";

const createNewTrip = asyncHandler(async (req, res) => {
    const { vehicleId, driverId, cargoWeight, startRegion, endRegion, startOdometer } = req.body;

    if (!vehicleId || !driverId || !cargoWeight || !startRegion || !endRegion) {
        throw new ApiError(400, "All fields are required");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const vehicle = await Vehicle.findById(vehicleId).session(session);
        if (!vehicle) {
            throw new ApiError(404, "Vehicle not found");
        }

        if (vehicle.status !== "Available") {
            throw new ApiError(400, `Vehicle is not available. Current status: ${vehicle.status}`);
        }

        if (cargoWeight > vehicle.maxLoadCapacity) {
            throw new ApiError(
                400,
                `Cargo weight (${cargoWeight}) exceeds vehicle max load capacity (${vehicle.maxLoadCapacity})`
            );
        }

        const driver = await Driver.findById(driverId).session(session);
        if (!driver) {
            throw new ApiError(404, "Driver not found");
        }

        if (driver.AvailabilityStatus !== "Available") {
            throw new ApiError(400, `Driver is not available. Current status: ${driver.AvailabilityStatus}`);
        }

        // Reserve vehicle atomically
        vehicle.status = "On Trip";
        await vehicle.save({ session, validateModifiedOnly: true });

        const [trip] = await Trip.create(
            [
                {
                    vehicleId,
                    driverId,
                    cargoWeight,
                    startRegion,
                    endRegion,
                    startOdometer: startOdometer || vehicle.odometer,
                    status: "Draft",
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(
            new ApiResponse(201, { trip }, "Trip created successfully")
        );
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        if (err instanceof ApiError) throw err;
        throw new ApiError(500, "Failed to create trip: " + err.message);
    }
});

const dispatchTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
        throw new ApiError(404, "Trip not found");
    }

    if (trip.status !== "Draft") {
        throw new ApiError(400, `Trip cannot be dispatched. Current status: ${trip.status}`);
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    const driver = await Driver.findById(trip.driverId);
    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }

    trip.status = "Dispatched";
    trip.dispatchedAt = new Date();
    await trip.save();

    vehicle.status = "On Trip";
    await vehicle.save({ validateModifiedOnly: true });

    driver.AvailabilityStatus = "On_Trip";
    await driver.save({ validateModifiedOnly: true });

    await publishEvent("vehicle.updated", { vehicleId: vehicle._id, status: vehicle.status });
    await publishEvent("driver.updated", { driverId: driver._id, AvailabilityStatus: driver.AvailabilityStatus });

    res.status(200).json(
        new ApiResponse(200, { trip }, "Trip dispatched successfully")
    );
});

const completeTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.params;
    const { finalOdometer } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
        throw new ApiError(404, "Trip not found");
    }

    if (trip.status !== "Dispatched") {
        throw new ApiError(400, `Trip cannot be completed. Current status: ${trip.status}`);
    }

    if (!finalOdometer) {
        throw new ApiError(400, "finalOdometer is required to complete the trip");
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    const driver = await Driver.findById(trip.driverId);
    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }

    trip.status = "Completed";
    trip.finalOdometer = finalOdometer;
    trip.completedAt = new Date();
    await trip.save();

    vehicle.odometer = finalOdometer;
    vehicle.status = "Available";
    await vehicle.save({ validateModifiedOnly: true });

    driver.AvailabilityStatus = "Available";
    await driver.save({ validateModifiedOnly: true });

    await publishEvent("vehicle.updated", { vehicleId: vehicle._id, status: vehicle.status, odometer: vehicle.odometer });
    await publishEvent("driver.updated", { driverId: driver._id, AvailabilityStatus: driver.AvailabilityStatus });

    res.status(200).json(
        new ApiResponse(200, { trip }, "Trip completed successfully")
    );
});

const cancelTrip = asyncHandler(async (req, res) => {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
        throw new ApiError(404, "Trip not found");
    }

    if (trip.status === "Completed" || trip.status === "Cancelled") {
        throw new ApiError(400, `Trip cannot be cancelled. Current status: ${trip.status}`);
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    const driver = await Driver.findById(trip.driverId);
    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }

    trip.status = "Cancelled";
    await trip.save();

    vehicle.status = "Available";
    await vehicle.save({ validateModifiedOnly: true });

    driver.AvailabilityStatus = "Available";
    await driver.save({ validateModifiedOnly: true });

    await publishEvent("vehicle.updated", { vehicleId: vehicle._id, status: vehicle.status });
    await publishEvent("driver.updated", { driverId: driver._id, AvailabilityStatus: driver.AvailabilityStatus });

    res.status(200).json(
        new ApiResponse(200, { trip }, "Trip cancelled successfully")
    );
});

export {
    createNewTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
};
