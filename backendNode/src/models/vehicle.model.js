import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        model: {
            type: String,
            required: true,
            trim: true,
        },
        licensePlate: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        vehicleType: {
            type: String,
            enum: ["Truck", "Van", "Bike"],
            required: true,
            trim: true,
        },
        region: {
            type: String,
            required: true,
            trim: true,
        },
        maxLoadCapacity: {
            type: Number,
            required: true,
        },
        odometer: {
            type: Number,
            required: true,
            default: 0,
        },
        acquisitionCost: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Available", "On Trip", "In Shop", "Out of Service"],
            default: "Available",
        }
    },
    { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);