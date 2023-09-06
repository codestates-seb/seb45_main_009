package com.mainproject.server.feed.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.image.service.ImageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FeedService {

    private final FeedRepository feedRepository;

    private final ImageService imageService;

    public FeedService(FeedRepository feedRepository, ImageService imageService) {
        this.feedRepository = feedRepository;
        this.imageService = imageService;
    }

    //피드 등록
    public Feed createFeed(Feed feed, List<MultipartFile> imageFiles) {

        Feed savedFeed = feedRepository.save(feed);

        // 이미지 업로드와 URL 가져오기
        for (MultipartFile imageFile : imageFiles) {
            String imageUrl = imageService.createImage(imageFile);

            // 이미지와 피드 연결 후 image를 객체 저장
            Image image = new Image.Builder()
                    .imageUrl(imageUrl) // 이미지 URL 설정
                    .feed(savedFeed)    // 이미지와 연결할 피드 설정
                    .build();

            // 이미지 객체를 피드에 추가
            savedFeed.getImages().add(image);
        }

        return feedRepository.save(feed);
    }

    // 피드 수정
    public Feed updateFeed(Feed feed, List<MultipartFile> imageFiles) {
        // 회원인지 아닌지 검증
        // 피드 작성자인지 검증, LoginMemberIdResolver
        // 피드가 있는지 확인 후 수정
        Feed updatedFeed = findFeedId(feed.getFeedId());

        Optional.ofNullable(feed.getContent())
                .ifPresent(content -> updatedFeed.setContent(content));

        // 이미지를 수정하면서 새 이미지를 등록
        List<String> updatedImageUrls = new ArrayList<>();

        // 이미지 목록(updatedFeed.getImages())을 순회하면서
        for (int i = 0; i < updatedFeed.getImages().size(); i++) {
            if (i >= imageFiles.size()) {
                // 이미지 파일 목록의 크기가 이미지 목록보다 작을 경우, 이미지를 그대로 둠
                updatedImageUrls.add(updatedFeed.getImages().get(i).getImageUrl());
                continue;
            }

            Long imageId = updatedFeed.getImages().get(i).getImageId();
            String imageUrl = imageService.updateImage(imageId, imageFiles.get(i));
            updatedImageUrls.add(imageUrl);
        }


        // 수정할 때 새로운 이미지 추가할 경우
        for (int imageIndex = updatedFeed.getImages().size(); imageIndex < imageFiles.size(); imageIndex++) {
            String imageUrl = imageService.createImage(imageFiles.get(imageIndex));

            // 이미지와 피드 연결 후 image를 객체 저장
            Image newImage = new Image.Builder()
                    .imageUrl(imageUrl) // 이미지 URL 설정
                    .feed(updatedFeed)  // 이미지와 연결할 피드 설정
                    .build();

            // 이미지 객체를 피드에 추가
            updatedFeed.getImages().add(newImage);
            updatedImageUrls.add(newImage.getImageUrl());
        }

        // 이미지 URL 업데이트
        for (int imageIndex = 0; imageIndex < updatedFeed.getImages().size(); imageIndex++) {
            updatedFeed.getImages().get(imageIndex).setImageUrl(updatedImageUrls.get(imageIndex));
        }

        updatedFeed.setRelatedTags(feed.getRelatedTags());
        updatedFeed.setModifiedAt(LocalDateTime.now()); // 수정 시간 변경

        return feedRepository.save(updatedFeed);
    }

    // 피드 상세 조회
    public Feed findFeed(long feedId) {
        return findFeedId(feedId);
    }


    // 피드 리스트 조회
    public List<Feed> findFeeds(boolean isUser) {
        if (isUser) {  // 개인
            List<Feed> findUserFeeds = feedRepository.findByUsertype(true);
            return findUserFeeds;
        } else {  // 기업
            List<Feed> findStoreFeeds = feedRepository.findByUsertype(false);
            return findStoreFeeds;
        }
    }

    // 피드 삭제
    public void deleteFeed(long feedId) {
        Feed deletedFeed = findFeedId(feedId);

        List<Image> images = new ArrayList<>(deletedFeed.getImages());
        for (Image image : images) {
            imageService.deleteImage(image.getImageId());
        }

        feedRepository.delete(deletedFeed);
    }

    // 피드ID 조회
    public Feed findFeedId(Long feedId) {
        Optional<Feed> optionalFeed = feedRepository.findById(feedId);
        Feed feed = optionalFeed.orElseThrow(() -> new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND));
        return feed;
    }

}


