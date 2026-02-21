import mongoose, { Schema } from "mongoose";

const serviceLogSchema = new Schema(
    {
        vehicleId: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        serviceType: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        cost: {
            type: Number,
            required: true,
        },
        notes: { 
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export const ServiceLog = mongoose.model("ServiceLog", serviceLogSchema);