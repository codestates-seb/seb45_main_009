package com.mainproject.server.feedcomment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class FeedCommentResponseDto {

    private long feedCommentId;

    private long feedId;

    private String content;

    // 유저 정보도 받아올 수 있도록 추가해야함

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;
}
