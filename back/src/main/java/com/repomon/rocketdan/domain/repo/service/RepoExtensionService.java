package com.repomon.rocketdan.domain.repo.service;

import com.repomon.rocketdan.domain.repo.dto.response.ExtensionRepoListResponseDto;
import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepoEntity;
import com.repomon.rocketdan.domain.repo.entity.RepomonEntity;
import com.repomon.rocketdan.domain.repo.repository.ActiveRepoRepository;
import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import com.repomon.rocketdan.exception.CustomException;
import com.repomon.rocketdan.exception.ErrorCode;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RepoExtensionService {

    private final UserRepository userRepository;
    private final ActiveRepoRepository activeRepoRepository;
    @Transactional
    public ExtensionRepoListResponseDto getRepoList(Long userId) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> {
            throw new CustomException(ErrorCode.NOT_FOUND_USER);
        });

        List<ActiveRepoEntity> activeRepoList = activeRepoRepository.findAllByUser(userEntity);
        List<RepoEntity> repoEntities = activeRepoList.stream()
            .filter(entity -> {
                RepoEntity repo = entity.getRepo();
                RepomonEntity repomon = repo.getRepomon();
                return repo.getIsActive() && repomon.getRepomonId() != 9999L;
            })
            .map(entity -> entity.getRepo())
            .collect(Collectors.toList());

        return ExtensionRepoListResponseDto.fromEntites(repoEntities);
    }
}
