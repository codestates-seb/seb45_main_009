package com.mainproject.server.notification.service;

import com.mainproject.server.notification.entity.Notification;
import com.mainproject.server.notification.repository.EmitterRepository;
import com.mainproject.server.notification.repository.NotificationRepository;
import com.mainproject.server.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;

import static com.mainproject.server.notification.mapper.SseMapStruct.SSE_MAPPER;

/**
 * 서버에서 클라이언트로 보낼 이벤트 내용에 관련한 내용을 작성
 * 생성한 이벤트를 SseEmitter객체를 통해 클라이언트로 전송
 */

@Service
public class NotificationService {
//    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;

    private final EmitterRepository emitterRepository;
    private final NotificationRepository notificationRepository;

    public NotificationService(EmitterRepository emitterRepository, NotificationRepository notificationRepository) {
        this.emitterRepository = emitterRepository;
        this.notificationRepository = notificationRepository;
    }

    public SseEmitter subscribe(Long userId, String lastEventId) {
        String emtterId = userId + "_" + System.currentTimeMillis();
        SseEmitter emitter = emitterRepository.save(emtterId, new SseEmitter(DEFAULT_TIMEOUT));

        emitter.onCompletion(() -> emitterRepository.deleteById(emtterId));
        emitter.onTimeout(() -> emitterRepository.deleteById(emtterId));

        // 503 에러를 방지하기 위한 더미 이벤트 전송
        sendToClient(emitter, emtterId, "EventStream Created. [userId=" + userId + "]");

        // 클라이언트가 미수신한 Event 목록이 존재할 경우 전송하여 Event 유실을 예방
        if (!lastEventId.isEmpty()) {
            Map<String, Object> events = emitterRepository.findAllEventCacheStartWithByUserId(String.valueOf(userId));
            events.entrySet().stream()
                    .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                    .forEach(entry -> sendToClient(emitter, entry.getKey(), entry.getValue()));
        }

        return emitter;
    }

    private void sendToClient(SseEmitter emitter, String emitterId, Object data) {
        try {
            emitter.send(SseEmitter.event()
                    .id(emitterId)
                    .data(data)
            );
        } catch (IOException exception) {
            emitterRepository.deleteById(emitterId);
        }
    }

    //@Override
    // 알림을 보낼 내용을 지정
    public void send(User receiver, Notification.NotificationType notificationType, String content, String url) {
        Notification notification = notificationRepository.save(createNotification(receiver, notificationType, content, url));
        String memberId = String.valueOf(receiver.getUserId());

        Map<String, SseEmitter> sseEmitters = emitterRepository.findAllEmitterStartWithByUserId(memberId);
        sseEmitters.forEach(
                (key, emitter) -> {
                    emitterRepository.saveEventCache(key, notification);
                    sendToClient(emitter, key, SSE_MAPPER.NotificationToNotificationResponseDto(notification));
                }
        );
    }

    private Notification createNotification(User receiver, Notification.NotificationType notificationType, String content, String url) {
        return Notification.builder()
                .receiver(receiver)
                .notificationType(notificationType)
                .content(content)
                .url(url)
                .isRead(false)
                .build();
    }

    public boolean markNotificationAsRead(Long notificationId) {
        // 알림 업데이트 로직을 여기에 구현합니다.
        // notificationId에 해당하는 알림을 찾아서 isRead 값을 true로 설정하면 됩니다.

        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            // 알림을 찾았으면 isRead 값을 true로 설정
            notification.setIsRead(true);
            notificationRepository.save(notification); // 업데이트된 알림 저장
            return true; // 업데이트 성공
        } else {
            return false; // 알림을 찾지 못한 경우
        }
    }
}

