package com.corpbank.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "clients")
public class Client {
    @Id
    private String id;

    private String companyName;
    private String industry;
    private String address;
    private Double annualTurnover;

    // We store the ID of the RM who owns this client
    private String rmId;

    // Embedded Contact Details
    private Contact primaryContact;

    private boolean documentsSubmitted = false;
}
