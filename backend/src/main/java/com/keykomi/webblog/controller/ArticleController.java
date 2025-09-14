package com.keykomi.webblog.controller;

import com.keykomi.webblog.dto.ArticleDTO;
import com.keykomi.webblog.service.ArticleService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        return articleService.getArticlesByPage(page, limit);
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

    /**
     * Инкрементировать счетчик прочтений статьи
     * Этот эндпоинт вызывается когда пользователь "прочитал" статью
     * (прокрутил до конца и провел на странице больше минуты)
     * POST /api/articles/{id}/increment-read
     */
    @PostMapping("/{id}/increment-read")
    public ResponseEntity<Map<String, Object>> incrementReadCount(@PathVariable Long id) {
        try {
            ArticleDTO updatedArticle = articleService.incrementReadCount(id);

            Map<String, Object> response = new HashMap<>();
            response.put("readCount", updatedArticle.getReadCount());
            response.put("success", true);
            response.put("message", "Read count incremented successfully");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Article not found");
            errorResponse.put("readCount", 0);

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to increment read count");
            errorResponse.put("readCount", 0);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}