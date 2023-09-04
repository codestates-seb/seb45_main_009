package com.mainproject.server.user.controller;



import com.mainproject.server.auth.loginResolver.LoginUserId;
import com.mainproject.server.response.DataResponseDto;
import com.mainproject.server.response.SingleResponseDto;
import com.mainproject.server.user.dto.AuthLoginDto;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.mapper.UserMapper;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.net.URI;

@RestController
@RequestMapping("/")
@Validated
@Slf4j
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;
    private final UserMapper mapper;


    // 유저 등록
    @PostMapping("join/user")
    public ResponseEntity postUser(@Valid @RequestBody UserDto.PostDto requestBody) {
        User user = mapper.postToUser(requestBody);
        user.setUsertype(0); // USER 역할

        // "ROLE_USER" 역할을 설정
        user.getRoles().add(User.UserRole.USER);


        // UserService를 사용하여 유저 생성
        User createdUser = userService.createUser(user);

        // 생성된 유저 정보를 반환하고 HTTP 상태 코드 201(CREATED)를 반환
        return ResponseEntity.created(URI.create("/user/" + createdUser.getUserId())).body(createdUser);
    }

    // 기업 등록
    @PostMapping("join/store")
    public ResponseEntity postStore(@Valid @RequestBody UserDto.PostDto requestBody) {
        User user = mapper.postToUser(requestBody);
        user.setUsertype(1); // 기업은 1로 생성


        // "ROLE_STORE" 역할을 설정
        user.getRoles().add(User.UserRole.STORE);

        // UserService를 사용하여 유저 생성
        User createdUser = userService.createUser(user);

        // 생성된 기업 정보를 반환하고 HTTP 상태 코드 201(CREATED)를 반환
        return ResponseEntity.created(URI.create("/user/" + createdUser.getUserId())).body(createdUser);
    }


    @PostMapping("/oauth/signup/kakao")
    public ResponseEntity oAuth2LoginKakao(@RequestBody @Valid AuthLoginDto requesBody) {
        log.info("### oauth2 login start! ###");
        String accessToken = "";
        String refreshToken = "";
        String userId = "";
        User user = mapper.AuthLoginDtoUser(requesBody);
        user.setEmail(user.getEmail() + "3");
        if (!userService.existsByEmail(user.getEmail())) {
            user = userService.createUserOAuth2(user);
        } else {
            user = userService.findVerifiedUser(user.getEmail());
        }
        accessToken = userService.delegateAccessToken(user);
        refreshToken = userService.delegateRefreshToken(user);
        userId = String.valueOf(user.getUserId());
        return ResponseEntity.ok().header("Authorization", "Bearer " + accessToken)
                .header("Refresh", refreshToken)
                .header("UserId", userId).build();
    }

    // 유저 정보 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("mypage")
    public ResponseEntity getUserInfo(@LoginUserId Long userId) {
        User findUser = userService.findUser(userId);
        UserDto.ResponseDto response = mapper.userToResponse(findUser);

        return new ResponseEntity<>(
                new DataResponseDto<>(response), HttpStatus.OK);
    }

    // 유저 전체 조회
    @GetMapping("users")
    public ResponseEntity<Page<UserDto.ResponseDto>> getUsers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {

        // UserService를 사용하여 페이지네이션된 유저 목록 조회
        Page<User> userPage = userService.findUsers(page, size);
        // 조회한 유저 목록을 UserDto.ResponseDto로 매핑하여 반환
        Page<UserDto.ResponseDto> responsePage = userPage.map(mapper::userToResponse);

        return ResponseEntity.ok(responsePage);
    }

    // 유저 정보 업데이트
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("mypage/{user-id}/update")
    public ResponseEntity<?> patchUser(@PathVariable("user-id") @Positive long userId,
                                       @LoginUserId Long loginId,
                                       @Valid @RequestBody UserDto.PatchDto requestBody) {

        User user = mapper.patchToUser(requestBody);
        user.setUserId(userId);
        User updatedUser = userService.updateUser(loginId, user);
        UserDto.ResponseDto response = mapper.userToResponse(updatedUser);


        return new ResponseEntity<>(
                new SingleResponseDto<>(response), HttpStatus.OK);

    }


    // 유저 삭제
     @PreAuthorize("isAuthenticated()")
    @DeleteMapping("mypage/delete")
    public ResponseEntity<?> deleteUser(@LoginUserId Long loggedInUserId) {
        // 로그인한 사용자의 ID를 사용하여 해당 사용자 삭제
        userService.deleteUser(loggedInUserId);
        // HTTP 상태 코드 204(NO CONTENT)를 반환
        return ResponseEntity.noContent().build();
    }





}
