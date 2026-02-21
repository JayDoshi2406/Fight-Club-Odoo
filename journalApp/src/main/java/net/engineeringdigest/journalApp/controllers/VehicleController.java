package net.engineeringdigest.journalApp.controllers;

import net.engineeringdigest.journalApp.documents.Vehicle;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleStatus;
import net.engineeringdigest.journalApp.documents.Vehicle.VehicleType;
import net.engineeringdigest.journalApp.dto.VehicleRegistrationRequest;
import net.engineeringdigest.journalApp.dto.VehicleUpdateRequest;
import net.engineeringdigest.journalApp.services.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping("/get-all-assets")
    @PreAuthorize("hasAnyRole('Fleet_Manager','Dispatcher','Safety_Office')")
    public ResponseEntity<List<Vehicle>> getAllAssets(
            @RequestParam(required = false) VehicleType vehicleType,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String region) {
        return ResponseEntity.ok(vehicleService.getAllAssets(vehicleType, status, region));
    }

    @PostMapping("/register-new-asset")
    @PreAuthorize("hasRole('Fleet_Manager')")
    public ResponseEntity<Vehicle> registerNewAsset(
            @Valid @RequestBody VehicleRegistrationRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.registerNewAsset(request, userId));
    }

    @PatchMapping("/update-asset-details/{vehicleId}")
    @PreAuthorize("hasRole('Fleet_Manager')")
    public ResponseEntity<Vehicle> updateAssetDetails(
            @PathVariable String vehicleId,
            @RequestBody VehicleUpdateRequest request,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(vehicleService.updateAssetDetails(vehicleId, request, userId));
    }

    @PatchMapping("/toggle-retirement-status/{vehicleId}")
    @PreAuthorize("hasRole('Fleet_Manager')")
    public ResponseEntity<Vehicle> toggleRetirementStatus(
            @PathVariable String vehicleId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(vehicleService.toggleRetirementStatus(vehicleId, userId));
    }

    @GetMapping("/get-available-for-dispatch")
    @PreAuthorize("hasRole('Dispatcher')")
    public ResponseEntity<List<Vehicle>> getAvailableForDispatch() {
        return ResponseEntity.ok(vehicleService.getAvailableForDispatch());
    }
}

