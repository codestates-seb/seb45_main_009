package com.mainproject.server.feedcomment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feed/detail")
public class FeedCommentController {

    @PostMapping("/{feed-id}/comment/{feedcomment-Id}")
    public ResponseEntity postComment(){
        return null;
    }

    @PatchMapping("/{feed-id}/comment/{feedcomment-Id}")
    public ResponseEntity patchComment(){
        return null;
    }

    // 댓글 조회..?
    @GetMapping("/{feed-id}/comments")
    public ResponseEntity getComments(){
        return null;
    }

    @DeleteMapping("/{feed-id}/comment/{feedcomment-Id}")
    public ResponseEntity deleteComment(){
        return null;
    }

}
