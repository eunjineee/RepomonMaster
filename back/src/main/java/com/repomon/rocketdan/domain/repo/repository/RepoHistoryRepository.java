package com.repomon.rocketdan.domain.repo.repository;

import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoHistoryEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepoHistoryRepository extends JpaRepository<RepoHistoryEntity, Long> {
    List<RepoHistoryEntity> findAllByRepo(RepoEntity repoEntity);

    Optional<RepoHistoryEntity> findFirstByRepoOrderByWorkedAtDesc(RepoEntity repoEntity);
}
