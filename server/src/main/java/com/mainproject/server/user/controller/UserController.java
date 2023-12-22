package com.mainproject.server.user.controller;


import com.mainproject.server.auth.loginresolver.LoginUserId;
import com.mainproject.server.response.DataResponseDto;
import com.mainproject.server.response.SingleResponseDto;
import com.mainproject.server.user.dto.AuthLoginDto;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.mapper.UserMapper;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    // 유저 등록
    @PostMapping("join/user")
    public ResponseEntity postUser(@Valid @RequestPart UserDto.PostDto requestBody,
                                   @RequestPart(value = "imageUrl", required = false) MultipartFile imageFiles) {

        log.info("### user login start! ###");
        User user = mapper.postToUser(requestBody);

        User createdUser = userService.createUser(user, imageFiles);
        userService.setUserRole(createdUser);

        log.info("### user login end! ###");
        // 생성된 유저 정보를 반환하고 HTTP 상태 코드 201(CREATED)를 반환
        return ResponseEntity.created(URI.create("/user/" + createdUser.getUserId())).build();
    }

    // 기업 등록
    @PostMapping("join/store")
    public ResponseEntity postStore(@Valid @RequestPart UserDto.PostDto requestBody,
                                    @RequestPart("imageUrl") MultipartFile imageFiles) {
        log.info("### store login start! ###");
        User user = mapper.postToUser(requestBody);

        User createdUser = userService.createUser(user, imageFiles);
        userService.setStoreUserRole(createdUser);

        log.info("### store login end! ###");
        // 생성된 기업 정보를 반환하고 HTTP 상태 코드 201(CREATED)를 반환
        return ResponseEntity.created(URI.create("/user/" + createdUser.getUserId())).build();
    }


    @PostMapping("/join/kakao")
    public ResponseEntity oAuth2LoginKakao(@RequestBody @Valid AuthLoginDto requesBody) {
        log.info("### oauth2 login start! ###");

        // 초기화
        String accessToken = "";
        String refreshToken = "";
        String userId = "";
        String userNickname = "";
        String userRole = "";

        // AuthLoginDto에서 User 객체로 매핑
        User user = mapper.AuthLoginDtoUser(requesBody);
        String image = new String();

//        Image createimg = userService.createimgOAuth2(requesBody.getProfileimg());

        // "ROLE_USER" 역할을 설정
        user.getRoles().add("USER");
        // 닉네임을 kakao로 설정
        user.setNickname("kakao");
        user.setEmail(user.getEmail());
//        user.setProfileimg(createimg);

        // 사용자가 이메일로 이미 가입했는지 확인
        if (!userService.existsByEmail(user.getEmail())) {
            // 새로운 사용자로 등록
            user = userService.createUserOAuth2(user, image);
        } else {
            // 기존 사용자 정보 가져오기
            user = userService.findVerifiedUser(user.getEmail());
        }

        // 엑세스 토큰 및 리프레시 토큰 발급
        accessToken = userService.delegateAccessToken(user);
        refreshToken = userService.delegateRefreshToken(user);
        // 사용자 ID를 문자열로 변환
        userId = String.valueOf(user.getUserId());
        // 사용자 닉네임 가져오기
        userNickname = user.getNickname();
        // 사용자 역할 가져오기 (예: "USER")
        userRole = user.getRoles().stream().findFirst().orElse("");

        log.info("### oauth2 login end! ###");

        // 응답 헤더에 토큰 및 사용자 ID, nickname, role 값 추가하여 반환
        return ResponseEntity.ok().header("Authorization", "Bearer " + accessToken)
                .header("Refresh", refreshToken)
                .header("UserId", userId)
                .header("UserNickname", userNickname)
                .header("UserRole", userRole)
                .build();

    }

    // 유저 정보 조회
    @PreAuthorize("isAuthenticated()")
    @GetMapping("mypage")
    public ResponseEntity getUserMypage(@LoginUserId Long userId) {
        User findUser = userService.findUser(userId);
        UserDto.ResponseDto response = mapper.userToResponse(findUser);

        return new ResponseEntity<>(
                new DataResponseDto<>(response), HttpStatus.OK);
    }

