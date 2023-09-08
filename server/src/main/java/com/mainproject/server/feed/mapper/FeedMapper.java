package com.mainproject.server.feed.mapper;

import com.mainproject.server.feed.dto.FeedDto;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.feed.enitiy.Feed;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface FeedMapper {
    Feed feedPostDtoToFeed(FeedDto.PostDto feedPostDto);

    Feed feedPatchDtoToFeed(FeedDto.PatchDto feedPatchdto);

    //    @Mapping(source = "User.userId", target = "userId")
    FeedResponseDto feedToFeedResponseDto(Feed feed);
    List<FeedResponseDto> feedToFeedResponseDtos(List<Feed> feeds);

//    default FeedResponseDto feedToFeedResponseDto(Feed feed) {
//        return FeedResponseDto.builder()
//                .feedId(feed.getFeedId())
//                .userId(feed.getUser().getUserId())
//                .content(feed.getContent())
//                .relatedTags(feed.getRelatedTags())
//                .images(feed.getImages().stream()
////                        .map(image -> FeedResponseDto.FeedImageDto.builder()
////                                .imageId(image.getImageId())
////                                .imageUrl(image.getImageUrl())
////                                .imageTags(image.getImageTags().stream()
////                                        .map(imageTag -> FeedResponseDto.FeedImageDto.ImageTagDto.builder()
////                                                .x(imageTag.getX())
////                                                .y(imageTag.getY())
////                                                .tagContent(imageTag.getTagContent())
//                                                .build())
//                                        .collect(Collectors.toList()))
//                                .build())
//                        .collect(Collectors.toList()))
//                .build();
//    }

//    default FeedResponseDto feedToFeedResponseDto(Feed feed) {
//        return FeedResponseDto.builder()
//                .feedId(feed.getFeedId())
//                .userId(feed.getUser().getUserId())
//                .content(feed.getContent())
//                .relatedTags(feed.getRelatedTags())
//                .images(feed.getImages().stream()
//                        .map(image -> FeedResponseDto.FeedImageDto.builder()
//                                .imageId(image.getImageId())
//                                .imageUrl(image.getImageUrl())
//                                .build())
//                        .collect(Collectors.toList()))
//                .build();
//    }
}
