package com.mainproject.server.user.controller;



import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.mapper.UserMapper;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/")
@Validated
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper mapper;
    private final UserRepository userRepository;

    // 유저 등록
    @PostMapping("join/user")
    public ResponseEntity postUser(@Valid @RequestBody UserDto.PostDto requestBody) {
        User user = mapper.postToUser(requestBody);
        user.setUsertype(true);  // 유저는 true로 생성

        // UserService를 사용하여 유저 생성
        User createdUser = userService.createUser(user);

        // 생성된 유저 정보를 반환하고 HTTP 상태 코드 201(CREATED)를 반환
        return ResponseEntity.created(URI.create("/user/" +
                "" + createdUser.getUserId())).body(createdUser);
    }

    // 기업 등록
    @PostMapping("join/store")
    public ResponseEntity postStore(@Valid @RequestBody UserDto.PostDto requestBody) {
        User user = mapper.postToUser(requestBody);
        user.setUsertype(false);  // 기업은 false로 생성

        // UserService를 사용하여 유저 생성
        User createdUser = userService.createUser(user);

        // 생성된 기업 정보를 반환하고 HTTP 상태 코드 201(CREATED)를 반환
        return ResponseEntity.created(URI.create("/user/" + createdUser.getUserId())).body(createdUser);
    }

    // 유저 정보 조회
    @GetMapping("mypage/{user_id}")
    public ResponseEntity<UserDto.ResponseDto> getUser(@PathVariable("user_id") long userId) {
        // UserService를 사용하여 userId에 해당하는 유저 정보 조회
        User findUser = userService.findUser(userId);
        // 조회한 정보를 UserDto.ResponseDto로 매핑하여 반환
        UserDto.ResponseDto responseDto = mapper.userToResponse(findUser);
        return ResponseEntity.ok(responseDto);
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
    @PatchMapping("mypage/{user_id}/update")
    public ResponseEntity<?> patchUser(@PathVariable("user_id") long userId,
                                       @Valid @RequestBody UserDto.PatchDto patchDto) {

        // UserService를 사용하여 userId에 해당하는 유저 정보 업데이트
        User updatedUser = userService.updateUser(userId, patchDto);
        // 업데이트된 정보를 UserDto.ResponseDto로 매핑하여 반환
        UserDto.ResponseDto responseDto = mapper.userToResponse(updatedUser);
        return ResponseEntity.ok(responseDto);
    }


    // 일단 유저 닉네임만 검색되게 구성
    @GetMapping("feed/search")
    public ResponseEntity<List<UserDto.ResponseDto>> searchUsersByNickname(
            @RequestParam(name = "query") String query) {

        // userRepository에서 사용자를 검색하고 Levenshtein 거리로 정렬하여 가져옵니다.
        List<User> users = userRepository.searchUsersByNickname(query);

        // 검색된 사용자 목록을 UserDto.ResponseDto로 변환합니다.
        List<UserDto.ResponseDto> responseDtos = users.stream()
                .map(mapper::userToResponse)
                .collect(Collectors.toList());

        // ResponseEntity를 사용하여 검색 결과를 클라이언트에 반환합니다.
        return ResponseEntity.ok(responseDtos);
    }

    // 유저 삭제
    @DeleteMapping("mypage/{user_id}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable("user_id") long userId) {
        // UserService를 사용하여 userId에 해당하는 유저 삭제
        userService.deleteUser(userId);
        // HTTP 상태 코드 204(NO CONTENT)를 반환
        return ResponseEntity.noContent().build();

    }





}
