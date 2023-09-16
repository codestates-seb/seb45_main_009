package com.mainproject.server.feed.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.feedcomment.entity.FeedComment;
import com.mainproject.server.follow.entity.Follow;
import com.mainproject.server.follow.repository.FollowRepository;
import com.mainproject.server.follow.service.FollowService;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.repository.ImageRepository;
import com.mainproject.server.image.service.ImageService;
import com.mainproject.server.image.service.S3UploadService;
import com.mainproject.server.notification.entity.Notification;
import com.mainproject.server.notification.service.NotificationService;
import com.mainproject.server.user.dto.UserDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeedService {

    private final FeedRepository feedRepository;
    private final ImageService imageService;
    private final UserService userService;
    private final ImageRepository imageRepository;
    private final FollowRepository followRepository;
    private final FollowService followService;
    private final NotificationService notificationService;

    public FeedService(FeedRepository feedRepository, ImageService imageService, UserService userService, ImageRepository imageRepository,
                       FollowRepository followRepository, FollowService followService, NotificationService notificationService) {
        this.feedRepository = feedRepository;
        this.imageService = imageService;
        this.userService = userService;
        this.imageRepository = imageRepository;
        this.followRepository = followRepository;
        this.followService = followService;
        this.notificationService = notificationService;
    }


    // 피드 등록
    public Feed createFeed(long userId, Feed feed, List<MultipartFile> imageFiles) {
        // 현재 사용자 가져오기
        User findCreateUser = userService.findVerifiedUser(userId);
        // 피드의 작성자를 현재 사용자로 설정
        feed.setUser(findCreateUser);
        // 피드를 데이터베이스에 저장
        Feed savedFeed = feedRepository.save(feed);

        // 이미지 업로드와 URL 가져오기
        for (MultipartFile imageFile : imageFiles) {
            String imageUrl = imageService.createImage(imageFile);

            // 이미지와 피드 연결 후 image를 객체 저장
            Image image = new Image.Builder()
                    .imageUrl(imageUrl) // 이미지 URL 설정
                    .feed(savedFeed)    // 이미지와 연결할 피드 설정 (자바 엔티티 = 데이터베이스 id)
                    .build();

            // 이미지를 데이터베이스에 저장
            Image savedImage = imageRepository.save(image);

            // 이미지 객체를 피드에 추가
            savedFeed.getImages().add(savedImage);

            // 이미지 ID를 이미지 객체에서 다시 설정
            image.setImageId(savedImage.getImageId());
        }

        findCreateUser.hasWroteFeed(); // 피드 카운트 증가

        // 팔로워에게 알림 전송
        List<UserDto.ResponseDto> followers = followService.getFollowers(userId);
        for (UserDto.ResponseDto follower : followers) {
            // 팔로워와 현재 사용자 사이의 팔로우 관계 조회
            Follow followRelationship = followRepository.findByFollowerAndFollow(
                    userService.findUser(follower.getUserId()), // 팔로워
                    userService.findUser(userId) // 현재 사용자(팔로우)
            );

            // 팔로우 관계가 존재하면 알림을 전송
            if (followRelationship != null) {
                String content = userService.findUser(userId).getNickname() + "님이 새로운 피드를 등록했습니다.";
                notificationService.send(userService.findUser(follower.getUserId()), Notification.NotificationType.NEW_FEED, content, "/feed/add" + feed.getFeedId());
            }
        }

        return feedRepository.save(savedFeed);
    }


    // 피드 수정(단일 이미지만 수정 - 이미지 태그도 새로 생성)
    public Feed updateFeedImage(long userId, Feed feed, MultipartFile imageFile, Long imageIdToUpdate) {
        // 현재 사용자 가져오기
        User currentUser = userService.findVerifiedUser(userId);
        // 업데이트할 피드 가져오기
        Feed updateFeed = findFeed(feed.getFeedId());
        // 권한 검증
        verifyAccess(updateFeed, currentUser.getUserId());

        // 컨텐츠 업데이트
        Optional.ofNullable(feed.getContent())
                .ifPresent(content -> updateFeed.setContent(content));

        // 이미지 업데이트
        List<String> updatedImageUrls = new ArrayList<>();

        for (Image image : updateFeed.getImages()) {
            Long imageId = image.getImageId();
            if (imageId.equals(imageIdToUpdate) && imageFile != null) {
                String imageUrl = imageService.updateImage(imageId, imageFile);
                updatedImageUrls.add(imageUrl);

                // 이미지 객체를 업데이트
                Image updatedImage = imageRepository.save(image);

                // 이미지 객체를 다시 추가하는 대신, 기존 이미지를 업데이트한 이미지로 대체합니다.
                int imageIndex = updateFeed.getImages().indexOf(image);
                updateFeed.getImages().set(imageIndex, updatedImage);

            } else {
                updatedImageUrls.add(image.getImageUrl());
            }
        }

        // 관련 태그 및 수정 시간 업데이트
        updateFeed.setRelatedTags(feed.getRelatedTags());
        updateFeed.setModifiedAt(LocalDateTime.now());
        // 업데이트된 피드 저장
        return feedRepository.save(updateFeed);
    }

    // 피드 수정(피드에 이미지 추가)
    public Feed updateFeedImages(long userId, Feed feed, List<MultipartFile> imageFiles) {
        // 현재 사용자 가져오기
        User currentUser = userService.findVerifiedUser(userId);

        // 업데이트할 피드 가져오기
        Feed updatedFeed = findFeed(feed.getFeedId());

        // 권한 검증
        verifyAccess(updatedFeed, currentUser.getUserId());

        if (updatedFeed == null) {
            // 피드가 존재하지 않는 경우 예외 처리
            throw new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND);
        }

        // 피드 내용(컨텐츠) 업데이트
        Optional.ofNullable(feed.getContent())
                .ifPresent(content -> updatedFeed.setContent(content));

        // 이미지 파일이 비어 있지 않은 경우에만 이미지 업로드 및 업데이트 로직 실행
        if (imageFiles != null && !imageFiles.isEmpty()) {
            // 여러 개의 이미지 업로드 및 이미지 객체 생성
            List<Image> newImages = new ArrayList<>();
            for (MultipartFile imageFile : imageFiles) {
                if (imageFile != null && !imageFile.isEmpty()) {
                    // 이미지 파일 업로드
                    String imageUrl = imageService.createImage(imageFile);

                    // 새로운 이미지 객체 생성 및 피드에 연결
                    Image newImage = new Image.Builder()
                            .imageUrl(imageUrl)
                            .feed(updatedFeed)
                            .build();

                    // 새 이미지를 리스트에 추가
                    newImages.add(newImage);
                }
            }

            // 이미지 목록에 새 이미지 추가
            updatedFeed.getImages().addAll(newImages);
        }

        // 관련 태그 및 수정 시간 업데이트
        updatedFeed.setRelatedTags(feed.getRelatedTags());
        updatedFeed.setModifiedAt(LocalDateTime.now());

        // 피드 저장
        return feedRepository.save(updatedFeed);
    }

    // 피드 상세 조회
    public Feed findFeed(long feedId) {
        return feedRepository.findById(feedId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND));
