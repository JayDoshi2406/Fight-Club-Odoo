package net.engineeringdigest.journalApp.dto;

import lombok.Data;

@Data
public class VehicleUpdateRequest {
    private String model;
    private Double odometerDelta;
    private Double maxLoadCapacity;
    private String region;
}

