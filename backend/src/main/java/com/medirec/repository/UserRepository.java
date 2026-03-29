package com.medirec.repository;

import com.medirec.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUuid(UUID uuid);
    List<User> findByRolesContains(String role);

    @Query("SELECT u FROM User u WHERE u.uuid IN :uuids")
    List<User> findByUuidIn(@Param("uuids") List<UUID> uuids);

    @Query("SELECT DISTINCT u FROM User u WHERE :role MEMBER OF u.roles")
    List<User> findByRole(@Param("role") String role);
} 