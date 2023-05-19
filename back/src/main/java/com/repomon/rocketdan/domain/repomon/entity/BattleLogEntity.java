package com.repomon.rocketdan.domain.repomon.entity;


import com.repomon.rocketdan.common.entity.CommonEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;


@Entity
@Getter
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "battle_log")
public class BattleLogEntity extends CommonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "battle_log_id")
	private Long battleLogId;

	private Boolean isWin;
	private Integer attackPoint;
	private Integer defensePoint;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "attack_repo_id")
	private RepomonStatusEntity attackRepo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "defense_repo_id")
	private RepomonStatusEntity defenseRepo;

}
