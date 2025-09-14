package com.keykomi.webblog.service;

import com.keykomi.webblog.dto.ArticleDTO;
import com.keykomi.webblog.entity.Article;
import com.keykomi.webblog.repository.ArticleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Page<ArticleDTO> getArticlesByPage(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return articleRepository.findAll(pageable)
            .map(this::toDTO);
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
        existing.setTags(dto.getTags());
        existing.setAuthor(dto.getAuthor());

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
        if (dto.getTags() != null) {
            existing.setTags(dto.getTags());
        }
        if (dto.getAuthor() != null) {
            existing.setAuthor(dto.getAuthor());
        }

        return toDTO(articleRepository.save(existing));
    }

    @Transactional
    public ArticleDTO incrementReadCount(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));

        // Инкрементируем счетчик
        Long newReadCount = (article.getReadCount() != null ? article.getReadCount() : 0L) + 1;
        article.setReadCount(newReadCount);

        // Сохраняем изменения
        Article savedArticle = articleRepository.save(article);

        return toDTO(savedArticle);
    }

    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("Article not found: " + id);
        }
        articleRepository.deleteById(id);
    }

    private ArticleDTO toDTO(Article article) {
        ArticleDTO dto = new ArticleDTO();

        dto.setId(article.getId());
        dto.setTitle(article.getTitle());
        dto.setContent(article.getContent());
        dto.setReadCount(article.getReadCount());
        dto.setPublishedAt(article.getPublishedAt());
        dto.setImageUrl(article.getImageUrl());
        dto.setTags(article.getTags());
        dto.setAuthor(article.getAuthor());

        return dto;
    }

    private Article toEntity(ArticleDTO dto) {
        Article article = new Article();

        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        article.setReadCount(dto.getReadCount());
        article.setImageUrl(dto.getImageUrl());
        article.setTags(dto.getTags());
        article.setAuthor(dto.getAuthor());

        // Если дата не указана, устанавливаем текущую
        if (dto.getPublishedAt() == null) {
            article.setPublishedAt(LocalDateTime.now());
        } else {
            article.setPublishedAt(dto.getPublishedAt());
        }

        return article;
    }
}
