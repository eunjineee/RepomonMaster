package com.repomon.rocketdan.domain.repo.entity;


import com.repomon.rocketdan.domain.repo.app.RepoDetail;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import lombok.*;
import org.kohsuke.github.GHRepository;

import javax.persistence.*;


@Entity
@Getter @Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "active_repo")
public class ActiveRepoEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "active_repo_id")
	private Long activeRepoId;


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private UserEntity user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "repo_id")
	private RepoEntity repo;

	public static ActiveRepoEntity of(UserEntity userEntity, RepoEntity repoEntity) {
		return ActiveRepoEntity.builder()
			.user(userEntity)
			.repo(repoEntity)
			.build();
	}

	public static RepoDetail convertToRepo(ActiveRepoEntity activeRepoEntity, GHRepository ghRepository){
		RepoEntity repoEntity = activeRepoEntity.getRepo();
		return new RepoDetail(repoEntity
			, ghRepository == null ? "비공개 처리된 레포지토리입니다." : ghRepository.getDescription()
			, repoEntity.getIsActive()
			, ghRepository == null);
	}
}
