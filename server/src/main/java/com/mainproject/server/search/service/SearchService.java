package com.mainproject.server.search.service;

import com.mainproject.server.feed.dto.FeedResponseDto;

import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.search.dto.SearchDto;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.userprofile.dto.FeedInfoConverter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final FeedRepository feedRepository;
    private final UserRepository userRepository;

    public SearchService(UserRepository userRepository, FeedRepository feedRepository ) {
        this.userRepository = userRepository;
        this.feedRepository = feedRepository;
    }

    public SearchDto searchByKeyword(String keyword) {
        SearchDto searchDto = new SearchDto();

        // 유저 정보 가져오기
        List<User> users = userRepository.findByNicknameContaining(keyword);
        List<UserDto.UserInfo> userInfos = users.stream()
                .map(this::convertToUserInfo)
                .collect(Collectors.toList());
        searchDto.setUsers(userInfos);

        // 피드 정보 가져오기
        List<Feed> feeds = feedRepository.findFeedsByRelatedTagsContaining(keyword);
        List<FeedResponseDto> feedInfos = feeds.stream()
                .map(this::convertToFeedInfo)
                .collect(Collectors.toList());
        searchDto.setFeeds(feedInfos);

        return searchDto;
    }

    private UserDto.UserInfo convertToUserInfo(User user) {
        return UserDto.UserInfo.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .profileimg(user.getProfileimg() != null ? user.getProfileimg().getImageUrl() : null)
                .bio(user.getBio())
                .sport(user.getSport())
                .feedCount(user.getUserProfile().getFeedCount())
                .followCount(user.getUserProfile().getFollowCount())
                .followerCount(user.getUserProfile().getFollowerCount())
                .height(user.getHeight())
                .weight(user.getWeight())
                .price(user.getPrice())
                .roles(user.getRoles())
                .build();
    }

    private FeedResponseDto convertToFeedInfo(Feed feed) {
        return FeedInfoConverter.convertToFeedInfo(feed);
    }
}
