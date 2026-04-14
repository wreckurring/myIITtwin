package com.myiittwin.service;

import com.myiittwin.dto.ChatResponse;
import com.myiittwin.model.ChatMessage;
import com.myiittwin.model.User;
import com.myiittwin.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;
    private final GeminiService geminiService;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a");

    public List<ChatResponse> getHistory(String userId) {
        List<ChatMessage> messages = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(userId);

        // If no history, create Aryan's opening message
        if (messages.isEmpty()) {
            User user = userService.getUserEntity(userId);
            String intro = String.format(
                "hey %s! just settled in after a long lab session 😅 what's up — anything specific you wanna know about, or just catching up?",
                user.getName()
            );
            ChatMessage aryanIntro = saveMessage(userId, "aryan", intro);
            return List.of(toResponse(aryanIntro));
        }

        return messages.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ChatResponse sendMessage(String userId, String text) {
        User user = userService.getUserEntity(userId);
        List<ChatMessage> history = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(userId);

        // Save user message
        saveMessage(userId, "user", text);

        // Get Aryan's reply from Gemini
        String reply = geminiService.getChatReply(user, text, history);

        // Save Aryan's reply
        ChatMessage aryanMsg = saveMessage(userId, "aryan", reply);
        return toResponse(aryanMsg);
    }

    private ChatMessage saveMessage(String userId, String role, String content) {
        ChatMessage msg = new ChatMessage();
        msg.setUserId(userId);
        msg.setRole(role);
        msg.setContent(content);
        return chatMessageRepository.save(msg);
    }

    private ChatResponse toResponse(ChatMessage msg) {
        String time = msg.getCreatedAt() != null
            ? msg.getCreatedAt().format(TIME_FMT)
            : LocalDateTime.now().format(TIME_FMT);
        return new ChatResponse(msg.getRole(), msg.getContent(), time);
    }
}
