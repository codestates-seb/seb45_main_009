package com.mainproject.server.feed.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.dto.FeedPageInfo;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.feed.dto.FeedRolesPageDto;
import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.feed.mapper.FeedMapper;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
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
    private final FeedMapper feedMapper;


    @Autowired
    public FeedService(FeedRepository feedRepository, ImageService imageService, UserService userService,
                       ImageRepository imageRepository,
                       FollowRepository followRepository, FollowService followService,
                       NotificationService notificationService, FeedMapper feedMapper) {
        this.feedRepository = feedRepository;
        this.imageService = imageService;
        this.userService = userService;
        this.imageRepository = imageRepository;
        this.followRepository = followRepository;
        this.followService = followService;
        this.notificationService = notificationService;
        this.feedMapper = feedMapper;
    }


    // 피드 등록
    public Feed createFeed(long userId, Feed feed, List<MultipartFile> imageFiles) {
        // 현재 사용자 가져오기
        User findCreateUser = userService.findVerifiedUser(userId);
        // 피드의 작성자를 현재 사용자로 설정
        feed.setUser(findCreateUser);
        feed.setLocation(findCreateUser.getLocation());

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
        List<UserDto.ResponseDto> followers = followService.getFollowersList(userId);
        for (UserDto.ResponseDto follower : followers) {
            // 팔로워와 현재 사용자 사이의 팔로우 관계 조회
            Follow followRelationship = followRepository.findByFollowerAndFollow(
                    userService.findUser(follower.getUserId()), // 팔로워
                    userService.findUser(userId) // 현재 사용자(팔로우)
            );

            // 팔로우 관계가 존재하면 알림을 전송
            if (followRelationship != null) {
                String content = userService.findUser(userId).getNickname() + "님이 새로운 피드를 등록했습니다.";
                notificationService.send(userService.findUser(follower.getUserId()),
                        Notification.NotificationType.NEW_FEED, content, "/feed/add" + feed.getFeedId());
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

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("feedId").descending());
        Page<Feed> feedUserPage = feedRepository.findUserFeeds(pageRequest);

        return feedUserPage;
    }

    // 기업 페이지 피드 조회
    public Page<Feed> findStoreFeeds(int page, int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("feedId").descending());
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

    // 유저 필터 추가
    public FeedRolesPageDto filterUserFeeds(List<String> relatedTags, int page, int size) {
        // 정렬 방식을 설정하는 객체 생성
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        // 페이지와 페이지당 아이템 수를 설정하여 페이지 요청 객체 생성
        PageRequest pageable = PageRequest.of(page - 1, size, sort);
        // 사용자 피드를 담을 페이지 객체
        Page<Feed> userFeeds;

        // 관련 태그가 없을 경우 모든 사용자 피드를 가져옴
        if (relatedTags == null || relatedTags.isEmpty()) {
            userFeeds = feedRepository.findUserFeeds(pageable);
        } else {
            // 관련 태그가 있는 경우 해당 태그를 가지고 있는 사용자 피드를 가져옴
            userFeeds = feedRepository.findByRelatedTagsInForUser(relatedTags, pageable);
        }

        // 피드 객체를 피드 응답 DTO로 변환
        Page<FeedResponseDto> userFeedResponse = userFeeds.map(feed -> feedMapper.feedToFeedResponseDto(feed));
        // 페이지 정보를 생성
        FeedPageInfo pageInfo = new FeedPageInfo(page, size, (int) userFeeds.getTotalElements(),
                userFeeds.getTotalPages());

        // 피드 응답 DTO와 페이지 정보를 포함한 결과 객체 생성
        return new FeedRolesPageDto(userFeedResponse.getContent(), pageInfo);
    }

    // 스토어 필터 추가
    public FeedRolesPageDto filterStoreFeeds(List<String> relatedTags, String location, int page, int size) {
        // 정렬 방식을 설정하는 객체 생성
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        // 페이지와 페이지당 아이템 수를 설정하여 페이지 요청 객체 생성
        PageRequest pageable = PageRequest.of(page - 1, size, sort);
        // 스토어 피드를 담을 페이지 객체
        Page<Feed> storeFeeds;
        // 관련 태그와 위치 정보가 없을 경우 모든 스토어 피드를 가져옴
        if ((relatedTags == null || relatedTags.isEmpty()) && (location == null || location.isEmpty())) {
            storeFeeds = feedRepository.findStoreFeeds(pageable);
        } else {
            if (relatedTags == null || relatedTags.isEmpty()) {
                // 관련 태그가 없고 위치 정보만 있는 경우 해당 위치를 가지고 있는 스토어 피드를 가져옴
                storeFeeds = feedRepository.findByLocationInForStore(Collections.singletonList(location), pageable);
            } else if (location == null || location.isEmpty()) {
                // 위치 정보가 없고 관련 태그만 있는 경우 해당 태그를 가지고 있는 스토어 피드를 가져옴
                storeFeeds = feedRepository.findByRelatedTagsInForStore(relatedTags, pageable);
            } else {
                // 관련 태그와 위치 정보가 모두 있는 경우 해당 태그와 위치를 가지고 있는 스토어 피드를 가져옴
                storeFeeds = feedRepository.findByRelatedTagsInAndLocationInForStore(relatedTags,
                        Collections.singletonList(location), pageable);
            }
        }
        // 피드 객체를 피드 응답 DTO로 변환
        Page<FeedResponseDto> storeFeedResponse = storeFeeds.map(feed -> feedMapper.feedToFeedResponseDto(feed));
        // 페이지 정보를 생성
        FeedPageInfo pageInfo = new FeedPageInfo(page, size, (int) storeFeeds.getTotalElements(),
                storeFeeds.getTotalPages());
        // 피드 응답 DTO와 페이지 정보를 포함한 결과 객체 생성
        return new FeedRolesPageDto(storeFeedResponse.getContent(), pageInfo);
    }
}
