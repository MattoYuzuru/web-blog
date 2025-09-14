package com.keykomi.webblog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, unique = false, length = 255)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "read_count")
    private Long readCount;

    @CreatedDate
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "author", length = 100)
    private String author;

    // Если у вас есть отдельная таблица для тегов
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "article_tags", joinColumns = @JoinColumn(name = "article_id"))
    @Column(name = "tag")
    private List<String> tags;

    @PrePersist
    protected void onCreate() {
        if (publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
        if (author == null) {
            author = "KeykoMI"; // значение по умолчанию
        }
    }
}