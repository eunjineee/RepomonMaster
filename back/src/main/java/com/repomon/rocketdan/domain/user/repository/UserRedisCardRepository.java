package com.repomon.rocketdan.domain.user.repository;

import com.repomon.rocketdan.domain.user.dto.response.UserRedisCardResponseDto;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRedisCardRepository extends CrudRepository<UserRedisCardResponseDto, Long> {
    Optional<UserRedisCardResponseDto> findByUserId(Long userId);
}
