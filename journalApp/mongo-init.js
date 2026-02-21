// mongo-init.js — run against the fleetflow database

db = db.getSiblingDB("fleetflow");

// Vehicles collection indexes
db.vehicles.createIndex({ licensePlate: 1 }, { unique: true });
db.vehicles.createIndex({ status: 1 });
db.vehicles.createIndex({ region: 1 });

// Drivers collection (no extra indexes beyond _id)
db.createCollection("drivers");

// Trips collection
db.createCollection("trips");

// Service logs collection
db.createCollection("service_logs");

// Fuel expenses collection
db.createCollection("fuel_expenses");

print("FleetFlow MongoDB initialization complete.");

