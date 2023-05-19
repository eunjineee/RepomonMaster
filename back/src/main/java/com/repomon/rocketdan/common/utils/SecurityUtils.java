package com.repomon.rocketdan.common.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SecurityUtils {

    private static final String anonymousUser = "anonymousUser";

    public static String getCurrentUserId() {
        final Authentication authentication = SecurityContextHolder.getContext()
            .getAuthentication();
        if (authentication == null || authentication.getName().equals(anonymousUser)) {
            log.error("Security Context 에 인증 정보가 없습니다.");
            throw new BadCredentialsException("다시 로그인 해주세요");
        }
        return authentication.getName();
    }

    public static String getCurrentOrAnonymousUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
