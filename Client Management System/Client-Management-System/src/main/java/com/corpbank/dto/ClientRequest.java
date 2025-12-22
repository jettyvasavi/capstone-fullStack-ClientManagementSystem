package com.corpbank.dto;

import com.corpbank.model.Contact; // Reuse the model class or create a separate DTO
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClientRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Industry is required")
    private String industry;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Annual turnover is required")
    @Min(value = 0, message = "Turnover must be positive")
    private Double annualTurnover;

    @NotNull(message = "Primary contact is required")
    private Contact primaryContact;
}
