package com.repomon.rocketdan.domain.user.service;


import com.repomon.rocketdan.common.dto.AuthResponseDto;
import com.repomon.rocketdan.common.service.JwtTokenProvider;
import com.repomon.rocketdan.common.service.RedisService;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
	private final UserRepository userRepository;
	private final JwtTokenProvider jwtTokenProvider;
	private final RedisService redisService;
	

	/**
	 * 로그인: 깃허브 소셜 로그인
	 * @param userName
	 */
	public Long login(String userName, String accessToken) {

		UserEntity user = userRepository.findByUserName(userName).orElseGet(() -> {
			UserEntity userEntity = UserEntity.builder()
				.userName(userName)
				.totalExp(0L)
				.accessToken(accessToken)
				.build();

			return userRepository.save(userEntity);
		});

		if(!accessToken.equals(user.getAccessToken())){
			user.updateAccessToken(accessToken);
		}

		return user.getUserId();
	}



	/**
	 * 로그아웃: 리프레쉬 토큰 삭제
	 * @param refreshToken
	 */
	public void logout(String refreshToken) {

		redisService.deleteData(refreshToken);
	}


	/**
	 * 토큰 재발급
	 * @param accessToken
	 * @param refreshToken
	 * @return
	 */
	public AuthResponseDto refresh(String accessToken, String refreshToken) {

		if (jwtTokenProvider.validate(accessToken) && jwtTokenProvider.validate(refreshToken)) {
			log.error("액세스 토큰과 리프레쉬 토큰이 만료되지 않음");
			throw new CustomException(ErrorCode.UNAUTHORIZED_REISSUE_TOKEN);
		} else if (jwtTokenProvider.validate(accessToken)) {
			log.error("액세스 토큰이 만료되지 않음");
			throw new CustomException(ErrorCode.UNAUTHORIZED_REISSUE_TOKEN);
		} else if (jwtTokenProvider.validate(refreshToken)) {
			Long userId;
			try {
				userId = redisService.getAndDelete(refreshToken);
			} catch (Exception e){
				log.error("리프레쉬 토큰에서 사용자를 조회할 수 없음");
				throw new CustomException(ErrorCode.UNAUTHORIZED_REISSUE_TOKEN);
			}
			System.out.println("userId = " + userId);
			return jwtTokenProvider.createToken(userId);
		} else {
			log.error("리프레쉬 토큰이 만료됨");
			throw new CustomException(ErrorCode.UNAUTHORIZED_REISSUE_TOKEN);
		}
	}
}
