package com.mainproject.server.feedcomment.entity;

import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.user.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class FeedComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedCommentId;

    @Column
    private String content;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime modifiedAt = LocalDateTime.now();

    //feed와 매핑(다대일)
    @ManyToOne
    private Feed feed;

    //user와 매핑(다대일)
    @ManyToOne
    @JoinColumn
    private User user;

}
