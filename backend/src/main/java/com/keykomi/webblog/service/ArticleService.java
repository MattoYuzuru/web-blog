package com.keykomi.webblog.service;

import com.keykomi.webblog.dto.ArticleDTO;
import com.keykomi.webblog.entity.Article;
import com.keykomi.webblog.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<ArticleDTO> getAllArticles() {
        return articleRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ArticleDTO getArticleById(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found: " + id));
        return toDTO(article);
    }

    public ArticleDTO createArticle(ArticleDTO dto) {
        Article article = toEntity(dto);
        return toDTO(articleRepository.save(article));
    }

    public ArticleDTO updateArticle(Long id, ArticleDTO dto) {
        Article existing = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found: " + id));

        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        existing.setReadCount(dto.getReadCount());
        existing.setImageUrl(dto.getImageUrl());

        return toDTO(articleRepository.save(existing));
    }

    public ArticleDTO partialUpdateArticle(Long id, ArticleDTO dto) {
        Article existing = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found: " + id));

        if (dto.getTitle() != null) {
            existing.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null) {
            existing.setContent(dto.getContent());
        }
        if (dto.getReadCount() != null) {
            existing.setReadCount(dto.getReadCount());
        }
        if (dto.getImageUrl() != null) {
            existing.setImageUrl(dto.getImageUrl());
        }

        return toDTO(articleRepository.save(existing));
    }

    private ArticleDTO toDTO(Article article) {
        ArticleDTO dto = new ArticleDTO();

        dto.setId(article.getId());
        dto.setTitle(article.getTitle());
        dto.setContent(article.getContent());
        dto.setReadCount(article.getReadCount());
        dto.setPublishedAt(article.getPublishedAt());
        dto.setImageUrl(article.getImageUrl());

        return dto;
    }

    private Article toEntity(ArticleDTO dto) {
        Article article = new Article();

        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setReadCount(dto.getReadCount());
        article.setImageUrl(dto.getImageUrl());

        return article;
    }
}
