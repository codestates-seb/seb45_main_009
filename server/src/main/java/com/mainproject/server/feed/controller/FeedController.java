package com.mainproject.server.feed.controller;

import com.mainproject.server.auth.loginResolver.LoginUserId;
import com.mainproject.server.feed.dto.FeedDto;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.feed.dto.FeedRolesPageDto;
import com.mainproject.server.feed.dto.FeedPageInfo;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.feed.mapper.FeedMapper;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.feed.service.FeedService;
import com.mainproject.server.liked.service.LikedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/")
public class FeedController {
    private final FeedService feedService;
    private final FeedMapper feedMapper;
    private final LikedService likedService;



    public FeedController(FeedService feedService, FeedMapper feedMapper, LikedService likedService) {
        this.feedService = feedService;
        this.feedMapper = feedMapper;
        this.likedService = likedService;

    }

    // 피드 등록
    @PostMapping("/feed/add")
    public ResponseEntity<FeedResponseDto> postFeed(@LoginUserId Long userId,
                                                    @RequestPart("imageUrl") List<MultipartFile> imageFiles,
                                                    @RequestPart FeedDto.PostDto feedPostDto) {

        Feed feed = feedService.createFeed(userId, feedMapper.feedPostDtoToFeed(feedPostDto), imageFiles);
        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(feed), HttpStatus.CREATED);
    }

    // 피드 수정(단일 이미지 수정)
    @PatchMapping("/feed/detail/{feed-id}/image/{image-id}")
    public ResponseEntity patchFeedImage(@LoginUserId Long userId,
                                         @PathVariable("feed-id") long feedId,
                                         @PathVariable("image-id") long imageId,
                                         @RequestPart("imageUrl") MultipartFile imageFile,
                                         @RequestPart FeedDto.PatchDto feedPatchDto) {

        // 수정할 피드 찾기
        feedPatchDto.setFeedId(feedId);

        // 이미지 수정할 때 특정 이미지만 업데이트
        Feed updatedFeed = feedService.updateFeedImage(userId, feedMapper.feedPatchDtoToFeed(feedPatchDto), imageFile, imageId);
        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(updatedFeed), HttpStatus.OK);

    }

    // 이미지 추가
    @PatchMapping("/feed/detail/{feed-id}/images")
    public ResponseEntity patchFeedImages(@LoginUserId Long userId,
                                          @PathVariable("feed-id") long feedId,
                                          @RequestPart(value = "imageUrl", required = false) List<MultipartFile> imageFiles,
                                          @RequestPart FeedDto.PatchDto feedPatchDto) {
        // 수정할 피드 찾기
        feedPatchDto.setFeedId(feedId);

        Feed updatedFeed = feedService.updateFeedImages(userId, feedMapper.feedPatchDtoToFeed(feedPatchDto), imageFiles);

        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(updatedFeed), HttpStatus.OK);
    }

    // 유저 페이지 피드 조회(리스트) - 메인페이지
    @GetMapping("/")
    public ResponseEntity findUserFeeds(@RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "8") int size) {

        Page<Feed> userFeeds = feedService.findUserFeeds(page - 1, size);
        FeedPageInfo userPageInfo = new FeedPageInfo(page, size, (int) userFeeds.getTotalElements(), userFeeds.getTotalPages());
        List<Feed> userFeedList = userFeeds.getContent();
//        List<FeedResponseDto> userFeedResponse = feedMapper.feedToFeedResponseDtos(userFeedList);

        return new ResponseEntity<>(new FeedRolesPageDto(feedMapper.feedToFeedResponseDtos(userFeedList), userPageInfo), HttpStatus.OK);
    }

    // 기업 페이지 피드 조회(리스트)
    @GetMapping("/store")
    public ResponseEntity findStoreFeed(@RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "8") int size) {

        Page<Feed> storeFeeds = feedService.findStoreFeeds(page - 1, size);
        FeedPageInfo storePageInfo = new FeedPageInfo(page, size, (int) storeFeeds.getTotalElements(), storeFeeds.getTotalPages());
        List<Feed> storeFeedList = storeFeeds.getContent();

        return new ResponseEntity<>(new FeedRolesPageDto(feedMapper.feedToFeedResponseDtos(storeFeedList), storePageInfo), HttpStatus.OK);
    }

    // 피드 상세 조회(단건)
    @GetMapping("/feed/detail/{feed-id}")
    public ResponseEntity findDetailFeed(@PathVariable("feed-id") long feedId) {

        // 피드가 있는지 조회
        Feed feed = feedService.findFeed(feedId);

        // 피드에 좋아요를 누른 사용자 목록의 카운트 조회
        long likeCount = likedService.countLikedUsers(feedId);

        // 피드와 좋아요 누른 사용자 목록의 카운트를 함께 반환
        FeedResponseDto responseDto = feedMapper.feedToFeedResponseDto(feed);
        responseDto.setLikedCount(likeCount);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    // 피드 삭제(이미지도 함께 삭제됨)
    @DeleteMapping("/feed/detail/{feed-id}")
    public ResponseEntity deleteFeed(@LoginUserId Long userId,
                                     @PathVariable("feed-id") @LoginUserId long feedId) {


        feedService.deleteFeed(userId, feedId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    // 피드에서 이미지만 삭제
    @DeleteMapping("/feed/detail/{feed-id}/image/{image-id}")
    public ResponseEntity deleteFeedImage(@LoginUserId Long userId,
                                          @PathVariable("feed-id") @LoginUserId long feedId,
                                          @PathVariable("image-id") long imageId) {

        feedService.deleteFeedImage(userId, feedId, imageId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

//    @GetMapping("/filter")
//    public Page<Feed> filterFeeds(@RequestParam(required = false) List<String> relatedTags,
//                                  @RequestParam(required = false) List<String> location, Pageable pageable) {
//        List<Feed> userFeeds = feedRepository.findUserFeeds();
//
//        // 필터링을 위한 조건을 검사합니다.
//        if (relatedTags.isEmpty() && location.isEmpty()) {
//            // 관련 태그와 위치가 모두 제공되지 않은 경우 처리합니다.
//            // 모든 피드를 반환하거나 요구 사항에 따라 처리할 수 있습니다.
//            return new PageImpl<>(userFeeds, pageable, userFeeds.size());
//        } else if (relatedTags.isEmpty()) {
//            // 관련 태그만 제공된 경우 처리합니다.
//            List<Feed> filteredFeeds = userFeeds.stream()
//                    .filter(feed -> location.contains(feed.getLocation()))
//                    .collect(Collectors.toList());
//            return new PageImpl<>(filteredFeeds, pageable, filteredFeeds.size());
//        } else if (location.isEmpty()) {
//            // 위치만 제공된 경우 처리합니다.
//            List<Feed> filteredFeeds = userFeeds.stream()
//                    .filter(feed -> feed.getRelatedTags().stream().anyMatch(relatedTags::contains))
//                    .collect(Collectors.toList());
//            return new PageImpl<>(filteredFeeds, pageable, filteredFeeds.size());
//        } else {
//            // 관련 태그와 위치가 모두 제공된 경우 처리합니다.
//            List<Feed> filteredFeeds = userFeeds.stream()
//                    .filter(feed -> location.contains(feed.getLocation())
//                            && feed.getRelatedTags().stream().anyMatch(relatedTags::contains))
//                    .collect(Collectors.toList());
//            return new PageImpl<>(filteredFeeds, pageable, filteredFeeds.size());
//        }
//
//
//    }
}
