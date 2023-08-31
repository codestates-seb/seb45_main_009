package com.mainproject.server.user.controller;


import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.mapper.UserMapper;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/")
@Validated
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper mapper;



    @PostMapping("join/user")
    public ResponseEntity postUser(@Valid @RequestBody UserDto.PostDto requestBody) {
        User user = mapper.postToUser(requestBody);
        user.setUsertype(true);  //유저는 true로 생성

        User createdUser = userService.createUser(user);

        return ResponseEntity.created(URI.create("/user/" + createdUser.getUserId())).body(createdUser);
    }

    @PostMapping("join/store")
    public ResponseEntity postStore(@Valid @RequestBody UserDto.PostDto requestBody) {
        User user = mapper.postToUser(requestBody);
        user.setUsertype(false);  //기업은 false로 생성

        User createdUser = userService.createUser(user);

        return ResponseEntity.created(URI.create("/user/" + createdUser.getUserId())).body(createdUser);
    }

    @GetMapping("mypage/{user_id}")
    public ResponseEntity<UserDto.ResponseDto> getUser(@PathVariable("user_id") long userId) {
        User findUser = userService.findUser(userId);
        UserDto.ResponseDto responseDto = mapper.userToResponse(findUser);
        return ResponseEntity.ok(responseDto);
    }

    @PatchMapping("mypage/{user_id}/update")
    public ResponseEntity<?> patchUser(@PathVariable("user_id") long userId,
                                       @Valid @RequestBody UserDto.PatchDto patchDto) {


            User updatedUser = userService.updateUser(userId, patchDto);
            UserDto.ResponseDto responseDto = mapper.userToResponse(updatedUser);
            return ResponseEntity.ok(responseDto);
    }


    @DeleteMapping("mypage/{user_id}/delete")
    public ResponseEntity<?> deleteUser(@PathVariable("user_id") long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }






}
