package com.corpbank;

import com.corpbank.dto.CreditRequestDto;
import com.corpbank.model.CreditRequest;
import com.corpbank.model.RequestStatus;
import com.corpbank.model.Role;
import com.corpbank.model.User;
import com.corpbank.repository.CreditRepository;
import com.corpbank.repository.UserRepository;
import com.corpbank.service.CreditService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreditServiceTest {

    @Mock private CreditRepository creditRepository;
    @Mock private UserRepository userRepository;
    @Mock private SecurityContext securityContext;
    @Mock private Authentication authentication;
    @Mock private UserDetails userDetails;

    @InjectMocks
    private CreditService creditService;

    // Helper to fake a logged-in user
    private void mockLoggedInUser(String username, String roleName, String userId) {
        // 1. Mock Security Context
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn(username);
        SecurityContextHolder.setContext(securityContext);

        // 2. Mock User Repo
        User mockUser = new User();
        mockUser.setId(userId);
        mockUser.setUsername(username);
        // Assuming Role is an Enum, if it's a String change to: mockUser.setRole(roleName);
        mockUser.setRole(Role.valueOf(roleName));

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
    }

    @Test
    void createRequest_ShouldSaveWithCurrentUserId() {
        // Arrange
        mockLoggedInUser("rm_user", "RM", "user-123");

        CreditRequestDto dto = new CreditRequestDto();
        dto.setClientId("client-1");
        dto.setRequestAmount(50000.0);
        dto.setTenureMonths(12);
        dto.setPurpose("Expansion");

        CreditRequest savedReq = new CreditRequest();
        savedReq.setId("req-1");
        savedReq.setSubmittedBy("user-123");

        when(creditRepository.save(any(CreditRequest.class))).thenReturn(savedReq);

        // Act
        CreditRequest result = creditService.createRequest(dto);

        // Assert
        assertNotNull(result);
        assertEquals("user-123", result.getSubmittedBy());
        verify(creditRepository).save(any(CreditRequest.class));
    }

    @Test
    void getRequests_AsRM_ShouldReturnOnlyOwnRequests() {
        // Arrange
        mockLoggedInUser("rm_user", "RM", "user-123");

        when(creditRepository.findBySubmittedBy("user-123"))
                .thenReturn(Arrays.asList(new CreditRequest(), new CreditRequest()));

        // Act
        List<CreditRequest> results = creditService.getRequests();

        // Assert
        assertEquals(2, results.size());
        verify(creditRepository).findBySubmittedBy("user-123"); // Verifies filtering happened
        verify(creditRepository, never()).findAll(); // Should NOT call findAll
    }

    @Test
    void getRequests_AsAnalyst_ShouldReturnAll() {
        // Arrange
        mockLoggedInUser("analyst_user", "ANALYST", "user-999");

        when(creditRepository.findAll())
                .thenReturn(Arrays.asList(new CreditRequest(), new CreditRequest(), new CreditRequest()));

        // Act
        List<CreditRequest> results = creditService.getRequests();

        // Assert
        assertEquals(3, results.size());
        verify(creditRepository).findAll(); // Verifies full list access
    }

    @Test
    void processRequest_ShouldUpdateStatus() {
        // Arrange
        String reqId = "req-1";
        CreditRequest existing = new CreditRequest();
        existing.setId(reqId);
        existing.setStatus(RequestStatus.PENDING); // Assuming Enum

        when(creditRepository.findById(reqId)).thenReturn(Optional.of(existing));
        when(creditRepository.save(any(CreditRequest.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        CreditRequest updated = creditService.processRequest(reqId, "APPROVED", "Looks good");

        // Assert
        assertEquals(RequestStatus.APPROVED, updated.getStatus());
        assertEquals("Looks good", updated.getRemarks());
    }

    @Test
    void getRequestById_RM_AccessingOwnRequest_Success() {
        // Arrange
        mockLoggedInUser("rm_user", "RM", "user-123");

        CreditRequest req = new CreditRequest();
        req.setId("req-1");
        req.setSubmittedBy("user-123");

        when(creditRepository.findById("req-1")).thenReturn(Optional.of(req));

        // Act
        CreditRequest result = creditService.getRequestById("req-1");

        // Assert
        assertNotNull(result);
    }

}
