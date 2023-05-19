package com.repomon.rocketdan.domain.user.service;


import com.repomon.rocketdan.domain.user.entity.UserEntity;
import com.repomon.rocketdan.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<UserEntity> user = userRepository.findByUserName(username);
		if (user.isEmpty()) {
			throw new UsernameNotFoundException(username);
		}
		return new User(user.get().getUserName(), "null", new ArrayList<>());
	}

	public UserDetails loadUserById(Long userId) throws UsernameNotFoundException {

		Optional<UserEntity> user = userRepository.findById(userId);
		if (user.isEmpty()) {
			throw new UsernameNotFoundException("유저 " + userId);
		}
		return new User(user.get().getUserName(), "null", new ArrayList<>());
	}

}
