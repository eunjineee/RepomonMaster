package com.repomon.rocketdan.domain.repomon.dto.response;


import com.repomon.rocketdan.domain.repomon.entity.BattleLogEntity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Builder
public class BattleLogListResponseDto {

	private List<BattleLog> battleLogList;


	public static BattleLogListResponseDto fromEntity(List<BattleLogEntity> battleLogList) {
		List<BattleLog> battleLogs = battleLogList.stream()
			.map(BattleLog::fromEntity)
			.collect(Collectors.toList());

		return new BattleLogListResponseDto(battleLogs);
	}


	@Getter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	private static class BattleLog {

		private Boolean isWin;
		private Integer attackPoint;
		private Integer defensePoint;
		private LocalDateTime createdAt;
		private RepomonStatusResponseDto attackRepo;
		private RepomonStatusResponseDto defenseRepo;


		public static BattleLog fromEntity(BattleLogEntity battleLog) {
			return BattleLog.builder()
				.isWin(battleLog.getIsWin())
				.attackPoint(battleLog.getAttackPoint())
				.defensePoint(battleLog.getDefensePoint())
				.createdAt(battleLog.getCreatedAt())
				.attackRepo(RepomonStatusResponseDto.fromEntity(battleLog.getAttackRepo()))
				.defenseRepo(RepomonStatusResponseDto.fromEntity(battleLog.getDefenseRepo()))
				.build();
		}

	}

}
