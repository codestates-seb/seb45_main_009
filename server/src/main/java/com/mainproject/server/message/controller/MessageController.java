package com.mainproject.server.message.controller;

import com.mainproject.server.auth.loginResolver.LoginUserId;
import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.message.dto.MessageDto;
import com.mainproject.server.message.entity.Message;
import com.mainproject.server.message.mapper.MessageMapper;
import com.mainproject.server.message.service.MessageService;
import com.mainproject.server.message.sse.SseEmitters;
import com.mainproject.server.response.SingleResponseDto;
import com.mainproject.server.user.entity.User;
import com.mainproject.server.user.service.UserService;
import com.mainproject.server.util.UriCreater;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


import javax.validation.constraints.Positive;
import java.net.URI;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@Validated
public class MessageController {

    private final MessageService messageService;
    private final MessageMapper mapper;
    private final SseEmitters sseEmitters;
    private final UserService userService;
    private UriCreater UriCreator;

    @PostMapping
    public ResponseEntity postMessage(@RequestBody MessageDto.Post requestBody, @LoginUserId Long loginId) {
        // ID를 기반으로 사용자를 탐색
        User findUser = userService.findUser(loginId);
        // 로그인 한 사람과 보내는 사람이 일치하는지 확인
        if (findUser.getUserId().equals(requestBody.getSenderId())) {
            Message message = mapper.messagePostToMessage(requestBody);
            Message createdMessage = messageService.createMessage(message);
            URI location = UriCreator.createUri("/messages", createdMessage.getMessageId());
            return ResponseEntity.created(location).build();
        } else {
            log.info(String.valueOf(findUser.getUserId()));
            log.info(String.valueOf(requestBody.getSenderId()));
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }

    @GetMapping("/{message-id}")
    public ResponseEntity getMessage(@PathVariable("message-id") Long messageId, @LoginUserId Long loginId) {
        // ID를 기반으로 사용자를 탐색
        User findUser = userService.findUser(loginId);
        // 사용자가 유효한지 확인
        if (findUser.getUserId().equals(messageService.findMessage(messageId).getReceiver().getUserId())) {
            Message message = messageService.findMessage(messageId);
            return ResponseEntity.ok(
                    new SingleResponseDto<>(mapper.messageToMessageResponse(message)));
        } else {
            log.info(String.valueOf(findUser.getUserId()));
            log.info(String.valueOf(messageService.findMessage(messageId).getReceiver().getUserId()));
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }

    @GetMapping
    public ResponseEntity getMessages(@RequestParam("userId") Long userId, @LoginUserId Long loginId) {
        // ID를 기반으로 사용자를 탐색
        User findUser = userService.findUser(loginId);
        // 사용자가 유효한지 확인
        if (findUser.getUserId().equals(userId)) {
            List<Message> messages = messageService.findMessages(userId);

            return ResponseEntity.ok(
                    new SingleResponseDto<>(mapper.messagesToMessageResponses(messages)));
        } else {
            log.info(String.valueOf(findUser.getUserId()));
            log.info(String.valueOf(userId));
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }

    @PatchMapping("/{message-id}")
    public ResponseEntity patchMessage(@PathVariable("message-id") Long messageId,
                                       @RequestBody MessageDto.Patch requestBody) {
        messageService.changeMessageStatus(messageId, requestBody.isRead());

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{message-id}")
    public ResponseEntity deleteMessage(@PathVariable("message-id") Long messageId, @LoginUserId Long loginId) {
        // ID를 기반으로 사용자를 탐색
        User findUser = userService.findUser(loginId);
        // 사용자가 유효한지 확인
        if (findUser.getUserId().equals(messageService.findMessage(messageId).getReceiver().getUserId())) {
        messageService.deleteMessage(messageId);

        return ResponseEntity.noContent().build();
        } else {
            log.info(String.valueOf(findUser.getUserId()));
            log.info(String.valueOf(messageService.findMessage(messageId).getReceiver().getUserId()));
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }


    @GetMapping(value = "/not-read/{user-id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> connect(@PathVariable("user-id") @Positive Long userId, @LoginUserId Long loginId) {
        // ID를 기반으로 사용자를 탐색
        User findUser = userService.findUser(loginId);
        // 사용자가 유효한지 확인
        if (findUser.getUserId().equals(userId)) {
            SseEmitter emitter = new SseEmitter(10 * 1000L);
            sseEmitters.add(userId, emitter);
            sseEmitters.count(userId);
            return ResponseEntity.ok(emitter);
        } else {
            log.info(String.valueOf(findUser.getUserId()));
            log.info(String.valueOf(userId));
            throw new BusinessLogicException(ExceptionCode.ACCESS_DENIED);
        }
    }
}
