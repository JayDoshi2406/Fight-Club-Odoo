package net.engineeringdigest.journalApp.controllers;

import net.engineeringdigest.journalApp.dto.FleetKpisResponse;
import net.engineeringdigest.journalApp.services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/get-fleet-kpis")
    @PreAuthorize("hasAnyRole('Fleet_Manager','Dispatcher','Financial_Analyst')")
    public ResponseEntity<FleetKpisResponse> getFleetKpis() {
        return ResponseEntity.ok(dashboardService.getFleetKpis());
    }
}

