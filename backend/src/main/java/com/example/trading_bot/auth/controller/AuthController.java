package com.example.trading_bot.auth.controller;

import com.example.trading_bot.auth.dto.AuthRequest;
import com.example.trading_bot.auth.dto.LoginResponse;
import com.example.trading_bot.auth.dto.TokenResponse;
import com.example.trading_bot.auth.entity.User;
import com.example.trading_bot.auth.service.AuthService;
import com.example.trading_bot.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody AuthRequest.SignUp request) {
        User user = authService.registerLocalUser(request.getEmail(), request.getPassword(), request.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("회원가입이 완료되었습니다.", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody AuthRequest.SignIn request) {
        LoginResponse response = authService.loginLocal(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(ApiResponse.success("로그인이 완료되었습니다.", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(
            @RequestHeader("Authorization") String refreshToken) {
        TokenResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("토큰이 갱신되었습니다.", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = authService.getCurrentUserFromToken(authHeader);
        return ResponseEntity.ok(ApiResponse.success("사용자 정보를 조회했습니다.", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        authService.logoutFromToken(authHeader);
        return ResponseEntity.ok(ApiResponse.success("로그아웃이 완료되었습니다.", null));
    }
}
