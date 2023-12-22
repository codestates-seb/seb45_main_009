package com.mainproject.server.user.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.user.dto.AuthLoginDto;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doReturn;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Autowired
    private JwtTokenizer jwtTokenizer;

    private UserDto.PostDto userPostDto;
    private UserDto.PostDto storePostDto;
    private UserDto.PatchDto patchDto;
    private AuthLoginDto authLoginDto;
    private User user;

    @BeforeEach
    void setUp() {
        userPostDto = new UserDto.PostDto();
        userPostDto.setEmail("test@test.com");
        userPostDto.setPassword("test1111");
        userPostDto.setNickname("test");
        userPostDto.setBio("hello");
        userPostDto.setHeight(180);
        userPostDto.setWeight(80);
        userPostDto.setProfileimg(new Image());

        storePostDto = new UserDto.PostDto();
        storePostDto.setEmail("store@test.com");
        storePostDto.setPassword("store1111");
        storePostDto.setNickname("store");
        storePostDto.setBio("hello");
        storePostDto.setLocation("seoul");
        storePostDto.setSport("football");
        storePostDto.setPrice("10000");

        authLoginDto = new AuthLoginDto();
        authLoginDto.setEmail("kakao@test.com");
        authLoginDto.setProfileimg("image");

        patchDto = new UserDto.PatchDto();
        patchDto.setBio("안녕하세요");
        patchDto.setNickname("patchTest");

        user = new User();
        user.setEmail("user@test.com");
        user.setUserId(1L);
        user.setBio("hello");
        user.setNickname("testUser");
        user.setPassword("user1111");
        user.setRoles(Collections.singletonList("USER"));
    }

    @Test
    @DisplayName("postUser: 유저 추가에 성공한다.")
    void postUser() throws Exception {
        // given
        User createdUser = new User();
        doReturn(createdUser).when(userService).createUser(any(), any());

        // when
        ResultActions result = mockMvc.perform(
                MockMvcRequestBuilders.multipart("/join/user")
                        .file(new MockMultipartFile("requestBody", "", "application/json",
                                asJsonString(userPostDto).getBytes()))
                        .file(new MockMultipartFile("imageUrl", "test.jpeg", "image/png", "test image".getBytes()))
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON));

        // then
        result.andExpect(status().isCreated());
    }

    @Test
    @DisplayName("postStore: 스토어 유저 추가에 성공한다.")
    void postStore() throws Exception {
        // given
        User createdUser = new User();
        doReturn(createdUser).when(userService).createUser(any(), any());

        // when
        ResultActions result = mockMvc.perform(
                MockMvcRequestBuilders.multipart("/join/store")
                        .file(new MockMultipartFile("requestBody", "", "application/json",
                                asJsonString(storePostDto).getBytes()))
                        .file(new MockMultipartFile("imageUrl", "test.jpeg", "image/png",
                                "store test image".getBytes()))
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON));

        // then
        result.andExpect(status().isCreated());
    }

    @Test
    @DisplayName("addkakao: 카카오 유저 추가에 성공한다.")
    void oAuth2LoginKakao() throws Exception {
        // given
        doReturn(user).when(userService).createUserOAuth2(any(), any());

        // when
        ResultActions result = mockMvc.perform(post("/join/kakao")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(authLoginDto)));

        // then
        result.andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    @DisplayName("getUserMypage: 유저 정보 조회에 성공한다.")
    void getUserMypage() throws Exception {
        // given
        doReturn(user).when(userService).findUser(anyLong());

        String testToken = generateMockJwtToken(user);

        // when
        ResultActions result = mockMvc.perform(get("/mypage")
                        .header("Authorization", "Bearer " + testToken)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email", Matchers.is(user.getEmail())))
                .andDo(print());

        // then
        result.andDo(print());
    }

    @Test
    @DisplayName("getUsers: 유저 전체 조회에 성공한다.")
    @WithMockUser
    void getUsers() throws Exception {
        // given
        List<User> userList = List.of(user, new User(), new User());
        doReturn(userList).when(userService).findAllUsers();

        // when
        ResultActions result = mockMvc.perform(get("/users")
                .contentType(MediaType.APPLICATION_JSON));

        // then
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(userList.size()));
    }

    @Test
    @DisplayName("patchUser: 유저 정보 수정에 성공한다.")
    @WithMockUser
    void patchUser() throws Exception {
        // given
        doReturn(user).when(userService).findUser(anyLong());
        doReturn(user).when(userService).updateUser(anyLong(), any(User.class), any());

        String testToken = generateMockJwtToken(user);

        // when
        ResultActions result = mockMvc.perform(
                multipart(HttpMethod.PATCH, "/mypage/update")
                        .file(new MockMultipartFile("requestBody", "", "application/json",
                                asJsonString(patchDto).getBytes()))
                        .file(new MockMultipartFile("imageUrl", "test.jpeg", "image/png",
                                "patch test image".getBytes()))
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + testToken));

        // then
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.bio").value(user.getBio()))
                .andExpect(jsonPath("$.data.nickname").value(user.getNickname()));
    }

    @Test
    @DisplayName("deleteUser: 유저 삭제에 성공한다.")
    @WithMockUser
    void deleteUser() throws Exception {
        // given
        doReturn(user).when(userService).findUser(anyLong());

        String testToken = generateMockJwtToken(user);

        // when
        ResultActions result = mockMvc.perform(delete("/mypage/delete")
                .header("Authorization", "Bearer " + testToken)
                .contentType(MediaType.APPLICATION_JSON));

        // then
        result.andExpect(status().isNoContent());
    }

    private String asJsonString(Object object) throws JsonProcessingException {
        return objectMapper.writeValueAsString(object);
    }

    private String generateMockJwtToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("roles", user.getRoles());

        String subject = user.getEmail();
        Date expiration = jwtTokenizer.getTokenExpiration(jwtTokenizer.getAccessTokenExpirationMinutes());

        String base64EncodedSecretKey = jwtTokenizer.encodeBase64SecretKey(jwtTokenizer.getSecretKey());
        return jwtTokenizer.generateAccessToken(claims, subject, expiration, base64EncodedSecretKey);
    }
}
