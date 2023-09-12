package com.mainproject.server.userprofile.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
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
        List<FeedResponseDto> feedList = user.getFeedList().stream()
                .map(feed -> {
                    // 각 피드에 연결된 이미지 URL 검색
                    List<String> imageUrls = feed.getImages().stream()
                            .map(image -> image.getImageUrl())
                            .collect(Collectors.toList());

                    // 이미지 URL을 FeedImageDto로 변환
                    List<FeedResponseDto.FeedImageDto> feedImages = imageUrls.stream()
                            .map(imageUrl -> FeedResponseDto.FeedImageDto.builder()
                                    .imageUrl(imageUrl)
                                    .build())
                            .collect(Collectors.toList());

                    // 피드 정보를 FeedResponseDto로 생성
                    return FeedResponseDto.builder()
                            .feedId(feed.getFeedId())
                            .content(feed.getContent())
                            .images(feedImages)
                            .build();
                })
                .collect(Collectors.toList());

        // 사용자 프로필 정보를 UserProfileDto로 생성
        UserProfileDto userProfileDto = UserProfileDto.builder()
                .nickname(user.getNickname())
                .profileimg(profileImageUrl)
                .feedCount(userProfile.getFeedCount())
                .followerCount(userProfile.getFollowerCount())
                .followCount(userProfile.getFollowCount())
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
                profileImageUrl = image.getImageUrl();
            }
        }
        return profileImageUrl;
    }
}
