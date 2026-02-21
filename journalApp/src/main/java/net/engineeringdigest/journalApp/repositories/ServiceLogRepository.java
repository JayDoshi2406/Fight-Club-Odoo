package net.engineeringdigest.journalApp.repositories;

import net.engineeringdigest.journalApp.documents.ServiceLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ServiceLogRepository extends MongoRepository<ServiceLog, String> {
}

