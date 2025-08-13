package com.keykomi.webblog.controller;

import com.keykomi.webblog.dto.ArticleDTO;
import com.keykomi.webblog.service.ArticleService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    // 1. Получить все статьи
    @GetMapping("/all")
    public List<ArticleDTO> getAllArticles() {
        return articleService.getAllArticles();
    }

    // 2. Получить статьи по пагинации
    @GetMapping
    public Page<ArticleDTO> getArticlesByPage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return articleService.getArticlesByPage(page, limit);
    }

    // 3. Получить статью по ID
    @GetMapping("/{id}")
    public ArticleDTO getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id);
    }

    // 4. Создать статью
    @PostMapping
    public ArticleDTO createArticle(@RequestBody ArticleDTO dto) {
        return articleService.createArticle(dto);
    }

    // 5. Полное обновление статьи
    @PutMapping("/{id}")
    public ArticleDTO updateArticle(@PathVariable Long id, @RequestBody ArticleDTO dto) {
        return articleService.updateArticle(id, dto);
    }

    // 6. Частичное обновление статьи
    @PatchMapping("/{id}")
    public ArticleDTO partialUpdateArticle(@PathVariable Long id, @RequestBody ArticleDTO dto) {
        return articleService.partialUpdateArticle(id, dto);
    }

    // 7. Удалить статью
    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
    }
}
