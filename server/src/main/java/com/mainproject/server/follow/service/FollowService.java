package com.mainproject.server.follow.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;

import com.mainproject.server.follow.entity.Follow;
import com.mainproject.server.follow.repository.FollowRepository;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.notification.entity.Notification;
import com.mainproject.server.notification.service.NotificationService;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final ImageService imageService;
    private final UserService userService;
    private final NotificationService notificationService;

    // 특정 사용자가 다른 사용자를 팔로우 또는 언팔로우하는 기능을 제공
    @Transactional
    public Boolean toggleUser(Long userId, User loggedInUser) {
        // 팔로우할 대상 사용자가 존재하는지 확인
        Optional<User> preyUserOptional = Optional.ofNullable(userService.findVerifiedUser(userId));

        // 팔로우 대상 사용자가 존재하지 않는 경우 예외를 던짐
        if (!preyUserOptional.isPresent()) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_FOUND);
        }

        User preyUser = preyUserOptional.get();

        // 로그인한 사용자가 자기 자신을 팔로우하는 경우를 방지
        if (preyUser.getUserId().equals(loggedInUser.getUserId())) {
            throw new BusinessLogicException(ExceptionCode.SELF_FOLLOW_NOT_ALLOWED);
        }

        // 이미 팔로우 중인지 확인
        Boolean isFollowing = isFollowing(loggedInUser, preyUser);

        // 이미 팔로우 중인 경우 언팔로우를 수행, 그렇지 않은 경우 팔로우를 수행
        if (isFollowing) {
            unfollowUser(loggedInUser, preyUser);
            loggedInUser.hasUnFollowing(); // 로그인한 사용자의 팔로잉 카운트 감소
            preyUser.hasUnFollowed(); // 팔로우 대상 사용자의 팔로워 카운트 감소
        } else {
            followUser(loggedInUser, preyUser);
            loggedInUser.hasFollowing(); // 로그인한 사용자의 팔로잉 카운트 증가
            preyUser.hasFollowed(); // 팔로우 대상 사용자의 팔로워 카운트 증가
        }

        // 팔로우 알림 내용 생성
        String content = loggedInUser.getNickname() + "님이 팔로우했습니다.";

        // 팔로우 대상 사용자에게 알림 보내기
        notificationService.send(preyUser, Notification.NotificationType.FOLLOW, content, "/followers/{userId}");

        // 새로운 팔로우 상태를 반환 (true: 팔로우한 경우, false: 언팔로우한 경우).
        return !isFollowing;
    }


    // 사용자를 팔로우
    @Transactional
    public void followUser(User follower, User follow) {
        if (!followRepository.existsByFollowerAndFollow(follower, follow)) {
            Follow follows = new Follow(follower, follow);
            followRepository.save(follows);
        }
    }

    // 사용자가 다른 사용자를 팔로우하고 있는지 확인
    public boolean isFollowing(User follower, User follow) {
        return followRepository.existsByFollowerAndFollow(follower, follow);
    }

    // 사용자를 언팔로우
    @Transactional
    public void unfollowUser(User follower, User follow) {
        Follow follows = followRepository.findByFollowerAndFollow(follower, follow);
        if (follows != null) {
            followRepository.delete(follows);
        }
    }

    // 특정 사용자를 팔로우하는 사용자 목록을 조회
    @Transactional
    public List<UserDto.ResponseDto> getFollowers(Long userId) {
        // 지정된 사용자의 정보를 가져온다
        User user = userService.findVerifiedUser(userId);
        // 해당 사용자를 팔로우하는 사용자 목록을 가져온다
        List<Follow> followerList = user.getFollowerList();
        // 팔로워 목록을 UserDto.ResponseDto로 매핑하여 반환
        return mapUsersToResponseDto(followerList);
    }

    // 특정 사용자가 팔로우하는 사용자 목록을 조회
    @Transactional
    public List<UserDto.ResponseDto> getFollowing(Long userId) {
        // 지정된 사용자의 정보를 가져온다
        User user = userService.findVerifiedUser(userId);
        // 해당 사용자가 팔로우하는 사용자 목록을 가져온다
        List<Follow> followList = user.getFollowList();

        // Follow 엔티티를 User 엔티티로 변환한 다음 UserDto.ResponseDto로 매핑
        List<User> followingUsers = followList.stream()
                .map(Follow::getFollow)
                .collect(Collectors.toList());

        // 팔로잉 목록을 UserDto.ResponseDto로 매핑하여 반환
        return mapUserToResponseDto(followingUsers);
    }

    // Follow 엔티티 목록을 UserDto.ResponseDto 목록으로 변환
    private List<UserDto.ResponseDto> mapUsersToResponseDto(List<Follow> follows) {
        return follows.stream()
                .map(follow -> userToResponseDto(follow.getFollower()))
                .collect(Collectors.toList());
    }

    // User 엔티티 목록을 UserDto.ResponseDto 목록으로 변환
    private List<UserDto.ResponseDto> mapUserToResponseDto(List<User> users) {
        return users.stream()
                .map(this::userToResponseDto)
                .collect(Collectors.toList());
    }

    // User 엔티티를 UserDto.ResponseDto로 매핑
    private UserDto.ResponseDto userToResponseDto(User user) {
        return UserDto.ResponseDto.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .profileimg(imageService.getProfileImageUrl(user))
                // 필요한 다른 정보도 추가 가능
                .build();
    }

    // 팔로우 알림
    @Transactional
    public void sendFollowNotification(User follower, User follow) {
        // 팔로워의 닉네임을 가져옴
        String followerNickname = follower.getNickname();

        // 팔로우 알림 내용을 동적으로 생성
        String content = followerNickname + "님이 팔로우했습니다.";

        // 팔로우 알림을 보내기 위해 NotificationService의 send 메서드를 호출
        notificationService.send(follower, Notification.NotificationType.FOLLOW, content, "/followers/{userId}");
    }

}
