package com.keykomi.webblog.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {
    private Long id;
    private String title;
    private String content;

    @JsonProperty("read_count")
    private Long readCount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty("published_at")
    private LocalDateTime publishedAt;

    @JsonProperty("image_url")
    private String imageUrl;

    private List<String> tags;
    private String author;
}
