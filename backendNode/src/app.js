import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import tripRouter from "./routes/trip.routes.js";
import maintenanceRouter from "./routes/maintenance.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/trips", tripRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/analytics", analyticsRouter);

export { app };
