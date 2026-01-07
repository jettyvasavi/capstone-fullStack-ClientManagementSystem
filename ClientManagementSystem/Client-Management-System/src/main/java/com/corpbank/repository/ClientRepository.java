package com.corpbank.repository;

import com.corpbank.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ClientRepository extends MongoRepository<Client, String> {

    List<Client> findByRmId(String rmId);

    List<Client> findByRmIdAndCompanyNameContainingIgnoreCase(String rmId, String name);
}
