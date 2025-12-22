package com.corpbank.service;

import com.corpbank.dto.ClientRequest;
import com.corpbank.model.Client;
import com.corpbank.repository.ClientRepository;
import com.corpbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    @Autowired private ClientRepository clientRepository;
    @Autowired private UserRepository userRepository;

    private String getCurrentUserId() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow().getId();
    }

    public Client createClient(ClientRequest request) {
        Client client = new Client();
        client.setCompanyName(request.getCompanyName());
        client.setIndustry(request.getIndustry());
        client.setAddress(request.getAddress());
        client.setAnnualTurnover(request.getAnnualTurnover());
        client.setPrimaryContact(request.getPrimaryContact());
        // Auto-assign RM
        client.setRmId(getCurrentUserId());
        client.setDocumentsSubmitted(true);

        return clientRepository.save(client);
    }

    public List<Client> getMyClients() {
        return clientRepository.findByRmId(getCurrentUserId());
    }

    public Client getClientById(String id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
    }

    public List<Client> searchMyClients(String name) {
        String rmId = getCurrentUserId();
        return clientRepository.findByRmIdAndCompanyNameContainingIgnoreCase(rmId, name);
    }

    public Client updateClient(String id, ClientRequest request) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Security Check: Ensure the logged-in RM owns this client
        if (!client.getRmId().equals(getCurrentUserId())) {
            throw new RuntimeException("Access Denied: You cannot edit this client.");
        }

        client.setCompanyName(request.getCompanyName());
        client.setIndustry(request.getIndustry());
        client.setAddress(request.getAddress());
        client.setAnnualTurnover(request.getAnnualTurnover());
        client.setPrimaryContact(request.getPrimaryContact());

        return clientRepository.save(client);
    }
}
