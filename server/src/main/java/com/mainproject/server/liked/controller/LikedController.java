package com.mainproject.server.liked.controller;

import com.mainproject.server.auth.loginResolver.LoginUserId;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.liked.service.LikedService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/feed")
public class LikedController {

    private final LikedService likedService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("detail/{feed-id}/like")
    public Boolean likeFeed(@PathVariable("feed-id") long feedId, @LoginUserId Long userId) {
        User findUser = userService.findUser(userId);
        if (findUser != null) { // 유효한 사용자인지 확인
            User user = userRepository.findById(userId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
            return likedService.toggleLikeFeed(feedId, user);
        } else {
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }

    @GetMapping("detail/{feed-id}/likeduser")
    public ResponseEntity<List<Long>> getLikedUsers(@PathVariable("feed-id") long feedId) {
        List<Long> likelist = likedService.getLikedUsers(feedId);
        return ResponseEntity.ok(likelist);
    }
}