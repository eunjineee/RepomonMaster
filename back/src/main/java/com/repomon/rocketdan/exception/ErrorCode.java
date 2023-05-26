package com.repomon.rocketdan.exception;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;


@Getter
@RequiredArgsConstructor
public enum ErrorCode {
	/* 404 */
	ERROR_NAME(NOT_FOUND, "에러 메세지 입니다")

	/* 409 CONFLICT : Resource 의 현재 상태와 충돌. 보통 중복된 데이터 존재 */,
	DUPLICATE_RESOURCE(CONFLICT, "데이터가 이미 존재합니다"),
	MISMATCH_REQUEST(BAD_REQUEST, "데이터 간 의미가 어긋납니다 (예: 공통코드와 대응되는 데이터)"),
	ALREADY_WORKED(CONFLICT, "이미 수행중인 작업입니다."),

	/* 400 BAD REQUEST : 잘못된 요청. 입력된 데이터에 문제가 있음 */
	DATA_BAD_REQUEST(BAD_REQUEST, "입력된 데이터에 문제가 있습니다."),
	DATA_CONVENTION_TOO_SHORT(BAD_REQUEST, "입력된 컨벤션이 너무 짧습니다."),
	NOT_ALLOW_EGG(BAD_REQUEST, "알은 허용되지 않는 접근입니다."),
	NOT_ACTIVE_REPO(BAD_REQUEST, "활성화되지 않은 레포입니다."),
	MESSAGE_REQUEST_ERROR(BAD_REQUEST, "입력된 메세지에 문제가 있습니다."),
	REPEATED_REQUEST(BAD_REQUEST, "반복된 요청입니다."),

	/* 401 UNAUTHORIZED : 권한 인증 문제. JWT 토큰과 관련된 에러 */
	UNAUTHORIZED_USER(UNAUTHORIZED, "권한이 허용되지 않은 유저입니다."),
	TOKEN_ERROR(UNAUTHORIZED, "토큰에 문제가 있습니다."),
	ACCESS_TOKEN_EXPIRED(UNAUTHORIZED, "토큰의 유효기간이 만료되었습니다."),
	ACCESS_TOKEN_NOT_FOUND(UNAUTHORIZED, "액세스 토큰이 존재하지 않습니다."),
	REFRESH_TOKEN_NOT_FOUND(UNAUTHORIZED, "리프레시 토큰이 존재하지 않습니다."),
	ACCESS_TOKEN_ERROR(UNAUTHORIZED, "액세스 토큰에 문제가 있습니다."),
	REFRESH_TOKEN_ERROR(UNAUTHORIZED, "리프레시 토큰에 문제가 있습니다."),

	/* 403 FORBIDDEN : 접근 권한 없음 */
	NO_ACCESS(FORBIDDEN, "페이지에 대한 접근 권한이 없습니다."),
	UNAUTHORIZED_REISSUE_TOKEN(FORBIDDEN, "토큰 재발급에 문제가 있습니다."),

	/* 404 NOT_FOUND : 대상이 존재하지 않음 */
	NOT_FOUND_PUBLIC_REPOSITORY(NOT_FOUND, "비공개 처리된 레포지토리입니다."),
	NOT_FOUND_REPOSITORY(NOT_FOUND, "해당 레포지토리가 존재하지 않습니다."),
	NOT_FOUND_ENTITY(NOT_FOUND, "엔티티가 존재하지 않습니다."),
	NOT_FOUND_USER(NOT_FOUND, "유저가 존재하지 않습니다."),
	NOT_FOUND_REPRESENT_REPOSITORY(NOT_FOUND, "대표 레포지토리가 존재하지 않습니다."),
	NOT_FOUND_ACTIVE_REPOSITORY(NOT_FOUND, "레포지토리가 활성화되지 않았습니다.");

	private final HttpStatus httpStatus;
	private final String message;
}