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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!user.isActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Your account has been deactivated. Please contact the Admin.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }

        String jwt = jwtUtils.generateToken(loginRequest.getUsername());

        return ResponseEntity.ok(
                new JwtResponse(jwt, user.getId(), user.getUsername(), user.getRole().name())
        );
    }


    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        String strRole = signUpRequest.getRole();

        if (strRole == null || strRole.isEmpty()) {
            user.setRole(Role.RM);
        } else {
            try {
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
