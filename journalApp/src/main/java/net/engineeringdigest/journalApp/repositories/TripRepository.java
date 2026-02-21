package net.engineeringdigest.journalApp.repositories;

import net.engineeringdigest.journalApp.documents.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface TripRepository extends MongoRepository<Trip, String> {

    List<Trip> findByCompletedAtBetween(Instant from, Instant to);

    List<Trip> findByVehicleId(String vehicleId);

    List<Trip> findByVehicleIdAndCompletedAtBetween(String vehicleId, Instant from, Instant to);
}

