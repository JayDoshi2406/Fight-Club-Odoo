import mongoose, { Schema } from "mongoose";

const fuelExpenseSchema = new Schema(
    {
        vehicleId: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        liters: {
            type: Number,
            required: true,
        },
        cost: { 
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const FuelExpense = mongoose.model("FuelExpense", fuelExpenseSchema);