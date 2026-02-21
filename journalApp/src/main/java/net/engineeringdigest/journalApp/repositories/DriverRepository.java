package net.engineeringdigest.journalApp.repositories;

import net.engineeringdigest.journalApp.documents.Driver;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DriverRepository extends MongoRepository<Driver, String> {
}

