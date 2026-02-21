package net.engineeringdigest.journalApp.documents;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "fuel_expenses")
public class FuelExpense {

    @Id
    private String id;

    private String vehicleId;
    private String tripId;
    private LocalDate date;
    private Double liters;
    private Double cost;
}

