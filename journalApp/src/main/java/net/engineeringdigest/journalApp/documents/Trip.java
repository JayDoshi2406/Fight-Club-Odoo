package net.engineeringdigest.journalApp.documents;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "trips")
public class Trip {

    @Id
    private String id;

    private String vehicleId;
    private String driverId;
    private Double cargoWeight;

    private TripStatus status = TripStatus.Draft;

    private Double startOdometer;
    private Double finalOdometer;

    private Instant dispatchedAt;
    private Instant completedAt;

    public enum TripStatus {
        Draft, Dispatched, Completed, Cancelled
    }
}

