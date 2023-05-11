package com.repomon.rocketdan.domain.repo.repository.redis;

import com.repomon.rocketdan.domain.repo.dto.response.RepoListResponseDto;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface RepoRedisListRepository extends CrudRepository<RepoListResponseDto, Long> {

    List<RepoListResponseDto> findByUserName(String userName, Pageable pageable);
    List<RepoListResponseDto> findAllByUserName(String userName);
}
