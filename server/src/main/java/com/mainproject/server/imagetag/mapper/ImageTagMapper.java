package com.mainproject.server.imagetag.mapper;

import com.mainproject.server.feedcomment.dto.FeedCommentResponseDto;
import com.mainproject.server.feedcomment.entity.FeedComment;
import com.mainproject.server.imagetag.dto.ImageTagDto;
import com.mainproject.server.imagetag.dto.ImageTagResponseDto;
import com.mainproject.server.imagetag.entity.ImageTag;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageTagMapper {
    ImageTag imageTagPostDtosToImageTag(ImageTagDto.PostDto imageTagDto);

    ImageTag imageTagPatchDtoToImageTag(ImageTagDto.PatchDto imageTagDto);

    ImageTagResponseDto imageTagToImageTagResponseDto(ImageTag imageTag);

}
