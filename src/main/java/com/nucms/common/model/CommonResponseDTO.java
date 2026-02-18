package com.nucms.common.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * 표준 응답 DTO
 */
@Getter
@Setter
@Builder
public class CommonResponseDTO<T> {

    /** 성공 여부 */
    private boolean success;
    
    /** 결과 메시지 */
    private String message;
    
    /** 데이터 객체 */
    private T data;

    /** 에러 코드 (선택사항) */
    private String errorCode;

    public static <T> CommonResponseDTO<T> success(T data) {
        return CommonResponseDTO.<T>builder()
                .success(true)
                .message("요청이 성공적으로 처리되었습니다.")
                .data(data)
                .build();
    }

    public static <T> CommonResponseDTO<T> success(String message, T data) {
        return CommonResponseDTO.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> CommonResponseDTO<T> error(String message) {
        return CommonResponseDTO.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
