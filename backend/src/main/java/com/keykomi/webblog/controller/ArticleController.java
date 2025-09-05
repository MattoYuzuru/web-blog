package com.keykomi.webblog.controller;

import com.keykomi.webblog.dto.ArticleDTO;
import com.keykomi.webblog.service.ArticleService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    // Публичные методы (доступны всем)
    @GetMapping("/all")
    public List<ArticleDTO> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping
    public Page<ArticleDTO> getArticlesByPage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        // Исправляем пагинацию - Spring Data использует индексацию с 0
        int springPage = Math.max(0, page - 1);
        return articleService.getArticlesByPage(springPage, limit);
    }

    @GetMapping("/{id}")
    public ArticleDTO getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id);
    }

    // Методы только для авторизованных пользователей
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ArticleDTO createArticle(@RequestBody ArticleDTO dto) {
        return articleService.createArticle(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ArticleDTO updateArticle(@PathVariable Long id, @RequestBody ArticleDTO dto) {
        return articleService.updateArticle(id, dto);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ArticleDTO partialUpdateArticle(@PathVariable Long id, @RequestBody ArticleDTO dto) {
        return articleService.partialUpdateArticle(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
    }
}