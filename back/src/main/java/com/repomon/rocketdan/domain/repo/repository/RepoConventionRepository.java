package com.repomon.rocketdan.domain.repo.repository;

import com.repomon.rocketdan.domain.repo.entity.RepoConventionEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepoConventionRepository extends JpaRepository<RepoConventionEntity, Long> {

    List<RepoConventionEntity> findAllByRepo(RepoEntity repoEntity);

    void deleteAllByRepo(RepoEntity repoEntity);

    long countByRepo(RepoEntity repoEntity);
}
