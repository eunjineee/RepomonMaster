package com.repomon.rocketdan.domain.user.entity;


import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import lombok.*;

import javax.persistence.*;
import java.util.Optional;


@Entity
@Getter
@Builder
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "user")
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long userId;
	private String userName;
	private Long totalExp;
	private String accessToken;

	@OneToOne
	@JoinColumn(name = "represent_repo_id")
	private ActiveRepoEntity representRepo;


	public void updateRepresentRepo(ActiveRepoEntity repo) {
		this.representRepo = repo;
	}


	public Optional<ActiveRepoEntity> getRepresentRepo() {
		return Optional.ofNullable(representRepo);
	}

	public void updateTotalExp(Long exp) {
		this.totalExp += exp;
	}

	public void updateAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
}
