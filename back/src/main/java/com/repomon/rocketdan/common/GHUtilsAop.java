package com.repomon.rocketdan.common;

import com.repomon.rocketdan.common.utils.GHUtils;
import com.repomon.rocketdan.common.utils.SecurityUtils;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
@Component
@Aspect @Slf4j @Order(10)
@RequiredArgsConstructor
public class GHUtilsAop {
    private Set<Long> usingUsers = new HashSet<>();
    private Set<Long> usingKeys = new HashSet<>();


    @Value("${github.accessToken}")
    private String accessToken;
    private final UserRepository userRepository;
    private final RepoRepository repoRepository;
    private final GHUtils ghUtils;

    @Around("execution(* com.repomon.rocketdan.common.utils.GHUtils.*(..))" +
        "&& !@annotation(com.repomon.rocketdan.common.NotAop)")
    public Object aroundRetriesAnno(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String methodName = proceedingJoinPoint.getSignature().getName();
        try {
            String userName = SecurityUtils.getCurrentOrAnonymousUser();

            log.info("Request userName => {}", userName);
            if(userName.equals("anonymousUser")){
                ghUtils.initGitHub(accessToken);
            }else {
                String gitHubLogin = ghUtils.getLoginUser();
                log.info("GitHub userName => {}", gitHubLogin);
                if(!userName.equals(gitHubLogin)){
                    UserEntity userEntity = userRepository.findByUserName(userName).orElseThrow(() -> {
                        throw new CustomException(ErrorCode.NOT_FOUND_USER);
                    });

                    ghUtils.initGitHub(userEntity.getAccessToken());
                }
            }
            return proceedingJoinPoint.proceed();
        } catch (RuntimeException e) {
            return aroundRetriesAnno(proceedingJoinPoint);
        } finally {
            long finish = System.currentTimeMillis();
            long timeMs = finish - start;
            log.info("END: " + methodName + " " + (timeMs / 1000.0) + "s");
        }
    }

    @Around("execution(* com.repomon.rocketdan.domain.repo.service.RepoService.modifyAllRepo(..)) ||"
        + "execution(* com.repomon.rocketdan.domain.user.service.UserService.getUserCard(..))")
    public Object useRepoIoInSearchAllRepo(ProceedingJoinPoint proceedingJoinPoint) throws Throwable{
        log.info("사용중인 {} -> repoId 체크시작!!", proceedingJoinPoint.getSignature().getName());
        List<Object> params = Arrays.asList((proceedingJoinPoint.getArgs()));
        log.info("Params => {}", params);



        Long userId = (Long) params.get(0);
        Set<Long> repoIds = new HashSet<>();
        if(usingUsers.contains(userId)){
            log.warn("이미 탐색중인 유저입니다.");
            throw new CustomException(ErrorCode.ALREADY_WORKED);
        }

        try {

            usingUsers.add(userId);

            UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> {
                throw new CustomException(ErrorCode.NOT_FOUND_USER);
            });

            Map<String, GHRepository> repositories = ghUtils.getRepositoriesWithName(
                userEntity.getUserName());

            repositories.keySet().forEach(repoKey -> {
                repoRepository.findByRepoKey(repoKey).ifPresent(repoEntity -> {
                    Long repoId = repoEntity.getRepoId();
                    if(usingKeys.contains(repoId)){
                        log.warn("이미 사용중인 repoId 입니다.");
                        throw new CustomException(ErrorCode.ALREADY_WORKED);
                    }

                    repoIds.add(repoId);
                });
            });
            usingKeys.addAll(repoIds);

            return proceedingJoinPoint.proceed();
        }finally {
            usingKeys.removeAll(repoIds);
            usingUsers.remove(userId);
            log.info("사용중인  {} -> repoId 체크 끝!!", proceedingJoinPoint.getSignature().getName());
        }
    }

    @Around("execution(* com.repomon.rocketdan.domain.repo.service.RepoService.modifyRepoInfo(..)) || "
        + "execution(* com.repomon.rocketdan.domain.repo.service.RepoService.RepoCardDetail(..)) || "
        + "execution(* com.repomon.rocketdan.domain.repo.service.RepoService.RepoPersonalCardDetail(..))")
    public Object useRepoIoInSearch(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        log.info("사용중인 repoId 체크시작!!");
        List<Object> params = Arrays.asList((proceedingJoinPoint.getArgs()));
        log.info("Params => {}", params);

        Long repoId = (Long) params.get(0);

        if(usingKeys.contains(repoId)){
            log.warn("이미 사용중인 repoId 입니다.");
            throw new CustomException(ErrorCode.ALREADY_WORKED);
        }

        try {
            usingKeys.add(repoId);
            return proceedingJoinPoint.proceed();
        }finally {
            usingKeys.remove(repoId);
            log.info("사용중인 repoId 체크 끝!!");
        }
    }
}
