package com.myiittwin.controller;

import com.myiittwin.dto.LogRequest;
import com.myiittwin.dto.LogResponse;
import com.myiittwin.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    @PostMapping("/{userId}")
    public ResponseEntity<LogResponse> submitLog(
            @PathVariable String userId,
            @RequestBody LogRequest request,
            @RequestHeader(value = "X-Gemini-Key", required = false) String userApiKey) {
        return ResponseEntity.ok(logService.submitLog(userId, request.getText(), userApiKey));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<LogResponse>> getLogs(@PathVariable String userId) {
        return ResponseEntity.ok(logService.getLogs(userId));
    }
}
