package com.repomon.rocketdan.domain.user.dto.response;


import com.repomon.rocketdan.domain.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class UserRankResponseDto {

	private Long userId;
	private Long totalExp;
	private String username;
	private Long activeRepoCount;
	private Long userRank;
	private String avatarUrl;


	public static UserRankResponseDto fromEntity(UserEntity user, Long activeRepoCount, Long userRank, String avatarUrl) {

		return UserRankResponseDto.builder()
			.userId(user.getUserId())
			.username(user.getUserName())
			.totalExp(user.getTotalExp())
			.userRank(userRank)
			.activeRepoCount(activeRepoCount)
			.avatarUrl(avatarUrl)
			.build();
	}

}
