package com.mainproject.server.feed.dto;

import com.mainproject.server.feedcomment.dto.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class FeedRolesPageDto {
    List<FeedResponseDto> feedList;
    private FeedPageInfo pageInfo; // 페이지 정보
}
