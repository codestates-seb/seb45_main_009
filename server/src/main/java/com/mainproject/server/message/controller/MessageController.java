package com.mainproject.server.message.controller;

import com.mainproject.server.message.dto.MessageDto;
import com.mainproject.server.message.entity.Message;
import com.mainproject.server.message.mapper.MessageMapper;
import com.mainproject.server.message.service.MessageService;
import com.mainproject.server.message.sse.SseEmitters;
import com.mainproject.server.response.SingleResponseDto;
import com.mainproject.server.util.UriCreater;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


import javax.validation.constraints.Positive;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@Validated
public class MessageController {

    private final MessageService messageService;
    private final MessageMapper mapper;
    private final SseEmitters sseEmitters;
    private UriCreater UriCreator;

    @PostMapping
    public ResponseEntity postMessage(@RequestBody MessageDto.Post requestBody) {
        Message message = mapper.messagePostToMessage(requestBody);

        Message createdMessage = messageService.createMessage(message);
        URI location = UriCreator.createUri("/messages", createdMessage.getMessageId());
        return ResponseEntity.created(location).build();
    }

    @GetMapping("/{message-id}")
    public ResponseEntity getMessage(@PathVariable("message-id") Long messageId) {
        Message message = messageService.findMessage(messageId);

        return ResponseEntity.ok(
            new SingleResponseDto<>(mapper.messageToMessageResponse(message))
        );
    }

    @GetMapping
    public ResponseEntity getMessages(@RequestParam("userId") Long userId) {
        List<Message> messages = messageService.findMessages(userId);

        return ResponseEntity.ok(
            new SingleResponseDto<>(mapper.messagesToMessageResponses(messages))
        );
    }

    @PatchMapping("/{message-id}")
    public ResponseEntity patchMessage(@PathVariable("message-id") Long messageId,
                                       @RequestBody MessageDto.Patch requestBody) {
        messageService.changeMessageStatus(messageId, requestBody.isRead());

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{message-id}")
    public ResponseEntity deleteMessage(@PathVariable("message-id") Long messageId) {
        messageService.deleteMessage(messageId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/not-read/{user-id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> connect(@PathVariable("user-id") @Positive Long userId) {
        SseEmitter emitter = new SseEmitter(10 * 1000L);
        sseEmitters.add(userId, emitter);
        sseEmitters.count(userId);
        return ResponseEntity.ok(emitter);
    }
}
