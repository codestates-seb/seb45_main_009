package com.mainproject.server.liked.entity;

import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@DynamicUpdate
@Entity
public class Liked {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "feed_id")
    private Feed feed;

    @Column(name = "liked_date")
    private LocalDateTime likedDate;

    @Builder
    public Liked(User user, Feed feed) {
        this.user = user;
        this.feed = feed;
    }
    public void disconnectFeed() {
        this.feed = null;
    }

}
