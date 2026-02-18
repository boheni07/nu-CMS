package com.nucms.cms.mapper;

import com.nucms.cms.model.CmsBoardMasterVO;
import com.nucms.cms.model.CmsBoardPostVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * CMS 게시판 관리 Mapper 인터페이스
 */
@Mapper
public interface CmsBoardMapper {

    /* 게시판 마스터 관련 */
    List<CmsBoardMasterVO> selectBoardMasterList(CmsBoardMasterVO vo);
    CmsBoardMasterVO selectBoardMasterDetail(CmsBoardMasterVO vo); // 추가
    CmsBoardMasterVO selectBoardMaster(String bbsId);
    void insertBoardMaster(CmsBoardMasterVO vo);
    void updateBoardMaster(CmsBoardMasterVO vo);
    void deleteBoardMaster(String bbsId);

    /* 게시글 관련 */
    List<CmsBoardPostVO> selectBoardPostList(CmsBoardPostVO vo);
    CmsBoardPostVO selectBoardPost(Long nttId);
    void insertBoardPost(CmsBoardPostVO vo);
    void updateBoardPost(CmsBoardPostVO vo);
    void deleteBoardPost(Long nttId);
    void updateRdcnt(Long nttId);

    /* 전역 검색 */
    List<CmsBoardPostVO> selectGlobalSearchList(String keyword);
}
