package com.mainproject.server.feed.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.follow.entity.Follow;
import com.mainproject.server.follow.repository.FollowRepository;
import com.mainproject.server.follow.service.FollowService;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.repository.ImageRepository;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.notification.entity.Notification;
import com.mainproject.server.notification.service.NotificationService;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import com.mainproject.server.userprofile.entity.UserProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FeedServiceTest {

    @Mock
    private FeedRepository feedRepository;

    @Mock
    private ImageService imageService;

    @Mock
    private UserService userService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private FollowService followService;

    @Mock
    private FollowRepository followRepository;

    private User user;

    @InjectMocks
    private FeedService feedService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setUserId(1L);
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setNickname("testUser");
        user.setCreatedAt(LocalDateTime.now());
        user.setModifiedAt(LocalDateTime.now());
        user.setSport("Football");
        user.setLocation("Gyeonggi");
        user.setHeight(180);
        user.setWeight(75);

        UserProfile userProfile = new UserProfile();
        userProfile.setFeedCount(0L);
        user.setUserProfile(userProfile);

        UserDto.ResponseDto followerDto = new UserDto.ResponseDto();
        followerDto.setUserId(1L);

        when(userService.findVerifiedUser(anyLong())).thenReturn(user);
        when(followService.getFollowersList(anyLong())).thenReturn(Collections.singletonList(followerDto));
        when(followRepository.findByFollowerAndFollow(any(User.class), any(User.class))).thenReturn(new Follow());
        when(userService.findUser(1L)).thenReturn(user);
    }

    @Test
    @DisplayName("피드 생성 - 피드를 생성하고 팔로워들에게 알림을 보내야 함")
    void createFeed_ShouldCreateFeedAndNotifyFollowers() {
        // Given
        Feed feed = new Feed();
        feed.setContent("Test Content");
        List<MultipartFile> imageFiles = new ArrayList<>();

        // Mocking
        when(feedRepository.save(any(Feed.class))).thenAnswer(invocation -> {
            Feed argument = invocation.getArgument(0);
            argument.setFeedId(1L);
            return argument;
        });
        when(imageService.createImage(any(MultipartFile.class))).thenReturn("http://example.com/image.jpg");
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> {
            Image argument = invocation.getArgument(0);
            argument.setImageId(1L);
            return argument;
        });

        // When
        Feed createdFeed = feedService.createFeed(1L, feed, imageFiles);

        // Then
        assertEquals("Test Content", createdFeed.getContent());
        verify(notificationService, times(1)).send(any(User.class), any(Notification.NotificationType.class),
                anyString(), anyString());
    }


    @Test
    @DisplayName("피드 조회 - 피드가 존재하면 반환해야 함")
    void findFeed_ShouldReturnFeedIfExists() {
        // Given
        long feedId = 1L;
        Feed feed = new Feed();
        feed.setFeedId(feedId);

        // Mocking
        when(feedRepository.findById(feedId)).thenReturn(Optional.of(feed));

        // When
        Feed resultFeed = feedService.findFeed(feedId);

        // Then
        assertNotNull(resultFeed);
        assertEquals(feedId, resultFeed.getFeedId());

        verify(feedRepository, times(1)).findById(feedId);
    }

    @Test
    @DisplayName("피드 조회 - 피드가 존재하지 않으면 예외를 던져야 함")
    void findFeed_ShouldThrowExceptionIfFeedNotFound() {
        // Given
        long feedId = 1L;

        // Mocking
        when(feedRepository.findById(feedId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(BusinessLogicException.class, () -> {
            // Act
            feedService.findFeed(feedId);
        });

        // Verify
        verify(feedRepository, times(1)).findById(feedId);
    }

    @Test
    @DisplayName("유저의 피드 조회 - 유저의 피드 목록을 반환해야 함")
    void findUserFeeds_ShouldReturnUserFeeds() {
        // Given
        int page = 1;
        int size = 10;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("feedId").descending());
        List<Feed> userFeeds = new ArrayList<>();
        userFeeds.add(new Feed());
        userFeeds.add(new Feed());
        Page<Feed> pageResult = new PageImpl<>(userFeeds);

        // Mocking
        when(feedRepository.findUserFeeds(pageRequest)).thenReturn(pageResult);

        // When
        Page<Feed> resultPage = feedService.findUserFeeds(page, size);

        // Then
        assertNotNull(resultPage);
        assertEquals(userFeeds.size(), resultPage.getContent().size());

        // Verify
        verify(feedRepository, times(1)).findUserFeeds(pageRequest);
    }

    @Test
    @DisplayName("피드 삭제 - 피드와 이미지를 삭제해야 함")
    void deleteFeed_ShouldDeleteFeedAndImages() {
        // Given
        long userId = 1L;
        long feedId = 1L;
        Feed feed = new Feed();
        feed.setFeedId(feedId);
        feed.setContent("Test Content");

        Image image = new Image();
        image.setImageId(1L);
        image.setFeed(feed);
        image.setImageUrl("test-image-url");

        // Mocking
        when(userService.findVerifiedUser(userId)).thenReturn(user);
        when(feedRepository.findById(feedId)).thenReturn(Optional.of(feed));
        when(feedRepository.save(any(Feed.class))).thenReturn(feed);
        when(imageService.createImage(any())).thenReturn("test-image-url");
        when(imageRepository.save(any(Image.class))).thenReturn(image);

        // When
        feedService.createFeed(userId, feed, Collections.singletonList(mock(MultipartFile.class)));
        Feed resultFeed = feedService.findFeed(feedId);
        feedService.deleteFeed(userId, feedId);

        // Then
        assertNotNull(resultFeed);

        verify(feedRepository, times(2)).save(any(Feed.class));
        verify(imageService, times(1)).createImage(any());
        verify(imageService, times(1)).deleteImage(anyLong());
        verify(feedRepository, times(1)).delete(any(Feed.class));
    }
}
