package com.keykomi.webblog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Login cannot be blank")
        @Size(min = 3, max = 100, message = "Login must be between 3 and 100 characters")
        String login,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        String password
) {}