package com.mainproject.server.user.entity;



import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mainproject.server.feed.entity.Feed;
import com.mainproject.server.follow.entity.Follow;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.userprofile.entity.UserProfile;
import lombok.*;


import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@Entity
@Table
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false, name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();


    @Column(nullable = false, name = "MODIFIED_AT")
    private LocalDateTime modifiedAt = LocalDateTime.now();


    @Column
    private String sport;

    @Column
    private String location;
    //위치를 업체 위치 태그에서 가져올 것인지 상의가 필요

    @Column
    private Integer height;

    @Column
    private Integer weight;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JoinColumn(name = "imageId")
    @JsonManagedReference// 이미지와의 관계를 설정
    private Image profileimg;

    @Column
    private String bio;


    @Column
    private String price;


    @Column(nullable = false)
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles = new ArrayList<>();


    @OneToMany(mappedBy = "follow",fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private final List<Follow> followerList = new ArrayList<>(); // 나를 팔로우를 하는 유저들의 리스트

    @OneToMany(mappedBy = "follower",fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private final List<Follow> followList = new ArrayList<>(); // 내가 팔로우 하는 유저들의 리스트

    @OneToMany(mappedBy = "user" ,fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private final List<Feed> feedList = new ArrayList<>();


    public void hasFollowed(){
        this.userProfile.followerCountPlus();
    }
    public void hasUnFollowed(){
        this.userProfile.followerCountMinus();
    }

    public void hasFollowing(){
        this.userProfile.followCountPlus();
    }
    public void hasUnFollowing(){
        this.userProfile.followCountMinus();
    }

    public void hasWroteFeed(){
        this.userProfile.feedCountPlus();
    }
    public void hasDeletedFeed(){
        this.userProfile.feedCountMinus();
    }

    @JsonBackReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JoinColumn(name = "user_profile_id")
    private UserProfile userProfile;

    // 마이 페이지

}
