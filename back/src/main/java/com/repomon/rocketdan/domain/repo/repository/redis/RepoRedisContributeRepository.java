package com.repomon.rocketdan.domain.repo.repository.redis;

import com.repomon.rocketdan.domain.repo.dto.response.RepoContributeResponseDto;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface RepoRedisContributeRepository extends CrudRepository<RepoContributeResponseDto, Long> {

    Optional<RepoContributeResponseDto> findByRepoId(Long repoId);
}
