package com.example.trading_bot.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthRequest {

    /**
     * 로그인 요청 DTO
     */
    @Data
    public static class SignIn {
        @Email(message = "유효한 이메일 형식이 아닙니다")
        @NotBlank(message = "이메일은 필수입니다")
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다")
        private String password;
    }

    /**
     * 회원가입 요청 DTO
     */
    @Data
    public static class SignUp {
        @Email(message = "유효한 이메일 형식이 아닙니다")
        @NotBlank(message = "이메일은 필수입니다")
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다")
        @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하여야 합니다")
        private String password;

        @NotBlank(message = "이름은 필수입니다")
        @Size(min = 1, max = 100, message = "이름은 1자 이상 100자 이하여야 합니다")
        private String name;
    }

}