//                findFeedId(feedId);
    }


    // 유저 페이지 피드 조회
    public Page<Feed> findUserFeeds(int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("feedId").ascending());
        Page<Feed> feedUserPage = feedRepository.findUserFeeds(pageRequest);

        return feedUserPage;
    }

    // 기업 페이지 피드 조회
    public Page<Feed> findStoreFeeds(int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("feedId").ascending());
        Page<Feed> feedStorePage = feedRepository.findStoreFeeds(pageRequest);
        return feedStorePage;
    }

    // 피드 삭제
    public void deleteFeed(Long userId, long feedId) {
        // 현재 사용자 가져오기
        User currentUser = userService.findVerifiedUser(userId);
        // 업데이트할 피드 가져오기
        Feed deletedFeed = findFeedId(feedId);
        // 권한 검증
        verifyAccess(deletedFeed, currentUser.getUserId());

        List<Image> images = new ArrayList<>(deletedFeed.getImages());
        for (Image image : images) {
            imageService.deleteImage(image.getImageId());
        }
        currentUser.hasDeletedFeed(); // 피드 카운트 감소

        feedRepository.delete(deletedFeed);
    }

    // 피드에서 이미지 삭제
    public void deleteFeedImage(Long userId, long feedId, long imageIdToDelete) {
        // 현재 사용자 가져오기
        User currentUser = userService.findVerifiedUser(userId);
        // 업데이트할 피드 가져오기
        Feed deletedFeed = findFeedId(feedId);
        // 권한 검증
        verifyAccess(deletedFeed, currentUser.getUserId());

        // 이미지 삭제 로직
        List<Image> deleteImages = deletedFeed.getImages()
                .stream()
                .filter(image -> !image.getImageId().equals(imageIdToDelete))
                .collect(Collectors.toList());

        deletedFeed.setImages(deleteImages);
        feedRepository.save(deletedFeed);

        // 이미지 서비스를 사용하여 이미지를 실제로 삭제
        imageService.deleteImage(imageIdToDelete);
    }

    // 피드ID 조회
    public Feed findFeedId(Long feedId) {
        Optional<Feed> optionalFeed = feedRepository.findById(feedId);
        Feed feed = optionalFeed.orElseThrow(() -> new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND));
        return feed;
    }

    // 현재 접속한 유저가 해당 feed를 작성한 유저인지, 혹은 admin인지 분류하여 예외 발생
    private void verifyAccess(Feed feed, long userId) {
        User findUser = userService.findUser(userId);
        if (!findUser.getUserId().equals(feed.getUser().getUserId()) && !findUser.getRoles().contains("ADMIN")) {
            throw new BusinessLogicException(ExceptionCode.NO_PERMISSION_EDITING_POST);
        }
    }
}