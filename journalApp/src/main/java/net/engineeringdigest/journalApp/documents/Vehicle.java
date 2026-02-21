package net.engineeringdigest.journalApp.documents;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.Instant;

@Data
@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String model;

    @Indexed(unique = true)
    @NotBlank
    private String licensePlate;

    @NotNull
    private VehicleType vehicleType;

    private String region;

    private Double maxLoadCapacity;

    private Double odometer = 0.0;

    private Double acquisitionCost;

    @Indexed
    private VehicleStatus status = VehicleStatus.Available;

    private String createdBy;
    private String updatedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public enum VehicleType {
        Truck, Van, Bike
    }

    public enum VehicleStatus {
        Available, On_Trip, In_Shop, Out_of_Service
    }
}

