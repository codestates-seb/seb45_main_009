package com.mainproject.server.notification.mapper;

import com.mainproject.server.notification.dto.NotificationResponseDto;
import com.mainproject.server.notification.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SseMapStruct {
    SseMapStruct SSE_MAPPER = Mappers.getMapper(SseMapStruct.class);
    NotificationResponseDto NotificationToNotificationResponseDto(Notification notification);
}
