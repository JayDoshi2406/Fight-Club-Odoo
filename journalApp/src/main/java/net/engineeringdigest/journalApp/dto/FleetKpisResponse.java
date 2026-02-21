package net.engineeringdigest.journalApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FleetKpisResponse {
    private long availableVehicles;
    private long onTripVehicles;
    private long inShopVehicles;
    private double utilizationRate;
}

