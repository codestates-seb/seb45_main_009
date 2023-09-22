package com.mainproject.server.message.entity;
import com.mainproject.server.user.entity.User;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private boolean isRead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SENDER_ID")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RECEIVER_ID")
    private User receiver;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    public boolean getIsRead() {
        return isRead;
    }

    public void checkMessage() {
        this.isRead = true;
    }
}
