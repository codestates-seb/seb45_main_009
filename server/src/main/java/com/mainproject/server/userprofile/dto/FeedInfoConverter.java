package com.mainproject.server.userprofile.dto;

import com.mainproject.server.feed.dto.FeedResponseDto;

import com.mainproject.server.feed.entity.Feed;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@Component
public class FeedInfoConverter {
    public static List<FeedResponseDto> convertToFeedInfoList(List<Feed> feedList) {
        return feedList.stream()
                .map(FeedInfoConverter::convertToFeedInfo)
                .collect(Collectors.toList());
    }

    public static FeedResponseDto convertToFeedInfo(Feed feed) {
        return FeedResponseDto.builder()
                .feedId(feed.getFeedId())
                .content(feed.getContent())
                .relatedTags(feed.getRelatedTags())
                .nickname(feed.getUser().getNickname())
                .location(feed.getUser().getLocation()) // 사용자의 위치 정보 추가
                .profileImageUrl(feed.getUser().getProfileimg().getImageUrl())
                .createdAt(feed.getCreatedAt())
                .modifiedAt(feed.getModifiedAt())
                .images(feed.getImages().stream()
                        .map(image -> FeedResponseDto.FeedImageDto.builder()
                                .imageId(image.getImageId())
                                .imageUrl(image.getImageUrl())
                                .imageTags(image.getImageTags().stream()
                                        .map(tag -> FeedResponseDto.FeedImageDto.ImageTagDto.builder()
                                                .imageTagId(tag.getImageTagId())
                                                .productName(tag.getProductName())
                                                .productPrice(tag.getProductPrice())
                                                .productInfo(tag.getProductInfo())
                                                .positionX(tag.getPositionX())
                                                .positionY(tag.getPositionY())
                                                .build())
                                        .collect(Collectors.toList()))
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
