package net.engineeringdigest.journalApp.controllers;

import net.engineeringdigest.journalApp.documents.Driver;
import net.engineeringdigest.journalApp.dto.DriverOnboardRequest;
import net.engineeringdigest.journalApp.dto.DutyStatusUpdateRequest;
import net.engineeringdigest.journalApp.dto.LicenseComplianceResponse;
import net.engineeringdigest.journalApp.services.DriverService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/get-all-profiles")
    @PreAuthorize("hasAnyRole('Fleet_Manager','Dispatcher','Safety_Office')")
    public ResponseEntity<List<Driver>> getAllProfiles() {
        return ResponseEntity.ok(driverService.getAllProfiles());
    }

    @PostMapping("/onboard-new-driver")
    @PreAuthorize("hasAnyRole('Fleet_Manager','Safety_Office')")
    public ResponseEntity<Driver> onboardNewDriver(
            @Valid @RequestBody DriverOnboardRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(driverService.onboardNewDriver(request, userId));
    }

    @PatchMapping("/update-duty-status/{driverId}")
    @PreAuthorize("hasAnyRole('Safety_Office','Fleet_Manager')")
    public ResponseEntity<Driver> updateDutyStatus(
            @PathVariable String driverId,
            @Valid @RequestBody DutyStatusUpdateRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(driverService.updateDutyStatus(driverId, request, userId));
    }

    @GetMapping("/verify-license-compliance/{driverId}")
    @PreAuthorize("hasAnyRole('Dispatcher','Safety_Office')")
    public ResponseEntity<LicenseComplianceResponse> verifyLicenseCompliance(
            @PathVariable String driverId,
            @RequestParam(required = false) String vehicleType) {
        return ResponseEntity.ok(driverService.verifyLicenseCompliance(driverId, vehicleType));
    }
}

