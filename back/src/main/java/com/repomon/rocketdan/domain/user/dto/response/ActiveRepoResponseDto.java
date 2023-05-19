package com.repomon.rocketdan.domain.user.dto.response;


import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;




@AllArgsConstructor
@Getter
@ToString
@Builder
public class ActiveRepoResponseDto {

	public static ActiveRepoResponseDto fromEntity(ActiveRepoEntity activeRepo) {
		return new ActiveRepoResponseDto();
	}


	public static List<ActiveRepoResponseDto> fromEntityList(List<ActiveRepoEntity> activeRepoList) {
		List<ActiveRepoResponseDto> result = new ArrayList<>();
		for (ActiveRepoEntity activeRepo : activeRepoList) {
			ActiveRepoResponseDto activeRepoResponseDto = ActiveRepoResponseDto.fromEntity(activeRepo);
			result.add(activeRepoResponseDto);
		}
		return result;
	}
}
