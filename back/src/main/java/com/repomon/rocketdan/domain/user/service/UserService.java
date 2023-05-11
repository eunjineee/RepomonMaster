package com.repomon.rocketdan.domain.user.service;


import com.repomon.rocketdan.common.utils.GHUtils;
import com.repomon.rocketdan.common.utils.SecurityUtils;
import com.repomon.rocketdan.domain.repo.app.RepoDetail;
import com.repomon.rocketdan.domain.repo.dto.request.RepoCardRequestDto;
import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.repository.ActiveRepoRepository;
import com.repomon.rocketdan.domain.repo.repository.RepoRepository;
import com.repomon.rocketdan.domain.user.dto.request.RepresentRepomonRequestDto;
import com.repomon.rocketdan.domain.user.dto.response.UserCardResponseDto;
import com.repomon.rocketdan.domain.user.dto.response.UserResponseDto;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.entity.UserLanguageEntity;
import com.repomon.rocketdan.domain.user.repository.UserLanguageRepository;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.repomon.rocketdan.exception.ErrorCode.*;


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

		UserResponseDto userResponseDto = UserResponseDto.fromEntity(user, userInfo);

		// 활성화된 레포 카운트
		Integer activeRepoCnt = 0;

		// 총 경험치 조회
		Long totalExp = 0L;
		List<ActiveRepoEntity> activeRepoEntityList = activeRepoRepository.findAllByUser(user);
		for (ActiveRepoEntity activeRepo : activeRepoEntityList) {
			RepoEntity repo = activeRepo.getRepo();
			totalExp = repo.getIsActive() ? totalExp + repo.getRepoExp() : totalExp;

			if (repo.getIsActive() && repo.getRepomon().getRepomonTier() != 0) {
				activeRepoCnt++;
			}

		}
		userResponseDto.setTotalExp(totalExp);
		userResponseDto.setActiveRepoCnt(activeRepoCnt);

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
	public UserCardResponseDto getUserCard(Long userId) {
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
			return UserCardResponseDto.fromEntity(ghUtils.getUserCardInfo(user.getUserName()), user, representRepo, userLanguage);

		} catch (IOException | InterruptedException e) {
			throw new CustomException(ErrorCode.DATA_BAD_REQUEST);
		}
	}


	public List<String> getUserRepoLanguage(Long userId) throws IOException {
		UserEntity user = userRepository.findById(userId).orElseThrow(
			() -> {throw new CustomException(ErrorCode.NOT_FOUND_USER);}
		);
		List<String> userLanguage = ghUtils.getLanguagesByUser(user.getUserName());
		return userLanguage;
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
