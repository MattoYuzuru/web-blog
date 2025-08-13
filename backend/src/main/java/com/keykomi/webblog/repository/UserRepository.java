package com.keykomi.webblog.repository;

import com.keykomi.webblog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.username = :login OR u.mail = :login")
    Optional<User> findByUsernameOrMail(@Param("login") String login);
}
