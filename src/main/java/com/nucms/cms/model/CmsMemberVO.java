package com.nucms.cms.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * CMS 회원 VO 클래스
 */
@Getter
@Setter
public class CmsMemberVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 고유 ID (ESNTL_ID) */
    private String esntlId;

    /** 회원 ID (MBER_ID) */
    private String mberId;

    /** 회원 명 (MBER_NM) */
    private String mberNm;

    /** 비밀번호 (PASSWORD) */
    private String password;

    /** 이메일 주소 (EMAIL_ADRES) */
    private String emailAdres;

    /** 휴대폰 번호 (MBTLNUM) */
    private String mbtlnum;

    /** 회원 상태 코드 (MBER_STTUS_CODE) - A:정상, P:잠금, D:탈퇴, R:승인대기 */
    private String mberSttusCode;

    /** 본인인증 DI (DI_KEY) */
    private String diKey;

    /** 가입 시점 (FRST_REGIST_PNTTM) */
    private LocalDateTime frstRegistPnttm;

    /** 최종 수정 시점 (LAST_UPDT_PNTTM) */
    private LocalDateTime lastUpdtPnttm;

    /** 회원이 보유한 역할 목록 (Security 연동용) */
    private java.util.List<String> roleList;
}
