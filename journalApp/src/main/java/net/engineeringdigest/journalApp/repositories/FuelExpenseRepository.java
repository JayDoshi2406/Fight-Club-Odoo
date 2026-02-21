package net.engineeringdigest.journalApp.repositories;

import net.engineeringdigest.journalApp.documents.FuelExpense;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FuelExpenseRepository extends MongoRepository<FuelExpense, String> {
}

