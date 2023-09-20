package com.mainproject.server.userprofile.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import com.mainproject.server.userprofile.dto.FeedInfoConverter;
import com.mainproject.server.userprofile.dto.UserProfileDto;
import com.mainproject.server.userprofile.entity.UserProfile;
import com.mainproject.server.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class UserProfileService {

    private final UserService userService;
    private final ImageService imageService;
    private final UserProfileRepository userProfileRepository;



    public UserProfileDto getUserProfileInfo(long userId, int page, int pageSize) {
        User user = userService.findUser(userId);

        if (user == null) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_FOUND);
        }

        String profileImageUrl = getProfileImageUrl(user);

        UserProfile userProfile = userProfileRepository.findByUser(user);

        // 페이지와 pageSize를 기반으로 시작 인덱스와 끝 인덱스 계산
        int startIndex = (page - 1) * pageSize;
        int endIndex = Math.min(startIndex + pageSize, user.getFeedList().size());

        // 페이지네이션된 사용자의 피드 목록을 가져옴
        List<FeedResponseDto> pagedFeedList = user.getFeedList().subList(startIndex, endIndex)
                .stream()
                .map(FeedInfoConverter::convertToFeedInfo)
                .collect(Collectors.toList());

        UserProfileDto userProfileDto = UserProfileDto.builder()
                .nickname(user.getNickname())
                .profileimg(profileImageUrl)
                .feedCount(userProfile.getFeedCount())
                .followerCount(userProfile.getFollowerCount())
                .followCount(userProfile.getFollowCount())
                .sport(user.getSport())
                .bio(user.getBio())
                .price(user.getPrice())
                .height(user.getHeight())
                .weight(user.getWeight())
                .roles(user.getRoles())
                .feedList(pagedFeedList)
                .build();

        return userProfileDto;
    }

    private String getProfileImageUrl(User user) {
        String profileImageUrl = null;
        if (user != null && user.getProfileimg() != null) {
            String imageUrl = user.getProfileimg().getImageUrl();
            Image image = imageService.findImageByImageUrl(imageUrl);

            if (image != null) {
                profileImageUrl = image.getImageUrl();
            }
        }
        return profileImageUrl;
    }
}
