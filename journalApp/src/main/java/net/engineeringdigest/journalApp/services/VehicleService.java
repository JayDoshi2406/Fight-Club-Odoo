package net.engineeringdigest.journalApp.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.engineeringdigest.journalApp.documents.Vehicle;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleStatus;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleType;
import net.engineeringdigest.journalApp.dto.VehicleRegistrationRequest;
import net.engineeringdigest.journalApp.dto.VehicleUpdateRequest;
import net.engineeringdigest.journalApp.messaging.RedisMessagePublisher;
import net.engineeringdigest.journalApp.repositories.VehicleRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final MongoTemplate mongoTemplate;
    private final RedisMessagePublisher redisPublisher;
    private final ObjectMapper objectMapper;

    public VehicleService(VehicleRepository vehicleRepository,
                          MongoTemplate mongoTemplate,
                          RedisMessagePublisher redisPublisher,
                          ObjectMapper objectMapper) {
        this.vehicleRepository = vehicleRepository;
        this.mongoTemplate = mongoTemplate;
        this.redisPublisher = redisPublisher;
        this.objectMapper = objectMapper;
    }

    public List<Vehicle> getAllAssets(VehicleType vehicleType, VehicleStatus status, String region) {
        Query query = new Query();
        if (vehicleType != null) {
            query.addCriteria(Criteria.where("vehicleType").is(vehicleType));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (region != null && !region.isEmpty()) {
            query.addCriteria(Criteria.where("region").is(region));
        }
        return mongoTemplate.find(query, Vehicle.class);
    }

    public Vehicle registerNewAsset(VehicleRegistrationRequest request, String userId) {
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "License plate already exists");
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setName(request.getName());
        vehicle.setModel(request.getModel());
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setRegion(request.getRegion());
        vehicle.setMaxLoadCapacity(request.getMaxLoadCapacity());
        vehicle.setAcquisitionCost(request.getAcquisitionCost());
        vehicle.setCreatedBy(userId);

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateAssetDetails(String vehicleId, VehicleUpdateRequest request, String userId) {
        Query query = new Query(Criteria.where("id").is(vehicleId));
        Update update = new Update();
        update.set("updatedBy", userId);
        update.set("updatedAt", Instant.now());

        if (request.getModel() != null) {
            update.set("model", request.getModel());
        }
        if (request.getOdometerDelta() != null) {
            update.inc("odometer", request.getOdometerDelta());
        }
        if (request.getMaxLoadCapacity() != null) {
            update.set("maxLoadCapacity", request.getMaxLoadCapacity());
        }
        if (request.getRegion() != null) {
            update.set("region", request.getRegion());
        }

        mongoTemplate.updateFirst(query, update, Vehicle.class);

        Vehicle updated = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        publishVehicleUpdate(updated);
        return updated;
    }

    public Vehicle toggleRetirementStatus(String vehicleId, String userId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        if (vehicle.getStatus() == VehicleStatus.Out_of_Service) {
            vehicle.setStatus(VehicleStatus.Available);
        } else if (vehicle.getStatus() == VehicleStatus.Available) {
            vehicle.setStatus(VehicleStatus.Out_of_Service);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Can only toggle between Available and Out_of_Service");
        }

        vehicle.setUpdatedBy(userId);
        Vehicle saved = vehicleRepository.save(vehicle);
        publishVehicleUpdate(saved);
        return saved;
    }

    public List<Vehicle> getAvailableForDispatch() {
        return vehicleRepository.findByStatus(VehicleStatus.Available);
    }

    private void publishVehicleUpdate(Vehicle vehicle) {
        try {
            redisPublisher.publish("vehicle.updated", objectMapper.writeValueAsString(vehicle));
        } catch (Exception ignored) {
        }
    }
}

