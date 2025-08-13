package com.keykomi.webblog.controller;

import com.keykomi.webblog.dto.ApiResponse;
import com.keykomi.webblog.dto.LoginRequest;
import com.keykomi.webblog.dto.LoginResponse;
import com.keykomi.webblog.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for user: {}", loginRequest.login());

        LoginResponse response = authService.authenticateUser(loginRequest);

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}