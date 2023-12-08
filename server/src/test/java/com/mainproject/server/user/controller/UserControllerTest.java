package com.mainproject.server.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.user.dto.AuthLoginDto;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Gson gson;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    UserRepository userRepository;

    @MockBean
    private UserService userService;

    @Mock
    private ImageService imageService;
//
    private MockMultipartFile userPostDto;
    private MockMultipartFile profileImage;
//    private UserDto.PostDto storePostDto;
//    private UserDto.PatchDto patchDto;
//    private AuthLoginDto authLoginDto;
//    private User user;

    @BeforeEach
    void setUp() {
        // 테스트에 사용할 데이터 초기화
//        userPostDto = new UserDto.PostDto();
//        userPostDto.setEmail("test@test.com");
//        userPostDto.setPassword("test1111");
//        userPostDto.setNickname("test");
//        userPostDto.setBio("hello");
//        userPostDto.setHeight(180);
//        userPostDto.setWeight(80);
//        userPostDto.setLocation("seoul");
//        userPostDto.setSport("football");
//        userPostDto.setProfileimg(new Image());

//        storePostDto = new UserDto.PostDto();
//        storePostDto.setEmail("store@test.com");
//        storePostDto.setPassword("store1111");
//        storePostDto.setNickname("store");
//        storePostDto.setBio("hello");
//        storePostDto.setHeight(180);
//        storePostDto.setWeight(80);
//        storePostDto.setLocation("seoul");
//        storePostDto.setSport("football");
//        storePostDto.setPrice("10000");

//        authLoginDto = new AuthLoginDto();
//        authLoginDto.setEmail("kakao@test.com");
//        authLoginDto.setProfileimg("image");
//
//        patchDto = new UserDto.PatchDto();
//
//        user = new User();
//        user.setEmail("user@test.com");
//        user.setPassword("user1111");

    }

    @DisplayName("addUser: 유저 추가에 성공한다.")
    @Test
    void postUser() throws Exception {
        //given
        final String url = "/join/user";
        UserDto.PostDto userPostDto = new UserDto.PostDto();
        userPostDto.setEmail("test@test.com");
        userPostDto.setPassword("test1111");
        userPostDto.setNickname("test");
//        userPostDto.setBio("hello");
//        userPostDto.setHeight(180);
//        userPostDto.setWeight(80);
//        userPostDto.setLocation("seoul");
//        userPostDto.setSport("football");
//        userPostDto.setProfileimg(new Image());

        // Create a MockMultipartFile for testing
        byte[] fileContent = "Mock file content".getBytes();
        MockMultipartFile profileImg = new MockMultipartFile("profileImg", "test.jpg", "image/jpeg", fileContent);

        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("test1111");
        user.setNickname("test");

        given(userService.createUser(Mockito.any(User.class), Mockito.any(MockMultipartFile.class)))
                .willReturn(user);


        String content = gson.toJson(userPostDto);
        MockMultipartFile content1 = new MockMultipartFile("requestBody", content + ".json", "application/json", content.getBytes(StandardCharsets.UTF_8));

        //when
        ResultActions result =
                mockMvc.perform(multipart(url, 1)
                                .file(content1)
                                .file(profileImg)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
//                        .contentType(MediaType.MULTIPART_FORM_DATA)
        );

        //then
        result
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", is(startsWith("/user/"))))
                .andDo(print());
    }


