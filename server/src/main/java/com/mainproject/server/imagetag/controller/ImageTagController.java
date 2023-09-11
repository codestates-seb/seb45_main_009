package com.mainproject.server.imagetag.controller;

import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.imagetag.dto.ImageTagDto;
import com.mainproject.server.imagetag.dto.ImageTagResponseDto;
import com.mainproject.server.imagetag.entity.ImageTag;
import com.mainproject.server.imagetag.mapper.ImageTagMapper;
import com.mainproject.server.imagetag.service.ImageTagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class ImageTagController {

    private final ImageTagService imageTagService;
    private final ImageTagMapper imageTagMapper;

    public ImageTagController(ImageTagService imageTagService, ImageTagMapper imageTagMapper) {
        this.imageTagService = imageTagService;
        this.imageTagMapper = imageTagMapper;
    }

    @PostMapping("/image/{image-id}")
    public ResponseEntity<ImageTagResponseDto> postImageTag(@PathVariable("image-id") long imageId,
                                                                  @RequestPart ImageTagDto.PostDto imageTag) {

        ImageTag createdImageTag = imageTagService.createImageTag(imageId, imageTagMapper.imageTagPostDtosToImageTag(imageTag));

        // 생성된 이미지 태그 목록을 다시 DTO로 변환하여 ResponseEntity로 반환
        ImageTagResponseDto createdImageTagDto = imageTagMapper.imageTagToImageTagResponseDto(createdImageTag);

        return new ResponseEntity<>(createdImageTagDto, HttpStatus.CREATED);
    }

    @PatchMapping("/image/{imageTagId}")
    public ResponseEntity<ImageTagResponseDto> patchImageTag(@PathVariable("imageTagId") long imageTagId,
                                                            @RequestPart ImageTagDto.PatchDto imageTag) {

        ImageTag updateImageTag = imageTagService.updateImageTag(imageTagId, imageTagMapper.imageTagPatchDtoToImageTag(imageTag));

        ImageTagResponseDto updateImageTagDto = imageTagMapper.imageTagToImageTagResponseDto(updateImageTag);

        return new ResponseEntity<>(updateImageTagDto, HttpStatus.OK);
    }

    @DeleteMapping("/image/{imageTag-id}")
    public ResponseEntity deleteImageTag(@PathVariable("imageTag-id") long imageTagId) {

        imageTagService.deleteImageTag(imageTagId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
