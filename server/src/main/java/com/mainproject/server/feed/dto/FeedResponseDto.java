package com.mainproject.server.feed.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FeedResponseDto {
    private Long feedId;
    private String content;
    private List<String> relatedTags;
    private List<FeedImageDto> images;  // 이미지 정보가 여러 개일 수 있으므로 리스트
    private Long likeCount;

    @Getter
    @Setter
    @Builder
    public static class FeedImageDto {
        private Long imageId;
        private String imageUrl;
        private List<ImageTagDto> imageTags; // 이미지 태그 정보가 여러 개일 수 있으므로 리스트

        @Getter
        @Setter
        @Builder
        public static class ImageTagDto {
            private Long imageTagId;
            private String productName;
            private String productPrice;
            private String productInfo;
            private Long positionX;
            private Long positionY;
        }
    }
}