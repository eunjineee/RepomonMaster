package com.repomon.rocketdan.domain.user.entity;


import com.repomon.rocketdan.domain.repo.entity.ActiveRepoEntity;
import com.repomon.rocketdan.domain.repo.entity.PersonalLanguageEntity;
import lombok.*;

import javax.persistence.*;


@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "user_language")
public class UserLanguageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_language_id")
    private Long userLanguageId;

    private String languageCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public static UserLanguageEntity of(String languageCode, UserEntity user) {
        return UserLanguageEntity.builder()
                .languageCode(languageCode)
                .user(user)
                .build();
    }

}
