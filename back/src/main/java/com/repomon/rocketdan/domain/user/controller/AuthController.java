package com.repomon.rocketdan.domain.user.controller;


import com.repomon.rocketdan.common.dto.AuthResponseDto;
import com.repomon.rocketdan.domain.user.dto.request.ExtensionUserRequestDto;
import com.repomon.rocketdan.domain.user.dto.response.ExtensionUserResponseDto;
import com.repomon.rocketdan.domain.user.service.AuthService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;


    /**
     * @param authHeader
     * @return
     */
    @ApiOperation(value = "로그아웃")
    @GetMapping("/logout")
    public ResponseEntity logout(@RequestHeader("Authorization") String authHeader) {

        String refreshToken = authHeader.replace("Bearer ", "");

        authService.logout(refreshToken);
        return ResponseEntity.ok().build();
    }


    /**
     *
     * @param accessToken
     * @param refreshToken
     * @return
     */
    @ApiOperation(value = "Access 토큰 재발급")
    @PostMapping("/refresh")
    public ResponseEntity reissueJWT(@RequestHeader("accessToken") String accessToken, @RequestHeader("refreshToken") String refreshToken){

        AuthResponseDto authResponseDto = authService.refresh(accessToken, refreshToken);

        return ResponseEntity.ok().headers(httpHeaders -> {
            httpHeaders.add("accessToken", authResponseDto.getAccessToken());
            httpHeaders.add("refreshToken", authResponseDto.getRefreshToken());
        }).build();
    }

    @ApiOperation(value = "Extension 로그인")
    @PostMapping("/ex")
    public ResponseEntity extensionLogin(@RequestBody ExtensionUserRequestDto requestDto){
        ExtensionUserResponseDto responseDto = authService.exLogin(requestDto);
        return ResponseEntity.ok(responseDto);
    }
}
