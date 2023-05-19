package com.repomon.rocketdan.domain.user.dto.response;


import com.repomon.rocketdan.common.dto.AuthResponseDto;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter @Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExtensionUserResponseDto {

	private Long userId;
	private String userName;
	private String avatarUrl;
	private String accessToken;
	private String refreshToken;

	public static ExtensionUserResponseDto of(UserEntity user, AuthResponseDto token, String avatarUrl) {

		return ExtensionUserResponseDto.builder()
			.userId(user.getUserId())
			.userName(user.getUserName())
			.avatarUrl(avatarUrl)
			.accessToken(token.getAccessToken())
			.refreshToken(token.getRefreshToken())
			.build();
	}

}
