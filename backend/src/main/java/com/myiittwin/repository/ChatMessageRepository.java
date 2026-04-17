package com.myiittwin.repository;

import com.myiittwin.model.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserIdOrderByCreatedAtAsc(String userId);

    @Query("SELECT m FROM ChatMessage m WHERE m.userId = :userId ORDER BY m.createdAt DESC")
    List<ChatMessage> findRecentByUserId(@Param("userId") String userId, Pageable pageable);
}
