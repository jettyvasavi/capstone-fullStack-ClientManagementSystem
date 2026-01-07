package com.corpbank.controller;

import com.corpbank.dto.ClientRequest;
import com.corpbank.model.Client;
import com.corpbank.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    @Autowired private ClientService clientService;

    @PostMapping("/api/rm/clients")
    @PreAuthorize("hasRole('RM')")
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.createClient(request));
    }

    @GetMapping("/api/clients")
    @PreAuthorize("hasAnyRole('RM', 'ANALYST')")
    public ResponseEntity<List<Client>> getClients(@RequestParam(required = false) String name) {
        if (name != null) {
            return ResponseEntity.ok(clientService.searchMyClients(name));
        }
        return ResponseEntity.ok(clientService.getMyClients());
    }

    @GetMapping("/api/clients/{id}")
    @PreAuthorize("hasAnyRole('RM', 'ANALYST')")
    public ResponseEntity<Client> getClient(@PathVariable String id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PutMapping("/api/clients/{id}")
    @PreAuthorize("hasRole('RM')")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }
}
