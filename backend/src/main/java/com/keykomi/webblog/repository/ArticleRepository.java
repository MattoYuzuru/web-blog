package com.keykomi.webblog.repository;

import com.keykomi.webblog.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query(value = """
            SELECT * FROM articles
            WHERE to_tsvector('russian', coalesce(title, '') || ' ' || coalesce(content, ''))
                @@ websearch_to_tsquery('russian', :q)
            ORDER BY ts_rank_cd(
                     to_tsvector('russian', coalesce(title, '') || ' ' || coalesce(content, '')),
                     websearch_to_tsquery('russian', :q)
            ) DESC
            """,
            countQuery = """
            SELECT count(*) FROM articles
            WHERE to_tsvector('russian', coalesce(title, '') || ' ' || coalesce(content, ''))
                @@ websearch_to_tsquery('russian', :q)
            """,
            nativeQuery = true)
    Page<Article> search(@Param("q") String q, Pageable pageable);
}
