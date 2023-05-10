package com.repomon.rocketdan.domain.repo.repository;


import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import com.repomon.rocketdan.domain.repo.entity.PersonalLanguageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PersonalLanguageRepository extends JpaRepository<PersonalLanguageEntity, Long> {
    Optional<List<PersonalLanguageEntity>> findAllByActiveRepoEntity(ActiveRepoEntity entity);
}
