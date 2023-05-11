package com.repomon.rocketdan.domain.repo.repository.redis;

import com.repomon.rocketdan.domain.repo.dto.response.RepoConventionResponseDto;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface RepoRedisConventionRepository extends CrudRepository<RepoConventionResponseDto, Long> {

    Optional<RepoConventionResponseDto> findByRepoId(Long repoId);

    void deleteByRepoId(Long repoId);
}
