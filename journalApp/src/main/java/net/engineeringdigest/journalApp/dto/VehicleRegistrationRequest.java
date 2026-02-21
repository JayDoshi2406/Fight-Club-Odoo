package net.engineeringdigest.journalApp.dto;

import lombok.Data;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class VehicleRegistrationRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String model;

    @NotBlank
    private String licensePlate;

    @NotNull
    private VehicleType vehicleType;

    private String region;
    private Double maxLoadCapacity;
    private Double acquisitionCost;
}

