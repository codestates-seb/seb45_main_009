package com.mainproject.server.feedcomment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PageInfo {
    // 페이지 번호
    private int page;
    // 페이지 개수(low)
    private int size;
    // 테이블에 저장되어 있는 데이터의 총 개수
    private int totalElements;
    private int totalPages;
}
