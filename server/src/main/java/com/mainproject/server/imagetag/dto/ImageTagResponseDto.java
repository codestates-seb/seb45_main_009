package com.mainproject.server.imagetag.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ImageTagResponseDto {

    private Long imageTagId;
    private String productName;
    private String productPrice;
    private String productInfo;
    private Long positionX;
    private Long positionY;

}
