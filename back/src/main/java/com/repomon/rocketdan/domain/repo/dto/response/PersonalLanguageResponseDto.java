package com.repomon.rocketdan.domain.repo.dto.response;


import com.repomon.rocketdan.domain.repo.entity.PersonalLanguageEntity;
import lombok.*;

import java.util.ArrayList;
import java.util.List;




@AllArgsConstructor
@Getter
@ToString
@Builder
public class PersonalLanguageResponseDto {


	public static PersonalLanguageResponseDto fromEntity(PersonalLanguageEntity personalLanguage) {
		return new PersonalLanguageResponseDto();
	}


	public static List<PersonalLanguageResponseDto> fromEntityList(List<PersonalLanguageEntity> personalLanguageList) {
		List<PersonalLanguageResponseDto> result = new ArrayList<>();
		for (PersonalLanguageEntity personalLanguage : personalLanguageList) {
			PersonalLanguageResponseDto personalLanguageResponseDto = PersonalLanguageResponseDto.fromEntity(personalLanguage);
			result.add(personalLanguageResponseDto);
		}
		return result;
	}
}
