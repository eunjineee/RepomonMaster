package com.repomon.rocketdan.domain.repo.repository;


import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ActiveRepoRepository extends JpaRepository<ActiveRepoEntity, Long> {

	@Query(nativeQuery = true, value = "SELECT * FROM active_repo ar INNER JOIN repo r ON ar.repo_id = r.repo_id AND ar.user_id = :userId ORDER BY r.repo_name asc")
	Page<ActiveRepoEntity> findByUser(@Param("userId") UserEntity userEntity, Pageable pageable);
	Optional<ActiveRepoEntity> findByRepoAndUser(RepoEntity repoEntity, UserEntity userEntity);

	List<ActiveRepoEntity> findAllByUser(UserEntity user);
	List<ActiveRepoEntity> findAllByRepo(RepoEntity repo);

	Long countByUserAndRepoIsActive(UserEntity user, boolean b);

}
