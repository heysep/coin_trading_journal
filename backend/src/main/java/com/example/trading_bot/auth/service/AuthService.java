package com.example.trading_bot.auth.service;

import com.example.trading_bot.auth.dto.LoginResponse;
import com.example.trading_bot.auth.dto.TokenResponse;
import com.example.trading_bot.auth.entity.ProviderType;
import com.example.trading_bot.auth.entity.Role;
import com.example.trading_bot.auth.entity.User;
import com.example.trading_bot.auth.jwt.JwtTokenProvider;
import com.example.trading_bot.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public User registerLocalUser(String email, String password, String name) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .name(name)
                .providerType(ProviderType.LOCAL)
                .role(Role.USER)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    public LoginResponse loginLocal(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return generateTokenResponse(user);
    }

    public TokenResponse refreshToken(String authHeader) {
        String refreshToken = extractTokenFromHeader(authHeader);
        validateToken(refreshToken);

        User user = userRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Refresh Token을 찾을 수 없습니다."));

        String newAccessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional(readOnly = true)
    public User getCurrentUserFromToken(String authHeader) {
        String token = extractTokenFromHeader(authHeader);
        validateToken(token);

        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        return findUserById(userId);
    }

    public void logoutFromToken(String authHeader) {
        String token = extractTokenFromHeader(authHeader);
        validateToken(token);

        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        User user = findUserById(userId);

        user.setRefreshToken(null);
        userRepository.save(user);
    }

    public LoginResponse processOAuth2User(String email, String name, String profileImageUrl,
                                           ProviderType providerType, String providerId) {
        Optional<User> existingUser = userRepository.findByProviderTypeAndProviderId(providerType, providerId);

        User user = existingUser
                .map(u -> updateOAuth2UserProfile(u, name, profileImageUrl))
                .orElseGet(() -> createOAuth2User(email, name, profileImageUrl, providerType, providerId));

        return generateTokenResponse(user);
    }

    @Transactional(readOnly = true)
    public User findById(Long userId) {
        return findUserById(userId);
    }

    private String extractTokenFromHeader(String authHeader) {
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("유효하지 않은 인증 헤더입니다.");
        }
        return authHeader.substring(7);
    }

    private void validateToken(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    private User createOAuth2User(String email, String name, String profileImageUrl,
                                  ProviderType providerType, String providerId) {
        User user = User.builder()
                .email(email)
                .name(name)
                .profileImageUrl(profileImageUrl)
                .providerType(providerType)
                .providerId(providerId)
                .role(Role.USER)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    private User updateOAuth2UserProfile(User user, String name, String profileImageUrl) {
        user.updateProfile(name, profileImageUrl);
        return userRepository.save(user);
    }

    private LoginResponse generateTokenResponse(User user) {
        String accessToken = jwtTokenProvider.createAccessToken(
                user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(user)
                .build();
    }
}