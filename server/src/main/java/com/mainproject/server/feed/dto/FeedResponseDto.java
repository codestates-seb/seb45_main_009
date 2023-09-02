package com.mainproject.server.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class FeedResponseDto {

    private long feedId;

    private String content;

    private String photo_url;

//    // 이미지 여러 장
//    private List<String> photo_urls;

    private List<String> tags;

    private boolean usertype;

//        private List<PhotoTag> photoTags;

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

}
