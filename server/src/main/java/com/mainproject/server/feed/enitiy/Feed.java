package com.mainproject.server.feed.enitiy;


import com.mainproject.server.feedcomment.entity.FeedComment;
import com.mainproject.server.image.entity.Image;
import com.mainproject.server.user.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@Entity
public class Feed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedId;

    @Column(columnDefinition = "TEXT")
    private String content;

    // 중복 태그
    @Column
    @ElementCollection
    private List<String> relatedTags = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime modifiedAt = LocalDateTime.now();

    // feedComment와 매핑(일대다)
    @OneToMany(mappedBy = "feed", cascade = CascadeType.ALL)
    private List<FeedComment> feedComment = new ArrayList<>();

    // image와 매핑(일대다)
    @OneToMany(mappedBy = "feed", cascade = CascadeType.ALL)
    private List<Image> images = new ArrayList<>();

    //user와 매핑(다대일)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    //liked와 매핑(일대다)
    @OneToMany(mappedBy = "feed", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = false)
    private final List<Liked> likedList = new ArrayList<>();
    
}

