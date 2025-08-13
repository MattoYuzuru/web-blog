package com.keykomi.webblog.service;

import com.keykomi.webblog.dto.LoginRequest;
import com.keykomi.webblog.dto.LoginResponse;
import com.keykomi.webblog.entity.User;
import com.keykomi.webblog.exception.AuthenticationException;
import com.keykomi.webblog.repository.UserRepository;
import com.keykomi.webblog.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final String TOKEN_TYPE = "Bearer";

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.login(),
                            loginRequest.password()
                    )
            );

            String username = authentication.getName();

            // Find user to get additional details
            User user = userRepository.findByUsernameOrMail(loginRequest.login())
                    .orElseThrow(() -> new AuthenticationException("User not found"));

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(username);

            logger.info("User '{}' authenticated successfully", username);

            return new LoginResponse(
                    token,
                    TOKEN_TYPE,
                    jwtTokenProvider.getExpirationTime(),
                    user.getUsername(),
                    user.getMail()
            );

        } catch (BadCredentialsException e) {
            logger.warn("Authentication failed for user: {}", loginRequest.login());
            throw new AuthenticationException("Invalid credentials");
        } catch (Exception e) {
            logger.error("Authentication error for user: {}", loginRequest.login(), e);
            throw new AuthenticationException("Authentication failed");
        }
    }
}