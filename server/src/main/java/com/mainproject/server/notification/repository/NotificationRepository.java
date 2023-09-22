package com.mainproject.server.notification.repository;

import com.mainproject.server.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
//    List<Notification> findAllByReceiverId(Long receiverId);
}
