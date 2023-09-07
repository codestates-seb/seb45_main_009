package com.mainproject.server.feedcomment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@AllArgsConstructor
@Getter
@Setter
public class FeedCommentDto {

    @Getter
    @Setter
    public static class PostDto {

        @NotBlank
        @Size(min = 2, message = " 답변 내용은 2글자 이상 입력하세요.")
        private String content;

    }

    @Getter
    @Setter
    public static class PatchDto{

        private long feedCommentId;

        @NotBlank
        @Size(min = 2, message = " 답변 내용은 2글자 이상 입력하세요.")
        private String content;

    }
}
