package com.mainproject.server.feed.mapper;

import com.mainproject.server.feed.dto.FeedDto;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.feed.enitiy.Feed;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface FeedMapper {
    //    FeedMapper INSTANCE = Mappers.getMapper(FeedMapper.class);
    @Mapping(source = "feedId", target = "feedId")
    @Mapping(source = "content", target = "content")
    @Mapping(source = "user.nickname", target = "userNickname")
    @Mapping(source = "user.profileimg.imageUrl", target = "profileImageUrl")
    @Mapping(source = "relatedTags", target = "relatedTags")
    @Mapping(source = "images", target = "images")
    FeedResponseDto feedToFeedResponseDto(Feed feed);

    List<FeedResponseDto> feedToFeedResponseDtos(List<Feed> feeds);

    Feed feedPostDtoToFeed(FeedDto.PostDto feedPostDto);

    Feed feedPatchDtoToFeed(FeedDto.PatchDto feedPatchdto);

}