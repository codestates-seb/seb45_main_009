import com.mainproject.server.auth.jwt.JwtTokenizer;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.repository.UserRepository;
import com.mainproject.server.user.service.UserService;
import com.mainproject.server.userprofile.repository.UserProfileRepository;
import java.time.LocalDateTime;
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

        UserService userService = new UserService(userRepository, imageService, jwtTokenizer, passwordEncoder);

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password12");

        // Create a MockMultipartFile for testing
        byte[] fileContent = "Mock file content".getBytes();
        MockMultipartFile profileImg = new MockMultipartFile("profileImg", "test.jpg", "image/jpeg", fileContent);

        // Mock S3UploadService
        when(imageService.createImage(any(MultipartFile.class))).thenReturn("mock-image-url");

        // Mock repository methods
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setUserId(1L);  // Set a sample user ID
            return savedUser;
        });

        // Act
        User resultUser = userService.createUser(user, profileImg);

        // Assert
        assertNotNull(resultUser);
        assertEquals("test@example.com", resultUser.getEmail());

        // Verify that the S3UploadService.createImage method was called with the correct arguments
        verify(imageService).createImage(profileImg);

        // Verify that the profile image URL in the user object is set correctly
        assertNotNull(resultUser.getProfileimg());
        assertEquals("mock-image-url", resultUser.getProfileimg().getImageUrl());

        // Verify that userRepository.save was called with the correct user object
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("유저 생성 - 성공 (프로필 이미지 없음)")
    void createUser_Success_NoProfileImage() {
        // Arrange

        UserService userService = new UserService(userRepository, imageService, jwtTokenizer, passwordEncoder);
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password12");

        MultipartFile profileImg = null;

        // Mocking userRepository.save() method
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User resultUser = userService.createUser(user, profileImg);

        // Assert
        assertNotNull(resultUser);
        assertEquals("test@example.com", resultUser.getEmail());

        // Verify that createImage method is never called
        verify(imageService, never()).createImage(any(MultipartFile.class));

        // Verify that userRepository.save is called with the correct user
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("유저 OAuth2 생성 - 성공")
    void createUserOAuth2_Success() {
        User user = new User();
        user.setProfileimg(new Image());
        user.setNickname("testNickname");

        // Mock repository methods if necessary
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User resultUser = userService.createUserOAuth2(user, "image");

        // Assert
        assertNotNull(resultUser);
        assertEquals("testNickname", resultUser.getNickname());
        // Add more assertions based on your specific use case
    }

    @Test
    @DisplayName("유저 정보 변경 - (프로필 이미지 없음)")
    void updateUser_Success() {
        // Arrange
        User existingUser = new User();
        existingUser.setUserId(1L);

        User updatedUser = new User();
        updatedUser.setUserId(1L);
        updatedUser.setNickname("newNickname");

        MultipartFile profileImg = null;

        // Mock repository methods if necessary
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // Act
        User resultUser = userService.updateUser(1L, updatedUser, profileImg);

        // Assert
        assertNotNull(resultUser);
        assertEquals("newNickname", resultUser.getNickname());
    }

    @Test
    @DisplayName("유저 조회 - 성공")
    void findUser_Success() {
        // Arrange
        User user = new User();
        user.setUserId(1L);

        // Mock repository methods if necessary
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        // Act
        User resultUser = userService.findUser(1L);

        // Assert
        assertNotNull(resultUser);
        assertEquals(1L, resultUser.getUserId());
        // Add more assertions based on your specific use case
    }

    @Test
    @DisplayName("유저 전체 조회 - 성공")
    void findAllUsers_Success() {
        // Arrange
        List<User> userList = List.of(new User(), new User());

        // Mock repository methods if necessary
        when(userRepository.findAll()).thenReturn(userList);

        // Act
        List<User> resultUsers = userService.findAllUsers();

        // Assert
        assertNotNull(resultUsers);
        assertEquals(2, resultUsers.size());
        // Add more assertions based on your specific use case
    }

    @Test
    @DisplayName("유저 삭제 - 성공")
    void deleteUser_Success() {
        // Arrange
        User existingUser = new User();
        existingUser.setUserId(1L);

        // Mock repository methods if necessary
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(existingUser));

        // Act
        userService.deleteUser(1L);

        // Verify repository method calls if necessary
        verify(userRepository, times(1)).delete(existingUser);
    }
}
