package com.myiittwin.repository;

import com.myiittwin.model.WeeklyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WeeklyLogRepository extends JpaRepository<WeeklyLog, Long> {
    List<WeeklyLog> findByUserIdOrderByWeekNumberAsc(String userId);
    long countByUserId(String userId);
}
