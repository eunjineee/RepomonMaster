package com.repomon.rocketdan.domain.repo.repository;


import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface RepoRepository extends JpaRepository<RepoEntity, Long> {

    Optional<RepoEntity> findByRepoKey(String repoKey);

    Boolean existsByRepomonNickname(String nickName);

    Page<RepoEntity> findByIsActiveTrue(Pageable pageable);
    Page<RepoEntity> findByRepoNameContainingAndIsActiveTrue(String search, Pageable pageable);
    @Query(value = "SELECT COUNT(r) + 1 " +
        "FROM RepoEntity r " +
        "WHERE r.isActive = true AND r.repoExp > :repoExp")
    Long findRankByRepoExp(@Param("repoExp") Long repoExp);

    @Query(value = "SELECT COUNT(r) + 1 " +
        "FROM RepoEntity r " +
        "WHERE r.isActive = true AND r.rating > :rating")
    Long findRankByRating(@Param("rating") Integer rating);


}
