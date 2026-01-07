package com.corpbank.repository;

import com.corpbank.model.CreditRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CreditRepository extends MongoRepository<CreditRequest, String> {

    List<CreditRequest> findBySubmittedBy(String userId);
}
