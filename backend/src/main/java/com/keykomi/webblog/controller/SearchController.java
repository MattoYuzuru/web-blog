package com.keykomi.webblog.controller;

import com.keykomi.webblog.dto.PaginatedResponse;
import com.keykomi.webblog.entity.Article;
import com.keykomi.webblog.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/search")
    public PaginatedResponse<Article> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        Page<Article> result = searchService.searchArticles(q, page, limit);

        return new PaginatedResponse<>(
                result.getContent(),
                result.getTotalElements(),
                result.getNumber(),
                result.getSize()
        );
    }
}
