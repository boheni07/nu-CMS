package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsMemberVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * CMS 회원 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsMemberMapper {

    /** 회원 상세 조회 */
    CmsMemberVO selectCmsMember(String esntlId);

    /** 회원 ID로 조회 (로그인용) */
    CmsMemberVO selectCmsMemberById(String mberId);

    /** 회원 목록 조회 */
    List<CmsMemberVO> selectCmsMemberList(CmsMemberVO vo);

    /** 회원 등록 */
    int insertCmsMember(CmsMemberVO vo);

    /** 회원 수정 */
    int updateCmsMember(CmsMemberVO vo);

    /** 회원 상태 수정 (승인, 정지, 탈퇴 등) */
    int updateCmsMemberStatus(CmsMemberVO vo);

    /** 회원 삭제 (물리 삭제는 지양, 상태값 처리 권장) */
    int deleteCmsMember(String esntlId);

    /** 회원에게 역할 부여 */
    int insertMemberRole(java.util.Map<String, String> param);

    /** 회원의 모든 역할 삭제 */
    int deleteMemberRoles(String esntlId);

    /** 회원의 보유 역할 목록 조회 */
    List<String> selectMemberRoleList(String esntlId);
}
