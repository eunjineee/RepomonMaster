package com.repomon.rocketdan;

import java.time.ZoneId;
import java.util.TimeZone;
import javax.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication @Slf4j
public class RocketdanApplication {

	public static void main(String[] args) {
		SpringApplication.run(RocketdanApplication.class, args);
	}

}
