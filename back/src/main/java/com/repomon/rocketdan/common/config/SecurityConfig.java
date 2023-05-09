package com.repomon.rocketdan.common.config;


import com.repomon.rocketdan.common.filter.JwtAuthFilter;
import com.repomon.rocketdan.common.filter.JwtExceptionFilter;
import com.repomon.rocketdan.common.handler.JwtAccessDeniedHandler;
import com.repomon.rocketdan.common.handler.OAuth2SuccessHandler;
import com.repomon.rocketdan.common.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig{
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final OAuth2SuccessHandler successHandler;
    private final CustomOAuth2UserService oAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource())
            .and()
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT 사용하니 session 생성 X
            .and()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)
            .and()
                .authorizeRequests()
                .antMatchers("/login/success").authenticated()
                .mvcMatchers(HttpMethod.PUT, "/repo/{repoId}/info/convention").authenticated()
                .antMatchers("/repo/{repoId}/info/period").authenticated()
                .antMatchers("/repomon/{repoId}/match", "/repomon/nickname", "/repomon/start", "/repomon/stat").authenticated()
                .antMatchers("/user/{userId}/represent").authenticated()
                .anyRequest().permitAll() // 그 외 요청은 모두 permitAll 처리
            .and()
                .addFilterBefore(jwtExceptionFilter, OAuth2LoginAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .oauth2Login()
                .userInfoEndpoint()
                    .userService(oAuth2UserService)
                    .and()// 여기서 oAuth 정보를 가져옴
                .successHandler(successHandler); // oAuth 정보를 가져오면 동작할 핸들러


        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("*");
//        configuration.addAllowedOrigin("https://repomon.kr");
        configuration.setAllowedMethods(List.of("HEAD","POST","GET","DELETE","PUT"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}
