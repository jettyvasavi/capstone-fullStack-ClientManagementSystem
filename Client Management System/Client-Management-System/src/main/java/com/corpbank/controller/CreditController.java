package com.corpbank.controller;

import com.corpbank.dto.CreditRequestDto;
import com.corpbank.model.CreditRequest;
import com.corpbank.service.CreditService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/credit-requests")
@CrossOrigin(origins = "http://localhost:4200")
public class CreditController {

    @Autowired private CreditService creditService;

    // Create Request
    @PostMapping
    @PreAuthorize("hasRole('RM')")
    public ResponseEntity<CreditRequest> create(@Valid @RequestBody CreditRequestDto dto) {
        return ResponseEntity.ok(creditService.createRequest(dto));
    }

    // View All (RM -> Own, Analyst -> All)
    @GetMapping
    @PreAuthorize("hasAnyRole('RM', 'ANALYST')")
    public ResponseEntity<List<CreditRequest>> getAll() {

        return ResponseEntity.ok(creditService.getRequests());
    }

    // Get Single Request
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RM', 'ANALYST')")
    public ResponseEntity<CreditRequest> getSingle(@PathVariable String id) {
        return ResponseEntity.ok(creditService.getRequestById(id));
    }

    // Update Status
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ANALYST')")
    public ResponseEntity<CreditRequest> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> updatePayload) {

        return ResponseEntity.ok(creditService.processRequest(
                id,
                updatePayload.get("status"),
                updatePayload.get("remarks")
        ));
    }
}
