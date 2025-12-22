package com.corpbank.service;

import com.corpbank.dto.CreditRequestDto;
import com.corpbank.model.CreditRequest;
import com.corpbank.model.RequestStatus;
import com.corpbank.model.User;
import com.corpbank.repository.CreditRepository;
import com.corpbank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditService {
    @Autowired private CreditRepository creditRepository;
    @Autowired private UserRepository userRepository;

    private User getCurrentUser() {
        UserDetails details = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByUsername(details.getUsername()).orElseThrow();
    }

    public CreditRequest createRequest(CreditRequestDto dto) {
        CreditRequest req = new CreditRequest();
        req.setClientId(dto.getClientId());
        req.setRequestAmount(dto.getRequestAmount());
        req.setTenureMonths(dto.getTenureMonths());
        req.setPurpose(dto.getPurpose());

        req.setSubmittedBy(getCurrentUser().getId());

        return creditRepository.save(req);
    }

    // Get Requests
    public List<CreditRequest> getRequests() {
        User user = getCurrentUser();
        if (user.getRole().name().equals("RM")) {
            return creditRepository.findBySubmittedBy(user.getId());
        }
        return creditRepository.findAll();
    }

    // Update Status
    public CreditRequest processRequest(String id, String status, String remarks) {
        CreditRequest req = creditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus(RequestStatus.valueOf(status));
        req.setRemarks(remarks);

        return creditRepository.save(req);
    }

    public CreditRequest getRequestById(String id) {
        CreditRequest req = creditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit Request not found"));

        User user = getCurrentUser();
        if (user.getRole().name().equals("RM") && !req.getSubmittedBy().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Access Denied: You can only view your own requests.");
        }

        return req;
    }
}
