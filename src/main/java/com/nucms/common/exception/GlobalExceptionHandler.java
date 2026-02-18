package com.nucms.common.exception;

import com.nucms.common.model.CommonResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외 처리기
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CommonResponseDTO<String> handleException(Exception e) {
        log.error("Unhandled Exception: ", e);
        // 보안을 위해 상세한 시스템 에러 메시지 노출 최소화 (개발 중에는 상세 메시지 노출)
        return CommonResponseDTO.error(e.getClass().getSimpleName() + ": " + e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CommonResponseDTO<String> handleRuntimeException(RuntimeException e) {
        log.error("Runtime Exception: ", e);
        return CommonResponseDTO.error(e.getMessage());
    }
}
