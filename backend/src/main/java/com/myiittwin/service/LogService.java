package com.myiittwin.service;

import com.myiittwin.dto.LogResponse;
import com.myiittwin.model.User;
import com.myiittwin.model.WeeklyLog;
import com.myiittwin.repository.WeeklyLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogService {

    private final WeeklyLogRepository weeklyLogRepository;
    private final UserService userService;
    private final GeminiService geminiService;

    public LogResponse submitLog(String userId, String text) {
        User user = userService.getUserEntity(userId);

        int weekNumber = (int) weeklyLogRepository.countByUserId(userId) + 1;
        String aryanReply = geminiService.getLogReaction(user, text);

        WeeklyLog log = new WeeklyLog();
        log.setUserId(userId);
        log.setWeekNumber(weekNumber);
        log.setContent(text);
        log.setAryanReply(aryanReply);
        WeeklyLog saved = weeklyLogRepository.save(log);

        return new LogResponse(saved.getWeekNumber(), saved.getContent(), saved.getAryanReply(), saved.getFormattedDate());
    }

    public List<LogResponse> getLogs(String userId) {
        return weeklyLogRepository.findByUserIdOrderByWeekNumberAsc(userId)
            .stream()
            .map(log -> new LogResponse(log.getWeekNumber(), log.getContent(), log.getAryanReply(), log.getFormattedDate()))
            .collect(Collectors.toList());
    }
}
