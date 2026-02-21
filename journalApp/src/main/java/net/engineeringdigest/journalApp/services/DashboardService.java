package net.engineeringdigest.journalApp.services;

import net.engineeringdigest.journalApp.documents.Vehicle;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleStatus;
import net.engineeringdigest.journalApp.dto.FleetKpisResponse;
import net.engineeringdigest.journalApp.messaging.RedisMessagePublisher;
import net.engineeringdigest.journalApp.repositories.VehicleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final RedisMessagePublisher redisPublisher;
    private final ObjectMapper objectMapper;

    public DashboardService(VehicleRepository vehicleRepository,
                            RedisMessagePublisher redisPublisher,
                            ObjectMapper objectMapper) {
        this.vehicleRepository = vehicleRepository;
        this.redisPublisher = redisPublisher;
        this.objectMapper = objectMapper;
    }

    public FleetKpisResponse getFleetKpis() {
        List<Vehicle> allVehicles = vehicleRepository.findAll();

        long available = allVehicles.stream().filter(v -> v.getStatus() == VehicleStatus.Available).count();
        long onTrip = allVehicles.stream().filter(v -> v.getStatus() == VehicleStatus.On_Trip).count();
        long inShop = allVehicles.stream().filter(v -> v.getStatus() == VehicleStatus.In_Shop).count();

        long total = allVehicles.size();
        double utilizationRate = total > 0 ? (double) onTrip / total * 100.0 : 0.0;

        FleetKpisResponse kpis = new FleetKpisResponse(available, onTrip, inShop, utilizationRate);

        try {
            redisPublisher.publish("dashboard.updated", objectMapper.writeValueAsString(kpis));
        } catch (Exception ignored) {
        }

        return kpis;
    }
}

