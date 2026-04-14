package com.myiittwin.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserResponse {
    private String userId;
    private String name;
    private String semester;
    private String career;
    private String background;
    private List<String> vibe;
    private String goal;
    private String createdAt;
}
