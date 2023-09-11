package com.mainproject.server.feed.mapper;

import com.mainproject.server.feed.dto.FeedDto;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.feed.enitiy.Feed;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FeedMapper {
    Feed feedPostDtoToFeed(FeedDto.PostDto feedPostDto);
    Feed feedPatchDtoToFeed(FeedDto.PatchDto feedPatchdto);
    FeedResponseDto feedToFeedResponseDto(Feed feed);
    List<FeedResponseDto> feedToFeedResponseDtos(List<Feed> feeds);
}
