package com.mainproject.server.feedcomment.mapper;

import com.mainproject.server.feedcomment.dto.FeedCommentDto;
import com.mainproject.server.feedcomment.dto.FeedCommentResponseDto;
import com.mainproject.server.feedcomment.entity.FeedComment;
import org.mapstruct.Mapper;


import java.util.List;

@Mapper(componentModel = "spring")
public interface FeedCommentMapper {

    FeedComment feedCommentPostDtoToFeedComment(FeedCommentDto.PostDto feedCommentPostDto);
//    FeedComment feedCommentPatchDtoToFeedComment(FeedCommentDto.PatchDto feedCommentPatchDto);

    List<FeedCommentResponseDto> feedCommentToFeedCommentResponseDtos(List<FeedComment> feedComments);
    default FeedCommentResponseDto feedCommentToFeedCommentResponseDto(FeedComment feedComment){
        return FeedCommentResponseDto.builder()
                .feedCommentId(feedComment.getFeedCommentId())
                .feedId(feedComment.getFeed().getFeedId())
                .content(feedComment.getContent())
                .userNickname(feedComment.getUser().getNickname())
                .build();

    }
}
