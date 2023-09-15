package com.mainproject.server.notification.dto;

import com.mainproject.server.global.LocalDateTimeConverter;
import com.mainproject.server.notification.entity.Notification;
import lombok.*;

@Getter
@NoArgsConstructor
public class NotificationResponseDto {
    private Long notificationId;
    private String content;
    private String url;
    private Boolean isRead;
    private String createdAt;

    @Builder
    public NotificationResponseDto(Notification notification) {
        this.notificationId = notification.getNotificationId();
        this.content = notification.getContent();
        this.url = notification.getUrl();
        this.isRead = notification.getIsRead();
        this.createdAt = LocalDateTimeConverter.timeToString(notification.getCreatedAt());
    }
}

