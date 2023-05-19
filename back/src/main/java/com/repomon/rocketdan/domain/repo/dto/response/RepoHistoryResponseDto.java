package com.repomon.rocketdan.domain.repo.dto.response;


import com.repomon.rocketdan.domain.repo.entity.RepoHistoryEntity;
import lombok.*;

import java.util.ArrayList;
import java.util.List;




@AllArgsConstructor
@Getter
@ToString
@Builder
public class RepoHistoryResponseDto {

	public static RepoHistoryResponseDto fromEntity(RepoHistoryEntity repoHistory) {
		return new RepoHistoryResponseDto();
	}

	public static List<RepoHistoryResponseDto> fromEntityList(List<RepoHistoryEntity> repoHistoryList) {
		List<RepoHistoryResponseDto> result = new ArrayList<>();
		for (RepoHistoryEntity repoHistory : repoHistoryList) {
			RepoHistoryResponseDto repoHistoryResponseDto = RepoHistoryResponseDto.fromEntity(repoHistory);
			result.add(repoHistoryResponseDto);
		}
		return result;
	}

}