//    @DisplayName("addUser: 유저 추가에 성공한다.")
//    @Test
//    void postUser() throws Exception {
//        //given
//        final String url = "/join/user";
//        userPostDto = new UserDto.PostDto();
//        userPostDto.setEmail("test@test.com");
//        userPostDto.setPassword("test1111");
//
//        //when
//        final ResultActions result = mockMvc.perform(post(url)
//                .contentType(MediaType.MULTIPART_FORM_DATA)
//                .requestAttr("requestBody", objectMapper.writeValueAsString(userPostDto))
//        );
//
//        //then
//        result
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.email").value(userPostDto.getEmail()));
//    }



    @DisplayName("addStore: 스토어 유저 추가에 성공한다.")
    @Test
    void postStore() throws Exception {
        // MockMultipartFile을 생성하여 profileimg 파트에 넣을 파일 데이터를 만듭니다.
        MockMultipartFile file = new MockMultipartFile("profileimg", "test.jpg", "image/jpeg", "test file".getBytes());

        // 테스트에 사용할 JSON 형식의 request body를 만듭니다.
        String requestBodyJson = "{\"nickname\":null,\"email\":\"test@example.com\",\"password\":\"password123\",\"location\":null,\"profileimg\":null,\"price\":null,\"bio\":null,\"height\":null,\"weight\":null,\"sport\":null}";

        // MockMvcRequestBuilders를 사용하여 POST 요청을 구성합니다.
        mockMvc.perform(MockMvcRequestBuilders.multipart("/join/store")
                        .file(file)  // MultipartFile을 추가합니다.
                        .content(requestBodyJson)  // JSON 형식의 request body를 추가합니다.
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated());  // 예상되는 HTTP 상태 코드를 지정합니다.
    }

//    @DisplayName("addkakao: 카카오 유저 추가에 성공한다.")
//    @Test
//    void oAuth2LoginKakao() throws Exception {
//        // given
//        doReturn(user).when(userService).createUserOAuth2(any(), any());
//
//        // when
//        ResultActions result = mockMvc.perform(post("/join/kakao")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(authLoginDto)));
//
//        // then
//        result.andExpect(status().isOk());
//    }
//
//    @DisplayName("getUserMypage: 유저 정보 조회에 성공한다.")
//    @Test
//    @WithMockUser   // Mock 사용자로 테스트 진행
//    void getUserMypage() throws Exception {
//        // given
//        when(userService.findUser(anyLong())).thenReturn(user);
//
//        // when
//        ResultActions result = mockMvc.perform(get("/mypage")
//                .contentType(MediaType.APPLICATION_JSON));
//
//        // then
//        result.andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").exists())
//                .andExpect(jsonPath("$.data.username").value(user.getUserId()));
//    }
//
//
//
//
//    @DisplayName("getUsers: 유저 전체 조회에 성공한다.")
//    @Test
//    @WithMockUser
//    void getUsers() throws Exception {
//        // given
//        List<User> userList = List.of(user, new User(), new User());
//        doReturn(userList).when(userService).findAllUsers();
//
//        // when
//        ResultActions result = mockMvc.perform(get("/users")
//                .contentType(MediaType.APPLICATION_JSON));
//
//        // then
//        result.andExpect(status().isOk())
//                .andExpect(jsonPath("$").isArray())
//                .andExpect(jsonPath("$.length()").value(userList.size()));
//    }
//
//    @DisplayName("patchUser: 유저 정보 수정에 성공한다.")
//    @Test
//    @WithMockUser
//    void patchUser() throws Exception {
//        // given
//        doReturn(Optional.of(user)).when(userService).findUser(anyLong());
//        doReturn(user).when(userService).updateUser(anyLong(), any(User.class), any());
//
//        // when
//        ResultActions result = mockMvc.perform(patch("/mypage/update")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(patchDto)));
//
//        // then
//        result.andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").exists())
//                .andExpect(jsonPath("$.data.email").value(user.getEmail()));
//    }
//
//    @DisplayName("deleteUser: 유저 삭제에 성공한다.")
//    @Test
//    @WithMockUser
//    void deleteUser() throws Exception {
//        // given
//        doReturn(Optional.of(user)).when(userService).findUser(anyLong());
//
//        // when
//        ResultActions result = mockMvc.perform(delete("/mypage/delete")
//                .contentType(MediaType.APPLICATION_JSON));
//
//        // then
//        result.andExpect(status().isNoContent());
//    }
//
//    private String asJsonString(Object object) throws Exception {
//        return objectMapper.writeValueAsString(object);
//    }
}