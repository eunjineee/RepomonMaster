package com.repomon.rocketdan.domain.repo.repository.redis;

import com.repomon.rocketdan.domain.repo.dto.response.RepoRedisCardResponseDto;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface RepoRedisCardRepository extends CrudRepository<RepoRedisCardResponseDto, Long> {
    Optional<RepoRedisCardResponseDto> findByRepoId(Long repoId);
}
