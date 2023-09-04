package com.mainproject.server.user.role;


public enum UserAuthority {
    ROLE_ADMIN("ROLE_ADMIN"),
    ROLE_USER("ROLE_USER"),
    ROLE_STORE("ROLE_STORE");

    private final String authority;

    UserAuthority(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }

}
