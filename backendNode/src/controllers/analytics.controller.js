import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vehicle } from "../models/vehicle.model.js";
import { ServiceLog } from "../models/serviceLog.model.js";
import { FuelExpense } from "../models/fuelExpense.model.js";
import mongoose from "mongoose";

const calculateVehicleROI = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    const maintenanceCosts = await ServiceLog.aggregate([
        { $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId) } },
        { $group: { _id: null, total: { $sum: "$cost" } } },
    ]);

    const fuelCosts = await FuelExpense.aggregate([
        { $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId) } },
        { $group: { _id: null, total: { $sum: "$cost" } } },
    ]);

    const acquisitionCost = vehicle.acquisitionCost;
    const totalMaintenanceCost = maintenanceCosts[0]?.total || 0;
    const totalFuelCost = fuelCosts[0]?.total || 0;
    const totalCost = acquisitionCost + totalMaintenanceCost + totalFuelCost;

    const totalKm = vehicle.odometer || 0;
    const costPerKm = totalKm > 0 ? parseFloat((totalCost / totalKm).toFixed(2)) : 0;

    // Estimated ROI: negative means net loss; based on operating expenses vs acquisition
    const operatingCost = totalMaintenanceCost + totalFuelCost;
    const estimatedROI = acquisitionCost > 0
        ? parseFloat((((acquisitionCost - operatingCost) / acquisitionCost) * 100).toFixed(2))
        : 0;

    res.status(200).json(
        new ApiResponse(200, {
            vehicleId: vehicle._id,
            vehicleName: vehicle.name,
            acquisitionCost,
            totalMaintenanceCost,
            totalFuelCost,
            totalCost,
            totalKm,
            costPerKm,
            estimatedROI,
        }, "Vehicle ROI calculated successfully")
    );
});

export {
    calculateVehicleROI,
};
