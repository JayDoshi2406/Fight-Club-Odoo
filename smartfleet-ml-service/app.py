from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib

fuel_model = joblib.load("models/fuel_model.pkl")
duration_model = joblib.load("models/duration_model.pkl")
delay_model = joblib.load("models/delay_model.pkl")
maintenance_model = joblib.load("models/maintenance_model.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")
app = FastAPI(title="SmartFleet AI Recommendation Engine")

class TripInput(BaseModel):
    distance: float
    load: float
    region: str
    month: int

capacity_map = {
    "Truck": 15000,
    "Van": 4000,
    "Bike": 200
}

vehicle_efficiency_map = {
    "Truck": 3.5,
    "Van": 7.5,
    "Bike": 35
}

# ==============================
# Feature Builder
# ==============================

def create_feature_vector(distance, load, region, vehicle, month):

    is_metro = 1 if "Metro" in region else 0
    is_monsoon = 1 if month in [6,7,8,9] else 0

    load_ratio = load / (capacity_map[vehicle] + 1e-5)
    heavy_load = 1 if load_ratio > 0.8 else 0

    df = pd.DataFrame(np.zeros((1, len(feature_columns))), columns=feature_columns)
    df = df.astype(float)

    data = {
        "trip_distance": distance,
        "distance_log": np.log1p(distance),
        "distance_squared": distance**2,
        "cargoWeight": load,
        "load_log": np.log1p(load),
        "load_ratio": load_ratio,
        "heavy_load": heavy_load,
        "load_distance_interaction": load * distance,
        "urban_heavy_interaction": heavy_load * is_metro,
        "season_traffic_interaction": is_monsoon * is_metro,
        "month_sin": np.sin(2 * np.pi * month / 12),
        "month_cos": np.cos(2 * np.pi * month / 12),
        "fuel_base_estimate": 90 / vehicle_efficiency_map[vehicle]
    }

    for col in data:
        if col in df.columns:
            df.loc[0, col] = data[col]

    vehicle_col = f"vehicleType_{vehicle}"
    if vehicle_col in df.columns:
        df.loc[0, vehicle_col] = 1.0

    region_col = f"region_{region}"
    if region_col in df.columns:
        df.loc[0, region_col] = 1.0

    return df

def compute_score(fuel, delay, maintenance, duration):
    
    fuel_norm = fuel / 10000
    delay_norm = delay
    maintenance_norm = maintenance
    duration_norm = duration / 24
    
    score = (
        0.4 * fuel_norm +
        0.25 * delay_norm +
        0.2 * maintenance_norm +
        0.15 * duration_norm
    )
    
    return score


# ==============================
# Recommendation Endpoint
# ==============================

@app.post("/recommend")
def recommend_vehicle(input_data: TripInput):

    results = []

    for vehicle in capacity_map.keys():

        if input_data.load > capacity_map[vehicle]:
            continue

        features = create_feature_vector(
            input_data.distance,
            input_data.load,
            input_data.region,
            vehicle,
            input_data.month
        )

        fuel_log = fuel_model.predict(features)[0]
        fuel = np.expm1(fuel_log)

        duration = duration_model.predict(features)[0]
        delay = delay_model.predict_proba(features)[0][1]
        maintenance = maintenance_model.predict_proba(features)[0][1]

        score = compute_score(fuel, delay, maintenance, duration)

        results.append({
            "vehicle": vehicle,
            "fuel_cost": round(float(fuel), 2),
            "duration_hours": round(float(duration), 2),
            "delay_probability": round(float(delay), 3),
            "maintenance_risk": round(float(maintenance), 3),
            "score": round(float(score), 3)
        })

    if not results:
        return {"error": "No suitable vehicle for given load."}

    best = sorted(results, key=lambda x: x["score"])[0]

    return {
        "recommended_vehicle": best["vehicle"],
        "reason": best,
        "all_options": results
    }