package com.repomon.rocketdan.common.service;


import com.repomon.rocketdan.domain.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

	private final AuthService authService;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

		OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();

		OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest); // 유저정보 받아오기

		ClientRegistration clientRegistration = userRequest.getClientRegistration();
		String provider = clientRegistration.getRegistrationId(); // 제공자


		if (provider.equalsIgnoreCase("github")) {
			return buildGithubOAuth2User(oAuth2User, userRequest);
		} else {
			throw new OAuth2AuthenticationException(new OAuth2Error("invalid_provider"));
		}
	}

	private OAuth2User buildGithubOAuth2User(OAuth2User oAuth2User, OAuth2UserRequest userRequest) {
		Map<String, Object> userAttributes = oAuth2User.getAttributes();
		String accessToken = userRequest.getAccessToken().getTokenValue();
		String login = (String) userAttributes.get("login");
//		String name = (String) userAttributes.get("name");
		String avatarUrl = (String) userAttributes.get("avatar_url");
		Long userId = authService.login(login, accessToken);

//		name = name == null ? "" : name;
		GithubOAuth2UserInfo userInfo = new GithubOAuth2UserInfo(userId, login, accessToken, avatarUrl);

		return new DefaultOAuth2User(
			Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
			userInfo.getAttributes(),
			userInfo.getNameAttributeKey());
	}

	public class GithubOAuth2UserInfo {
		private Map<String, Object> attributes;

		public GithubOAuth2UserInfo(Long userId, String login, String accessToken, String avatarUrl) {
			attributes = new HashMap<>();
			attributes.put("userId", userId);
			attributes.put("login", login);
//			attributes.put("name", name);
			attributes.put("avatarUrl", avatarUrl);
			attributes.put("accessToken", accessToken);
		}

		public Map<String, Object> getAttributes() {
			return attributes;
		}

		public String getNameAttributeKey() {
			return "login";
		}
	}

}
