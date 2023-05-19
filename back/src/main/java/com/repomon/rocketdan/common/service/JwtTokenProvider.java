package com.repomon.rocketdan.common.service;


import com.repomon.rocketdan.common.dto.AuthResponseDto;
import com.repomon.rocketdan.exception.CustomException;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.repomon.rocketdan.exception.ErrorCode;

import java.util.Date;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

	private final RedisService redisService;
	@Value("${jwt.secret}")
	private String secretKey;

	@Value("${jwt.expire.access}")
	private Long accessExpiry; // 토큰 만료일
	@Value("${jwt.expire.refresh}")
	private Long refreshExpiry; // 토큰 만료일

	/**
	 * 토큰 생성
	 */
	public AuthResponseDto createToken(Long userId) {

		// accessToken 생성
		Date issuedDate = new Date();
		Date expiryDateAtAccessToken = new Date(issuedDate.getTime() + accessExpiry);

		JwtBuilder accessTokenBuilder = Jwts.builder()
			.setSubject(String.valueOf(userId))
			.setIssuedAt(issuedDate)
			.setExpiration(expiryDateAtAccessToken)
			.signWith(SignatureAlgorithm.HS256, secretKey);

		// refreshToken 생성
		Date expiryDateAtRefreshToken = new Date(issuedDate.getTime() + refreshExpiry);

		JwtBuilder refreshTokenBuilder = Jwts.builder()
			.setSubject(String.valueOf(userId))
			.setIssuedAt(issuedDate)
			.setExpiration(expiryDateAtRefreshToken)
			.signWith(SignatureAlgorithm.HS256, secretKey);

		redisService.setDataExpire(refreshTokenBuilder.compact(), String.valueOf(userId), refreshExpiry);

		System.out.println("createToken !!");
		System.out.println("accessToken = " + accessTokenBuilder.compact());
		System.out.println("refreshToken = " + refreshTokenBuilder.compact());

		AuthResponseDto authResponseDto = new AuthResponseDto(accessTokenBuilder.compact(), refreshTokenBuilder.compact());

		return authResponseDto;
	}


	/**
	 * 토큰에서 유저 아이디(PK) 추출
	 */
	public Long getUserId(String token) {
		try {
			Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
			return Long.parseLong(claims.getSubject());
		} catch (JwtException e) {
			// Todo : JWT 유효성 검사 실패
			return null;
		}
	}


	/**
	 * 토큰에 저장된 Subject(유저 정보)를 조회
	 */
	private String getSubject(String token) {
		try {
			return Jwts.parser()
				.setSigningKey(secretKey)
				.parseClaimsJws(token)
				.getBody() // token의 Body가 하기 exception들로 인해 유효하지 않으면 각각에 해당하는 로그 콘솔에 찍음
				.getSubject();
		} catch (SecurityException e) {
			log.error("Invalid JWT signature.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (MalformedJwtException e) {
			log.error("Invalid JWT token.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (ExpiredJwtException e) {
			log.error("Expired JWT token.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (UnsupportedJwtException e) {
			log.error("Unsupported JWT token.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		} catch (IllegalArgumentException e) {
			log.error("JWT token compact of handler are invalid.");
			throw new CustomException(ErrorCode.TOKEN_ERROR);
		}
	}


	/**
	 * 토큰의 유효성 및 만료기간 검사
	 */
	public boolean validate(String token) {
		try {
			Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
			return !claims.getBody().getExpiration().before(new Date());
		} catch (Exception e) {
			return false;
		}
	}

}