package com.keykomi.webblog.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:3000"})
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "UP",
                "message", "Backend is running"
        );
    }

    @GetMapping("/health/articles")
    public Map<String, Object> getArticles() {
        return Map.of(
                "articles", new Object[0],  // Пустой массив для начала
                "total", 0,
                "page", 1,
                "limit", 10
        );
    }
}