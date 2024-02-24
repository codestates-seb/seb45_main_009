package com.mainproject.server.follow.controller;


import com.mainproject.server.auth.loginresolver.LoginUserId;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.follow.service.FollowService;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/follow")
public class FollowController {


    private final FollowService followService;
    private final UserService userService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{userId}")
    public ResponseEntity<Boolean> toggleFollow(@PathVariable Long userId, @LoginUserId Long loggedInUserId) {
        // 팔로우하려는 대상이 자기 자신인지 확인
        if (loggedInUserId.equals(userId)) {
            throw new BusinessLogicException(ExceptionCode.SELF_FOLLOW_NOT_ALLOWED);
        }

        // 팔로우 로직을 수행
        User loggedInUser = userService.findUser(loggedInUserId);
        Boolean isFollowing = followService.toggleUser(userId, loggedInUser);

        return ResponseEntity.ok(isFollowing); // 팔로우 상태를 반환 (true: 팔로우한 경우, false: 언팔로우한 경우)
    }





    @GetMapping("/followers/{userId}")
    public Page<UserDto.ResponseDto> getFollowers(@PathVariable Long userId,
                                                  @RequestParam(name = "page", defaultValue = "0") int page,
                                                  @RequestParam(name = "size", defaultValue = "48") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return followService.getFollowers(userId, pageable);
    }

    @GetMapping("/following/{userId}")
    public Page<UserDto.ResponseDto> getFollowing(@PathVariable Long userId,
                                                  @RequestParam(name = "page", defaultValue = "0") int page,
                                                  @RequestParam(name = "size", defaultValue = "48") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return followService.getFollowing(userId, pageable);
    }




}
