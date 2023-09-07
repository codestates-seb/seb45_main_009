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
import java.util.stream.Collectors;

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

    // 피드 수정(이미지 단건 수정)
    public Feed updateFeedImage(Feed feed, MultipartFile imageFile, Long imageIdToUpdate) {
        Feed updatedFeed = feedRepository.findByFeedId(feed.getFeedId());

        Optional.ofNullable(feed.getContent())
                .ifPresent(content -> updatedFeed.setContent(content));

        List<String> updatedImageUrls = new ArrayList<>();

        for (Image image : updatedFeed.getImages()) {
            Long imageId = image.getImageId();
            if (imageId.equals(imageIdToUpdate) && imageFile != null) {
                String imageUrl = imageService.updateImage(imageId, imageFile);
                updatedImageUrls.add(imageUrl);
            } else {
                updatedImageUrls.add(image.getImageUrl());
            }
        }

        for (int imageIndex = 0; imageIndex < updatedFeed.getImages().size(); imageIndex++) {
            updatedFeed.getImages().get(imageIndex).setImageUrl(updatedImageUrls.get(imageIndex));
        }

        updatedFeed.setRelatedTags(feed.getRelatedTags());
        updatedFeed.setModifiedAt(LocalDateTime.now());

        return feedRepository.save(updatedFeed);
    }

    // 피드 수정(피드에 이미지 추가)
    public Feed updateFeedImages(Feed feed, List<MultipartFile> imageFiles) {
        Feed updatedFeed = feedRepository.findByFeedId(feed.getFeedId());

        Optional.ofNullable(feed.getContent())
                .ifPresent(content -> updatedFeed.setContent(content));

        List<String> updatedImageUrls = new ArrayList<>();

        for (Image image : updatedFeed.getImages()) {
            updatedImageUrls.add(image.getImageUrl());
        }

        for (MultipartFile imageFile : imageFiles) {
            String imageUrl = imageService.createImage(imageFile);

            Image newImage = new Image.Builder()
                    .imageUrl(imageUrl)
                    .feed(updatedFeed)
                    .build();

            updatedFeed.getImages().add(newImage);
            updatedImageUrls.add(newImage.getImageUrl());
        }

        for (int imageIndex = 0; imageIndex < updatedFeed.getImages().size(); imageIndex++) {
            updatedFeed.getImages().get(imageIndex).setImageUrl(updatedImageUrls.get(imageIndex));
        }

        updatedFeed.setRelatedTags(feed.getRelatedTags());
        updatedFeed.setModifiedAt(LocalDateTime.now());

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

    // 피드에서 이미지 삭제
    public void deleteFeedImage(long feedId, long imageIdToDelete) {
        Feed feed = feedRepository.findByFeedId(feedId);

        // 이미지 삭제 로직
        List<Image> deleteImages = feed.getImages()
                .stream()
                .filter(image -> !image.getImageId().equals(imageIdToDelete))
                .collect(Collectors.toList());

        feed.setImages(deleteImages);
        feedRepository.save(feed);

        // 이미지 서비스를 사용하여 이미지를 실제로 삭제
        imageService.deleteImage(imageIdToDelete);
    }

    // 피드ID 조회
    public Feed findFeedId(Long feedId) {
        Optional<Feed> optionalFeed = feedRepository.findById(feedId);
        Feed feed = optionalFeed.orElseThrow(() -> new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND));
        return feed;
    }
}