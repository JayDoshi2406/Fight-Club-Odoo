package net.engineeringdigest.journalApp.services;

import net.engineeringdigest.journalApp.documents.Trip;
import net.engineeringdigest.journalApp.repositories.TripRepository;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.time.Instant;
import java.util.List;

@Service
public class ReportService {

    private final TripRepository tripRepository;

    public ReportService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public String exportOperationalData(Instant dateFrom, Instant dateTo, String region, String vehicleId) {
        List<Trip> trips;

        if (vehicleId != null && !vehicleId.isEmpty()) {
            if (dateFrom != null && dateTo != null) {
                trips = tripRepository.findByVehicleIdAndCompletedAtBetween(vehicleId, dateFrom, dateTo);
            } else {
                trips = tripRepository.findByVehicleId(vehicleId);
            }
        } else if (dateFrom != null && dateTo != null) {
            trips = tripRepository.findByCompletedAtBetween(dateFrom, dateTo);
        } else {
            trips = tripRepository.findAll();
        }

        StringWriter sw = new StringWriter();
        sw.write("id,vehicleId,driverId,cargoWeight,status,startOdometer,finalOdometer,dispatchedAt,completedAt\n");

        for (Trip t : trips) {
            sw.write(String.join(",",
                    safe(t.getId()),
                    safe(t.getVehicleId()),
                    safe(t.getDriverId()),
                    safe(t.getCargoWeight()),
                    safe(t.getStatus()),
                    safe(t.getStartOdometer()),
                    safe(t.getFinalOdometer()),
                    safe(t.getDispatchedAt()),
                    safe(t.getCompletedAt())
            ));
            sw.write("\n");
        }

        return sw.toString();
    }

    private String safe(Object value) {
        return value == null ? "" : value.toString();
    }
}

