package com.myiittwin.controller;

import com.myiittwin.dto.ChatRequest;
import com.myiittwin.dto.ChatResponse;
import com.myiittwin.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatResponse>> getHistory(@PathVariable String userId) {
        return ResponseEntity.ok(chatService.getHistory(userId));
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> sendMessage(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(request.getUserId(), request.getText()));
    }
}
