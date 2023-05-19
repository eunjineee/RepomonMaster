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
@Table(name = "repomon")
public class RepomonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "repomon_id")
	private Long repomonId;
	private String repomonUrl;
	private Integer repomonTier;
	private String repomonName;
	private String repomonSkillUrl;
	private String repomonSkillName;

}
