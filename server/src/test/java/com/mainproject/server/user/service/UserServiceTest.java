package com.mainproject.server.user.service;

import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@DisplayName("UserService 테스트")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private UserService userService;

    private JwtTokenizer jwtTokenizer;

    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Test
    @DisplayName("유저 생성 - 성공")
    void createUser_Success() {
        // Given
        UserService userService = new UserService(userRepository, imageService, jwtTokenizer, passwordEncoder);
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password12");

        // 테스트용 MockMultipartFile 생성
        byte[] fileContent = "Mock file content".getBytes();
        MockMultipartFile profileImg = new MockMultipartFile("profileImg", "test.jpeg", "image/jpeg", fileContent);

        // S3UploadService를 모의화
        when(imageService.createImage(any(MultipartFile.class))).thenReturn("mock-image-url");

        // UserRepository 메서드를 모의화
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setUserId(1L);  // 샘플 사용자 ID 설정
            return savedUser;
        });

        // When
        User resultUser = userService.createUser(user, profileImg);

        // Then
        assertNotNull(resultUser);
        assertEquals("test@example.com", resultUser.getEmail());

        // S3UploadService.createImage 메서드가 올바른 인수로 호출되었는지 확인
        verify(imageService).createImage(profileImg);

        // 사용자 객체의 프로필 이미지 URL이 올바르게 설정되었는지 확인
        assertNotNull(resultUser.getProfileimg());
        assertEquals("mock-image-url", resultUser.getProfileimg().getImageUrl());

        // userRepository.save가 올바른 사용자 객체로 호출되었는지 확인
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("유저 생성 - 성공 (프로필 이미지 없음)")
    void createUser_Success_NoProfileImage() {
        // Given
        UserService userService = new UserService(userRepository, imageService, jwtTokenizer, passwordEncoder);
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password12");

        MultipartFile profileImg = null;

        // userRepository.save() 메서드를 모의화
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        User resultUser = userService.createUser(user, profileImg);

        // Then
        assertNotNull(resultUser);
        assertEquals("test@example.com", resultUser.getEmail());

        // createImage 메서드가 호출되지 않았는지 확인
        verify(imageService, never()).createImage(any(MultipartFile.class));

        // userRepository.save가 올바른 사용자로 호출되었는지 확인
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("유저 OAuth2 생성 - 성공")
    void createUserOAuth2_Success() {
        // Given
        User user = new User();
        user.setProfileimg(new Image());
        user.setNickname("testNickname");

        // 필요한 경우 userRepository 메서드를 모의화
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        User resultUser = userService.createUserOAuth2(user, "image");

        // Then
        assertNotNull(resultUser);
        assertEquals("testNickname", resultUser.getNickname());
    }

    @Test
    @DisplayName("유저 정보 변경 - (프로필 이미지 없음)")
    void updateUser_Success() {
        // Given
        User existingUser = new User();
        existingUser.setUserId(1L);

        User updatedUser = new User();
        updatedUser.setUserId(1L);
        updatedUser.setNickname("newNickname");

        MultipartFile profileImg = null;

        // userRepository 메서드를 모의화합
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // When
        User resultUser = userService.updateUser(1L, updatedUser, profileImg);

        // Then
        assertNotNull(resultUser);
        assertEquals("newNickname", resultUser.getNickname());
    }

    @Test
    @DisplayName("유저 조회 - 성공")
    void findUser_Success() {
        // Given
        User user = new User();
        user.setUserId(1L);

        // userRepository 메서드를 모의화
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        // When
        User resultUser = userService.findUser(1L);

        // Then
        assertNotNull(resultUser);
        assertEquals(1L, resultUser.getUserId());
    }

    @Test
    @DisplayName("유저 전체 조회 - 성공")
    void findAllUsers_Success() {
        // Given
        List<User> userList = List.of(new User(), new User());

        // userRepository 메서드를 모의화
        when(userRepository.findAll()).thenReturn(userList);

        // When
        List<User> resultUsers = userService.findAllUsers();

        // Then
        assertNotNull(resultUsers);
        assertEquals(2, resultUsers.size());
    }

    @Test
    @DisplayName("유저 삭제 - 성공")
    void deleteUser_Success() {
        // Given
        User existingUser = new User();
        existingUser.setUserId(1L);

        // userRepository 메서드를 모의화
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(existingUser));

        // When
        userService.deleteUser(1L);

        // Then
        // userRepository 메서드 호출을 검증
        verify(userRepository, times(1)).delete(existingUser);
    }
}
