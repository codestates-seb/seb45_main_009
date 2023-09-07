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
    private String userNickname;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

}
