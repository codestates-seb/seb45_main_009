package com.mainproject.server.message.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class MessageDto {
    @Getter
    @AllArgsConstructor
    public static class Post {
        @NotEmpty
        private String content;
        @Positive
        private Long senderId;
        @Positive
        private Long receiverId;

    }

    @Getter
    @Setter
    public static class Patch {
        private boolean read;
    }


    @Getter
    @Setter
    public static class Response {
        private Long messageId;
        private String content;
        private Sender sender;
        private boolean isRead;
        private String createdAt;


        @AllArgsConstructor
        @Getter
        @Setter
        public static class Sender {
            private Long id;
            private String nickname;
        }

        public Response(Long messageId, String content, Sender sender, Boolean isRead, LocalDateTime createdAt) {
            this.messageId = messageId;
            this.content = content;
            this.createdAt = createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            this.sender = sender;
            this.isRead = isRead;
        }
    }

    @AllArgsConstructor
    @Getter
    public static class NotReadResponse {
        private Long notReadCount;
    }

}
