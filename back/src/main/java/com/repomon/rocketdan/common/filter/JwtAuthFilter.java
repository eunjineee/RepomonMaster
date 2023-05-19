package com.repomon.rocketdan.common.filter;


import com.repomon.rocketdan.common.service.JwtTokenProvider;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.domain.user.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;


@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

	public static final String AUTHORIZATION_HEADER = "authorization";
	public static final String BEARER_PREFIX = "Bearer ";
	private final JwtTokenProvider jwtTokenProvider;
	private final CustomUserDetailsService userDetailsService;


	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

		try {
			String accessToken = getTokenFromRequest(request);

			if (StringUtils.hasText(accessToken) && jwtTokenProvider.validate(accessToken)) {
				Long userId = jwtTokenProvider.getUserId(accessToken);
				UserDetails userDetails = userDetailsService.loadUserById(userId);
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
					userDetails, null, userDetails.getAuthorities());
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

		} catch (Exception ex) {
			logger.error("Could not set user authentication in security context", ex);
			throw new JwtAuthenticationException("JWT 인증 에러", ex);
		}



		filterChain.doFilter(request, response);
	}

	// Request Header 에서 토큰 정보를 꺼내오기
	private String getTokenFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
			return bearerToken.substring(7);
		}
		return null;
	}

	public class JwtAuthenticationException extends AuthenticationException {

		public JwtAuthenticationException(String msg) {
			super(msg);
		}

		public JwtAuthenticationException(String msg, Throwable cause) {
			super(msg, cause);
		}
	}
}
