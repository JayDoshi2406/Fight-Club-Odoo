package net.engineeringdigest.journalApp.documents;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Document(collection = "drivers")
public class Driver {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String licenseCategory;

    private LocalDate licenseExpiryDate;

    private Integer safetyScore = 100;

    private Double tripCompletionRate = 0.0;

    private DutyStatus dutyStatus = DutyStatus.Off_Duty;

    private AvailabilityStatus availabilityStatus = AvailabilityStatus.Available;

    private String createdBy;
    private String updatedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public enum DutyStatus {
        On_Duty, Off_Duty, Suspended
    }

    public enum AvailabilityStatus {
        Available, On_Trip
    }
}

