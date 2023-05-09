package com.repomon.rocketdan.common;

import com.repomon.rocketdan.common.utils.GHUtils;
import com.repomon.rocketdan.domain.repo.repository.RepoRepository;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.kohsuke.github.GHRepository;
import org.springframework.stereotype.Component;

@Aspect @Slf4j
@Component
@RequiredArgsConstructor
public class GHUtilsAop {
    private Set<Long> usingUsers = new HashSet<>();
    private Set<Long> usingKeys = new HashSet<>();
    private final UserRepository userRepository;
    private final RepoRepository repoRepository;
    private final GHUtils ghUtils;

    @Around("@annotation(Retries)")
    public Object aroundRetriesAnno(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
        int retries = 10;

        while(retries-- > 0) {
            try {
                return proceedingJoinPoint.proceed();
            } catch (Exception e) {
                Thread.sleep(500L);
            }
        }
        throw new RuntimeException();
    }

    @Around("execution(* com.repomon.rocketdan.domain.repo.service.RepoService.modifyAllRepo(..))))")
    public Object useRepoIoInSearchAllRepo(ProceedingJoinPoint proceedingJoinPoint){
        log.info("사용중인 modifyAllRepo -> repoId 체크시작!!");
        List<Object> params = Arrays.asList((proceedingJoinPoint.getArgs()));
        log.info("Params => {}", params);

        Long userId = (Long) params.get(0);

        if(usingUsers.contains(userId)){
            log.warn("이미 탐색중인 유저입니다.");
            throw new CustomException(ErrorCode.NO_ACCESS);
        }

        usingUsers.add(userId);

        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> {
            throw new CustomException(ErrorCode.NOT_FOUND_USER);
        });

        Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(
            userEntity.getUserName());

        Set<Long> repoIds = new HashSet<>();
        repositories.keySet().forEach(repoKey -> {
            repoRepository.findByRepoKey(repoKey).ifPresent(repoEntity -> {
                Long repoId = repoEntity.getRepoId();
                if(usingKeys.contains(repoId)){
                    log.warn("이미 사용중인 repoId 입니다.");
                    throw new CustomException(ErrorCode.NO_ACCESS);
                }

                repoIds.add(repoId);
            });
        });

        try {
            usingKeys.addAll(repoIds);

            return proceedingJoinPoint.proceed();
        }catch(Throwable throwable){
            throw new RuntimeException();
        }finally {
            usingKeys.removeAll(repoIds);
            usingUsers.remove(userId);
            log.info("사용중인  modifyAllRepo -> repoId 체크 끝!!");
        }
    }

    @Around("execution(* com.repomon.rocketdan.domain.repo.service.RepoService.modifyRepoInfo(..)) || "
        + "execution(* com.repomon.rocketdan.domain.repo.service.RepoService.RepoCardDetail(..)) || "
        + "execution(* com.repomon.rocketdan.domain.repo.service.RepoService.RepoPersonalCardDetail(..))")
    public Object useRepoIoInSearch(ProceedingJoinPoint proceedingJoinPoint) {
        log.info("사용중인 repoId 체크시작!!");
        List<Object> params = Arrays.asList((proceedingJoinPoint.getArgs()));
        log.info("Params => {}", params);

        Long repoId = (Long) params.get(0);

        if(usingKeys.contains(repoId)){
            log.warn("이미 사용중인 repoId 입니다.");
            throw new CustomException(ErrorCode.NO_ACCESS);
        }

        try {
            usingKeys.add(repoId);
            return proceedingJoinPoint.proceed();
        }catch(Throwable throwable){
            throw new RuntimeException();
        }finally {
            usingKeys.remove(repoId);
            log.info("사용중인 repoId 체크 끝!!");
        }
    }
}
