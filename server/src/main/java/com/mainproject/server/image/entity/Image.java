package com.mainproject.server.image.entity;

import com.mainproject.server.feed.enitiy.Feed;
import com.mainproject.server.imagetag.entity.ImageTag;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


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

    //feed와 매핑(다대일)
    @ManyToOne
    @JoinColumn(name = "feedId")
    private Feed feed;

    // imageTag와 매핑(일대다)
    @OneToMany(mappedBy = "image", cascade = CascadeType.ALL)
    private List<ImageTag> imageTags = new ArrayList<>();

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
