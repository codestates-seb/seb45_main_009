package com.mainproject.server.follow.entity;

import com.mainproject.server.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@DynamicUpdate
@Entity
public class Follow{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private User follower; // 팔로우를 하는 놈

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn
    private User follow; // 팔로우를 받는 놈

    @Builder
    public Follow(User follower, User follow) {
        this.follower = follower;
        this.follow = follow;
    }


}