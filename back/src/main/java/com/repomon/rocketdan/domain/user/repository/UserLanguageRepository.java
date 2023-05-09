package com.repomon.rocketdan.domain.user.repository;

import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.entity.UserLanguageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLanguageRepository extends JpaRepository<UserLanguageEntity, Long> {
    List<UserLanguageEntity> findAllByUser(UserEntity user);
}
