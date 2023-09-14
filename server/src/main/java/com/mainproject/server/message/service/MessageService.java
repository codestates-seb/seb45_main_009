package com.mainproject.server.message.service;

import com.mainproject.server.exception.BusinessLogicException;
import com.mainproject.server.exception.ExceptionCode;
import com.mainproject.server.message.entity.Message;
import com.mainproject.server.message.repository.MessageRepository;
import com.mainproject.server.message.sse.SseEmitters;
import com.mainproject.server.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;
    private final SseEmitters sseEmitters;

    @Transactional
    public Message createMessage(Message message) {
        userService.findUser(message.getSender().getUserId());
        userService.findUser(message.getReceiver().getUserId());
        Message savedMessage = messageRepository.save(message);
        sseEmitters.count(message.getReceiver().getUserId());
        return savedMessage;
    }

    @Transactional
    public Message findMessage(Long messageId) {
        Message findMessage = findVerifiedMessage(messageId);
        findMessage.checkMessage();
        sseEmitters.count(findMessage.getReceiver().getUserId());
        return findMessage;
    }

    public List<Message> findMessages(Long userId) {
//        return messageRepository.findByReceiverUserId(userId, Sort.by(Sort.Direction.DESC, "messageId"));
        return messageRepository.findByReceiverUserId(userId);
    }

    @Transactional
    public void changeMessageStatus(Long messageId, boolean read) {
        Message message = findVerifiedMessage(messageId);
        message.setRead(read);
        sseEmitters.count(message.getReceiver().getUserId());
    }

    @Transactional
    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }

    private Message findVerifiedMessage(Long messageId) {
        Optional<Message> optionalMessage = messageRepository.findById(messageId);
        Message findMessage = optionalMessage.orElseThrow(
            () -> new BusinessLogicException(ExceptionCode.MESSAGE_NOT_FOUND)
        );
        return findMessage;
    }
}
