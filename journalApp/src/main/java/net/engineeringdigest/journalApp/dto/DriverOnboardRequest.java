package net.engineeringdigest.journalApp.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Data
public class DriverOnboardRequest {

    @NotBlank
    private String name;

    private String licenseCategory;
    private LocalDate licenseExpiryDate;
}

