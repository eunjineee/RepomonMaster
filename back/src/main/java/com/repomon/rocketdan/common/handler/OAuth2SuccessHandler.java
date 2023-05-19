package com.repomon.rocketdan.common.handler;


import com.repomon.rocketdan.common.dto.AuthResponseDto;
import com.repomon.rocketdan.common.service.JwtTokenProvider;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtTokenProvider authTokenProvider;
	@Value("${front_url}")
	private String frontUrl;


	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException, ServletException {

		DefaultOAuth2User oAuth2User = (DefaultOAuth2User) authentication.getPrincipal();

		System.out.println("oAuth2User = " + oAuth2User);

		Long userId = oAuth2User.getAttribute("userId");
		String username = oAuth2User.getAttribute("login");
//		String name = oAuth2User.getAttribute("name");
		String avatarUrl = oAuth2User.getAttribute("avatarUrl");
		AuthResponseDto authResponseDto = authTokenProvider.createToken(userId);

//		name = URLEncoder.encode(name, StandardCharsets.UTF_8);
		setDefaultTargetUrl(
			frontUrl + "?access-token=" + authResponseDto.getAccessToken() + "&refresh-token=" + authResponseDto.getRefreshToken() + "&username=" + username  + "&avatarUrl="
				+ avatarUrl + "&userId=" + userId);
		super.onAuthenticationSuccess(request, response, authentication);

	}
}
