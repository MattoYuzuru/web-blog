package com.keykomi.webblog.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class PaginatedResponse<T> {
    private final List<T> items;
    private final long total;
    private final int page;
    private final int limit;

    public PaginatedResponse(List<T> items, long total, int page, int limit) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }
}
