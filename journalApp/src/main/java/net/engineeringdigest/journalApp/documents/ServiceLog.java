package net.engineeringdigest.journalApp.documents;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "service_logs")
public class ServiceLog {

    @Id
    private String id;

    private String vehicleId;
    private String serviceType;
    private LocalDate date;
    private Double cost;
    private String notes;
}

