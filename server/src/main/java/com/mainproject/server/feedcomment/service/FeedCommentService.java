package com.mainproject.server.feedcomment.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.feed.service.FeedService;
import com.mainproject.server.feedcomment.entity.FeedComment;
import com.mainproject.server.feedcomment.repository.FeedCommentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class FeedCommentService {

    private final FeedCommentRepository feedCommentRepository;

    private final FeedService feedService;

    public FeedCommentService(FeedCommentRepository feedCommentRepository, FeedService feedService) {
        this.feedCommentRepository = feedCommentRepository;
        this.feedService = feedService;
    }

    // 피드 댓글 등록
    public FeedComment createFeedComment(FeedComment feedComment) {
        // 회원 검증 필요

        return feedCommentRepository.save(feedComment);
    }


    // 피드 댓글 수정
    public FeedComment updateFeedComment(FeedComment feedComment, String content) {

        FeedComment updatedFeedComment = findFeedCommentById(feedComment.getFeedCommentId());

        // 회원 검증 필요

        updatedFeedComment.setContent(content);
        updatedFeedComment.setModifiedAt(LocalDateTime.now());

        return feedCommentRepository.save(updatedFeedComment);
    }

    // 피드 댓글 조회
    public Page<FeedComment> findFeedComments(int page, int size, int feedId) {
        // 피드 댓글 조회(페이지네이션 구현)

        Feed feed = feedService.findFeed(feedId);

        // page, size를 기반으로 PageRequest 객체를 내림차순으로 생성해서 페이지네이션 적용
        // PageRequest 페이지 번호와 페이지 크기를 나타내는 정보 값을 가짐 + 오름차순 정렬
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("answerId").descending());

        // pageRequest를 이용해 등록된 답변 조회
        Page<FeedComment> FeedCommentPage = feedCommentRepository.findByFeed(feed, pageRequest);

        return FeedCommentPage;
    }

    // 피드 댓글 삭제
    public void deleteFeedComment(Long feedCommentId) {
        // 회원 검증 필요

        feedCommentRepository.deleteById(feedCommentId);
    }


    // 피드 ID로 조회
    public FeedComment findFeedCommentById(Long feedCommentId) {
        Optional<FeedComment> optionalAnswer = feedCommentRepository.findById(feedCommentId);
        FeedComment findFeedComment = optionalAnswer.orElseThrow(() -> new BusinessLogicException(ExceptionCode.FEED_NOT_FOUND));
        return findFeedComment;
    }

    // 수정 권한 검증
    public void verifyAccess(String feedCommentId, String userId) {
        if (!feedCommentId.equals(userId)) {
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }
}
