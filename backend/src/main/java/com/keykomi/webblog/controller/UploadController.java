package com.keykomi.webblog.controller;

import com.keykomi.webblog.service.UploadService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String url = uploadService.uploadImage(file);
        return Map.of("url", url);
    }
}
