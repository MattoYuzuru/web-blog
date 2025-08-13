package com.keykomi.webblog.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        T data,
        boolean success,
        String message
) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data, true, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(null, false, message);
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(data, false, message);
    }
}