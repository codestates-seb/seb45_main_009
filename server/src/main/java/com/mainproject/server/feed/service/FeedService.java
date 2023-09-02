package com.mainproject.server.feed.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.feed.repository.FeedRepository;
import com.mainproject.server.photo.S3UploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedService {

    @Value("${cloud.aws.s3.bucket}") // application.yml에 설정된 값을 주입받음
    private String bucket; // S3 버킷 이름을 저장할 필드

    private final FeedRepository feedRepository;
    private final S3UploadService s3UploadService;
    private final AmazonS3 amazonS3;

    public FeedService(FeedRepository feedRepository, S3UploadService s3UploadService, AmazonS3 amazonS3) {
        this.feedRepository = feedRepository;
        this.s3UploadService = s3UploadService;
        this.amazonS3 = amazonS3;
    }


    // 피드 등록
    public Feed createFeed(Feed feed, MultipartFile photoFile) {

        // 회원인지 아닌지 검증

        // 업로드한 이미지url 가져오기
        String photoUrl = s3UploadService.upload(photoFile);
        feed.setPhoto_url(photoUrl); // 업로드한 이미지 url로 설정

        return feedRepository.save(feed);

    }


    // 피드 수정(이미지 수정을 하면 기존의 이미지는 버킷에서 삭제)
    public Feed updateFeed(Feed feed, MultipartFile photoFile) {

        // 회원인지 아닌지 검증

        // 피드 작성자인지 검증, LoginMemberIdResolver

        // 피드가 있는지 확인 후 수정
        Feed updatedFeed = findFeedId(feed.getFeedId());

        Optional.ofNullable(feed.getContent())
                .ifPresent(content -> updatedFeed.setContent(content));

        // 기존 이미지를 삭제
        String oldPhotoUrl = updatedFeed.getPhoto_url();
        if (oldPhotoUrl != null) {
            // S3 객체 URL 키(key) 추출
            URI uri = URI.create(oldPhotoUrl);
            String key = uri.getPath().substring(1); // 경로에서 첫 번째 슬래시(/) 제거

            // 기존 이미지를 S3에서 삭제
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
        }

        // 업로드한 이미지url 가져오기
        String photoUrl = s3UploadService.upload(photoFile);
        updatedFeed.setPhoto_url(photoUrl); // 수정한 이미지url 설정

        updatedFeed.setTags(feed.getTags());

        // 수정 시간 변경
        updatedFeed.setModifiedAt(LocalDateTime.now());

        return feedRepository.save(updatedFeed);
    }

    // 피드 상세 조회
    public Feed findFeed(long feedId) {
       return findFeedId(feedId);
    }


    // 피드 리스트 조회
    public List<Feed> findFeeds(Feed feed) {
        if(feed.isUsertype()) {  // 개인
           List<Feed> findUserFeeds = feedRepository.findByUsertype(true);
           return findUserFeeds;
        }
        else{  // 기업
            List<Feed> findStoreFeeds = feedRepository.findByUsertype(false);
            return findStoreFeeds;
        }
    }

    // 피드 삭제(피드가 삭제되면 버킷에서도 피드 이미지 함께 삭제)
    public void deleteFeed(long feedId) {

        // 회원인지 아닌지 검증

        // 피드 작성자인지 검증, LoginMemberIdResolver

        // 피드가 있는지 확인
        Feed deletedFeed = findFeedId(feedId);

        // 업로드 한 이미지url 가져오기
        String photoUrl = deletedFeed.getPhoto_url();

        // S3 객체 URL 키(key) 추출
        URI uri = URI.create(photoUrl);
        String key = uri.getPath().substring(1); // 경로에서 첫 번째 슬래시(/) 제거

        // s3 버킷 이미지 삭제
        amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));

        // 피드 삭제
        feedRepository.delete(deletedFeed);
    }


    // 피드ID 조회
    public Feed findFeedId(Long feedId) {
        Optional<Feed> optionalFeed = feedRepository.findById(feedId);
        Feed feed = optionalFeed.orElseThrow(() -> new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND));
        return feed;
    }

