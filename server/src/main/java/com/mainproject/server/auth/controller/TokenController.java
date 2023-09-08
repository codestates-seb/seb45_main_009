package com.mainproject.server.auth.controller;


import com.mainproject.server.auth.service.TokenService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.user.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TokenController {

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/token/refresh")  //refresh 토큰을 이용한 access 토큰 재발급
    public ResponseEntity<String> refreshAccessToken(HttpServletRequest request) {
        String refreshTokenHeader = request.getHeader("Refresh");

        Jws<Claims> claims = tokenService.checkRefreshToken(refreshTokenHeader);
        String email = claims.getBody().getSubject();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            String accessToken = userService.delegateAccessToken(user);

            return ResponseEntity.ok().header("Authorization", "Bearer " + accessToken).body("Successfully refresh");
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

    }

    @PostMapping("/token/check")  //access 토큰 검증
    public ResponseEntity<String> checkAccessToken(HttpServletRequest request) {
        String refreshTokenHeader = request.getHeader("Authorization");

        Jws<Claims> claims = tokenService.checkAccessToken(refreshTokenHeader);


        long currentTime = System.currentTimeMillis();
        long jwsTime = claims.getBody().getExpiration().getTime();
        long remainingTimeMillis = jwsTime - currentTime;

        long hours = TimeUnit.MILLISECONDS.toHours(remainingTimeMillis);
        long minutes = TimeUnit.MILLISECONDS.toMinutes(remainingTimeMillis) % 60;
        long seconds = TimeUnit.MILLISECONDS.toSeconds(remainingTimeMillis) % 60;

        String remainingTime = hours + "시간 " + minutes + "분 " + seconds + "초";

        return ResponseEntity.ok().body("현재 토큰의 잔여 시간은 " + remainingTime + " 입니다");
    }



}
