package com.repomon.rocketdan.domain.user.dto.response;


import com.repomon.rocketdan.domain.repo.dto.response.RepomonResponseDto;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import lombok.*;

import java.util.Map;


@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class UserResponseDto {

	private final Long userId;
	private final String username;
	private final String nickname;
	private final String avatarUrl;
	private String userDescription;
	private Integer activeRepoCnt;
	private Long totalExp;
	private RepresentRepo representRepo;
	private Integer userRank;


	public static UserResponseDto fromEntity(UserEntity user, Map<String, String> userInfo) {

		return UserResponseDto.builder()
			.userId(user.getUserId())
			.username(userInfo.get("username"))
			.avatarUrl(userInfo.get("avatarUrl"))
			.nickname(userInfo.get("nickname"))
			.userDescription(userInfo.get("description"))
			.build();
	}


	@Data
	@Builder
	public static class RepresentRepo {

		private Long repoId;
		private String repomonNickName;
		private String repoName;
		private Long repoExp;
		private Integer repoRating;
		private RepomonResponseDto repomon;
		private Long repoRank;
		private Long battleRank;
		private Boolean isActive;


		public static RepresentRepo fromEntity(RepoEntity repo, Long repoRank, Long battleRank) {
			return RepresentRepo.builder()
				.repoId(repo.getRepoId())
				.repomonNickName(repo.getRepomonNickname())
				.repoName(repo.getRepoName())
				.repoExp(repo.getRepoExp())
				.repoRating(repo.getRating())
				.repomon(RepomonResponseDto.fromEntity(repo.getRepomon()))
				.repoRank(repoRank)
				.battleRank(battleRank)
				.isActive(repo.getIsActive())
				.build();
		}

	}

}
