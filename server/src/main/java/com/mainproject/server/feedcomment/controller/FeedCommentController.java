package com.mainproject.server.feedcomment.controller;

import com.mainproject.server.auth.loginResolver.LoginUserId;
import com.mainproject.server.feed.service.FeedService;
import com.mainproject.server.feedcomment.dto.FeedCommentDto;
import com.mainproject.server.feedcomment.dto.FeedCommentPageDto;
import com.mainproject.server.feedcomment.dto.PageInfo;
import com.mainproject.server.feedcomment.dto.FeedCommentResponseDto;
import com.mainproject.server.feedcomment.entity.FeedComment;
import com.mainproject.server.feedcomment.mapper.FeedCommentMapper;
import com.mainproject.server.feedcomment.service.FeedCommentService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Positive;
import java.util.List;

@RestController
@RequestMapping("/feed/detail")
public class FeedCommentController {
    private final FeedCommentService feedCommentService;
    private final FeedCommentMapper feedCommentMapper;

    private final FeedService feedService;

    public FeedCommentController(FeedCommentService feedCommentService, FeedCommentMapper feedCommentMapper,
                                 FeedService feedService) {
        this.feedCommentService = feedCommentService;
        this.feedCommentMapper = feedCommentMapper;
        this.feedService = feedService;
    }

    @PostMapping("/{feed-id}/comment")
    public ResponseEntity postComment(@LoginUserId Long userId,
                                      @Positive @PathVariable("feed-id") long feedId,
                                      @RequestPart FeedCommentDto.PostDto feedCommentPostDto){

        // feedCommentPostDto를 FeedComment 엔티티로 변환
        FeedComment feedComment = feedCommentMapper.feedCommentPostDtoToFeedComment(feedCommentPostDto);

        // FeedCommentService를 사용하여 코멘트를 등록하고 등록된 코멘트를 반환
        FeedComment response = feedCommentService.createFeedComment(userId, feedComment, feedId);

        // 생성된 답변을 DTO로 변환하여 ResponseEntity로 감싸서 반환
        return new ResponseEntity<>(feedCommentMapper.feedCommentToFeedCommentResponseDto(response), HttpStatus.CREATED);
    }

//    @PatchMapping("/{feed-id}/comment/{feedcomment-id}")
    @PatchMapping("/comment/{feedcomment-id}")
    public ResponseEntity patchComment(@LoginUserId Long userId,
                                       @PathVariable("feedcomment-id") long feedCommentId,
//                                       @PathVariable("feed-id") long feedId,
                                       @RequestPart FeedCommentDto.PatchDto feedCommentPatchDto){

        // 검증: 해당 피드와 댓글이 존재하는지 확인
        FeedComment feedComment = feedCommentService.findFeedCommentById(feedCommentId);


        // 수정한 코멘트 내용을 response에 저장
        FeedComment response = feedCommentService.updateFeedComment(userId, feedComment, feedCommentPatchDto.getContent(), feedComment.getFeed().getFeedId());

        return new ResponseEntity<>(feedCommentMapper.feedCommentToFeedCommentResponseDto(response), HttpStatus.OK);
    }


    // 댓글 조회
    @GetMapping("/{feed-id}/comments")
    public ResponseEntity getComments(@PathVariable("feed-id") long feedId,
                                      @RequestParam(defaultValue = "1") int page,
                                      @RequestParam(defaultValue = "10") int size){
        // feedId를 통해 질문 번호를 조회
        // 페이지는 1부터 시작인데 데이터 액세스 계층에서 접근은 0부터라 page에서 -1
        Page<FeedComment> feedCommentPage = feedCommentService.findFeedComments(page - 1, size, feedId);
        PageInfo pageInfo = new PageInfo(page, size, (int) feedCommentPage.getTotalElements(), feedCommentPage.getTotalPages());

        List<FeedComment> feedCommentList = feedCommentPage.getContent();
        List<FeedCommentResponseDto> response = feedCommentMapper.feedCommentToFeedCommentResponseDtos(feedCommentList);

        return new ResponseEntity<>(new FeedCommentPageDto(response, pageInfo), HttpStatus.OK);

    }

//    @DeleteMapping("/{feed-id}/comment/{feedcomment-id}")
    @DeleteMapping("/comment/{feedcomment-id}")
    public ResponseEntity deleteComment(@LoginUserId Long userId,
                                        @PathVariable("feedcomment-id") long feedCommentId){

        // 코멘트 삭제 요청을 FeedCommentService에 전달
        feedCommentService.deleteFeedComment(userId, feedCommentId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
