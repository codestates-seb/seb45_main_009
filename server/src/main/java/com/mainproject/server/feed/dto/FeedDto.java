package com.mainproject.server.feed.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mainproject.server.imagetag.entity.ImageTag;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class FeedDto {

    @Getter
    @Setter
    public static class PostDto {

        private String content;
        private List<String> relatedTags;
        private List<ImageTag> imageTags;
    }

    @Getter
    @Setter
    public static class PatchDto {

        private long feedId;
        private long imageId;
        private String content;
        private List<String> relatedTags;
        private List<ImageTag> imageTags;
    }



}
