package com.mainproject.server.imagetag.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ImageTagDto {

    @Getter
    @Setter
    public static class PostDto {

        private String productName;
        private String productPrice;
        private String productInfo;
        private Long positionX;
        private Long positionY;
    }

    @Getter
    @Setter
    public static class PatchDto {

        private Long imageTagId;
        private String productName;
        private String productPrice;
        private String productInfo;
        private Long positionX;
        private Long positionY;
    }
}


