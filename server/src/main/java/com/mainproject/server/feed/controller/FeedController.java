package com.mainproject.server.feed.controller;

import com.mainproject.server.feed.dto.FeedDto;
import com.mainproject.server.feed.dto.FeedResponseDto;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.feed.mapper.FeedMapper;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.feed.service.FeedService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/")
public class FeedController {
    private final FeedService feedService;
    private final FeedMapper feedMapper;

    public FeedController(FeedService feedService, FeedMapper feedMapper) {
        this.feedService = feedService;
        this.feedMapper = feedMapper;
    }

    // 피드 등록
    @PostMapping(value = "/feed/add/{user-id}")
    public ResponseEntity<FeedResponseDto> postFeed(@PathVariable("user-id") long userId,
                                   @RequestPart("imageUrl") List<MultipartFile> imageFiles,
                                   @RequestPart FeedDto.PostDto feedPostDto) {

        // 회원 검증 필요

        Feed feed = feedService.createFeed(feedMapper.feedPostDtoToFeed(feedPostDto), imageFiles);
        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(feed), HttpStatus.CREATED);
    }

    // 피드 수정
    @PatchMapping("/feed/detail/{feed-id}")
    public ResponseEntity patchFeed(@PathVariable("feed-id") long feedId,
                                    @RequestPart("imageUrl") List<MultipartFile> imageFiles,
                                    @RequestPart FeedDto.PatchDto feedPatchDto) {

        // 회원 검증 필요

        // 수정할 피드 찾기
        feedPatchDto.setFeedId(feedId);

        Feed feed = feedService.updateFeed(feedMapper.feedPatchDtoToFeed(feedPatchDto), imageFiles);
        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(feed), HttpStatus.OK);

    }

    // 유저 페이지 피드 조회(리스트) - 메인페이지
    @GetMapping("/")
    public ResponseEntity findUserFeed() {

//        List<Feed> userFeeds = feedRepository.findByUsertype(true);
        List<Feed> userFeeds = feedService.findFeeds(true);
        List<FeedResponseDto> userFeedResponse = feedMapper.feedToFeedResponseDtos(userFeeds);
        return new ResponseEntity<>(userFeedResponse, HttpStatus.OK);
    }

    // 기업 페이지 피드 조회(리스트)
    @GetMapping("/store")
    public ResponseEntity findStoreFeed() {

//        List<Feed> storeFeeds = feedRepository.findByUsertype(false);
        List<Feed> storeFeeds = feedService.findFeeds(false);
        List<FeedResponseDto> storeFeedResponse = feedMapper.feedToFeedResponseDtos(storeFeeds);
        return new ResponseEntity<>(storeFeedResponse, HttpStatus.OK);
    }

    // 피드 상세 조회(단건)
    @GetMapping("/feed/detail/{feed-id}")
    public ResponseEntity findDetailFeed(@PathVariable("feed-id") long feedId) {

        // 피드가 있는지 조회
        Feed feed = feedService.findFeed(feedId);
        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(feed), HttpStatus.OK);
    }

    @DeleteMapping("/feed/detail/{feed-id}")
    public ResponseEntity deleteFeed(@PathVariable("feed-id") long feedId) {

        // 회원 검증 필요

        feedService.deleteFeed(feedId);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}


//
//@RestController
//@RequestMapping("/")
//public class FeedController {
//    private final FeedService feedService;
//    private final FeedRepository feedRepository;
//    private final FeedMapper feedMapper;
//
//    public FeedController(FeedService feedService, FeedRepository feedRepository, FeedMapper feedMapper) {
//        this.feedService = feedService;
//        this.feedRepository = feedRepository;
//        this.feedMapper = feedMapper;
//    }
//
//    // 피드 등록
//    @PostMapping(value = "/feed/add/{user-id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
//    public ResponseEntity postFeed(@PathVariable("user-id") long userId,
////                                   @RequestPart("photo-url") MultipartFile photoFile,
//                                   @RequestPart("image-url") List<MultipartFile> imageFiles,
//                                   @Valid @RequestPart FeedDto.PostDto feedPostDto) {
//
//        // 회원 검증 필요
//
//        Feed feed = feedService.createFeed(feedMapper.feedPostDtoToFeed(feedPostDto), imageFiles);
//
//        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(feed), HttpStatus.CREATED);
//
//    }
//
//    // 피드 수정
//    @PatchMapping("/feed/detail/{feed-id}")
//    public ResponseEntity patchFeed(@PathVariable("feed-id") long feedId,
////                                    @RequestPart("photo-url") MultipartFile photoFile,
//                                    @RequestPart("image-url") List<MultipartFile> imageFiles,
//                                    @Valid @RequestPart FeedDto.PatchDto feedPatchDto) {
//
//        // 회원 검증 필요
//
//        // 수정할 피드 찾기
//        feedPatchDto.setFeedId(feedId);
//
//        Feed feed = feedService.updateFeed(feedMapper.feedPatchDtoToFeed(feedPatchDto), imageFiles);
//        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(feed), HttpStatus.OK);
//
//    }
//
//    // 유저 페이지 피드 조회(리스트) - 메인페이지
//    @GetMapping("/")
//    public ResponseEntity findUserFeed() {
//
////        List<Feed> userFeeds = feedRepository.findByUsertype(true);
//        List<Feed> userFeeds = feedService.findFeeds(true);
//        List<FeedResponseDto> userFeedResponse = feedMapper.feedToFeedResponseDtos(userFeeds);
//
//
//        return new ResponseEntity<>(userFeedResponse, HttpStatus.OK);
//    }
//
//    // 기업 페이지 피드 조회(리스트)
//    @GetMapping("/store")
//    public ResponseEntity findStoreFeed() {
//
////        List<Feed> storeFeeds = feedRepository.findByUsertype(false);
//        List<Feed> storeFeeds = feedService.findFeeds(false);
//        List<FeedResponseDto> storeFeedResponse = feedMapper.feedToFeedResponseDtos(storeFeeds);
//
//        return new ResponseEntity<>(storeFeedResponse, HttpStatus.OK);
//    }
//
//    // 피드 상세 조회(단건)
//    @GetMapping("/feed/detail/{feed-id}")
//    public ResponseEntity findDetailFeed(@PathVariable("feed-id") long feedId) {
//
//        // 피드가 있는지 조회
//        Feed feed = feedService.findFeed(feedId);
//
//        return new ResponseEntity<>(feedMapper.feedToFeedResponseDto(feed), HttpStatus.OK);
//    }
//
//    @DeleteMapping("/feed/detail/{feed-id}")
//    public ResponseEntity deleteFeed(@PathVariable("feed-id") long feedId) {
//
//        // 회원 검증 필요
//
//        feedService.deleteFeed(feedId);
//
//        return new ResponseEntity(HttpStatus.NO_CONTENT);
//    }
//
//}

