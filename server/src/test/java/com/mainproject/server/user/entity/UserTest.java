import static org.junit.jupiter.api.Assertions.*;

import com.mainproject.server.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

@DisplayName("User 테스트")
class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        // 각 테스트 전에 User 객체를 초기화합니다.
        user = new User();
        user.setUserId(1L);
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setNickname("testuser");
        user.setCreatedAt(LocalDateTime.now());
        user.setModifiedAt(LocalDateTime.now());
        user.setSport("Football");
        user.setLocation("Gyeonggi");
        user.setHeight(180);
        user.setWeight(75);
    }

    @Test
    @DisplayName("Get UserId")
    void getUserId() {
        assertEquals(1L, user.getUserId());
    }

    @Test
    @DisplayName("Get Email")
    void getEmail() {
        assertEquals("test@example.com", user.getEmail());
    }

    @Test
    @DisplayName("Get Password")
    void getPassword() {
        assertEquals("password", user.getPassword());
    }

    @Test
    @DisplayName("Get Nickname")
    void getNickname() {
        assertEquals("testuser", user.getNickname());
    }

    @Test
    @DisplayName("Get CreatedAt")
    void getCreatedAt() {
        assertNotNull(user.getCreatedAt());
    }

    @Test
    @DisplayName("Get ModifiedAt")
    void getModifiedAt() {
        assertNotNull(user.getModifiedAt());
    }

    @Test
    @DisplayName("Get Sport")
    void getSport() {
        assertEquals("Football", user.getSport());
    }

    @Test
    @DisplayName("Get Location")
    void getLocation() {
        assertEquals("Gyeonggi", user.getLocation());
    }

    @Test
    @DisplayName("Get Height")
    void getHeight() {
        assertEquals(180, user.getHeight());
    }

    @Test
    @DisplayName("Get Weight")
    void getWeight() {
        assertEquals(75, user.getWeight());
    }

    @Test
    @DisplayName("Set UserId")
    void setUserId() {
        user.setUserId(2L);
        assertEquals(2L, user.getUserId());
    }

    @Test
    @DisplayName("Set Email")
    void setEmail() {
        user.setEmail("newemail@example.com");
        assertEquals("newemail@example.com", user.getEmail());
    }

    @Test
    @DisplayName("Set Password")
    void setPassword() {
        user.setPassword("newpassword");
        assertEquals("newpassword", user.getPassword());
    }

    @Test
    @DisplayName("Set Nickname")
    void setNickname() {
        user.setNickname("newnickname");
        assertEquals("newnickname", user.getNickname());
    }

    @Test
    @DisplayName("Set Sport")
    void setSport() {
        user.setSport("Basketball");
        assertEquals("Basketball", user.getSport());
    }

    @Test
    @DisplayName("Set Location")
    void setLocation() {
        user.setLocation("Seoul");
        assertEquals("Seoul", user.getLocation());
    }

    @Test
    @DisplayName("Set Height")
    void setHeight() {
        user.setHeight(170);
        assertEquals(170, user.getHeight());
    }

    @Test
    @DisplayName("Set Weight")
    void setWeight() {
        user.setWeight(80);
        assertEquals(80, user.getWeight());
    }
}
