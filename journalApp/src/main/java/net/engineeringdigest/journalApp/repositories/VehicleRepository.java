package net.engineeringdigest.journalApp.repositories;

import net.engineeringdigest.journalApp.documents.Vehicle;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleStatus;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {

    List<Vehicle> findByStatus(VehicleStatus status);

    List<Vehicle> findByVehicleType(VehicleType vehicleType);

    List<Vehicle> findByRegion(String region);

    boolean existsByLicensePlate(String licensePlate);
}

