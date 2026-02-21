package net.engineeringdigest.journalApp.controllers;

import net.engineeringdigest.journalApp.services.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/export-operational-data")
    @PreAuthorize("hasAnyRole('Fleet_Manager','Financial_Analyst')")
    public ResponseEntity<byte[]> exportOperationalData(
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String vehicleId) {

        Instant from = dateFrom != null ? Instant.parse(dateFrom) : null;
        Instant to = dateTo != null ? Instant.parse(dateTo) : null;

        String csv = reportService.exportOperationalData(from, to, region, vehicleId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=operational_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes());
    }
}

