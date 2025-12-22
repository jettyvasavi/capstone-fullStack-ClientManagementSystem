package com.corpbank.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreditRequestDto {
    @NotBlank(message = "Client ID is required")
    private String clientId;

    @NotNull(message = "Amount is required")
    @Min(value = 1000, message = "Minimum request amount is 1000")
    private Double requestAmount;

    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Tenure must be at least 1 month")
    private Integer tenureMonths;

    @NotBlank(message = "Purpose is required")
    private String purpose;
}
