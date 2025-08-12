package com.example.trading_bot.common.exception;

import com.example.trading_bot.common.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> details = new HashMap<>();
        details.put("reason", ex.getMessage());
        return ResponseEntity.badRequest()
                .body(ApiResponse.success("잘못된 요청", details));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        String summary = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest()
                .body(ApiResponse.success(summary, fieldErrors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleUnexpected(Exception ex) {
        log.error("Unexpected exception", ex);
        Map<String, String> details = new HashMap<>();
        details.put("exception", ex.getClass().getSimpleName());
        details.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.success("서버 오류가 발생했습니다.", details));
    }
}

// package com.example.trading_bot.common.exception;
//
// import com.example.trading_bot.common.dto.ApiResponse;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.MethodArgumentNotValidException;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;
//
// @Slf4j
// @RestControllerAdvice
// public class GlobalExceptionHandler {
//
// @ExceptionHandler(IllegalArgumentException.class)
// public ResponseEntity<ApiResponse<Void>>
// handleIllegalArgumentException(IllegalArgumentException ex) {
// return ResponseEntity.badRequest()
// .body(ApiResponse.error(ex.getMessage()));
// }
//
// @ExceptionHandler(MethodArgumentNotValidException.class)
// public ResponseEntity<ApiResponse<Void>>
// handleValidationException(MethodArgumentNotValidException ex) {
// return ResponseEntity.badRequest()
// .body(ApiResponse.error("입력값이 올바르지 않습니다."));
// }
//
// @ExceptionHandler(Exception.class)
// public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
// log.error("Unexpected exception: ", ex);
// return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
// .body(ApiResponse.error("서버 오류가 발생했습니다."));
// }
// }
