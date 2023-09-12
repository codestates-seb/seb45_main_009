package com.mainproject.server.search.service;

import com.mainproject.server.feed.dto.FeedDto;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.search.dto.SearchDto;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;


@Service
public class SearchService {


    private FeedRepository feedRepository;
    private UserRepository userRepository;

    @Autowired
    public SearchService(UserRepository userRepository, FeedRepository feedRepository) {
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
        List<Feed> feeds = feedRepository.findFeedsByRelatedTags(keyword);
        List<FeedDto.FeedInfo> feedInfos = feeds.stream()
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
                .build();
    }

    private FeedDto.FeedInfo convertToFeedInfo(Feed feed) {
        return FeedDto.FeedInfo.builder()
                .feedId(feed.getFeedId())
                .content(feed.getContent())
                .relatedTags(feed.getRelatedTags())
                .images(feed.getImages().stream()
                        .map(Image::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }
}

