package com.mainproject.server.notification.controller;

import com.mainproject.server.auth.loginResolver.LoginUserId;
import com.mainproject.server.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.http.HttpServletResponse;

/**
 * 클라이언트가 요청을 보낼 수 있는 엔드포인트를 지정.
 * 클라이언트와 SSE연결을 설정하고 실시간 이벤트 업데이트 데이터를 응답.
 */

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // SSE 연결 클라이언트가 요청을 보낼 수 있는 엔트포인트 주소
    @GetMapping(value = "/subscribe", produces = "text/event-stream")
    public SseEmitter subscribe(@LoginUserId Long userId,
                                @RequestHeader(value = "Last-Event-ID", required = false, defaultValue = "") String lastEventId) {
        return notificationService.subscribe(userId, lastEventId);
    }

    // 알림을 읽은 상태로 업데이트하는 엔드포인트
    @PutMapping("/{notificationId}/mark-as-read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable @LoginUserId Long notificationId) {
        // 알림 업데이트 로직
        boolean updated = notificationService.markNotificationAsRead(notificationId);
        if (updated) {
            return ResponseEntity.ok().build(); // 업데이트 성공 시 200 OK 응답
        } else {
            return ResponseEntity.notFound().build(); // 알림을 찾지 못한 경우 404 Not Found 응답
        }
    }

}
