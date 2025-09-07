package com.keykomi.webblog.service;

import com.keykomi.webblog.entity.Article;
import com.keykomi.webblog.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final ArticleRepository articleRepository;

    public Page<Article> searchArticles(String q, int page, int limit) {
        int zeroBasedPage = Math.max(0, page - 1);
        System.out.println("Searching for: " + q + ", page: " + page + " (zero-based: " + zeroBasedPage + "), limit: " + limit);

        Pageable pageable = PageRequest.of(zeroBasedPage, limit);
        Page<Article> result = articleRepository.search(q, pageable);

        System.out.println("Found " + result.getTotalElements() + " total articles, returning " + result.getContent().size() + " items");
        return result;
    }

}