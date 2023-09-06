package com.mainproject.server.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class FeedDto {

    @Getter
    @Setter
    public static class PostDto {

        private boolean usertype;
        private String content;
        private List<String> relatedTags;

//        private List<Phototag> phototags;

    }

    @Getter
    @Setter
    public static class PatchDto {

        private long feedId;
        private boolean usertype;
        private String content;
        private List<String> relatedTags;

//        private List<PhotoTag> photoTags;

    }

}
