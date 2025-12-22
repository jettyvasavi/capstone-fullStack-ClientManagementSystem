package com.corpbank.controller;

import com.corpbank.config.JwtUtils;
import com.corpbank.dto.SignupRequest;
import com.corpbank.model.Role;
import com.corpbank.model.User;
import com.corpbank.repository.UserRepository;
import com.corpbank.dto.LoginRequest;
import com.corpbank.dto.JwtResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost")
public class AuthController {

    @Autowired AuthenticationManager authenticationManager;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        String jwt = jwtUtils.generateToken(loginRequest.getUsername());
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getUsername(), user.getRole().name()));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Check if username exists
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // Create new User
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        String strRole = signUpRequest.getRole();

        if (strRole == null || strRole.isEmpty()) {
            // Default to RM if nothing is provided
            user.setRole(Role.RM);
        } else {
            try {
                // Role.valueOf() throws an error if the value isn't in the Enum
                Role roleEnum = Role.valueOf(strRole.toUpperCase());
                user.setRole(roleEnum);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Error: Invalid Role! Choose: RM, ANALYST, ADMIN");
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }
}
