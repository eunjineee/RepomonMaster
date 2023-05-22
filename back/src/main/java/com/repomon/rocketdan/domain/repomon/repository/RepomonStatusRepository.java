package com.repomon.rocketdan.domain.repomon.repository;


import com.repomon.rocketdan.domain.repomon.entity.RepomonStatusEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface RepomonStatusRepository extends JpaRepository<RepomonStatusEntity, Long> {

	Optional<RepomonStatusEntity> findByRepoId(Long id);

	// 범위 안에서 랜덤으로 한 가지 추출하기
	@Query(nativeQuery = true,
		value = "SELECT * FROM repomon_status INNER JOIN repo " +
			"ON repomon_status.repo_id = repo.repo_id " +
			"WHERE repo.rating >= :startRating and repo.rating < :endRating " +
			"and repo.repomon_id < 9000 and repo.repo_owner != :repomonOwner " +
			"ORDER BY RAND() limit 1 ")
	Optional<RepomonStatusEntity> findByRatingBetweenRandom(
		@Param("startRating") Integer startRating, @Param("endRating") Integer endRating,
		@Param("repomonOwner") String repomonOwner);

	@Query(nativeQuery = true, value = "SELECT * FROM repomon_status INNER JOIN repo"
		+ "ON repomon_status.repo_id = repo.repo_id "
		+ "WHERE repo.repomon_id < 9000 and repo.repo_owner != :repomonOwner and repo.repo_id != :repoId "
		+ "ORDER BY RAND() limit 1")
	RepomonStatusEntity findByRandom(@Param("repomonOwner") String repomonOwner, @Param("repoId") Long repoId);

}
