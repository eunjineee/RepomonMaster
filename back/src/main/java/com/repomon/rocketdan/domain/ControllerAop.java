package com.repomon.rocketdan.domain;


import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;


@Slf4j
@Aspect
@Component
public class ControllerAop {

	// Controller로 끝나는 모든 파일에 적용
	@Pointcut("execution(* com.repomon.rocketdan.domain..*Controller.*(..))")
	private void controller() {}


	// 메서드가 실행되기 전 동작
	@Before("controller()")
	public void beforeRequest(JoinPoint joinPoint) {
		log.info("###Start request {}", joinPoint.getSignature().toShortString());
		Arrays.stream(joinPoint.getArgs())
			.map(Object::toString)
			.map(str -> "\t" + str)
			.forEach(log::info);
	}


	// 메서드가 return 값을 반환 후 동작
	@AfterReturning(pointcut = "controller()", returning = "returnValue")
	public void afterReturningLogging(JoinPoint joinPoint, Object returnValue) {
		log.info("###End request {}", joinPoint.getSignature().toShortString());

		if (returnValue == null) return;

		log.info("\t{}", returnValue);
	}


	// 에러 발생 시 동작
	@AfterThrowing(pointcut = "controller()", throwing = "e")
	public void afterThrowingLogging(JoinPoint joinPoint, Exception e) {
		log.error("###Occured error in request {}", joinPoint.getSignature().toShortString());
		log.error("\t{}", e.getMessage());
	}

}