//    // 유저 전체 조회(페이지 네이션)
//    @GetMapping("users")
//    public ResponseEntity<Page<UserDto.ResponseDto>> getUsers(
//            @RequestParam(name = "page", defaultValue = "0") int page,
//            @RequestParam(name = "size", defaultValue = "10") int size) {
//
//        // UserService를 사용하여 페이지네이션된 유저 목록 조회
//        Page<User> userPage = userService.findUsers(page, size);
//        // 조회한 유저 목록을 UserDto.ResponseDto로 매핑하여 반환
//        Page<UserDto.ResponseDto> responsePage = userPage.map(mapper::userToResponse);
//
//        return ResponseEntity.ok(responsePage);
//    }

    // 유저 전체 조회
    @GetMapping("users")
    public ResponseEntity<List<UserDto.ResponseDto>> getUsers() {
        // UserService를 사용하여 전체 유저 목록 조회
        List<User> userList = userService.findAllUsers();

        // 조회한 유저 목록을 UserDto.ResponseDto로 매핑하여 반환
        List<UserDto.ResponseDto> responseList = userList.stream()
                .map(mapper::userToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }

    // 유저 정보 업데이트
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("mypage/update")
    public ResponseEntity<?> patchUser(@LoginUserId Long loginId,
                                       @RequestPart @Valid UserDto.PatchDto requestBody,
                                       @RequestPart(value = "imageUrl", required = false) MultipartFile profileimg) {

        User user = mapper.patchToUser(requestBody);
        user.setUserId(loginId); // loginId를 사용자 ID로 설정
        User updatedUser = userService.updateUser(loginId, user, profileimg);
        UserDto.ResponseDto response = mapper.userToResponse(updatedUser);

        return new ResponseEntity<>(new SingleResponseDto<>(response), HttpStatus.OK);
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

//    @GetMapping("oauth/kakao/callback")
//    public @ResponseBody String kakaocallback(String code) {
//        // POST 방식으로 key=value 데이터를 요청 (카카오쪽으로)
//        // 이 때 필요한 라이브러리가 RestTemplate, 얘를 쓰면 http 요청을 편하게 할 수 있다.
//        RestTemplate rt = new RestTemplate();
//
//        // HTTP POST를 요청할 때 보내는 데이터(body)를 설명해주는 헤더도 만들어 같이 보내줘야 한다.
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
//
//        // body 데이터를 담을 오브젝트인 MultiValueMap를 만들어보자
//        // body는 보통 key, value의 쌍으로 이루어지기 때문에 자바에서 제공해주는 MultiValueMap 타입을 사용한다.
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("grant_type", "authorization_code");
//        params.add("client_id", "16eb10c06d0bbc7b6782b5d2386be82b");
//        params.add("redirect_uri", "http://localhost:8080/oauth/kakao/callback");
//        params.add("code", code);
//
//        // 요청하기 위해 헤더(Header)와 데이터(Body)를 합친다.
//        // kakaoTokenRequest는 데이터(Body)와 헤더(Header)를 Entity가 된다.
//        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);
//
//        // POST 방식으로 Http 요청한다. 그리고 response 변수의 응답 받는다.
//        ResponseEntity<String> response = rt.exchange(
//                "https://kauth.kakao.com/oauth/token", // https://{요청할 서버 주소}
//                HttpMethod.POST, // 요청할 방식
//                kakaoTokenRequest, // 요청할 때 보낼 데이터
//                String.class // 요청 시 반환되는 데이터 타입
//        );
//        return "카카오 토큰 요청 완료 : 토큰 요청에 대한 응답 : "+response;
//    }
}
