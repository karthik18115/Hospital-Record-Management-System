package com.medirec.repository;

import com.medirec.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.recipient WHERE (m.sender.uuid = :user1Uuid AND m.recipient.uuid = :user2Uuid) OR (m.sender.uuid = :user2Uuid AND m.recipient.uuid = :user1Uuid) ORDER BY m.timestamp ASC")
    List<Message> findMessagesBetweenUsers(@Param("user1Uuid") UUID user1Uuid, @Param("user2Uuid") UUID user2Uuid);

    @Query("SELECT DISTINCT CASE WHEN m.sender.uuid = :currentUserUuid THEN m.recipient.uuid ELSE m.sender.uuid END FROM Message m WHERE m.sender.uuid = :currentUserUuid OR m.recipient.uuid = :currentUserUuid")
    List<UUID> findContactUuids(@Param("currentUserUuid") UUID currentUserUuid);

    long countBySenderUuidAndRecipientUuidAndIsReadFalse(UUID senderUuid, UUID recipientUuid);
    
    Message findTopBySenderUuidAndRecipientUuidOrSenderUuidAndRecipientUuidOrderByTimestampDesc(UUID sender1, UUID recipient1, UUID sender2, UUID recipient2);
} 