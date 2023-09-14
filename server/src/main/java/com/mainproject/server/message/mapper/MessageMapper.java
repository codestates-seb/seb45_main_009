package com.mainproject.server.message.mapper;

import com.mainproject.server.message.dto.MessageDto;
import com.mainproject.server.message.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(source = "senderId", target = "sender.userId")
    @Mapping(source = "receiverId", target = "receiver.userId")
    Message messagePostToMessage(MessageDto.Post requestBody);

    @Mapping(source = "sender.userId", target = "sender.id")
    @Mapping(source = "sender.nickname", target = "sender.nickname")
    MessageDto.Response messageToMessageResponse(Message message);

    List<MessageDto.Response> messagesToMessageResponses(List<Message> messages);
}
