package com.repomon.rocketdan.domain.user.service;


import com.repomon.rocketdan.common.utils.GHUtils;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.repository.ActiveRepoRepository;
import com.repomon.rocketdan.domain.repo.repository.RepoRepository;
import com.repomon.rocketdan.domain.user.dto.response.RepoRankResponseDto;
import com.repomon.rocketdan.domain.user.dto.response.RepomonRankResponseDto;
import com.repomon.rocketdan.domain.user.dto.response.UserRankResponseDto;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RankService {

	private final UserRepository userRepository;
	private final RepoRepository repoRepository;
	private final ActiveRepoRepository activeRepoRepository;
	private final GHUtils ghUtils;


	/**
	 * 유저 랭킹 조회(활성 레포 총 경험치 합)
	 *
	 * @param search   : 유저이름 포함 문자열
	 * @param pageable : 페이지네이션 size, page
	 * @return
	 */
	public Page<UserRankResponseDto> getUserRankList(String search, Pageable pageable) {

		List<UserRankResponseDto> userRankResponseDtoList = new ArrayList<>();
		Page<UserEntity> userEntityList = search.isEmpty() ? userRepository.findAll(pageable) : userRepository.findByUserNameContaining(search, pageable);

		for (UserEntity user : userEntityList) {
			Long activeRepoCount = activeRepoRepository.countByUserAndRepoIsActive(user, true);
			Long userRank = getUserRank(user);
			String avatarUrl = ghUtils.getUser(user.getUserName()).get("avatarUrl");
			userRankResponseDtoList.add(UserRankResponseDto.fromEntity(user, activeRepoCount, userRank, avatarUrl));
		}
		return new PageImpl<>(userRankResponseDtoList, pageable, userEntityList.getTotalElements());
	}


	/**
	 * 레포 랭킹 조회(경험치)
	 *
	 * @param search   : 레포이름 포함 문자열
	 * @param pageable : 페이지네이션 size, page
	 * @return
	 */
	public Page<RepoRankResponseDto> getRepoRankList(String search, Pageable pageable) {

		List<RepoRankResponseDto> repoRankResponseDtoList = new ArrayList<>();
		Page<RepoEntity> repoEntityList = search.isEmpty() ? repoRepository.findByIsActiveTrue(pageable) : repoRepository.findByRepoNameContainingAndIsActiveTrue(search, pageable);

		for (RepoEntity repo : repoEntityList) {
			Long repoRank = getRepoRank(repo);
			repoRankResponseDtoList.add(RepoRankResponseDto.fromEntity(repo, repoRank));
		}
		return new PageImpl<>(repoRankResponseDtoList, pageable, repoEntityList.getTotalElements());
	}


	/**
	 * 레포몬 랭킹 조회(레이팅)
	 *
	 * @param search   : 레포이름 포함 문자열
	 * @param pageable : 페이지네이션 size, page
	 * @return
	 */
	public Page<RepomonRankResponseDto> getRepomonRankList(String search, Pageable pageable) {

		List<RepomonRankResponseDto> repomonRankResponseDtoList = new ArrayList<>();
		Page<RepoEntity> repoEntityList = search.isEmpty() ? repoRepository.findByIsActiveTrue(pageable) : repoRepository.findByRepoNameContainingAndIsActiveTrue(search, pageable);

		for (RepoEntity repo : repoEntityList) {
			Long repomonRank = getRepomonRank(repo);
			repomonRankResponseDtoList.add(RepomonRankResponseDto.fromEntity(repo, repomonRank));
		}
		return new PageImpl<>(repomonRankResponseDtoList, pageable, repoEntityList.getTotalElements());
	}


	/**
	 * 유저 순위 구하기(총경험치)
	 *
	 * @param user
	 * @return
	 */
	private Long getUserRank(UserEntity user) {
		return userRepository.findRankByTotalExp(user.getTotalExp());
	}


	/**
	 * 레포 순위 구하기(경험치)
	 *
	 * @param repo
	 * @return
	 */
	public Long getRepoRank(RepoEntity repo) {
		return repoRepository.findRankByRepoExp(repo.getRepoExp());
	}


	/**
	 * 레포몬 순위 구하기
	 *
	 * @param repo
	 * @return
	 */
	public Long getRepomonRank(RepoEntity repo) {
		return repoRepository.findRankByRating(repo.getRating());
	}

}
