package com.mainproject.server.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
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

        @NotBlank
        private String photo_url;


        private List<String> tags;

//        private List<Phototag> phototags;

    }


    @Getter
    @Setter
    public static class PatchDto {

        private long feedId;

        private boolean usertype;

        @NotBlank
        private String photo_url;

        private String content;

//        private String tag;

        private List<String> tags;

//        private List<PhotoTag> photoTags;

    }

}
