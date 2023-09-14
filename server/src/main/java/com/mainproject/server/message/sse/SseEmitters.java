package com.mainproject.server.message.sse;

import com.mainproject.server.message.dto.MessageDto;
import com.mainproject.server.message.repository.MessageRepository;
import com.mainproject.server.response.SingleResponseDto;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SseEmitters {
    private final Map<Long, SseEmitter> emitterMap = new ConcurrentHashMap<>();
    private final MessageRepository messageRepository;

    public SseEmitters(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public SseEmitter add(Long userId, SseEmitter emitter) {
        this.emitterMap.put(userId, emitter);
        emitter.onCompletion(() -> {
            this.emitterMap.remove(userId);
        });
        emitter.onTimeout(() -> {
            emitter.complete();
        });
        return emitter;
    }

    public void count(Long receiverId) {
        Long notReadCount = messageRepository.countByReceiverUserIdAndIsReadFalse(receiverId);
        try {
            if (emitterMap.containsKey(receiverId)) {
                emitterMap.get(receiverId)
                        .send(SseEmitter.event()
                            .name("notReadCount")
                            .data(new SingleResponseDto<>(new MessageDto.NotReadResponse(notReadCount))));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
