package com.mainproject.server.image.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.user.entity.User;
import lombok.*;

import javax.persistence.*;


@NoArgsConstructor
@Getter
@Setter
@Entity
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    @JoinColumn
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "feedId")
    private Feed feed;

    @OneToOne
    @JoinColumn(name = "userId") // User와의 관계를 설정
    @JsonBackReference // // User와의 관계를 설정
    private User user;

    public static class Builder {
        private String imageUrl;
        private Feed feed;
        private User user;

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder feed(Feed feed) {
            this.feed = feed;
            return this;
        }

        public Builder user(User user){
            this.user = user;
            return this;
        }

        public Image build() {
            Image image = new Image();
            image.setImageUrl(this.imageUrl);
            image.setFeed(this.feed);
            image.setUser(this.user);
            return image;
        }
    }
}
