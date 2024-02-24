package com.mainproject.server.feed.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.feed.dto.FeedDto;
import com.mainproject.server.feed.service.FeedService;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import com.mainproject.server.userprofile.entity.UserProfile;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
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


import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FeedControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenizer jwtTokenizer;

    @MockBean
    private UserService userService;

    @MockBean
    private FeedService feedService;


    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("user@test.com");
        user.setUserId(1L);
        user.setBio("hello");
        user.setLocation("서울");
        user.setNickname("testUser");
        user.setPassword("user1111");
        user.setProfileimg(new Image());
        user.setRoles(Collections.singletonList("USER"));

        UserProfile userProfile = new UserProfile();
        userProfile.setId(1L);
        userProfile.setUser(user);
        userProfile.setFeedCount(0L);
        userProfile.setFollowerCount(0L);
        userProfile.setFollowCount(0L);
        user.setUserProfile(userProfile);
    }

    @Test
    @WithMockUser
    void postFeed_피드등록() throws Exception {
        // given
        FeedDto.PostDto postDto = new FeedDto.PostDto();
        postDto.setContent("테스트 내용");
        postDto.setRelatedTags(Arrays.asList("테스트태그", "testTag"));
        postDto.setImageTags(List.of());

        String testToken = generateMockJwtToken(user);

        // 이미지 업로드를 위한 MockMultipartFile
        MockMultipartFile imageUrl = new MockMultipartFile("imageUrl", "test.jpg", "image/jpeg", "이미지 데이터".getBytes());
        MockMultipartFile feedPostDto = new MockMultipartFile("feedPostDto", "feedPostDto", "application/json",
                asJsonString(postDto).getBytes());

        // userService.findVerifiedUser(userId)를 Mock으로 대체
        when(userService.findVerifiedUser(anyLong())).thenReturn(user);

        // when
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.multipart("/feed/add")
                        .file(imageUrl)
                        .file(feedPostDto)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("Authorization", "Bearer " + testToken))
                .andDo(print());

        // then
        result.andExpect(status().isCreated());
    }


    @Test
    void patchFeedImage_피드이미지수정() throws Exception {
        // 테스트용 데이터
        FeedDto.PatchDto patchDto = new FeedDto.PatchDto();
        patchDto.setContent("수정된 내용");
        patchDto.setRelatedTags(Arrays.asList("테스트태그", "testTag"));

        // 이미지 업로드를 위한 MockMultipartFile
        MockMultipartFile imageFile = new MockMultipartFile("imageUrl", "test.jpg", "image/jpeg",
                "수정된 이미지 데이터".getBytes());
        MockMultipartFile feedPatchDto = new MockMultipartFile("feedPatchDto", "", "application/json",
                asJsonString(patchDto).getBytes());

        String testToken = generateMockJwtToken(user);

        // userService.findVerifiedUser(userId)를 Mock으로 대체
        when(userService.findVerifiedUser(anyLong())).thenReturn(user);

        // 요청 수행
        ResultActions result = mockMvc.perform(
                        MockMvcRequestBuilders.multipart(HttpMethod.PATCH, "/feed/detail/1/image/1")
                                .file(imageFile)
                                .file(feedPatchDto)
                                .accept(MediaType.APPLICATION_JSON)
                                .contentType(MediaType.MULTIPART_FORM_DATA)
                                .header("Authorization", "Bearer " + testToken));

        // 응답 검증
        result.andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void patchFeedImages_피드이미지추가() throws Exception {
        // 테스트용 데이터
        FeedDto.PatchDto patchDto = new FeedDto.PatchDto();
        patchDto.setContent("피드 이미지 추가");

        // 이미지 업로드를 위한 MockMultipartFile 리스트
        MockMultipartFile imageFile1 = new MockMultipartFile("imageUrl", "test1.jpg", "image/jpeg",
                "이미지 데이터1".getBytes());
        MockMultipartFile imageFile2 = new MockMultipartFile("imageUrl", "test2.jpg", "image/jpeg",
                "이미지 데이터2".getBytes());
        MockMultipartFile feedPatchDto = new MockMultipartFile("feedPatchDto", "", "application/json",
                asJsonString(patchDto).getBytes());

        String testToken = generateMockJwtToken(user);

        // 요청 수행
        ResultActions result = mockMvc.perform(
                MockMvcRequestBuilders.multipart(HttpMethod.PATCH, "/feed/detail/1/images")
                        .file(imageFile1)
                        .file(imageFile2)
                        .file(feedPatchDto)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("Authorization", "Bearer " + testToken));

        // 응답 검증
        result.andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    void findUserFeeds_유저피드조회() throws Exception {
        // 요청 수행
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/")
                .param("page", "1")
                .param("size", "8"));

        // 응답 검증
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.data.feedResponseDtos").isArray());
    }

    @Test
    void findStoreFeed_스토어피드조회() throws Exception {
        // 요청 수행
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/store")
                .param("page", "1")
                .param("size", "8"));

        // 응답 검증
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.data.feedResponseDtos").isArray());
    }

    @Test
    void findDetailFeed_피드상세조회() throws Exception {
        // 요청 수행
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/feed/detail/1"));

        // 응답 검증
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.data.caption").exists());
    }

    @Test
    void deleteFeed_피드삭제() throws Exception {
        // 요청 수행
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.delete("/feed/detail/1")
                .header("userId", "1"));

        // 응답 검증
        result.andExpect(status().isNoContent());
    }

    @Test
    void deleteFeedImage_피드이미지삭제() throws Exception {
        // 요청 수행
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.delete("/feed/detail/1/image/1")
                .header("userId", "1"));

        // 응답 검증
        result.andExpect(status().isNoContent());
    }

    @Test
    void filterUserFeeds_유저피드필터() throws Exception {
        // 요청 수행
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/filter")
                .param("page", "1")
                .param("size", "8")
                .param("relatedTags", "tag1", "tag2"));

        // 응답 검증
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.data.feedResponseDtos").isArray());
    }

    @Test
    void filterStoreFeeds_스토어피드필터() throws Exception {
        // 요청 수행
        ResultActions result = mockMvc.perform(MockMvcRequestBuilders.get("/storefilter")
                .param("page", "1")
                .param("size", "8")
                .param("relatedTags", "tag1", "tag2")
                .param("location", "Seoul"));

        // 응답 검증
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.data.feedResponseDtos").isArray());
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
