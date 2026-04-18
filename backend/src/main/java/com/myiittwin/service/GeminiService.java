package com.myiittwin.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myiittwin.model.ChatMessage;
import com.myiittwin.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @jakarta.annotation.PostConstruct
    void logKeyStatus() {
        boolean keyPresent = apiKey != null && !apiKey.isBlank() && !apiKey.equals("your-api-key-here");
        log.info("GeminiService ready — API key present: {}", keyPresent);
    }

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Max recent messages sent as context to Gemini
    private static final int CONTEXT_WINDOW = 10;

    public String getChatReply(User user, String userMessage, List<ChatMessage> history, String userApiKey) {
        String systemPrompt = buildSystemPrompt(user);
        String conversationContext = buildConversationContext(history, userMessage);
        return callGemini(systemPrompt, conversationContext, resolveKey(userApiKey));
    }

    public String getLogReaction(User user, String logText, String userApiKey) {
        String systemPrompt = buildSystemPrompt(user);
        String logPrompt = String.format(
            "The user just submitted their weekly log: \"%s\"\n\n" +
            "React to this as Aryan. Acknowledge what they did, " +
            "briefly relate it to something from your own experience, " +
            "and end with ONE specific thing they should do next. " +
            "Not a list — just one thing. Keep it under 100 words.",
            logText
        );
        return callGemini(systemPrompt, logPrompt, resolveKey(userApiKey));
    }

    private String resolveKey(String userApiKey) {
        return (userApiKey != null && !userApiKey.isBlank()) ? userApiKey : apiKey;
    }

    private String buildSystemPrompt(User user) {
        String vibeTraits = buildVibeTraits(user.getVibe());

        return String.format(
            "You are Aryan, a CSE student at IIT Bombay, currently in %s.\n" +
            "Your goal: achieve the IIT equivalent of \"%s\".\n\n" +
            "Your personality:\n%s\n" +
            "You are the NORMAL version — smart but not perfect. " +
            "You waste some weekends, binge YouTube sometimes, skip a few CP contests, " +
            "but you're self-aware and keep coming back on track.\n\n" +
            "The person you're talking to is %s, a CSE student in %s at a tier 3 college.\n" +
            "Their background: %s\n" +
            "Their goal: %s\n\n" +
            "Rules:\n" +
            "- Speak casually. Late-night peer energy. Never mentor tone.\n" +
            "- Max 120 words per reply.\n" +
            "- You can use light emojis but don't overdo it.\n" +
            "- Never say 'As an AI' or break character.\n" +
            "- When referencing your own life, be specific — actual problems, ratings, events.\n" +
            "- If asked about any time period (past sems, this week, next month), answer specifically.",
            user.getSemester(),
            user.getGoal(),
            vibeTraits,
            user.getName(),
            user.getSemester(),
            user.getBackground(),
            user.getGoal()
        );
    }

    private String buildVibeTraits(String vibeJson) {
        if (vibeJson == null || vibeJson.isBlank()) return "- You're focused on coding and academics.\n";

        StringBuilder traits = new StringBuilder();
        String cleaned = vibeJson.replaceAll("[\\[\\]\"]", "");
        String[] vibes = cleaned.split(",");

        for (String vibe : vibes) {
            switch (vibe.trim()) {
                case "Sports"   -> traits.append("- You play inter-hostel cricket, occasionally miss study sessions for matches.\n");
                case "Music"    -> traits.append("- You're in the music club, have a guitar in your hostel room.\n");
                case "Gaming"   -> traits.append("- You game till 2am sometimes, have a decent setup in your room.\n");
                case "Art"      -> traits.append("- You're into design, doodle in your notebooks, join Techfest art events.\n");
                case "Movies"   -> traits.append("- You watch movies with your wing sometimes, have strong opinions on them.\n");
                case "Reading"  -> traits.append("- You read occasionally — random non-fiction, philosophy, whatever catches your eye.\n");
                default         -> traits.append("- You balance academics with a normal social life on campus.\n");
            }
        }
        return traits.toString();
    }

    private String buildConversationContext(List<ChatMessage> history, String newMessage) {
        if (history.isEmpty()) {
            return newMessage;
        }

        // Take last CONTEXT_WINDOW messages for context
        List<ChatMessage> recent = history.size() > CONTEXT_WINDOW
            ? history.subList(history.size() - CONTEXT_WINDOW, history.size())
            : history;

        StringBuilder ctx = new StringBuilder("Previous conversation:\n");
        for (ChatMessage msg : recent) {
            String speaker = msg.getRole().equals("aryan") ? "Aryan" : "User";
            ctx.append(speaker).append(": ").append(msg.getContent()).append("\n");
        }
        ctx.append("\nUser: ").append(newMessage).append("\n\nAryan:");
        return ctx.toString();
    }

    private String callGemini(String systemPrompt, String userContent, String key) {
        try {
            String url = apiUrl + "?key=" + key;

            Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                    "parts", List.of(Map.of("text", systemPrompt))
                ),
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", userContent)))
                ),
                "generationConfig", Map.of(
                    "maxOutputTokens", 200,
                    "temperature", 0.85
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root
                .path("candidates").get(0)
                .path("content")
                .path("parts").get(0)
                .path("text")
                .asText("sorry, I'm a bit distracted rn 😅 ask me again?");

        } catch (HttpClientErrorException e) {
            log.error("Gemini API HTTP error {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "bro my wifi just died 😭 try again in a sec";
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage(), e);
            return "bro my wifi just died 😭 try again in a sec";
        }
    }
}
