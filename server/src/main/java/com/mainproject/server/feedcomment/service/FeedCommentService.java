package com.mainproject.server.feedcomment.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.feed.service.FeedService;
import com.mainproject.server.feedcomment.entity.FeedComment;
import com.mainproject.server.feedcomment.repository.FeedCommentRepository;
import com.mainproject.server.notification.entity.Notification;
import com.mainproject.server.notification.service.NotificationService;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class FeedCommentService {

    private final FeedCommentRepository feedCommentRepository;
    private final FeedService feedService;
    private final UserService userService;
    private final NotificationService notificationService;

    public FeedCommentService(FeedCommentRepository feedCommentRepository, FeedService feedService,
                              UserService userService, NotificationService notificationService) {
        this.feedCommentRepository = feedCommentRepository;
        this.feedService = feedService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @Transactional
    // 피드 댓글 등록
    public FeedComment createFeedComment(long userId, FeedComment feedComment, long feedId) {
        // 피드 ID를 이용해서 피드 찾기
        Feed feed = feedService.findFeed(feedId);

        // 로그인한 사용자 확인
        User loggedInUser = userService.findVerifiedUser(userId);

        // FeedComment에 사용자와 피드 설정
        feedComment.setUser(loggedInUser);

        // 답변 엔티티에 질문과 회원정보 설정
        feedComment.setFeed(feed);

        // 댓글을 작성한 사용자와 피드 작성자가 다른 경우에만 알림 보내기
        if (feed.getUser().getUserId() != loggedInUser.getUserId()) {
            String content = loggedInUser.getNickname() + "님이 피드에 댓글을 등록했습니다.";
            notificationService.send(feed.getUser(), Notification.NotificationType.NEW_COMMENT, content, "/{feed-id}/comment" + feed.getFeedId());
        }

        // 설정된 FeedComment 엔티티를 저장하고 반환
        return feedCommentRepository.save(feedComment);
    }


    // 피드 댓글 수정
    public FeedComment updateFeedComment(long userId, FeedComment feedComment, String content, long feedId) {
        // 로그인한 사용자 확인
        User loggedInUser = userService.findVerifiedUser(userId);

        // 수정하려는 코멘트 가져오기
        FeedComment updatedFeedComment = findFeedCommentById(feedComment.getFeedCommentId());

        // 코멘트 작성자와 로그인한 사용자가 같은지 확인(권한 검증)
        verifyAccess(updatedFeedComment, loggedInUser.getUserId());

        // 피드 ID를 이용해서 피드 찾기
        Feed feed = feedService.findFeed(feedId);

        // 코멘트의 소속 피드 ID와 요청된 feedId가 일치하지 않을 경우 에러 발생
        if (updatedFeedComment.getFeed().getFeedId().equals(feed.getFeedId())) {
            updatedFeedComment.setContent(content);
            updatedFeedComment.setModifiedAt(LocalDateTime.now());}
        else {
            throw new BusinessLogicException(ExceptionCode.COMMENT_NOT_FOUND);
        }

        return feedCommentRepository.save(updatedFeedComment);
    }

    // 피드 댓글 조회
    public Page<FeedComment> findFeedComments(int page, int size, long feedId) {
        // 피드 댓글 조회(페이지네이션 구현)

        Feed feed = feedService.findFeed(feedId);

        // page, size를 기반으로 PageRequest 객체를 오름차순으로 생성해서 페이지네이션 적용
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("feedCommentId").descending());

        // pageRequest를 이용해 등록된 답변 조회
        Page<FeedComment> feedCommentPage = feedCommentRepository.findByFeed(feed, pageRequest);

        return feedCommentPage;
    }


    // 피드 댓글 삭제
    public void deleteFeedComment(long userId, long feedCommentId) {

        // 로그인한 사용자 확인
        User loggedInUser = userService.findVerifiedUser(userId);

        // 삭제하려는 코멘트 가져오기
        FeedComment deletedFeedComment = findFeedCommentById(feedCommentId);

        // 코멘트 작성자와 로그인한 사용자가 같은지 확인(권한 검증)
        verifyAccess(deletedFeedComment, loggedInUser.getUserId());

        feedCommentRepository.deleteById(feedCommentId);
    }


    // 피드 ID로 조회
    public FeedComment findFeedCommentById(Long feedCommentId) {
        Optional<FeedComment> optionalAnswer = feedCommentRepository.findById(feedCommentId);
        FeedComment findFeedComment = optionalAnswer.orElseThrow(() -> new BusinessLogicException(ExceptionCode.COMMENT_NOT_FOUND));
        return findFeedComment;
    }


    // 현재 접속한 유저가 해당 feedComment를 작성한 유저인지, 혹은 admin인지 분류하여 예외 발생
    private void verifyAccess(FeedComment feedComment, long userId) {
        User findUser = userService.findUser(userId);
        if (!findUser.getUserId().equals(feedComment.getUser().getUserId()) && !findUser.getRoles().contains("ADMIN")) {
            throw new BusinessLogicException(ExceptionCode.NO_PERMISSION_EDITING_COMMENT);
        }
    }
}
