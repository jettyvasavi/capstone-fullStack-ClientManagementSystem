package com.corpbank.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "credit_requests")
public class CreditRequest {
    @Id
    private String id;

    private String clientId;
    private String submittedBy;

    private Double requestAmount;
    private Integer tenureMonths;
    private String purpose;

    private RequestStatus status = RequestStatus.PENDING;

    private String remarks;
    private LocalDateTime createdAt = LocalDateTime.now();
}
