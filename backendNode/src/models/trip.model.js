import mongoose, { Schema } from "mongoose";

const tripSchema = new Schema(
    {
        vehicleId: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: "Driver",
            required: true,
        },
        cargoWeight: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Draft", "Dispatched", "Completed", "Cancelled"],
            default: "Draft",
        },
        startRegion: { type: String, required: true },
        endRegion: { type: String, required: true },
        startOdometer: { type: Number },
        finalOdometer: { type: Number },
        dispatchedAt: { type: Date },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);