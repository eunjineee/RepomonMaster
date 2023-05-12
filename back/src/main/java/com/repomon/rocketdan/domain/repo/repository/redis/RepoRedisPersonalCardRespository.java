package com.repomon.rocketdan.domain.repo.repository.redis;

import com.repomon.rocketdan.domain.repo.dto.response.RepoRedisPersonalCardResponseDto;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RepoRedisPersonalCardRespository extends CrudRepository<RepoRedisPersonalCardResponseDto, Long>{
    Optional<RepoRedisPersonalCardResponseDto> findByRepoIdAndUserId(Long repoId, Long userId);
}

