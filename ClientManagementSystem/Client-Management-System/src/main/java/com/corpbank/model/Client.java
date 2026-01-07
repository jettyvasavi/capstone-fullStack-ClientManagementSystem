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

    private String rmId;

    private Contact primaryContact;

    private boolean documentsSubmitted = false;
}
