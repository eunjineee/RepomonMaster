package com.repomon.rocketdan.domain.repo.repository.redis;

import com.repomon.rocketdan.domain.repo.dto.response.RepoListResponseDto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface RepoRedisListRepository extends CrudRepository<RepoListResponseDto, Long> {

    List<RepoListResponseDto> findAllByUserName(String userName);

    Optional<RepoListResponseDto> findByUserNameAndCurrentPage(String userName, int currentPage);
}
