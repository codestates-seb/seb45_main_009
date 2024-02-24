package com.mainproject.server.feed.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.mainproject.server.feedcomment.entity.FeedComment;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.liked.entity.Liked;
import com.mainproject.server.user.entity.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

class FeedTest {

    @Test
    void getFeedId() {
        Feed feed = new Feed();
        feed.setFeedId(1L);
        assertEquals(1L, feed.getFeedId());
    }

    @Test
    void getLocation() {
        Feed feed = new Feed();
        feed.setLocation("TestLocation");
        assertEquals("TestLocation", feed.getLocation());
    }

    @Test
    void getContent() {
        Feed feed = new Feed();
        feed.setContent("TestContent");
        assertEquals("TestContent", feed.getContent());
    }

    @Test
    void getRelatedTags() {
        Feed feed = new Feed();
        feed.getRelatedTags().add("Tag1");
        feed.getRelatedTags().add("Tag2");
        assertEquals(2, feed.getRelatedTags().size());
    }

    @Test
    void getCreatedAt() {
        Feed feed = new Feed();
        assertNotNull(feed.getCreatedAt());
    }

    @Test
    void getModifiedAt() {
        Feed feed = new Feed();
        assertNotNull(feed.getModifiedAt());
    }

    @Test
    void getFeedComment() {
        Feed feed = new Feed();
        FeedComment feedComment = new FeedComment();
        feed.getFeedComment().add(feedComment);
        assertEquals(1, feed.getFeedComment().size());
    }

    @Test
    void getImages() {
        Feed feed = new Feed();
        Image image = new Image();
        feed.getImages().add(image);
        assertEquals(1, feed.getImages().size());
    }

    @Test
    void getUser() {
        Feed feed = new Feed();
        User user = new User();
        feed.setUser(user);
        assertEquals(user, feed.getUser());
    }

    @Test
    void getLikedList() {
        Feed feed = new Feed();
        Liked liked = new Liked();
        feed.getLikedList().add(liked);
        assertEquals(1, feed.getLikedList().size());
    }

    @Test
    void setFeedId() {
        Feed feed = new Feed();
        feed.setFeedId(1L);
        assertEquals(1L, feed.getFeedId());
    }

    @Test
    void setLocation() {
        Feed feed = new Feed();
        feed.setLocation("TestLocation");
        assertEquals("TestLocation", feed.getLocation());
    }

    @Test
    void setContent() {
        Feed feed = new Feed();
        feed.setContent("TestContent");
        assertEquals("TestContent", feed.getContent());
    }

    @Test
    void setRelatedTags() {
        Feed feed = new Feed();
        List<String> tags = new ArrayList<>();
        tags.add("Tag1");
        tags.add("Tag2");
        feed.setRelatedTags(tags);
        assertEquals(2, feed.getRelatedTags().size());
    }

    @Test
    void setCreatedAt() {
        Feed feed = new Feed();
        LocalDateTime createdAt = LocalDateTime.now().minusDays(1);
        feed.setCreatedAt(createdAt);
        assertEquals(createdAt, feed.getCreatedAt());
    }

    @Test
    void setModifiedAt() {
        Feed feed = new Feed();
        LocalDateTime modifiedAt = LocalDateTime.now().minusHours(3);
        feed.setModifiedAt(modifiedAt);
        assertEquals(modifiedAt, feed.getModifiedAt());
    }

    @Test
    void setFeedComment() {
        Feed feed = new Feed();
        FeedComment feedComment = new FeedComment();
        List<FeedComment> feedComments = new ArrayList<>();
        feedComments.add(feedComment);
        feed.setFeedComment(feedComments);
        assertEquals(1, feed.getFeedComment().size());
    }

    @Test
    void setImages() {
        Feed feed = new Feed();
        Image image = new Image();
        List<Image> images = new ArrayList<>();
        images.add(image);
        feed.setImages(images);
        assertEquals(1, feed.getImages().size());
    }

    @Test
    void setUser() {
        Feed feed = new Feed();
        User user = new User();
        feed.setUser(user);
        assertEquals(user, feed.getUser());
    }
}
