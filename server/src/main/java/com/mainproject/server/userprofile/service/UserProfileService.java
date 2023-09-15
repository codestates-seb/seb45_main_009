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


@Service
@Transactional
@RequiredArgsConstructor
public class UserProfileService {

    private final UserService userService;
    private final ImageService imageService;
    private final UserProfileRepository userProfileRepository;


    // 사용자의 프로필 정보를 가져오는 메서드
    public UserProfileDto getUserProfileInfo(long userId) {
        // 사용자 검색
        User user = userService.findUser(userId);

        // 사용자가 존재하지 않으면 예외 발생
        if (user == null) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_FOUND);
        }

        // 사용자의 프로필 이미지 URL 검색
        String profileImageUrl = getProfileImageUrl(user);

        // 사용자의 프로필 정보 검색
        UserProfile userProfile = userProfileRepository.findByUser(user);

        // 사용자의 피드 목록을 가져와 FeedResponseDto로 변환
        List<FeedResponseDto> feedList = FeedInfoConverter.convertToFeedInfoList(user.getFeedList()); // FeedInfoConverter를 사용하여 변환

        // 사용자 프로필 정보를 UserProfileDto로 생성
        UserProfileDto userProfileDto = UserProfileDto.builder()
                .nickname(user.getNickname())
                .profileimg(profileImageUrl)
                .feedCount(userProfile.getFeedCount())
                .followerCount(userProfile.getFollowerCount())
                .followCount(userProfile.getFollowCount())
                .bio(user.getBio())
                .price(user.getPrice())
                .height(user.getHeight())
                .weight(user.getWeight())
                .roles(user.getRoles())
                .feedList(feedList)
                .build();

        return userProfileDto;
    }



    // 사용자의 프로필 이미지 URL 검색
    private String getProfileImageUrl(User user) {
        String profileImageUrl = null;
        if (user != null && user.getProfileimg() != null) {
            String imageUrl = user.getProfileimg().getImageUrl();
            Image image = imageService.findImageByImageUrl(imageUrl);

            if (image != null) {
                // 중복된 이미지 주소인 경우 중복된 이미지 중 하나만 사용하도록 수정
                profileImageUrl = image.getImageUrl();
            }
        }
        return profileImageUrl;
    }

}
