package com.mainproject.server.feedcomment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class FeedCommentResponseDto {

    private long feedCommentId;
    private long feedId;
    private String content;
    private String userNickname;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime modifiedAt = LocalDateTime.now();

}
