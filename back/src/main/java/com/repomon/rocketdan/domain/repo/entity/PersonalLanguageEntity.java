package com.repomon.rocketdan.domain.repo.entity;


import lombok.*;

import javax.persistence.*;


@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "personal_language")
public class PersonalLanguageEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "personal_language_id")
	private Long personalLanguageId;

	private String languageCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "active_repo_id")
	private ActiveRepoEntity activeRepoEntity;

	public static PersonalLanguageEntity of(String languageCode, ActiveRepoEntity repoEntity) {
		return PersonalLanguageEntity.builder()
				.languageCode(languageCode)
				.activeRepoEntity(repoEntity)
				.build();
	}
}