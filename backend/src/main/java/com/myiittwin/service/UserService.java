package com.myiittwin.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myiittwin.dto.UserRequest;
import com.myiittwin.dto.UserResponse;
import com.myiittwin.model.User;
import com.myiittwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserResponse createUser(UserRequest req) {
        User user = new User();
        user.setName(req.getName());
        user.setSemester(req.getSemester());
        user.setCareer(req.getCareer());
        user.setBackground(req.getBackground());
        user.setGoal(req.getGoal());
        user.setVibe(toJson(req.getVibe()));
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse getUser(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return toResponse(user);
    }

    public User getUserEntity(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    private UserResponse toResponse(User user) {
        UserResponse res = new UserResponse();
        res.setUserId(user.getId());
        res.setName(user.getName());
        res.setSemester(user.getSemester());
        res.setCareer(user.getCareer());
        res.setBackground(user.getBackground());
        res.setGoal(user.getGoal());
        res.setVibe(fromJson(user.getVibe()));
        res.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return res;
    }

    private String toJson(List<String> list) {
        try {
            return list == null ? "[]" : objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> fromJson(String json) {
        try {
            return json == null ? List.of() : objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }
}
