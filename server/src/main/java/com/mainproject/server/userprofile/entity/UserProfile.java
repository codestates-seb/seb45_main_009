package com.mainproject.server.userprofile.entity;

import com.mainproject.server.user.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@DynamicUpdate
@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "userProfile", fetch = FetchType.EAGER)
    private User user;

//    @Column(nullable = false)
//    private Long feedCount;

    @Column(nullable = false)
    private Long followerCount; // who follow me?

    @Column(nullable = false)
    private Long followCount; // me follow who?

    public UserProfile(//Long feedCount,
                       Long followerCount, Long followCount) {
       // this.feedCount = feedCount;
        this.followerCount = followerCount;
        this.followCount = followCount;
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

        public UserProfile build() {
            return new UserProfile(//feedCount,
                    followerCount, followCount);
        }

        public String toString() {
            return "UserInfo.UserInfoBuilder(feedCount=" + this.feedCount + ", followerCount=" + this.followerCount + ", followCount=" + this.followCount + ")";
        }
    }


//    public void feedCountPlus(){
//        this.feedCount += 1L ;
//    }

    public void followerCountPlus(){
        this.followerCount += 1L;
    }

    public void followCountPlus(){
        this.followCount += 1L;
    }

//    public void feedCountMinus(){
//        this.feedCount -= 1L;
//    }

    public void followerCountMinus(){
        this.followerCount -= 1L;
    }

    public void followCountMinus(){
        this.followCount -= 1L;
    }
}