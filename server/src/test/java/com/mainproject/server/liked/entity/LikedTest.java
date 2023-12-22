package com.mainproject.server.liked.entity;

import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.user.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class LikedTest {

    @Test
    void disconnectFeed() {
        Liked liked = new Liked();

        // User 엔터티 생성
        User user = new User();
        user.setNickname("testUser");
        user.setEmail("test@example.com");

        // Feed 엔터티 생성
        Feed feed = new Feed();
        feed.setContent("Test feed content");
        feed.setUser(user);

        // Liked 엔터티를 빌더를 사용하여 생성
        liked = Liked.builder()
                .user(user)
                .feed(feed)
                .build();

        // disconnectFeed 호출 전에는 feed가 연결되어 있어야 함
        assertNotNull(liked.getFeed());

        // disconnectFeed 호출 후에는 feed가 null로 설정되어 있어야 함
        liked.disconnectFeed();
        assertNull(liked.getFeed());
    }


    @Test
    void getId() {
        Liked liked = new Liked();
        liked.setId(1L);
        assertEquals(1L, liked.getId());
    }

    @Test
    void getUser() {
        Liked liked = new Liked();
        User user = new User();
        liked.setUser(user);
        assertEquals(user, liked.getUser());
    }

    @Test
    void getFeed() {
        Liked liked = new Liked();
        Feed feed = new Feed();
        liked.setFeed(feed);
        assertEquals(feed, liked.getFeed());
    }

    @Test
    void getLikedDate() {
        Liked liked = new Liked();
        // 예상 시간을 현재 시간의 조금 이전이나 이후로 설정
        LocalDateTime expectedTime = LocalDateTime.now().minusSeconds(1);
        liked.setLikedDate(expectedTime);
        assertEquals(expectedTime, liked.getLikedDate());
    }


    @Test
    void setId() {
        Liked liked = new Liked();
        liked.setId(1L);
        assertEquals(1L, liked.getId());
    }

    @Test
    void setUser() {
        Liked liked = new Liked();
        User user = new User();
        liked.setUser(user);
        assertEquals(user, liked.getUser());
    }

    @Test
    void setFeed() {
        Liked liked = new Liked();
        Feed feed = new Feed();
        liked.setFeed(feed);
        assertEquals(feed, liked.getFeed());
    }

    @Test
    void setLikedDate() {
        Liked liked = new Liked();
        LocalDateTime expectedTime = LocalDateTime.now().minusSeconds(1);
        liked.setLikedDate(expectedTime);
        assertEquals(expectedTime, liked.getLikedDate());
    }

    @Test
    void builder() {
        // User 엔터티 생성
        User user = new User();
        user.setNickname("test");
        user.setEmail("test@test.com");

        // Feed 엔터티 생성
        Feed feed = new Feed();
        feed.setContent("test");
        feed.setUser(user);

        // Liked 엔터티를 빌더를 사용하여 생성
        Liked liked = Liked.builder()
                .user(user)
                .feed(feed)
                .build();

        // 생성된 엔터티의 값 검증
        assertNotNull(liked);
        assertEquals(user, liked.getUser());
        assertEquals(feed, liked.getFeed());
    }

}