package com.mainproject.server.util;

import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

public class UriCreater {
    public static URI createUri(String defaultUrl, long resourceId) {
        return UriComponentsBuilder
                .newInstance()
                .path(defaultUrl + "/{resource-id}")
                .buildAndExpand(resourceId)
                .toUri();
    }
}
