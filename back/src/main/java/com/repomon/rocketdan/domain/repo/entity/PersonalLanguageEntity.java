package com.repomon.rocketdan.domain.repo.entity;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Getter
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

}
