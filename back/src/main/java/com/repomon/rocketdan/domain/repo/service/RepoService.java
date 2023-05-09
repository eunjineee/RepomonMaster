package com.repomon.rocketdan.domain.repo.service;


import com.repomon.rocketdan.common.utils.GHUtils;
import com.repomon.rocketdan.common.utils.SecurityUtils;
import com.repomon.rocketdan.domain.repo.app.RepoDetail;
import com.repomon.rocketdan.domain.repo.dto.request.RepoCardRequestDto;
import com.repomon.rocketdan.domain.repo.dto.request.RepoConventionRequestDto;
import com.repomon.rocketdan.domain.repo.dto.request.RepoPeriodRequestDto;
import com.repomon.rocketdan.domain.repo.dto.response.*;
import com.repomon.rocketdan.domain.repo.entity.*;
import com.repomon.rocketdan.domain.repo.repository.*;
import com.repomon.rocketdan.domain.repo.repository.redis.RepoRedisContributeRepository;
import com.repomon.rocketdan.domain.repo.repository.redis.RepoRedisConventionRepository;
import com.repomon.rocketdan.domain.repo.repository.redis.RepoRedisListRepository;
import com.repomon.rocketdan.domain.repomon.entity.RepomonStatusEntity;
import com.repomon.rocketdan.domain.repomon.repository.RepomonStatusRepository;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.domain.user.service.RankService;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kohsuke.github.GHCommit;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GHRepositoryStatistics;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class RepoService {

	private final GHUtils ghUtils;
	private final RankService rankService;
	private final UserRepository userRepository;
	private final RepoRepository repoRepository;
	private final RepomonRepository repomonRepository;
	private final RepomonStatusRepository repomonStatusRepository;
	private final RepoHistoryRepository repoHistoryRepository;
	private final RepoConventionRepository conventionRepository;
	private final ActiveRepoRepository activeRepoRepository;
	private final PersonalLanguageRepository languageRepository;

	// redis repository
	private final RepoRedisListRepository redisListRepository;
	private final RepoRedisContributeRepository redisContributeRepository;
	private final RepoRedisConventionRepository redisConventionRepository;


	/**
	 * 레포 전체 조회
	 *
	 * @param userId
	 * @param pageable
	 * @return
	 */
	public RepoListResponseDto getUserRepoList(Long userId, Pageable pageable) {
		UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_USER);
		});

		String userName = userEntity.getUserName();

		PageRequest redisPageable = PageRequest.of(pageable.getPageNumber(), 1);
		List<RepoListResponseDto> dtoList = redisListRepository.findByUserName(userName, redisPageable);
		RepoListResponseDto responseDto = dtoList.isEmpty() ?
			RepoListResponseDto.empty(userName) :
			dtoList.get(0);

		if (responseDto.getRepoListItems().size() < pageable.getPageSize()) {
			Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(userName);

			Page<ActiveRepoEntity> activeRepoPage = activeRepoRepository.findByUser(userEntity,
				pageable);
			List<RepoDetail> repoDetails = activeRepoPage.stream()
				.map(activeRepoEntity -> {
					RepoEntity repoEntity = activeRepoEntity.getRepo();
					GHRepository ghRepository = repositories.get(repoEntity.getRepoKey());
					return ActiveRepoEntity.convertToRepo(activeRepoEntity, ghRepository);
				}).collect(Collectors.toList());

			long totalElements = activeRepoPage.getTotalElements();
			int totalPages = activeRepoPage.getTotalPages();

			responseDto.updateFromDetails(repoDetails, totalElements, totalPages);

			if (responseDto.getId() == null) {
				redisListRepository.save(responseDto);
			}
		}

		return responseDto;
	}


	/**
	 * 레포 상세 조회
	 * 레포 이름, 스타, 포크 수
	 * 레포몬 이름, 레포 시작날짜, 종료날짜
	 * 경험치, 랭킹, 성장요소 ( 히스토리 분석 ), 히스토리
	 *
	 * @param repoId
	 * @return
	 */
	public RepoResponseDto getUserRepoInfo(Long repoId, Long userId) {
		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		UserEntity userEntity = userId != null ? userRepository.findById(userId).orElseThrow(()->{
			throw new CustomException(ErrorCode.NOT_FOUND_USER);
		}) : null;

		String repoOwner = repoEntity.getRepoOwner();
		Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(repoOwner);

		String repoKey = repoEntity.getRepoKey();
		GHRepository ghRepository = repositories.get(repoKey);
		if (ghRepository == null) {
			throw new CustomException(ErrorCode.NOT_FOUND_PUBLIC_REPOSITORY);
		}

		boolean myRepo = userEntity == null ? false : activeRepoRepository.existsByUserAndRepo(userEntity, repoEntity);

		return RepoResponseDto.fromEntityAndGHRepository(repoEntity, ghRepository, myRepo);
	}


	/**
	 * 레포 분석 조회
	 * 경험치, 랭킹
	 * 커밋, 머지, 이슈, 리뷰, 보안성, 효율성
	 * 레포 히스토리 데이터 내려주기
	 *
	 * @param repoId
	 * @return
	 */
	public RepoResearchResponseDto getRepoResearchInfo(Long repoId) {
		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		Long rank = rankService.getRepoRank(repoEntity);

		List<RepoHistoryEntity> historyEntityList = repoHistoryRepository.findAllByRepo(repoEntity);

		return RepoResearchResponseDto.fromHistoryAndRank(historyEntityList, rank, repoEntity.getRepoExp());
	}


	/**
	 * 레포 배틀 조회
	 * 레이팅, 랭킹, 승, 패
	 * 능력치 내려주기
	 *
	 * @param repoId
	 * @return
	 */

	public RepoBattleResponseDto getRepoBattleInfo(Long repoId) {
		RepomonStatusEntity repomonStatusEntity = repomonStatusRepository.findByRepoId(repoId)
			.orElseThrow(() -> {
				throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
			});

		Long rank = rankService.getRepomonRank(repomonStatusEntity);

		return RepoBattleResponseDto.fromStatusEntity(repomonStatusEntity, rank);
	}


	/**
	 * 레포 컨벤션 조회
	 * 현재 등록된 컨벤션 목록
	 * 컨벤션 준수율 내려주기
	 *
	 * @param repoId
	 * @return
	 */
	public RepoConventionResponseDto getRepoConventionInfo(Long repoId) {
		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		RepoConventionResponseDto responseDto = redisConventionRepository.findByRepoId(repoId)
			.orElseGet(() -> findConventionDtoWithGHApi(repoEntity));

		for(int retries = 5; retries > 0 && responseDto.getConventions().isEmpty(); retries--){
			responseDto = findConventionDtoWithGHApi(repoEntity);
		}

		return responseDto;
	}


	/**
	 * 레포 기여도 조회
	 * 작성한 코드 수 or 커밋 수로 통계 내려주기
	 *
	 * @param repoId
	 * @return
	 */
	public RepoContributeResponseDto getRepoContributeInfo(Long repoId) {
		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		RepoContributeResponseDto responseDto = redisContributeRepository.findByRepoId(repoId)
			.orElseGet(() -> findContributeDtoWithGHApi(repoEntity));

		for(int retries = 5; retries > 0 && responseDto.getCommitters().isEmpty(); retries--){
			redisContributeRepository.delete(responseDto);
			responseDto = findContributeDtoWithGHApi(repoEntity);
		}

		return responseDto;
	}


	/**
	 * 모든 레포 정보 갱신
	 */
	public void modifyAllRepo(Long userId){
		UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_USER);
		});

		String userName = userEntity.getUserName();
		Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(userName);
		saveAndUpdateRepo(repositories, userEntity);
	}

	/**
	 * 레포 정보 갱신
	 *
	 * @param repoId
	 */
	public void modifyRepoInfo(Long repoId) {
		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		List<ActiveRepoEntity> activeRepoEntities = activeRepoRepository.findAllByRepo(repoEntity);
		List<UserEntity> userEntities = activeRepoEntities.stream()
			.map(entity -> entity.getUser())
			.collect(Collectors.toList());

		String repoOwner = repoEntity.getRepoOwner();
		Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(repoOwner);

		String repoKey = repoEntity.getRepoKey();
		GHRepository ghRepository = repositories.get(repoKey);
		if (ghRepository == null) {
			throw new CustomException(ErrorCode.NOT_FOUND_PUBLIC_REPOSITORY);
		}

		updateRepositoryInfo(repoEntity, ghRepository, userEntities);
	}


	/**
	 * 레포 기간 설정
	 *
	 * @param repoId
	 * @param requestDto
	 */
	public void modifyRepoPeriod(Long repoId, RepoPeriodRequestDto requestDto) {

		String userName = SecurityUtils.getCurrentUserId();

		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		if (!repoEntity.getRepoOwner().equals(userName)) {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

		LocalDateTime startedAt = requestDto.getStartedAt();
		LocalDateTime endAt = requestDto.getEndAt();
		repoEntity.updatePeriod(startedAt, endAt);
	}


	/**
	 * 레포 컨벤션 등록
	 *
	 * @param repoId
	 * @param requestDto
	 */
	public void modifyRepoConvention(Long repoId, RepoConventionRequestDto requestDto) {

		String userName = SecurityUtils.getCurrentUserId();

		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		if (!repoEntity.getRepoOwner().equals(userName)) {
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

		List<RepoConventionEntity> entities = requestDto.toEntities(repoEntity);
		conventionRepository.saveAll(entities);
	}


	/**
	 * 레포 활성화
	 *
	 * @param repoId
	 */
	public void activateRepo(Long repoId) {
		String userName = SecurityUtils.getCurrentUserId();

		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		if(!repoEntity.getRepoOwner().equals(userName)){
			throw new CustomException(ErrorCode.NO_ACCESS);
		}

		List<ActiveRepoEntity> allByRepo = activeRepoRepository.findAllByRepo(repoEntity);
		List<UserEntity> userEntities = allByRepo.stream()
			.map(activeRepoEntity -> activeRepoEntity.getUser()).collect(Collectors.toList());

		Long repoExp = repoEntity.getRepoExp();
		if (repoEntity.getIsActive()) {
			repoExp = -repoExp;
			repoEntity.deActivate();
		} else {
			repoEntity.activate();
		}

		for(UserEntity userEntity : userEntities){
			userEntity.updateTotalExp(repoExp);
		}
	}


	private void saveAndUpdateRepo(Map<String, GHRepository> repositories, UserEntity userEntity) {
		repositories.forEach((repoKey, ghRepository) -> {
			repoRepository.findByRepoKey(repoKey).ifPresentOrElse(repoEntity -> {
					updateRepositoryInfo(repoEntity, ghRepository, List.of(userEntity));
				},
				() -> {
					Long eggId = 9995L + (new Random().nextInt(5));
					RepomonEntity repomonEntity = repomonRepository.findById(eggId)
						.orElseThrow(() -> {
							throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
						});

					String orgName = ghRepository.getOwnerName();
					if(!orgName.equals(userEntity.getUserName())){
						orgName = ghUtils.getOrganizationFirstOwner(orgName);
					}

					RepomonStatusEntity repomonStatusEntity = RepomonStatusEntity.fromGHRepository(orgName, ghRepository, repomonEntity);
					repomonStatusRepository.save(repomonStatusEntity);
					activeRepoRepository.save(ActiveRepoEntity.of(userEntity, repomonStatusEntity));


					Calendar calendar = Calendar.getInstance();
					calendar.add(Calendar.YEAR, -1);
					Date date = calendar.getTime();

					initRepositoryInfo(repomonStatusEntity, ghRepository, date);
				});
		});
	}


	private RepoContributeResponseDto findContributeDtoWithGHApi(RepoEntity repoEntity) {
		Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(repoEntity.getRepoOwner());

		String repoKey = repoEntity.getRepoKey();
		GHRepository ghRepository = repositories.get(repoKey);
		if (ghRepository == null) {
			throw new CustomException(ErrorCode.NOT_FOUND_PUBLIC_REPOSITORY);
		}

		try {
			GHRepositoryStatistics statistics = ghRepository.getStatistics();
			long totalLineCount = ghUtils.getTotalLineCount(statistics);
			Map<String, Integer> commitCountMap = ghUtils.getCommitterInfoMap(statistics);

			String mvp = null;

			int totalCommitCount = 0;
			while(totalCommitCount == 0 && !commitCountMap.isEmpty()) {
				totalCommitCount = ghUtils.getTotalCommitCount(statistics);
			}

			for (String user : commitCountMap.keySet()) {
				if (mvp == null || commitCountMap.get(user) > commitCountMap.get(mvp)) {
					mvp = user;
				}
			}

			RepoContributeResponseDto responseDto = RepoContributeResponseDto.of(totalCommitCount, totalLineCount, commitCountMap, mvp, repoEntity);

			redisContributeRepository.save(responseDto);
			return responseDto;
		} catch (IOException e) {
			throw new RuntimeException(e);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
	}


	private RepoConventionResponseDto findConventionDtoWithGHApi(RepoEntity repoEntity) {
		List<RepoConventionEntity> conventions = conventionRepository.findAllByRepo(repoEntity);

		int totalCnt = 0;
		int collectCnt = 0;
		if (!conventions.isEmpty()) {
			log.info("컨벤션 분석 시작");

			Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(repoEntity.getRepoOwner());

			GHRepository ghRepository = repositories.get(repoEntity.getRepoKey());
			if (ghRepository == null) {
				throw new CustomException(ErrorCode.NOT_FOUND_PUBLIC_REPOSITORY);
			}

			try {
				List<GHCommit> ghCommits = ghRepository.listCommits().toList();
				for (GHCommit commit : ghCommits) {
					if (commit.getParentSHA1s().size() > 1) continue;

					totalCnt++;
					String message = commit.getCommitShortInfo().getMessage();

					boolean present = conventions.stream().anyMatch(convention -> {
						String prefix = convention.getRepoConventionType();
						return message.startsWith(prefix);
					});

					if (present) {
						collectCnt++;
					}
				}
			} catch (IOException e) {
				throw new RuntimeException(e);
			}

			log.info("컨벤션 분석 끝");
		}

		RepoConventionResponseDto responseDto = RepoConventionResponseDto.fromEntities(repoEntity, conventions, totalCnt, collectCnt);
		redisConventionRepository.save(responseDto);
		return responseDto;
	}


	private Long initRepositoryInfo(RepoEntity repoEntity, GHRepository ghRepository, Date fromDate) {
		log.info("레포지토리 분석 시작 => {}", repoEntity.getRepoName());
		try {
			List<RepoHistoryEntity> list = new ArrayList<>();

			GHRepositoryStatistics statistics = ghRepository.getStatistics();
			list.addAll(ghUtils.GHCommitToHistory(statistics, repoEntity, fromDate));
			list.addAll(ghUtils.GHPullRequestToHistory(ghRepository, repoEntity, fromDate));
			list.addAll(ghUtils.GHIssueToHistory(ghRepository, repoEntity, fromDate));
			list.addAll(ghUtils.GHForkToHistory(ghRepository, repoEntity, fromDate));
			list.addAll(ghUtils.GHStarToHistory(ghRepository, repoEntity, fromDate));

			Long totalExp = 0L;
			for (RepoHistoryEntity item : list) {
				totalExp += item.getRepoHistoryExp();
			}

			repoEntity.updateExp(totalExp);
			repoHistoryRepository.saveAll(list);

			log.info("레포지토리 분석 종료 => {}", repoEntity.getRepoName());

			checkRepomonEvolution(repoEntity);

			return totalExp;
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}
	}


	private void updateRepositoryInfo(RepoEntity repoEntity, GHRepository ghRepository, List<UserEntity> userEntities) {
		log.info("기존 레포지토리 업데이트 시작 => {}", repoEntity.getRepoName());

		repoHistoryRepository.findFirstByRepoOrderByWorkedAtDesc(repoEntity).ifPresentOrElse(historyEntity -> {
			LocalDate workedAt = historyEntity.getWorkedAt();
			Date workDate = Date.from(workedAt.atStartOfDay(ZoneId.systemDefault()).toInstant());

			Calendar instance = Calendar.getInstance();
			instance.setTime(workDate);
			instance.add(Calendar.DATE, 1);

			Long exp = initRepositoryInfo(repoEntity, ghRepository, Date.from(instance.toInstant()));

			if(repoEntity.getIsActive()) {
				userEntities.forEach(userEntity -> userEntity.updateTotalExp(exp));
			}
		}, () -> {
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.YEAR, -1);
			Date date = calendar.getTime();
			Long exp = initRepositoryInfo(repoEntity, ghRepository, date);

			if(repoEntity.getIsActive()) {
				userEntities.forEach(userEntity -> userEntity.updateTotalExp(exp));
			}
		});

		log.info("기존 레포지토리 업데이트 종료 => {}", repoEntity.getRepoName());

	}


	/**
	 * 레포몬 관련
	 */

	public void checkRepomonEvolution(RepoEntity repoEntity) {
		log.info("======================== 진화 여부 확인 ============================");
		RepomonEntity repomon = repoEntity.getRepomon();
		if ((repomon.getRepomonTier() == 1 && repoEntity.getRepoExp() >= 5000) || (repomon.getRepomonTier() == 2 && repoEntity.getRepoExp() >= 10000)) {
			log.info("========================== 레포몬 진화 =========================");
			RepomonEntity newRepomon = repomonRepository.findByRepomonTierAndRepomonName(repomon.getRepomonTier() + 1, repomon.getRepomonName()).orElseThrow(
				() -> new CustomException(ErrorCode.NOT_FOUND_ENTITY)
			);
			repoEntity.updateRepomon(newRepomon);
		}
		log.info("======================== 진화 여부 확인 종료 ============================");
	}


	public Boolean checkRepomonNickname(String nickName) {
		return repoRepository.existsByRepomonNickname(nickName);
	}


	public RepomonSelectResponseDto createSelectRepomon() {
		List<RepomonEntity> repomonList = repomonRepository.findTop3ByRandom();
		return RepomonSelectResponseDto.createSelectRepomon(repomonList);
	}

	public void modifyPersonalRepo(Long repoId, RepoCardRequestDto requestDto){
		String userName = SecurityUtils.getCurrentUserId();
		UserEntity user = userRepository.findByUserName(userName).orElseThrow(
				() -> {throw new CustomException(ErrorCode.NOT_FOUND_USER);}
		);
		RepoEntity repo = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});
		ActiveRepoEntity activeRepoEntity = activeRepoRepository.findByRepoAndUser(repo, user).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		List<PersonalLanguageEntity> pastLanguage = languageRepository.findAllByActiveRepoEntity(activeRepoEntity);
		if (null != pastLanguage){
			for (PersonalLanguageEntity item : pastLanguage){
				languageRepository.delete(item);
			}
		}
		for (String item : requestDto.getLangueges()) {
			languageRepository.save(PersonalLanguageEntity.of(item, activeRepoEntity));
		}
	}

	/**
	 * 레포 card detail
	 */
	public RepoCardResponseDto RepoCardDetail(Long repoId) {
		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		String repoOwner = repoEntity.getRepoOwner();

		String repoKey = repoEntity.getRepoKey();
		Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(repoOwner);
		GHRepository ghRepository = repositories.get(repoKey);

		if (ghRepository == null) {
			throw new CustomException(ErrorCode.NOT_FOUND_PUBLIC_REPOSITORY);
		}
		//레포 기록 불러오기
		List<RepoHistoryEntity> historyEntityList = repoHistoryRepository.findAllByRepo(repoEntity);

		GHRepositoryStatistics statistics = ghRepository.getStatistics();

		//컨트리뷰터 수, Total Code 수
		int contributers = 0;
		long totalLineCount = 0;

		try {
			totalLineCount = ghUtils.getTotalLineCount(statistics);
			contributers = ghRepository.listContributors().toList().size();
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}

		//컨벤션 지킴율
		double conventionrate = 0;
		RepoConventionResponseDto conventionDto = getRepoConventionInfo(repoId);
		if (conventionDto.getTotalCnt() != 0 && conventionDto.getCollectCnt() != 0){
			conventionrate = conventionDto.getCollectCnt()/conventionDto.getTotalCnt()*100;
		}

		return RepoCardResponseDto.fromEntityAndGHRepository(repoEntity, ghRepository, historyEntityList, totalLineCount, contributers, conventionrate);
	}

	/**
	 * 레포 personal card detail
	 */
	public RepoPersonalCardResponseDto RepoPersonalCardDetail(Long repoId, Long userId) throws IOException, InterruptedException {
		RepoEntity repoEntity = repoRepository.findById(repoId).orElseThrow(() -> {
			throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);
		});

		String repoOwner = repoEntity.getRepoOwner();

		String repoKey = repoEntity.getRepoKey();
		Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(repoOwner);
		GHRepository ghRepository = repositories.get(repoKey);

		if (ghRepository == null) {
			throw new CustomException(ErrorCode.NOT_FOUND_PUBLIC_REPOSITORY);
		}
		//레포 기록 불러오기
		List<RepoHistoryEntity> historyEntityList = repoHistoryRepository.findAllByRepo(repoEntity);

		GHRepositoryStatistics statistics = ghRepository.getStatistics();

        //컨트리뷰터 수, Total Code 수
        int contributers = 0;
        try {
            contributers = ghRepository.listContributors().toList().size();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        //유저 정보
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> {throw new CustomException(ErrorCode.NOT_FOUND_USER);});
        Map<String, String> userInfo = ghUtils.getUser(user.getUserName());

		//언어 설정
		ActiveRepoEntity activeRepo = activeRepoRepository.findByRepoAndUser(repoEntity, user).orElseThrow(()-> {throw new CustomException(ErrorCode.NOT_FOUND_ENTITY);});
		List<PersonalLanguageEntity> language = languageRepository.findAllByActiveRepoEntity(activeRepo);
		List<String> languages = new ArrayList<>();
		for (PersonalLanguageEntity item : language){
			languages.add(item.getLanguageCode());
		}

		//기여도
		RepoContributeResponseDto contributeResponse = redisContributeRepository.findByRepoId(repoId)
				.orElseGet(() -> findContributeDtoWithGHApi(repoEntity));

		//내 이슈, 머지, 리뷰 가져오기 >> 깃유틸에 넣기 째(getMyIssueToHistory)는 프라이빗, 예는 퍼블릭
		Integer myissue = 0;
		List<Integer> mymerges = new ArrayList<>();
		Optional<RepoHistoryEntity> repoHistoryOptional = repoHistoryRepository.findFirstByRepoOrderByWorkedAtDesc(repoEntity);
		if (repoHistoryOptional.isPresent()) {
			LocalDate workedAt = repoHistoryOptional.get().getWorkedAt();
			Date workDate = Date.from(workedAt.atStartOfDay(ZoneId.systemDefault()).toInstant());
			Calendar cal = Calendar.getInstance();
			cal.setTime(workDate);
			cal.add(Calendar.DATE, 1);
			myissue = ghUtils.getMyIssueToHistory(ghRepository, Date.from(cal.toInstant()), user.getUserName());
			mymerges = ghUtils.getMyMergeToHistory(ghRepository, Date.from(cal.toInstant()), user.getUserName());
		} else {
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.YEAR, -1);
			Date date = calendar.getTime();

			myissue = ghUtils.getMyIssueToHistory(ghRepository, date, user.getUserName());
			mymerges = ghUtils.getMyMergeToHistory(ghRepository, date, user.getUserName());
		}

		//내 코드 수
		Long mytotalcode = ghUtils.getLineCountWithUser(statistics, user.getUserName());

		//컨벤션 지킴율
		double conventionrate = 0;
		RepoConventionResponseDto conventionDto = getRepoConventionInfo(repoId);
		if (conventionDto.getTotalCnt() != 0 && conventionDto.getCollectCnt() != 0){
			conventionrate = conventionDto.getCollectCnt()/conventionDto.getTotalCnt()*100;
		}

		return RepoPersonalCardResponseDto.fromEntityAndGHRepository(repoEntity, ghRepository, historyEntityList, contributers, userInfo, contributeResponse, myissue ,mytotalcode, mymerges, conventionrate, languages);
	}
}
