package com.nucms.cms.service;

import com.nucms.cms.model.CmsMemberVO;
import java.util.List;

/**
 * CMS 회원 관리 서비스 인터페이스
 */
public interface CmsMemberService {

    /** 회원 상세 조회 */
    CmsMemberVO getCmsMember(String esntlId);

    /** 회원 ID로 조회 (로그인용) */
    CmsMemberVO getCmsMemberById(String mberId);

    /** 회원 목록 조회 */
    List<CmsMemberVO> getCmsMemberList(CmsMemberVO vo);

    /** 회원 등록 (가입) */
    void registCmsMember(CmsMemberVO vo);

    /** 회원 정보 수정 */
    void modifyCmsMember(CmsMemberVO vo);

    /** 회원 상태 변경 (잠금, 탈퇴 등) */
    void modifyCmsMemberStatus(String esntlId, String status);

    /** 회원 역할 부여 및 수정 */
    void saveMemberRoles(String esntlId, List<String> roleCodes);
}
