package com.mainproject.server.userprofile.entity;

import com.mainproject.server.user.entity.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@DynamicUpdate
@Entity
@Setter
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id") // User 테이블의 외래키
    private User user;

    @Column(nullable = false)
    private Long feedCount;

    @Column(nullable = false)
    private Long followerCount; // 나를 팔로우

    @Column(nullable = false)
    private Long followCount; // 내가 팔로우


    public UserProfile(Long id, User user) {
        this.id = id;
        this.user = user;
    }

    public static UserProfileBuilder builder() {
        return new UserProfileBuilder();
    }

    public static class UserProfileBuilder {
        private Long feedCount = 0L;
        private Long followerCount = 0L;
        private Long followCount = 0L;

        UserProfileBuilder() {
        }

        public UserProfileBuilder feedCount(Long feedCount) {
            this.feedCount = feedCount;
            return this;
        }

        public UserProfileBuilder followerCount(Long followerCount) {
            this.followerCount = followerCount;
            return this;
        }

        public UserProfileBuilder followCount(Long followCount) {
            this.followCount = followCount;
            return this;
        }


        public String toString() {
            return "UserProfile.UserProfileBuilder(feedCount=" + this.feedCount + ", followerCount=" + this.followerCount + ", followCount=" + this.followCount + ")";
        }
    }


    public void feedCountPlus(){ this.feedCount += 1L; }

    public void followerCountPlus(){
        this.followerCount += 1L;
    }

    public void followCountPlus(){
        this.followCount += 1L;
    }

    public void feedCountMinus(){ this.feedCount -= 1L; }

    public void followerCountMinus(){
        this.followerCount -= 1L;
    }

    public void followCountMinus(){
        this.followCount -= 1L;
    }
}