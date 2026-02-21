import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        licenseCategory: {
            type: String,
            required: true,
            trim: true,
        },
        licenseExpiryDate: {
            type: Date,
            required: true,
        },
        safetyScore: {
            type: Number,
            default: 100,
        },
        tripCompletionRate: {
            type: Number,
            default: 0,
        },
        dutyStatus: {
            type: String,
            enum: ["On Duty", "Off Duty", "Suspended"],
            default: "On Duty",
        },
        AvailabilityStatus: {
            type: String,
            enum: ["Available", "On_Trip"],
            default: "Available",
        },
    },
    { timestamps: true }
);

export const Driver = mongoose.model("Driver", driverSchema);