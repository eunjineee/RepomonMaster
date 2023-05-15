package com.repomon.rocketdan.domain.repomon.repository;


import com.repomon.rocketdan.domain.repomon.entity.BattleLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface BattleLogRepository extends JpaRepository<BattleLogEntity, Long> {

	@Query(nativeQuery = true, value = "SELECT * FROM battle_log " +
		"where attack_repo_id = :repo_id or defense_repo_id = :repo_id " +
		"ORDER BY created_at DESC LIMIT 5 ")
	List<BattleLogEntity> findTop5ByRepoIdOrderByDesc(@Param("repo_id") Long repoId);

}
