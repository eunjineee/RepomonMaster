package com.repomon.rocketdan.domain.user.service;


import static com.repomon.rocketdan.exception.ErrorCode.NOT_FOUND_ACTIVE_REPOSITORY;
import static com.repomon.rocketdan.exception.ErrorCode.NOT_FOUND_ENTITY;
import static com.repomon.rocketdan.exception.ErrorCode.NOT_FOUND_REPOSITORY;
import static com.repomon.rocketdan.exception.ErrorCode.NOT_FOUND_USER;
import static com.repomon.rocketdan.exception.ErrorCode.NO_ACCESS;

import com.repomon.rocketdan.common.utils.GHUtils;
import com.repomon.rocketdan.common.utils.SecurityUtils;
import com.repomon.rocketdan.domain.repo.app.RepoDetail;
import com.repomon.rocketdan.domain.repo.dto.request.RepoCardRequestDto;
import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.repository.ActiveRepoRepository;
import com.repomon.rocketdan.domain.repo.repository.RepoRepository;
import com.repomon.rocketdan.domain.user.dto.request.RepresentRepomonRequestDto;
import com.repomon.rocketdan.domain.user.dto.response.UserRedisCardResponseDto;
import com.repomon.rocketdan.domain.user.dto.response.UserResponseDto;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.entity.UserLanguageEntity;
import com.repomon.rocketdan.domain.user.repository.UserLanguageRepository;
import com.repomon.rocketdan.domain.user.repository.UserRedisCardRepository;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHRepository;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class UserService {

	private final UserLanguageRepository userLanguageRepository;
	private final RankService rankService;
	private final ActiveRepoRepository activeRepoRepository;
	private final RepoRepository repoRepository;
	private final UserRepository userRepository;
	private final GHUtils ghUtils;
	private final UserRedisCardRepository userRedisCardRepository;


	/**
	 * 대표 레포몬 수정
	 *
	 * @param userId
	 * @param requestDto
	 */
	public void modifyRepresentRepo(Long userId, RepresentRepomonRequestDto requestDto) {

		UserEntity user = userRepository.findById(userId).orElseThrow(
			() -> {
				throw new CustomException(NOT_FOUND_ENTITY);
			});

		// 권한 검증
		if (!SecurityUtils.getCurrentUserId().equals(user.getUserName())) {
			throw new CustomException(NO_ACCESS);
		}

		RepoEntity repo = repoRepository.findById(requestDto.getRepoId()).orElseThrow(
			() -> {
				throw new CustomException(NOT_FOUND_REPOSITORY);
			});
		ActiveRepoEntity activeRepo = activeRepoRepository.findByRepoAndUser(repo, user)
			.orElseThrow(
				() -> {
					throw new CustomException(NOT_FOUND_REPOSITORY);
				});

		user.updateRepresentRepo(activeRepo);
		userRepository.save(user);

	}


	/**
	 * 유저 정보 조회
	 *
	 * @param userId
	 * @return
	 */
	public UserResponseDto getUserInfo(Long userId) {
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> {throw new CustomException(NOT_FOUND_USER);});
		Map<String, String> userInfo = ghUtils.getUser(user.getUserName());

		String loginUser = SecurityUtils.getCurrentOrAnonymousUser();
		UserResponseDto userResponseDto = UserResponseDto.fromEntity(user, userInfo);

		if(loginUser.equals(user.getUserName())){
			userResponseDto.setExtensionKey(user.getAccessToken());
		}

		// 활성화된 레포 카운트
		Integer activeRepoCnt = 0;

		// 총 경험치 조회
		Long totalExp = 0L;
		List<ActiveRepoEntity> activeRepoEntityList = activeRepoRepository.findAllByUser(user);
		LocalDateTime updateTime = null;
		for (ActiveRepoEntity activeRepo : activeRepoEntityList) {
			LocalDateTime updatedAt = activeRepo.getUpdatedAt();
			if(updateTime == null || updateTime.isBefore(updatedAt)){
				updateTime = updatedAt;
			}

			RepoEntity repo = activeRepo.getRepo();
			totalExp = repo.getIsActive() ? totalExp + repo.getRepoExp() : totalExp;

			if (repo.getIsActive() && repo.getRepomon().getRepomonTier() != 0) {
				activeRepoCnt++;
			}

		}
		userResponseDto.setTotalExp(totalExp);
		userResponseDto.setActiveRepoCnt(activeRepoCnt);
		userResponseDto.setUpdateTime(updateTime);

		// 깃허브에 레포 정보 조회
		Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(user.getUserName());
		user.getRepresentRepo().ifPresent(activeRepoEntity -> {
			GHRepository ghRepository = repositories.get(activeRepoEntity.getRepo().getRepoKey());
			RepoDetail repoDetail = ActiveRepoEntity.convertToRepo(activeRepoEntity, ghRepository);
			RepoEntity repo = repoDetail.getRepoEntity();
			Long repoRank = rankService.getRepoRank(repo);
			Long battleRank = rankService.getRepomonRank(repo);
			userResponseDto.setRepresentRepo(UserResponseDto.RepresentRepo.fromEntity(repo, repoRank, battleRank));
		});

		// 유저 순위 조회
		userResponseDto.setUserRank(userRepository.findRankByUserId(userId));
		return userResponseDto;
	}


	/**
	 * 유저 카드 조회
	 *
	 * @param userId
	 * @return
	 */
	public UserRedisCardResponseDto getUserCard(Long userId) {
		//레디스에서 찾아보고 있으면 삭제
		userRedisCardRepository.findByUserId(userId).ifPresent(dto -> {
			userRedisCardRepository.delete(dto);
		});

		UserEntity user = userRepository.findById(userId).orElseThrow(() -> {throw new CustomException(NOT_FOUND_USER);});
		ActiveRepoEntity representActiveRepo = user.getRepresentRepo().orElseThrow(
			() -> new CustomException(NOT_FOUND_ACTIVE_REPOSITORY)
		);
		List<UserLanguageEntity> userLanguages = userLanguageRepository.findAllByUser(user);
		List<String> userLanguage = new ArrayList<>();
		if (null != userLanguages) {
			for (UserLanguageEntity item : userLanguages) {
				userLanguage.add(item.getLanguageCode());
			}
		}
		try {
			RepoEntity representRepo = representActiveRepo.getRepo();
			UserRedisCardResponseDto responseDto = UserRedisCardResponseDto.fromEntity(ghUtils.getUserCardInfo(user.getUserName()), user, representRepo, userLanguage);
			userRedisCardRepository.save(responseDto);
			return responseDto;

		} catch (IOException | InterruptedException e) {
			throw new CustomException(ErrorCode.DATA_BAD_REQUEST);
		}
	}

	public UserRedisCardResponseDto findUserCard(Long userId) {
		UserRedisCardResponseDto responseDto =  userRedisCardRepository.findByUserId(userId).orElseThrow(
				() -> {throw new CustomException(ErrorCode.NOT_FOUND_REPOSITORY);}
		);
		return responseDto;
	}


	public List<String> getUserRepoLanguage(Long userId) throws IOException {
		UserEntity user = userRepository.findById(userId).orElseThrow(
			() -> {throw new CustomException(ErrorCode.NOT_FOUND_USER);}
		);
		List<String> userLanguage = ghUtils.getLanguagesByUser(user.getUserName());
		return userLanguage;
	}

	public List<String> getUserRepoLanguageNow(Long userId){
		UserEntity user = userRepository.findById(userId).orElseThrow(
				() -> {throw new CustomException(ErrorCode.NOT_FOUND_USER);}
		);
		List<UserLanguageEntity> languageList = userLanguageRepository.findAllByUser(user);
		List<String> userLanguageNow = languageList.stream()
				.map(item -> item.getLanguageCode())
				.collect(Collectors.toList());
		return userLanguageNow;
	}

	public void modifyUserRepo(Long userId, RepoCardRequestDto requestDto) {
		UserEntity user = userRepository.findById(userId).orElseThrow(
			() -> {throw new CustomException(ErrorCode.NOT_FOUND_USER);}
		);
		List<UserLanguageEntity> languageList = userLanguageRepository.findAllByUser(user);

		if (null != languageList) {
			for (UserLanguageEntity item : languageList) {
				userLanguageRepository.delete(item);
			}
		}
		for (String item : requestDto.getLanguages()) {
			userLanguageRepository.save(UserLanguageEntity.of(item, user));
		}
	}

}
