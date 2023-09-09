package com.mainproject.server.feedcomment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class FeedCommentPageDto {
    List<FeedCommentResponseDto> feedCommentData; // 코멘트 데이터
    private PageInfo pageInfo; // 페이지 정보
}
