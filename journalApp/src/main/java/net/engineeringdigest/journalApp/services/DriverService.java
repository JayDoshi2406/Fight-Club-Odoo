package net.engineeringdigest.journalApp.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.engineeringdigest.journalApp.documents.Driver;
import net.engineeringdigest.journalApp.documents.Driver.AvailabilityStatus;
import net.engineeringdigest.journalApp.documents.Driver.DutyStatus;
import net.engineeringdigest.journalApp.dto.DriverOnboardRequest;
import net.engineeringdigest.journalApp.dto.DutyStatusUpdateRequest;
import net.engineeringdigest.journalApp.dto.LicenseComplianceResponse;
import net.engineeringdigest.journalApp.messaging.RedisMessagePublisher;
import net.engineeringdigest.journalApp.repositories.DriverRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final RedisMessagePublisher redisPublisher;
    private final ObjectMapper objectMapper;

    public DriverService(DriverRepository driverRepository,
                         RedisMessagePublisher redisPublisher,
                         ObjectMapper objectMapper) {
        this.driverRepository = driverRepository;
        this.redisPublisher = redisPublisher;
        this.objectMapper = objectMapper;
    }

    public List<Driver> getAllProfiles() {
        return driverRepository.findAll();
    }

    public Driver onboardNewDriver(DriverOnboardRequest request, String userId) {
        Driver driver = new Driver();
        driver.setName(request.getName());
        driver.setLicenseCategory(request.getLicenseCategory());
        driver.setLicenseExpiryDate(request.getLicenseExpiryDate());
        driver.setSafetyScore(100);
        driver.setCreatedBy(userId);
        return driverRepository.save(driver);
    }

    public Driver updateDutyStatus(String driverId, DutyStatusUpdateRequest request, String userId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found"));

        DutyStatus newStatus = request.getDutyStatus();
        driver.setDutyStatus(newStatus);

        if (newStatus == DutyStatus.Suspended || newStatus == DutyStatus.Off_Duty) {
            driver.setAvailabilityStatus(AvailabilityStatus.Available);
        }

        driver.setUpdatedBy(userId);
        Driver saved = driverRepository.save(driver);
        publishDriverUpdate(saved);
        return saved;
    }

    public LicenseComplianceResponse verifyLicenseCompliance(String driverId, String vehicleType) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found"));

        if (driver.getLicenseExpiryDate() == null) {
            return new LicenseComplianceResponse(false, "License expiry date not set");
        }

        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            return new LicenseComplianceResponse(false, "License expired on " + driver.getLicenseExpiryDate());
        }

        if (vehicleType != null && !vehicleType.isEmpty() && driver.getLicenseCategory() != null) {
            if (!driver.getLicenseCategory().toLowerCase().contains(vehicleType.toLowerCase())) {
                return new LicenseComplianceResponse(false,
                        "License category '" + driver.getLicenseCategory() + "' may not cover vehicle type '" + vehicleType + "'");
            }
        }

        return new LicenseComplianceResponse(true, null);
    }

    private void publishDriverUpdate(Driver driver) {
        try {
            redisPublisher.publish("driver.updated", objectMapper.writeValueAsString(driver));
        } catch (Exception ignored) {
        }
    }
}

