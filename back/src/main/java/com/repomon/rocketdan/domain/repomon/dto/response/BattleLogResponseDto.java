package com.repomon.rocketdan.domain.repomon.dto.response;


import com.repomon.rocketdan.domain.repomon.entity.BattleLogEntity;
import lombok.*;

import java.util.HashMap;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Builder
public class BattleLogResponseDto {

	private Boolean isWin;
	private Integer attackPoint;
	private Integer defensePoint;
	private Boolean startPlayer;
	private List<HashMap<String, Object>> battleLog;
	private RepomonStatusResponseDto attackRepo;
	private RepomonStatusResponseDto defenseRepo;


	public static BattleLogResponseDto fromEntity(BattleLogEntity battleLog,
		List<HashMap<String, Object>> logList) {
		return BattleLogResponseDto.builder()
			.isWin(battleLog.getIsWin())
			.attackPoint(battleLog.getAttackPoint())
			.defensePoint(battleLog.getDefensePoint())
			.attackRepo(RepomonStatusResponseDto.fromEntity(battleLog.getAttackRepo()))
			.defenseRepo(RepomonStatusResponseDto.fromEntity(battleLog.getDefenseRepo()))
			.battleLog(logList)
			.build();
	}

}
