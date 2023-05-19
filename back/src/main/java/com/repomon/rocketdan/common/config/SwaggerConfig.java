package com.repomon.rocketdan.common.config;

import com.fasterxml.classmate.TypeResolver;
import com.repomon.rocketdan.common.MyPageable;
import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Pageable;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.AlternateTypeRules;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.service.Server;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class SwaggerConfig {
    //	Swagger-UI 3.x 확인
    //	http://localhost:8080/{your-app-root}/swagger-ui/index.html
    @Bean
    public Docket api(TypeResolver typeResolver) {
        Server serverLocal = new Server("local", "http://localhost:8080", "local", Collections.emptyList(), Collections.emptyList());
        Server devServer = new Server("test", "https://repomon.kr", "dev", Collections.emptyList(), Collections.emptyList());
        return new Docket(DocumentationType.OAS_30)
            .servers(serverLocal, devServer)
            .alternateTypeRules(AlternateTypeRules.newRule(typeResolver.resolve(Pageable.class),
                typeResolver.resolve(MyPageable.class)))
            .useDefaultResponseMessages(false)
//                .host("repomon.net")
            .consumes(getConsumeContentTypes())
            .produces(getProduceContentTypes())
            .apiInfo(apiInfo())
            .groupName("Rocketdan")
            .securityContexts(Arrays.asList(securityContext()))
            .securitySchemes(Arrays.asList(apiKey()))
                .select()
            .apis(RequestHandlerSelectors.any())
            .paths(PathSelectors.any())
            .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder().title("REPOMON Service API")
                .description("E105 Project")
                .version("1.0").build();
    }

    private Set<String> getConsumeContentTypes() {
        Set<String> consumes = new HashSet<>();
        consumes.add("application/json;charset=UTF-8");
        consumes.add("application/x-www-form-urlencoded");
        return consumes;
    }

    private Set<String> getProduceContentTypes() {
        Set<String> produces = new HashSet<>();
        produces.add("application/json;charset=UTF-8");
        return produces;
    }

    private ApiKey apiKey() {
        return new ApiKey("Authorization", "Authorization", "header");
    }

    private SecurityContext securityContext() {
        return SecurityContext.builder().securityReferences(defaultAuth()).build();
    }

    List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope = new AuthorizationScope("global",
            "accessEverything");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return Arrays.asList(new SecurityReference("Authorization", authorizationScopes));
    }
}
