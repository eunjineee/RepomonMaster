package com.repomon.rocketdan.common.dto;


import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class AuthResponseDto {
	private String accessToken;
	private String refreshToken;

	public AuthResponseDto(String accessToken, String refreshToken) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
