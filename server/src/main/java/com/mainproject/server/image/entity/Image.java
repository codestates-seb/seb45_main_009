package com.mainproject.server.image.entity;

import com.mainproject.server.feed.enitiy.Feed;
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

    public static class Builder {
        private String imageUrl;
        private Feed feed;

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder feed(Feed feed) {
            this.feed = feed;
            return this;
        }

        public Image build() {
            Image image = new Image();
            image.setImageUrl(this.imageUrl);
            image.setFeed(this.feed);
            return image;
        }
    }
}