//    // 이미지 url 받아오기
//    public String uploadAndReturnImageUrl(MultipartFile photoFile) {
//        String photoUrl = s3UploadService.upload(photoFile);
//        return photoUrl;
//    }

    // 수정 권한 검증(회원을 구분하는걸 email로 할지 Id로 할지)
//    public void verifyAccess(String questionEmail, String email, Long userId) {
//        if (!questionEmail.equals(memberEmail)) {
//            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
//        }

    }




//// 이미지를 여러장 등록하는 경우
//@Service
//public class FeedService {
//
//    @Value("${cloud.aws.s3.bucket}")
//    private String bucket;
//
//    private final FeedRepository feedRepository;
//    private final S3UploadService s3UploadService;
//    private final AmazonS3 amazonS3;
//
//    public FeedService(FeedRepository feedRepository, S3UploadService s3UploadService, AmazonS3 amazonS3) {
//        this.feedRepository = feedRepository;
//        this.s3UploadService = s3UploadService;
//        this.amazonS3 = amazonS3;
//    }
//
//    // 피드 등록 (여러 이미지 처리)
//    public Feed createFeed(Feed feed, List<MultipartFile> photoFiles) {
//        List<String> photoUrls = new ArrayList<>();
//
//        photoFiles.forEach(photoFile -> {
//            String photoUrl = s3UploadService.upload(photoFile);
//            photoUrls.add(photoUrl);
//        });
//
//        feed.setPhoto_urls(photoUrls); // 여러 이미지 URL을 리스트로 저장
//
//        return feedRepository.save(feed);
//    }
//
//    // 피드 수정 (여러 이미지 처리)
//    public Feed updateFeed(Feed feed, List<MultipartFile> photoFiles) {
//        Feed updatedFeed = findFeedId(feed.getFeedId());
//
//        Optional.ofNullable(feed.getContent())
//                .ifPresent(content -> updatedFeed.setContent(content));
//
//        List<String> oldPhotoUrls = updatedFeed.getPhoto_urls();
//
//        // 이전 이미지들을 S3에서 삭제
//        if (oldPhotoUrls != null && !oldPhotoUrls.isEmpty()) {
//            oldPhotoUrls.forEach(oldPhotoUrl -> {
//                URI uri = URI.create(oldPhotoUrl);
//                String key = uri.getPath().substring(1);
//                amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
//            });
//        }
//
//        List<String> newPhotoUrls = new ArrayList<>();
//        photoFiles.forEach(photoFile -> {
//            String photoUrl = s3UploadService.upload(photoFile);
//            newPhotoUrls.add(photoUrl);
//        });
//
//        updatedFeed.setPhoto_urls(newPhotoUrls); // 새로운 이미지 URL로 업데이트
//        updatedFeed.setTags(feed.getTags());
//        updatedFeed.setModifiedAt(LocalDateTime.now());
//
//        return feedRepository.save(updatedFeed);
//    }
//
//    // 피드 상세 조회
//    public Feed findFeed(long feedId) {
//        return findFeedId(feedId);
//    }
//
//
//    // 피드 리스트 조회
//    public List<Feed> findFeeds(Feed feed) {
//        if(feed.isUsertype()) {  // 개인
//            List<Feed> findUserFeeds = feedRepository.findByUsertype(true);
//            return findUserFeeds;
//        }
//        else{  // 기업
//            List<Feed> findStoreFeeds = feedRepository.findByUsertype(false);
//            return findStoreFeeds;
//        }
//    }
//
//    // 피드 삭제
//    public void deleteFeed(long feedId) {
//        Feed deletedFeed = findFeedId(feedId);
//        List<String> photoUrls = deletedFeed.getPhoto_urls();
//
//        // 이미지 URL에 해당하는 S3 객체 삭제
//        if (photoUrls != null && !photoUrls.isEmpty()) {
//            photoUrls.forEach(photoUrl -> {
//                URI uri = URI.create(photoUrl);
//                String key = uri.getPath().substring(1);
//                amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
//            });
//        }
//
//        feedRepository.delete(deletedFeed);
//    }
//
//    // 피드ID 조회
//    public Feed findFeedId(Long feedId) {
//        Optional<Feed> optionalFeed = feedRepository.findById(feedId);
//        Feed feed = optionalFeed.orElseThrow(() -> new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND));
//        return feed;
//    }
//
//}
//
//
